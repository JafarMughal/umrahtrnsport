// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  DAILY OPERATIONS REPORT — Nordic Slate-Teal Executive UI
//  Data from main records[] array · Light & Dark Mode Compatible
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function fillTransportNatureDropdown() {
    // Fill dropdown in main Entry form
    const defaultNatures = ['Jed Arrival', 'MED Arrival', 'Makkah to Madina', 'Madina TO Makha', 'Jeddah Depture', 'Madina Depture'];
    const savedNatures = (records || []).map(n => n.transportNature).filter(Boolean);
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
            return `<label class="cms-checkbox-label">
                <input type="checkbox" value="${n}" class="dnr-cb-item" onchange="onDnrNatureCheckboxChange()" ${isChecked ? 'checked' : ''} />
                <span>${n}</span>
            </label>`;
        }).join('');
        updateDnrNatureSelectionText();
    }

    // Also fill Transporter dropdown for Daily Note Report
    const allTransporters = [...new Set([...(parties || []), ...(records || []).map(r => r.party).filter(Boolean)])].sort((a, b) => a.localeCompare(b));
    const dnrTransCb = document.getElementById('dnr-transporter-checkboxes');
    if (dnrTransCb) {
        const checkedTrans = Array.from(dnrTransCb.querySelectorAll('input:checked')).map(cb => cb.value);
        dnrTransCb.innerHTML = allTransporters.map(t => {
            const isChecked = checkedTrans.includes(t);
            return `<label class="cms-checkbox-label">
                <input type="checkbox" value="${t}" class="dnr-transporter-cb-item" onchange="onDnrTransporterCheckboxChange()" ${isChecked ? 'checked' : ''} />
                <span>${t}</span>
            </label>`;
        }).join('');
        updateDnrTransporterSelectionText();
    }
}

function toggleDnrNatureMultiSelect(e) {
    if (e) e.stopPropagation();
    const dd = document.getElementById('dnr-nature-dropdown-container');
    const otherDd = document.getElementById('dnr-transporter-dropdown-container');
    if (otherDd) otherDd.style.display = 'none';
    if (dd) {
        dd.style.display = dd.style.display === 'none' ? 'block' : 'none';
    }
}

function toggleDnrTransporterMultiSelect(e) {
    if (e) e.stopPropagation();
    const dd = document.getElementById('dnr-transporter-dropdown-container');
    const otherDd = document.getElementById('dnr-nature-dropdown-container');
    if (otherDd) otherDd.style.display = 'none';
    if (dd) {
        dd.style.display = dd.style.display === 'none' ? 'block' : 'none';
    }
}

function selectAllDnrNature(select) {
    const dnrCb = document.getElementById('dnr-nature-checkboxes');
    if (!dnrCb) return;
    dnrCb.querySelectorAll('.dnr-cb-item').forEach(cb => { cb.checked = select; });
    updateDnrNatureSelectionText();
    renderDailyNoteReport();
}

function selectAllDnrTransporter(select) {
    const dnrTransCb = document.getElementById('dnr-transporter-checkboxes');
    if (!dnrTransCb) return;
    dnrTransCb.querySelectorAll('.dnr-transporter-cb-item').forEach(cb => { cb.checked = select; });
    updateDnrTransporterSelectionText();
    renderDailyNoteReport();
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
        txtSpan.textContent = `${checkedBoxes.length} Selected`;
    }
}

function onDnrNatureCheckboxChange() {
    updateDnrNatureSelectionText();
    renderDailyNoteReport();
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
        txtSpan.textContent = `${checkedBoxes.length} Selected`;
    }
}

function onDnrTransporterCheckboxChange() {
    updateDnrTransporterSelectionText();
    renderDailyNoteReport();
}

