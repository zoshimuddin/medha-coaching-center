const SUPABASE_URL = "https://mlsyvhlnnjexqtaswayi.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1sc3l2aGxubmpleHF0YXN3YXlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA4NDY2MDQsImV4cCI6MjEwNjQyMjYwNH0.xLaU6vHgz82qtvUyI5RwZLoVbk-hRRHetglO7N71VVw";
const LANG_KEY = "ccmLang";

const sb = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const today = new Date().toISOString().slice(0, 10);
const thisMonth = today.slice(0, 7);

/* ================= i18n ================= */

const I18N = {
  bn: {
    managerLogin: "ম্যানেজার লগইন", email: "ইমেইল", password: "পাসওয়ার্ড",
    loginBtn: "লগইন করো", loginHint: "তোমার ইমেইল ও পাসওয়ার্ড দিয়ে লগইন করো।",
    forgotPass: "পাসওয়ার্ড ভুলে গেছো?", loading: "লোড হচ্ছে…",
    manager: "ম্যানেজার",
    m_dashboard: "ড্যাশবোর্ড", m_students: "শিক্ষার্থী", m_courses: "কোর্স ও শিডিউল",
    m_attendance: "হাজিরা", m_fees: "ফি", m_money: "হিসাব", m_payroll: "শিক্ষক পেমেন্ট",
    m_settings: "সেটিংস", m_activity: "হিস্ট্রি",
    logout: "লগআউট", backupDemo: "⚙ ব্যাকআপ ও ডেমো", demoData: "ডেমো ডেটা লোড করো",
    backupDown: "ব্যাকআপ ডাউনলোড", backupUp: "ব্যাকআপ আপলোড", clearAll: "সব ডেটা মুছো",
    eyebrow: "কোচিং ওয়ার্কস্পেস", todayDate: "আজকের তারিখ",
    totalStudents: "মোট শিক্ষার্থী", activeBatches: "চালু ব্যাচ", presentToday: "আজকে উপস্থিত",
    dueFees: "বকেয়া ফি", studentsPerCourse: "কোন কোর্সে কত শিক্ষার্থী",
    studentsPerBatch: "প্রতি ব্যাচে শিক্ষার্থী", feesCollectedDue: "ফি: আদায় বনাম বকেয়া",
    recentStudents: "নতুন শিক্ষার্থী", feeStatus: "ফি-এর অবস্থা", todayAttendance: "আজকের হাজিরা",
    studentName: "শিক্ষার্থীর নাম *", mobile: "মোবাইল নম্বর *", guardian: "অভিভাবক",
    guardianPhone: "অভিভাবকের মোবাইল", whatsapp: "হোয়াটসঅ্যাপ নম্বর", address: "ঠিকানা",
    college: "কলেজ *", yearLevel: "শ্রেণি *", year1: "১ম বর্ষ", year2: "২য় বর্ষ",
    groupLabel: "গ্রুপ *", batch: "ব্যাচ", pickCourses: "কোর্স / প্যাকেজ বাছাই করো *",
    admissionFeeLabel: "ভর্তি ফি (ফিক্সড)", admissionPaid: "ভর্তি ফি প্রদান *",
    thName: "নাম", thContact: "যোগাযোগ", thCollege: "কলেজ", thYear: "শ্রেণি", thGroup: "গ্রুপ",
    thCourse: "কোর্স", thFeeStatus: "ফি অবস্থা", thAction: "অ্যাকশন",
    courseName: "নাম *", courseType: "ধরন", typeSubject: "আলাদা সাবজেক্ট", typePackage: "প্যাকেজ",
    courseFee: "ডিফল্ট মাসিক ফি (টাকা)", courseDuration: "মেয়াদ / বিবরণ",
    courseList: "সব কোর্স ও প্যাকেজ", fAll: "সব", onlySubject: "শুধু সাবজেক্ট", onlyPackage: "শুধু প্যাকেজ",
    scheduleTitle: "সাপ্তাহিক শিডিউল (কোর্স + শ্রেণি + গ্রুপ)", assignTeacher: "শিক্ষক",
    weekdays: "কোন কোন বার ক্লাস হবে *", classTime: "ক্লাসের সময়",
    ratePerClass: "প্রতি ক্লাসে পেমেন্ট (৳)", addSchedule: "শিডিউল যোগ করো",
    takeAttendance: "হাজিরা নাও", markAllPresent: "সবাই উপস্থিত", saveAttendance: "হাজিরা সেভ করো",
    totalCollected: "মোট আদায়", fMonth: "মাস",
    feeTracking: "ফি-এর হিসাব", fAllStudents: "সকল শিক্ষার্থী", fDueOnly: "শুধু বকেয়া",
    fPaidOnly: "শুধু পরিশোধ", thStudent: "শিক্ষার্থী", thPaid: "দিয়েছে", thDue: "বকেয়া",
    recentPayments: "শেষ পেমেন্টগুলো",
    totalIncome: "মোট আয়", totalCost: "মোট খরচ", balance: "ব্যালেন্স", monthNet: "মাসের নিট",
    newEntry: "নতুন এন্ট্রি", entryDate: "তারিখ", entryType: "ধরন", income: "আয়", expense: "খরচ",
    category: "ক্যাটাগরি", amount: "টাকার পরিমাণ *", note: "নোট", saveEntry: "এন্ট্রি সেভ করো",
    incomeCost: "আয় ও খরচ", onlyIncome: "শুধু আয়", onlyExpense: "শুধু খরচ",
    thDate: "তারিখ", thType: "ধরন", thCategory: "ক্যাটাগরি", thAmount: "টাকা",
    bankTitle: "ব্যাংক", bankBalance: "ব্যাংকে আছে", direction: "ধরন", deposit: "জমা",
    withdrawal: "উত্তোলন", description: "বিবরণ", addBankTx: "যোগ করো",
    openingBalance: "ওপেনিং ব্যালেন্স (শুধু অ্যাডমিন)", save: "সেভ",
    duesTitle: "কোচিং বকেয়া", duesTotalLabel: "মোট বাকি", dueTitleStar: "কী বাকি? *",
    dueAddBtn: "বকেয়া যোগ করো",
    payrollTitle: "শিক্ষক পেমেন্ট (প্রতি ক্লাস হিসাব)", payTeacher: "শিক্ষককে পেমেন্ট করো",
    teacherLabel: "শিক্ষক *", payTeacherBtn: "পেমেন্ট সেভ করো", heldClassesTitle: "নেওয়া ক্লাসগুলো",
    brandingTitle: "ব্র্যান্ডিং", coachingName: "কোচিংর নাম *", logoLabel: "লোগো",
    removeLogo: "লোগো মুছো", saveSettings: "সেটিংস সেভ করো",
    admissionFeeTitle: "ভর্তি ফি", collegesTitle: "কলেজ লিস্ট", groupsTitle: "গ্রুপ লিস্ট",
    addBtn: "যোগ করো", usersTitle: "ইউজার ম্যানেজমেন্ট (শুধু অ্যাডমিন)",
    usernameStar: "ইউজারনেম *", emailStar: "ইমেইল *", passwordStar: "পাসওয়ার্ড *",
    passDashNote: "পাসওয়ার্ড বদলাতে Supabase dashboard ব্যবহার করো", role: "রোল",
    role_editor: "এডিটর (যোগ/এডিট, ইউজার ছাড়া)", role_viewer: "ভিউয়ার (শুধু দেখবে)",
    role_accountant: "হিসাবরক্ষক (হিসাব এন্ট্রি)", role_teacher: "শিক্ষক (শুধু হাজিরা নেবে)",
    role_student: "শিক্ষার্থী (ড্যাশবোর্ড দেখবে)",
    permLegend: "কোন কোন পেজ দেখতে পারবে", fieldGrants: "শিক্ষার্থীর কোন কোন তথ্য দেখতে পারবে (শিক্ষক)",
    payrollAccess: "শিক্ষক পেমেন্ট পেজ দেখতে পারবে", moneyEditPerm: "হিসাব পেজে এন্ট্রি দিতে পারবে",
    linkStudent: "শিক্ষার্থী লিংক করো (শিক্ষার্থী রোলের জন্য)",
    thUsername: "ইউজারনেম", thRole: "রোল", thPages: "পেজ",
    activityTitle: "ইউজার হিস্ট্রি — কে কী করলো", allUsers: "সব ইউজার",
    thUser: "ইউজার", thWork: "কাজ", thDetail: "বিবরণ",
    batchName: "ব্যাচের নাম *", batchList: "ব্যাচগুলো",
  },
  en: {
    managerLogin: "Manager Login", email: "Email", password: "Password",
    loginBtn: "Login", loginHint: "Login with your email and password.",
    forgotPass: "Forgot password?", loading: "Loading…",
    manager: "Manager",
    m_dashboard: "Dashboard", m_students: "Students", m_courses: "Courses & Schedule",
    m_attendance: "Attendance", m_fees: "Fees", m_money: "Accounts", m_payroll: "Teacher Pay",
    m_settings: "Settings", m_activity: "History",
    logout: "Logout", backupDemo: "⚙ Backup & Demo", demoData: "Load demo data",
    backupDown: "Download backup", backupUp: "Upload backup", clearAll: "Clear all data",
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
    courseFee: "Default monthly fee (BDT)", courseDuration: "Duration / details",
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
  },
};

const I18N_PH = {
  bn: {
    emailPh: "you@example.com", studentNamePh: "যেমন: Farhan Ahmed",
    collegePh: "যেমন: Dhaka College", searchStudent: "নাম বা নম্বর দিয়ে খোঁজো", searchPh: "খোঁজো",
  },
  en: {
    emailPh: "you@example.com", studentNamePh: "e.g. Farhan Ahmed",
    collegePh: "e.g. Dhaka College", searchStudent: "Search by name or number", searchPh: "Search",
  },
};

