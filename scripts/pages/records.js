// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  RECORDS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
let currentRecordsTab = 'pending';
let previousRecordsTab = 'pending';

function switchRecordsTab(tab) {
    currentRecordsTab = tab;
    if (tab === 'trash') {
        renderTrash();
    } else {
        filterRecords();
    }
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
    const perms = (typeof getMyPerms === 'function') ? getMyPerms() : { showAmounts: true, showPayments: true, canExport: true, canPrint: true, showReport: true, showDailyNote: true, showVoucher: true };
    const canEdit = (typeof canDo === 'function') ? canDo('edit') : true;
    const canDel = (typeof canDo === 'function') ? canDo('delete') : true;
    const canEntry = (typeof canDo === 'function') ? canDo('entry') : true;
    
    const filteredRows = currentRecordsTab === 'all'
        ? rows
        : currentRecordsTab === 'checked'
            ? rows.filter(r => r.checked)
            : rows.filter(r => !r.checked);
    
    const trashCount = (deletedRecords || []).length;
    const trashTabHtml = canDel ? `
        <div onclick="switchRecordsTab('trash')" style="flex: 1; text-align: center; padding: 8px 0; border-radius: 6px; cursor: pointer; font-size: 13px; font-weight: bold; transition: 0.3s; ${currentRecordsTab === 'trash' ? 'background: #fff; box-shadow: 0 2px 5px rgba(0,0,0,0.1); color: #c62828;' : 'color: #6c757d;'}">
            🗑️ ٹریش${trashCount > 0 ? ` <span style="background:#c62828;color:#fff;border-radius:10px;padding:1px 6px;font-size:11px;">${trashCount}</span>` : ''}
        </div>` : '';

    let tabsHtml = `
    <div style="display: flex; background: #f1f3f5; border-radius: 8px; padding: 4px; margin-bottom: 15px; width: 100%; max-width: 900px; margin-left: auto; margin-right: auto;" class="no-print">
        <div onclick="switchRecordsTab('pending')" style="flex: 1; text-align: center; padding: 8px 0; border-radius: 6px; cursor: pointer; font-size: 13px; font-weight: bold; transition: 0.3s; ${currentRecordsTab === 'pending' ? 'background: #fff; box-shadow: 0 2px 5px rgba(0,0,0,0.1); color: #1976d2;' : 'color: #6c757d;'}">
            🕒 Pending
        </div>
        <div onclick="switchRecordsTab('checked')" style="flex: 1; text-align: center; padding: 8px 0; border-radius: 6px; cursor: pointer; font-size: 13px; font-weight: bold; transition: 0.3s; ${currentRecordsTab === 'checked' ? 'background: #fff; box-shadow: 0 2px 5px rgba(0,0,0,0.1); color: #2e7d32;' : 'color: #6c757d;'}">
            ✔ Checked
        </div>
        <div onclick="switchRecordsTab('all')" style="flex: 1; text-align: center; padding: 8px 0; border-radius: 6px; cursor: pointer; font-size: 13px; font-weight: bold; transition: 0.3s; ${currentRecordsTab === 'all' ? 'background: #fff; box-shadow: 0 2px 5px rgba(0,0,0,0.1); color: #6a1b9a;' : 'color: #6c757d;'}">
            📋 تمام ریکارڈ
        </div>
        ${trashTabHtml}
    </div>
    `;

    const totalCols = 1 + (perms.showVoucher ? 1 : 0) + 5 + (perms.showAmounts ? 1 : 0) + 1 + (perms.showAmounts ? 1 : 0) + 1;
    
    const s = [...filteredRows].sort((a, b) => b.date.localeCompare(a.date));
    
    let tCount = 0; // total hujjaj
    let tAmount = 0; // total amount
    
    let tblRows = '';
    if (s.length === 0) {
        tblRows = `<tr><td colspan="${totalCols}" style="text-align:center;padding:35px 20px;color:var(--muted);background:#fafafa;"><div style="font-size:36px;margin-bottom:8px;">📂</div><div style="font-size:14px;font-weight:600;">${L.noRec || 'کوئی ریکارڈ نہیں ملا'}</div></td></tr>`;
    } else {
        tblRows = s.map(r => {
            const sharing = r.mode === 'sharing' || isSharing(r.transport);
            if (sharing) tCount += r.count;
            tAmount += r.total;
            
            const statusBadge = currentRecordsTab === 'all'
                ? `<span style="font-size:10px;padding:2px 6px;border-radius:10px;font-weight:bold;background:${r.checked ? '#e8f5e9' : '#e3f2fd'};color:${r.checked ? '#2e7d32' : '#1565c0'};">${r.checked ? '✔' : '🕒'}</span>`
                : '';
            
            const editBtn = canEdit ? `<button class="btn btn-sm btn-o" onclick="editRecord('${r.id}')">${L.edit}</button>` : '';
            const delBtn = canDel ? `<button class="btn btn-sm btn-d" onclick="deleteRecord('${r.id}')">${L.del}</button>` : '';
            const copyBtn = canEntry ? `<button class="btn btn-sm" onclick="copyVoucher('${r.id}')" title="کاپی کریں" style="background:linear-gradient(135deg,#1565c0,#1976d2);color:#fff;border:none;padding:3px 8px;border-radius:5px;cursor:pointer;font-size:11px;">📋</button>` : '';
            const actionHtml = (editBtn || delBtn || copyBtn) ? `${editBtn} ${delBtn} ${copyBtn}` : '—';

            return `
                <tr class="rec-data-row" data-hujjaj="${sharing ? r.count : 0}" data-amount="${r.total}">
                    <td style="padding:4px; text-align:center;" class="no-print">
                        <input type="checkbox" onchange="toggleRecordCheck('${r.id}')" ${r.checked ? 'checked' : ''} style="transform: scale(1.4); cursor: pointer; accent-color: #2E7D32;">
                    </td>
                    ${perms.showVoucher ? `<td style="padding:4px;"><span style="font-family:monospace;font-weight:700;color:var(--green-dark);font-size:11px;">${r.voucher || '—'}</span></td>` : ''}
                    <td style="padding:4px;">${fd(r.date)}</td>
                    <td style="padding:4px;"><strong>${r.party}</strong></td>
                    <td style="padding:4px;"><span class="badge">${r.sector}</span>${statusBadge}</td>
                    <td style="padding:4px;">${r.transport || '—'}</td>
                    <td style="padding:4px;text-align:center;">${sharing ? `<strong>${r.count}</strong>` : '—'}</td>
                    ${perms.showAmounts ? `<td style="padding:4px;text-align:right;">${sharing ? sar(r.fare) : '—'}</td>` : ''}
                    <td style="padding:4px;text-align:left;"><span style="font-family:monospace;color:#1565c0;font-weight:600;">${r.flightNo || '—'}</span></td>
                    ${perms.showAmounts ? `<td style="padding:4px;text-align:right;"><strong style="color:var(--green-dark);">${sar(r.total)}</strong></td>` : ''}
                    <td style="padding:4px;" class="no-print">${actionHtml}</td>
                </tr>
            `;
        }).join('');
    }

    const titleBg = currentRecordsTab === 'pending' ? '#e3f2fd' : currentRecordsTab === 'checked' ? '#e8f5e9' : '#f3e5f5';
    const titleBorder = currentRecordsTab === 'pending' ? '#90caf9' : currentRecordsTab === 'checked' ? '#a5d6a7' : '#ce93d8';
    const titleColor = currentRecordsTab === 'pending' ? '#1565c0' : currentRecordsTab === 'checked' ? '#1b5e20' : '#6a1b9a';
    const titleText = currentRecordsTab === 'pending' ? '⏳ Pending Records (باقی ماندہ)' : currentRecordsTab === 'checked' ? '✅ Checked Records (مکمل شدہ)' : '📋 تمام ریکارڈ (All Records)';
    const excelBtn = (currentRecordsTab === 'all' && perms.canExport)
        ? `<button onclick="exportRecordsToExcel()" class="no-print" title="Excel میں محفوظ کریں" style="margin-right:10px;background:linear-gradient(135deg,#1b5e20,#2e7d32);color:#fff;border:none;padding:5px 14px;border-radius:6px;cursor:pointer;font-size:12px;font-weight:bold;box-shadow:0 2px 6px rgba(0,0,0,0.2);">📥 Excel ڈاؤنلوڈ</button>`
        : '';

    const html = `
    <div style="font-family: sans-serif; color: #000; background: #fff; padding: 10px; border: 1px solid #ccc; margin-bottom: 20px; border-radius: 8px;">
        ${tabsHtml}
        <div style="background-color: ${titleBg}; border: 1px solid ${titleBorder}; border-radius: 6px; text-align: center; padding: 10px; font-weight: bold; font-size: 16px; margin-bottom: 15px; color: ${titleColor}; display: flex; align-items: center; justify-content: center;">
            <span style="flex:1;">${titleText}</span>
            ${excelBtn}
        </div>
        
        <table style="width: 100%; border: none; font-size: 12px; margin-bottom: 15px;">
            <tr>
                <td style="font-weight: bold; width: 120px;">Total Records:</td>
                <td id="top-total-records">${s.length}</td>
                ${perms.showAmounts ? `
                <td style="font-weight: bold; text-align: right; width: 100px;">Total Amount:</td>
                <td id="top-total-amount" style="text-align: right; font-weight: bold; width: 100px;">${sar(tAmount)}</td>` : '<td colspan="2"></td>'}
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

        <div class="tbl-wrap">
        <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
            <thead>
                <tr style="border-top: 1px solid #000; border-bottom: 1px solid #000;">
                    <th style="text-align: center; padding: 4px; width: 30px;" class="no-print">✔</th>
                    ${perms.showVoucher ? `<th style="text-align: left; padding: 4px;">${L.voucherCol}</th>` : ''}
                    <th style="text-align: left; padding: 4px;">${L.dateCol}</th>
                    <th style="text-align: left; padding: 4px;">${L.partyCol}</th>
                    <th style="text-align: left; padding: 4px;">${L.sectorCol}</th>
                    <th style="text-align: left; padding: 4px;">${L.transportCol}</th>
                    <th style="text-align: center; padding: 4px;">${L.hujjajCol}</th>
                    ${perms.showAmounts ? `<th style="text-align: right; padding: 4px;">${L.fareCol}</th>` : ''}
                    <th style="text-align: left; padding: 4px;">✈️ Flight No</th>
                    ${perms.showAmounts ? `<th style="text-align: right; padding: 4px;">${L.totalCol}</th>` : ''}
                    <th style="text-align: left; padding: 4px;" class="no-print">${L.actionCol}</th>
                </tr>
                <tr id="records-filter-row" class="no-print" style="background: #f8f9fa; border-bottom: 1px solid #ddd;">
                    <td style="padding: 2px;"></td>
                    ${perms.showVoucher ? `<td style="padding: 2px;"><input type="text" onkeyup="filterTableColumns()" oninput="filterTableColumns()" class="col-filter" placeholder="🔍 تلاش" style="width:100%; box-sizing:border-box; padding:2px 4px; font-size:11px; border:1px solid #ccc; border-radius:3px;"></td>` : ''}
                    <td style="padding: 2px;"><input type="text" onkeyup="filterTableColumns()" oninput="filterTableColumns()" class="col-filter" placeholder="🔍 تلاش" style="width:100%; box-sizing:border-box; padding:2px 4px; font-size:11px; border:1px solid #ccc; border-radius:3px;"></td>
                    <td style="padding: 2px;"><input type="text" onkeyup="filterTableColumns()" oninput="filterTableColumns()" class="col-filter" placeholder="🔍 تلاش" style="width:100%; box-sizing:border-box; padding:2px 4px; font-size:11px; border:1px solid #ccc; border-radius:3px;"></td>
                    <td style="padding: 2px;"><input type="text" onkeyup="filterTableColumns()" oninput="filterTableColumns()" class="col-filter" placeholder="🔍 تلاش" style="width:100%; box-sizing:border-box; padding:2px 4px; font-size:11px; border:1px solid #ccc; border-radius:3px;"></td>
                    <td style="padding: 2px;"><input type="text" onkeyup="filterTableColumns()" oninput="filterTableColumns()" class="col-filter" placeholder="🔍 تلاش" style="width:100%; box-sizing:border-box; padding:2px 4px; font-size:11px; border:1px solid #ccc; border-radius:3px;"></td>
                    <td style="padding: 2px;"><input type="text" onkeyup="filterTableColumns()" oninput="filterTableColumns()" class="col-filter" placeholder="🔍 تلاش" style="width:100%; box-sizing:border-box; padding:2px 4px; font-size:11px; border:1px solid #ccc; border-radius:3px;"></td>
                    ${perms.showAmounts ? `<td style="padding: 2px;"><input type="text" onkeyup="filterTableColumns()" oninput="filterTableColumns()" class="col-filter" placeholder="🔍 تلاش" style="width:100%; box-sizing:border-box; padding:2px 4px; font-size:11px; border:1px solid #ccc; border-radius:3px;"></td>` : ''}
                    <td style="padding: 2px;"><input type="text" onkeyup="filterTableColumns()" oninput="filterTableColumns()" class="col-filter" placeholder="🔍 تلاش" style="width:100%; box-sizing:border-box; padding:2px 4px; font-size:11px; border:1px solid #ccc; border-radius:3px;"></td>
                    ${perms.showAmounts ? `<td style="padding: 2px;"><input type="text" onkeyup="filterTableColumns()" oninput="filterTableColumns()" class="col-filter" placeholder="🔍 تلاش" style="width:100%; box-sizing:border-box; padding:2px 4px; font-size:11px; border:1px solid #ccc; border-radius:3px;"></td>` : ''}
                    <td style="padding: 2px;"></td>
                </tr>
            </thead>
            <tbody id="records-tbody">
                ${tblRows}
            </tbody>
            <tfoot>
                <tr id="gt-row" style="border-top: 1px dashed #000; font-weight: bold; page-break-inside: avoid;">
                    <td colspan="${perms.showVoucher ? '6' : '5'}" style="padding: 6px 4px; text-align: right;">Grand Total:</td>
                    <td id="gt-hujjaj" style="padding: 6px 4px; text-align: center;">${tCount}</td>
                    <td colspan="${perms.showAmounts ? '2' : '1'}" style="padding: 6px 4px;"></td>
                    ${perms.showAmounts ? `<td id="gt-amount" style="padding: 6px 4px; text-align: right;">${sar(tAmount)}</td>` : ''}
                    <td class="no-print"></td>
                </tr>
            </tfoot>
        </table>
        </div>
    </div>`;
    
    out.innerHTML = html;
}

