const STORAGE_KEY = "coachingCenterMvpData";
const SESSION_KEY = "ccmSession";

const today = new Date().toISOString().slice(0, 10);
const thisMonth = today.slice(0, 7);

const SUPER_ADMIN_USER = "zoshim";
const SUPER_ADMIN_PASS_HASH = "h89s63q";

const ALL_TABS = [
  { id: "dashboard", label: "ড্যাশবোর্ড" },
  { id: "students", label: "শিক্ষার্থী" },
  { id: "batches", label: "ব্যাচ" },
  { id: "courses", label: "কোর্স ও প্যাকেজ" },
  { id: "attendance", label: "হাজিরা" },
  { id: "fees", label: "ফি" },
  { id: "money", label: "হিসাব" },
  { id: "mybatch", label: "আমার ব্যাচ" },
];

const ROLE_LABELS = {
  admin: "অ্যাডমিন",
  editor: "এডিটর",
  viewer: "ভিউয়ার",
  accountant: "হিসাবরক্ষক",
  student: "শিক্ষার্থী",
};

const ROLE_DEFAULTS = {
  admin: { tabs: ["dashboard", "students", "batches", "courses", "attendance", "fees", "money"], moneyEdit: true },
  editor: { tabs: ["dashboard", "students", "batches", "courses", "attendance", "fees"], moneyEdit: false },
  viewer: { tabs: ["dashboard", "students", "batches", "courses", "attendance", "fees", "money"], moneyEdit: false },
  accountant: { tabs: ["dashboard", "money"], moneyEdit: true },
  student: { tabs: ["mybatch"], moneyEdit: false },
};

const VIEW_TITLES = {
  dashboard: "ড্যাশবোর্ড",
  students: "শিক্ষার্থী",
  batches: "ব্যাচ",
  courses: "কোর্স ও প্যাকেজ",
  attendance: "হাজিরা",
  fees: "ফি",
  money: "হিসাব",
  users: "ইউজার",
  activity: "হিস্ট্রি",
  mybatch: "আমার ব্যাচ",
};

const state = loadState();
let editingStudentId = null;
let editingBatchId = null;
let editingCourseId = null;
let editingUserId = null;
let currentUser = getSessionUser();

const els = {
  loginView: document.getElementById("loginView"),
  loginForm: document.getElementById("loginForm"),
  loginUser: document.getElementById("loginUser"),
  loginPass: document.getElementById("loginPass"),
  loginError: document.getElementById("loginError"),
  appShell: document.getElementById("appShell"),
  userBadge: document.getElementById("userBadge"),
  logoutBtn: document.getElementById("logoutBtn"),
  adminTools: document.getElementById("adminTools"),
  mainNav: document.getElementById("mainNav"),
  menuToggle: document.getElementById("menuToggle"),
  sidebar: document.getElementById("sidebar"),
  adminToolsToggle: document.getElementById("adminToolsToggle"),
  adminToolsBody: document.getElementById("adminToolsBody"),
  pageTitle: document.getElementById("pageTitle"),
  todayLabel: document.getElementById("todayLabel"),
  metricStudents: document.getElementById("metricStudents"),
  metricBatches: document.getElementById("metricBatches"),
  metricPresent: document.getElementById("metricPresent"),
  metricDue: document.getElementById("metricDue"),
  chartBatches: document.getElementById("chartBatches"),
  chartFees: document.getElementById("chartFees"),
  recentStudents: document.getElementById("recentStudents"),
  feeSummary: document.getElementById("feeSummary"),
  attendanceSummary: document.getElementById("attendanceSummary"),
  studentForm: document.getElementById("studentForm"),
  studentFormTitle: document.getElementById("studentFormTitle"),
  studentSubmitBtn: document.getElementById("studentSubmitBtn"),
  studentCancelBtn: document.getElementById("studentCancelBtn"),
  studentName: document.getElementById("studentName"),
  studentPhone: document.getElementById("studentPhone"),
  guardianName: document.getElementById("guardianName"),
  guardianPhone: document.getElementById("guardianPhone"),
  whatsappNumber: document.getElementById("whatsappNumber"),
  collegeName: document.getElementById("collegeName"),
  studentBatch: document.getElementById("studentBatch"),
  studentCourse: document.getElementById("studentCourse"),
  studentFee: document.getElementById("studentFee"),
  studentRows: document.getElementById("studentRows"),
  studentSearch: document.getElementById("studentSearch"),
  batchForm: document.getElementById("batchForm"),
  batchFormTitle: document.getElementById("batchFormTitle"),
  batchSubmitBtn: document.getElementById("batchSubmitBtn"),
  batchCancelBtn: document.getElementById("batchCancelBtn"),
  batchName: document.getElementById("batchName"),
  batchTeacher: document.getElementById("batchTeacher"),
  batchSchedule: document.getElementById("batchSchedule"),
  batchCards: document.getElementById("batchCards"),
  courseForm: document.getElementById("courseForm"),
  courseFormTitle: document.getElementById("courseFormTitle"),
  courseSubmitBtn: document.getElementById("courseSubmitBtn"),
  courseCancelBtn: document.getElementById("courseCancelBtn"),
  courseName: document.getElementById("courseName"),
  courseType: document.getElementById("courseType"),
  courseFee: document.getElementById("courseFee"),
  courseDuration: document.getElementById("courseDuration"),
  courseCards: document.getElementById("courseCards"),
  courseFilter: document.getElementById("courseFilter"),
  attendanceDate: document.getElementById("attendanceDate"),
  attendanceBatch: document.getElementById("attendanceBatch"),
  attendanceList: document.getElementById("attendanceList"),
  attendanceActions: document.getElementById("attendanceActions"),
  markAllPresentBtn: document.getElementById("markAllPresentBtn"),
  clearDayBtn: document.getElementById("clearDayBtn"),
  feeRows: document.getElementById("feeRows"),
  feeFilter: document.getElementById("feeFilter"),
  paymentHistory: document.getElementById("paymentHistory"),
  metricIncome: document.getElementById("metricIncome"),
  metricCost: document.getElementById("metricCost"),
  metricBalance: document.getElementById("metricBalance"),
  metricMonthNet: document.getElementById("metricMonthNet"),
  moneyForm: document.getElementById("moneyForm"),
  moneyDate: document.getElementById("moneyDate"),
  moneyType: document.getElementById("moneyType"),
  moneyCategory: document.getElementById("moneyCategory"),
  moneyAmount: document.getElementById("moneyAmount"),
  moneyNote: document.getElementById("moneyNote"),
  moneyRows: document.getElementById("moneyRows"),
  moneyFilter: document.getElementById("moneyFilter"),
  userForm: document.getElementById("userForm"),
  userFormTitle: document.getElementById("userFormTitle"),
  userSubmitBtn: document.getElementById("userSubmitBtn"),
  userCancelBtn: document.getElementById("userCancelBtn"),
  userName: document.getElementById("userName"),
  userPass: document.getElementById("userPass"),
  userRole: document.getElementById("userRole"),
  userTabsBox: document.getElementById("userTabsBox"),
  userMoneyEdit: document.getElementById("userMoneyEdit"),
  userStudent: document.getElementById("userStudent"),
  linkStudentWrap: document.getElementById("linkStudentWrap"),
  userRows: document.getElementById("userRows"),
  myBatchCard: document.getElementById("myBatchCard"),
  activityRows: document.getElementById("activityRows"),
  activityUser: document.getElementById("activityUser"),
  activitySearch: document.getElementById("activitySearch"),
  seedDataBtn: document.getElementById("seedDataBtn"),
  exportDataBtn: document.getElementById("exportDataBtn"),
  importFileInput: document.getElementById("importFileInput"),
  clearDataBtn: document.getElementById("clearDataBtn"),
  toast: document.getElementById("toast"),
};

