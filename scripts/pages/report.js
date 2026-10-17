// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  REPORT CENTER — Handcrafted & Theme Aligned
//  Light + Dark Mode Ready · Multilingual (Urdu / English / Arabic)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function toggleReportParty() {
    const typeEl = document.getElementById('r-type');
    if (!typeEl) return;
    const type = typeEl.value;
    const wrap = document.getElementById('r-party-wrap');
    const lbl = document.getElementById('lbl-rparty');
    const L = (typeof T !== 'undefined' && T[lang]) ? T[lang] : (T.ur || {});

    if (type === 'party') {
        if (wrap) wrap.style.display = 'block';
        if (lbl) lbl.textContent = L.byTransporter || L.partyCol || 'ٹرانسپورٹر منتخب کریں';
        if (typeof fillDrop === 'function' && typeof parties !== 'undefined') {
            fillDrop('r-party', parties, true);
        }
    } else if (type === 'newparty') {
        if (wrap) wrap.style.display = 'block';
        if (lbl) lbl.textContent = L.byParty || L.hajiParty || 'پارٹی منتخب کریں';
        const hList = (typeof hajiParties !== 'undefined' && Array.isArray(hajiParties)) ? hajiParties : [];
        if (typeof fillDrop === 'function') {
            fillDrop('r-party', hList, true);
        }
    } else {
        if (wrap) wrap.style.display = 'none';
        const sel = document.getElementById('r-party');
        if (sel) sel.value = '';
    }
}

function clearReportFilter() {
    const fromEl = document.getElementById('r-from');
    const toEl = document.getElementById('r-to');
    const typeEl = document.getElementById('r-type');
    const partyEl = document.getElementById('r-party');

    if (fromEl) fromEl.value = '';
    if (toEl) toEl.value = '';
    if (typeEl) typeEl.value = 'date';
    if (partyEl) partyEl.value = '';

    toggleReportParty();
    genReport();
}

