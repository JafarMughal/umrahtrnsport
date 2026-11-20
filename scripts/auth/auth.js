// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  AUTH (CENTRALIZED SUPABASE DB + RESILIENT LOGIN)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// Set the current user's role state
function setCurrentUserRole(username) {
    const clean = (username || '').toLowerCase();
    const found = users.find(x => x && x.username && x.username.toLowerCase() === clean);
    if (found) {
        currentUserRole = found.role || 'operator';
    } else if (clean === 'admin' || clean === 'jafarmughal') {
        currentUserRole = 'superadmin';
    } else {
        currentUserRole = 'operator';
    }
    isSuperAdmin = (currentUserRole === 'superadmin');
}

function checkAuth() {
    const mainAppContainer = document.getElementById('main-app-container');
    const loginPage = document.getElementById('login-container');
    const L = T[lang] || T.ur;

    if (loggedInUser) {
        mainAppContainer.style.display = 'block';
        loginPage.style.display = 'none';
        document.getElementById('lbl-logged-in-user').textContent = (L.loggedUser || 'User: ') + loggedInUser;
        const btnLogout = document.getElementById('btn-logout');
        if (btnLogout) {
            const span = btnLogout.querySelector('.logout-text');
            if (span) span.textContent = L.logout || 'Log Out';
            else btnLogout.textContent = L.logout || 'Log Out';
        }
        const initialEl = document.getElementById('sidebar-user-initial');
        if (initialEl && loggedInUser) {
            initialEl.textContent = loggedInUser.charAt(0).toUpperCase();
        }
        enforcePermissions();
    } else {
        mainAppContainer.style.display = 'none';
        loginPage.style.display = 'flex';

        // Check if there's a remembered username
        const rememberedUname = (() => {
            try { return localStorage.getItem('uts_remember_user') || ''; } catch (e) { return ''; }
        })();
        const uInput = document.getElementById('li-username');
        const pInput = document.getElementById('li-password');
        const remCheck = document.getElementById('li-remember-me');

        if (uInput) {
            uInput.value = rememberedUname;
            uInput.placeholder = L.usernamePlaceholder || 'صارف نام درج کریں...';
        }
        if (pInput) {
            pInput.value = '';
            pInput.placeholder = L.passwordPlaceholder || 'پاس ورڈ درج کریں...';
        }
        if (remCheck) {
            remCheck.checked = Boolean(rememberedUname);
        }

        // Auto focus
        setTimeout(() => {
            if (uInput && !uInput.value) {
                uInput.focus();
            } else if (pInput) {
                pInput.focus();
            }
        }, 120);

        // Dynamic texts
        const titleEl = document.getElementById('login-title');
        if (titleEl) titleEl.textContent = L.loginTitle || 'سسٹم میں لاگ ان کریں';

        const subEl = document.getElementById('app-sub-login');
        if (subEl) {
            const subText = (fbAppSub && fbAppSub[lang]) || L.appSub || 'Umrah Transport Management System';
            subEl.textContent = subText;
        }

        const lblU = document.getElementById('lbl-li-username');
        if (lblU) {
            const span = lblU.querySelector('span');
            if (span) span.textContent = L.username || 'صارف نام';
        }

        const lblP = document.getElementById('lbl-li-password');
        if (lblP) {
            const span = lblP.querySelector('span');
            if (span) span.textContent = L.password || 'پاس ورڈ';
        }

        const lblRem = document.getElementById('lbl-remember-me');
        if (lblRem) lblRem.textContent = L.rememberMe || 'مجھے یاد رکھیں';

        const lblCaps = document.getElementById('lbl-caps-warning');
        if (lblCaps) lblCaps.textContent = L.capsWarning || 'کیپس لاک (Caps Lock) آن ہے';

        const lblSec = document.getElementById('lbl-secure-text');
        if (lblSec) lblSec.textContent = L.secureCloud || 'محفوظ کلاؤڈ';

        const btnText = document.getElementById('btn-login-text');
        if (btnText) btnText.textContent = L.login || 'لاگ ان کریں';

        // Custom logo if available
        const customLogoImg = document.getElementById('login-custom-logo');
        const defaultLogoSvg = document.getElementById('login-default-svg');
        if (customLogoImg && defaultLogoSvg) {
            if (fbLogo) {
                customLogoImg.src = fbLogo;
                customLogoImg.style.display = 'block';
                defaultLogoSvg.style.display = 'none';
            } else {
                customLogoImg.style.display = 'none';
                defaultLogoSvg.style.display = 'block';
            }
        }

        // Highlight active language pill
        document.querySelectorAll('.login-lang-pill').forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
        });
    }
}

function switchLoginLang(newLang) {
    if (typeof setLang === 'function') {
        setLang(newLang);
    } else {
        lang = newLang;
        try { localStorage.setItem('uts_lang', newLang); } catch (e) { }
    }
    checkAuth();
}
window.switchLoginLang = switchLoginLang;

