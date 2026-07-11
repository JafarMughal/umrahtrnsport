// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  RECORDS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function renderRecHead() {
    // No-op: the records header is now built inside renderRecords along with the full HTML table.
}

function renderRecords(rows) {
    const L = T[lang] || T.ur;
    const out = document.getElementById('rec-output');

    if (!rows.length) { 
        out.innerHTML = `<div class="empty"><div class="ico">📂</div>${L.noRec}</div>`; 
        return; 
    }
    
    const s = [...rows].sort((a, b) => b.date.localeCompare(a.date));
    
    let tCount = 0; // total hujjaj
    let tAmount = 0; // total amount
    
    const tblRows = s.map(r => {
        const sharing = r.mode === 'sharing' || isSharing(r.transport);
        if (sharing) tCount += r.count;
        tAmount += r.total;
        
        const modeTag = sharing ? `<span style="background:#E8F5E9;color:#2E7D32;padding:2px 8px;border-radius:10px;font-size:10px;font-weight:600;">🚌 ${L.typeSharing}</span>`
            : `<span style="background:#FFF8E1;color:#E65100;padding:2px 8px;border-radius:10px;font-size:10px;font-weight:600;">🚐 ${L.typeWhole}</span>`;
            
        return `
            <tr>
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
                <td style="padding:4px;" class="no-print"><button class="btn btn-sm btn-o" onclick="editRecord('${r.id}')">${L.edit}</button></td>
            </tr>
        `;
    }).join('');

    const html = `
    <div style="font-family: sans-serif; color: #000; background: #fff; padding: 10px; border: 1px solid #ccc; margin-bottom: 20px;">
        <div style="background-color: #ebf5fb; border: 1px solid #000; text-align: center; padding: 5px; font-weight: bold; font-size: 16px; margin-bottom: 15px;">
            All Records 📋
        </div>
        
        <table style="width: 100%; border: none; font-size: 12px; margin-bottom: 15px;">
            <tr>
                <td style="font-weight: bold; width: 120px;">Total Records:</td>
                <td>${rows.length}</td>
                <td style="font-weight: bold; text-align: right; width: 100px;">Total Amount:</td>
                <td style="text-align: right; font-weight: bold; width: 100px;">${sar(tAmount)}</td>
            </tr>
            <tr>
                <td style="font-weight: bold;">Total Hujjaj:</td>
                <td colspan="3">${tCount}</td>
            </tr>
            <tr>
                <td style="font-weight: bold;">Print Date:</td>
                <td colspan="3">${fd(today())}</td>
            </tr>
        </table>

        <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
            <thead>
                <tr style="border-top: 1px solid #000; border-bottom: 1px solid #000;">
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
            </thead>
            <tbody>
                ${tblRows}
                <tr style="border-top: 1px dashed #000; font-weight: bold; page-break-inside: avoid;">
                    <td colspan="7" style="padding: 6px 4px; text-align: right;">Grand Total:</td>
                    <td style="padding: 6px 4px; text-align: center;">${tCount}</td>
                    <td colspan="2" style="padding: 6px 4px;"></td>
                    <td style="padding: 6px 4px; text-align: right;">${sar(tAmount)}</td>
                    <td class="no-print"></td>
                </tr>
            </tbody>
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