els.todayLabel.textContent = new Date().toLocaleDateString("bn-BD", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
});
els.attendanceDate.value = today;
els.moneyDate.value = today;

function hashPass(str) {
  let h = 5381;
  for (let i = 0; i < str.length; i++) h = ((h << 5) + h + str.charCodeAt(i)) >>> 0;
  return "h" + h.toString(36);
}

function getSessionUser() {
  try {
    const id = sessionStorage.getItem(SESSION_KEY);
    if (!id) return null;
    return state.users.find((u) => u.id === id) || null;
  } catch {
    return null;
  }
}

function setSession(id) {
  try {
    if (id) sessionStorage.setItem(SESSION_KEY, id);
    else sessionStorage.removeItem(SESSION_KEY);
  } catch { /* ignore */ }
}

els.loginForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const username = els.loginUser.value.trim().toLowerCase();
  const pass = els.loginPass.value;
  const user = state.users.find((u) => u.username === username);
  if (!user || user.passHash !== hashPass(pass)) {
    els.loginError.textContent = "ইউজারনেম বা পাসওয়ার্ড ভুল হয়েছে।";
    els.loginError.hidden = false;
    return;
  }
  els.loginError.hidden = true;
  els.loginForm.reset();
  currentUser = user;
  setSession(user.id);
  enterApp();
  logActivity("লগইন", "লগইন করলো");
  saveAndRender();
  toast(`স্বাগতম, ${user.username}!`);
});

els.logoutBtn.addEventListener("click", () => {
  currentUser = null;
  setSession(null);
  showLogin();
});

function isMobileMenu() {
  return window.matchMedia("(max-width: 940px)").matches;
}

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

els.menuToggle.addEventListener("click", () => {
  if (els.sidebar.classList.contains("open")) closeSidebar();
  else openSidebar();
});

els.adminToolsToggle.addEventListener("click", () => {
  const open = els.adminToolsBody.hidden;
  els.adminToolsBody.hidden = !open;
  els.adminToolsToggle.setAttribute("aria-expanded", String(open));
});

function showLogin() {
  els.loginView.hidden = false;
  els.appShell.hidden = true;
}

function enterApp() {
  els.loginView.hidden = true;
  els.appShell.hidden = false;
  applyPermissions();
  saveAndRender();
}

function isAdmin() {
  return currentUser && currentUser.role === "admin";
}

function roleLabel(role) {
  return ROLE_LABELS[role] || role;
}

function canView(tab) {
  if (!currentUser) return false;
  if (isAdmin()) return true;
  if (tab === "users" || tab === "activity") return false;
  return (currentUser.tabs || []).includes(tab);
}

function canEditTab(tab) {
  if (!currentUser) return false;
  if (isAdmin()) return true;
  if (currentUser.role === "viewer" || currentUser.role === "student") return false;
  if (tab === "money") return !!currentUser.moneyEdit;
  if (tab === "users") return false;
  if (currentUser.role === "accountant") return false;
  return (currentUser.tabs || []).includes(tab);
}

function applyPermissions() {
  document.querySelectorAll("#mainNav .nav-tab").forEach((tab) => {
    const view = tab.dataset.view;
    const show = view === "users" || view === "activity" ? isAdmin() : canView(view);
    tab.style.display = show ? "" : "none";
  });
  els.adminTools.style.display = isAdmin() ? "" : "none";
  els.userBadge.innerHTML = currentUser
    ? `<strong>${escapeHtml(currentUser.username)}</strong><span>${escapeHtml(roleLabel(currentUser.role))}</span>`
    : "";

  const first = ["dashboard", "students", "batches", "courses", "attendance", "fees", "money", "users", "activity", "mybatch"]
    .find((v) => (v === "users" || v === "activity" ? isAdmin() : canView(v))) || "mybatch";
  switchView(first, VIEW_TITLES[first] || first);

  setFormEditable(els.studentForm, canEditTab("students"));
  setFormEditable(els.batchForm, canEditTab("batches"));
  setFormEditable(els.courseForm, canEditTab("courses"));
  setFormEditable(els.moneyForm, canEditTab("money"));
  els.attendanceActions.style.display = canEditTab("attendance") ? "" : "none";
}

function setFormEditable(form, editable) {
  form.style.display = editable ? "" : "none";
}

function switchView(viewId, title) {
  if (currentUser && viewId !== "users" && viewId !== "activity" && !canView(viewId)) {
    toast("এই পেজ দেখার অনুমতি নেই।");
    return;
  }
  if ((viewId === "users" || viewId === "activity") && !isAdmin()) {
    toast("শুধু অ্যাডমিন দেখতে পারবে।");
    return;
  }
  document.querySelectorAll(".nav-tab").forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.view === viewId);
  });
  document.querySelectorAll(".view").forEach((view) => {
    view.classList.toggle("active-view", view.id === viewId);
  });
  els.pageTitle.textContent = title;
  if (isMobileMenu()) closeSidebar();
  const content = document.querySelector(".content");
  if (content) content.scrollIntoView({ block: "start" });
}

document.querySelectorAll(".nav-tab").forEach((tab) => {
  tab.addEventListener("click", () => switchView(tab.dataset.view, tab.textContent));
});

function requireEdit(tab) {
  if (!canEditTab(tab)) {
    toast("এডিট করার অনুমতি নেই।");
    return false;
  }
  return true;
}

els.studentForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!requireEdit("students")) return;
  const name = els.studentName.value.trim();
  if (!name) {
    toast("শিক্ষার্থীর নাম লিখো।");
    els.studentName.focus();
    return;
  }
  const fee = Number(els.studentFee.value === "" ? 0 : els.studentFee.value);
  if (Number.isNaN(fee) || fee < 0) {
    toast("মাসিক ফি ০ বা তার বেশি হতে হবে।");
    return;
  }

  if (editingStudentId) {
    const student = state.students.find((item) => item.id === editingStudentId);
    if (student) {
      student.name = name;
      student.phone = els.studentPhone.value.trim();
      student.guardian = els.guardianName.value.trim();
      student.guardianPhone = els.guardianPhone.value.trim();
      student.whatsapp = els.whatsappNumber.value.trim();
      student.college = els.collegeName.value.trim();
      student.batchId = els.studentBatch.value;
      student.courseId = els.studentCourse.value;
      student.monthlyFee = fee;
    }
    toast("শিক্ষার্থী আপডেট হয়েছে।");
    logActivity("শিক্ষার্থী এডিট", name);
  } else {
    state.students.unshift({
      id: crypto.randomUUID(),
      name,
      phone: els.studentPhone.value.trim(),
      guardian: els.guardianName.value.trim(),
      guardianPhone: els.guardianPhone.value.trim(),
      whatsapp: els.whatsappNumber.value.trim(),
      college: els.collegeName.value.trim(),
      batchId: els.studentBatch.value,
      courseId: els.studentCourse.value,
      monthlyFee: fee,
      paid: 0,
      createdAt: Date.now(),
    });
    toast("নতুন শিক্ষার্থী যোগ হয়েছে।");
    logActivity("শিক্ষার্থী যোগ", name);
  }
  resetStudentForm();
  saveAndRender();
});

els.studentCancelBtn.addEventListener("click", resetStudentForm);

els.batchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!requireEdit("batches")) return;
  const name = els.batchName.value.trim();
  if (!name) {
    toast("ব্যাচের নাম লিখো।");
    els.batchName.focus();
    return;
  }

  if (editingBatchId) {
    const batch = state.batches.find((item) => item.id === editingBatchId);
    if (batch) {
      batch.name = name;
      batch.teacher = els.batchTeacher.value.trim();
      batch.schedule = els.batchSchedule.value.trim();
    }
    toast("ব্যাচ আপডেট হয়েছে।");
    logActivity("ব্যাচ এডিট", name);
  } else {
    state.batches.unshift({
      id: crypto.randomUUID(),
      name,
      teacher: els.batchTeacher.value.trim(),
      schedule: els.batchSchedule.value.trim(),
      createdAt: Date.now(),
    });
    toast("নতুন ব্যাচ খোলা হয়েছে।");
    logActivity("ব্যাচ তৈরি", name);
  }
  resetBatchForm();
  saveAndRender();
});

