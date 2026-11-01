-- One-time fee backfill: align every enrollment and every month's invoice with
-- the current course/package fee (the value set in Courses & Schedule).
-- Some packages had their fee lowered but existing students kept the old,
-- higher amount (62 enrollments, 204 invoices). The courses_fee_sync trigger
-- keeps future changes in sync; this catches up the drift.
--
-- Safe to re-run: only rows that differ are touched.

begin;

update public.enrollments e
   set fee = c.fee
  from public.courses c
 where c.id = e.course_id and e.fee is distinct from c.fee;

update public.student_fee_invoices i
   set agreed_fee = c.fee
  from public.courses c
 where c.id = i.course_id and i.agreed_fee is distinct from c.fee;

commit;
