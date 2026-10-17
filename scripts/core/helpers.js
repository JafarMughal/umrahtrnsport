// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  HELPERS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function uid() { return Date.now().toString(36) + Math.random().toString(36).substr(2, 5); }
function fd(d) { if (!d) return ''; const p = d.split('-'); return p[2] + '/' + p[1] + '/' + p[0]; }
function sar(n) { return Math.round(Number(n || 0)).toLocaleString(); }
function today() { return new Date().toISOString().split('T')[0]; }
function t(k) { return T[lang][k] || k; }

function genCode() {
    if (!partyCodes || typeof partyCodes !== 'object') partyCodes = {};
    const existing = Object.values(partyCodes).map(c => {
        if (typeof c === 'string') return parseInt(c.replace('UTS-', ''), 10) || 0;
        return 0;
    });
    const next = existing.length ? Math.max(...existing) + 1 : 1;
    return 'UTS-' + String(next).padStart(3, '0');
}

function getCode(party) {
    if (!party) return '';
    if (!partyCodes || typeof partyCodes !== 'object') partyCodes = {};
    if (!partyCodes[party]) { partyCodes[party] = genCode(); if (typeof svC === 'function') svC(); }
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

function isEconomyBus(transport, sector) {
    const str = ((transport || '') + ' ' + (sector || '')).trim();
    return /economy.*bus|bus.*economy|شیئرنگ|sharing|مشترك|بس|bus/i.test(str);
}

function isSharing(val, sector) { return isEconomyBus(val, sector); }
window.isEconomyBus = isEconomyBus;
window.isSharing = isSharing;

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

// ── GLOBAL THEME ENGINE (LIGHT & DARK MODE) ──
function toggleAppTheme(forcedTheme) {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    const target = forcedTheme || (current === 'dark' ? 'light' : 'dark');
    document.documentElement.setAttribute('data-theme', target);
    localStorage.setItem('uts_theme', target);
    updateThemeToggleUI(target);
}

function initAppTheme() {
    const saved = localStorage.getItem('uts_theme') || 'light';
    document.documentElement.setAttribute('data-theme', saved);
    updateThemeToggleUI(saved);
}

function updateThemeToggleUI(theme) {
    const isDark = theme === 'dark';
    const isUrdu = typeof lang === 'undefined' || lang === 'ur';
    const isArabic = typeof lang !== 'undefined' && lang === 'ar';
    const iconEl = document.getElementById('theme-toggle-icon');
    const textEl = document.getElementById('theme-btn-text');
    if (iconEl && textEl) {
        iconEl.textContent = isDark ? '☀️' : '🌙';
        textEl.textContent = isDark ? (isUrdu ? 'لائٹ' : isArabic ? 'فاتح' : 'Light') : (isUrdu ? 'ڈارک' : isArabic ? 'داكن' : 'Dark');
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAppTheme);
} else {
    initAppTheme();
}

window.toggleAppTheme = toggleAppTheme;
window.initAppTheme = initAppTheme;