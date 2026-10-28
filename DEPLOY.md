# Hostinger Live Guide (Supabase + Domain + Shared Hosting)

App ekhon **Supabase-connected** — login, data, shob ekjon user er jonno
same live database e thake. localStorage ar nei.

## 1. Supabase setup

1. Run `supabase/schema.sql` in the Supabase SQL Editor if the base schema
   has not already been installed.
2. Run `supabase/20261002_coaching_expansion.sql` to add monthly billing,
   schedules, attendance, teacher pay, bank, settings, and security policies.
3. Run `supabase/20261007_student_fees_reports.sql` after the expansion
   migration. It backfills student numbers and admission dates and adds the
   new student, discount, receipt, and payment functions.
4. Run `supabase/20261008_reports_ideas_accounts.sql` for the sub-admin role,
   the ideas board, automatic fee-income posting to Accounts, and the
   receipt edit/void functions.
5. Run `supabase/20261009_softdelete_trash.sql` for the 30-day deleted-student
   trash (Settings, admin only) and its trash/roster RPCs.
6. Run `supabase/20261010_user_delete_fk.sql` so deleting users from
   **Settings > User management** never fails on old attendance, teacher
   payment, or bank records.
7. Run `supabase/20261011_package_subjects_attendance.sql` for package →
   subject membership (Science Full, Commerce Full, ...) and subject-aware
   attendance rosters and counts. After running it, open each package in
   **Courses** and confirm its included subjects, then save once so custom
   packages are mapped too.
8. Run `supabase/20261012_admission_first_month.sql` — the admission fee
   becomes pending at admission and is collected together with the first
   month's fee (auto income entry, confirmation in the collect dialog).
   Existing recorded admissions reset to pending, and the unused duplicate
   subject "HSC Physics" is removed (Physics stays).
9. Run `supabase/20261013_admin_user_rpc.sql` — user create/attach/delete
   happen through super-admin RPCs (no edge function dependency).
10. Run `supabase/20261014_schedule_teacher_pay.sql` — schedules become
    subject + year (all groups attend together), and Teachers Pay gains a
    teacher_adjustments ledger (bonus/bus/extra) with payment-status filters.
11. Run `supabase/20261017_admission_instant_receipts.sql` — the admission fee
    is deposited the moment a student is admitted: it gets its own receipt in
    Collection history and its income entry is dated the admission date, so
    reports count it on that day (2 admissions today = ৳1000). All students
    admitted before this migration are back-filled with their admission
    receipt. Deleting an admission receipt undoes that deposit.
12. Run `supabase/20261018_fee_sync.sql` — changing a course/package price now
    updates every student and every billing month, and removing a course from a
    student drops that course's unpaid fee everywhere (past collected months
    are kept as history).
13. Run `supabase/20261019_attendance_subject_flow.sql` — the new
    year → subject attendance flow: any staff member can take attendance with a
    date-wise history. Subjects no longer need a weekly Schedule row.
14. Run `supabase/20261020_due_notes.sql` — per-month due notes shown in the
    Reminder tab and the fee detail page; the note clears automatically when
    that month is fully paid.
