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
    if (from) rows = rows.filter(r => r.date >= from);
    if (to) rows = rows.filter(r => r.date <= to);
    if (type === 'party' && rParty) rows = rows.filter(r => r.party === rParty);

    const out = document.getElementById('rep-out');
    if (!rows.length) { out.innerHTML = `<div class="empty"><div class="ico">📭</div>${L.noData}</div>`; return; }
    const lbl = { date: L.byDate, party: L.byParty, sector: L.bySector };
    const groups = {};
    rows.forEach(r => { const k = type === 'date' ? fd(r.date) : type === 'party' ? r.party : r.sector; if (!groups[k]) groups[k] = []; groups[k].push(r); });
    const gT = rows.reduce((s, r) => s + r.total, 0), gH = rows.reduce((s, r) => s + r.count, 0);
    let html = `<div style="margin-bottom:12px;padding:10px;background:var(--green-dark);color:#fff;border-radius:10px;display:flex;gap:14px;flex-wrap:wrap;">
    <div><div style="font-size:9px;opacity:.8;">${L.trips}</div><div style="font-size:16px;font-weight:700;">${rows.length}</div></div>
    <div><div style="font-size:9px;opacity:.8;">${L.hujjaj}</div><div style="font-size:16px;font-weight:700;">${gH}</div></div>
    <div><div style="font-size:9px;opacity:.8;">${L.amount}</div><div style="font-size:16px;font-weight:700;color:var(--gold-light);">${sar(gT)}</div></div>
    <div><div style="font-size:9px;opacity:.8;">${L.repKind}</div><div style="font-size:12px;font-weight:700;">${lbl[type]}</div></div>
  </div>`;
    Object.entries(groups).sort((a, b) => a[0].localeCompare(b[0])).forEach(([k, items]) => {
        const sT = items.reduce((s, r) => s + r.total, 0), sH = items.reduce((s, r) => s + r.count, 0);
        const codeTag = type === 'party' ? `<span class="party-code" style="margin-left:6px;margin-right:6px;">${getCode(k)}</span>` : '';
        html += `<div style="margin-bottom:12px;">
      <div style="background:var(--cream-dark);padding:6px 10px;border-radius:8px 8px 0 0;border:1px solid var(--border);display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:4px;">
        <strong style="font-size:13px;color:var(--green-dark);">📌 ${codeTag}${k}</strong>
        <span style="font-size:10px;color:var(--muted);">${L.trips}: ${items.length} | ${L.hujjaj}: ${sH} | ${L.amount}: <strong style="color:var(--green-dark);">${sar(sT)}</strong></span>
      </div>
      <div style="overflow-x:auto;border:1px solid var(--border);border-top:none;border-radius:0 0 8px 8px;">
        <table><thead><tr><th>${L.voucherCol}</th><th>${L.dateCol}</th><th>${L.codeCol}</th><th>${L.partyCol}</th><th>${L.sectorCol}</th><th>${L.transportCol}</th>
          <th>${L.hujjajCol}</th><th>${L.fareCol}</th><th>${L.totalCol}</th>
        </tr></thead><tbody>
          ${items.map(r => `<tr><td><span style="font-family:monospace;font-weight:700;font-size:10px;color:var(--green-dark);">${r.voucher || '—'}</span></td><td>${fd(r.date)}</td><td><span class="party-code">${getCode(r.party)}</span></td><td>${r.party}</td><td><span class="badge">${r.sector}</span></td>
            <td>${getTransportLabel(r.transport)}</td><td>${r.count}</td><td>${sar(r.fare)}</td>
            <td><strong style="color:var(--green-dark);">${sar(r.total)}</strong></td></tr>`).join('')}
          <tr style="background:var(--green-light);font-weight:600;"><td colspan="6" style="text-align:center;color:var(--green-dark);">${L.subTotal}</td>
            <td style="color:var(--green-dark);">${sH}</td><td>—</td><td style="color:var(--green-dark);">${sar(sT)}</td></tr>
        </tbody></table>
      </div></div>`;
    });
    out.innerHTML = html;
}