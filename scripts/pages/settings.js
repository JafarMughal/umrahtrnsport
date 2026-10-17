// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  SETTINGS (add/delete items) — Nordic Slate-Teal Theme
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function addFromSettings(type) {
    try {
        const inpMap = { party: 'sp-in', sector: 'ss-in', transport: 'st-in', hajiParty: 'shp-in', shirka: 'ssh-in' };
        const alMap = { party: 'al-sp', sector: 'al-ss', transport: 'al-st', hajiParty: 'al-shp', shirka: 'al-ssh' };
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

        const arr = type === 'party' ? parties : type === 'sector' ? sectors : type === 'transport' ? transports : type === 'shirka' ? shirkas : hajiParties;

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
        else renderHajiPartyList();
    } catch (err) {
        console.error(`Error in addFromSettings(${type}):`, err);
        const alMap = { party: 'al-sp', sector: 'al-ss', transport: 'al-st', hajiParty: 'al-shp', shirka: 'al-ssh' };
        if (typeof al === 'function') al(alMap[type], 'خرابی: ' + (err.message || err), 'er');
    }
}

async function deleteItem(type, idx) {
    const L = (typeof T !== 'undefined' && T[lang]) ? T[lang] : ((typeof T !== 'undefined' && T.ur) ? T.ur : {});
    const arr = type === 'party' ? parties : type === 'sector' ? sectors : type === 'transport' ? transports : type === 'shirka' ? shirkas : hajiParties;
    const name = arr[idx];
    let used = false;
    if (type === 'party') used = (records || []).some(r => r.party === name) || (payments || []).some(p => p.party === name);
    else if (type === 'sector') used = (records || []).some(r => r.sector === name);
    else if (type === 'transport') used = (records || []).some(r => r.transport === name);
    else if (type === 'shirka') used = (records || []).some(r => r.shirka === name);
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
    else { if (typeof svHP === 'function') svHP(); }

    if (typeof refreshAllDrops === 'function') refreshAllDrops();
    if (type === 'party') renderPartyList();
    else if (type === 'sector') renderSectorList();
    else if (type === 'transport') renderTransportList();
    else if (type === 'shirka') renderShirkaList();
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
}

function editItem(type, idx) {
    const L = (typeof T !== 'undefined' && T[lang]) ? T[lang] : ((typeof T !== 'undefined' && T.ur) ? T.ur : {});
    const arr = type === 'party' ? parties : type === 'sector' ? sectors : type === 'transport' ? transports : type === 'shirka' ? shirkas : hajiParties;
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
    else renderHajiPartyList();
}

function saveItemEdit(type, idx) {
    const L = (typeof T !== 'undefined' && T[lang]) ? T[lang] : ((typeof T !== 'undefined' && T.ur) ? T.ur : {});
    const arr = type === 'party' ? parties : type === 'sector' ? sectors : type === 'transport' ? transports : type === 'shirka' ? shirkas : hajiParties;
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

    if (typeof al === 'function') {
        al('al-backup', `ڈیٹا کامیابی سے بحال ہو گیا! (${records.length} ریکارڈز، ${payments.length} ادائیگیاں)`, 'ok');
    }
    alert(`ڈیٹا کامیابی سے بحال ہو گیا!\nکل ریکارڈز: ${records.length}\nکل ادائیگیاں: ${payments.length}`);
}

window.exportAllDataBackup = exportAllDataBackup;
window.copyBackupToClipboard = copyBackupToClipboard;
window.importAllDataBackup = importAllDataBackup;
window.pasteBackupFromPrompt = pasteBackupFromPrompt;