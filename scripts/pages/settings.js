// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  SETTINGS (add/delete items)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function addFromSettings(type) {
    const inpMap = { party: 'sp-in', sector: 'ss-in', transport: 'st-in' };
    const alMap = { party: 'al-sp', sector: 'al-ss', transport: 'al-st' };
    const L = T[lang] || T.ur;
    const val = document.getElementById(inpMap[type]).value.trim();
    const arr = type === 'party' ? parties : type === 'sector' ? sectors : transports;
    if (!val) { al(alMap[type], L.enterName, 'er'); return; }
    if (arr.includes(val)) { al(alMap[type], L.alreadyExists, 'er'); return; }
    arr.push(val);
    if (type === 'party') { getCode(val); svP(); } else if (type === 'sector') svS(); else svTr();
    refreshAllDrops();
    document.getElementById(inpMap[type]).value = '';
    al(alMap[type], L.addedOk, 'ok');
    if (type === 'party') renderPartyList();
    else if (type === 'sector') renderSectorList();
    else renderTransportList();
}

async function deleteItem(type, idx) {
    const L = T[lang] || T.ur;
    const arr = type === 'party' ? parties : type === 'sector' ? sectors : transports;
    const name = arr[idx];
    let used = false;
    if (type === 'party') used = records.some(r => r.party === name) || payments.some(p => p.party === name);
    else if (type === 'sector') used = records.some(r => r.sector === name);
    else used = records.some(r => r.transport === name);
    if (used) {
        if (!(await verifyPassword(`"${name}" ${L.usedWarning}`))) return;
    } else {
        if (!(await verifyPassword(L.confirmDel || 'Delete?'))) return;
    }

    arr.splice(idx, 1);
    if (type === 'party') svP(); else if (type === 'sector') svS(); else svTr();
    refreshAllDrops();
    if (type === 'party') renderPartyList();
    else if (type === 'sector') renderSectorList();
    else renderTransportList();
}

function renderPartyList() {
    const L = T[lang] || T.ur;
    const el = document.getElementById('parties-list');
    if (!parties.length) { el.innerHTML = `<span style="color:var(--muted);font-size:12px;">${L.noneParty}</span>`; return; }
    el.innerHTML = parties.map((p, i) =>
        `<div class="tag"><span class="tag-code">${getCode(p)}</span><span>${p}</span><button class="x" onclick="deleteItem('party',${i})">✕</button></div>`
    ).join('');
}

function renderSectorList() {
    const L = T[lang] || T.ur;
    const el = document.getElementById('sectors-list');
    el.innerHTML = sectors.length ? sectors.map((s, i) =>
        `<div class="tag"><span>${s}</span><button class="x" onclick="deleteItem('sector',${i})">✕</button></div>`
    ).join('') : `<span style="color:var(--muted);font-size:12px;">${L.noneSector}</span>`;
}

function renderTransportList() {
    const L = T[lang] || T.ur;
    const el = document.getElementById('transports-list');
    if (!el) return;
    el.innerHTML = transports.length ? transports.map((t, i) =>
        `<div class="tag"><span>🚌 ${t}</span><button class="x" onclick="deleteItem('transport',${i})">✕</button></div>`
    ).join('') : `<span style="color:var(--muted);font-size:12px;">${L.noneTransport}</span>`;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  RENAME PARTY
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function fillRenameFrom() {
    const sel = document.getElementById('rename-from');
    const cur = sel.value;
    sel.innerHTML = parties.map(p => `<option value="${p}"${p === cur ? ' selected' : ''}>${getCode(p)} — ${p}</option>`).join('');
}

function renameParty() {
    const L = T[lang] || T.ur;
    const oldName = document.getElementById('rename-from').value;
    const newName = document.getElementById('rename-to').value.trim();
    if (!newName) { al('al-rename', L.renameErr, 'er'); return; }
    if (parties.includes(newName)) { al('al-rename', L.renameDup, 'er'); return; }
    const idx = parties.indexOf(oldName);
    if (idx === -1) return;
    const code = partyCodes[oldName];
    if (code) { partyCodes[newName] = code; delete partyCodes[oldName]; svC(); }
    parties[idx] = newName;
    records.forEach(r => { if (r.party === oldName) r.party = newName; });
    payments.forEach(p => { if (p.party === oldName) p.party = newName; });
    svP(); svR(); svPy();
    refreshAllDrops();
    fillRenameFrom();
    document.getElementById('rename-to').value = '';
    al('al-rename', L.renameOk, 'ok');
    renderPartyList();
}