// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  SUPER ADMIN PANEL
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function renderAdminPanel() {
    if (!canDo('adminPanel')) return;
    renderAdminDashboard();
    renderAdminUserTable();
    renderPermissionsPanel();
}

// ───────────────────────────────────────────
// DASHBOARD STATS
// ───────────────────────────────────────────
function renderAdminDashboard() {
    const el = document.getElementById('admin-dashboard');
    if (!el) return;
    const roleDefs = [
        { role: 'superadmin', label: 'سوپر ایڈمن', cls: 'dash-superadmin' },
        { role: 'admin',      label: 'ایڈمن',       cls: 'dash-admin' },
        { role: 'operator',   label: 'آپریٹر',     cls: 'dash-operator' },
        { role: 'viewer',     label: 'ویور',       cls: 'dash-viewer' }
    ];
    el.innerHTML = roleDefs.map(rd => {
        const count = users.filter(u => u.role === rd.role).length;
        const active = users.filter(u => u.role === rd.role && !u.disabled).length;
        return `
        <div class="admin-dash-card ${rd.cls}">
            <div class="adc-info">
                <div class="adc-count">${count}</div>
                <div class="adc-label">${rd.label}</div>
                <div class="adc-sub">${active} فعال</div>
            </div>
        </div>`;
    }).join('');

    // Total stats
    const totalEl = document.getElementById('admin-total-stats');
    if (totalEl) {
        totalEl.innerHTML = `
            <span>کل یوزرز: <strong>${users.length}</strong></span>
            <span>فعال: <strong>${users.filter(u => !u.disabled).length}</strong></span>
            <span>غیر فعال: <strong>${users.filter(u => u.disabled).length}</strong></span>
        `;
    }
}

// ───────────────────────────────────────────
// USER MANAGEMENT TABLE
// ───────────────────────────────────────────
function renderAdminUserTable() {
    const el = document.getElementById('admin-users-tbody');
    if (!el) return;

    if (!users.length) {
        el.innerHTML = `<tr><td colspan="6" class="admin-users-empty">کوئی یوزر نہیں</td></tr>`;
        return;
    }

    const roleOpts = [
        { v: 'superadmin', l: 'سوپر ایڈمن' },
        { v: 'admin',      l: 'ایڈمن' },
        { v: 'operator',   l: 'آپریٹر' },
        { v: 'viewer',     l: 'ویور' }
    ];

    el.innerHTML = users.map((u, i) => {
        const isSelf = u.username === loggedInUser;
        const isSA = u.role === 'superadmin';
        const disabledAttr = (isSelf || isSA) ? 'disabled' : '';
        const disabledCls = u.disabled ? 'user-row-disabled' : '';

        const roleDropdown = `
            <select class="role-select" onchange="changeUserRole(${i}, this.value)" ${isSA && !isSelf ? '' : ''}>
                ${roleOpts.map(r => `<option value="${r.v}" ${u.role === r.v ? 'selected' : ''}>${r.l}</option>`).join('')}
            </select>`;

        const statusToggle = `
            <label class="toggle-switch" title="${u.disabled ? 'فعال کریں' : 'غیر فعال کریں'}">
                <input type="checkbox" ${u.disabled ? '' : 'checked'} ${(isSelf || isSA) ? 'disabled' : ''} onchange="toggleUserDisabled(${i})">
                <span class="toggle-slider"></span>
            </label>`;

        const delBtn = (!isSelf && !isSA)
            ? `<button class="btn btn-d btn-sm" onclick="deleteUser(${i})" title="حذف کریں">حذف</button>`
            : `<button class="btn btn-o btn-sm admin-protected-delete" disabled>حذف</button>`;

        const badge = `<span class="role-badge badge-${u.role} admin-user-role-badge">${u.role}</span>`;

        return `
        <tr class="${disabledCls}">
            <td class="admin-username-cell">${u.username} ${isSelf ? '<span class="admin-current-user-tag">(آپ)</span>' : ''}</td>
            <td>${roleDropdown}</td>
            <td class="admin-user-status-cell">${statusToggle}</td>
            <td class="admin-user-date-cell">${u.createdAt || '—'}</td>
            <td class="admin-user-date-cell">${u.lastLogin || '—'}</td>
            <td class="admin-user-action-cell">${delBtn}</td>
        </tr>`;
    }).join('');

    // Refresh dashboard stats too
    renderAdminDashboard();
}

