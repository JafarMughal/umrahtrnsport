// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  RECORDS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
let currentRecordsTab = 'pending';

function switchRecordsTab(tab) {
    currentRecordsTab = tab;
    filterRecords();
}

function toggleRecordCheck(id) {
    const r = records.find(x => x.id === id);
    if (r) {
        r.checked = !r.checked;
        svR();
        filterRecords();
    }
}

function renderRecHead() {
    // No-op: the records header is now built inside renderRecords along with the full HTML table.
}

function renderRecords(rows) {
    const L = T[lang] || T.ur;
    const out = document.getElementById('rec-output');
    
    const filteredRows = currentRecordsTab === 'checked' ? rows.filter(r => r.checked) : rows.filter(r => !r.checked);
    
    let tabsHtml = `
    <div style="display: flex; background: #f1f3f5; border-radius: 8px; padding: 4px; margin-bottom: 15px; width: 100%; max-width: 500px; margin-left: auto; margin-right: auto;" class="no-print">
        <div onclick="switchRecordsTab('pending')" style="flex: 1; text-align: center; padding: 8px 0; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: bold; transition: 0.3s; ${currentRecordsTab === 'pending' ? 'background: #fff; box-shadow: 0 2px 5px rgba(0,0,0,0.1); color: #1976d2;' : 'color: #6c757d;'}">
            🕒 Pending (پینڈنگ)
        </div>
        <div onclick="switchRecordsTab('checked')" style="flex: 1; text-align: center; padding: 8px 0; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: bold; transition: 0.3s; ${currentRecordsTab === 'checked' ? 'background: #fff; box-shadow: 0 2px 5px rgba(0,0,0,0.1); color: #2e7d32;' : 'color: #6c757d;'}">
            ✔ Checked (چیک شدہ)
        </div>
    </div>
    `;

    if (!filteredRows.length && !rows.length) { 
        out.innerHTML = tabsHtml + `<div class="empty"><div class="ico">📂</div>${L.noRec}</div>`; 
        return; 
    }
    
    const s = [...filteredRows].sort((a, b) => b.date.localeCompare(a.date));
    
    let tCount = 0; // total hujjaj
    let tAmount = 0; // total amount
    
    const tblRows = s.map(r => {
        const sharing = r.mode === 'sharing' || isSharing(r.transport);
        if (sharing) tCount += r.count;
        tAmount += r.total;
        
        const modeTag = sharing ? `<span style="background:#E8F5E9;color:#2E7D32;padding:2px 8px;border-radius:10px;font-size:10px;font-weight:600;">🚌 ${L.typeSharing}</span>`
            : `<span style="background:#FFF8E1;color:#E65100;padding:2px 8px;border-radius:10px;font-size:10px;font-weight:600;">🚐 ${L.typeWhole}</span>`;
            
        return `
            <tr class="rec-data-row" data-hujjaj="${sharing ? r.count : 0}" data-amount="${r.total}">
                <td style="padding:4px; text-align:center;" class="no-print">
                    <input type="checkbox" onchange="toggleRecordCheck('${r.id}')" ${r.checked ? 'checked' : ''} style="transform: scale(1.4); cursor: pointer; accent-color: #2E7D32;">
                </td>
                <td style="padding:4px;"><span style="font-family:monospace;font-weight:700;color:var(--green-dark);font-size:11px;">${r.voucher || '—'}</span></td>
                <td style="padding:4px;">${fd(r.date)}</td>
                <td style="padding:4px;"><span class="party-code">${getCode(r.party)}</span></td>
                <td style="padding:4px;"><strong>${r.party}</strong></td>
                <td style="padding:4px;"><span class="badge">${r.sector}</span></td>
                <td style="padding:4px;">${r.transport || '—'}</td>
                <td style="padding:4px;">${modeTag}</td>
                <td style="padding:4px;text-align:center;">${sharing ? `<strong>${r.count}</strong>` : '—'}</td>
                <td style="padding:4px;text-align:right;">${sharing ? sar(r.fare) : '—'}</td>
                <td style="padding:4px;text-align:right;">${!sharing ? `<strong style="color:#E65100;">${sar(r.vehicleTotal || r.total)}</strong>` : '—'}</td>
                <td style="padding:4px;text-align:right;"><strong style="color:var(--green-dark);">${sar(r.total)}</strong></td>
                <td style="padding:4px;" class="no-print">
                    <button class="btn btn-sm btn-o" onclick="editRecord('${r.id}')">${L.edit}</button>
                    <button class="btn btn-sm btn-d" onclick="deleteRecord('${r.id}')">${L.del}</button>
                </td>
            </tr>
        `;
    }).join('');

    const titleBg = currentRecordsTab === 'pending' ? '#e3f2fd' : '#e8f5e9';
    const titleBorder = currentRecordsTab === 'pending' ? '#90caf9' : '#a5d6a7';
    const titleColor = currentRecordsTab === 'pending' ? '#1565c0' : '#1b5e20';
    const titleText = currentRecordsTab === 'pending' ? '⏳ Pending Records (باقی ماندہ)' : '✅ Checked Records (مکمل شدہ)';

    const html = `
    <div style="font-family: sans-serif; color: #000; background: #fff; padding: 10px; border: 1px solid #ccc; margin-bottom: 20px; border-radius: 8px;">
        ${tabsHtml}
        <div style="background-color: ${titleBg}; border: 1px solid ${titleBorder}; border-radius: 6px; text-align: center; padding: 10px; font-weight: bold; font-size: 16px; margin-bottom: 15px; color: ${titleColor};">
            ${titleText}
        </div>
        
        <table style="width: 100%; border: none; font-size: 12px; margin-bottom: 15px;">
            <tr>
                <td style="font-weight: bold; width: 120px;">Total Records:</td>
                <td id="top-total-records">${s.length}</td>
                <td style="font-weight: bold; text-align: right; width: 100px;">Total Amount:</td>
                <td id="top-total-amount" style="text-align: right; font-weight: bold; width: 100px;">${sar(tAmount)}</td>
            </tr>
            <tr>
                <td style="font-weight: bold;">Total Hujjaj:</td>
                <td id="top-total-hujjaj" colspan="3">${tCount}</td>
            </tr>
            <tr>
                <td style="font-weight: bold;">Print Date:</td>
                <td colspan="3">${fd(today())}</td>
            </tr>
        </table>

        <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
            <thead>
                <tr style="border-top: 1px solid #000; border-bottom: 1px solid #000;">
                    <th style="text-align: center; padding: 4px; width: 30px;" class="no-print">✔</th>
                    <th style="text-align: left; padding: 4px;">${L.voucherCol}</th>
                    <th style="text-align: left; padding: 4px;">${L.dateCol}</th>
                    <th style="text-align: left; padding: 4px;">${L.codeCol}</th>
                    <th style="text-align: left; padding: 4px;">${L.partyCol}</th>
                    <th style="text-align: left; padding: 4px;">${L.sectorCol}</th>
                    <th style="text-align: left; padding: 4px;">${L.transportCol}</th>
                    <th style="text-align: left; padding: 4px;">${L.typeSharing}/${L.typeWhole}</th>
                    <th style="text-align: center; padding: 4px;">${L.hujjajCol}</th>
                    <th style="text-align: right; padding: 4px;">${L.fareCol}</th>
                    <th style="text-align: right; padding: 4px;">${L.vehicleTotalCol || 'گاڑی رقم'}</th>
                    <th style="text-align: right; padding: 4px;">${L.totalCol}</th>
                    <th style="text-align: left; padding: 4px;" class="no-print">${L.actionCol}</th>
                </tr>
                <tr class="no-print" style="background: #f8f9fa; border-bottom: 1px solid #ddd;">
                    <td style="padding: 2px;"><input type="hidden" class="col-filter"></td>
                    <td style="padding: 2px;"><input type="text" onkeyup="filterTableColumns()" class="col-filter" data-col="0" placeholder="🔍" style="width:100%; box-sizing:border-box; padding:2px; font-size:11px; border:1px solid #ccc; border-radius:3px;"></td>
                    <td style="padding: 2px;"><input type="text" onkeyup="filterTableColumns()" class="col-filter" data-col="1" placeholder="🔍" style="width:100%; box-sizing:border-box; padding:2px; font-size:11px; border:1px solid #ccc; border-radius:3px;"></td>
                    <td style="padding: 2px;"><input type="text" onkeyup="filterTableColumns()" class="col-filter" data-col="2" placeholder="🔍" style="width:100%; box-sizing:border-box; padding:2px; font-size:11px; border:1px solid #ccc; border-radius:3px;"></td>
                    <td style="padding: 2px;"><input type="text" onkeyup="filterTableColumns()" class="col-filter" data-col="3" placeholder="🔍" style="width:100%; box-sizing:border-box; padding:2px; font-size:11px; border:1px solid #ccc; border-radius:3px;"></td>
                    <td style="padding: 2px;"><input type="text" onkeyup="filterTableColumns()" class="col-filter" data-col="4" placeholder="🔍" style="width:100%; box-sizing:border-box; padding:2px; font-size:11px; border:1px solid #ccc; border-radius:3px;"></td>
                    <td style="padding: 2px;"><input type="text" onkeyup="filterTableColumns()" class="col-filter" data-col="5" placeholder="🔍" style="width:100%; box-sizing:border-box; padding:2px; font-size:11px; border:1px solid #ccc; border-radius:3px;"></td>
                    <td style="padding: 2px;"><input type="text" onkeyup="filterTableColumns()" class="col-filter" data-col="6" placeholder="🔍" style="width:100%; box-sizing:border-box; padding:2px; font-size:11px; border:1px solid #ccc; border-radius:3px;"></td>
                    <td style="padding: 2px;"><input type="text" onkeyup="filterTableColumns()" class="col-filter" data-col="7" placeholder="🔍" style="width:100%; box-sizing:border-box; padding:2px; font-size:11px; border:1px solid #ccc; border-radius:3px;"></td>
                    <td style="padding: 2px;"><input type="text" onkeyup="filterTableColumns()" class="col-filter" data-col="8" placeholder="🔍" style="width:100%; box-sizing:border-box; padding:2px; font-size:11px; border:1px solid #ccc; border-radius:3px;"></td>
                    <td style="padding: 2px;"><input type="text" onkeyup="filterTableColumns()" class="col-filter" data-col="9" placeholder="🔍" style="width:100%; box-sizing:border-box; padding:2px; font-size:11px; border:1px solid #ccc; border-radius:3px;"></td>
                    <td style="padding: 2px;"><input type="text" onkeyup="filterTableColumns()" class="col-filter" data-col="10" placeholder="🔍" style="width:100%; box-sizing:border-box; padding:2px; font-size:11px; border:1px solid #ccc; border-radius:3px;"></td>
                    <td style="padding: 2px;"></td>
                </tr>
            </thead>
            <tbody id="records-tbody">
                ${tblRows}
            </tbody>
            <tfoot>
                <tr id="gt-row" style="border-top: 1px dashed #000; font-weight: bold; page-break-inside: avoid;">
                    <td colspan="8" style="padding: 6px 4px; text-align: right;">Grand Total:</td>
                    <td id="gt-hujjaj" style="padding: 6px 4px; text-align: center;">${tCount}</td>
                    <td colspan="2" style="padding: 6px 4px;"></td>
                    <td id="gt-amount" style="padding: 6px 4px; text-align: right;">${sar(tAmount)}</td>
                    <td class="no-print"></td>
                </tr>
            </tfoot>
        </table>
    </div>`;
    
    out.innerHTML = html;
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

async function deleteRecord(id) {
    const L = T[lang] || T.ur;
    if (!(await verifyPassword(L.confirmDel || "کیا آپ واقعی یہ ریکارڈ حذف کرنا چاہتے ہیں؟"))) return;
    records = records.filter(x => x.id !== id);
    svR();
    filterRecords();
}

function filterTableColumns() {
    const inputs = document.querySelectorAll('.col-filter');
    const filters = Array.from(inputs).map(inp => inp.value.toLowerCase().trim());
    const tbody = document.getElementById('records-tbody');
    if (!tbody) return;
    
    const rows = tbody.querySelectorAll('tr.rec-data-row');
    
    let visibleCount = 0;
    let visibleAmount = 0;
    let visibleRows = 0;
    
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
            visibleRows++;
            const hujjaj = parseInt(row.getAttribute('data-hujjaj') || '0', 10);
            const amount = parseFloat(row.getAttribute('data-amount') || '0');
            visibleCount += hujjaj;
            visibleAmount += amount;
        } else {
            row.style.display = 'none';
        }
    });
    
    const elRecords = document.getElementById('top-total-records');
    const elAmount = document.getElementById('top-total-amount');
    const elHujjaj = document.getElementById('top-total-hujjaj');
    const elGtHujjaj = document.getElementById('gt-hujjaj');
    const elGtAmount = document.getElementById('gt-amount');
    
    if (elRecords) elRecords.innerText = visibleRows;
    if (elAmount) elAmount.innerText = sar(visibleAmount);
    if (elHujjaj) elHujjaj.innerText = visibleCount;
    if (elGtHujjaj) elGtHujjaj.innerText = visibleCount;
    if (elGtAmount) elGtAmount.innerText = sar(visibleAmount);
}