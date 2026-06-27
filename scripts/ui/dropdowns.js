// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  SEARCHABLE DROPDOWN
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function sdBuild(prefix) {
    const L = T[lang] || T.ur;
    const inp = document.getElementById(prefix + '-input');
    const dd = document.getElementById('sd-' + prefix);
    if (!inp || !dd) return;
    inp.placeholder = L.searchParty;
    const q = inp.value.trim().toLowerCase();
    const filtered = parties.filter(p => !q || p.toLowerCase().includes(q) || getCode(p).toLowerCase().includes(q));
    if (!filtered.length) { dd.innerHTML = `<div class="sd-no-result">${L.noMatch}</div>`; return; }
    const cur = document.getElementById(prefix).value;
    dd.innerHTML = filtered.map(p => `<div class="sd-item${p === cur ? ' active' : ''}" onmousedown="sdSelect('${prefix}','${p.replace(/'/g, "\\'")}')">
    <span class="sd-code">${getCode(p)}</span><span class="sd-name">${p}</span>
  </div>`).join('');
}

function sdFilter(prefix) { sdBuild(prefix); sdOpen(prefix); }
function sdOpen(prefix) { const dd = document.getElementById('sd-' + prefix); if (dd) { sdBuild(prefix); dd.classList.add('open'); } }
function sdBlur(prefix) {
    _sdTimer[prefix] = setTimeout(() => {
        const dd = document.getElementById('sd-' + prefix);
        if (dd) dd.classList.remove('open');
        const inp = document.getElementById(prefix + '-input');
        const hidden = document.getElementById(prefix);
        if (inp && hidden && hidden.value && inp.value !== hidden.value + ' (' + getCode(hidden.value) + ')') {
            inp.value = hidden.value;
        }
    }, 200);
}
function sdSelect(prefix, partyName) {
    clearTimeout(_sdTimer[prefix]);
    document.getElementById(prefix).value = partyName;
    document.getElementById(prefix + '-input').value = partyName;
    const dd = document.getElementById('sd-' + prefix);
    if (dd) dd.classList.remove('open');
    sdShowCode(prefix, partyName);
}
function sdShowCode(prefix, partyName) {
    const code = partyName ? getCode(partyName) : '';
    let badge = document.getElementById(prefix + '-badge');
    if (!badge) {
        badge = document.createElement('div');
        badge.id = prefix + '-badge';
        badge.style.cssText = 'margin-top:4px;font-size:12px;color:var(--muted);';
        document.getElementById('sd-' + prefix).parentElement.appendChild(badge);
    }
    badge.innerHTML = partyName ? `<span class="party-code">${code}</span> ${partyName}` : '';
}
function sdSetValue(prefix, partyName) {
    document.getElementById(prefix).value = partyName || '';
    document.getElementById(prefix + '-input').value = partyName || '';
    sdShowCode(prefix, partyName || '');
}
function sdClear(prefix) { sdSetValue(prefix, ''); }
function refreshSdPlaceholders() {
    const L = T[lang] || T.ur;
    ['e-party', 'p-party', 'u-party', 'dn-party'].forEach(p => {
        const inp = document.getElementById(p + '-input');
        if (inp) inp.placeholder = L.searchParty;
    });
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  DROPDOWNS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function fillDrop(id, arr, withAll = false) {
    const sel = document.getElementById(id);
    if (!sel || !arr) return;
    const L = T[lang] || T.ur;
    const cur = sel.value;
    let placeholder = L.selectParty;
    if (id.includes('sector')) placeholder = L.selectSector;
    else if (id.includes('transport')) placeholder = L.selectTransport;
    sel.innerHTML = withAll ? `<option value="">${L.allParties}</option>` : `<option value="">${placeholder}</option>`;
    arr.forEach(v => { const o = document.createElement('option'); o.value = v; o.textContent = v; if (v === cur) o.selected = true; sel.appendChild(o); });
}

function refreshAllDrops() {
    fillDrop('e-sector', sectors);
    fillDrop('e-transport', transports);
    fillDrop('l-party', parties, true);
    fillDrop('f-party', parties, true);
    fillDrop('f-sector', sectors, true);
    fillDrop('u-sector', sectors);
    fillDrop('u-transport', transports);
    fillDrop('dn-sector', sectors);
    fillDrop('r-party', parties, true);
    ['e-party', 'p-party', 'u-party', 'dn-party'].forEach(p => sdBuild(p));
}