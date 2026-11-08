// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  RECORDS (Exactly as original)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
let currentRecordsTab = 'pending';
let previousRecordsTab = 'pending';
let recordsCurrentPage = 1;
let recordsPageSize = 25;
let recordsColumnFilters = {};

function switchRecordsTab(tab) {
    captureRecordsColumnFilters();
    currentRecordsTab = tab;
    recordsCurrentPage = 1;
    saveFilterState();
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
    // No-op
}

function renderRecords(rows) {
    if (!rows) rows = (typeof records !== 'undefined' && Array.isArray(records)) ? records : [];
    const L = T[lang] || T.ur;
    const out = document.getElementById('rec-output');
    if (!out) return;
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
        <button onclick="switchRecordsTab('trash')" class="rec-subtab-btn ${currentRecordsTab === 'trash' ? 'active-trash' : ''}">
            ${lang === 'en' ? 'Trash' : lang === 'ar' ? 'سلة المحذوفات' : 'حذف شدہ'}${trashCount > 0 ? ` <span class="rec-trash-pill">${trashCount}</span>` : ''}
        </button>` : '';

    const tabsHtml = `
    <div class="rec-subtabs no-print">
        <button onclick="switchRecordsTab('pending')" class="rec-subtab-btn ${currentRecordsTab === 'pending' ? 'active' : ''}">
            ${lang === 'en' ? 'Pending' : lang === 'ar' ? 'قيد الانتظار' : 'زیر التواء'}
        </button>
        <button onclick="switchRecordsTab('checked')" class="rec-subtab-btn ${currentRecordsTab === 'checked' ? 'active' : ''}">
            ${lang === 'en' ? 'Checked' : lang === 'ar' ? 'تم التدقيق' : 'تصدیق شدہ'}
        </button>
        <button onclick="switchRecordsTab('all')" class="rec-subtab-btn ${currentRecordsTab === 'all' ? 'active' : ''}">
            ${lang === 'en' ? 'All Records' : lang === 'ar' ? 'جميع السجلات' : 'تمام ریکارڈ'}
        </button>
        ${trashTabHtml}
    </div>
    `;

    const totalCols = 1 + (perms.showVoucher ? 1 : 0) + 5 + (perms.showAmounts ? 1 : 0) + 1 + (perms.showAmounts ? 1 : 0) + 1;
    const s = [...filteredRows].sort((a, b) => b.date.localeCompare(a.date));
    const totalPages = Math.max(1, Math.ceil(s.length / recordsPageSize));
    recordsCurrentPage = Math.min(Math.max(recordsCurrentPage, 1), totalPages);
    const firstRecord = (recordsCurrentPage - 1) * recordsPageSize;
    const lastRecord = Math.min(firstRecord + recordsPageSize, s.length);
    const pageRows = s.slice(firstRecord, lastRecord);
    const tCount = s.reduce((sum, record) => {
        const sharing = record.mode === 'sharing' || isSharing(record.transport);
        return sum + (sharing ? Number(record.count) || 0 : 0);
    }, 0);
    const tAmount = s.reduce((sum, record) => sum + (Number(record.total) || 0), 0);

    let tblRows = '';
    if (s.length === 0) {
        tblRows = `<tr><td colspan="${totalCols}"><div class="empty"><div class="empty-icon"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg></div><div>${L.noRec || 'کوئی ریکارڈ نہیں ملا'}</div></div></td></tr>`;
    } else {
        tblRows = pageRows.map(r => {
            const sharing = r.mode === 'sharing' || isSharing(r.transport);

            const statusBadge = currentRecordsTab === 'all'
                ? `<span class="badge ${r.checked ? 'badge-checked' : 'badge-pending'}">${r.checked ? (lang === 'en' ? 'Checked' : 'مکمل') : (lang === 'en' ? 'Pending' : 'زیر التواء')}</span>`
                : '';

            const editBtn = canEdit ? `<button class="btn btn-sm btn-o" onclick="editRecord('${r.id}')">${L.edit}</button>` : '';
            const delBtn = canDel ? `<button class="btn btn-sm btn-d" onclick="deleteRecord('${r.id}')">${L.del}</button>` : '';
            const copyBtn = canEntry ? `<button class="btn btn-sm btn-o" onclick="copyVoucher('${r.id}')" title="${lang === 'en' ? 'Copy' : 'کاپی'}">${lang === 'en' ? 'Copy' : 'کاپی'}</button>` : '';
            const actionHtml = (editBtn || delBtn || copyBtn) ? `<div class="rec-action-buttons">${editBtn}${delBtn}${copyBtn}</div>` : '—';

            return `
                <tr class="rec-data-row" data-hujjaj="${sharing ? r.count : 0}" data-amount="${r.total}">
                    <td style="text-align:center;" class="no-print">
                        <input type="checkbox" onchange="toggleRecordCheck('${r.id}')" ${r.checked ? 'checked' : ''}>
                    </td>
                    ${perms.showVoucher ? `<td><span class="voucher-tag">${r.voucher || '—'}</span></td>` : ''}
                    <td>${fd(r.date)}</td>
                    <td><strong>${r.party}</strong></td>
                    <td><span class="badge">${r.sector}</span> ${statusBadge}</td>
                    <td>${r.transport || '—'}</td>
                    <td style="text-align:center;">${sharing ? `<strong>${r.count}</strong>` : '—'}</td>
                    ${perms.showAmounts ? `<td style="text-align:right;">${sharing ? sar(r.fare) : '—'}</td>` : ''}
                    <td style="text-align:left;"><span class="flight-no">${r.flightNo || '—'}</span></td>
                    ${perms.showAmounts ? `<td style="text-align:right;"><strong class="total-col">${sar(r.total)}</strong></td>` : ''}
                    <td class="no-print rec-actions-cell">${actionHtml}</td>
                </tr>
            `;
        }).join('');
    }

    const titleText = currentRecordsTab === 'pending'
        ? (lang === 'en' ? 'Pending Records' : lang === 'ar' ? 'سجلات قيد الانتظار' : 'زیر التواء ریکارڈ (Pending Records)')
        : currentRecordsTab === 'checked'
            ? (lang === 'en' ? 'Checked Records' : lang === 'ar' ? 'سجلات تم فحصها' : 'تصدیق شدہ ریکارڈ (Checked Records)')
            : (lang === 'en' ? 'All Transport Records' : lang === 'ar' ? 'جميع سجلات النقل' : 'تمام ریکارڈ (All Records)');

    const excelBtn = perms.canExport
        ? `<button onclick="exportRecordsToExcel()" class="btn btn-sm btn-o no-print" title="${lang === 'en' ? 'Export to Excel' : 'ایکسل فائل محفوظ کریں'}">${lang === 'en' ? 'Export Excel' : 'ایکسل ڈاؤنلوڈ'}</button>`
        : '';
    const importBtn = canEntry
        ? `<button onclick="openImportRecordsModal()" class="btn btn-sm btn-o no-print" title="${lang === 'en' ? 'Import from Excel' : 'ایکسل سے امپورٹ کریں'}">${lang === 'en' ? 'Import Excel' : 'ایکسل امپورٹ'}</button>`
        : '';

    const filterPlaceholder = lang === 'en' ? 'Filter...' : lang === 'ar' ? 'تصفية...' : 'تلاش...';
    const columnFilterInput = key => `<input type="text" oninput="filterTableColumns()" class="col-filter" value="${escapeRecordsAttribute(recordsColumnFilters[key] || '')}" placeholder="${filterPlaceholder}">`;

    const html = `
    <div class="card records-table-card">
        ${tabsHtml}
        <div class="rec-header-bar">
            <span class="rec-header-title">${titleText}</span>
            <div style="display:inline-flex;gap:6px;align-items:center;">
                ${excelBtn}
                ${importBtn}
            </div>
        </div>

        <div class="rec-stats-strip">
            <div class="rec-stat-item"><span class="lbl">${lang === 'en' ? 'Total Records:' : 'کل ریکارڈز:'}</span> <span class="val" id="top-total-records">${s.length}</span></div>
            <div class="rec-stat-item"><span class="lbl">${lang === 'en' ? 'Total Pilgrims:' : 'کل حجاج:'}</span> <span class="val" id="top-total-hujjaj">${tCount}</span></div>
            ${perms.showAmounts ? `<div class="rec-stat-item"><span class="lbl">${lang === 'en' ? 'Total Amount:' : 'کل رقم:'}</span> <span class="val text-accent" id="top-total-amount">${sar(tAmount)}</span></div>` : ''}
            <div class="rec-stat-item"><span class="lbl">${lang === 'en' ? 'Date:' : 'تاریخ:'}</span> <span class="val">${fd(today())}</span></div>
        </div>

        <div class="tbl-wrap">
        <table>
            <thead>
                <tr>
                    <th style="text-align: center; width: 34px;" class="no-print">#</th>
                    ${perms.showVoucher ? `<th>${L.voucherCol}</th>` : ''}
                    <th>${L.dateCol}</th>
                    <th>${L.partyCol}</th>
                    <th>${L.sectorCol}</th>
                    <th>${L.transportCol}</th>
                    <th style="text-align: center;">${L.hujjajCol}</th>
                    ${perms.showAmounts ? `<th style="text-align: right;">${L.fareCol}</th>` : ''}
                    <th>${lang === 'en' ? 'Flight No' : 'فلائٹ نمبر'}</th>
                    ${perms.showAmounts ? `<th style="text-align: right;">${L.totalCol}</th>` : ''}
                    <th class="no-print">${L.actionCol}</th>
                </tr>
                <tr id="records-filter-row" class="no-print">
                    <td></td>
                    ${perms.showVoucher ? `<td data-filter-key="voucher">${columnFilterInput('voucher')}</td>` : ''}
                    <td data-filter-key="date">${columnFilterInput('date')}</td>
                    <td data-filter-key="party">${columnFilterInput('party')}</td>
                    <td data-filter-key="sector">${columnFilterInput('sector')}</td>
                    <td data-filter-key="transport">${columnFilterInput('transport')}</td>
                    <td data-filter-key="count">${columnFilterInput('count')}</td>
                    ${perms.showAmounts ? `<td data-filter-key="fare">${columnFilterInput('fare')}</td>` : ''}
                    <td data-filter-key="flight">${columnFilterInput('flight')}</td>
                    ${perms.showAmounts ? `<td data-filter-key="total">${columnFilterInput('total')}</td>` : ''}
                    <td></td>
                </tr>
            </thead>
            <tbody id="records-tbody">
                ${tblRows}
            </tbody>
            <tfoot>
                <tr id="gt-row">
                    <td colspan="${perms.showVoucher ? '6' : '5'}" style="text-align: right; padding: 10px 12px;">Grand Total:</td>
                    <td id="gt-hujjaj" style="text-align: center; padding: 10px 12px;">${tCount}</td>
                    <td colspan="${perms.showAmounts ? '2' : '1'}"></td>
                    ${perms.showAmounts ? `<td id="gt-amount" style="text-align: right; padding: 10px 12px;">${sar(tAmount)}</td>` : ''}
                    <td class="no-print"></td>
                </tr>
            </tfoot>
        </table>
        </div>
        ${s.length ? `
        <div class="records-pagination no-print">
            <label class="records-page-size-label" for="records-page-size">
                ${lang === 'en' ? 'Rows per page' : lang === 'ar' ? 'الصفوف في الصفحة' : 'فی صفحہ ریکارڈ'}:
                <select id="records-page-size" onchange="setRecordsPageSize(this.value)">
                    <option value="25" ${recordsPageSize === 25 ? 'selected' : ''}>25</option>
                    <option value="50" ${recordsPageSize === 50 ? 'selected' : ''}>50</option>
                </select>
            </label>
            <span class="records-page-status">${firstRecord + 1}–${lastRecord} / ${s.length}</span>
            <div class="records-page-buttons">
                <button type="button" class="btn btn-o btn-sm" onclick="setRecordsPage(${recordsCurrentPage - 1})" ${recordsCurrentPage === 1 ? 'disabled' : ''}>${lang === 'en' ? 'Previous' : lang === 'ar' ? 'السابق' : 'پچھلا'}</button>
                <span>${recordsCurrentPage} / ${totalPages}</span>
                <button type="button" class="btn btn-o btn-sm" onclick="setRecordsPage(${recordsCurrentPage + 1})" ${recordsCurrentPage === totalPages ? 'disabled' : ''}>${lang === 'en' ? 'Next' : lang === 'ar' ? 'التالي' : 'اگلا'}</button>
            </div>
        </div>` : ''}
    </div>`;

    out.innerHTML = html;
}

function filterRecords() {
    captureRecordsColumnFilters();
    recordsCurrentPage = 1;
    saveFilterState();
    applyRecordFilters();
}

function normalizeRecordFilterValue(value) {
    return String(value ?? '').trim().toLocaleLowerCase();
}

function applyRecordFilters() {
    const from = document.getElementById('f-from') ? document.getElementById('f-from').value : '';
    const to = document.getElementById('f-to') ? document.getElementById('f-to').value : '';
    const party = document.getElementById('f-party') ? document.getElementById('f-party').value : '';
    const sector = document.getElementById('f-sector') ? document.getElementById('f-sector').value : '';
    const search = normalizeRecordFilterValue(document.getElementById('f-search')?.value);

    let rows = [...records];
    if (from) rows = rows.filter(r => String(r.date || '') >= from);
    if (to) rows = rows.filter(r => String(r.date || '') <= to);
    if (party) rows = rows.filter(r => normalizeRecordFilterValue(r.party) === normalizeRecordFilterValue(party));
    if (sector) rows = rows.filter(r => normalizeRecordFilterValue(r.sector) === normalizeRecordFilterValue(sector));
    if (search) {
        rows = rows.filter(r => [r.voucher, r.party, r.sector, r.transport, r.flightNo, r.notes, r.date]
            .some(value => normalizeRecordFilterValue(value).includes(search)));
    }
    const activeColumnFilters = Object.entries(recordsColumnFilters)
        .filter(([, value]) => value)
        .map(([key, value]) => [key, value.toLowerCase().trim()]);
    if (activeColumnFilters.length) {
        rows = rows.filter(record => activeColumnFilters.every(([key, value]) =>
            getRecordColumnValue(record, key).includes(value)
        ));
    }
    renderRecords(rows);
}

function clearFilter() {
    ['f-from', 'f-to', 'f-party', 'f-sector', 'f-search'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });
    document.querySelectorAll('.col-filter').forEach(inp => inp.value = '');
    recordsColumnFilters = {};
    recordsCurrentPage = 1;
    saveFilterState();
    applyRecordFilters();
}

function saveRecordsFilterState() {
    captureRecordsColumnFilters();
    saveFilterState();
}

function captureRecordsColumnFilters() {
    const filterRow = document.getElementById('records-filter-row');
    if (!filterRow) return;
    filterRow.querySelectorAll('[data-filter-key]').forEach(cell => {
        const input = cell.querySelector('.col-filter');
        if (input) recordsColumnFilters[cell.dataset.filterKey] = input.value.toLowerCase().trim();
    });
}

function getRecordColumnValue(record, key) {
    const sharing = record.mode === 'sharing' || isSharing(record.transport);
    const values = {
        voucher: record.voucher || '',
        date: `${record.date || ''} ${typeof fd === 'function' ? fd(record.date) : ''}`,
        party: record.party || '',
        sector: record.sector || '',
        transport: record.transport || '',
        count: sharing ? record.count : '—',
        fare: sharing ? (typeof sar === 'function' ? sar(record.fare) : String(record.fare || '')) : '—',
        flight: record.flightNo || '—',
        total: typeof sar === 'function' ? sar(record.total) : String(record.total || '')
    };
    return String(values[key] || '').toLowerCase();
}

function escapeRecordsAttribute(value) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

function setRecordsPage(page) {
    recordsCurrentPage = page;
    saveFilterState();
    applyRecordFilters();
}

function setRecordsPageSize(size) {
    const parsedSize = Number(size);
    if (parsedSize !== 25 && parsedSize !== 50) return;
    recordsPageSize = parsedSize;
    recordsCurrentPage = 1;
    saveFilterState();
    applyRecordFilters();
}

async function deleteRecord(id) {
    if (typeof canDo === 'function' && !canDo('delete')) {
        alert(T[lang]?.noDelPerm || 'آپ کو ریکارڈ حذف کرنے کی اجازت نہیں ہے');
        return;
    }
    const L = T[lang] || T.ur;
    if (!(await verifyPassword(L.confirmDel || "کیا آپ واقعی یہ ریکارڈ حذف کرنا چاہتے ہیں؟"))) return;
    const rec = records.find(x => x.id === id);
    if (!rec) return;

    deletedRecords = deletedRecords || [];
    deletedRecords.push({ ...rec, deletedAt: new Date().toISOString() });
    records = records.filter(x => x.id !== id);
    svR();
    svDR();
    filterRecords();
}

function renderTrash() {
    const L = T[lang] || T.ur;
    const out = document.getElementById('rec-output');
    const trashCount = (deletedRecords || []).length;
    const canEdit = (typeof canDo === 'function') ? canDo('edit') : true;

    const trashTabsHtml = `
    <div class="rec-subtabs no-print">
        <button onclick="switchRecordsTab('pending')" class="rec-subtab-btn">${lang === 'en' ? 'Pending' : 'زیر التواء'}</button>
        <button onclick="switchRecordsTab('checked')" class="rec-subtab-btn">${lang === 'en' ? 'Checked' : 'تصدیق شدہ'}</button>
        <button onclick="switchRecordsTab('all')" class="rec-subtab-btn">${lang === 'en' ? 'All Records' : 'تمام ریکارڈ'}</button>
        <button onclick="switchRecordsTab('trash')" class="rec-subtab-btn active-trash">
            ${lang === 'en' ? 'Trash' : 'حذف شدہ'}${trashCount > 0 ? ` <span class="rec-trash-pill">${trashCount}</span>` : ''}
        </button>
    </div>`;

    if (!trashCount) {
        out.innerHTML = trashTabsHtml + `<div class="card records-trash-card"><div class="empty"><div class="empty-icon"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg></div><div>${lang === 'en' ? 'Trash is empty' : 'ٹریش خالی ہے'}</div></div></div>`;
        return;
    }

    const sorted = [...deletedRecords].sort((a, b) => (b.deletedAt || '').localeCompare(a.deletedAt || ''));

    const rows = sorted.map(r => `
        <tr>
            <td><span class="voucher-tag tag-deleted">${r.voucher || '—'}</span></td>
            <td>${fd(r.date)}</td>
            <td><strong>${r.party}</strong></td>
            <td><span class="badge">${r.sector}</span></td>
            <td>${r.transport || '—'}</td>
            <td style="text-align:center;">${r.count || '—'}</td>
            <td style="text-align:right;"><strong class="total-col">${sar(r.total)}</strong></td>
            <td style="font-size:11px;color:var(--text-muted);">${r.deletedAt ? new Date(r.deletedAt).toLocaleString('ur-PK') : '—'}</td>
            <td class="no-print rec-actions-cell">
                <div class="rec-action-buttons" style="display:inline-flex;gap:6px;align-items:center;">
                    ${canEdit ? `<button class="btn btn-sm btn-o" onclick="openEditRecordModal('${r.id}')" title="${L.edit || (lang === 'en' ? 'Edit' : 'ترمیم')}">${L.edit || (lang === 'en' ? 'Edit' : 'ترمیم')}</button>` : ''}
                    <button class="btn btn-sm btn-p" onclick="restoreRecord('${r.id}')" title="${lang === 'en' ? 'Restore' : 'بحال کریں'}">${lang === 'en' ? 'Restore' : 'بحال کریں'}</button>
                </div>
            </td>
        </tr>
    `).join('');

    out.innerHTML = trashTabsHtml + `
    <div class="card records-trash-card">
        <div class="rec-header-bar trash-bar">
            <span class="rec-header-title">${lang === 'en' ? 'Deleted Records' : 'حذف شدہ ریکارڈ'} (${trashCount})</span>
        </div>
        <div class="tbl-wrap">
        <table>
            <thead>
                <tr>
                    <th>${L.voucherCol}</th><th>${L.dateCol}</th><th>${L.partyCol}</th><th>${L.sectorCol}</th>
                    <th>${L.transportCol}</th><th style="text-align:center;">${L.hujjajCol}</th>
                    <th style="text-align:right;">${L.totalCol}</th><th>${lang === 'en' ? 'Deleted At' : 'حذف کی تاریخ'}</th><th>${L.actionCol}</th>
                </tr>
            </thead>
            <tbody>${rows}</tbody>
        </table>
        </div>
    </div>`;
}

async function restoreRecord(id) {
    const L = T[lang] || T.ur;
    const rec = (deletedRecords || []).find(x => x.id === id);
    if (!rec) return;
    const { deletedAt, ...restored } = rec;
    records.push(restored);
    deletedRecords = deletedRecords.filter(x => x.id !== id);
    svR(); svDR();
    renderTrash();
    al('al-entry', `واوچر ${rec.voucher || ''} بحال ہوگیا`, 'ok');
}

function filterTableColumns() {
    const activeInput = document.activeElement;
    const filterKey = activeInput?.closest('[data-filter-key]')?.dataset.filterKey;
    const selectionStart = activeInput?.selectionStart;
    const selectionEnd = activeInput?.selectionEnd;
    captureRecordsColumnFilters();
    recordsCurrentPage = 1;
    saveFilterState();
    applyRecordFilters();

    if (filterKey) {
        const restoredInput = document.querySelector(`#records-filter-row [data-filter-key="${filterKey}"] .col-filter`);
        if (restoredInput) {
            restoredInput.focus();
            if (selectionStart !== null && selectionEnd !== null) {
                restoredInput.setSelectionRange(selectionStart, selectionEnd);
            }
        }
    }
}

