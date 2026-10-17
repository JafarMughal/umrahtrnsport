// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  AUTH
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// Set the current user's role state
function setCurrentUserRole(username) {
    const found = users.find(x => x.username.toLowerCase() === (username || '').toLowerCase());
    if (found) {
        currentUserRole = found.role || 'operator';
    } else if (username === 'admin' || username === 'jafarmughal') {
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
        document.getElementById('btn-logout').textContent = L.logout || 'Log Out 🚪';
        enforcePermissions();
    } else {
        mainAppContainer.style.display = 'none';
        loginPage.style.display = 'flex';
        document.getElementById('li-username').value = '';
        document.getElementById('li-password').value = '';
        document.getElementById('login-title').textContent = L.loginTitle || 'لاگ ان کریں';
        document.getElementById('lbl-li-username').textContent = L.username || 'صارف نام';
        document.getElementById('lbl-li-password').textContent = L.password || 'پاس ورڈ';
        document.getElementById('btn-login-submit').textContent = L.login || 'لاگ ان';
    }
}

async function login() {
    const L = T[lang] || T.ur;
    const usernameInput = document.getElementById('li-username').value.trim();
    const passwordInput = document.getElementById('li-password').value;

    if (!usernameInput || !passwordInput) {
        al('al-login', L.entryRequired || 'صارف نام اور پاس ورڈ درج کریں', 'er');
        return;
    }

    const email = usernameInput.includes('@') ? usernameInput : getEmail(usernameInput);

    try {
        const userCredential = await auth.signInWithEmailAndPassword(email, passwordInput);
        const user = userCredential.user;
        const uname = user.email.split('@')[0];

        // Check if user is disabled
        const found = users.find(x => x.username.toLowerCase() === uname.toLowerCase());
        if (found && found.disabled) {
            await auth.signOut();
            al('al-login', '⛔ یہ اکاؤنٹ غیر فعال ہے۔ ایڈمن سے رابطہ کریں', 'er');
            return;
        }

        loggedInUser = uname;
        setCurrentUserRole(loggedInUser);

        if (!found) {
            const isFirstAdmin = (uname === 'admin' || uname === 'jafarmughal');
            users.push({
                username: loggedInUser,
                role: isFirstAdmin ? 'superadmin' : 'operator',
                disabled: false,
                createdAt: new Date().toISOString().slice(0, 10),
                createdBy: 'system'
            });
            svU();
            setCurrentUserRole(loggedInUser);
        } else if ((found.username === 'admin' || found.username === 'jafarmughal') && found.role !== 'superadmin') {
            // Migrate existing admin to superadmin
            found.role = 'superadmin';
            svU();
            setCurrentUserRole(loggedInUser);
        }

        // Update last login time
        if (found) {
            found.lastLogin = new Date().toISOString().slice(0, 10);
            svU();
        }

        al('al-login', L.loginSuccess || '✅ لاگ ان کامیاب', 'ok');
        checkAuth();

        setTimeout(() => {
            if (loggedInUser) {
                const defTab = canDo('entry') ? 'entry' : 'records';
                const defBtn = document.getElementById('nav-' + defTab) || document.querySelector(`#main-nav button[onclick*="${defTab}"]`);
                showPage(defTab, defBtn);
            }
        }, 500);

    } catch (e) {
        console.error('Login error:', e);

        // EMERGENCY LOCAL LOGIN
        if ((usernameInput === 'admin' || usernameInput === 'jafarmughal' || usernameInput === 'jafarmughal@gmail.com') && passwordInput) {
            loggedInUser = usernameInput.includes('@') ? usernameInput.split('@')[0] : usernameInput;
            const found = users.find(x => x.username.toLowerCase() === loggedInUser.toLowerCase());
            if (!found) {
                users.push({ username: loggedInUser, role: 'superadmin', disabled: false, createdAt: new Date().toISOString().slice(0, 10), createdBy: 'system' });
                svU();
            } else if (found.role !== 'superadmin') {
                found.role = 'superadmin';
                svU();
            }
            setCurrentUserRole(loggedInUser);
            al('al-login', '✅ لاگ ان کامیاب (لوکل موڈ)', 'ok');
            checkAuth();
            setTimeout(() => {
                const defTab = canDo('entry') ? 'entry' : 'records';
                const defBtn = document.getElementById('nav-' + defTab) || document.querySelector(`#main-nav button[onclick*="${defTab}"]`);
                showPage(defTab, defBtn);
            }, 500);
            return;
        }

        let msg = L.invalidLogin || 'غلط صارف نام یا پاس ورڈ';
        if (e.code === 'auth/user-not-found') {
            msg = 'یوزر موجود نہیں۔ ایڈمن سے رابطہ کریں';
        } else if (e.code === 'auth/wrong-password') {
            msg = 'غلط پاس ورڈ۔ دوبارہ کوشش کریں';
        } else if (e.code === 'auth/too-many-requests') {
            msg = 'بہت زیادہ ناکام کوششیں۔ تھوڑی دیر بعد کوشش کریں';
        } else if (e.code === 'auth/network-request-failed') {
            msg = 'نیٹورک کنکشن نہیں۔ انٹرنیٹ چیک کریں';
        }
        al('al-login', msg, 'er');
    }
}

