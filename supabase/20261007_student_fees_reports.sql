begin;

alter table public.students add column if not exists student_number text;
alter table public.students add column if not exists gender text not null default '';
alter table public.students add column if not exists birthday date;
alter table public.students add column if not exists admission_date date;
alter table public.students alter column status set default 'active';
alter table public.student_fee_payments add column if not exists payment_date date;
update public.student_fee_payments set payment_date = paid_at::date where payment_date is null;
alter table public.student_fee_payments alter column payment_date set default current_date;
alter table public.student_fee_payments alter column payment_date set not null;

update public.students set admission_date = created_at::date where admission_date is null;

create sequence if not exists public.student_number_seq;
with existing as (
  select coalesce(max(regexp_replace(student_number, '^M-', '')::bigint), 0) as max_n
  from public.students where student_number ~ '^M-[0-9]+$'
), numbered as (
  select id, row_number() over (order by created_at, id) + existing.max_n as n
  from public.students cross join existing
  where student_number is null
)
update public.students s
set student_number = 'M-' || lpad(numbered.n::text, greatest(4,length(numbered.n::text)), '0')
from numbered
where s.id = numbered.id;

select setval(
  'public.student_number_seq',
  coalesce((select max(regexp_replace(student_number, '^M-', '')::bigint) from public.students where student_number ~ '^M-[0-9]+$'), 1),
  exists(select 1 from public.students where student_number ~ '^M-[0-9]+$')
);

alter table public.students alter column student_number set not null;
create unique index if not exists students_student_number_uidx on public.students(student_number);
create index if not exists students_status_idx on public.students(status);
create index if not exists students_birthday_idx on public.students(birthday);
create index if not exists students_admission_date_idx on public.students(admission_date);

drop trigger if exists students_assign_student_number on public.students;
drop function if exists public.assign_student_number();
create function public.assign_student_number()
returns trigger language plpgsql set search_path = '' as $$
declare v_number bigint;
begin
  if tg_op = 'INSERT' and coalesce(new.student_number,'') = '' then
    v_number := nextval('public.student_number_seq');
    new.student_number := 'M-' || lpad(v_number::text, greatest(4,length(v_number::text)), '0');
  elsif tg_op = 'INSERT' then
    raise exception 'student number is assigned by the database';
  elsif tg_op = 'UPDATE' and new.student_number is distinct from old.student_number then
    raise exception 'student number cannot be changed';
  end if;
  if new.admission_date is null then
    new.admission_date := coalesce(new.created_at::date, current_date);
  end if;
  return new;
end $$;
drop trigger if exists students_assign_student_number on public.students;
create trigger students_assign_student_number
before insert on public.students
for each row execute function public.assign_student_number();

create table if not exists public.student_fee_discounts (
  id uuid primary key default gen_random_uuid(),
  receipt_id uuid not null,
  invoice_id uuid not null references public.student_fee_invoices(id) on delete cascade,
  student_id uuid not null references public.students(id) on delete cascade,
  billing_month date not null check (extract(day from billing_month) = 1),
  amount numeric(12,2) not null check (amount > 0),
  applied_by uuid references public.profiles(id) on delete set null,
  applied_at timestamptz not null default now()
);
alter table public.student_fee_payments add column if not exists receipt_id uuid;
alter table public.student_fee_discounts add column if not exists receipt_id uuid;
update public.student_fee_payments set receipt_id=id where receipt_id is null;
update public.student_fee_discounts set receipt_id=id where receipt_id is null;
alter table public.student_fee_payments alter column receipt_id set not null;
alter table public.student_fee_discounts alter column receipt_id set not null;
create index if not exists student_fee_payments_receipt_idx on public.student_fee_payments(receipt_id);
create index if not exists student_fee_discounts_receipt_idx on public.student_fee_discounts(receipt_id);
create index if not exists student_fee_discounts_student_month_idx on public.student_fee_discounts(student_id, billing_month);
create index if not exists student_fee_discounts_invoice_idx on public.student_fee_discounts(invoice_id, applied_at);

