// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  UMRAH TRANSPORT MANAGEMENT SYSTEM (TMS) — ENTRY & THEME ENGINE
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

// ── 3. TRANSPORT CHANGE & SHARING LOGIC ──
function isEconomyBus(transport, sector) {
    const str = ((transport || '') + ' ' + (sector || '')).trim();
    return /economy.*bus|bus.*economy|شیئرنگ|sharing|مشترك|بس|bus/i.test(str);
}

function onTransportChange(prefix) {
    calcE();
}

function calcE() {
    const transportEl = document.getElementById('e-transport');
    const sectorEl = document.getElementById('e-sector');
    const transportVal = transportEl ? transportEl.value : '';
    const sectorVal = sectorEl ? sectorEl.value : '';

    const totalEl = document.getElementById('e-total');
    const fareEl = document.getElementById('e-fare');
    const countEl = document.getElementById('e-count');
    const lblFare = document.getElementById('lbl-fare');

    const L = (typeof T !== 'undefined' && T[lang]) ? T[lang] : (typeof T !== 'undefined' && T.ur ? T.ur : {});
    const isEn = typeof lang !== 'undefined' && lang === 'en';
    const isAr = typeof lang !== 'undefined' && lang === 'ar';

    // Check if Economy By Bus or Sharing mode
    const isPerPilgrim = typeof isEconomyBus === 'function' 
        ? isEconomyBus(transportVal, sectorVal) 
        : /economy.*bus|bus.*economy|شیئرنگ|sharing|مشترك|بس|bus/i.test((transportVal + ' ' + sectorVal).trim());

    // Update Label dynamically for clarity
    if (lblFare) {
        if (isPerPilgrim) {
            lblFare.textContent = L.farePerPilgrim || (isEn ? 'Fare per Pilgrim (SAR)' : isAr ? 'الأجرة لكل حاج (ريال)' : 'فی حاجی کرایہ (SAR)');
        } else {
            lblFare.textContent = L.fareVehicle || (isEn ? 'Vehicle Fare (SAR)' : isAr ? 'أجرة المركبة (ريال)' : 'گاڑی کا کرایہ (SAR)');
        }
    }

    let c = countEl ? parseInt(countEl.value) : 1;
    if (isNaN(c) || c < 1) c = 1;

    let f = fareEl ? (parseFloat(fareEl.value) || 0) : 0;

    if (!fareEl || fareEl.value === '') {
        if (totalEl) totalEl.value = '';
        return;
    }

    // Only Economy By Bus multiplies fare by pilgrims count (c * f)
    // All other vehicles (Car, GMC, Van, etc.) use fixed vehicle fare (f)
    if (totalEl) {
        totalEl.value = isPerPilgrim ? Math.round(c * f) : Math.round(f);
    }
}

// ── 4. VOUCHER & ENTRY FUNCTIONS ──
function setNextVoucher() {
    const vEl = document.getElementById('e-voucher');
    if (vEl && typeof genVoucher === 'function') {
        vEl.value = genVoucher();
    }
}

function addEntry() {
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
    const date = document.getElementById('e-date')?.value || '';
    const party = document.getElementById('e-party')?.value || '';
    const newParty = document.getElementById('e-new-party')?.value?.trim() || '';
    const sector = document.getElementById('e-sector')?.value || '';
    const transport = document.getElementById('e-transport')?.value || '';
    const notes = document.getElementById('e-notes')?.value?.trim() || '';
    const voucher = document.getElementById('e-voucher')?.value || (typeof genVoucher === 'function' ? genVoucher() : '');

    if (!date || !party || !sector || !transport) {
        if (typeof al === 'function') al('al-entry', L.entryRequired || 'تمام ضروری فیلڈز پر کریں', 'er');
        return;
    }

    let countInput = parseInt(document.getElementById('e-count')?.value);
    let count = isNaN(countInput) ? 0 : countInput;
    let calcCount = count < 1 ? 1 : count;
    let fare = parseFloat(document.getElementById('e-fare')?.value) || 0;

    // Check if Economy By Bus / Sharing
    const isPerPilgrim = typeof isEconomyBus === 'function' 
        ? isEconomyBus(transport, sector) 
        : /economy.*bus|bus.*economy|شیئرنگ|sharing|مشترك|بس|bus/i.test((transport + ' ' + sector).trim());

    let total = isPerPilgrim ? Math.round(calcCount * fare) : Math.round(fare);
    let mode = isPerPilgrim ? 'sharing' : 'vehicle';
    let vehicleTotal = total;

    const name = document.getElementById('e-name')?.value?.trim() || '';
    const flightTime = document.getElementById('e-flight-time')?.value || '';
    const flightNo = document.getElementById('e-flight-no')?.value?.trim() || '';
    const airport = document.getElementById('e-airport')?.value?.trim() || '';
    const transportNature = document.getElementById('e-transport-nature-sel')?.value || '';
    const shirka = document.getElementById('e-shirka')?.value?.trim() || '';
    const group = document.getElementById('e-group')?.value?.trim() || '';
    const mobile = document.getElementById('e-mobile')?.value?.trim() || '';

    if (editId) {
        const idx = records.findIndex(r => r.id === editId);
        if (idx !== -1) {
            records[idx] = { ...records[idx], voucher, date, party, newParty, sector, transport, mode, count, fare, vehicleTotal, total, notes, name, flightTime, flightNo, airport, transportNature, shirka, group, mobile };
        }
        if (typeof al === 'function') al('al-entry', L.updOk || 'Record updated successfully', 'ok');
    } else {
        const newId = typeof uid === 'function' ? uid() : Date.now().toString(36);
        records.push({ id: newId, voucher, date, party, newParty, sector, transport, mode, count, fare, vehicleTotal, total, notes, name, flightTime, flightNo, airport, transportNature, shirka, group, mobile });
        if (typeof al === 'function') al('al-entry', L.entrySaved || 'انٹری کامیابی کے ساتھ محفوظ ہو گئی', 'ok');
    }

    if (typeof svR === 'function') svR();
    clearEntryForm();
    todayStats();
}

