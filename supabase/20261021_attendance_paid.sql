-- Attendance roster cards show Paid/Unpaid, synced with fees.
-- attendance_subject_sheet now also returns each student's due for the current
-- month, so the attendance badge matches the Fees/Due figure for any staff role.

begin;

create or replace function public.attendance_subject_sheet(p_course uuid, p_year text, p_date date)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  v_session uuid;
  v_status text;
  v_students jsonb;
begin
  if (select auth.uid()) is null then raise exception 'authentication required'; end if;
  if not public.is_staff() then raise exception 'attendance access denied'; end if;
  v_session := public.get_or_create_subject_session(p_course, p_year, p_date);
  select status into v_status from public.class_sessions where id = v_session;
  with member as (
    select st.id from public.enrollments e
      join public.students st on st.id = e.student_id
     where e.course_id = p_course and st.year_level = p_year
       and st.status = 'active' and st.deleted_at is null
    union
    select st.id from public.courses pkg
      join public.enrollments e on e.course_id = pkg.id
      join public.students st on st.id = e.student_id
     where pkg.type = 'package' and p_course = any(pkg.included_subject_ids)
       and st.year_level = p_year and st.status = 'active' and st.deleted_at is null
  )
  select coalesce(jsonb_agg(jsonb_build_object(
    'id', st.id, 'name', st.name, 'studentNumber', st.student_number,
    'college', st.college, 'group', st.group_name, 'year', st.year_level,
    'attendance', ca.status, 'phone', st.phone, 'whatsapp', st.whatsapp,
    'guardian', st.guardian, 'guardian_phone', st.guardian_phone, 'address', st.address,
    'due', coalesce((
      select sum(greatest(0,
        i.agreed_fee
        - coalesce((select sum(p.amount) from public.student_fee_payments p where p.invoice_id = i.id), 0)
        - coalesce((select sum(d.amount) from public.student_fee_discounts d where d.invoice_id = i.id), 0)
      ))
      from public.student_fee_invoices i
      where i.student_id = st.id and i.billing_month = date_trunc('month', current_date)::date
    ), 0)
  ) order by st.name), '[]'::jsonb)
  into v_students
  from member m
  join public.students st on st.id = m.id
  left join public.class_attendance ca on ca.session_id = v_session and ca.student_id = st.id;
  return jsonb_build_object('sessionId', v_session, 'held', v_status = 'held', 'students', v_students);
end $$;

revoke all on function public.attendance_subject_sheet(uuid,text,date) from public;
grant execute on function public.attendance_subject_sheet(uuid,text,date) to authenticated;

commit;