create table if not exists public.student_fee_receipts (
  receipt_id uuid primary key,
  student_id uuid not null references public.students(id) on delete cascade,
  billing_month date not null check (extract(day from billing_month) = 1),
  paid_amount numeric(12,2) not null default 0 check (paid_amount >= 0),
  discount_amount numeric(12,2) not null default 0 check (discount_amount >= 0),
  remaining_amount numeric(12,2) not null check (remaining_amount >= 0),
  payment_date date not null,
  received_by uuid references public.profiles(id) on delete set null,
  recorded_at timestamptz not null default now()
);
create index if not exists student_fee_receipts_student_month_idx on public.student_fee_receipts(student_id,billing_month,recorded_at desc);
alter table public.student_fee_receipts enable row level security;
grant select on public.student_fee_receipts to authenticated;
drop policy if exists "student fee receipt access" on public.student_fee_receipts;
create policy "student fee receipt access" on public.student_fee_receipts for select to authenticated
using (public.is_admin() or (public.current_role() in ('editor','accountant','viewer') and public.has_user_tab('fees')));
drop policy if exists "student fee receipt admin write" on public.student_fee_receipts;

alter table public.student_fee_discounts enable row level security;
grant select on public.student_fee_discounts to authenticated;
drop policy if exists "student fee discount access" on public.student_fee_discounts;
create policy "student fee discount access" on public.student_fee_discounts for select to authenticated
using (public.is_admin() or (public.current_role() in ('editor','accountant','viewer') and public.has_user_tab('fees')));
drop policy if exists "student fee discount admin write" on public.student_fee_discounts;

drop function if exists public.admin_student_roster(integer,integer,text);
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
    'admissionDate', st.admission_date, 'createdAt', st.created_at,
    'enrollments', coalesce((select jsonb_agg(jsonb_build_object('courseId', e.course_id, 'fee', e.fee)) from public.enrollments e where e.student_id=st.id), '[]'::jsonb))
  from public.students st
  where (p_status = '' or st.status = p_status)
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
  where st.status='active'
  order by st.name;
end $$;

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
  v_existing_status text;
  v_status text;
begin
  if v_user is null then raise exception 'authentication required'; end if;
  if not (public.is_admin() or (public.current_role()='editor' and public.has_user_tab('students'))) then raise exception 'student access denied'; end if;
  if jsonb_typeof(p_student) <> 'object' or jsonb_typeof(p_enrollments) <> 'array' then raise exception 'invalid student payload'; end if;
  if coalesce(trim(p_student->>'name'),'')='' or coalesce(trim(p_student->>'phone'),'')='' then raise exception 'name and phone are required'; end if;
  if p_student->>'year_level' not in ('1st year','2nd year') then raise exception 'valid year is required'; end if;
  if nullif(p_student->>'gender','') is not null and p_student->>'gender' not in ('female','male','other','prefer_not_to_say') then raise exception 'invalid gender'; end if;
  if nullif(p_student->>'birthday','') is not null and (p_student->>'birthday')::date > current_date then raise exception 'birthday cannot be in the future'; end if;
  if coalesce(trim(p_student->>'college'),'')='' or coalesce(trim(p_student->>'group_name'),'')='' then raise exception 'college and group are required'; end if;
  if jsonb_array_length(p_enrollments)=0 then raise exception 'at least one course is required'; end if;
  if coalesce(p_student->>'status','active') not in ('active','inactive') then raise exception 'invalid student status'; end if;
  select s.admission_fee into v_required from public.coaching_settings s where s.id=true;
  v_required := coalesce(v_required,0);
  v_paid := coalesce((p_student->>'admission_paid')::numeric, v_required);
  if v_paid < v_required then raise exception 'admission fee must be paid in full'; end if;

  v_student := coalesce(nullif(p_student->>'id','')::uuid, gen_random_uuid());
  select st.status into v_existing_status from public.students st where st.id=v_student;
  v_status := case when v_existing_status is null then 'active' else coalesce(nullif(p_student->>'status',''),v_existing_status) end;
  if v_existing_status is null then
    insert into public.students(id,name,phone,guardian,guardian_phone,whatsapp,college,batch_id,paid,address,year_level,group_name,status,gender,birthday,admission_date,created_at)
    values (v_student, trim(p_student->>'name'), trim(p_student->>'phone'), coalesce(p_student->>'guardian',''), coalesce(p_student->>'guardian_phone',''), coalesce(p_student->>'whatsapp',''), trim(p_student->>'college'), nullif(p_student->>'batch_id','')::uuid, coalesce((p_student->>'paid')::numeric,0), coalesce(p_student->>'address',''), p_student->>'year_level', p_student->>'group_name', v_status, coalesce(p_student->>'gender',''), nullif(p_student->>'birthday','')::date, coalesce(nullif(p_student->>'admission_date','')::date, current_date), now());
  else
    update public.students set name=trim(p_student->>'name'), phone=trim(p_student->>'phone'), guardian=coalesce(p_student->>'guardian',''), guardian_phone=coalesce(p_student->>'guardian_phone',''), whatsapp=coalesce(p_student->>'whatsapp',''), college=trim(p_student->>'college'), batch_id=nullif(p_student->>'batch_id','')::uuid, address=coalesce(p_student->>'address',''), year_level=p_student->>'year_level', group_name=p_student->>'group_name', status=v_status, gender=coalesce(p_student->>'gender',''), birthday=nullif(p_student->>'birthday','')::date, admission_date=coalesce(nullif(p_student->>'admission_date','')::date, public.students.admission_date)
    where id=v_student;
  end if;

  delete from public.enrollments where student_id=v_student;
  for v_row in select * from jsonb_array_elements(p_enrollments) loop
    v_course := (v_row->>'course_id')::uuid;
    v_fee := (v_row->>'fee')::numeric;
    if v_fee < 0 then raise exception 'course fee cannot be negative'; end if;
    insert into public.enrollments(student_id,course_id,fee) values(v_student,v_course,v_fee);
    if v_status = 'active' then
      insert into public.student_fee_invoices(student_id,course_id,billing_month,agreed_fee)
      values(v_student,v_course,date_trunc('month', current_date)::date,v_fee)
      on conflict(student_id,course_id,billing_month) do update set agreed_fee=excluded.agreed_fee;
    end if;
  end loop;
  insert into public.admission_payments(student_id,required_amount,amount_paid,received_by)
  values(v_student,v_required,v_paid,v_user)
  on conflict(student_id) do update set required_amount=excluded.required_amount, amount_paid=greatest(public.admission_payments.amount_paid,excluded.amount_paid), received_by=excluded.received_by;
  return v_student;