function genReport() {
    const L = (typeof T !== 'undefined' && T[lang]) ? T[lang] : (T.ur || {});
    const fromEl = document.getElementById('r-from');
    const toEl = document.getElementById('r-to');
    const typeEl = document.getElementById('r-type');
    const rPartyEl = document.getElementById('r-party');
    const out = document.getElementById('rep-out');

    if (!out) return;

    const from = fromEl ? fromEl.value : '';
    const to = toEl ? toEl.value : '';
    const type = typeEl ? typeEl.value : 'date';
    const rParty = rPartyEl ? rPartyEl.value : '';

    // Update print header meta
    const rangeSpan = document.getElementById('rep-print-range');
    const dateSpan = document.getElementById('rep-print-date');
    if (rangeSpan) {
        rangeSpan.textContent = (from || to) 
            ? `${from ? (typeof fd === 'function' ? fd(from) : from) : '...'} ➜ ${to ? (typeof fd === 'function' ? fd(to) : to) : '...'}` 
            : (L.allRecords || 'تمام ریکارڈز');
    }
    if (dateSpan) {
        dateSpan.textContent = (typeof fd === 'function' && typeof today === 'function') ? fd(today()) : new Date().toLocaleDateString();
    }

    let rows = (typeof records !== 'undefined' && Array.isArray(records)) ? [...records] : [];
    let pays = (typeof payments !== 'undefined' && Array.isArray(payments)) ? [...payments] : [];

    // Date range filter
    if (from) {
        rows = rows.filter(r => r.date && r.date >= from);
        pays = pays.filter(p => p.date && p.date >= from);
    }
    if (to) {
        rows = rows.filter(r => r.date && r.date <= to);
        pays = pays.filter(p => p.date && p.date <= to);
    }

    // Party filter
    if (type === 'party' && rParty) {
        const match = (p) => (p || '').trim().toLowerCase() === rParty.trim().toLowerCase();
        rows = rows.filter(r => match(r.party));
        pays = pays.filter(p => match(p.party));
    } else if (type === 'newparty' && rParty) {
        const match = (p) => (p || '').trim().toLowerCase() === rParty.trim().toLowerCase();
        rows = rows.filter(r => match(r.newParty));
    }

    // Empty state
    if (!rows.length && !pays.length) {
        out.innerHTML = `
        <div class="report-empty">
            <div class="report-empty-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                    <line x1="16" y1="13" x2="8" y2="13"/>
                    <line x1="16" y1="17" x2="8" y2="17"/>
                </svg>
            </div>
            <div style="font-size:14px; font-weight:700;">${L.noData || 'کوئی ریکارڈ یا ڈیٹا دستیاب نہیں ہے'}</div>
            <div style="font-size:12px; opacity:0.8; margin-top:4px;">مطلوبہ تاریخ یا فلٹر تبدیل کر کے دوبارہ کوشش کریں</div>
        </div>`;
        return;
    }

    const lbl = {
        date: L.byDate || 'تاریخ وائز',
        party: L.byTransporter || 'ٹرانسپورٹر وائز',
        newparty: L.byParty || 'پارٹی وائز',
        sector: L.bySector || 'سیکٹر وائز'
    };

    // Grouping
    const groups = {};
    rows.forEach(r => {
        let k = '';
        if (type === 'date') k = (typeof fd === 'function') ? fd(r.date) : r.date;
        else if (type === 'party') k = r.party || '—';
        else if (type === 'newparty') k = r.newParty || '—';
        else k = r.sector || '—';

        if (!groups[k]) groups[k] = [];
        groups[k].push(r);
    });

    // If grouping by party or date, also capture payment groups that have no records
    if (type === 'party') {
        pays.forEach(p => {
            const k = p.party || '—';
            if (!groups[k]) groups[k] = [];
        });
    } else if (type === 'date') {
        pays.forEach(p => {
            const k = (typeof fd === 'function') ? fd(p.date) : p.date;
            if (!groups[k]) groups[k] = [];
        });
    }

    let html = '';

    Object.entries(groups).sort((a, b) => a[0].localeCompare(b[0])).forEach(([k, items]) => {
        const sT = items.reduce((s, r) => s + (Number(r.total) || 0), 0); // Total Debit
        const sH = items.reduce((s, r) => s + (Number(r.count) || 0), 0); // Total Hujjaj

        let pItems = [];
        if (type === 'party') {
            pItems = pays.filter(p => (p.party || '').trim().toLowerCase() === k.trim().toLowerCase());
        } else if (type === 'date') {
            pItems = pays.filter(p => ((typeof fd === 'function') ? fd(p.date) : p.date) === k);
        }

        const sC = pItems.reduce((s, p) => s + (Number(p.amount) || 0), 0); // Total Credit
        const sBal = sC - sT;

        // Combine debits & credits chronologically
        const txns = [
            ...items.map(r => ({
                date: r.date,
                type: 'Debit',
                voucher: r.voucher || '—',
                desc: `${r.party || ''} | ${r.sector || ''} | ${(typeof getTransportLabel === 'function' ? getTransportLabel(r.transport) : r.transport)} | ${r.count || 0} ${L.hujjaj || 'حاجی'} @ ${(typeof sar === 'function' ? sar(r.fare) : r.fare)}`,
                amount: Number(r.total) || 0
            })),
            ...pItems.map(p => ({
                date: p.date,
                type: 'Credit',
                voucher: '—',
                desc: `${p.party || ''} | ${(typeof getMethodLabel === 'function' ? getMethodLabel(p.method) : p.method)} ${p.notes ? '— ' + p.notes : ''}`.trim(),
                amount: Number(p.amount) || 0
            }))
        ].sort((a, b) => (a.date || '').localeCompare(b.date || ''));

        let running = 0;
        const tblRows = txns.map(tx => {
            if (tx.type === 'Debit') running -= tx.amount;
            else running += tx.amount;

            const sign = running >= 0 ? '' : '-';
            const isDebit = (tx.type === 'Debit');
            const typeBadge = isDebit 
                ? `<span class="badge-rep-type debit">${L.debitTx || 'واجب'}</span>` 
                : `<span class="badge-rep-type credit">${L.creditTx || 'وصول'}</span>`;
            const balClass = running >= 0 ? 'amt-pos' : 'amt-neg';

            return `<tr>
                <td class="col-date">${(typeof fd === 'function') ? fd(tx.date) : tx.date}</td>
                <td>${typeBadge}</td>
                <td class="col-code">${tx.voucher}</td>
                <td>${tx.desc}</td>
                <td class="col-num amt-debit">${isDebit ? (typeof sar === 'function' ? sar(tx.amount) : tx.amount) : '—'}</td>
                <td class="col-num amt-credit">${!isDebit ? (typeof sar === 'function' ? sar(tx.amount) : tx.amount) : '—'}</td>
                <td class="col-num ${balClass}">${sign}${(typeof sar === 'function' ? sar(Math.abs(running)) : Math.abs(running))}</td>
            </tr>`;
        }).join('');

        const balSign = sBal >= 0 ? '' : '-';
        const partyCode = (type === 'party' && typeof getCode === 'function') ? getCode(k) : '';

        html += `
        <div class="report-group-card">
            <div class="report-group-header">
                <div class="report-group-title-wrap">
                    <span class="report-group-badge">${lbl[type] || 'رپورٹ'}</span>
                    <h3 class="report-group-title">${k} ${partyCode ? `<span class="col-code">(${partyCode})</span>` : ''}</h3>
                </div>
                <div class="report-group-balance ${sBal >= 0 ? 'pos' : 'neg'}">
                    <span>${L.balance || 'بیلنس'}:</span>
                    <strong>${balSign}${(typeof sar === 'function' ? sar(Math.abs(sBal)) : Math.abs(sBal))}</strong>
                </div>
            </div>

            <div class="report-meta-strip">
                <div class="report-meta-item">
                    <span class="report-meta-label">${L.fromDate || 'مدت'}:</span>
                    <span class="report-meta-value">${from ? (typeof fd === 'function' ? fd(from) : from) : '...'} ➜ ${to ? (typeof fd === 'function' ? fd(to) : to) : '...'}</span>
                </div>
                <div class="report-meta-item">
                    <span class="report-meta-label">${L.totalRec || 'کل ریکارڈ'}:</span>
                    <span class="report-meta-value">${txns.length}</span>
                </div>
                <div class="report-meta-item">
                    <span class="report-meta-label">${L.totalHujjaj || 'کل حاجی'}:</span>
                    <span class="report-meta-value">${sH}</span>
                </div>
                <div class="report-meta-item">
                    <span class="report-meta-label">${L.dateCol || 'تاریخ پرنٹ'}:</span>
                    <span class="report-meta-value">${(typeof fd === 'function' && typeof today === 'function') ? fd(today()) : new Date().toLocaleDateString()}</span>
                </div>
            </div>

            <div class="report-tbl-wrap">
                <table class="report-tbl">
                    <thead>
                        <tr>
                            <th style="width: 100px;">${L.dateCol || 'تاریخ'}</th>
                            <th style="width: 80px;">${L.txType || 'قسم'}</th>
                            <th style="width: 90px;">${L.voucherCol || 'واؤچر #'}</th>
                            <th>${L.desc || 'تفصیلات'}</th>
                            <th style="width: 120px; text-align: end;">${L.debitCol || 'واجب (SAR)'}</th>
                            <th style="width: 120px; text-align: end;">${L.creditCol || 'وصول (SAR)'}</th>
                            <th style="width: 120px; text-align: end;">${L.balance || 'بقایا (SAR)'}</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${tblRows}
                        <tr class="report-subtotal-row">
                            <td colspan="4">
                                <strong>${L.subTotal || 'میزان'}</strong> — ${L.totalHujjaj || 'کل حاجی'}: <strong>${sH}</strong>
                            </td>
                            <td class="col-num amt-debit">${typeof sar === 'function' ? sar(sT) : sT}</td>
                            <td class="col-num amt-credit">${typeof sar === 'function' ? sar(sC) : sC}</td>
                            <td class="col-num ${sBal >= 0 ? 'amt-pos' : 'amt-neg'}">${sBal >= 0 ? '' : '-'}${typeof sar === 'function' ? sar(Math.abs(sBal)) : Math.abs(sBal)}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>`;
    });

    const gT = rows.reduce((s, r) => s + (Number(r.total) || 0), 0); // Total Debit
    const gH = rows.reduce((s, r) => s + (Number(r.count) || 0), 0); // Total Hujjaj
    const gC = pays.reduce((s, p) => s + (Number(p.amount) || 0), 0); // Total Credit
    const gBal = gC - gT; // Net Balance

    if (Object.keys(groups).length > 1) {
        html += `
        <div class="report-grand-card">
            <div class="report-grand-header">
                <div class="report-grand-title">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                    </svg>
                    <span>${L.grandSummary || 'گرینڈ سمری رپورٹ (Grand Summary)'}</span>
                </div>
            </div>
            <div class="report-grand-grid">
                <div class="report-grand-item">
                    <span class="report-grand-lbl">${L.totalHujjaj || 'کل حاجی (Total Hujjaj)'}</span>
                    <span class="report-grand-val">${gH}</span>
                </div>
                <div class="report-grand-item">
                    <span class="report-grand-lbl">${L.totalDebit || 'کل واجب (Total Debit)'}</span>
                    <span class="report-grand-val amt-debit">${typeof sar === 'function' ? sar(gT) : gT}</span>
                </div>
                <div class="report-grand-item">
                    <span class="report-grand-lbl">${L.totalCredit || 'کل وصول (Total Credit)'}</span>
                    <span class="report-grand-val amt-credit">${typeof sar === 'function' ? sar(gC) : gC}</span>
                </div>
                <div class="report-grand-item">
                    <span class="report-grand-lbl">${L.balance || 'خالص بقایا (Net Balance)'}</span>
                    <span class="report-grand-val ${gBal >= 0 ? 'amt-pos' : 'amt-neg'}">${gBal >= 0 ? '' : '-'}${typeof sar === 'function' ? sar(Math.abs(gBal)) : Math.abs(gBal)}</span>
                </div>
            </div>
        </div>`;
    }

    out.innerHTML = html;
}