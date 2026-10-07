-- Coaching manager expansion migration (additive, preserves existing rows)
-- Run in Supabase SQL Editor only after reviewing this migration.
-- Existing `payments` and `attendance` rows remain intact for historical lookup.

begin;

-- Existing model extensions
alter table public.profiles drop constraint if exists profiles_role_check;
alter table public.profiles add constraint profiles_role_check
  check (role in ('admin', 'editor', 'viewer', 'accountant', 'student', 'teacher'));
alter table public.profiles add column if not exists student_field_grants jsonb not null default '[]'::jsonb;
alter table public.profiles add column if not exists teacher_payroll_access boolean not null default false;
alter table public.students add column if not exists address text not null default '';
alter table public.students add column if not exists year_level text;
alter table public.students add column if not exists group_name text;
alter table public.students add column if not exists status text not null default 'active';
alter table public.batches add column if not exists year_level text;
alter table public.batches add column if not exists group_name text;

-- Editable lists and branding / admission fee settings
create table if not exists public.coaching_settings (
  id boolean primary key default true check (id),
  coaching_name text not null default 'মেধা কোচিং সেন্টার',
  logo_path text,
  admission_fee numeric(12,2) not null default 0 check (admission_fee >= 0),
  colleges jsonb not null default '["Ramganj Govt College","Ramganj Model College","Alia Madrasha"]'::jsonb,
  groups jsonb not null default '["Science","Commerce","Arts","Madrasa"]'::jsonb,
  updated_at timestamptz not null default now()
);
insert into public.coaching_settings (id) values (true) on conflict (id) do nothing;
alter table public.coaching_settings add column if not exists logo_data text;

-- Course/year/group/batch offering, weekly schedule, assigned teacher and per-class rate
create table if not exists public.course_offerings (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete restrict,
  year_level text not null check (year_level in ('1st year', '2nd year')),
  group_name text not null,
  batch_id uuid references public.batches(id) on delete set null,
  teacher_id uuid references public.profiles(id) on delete set null,
  weekdays smallint[] not null default '{}'::smallint[],
  class_time time,
  rate_per_class numeric(12,2) not null default 0 check (rate_per_class >= 0),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  check (weekdays <@ array[0,1,2,3,4,5,6]::smallint[])
);
create index if not exists course_offerings_teacher_idx on public.course_offerings(teacher_id, active);
create index if not exists course_offerings_scope_idx on public.course_offerings(course_id, year_level, group_name, active);

-- New session model permits multiple classes / courses for one student on one day.
create table if not exists public.class_sessions (
  id uuid primary key default gen_random_uuid(),
  offering_id uuid not null references public.course_offerings(id) on delete cascade,
  class_date date not null,
  status text not null default 'scheduled' check (status in ('scheduled', 'held', 'cancelled')),
  held_by uuid references public.profiles(id) on delete set null,
  held_at timestamptz,
  rate_snapshot numeric(12,2) not null check (rate_snapshot >= 0),
  created_at timestamptz not null default now(),
  unique (offering_id, class_date)
);
create index if not exists class_sessions_date_idx on public.class_sessions(class_date, status);
create index if not exists class_sessions_offering_idx on public.class_sessions(offering_id, class_date);

create table if not exists public.class_attendance (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.class_sessions(id) on delete cascade,
  student_id uuid not null references public.students(id) on delete cascade,
  status text not null check (status in ('present', 'absent')),
  marked_by uuid not null references public.profiles(id),
  marked_at timestamptz not null default now(),
  unique (session_id, student_id)
);
create index if not exists class_attendance_student_idx on public.class_attendance(student_id, session_id);

-- Monthly invoice per enrolled course, preserving agreed fee/discount for that month.
create table if not exists public.student_fee_invoices (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete restrict,
  billing_month date not null check (extract(day from billing_month) = 1),
  agreed_fee numeric(12,2) not null check (agreed_fee >= 0),
  created_at timestamptz not null default now(),
  unique (student_id, course_id, billing_month)
);
create index if not exists student_fee_invoices_month_idx on public.student_fee_invoices(billing_month, student_id);

