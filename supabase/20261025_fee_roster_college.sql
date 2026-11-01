-- Add college and phone to the fee-only student roster so the Reminder and Fees
-- cards can show the college (and the call button) for every fee-capable role.

begin;

create or replace function public.fee_student_roster()
returns setof jsonb language plpgsql stable security definer set search_path = '' as $$
begin
  if (select auth.uid()) is null then raise exception 'authentication required'; end if;
  if not (public.is_admin() or (public.current_role() in ('editor','accountant','viewer') and public.has_user_tab('fees'))) then
    raise exception 'fee access denied';
  end if;
  return query
  select jsonb_build_object('id',st.id,'studentNumber',st.student_number,'name',st.name,
    'yearLevel',st.year_level,'batchId',st.batch_id,'status',st.status,
    'college',st.college,'phone',st.phone)
  from public.students st
  where st.status='active' and st.deleted_at is null
  order by st.name;
end $$;

revoke all on function public.fee_student_roster() from public;
grant execute on function public.fee_student_roster() to authenticated;

commit;