function filterRecords() {
    const from = document.getElementById('f-from') ? document.getElementById('f-from').value : '';
    const to = document.getElementById('f-to') ? document.getElementById('f-to').value : '';
    const party = document.getElementById('f-party') ? document.getElementById('f-party').value : '';
    const sector = document.getElementById('f-sector') ? document.getElementById('f-sector').value : '';
    const search = document.getElementById('f-search') ? document.getElementById('f-search').value.toLowerCase().trim() : '';

    let rows = [...records];
    if (from) rows = rows.filter(r => r.date >= from);
    if (to) rows = rows.filter(r => r.date <= to);
    if (party) rows = rows.filter(r => r.party === party);
    if (sector) rows = rows.filter(r => r.sector === sector);
    if (search) {
        rows = rows.filter(r => 
            (r.voucher && r.voucher.toLowerCase().includes(search)) ||
            (r.party && r.party.toLowerCase().includes(search)) ||
            (r.sector && r.sector.toLowerCase().includes(search)) ||
            (r.transport && r.transport.toLowerCase().includes(search)) ||
            (r.flightNo && r.flightNo.toLowerCase().includes(search)) ||
            (r.notes && r.notes.toLowerCase().includes(search)) ||
            (r.date && r.date.toLowerCase().includes(search))
        );
    }
    renderRecords(rows);
}