const STR = {
  bn: {
    appName: "মেধা কোচিং সেন্টার",
    noBatch: "কোনো ব্যাচ নেই", allBatches: "সব ব্যাচ", allYears: "সব শ্রেণি",
    selectStudent: "শিক্ষার্থী বাছো", selectTeacher: "শিক্ষক বাছো", noPhone: "মোবাইল নেই",
    noGuardian: "অভিভাবক নেই", noTeacherAssigned: "শিক্ষক নেই", noSchedule: "সময় নেই",
    noDesc: "বিবরণ নেই", general: "জেনারেল", dash: "—",
    edit: "এডিট", del: "মুছো", cancel: "বাতিল", save: "সেভ করো", addBtn: "যোগ করো",
    addStudent: "শিক্ষার্থী যোগ করো", editStudent: "শিক্ষার্থী এডিট করো", newStudent: "নতুন শিক্ষার্থী",
    newCourse: "নতুন কোর্স / প্যাকেজ", addCourseBtn: "যোগ করো", editCourse: "কোর্স এডিট করো",
    newUser: "নতুন ইউজার", makeUser: "ইউজার বানাও", editUser: "ইউজার এডিট করো",
    present: "উপস্থিত", absent: "অনুপস্থিত", notMarked: "দেওয়া হয়নি",
    paid: "পরিশোধ", due: "বকেয়া", collected: "আদায়", held: "নেওয়া হয়েছে", scheduled: "শিডিউলড",
    subject: "সাবজেক্ট", pack: "প্যাকেজ", you: "তুমি", superAdmin: "সুপার অ্যাডমিন",
    roleAdmin: "অ্যাডমিন", roleEditor: "এডিটর", roleViewer: "ভিউয়ার",
    roleAccountant: "হিসাবরক্ষক", roleStudent: "শিক্ষার্থী", roleTeacher: "শিক্ষক",
    tabsAll: "সব", tabsNone: "কিছু না", plusMoneyEdit: " + হিসাব এন্ট্রি",
    studentsSuffix: "জন শিক্ষার্থী", enrolledSuffix: "জন ভর্তি",
    confirmSecond: "আসলেই ডিলিট করতে চাও? ফেরানো যাবে না। ঠিক থাকলে আবার OK চাপো।",
    confirmDeleteStudent: "কে ডিলিট করবে?", confirmDeleteCourse: "ডিলিট করবে? এনরোলমেন্ট মুছে যাবে।",
    confirmDeleteOffering: "এই শিডিউল ডিলিট করবে?", confirmDeleteBatch: "ডিলিট করবে? শিক্ষার্থী ব্যাচ ছাড়া হয়ে যাবে।",
    confirmDeleteUser: "ইউজার ডিলিট করবে?", confirmDeleteMoney: "এই এন্ট্রি ডিলিট করবে?",
    confirmDeleteDue: "এই বকেয়া ডিলিট করবে?", confirmDeleteBank: "এই ব্যাংক এন্ট্রি ডিলিট করবে?",
    confirmClearAll: "সব ডেটা মুছে যাবে (ইউজার ও সেটিংস থাকবে)?",
    msgLoginFail: "ইমেইল বা পাসওয়ার্ড ভুল হয়েছে।",
    msgNoProfile: "এই ইমেইলের প্রোফাইল নেই — অ্যাডমিনকে বলো।",
    msgResetSent: "পাসওয়ার্ড রিসেট ইমেইল পাঠানো হয়েছে।", msgNeedEmail: "আগে ইমেইল লিখো।",
    msgEmailConfirm: "ইউজার তৈরি হয়েছে — ইমেইল confirm করতে হবে (Supabase Auth > Users)।",
    msgUserDeleted: "ইউজারের অ্যাক্সেস বন্ধ হয়েছে।",
    msgCdnFail: "ইন্টারনেট সংযোগ পাওয়া যায়নি — পেজ রিলোড করো।",
    msgWelcome: "স্বাগতম", msgNoViewPerm: "এই পেজ দেখার অনুমতি নেই।",
    msgAdminOnly: "শুধু অ্যাডমিন দেখতে পারবে।", msgNoEditPerm: "এডিট করার অনুমতি নেই।",
    msgNameReq: "নাম লিখো।", msgPhoneReq: "মোবাইল নম্বর লিখো।",
    msgCollegeReq: "কলেজ বাছো।", msgGroupReq: "গ্রুপ বাছো।",
    msgPickCourse: "অন্তত একটা কোর্স বাছো।", msgFeeNeg: "ফি ০ বা বেশি হতে হবে।",
    msgAdmissionShort: "ভর্তি ফি পুরো দিতে হবে।",
    msgCourseReq: "কোর্সের নাম লিখো।", msgBatchReq: "ব্যাচের নাম লিখো।",
    msgDaysReq: "অন্তত একটা বার বাছো।", msgUserReq: "ইউজারনেম লিখো।",
    msgUserExists: "এই ইউজারনেম আগে থেকে আছে।", msgPassShort: "পাসওয়ার্ড কম হলেও ৪ অক্ষর হতে হবে।",
    msgLinkStudent: "শিক্ষার্থী রোলের জন্য শিক্ষার্থী লিংক করো।",
    msgNoCoursePerm: "এই ক্লাসের হাজিরা দেওয়ার অনুমতি নেই।",
    msgNoStudentsView: "এই লিস্টে কোনো শিক্ষার্থী নেই।", msgNoDate: "এই তারিখে কিছু সেভ নেই।",
    msgAmtPos: "০-এর বেশি টাকা লিখো।", msgNoDue: "এই শিক্ষার্থীর কোনো বকেয়া নেই।",
    msgNoBackup: "ব্যাকআপ ফাইল ঠিক নেই।", msgBackupFail: "ব্যাকআপ ফাইল পড়া যায়নি।",
    msgLogoBig: "লোগো ছোট (৩০০KB এর কম) ছবি দাও।",
    msgImportLegacy: "জন শিক্ষার্থীতে শ্রেণি/গ্রুপ পূরি হয়নি — এডিট করে দাও।",
    msgPickClass: "আগে একটা ক্লাস বাছো।", msgNoChanges: "কোনো পরিবর্তন নেই।",
    tStudentAdd: "শিক্ষার্থী যোগ হয়েছে।", tStudentEdit: "শিক্ষার্থী আপডেট হয়েছে।",
    tStudentDel: "শিক্ষার্থী ডিলিট হয়েছে।", tCourseAdd: "কোর্স যোগ হয়েছে।",
    tCourseEdit: "কোর্স আপডেট হয়েছে।", tCourseDel: "কোর্স ডিলিট হয়েছে।",
    tOfferingAdd: "শিডিউল যোগ হয়েছে।", tOfferingEdit: "শিডিউল আপডেট হয়েছে।",
    tOfferingDel: "শিডিউল ডিলিট হয়েছে।", tBatchAdd: "ব্যাচ যোগ হয়েছে।", tBatchDel: "ব্যাচ ডিলিট হয়েছে।",
    tEntry: "এন্ট্রি সেভ হয়েছে।", tEntryDel: "এন্ট্রি ডিলিট হয়েছে।",
    tPaid: "পেমেন্ট নেওয়া হয়েছে।", tAttendanceSaved: "হাজিরা সেভ হয়েছে।",
    tDueAdd: "বকেয়া যোগ হয়েছে।", tDuePaid: "পরিশোধ হিসেবে মার্ক হয়েছে।",
    tDueUnpaid: "আবার বকেয়া হিসেবে মার্ক হয়েছে।", tDueDel: "বকেয়া ডিলিট হয়েছে।",
    tBankAdd: "ব্যাংক এন্ট্রি হয়েছে।", tBankDel: "ব্যাংক এন্ট্রি ডিলিট হয়েছে।",
    tBankSaved: "ওপেনিং ব্যালেন্স সেভ হয়েছে।",
    tPaySaved: "শিক্ষক পেমেন্ট সেভ হয়েছে।", tSettingsSaved: "সেটিংস সেভ হয়েছে।",
    tUserAdd: "ইউজার তৈরি হয়েছে।", tUserEdit: "ইউজার আপডেট হয়েছে।",
    tDemo: "ডেমো ডেটা লোড হয়েছে।", tBackupDown: "ব্যাকআপ ডাউনলোড হয়েছে।",
    tBackupUp: "ব্যাকআপ আপলোড হয়েছে।", tClear: "সব ডেটা মুছে দেওয়া হয়েছে।",
    emptyStudents: "এখনো কোনো শিক্ষার্থী নেই।", emptyNoMatch: "মিলছে এমন শিক্ষার্থী নেই।",
    emptyCourse: "এখনো কোর্স নেই।", emptyBatch: "এখনো ব্যাচ নেই।",
    emptyClasses: "এই বারে কোনো শিডিউলড ক্লাস নেই।", emptyRoster: "এই ক্লাসে কোনো শিক্ষার্থী নেই।",
    emptyOfferings: "এখনো কোনো শিডিউল নেই।", emptyFeeView: "কোনো শিক্ষার্থী নেই।",
    emptyMoney: "এখনো হিসাব এন্ট্রি নেই।", emptyBank: "এখনো ব্যাংক এন্ট্রি নেই।",
    emptyDues: "এখনো কোনো বকেয়া নেই।", emptyUsers: "এখনো ইউজার নেই।",
    emptyActivity: "কোনো রেকর্ড নেই।", emptyPayroll: "কোনো শিক্ষক নেই।",
    emptyHeld: "এখনো কোনো ক্লাস নেওয়া হয়নি।", emptyPayments: "এখনো পেমেন্ট নেওয়া হয়নি।",
    feePaidAll: "পুরো ফি দিয়েছে", feeHasDue: "বকেয়া ফি আছে",
    attPresent: "আজকে উপস্থিত", attAbsent: "আজকে অনুপস্থিত",
    lblPaidCount: "জন পুরো ফি দিয়েছে", lblDueCount: "জন বকেয়া",
    paymentsCountSuffix: "টা পেমেন্ট",
    classesHeld: "টা ক্লাস", earnedLabel: "আয়", paidLabel: "দেওয়া হয়েছে", dueLabel: "বাকি",
    promptPayment: "-এর পেমেন্ট নাও (বকেয়া", entryBy: "এন্ট্রি: ",
    byDeletedStudent: "ডিলিট করা শিক্ষার্থী", unknown: "অজানা",
    wa: "হোয়াটসঅ্যাপ", phPass4: "কম হলেও ৪ অক্ষর",
    day_0: "রবি", day_1: "সোম", day_2: "মঙ্গল", day_3: "বুধ", day_4: "বৃহস্পতি", day_5: "শুক্র", day_6: "শনি",
    rosterTitle: "রোস্টার", takePayment: "পেমেন্ট নাও",
    scanBtn: "ফর্ম স্ক্যান করে ভরাও",
    msgScanning: "ফর্ম পড়া হচ্ছে…",
    msgScanDone: "টা তথ্য ভরে গেছে — দেখে তারপর সেভ করো",
    msgScanEmpty: "কিছু পড়া যায়নি — হাতে লিখো",
    msgScanFail: "স্ক্যান করা যায়নি।",
    msgScanNoFunc: "scan-form function deploy nai — DEPLOY.md দেখো",
    msgScanImage: "ছবি ফাইল দাও (JPG/PNG)",
    msgScanUnmatched: "কোর্স নিজে বাছো (অটো ম্যাচ হয়নি):",
    msgScanSave: "সেভ করার আগে সব দেখে নিয়েছো তো?",
  },
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
    roleAdmin: "Admin", roleEditor: "Editor", roleViewer: "Viewer",
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
    tDemo: "Demo data loaded.", tBackupDown: "Backup downloaded.",
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

let lang = "bn";
try {
  const saved = localStorage.getItem(LANG_KEY);
  if (saved === "en" || saved === "bn") lang = saved;
} catch { /* ignore */ }

function t(key) { return (STR[lang] && STR[lang][key]) || STR.bn[key] || key; }
function tr(key) { return (I18N[lang] && I18N[lang][key]) || I18N.bn[key] || key; }
function trPh(key) { return (I18N_PH[lang] && I18N_PH[lang][key]) || I18N_PH.bn[key] || ""; }

function toNum(value) { return Number(value || 0).toLocaleString(lang === "bn" ? "bn-BD" : "en-US"); }
function formatMoney(value) { return `৳${Number(value || 0).toLocaleString(lang === "bn" ? "bn-BD" : "en-US")}`; }

function roleLabel(role) {
  return { admin: t("roleAdmin"), editor: t("roleEditor"), viewer: t("roleViewer"), accountant: t("roleAccountant"), student: t("roleStudent"), teacher: t("roleTeacher") }[role] || role;
}

function yearLabel(year) {
  if (year === "1st year") return tr("year1");
  if (year === "2nd year") return tr("year2");
  return year || t("dash");
}

function applyLang() {
  document.documentElement.lang = lang;
  document.querySelectorAll("[data-i18n]").forEach((el) => { el.textContent = tr(el.dataset.i18n); });
  document.querySelectorAll("[data-i18n-ph]").forEach((el) => { el.placeholder = trPh(el.dataset.i18nPh); });
  const toggleLabel = lang === "bn" ? "English" : "বাংলা";
  const shortLabel = lang === "bn" ? "EN" : "বাং";
  if (els.langToggle) els.langToggle.textContent = toggleLabel;
  if (els.langToggleMobile) els.langToggleMobile.textContent = shortLabel;
  applyBrand();
}

function toggleLang() {
  lang = lang === "bn" ? "en" : "bn";
  try { localStorage.setItem(LANG_KEY, lang); } catch { /* ignore */ }
  applyLang();
  const activeView = document.querySelector(".view.active-view");
  if (activeView) els.pageTitle.textContent = viewTitle(activeView.id);
  if (currentUser) {
    els.userBadge.innerHTML = `<strong>${escapeHtml(currentUser.username)}</strong><span>${escapeHtml(roleLabel(currentUser.role))}</span>`;
  }
  renderAll();
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
  editor: { tabs: ["dashboard", "students", "courses", "attendance", "fees"], moneyEdit: false },
  viewer: { tabs: ["dashboard", "students", "courses", "attendance", "fees", "money"], moneyEdit: false },
  accountant: { tabs: ["dashboard", "money"], moneyEdit: true },
  teacher: { tabs: ["attendance"], moneyEdit: false },
  student: { tabs: ["dashboard"], moneyEdit: false },
};

const VIEW_ORDER = ["dashboard", "students", "courses", "attendance", "fees", "money", "payroll", "settings", "activity"];

function viewTitle(id) {
  const map = {
    dashboard: tr("m_dashboard"), students: tr("m_students"), courses: tr("m_courses"),
    attendance: tr("m_attendance"), fees: tr("m_fees"), money: tr("m_money"),
    payroll: tr("m_payroll"), settings: tr("m_settings"), activity: tr("m_activity"),
  };
  return map[id] || id;
}

function tabLabel(id) {
  const found = ALL_TABS.find((tb) => tb.id === id);
  if (!found) return id;
  return lang === "bn" ? found.labelBn : found.labelEn;
}

/* ================= state ================= */

const state = {
  settings: { coachingName: "মেধা কোচিং সেন্টার", admissionFee: 0, colleges: ["Ramganj Govt College", "Ramganj Model College", "Alia Madrasha"], groups: ["Science", "Commerce", "Arts", "Madrasa"], logoData: "" },
  batches: [], courses: [], offerings: [],
  students: [], invoices: [], money: [], dues: [],
  bank: { opening: 0 }, bankTx: [],
  teacherPayments: [], heldSessions: [],
  users: [], activity: [],
};
let editingStudentId = null;
let editingCourseId = null;
let editingOfferingId = null;
let editingUserId = null;
let currentUser = null;
let activeSession = { offering: null, sessionId: null, marks: new Map() };
let logoPicked = null;

const els = {};
for (const el of document.querySelectorAll("[id]")) els[el.id] = el;

function renderToday() {
  els.todayLabel.textContent = new Date().toLocaleDateString(lang === "bn" ? "bn-BD" : "en-GB", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });
}
renderToday();
els.attendanceDate.value = today;
els.moneyDate.value = today;
els.dueDate.value = today;
els.bankDate.value = today;
els.feeMonth.value = thisMonth;

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
        coachingName: settings.coaching_name || "মেধা কোচিং সেন্টার",
        admissionFee: Number(settings.admission_fee || 0),
        colleges: Array.isArray(settings.colleges) ? settings.colleges : state.settings.colleges,
        groups: Array.isArray(settings.groups) ? settings.groups : state.settings.groups,
        logoData: settings.logo_data || "",
      };
    }
    state.batches = batches.map((r) => ({ id: r.id, name: r.name, teacher: r.teacher || "", schedule: r.schedule || "", createdAt: Date.parse(r.created_at) }));
    state.courses = courses.map((r) => ({ id: r.id, name: r.name, type: r.type, fee: Number(r.fee || 0), duration: r.duration || "", createdAt: Date.parse(r.created_at) }));
    state.offerings = offerings.map((r) => ({
      id: r.id, courseId: r.course_id, year: r.year_level, group: r.group_name,
      batchId: r.batch_id || "", teacherId: r.teacher_id || "",
      weekdays: Array.isArray(r.weekdays) ? r.weekdays : [],
      classTime: r.class_time || "", rate: Number(r.rate_per_class || 0),
      active: r.active !== false, createdAt: Date.parse(r.created_at),
    }));
  },

  async loadStudents() {
    state.students = [];
    if (!canView("students")) return;
    for (let page = 0; page < 20; page++) {
      const { data, error } = await sb.rpc("admin_student_roster", { p_page: page, p_page_size: 100, p_query: "" });
      if (error) { console.debug("roster rpc:", error.message); return; }
      const rows = data || [];
      state.students.push(...rows.map((r) => ({
        id: r.id, name: r.name, phone: r.phone || "", whatsapp: r.whatsapp || "",
        guardian: r.guardian || "", guardianPhone: r.guardianPhone || "",
        address: r.address || "", college: r.college || "", year: r.yearLevel || "",
        group: r.groupName || "", batchId: r.batchId || "", paid: Number(r.paid || 0),
        status: r.status || "active", createdAt: Date.parse(r.createdAt),
        enrollments: (r.enrollments || []).map((e) => ({ courseId: e.courseId, fee: Number(e.fee || 0) })),
      })));
      if (rows.length < 100) break;
    }
  },

  async loadFinance() {
    const canFees = canView("fees");
    const canMoney = canView("money");
    const [invoiceRows, moneyRows, dueRows, bankRow, bankTxRows] = await Promise.all([
      canFees ? safe(sb.from("student_fee_invoices").select("*, student_fee_payments(amount)")) : [],
      canMoney ? safe(sb.from("money_entries").select("*").order("created_at", { ascending: false })) : [],
      canMoney ? safe(sb.from("dues").select("*").order("created_at", { ascending: false })) : [],
      canMoney ? safe(sb.from("bank_account").select("*").eq("id", true).maybeSingle()) : null,
      canMoney ? safe(sb.from("bank_transactions").select("*").order("transaction_date", { ascending: false }).limit(200)) : [],
    ]);
    state.invoices = (Array.isArray(invoiceRows) ? invoiceRows : []).map((r) => ({
      id: r.id, studentId: r.student_id, courseId: r.course_id,
      month: (r.billing_month || "").slice(0, 7), agreedFee: Number(r.agreed_fee || 0),
      paid: (r.student_fee_payments || []).reduce((s, p) => s + Number(p.amount || 0), 0),
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
    if (!isAdmin()) { state.users = []; state.activity = []; return; }
    const [users, activity] = await Promise.all([
      safe(sb.from("profiles").select("*").order("created_at", { ascending: true })),
      safe(sb.from("activity_log").select("*").order("created_at", { ascending: false }).limit(500)),
    ]);
    state.users = (users || []).map((r) => ({
      id: r.id, username: r.username, role: r.role,
      tabs: Array.isArray(r.tabs) ? r.tabs : [], moneyEdit: !!r.money_edit,
      fieldGrants: Array.isArray(r.student_field_grants) ? r.student_field_grants : [],
      payrollAccess: !!r.teacher_payroll_access, studentId: r.student_id || "",
      createdAt: Date.parse(r.created_at),
    }));
    state.activity = (activity || []).map((r) => ({
      id: r.id, user: r.username, action: r.action, detail: r.detail || "", date: r.date,
      time: new Date(r.created_at).toLocaleTimeString(lang === "bn" ? "bn-BD" : "en-GB", { hour: "2-digit", minute: "2-digit" }),
      createdAt: Date.parse(r.created_at),
    }));
  },

  async loadAll() {
    await db.loadCore();
    await Promise.all([db.loadStudents(), db.loadFinance(), db.loadPayroll(), db.loadAdmin()]);
  },
};

/* ================= auth & permissions ================= */

async function loadCurrentUserAndData() {
  const { data: userData, error: userErr } = await sb.auth.getUser();
  if (userErr || !userData?.user) return false;
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
    logActivity(lang === "bn" ? "লগইন" : "Login", lang === "bn" ? "লগইন করলো" : "Logged in");
    toast(`${t("msgWelcome")}, ${currentUser.username}!`);
  } finally {
    submitBtn.disabled = false;
  }
});

