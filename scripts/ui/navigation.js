// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  NAVIGATION
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function showPage(p, btn) {
    document.querySelectorAll('.page').forEach(x => x.classList.remove('active'));
    document.querySelectorAll('#main-nav button').forEach(x => x.classList.remove('active'));
    document.getElementById('page-' + p).classList.add('active');
    if (btn) btn.classList.add('active');
    if (p === 'entry') { fillDrop('e-sector', sectors); fillDrop('e-transport', transports); todayStats(); }
    if (p === 'payment') { renderPayments(); renderPayHead(); }
    if (p === 'ledger') { fillDrop('l-party', parties, true); renderLedger(); }
    if (p === 'records') { fillDrop('f-party', parties, true); fillDrop('f-sector', sectors, true); renderRecords(records); renderRecHead(); }
    if (p === 'update') { fillDrop('u-sector', sectors); fillDrop('u-transport', transports); renderUpdateTable(); renderUpdHead(); }
    if (p === 'dailynote') { fillDrop('dn-sector', sectors); renderDailyNoteReport(); }
    if (p === 'report') { fillDrop('r-party', parties, true); genReport(); }
    if (p === 'settings') {
        renderPartyList(); renderSectorList(); renderTransportList(); fillRenameFrom(); loadAppName(lang);
        renderUsers();
        document.getElementById('set-appname').value = fbAppName[lang] || T[lang].appTitle;
        document.getElementById('set-appsub').value = fbAppSub[lang] || T[lang].appSub;
    }
}