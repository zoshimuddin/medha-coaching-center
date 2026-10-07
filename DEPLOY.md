# Hostinger Live Guide (Supabase + Domain + Shared Hosting)

App ekhon **Supabase-connected** — login, data, shob ekjon user er jonno
same live database e thake. localStorage ar nei.

## 1. Supabase side setup (ekbar)

1. Supabase project ready (ache) — base `supabase/schema.sql` SQL Editor e
   already run kora (ache).
2. **NOTUN EXPANSION SCHEMA RUN KORO** — `supabase/20261002_coaching_expansion.sql`
   er full content SQL Editor > New query > Run. Eta additive — purano
   data muche na. Billing (mash onujayi), schedule, class-attendance,
   teacher pay, bank, settings ar security policies toiri kore.
   Fresh project hole: age `supabase/schema.sql`, tarpor expansion.
3. **Authentication > Sign In / Providers > Email > "Confirm email" OFF koro**
   — nahole app theke notun user banate giye email confirmation ar rate
   limit e atke jabe.
4. Tomar nijer admin account: **Authentication > Users > Add user**
   (tomar email + password, auto confirm).
5. User list theke tar **UID** copy kore SQL Editor e ei query chalao (1 bar):

```sql
insert into profiles (id, username, role, tabs, money_edit)
values ('PASTE-UID-HERE', 'admin', 'admin',
  '["dashboard","students","courses","attendance","fees","money"]',
  true);
```

6. Onno user ra ekhon **Settings > User management** thekei banano jabe
   (super admin login kore).

## 2. Admin-users Edge Function (security kei korbe shokto)

User create/delete ekhon server side e hoay bhalo — browser er admin session
safe thake.

1. Supabase dashboard > **Edge Functions** > create function nam dia
   `admin-users` > `supabase/functions/admin-users/index.ts` er content
   paste kore **Deploy** koro.
2. **Edge Functions > Secrets** e add koro:
   `SUPABASE_SERVICE_ROLE_KEY` = Settings > API theke **service_role** key.
3. Na korleo cholbe — app e fallback ache (browser signUp), kintu deploy
   korle nirdorotoki bhalo thakbe.

## 3. Admission Form Scan (camera → auto-fill)

Student entry te camera diye admission form er photo tule scan korle form er
field gulo auto-fill hoy (Gemini AI diye, Bangla handwriting o porukha jay).

1. **Gemini API key nio (free)**: `aistudio.google.com` > Get API key >
   Create API key (Google account e free tier ache).
2. Supabase dashboard > **Edge Functions** > create function nam dia
   `scan-form` > `supabase/functions/scan-form/index.ts` er content paste
   kore **Deploy** koro.
3. **Edge Functions > Secrets** e add koro: `GEMINI_API_KEY` = tomar Gemini key.
4. App e: Students > **"ফর্ম স্ক্যান করে ভরাও"** button > form er photo tulle dao >
   AI fields bhore dibe > tumi dekhe-mila kore **Save** koro.

Note: scan khali prefill — সেভ করার আগে review kora joruri (AI bhul korte pare).
Best result: form ta samne theke, bhalo alo-te, puro form frame-e tule nao.

## 4. Hostinger e upload

1. `hostinger-deploy.zip` ready ache (3 file: index.html, app.js, styles.css —
   expansion version).
2. `hpanel.hostinger.com` > File Manager > `public_html`.
3. Purano 3 file delete koro, zip upload > **Extract**.
4. Domain e dhoko — login page asbe. Admin email + password diye login.

Subdomain chaile: Domains > Subdomains theke banao, oi folder e zip upload.

## 5. Purano browser data (localStorage backup) niye asha

Age jodi purano version e (browser e) data thako:

1. Purano version khule **Backup download** nao (sidebar > Backup & Demo).
2. Notun version e login kore **Backup upload** koro — students/courses/
   batches/enrollments/money/dues live database e chole jabe.
3. **Joruri:** purano backup er shikder student e year (1st/2nd) ar group
   nai — import er por students edit kore oi duita field puro koro. Eta
   chara attendance/schedule e oi shikder kothao dekha jabe na.
4. Purano payment gulo mash-onujayi allocate kora jay na — import e
   current mash er invoice er sathe paid hisebe jog hobe.

## Login

- Login hocche **email + password** diye (Supabase Auth).
- Password bhule gele: login page er "পাসওয়ার্ড ভুলে গেছো?" — email likhe chapo.

## Roles

| Role | Ki dekhbe |
|---|---|
| admin | Sob + Settings + History + user manage + teacher pay |
| editor | Students/courses/hajira/fees (admin section chara) |
| viewer | Shudhu dekhe, edit pare na |
| accountant | Dashboard + hisab (money + bank + dues) entry |
| teacher | Shudhu assigned class er hajira; student info default luki |
| student | Dashboard (data na) |

Teacher student field dhekhte hole (phone/whatsapp/guardian/guardian phone/
address): Settings > User > field grants tick koro.

## Free tier note

Supabase free: 500 MB DB, enough for coaching. 1 mash inactive thakle project
pause hoy — daily use korle somossa nei.
