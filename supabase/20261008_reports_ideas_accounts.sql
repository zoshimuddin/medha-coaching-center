begin;

-- ============ Sub-admin role ============
alter table public.profiles drop constraint if exists profiles_role_check;
alter table public.profiles add constraint profiles_role_check
  check (role in ('admin', 'subadmin', 'editor', 'viewer', 'accountant', 'student', 'teacher'));

-- is_admin() now covers both management levels (admin and subadmin).
create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role in ('admin', 'subadmin'))
$$;

-- Only the original admin manages app users / ideas labels.
create or replace function public.is_super_admin()
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'admin')
$$;

-- profiles stay user-management-only for the original admin.
drop policy if exists "admin profile manage" on public.profiles;
create policy "admin profile manage" on public.profiles for all to authenticated
  using (public.is_super_admin()) with check (public.is_super_admin());

-- ============ Ideas ============
create table if not exists public.ideas (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  idea text not null default '',
  label text not null default 'New' check (label in ('New', 'Approve', 'Planning', 'On Going', 'Completed')),
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);
create index if not exists ideas_created_idx on public.ideas(created_at desc);
create index if not exists ideas_label_idx on public.ideas(label);

alter table public.ideas enable row level security;
drop policy if exists "ideas read" on public.ideas;
create policy "ideas read" on public.ideas for select to authenticated using (true);
drop policy if exists "ideas insert" on public.ideas;
create policy "ideas insert" on public.ideas for insert to authenticated
  with check ((select auth.uid()) is not null);
drop policy if exists "ideas label update" on public.ideas;
create policy "ideas label update" on public.ideas for update to authenticated
  using (public.is_super_admin()) with check (public.is_super_admin());
drop policy if exists "ideas admin delete" on public.ideas;
create policy "ideas admin delete" on public.ideas for delete to authenticated
  using (public.is_super_admin());
grant select, insert, update, delete on public.ideas to authenticated;

-- ============ Fee collection creates the account income automatically ============
alter table public.money_entries add column if not exists receipt_id uuid;
create index if not exists money_entries_receipt_idx on public.money_entries(receipt_id);

create or replace function public.student_fee_income(p_student uuid, p_month date, p_paid numeric, p_payment_date date, p_receipt uuid, p_actor uuid)
returns void language plpgsql security definer set search_path = '' as $$
declare v_name text;
begin
  if p_paid is null or p_paid <= 0 then return; end if;
  select st.name || ' (' || st.student_number || ')' into v_name from public.students st where st.id = p_student;
  insert into public.money_entries(date, type, category, amount, note, by_username, receipt_id)
  values(coalesce(p_payment_date, current_date), 'income', 'Student fee', p_paid, coalesce(v_name, ''), coalesce((select pr.username from public.profiles pr where pr.id = p_actor), ''), p_receipt);
end $$;

-- ============ Attendance helpers ============
create or replace function public.offering_enrollment_counts()
returns setof jsonb language plpgsql stable security definer set search_path = '' as $$
begin
  if (select auth.uid()) is null then raise exception 'authentication required'; end if;
  return query
  select jsonb_build_object('offeringId', o.id, 'count', coalesce(cnt.c, 0))
  from public.course_offerings o
  left join (
    select e.course_id, st.year_level, st.group_name, count(*) as c
    from public.enrollments e
    join public.students st on st.id = e.student_id and st.status = 'active'
    group by 1, 2, 3
  ) cnt on cnt.course_id = o.course_id and cnt.year_level = o.year_level and cnt.group_name = o.group_name
  where o.active and (public.is_admin() or o.teacher_id = (select auth.uid()));
end $$;

-- Roster rows now carry the permanent student number for receipt/attendance views.
create or replace function public.teacher_roster(p_session uuid)
returns jsonb language plpgsql stable security definer set search_path = '' as $$
declare
  v_user uuid := (select auth.uid());
  v_result jsonb;
