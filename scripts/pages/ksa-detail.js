// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  KSA MOVEMENT DETAIL REPORT — Robust Page Logic
//  Shows full records list for a selected movement type & date
//  (Jeddah Arrival, Departure, Madinah Arrival, Departure, etc.)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// State
let ksaDetailCurrentType   = 'jed-arrival';
let ksaDetailCurrentDate   = null;
let ksaDetailCurrentSource = 'home';
let ksaDetailShowAllDatesFlag = false;

// ─── Movement Type Config ──────────────────────────────────────
const KSA_TYPE_CONFIG = {
    'all': {
        id:       'all',
        label:    'تمام نقل و حرکت (All Movements)',
        icon:     '🌐',
        badge:    'ksd-nature-jed-arrival',
        rowClass: '',
        keywords: [],
    },
    'jed-arrival': {
        id:       'jed-arrival',
        label:    'جدہ آمد (Jeddah Arrival)',
        icon:     '✈',
        badge:    'ksd-nature-jed-arrival',
        rowClass: 'ksd-row-arrival',
        keywords: ['jed arrival', 'jeddah arrival', 'jed arr', 'جدہ آمد', 'آمد جدہ', 'جدہ ➜ مکہ', 'جدہ سے مکہ', 'جدہ تا مکہ', 'جدہ ➜ مدینہ', 'jeddah to makkah', 'jed to mak'],
    },
    'jed-departure': {
        id:       'jed-departure',
        label:    'جدہ روانگی (Jeddah Departure)',
        icon:     '✈',
        badge:    'ksd-nature-jed-departure',
        rowClass: 'ksd-row-departure',
        keywords: ['jeddah dep', 'jed dep', 'jeddah depture', 'jed depture', 'جدہ روانگی', 'روانگی جدہ', 'مکہ ➜ جدہ', 'مکہ سے جدہ', 'مکہ تا جدہ', 'مدینہ ➜ جدہ', 'makkah to jeddah', 'mak to jed'],
    },
    'med-arrival': {
        id:       'med-arrival',
        label:    'مدینہ آمد (Madinah Arrival)',
        icon:     '✈',
        badge:    'ksd-nature-med-arrival',
        rowClass: 'ksd-row-arrival',
        keywords: ['med arrival', 'madina arrival', 'med arr', 'madinah arrival', 'مدینہ آمد', 'آمد مدینہ', 'مدینہ ائیرپورٹ'],
    },
    'med-departure': {
        id:       'med-departure',
        label:    'مدینہ روانگی (Madinah Departure)',
        icon:     '✈',
        badge:    'ksd-nature-med-departure',
        rowClass: 'ksd-row-departure',
        keywords: ['madina dep', 'med dep', 'madina depture', 'med depture', 'madinah dep', 'مدینہ روانگی', 'روانگی مدینہ'],
    },
    'mak-checkin': {
        id:       'mak-checkin',
        label:    'مکہ چیک ان (Makkah Check-In)',
        icon:     '🕋',
        badge:    'ksd-nature-mak-checkin',
        rowClass: 'ksd-row-checkin',
        keywords: ['madina to mak', 'madina to makk', 'madina to makkah', 'madina to makha', 'med to mak', 'مدینہ ➜ مکہ', 'مدینہ سے مکہ', 'مدینہ تا مکہ', 'مکہ چیک ان'],
    },
    'mak-checkout': {
        id:       'mak-checkout',
        label:    'مکہ چیک آؤٹ (Makkah Check-Out)',
        icon:     '🕋',
        badge:    'ksd-nature-mak-checkout',
        rowClass: 'ksd-row-checkout',
        keywords: ['makkah to mad', 'makkah to medina', 'makkah to madina', 'mak to med', 'مکہ ➜ مدینہ', 'مکہ سے مدینہ', 'مکہ تا مدینہ', 'مکہ چیک آؤٹ'],
    },
    'med-checkin': {
        id:       'med-checkin',
        label:    'مدینہ چیک ان (Madinah Check-In)',
        icon:     '🕌',
        badge:    'ksd-nature-med-arrival',
        rowClass: 'ksd-row-checkin',
        keywords: ['makkah to mad', 'makkah to medina', 'makkah to madina', 'mak to med', 'مکہ ➜ مدینہ', 'مکہ سے مدینہ', 'مکہ تا مدینہ', 'مدینہ چیک ان'],
    },
    'med-checkout': {
        id:       'med-checkout',
        label:    'مدینہ چیک آؤٹ (Madinah Check-Out)',
        icon:     '🕌',
        badge:    'ksd-nature-jed-departure',
        rowClass: 'ksd-row-checkout',
        keywords: ['madina to mak', 'madina to makk', 'madina to makkah', 'madina to makha', 'med to mak', 'مدینہ ➜ مکہ', 'مدینہ سے مکہ', 'مدینہ تا مکہ', 'مدینہ چیک آؤٹ'],
    },
    'mak-present': {
        id:       'mak-present',
        label:    'مکہ میں موجود حجاج (Present in Makkah)',
        icon:     '🕋',
        badge:    'ksd-nature-mak-checkin',
        rowClass: 'ksd-row-checkin',
        keywords: ['madina to mak', 'jed arrival', 'jeddah arrival'],
    },
    'med-present': {
        id:       'med-present',
        label:    'مدینہ میں موجود حجاج (Present in Madinah)',
        icon:     '🕌',
        badge:    'ksd-nature-med-arrival',
        rowClass: 'ksd-row-arrival',
        keywords: ['makkah to mad', 'med arrival', 'madina arrival'],
    },
};

