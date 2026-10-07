// Supabase Edge Function: scan-form
// Reads a photo of the printed admission form ("মেধা") with Gemini vision and
// returns the student fields as JSON so the app can prefill the entry form.
// The caller always reviews before saving — AI output is a prefill, not a save.
//
// Deploy (Supabase dashboard):
//   1. Edge Functions > Create a new function > name: scan-form > paste this file.
//   2. Edge Functions > Secrets > add GEMINI_API_KEY (free key from
//      aistudio.google.com > Get API key).
//   3. Leave "Verify JWT with Supabase Auth" ON.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const PROMPT_TEMPLATE = `Extract student details from this scanned admission-form photo of a Bengali coaching center ("মেধা").

Form structure:
- Section "শিক্ষার্থীর তথ্য" (lined blanks): শিক্ষার্থীর নাম = student name, পিতার নাম = father/guardian name, স্কুল/মাদ্রাসার নাম = school or madrasa name, WhatsApp নম্বর, বর্তমান ঠিকানা = present address.
- Section "একাডেমিক তথ্য": checkbox HSC 2028 means "1st year"; checkbox HSC 2027 means "2nd year". Group checkboxes: Science, Commerce, Arts, Madrasa.
- Course/election sections: printed checkboxes for packages (e.g. Science Full Package, Commerce Full Package, Arts/Madrasa/General Package) and individual subjects (ফিজিক্স/Physics, রসায়ন/Chemistry, ICT, উচ্চতর গণিত/Higher Math, জীববিজ্ঞান/Biology, ইংরেজি/English, বাংলা/Bangla etc.). Only CHECKED boxes matter.

Coaching course list (id | name):
<<COURSES>>

For every checked course/package/subject box, pick the matching course id from the list above. Match by meaning even if spelled differently (পদার্থবিজ্ঞান = Physics). If nothing in the list matches a checked box, include it with courseId "" and the label exactly as printed.

Return ONLY a JSON object with exactly these keys:
{
  "name": "",       // student name; "" if blank or unreadable
  "guardian": "",   // father name; "" if blank
  "college": "",    // school/madrasa name; "" if blank
  "whatsapp": "",   // digits only (e.g. 01712345678)
  "address": "",    // present address; "" if blank
  "year": "",       // "1st year" or "2nd year" per the HSC checkbox; "" if none
  "group": "",      // one of Science, Commerce, Arts, Madrasa; "" if none checked
  "courses": [{"courseId": "", "label": ""}]
}`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  if (req.method !== "POST") return json({ error: "method not allowed" }, 405);

  const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
  const geminiKey = Deno.env.get("GEMINI_API_KEY");
  if (!anonKey) return json({ error: "missing SUPABASE_ANON_KEY secret" }, 500);
  if (!geminiKey) return json({ error: "GEMINI_API_KEY secret set koro (Edge Functions > Secrets)" }, 500);

  // Auth: admin, or a user whose tabs include "students".
  const caller = createClient(new URL(req.url).origin, anonKey, {
    global: { headers: { Authorization: req.headers.get("Authorization") ?? "" } },
  });
  const { data: { user } } = await caller.auth.getUser();
  if (!user) return json({ error: "unauthorized" }, 401);
  const { data: prof } = await caller.from("profiles").select("role, tabs").eq("id", user.id).maybeSingle();
  const allowed = prof && (prof.role === "admin" || (Array.isArray(prof.tabs) && prof.tabs.includes("students")));
  if (!allowed) return json({ error: "forbidden" }, 403);

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return json({ error: "invalid body" }, 400);
  }

  const image = String(body.image ?? "");
  const mime = String(body.mime ?? "image/jpeg");
  if (!/^image\/(jpeg|png|webp)$/.test(mime)) return json({ error: "unsupported image type" }, 400);
  const base64 = image.includes(",") ? image.split(",")[1] : image;
  if (!base64 || base64.length > 950_000) return json({ error: "image too large" }, 400);
  const courses = Array.isArray(body.courses) ? body.courses : [];

  const courseList = courses
    .map((c: Record<string, unknown>) => `- ${(c.id as string) ?? ""}: ${(c.name as string) ?? ""}`)
    .filter((line: string) => line.trim().endsWith(":") === false && line.includes(": "))
    .join("\n");
  const prompt = PROMPT_TEMPLATE.replace("<<COURSES>>", courseList || "(list empty — return courseId \"\" for all)");

  const model = String(body.model ?? "gemini-2.0-flash");
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: prompt },
            { inline_data: { mime_type: mime, data: base64 } },
          ],
        }],
        generationConfig: { temperature: 0, responseMimeType: "application/json" },
      }),
    },
  );
  if (!res.ok) {
    const errText = await res.text();
    return json({ error: `Gemini API: ${errText.slice(0, 280)}` }, 502);
  }
  const data = await res.json();
  const text = (data?.candidates?.[0]?.content?.parts ?? [])
    .map((p: { text?: string }) => p.text ?? "")
    .join("");
  let parsed: unknown;
  try {
    parsed = JSON.parse(text.replace(/^```json\s*/i, "").replace(/^```\s*/, "").replace(/```\s*$/, ""));
  } catch {
    return json({ error: "AI response parse hoy nai", raw: text.slice(0, 300) }, 502);
  }
  return json({ fields: parsed });
});

function json(payload: unknown, status: number) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { ...CORS, "Content-Type": "application/json" },
  });
}