begin
  if v_user is null then raise exception 'authentication required'; end if;
  if not exists (
    select 1 from public.class_sessions s
    join public.course_offerings o on o.id = s.offering_id
    where s.id = p_session and (o.teacher_id = v_user or public.is_admin())
  ) then raise exception 'session not assigned'; end if;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', st.id,
    'name', st.name,
    'studentNumber', st.student_number,
    'college', st.college,
    'group', st.group_name,
    'year', st.year_level,
    'attendance', ca.status,
    'phone', case when public.is_admin() or exists(select 1 from public.profiles p where p.id=v_user and p.student_field_grants ? 'phone') then st.phone else null end,
    'whatsapp', case when public.is_admin() or exists(select 1 from public.profiles p where p.id=v_user and p.student_field_grants ? 'whatsapp') then st.whatsapp else null end,
    'guardian', case when public.is_admin() or exists(select 1 from public.profiles p where p.id=v_user and p.student_field_grants ? 'guardian') then st.guardian else null end,
    'guardian_phone', case when public.is_admin() or exists(select 1 from public.profiles p where p.id=v_user and p.student_field_grants ? 'guardian_phone') then st.guardian_phone else null end,
    'address', case when public.is_admin() or exists(select 1 from public.profiles p where p.id=v_user and p.student_field_grants ? 'address') then st.address else null end
  ) order by st.name), '[]'::jsonb)
  into v_result
  from public.class_sessions s
  join public.course_offerings o on o.id = s.offering_id
  join public.students st on st.year_level = o.year_level and st.group_name = o.group_name
  join public.enrollments e on e.student_id = st.id and e.course_id = o.course_id
  left join public.class_attendance ca on ca.session_id = s.id and ca.student_id = st.id
  where s.id = p_session;
  return v_result;
end $$;

-- ============ Receipt void / edit (original admin only) ============
create or replace function public.clear_receipt_rows(p_receipt uuid)
returns numeric language plpgsql security definer set search_path = '' as $$
declare v_paid numeric(12,2);
begin
  select coalesce(sum(amount), 0) into v_paid from public.student_fee_payments where receipt_id = p_receipt;
  delete from public.money_entries where receipt_id = p_receipt;
  delete from public.student_fee_payments where receipt_id = p_receipt;
  delete from public.student_fee_discounts where receipt_id = p_receipt;
  delete from public.student_fee_receipts where receipt_id = p_receipt;
  return v_paid;
end $$;

create or replace function public.void_student_fee_receipt(p_receipt uuid)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  v_user uuid := (select auth.uid());
  v_paid numeric(12,2) := 0;
  v_student uuid;
  v_month date;
begin
  if v_user is null then raise exception 'authentication required'; end if;
  if not public.is_super_admin() then raise exception 'admin access required'; end if;
  select student_id, billing_month into v_student, v_month from public.student_fee_receipts where receipt_id = p_receipt;
  if not found then raise exception 'receipt not found'; end if;
  v_paid := public.clear_receipt_rows(p_receipt);
  if v_paid > 0 then
    update public.students set paid = greatest(0, coalesce(paid, 0) - v_paid) where id = v_student;
  end if;
  return jsonb_build_object('ok', true);
end $$;

create or replace function public.edit_student_fee_receipt(p_receipt uuid, p_amount numeric, p_payment_date date, p_apply_discount boolean default false)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  v_user uuid := (select auth.uid());
  v_student uuid;
  v_month date;
  v_due numeric(12,2);
  v_invoice record;
  v_remaining numeric(12,2);
  v_alloc numeric(12,2);
  v_refunded numeric(12,2) := 0;
  v_discount_target numeric(12,2) := 0;
  v_discount numeric(12,2) := 0;
  v_paid numeric(12,2) := 0;
  v_amount numeric(12,2);
