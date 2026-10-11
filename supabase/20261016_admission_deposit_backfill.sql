-- Admission fee: deposit for every existing student, keep it tied to Settings
-- for new entries, and undo the collection when a receipt is deleted so a
-- corrected first-month entry shows the admission again.

begin;

-- 1. Every student in the app is recorded as having paid the admission fee.
update public.admission_payments
set amount_paid = required_amount,
    paid_at = coalesce(paid_at, now())
where amount_paid < required_amount;

-- 2. Post the matching income entry for any admission that has none yet, dated
--    with the student's admission date so reports stay sensible.
insert into public.money_entries (date, type, category, amount, note, by_username)
select coalesce(st.admission_date, current_date), 'income', 'Admission fee', ap.required_amount,
       st.name || ' (' || st.student_number || ')', 'system'
from public.admission_payments ap
join public.students st on st.id = ap.student_id and st.deleted_at is null
where ap.required_amount > 0
  and ap.amount_paid >= ap.required_amount
  and not exists (
    select 1 from public.money_entries m
    where m.category = 'Admission fee'
      and m.note = st.name || ' (' || st.student_number || ')'
  );

-- 3. Collecting stamps the payment time (shown in the profile / receipt).
create or replace function public.collect_student_admission(p_student uuid, p_amount numeric, p_payment_date date)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  v_user uuid := (select auth.uid());
  v_required numeric(12,2);
  v_paid numeric(12,2);
  v_amount numeric(12,2);
  v_name text;
begin
  if v_user is null then raise exception 'authentication required'; end if;
  if not (public.is_admin() or (public.current_role() in ('editor','accountant') and public.has_user_tab('fees'))) then raise exception 'fee access denied'; end if;
  if p_payment_date is null then raise exception 'payment date is required'; end if;
  select coalesce(required_amount,0), coalesce(amount_paid,0)
    into v_required, v_paid
    from public.admission_payments where student_id = p_student;
  if v_required is null then raise exception 'no admission record for this student'; end if;
  v_amount := coalesce(p_amount, 0);
  if v_amount <= 0 then raise exception 'admission amount must be greater than 0'; end if;
  if v_paid + v_amount > v_required then raise exception 'admission amount exceeds pending admission fee'; end if;
  update public.admission_payments
    set amount_paid = amount_paid + v_amount, received_by = v_user, paid_at = now()
    where student_id = p_student;
  select coalesce(st.name,'') || ' (' || st.student_number || ')' into v_name
    from public.students st where st.id = p_student;
  insert into public.money_entries(date, type, category, amount, note, by_username)
  values(p_payment_date, 'income', 'Admission fee', v_amount, coalesce(v_name,''),
    coalesce((select pr.username from public.profiles pr where pr.id = v_user), ''));
  return jsonb_build_object('paid', v_amount, 'remaining', v_required - v_paid - v_amount);
end $$;

-- 4. Deleting a receipt also undoes the admission collection when nothing is
--    left for that student, so re-entering the first month asks for it again.
create or replace function public.void_student_fee_receipt(p_receipt uuid)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  v_user uuid := (select auth.uid());
  v_paid numeric(12,2) := 0;
  v_student uuid;
  v_month date;
  v_note text;
begin
  if v_user is null then raise exception 'authentication required'; end if;
  if not public.is_super_admin() then raise exception 'admin access required'; end if;
  select student_id, billing_month into v_student, v_month from public.student_fee_receipts where receipt_id = p_receipt;
  if not found then raise exception 'receipt not found'; end if;
  v_paid := public.clear_receipt_rows(p_receipt);
  if v_paid > 0 then
    update public.students set paid = greatest(0, coalesce(paid, 0) - v_paid) where id = v_student;
  end if;

  -- No receipts remain for this student: the admission collection is undone.
  if not exists (select 1 from public.student_fee_receipts r where r.student_id = v_student) then
    select st.name || ' (' || st.student_number || ')' into v_note
      from public.students st where st.id = v_student;
    update public.admission_payments
      set amount_paid = 0, paid_at = null
      where student_id = v_student;
    delete from public.money_entries
      where category = 'Admission fee' and note = v_note;
  end if;

  return jsonb_build_object('ok', true);
end $$;

revoke all on function public.collect_student_admission(uuid,numeric,date) from public;
revoke all on function public.void_student_fee_receipt(uuid) from public;
grant execute on function public.collect_student_admission(uuid,numeric,date) to authenticated;
grant execute on function public.void_student_fee_receipt(uuid) to authenticated;

commit;
