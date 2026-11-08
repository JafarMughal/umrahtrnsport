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
        badge.className = 'sd-badge'; // replaced inline style
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
    if (typeof populateRateFormDropdowns === 'function') populateRateFormDropdowns();
    const allLedgerParties = Array.from(new Set([
        ...(Array.isArray(parties) ? parties : []),
        ...(typeof records !== 'undefined' && Array.isArray(records) ? records.map(r => r.party) : []),
        ...(typeof payments !== 'undefined' && Array.isArray(payments) ? payments.map(p => p.party) : [])
    ].map(p => (p || '').trim()).filter(Boolean)));
    fillDrop('l-party', allLedgerParties.length ? allLedgerParties : parties, true);
    fillDrop('f-party', parties, true);
    fillDrop('f-sector', sectors, true);
    fillDrop('r-party', parties, true);
    fillDrop('p-party', parties, false);
    fillDrop('e-party', parties, false);
    if (typeof fillTransportNatureDropdown === 'function') fillTransportNatureDropdown();
    fillHajiPartyDropdown();
    fillShirkaDatalist();
    fillAirportDatalist();
    fillHajiPartyDatalist();
}

const DEFAULT_SHIRKAS = [
    'الرواد', 'الشہداء', 'المختار', 'الدولية', 'ضيوف الرحمن',
    'العالمية', 'رواحل', 'سماء المشاعر', 'قافلة الإيمان', 'دلہ',
    'سدرہ', 'مواسم', 'انوار الحرمین', 'فنادق الہدایہ', 'دار الایمان',
    'الماسیہ', 'باب السلام'
];

const DEFAULT_AIRPORTS = [
    'Jeddah Airport - Terminal 1 (KAIA T1)',
    'Jeddah Airport - North Terminal (شمالی ٹرمینل)',
    'Jeddah Airport - South Terminal (جنوبی ٹرمینل)',
    'Jeddah Airport - Hajj Terminal (حج ٹرمینل)',
    'Jeddah Airport (KAIA)',
    'Madinah Airport (AMAA)',
    'Madinah Airport - International Terminal',
    'Madinah Airport - Hajj Terminal',
    'Taif Airport (TIF)',
    'Yanbu Airport (YNB)',
    'Riyadh Airport (KKIA)'
];

function attachDatalistAutoOpen(inputId) {
    const el = document.getElementById(inputId);
    if (!el || el._dlAttached) return;
    el._dlAttached = true;
    const trigger = () => {
        try {
            if (typeof el.showPicker === 'function') {
                el.showPicker();
            }
        } catch (e) {
            // Silently ignore if showPicker is unsupported
        }
    };
    el.addEventListener('focus', trigger);
    el.addEventListener('click', trigger);
}

function fillShirkaDatalist() {
    let allShirkas = Array.isArray(DEFAULT_SHIRKAS) ? [...DEFAULT_SHIRKAS] : [];
    if (typeof shirkas !== 'undefined' && Array.isArray(shirkas)) {
        allShirkas.push(...shirkas);
    }
    if (typeof records !== 'undefined' && Array.isArray(records)) {
        allShirkas.push(...records.map(r => r && r.shirka));
    }
    if (typeof deletedRecords !== 'undefined' && Array.isArray(deletedRecords)) {
        allShirkas.push(...deletedRecords.map(r => r && r.shirka));
    }
    const uniqueShirkas = [...new Set(allShirkas.map(s => (s || '').trim()).filter(Boolean))];
    uniqueShirkas.sort((a, b) => a.localeCompare(b, 'ar'));

    const html = uniqueShirkas.map(s => `<option value="${s}">`).join('');
    
    const list = document.getElementById('shirka-list');
    if (list) list.innerHTML = html;

    const editList = document.getElementById('edit-rec-shirka-list');
    if (editList) editList.innerHTML = html;

    attachDatalistAutoOpen('e-shirka');
    attachDatalistAutoOpen('edit-rec-shirka');
}

function fillAirportDatalist() {
    let allAirports = Array.isArray(DEFAULT_AIRPORTS) ? [...DEFAULT_AIRPORTS] : [];
    if (typeof records !== 'undefined' && Array.isArray(records)) {
        allAirports.push(...records.map(r => r && r.airport));
    }
    if (typeof deletedRecords !== 'undefined' && Array.isArray(deletedRecords)) {
        allAirports.push(...deletedRecords.map(r => r && r.airport));
    }
    const uniqueAirports = [...new Set(allAirports.map(a => (a || '').trim()).filter(Boolean))];

    const html = uniqueAirports.map(a => `<option value="${a}">`).join('');
    
    const list = document.getElementById('airport-list');
    if (list) list.innerHTML = html;

    const editList = document.getElementById('edit-rec-airport-list');
    if (editList) editList.innerHTML = html;

    attachDatalistAutoOpen('e-airport');
    attachDatalistAutoOpen('edit-rec-airport');
}

