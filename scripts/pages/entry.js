// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  ENTRY — SHARING LOGIC
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function onTransportChange(prefix) {
    const val = document.getElementById(prefix + '-transport').value;
    const sharing = isSharing(val);
    const L = T[lang] || T.ur;
    const countInp = document.getElementById(prefix + '-count');
    const fareInp = document.getElementById(prefix + '-fare');
    const vehicleWrap = document.getElementById(prefix + '-vehicle-wrap');
    const hint = document.getElementById(prefix + '-transport-hint');
    countInp.disabled = false;
    fareInp.disabled = false;
    if (!val) {
        document.getElementById(prefix + '-total').value = '';
        if (vehicleWrap) vehicleWrap.style.display = 'none';
        if (hint) hint.style.display = 'none';
        return;
    }
    if (sharing) {
        if (vehicleWrap) vehicleWrap.style.display = 'none';
        document.getElementById(prefix + '-vehicle-total').value = '';
        if (hint) {
            hint.style.display = 'block';
            hint.style.background = '#E8F5E9';
            hint.style.color = '#2E7D32';
            hint.style.border = '1px solid #A5D6A7';
            hint.textContent = '🚌 ' + L.typeSharing + ' — ' + L.sharingNote.replace('⚠️ ', '');
        }
    } else {
        if (!countInp.value) countInp.value = '1';
        if (vehicleWrap) vehicleWrap.style.display = 'block';
        if (hint) {
            hint.style.display = 'block';
            hint.style.background = '#FFF8E1';
            hint.style.color = '#E65100';
            hint.style.border = '1px solid #FFCC80';
            hint.textContent = '🚐 ' + L.typeWhole + ' — ' + L.wholeNote.replace('⚠️ ', '');
        }
    }
    if (prefix === 'e') calcE(); else calcU();
}

function calcE() {
    const val = document.getElementById('e-transport').value;
    if (!val) { document.getElementById('e-total').value = ''; return; }
    const c = +document.getElementById('e-count').value || 0;
    const f = +document.getElementById('e-fare').value || 0;
    if (isSharing(val)) {
        document.getElementById('e-total').value = (c * f).toFixed(2);
    } else {
        const vt = +document.getElementById('e-vehicle-total').value || 0;
        if (f > 0) {
            const cnt = c || 1; document.getElementById('e-total').value = (cnt * f).toFixed(2);
            document.getElementById('e-vehicle-total').value = (cnt * f).toFixed(2);
        }
        else if (vt > 0) { document.getElementById('e-total').value = vt.toFixed(2); }
        else { document.getElementById('e-total').value = ''; }
    }
}

function calcU() {
    const val = document.getElementById('u-transport').value;
    if (!val) { document.getElementById('u-total').value = ''; return; }
    const c = +document.getElementById('u-count').value || 0;
    const f = +document.getElementById('u-fare').value || 0;
    if (isSharing(val)) {
        document.getElementById('u-total').value = (c * f).toFixed(2);
    } else {
        const vt = +document.getElementById('u-vehicle-total').value || 0;
        if (f > 0) {
            const cnt = c || 1; document.getElementById('u-total').value = (cnt * f).toFixed(2);
            document.getElementById('u-vehicle-total').value = (cnt * f).toFixed(2);
        }
        else if (vt > 0) { document.getElementById('u-total').value = vt.toFixed(2); }
        else { document.getElementById('u-total').value = ''; }
    }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  ENTRY
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function setNextVoucher() { document.getElementById('e-voucher').value = genVoucher(); }

function addEntry() {
    const L = T[lang] || T.ur;
    const date = document.getElementById('e-date').value;
    const party = document.getElementById('e-party').value;
    const sector = document.getElementById('e-sector').value;
    const transport = document.getElementById('e-transport').value;
    const notes = document.getElementById('e-notes').value.trim();
    const voucher = document.getElementById('e-voucher').value || genVoucher();
    if (!date || !party || !sector || !transport) { al('al-entry', L.entryRequired, 'er'); return; }
    let count = 0, fare = 0, total = 0, vehicleTotal = 0, mode = 'sharing';
    if (isSharing(transport)) {
        count = parseInt(document.getElementById('e-count').value) || 0;
        fare = parseFloat(document.getElementById('e-fare').value) || 0;
        if (count < 1) { al('al-entry', L.sharingNote, 'er'); return; }
        total = count * fare;
        mode = 'sharing';
    } else {
        count = parseInt(document.getElementById('e-count').value) || 0;
        fare = parseFloat(document.getElementById('e-fare').value) || 0;
        vehicleTotal = parseFloat(document.getElementById('e-vehicle-total').value) || 0;
        if (fare > 0) { count = count || 1; total = count * fare; vehicleTotal = total; }
        else { if (vehicleTotal <= 0) { al('al-entry', L.wholeNote, 'er'); return; } total = vehicleTotal; count = 1; fare = vehicleTotal; }
        mode = 'whole';
    }
    records.push({ id: uid(), voucher, date, party, sector, transport, mode, count, fare, vehicleTotal, total, notes });
    svR();
    al('al-entry', L.entrySaved, 'ok');
    clearEntryForm();
    todayStats();
}

function clearEntryForm() {
    document.getElementById('e-notes').value = '';
    sdClear('e-party');
    document.getElementById('e-sector').value = '';
    document.getElementById('e-transport').value = '';
    document.getElementById('e-count').value = '';
    document.getElementById('e-fare').value = '';
    document.getElementById('e-total').value = '';
    document.getElementById('e-vehicle-total').value = '';
    document.getElementById('e-vehicle-wrap').style.display = 'none';
    document.getElementById('e-transport-hint').style.display = 'none';
    document.getElementById('e-date').value = today();
    setNextVoucher();
}

function todayStats() {
    const td = records.filter(r => r.date === today());
    document.getElementById('ts-p').textContent = [...new Set(td.map(r => r.party))].length;
    document.getElementById('ts-h').textContent = td.reduce((s, r) => s + r.count, 0);
    document.getElementById('ts-a').textContent = td.reduce((s, r) => s + r.total, 0).toLocaleString();
    document.getElementById('ts-t').textContent = td.length;
}