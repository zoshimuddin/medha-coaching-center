const SUPABASE_URL = "https://mlsyvhlnnjexqtaswayi.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1sc3l2aGxubmpleHF0YXN3YXlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA4NDY2MDQsImV4cCI6MjEwNjQyMjYwNH0.xLaU6vHgz82qtvUyI5RwZLoVbk-hRRHetglO7N71VVw";

const sb = supabase.createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { persistSession: true, autoRefreshToken: true },
});

const today = (() => {
  const date = new Date();
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 10);
})();
const thisMonth = today.slice(0, 7);

/* ================= i18n ================= */

const I18N = {
  en: {
    managerLogin: "Manager Login", email: "Email", password: "Password",
    loginBtn: "Login", loginHint: "Login with your email and password.",
    forgotPass: "Forgot password?", loading: "Loading…",
    manager: "Manager",
    m_dashboard: "Dashboard", m_students: "Students", m_courses: "Courses & Schedule",
    m_attendance: "Attendance", m_fees: "Fees", m_money: "Accounts", m_payroll: "Teacher Pay",
    m_settings: "Settings", m_activity: "History",
    logout: "Logout",
    backupDown: "Download backup", backupUp: "Upload backup", clearAll: "Clear all data",
    incomeToday: "Today income", expenseToday: "Today cost", netToday: "Today net",
    role_admin: "Admin (everything)", role_subadmin: "Sub admin (everything, no users)",
    eyebrow: "Coaching workspace", todayDate: "Today's date",
    totalStudents: "Total Students", activeBatches: "Active Batches", presentToday: "Present Today",
    dueFees: "Due Fees", studentsPerCourse: "Students per Course",
    studentsPerBatch: "Students per Batch", feesCollectedDue: "Fees: Collected vs Due",
    recentStudents: "Recent Students", feeStatus: "Fee Status", todayAttendance: "Today's Attendance",
    studentName: "Student name *", mobile: "Mobile number *", guardian: "Guardian",
    guardianPhone: "Guardian mobile", whatsapp: "WhatsApp number", address: "Address",
    college: "College *", yearLevel: "Year *", year1: "1st year", year2: "2nd year",
    groupLabel: "Group *", batch: "Batch", pickCourses: "Pick courses / packages *",
    admissionFeeLabel: "Admission fee (fixed)", admissionPaid: "Admission fee paid *",
    thName: "Name", thContact: "Contact", thCollege: "College", thYear: "Year", thGroup: "Group",
    thCourse: "Course", thFeeStatus: "Fee Status", thAction: "Action",
    courseName: "Name *", courseType: "Type", typeSubject: "Single subject", typePackage: "Package",
    subjectName: "Subject *",
    courseFee: "Default monthly fee (BDT)", courseDuration: "Duration / details", cMonthlyFee: "Monthly fee",
    courseList: "All Courses & Packages", fAll: "All", onlySubject: "Subjects only", onlyPackage: "Packages only",
    scheduleTitle: "Weekly Schedule (course + year + group)", assignTeacher: "Teacher",
    weekdays: "Class days *", classTime: "Class time",
    ratePerClass: "Pay per class (৳)", addSchedule: "Add schedule",
    takeAttendance: "Take Attendance", markAllPresent: "Mark all present", saveAttendance: "Save attendance",
    totalCollected: "Total Collected", fMonth: "Month",
    feeTracking: "Fee Tracking", fAllStudents: "All students", fDueOnly: "Due only",
    fPaidOnly: "Paid only", thStudent: "Student", thPaid: "Paid", thDue: "Due",
    recentPayments: "Recent Payments",
    totalIncome: "Total Income", totalCost: "Total Cost", balance: "Balance", monthNet: "This Month Net",
    newEntry: "New Entry", entryDate: "Date", entryType: "Type", income: "Income", expense: "Expense",
    category: "Category", amount: "Amount *", note: "Note", saveEntry: "Save entry",
    incomeCost: "Income & Expense", onlyIncome: "Income only", onlyExpense: "Expense only",
    thDate: "Date", thType: "Type", thCategory: "Category", thAmount: "Amount",
    bankTitle: "Bank", bankBalance: "In bank", direction: "Type", deposit: "Deposit",
    withdrawal: "Withdrawal", description: "Description", addBankTx: "Add",
    openingBalance: "Opening balance (admin only)", save: "Save",
    duesTitle: "Coaching Dues", duesTotalLabel: "Total owed", dueTitleStar: "What is due? *",
    dueAddBtn: "Add due",
    payrollTitle: "Teacher Pay (per class)", payTeacher: "Pay a teacher",
    teacherLabel: "Teacher *", payTeacherBtn: "Save payment", heldClassesTitle: "Held classes",
    brandingTitle: "Branding", coachingName: "Coaching name *", logoLabel: "Logo",
    removeLogo: "Remove logo", saveSettings: "Save settings",
    admissionFeeTitle: "Admission Fee", collegesTitle: "College list", groupsTitle: "Group list",
    addBtn: "Add", usersTitle: "User management (admin only)",
    usernameStar: "Username *", emailStar: "Email *", passwordStar: "Password *",
    passDashNote: "Use the Supabase dashboard to change passwords", role: "Role",
    role_editor: "Editor (add/edit, no users)", role_viewer: "Viewer (view only)",
    role_accountant: "Accountant (money entry)", role_teacher: "Teacher (attendance only)",
    role_student: "Student (view dashboard)",
    permLegend: "Which pages can access", fieldGrants: "Which student fields this teacher can see",
    payrollAccess: "Can view Teacher Pay page", moneyEditPerm: "Can add entries on Accounts page",
    linkStudent: "Link student (for student role)",
    thUsername: "Username", thRole: "Role", thPages: "Pages",
    activityTitle: "User History — who did what", allUsers: "All users",
    thUser: "User", thWork: "Action", thDetail: "Details",
    batchName: "Batch name *", batchList: "Batches",
    scanBtn: "Scan admission form",
  },
};

const I18N_PH = {
  en: {
    emailPh: "you@example.com", studentNamePh: "e.g. Farhan Ahmed",
    collegePh: "e.g. Dhaka College", searchStudent: "Search by name or number", searchPh: "Search",
  },
};

const STR = {
  en: {
    appName: "Medha Coaching Center",
    noBatch: "No batch", allBatches: "All batches", allYears: "All years",
    selectStudent: "Select student", selectTeacher: "Select teacher", noPhone: "No phone",
    noGuardian: "No guardian", noTeacherAssigned: "No teacher", noSchedule: "No time",
    noDesc: "No details", general: "General", dash: "—",
    edit: "Edit", del: "Delete", cancel: "Cancel", save: "Save", addBtn: "Add",
    addStudent: "Add student", editStudent: "Edit student", newStudent: "New student",
    newCourse: "New course / package", addCourseBtn: "Add", editCourse: "Edit course",
    newUser: "New user", makeUser: "Create user", editUser: "Edit user",
    present: "Present", absent: "Absent", notMarked: "Not marked",
    paid: "Paid", due: "Due", collected: "Collected", held: "Held", scheduled: "Scheduled",
    subject: "Subject", pack: "Package", you: "you", superAdmin: "Super Admin",
    roleAdmin: "Admin", roleSubadmin: "Sub Admin", roleEditor: "Editor", roleViewer: "Viewer",
    roleAccountant: "Accountant", roleStudent: "Student", roleTeacher: "Teacher",
    tabsAll: "All", tabsNone: "None", plusMoneyEdit: " + money entry",
    studentsSuffix: "students", enrolledSuffix: "enrolled",
    confirmSecond: "Really delete? This cannot be undone. Press OK again to confirm.",
    confirmDeleteStudent: "Delete?", confirmDeleteCourse: "Delete? Enrollments will be removed.",
    confirmDeleteOffering: "Delete this schedule?", confirmDeleteBatch: "Delete? Students will be unbatched.",
    confirmDeleteUser: "Delete user?", confirmDeleteMoney: "Delete this entry?",
    confirmDeleteDue: "Delete this due?", confirmDeleteBank: "Delete this bank entry?",
    confirmClearAll: "All data will be cleared (users and settings stay)?",
    msgLoginFail: "Wrong email or password.",
    msgNoProfile: "No profile for this email — ask the admin.",
    msgResetSent: "Password reset email sent.", msgNeedEmail: "Enter your email first.",
    msgEmailConfirm: "User created — email must be confirmed (Supabase Auth > Users).",
    msgUserDeleted: "User's access removed.",
    msgCdnFail: "No internet connection — reload the page.",
    msgWelcome: "Welcome", msgNoViewPerm: "No permission to view this page.",
    msgAdminOnly: "Only admin can view this.", msgNoEditPerm: "No permission to edit.",
    msgNameReq: "Enter the name.", msgPhoneReq: "Enter the mobile number.",
    msgCollegeReq: "Pick a college.", msgGroupReq: "Pick a group.",
    msgPickCourse: "Pick at least one course.", msgFeeNeg: "Fee must be 0 or more.",
    msgAdmissionShort: "Admission fee must be paid in full.",
    msgCourseReq: "Enter course name.", msgBatchReq: "Enter batch name.",
    msgDaysReq: "Pick at least one day.", msgUserReq: "Enter username.",
    msgUserExists: "Username already exists.", msgPassShort: "Password must be at least 4 chars.",
    msgLinkStudent: "Link a student for student role.",
    msgNoCoursePerm: "No permission for this class.",
    msgNoStudentsView: "No students in this view.", msgNoDate: "Nothing saved for this date.",
    msgAmtPos: "Enter an amount greater than 0.", msgNoDue: "No outstanding due for this student.",
    msgNoBackup: "Invalid backup file.", msgBackupFail: "Could not read backup file.",
    msgLogoBig: "Use a smaller logo image (under 300KB).",
    msgImportLegacy: "students are missing year/group — edit them to set it.",
    msgPickClass: "Pick a class first.", msgNoChanges: "No changes.",
    tStudentAdd: "Student added.", tStudentEdit: "Student updated.",
    tStudentDel: "Student deleted.", tCourseAdd: "Course added.",
    tCourseEdit: "Course updated.", tCourseDel: "Course deleted.",
    tOfferingAdd: "Schedule added.", tOfferingEdit: "Schedule updated.",
    tOfferingDel: "Schedule deleted.", tBatchAdd: "Batch added.", tBatchDel: "Batch deleted.",
    tEntry: "Entry saved.", tEntryDel: "Entry deleted.",
    tPaid: "payment recorded.", tAttendanceSaved: "Attendance saved.",
    tDueAdd: "Due added.", tDuePaid: "Marked as paid.",
    tDueUnpaid: "Marked as unpaid again.", tDueDel: "Due deleted.",
    tBankAdd: "Bank entry added.", tBankDel: "Bank entry deleted.",
    tBankSaved: "Opening balance saved.",
    tPaySaved: "Teacher payment saved.", tSettingsSaved: "Settings saved.",
    tUserAdd: "User created.", tUserEdit: "User updated.",
    tBackupDown: "Backup downloaded.",
    tBackupUp: "Backup imported.", tClear: "All data cleared.",
    emptyStudents: "No students yet.", emptyNoMatch: "No matching students.",
    emptyCourse: "No courses yet.", emptyBatch: "No batches yet.",
    emptyClasses: "No class scheduled for this weekday.", emptyRoster: "No students in this class.",
    emptyOfferings: "No schedules yet.", emptyFeeView: "No students.",
    emptyMoney: "No entries yet.", emptyBank: "No bank entries yet.",
    emptyDues: "No dues yet.", emptyUsers: "No users yet.",
    emptyActivity: "No records yet.", emptyPayroll: "No teachers yet.",
    emptyHeld: "No classes held yet.", emptyPayments: "No payments yet.",
    feePaidAll: "Fully paid", feeHasDue: "Has due fees",
    attPresent: "Present today", attAbsent: "Absent today",
    lblPaidCount: "fully paid", lblDueCount: "with due",
    paymentsCountSuffix: "payments",
    classesHeld: "classes", earnedLabel: "Earned", paidLabel: "Paid", dueLabel: "Due",
    promptPayment: "Payment for", entryBy: "By: ",
    byDeletedStudent: "Deleted student", unknown: "unknown",
    wa: "WhatsApp", phPass4: "Min 4 characters",
    day_0: "Sun", day_1: "Mon", day_2: "Tue", day_3: "Wed", day_4: "Thu", day_5: "Fri", day_6: "Sat",
    rosterTitle: "Roster", takePayment: "Take payment",
    scanBtn: "Scan admission form",
    dueMarkPaid: "Mark paid", dueMarkUnpaid: "Mark unpaid", noCourse: "No course",
    msgCourseFeeNeg: "Course fee must be 0 or more.", cMonthlyFee: "Monthly fee",
    msgScanning: "Reading form…",
    msgScanDone: "fields filled — review before saving",
    msgScanEmpty: "Nothing readable — fill manually",
    msgScanFail: "Scan failed.",
    msgScanNoFunc: "scan-form function not deployed — see DEPLOY.md",
    msgScanImage: "Use an image file (JPG/PNG)",
    msgScanUnmatched: "Courses not auto-matched — pick manually:",
    msgScanSave: "Reviewed everything before saving?",
  },
};

let lang = "en";

function t(key) { return STR.en[key] || key; }
function tr(key) { return I18N.en[key] || key; }
function trPh(key) { return I18N_PH.en[key] || ""; }

function toNum(value) { return Number(value || 0).toLocaleString("en-US"); }
function formatMoney(value) { return `৳${Number(value || 0).toLocaleString("en-US")}`; }

function roleLabel(role) {
  return { admin: t("roleAdmin"), subadmin: t("roleSubadmin"), editor: t("roleEditor"), viewer: t("roleViewer"), accountant: t("roleAccountant"), student: t("roleStudent"), teacher: t("roleTeacher") }[role] || role;
}

function yearLabel(year) {
  if (year === "1st year") return tr("year1");
  if (year === "2nd year") return tr("year2");
  return year || t("dash");
}

function markRequiredStars() {
  // Color the trailing required asterisk red without touching i18n text nodes.
  document.querySelectorAll("label > span").forEach((span) => {
    const text = span.textContent || "";
    if (text.trimEnd().endsWith("*") && !span.querySelector(".req-star")) {
      const trimmed = text.trimEnd();
      span.textContent = trimmed.slice(0, -1);
      const star = document.createElement("em");
      star.className = "req-star";
      star.textContent = "*";
      span.appendChild(star);
    }
  });
}

function applyLang() {
  lang = "en";
  document.documentElement.lang = "en";
  document.querySelectorAll("[data-i18n]").forEach((el) => { el.textContent = tr(el.dataset.i18n); });
  document.querySelectorAll("[data-i18n-ph]").forEach((el) => { el.placeholder = trPh(el.dataset.i18nPh); });
  markRequiredStars();
  applyBrand();
}

/* ================= tabs / roles ================= */

const ALL_TABS = [
  { id: "dashboard", labelBn: "ড্যাশবোর্ড", labelEn: "Dashboard" },
  { id: "students", labelBn: "শিক্ষার্থী", labelEn: "Students" },
  { id: "courses", labelBn: "কোর্স ও শিডিউল", labelEn: "Courses & Schedule" },
  { id: "attendance", labelBn: "হাজিরা", labelEn: "Attendance" },
  { id: "fees", labelBn: "ফি", labelEn: "Fees" },
  { id: "money", labelBn: "হিসাব", labelEn: "Accounts" },
];

const ROLE_DEFAULTS = {
  admin: { tabs: ["dashboard", "students", "courses", "attendance", "fees", "money"], moneyEdit: true },
  subadmin: { tabs: ["dashboard", "students", "courses", "attendance", "fees", "money"], moneyEdit: true },
  editor: { tabs: ["dashboard", "students", "courses", "attendance", "fees"], moneyEdit: false },
  viewer: { tabs: ["dashboard", "students", "courses", "attendance", "fees", "money"], moneyEdit: false },
  accountant: { tabs: ["dashboard", "money"], moneyEdit: true },
  teacher: { tabs: ["attendance"], moneyEdit: false },
  student: { tabs: ["dashboard"], moneyEdit: false },
};

const VIEW_ORDER = ["dashboard", "reminders", "students", "fees", "more", "courses", "schedule", "attendance", "money", "payroll", "reports", "settings", "activity", "ideas"];
const MORE_VIEWS = ["reports", "ideas", "schedule", "courses", "attendance", "money", "payroll", "settings", "activity"];

function viewTitle(id) {
  const map = {
    dashboard: tr("m_dashboard"), students: tr("m_students"), courses: tr("m_courses"),
    attendance: tr("m_attendance"), fees: tr("m_fees"), money: tr("m_money"),
    payroll: tr("m_payroll"), reports: "Reports", reminders: "Reminder", more: "More",
    schedule: "Schedule", ideas: "Ideas & plans", settings: tr("m_settings"), activity: tr("m_activity"),
  };
  return map[id] || id;
}

function tabLabel(id) {
  const found = ALL_TABS.find((tb) => tb.id === id);
  if (!found) return id;
  return found.labelEn;
}

/* ================= state ================= */

const state = {
  settings: { coachingName: "Medha Coaching Center", admissionFee: 0, colleges: ["Ramganj Govt College", "Ramganj Model College", "Alia Madrasha"], groups: ["Science", "Commerce", "Arts", "Madrasa"], logoData: "" },
  batches: [], courses: [], offerings: [],
  students: [], invoices: [], money: [], dues: [],
  bank: { opening: 0 }, bankTx: [],
  teacherPayments: [], heldSessions: [],
  users: [], activity: [], feePayments: [], feeDiscounts: [], usersLoadError: "",
  ideas: [], offeringCounts: {}, trash: [],
};
let editingStudentId = null;
let editingCourseId = null;
let editingOfferingId = null;
let editingUserId = null;
let currentUser = null;
let activeSession = { offering: null, sessionId: null, marks: new Map() };
let logoPicked = null;
let studentStatusFilter = "active";
let attendanceSubjectId = "";
let attendanceYear = "all";
let editingReceiptId = null;
let currentFeeStudentId = null;
let lastReceipt = null;
let pendingDiscount = null;
let ideaFilter = "All";
let reportPeriod = "month";
let coursePickerTab = "subject";
let pendingSubjectFilter = null;

const els = {};
for (const el of document.querySelectorAll("[id]")) els[el.id] = el;

function renderToday() {
  els.todayLabel.textContent = new Date().toLocaleDateString("en-GB", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });
}
renderToday();
els.attendanceDate.value = today;
els.moneyDate.value = today;
els.dueDate.value = today;
els.bankDate.value = today;
els.feeMonth.value = thisMonth;
els.reportPeriodMonth.value = thisMonth;
els.reportPeriodDate.value = today;
els.reportPeriodYear.value = Number(thisMonth.slice(0, 4));

/* ================= helpers ================= */

function uuid() { return crypto.randomUUID(); }

function fail(error) {
  toast(error?.message || t("msgCdnFail"));
  console.error(error);
  return false;
}

async function safe(query) {
  try {
    const { data, error } = await query;
    if (error) throw error;
    return data ?? [];
  } catch (err) {
    console.debug("query skipped:", err?.message);
    return [];
  }
}

function emptyState(message) { return `<div class="empty-state">${message}</div>`; }

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

let toastTimer = null;
function toast(message) {
  els.toast.textContent = message;
  els.toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => els.toast.classList.remove("show"), 2600);
}

function confirmDelete(firstMessage) {
  if (!confirm(firstMessage)) return false;
  return confirm(t("confirmSecond"));
}

const WEEKDAY_ORDER = [6, 0, 1, 2, 3, 4, 5]; // Sat..Fri (JS getDay values)
function dayLabel(dow) { return t("day_" + dow); }

function getBatchName(batchId) { return state.batches.find((b) => b.id === batchId)?.name || t("noBatch"); }
function getCourseName(courseId) { return state.courses.find((c) => c.id === courseId)?.name || t("dash"); }
function courseTypeLabel(type) { return type === "package" ? t("pack") : t("subject"); }
function getTeacherName(id) { return state.users.find((u) => u.id === id)?.username || t("noTeacherAssigned"); }
function isEnrolled(student, courseId) { return Array.isArray(student.enrollments) && student.enrollments.some((e) => e.courseId === courseId); }
function studentCourseNames(student) {
  return (student.enrollments || []).map((e) => getCourseName(e.courseId)).filter((n) => n && n !== t("dash"));
}

function courseById(id) { return state.courses.find((c) => c.id === id); }
function includedSubjectIds(course) { return Array.isArray(course?.includedSubjectIds) ? course.includedSubjectIds : []; }
function courseTypeOf(id) { return courseById(id)?.type || "subject"; }

// A student belongs to a course when enrolled directly, or through a package
// that includes that subject (Science Full -> Physics, Chemistry, ...).
function studentInCourse(student, courseId) {
  const enrolled = student.enrollments || [];
  if (enrolled.some((e) => e.courseId === courseId)) return true;
  const course = courseById(courseId);
  if (!course || course.type !== "subject") return false;
  return state.courses.some((pkg) => pkg.type === "package"
    && includedSubjectIds(pkg).includes(courseId)
    && enrolled.some((e) => e.courseId === pkg.id));
}