// ─── Robust Data Retrieval Helper ──────────────────────────────
function getKsaAllRecords() {
    if (typeof records !== 'undefined' && Array.isArray(records) && records.length > 0) {
        return records;
    }
    if (typeof window.records !== 'undefined' && Array.isArray(window.records) && window.records.length > 0) {
        return window.records;
    }
    try {
        const local = localStorage.getItem('uts_records');
        if (local) {
            const parsed = JSON.parse(local);
            if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
    } catch (e) {}
    return [];
}

// ─── Safe Date Normalization & Matching ────────────────────────
function normalizeDateStr(d) {
    if (!d) return '';
    const s = String(d).trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
    if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(s)) {
        const p = s.split('/');
        return `${p[2]}-${p[1].padStart(2, '0')}-${p[0].padStart(2, '0')}`;
    }
    if (/^\d{4}\/\d{1,2}\/\d{1,2}$/.test(s)) {
        const p = s.split('/');
        return `${p[0]}-${p[1].padStart(2, '0')}-${p[2].padStart(2, '0')}`;
    }
    return s;
}

function datesMatch(d1, d2) {
    if (!d1 || !d2) return false;
    const s1 = String(d1).trim();
    const s2 = String(d2).trim();
    if (s1 === s2) return true;
    return normalizeDateStr(s1) === normalizeDateStr(s2);
}

// ─── Safe Formatters (never throw) ─────────────────────────────
function safeFd(d) {
    if (!d) return '—';
    try {
        const s = String(d).trim();
        if (s.includes('-')) {
            const p = s.split('-');
            if (p.length === 3) return `${p[2]}/${p[1]}/${p[0]}`;
        }
        return s;
    } catch (e) {
        return String(d);
    }
}

function safeSar(val) {
    try {
        const n = parseFloat(val);
        if (isNaN(n)) return '0';
        return Math.round(n).toLocaleString();
    } catch (e) {
        return '0';
    }
}

function safeFormatTime(t) {
    if (!t) return '—';
    try {
        const s = String(t).trim();
        if (s.includes(':')) {
            const [h, m] = s.split(':');
            let hh = parseInt(h, 10);
            if (!isNaN(hh)) {
                const ampm = hh >= 12 ? 'PM' : 'AM';
                hh = hh % 12 || 12;
                return `${hh}:${m || '00'} ${ampm}`;
            }
        }
        return s;
    } catch (e) {
        return String(t);
    }
}

// ─── Robust Movement Matching ──────────────────────────────────
function matchesMovement(r, cfg) {
    if (!r) return false;
    const type = cfg ? cfg.id : ksaDetailCurrentType;
    if (typeof recordMatchesKsaType === 'function') {
        return recordMatchesKsaType(r, type);
    }

    const tn  = String(r.transportNature || '').toLowerCase().trim();
    const sec = String(r.sector || '').toLowerCase().trim();
    const ap  = String(r.airport || '').toLowerCase().trim();

    // 1. Direct keywords match against transportNature or sector
    if (cfg && cfg.keywords && cfg.keywords.some(kw => tn.includes(kw) || sec.includes(kw))) {
        return true;
    }

    // 2. Extra intelligent fallbacks for Jed Arrival
    if (type === 'jed-arrival') {
        if (tn === 'jeddah' || tn.includes('jed arr') || tn.includes('jeddah arr') || tn.includes('جدہ آمد') || tn.includes('آمد جدہ')) {
            return true;
        }
        if (sec.includes('جدہ ➜ مکہ') || sec.includes('جدہ سے مکہ') || sec.includes('جدہ تا مکہ') || 
            sec.includes('جدہ ➜ مدینہ') || sec.includes('جدہ سے مدینہ') || sec.includes('jeddah to mak') || sec.includes('jed to mak')) {
            return true;
        }
        if (!tn && (ap.includes('jed') || (sec.includes('jed') && sec.includes('mak') && !sec.includes('to jed')))) {
            return true;
        }
    }

    // 3. Extra fallbacks for Jed Departure
    if (type === 'jed-departure') {
        if (tn.includes('jed dep') || tn.includes('jeddah dep') || tn.includes('جدہ روانگی') || tn.includes('روانگی جدہ')) {
            return true;
        }
        if (sec.includes('مکہ ➜ جدہ') || sec.includes('مکہ سے جدہ') || sec.includes('مدینہ ➜ جدہ') || sec.includes('مدینہ سے جدہ') ||
            sec.includes('mak to jed') || sec.includes('makkah to jed') || sec.includes('to jed') || sec.includes('➜ جدہ')) {
            return true;
        }
        if (!tn && (sec.includes('mak to jed') || sec.includes('med to jed') || (sec.includes('to jed') && ap.includes('jed')))) {
            return true;
        }
    }

    // 4. Extra fallbacks for Med Arrival
    if (type === 'med-arrival') {
        if (tn.includes('med arr') || tn.includes('madina arrival') || tn.includes('madinah arrival') || tn.includes('مدینہ آمد') || tn.includes('آمد مدینہ')) {
            return true;
        }
        if (sec.includes('مدینہ ائیرپورٹ ➜') || sec.includes('med airport to')) {
            return true;
        }
    }

    // 5. Extra fallbacks for Med Departure
    if (type === 'med-departure') {
        if (tn.includes('med dep') || tn.includes('madina dep') || tn.includes('madinah dep') || tn.includes('مدینہ روانگی') || tn.includes('روانگی مدینہ')) {
            return true;
        }
        if (sec.includes('➜ مدینہ ائیرپورٹ') || sec.includes('to med airport')) {
            return true;
        }
    }

    // 6. Check-in / out fallbacks
    if (type === 'mak-checkin' || type === 'med-checkout') {
        if (tn.includes('madina to mak') || tn.includes('med to mak') || sec.includes('مدینہ ➜ مکہ') || sec.includes('مدینہ سے مکہ') || sec.includes('madina to mak')) return true;
    }
    if (type === 'mak-checkout' || type === 'med-checkin') {
        if (tn.includes('makkah to mad') || tn.includes('mak to med') || sec.includes('مکہ ➜ مدینہ') || sec.includes('مکہ سے مدینہ') || sec.includes('makkah to mad')) return true;
    }

    return false;
}

