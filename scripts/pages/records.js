// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  RECORDS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function renderRecHead() {
    const L = T[lang] || T.ur;
    document.getElementById('rec-head').innerHTML =
        `<th>${L.voucherCol}</th><th>${L.dateCol}</th><th>${L.codeCol}</th><th>${L.partyCol}</th><th>${L.sectorCol}</th><th>${L.transportCol}</th><th>${L.typeSharing}/${L.typeWhole}</th><th>${L.hujjajCol}</th><th>${L.fareCol}</th><th>${L.vehicleTotalCol || 'گاڑی رقم'}</th><th>${L.totalCol}</th><th>${L.actionCol}</th>`;
}

function renderRecords(rows) {
    const L = T[lang] || T.ur;
    const tbody = document.getElementById('rec-tbody');
    const tot = document.getElementById('rec-totals');
    if (!rows.length) { tbody.innerHTML = `<tr><td colspan="12"><div class="empty"><div class="ico">📂</div>${L.noRec}</div></td></tr>`; tot.style.display = 'none'; return; }
    const s = [...rows].sort((a, b) => b.date.localeCompare(a.date));
    tbody.innerHTML = s.map(r => {
        const sharing = r.mode === 'sharing' || isSharing(r.transport);
        const modeTag = sharing ? `<span style="background:#E8F5E9;color:#2E7D32;padding:2px 8px;border-radius:10px;font-size:10px;font-weight:600;">🚌 ${L.typeSharing}</span>`
            : `<span style="background:#FFF8E1;color:#E65100;padding:2px 8px;border-radius:10px;font-size:10px;font-weight:600;">🚐 ${L.typeWhole}</span>`;
        return `<tr><td><span style="font-family:monospace;font-weight:700;color:var(--green-dark);font-size:11px;">${r.voucher || '—'}</span></td>
      <td>${fd(r.date)}</td><td><span class="party-code">${getCode(r.party)}</span></td>
      <td><strong>${r.party}</strong></td><td><span class="badge">${r.sector}</span></td>
      <td>${r.transport || '—'}</td><td>${modeTag}</td>
      <td>${sharing ? `<strong>${r.count}</strong>` : '—'}</td>
      <td>${sharing ? sar(r.fare) : '—'}</td>
      <td>${!sharing ? `<strong style="color:#E65100;">${sar(r.vehicleTotal || r.total)}</strong>` : '—'}</td>
      <td><strong style="color:var(--green-dark);">${sar(r.total)}</strong></td>
      <td><button class="btn btn-sm btn-o" onclick="editRecord('${r.id}')">${L.edit}</button></td></tr>`;
    }).join('');
    document.getElementById('rt-c').textContent = rows.length;
    document.getElementById('rt-h').textContent = rows.filter(r => r.mode === 'sharing' || isSharing(r.transport)).reduce((s, r) => s + r.count, 0);
    document.getElementById('rt-a').textContent = sar(rows.reduce((s, r) => s + r.total, 0));
    tot.style.display = 'grid';
}

function filterRecords() {
    const from = document.getElementById('f-from').value, to = document.getElementById('f-to').value;
    const party = document.getElementById('f-party').value, sector = document.getElementById('f-sector').value;
    let rows = [...records];
    if (from) rows = rows.filter(r => r.date >= from);
    if (to) rows = rows.filter(r => r.date <= to);
    if (party) rows = rows.filter(r => r.party === party);
    if (sector) rows = rows.filter(r => r.sector === sector);
    renderRecords(rows);
}

function clearFilter() {
    ['f-from', 'f-to'].forEach(id => document.getElementById(id).value = '');
    ['f-party', 'f-sector'].forEach(id => document.getElementById(id).value = '');
    renderRecords(records);
}