function courseEnrollmentCount(courseId) {
  return state.students.filter((s) => s.status === "active" && studentInCourse(s, courseId)).length;
}

function formatClassTime(value) {
  if (!value) return "";
  const [h, m] = String(value).split(":").map(Number);
  if (Number.isNaN(h)) return String(value);
  const suffix = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${String(Number.isNaN(m) ? 0 : m).padStart(2, "0")} ${suffix}`;
}

// Everyone who can take attendance can also be assigned to a class.
function eligibleTeachers() {
  return state.users.filter((u) => isManagerRole(u.role) || u.role === "teacher" || (u.tabs || []).includes("attendance"));
}
function isManagerRole(role) { return role === "admin" || role === "subadmin"; }

/* ================= data layer ================= */

const db = {
  async loadCore() {
    const [settings, batches, courses, offerings] = await Promise.all([
      safe(sb.from("coaching_settings").select("*").eq("id", true).maybeSingle()),
      safe(sb.from("batches").select("*").order("created_at", { ascending: true })),
      safe(sb.from("courses").select("*").order("created_at", { ascending: true })),
      safe(sb.from("course_offerings").select("*").order("created_at", { ascending: true })),
    ]);
    if (settings && !Array.isArray(settings)) {
      state.settings = {
        coachingName: settings.coaching_name || "Medha Coaching Center",
        admissionFee: Number(settings.admission_fee || 0),
        colleges: Array.isArray(settings.colleges) ? settings.colleges : state.settings.colleges,
        groups: Array.isArray(settings.groups) ? settings.groups : state.settings.groups,
        logoData: settings.logo_data || "",
      };
    }
    state.batches = batches.map((r) => ({ id: r.id, name: r.name, teacher: r.teacher || "", schedule: r.schedule || "", createdAt: Date.parse(r.created_at) }));
    state.courses = courses.map((r) => ({ id: r.id, name: r.name, type: r.type, fee: Number(r.fee || 0), duration: r.duration || "", includedSubjectIds: Array.isArray(r.included_subject_ids) ? r.included_subject_ids : [], createdAt: Date.parse(r.created_at) }));
    state.offerings = offerings.map((r) => ({
      id: r.id, courseId: r.course_id, year: r.year_level, group: r.group_name,
      batchId: r.batch_id || "", teacherId: r.teacher_id || "",
      weekdays: Array.isArray(r.weekdays) ? r.weekdays : [],
      classTime: r.class_time || "", rate: Number(r.rate_per_class || 0),
      active: r.active !== false, createdAt: Date.parse(r.created_at),
    }));
    state.offeringCounts = {};
  },

  async loadStudents() {
    state.students = [];
    if (!canView("students") && !canView("fees")) return;
    if (!canView("students")) {
      const { data, error } = await sb.rpc("fee_student_roster");
      if (error) { console.debug("fee roster rpc:", error.message); return; }
      state.students = (data || []).map((r) => ({
        id: r.id, studentNumber: r.studentNumber || "", name: r.name,
        year: r.yearLevel || "", batchId: r.batchId || "", status: r.status || "active",
        enrollments: [],
      }));
      return;
    }
    for (let page = 0; page < 20; page++) {
      const { data, error } = await sb.rpc("admin_student_roster", { p_page: page, p_page_size: 100, p_query: "", p_status: "" });
      if (error) { console.debug("roster rpc:", error.message); return; }
      const rows = data || [];
      state.students.push(...rows.map((r) => ({
        id: r.id, studentNumber: r.studentNumber || "", name: r.name, phone: r.phone || "", whatsapp: r.whatsapp || "",
        guardian: r.guardian || "", guardianPhone: r.guardianPhone || "",
        address: r.address || "", college: r.college || "", year: r.yearLevel || "",
        group: r.groupName || "", batchId: r.batchId || "", paid: Number(r.paid || 0),
        status: r.status || "active", gender: r.gender || "", birthday: r.birthday || "",
        admissionDate: r.admissionDate || "", createdAt: Date.parse(r.createdAt),
        enrollments: (r.enrollments || []).map((e) => ({ courseId: e.courseId, fee: Number(e.fee || 0) })),
      })));
      if (rows.length < 100) break;
    }
  },

  async loadFinance() {
    const canFees = canView("fees");
    const canMoney = canView("money");
    const [invoiceRows, paymentRows, discountRows, moneyRows, dueRows, bankRow, bankTxRows] = await Promise.all([
      canFees ? safe(sb.from("student_fee_invoices").select("*")) : [],
      canFees ? safe(sb.from("student_fee_payments").select("invoice_id,amount,payment_date,paid_at,received_by")) : [],
      canFees ? safe(sb.from("student_fee_discounts").select("invoice_id,amount,billing_month,applied_at,applied_by")) : [],
      canMoney ? safe(sb.from("money_entries").select("*").order("created_at", { ascending: false })) : [],
      canMoney ? safe(sb.from("dues").select("*").order("created_at", { ascending: false })) : [],
      canMoney ? safe(sb.from("bank_account").select("*").eq("id", true).maybeSingle()) : null,
      canMoney ? safe(sb.from("bank_transactions").select("*").order("transaction_date", { ascending: false }).limit(200)) : [],
    ]);
    state.feePayments = paymentRows || [];
    state.feeDiscounts = discountRows || [];
    const paymentsByInvoice = new Map();
    for (const payment of paymentRows || []) paymentsByInvoice.set(payment.invoice_id, (paymentsByInvoice.get(payment.invoice_id) || 0) + Number(payment.amount || 0));
    const discountsByInvoice = new Map();
    for (const discount of discountRows || []) discountsByInvoice.set(discount.invoice_id, (discountsByInvoice.get(discount.invoice_id) || 0) + Number(discount.amount || 0));
    state.invoices = (Array.isArray(invoiceRows) ? invoiceRows : []).map((r) => ({
      id: r.id, studentId: r.student_id, courseId: r.course_id,
      month: (r.billing_month || "").slice(0, 7), agreedFee: Number(r.agreed_fee || 0),
      paid: paymentsByInvoice.get(r.id) || 0,
      discount: discountsByInvoice.get(r.id) || 0,
    }));
    state.money = (Array.isArray(moneyRows) ? moneyRows : []).map((r) => ({ id: r.id, date: r.date, type: r.type, category: r.category || "", amount: Number(r.amount || 0), note: r.note || "", by: r.by_username || "", createdAt: Date.parse(r.created_at) }));
    state.dues = (Array.isArray(dueRows) ? dueRows : []).map((r) => ({ id: r.id, title: r.title, amount: Number(r.amount || 0), date: r.date, paid: !!r.paid, createdAt: Date.parse(r.created_at) }));
    state.bank = bankRow && !Array.isArray(bankRow) ? { opening: Number(bankRow.opening_balance || 0) } : { opening: 0 };
    state.bankTx = (Array.isArray(bankTxRows) ? bankTxRows : []).map((r) => ({ id: r.id, date: r.transaction_date, direction: r.direction, amount: Number(r.amount || 0), note: r.description || "", createdAt: Date.parse(r.created_at) }));
  },

  async loadPayroll() {
    if (!canView("payroll")) { state.teacherPayments = []; state.heldSessions = []; return; }
    const [payments, sessions] = await Promise.all([
      safe(sb.from("teacher_payments").select("*").order("paid_at", { ascending: false })),
      safe(sb.from("class_sessions").select("*, course_offerings!inner(teacher_id, course_id, year_level, group_name)").eq("status", "held").order("class_date", { ascending: false }).limit(500)),
    ]);
    state.teacherPayments = (payments || []).map((r) => ({ id: r.id, teacherId: r.teacher_id, amount: Number(r.amount || 0), paidAt: Date.parse(r.paid_at), note: r.note || "" }));
    state.heldSessions = (sessions || []).map((r) => ({
      id: r.id, date: r.class_date, rate: Number(r.rate_snapshot || 0),
      teacherId: r.course_offerings.teacher_id, courseId: r.course_offerings.course_id,
      year: r.course_offerings.year_level, group: r.course_offerings.group_name,
    }));
  },

  async loadAdmin() {
    if (!isManager()) { state.users = []; state.activity = []; state.usersLoadError = ""; return; }
    const [usersResult, activity] = await Promise.all([
      isAdmin()
        ? sb.from("profiles").select("*").order("created_at", { ascending: true })
        : Promise.resolve({ data: [], error: null }),
      safe(sb.from("activity_log").select("*").order("created_at", { ascending: false }).limit(500)),
    ]);
    if (usersResult.error) {
      // Keep the previous list on screen instead of silently blanking it.
      state.usersLoadError = usersResult.error.message;
      console.debug("profiles load:", usersResult.error.message);
    } else {
      state.usersLoadError = "";
      state.users = (usersResult.data || []).map((r) => ({
        id: r.id, username: r.username, role: r.role,
        tabs: Array.isArray(r.tabs) ? r.tabs : [], moneyEdit: !!r.money_edit,
        fieldGrants: Array.isArray(r.student_field_grants) ? r.student_field_grants : [],
        payrollAccess: !!r.teacher_payroll_access, studentId: r.student_id || "",
        createdAt: Date.parse(r.created_at),
      }));
    }
    state.activity = (activity || []).map((r) => ({
      id: r.id, user: r.username, action: r.action, detail: r.detail || "", date: r.date,
      time: new Date(r.created_at).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }),
      createdAt: Date.parse(r.created_at),
    }));
  },

  async loadIdeas() {
    const data = await safe(sb.from("ideas").select("*, profiles(username)").order("created_at", { ascending: false }).limit(200));
    state.ideas = (data || []).map((r) => ({
      id: r.id, title: r.title || "", idea: r.idea || "", label: r.label || "New",
      createdBy: r.profiles?.username || "", createdAt: Date.parse(r.created_at),
    }));
  },

  async loadTrash() {
    state.trash = [];
    if (!isAdmin()) return;
    // Drop entries older than 30 days so the trash never grows unbounded.
    await safe(sb.rpc("purge_deleted_students", { p_days: 30 }));
    const data = await safe(sb.from("students").select("id, student_number, name, year_level, deleted_at").not("deleted_at", "is", null).order("deleted_at", { ascending: false }).limit(100));
    state.trash = (data || []).map((r) => ({
      id: r.id, studentNumber: r.student_number || "", name: r.name || "",
      year: r.year_level || "", deletedAt: r.deleted_at,
    }));
  },

  async loadAll() {
    await db.loadCore();
    await Promise.all([db.loadStudents(), db.loadFinance(), db.loadPayroll(), db.loadAdmin(), db.loadIdeas(), db.loadTrash()]);
  },
};

/* ================= auth & permissions ================= */

// Session policy: the login survives reloads and same-day visits; everyone is
// logged out after 24h without activity and must sign in again.
const SESSION_IDLE_KEY = "ccmLastActive";
const SESSION_IDLE_MS = 24 * 60 * 60 * 1000;
let lastSessionTouch = 0;

function touchSession(force = false) {
  const now = Date.now();
  if (!force && now - lastSessionTouch < 60_000) return;
  lastSessionTouch = now;
  try { localStorage.setItem(SESSION_IDLE_KEY, String(now)); } catch { /* ignore */ }
}

function sessionExpired() {
  try {
    const last = Number(localStorage.getItem(SESSION_IDLE_KEY) || 0);
    return last > 0 && Date.now() - last > SESSION_IDLE_MS;
  } catch { return false; }
}

["click", "keydown", "touchstart", "visibilitychange"].forEach((eventName) => {
  window.addEventListener(eventName, () => touchSession(), { passive: true });
});

setInterval(() => {
  if (currentUser && sessionExpired()) {
    doLogout();
    toast("Logged out — no activity for a day. Please log in again.");
  }
}, 60_000);

async function loadCurrentUserAndData() {
  const { data: userData, error: userErr } = await sb.auth.getUser();
  if (userErr || !userData?.user) return false;
  // A saved session older than the idle window (e.g. device unused for a day)
  // forces a fresh login for every user.
  if (sessionExpired()) {
    await sb.auth.signOut();
    return false;
  }
  touchSession(true);
  const { data: prof, error: profErr } = await sb.from("profiles").select("*").eq("id", userData.user.id).maybeSingle();
  if (profErr || !prof) {
    await sb.auth.signOut();
    return false;
  }
  currentUser = {
    id: prof.id, username: prof.username, role: prof.role,
    tabs: Array.isArray(prof.tabs) ? prof.tabs : [],
    moneyEdit: !!prof.money_edit,
    fieldGrants: Array.isArray(prof.student_field_grants) ? prof.student_field_grants : [],
    payrollAccess: !!prof.teacher_payroll_access,
    studentId: prof.student_id || "",
  };
  await db.loadAll();
  return true;
}

els.loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const email = els.loginEmail.value.trim().toLowerCase();
  const pass = els.loginPass.value;
  els.loginError.hidden = true;
  const submitBtn = els.loginForm.querySelector("button[type='submit']");
  submitBtn.disabled = true;
  try {
    const { error } = await sb.auth.signInWithPassword({ email, password: pass });
    if (error) {
      els.loginError.textContent = t("msgLoginFail");
      els.loginError.hidden = false;
      return;
    }
    const ok = await loadCurrentUserAndData();
    if (!ok) {
      els.loginError.textContent = t("msgNoProfile");
      els.loginError.hidden = false;
      return;
    }
    els.loginForm.reset();
    enterApp();
    logActivity("Login", "Logged in");
    toast(`${t("msgWelcome")}, ${currentUser.username}!`);
  } finally {
    submitBtn.disabled = false;
  }
});

async function doLogout() {
  await sb.auth.signOut();
  currentUser = null;
  showLogin();
}

els.logoutBtn.addEventListener("click", doLogout);

els.forgotBtn.addEventListener("click", async () => {
  const email = els.loginEmail.value.trim();
  if (!email) {
    toast(t("msgNeedEmail"));
    els.loginEmail.focus();
    return;
  }
  const { error } = await sb.auth.resetPasswordForEmail(email);
  toast(error ? error.message : t("msgResetSent"));
});

function isMobileMenu() { return window.matchMedia("(max-width: 940px)").matches; }

function openSidebar() {
  els.sidebar.classList.add("open");
  if (!document.querySelector(".sidebar-backdrop")) {
    const backdrop = document.createElement("div");
    backdrop.className = "sidebar-backdrop";
    backdrop.addEventListener("click", closeSidebar);
    document.body.appendChild(backdrop);
  }
}

function closeSidebar() {
  els.sidebar.classList.remove("open");
  document.querySelector(".sidebar-backdrop")?.remove();
}


function showLogin() {
  els.loginView.hidden = false;
  els.appShell.hidden = true;
}

/* ================= in-app history =================

The app keeps one browser entry for the current section. Backing from a
detail page closes that page, backing from any other section returns Home,
and backing out of Home asks before actually leaving the site. Detail pages
get their own entries so device back closes them and forward re-opens them. */

let currentRoute = "dashboard";
let historyReady = false;

function setAppState(stateObj, method) {
  try { history[method](stateObj, ""); } catch { /* ignore */ }
}

function pushDetailState(detailState) {
  setAppState(detailState, "pushState");
}

function initHistoryNav() {
  if (historyReady) return;
  historyReady = true;
  try {
    history.replaceState({ ccm: "root" }, "");
    history.pushState({ ccm: "app", view: currentRoute }, "");
  } catch { /* ignore */ }
  window.addEventListener("popstate", (event) => {
    const st = event.state || {};
    // A detail overlay is open and history moved past its entry: close it first.
    if (!els.studentDetailPage.hidden && st.ccm !== "student-detail") {
      els.studentDetailPage.hidden = true;
      return;
    }
    if (!els.feeDetailPage.hidden && st.ccm !== "fee-detail") {
      editingReceiptId = null;
      els.feeDetailPage.hidden = true;
      return;
    }
    // Traveling into a saved detail entry re-opens that page without new history.
    if (st.ccm === "student-detail") {
      els.studentDetailPage.hidden = false;
      els.studentForm.hidden = false;
      els.studentDetailTitle.textContent = st.title || "Student";
      switchView(st.view || "students", viewTitle(st.view || "students"), false);
      return;
    }
    if (st.ccm === "fee-detail") {
      if (st.studentId) openFeeDetail(st.studentId, false);
      return;
    }
    // A saved app entry returns to that section.
    if (st.ccm === "app" && st.view && currentUser && canView(st.view)) {
      currentRoute = st.view;
      switchView(st.view, viewTitle(st.view));
      return;
    }
    // Past the saved entries: any section first returns Home, and only from
    // Home does back ask before actually leaving the site.
    if (currentUser && (currentRoute || "dashboard") !== "dashboard") {
      switchView("dashboard", viewTitle("dashboard"));
      return;
    }
    if (confirm(t("msgLeaveConfirm"))) {
      history.go(-1);
      return;
    }
    setAppState({ ccm: "app", view: "dashboard" }, "pushState");
  });
}

function enterApp() {
  els.loginView.hidden = true;
  els.appShell.hidden = false;
  applyPermissions();
  renderAll();
  if (canView("fees")) refreshFees();
  initHistoryNav();
}

function isAdmin() { return !!(currentUser && currentUser.role === "admin"); }
function isSubAdmin() { return !!(currentUser && currentUser.role === "subadmin"); }
function isManager() { return isAdmin() || isSubAdmin(); }
function hasPayrollAccess() { return isManager() || !!(currentUser && currentUser.payrollAccess); }

function canView(tab) {
  if (!currentUser) return false;
  if (tab === "settings" || tab === "activity" || tab === "reports") return isManager();
  if (tab === "reminders") return isManager() || (currentUser.tabs || []).includes("students");
  if (tab === "ideas" || tab === "more") return true;
  if (tab === "payroll") return hasPayrollAccess();
  if (isManager()) return true;
  return (currentUser.tabs || []).includes(tab);
}

function canEditTab(tab) {
  if (!currentUser) return false;
  if (isManager()) return true;
  if (["viewer", "student", "teacher"].includes(currentUser.role)) return false;
  if (tab === "students") return currentUser.role === "editor" && (currentUser.tabs || []).includes("students");
  if (tab === "money") return !!currentUser.moneyEdit;
  return (currentUser.tabs || []).includes(tab);
}

function myOfferings() {
  if (isManager()) return state.offerings;
  return state.offerings.filter((o) => o.teacherId === currentUser?.id);
}

function canMarkOffering(offering) {
  return !!(currentUser && offering && (isManager() || offering.teacherId === currentUser.id));
}

function applyPermissions() {
  document.querySelectorAll("#mainNav .nav-tab").forEach((tab) => {
    tab.style.display = canView(tab.dataset.view) ? "" : "none";
  });
  els.adminTools.hidden = !isAdmin();
  els.userBadge.innerHTML = currentUser
    ? `<strong>${escapeHtml(currentUser.username)}</strong><span>${escapeHtml(roleLabel(currentUser.role))}</span>`
    : "";
  const first = VIEW_ORDER.find((v) => canView(v)) || "attendance";
  switchView(first, viewTitle(first));
  els.studentForm.hidden = true;
  els.showStudentFormBtn.hidden = !canEditTab("students");
  setFormEditable(els.courseForm, canEditTab("courses"));
  setFormEditable(els.offeringForm, isManager());
  setFormEditable(els.batchForm, isManager());
  setFormEditable(els.moneyForm, canEditTab("money"));
  setFormEditable(els.dueForm, canEditTab("money"));
  setFormEditable(els.bankForm, canEditTab("money"));
  els.bankOpeningBox.style.display = isManager() ? "" : "none";
  els.payPayPanel.style.display = isManager() ? "" : "none";
  els.usersSection.style.display = isAdmin() ? "" : "none";
  els.trashSection.hidden = !isAdmin();
}

function setFormEditable(form, editable) {
  if (form) form.style.display = editable ? "" : "none";
}

function switchView(viewId, title, updateHistory = true) {
  if (currentUser && !canView(viewId)) {
    toast(["settings", "activity", "reports"].includes(viewId) ? t("msgAdminOnly") : t("msgNoViewPerm"));
    return;
  }
  currentRoute = viewId;
  document.querySelectorAll(".nav-tab").forEach((tab) => tab.classList.toggle("active", tab.dataset.view === viewId));
  document.querySelectorAll("#mobileBottomNav button").forEach((tab) => {
    const active = tab.dataset.view === viewId || (viewId !== "dashboard" && viewId !== "reminders" && viewId !== "students" && viewId !== "fees" && tab.dataset.view === "more");
    tab.classList.toggle("active", active);
    tab.hidden = !canView(tab.dataset.view);
  });
  document.querySelectorAll(".view").forEach((view) => view.classList.toggle("active-view", view.id === viewId));
  els.pageTitle.textContent = title || viewTitle(viewId);
  els.mobilePageTitle.textContent = title || viewTitle(viewId);
  if (isMobileMenu()) closeSidebar();
  const content = document.querySelector(".content");
  if (content) content.scrollIntoView({ block: "start" });
  if (updateHistory && historyReady) {
    const st = history.state || {};
    if (st.ccm === "app") setAppState({ ccm: "app", view: viewId }, "replaceState");
    else setAppState({ ccm: "app", view: viewId }, "pushState");
  }
  if (viewId === "attendance") renderAttendanceClasses();
}

document.querySelectorAll(".nav-tab, #mobileBottomNav button").forEach((tab) => {
  tab.addEventListener("click", () => switchView(tab.dataset.view, viewTitle(tab.dataset.view)));
});

document.querySelectorAll("[data-home-view]").forEach((button) => button.addEventListener("click", () => switchView(button.dataset.homeView, viewTitle(button.dataset.homeView))));

document.querySelectorAll(".metric[data-goto]").forEach((card) => {
  const go = () => {
    if (canView(card.dataset.goto)) switchView(card.dataset.goto, viewTitle(card.dataset.goto));
  };
  card.addEventListener("click", go);
  card.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); go(); } });
});

function requireEdit(tab) {
  if (!canEditTab(tab)) {
    toast(t("msgNoEditPerm"));
    return false;
  }
  return true;
}

/* ================= branding ================= */

function applyBrand() {
  const name = state.settings.coachingName || "Medha Coaching Center";
  const shortName = name.trim().split(/\s+/)[0] || "Medha";
  const logo = state.settings.logoData || "";
  els.brandName.textContent = name;
  els.brandNameMobile.textContent = shortName;
  els.loginBrandName.textContent = name;
  document.title = `${name} Manager`;
  for (const [img, mark] of [
    [els.brandLogo, els.brandMark],
    [els.loginLogo, els.loginMark],
  ]) {
    if (logo) {
      img.src = logo;
      img.hidden = false;
      mark.hidden = true;
    } else {
      img.hidden = true;
      mark.hidden = false;
      mark.textContent = name.trim().charAt(0) || "M";
    }
  }
}

/* ================= students ================= */

els.waSameBtn.addEventListener("click", () => {
  els.whatsappNumber.value = els.studentPhone.value.trim();
});

els.scanBtn.addEventListener("click", () => els.scanFileInput.click());

async function downscaleImage(file) {
  const dataUrl = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
  const sourceMime = /^data:([^;]+);/.exec(dataUrl)?.[1] || file.type || "image/jpeg";
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const maxSide = 1024;
      const scale = Math.min(1, maxSide / Math.max(img.width, img.height));
      // Already small and light: send the original bytes untouched for speed.
      if (scale === 1 && dataUrl.length < 900_000) {
        resolve({ image: dataUrl, mime: sourceMime });
        return;
      }
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(img.width * scale));
      canvas.height = Math.max(1, Math.round(img.height * scale));
      canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve({ image: canvas.toDataURL("image/jpeg", 0.62), mime: "image/jpeg" });
    };
    img.onerror = () => resolve({ image: dataUrl, mime: sourceMime });
    img.src = dataUrl;
  });
}

function flashInvalid(el) {
  if (!el) return;
  el.scrollIntoView({ block: "center", behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  el.classList.add("invalid-flash");
  setTimeout(() => el.classList.remove("invalid-flash"), 1600);
}

function prefillFromScan(fields) {
  let found = 0;
  const unmatched = [];
  if (fields.name) { els.studentName.value = String(fields.name); found++; }
  if (fields.guardian) { els.guardianName.value = String(fields.guardian); found++; }
  if (fields.college) {
    const college = String(fields.college).trim();
    if (college) {
      if (!collegesList().includes(college)) {
        const opt = document.createElement("option");
        opt.value = college;
        opt.textContent = college;
        els.studentCollege.appendChild(opt);
      }
      els.studentCollege.value = college;
      found++;
    }
  }
  const phone = String(fields.whatsapp || "").replace(/\D/g, "");
  if (phone) {
    els.whatsappNumber.value = phone;
    els.studentPhone.value = phone;
    found++;
  }
  if (fields.address) { els.studentAddress.value = String(fields.address); found++; }
  if (fields.year === "1st year" || fields.year === "2nd year") { els.studentYear.value = fields.year; found++; }
  const group = String(fields.group || "").trim();
  if (group) {
    if (!groupsList().includes(group)) {
      const opt = document.createElement("option");
      opt.value = group;
      opt.textContent = group;
      els.studentGroup.appendChild(opt);
    }
    els.studentGroup.value = group;
    found++;
  }
  const rows = [...els.studentCoursesBox.querySelectorAll(".course-pick")];
  for (const row of rows) {
    row.querySelector("input[type='checkbox']").checked = false;
    row.querySelector("input[type='number']").disabled = true;
    row.classList.remove("picked");
  }
  for (const c of Array.isArray(fields.courses) ? fields.courses : []) {
    const row = rows.find((rowEl) => {
      return rowEl.querySelector("input[type='checkbox']").value === c.courseId;
    });
    if (row) {
      const box = row.querySelector("input[type='checkbox']");
      const feeInput = row.querySelector("input[type='number']");
      const course = state.courses.find((course) => course.id === c.courseId);
      box.checked = true;
      feeInput.disabled = false;
      feeInput.value = course ? Number(course.fee || 0) : 0;
      row.classList.add("picked");
      found++;
    } else if (!c.courseId && c.label) {
      unmatched.push(c.label);
    }
  }
  const firstPicked = rows.find((row) => row.querySelector("input[type='checkbox']").checked);
  if (firstPicked) {
    const pickedCourse = state.courses.find((c) => c.id === firstPicked.querySelector("input[type='checkbox']").value);
    if (pickedCourse?.type === "package") switchCoursePickerTab("package");
  }
  if (editingStudentId) {
    const current = state.students.find((s) => s.id === editingStudentId);
    els.studentDetailTitle.textContent = current ? current.name : "Edit student";
  } else {
    els.studentDetailTitle.textContent = "New student";
  }
  return { found, unmatched };
}

function setScanStatus(message, kind) {
  els.scanStatus.hidden = !message;
  els.scanStatus.textContent = message || "";
  els.scanStatus.classList.toggle("working", kind === "working");
  els.scanStatus.classList.toggle("ok", kind === "ok");
  els.scanStatus.classList.toggle("fail", kind === "fail");
}

els.scanFileInput.addEventListener("change", async () => {
  const file = els.scanFileInput.files[0];
  if (!file) return;
  if (!file.type.startsWith("image/")) { setScanStatus(t("msgScanImage"), "fail"); return; }
  els.scanBtn.disabled = true;
  setScanStatus(t("msgScanning"), "working");
  try {
    const { image, mime } = await downscaleImage(file);
    const { data, error } = await sb.functions.invoke("scan-form", {
      body: {
        image,
        mime,
        courses: state.courses.map((c) => ({ id: c.id, name: c.name })),
      },
    });
    if (error) {
      const real = await edgeErrorMessage(error);
      if (/not found/i.test(real)) {
        setScanStatus(t("msgScanNoFunc"), "fail");
      } else if (real) {
        setScanStatus(real, "fail");
      } else {
        setScanStatus(t("msgScanFail"), "fail");
      }
      console.warn("scan-form error:", error, real);
      return;
    }
    const { found, unmatched } = prefillFromScan(data?.fields || {});
    if (found > 0) {
      setScanStatus(`${toNum(found)} fields filled automatically — review everything before saving.${unmatched.length ? ` Could not match: ${unmatched.join(", ")}` : ""}`, "ok");
    } else {
      setScanStatus("Nothing readable from the photo — fill the form manually.", "fail");
    }
  } catch (err) {
    setScanStatus(err?.message || t("msgScanFail"), "fail");
  } finally {
    els.scanBtn.disabled = false;
    els.scanFileInput.value = "";
  }
});

function collegesList() {
  return state.settings.colleges.length ? state.settings.colleges : ["Ramganj Govt College", "Ramganj Model College", "Alia Madrasha"];
}
function groupsList() {
  return state.settings.groups.length ? state.settings.groups : ["Science", "Commerce", "Arts", "Madrasa"];
}

function renderStudentOptions() {
  const prevCollege = els.studentCollege.value;
  els.studentCollege.innerHTML = collegesList().map((c) => `<option value="${escapeHtml(c)}">${escapeHtml(c)}</option>`).join("");
  if (collegesList().includes(prevCollege)) els.studentCollege.value = prevCollege;
  const prevGroup = els.studentGroup.value;
  els.studentGroup.innerHTML = groupsList().map((g) => `<option value="${escapeHtml(g)}">${escapeHtml(g)}</option>`).join("");
  if (groupsList().includes(prevGroup)) els.studentGroup.value = prevGroup;

  const prevBatch = els.studentBatch.value;
  els.studentBatch.innerHTML = [
    `<option value="">${t("noBatch")}</option>`,
    ...state.batches.map((b) => `<option value="${b.id}">${escapeHtml(b.name)}</option>`),
  ].join("");
  if (state.batches.some((b) => b.id === prevBatch)) els.studentBatch.value = prevBatch;

  els.admissionFeeNote.textContent = formatMoney(state.settings.admissionFee);
  if (!editingStudentId && els.admissionPaid.value === "") {
    els.admissionPaid.value = state.settings.admissionFee;
  }
}

function switchCoursePickerTab(tab) {
  coursePickerTab = tab === "package" ? "package" : "subject";
  document.querySelectorAll("[data-picker-tab]").forEach((b) => b.classList.toggle("active", b.dataset.pickerTab === coursePickerTab));
  els.studentCoursesBox.querySelectorAll(".course-pick-group").forEach((group) => {
    group.hidden = group.dataset.groupType !== coursePickerTab;
  });
}

function renderStudentCourseBox() {
  const target = editingStudentId || "new";
  const student = editingStudentId ? state.students.find((s) => s.id === editingStudentId) : null;
  const enrolled = student ? student.enrollments : [];
  // Preserve live form state only when the box still belongs to this target;
  // otherwise a fresh render starts from the saved enrollments.
  const sameTarget = els.studentCoursesBox.dataset.for === target;
  const prev = sameTarget
    ? new Map(
        [...els.studentCoursesBox.querySelectorAll(".course-pick")].map((row) => [
          row.querySelector("input[type='checkbox']").value,
          { checked: row.querySelector("input[type='checkbox']").checked, fee: row.querySelector("input[type='number']").value },
        ]),
      )
    : new Map();
  const rowHtml = (c) => {
    const saved = enrolled.find((e) => e.courseId === c.id);
    const prevRow = prev.get(c.id);
    const checked = prevRow ? prevRow.checked : !!saved;
    const fee = prevRow ? prevRow.fee : (saved ? saved.fee : (c.fee ?? 0));
    return `
          <div class="course-pick${checked ? " picked" : ""}">
            <label class="check-line">
              <input type="checkbox" value="${c.id}" ${checked ? "checked" : ""} /> ${escapeHtml(c.name)}
            </label>
            <input type="number" min="0" step="100" value="${Number(fee || 0)}" ${checked ? "" : "disabled"} aria-label="${tr("cMonthlyFee")}" />
          </div>`;
  };
  const groupHtml = (type, title) => {
    const rows = state.courses.filter((c) => c.type === type);
    return `<div class="course-pick-group" data-group-type="${type}"${type === coursePickerTab ? "" : " hidden"}><h4>${title} · ${toNum(rows.length)}</h4><div class="course-pick-box course-pick-scroll">${rows.length ? rows.map(rowHtml).join("") : `<span class="muted-note">${t("noCourse")}</span>`}</div></div>`;
  };
  els.studentCoursesBox.dataset.for = target;
  els.studentCoursesBox.innerHTML = state.courses.length
    ? `${groupHtml("subject", "Courses")}${groupHtml("package", "Packages")}`
    : `<span class="muted-note">${t("noCourse")}</span>`;
  els.studentCoursesBox.querySelectorAll(".course-pick").forEach((row) => {
    const box = row.querySelector("input[type='checkbox']");
    const feeInput = row.querySelector("input[type='number']");
    box.addEventListener("change", () => {
      row.classList.toggle("picked", box.checked);
      feeInput.disabled = !box.checked;
      if (box.checked && feeInput.value === "") {
        const course = state.courses.find((c) => c.id === box.value);
        feeInput.value = course ? Number(course.fee || 0) : 0;
      }
    });
  });
}

document.querySelectorAll("[data-picker-tab]").forEach((button) =>
  button.addEventListener("click", () => switchCoursePickerTab(button.dataset.pickerTab)));

function studentTotalDue(studentId) {
  return state.invoices
    .filter((i) => i.studentId === studentId)
    .reduce((s, i) => s + Math.max(0, i.agreedFee - i.paid - (i.discount || 0)), 0);
}

els.studentForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!requireEdit("students")) return;
  const name = els.studentName.value.trim();
  const phone = els.studentPhone.value.trim();
  const missing = [];
  if (!name) { missing.push("Name"); flashInvalid(els.studentName); }
  if (!phone) { missing.push("Mobile number"); flashInvalid(els.studentPhone); }
  if (!els.studentCollege.value) { missing.push("College"); flashInvalid(els.studentCollege); }
  if (!els.studentGroup.value) { missing.push("Group"); flashInvalid(els.studentGroup); }
  const enrollments = [];
  let feeInvalid = false;
  for (const row of els.studentCoursesBox.querySelectorAll(".course-pick")) {
    const box = row.querySelector("input[type='checkbox']");
    if (!box.checked) continue;
    const fee = Number(row.querySelector("input[type='number']").value === "" ? 0 : row.querySelector("input[type='number']").value);
    if (Number.isNaN(fee) || fee < 0) { feeInvalid = true; flashInvalid(row.querySelector("input[type='number']")); continue; }
    enrollments.push({ course_id: box.value, fee });
  }
  if (!enrollments.length) { missing.push("Course/Package"); flashInvalid(els.coursePickSection); }
  if (feeInvalid) { toast(t("msgFeeNeg")); return; }
  if (missing.length) { toast(`Fill required fields: ${missing.join(", ")}`); return; }
  const admissionPaid = state.settings.admissionFee;

  const pStudent = {
    id: editingStudentId || "",
    name, phone,
    gender: els.studentGender.value,
    birthday: els.studentBirthday.value || null,
    admission_date: els.studentAdmissionDate.value || today,
    status: editingStudentId ? els.studentStatus.value : "active",
    guardian: els.guardianName.value.trim(),
    guardian_phone: els.guardianPhone.value.trim(),
    whatsapp: els.whatsappNumber.value.trim(),
    address: els.studentAddress.value.trim(),
    college: els.studentCollege.value,
    year_level: els.studentYear.value,
    group_name: els.studentGroup.value,
    batch_id: els.studentBatch.value,
    admission_paid: admissionPaid,
  };

  const submitBtn = els.studentSubmitBtn;
  submitBtn.disabled = true;
  submitBtn.dataset.originalLabel = submitBtn.textContent;
  submitBtn.textContent = "Saving…";
  try {
    const { error } = await sb.rpc("save_student_with_admission", { p_student: pStudent, p_enrollments: enrollments });
    if (error) throw error;
    toast(editingStudentId ? t("tStudentEdit") : t("tStudentAdd"));
    logActivity("Save student", name);
  } catch (err) {
    fail(err);
    return;
  } finally {
    submitBtn.disabled = false;
    if (submitBtn.dataset.originalLabel) {
      submitBtn.textContent = submitBtn.dataset.originalLabel;
      delete submitBtn.dataset.originalLabel;
    }
  }
  resetStudentForm();
  history.back();
  await db.loadStudents();
  await db.loadFinance();
  renderAll();
});

els.studentCancelBtn.addEventListener("click", () => {
  resetStudentForm();
  history.back();
});
els.studentBackBtn.addEventListener("click", () => history.back());
function openNewStudentForm() {
  if (!requireEdit("students")) return;
  const shouldPush = els.studentDetailPage.hidden;
  resetStudentForm();
  els.studentDetailPage.hidden = false;
  els.studentDetailTitle.textContent = "New student";
  els.studentForm.hidden = false;
  if (shouldPush) pushDetailState({ ccm: "student-detail", view: currentRoute, title: "New student" });
  els.studentName.focus();
}
els.showStudentFormBtn.addEventListener("click", openNewStudentForm);

document.querySelectorAll("[data-student-status]").forEach((button) => {
  button.addEventListener("click", () => {
    studentStatusFilter = button.dataset.studentStatus;
    document.querySelectorAll("[data-student-status]").forEach((item) => {
      const active = item === button;
      item.classList.toggle("active", active);
      item.setAttribute("aria-pressed", String(active));
    });
    renderStudents();
  });
});

function studentMatches(s, query) {
  if (!query) return true;
  const hay = [s.name, s.studentNumber, s.phone, s.guardianPhone, s.whatsapp, s.college].join(" ").toLowerCase();
  return query.split(/\s+/).filter(Boolean).every((part) => hay.includes(part));
}

const SVG_ICONS = {
  chat: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 11.5a8.5 8.5 0 0 1-12.4 7.5L3 21l2-5.4A8.5 8.5 0 1 1 21 11.5z"/></svg>`,
  call: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.7a2 2 0 0 1-.5 2.1L8 9.7a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.5 2.7.6a2 2 0 0 1 1.9 2z"/></svg>`,
  family: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
  edit: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>`,
  trash: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>`,
};

