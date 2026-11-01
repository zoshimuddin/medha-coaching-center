-- Billing window: a student's months start at max(2026-10, their admission
-- month) and never go past the running month. Nothing before that counts and
-- no advance (future) months are billed.

begin;

-- 1. Remove invoices outside the window (safe: none carry payments/discounts).
delete from public.student_fee_invoices i
using public.students s
where s.id = i.student_id
  and (
    i.billing_month < greatest(date '2026-10-01', date_trunc('month', s.admission_date)::date)
    or i.billing_month > date_trunc('month', current_date)::date
  )
  and not exists (select 1 from public.student_fee_payments p where p.invoice_id = i.id)
  and not exists (select 1 from public.student_fee_discounts d where d.invoice_id = i.id);

-- 2. ensure_month_invoices only bills inside the window.
create or replace function public.ensure_month_invoices(p_month date)
returns integer language plpgsql security definer set search_path = '' as $$
declare v_count integer;
begin
  if (select auth.uid()) is null then raise exception 'authentication required'; end if;
  if not (public.is_admin() or (public.current_role() in ('editor','accountant') and public.has_user_tab('fees'))) then
    raise exception 'fee access denied';
  end if;
  if extract(day from p_month) <> 1 then raise exception 'month must be given as its first day'; end if;
  insert into public.student_fee_invoices(student_id, course_id, billing_month, agreed_fee)
  select e.student_id, e.course_id, p_month, e.fee
  from public.enrollments e
  join public.students st on st.id = e.student_id and st.status = 'active' and st.deleted_at is null
  where p_month >= greatest(date '2026-10-01', date_trunc('month', st.admission_date)::date)
    and p_month <= date_trunc('month', current_date)::date
  on conflict (student_id, course_id, billing_month) do nothing;
  get diagnostics v_count = row_count;
  return v_count;
end $$;

commit;
