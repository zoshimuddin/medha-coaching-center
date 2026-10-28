-- Attendance badge shows the unpaid month NAMES (no amount). Return the list of
-- unpaid months so the client can show up to three, e.g. "Unpaid · Jan, Feb".

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
    'due', coalesce(f.due, 0),
    'dueMonths', coalesce(f.months, '[]'::jsonb)
  ) order by st.name), '[]'::jsonb)
  into v_students
  from member m
  join public.students st on st.id = m.id
  left join public.class_attendance ca on ca.session_id = v_session and ca.student_id = st.id
  left join lateral (
    select
      coalesce(sum(greatest(0, t.fee - t.pay - t.disc)), 0) as due,
      coalesce(
        jsonb_agg(t.month_label) filter (where greatest(0, t.fee - t.pay - t.disc) > 0),
        '[]'::jsonb
      ) as months
    from (
      select i.billing_month,
             to_char(i.billing_month, 'YYYY-MM') as month_label,
             i.agreed_fee as fee,
             coalesce((select sum(p.amount) from public.student_fee_payments p where p.invoice_id = i.id), 0) as pay,
             coalesce((select sum(d.amount) from public.student_fee_discounts d where d.invoice_id = i.id), 0) as disc
      from public.student_fee_invoices i
      where i.student_id = st.id
    ) t
  ) f on true;
  return jsonb_build_object('sessionId', v_session, 'held', v_status = 'held', 'students', v_students);
end $$;

revoke all on function public.attendance_subject_sheet(uuid,text,date) from public;
grant execute on function public.attendance_subject_sheet(uuid,text,date) to authenticated;

commit;
