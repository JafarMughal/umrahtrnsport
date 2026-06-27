// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  LEDGER
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

        const summaryRows = parties.map(party => {
            const ovDebit = sumRecs.filter(r => r.party === party).reduce((s, r) => s + r.total, 0);
            const ovCredit = sumPays.filter(p => p.party === party).reduce((s, p) => s + p.amount, 0);
            const ovBal = ovCredit - ovDebit;
            if (ovDebit === 0 && ovCredit === 0 && (from || to)) return '';
            const ovBalClass = ovBal >= 0 ? 'led-pos' : 'led-neg';
            const ovBalText = ovBal >= 0 ? `+${sar(ovBal)}` : `-${sar(Math.abs(ovBal))}`;
            const statusLabel = ovBal >= 0 ? L.surplus : L.owing;
            return `<tr><td><span class="party-code">${getCode(party)}</span></td><td><strong>${party}</strong></td>
        <td class="led-dr">${sar(ovDebit)}</td><td class="led-cr">${sar(ovCredit)}</td>
        <td class="${ovBalClass}">${ovBalText} <span style="font-size:10px;color:var(--muted);">(${statusLabel})</span></td></tr>`;
        }).filter(Boolean).join('');

        if (summaryRows) {
            const rangeText = (from || to) ? ` (${from ? fd(from) : '...'} ➜ ${to ? fd(to) : '...'})` : ` (${L.selectAll})`;
            const summaryHeading = (from || to) ? L.balance + rangeText : L.overallBalance + rangeText;
            summaryHtml = `<div class="card summary-card" style="margin-bottom:20px;"><h3 style="font-size:14px;color:var(--green-dark);margin-bottom:12px;display:flex;align-items:center;gap:6px;">📊 ${summaryHeading}</h3>
        <div class="tbl-wrap"><table><thead><tr><th>${L.codeCol}</th><th>${L.partyCol}</th><th>${L.totalDebit}</th><th>${L.totalCredit}</th><th>${L.balance}</th></tr></thead><tbody>${summaryRows}</tbody></table></div></div>`;
        }
    }

    let html = '';
    pList.forEach(party => {
        let recs = [...records].filter(r => r.party === party);
        let pays = [...payments].filter(p => p.party === party);
        const overallDebit = records.filter(r => r.party === party).reduce((s, r) => s + r.total, 0);
        const overallCredit = payments.filter(p => p.party === party).reduce((s, p) => s + p.amount, 0);
        const overallBal = overallCredit - overallDebit;
        const overallBalClass = overallBal >= 0 ? 'led-pos' : 'led-neg';
        const overallBalText = overallBal >= 0 ? `${L.surplus}: ${sar(overallBal)} SAR` : `${L.owing}: ${sar(Math.abs(overallBal))} SAR`;
        if (from) { recs = recs.filter(r => r.date >= from); pays = pays.filter(p => p.date >= from); }
        if (to) { recs = recs.filter(r => r.date <= to); pays = pays.filter(p => p.date <= to); }
        const totalDebit = recs.reduce((s, r) => s + r.total, 0);
        const totalCredit = pays.reduce((s, p) => s + p.amount, 0);
        const balance = totalCredit - totalDebit;
        const txns = [
            ...recs.map(r => ({ date: r.date, type: 'debit', voucher: r.voucher || '—', desc: `${r.sector} (${r.count} ${L.hujPerSector} ${sar(r.fare)})`, amount: r.total, notes: r.notes || '' })),
            ...pays.map(p => ({ date: p.date, type: 'credit', voucher: '—', desc: `${L.payMethodRef} ${getMethodLabel(p.method)}`, amount: p.amount, notes: p.notes || '' }))
        ].sort((a, b) => a.date.localeCompare(b.date));
        let running = 0;
        const rows = txns.map((tx) => {
            if (tx.type === 'debit') running -= tx.amount;
            else running += tx.amount;
            const bc = running >= 0 ? 'led-pos' : 'led-neg';
            return `<tr><td><span style="font-family:monospace;font-size:11px;font-weight:700;color:var(--green-dark);">${tx.voucher}</span></td>
        <td>${fd(tx.date)}</td><td>${tx.type === 'debit' ? `<span style="color:var(--red);">${L.debitTx}</span>` : `<span style="color:#1565C0;">${L.creditTx}</span>`}</td>
        <td style="font-size:11px;">${tx.desc}</td>
        <td class="${tx.type === 'debit' ? 'led-dr' : ''}">${tx.type === 'debit' ? sar(tx.amount) : '—'}</td>
        <td class="${tx.type === 'credit' ? 'led-cr' : ''}">${tx.type === 'credit' ? sar(tx.amount) : '—'}</td>
        <td class="${bc}">${running >= 0 ? '+' : '-'}${sar(Math.abs(running))}</td>
        <td style="font-size:10px;color:var(--muted);">${tx.notes || '—'}</td></tr>`;
        }).join('');
        const balClass = balance >= 0 ? 'led-pos' : 'led-neg';
        const balText = balance >= 0 ? `${L.surplus}: ${sar(balance)} SAR` : `${L.owing}: ${sar(Math.abs(balance))} SAR`;
        html += `<div style="margin-bottom:20px;">
      <div style="background:var(--green-dark);color:#fff;padding:8px 12px;border-radius:8px 8px 0 0;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:6px;">
        <strong style="font-size:13px;">👥 <span style="background:var(--gold);padding:2px 8px;border-radius:10px;font-size:10px;font-family:monospace;">${getCode(party)}</span> ${party}</strong>
        <div style="display:flex;gap:12px;flex-wrap:wrap;font-size:10px;align-items:center;">
          <span>${L.totalDebit}: <strong style="color:#ffb3b3;">${sar(totalDebit)} SAR</strong></span>
          <span>${L.totalCredit}: <strong style="color:#b3ffcc;">${sar(totalCredit)} SAR</strong></span>
          <span class="${balClass}" style="${balance < 0 ? 'color:#ff9999' : 'color:#99ffcc'};font-size:11px;">${balText}</span>
          ${(from || to) ? '' : `<span class="overall-bal-badge" style="font-size:10px;"><span>${L.overallBalance}:</span>
            <strong class="${overallBalClass}" style="${overallBal < 0 ? 'color:#ff9999' : 'color:#99ffcc'}">${overallBalText}</strong></span>`}
        </div>
      </div>
      ${txns.length ? `<div style="overflow-x:auto;border:1px solid var(--border);border-top:none;border-radius:0 0 8px 8px;"><table class="ledger-tbl"><thead><tr>
        <th>${L.voucherCol}</th><th>${L.dateCol}</th><th>${L.txType}</th><th>${L.desc}</th>
        <th>${L.debitCol}</th><th>${L.creditCol}</th><th>${L.balance}</th><th>${L.notesCol}</th>
      </tr></thead><tbody>${rows}
        <tr style="background:var(--green-light);font-weight:600;"><td colspan="4" style="text-align:center;color:var(--green-dark);">${L.subTotal}</td>
        <td class="led-dr">${sar(totalDebit)}</td><td class="led-cr">${sar(totalCredit)}</td>
        <td class="${balClass}">${balance >= 0 ? '+' : ''}${sar(Math.abs(balance))}</td><td></td></tr>
      </tbody></table></div>` : `<div style="padding:14px;text-align:center;color:var(--muted);border:1px solid var(--border);border-top:none;border-radius:0 0 8px 8px;">${L.noTx}</div>`}
    </div>`;
    });
    out.innerHTML = summaryHtml + (html || `<div class="empty"><div class="ico">📒</div>${L.noData}</div>`);
}