create table if not exists public.student_fee_payments (
  id uuid primary key default gen_random_uuid(),
  invoice_id uuid not null references public.student_fee_invoices(id) on delete cascade,
  amount numeric(12,2) not null check (amount > 0),
  paid_at timestamptz not null default now(),
  received_by uuid references public.profiles(id) on delete set null,
  note text not null default ''
);
create index if not exists student_fee_payments_invoice_idx on public.student_fee_payments(invoice_id, paid_at);

-- Flat admission fee; one paid-in-full record required for active admission.
create table if not exists public.admission_payments (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null unique references public.students(id) on delete cascade,
  required_amount numeric(12,2) not null check (required_amount >= 0),
  amount_paid numeric(12,2) not null check (amount_paid >= required_amount),
  paid_at timestamptz not null default now(),
  received_by uuid references public.profiles(id) on delete set null,
  note text not null default ''
);

-- Teacher class payment ledger. Earned = count(held sessions) * snapshotted rate.
create table if not exists public.teacher_payments (
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid not null references public.profiles(id) on delete restrict,
  amount numeric(12,2) not null check (amount > 0),
  paid_at timestamptz not null default now(),
  paid_by uuid not null references public.profiles(id),
  note text not null default ''
);
create index if not exists teacher_payments_teacher_idx on public.teacher_payments(teacher_id, paid_at);

-- Single bank ledger. Balance is opening balance + deposits - withdrawals.
create table if not exists public.bank_account (
  id boolean primary key default true check (id),
  account_name text not null default 'Main bank',
  opening_balance numeric(14,2) not null default 0,
  updated_at timestamptz not null default now()
);
insert into public.bank_account (id) values (true) on conflict (id) do nothing;

create table if not exists public.bank_transactions (
  id uuid primary key default gen_random_uuid(),
  transaction_date date not null default current_date,
  direction text not null check (direction in ('deposit', 'withdrawal')),
  amount numeric(14,2) not null check (amount > 0),
  description text not null default '',
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now()
);
create index if not exists bank_transactions_date_idx on public.bank_transactions(transaction_date desc);

-- Authorization helpers: SECURITY DEFINER, fixed search_path, no user-controlled SQL.
create or replace function public.current_role()
returns text language sql stable security definer set search_path = '' as $$
  select p.role from public.profiles p where p.id = (select auth.uid())
$$;

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = '' as $$
  select coalesce((select p.role = 'admin' from public.profiles p where p.id = (select auth.uid())), false)
$$;

create or replace function public.has_user_tab(required_tab text)
returns boolean language sql stable security definer set search_path = '' as $$
  select public.is_admin() or exists (
    select 1 from public.profiles p where p.id = (select auth.uid()) and p.tabs ? required_tab
  )
$$;

-- Prevent direct table access to class roster and write paths; these functions
-- expose only validated rows/actions to authenticated teachers.
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
  join public.students st on st.year_level = o.year_level and st.group_name = o.group_name
  join public.enrollments e on e.student_id = st.id and e.course_id = o.course_id
  left join public.class_attendance ca on ca.session_id = s.id and ca.student_id = st.id
  where s.id = p_session;
  return v_result;
end $$;

create or replace function public.mark_class_attendance(p_session uuid, p_records jsonb, p_held boolean default true)
returns void language plpgsql security definer set search_path = '' as $$
declare
  v_user uuid := (select auth.uid());
  v_offering public.course_offerings%rowtype;
  v_session public.class_sessions%rowtype;
  v_record jsonb;
  v_student uuid;
  v_status text;
begin
  if v_user is null then raise exception 'authentication required'; end if;
  select s.* into v_session from public.class_sessions s where s.id = p_session for update;
  if not found then raise exception 'session not found'; end if;
  select o.* into v_offering from public.course_offerings o where o.id = v_session.offering_id;
  if not public.is_admin() and v_offering.teacher_id <> v_user then raise exception 'session not assigned'; end if;
  if v_session.class_date <> current_date and not public.is_admin() then raise exception 'teachers can mark attendance only for today'; end if;
  if jsonb_typeof(p_records) <> 'array' then raise exception 'records must be an array'; end if;

  for v_record in select * from jsonb_array_elements(p_records) loop
    v_student := (v_record->>'student_id')::uuid;
    v_status := v_record->>'status';
    if v_status not in ('present', 'absent') then raise exception 'invalid attendance status'; end if;
    if not exists (
      select 1 from public.students st
      join public.enrollments e on e.student_id=st.id and e.course_id=v_offering.course_id
      where st.id=v_student and st.year_level=v_offering.year_level and st.group_name=v_offering.group_name
    ) then raise exception 'student is outside this class roster'; end if;
    insert into public.class_attendance(session_id, student_id, status, marked_by)
    values (p_session, v_student, v_status, v_user)
    on conflict (session_id, student_id) do update
      set status=excluded.status, marked_by=excluded.marked_by, marked_at=now();
  end loop;

  if p_held then
    update public.class_sessions set status='held', held_by=v_user, held_at=now() where id=p_session;
  end if;
