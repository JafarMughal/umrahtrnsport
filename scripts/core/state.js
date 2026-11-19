// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  STATE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
let records = [];
let deletedRecords = [];
let payments = [];
let parties = [];
let hajiParties = [];
let sectors = [];
let shirkas = [];
let transports = [];
let transportNatures = [];
let vehicleRates = [];
let partyCodes = {};
let users = [];
let dailyNotes = [];
let umrahBookings = [];
let umrahVouchers = [];
let loggedInUser = null;
let isFirebaseReady = false;
let fbLogo = null;
let fbAppName = {};
let fbAppSub = {};
let _delResolve = null;
let deletePassword = localStorage.getItem('uts_delete_pwd') || 'admin123';
let lang = localStorage.getItem('uts_lang') || 'ur';
let _sdTimer = {};
let _mt = 'sector', _mc = 'entry';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  LEGACY / FAKE NAMES FILTER
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const _LEGACY_HAJI_NAMES = new Set([
    'القریشی ٹورز', 'الرحمان ٹریولز', 'الحرمین ٹورز اینڈ ٹریولز', 'ضیوف الرحمن گروپ',
    'المروہ ٹریولز', 'الصفا عمرہ گروپ', 'کاروان فیصل', 'کاروان مدینہ',
    'لبیک ٹورز اینڈ ٹریولز', 'باب الحرم ٹریولز', 'نور الہدیٰ ٹورز', 'قافلہ حرمین'
]);

const _LEGACY_SHIRKA_NAMES = new Set([
    'الرواد', 'الشہداء', 'المختار', 'الدولية', 'ضيوف الرحمن',
    'العالمية', 'رواحل', 'سماء المشاعر', 'قافلة الإيمان', 'دلہ',
    'سدرہ', 'مواسم', 'انوار الحرمین', 'فنادق الہدایہ', 'دار الایمان',
    'الماسیہ', 'باب السلام'
]);

const _LEGACY_PARTY_NAMES = new Set([
    'ٹرانسپورٹر الف', 'ٹرانسپورٹر ب', 'Transporter A', 'Transporter B',
    'المجموعة الأولى', 'المجموعة الثانية', 'الناقل الأول', 'الناقل الثاني'
]);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  ROLE-BASED ACCESS CONTROL STATE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
let currentUserRole = null;   // superadmin | admin | operator | viewer
let isSuperAdmin = false;

// Default granular permissions per role (loaded from Firebase or used as default)
let rolePermissions = {
    admin: {
        showAmounts: true,
        showPayments: true,
        canExport: true,
        canPrint: true,
        showReport: true,
        showDailyNote: true,
        showVoucher: true
    },
    operator: {
        showAmounts: true,
        showPayments: true,
        canExport: true,
        canPrint: true,
        showReport: true,
        showDailyNote: true,
        showVoucher: true
    },
    viewer: {
        showAmounts: false,
        showPayments: false,
        canExport: false,
        canPrint: true,
        showReport: true,
        showDailyNote: true,
        showVoucher: true
    }
};

// Expose state references on window
if (typeof window !== 'undefined') {
    window.records = records;
    window.deletedRecords = deletedRecords;
    window.payments = payments;
    window.parties = parties;
    window.hajiParties = hajiParties;
    window.sectors = sectors;
    window.shirkas = shirkas;
    window.transports = transports;
    window.transportNatures = transportNatures;
    window.vehicleRates = vehicleRates;
    window.partyCodes = partyCodes;
    window.users = users;
    window.dailyNotes = dailyNotes;
    window.umrahBookings = umrahBookings;
    window.umrahVouchers = umrahVouchers;
    window.rolePermissions = rolePermissions;
    window._LEGACY_HAJI_NAMES = _LEGACY_HAJI_NAMES;
    window._LEGACY_SHIRKA_NAMES = _LEGACY_SHIRKA_NAMES;
    window._LEGACY_PARTY_NAMES = _LEGACY_PARTY_NAMES;
}
