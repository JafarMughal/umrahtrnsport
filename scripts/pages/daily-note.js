// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  DAILY NOTE REPORT — Data from main records[]
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function fillTransportNatureDropdown() {
    // Fill dropdown in main Entry form
    const defaultNatures = ['Jed Arrival', 'MED Arrival', 'Makkah to Madina', 'Madina TO Makha', 'Jeddah Depture', 'Madina Depture'];
    const savedNatures = records.map(n => n.transportNature).filter(Boolean);
    const allNatures = [...new Set([...defaultNatures, ...savedNatures])];

    const sel = document.getElementById('e-transport-nature-sel');
    if (sel) {
        const cur = sel.value;
        sel.innerHTML = '<option value="">-- منتخب کریں --</option>' +
            allNatures.map(n => `<option value="${n}"${n === cur ? ' selected' : ''}>${n}</option>`).join('');
    }

    const dnrSel = document.getElementById('dnr-nature');
    if (dnrSel) {
        const cur = dnrSel.value;
        dnrSel.innerHTML = '<option value="">-- All --</option>' +
            allNatures.map(n => `<option value="${n}"${n === cur ? ' selected' : ''}>${n}</option>`).join('');
    }
}

function clearDailyNoteReport() {
    document.getElementById('dnr-from').value = '';
    document.getElementById('dnr-to').value = '';
    const dnrSel = document.getElementById('dnr-nature');
    if (dnrSel) dnrSel.value = '';
    renderDailyNoteReport();
}

function renderDailyNoteReport() {
    const L = T[lang] || T.ur;
    const out = document.getElementById('dn-report-out');
    if (!out) return;
    const from = document.getElementById('dnr-from').value || '';
    const to = document.getElementById('dnr-to').value || '';
    const natureFilter = document.getElementById('dnr-nature') ? document.getElementById('dnr-nature').value : '';

    // Filter only records that have flight/transport nature data
    let recs = [...records]
        .filter(r => r.transportNature || r.flightNo || r.flightTime || r.airport || r.shirka)
        .sort((a, b) => a.date.localeCompare(b.date));

    if (from) recs = recs.filter(r => r.date >= from);
    if (to) recs = recs.filter(r => r.date <= to);
    if (natureFilter) recs = recs.filter(r => r.transportNature === natureFilter);

    if (!recs.length) {
        out.innerHTML = `<div class="empty"><div class="ico">📋</div>${L.dnNoData || 'کوئی ڈیٹا موجود نہیں'}</div>`;
        return;
    }

    // Group by Transport Nature
    const grouped = {};
    recs.forEach(r => {
        const nature = r.transportNature || 'Other';
        if (!grouped[nature]) grouped[nature] = [];
        grouped[nature].push(r);
    });

    // Fixed order of known natures
    const defaultNatures = ['Jed Arrival', 'MED Arrival', 'Makkah to Madina', 'Madina TO Makha', 'Jeddah Depture', 'Madina Depture'];
    const sortedKeys = Object.keys(grouped).sort((a, b) => {
        let idxA = defaultNatures.indexOf(a);
        let idxB = defaultNatures.indexOf(b);
        if (idxA === -1) idxA = 999;
        if (idxB === -1) idxB = 999;
        if (idxA !== idxB) return idxA - idxB;
        return a.localeCompare(b);
    });

    let html = '';

    sortedKeys.forEach(nature => {
        const groupRecs = grouped[nature];
        let grandTotal = 0;

        const isDeparture = nature.toLowerCase().includes('dep');
        const dateHeader = isDeparture ? 'Departure Date' : 'Arrival Date';
        const timeHeader = isDeparture ? 'Departure Time' : 'Arrival Time';

        const tbody = groupRecs.map(r => {
            grandTotal += (parseInt(r.count) || 0);
            return `<tr>
            <td style="font-weight:bold;font-family:monospace;">${r.voucher || '—'}</td>
            <td><strong>${r.party || '—'}</strong></td>
            <td><strong>${r.newParty || '—'}</strong></td>
            <td>${r.name || '—'}</td>
            <td style="font-family:monospace;">${fd(r.date) || '—'}</td>
            <td style="font-family:monospace;">${r.flightTime ? formatTime12(r.flightTime) : '—'}</td>
            <td style="font-family:monospace;">${r.flightNo || '—'}</td>
            <td><strong>${r.airport || r.sector || '—'}</strong></td>
            <td style="font-weight:bold;color:var(--green-dark);">${r.count || 0}</td>
            <td>${r.transport || '—'}</td>
            <td>${r.transportNature || '—'}</td>
            <td>${r.shirka || '—'}</td>
            <td style="font-family:monospace;">${r.group || '—'}</td>
            <td style="font-family:monospace;">${r.mobile || '—'}</td>
            <td>${r.notes || '—'}</td>
            <td class="action-btns no-print">
                <button class="btn btn-sm btn-o no-print" onclick="editRecord('${r.id}')">${L.edit || 'Edit'}</button>
                <button class="btn btn-sm btn-d no-print" onclick="deleteRecord('${r.id}')">${L.del || 'Del'}</button>
            </td>
        </tr>`;
        }).join('');

        const totalRow = `<tr style="background:var(--cream);font-weight:bold;">
            <td colspan="8" style="text-align:right;">Total</td>
            <td style="color:var(--green-dark);">${grandTotal}</td>
            <td colspan="6"></td>
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
                            <th>Transporter</th>
                            <th>Party Name</th>
                            <th>NAME</th>
                            <th style="min-width:90px;">${dateHeader}</th>
                            <th>${timeHeader}</th>
                            <th>Flight No</th>
                            <th>Airport</th>
                            <th>T</th>
                            <th>Transport</th>
                            <th>TRANSPORT By</th>
                            <th>Shirka</th>
                            <th>Group No</th>
                            <th>CONTACT NUMBER</th>
                            <th>Notes</th>
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
