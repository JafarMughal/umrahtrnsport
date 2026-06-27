// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  AUTH
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function checkAuth() {
    const mainAppContainer = document.getElementById('main-app-container');
    const loginPage = document.getElementById('login-container');
    const L = T[lang] || T.ur;

    if (loggedInUser) {
        mainAppContainer.style.display = 'block';
        loginPage.style.display = 'none';
        document.getElementById('lbl-logged-in-user').textContent = (L.loggedUser || 'User: ') + loggedInUser;
        document.getElementById('btn-logout').textContent = L.logout || 'Log Out 🚪';
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
        loggedInUser = user.email.split('@')[0];

        const found = users.find(x => x.username.toLowerCase() === loggedInUser.toLowerCase());
        if (!found) {
            users.push({ username: loggedInUser, role: 'operator' });
            svU();
        }

        al('al-login', L.loginSuccess || '✅ لاگ ان کامیاب', 'ok');
        checkAuth();

        setTimeout(() => {
            if (loggedInUser) {
                showPage('entry', document.querySelectorAll('#main-nav button')[0]);
            }
        }, 500);

    } catch (e) {
        console.error('Login error:', e);

        // EMERGENCY LOCAL LOGIN
        if ((usernameInput === 'admin' || usernameInput === 'jafarmughal' || usernameInput === 'jafarmughal@gmail.com') && passwordInput) {
            loggedInUser = usernameInput.includes('@') ? usernameInput.split('@')[0] : usernameInput;
            if (!users.find(x => x.username.toLowerCase() === loggedInUser.toLowerCase())) {
                users.push({ username: loggedInUser, role: 'admin' });
                svU();
            }
            al('al-login', '✅ لاگ ان کامیاب (لوکل موڈ)', 'ok');
            checkAuth();
            setTimeout(() => {
                showPage('entry', document.querySelectorAll('#main-nav button')[0]);
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
    checkAuth();
}

async function initUsers() {
    if (!users || !users.length) {
        users = [{ username: 'admin', role: 'admin' }];
        svU();
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
    const L = T[lang] || T.ur;
    const u = document.getElementById('su-username').value.trim();
    const p = document.getElementById('su-password').value;
    if (!u || !p) { al('al-su', L.entryRequired, 'er'); return; }
    if (users.some(x => x.username.toLowerCase() === u.toLowerCase())) {
        al('al-su', L.userExists || 'Username already exists', 'er');
        return;
    }

    try {
        await secondaryAuth.createUserWithEmailAndPassword(getEmail(u), p);
        users.push({ username: u, role: 'operator' });
        svU();
        renderUsers();
        document.getElementById('su-username').value = '';
        document.getElementById('su-password').value = '';
        al('al-su', L.userAdded || 'User added successfully', 'ok');
    } catch (e) {
        console.error('Add user error:', e);
        let msg = e.message;
        if (e.code === 'auth/email-already-in-use') {
            msg = 'User already exists in authentication system.';
        }
        al('al-su', msg, 'er');
    }
}

async function deleteUser(idx) {
    const L = T[lang] || T.ur;
    const user = users[idx];
    if (user.username === loggedInUser) { alert(L.userDeleteErrorSelf || 'You cannot delete yourself!'); return; }
    if (!(await verifyPassword(L.userDeleteConfirm || 'Delete this user?'))) return;
    users.splice(idx, 1);
    svU();
    renderUsers();
}

function renderUsers() {
    const L = T[lang] || T.ur;
    const el = document.getElementById('users-list');
    if (!el) return;
    if (!users.length) { el.innerHTML = `<span style="color:var(--muted);font-size:12px;">No users found</span>`; return; }
    el.innerHTML = users.map((u, i) => {
        const canDelete = u.username !== loggedInUser && (u.username !== 'admin' || users.filter(x => x.username === 'admin').length > 1);
        const delBtn = canDelete ? `<button class="x" onclick="deleteUser(${i})">✕</button>` : '';
        return `<div class="user-tag"><span class="username-val">${u.username}</span><span class="role-badge">${u.role || 'operator'}</span>${delBtn}</div>`;
    }).join('');
}