// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  LEDGER — REDESIGNED
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function clearLedgerFilter() {
    document.getElementById('l-party').value = '';
    document.getElementById('l-from').value = '';
    document.getElementById('l-to').value = '';
    renderLedger();
}

function renderLedger() {
    const L = T[lang] || T.ur;
    const selParty = document.getElementById('l-party').value;
    const from = document.getElementById('l-from').value;
    const to = document.getElementById('l-to').value;
    const out = document.getElementById('ledger-output');
    const pList = selParty ? [selParty] : parties;
    if (!pList.length) { out.innerHTML = `<div class="empty"><div class="ico">📒</div>${L.noData}</div>`; return; }

    let summaryHtml = '';
    if (!selParty && parties.length) {
        let sumRecs = [...records];
        let sumPays = [...payments];
        if (from) { sumRecs = sumRecs.filter(r => r.date >= from); sumPays = sumPays.filter(p => p.date >= from); }
        if (to) { sumRecs = sumRecs.filter(r => r.date <= to); sumPays = sumPays.filter(p => p.date <= to); }

        let tDr = 0, tCr = 0;
        const summaryRows = parties.map(party => {
            const ovDebit = sumRecs.filter(r => r.party === party).reduce((s, r) => s + r.total, 0);
            const ovCredit = sumPays.filter(p => p.party === party).reduce((s, p) => s + p.amount, 0);
            const ovBal = ovCredit - ovDebit;
            if (ovDebit === 0 && ovCredit === 0 && (from || to)) return '';
            tDr += ovDebit; tCr += ovCredit;
            return `<tr><td style="padding:4px;">${getCode(party)}</td><td style="padding:4px;">${party}</td>
        <td style="padding:4px;text-align:right;">${sar(ovDebit)}</td><td style="padding:4px;text-align:right;">${sar(ovCredit)}</td>
        <td style="padding:4px;text-align:right;">${ovBal >= 0 ? '' : '-'}${sar(Math.abs(ovBal))}</td></tr>`;
        }).filter(Boolean).join('');

        if (summaryRows) {
            summaryHtml = `
            <div style="font-family: sans-serif; color: #000; background: #fff; padding: 10px; border: 1px solid #ccc; margin-bottom: 20px;">
                <div style="background-color: #ebf5fb; border: 1px solid #000; text-align: center; padding: 5px; font-weight: bold; font-size: 16px; margin-bottom: 15px;">
                    Ledger Summary
                </div>
                <table style="width: 100%; border: none; font-size: 12px; margin-bottom: 15px;">
                    <tr><td style="font-weight: bold; width: 100px;">Period:</td><td>${from ? fd(from) : '...'} To ${to ? fd(to) : '...'}</td></tr>
                    <tr><td style="font-weight: bold;">Print Date:</td><td>${fd(today())}</td></tr>
                </table>
                <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
                    <thead>
                        <tr style="border-top: 1px solid #000; border-bottom: 1px solid #000;">
                            <th style="text-align: left; padding: 4px;">Code</th>
                            <th style="text-align: left; padding: 4px;">Party</th>
                            <th style="text-align: right; padding: 4px;">Debit</th>
                            <th style="text-align: right; padding: 4px;">Credit</th>
                            <th style="text-align: right; padding: 4px;">Balance</th>
                        </tr>
                        <tr style="border-top: 1px dashed #000; font-weight: bold; page-break-inside: avoid;">
                            <td colspan="2" style="padding: 6px 4px;"></td>
                            <td colspan="3" style="text-align: right; padding: 6px 4px;">Total Amount SAR:</td>
                            <td style="text-align: right; padding: 6px 4px;">${sar(tDr)}</td>
                            <td style="text-align: right; padding: 6px 4px;">${sar(tCr)}</td>
                            <td style="text-align: right; padding: 6px 4px;">${(tCr - tDr) >= 0 ? '' : '-'}${sar(Math.abs(tCr - tDr))}</td>
                        </tr>
                    </tbody>
                </table>
            </div>`;
        }
    }

    let html = '';
    pList.forEach(party => {
        let recs = [...records].filter(r => r.party === party);
        let pays = [...payments].filter(p => p.party === party);
        const overallDebit = records.filter(r => r.party === party).reduce((s, r) => s + r.total, 0);
        const overallCredit = payments.filter(p => p.party === party).reduce((s, p) => s + p.amount, 0);
        const overallBal = overallCredit - overallDebit;

        if (from) { recs = recs.filter(r => r.date >= from); pays = pays.filter(p => p.date >= from); }
        if (to) { recs = recs.filter(r => r.date <= to); pays = pays.filter(p => p.date <= to); }

        const totalDebit = recs.reduce((s, r) => s + r.total, 0);
        const totalCredit = pays.reduce((s, p) => s + p.amount, 0);
        const totalHujjaj = recs.reduce((s, r) => s + r.count, 0);
        const balance = totalCredit - totalDebit;

        const txns = [
            ...recs.map(r => ({ date: r.date, type: 'Debit', voucher: r.voucher || '—', desc: `${r.sector} (${r.count} ${L.hujPerSector} ${sar(r.fare)}) ${r.notes || ''}`.trim(), amount: r.total, count: r.count })),
            ...pays.map(p => ({ date: p.date, type: 'Credit', voucher: '—', desc: `${getMethodLabel(p.method)} ${p.notes || ''}`.trim(), amount: p.amount, count: 0 }))
        ].sort((a, b) => a.date.localeCompare(b.date));

        let running = 0;
        const rows = txns.map((tx) => {
            if (tx.type === 'Debit') running -= tx.amount;
            else running += tx.amount;
            const sign = running >= 0 ? '' : '-';
            return `<tr>
            <td style="padding:4px;">${fd(tx.date)}</td>
            <td style="padding:4px;">${tx.type}</td>
            <td style="padding:4px;">${tx.voucher}</td>
            <td style="padding:4px;">${tx.desc}</td>
            <td style="padding:4px;">—</td>
            <td style="padding:4px;text-align:right;">${tx.type === 'Debit' ? sar(tx.amount) : ''}</td>
            <td style="padding:4px;text-align:right;">${tx.type === 'Credit' ? sar(tx.amount) : ''}</td>
            <td style="padding:4px;text-align:right;">${sign}${sar(Math.abs(running))}</td>
            </tr>`;
        }).join('');

        if(txns.length > 0 || (from || to)){
            const balSign = overallBal >= 0 ? '' : '-';
            html += `
            <div style="font-family: sans-serif; color: #000; background: #fff; padding: 10px; border: 1px solid #ccc; margin-bottom: 20px;">
                <div style="background-color: #ebf5fb; border: 1px solid #000; text-align: center; padding: 5px; font-weight: bold; font-size: 16px; margin-bottom: 15px;">
                    Account Ledger
                </div>
                <table style="width: 100%; border: none; font-size: 12px; margin-bottom: 15px;">
                    <tr>
                        <td style="font-weight: bold; width: 120px;">Account Code:</td>
                        <td>${getCode(party)}</td>
                        <td style="font-weight: bold; text-align: right; width: 100px;">Balance SAR:</td>
                        <td style="text-align: right; font-weight: bold; width: 100px;">${balSign}${sar(Math.abs(overallBal))}</td>
                    </tr>
                    <tr>
                        <td style="font-weight: bold;">Account Title:</td>
                        <td colspan="3">${party}</td>
                    </tr>
                    <tr>
                        <td style="font-weight: bold;">Period:</td>
                        <td colspan="3">${from ? fd(from) : '...'} &nbsp;&nbsp;&nbsp; To: ${to ? fd(to) : '...'}</td>
                    </tr>
                    <tr>
                        <td style="font-weight: bold;">Print Date:</td>
                        <td colspan="3">${fd(today())}</td>
                    </tr>
                </table>

                <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
                    <thead>
                        <tr style="border-top: 1px solid #000; border-bottom: 1px solid #000;">
                            <th style="text-align: left; padding: 4px;">Date</th>
                            <th style="text-align: left; padding: 4px;">Type</th>
                            <th style="text-align: left; padding: 4px;">Trans.#</th>
                            <th style="text-align: left; padding: 4px;">Particulars</th>
                            <th style="text-align: left; padding: 4px;">Inv/Ref</th>
                            <th style="text-align: right; padding: 4px;">Debit</th>
                            <th style="text-align: right; padding: 4px;">Credit</th>
                            <th style="text-align: right; padding: 4px;">Balance</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${rows}
                        <tr style="border-top: 1px dashed #000; font-weight: bold; page-break-inside: avoid;">
                            <td colspan="4" style="padding: 6px 4px;">Total Hujjaj: ${totalHujjaj}</td>
                            <td style="text-align: right; padding: 6px 4px;">Total Amount SAR:</td>
                            <td style="text-align: right; padding: 6px 4px;">${sar(totalDebit)}</td>
                            <td style="text-align: right; padding: 6px 4px;">${sar(totalCredit)}</td>
                            <td style="text-align: right; padding: 6px 4px;">${balance >= 0 ? '' : '-'}${sar(Math.abs(balance))}</td>
                        </tr>
                    </tbody>
                </table>
            </div>`;
        }
    });

    out.innerHTML = summaryHtml + (html || `<div class="empty"><div class="ico">📒</div>${L.noData}</div>`);
}
