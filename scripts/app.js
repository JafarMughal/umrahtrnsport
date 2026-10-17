// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  FIREBASE INIT - FINAL
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
document.addEventListener('DOMContentLoaded', async () => {
    if (typeof loadComponentPages === 'function') {
        await loadComponentPages();
    }
    if (!users || !users.length) {
        users = [{ username: 'admin', role: 'admin' }];
    }

    window.loadData = () => {
        db.ref('/').once('value').then(snapshot => {
            const data = snapshot.val() || {};
            const toArray = (v) => Array.isArray(v) ? v : (v && typeof v === 'object' ? Object.values(v) : []);
            records = toArray(data.records);
            deletedRecords = toArray(data.deletedRecords);
            payments = toArray(data.payments);
            parties = toArray(data.parties);
            sectors = toArray(data.sectors);
            shirkas = toArray(data.shirkas);
            transports = toArray(data.transports);
            partyCodes = data.partyCodes || {};
            users = toArray(data.users);
            if (!users.length) users = [{ username: 'admin', role: 'superadmin', disabled: false, createdAt: '2024-01-01', createdBy: 'system' }];
            dailyNotes = toArray(data.dailyNotes);
            hajiParties = toArray(data.hajiParties);
            const settings = data.settings || {};
            fbLogo = settings.logo || null;
            fbAppName = settings.appName || {};
            fbAppSub = settings.appSub || {};
            // Load role permissions from Firebase
            if (data.rolePermissions) applyGranularPerms(data.rolePermissions);

            if (!parties.length) { parties = (T[lang] || T.ur).defaultParties.slice(); svP(); }
            if (!sectors.length) { sectors = (T[lang] || T.ur).defaultSectors.slice(); svS(); }
            if (!transports.length) { transports = ['بس', 'وین', 'کار', 'کوچ']; svTr(); }
            parties.forEach(p => getCode(p));

            if (!hajiParties.length && records.length > 0) {
                const hSet = new Set();
                records.forEach(r => {
                    if (r.newParty) {
                        r.newParty.split(',').map(s => s.trim()).filter(s => s).forEach(s => hSet.add(s));
                    }
                });
                hajiParties = Array.from(hSet);
                if (hajiParties.length) svHP();
            }

            initUsers().then(() => {
                isFirebaseReady = true;
                const fbLoader = document.getElementById('firebase-loader');
                if (fbLoader) fbLoader.style.display = 'none';
                applyLogo(fbLogo);
                setLang(lang);
                checkAuth();
                refreshAllDrops();
                if (loggedInUser && typeof showPage === 'function') showPage(currentActiveTab);
                const eDate = document.getElementById('e-date'); if (eDate) eDate.value = today();
                const pDate = document.getElementById('p-date'); if (pDate) pDate.value = today();
                if (typeof setNextVoucher === 'function') setNextVoucher();
                if (typeof renderDailyNoteReport === 'function') renderDailyNoteReport();
            });
        }).catch(error => {
            console.error("Firebase Read Error:", error);

            const getLocal = (k) => {
                try {
                    const val = localStorage.getItem('uts_' + k);
                    return val ? JSON.parse(val) : null;
                } catch (e) { return null; }
            };
            parties = getLocal('parties') || (T[lang] || T.ur).defaultParties.slice();
            sectors = getLocal('sectors') || (T[lang] || T.ur).defaultSectors.slice();
            shirkas = getLocal('shirkas') || [];
            transports = getLocal('transports') || ['بس', 'وین', 'کار', 'کوچ'];
            users = getLocal('users') || [{ username: 'admin', role: 'admin' }];
            records = getLocal('records') || [];
            deletedRecords = getLocal('deletedRecords') || [];
            payments = getLocal('payments') || [];
            partyCodes = getLocal('partyCodes') || {};
            dailyNotes = getLocal('dailyNotes') || [];
            hajiParties = getLocal('hajiParties') || [];
            parties.forEach(p => {
                if (typeof getCode === 'function') getCode(p);
            });

            isFirebaseReady = true;
            const fbLoader = document.getElementById('firebase-loader');
            if (fbLoader) fbLoader.style.display = 'none';
            applyLogo(null);
            setLang(lang);
            checkAuth();
            refreshAllDrops();
            if (loggedInUser && typeof showPage === 'function') showPage(currentActiveTab);
            const eDate = document.getElementById('e-date'); if (eDate) eDate.value = today();
            const pDate = document.getElementById('p-date'); if (pDate) pDate.value = today();
            if (typeof setNextVoucher === 'function') setNextVoucher();
            if (typeof renderDailyNoteReport === 'function') renderDailyNoteReport();

            showFirebaseStatusNotice(error);
        });
    };
    const loadData = window.loadData;

        // Attach listener only after auth
        db.ref('/').on('value', snapshot => {
            if (isFirebaseReady && snapshot.exists()) {
                const data = snapshot.val() || {};
                const toArray = (v) => Array.isArray(v) ? v : (v && typeof v === 'object' ? Object.values(v) : []);
                // Firebase سے آنے والا records merge کریں — local میں موجود IDs کو محفوظ رکھیں
                const fbRecords = toArray(data.records);
                const fbIds = new Set(fbRecords.map(r => r.id));
                const localOnly = records.filter(r => !fbIds.has(r.id));
                records = localOnly.length > 0 ? [...fbRecords, ...localOnly] : fbRecords;
                payments = data.payments !== undefined ? toArray(data.payments) : payments;
                parties = data.parties !== undefined ? toArray(data.parties) : parties;
                sectors = data.sectors !== undefined ? toArray(data.sectors) : sectors;
                shirkas = data.shirkas !== undefined ? toArray(data.shirkas) : shirkas;
                transports = data.transports !== undefined ? toArray(data.transports) : transports;
                partyCodes = data.partyCodes || partyCodes;
                users = data.users !== undefined ? toArray(data.users) : users;
                dailyNotes = data.dailyNotes !== undefined ? toArray(data.dailyNotes) : dailyNotes;
                hajiParties = data.hajiParties !== undefined ? toArray(data.hajiParties) : hajiParties;
                const settings = data.settings || {};
                fbLogo = settings.logo || fbLogo;
                fbAppName = settings.appName || fbAppName;
                fbAppSub = settings.appSub || fbAppSub;

                applyLogo(fbLogo);
                loadAppName(lang);
                refreshAllDrops();

                const activePage = document.querySelector('.page.active');
                if (activePage) {
                    if (activePage.id === 'page-entry') { todayStats(); fillTransportNatureDropdown(); }
                    if (activePage.id === 'page-payment') renderPayments();
                    if (activePage.id === 'page-ledger') renderLedger();

                    // ← یہاں تبدیلی کی گئی ہے: initRecordsPage() استعمال کریں
                    if (activePage.id === 'page-records') {
                        if (typeof initRecordsPage === 'function') {
                            initRecordsPage();
                        } else {
                            filterRecords();
                        }
                    }

                    if (activePage.id === 'page-dailynote') { fillTransportNatureDropdown(); renderDailyNoteReport(); }
                    if (activePage.id === 'page-report') genReport();
                    if (activePage.id === 'page-admin') renderAdminPanel();
                    if (activePage.id === 'page-settings') {
                        renderPartyList();
                        renderSectorList();
                        renderTransportList();
                        renderShirkaList();
                        renderHajiPartyList();
                    }
                }
                // Always re-apply permissions when Firebase data updates
                if (data.rolePermissions) applyGranularPerms(data.rolePermissions);
                else enforcePermissions();
            }
        }, (error) => {
            console.warn("Firebase listener error:", error);
        });

    auth.onAuthStateChanged(user => {
        if (user) {
            const email = user.email || '';
            loggedInUser = email.split('@')[0] || 'admin';
            const found = users.find(x => x.username.toLowerCase() === loggedInUser.toLowerCase());
            if (!found) {
                const isFirstAdmin = (loggedInUser === 'admin' || loggedInUser === 'jafarmughal');
                users.push({ username: loggedInUser, role: isFirstAdmin ? 'superadmin' : 'operator', disabled: false, createdAt: new Date().toISOString().slice(0, 10), createdBy: 'system' });
                svU();
            }
            setCurrentUserRole(loggedInUser);
            loadData();
        } else {
            loggedInUser = null;
            if (!isFirebaseReady) {
                isFirebaseReady = true;
                document.getElementById('firebase-loader').style.display = 'none';
            }
            checkAuth();
        }
    });
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  EXPOSE FUNCTIONS GLOBALLY
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
window.verifyPassword = verifyPassword;
window.confirmDeleteModal = confirmDeleteModal;
window.closeDeleteModal = closeDeleteModal;
window.login = login;
window.logout = logout;
window.addUser = addUser;
window.deleteUser = deleteUser;
window.toggleUserDisabled = toggleUserDisabled;
window.changeUserRole = changeUserRole;
window.renderAdminUserTable = renderAdminUserTable;
window.renderAdminPanel = renderAdminPanel;
window.switchAdminTab = switchAdminTab;
window.onPermToggle = onPermToggle;
window.savePermissions = savePermissions;
window.saveAdminUsers = saveAdminUsers;
window.canDo = canDo;
window.getMyPerms = getMyPerms;
window.enforcePermissions = enforcePermissions;
window.applyGranularPerms = applyGranularPerms;
window.setLang = setLang;
window.showPage = showPage;
window.addFromSettings = addFromSettings;
window.deleteItem = deleteItem;
window.onTransportChange = onTransportChange;
window.calcE = calcE;
window.addEntry = addEntry;
window.editRecord = editRecord;
window.deleteRecord = deleteRecord;
window.clearEntryForm = clearEntryForm;
window.addPayment = addPayment;
window.deletePay = deletePay;
window.clearLedgerFilter = clearLedgerFilter;
window.renderLedger = renderLedger;
window.filterRecords = filterRecords;
window.clearFilter = clearFilter;
window.toggleReportParty = toggleReportParty;
window.genReport = genReport;
window.printCurrentPage = printCurrentPage;
window.exportReportExcel = exportReportExcel;
window.exportLedgerExcel = exportLedgerExcel;
window.tripTypeLabel = tripTypeLabel;
window.clearDailyNoteReport = clearDailyNoteReport;
window.renderDailyNoteReport = renderDailyNoteReport;
window.fillTransportNatureDropdown = fillTransportNatureDropdown;
window.handleLogoUpload = handleLogoUpload;
window.handleLogoDrop = handleLogoDrop;
window.removeLogo = removeLogo;
window.saveAppSettings = saveAppSettings;
window.switchSettingsTab = switchSettingsTab;
window.editItem = editItem;
window.cancelEditItem = cancelEditItem;
window.saveItemEdit = saveItemEdit;
window.sdFilter = sdFilter;
window.sdOpen = sdOpen;
window.sdBlur = sdBlur;
window.sdSelect = sdSelect;
window.openModal = openModal;
window.closeModal = closeModal;
window.confirmModal = confirmModal;
window.todayStats = todayStats;
window.renderUsers = renderUsers;
window.renderPartyList = renderPartyList;
window.renderSectorList = renderSectorList;
window.renderTransportList = renderTransportList;
window.renderShirkaList = renderShirkaList;
window.renderHajiPartyList = renderHajiPartyList;
window.renderPayments = renderPayments;
window.renderPayHead = renderPayHead;
window.renderRecHead = renderRecHead;
window.renderRecords = renderRecords;
window.setNextVoucher = setNextVoucher;
window.genVoucher = genVoucher;
window.uid = uid;
window.fd = fd;
window.sar = sar;
window.today = today;
window.getCode = getCode;
window.genCode = genCode;
window.isSharing = isSharing;
window.formatTime12 = formatTime12;
window.L_arrow = L_arrow;
window.togglePasswordVisibility = togglePasswordVisibility;
window.exportReportExcel = exportReportExcel;
window.exportLedgerExcel = exportLedgerExcel;
window.copyVoucher = copyVoucher;
window.closeCopyModal = closeCopyModal;
window.confirmCopyVoucher = confirmCopyVoucher;
window.openEditRecordModal = typeof openEditRecordModal !== 'undefined' ? openEditRecordModal : null;
window.closeEditRecordModal = typeof closeEditRecordModal !== 'undefined' ? closeEditRecordModal : null;
window.saveRecordEditModal = typeof saveRecordEditModal !== 'undefined' ? saveRecordEditModal : null;
window.calcEditRecordTotal = typeof calcEditRecordTotal !== 'undefined' ? calcEditRecordTotal : null;
window.toggleEditFlightDetails = typeof toggleEditFlightDetails !== 'undefined' ? toggleEditFlightDetails : null;
window.filterTableColumns = filterTableColumns;
window.switchRecordsTab = switchRecordsTab;
window.toggleRecordCheck = toggleRecordCheck;
window.filterPayments = filterPayments;

// ← یہ فنکشن بھی گلوبل کر دیں تاکہ app.js کال کر سکے
window.initRecordsPage = initRecordsPage;
window.exportAllDataBackup = typeof exportAllDataBackup !== 'undefined' ? exportAllDataBackup : null;
window.copyBackupToClipboard = typeof copyBackupToClipboard !== 'undefined' ? copyBackupToClipboard : null;
window.importAllDataBackup = typeof importAllDataBackup !== 'undefined' ? importAllDataBackup : null;
window.pasteBackupFromPrompt = typeof pasteBackupFromPrompt !== 'undefined' ? pasteBackupFromPrompt : null;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  FIREBASE STATUS NOTICE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function showFirebaseStatusNotice(error) {
    let isPerm = error && (error.code === 'PERMISSION_DENIED' || (error.message && error.message.toLowerCase().includes('permission_denied')));
    let msg = isPerm 
        ? '⚠️ فائر بیس ڈیٹا بیس میں رولز بلاک ہیں (Permission Denied)۔ براہ کرم Firebase Console میں Realtime Database Rules کو درست کریں۔ فی الحال لوکل ڈیٹا استعمال ہو رہا ہے۔'
        : '⚠️ فائر بیس سے رابطہ نہیں ہو سکا — لوکل ڈیٹا استعمال ہو رہا ہے۔';
    let el = document.getElementById('fb-status-banner');
    if (!el) {
        el = document.createElement('div');
        el.id = 'fb-status-banner';
        el.className = 'no-print';
        el.style.cssText = `
            background: ${isPerm ? '#FEF2F2' : '#FFFBEB'};
            color: ${isPerm ? '#991B1B' : '#92400E'};
            border-bottom: 1px solid ${isPerm ? '#F87171' : '#FCD34D'};
            padding: 10px 18px;
            font-size: 13.5px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            position: sticky;
            top: 0;
            z-index: 9999;
            direction: rtl;
        `;
        const wrap = document.querySelector('.app-main') || document.body;
        wrap.prepend(el);
    }
    el.innerHTML = `
        <div style="display:flex;align-items:center;gap:10px;">
            <span style="font-size:16px;">${isPerm ? '🔒' : '📡'}</span>
            <span>${msg}</span>
        </div>
        <button onclick="this.parentElement.remove()" style="background:none;border:none;cursor:pointer;font-size:16px;color:inherit;">✕</button>
    `;
}
window.showFirebaseStatusNotice = showFirebaseStatusNotice;