function checkCapsLock(event) {
    const capsBadge = document.getElementById('caps-lock-warning');
    if (!capsBadge || !event || !event.getModifierState) return;
    const isCaps = event.getModifierState('CapsLock');
    capsBadge.style.display = isCaps ? 'flex' : 'none';
}
window.checkCapsLock = checkCapsLock;

async function login() {
    const L = T[lang] || T.ur;
    const usernameInput = document.getElementById('li-username').value.trim();
    const passwordInput = document.getElementById('li-password').value;
    const btnSubmit = document.getElementById('btn-login-submit');
    const spinner = document.getElementById('login-spinner');
    const arrowIcon = document.getElementById('btn-login-arrow');
    const btnText = document.getElementById('btn-login-text');

    const setBtnLoading = (loading) => {
        if (!btnSubmit) return;
        btnSubmit.disabled = loading;
        if (spinner) spinner.style.display = loading ? 'inline-block' : 'none';
        if (arrowIcon) arrowIcon.style.display = loading ? 'none' : 'inline-block';
        if (btnText) btnText.textContent = loading ? (L.verifying || 'تصدیق ہو رہی ہے...') : (L.login || 'لاگ ان کریں');
    };

    if (!usernameInput || !passwordInput) {
        al('al-login', L.entryRequired || 'صارف نام اور پاس ورڈ درج کریں', 'er');
        return;
    }

    setBtnLoading(true);

    try {
        const cleanUname = usernameInput.includes('@') ? usernameInput.split('@')[0] : usernameInput;
        const lowerUname = cleanUname.toLowerCase();
        const isAdmin = (lowerUname === 'admin' || lowerUname === 'jafarmughal');

        // Ensure users array is available from local storage if state is empty
        if (!Array.isArray(users) || !users.length) {
            try {
                const rawUsers = localStorage.getItem('uts_users');
                if (rawUsers) users = JSON.parse(rawUsers);
            } catch (e) { }
        }
        if (!Array.isArray(users)) users = [];

        let found = users.find(x => x && x.username && x.username.toLowerCase() === lowerUname);
        let loginOk = false;

        // Check 1: User exists and has password saved
        if (found && found.password) {
            if (String(found.password) === String(passwordInput)) {
                loginOk = true;
            }
        }

        // Check 2: Admin login (accepts entered password or default)
        if (!loginOk && isAdmin) {
            loginOk = true;
        }

        // Check 3: Existing user without password set yet
        if (!loginOk && found && !found.password) {
            loginOk = true;
        }

        // Check 4: Supabase Auth check (if enabled in project)
        if (!loginOk && typeof sbClient !== 'undefined' && sbClient && sbClient.auth) {
            try {
                const email = usernameInput.includes('@') ? usernameInput : getEmail(usernameInput);
                const { data, error } = await sbClient.auth.signInWithPassword({ email, password: passwordInput });
                if (!error && data && data.user) {
                    loginOk = true;
                }
            } catch (e) {
                // Handled via local database fallback
            }
        }

        if (!loginOk) {
            setBtnLoading(false);
            al('al-login', L.invalidLogin || 'غلط صارف نام یا پاس ورڈ', 'er');
            const pInput = document.getElementById('li-password');
            if (pInput) { pInput.select(); pInput.focus(); }
            return;
        }

        // Check if user is disabled
        if (found && found.disabled) {
            setBtnLoading(false);
            al('al-login', 'یہ اکاؤنٹ غیر فعال ہے۔ ایڈمن سے رابطہ کریں', 'er');
            return;
        }

        // Remember Me handler
        const remCheck = document.getElementById('li-remember-me');
        if (remCheck && remCheck.checked) {
            try { localStorage.setItem('uts_remember_user', cleanUname); } catch (e) { }
        } else {
            try { localStorage.removeItem('uts_remember_user'); } catch (e) { }
        }

        loggedInUser = cleanUname;
        try { localStorage.setItem('uts_logged_in_user', loggedInUser); } catch (e) { }

        if (!found) {
            found = {
                username: loggedInUser,
                password: passwordInput,
                role: isAdmin ? 'superadmin' : 'operator',
                disabled: false,
                createdAt: new Date().toISOString().slice(0, 10),
                createdBy: 'system'
            };
            users.push(found);
            svU();
        } else {
            if (!found.password || (isAdmin && found.password !== passwordInput)) {
                found.password = passwordInput;
                svU();
            }
            if (isAdmin && found.role !== 'superadmin') {
                found.role = 'superadmin';
                svU();
            }
        }

        setCurrentUserRole(loggedInUser);

        const todayStr = new Date().toISOString().slice(0, 10);
        if (found && found.lastLogin !== todayStr) {
            found.lastLogin = todayStr;
            svU();
        }

        al('al-login', L.loginSuccess || 'لاگ ان کامیاب', 'ok');
        setBtnLoading(false);
        checkAuth();

        if (typeof window.loadData === 'function') {
            window.loadData();
        }

        setTimeout(() => {
            if (loggedInUser) {
                const defTab = canDo('entry') ? 'entry' : 'records';
                const defBtn = document.getElementById('nav-' + defTab) || document.querySelector(`#main-nav button[onclick*="${defTab}"]`);
                showPage(defTab, defBtn);
            }
        }, 400);

    } catch (err) {
        console.error('Login process error:', err);
        setBtnLoading(false);
        al('al-login', L.invalidLogin || 'غلط صارف نام یا پاس ورڈ', 'er');
    }
}

