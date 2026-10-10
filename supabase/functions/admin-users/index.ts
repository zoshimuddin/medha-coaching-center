// Supabase Edge Function: admin-users
// Admin-only Auth user create/delete with service role, so the browser never
// swaps the admin's session during user management.
//
// Deploy (Supabase dashboard):
//   1. Edge Functions > Create a new function > name: admin-users > paste this file.
//   2. Edge Functions > Secrets > add SUPABASE_SERVICE_ROLE_KEY (Settings > API > service_role).
//   3. Leave "Verify JWT with Supabase Auth" ON.
//
// The app falls back to browser signUp if this function is not deployed.
// Only SUPABASE_SERVICE_ROLE_KEY is required here; the caller's JWT is verified
// through the service-role client's admin.getUser(jwt), so no anon key secret
// is needed and a missing SUPABASE_ANON_KEY no longer breaks user deletion.

import { createClient, type SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  if (req.method !== "POST") return json({ error: "method not allowed" }, 405);

  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!serviceKey) return json({ error: "missing SUPABASE_SERVICE_ROLE_KEY" }, 500);

  const origin = new URL(req.url).origin;
  const admin: SupabaseClient = createClient(origin, serviceKey);

  const authHeader = req.headers.get("Authorization") ?? "";
  const jwt = authHeader.replace(/^Bearer\s+/i, "");
  if (!jwt) return json({ error: "unauthorized" }, 401);
  const { data: { user }, error: verifyErr } = await admin.auth.getUser(jwt);
  if (verifyErr || !user) return json({ error: "unauthorized" }, 401);
  const { data: prof } = await admin.from("profiles").select("role").eq("id", user.id).maybeSingle();
  if (!prof || prof.role !== "admin") return json({ error: "forbidden" }, 403);

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return json({ error: "invalid body" }, 400);
  }

  if (body.action === "create") {
    const email = String(body.email ?? "").trim().toLowerCase();
    const password = String(body.password ?? "");
    const profile = (body.profile ?? {}) as Record<string, unknown>;
    const role = String(profile.role ?? "viewer");
    if (!email || password.length < 6) return json({ error: "Email and a 6+ character password are required. Supabase Auth rejects shorter passwords." }, 400);
    const assignable = ["admin", "subadmin", "editor", "viewer", "accountant", "teacher", "student"];
    if (!assignable.includes(role)) return json({ error: "invalid role" }, 400);

    const { data: created, error: createErr } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });
    if (createErr || !created.user) return json({ error: createErr?.message ?? "create failed" }, 400);

    const { error: profileErr } = await admin.from("profiles").upsert({
      id: created.user.id,
      username: String(profile.username ?? email),
      role,
      tabs: profile.tabs ?? ["dashboard"],
      money_edit: !!profile.money_edit,
      teacher_courses: profile.teacher_courses ?? [],
      student_field_grants: profile.student_field_grants ?? [],
      teacher_payroll_access: !!profile.teacher_payroll_access,
      student_id: (profile.student_id as string) || null,
    });
    if (profileErr) {
      await admin.auth.admin.deleteUser(created.user.id);
      return json({ error: profileErr.message }, 400);
    }
    return json({ id: created.user.id });
  }

  if (body.action === "attach") {
    // Self-heal: an Auth user exists (e.g. from an earlier half-created
    // browser-signUp attempt) but has no profile. Attach the profile and
    // confirm the email so the account is immediately usable.
    const email = String(body.email ?? "").trim().toLowerCase();
    const profile = (body.profile ?? {}) as Record<string, unknown>;
    if (!email) return json({ error: "email required" }, 400);

    let existing: { id: string } | undefined;
    for (let page = 1; page <= 10 && !existing; page++) {
      const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 200 });
      if (error) return json({ error: error.message }, 400);
      const users = ((data as { users?: Array<{ id: string; email?: string }> } | null)?.users ?? []) as Array<{ id: string; email?: string }>;
      existing = users.find((u) => (u.email ?? "").toLowerCase() === email);
      if (!users.length) break;
    }
    if (!existing) return json({ error: `no Auth user found for ${email}` }, 404);

    const { error: profileErr } = await admin.from("profiles").upsert({
      id: existing.id,
      username: String(profile.username ?? email),
      role: String(profile.role ?? "viewer"),
      tabs: profile.tabs ?? ["dashboard"],
      money_edit: !!profile.money_edit,
      teacher_courses: profile.teacher_courses ?? [],
      student_field_grants: profile.student_field_grants ?? [],
      teacher_payroll_access: !!profile.teacher_payroll_access,
      student_id: (profile.student_id as string) || null,
    });
    if (profileErr) return json({ error: profileErr.message }, 400);
    const { error: confirmErr } = await admin.auth.admin.updateUserById(existing.id, { email_confirm: true });
    if (confirmErr) return json({ error: confirmErr.message }, 400);
    return json({ id: existing.id, attached: true });
  }

  if (body.action === "delete") {
    const id = String(body.id ?? "");
    if (!id || id === user.id) return json({ error: "invalid target user" }, 400);
    const { data: target } = await admin.from("profiles").select("role").eq("id", id).maybeSingle();
    if (target?.role === "admin") return json({ error: "super admin cannot be deleted" }, 403);
    // Delete the Auth user first. profiles.id references auth.users with
    // ON DELETE CASCADE, so the profile row follows automatically; historical
    // attribution FKs use ON DELETE SET NULL and keep their rows intact.
    // Deleting the profile first would break user removal whenever the Auth
    // delete then failed, leaving a half-deleted account.
    const { error: authErr } = await admin.auth.admin.deleteUser(id);
    if (authErr) return json({ error: authErr.message }, 400);
    return json({ ok: true });
  }

  return json({ error: "unknown action" }, 400);
});

function json(payload: unknown, status: number) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { ...CORS, "Content-Type": "application/json" },
  });
}
