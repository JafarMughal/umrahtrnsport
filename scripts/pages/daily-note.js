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

    const dnrCb = document.getElementById('dnr-nature-checkboxes');
    if (dnrCb) {
        const checkedBoxes = Array.from(dnrCb.querySelectorAll('input:checked')).map(cb => cb.value);
        dnrCb.innerHTML = allNatures.map(n => {
            const isChecked = checkedBoxes.includes(n);
            return `<label style="display:flex; align-items:center; gap:6px; font-size:13px; cursor:pointer; direction:ltr; padding:4px 0;">
                <input type="checkbox" value="${n}" class="dnr-cb-item" onchange="onDnrNatureCheckboxChange()" ${isChecked ? 'checked' : ''} style="width:16px !important; height:16px !important; margin:0; padding:0; cursor:pointer; box-shadow:none;" />
                <span>${n}</span>
            </label>`;
        }).join('');
        updateDnrNatureSelectionText();
    }

    // Also fill Transporter dropdown for Daily Note Report
    const allTransporters = [...new Set([...(parties || []), ...records.map(r => r.party).filter(Boolean)])].sort((a,b) => a.localeCompare(b));
    const dnrTransCb = document.getElementById('dnr-transporter-checkboxes');
    if (dnrTransCb) {
        const checkedTrans = Array.from(dnrTransCb.querySelectorAll('input:checked')).map(cb => cb.value);
        dnrTransCb.innerHTML = allTransporters.map(t => {
            const isChecked = checkedTrans.includes(t);
            return `<label style="display:flex; align-items:center; gap:6px; font-size:13px; cursor:pointer; direction:ltr; padding:4px 0;">
                <input type="checkbox" value="${t}" class="dnr-transporter-cb-item" onchange="onDnrTransporterCheckboxChange()" ${isChecked ? 'checked' : ''} style="width:16px !important; height:16px !important; margin:0; padding:0; cursor:pointer; box-shadow:none;" />
                <span>${t}</span>
            </label>`;
        }).join('');
        updateDnrTransporterSelectionText();
    }
}

function toggleDnrNatureMultiSelect(e) {
    if(e) e.stopPropagation();
    const dd = document.getElementById('dnr-nature-dropdown-container');
    if (dd) {
        dd.style.display = dd.style.display === 'none' ? 'block' : 'none';
    }
}

function updateDnrNatureSelectionText() {
    const dnrCb = document.getElementById('dnr-nature-checkboxes');
    const txtSpan = document.getElementById('dnr-nature-selected-text');
    if (!dnrCb || !txtSpan) return;

    const checkedBoxes = Array.from(dnrCb.querySelectorAll('input:checked')).map(cb => cb.value);
    if (checkedBoxes.length === 0) {
        txtSpan.textContent = '-- All --';
    } else if (checkedBoxes.length === 1) {
        txtSpan.textContent = checkedBoxes[0];
    } else {
        txtSpan.textContent = checkedBoxes.length + ' Selected';
    }
}

function onDnrNatureCheckboxChange() {
    updateDnrNatureSelectionText();
    renderDailyNoteReport();
}

function toggleDnrTransporterMultiSelect(e) {
    if(e) e.stopPropagation();
    const dd = document.getElementById('dnr-transporter-dropdown-container');
    if (dd) {
        dd.style.display = dd.style.display === 'none' ? 'block' : 'none';
    }
}

function updateDnrTransporterSelectionText() {
    const dnrCb = document.getElementById('dnr-transporter-checkboxes');
    const txtSpan = document.getElementById('dnr-transporter-selected-text');
    if (!dnrCb || !txtSpan) return;

    const checkedBoxes = Array.from(dnrCb.querySelectorAll('input:checked')).map(cb => cb.value);
    if (checkedBoxes.length === 0) {
        txtSpan.textContent = '-- All --';
    } else if (checkedBoxes.length === 1) {
        txtSpan.textContent = checkedBoxes[0];
    } else {
        txtSpan.textContent = checkedBoxes.length + ' Selected';
    }
}

