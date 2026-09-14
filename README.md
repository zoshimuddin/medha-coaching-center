# মেধা কোচিং সেন্টার ম্যানেজার

Full coaching management: শিক্ষার্থী, ব্যাচ, কোর্স/প্যাকেজ, হাজিরা, ফি,
হিসাব, লগইন + রোল, বার চার্ট, স্টুডেন্ট পোর্টাল, ইউজার হিস্ট্রি।

## Run (Mac)

Kono build lagbe na:
```bash
cd /Users/zoshim/Projects/Website/coaching-mvp
python3 -m http.server 8000
# Edge e: http://localhost:8000
```

## Features

- **Login:** username + password. Tab close hole logout.
- **Super admin (1 jon):** User manage, backup, history — shudhu se pare.
  Notun user e admin role deya jay na.
- **Users:** editor / viewer / accountant / student banao. Checkbox diye
  kon page dekhte parbe thik koro, Money edit alada permission,
  student role er sathe student record link koro.
- **হিস্ট্রি (super admin):** ke kokhon ki korlo — add/edit/delete,
  payment, hisab entry, hajira, login. User filter + search.
- **Dashboard:** metric + bar chart + Recent + Fee Status + Attendance Summary.
- **Students:** nam, mobile, guardian + guardian mobile, WhatsApp (chat link),
  college, batch, enroll course, monthly fee.
- **কোর্স ও প্যাকেজ:** alada subject + package, fee, meyad, filter, koto jon vorti.
- **Money:** Income/Cost entry, Total/Balance/Month Net. View vs edit alada.
- **আমার ব্যাচ (student):** nam, batch, teacher, somoy, course, due.
- **Backup:** Export / Import JSON (history soho).

## Files

- `index.html` — markup (login + 10 view)
- `app.js` — sob logic (auth, permission, history, render)
- `styles.css` — design (login, chart, drawer menu, responsive)
- `supabase-schema.sql` — live database schema (Postgres + RLS + activity_log)
- `.env.example` — Supabase keys template
- `DEPLOY.md` — Hostinger + Supabase live guide
- `hostinger-deploy.zip` — Hostinger e upload korar zip (regenerate koro change er por)

## Data (ekhon: localStorage)

Key: `coachingCenterMvpData` — students, batches, courses, attendance,
payments, money, users, activity. Shared live sync chaile `DEPLOY.md` Phase 2
(Supabase schema ready).
