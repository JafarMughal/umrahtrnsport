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
    ['u-party'].forEach(p => {
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
    fillDrop('r-party', parties, true);
    fillDrop('p-party', parties, false);
    fillDrop('e-party', parties, false);
    if (typeof fillTransportNatureDropdown === 'function') fillTransportNatureDropdown();
    fillHajiPartyDropdown();
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  HAJI PARTY MULTI SELECT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function fillHajiPartyDropdown(query = '') {
    const listEl = document.getElementById('hp-dropdown-list');
    if (!listEl) return;
    
    const hiddenInp = document.getElementById('e-new-party');
    const currentSelected = hiddenInp ? hiddenInp.value : '';
    
    const q = query.toLowerCase().trim();
    const filtered = hajiParties.filter(hp => !q || hp.toLowerCase().includes(q));
    
    if (filtered.length === 0) {
        listEl.innerHTML = `<div class="cms-label" style="color:var(--muted); justify-content:center;">کوئی نتیجہ نہیں</div>`;
    } else {
        listEl.innerHTML = filtered.map(hp => {
            const isActive = currentSelected === hp ? 'active' : '';
            return `<div class="cms-label ${isActive}" onclick="selectHajiParty('${hp.replace(/'/g, "\\'")}', event)">${hp}</div>`;
        }).join('');
    }
    
    updateHajiPartySelectionText();
}

function filterHajiPartyDropdown() {
    const searchInp = document.getElementById('hp-search-input');
    if (searchInp) fillHajiPartyDropdown(searchInp.value);
}

function selectHajiParty(hp, event) {
    if(event) event.stopPropagation();
    const hiddenInp = document.getElementById('e-new-party');
    if (hiddenInp) hiddenInp.value = hp;
    
    fillHajiPartyDropdown();
    document.getElementById('hp-dropdown-container').style.display = 'none';
}

function toggleMultiSelect(e) {
    if(e) e.stopPropagation();
    const dd = document.getElementById('hp-dropdown-container');
    if (dd) {
        dd.style.display = dd.style.display === 'none' ? 'block' : 'none';
        if(dd.style.display === 'block') {
            const searchInp = document.getElementById('hp-search-input');
            if (searchInp) { searchInp.value = ''; searchInp.focus(); }
            fillHajiPartyDropdown();
        }
    }
}

function updateHajiPartySelectionText() {
    const hiddenInp = document.getElementById('e-new-party');
    const txtSpan = document.getElementById('hp-selected-text');
    const selected = hiddenInp ? hiddenInp.value : '';
    
    if (txtSpan) {
        if (!selected) txtSpan.textContent = (T[lang] || T.ur).selectParty || 'منتخب کریں...';
        else txtSpan.textContent = selected;
    }
}

document.addEventListener('click', function(e) {
    const ms = document.getElementById('hp-multi-select');
    const dd = document.getElementById('hp-dropdown-container');
    if (ms && dd && !ms.contains(e.target)) {
        dd.style.display = 'none';
    }
});