els.batchCancelBtn.addEventListener("click", resetBatchForm);

els.courseForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!requireEdit("courses")) return;
  const name = els.courseName.value.trim();
  if (!name) {
    toast("কোর্স / প্যাকেজের নাম লিখো।");
    els.courseName.focus();
    return;
  }
  const fee = Number(els.courseFee.value === "" ? 0 : els.courseFee.value);
  if (Number.isNaN(fee) || fee < 0) {
    toast("ফি ০ বা তার বেশি হতে হবে।");
    return;
  }

  if (editingCourseId) {
    const course = state.courses.find((item) => item.id === editingCourseId);
    if (course) {
      course.name = name;
      course.type = els.courseType.value;
      course.fee = fee;
      course.duration = els.courseDuration.value.trim();
    }
    toast("কোর্স / প্যাকেজ আপডেট হয়েছে।");
    logActivity("কোর্স এডিট", name);
  } else {
    state.courses.unshift({
      id: crypto.randomUUID(),
      name,
      type: els.courseType.value,
      fee,
      duration: els.courseDuration.value.trim(),
      createdAt: Date.now(),
    });
    toast("নতুন কোর্স / প্যাকেজ যোগ হয়েছে।");
    logActivity("কোর্স তৈরি", name);
  }
  resetCourseForm();
  saveAndRender();
});

els.courseCancelBtn.addEventListener("click", resetCourseForm);
els.courseFilter.addEventListener("change", renderCourses);

els.studentSearch.addEventListener("input", renderStudents);
els.activitySearch.addEventListener("input", renderActivity);
els.activityUser.addEventListener("change", renderActivity);
els.attendanceDate.addEventListener("change", renderAttendance);
els.attendanceBatch.addEventListener("change", renderAttendance);
els.feeFilter.addEventListener("change", renderFees);
els.moneyFilter.addEventListener("change", renderMoney);

els.markAllPresentBtn.addEventListener("click", () => {
  if (!requireEdit("attendance")) return;
  const date = els.attendanceDate.value || today;
  const visible = visibleAttendanceStudents();
  if (!visible.length) {
    toast("এই লিস্টে কোনো শিক্ষার্থী নেই।");
    return;
  }
  state.attendance[date] ||= {};
  visible.forEach((student) => {
    state.attendance[date][student.id] = "present";
  });
  toast(`${visible.length} জনকে উপস্থিত দেওয়া হয়েছে।`);
  saveAndRender();
});

els.clearDayBtn.addEventListener("click", () => {
  if (!requireEdit("attendance")) return;
  const date = els.attendanceDate.value || today;
  if (!state.attendance[date]) {
    toast("এই তারিখে কিছু সেভ নেই।");
    return;
  }
  if (!confirm(`${date} তারিখের হাজিরা মুছে যাবে?`)) return;
  delete state.attendance[date];
  toast("দিনের হাজিরা মুছে দেওয়া হয়েছে।");
  saveAndRender();
});

els.moneyForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!requireEdit("money")) return;
  const amount = Number(els.moneyAmount.value);
  if (!Number.isFinite(amount) || amount <= 0) {
    toast("০-এর বেশি টাকা লিখো।");
    return;
  }
  const entryTypeLabel = els.moneyType.value === "income" ? "আয়" : "খরচ";
  const entryCat = els.moneyCategory.value.trim() || "জেনারেল";
  state.money.unshift({
    id: crypto.randomUUID(),
    date: els.moneyDate.value || today,
    type: els.moneyType.value,
    category: entryCat,
    amount,
    note: els.moneyNote.value.trim(),
    by: currentUser ? currentUser.username : "unknown",
    createdAt: Date.now(),
  });
  els.moneyForm.reset();
  els.moneyDate.value = today;
  toast("এন্ট্রি সেভ হয়েছে।");
  logActivity("হিসাব এন্ট্রি", `${entryTypeLabel} — ${entryCat} — ${formatMoney(amount)}`);
  saveAndRender();
});

function renderUserTabsBox(selected) {
  els.userTabsBox.innerHTML = ALL_TABS.map((tab) => `
    <label class="check-line">
      <input type="checkbox" value="${tab.id}" ${selected.includes(tab.id) ? "checked" : ""} /> ${tab.label}
    </label>
  `).join("");
}

function selectedTabs() {
  return [...els.userTabsBox.querySelectorAll("input:checked")].map((c) => c.value);
}

els.userRole.addEventListener("change", () => {
  const preset = ROLE_DEFAULTS[els.userRole.value] || ROLE_DEFAULTS.viewer;
  renderUserTabsBox(preset.tabs);
  els.userMoneyEdit.checked = preset.moneyEdit;
  els.linkStudentWrap.style.display = els.userRole.value === "student" ? "" : "none";
});

els.userForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!isAdmin()) {
    toast("শুধু অ্যাডমিন ইউজার ম্যানেজ করতে পারবে।");
    return;
  }
  if (currentUser.username !== SUPER_ADMIN_USER) {
    toast("শুধু সুপার অ্যাডমিন ইউজার বানাতে পারবে।");
    return;
  }
  const username = els.userName.value.trim().toLowerCase();
  const pass = els.userPass.value;
  if (!username) {
    toast("ইউজারনেম লিখো।");
    return;
  }
  if (!editingUserId) {
    if (state.users.some((u) => u.username === username)) {
      toast("এই ইউজারনেম আগে থেকে আছে।");
      return;
    }
    if (!pass || pass.length < 4) {
      toast("পাসওয়ার্ড কম হলেও ৪ অক্ষর হতে হবে।");
      return;
    }
  }
  const tabs = selectedTabs();
  const role = els.userRole.value;
  if (role === "admin") {
    toast("অ্যাডমিন শুধু একজনই — সুপার অ্যাডমিন।");
    return;
  }
  if (role === "student" && !els.userStudent.value) {
    toast("শিক্ষার্থী রোলের জন্য শিক্ষার্থী লিংক করো।");
    return;
  }

  if (editingUserId) {
    const user = state.users.find((u) => u.id === editingUserId);
    if (user) {
      user.username = username;
      if (pass) user.passHash = hashPass(pass);
      user.role = role;
      user.tabs = role === "admin" ? ROLE_DEFAULTS.admin.tabs : tabs;
      user.moneyEdit = els.userMoneyEdit.checked;
      user.studentId = role === "student" ? els.userStudent.value : "";
      if (currentUser && user.id === currentUser.id) currentUser = user;
    }
    toast("ইউজার আপডেট হয়েছে।");
    logActivity("ইউজার এডিট", username);
  } else {
    state.users.push({
      id: crypto.randomUUID(),
      username,
      passHash: hashPass(pass),
      role,
      tabs: role === "admin" ? [...ROLE_DEFAULTS.admin.tabs] : tabs,
      moneyEdit: els.userMoneyEdit.checked,
      studentId: role === "student" ? els.userStudent.value : "",
      createdAt: Date.now(),
    });
    toast(`"${username}" ইউজার তৈরি হয়েছে।`);
    logActivity("ইউজার তৈরি", `${username} — ${roleLabel(role)}`);
  }
  resetUserForm();
  saveAndRender();
});

els.userCancelBtn.addEventListener("click", resetUserForm);

function resetUserForm() {
  editingUserId = null;
  els.userForm.reset();
  els.userRole.value = "editor";
  renderUserTabsBox(ROLE_DEFAULTS.editor.tabs);
  els.userMoneyEdit.checked = false;
  els.linkStudentWrap.style.display = "none";
  els.userFormTitle.textContent = "নতুন ইউজার";
  els.userSubmitBtn.textContent = "ইউজার বানাও";
  els.userCancelBtn.hidden = true;
  els.userPass.required = true;
  els.userPass.placeholder = "কম হলেও ৪ অক্ষর";
}