function renderStudentSubjectFilter() {
  const prev = pendingSubjectFilter || els.studentSubjectFilter.value || "all";
  const withCounts = (type) => state.courses
    .filter((c) => c.type === type)
    .map((c) => ({ course: c, count: courseEnrollmentCount(c.id) }))
    .sort((a, b) => b.count - a.count || a.course.name.localeCompare(b.course.name));
  const subjects = withCounts("subject");
  const packages = withCounts("package");
  const opt = ({ course, count }) => `<option value="${course.id}">${escapeHtml(course.name)} (${toNum(count)})</option>`;
  els.studentSubjectFilter.innerHTML = [
    `<option value="all">All subjects &amp; packages</option>`,
    subjects.length ? `<optgroup label="Subjects">${subjects.map(opt).join("")}</optgroup>` : "",
    packages.length ? `<optgroup label="Packages">${packages.map(opt).join("")}</optgroup>` : "",
  ].join("");
  els.studentSubjectFilter.value = state.courses.some((c) => c.id === prev) ? prev : "all";
  pendingSubjectFilter = null;
  return els.studentSubjectFilter.value;
}

function renderStudents() {
  const editable = canEditTab("students");
  const query = els.studentSearch.value.trim().toLowerCase();
  const college = els.studentCollegeFilter.value || "all";
  const year = els.studentYearFilter.value || "all";
  const subjectFilter = renderStudentSubjectFilter();
  const monthPrefix = today.slice(0, 7);
  els.studentTotalCount.textContent = toNum(state.students.length);
  els.studentActiveCount.textContent = toNum(state.students.filter((s) => s.status === "active").length);
  els.studentNewCount.textContent = toNum(state.students.filter((s) => (s.admissionDate || "").startsWith(monthPrefix)).length);
  els.showStudentFormBtn.hidden = !editable || !els.studentForm.hidden;
  els.studentExtraFilters.hidden = true;

  const colleges = [...new Set(state.students.map((s) => s.college).filter(Boolean))].sort();
  const prevCollege = els.studentCollegeFilter.value || "all";
  els.studentCollegeFilter.innerHTML = [`<option value="all">All colleges</option>`, ...colleges.map((c) => `<option value="${escapeHtml(c)}">${escapeHtml(c)}</option>`)].join("");
  els.studentCollegeFilter.value = colleges.includes(prevCollege) ? prevCollege : "all";
  const prevYear = els.studentYearFilter.value || "all";
  els.studentYearFilter.innerHTML = [`<option value="all">All years</option>`, `<option value="1st year">1st year</option>`, `<option value="2nd year">2nd year</option>`].join("");
  els.studentYearFilter.value = ["all", "1st year", "2nd year"].includes(prevYear) ? prevYear : "all";

  const students = state.students.filter((s) => {
    if (s.status !== studentStatusFilter) return false;
    if (college !== "all" && s.college !== college) return false;
    if (year !== "all" && s.year !== year) return false;
    if (subjectFilter !== "all" && !studentInCourse(s, subjectFilter)) return false;
    return studentMatches(s, query);
  });
  els.studentCards.innerHTML = students.length
    ? students.map((s) => {
        const waNumber = (s.whatsapp || "").replace(/\D/g, "");
        return `
      <article class="student-card">
        <div class="student-card-main">
          <div class="student-avatar" aria-hidden="true">${escapeHtml(s.name.trim().charAt(0).toUpperCase() || "S")}</div>
          <div class="student-card-copy">
            <strong>${escapeHtml(s.name)}</strong>
            <span><span translate="no">${escapeHtml(s.studentNumber || "")}</span> · ${escapeHtml(yearLabel(s.year))}</span>
            <span class="admitted-line">Admitted ${escapeHtml(s.admissionDate || "—")}</span>
            ${studentCourseNames(s).length ? `<span class="student-card-courses">${escapeHtml(studentCourseNames(s).join(" · "))}</span>` : ""}
          </div>
          <div class="student-card-side">
            <span class="badge ${s.status === "active" ? "paid" : "due"}">${s.status === "active" ? "Active" : "Inactive"}</span>
            ${editable ? `<div class="student-card-tools">
              <button class="icon-action edit-action" type="button" data-edit-student="${s.id}" aria-label="Edit ${escapeHtml(s.name)}">${SVG_ICONS.edit}</button>
              <button class="icon-action delete-action" type="button" data-delete-student="${s.id}" aria-label="Delete ${escapeHtml(s.name)}">${SVG_ICONS.trash}</button>
            </div>` : ""}
          </div>
        </div>
        <div class="student-card-actions">
          ${s.whatsapp ? `<a class="contact-link chat" href="https://wa.me/88${escapeHtml(waNumber)}" target="_blank" rel="noopener" aria-label="WhatsApp ${escapeHtml(s.name)}">${SVG_ICONS.chat}</a>` : ""}
          ${s.phone ? `<a class="contact-link call" href="tel:${escapeHtml(s.phone)}" aria-label="Call ${escapeHtml(s.name)}">${SVG_ICONS.call}</a>` : ""}
          ${s.guardianPhone ? `<a class="contact-link guardian" href="tel:${escapeHtml(s.guardianPhone)}" aria-label="Call guardian of ${escapeHtml(s.name)}">${SVG_ICONS.family}</a>` : ""}
        </div>
      </article>`;
      }).join("")
    : emptyState(`No ${studentStatusFilter} students match this search.`);

  document.querySelectorAll("[data-edit-student]").forEach((button) => button.addEventListener("click", () => startEditStudent(button.dataset.editStudent)));
  document.querySelectorAll("[data-delete-student]").forEach((button) => button.addEventListener("click", async () => {
    if (!requireEdit("students")) return;
    const student = state.students.find((item) => item.id === button.dataset.deleteStudent);
    if (!student || !confirmDelete(`Delete ${student.name}?`)) return;
    try {
      const { error } = await sb.rpc("soft_delete_student", { p_student: student.id });
      if (error) throw error;
    } catch (err) { fail(err); return; }
    toast("Student moved to trash — kept for 30 days.");
    logActivity("Delete student", student.name);
    await db.loadStudents();
    await db.loadFinance();
    renderAll();
  }));
}

