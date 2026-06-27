// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  STATE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
let records = [];
let payments = [];
let parties = [];
let sectors = [];
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