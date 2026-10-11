-- Reliable user management via SQL RPCs (no edge function dependency).
-- admin_create_user  — create Auth user + identity + profile in one call
-- admin_attach_user  — self-heal: attach/confirm an existing Auth account
-- admin_delete_user  — remove an Auth user (profile follows by cascade)
-- All three are super-admin-only and replicate exactly what the working
-- manually-created accounts use (bcrypt hash, email identity, instance_id).

begin;

create or replace function public.admin_create_user(
  p_username text, p_email text, p_password text,
  p_role text, p_tabs jsonb, p_money_edit boolean,
  p_field_grants jsonb, p_payroll_access boolean, p_student_id uuid
)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  v_uid uuid;
  v_email text := lower(btrim(coalesce(p_email, '')));
  v_username text := lower(btrim(coalesce(p_username, '')));
begin
  if not public.is_super_admin() then raise exception 'admin access required'; end if;
  if v_username = '' then raise exception 'username is required'; end if;
  if v_email = '' then raise exception 'email is required'; end if;
  if length(coalesce(p_password, '')) < 6 then raise exception 'password must be at least 6 characters'; end if;
  if not (p_role in ('admin','subadmin','editor','viewer','accountant','teacher','student')) then raise exception 'invalid role'; end if;
  if exists (select 1 from public.profiles where lower(username) = v_username) then raise exception 'username already exists'; end if;
  if exists (select 1 from auth.users where lower(email) = v_email) then raise exception 'an account with this email already exists'; end if;
  if p_role = 'student' and p_student_id is null then raise exception 'link a student for the student role'; end if;

  v_uid := gen_random_uuid();
  insert into auth.users (id, aud, role, email, encrypted_password, email_confirmed_at,
      instance_id, raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change, email_change_token_new,
      email_change_token_current, reauthentication_token, phone_change, created_at, updated_at)
  values (v_uid, 'authenticated', 'authenticated', v_email,
    extensions.crypt(p_password, extensions.gen_salt('bf')),
    now(), '00000000-0000-0000-0000-000000000000',
    '{"provider":"email","providers":["email"]}'::jsonb,
    jsonb_build_object('email_verified', true, 'provider', 'email', 'providers', jsonb_build_array('email')),
    '', '', '', '', '', '', '', now(), now());

  insert into auth.identities (id, user_id, provider_id, provider, identity_data, last_sign_in_at, created_at, updated_at)
  values (gen_random_uuid(), v_uid, v_uid::text, 'email',
    jsonb_build_object('sub', v_uid::text, 'email', v_email, 'email_verified', true, 'phone_verified', false),
    now(), now(), now());

  insert into public.profiles (id, username, role, tabs, money_edit, student_field_grants, teacher_payroll_access, student_id)
  values (v_uid, v_username, p_role, coalesce(p_tabs, '["dashboard"]'::jsonb), coalesce(p_money_edit, false),
    coalesce(p_field_grants, '[]'::jsonb), coalesce(p_payroll_access, false), p_student_id);

  return jsonb_build_object('id', v_uid);
end $$;

create or replace function public.admin_attach_user(
  p_email text, p_username text, p_password text,
  p_role text, p_tabs jsonb, p_money_edit boolean,
  p_field_grants jsonb, p_payroll_access boolean, p_student_id uuid
)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  v_uid uuid;
  v_email text := lower(btrim(coalesce(p_email, '')));
  v_username text := lower(btrim(coalesce(p_username, '')));
begin
  if not public.is_super_admin() then raise exception 'admin access required'; end if;
  if v_email = '' then raise exception 'email is required'; end if;
  select id into v_uid from auth.users where lower(email) = v_email order by created_at limit 1;
  if v_uid is null then raise exception 'no Auth user found for this email'; end if;

  if length(coalesce(p_password, '')) >= 6 then
    update auth.users
      set encrypted_password = extensions.crypt(p_password, extensions.gen_salt('bf')),
          email_confirmed_at = coalesce(email_confirmed_at, now()),
          instance_id = coalesce(instance_id, '00000000-0000-0000-0000-000000000000'::uuid),
          confirmation_token = '', recovery_token = '', email_change = '',
          email_change_token_new = '', email_change_token_current = '',
          updated_at = now()
    where id = v_uid;
  else
    update auth.users
      set email_confirmed_at = coalesce(email_confirmed_at, now()),
          instance_id = coalesce(instance_id, '00000000-0000-0000-0000-000000000000'::uuid),
          confirmation_token = '', recovery_token = '', email_change = '',
          email_change_token_new = '', email_change_token_current = '',
          updated_at = now()
    where id = v_uid;
  end if;

  update auth.identities
    set provider_id = user_id::text,
        identity_data = jsonb_build_object('sub', user_id::text, 'email', v_email, 'email_verified', true, 'phone_verified', false),
        updated_at = now()
  where user_id = v_uid and provider = 'email';

  update public.profiles
    set username = coalesce(nullif(v_username, ''), username),
        role = coalesce(p_role, role),
        tabs = coalesce(p_tabs, tabs),
        money_edit = coalesce(p_money_edit, money_edit),
        student_field_grants = coalesce(p_field_grants, student_field_grants),
        teacher_payroll_access = coalesce(p_payroll_access, teacher_payroll_access),
        student_id = coalesce(p_student_id, student_id)
  where id = v_uid;

  if not found then
    insert into public.profiles (id, username, role, tabs, money_edit, student_field_grants, teacher_payroll_access, student_id)
    values (v_uid, coalesce(nullif(v_username, ''), split_part(v_email, '@', 1)),
      coalesce(p_role, 'viewer'), coalesce(p_tabs, '["dashboard"]'::jsonb), coalesce(p_money_edit, false),
      coalesce(p_field_grants, '[]'::jsonb), coalesce(p_payroll_access, false), p_student_id);
  end if;

  return jsonb_build_object('id', v_uid, 'attached', true);
end $$;

create or replace function public.admin_delete_user(p_target uuid)
returns jsonb language plpgsql security definer set search_path = '' as $$
begin
  if not public.is_super_admin() then raise exception 'admin access required'; end if;
  if p_target is null or p_target = (select auth.uid()) then raise exception 'invalid target user'; end if;
  if exists (select 1 from public.profiles where id = p_target and role = 'admin') then
    raise exception 'super admin cannot be deleted';
  end if;
  delete from auth.users where id = p_target;
  if not found then raise exception 'user not found'; end if;
  return jsonb_build_object('ok', true);
end $$;

revoke all on function public.admin_create_user(text,text,text,text,jsonb,boolean,jsonb,boolean,uuid) from public;
revoke all on function public.admin_attach_user(text,text,text,text,jsonb,boolean,jsonb,boolean,uuid) from public;
revoke all on function public.admin_delete_user(uuid) from public;
grant execute on function public.admin_create_user(text,text,text,text,jsonb,boolean,jsonb,boolean,uuid) to authenticated;
grant execute on function public.admin_attach_user(text,text,text,text,jsonb,boolean,jsonb,boolean,uuid) to authenticated;
grant execute on function public.admin_delete_user(uuid) to authenticated;

commit;
