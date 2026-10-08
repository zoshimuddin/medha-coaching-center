-- Soft delete for students: deleted students stay in a 30-day trash,
-- visible only to the original admin under Settings.
-- Re-run safe: it only re-creates functions so the DB can be updated in place.

begin;

alter table public.students add column if not exists deleted_at timestamptz;
create index if not exists students_deleted_idx on public.students(deleted_at) where deleted_at is not null;

-- Hide deleted students from every normal read path.
drop policy if exists "student table role read" on public.students;
create policy "student table role read" on public.students for select to authenticated using (
  (deleted_at is null or public.is_super_admin())
  and (public.is_admin() or (public.current_role() in ('editor','viewer') and public.has_user_tab('students')))
);

-- ============ Trash RPCs ============
create or replace function public.soft_delete_student(p_student uuid)
returns void language plpgsql security definer set search_path = '' as $$
declare v_user uuid := (select auth.uid());
begin
  if v_user is null then raise exception 'authentication required'; end if;
  if not (public.is_admin() or (public.current_role() = 'editor' and public.has_user_tab('students'))) then
    raise exception 'student access denied';
  end if;
  update public.students set deleted_at = now() where id = p_student and deleted_at is null;
end $$;

create or replace function public.restore_deleted_student(p_student uuid)
returns void language plpgsql security definer set search_path = '' as $$
declare v_user uuid := (select auth.uid());
begin
  if not public.is_super_admin() then raise exception 'admin access required'; end if;
  update public.students set deleted_at = null where id = p_student and deleted_at is not null;
end $$;

create or replace function public.purge_deleted_students(p_days integer default 30)
returns integer language plpgsql security definer set search_path = '' as $$
declare v_count integer;
begin
  if not public.is_super_admin() then raise exception 'admin access required'; end if;
  with gone as (
    delete from public.students
    where deleted_at is not null
      and deleted_at < now() - make_interval(days => greatest(0, coalesce(p_days, 30)))
    returning 1
  )
  select count(*) into v_count from gone;
  return coalesce(v_count, 0);
end $$;

create or replace function public.delete_student_forever(p_student uuid)
returns void language plpgsql security definer set search_path = '' as $$
declare v_user uuid := (select auth.uid());
begin
  if not public.is_super_admin() then raise exception 'admin access required'; end if;
  delete from public.students where id = p_student and deleted_at is not null;
end $$;

-- ============ Every list/view hides deleted students ============
drop function if exists public.admin_student_roster(integer,integer,text,text);
create or replace function public.admin_student_roster(p_page integer default 0, p_page_size integer default 50, p_query text default '', p_status text default '')
returns setof jsonb language plpgsql stable security definer set search_path = '' as $$
begin
  if not public.is_admin() and not exists(select 1 from public.profiles p where p.id=(select auth.uid()) and (p.tabs ? 'students')) then
    raise exception 'student access denied';
  end if;
  if p_status not in ('', 'active', 'inactive') then raise exception 'invalid student status filter'; end if;
  return query
  select jsonb_build_object('id', st.id, 'studentNumber', st.student_number, 'name', st.name,
    'phone', st.phone, 'whatsapp', st.whatsapp, 'guardian', st.guardian,
    'guardianPhone', st.guardian_phone, 'address', st.address, 'college', st.college,
    'yearLevel', st.year_level, 'groupName', st.group_name, 'batchId', st.batch_id,
    'paid', st.paid, 'status', st.status, 'gender', st.gender, 'birthday', st.birthday,
    'admissionDate', st.admission_date, 'createdAt', st.created_at, 'deletedAt', st.deleted_at,
    'enrollments', coalesce((select jsonb_agg(jsonb_build_object('courseId', e.course_id, 'fee', e.fee)) from public.enrollments e where e.student_id=st.id), '[]'::jsonb))
  from public.students st
  where st.deleted_at is null
    and (p_status = '' or st.status = p_status)
    and (p_query = '' or st.name ilike '%'||p_query||'%' or st.phone ilike '%'||p_query||'%' or st.student_number ilike '%'||p_query||'%')
  order by st.name
  limit greatest(1, least(p_page_size, 100)) offset greatest(0, p_page) * greatest(1, least(p_page_size, 100));