end $$;

create or replace function public.admin_student_roster(p_page integer default 0, p_page_size integer default 50, p_query text default '')
returns setof jsonb language plpgsql stable security definer set search_path = '' as $$
begin
  if not public.is_admin() and not exists(select 1 from public.profiles p where p.id=(select auth.uid()) and (p.tabs ? 'students')) then
    raise exception 'student access denied';
  end if;
  return query
  select jsonb_build_object('id', st.id, 'name', st.name, 'phone', st.phone, 'whatsapp', st.whatsapp,
    'guardian', st.guardian, 'guardianPhone', st.guardian_phone, 'address', st.address,
    'college', st.college, 'yearLevel', st.year_level, 'groupName', st.group_name,
    'batchId', st.batch_id, 'paid', st.paid, 'status', st.status,
    'createdAt', st.created_at,
    'enrollments', coalesce((select jsonb_agg(jsonb_build_object('courseId', e.course_id, 'fee', e.fee)) from public.enrollments e where e.student_id=st.id), '[]'::jsonb))
  from public.students st
  where p_query = '' or st.name ilike '%'||p_query||'%' or st.phone ilike '%'||p_query||'%'
  order by st.name
  limit greatest(1, least(p_page_size, 100)) offset greatest(0, p_page) * greatest(1, least(p_page_size, 100));
end $$;

-- Class session generation is explicit so schedules do not fabricate a class
-- until the admin/teacher visits a scheduled attendance day.
create or replace function public.get_or_create_class_session(p_offering uuid, p_date date)
returns uuid language plpgsql security definer set search_path = '' as $$
declare
  v_user uuid := (select auth.uid());
  v_offering public.course_offerings%rowtype;
  v_session uuid;
  v_dow smallint;
begin
  select * into v_offering from public.course_offerings where id=p_offering and active;
  if not found then raise exception 'offering not found'; end if;
  if not public.is_admin() and v_offering.teacher_id <> v_user then raise exception 'offering not assigned'; end if;
  v_dow := extract(dow from p_date)::smallint;
  if not v_dow = any(v_offering.weekdays) then raise exception 'class is not scheduled for this day'; end if;
  insert into public.class_sessions(offering_id,class_date,rate_snapshot)
  values (p_offering,p_date,v_offering.rate_per_class)
  on conflict (offering_id,class_date) do update set offering_id=excluded.offering_id
  returning id into v_session;
  return v_session;
end $$;

-- Student create/update RPC enforces the admission fee in the same transaction.
create or replace function public.save_student_with_admission(p_student jsonb, p_enrollments jsonb)
returns uuid language plpgsql security definer set search_path = '' as $$
declare
  v_user uuid := (select auth.uid());
  v_student uuid;
  v_required numeric(12,2);
  v_paid numeric(12,2);
  v_row jsonb;
  v_course uuid;
  v_fee numeric(12,2);