els.seedDataBtn.addEventListener("click", () => {
  if (!isAdmin()) return;
  state.batches = [
    { id: "batch-math-9", name: "৯ম শ্রেণি গণিত", teacher: "রহমান স্যার", schedule: "রবি, মঙ্গল, বৃহস্পতি - বিকাল ৫টা", createdAt: Date.now() - 3 },
    { id: "batch-english-10", name: "১০ম শ্রেণি ইংরেজি", teacher: "করিম ম্যাডাম", schedule: "সোম, বুধ - সন্ধ্যা ৬টা", createdAt: Date.now() - 2 },
  ];
  state.courses = [
    { id: "course-phy", name: "এইচএসসি ফিজিক্স", type: "subject", fee: 2000, duration: "৩ মাস, সপ্তাহে ৩ দিন", createdAt: Date.now() - 3 },
    { id: "course-hsc-pack", name: "এইচএসসি বিজ্ঞান প্যাকেজ", type: "package", fee: 5000, duration: "ফিজিক্স + কেমিস্ট্রি + ম্যাথ", createdAt: Date.now() - 2 },
  ];
  state.students = [
    { id: "student-1", name: "ফারহান আহমেদ", phone: "01710000001", guardian: "এস. আহমেদ", guardianPhone: "01710000011", whatsapp: "01710000001", college: "ঢাকা কলেজ", batchId: "batch-math-9", courseId: "course-phy", monthlyFee: 3000, paid: 1500, createdAt: Date.now() - 4 },
    { id: "student-2", name: "নুসরাত জাহান", phone: "01710000002", guardian: "আর. জাহান", guardianPhone: "01710000012", whatsapp: "01710000002", college: "ভিকারুননিসা কলেজ", batchId: "batch-english-10", courseId: "course-hsc-pack", monthlyFee: 2800, paid: 2800, createdAt: Date.now() - 3 },
    { id: "student-3", name: "তানভীর হাসান", phone: "01710000003", guardian: "এম. হাসান", guardianPhone: "01710000013", whatsapp: "01710000003", college: "নটর ডেম কলেজ", batchId: "batch-math-9", courseId: "course-phy", monthlyFee: 3000, paid: 0, createdAt: Date.now() - 2 },
  ];
  state.attendance = { [today]: { "student-1": "present", "student-2": "present", "student-3": "absent" } };
  state.payments = [
    { id: crypto.randomUUID(), studentId: "student-1", amount: 1500, date: today, createdAt: Date.now() - 2 },
    { id: crypto.randomUUID(), studentId: "student-2", amount: 2800, date: today, createdAt: Date.now() - 1 },
  ];
  state.money = [
    { id: crypto.randomUUID(), date: today, type: "income", category: "ভর্তি ফি", amount: 15000, note: "জানুয়ারির আদায়", by: "admin", createdAt: Date.now() - 2 },
    { id: crypto.randomUUID(), date: today, type: "expense", category: "ঘর ভাড়া", amount: 8000, note: "", by: "admin", createdAt: Date.now() - 1 },
    { id: crypto.randomUUID(), date: today, type: "expense", category: "শিক্ষকের বেতন", amount: 5000, note: "", by: "admin", createdAt: Date.now() - 1 },
  ];
  ensureAdmin();
  editingStudentId = null;
  editingBatchId = null;
  resetStudentForm();
  resetBatchForm();
  toast("ডেমো ডেটা লোড হয়েছে।");
  saveAndRender();
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
  toast("ব্যাকআপ ডাউনলোড হয়েছে।");
});

els.importFileInput.addEventListener("change", () => {
  if (!isAdmin()) return;
  const file = els.importFileInput.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const parsed = JSON.parse(reader.result);
      if (!Array.isArray(parsed.students) || !Array.isArray(parsed.batches)) {
        toast("ব্যাকআপ ফাইল ঠিক নেই।");
        return;
      }
      state.students = parsed.students;
      state.batches = parsed.batches;
      state.courses = Array.isArray(parsed.courses) ? parsed.courses : [];
      state.attendance = parsed.attendance || {};
      state.payments = Array.isArray(parsed.payments) ? parsed.payments : [];
      state.money = Array.isArray(parsed.money) ? parsed.money : [];
      state.activity = Array.isArray(parsed.activity) ? parsed.activity : [];
      if (Array.isArray(parsed.users) && parsed.users.length) state.users = parsed.users;
      ensureAdmin();
      currentUser = state.users.find((u) => currentUser && u.id === currentUser.id) || currentUser;
      resetStudentForm();
      resetBatchForm();
      resetCourseForm();
      toast("ব্যাকআপ আপলোড হয়েছে।");
      logActivity("ব্যাকআপ আপলোড", file.name || "");
      saveAndRender();
    } catch {
      toast("ব্যাকআপ ফাইল পড়া যায়নি।");
    }
    els.importFileInput.value = "";
  };
  reader.readAsText(file);
});

els.clearDataBtn.addEventListener("click", () => {
  if (!isAdmin()) return;
  if (!confirm("সকল শিক্ষার্থী, ব্যাচ, কোর্স, হাজিরা, ফি আর হিসাব মুছে যাবে? (ইউজার থাকবে)")) return;
  state.students = [];
  state.batches = [];
  state.courses = [];
  state.attendance = {};
  state.payments = [];
  state.money = [];
  resetStudentForm();
  resetBatchForm();
  resetCourseForm();
  toast("সব ডেটা মুছে দেওয়া হয়েছে।");
  logActivity("সব ডেটা মুছলো", "Clear data");
  saveAndRender();
});

function ensureAdmin() {
  let superAdmin = state.users.find((u) => u.username === SUPER_ADMIN_USER);
  if (!superAdmin) {
    superAdmin = {
      id: crypto.randomUUID(),
      username: SUPER_ADMIN_USER,
      passHash: SUPER_ADMIN_PASS_HASH,
      role: "admin",
      tabs: [...ROLE_DEFAULTS.admin.tabs],
      moneyEdit: true,
      studentId: "",
      createdAt: Date.now(),
    };
    state.users.unshift(superAdmin);
  } else {
    superAdmin.role = "admin";
    superAdmin.passHash = SUPER_ADMIN_PASS_HASH;
    superAdmin.tabs = [...ROLE_DEFAULTS.admin.tabs];
    superAdmin.moneyEdit = true;
  }
  state.users.forEach((u) => {
    if (u.username !== SUPER_ADMIN_USER && u.role === "admin") {
      u.role = "editor";
      u.tabs = [...ROLE_DEFAULTS.editor.tabs];
    }
  });
}

function logActivity(action, detail) {
  state.activity.unshift({
    id: crypto.randomUUID(),
    user: currentUser ? currentUser.username : "অজানা",
    action,
    detail: detail || "",
    date: today,
    time: new Date().toLocaleTimeString("bn-BD", { hour: "2-digit", minute: "2-digit" }),
    createdAt: Date.now(),
  });
  if (state.activity.length > 500) state.activity.length = 500;
}

function loadState() {
  const fallback = { students: [], batches: [], courses: [], attendance: {}, payments: [], money: [], users: [], activity: [] };
  let parsed = null;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) parsed = JSON.parse(saved);
  } catch { /* ignore */ }
  return {
    students: parsed && Array.isArray(parsed.students) ? parsed.students : [],
    batches: parsed && Array.isArray(parsed.batches) ? parsed.batches : [],
    courses: parsed && Array.isArray(parsed.courses) ? parsed.courses : [],
    attendance: (parsed && parsed.attendance) || {},
    payments: parsed && Array.isArray(parsed.payments) ? parsed.payments : [],
    money: parsed && Array.isArray(parsed.money) ? parsed.money : [],
    users: parsed && Array.isArray(parsed.users) ? parsed.users : [],
    activity: parsed && Array.isArray(parsed.activity) ? parsed.activity : [],
  };
}

