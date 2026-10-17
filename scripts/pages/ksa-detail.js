// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  KSA MOVEMENT DETAIL REPORT — Robust Page Logic
//  Shows full records list for a selected movement type & date
//  (Jeddah Arrival, Departure, Madinah Arrival, Departure, etc.)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// State
let ksaDetailCurrentType   = 'jed-arrival';
let ksaDetailCurrentDate   = null;
let ksaDetailCurrentSource = 'home';
let ksaDetailShowAllDates  = false;

// ─── Movement Type Config ──────────────────────────────────────
const KSA_TYPE_CONFIG = {
    'jed-arrival': {
        id:       'jed-arrival',
        label:    'جدہ آمد (Jeddah Arrival)',
        icon:     '✈',
        badge:    'ksd-nature-jed-arrival',
        rowClass: 'ksd-row-arrival',
        keywords: ['jed arrival', 'jeddah arrival', 'jed arr', 'جدہ آمد', 'آمد جدہ'],
    },
    'jed-departure': {
        id:       'jed-departure',
        label:    'جدہ روانگی (Jeddah Departure)',
        icon:     '✈',
        badge:    'ksd-nature-jed-departure',
        rowClass: 'ksd-row-departure',
        keywords: ['jeddah dep', 'jed dep', 'jeddah depture', 'jed depture', 'جدہ روانگی', 'روانگی جدہ'],
    },
    'med-arrival': {
        id:       'med-arrival',
        label:    'مدینہ آمد (Madinah Arrival)',
        icon:     '✈',
        badge:    'ksd-nature-med-arrival',
        rowClass: 'ksd-row-arrival',
        keywords: ['med arrival', 'madina arrival', 'med arr', 'madinah arrival', 'مدینہ آمد', 'آمد مدینہ'],
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
        keywords: ['madina to mak', 'madina to makk', 'madina to makkah', 'madina to makha', 'med to mak'],
    },
    'mak-checkout': {
        id:       'mak-checkout',
        label:    'مکہ چیک آؤٹ (Makkah Check-Out)',
        icon:     '🕋',
        badge:    'ksd-nature-mak-checkout',
        rowClass: 'ksd-row-checkout',
        keywords: ['makkah to mad', 'makkah to medina', 'makkah to madina', 'mak to med'],
    },
    'med-checkin': {
        id:       'med-checkin',
        label:    'مدینہ چیک ان (Madinah Check-In)',
        icon:     '🕌',
        badge:    'ksd-nature-med-arrival',
        rowClass: 'ksd-row-checkin',
        keywords: ['makkah to mad', 'makkah to medina', 'makkah to madina', 'mak to med'],
    },
    'med-checkout': {
        id:       'med-checkout',
        label:    'مدینہ چیک آؤٹ (Madinah Check-Out)',
        icon:     '🕌',
        badge:    'ksd-nature-jed-departure',
        rowClass: 'ksd-row-checkout',
        keywords: ['madina to mak', 'madina to makk', 'madina to makkah', 'madina to makha', 'med to mak'],
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
    const tn  = String(r.transportNature || '').toLowerCase().trim();
    const sec = String(r.sector || '').toLowerCase().trim();
    const ap  = String(r.airport || '').toLowerCase().trim();

    // 1. Direct keywords match against transportNature
    if (cfg && cfg.keywords && cfg.keywords.some(kw => tn.includes(kw))) {
        return true;
    }

    const type = cfg ? cfg.id : ksaDetailCurrentType;

    // 2. Extra intelligent fallbacks for Jed Arrival
    if (type === 'jed-arrival') {
        if (tn === 'jeddah' || tn.includes('jed arr') || tn.includes('jeddah arr') || tn.includes('جدہ آمد') || tn.includes('آمد جدہ')) {
            return true;
        }
        // If transportNature is empty, check airport or sector
        if (!tn && (ap.includes('jed') || (sec.includes('jed') && sec.includes('mak') && !sec.includes('to jed')))) {
            return true;
        }
    }

    // 3. Extra fallbacks for Jed Departure
    if (type === 'jed-departure') {
        if (tn.includes('jed dep') || tn.includes('jeddah dep') || tn.includes('جدہ روانگی') || tn.includes('روانگی جدہ')) {
            return true;
        }
        if (!tn && (sec.includes('mak to jed') || sec.includes('med to jed') || (sec.includes('to jed') && ap.includes('jed')))) {
            return true;
        }
    }

    // 4. Extra fallbacks for Med Arrival
    if (type === 'med-arrival') {
        if (tn.includes('med arr') || tn.includes('madina arr') || tn.includes('madinah arr') || tn.includes('مدینہ آمد')) {
            return true;
        }
    }

    // 5. Extra fallbacks for Med Departure
    if (type === 'med-departure') {
        if (tn.includes('med dep') || tn.includes('madina dep') || tn.includes('madinah dep') || tn.includes('مدینہ روانگی')) {
            return true;
        }
    }

    // 6. Check-in / out fallbacks
    if (type === 'mak-checkin' || type === 'med-checkout') {
        if (tn.includes('madina to mak') || tn.includes('med to mak') || sec.includes('madina to mak') || sec.includes('med to mak')) return true;
    }
    if (type === 'mak-checkout' || type === 'med-checkin') {
        if (tn.includes('makkah to mad') || tn.includes('mak to med') || sec.includes('makkah to mad') || sec.includes('mak to med')) return true;
    }

    return false;
}

// ─── Entry Point — Called from KSA Status Panel or Navigation ─
async function openKsaDetail(type, date) {
    ksaDetailShowAllDates = false;
    const allDatesCb = document.getElementById('ksd-all-dates-cb');
    if (allDatesCb) allDatesCb.checked = false;

    // Reset search & party filters on new open
    const searchInp = document.getElementById('ksd-search');
    if (searchInp) searchInp.value = '';
    const partySel = document.getElementById('ksd-party-filter');
    if (partySel) partySel.value = '';

    // Determine target date
    const dashDateEl = document.getElementById('ksa-date-display');
    const dashDate = dashDateEl ? dashDateEl.textContent.trim() : null;

    let targetDate = (date && date !== '—')
        ? date
        : (dashDate && dashDate !== '—')
            ? dashDate
            : (typeof window.ksaStatusDate !== 'undefined' && window.ksaStatusDate)
                ? window.ksaStatusDate
                : (typeof today === 'function' ? today() : new Date().toISOString().split('T')[0]);

    ksaDetailCurrentType   = type || 'jed-arrival';
    ksaDetailCurrentDate   = targetDate;
    ksaDetailCurrentSource = 'home';

    // Lazy load the HTML if not already loaded into #page-ksa-detail
    const pageEl = document.getElementById('page-ksa-detail');
    if (pageEl && !pageEl.innerHTML.trim()) {
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
    ksaDetailShowAllDates = false;
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
    ksaDetailShowAllDates = false;
    const allDatesCb = document.getElementById('ksd-all-dates-cb');
    if (allDatesCb) allDatesCb.checked = false;

    ksaDetailCurrentDate = val;
    initKsaDetailPage();
}

function ksaDetailSetToday() {
    ksaDetailShowAllDates = false;
    const allDatesCb = document.getElementById('ksd-all-dates-cb');
    if (allDatesCb) allDatesCb.checked = false;

    ksaDetailCurrentDate = (typeof today === 'function' ? today() : new Date().toISOString().split('T')[0]);
    initKsaDetailPage();
}

// ─── Toggle All Dates ──────────────────────────────────────────
function ksaDetailToggleAllDates(checked) {
    ksaDetailShowAllDates = !!checked;
    renderKsaDetailTable();
}

function ksaDetailShowAllDates() {
    ksaDetailShowAllDates = true;
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
    if (subtitleEl) subtitleEl.textContent = ksaDetailShowAllDates ? `تمام تاریخیں — مکمل ریکارڈز` : `${curDate} — تاریخ کے مطابق ریکارڈز`;
    if (badgeEl)    badgeEl.textContent    = cfg.icon;
    if (dateInput)  dateInput.value         = curDate;
    if (typeSelect) typeSelect.value        = ksaDetailCurrentType;

    // Print labels
    const printTitle = document.getElementById('ksd-print-title');
    const printDate  = document.getElementById('ksd-print-date');
    if (printTitle) printTitle.textContent = cfg.label;
    if (printDate)  printDate.textContent  = ksaDetailShowAllDates ? `تمام تاریخیں` : `تاریخ: ${curDate}`;

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
        if (!ksaDetailShowAllDates && !datesMatch(r.date, curDate)) return false;
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

    // Matching records for this type across all records
    const allTypeMatches = allRecs.filter(r => matchesMovement(r, cfg));

    // Filter by date unless All Dates is checked
    let filtered = allTypeMatches;
    if (!ksaDetailShowAllDates) {
        filtered = filtered.filter(r => datesMatch(r.date, curDate));
    }

    // Search filter
    if (search) {
        filtered = filtered.filter(r => {
            const haystack = [
                r.voucher, r.party, r.newParty, r.sector,
                r.transport, r.flightNo, r.airport, r.transportNature,
                r.notes, r.name, r.date
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
        subtitleEl.textContent = ksaDetailShowAllDates ? `تمام تاریخیں — ${filtered.length} ریکارڈز` : `${curDate} — تاریخ کے مطابق ریکارڈز`;
    }

    if (filtered.length === 0) {
        if (tbody)     tbody.innerHTML = '';
        if (tableCard) tableCard.style.display = 'none';
        if (emptyEl) {
            emptyEl.style.display = 'block';
            if (!ksaDetailShowAllDates && allTypeMatches.length > 0) {
                const totalAllPilgrims = allTypeMatches.reduce((s, r) => s + (parseInt(r.count) || 0), 0);
                if (emptyHint) {
                    emptyHint.innerHTML = `<span style="color:var(--accent);font-weight:600;">اس تاریخ (${curDate}) پر کوئی ریکارڈ نہیں ملا۔ لیکن دیگر تاریخوں میں کل <strong>${allTypeMatches.length} ریکارڈز (${totalAllPilgrims} حجاج)</strong> موجود ہیں۔</span>`;
                }
                if (btnShowAll) btnShowAll.style.display = 'inline-block';
            } else {
                if (emptyHint) emptyHint.textContent = 'اس قسم کی نقل و حرکت کا کوئی ریکارڈ موجود نہیں ہے۔';
                if (btnShowAll) btnShowAll.style.display = 'none';
            }
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

        return `
            <tr class="${cfg.rowClass}" onclick="if(typeof editRecord==='function') editRecord('${safeId}')" title="کلک کریں — ریکارڈ ایڈٹ / تفصیل">
                <td style="color:var(--muted);font-weight:600;">${idx + 1}</td>
                <td><strong class="text-primary" style="color:var(--primary);">${r.voucher || '—'}</strong></td>
                <td>${dt}</td>
                <td><strong>${r.party || '—'}</strong></td>
                <td>${r.newParty || '—'}</td>
                <td><span class="sector-tag">${r.sector || '—'}</span></td>
                <td style="font-size:12px;">${r.transport || '—'}</td>
                <td><strong style="font-size:16px;color:var(--primary);">${countVal}</strong></td>
                <td style="font-size:12px;">${r.flightNo || '—'}</td>
                <td style="font-size:12px;">${time}</td>
                <td><strong>SAR ${total}</strong></td>
                <td>${statusBadge}</td>
                <td class="no-print">
                    <button type="button" class="btn btn-sm btn-o" onclick="event.stopPropagation();if(typeof editRecord==='function') editRecord('${safeId}')" title="ترمیم">
                        ✏️
                    </button>
                </td>
            </tr>
        `;
    }).join('');
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

    if (!ksaDetailShowAllDates) {
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

    const dateHeader = ksaDetailShowAllDates ? 'تمام تاریخیں' : `تاریخ: ${curDate}`;
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
    XLSX.writeFile(wb, `${safeName}_${ksaDetailShowAllDates ? 'AllDates' : curDate}.xlsx`);
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
