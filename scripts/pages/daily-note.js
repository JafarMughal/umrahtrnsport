// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  DAILY NOTE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function saveDailyNote() {
    const L = T[lang] || T.ur;
    const date = document.getElementById('dn-date').value;
    const ref = document.getElementById('dn-ref').value.trim() || genDNRef();
    const party = document.getElementById('dn-party').value;
    const group = document.getElementById('dn-group').value.trim();
    const mobile = document.getElementById('dn-mobile').value.trim();
    const sector = document.getElementById('dn-sector').value;
    const count = parseInt(document.getElementById('dn-count').value) || 0;
    const flightNo = document.getElementById('dn-flight-no').value.trim();
    const flightTime = document.getElementById('dn-flight-time').value;
    const tripType = document.getElementById('dn-trip-type').value;
    const flightName = document.getElementById('dn-flight-name').value.trim();
    if (!date || !party || !sector || count <= 0) { al('al-dn', L.dnRequired, 'er'); return; }
    const id = document.getElementById('dn-id').value;
    if (id) {
        const idx = dailyNotes.findIndex(n => n.id === id);
        if (idx !== -1) dailyNotes[idx] = { ...dailyNotes[idx], date, ref, party, group, mobile, sector, count, flightNo, flightTime, tripType, flightName };
    } else {
        dailyNotes.push({ id: uid(), date, ref, party, group, mobile, sector, count, flightNo, flightTime, tripType, flightName });
    }
    svDN();
    al('al-dn', L.dnSaved, 'ok');
    clearDailyNoteForm();
    renderDailyNoteReport();
}

function clearDailyNoteForm() {
    document.getElementById('dn-id').value = '';
    document.getElementById('dn-date').value = today();
    document.getElementById('dn-ref').value = genDNRef();
    sdClear('dn-party');
    document.getElementById('dn-group').value = '';
    document.getElementById('dn-mobile').value = '';
    document.getElementById('dn-sector').value = '';
    document.getElementById('dn-count').value = '';
    document.getElementById('dn-flight-no').value = '';
    document.getElementById('dn-flight-time').value = '';
    document.getElementById('dn-trip-type').value = '';
    document.getElementById('dn-flight-name').value = '';
    document.getElementById('btn-dn-save').textContent = T[lang].dnSave;
    document.getElementById('lbl-dnTitle').textContent = T[lang].dnTitle;
}

function editDailyNote(id) {
    const note = dailyNotes.find(n => n.id === id);
    if (!note) return;
    const L = T[lang] || T.ur;
    document.getElementById('dn-id').value = id;
    document.getElementById('dn-date').value = note.date;
    document.getElementById('dn-ref').value = note.ref || '';
    sdSetValue('dn-party', note.party);
    document.getElementById('dn-group').value = note.group || '';
    document.getElementById('dn-mobile').value = note.mobile || '';
    fillDrop('dn-sector', sectors);
    document.getElementById('dn-sector').value = note.sector;
    document.getElementById('dn-count').value = note.count;
    document.getElementById('dn-flight-no').value = note.flightNo || '';
    document.getElementById('dn-flight-time').value = note.flightTime || '';
    document.getElementById('dn-trip-type').value = note.tripType || '';
    document.getElementById('dn-flight-name').value = note.flightName || '';
    document.getElementById('btn-dn-save').textContent = L.dnEditTitle;
    document.getElementById('lbl-dnTitle').textContent = L.dnEditTitle;
    document.getElementById('page-dailynote').scrollIntoView({ behavior: 'smooth' });
    document.querySelectorAll('.page').forEach(x => x.classList.remove('active'));
    document.querySelectorAll('#main-nav button').forEach(x => x.classList.remove('active'));
    document.getElementById('page-dailynote').classList.add('active');
    document.getElementById('nav-dailynote').classList.add('active');
}