function clearFilter() {
    ['f-from', 'f-to'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });
    ['f-party', 'f-sector'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });
    const fSearch = document.getElementById('f-search');
    if (fSearch) fSearch.value = '';
    const colFilters = document.querySelectorAll('.col-filter');
    colFilters.forEach(inp => inp.value = '');
    renderRecords(records);
}

async function deleteRecord(id) {
    if (typeof canDo === 'function' && !canDo('delete')) {
        alert('⚠️ آپ کو ریکارڈ حذف کرنے کی اجازت نہیں ہے');
        return;
    }
    const L = T[lang] || T.ur;
    if (!(await verifyPassword(L.confirmDel || "کیا آپ واقعی یہ ریکارڈ حذف کرنا چاہتے ہیں؟"))) return;
    const rec = records.find(x => x.id === id);
    if (!rec) return;
    // Move to trash instead of permanent delete
    deletedRecords = deletedRecords || [];
    deletedRecords.push({ ...rec, deletedAt: new Date().toISOString() });
    records = records.filter(x => x.id !== id);
    svR();
    svDR();
    filterRecords();
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  TRASH (ٹریش)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function renderTrash() {
    const L = T[lang] || T.ur;
    const out = document.getElementById('rec-output');
    const trashCount = (deletedRecords || []).length;

    const trashTabsHtml = `
    <div style="display: flex; background: #f1f3f5; border-radius: 8px; padding: 4px; margin-bottom: 15px; width: 100%; max-width: 900px; margin-left: auto; margin-right: auto;" class="no-print">
        <div onclick="switchRecordsTab('pending')" style="flex: 1; text-align: center; padding: 8px 0; border-radius: 6px; cursor: pointer; font-size: 13px; font-weight: bold; transition: 0.3s; color: #6c757d;">
            🕒 Pending
        </div>
        <div onclick="switchRecordsTab('checked')" style="flex: 1; text-align: center; padding: 8px 0; border-radius: 6px; cursor: pointer; font-size: 13px; font-weight: bold; transition: 0.3s; color: #6c757d;">
            ✔ Checked
        </div>
        <div onclick="switchRecordsTab('all')" style="flex: 1; text-align: center; padding: 8px 0; border-radius: 6px; cursor: pointer; font-size: 13px; font-weight: bold; transition: 0.3s; color: #6c757d;">
            📋 تمام ریکارڈ
        </div>
        <div onclick="switchRecordsTab('trash')" style="flex: 1; text-align: center; padding: 8px 0; border-radius: 6px; cursor: pointer; font-size: 13px; font-weight: bold; transition: 0.3s; background: #fff; box-shadow: 0 2px 5px rgba(0,0,0,0.1); color: #c62828;">
            🗑️ ٹریش${trashCount > 0 ? ` <span style="background:#c62828;color:#fff;border-radius:10px;padding:1px 6px;font-size:11px;">${trashCount}</span>` : ''}
        </div>
    </div>`;

    if (!trashCount) {
        out.innerHTML = trashTabsHtml + `<div class="empty"><div class="ico">🗑️</div>ٹریش خالی ہے — کوئی حذف شدہ ریکارڈ نہیں</div>`;
        return;
    }

    const sorted = [...deletedRecords].sort((a, b) => (b.deletedAt || '').localeCompare(a.deletedAt || ''));

    const rows = sorted.map(r => `
        <tr style="background:#fff8f8;">
            <td style="padding:4px;"><span style="font-family:monospace;font-weight:700;color:#c62828;font-size:11px;">${r.voucher || '—'}</span></td>
            <td style="padding:4px;">${fd(r.date)}</td>
            <td style="padding:4px;"><strong>${r.party}</strong></td>
            <td style="padding:4px;"><span class="badge">${r.sector}</span></td>
            <td style="padding:4px;">${r.transport || '—'}</td>
            <td style="padding:4px;text-align:center;">${r.count || '—'}</td>
            <td style="padding:4px;text-align:right;"><strong style="color:#c62828;">${sar(r.total)}</strong></td>
            <td style="padding:4px;font-size:10px;color:#888;">${r.deletedAt ? new Date(r.deletedAt).toLocaleString('ur-PK') : '—'}</td>
            <td style="padding:4px;">
                <button class="btn btn-sm btn-g" onclick="restoreRecord('${r.id}')" title="واپس کریں" style="background:linear-gradient(135deg,#2e7d32,#388e3c);color:#fff;border:none;padding:3px 10px;border-radius:5px;cursor:pointer;font-size:11px;">↩ Restore</button>
            </td>
        </tr>
    `).join('');

    out.innerHTML = trashTabsHtml + `
    <div style="font-family:sans-serif;color:#000;background:#fff;padding:10px;border:1px solid #ffcdd2;margin-bottom:20px;border-radius:8px;">
        <div style="background:#ffebee;border:1px solid #ef9a9a;border-radius:6px;text-align:center;padding:10px;font-weight:bold;font-size:16px;margin-bottom:15px;color:#c62828;">
            🗑️ ٹریش — حذف شدہ ریکارڈ (${trashCount})
        </div>
        <p style="font-size:12px;color:#888;text-align:center;margin-bottom:10px;">یہ ریکارڈ ریکارڈز پیج سے ہٹا دیے گئے ہیں۔ Restore بٹن سے واپس لا سکتے ہیں۔</p>
        <table style="width:100%;border-collapse:collapse;font-size:12px;">
            <thead>
                <tr style="border-top:1px solid #000;border-bottom:1px solid #000;">
                    <th style="text-align:left;padding:4px;">واوچر</th>
                    <th style="text-align:left;padding:4px;">تاریخ</th>
                    <th style="text-align:left;padding:4px;">پارٹی</th>
                    <th style="text-align:left;padding:4px;">سیکٹر</th>
                    <th style="text-align:left;padding:4px;">ٹرانسپورٹ</th>
                    <th style="text-align:center;padding:4px;">حجاج</th>
                    <th style="text-align:right;padding:4px;">رقم</th>
                    <th style="text-align:left;padding:4px;">حذف کی تاریخ</th>
                    <th style="text-align:left;padding:4px;">عمل</th>
                </tr>
            </thead>
            <tbody>${rows}</tbody>
        </table>
    </div>`;
}

async function restoreRecord(id) {
    const L = T[lang] || T.ur;
    const rec = (deletedRecords || []).find(x => x.id === id);
    if (!rec) return;
    // Remove deletedAt before restoring
    const { deletedAt, ...restored } = rec;
    records.push(restored);
    deletedRecords = deletedRecords.filter(x => x.id !== id);
    svR();
    svDR();
    renderTrash();
    al('al-entry', `✅ واوچر ${rec.voucher || ''} بحال ہوگیا`, 'ok');
}

function filterTableColumns() {
    const filterRow = document.getElementById('records-filter-row');
    if (!filterRow) return;
    const filterTds = filterRow.querySelectorAll('td');
    const filters = Array.from(filterTds).map(td => {
        const inp = td.querySelector('.col-filter');
        return inp ? inp.value.toLowerCase().trim() : '';
    });
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

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  COPY VOUCHER
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
let _copySourceId = null;

function copyVoucher(id) {
    const r = records.find(x => x.id === id);
    if (!r) return;
    _copySourceId = id;

    // Header label
    document.getElementById('copy-modal-voucher-label').textContent =
        `واوچر: ${r.voucher || '—'}  |  پارٹی: ${r.party}`;

    // Info strip
    document.getElementById('copy-modal-info').innerHTML =
        `<span style="margin-left:16px;">📅 ${fd(r.date)}</span>` +
        `<span style="margin-left:16px;">🗺️ ${r.sector}</span>` +
        `<span style="margin-left:16px;">🚌 ${r.transport || '—'}</span>` +
        `<span style="margin-left:16px;">👥 ${r.count || 0} حجاج</span>` +
        `<span style="margin-left:16px;">💰 ${sar(r.fare || 0)} فی کس</span>`;

    // Prefill form with same values (user can change)
    document.getElementById('copy-date').value = today();

    // Sector dropdown
    const secSel = document.getElementById('copy-sector');
    secSel.innerHTML = sectors.map(s =>
        `<option value="${s}" ${s === r.sector ? 'selected' : ''}>${s}</option>`
    ).join('');

    // Transport dropdown
    const trSel = document.getElementById('copy-transport');
    trSel.innerHTML = transports.map(t =>
        `<option value="${t}" ${t === r.transport ? 'selected' : ''}>${t}</option>`
    ).join('');

    document.getElementById('copy-fare').value = r.fare || 0;
    document.getElementById('copy-count').value = r.count || 0;

    // Clear alert
    document.getElementById('al-copy').innerHTML = '';

    // Show modal
    document.getElementById('copy-modal').classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeCopyModal() {
    document.getElementById('copy-modal').classList.remove('open');
    document.body.style.overflow = '';
    _copySourceId = null;
}

function confirmCopyVoucher() {
    if (!_copySourceId) return;
    const src = records.find(x => x.id === _copySourceId);
    if (!src) return;

    const newDate   = document.getElementById('copy-date').value;
    const newSector = document.getElementById('copy-sector').value;
    const newTrans  = document.getElementById('copy-transport').value;
    const newFare   = parseFloat(document.getElementById('copy-fare').value) || 0;
    const newCount  = parseInt(document.getElementById('copy-count').value) || 0;

    if (!newDate || !newSector || !newTrans) {
        al('al-copy', 'تاریخ، سیکٹر اور ٹرانسپورٹ ضروری ہیں', 'er');
        return;
    }

    const calcCount = newCount < 1 ? 1 : newCount;
    const newTotal  = Math.round(calcCount * newFare);

    const newRecord = {
        ...src,
        id:           uid(),
        // واوچر نمبر وہی رہے گا (src.voucher) — صرف نئی ID
        date:         newDate,
        sector:       newSector,
        transport:    newTrans,
        fare:         newFare,
        count:        newCount,
        total:        newTotal,
        vehicleTotal: newTotal,
        checked:      false,
    };

    records.push(newRecord);
    svR();
    closeCopyModal();
    currentRecordsTab = 'pending'; // ڈپلیکیٹ ریکارڈ Pending میں جاتا ہے
    filterRecords();
    al('al-entry', `✅ واوچر ${newRecord.voucher} کا ڈپلیکیٹ بن گیا — ${newSector}`, 'ok');
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  EXCEL EXPORT (تمام ریکارڈ)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function exportRecordsToExcel() {
    const L = T[lang] || T.ur;

    // موجودہ فلٹر سے ریکارڈ حاصل کریں
    const from   = document.getElementById('f-from')   ? document.getElementById('f-from').value   : '';
    const to     = document.getElementById('f-to')     ? document.getElementById('f-to').value     : '';
    const party  = document.getElementById('f-party')  ? document.getElementById('f-party').value  : '';
    const sector = document.getElementById('f-sector') ? document.getElementById('f-sector').value : '';
    const search = document.getElementById('f-search') ? document.getElementById('f-search').value.toLowerCase().trim() : '';

    let rows = [...records];
    if (from)   rows = rows.filter(r => r.date >= from);
    if (to)     rows = rows.filter(r => r.date <= to);
    if (party)  rows = rows.filter(r => r.party === party);
    if (sector) rows = rows.filter(r => r.sector === sector);
    if (search) {
        rows = rows.filter(r => 
            (r.voucher && r.voucher.toLowerCase().includes(search)) ||
            (r.party && r.party.toLowerCase().includes(search)) ||
            (r.sector && r.sector.toLowerCase().includes(search)) ||
            (r.transport && r.transport.toLowerCase().includes(search)) ||
            (r.flightNo && r.flightNo.toLowerCase().includes(search)) ||
            (r.notes && r.notes.toLowerCase().includes(search)) ||
            (r.date && r.date.toLowerCase().includes(search))
        );
    }

    // تاریخ کے مطابق ترتیب (نیا پہلے)
    rows = [...rows].sort((a, b) => b.date.localeCompare(a.date));

    // ━━ CSV ہیڈر ━━
    const headers = [
        'واوچر نمبر',
        'تاریخ',
        'پارٹی',
        'سیکٹر',
        'ٹرانسپورٹ',
        'حجاج تعداد',
        'کرایہ فی کس (SAR)',
        'فلائٹ نمبر',
        'کل رقم (SAR)',
        'اسٹیٹس'
    ];

    const csvRows = [headers.join(',')];

    let totalHujjaj = 0;
    let totalAmount = 0;

    rows.forEach(r => {
        const sharing = r.mode === 'sharing' || isSharing(r.transport);
        const count   = sharing ? (r.count || 0) : 0;
        const fare    = sharing ? (r.fare  || 0) : 0;
        if (sharing) totalHujjaj += count;
        totalAmount += (r.total || 0);

        const status = r.checked ? 'مکمل (Checked)' : 'باقی (Pending)';

        // خصوصی حروف سے بچاؤ کے لیے ہر سیل کو quotes میں لپیٹیں
        const esc = v => `"${String(v ?? '').replace(/"/g, '""')}"`;

        csvRows.push([
            esc(r.voucher || ''),
            esc(fd(r.date)),
            esc(r.party   || ''),
            esc(r.sector  || ''),
            esc(r.transport || ''),
            esc(sharing ? count : ''),
            esc(sharing ? fare  : ''),
            esc(r.flightNo || ''),
            esc(r.total || 0),
            esc(status)
        ].join(','));
    });

    // ━━ خالی لائن اور سم ━━
    csvRows.push('');
    csvRows.push(`"کل ریکارڈ:","${rows.length}"`);
    csvRows.push(`"کل حجاج:","${totalHujjaj}"`);
    csvRows.push(`"کل رقم (SAR):","${totalAmount}"`);
    csvRows.push(`"رپورٹ تاریخ:","${fd(today())}"`);

    // ━━ BOM + ڈاؤنلوڈ ━━
    const bom    = '\uFEFF';   // Urdu / Arabic کے لیے UTF-8 BOM
    const blob   = new Blob([bom + csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url    = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    const date   = today().replace(/-/g, '');
    const tab    = currentRecordsTab === 'all' ? 'تمام' : currentRecordsTab === 'checked' ? 'مکمل' : 'باقی';

    anchor.href     = url;
    anchor.download = `UmrahTransport_Records_${tab}_${date}.csv`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);

    al('al-entry', `✅ Excel فائل ڈاؤنلوڈ ہوگئی — ${rows.length} ریکارڈ`, 'ok');
}