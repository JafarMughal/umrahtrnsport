// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  ENTRY — SHARING LOGIC
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function onTransportChange(prefix) {
    const val = document.getElementById(prefix + '-transport').value;
    const sharing = isSharing(val);
    const countWrap = document.getElementById(prefix + '-count-wrap');
    const fareWrap = document.getElementById(prefix + '-fare-wrap');
    const vehicleWrap = document.getElementById(prefix + '-vehicle-wrap');
    const hint = document.getElementById(prefix + '-transport-hint');

    if (!val) {
        document.getElementById(prefix + '-total').value = '';
        if (countWrap) countWrap.style.display = '';
        if (fareWrap) fareWrap.style.display = '';
        if (vehicleWrap) vehicleWrap.style.display = 'none';
        if (hint) hint.style.display = 'none';
        return;
    }
    
    if (countWrap) countWrap.style.display = '';
    if (fareWrap) fareWrap.style.display = '';
    if (vehicleWrap) vehicleWrap.style.display = 'none';
    if (hint) hint.style.display = 'none';

    calcE();
}

function calcE() {
    const val = document.getElementById('e-transport').value;
    if (!val) { document.getElementById('e-total').value = ''; return; }
    let c = parseInt(document.getElementById('e-count').value);
    if (isNaN(c) || c < 1) c = 1;
    let f = parseFloat(document.getElementById('e-fare').value) || 0;
    document.getElementById('e-total').value = Math.round(c * f);
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  ENTRY
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function setNextVoucher() { document.getElementById('e-voucher').value = genVoucher(); }

function addEntry() {
    const L = T[lang] || T.ur;
    const date = document.getElementById('e-date').value;
    const party = document.getElementById('e-party').value;
    const newParty = document.getElementById('e-new-party').value.trim();
    const sector = document.getElementById('e-sector').value;
    const transport = document.getElementById('e-transport').value;
    const notes = document.getElementById('e-notes').value.trim();
    const voucher = document.getElementById('e-voucher').value || genVoucher();
    if (!date || !party || !sector || !transport) { al('al-entry', L.entryRequired, 'er'); return; }
    
    let countInput = parseInt(document.getElementById('e-count').value);
    let count = isNaN(countInput) ? 0 : countInput;
    let calcCount = count < 1 ? 1 : count;
    let fare = parseFloat(document.getElementById('e-fare').value) || 0;
    let total = Math.round(calcCount * fare);
    let mode = 'sharing';
    let vehicleTotal = total;

    const name = document.getElementById('e-name').value.trim();
    const flightTime = document.getElementById('e-flight-time').value;
    const flightNo = document.getElementById('e-flight-no').value.trim();
    const airport = document.getElementById('e-airport').value.trim();
    const transportNature = document.getElementById('e-transport-nature-sel').value;
    const shirka = document.getElementById('e-shirka').value.trim();
    const group = document.getElementById('e-group').value.trim();
    const mobile = document.getElementById('e-mobile').value.trim();

    const editId = document.getElementById('e-id').value;

    if (editId) {
        const idx = records.findIndex(r => r.id === editId);
        if (idx !== -1) {
            records[idx] = { ...records[idx], voucher, date, party, newParty, sector, transport, mode, count, fare, vehicleTotal, total, notes, name, flightTime, flightNo, airport, transportNature, shirka, group, mobile };
        }
        al('al-entry', L.updOk || 'Record updated successfully', 'ok');
    } else {
        records.push({ id: uid(), voucher, date, party, newParty, sector, transport, mode, count, fare, vehicleTotal, total, notes, name, flightTime, flightNo, airport, transportNature, shirka, group, mobile });
        al('al-entry', L.entrySaved, 'ok');
    }

    svR();
    clearEntryForm();
    todayStats();
}

function editRecord(id) {
    const r = records.find(x => x.id === id);
    if (!r) return;

    document.getElementById('e-id').value = id;
    document.getElementById('e-date').value = r.date;
    document.getElementById('e-voucher').value = r.voucher || '—';
    document.getElementById('e-notes').value = r.notes || '';
    
    document.getElementById('e-party').value = r.party;
    document.getElementById('e-new-party').value = r.newParty || '';
    if (typeof fillHajiPartyDropdown === 'function') fillHajiPartyDropdown();
    document.getElementById('e-sector').value = r.sector;
    document.getElementById('e-transport').value = r.transport;

    document.getElementById('e-count').value = r.count || 0;
    document.getElementById('e-fare').value = r.fare || 0;
    
    document.getElementById('e-name').value = r.name || '';
    document.getElementById('e-flight-time').value = r.flightTime || '';
    document.getElementById('e-flight-no').value = r.flightNo || '';
    document.getElementById('e-airport').value = r.airport || '';
    document.getElementById('e-transport-nature-sel').value = r.transportNature || '';
    document.getElementById('e-shirka').value = r.shirka || '';
    document.getElementById('e-group').value = r.group || '';
    document.getElementById('e-mobile').value = r.mobile || '';

    // Show flight details if any are present
    const hasFlightData = r.name || r.flightTime || r.flightNo || r.airport || r.transportNature || r.shirka || r.group || r.mobile;
    const flightDetailsDiv = document.getElementById('e-flight-details');
    const flightDetailsCheckbox = document.getElementById('e-show-flight');
    if (flightDetailsDiv && flightDetailsCheckbox) {
        flightDetailsCheckbox.checked = !!hasFlightData;
        flightDetailsDiv.style.display = hasFlightData ? 'grid' : 'none';
    }

    onTransportChange('e');
    document.getElementById('e-total').value = r.total;

    document.getElementById('btn-save').innerHTML = '💾 اپڈیٹ محفوظ کریں';

    // Navigate to Entry page
    document.querySelectorAll('.page').forEach(x => x.classList.remove('active'));
    document.querySelectorAll('#main-nav button').forEach(x => x.classList.remove('active'));
    document.getElementById('page-entry').classList.add('active');
    document.querySelectorAll('#main-nav button')[0].classList.add('active'); 
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function clearEntryForm() {
    document.getElementById('e-id').value = '';
    document.getElementById('e-notes').value = '';
    document.getElementById('e-new-party').value = '';
    if (typeof fillHajiPartyDropdown === 'function') fillHajiPartyDropdown();
    document.getElementById('e-party').value = '';
    document.getElementById('e-sector').value = '';
    document.getElementById('e-transport').value = '';
    document.getElementById('e-count').value = '';
    document.getElementById('e-fare').value = '';
    document.getElementById('e-total').value = '';
    document.getElementById('e-vehicle-total').value = '';
    
    document.getElementById('e-name').value = '';
    document.getElementById('e-flight-time').value = '';
    document.getElementById('e-flight-no').value = '';
    document.getElementById('e-airport').value = '';
    document.getElementById('e-transport-nature-sel').value = '';
    document.getElementById('e-shirka').value = '';
    document.getElementById('e-group').value = '';
    document.getElementById('e-mobile').value = '';

    const flightDetailsDiv = document.getElementById('e-flight-details');
    const flightDetailsCheckbox = document.getElementById('e-show-flight');
    if (flightDetailsDiv && flightDetailsCheckbox) {
        flightDetailsCheckbox.checked = false;
        flightDetailsDiv.style.display = 'none';
    }

    document.getElementById('e-count-wrap').style.display = '';
    document.getElementById('e-fare-wrap').style.display = '';
    document.getElementById('e-vehicle-wrap').style.display = 'none';
    document.getElementById('e-transport-hint').style.display = 'none';
    document.getElementById('e-date').value = today();
    document.getElementById('btn-save').innerHTML = '✅ انٹری محفوظ کریں';
    setNextVoucher();
    if (typeof fillTransportNatureDropdown === 'function') fillTransportNatureDropdown();
}

function todayStats() {
    const td = records.filter(r => r.date === today());
    document.getElementById('ts-p').textContent = [...new Set(td.map(r => r.party))].length;
    document.getElementById('ts-h').textContent = td.reduce((s, r) => s + r.count, 0);
    document.getElementById('ts-a').textContent = td.reduce((s, r) => s + r.total, 0).toLocaleString();
    document.getElementById('ts-t').textContent = td.length;
}