// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  HELPERS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function uid() { return Date.now().toString(36) + Math.random().toString(36).substr(2, 5); }
function fd(d) { if (!d) return ''; const p = d.split('-'); return p[2] + '/' + p[1] + '/' + p[0]; }
function sar(n) { return Number(n || 0).toLocaleString(); }
function today() { return new Date().toISOString().split('T')[0]; }
function t(k) { return T[lang][k] || k; }

function genCode() {
    const existing = Object.values(partyCodes).map(c => parseInt(c.replace('UTS-', '')) || 0);
    const next = existing.length ? Math.max(...existing) + 1 : 1;
    return 'UTS-' + String(next).padStart(3, '0');
}

function getCode(party) {
    if (!partyCodes[party]) { partyCodes[party] = genCode(); svC(); }
    return partyCodes[party];
}

function genVoucher() {
    const existing = records.map(r => parseInt((r.voucher || '').replace('VCH-', '')) || 0);
    const next = existing.length ? Math.max(...existing) + 1 : 1;
    return 'VCH-' + String(next).padStart(4, '0');
}

function genDNRef() {
    const existing = dailyNotes.map(n => parseInt((n.ref || '').replace('DN-', '')) || 0);
    const next = existing.length ? Math.max(...existing) + 1 : 1;
    return 'DN-' + String(next).padStart(4, '0');
}

function isSharing(val) { return /شیئرنگ|sharing|مشترك/i.test(val || ''); }

function getTransportLabel(val) { return val || '—'; }

function getMethodLabel(val) {
    const L = T[lang] || T.ur;
    return { cash: L.cash, bank: L.bank, cheque: L.cheque, online: L.online }[val] || val;
}

function formatTime12(time24) {
    if (!time24) return '';
    const [h, m] = time24.split(':');
    let hh = parseInt(h);
    const ampm = hh >= 12 ? 'PM' : 'AM';
    hh = hh % 12 || 12;
    return `${hh}:${m} ${ampm}`;
}

function al(id, msg, type) {
    const e = document.getElementById(id);
    if (!e) return;
    e.innerHTML = `<div class="alert a-${type}">${msg}</div>`;
    setTimeout(() => e.innerHTML = '', 3000);
}

function L_arrow() { return document.documentElement.dir === 'rtl' ? '←' : '→'; }

function setText(id, txt) { const e = document.getElementById(id); if (e) e.textContent = txt; }

function setOpt(id, txt, val) { const e = document.getElementById(id); if (e) { e.textContent = txt; e.value = val; } }