function saveAndRender() {
  ensureAdmin();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  renderAll();
}

function renderAll() {
  renderBatchOptions();
  renderCourseOptions();
  renderUserStudentOptions();
  renderDashboard();
  renderCharts();
  renderStudents();
  renderBatches();
  renderCourses();
  renderAttendance();
  renderFees();
  renderMoney();
  renderUsers();
  renderActivity();
  renderMyBatch();
}

function renderBatchOptions() {
  const prevStudent = els.studentBatch.value;
  const prevAtt = els.attendanceBatch.value || "all";
  els.studentBatch.innerHTML = [
    '<option value="">কোনো ব্যাচ নেই</option>',
    ...state.batches.map((batch) => `<option value="${batch.id}">${escapeHtml(batch.name)}</option>`),
  ].join("");
  if (editingStudentId) {
    const student = state.students.find((item) => item.id === editingStudentId);
    els.studentBatch.value = student ? student.batchId : prevStudent;
  } else {
    els.studentBatch.value = state.batches.some((b) => b.id === prevStudent) ? prevStudent : "";
  }
  els.attendanceBatch.innerHTML = [
    '<option value="all">সব ব্যাচ</option>',
    ...state.batches.map((batch) => `<option value="${batch.id}">${escapeHtml(batch.name)}</option>`),
  ].join("");
  els.attendanceBatch.value = prevAtt === "all" || state.batches.some((b) => b.id === prevAtt) ? prevAtt : "all";
}

function renderCourseOptions() {
  const prev = editingStudentId
    ? (state.students.find((s) => s.id === editingStudentId)?.courseId || "")
    : els.studentCourse.value;
  els.studentCourse.innerHTML = [
    '<option value="">কোনো কোর্স নেই</option>',
    ...state.courses.map((c) => `<option value="${c.id}">${escapeHtml(c.name)}${c.type === "package" ? " (প্যাকেজ)" : ""}</option>`),
  ].join("");
  els.studentCourse.value = state.courses.some((c) => c.id === prev) ? prev : "";
}

function courseTypeLabel(type) {
  return type === "package" ? "প্যাকেজ" : "সাবজেক্ট";
}

function getCourseName(courseId) {
  return state.courses.find((c) => c.id === courseId)?.name || "—";
}

function renderUserStudentOptions() {
  els.userStudent.innerHTML = [
    '<option value="">শিক্ষার্থী বাছো</option>',
    ...state.students.map((s) => `<option value="${s.id}">${escapeHtml(s.name)}</option>`),
  ].join("");
}

function renderDashboard() {
  const todayAttendance = state.attendance[today] || {};
  const presentCount = Object.values(todayAttendance).filter((s) => s === "present").length;
  const absentCount = Object.values(todayAttendance).filter((s) => s === "absent").length;
  const totalDue = state.students.reduce((sum, s) => sum + feeDue(s), 0);

  els.metricStudents.textContent = toBnNumber(state.students.length);
  els.metricBatches.textContent = toBnNumber(state.batches.length);
  els.metricPresent.textContent = toBnNumber(presentCount);
  els.metricDue.textContent = formatMoney(totalDue);

  els.recentStudents.innerHTML = state.students.length
    ? state.students.slice(0, 5).map((s) => `
      <div class="compact-item">
        <div><strong>${escapeHtml(s.name)}</strong><span>${escapeHtml(getBatchName(s.batchId))}</span></div>
        <span>${escapeHtml(s.phone || "মোবাইল নেই")}</span>
      </div>`).join("")
    : emptyState("এখনো কোনো শিক্ষার্থী নেই।");

  const paid = state.students.filter((s) => feeDue(s) <= 0).length;
  const due = state.students.length - paid;
  els.feeSummary.innerHTML = `
    <div class="compact-item"><div><strong>${toBnNumber(paid)}</strong><span>পুরো ফি দিয়েছে</span></div><span class="badge paid">পরিশোধ</span></div>
    <div class="compact-item"><div><strong>${toBnNumber(due)}</strong><span>বকেয়া ফি আছে</span></div><span class="badge due">বকেয়া</span></div>`;

  els.attendanceSummary.innerHTML = `
    <div class="compact-item"><div><strong>${toBnNumber(presentCount)}</strong><span>আজকে উপস্থিত</span></div><span class="badge paid">উপস্থিত</span></div>
    <div class="compact-item"><div><strong>${toBnNumber(absentCount)}</strong><span>আজকে অনুপস্থিত</span></div><span class="badge due">অনুপস্থিত</span></div>`;
}

function barRow(label, value, max, money) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return `
    <div class="bar-row">
      <span class="bar-label">${escapeHtml(label)}</span>
      <div class="bar-track"><div class="bar-fill" style="width:${pct}%"></div></div>
      <strong class="bar-value">${money ? formatMoney(value) : toBnNumber(value)}</strong>
    </div>`;
}

function renderCharts() {
  const counts = state.batches.map((b) => ({
    name: b.name,
    count: state.students.filter((s) => s.batchId === b.id).length,
  }));
  const maxCount = Math.max(1, ...counts.map((c) => c.count));
  els.chartBatches.innerHTML = counts.length
    ? counts.map((c) => barRow(c.name, c.count, maxCount, false)).join("")
    : emptyState("এখনো ব্যাচ নেই।");

  const collected = state.students.reduce((sum, s) => sum + Number(s.paid || 0), 0);
  const due = state.students.reduce((sum, s) => sum + feeDue(s), 0);
  const maxFee = Math.max(1, collected, due);
  els.chartFees.innerHTML = `
    ${barRow("আদায়", collected, maxFee, true)}
    ${barRow("বকেয়া", due, maxFee, true)}`;
}

function renderStudents() {
  const editable = canEditTab("students");
  const query = els.studentSearch.value.trim().toLowerCase();
  const students = state.students.filter((s) =>
    [s.name, s.phone, s.guardian, s.guardianPhone, s.whatsapp, s.college, getBatchName(s.batchId), getCourseName(s.courseId)].join(" ").toLowerCase().includes(query));

  els.studentRows.innerHTML = students.length
    ? students.map((s) => {
        const waLink = s.whatsapp ? ` <a class="wa-link" href="https://wa.me/88${escapeHtml(s.whatsapp.replace(/\D/g, ""))}" target="_blank" rel="noopener">হোয়াটসঅ্যাপ</a>` : "";
        return `
      <tr>
        <td><strong>${escapeHtml(s.name)}</strong><br><span>${escapeHtml(s.guardian || "অভিভাবক নেই")}${s.guardianPhone ? " · " + escapeHtml(s.guardianPhone) : ""}</span></td>
        <td>${escapeHtml(s.phone || "-")}${s.whatsapp ? "<br><span>WA: " + escapeHtml(s.whatsapp) + "</span>" + waLink : ""}</td>
        <td>${escapeHtml(s.college || "-")}</td>
        <td>${escapeHtml(getBatchName(s.batchId))}</td>
        <td>${escapeHtml(getCourseName(s.courseId))}</td>
        <td>${formatMoney(s.monthlyFee || 0)}</td>
        ${editable ? `<td><div class="inline-tools">
          <button class="small-btn" type="button" data-edit-student="${s.id}">এডিট</button>
          <button class="small-btn" type="button" data-delete-student="${s.id}">মুছো</button>
        </div></td>` : ""}
      </tr>`;
      }).join("")
    : `<tr><td colspan="7">${emptyState("মিলছে এমন শিক্ষার্থী নেই।")}</td></tr>`;

  document.querySelectorAll("#students .col-action").forEach((c) => { c.style.display = editable ? "" : "none"; });
  document.querySelectorAll("[data-edit-student]").forEach((b) =>
    b.addEventListener("click", () => startEditStudent(b.dataset.editStudent)));
  document.querySelectorAll("[data-delete-student]").forEach((b) =>
    b.addEventListener("click", () => {
      if (!requireEdit("students")) return;
      const student = state.students.find((item) => item.id === b.dataset.deleteStudent);
      if (!student) return;
      if (!confirm(`${student.name} কে ডিলিট করবে?`)) return;
      state.students = state.students.filter((item) => item.id !== b.dataset.deleteStudent);
      for (const record of Object.values(state.attendance)) delete record[b.dataset.deleteStudent];
      if (editingStudentId === b.dataset.deleteStudent) resetStudentForm();
      toast("শিক্ষার্থী ডিলিট হয়েছে।");
      logActivity("শিক্ষার্থী ডিলিট", student.name);
      saveAndRender();
    }));
}

