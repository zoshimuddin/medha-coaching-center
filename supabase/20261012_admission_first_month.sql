-- Admission fee collected with the first month's fee.
-- - Creating a student records the admission as PENDING (0 paid).
-- - collect_student_admission collects it (once, in any amount up to pending)
--   and posts the money entry automatically.
-- - Existing recorded admissions are reset to pending so every student's next
--   collection shows the admission fee for confirmation.
-- - Removes the unused "HSC Physics" duplicate (Physics already exists).

begin;

alter table public.admission_payments drop constraint if exists admission_payments_check;
alter table public.admission_payments add constraint admission_payments_check
  check (amount_paid >= 0 and amount_paid <= required_amount);

update public.admission_payments set amount_paid = 0;

delete from public.courses where name = 'HSC Physics' and type = 'subject';

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
  select st.status into v_existing_status from public.students st where st.id=v_student;
  v_status := case when v_existing_status is null then 'active' else coalesce(nullif(p_student->>'status',''),v_existing_status) end;
  if v_existing_status is null then
    insert into public.students(id,name,phone,guardian,guardian_phone,whatsapp,college,batch_id,paid,address,year_level,group_name,status,gender,birthday,admission_date,created_at)
    values (v_student, trim(p_student->>'name'), trim(p_student->>'phone'), coalesce(p_student->>'guardian',''), coalesce(p_student->>'guardian_phone',''), coalesce(p_student->>'whatsapp',''), trim(p_student->>'college'), nullif(p_student->>'batch_id','')::uuid, coalesce((p_student->>'paid')::numeric,0), coalesce(p_student->>'address',''), p_student->>'year_level', p_student->>'group_name', v_status, coalesce(p_student->>'gender',''), nullif(p_student->>'birthday','')::date, coalesce(nullif(p_student->>'admission_date','')::date, current_date), now());
  else
    update public.students set name=trim(p_student->>'name'), phone=trim(p_student->>'phone'), guardian=coalesce(p_student->>'guardian',''), guardian_phone=coalesce(p_student->>'guardian_phone',''), whatsapp=coalesce(p_student->>'whatsapp',''), college=trim(p_student->>'college'), batch_id=nullif(p_student->>'batch_id','')::uuid, address=coalesce(p_student->>'address',''), year_level=p_student->>'year_level', group_name=p_student->>'group_name', status=v_status, gender=coalesce(p_student->>'gender',''), birthday=nullif(p_student->>'birthday','')::date, admission_date=coalesce(nullif(p_student->>'admission_date','')::date, public.students.admission_date)
    where id=v_student;
  end if;

  delete from public.enrollments where student_id=v_student;
  for v_row in select * from jsonb_array_elements(p_enrollments) loop
    v_course := (v_row->>'course_id')::uuid;
    v_fee := (v_row->>'fee')::numeric;
    if v_fee < 0 then raise exception 'course fee cannot be negative'; end if;
    insert into public.enrollments(student_id,course_id,fee) values(v_student,v_course,v_fee);
    if v_status = 'active' then
      insert into public.student_fee_invoices(student_id,course_id,billing_month,agreed_fee)
      values(v_student,v_course,date_trunc('month', current_date)::date,v_fee)
      on conflict(student_id,course_id,billing_month) do update set agreed_fee=excluded.agreed_fee;
    end if;
  end loop;

  -- Admission stays pending: it is collected with the first month's fee via
  -- collect_student_admission. Re-saving a student never resets a collection.
  insert into public.admission_payments(student_id,required_amount,amount_paid,received_by)
  values(v_student,v_required,0,v_user)
  on conflict (student_id) do update set required_amount = excluded.required_amount;
  return v_student;
end $$;

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
    set amount_paid = amount_paid + v_amount, received_by = v_user
    where student_id = p_student;
  select coalesce(st.name,'') || ' (' || st.student_number || ')' into v_name
    from public.students st where st.id = p_student;
  insert into public.money_entries(date, type, category, amount, note, by_username)
  values(p_payment_date, 'income', 'Admission fee', v_amount, coalesce(v_name,''),
    coalesce((select pr.username from public.profiles pr where pr.id = v_user), ''));
  return jsonb_build_object('paid', v_amount, 'remaining', v_required - v_paid - v_amount);
end $$;

revoke all on function public.save_student_with_admission(jsonb,jsonb) from public;
revoke all on function public.collect_student_admission(uuid,numeric,date) from public;
grant execute on function public.save_student_with_admission(jsonb,jsonb) to authenticated;
grant execute on function public.collect_student_admission(uuid,numeric,date) to authenticated;

commit;
