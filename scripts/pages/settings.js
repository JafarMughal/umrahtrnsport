// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  SETTINGS (add/delete items)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function addFromSettings(type) {
    const inpMap = { party: 'sp-in', sector: 'ss-in', transport: 'st-in', hajiParty: 'shp-in' };
    const alMap = { party: 'al-sp', sector: 'al-ss', transport: 'al-st', hajiParty: 'al-shp' };
    const L = T[lang] || T.ur;
    const val = document.getElementById(inpMap[type]).value.trim();
    const arr = type === 'party' ? parties : type === 'sector' ? sectors : type === 'transport' ? transports : hajiParties;
    if (!val) { al(alMap[type], L.enterName, 'er'); return; }
    if (arr.includes(val)) { al(alMap[type], L.alreadyExists, 'er'); return; }
    arr.push(val);
    if (type === 'party') { getCode(val); svP(); } else if (type === 'sector') svS(); else if (type === 'transport') svTr(); else svHP();
    refreshAllDrops();
    document.getElementById(inpMap[type]).value = '';
    al(alMap[type], L.addedOk, 'ok');
    if (type === 'party') renderPartyList();
    else if (type === 'sector') renderSectorList();
    else if (type === 'transport') renderTransportList();
    else renderHajiPartyList();
}

async function deleteItem(type, idx) {
    const L = T[lang] || T.ur;
    const arr = type === 'party' ? parties : type === 'sector' ? sectors : type === 'transport' ? transports : hajiParties;
    const name = arr[idx];
    let used = false;
    if (type === 'party') used = records.some(r => r.party === name) || payments.some(p => p.party === name);
    else if (type === 'sector') used = records.some(r => r.sector === name);
    else if (type === 'transport') used = records.some(r => r.transport === name);
    else used = records.some(r => r.newParty && r.newParty.split(',').map(s=>s.trim()).includes(name));
    
    if (used) {
        if (!(await verifyPassword(`"${name}" ${L.usedWarning}`))) return;
    } else {
        if (!(await verifyPassword(L.confirmDel || 'Delete?'))) return;
    }

    arr.splice(idx, 1);
    if (type === 'party') svP(); else if (type === 'sector') svS(); else if (type === 'transport') svTr(); else svHP();
    refreshAllDrops();
    if (type === 'party') renderPartyList();
    else if (type === 'sector') renderSectorList();
    else if (type === 'transport') renderTransportList();
    else renderHajiPartyList();
}

function renderPartyList() {
    const L = T[lang] || T.ur;
    const el = document.getElementById('parties-list');
    if (!parties.length) { el.innerHTML = `<tr><td colspan="3" style="text-align:center;color:var(--muted);">${L.noneParty}</td></tr>`; return; }
    el.innerHTML = parties.map((p, i) => `
        <tr id="row-party-${i}">
            <td>${i + 1}</td>
            <td><span class="tag-code">${getCode(p)}</span> <span id="val-party-${i}">${p}</span></td>
            <td>
                <div class="st-actions">
                    <button class="btn btn-o btn-sm" onclick="editItem('party', ${i})">✏️</button>
                    <button class="btn btn-o btn-sm" style="color:var(--red);" onclick="deleteItem('party', ${i})">🗑️</button>
                </div>
            </td>
        </tr>
    `).join('');
}

function renderSectorList() {
    const L = T[lang] || T.ur;
    const el = document.getElementById('sectors-list');
    if (!sectors.length) { el.innerHTML = `<tr><td colspan="3" style="text-align:center;color:var(--muted);">${L.noneSector}</td></tr>`; return; }
    el.innerHTML = sectors.map((s, i) => `
        <tr id="row-sector-${i}">
            <td>${i + 1}</td>
            <td><span id="val-sector-${i}">${s}</span></td>
            <td>
                <div class="st-actions">
                    <button class="btn btn-o btn-sm" onclick="editItem('sector', ${i})">✏️</button>
                    <button class="btn btn-o btn-sm" style="color:var(--red);" onclick="deleteItem('sector', ${i})">🗑️</button>
                </div>
            </td>
        </tr>
    `).join('');
}