15. Run `supabase/20261021_attendance_paid.sql` — attendance roster cards show
    a Paid/Unpaid badge (this month's fee), in sync with Fees.
16. Run `supabase/20261022_attendance_due_month.sql` — the badge now names the
    month a student is unpaid for (earliest unpaid month).
17. In **Authentication > Sign In / Providers > Email**, turn **Confirm email**
    off if users should be created without email confirmation.
18. Create the owner account in **Authentication > Users > Add user** and copy
    its UID. Run this once in the SQL Editor:

```sql
insert into profiles (id, username, role, tabs, money_edit)
values ('PASTE-UID-HERE', 'admin', 'admin',
  '["dashboard","students","courses","attendance","fees","money"]',
  true);
```

19. Onno user ra ekhon **Settings > User management** thekei banano jabe
    (super admin login kore). Password minimum 6 characters (Supabase Auth rule).

## 2. Admin-users Edge Function

User creation happens server side so the admin session stays safe. Sub-admin
and Admin roles can be assigned from **Settings > User management**.

1. Supabase dashboard > **Edge Functions** > create a function named
   `admin-users` > paste `supabase/functions/admin-users/index.ts` > **Deploy**.
   Redeploy it whenever this file changes. Deletion now removes the Auth user
   first (the profile row follows by cascade) and refuses to delete the super
   admin account.
2. Add the secret `SUPABASE_SERVICE_ROLE_KEY` under **Edge Functions > Secrets**
   (Settings > API > service_role key).
3. Without the function the app falls back to browser signUp; deploying it is
   the more secure path.

## 3. Admission form scanning

The **Scan admission form** action can prefill student fields from a photo.

1. Create a Gemini API key in Google AI Studio.
2. In Supabase **Edge Functions**, deploy `supabase/functions/scan-form/index.ts`
   as `scan-form`.
3. Add `GEMINI_API_KEY` under **Edge Functions > Secrets**.
4. In **Students > Add student**, choose **Scan admission form**, select or
   capture a photo, review the prefilled fields, then save.
5. The function defaults to `gemini-3.5-flash-lite` (fast, free-tier friendly)
   and automatically falls back to `gemini-3.5-flash` / `gemini-2.5-flash` if a
   model is unavailable on the project. Set a `GEMINI_MODEL` secret to pin a
   different model. Free-tier quotas can change — verify limits in Google AI
   Studio if scans start failing.

Scanning only prefills the form. Review every field before saving; clear,
well-lit, front-facing photos produce the best results.

## 4. Deploy the website

The Hostinger site deploys from the GitHub repository. Commit and push changes
to the configured branch; do not upload or regenerate `hostinger-deploy.zip`.
The `.htaccess` file disables caching for HTML, JavaScript, and CSS so Git
Deploy changes take effect without a manual archive upload.

## 4b. Migrations (Supabase)

Website code and the database migrate separately. New `supabase/*.sql` files must
be applied to the project (ref `mlsyvhlnnjexqtaswayi`) once. Two ways:

**Automatic (like the website):** a Supabase Personal Access Token as a GitHub
repo secret turns on `.github/workflows/supabase-migrate.yml`. Then every push
that changes `supabase/*.sql` applies just those files automatically.

```bash
# one time (needs a 'repo' + secrets scope gh token)
gh secret set SUPABASE_ACCESS_TOKEN --repo zoshimuddin/medha-coaching-center
# paste the token (sbp_...) when prompted
```

**Manual (or for pending files):** run the helper, which posts each file to the
Supabase Management API (no database password needed):

```bash
SUPABASE_ACCESS_TOKEN=sbp_xxx ./supabase/apply.sh \
  supabase/20261018_fee_sync.sql supabase/20261019_attendance_subject_flow.sql
```

Every migration must be safe to re-run (`create or replace`, `if not exists`).
Create a Personal Access Token at Supabase → **Account → Access Tokens**.

## 4c. Install as an app (PWA)

The site is a Progressive Web App — no store, no cost.

- **Files:** `manifest.webmanifest` (name, icons, standalone), `sw.js`
  (service worker: network-first, offline app shell), `icons/*.png`, and the
  manifest/theme/icon tags in `index.html`.
- **Install on Android:** open the site in Chrome → menu **⋮** → **Install app**
  (or **Add to Home screen**). It then opens full-screen with its own icon, and
  the shell still opens when the phone is offline.
- **Maintenance:** editing `app.js`/`styles.css` — bump `?v=` in `index.html`
  (optional; the service worker fetches fresh when online). Adding/removing
  files from the offline shell or changing icons — bump `CACHE` in `sw.js`.
- `.htaccess` serves `.webmanifest` as `application/manifest+json` and keeps
  html/js/css uncached so deploys go live immediately.

## 5. Import legacy browser data

If you still have data in an old browser version:

1. In the old version, download a backup from **Account & tools**.
2. In the new version, sign in and upload the backup. Students, courses,
   batches, enrollments, money entries, and dues are imported.
3. Review imported students and fill in any missing year/group details required
   for attendance and schedules. Existing database students get admission dates
   from `created_at` when the migration runs.
4. Legacy payments cannot be reliably allocated to historical billing months;
   review their imported invoice balances after the import.

## Login

- Sign in with email and password through Supabase Auth.
- Use **Forgot password?** on the login page if needed.

## Roles

| Role | Access |
|---|---|
| admin | All sections, user management, reports, and teacher pay |
| editor | Students, courses, attendance, and fees |
| viewer | Read-only access to assigned sections |
| accountant | Accounts, fees, and related finance tools |
| teacher | Assigned class attendance; student details are restricted by default |
| student | Student dashboard |

Admins can grant teachers access to specific student fields in **Settings > User management**.

## Free tier note

Supabase free: 500 MB DB, enough for coaching. 1 mash inactive thakle project
pause hoy — daily use korle somossa nei.
