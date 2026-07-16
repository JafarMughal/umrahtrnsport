// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  PRINT & EXPORT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function printCurrentPage() {
    const activePage = document.querySelector('.page.active');
    if (!activePage) return;

    const L = T[lang] || T.ur;

    // ── Daily Note: print only the report table in a clean new window ──
    if (activePage.id === 'page-dailynote') {
        const reportOut = document.getElementById('dn-report-out');
        if (!reportOut || !reportOut.innerHTML.trim() || reportOut.querySelector('.empty')) {
            alert(L.dnNoData || 'کوئی ڈیٹا نہیں ملا');
            return;
        }

        const from = document.getElementById('dnr-from').value;
        const to   = document.getElementById('dnr-to').value;
        const rangeText = (from || to)
            ? `${from ? fd(from) : '...'} &nbsp;—&nbsp; ${to ? fd(to) : '...'}`
            : '';
        const dateStr = new Date().toLocaleDateString('en-PK') + ' &nbsp; ' +
                        new Date().toLocaleTimeString('en-PK', { hour: '2-digit', minute: '2-digit' });

        const appTitle = document.getElementById('app-title')
            ? document.getElementById('app-title').textContent
            : 'Umrah Transport Management System';

        const tableHTML = reportOut.innerHTML;

        const win = window.open('', '_blank', 'width=1100,height=800');
        win.document.write(`<!DOCTYPE html>
<html dir="ltr" lang="en">
<head>
<meta charset="UTF-8">
<title>Jeddah Arrival Report</title>
<style>
  @page { size: A4 landscape; margin: 10mm; }
  * { box-sizing: border-box; }
  body {
    font-family: 'Noto Sans', Arial, sans-serif;
    font-size: 11px;
    margin: 0;
    padding: 0;
    background: #fff;
    color: #000;
  }
  .print-wrap { padding: 4mm 4mm 10mm; }

  /* ── Page Header ── */
  .rpt-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    border-bottom: 2px solid #054D28;
    padding-bottom: 6px;
    margin-bottom: 10px;
  }
  .rpt-header .logo-area { font-size: 26px; }
  .rpt-header .title-area { text-align: center; flex: 1; }
  .rpt-header .title-area h1 {
    font-size: 18px; font-weight: 800;
    color: #054D28; margin: 0 0 2px; letter-spacing: 1px;
  }
  .rpt-header .title-area .sub {
    font-size: 11px; color: #666;
  }
  .rpt-header .meta-area { text-align: right; font-size: 10px; color: #555; min-width: 120px; }

  /* ── Report Title ── */
  .report-title-row {
    text-align: center;
    margin: 6px 0 8px;
  }
  .report-title-row h2 {
    font-size: 16px; font-weight: 800;
    letter-spacing: 2px; color: #000; margin: 0;
    text-transform: uppercase;
    border: 2px solid #000;
    display: inline-block;
    padding: 3px 20px;
  }

  /* ── Table ── */
  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 10px;
    margin: 0;
  }
  thead th {
    background: #054D28 !important;
    color: #fff !important;
    font-weight: 700;
    border: 1px solid #333;
    padding: 5px 6px;
    text-align: center;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  tbody td {
    border: 1px solid #aaa;
    padding: 4px 6px;
    text-align: center;
    vertical-align: middle;
  }
  tbody tr:nth-child(even) { background: #f5f9f7; }
  tbody tr:last-child { background: #E8F3EC !important; font-weight: bold; }
  tbody tr:last-child td { border-top: 2px solid #054D28; }

  /* hide extra wrappers from rendered html */
  .tbl-wrap { overflow: visible !important; }

  /* ── Footer ── */
  .rpt-footer {
    position: fixed; bottom: 0; left: 0; right: 0;
    text-align: center; font-size: 9px; color: #888;
    border-top: 1px solid #ccc; padding-top: 4px;
    background: #fff;
  }
  
  .no-print { display: none !important; }
</style>
</head>
<body>
<div class="print-wrap">

  <div class="rpt-header">
    <div class="logo-area">🕋</div>
    <div class="title-area">
      <h1>${appTitle}</h1>
      <div class="sub">Daily Transport Note Report</div>
    </div>
    <div class="meta-area">
      ${rangeText ? '<div>📅 ' + rangeText + '</div>' : ''}
      <div>🖨️ ${dateStr}</div>
    </div>
  </div>

  ${tableHTML}

</div>
<div class="rpt-footer">${appTitle} — Generated Report</div>
<script>
  window.onload = function() { window.print(); }
<\/script>
</body>
</html>`);
        win.document.close();
        return;
    }

    // ── Other pages: standard print ──
    if (activePage.id === 'page-report') {
        const out = document.getElementById('rep-out');
        if (!out.innerHTML.trim()) {
            al('al-login', L.noData || 'پہلے رپورٹ بنائیں', 'er');
            return;
        }
    }

    let from = '';
    let to = '';
    let pageTitle = '';
    let pageSub = '';

    if (activePage.id === 'page-report') {
        from = document.getElementById('r-from').value;
        to = document.getElementById('r-to').value;
        pageTitle = (L.repTitle || 'Report Center').replace(/📊/g, '').trim();
    } else if (activePage.id === 'page-ledger') {
        from = document.getElementById('l-from').value;
        to = document.getElementById('l-to').value;
        pageTitle = (L.ledgerTitle || 'Party Ledger').replace(/📒/g, '').trim();
        const selParty = document.getElementById('l-party').value;
        pageSub = selParty || (L.selectAll || 'All Parties').replace(/--/g, '').trim();
    }

    const rangeText = (from || to) ? `${from ? fd(from) : '...'} ${L_arrow()} ${to ? fd(to) : '...'}` : '';
    activePage.querySelectorAll('.ph-range').forEach(el => el.textContent = rangeText ? `📅 ${rangeText}` : '');

    const dateStr = `🖨️ ${new Date().toLocaleDateString('ur-PK')} ${new Date().toLocaleTimeString('ur-PK', { hour: '2-digit', minute: '2-digit' })}`;
    activePage.querySelectorAll('.ph-printed-on').forEach(el => el.textContent = dateStr);

    activePage.querySelectorAll('.ph-title').forEach(el => el.textContent = L.appTitle || 'Umrah Transport Management System');
    const fullSub = pageSub ? `${pageTitle} — ${pageSub}` : pageTitle;
    activePage.querySelectorAll('.ph-sub-text').forEach(el => el.textContent = fullSub);

    window.print();
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  EXPORT REPORT TO EXCEL
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function exportReportExcel() {
    const L = T[lang] || T.ur;
    const out = document.getElementById('rep-out');
    if (!out.innerHTML.trim()) {
        al('al-login', L.noData || 'پہلے رپورٹ بنائیں', 'er');
        return;
    }

    const from = document.getElementById('r-from').value;
    const to = document.getElementById('r-to').value;
    const type = document.getElementById('r-type').value;
    const rParty = document.getElementById('r-party').value;

    let rows = [...records];
    if (from) rows = rows.filter(r => r.date >= from);
    if (to) rows = rows.filter(r => r.date <= to);
    if (type === 'party' && rParty) rows = rows.filter(r => r.party === rParty);

    if (!rows.length) { al('al-login', L.noData, 'er'); return; }

    const headers = [L.voucherCol, L.dateCol, L.codeCol, L.partyCol, L.sectorCol, L.transportCol, L.hujjajCol, L.fareCol, L.totalCol];

    const groups = {};
    rows.forEach(r => {
        const k = type === 'date' ? fd(r.date) : type === 'party' ? r.party : type === 'newparty' ? (r.newParty || '—') : r.sector;
        if (!groups[k]) groups[k] = [];
        groups[k].push(r);
    });

    const gT = rows.reduce((s, r) => s + r.total, 0);
    const gH = rows.reduce((s, r) => s + r.count, 0);

    const thinBorder = {
        top: { style: 'thin', color: { rgb: 'CCCCCC' } },
        bottom: { style: 'thin', color: { rgb: 'CCCCCC' } },
        left: { style: 'thin', color: { rgb: 'CCCCCC' } },
        right: { style: 'thin', color: { rgb: 'CCCCCC' } }
    };

    const S = {
        title: { font: { bold: true, sz: 16, color: { rgb: 'FFFFFF' } }, fill: { fgColor: { rgb: '054D28' }, patternType: 'solid' }, alignment: { horizontal: 'center' } },
        sub: { font: { sz: 10, color: { rgb: '555555' } } },
        groupHead: { font: { bold: true, sz: 12, color: { rgb: 'FFFFFF' } }, fill: { fgColor: { rgb: '0F7A41' }, patternType: 'solid' } },
        colHead: { font: { bold: true, color: { rgb: 'FFFFFF' } }, fill: { fgColor: { rgb: 'C9940A' }, patternType: 'solid' }, alignment: { horizontal: 'center' }, border: thinBorder },
        dataRow: { border: thinBorder },
        subTotal: { font: { bold: true }, fill: { fgColor: { rgb: 'E8F3EC' }, patternType: 'solid' }, border: thinBorder },
        grandTotal: { font: { bold: true, sz: 12, color: { rgb: 'FFFFFF' } }, fill: { fgColor: { rgb: '054D28' }, patternType: 'solid' }, border: thinBorder }
    };

    const cell = (v, styleKey) => ({ v: v ?? '', t: typeof v === 'number' ? 'n' : 's', s: styleKey ? S[styleKey] : undefined });

    const sheetRows = [];
    const merges = [];
    const addRow = (cells) => { sheetRows.push(cells); };

    addRow([cell('Umrah Transport Management System', 'title')]);
    merges.push({ s: { r: sheetRows.length - 1, c: 0 }, e: { r: sheetRows.length - 1, c: 8 } });

    addRow([cell(`${L.repKind || 'رپورٹ کی قسم'}: ${type === 'date' ? L.byDate : type === 'party' ? L.byTransporter : type === 'newparty' ? L.byParty : L.bySector}`, 'sub')]);
    merges.push({ s: { r: sheetRows.length - 1, c: 0 }, e: { r: sheetRows.length - 1, c: 8 } });

    if (from || to) {
        addRow([cell(`${L.repfrom || 'تاریخ سے'}: ${from ? fd(from) : '—'}   ${L.repto || 'تاریخ تک'}: ${to ? fd(to) : '—'}`, 'sub')]);
        merges.push({ s: { r: sheetRows.length - 1, c: 0 }, e: { r: sheetRows.length - 1, c: 8 } });
    }

    addRow([cell('')]);

    Object.entries(groups).sort((a, b) => a[0].localeCompare(b[0])).forEach(([k, items]) => {
        addRow([cell(`📌 ${k}`, 'groupHead')]);
        merges.push({ s: { r: sheetRows.length - 1, c: 0 }, e: { r: sheetRows.length - 1, c: 8 } });

        addRow(headers.map(h => cell(h, 'colHead')));

        items.forEach(row => {
            addRow([
                cell(row.voucher || '—', 'dataRow'),
                cell(fd(row.date), 'dataRow'),
                cell(getCode(row.party), 'dataRow'),
                cell(row.party, 'dataRow'),
                cell(row.sector, 'dataRow'),
                cell(getTransportLabel(row.transport), 'dataRow'),
                cell(row.count, 'dataRow'),
                cell(row.fare, 'dataRow'),
                cell(row.total, 'dataRow')
            ]);
        });

        const sT = items.reduce((s, x) => s + x.total, 0);
        const sH = items.reduce((s, x) => s + x.count, 0);
        addRow([
            cell(L.subTotal, 'subTotal'), cell('', 'subTotal'), cell('', 'subTotal'),
            cell('', 'subTotal'), cell('', 'subTotal'), cell('', 'subTotal'),
            cell(sH, 'subTotal'), cell('', 'subTotal'), cell(sT, 'subTotal')
        ]);

        addRow([cell('')]);
    });

    addRow([
        cell(L.grandTotal || 'مجموعی ٹوٹل', 'grandTotal'), cell('', 'grandTotal'), cell('', 'grandTotal'),
        cell('', 'grandTotal'), cell('', 'grandTotal'), cell('', 'grandTotal'),
        cell(gH, 'grandTotal'), cell('', 'grandTotal'), cell(gT, 'grandTotal')
    ]);

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
        { wch: 14 }, { wch: 12 }, { wch: 10 }, { wch: 20 }, { wch: 14 },
        { wch: 14 }, { wch: 9 }, { wch: 11 }, { wch: 13 }
    ];
    ws['!merges'] = merges;

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Report');

    const dateStamp = new Date().toISOString().slice(0, 10);
    XLSX.writeFile(wb, `Report_${dateStamp}.xlsx`);
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  EXPORT LEDGER TO EXCEL
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function exportLedgerExcel() {
    const L = T[lang] || T.ur;
    const out = document.getElementById('ledger-output');
    if (!out.innerHTML.trim() || out.querySelector('.empty')) {
        al('al-login', L.noData || 'پہلے لیجر بنائیں', 'er');
        return;
    }

    const selParty = document.getElementById('l-party').value;
    const from = document.getElementById('l-from').value;
    const to = document.getElementById('l-to').value;
    const pList = selParty ? [selParty] : parties;

    if (!pList.length) { al('al-login', L.noData, 'er'); return; }

    const thinBorder = {
        top: { style: 'thin', color: { rgb: 'CCCCCC' } },
        bottom: { style: 'thin', color: { rgb: 'CCCCCC' } },
        left: { style: 'thin', color: { rgb: 'CCCCCC' } },
        right: { style: 'thin', color: { rgb: 'CCCCCC' } }
    };

    const S = {
        title: { font: { bold: true, sz: 16, color: { rgb: 'FFFFFF' } }, fill: { fgColor: { rgb: '054D28' }, patternType: 'solid' }, alignment: { horizontal: 'center' } },
        sub: { font: { sz: 10, color: { rgb: '555555' } } },
        groupHead: { font: { bold: true, sz: 12, color: { rgb: 'FFFFFF' } }, fill: { fgColor: { rgb: '0F7A41' }, patternType: 'solid' } },
        colHead: { font: { bold: true, color: { rgb: 'FFFFFF' } }, fill: { fgColor: { rgb: 'C9940A' }, patternType: 'solid' }, alignment: { horizontal: 'center' }, border: thinBorder },
        dataRow: { border: thinBorder },
        subTotal: { font: { bold: true }, fill: { fgColor: { rgb: 'E8F3EC' }, patternType: 'solid' }, border: thinBorder }
    };

    const cell = (v, styleKey) => ({ v: v ?? '', t: typeof v === 'number' ? 'n' : 's', s: styleKey ? S[styleKey] : undefined });

    const sheetRows = [];
    const merges = [];
    const addRow = (cells) => { sheetRows.push(cells); };

    addRow([cell(L.appTitle || 'Umrah Transport Management System', 'title')]);
    merges.push({ s: { r: sheetRows.length - 1, c: 0 }, e: { r: sheetRows.length - 1, c: 7 } });

    const ledgerTitle = (L.ledgerTitle || 'Party Ledger').replace(/📒/g, '').trim();
    const subTitle = selParty || (L.selectAll || 'All Parties').replace(/--/g, '').trim();
    addRow([cell(`${ledgerTitle} — ${subTitle}`, 'sub')]);
    merges.push({ s: { r: sheetRows.length - 1, c: 0 }, e: { r: sheetRows.length - 1, c: 7 } });

    if (from || to) {
        addRow([cell(`📅 ${from ? fd(from) : '...'} ${L_arrow()} ${to ? fd(to) : '...'}`, 'sub')]);
        merges.push({ s: { r: sheetRows.length - 1, c: 0 }, e: { r: sheetRows.length - 1, c: 7 } });
    }

    addRow([cell('')]);

    const headers = [L.voucherCol, L.dateCol, L.txType, L.desc, L.debitCol, L.creditCol, L.balance, L.notesCol];

    pList.forEach(party => {
        let recs = [...records].filter(r => r.party === party);
        let pays = [...payments].filter(p => p.party === party);

        if (from) { recs = recs.filter(r => r.date >= from); pays = pays.filter(p => p.date >= from); }
        if (to) { recs = recs.filter(r => r.date <= to); pays = pays.filter(p => p.date <= to); }

        const txns = [
            ...recs.map(r => ({ date: r.date, type: 'debit', voucher: r.voucher || '—', desc: `${L.sectorRef} ${r.sector} (${r.count} ${L.hujPerSector} ${sar(r.fare)})`, amount: r.total, notes: r.notes || '' })),
            ...pays.map(p => ({ date: p.date, type: 'credit', voucher: '—', desc: `${L.payMethodRef} ${getMethodLabel(p.method)}`, amount: p.amount, notes: p.notes || '' }))
        ].sort((a, b) => a.date.localeCompare(b.date));

        if (txns.length === 0) return;

        const totalDebit = recs.reduce((s, r) => s + r.total, 0);
        const totalCredit = pays.reduce((s, p) => s + p.amount, 0);
        const balance = totalCredit - totalDebit;

        addRow([cell(`📌 ${party} [${getCode(party)}]`, 'groupHead')]);
        merges.push({ s: { r: sheetRows.length - 1, c: 0 }, e: { r: sheetRows.length - 1, c: 7 } });

        addRow(headers.map(h => cell(h, 'colHead')));

        let running = 0;
        txns.forEach(tx => {
            if (tx.type === 'debit') running -= tx.amount;
            else running += tx.amount;

            addRow([
                cell(tx.voucher, 'dataRow'),
                cell(fd(tx.date), 'dataRow'),
                cell(tx.type === 'debit' ? (L.debitTx || 'Debit').replace(/[📤📥]/g, '').trim() : (L.creditTx || 'Credit').replace(/[📤📥]/g, '').trim(), 'dataRow'),
                cell(tx.desc, 'dataRow'),
                cell(tx.type === 'debit' ? tx.amount : '', 'dataRow'),
                cell(tx.type === 'credit' ? tx.amount : '', 'dataRow'),
                cell(Math.abs(running), 'dataRow'),
                cell(tx.notes, 'dataRow')
            ]);
        });

        addRow([
            cell(L.subTotal, 'subTotal'), cell('', 'subTotal'), cell('', 'subTotal'), cell('', 'subTotal'),
            cell(totalDebit, 'subTotal'), cell(totalCredit, 'subTotal'), cell(balance, 'subTotal'), cell('', 'subTotal')
        ]);

        addRow([cell('')]);
    });

    if (sheetRows.length <= 5) {
        al('al-login', L.noData || 'کوئی ڈیٹا نہیں', 'er');
        return;
    }

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
        { wch: 14 }, { wch: 12 }, { wch: 10 }, { wch: 35 }, { wch: 14 },
        { wch: 14 }, { wch: 14 }, { wch: 20 }
    ];
    ws['!merges'] = merges;

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Ledger');

    const dateStamp = new Date().toISOString().slice(0, 10);
    XLSX.writeFile(wb, `Ledger_${selParty || 'All'}_${dateStamp}.xlsx`);
}