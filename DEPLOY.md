# Hostinger Live Guide (Domain + Shared Hosting)

## Sotti kotha (age bujhe nao)

**Zip upload dile shared live DB hobe NA.** Zip e sudhu 3 ta static file jay
(`index.html`, `app.js`, `styles.css`) — kono database server chole na.
Tai ekhon: je browser/device e khulbe, data sekhanei (localStorage) thakbe.
Sob user er same live data chaile **Supabase** (free) lagbe — niche Phase 2 dekho.

## Phase 1 — Hostinger e ekhoni live (static)

1. Folder e `hostinger-deploy.zip` ready ache (3 file: index.html, app.js, styles.css).
2. `hpanel.hostinger.com` > File Manager > `public_html` e dhoko.
3. Vitorer default file thakle sorাও, zip upload kore **Extract** koro.
4. Domain e dhoko — site live. Login: tomar super admin account.
5. Subdomain chaile (jemon `manage.tumar-domain.com`): Domains > Subdomains
   theke banao, oi folder e zip upload + extract koro.

## Phase 2 — Shared live database (Supabase, free)

Sob device e same data + sob user er input tumi dekhbe — er jonno:

1. `supabase.com` > New project (free) banao.
2. SQL Editor > New query > `supabase-schema.sql` er full content paste > Run.
   (students, batches, courses, attendance, payments, money_entries,
   activity_log, profiles — sob table + RLS policy toiri hobe.)
3. Authentication > Users > Add user (tomar email + password), tar `id`
   copy kore schema file er sesher `insert into profiles ...` query chalao.
4. Amake bolo "Supabase connect koro" — ami `app.js` e Supabase client bosiye
   localStorage er bodle live query likhe dibo. `.env.example` e key er format ache.
5. Tarpor notun zip baniye Hostinger e upload korlei shared live DB cholbe.

## Super admin + history (ekhon thekei ache)

- Super admin ekjonoi. User manage + history shudhu se dekhte parbe.
- Notun user bananor somoy role list e admin option nei — keu nijeke admin
  banate parbe na. Purono backup e admin thakle auto editor hoye jabe.
- **হিস্ট্রি tab:** ke kokhon ki korlo — student add/edit/delete, fee payment,
  hisab entry/delete, hajira, user create/delete, login — sob record thake.
  User filter + search ache. Shudhu super admin dekhte pare.
- History backup/export er sathe save hoy, 500 ta porjonto rakhe.

## Role plan

| Role | Access |
|---|---|
| super admin | Sob + Users manage + backup + history |
| editor | Jegulo tick dibe (add/edit, Users/history chara) |
| viewer | Shudhu dekhe, edit pare na |
| accountant | Money entry + dashboard |
| student | Shudhu Amar Batch |
