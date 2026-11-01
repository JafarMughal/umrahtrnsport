// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  SETTINGS (add/delete items) — Nordic Slate-Teal Theme
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function addFromSettings(type) {
    try {
        const inpMap = { party: 'sp-in', sector: 'ss-in', transport: 'st-in', hajiParty: 'shp-in', shirka: 'ssh-in', nature: 'snt-in' };
        const alMap = { party: 'al-sp', sector: 'al-ss', transport: 'al-st', hajiParty: 'al-shp', shirka: 'al-ssh', nature: 'al-snt' };
        const L = (typeof T !== 'undefined' && T[lang]) ? T[lang] : ((typeof T !== 'undefined' && T.ur) ? T.ur : {});

        const inputEl = document.getElementById(inpMap[type]);
        if (!inputEl) {
            console.error(`Input element ${inpMap[type]} not found`);
            return;
        }

        let val = (inputEl.value || '').trim();
        val = val.replace(/[.#$\[\]]/g, ' ').replace(/\s+/g, ' ').trim();
        if (!val) {
            if (typeof al === 'function') al(alMap[type], L.enterName || 'براہ کرم نام درج کریں', 'er');
            return;
        }

        if (type === 'party' && !Array.isArray(parties)) parties = [];
        if (type === 'sector' && !Array.isArray(sectors)) sectors = [];
        if (type === 'transport' && !Array.isArray(transports)) transports = [];
        if (type === 'shirka' && !Array.isArray(shirkas)) shirkas = [];
        if (type === 'hajiParty' && !Array.isArray(hajiParties)) hajiParties = [];
        if (type === 'nature' && !Array.isArray(transportNatures)) transportNatures = [];

        const arr = type === 'party' ? parties : type === 'sector' ? sectors : type === 'transport' ? transports : type === 'shirka' ? shirkas : type === 'nature' ? transportNatures : hajiParties;

        const isDuplicate = arr.some(item => (typeof item === 'string' ? item.trim().toLowerCase() : '') === val.toLowerCase());
        if (isDuplicate) {
            if (typeof al === 'function') al(alMap[type], L.alreadyExists || 'یہ نام پہلے سے موجود ہے', 'er');
            return;
        }

        arr.push(val);

        if (type === 'party') {
            if (typeof getCode === 'function') getCode(val);
            if (typeof svP === 'function') svP();
        } else if (type === 'sector') {
            if (typeof svS === 'function') svS();
        } else if (type === 'transport') {
            if (typeof svTr === 'function') svTr();
        } else if (type === 'shirka') {
            if (typeof svSh === 'function') svSh();
        } else if (type === 'nature') {
            if (typeof svTN === 'function') svTN();
        } else {
            if (typeof svHP === 'function') svHP();
        }

        if (typeof refreshAllDrops === 'function') refreshAllDrops();
        inputEl.value = '';

        if (typeof al === 'function') al(alMap[type], L.addedOk || 'کامیابی سے شامل ہو گیا', 'ok');

        if (type === 'party') renderPartyList();
        else if (type === 'sector') renderSectorList();
        else if (type === 'transport') renderTransportList();
        else if (type === 'shirka') renderShirkaList();
        else if (type === 'nature') renderNatureList();
        else renderHajiPartyList();
    } catch (err) {
        console.error(`Error in addFromSettings(${type}):`, err);
        const alMap = { party: 'al-sp', sector: 'al-ss', transport: 'al-st', hajiParty: 'al-shp', shirka: 'al-ssh', nature: 'al-snt' };
        if (typeof al === 'function') al(alMap[type], 'خرابی: ' + (err.message || err), 'er');
    }
}

async function deleteItem(type, idx) {
    const L = (typeof T !== 'undefined' && T[lang]) ? T[lang] : ((typeof T !== 'undefined' && T.ur) ? T.ur : {});
    const arr = type === 'party' ? parties : type === 'sector' ? sectors : type === 'transport' ? transports : type === 'shirka' ? shirkas : type === 'nature' ? transportNatures : hajiParties;
    const name = arr[idx];
    let used = false;
    if (type === 'party') used = (records || []).some(r => r.party === name) || (payments || []).some(p => p.party === name);
    else if (type === 'sector') used = (records || []).some(r => r.sector === name);
    else if (type === 'transport') used = (records || []).some(r => r.transport === name);
    else if (type === 'shirka') used = (records || []).some(r => r.shirka === name);
    else if (type === 'nature') used = (records || []).some(r => r.transportNature === name);
    else used = (records || []).some(r => r.newParty && r.newParty.split(',').map(s => s.trim()).includes(name));

    if (used) {
        if (!(await verifyPassword(`"${name}" ${L.usedWarning || 'استعمال میں ہے، کیا آپ واقعی حذف کرنا چاہتے ہیں؟'}`))) return;
    } else {
        if (!(await verifyPassword(L.confirmDel || 'کیا آپ واقعی اسے حذف کرنا چاہتے ہیں؟'))) return;
    }

    arr.splice(idx, 1);
    if (type === 'party') { if (typeof svP === 'function') svP(); }
    else if (type === 'sector') { if (typeof svS === 'function') svS(); }
    else if (type === 'transport') { if (typeof svTr === 'function') svTr(); }
    else if (type === 'shirka') { if (typeof svSh === 'function') svSh(); }
    else if (type === 'nature') { if (typeof svTN === 'function') svTN(); }
    else { if (typeof svHP === 'function') svHP(); }

    if (typeof refreshAllDrops === 'function') refreshAllDrops();
    if (type === 'party') renderPartyList();
    else if (type === 'sector') renderSectorList();
    else if (type === 'transport') renderTransportList();
    else if (type === 'shirka') renderShirkaList();
    else if (type === 'nature') renderNatureList();
    else renderHajiPartyList();
}

function renderPartyList() {
    const L = (typeof T !== 'undefined' && T[lang]) ? T[lang] : ((typeof T !== 'undefined' && T.ur) ? T.ur : {});
    const el = document.getElementById('parties-list');
    if (!el) return;
    if (!parties || !parties.length) {
        el.innerHTML = `<tr><td colspan="3" class="settings-table-empty">${L.noneParty || 'کوئی ٹرانسپورٹر موجود نہیں'}</td></tr>`;
        return;
    }
    const editLbl = L.edit || 'ترمیم';
    const delLbl = L.del || 'حذف';
    el.innerHTML = parties.map((p, i) => `
        <tr id="row-party-${i}">
            <td class="col-idx">${i + 1}</td>
            <td><span class="tag-code">${typeof getCode === 'function' ? getCode(p) : '-'}</span> <span class="tag-name" id="val-party-${i}">${p}</span></td>
            <td>
                <div class="st-actions">
                    <button class="btn btn-o btn-sm" onclick="editItem('party', ${i})">${editLbl}</button>
                    <button class="btn btn-o btn-sm btn-del" onclick="deleteItem('party', ${i})">${delLbl}</button>
                </div>
            </td>
        </tr>
    `).join('');
}

function renderSectorList() {
    const L = (typeof T !== 'undefined' && T[lang]) ? T[lang] : ((typeof T !== 'undefined' && T.ur) ? T.ur : {});
    const el = document.getElementById('sectors-list');
    if (!el) return;
    if (!sectors || !sectors.length) {
        el.innerHTML = `<tr><td colspan="3" class="settings-table-empty">${L.noneSector || 'کوئی سیکٹر موجود نہیں'}</td></tr>`;
        return;
    }
    const editLbl = L.edit || 'ترمیم';
    const delLbl = L.del || 'حذف';
    el.innerHTML = sectors.map((s, i) => `
        <tr id="row-sector-${i}">
            <td class="col-idx">${i + 1}</td>
            <td><span class="tag-name" id="val-sector-${i}">${s}</span></td>
            <td>
                <div class="st-actions">
                    <button class="btn btn-o btn-sm" onclick="editItem('sector', ${i})">${editLbl}</button>
                    <button class="btn btn-o btn-sm btn-del" onclick="deleteItem('sector', ${i})">${delLbl}</button>
                </div>
            </td>
        </tr>
    `).join('');
}

function renderTransportList() {
    const L = (typeof T !== 'undefined' && T[lang]) ? T[lang] : ((typeof T !== 'undefined' && T.ur) ? T.ur : {});
    const el = document.getElementById('transports-list');
    if (!el) return;
    if (!transports || !transports.length) {
        el.innerHTML = `<tr><td colspan="3" class="settings-table-empty">${L.noneTransport || 'کوئی گاڑی موجود نہیں'}</td></tr>`;
        return;
    }
    const editLbl = L.edit || 'ترمیم';
    const delLbl = L.del || 'حذف';
    el.innerHTML = transports.map((t, i) => `
        <tr id="row-transport-${i}">
            <td class="col-idx">${i + 1}</td>
            <td><span class="tag-name" id="val-transport-${i}">${t}</span></td>
            <td>
                <div class="st-actions">
                    <button class="btn btn-o btn-sm" onclick="editItem('transport', ${i})">${editLbl}</button>
                    <button class="btn btn-o btn-sm btn-del" onclick="deleteItem('transport', ${i})">${delLbl}</button>
                </div>
            </td>
        </tr>
    `).join('');
}

function renderShirkaList() {
    const L = (typeof T !== 'undefined' && T[lang]) ? T[lang] : ((typeof T !== 'undefined' && T.ur) ? T.ur : {});
    const el = document.getElementById('shirkas-list');
    if (!el) return;
    if (!shirkas || !shirkas.length) {
        el.innerHTML = `<tr><td colspan="3" class="settings-table-empty">کوئی شرکہ موجود نہیں</td></tr>`;
        return;
    }
    const editLbl = L.edit || 'ترمیم';
    const delLbl = L.del || 'حذف';
    el.innerHTML = shirkas.map((s, i) => `
        <tr id="row-shirka-${i}">
            <td class="col-idx">${i + 1}</td>
            <td><span class="tag-name" id="val-shirka-${i}">${s}</span></td>
            <td>
                <div class="st-actions">
                    <button class="btn btn-o btn-sm" onclick="editItem('shirka', ${i})">${editLbl}</button>
                    <button class="btn btn-o btn-sm btn-del" onclick="deleteItem('shirka', ${i})">${delLbl}</button>
                </div>
            </td>
        </tr>
    `).join('');
}

function renderHajiPartyList() {
    const L = (typeof T !== 'undefined' && T[lang]) ? T[lang] : ((typeof T !== 'undefined' && T.ur) ? T.ur : {});
    const el = document.getElementById('hajiparties-list');
    if (!el) return;
    if (!hajiParties || !hajiParties.length) {
        el.innerHTML = `<tr><td colspan="3" class="settings-table-empty">کوئی حاجی پارٹی موجود نہیں</td></tr>`;
        return;
    }
    const editLbl = L.edit || 'ترمیم';
    const delLbl = L.del || 'حذف';
    el.innerHTML = hajiParties.map((hp, i) => `
        <tr id="row-hajiParty-${i}">
            <td class="col-idx">${i + 1}</td>
            <td><span class="tag-name" id="val-hajiParty-${i}">${hp}</span></td>
            <td>
                <div class="st-actions">
                    <button class="btn btn-o btn-sm" onclick="editItem('hajiParty', ${i})">${editLbl}</button>
                    <button class="btn btn-o btn-sm btn-del" onclick="deleteItem('hajiParty', ${i})">${delLbl}</button>
                </div>
            </td>
        </tr>
    `).join('');
}

function renderNatureList() {
    const L = (typeof T !== 'undefined' && T[lang]) ? T[lang] : ((typeof T !== 'undefined' && T.ur) ? T.ur : {});
    const el = document.getElementById('natures-list');
    if (!el) return;
    if (!transportNatures || !transportNatures.length) {
        el.innerHTML = `<tr><td colspan="3" class="settings-table-empty">${L.noneNature || 'کوئی نوعیت موجود نہیں'}</td></tr>`;
        return;
    }
    const editLbl = L.edit || 'ترمیم';
    const delLbl = L.del || 'حذف';
    el.innerHTML = transportNatures.map((n, i) => `
        <tr id="row-nature-${i}">
            <td class="col-idx">${i + 1}</td>
            <td><span class="tag-name" id="val-nature-${i}">${n}</span></td>
            <td>
                <div class="st-actions">
                    <button class="btn btn-o btn-sm" onclick="editItem('nature', ${i})">${editLbl}</button>
                    <button class="btn btn-o btn-sm btn-del" onclick="deleteItem('nature', ${i})">${delLbl}</button>
                </div>
            </td>
        </tr>
    `).join('');
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  INLINE EDIT & TABS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function switchSettingsTab(tabId) {
    document.querySelectorAll('#page-settings .tab-content').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('#page-settings .tab-btn').forEach(el => el.classList.remove('active'));
    const targetContent = document.getElementById(tabId);
    if (targetContent) targetContent.classList.add('active');
    const targetBtn = document.getElementById('tab-btn-' + tabId.split('-')[1]);
    if (targetBtn) targetBtn.classList.add('active');

    if (tabId === 'tab-transporters') { if (typeof renderPartyList === 'function') renderPartyList(); }
    else if (tabId === 'tab-hajiparties') { if (typeof renderHajiPartyList === 'function') renderHajiPartyList(); }
    else if (tabId === 'tab-sectors') { if (typeof renderSectorList === 'function') renderSectorList(); }
    else if (tabId === 'tab-transports') { if (typeof renderTransportList === 'function') renderTransportList(); }
    else if (tabId === 'tab-rates') { 
        if (typeof populateRateFormDropdowns === 'function') populateRateFormDropdowns();
        if (typeof renderRateList === 'function') renderRateList(); 
    }
    else if (tabId === 'tab-natures') { if (typeof renderNatureList === 'function') renderNatureList(); }
    else if (tabId === 'tab-shirkas') { if (typeof renderShirkaList === 'function') renderShirkaList(); }
}

function editItem(type, idx) {
    const L = (typeof T !== 'undefined' && T[lang]) ? T[lang] : ((typeof T !== 'undefined' && T.ur) ? T.ur : {});
    const arr = type === 'party' ? parties : type === 'sector' ? sectors : type === 'transport' ? transports : type === 'shirka' ? shirkas : type === 'nature' ? transportNatures : hajiParties;
    const val = arr[idx];
    const rowEl = document.getElementById(`row-${type}-${idx}`);
    if (!rowEl) return;
    const tdContent = rowEl.cells[1];
    tdContent.innerHTML = `<input type="text" class="inline-edit-input" id="edit-input-${type}-${idx}" value="${val}">`;
    const tdAction = rowEl.cells[2];
    tdAction.innerHTML = `
        <div class="st-actions">
            <button class="btn btn-p btn-sm" onclick="saveItemEdit('${type}', ${idx})">${L.save || 'محفوظ'}</button>
            <button class="btn btn-o btn-sm" onclick="cancelEditItem('${type}')">${L.cancel || 'منسوخ'}</button>
        </div>
    `;
}

function cancelEditItem(type) {
    if (type === 'party') renderPartyList();
    else if (type === 'sector') renderSectorList();
    else if (type === 'transport') renderTransportList();
    else if (type === 'shirka') renderShirkaList();
    else if (type === 'nature') renderNatureList();
    else renderHajiPartyList();
}

function saveItemEdit(type, idx) {
    const L = (typeof T !== 'undefined' && T[lang]) ? T[lang] : ((typeof T !== 'undefined' && T.ur) ? T.ur : {});
    const arr = type === 'party' ? parties : type === 'sector' ? sectors : type === 'transport' ? transports : type === 'shirka' ? shirkas : type === 'nature' ? transportNatures : hajiParties;
    const oldName = arr[idx];
    const inputEl = document.getElementById(`edit-input-${type}-${idx}`);
    if (!inputEl) return;
    let newName = inputEl.value.trim();
    newName = newName.replace(/[.#$\[\]]/g, ' ').replace(/\s+/g, ' ').trim();

    if (!newName) {
        alert(L.renameErr || 'نام درج کریں');
        return;
    }
    if (newName !== oldName && arr.includes(newName)) {
        alert(L.renameDup || 'یہ نام پہلے سے موجود ہے');
        return;
    }

    if (newName !== oldName) {
        if (type === 'party') {
            if (typeof partyCodes === 'object' && partyCodes) {
                const code = partyCodes[oldName];
                if (code) { partyCodes[newName] = code; delete partyCodes[oldName]; if (typeof svC === 'function') svC(); }
            }
            parties[idx] = newName;
            (records || []).forEach(r => { if (r.party === oldName) r.party = newName; });
            (payments || []).forEach(p => { if (p.party === oldName) p.party = newName; });
            if (typeof svP === 'function') svP();
            if (typeof svR === 'function') svR();
            if (typeof svPy === 'function') svPy();
        } else if (type === 'sector') {
            sectors[idx] = newName;
            (records || []).forEach(r => { if (r.sector === oldName) r.sector = newName; });
            if (typeof svS === 'function') svS();
            if (typeof svR === 'function') svR();
        } else if (type === 'transport') {
            transports[idx] = newName;
            (records || []).forEach(r => { if (r.transport === oldName) r.transport = newName; });
            if (typeof svTr === 'function') svTr();
            if (typeof svR === 'function') svR();
        } else if (type === 'hajiParty') {
            hajiParties[idx] = newName;
            (records || []).forEach(r => {
                if (r.newParty) {
                    const parts = r.newParty.split(',').map(s => s.trim());
                    const i2 = parts.indexOf(oldName);
                    if (i2 !== -1) {
                        parts[i2] = newName;
                        r.newParty = parts.join(', ');
                    }
                }
            });
            if (typeof svHP === 'function') svHP();
            if (typeof svR === 'function') svR();
        } else if (type === 'shirka') {
            shirkas[idx] = newName;
            (records || []).forEach(r => { if (r.shirka === oldName) r.shirka = newName; });
            if (typeof svSh === 'function') svSh();
            if (typeof svR === 'function') svR();
        } else if (type === 'nature') {
            transportNatures[idx] = newName;
            (records || []).forEach(r => { if (r.transportNature === oldName) r.transportNature = newName; });
            if (typeof svTN === 'function') svTN();
            if (typeof svR === 'function') svR();
        }
        if (typeof refreshAllDrops === 'function') refreshAllDrops();
    }
    cancelEditItem(type);
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  BACKUP & DATA MIGRATION (EXPORT / IMPORT)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function exportAllDataBackup() {
    const backup = {
        version: '1.0',
        exportedAt: new Date().toISOString(),
        records: records || [],
        deletedRecords: deletedRecords || [],
        payments: payments || [],
        parties: parties || [],
        sectors: sectors || [],
        transports: transports || [],
        vehicleRates: vehicleRates || [],
        transportNatures: transportNatures || [],
        shirkas: shirkas || [],
        hajiParties: hajiParties || [],
        partyCodes: partyCodes || {},
        dailyNotes: dailyNotes || [],
        users: users || [],
        rolePermissions: rolePermissions || {},
        settings: {
            appName: fbAppName || {},
            appSub: fbAppSub || {},
            logo: fbLogo || null
        }
    };

    const jsonStr = JSON.stringify(backup, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `umrah_transport_backup_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    if (typeof al === 'function') {
        al('al-backup', `بیک اپ فائل ڈاؤنلوڈ ہوگئی! (${backup.records.length} ریکارڈز، ${backup.payments.length} ادائیگیاں)`, 'ok');
    }
}

function copyBackupToClipboard() {
    const backup = {
        version: '1.0',
        exportedAt: new Date().toISOString(),
        records: records || [],
        deletedRecords: deletedRecords || [],
        payments: payments || [],
        parties: parties || [],
        sectors: sectors || [],
        transports: transports || [],
        vehicleRates: vehicleRates || [],
        transportNatures: transportNatures || [],
        shirkas: shirkas || [],
        hajiParties: hajiParties || [],
        partyCodes: partyCodes || {},
        dailyNotes: dailyNotes || [],
        users: users || [],
        rolePermissions: rolePermissions || {},
        settings: {
            appName: fbAppName || {},
            appSub: fbAppSub || {},
            logo: fbLogo || null
        }
    };
    const jsonStr = JSON.stringify(backup);
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(jsonStr).then(() => {
            if (typeof al === 'function') {
                al('al-backup', 'بیک اپ ڈیٹا کلپ بورڈ پر کاپی ہو گیا! اب آپ اسے دوسرے براؤزر/Go Live میں پیسٹ کر سکتے ہیں۔', 'ok');
            } else {
                alert('بیک اپ کاپی ہو گیا!');
            }
        }).catch(e => {
            alert('کاپی کرنے میں مسئلہ: ' + e);
        });
    } else {
        prompt('بیک اپ ڈیٹا کاپی کرنے کے لیے نیچے دیے گئے ٹیکسٹ کو سلیکٹ کر کے کاپی کریں:', jsonStr);
    }
}

function importAllDataBackup(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            applyBackupData(data);
        } catch (err) {
            console.error('Backup import error:', err);
            if (typeof al === 'function') {
                al('al-backup', 'غلط فائل: ' + err.message, 'er');
            }
            alert('غلط بیک اپ فائل! براہ کرم درست JSON فائل منتخب کریں۔');
        }
    };
    reader.readAsText(file);
}

function pasteBackupFromPrompt() {
    const jsonStr = prompt('بیک اپ JSON ڈیٹا یہاں پیسٹ کریں:');
    if (!jsonStr) return;
    try {
        const data = JSON.parse(jsonStr.trim());
        applyBackupData(data);
    } catch (e) {
        alert('غلط JSON ڈیٹا! براہ کرم درست بیک اپ پیسٹ کریں۔');
    }
}

function applyBackupData(data) {
    if (!data || typeof data !== 'object') throw new Error('Invalid format');

    if (Array.isArray(data.records)) records = data.records;
    if (Array.isArray(data.deletedRecords)) deletedRecords = data.deletedRecords;
    if (Array.isArray(data.payments)) payments = data.payments;
    if (Array.isArray(data.parties)) parties = data.parties;
    if (Array.isArray(data.sectors)) sectors = data.sectors;
    if (Array.isArray(data.transports)) transports = data.transports;
    if (Array.isArray(data.vehicleRates)) vehicleRates = data.vehicleRates;
    if (Array.isArray(data.transportNatures)) transportNatures = data.transportNatures;
    if (Array.isArray(data.shirkas)) shirkas = data.shirkas;
    if (Array.isArray(data.hajiParties)) hajiParties = data.hajiParties;
    if (data.partyCodes && typeof data.partyCodes === 'object') partyCodes = data.partyCodes;
    if (Array.isArray(data.dailyNotes)) dailyNotes = data.dailyNotes;
    if (Array.isArray(data.users)) users = data.users;
    if (data.rolePermissions) rolePermissions = data.rolePermissions;
    if (data.settings) {
        fbAppName = data.settings.appName || fbAppName;
        fbAppSub = data.settings.appSub || fbAppSub;
        fbLogo = data.settings.logo || fbLogo;
    }

    // Save to localStorage & Firebase
    if (typeof svR === 'function') svR();
    if (typeof svDR === 'function') svDR();
    if (typeof svPy === 'function') svPy();
    if (typeof svP === 'function') svP();
    if (typeof svS === 'function') svS();
    if (typeof svTr === 'function') svTr();
    if (typeof svVR === 'function') svVR();
    if (typeof svTN === 'function') svTN();
    if (typeof svSh === 'function') svSh();
    if (typeof svHP === 'function') svHP();
    if (typeof svC === 'function') svC();
    if (typeof svU === 'function') svU();
    if (typeof svDN === 'function') svDN();
    if (typeof svRP === 'function') svRP();
    if (typeof saveAppSettingsToFb === 'function') saveAppSettingsToFb();

    if (typeof refreshAllDrops === 'function') refreshAllDrops();
    if (typeof renderLedger === 'function') renderLedger();
    if (typeof initRecordsPage === 'function') initRecordsPage();
    else if (typeof filterRecords === 'function') filterRecords();
    if (typeof renderPartyList === 'function') renderPartyList();
    if (typeof renderNatureList === 'function') renderNatureList();
    if (typeof renderRateList === 'function') renderRateList();

    if (typeof al === 'function') {
        al('al-backup', `ڈیٹا کامیابی سے بحال ہو گیا! (${records.length} ریکارڈز، ${payments.length} ادائیگیاں)`, 'ok');
    }
    alert(`ڈیٹا کامیابی سے بحال ہو گیا!\nکل ریکارڈز: ${records.length}\nکل ادائیگیاں: ${payments.length}`);
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  VEHICLE RATES & VALIDITY MANAGEMENT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function populateRateFormDropdowns() {
    const secSel = document.getElementById('sr-sector');
    const trSel = document.getElementById('sr-transport');
    if (secSel && Array.isArray(sectors)) {
        const curSec = secSel.value;
        secSel.innerHTML = '<option value="">-- سیکٹر منتخب کریں --</option>' +
            sectors.map(s => `<option value="${s}" ${s === curSec ? 'selected' : ''}>${s}</option>`).join('');
    }
    if (trSel && Array.isArray(transports)) {
        const curTr = trSel.value;
        trSel.innerHTML = '<option value="">-- گاڑی منتخب کریں --</option>' +
            transports.map(t => `<option value="${t}" ${t === curTr ? 'selected' : ''}>${t}</option>`).join('');
    }
}

function renderRateList() {
    const el = document.getElementById('rates-list');
    const badge = document.getElementById('sr-count-badge');
    if (!el) return;

    if (!Array.isArray(vehicleRates)) vehicleRates = [];

    const searchInp = document.getElementById('sr-search');
    const q = (searchInp?.value || '').toLowerCase().trim();

    const L = (typeof T !== 'undefined' && T[lang]) ? T[lang] : ((typeof T !== 'undefined' && T.ur) ? T.ur : {});
    const todayStr = new Date().toISOString().slice(0, 10);

    const filtered = vehicleRates.filter(r => {
        if (!q) return true;
        const text = `${r.sector || ''} ${r.transport || ''} ${r.fare || ''} ${r.note || ''}`.toLowerCase();
        return text.includes(q);
    });

    if (badge) badge.textContent = filtered.length;

    if (!filtered.length) {
        el.innerHTML = `<tr><td colspan="9" class="settings-table-empty">${vehicleRates.length === 0 ? (L.noneRate || 'کوئی ریٹ موجود نہیں ہے') : 'کوئی مماثل ریکارڈ نہیں ملا'}</td></tr>`;
        return;
    }

    el.innerHTML = filtered.map((r, i) => {
        let statusHtml = '';
        const hasFrom = !!r.validFrom;
        const hasTo = !!r.validTo;

        if (hasTo && todayStr > r.validTo) {
            statusHtml = `<span style="background:rgba(239, 68, 68, 0.12); color:#dc2626; padding:3px 8px; border-radius:12px; font-size:11.5px; font-weight:600; display:inline-block;">● ${L.rateStatusExpired || 'ختم شدہ'}</span>`;
        } else if (hasFrom && todayStr < r.validFrom) {
            statusHtml = `<span style="background:rgba(245, 158, 11, 0.12); color:#d97706; padding:3px 8px; border-radius:12px; font-size:11.5px; font-weight:600; display:inline-block;">● آئندہ</span>`;
        } else if (hasFrom || hasTo) {
            statusHtml = `<span style="background:rgba(16, 185, 129, 0.12); color:#059669; padding:3px 8px; border-radius:12px; font-size:11.5px; font-weight:600; display:inline-block;">● ${L.rateStatusActive || 'فعال'}</span>`;
        } else {
            statusHtml = `<span style="background:rgba(2, 132, 199, 0.12); color:#0284c7; padding:3px 8px; border-radius:12px; font-size:11.5px; font-weight:600; display:inline-block;">● ${L.rateStatusPermanent || 'مستقل'}</span>`;
        }

        let validityText = 'مستقل (عام سیزن)';
        if (hasFrom && hasTo) validityText = `${r.validFrom} تا ${r.validTo}`;
        else if (hasTo) validityText = `تا ${r.validTo}`;
        else if (hasFrom) validityText = `از ${r.validFrom}`;

        const typeText = r.type === 'pilgrim' ? (L.rateTypePilgrim || 'فی حاجی') : (L.rateTypeVehicle || 'پوری گاڑی');

        return `
            <tr id="row-rate-${r.id || i}">
                <td class="col-idx" style="text-align:center;">${i + 1}</td>
                <td style="font-weight:600;">${r.sector || '-'}</td>
                <td><span class="badge" style="background:var(--border, #e2e8f0); color:var(--text, #1e293b); padding:2px 8px; border-radius:6px; font-size:12px;">${r.transport || '-'}</span></td>
                <td style="font-weight:700; color:#0d9488; font-size:14.5px;">${r.fare || 0} <small style="font-size:11px; font-weight:normal; color:var(--text-muted, #64748b);">SAR</small></td>
                <td style="font-size:12.5px;">${typeText}</td>
                <td style="font-size:12px; direction:ltr; text-align:right;">${validityText}</td>
                <td style="font-size:12px; color:var(--text-muted, #64748b);">${r.note || '—'}</td>
                <td style="text-align:center;">${statusHtml}</td>
                <td>
                    <div class="st-actions" style="justify-content:center;">
                        <button class="btn btn-o btn-sm" onclick="editRate('${r.id || i}')">${L.edit || 'ترمیم'}</button>
                        <button class="btn btn-o btn-sm btn-del" onclick="deleteRate('${r.id || i}')">${L.del || 'حذف'}</button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

function addOrUpdateRate() {
    const L = (typeof T !== 'undefined' && T[lang]) ? T[lang] : ((typeof T !== 'undefined' && T.ur) ? T.ur : {});
    const idEl = document.getElementById('sr-id');
    const sectorEl = document.getElementById('sr-sector');
    const transEl = document.getElementById('sr-transport');
    const fareEl = document.getElementById('sr-fare');
    const typeEl = document.getElementById('sr-type');
    const fromEl = document.getElementById('sr-from');
    const toEl = document.getElementById('sr-to');
    const noteEl = document.getElementById('sr-note');

    const sector = sectorEl?.value?.trim() || '';
    const transport = transEl?.value?.trim() || '';
    const fare = parseFloat(fareEl?.value);
    const type = typeEl?.value || 'vehicle';
    const validFrom = fromEl?.value || '';
    const validTo = toEl?.value || '';
    const note = noteEl?.value?.trim() || '';
    const editId = idEl?.value || '';

    if (!sector || !transport || isNaN(fare) || fare < 0) {
        if (typeof al === 'function') al('al-sr', L.rateRequired || 'سیکٹر، گاڑی اور درست کرایہ درج کرنا ضروری ہے', 'er');
        return;
    }

    if (validFrom && validTo && validFrom > validTo) {
        if (typeof al === 'function') al('al-sr', 'آخری تاریخ شروع کی تاریخ سے پہلے نہیں ہو سکتی', 'er');
        return;
    }

    if (!Array.isArray(vehicleRates)) vehicleRates = [];

    if (editId) {
        const idx = vehicleRates.findIndex(r => String(r.id) === String(editId));
        if (idx !== -1) {
            vehicleRates[idx] = {
                ...vehicleRates[idx],
                sector,
                transport,
                fare,
                type,
                validFrom,
                validTo,
                note,
                updatedAt: new Date().toISOString()
            };
        }
        if (typeof al === 'function') al('al-sr', L.updOk || 'ریٹ اپڈیٹ ہو گیا', 'ok');
    } else {
        const newRate = {
            id: 'vr_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 4),
            sector,
            transport,
            fare,
            type,
            validFrom,
            validTo,
            note,
            createdAt: new Date().toISOString()
        };
        vehicleRates.push(newRate);
        if (typeof al === 'function') al('al-sr', L.rateSavedOk || 'گاڑی کا ریٹ محفوظ ہو گیا', 'ok');
    }

    if (typeof svVR === 'function') svVR();
    cancelRateEdit();
    renderRateList();
}

function editRate(rateId) {
    if (!Array.isArray(vehicleRates)) return;
    const r = vehicleRates.find(x => String(x.id) === String(rateId));
    if (!r) return;

    populateRateFormDropdowns();

    const idEl = document.getElementById('sr-id');
    const sectorEl = document.getElementById('sr-sector');
    const transEl = document.getElementById('sr-transport');
    const fareEl = document.getElementById('sr-fare');
    const typeEl = document.getElementById('sr-type');
    const fromEl = document.getElementById('sr-from');
    const toEl = document.getElementById('sr-to');
    const noteEl = document.getElementById('sr-note');
    const btnCancel = document.getElementById('btn-cancel-rate');
    const btnSaveText = document.getElementById('btn-save-rate-text');

    if (idEl) idEl.value = r.id;
    if (sectorEl) sectorEl.value = r.sector || '';
    if (transEl) transEl.value = r.transport || '';
    if (fareEl) fareEl.value = r.fare !== undefined ? r.fare : '';
    if (typeEl) typeEl.value = r.type || 'vehicle';
    if (fromEl) fromEl.value = r.validFrom || '';
    if (toEl) toEl.value = r.validTo || '';
    if (noteEl) noteEl.value = r.note || '';

    if (btnCancel) btnCancel.style.display = 'inline-flex';
    if (btnSaveText) btnSaveText.textContent = (T[lang] || T.ur).saveUpd || 'اپڈیٹ محفوظ کریں';

    const card = document.querySelector('.rate-form-card');
    if (card) card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function cancelRateEdit() {
    const idEl = document.getElementById('sr-id');
    const fareEl = document.getElementById('sr-fare');
    const fromEl = document.getElementById('sr-from');
    const toEl = document.getElementById('sr-to');
    const noteEl = document.getElementById('sr-note');
    const btnCancel = document.getElementById('btn-cancel-rate');
    const btnSaveText = document.getElementById('btn-save-rate-text');

    if (idEl) idEl.value = '';
    if (fareEl) fareEl.value = '';
    if (fromEl) fromEl.value = '';
    if (toEl) toEl.value = '';
    if (noteEl) noteEl.value = '';

    if (btnCancel) btnCancel.style.display = 'none';
    if (btnSaveText) btnSaveText.textContent = (T[lang] || T.ur).save || 'ریٹ محفوظ کریں';
}

async function deleteRate(rateId) {
    const L = (typeof T !== 'undefined' && T[lang]) ? T[lang] : ((typeof T !== 'undefined' && T.ur) ? T.ur : {});
    if (!Array.isArray(vehicleRates)) return;
    const r = vehicleRates.find(x => String(x.id) === String(rateId));
    if (!r) return;

    if (typeof verifyPassword === 'function') {
        const ok = await verifyPassword(`کیا آپ ${r.sector} (${r.transport}) کا ریٹ حذف کرنا چاہتے ہیں؟`);
        if (!ok) return;
    } else {
        if (!confirm('کیا آپ یہ ریٹ حذف کرنا چاہتے ہیں؟')) return;
    }

    vehicleRates = vehicleRates.filter(x => String(x.id) !== String(rateId));
    if (typeof svVR === 'function') svVR();
    if (typeof al === 'function') al('al-sr', L.rateDeletedOk || 'ریٹ حذف ہو گیا', 'ok');
    renderRateList();
}

window.renderNatureList = renderNatureList;
window.exportAllDataBackup = exportAllDataBackup;
window.copyBackupToClipboard = copyBackupToClipboard;
window.importAllDataBackup = importAllDataBackup;
window.pasteBackupFromPrompt = pasteBackupFromPrompt;
window.renderRateList = renderRateList;
window.populateRateFormDropdowns = populateRateFormDropdowns;
window.addOrUpdateRate = addOrUpdateRate;
window.editRate = editRate;
window.cancelRateEdit = cancelRateEdit;
window.deleteRate = deleteRate;