let _copySourceId = null;

function copyVoucher(id) {
    const r = records.find(x => x.id === id);
    if (!r) return;
    _copySourceId = id;

    document.getElementById('copy-modal-voucher-label').textContent = `واوچر: ${r.voucher || '—'}  |  پارٹی: ${r.party}`;
    document.getElementById('copy-modal-info').innerHTML =
        `<span style="margin-inline-end:16px;"><strong>${lang === 'en' ? 'Date:' : 'تاریخ:'}</strong> ${fd(r.date)}</span>` +
        `<span style="margin-inline-end:16px;"><strong>${lang === 'en' ? 'Sector:' : 'سیکٹر:'}</strong> ${r.sector}</span>` +
        `<span style="margin-inline-end:16px;"><strong>${lang === 'en' ? 'Transport:' : 'ٹرانسپورٹ:'}</strong> ${r.transport || '—'}</span>` +
        `<span style="margin-inline-end:16px;"><strong>${lang === 'en' ? 'Pilgrims:' : 'حجاج:'}</strong> ${r.count || 0}</span>` +
        `<span style="margin-inline-end:16px;"><strong>${lang === 'en' ? 'Fare:' : 'کرایہ:'}</strong> ${sar(r.fare || 0)}</span>`;

    document.getElementById('copy-date').value = today();

    document.getElementById('copy-sector').innerHTML = sectors.map(s => `<option value="${s}" ${s === r.sector ? 'selected' : ''}>${s}</option>`).join('');
    document.getElementById('copy-transport').innerHTML = transports.map(t => `<option value="${t}" ${t === r.transport ? 'selected' : ''}>${t}</option>`).join('');

    document.getElementById('copy-fare').value = r.fare || 0;
    document.getElementById('copy-count').value = r.count || 0;
    document.getElementById('al-copy').innerHTML = '';

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

    const newDate = document.getElementById('copy-date').value;
    const newSector = document.getElementById('copy-sector').value;
    const newTrans = document.getElementById('copy-transport').value;
    const newFare = parseFloat(document.getElementById('copy-fare').value) || 0;
    const newCount = parseInt(document.getElementById('copy-count').value) || 0;

    if (!newDate || !newSector || !newTrans) {
        al('al-copy', 'تاریخ، سیکٹر اور ٹرانسپورٹ ضروری ہیں', 'er');
        return;
    }

    const calcCount = newCount < 1 ? 1 : newCount;
    const newTotal = Math.round(calcCount * newFare);

    const newRecord = {
        ...src,
        id: uid(),
        date: newDate,
        sector: newSector,
        transport: newTrans,
        fare: newFare,
        count: newCount,
        total: newTotal,
        vehicleTotal: newTotal,
        checked: false,
    };

    records.push(newRecord);
    svR();
    closeCopyModal();
    currentRecordsTab = 'pending';
    filterRecords();
    al('al-entry', `واوچر ${newRecord.voucher} کا ڈپلیکیٹ بن گیا — ${newSector}`, 'ok');
}

