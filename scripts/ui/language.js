// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  LANGUAGE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function setLang(l) {
    lang = l;
    localStorage.setItem('uts_lang', l);
    const L = T[l] || T.ur;
    document.documentElement.lang = l;
    document.body.className = 'lang-' + l;
    document.getElementById('modal').style.direction = L.dir;
    ['ur', 'en', 'ar'].forEach(x => document.getElementById('lb-' + x).classList.toggle('active', x === l));

    document.getElementById('app-title').textContent = L.appTitle;
    document.getElementById('app-sub').textContent = L.appSub;
    document.getElementById('app-sub-login').textContent = L.appSub;

    const navBtns = document.querySelectorAll('#main-nav button');
    L.nav.forEach((txt, i) => { if (navBtns[i]) navBtns[i].textContent = txt; });

    // Entry
    setText('lbl-entry', L.entry); setText('lbl-date', L.date); setText('lbl-party', L.party);
    setText('lbl-sector', L.sector); setText('lbl-transport', L.transport); setText('lbl-count', L.count);
    setText('lbl-fare', L.fare); setText('lbl-total', L.total); setText('lbl-notes', L.notes);
    setText('btn-save', L.save); setText('btn-clear', L.clear);
    setText('lbl-todaysum', L.todaySummary); setText('lbl-ts-p', L.todayParties);
    setText('lbl-ts-h', L.todayHujjaj); setText('lbl-ts-a', L.todayAmount); setText('lbl-ts-t', L.todayTrips);
    setText('lbl-voucher', L.voucherLbl); setText('lbl-vehicletotal', L.vehicleTotalLbl);

    // Payment
    setText('lbl-payTitle', L.payTitle); setText('lbl-paydate', L.date); setText('lbl-payparty', L.party);
    setText('lbl-received', L.received); setText('lbl-method', L.method); setText('lbl-paynotes', L.notes);
    setText('btn-savepay', L.savePay); setText('lbl-recentpay', L.recentPay);
    setOpt('opt-cash', L.cash, 'cash'); setOpt('opt-bank', L.bank, 'bank');
    setOpt('opt-cheque', L.cheque, 'cheque'); setOpt('opt-online', L.online, 'online');

    // Ledger
    setText('lbl-ledgerTitle', L.ledgerTitle); setText('lbl-ledparty', L.party);
    setText('lbl-ledfrom', L.fromDate); setText('lbl-ledto', L.toDate);
    setText('btn-print', L.print); setText('btn-resetled', L.resetFilter);

    // Records
    setText('lbl-recTitle', L.recTitle); setText('lbl-recfrom', L.fromDate); setText('lbl-recto', L.toDate);
    setText('lbl-recparty', L.party); setText('lbl-recsector', L.sector);
    setText('btn-filter', L.filter); setText('btn-clearfilter', L.resetFilter);
    setText('lbl-totalrec', L.totalRec); setText('lbl-totalhj', L.totalHujjaj); setText('lbl-totalamt', L.totalAmt);

    // Report
    setText('lbl-repTitle', L.repTitle); setText('lbl-repfrom', L.fromDate); setText('lbl-repto', L.toDate);
    setText('lbl-reptype', L.repType); setText('btn-genrep', L.genReport); setText('lbl-rparty', L.party);
    setOpt('opt-bydate', L.byDate, 'date'); setOpt('opt-byparty', L.byParty, 'party');
    setOpt('opt-bysector', L.bySector, 'sector');
    const excelBtn = document.querySelector('#btn-genrep + .btn-g + .btn-g');
    if (excelBtn) {
        excelBtn.textContent = L.exportExcel || '📥 Excel';
    }

    // Update
    setText('lbl-updTitle', L.updTitle); setText('lbl-udate', L.date); setText('lbl-uparty', L.party);
    setText('lbl-usector', L.sector); setText('lbl-utransport', L.transport); setText('lbl-ucount', L.count);
    setText('lbl-ufare', L.fare); setText('lbl-utotal', L.total); setText('lbl-unotes', L.notes);
    setText('btn-saveupd', L.saveUpd); setText('btn-cancel', L.cancel); setText('lbl-selrec', L.selectRecord);
    setText('lbl-uvoucher', L.voucherLbl); setText('lbl-uvehicletotal', L.vehicleTotalLbl);
    setText('lbl-updSearch', L.searchRec); setText('lbl-updFrom', L.fromDate); setText('lbl-updTo', L.toDate);
    document.getElementById('upd-search').placeholder = L.searchHint || 'Search...';

    // Settings
    setText('lbl-setParties', L.setParties); setText('lbl-setSectors', L.setSectors);
    setText('lbl-newpartylbl', L.newPartyLbl); setText('lbl-newsectorlbl', L.newSectorLbl);
    document.getElementById('sp-in').placeholder = L.partyPlaceholder;
    document.getElementById('ss-in').placeholder = L.sectorPlaceholder;
    setText('btn-addparty', L.add); setText('btn-addsector', L.add);

    setText('lbl-setTransports', L.setTransports); setText('lbl-newtransportlbl', L.newTransportLbl);
    document.getElementById('st-in').placeholder = L.transportPlaceholder;
    setText('btn-addtransport', L.add);

    setText('lbl-setApp', L.setApp); setText('lbl-appNameLbl', L.appNameLbl); setText('lbl-appSubLbl', L.appSubLbl);
    setText('lbl-logoLbl', L.logoLbl); setText('lbl-logoHint', L.logoHint); setText('btn-saveApp', L.saveApp);
    setText('lbl-renameParty', L.renameParty); setText('lbl-oldName', L.oldName); setText('lbl-newName', L.newName);
    setText('btn-renameSave', L.renameSave); document.getElementById('rename-to').placeholder = L.newName;

    setText('lbl-setUsers', L.userManagement); setText('lbl-su-username', L.username);
    setText('lbl-su-password', L.password); setText('lbl-su-title', L.addNewUser);
    setText('btn-add-user', L.add); setText('lbl-users-list-title', L.userList);

    // Daily Note
    setText('lbl-dnTitle', L.dnTitle); setText('lbl-dnDate', L.dnDate); setText('lbl-dnRef', L.dnRef);
    setText('lbl-dnParty', L.dnParty); setText('lbl-dnGroup', L.dnGroup); setText('lbl-dnMobile', L.dnMobile);
    setText('lbl-dnSector', L.dnSector); setText('lbl-dnCount', L.dnCount); setText('lbl-dnFlightNo', L.dnFlightNo);
    setText('lbl-dnFlightTime', L.dnFlightTime); setText('lbl-dnTripType', L.dnTripType); setText('lbl-dnFlightName', L.dnFlightName);
    setText('btn-dn-save', L.dnSave); setText('btn-dn-clear', L.dnClear);
    setText('lbl-dnRepTitle', L.dnRepTitle); setText('lbl-dnRepFrom', L.dnRepFrom); setText('lbl-dnRepTo', L.dnRepTo);
    setText('btn-dn-resetrep', L.dnReset); document.getElementById('nav-dailynote').textContent = L.dnNav;

    // Modal
    setText('btn-msave', L.modalSave); setText('btn-mcancel', L.modalCancel);

    // Login
    document.getElementById('login-title').textContent = L.loginTitle;
    document.getElementById('lbl-li-username').textContent = L.username;
    document.getElementById('lbl-li-password').textContent = L.password;
    document.getElementById('btn-login-submit').textContent = L.login;

    if (loggedInUser) {
        document.getElementById('lbl-logged-in-user').textContent = L.loggedUser + loggedInUser;
        document.getElementById('btn-logout').textContent = L.logout;
    }

    loadAppName(l);
    refreshSdPlaceholders();
    refreshAllDrops();

    const ap = document.querySelector('.page.active');
    if (ap) {
        const id = ap.id.replace('page-', '');
        if (id === 'entry') todayStats();
        if (id === 'payment') { renderPayments(); renderPayHead(); }
        if (id === 'ledger') renderLedger();
        if (id === 'records') renderRecords(records);
        if (id === 'update') renderUpdateTable();
        if (id === 'dailynote') renderDailyNoteReport();
        if (id === 'settings') { renderPartyList(); renderSectorList(); renderTransportList(); renderUsers(); }
    }
    renderPayHead(); renderRecHead(); renderUpdHead();
}