async function logout() {
    try {
        await auth.signOut();
    } catch (e) {
        console.warn('Logout error:', e);
    }
    loggedInUser = null;
    currentUserRole = null;
    isSuperAdmin = false;
    checkAuth();
}

async function initUsers() {
    if (!users || !users.length) {
        users = [{ username: 'admin', role: 'superadmin', disabled: false, createdAt: new Date().toISOString().slice(0, 10), createdBy: 'system' }];
        svU();
    } else {
        // Migrate old users: upgrade admin/jafarmughal to superadmin if needed
        let migrated = false;
        users.forEach(u => {
            if ((u.username === 'admin' || u.username === 'jafarmughal') && u.role !== 'superadmin') {
                u.role = 'superadmin';
                migrated = true;
            }
            // Add missing fields to old user objects
            if (u.disabled === undefined) { u.disabled = false; migrated = true; }
            if (!u.createdAt) { u.createdAt = '2024-01-01'; migrated = true; }
        });
        if (migrated) svU();
    }

    try {
        await secondaryAuth.createUserWithEmailAndPassword(getEmail('admin'), 'admin123');
    } catch (e) {
        if (e.code === 'auth/email-already-in-use') {
            // User already exists
        } else if (e.code === 'auth/network-request-failed') {
            console.warn('Network error, using local data only');
        } else {
            console.warn('User creation error:', e.message);
        }
    }
}

async function addUser() {
    if (!canDo('adminPanel')) { alert('اجازت نہیں'); return; }
    const L = T[lang] || T.ur;
    const u = document.getElementById('adm-su-username').value.trim();
    const p = document.getElementById('adm-su-password').value;
    const roleEl = document.getElementById('adm-su-role');
    const role = roleEl ? roleEl.value : 'operator';

    if (!u || !p) { al('adm-al-su', L.entryRequired || '⚠️ صارف نام اور پاس ورڈ ضروری ہے', 'er'); return; }
    if (p.length < 6) { al('adm-al-su', '⚠️ پاس ورڈ کم از کم 6 حروف کا ہونا چاہیے', 'er'); return; }
    if (users.some(x => x.username.toLowerCase() === u.toLowerCase())) {
        al('adm-al-su', L.userExists || '⚠️ یہ صارف نام پہلے سے موجود ہے', 'er');
        return;
    }

    try {
        await secondaryAuth.createUserWithEmailAndPassword(getEmail(u), p);
        users.push({
            username: u,
            role: role,
            disabled: false,
            createdAt: new Date().toISOString().slice(0, 10),
            createdBy: loggedInUser || 'admin'
        });
        svU();
        renderAdminUserTable();
        document.getElementById('adm-su-username').value = '';
        document.getElementById('adm-su-password').value = '';
        al('adm-al-su', '✅ یوزر کامیابی سے شامل ہوگیا', 'ok');
    } catch (e) {
        console.error('Add user error:', e);
        let msg = e.message;
        if (e.code === 'auth/email-already-in-use') {
            msg = '⚠️ یہ یوزر پہلے سے Firebase میں موجود ہے';
        } else if (e.code === 'auth/network-request-failed') {
            // Offline mode — add locally only
            users.push({
                username: u,
                role: role,
                disabled: false,
                createdAt: new Date().toISOString().slice(0, 10),
                createdBy: loggedInUser || 'admin'
            });
            svU();
            renderAdminUserTable();
            document.getElementById('adm-su-username').value = '';
            document.getElementById('adm-su-password').value = '';
            al('adm-al-su', '✅ یوزر شامل ہوگیا (آف لائن موڈ — Firebase sync ہوگا)', 'ok');
            return;
        }
        al('adm-al-su', msg, 'er');
    }
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
    // Legacy: kept for backward compat — now handled by renderAdminUserTable
    renderAdminUserTable();
}