async function deleteDailyNote(id) {
    const L = T[lang] || T.ur;
    if (!(await verifyPassword(L.dnDelConfirm))) return;
    dailyNotes = dailyNotes.filter(n => n.id !== id);
    svDN();
    renderDailyNoteReport();
    al('al-dn', L.dnDelOk, 'ok');
}

function clearDailyNoteReport() {
    document.getElementById('dnr-from').value = '';
    document.getElementById('dnr-to').value = '';
    renderDailyNoteReport();
}

function renderDailyNoteReport() {
    const L = T[lang] || T.ur;
    const out = document.getElementById('dn-report-out');
    if (!out) return;
    const from = document.getElementById('dnr-from').value || '';
    const to = document.getElementById('dnr-to').value || '';
    let notes = [...dailyNotes].sort((a, b) => b.date.localeCompare(a.date));
    if (from) notes = notes.filter(n => n.date >= from);
    if (to) notes = notes.filter(n => n.date <= to);
    if (!notes.length) { out.innerHTML = `<div class="empty"><div class="ico">📋</div>${L.dnNoData}</div>`; return; }
    const allSectorTotals = {};
    notes.forEach(n => { const s = n.sector; allSectorTotals[s] = (allSectorTotals[s] || 0) + (parseInt(n.count) || 0); });
    const grandTotal = Object.values(allSectorTotals).reduce((a, b) => a + b, 0);
    const summaryCards = Object.entries(allSectorTotals).map(([s, c]) =>
        `<div class="dn-rep-sector"><span class="dn-rep-sector-name">${s}</span><span class="dn-rep-sector-count">${c}</span></div>`
    ).join('');
    const summary = `<div class="dn-rep-card"><div class="dn-rep-header"><span class="dn-rep-date">📊 ${L.dnRepTitle}</span>
    <span class="dn-rep-ref">${L.dnTotalLbl} ${grandTotal}</span></div>
    <div class="dn-rep-body"><div class="dn-rep-sectors">${summaryCards}</div></div></div>`;
    const tbody = notes.map(r =>
        `<tr><td><span style="font-family:monospace;font-weight:700;color:var(--green-dark);font-size:11px;">${r.ref || '—'}</span></td>
    <td>${fd(r.date)}</td><td><span class="party-code">${getCode(r.party)}</span></td>
    <td><strong>${r.party}</strong></td><td>${r.group || '—'}</td>
    <td style="direction:ltr;text-align:right;font-family:monospace;">${r.mobile || '—'}</td>
    <td><span class="badge">${r.sector}</span></td><td><strong>${r.count}</strong></td>
    <td>${tripTypeLabel(r.tripType)}</td>
    <td style="font-family:monospace;">${r.flightNo || '—'}<br><small style="color:var(--muted);">${r.flightTime ? formatTime12(r.flightTime) : ''}</small></td>
    <td>${r.flightName || '—'}</td>
    <td class="action-btns"><button class="btn btn-sm btn-o no-print" onclick="editDailyNote('${r.id}')">${L.edit}</button>
    <button class="btn btn-sm btn-d no-print" onclick="deleteDailyNote('${r.id}')">${L.del}</button></td></tr>`
    ).join('');
    out.innerHTML = summary + `<div class="tbl-wrap"><table><thead><tr>
    <th>${L.voucherCol}</th><th>${L.dateCol}</th><th>${L.codeCol}</th><th>${L.partyCol}</th>
    <th>${L.dnGroup}</th><th>${L.dnMobile}</th><th>${L.sectorCol}</th><th>${L.hujjajCol}</th>
    <th>${L.dnTripType}</th><th>${L.dnFlightNo}</th><th>${L.dnFlightName}</th><th>${L.actionCol}</th></tr></thead><tbody>${tbody}</tbody></table></div>`;
}

// سفر کی نوعیت کا لیبل
function tripTypeLabel(type) {
    const L = T[lang] || T.ur;
    if (type === 'arrival') return L.dnTripArrival;
    if (type === 'return') return L.dnTripReturn;
    if (type === 'other') return L.dnTripOther;
    return '—';
}