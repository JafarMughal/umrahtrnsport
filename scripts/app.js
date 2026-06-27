// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  FIREBASE INIT - FINAL
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
document.addEventListener('DOMContentLoaded', () => {
    if (!users || !users.length) {
        users = [{ username: 'admin', role: 'admin' }];
    }

    const loadData = () => {
        db.ref('/').once('value').then(snapshot => {
            const data = snapshot.val() || {};
            records = data.records || [];
            payments = data.payments || [];
            parties = data.parties || [];
            sectors = data.sectors || [];
            transports = data.transports || [];
            partyCodes = data.partyCodes || {};
            users = data.users || [{ username: 'admin', role: 'admin' }];
            dailyNotes = data.dailyNotes || [];
            const settings = data.settings || {};
            fbLogo = settings.logo || null;
            fbAppName = settings.appName || {};
            fbAppSub = settings.appSub || {};

            if (!parties.length) { parties = (T[lang] || T.ur).defaultParties.slice(); svP(); }
            if (!sectors.length) { sectors = (T[lang] || T.ur).defaultSectors.slice(); svS(); }
            if (!transports.length) { transports = ['بس', 'وین', 'کار', 'کوچ']; svTr(); }
            parties.forEach(p => getCode(p));

            initUsers().then(() => {
                if (!isFirebaseReady) {
                    isFirebaseReady = true;
                    document.getElementById('firebase-loader').style.display = 'none';
                    applyLogo(fbLogo);
                    setLang(lang);
                    checkAuth();
                    document.getElementById('e-date').value = today();
                    document.getElementById('p-date').value = today();
                    document.getElementById('dn-date').value = today();
                    setNextVoucher();
                    renderDailyNoteReport();
                }
            });
        }).catch(error => {
            console.error("Firebase Read Error:", error);

            if (!isFirebaseReady) {
                parties = (T[lang] || T.ur).defaultParties.slice();
                sectors = (T[lang] || T.ur).defaultSectors.slice();
                transports = ['بس', 'وین', 'کار', 'کوچ'];
                users = [{ username: 'admin', role: 'admin' }];
                records = [];
                payments = [];
                partyCodes = {};
                dailyNotes = [];
                parties.forEach(p => getCode(p));

                isFirebaseReady = true;
                document.getElementById('firebase-loader').style.display = 'none';
                applyLogo(null);
                setLang(lang);
                checkAuth();
                document.getElementById('e-date').value = today();
                document.getElementById('p-date').value = today();
                document.getElementById('dn-date').value = today();
                setNextVoucher();
                renderDailyNoteReport();

                const loaderText = document.querySelector('.loader-text');
                if (loaderText) {
                    loaderText.textContent = '⚠️ ڈیٹا بیس سے کنکشن نہیں - لوکل ڈیٹا استعمال ہو رہا ہے';
                }
            }
        });

        // Attach listener only after auth
        db.ref('/').on('value', snapshot => {
            if (isFirebaseReady && snapshot.exists()) {
                const data = snapshot.val() || {};
                records = data.records || records;
                payments = data.payments || payments;
                parties = data.parties || parties;
                sectors = data.sectors || sectors;
                transports = data.transports || transports;
                partyCodes = data.partyCodes || partyCodes;
                users = data.users || users;
                dailyNotes = data.dailyNotes || dailyNotes;
                const settings = data.settings || {};
                fbLogo = settings.logo || fbLogo;
                fbAppName = settings.appName || fbAppName;
                fbAppSub = settings.appSub || fbAppSub;

                applyLogo(fbLogo);
                loadAppName(lang);
                refreshAllDrops();

                const activePage = document.querySelector('.page.active');
                if (activePage) {
                    if (activePage.id === 'page-entry') todayStats();
                    if (activePage.id === 'page-payment') renderPayments();
                    if (activePage.id === 'page-ledger') renderLedger();
                    if (activePage.id === 'page-records') filterRecords();
                    if (activePage.id === 'page-update') renderUpdateTable();
                    if (activePage.id === 'page-dailynote') renderDailyNoteReport();
                    if (activePage.id === 'page-report') genReport();
                }
            }
        }, (error) => {
            console.warn("Firebase listener error:", error);
        });
    };

    auth.onAuthStateChanged(user => {
        if (user) {
            const email = user.email || '';
            loggedInUser = email.split('@')[0] || 'admin';
            const found = users.find(x => x.username.toLowerCase() === loggedInUser.toLowerCase());
            if (!found && loggedInUser !== 'admin') {
                users.push({ username: loggedInUser, role: 'operator' });
                svU();
            }
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
window.setLang = setLang;
window.showPage = showPage;
window.addFromSettings = addFromSettings;
window.deleteItem = deleteItem;
window.onTransportChange = onTransportChange;
window.calcE = calcE;
window.calcU = calcU;
window.addEntry = addEntry;
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
window.editRecord = editRecord;
window.saveUpdate = saveUpdate;
window.cancelUpdate = cancelUpdate;
window.deleteRecord = deleteRecord;
window.renderUpdateTable = renderUpdateTable;
window.saveDailyNote = saveDailyNote;
window.clearDailyNoteForm = clearDailyNoteForm;
window.editDailyNote = editDailyNote;
window.deleteDailyNote = deleteDailyNote;
window.clearDailyNoteReport = clearDailyNoteReport;
window.renderDailyNoteReport = renderDailyNoteReport;
window.handleLogoUpload = handleLogoUpload;
window.handleLogoDrop = handleLogoDrop;
window.removeLogo = removeLogo;
window.saveAppSettings = saveAppSettings;
window.renameParty = renameParty;
window.sdFilter = sdFilter;
window.sdOpen = sdOpen;
window.sdBlur = sdBlur;
window.sdSelect = sdSelect;
window.openModal = openModal;
window.closeModal = closeModal;
window.confirmModal = confirmModal;
window.todayStats = todayStats;
window.fillRenameFrom = fillRenameFrom;
window.renderUsers = renderUsers;
window.renderPartyList = renderPartyList;
window.renderSectorList = renderSectorList;
window.renderTransportList = renderTransportList;
window.renderPayments = renderPayments;
window.renderPayHead = renderPayHead;
window.renderRecHead = renderRecHead;
window.renderUpdHead = renderUpdHead;
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