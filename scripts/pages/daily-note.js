// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  DAILY NOTE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function saveDailyNote() {
    const L = T[lang] || T.ur;
    const date = document.getElementById('dn-date').value;
    const ref = document.getElementById('dn-ref').value.trim() || genDNRef();
    const party = document.getElementById('dn-party').value;
    const name = document.getElementById('dn-name').value.trim();
    const group = document.getElementById('dn-group').value.trim();
    const mobile = document.getElementById('dn-mobile').value.trim();
    const airport = document.getElementById('dn-airport').value.trim();
    const count = parseInt(document.getElementById('dn-count').value) || 0;
    const flightNo = document.getElementById('dn-flight-no').value.trim();
    const flightTime = document.getElementById('dn-flight-time').value;
    const transport = document.getElementById('dn-transport-sel').value;
    const transportNature = document.getElementById('dn-transport-nature-sel').value;
    const shirka = document.getElementById('dn-shirka').value.trim();
    const arrHotel = '';

    if (!date || !party || count <= 0) { al('al-dn', L.dnRequired || 'Please fill required fields', 'er'); return; }
    const id = document.getElementById('dn-id').value;
    const noteData = { date, ref, party, name, group, mobile, airport, count, flightNo, flightTime, transport, transportNature, shirka, arrHotel };
    if (id) {
        const idx = dailyNotes.findIndex(n => n.id === id);
        if (idx !== -1) dailyNotes[idx] = { ...dailyNotes[idx], ...noteData };
    } else {
        dailyNotes.push({ id: uid(), ...noteData });
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
    document.getElementById('dn-party').value = '';
    document.getElementById('dn-name').value = '';
    document.getElementById('dn-group').value = '';
    document.getElementById('dn-mobile').value = '';
    document.getElementById('dn-airport').value = '';
    document.getElementById('dn-count').value = '';
    document.getElementById('dn-flight-no').value = '';
    document.getElementById('dn-flight-time').value = '';
    document.getElementById('dn-transport-sel').value = '';
    document.getElementById('dn-transport-nature-sel').value = '';
    document.getElementById('dn-shirka').value = '';
    document.getElementById('btn-dn-save').textContent = T[lang].dnSave;
    document.getElementById('lbl-dnTitle').textContent = T[lang].dnTitle;
    fillDailyNoteDropdowns();
}

function fillDailyNoteDropdowns() {
    // Transport: use global transports array (settings se)
    const selTrans = document.getElementById('dn-transport-sel');
    if(selTrans) {
        const cur = selTrans.value;
        selTrans.innerHTML = '<option value="">-- منتخب کریں --</option>' +
            (transports || []).map(n => `<option value="${n}"${n===cur?' selected':''}>${n}</option>`).join('');
    }

    // Transport Nature: predefined + saved entries
    const defaultNatures = ['Jed Arrival', 'MED Arrival', 'Makkah to Madina', 'Madina TO Makha', 'Jeddah Depture', 'Madina Depture'];
    const savedNatures = dailyNotes.map(n => n.transportNature || n.transportBy).filter(Boolean);
    const allNatures = [...new Set([...defaultNatures, ...savedNatures])];
    
    const sel = document.getElementById('dn-transport-nature-sel');
    if(sel) {
        const cur2 = sel.value;
        sel.innerHTML = '<option value="">-- منتخب کریں --</option>' +
            allNatures.map(n => `<option value="${n}"${n===cur2?' selected':''}>${n}</option>`).join('');
    }
}