begin
  if v_user is null then raise exception 'authentication required'; end if;
  if not (public.is_admin() or (public.current_role()='editor' and public.has_user_tab('students'))) then
    raise exception 'student access denied';
  end if;
  if jsonb_typeof(p_student) <> 'object' or jsonb_typeof(p_enrollments) <> 'array' then raise exception 'invalid student payload'; end if;
  if coalesce(trim(p_student->>'name'),'')='' or coalesce(trim(p_student->>'phone'),'')='' then raise exception 'name and phone are required'; end if;
  if p_student->>'year_level' not in ('1st year','2nd year') then raise exception 'valid year is required'; end if;
  if coalesce(trim(p_student->>'college'),'')='' or coalesce(trim(p_student->>'group_name'),'')='' then raise exception 'college and group are required'; end if;
  if jsonb_array_length(p_enrollments)=0 then raise exception 'at least one course is required'; end if;
  select s.admission_fee into v_required from public.coaching_settings s where s.id=true;
  v_required := coalesce(v_required,0);
  v_paid := coalesce((p_student->>'admission_paid')::numeric, v_required);
  if v_paid < v_required then raise exception 'admission fee must be paid in full'; end if;

  v_student := coalesce(nullif(p_student->>'id','')::uuid, gen_random_uuid());
  insert into public.students(id,name,phone,guardian,guardian_phone,whatsapp,college,batch_id,paid,address,year_level,group_name,status,created_at)
  values (v_student, trim(p_student->>'name'), trim(p_student->>'phone'), coalesce(p_student->>'guardian',''), coalesce(p_student->>'guardian_phone',''), coalesce(p_student->>'whatsapp',''), trim(p_student->>'college'), nullif(p_student->>'batch_id','')::uuid, coalesce((p_student->>'paid')::numeric,0), coalesce(p_student->>'address',''), p_student->>'year_level', p_student->>'group_name', 'active', now())
  on conflict (id) do update set name=excluded.name, phone=excluded.phone, guardian=excluded.guardian, guardian_phone=excluded.guardian_phone, whatsapp=excluded.whatsapp, college=excluded.college, batch_id=excluded.batch_id, address=excluded.address, year_level=excluded.year_level, group_name=excluded.group_name, status='active';

  delete from public.enrollments where student_id=v_student;
  for v_row in select * from jsonb_array_elements(p_enrollments) loop
    v_course := (v_row->>'course_id')::uuid;
    v_fee := (v_row->>'fee')::numeric;
    if v_fee < 0 then raise exception 'course fee cannot be negative'; end if;
    insert into public.enrollments(student_id,course_id,fee) values(v_student,v_course,v_fee);
    insert into public.student_fee_invoices(student_id,course_id,billing_month,agreed_fee)
      values(v_student,v_course,date_trunc('month', current_date)::date,v_fee)
      on conflict(student_id,course_id,billing_month) do update set agreed_fee=excluded.agreed_fee;
  end loop;

  insert into public.admission_payments(student_id,required_amount,amount_paid,received_by)
  values(v_student,v_required,v_paid,v_user)
  on conflict(student_id) do update set required_amount=excluded.required_amount, amount_paid=greatest(public.admission_payments.amount_paid,excluded.amount_paid), received_by=excluded.received_by;
  return v_student;
end $$;

-- Monthly billing: viewing a month ensures every active enrollment has that
-- month's invoice, snapshotting the current agreed (possibly discounted) fee.
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
  join public.students st on st.id = e.student_id and st.status = 'active'
  on conflict (student_id, course_id, billing_month) do nothing;
  get diagnostics v_count = row_count;
  return v_count;
end $$;

-- Fee payment: allocates the amount across the student's unpaid invoices,
-- oldest month first, so partial payments never touch future months.
create or replace function public.pay_student_fees(p_student uuid, p_amount numeric, p_note text default '')
returns numeric language plpgsql security definer set search_path = '' as $$
declare
  v_user uuid := (select auth.uid());
  v_remaining numeric;
  v_due numeric;
  v_invoice uuid;
  v_pay numeric;
  v_total numeric := 0;
begin
  if v_user is null then raise exception 'authentication required'; end if;
  if not (public.is_admin() or (public.current_role() in ('editor','accountant') and public.has_user_tab('fees'))) then
    raise exception 'fee access denied';
  end if;
  if p_amount is null or p_amount <= 0 then raise exception 'amount must be positive'; end if;
  v_remaining := p_amount;
  for v_invoice, v_due in
    select i.id,
           i.agreed_fee - coalesce((select sum(sp.amount) from public.student_fee_payments sp where sp.invoice_id = i.id), 0)
    from public.student_fee_invoices i
    where i.student_id = p_student
    order by i.billing_month asc
  loop
    exit when v_remaining <= 0;
    if v_due > 0 then
      v_pay := least(v_due, v_remaining);
      insert into public.student_fee_payments(invoice_id, amount, received_by, note)
      values (v_invoice, v_pay, v_user, coalesce(p_note, ''));
      v_remaining := v_remaining - v_pay;
      v_total := v_total + v_pay;
    end if;
  end loop;
  if v_total = 0 then raise exception 'no outstanding due for this student'; end if;
  update public.students set paid = coalesce(paid, 0) + v_total where id = p_student;
  return v_total;