function renderBatches() {
  const editable = canEditTab("batches");
  els.batchCards.innerHTML = state.batches.length
    ? state.batches.map((batch) => {
        const count = state.students.filter((s) => s.batchId === batch.id).length;
        return `
          <article class="batch-card">
            <strong>${escapeHtml(batch.name)}</strong>
            <span>${escapeHtml(batch.teacher || "শিক্ষক দেওয়া হয়নি")}</span>
            <p>${escapeHtml(batch.schedule || "সময় দেওয়া হয়নি")}</p>
            <span class="badge">${toBnNumber(count)} জন শিক্ষার্থী</span>
            ${editable ? `<div class="inline-tools" style="margin-top: 10px">
              <button class="small-btn" type="button" data-edit-batch="${batch.id}">এডিট</button>
              <button class="small-btn" type="button" data-delete-batch="${batch.id}">মুছো</button>
            </div>` : ""}
          </article>`;
      }).join("")
    : emptyState("এখনো ব্যাচ নেই।");

  document.querySelectorAll("[data-edit-batch]").forEach((b) =>
    b.addEventListener("click", () => startEditBatch(b.dataset.editBatch)));
  document.querySelectorAll("[data-delete-batch]").forEach((b) =>
    b.addEventListener("click", () => {
      if (!requireEdit("batches")) return;
      const batch = state.batches.find((item) => item.id === b.dataset.deleteBatch);
      if (!batch) return;
      const assigned = state.students.filter((s) => s.batchId === batch.id).length;
      if (!confirm(assigned ? `"${batch.name}" ডিলিট করবে? ${toBnNumber(assigned)} জন শিক্ষার্থী কোনো ব্যাচ নেই-তে চলে যাবে।` : `"${batch.name}" ডিলিট করবে?`)) return;
      state.batches = state.batches.filter((item) => item.id !== batch.id);
      state.students.forEach((s) => { if (s.batchId === batch.id) s.batchId = ""; });
      if (editingBatchId === batch.id) resetBatchForm();
      toast("ব্যাচ ডিলিট হয়েছে।");
      logActivity("ব্যাচ ডিলিট", batch.name);
      saveAndRender();
    }));
}

function renderCourses() {
  const editable = canEditTab("courses");
  const filter = els.courseFilter ? els.courseFilter.value : "all";
  const courses = state.courses.filter((c) => filter === "all" || c.type === filter);

  els.courseCards.innerHTML = courses.length
    ? courses.map((course) => {
        const count = state.students.filter((s) => s.courseId === course.id).length;
        return `
          <article class="batch-card">
            <strong>${escapeHtml(course.name)}</strong>
            <span>${courseTypeLabel(course.type)} · ${formatMoney(course.fee || 0)}</span>
            <p>${escapeHtml(course.duration || "বিবরণ দেওয়া হয়নি")}</p>
            <span class="badge">${toBnNumber(count)} জন ভর্তি</span>
            ${editable ? `<div class="inline-tools" style="margin-top: 10px">
              <button class="small-btn" type="button" data-edit-course="${course.id}">এডিট</button>
              <button class="small-btn" type="button" data-delete-course="${course.id}">মুছো</button>
            </div>` : ""}
          </article>`;
      }).join("")
    : emptyState("এখনো কোর্স / প্যাকেজ নেই।");

  document.querySelectorAll("[data-edit-course]").forEach((b) =>
    b.addEventListener("click", () => startEditCourse(b.dataset.editCourse)));
  document.querySelectorAll("[data-delete-course]").forEach((b) =>
    b.addEventListener("click", () => {
      if (!requireEdit("courses")) return;
      const course = state.courses.find((item) => item.id === b.dataset.deleteCourse);
      if (!course) return;
      const assigned = state.students.filter((s) => s.courseId === course.id).length;
      if (!confirm(assigned ? `"${course.name}" ডিলিট করবে? ${toBnNumber(assigned)} জন শিক্ষার্থীর এনরোলমেন্ট মুছে যাবে।` : `"${course.name}" ডিলিট করবে?`)) return;
      state.courses = state.courses.filter((item) => item.id !== course.id);
      state.students.forEach((s) => { if (s.courseId === course.id) s.courseId = ""; });
      if (editingCourseId === course.id) resetCourseForm();
      toast("কোর্স / প্যাকেজ ডিলিট হয়েছে।");
      logActivity("কোর্স ডিলিট", course.name);
      saveAndRender();
    }));
}

function startEditCourse(id) {
  if (!requireEdit("courses")) return;
  const course = state.courses.find((item) => item.id === id);
  if (!course) return;
  editingCourseId = id;
  els.courseFormTitle.textContent = "কোর্স / প্যাকেজ এডিট করো";
  els.courseSubmitBtn.textContent = "সেভ করো";
  els.courseCancelBtn.hidden = false;
  els.courseName.value = course.name || "";
  els.courseType.value = course.type || "subject";
  els.courseFee.value = course.fee ?? "";
  els.courseDuration.value = course.duration || "";
  switchView("courses", "কোর্স ও প্যাকেজ");
  els.courseName.focus();
}

function resetCourseForm() {
  editingCourseId = null;
  els.courseForm.reset();
  els.courseFormTitle.textContent = "নতুন কোর্স / প্যাকেজ";
  els.courseSubmitBtn.textContent = "যোগ করো";
  els.courseCancelBtn.hidden = true;
}

function visibleAttendanceStudents() {
  const batchId = els.attendanceBatch.value;
  return state.students.filter((s) => batchId === "all" || !batchId || s.batchId === batchId);
}

function renderAttendance() {
  const editable = canEditTab("attendance");
  const date = els.attendanceDate.value || today;
  const students = visibleAttendanceStudents();

  els.attendanceList.innerHTML = students.length
    ? students.map((s) => {
        const status = state.attendance[date]?.[s.id] || "none";
        const statusText = status === "present" ? "উপস্থিত" : status === "absent" ? "অনুপস্থিত" : "দেওয়া হয়নি";
        return `
          <div class="attendance-row">
            <div><strong>${escapeHtml(s.name)}</strong><span>${escapeHtml(getBatchName(s.batchId))}</span></div>
            ${editable ? `<div class="inline-tools">
              <button class="small-btn ${status === "present" ? "present" : ""}" type="button" data-attendance="${s.id}" data-status="present">উপস্থিত</button>
              <button class="small-btn ${status === "absent" ? "absent" : ""}" type="button" data-attendance="${s.id}" data-status="absent">অনুপস্থিত</button>
            </div>` : `<span class="badge ${status === "present" ? "paid" : status === "absent" ? "due" : ""}">${statusText}</span>`}
          </div>`;
      }).join("")
    : emptyState("আগে শিক্ষার্থী যোগ করো, তারপর হাজিরা নাও।");

  document.querySelectorAll("[data-attendance]").forEach((b) =>
    b.addEventListener("click", () => {
      if (!requireEdit("attendance")) return;
      state.attendance[date] ||= {};
      state.attendance[date][b.dataset.attendance] = b.dataset.status;
      const markedStudent = state.students.find((s) => s.id === b.dataset.attendance);
      logActivity("হাজিরা", `${markedStudent ? markedStudent.name : ""} — ${b.dataset.status === "present" ? "উপস্থিত" : "অনুপস্থিত"} (${date})`);
      saveAndRender();
    }));
}

