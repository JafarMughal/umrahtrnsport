// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  REPORT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function toggleReportParty() {
    const t = document.getElementById('r-type').value;
    document.getElementById('r-party-wrap').style.display = t === 'party' ? 'block' : 'none';
}

function genReport() {
    const L = T[lang] || T.ur;
    const from = document.getElementById('r-from').value, to = document.getElementById('r-to').value;
    const type = document.getElementById('r-type').value;
    const rParty = document.getElementById('r-party').value;

    let rows = [...records];
    let pays = [...payments];

    if (from) { rows = rows.filter(r => r.date >= from); pays = pays.filter(p => p.date >= from); }
    if (to) { rows = rows.filter(r => r.date <= to); pays = pays.filter(p => p.date <= to); }
    if (type === 'party' && rParty) { rows = rows.filter(r => r.party === rParty); pays = pays.filter(p => p.party === rParty); }

    const out = document.getElementById('rep-out');
    if (!rows.length && !pays.length) { out.innerHTML = `<div class="empty"><div class="ico">📭</div>${L.noData}</div>`; return; }

    const lbl = { date: L.byDate, party: L.byTransporter, newparty: L.byParty, sector: L.bySector };
    const groups = {};
    rows.forEach(r => { const k = type === 'date' ? fd(r.date) : type === 'party' ? r.party : type === 'newparty' ? (r.newParty || '—') : r.sector; if (!groups[k]) groups[k] = []; groups[k].push(r); });
    
    let html = '';
    
    Object.entries(groups).sort((a, b) => a[0].localeCompare(b[0])).forEach(([k, items]) => {
        const sT = items.reduce((s, r) => s + r.total, 0); // sub total debit
        const sH = items.reduce((s, r) => s + r.count, 0); // sub total hujjaj
        
        let pItems = [];
        if (type === 'party') pItems = pays.filter(p => p.party === k);
        else if (type === 'date') pItems = pays.filter(p => fd(p.date) === k);
        
        const sC = pItems.reduce((s, p) => s + p.amount, 0); // sub total credit
        const sBal = sC - sT;
        
        const txns = [
            ...items.map(r => ({ date: r.date, type: 'Debit', voucher: r.voucher || '—', desc: `${r.party} | ${r.sector} | ${getTransportLabel(r.transport)} | ${r.count} ${L.hujPerSector} @ ${sar(r.fare)}`, amount: r.total })),
            ...pItems.map(p => ({ date: p.date, type: 'Credit', voucher: '—', desc: `${p.party} | ${getMethodLabel(p.method)} ${p.notes || ''}`.trim(), amount: p.amount }))
        ].sort((a, b) => a.date.localeCompare(b.date));

        let running = 0;
        const tblRows = txns.map(tx => {
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

        const balSign = sBal >= 0 ? '' : '-';

        html += `
        <div style="font-family: sans-serif; color: #000; background: #fff; padding: 10px; border: 1px solid #ccc; margin-bottom: 20px;">
            <div style="background-color: #ebf5fb; border: 1px solid #000; text-align: center; padding: 5px; font-weight: bold; font-size: 16px; margin-bottom: 15px;">
                Report Center - ${lbl[type] || 'Report'}
            </div>
            <table style="width: 100%; border: none; font-size: 12px; margin-bottom: 15px;">
                <tr>
                    <td style="font-weight: bold; width: 120px;">Group Title:</td>
                    <td>${k} ${type === 'party' ? `(${getCode(k)})` : ''}</td>
                    <td style="font-weight: bold; text-align: right; width: 100px;">Balance SAR:</td>
                    <td style="text-align: right; font-weight: bold; width: 100px;">${balSign}${sar(Math.abs(sBal))}</td>
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
                        <tr style="border-top: 1px dashed #000; font-weight: bold; page-break-inside: avoid;">
                            <td colspan="4" style="padding: 6px 4px;">Total Hujjaj: ${sH}</td>
                            <td style="text-align: right; padding: 6px 4px;">Total Amount SAR:</td>
                            <td style="text-align: right; padding: 6px 4px;">${sar(sT)}</td>
                            <td style="text-align: right; padding: 6px 4px;">${sar(sC)}</td>
                            <td style="text-align: right; padding: 6px 4px;">${sBal >= 0 ? '' : '-'}${sar(Math.abs(sBal))}</td>
                        </tr>
                    </tbody>
                </table>
        </div>`;
    });

    const gT = rows.reduce((s, r) => s + r.total, 0); // Total Debit
    const gH = rows.reduce((s, r) => s + r.count, 0); // Total Hujjaj
    const gC = pays.reduce((s, p) => s + p.amount, 0); // Total Credit
    const gBal = gC - gT; // Balance

    if (Object.keys(groups).length > 1) {
        html += `
        <div style="font-family: sans-serif; color: #000; background: #fff; padding: 10px; border: 2px solid #000; margin-top: 20px;">
            <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
                <tbody>
                    <tr style="font-weight: bold; page-break-inside: avoid;">
                        <td style="padding: 6px 4px; text-align: left;">Grand Total Hujjaj: ${gH}</td>
                        <td style="text-align: right; padding: 6px 4px;">Grand Amount SAR:</td>
                        <td style="text-align: right; padding: 6px 4px; width: 80px;">${sar(gT)}</td>
                        <td style="text-align: right; padding: 6px 4px; width: 80px;">${sar(gC)}</td>
                        <td style="text-align: right; padding: 6px 4px; width: 80px;">${gBal >= 0 ? '' : '-'}${sar(Math.abs(gBal))}</td>
                    </tr>
                </tbody>
            </table>
        </div>`;
    }

    out.innerHTML = html;
}