end $$;

-- Additive migration of existing broad policies.
drop policy if exists "authenticated read batches" on public.batches;
drop policy if exists "authenticated read courses" on public.courses;
drop policy if exists "authenticated read students" on public.students;
drop policy if exists "authenticated read enrollments" on public.enrollments;
drop policy if exists "authenticated read attendance" on public.attendance;
drop policy if exists "authenticated read payments" on public.payments;
drop policy if exists "authenticated read money" on public.money_entries;
drop policy if exists "authenticated read dues" on public.dues;
drop policy if exists "editor write batches" on public.batches;
drop policy if exists "editor write courses" on public.courses;
drop policy if exists "editor write students" on public.students;
drop policy if exists "editor write enrollments" on public.enrollments;
drop policy if exists "editor write attendance" on public.attendance;
drop policy if exists "admin editor attendance write" on public.attendance;
drop policy if exists "editor write payments" on public.payments;
drop policy if exists "money write" on public.money_entries;
drop policy if exists "money write dues" on public.dues;
drop policy if exists "read activity" on public.activity_log;
drop policy if exists "read own activity" on public.activity_log;
drop policy if exists "read own profile" on public.profiles;
drop policy if exists "admin manage profiles" on public.profiles;
drop policy if exists "admin settings access" on public.coaching_settings;
drop policy if exists "admin bank access" on public.bank_account;
drop policy if exists "admin bank transaction access" on public.bank_transactions;
drop policy if exists "admin offering access" on public.course_offerings;
drop policy if exists "admin session access" on public.class_sessions;
drop policy if exists "admin attendance access" on public.class_attendance;
drop policy if exists "admin fee invoice access" on public.student_fee_invoices;
drop policy if exists "admin fee payment access" on public.student_fee_payments;
drop policy if exists "admin admission access" on public.admission_payments;
drop policy if exists "teacher assigned session read" on public.class_sessions;
drop policy if exists "payroll access" on public.teacher_payments;
-- Own names (so this migration can be run again safely)
drop policy if exists "signed-in read batches" on public.batches;
drop policy if exists "signed-in read courses" on public.courses;
drop policy if exists "signed-in read offerings" on public.course_offerings;
drop policy if exists "student table role read" on public.students;
drop policy if exists "enrollment role read" on public.enrollments;
drop policy if exists "attendance role read" on public.attendance;
drop policy if exists "payments finance read" on public.payments;
drop policy if exists "money finance read" on public.money_entries;
drop policy if exists "dues finance read" on public.dues;
drop policy if exists "history admin read" on public.activity_log;
drop policy if exists "profile read self or admin" on public.profiles;
drop policy if exists "settings signed-in read" on public.coaching_settings;
drop policy if exists "settings admin write" on public.coaching_settings;
drop policy if exists "school batch writes" on public.batches;
drop policy if exists "school course writes" on public.courses;
drop policy if exists "school student writes" on public.students;
drop policy if exists "school enrollment writes" on public.enrollments;
drop policy if exists "legacy attendance admin editor writes" on public.attendance;
drop policy if exists "legacy payments finance writes" on public.payments;
drop policy if exists "money finance writes" on public.money_entries;
drop policy if exists "dues finance writes" on public.dues;
drop policy if exists "admin offering write" on public.course_offerings;
drop policy if exists "admin session write" on public.class_sessions;
drop policy if exists "admin class attendance write" on public.class_attendance;
drop policy if exists "session read assigned or payroll" on public.class_sessions;
drop policy if exists "admin fee invoice access" on public.student_fee_invoices;
drop policy if exists "admin fee payment access" on public.student_fee_payments;
drop policy if exists "admin admission access" on public.admission_payments;
drop policy if exists "bank account finance read" on public.bank_account;
drop policy if exists "bank account admin write" on public.bank_account;
drop policy if exists "bank transaction finance read" on public.bank_transactions;
drop policy if exists "bank transaction finance write" on public.bank_transactions;
drop policy if exists "teacher payroll access" on public.teacher_payments;
drop policy if exists "teacher payroll admin write" on public.teacher_payments;
drop policy if exists "admin profile manage" on public.profiles;
drop policy if exists "activity insert self" on public.activity_log;
drop policy if exists "activity admin delete" on public.activity_log;