function startEditStudent(id) {
  if (!requireEdit("students")) return;
  const student = state.students.find((item) => item.id === id);
  if (!student) return;
  editingStudentId = id;
  const shouldPush = els.studentDetailPage.hidden;
  els.studentDetailPage.hidden = false;
  els.studentDetailTitle.textContent = student.name;
  els.studentForm.hidden = false;
  if (shouldPush) pushDetailState({ ccm: "student-detail", view: currentRoute, title: student.name });
  els.studentFormTitle.textContent = "Edit student";
  els.studentSubmitBtn.textContent = "Save changes";
  els.studentCancelBtn.hidden = false;
  els.studentStatusWrap.hidden = false;
  els.studentIdDisplay.hidden = false;
  els.studentIdDisplay.textContent = `Student ID: ${student.studentNumber}`;
  els.studentName.value = student.name || "";
  els.studentGender.value = student.gender || "";
  els.studentBirthday.value = student.birthday || "";
  els.studentAdmissionDate.value = student.admissionDate || "";
  els.studentStatus.value = student.status || "active";
  els.studentPhone.value = student.phone || "";
  els.whatsappNumber.value = student.whatsapp || "";
  els.guardianName.value = student.guardian || "";
  els.guardianPhone.value = student.guardianPhone || "";
  els.studentAddress.value = student.address || "";
  renderStudentOptions();
  els.studentCollege.value = student.college || "";
  els.studentYear.value = student.year || "1st year";
  els.studentGroup.value = student.group || "";
  els.studentBatch.value = student.batchId || "";
  els.admissionPaid.value = state.settings.admissionFee;
  renderStudentCourseBox();
  els.studentName.focus();
}

function resetStudentForm() {
  editingStudentId = null;
  coursePickerTab = "subject";
  els.studentForm.reset();
  els.studentForm.hidden = true;
  els.studentDetailPage.hidden = true;
  els.studentDetailTitle.textContent = "Student";
  els.studentFormTitle.textContent = "New student";
  els.studentSubmitBtn.textContent = "Add student";
  els.studentCancelBtn.hidden = true;
  els.studentStatusWrap.hidden = true;
  els.studentIdDisplay.hidden = true;
  els.studentAdmissionDate.value = today;
  renderStudentOptions();
  renderStudentCourseBox();
  switchCoursePickerTab("subject");
}

els.studentSearch.addEventListener("input", renderStudents);
els.studentCollegeFilter.addEventListener("change", renderStudents);
els.studentYearFilter.addEventListener("change", renderStudents);
els.studentSubjectFilter.addEventListener("change", renderStudents);

/* ================= courses ================= */

els.courseForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!requireEdit("courses")) return;
  const name = els.courseName.value.trim();
  if (!name) { toast(t("msgCourseReq")); els.courseName.focus(); return; }
  const fee = Number(els.courseFee.value === "" ? 0 : els.courseFee.value);
  if (Number.isNaN(fee) || fee < 0) { toast(t("msgCourseFeeNeg")); return; }
  const type = els.courseType.value;
  const row = {
    name, type, fee,
    duration: els.courseDuration.value.trim(),
    included_subject_ids: type === "package" ? selectedCourseSubjects() : [],
  };
  try {
    if (editingCourseId) {
      const { error } = await sb.from("courses").update(row).eq("id", editingCourseId);
      if (error) throw error;
      toast(t("tCourseEdit"));
    } else {
      const { error } = await sb.from("courses").insert({ id: uuid(), ...row });
      if (error) throw error;
      toast(t("tCourseAdd"));
    }
    logActivity("Save course", name);
  } catch (err) {
    fail(err);
    return;
  }
  resetCourseForm();
  await db.loadCore();
  renderAll();
});

els.courseCancelBtn.addEventListener("click", resetCourseForm);
els.courseFilter.addEventListener("change", renderCourses);

function resetCourseForm() {
  editingCourseId = null;
  els.courseForm.reset();
  els.courseFormTitle.textContent = t("newCourse");
  els.courseSubmitBtn.textContent = t("addCourseBtn");
  els.courseCancelBtn.hidden = true;
  renderCourseSubjectsBox([]);
}

function startEditCourse(id) {
  if (!requireEdit("courses")) return;
  const course = state.courses.find((item) => item.id === id);
  if (!course) return;
  editingCourseId = id;
  els.courseFormTitle.textContent = t("editCourse");
  els.courseSubmitBtn.textContent = t("save");
  els.courseCancelBtn.hidden = false;
  els.courseName.value = course.name || "";
  els.courseType.value = course.type || "subject";
  els.courseFee.value = course.fee ?? "";
  els.courseDuration.value = course.duration || "";
  renderCourseSubjectsBox(includedSubjectIds(course));
  switchView("courses", viewTitle("courses"));
  els.courseName.focus();
}

function selectedCourseSubjects() { return [...els.courseSubjectsBox.querySelectorAll("input:checked")].map((c) => c.value); }

// Packages list the subjects they cover so their students join those subject
// classes as well as the package itself.
function renderCourseSubjectsBox(selected = []) {
  const subjects = state.courses.filter((c) => c.type === "subject");
  els.courseSubjectsBox.innerHTML = subjects.length
    ? subjects.map((s) => `
        <label class="check-line">
          <input type="checkbox" value="${s.id}" ${selected.includes(s.id) ? "checked" : ""} /> ${escapeHtml(s.name)}
        </label>`).join("")
    : `<span class="muted-note">Add subject courses first, then pick them here.</span>`;
  els.courseSubjectsWrap.hidden = els.courseType.value !== "package";
}

els.courseType.addEventListener("change", () => renderCourseSubjectsBox(selectedCourseSubjects()));

function courseCard(course, count, extraClass) {
  const editable = canEditTab("courses");
  const included = course.type === "package"
    ? includedSubjectIds(course).map((id) => getCourseName(id)).filter((name) => name && name !== t("dash"))
    : [];
  return `
    <article class="batch-card${extraClass ? " " + extraClass : ""}">
      <strong>${escapeHtml(course.name)}</strong>
      <span>${courseTypeLabel(course.type)} · ${formatMoney(course.fee || 0)}</span>
      <p>${escapeHtml(course.duration || t("noDesc"))}</p>
      ${included.length ? `<p class="course-includes">Includes: ${escapeHtml(included.join(" · "))}</p>` : ""}
      <span class="badge">${toNum(count)} ${t("enrolledSuffix")}</span>
      ${editable ? `<div class="inline-tools">
        <button class="small-btn" type="button" data-edit-course="${course.id}">${t("edit")}</button>
        <button class="small-btn" type="button" data-delete-course="${course.id}">${t("del")}</button>
      </div>` : ""}
    </article>`;
}

function renderCourses() {
  const filter = els.courseFilter.value;
  const candidates = state.courses
    .filter((c) => filter === "all" || c.type === filter)
    .map((course) => ({ course, count: courseEnrollmentCount(course.id) }))
    .sort((a, b) => b.count - a.count || a.course.name.localeCompare(b.course.name));
  const top = candidates.slice(0, 3);
  const rest = candidates.slice(3);
  els.courseCards.innerHTML = candidates.length
    ? `<div class="course-top-grid">${top.map(({ course, count }) => courseCard(course, count, "top-course")).join("")}</div>` +
      (rest.length ? `<div class="course-scroll">${rest.map(({ course, count }) => courseCard(course)).join("")}</div>` : "")
    : emptyState(t("emptyCourse"));

  document.querySelectorAll("[data-edit-course]").forEach((b) =>
    b.addEventListener("click", () => startEditCourse(b.dataset.editCourse)));
  document.querySelectorAll("[data-delete-course]").forEach((b) =>
    b.addEventListener("click", async () => {
      if (!requireEdit("courses")) return;
      const course = state.courses.find((item) => item.id === b.dataset.deleteCourse);
      if (!course) return;
      if (!confirmDelete(`Delete "${course.name}"? Its enrollments, schedules, and fee invoices are removed too. This cannot be undone.`)) return;
      try {
        // Remove dependents first: every FK to courses is restrictive, so the
        // course row itself can only go after its children are cleared.
        await sb.from("enrollments").delete().eq("course_id", course.id);
        await sb.from("student_fee_invoices").delete().eq("course_id", course.id);
        await sb.from("course_offerings").delete().eq("course_id", course.id);
        const { error } = await sb.from("courses").delete().eq("id", course.id);
        if (error) throw error;
      } catch (err) {
        fail(err);
        return;
      }
      toast(t("tCourseDel"));
      logActivity("Delete course", course.name);
      await db.loadCore();
      await db.loadStudents();
      await db.loadFinance();
      renderAll();
    }));
}

/* ================= batches ================= */

els.batchForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!isManager()) { toast(t("msgAdminOnly")); return; }
  const name = els.batchName.value.trim();
  if (!name) { toast(t("msgBatchReq")); els.batchName.focus(); return; }
  try {
    const { error } = await sb.from("batches").insert({ id: uuid(), name });
    if (error) throw error;
  } catch (err) {
    fail(err);
    return;
  }
  els.batchName.value = "";
  toast(t("tBatchAdd"));
  await db.loadCore();
  renderAll();
});

function renderBatches() {
  if (!canView("courses")) return;
  const editable = isManager();
  els.batchChips.innerHTML = state.batches.length
    ? state.batches.map((b) => {
        const count = state.students.filter((s) => s.batchId === b.id).length;
        return `
          <span class="chip">
            ${escapeHtml(b.name)} <em>${toNum(count)}</em>
            ${editable ? `<button type="button" data-delete-batch="${b.id}" aria-label="${t("del")}">×</button>` : ""}
          </span>`;
      }).join("")
    : `<span class="muted-note">${t("emptyBatch")}</span>`;
  document.querySelectorAll("[data-delete-batch]").forEach((btn) =>
    btn.addEventListener("click", async () => {
      const batch = state.batches.find((b) => b.id === btn.dataset.deleteBatch);
      if (!batch) return;
      if (!confirmDelete(`"${batch.name}" ${t("confirmDeleteBatch")}`)) return;
      try {
        await sb.from("students").update({ batch_id: null }).eq("batch_id", batch.id);
        const { error } = await sb.from("batches").delete().eq("id", batch.id);
        if (error) throw error;
      } catch (err) {
        fail(err);
        return;
      }
      toast(t("tBatchDel"));
      await db.loadCore();
      await db.loadStudents();
      renderAll();
    }));
}

/* ================= offerings (schedules) ================= */

function renderOfferingForm() {
  const prevCourse = els.offeringCourse.value;
  els.offeringCourse.innerHTML = state.courses.map((c) => `<option value="${c.id}">${escapeHtml(c.name)}</option>`).join("");
  if (state.courses.some((c) => c.id === prevCourse)) els.offeringCourse.value = prevCourse;

  const teachers = eligibleTeachers();
  const prevTeacher = els.offeringTeacher.value;
  els.offeringTeacher.innerHTML = [
    `<option value="">${t("noTeacherAssigned")}</option>`,
    ...teachers.map((u) => `<option value="${u.id}">${escapeHtml(u.username)} · ${escapeHtml(roleLabel(u.role))}</option>`),
  ].join("");
  if (teachers.some((u) => u.id === prevTeacher)) els.offeringTeacher.value = prevTeacher;

  const prevGroup = els.offeringGroup.value;
  els.offeringGroup.innerHTML = groupsList().map((g) => `<option value="${escapeHtml(g)}">${escapeHtml(g)}</option>`).join("");
  if (groupsList().includes(prevGroup)) els.offeringGroup.value = prevGroup;

  const prevDays = new Set([...els.offeringDaysBox.querySelectorAll("input:checked")].map((c) => c.value));
  els.offeringDaysBox.innerHTML = WEEKDAY_ORDER.map((d) => `
    <label class="check-line">
      <input type="checkbox" value="${d}" ${prevDays.has(String(d)) ? "checked" : ""} /> ${dayLabel(d)}
    </label>`).join("");
}

els.offeringForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!isManager()) { toast(t("msgAdminOnly")); return; }
  const courseId = els.offeringCourse.value;
  if (!courseId) { toast(t("msgCourseReq")); return; }
  const weekdays = [...els.offeringDaysBox.querySelectorAll("input:checked")].map((c) => Number(c.value));
  if (!weekdays.length) { toast(t("msgDaysReq")); return; }
  const row = {
    course_id: courseId,
    year_level: els.offeringYear.value,
    group_name: els.offeringGroup.value,
    teacher_id: els.offeringTeacher.value || null,
    weekdays,
    class_time: els.offeringTime.value || null,
    rate_per_class: Number(els.offeringRate.value === "" ? 0 : els.offeringRate.value),
    active: true,
  };
  if (Number.isNaN(row.rate_per_class) || row.rate_per_class < 0) { toast(t("msgFeeNeg")); return; }
  try {
    if (editingOfferingId) {
      const { error } = await sb.from("course_offerings").update(row).eq("id", editingOfferingId);
      if (error) throw error;
      toast(t("tOfferingEdit"));
    } else {
      const { error } = await sb.from("course_offerings").insert({ id: uuid(), ...row });
      if (error) throw error;
      toast(t("tOfferingAdd"));
    }
    logActivity("Save schedule", `${getCourseName(courseId)} · ${row.year_level}`);
  } catch (err) {
    fail(err);
    return;
  }
  resetOfferingForm();
  await db.loadCore();
  renderAll();
});

els.offeringCancelBtn.addEventListener("click", resetOfferingForm);

function resetOfferingForm() {
  editingOfferingId = null;
  els.offeringForm.reset();
  els.offeringSubmitBtn.textContent = tr("addSchedule");
  els.offeringCancelBtn.hidden = true;
  renderOfferingForm();
}

function renderOfferings() {
  if (!canView("courses")) return;
  const editable = isManager();
  els.offeringsList.innerHTML = state.offerings.length
    ? state.offerings.map((o) => `
        <div class="compact-item">
          <div>
            <strong>${escapeHtml(getCourseName(o.courseId))}</strong>
            <span>${escapeHtml(yearLabel(o.year))} · ${escapeHtml(o.group)} · ${getTeacherName(o.teacherId)} · ${o.weekdays.map(dayLabel).join(", ")}${o.classTime ? " · " + escapeHtml(formatClassTime(o.classTime)) : ""}</span>
          </div>
          <span class="badge">${formatMoney(o.rate)} / class</span>
          ${editable ? `<div class="inline-tools">
            <button class="small-btn" type="button" data-edit-offering="${o.id}">${t("edit")}</button>
            <button class="small-btn" type="button" data-delete-offering="${o.id}">${t("del")}</button>
          </div>` : ""}
        </div>`).join("")
    : emptyState(t("emptyOfferings"));

  document.querySelectorAll("[data-edit-offering]").forEach((b) =>
    b.addEventListener("click", () => {
      const offering = state.offerings.find((o) => o.id === b.dataset.editOffering);
      if (!offering || !isManager()) return;
      editingOfferingId = offering.id;
      renderOfferingForm();
      els.offeringCourse.value = offering.courseId;
      els.offeringYear.value = offering.year;
      els.offeringGroup.value = offering.group;
      els.offeringTeacher.value = offering.teacherId || "";
      els.offeringTime.value = offering.classTime || "";
      els.offeringRate.value = offering.rate;
      els.offeringDaysBox.querySelectorAll("input").forEach((c) => {
        c.checked = offering.weekdays.includes(Number(c.value));
      });
      els.offeringSubmitBtn.textContent = t("save");
      els.offeringCancelBtn.hidden = false;
    }));
  document.querySelectorAll("[data-delete-offering]").forEach((b) =>
    b.addEventListener("click", async () => {
      if (!isManager()) return;
      const offering = state.offerings.find((o) => o.id === b.dataset.deleteOffering);
      if (!offering) return;
      if (!confirmDelete(t("confirmDeleteOffering"))) return;
      try {
        const { error } = await sb.from("course_offerings").delete().eq("id", offering.id);
        if (error) throw error;
      } catch (err) {
        fail(err);
        return;
      }
      toast(t("tOfferingDel"));
      logActivity("Delete schedule", getCourseName(offering.courseId));
      await db.loadCore();
      renderAll();
    }));
}

/* ================= attendance ================= */

els.attendanceDate.addEventListener("change", renderAttendanceClasses);
els.attendanceSubject.addEventListener("change", () => {
  attendanceSubjectId = els.attendanceSubject.value;
  renderAttendanceClasses();
});
document.querySelectorAll("[data-roster-year]").forEach((chip) => {
  chip.addEventListener("click", () => {
    attendanceYear = chip.dataset.rosterYear;
    document.querySelectorAll("[data-roster-year]").forEach((item) => {
      const active = item === chip;
      item.classList.toggle("active", active);
      item.setAttribute("aria-pressed", String(active));
    });
    renderAttendanceClasses();
  });
});

async function loadOfferingCounts() {
  const { data, error } = await sb.rpc("offering_enrollment_counts");
  if (!error && Array.isArray(data)) {
    state.offeringCounts = {};
    for (const row of data) state.offeringCounts[row.offeringId] = Number(row.count || 0);
  }
}

async function renderAttendanceClasses() {
  const date = els.attendanceDate.value || today;
  const dow = new Date(date + "T12:00:00").getDay();
  const mine = myOfferings()
    .filter((o) => o.active && o.weekdays.includes(dow))
    .filter((o) => attendanceYear === "all" || o.year === attendanceYear);
  mine.sort((a, b) => (a.classTime || "99:99").localeCompare(b.classTime || "99:99"));

  await loadOfferingCounts();

  const prev = attendanceSubjectId;
  els.attendanceSubject.innerHTML = mine.length
    ? mine.map((o) => {
        const count = state.offeringCounts[o.id] ?? 0;
        return `<option value="${o.id}">${escapeHtml(getCourseName(o.courseId))} · ${escapeHtml(yearLabel(o.year))}${o.group ? " · " + escapeHtml(o.group) : ""}${o.classTime ? " · " + escapeHtml(formatClassTime(o.classTime)) : ""} (${count})</option>`;
      }).join("")
    : `<option value="">No class scheduled</option>`;
  if (mine.some((o) => o.id === prev)) els.attendanceSubject.value = prev;
  attendanceSubjectId = els.attendanceSubject.value || "";

  els.attendanceHistoryNote.hidden = date === today;

  const chosen = mine.find((o) => o.id === attendanceSubjectId);
  if (!chosen) {
    els.attendanceClasses.innerHTML = emptyState(date === today ? t("emptyClasses") : "Nothing saved for this subject on this date.");
    els.rosterPanel.hidden = true;
    activeSession = { offering: null, sessionId: null, marks: new Map() };
    return;
  }
  els.attendanceClasses.innerHTML = "";
  await openClassRoster(chosen.id, date);
}

