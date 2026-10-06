-- Coaching Center Manager — Supabase (Postgres) schema
-- Run koro: Supabase dashboard > SQL Editor > New query > paste > Run.
-- Free tier e enough. Auth: Supabase Auth (email/password),
-- profiles table er role permission control kore.
--
-- NOTUN (aajker update): enrollments (ek student ekadhik course, alada fee),
-- dues (coaching er nijer baki register), profiles.teaching (kon teacher
-- kon course er hajira nite pare).
--
-- Purano schema AGE RUN KORE THAKLE ei drop lines age chalao (notun project
-- hole lagbe na):
--   drop table if exists enrollments cascade;
--   drop table if exists attendance cascade;
--   drop table if exists payments cascade;
--   drop table if exists students cascade;
--   drop table if exists dues cascade;
--   drop table if exists money_entries cascade;
--   drop table if exists activity_log cascade;
--   drop table if exists profiles cascade;
--   drop table if exists courses cascade;
--   drop table if exists batches cascade;

-- ============ TABLES ============

create table if not exists batches (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  teacher text default '',
  schedule text default '',
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

create table if not exists students (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text default '',
  guardian text default '',
  guardian_phone text default '',
  whatsapp text default '',
  college text default '',
  batch_id uuid references batches(id) on delete set null,
  -- total paid (shob enrollment mile). Due = sum(enrollments.fee) - paid
  paid numeric default 0,
  created_at timestamptz default now()
);

-- Ek student ekadhik course/package e enroll korte pare, proti course e alada fee.
create table if not exists enrollments (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references students(id) on delete cascade,
  course_id uuid not null references courses(id) on delete cascade,
  fee numeric default 0,
  created_at timestamptz default now(),
  unique (student_id, course_id)
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

-- Coaching er nijer baki (ghor vara, salary, bill). Paid mark kora jay.
create table if not exists dues (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  amount numeric not null check (amount > 0),
  date date not null default current_date,
  paid boolean not null default false,
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
-- teaching = kon kon course er hajira nite parbe (course id er list).
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null,
  role text not null default 'viewer'
    check (role in ('admin', 'editor', 'viewer', 'accountant', 'student')),
  tabs jsonb not null default '["dashboard"]',
  money_edit boolean not null default false,
  teacher_courses jsonb not null default '[]',
  student_id uuid references students(id) on delete set null,
  created_at timestamptz default now()
);

-- ============ ROW LEVEL SECURITY ============

alter table batches enable row level security;
alter table courses enable row level security;
alter table students enable row level security;
alter table enrollments enable row level security;
alter table attendance enable row level security;
alter table payments enable row level security;
alter table money_entries enable row level security;
alter table dues enable row level security;
alter table activity_log enable row level security;
alter table profiles enable row level security;

-- Helper: nijer role dekha
create or replace function public.my_role()
returns text language sql stable security definer set search_path = public as $$
  select role from profiles where id = auth.uid();
$$;

-- Re-run safe: age chalale policy already chilo hole age drop koro
drop policy if exists "authenticated read batches" on batches;
drop policy if exists "authenticated read courses" on courses;
drop policy if exists "authenticated read students" on students;
drop policy if exists "authenticated read enrollments" on enrollments;
drop policy if exists "authenticated read attendance" on attendance;
drop policy if exists "authenticated read payments" on payments;
drop policy if exists "authenticated read money" on money_entries;
drop policy if exists "authenticated read dues" on dues;
drop policy if exists "read activity" on activity_log;
drop policy if exists "read own activity" on activity_log;
drop policy if exists "read own profile" on profiles;
drop policy if exists "editor write batches" on batches;
drop policy if exists "editor write courses" on courses;
drop policy if exists "editor write students" on students;
drop policy if exists "editor write enrollments" on enrollments;
drop policy if exists "editor write attendance" on attendance;
drop policy if exists "editor write payments" on payments;
drop policy if exists "money write" on money_entries;
drop policy if exists "money write dues" on dues;
drop policy if exists "activity write" on activity_log;
drop policy if exists "activity admin delete" on activity_log;
drop policy if exists "admin manage profiles" on profiles;

-- Read: login kora jekono user porte parbe
create policy "authenticated read batches" on batches for select to authenticated using (true);
create policy "authenticated read courses" on courses for select to authenticated using (true);
create policy "authenticated read students" on students for select to authenticated using (true);
create policy "authenticated read enrollments" on enrollments for select to authenticated using (true);
create policy "authenticated read attendance" on attendance for select to authenticated using (true);
create policy "authenticated read payments" on payments for select to authenticated using (true);
create policy "authenticated read money" on money_entries for select to authenticated using (true);
create policy "authenticated read dues" on dues for select to authenticated using (true);
create policy "read activity" on activity_log for select to authenticated using (true);
create policy "read own profile" on profiles for select to authenticated using (id = auth.uid());

-- Write: admin + editor (money ar dues e accountant o). App level eo check ache.
create policy "editor write batches" on batches for all to authenticated
  using (public.my_role() in ('admin', 'editor'))
  with check (public.my_role() in ('admin', 'editor'));

create policy "editor write courses" on courses for all to authenticated
  using (public.my_role() in ('admin', 'editor'))
  with check (public.my_role() in ('admin', 'editor'));

create policy "editor write students" on students for all to authenticated
  using (public.my_role() in ('admin', 'editor'))
  with check (public.my_role() in ('admin', 'editor'));

create policy "editor write enrollments" on enrollments for all to authenticated
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

create policy "money write dues" on dues for all to authenticated
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
-- insert into profiles (id, username, role, tabs, money_edit, teacher_courses)
-- values ('PASTE-AUTH-USER-ID', 'admin', 'admin',
--   '["dashboard","students","batches","courses","attendance","fees","money"]',
--   true, '[]');
