// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  PERMISSION ENGINE (RBAC)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// Fixed role permissions (what actions each role can perform)
const ROLE_ACTIONS = {
    superadmin: ['entry', 'edit', 'delete', 'payment', 'deletePay', 'settings', 'view', 'users', 'adminPanel', 'export', 'print'],
    admin:      ['entry', 'edit', 'delete', 'payment', 'deletePay', 'settings', 'view', 'export', 'print'],
    operator:   ['entry', 'edit', 'payment', 'view'],
    viewer:     ['view']
};

// Check if current user can perform an action
function canDo(action) {
    const role = currentUserRole || 'viewer';
    const actions = ROLE_ACTIONS[role] || ROLE_ACTIONS.viewer;
    return actions.includes(action);
}

// Get granular permissions for current user role
function getMyPerms() {
    if (currentUserRole === 'superadmin') {
        return {
            showAmounts: true, showPayments: true,
            canExport: true, canPrint: true,
            showReport: true, showDailyNote: true, showVoucher: true
        };
    }
    const role = currentUserRole || 'viewer';
    const defaults = {
        showAmounts: true, showPayments: true,
        canExport: true, canPrint: true,
        showReport: true, showDailyNote: true, showVoucher: true
    };
    return Object.assign({}, defaults, rolePermissions[role] || rolePermissions.viewer);
}

// Apply all UI permissions after login
function enforcePermissions() {
    const role = currentUserRole || 'viewer';
    const perms = getMyPerms();

    // ── Navigation Tabs ──
    const navEntry = document.getElementById('nav-entry');
    if (navEntry) navEntry.style.display = canDo('entry') ? '' : 'none';

    const navPayment = document.getElementById('nav-payment');
    if (navPayment) navPayment.style.display = canDo('payment') ? '' : 'none';

    const navSettings = document.getElementById('nav-settings');
    if (navSettings) navSettings.style.display = canDo('settings') ? '' : 'none';

    const navAdmin = document.getElementById('nav-admin-panel');
    if (navAdmin) navAdmin.style.display = canDo('adminPanel') ? '' : 'none';

    const navReport = document.getElementById('nav-report');
    if (navReport) navReport.style.display = perms.showReport ? '' : 'none';

    const navDailyNote = document.getElementById('nav-dailynote');
    if (navDailyNote) navDailyNote.style.display = perms.showDailyNote ? '' : 'none';

    // ── Entry page buttons ──
    const btnSave = document.getElementById('btn-save');
    if (btnSave) btnSave.style.display = canDo('entry') ? '' : 'none';
    const btnClear = document.getElementById('btn-clear');
    if (btnClear) btnClear.style.display = canDo('entry') ? '' : 'none';

    // ── Payment Save button ──
    const btnSavePay = document.getElementById('btn-savepay');
    if (btnSavePay) btnSavePay.style.display = canDo('payment') ? '' : 'none';

    // ── Role badge in header ──
    const badge = document.getElementById('role-badge');
    if (badge) {
        const roleLabels = {
            superadmin: { label: 'سوپر ایڈمن', icon: '👑', cls: 'badge-superadmin' },
            admin:      { label: 'ایڈمن', icon: '🔑', cls: 'badge-admin' },
            operator:   { label: 'آپریٹر', icon: '✍️', cls: 'badge-operator' },
            viewer:     { label: 'ویور', icon: '👁️', cls: 'badge-viewer' }
        };
        const rb = roleLabels[role] || roleLabels.viewer;
        badge.textContent = rb.icon + ' ' + rb.label;
        badge.className = 'role-badge ' + rb.cls;
        badge.style.display = '';
    }

    // ── Export buttons ──
    document.querySelectorAll('.export-btn').forEach(el => {
        el.style.display = perms.canExport ? '' : 'none';
    });

    // ── Print buttons ──
    document.querySelectorAll('.print-btn').forEach(el => {
        el.style.display = perms.canPrint ? '' : 'none';
    });

    // ── If current active page is restricted, switch to allowed default ──
    if (currentActiveTab === 'entry' && !canDo('entry')) {
        switchToTab('records');
    } else if (currentActiveTab === 'payment' && !canDo('payment')) {
        switchToTab('records');
    } else if (currentActiveTab === 'settings' && !canDo('settings')) {
        switchToTab('records');
    } else if (currentActiveTab === 'admin' && !canDo('adminPanel')) {
        switchToTab('records');
    }
}

// Called when rolePermissions is updated from Firebase or after saving
function applyGranularPerms(newPerms) {
    if (newPerms) {
        ['admin', 'operator', 'viewer'].forEach(role => {
            if (newPerms[role]) {
                rolePermissions[role] = Object.assign({}, rolePermissions[role], newPerms[role]);
            }
        });
    }
    enforcePermissions();
}
