-- Coaching Center Manager — Supabase (Postgres) schema
-- Run this in Supabase dashboard: SQL Editor > New query > paste > Run.
-- Free tier e enough. Auth: Supabase Auth (email/password) use koro,
-- ar app er profiles table role permission control korbe.

-- ============ TABLES ============

create table if not exists batches (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  teacher text default '',
  schedule text default '',
  created_at timestamptz default now()
);

create table if not exists students (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text default '',
  guardian text default '',
  guardian_phone text default '',
  whatsapp text default '',
  college text default '',
  batch_id uuid references batches(id) on delete set null,
  course_id uuid references courses(id) on delete set null,
  monthly_fee numeric default 0,
  paid numeric default 0,
  created_at timestamptz default now()
);

create table if not exists attendance (
  id uuid primary key default gen_random_uuid(),
  date date not null,
  student_id uuid not null references students(id) on delete cascade,
  status text not null check (status in ('present', 'absent')),
  unique (date, student_id)
);

create table if not exists payments (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references students(id) on delete cascade,
  amount numeric not null check (amount > 0),
  date date not null default current_date,
  created_at timestamptz default now()
);

create table if not exists money_entries (
  id uuid primary key default gen_random_uuid(),
  date date not null default current_date,
  type text not null check (type in ('income', 'expense')),
  category text default 'General',
  amount numeric not null check (amount > 0),
  note text default '',
  by_username text default '',
  created_at timestamptz default now()
);

create table if not exists courses (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type text not null default 'subject' check (type in ('subject', 'package')),
  fee numeric default 0,
  duration text default '',
  created_at timestamptz default now()
);

-- Kon user ki korlo (history). App theke auto lekha hobe.
create table if not exists activity_log (
  id uuid primary key default gen_random_uuid(),
  username text not null,
  action text not null,
  detail text default '',
  date date not null default current_date,
  created_at timestamptz default now()
);

-- App user + role. id = Supabase auth.users.id (signup er por bosbe).
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null,
  role text not null default 'viewer'
    check (role in ('admin', 'editor', 'viewer', 'accountant', 'student')),
  tabs jsonb not null default '["dashboard"]',
  money_edit boolean not null default false,
  student_id uuid references students(id) on delete set null,
  created_at timestamptz default now()
);

-- ============ ROW LEVEL SECURITY ============

alter table batches enable row level security;
alter table courses enable row level security;
alter table students enable row level security;
alter table attendance enable row level security;
alter table payments enable row level security;
alter table money_entries enable row level security;
alter table activity_log enable row level security;
alter table profiles enable row level security;

-- Helper: nijer role dekha
create or replace function public.my_role()
returns text language sql stable security definer set search_path = public as $$
  select role from profiles where id = auth.uid();
$$;

-- Read: login kora jekono user porte parbe
create policy "authenticated read batches" on batches for select to authenticated using (true);
create policy "authenticated read courses" on courses for select to authenticated using (true);
create policy "authenticated read students" on students for select to authenticated using (true);
create policy "authenticated read attendance" on attendance for select to authenticated using (true);
create policy "authenticated read payments" on payments for select to authenticated using (true);
create policy "authenticated read money" on money_entries for select to authenticated using (true);
create policy "read own activity" on activity_log for select to authenticated using (true);
create policy "read own profile" on profiles for select to authenticated using (id = auth.uid());

-- Write: admin + editor (money te accountant o). App level eo check ache.
create policy "editor write batches" on batches for all to authenticated
  using (public.my_role() in ('admin', 'editor'))
  with check (public.my_role() in ('admin', 'editor'));

create policy "editor write courses" on courses for all to authenticated
  using (public.my_role() in ('admin', 'editor'))
  with check (public.my_role() in ('admin', 'editor'));

create policy "editor write students" on students for all to authenticated
  using (public.my_role() in ('admin', 'editor'))
  with check (public.my_role() in ('admin', 'editor'));

create policy "editor write attendance" on attendance for all to authenticated
  using (public.my_role() in ('admin', 'editor'))
  with check (public.my_role() in ('admin', 'editor'));

create policy "editor write payments" on payments for all to authenticated
  using (public.my_role() in ('admin', 'editor'))
  with check (public.my_role() in ('admin', 'editor'));

create policy "money write" on money_entries for all to authenticated
  using (public.my_role() in ('admin', 'accountant') or
         (public.my_role() = 'editor' and exists (
            select 1 from profiles where id = auth.uid() and money_edit = true)))
  with check (public.my_role() in ('admin', 'accountant') or
         (public.my_role() = 'editor' and exists (
            select 1 from profiles where id = auth.uid() and money_edit = true)));

-- activity: je kono login user likhte parbe (app auto log kore), delete shudhu admin
create policy "activity write" on activity_log for insert to authenticated with check (true);
create policy "activity admin delete" on activity_log for delete to authenticated
  using (public.my_role() = 'admin');

-- profiles: shudhu admin manage korbe (service_role / dashboard theke)
create policy "admin manage profiles" on profiles for all to authenticated
  using (public.my_role() = 'admin')
  with check (public.my_role() = 'admin');

-- ============ FIRST ADMIN ============
-- Signup korar por auth.users theke id niye ei query chalao (1 bar):
-- insert into profiles (id, username, role, tabs, money_edit)
-- values ('PASTE-AUTH-USER-ID', 'admin', 'admin',
--   '["dashboard","students","batches","attendance","fees","money"]', true);
