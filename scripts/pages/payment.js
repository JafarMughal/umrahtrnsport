// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  PAYMENT — Nordic Slate-Teal Edition
//  Handcrafted, Mobile-Ready, RTL/LTR Compatible
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// ── 1. PAY MODE BADGE (نئی ادائیگی) ──
function updatePayModeBadge(isUpdate) {
    const badge = document.getElementById('pay-mode-badge');
    const text = document.getElementById('pay-mode-text');
    if (!badge || !text) return;

    const L = (typeof T !== 'undefined' && T[lang]) ? T[lang] : {};
    const isEn = typeof lang !== 'undefined' && lang === 'en';
    const isAr = typeof lang !== 'undefined' && lang === 'ar';

    if (isUpdate) {
        badge.classList.add('is-update');
        text.textContent = L.updateMode || (isEn ? 'Update' : isAr ? 'تحديث' : 'اپ ڈیٹ');
    } else {
        badge.classList.remove('is-update');
        text.textContent = L.newPayment || (isEn ? 'New Payment' : isAr ? 'دفعة جديدة' : 'نئی ادائیگی');
    }
}

// ── 2. RENDER TABLE HEAD ──
function renderPayHead() {
    const L = (typeof T !== 'undefined' && T[lang]) ? T[lang] : (typeof T !== 'undefined' ? T.ur : {});
    const head = document.getElementById('pay-head');
    if (!head) return;
    head.innerHTML = `
        <th>${L.numCol || '#'}</th>
        <th>${L.dateCol || 'تاریخ'}</th>
        <th>${L.codeCol || 'کوڈ'}</th>
        <th>${L.partyCol || 'پارٹی'}</th>
        <th>${L.received || 'موصول (SAR)'}</th>
        <th>${L.methodCol || 'طریقہ'}</th>
        <th>${L.notesCol || 'نوٹس'}</th>
        <th>${L.actionCol || 'عمل'}</th>
    `;
}

// ── 3. ADD PAYMENT ──
function addPayment() {
    if (typeof canDo === 'function' && !canDo('payment')) {
        alert(T[lang]?.noPayPerm || 'آپ کو ادائیگی درج کرنے کی اجازت نہیں ہے');
        return;
    }

    const L = (typeof T !== 'undefined' && T[lang]) ? T[lang] : (typeof T !== 'undefined' ? T.ur : {});

    const dateEl = document.getElementById('p-date');
    const partyEl = document.getElementById('p-party');
    const amountEl = document.getElementById('p-amount');
    const methodEl = document.getElementById('p-method');
    const notesEl = document.getElementById('p-notes');

    const date = dateEl ? dateEl.value : '';
    const party = partyEl ? partyEl.value : '';
    const amount = amountEl ? (parseFloat(amountEl.value) || 0) : 0;
    const method = methodEl ? methodEl.value : 'cash';
    const notes = notesEl ? notesEl.value.trim() : '';

    if (!date || !party || amount <= 0) {
        if (typeof al === 'function') al('al-pay', L.payRequired || 'تمام ضروری فیلڈز پر کریں', 'er');
        return;
    }

    payments.push({ id: uid(), date, party, amount, method, notes });
    if (typeof svPy === 'function') svPy();
    if (typeof al === 'function') al('al-pay', L.paySaved || 'ادائیگی محفوظ ہو گئی', 'ok');

    // Reset form (party, amount, notes, date)
    if (amountEl) amountEl.value = '';
    if (notesEl) notesEl.value = '';
    if (dateEl && typeof today === 'function') dateEl.value = today();
    if (partyEl) partyEl.value = '';
    if (typeof sdClear === 'function') sdClear('p-party');

    // Reset badge (اگر مستقبل میں اپ ڈیٹ موڈ آئے)
    updatePayModeBadge(false);

    renderPayments();
}