async function openClassRoster(offeringId, date) {
  const offering = state.offerings.find((o) => o.id === offeringId);
  if (!offering || !canMarkOffering(offering)) {
    toast(t("msgNoCoursePerm"));
    return;
  }
  try {
    let sessionId = null;
    if (date === today) {
      const { data: created, error: sessErr } = await sb.rpc("get_or_create_class_session", { p_offering: offeringId, p_date: date });
      if (sessErr) throw sessErr;
      sessionId = created;
    } else {
      const { data: found } = await sb.from("class_sessions").select("id").eq("offering_id", offeringId).eq("class_date", date).maybeSingle();
      if (!found) {
        els.rosterPanel.hidden = true;
        els.attendanceClasses.innerHTML = emptyState("Nothing saved for this subject on this date.");
        activeSession = { offering: null, sessionId: null, marks: new Map() };
        return;
      }
      sessionId = found.id;
    }
    const { data: roster, error: rosterErr } = await sb.rpc("teacher_roster", { p_session: sessionId });
    if (rosterErr) throw rosterErr;
    activeSession = { offering: offeringId, sessionId, marks: new Map() };
    (roster || []).forEach((r) => {
      if (r.attendance) activeSession.marks.set(r.id, r.attendance);
    });
    const sess = await sb.from("class_sessions").select("status").eq("id", sessionId).maybeSingle();
    if (sess?.data) {
      els.rosterHeldBadge.textContent = sess.data.status === "held" ? t("held") : "";
      els.rosterHeldBadge.className = "badge " + (sess.data.status === "held" ? "paid" : "");
    }
    els.rosterTitle.textContent = `${getCourseName(offering.courseId)} · ${yearLabel(offering.year)} · ${offering.group}`;
    els.rosterPanel.hidden = false;
    renderRoster(roster || []);
  } catch (err) {
    fail(err);
  }
}

function renderRoster(roster) {
  const offering = state.offerings.find((o) => o.id === activeSession.offering);
  const date = els.attendanceDate.value || today;
  const editable = isManager() || (canMarkOffering(offering) && date === today);
  els.attendanceActions.style.display = editable ? "" : "none";
  els.rosterPanel.dataset.roster = JSON.stringify(roster);
  els.attendanceRoster.innerHTML = roster.length
    ? roster.map((r) => {
        const status = activeSession.marks.get(r.id) || "";
        const calls = [
          r.phone ? `<a class="contact-link call" href="tel:${escapeHtml(r.phone)}" aria-label="Call ${escapeHtml(r.name)}">${SVG_ICONS.call}</a>` : "",
          r.guardian_phone ? `<a class="contact-link guardian" href="tel:${escapeHtml(r.guardian_phone)}" aria-label="Call guardian of ${escapeHtml(r.name)}">${SVG_ICONS.family}</a>` : "",
        ].filter(Boolean).join("");
        return `
        <div class="attendance-row">
          <div class="attendance-copy">
            <strong>${escapeHtml(r.name)}</strong>
            <span><span translate="no">${escapeHtml(r.studentNumber || "")}</span> · ${escapeHtml(yearLabel(r.year))} · ${escapeHtml(r.group || t("dash"))}</span>
          </div>
          ${calls ? `<div class="attendance-calls">${calls}</div>` : ""}
          ${editable ? `<div class="inline-tools">
            <button class="small-btn ${status === "present" ? "present" : ""}" type="button" data-mark="${r.id}" data-status="present">${t("present")}</button>
            <button class="small-btn ${status === "absent" ? "absent" : ""}" type="button" data-mark="${r.id}" data-status="absent">${t("absent")}</button>
          </div>` : `<span class="badge ${status === "present" ? "paid" : status === "absent" ? "due" : ""}">${status === "present" ? t("present") : status === "absent" ? t("absent") : t("notMarked")}</span>`}
        </div>`;
      }).join("")
    : emptyState(t("emptyRoster"));

  document.querySelectorAll("[data-mark]").forEach((b) =>
    b.addEventListener("click", () => {
      activeSession.marks.set(b.dataset.mark, b.dataset.status);
      renderRoster(roster);
    }));
}

els.markAllPresentBtn.addEventListener("click", () => {
  const roster = JSON.parse(els.rosterPanel.dataset.roster || "[]");
  roster.forEach((r) => activeSession.marks.set(r.id, "present"));
  renderRoster(roster);
});

els.saveAttendanceBtn.addEventListener("click", async () => {
  if (!activeSession.sessionId) { toast(t("msgPickClass")); return; }
  const roster = JSON.parse(els.rosterPanel.dataset.roster || "[]");
  const records = roster
    .filter((r) => activeSession.marks.get(r.id))
    .map((r) => ({ student_id: r.id, status: activeSession.marks.get(r.id) }));
  if (!records.length) { toast(t("msgNoChanges")); return; }
  const offeringId = activeSession.offering;
  const date = els.attendanceDate.value || today;
  try {
    const { error } = await sb.rpc("mark_class_attendance", {
      p_session: activeSession.sessionId,
      p_records: records,
      p_held: true,
    });
    if (error) throw error;
  } catch (err) {
    fail(err);
    return;
  }
  toast(t("tAttendanceSaved"));
  logActivity("Attendance", `${getCourseName(state.offerings.find((o) => o.id === offeringId)?.courseId)} — ${records.length}`);
  await renderAttendanceClasses();
  await openClassRoster(offeringId, date);
});

/* ================= fees ================= */

els.feeMonth.addEventListener("change", refreshFees);

async function refreshFees() {
  if (!canView("fees")) return;
  const month = els.feeMonth.value || thisMonth;
  try {
    const { error } = await sb.rpc("ensure_month_invoices", { p_month: month + "-01" });
    if (error) throw error;
  } catch (err) {
    fail(err);
    return;
  }
  await db.loadFinance();
  renderAll();
}

function feeMatches(s, query) {
  if (!query) return true;
  const hay = [s.name, s.studentNumber, s.phone, s.college].join(" ").toLowerCase();
  return query.split(/\s+/).filter(Boolean).every((part) => hay.includes(part));
}

function invoicesFor(studentId, month) {
  return state.invoices.filter((invoice) => invoice.studentId === studentId && invoice.month === month);
}

function invoiceDue(invoice) {
  return Math.max(0, invoice.agreedFee - invoice.paid - (invoice.discount || 0));
}

function monthDue(studentId, month) {
  return invoicesFor(studentId, month).reduce((sum, invoice) => sum + invoiceDue(invoice), 0);
}

function renderFees() {
  if (!canView("fees")) return;
  const month = els.feeMonth.value || thisMonth;
  const monthInvoices = state.invoices.filter((invoice) => invoice.month === month);
  const monthPaid = monthInvoices.reduce((sum, invoice) => sum + invoice.paid, 0);
  const allPaid = state.feePayments.reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
  const todayPaid = state.feePayments.filter((payment) => payment.payment_date === today).reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
  els.feeCollectTotal.textContent = formatMoney(allPaid);
  els.feeTodayCollect.textContent = formatMoney(todayPaid);
  els.feeMonthCollect.textContent = formatMoney(monthPaid);
  const filter = els.feeFilter.value;
  const query = els.feeSearch.value.trim().toLowerCase();
  const students = state.students.filter((student) => {
    const due = monthDue(student.id, month);
    if (filter === "due" && due <= 0) return false;
    if (filter === "paid" && due > 0) return false;
    return student.status === "active" && feeMatches(student, query);
  });
  els.feeRows.innerHTML = students.length
    ? students.map((student) => {
        const due = monthDue(student.id, month);
        const discount = invoicesFor(student.id, month).reduce((sum, invoice) => sum + (invoice.discount || 0), 0);
        const badge = due > 0 ? `Due ${formatMoney(due)}` : discount > 0 ? "Discounted" : "Paid";
        return `<button class="fee-student-card" type="button" data-fee-student="${student.id}">
          <span class="student-avatar" aria-hidden="true">${escapeHtml(student.name.charAt(0).toUpperCase())}</span>
          <span class="fee-student-copy"><strong>${escapeHtml(student.name)}</strong><span translate="no">${escapeHtml(student.studentNumber)}</span><span>${escapeHtml(getBatchName(student.batchId))}</span></span>
          <span class="fee-student-balance"><strong class="badge ${due > 0 ? "due" : "paid"}">${badge}</strong></span>
        </button>`;
      }).join("")
    : emptyState("No active students match this month and search.");
  document.querySelectorAll("[data-fee-student]").forEach((button) => button.addEventListener("click", () => openFeeDetail(button.dataset.feeStudent)));
}

async function openFeeDetail(studentId, push = true) {
  currentFeeStudentId = studentId;
  const student = state.students.find((item) => item.id === studentId);
  if (!student) return;
  const shouldPush = push && els.feeDetailPage.hidden;
  const month = els.feeMonth.value || thisMonth;
  const invoices = invoicesFor(studentId, month);
  const due = monthDue(studentId, month);
  let history = [];
  try {
    const { data, error } = await sb.rpc("student_fee_history", { p_student: studentId, p_month: `${month}-01` });
    if (error) throw error;
    history = data || [];
  } catch (err) { fail(err); }
  const editing = editingReceiptId ? history.find((item) => item.receiptId === editingReceiptId && item.kind !== "legacy") : null;
  const editBase = due + (editing ? Number(editing.paid || 0) + Number(editing.discount || 0) : 0);
  const courses = invoices.map((invoice) => `<div class="fee-course-row"><span>${escapeHtml(getCourseName(invoice.courseId))}</span><span>${formatMoney(invoice.agreedFee)}</span></div>`).join("");
  const historyHtml = history.length ? history.map((item) => {
    const title = item.kind === "legacy" ? "Legacy payment" : Number(item.paid) > 0 ? `Paid ${formatMoney(item.paid)}` : "Discount";
    const disc = Number(item.discount) > 0 ? ` · Disc ${formatMoney(item.discount)}` : "";
    const remaining = item.remaining == null ? "Not available" : formatMoney(item.remaining);
    const tools = item.kind !== "legacy" && isAdmin() ? `
      <div class="receipt-tools">
        <button type="button" class="small-btn" data-edit-receipt="${escapeHtml(item.receiptId)}">Edit</button>
        <button type="button" class="small-btn" data-delete-receipt="${escapeHtml(item.receiptId)}">Delete</button>
      </div>` : "";
    return `<article class="fee-history-item"><div><strong>${title}${disc}</strong><span>Remaining ${remaining} · ${escapeHtml(item.paymentDate || "")} · ${new Date(item.recordedAt).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}</span></div>${tools}<button type="button" class="small-btn" data-print-history="${escapeHtml(item.receiptId)}">Print</button></article>`;
  }).join("") : emptyState("No payment history for this month.");
  const showForm = canEditTab("fees") && (due > 0 || editing);
  const formAmount = editing ? Number(editing.paid || 0) : due;
  const formDate = editing ? (editing.paymentDate || today) : today;
  const formDiscount = editing ? Number(editing.discount || 0) > 0 : false;
  els.feeDetailTitle.textContent = `${student.name} · ${month}`;
  els.feeDetailBody.innerHTML = `
    <div class="fee-detail-student"><div class="student-avatar" aria-hidden="true">${escapeHtml(student.name.charAt(0).toUpperCase())}</div><div><strong>${escapeHtml(student.name)}</strong><span translate="no">${escapeHtml(student.studentNumber)}</span><span>${escapeHtml(getBatchName(student.batchId))} · ${escapeHtml(yearLabel(student.year))}</span><span class="badge ${due > 0 ? "due" : "paid"}">${due > 0 ? `Due ${formatMoney(due)}` : "Fully paid"}</span></div></div>
    <section class="fee-detail-section"><h3>Monthly fees</h3>${courses || emptyState("No invoices for this month.")}<div class="fee-course-total"><strong>Remaining due</strong><strong>${formatMoney(due)}</strong></div></section>
    ${showForm ? `<form id="feeCollectionForm" class="fee-collection-form"><h3>${editing ? "Edit receipt" : "Collect payment"}</h3>${editing ? `<p class="muted-note">Saving replaces this receipt with the new amount and date.</p>` : ""}<div class="fee-amount-row"><label><span>Amount (৳)</span><input id="feePaymentAmount" type="number" min="0" max="${editBase}" step="0.01" value="${formAmount}" required /></label><label class="discount-option"><input id="feeDiscountToggle" type="checkbox" ${formDiscount ? "checked" : ""} /><span>Discount</span></label></div><p id="feeDiscountPreview" class="discount-preview" hidden></p><label><span>Payment date</span><input id="feePaymentDate" type="date" value="${formDate}" required /></label><div class="form-actions"><button id="collectFeeBtn" class="primary-btn" type="submit">${editing ? "Update receipt" : "Collect"}</button>${editing ? `<button type="button" id="cancelEditReceiptBtn" class="secondary-btn">Cancel edit</button>` : ""}</div></form>` : ""}
    <section class="fee-detail-section"><h3>Collection history</h3><div class="fee-history-list">${historyHtml}</div></section>`;
  els.feeDetailPage.hidden = false;
  if (shouldPush) pushDetailState({ ccm: "fee-detail", studentId, view: currentRoute });
  els.feeDetailBody.querySelectorAll("[data-print-history]").forEach((button) => button.addEventListener("click", () => printExistingReceipt(button.dataset.printHistory, student, history)));
  els.feeDetailBody.querySelectorAll("[data-edit-receipt]").forEach((button) => button.addEventListener("click", () => {
    editingReceiptId = button.dataset.editReceipt;
    openFeeDetail(studentId);
  }));
  els.feeDetailBody.querySelectorAll("[data-delete-receipt]").forEach((button) => button.addEventListener("click", () => deleteReceipt(button.dataset.deleteReceipt, student)));
  document.getElementById("cancelEditReceiptBtn")?.addEventListener("click", () => {
    editingReceiptId = null;
    openFeeDetail(studentId);
  });
  document.getElementById("feeCollectionForm")?.addEventListener("submit", (event) => {
    event.preventDefault();
    submitMonthFee(student, month, due, editBase);
  });
  const updateDiscountPreview = () => {
    const amount = Number(document.getElementById("feePaymentAmount").value);
    const checkbox = document.getElementById("feeDiscountToggle");
    const preview = document.getElementById("feeDiscountPreview");
    const discount = Math.max(0, editBase - (Number.isFinite(amount) ? amount : 0));
    preview.hidden = !checkbox.checked;
    preview.textContent = `Discount: ${formatMoney(discount)} · Remaining after discount: ${formatMoney(0)}`;
  };
  document.getElementById("feePaymentAmount")?.addEventListener("input", updateDiscountPreview);
  document.getElementById("feeDiscountToggle")?.addEventListener("change", updateDiscountPreview);
  updateDiscountPreview();
}

async function submitMonthFee(student, month, editBase) {
  if (!requireEdit("fees")) return;
  const amount = Number(document.getElementById("feePaymentAmount").value);
  if (!Number.isFinite(amount) || amount < 0 || amount > editBase) { toast(`Enter an amount between 0 and ${formatMoney(editBase)}.`); return; }
  const applyDiscount = document.getElementById("feeDiscountToggle").checked;
  if (amount === 0 && !applyDiscount) { toast("Enter an amount or choose Discount."); return; }
  if (applyDiscount) {
    pendingDiscount = { student, month, amount, paymentDate: document.getElementById("feePaymentDate").value, waive: editBase - amount, editReceiptId: editingReceiptId };
    els.discountConfirmText.textContent = editingReceiptId
      ? `Update this receipt to ${formatMoney(amount)} and waive the remaining ${formatMoney(editBase - amount)} for ${month}?`
      : `Collect ${formatMoney(amount)} and waive the remaining ${formatMoney(editBase - amount)} for ${month}? The next month's fees will not change.`;
    els.discountConfirmDialog.showModal();
    return;
  }
  await saveMonthFee(student, month, amount, document.getElementById("feePaymentDate").value, false, editingReceiptId);
}

els.confirmDiscountBtn.addEventListener("click", async () => {
  if (!pendingDiscount) return;
  const { student, month, amount, paymentDate, editReceiptId } = pendingDiscount;
  pendingDiscount = null;
  els.discountConfirmDialog.close();
  await saveMonthFee(student, month, amount, paymentDate, true, editReceiptId);
});
els.cancelDiscountBtn.addEventListener("click", () => { pendingDiscount = null; els.discountConfirmDialog.close(); });

async function saveMonthFee(student, month, amount, paymentDate, applyDiscount, editReceiptId) {
  const collectButton = document.getElementById("collectFeeBtn");
  if (collectButton) collectButton.disabled = true;
  try {
    const { data, error } = editReceiptId
      ? await sb.rpc("edit_student_fee_receipt", { p_receipt: editReceiptId, p_amount: amount, p_payment_date: paymentDate, p_apply_discount: applyDiscount })
      : await sb.rpc("collect_student_month_fee", {
          p_student: student.id, p_month: `${month}-01`, p_amount: amount,
          p_payment_date: paymentDate, p_apply_discount: applyDiscount,
        });
    if (error) throw error;
    editingReceiptId = null;
    lastReceipt = { student, month, paid: Number(data?.paid || 0), discount: Number(data?.discount || 0), remaining: Number(data?.remaining || 0), paymentDate, recordedAt: data?.recorded_at || new Date().toISOString() };
  } catch (err) {
    if (collectButton) collectButton.disabled = false;
    fail(err);
    return;
  }
  toast(editReceiptId ? "Receipt updated." : "Payment saved.");
  logActivity(editReceiptId ? "Receipt edit" : "Fee collection", `${student.studentNumber} · ${formatMoney(amount)}${applyDiscount ? " with discount" : ""}`);
  await db.loadFinance();
  renderAll();
  await openFeeDetail(student.id);
  if (amount > 0 || applyDiscount) openReceipt(lastReceipt);
}

async function deleteReceipt(receiptId, student) {
  if (!isAdmin()) { toast(t("msgAdminOnly")); return; }
  if (!confirmDelete("Delete this receipt? The collected amount and discount will be reversed.")) return;
  try {
    const { error } = await sb.rpc("void_student_fee_receipt", { p_receipt: receiptId });
    if (error) throw error;
  } catch (err) { fail(err); return; }
  editingReceiptId = null;
  toast("Receipt deleted.");
  logActivity("Receipt delete", student.studentNumber);
  await db.loadFinance();
  renderAll();
  await openFeeDetail(student.id);
}

function openReceipt(receipt) {
  if (!receipt) return;
  const { student, paid, discount, remaining, paymentDate, recordedAt } = receipt;
  els.receiptPaper.innerHTML = `<header><strong>${escapeHtml(state.settings.coachingName)}</strong></header><hr><p><strong>${escapeHtml(student.name)}</strong><br><span translate="no">${escapeHtml(student.studentNumber)}</span><br>${escapeHtml(yearLabel(student.year))} · ${escapeHtml(getBatchName(student.batchId))}</p><hr><p>${escapeHtml(paymentDate || today)}<br>${new Date(recordedAt).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}</p><hr><dl><dt>Paid</dt><dd>${formatMoney(paid)}</dd><dt>Discount</dt><dd>${formatMoney(discount)}</dd><dt>Remaining</dt><dd>${formatMoney(remaining)}</dd></dl><hr><p class="receipt-thanks">Thank you</p>`;
  if (!els.receiptDialog.open) els.receiptDialog.showModal();
}

function printExistingReceipt(receiptId, student, history) {
  const item = history.find((record) => record.receiptId === receiptId);
  if (!item) return;
  openReceipt({ student, month: String(item.month || "").slice(0, 7), receiptId, paid: Number(item.paid || 0), discount: Number(item.discount || 0), remaining: Number(item.remaining || 0), paymentDate: item.paymentDate || today, recordedAt: item.recordedAt || new Date().toISOString() });
}

els.feeBackBtn.addEventListener("click", () => history.back());
els.closeReceiptBtn.addEventListener("click", () => els.receiptDialog.close());
els.printReceiptBtn.addEventListener("click", () => window.print());
els.feeFilter.addEventListener("change", renderFees);
els.feeSearch.addEventListener("input", renderFees);

/* ================= money / bank / dues ================= */

document.querySelectorAll("[data-entry-type]").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll("[data-entry-type]").forEach((item) => {
      const active = item === button;
      item.classList.toggle("active", active);
      item.setAttribute("aria-pressed", String(active));
    });
    els.moneyType.value = button.dataset.entryType;
  });
});