end $$;

create or replace function public.fee_student_roster()
returns setof jsonb language plpgsql stable security definer set search_path = '' as $$
begin
  if (select auth.uid()) is null then raise exception 'authentication required'; end if;
  if not (public.is_admin() or (public.current_role() in ('editor','accountant','viewer') and public.has_user_tab('fees'))) then
    raise exception 'fee access denied';
  end if;
  return query
  select jsonb_build_object('id',st.id,'studentNumber',st.student_number,'name',st.name,
    'yearLevel',st.year_level,'batchId',st.batch_id,'status',st.status)
  from public.students st
  where st.status='active' and st.deleted_at is null
  order by st.name;
end $$;

create or replace function public.ensure_month_invoices(p_month date)
returns integer language plpgsql security definer set search_path = '' as $$
declare v_count integer;
begin
  if (select auth.uid()) is null then raise exception 'authentication required'; end if;
  if not (public.is_admin() or (public.current_role() in ('editor','accountant') and public.has_user_tab('fees'))) then
    raise exception 'fee access denied';
  end if;
  if extract(day from p_month) <> 1 then raise exception 'month must be given as its first day'; end if;
  insert into public.student_fee_invoices(student_id, course_id, billing_month, agreed_fee)
  select e.student_id, e.course_id, p_month, e.fee
  from public.enrollments e
  join public.students st on st.id = e.student_id and st.status = 'active' and st.deleted_at is null
  on conflict (student_id, course_id, billing_month) do nothing;
  get diagnostics v_count = row_count;
  return v_count;
end $$;

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
  from public.class_sessions s
  join public.course_offerings o on o.id = s.offering_id
  join public.students st on st.year_level = o.year_level and st.group_name = o.group_name and st.deleted_at is null
  join public.enrollments e on e.student_id = st.id and e.course_id = o.course_id
  left join public.class_attendance ca on ca.session_id = s.id and ca.student_id = st.id
  where s.id = p_session;
  return v_result;
end $$;

create or replace function public.offering_enrollment_counts()
returns setof jsonb language plpgsql stable security definer set search_path = '' as $$
begin
  if (select auth.uid()) is null then raise exception 'authentication required'; end if;
  return query
  select jsonb_build_object('offeringId', o.id, 'count', coalesce(cnt.c, 0))
  from public.course_offerings o
  left join (
    select e.course_id, st.year_level, st.group_name, count(*) as c
    from public.enrollments e
    join public.students st on st.id = e.student_id and st.status = 'active' and st.deleted_at is null
    group by 1, 2, 3
  ) cnt on cnt.course_id = o.course_id and cnt.year_level = o.year_level and cnt.group_name = o.group_name
  where o.active and (public.is_admin() or o.teacher_id = (select auth.uid()));
end $$;

revoke all on function public.soft_delete_student(uuid) from public;
revoke all on function public.restore_deleted_student(uuid) from public;
revoke all on function public.purge_deleted_students(integer) from public;
revoke all on function public.delete_student_forever(uuid) from public;
revoke all on function public.admin_student_roster(integer,integer,text,text) from public;
revoke all on function public.fee_student_roster() from public;
revoke all on function public.ensure_month_invoices(date) from public;
revoke all on function public.teacher_roster(uuid) from public;
revoke all on function public.offering_enrollment_counts() from public;
grant execute on function public.soft_delete_student(uuid) to authenticated;
grant execute on function public.restore_deleted_student(uuid) to authenticated;
grant execute on function public.purge_deleted_students(integer) to authenticated;
grant execute on function public.delete_student_forever(uuid) to authenticated;
grant execute on function public.admin_student_roster(integer,integer,text,text) to authenticated;
grant execute on function public.fee_student_roster() to authenticated;
grant execute on function public.ensure_month_invoices(date) to authenticated;
grant execute on function public.teacher_roster(uuid) to authenticated;
grant execute on function public.offering_enrollment_counts() to authenticated;

commit;
