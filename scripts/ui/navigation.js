// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  NAVIGATION
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
let openedTabs = ['entry'];
let currentActiveTab = 'entry';

const tabNames = {
    'entry': 'نئی انٹری',
    'payment': 'ادائیگی',
    'ledger': 'لیجر',
    'records': 'ریکارڈز',
    'report': 'رپورٹ',
    'dailynote': 'ڈیلی رپورٹ',
    'settings': 'سیٹنگز',
    'update': 'اپڈیٹ',
    'admin': 'ایڈمن پینل'
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
        const closeAllLbl = lang === 'en' ? 'Close All' : lang === 'ar' ? 'إغلاق الكل' : 'تمام بند کریں';
        html += `
            <div style="flex-grow: 1;"></div>
            <button class="mdi-close-all-btn" onclick="closeAllMdiTabs()" title="${closeAllLbl}">
                ${closeAllLbl}
            </button>
        `;
    }

    container.innerHTML = html;
}

function closeAllMdiTabs() {
    const def = (typeof canDo === 'function' && canDo('entry')) ? 'entry' : 'records';
    openedTabs = [def];
    switchToTab(def);
}

function toggleSidebar(forceState) {
    const isOpen = document.body.classList.contains('sidebar-open');
    const newState = (typeof forceState === 'boolean') ? forceState : !isOpen;
    document.body.classList.toggle('sidebar-open', newState);
}

function updateTopbarTitle(p) {
    const el = document.getElementById('topbar-current-page');
    if (!el) return;
    const currentLang = (typeof lang !== 'undefined') ? lang : 'ur';
    const L = (typeof T !== 'undefined' && T[currentLang]) ? T[currentLang] : null;
    if (L && L.nav) {
        const pageIndexMap = {
            'entry': 0,
            'payment': 1,
            'ledger': 2,
            'records': 3,
            'report': 4,
            'dailynote': 5,
            'settings': 6
        };
        if (p === 'admin') {
            el.textContent = currentLang === 'en' ? 'Admin Panel' : currentLang === 'ar' ? 'لوحة التحكم' : 'ایڈمن پینل';
            return;
        }
        if (p === 'update') {
            el.textContent = currentLang === 'en' ? 'Update Record' : currentLang === 'ar' ? 'تعديل السجل' : 'ریکارڈ اپڈیٹ';
            return;
        }
        const idx = pageIndexMap[p];
        if (idx !== undefined && L.nav[idx]) {
            el.textContent = L.nav[idx];
            return;
        }
    }
    el.textContent = tabNames[p] || p;
}

function switchToTab(tab) {
    if (typeof canDo === 'function') {
        if (tab === 'entry' && !canDo('entry')) tab = 'records';
        else if (tab === 'payment' && !canDo('payment')) tab = 'records';
        else if (tab === 'settings' && !canDo('settings')) tab = 'records';
        else if (tab === 'admin' && !canDo('adminPanel')) tab = 'records';
    }

    if (!openedTabs.includes(tab)) {
        openedTabs.push(tab);
    }
    currentActiveTab = tab;
    renderMdiTabs();
    
    const navBtns = document.querySelectorAll('#main-nav button');
    navBtns.forEach(b => {
        const clickAttr = b.getAttribute('onclick') || '';
        if (clickAttr.includes(`'${tab}'`)) b.classList.add('active');
        else b.classList.remove('active');
    });

    updateTopbarTitle(tab);
    _executeShowPageLogic(tab);
}

function closeMdiTab(tab, event) {
    if (event) event.stopPropagation();
    
    openedTabs = openedTabs.filter(t => t !== tab);
    const def = (typeof canDo === 'function' && canDo('entry')) ? 'entry' : 'records';
    
    if (currentActiveTab === tab) {
        if (openedTabs.length > 0) {
            switchToTab(openedTabs[openedTabs.length - 1]);
        } else {
            switchToTab(def);
        }
    } else {
        renderMdiTabs();
    }
}

function showPage(p, btn) {
    switchToTab(p);
    if (typeof toggleSidebar === 'function') toggleSidebar(false);
}

function _executeShowPageLogic(p) {
    document.querySelectorAll('.page').forEach(x => x.classList.remove('active'));
    const pageEl = document.getElementById('page-' + p);
    if (pageEl) pageEl.classList.add('active');
    
    if (p === 'entry') { 
        fillDrop('e-party', parties, false);
        fillDrop('e-sector', sectors); 
        fillDrop('e-transport', transports); 
        if (typeof fillTransportNatureDropdown === 'function') fillTransportNatureDropdown();
        if (typeof fillHajiPartyDropdown === 'function') fillHajiPartyDropdown();
        if (typeof fillShirkaDatalist === 'function') fillShirkaDatalist();
        todayStats(); 
    }
    if (p === 'payment') { 
        fillDrop('p-party', parties, false);
        renderPayments(); 
        renderPayHead(); 
    }
    if (p === 'ledger') {
        const allLedgerParties = Array.from(new Set([
            ...(Array.isArray(parties) ? parties : []),
            ...(Array.isArray(records) ? records.map(r => r.party) : []),
            ...(Array.isArray(payments) ? payments.map(p => p.party) : [])
        ].map(p => (p || '').trim()).filter(Boolean)));
        fillDrop('l-party', allLedgerParties.length ? allLedgerParties : parties, true);
        renderLedger();
    }
    if (p === 'records') { 
        fillDrop('f-party', parties, true); 
        fillDrop('f-sector', sectors, true); 
        if (typeof initRecordsPage === 'function') {
            initRecordsPage();
        } else {
            renderRecords(records); 
        }
        renderRecHead(); 
    }
    if (p === 'update') { fillDrop('u-sector', sectors); fillDrop('u-transport', transports); renderUpdateTable(); renderUpdHead(); }
    if (p === 'dailynote') { 
        fillDrop('dn-sector', sectors); 
        if (typeof fillTransportNatureDropdown === 'function') fillTransportNatureDropdown();
        renderDailyNoteReport(); 
    }
    if (p === 'report') { fillDrop('r-party', parties, true); genReport(); }
    if (p === 'admin') { if (canDo('adminPanel')) renderAdminPanel(); }
    if (p === 'settings') {
        renderPartyList(); renderHajiPartyList(); renderSectorList(); renderTransportList(); renderShirkaList(); loadAppName(lang);
        const an = document.getElementById('set-appname'); if (an) an.value = fbAppName[lang] || T[lang].appTitle;
        const as = document.getElementById('set-appsub'); if (as) as.value = fbAppSub[lang] || T[lang].appSub;
    }
}

window.addEventListener('DOMContentLoaded', () => {
    setTimeout(renderMdiTabs, 100);
});

// Auto-close mobile sidebar drawer when pressing Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && document.body.classList.contains('sidebar-open')) {
        toggleSidebar(false);
    }
});

// Auto-close mobile drawer when resizing back to desktop (>900px)
window.addEventListener('resize', () => {
    if (window.innerWidth > 900 && document.body.classList.contains('sidebar-open')) {
        document.body.classList.remove('sidebar-open');
    }
});