function renderFees() {
  const editable = canEditTab("fees");
  const filter = els.feeFilter.value;
  const students = state.students.filter((s) => {
    const due = feeDue(s);
    if (filter === "due") return due > 0;
    if (filter === "paid") return due <= 0;
    return true;
  });

  els.feeRows.innerHTML = students.length
    ? students.map((s) => `
      <tr>
        <td><strong>${escapeHtml(s.name)}</strong></td>
        <td>${escapeHtml(getBatchName(s.batchId))}</td>
        <td>${formatMoney(s.monthlyFee || 0)}</td>
        <td>${formatMoney(s.paid || 0)}</td>
        <td><span class="badge ${feeDue(s) > 0 ? "due" : "paid"}">${formatMoney(feeDue(s))}</span></td>
        ${editable ? `<td><div class="inline-tools">
          <button class="small-btn" type="button" data-add-payment="${s.id}">পেমেন্ট নাও</button>
          <button class="small-btn" type="button" data-pay-student="${s.id}">পুরো পরিশোধ</button>
        </div></td>` : ""}
      </tr>`).join("")
    : `<tr><td colspan="6">${emptyState("এই লিস্টে কোনো শিক্ষার্থী নেই।")}</td></tr>`;

  document.querySelectorAll("#fees .col-action").forEach((c) => { c.style.display = editable ? "" : "none"; });
  document.querySelectorAll("[data-add-payment]").forEach((b) =>
    b.addEventListener("click", () => {
      if (!requireEdit("fees")) return;
      const student = state.students.find((item) => item.id === b.dataset.addPayment);
      if (!student) return;
      const due = feeDue(student);
      const raw = prompt(`${student.name}-এর পেমেন্ট নাও (বকেয়া ${formatMoney(due)}):`, String(due));
      if (raw === null) return;
      const amount = Number(raw);
      if (!Number.isFinite(amount) || amount <= 0) {
        toast("০-এর বেশি টাকা লিখো।");
        return;
      }
      student.paid = Number(student.paid || 0) + amount;
      state.payments.unshift({ id: crypto.randomUUID(), studentId: student.id, amount, date: today, createdAt: Date.now() });
      toast(`${formatMoney(amount)} পেমেন্ট নেওয়া হয়েছে।`);
      logActivity("ফি পেমেন্ট", `${student.name} — ${formatMoney(amount)}`);
      saveAndRender();
    }));
  document.querySelectorAll("[data-pay-student]").forEach((b) =>
    b.addEventListener("click", () => {
      if (!requireEdit("fees")) return;
      const student = state.students.find((item) => item.id === b.dataset.payStudent);
      if (!student) return;
      const due = feeDue(student);
      if (due <= 0) {
        toast("পুরো ফি আগেই দেওয়া হয়েছে।");
        return;
      }
      student.paid = Number(student.monthlyFee || 0);
      state.payments.unshift({ id: crypto.randomUUID(), studentId: student.id, amount: due, date: today, createdAt: Date.now() });
      toast("পুরো পরিশোধ হিসেবে মার্ক করা হয়েছে।");
      logActivity("ফি পুরো পরিশোধ", `${student.name} — ${formatMoney(due)}`);
      saveAndRender();
    }));

  els.paymentHistory.innerHTML = state.payments.length
    ? state.payments.slice(0, 8).map((p) => {
        const student = state.students.find((item) => item.id === p.studentId);
        return `
          <div class="compact-item">
            <div><strong>${escapeHtml(student ? student.name : "ডিলিট করা শিক্ষার্থী")}</strong><span>${escapeHtml(p.date || "")}</span></div>
            <span class="badge paid">${formatMoney(p.amount)}</span>
          </div>`;
      }).join("")
    : emptyState("এখনো পেমেন্ট নেওয়া হয়নি।");
}

function renderMoney() {
  const editable = canEditTab("money");
  const income = state.money.filter((m) => m.type === "income").reduce((s, m) => s + Number(m.amount || 0), 0);
  const cost = state.money.filter((m) => m.type === "expense").reduce((s, m) => s + Number(m.amount || 0), 0);
  const monthNet = state.money
    .filter((m) => (m.date || "").startsWith(thisMonth))
    .reduce((s, m) => s + (m.type === "income" ? Number(m.amount || 0) : -Number(m.amount || 0)), 0);

  els.metricIncome.textContent = formatMoney(income);
  els.metricCost.textContent = formatMoney(cost);
  els.metricBalance.textContent = formatMoney(income - cost);
  els.metricMonthNet.textContent = formatMoney(monthNet);

  const filter = els.moneyFilter.value;
  const rows = state.money.filter((m) => filter === "all" || m.type === filter);
  els.moneyRows.innerHTML = rows.length
    ? rows.map((m) => `
      <tr>
        <td>${escapeHtml(m.date || "-")}</td>
        <td><span class="badge ${m.type === "income" ? "paid" : "due"}">${m.type === "income" ? "আয়" : "খরচ"}</span></td>
        <td><strong>${escapeHtml(m.category || "জেনারেল")}</strong><br><span>${escapeHtml(m.note || (m.by ? "এন্ট্রি: " + m.by : ""))}</span></td>
        <td>${formatMoney(m.amount)}</td>
        ${editable ? `<td><button class="small-btn" type="button" data-delete-money="${m.id}">মুছো</button></td>` : ""}
      </tr>`).join("")
    : `<tr><td colspan="5">${emptyState("এখনো হিসাব এন্ট্রি নেই।")}</td></tr>`;

  document.querySelectorAll("#money .col-action").forEach((c) => { c.style.display = editable ? "" : "none"; });
  document.querySelectorAll("[data-delete-money]").forEach((b) =>
    b.addEventListener("click", () => {
      if (!requireEdit("money")) return;
      if (!confirm("এই এন্ট্রি ডিলিট করবে?")) return;
      const entry = state.money.find((m) => m.id === b.dataset.deleteMoney);
      state.money = state.money.filter((m) => m.id !== b.dataset.deleteMoney);
      toast("এন্ট্রি ডিলিট হয়েছে।");
      if (entry) logActivity("হিসাব ডিলিট", `${entry.category || ""} — ${formatMoney(entry.amount)}`);
      saveAndRender();
    }));
}