-- Eta drop block rakhe dew — migration abar run korle "already exists"
-- error ashbe na (re-run safe).

alter table public.coaching_settings enable row level security;
alter table public.course_offerings enable row level security;
alter table public.class_sessions enable row level security;
alter table public.class_attendance enable row level security;
alter table public.student_fee_invoices enable row level security;
alter table public.student_fee_payments enable row level security;
alter table public.admission_payments enable row level security;
alter table public.teacher_payments enable row level security;
alter table public.bank_account enable row level security;
alter table public.bank_transactions enable row level security;

-- Course and batch definitions are visible to signed-in app users.
create policy "signed-in read batches" on public.batches for select to authenticated using (public.current_role() in ('admin','editor','viewer','teacher','student'));
create policy "signed-in read courses" on public.courses for select to authenticated using (public.current_role() in ('admin','editor','viewer','teacher','student'));
create policy "signed-in read offerings" on public.course_offerings for select to authenticated using (
  public.is_admin() or public.current_role() in ('editor','viewer','accountant') or teacher_id=(select auth.uid())
);

-- PII access only for explicitly student-authorized app roles; teachers use RPC.
create policy "student table role read" on public.students for select to authenticated using (
  public.is_admin() or (public.current_role() in ('editor','viewer') and public.has_user_tab('students'))
);
create policy "enrollment role read" on public.enrollments for select to authenticated using (
  public.is_admin() or (public.current_role() in ('editor','viewer') and public.has_user_tab('students'))
);
create policy "attendance role read" on public.attendance for select to authenticated using (
  public.is_admin() or (public.current_role() in ('editor','viewer') and public.has_user_tab('attendance'))
);
create policy "payments finance read" on public.payments for select to authenticated using (
  public.is_admin() or (public.current_role() in ('editor','viewer','accountant') and public.has_user_tab('fees'))
);
create policy "money finance read" on public.money_entries for select to authenticated using (
  public.is_admin() or public.current_role()='accountant' or (public.current_role() in ('editor','viewer') and public.has_user_tab('money'))
);
create policy "dues finance read" on public.dues for select to authenticated using (
  public.is_admin() or public.current_role()='accountant' or (public.current_role() in ('editor','viewer') and public.has_user_tab('money'))
);
create policy "history admin read" on public.activity_log for select to authenticated using (public.is_admin());
create policy "profile read self or admin" on public.profiles for select to authenticated using (id=(select auth.uid()) or public.is_admin());
create policy "settings signed-in read" on public.coaching_settings for select to authenticated using (true);
create policy "settings admin write" on public.coaching_settings for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Existing operational write access, split from SELECT so narrowed reads stay narrow.
create policy "school batch writes" on public.batches for all to authenticated using (public.current_role() in ('admin','editor')) with check (public.current_role() in ('admin','editor'));
create policy "school course writes" on public.courses for all to authenticated using (public.current_role() in ('admin','editor')) with check (public.current_role() in ('admin','editor'));
create policy "school student writes" on public.students for all to authenticated using (public.current_role() in ('admin','editor')) with check (public.current_role() in ('admin','editor'));
create policy "school enrollment writes" on public.enrollments for all to authenticated using (public.current_role() in ('admin','editor')) with check (public.current_role() in ('admin','editor'));
create policy "legacy attendance admin editor writes" on public.attendance for all to authenticated using (public.current_role() in ('admin','editor')) with check (public.current_role() in ('admin','editor'));
create policy "legacy payments finance writes" on public.payments for all to authenticated using (public.current_role() in ('admin','editor')) with check (public.current_role() in ('admin','editor'));
create policy "money finance writes" on public.money_entries for all to authenticated
using (public.is_admin() or public.current_role()='accountant' or (public.current_role()='editor' and exists(select 1 from public.profiles p where p.id=(select auth.uid()) and p.money_edit)))
with check (public.is_admin() or public.current_role()='accountant' or (public.current_role()='editor' and exists(select 1 from public.profiles p where p.id=(select auth.uid()) and p.money_edit)));
create policy "dues finance writes" on public.dues for all to authenticated
using (public.is_admin() or public.current_role()='accountant' or (public.current_role()='editor' and exists(select 1 from public.profiles p where p.id=(select auth.uid()) and p.money_edit)))
with check (public.is_admin() or public.current_role()='accountant' or (public.current_role()='editor' and exists(select 1 from public.profiles p where p.id=(select auth.uid()) and p.money_edit)));