begin
  if v_user is null then raise exception 'authentication required'; end if;
  if not public.is_super_admin() then raise exception 'admin access required'; end if;
  select student_id, billing_month into v_student, v_month from public.student_fee_receipts where receipt_id = p_receipt;
  if not found then raise exception 'receipt not found'; end if;
  if p_payment_date is null then raise exception 'payment date is required'; end if;

  -- Undo the receipt first so the month's balances are available again.
  v_refunded := public.clear_receipt_rows(p_receipt);
  update public.students set paid = greatest(0, coalesce(paid, 0) - v_refunded) where id = v_student;

  select coalesce(sum(i.agreed_fee - coalesce((select sum(sp.amount) from public.student_fee_payments sp where sp.invoice_id=i.id),0) - coalesce((select sum(d.amount) from public.student_fee_discounts d where d.invoice_id=i.id),0)),0)
  into v_due from public.student_fee_invoices i where i.student_id=v_student and i.billing_month=v_month;

  v_amount := coalesce(p_amount, 0);
  if v_amount < 0 then raise exception 'amount cannot be negative'; end if;
  if v_due <= 0 then raise exception 'no outstanding due for this month'; end if;
  if v_amount > v_due then raise exception 'payment exceeds this month due'; end if;
  if v_amount = 0 and not p_apply_discount then raise exception 'enter a payment amount or apply a discount'; end if;

  v_remaining := v_amount;
  for v_invoice in
    select i.id, greatest(0, i.agreed_fee - coalesce((select sum(sp.amount) from public.student_fee_payments sp where sp.invoice_id=i.id),0) - coalesce((select sum(d.amount) from public.student_fee_discounts d where d.invoice_id=i.id),0)) as due
    from public.student_fee_invoices i where i.student_id=v_student and i.billing_month=v_month order by i.id
  loop
    exit when v_remaining <= 0;
    v_alloc := least(v_invoice.due, v_remaining);
    if v_alloc > 0 then
      insert into public.student_fee_payments(invoice_id, amount, payment_date, received_by, note, receipt_id)
      values(v_invoice.id, v_alloc, p_payment_date, v_user, '', p_receipt);
      v_paid := v_paid + v_alloc;
      v_remaining := v_remaining - v_alloc;
    end if;
  end loop;

  if p_apply_discount then
    v_discount_target := v_due - v_paid;
    v_discount := v_discount_target;
    for v_invoice in
      select i.id, greatest(0, i.agreed_fee - coalesce((select sum(sp.amount) from public.student_fee_payments sp where sp.invoice_id=i.id),0) - coalesce((select sum(d.amount) from public.student_fee_discounts d where d.invoice_id=i.id),0)) as due
      from public.student_fee_invoices i where i.student_id=v_student and i.billing_month=v_month order by i.id
    loop
      exit when v_discount <= 0;
      v_alloc := least(v_invoice.due, v_discount);
      if v_alloc > 0 then
        insert into public.student_fee_discounts(receipt_id, invoice_id, student_id, billing_month, amount, applied_by)
        values(p_receipt, v_invoice.id, v_student, v_month, v_alloc, v_user);
        v_discount := v_discount - v_alloc;
      end if;
    end loop;
  end if;

  update public.students set paid = coalesce(paid, 0) + v_paid where id = v_student;
  insert into public.student_fee_receipts(receipt_id, student_id, billing_month, paid_amount, discount_amount, remaining_amount, payment_date, received_by, recorded_at)
  values(p_receipt, v_student, v_month, v_paid, v_discount_target, case when p_apply_discount then 0 else v_due - v_paid end, p_payment_date, v_user, now());
  perform public.student_fee_income(v_student, v_month, v_paid, p_payment_date, p_receipt, v_user);
  return jsonb_build_object('receipt_id', p_receipt, 'paid', v_paid, 'discount', v_discount_target, 'remaining', case when p_apply_discount then 0 else v_due - v_paid end, 'payment_date', p_payment_date, 'recorded_at', now());
end $$;

-- ============ Collection now posts the account income ============
create or replace function public.collect_student_month_fee(p_student uuid, p_month date, p_amount numeric, p_payment_date date, p_apply_discount boolean default false)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  v_user uuid := (select auth.uid());
  v_due numeric(12,2);
  v_amount numeric(12,2);
  v_invoice record;
  v_remaining numeric(12,2);
  v_alloc numeric(12,2);
  v_discount_target numeric(12,2) := 0;
  v_discount numeric(12,2) := 0;
  v_paid numeric(12,2) := 0;
  v_receipt uuid := gen_random_uuid();
