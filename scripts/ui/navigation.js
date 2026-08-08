// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  NAVIGATION
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
let openedTabs = ['entry'];
let currentActiveTab = 'entry';

const tabNames = {
    'entry': '📝 نئی انٹری',
    'payment': '💰 ادائیگی',
    'ledger': '📒 لیجر',
    'records': '📋 ریکارڈز',
    'report': '📊 رپورٹ',
    'dailynote': '📊 ڈیلی رپورٹ',
    'settings': '⚙️ سیٹنگ',
    'update': '✏️ اپڈیٹ'
};

function renderMdiTabs() {
    const container = document.getElementById('mdi-tabs');
    if (!container) return;
    
    if (openedTabs.length === 0) {
        container.innerHTML = '';
        return;
    }

    let html = openedTabs.map(tab => `
        <div class="mdi-tab ${tab === currentActiveTab ? 'active' : ''}" onclick="switchToTab('${tab}')">
            ${tabNames[tab] || tab}
            <div class="mdi-tab-close" onclick="closeMdiTab('${tab}', event)">×</div>
        </div>
    `).join('');
    
    if (openedTabs.length > 1) {
        html += `
            <div style="flex-grow: 1;"></div>
            <div onclick="closeAllMdiTabs()" style="display:flex; align-items:center; padding: 0 12px; color: #d32f2f; cursor: pointer; font-size: 12px; font-weight: bold; align-self: center; white-space: nowrap; transition: 0.2s;" onmouseover="this.style.color='#b71c1c'" onmouseout="this.style.color='#d32f2f'">
                Close All ✖
            </div>
        `;
    }

    container.innerHTML = html;
}

function closeAllMdiTabs() {
    openedTabs = ['entry'];
    switchToTab('entry');
}

function switchToTab(tab) {
    if (!openedTabs.includes(tab)) {
        openedTabs.push(tab);
    }
    currentActiveTab = tab;
    renderMdiTabs();
    
    _executeShowPageLogic(tab);
}

function closeMdiTab(tab, event) {
    if (event) event.stopPropagation();
    
    openedTabs = openedTabs.filter(t => t !== tab);
    
    if (currentActiveTab === tab) {
        if (openedTabs.length > 0) {
            switchToTab(openedTabs[openedTabs.length - 1]);
        } else {
            switchToTab('entry');
        }
    } else {
        renderMdiTabs();
    }
}

function showPage(p, btn) {
    switchToTab(p);
    
    document.querySelectorAll('#main-nav button').forEach(x => x.classList.remove('active'));
    if (btn) btn.classList.add('active');
    else {
        const navBtns = document.querySelectorAll('#main-nav button');
        for (let i = 0; i < navBtns.length; i++) {
            if (navBtns[i].getAttribute('onclick') && navBtns[i].getAttribute('onclick').includes(`'${p}'`)) {
                navBtns[i].classList.add('active');
                break;
            }
        }
    }
}

function _executeShowPageLogic(p) {
    document.querySelectorAll('.page').forEach(x => x.classList.remove('active'));
    const pageEl = document.getElementById('page-' + p);
    if (pageEl) pageEl.classList.add('active');
    
    if (p === 'entry') { fillDrop('e-sector', sectors); fillDrop('e-transport', transports); todayStats(); }
    if (p === 'payment') { renderPayments(); renderPayHead(); }
    if (p === 'ledger') { fillDrop('l-party', parties, true); renderLedger(); }
    if (p === 'records') { fillDrop('f-party', parties, true); fillDrop('f-sector', sectors, true); renderRecords(records); renderRecHead(); }
    if (p === 'update') { fillDrop('u-sector', sectors); fillDrop('u-transport', transports); renderUpdateTable(); renderUpdHead(); }
    if (p === 'dailynote') { fillDrop('dn-sector', sectors); renderDailyNoteReport(); }
    if (p === 'report') { fillDrop('r-party', parties, true); genReport(); }
    if (p === 'settings') {
        renderPartyList(); renderHajiPartyList(); renderSectorList(); renderTransportList(); renderShirkaList(); loadAppName(lang);
        renderUsers();
        document.getElementById('set-appname').value = fbAppName[lang] || T[lang].appTitle;
        document.getElementById('set-appsub').value = fbAppSub[lang] || T[lang].appSub;
    }
}

window.addEventListener('DOMContentLoaded', () => {
    setTimeout(renderMdiTabs, 100);
});