function onDnrTransporterCheckboxChange() {
    updateDnrTransporterSelectionText();
    renderDailyNoteReport();
}

function clearDailyNoteReport() {
    document.getElementById('dnr-from').value = '';
    document.getElementById('dnr-to').value = '';
    document.querySelectorAll('.dnr-cb-item').forEach(cb => cb.checked = false);
    document.querySelectorAll('.dnr-transporter-cb-item').forEach(cb => cb.checked = false);
    updateDnrNatureSelectionText();
    updateDnrTransporterSelectionText();
    renderDailyNoteReport();
}

function renderDailyNoteReport() {
    const L = T[lang] || T.ur;
    const out = document.getElementById('dn-report-out');
    if (!out) return;
    const from = document.getElementById('dnr-from').value || '';
    const to = document.getElementById('dnr-to').value || '';
    const checkedBoxes = Array.from(document.querySelectorAll('.dnr-cb-item:checked')).map(cb => cb.value);
    const checkedTransporters = Array.from(document.querySelectorAll('.dnr-transporter-cb-item:checked')).map(cb => cb.value);

    // Filter only records that have flight/transport nature data
    let recs = [...records]
        .filter(r => r.transportNature || r.flightNo || r.flightTime || r.airport || r.shirka)
        .sort((a, b) => a.date.localeCompare(b.date));

    if (from) recs = recs.filter(r => r.date >= from);
    if (to) recs = recs.filter(r => r.date <= to);
    if (checkedBoxes.length > 0) recs = recs.filter(r => checkedBoxes.includes(r.transportNature));
    if (checkedTransporters.length > 0) recs = recs.filter(r => checkedTransporters.includes(r.party));

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
            return `<tr class="dn-data-row" data-hujjaj="${r.count || 0}">
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
                ${(typeof canDo === 'function' && canDo('edit')) ? `<button class="btn btn-sm btn-o no-print" onclick="editRecord('${r.id}')">${L.edit || 'Edit'}</button>` : ''}
                ${(typeof canDo === 'function' && canDo('delete')) ? `<button class="btn btn-sm btn-d no-print" onclick="deleteRecord('${r.id}')">${L.del || 'Del'}</button>` : ''}
                ${(!canDo('edit') && !canDo('delete')) ? '—' : ''}
            </td>
        </tr>`;
        }).join('');

        const totalRow = `<tr class="dn-total-row" style="background:var(--cream);font-weight:bold;">
            <td colspan="8" style="text-align:right;">Total</td>
            <td class="dn-total-hujjaj" style="color:var(--green-dark);">${grandTotal}</td>
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
                        <tr class="no-print" style="background: #f8f9fa; border-bottom: 1px solid #ddd;">
                            <td style="padding:2px;"><input type="text" onkeyup="filterDailyNoteTable(this)" class="dn-col-filter" placeholder="🔍" style="width:100%; box-sizing:border-box; padding:2px; font-size:11px; border:1px solid #ccc; border-radius:3px;"></td>
                            <td style="padding:2px;"><input type="text" onkeyup="filterDailyNoteTable(this)" class="dn-col-filter" placeholder="🔍" style="width:100%; box-sizing:border-box; padding:2px; font-size:11px; border:1px solid #ccc; border-radius:3px;"></td>
                            <td style="padding:2px;"><input type="text" onkeyup="filterDailyNoteTable(this)" class="dn-col-filter" placeholder="🔍" style="width:100%; box-sizing:border-box; padding:2px; font-size:11px; border:1px solid #ccc; border-radius:3px;"></td>
                            <td style="padding:2px;"><input type="text" onkeyup="filterDailyNoteTable(this)" class="dn-col-filter" placeholder="🔍" style="width:100%; box-sizing:border-box; padding:2px; font-size:11px; border:1px solid #ccc; border-radius:3px;"></td>
                            <td style="padding:2px;"><input type="text" onkeyup="filterDailyNoteTable(this)" class="dn-col-filter" placeholder="🔍" style="width:100%; box-sizing:border-box; padding:2px; font-size:11px; border:1px solid #ccc; border-radius:3px;"></td>
                            <td style="padding:2px;"><input type="text" onkeyup="filterDailyNoteTable(this)" class="dn-col-filter" placeholder="🔍" style="width:100%; box-sizing:border-box; padding:2px; font-size:11px; border:1px solid #ccc; border-radius:3px;"></td>
                            <td style="padding:2px;"><input type="text" onkeyup="filterDailyNoteTable(this)" class="dn-col-filter" placeholder="🔍" style="width:100%; box-sizing:border-box; padding:2px; font-size:11px; border:1px solid #ccc; border-radius:3px;"></td>
                            <td style="padding:2px;"><input type="text" onkeyup="filterDailyNoteTable(this)" class="dn-col-filter" placeholder="🔍" style="width:100%; box-sizing:border-box; padding:2px; font-size:11px; border:1px solid #ccc; border-radius:3px;"></td>
                            <td style="padding:2px;"><input type="text" onkeyup="filterDailyNoteTable(this)" class="dn-col-filter" placeholder="🔍" style="width:100%; box-sizing:border-box; padding:2px; font-size:11px; border:1px solid #ccc; border-radius:3px;"></td>
                            <td style="padding:2px;"><input type="text" onkeyup="filterDailyNoteTable(this)" class="dn-col-filter" placeholder="🔍" style="width:100%; box-sizing:border-box; padding:2px; font-size:11px; border:1px solid #ccc; border-radius:3px;"></td>
                            <td style="padding:2px;"><input type="text" onkeyup="filterDailyNoteTable(this)" class="dn-col-filter" placeholder="🔍" style="width:100%; box-sizing:border-box; padding:2px; font-size:11px; border:1px solid #ccc; border-radius:3px;"></td>
                            <td style="padding:2px;"><input type="text" onkeyup="filterDailyNoteTable(this)" class="dn-col-filter" placeholder="🔍" style="width:100%; box-sizing:border-box; padding:2px; font-size:11px; border:1px solid #ccc; border-radius:3px;"></td>
                            <td style="padding:2px;"><input type="text" onkeyup="filterDailyNoteTable(this)" class="dn-col-filter" placeholder="🔍" style="width:100%; box-sizing:border-box; padding:2px; font-size:11px; border:1px solid #ccc; border-radius:3px;"></td>
                            <td style="padding:2px;"><input type="text" onkeyup="filterDailyNoteTable(this)" class="dn-col-filter" placeholder="🔍" style="width:100%; box-sizing:border-box; padding:2px; font-size:11px; border:1px solid #ccc; border-radius:3px;"></td>
                            <td style="padding:2px;"><input type="text" onkeyup="filterDailyNoteTable(this)" class="dn-col-filter" placeholder="🔍" style="width:100%; box-sizing:border-box; padding:2px; font-size:11px; border:1px solid #ccc; border-radius:3px;"></td>
                            <td style="padding:2px;"></td>
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

function filterDailyNoteTable(inputElem) {
    const table = inputElem.closest('table');
    if (!table) return;
    const inputs = table.querySelectorAll('.dn-col-filter');
    const filters = Array.from(inputs).map(inp => inp.value.toLowerCase().trim());
    
    const rows = table.querySelectorAll('tbody tr.dn-data-row');
    let visibleCount = 0;
    
    rows.forEach(row => {
        let match = true;
        const cells = row.querySelectorAll('td');
        filters.forEach((filterText, index) => {
            if (filterText && cells[index]) {
                const cellText = (cells[index].innerText || cells[index].textContent).toLowerCase();
                if (!cellText.includes(filterText)) {
                    match = false;
                }
            }
        });
        
        if (match) {
            row.style.display = '';
            visibleCount += parseInt(row.getAttribute('data-hujjaj') || '0', 10);
        } else {
            row.style.display = 'none';
        }
    });
    
    const totalEl = table.querySelector('.dn-total-hujjaj');
    if (totalEl) totalEl.innerText = visibleCount;
}