els.logoutBtn.addEventListener("click", async () => {
  await sb.auth.signOut();
  currentUser = null;
  showLogin();
});

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

els.menuToggle.addEventListener("click", () => {
  if (els.sidebar.classList.contains("open")) closeSidebar();
  else openSidebar();
});

els.adminToolsToggle.addEventListener("click", () => {
  const open = els.adminToolsBody.hidden;
  els.adminToolsBody.hidden = !open;
  els.adminToolsToggle.setAttribute("aria-expanded", String(open));
});

els.langToggle.addEventListener("click", toggleLang);
els.langToggleMobile.addEventListener("click", toggleLang);

function showLogin() {
  els.loginView.hidden = false;
  els.appShell.hidden = true;
}

function enterApp() {
  els.loginView.hidden = true;
  els.appShell.hidden = false;
  applyPermissions();
  renderAll();
  if (canView("fees")) refreshFees();
}

function isAdmin() { return currentUser && currentUser.role === "admin"; }
function hasPayrollAccess() { return isAdmin() || !!(currentUser && currentUser.payrollAccess); }

function canView(tab) {
  if (!currentUser) return false;
  if (tab === "settings" || tab === "activity") return isAdmin();
  if (tab === "payroll") return hasPayrollAccess();
  if (isAdmin()) return true;
  return (currentUser.tabs || []).includes(tab);
}