function editRecord(id) {
    if (typeof openEditRecordModal === 'function') {
        openEditRecordModal(id);
        return;
    }
    if (typeof canDo === 'function' && !canDo('edit')) {
        alert(T[lang]?.noEditPerm || 'آپ کو ریکارڈ میں تبدیلی کی اجازت نہیں ہے');
        return;
    }
    const r = (typeof records !== 'undefined') ? records.find(x => x.id === id) : null;
    if (!r) return;

    const idEl = document.getElementById('e-id'); if (idEl) idEl.value = id;
    const dateEl = document.getElementById('e-date'); if (dateEl) dateEl.value = r.date;
    const vchEl = document.getElementById('e-voucher'); if (vchEl) vchEl.value = r.voucher || '—';
    const notesEl = document.getElementById('e-notes'); if (notesEl) notesEl.value = r.notes || '';

    const partyEl = document.getElementById('e-party'); if (partyEl) partyEl.value = r.party;
    const newPartyEl = document.getElementById('e-new-party'); if (newPartyEl) newPartyEl.value = r.newParty || '';
    if (typeof fillHajiPartyDropdown === 'function') fillHajiPartyDropdown();
    const sectorEl = document.getElementById('e-sector'); if (sectorEl) sectorEl.value = r.sector;
    const trEl = document.getElementById('e-transport'); if (trEl) trEl.value = r.transport;

    const countEl = document.getElementById('e-count'); if (countEl) countEl.value = r.count || 0;
    const fareEl = document.getElementById('e-fare'); if (fareEl) fareEl.value = r.fare || 0;

    const nameEl = document.getElementById('e-name'); if (nameEl) nameEl.value = r.name || '';
    const ftEl = document.getElementById('e-flight-time'); if (ftEl) ftEl.value = r.flightTime || '';
    const fnEl = document.getElementById('e-flight-no'); if (fnEl) fnEl.value = r.flightNo || '';
    const apEl = document.getElementById('e-airport'); if (apEl) apEl.value = r.airport || '';
    const tnEl = document.getElementById('e-transport-nature-sel'); if (tnEl) tnEl.value = r.transportNature || '';
    const shEl = document.getElementById('e-shirka'); if (shEl) shEl.value = r.shirka || '';
    const grEl = document.getElementById('e-group'); if (grEl) grEl.value = r.group || '';
    const mbEl = document.getElementById('e-mobile'); if (mbEl) mbEl.value = r.mobile || '';

    // Show flight details if any exist
    const hasFlightData = r.name || r.flightTime || r.flightNo || r.airport || r.transportNature || r.shirka || r.group || r.mobile;
    const flightDetailsDiv = document.getElementById('e-flight-details');
    const flightDetailsCheckbox = document.getElementById('e-show-flight');
    if (flightDetailsDiv && flightDetailsCheckbox) {
        flightDetailsCheckbox.checked = !!hasFlightData;
        flightDetailsDiv.style.display = hasFlightData ? 'grid' : 'none';
    }

    onTransportChange('e');
    const totalEl = document.getElementById('e-total');
    if (totalEl) totalEl.value = r.total;

    const L_entry = (typeof T !== 'undefined' && T[lang]) ? T[lang] : {};
    const btnSave = document.getElementById('btn-save');
    if (btnSave) {
        const text = L_entry.updateEntry || 'اپڈیٹ محفوظ کریں';
        const span = btnSave.querySelector('span');
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

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function clearEntryForm() {
    const idEl = document.getElementById('e-id'); if (idEl) idEl.value = '';
    const notesEl = document.getElementById('e-notes'); if (notesEl) notesEl.value = '';
    const npEl = document.getElementById('e-new-party'); if (npEl) npEl.value = '';
    if (typeof fillHajiPartyDropdown === 'function') fillHajiPartyDropdown();
    const pEl = document.getElementById('e-party'); if (pEl) pEl.value = '';
    const sEl = document.getElementById('e-sector'); if (sEl) sEl.value = '';
    const trEl = document.getElementById('e-transport'); if (trEl) trEl.value = '';
    const cEl = document.getElementById('e-count'); if (cEl) cEl.value = '';
    const fEl = document.getElementById('e-fare'); if (fEl) fEl.value = '';
    const totEl = document.getElementById('e-total'); if (totEl) totEl.value = '';
    const vehTotEl = document.getElementById('e-vehicle-total'); if (vehTotEl) vehTotEl.value = '';

    const nameEl = document.getElementById('e-name'); if (nameEl) nameEl.value = '';
    const ftEl = document.getElementById('e-flight-time'); if (ftEl) ftEl.value = '';
    const fnEl = document.getElementById('e-flight-no'); if (fnEl) fnEl.value = '';
    const apEl = document.getElementById('e-airport'); if (apEl) apEl.value = '';
    const tnEl = document.getElementById('e-transport-nature-sel'); if (tnEl) tnEl.value = '';
    const shEl = document.getElementById('e-shirka'); if (shEl) shEl.value = '';
    const grEl = document.getElementById('e-group'); if (grEl) grEl.value = '';
    const mbEl = document.getElementById('e-mobile'); if (mbEl) mbEl.value = '';

    const flightDetailsDiv = document.getElementById('e-flight-details');
    const flightDetailsCheckbox = document.getElementById('e-show-flight');
    if (flightDetailsDiv && flightDetailsCheckbox) {
        flightDetailsCheckbox.checked = false;
        flightDetailsDiv.style.display = 'none';
    }

    const countWrap = document.getElementById('e-count-wrap'); if (countWrap) countWrap.style.display = '';
    const fareWrap = document.getElementById('e-fare-wrap'); if (fareWrap) fareWrap.style.display = '';
    const vehicleWrap = document.getElementById('e-vehicle-wrap'); if (vehicleWrap) vehicleWrap.style.display = 'none';
    const hint = document.getElementById('e-transport-hint'); if (hint) hint.style.display = 'none';

    const eDate = document.getElementById('e-date');
    if (eDate && typeof today === 'function') eDate.value = today();

    const btnSave = document.getElementById('btn-save');
    const L_clear = (typeof T !== 'undefined' && T[lang]) ? T[lang] : {};
    if (btnSave) {
        const text = L_clear.saveEntry || (typeof lang !== 'undefined' && lang === 'en' ? 'Save Entry' : 'انٹری محفوظ کریں');
        const span = btnSave.querySelector('span');
        if (span) span.textContent = text;
        else btnSave.textContent = text;
    }

    // Header badge → "نئی انٹری"
    updateEntryModeBadge(false);

    // Reset Fare label
    const lblFare = document.getElementById('lbl-fare');
    if (lblFare) {
        const L_clear = (typeof T !== 'undefined' && T[lang]) ? T[lang] : {};
        lblFare.textContent = L_clear.fare || 'فی حاجی کرایہ (SAR)';
    }

    setNextVoucher();
    if (typeof fillTransportNatureDropdown === 'function') fillTransportNatureDropdown();
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

// ── 5. WINDOW EXPOSURES ──
window.toggleAppTheme = toggleAppTheme;
window.initAppTheme = initAppTheme;
window.updateEntryModeBadge = updateEntryModeBadge;
window.onTransportChange = onTransportChange;
window.isEconomyBus = typeof isEconomyBus !== 'undefined' ? isEconomyBus : null;
window.calcE = calcE;
window.setNextVoucher = setNextVoucher;
window.addEntry = addEntry;
window.editRecord = editRecord;
window.clearEntryForm = clearEntryForm;
window.todayStats = todayStats;