end $$;

create or replace function public.collect_student_month_fee(p_student uuid, p_month date, p_amount numeric, p_payment_date date, p_apply_discount boolean default false)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  v_user uuid := (select auth.uid());
  v_due numeric(12,2);
  v_amount numeric(12,2);
  v_invoice record;
  v_remaining numeric(12,2);
  v_alloc numeric(12,2);
  v_discount numeric(12,2) := 0;
  v_discount_target numeric(12,2) := 0;
  v_paid numeric(12,2) := 0;
  v_receipt uuid := gen_random_uuid();
begin
  if v_user is null then raise exception 'authentication required'; end if;
  if not (public.is_admin() or (public.current_role() in ('editor','accountant') and public.has_user_tab('fees'))) then raise exception 'fee access denied'; end if;
  if p_month is null or extract(day from p_month) <> 1 then raise exception 'month must be given as its first day'; end if;
  if p_payment_date is null then raise exception 'payment date is required'; end if;
  v_amount := coalesce(p_amount,0);
  if v_amount < 0 then raise exception 'amount cannot be negative'; end if;

  perform 1 from public.student_fee_invoices i where i.student_id=p_student and i.billing_month=p_month for update;
  select coalesce(sum(i.agreed_fee - coalesce((select sum(sp.amount) from public.student_fee_payments sp where sp.invoice_id=i.id),0) - coalesce((select sum(d.amount) from public.student_fee_discounts d where d.invoice_id=i.id),0)),0)
  into v_due from public.student_fee_invoices i where i.student_id=p_student and i.billing_month=p_month;
  if v_due <= 0 then raise exception 'no outstanding due for this month'; end if;
  if v_amount > v_due then raise exception 'payment exceeds this month due'; end if;
  if v_amount = 0 and not p_apply_discount then raise exception 'enter a payment amount or apply a discount'; end if;

  v_remaining := v_amount;
  for v_invoice in
    select i.id, greatest(0, i.agreed_fee - coalesce((select sum(sp.amount) from public.student_fee_payments sp where sp.invoice_id=i.id),0) - coalesce((select sum(d.amount) from public.student_fee_discounts d where d.invoice_id=i.id),0)) as due
    from public.student_fee_invoices i where i.student_id=p_student and i.billing_month=p_month order by i.id
  loop
    exit when v_remaining <= 0;
    v_alloc := least(v_invoice.due,v_remaining);
    if v_alloc > 0 then
      insert into public.student_fee_payments(invoice_id,amount,payment_date,received_by,note,receipt_id)
      values(v_invoice.id,v_alloc,p_payment_date,v_user,'',v_receipt);
      v_paid := v_paid + v_alloc;
      v_remaining := v_remaining - v_alloc;
    end if;
  end loop;

  if p_apply_discount then
    v_discount_target := v_due - v_paid;
    v_discount := v_discount_target;
    if v_discount > 0 then
      for v_invoice in
        select i.id, greatest(0, i.agreed_fee - coalesce((select sum(sp.amount) from public.student_fee_payments sp where sp.invoice_id=i.id),0) - coalesce((select sum(d.amount) from public.student_fee_discounts d where d.invoice_id=i.id),0)) as due
        from public.student_fee_invoices i where i.student_id=p_student and i.billing_month=p_month order by i.id
      loop
        exit when v_discount <= 0;
        v_alloc := least(v_invoice.due,v_discount);
        if v_alloc > 0 then
          insert into public.student_fee_discounts(receipt_id,invoice_id,student_id,billing_month,amount,applied_by)
          values(v_receipt,v_invoice.id,p_student,p_month,v_alloc,v_user);
          v_discount := v_discount - v_alloc;
        end if;
      end loop;
      v_discount := v_discount_target;
    end if;
  end if;
  update public.students set paid=coalesce(paid,0)+v_paid where id=p_student;
  insert into public.student_fee_receipts(receipt_id,student_id,billing_month,paid_amount,discount_amount,remaining_amount,payment_date,received_by)
  values(v_receipt,p_student,p_month,v_paid,case when p_apply_discount then v_discount_target else 0 end,case when p_apply_discount then 0 else v_due-v_paid end,p_payment_date,v_user);
  return jsonb_build_object('receipt_id',v_receipt,'paid',v_paid,'discount',case when p_apply_discount then v_discount_target else 0 end,'remaining',case when p_apply_discount then 0 else v_due-v_paid end,'payment_date',p_payment_date,'recorded_at',now());
