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
let partyCodes = {};
let users = [];
let dailyNotes = [];
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