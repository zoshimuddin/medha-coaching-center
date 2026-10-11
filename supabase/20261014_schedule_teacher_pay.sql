-- Schedule without groups + teacher pay ledger extras.
-- 1. Offerings are per subject + year only: every group of that year attends
--    together, so group matching is removed from rosters and counts.
-- 2. teacher_adjustments: extra earnings (bonus, bus allowance, extra class)
--    added on top of class-based earnings before payment.

begin;

alter table public.course_offerings
  alter column group_name drop not null;
alter table public.course_offerings
  alter column group_name set default '';

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
    select s.id as session_id, o.course_id, o.year_level, c.type as course_type
    from public.class_sessions s
    join public.course_offerings o on o.id = s.offering_id
    join public.courses c on c.id = o.course_id
    where s.id = p_session
  ), matched as (
    select st.id
    from chosen ch
    join public.enrollments e on e.course_id = ch.course_id
    join public.students st on st.id = e.student_id
      and st.year_level = ch.year_level
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
      and st.year_level = ch.year_level
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
          and st.year_level = o.year_level
          and st.status = 'active' and st.deleted_at is null)
    else
      (select count(distinct st.id)
         from public.enrollments e
         join public.students st on st.id = e.student_id
        where e.course_id = o.course_id
          and st.year_level = o.year_level
          and st.status = 'active' and st.deleted_at is null)
      + (select count(distinct st.id)
           from public.courses pkg
           join public.enrollments e on e.course_id = pkg.id
           join public.students st on st.id = e.student_id
          where pkg.type = 'package'
            and o.course_id = any(pkg.included_subject_ids)
            and st.year_level = o.year_level
            and st.status = 'active' and st.deleted_at is null)
    end)
  from public.course_offerings o
  join public.courses c on c.id = o.course_id
  where o.active and (public.is_admin() or o.teacher_id = (select auth.uid()));
end $$;

create or replace function public.has_payroll_access()
returns boolean language sql stable security definer set search_path = '' as $$
  select public.is_admin()
    or exists (select 1 from public.profiles p
                where p.id = (select auth.uid()) and p.teacher_payroll_access)
$$;

create table if not exists public.teacher_adjustments (
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid not null references public.profiles(id) on delete cascade,
  amount numeric(12,2) not null check (amount > 0),
  note text not null default '',
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);
create index if not exists teacher_adjustments_teacher_idx
  on public.teacher_adjustments(teacher_id, created_at);

alter table public.teacher_adjustments enable row level security;

drop policy if exists "teacher adjustments read" on public.teacher_adjustments;
create policy "teacher adjustments read" on public.teacher_adjustments
  for select to authenticated using (public.has_payroll_access());

drop policy if exists "teacher adjustments write" on public.teacher_adjustments;
create policy "teacher adjustments write" on public.teacher_adjustments
  for all to authenticated
  using (public.has_payroll_access()) with check (public.has_payroll_access());

grant select, insert, update, delete on public.teacher_adjustments to authenticated;

revoke all on function public.teacher_roster(uuid) from public;
revoke all on function public.offering_enrollment_counts() from public;
revoke all on function public.has_payroll_access() from public;
grant execute on function public.teacher_roster(uuid) to authenticated;
grant execute on function public.offering_enrollment_counts() to authenticated;
grant execute on function public.has_payroll_access() to authenticated;

commit;