function editDailyNote(id) {
    const note = dailyNotes.find(n => n.id === id);
    if (!note) return;
    const L = T[lang] || T.ur;
    document.getElementById('dn-id').value = id;
    document.getElementById('dn-date').value = note.date;
    document.getElementById('dn-ref').value = note.ref || '';
    document.getElementById('dn-party').value = note.party;
    document.getElementById('dn-name').value = note.name || '';
    document.getElementById('dn-group').value = note.group || '';
    document.getElementById('dn-mobile').value = note.mobile || '';
    document.getElementById('dn-airport').value = note.airport || note.sector || '';
    document.getElementById('dn-count').value = note.count;
    document.getElementById('dn-flight-no').value = note.flightNo || '';
    document.getElementById('dn-flight-time').value = note.flightTime || '';
    document.getElementById('dn-transport-sel').value = note.transport || '';
    document.getElementById('dn-transport-nature-sel').value = note.transportNature || note.transportBy || '';
    document.getElementById('dn-shirka').value = note.shirka || '';
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
    
    // Group by Transport Nature
    const grouped = {};
    notes.forEach(r => {
        const nature = r.transportNature || r.transportBy || 'Other';
        if (!grouped[nature]) grouped[nature] = [];
        grouped[nature].push(r);
    });

    let html = '';

    // Fixed order of known natures for consistent output
    const defaultNatures = ['Jed Arrival', 'MED Arrival', 'Makkah to Madina', 'Madina TO Makha', 'Jeddah Depture', 'Madina Depture'];
    const sortedKeys = Object.keys(grouped).sort((a, b) => {
        let idxA = defaultNatures.indexOf(a);
        let idxB = defaultNatures.indexOf(b);
        if(idxA === -1) idxA = 999;
        if(idxB === -1) idxB = 999;
        if(idxA !== idxB) return idxA - idxB;
        return a.localeCompare(b);
    });

    sortedKeys.forEach(nature => {
        const groupNotes = grouped[nature];
        let grandTotal = 0;
        
        const tbody = groupNotes.map(r => {
            grandTotal += (parseInt(r.count) || 0);
            return `<tr>
            <td style="font-weight:bold;font-family:monospace;">${r.ref || '—'}</td>
            <td><strong>${r.party || '—'}</strong></td>
            <td>${r.name || '—'}</td>
            <td style="font-family:monospace;">${fd(r.date) || '—'}</td>
            <td style="font-family:monospace;">${r.flightTime ? formatTime12(r.flightTime) : '—'}</td>
            <td style="font-family:monospace;">${r.flightNo || '—'}</td>
            <td><strong>${r.airport || r.sector || '—'}</strong></td>
            <td style="font-weight:bold;color:var(--green-dark);">${r.count || 0}</td>
            <td>${r.transport || '—'}</td>
            <td>${r.transportNature || r.transportBy || '—'}</td>
            <td>${r.shirka || '—'}</td>
            <td style="font-family:monospace;">${r.group || '—'}</td>
            <td style="font-family:monospace;">${r.mobile || '—'}</td>
            <td class="action-btns no-print">
                <button class="btn btn-sm btn-o no-print" onclick="editDailyNote('${r.id}')">${L.edit || 'Edit'}</button>
                <button class="btn btn-sm btn-d no-print" onclick="deleteDailyNote('${r.id}')">${L.del || 'Del'}</button>
            </td>
        </tr>`;
        }).join('');

        const totalRow = `<tr style="background:var(--cream);font-weight:bold;">
            <td colspan="7" style="text-align:right;">Total</td>
            <td style="color:var(--green-dark);">${grandTotal}</td>
            <td colspan="5"></td>
            <td class="no-print"></td>
        </tr>`;

        html += `
        <div class="dn-report-section" style="margin-bottom: 30px;">
            <div style="text-align:center;margin-bottom:15px;">
                <h2 style="font-family:'Noto Sans',sans-serif;font-weight:bold;font-size:20px;margin:0;text-transform:uppercase;">${nature}</h2>
            </div>
            <div class="tbl-wrap">
                <table class="arrival-report-table" style="text-align:center;">
                    <thead>
                        <tr>
                            <th style="min-width:100px;">Voucher Number</th>
                            <th>Party</th>
                            <th>NAME</th>
                            <th style="min-width:90px;">Arrival Date</th>
                            <th>Arrival Time</th>
                            <th>Flight No</th>
                            <th>Airport</th>
                            <th>T</th>
                            <th>Transport</th>
                            <th>TRANSPORT By</th>
                            <th>Shirka</th>
                            <th>Group No</th>
                            <th>CONTACT NUMBER</th>
                            <th class="no-print">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${tbody}
                        ${totalRow}
                    </tbody>
                </table>
            </div>
        </div>`;
    });

    out.innerHTML = html;
}

// سفر کی نوعیت کا لیبل
function tripTypeLabel(type) {
    const L = T[lang] || T.ur;
    if (type === 'arrival') return L.dnTripArrival;
    if (type === 'return') return L.dnTripReturn;
    if (type === 'other') return L.dnTripOther;
    return '—';
}

// نوعیت کا لیبل
function natureLabel(nature) {
    const L = T[lang] || T.ur;
    if (nature === 'arrival') return L.dnNatureArrival;
    if (nature === 'other_transport') return L.dnNatureOther;
    return '—';
}