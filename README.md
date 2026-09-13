# Coaching Center Manager (MVP)

Full coaching management system: students, batches, attendance, fees,
**money management**, **login + role permission**, **bar chart**, **student portal**.

## Run (Mac)

Kono build lagbe na:
```bash
cd /Users/zoshim/Projects/Website/coaching-mvp
python3 -m http.server 8000
# Edge e: http://localhost:8000
```

Demo login: **admin / admin123**

## Features

- **Login:** username + password. Session browser tab close hole logout.
- **Users (admin only):** editor / viewer / accountant / student / admin banao.
  Checkbox diye thik koro kon page dekhte parbe, Money edit alada permission,
  student role er sathe student record link koro.
- **Dashboard:** metric + bar chart (Students per Batch, Collected vs Due)
  + Recent Students + Fee Status + Attendance Summary.
- **Students / Batches / Attendance / Fees:** ager moto, kintu role onujayi
  viewer ra shudhu dekhe, editor ra edit kore.
- **Money tab:** Income / Cost entry (date, category, amount, note),
  Total Income, Total Cost, Balance, This Month Net. View vs edit permission alada.
  Jare edit access dibe se protidin entry bosate parbe, baki ra shudhu dekhbe.
- **My Batch (student login):** student nijer name, batch, teacher, time, due dekhbe.
- **Backup:** Export / Import JSON (admin).

## Files

- `index.html` — markup (login + 8 view)
- `app.js` — sob logic (auth, permission, render)
- `styles.css` — design (login, chart, responsive)
- `supabase-schema.sql` — live database schema (Postgres + RLS)
- `.env.example` — Supabase keys template
- `DEPLOY.md` — live korar step-by-step guide (Netlify/Vercel + Supabase)

## Data (ekhon: localStorage)

Key: `coachingCenterMvpData` — students, batches, attendance, payments,
money, users. Live multi-device sync er jonno `DEPLOY.md` Phase 2 dekho
(Supabase schema ready ache).
