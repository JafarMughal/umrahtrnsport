// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  ENTRY — SHARING LOGIC
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function onTransportChange(prefix) {
    const val = document.getElementById(prefix + '-transport').value;
    const sharing = isSharing(val);
    const L = T[lang] || T.ur;
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
    
    // ہمیشہ حاجیوں کی تعداد اور کرایہ دکھائیں
    if (countWrap) countWrap.style.display = '';
    if (fareWrap) fareWrap.style.display = '';
    if (vehicleWrap) vehicleWrap.style.display = 'none';
    if (hint) hint.style.display = 'none';

    if (prefix === 'e') calcE(); else calcU();
}

function calcE() {
    const val = document.getElementById('e-transport').value;
    if (!val) { document.getElementById('e-total').value = ''; return; }
    let c = parseInt(document.getElementById('e-count').value);
    if (isNaN(c) || c < 1) c = 1;
    let f = parseFloat(document.getElementById('e-fare').value) || 0;
    document.getElementById('e-total').value = Math.round(c * f);
}

function calcU() {
    const val = document.getElementById('u-transport').value;
    if (!val) { document.getElementById('u-total').value = ''; return; }
    let c = parseInt(document.getElementById('u-count').value);
    if (isNaN(c) || c < 1) c = 1;
    let f = parseFloat(document.getElementById('u-fare').value) || 0;
    document.getElementById('u-total').value = Math.round(c * f);
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
    records.push({ id: uid(), voucher, date, party, newParty, sector, transport, mode, count, fare, vehicleTotal, total, notes });
    svR();
    al('al-entry', L.entrySaved, 'ok');
    clearEntryForm();
    todayStats();
}

function clearEntryForm() {
    document.getElementById('e-notes').value = '';
    document.getElementById('e-new-party').value = '';
    document.getElementById('e-party').value = '';
    document.getElementById('e-sector').value = '';
    document.getElementById('e-transport').value = '';
    document.getElementById('e-count').value = '';
    document.getElementById('e-fare').value = '';
    document.getElementById('e-total').value = '';
    document.getElementById('e-vehicle-total').value = '';
    document.getElementById('e-count-wrap').style.display = '';
    document.getElementById('e-fare-wrap').style.display = '';
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