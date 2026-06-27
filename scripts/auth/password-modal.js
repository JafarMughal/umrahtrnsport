// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  PASSWORD VERIFICATION MODAL
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function verifyPassword(confirmMsg) {
    const L = T[lang] || T.ur;
    return new Promise(resolve => {
        document.getElementById('del-m-msg').textContent = confirmMsg;
        document.getElementById('del-m-title').textContent = L.enterPassword || 'Enter Password';
        const inp = document.getElementById('del-m-input');
        inp.value = '';

        document.getElementById('del-modal').classList.add('active');
        inp.focus();

        _delResolve = resolve;
    });
}

async function confirmDeleteModal() {
    const L = T[lang] || T.ur;
    const pwd = document.getElementById('del-m-input').value;

    if (pwd === deletePassword) {
        document.getElementById('del-modal').classList.remove('active');
        if (_delResolve) _delResolve(true);
    } else {
        alert(L.incorrectPassword || 'Incorrect password!');
        document.getElementById('del-m-input').value = '';
        document.getElementById('del-m-input').focus();
    }
}

function closeDeleteModal() {
    document.getElementById('del-modal').classList.remove('active');
    if (_delResolve) _delResolve(false);
}

function togglePasswordVisibility() {
    const pwdInput = document.getElementById('li-password');
    const toggleIcon = document.getElementById('toggle-password');

    const eyeSVG = '<svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>';
    const eyeOffSVG = '<svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>';

    if (pwdInput.type === 'password') {
        pwdInput.type = 'text';
        toggleIcon.innerHTML = eyeOffSVG;
        toggleIcon.title = 'Hide Password';
    } else {
        pwdInput.type = 'password';
        toggleIcon.innerHTML = eyeSVG;
        toggleIcon.title = 'Show Password';
    }
}