begin
  if v_user is null then raise exception 'authentication required'; end if;
  if not (public.is_admin() or (public.current_role() in ('editor','accountant') and public.has_user_tab('fees'))) then raise exception 'fee access denied'; end if;
  if p_month is null or extract(day from p_month) <> 1 then raise exception 'month must be given as its first day'; end if;
  if p_payment_date is null then raise exception 'payment date is required'; end if;
  v_amount := coalesce(p_amount, 0);
  if v_amount < 0 then raise exception 'amount cannot be negative'; end if;

  perform 1 from public.student_fee_invoices i where i.student_id=p_student and i.billing_month=p_month for update;
  select coalesce(sum(i.agreed_fee - coalesce((select sum(sp.amount) from public.student_fee_payments sp where sp.invoice_id=i.id),0) - coalesce((select sum(d.amount) from public.student_fee_discounts d where d.invoice_id=i.id),0)),0)
  into v_due from public.student_fee_invoices i where i.student_id=p_student and i.billing_month=p_month;
  if v_due <= 0 then raise exception 'no outstanding due for this month'; end if;
  if v_amount > v_due then raise exception 'payment exceeds this month due'; end if;
  if v_amount = 0 and not p_apply_discount then raise exception 'enter a payment amount or apply a discount'; end if;

  v_remaining := v_amount;
  for v_invoice in
    select i.id, greatest(0, i.agreed_fee - coalesce((select sum(sp.amount) from public.student_fee_payments sp where sp.invoice_id=i.id),0) - coalesce((select sum(d.amount) from public.student_fee_discounts d where d.invoice_id=i.id),0)) as due
    from public.student_fee_invoices i where i.student_id=p_student and i.billing_month=p_month order by i.id
  loop
    exit when v_remaining <= 0;
    v_alloc := least(v_invoice.due, v_remaining);
    if v_alloc > 0 then
      insert into public.student_fee_payments(invoice_id, amount, payment_date, received_by, note, receipt_id)
      values(v_invoice.id, v_alloc, p_payment_date, v_user, '', v_receipt);
      v_paid := v_paid + v_alloc;
      v_remaining := v_remaining - v_alloc;
    end if;
  end loop;

  if p_apply_discount then
    v_discount_target := v_due - v_paid;
    v_discount := v_discount_target;
    for v_invoice in
      select i.id, greatest(0, i.agreed_fee - coalesce((select sum(sp.amount) from public.student_fee_payments sp where sp.invoice_id=i.id),0) - coalesce((select sum(d.amount) from public.student_fee_discounts d where d.invoice_id=i.id),0)) as due
      from public.student_fee_invoices i where i.student_id=p_student and i.billing_month=p_month order by i.id
    loop
      exit when v_discount <= 0;
      v_alloc := least(v_invoice.due, v_discount);
      if v_alloc > 0 then
        insert into public.student_fee_discounts(receipt_id, invoice_id, student_id, billing_month, amount, applied_by)
        values(v_receipt, v_invoice.id, p_student, p_month, v_alloc, v_user);
        v_discount := v_discount - v_alloc;
      end if;
    end loop;
  end if;

  update public.students set paid = coalesce(paid, 0) + v_paid where id = p_student;
  insert into public.student_fee_receipts(receipt_id, student_id, billing_month, paid_amount, discount_amount, remaining_amount, payment_date, received_by)
  values(v_receipt, p_student, p_month, v_paid, v_discount_target, case when p_apply_discount then 0 else v_due - v_paid end, p_payment_date, v_user);
  perform public.student_fee_income(p_student, p_month, v_paid, p_payment_date, v_receipt, v_user);
  return jsonb_build_object('receipt_id', v_receipt, 'paid', v_paid, 'discount', v_discount_target, 'remaining', case when p_apply_discount then 0 else v_due - v_paid end, 'payment_date', p_payment_date, 'recorded_at', now());
end $$;

revoke all on function public.clear_receipt_rows(uuid) from public;
revoke all on function public.void_student_fee_receipt(uuid) from public;
revoke all on function public.edit_student_fee_receipt(uuid,numeric,date,boolean) from public;
revoke all on function public.student_fee_income(uuid,date,numeric,date,uuid,uuid) from public;
revoke all on function public.offering_enrollment_counts() from public;
revoke all on function public.collect_student_month_fee(uuid,date,numeric,date,boolean) from public;
revoke all on function public.teacher_roster(uuid) from public;
grant execute on function public.void_student_fee_receipt(uuid) to authenticated;
grant execute on function public.edit_student_fee_receipt(uuid,numeric,date,boolean) to authenticated;
grant execute on function public.offering_enrollment_counts() to authenticated;
grant execute on function public.collect_student_month_fee(uuid,date,numeric,date,boolean) to authenticated;
grant execute on function public.teacher_roster(uuid) to authenticated;

commit;
