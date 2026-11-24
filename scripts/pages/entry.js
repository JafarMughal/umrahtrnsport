// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  UMRAH TRANSPORT MANAGEMENT SYSTEM (TMS) — MULTI-SECTOR ITINERARY & ENTRY ENGINE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// ── 1. LIGHT & DARK THEME ENGINE ──
function toggleAppTheme(forcedTheme) {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    const target = forcedTheme || (current === 'dark' ? 'light' : 'dark');
    document.documentElement.setAttribute('data-theme', target);
    try { localStorage.setItem('uts_theme', target); } catch (e) { }
    updateThemeToggleUI(target);
}

function initAppTheme() {
    let saved = 'light';
    try { saved = localStorage.getItem('uts_theme') || 'light'; } catch (e) { }
    document.documentElement.setAttribute('data-theme', saved);
    updateThemeToggleUI(saved);
}

function updateThemeToggleUI(theme) {
    const isDark = theme === 'dark';
    const isUrdu = typeof lang === 'undefined' || lang === 'ur';
    const isArabic = typeof lang !== 'undefined' && lang === 'ar';
    const iconEl = document.getElementById('theme-toggle-icon');
    const textEl = document.getElementById('theme-btn-text');
    if (iconEl && textEl) {
        iconEl.textContent = isDark ? '☀️' : '🌙';
        textEl.textContent = isDark
            ? (isUrdu ? 'لائٹ' : isArabic ? 'فاتح' : 'Light')
            : (isUrdu ? 'ڈارک' : isArabic ? 'داكن' : 'Dark');
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAppTheme);
} else {
    initAppTheme();
}

// ── 2. HEADER MODE BADGE (نئی انٹری / اپ ڈیٹ) ──
function updateEntryModeBadge(isUpdate) {
    const badge = document.getElementById('entry-mode-badge');
    const text = document.getElementById('entry-mode-text');
    if (!badge || !text) return;

    const L = (typeof T !== 'undefined' && T[lang]) ? T[lang] : {};
    const isEn = typeof lang !== 'undefined' && lang === 'en';
    const isAr = typeof lang !== 'undefined' && lang === 'ar';

    if (isUpdate) {
        badge.classList.add('is-update');
        text.textContent = L.updateMode || (isEn ? 'Update' : isAr ? 'تحديث' : 'اپ ڈیٹ');
    } else {
        badge.classList.remove('is-update');
        text.textContent = L.newMode || (isEn ? 'New Entry' : isAr ? 'سجل جديد' : 'نئی انٹری');
    }
}

// ── 3. SHARING / VEHICLE HELPERS & RATE LOOKUP ──
function isEconomyBus(transport, sector) {
    const str = ((transport || '') + ' ' + (sector || '')).trim();
    return /economy.*bus|bus.*economy|شیئرنگ|sharing|مشترك|بس|bus/i.test(str);
}

function findMatchingVehicleRate(sector, transport, date) {
    if (!sector || !transport || !Array.isArray(vehicleRates) || vehicleRates.length === 0) {
        return null;
    }

    const secNorm = sector.trim().toLowerCase();
    const trNorm = transport.trim().toLowerCase();
    const d = (date || '').trim() || new Date().toISOString().slice(0, 10);

    const matched = vehicleRates.filter(r => 
        (r.sector || '').trim().toLowerCase() === secNorm &&
        (r.transport || '').trim().toLowerCase() === trNorm
    );

    if (matched.length === 0) return null;

    // 1. Priority: date-specific seasonal rate valid for the given date
    const activeSeasonal = matched.find(r => {
        const hasFrom = !!r.validFrom;
        const hasTo = !!r.validTo;
        if (!hasFrom && !hasTo) return false;
        if (hasFrom && d < r.validFrom) return false;
        if (hasTo && d > r.validTo) return false;
        return true;
    });

    if (activeSeasonal) {
        return {
            rate: activeSeasonal,
            fare: activeSeasonal.fare,
            isSeasonal: true,
            isExpired: false,
            note: activeSeasonal.note || '',
            validTo: activeSeasonal.validTo || '',
            validFrom: activeSeasonal.validFrom || '',
            type: activeSeasonal.type || 'vehicle'
        };
    }

    // 2. Priority: default permanent rate
    const permanent = matched.find(r => !r.validFrom && !r.validTo);
    if (permanent) {
        return {
            rate: permanent,
            fare: permanent.fare,
            isSeasonal: false,
            isExpired: false,
            note: permanent.note || '',
            type: permanent.type || 'vehicle'
        };
    }

    // 3. Expired seasonal rate
    const expiredRate = matched.find(r => r.validTo && d > r.validTo);
    if (expiredRate) {
        return {
            rate: expiredRate,
            fare: expiredRate.fare,
            isSeasonal: true,
            isExpired: true,
            note: expiredRate.note || '',
            validTo: expiredRate.validTo,
            type: expiredRate.type || 'vehicle'
        };
    }

    return null;
}

// Date helper: adds days to YYYY-MM-DD
function addDaysToDate(dateStr, days) {
    if (!dateStr) return dateStr;
    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    const d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
    d.setDate(d.getDate() + days);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
}

// ── 4. MULTI-SECTOR ITINERARY STATE & LOGIC ──
let entrySectorsList = [];

function createDefaultSectorRow(opts = {}) {
    const todayStr = typeof today === 'function' ? today() : new Date().toISOString().split('T')[0];
    const voucherDate = document.getElementById('e-date')?.value || todayStr;
    const id = opts.id || ('sec_' + Math.random().toString(36).slice(2, 9));
    return {
        id: id,
        date: opts.date || voucherDate,
        sector: opts.sector || '',
        transport: opts.transport || '',
        transportNature: opts.transportNature || '',
        fare: (opts.fare !== undefined && opts.fare !== null) ? opts.fare : '',
        total: (opts.total !== undefined && opts.total !== null) ? opts.total : 0,
        rateNote: opts.rateNote || '',
        isAutoRate: !!opts.isAutoRate,
        flightNo: opts.flightNo || '',
        flightTime: opts.flightTime || '',
        airport: opts.airport || '',
        showFlight: !!(opts.flightNo || opts.flightTime || opts.airport || opts.showFlight)
    };
}

