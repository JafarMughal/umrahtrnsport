// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  LEDGER — COMPLETE & RESILIENT PARTY ACCOUNTING STATEMENT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

var ledgerCurrentPage = 1;
var ledgerPageSize = 'all'; // Default to 'all' so date filtered reports show 100% of records

function filterLedger() {
    ledgerCurrentPage = 1;
    renderLedger();
}

function setLedgerPage(page) {
    ledgerCurrentPage = page;
    renderLedger();
}

function setLedgerPageSize(size) {
    if (size === 'all') {
        ledgerPageSize = 'all';
    } else {
        const parsedSize = Number(size);
        if (isNaN(parsedSize) || parsedSize <= 0) return;
        ledgerPageSize = parsedSize;
    }
    ledgerCurrentPage = 1;
    renderLedger();
}

function clearLedgerFilter() {
    const elParty = document.getElementById('l-party');
    const elFrom = document.getElementById('l-from');
    const elTo = document.getElementById('l-to');
    if (elParty) elParty.value = '';
    if (elFrom) elFrom.value = '';
    if (elTo) elTo.value = '';
    filterLedger();
}

function renderLedger() {
    const L = (typeof T !== 'undefined' && T[lang]) ? T[lang] : ((typeof T !== 'undefined' && T.ur) ? T.ur : {});
    const perms = (typeof getMyPerms === 'function') ? getMyPerms() : {
        showAmounts: true,
        showPayments: true,
        canExport: true,
        canPrint: true,
        showReport: true,
        showDailyNote: true,
        showVoucher: true
    };

    const selParty = (document.getElementById('l-party')?.value || '').trim();
    const from = (document.getElementById('l-from')?.value || '').trim();
    const to = (document.getElementById('l-to')?.value || '').trim();
    const out = document.getElementById('ledger-output');
    if (!out) {
        // DOM not ready yet — retry after page template loads
        setTimeout(() => { if (typeof renderLedger === 'function') renderLedger(); }, 500);
        return;
    }

    // ── Safe Data Arrays ──
    const allRecords = Array.isArray(records) ? records : [];
    const allPayments = Array.isArray(payments) ? payments : [];

    // ── Determine Parties List ──
    const stateParties = Array.isArray(parties) ? parties : [];
    const recordParties = allRecords.map(r => r && r.party).filter(Boolean);
    const paymentParties = allPayments.map(p => p && p.party).filter(Boolean);

    const partySet = new Set();
    [...stateParties, ...recordParties, ...paymentParties].forEach(p => {
        if (p && typeof p === 'string' && p.trim() !== '') {
            partySet.add(p.trim());
        }
    });
    const allKnownParties = Array.from(partySet);

    // Selected party or full list
    const pList = selParty ? [selParty] : (allKnownParties.length ? allKnownParties : stateParties);

    if (!pList.length && !allRecords.length && !allPayments.length) {
        out.innerHTML = `<div class="empty"><div class="ico" style="font-size:32px;margin-bottom:8px;">📒</div>${L.noData || 'کوئی ڈیٹا موجود نہیں ہے'}</div>`;
        return;
    }

    // ── 1. LEDGER SUMMARY (خلاصہ لیجر — جب تمام پارٹیاں منتخب ہوں) ──
    let summaryHtml = '';
    if (!selParty && pList.length && perms.showAmounts) {
        let sumRecs = [...allRecords];
        let sumPays = perms.showPayments ? [...allPayments] : [];

        // فلٹر برائے تاریخ
        if (from) {
            sumRecs = sumRecs.filter(r => r.date && String(r.date).trim() >= from);
            sumPays = sumPays.filter(p => p.date && String(p.date).trim() >= from);
        }
        if (to) {
            sumRecs = sumRecs.filter(r => r.date && String(r.date).trim() <= to);
            sumPays = sumPays.filter(p => p.date && String(p.date).trim() <= to);
        }

        let tDr = 0, tCr = 0;
        const summaryRows = pList.map(party => {
            const matchParty = (pName) => (pName || '').trim().toLowerCase() === party.trim().toLowerCase();
            const ovDebit = sumRecs.filter(r => matchParty(r.party)).reduce((s, r) => s + (Number(r.total) || 0), 0);
            const ovCredit = sumPays.filter(p => matchParty(p.party)).reduce((s, p) => s + (Number(p.amount) || 0), 0);
            const ovBal = ovCredit - ovDebit;

            if (ovDebit === 0 && ovCredit === 0 && (from || to)) return '';

            tDr += ovDebit;
            tCr += ovCredit;

            const code = (typeof getCode === 'function') ? getCode(party) : '—';
            const balSign = ovBal >= 0 ? '' : '-';
            const balColor = ovBal > 0 ? '#10b981' : ovBal < 0 ? '#ef4444' : 'inherit';

            return `
            <tr style="border-bottom: 1px solid var(--border-soft, #e5e7eb);">
                <td style="padding:8px 10px;font-family:monospace;font-weight:600;">${code}</td>
                <td style="padding:8px 10px;font-weight:bold;">${party}</td>
                <td style="padding:8px 10px;text-align:right;color:#dc2626;">${typeof sar === 'function' ? sar(ovDebit) : ovDebit}</td>
                <td style="padding:8px 10px;text-align:right;color:#16a34a;">${typeof sar === 'function' ? sar(ovCredit) : ovCredit}</td>
                <td style="padding:8px 10px;text-align:right;font-weight:bold;color:${balColor};">${balSign}${typeof sar === 'function' ? sar(Math.abs(ovBal)) : Math.abs(ovBal)}</td>
            </tr>`;
        }).filter(Boolean).join('');

        if (summaryRows || (!from && !to)) {
            const netBal = tCr - tDr;
            const netSign = netBal >= 0 ? '' : '-';
            const netColor = netBal > 0 ? '#10b981' : netBal < 0 ? '#ef4444' : 'inherit';
            const printDateStr = (typeof today === 'function') ? (typeof fd === 'function' ? fd(today()) : today()) : new Date().toLocaleDateString();

            summaryHtml = `
            <div style="font-family: inherit; color: inherit; background: var(--surface, #fff); padding: 14px; border: 1px solid var(--border, #ccc); border-radius: 8px; margin-bottom: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.06);">
                <div style="background-color: rgba(45, 106, 79, 0.1); border: 1px solid var(--gold, #c9a84c); text-align: center; padding: 8px; font-weight: bold; font-size: 16px; margin-bottom: 15px; border-radius: 6px; color: var(--gold, #c9a84c);">
                    ${L.ledgerTitle || 'خلاصہ لیجر (Ledger Summary)'}
                </div>
                <table style="width: 100%; border: none; font-size: 12.5px; margin-bottom: 14px;">
                    <tr>
                        <td style="font-weight: bold; width: 100px;">${L.fromDate || 'مدت (Period)'}:</td>
                        <td>${from ? (typeof fd === 'function' ? fd(from) : from) : '...'} &nbsp;${typeof L_arrow === 'function' ? L_arrow() : '➜'}&nbsp; ${to ? (typeof fd === 'function' ? fd(to) : to) : '...'}</td>
                        <td style="font-weight: bold; text-align: right; width: 100px;">${L.dateCol || 'پرنٹ تاریخ'}:</td>
                        <td style="text-align: right; width: 120px;">${printDateStr}</td>
                    </tr>
                </table>
                <table style="width: 100%; border-collapse: collapse; font-size: 12.5px;">
                    <thead>
                        <tr style="border-top: 1px solid var(--border, #000); border-bottom: 1px solid var(--border, #000); background: rgba(0,0,0,0.03);">
                            <th style="text-align: left; padding: 8px 10px;">${L.codeCol || 'کوڈ'}</th>
                            <th style="text-align: left; padding: 8px 10px;">${L.partyCol || 'پارٹی'}</th>
                            <th style="text-align: right; padding: 8px 10px;">${L.debitCol || 'ڈیبٹ (SAR)'}</th>
                            <th style="text-align: right; padding: 8px 10px;">${L.creditCol || 'کریڈٹ (SAR)'}</th>
                            <th style="text-align: right; padding: 8px 10px;">${L.balance || 'بیلنس (SAR)'}</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${summaryRows}
                        <tr style="border-top: 2px solid var(--border, #000); font-weight: bold; background: rgba(0,0,0,0.04);">
                            <td colspan="2" style="padding: 10px 8px;">${L.subTotal || 'کل میزان (Total)'}</td>
                            <td style="text-align: right; padding: 10px 8px; color:#dc2626;">${typeof sar === 'function' ? sar(tDr) : tDr}</td>
                            <td style="text-align: right; padding: 10px 8px; color:#16a34a;">${typeof sar === 'function' ? sar(tCr) : tCr}</td>
                            <td style="text-align: right; padding: 10px 8px; color:${netColor};">${netSign}${typeof sar === 'function' ? sar(Math.abs(netBal)) : Math.abs(netBal)}</td>
                        </tr>
                    </tbody>
                </table>
            </div>`;
        }
    }

    // ── 2. INDIVIDUAL ACCOUNT LEDGERS (ہر پارٹی کا مکمل کھاتہ) ──
    const ledgerGroups = pList.map(party => {
        const matchParty = (pName) => (pName || '').trim().toLowerCase() === party.trim().toLowerCase();

        const partyAllRecs = allRecords.filter(r => matchParty(r.party));
        const partyAllPays = perms.showPayments ? allPayments.filter(p => matchParty(p.party)) : [];

        // All-Time Totals
        const overallDebit = partyAllRecs.reduce((s, r) => s + (Number(r.total) || 0), 0);
        const overallCredit = partyAllPays.reduce((s, p) => s + (Number(p.amount) || 0), 0);
        const overallBal = overallCredit - overallDebit;

        // Opening Balance before 'from' date
        let openingDebit = 0;
        let openingCredit = 0;
        let openingBal = 0;
        if (from) {
            openingDebit = partyAllRecs.filter(r => r.date && String(r.date).trim() < from).reduce((s, r) => s + (Number(r.total) || 0), 0);
            openingCredit = partyAllPays.filter(p => p.date && String(p.date).trim() < from).reduce((s, p) => s + (Number(p.amount) || 0), 0);
            openingBal = openingCredit - openingDebit;
        }

        // Filter within selected date range
        let recs = [...partyAllRecs];
        let pays = [...partyAllPays];

        if (from) {
            recs = recs.filter(r => r.date && String(r.date).trim() >= from);
            pays = pays.filter(p => p.date && String(p.date).trim() >= from);
        }
        if (to) {
            recs = recs.filter(r => r.date && String(r.date).trim() <= to);
            pays = pays.filter(p => p.date && String(p.date).trim() <= to);
        }

        const totalDebit = recs.reduce((s, r) => s + (Number(r.total) || 0), 0);
        const totalCredit = pays.reduce((s, p) => s + (Number(p.amount) || 0), 0);
        const totalHujjaj = recs.reduce((s, r) => s + (parseInt(r.count, 10) || 0), 0);
        const periodBalance = totalCredit - totalDebit;

        // Closing Balance as of 'to' date
        const closingBal = from ? (openingBal + periodBalance) : overallBal;

        // Build Unified Transactions
        const rawTxns = [
            ...recs.map(r => ({
                date: r.date,
                type: 'Debit',
                voucher: r.voucher || '—',
                desc: `${r.sector || '—'} (${r.count || 0} ${L.hujPerSector || 'حاجی ×'} ${typeof sar === 'function' ? sar(r.fare || 0) : (r.fare || 0)}) ${r.notes || ''}`.trim(),
                amount: Number(r.total) || 0,
                count: Number(r.count) || 0,
                isOpening: false
            })),
            ...pays.map(p => {
                let mLabel = p.method || 'ادائیگی';
                if (typeof getMethodLabel === 'function') {
                    try { mLabel = getMethodLabel(p.method) || p.method; } catch (e) { }
                }
                return {
                    date: p.date,
                    type: 'Credit',
                    voucher: '—',
                    desc: `${mLabel} ${p.notes || ''}`.trim(),
                    amount: Number(p.amount) || 0,
                    count: 0,
                    isOpening: false
                };
            })
        ].sort((a, b) => (String(a.date || '')).localeCompare(String(b.date || '')));

        // Calculate running balance starting from opening balance
        let running = openingBal;
        const transactions = [];

        // Insert Opening Balance row if 'from' date is set and there was any previous activity
        if (from && (openingDebit !== 0 || openingCredit !== 0)) {
            transactions.push({
                date: from,
                type: openingBal >= 0 ? 'Credit' : 'Debit',
                voucher: '—',
                desc: `${L.balanceBF || 'سابقہ بیلنس (Balance B/F)'}`,
                amount: Math.abs(openingBal),
                count: 0,
                runningBalance: openingBal,
                isOpening: true
            });
        }

        rawTxns.forEach(tx => {
            if (tx.type === 'Debit') running -= tx.amount;
            else running += tx.amount;
            transactions.push({ ...tx, runningBalance: running });
        });

        return {
            party,
            overallBal,
            openingBal,
            closingBal,
            totalDebit,
            totalCredit,
            totalHujjaj,
            periodBalance,
            recsCount: recs.length,
            transactions,
            showEmpty: transactions.length === 0 && (from || to || selParty)
        };
    }).filter(group => group.transactions.length || group.showEmpty);

    const totalTransactions = ledgerGroups.reduce((total, group) => total + group.transactions.length, 0);

    // Pagination Calculation (Default 'all' displays 100% of rows)
    const isPagingEnabled = ledgerPageSize !== 'all' && Number(ledgerPageSize) > 0;
    const effectivePageSize = isPagingEnabled ? Number(ledgerPageSize) : (totalTransactions || 1);
    const totalPages = Math.max(1, Math.ceil(totalTransactions / effectivePageSize));
    ledgerCurrentPage = Math.min(Math.max(ledgerCurrentPage, 1), totalPages);
    const firstTransaction = isPagingEnabled ? (ledgerCurrentPage - 1) * effectivePageSize : 0;
    const lastTransaction = isPagingEnabled ? Math.min(firstTransaction + effectivePageSize, totalTransactions) : totalTransactions;

    let html = '';
    let transactionIndex = 0;

    ledgerGroups.forEach(group => {
        let pageTransactions = group.transactions;

        if (isPagingEnabled) {
            pageTransactions = group.transactions.filter((tx, index) => {
                const currentIndex = transactionIndex + index;
                return currentIndex >= firstTransaction && currentIndex < lastTransaction;
            });
            transactionIndex += group.transactions.length;
            if (!pageTransactions.length && totalTransactions > 0) return;
        }

        const { party, overallBal, closingBal, totalDebit, totalCredit, totalHujjaj, periodBalance, recsCount } = group;

        const rows = pageTransactions.map(tx => {
            const running = tx.runningBalance;
            const sign = running >= 0 ? '' : '-';
            const runColor = running > 0 ? '#10b981' : running < 0 ? '#ef4444' : 'inherit';

            if (tx.isOpening) {
                return `
                <tr style="border-bottom: 1.5px solid var(--border-strong, #52796f); background: rgba(82, 121, 111, 0.08); font-weight: 600;">
                    <td style="padding:7px 8px;white-space:nowrap;">${typeof fd === 'function' ? fd(tx.date) : (tx.date || '—')}</td>
                    <td style="padding:7px 8px;">
                        <span style="display:inline-block;padding:2px 8px;border-radius:4px;font-size:11px;font-weight:bold;background:#e0f2fe;color:#0369a1;">
                            سابقہ
                        </span>
                    </td>
                    ${perms.showVoucher ? `<td style="padding:7px 8px;color:#9ca3af;font-family:monospace;">—</td>` : ''}
                    <td style="padding:7px 8px;font-weight:bold;">${tx.desc}</td>
                    <td style="padding:7px 8px;color:#9ca3af;">—</td>
                    ${perms.showAmounts ? `
                    <td style="padding:7px 8px;text-align:right;color:#dc2626;">${tx.type === 'Debit' ? (typeof sar === 'function' ? sar(tx.amount) : tx.amount) : ''}</td>
                    <td style="padding:7px 8px;text-align:right;color:#16a34a;">${tx.type === 'Credit' ? (typeof sar === 'function' ? sar(tx.amount) : tx.amount) : ''}</td>
                    <td style="padding:7px 8px;text-align:right;font-weight:bold;color:${runColor};">${sign}${typeof sar === 'function' ? sar(Math.abs(running)) : Math.abs(running)}</td>` : ''}
                </tr>`;
            }

            return `
            <tr style="border-bottom: 1px solid var(--border-soft, #e5e7eb);">
                <td style="padding:6px 8px;white-space:nowrap;">${typeof fd === 'function' ? fd(tx.date) : (tx.date || '—')}</td>
                <td style="padding:6px 8px;">
                    <span style="display:inline-block;padding:2px 8px;border-radius:4px;font-size:11px;font-weight:bold;${tx.type === 'Debit' ? 'background:#fee2e2;color:#b91c1c;' : 'background:#dcfce7;color:#15803d;'}">
                        ${tx.type === 'Debit' ? (L.debitTx || 'Debit') : (L.creditTx || 'Credit')}
                    </span>
                </td>
                ${perms.showVoucher ? `<td style="padding:6px 8px;font-family:monospace;font-weight:600;">${tx.voucher}</td>` : ''}
                <td style="padding:6px 8px;">${tx.desc}</td>
                <td style="padding:6px 8px;color:#6b7280;">—</td>
                ${perms.showAmounts ? `
                <td style="padding:6px 8px;text-align:right;color:#dc2626;">${tx.type === 'Debit' ? (typeof sar === 'function' ? sar(tx.amount) : tx.amount) : ''}</td>
                <td style="padding:6px 8px;text-align:right;color:#16a34a;">${tx.type === 'Credit' ? (typeof sar === 'function' ? sar(tx.amount) : tx.amount) : ''}</td>
                <td style="padding:6px 8px;text-align:right;font-weight:bold;color:${runColor};">${sign}${typeof sar === 'function' ? sar(Math.abs(running)) : Math.abs(running)}</td>` : ''}
            </tr>`;
        }).join('');

        if (group.transactions.length > 0 || group.showEmpty) {
            const balSign = overallBal >= 0 ? '' : '-';
            const overallBalColor = overallBal > 0 ? '#10b981' : overallBal < 0 ? '#ef4444' : 'inherit';
            const closingSign = closingBal >= 0 ? '' : '-';
            const closingBalColor = closingBal > 0 ? '#10b981' : closingBal < 0 ? '#ef4444' : 'inherit';
            const code = (typeof getCode === 'function') ? getCode(party) : '—';
            const printDateStr = (typeof today === 'function') ? (typeof fd === 'function' ? fd(today()) : today()) : new Date().toLocaleDateString();
            const nonAmtCols = perms.showVoucher ? 5 : 4;

            html += `
            <div style="font-family: inherit; color: inherit; background: var(--surface, #fff); padding: 14px; border: 1px solid var(--border, #ccc); border-radius: 8px; margin-bottom: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.06);">
                <div style="background-color: rgba(45, 106, 79, 0.1); border: 1px solid var(--gold, #c9a84c); text-align: center; padding: 8px; font-weight: bold; font-size: 16px; margin-bottom: 15px; border-radius: 6px; color: var(--gold, #c9a84c);">
                    ${L.ledgerTitle || 'کھاتہ لیجر (Account Ledger)'}
                </div>
                <table style="width: 100%; border: none; font-size: 12.5px; margin-bottom: 15px;">
                    <tr>
                        <td style="font-weight: bold; width: 120px;">${L.codeCol || 'اکاؤنٹ کوڈ'}:</td>
                        <td style="font-family:monospace;font-weight:bold;">${code}</td>
                        ${perms.showAmounts ? `
                        <td style="font-weight: bold; text-align: right; width: 120px;">${L.overallBalance || 'کل واجب الادا'}:</td>
                        <td style="text-align: right; font-weight: bold; width: 140px; font-size:14px; color:${overallBalColor};">${balSign}${typeof sar === 'function' ? sar(Math.abs(overallBal)) : Math.abs(overallBal)}</td>` : '<td colspan="2"></td>'}
                    </tr>
                    <tr>
                        <td style="font-weight: bold;">${L.partyCol || 'پارٹی / ٹرانسپورٹر'}:</td>
                        <td colspan="${perms.showAmounts ? 1 : 3}" style="font-weight:bold;font-size:14px;">${party}</td>
                        ${(perms.showAmounts && from) ? `
                        <td style="font-weight: bold; text-align: right;">اختتامی بیلنس (${to || 'آج'}):</td>
                        <td style="text-align: right; font-weight: bold; font-size:13px; color:${closingBalColor};">${closingSign}${typeof sar === 'function' ? sar(Math.abs(closingBal)) : Math.abs(closingBal)}</td>` : ''}
                    </tr>
                    <tr>
                        <td style="font-weight: bold;">${L.fromDate || 'مدت رپورٹ'}:</td>
                        <td colspan="3">${from ? (typeof fd === 'function' ? fd(from) : from) : 'ابتدائی تاریخ'} &nbsp;&nbsp;&nbsp; ${L.toDate || 'تا'}: ${to ? (typeof fd === 'function' ? fd(to) : to) : 'آخری تاریخ'}</td>
                    </tr>
                    <tr>
                        <td style="font-weight: bold;">${L.dateCol || 'پرنٹ تاریخ'}:</td>
                        <td colspan="3">${printDateStr}</td>
                    </tr>
                </table>

                <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
                    <thead>
                        <tr style="border-top: 1px solid var(--border, #000); border-bottom: 1px solid var(--border, #000); background: rgba(0,0,0,0.03);">
                            <th style="text-align: left; padding: 6px 8px;">${L.dateCol || 'تاریخ'}</th>
                            <th style="text-align: left; padding: 6px 8px;">${L.txType || 'قسم'}</th>
                            ${perms.showVoucher ? `<th style="text-align: left; padding: 6px 8px;">${L.voucherCol || 'واؤچر نمبر'}</th>` : ''}
                            <th style="text-align: left; padding: 6px 8px;">${L.desc || 'تفصیلات / سیکٹر'}</th>
                            <th style="text-align: left; padding: 6px 8px;">Inv/Ref</th>
                            ${perms.showAmounts ? `
                            <th style="text-align: right; padding: 6px 8px;">${L.debitCol || 'ڈیبٹ (SAR)'}</th>
                            <th style="text-align: right; padding: 6px 8px;">${L.creditCol || 'کریڈٹ (SAR)'}</th>
                            <th style="text-align: right; padding: 6px 8px;">${L.balance || 'بیلنس (SAR)'}</th>` : ''}
                        </tr>
                    </thead>
                    <tbody>
                        ${rows || `<tr><td colspan="${nonAmtCols + (perms.showAmounts ? 3 : 0)}" style="text-align:center;padding:16px;color:#9ca3af;">${L.noTx || 'کوئی لین دین نہیں'}</td></tr>`}
                        <tr style="border-top: 2px solid var(--border, #000); font-weight: bold; background: rgba(0,0,0,0.04); page-break-inside: avoid;">
                            <td colspan="${nonAmtCols}" style="padding: 8px;">
                                <span>${L.totalHujjaj || 'کل حجاج'}: <strong>${totalHujjaj}</strong></span>
                                <span style="margin-inline-start: 16px; font-size: 11.5px; color: var(--text-muted, #6b7280);">کل ٹرپس / انٹریز: <strong>${recsCount}</strong></span>
                            </td>
                            ${perms.showAmounts ? `
                            <td style="text-align: right; padding: 8px; color:#dc2626;">${typeof sar === 'function' ? sar(totalDebit) : totalDebit}</td>
                            <td style="text-align: right; padding: 8px; color:#16a34a;">${typeof sar === 'function' ? sar(totalCredit) : totalCredit}</td>
                            <td style="text-align: right; padding: 8px; font-size:13px; color:${closingBalColor};">${closingSign}${typeof sar === 'function' ? sar(Math.abs(closingBal)) : Math.abs(closingBal)}</td>` : '<td colspan="3"></td>'}
                        </tr>
                    </tbody>
                </table>
            </div>`;
        }
    });

    let paginationHtml = '';
    if (totalTransactions > 0) {
        const isEnglish = typeof lang !== 'undefined' && lang === 'en';
        const isArabic = typeof lang !== 'undefined' && lang === 'ar';
        const previousLabel = isEnglish ? 'Previous' : isArabic ? 'السابق' : 'پچھلا';
        const nextLabel = isEnglish ? 'Next' : isArabic ? 'التالي' : 'اگلا';
        const rowsLabel = isEnglish ? 'Display' : isArabic ? 'عرض' : 'ڈسپلے';
        const allLabel = isEnglish ? 'All Records' : isArabic ? 'جميع السجلات' : 'تمام ریکارڈز (مکمل رپورٹ)';

        paginationHtml = `
            <div class="ledger-pagination no-print">
                <label class="ledger-page-size-label" for="ledger-page-size">${rowsLabel}:
                    <select id="ledger-page-size" onchange="setLedgerPageSize(this.value)">
                        <option value="all" ${ledgerPageSize === 'all' ? 'selected' : ''}>${allLabel}</option>
                        <option value="100" ${ledgerPageSize === 100 ? 'selected' : ''}>100</option>
                        <option value="50" ${ledgerPageSize === 50 ? 'selected' : ''}>50</option>
                        <option value="25" ${ledgerPageSize === 25 ? 'selected' : ''}>25</option>
                    </select>
                </label>
                <span class="ledger-page-status">${isPagingEnabled ? `${firstTransaction + 1}–${lastTransaction} / ${totalTransactions}` : `کل ریکارڈز: ${totalTransactions}`}</span>
                ${isPagingEnabled ? `
                <div class="ledger-page-buttons">
                    <button type="button" class="btn btn-o btn-sm" onclick="setLedgerPage(${ledgerCurrentPage - 1})" ${ledgerCurrentPage === 1 ? 'disabled' : ''}>${previousLabel}</button>
                    <span>${ledgerCurrentPage} / ${totalPages}</span>
                    <button type="button" class="btn btn-o btn-sm" onclick="setLedgerPage(${ledgerCurrentPage + 1})" ${ledgerCurrentPage === totalPages ? 'disabled' : ''}>${nextLabel}</button>
                </div>` : ''}
            </div>`;
    }

    out.innerHTML = summaryHtml + (html || `<div class="empty"><div class="ico" style="font-size:32px;margin-bottom:8px;">📒</div>${L.noData || 'کوئی ڈیٹا موجود نہیں ہے'}</div>`) + paginationHtml;
}

// ── Global Window Bindings ──
window.clearLedgerFilter = clearLedgerFilter;
window.filterLedger = filterLedger;
window.renderLedger = renderLedger;
window.setLedgerPage = setLedgerPage;
window.setLedgerPageSize = setLedgerPageSize;
window.ledgerCurrentPage = ledgerCurrentPage;
window.ledgerPageSize = ledgerPageSize;