function clearDailyNoteReport() {
    const fromEl = document.getElementById('dnr-from');
    const toEl = document.getElementById('dnr-to');
    if (fromEl) fromEl.value = '';
    if (toEl) toEl.value = '';
    document.querySelectorAll('.dnr-cb-item').forEach(cb => { cb.checked = false; });
    document.querySelectorAll('.dnr-transporter-cb-item').forEach(cb => { cb.checked = false; });
    updateDnrNatureSelectionText();
    updateDnrTransporterSelectionText();
    renderDailyNoteReport();
}

function getNatureBadgeInfo(nature) {
    const lower = (nature || '').toLowerCase();
    if (lower.includes('arr') || lower.includes('arrival')) {
        return {
            cls: 'arrival',
            icon: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 22h20"/><path d="M19 14.5l-3.5-3.5-4 1.5-6-3.5-1 1 5 4.5-2 1-2.5-.5-1 1 3.5 2 7 2.5 4.5-5.5z"/></svg>`
        };
    }
    if (lower.includes('dep') || lower.includes('depture') || lower.includes('departure')) {
        return {
            cls: 'departure',
            icon: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 22h20"/><path d="M19 9.5l-3.5 3.5-4-1.5-6 3.5-1-1 5-4.5-2-1-2.5.5-1-1 3.5-2 7-2.5 4.5 5.5z"/></svg>`
        };
    }
    if (lower.includes('to') || lower.includes('makkah') || lower.includes('madina')) {
        return {
            cls: 'transfer',
            icon: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="14" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/></svg>`
        };
    }
    return {
        cls: 'other',
        icon: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`
    };
}

function renderDailyNoteReport() {
    const L = (typeof T !== 'undefined' && T[lang]) ? T[lang] : ((typeof T !== 'undefined' && T.ur) ? T.ur : {});
    const out = document.getElementById('dn-report-out');
    if (!out) return;

    const from = document.getElementById('dnr-from') ? document.getElementById('dnr-from').value : '';
    const to = document.getElementById('dnr-to') ? document.getElementById('dnr-to').value : '';
    const checkedBoxes = Array.from(document.querySelectorAll('.dnr-cb-item:checked')).map(cb => cb.value);
    const checkedTransporters = Array.from(document.querySelectorAll('.dnr-transporter-cb-item:checked')).map(cb => cb.value);

    // Update print range and date if present
    const printRange = document.getElementById('dn-print-range');
    if (printRange) {
        const rangeText = (from || to) ? `${from ? (typeof fd === 'function' ? fd(from) : from) : '...'} → ${to ? (typeof fd === 'function' ? fd(to) : to) : '...'}` : '';
        printRange.textContent = rangeText;
    }
    const printDate = document.getElementById('dn-print-date');
    if (printDate) {
        printDate.textContent = `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }

    // Filter only records that have flight/transport nature data
    let recs = [...(records || [])]
        .filter(r => r.transportNature || r.flightNo || r.flightTime || r.airport || r.shirka)
        .sort((a, b) => (a.date || '').localeCompare(b.date || ''));

    if (from) recs = recs.filter(r => r.date >= from);
    if (to) recs = recs.filter(r => r.date <= to);
    if (checkedBoxes.length > 0) recs = recs.filter(r => checkedBoxes.includes(r.transportNature));
    if (checkedTransporters.length > 0) recs = recs.filter(r => checkedTransporters.includes(r.party));

    if (!recs.length) {
        out.innerHTML = `
        <div class="dn-empty">
            <div class="dn-empty-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/>
                    <line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
            </div>
            <div class="dn-empty-text">${L.dnNoData || L.noData || 'کوئی ڈیٹا موجود نہیں'}</div>
        </div>`;
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
    let grandAllHujjaj = 0;
    const allUniqueTransporters = new Set();

    sortedKeys.forEach(nature => {
        const groupRecs = grouped[nature];
        let groupTotalHujjaj = 0;

        const isDeparture = nature.toLowerCase().includes('dep');
        const dateHeader = isDeparture ? (L.deptDateCol || 'Departure Date') : (L.arrDateCol || 'Arrival Date');
        const timeHeader = isDeparture ? (L.deptTimeCol || 'Departure Time') : (L.arrTimeCol || 'Arrival Time');
        const badgeInfo = getNatureBadgeInfo(nature);

        const tbody = groupRecs.map(r => {
            const hujjajCount = parseInt(r.count, 10) || 0;
            groupTotalHujjaj += hujjajCount;
            grandAllHujjaj += hujjajCount;
            if (r.party) allUniqueTransporters.add(r.party);

            const formattedDate = (typeof fd === 'function') ? fd(r.date) : (r.date || '—');
            const formattedTime = (r.flightTime && typeof formatTime12 === 'function') ? formatTime12(r.flightTime) : (r.flightTime || '—');

            return `<tr class="dn-data-row" data-hujjaj="${hujjajCount}">
                <td class="col-voucher"><code>${r.voucher || '—'}</code></td>
                <td><strong>${r.party || '—'}</strong></td>
                <td><strong>${r.newParty || '—'}</strong></td>
                <td>${r.name || '—'}</td>
                <td class="col-date">${formattedDate}</td>
                <td class="col-time">${formattedTime}</td>
                <td class="col-flight"><code>${r.flightNo || '—'}</code></td>
                <td><span class="dn-tag">${r.airport || r.sector || '—'}</span></td>
                <td class="col-hujjaj">${hujjajCount}</td>
                <td>${r.transport || '—'}</td>
                <td><span class="dn-nature-tag">${r.transportNature || '—'}</span></td>
                <td>${r.shirka || '—'}</td>
                <td class="col-group">${r.group || '—'}</td>
                <td class="col-mobile" dir="ltr">${r.mobile || '—'}</td>
                <td class="col-notes">${r.notes || '—'}</td>
                <td class="action-btns no-print">
                    ${(typeof canDo === 'function' && canDo('edit')) ? `<button class="btn btn-sm btn-o no-print" onclick="editRecord('${r.id}')">${L.edit || 'Edit'}</button>` : ''}
                    ${(typeof canDo === 'function' && canDo('delete')) ? `<button class="btn btn-sm btn-d no-print" onclick="deleteRecord('${r.id}')">${L.del || 'Del'}</button>` : ''}
                    ${(typeof canDo === 'function' && !canDo('edit') && !canDo('delete')) ? '—' : ''}
                </td>
            </tr>`;
        }).join('');

        const totalRow = `<tr class="dn-total-row">
            <td colspan="8" class="dn-total-label">${L.totalHujjaj || 'کل حاجی'}:</td>
            <td class="dn-total-hujjaj">${groupTotalHujjaj}</td>
            <td colspan="6"></td>
            <td class="no-print"></td>
        </tr>`;

        html += `
        <div class="dn-report-section">
            <div class="dn-group-header">
                <div class="dn-title-wrap">
                    <span class="dn-nature-badge ${badgeInfo.cls}">
                        ${badgeInfo.icon}
                        <span>${nature}</span>
                    </span>
                    <h3 class="dn-nature-title">${nature}</h3>
                </div>
                <div class="dn-group-stats">
                    <span class="dn-stat-pill">
                        <span>${L.totalRec || 'ریکارڈز'}:</span>
                        <strong>${groupRecs.length}</strong>
                    </span>
                    <span class="dn-stat-pill highlight">
                        <span>${L.totalHujjaj || 'کل حاجی'}:</span>
                        <strong>${groupTotalHujjaj}</strong>
                    </span>
                </div>
            </div>

            <div class="dn-tbl-wrap">
                <table class="arrival-report-table">
                    <thead>
                        <tr>
                            <th style="min-width:110px;">${L.voucherCol || L.dnRef || 'Voucher #'}</th>
                            <th>${L.partyCol || L.dnParty || 'Transporter'}</th>
                            <th>${L.dnNewParty || L.hajiParty || 'Party Name'}</th>
                            <th>${L.nameCol || 'NAME'}</th>
                            <th style="min-width:105px;">${dateHeader}</th>
                            <th style="min-width:95px;">${timeHeader}</th>
                            <th>${L.flightNoCol || L.dnFlightNo || 'Flight No'}</th>
                            <th>${L.airportCol || L.sectorCol || 'Airport'}</th>
                            <th style="min-width:70px;">${L.countCol || L.dnCount || 'T (Hujjaj)'}</th>
                            <th>${L.transportCol || L.dnTripType || 'Transport'}</th>
                            <th>${L.natureCol || L.dnNature || 'TRANSPORT By'}</th>
                            <th>${L.shirkaCol || 'Shirka'}</th>
                            <th>${L.groupCol || L.dnGroup || 'Group No'}</th>
                            <th style="min-width:110px;">${L.mobileCol || L.dnMobile || 'CONTACT NUMBER'}</th>
                            <th>${L.notes || 'Notes'}</th>
                            <th class="no-print">${L.actionCol || 'Actions'}</th>
                        </tr>
                        <tr class="dn-col-filter-row no-print">
                            <td><input type="text" onkeyup="filterDailyNoteTable(this)" class="dn-col-filter" placeholder="Search..." /></td>
                            <td><input type="text" onkeyup="filterDailyNoteTable(this)" class="dn-col-filter" placeholder="Search..." /></td>
                            <td><input type="text" onkeyup="filterDailyNoteTable(this)" class="dn-col-filter" placeholder="Search..." /></td>
                            <td><input type="text" onkeyup="filterDailyNoteTable(this)" class="dn-col-filter" placeholder="Search..." /></td>
                            <td><input type="text" onkeyup="filterDailyNoteTable(this)" class="dn-col-filter" placeholder="Search..." /></td>
                            <td><input type="text" onkeyup="filterDailyNoteTable(this)" class="dn-col-filter" placeholder="Search..." /></td>
                            <td><input type="text" onkeyup="filterDailyNoteTable(this)" class="dn-col-filter" placeholder="Search..." /></td>
                            <td><input type="text" onkeyup="filterDailyNoteTable(this)" class="dn-col-filter" placeholder="Search..." /></td>
                            <td><input type="text" onkeyup="filterDailyNoteTable(this)" class="dn-col-filter" placeholder="Search..." /></td>
                            <td><input type="text" onkeyup="filterDailyNoteTable(this)" class="dn-col-filter" placeholder="Search..." /></td>
                            <td><input type="text" onkeyup="filterDailyNoteTable(this)" class="dn-col-filter" placeholder="Search..." /></td>
                            <td><input type="text" onkeyup="filterDailyNoteTable(this)" class="dn-col-filter" placeholder="Search..." /></td>
                            <td><input type="text" onkeyup="filterDailyNoteTable(this)" class="dn-col-filter" placeholder="Search..." /></td>
                            <td><input type="text" onkeyup="filterDailyNoteTable(this)" class="dn-col-filter" placeholder="Search..." /></td>
                            <td><input type="text" onkeyup="filterDailyNoteTable(this)" class="dn-col-filter" placeholder="Search..." /></td>
                            <td></td>
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

    // Grand Operations Summary Card
    if (sortedKeys.length > 0) {
        html += `
        <div class="dn-grand-card">
            <div class="dn-grand-header">
                <div class="dn-grand-title">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                    </svg>
                    <span>${L.grandSummary || 'آپریشنز گرینڈ سمری (Operations Summary)'}</span>
                </div>
            </div>
            <div class="dn-grand-grid">
                <div class="dn-grand-item">
                    <span class="dn-grand-lbl">${L.totalHujjaj || 'کل حاجی (Total Hujjaj)'}</span>
                    <span class="dn-grand-val highlight">${grandAllHujjaj}</span>
                </div>
                <div class="dn-grand-item">
                    <span class="dn-grand-lbl">${L.todayTrips || 'کل آپریشنز (Total Operations)'}</span>
                    <span class="dn-grand-val">${recs.length}</span>
                </div>
                <div class="dn-grand-item">
                    <span class="dn-grand-lbl">${L.partyCol || 'ٹرانسپورٹرز (Transporters)'}</span>
                    <span class="dn-grand-val">${allUniqueTransporters.size}</span>
                </div>
                <div class="dn-grand-item">
                    <span class="dn-grand-lbl">${L.natureCol || 'سیکٹرز / نیچرز (Active Natures)'}</span>
                    <span class="dn-grand-val">${sortedKeys.length}</span>
                </div>
            </div>
        </div>`;
    }

    out.innerHTML = html;
}

// سفر کی نوعیت کا لیبل
function tripTypeLabel(type) {
    const L = (typeof T !== 'undefined' && T[lang]) ? T[lang] : ((typeof T !== 'undefined' && T.ur) ? T.ur : {});
    if (type === 'arrival') return L.dnTripArrival || 'Arrival';
    if (type === 'return') return L.dnTripReturn || 'Return';
    if (type === 'other') return L.dnTripOther || 'Other';
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

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  EXPORT DAILY NOTE TO EXCEL
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function exportDailyNoteExcel() {
    const L = (typeof T !== 'undefined' && T[lang]) ? T[lang] : ((typeof T !== 'undefined' && T.ur) ? T.ur : {});
    const from = document.getElementById('dnr-from') ? document.getElementById('dnr-from').value : '';
    const to = document.getElementById('dnr-to') ? document.getElementById('dnr-to').value : '';
    const checkedBoxes = Array.from(document.querySelectorAll('.dnr-cb-item:checked')).map(cb => cb.value);
    const checkedTransporters = Array.from(document.querySelectorAll('.dnr-transporter-cb-item:checked')).map(cb => cb.value);

    let recs = [...(records || [])]
        .filter(r => r.transportNature || r.flightNo || r.flightTime || r.airport || r.shirka)
        .sort((a, b) => (a.date || '').localeCompare(b.date || ''));

    if (from) recs = recs.filter(r => r.date >= from);
    if (to) recs = recs.filter(r => r.date <= to);
    if (checkedBoxes.length > 0) recs = recs.filter(r => checkedBoxes.includes(r.transportNature));
    if (checkedTransporters.length > 0) recs = recs.filter(r => checkedTransporters.includes(r.party));

    if (!recs.length) {
        if (typeof al === 'function') al('al-login', L.noData || 'کوئی ڈیٹا موجود نہیں', 'er');
        else alert(L.noData || 'کوئی ڈیٹا موجود نہیں');
        return;
    }

    if (typeof XLSX === 'undefined') {
        alert('Excel library not loaded.');
        return;
    }

    const headers = [
        'Voucher #', 'Transporter', 'Party Name', 'NAME', 'Date', 'Time',
        'Flight No', 'Airport', 'Hujjaj Count', 'Transport', 'TRANSPORT By',
        'Shirka', 'Group No', 'CONTACT NUMBER', 'Notes'
    ];

    const dataRows = recs.map(r => [
        r.voucher || '',
        r.party || '',
        r.newParty || '',
        r.name || '',
        r.date ? (typeof fd === 'function' ? fd(r.date) : r.date) : '',
        r.flightTime ? (typeof formatTime12 === 'function' ? formatTime12(r.flightTime) : r.flightTime) : '',
        r.flightNo || '',
        r.airport || r.sector || '',
        Number(r.count) || 0,
        r.transport || '',
        r.transportNature || '',
        r.shirka || '',
        r.group || '',
        r.mobile || '',
        r.notes || ''
    ]);

    const totalHujjaj = recs.reduce((sum, r) => sum + (Number(r.count) || 0), 0);
    const totalRow = ['Total', '', '', '', '', '', '', '', totalHujjaj, '', '', '', '', '', ''];

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([headers, ...dataRows, totalRow]);
    XLSX.utils.book_append_sheet(wb, ws, 'Daily Report');
    const fileName = `Daily_Operations_${from || 'start'}_to_${to || 'end'}.xlsx`;
    XLSX.writeFile(wb, fileName);
}