function canEditTab(tab) {
  if (!currentUser) return false;
  if (isAdmin()) return true;
  if (["viewer", "student", "teacher"].includes(currentUser.role)) return false;
  if (tab === "money") return !!currentUser.moneyEdit;
  return (currentUser.tabs || []).includes(tab);
}

function myOfferings() {
  if (isAdmin()) return state.offerings;
  return state.offerings.filter((o) => o.teacherId === currentUser?.id);
}

function canMarkOffering(offering) {
  return !!(currentUser && offering && (isAdmin() || offering.teacherId === currentUser.id));
}

function applyPermissions() {
  document.querySelectorAll("#mainNav .nav-tab").forEach((tab) => {
    tab.style.display = canView(tab.dataset.view) ? "" : "none";
  });
  els.adminTools.style.display = isAdmin() ? "" : "none";
  els.userBadge.innerHTML = currentUser
    ? `<strong>${escapeHtml(currentUser.username)}</strong><span>${escapeHtml(roleLabel(currentUser.role))}</span>`
    : "";
  const first = VIEW_ORDER.find((v) => canView(v)) || "attendance";
  switchView(first, viewTitle(first));
  setFormEditable(els.studentForm, canEditTab("students"));
  setFormEditable(els.courseForm, canEditTab("courses"));
  setFormEditable(els.offeringForm, isAdmin());
  setFormEditable(els.batchForm, isAdmin());
  setFormEditable(els.moneyForm, canEditTab("money"));
  setFormEditable(els.dueForm, canEditTab("money"));
  setFormEditable(els.bankForm, canEditTab("money"));
  els.bankOpeningBox.style.display = isAdmin() ? "" : "none";
  els.payPayPanel.style.display = isAdmin() ? "" : "none";
  els.usersSection.style.display = isAdmin() ? "" : "none";
}

function setFormEditable(form, editable) {
  if (form) form.style.display = editable ? "" : "none";
}

function switchView(viewId, title) {
  if (currentUser && !canView(viewId)) {
    toast(viewId === "settings" || viewId === "activity" ? t("msgAdminOnly") : t("msgNoViewPerm"));
    return;
  }
  document.querySelectorAll(".nav-tab").forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.view === viewId);
  });
  document.querySelectorAll(".view").forEach((view) => {
    view.classList.toggle("active-view", view.id === viewId);
  });
  els.pageTitle.textContent = title || viewTitle(viewId);
  if (isMobileMenu()) closeSidebar();
  const content = document.querySelector(".content");
  if (content) content.scrollIntoView({ block: "start" });
}

