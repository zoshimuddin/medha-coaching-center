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
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
  if (!serviceKey || !anonKey) return json({ error: "missing env secrets" }, 500);

  const origin = new URL(req.url).origin;

  // Caller client carries the admin's JWT, so profile RLS applies.
  const caller: SupabaseClient = createClient(origin, anonKey, {
    global: { headers: { Authorization: req.headers.get("Authorization") ?? "" } },
  });
  const { data: { user } } = await caller.auth.getUser();
  if (!user) return json({ error: "unauthorized" }, 401);
  const { data: prof } = await caller.from("profiles").select("role").eq("id", user.id).maybeSingle();
  if (!prof || prof.role !== "admin") return json({ error: "forbidden" }, 403);

  const admin: SupabaseClient = createClient(origin, serviceKey);

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
    if (!email || password.length < 4) return json({ error: "email and 4+ char password required" }, 400);
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
      role: String(profile.role ?? "viewer"),
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

  if (body.action === "delete") {
    const id = String(body.id ?? "");
    if (!id || id === user.id) return json({ error: "invalid target user" }, 400);
    const { error: profileErr } = await admin.from("profiles").delete().eq("id", id);
    if (profileErr) return json({ error: profileErr.message }, 400);
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
