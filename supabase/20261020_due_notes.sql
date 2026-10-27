-- Per-month due notes.
-- A note can be written for a student while they owe for a month. When that
-- month becomes fully paid the note is removed automatically, and it stays
-- blank for the next month (a note is keyed by student + billing month).

begin;

create table if not exists public.student_due_notes (
  student_id uuid not null references public.students(id) on delete cascade,
  billing_month date not null check (extract(day from billing_month) = 1),
  note text not null default '',
  updated_by uuid references public.profiles(id) on delete set null,
  updated_at timestamptz not null default now(),
  primary key (student_id, billing_month)
);

alter table public.student_due_notes enable row level security;

drop policy if exists "due note fee read" on public.student_due_notes;
create policy "due note fee read" on public.student_due_notes for select to authenticated using (
  public.is_admin() or (public.current_role() in ('editor','viewer','accountant') and public.has_user_tab('fees'))
);
drop policy if exists "due note fee write" on public.student_due_notes;
create policy "due note fee write" on public.student_due_notes for all to authenticated using (
  public.is_admin() or (public.current_role() in ('editor','accountant') and public.has_user_tab('fees'))
) with check (
  public.is_admin() or (public.current_role() in ('editor','accountant') and public.has_user_tab('fees'))
);

-- Save (or clear, when empty) a note. Keyed by the month's first day.
create or replace function public.set_due_note(p_student uuid, p_month date, p_note text)
returns void language plpgsql security definer set search_path = '' as $$
declare
  v_user uuid := (select auth.uid());
  v_month date := date_trunc('month', p_month)::date;
begin
  if v_user is null then raise exception 'authentication required'; end if;
  if not (public.is_admin() or (public.current_role() in ('editor','accountant') and public.has_user_tab('fees'))) then
    raise exception 'fee access denied';
  end if;
  if coalesce(trim(p_note), '') = '' then
    delete from public.student_due_notes where student_id = p_student and billing_month = v_month;
  else
    insert into public.student_due_notes(student_id, billing_month, note, updated_by, updated_at)
    values (p_student, v_month, left(trim(p_note), 500), v_user, now())
    on conflict (student_id, billing_month)
      do update set note = excluded.note, updated_by = excluded.updated_by, updated_at = now();
  end if;
end $$;

-- When a month is fully paid, drop its note so it does not chase a settled month.
create or replace function public.clear_paid_due_note() returns trigger
language plpgsql security definer set search_path = '' as $$
declare
  v_invoice uuid := coalesce(new.invoice_id, old.invoice_id);
  v_student uuid;
  v_month date;
  v_due numeric;
begin
  select i.student_id, i.billing_month into v_student, v_month
    from public.student_fee_invoices i where i.id = v_invoice;
  if v_student is null then return null; end if;
  select coalesce(sum(greatest(0,
      i.agreed_fee
      - coalesce((select sum(p.amount) from public.student_fee_payments p where p.invoice_id = i.id), 0)
      - coalesce((select sum(d.amount) from public.student_fee_discounts d where d.invoice_id = i.id), 0)
    )), 0) into v_due
    from public.student_fee_invoices i
    where i.student_id = v_student and i.billing_month = v_month;
  if v_due <= 0 then
    delete from public.student_due_notes where student_id = v_student and billing_month = v_month;
  end if;
  return null;
end $$;

drop trigger if exists student_fee_payments_clear_note on public.student_fee_payments;
create trigger student_fee_payments_clear_note
  after insert or update or delete on public.student_fee_payments
  for each row execute function public.clear_paid_due_note();

drop trigger if exists student_fee_discounts_clear_note on public.student_fee_discounts;
create trigger student_fee_discounts_clear_note
  after insert or update or delete on public.student_fee_discounts
  for each row execute function public.clear_paid_due_note();

revoke all on function public.set_due_note(uuid,date,text) from public;
grant execute on function public.set_due_note(uuid,date,text) to authenticated;

commit;