function renderUsers() {
  if (!isAdmin()) return;
  els.userRows.innerHTML = state.users.length
    ? state.users.map((u) => {
        const tabs = u.role === "admin" ? "সব" : (u.tabs || []).map((t) => VIEW_TITLES[t] || t).join(", ") || "কিছু না";
        const self = currentUser && u.id === currentUser.id;
        const isSuper = u.username === SUPER_ADMIN_USER;
        return `
          <tr>
            <td><strong>${escapeHtml(u.username)}</strong>${self ? ' <span class="badge">তুমি</span>' : ""}${isSuper ? ' <span class="badge paid">সুপার অ্যাডমিন</span>' : ""}</td>
            <td><span class="badge ${u.role === "admin" ? "paid" : ""}">${escapeHtml(roleLabel(u.role))}</span></td>
            <td><span>${escapeHtml(tabs)}${u.moneyEdit ? " + হিসাব এন্ট্রি" : ""}</span></td>
            <td><div class="inline-tools">
              <button class="small-btn" type="button" data-edit-user="${u.id}">এডিট</button>
              ${(self || isSuper) ? "" : `<button class="small-btn" type="button" data-delete-user="${u.id}">মুছো</button>`}
            </div></td>
          </tr>`;
      }).join("")
    : `<tr><td colspan="4">${emptyState("এখনো ইউজার নেই।")}</td></tr>`;

  document.querySelectorAll("[data-edit-user]").forEach((b) =>
    b.addEventListener("click", () => {
      const user = state.users.find((u) => u.id === b.dataset.editUser);
      if (!user) return;
      if (user.username === SUPER_ADMIN_USER && currentUser.username !== SUPER_ADMIN_USER) {
        toast("সুপার অ্যাডমিন এডিট করা যাবে না।");
        return;
      }
      editingUserId = user.id;
      els.userFormTitle.textContent = "ইউজার এডিট করো";
      els.userSubmitBtn.textContent = "সেভ করো";
      els.userCancelBtn.hidden = false;
      els.userName.value = user.username;
      els.userPass.value = "";
      els.userPass.required = false;
      els.userPass.placeholder = "খালি রাখলে আগের পাসওয়ার্ড থাকবে";
      els.userRole.value = user.role;
      renderUserTabsBox(user.role === "admin" ? ROLE_DEFAULTS.admin.tabs : (user.tabs || []));
      els.userMoneyEdit.checked = !!user.moneyEdit;
      els.linkStudentWrap.style.display = user.role === "student" ? "" : "none";
      renderUserStudentOptions();
      els.userStudent.value = user.studentId || "";
      els.userName.focus();
    }));
  document.querySelectorAll("[data-delete-user]").forEach((b) =>
    b.addEventListener("click", () => {
      const user = state.users.find((u) => u.id === b.dataset.deleteUser);
      if (!user) return;
      if (user.username === SUPER_ADMIN_USER) {
        toast("সুপার অ্যাডমিনকে ডিলিট করা যাবে না।");
        return;
      }
      if (!confirm(`"${user.username}" ইউজার ডিলিট করবে?`)) return;
      state.users = state.users.filter((u) => u.id !== user.id);
      if (editingUserId === user.id) resetUserForm();
      toast("ইউজার ডিলিট হয়েছে।");
      logActivity("ইউজার ডিলিট", user.username);
      saveAndRender();
    }));
}

function renderActivity() {
  if (!isAdmin() || !els.activityRows) return;
  const query = (els.activitySearch ? els.activitySearch.value : "").trim().toLowerCase();
  const userFilter = els.activityUser ? els.activityUser.value : "all";
  const users = [...new Set(state.activity.map((a) => a.user))];
  if (els.activityUser && els.activityUser.options.length <= 1) {
    els.activityUser.innerHTML = '<option value="all">সব ইউজার</option>' +
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
        <td>${escapeHtml(a.date || "-")}<br><span>${escapeHtml(a.time || "")}</span></td>
        <td><strong>${escapeHtml(a.user)}</strong></td>
        <td>${escapeHtml(a.action)}</td>
        <td><span>${escapeHtml(a.detail || "-")}</span></td>
      </tr>`).join("")
    : `<tr><td colspan="4">${emptyState("কোনো রেকর্ড নেই।")}</td></tr>`;
}

function renderMyBatch() {
  if (!currentUser) return;
  const student = state.students.find((s) => s.id === currentUser.studentId);
  if (!student) {
    els.myBatchCard.innerHTML = emptyState("এই অ্যাকাউন্টের সাথে কোনো শিক্ষার্থী লিংক নেই। অ্যাডমিনকে বলো লিংক করতে।");
    return;
  }
  const batch = state.batches.find((b) => b.id === student.batchId);
  const course = state.courses.find((c) => c.id === student.courseId);
  els.myBatchCard.innerHTML = `
    <div class="compact-item"><div><strong>শিক্ষার্থী</strong><span>নাম</span></div><span>${escapeHtml(student.name)}</span></div>
    <div class="compact-item"><div><strong>ব্যাচ</strong><span>ক্লাস</span></div><span>${escapeHtml(batch ? batch.name : "কোনো ব্যাচ নেই")}</span></div>
    <div class="compact-item"><div><strong>শিক্ষক</strong><span>ক্লাস শিক্ষক</span></div><span>${escapeHtml(batch ? batch.teacher || "-" : "-")}</span></div>
    <div class="compact-item"><div><strong>সময়</strong><span>ক্লাসের সময়</span></div><span>${escapeHtml(batch ? batch.schedule || "-" : "-")}</span></div>
    <div class="compact-item"><div><strong>কোর্স / প্যাকেজ</strong><span>ভর্তি</span></div><span>${escapeHtml(course ? course.name : "-")}</span></div>
    <div class="compact-item"><div><strong>মাসিক ফি</strong><span>বকেয়া</span></div><span class="badge ${feeDue(student) > 0 ? "due" : "paid"}">${formatMoney(feeDue(student))}</span></div>`;
}

function startEditStudent(id) {
  if (!requireEdit("students")) return;
  const student = state.students.find((item) => item.id === id);
  if (!student) return;
  editingStudentId = id;
  els.studentFormTitle.textContent = "শিক্ষার্থী এডিট করো";
  els.studentSubmitBtn.textContent = "সেভ করো";
  els.studentCancelBtn.hidden = false;
  els.studentName.value = student.name || "";
  els.studentPhone.value = student.phone || "";
  els.guardianName.value = student.guardian || "";
  els.guardianPhone.value = student.guardianPhone || "";
  els.whatsappNumber.value = student.whatsapp || "";
  els.collegeName.value = student.college || "";
  els.studentFee.value = student.monthlyFee ?? "";
  renderBatchOptions();
  els.studentBatch.value = student.batchId || "";
  renderCourseOptions();
  els.studentCourse.value = student.courseId || "";
  switchView("students", "শিক্ষার্থী");
  els.studentName.focus();
}

function resetStudentForm() {
  editingStudentId = null;
  els.studentForm.reset();
  els.studentFormTitle.textContent = "নতুন শিক্ষার্থী";
  els.studentSubmitBtn.textContent = "শিক্ষার্থী যোগ করো";
  els.studentCancelBtn.hidden = true;
}

function startEditBatch(id) {
  if (!requireEdit("batches")) return;
  const batch = state.batches.find((item) => item.id === id);
  if (!batch) return;
  editingBatchId = id;
  els.batchFormTitle.textContent = "ব্যাচ এডিট করো";
  els.batchSubmitBtn.textContent = "সেভ করো";
  els.batchCancelBtn.hidden = false;
  els.batchName.value = batch.name || "";
  els.batchTeacher.value = batch.teacher || "";
  els.batchSchedule.value = batch.schedule || "";
  switchView("batches", "ব্যাচ");
  els.batchName.focus();
}

function resetBatchForm() {
  editingBatchId = null;
  els.batchForm.reset();
  els.batchFormTitle.textContent = "নতুন ব্যাচ";
  els.batchSubmitBtn.textContent = "ব্যাচ খোলো";
  els.batchCancelBtn.hidden = true;
}

function getBatchName(batchId) {
  return state.batches.find((batch) => batch.id === batchId)?.name || "কোনো ব্যাচ নেই";
}

function feeDue(student) {
  return Math.max(0, Number(student.monthlyFee || 0) - Number(student.paid || 0));
}

function toBnNumber(value) {
  return Number(value || 0).toLocaleString("bn-BD");
}

function formatMoney(value) {
  return `৳${Number(value || 0).toLocaleString("bn-BD")}`;
}

function emptyState(message) {
  return `<div class="empty-state">${message}</div>`;
}

let toastTimer = null;
function toast(message) {
  els.toast.textContent = message;
  els.toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => els.toast.classList.remove("show"), 2400);
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

ensureAdmin();
renderUserTabsBox(ROLE_DEFAULTS.editor.tabs);
if (currentUser) {
  enterApp();
} else {
  saveAndRender();
  showLogin();
}