function saveAdminUsers() {
    if (!canDo('adminPanel')) { alert('اجازت نہیں'); return; }
    svU();
    renderAdminUserTable();
    al('adm-al-su', 'صارفین کی فہرست اور تبدیلیاں کامیابی سے محفوظ ہوگئیں', 'ok');
}

// ───────────────────────────────────────────
// GRANULAR PERMISSIONS PANEL
// ───────────────────────────────────────────
const PERM_DEFS = [
    { key: 'showAmounts',   label: 'رقم دکھائیں (Amounts)',          desc: 'کل رقم، فی کس کرایہ وغیرہ دیکھائیں' },
    { key: 'showPayments',  label: 'ادائیگی تفصیل (Payments)',        desc: 'لیجر میں موصول/باقی رقم دیکھیں' },
    { key: 'showReport',    label: 'رپورٹ صفحہ (Report)',           desc: 'رپورٹ صفحہ تک رسائی' },
    { key: 'showDailyNote', label: 'ڈیلی نوٹ (Daily Note)',         desc: 'ڈیلی نوٹ صفحہ تک رسائی' },
    { key: 'canExport',     label: 'Excel Export',                  desc: 'Excel فائل بنانے کی اجازت' },
    { key: 'canPrint',      label: 'Print کی اجازت',                desc: 'Print بٹن دکھائیں' },
    { key: 'showVoucher',   label: 'واوچر نمبر (Voucher)',          desc: 'واوچر نمبر کالم دکھائیں' }
];

const PERM_ROLES = [
    { role: 'admin',    label: 'ایڈمن' },
    { role: 'operator', label: 'آپریٹر' },
    { role: 'viewer',   label: 'ویور' }
];

function renderPermissionsPanel() {
    const el = document.getElementById('perms-table-body');
    if (!el) return;

    el.innerHTML = PERM_DEFS.map(pd => {
        const cols = PERM_ROLES.map(pr => {
            const val = rolePermissions[pr.role] ? rolePermissions[pr.role][pd.key] : true;
            return `
            <td class="admin-perm-toggle-cell">
                <label class="toggle-switch">
                    <input type="checkbox" id="perm-${pr.role}-${pd.key}" ${val ? 'checked' : ''}
                        onchange="onPermToggle('${pr.role}','${pd.key}',this.checked)">
                    <span class="toggle-slider"></span>
                </label>
            </td>`;
        }).join('');

        return `
        <tr>
            <td>
                <div class="admin-perm-label">${pd.label}</div>
                <div class="admin-perm-detail">${pd.desc}</div>
            </td>
            ${cols}
        </tr>`;
    }).join('');
}

function onPermToggle(role, key, val) {
    if (!rolePermissions[role]) rolePermissions[role] = {};
    rolePermissions[role][key] = val;
    // Auto-save after short delay
    clearTimeout(window._permSaveTimer);
    window._permSaveTimer = setTimeout(() => {
        svRP();
        enforcePermissions();
        al('al-admin', 'اجازتیں محفوظ ہوگئیں', 'ok');
    }, 800);
}

function savePermissions() {
    svRP();
    enforcePermissions();
    al('al-admin', 'اجازتیں محفوظ ہوگئیں', 'ok');
}

function switchAdminTab(tabId) {
    document.querySelectorAll('#page-admin .admin-tab-content').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('#page-admin .admin-tab-btn').forEach(el => el.classList.remove('active'));
    const tab = document.getElementById(tabId);
    if (tab) tab.classList.add('active');
    const btn = document.getElementById('atb-' + tabId);
    if (btn) btn.classList.add('active');

    // Render relevant section
    if (tabId === 'admin-tab-users') renderAdminUserTable();
    if (tabId === 'admin-tab-perms') renderPermissionsPanel();
    if (tabId === 'admin-tab-dashboard') renderAdminDashboard();
}