document.querySelectorAll(".nav-tab").forEach((tab) => {
  tab.addEventListener("click", () => switchView(tab.dataset.view, tab.textContent));
});

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
  const name = state.settings.coachingName || STR.bn.appName;
  const logo = state.settings.logoData || "";
  els.brandName.textContent = name;
  els.brandNameMobile.textContent = name;
  els.loginBrandName.textContent = name;
  document.title = lang === "bn" ? `${name} ম্যানেজার` : `${name} Manager`;
  for (const [img, mark] of [
    [els.brandLogo, els.brandMark],
    [els.brandLogoMobile, els.brandMarkMobile],
    [els.loginLogo, els.loginMark],
  ]) {
    if (logo) {
      img.src = logo;
      img.hidden = false;
      mark.hidden = true;
    } else {
      img.hidden = true;
      mark.hidden = false;
      mark.textContent = name.trim().charAt(0) || "মে";
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
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const maxSide = 1280;
      const scale = Math.min(1, maxSide / Math.max(img.width, img.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(img.width * scale));
      canvas.height = Math.max(1, Math.round(img.height * scale));
      canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL("image/jpeg", 0.72));
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
}

function prefillFromScan(fields) {
  resetStudentForm();
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
  for (const c of Array.isArray(fields.courses) ? fields.courses : []) {
    const row = [...els.studentCoursesBox.querySelectorAll(".course-pick")].find((rowEl) => {
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
  const drop = els.studentCoursesBox.closest("details");
  if (drop) drop.open = true;
  switchView("students", viewTitle("students"));
  return { found, unmatched };
}

els.scanFileInput.addEventListener("change", async () => {
  const file = els.scanFileInput.files[0];
  if (!file) return;
  if (!file.type.startsWith("image/")) { toast(t("msgScanImage")); return; }
  els.scanBtn.disabled = true;
  toast(t("msgScanning"));
  try {
    const imageData = await downscaleImage(file);
    const { data, error } = await sb.functions.invoke("scan-form", {
      body: {
        image: imageData,
        mime: "image/jpeg",
        courses: state.courses.map((c) => ({ id: c.id, name: c.name })),
      },
    });
    if (error) {
      const real = await edgeErrorMessage(error);
      if (/not found/i.test(real)) {
        toast(t("msgScanNoFunc"));
      } else if (real) {
        toast(real);
      } else {
        toast(t("msgScanFail"));
      }
      console.warn("scan-form error:", error, real);
      return;
    }
    const { found, unmatched } = prefillFromScan(data?.fields || {});
    if (found > 0) {
      toast(`${toNum(found)} ${t("msgScanDone")}${unmatched.length ? ` — ${t("msgScanUnmatched")} ${unmatched.join(", ")}` : ""}`);
    } else {
      toast(t("msgScanEmpty"));
    }
  } catch (err) {
    fail(err);
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

function renderStudentCourseBox() {
  const student = editingStudentId ? state.students.find((s) => s.id === editingStudentId) : null;
  const enrolled = student ? student.enrollments : [];
  const prev = new Map(
    [...els.studentCoursesBox.querySelectorAll(".course-pick")].map((row) => [
      row.querySelector("input[type='checkbox']").value,
      { checked: row.querySelector("input[type='checkbox']").checked, fee: row.querySelector("input[type='number']").value },
    ]),
  );
  els.studentCoursesBox.innerHTML = state.courses.length
    ? state.courses.map((c) => {
        const saved = enrolled.find((e) => e.courseId === c.id);
        const prevRow = prev.get(c.id);
        const checked = prevRow ? prevRow.checked : !!saved;
        const fee = prevRow ? prevRow.fee : (saved ? saved.fee : (c.fee ?? 0));
        return `
          <div class="course-pick${checked ? " picked" : ""}">
            <label class="check-line">
              <input type="checkbox" value="${c.id}" ${checked ? "checked" : ""} /> ${escapeHtml(c.name)} <span class="badge">${courseTypeLabel(c.type)}</span>
            </label>
            <input type="number" min="0" step="100" value="${Number(fee || 0)}" ${checked ? "" : "disabled"} aria-label="${tr("cMonthlyFee")}" />
          </div>`;
      }).join("")
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

function studentTotalDue(studentId) {
  return state.invoices
    .filter((i) => i.studentId === studentId)
    .reduce((s, i) => s + Math.max(0, i.agreedFee - i.paid), 0);
}

els.studentForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!requireEdit("students")) return;
  const name = els.studentName.value.trim();
  const phone = els.studentPhone.value.trim();
  if (!name) { toast(t("msgNameReq")); els.studentName.focus(); return; }
  if (!phone) { toast(t("msgPhoneReq")); els.studentPhone.focus(); return; }
  if (!els.studentCollege.value) { toast(t("msgCollegeReq")); return; }
  if (!els.studentGroup.value) { toast(t("msgGroupReq")); return; }
  const enrollments = [];
  for (const row of els.studentCoursesBox.querySelectorAll(".course-pick")) {
    const box = row.querySelector("input[type='checkbox']");
    if (!box.checked) continue;
    const fee = Number(row.querySelector("input[type='number']").value === "" ? 0 : row.querySelector("input[type='number']").value);
    if (Number.isNaN(fee) || fee < 0) { toast(t("msgFeeNeg")); return; }
    enrollments.push({ course_id: box.value, fee });
  }
  if (!enrollments.length) { toast(t("msgPickCourse")); return; }
  const admissionPaid = Number(els.admissionPaid.value === "" ? 0 : els.admissionPaid.value);
  if (admissionPaid < state.settings.admissionFee) { toast(t("msgAdmissionShort")); return; }

  const pStudent = {
    id: editingStudentId || "",
    name, phone,
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
  try {
    const { error } = await sb.rpc("save_student_with_admission", { p_student: pStudent, p_enrollments: enrollments });
    if (error) throw error;
    toast(editingStudentId ? t("tStudentEdit") : t("tStudentAdd"));
    logActivity(lang === "bn" ? "শিক্ষার্থী সেভ" : "Save student", name);
  } catch (err) {
    fail(err);
    return;
  } finally {
    submitBtn.disabled = false;
  }
  resetStudentForm();
  await db.loadStudents();
  await db.loadFinance();
  renderAll();
});

els.studentCancelBtn.addEventListener("click", resetStudentForm);

function studentMatches(s, query) {
  if (!query) return true;
  const hay = [s.name, s.phone, s.guardianPhone, s.whatsapp, s.college].join(" ").toLowerCase();
  return query.split(/\s+/).filter(Boolean).every((part) => hay.includes(part));
}

function renderStudents() {
  const editable = canEditTab("students");
  const query = els.studentSearch.value.trim().toLowerCase();
  const college = els.studentCollegeFilter.value || "all";
  const year = els.studentYearFilter.value || "all";

  const colleges = [...new Set(state.students.map((s) => s.college).filter(Boolean))].sort();
  const prevCollege = els.studentCollegeFilter.value || "all";
  els.studentCollegeFilter.innerHTML = [`<option value="all">${t("allColleges")}</option>`, ...colleges.map((c) => `<option value="${escapeHtml(c)}">${escapeHtml(c)}</option>`)].join("");
  els.studentCollegeFilter.value = colleges.includes(prevCollege) ? prevCollege : "all";
  const prevYear = els.studentYearFilter.value || "all";
  els.studentYearFilter.innerHTML = [
    `<option value="all">${t("allYears")}</option>`,
    `<option value="1st year">${tr("year1")}</option>`,
    `<option value="2nd year">${tr("year2")}</option>`,
  ].join("");
  els.studentYearFilter.value = ["all", "1st year", "2nd year"].includes(prevYear) ? prevYear : "all";

  const students = state.students.filter((s) => {
    if (college !== "all" && s.college !== college) return false;
    if (year !== "all" && s.year !== year) return false;
    return studentMatches(s, query);
  });

  els.studentRows.innerHTML = students.length
    ? students.map((s) => {
        const totalDue = studentTotalDue(s.id);
        const waLink = s.whatsapp ? ` <a class="wa-link" href="https://wa.me/88${escapeHtml(s.whatsapp.replace(/\D/g, ""))}" target="_blank" rel="noopener">${t("wa")}</a>` : "";
        return `
      <tr>
        <td data-label="${tr("thName")}"><strong>${escapeHtml(s.name)}</strong><br><span>${escapeHtml(s.guardian || t("noGuardian"))}</span></td>
        <td data-label="${tr("thContact")}">${escapeHtml(s.phone || "-")}${s.whatsapp ? waLink : ""}</td>
        <td data-label="${tr("thCollege")}">${escapeHtml(s.college || "-")}</td>
        <td data-label="${tr("thYear")}">${escapeHtml(yearLabel(s.year))}</td>
        <td data-label="${tr("thGroup")}">${escapeHtml(s.group || "-")}</td>
        <td data-label="${tr("thCourse")}">${escapeHtml(studentCourseNames(s).join(", ") || t("noCourse"))}</td>
        <td data-label="${tr("thFeeStatus")}"><span class="badge ${totalDue > 0 ? "due" : "paid"}">${totalDue > 0 ? `${t("due")} ${formatMoney(totalDue)}` : t("paid")}</span></td>
        ${editable ? `<td><div class="inline-tools">
          <button class="small-btn" type="button" data-edit-student="${s.id}">${t("edit")}</button>
          <button class="small-btn" type="button" data-delete-student="${s.id}">${t("del")}</button>
        </div></td>` : ""}
      </tr>`;
      }).join("")
    : `<tr><td colspan="8">${emptyState(t("emptyNoMatch"))}</td></tr>`;

  document.querySelectorAll("#students .col-action").forEach((c) => { c.style.display = editable ? "" : "none"; });
  document.querySelectorAll("[data-edit-student]").forEach((b) =>
    b.addEventListener("click", () => startEditStudent(b.dataset.editStudent)));
  document.querySelectorAll("[data-delete-student]").forEach((b) =>
    b.addEventListener("click", async () => {
      if (!requireEdit("students")) return;
      const student = state.students.find((item) => item.id === b.dataset.deleteStudent);
      if (!student) return;
      if (!confirmDelete(`${student.name} ${t("confirmDeleteStudent")}`)) return;
      try {
        const { error } = await sb.from("students").delete().eq("id", student.id);
        if (error) throw error;
      } catch (err) {
        fail(err);
        return;
      }
      toast(t("tStudentDel"));
      logActivity(lang === "bn" ? "শিক্ষার্থী ডিলিট" : "Delete student", student.name);
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
  els.studentFormTitle.textContent = t("editStudent");
  els.studentSubmitBtn.textContent = t("save");
  els.studentCancelBtn.hidden = false;
  els.studentName.value = student.name || "";
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
  switchView("students", viewTitle("students"));
  els.studentName.focus();
}

function resetStudentForm() {
  editingStudentId = null;
  els.studentForm.reset();
  els.studentFormTitle.textContent = t("newStudent");
  els.studentSubmitBtn.textContent = t("addStudent");
  els.studentCancelBtn.hidden = true;
  renderStudentOptions();
  renderStudentCourseBox();
}

els.studentSearch.addEventListener("input", renderStudents);
els.studentCollegeFilter.addEventListener("change", renderStudents);
els.studentYearFilter.addEventListener("change", renderStudents);

/* ================= courses ================= */

els.courseForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!requireEdit("courses")) return;
  const name = els.courseName.value.trim();
  if (!name) { toast(t("msgCourseReq")); els.courseName.focus(); return; }
  const fee = Number(els.courseFee.value === "" ? 0 : els.courseFee.value);
  if (Number.isNaN(fee) || fee < 0) { toast(t("msgCourseFeeNeg")); return; }
  const row = { name, type: els.courseType.value, fee, duration: els.courseDuration.value.trim() };
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
    logActivity(lang === "bn" ? "কোর্স সেভ" : "Save course", name);
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
  switchView("courses", viewTitle("courses"));
  els.courseName.focus();
}

function renderCourses() {
  const editable = canEditTab("courses");
  const filter = els.courseFilter.value;
  const courses = state.courses.filter((c) => filter === "all" || c.type === filter);
  els.courseCards.innerHTML = courses.length
    ? courses.map((course) => {
        const count = state.students.filter((s) => isEnrolled(s, course.id)).length;
        return `
          <article class="batch-card">
            <strong>${escapeHtml(course.name)}</strong>
            <span>${courseTypeLabel(course.type)} · ${formatMoney(course.fee || 0)}</span>
            <p>${escapeHtml(course.duration || t("noDesc"))}</p>
            <span class="badge">${toNum(count)} ${t("enrolledSuffix")}</span>
            ${editable ? `<div class="inline-tools" style="margin-top: 10px">
              <button class="small-btn" type="button" data-edit-course="${course.id}">${t("edit")}</button>
              <button class="small-btn" type="button" data-delete-course="${course.id}">${t("del")}</button>
            </div>` : ""}
          </article>`;
      }).join("")
    : emptyState(t("emptyCourse"));

  document.querySelectorAll("[data-edit-course]").forEach((b) =>
    b.addEventListener("click", () => startEditCourse(b.dataset.editCourse)));
  document.querySelectorAll("[data-delete-course]").forEach((b) =>
    b.addEventListener("click", async () => {
      if (!requireEdit("courses")) return;
      const course = state.courses.find((item) => item.id === b.dataset.deleteCourse);
      if (!course) return;
      if (!confirmDelete(`"${course.name}" ${t("confirmDeleteCourse")}`)) return;
      try {
        const { error } = await sb.from("courses").delete().eq("id", course.id);
        if (error) throw error;
      } catch (err) {
        fail(err);
        return;
      }
      toast(t("tCourseDel"));
      logActivity(lang === "bn" ? "কোর্স ডিলিট" : "Delete course", course.name);
      await db.loadCore();
      await db.loadStudents();
      await db.loadFinance();
      renderAll();
    }));
}

/* ================= batches ================= */

els.batchForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!isAdmin()) { toast(t("msgAdminOnly")); return; }
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
  const editable = isAdmin();
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

  const teachers = state.users.filter((u) => u.role === "teacher");
  const prevTeacher = els.offeringTeacher.value;
  els.offeringTeacher.innerHTML = [
    `<option value="">${t("noTeacherAssigned")}</option>`,
    ...teachers.map((u) => `<option value="${u.id}">${escapeHtml(u.username)}</option>`),
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
  if (!isAdmin()) { toast(t("msgAdminOnly")); return; }
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
    logActivity(lang === "bn" ? "শিডিউল সেভ" : "Save schedule", `${getCourseName(courseId)} · ${row.year_level}`);
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
  const editable = isAdmin();
  els.offeringsList.innerHTML = state.offerings.length
    ? state.offerings.map((o) => `
        <div class="compact-item">
          <div>
            <strong>${escapeHtml(getCourseName(o.courseId))}</strong>
            <span>${escapeHtml(yearLabel(o.year))} · ${escapeHtml(o.group)} · ${getTeacherName(o.teacherId)} · ${o.weekdays.map(dayLabel).join(", ")}${o.classTime ? " · " + escapeHtml(o.classTime) : ""}</span>
          </div>
          <span class="badge">${formatMoney(o.rate)} / ${lang === "bn" ? "ক্লাস" : "class"}</span>
          ${editable ? `<div class="inline-tools">
            <button class="small-btn" type="button" data-edit-offering="${o.id}">${t("edit")}</button>
            <button class="small-btn" type="button" data-delete-offering="${o.id}">${t("del")}</button>
          </div>` : ""}
        </div>`).join("")
    : emptyState(t("emptyOfferings"));

  document.querySelectorAll("[data-edit-offering]").forEach((b) =>
    b.addEventListener("click", () => {
      const offering = state.offerings.find((o) => o.id === b.dataset.editOffering);
      if (!offering || !isAdmin()) return;
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
      if (!isAdmin()) return;
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
      logActivity(lang === "bn" ? "শিডিউল ডিলিট" : "Delete schedule", getCourseName(offering.courseId));
      await db.loadCore();
      renderAll();
    }));
}

/* ================= attendance ================= */

els.attendanceDate.addEventListener("change", renderAttendanceClasses);

async function renderAttendanceClasses() {
  const date = els.attendanceDate.value || today;
  const dow = new Date(date + "T12:00:00").getDay();
  const mine = myOfferings().filter((o) => o.active && o.weekdays.includes(dow));
  mine.sort((a, b) => (a.classTime || "99:99").localeCompare(b.classTime || "99:99"));

  const sessions = await safe(sb.from("class_sessions").select("id, offering_id, status").eq("class_date", date));
  const sessionByOffering = new Map(sessions.map((s) => [s.offering_id, s]));

  els.attendanceClasses.innerHTML = mine.length
    ? mine.map((o) => {
        const session = sessionByOffering.get(o.id);
        const held = session?.status === "held";
        return `
        <button class="class-btn${activeSession.offering === o.id ? " active" : ""}" type="button" data-class="${o.id}">
          <div>
            <strong>${escapeHtml(getCourseName(o.courseId))}</strong>
            <span>${escapeHtml(yearLabel(o.year))} · ${escapeHtml(o.group)}${o.classTime ? " · " + escapeHtml(o.classTime) : ""}</span>
          </div>
          <span class="badge ${held ? "paid" : ""}">${held ? t("held") : t("scheduled")}</span>
        </button>`;
      }).join("")
    : emptyState(t("emptyClasses"));

  document.querySelectorAll("[data-class]").forEach((b) =>
    b.addEventListener("click", () => openClassRoster(b.dataset.class, date)));
  els.rosterPanel.hidden = true;
  activeSession = { offering: null, sessionId: null, marks: new Map() };
}

async function openClassRoster(offeringId, date) {
  const offering = state.offerings.find((o) => o.id === offeringId);
  if (!offering || !canMarkOffering(offering)) {
    toast(t("msgNoCoursePerm"));
    return;
  }
  document.querySelectorAll(".class-btn").forEach((b) => b.classList.toggle("active", b.dataset.class === offeringId));
  try {
    const { data: sessionId, error: sessErr } = await sb.rpc("get_or_create_class_session", { p_offering: offeringId, p_date: date });
    if (sessErr) throw sessErr;
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
  const editable = canMarkOffering(offering) && (isAdmin() || (els.attendanceDate.value || today) === today);
  els.attendanceActions.style.display = editable ? "" : "none";
  els.rosterPanel.dataset.roster = JSON.stringify(roster);
  els.attendanceRoster.innerHTML = roster.length
    ? roster.map((r) => {
        const status = activeSession.marks.get(r.id) || "";
        return `
        <div class="attendance-row">
          <div>
            <strong>${escapeHtml(r.name)}</strong>
            <span>${escapeHtml(r.college || t("dash"))} · ${escapeHtml(r.group || t("dash"))} · ${escapeHtml(yearLabel(r.year))}</span>
          </div>
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
  logActivity(lang === "bn" ? "হাজিরা" : "Attendance", `${getCourseName(state.offerings.find((o) => o.id === offeringId)?.courseId)} — ${records.length}`);
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
  const hay = [s.name, s.phone, s.college].join(" ").toLowerCase();
  return query.split(/\s+/).filter(Boolean).every((part) => hay.includes(part));
}

function renderFees() {
  if (!canView("fees")) return;
  const editable = canEditTab("fees");
  const month = els.feeMonth.value || thisMonth;

  const monthInvoices = state.invoices.filter((i) => i.month === month);
  const monthAgreed = monthInvoices.reduce((s, i) => s + i.agreedFee, 0);
  const monthPaid = monthInvoices.reduce((s, i) => s + i.paid, 0);
  const allPaid = state.invoices.reduce((s, i) => s + i.paid, 0);
  const allDue = state.invoices.reduce((s, i) => s + Math.max(0, i.agreedFee - i.paid), 0);
  els.feeCollectTotal.textContent = formatMoney(allPaid);
  els.feeCollectCount.textContent = `${tr("fMonth")}: ${formatMoney(monthPaid)} / ${formatMoney(monthAgreed)}`;

  const filter = els.feeFilter.value;
  const query = els.feeSearch.value.trim().toLowerCase();
  const students = state.students.filter((s) => {
    const due = studentTotalDue(s.id);
    if (filter === "due" && !(due > 0)) return false;
    if (filter === "paid" && !(due <= 0)) return false;
    return feeMatches(s, query);
  });

  els.feeRows.innerHTML = students.length
    ? students.map((s) => {
        const courses = (s.enrollments || [])
          .map((e) => `${escapeHtml(getCourseName(e.courseId))} (${formatMoney(e.fee)})`)
          .join(", ");
        const due = studentTotalDue(s.id);
        const paidAll = state.invoices.filter((i) => i.studentId === s.id).reduce((x, i) => x + i.paid, 0);
        return `
      <tr>
        <td data-label="${tr("thStudent")}"><strong>${escapeHtml(s.name)}</strong><br><span>${escapeHtml(s.phone || t("noPhone"))}</span></td>
        <td data-label="${tr("thCourse")}">${courses || t("noCourse")}</td>
        <td data-label="${tr("thPaid")}">${formatMoney(paidAll)}</td>
        <td data-label="${tr("thDue")}"><span class="badge ${due > 0 ? "due" : "paid"}">${formatMoney(due)}</span></td>
        ${editable ? `<td><button class="small-btn" type="button" data-add-payment="${s.id}">${t("takePayment")}</button></td>` : ""}
      </tr>`;
      }).join("")
    : `<tr><td colspan="5">${emptyState(t("emptyFeeView"))}</td></tr>`;

  document.querySelectorAll("#fees .col-action").forEach((c) => { c.style.display = editable ? "" : "none"; });
  document.querySelectorAll("[data-add-payment]").forEach((b) =>
    b.addEventListener("click", async () => {
      if (!requireEdit("fees")) return;
      const student = state.students.find((item) => item.id === b.dataset.addPayment);
      if (!student) return;
      const due = studentTotalDue(student.id);
      if (due <= 0) { toast(t("msgNoDue")); return; }
      const raw = prompt(`${student.name} ${t("promptPayment")} ${formatMoney(due)}:`, String(due));
      if (raw === null) return;
      const amount = Number(raw);
      if (!Number.isFinite(amount) || amount <= 0) { toast(t("msgAmtPos")); return; }
      try {
        const { error } = await sb.rpc("pay_student_fees", { p_student: student.id, p_amount: amount, p_note: "" });
        if (error) throw error;
      } catch (err) {
        fail(err);
        return;
      }
      toast(`${formatMoney(amount)} ${t("tPaid")}`);
      logActivity(lang === "bn" ? "ফি পেমেন্ট" : "Fee payment", `${student.name} — ${formatMoney(amount)}`);
      await db.loadFinance();
      renderAll();
    }));

  const paidInvoices = state.invoices.filter((i) => i.paid > 0).reverse();
  els.paymentHistory.innerHTML = paidInvoices.length
    ? paidInvoices.slice(0, 8).map((i) => {
        const student = state.students.find((s) => s.id === i.studentId);
        return `
          <div class="compact-item">
            <div><strong>${escapeHtml(student ? student.name : t("byDeletedStudent"))}</strong><span>${escapeHtml(getCourseName(i.courseId))} · ${escapeHtml(i.month)}</span></div>
            <span class="badge paid">${formatMoney(i.paid)}</span>
          </div>`;
      }).join("")
    : emptyState(t("emptyPayments"));
}

els.feeFilter.addEventListener("change", renderFees);
els.feeSearch.addEventListener("input", renderFees);

/* ================= money / bank / dues ================= */

els.moneyForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!requireEdit("money")) return;
  const amount = Number(els.moneyAmount.value);
  if (!Number.isFinite(amount) || amount <= 0) { toast(t("msgAmtPos")); return; }
  const row = {
    id: uuid(), date: els.moneyDate.value || today, type: els.moneyType.value,
    category: els.moneyCategory.value.trim() || t("general"), amount,
    note: els.moneyNote.value.trim(), by_username: currentUser ? currentUser.username : "",
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
  toast(t("tEntry"));
  logActivity(lang === "bn" ? "হিসাব এন্ট্রি" : "Money entry", `${row.category} — ${formatMoney(amount)}`);
  await db.loadFinance();
  renderAll();
});

function renderMoney() {
  if (!canView("money")) return;
  const editable = canEditTab("money");
  const monthSel = els.moneyMonth.value;
  const daySel = els.moneyDay.value;
  const inScope = (m) => {
    if (daySel) return m.date === daySel;
    if (monthSel) return (m.date || "").slice(0, 7) === monthSel;
    return true;
  };
  const scoped = state.money.filter(inScope);
  const income = scoped.filter((m) => m.type === "income").reduce((s, m) => s + m.amount, 0);
  const cost = scoped.filter((m) => m.type === "expense").reduce((s, m) => s + m.amount, 0);

  els.metricIncome.textContent = formatMoney(income);
  els.metricCost.textContent = formatMoney(cost);
  els.metricBalance.textContent = formatMoney(income - cost);
  els.metricMonthNet.textContent = formatMoney(
    state.money.filter((m) => (m.date || "").slice(0, 7) === thisMonth)
      .reduce((s, m) => s + (m.type === "income" ? m.amount : -m.amount), 0),
  );

  const filter = els.moneyFilter.value;
  const rows = scoped.filter((m) => filter === "all" || m.type === filter);
  els.moneyRows.innerHTML = rows.length
    ? rows.map((m) => `
      <tr>
        <td data-label="${tr("thDate")}">${escapeHtml(m.date || "-")}</td>
        <td data-label="${tr("thType")}"><span class="badge ${m.type === "income" ? "paid" : "due"}">${m.type === "income" ? tr("income") : tr("expense")}</span></td>
        <td data-label="${tr("thCategory")}"><strong>${escapeHtml(m.category || t("general"))}</strong><br><span>${escapeHtml(m.note || (m.by ? t("entryBy") + m.by : ""))}</span></td>
        <td data-label="${tr("thAmount")}">${formatMoney(m.amount)}</td>
        ${editable ? `<td><button class="small-btn" type="button" data-delete-money="${m.id}">${t("del")}</button></td>` : ""}
      </tr>`).join("")
    : `<tr><td colspan="5">${emptyState(t("emptyMoney"))}</td></tr>`;

  document.querySelectorAll("#money .col-action").forEach((c) => { c.style.display = editable ? "" : "none"; });
  document.querySelectorAll("[data-delete-money]").forEach((b) =>
    b.addEventListener("click", async () => {
      if (!requireEdit("money")) return;
      const entry = state.money.find((m) => m.id === b.dataset.deleteMoney);
      if (!entry) return;
      if (!confirmDelete(`${entry.category || ""} — ${formatMoney(entry.amount)}: ${t("confirmDeleteMoney")}`)) return;
      try {
        const { error } = await sb.from("money_entries").delete().eq("id", entry.id);
        if (error) throw error;
      } catch (err) {
        fail(err);
        return;
      }
      toast(t("tEntryDel"));
      logActivity(lang === "bn" ? "হিসাব ডিলিট" : "Delete money", `${entry.category || ""} — ${formatMoney(entry.amount)}`);
      await db.loadFinance();
      renderAll();
    }));
}

els.moneyMonth.addEventListener("change", () => { els.moneyDay.value = ""; renderMoney(); });
els.moneyDay.addEventListener("change", () => { els.moneyMonth.value = ""; renderMoney(); });
els.moneyFilter.addEventListener("change", renderMoney);

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
  logActivity(lang === "bn" ? "ব্যাংক এন্ট্রি" : "Bank entry", `${row.direction} — ${formatMoney(amount)}`);
  await db.loadFinance();
  renderAll();
});

els.bankOpeningBtn.addEventListener("click", async () => {
  if (!isAdmin()) { toast(t("msgAdminOnly")); return; }
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
  logActivity(lang === "bn" ? "বকেয়া যোগ" : "Add due", `${title} — ${formatMoney(amount)}`);
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
  if (!isAdmin()) { toast(t("msgAdminOnly")); return; }
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
  logActivity(lang === "bn" ? "শিক্ষক পেমেন্ট" : "Teacher payment", `${getTeacherName(teacherId)} — ${formatMoney(amount)}`);
  await db.loadPayroll();
  renderAll();
});

/* ================= settings ================= */

function renderSettings() {
  if (!isAdmin()) return;
  els.setName.value = state.settings.coachingName;
  els.setAdmissionFee.value = state.settings.admissionFee;
  if (logoPicked !== null) {
    els.logoPreview.src = logoPicked || "";
    els.logoPreview.hidden = !logoPicked;
    els.removeLogoBtn.hidden = !logoPicked;
  } else {
    els.logoPreview.src = state.settings.logoData || "";
    els.logoPreview.hidden = !state.settings.logoData;
    els.removeLogoBtn.hidden = !state.settings.logoData;
  }
  renderChips(els.collegesBox, state.settings.colleges, "college");
  renderChips(els.groupsBox, state.settings.groups, "group");
}

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
  if (!isAdmin()) { toast(t("msgAdminOnly")); return; }
  const name = els.setName.value.trim();
  if (!name) return;
  const patch = { coaching_name: name, updated_at: new Date().toISOString() };
  if (logoPicked !== null) {
    patch.logo_data = logoPicked;
  }
  if (await saveSettings(patch)) {
    logoPicked = null;
    logActivity(lang === "bn" ? "ব্র্যান্ডিং সেভ" : "Save branding", name);
  }
});

els.setLogo.addEventListener("change", () => {
  const file = els.setLogo.files[0];
  if (!file) return;
  if (file.size > 300 * 1024) {
    toast(t("msgLogoBig"));
    els.setLogo.value = "";
    return;
  }
  const reader = new FileReader();
  reader.onload = () => {
    logoPicked = String(reader.result);
    els.logoPreview.src = logoPicked;
    els.logoPreview.hidden = false;
    els.removeLogoBtn.hidden = false;
  };
  reader.readAsDataURL(file);
});

els.removeLogoBtn.addEventListener("click", () => {
  logoPicked = "";
  els.setLogo.value = "";
  els.logoPreview.hidden = true;
  els.removeLogoBtn.hidden = true;
});

els.admissionForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!isAdmin()) { toast(t("msgAdminOnly")); return; }
  const fee = Number(els.setAdmissionFee.value === "" ? 0 : els.setAdmissionFee.value);
  if (Number.isNaN(fee) || fee < 0) { toast(t("msgFeeNeg")); return; }
  if (await saveSettings({ admission_fee: fee, updated_at: new Date().toISOString() })) {
    logActivity(lang === "bn" ? "ভর্তি ফি সেভ" : "Save admission fee", formatMoney(fee));
  }
});

els.collegeAddForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!isAdmin()) return;
  const value = els.addCollegeInput.value.trim();
  if (!value || state.settings.colleges.includes(value)) return;
  await saveSettings({ colleges: [...state.settings.colleges, value] });
  els.addCollegeInput.value = "";
});

els.groupAddForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!isAdmin()) return;
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
      <input type="checkbox" value="${tab.id}" ${selected.includes(tab.id) ? "checked" : ""} /> ${lang === "bn" ? tab.labelBn : tab.labelEn}
    </label>`).join("");
}

function renderGrantsBox(selected) {
  els.fieldGrantsBox.innerHTML = FIELD_GRANTS.map((g) => `
    <label class="check-line">
      <input type="checkbox" value="${g.id}" ${selected.includes(g.id) ? "checked" : ""} /> ${lang === "bn" ? g.labelBn : g.labelEn}
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

async function createUserViaEdge(email, password, profile) {
  const { data, error } = await sb.functions.invoke("admin-users", {
    body: { action: "create", email, password, profile },
  });
  if (error) {
    const real = await edgeErrorMessage(error);
    if (/not found/i.test(real)) return { skipped: true };
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
  if (!newId) throw new Error(t("msgEmailConfirm"));
  const { error: profErr } = await sb.from("profiles").insert({
    id: newId, username: profile.username, role: profile.role, tabs: profile.tabs,
    money_edit: !!profile.money_edit, student_field_grants: profile.student_field_grants || [],
    teacher_payroll_access: !!profile.teacher_payroll_access,
    student_id: profile.student_id || null,
  });
  if (profErr) throw profErr;
  if (signUpData.session && savedSession) await sb.auth.setSession(savedSession);
  return { id: newId, needsConfirm: !signUpData.session };
}

els.userForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!isAdmin()) { toast(t("msgAdminOnly")); return; }
  const username = els.userName.value.trim().toLowerCase();
  const email = els.userEmail.value.trim().toLowerCase();
  const pass = els.userPass.value;
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
      logActivity(lang === "bn" ? "ইউজার এডিট" : "Edit user", username);
    } else {
      if (!email) { toast(t("msgNeedEmail")); els.userEmail.focus(); return; }
      if (state.users.some((u) => u.username === username)) { toast(t("msgUserExists")); return; }
      if (!pass || pass.length < 4) { toast(t("msgPassShort")); return; }
      let result = await createUserViaEdge(email, pass, profile);
      if (result.skipped) {
        console.warn("admin-users edge function not deployed; using browser signUp fallback");
        result = await createUserFallback(email, pass, profile);
      }
      toast(result.needsConfirm ? t("msgEmailConfirm") : `"${username}" ${t("tUserAdd")}`);
      logActivity(lang === "bn" ? "ইউজার তৈরি" : "Create user", `${username} — ${roleLabel(role)}`);
    }
  } catch (err) {
    fail(err);
    return;
  }
  resetUserForm();
  await db.loadAdmin();
  await db.loadCore();
  renderAll();
});

els.userCancelBtn.addEventListener("click", resetUserForm);

function resetUserForm() {
  editingUserId = null;
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

  els.userRows.innerHTML = state.users.length
    ? state.users.map((u) => {
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
        const { error } = await sb.functions.invoke("admin-users", { body: { action: "delete", id: user.id } });
        if (error) {
          const real = await edgeErrorMessage(error);
          if (/not found/i.test(real)) {
            const { error: delErr } = await sb.from("profiles").delete().eq("id", user.id);
            if (delErr) throw delErr;
            toast(t("msgUserDeleted"));
          } else if (real) {
            throw new Error(real);
          } else {
            throw error;
          }
        } else {
          toast(t("msgUserDeleted"));
        }
      } catch (err) {
        fail(err);
        return;
      }
      logActivity(lang === "bn" ? "ইউজার ডিলিট" : "Delete user", user.username);
      await db.loadAdmin();
      await db.loadCore();
      renderAll();
    }));
}

/* ================= activity ================= */

function renderActivity() {
  if (!isAdmin() || !els.activityRows) return;
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
  const allDue = state.invoices.reduce((s, i) => s + Math.max(0, i.agreedFee - i.paid), 0);

  let presentCount = 0;
  let absentCount = 0;
  if (isAdmin()) {
    const sessions = await safe(sb.from("class_sessions").select("class_attendance(status)").eq("class_date", today));
    for (const s of sessions || []) {
      for (const rec of s.class_attendance || []) {
        if (rec.status === "present") presentCount++;
        else absentCount++;
      }
    }
  }

  els.metricStudents.textContent = toNum(state.students.length);
  els.metricBatches.textContent = toNum(state.batches.length);
  els.metricPresent.textContent = toNum(presentCount);
  els.metricDue.textContent = formatMoney(allDue);

  els.recentStudents.innerHTML = state.students.length
    ? state.students.slice(0, 5).map((s) => `
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
    .map((c) => ({ name: c.name, count: state.students.filter((s) => isEnrolled(s, c.id)).length }))
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
  const due = state.invoices.reduce((s, i) => s + Math.max(0, i.agreedFee - i.paid), 0);
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
    time: new Date().toLocaleTimeString(lang === "bn" ? "bn-BD" : "en-GB", { hour: "2-digit", minute: "2-digit" }),
    createdAt: Date.now(),
  };
  state.activity.unshift(entry);
  sb.from("activity_log").insert({
    id: entry.id, username: entry.user, action: entry.action, detail: entry.detail, date: entry.date,
  }).then(({ error }) => { if (error) console.debug("activity log:", error.message); });
}

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
  logActivity(lang === "bn" ? "সব ডেটা মুছলো" : "Cleared all data", "");
  await db.loadAll();
  renderAll();
});

els.seedDataBtn.addEventListener("click", async () => {
  if (!isAdmin()) return;
  const bn = lang === "bn";
  const courseA = uuid();
  const courseB = uuid();
  const offeringA = uuid();
  const offeringB = uuid();
  const s1 = uuid();
  const s2 = uuid();
  const s3 = uuid();
  const monthStart = thisMonth + "-01";
  const admission = state.settings.admissionFee;
  const push = async (table, rows) => {
    if (!rows.length) return;
    const { error } = await sb.from(table).insert(rows);
    if (error) throw error;
  };
  try {
    await push("courses", [
      { id: courseA, name: bn ? "এইচএসসি ফিজিক্স" : "HSC Physics", type: "subject", fee: 2000, duration: bn ? "সপ্তাহে ৩ দিন" : "3 days/week" },
      { id: courseB, name: bn ? "এইচএসসি বিজ্ঞান প্যাকেজ" : "HSC Science Package", type: "package", fee: 5000, duration: "Physics + Chemistry + Math" },
    ]);
    await push("course_offerings", [
      { id: offeringA, course_id: courseA, year_level: "1st year", group_name: "Science", weekdays: [0, 2, 4], class_time: "17:00", rate_per_class: 500 },
      { id: offeringB, course_id: courseB, year_level: "2nd year", group_name: "Science", weekdays: [1, 3], class_time: "18:00", rate_per_class: 700 },
    ]);
    await push("students", [
      { id: s1, name: "Farhan Ahmed", phone: "01710000001", guardian: "", guardian_phone: "01710000011", whatsapp: "01710000001", college: "Ramganj Govt College", year_level: "1st year", group_name: "Science", paid: 1500, status: "active" },
      { id: s2, name: "Nusrat Jahan", phone: "01710000002", guardian: "", guardian_phone: "01710000012", whatsapp: "01710000002", college: "Ramganj Model College", year_level: "2nd year", group_name: "Science", paid: 5000, status: "active" },
      { id: s3, name: "Tanvir Hasan", phone: "01710000003", guardian: "", guardian_phone: "01710000013", whatsapp: "01710000003", college: "Alia Madrasha", year_level: "1st year", group_name: "Arts", paid: 1800, status: "active" },
    ]);
    await push("enrollments", [
      { student_id: s1, course_id: courseA, fee: 2000 },
      { student_id: s2, course_id: courseB, fee: 5000 },
      { student_id: s3, course_id: courseA, fee: 1800 },
      { student_id: s3, course_id: courseB, fee: 4500 },
    ]);
    await push("admission_payments", [
      { student_id: s1, required_amount: admission, amount_paid: admission },
      { student_id: s2, required_amount: admission, amount_paid: admission },
      { student_id: s3, required_amount: admission, amount_paid: admission },
    ]);
    await push("student_fee_invoices", [
      { student_id: s1, course_id: courseA, billing_month: monthStart, agreed_fee: 2000 },
      { student_id: s2, course_id: courseB, billing_month: monthStart, agreed_fee: 5000 },
      { student_id: s3, course_id: courseA, billing_month: monthStart, agreed_fee: 1800 },
      { student_id: s3, course_id: courseB, billing_month: monthStart, agreed_fee: 4500 },
    ]);
    const inv1 = (await sb.from("student_fee_invoices").select("id").eq("student_id", s1).eq("course_id", courseA).maybeSingle()).data;
    const inv2 = (await sb.from("student_fee_invoices").select("id").eq("student_id", s2).eq("course_id", courseB).maybeSingle()).data;
    await push("student_fee_payments", [
      ...(inv1 ? [{ invoice_id: inv1.id, amount: 1500 }] : []),
      ...(inv2 ? [{ invoice_id: inv2.id, amount: 5000 }] : []),
    ]);
    await push("money_entries", [
      { date: today, type: "income", category: bn ? "ভর্তি ফি" : "Admission fee", amount: 15000, note: "", by_username: currentUser.username },
      { date: today, type: "expense", category: bn ? "ঘর ভাড়া" : "Room rent", amount: 8000, note: "", by_username: currentUser.username },
    ]);
    await push("dues", [
      { title: bn ? "বিদ্যুৎ বিল" : "Electricity bill", amount: 2200, date: today, paid: false },
    ]);
    await push("bank_transactions", [
      { transaction_date: today, direction: "deposit", amount: 50000, description: bn ? "ওপেনিং জমা" : "Opening deposit", created_by: currentUser.id },
    ]);
  } catch (err) {
    fail(err);
    return;
  }
  toast(t("tDemo"));
  logActivity(lang === "bn" ? "ডেমো ডেটা" : "Demo data", "");
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
    logActivity(lang === "bn" ? "ব্যাকআপ আপলোড" : "Backup import", file.name || "");
    await db.loadAll();
    renderAll();
    els.importFileInput.value = "";
  };
  reader.readAsText(file);
});

/* ================= render all ================= */

function renderAll() {
  applyBrand();
  renderToday();
  renderStudentOptions();
  renderStudentCourseBox();
  renderOfferingForm();
  renderBatches();
  renderStudents();
  renderCourses();
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