// ─── Entry Point — Called from KSA Status Panel or Navigation ─
async function openKsaDetail(type, date) {
    ksaDetailShowAllDatesFlag = false;
    const allDatesCb = document.getElementById('ksd-all-dates-cb');
    if (allDatesCb) allDatesCb.checked = false;

    // Reset search & party filters on new open
    const searchInp = document.getElementById('ksd-search');
    if (searchInp) searchInp.value = '';
    const partySel = document.getElementById('ksd-party-filter');
    if (partySel) partySel.value = '';

    // If opening cumulative present pilgrims or all movements, automatically enable all dates
    if (type === 'mak-present' || type === 'med-present' || type === 'all') {
        ksaDetailShowAllDatesFlag = true;
        if (allDatesCb) allDatesCb.checked = true;
    }

    // Determine target date
    const dashDateEl = document.getElementById('ksa-date-display');
    const dashDate = dashDateEl ? (dashDateEl.value || dashDateEl.textContent || '').trim() : null;

    let targetDate = (date && date !== '—')
        ? date
        : (dashDate && dashDate !== '—')
            ? dashDate
            : (typeof window.ksaStatusDate !== 'undefined' && window.ksaStatusDate)
                ? window.ksaStatusDate
                : (typeof today === 'function' ? today() : new Date().toISOString().split('T')[0]);

    ksaDetailCurrentType   = (type && KSA_TYPE_CONFIG[type]) ? type : 'jed-arrival';
    ksaDetailCurrentDate   = normalizeDateStr(targetDate);
    ksaDetailCurrentSource = 'home';

    // Lazy load the HTML if not already loaded into #page-ksa-detail
    const pageEl = document.getElementById('page-ksa-detail');
    if (pageEl && !(pageEl.innerHTML || '').trim()) {
        try {
            const res = await fetch('pages/ksa-detail.html', { cache: 'no-store' });
            if (res.ok) {
                let html = await res.text();
                html = html.replace(/<!-- Code injected by live-server -->[\s\S]*?<\/script>/gi, '');
                pageEl.innerHTML = html;
            }
        } catch (e) {
            console.warn('Could not fetch ksa-detail.html:', e);
        }
    }

    if (typeof showPage === 'function') {
        showPage('ksa-detail');
    }

    // Force render
    initKsaDetailPage();
    setTimeout(initKsaDetailPage, 60);
}

// ─── Go Back ────────────────────────────────────────────────────
function ksaDetailGoBack() {
    if (typeof showPage === 'function') {
        showPage(ksaDetailCurrentSource || 'home');
    }
}

// ─── Date Navigation ────────────────────────────────────────────
function ksaDetailChangeDate(delta) {
    ksaDetailShowAllDatesFlag = false;
    const allDatesCb = document.getElementById('ksd-all-dates-cb');
    if (allDatesCb) allDatesCb.checked = false;

    const cur = ksaDetailCurrentDate || (typeof today === 'function' ? today() : new Date().toISOString().split('T')[0]);
    const d = new Date(cur);
    d.setDate(d.getDate() + delta);
    ksaDetailCurrentDate = d.toISOString().split('T')[0];
    initKsaDetailPage();
}

function ksaDetailSetDate(val) {
    if (!val) return;
    ksaDetailShowAllDatesFlag = false;
    const allDatesCb = document.getElementById('ksd-all-dates-cb');
    if (allDatesCb) allDatesCb.checked = false;

    ksaDetailCurrentDate = val;
    initKsaDetailPage();
}