els.moneyForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!requireEdit("money")) return;
  const amount = Number(els.moneyAmount.value);
  if (!Number.isFinite(amount) || amount <= 0) { toast(t("msgAmtPos")); return; }
  const row = {
    id: uuid(), date: els.moneyDate.value || today, type: els.moneyType.value === "expense" ? "expense" : "income",
    category: els.moneyCategory.value.trim() || t("general"), amount,
    note: "", by_username: currentUser ? currentUser.username : "",
  };
  try {
    const { error } = await sb.from("money_entries").insert(row);
    if (error) throw error;
  } catch (err) {
    fail(err);
    return;
  }
  els.moneyForm.reset();
  els.moneyDate.value = today;
  els.moneyType.value = "income";
  document.querySelectorAll("[data-entry-type]").forEach((item) => item.classList.toggle("active", item.dataset.entryType === "income"));
  toast(t("tEntry"));
  logActivity(row.type === "income" ? "Income entry" : "Expense entry", `${row.category} — ${formatMoney(amount)}`);
  await db.loadFinance();
  renderAll();
});

function renderMoney() {
  if (!canView("money")) return;
  const todayEntries = state.money.filter((m) => m.date === today);
  const todayIncome = todayEntries.filter((m) => m.type === "income").reduce((s, m) => s + m.amount, 0);
  const todayCost = todayEntries.filter((m) => m.type === "expense").reduce((s, m) => s + m.amount, 0);
  els.todayIncomeMoney.textContent = formatMoney(todayIncome);
  els.todayCostMoney.textContent = formatMoney(todayCost);
  els.todayNetMoney.textContent = formatMoney(todayIncome - todayCost);
  els.moneyBalanceToday.textContent = formatMoney(bankBalance());
}

function bankBalance() {
  return state.bank.opening
    + state.bankTx.filter((x) => x.direction === "deposit").reduce((s, x) => s + x.amount, 0)
    - state.bankTx.filter((x) => x.direction === "withdrawal").reduce((s, x) => s + x.amount, 0);
}

function renderBank() {
  if (!canView("money")) return;
  const editable = canEditTab("money");
  els.bankBalance.textContent = formatMoney(bankBalance());
  els.bankOpening.value = state.bank.opening;
  els.bankRows.innerHTML = state.bankTx.length
    ? state.bankTx.slice(0, 30).map((x) => `
        <div class="compact-item">
          <div><strong>${x.direction === "deposit" ? tr("deposit") : tr("withdrawal")} · ${formatMoney(x.amount)}</strong><span>${escapeHtml(x.date || "")}${x.note ? " · " + escapeHtml(x.note) : ""}</span></div>
          <div class="inline-tools">
            <span class="badge ${x.direction === "deposit" ? "paid" : "due"}">${x.direction === "deposit" ? "+" : "−"}${formatMoney(x.amount)}</span>
            ${editable ? `<button class="small-btn" type="button" data-delete-bank="${x.id}">${t("del")}</button>` : ""}
          </div>
        </div>`).join("")
    : emptyState(t("emptyBank"));
  document.querySelectorAll("[data-delete-bank]").forEach((b) =>
    b.addEventListener("click", async () => {
      if (!requireEdit("money")) return;
      const tx = state.bankTx.find((x) => x.id === b.dataset.deleteBank);
      if (!tx) return;
      if (!confirmDelete(t("confirmDeleteBank"))) return;
      try {
        const { error } = await sb.from("bank_transactions").delete().eq("id", tx.id);
        if (error) throw error;
      } catch (err) {
        fail(err);
        return;
      }
      toast(t("tBankDel"));
      await db.loadFinance();
      renderAll();
    }));
}

els.bankForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!requireEdit("money")) return;
  const amount = Number(els.bankAmount.value);
  if (!Number.isFinite(amount) || amount <= 0) { toast(t("msgAmtPos")); return; }
  const row = {
    id: uuid(), transaction_date: els.bankDate.value || today,
    direction: els.bankDirection.value, amount,
    description: els.bankNote.value.trim(), created_by: currentUser.id,
  };
  try {
    const { error } = await sb.from("bank_transactions").insert(row);
    if (error) throw error;
  } catch (err) {
    fail(err);
    return;
  }
  els.bankForm.reset();
  els.bankDate.value = today;
  toast(t("tBankAdd"));
  logActivity("Bank entry", `${row.direction} — ${formatMoney(amount)}`);
  await db.loadFinance();
  renderAll();
});

els.bankOpeningBtn.addEventListener("click", async () => {
  if (!isManager()) { toast(t("msgAdminOnly")); return; }
  const value = Number(els.bankOpening.value === "" ? 0 : els.bankOpening.value);
  try {
    const { error } = await sb.from("bank_account").update({ opening_balance: value, updated_at: new Date().toISOString() }).eq("id", true);
    if (error) throw error;
  } catch (err) {
    fail(err);
    return;
  }
  toast(t("tBankSaved"));
  await db.loadFinance();
  renderAll();
});

els.dueForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!requireEdit("money")) return;
  const title = els.dueTitle.value.trim();
  const amount = Number(els.dueAmount.value);
  if (!title) { els.dueTitle.focus(); return; }
  if (!Number.isFinite(amount) || amount <= 0) { toast(t("msgAmtPos")); return; }
  const row = { id: uuid(), title, amount, date: els.dueDate.value || today, paid: false };
  try {
    const { error } = await sb.from("dues").insert(row);
    if (error) throw error;
  } catch (err) {
    fail(err);
    return;
  }
  els.dueForm.reset();
  els.dueDate.value = today;
  toast(t("tDueAdd"));
  logActivity("Add due", `${title} — ${formatMoney(amount)}`);
  await db.loadFinance();
  renderAll();
});

function renderDues() {
  if (!canView("money")) return;
  const editable = canEditTab("money");
  const total = state.dues.filter((d) => !d.paid).reduce((s, d) => s + d.amount, 0);
  els.duesTotal.textContent = formatMoney(total);
  els.dueRows.innerHTML = state.dues.length
    ? state.dues.map((d) => `
        <div class="due-row${d.paid ? " paid" : ""}">
          <div class="due-info">
            <strong>${escapeHtml(d.title)}</strong>
            <span>${escapeHtml(d.date || "-")}</span>
          </div>
          <span class="badge ${d.paid ? "paid" : "due"}">${d.paid ? t("paid") : t("due")} · ${formatMoney(d.amount)}</span>
          ${editable ? `<div class="inline-tools">
            <button class="small-btn ${d.paid ? "" : "present"}" type="button" data-toggle-due="${d.id}">${d.paid ? t("dueMarkUnpaid") : t("dueMarkPaid")}</button>
            <button class="small-btn" type="button" data-delete-due="${d.id}">${t("del")}</button>
          </div>` : ""}
        </div>`).join("")
    : emptyState(t("emptyDues"));

  document.querySelectorAll("[data-toggle-due]").forEach((b) =>
    b.addEventListener("click", async () => {
      if (!requireEdit("money")) return;
      const due = state.dues.find((d) => d.id === b.dataset.toggleDue);
      if (!due) return;
      try {
        const { error } = await sb.from("dues").update({ paid: !due.paid }).eq("id", due.id);
        if (error) throw error;
      } catch (err) {
        fail(err);
        return;
      }
      toast(due.paid ? t("tDueUnpaid") : t("tDuePaid"));
      await db.loadFinance();
      renderAll();
    }));
  document.querySelectorAll("[data-delete-due]").forEach((b) =>
    b.addEventListener("click", async () => {
      if (!requireEdit("money")) return;
      const due = state.dues.find((d) => d.id === b.dataset.deleteDue);
      if (!due) return;
      if (!confirmDelete(`${due.title}: ${t("confirmDeleteDue")}`)) return;
      try {
        const { error } = await sb.from("dues").delete().eq("id", due.id);
        if (error) throw error;
      } catch (err) {
        fail(err);
        return;
      }
      toast(t("tDueDel"));
      await db.loadFinance();
      renderAll();
    }));
}

/* ================= payroll ================= */

function renderPayroll() {
  if (!canView("payroll")) {
    els.payrollRows.innerHTML = "";
    els.heldSessionsList.innerHTML = "";
    return;
  }
  const teacherIds = [...new Set([
    ...state.users.filter((u) => u.role === "teacher").map((u) => u.id),
    ...state.offerings.filter((o) => o.teacherId).map((o) => o.teacherId),
  ])];

  const rows = teacherIds.map((id) => {
    const held = state.heldSessions.filter((s) => s.teacherId === id);
    const earned = held.reduce((s, x) => s + x.rate, 0);
    const paid = state.teacherPayments.filter((p) => p.teacherId === id).reduce((s, p) => s + p.amount, 0);
    return { id, name: getTeacherName(id), count: held.length, earned, paid, due: Math.max(0, earned - paid) };
  });

  els.payrollRows.innerHTML = rows.length
    ? rows.map((r) => `
        <div class="compact-item payroll-card">
          <div>
            <strong>${escapeHtml(r.name)}</strong>
            <span>${toNum(r.count)} ${t("classesHeld")} · ${t("earnedLabel")} ${formatMoney(r.earned)} · ${t("paidLabel")} ${formatMoney(r.paid)}</span>
          </div>
          <span class="badge ${r.due > 0 ? "due" : "paid"}">${t("dueLabel")} ${formatMoney(r.due)}</span>
        </div>`).join("")
    : emptyState(t("emptyPayroll"));

  const prevTeacher = els.payTeacher.value;
  els.payTeacher.innerHTML = rows.map((r) => `<option value="${r.id}">${escapeHtml(r.name)}</option>`).join("");
  if (rows.some((r) => r.id === prevTeacher)) els.payTeacher.value = prevTeacher;

  els.heldSessionsList.innerHTML = state.heldSessions.length
    ? state.heldSessions.slice(0, 30).map((s) => `
        <div class="compact-item">
          <div><strong>${escapeHtml(getCourseName(s.courseId))}</strong><span>${escapeHtml(s.date)} · ${escapeHtml(getTeacherName(s.teacherId))} · ${escapeHtml(yearLabel(s.year))} ${escapeHtml(s.group)}</span></div>
          <span class="badge paid">${formatMoney(s.rate)}</span>
        </div>`).join("")
    : emptyState(t("emptyHeld"));
}

els.payrollPayForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!isManager()) { toast(t("msgAdminOnly")); return; }
  const teacherId = els.payTeacher.value;
  const amount = Number(els.payAmount.value);
  if (!teacherId) { toast(t("selectTeacher")); return; }
  if (!Number.isFinite(amount) || amount <= 0) { toast(t("msgAmtPos")); return; }
  const row = {
    id: uuid(), teacher_id: teacherId, amount,
    paid_by: currentUser.id, note: els.payNote.value.trim(),
  };
  try {
    const { error } = await sb.from("teacher_payments").insert(row);
    if (error) throw error;
  } catch (err) {
    fail(err);
    return;
  }
  els.payrollPayForm.reset();
  toast(t("tPaySaved"));
  logActivity("Teacher payment", `${getTeacherName(teacherId)} — ${formatMoney(amount)}`);
  await db.loadPayroll();
  renderAll();
});

/* ================= settings ================= */

function renderSettings() {
  if (!isManager()) return;
  els.setName.value = state.settings.coachingName;
  els.setAdmissionFee.value = state.settings.admissionFee;
  renderChips(els.collegesBox, state.settings.colleges, "college");
  renderChips(els.groupsBox, state.settings.groups, "group");
}

function renderTrash() {
  if (!isAdmin()) { els.trashRows.innerHTML = ""; return; }
  els.trashRows.innerHTML = state.trash.length
    ? state.trash.map((student) => {
        const days = Math.max(0, 30 - Math.floor((Date.now() - new Date(student.deletedAt).getTime()) / 86400000));
        return `<div class="trash-row">
          <div><strong>${escapeHtml(student.name)}</strong><span translate="no">${escapeHtml(student.studentNumber)} · deleted ${escapeHtml(new Date(student.deletedAt).toLocaleDateString("en-GB"))} · ${days} day${days === 1 ? "" : "s"} left</span></div>
          <div class="inline-tools">
            <button type="button" class="small-btn" data-restore-student="${student.id}">Restore</button>
            <button type="button" class="small-btn danger" data-forever-student="${student.id}">Delete forever</button>
          </div>
        </div>`;
      }).join("")
    : emptyState("Trash is empty. Deleted students wait here for 30 days.");
  els.trashRows.querySelectorAll("[data-restore-student]").forEach((button) => button.addEventListener("click", async () => {
    const { error } = await sb.rpc("restore_deleted_student", { p_student: button.dataset.restoreStudent });
    if (error) { fail(error); return; }
    toast("Student restored.");
    await db.loadTrash();
    await db.loadStudents();
    renderAll();
  }));
  els.trashRows.querySelectorAll("[data-forever-student]").forEach((button) => button.addEventListener("click", async () => {
    const student = state.trash.find((item) => item.id === button.dataset.foreverStudent);
    if (!student || !confirmDelete(`Permanently delete ${student.name}? This cannot be undone.`)) return;
    const { error } = await sb.rpc("delete_student_forever", { p_student: student.id });
    if (error) { fail(error); return; }
    toast("Deleted forever.");
    await db.loadTrash();
    renderAll();
  }));
}

els.purgeTrashBtn.addEventListener("click", async () => {
  if (!isAdmin()) return;
  if (!confirm("Delete all trash entries older than 30 days?")) return;
  const { data, error } = await sb.rpc("purge_deleted_students", { p_days: 30 });
  if (error) { fail(error); return; }
  toast(`Old trash cleaned (${toNum(data || 0)} entries).`);
  await db.loadTrash();
  renderAll();
});

function renderChips(box, items, kind) {
  box.innerHTML = items.length
    ? items.map((item) => `
        <span class="chip">
          ${escapeHtml(item)}
          <button type="button" data-remove-${kind}="${escapeHtml(item)}" aria-label="${t("del")}">×</button>
        </span>`).join("")
    : `<span class="muted-note">${t("dash")}</span>`;
  box.querySelectorAll(`[data-remove-${kind}]`).forEach((btn) =>
    btn.addEventListener("click", async () => {
      const value = btn.dataset[`remove${kind.charAt(0).toUpperCase() + kind.slice(1)}`];
      const key = kind === "college" ? "colleges" : "groups";
      await saveSettings({ [key]: state.settings[key].filter((x) => x !== value) });
    }));
}

async function saveSettings(patch) {
  try {
    const { error } = await sb.from("coaching_settings").update(patch).eq("id", true);
    if (error) throw error;
  } catch (err) {
    fail(err);
    return false;
  }
  await db.loadCore();
  applyBrand();
  toast(t("tSettingsSaved"));
  renderAll();
  return true;
}

els.brandingForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!isManager()) { toast(t("msgAdminOnly")); return; }
  const name = els.setName.value.trim();
  if (!name) return;
  if (await saveSettings({ coaching_name: name, updated_at: new Date().toISOString() })) {
    logActivity("Save branding", name);
  }
});

els.admissionForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!isManager()) { toast(t("msgAdminOnly")); return; }
  const fee = Number(els.setAdmissionFee.value === "" ? 0 : els.setAdmissionFee.value);
  if (Number.isNaN(fee) || fee < 0) { toast(t("msgFeeNeg")); return; }
  if (await saveSettings({ admission_fee: fee, updated_at: new Date().toISOString() })) {
    logActivity("Save admission fee", formatMoney(fee));
  }
});

els.collegeAddForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!isManager()) return;
  const value = els.addCollegeInput.value.trim();
  if (!value || state.settings.colleges.includes(value)) return;
  await saveSettings({ colleges: [...state.settings.colleges, value] });
  els.addCollegeInput.value = "";
});

els.groupAddForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!isManager()) return;
  const value = els.addGroupInput.value.trim();
  if (!value || state.settings.groups.includes(value)) return;
  await saveSettings({ groups: [...state.settings.groups, value] });
  els.addGroupInput.value = "";
});

/* ================= users ================= */

const FIELD_GRANTS = [
  { id: "phone", labelBn: "মোবাইল", labelEn: "Phone" },
  { id: "whatsapp", labelBn: "হোয়াটসঅ্যাপ", labelEn: "WhatsApp" },
  { id: "guardian", labelBn: "অভিভাবক", labelEn: "Guardian" },
  { id: "guardian_phone", labelBn: "অভিভাবকের মোবাইল", labelEn: "Guardian phone" },
  { id: "address", labelBn: "ঠিকানা", labelEn: "Address" },
];

function renderUserTabsBox(selected) {
  els.userTabsBox.innerHTML = ALL_TABS.map((tab) => `
    <label class="check-line">
      <input type="checkbox" value="${tab.id}" ${selected.includes(tab.id) ? "checked" : ""} /> ${tab.labelEn}
    </label>`).join("");
}

function renderGrantsBox(selected) {
  els.fieldGrantsBox.innerHTML = FIELD_GRANTS.map((g) => `
    <label class="check-line">
      <input type="checkbox" value="${g.id}" ${selected.includes(g.id) ? "checked" : ""} /> ${g.labelEn}
    </label>`).join("");
}

function selectedTabs() { return [...els.userTabsBox.querySelectorAll("input:checked")].map((c) => c.value); }
function selectedGrants() { return [...els.fieldGrantsBox.querySelectorAll("input:checked")].map((c) => c.value); }

els.userRole.addEventListener("change", () => {
  const role = els.userRole.value;
  const preset = ROLE_DEFAULTS[role] || ROLE_DEFAULTS.viewer;
  if (!editingUserId) {
    renderUserTabsBox(preset.tabs);
    els.userMoneyEdit.checked = preset.moneyEdit;
  }
  els.linkStudentWrap.hidden = role !== "student";
  els.grantsWrap.style.display = role === "teacher" ? "" : "none";
  els.payrollAccessWrap.style.display = role === "teacher" ? "" : "none";
});

async function edgeErrorMessage(error) {
  try {
    const body = await error?.context?.json();
    return body?.error || body?.message || "";
  } catch {
    return "";
  }
}

// The edge function can be unreachable for reasons other than a clean 404: when
// it is not deployed, Supabase's gateway CORS reply omits headers the browser
// needs, so the preflight fails and supabase-js throws a FunctionsFetchError
// ("Failed to send a request to the Edge Function") whose body is unreadable.
// Treat all of those as "not deployed" so the browser fallback can take over.
function isEdgeUnavailable(error, real) {
  const name = String(error?.name || "");
  const message = String(error?.message || "");
  return (
    name === "FunctionsFetchError" ||
    /failed to send a request to the edge function/i.test(message) ||
    /failed to fetch|load failed|networkerror/i.test(message) ||
    /not found/i.test(real || "")
  );
}

async function createUserViaEdge(email, password, profile) {
  let data = null;
  let error = null;
  try {
    ({ data, error } = await sb.functions.invoke("admin-users", {
      body: { action: "create", email, password, profile },
    }));
  } catch (err) {
    error = err;
  }
  if (error) {
    const real = await edgeErrorMessage(error);
    // The Auth account already exists from an earlier half-created attempt:
    // attach a profile to it (and confirm the email) instead of failing.
    if (/already|exists|duplicate|been taken/i.test(real)) {
      try {
        ({ data, error } = await sb.functions.invoke("admin-users", {
          body: { action: "attach", email, password, profile },
        }));
      } catch (err) {
        error = err;
      }
      if (error) {
        const attachReal = await edgeErrorMessage(error);
        if (isEdgeUnavailable(error, attachReal)) return { skipped: true };
        throw new Error(attachReal || error.message);
      }
      return { id: data?.id, attached: true };
    }
    if (isEdgeUnavailable(error, real)) return { skipped: true };
    throw new Error(real || error.message);
  }
  return { id: data?.id };
}

async function createUserFallback(email, password, profile) {
  const { data: sessionData } = await sb.auth.getSession();
  const savedSession = sessionData?.session || null;
  const { data: signUpData, error: signUpErr } = await sb.auth.signUp({ email, password });
  if (signUpErr) throw signUpErr;
  const newId = signUpData?.user?.id;
  const identities = signUpData?.user?.identities;
  // Supabase returns an obfuscated user with no identities when the email is
  // already registered, so a missing id alone is not enough to detect this.
  if (!newId || (Array.isArray(identities) && identities.length === 0)) {
    throw new Error("This email already has an account. Deploy the admin-users Edge Function (DEPLOY.md), then create the user again with the same details — the app will attach a profile to the existing account and confirm it.");
  }
  // With email confirmation off, signUp returns a session and swaps the client
  // to the new user. Restore the admin's session first, otherwise the profile
  // insert below runs as the new user and is blocked by the admin-only RLS policy.
  if (savedSession) await sb.auth.setSession(savedSession);
  const { error: profErr } = await sb.from("profiles").insert({
    id: newId, username: profile.username, role: profile.role, tabs: profile.tabs,
    money_edit: !!profile.money_edit, student_field_grants: profile.student_field_grants || [],
    teacher_payroll_access: !!profile.teacher_payroll_access,
    student_id: profile.student_id || null,
  });
  if (profErr) throw profErr;
  return { id: newId, needsConfirm: !signUpData.session };
}