function renderTransportList() {
    const L = T[lang] || T.ur;
    const el = document.getElementById('transports-list');
    if (!el) return;
    if (!transports.length) { el.innerHTML = `<tr><td colspan="3" style="text-align:center;color:var(--muted);">${L.noneTransport}</td></tr>`; return; }
    el.innerHTML = transports.map((t, i) => `
        <tr id="row-transport-${i}">
            <td>${i + 1}</td>
            <td>🚌 <span id="val-transport-${i}">${t}</span></td>
            <td>
                <div class="st-actions">
                    <button class="btn btn-o btn-sm" onclick="editItem('transport', ${i})">✏️</button>
                    <button class="btn btn-o btn-sm" style="color:var(--red);" onclick="deleteItem('transport', ${i})">🗑️</button>
                </div>
            </td>
        </tr>
    `).join('');
}

function renderHajiPartyList() {
    const el = document.getElementById('hajiparties-list');
    if (!el) return;
    if (!hajiParties.length) { el.innerHTML = `<tr><td colspan="3" style="text-align:center;color:var(--muted);">کوئی حاجی پارٹی موجود نہیں</td></tr>`; return; }
    el.innerHTML = hajiParties.map((hp, i) => `
        <tr id="row-hajiParty-${i}">
            <td>${i + 1}</td>
            <td>👥 <span id="val-hajiParty-${i}">${hp}</span></td>
            <td>
                <div class="st-actions">
                    <button class="btn btn-o btn-sm" onclick="editItem('hajiParty', ${i})">✏️</button>
                    <button class="btn btn-o btn-sm" style="color:var(--red);" onclick="deleteItem('hajiParty', ${i})">🗑️</button>
                </div>
            </td>
        </tr>
    `).join('');
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  INLINE EDIT & TABS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function switchSettingsTab(tabId) {
    document.querySelectorAll('#page-settings .tab-content').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('#page-settings .tab-btn').forEach(el => el.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
    document.getElementById('tab-btn-' + tabId.split('-')[1]).classList.add('active');
}

function editItem(type, idx) {
    const arr = type === 'party' ? parties : type === 'sector' ? sectors : type === 'transport' ? transports : hajiParties;
    const val = arr[idx];
    const tdContent = document.getElementById(`row-${type}-${idx}`).cells[1];
    tdContent.innerHTML = `<input type="text" class="inline-edit-input" id="edit-input-${type}-${idx}" value="${val}">`;
    const tdAction = document.getElementById(`row-${type}-${idx}`).cells[2];
    tdAction.innerHTML = `
        <div class="st-actions">
            <button class="btn btn-p btn-sm" onclick="saveItemEdit('${type}', ${idx})">💾</button>
            <button class="btn btn-o btn-sm" onclick="cancelEditItem('${type}')">❌</button>
        </div>
    `;
}

function cancelEditItem(type) {
    if (type === 'party') renderPartyList();
    else if (type === 'sector') renderSectorList();
    else if (type === 'transport') renderTransportList();
    else renderHajiPartyList();
}

function saveItemEdit(type, idx) {
    const L = T[lang] || T.ur;
    const arr = type === 'party' ? parties : type === 'sector' ? sectors : type === 'transport' ? transports : hajiParties;
    const oldName = arr[idx];
    const inputEl = document.getElementById(`edit-input-${type}-${idx}`);
    if (!inputEl) return;
    const newName = inputEl.value.trim();

    if (!newName) {
        alert(L.renameErr || 'Error');
        return;
    }
    if (newName !== oldName && arr.includes(newName)) {
        alert(L.renameDup || 'Already exists');
        return;
    }

    if (newName !== oldName) {
        if (type === 'party') {
            const code = partyCodes[oldName];
            if (code) { partyCodes[newName] = code; delete partyCodes[oldName]; svC(); }
            parties[idx] = newName;
            records.forEach(r => { if (r.party === oldName) r.party = newName; });
            payments.forEach(p => { if (p.party === oldName) p.party = newName; });
            svP(); svR(); svPy();
        } else if (type === 'sector') {
            sectors[idx] = newName;
            records.forEach(r => { if (r.sector === oldName) r.sector = newName; });
            svS(); svR();
        } else if (type === 'transport') {
            transports[idx] = newName;
            records.forEach(r => { if (r.transport === oldName) r.transport = newName; });
            svTr(); svR();
        } else if (type === 'hajiParty') {
            hajiParties[idx] = newName;
            records.forEach(r => {
                if (r.newParty) {
                    const parts = r.newParty.split(',').map(s=>s.trim());
                    const i2 = parts.indexOf(oldName);
                    if (i2 !== -1) {
                        parts[i2] = newName;
                        r.newParty = parts.join(', ');
                    }
                }
            });
            svHP(); svR();
        }
        refreshAllDrops();
    }
    cancelEditItem(type);
}