-- New class tables are directly writable by admin only. Teacher write goes RPC.
create policy "admin offering write" on public.course_offerings for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admin session write" on public.class_sessions for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admin class attendance write" on public.class_attendance for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "session read assigned or payroll" on public.class_sessions for select to authenticated using (
  public.is_admin()
  or exists(select 1 from public.course_offerings o where o.id=offering_id and o.teacher_id=(select auth.uid()))
  or exists(select 1 from public.profiles p where p.id=(select auth.uid()) and p.teacher_payroll_access)
);
create policy "admin fee invoice access" on public.student_fee_invoices for all to authenticated using (public.is_admin() or (public.current_role() in ('editor','accountant') and public.has_user_tab('fees'))) with check (public.is_admin() or (public.current_role() in ('editor','accountant') and public.has_user_tab('fees')));
create policy "admin fee payment access" on public.student_fee_payments for all to authenticated using (public.is_admin() or (public.current_role() in ('editor','accountant') and public.has_user_tab('fees'))) with check (public.is_admin() or (public.current_role() in ('editor','accountant') and public.has_user_tab('fees')));
create policy "admin admission access" on public.admission_payments for all to authenticated using (public.is_admin() or (public.current_role()='editor' and public.has_user_tab('students'))) with check (public.is_admin() or (public.current_role()='editor' and public.has_user_tab('students')));
create policy "bank account finance read" on public.bank_account for select to authenticated using (public.is_admin() or public.current_role()='accountant' or (public.current_role() in ('editor','viewer') and public.has_user_tab('money')));
create policy "bank account admin write" on public.bank_account for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "bank transaction finance read" on public.bank_transactions for select to authenticated using (public.is_admin() or public.current_role()='accountant' or (public.current_role() in ('editor','viewer') and public.has_user_tab('money')));
create policy "bank transaction finance write" on public.bank_transactions for all to authenticated using (public.is_admin() or public.current_role()='accountant' or (public.current_role()='editor' and exists(select 1 from public.profiles p where p.id=(select auth.uid()) and p.money_edit))) with check (public.is_admin() or public.current_role()='accountant' or (public.current_role()='editor' and exists(select 1 from public.profiles p where p.id=(select auth.uid()) and p.money_edit)));
create policy "teacher payroll access" on public.teacher_payments for select to authenticated using (
 public.is_admin() or exists(select 1 from public.profiles p where p.id=(select auth.uid()) and p.teacher_payroll_access)
);
create policy "teacher payroll admin write" on public.teacher_payments for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Profiles are admin-managed; self-service profile insertion is deliberately not allowed.
create policy "admin profile manage" on public.profiles for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Lock activity insertion to authenticated actors matching the caller's profile.
drop policy if exists "activity write" on public.activity_log;
create policy "activity insert self" on public.activity_log for insert to authenticated
  with check (username=(select p.username from public.profiles p where p.id=(select auth.uid())));
create policy "activity admin delete" on public.activity_log for delete to authenticated using (public.is_admin());

-- Teacher roster and marking RPCs are the only teacher path to student data.
revoke all on function public.teacher_roster(uuid) from public;
revoke all on function public.mark_class_attendance(uuid,jsonb,boolean) from public;
revoke all on function public.get_or_create_class_session(uuid,date) from public;
revoke all on function public.admin_student_roster(integer,integer,text) from public;
revoke all on function public.save_student_with_admission(jsonb,jsonb) from public;
revoke all on function public.ensure_month_invoices(date) from public;
revoke all on function public.pay_student_fees(uuid,numeric,text) from public;
grant execute on function public.teacher_roster(uuid) to authenticated;
grant execute on function public.mark_class_attendance(uuid,jsonb,boolean) to authenticated;
grant execute on function public.get_or_create_class_session(uuid,date) to authenticated;
grant execute on function public.admin_student_roster(integer,integer,text) to authenticated;
grant execute on function public.save_student_with_admission(jsonb,jsonb) to authenticated;
grant execute on function public.ensure_month_invoices(date) to authenticated;
grant execute on function public.pay_student_fees(uuid,numeric,text) to authenticated;

commit;