function findBestMatchingSector(targetText) {
    const available = (typeof sectors !== 'undefined' && Array.isArray(sectors)) ? sectors : [];
    if (!available.length) return targetText;
    const norm = s => (s || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    const targetNorm = norm(targetText);
    const exact = available.find(s => norm(s) === targetNorm);
    if (exact) return exact;
    const partial = available.find(s => {
        const sn = norm(s);
        return sn.includes(targetNorm) || targetNorm.includes(sn);
    });
    return partial || targetText;
}

function findBestMatchingNature(targetText) {
    const baseNatures = (typeof transportNatures !== 'undefined' && Array.isArray(transportNatures)) ? transportNatures : [];
    const defaultNatures = ['Jed Arrival', 'MED Arrival', 'Makkah to Madina', 'Madina TO Makha', 'Jeddah Depture', 'Madina Depture'];
    const all = [...new Set([...baseNatures, ...defaultNatures])];
    const norm = s => (s || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    const targetNorm = norm(targetText);
    return all.find(n => norm(n) === targetNorm) || targetText;
}

// Apply Itinerary Preset (مکمل عمرہ، مدینہ فرسٹ، مکہ صرف، سنگل)
function applyItineraryPreset(presetKey) {
    const todayStr = typeof today === 'function' ? today() : new Date().toISOString().split('T')[0];
    const voucherDate = document.getElementById('e-date')?.value || todayStr;
    const currentTransport = (entrySectorsList[0] && entrySectorsList[0].transport) || '';

    // Highlight active preset button
    document.querySelectorAll('.preset-pill-btn').forEach(btn => btn.classList.remove('active'));
    try {
        if (typeof event !== 'undefined' && event && event.currentTarget && event.currentTarget.classList) {
            event.currentTarget.classList.add('active');
        }
    } catch (e) { }

    if (presetKey === 'full_umrah') {
        // 4 Routes: Jeddah -> Makkah, Makkah -> Madinah, Madinah -> Makkah, Makkah -> Jeddah
        entrySectorsList = [
            createDefaultSectorRow({
                date: voucherDate,
                sector: findBestMatchingSector('Jeddah ➜ Makkah'),
                transport: currentTransport,
                transportNature: findBestMatchingNature('Jed Arrival'),
                airport: 'Jeddah Airport - Terminal 1 (KAIA T1)',
                showFlight: true
            }),
            createDefaultSectorRow({
                date: addDaysToDate(voucherDate, 4),
                sector: findBestMatchingSector('Makkah ➜ Madinah'),
                transport: currentTransport,
                transportNature: findBestMatchingNature('Makkah to Madina'),
                showFlight: false
            }),
            createDefaultSectorRow({
                date: addDaysToDate(voucherDate, 8),
                sector: findBestMatchingSector('Madinah ➜ Makkah'),
                transport: currentTransport,
                transportNature: findBestMatchingNature('Madina TO Makha'),
                showFlight: false
            }),
            createDefaultSectorRow({
                date: addDaysToDate(voucherDate, 10),
                sector: findBestMatchingSector('Makkah ➜ Jeddah'),
                transport: currentTransport,
                transportNature: findBestMatchingNature('Jeddah Depture'),
                airport: 'Jeddah Airport - Terminal 1 (KAIA T1)',
                showFlight: true
            })
        ];
    } else if (presetKey === 'med_first') {
        // 3 Routes: Madinah Airport -> Madinah, Madinah -> Makkah, Makkah -> Jeddah
        entrySectorsList = [
            createDefaultSectorRow({
                date: voucherDate,
                sector: findBestMatchingSector('Madinah Airport ➜ Madinah'),
                transport: currentTransport,
                transportNature: findBestMatchingNature('MED Arrival'),
                airport: 'Madinah Airport (AMAA)',
                showFlight: true
            }),
            createDefaultSectorRow({
                date: addDaysToDate(voucherDate, 4),
                sector: findBestMatchingSector('Madinah ➜ Makkah'),
                transport: currentTransport,
                transportNature: findBestMatchingNature('Madina TO Makha'),
                showFlight: false
            }),
            createDefaultSectorRow({
                date: addDaysToDate(voucherDate, 10),
                sector: findBestMatchingSector('Makkah ➜ Jeddah'),
                transport: currentTransport,
                transportNature: findBestMatchingNature('Jeddah Depture'),
                airport: 'Jeddah Airport - Terminal 1 (KAIA T1)',
                showFlight: true
            })
        ];
    } else if (presetKey === 'makkah_only') {
        // 2 Routes: Jeddah -> Makkah, Makkah -> Jeddah
        entrySectorsList = [
            createDefaultSectorRow({
                date: voucherDate,
                sector: findBestMatchingSector('Jeddah ➜ Makkah'),
                transport: currentTransport,
                transportNature: findBestMatchingNature('Jed Arrival'),
                airport: 'Jeddah Airport - Terminal 1 (KAIA T1)',
                showFlight: true
            }),
            createDefaultSectorRow({
                date: addDaysToDate(voucherDate, 5),
                sector: findBestMatchingSector('Makkah ➜ Jeddah'),
                transport: currentTransport,
                transportNature: findBestMatchingNature('Jeddah Depture'),
                airport: 'Jeddah Airport - Terminal 1 (KAIA T1)',
                showFlight: true
            })
        ];
    } else {
        // 1 Single Route
        entrySectorsList = [
            createDefaultSectorRow({
                date: voucherDate,
                sector: findBestMatchingSector('Jeddah ➜ Makkah'),
                transport: currentTransport,
                transportNature: findBestMatchingNature('Jed Arrival'),
                showFlight: false
            })
        ];
    }

    // Auto-calculate rates for all rows
    entrySectorsList.forEach(r => recalcSectorRow(r.id, false));
    renderEntrySectorsTable();
    updateItinerarySummary();
}

function addEntrySectorRow() {
    const todayStr = typeof today === 'function' ? today() : new Date().toISOString().split('T')[0];
    const voucherDate = document.getElementById('e-date')?.value || todayStr;

    let nextDate = voucherDate;
    let nextTransport = '';

    if (entrySectorsList.length > 0) {
        const lastRow = entrySectorsList[entrySectorsList.length - 1];
        nextDate = lastRow.date || voucherDate;
        nextTransport = lastRow.transport || '';
    }

    const newRow = createDefaultSectorRow({
        date: nextDate,
        transport: nextTransport
    });

    entrySectorsList.push(newRow);
    recalcSectorRow(newRow.id, false);
    renderEntrySectorsTable();
    updateItinerarySummary();
}

function removeEntrySectorRow(rowId) {
    if (entrySectorsList.length <= 1) {
        // Reset single row to clean state
        entrySectorsList[0] = createDefaultSectorRow();
    } else {
        entrySectorsList = entrySectorsList.filter(r => r.id !== rowId);
    }
    renderEntrySectorsTable();
    updateItinerarySummary();
}

function toggleSectorFlightDetails(rowId) {
    const row = entrySectorsList.find(r => r.id === rowId);
    if (!row) return;
    row.showFlight = !row.showFlight;
    renderEntrySectorsTable();
}

function updateSectorRowField(rowId, field, val) {
    const row = entrySectorsList.find(r => r.id === rowId);
    if (!row) return;
    row[field] = val;

    if (field === 'flightNo' || field === 'flightTime' || field === 'airport') {
        const toggleBtn = document.getElementById(`btn-flight-${rowId}`);
        if (toggleBtn) {
            const hasFlight = !!(row.flightNo || row.flightTime || row.airport);
            if (hasFlight) {
                toggleBtn.classList.add('has-flight');
                toggleBtn.textContent = `✈️ ${row.flightNo || 'تفصیلات'}`;
            } else {
                toggleBtn.classList.remove('has-flight');
                toggleBtn.textContent = '✈️ فلائیٹ درج کریں';
            }
        }
    }

    syncLegacyFieldsFromRow1();
}

function onSectorRowSectorChange(rowId, newSector) {
    const row = entrySectorsList.find(r => r.id === rowId);
    if (!row) return;
    row.sector = newSector;

    // Suggest default transportNature based on sector if not set
    if (!row.transportNature && newSector) {
        const s = newSector.toLowerCase();
        if (s.includes('jed') && (s.includes('mak') || s.includes('arr') || s.includes('آمد'))) {
            row.transportNature = findBestMatchingNature('Jed Arrival');
        } else if (s.includes('med') && (s.includes('arr') || s.includes('آمد'))) {
            row.transportNature = findBestMatchingNature('MED Arrival');
        } else if (s.includes('mak') && s.includes('med')) {
            row.transportNature = findBestMatchingNature('Makkah to Madina');
        } else if (s.includes('med') && s.includes('mak')) {
            row.transportNature = findBestMatchingNature('Madina TO Makha');
        } else if (s.includes('jed') && (s.includes('dep') || s.includes('روانگی'))) {
            row.transportNature = findBestMatchingNature('Jeddah Depture');
        } else if (s.includes('med') && (s.includes('dep') || s.includes('روانگی'))) {
            row.transportNature = findBestMatchingNature('Madina Depture');
        }
        const natureSel = document.getElementById(`sec-nature-${rowId}`);
        if (natureSel) natureSel.value = row.transportNature;
    }

    recalcSectorRow(rowId);
}

function onSectorRowTransportChange(rowId, newTransport) {
    const row = entrySectorsList.find(r => r.id === rowId);
    if (!row) return;
    row.transport = newTransport;
    recalcSectorRow(rowId);
}

function onSectorRowFareChange(rowId, newFare) {
    const row = entrySectorsList.find(r => r.id === rowId);
    if (!row) return;
    row.fare = newFare;
    row.isAutoRate = false; // Manually overwritten by user
    row.rateNote = '';
    recalcSectorRow(rowId);
}

function recalcSectorRow(rowId, updateSummary = true) {
    const row = entrySectorsList.find(r => r.id === rowId);
    if (!row) return;

    // Check automatic rate from vehicleRates
    if (row.sector && row.transport) {
        const matchResult = findMatchingVehicleRate(row.sector, row.transport, row.date);
        if (matchResult && !matchResult.isExpired) {
            if (row.fare === '' || row.fare === undefined || row.isAutoRate) {
                row.fare = matchResult.fare;
                row.isAutoRate = true;
                const noteText = matchResult.note ? ` (${matchResult.note})` : (matchResult.isSeasonal ? ' (سیزنل)' : '');
                row.rateNote = `✓ ${matchResult.fare} SAR${noteText}`;
            }
        } else if (row.isAutoRate) {
            row.rateNote = '';
        }
    }

    const countInput = parseInt(document.getElementById('e-count')?.value);
    const pax = (!isNaN(countInput) && countInput > 0) ? countInput : 1;
    const fare = parseFloat(row.fare) || 0;

    const isPerPilgrim = typeof isEconomyBus === 'function'
        ? isEconomyBus(row.transport, row.sector)
        : /economy.*bus|bus.*economy|شیئرنگ|sharing|مشترك|بس|bus/i.test(((row.transport || '') + ' ' + (row.sector || '')).trim());

    row.mode = isPerPilgrim ? 'sharing' : 'vehicle';
    row.total = isPerPilgrim ? Math.round(pax * fare) : Math.round(fare);

    // Update specific row DOM elements directly to preserve focus
    const fareInp = document.getElementById(`sec-fare-${rowId}`);
    if (fareInp && (fareInp.value === '' || row.isAutoRate)) {
        fareInp.value = row.fare !== '' ? row.fare : '';
    }
    const totalInp = document.getElementById(`sec-tot-${rowId}`);
    if (totalInp) {
        totalInp.value = row.total;
    }
    const noteEl = document.getElementById(`sec-note-${rowId}`);
    if (noteEl) {
        noteEl.textContent = row.rateNote || '';
        noteEl.style.display = row.rateNote ? 'block' : 'none';
    }

    if (updateSummary) {
        updateItinerarySummary();
    }
}

function recalcAllEntrySectors() {
    entrySectorsList.forEach(r => recalcSectorRow(r.id, false));
    updateItinerarySummary();
}

function updateItinerarySummary() {
    const totalSectors = entrySectorsList.length;
    const countInput = parseInt(document.getElementById('e-count')?.value);
    const totalPax = (!isNaN(countInput) && countInput > 0) ? countInput : 0;
    const grandTotal = entrySectorsList.reduce((sum, r) => sum + (parseFloat(r.total) || 0), 0);

    const secCountEl = document.getElementById('e-summary-sectors-count');
    if (secCountEl) secCountEl.textContent = totalSectors;

    const paxCountEl = document.getElementById('e-summary-pax-count');
    if (paxCountEl) paxCountEl.textContent = totalPax.toLocaleString();

    const grandTotalEl = document.getElementById('e-summary-grand-total');
    if (grandTotalEl) grandTotalEl.textContent = Math.round(grandTotal).toLocaleString();

    // Compatibility hidden input
    const compatTotal = document.getElementById('e-total');
    if (compatTotal) compatTotal.value = Math.round(grandTotal);

    syncLegacyFieldsFromRow1();
}

// Sync first row data into legacy hidden inputs for 100% backward compatibility
function syncLegacyFieldsFromRow1() {
    const r1 = entrySectorsList[0];
    if (!r1) return;

    const sEl = document.getElementById('e-sector'); if (sEl) sEl.value = r1.sector || '';
    const tEl = document.getElementById('e-transport'); if (tEl) tEl.value = r1.transport || '';
    const nEl = document.getElementById('e-transport-nature-sel'); if (nEl) nEl.value = r1.transportNature || '';
    const fEl = document.getElementById('e-fare'); if (fEl) fEl.value = r1.fare || '';
    const vtEl = document.getElementById('e-vehicle-total'); if (vtEl) vtEl.value = r1.total || '';
    const fnEl = document.getElementById('e-flight-no'); if (fnEl) fnEl.value = r1.flightNo || '';
    const ftEl = document.getElementById('e-flight-time'); if (ftEl) ftEl.value = r1.flightTime || '';
    const apEl = document.getElementById('e-airport'); if (apEl) apEl.value = r1.airport || '';
}

function renderEntrySectorsTable() {
    window.entrySectorsList = entrySectorsList;
    const tbody = document.getElementById('e-sectors-table-body');
    if (!tbody) return;

    if (!entrySectorsList || entrySectorsList.length === 0) {
        entrySectorsList = [createDefaultSectorRow()];
    }

    // Available sectors from state & records & default list
    const recSectors = (typeof records !== 'undefined' && Array.isArray(records)) ? records.map(r => r && r.sector).filter(Boolean) : [];
    const allSectors = Array.from(new Set([
        ...(Array.isArray(sectors) ? sectors : []),
        ...recSectors,
        'Jeddah ➜ Makkah', 'Makkah ➜ Madinah', 'Madinah ➜ Makkah', 'Makkah ➜ Jeddah',
        'Madinah Airport ➜ Madinah', 'Madinah ➜ Jeddah'
    ])).filter(Boolean);

    // Available transports from state & records
    const recTransports = (typeof records !== 'undefined' && Array.isArray(records)) ? records.map(r => r && r.transport).filter(Boolean) : [];
    const allTransports = Array.from(new Set([
        ...(Array.isArray(transports) ? transports : []),
        ...recTransports
    ])).filter(Boolean);

    // Available natures
    const baseNatures = (typeof transportNatures !== 'undefined' && Array.isArray(transportNatures)) ? transportNatures : [];
    const defaultNatures = ['Jed Arrival', 'MED Arrival', 'Makkah to Madina', 'Madina TO Makha', 'Jeddah Depture', 'Madina Depture'];
    const allNatures = Array.from(new Set([...baseNatures, ...defaultNatures])).filter(Boolean);

    let html = '';

    entrySectorsList.forEach((row, index) => {
        const rowNum = index + 1;
        const hasFlight = !!(row.flightNo || row.flightTime || row.airport);
        const flightBtnText = hasFlight ? `✈️ ${row.flightNo || 'تفصیلات'}` : '✈️ فلائیٹ درج کریں';

        html += `
        <tr id="sec-row-${row.id}">
            <td style="text-align:center;">
                <span class="sec-badge-num">${rowNum}</span>
            </td>
            <td>
                <input type="date" class="sec-input" value="${row.date || ''}" 
                    onchange="updateSectorRowField('${row.id}', 'date', this.value); recalcSectorRow('${row.id}')" />
            </td>
            <td>
                <select class="sec-select" id="sec-sector-${row.id}" onchange="onSectorRowSectorChange('${row.id}', this.value)">
                    <option value="">-- سیکٹر منتخب کریں --</option>
                    ${allSectors.map(s => `<option value="${s}" ${s === row.sector ? 'selected' : ''}>${s}</option>`).join('')}
                    ${(row.sector && !allSectors.includes(row.sector)) ? `<option value="${row.sector}" selected>${row.sector}</option>` : ''}
                </select>
            </td>
            <td>
                <select class="sec-select" id="sec-transport-${row.id}" onchange="onSectorRowTransportChange('${row.id}', this.value)">
                    <option value="">-- گاڑی منتخب کریں --</option>
                    ${allTransports.map(t => `<option value="${t}" ${t === row.transport ? 'selected' : ''}>${t}</option>`).join('')}
                    ${(row.transport && !allTransports.includes(row.transport)) ? `<option value="${row.transport}" selected>${row.transport}</option>` : ''}
                </select>
            </td>
            <td>
                <select class="sec-select" id="sec-nature-${row.id}" onchange="updateSectorRowField('${row.id}', 'transportNature', this.value)">
                    <option value="">-- نوعیت منتخب کریں --</option>
                    ${allNatures.map(n => `<option value="${n}" ${n === row.transportNature ? 'selected' : ''}>${n}</option>`).join('')}
                    ${(row.transportNature && !allNatures.includes(row.transportNature)) ? `<option value="${row.transportNature}" selected>${row.transportNature}</option>` : ''}
                </select>
            </td>
            <td>
                <button type="button" class="btn-sec-flight-toggle ${hasFlight ? 'has-flight' : ''}" id="btn-flight-${row.id}" 
                    onclick="toggleSectorFlightDetails('${row.id}')">
                    ${flightBtnText}
                </button>
            </td>
            <td>
                <input type="number" class="sec-input sec-num-input" id="sec-fare-${row.id}" min="0" placeholder="0" 
                    value="${row.fare !== undefined ? row.fare : ''}" 
                    oninput="onSectorRowFareChange('${row.id}', this.value)" />
                <span class="sec-rate-note" id="sec-note-${row.id}" style="${row.rateNote ? 'display:block;' : 'display:none;'}">${row.rateNote || ''}</span>
            </td>
            <td>
                <input type="text" class="sec-input sec-num-input sec-readonly" id="sec-tot-${row.id}" 
                    value="${row.total || 0}" readonly />
            </td>
            <td style="text-align:center;">
                <button type="button" class="btn-sec-del" onclick="removeEntrySectorRow('${row.id}')" title="رو حذف کریں">✕</button>
            </td>
        </tr>
        `;

        if (row.showFlight) {
            html += `
            <tr class="itinerary-flight-subrow" id="flight-subrow-${row.id}">
                <td colspan="9">
                    <div class="sec-flight-inline-card">
                        <div class="sfg">
                            <label>فلائیٹ نمبر (Flight No)</label>
                            <input type="text" placeholder="مثلاً: SV-732" value="${row.flightNo || ''}" 
                                oninput="updateSectorRowField('${row.id}', 'flightNo', this.value)" />
                        </div>
                        <div class="sfg">
                            <label>فلائیٹ وقت (Time)</label>
                            <input type="time" value="${row.flightTime || ''}" 
                                oninput="updateSectorRowField('${row.id}', 'flightTime', this.value)" />
                        </div>
                        <div class="sfg" style="flex:2;">
                            <label>ائیرپورٹ / ٹرمینل (Airport / Terminal)</label>
                            <input type="text" list="airport-list" placeholder="ائیرپورٹ منتخب کریں یا لکھیں..." value="${row.airport || ''}" 
                                oninput="updateSectorRowField('${row.id}', 'airport', this.value)" />
                        </div>
                    </div>
                </td>
            </tr>
            `;
        }
    });

    tbody.innerHTML = html;
}

// Global recalculation called on Pilgrims Count change (#e-count)
function calcE() {
    recalcAllEntrySectors();
}

function onDateOrTransportChange(prefix = 'e') {
    const dateVal = document.getElementById(prefix + '-date')?.value;
    if (dateVal && entrySectorsList.length > 0 && (!entrySectorsList[0].date || entrySectorsList.length === 1)) {
        entrySectorsList[0].date = dateVal;
    }
    recalcAllEntrySectors();
}

function onTransportChange(prefix) {
    onDateOrTransportChange(prefix || 'e');
}

// ── 5. VOUCHER & SAVE LOGIC ──
function setNextVoucher() {
    const vEl = document.getElementById('e-voucher');
    if (vEl && typeof genVoucher === 'function') {
        vEl.value = genVoucher();
    }
}

async function addEntry() {
    const idEl = document.getElementById('e-id');
    const editId = idEl ? idEl.value : '';

    if (editId && typeof canDo === 'function' && !canDo('edit')) {
        alert(T[lang]?.noEditPerm || 'آپ کو ریکارڈ میں تبدیلی کی اجازت نہیں ہے');
        return;
    }
    if (!editId && typeof canDo === 'function' && !canDo('entry')) {
        alert(T[lang]?.noEntryPerm || 'آپ کو نئی انٹری کرنے کی اجازت نہیں ہے');
        return;
    }

    const L = (typeof T !== 'undefined' && T[lang]) ? T[lang] : (typeof T !== 'undefined' && T.ur ? T.ur : {});
    const voucherDate = document.getElementById('e-date')?.value || (typeof today === 'function' ? today() : '');
    const party = document.getElementById('e-party')?.value || '';
    const newParty = document.getElementById('e-new-party')?.value?.trim() || '';
    const notes = document.getElementById('e-notes')?.value?.trim() || '';
    const voucher = document.getElementById('e-voucher')?.value?.trim() || (typeof genVoucher === 'function' ? genVoucher() : '');

    let countInput = parseInt(document.getElementById('e-count')?.value);
    let count = isNaN(countInput) ? 0 : countInput;

    const name = document.getElementById('e-name')?.value?.trim() || '';
    const shirka = document.getElementById('e-shirka')?.value?.trim() || '';
    const group = document.getElementById('e-group')?.value?.trim() || '';
    const mobile = document.getElementById('e-mobile')?.value?.trim() || '';

    // Validation
    if (!party) {
        if (typeof al === 'function') al('al-entry', 'براہ کرم ٹرانسپورٹر منتخب کریں (Please select transporter)', 'er');
        return;
    }

    if (!entrySectorsList || entrySectorsList.length === 0) {
        if (typeof al === 'function') al('al-entry', 'براہ کرم کم از کم ایک سیکٹر شامل کریں (Add at least 1 sector)', 'er');
        return;
    }

    // Freshly sync entrySectorsList from active DOM table rows to ensure 100% data fidelity
    if (Array.isArray(entrySectorsList)) {
        entrySectorsList.forEach(sec => {
            const rowEl = document.getElementById(`sec-row-${sec.id}`);
            if (rowEl) {
                const dateInp = rowEl.querySelector('input[type="date"]');
                if (dateInp && dateInp.value) sec.date = dateInp.value;
                const secSel = document.getElementById(`sec-sector-${sec.id}`);
                if (secSel && secSel.value) sec.sector = secSel.value;
                const trSel = document.getElementById(`sec-transport-${sec.id}`);
                if (trSel && trSel.value) sec.transport = trSel.value;
                const natSel = document.getElementById(`sec-nature-${sec.id}`);
                if (natSel && natSel.value) sec.transportNature = natSel.value;
                const fareInp = document.getElementById(`sec-fare-${sec.id}`);
                if (fareInp && fareInp.value !== '') sec.fare = fareInp.value;
                const totInp = document.getElementById(`sec-tot-${sec.id}`);
                if (totInp && totInp.value !== '') sec.total = parseFloat(totInp.value) || 0;
            }
        });
    }

    // Validate that every sector row has a sector and date
    for (let i = 0; i < entrySectorsList.length; i++) {
        const sec = entrySectorsList[i];
        if (!sec.sector) {
            if (typeof al === 'function') al('al-entry', `رو نمبر #${i + 1} میں سیکٹر منتخب نہیں ہے (Sector is required for row #${i + 1})`, 'er');
            return;
        }
        if (!sec.date) {
            sec.date = voucherDate;
        }
    }

    const savedSectorCount = entrySectorsList.length;

    if (editId) {
        // Editing: Check if this record had a voucher with other legs
        const existingRec = (typeof records !== 'undefined' && Array.isArray(records)) ? records.find(r => r.id === editId) : null;
        const oldVoucher = (existingRec && existingRec.voucher) ? existingRec.voucher : '';
        const oldNorm = (oldVoucher || '').trim().toLowerCase();

        if (oldNorm && oldNorm !== '—') {
            // Remove existing records sharing this old voucher to update the complete itinerary
            records = records.filter(r => (r.voucher || '').trim().toLowerCase() !== oldNorm);
        } else {
            records = records.filter(r => r.id !== editId);
        }

        // Re-insert all updated sectors for this voucher
        entrySectorsList.forEach(sec => {
            const newId = typeof uid === 'function' ? uid() : ('r_' + Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 6));
            records.push({
                id: newId,
                voucher: voucher,
                date: sec.date || voucherDate,
                party: party,
                newParty: newParty,
                count: count,
                sector: sec.sector,
                transport: sec.transport || '',
                mode: sec.mode || (isEconomyBus(sec.transport, sec.sector) ? 'sharing' : 'vehicle'),
                fare: parseFloat(sec.fare) || 0,
                vehicleTotal: sec.total,
                total: sec.total,
                notes: notes,
                name: name,
                flightTime: sec.flightTime || '',
                flightNo: sec.flightNo || '',
                airport: sec.airport || '',
                transportNature: sec.transportNature || '',
                shirka: shirka,
                group: group,
                mobile: mobile,
                updatedAt: new Date().toISOString()
            });
        });

    } else {
        // New Entry: Save all sector rows as records under this master voucher
        entrySectorsList.forEach(sec => {
            const newId = typeof uid === 'function' ? uid() : ('r_' + Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 6));
            records.push({
                id: newId,
                voucher: voucher,
                date: sec.date || voucherDate,
                party: party,
                newParty: newParty,
                count: count,
                sector: sec.sector,
                transport: sec.transport || '',
                mode: sec.mode || (isEconomyBus(sec.transport, sec.sector) ? 'sharing' : 'vehicle'),
                fare: parseFloat(sec.fare) || 0,
                vehicleTotal: sec.total,
                total: sec.total,
                notes: notes,
                name: name,
                flightTime: sec.flightTime || '',
                flightNo: sec.flightNo || '',
                airport: sec.airport || '',
                transportNature: sec.transportNature || '',
                shirka: shirka,
                group: group,
                mobile: mobile,
                createdAt: new Date().toISOString()
            });
        });

    }

    const savedLocally = typeof svR === 'function' ? svR() : false;
    const saveButton = document.getElementById('btn-save');
    if (saveButton) saveButton.disabled = true;
    let syncedToSupabase = false;
    if (typeof flushPendingFbWrites === 'function') {
        try {
            syncedToSupabase = await flushPendingFbWrites();
        } catch (error) {
            console.error('Entry Supabase sync error:', error);
        }
    }
    if (saveButton) saveButton.disabled = false;
    if (typeof fillShirkaDatalist === 'function') fillShirkaDatalist();
    if (typeof fillAirportDatalist === 'function') fillAirportDatalist();
    if (typeof fillHajiPartyDatalist === 'function') fillHajiPartyDatalist();

    clearEntryForm();
    todayStats();
    if (typeof al === 'function') {
        const message = syncedToSupabase
            ? `واؤچر ${voucher} کے ${savedSectorCount} سیکٹرز Supabase میں محفوظ ہو گئے`
            : savedLocally
                ? `واؤچر ${voucher} اس ڈیوائس پر محفوظ ہے، مگر Supabase sync pending/failed ہے۔ دوبارہ انٹری نہ کریں؛ sync status چیک کریں۔`
                : `واؤچر ${voucher} کی local save بھی ناکام ہوئی اور Supabase sync مکمل نہیں ہوا۔ صفحہ بند نہ کریں؛ ریکارڈ محفوظ کرنے میں مدد لیں۔`;
        al('al-entry', message, syncedToSupabase ? 'ok' : 'er');
    }
}

