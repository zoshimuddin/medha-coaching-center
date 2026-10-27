-- New attendance flow: year -> subject -> take/history, from the Courses tab.
-- Attendance no longer needs a weekly Schedule (course_offerings); a class
-- session can now belong to a subject + year directly and any staff role can
-- take attendance.

begin;

-- Sessions may reference a subject + year instead of an offering.
alter table public.class_sessions alter column offering_id drop not null;
alter table public.class_sessions add column if not exists course_id uuid references public.courses(id) on delete cascade;
alter table public.class_sessions add column if not exists year_level text;

create unique index if not exists class_sessions_subject_uniq
  on public.class_sessions (course_id, year_level, class_date) where offering_id is null;

-- "Any staff" helper: every role except student.
create or replace function public.is_staff() returns boolean
language sql stable security definer set search_path = '' as $$
  select coalesce(public.current_role() in
    ('admin','subadmin','editor','viewer','accountant','teacher'), false);
$$;

-- Find or create the subject session for a date.
create or replace function public.get_or_create_subject_session(p_course uuid, p_year text, p_date date)
returns uuid language plpgsql security definer set search_path = '' as $$
declare v_session uuid;
begin
  if (select auth.uid()) is null then raise exception 'authentication required'; end if;
  if not public.is_staff() then raise exception 'attendance access denied'; end if;
  if p_year not in ('1st year','2nd year') then raise exception 'invalid year'; end if;
  if not exists (select 1 from public.courses where id = p_course and type = 'subject') then
    raise exception 'not a subject'; end if;
  insert into public.class_sessions(offering_id, course_id, year_level, class_date, rate_snapshot)
  values (null, p_course, p_year, p_date, 0)
  on conflict (course_id, year_level, class_date) where offering_id is null
  do update set course_id = excluded.course_id
  returning id into v_session;
  return v_session;
end $$;

-- Roster (with any saved marks) for a subject + year + date. Package students
-- whose package includes the subject are included.
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
    'guardian', st.guardian, 'guardian_phone', st.guardian_phone, 'address', st.address
  ) order by st.name), '[]'::jsonb)
  into v_students
  from member m
  join public.students st on st.id = m.id
  left join public.class_attendance ca on ca.session_id = v_session and ca.student_id = st.id;
  return jsonb_build_object('sessionId', v_session, 'held', v_status = 'held', 'students', v_students);
end $$;

-- Save attendance for a subject session.
create or replace function public.mark_subject_attendance(p_session uuid, p_records jsonb, p_held boolean default true)
returns void language plpgsql security definer set search_path = '' as $$
declare
  v_session public.class_sessions%rowtype;
  v_rec jsonb;
  v_student uuid;
  v_status text;
begin
  if (select auth.uid()) is null then raise exception 'authentication required'; end if;
  if not public.is_staff() then raise exception 'attendance access denied'; end if;
  select * into v_session from public.class_sessions where id = p_session for update;
  if not found then raise exception 'session not found'; end if;
  if v_session.offering_id is not null then raise exception 'not a subject session'; end if;
  if jsonb_typeof(p_records) <> 'array' then raise exception 'records must be an array'; end if;

  for v_rec in select * from jsonb_array_elements(p_records) loop
    v_student := (v_rec->>'student_id')::uuid;
    v_status  := v_rec->>'status';
    if v_status not in ('present','absent') then raise exception 'invalid attendance status'; end if;
    if not exists (
      select 1 from public.students st
       where st.id = v_student and st.year_level = v_session.year_level
         and st.status = 'active' and st.deleted_at is null
         and (
           exists (select 1 from public.enrollments e
                    where e.student_id = st.id and e.course_id = v_session.course_id)
           or exists (select 1 from public.courses pkg
                        join public.enrollments e on e.course_id = pkg.id
                       where pkg.type = 'package'
                         and v_session.course_id = any(pkg.included_subject_ids)
                         and e.student_id = st.id)
         )
    ) then raise exception 'student is outside this class roster'; end if;
    insert into public.class_attendance(session_id, student_id, status, marked_by)
    values (p_session, v_student, v_status, (select auth.uid()))
    on conflict (session_id, student_id) do update
      set status = excluded.status, marked_by = excluded.marked_by, marked_at = now();
  end loop;

  if p_held then
    update public.class_sessions
      set status = 'held', held_by = (select auth.uid()), held_at = now()
      where id = p_session;
  end if;
