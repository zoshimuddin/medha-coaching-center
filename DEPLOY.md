# Live Deploy Guide (Mac + Free hosting)

Ekhon app ta browser-only (localStorage). Tomar Mac e full test kora jabe.
Live multi-user login er jonno 2 ta phase:

## Phase 1 — Ekhoni live (demo, free, 5 min)

Static hosting e sudhu file upload korlei cholbe. Kintu mone rekho:
localStorage mane **jei browser e login, data sekhanei** — onno device e
data share hobe na. Eta demo / single-computer use er jonno OK.

**Option A: Netlify Drop (sobcheye easy)**
1. Finder e `coaching-mvp` folder ta zip koro
2. Edge e `app.netlify.com/drop` kholo, zip ta drag-drop koro
3. Instant live link pabe (e.g. `coaching-xyz.netlify.app`)

**Option B: Vercel**
1. `vercel.com` e signup (GitHub diye free)
2. Project import > `coaching-mvp` folder select > Deploy
3. Live link pabe

**Mac e local test:**
```bash
cd /Users/zoshim/Projects/Website/coaching-mvp
python3 -m http.server 8000
# Edge e kholo: http://localhost:8000
```

Demo login: **admin / admin123**

## Phase 2 — Real database (Supabase, free tier)

Multi-user + sob device e same data lagle Supabase Postgres use koro.
Sob free tier er moddhe hoy.

1. **Project banao:** `supabase.com` > New project (free) > password save koro
2. **Auth on:** Authentication > Providers > Email on koro
3. **Schema chalao:** SQL Editor > New query > `supabase-schema.sql` er
   full content paste > Run
4. **Admin user:** Authentication > Users > Add user (tomar email+password),
   tar `id` copy kore schema file er seshe `insert into profiles ...`
   query ta chalao (ID bosiye)
5. **App connect:** `.env.example` copy kore `.env` banao, URL + anon key bosao.
   Tarpor `app.js` e Supabase client add korte hobe (Phase 2 code task —
   bollei ami kore dibo: localStorage er bodle Supabase query).
6. **Deploy:** oporer Phase 1 moto Netlify/Vercel e deploy, dashboard e
   `SUPABASE_URL` ar `SUPABASE_ANON_KEY` environment variable hisebe bosao.

## Database design (short e)

- `profiles` — login user + role + kon tab dekhbe + money edit kina
- `students` / `batches` — main data (`batch_id` foreign key)
- `attendance` — (date + student) unique, present/absent
- `payments` — student fee payment history
- `money_entries` — income/expense, category, note, ke entry dilo
- RLS policy: read sob logged-in user, write shudhu role onujayi

## Role plan (app e already ache)

| Role | Access |
|---|---|
| admin | Sob + Users manage + backup |
| editor | Jegulo tick dibe (add/edit, Users chara) |
| viewer | Shudhu dekhe, edit pare na |
| accountant | Money entry + dashboard |
| student | Shudhu My Batch (name/batch/teacher/time/due) |

Tomar kotha moto: admin Users tab theke user banabe, checkbox diye
kon page dekhte parbe select korbe, Money edit alada permission.
