-- Package-to-subject membership + subject-aware attendance.
--
-- A package (Science Full, Commerce Full, ...) contains subjects. Students
-- enrolled in a package must appear in each included subject's class roster
-- as well as in the package's own roster, without appearing twice.
--
-- Re-run safe.

begin;

alter table public.courses
  add column if not exists included_subject_ids uuid[] not null default '{}'::uuid[];

-- Backfill the fixed packages requested for Medha by normalized subject name.
update public.courses pkg
set included_subject_ids = map.ids
from (
  select p.id,
    coalesce(array_agg(distinct s.id) filter (where s.id is not null), '{}'::uuid[]) as ids
  from public.courses p
  left join public.courses s
    on s.type = 'subject'
   and (
     (p.name ilike '%science%full%'
       and lower(regexp_replace(s.name, '[^a-zA-Z0-9]+', '', 'g'))
           in ('physics','chemistry','biology','highermath','math','bangla','english','ict'))
     or (p.name ilike '%commerce%full%'
       and lower(regexp_replace(s.name, '[^a-zA-Z0-9]+', '', 'g'))
           in ('accounting','finance','accountingfinance','bangla','english','ict'))
     or (p.name ilike '%physics%chemistry%biology%'
       and lower(regexp_replace(s.name, '[^a-zA-Z0-9]+', '', 'g'))
           in ('physics','chemistry','biology','highermath','math'))
     or (p.name ilike '%bangla%english%ict%'
       and lower(regexp_replace(s.name, '[^a-zA-Z0-9]+', '', 'g'))
           in ('bangla','english','ict'))
     or (p.name ilike '%accounting%finance%'
       and lower(regexp_replace(s.name, '[^a-zA-Z0-9]+', '', 'g'))
           in ('accounting','finance','accountingfinance'))
   )
  where p.type = 'package'
  group by p.id
) map
where pkg.id = map.id
  and pkg.type = 'package'
  and cardinality(pkg.included_subject_ids) = 0;

-- Roster: direct enrollment in the offered course, plus package members when a
-- subject is offered. DISTINCT keeps a student who took both from duplicating.
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

  with chosen as (
    select s.id as session_id, o.course_id, o.year_level, o.group_name,
           c.type as course_type
    from public.class_sessions s
    join public.course_offerings o on o.id = s.offering_id
    join public.courses c on c.id = o.course_id
    where s.id = p_session
  ), matched as (
    select st.id
    from chosen ch
    join public.enrollments e on e.course_id = ch.course_id
    join public.students st on st.id = e.student_id
      and st.year_level = ch.year_level and st.group_name = ch.group_name
      and st.status = 'active' and st.deleted_at is null
    union
    select st.id
    from chosen ch
    join public.courses pkg
      on pkg.type = 'package'
     and ch.course_type = 'subject'
     and ch.course_id = any(pkg.included_subject_ids)
    join public.enrollments e on e.course_id = pkg.id
    join public.students st on st.id = e.student_id
      and st.year_level = ch.year_level and st.group_name = ch.group_name
      and st.status = 'active' and st.deleted_at is null
  )
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
  from matched m
  join public.students st on st.id = m.id
  left join public.class_attendance ca
    on ca.session_id = (select session_id from chosen) and ca.student_id = st.id;
  return v_result;
end $$;

-- Counts: a subject offering counts direct enrollments plus students from any
-- package that includes it; a package offering counts its own enrollees.
create or replace function public.offering_enrollment_counts()
returns setof jsonb language plpgsql stable security definer set search_path = '' as $$
begin
  if (select auth.uid()) is null then raise exception 'authentication required'; end if;
  return query
  select jsonb_build_object('offeringId', o.id, 'count',
    case when c.type = 'package' then
      (select count(distinct st.id)
         from public.enrollments e
         join public.students st on st.id = e.student_id
        where e.course_id = o.course_id
          and st.year_level = o.year_level and st.group_name = o.group_name
          and st.status = 'active' and st.deleted_at is null)
    else
      (select count(distinct st.id)
         from public.enrollments e
         join public.students st on st.id = e.student_id
        where e.course_id = o.course_id
          and st.year_level = o.year_level and st.group_name = o.group_name
          and st.status = 'active' and st.deleted_at is null)
      + (select count(distinct st.id)
           from public.courses pkg
           join public.enrollments e on e.course_id = pkg.id
           join public.students st on st.id = e.student_id
          where pkg.type = 'package'
            and o.course_id = any(pkg.included_subject_ids)
            and st.year_level = o.year_level and st.group_name = o.group_name
            and st.status = 'active' and st.deleted_at is null)
    end)
  from public.course_offerings o
  join public.courses c on c.id = o.course_id
  where o.active and (public.is_admin() or o.teacher_id = (select auth.uid()));
end $$;

revoke all on function public.teacher_roster(uuid) from public;
revoke all on function public.offering_enrollment_counts() from public;
grant execute on function public.teacher_roster(uuid) to authenticated;
grant execute on function public.offering_enrollment_counts() to authenticated;

commit;
