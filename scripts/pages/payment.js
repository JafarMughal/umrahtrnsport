// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  PAYMENT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function renderPayHead() {
    const L = T[lang] || T.ur;
    document.getElementById('pay-head').innerHTML =
        `<th>${L.numCol}</th><th>${L.dateCol}</th><th>${L.codeCol}</th><th>${L.partyCol}</th><th>${L.received || 'SAR'}</th><th>${L.methodCol}</th><th>${L.notesCol}</th><th>${L.actionCol}</th>`;
}

function addPayment() {
    if (typeof canDo === 'function' && !canDo('payment')) {
        alert('⚠️ آپ کو ادائیگی درج کرنے کی اجازت نہیں ہے');
        return;
    }
    const L = T[lang] || T.ur;
    const date = document.getElementById('p-date').value;
    const party = document.getElementById('p-party').value;
    const amount = parseFloat(document.getElementById('p-amount').value) || 0;
    const method = document.getElementById('p-method').value;
    const notes = document.getElementById('p-notes').value.trim();
    if (!date || !party || amount <= 0) { al('al-pay', L.payRequired, 'er'); return; }
    payments.push({ id: uid(), date, party, amount, method, notes });
    svPy();
    al('al-pay', L.paySaved, 'ok');
    document.getElementById('p-amount').value = '';
    document.getElementById('p-notes').value = '';
    document.getElementById('p-date').value = today();
    const pPartyEl = document.getElementById('p-party');
    if (pPartyEl) pPartyEl.value = '';
    if (typeof sdClear === 'function') sdClear('p-party');
    renderPayments();
}

function renderPayments(list = payments) {
    const L = T[lang] || T.ur;
    const tbody = document.getElementById('pay-tbody');
    if (!tbody) return;
    const sorted = [...list].sort((a, b) => b.date.localeCompare(a.date));
    if (!sorted.length) { tbody.innerHTML = `<tr><td colspan="8"><div class="empty"><div class="ico">💳</div>${L.noPayments}</div></td></tr>`; return; }
    
    const canDelPay = (typeof canDo === 'function') ? (canDo('deletePay') || canDo('delete')) : true;

    tbody.innerHTML = sorted.map((p, i) =>
        `<tr><td>${i + 1}</td><td>${fd(p.date)}</td>
    <td><span class="party-code">${getCode(p.party)}</span></td>
    <td><strong>${p.party}</strong></td>
    <td><strong class="led-cr">${sar(p.amount)}</strong></td>
    <td><span class="badge">${getMethodLabel(p.method)}</span></td>
    <td style="font-size:11px;color:var(--muted);">${p.notes || '—'}</td>
    <td>${canDelPay ? `<button class="btn btn-sm btn-d" onclick="deletePay('${p.id}')">${L.del}</button>` : '—'}</td></tr>`
    ).join('');
}

function filterPayments() {
    const searchInp = document.getElementById('pay-search');
    const q = searchInp ? searchInp.value.toLowerCase().trim() : '';
    if (!q) {
        renderPayments(payments);
        return;
    }
    const filtered = payments.filter(p => 
        (p.party && p.party.toLowerCase().includes(q)) ||
        (p.method && p.method.toLowerCase().includes(q)) ||
        (p.notes && p.notes.toLowerCase().includes(q)) ||
        (p.date && p.date.toLowerCase().includes(q)) ||
        (getCode(p.party) && getCode(p.party).toLowerCase().includes(q))
    );
    renderPayments(filtered);
}

async function deletePay(id) {
    if (typeof canDo === 'function' && !canDo('deletePay') && !canDo('delete')) {
        alert('⚠️ آپ کو ادائیگی حذف کرنے کی اجازت نہیں ہے');
        return;
    }
    const L = T[lang] || T.ur;
    if (!(await verifyPassword(L.confirmDelPay))) return;
    payments = payments.filter(x => x.id !== id);
    svPy();
    renderPayments();
}