function editRecord(id) {
    if (typeof canDo === 'function' && !canDo('edit')) {
        alert(T[lang]?.noEditPerm || 'آپ کو ریکارڈ میں تبدیلی کی اجازت نہیں ہے');
        return;
    }
    const r = (typeof records !== 'undefined' && Array.isArray(records)) ? records.find(x => x.id === id) : null;
    if (!r) return;

    const idEl = document.getElementById('e-id'); if (idEl) idEl.value = id;
    const dateEl = document.getElementById('e-date'); if (dateEl) dateEl.value = r.date || '';
    const vchEl = document.getElementById('e-voucher'); if (vchEl) vchEl.value = r.voucher || '—';
    const notesEl = document.getElementById('e-notes'); if (notesEl) notesEl.value = r.notes || '';

    const partyEl = document.getElementById('e-party'); if (partyEl) partyEl.value = r.party || '';
    const newPartyEl = document.getElementById('e-new-party'); if (newPartyEl) newPartyEl.value = r.newParty || '';
    if (typeof fillHajiPartyDropdown === 'function') fillHajiPartyDropdown();

    const countEl = document.getElementById('e-count'); if (countEl) countEl.value = r.count || 0;
    const nameEl = document.getElementById('e-name'); if (nameEl) nameEl.value = r.name || '';
    const shEl = document.getElementById('e-shirka'); if (shEl) shEl.value = r.shirka || '';
    const grEl = document.getElementById('e-group'); if (grEl) grEl.value = r.group || '';
    const mbEl = document.getElementById('e-mobile'); if (mbEl) mbEl.value = r.mobile || '';

    // Check if this voucher has multiple legs
    const voucherNorm = (r.voucher && r.voucher !== '—') ? r.voucher.trim().toLowerCase() : '';
    const matchingRecs = voucherNorm
        ? records.filter(x => x && (x.voucher || '').trim().toLowerCase() === voucherNorm)
        : [r];

    // Sort chronologically by date
    matchingRecs.sort((a, b) => (a.date || '').localeCompare(b.date || ''));

    entrySectorsList = matchingRecs.map(rec => ({
        id: rec.id || ('sec_' + Math.random().toString(36).slice(2, 9)),
        date: rec.date || r.date,
        sector: rec.sector || '',
        transport: rec.transport || '',
        transportNature: rec.transportNature || '',
        fare: rec.fare !== undefined ? rec.fare : 0,
        total: rec.total !== undefined ? rec.total : 0,
        flightNo: rec.flightNo || '',
        flightTime: rec.flightTime || '',
        airport: rec.airport || '',
        showFlight: !!(rec.flightNo || rec.flightTime || rec.airport)
    }));

    renderEntrySectorsTable();
    updateItinerarySummary();

    const L_entry = (typeof T !== 'undefined' && T[lang]) ? T[lang] : {};
    const btnSave = document.getElementById('btn-save');
    if (btnSave) {
        const text = L_entry.updateEntry || 'اپڈیٹ محفوظ کریں';
        const span = (typeof btnSave.querySelector === 'function') ? btnSave.querySelector('span') : null;
        if (span) span.textContent = text;
        else btnSave.textContent = text;
    }

    // Header badge → "اپ ڈیٹ"
    updateEntryModeBadge(true);

    // Switch to Entry Tab
    document.querySelectorAll('.page').forEach(x => x.classList.remove('active'));
    document.querySelectorAll('#main-nav button').forEach(x => x.classList.remove('active'));
    const pageEntry = document.getElementById('page-entry');
    if (pageEntry) pageEntry.classList.add('active');
    const firstNav = document.querySelectorAll('#main-nav button')[0];
    if (firstNav) firstNav.classList.add('active');

    const banner = document.getElementById('e-voucher-lookup-banner');
    if (banner) { banner.style.display = 'none'; banner.innerHTML = ''; }

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function lookupVoucherInEntry(vNo) {
    const banner = document.getElementById('e-voucher-lookup-banner');
    if (!banner) return;
    const cleanV = (vNo || '').trim();
    if (!cleanV || cleanV === '—' || !Array.isArray(records)) {
        banner.style.display = 'none';
        banner.innerHTML = '';
        return;
    }
    const norm = cleanV.toLowerCase();
    const matches = records.filter(x => x && (x.voucher || '').trim().toLowerCase() === norm);
    if (matches.length > 0) {
        banner.style.display = 'block';
        banner.innerHTML = `
            <div style="background:rgba(20,125,100,0.1);border:1px solid var(--accent,#147d64);color:var(--accent,#147d64);padding:8px 12px;border-radius:8px;font-size:12.5px;display:flex;justify-content:space-between;align-items:center;margin-top:6px;gap:8px;">
                <span>ℹ️ واؤچر <strong>${cleanV}</strong> کے <strong>${matches.length}</strong> سیکٹرز محفوظ شدہ ہیں۔</span>
                <button type="button" class="btn btn-sm btn-p" onclick="loadVoucherToEntry('${matches[0].id}')" style="padding:3px 10px;font-size:11.5px;white-space:nowrap;">تمام سیکٹرز فارم میں لوڈ کریں</button>
            </div>
        `;
    } else {
        banner.style.display = 'none';
        banner.innerHTML = '';
    }
}

function loadVoucherToEntry(recId) {
    if (typeof editRecord === 'function') {
        editRecord(recId);
    }
    const banner = document.getElementById('e-voucher-lookup-banner');
    if (banner) { banner.style.display = 'none'; banner.innerHTML = ''; }
}

function clearEntryForm() {
    const idEl = document.getElementById('e-id'); if (idEl) idEl.value = '';
    const notesEl = document.getElementById('e-notes'); if (notesEl) notesEl.value = '';
    const npEl = document.getElementById('e-new-party'); if (npEl) npEl.value = '';
    if (typeof fillHajiPartyDropdown === 'function') fillHajiPartyDropdown();
    const pEl = document.getElementById('e-party'); if (pEl) pEl.value = '';
    const cEl = document.getElementById('e-count'); if (cEl) cEl.value = '';

    const nameEl = document.getElementById('e-name'); if (nameEl) nameEl.value = '';
    const shEl = document.getElementById('e-shirka'); if (shEl) shEl.value = '';
    const grEl = document.getElementById('e-group'); if (grEl) grEl.value = '';
    const mbEl = document.getElementById('e-mobile'); if (mbEl) mbEl.value = '';

    const eDate = document.getElementById('e-date');
    if (eDate && typeof today === 'function') eDate.value = today();

    const banner = document.getElementById('e-voucher-lookup-banner');
    if (banner) { banner.style.display = 'none'; banner.innerHTML = ''; }

    const btnSave = document.getElementById('btn-save');
    const L_clear = (typeof T !== 'undefined' && T[lang]) ? T[lang] : {};
    if (btnSave) {
        const text = L_clear.saveEntry || (typeof lang !== 'undefined' && lang === 'en' ? 'Save Entry' : 'انٹری محفوظ کریں');
        const span = (typeof btnSave.querySelector === 'function') ? btnSave.querySelector('span') : null;
        if (span) span.textContent = text;
        else btnSave.textContent = text;
    }

    // Reset presets buttons state
    document.querySelectorAll('.preset-pill-btn').forEach(btn => btn.classList.remove('active'));

    // Header badge → "نئی انٹری"
    updateEntryModeBadge(false);

    setNextVoucher();

    // Reset sectors list to single clean row
    entrySectorsList = [createDefaultSectorRow()];
    renderEntrySectorsTable();
    updateItinerarySummary();

    if (typeof fillTransportNatureDropdown === 'function') fillTransportNatureDropdown();
}

function initEntryPage() {
    if (typeof fillDrop === 'function') {
        fillDrop('e-party', (typeof parties !== 'undefined' && parties && parties.length) ? parties : null, false);
        fillDrop('e-sector', (typeof sectors !== 'undefined' && sectors && sectors.length) ? sectors : null, false);
        fillDrop('e-transport', (typeof transports !== 'undefined' && transports && transports.length) ? transports : null, false);
    }
    if (typeof fillTransportNatureDropdown === 'function') fillTransportNatureDropdown();
    if (typeof fillHajiPartyDropdown === 'function') fillHajiPartyDropdown();
    if (typeof fillShirkaDatalist === 'function') fillShirkaDatalist();
    if (typeof fillAirportDatalist === 'function') fillAirportDatalist();
    if (typeof fillHajiPartyDatalist === 'function') fillHajiPartyDatalist();

    const eDate = document.getElementById('e-date');
    if (eDate && !eDate.value && typeof today === 'function') eDate.value = today();

    if (typeof setNextVoucher === 'function') setNextVoucher();

    if (!entrySectorsList || entrySectorsList.length === 0) {
        entrySectorsList = [createDefaultSectorRow()];
    }
    renderEntrySectorsTable();
    updateItinerarySummary();

    if (typeof todayStats === 'function') todayStats();
}

function todayStats() {
    if (typeof records === 'undefined' || !Array.isArray(records)) return;
    const currentDay = typeof today === 'function' ? today() : new Date().toISOString().split('T')[0];
    const td = records.filter(r => r.date === currentDay);

    const pCount = [...new Set(td.map(r => r.party))].length;
    const hCount = td.reduce((s, r) => s + (parseInt(r.count) || 0), 0);
    const aCount = td.reduce((s, r) => s + (parseFloat(r.total) || 0), 0);
    const tCount = td.length;

    const tsp = document.getElementById('ts-p'); if (tsp) tsp.textContent = pCount;
    const tsh = document.getElementById('ts-h'); if (tsh) tsh.textContent = hCount.toLocaleString();
    const tsa = document.getElementById('ts-a'); if (tsa) tsa.textContent = Math.round(aCount).toLocaleString();
    const tst = document.getElementById('ts-t'); if (tst) tst.textContent = tCount;
}

// Auto-run if DOM is ready
if (document.readyState !== 'loading') {
    if (document.getElementById('e-party')) initEntryPage();
} else {
    document.addEventListener('DOMContentLoaded', () => {
        if (document.getElementById('e-party')) initEntryPage();
    });
}

// ── 6. WINDOW EXPOSURES ──
window.toggleAppTheme = toggleAppTheme;
window.initAppTheme = initAppTheme;
window.updateEntryModeBadge = updateEntryModeBadge;
window.onTransportChange = onTransportChange;
window.onDateOrTransportChange = onDateOrTransportChange;
window.findMatchingVehicleRate = findMatchingVehicleRate;
window.isEconomyBus = typeof isEconomyBus !== 'undefined' ? isEconomyBus : null;
window.calcE = calcE;
window.setNextVoucher = setNextVoucher;
window.addEntry = addEntry;
window.editRecord = editRecord;
window.editRecordInEntry = editRecord;
window.editFullVoucher = editRecord;
window.lookupVoucherInEntry = lookupVoucherInEntry;
window.loadVoucherToEntry = loadVoucherToEntry;
window.clearEntryForm = clearEntryForm;
window.todayStats = todayStats;
window.initEntryPage = initEntryPage;

// Multi-sector exports
window.entrySectorsList = entrySectorsList;
window.applyItineraryPreset = applyItineraryPreset;
window.addEntrySectorRow = addEntrySectorRow;
window.removeEntrySectorRow = removeEntrySectorRow;
window.toggleSectorFlightDetails = toggleSectorFlightDetails;
window.updateSectorRowField = updateSectorRowField;
window.onSectorRowSectorChange = onSectorRowSectorChange;
window.onSectorRowTransportChange = onSectorRowTransportChange;
window.onSectorRowFareChange = onSectorRowFareChange;
window.recalcSectorRow = recalcSectorRow;
window.recalcAllEntrySectors = recalcAllEntrySectors;
window.renderEntrySectorsTable = renderEntrySectorsTable;
window.updateItinerarySummary = updateItinerarySummary;