// ── 4. RENDER PAYMENTS TABLE ──
function renderPayments(list = payments) {
    const L = (typeof T !== 'undefined' && T[lang]) ? T[lang] : (typeof T !== 'undefined' ? T.ur : {});
    const tbody = document.getElementById('pay-tbody');
    if (!tbody) return;

    // Ensure table head is rendered
    if (!document.getElementById('pay-head')?.children.length) {
        renderPayHead();
    }

    const safeList = Array.isArray(list) ? list : [];
    const sorted = [...safeList].sort((a, b) => (b.date || '').localeCompare(a.date || ''));

    if (!sorted.length) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8">
                    <div class="empty">
                        <div class="empty-icon">
                            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                                <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                                <line x1="1" y1="10" x2="23" y2="10"/>
                            </svg>
                        </div>
                        <div>${L.noPayments || 'کوئی ادائیگی نہیں'}</div>
                    </div>
                </td>
            </tr>`;
        return;
    }

    const canDelPay = (typeof canDo === 'function')
        ? (canDo('deletePay') || canDo('delete'))
        : true;

    tbody.innerHTML = sorted.map((p, i) => {
        const code = (typeof getCode === 'function') ? getCode(p.party) : '—';
        const methodLabel = (typeof getMethodLabel === 'function')
            ? getMethodLabel(p.method)
            : (p.method || '—');
        const dateFormatted = (typeof fd === 'function') ? fd(p.date) : (p.date || '—');
        const amountFormatted = (typeof sar === 'function') ? sar(p.amount) : (p.amount || 0);
        const notesText = p.notes ? p.notes : '—';

        return `
            <tr>
                <td>${i + 1}</td>
                <td>${dateFormatted}</td>
                <td><span class="party-code">${code}</span></td>
                <td><strong>${p.party || '—'}</strong></td>
                <td><strong class="led-cr">${amountFormatted}</strong></td>
                <td><span class="badge">${methodLabel}</span></td>
                <td><span class="notes-cell" title="${notesText}">${notesText}</span></td>
                <td>${canDelPay
                ? `<button class="btn btn-sm btn-d" onclick="deletePay('${p.id}')">${L.del || 'حذف'}</button>`
                : '—'}
                </td>
            </tr>`;
    }).join('');
}

// ── 5. FILTER PAYMENTS (Search) ──
function filterPayments() {
    const searchInp = document.getElementById('pay-search');
    const q = searchInp ? searchInp.value.toLowerCase().trim() : '';

    if (!q) {
        renderPayments(payments);
        return;
    }

    const filtered = payments.filter(p => {
        const code = (typeof getCode === 'function') ? (getCode(p.party) || '') : '';
        return (
            (p.party && p.party.toLowerCase().includes(q)) ||
            (p.method && p.method.toLowerCase().includes(q)) ||
            (p.notes && p.notes.toLowerCase().includes(q)) ||
            (p.date && p.date.toLowerCase().includes(q)) ||
            (code && code.toLowerCase().includes(q))
        );
    });

    renderPayments(filtered);
}

// ── 6. DELETE PAYMENT ──
async function deletePay(id) {
    if (typeof canDo === 'function' && !canDo('deletePay') && !canDo('delete')) {
        alert(T[lang]?.noDelPayPerm || 'آپ کو ادائیگی حذف کرنے کی اجازت نہیں ہے');
        return;
    }

    const L = (typeof T !== 'undefined' && T[lang]) ? T[lang] : (typeof T !== 'undefined' ? T.ur : {});
    const okToDelete = (typeof verifyPassword === 'function')
        ? await verifyPassword(L.confirmDelPay || 'کیا آپ واقعی حذف کرنا چاہتے ہیں؟')
        : confirm(L.confirmDelPay || 'کیا آپ واقعی حذف کرنا چاہتے ہیں؟');

    if (!okToDelete) return;

    payments = payments.filter(x => x.id !== id);
    if (typeof svPy === 'function') svPy();
    renderPayments();
}

// ── 7. WINDOW EXPOSURES ──
window.updatePayModeBadge = updatePayModeBadge;
window.renderPayHead = renderPayHead;
window.addPayment = addPayment;
window.renderPayments = renderPayments;
window.filterPayments = filterPayments;
window.deletePay = deletePay;