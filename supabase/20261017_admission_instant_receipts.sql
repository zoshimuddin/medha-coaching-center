-- Admission fee collected at admission time:
-- - Creating a student deposits the admission fee immediately (fully paid
--   admission row), posts an "Admission fee" income entry dated the admission
--   date, and generates an admission receipt so it shows in collection history
--   and reports (2 admissions today = ৳1000 admission income today).
-- - Every student admitted so far gets their admission receipt back-filled.
-- - Receipts gain a kind column ('month' by default, 'admission' for these).

begin;

-- 1. Receipt kind discriminator: existing rows are monthly collections.
alter table public.student_fee_receipts
  add column if not exists kind text not null default 'month';

-- 2. New students deposit the admission fee on the spot.
create or replace function public.save_student_with_admission(p_student jsonb, p_enrollments jsonb)
returns uuid language plpgsql security definer set search_path = '' as $$
declare
  v_user uuid := (select auth.uid());
  v_student uuid;
  v_required numeric(12,2);
  v_row jsonb;
  v_course uuid;
  v_fee numeric(12,2);
  v_existing_status text;
  v_status text;
  v_admission_date date;
begin
  if v_user is null then raise exception 'authentication required'; end if;
  if not (public.is_admin() or (public.current_role()='editor' and public.has_user_tab('students'))) then raise exception 'student access denied'; end if;
  if jsonb_typeof(p_student) <> 'object' or jsonb_typeof(p_enrollments) <> 'array' then raise exception 'invalid student payload'; end if;
  if coalesce(trim(p_student->>'name'),'')='' or coalesce(trim(p_student->>'phone'),'')='' then raise exception 'name and phone are required'; end if;
  if p_student->>'year_level' not in ('1st year','2nd year') then raise exception 'valid year is required'; end if;
  if nullif(p_student->>'gender','') is not null and p_student->>'gender' not in ('female','male','other','prefer_not_to_say') then raise exception 'invalid gender'; end if;
  if nullif(p_student->>'birthday','') is not null and (p_student->>'birthday')::date > current_date then raise exception 'birthday cannot be in the future'; end if;
  if coalesce(trim(p_student->>'college'),'')='' or coalesce(trim(p_student->>'group_name'),'')='' then raise exception 'college and group are required'; end if;
  if jsonb_array_length(p_enrollments)=0 then raise exception 'at least one course is required'; end if;
  if coalesce(p_student->>'status','active') not in ('active','inactive') then raise exception 'invalid student status'; end if;

  select s.admission_fee into v_required from public.coaching_settings s where s.id=true;
  v_required := coalesce(v_required,0);

  v_student := coalesce(nullif(p_student->>'id','')::uuid, gen_random_uuid());
  select st.status, st.admission_date into v_existing_status, v_admission_date from public.students st where st.id=v_student;
  v_status := case when v_existing_status is null then 'active' else coalesce(nullif(p_student->>'status',''),v_existing_status) end;
  v_admission_date := coalesce(nullif(p_student->>'admission_date','')::date, v_admission_date, current_date);
  if v_existing_status is null then
    insert into public.students(id,name,phone,guardian,guardian_phone,whatsapp,college,batch_id,paid,address,year_level,group_name,status,gender,birthday,admission_date,created_at)
    values (v_student, trim(p_student->>'name'), trim(p_student->>'phone'), coalesce(p_student->>'guardian',''), coalesce(p_student->>'guardian_phone',''), coalesce(p_student->>'whatsapp',''), trim(p_student->>'college'), nullif(p_student->>'batch_id','')::uuid, coalesce((p_student->>'paid')::numeric,0), coalesce(p_student->>'address',''), p_student->>'year_level', p_student->>'group_name', v_status, coalesce(p_student->>'gender',''), nullif(p_student->>'birthday','')::date, v_admission_date, now());
  else
    update public.students set name=trim(p_student->>'name'), phone=trim(p_student->>'phone'), guardian=coalesce(p_student->>'guardian',''), guardian_phone=coalesce(p_student->>'guardian_phone',''), whatsapp=coalesce(p_student->>'whatsapp',''), college=trim(p_student->>'college'), batch_id=nullif(p_student->>'batch_id','')::uuid, address=coalesce(p_student->>'address',''), year_level=p_student->>'year_level', group_name=p_student->>'group_name', status=v_status, gender=coalesce(p_student->>'gender',''), birthday=nullif(p_student->>'birthday','')::date, admission_date=v_admission_date
    where id=v_student;
  end if;

  delete from public.enrollments where student_id=v_student;
  for v_row in select * from jsonb_array_elements(p_enrollments) loop
    v_course := (v_row->>'course_id')::uuid;
    v_fee := (v_row->>'fee')::numeric;
    if v_fee < 0 then raise exception 'course fee cannot be negative'; end if;
    -- A subject covered by a package in the same payload is skipped: the
    -- package carries those subjects (no duplicate enrollment or billing).
    if exists (
      select 1
      from jsonb_array_elements(p_enrollments) x
      join public.courses pkg on pkg.id = (x->>'course_id')::uuid
      where pkg.type = 'package'
        and (x->>'course_id')::uuid <> v_course
        and v_course = any(pkg.included_subject_ids)
    ) then
      continue;
    end if;
    insert into public.enrollments(student_id,course_id,fee) values(v_student,v_course,v_fee);
    if v_status = 'active' then
      insert into public.student_fee_invoices(student_id,course_id,billing_month,agreed_fee)
      values(v_student,v_course,date_trunc('month', current_date)::date,v_fee)
      on conflict(student_id,course_id,billing_month) do update set agreed_fee=excluded.agreed_fee;
    end if;
  end loop;

  -- The admission fee is collected at admission: the admission row is stored
  -- fully paid, with its own receipt and income entry on the admission date.
  -- Re-saving a student never resets or duplicates a collection.
  if v_required > 0 and v_status = 'active' then
    insert into public.admission_payments(student_id,required_amount,amount_paid,received_by,paid_at)
    values(v_student,v_required,v_required,v_user,coalesce((
      select ap.paid_at from public.admission_payments ap where ap.student_id=v_student
    ), now()))
    on conflict (student_id) do update set required_amount = excluded.required_amount;
    if v_existing_status is null then
      insert into public.student_fee_receipts(receipt_id,student_id,billing_month,paid_amount,discount_amount,remaining_amount,payment_date,received_by,kind)
      values(gen_random_uuid(),v_student,date_trunc('month',v_admission_date),v_required,0,0,v_admission_date,v_user,'admission');
      insert into public.money_entries(date, type, category, amount, note, by_username)
      values(v_admission_date, 'income', 'Admission fee', v_required,
        coalesce((select trim(st.name) || ' (' || st.student_number || ')' from public.students st where st.id=v_student),''),
        coalesce((select pr.username from public.profiles pr where pr.id=v_user), ''));
    end if;
  else
    insert into public.admission_payments(student_id,required_amount,amount_paid,received_by)
    values(v_student,v_required,0,v_user)
    on conflict (student_id) do update set required_amount = excluded.required_amount;
  end if;
  return v_student;