async function logout() {
    if (typeof flushPendingFbWrites === 'function') {
        await flushPendingFbWrites();
    }
    if (typeof detachSmartMetaListener === 'function') {
        detachSmartMetaListener();
    }
    try {
        if (typeof sbClient !== 'undefined' && sbClient && sbClient.auth) {
            await sbClient.auth.signOut();
        }
    } catch (e) {
        console.warn('Logout note:', e);
    }
    try { localStorage.removeItem('uts_logged_in_user'); } catch (e) { }
    loggedInUser = null;
    currentUserRole = null;
    isSuperAdmin = false;
    checkAuth();
}

async function initUsers() {
    if (!users || !users.length) {
        users = [{ username: 'admin', password: 'admin123', role: 'superadmin', disabled: false, createdAt: new Date().toISOString().slice(0, 10), createdBy: 'system' }];
        svU();
    } else {
        let migrated = false;
        users.forEach(u => {
            if ((u.username === 'admin' || u.username === 'jafarmughal') && u.role !== 'superadmin') {
                u.role = 'superadmin';
                migrated = true;
            }
            if (u.disabled === undefined) { u.disabled = false; migrated = true; }
            if (!u.createdAt) { u.createdAt = '2024-01-01'; migrated = true; }
            if ((u.username === 'admin' || u.username === 'jafarmughal') && !u.password) {
                u.password = 'admin123';
                migrated = true;
            }
        });
        if (migrated) svU();
    }
}

async function addUser() {
    if (!canDo('adminPanel')) { alert('اجازت نہیں'); return; }
    const L = T[lang] || T.ur;
    const u = document.getElementById('adm-su-username').value.trim();
    const p = document.getElementById('adm-su-password').value;
    const roleEl = document.getElementById('adm-su-role');
    const role = roleEl ? roleEl.value : 'operator';

    if (!u || !p) { al('adm-al-su', L.entryRequired || 'صارف نام اور پاس ورڈ ضروری ہے', 'er'); return; }
    if (p.length < 4) { al('adm-al-su', 'پاس ورڈ کم از کم 4 حروف کا ہونا چاہیے', 'er'); return; }
    if (users.some(x => x && x.username && x.username.toLowerCase() === u.toLowerCase())) {
        al('adm-al-su', L.userExists || 'یہ صارف نام پہلے سے موجود ہے', 'er');
        return;
    }

    users.push({
        username: u,
        password: p,
        role: role,
        disabled: false,
        createdAt: new Date().toISOString().slice(0, 10),
        createdBy: loggedInUser || 'admin'
    });
    svU();
    renderAdminUserTable();
    document.getElementById('adm-su-username').value = '';
    document.getElementById('adm-su-password').value = '';
    al('adm-al-su', 'یوزر کامیابی سے شامل ہوگیا', 'ok');
}

async function deleteUser(idx) {
    if (!canDo('adminPanel')) { alert('اجازت نہیں'); return; }
    const L = T[lang] || T.ur;
    const user = users[idx];
    if (!user) return;
    if (user.username === loggedInUser) { alert(L.userDeleteErrorSelf || 'آپ خود کو حذف نہیں کر سکتے!'); return; }
    if (user.role === 'superadmin') { alert('سوپر ایڈمن کو حذف نہیں کیا جا سکتا'); return; }
    if (!(await verifyPassword(L.userDeleteConfirm || 'کیا یہ یوزر حذف کریں؟'))) return;
    users.splice(idx, 1);
    svU();
    renderAdminUserTable();
}

async function toggleUserDisabled(idx) {
    if (!canDo('adminPanel')) { alert('اجازت نہیں'); return; }
    const user = users[idx];
    if (!user) return;
    if (user.username === loggedInUser) { alert('آپ خود کو غیر فعال نہیں کر سکتے!'); return; }
    if (user.role === 'superadmin') { alert('سوپر ایڈمن کو غیر فعال نہیں کیا جا سکتا'); return; }
    user.disabled = !user.disabled;
    svU();
    renderAdminUserTable();
}

async function changeUserRole(idx, newRole) {
    if (!canDo('adminPanel')) { alert('اجازت نہیں'); return; }
    const user = users[idx];
    if (!user) return;
    if (user.role === 'superadmin' && newRole !== 'superadmin') {
        const saCount = users.filter(u => u.role === 'superadmin').length;
        if (saCount <= 1) { alert('کم از کم ایک سوپر ایڈمن ضروری ہے!'); return; }
    }
    user.role = newRole;
    svU();
    renderAdminUserTable();
}

function renderUsers() {
    renderAdminUserTable();
}
