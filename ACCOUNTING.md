# মেধা কোচিং — হিসাবের সম্পূর্ণ লজিক (Accounting & Data Flow)

এই ফাইলটা পড়ে তুমি ডাটাবেসের কানেকশন যাচাই করতে পারবে — কোন কাজ করলে কোথায়
কী লেখা হয়, কীভাবে Due বের হয়, আর কোন পথে কোথায় টাকা যোগ/বিয়োগ হয়।

---

## ১. মূল ডাটাবেস টেবিল (কোথায় কী থাকে)

| টেবিল | কী রাখে |
|---|---|
| `courses` | সব কোর্স ও প্যাকেজ (একই টেবিল, `type` = `subject` বা `package`)। `fee` = ডিফল্ট মাসিক ফি। প্যাকেজের ভেতরের সাবজেক্ট `included_subject_ids` অ্যারেতে। |
| `enrollments` | কোন student কোন course/package-এ ভর্তি এবং তার **তখনকার ফি** (`fee`) — মানে প্রতি student-কোর্সের স্ন্যাপশট। |
| `student_fee_invoices` | মাসভিত্তিক বিল। প্রতি `(student, course, month)`-এ এক রো, `agreed_fee` = সেই মাসে দিতে হবে। এটাই Due-এর মূল ভিত্তি। |
| `student_fee_payments` | কোন invoice-এ কত টাকা জমা (এক invoice-এ অনেক payment হতে পারে)। |
| `student_fee_discounts` | কোন invoice-এ কত মাফ (`discount`)। |
| `student_fee_receipts` | প্রতি জমার রিসিট। `kind` = `month` (মাসিক) বা `admission` (ভর্তি)। |
| `admission_payments` | ভর্তি ফি কত ধার্য (`required_amount`) আর কত জমা (`amount_paid`)। |
| `money_entries` | হাতে লেখা আয়/খরচ + অটো-পোস্ট হওয়া আয় (Student fee, Admission fee, Teacher payment)। |
| `bank_account` / `bank_transactions` | ব্যাংকের শুরু ব্যালেন্স + জমা/উত্তোলন। |
| `teacher_payments` | শিক্ষককে দেওয়া টাকা (সাথে `money_entries`-এ expense-ও লেখা হয়)। |
| `class_sessions` / `class_attendance` | ক্লাস ও হাজিরা। |

**Due = `agreed_fee − paid − discount`** (ঋণাত্মক হলে ০)। এই হিসাব ক্লায়েন্টে
`invoiceDue()` (app.js) আর ডাটাবেসে `collect_student_month_fee` ইত্যাদিতে একইভাবে হয়।

---

## ২. টাকার প্রবাহ (কোন কাজ করলে কোথায় যায়)

### ক) ভর্তি ফি (Admission fee)
- Student save করলে (`save_student_with_admission`) ভর্তি ফি **সঙ্গে সঙ্গে জমা** ধরে নেওয়া হয়:
  - `admission_payments`-এ `amount_paid = required_amount`
  - `student_fee_receipts`-এ একটা রিসিট (`kind='admission'`)
  - `money_entries`-এ একটা income (`category='Admission fee'`), তারিখ = ভর্তির তারিখ
- পুরনো student আবার save করলে ভর্তি ফি **দুবার** কাটে না (শুধু প্রথমবার)।
- রিসিট Delete করলে ভর্তি জমা undo হয় (`void_student_fee_receipt`, kind='admission')।

### খ) মাসিক ফি (Monthly fee) → Invoice → Due
1. Fees ট্যাবে মাস দেখলে `ensure_month_invoices(month)` চলে — প্রতিটি active
   enrollment থেকে সেই মাসের invoice বানায়, `agreed_fee = enrollments.fee`
   (আগে থাকলে আর বদলায় না — শুধু নতুন মাস যোগ করে)।
2. Taka তোলা হয় `collect_student_month_fee` দিয়ে — Due হিসাব করে invoice-এ ভাগ ভাগ
   করে `student_fee_payments` লেখে, একটা রিসিট (`kind='month'`) বানায়, আর
   `money_entries`-এ `Student fee` income পোস্ট করে (`student_fee_income`)।
3. Due তখনই কমে, কারণ `paid` যোগ হয় → `invoiceDue()` কমে যায় (Dashboard ও Reports দুটোই কমে)।

### গ) ডিসকাউন্ট (Discount)
- জমার সময় Discount টিক দিলে `student_fee_discounts`-এ লেখা হয়; Due = agreed − paid − discount।

### ঘ) রিসিট Edit / Delete
- `edit_student_fee_receipt` → পুরনো payment সরিয়ে নতুন করে বসায়।
- `void_student_fee_receipt` → payment/discount মুছে দেয়, `students.paid` কমায়;
  admission হলে income entry-ও মুছে দেয়। **শুধু super admin** করতে পারে।

### ঙ) কোর্স/প্যাকেজের দাম বদলালে (নতুন)
- Courses ট্যাবে দাম save করলে নতুন ট্রিগার `courses_fee_sync` চলে:
  - `courses.fee` বদলালে সেই course-এর `enrollments.fee` এবং **সব মাসের**
    `student_fee_invoices.agreed_fee` একসাথে update হয়।
- ফলে সব student-এর Fees/Due আর নতুন মাসের বিল সবই নতুন দামে চলে যায়।