function showUserFormError(message) {
  if (!els.userFormError) return;
  els.userFormError.textContent = message || "";
  els.userFormError.hidden = !message;
}

els.userForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!isAdmin()) { toast(t("msgAdminOnly")); return; }
  const username = els.userName.value.trim().toLowerCase();
  const email = els.userEmail.value.trim().toLowerCase();
  const pass = els.userPass.value;
  showUserFormError("");
  if (!username) { toast(t("msgUserReq")); return; }
  const role = els.userRole.value;
  if (role === "student" && !els.userStudent.value) { toast(t("msgLinkStudent")); return; }

  const profile = {
    username, role, tabs: selectedTabs(),
    money_edit: els.userMoneyEdit.checked,
    student_field_grants: selectedGrants(),
    teacher_payroll_access: els.userPayrollAccess.checked,
    student_id: role === "student" ? els.userStudent.value : "",
  };

  const submitBtn = els.userSubmitBtn;
  const originalLabel = submitBtn.textContent;
  submitBtn.disabled = true;
  if (!editingUserId) submitBtn.textContent = "Creating…";
  try {
    if (editingUserId) {
      const user = state.users.find((u) => u.id === editingUserId);
      if (!user) return;
      const { error } = await sb.from("profiles").update({
        username, role, tabs: profile.tabs, money_edit: profile.money_edit,
        student_field_grants: profile.student_field_grants,
        teacher_payroll_access: profile.teacher_payroll_access,
        student_id: profile.student_id || null,
      }).eq("id", user.id);
      if (error) throw error;
      if (currentUser && user.id === currentUser.id) {
        Object.assign(currentUser, {
          username, role, tabs: profile.tabs, moneyEdit: profile.money_edit,
          fieldGrants: profile.student_field_grants, payrollAccess: profile.teacher_payroll_access,
          studentId: profile.student_id,
        });
      }
      toast(t("tUserEdit"));
      logActivity("Edit user", username);
    } else {
      if (!email) { toast(t("msgNeedEmail")); els.userEmail.focus(); return; }
      if (state.users.some((u) => u.username === username)) { toast(t("msgUserExists")); return; }
      // Supabase Auth rejects passwords under 6 characters.
      if (!pass || pass.length < 6) { toast("Password must be at least 6 characters."); els.userPass.focus(); return; }
      let result = await createUserViaEdge(email, pass, profile);
      if (result.skipped) {
        console.warn("admin-users edge function not deployed; using browser signUp fallback");
        try {
          result = await createUserFallback(email, pass, profile);
        } catch (fallbackErr) {
          throw new Error(`${fallbackErr.message} (Deploy the admin-users function for reliable user creation — see DEPLOY.md.)`);
        }
      }
      // Verify by username (unique) so a malformed id can never reach a uuid
      // column; a missing profile means the account cannot be listed or used.
      const verifyProfile = () => sb.from("profiles").select("id, username").eq("username", username).maybeSingle();
      let { data: createdProfile, error: verifyErr } = await verifyProfile();
      if (verifyErr) throw verifyErr;
      let attached = !!result.attached;
      if (!createdProfile) {
        // The Auth account exists without a profile (e.g. an earlier failed
        // attempt). Ask the edge function to attach + confirm it right now.
        let attachError = null;
        try {
          ({ error: attachError } = await sb.functions.invoke("admin-users", {
            body: { action: "attach", email, password: pass, profile },
          }));
        } catch (err) { attachError = err; }
        if (!attachError) {
          ({ data: createdProfile } = await verifyProfile());
          attached = !!createdProfile;
        }
        if (!createdProfile) {
          const real = attachError ? await edgeErrorMessage(attachError) : "";
          const { data: anyProfile } = await sb.from("profiles").select("id").limit(1);
          const visibility = anyProfile && anyProfile.length
            ? "your session sees other profiles, but this insert is not landing"
            : "your session cannot see any profile rows (RLS/role issue)";
          throw new Error(`Profile for "${username}" still missing after attach (${real || attachError?.message || "attach unavailable — the admin-users Edge Function is not deployed"}). Your session sees: ${visibility}. Deploy the function (DEPLOY.md), reload, and create again.`);
        }
      }
      if (result.needsConfirm && !attached) {
        // Browser signUp cannot confirm emails; block login until confirmed.
        showUserFormError(`"${username}" was created, but email confirmation is ON in Supabase, so login fails with "Email not confirmed" until confirmed. Fix: Supabase > Authentication > Sign In / Providers > turn Confirm email OFF, or confirm the user under Authentication > Users. Deploying the admin-users function auto-confirms new users.`);
        toast("User created, but email must be confirmed before login.");
      } else {
        toast(`"${username}" ${attached ? "attached and confirmed — login now" : t("tUserAdd")}`);
      }
      logActivity("Create user", `${username} — ${roleLabel(role)}`);
    }
  } catch (err) {
    const message = String(err?.message || err || "Could not create the user.");
    showUserFormError(message);
    fail(err);
    return;
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = originalLabel;
  }
  resetUserForm();
  await db.loadAdmin();
  await db.loadCore();
  renderAll();
});

els.userCancelBtn.addEventListener("click", resetUserForm);

function resetUserForm() {
  editingUserId = null;
  showUserFormError("");
  els.userForm.reset();
  els.userRole.value = "editor";
  renderUserTabsBox(ROLE_DEFAULTS.editor.tabs);
  renderGrantsBox([]);
  els.userMoneyEdit.checked = false;
  els.userPayrollAccess.checked = false;
  els.linkStudentWrap.hidden = true;
  els.grantsWrap.style.display = "none";
  els.payrollAccessWrap.style.display = "none";
  els.userEmailWrap.style.display = "";
  els.userEmail.required = true;
  els.userPassWrap.style.display = "";
  els.userPass.required = true;
  els.userPassNote.hidden = true;
  els.userFormTitle.textContent = t("newUser");
  els.userSubmitBtn.textContent = t("makeUser");
  els.userCancelBtn.hidden = true;
}

function renderUsers() {
  if (!isAdmin()) return;
  els.userStudent.innerHTML = [
    `<option value="">${t("selectStudent")}</option>`,
    ...state.students.map((s) => `<option value="${s.id}">${escapeHtml(s.name)}</option>`),
  ].join("");

  const loadErrorRow = state.usersLoadError
    ? `<tr><td colspan="4"><p class="form-error-note">User list could not load: ${escapeHtml(state.usersLoadError)} — check that you are logged in as the super admin.</p></td></tr>`
    : "";

  els.userRows.innerHTML = state.users.length
    ? loadErrorRow + state.users.map((u) => {
        const tabs = u.role === "admin" ? t("tabsAll") : (u.tabs || []).map(tabLabel).join(", ") || t("tabsNone");
        const self = currentUser && u.id === currentUser.id;
        const granted = (u.fieldGrants || []).length ? ` + ${(u.fieldGrants).join(", ")}` : "";
        return `
          <tr>
            <td data-label="${tr("thUsername")}"><strong>${escapeHtml(u.username)}</strong>${self ? ` <span class="badge">${t("you")}</span>` : ""}${u.role === "admin" ? ` <span class="badge paid">${t("superAdmin")}</span>` : ""}</td>
            <td data-label="${tr("thRole")}"><span class="badge ${u.role === "admin" ? "paid" : ""}">${escapeHtml(roleLabel(u.role))}</span></td>
            <td data-label="${tr("thPages")}"><span>${escapeHtml(tabs)}${u.moneyEdit ? t("plusMoneyEdit") : ""}${u.payrollAccess ? ` + ${tr("m_payroll")}` : ""}${granted}</span></td>
            <td><div class="inline-tools">
              <button class="small-btn" type="button" data-edit-user="${u.id}">${t("edit")}</button>
              ${self || u.role === "admin" ? "" : `<button class="small-btn" type="button" data-delete-user="${u.id}">${t("del")}</button>`}
            </div></td>
          </tr>`;
      }).join("")
    : `<tr><td colspan="4">${emptyState(t("emptyUsers"))}</td></tr>`;

  document.querySelectorAll("[data-edit-user]").forEach((b) =>
    b.addEventListener("click", () => {
      const user = state.users.find((u) => u.id === b.dataset.editUser);
      if (!user) return;
      editingUserId = user.id;
      els.userFormTitle.textContent = t("editUser");
      els.userSubmitBtn.textContent = t("save");
      els.userCancelBtn.hidden = false;
      els.userName.value = user.username;
      els.userEmailWrap.style.display = "none";
      els.userEmail.required = false;
      els.userPassWrap.style.display = "none";
      els.userPass.required = false;
      els.userPassNote.hidden = false;
      els.userRole.value = user.role;
      renderUserTabsBox(user.role === "admin" ? ROLE_DEFAULTS.admin.tabs : (user.tabs || []));
      renderGrantsBox(user.fieldGrants || []);
      els.userMoneyEdit.checked = !!user.moneyEdit;
      els.userPayrollAccess.checked = !!user.payrollAccess;
      els.linkStudentWrap.hidden = user.role !== "student";
      els.grantsWrap.style.display = user.role === "teacher" ? "" : "none";
      els.payrollAccessWrap.style.display = user.role === "teacher" ? "" : "none";
      els.userStudent.value = user.studentId || "";
      els.userName.focus();
    }));
  document.querySelectorAll("[data-delete-user]").forEach((b) =>
    b.addEventListener("click", async () => {
      const user = state.users.find((u) => u.id === b.dataset.deleteUser);
      if (!user || user.id === currentUser.id) return;
      if (!confirmDelete(`"${user.username}" ${t("confirmDeleteUser")}`)) return;
      try {
        let edgeErr = null;
        try {
          ({ error: edgeErr } = await sb.functions.invoke("admin-users", { body: { action: "delete", id: user.id } }));
        } catch (err) {
          edgeErr = err;
        }
        if (edgeErr) {
          const real = await edgeErrorMessage(edgeErr);
          if (isEdgeUnavailable(edgeErr, real)) {
            const { error: delErr } = await sb.from("profiles").delete().eq("id", user.id);
            if (delErr) throw delErr;
            toast(t("msgUserDeleted"));
          } else {
            throw new Error(real || edgeErr.message);
          }
        } else {
          toast(t("msgUserDeleted"));
        }
      } catch (err) {
        fail(err);
        return;
      }
      logActivity("Delete user", user.username);
      await db.loadAdmin();
      await db.loadCore();
      renderAll();
    }));
}

/* ================= activity ================= */

function renderActivity() {
  if (!isManager() || !els.activityRows) return;
  const query = (els.activitySearch ? els.activitySearch.value : "").trim().toLowerCase();
  const userFilter = els.activityUser ? els.activityUser.value : "all";
  const users = [...new Set(state.activity.map((a) => a.user))];
  if (els.activityUser && els.activityUser.options.length <= 1) {
    els.activityUser.innerHTML = `<option value="all">${tr("allUsers")}</option>` +
      users.map((u) => `<option value="${escapeHtml(u)}">${escapeHtml(u)}</option>`).join("");
  }
  const rows = state.activity.filter((a) => {
    if (userFilter !== "all" && a.user !== userFilter) return false;
    if (query && `${a.user} ${a.action} ${a.detail} ${a.date}`.toLowerCase().includes(query) === false) return false;
    return true;
  });
  els.activityRows.innerHTML = rows.length
    ? rows.slice(0, 100).map((a) => `
      <tr>
        <td data-label="${tr("thDate")}">${escapeHtml(a.date || "-")}<br><span>${escapeHtml(a.time || "")}</span></td>
        <td data-label="${tr("thUser")}"><strong>${escapeHtml(a.user)}</strong></td>
        <td data-label="${tr("thWork")}">${escapeHtml(a.action)}</td>
        <td data-label="${tr("thDetail")}"><span>${escapeHtml(a.detail || "-")}</span></td>
      </tr>`).join("")
    : `<tr><td colspan="4">${emptyState(t("emptyActivity"))}</td></tr>`;
}

els.activitySearch.addEventListener("input", renderActivity);
els.activityUser.addEventListener("change", renderActivity);

/* ================= dashboard ================= */

async function renderDashboard() {
  if (!canView("dashboard")) return;
  const allDue = state.invoices.reduce((s, i) => s + invoiceDue(i), 0);

  let presentCount = 0;
  let absentCount = 0;
  if (isManager()) {
    const sessions = await safe(sb.from("class_sessions").select("class_attendance(status)").eq("class_date", today));
    for (const s of sessions || []) {
      for (const rec of s.class_attendance || []) {
        if (rec.status === "present") presentCount++;
        else absentCount++;
      }
    }
  }

  const totalCollection = canView("fees") ? state.feePayments.reduce((sum, payment) => sum + Number(payment.amount || 0), 0) : 0;
  const thisYear = today.slice(0, 4);
  const dailyCollection = canView("fees") ? state.feePayments.filter((payment) => payment.payment_date === today).reduce((sum, payment) => sum + Number(payment.amount || 0), 0) : 0;
  const monthlyCollection = canView("fees") ? state.feePayments.filter((payment) => payment.payment_date?.slice(0, 7) === thisMonth).reduce((sum, payment) => sum + Number(payment.amount || 0), 0) : 0;
  const yearlyCollection = canView("fees") ? state.feePayments.filter((payment) => payment.payment_date?.slice(0, 4) === thisYear).reduce((sum, payment) => sum + Number(payment.amount || 0), 0) : 0;
  const monthlyExpense = state.money.filter((entry) => entry.type === "expense" && entry.date?.slice(0, 7) === thisMonth).reduce((sum, entry) => sum + entry.amount, 0);
  els.homeTotalDue.textContent = formatMoney(allDue);
  els.homeTotalCollection.textContent = formatMoney(totalCollection);
  els.homeDailyCollection.textContent = formatMoney(dailyCollection);
  els.homeMonthlyCollection.textContent = formatMoney(monthlyCollection);
  els.homeYearlyCollection.textContent = formatMoney(yearlyCollection);
  els.homeStudentCount.textContent = toNum(state.students.length);
  els.homeExpenseCount.textContent = formatMoney(monthlyExpense);
  els.homeBirthdayCount.textContent = toNum(state.students.filter((student) => student.status === "active" && student.birthday?.slice(5) === today.slice(5)).length);
  els.homeAbsentCount.textContent = toNum(absentCount);
  els.metricStudents.textContent = toNum(state.students.filter((student) => student.status === "active").length);
  els.metricBatches.textContent = toNum(state.batches.length);
  els.metricPresent.textContent = toNum(presentCount);
  els.metricDue.textContent = formatMoney(allDue);

  els.recentStudents.innerHTML = state.students.length
    ? state.students.slice(0, 3).map((s) => `
      <div class="compact-item">
        <div><strong>${escapeHtml(s.name)}</strong><span>${escapeHtml(s.college || "")} · ${escapeHtml(yearLabel(s.year))}</span></div>
        <span>${escapeHtml(s.phone || t("noPhone"))}</span>
      </div>`).join("")
    : emptyState(t("emptyStudents"));

  const paidCount = state.students.filter((s) => studentTotalDue(s.id) <= 0).length;
  const dueCount = state.students.length - paidCount;
  els.feeSummary.innerHTML = `
    <div class="compact-item"><div><strong>${toNum(paidCount)}</strong><span>${t("feePaidAll")}</span></div><span class="badge paid">${t("paid")}</span></div>
    <div class="compact-item"><div><strong>${toNum(dueCount)}</strong><span>${t("feeHasDue")}</span></div><span class="badge due">${t("due")}</span></div>`;

  els.attendanceSummary.innerHTML = `
    <div class="compact-item"><div><strong>${toNum(presentCount)}</strong><span>${t("attPresent")}</span></div><span class="badge paid">${t("present")}</span></div>
    <div class="compact-item"><div><strong>${toNum(absentCount)}</strong><span>${t("attAbsent")}</span></div><span class="badge due">${t("absent")}</span></div>`;

  // Per-subject/package enrollment cards; clicking one filters the Students tab.
  const cards = state.courses
    .map((course) => ({ course, count: courseEnrollmentCount(course.id) }))
    .sort((a, b) => b.count - a.count || a.course.name.localeCompare(b.course.name));
  els.homeSubjectCards.innerHTML = cards.length
    ? cards.map(({ course, count }) => `
        <button type="button" class="subject-card" data-subject-card="${course.id}">
          <span class="subject-card-type">${courseTypeLabel(course.type)}</span>
          <strong>${escapeHtml(course.name)}</strong>
          <span class="subject-card-count">${toNum(count)} ${t("studentsSuffix")}</span>
        </button>`).join("")
    : emptyState(t("emptyCourse"));
  els.homeSubjectCards.querySelectorAll("[data-subject-card]").forEach((button) =>
    button.addEventListener("click", () => {
      pendingSubjectFilter = button.dataset.subjectCard;
      switchView("students", viewTitle("students"));
      renderStudents();
    }));
}

function barRow(label, value, max, money) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return `
    <div class="bar-row">
      <span class="bar-label">${escapeHtml(label)}</span>
      <div class="bar-track"><div class="bar-fill" style="width:${pct}%"></div></div>
      <strong class="bar-value">${money ? formatMoney(value) : toNum(value)}</strong>
    </div>`;
}

function renderCharts() {
  if (!canView("dashboard")) return;
  const courseCounts = state.courses
    .map((c) => ({ name: c.name, count: courseEnrollmentCount(c.id) }))
    .filter((c) => c.count > 0);
  const maxCourse = Math.max(1, ...courseCounts.map((c) => c.count));
  els.chartCourses.innerHTML = courseCounts.length
    ? courseCounts.map((c) => barRow(c.name, c.count, maxCourse, false)).join("")
    : emptyState(t("emptyCourse"));

  const batchCounts = state.batches.map((b) => ({ name: b.name, count: state.students.filter((s) => s.batchId === b.id).length }));
  const maxBatch = Math.max(1, ...batchCounts.map((c) => c.count));
  els.chartBatches.innerHTML = batchCounts.length
    ? batchCounts.map((c) => barRow(c.name, c.count, maxBatch, false)).join("")
    : emptyState(t("emptyBatch"));

  const collected = state.invoices.reduce((s, i) => s + i.paid, 0);
  const due = state.invoices.reduce((s, i) => s + invoiceDue(i), 0);
  const maxFee = Math.max(1, collected, due);
  els.chartFees.innerHTML = `
    ${barRow(t("collected"), collected, maxFee, true)}
    ${barRow(t("due"), due, maxFee, true)}`;
}

/* ================= backup / demo ================= */

function logActivity(action, detail) {
  const entry = {
    id: uuid(), user: currentUser ? currentUser.username : t("unknown"),
    action, detail: detail || "", date: today,
    time: new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }),
    createdAt: Date.now(),
  };
  state.activity.unshift(entry);
  sb.from("activity_log").insert({
    id: entry.id, username: entry.user, action: entry.action, detail: entry.detail, date: entry.date,
  }).then(({ error }) => { if (error) console.debug("activity log:", error.message); });
}

els.adminToolsToggle.addEventListener("click", () => {
  const open = els.adminToolsBody.hidden;
  els.adminToolsBody.hidden = !open;
  els.adminToolsToggle.setAttribute("aria-expanded", String(open));
});

els.exportDataBtn.addEventListener("click", () => {
  if (!isAdmin()) return;
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `coaching-backup-${today}.json`;
  link.click();
  URL.revokeObjectURL(url);
  toast(t("tBackupDown"));
});

els.clearDataBtn.addEventListener("click", async () => {
  if (!isAdmin()) return;
  if (!confirm(t("confirmClearAll"))) return;
  const tables = [
    "class_attendance", "class_sessions", "course_offerings",
    "student_fee_payments", "student_fee_invoices", "admission_payments",
    "enrollments", "attendance", "payments", "students", "courses", "batches",
    "money_entries", "dues", "bank_transactions", "teacher_payments", "activity_log",
  ];
  try {
    for (const table of tables) {
      const { error } = await sb.from(table).delete().neq("id", "00000000-0000-0000-0000-000000000000");
      if (error) throw error;
    }
  } catch (err) {
    fail(err);
    return;
  }
  toast(t("tClear"));
  logActivity("Cleared all data", "");
  await db.loadAll();
  renderAll();
});

