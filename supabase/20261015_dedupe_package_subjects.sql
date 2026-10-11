-- Deduplicate subject enrollments covered by a selected package.
-- Students who took "Bangla, English & ICT" (or any package) and also have
-- the individual subjects enrolled keep ONLY the package; unused invoices
-- for the covered subjects are removed so billing follows the package.

begin;

delete from public.enrollments e
using public.courses pkg
where pkg.type = 'package'
  and e.course_id = any(pkg.included_subject_ids)
  and exists (
    select 1 from public.enrollments pe
    where pe.student_id = e.student_id and pe.course_id = pkg.id
  );

delete from public.student_fee_invoices i
using public.courses pkg
where pkg.type = 'package'
  and i.course_id = any(pkg.included_subject_ids)
  and exists (
    select 1 from public.enrollments pe
    where pe.student_id = i.student_id and pe.course_id = pkg.id
  )
  and not exists (select 1 from public.student_fee_payments sp where sp.invoice_id = i.id)
  and not exists (select 1 from public.student_fee_discounts d where d.invoice_id = i.id);

-- Keep it impossible going forward: the save RPC drops subject rows that a
-- package in the same payload already covers.
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

  insert into public.admission_payments(student_id,required_amount,amount_paid,received_by)
  values(v_student,v_required,0,v_user)
  on conflict (student_id) do update set required_amount = excluded.required_amount;
  return v_student;
end $$;

revoke all on function public.save_student_with_admission(jsonb,jsonb) from public;
grant execute on function public.save_student_with_admission(jsonb,jsonb) to authenticated;

commit;