### চ) Student edit — কোর্স যোগ/বাদ
- `save_student_with_admission` পুরনো enrollment মুছে নতুন লিস্ট বসায়, এবং
  বর্তমান মাসের invoice upsert করে।
- **বাদ পড়া কোর্সের যেসব invoice-এ কোনো টাকা/ডিসকাউন্ট নেই, সেগুলো মুছে ফেলা হয়** —
  তাই বাদ দেওয়া কোর্স আর ফি-তে দেখায় না।
- যে মাসে টাকা জমা হয়ে গেছে সেসব invoice **রাখা হয়** (ইতিহাস নষ্ট না করতে)।

### ছ) হাতে লেখা আয়/খরচ (Accounts ট্যাব)
- `money_entries`-এ `type='income'` বা `'expense'`। এগুলো সরাসরি Reports-এ যোগ হয়।

### জ) শিক্ষকের বেতন
- `teacher_payments`-এ দিলে একটা `money_entries` expense (`category='Teacher payment'`)
  অটো তৈরি হয়।

### ঝ) ব্যাংক
- `bank_account.opening_balance` + `bank_transactions` (deposit/withdrawal)।
- ব্যালেন্স = opening + deposits − withdrawals।
- এটা আলাদা লেজার; income/expense-এ অটো যোগ হয় না (Reports-এ Net-এ deposit যোগ হয় — নিচে)।

---

## ৩. Dashboard-এর "Total due" ও Reports-এর Due

- **Dashboard Total due** = সব invoice-এর `invoiceDue` যোগ (সব student, সব মাস)।
- **Reports Due** = শুধু নির্বাচিত periods-এর মাসগুলোর invoice।
- কারণ দুটো আলাদা প্রশ্ন, তাই সংখ্যা আলাদা হতে পারে (Report-এ period বদলে দেখো)।
- Total due কার্ডে ক্লিক করলে student-ভিত্তিক তালিকা (drawer) খোলে; কেউ ফি দিলে
  সেই Due সঙ্গে সঙ্গে কমে যায়।

## ৪. Reports-এর হিসাব (গণিত)

```
Income   = (হাতে লেখা income − "Student fee" পোস্ট) + (মাসিক জমা + ভর্তি ফি জমা)
Expense  = হাতে লেখা expense (+ Teacher payment)
Net      = Income − Expense + Bank deposit   ← (নতুন নিয়ম)
In bank  = period শেষে ব্যাংক ব্যালেন্স
```

> দুবার গোনা এড়াতে "Student fee" category-র অটো income Reports-এ বাদ দিয়ে
> আসল payment যোগ করা হয়।

## ৫. হাজিরা (Attendance)

- Attendance ট্যাব → السنة (1st/2nd) → subject → তারিখ → Present/Absent → Save।
- ডাটা যায় `class_sessions` (subject + year + date) ও `class_attendance`-এ।
- `subject_attendance_days` দিয়ে date-ভিত্তিক history; যেকোনো date-এ ক্লিক করে
  সেই দিনের হাজিরা দেখা/এডিট করা যায়। যেকোনো staff (student ছাড়া) নিতে পারে।

---

## ৬. কোথায় কী যায় — এক নজরে

| কাজ | ডাটাবেস টেবিল/ফাংশন |
|---|---|
| Student add/edit | `students`, `enrollments`, `student_fee_invoices`, `admission_payments`, `student_fee_receipts`, `money_entries` — `save_student_with_admission` |
| মাসিক ফি জমা | `student_fee_payments`, `student_fee_receipts`, `money_entries`, `students.paid` — `collect_student_month_fee` |
| রিসিট edit/delete | `student_fee_payments`/`student_fee_discounts`/`student_fee_receipts` — `edit_student_fee_receipt`, `void_student_fee_receipt` |
| কোর্স দাম বদল | `courses`, `enrollments`, `student_fee_invoices` — ট্রিগার `courses_fee_sync` |
| হাতে আয়/খরচ | `money_entries` |
| ব্যাংক | `bank_account`, `bank_transactions` |
| হাজিরা | `class_sessions`, `class_attendance` — `*_subject_*` ফাংশন |

---

## ৭. যাচাই করার দরকারি SQL (Supabase SQL Editor-এ চালাও)

```sql
-- কোন student-এর এখন কত Due
select st.name,
       sum(greatest(0, i.agreed_fee
         - coalesce((select sum(p.amount) from public.student_fee_payments p where p.invoice_id=i.id),0)
         - coalesce((select sum(d.amount) from public.student_fee_discounts d where d.invoice_id=i.id),0))) as due
from public.students st
left join public.student_fee_invoices i on i.student_id = st.id
where st.deleted_at is null
group by st.name
order by due desc nulls last;

-- একটি course-এর সব student-এর ফি (দাম বদলের পর মিলিয়ে দেখো)
select st.name, e.fee from public.enrollments e
join public.students st on st.id = e.student_id
join public.courses c on c.id = e.course_id
where c.name = 'Physics';

-- একটি মাসের invoice ও জমা
select st.name, c.name as course, i.billing_month, i.agreed_fee
from public.student_fee_invoices i
join public.students st on st.id = i.student_id
join public.courses c on c.id = i.course_id
where i.billing_month = date_trunc('month', current_date)::date;
```
