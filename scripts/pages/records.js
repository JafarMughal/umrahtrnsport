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

    const excelBtn = (currentRecordsTab === 'all' && perms.canExport)
        ? `<button onclick="exportRecordsToExcel()" class="btn btn-sm btn-o no-print" title="${lang === 'en' ? 'Export to Excel' : 'ایکسل فائل محفوظ کریں'}">${lang === 'en' ? 'Export Excel' : 'ایکسل ڈاؤنلوڈ'}</button>`
        : '';

    const filterPlaceholder = lang === 'en' ? 'Filter...' : lang === 'ar' ? 'تصفية...' : 'تلاش...';
    const columnFilterInput = key => `<input type="text" oninput="filterTableColumns()" class="col-filter" value="${escapeRecordsAttribute(recordsColumnFilters[key] || '')}" placeholder="${filterPlaceholder}">`;

    const html = `
    <div class="card records-table-card">
        ${tabsHtml}
        <div class="rec-header-bar">
            <span class="rec-header-title">${titleText}</span>
            ${excelBtn}
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
            <td><button class="btn btn-sm btn-o" onclick="restoreRecord('${r.id}')">${lang === 'en' ? 'Restore' : 'بحال کریں'}</button></td>
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
function openEditRecordModal(id) {
    if (typeof canDo === 'function' && !canDo('edit')) {
        const msg = (typeof T !== 'undefined' && T[lang]?.noEditPerm) || 'آپ کو ریکارڈ میں تبدیلی کی اجازت نہیں ہے';
        alert(msg);
        return;
    }
    const r = (typeof records !== 'undefined') ? records.find(x => x.id === id) : null;
    if (!r) return;

    const modal = document.getElementById('edit-record-modal');
    if (!modal) return;

    // Set hidden ID
    const idEl = document.getElementById('edit-rec-id');
    if (idEl) idEl.value = id;

    // Header badge & title
    const vBadge = document.getElementById('edit-rec-modal-voucher-badge');
    if (vBadge) vBadge.textContent = `${lang === 'en' ? 'Voucher:' : 'واوچر:'} ${r.voucher || '—'}`;
    const pBadge = document.getElementById('edit-rec-modal-party-badge');
    if (pBadge) pBadge.textContent = r.party ? `|  ${r.party}` : '';

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

    // Haji Party
    const newPartyEl = document.getElementById('edit-rec-new-party');
    if (newPartyEl) newPartyEl.value = r.newParty || '';
    const hpDatalist = document.getElementById('edit-rec-haji-party-list');
    if (hpDatalist) {
        const allHp = Array.from(new Set([...(typeof hajiParties !== 'undefined' ? hajiParties : []), ...(typeof records !== 'undefined' ? records.map(x => x.newParty) : [])].filter(Boolean)));
        hpDatalist.innerHTML = allHp.map(hp => `<option value="${hp}">`).join('');
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
        const allNatures = Array.from(new Set([...defaultNatures, ...(typeof records !== 'undefined' ? records.map(x => x.transportNature) : []), r.transportNature].filter(Boolean)));
        natureEl.innerHTML = '<option value="">-- منتخب کریں --</option>' +
            allNatures.map(n => `<option value="${n}" ${n === r.transportNature ? 'selected' : ''}>${n}</option>`).join('');
    }

    // Shirka
    const shEl = document.getElementById('edit-rec-shirka');
    if (shEl) shEl.value = r.shirka || '';
    const shDatalist = document.getElementById('edit-rec-shirka-list');
    if (shDatalist) {
        const allShirkas = Array.from(new Set([...(typeof shirkas !== 'undefined' ? shirkas : []), ...(typeof records !== 'undefined' ? records.map(x => x.shirka) : [])].filter(Boolean)));
        shDatalist.innerHTML = allShirkas.map(s => `<option value="${s}">`).join('');
    }

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
    document.body.style.overflow = '';
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
    const newParty = document.getElementById('edit-rec-new-party')?.value?.trim() || '';
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
    if (typeof todayStats === 'function') todayStats();
    if (typeof refreshAllDrops === 'function') refreshAllDrops();

    closeEditRecordModal();

    // Re-render records if on records page
    if (typeof filterRecords === 'function') {
        filterRecords();
    }
    // Also re-render daily-note if on daily note page
    if (typeof renderDailyNoteTable === 'function') {
        renderDailyNoteTable();
    }

    if (typeof al === 'function') {
        al('al-entry', (typeof T !== 'undefined' && T[lang]?.updOk) || 'ریکارڈ کامیابی سے اپڈیٹ ہو گیا', 'ok');
    }
}

function exportRecordsToExcel() {
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

    rows = [...rows].sort((a, b) => b.date.localeCompare(a.date));

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
    const date = today().replace(/-/g, '');
    const tab = currentRecordsTab === 'all' ? 'تمام' : currentRecordsTab === 'checked' ? 'مکمل' : 'باقی';

    anchor.href = url;
    anchor.download = `UmrahTransport_Records_${tab}_${date}.csv`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);

    al('al-entry', `Excel فائل ڈاؤنلوڈ ہوگئی — ${rows.length} ریکارڈ`, 'ok');
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
window.initRecordsPage = initRecordsPage;
window.setRecordsPage = setRecordsPage;
window.setRecordsPageSize = setRecordsPageSize;
window.saveRecordsFilterState = saveRecordsFilterState;
window.toggleRecordCheck = toggleRecordCheck;
window.renderRecHead = renderRecHead;
window.openEditRecordModal = openEditRecordModal;
window.closeEditRecordModal = closeEditRecordModal;
window.saveRecordEditModal = saveRecordEditModal;
window.calcEditRecordTotal = calcEditRecordTotal;
window.toggleEditFlightDetails = toggleEditFlightDetails;
window.editRecord = openEditRecordModal;