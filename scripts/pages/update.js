// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  UPDATE / DELETE - FIXED
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function renderUpdHead() {
    const L = T[lang] || T.ur;
    document.getElementById('upd-head').innerHTML =
        `<th>${L.voucherCol}</th><th>${L.dateCol}</th><th>${L.codeCol}</th><th>${L.partyCol}</th><th>${L.sectorCol}</th><th>${L.hujjajCol}</th><th>${L.totalCol}</th><th>${L.actionCol}</th>`;
}

function renderUpdateTable() {
    const L = T[lang] || T.ur;
    const tbody = document.getElementById('upd-tbody');

    const searchVal = document.getElementById('upd-search').value.trim().toLowerCase();
    const fromVal = document.getElementById('upd-from').value;
    const toVal = document.getElementById('upd-to').value;

    let s = [...records];

    if (searchVal) {
        s = s.filter(r =>
            (r.party && r.party.toLowerCase().includes(searchVal)) ||
            (r.voucher && r.voucher.toLowerCase().includes(searchVal)) ||
            (r.sector && r.sector.toLowerCase().includes(searchVal))
        );
    }

    if (fromVal) s = s.filter(r => r.date >= fromVal);
    if (toVal) s = s.filter(r => r.date <= toVal);

    s.sort((a, b) => b.date.localeCompare(a.date));

    if (!s.length) { tbody.innerHTML = `<tr><td colspan="8"><div class="empty"><div class="ico">📂</div>${L.noRec}</div></td></tr>`; return; }
    tbody.innerHTML = s.map(r =>
        `<tr><td><span style="font-family:monospace;font-weight:700;color:var(--green-dark);font-size:11px;">${r.voucher || '—'}</span></td>
    <td>${fd(r.date)}</td><td><span class="party-code">${getCode(r.party)}</span></td>
    <td><strong>${r.party}</strong></td><td><span class="badge">${r.sector}</span></td>
    <td>${r.count}</td><td><strong>${sar(r.total)}</strong></td>
    <td class="action-btns"><button class="btn btn-sm btn-o" onclick="editRecord('${r.id}')">${L.edit}</button>
    <button class="btn btn-sm btn-d" onclick="deleteRecord('${r.id}')">${L.del}</button></td></tr>`
    ).join('');
}

function editRecord(id) {
    const r = records.find(x => x.id === id);
    if (!r) return;

    document.getElementById('u-id').value = id;
    document.getElementById('u-date').value = r.date;
    document.getElementById('u-voucher').value = r.voucher || '—';
    document.getElementById('u-notes').value = r.notes || '';

    sdSetValue('u-party', r.party);
    fillDrop('u-sector', sectors);
    document.getElementById('u-sector').value = r.sector;
    fillDrop('u-transport', transports);
    document.getElementById('u-transport').value = r.transport;

    document.getElementById('u-count').value = r.count || 0;
    document.getElementById('u-fare').value = r.fare || 0;

    const sharing = isSharing(r.transport);
    const countWrap = document.getElementById('u-count-wrap');
    const fareWrap = document.getElementById('u-fare-wrap');
    const vehicleWrap = document.getElementById('u-vehicle-wrap');
    const vehicleTotalInput = document.getElementById('u-vehicle-total');

    if (countWrap) countWrap.style.display = '';
    if (fareWrap) fareWrap.style.display = '';
    if (vehicleWrap) vehicleWrap.style.display = 'none';
    vehicleTotalInput.value = '';

    onTransportChange('u');
    document.getElementById('u-total').value = r.total;

    document.getElementById('upd-form').style.display = 'block';
    document.querySelectorAll('.page').forEach(x => x.classList.remove('active'));
    document.querySelectorAll('#main-nav button').forEach(x => x.classList.remove('active'));
    document.getElementById('page-update').classList.add('active');
    document.querySelectorAll('#main-nav button')[5].classList.add('active');
    renderUpdateTable();
    renderUpdHead();
    setTimeout(() => document.getElementById('upd-form').scrollIntoView({ behavior: 'smooth' }), 50);
}

function saveUpdate() {
    const L = T[lang] || T.ur;
    const id = document.getElementById('u-id').value;
    const idx = records.findIndex(x => x.id === id);
    if (idx === -1) return;
    const transport = document.getElementById('u-transport').value;
    let countInput = parseInt(document.getElementById('u-count').value);
    let count = isNaN(countInput) ? 0 : countInput;
    let calcCount = count < 1 ? 1 : count;
    let fare = parseFloat(document.getElementById('u-fare').value) || 0;
    let total = Math.round(calcCount * fare);
    let vehicleTotal = total;
    let mode = 'sharing';
    records[idx] = {
        ...records[idx], date: document.getElementById('u-date').value,
        voucher: document.getElementById('u-voucher').value, party: document.getElementById('u-party').value,
        sector: document.getElementById('u-sector').value, transport, mode, count, fare, vehicleTotal, total,
        notes: document.getElementById('u-notes').value.trim()
    };
    svR();
    al('al-upd', L.updOk, 'ok');
    document.getElementById('upd-form').style.display = 'none';
    renderUpdateTable();
}

function cancelUpdate() { document.getElementById('upd-form').style.display = 'none'; }

async function deleteRecord(id) {
    const L = T[lang] || T.ur;
    if (!(await verifyPassword(L.confirmDel))) return;
    records = records.filter(x => x.id !== id);
    svR();
    renderUpdateTable();
    al('al-upd', L.delOk, 'ok');
}