function ksaDetailSetToday() {
    ksaDetailShowAllDatesFlag = false;
    const allDatesCb = document.getElementById('ksd-all-dates-cb');
    if (allDatesCb) allDatesCb.checked = false;

    ksaDetailCurrentDate = (typeof today === 'function' ? today() : new Date().toISOString().split('T')[0]);
    initKsaDetailPage();
}

// ─── Toggle All Dates ──────────────────────────────────────────
function ksaDetailToggleAllDates(checked) {
    ksaDetailShowAllDatesFlag = !!checked;
    renderKsaDetailTable();
}

function ksaDetailShowAllDates() {
    ksaDetailShowAllDatesFlag = true;
    const allDatesCb = document.getElementById('ksd-all-dates-cb');
    if (allDatesCb) allDatesCb.checked = true;
    renderKsaDetailTable();
}

// ─── Type Navigation (Switching between Arrival/Departure) ─────
function ksaDetailChangeType(type) {
    if (!type || !KSA_TYPE_CONFIG[type]) return;
    ksaDetailCurrentType = type;
    initKsaDetailPage();
}

// ─── Page Init ─────────────────────────────────────────────────
function initKsaDetailPage() {
    if (!ksaDetailCurrentType || !KSA_TYPE_CONFIG[ksaDetailCurrentType]) {
        ksaDetailCurrentType = 'jed-arrival';
    }

    const cfg = KSA_TYPE_CONFIG[ksaDetailCurrentType];
    const dashDateEl = document.getElementById('ksa-date-display');
    const dashDate = dashDateEl ? dashDateEl.textContent.trim() : null;

    const curDate = ksaDetailCurrentDate || (dashDate && dashDate !== '—' ? dashDate : null) || (typeof window.ksaStatusDate !== 'undefined' && window.ksaStatusDate ? window.ksaStatusDate : (typeof today === 'function' ? today() : new Date().toISOString().split('T')[0]));
    ksaDetailCurrentDate = curDate;

    // Header elements
    const titleEl    = document.getElementById('ksa-detail-title');
    const subtitleEl = document.getElementById('ksa-detail-subtitle');
    const badgeEl    = document.getElementById('ksa-detail-type-badge');
    const dateInput  = document.getElementById('ksd-date-input');
    const typeSelect = document.getElementById('ksd-type-select');

    if (titleEl)    titleEl.textContent    = cfg.label;
    if (subtitleEl) subtitleEl.textContent = ksaDetailShowAllDatesFlag ? `تمام تاریخیں — مکمل ریکارڈز` : `${curDate} — تاریخ کے مطابق ریکارڈز`;
    if (badgeEl)    badgeEl.textContent    = cfg.icon;
    if (dateInput)  dateInput.value         = curDate;
    if (typeSelect) typeSelect.value        = ksaDetailCurrentType;

    // Print labels
    const printTitle = document.getElementById('ksd-print-title');
    const printDate  = document.getElementById('ksd-print-date');
    if (printTitle) printTitle.textContent = cfg.label;
    if (printDate)  printDate.textContent  = ksaDetailShowAllDatesFlag ? `تمام تاریخیں` : `تاریخ: ${curDate}`;

    // Fill party filter dropdown
    ksaDetailFillPartyFilter(curDate, cfg);

    // Render table
    renderKsaDetailTable();
}

// ─── Fill Party Filter ──────────────────────────────────────────
function ksaDetailFillPartyFilter(curDate, cfg) {
    const sel = document.getElementById('ksd-party-filter');
    if (!sel) return;

    const allRecs = getKsaAllRecords();
    const dayRecs = allRecs.filter(r => {
        if (!ksaDetailShowAllDatesFlag && !datesMatch(r.date, curDate)) return false;
        return matchesMovement(r, cfg);
    });

    const parties = [...new Set(dayRecs.map(r => r.party || '').filter(Boolean))].sort();
    const curVal = sel.value;

    sel.innerHTML = '<option value="">— تمام ٹرانسپورٹرز —</option>' +
        parties.map(p => `<option value="${p}"${p === curVal ? ' selected' : ''}>${p}</option>`).join('');
}