end $$;

-- 3. Collecting a pending admission (legacy path) also generates its receipt.
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
  insert into public.student_fee_receipts(receipt_id,student_id,billing_month,paid_amount,discount_amount,remaining_amount,payment_date,received_by,kind)
  values(gen_random_uuid(),p_student,date_trunc('month',p_payment_date),v_amount,0,0,p_payment_date,v_user,'admission');
  return jsonb_build_object('paid', v_amount, 'remaining', v_required - v_paid - v_amount);
end $$;

-- 4. Deleting an admission receipt reverses the admission deposit; deleting a
--    monthly receipt no longer undoes the admission (it was collected at
--    admission, not with the first month).
create or replace function public.void_student_fee_receipt(p_receipt uuid)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  v_user uuid := (select auth.uid());
  v_paid numeric(12,2) := 0;
  v_student uuid;
  v_month date;
  v_kind text;
  v_note text;
begin
  if v_user is null then raise exception 'authentication required'; end if;
  if not public.is_super_admin() then raise exception 'admin access required'; end if;
  select student_id, billing_month, kind into v_student, v_month, v_kind from public.student_fee_receipts where receipt_id = p_receipt;
  if not found then raise exception 'receipt not found'; end if;
  v_paid := public.clear_receipt_rows(p_receipt);
  if v_paid > 0 then
    update public.students set paid = greatest(0, coalesce(paid, 0) - v_paid) where id = v_student;
  end if;

  -- An admission receipt carries the deposit: delete it and the admission
  -- becomes pending again and its income entry is removed.
  if v_kind = 'admission' then
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

-- 5. Back-fill: every student whose admission fee was recorded as deposited
--    gets their admission receipt (dated from the admission date).
insert into public.student_fee_receipts(receipt_id,student_id,billing_month,paid_amount,discount_amount,remaining_amount,payment_date,received_by,kind)
select gen_random_uuid(), ap.student_id,
  date_trunc('month', coalesce(st.admission_date, (ap.paid_at)::date, current_date)),
  ap.required_amount, 0, 0,
  coalesce(st.admission_date, (ap.paid_at)::date, current_date),
  ap.received_by, 'admission'
from public.admission_payments ap
join public.students st on st.id = ap.student_id and st.deleted_at is null
where ap.required_amount > 0
  and ap.amount_paid >= ap.required_amount
  and not exists (
    select 1 from public.student_fee_receipts r
    where r.student_id = ap.student_id and r.kind = 'admission'
  );

revoke all on function public.save_student_with_admission(jsonb,jsonb) from public;
revoke all on function public.collect_student_admission(uuid,numeric,date) from public;
revoke all on function public.void_student_fee_receipt(uuid) from public;
grant execute on function public.save_student_with_admission(jsonb,jsonb) to authenticated;
grant execute on function public.collect_student_admission(uuid,numeric,date) to authenticated;
grant execute on function public.void_student_fee_receipt(uuid) to authenticated;

commit;