end $$;

-- Date-wise history for a subject + year.
create or replace function public.subject_attendance_days(p_course uuid, p_year text)
returns jsonb language plpgsql stable security definer set search_path = '' as $$
declare v jsonb;
begin
  if (select auth.uid()) is null then raise exception 'authentication required'; end if;
  if not public.is_staff() then raise exception 'attendance access denied'; end if;
  select coalesce(jsonb_agg(row order by d desc), '[]'::jsonb) into v from (
    select s.class_date as d,
      jsonb_build_object('date', s.class_date, 'status', s.status,
        'present', count(*) filter (where ca.status = 'present'),
        'absent',  count(*) filter (where ca.status = 'absent'),
        'total',   count(ca.id)) as row
    from public.class_sessions s
    left join public.class_attendance ca on ca.session_id = s.id
    where s.course_id = p_course and s.year_level = p_year and s.status = 'held'
    group by s.id, s.class_date, s.status
  ) t;
  return v;
end $$;

-- Subject list for a year (direct enrollments + package-included subjects).
create or replace function public.attendance_year_subjects(p_year text)
returns jsonb language plpgsql stable security definer set search_path = '' as $$
declare v jsonb;
begin
  if (select auth.uid()) is null then raise exception 'authentication required'; end if;
  if not public.is_staff() then raise exception 'attendance access denied'; end if;
  if p_year not in ('1st year','2nd year') then raise exception 'invalid year'; end if;
  with students_of_year as (
    select st.id from public.students st
     where st.year_level = p_year and st.status = 'active' and st.deleted_at is null
  ), subject_students as (
    select e.course_id as course_id, e.student_id as student_id
      from public.enrollments e
      join students_of_year sy on sy.id = e.student_id
      join public.courses c on c.id = e.course_id and c.type = 'subject'
    union
    select sub.subject_id, e.student_id
      from public.enrollments e
      join students_of_year sy on sy.id = e.student_id
      join public.courses pkg on pkg.id = e.course_id and pkg.type = 'package'
      cross join lateral unnest(pkg.included_subject_ids) as sub(subject_id)
  )
  select coalesce(jsonb_agg(jsonb_build_object(
    'courseId', c.id, 'name', c.name, 'count', t.cnt) order by c.name), '[]'::jsonb)
  into v
  from (select course_id, count(distinct student_id) as cnt from subject_students group by course_id) t
  join public.courses c on c.id = t.course_id
  where c.type = 'subject';
  return v;
end $$;

revoke all on function public.get_or_create_subject_session(uuid,text,date) from public;
revoke all on function public.attendance_subject_sheet(uuid,text,date) from public;
revoke all on function public.mark_subject_attendance(uuid,jsonb,boolean) from public;
revoke all on function public.subject_attendance_days(uuid,text) from public;
revoke all on function public.attendance_year_subjects(text) from public;
grant execute on function public.get_or_create_subject_session(uuid,text,date) to authenticated;
grant execute on function public.attendance_subject_sheet(uuid,text,date) to authenticated;
grant execute on function public.mark_subject_attendance(uuid,jsonb,boolean) to authenticated;
grant execute on function public.subject_attendance_days(uuid,text) to authenticated;
grant execute on function public.attendance_year_subjects(text) to authenticated;

-- Every staff role (accountant added) may read course/subject names.
drop policy if exists "signed-in read courses" on public.courses;
create policy "signed-in read courses" on public.courses for select to authenticated using (
  public.current_role() in ('admin','subadmin','editor','viewer','teacher','student','accountant')
);

commit;