// ─── Render Table ───────────────────────────────────────────────
function renderKsaDetailTable() {
    const cfg = KSA_TYPE_CONFIG[ksaDetailCurrentType] || KSA_TYPE_CONFIG['jed-arrival'];
    const allRecs = getKsaAllRecords();
    const curDate = ksaDetailCurrentDate;
    const search = (document.getElementById('ksd-search')?.value || '').toLowerCase().trim();
    const partyFilt = (document.getElementById('ksd-party-filter')?.value || '').trim();

    // Alert element
    const dateAlertEl = document.getElementById('ksd-date-alert');
    const dateAlertTxt = document.getElementById('ksd-date-alert-text');
    if (dateAlertEl) dateAlertEl.style.display = 'none';

    // Matching records for this type across all records
    const allTypeMatches = allRecs.filter(r => matchesMovement(r, cfg));

    // Filter by date unless All Dates is checked
    let filtered = allTypeMatches;
    let showingFallbackDates = false;

    if (!ksaDetailShowAllDatesFlag) {
        filtered = allTypeMatches.filter(r => datesMatch(r.date, curDate));

        // If no records found for this specific date, but there ARE records in other dates:
        if (filtered.length === 0 && allTypeMatches.length > 0) {
            filtered = allTypeMatches; // show all so the user sees the data!
            showingFallbackDates = true;
            if (dateAlertEl && dateAlertTxt) {
                dateAlertTxt.innerHTML = `<span>⚠️ منتخب تاریخ (<strong>${curDate}</strong>) پر کوئی واؤچر نہیں ملا۔ نیچے اس موومنٹ کے دیگر تاریخوں کے تمام <strong>${allTypeMatches.length}</strong> واؤچرز دکھائے جا رہے ہیں:</span>`;
                dateAlertEl.style.display = 'flex';
            }
        }
    }

    // Search filter (including voucher, name, party, newParty, sector, group, mobile, shirka, flightNo)
    if (search) {
        filtered = filtered.filter(r => {
            const haystack = [
                r.voucher, r.party, r.newParty, r.sector,
                r.transport, r.flightNo, r.airport, r.transportNature,
                r.notes, r.name, r.group, r.mobile, r.shirka, r.date
            ].join(' ').toLowerCase();
            return haystack.includes(search);
        });
    }

    // Party filter
    if (partyFilt) {
        filtered = filtered.filter(r => (r.party || '').trim() === partyFilt);
    }

    const tbody      = document.getElementById('ksd-table-body');
    const emptyEl    = document.getElementById('ksd-empty-state');
    const emptyHint  = document.getElementById('ksd-empty-hint');
    const btnShowAll = document.getElementById('btn-show-all-dates');
    const tableCard  = document.querySelector('.ksa-detail-table-card');

    // Summary calculation
    const totalPilgrims = filtered.reduce((s, r) => s + (parseInt(r.count) || 0), 0);
    const totalBilling  = filtered.reduce((s, r) => s + (parseFloat(r.total) || 0), 0);
    const uniqueParties = new Set(filtered.map(r => r.party).filter(Boolean)).size;

    const setEl = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
    setEl('ksd-total-records',  filtered.length.toLocaleString());
    setEl('ksd-total-pilgrims', totalPilgrims.toLocaleString());
    setEl('ksd-total-billing',  'SAR ' + Math.round(totalBilling).toLocaleString());
    setEl('ksd-total-parties',  uniqueParties.toLocaleString());

    // Update subtitle text to reflect all dates vs specific date
    const subtitleEl = document.getElementById('ksa-detail-subtitle');
    if (subtitleEl) {
        if (ksaDetailShowAllDatesFlag || showingFallbackDates) {
            subtitleEl.textContent = `تمام تاریخیں — ${filtered.length} واؤچرز (${totalPilgrims} حجاج)`;
        } else {
            subtitleEl.textContent = `${curDate} — تاریخ کے مطابق ${filtered.length} واؤچرز (${totalPilgrims} حجاج)`;
        }
    }

    if (filtered.length === 0) {
        if (tbody)     tbody.innerHTML = '';
        if (tableCard) tableCard.style.display = 'none';
        if (emptyEl) {
            emptyEl.style.display = 'block';
            if (emptyHint) emptyHint.textContent = 'اس کیٹیگری کا کوئی ریکارڈ یا واؤچر موجود نہیں ہے۔';
            if (btnShowAll) btnShowAll.style.display = 'none';
        }
        return;
    }

    if (emptyEl)   emptyEl.style.display = 'none';
    if (tableCard) tableCard.style.display = 'block';
    if (!tbody) return;

    tbody.innerHTML = filtered.map((r, idx) => {
        const isChecked = r.status === 'checked';
        const statusBadge = isChecked
            ? `<span class="dash-status-pill status-checked">✓ چیک شدہ</span>`
            : `<span class="dash-status-pill status-pending">⏳ زیر التواء</span>`;

        const dt       = safeFd(r.date);
        const total    = safeSar(r.total);
        const time     = safeFormatTime(r.flightTime);
        const countVal = parseInt(r.count) || 0;
        const safeId   = String(r.id || '').replace(/'/g, "\\'");

        const hajiDisplayName = r.name || r.newParty || 'معتمر / حاجی';
        const groupBadge = r.group ? `<span style="font-size:11px;background:var(--surface-alt);border:1px solid var(--border);padding:1px 6px;border-radius:4px;color:var(--text);">گروپ: <strong>${r.group}</strong></span>` : '';
        const mobileBadge = r.mobile ? `<span dir="ltr" style="font-size:11px;color:var(--primary);font-family:monospace;font-weight:600;">📞 ${r.mobile}</span>` : '';

        return `
            <tr class="${cfg.rowClass}" onclick="openKsdVoucherModal('${safeId}')" title="کلک کریں: اس واؤچر کے حجاج کی مکمل تفصیل دیکھیں" style="cursor:pointer;">
                <td style="color:var(--muted);font-weight:600;text-align:center;">${idx + 1}</td>
                <td>
                    <span class="voucher-tag" style="background:rgba(20,43,74,0.08);color:var(--primary);font-weight:700;font-family:monospace;padding:3px 8px;border-radius:6px;border:1px solid rgba(20,43,74,0.15);font-size:12.5px;display:inline-block;">
                        ${r.voucher || '—'}
                    </span>
                </td>
                <td>
                    <div style="font-weight:700;font-size:13px;color:var(--text);">${hajiDisplayName}</div>
                    <div style="font-size:11.5px;color:var(--text-soft);margin-top:2px;display:flex;gap:6px;align-items:center;flex-wrap:wrap;">
                        ${groupBadge}
                        ${mobileBadge}
                    </div>
                </td>
                <td style="white-space:nowrap;">${dt}</td>
                <td><strong>${r.party || '—'}</strong></td>
                <td>
                    <div style="font-weight:600;">${r.newParty || '—'}</div>
                    ${r.shirka ? `<div style="font-size:11px;color:var(--text-soft);margin-top:1px;">شرکہ: ${r.shirka}</div>` : ''}
                </td>
                <td><span class="sector-tag">${r.sector || '—'}</span></td>
                <td style="font-size:12px;">${r.transport || '—'}</td>
                <td style="text-align:center;">
                    <span style="font-weight:800;font-size:15px;color:var(--primary);background:rgba(20,43,74,0.08);padding:3px 10px;border-radius:6px;display:inline-block;min-width:36px;">
                        ${countVal}
                    </span>
                </td>
                <td style="font-size:12px;">
                    ${r.flightNo ? `<strong style="font-family:monospace;color:var(--primary);">✈ ${r.flightNo}</strong>` : ''}
                    <div style="font-size:11px;color:var(--text-soft);">${time} ${r.airport ? `| ${r.airport}` : ''}</div>
                </td>
                <td style="font-weight:700;white-space:nowrap;">SAR ${total}</td>
                <td>${statusBadge}</td>
                <td class="no-print" style="text-align:center;white-space:nowrap;">
                    <button type="button" class="btn btn-sm btn-o" onclick="event.stopPropagation();openKsdVoucherModal('${safeId}')" title="حجاج کی مکمل تفصیل دیکھیں" style="padding:3px 8px;font-size:12px;margin-inline-end:4px;">
                        👁️ تفصیل
                    </button>
                    <button type="button" class="btn btn-sm btn-o" onclick="event.stopPropagation();if(typeof editRecord==='function') editRecord('${safeId}')" title="ترمیم" style="padding:3px 7px;font-size:12px;">
                        ✏️
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

// ─── Modal: View Voucher & Pilgrims Details ────────────────────
function openKsdVoucherModal(id) {
    const allRecs = getKsaAllRecords();
    const r = allRecs.find(x => String(x.id) === String(id));
    if (!r) return;

    const modal = document.getElementById('ksd-voucher-modal');
    const titleEl = document.getElementById('ksd-modal-vch-title');
    const subEl = document.getElementById('ksd-modal-vch-sub');
    const bodyEl = document.getElementById('ksd-modal-vch-body');
    const actionsEl = document.getElementById('ksd-modal-actions');
    if (!modal || !bodyEl) return;

    const vch = r.voucher || '—';
    if (titleEl) titleEl.textContent = `واؤچر نمبر: ${vch}`;
    if (subEl) subEl.textContent = `تاریخ: ${safeFd(r.date)} | ٹرانسپورٹر: ${r.party || '—'} | سیکٹر: ${r.sector || '—'}`;

    // Check if there are matching Nusuk pilgrims for this group or party
    let nusukMatches = [];
    const bList = (typeof umrahBookings !== 'undefined' && Array.isArray(umrahBookings)) ? umrahBookings : [];
    if (bList.length > 0) {
        const grp = String(r.group || '').trim().toLowerCase();
        const vchKey = String(r.voucher || '').trim().toLowerCase();
        const nameKey = String(r.name || '').trim().toLowerCase();
        if (grp) {
            nusukMatches = bList.filter(b => String(b.groupNo || '').toLowerCase() === grp);
        }
        if (!nusukMatches.length && vchKey) {
            nusukMatches = bList.filter(b => String(b.groupNo || '').toLowerCase() === vchKey);
        }
        if (!nusukMatches.length && nameKey && nameKey.length > 3) {
            nusukMatches = bList.filter(b => String(b.name || '').toLowerCase().includes(nameKey));
        }
    }

    let nusukHtml = '';
    if (nusukMatches.length > 0) {
        nusukHtml = `
            <div style="margin-top:18px;border-top:1px dashed var(--border);padding-top:14px;">
                <div style="font-size:13.5px;font-weight:700;color:var(--primary);margin-bottom:8px;display:flex;align-items:center;gap:6px;">
                    <span>🕋</span>
                    <span>Nusuk امپورٹ ڈیٹا سے منسلک معتمرین (${nusukMatches.length} افراد):</span>
                </div>
                <div style="max-height:220px;overflow-y:auto;border:1px solid var(--border);border-radius:8px;">
                    <table style="width:100%;border-collapse:collapse;font-size:12px;">
                        <thead>
                            <tr style="background:var(--surface-alt);border-bottom:1px solid var(--border);text-align:start;">
                                <th style="padding:6px 8px;text-align:center;">#</th>
                                <th style="padding:6px 8px;">معتمر کا نام</th>
                                <th style="padding:6px 8px;text-align:center;">پاسپورٹ نمبر</th>
                                <th style="padding:6px 8px;text-align:center;">عمر / نوعیت</th>
                                <th style="padding:6px 8px;text-align:center;">ویزا نمبر</th>
                                <th style="padding:6px 8px;text-align:center;">ویزا اسٹیٹس</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${nusukMatches.map((m, mi) => `
                                <tr style="border-bottom:1px solid var(--border);">
                                    <td style="padding:6px 8px;text-align:center;color:var(--text-soft);">${mi + 1}</td>
                                    <td style="padding:6px 8px;font-weight:600;">${m.name}</td>
                                    <td style="padding:6px 8px;text-align:center;font-family:monospace;font-weight:600;color:var(--primary);">${m.passport}</td>
                                    <td style="padding:6px 8px;text-align:center;">${m.age || '—'} (${m.mutamerType || 'Adult'})</td>
                                    <td style="padding:6px 8px;text-align:center;font-family:monospace;">${m.visaNo || '—'}</td>
                                    <td style="padding:6px 8px;text-align:center;"><span style="background:rgba(34,197,94,0.12);color:#16a34a;padding:2px 6px;border-radius:10px;font-size:11px;">${m.visaStatus || 'Issued'}</span></td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }

    bodyEl.innerHTML = `
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:12px;background:var(--bg-page);padding:14px;border-radius:var(--radius-lg);border:1px solid var(--border);margin-bottom:14px;">
            <div><span style="font-size:11px;color:var(--muted);">واؤچر نمبر:</span> <strong style="font-family:monospace;font-size:14.5px;color:var(--primary);">${r.voucher || '—'}</strong></div>
            <div><span style="font-size:11px;color:var(--muted);">تاریخ:</span> <strong>${safeFd(r.date)}</strong></div>
            <div><span style="font-size:11px;color:var(--muted);">حجاج کی تعداد:</span> <strong style="color:var(--accent);font-size:15px;">${r.count || 0} افراد</strong></div>
            <div><span style="font-size:11px;color:var(--muted);">ٹرانسپورٹر:</span> <strong>${r.party || '—'}</strong></div>
            <div><span style="font-size:11px;color:var(--muted);">حاجی پارٹی:</span> <strong>${r.newParty || '—'}</strong></div>
            <div><span style="font-size:11px;color:var(--muted);">سیکٹر:</span> <span class="sector-tag">${r.sector || '—'}</span></div>
            <div><span style="font-size:11px;color:var(--muted);">گاڑی:</span> <strong>${r.transport || '—'}</strong></div>
            <div><span style="font-size:11px;color:var(--muted);">کل بلنگ رقم:</span> <strong style="color:var(--gold-dark);">SAR ${safeSar(r.total)}</strong></div>
        </div>

        <div style="background:var(--white);border:1px solid var(--border);border-radius:var(--radius-lg);padding:14px;margin-bottom:14px;">
            <div style="font-size:13px;font-weight:700;color:var(--primary);margin-bottom:10px;border-bottom:1px solid var(--border);padding-bottom:6px;display:flex;align-items:center;gap:6px;">
                <span>👤</span>
                <span>معتمر / حاجی و رابطہ معلومات</span>
            </div>
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:10px;font-size:12.5px;">
                <div><span style="color:var(--muted);">حاجی / لیڈر کا نام:</span> <strong style="color:var(--text);font-size:13.5px;">${r.name || r.newParty || 'درج نہیں'}</strong></div>
                <div><span style="color:var(--muted);">گروپ نمبر:</span> <strong style="font-family:monospace;color:var(--primary);">${r.group || 'درج نہیں'}</strong></div>
                <div><span style="color:var(--muted);">رابطہ موبائل:</span> <strong dir="ltr" style="font-family:monospace;color:var(--primary);">${r.mobile || 'درج نہیں'}</strong></div>
                <div><span style="color:var(--muted);">شرکہ:</span> <strong>${r.shirka || 'درج نہیں'}</strong></div>
            </div>
        </div>

        <div style="background:var(--white);border:1px solid var(--border);border-radius:var(--radius-lg);padding:14px;">
            <div style="font-size:13px;font-weight:700;color:var(--primary);margin-bottom:10px;border-bottom:1px solid var(--border);padding-bottom:6px;display:flex;align-items:center;gap:6px;">
                <span>✈</span>
                <span>فلائیٹ و ائیرپورٹ تفصیلات</span>
            </div>
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:10px;font-size:12.5px;">
                <div><span style="color:var(--muted);">فلائیٹ نمبر:</span> <strong style="font-family:monospace;color:var(--primary);">${r.flightNo || '—'}</strong></div>
                <div><span style="color:var(--muted);">فلائیٹ وقت:</span> <strong>${safeFormatTime(r.flightTime)}</strong></div>
                <div><span style="color:var(--muted);">ائیرپورٹ / ٹرمینل:</span> <strong>${r.airport || '—'}</strong></div>
                <div><span style="color:var(--muted);">ٹرانسپورٹ نوعیت:</span> <strong>${r.transportNature || '—'}</strong></div>
            </div>
            ${r.notes ? `<div style="margin-top:10px;font-size:12px;background:var(--bg-page);padding:8px 12px;border-radius:6px;border:1px dashed var(--border);"><strong>نوٹس:</strong> ${r.notes}</div>` : ''}
        </div>

        ${nusukHtml}
    `;

    if (actionsEl) {
        actionsEl.innerHTML = `
            <button type="button" class="btn btn-p btn-sm" onclick="closeKsdVoucherModal();if(typeof editRecord==='function')editRecord('${r.id}')">
                ✏️ واؤچر ایڈٹ کریں
            </button>
        `;
    }

    modal.style.display = 'flex';
}

function closeKsdVoucherModal() {
    const modal = document.getElementById('ksd-voucher-modal');
    if (modal) modal.style.display = 'none';
}

// ─── Export Excel ───────────────────────────────────────────────
function exportKsaDetailExcel() {
    if (typeof XLSX === 'undefined') {
        alert('ایکسل لائبریری دستیاب نہیں ہے');
        return;
    }

    const cfg = KSA_TYPE_CONFIG[ksaDetailCurrentType] || { label: 'KSA Movement Report' };
    const curDate = ksaDetailCurrentDate;
    const allRecs = getKsaAllRecords();
    const search  = (document.getElementById('ksd-search')?.value || '').toLowerCase().trim();
    const partyFilt = (document.getElementById('ksd-party-filter')?.value || '').trim();

    let filtered = allRecs.filter(r => matchesMovement(r, cfg));

    if (!ksaDetailShowAllDatesFlag) {
        filtered = filtered.filter(r => datesMatch(r.date, curDate));
    }

    if (search) {
        filtered = filtered.filter(r => {
            const h = [r.voucher, r.party, r.newParty, r.sector, r.transport, r.flightNo, r.airport, r.notes, r.date].join(' ').toLowerCase();
            return h.includes(search);
        });
    }

    if (partyFilt) {
        filtered = filtered.filter(r => (r.party || '').trim() === partyFilt);
    }

    if (filtered.length === 0) {
        alert('ایکسپورٹ کے لیے کوئی ڈیٹا نہیں ملا');
        return;
    }

    const dateHeader = ksaDetailShowAllDatesFlag ? 'تمام تاریخیں' : `تاریخ: ${curDate}`;
    const data = [
        ['Umrah Transport Management System'],
        [cfg.label, dateHeader],
        [''],
        ['#', 'واؤچر', 'تاریخ', 'ٹرانسپورٹر', 'حاجی پارٹی', 'سیکٹر', 'گاڑی', 'حجاج کی تعداد', 'فلائیٹ نمبر', 'فلائیٹ کا وقت', 'کل رقم (SAR)', 'اسٹیٹس']
    ];

    let totalPilgrims = 0;
    let totalBilling = 0;

    filtered.forEach((r, idx) => {
        const count = parseInt(r.count) || 0;
        const total = parseFloat(r.total) || 0;
        totalPilgrims += count;
        totalBilling += total;

        data.push([
            idx + 1,
            r.voucher || '',
            r.date || '',
            r.party || '',
            r.newParty || '',
            r.sector || '',
            r.transport || '',
            count,
            r.flightNo || '',
            r.flightTime || '',
            total,
            r.status === 'checked' ? 'چیک شدہ' : 'زیر التواء'
        ]);
    });

    data.push(['', '', '', '', '', '', 'ٹوٹل:', totalPilgrims, '', '', totalBilling, '']);

    const ws = XLSX.utils.aoa_to_sheet(data);
    ws['!cols'] = [
        { wch: 6 },  { wch: 14 }, { wch: 12 }, { wch: 22 },
        { wch: 22 }, { wch: 20 }, { wch: 14 }, { wch: 12 },
        { wch: 14 }, { wch: 12 }, { wch: 16 }, { wch: 12 }
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'KSA Detail');

    const safeName = (cfg.label || 'KSA_Report').replace(/[\s\(\)\/]/g, '_');
    XLSX.writeFile(wb, `${safeName}_${ksaDetailShowAllDatesFlag ? 'AllDates' : curDate}.xlsx`);
}

// ─── Hook: called when page-ksa-detail becomes active ──────────
function onKsaDetailPageShow() {
    initKsaDetailPage();
}

// Window exposures
window.openKsaDetail          = openKsaDetail;
window.ksaDetailGoBack        = ksaDetailGoBack;
window.ksaDetailChangeDate    = ksaDetailChangeDate;
window.ksaDetailSetDate       = ksaDetailSetDate;
window.ksaDetailSetToday      = ksaDetailSetToday;
window.ksaDetailToggleAllDates= ksaDetailToggleAllDates;
window.ksaDetailShowAllDates  = ksaDetailShowAllDates;
window.ksaDetailChangeType    = ksaDetailChangeType;
window.renderKsaDetailTable   = renderKsaDetailTable;
window.exportKsaDetailExcel   = exportKsaDetailExcel;
window.onKsaDetailPageShow    = onKsaDetailPageShow;
window.openKsdVoucherModal     = openKsdVoucherModal;
window.closeKsdVoucherModal    = closeKsdVoucherModal;