els.importFileInput.addEventListener("change", () => {
  if (!isAdmin()) return;
  const file = els.importFileInput.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = async () => {
    let parsed = null;
    try {
      parsed = JSON.parse(reader.result);
    } catch {
      toast(t("msgBackupFail"));
      els.importFileInput.value = "";
      return;
    }
    if (!parsed || !Array.isArray(parsed.students) || !Array.isArray(parsed.batches)) {
      toast(t("msgNoBackup"));
      els.importFileInput.value = "";
      return;
    }
    const idMap = new Map();
    const fix = (id) => {
      if (!id) return id;
      if (!idMap.has(id)) idMap.set(id, uuid());
      return idMap.get(id);
    };
    const monthStart = thisMonth + "-01";
    const admission = state.settings.admissionFee;
    const courses = (parsed.courses || []).map((c) => ({ id: fix(c.id), name: c.name || "-", type: c.type === "package" ? "package" : "subject", fee: Number(c.fee || 0), duration: c.duration || "" }));
    const batches = (parsed.batches || []).map((b) => ({ id: fix(b.id), name: b.name || "-", teacher: b.teacher || "", schedule: b.schedule || "" }));
    const students = (parsed.students || []).map((s) => ({
      id: fix(s.id), name: s.name || "-", phone: s.phone || "", guardian: s.guardian || "",
      guardian_phone: s.guardianPhone || "", whatsapp: s.whatsapp || "", college: s.college || "",
      year_level: s.year || s.yearLevel || null, group_name: s.group || s.groupName || null,
      batch_id: s.batchId ? fix(s.batchId) : null, paid: 0, status: "active",
    }));
    const enrollments = [];
    (parsed.students || []).forEach((s) => {
      const list = Array.isArray(s.enrollments)
        ? s.enrollments
        : (s.courseId ? [{ courseId: s.courseId, fee: Number(s.monthlyFee || 0) }] : []);
      list.forEach((e) => {
        if (e.courseId) enrollments.push({ student_id: fix(s.id), course_id: fix(e.courseId), fee: Number(e.fee || 0) });
      });
    });
    const invoices = enrollments.map((e) => ({ student_id: e.student_id, course_id: e.course_id, billing_month: monthStart, agreed_fee: e.fee }));
    const admissions = students.map((s) => ({ student_id: s.id, required_amount: admission, amount_paid: admission }));
    const money = (parsed.money || []).map((m) => ({ date: m.date || today, type: m.type === "expense" ? "expense" : "income", category: m.category || "General", amount: Number(m.amount || 0), note: m.note || "", by_username: m.by || "" }));
    const dues = (parsed.dues || []).map((d) => ({ title: d.title || "-", amount: Number(d.amount || 0), date: d.date || today, paid: !!d.paid }));
    try {
      const push = async (table, rows) => {
        if (!rows.length) return;
        const { error } = await sb.from(table).insert(rows);
        if (error) throw error;
      };
      await push("batches", batches);
      await push("courses", courses);
      await push("students", students);
      await push("enrollments", enrollments);
      await push("student_fee_invoices", invoices);
      await push("admission_payments", admissions);
      await push("money_entries", money);
      await push("dues", dues);
    } catch (err) {
      fail(err);
      els.importFileInput.value = "";
      return;
    }
    const missingYear = students.filter((s) => !s.year_level).length;
    toast(t("tBackupUp") + (missingYear ? ` — ${missingYear} ${t("msgImportLegacy")}` : ""));
    logActivity("Backup import", file.name || "");
    await db.loadAll();
    renderAll();
    els.importFileInput.value = "";
  };
  reader.readAsText(file);
});

/* ================= render all ================= */

const REMINDER_DISMISS_KEY = "ccmDismissedReminders";
function reminderDismissKey() { return `${REMINDER_DISMISS_KEY}:${today}`; }
function loadDismissedReminders() {
  try { return new Set(JSON.parse(localStorage.getItem(reminderDismissKey()) || "[]")); } catch { return new Set(); }
}
function saveDismissedReminders(set) {
  try { localStorage.setItem(reminderDismissKey(), JSON.stringify([...set])); } catch { /* ignore */ }
}

function renderReminders() {
  if (!canView("reminders")) { els.reminderRows.innerHTML = emptyState("No permission to view reminders."); return; }
  els.reminderDateLabel.textContent = new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  const dismissed = loadDismissedReminders();
  const monthDay = today.slice(5);
  const [year, month] = today.split("-").map(Number);
  const lastDay = new Date(year, month, 0).getDate();
  const leapYear = new Date(year, 1, 29).getMonth() === 1;
  const reminders = [];
  for (const student of state.students.filter((s) => s.status === "active")) {
    const due = studentTotalDue(student.id);
    const birthday = student.birthday?.slice(5);
    const anniversaryToday = student.admissionDate ? Math.min(Number(student.admissionDate.slice(8, 10)), lastDay) === Number(today.slice(8, 10)) : false;
    if (birthday === monthDay || (!leapYear && monthDay === "02-28" && birthday === "02-29")) {
      reminders.push({ student, kind: "Birthday", amount: 0, daily: false });
    }
    if (anniversaryToday) {
      reminders.push({ student, kind: "Monthly fee due", amount: due, daily: false });
    } else if (due > 0) {
      reminders.push({ student, kind: "Fee due", amount: due, daily: true });
    }
  }
  const visible = reminders.filter((item) => !dismissed.has(`${item.student.id}|${item.kind}`));
  els.reminderRows.innerHTML = visible.length ? visible.map((item) => {
    const key = `${item.student.id}|${item.kind}`;
    const amountLine = item.amount > 0 ? `<span class="badge due">${t("due")} ${formatMoney(item.amount)}</span>` : "";
    return `<article class="reminder-card ${item.kind === "Birthday" ? "reminder-birthday" : "reminder-due"}">
      <div class="student-avatar" aria-hidden="true">${escapeHtml(item.student.name.charAt(0).toUpperCase())}</div>
      <div class="reminder-copy">
        <strong>${escapeHtml(item.student.name)}</strong>
        <span><span translate="no">${escapeHtml(item.student.studentNumber || "")}</span> · ${escapeHtml(yearLabel(item.student.year))}</span>
      </div>
      <span class="badge ${item.kind === "Birthday" ? "paid" : "due"}">${item.kind}</span>
      ${amountLine}
      <button type="button" class="reminder-clear" data-dismiss-reminder="${escapeHtml(key)}" aria-label="Clear reminder for ${escapeHtml(item.student.name)}">✕</button>
    </article>`;
  }).join("") : emptyState("No birthdays or fee reminders today.");
  els.reminderRows.querySelectorAll("[data-dismiss-reminder]").forEach((button) => button.addEventListener("click", () => {
    const set = loadDismissedReminders();
    set.add(button.dataset.dismissReminder);
    saveDismissedReminders(set);
    renderReminders();
  }));
}

function donutChart(segments, centerValue, centerCaption, fmt) {
  const format = fmt || formatMoney;
  const total = segments.reduce((s, x) => s + x.value, 0);
  if (!total) return emptyState("Nothing in this period.");
  const colors = ["#2f9e63", "#e08a3c", "#4a7fd6", "#c0504d", "#8a63d2"];
  const r = 42;
  const circumference = 2 * Math.PI * r;
  let offset = 0;
  const arcs = segments.map((seg, index) => {
    const frac = seg.value / total;
    const dash = `${Math.max(0, frac * circumference - 1)} ${circumference - Math.max(0, frac * circumference - 1)}`;
    const arc = `<circle cx="60" cy="60" r="${r}" fill="none" stroke="${seg.color || colors[index % colors.length]}" stroke-width="16" stroke-dasharray="${dash}" stroke-dashoffset="${-offset}"/>`;
    offset += frac * circumference;
    return arc;
  }).join("");
  const legend = segments.map((seg, index) => {
    const pct = Math.round((seg.value / total) * 100);
    return `<li><span class="dot" style="background:${seg.color || colors[index % colors.length]}"></span>${escapeHtml(seg.label)} · ${pct}% · ${format(seg.value)}</li>`;
  }).join("");
  return `<div class="donut"><svg viewBox="0 0 120 120" role="img" aria-label="${escapeHtml(centerCaption)}">${arcs}<text x="60" y="62" text-anchor="middle" class="donut-value">${escapeHtml(centerValue)}</text><text x="60" y="76" text-anchor="middle" class="donut-sub">${escapeHtml(centerCaption)}</text></svg></div><ul class="donut-legend">${legend}</ul>`;
}

function reportRange() {
  if (reportPeriod === "day") {
    const day = els.reportPeriodDate.value || today;
    return { start: day, end: day, label: day, months: [day.slice(0, 7)] };
  }
  if (reportPeriod === "week") {
    const anchor = els.reportPeriodDate.value || today;
    const date = new Date(anchor + "T12:00:00");
    const shift = (date.getDay() + 6) % 7;
    const start = new Date(date);
    start.setDate(date.getDate() - shift);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    const iso = (d) => {
      const copy = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
      return copy.toISOString().slice(0, 10);
    };
    const startIso = iso(start);
    const endIso = iso(end);
    const months = [];
    const cursor = new Date(start);
    while (cursor <= end) {
      const m = iso(cursor).slice(0, 7);
      if (!months.includes(m)) months.push(m);
      cursor.setMonth(cursor.getMonth() + 1);
      cursor.setDate(1);
    }
    return { start: startIso, end: endIso, label: `${startIso} → ${endIso}`, months };
  }
  if (reportPeriod === "year") {
    const yearValue = String(els.reportPeriodYear.value || thisMonth.slice(0, 4));
    const months = [];
    for (let m = 1; m <= 12; m++) months.push(`${yearValue}-${String(m).padStart(2, "0")}`);
    return { start: `${yearValue}-01-01`, end: `${yearValue}-12-31`, label: `Year ${yearValue}`, months };
  }
  const month = els.reportPeriodMonth.value || thisMonth;
  const [y, m] = month.split("-").map(Number);
  const lastDay = new Date(y, m, 0).getDate();
  return { start: `${month}-01`, end: `${month}-${String(lastDay).padStart(2, "0")}`, label: month, months: [month] };
}

const inRange = (value, range) => {
  const day = String(value || "").slice(0, 10);
  return day >= range.start && day <= range.end;
};

function renderReports() {
  if (!isManager()) return;
  const range = reportRange();
  const moneyIncome = state.money.filter((entry) => inRange(entry.date, range) && entry.type === "income").reduce((sum, entry) => sum + entry.amount, 0);
  const expense = state.money.filter((entry) => inRange(entry.date, range) && entry.type === "expense").reduce((sum, entry) => sum + entry.amount, 0);
  const cash = state.feePayments.filter((payment) => inRange(payment.payment_date || payment.paid_at?.slice(0, 10), range)).reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
  // Fee collection is income everywhere. When the database already posts a
  // "Student fee" row per receipt, drop it here and add the raw payments so
  // the total never double counts whether or not that trigger is deployed.
  const postedFeeIncome = state.money
    .filter((entry) => inRange(entry.date, range) && entry.type === "income" && (entry.category || "").toLowerCase() === "student fee")
    .reduce((sum, entry) => sum + entry.amount, 0);
  const income = moneyIncome - postedFeeIncome + cash;
  const discounts = state.feeDiscounts.filter((discount) => range.months.includes(String(discount.billing_month || "").slice(0, 7))).reduce((sum, discount) => sum + Number(discount.amount || 0), 0);
  const due = state.invoices.filter((invoice) => range.months.includes(invoice.month)).reduce((sum, invoice) => sum + invoiceDue(invoice), 0);
  const collected = state.invoices.filter((invoice) => range.months.includes(invoice.month)).reduce((sum, invoice) => sum + invoice.paid, 0);
  const active = state.students.filter((student) => student.status === "active").length;
  const inactive = state.students.length - active;

  els.reportIncome.textContent = formatMoney(income);
  els.reportExpense.textContent = formatMoney(expense);
  els.reportNet.textContent = formatMoney(income - expense);
  // Bank balance as of the end of the selected period, not just today.
  const bankEnd = state.bank.opening + state.bankTx
    .filter((tx) => String(tx.date || "") <= range.end)
    .reduce((sum, tx) => sum + (tx.direction === "deposit" ? tx.amount : -tx.amount), 0);
  els.reportBankBalance.textContent = formatMoney(bankEnd);
  els.reportCollection.textContent = formatMoney(cash);
  els.reportDue.textContent = formatMoney(due);
  els.reportDiscount.textContent = formatMoney(discounts);

  els.chartReportFee.innerHTML = donutChart([
    { label: "Collected", value: collected, color: "#2f9e63" },
    { label: "Due", value: due, color: "#e08a3c" },
  ], `${Math.round((collected / Math.max(1, collected + due)) * 100)}%`, "fee paid", formatMoney);
  els.chartReportMoney.innerHTML = donutChart([
    { label: "Income", value: income, color: "#2f9e63" },
    { label: "Expense", value: expense, color: "#e08a3c" },
  ], formatMoney(income - expense), "net", formatMoney);
  els.chartReportStudents.innerHTML = donutChart([
    { label: "Active", value: active, color: "#2f9e63" },
    { label: "Inactive", value: inactive, color: "#e08a3c" },
  ], toNum(state.students.length), "students", toNum);

  const openDues = state.dues.filter((d) => !d.paid);
  const paidDues = state.dues.filter((d) => d.paid);
  els.reportDues.innerHTML = state.dues.length
    ? `<div class="dues-summary"><span class="badge due">Open ${formatMoney(openDues.reduce((s, d) => s + d.amount, 0))}</span><span class="badge paid">Paid ${formatMoney(paidDues.reduce((s, d) => s + d.amount, 0))}</span></div>` +
      state.dues.slice(0, 8).map((d) => `<div class="compact-item"><div><strong>${escapeHtml(d.title)}</strong><span>${escapeHtml(d.date || "-")}</span></div><span class="badge ${d.paid ? "paid" : "due"}">${formatMoney(d.amount)}</span></div>`).join("")
    : emptyState("No coaching dues recorded.");

  const bankRows = state.bankTx.filter((tx) => inRange(tx.date, range));
  const deposits = bankRows.filter((tx) => tx.direction === "deposit").reduce((s, tx) => s + tx.amount, 0);
  const withdrawals = bankRows.filter((tx) => tx.direction === "withdrawal").reduce((s, tx) => s + tx.amount, 0);
  els.reportBank.innerHTML =
    `<div class="dues-summary"><span class="badge paid">Deposits ${formatMoney(deposits)}</span><span class="badge due">Withdrawals ${formatMoney(withdrawals)}</span><span class="badge">Balance ${formatMoney(bankEnd)}</span></div>` +
    (bankRows.length ? bankRows.slice(0, 8).map((tx) => `<div class="compact-item"><div><strong>${tx.direction === "deposit" ? "Deposit" : "Withdrawal"} · ${formatMoney(tx.amount)}</strong><span>${escapeHtml(tx.date || "")}${tx.note ? " · " + escapeHtml(tx.note) : ""}</span></div></div>`).join("") : emptyState("No bank activity in this period."));
}

document.querySelectorAll("[data-report-period]").forEach((button) => {
  button.addEventListener("click", () => {
    reportPeriod = button.dataset.reportPeriod;
    document.querySelectorAll("[data-report-period]").forEach((item) => item.classList.toggle("active", item === button));
    els.reportPeriodDate.hidden = reportPeriod !== "day" && reportPeriod !== "week";
    els.reportPeriodMonth.hidden = reportPeriod !== "month";
    els.reportPeriodYear.hidden = reportPeriod !== "year";
    renderReports();
  });
});
els.reportPeriodDate.addEventListener("change", renderReports);
els.reportPeriodMonth.addEventListener("change", renderReports);
els.reportPeriodYear.addEventListener("change", renderReports);

const IDEA_LABELS = ["New", "Approve", "Planning", "On Going", "Completed"];

function renderIdeaChips() {
  const counts = { All: state.ideas.length };
  for (const label of IDEA_LABELS) counts[label] = state.ideas.filter((idea) => idea.label === label).length;
  const chips = ["All", ...IDEA_LABELS];
  els.ideaLabelChips.innerHTML = chips.map((label) => `<button type="button" class="year-chip${ideaFilter === label ? " active" : ""}" data-idea-filter="${label}" aria-pressed="${ideaFilter === label}">${label} (${counts[label] ?? 0})</button>`).join("");
  els.ideaLabelChips.querySelectorAll("[data-idea-filter]").forEach((chip) => chip.addEventListener("click", () => {
    ideaFilter = chip.dataset.ideaFilter;
    renderIdeaChips();
    renderIdeas();
  }));
}

function renderIdeas() {
  if (!canView("ideas")) return;
  renderIdeaChips();
  const rows = ideaFilter === "All" ? state.ideas : state.ideas.filter((idea) => idea.label === ideaFilter);
  els.ideaCards.innerHTML = rows.length
    ? rows.map((idea) => {
        const labelControl = isAdmin()
          ? `<label class="idea-label-select"><span class="sr-only">Label</span><select data-idea-label="${idea.id}">${IDEA_LABELS.map((label) => `<option value="${label}"${idea.label === label ? " selected" : ""}>${label}</option>`).join("")}</select></label>`
          : `<span class="badge ${idea.label === "New" ? "due" : "paid"}">${escapeHtml(idea.label)}</span>`;
        return `<article class="idea-card">
          <div class="idea-card-head"><strong>${escapeHtml(idea.title)}</strong>${labelControl}</div>
          <p>${escapeHtml(idea.idea)}</p>
          <div class="idea-card-foot">
            <span>${escapeHtml(idea.createdBy || "—")} · ${escapeHtml(new Date(idea.createdAt).toLocaleDateString("en-GB"))}</span>
            ${isAdmin() ? `<button type="button" class="small-btn" data-delete-idea="${idea.id}">${t("del")}</button>` : ""}
          </div>
        </article>`;
      }).join("")
    : emptyState("No ideas yet — add the first one.");
}

els.ideaForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const title = els.ideaName.value.trim();
  const body = els.ideaBody.value.trim();
  if (!title || !body) return;
  const { error } = await sb.from("ideas").insert({ title, idea: body, label: "New", created_by: currentUser?.id || null });
  if (error) { fail(error); return; }
  els.ideaForm.reset();
  toast("Idea added.");
  logActivity("Idea added", title);
  await db.loadIdeas();
  renderIdeas();
});

document.addEventListener("change", async (event) => {
  const select = event.target.closest("[data-idea-label]");
  if (!select) return;
  const { error } = await sb.from("ideas").update({ label: select.value }).eq("id", select.dataset.ideaLabel);
  if (error) { fail(error); return; }
  toast("Label updated.");
  await db.loadIdeas();
  renderIdeas();
});

document.addEventListener("click", async (event) => {
  const button = event.target.closest("[data-delete-idea]");
  if (!button) return;
  const idea = state.ideas.find((item) => item.id === button.dataset.deleteIdea);
  if (!idea || !confirmDelete(`Delete idea "${idea.title}"?`)) return;
  const { error } = await sb.from("ideas").delete().eq("id", idea.id);
  if (error) { fail(error); return; }
  toast("Idea deleted.");
  await db.loadIdeas();
  renderIdeas();
});

function renderMoreLinks() {
  document.querySelectorAll("[data-home-view]").forEach((button) => { button.hidden = !canView(button.dataset.homeView); });
  const views = MORE_VIEWS.filter((view) => canView(view));
  els.moreLinks.innerHTML = views.map((view) => `<button class="secondary-btn" type="button" data-more-view="${view}">${escapeHtml(viewTitle(view))}</button>`).join("");
  els.moreLinks.querySelectorAll("[data-more-view]").forEach((button) => button.addEventListener("click", () => switchView(button.dataset.moreView, viewTitle(button.dataset.moreView))));
  if (currentUser) {
    els.accountBox.innerHTML = `
      <div class="account-row">
        <div class="student-avatar" aria-hidden="true">${escapeHtml(currentUser.username.charAt(0).toUpperCase())}</div>
        <div><strong>${escapeHtml(currentUser.username)}</strong><span>${escapeHtml(roleLabel(currentUser.role))}</span></div>
      </div>
      <button id="moreLogoutBtn" class="danger-btn" type="button">Logout</button>`;
    document.getElementById("moreLogoutBtn")?.addEventListener("click", doLogout);
  }
}

function renderAll() {
  applyBrand();
  renderToday();
  renderStudentOptions();
  renderStudentCourseBox();
  renderOfferingForm();
  renderBatches();
  renderStudents();
  renderCourses();
  renderCourseSubjectsBox(els.courseSubjectsWrap.hidden ? [] : selectedCourseSubjects());
  renderOfferings();
  renderAttendanceClasses();
  renderFees();
  renderMoney();
  renderBank();
  renderDues();
  renderPayroll();
  renderSettings();
  renderUsers();
  renderActivity();
  renderDashboard();
  renderCharts();
  renderReminders();
  renderReports();
  renderIdeas();
  renderMoreLinks();
  renderTrash();
}

/* ================= boot ================= */

async function boot() {
  const online = typeof supabase !== "undefined" && typeof sb?.auth?.getSession === "function";
  if (!online) {
    applyLang();
    showLogin();
    els.loginError.textContent = t("msgCdnFail");
    els.loginError.hidden = false;
    return;
  }
  els.bootOverlay.hidden = false;
  applyLang();
  resetUserForm();
  resetOfferingForm();
  try {
    const ok = await loadCurrentUserAndData();
    if (ok) {
      enterApp();
    } else {
      renderAll();
      showLogin();
    }
  } catch (err) {
    console.error(err);
    renderAll();
    showLogin();
    toast(err?.message || t("msgCdnFail"));
  } finally {
    els.bootOverlay.hidden = true;
  }
}

boot();