function fillHajiPartyDatalist() {
    let allHp = [];
    if (typeof hajiParties !== 'undefined' && Array.isArray(hajiParties)) {
        allHp.push(...hajiParties);
    }
    if (typeof records !== 'undefined' && Array.isArray(records)) {
        records.forEach(r => {
            if (r && r.newParty) {
                r.newParty.split(',').map(s => s.trim()).filter(Boolean).forEach(s => allHp.push(s));
            }
        });
    }
    if (typeof deletedRecords !== 'undefined' && Array.isArray(deletedRecords)) {
        deletedRecords.forEach(r => {
            if (r && r.newParty) {
                r.newParty.split(',').map(s => s.trim()).filter(Boolean).forEach(s => allHp.push(s));
            }
        });
    }
    const defaultNamesToRemove = new Set([
        'القریشی ٹورز', 'الرحمان ٹریولز', 'الحرمین ٹورز اینڈ ٹریولز', 'ضیوف الرحمن گروپ',
        'المروہ ٹریولز', 'الصفا عمرہ گروپ', 'کاروان فیصل', 'کاروان مدینہ',
        'لبیک ٹورز اینڈ ٹریولز', 'باب الحرم ٹریولز', 'نور الہدیٰ ٹورز', 'قافلہ حرمین'
    ]);
    const uniqueHp = [...new Set(allHp.map(h => (h || '').trim()).filter(h => h && !defaultNamesToRemove.has(h)))];
    uniqueHp.sort((a, b) => a.localeCompare(b, 'ur'));

    const selEl = document.getElementById('edit-rec-new-party');
    if (selEl && selEl.tagName === 'SELECT') {
        const curVal = selEl.value;
        selEl.innerHTML = '<option value="">-- منتخب کریں --</option>' +
            uniqueHp.map(hp => `<option value="${hp}" ${hp === curVal ? 'selected' : ''}>${hp}</option>`).join('') +
            '<option value="__custom__">➕ نیا درج کریں... (Add New)</option>';
        if (curVal && curVal !== '__custom__') selEl.value = curVal;
    }
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
    const defaultNamesToRemove = new Set([
        'القریشی ٹورز', 'الرحمان ٹریولز', 'الحرمین ٹورز اینڈ ٹریولز', 'ضیوف الرحمن گروپ',
        'المروہ ٹریولز', 'الصفا عمرہ گروپ', 'کاروان فیصل', 'کاروان مدینہ',
        'لبیک ٹورز اینڈ ٹریولز', 'باب الحرم ٹریولز', 'نور الہدیٰ ٹورز', 'قافلہ حرمین'
    ]);
    const baseList = (typeof hajiParties !== 'undefined' && Array.isArray(hajiParties))
        ? hajiParties.filter(hp => !defaultNamesToRemove.has(hp))
        : [];
    const filtered = baseList.filter(hp => !q || hp.toLowerCase().includes(q));
    
    if (filtered.length === 0) {
        listEl.innerHTML = `<div class="cms-label no-result">کوئی نتیجہ نہیں</div>`; // Replaced inline style
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
        dd.style.display = dd.style.display === 'none' ? 'flex' : 'none';
        if(dd.style.display === 'flex') {
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
    
    const dnrMs = document.getElementById('dnr-nature-multi-select');
    const dnrDd = document.getElementById('dnr-nature-dropdown-container');
    if (dnrMs && dnrDd && !dnrMs.contains(e.target)) {
        dnrDd.style.display = 'none';
    }
    
    const dnrTransMs = document.getElementById('dnr-transporter-multi-select');
    const dnrTransDd = document.getElementById('dnr-transporter-dropdown-container');
    if (dnrTransMs && dnrTransDd && !dnrTransMs.contains(e.target)) {
        dnrTransDd.style.display = 'none';
    }
});
window.fillShirkaDatalist = fillShirkaDatalist;
window.fillAirportDatalist = fillAirportDatalist;
window.DEFAULT_SHIRKAS = DEFAULT_SHIRKAS;
window.DEFAULT_AIRPORTS = DEFAULT_AIRPORTS;
window.fillHajiPartyDatalist = fillHajiPartyDatalist;
