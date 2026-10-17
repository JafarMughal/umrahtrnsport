// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  LOGO & APP NAME
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function handleLogoUpload(inp) {
    const file = inp.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = e => { fbLogo = e.target.result; saveAppSettingsToFb(); applyLogo(e.target.result); };
    reader.readAsDataURL(file);
}

function handleLogoDrop(e) {
    e.preventDefault();
    const dropZone = document.getElementById('logo-drop-zone');
    if (dropZone) dropZone.classList.remove('dragover');
    const file = e.dataTransfer.files[0]; if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = ev => { fbLogo = ev.target.result; saveAppSettingsToFb(); applyLogo(ev.target.result); };
    reader.readAsDataURL(file);
}

function applyLogo(src) {
    const emoji = document.getElementById('header-logo-emoji');
    const img = document.getElementById('header-logo-img');
    if (emoji && img) {
        if (src) { emoji.style.display = 'none'; img.src = src; img.style.display = 'block'; }
        else { emoji.style.display = ''; img.style.display = 'none'; }
    }
    const pe = document.getElementById('logo-preview-emoji');
    const pi = document.getElementById('logo-preview-img');
    const rb = document.getElementById('btn-removeLogo');
    if (pe && pi) {
        if (src) { pe.style.display = 'none'; pi.src = src; pi.style.display = 'block'; if (rb) rb.style.display = 'inline-flex'; }
        else { pe.style.display = ''; pi.style.display = 'none'; if (rb) rb.style.display = 'none'; }
    }
}

function removeLogo() { fbLogo = null; saveAppSettingsToFb(); applyLogo(null); }

function loadAppName(l) {
    const L = T[l] || T.ur;
    const name = fbAppName[l] || L.appTitle;
    const sub = fbAppSub[l] || L.appSub;
    const titleEl = document.getElementById('app-title'); if (titleEl) titleEl.textContent = name;
    const subEl = document.getElementById('app-sub'); if (subEl) subEl.textContent = sub;
    const subLoginEl = document.getElementById('app-sub-login'); if (subLoginEl) subLoginEl.textContent = sub;
    const setName = document.getElementById('set-appname'); if (setName) setName.value = name;
    const setSub = document.getElementById('set-appsub'); if (setSub) setSub.value = sub;
}

function saveAppSettings() {
    const L = T[lang] || T.ur;
    const name = document.getElementById('set-appname').value.trim();
    const sub = document.getElementById('set-appsub').value.trim();
    if (name) fbAppName[lang] = name;
    if (sub) fbAppSub[lang] = sub;
    saveAppSettingsToFb();
    loadAppName(lang);
    al('al-app', L.appSavedOk, 'ok');
}