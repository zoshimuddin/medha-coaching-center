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
5. In **Authentication > Sign In / Providers > Email**, turn **Confirm email**
   off if users should be created without email confirmation.
6. Create the owner account in **Authentication > Users > Add user** and copy
   its UID. Run this once in the SQL Editor:

```sql
insert into profiles (id, username, role, tabs, money_edit)
values ('PASTE-UID-HERE', 'admin', 'admin',
  '["dashboard","students","courses","attendance","fees","money"]',
  true);
```

6. Onno user ra ekhon **Settings > User management** thekei banano jabe
   (super admin login kore).

## 2. Admin-users Edge Function

User creation happens server side so the admin session stays safe. Sub-admin
and Admin roles can be assigned from **Settings > User management**.

1. Supabase dashboard > **Edge Functions** > create a function named
   `admin-users` > paste `supabase/functions/admin-users/index.ts` > **Deploy**.
   Redeploy it whenever this file changes.
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

Scanning only prefills the form. Review every field before saving; clear,
well-lit, front-facing photos produce the best results.

## 4. Deploy the website

The Hostinger site deploys from the GitHub repository. Commit and push changes
to the configured branch; do not upload or regenerate `hostinger-deploy.zip`.
The `.htaccess` file disables caching for HTML, JavaScript, and CSS so Git
Deploy changes take effect without a manual archive upload.

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
