-- Fee sync fixes.
-- 1. Changing a course/package price propagates to every student and every
--    billing month: enrollments.fee and student_fee_invoices.agreed_fee are
--    updated for that course. New months bill the new price too, because
--    ensure_month_invoices() reads enrollments.fee.
-- 2. Editing a student removes the unpaid fee rows of any course that was
--    dropped, so a removed course stops showing in Fees/Due everywhere.
--    Invoices that already have payments/discounts are kept as collection
--    history (deleting them would cascade-delete their receipts/payments).

begin;

-- 1. Price change -> every enrollment and every month's invoice.
create or replace function public.sync_course_fee() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if new.fee is distinct from old.fee then
    update public.enrollments           set fee = new.fee        where course_id = new.id;
    update public.student_fee_invoices  set agreed_fee = new.fee where course_id = new.id;
  end if;
  return new;
end $$;

drop trigger if exists courses_fee_sync on public.courses;
create trigger courses_fee_sync
  after update of fee on public.courses
  for each row execute function public.sync_course_fee();

-- 2. Student save: same as 20261017_admission_instant_receipts, plus cleanup of
--    dropped courses' unpaid invoices.
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

  -- Dropped courses: remove their unpaid invoice rows so they no longer show in
  -- Fees/Due. Invoices with payments/discounts are kept (collection history).
  delete from public.student_fee_invoices inv
  where inv.student_id = v_student
    and not exists (select 1 from public.enrollments e
                    where e.student_id = inv.student_id and e.course_id = inv.course_id)
    and not exists (select 1 from public.student_fee_payments p where p.invoice_id = inv.id)
    and not exists (select 1 from public.student_fee_discounts d where d.invoice_id = inv.id);

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

revoke all on function public.save_student_with_admission(jsonb,jsonb) from public;
grant execute on function public.save_student_with_admission(jsonb,jsonb) to authenticated;

commit;