// ── EDIT RECORD MODAL (IN-PLACE MODAL FOR TRANSPORT RECORDS) ──
let _editingRecordIsTrash = false;

function openEditRecordModal(id) {
    if (typeof canDo === 'function' && !canDo('edit')) {
        const msg = (typeof T !== 'undefined' && T[lang]?.noEditPerm) || 'آپ کو ریکارڈ میں تبدیلی کی اجازت نہیں ہے';
        alert(msg);
        return;
    }
    let r = (typeof records !== 'undefined') ? records.find(x => x.id === id) : null;
    let isTrash = false;
    if (!r && typeof deletedRecords !== 'undefined' && Array.isArray(deletedRecords)) {
        r = deletedRecords.find(x => x.id === id);
        if (r) isTrash = true;
    }
    if (!r) return;

    _editingRecordIsTrash = isTrash;

    const modal = document.getElementById('edit-record-modal');
    if (!modal) return;

    // Set hidden ID
    const idEl = document.getElementById('edit-rec-id');
    if (idEl) idEl.value = id;

    // Header badge & title
    const vBadge = document.getElementById('edit-rec-modal-voucher-badge');
    const trashBadge = isTrash
        ? ` <span class="badge" style="background:#dc2626;color:#fff;font-size:11px;padding:2px 8px;border-radius:6px;margin-inline-start:6px;">${lang === 'en' ? 'Trash Record' : 'حذف شدہ ریکارڈ'}</span>`
        : '';
    if (vBadge) {
        vBadge.innerHTML = `${lang === 'en' ? 'Voucher:' : 'واوچر:'} ${r.voucher || '—'}${trashBadge}`;
    }
    const pBadge = document.getElementById('edit-rec-modal-party-badge');
    if (pBadge) pBadge.textContent = r.party ? `|  ${r.party}` : '';

    const saveRestoreBtn = document.getElementById('btn-save-restore-edit-rec');
    if (saveRestoreBtn) {
        saveRestoreBtn.style.display = isTrash ? 'inline-flex' : 'none';
    }

    // Date & Voucher
    const dateEl = document.getElementById('edit-rec-date');
    if (dateEl) dateEl.value = r.date || '';
    const vchEl = document.getElementById('edit-rec-voucher');
    if (vchEl) vchEl.value = r.voucher || '';

    // Transporter select
    const partyEl = document.getElementById('edit-rec-party');
    if (partyEl) {
        const allP = Array.from(new Set([...(typeof parties !== 'undefined' ? parties : []), r.party].filter(Boolean)));
        partyEl.innerHTML = '<option value="">-- منتخب کریں --</option>' + 
            allP.map(p => `<option value="${p}" ${p === r.party ? 'selected' : ''}>${p}</option>`).join('');
    }

    // Haji Party select
    const newPartyEl = document.getElementById('edit-rec-new-party');
    if (newPartyEl) {
        const baseList = (typeof DEFAULT_HAJI_PARTIES !== 'undefined' && Array.isArray(DEFAULT_HAJI_PARTIES)) ? DEFAULT_HAJI_PARTIES : [
            'القریشی ٹورز', 'الرحمان ٹریولز', 'الحرمین ٹورز اینڈ ٹریولز', 'ضیوف الرحمن گروپ',
            'المروہ ٹریولز', 'الصفا عمرہ گروپ', 'کاروان فیصل', 'کاروان مدینہ',
            'لبیک ٹورز اینڈ ٹریولز', 'باب الحرم ٹریولز', 'نور الہدیٰ ٹورز', 'قافلہ حرمین'
        ];
        const allHp = Array.from(new Set([
            ...baseList,
            ...(typeof hajiParties !== 'undefined' ? hajiParties : []),
            ...(typeof records !== 'undefined' ? records.map(x => x.newParty) : []),
            ...(typeof deletedRecords !== 'undefined' ? deletedRecords.map(x => x.newParty) : []),
            r.newParty
        ].filter(Boolean)));
        allHp.sort((a, b) => a.localeCompare(b, 'ur'));

        newPartyEl.innerHTML = '<option value="">-- منتخب کریں --</option>' + 
            allHp.map(hp => `<option value="${hp}" ${hp === (r.newParty || '') ? 'selected' : ''}>${hp}</option>`).join('') +
            '<option value="__custom__">➕ نیا درج کریں... (Add New)</option>';
        newPartyEl.value = r.newParty || '';
    }

    // Sector select
    const sectorEl = document.getElementById('edit-rec-sector');
    if (sectorEl) {
        const allSec = Array.from(new Set([...(typeof sectors !== 'undefined' ? sectors : []), r.sector].filter(Boolean)));
        sectorEl.innerHTML = '<option value="">-- منتخب کریں --</option>' +
            allSec.map(s => `<option value="${s}" ${s === r.sector ? 'selected' : ''}>${s}</option>`).join('');
    }

    // Transport select
    const trEl = document.getElementById('edit-rec-transport');
    if (trEl) {
        const allTr = Array.from(new Set([...(typeof transports !== 'undefined' ? transports : []), r.transport].filter(Boolean)));
        trEl.innerHTML = '<option value="">-- منتخب کریں --</option>' +
            allTr.map(t => `<option value="${t}" ${t === r.transport ? 'selected' : ''}>${t}</option>`).join('');
    }

    // Count, Fare
    const countEl = document.getElementById('edit-rec-count');
    if (countEl) countEl.value = (r.count !== undefined && r.count !== null) ? r.count : 0;
    const fareEl = document.getElementById('edit-rec-fare');
    if (fareEl) fareEl.value = (r.fare !== undefined && r.fare !== null) ? r.fare : 0;

    // Flight Details
    const nameEl = document.getElementById('edit-rec-name');
    if (nameEl) nameEl.value = r.name || '';
    const ftEl = document.getElementById('edit-rec-flight-time');
    if (ftEl) ftEl.value = r.flightTime || '';
    const fnEl = document.getElementById('edit-rec-flight-no');
    if (fnEl) fnEl.value = r.flightNo || '';
    const apEl = document.getElementById('edit-rec-airport');
    if (apEl) apEl.value = r.airport || '';

    // Transport Nature
    const natureEl = document.getElementById('edit-rec-nature');
    if (natureEl) {
        const defaultNatures = ['Jed Arrival', 'MED Arrival', 'Makkah to Madina', 'Madina TO Makha', 'Jeddah Depture', 'Madina Depture'];
        const baseNatures = (typeof transportNatures !== 'undefined' && Array.isArray(transportNatures) && transportNatures.length) ? transportNatures : defaultNatures;
        const allNatures = Array.from(new Set([...baseNatures, ...(typeof records !== 'undefined' ? records.map(x => x.transportNature) : []), r.transportNature].filter(Boolean)));
        natureEl.innerHTML = '<option value="">-- منتخب کریں --</option>' +
            allNatures.map(n => `<option value="${n}" ${n === r.transportNature ? 'selected' : ''}>${n}</option>`).join('');
    }

    if (typeof fillAirportDatalist === 'function') fillAirportDatalist();
    if (typeof fillShirkaDatalist === 'function') fillShirkaDatalist();

    // Shirka
    const shEl = document.getElementById('edit-rec-shirka');
    if (shEl) shEl.value = r.shirka || '';

    const grEl = document.getElementById('edit-rec-group');
    if (grEl) grEl.value = r.group || '';
    const mbEl = document.getElementById('edit-rec-mobile');
    if (mbEl) mbEl.value = r.mobile || '';

    // Flight Section toggle
    const hasFlightData = !!(r.name || r.flightTime || r.flightNo || r.airport || r.transportNature || r.shirka || r.group || r.mobile);
    const cbFlight = document.getElementById('edit-rec-show-flight');
    const secFlight = document.getElementById('edit-rec-flight-section');
    if (cbFlight) cbFlight.checked = hasFlightData;
    if (secFlight) secFlight.style.display = hasFlightData ? 'block' : 'none';

    // Notes
    const notesEl = document.getElementById('edit-rec-notes');
    if (notesEl) notesEl.value = r.notes || '';

    // Calculate total
    calcEditRecordTotal();

    // Reset alert
    const alEl = document.getElementById('al-edit-record');
    if (alEl) alEl.innerHTML = '';

    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeEditRecordModal() {
    const modal = document.getElementById('edit-record-modal');
    if (modal) modal.classList.remove('open');
    const saveRestoreBtn = document.getElementById('btn-save-restore-edit-rec');
    if (saveRestoreBtn) saveRestoreBtn.style.display = 'none';
    _editingRecordIsTrash = false;
    document.body.style.overflow = '';
}

function saveAndRestoreRecordEditModal() {
    const editId = document.getElementById('edit-rec-id')?.value;
    saveRecordEditModal();
    if (editId) {
        restoreRecord(editId);
    }
}

function toggleEditFlightDetails() {
    const cb = document.getElementById('edit-rec-show-flight');
    const sec = document.getElementById('edit-rec-flight-section');
    if (cb && sec) {
        sec.style.display = cb.checked ? 'block' : 'none';
    }
}

function calcEditRecordTotal() {
    const transportVal = document.getElementById('edit-rec-transport')?.value || '';
    const sectorVal = document.getElementById('edit-rec-sector')?.value || '';
    const isPerPilgrim = typeof isEconomyBus === 'function' 
        ? isEconomyBus(transportVal, sectorVal) 
        : /economy.*bus|bus.*economy|شیئرنگ|sharing|مشترك|بس|bus/i.test((transportVal + ' ' + sectorVal).trim());

    const countEl = document.getElementById('edit-rec-count');
    const fareEl = document.getElementById('edit-rec-fare');
    const totalEl = document.getElementById('edit-rec-total');
    const lblFare = document.getElementById('lbl-edit-rec-fare');

    if (lblFare) {
        lblFare.textContent = isPerPilgrim 
            ? (lang === 'en' ? 'Fare per Pilgrim (SAR)' : 'فی حاجی کرایہ (SAR)')
            : (lang === 'en' ? 'Vehicle Fare (SAR)' : 'گاڑی کا کرایہ (SAR)');
    }

    let c = parseInt(countEl?.value);
    if (isNaN(c) || c < 1) c = 1;
    let f = parseFloat(fareEl?.value) || 0;

    if (totalEl) {
        totalEl.value = isPerPilgrim ? Math.round(c * f) : Math.round(f);
    }
}

function saveRecordEditModal() {
    const editId = document.getElementById('edit-rec-id')?.value;
    if (!editId) return;

    if (typeof canDo === 'function' && !canDo('edit')) {
        alert((typeof T !== 'undefined' && T[lang]?.noEditPerm) || 'آپ کو ریکارڈ میں تبدیلی کی اجازت نہیں ہے');
        return;
    }

    const date = document.getElementById('edit-rec-date')?.value || '';
    const voucher = document.getElementById('edit-rec-voucher')?.value?.trim() || '';
    const party = document.getElementById('edit-rec-party')?.value || '';
    let newParty = document.getElementById('edit-rec-new-party')?.value?.trim() || '';
    if (newParty === '__custom__') newParty = '';
    const sector = document.getElementById('edit-rec-sector')?.value || '';
    const transport = document.getElementById('edit-rec-transport')?.value || '';

    if (!date || !party || !sector || !transport) {
        const alEl = document.getElementById('al-edit-record');
        if (alEl) {
            alEl.innerHTML = `<div class="al er" style="padding:10px 14px;border-radius:8px;margin-bottom:8px;background:rgba(220,38,38,0.1);color:#dc2626;border:1px solid rgba(220,38,38,0.25);font-size:13px;font-weight:600;">${lang === 'en' ? 'Please fill all required fields (Date, Transporter, Sector, Transport)' : 'تمام ضروری فیلڈز (تاریخ، ٹرانسپورٹر، سیکٹر، ٹرانسپورٹ) منتخب کریں'}</div>`;
        }
        return;
    }

    let countInput = parseInt(document.getElementById('edit-rec-count')?.value);
    let count = isNaN(countInput) ? 0 : countInput;
    let calcCount = count < 1 ? 1 : count;
    let fare = parseFloat(document.getElementById('edit-rec-fare')?.value) || 0;

    const isPerPilgrim = typeof isEconomyBus === 'function' 
        ? isEconomyBus(transport, sector) 
        : /economy.*bus|bus.*economy|شیئرنگ|sharing|مشترك|بس|bus/i.test((transport + ' ' + sector).trim());

    let total = isPerPilgrim ? Math.round(calcCount * fare) : Math.round(fare);
    let mode = isPerPilgrim ? 'sharing' : 'vehicle';
    let vehicleTotal = total;

    const name = document.getElementById('edit-rec-name')?.value?.trim() || '';
    const flightTime = document.getElementById('edit-rec-flight-time')?.value || '';
    const flightNo = document.getElementById('edit-rec-flight-no')?.value?.trim() || '';
    const airport = document.getElementById('edit-rec-airport')?.value?.trim() || '';
    const transportNature = document.getElementById('edit-rec-nature')?.value || '';
    const shirka = document.getElementById('edit-rec-shirka')?.value?.trim() || '';
    const group = document.getElementById('edit-rec-group')?.value?.trim() || '';
    const mobile = document.getElementById('edit-rec-mobile')?.value?.trim() || '';
    const notes = document.getElementById('edit-rec-notes')?.value?.trim() || '';

    const isTrash = _editingRecordIsTrash || (typeof deletedRecords !== 'undefined' && deletedRecords && deletedRecords.some(r => r.id === editId));

    if (isTrash) {
        const dIdx = deletedRecords.findIndex(r => r.id === editId);
        if (dIdx !== -1) {
            deletedRecords[dIdx] = {
                ...deletedRecords[dIdx],
                voucher: voucher || deletedRecords[dIdx].voucher,
                date,
                party,
                newParty,
                sector,
                transport,
                mode,
                count,
                fare,
                vehicleTotal,
                total,
                notes,
                name,
                flightTime,
                flightNo,
                airport,
                transportNature,
                shirka,
                group,
                mobile
            };
        }
        if (typeof svDR === 'function') svDR();
    } else {
        const idx = records.findIndex(r => r.id === editId);
        if (idx !== -1) {
            records[idx] = {
                ...records[idx],
                voucher: voucher || records[idx].voucher,
                date,
                party,
                newParty,
                sector,
                transport,
                mode,
                count,
                fare,
                vehicleTotal,
                total,
                notes,
                name,
                flightTime,
                flightNo,
                airport,
                transportNature,
                shirka,
                group,
                mobile
            };
        }
        if (typeof svR === 'function') svR();
    }

    if (newParty && typeof hajiParties !== 'undefined' && Array.isArray(hajiParties)) {
        if (!hajiParties.includes(newParty)) {
            hajiParties.push(newParty);
            if (typeof svHP === 'function') svHP();
        }
    }
    if (typeof todayStats === 'function') todayStats();
    if (typeof refreshAllDrops === 'function') refreshAllDrops();

    closeEditRecordModal();

    // Re-render records if on records page
    if (currentRecordsTab === 'trash') {
        if (typeof renderTrash === 'function') {
            renderTrash();
        }
    } else {
        if (typeof filterRecords === 'function') {
            filterRecords();
        }
    }
    // Also re-render daily-note if on daily note page
    if (typeof renderDailyNoteTable === 'function') {
        renderDailyNoteTable();
    }

    if (typeof al === 'function') {
        al('al-entry', (typeof T !== 'undefined' && T[lang]?.updOk) || 'ریکارڈ کامیابی سے اپڈیٹ ہو گیا', 'ok');
    }
}

function getFilteredRecordsForExport() {
    const from = document.getElementById('f-from') ? document.getElementById('f-from').value : '';
    const to = document.getElementById('f-to') ? document.getElementById('f-to').value : '';
    const party = document.getElementById('f-party') ? document.getElementById('f-party').value : '';
    const sector = document.getElementById('f-sector') ? document.getElementById('f-sector').value : '';
    const search = normalizeRecordFilterValue(document.getElementById('f-search')?.value);

    let rows = (currentRecordsTab === 'trash') ? [...(deletedRecords || [])] : [...records];
    if (from) rows = rows.filter(r => String(r.date || '') >= from);
    if (to) rows = rows.filter(r => String(r.date || '') <= to);
    if (party) rows = rows.filter(r => normalizeRecordFilterValue(r.party) === normalizeRecordFilterValue(party));
    if (sector) rows = rows.filter(r => normalizeRecordFilterValue(r.sector) === normalizeRecordFilterValue(sector));
    if (search) {
        rows = rows.filter(r => [r.voucher, r.party, r.newParty, r.sector, r.transport, r.flightNo, r.notes, r.date, r.name, r.group]
            .some(value => normalizeRecordFilterValue(value).includes(search)));
    }
    const activeColumnFilters = Object.entries(recordsColumnFilters || {})
        .filter(([, value]) => value)
        .map(([key, value]) => [key, value.toLowerCase().trim()]);
    if (activeColumnFilters.length) {
        rows = rows.filter(record => activeColumnFilters.every(([key, value]) =>
            getRecordColumnValue(record, key).includes(value)
        ));
    }

    if (currentRecordsTab === 'checked') {
        rows = rows.filter(r => r.checked);
    } else if (currentRecordsTab === 'pending') {
        rows = rows.filter(r => !r.checked);
    }

    return rows.sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')));
}

function exportRecordsToExcel() {
    const L = (typeof T !== 'undefined' && T[lang]) ? T[lang] : {};
    const rows = getFilteredRecordsForExport();

    if (!rows.length) {
        if (typeof al === 'function') {
            al('al-entry', L.noRec || 'کوئی ریکارڈ موجود نہیں', 'er');
        } else {
            alert(L.noRec || 'کوئی ریکارڈ موجود نہیں');
        }
        return;
    }

    const tabName = currentRecordsTab === 'all' 
        ? (lang === 'en' ? 'All' : lang === 'ar' ? 'الكل' : 'تمام')
        : currentRecordsTab === 'checked' 
            ? (lang === 'en' ? 'Checked' : lang === 'ar' ? 'تم التدقيق' : 'تصدیق شدہ')
            : currentRecordsTab === 'trash'
                ? (lang === 'en' ? 'Trash' : lang === 'ar' ? 'المحذوفة' : 'حذف شدہ')
                : (lang === 'en' ? 'Pending' : lang === 'ar' ? 'قيد الانتظار' : 'زیر التواء');

    const dateStamp = today().replace(/-/g, '');

    if (typeof XLSX !== 'undefined') {
        const thinBorder = {
            top: { style: 'thin', color: { rgb: 'D0D7DE' } },
            bottom: { style: 'thin', color: { rgb: 'D0D7DE' } },
            left: { style: 'thin', color: { rgb: 'D0D7DE' } },
            right: { style: 'thin', color: { rgb: 'D0D7DE' } }
        };

        const S = {
            title: { 
                font: { bold: true, sz: 15, color: { rgb: 'FFFFFF' } }, 
                fill: { fgColor: { rgb: '054D28' }, patternType: 'solid' }, 
                alignment: { horizontal: 'center', vertical: 'center' } 
            },
            sub: { 
                font: { sz: 10, color: { rgb: '333333' }, bold: true },
                alignment: { vertical: 'center' }
            },
            colHead: { 
                font: { bold: true, sz: 11, color: { rgb: 'FFFFFF' } }, 
                fill: { fgColor: { rgb: 'C9940A' }, patternType: 'solid' }, 
                alignment: { horizontal: 'center', vertical: 'center' }, 
                border: thinBorder 
            },
            dataRow: { border: thinBorder, alignment: { vertical: 'center' } },
            dataRowCenter: { border: thinBorder, alignment: { horizontal: 'center', vertical: 'center' } },
            dataRowRight: { border: thinBorder, alignment: { horizontal: 'right', vertical: 'center' } },
            grandTotal: { 
                font: { bold: true, sz: 11, color: { rgb: 'FFFFFF' } }, 
                fill: { fgColor: { rgb: '054D28' }, patternType: 'solid' }, 
                border: thinBorder,
                alignment: { vertical: 'center' }
            },
            grandTotalRight: { 
                font: { bold: true, sz: 11, color: { rgb: 'FFFFFF' } }, 
                fill: { fgColor: { rgb: '054D28' }, patternType: 'solid' }, 
                border: thinBorder,
                alignment: { horizontal: 'right', vertical: 'center' }
            },
            grandTotalCenter: { 
                font: { bold: true, sz: 11, color: { rgb: 'FFFFFF' } }, 
                fill: { fgColor: { rgb: '054D28' }, patternType: 'solid' }, 
                border: thinBorder,
                alignment: { horizontal: 'center', vertical: 'center' }
            }
        };

        const cell = (v, styleKey, type) => ({
            v: v ?? '',
            t: type || (typeof v === 'number' ? 'n' : 's'),
            s: styleKey ? S[styleKey] : undefined
        });

        const sheetRows = [];
        const merges = [];
        const addRow = (cells) => { sheetRows.push(cells); };

        const headers = [
            'واوچر نمبر (Voucher)',
            'تاریخ (Date)',
            'پارٹی / ٹرانسپورٹر (Party)',
            'حاجی پارٹی / کلائنٹ (Client)',
            'سیکٹر (Sector)',
            'ٹرانسپورٹ گاڑی (Transport)',
            'حجاج تعداد (Pilgrims)',
            'کرایہ فی کس (Fare SAR)',
            'کل رقم (Total SAR)',
            'فلائٹ نمبر (Flight No)',
            'فلائٹ وقت (Flight Time)',
            'ایئرپورٹ (Airport)',
            'نوعیت (Nature)',
            'شرکہ / کمپنی (Shirka)',
            'گروپ نمبر (Group)',
            'مسافر نام (Passenger)',
            'موبائل (Mobile)',
            'اسٹیٹس (Status)',
            'نوٹس (Notes)'
        ];

        const numCols = headers.length;

        addRow([cell('Umrah Transport Management System — تمام ریکارڈز (Transport Records)', 'title')]);
        merges.push({ s: { r: sheetRows.length - 1, c: 0 }, e: { r: sheetRows.length - 1, c: numCols - 1 } });

        const metaStr = `اسٹیٹس: ${tabName} | کل ریکارڈز: ${rows.length} | ڈاؤنلوڈ تاریخ: ${fd(today())}`;
        addRow([cell(metaStr, 'sub')]);
        merges.push({ s: { r: sheetRows.length - 1, c: 0 }, e: { r: sheetRows.length - 1, c: numCols - 1 } });

        addRow([cell('')]);
        addRow(headers.map(h => cell(h, 'colHead')));

        let totalHujjaj = 0;
        let totalAmount = 0;

        rows.forEach(r => {
            const sharing = r.mode === 'sharing' || isSharing(r.transport);
            const count = sharing ? (Number(r.count) || 0) : 0;
            const fare = Number(r.fare) || 0;
            const total = Number(r.total) || 0;
            totalHujjaj += count;
            totalAmount += total;

            const status = r.checked ? 'مکمل (Checked)' : 'زیر التواء (Pending)';

            addRow([
                cell(r.voucher || '—', 'dataRowCenter'),
                cell(r.date ? fd(r.date) : '—', 'dataRowCenter'),
                cell(r.party || '—', 'dataRow'),
                cell(r.newParty || '—', 'dataRow'),
                cell(r.sector || '—', 'dataRowCenter'),
                cell(r.transport || '—', 'dataRowCenter'),
                cell(sharing ? count : '—', 'dataRowCenter', sharing ? 'n' : 's'),
                cell(sharing ? fare : '—', 'dataRowRight', sharing ? 'n' : 's'),
                cell(total, 'dataRowRight', 'n'),
                cell(r.flightNo || '—', 'dataRowCenter'),
                cell(r.flightTime || '—', 'dataRowCenter'),
                cell(r.airport || '—', 'dataRowCenter'),
                cell(r.transportNature || '—', 'dataRowCenter'),
                cell(r.shirka || '—', 'dataRow'),
                cell(r.group || '—', 'dataRowCenter'),
                cell(r.name || '—', 'dataRow'),
                cell(r.mobile || '—', 'dataRowCenter'),
                cell(status, 'dataRowCenter'),
                cell(r.notes || '', 'dataRow')
            ]);
        });

        addRow([cell('')]);

        addRow([
            cell('مجموعی ٹوٹل (Grand Total)', 'grandTotal'),
            cell('', 'grandTotal'), cell('', 'grandTotal'), cell('', 'grandTotal'), cell('', 'grandTotal'), cell('', 'grandTotal'),
            cell(totalHujjaj, 'grandTotalCenter', 'n'),
            cell('', 'grandTotal'),
            cell(totalAmount, 'grandTotalRight', 'n'),
            cell('', 'grandTotal'), cell('', 'grandTotal'), cell('', 'grandTotal'), cell('', 'grandTotal'), cell('', 'grandTotal'),
            cell('', 'grandTotal'), cell('', 'grandTotal'), cell('', 'grandTotal'), cell('', 'grandTotal'), cell('', 'grandTotal')
        ]);
        merges.push({ s: { r: sheetRows.length - 1, c: 0 }, e: { r: sheetRows.length - 1, c: 5 } });

        const ws = XLSX.utils.aoa_to_sheet(sheetRows.map(row => row.map(c => c.v)));

        sheetRows.forEach((row, rIdx) => {
            row.forEach((c, cIdx) => {
                if (c.s) {
                    const ref = XLSX.utils.encode_cell({ r: rIdx, c: cIdx });
                    if (ws[ref]) ws[ref].s = c.s;
                }
            });
        });

        ws['!cols'] = [
            { wch: 14 }, { wch: 12 }, { wch: 22 }, { wch: 22 }, { wch: 16 },
            { wch: 16 }, { wch: 12 }, { wch: 12 }, { wch: 14 }, { wch: 14 },
            { wch: 12 }, { wch: 14 }, { wch: 14 }, { wch: 16 }, { wch: 12 },
            { wch: 18 }, { wch: 15 }, { wch: 14 }, { wch: 24 }
        ];
        ws['!merges'] = merges;

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Records');
        XLSX.writeFile(wb, `UmrahTransport_Records_${tabName}_${dateStamp}.xlsx`);

        if (typeof al === 'function') {
            al('al-entry', `Excel فائل ڈاؤنلوڈ ہوگئی — ${rows.length} ریکارڈز`, 'ok');
        }
        return;
    }

    // Fallback to CSV if XLSX not available
    const headers = ['واوچر نمبر', 'تاریخ', 'پارٹی', 'سیکٹر', 'ٹرانسپورٹ', 'حجاج تعداد', 'کرایہ فی کس (SAR)', 'فلائٹ نمبر', 'کل رقم (SAR)', 'اسٹیٹس'];
    const csvRows = [headers.join(',')];
    let totalHujjaj = 0, totalAmount = 0;

    rows.forEach(r => {
        const sharing = r.mode === 'sharing' || isSharing(r.transport);
        const count = sharing ? (r.count || 0) : 0;
        const fare = sharing ? (r.fare || 0) : 0;
        if (sharing) totalHujjaj += count;
        totalAmount += (r.total || 0);

        const status = r.checked ? 'مکمل (Checked)' : 'باقی (Pending)';
        const esc = v => `"${String(v ?? '').replace(/"/g, '""')}"`;

        csvRows.push([
            esc(r.voucher || ''), esc(fd(r.date)), esc(r.party || ''), esc(r.sector || ''),
            esc(r.transport || ''), esc(sharing ? count : ''), esc(sharing ? fare : ''),
            esc(r.flightNo || ''), esc(r.total || 0), esc(status)
        ].join(','));
    });

    csvRows.push('');
    csvRows.push(`"کل ریکارڈ:","${rows.length}"`);
    csvRows.push(`"کل حجاج:","${totalHujjaj}"`);
    csvRows.push(`"کل رقم (SAR):","${totalAmount}"`);
    csvRows.push(`"رپورٹ تاریخ:","${fd(today())}"`);

    const bom = '\uFEFF';
    const blob = new Blob([bom + csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `UmrahTransport_Records_${tabName}_${dateStamp}.csv`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);

    if (typeof al === 'function') {
        al('al-entry', `Excel فائل ڈاؤنلوڈ ہوگئی — ${rows.length} ریکارڈ`, 'ok');
    }
}

// ── EXCEL IMPORT FUNCTIONS ──
let _parsedImportRecords = [];

function openImportRecordsModal() {
    if (typeof canDo === 'function' && !canDo('entry')) {
        alert(T[lang]?.noEntryPerm || 'آپ کو نیا ریکارڈ شامل کرنے کی اجازت نہیں ہے');
        return;
    }
    const modal = document.getElementById('import-records-modal');
    if (!modal) return;
    _parsedImportRecords = [];
    const prevArea = document.getElementById('import-preview-area');
    if (prevArea) prevArea.style.display = 'none';
    const fileIn = document.getElementById('import-file-input');
    if (fileIn) fileIn.value = '';
    const btnConfirm = document.getElementById('btn-confirm-import-records');
    if (btnConfirm) btnConfirm.disabled = true;
    const alImp = document.getElementById('al-import-records');
    if (alImp) alImp.innerHTML = '';
    const zTitle = document.getElementById('import-zone-title');
    if (zTitle) zTitle.textContent = lang === 'en' ? 'Drop Excel or CSV file here or click to browse' : 'Excel یا CSV فائل یہاں ڈراپ کریں یا کلک کر کے منتخب کریں';
    const zSub = document.getElementById('import-zone-sub');
    if (zSub) zSub.textContent = 'فارمیٹس: .xlsx, .xls, .csv';

    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeImportRecordsModal() {
    const modal = document.getElementById('import-records-modal');
    if (modal) modal.classList.remove('open');
    _parsedImportRecords = [];
    document.body.style.overflow = '';
}

function downloadRecordsTemplate() {
    if (typeof XLSX === 'undefined') {
        alert('XLSX لائبریری دستیاب نہیں ہے');
        return;
    }

    const headers = [
        'واوچر نمبر (Voucher)',
        'تاریخ (YYYY-MM-DD)',
        'پارٹی / ٹرانسپورٹر (Party)',
        'حاجی پارٹی / کلائنٹ (Haji Party)',
        'سیکٹر (Sector)',
        'ٹرانسپورٹ گاڑی (Transport)',
        'حجاج تعداد (Pilgrims)',
        'کرایہ (Fare SAR)',
        'کل رقم (Total SAR)',
        'فلائٹ نمبر (Flight No)',
        'فلائٹ وقت (Flight Time)',
        'ایئرپورٹ (Airport)',
        'نوعیت (Nature)',
        'شرکہ / کمپنی (Shirka)',
        'گروپ نمبر (Group)',
        'مسافر نام (Name)',
        'موبائل (Mobile)',
        'اسٹیٹس (Checked/Pending)',
        'نوٹس (Notes)'
    ];

    const sample1 = [
        'VCH-1001',
        today(),
        (parties && parties[0]) || 'الشہباء ٹرانسپورٹ',
        (hajiParties && hajiParties[0]) || 'القریشی ٹورز',
        (sectors && sectors[0]) || 'Jed to Mak',
        (transports && transports[0]) || 'بس',
        45,
        120,
        5400,
        'SV-732',
        '14:30',
        'Jeddah',
        'Arrival',
        (shirkas && shirkas[0]) || 'الرواد',
        'G-101',
        'محمد علی',
        '+966501234567',
        'Pending',
        'پہلی آمد - VIP گروپ'
    ];

    const sample2 = [
        'VCH-1002',
        today(),
        (parties && parties[1]) || (parties && parties[0]) || 'القائد ٹرانسپورٹ',
        (hajiParties && hajiParties[1]) || (hajiParties && hajiParties[0]) || 'الرحمان ٹریولز',
        (sectors && sectors[1]) || (sectors && sectors[0]) || 'Mak to Med',
        (transports && transports[1]) || (transports && transports[0]) || 'جی ایم سی',
        1,
        800,
        800,
        '—',
        '—',
        '—',
        'Other',
        '—',
        'G-102',
        'احمد رضا',
        '+966509876543',
        'Checked',
        'فیملی بکنگ'
    ];

    const thinBorder = {
        top: { style: 'thin', color: { rgb: 'D0D7DE' } },
        bottom: { style: 'thin', color: { rgb: 'D0D7DE' } },
        left: { style: 'thin', color: { rgb: 'D0D7DE' } },
        right: { style: 'thin', color: { rgb: 'D0D7DE' } }
    };

    const S = {
        header: {
            font: { bold: true, sz: 11, color: { rgb: 'FFFFFF' } },
            fill: { fgColor: { rgb: '054D28' }, patternType: 'solid' },
            alignment: { horizontal: 'center', vertical: 'center' },
            border: thinBorder
        },
        sampleRow: {
            border: thinBorder,
            alignment: { vertical: 'center' }
        }
    };

    const sheetRows = [
        headers.map(h => ({ v: h, t: 's', s: S.header })),
        sample1.map(v => ({ v, t: typeof v === 'number' ? 'n' : 's', s: S.sampleRow })),
        sample2.map(v => ({ v, t: typeof v === 'number' ? 'n' : 's', s: S.sampleRow }))
    ];

    const ws = XLSX.utils.aoa_to_sheet(sheetRows.map(row => row.map(c => c.v)));
    sheetRows.forEach((row, rIdx) => {
        row.forEach((c, cIdx) => {
            if (c.s) {
                const ref = XLSX.utils.encode_cell({ r: rIdx, c: cIdx });
                if (ws[ref]) ws[ref].s = c.s;
            }
        });
    });

    ws['!cols'] = [
        { wch: 15 }, { wch: 14 }, { wch: 22 }, { wch: 22 }, { wch: 16 },
        { wch: 16 }, { wch: 12 }, { wch: 12 }, { wch: 14 }, { wch: 14 },
        { wch: 12 }, { wch: 14 }, { wch: 14 }, { wch: 16 }, { wch: 12 },
        { wch: 18 }, { wch: 16 }, { wch: 14 }, { wch: 24 }
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Template');
    XLSX.writeFile(wb, 'Umrah_Transport_Import_Template.xlsx');
}

function handleImportDragOver(event) {
    event.preventDefault();
    event.stopPropagation();
    const zone = document.getElementById('import-drop-zone');
    if (zone) zone.classList.add('dragover');
}

function handleImportDragLeave(event) {
    event.preventDefault();
    event.stopPropagation();
    const zone = document.getElementById('import-drop-zone');
    if (zone) zone.classList.remove('dragover');
}

function handleImportDrop(event) {
    event.preventDefault();
    event.stopPropagation();
    const zone = document.getElementById('import-drop-zone');
    if (zone) zone.classList.remove('dragover');

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
        processImportFile(files[0]);
    }
}

function handleImportFileSelect(input) {
    if (input.files && input.files.length > 0) {
        processImportFile(input.files[0]);
    }
}

function normalizeImportDate(val) {
    if (!val) return today();
    if (val instanceof Date) {
        if (!isNaN(val.getTime())) {
            const y = val.getFullYear();
            const m = String(val.getMonth() + 1).padStart(2, '0');
            const d = String(val.getDate()).padStart(2, '0');
            return `${y}-${m}-${d}`;
        }
    }
    const str = String(val).trim();
    if (/^\d{4}-\d{1,2}-\d{1,2}$/.test(str)) {
        const parts = str.split('-');
        return `${parts[0]}-${parts[1].padStart(2, '0')}-${parts[2].padStart(2, '0')}`;
    }
    const slashMatch = str.match(/^(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{4})$/);
    if (slashMatch) {
        const d = slashMatch[1].padStart(2, '0');
        const m = slashMatch[2].padStart(2, '0');
        const y = slashMatch[3];
        return `${y}-${m}-${d}`;
    }
    if (typeof val === 'number' || /^\d{5}$/.test(str)) {
        const num = Number(val);
        const parsed = new Date((num - (25567 + 2)) * 86400 * 1000);
        if (!isNaN(parsed.getTime())) {
            const y = parsed.getFullYear();
            const m = String(parsed.getMonth() + 1).padStart(2, '0');
            const d = String(parsed.getDate()).padStart(2, '0');
            return `${y}-${m}-${d}`;
        }
    }
    return today();
}

function findImportRowValue(row, keys) {
    const rowKeys = Object.keys(row);
    for (const key of keys) {
        const target = key.toLowerCase().replace(/[\s_\-\(\)\/]/g, '');
        for (const rk of rowKeys) {
            const norm = rk.toLowerCase().replace(/[\s_\-\(\)\/]/g, '');
            if (norm.includes(target) || target.includes(norm)) {
                return row[rk];
            }
        }
    }
    return '';
}

function processImportFile(file) {
    if (!file) return;

    const alImp = document.getElementById('al-import-records');
    if (alImp) alImp.innerHTML = '';

    const zTitle = document.getElementById('import-zone-title');
    if (zTitle) zTitle.textContent = `فائل: ${file.name} (${Math.round(file.size / 1024)} KB)`;
    const zSub = document.getElementById('import-zone-sub');
    if (zSub) zSub.textContent = 'ڈیٹا پروسیس ہو رہا ہے...';

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = new Uint8Array(e.target.result);
            if (typeof XLSX === 'undefined') {
                throw new Error('XLSX لائبریری لوڈ نہیں ہوئی');
            }
            const wb = XLSX.read(data, { type: 'array', cellDates: true, cellText: false });
            const firstSheetName = wb.SheetNames[0];
            const ws = wb.Sheets[firstSheetName];
            const rawRows = XLSX.utils.sheet_to_json(ws, { defval: '', raw: false });

            if (!rawRows || !rawRows.length) {
                throw new Error('اس فائل میں کوئی ڈیٹا نہیں ملا');
            }

            const validRows = [];
            rawRows.forEach((row, idx) => {
                const voucher = String(findImportRowValue(row, ['voucherno', 'واوچرنمبر', 'voucher', 'واوچر', 'واؤچر', 'ref', 'سند'])).trim();
                const rawDate = findImportRowValue(row, ['date', 'تاریخ', 'tarikh', 'day']);
                const party = String(findImportRowValue(row, ['transporter', 'ٹرانسپورٹر', 'party', 'پارٹی', 'ناقل'])).trim();
                const newParty = String(findImportRowValue(row, ['hajiparty', 'حاجی پارٹی', 'client', 'کلائنٹ', 'customer'])).trim();
                const sector = String(findImportRowValue(row, ['sector', 'سیکٹر', 'route', 'روٹ', 'مسار'])).trim();
                const transport = String(findImportRowValue(row, ['transport', 'ٹرانسپورٹ', 'vehicle', 'گاڑی', 'bus', 'car'])).trim();
                const countVal = Number(findImportRowValue(row, ['count', 'حجاج', 'تعداد', 'pax', 'pilgrim', 'افراد'])) || 0;
                const fareVal = Number(findImportRowValue(row, ['fare', 'کرایہ', 'rate', 'ریٹ'])) || 0;
                let totalVal = Number(findImportRowValue(row, ['total', 'کلرقم', 'ٹوٹل', 'amount'])) || 0;

                const flightNo = String(findImportRowValue(row, ['flightno', 'فلائٹنمبر', 'flight', 'فلائٹ'])).trim();
                const flightTime = String(findImportRowValue(row, ['flighttime', 'فلائٹوقت', 'time', 'وقت'])).trim();
                const airport = String(findImportRowValue(row, ['airport', 'ایئرپورٹ', 'مطار'])).trim();
                const transportNature = String(findImportRowValue(row, ['nature', 'نوعیت', 'trip'])).trim();
                const shirka = String(findImportRowValue(row, ['shirka', 'شرکہ', 'company', 'کمپنی'])).trim();
                const group = String(findImportRowValue(row, ['group', 'گروپ'])).trim();
                const name = String(findImportRowValue(row, ['passenger', 'مسافر', 'name', 'نام'])).trim();
                const mobile = String(findImportRowValue(row, ['mobile', 'موبائل', 'phone', 'فون'])).trim();
                const notes = String(findImportRowValue(row, ['notes', 'نوٹس', 'remarks', 'ہدایات'])).trim();

                const statusVal = String(findImportRowValue(row, ['checked', 'status', 'اسٹیٹس', 'حالت'])).toLowerCase();
                const checked = /checked|مکمل|true|1|yes|تصدیق/.test(statusVal);

                // Ignore empty or summary row
                if (!party && !sector && !totalVal && !countVal && !voucher) return;
                if (String(party).includes('Grand Total') || String(voucher).includes('Grand Total') || String(party).includes('مجموعی ٹوٹل')) return;

                const date = normalizeImportDate(rawDate);
                const isSharingBus = (typeof isEconomyBus === 'function' ? isEconomyBus(transport, sector) : false) || countVal > 1;
                const mode = isSharingBus ? 'sharing' : 'vehicle';

                if (totalVal === 0) {
                    totalVal = (mode === 'sharing') ? (countVal * fareVal) : fareVal;
                }

                validRows.push({
                    id: typeof uid === 'function' ? uid() : ('imp_' + Date.now().toString(36) + '_' + idx),
                    voucher: voucher || (typeof genVoucher === 'function' ? genVoucher() : 'VCH-' + (1000 + idx)),
                    date,
                    party: party || 'نامعلوم پارٹی',
                    newParty,
                    sector: sector || 'Jed to Mak',
                    transport: transport || 'بس',
                    mode,
                    count: countVal,
                    fare: fareVal,
                    vehicleTotal: totalVal,
                    total: totalVal,
                    notes,
                    name,
                    flightTime,
                    flightNo,
                    airport,
                    transportNature,
                    shirka,
                    group,
                    mobile,
                    checked
                });
            });

            if (!validRows.length) {
                throw new Error('فائل میں کوئی درست قطار نہیں ملی۔ براہ کرم ٹیمپلیٹ کے مطابق کالمز چیک کریں۔');
            }

            _parsedImportRecords = validRows;

            // Render Preview
            const prevArea = document.getElementById('import-preview-area');
            if (prevArea) prevArea.style.display = 'block';

            const statTotal = document.getElementById('imp-stat-total');
            if (statTotal) statTotal.textContent = rawRows.length;
            const statValid = document.getElementById('imp-stat-valid');
            if (statValid) statValid.textContent = validRows.length;

            const tCount = validRows.reduce((s, r) => s + (Number(r.count) || 0), 0);
            const tAmount = validRows.reduce((s, r) => s + (Number(r.total) || 0), 0);

            const statHujjaj = document.getElementById('imp-stat-hujjaj');
            if (statHujjaj) statHujjaj.textContent = tCount;
            const statAmount = document.getElementById('imp-stat-amount');
            if (statAmount) statAmount.textContent = sar(tAmount) + ' SAR';

            const prevCountEl = document.getElementById('imp-preview-count');
            if (prevCountEl) prevCountEl.textContent = `کل ${validRows.length} میں سے پہلے ${Math.min(validRows.length, 10)} ریکارڈز دکھائے جا رہے ہیں`;

            const tbody = document.getElementById('import-preview-tbody');
            if (tbody) {
                tbody.innerHTML = validRows.slice(0, 10).map((r, i) => `
                    <tr style="border-bottom:1px solid var(--border);">
                        <td style="padding:5px 8px;text-align:center;">${i + 1}</td>
                        <td style="padding:5px 8px;text-align:center;"><span class="voucher-tag">${r.voucher}</span></td>
                        <td style="padding:5px 8px;text-align:center;">${fd(r.date)}</td>
                        <td style="padding:5px 8px;"><strong>${r.party}</strong></td>
                        <td style="padding:5px 8px;">${r.newParty || '—'}</td>
                        <td style="padding:5px 8px;text-align:center;"><span class="badge">${r.sector}</span></td>
                        <td style="padding:5px 8px;text-align:center;">${r.transport}</td>
                        <td style="padding:5px 8px;text-align:center;">${r.count || '—'}</td>
                        <td style="padding:5px 8px;text-align:right;">${sar(r.fare)}</td>
                        <td style="padding:5px 8px;text-align:right;"><strong>${sar(r.total)}</strong></td>
                    </tr>
                `).join('');
            }

            const btnConfirm = document.getElementById('btn-confirm-import-records');
            if (btnConfirm) btnConfirm.disabled = false;

            if (zSub) zSub.textContent = `${validRows.length} درست ریکارڈز تیار ہیں`;

        } catch (err) {
            console.error('Import parse error:', err);
            if (alImp) {
                alImp.innerHTML = `<div class="al er" style="padding:10px 14px;border-radius:8px;background:rgba(220,38,38,0.1);color:#dc2626;border:1px solid rgba(220,38,38,0.25);font-size:13px;font-weight:600;">⚠️ خرابی: ${err.message || 'فائل پڑھنے میں مسئلہ ہوا'}</div>`;
            }
            const btnConfirm = document.getElementById('btn-confirm-import-records');
            if (btnConfirm) btnConfirm.disabled = true;
            if (zSub) zSub.textContent = 'فائل پروسیسنگ میں خرابی';
        }
    };
    reader.readAsArrayBuffer(file);
}

async function confirmImportRecords() {
    if (!_parsedImportRecords || !_parsedImportRecords.length) {
        alert('امپورٹ کرنے کے لیے کوئی ریکارڈ موجود نہیں ہے');
        return;
    }

    const modeRadio = document.querySelector('input[name="import-mode"]:checked');
    const importMode = modeRadio ? modeRadio.value : 'append';

    if (importMode === 'replace') {
        const confirmMsg = '⚠️ کیا آپ واقعی تمام پرانے ریکارڈز حذف کر کے صرف یہ نئی ایکسل فائل امپورٹ کرنا چاہتے ہیں؟';
        if (typeof verifyPassword === 'function') {
            if (!(await verifyPassword(confirmMsg))) return;
        } else if (!confirm(confirmMsg)) {
            return;
        }
    }

    // Collect new dropdown items
    const newParties = [];
    const newSectors = [];
    const newTransports = [];
    const newHajiParties = [];

    _parsedImportRecords.forEach(r => {
        if (r.party && !parties.includes(r.party) && !newParties.includes(r.party)) newParties.push(r.party);
        if (r.sector && !sectors.includes(r.sector) && !newSectors.includes(r.sector)) newSectors.push(r.sector);
        if (r.transport && !transports.includes(r.transport) && !newTransports.includes(r.transport)) newTransports.push(r.transport);
        if (r.newParty && !hajiParties.includes(r.newParty) && !newHajiParties.includes(r.newParty)) newHajiParties.push(r.newParty);
    });

    if (newParties.length) { parties.push(...newParties); if (typeof svP === 'function') svP(); }
    if (newSectors.length) { sectors.push(...newSectors); if (typeof svS === 'function') svS(); }
    if (newTransports.length) { transports.push(...newTransports); if (typeof svTr === 'function') svTr(); }
    if (newHajiParties.length) { hajiParties.push(...newHajiParties); if (typeof svHP === 'function') svHP(); }

    const count = _parsedImportRecords.length;

    if (importMode === 'replace') {
        deletedRecords = deletedRecords || [];
        deletedRecords.push(...records.map(r => ({ ...r, deletedAt: new Date().toISOString(), replacedByImport: true })));
        records = [..._parsedImportRecords];
        if (typeof svDR === 'function') svDR();
    } else {
        records.push(..._parsedImportRecords);
    }

    if (typeof svR === 'function') svR();
    if (typeof refreshAllDrops === 'function') refreshAllDrops();
    if (typeof todayStats === 'function') todayStats();

    closeImportRecordsModal();

    if (typeof filterRecords === 'function') {
        filterRecords();
    }

    if (typeof al === 'function') {
        al('al-entry', `Excel فائل سے ${count} ریکارڈز کامیابی کے ساتھ امپورٹ ہو گئے!`, 'ok');
    }
}

// ── FILTER PERSISTENCE (GLOBAL VARIABLE - RESETS ON REFRESH) ──
let savedFilterState = null;

function initRecordsPage() {
    if (savedFilterState) {
        if (document.getElementById('f-from')) document.getElementById('f-from').value = savedFilterState.from || '';
        if (document.getElementById('f-to')) document.getElementById('f-to').value = savedFilterState.to || '';
        if (document.getElementById('f-party')) document.getElementById('f-party').value = savedFilterState.party || '';
        if (document.getElementById('f-sector')) document.getElementById('f-sector').value = savedFilterState.sector || '';
        if (document.getElementById('f-search')) document.getElementById('f-search').value = savedFilterState.search || '';
        recordsColumnFilters = { ...(savedFilterState.columns || {}) };
        recordsCurrentPage = savedFilterState.page || 1;
        recordsPageSize = savedFilterState.pageSize || 25;
        if (savedFilterState.tab) currentRecordsTab = savedFilterState.tab;
    } else {
        currentRecordsTab = 'pending';
        recordsCurrentPage = 1;
        recordsPageSize = 25;
    }

    if (currentRecordsTab === 'trash') {
        renderTrash();
    } else {
        captureRecordsColumnFilters();
        saveFilterState();
        applyRecordFilters();
    }
}

function saveFilterState() {
    savedFilterState = {
        from: document.getElementById('f-from') ? document.getElementById('f-from').value : '',
        to: document.getElementById('f-to') ? document.getElementById('f-to').value : '',
        party: document.getElementById('f-party') ? document.getElementById('f-party').value : '',
        sector: document.getElementById('f-sector') ? document.getElementById('f-sector').value : '',
        search: document.getElementById('f-search') ? document.getElementById('f-search').value : '',
        tab: currentRecordsTab,
        columns: { ...recordsColumnFilters },
        page: recordsCurrentPage,
        pageSize: recordsPageSize
    };
}

// Expose
window.renderRecords = renderRecords;
window.clearFilter = clearFilter;
window.deleteRecord = deleteRecord;
window.renderTrash = renderTrash;
window.restoreRecord = restoreRecord;
window.filterTableColumns = filterTableColumns;
window.copyVoucher = copyVoucher;
window.closeCopyModal = closeCopyModal;
window.confirmCopyVoucher = confirmCopyVoucher;
window.exportRecordsToExcel = exportRecordsToExcel;
window.openImportRecordsModal = openImportRecordsModal;
window.closeImportRecordsModal = closeImportRecordsModal;
window.downloadRecordsTemplate = downloadRecordsTemplate;
window.handleImportDragOver = handleImportDragOver;
window.handleImportDragLeave = handleImportDragLeave;
window.handleImportDrop = handleImportDrop;
window.handleImportFileSelect = handleImportFileSelect;
window.confirmImportRecords = confirmImportRecords;
window.initRecordsPage = initRecordsPage;
window.setRecordsPage = setRecordsPage;
window.setRecordsPageSize = setRecordsPageSize;
window.saveRecordsFilterState = saveRecordsFilterState;
window.toggleRecordCheck = toggleRecordCheck;
window.renderRecHead = renderRecHead;
window.openEditRecordModal = openEditRecordModal;
window.closeEditRecordModal = closeEditRecordModal;
window.saveRecordEditModal = saveRecordEditModal;
window.saveAndRestoreRecordEditModal = saveAndRestoreRecordEditModal;
window.calcEditRecordTotal = calcEditRecordTotal;
window.toggleEditFlightDetails = toggleEditFlightDetails;
window.editRecord = openEditRecordModal;
function onEditRecHajiPartyChange() {
    const sel = document.getElementById('edit-rec-new-party');
    if (!sel) return;
    if (sel.value === '__custom__') {
        const customName = prompt('نئی حاجی پارٹی کا نام درج کریں:');
        if (customName && customName.trim()) {
            const trimmed = customName.trim();
            if (typeof hajiParties !== 'undefined' && Array.isArray(hajiParties) && !hajiParties.includes(trimmed)) {
                hajiParties.push(trimmed);
                if (typeof svHP === 'function') svHP();
            }
            const opt = document.createElement('option');
            opt.value = trimmed;
            opt.textContent = trimmed;
            sel.insertBefore(opt, sel.lastElementChild);
            sel.value = trimmed;
        } else {
            sel.value = '';
        }
    }
}
window.onEditRecHajiPartyChange = onEditRecHajiPartyChange;