end $$;

create or replace function public.student_fee_history(p_student uuid, p_month date default null)
returns setof jsonb language plpgsql stable security definer set search_path = '' as $$
begin
  if (select auth.uid()) is null then raise exception 'authentication required'; end if;
  if not (public.is_admin() or (public.current_role() in ('editor','accountant','viewer') and public.has_user_tab('fees'))) then raise exception 'fee access denied'; end if;
  return query
  select history.payload
  from (
    select jsonb_build_object('kind','receipt','id',r.receipt_id,'receiptId',r.receipt_id,'month',r.billing_month,'paid',r.paid_amount,'discount',r.discount_amount,'remaining',r.remaining_amount,'paymentDate',r.payment_date,'recordedAt',r.recorded_at,'receivedBy',r.received_by) as payload,
      r.recorded_at as recorded_at
    from public.student_fee_receipts r
    where r.student_id=p_student and (p_month is null or r.billing_month=p_month)
    union all
    select jsonb_build_object('kind','legacy','id',sp.id,'receiptId',sp.receipt_id,'month',i.billing_month,'paid',sp.amount,'discount',0,'remaining',null,'paymentDate',sp.payment_date,'recordedAt',sp.paid_at,'receivedBy',sp.received_by) as payload,
      sp.paid_at as recorded_at
    from public.student_fee_payments sp join public.student_fee_invoices i on i.id=sp.invoice_id
    where i.student_id=p_student and (p_month is null or i.billing_month=p_month)
      and not exists(select 1 from public.student_fee_receipts r where r.receipt_id=sp.receipt_id)
  ) history
  order by history.recorded_at desc;
end $$;

revoke all on function public.assign_student_number() from public;
revoke all on function public.admin_student_roster(integer,integer,text,text) from public;
revoke all on function public.fee_student_roster() from public;
revoke all on function public.save_student_with_admission(jsonb,jsonb) from public;
revoke all on function public.collect_student_month_fee(uuid,date,numeric,date,boolean) from public;
revoke all on function public.student_fee_history(uuid,date) from public;
grant execute on function public.admin_student_roster(integer,integer,text,text) to authenticated;
grant execute on function public.fee_student_roster() to authenticated;
grant execute on function public.save_student_with_admission(jsonb,jsonb) to authenticated;
grant execute on function public.collect_student_month_fee(uuid,date,numeric,date,boolean) to authenticated;
grant execute on function public.student_fee_history(uuid,date) to authenticated;

commit;
