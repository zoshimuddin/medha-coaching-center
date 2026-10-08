-- User deletion support: deleting a user from Settings must never fail just
-- because that user appears in old attendance, teacher payment, or bank rows.
-- Attribution columns become nullable with ON DELETE SET NULL so historical
-- rows keep their amounts while the account is removed cleanly.
-- Re-run safe: idempotent constraint recreation.

begin;

-- Attendance: who marked it may disappear, the record itself stays.
alter table public.class_attendance alter column marked_by drop not null;
alter table public.class_attendance drop constraint if exists class_attendance_marked_by_fkey;
alter table public.class_attendance add constraint class_attendance_marked_by_fkey
  foreign key (marked_by) references public.profiles(id) on delete set null;

-- Bank entries: keep the transaction, drop the author link.
alter table public.bank_transactions alter column created_by drop not null;
alter table public.bank_transactions drop constraint if exists bank_transactions_created_by_fkey;
alter table public.bank_transactions add constraint bank_transactions_created_by_fkey
  foreign key (created_by) references public.profiles(id) on delete set null;

-- Teacher payments: keep earned/paid ledger rows; teacher link becomes optional.
alter table public.teacher_payments alter column teacher_id drop not null;
alter table public.teacher_payments drop constraint if exists teacher_payments_teacher_id_fkey;
alter table public.teacher_payments add constraint teacher_payments_teacher_id_fkey
  foreign key (teacher_id) references public.profiles(id) on delete set null;

alter table public.teacher_payments alter column paid_by drop not null;
alter table public.teacher_payments drop constraint if exists teacher_payments_paid_by_fkey;
alter table public.teacher_payments add constraint teacher_payments_paid_by_fkey
  foreign key (paid_by) references public.profiles(id) on delete set null;

commit;
