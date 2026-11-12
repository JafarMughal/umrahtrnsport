// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  UMRAH VOUCHER MODULE (Imports from Active Booking List)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

let _uvAttachedMutamers = [];
let uvCurrentPage = 1;
let uvPageSize = 25;

// ── ESCAPE / PERSISTENCE HELPERS ──
function uvEsc(val) {
    if (typeof escapeUbHtml === 'function') return escapeUbHtml(val);
    return String(val == null ? '' : val)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function getCleanUmrahVouchers() {
    if ((!Array.isArray(umrahVouchers) || !umrahVouchers.length) && typeof localStorage !== 'undefined') {
        try {
            const cached = JSON.parse(localStorage.getItem('uts_umrahVouchers') || '[]');
            if (Array.isArray(cached) && cached.length > 0) {
                umrahVouchers = cached;
            }
        } catch (e) { }
    }
    if (!Array.isArray(umrahVouchers)) return [];
    return umrahVouchers.filter(v => v && typeof v === 'object');
}

function persistUmrahVouchers() {
    try {
        if (typeof localStorage !== 'undefined') {
            if (Array.isArray(umrahVouchers) && umrahVouchers.length > 0) {
                localStorage.setItem('uts_umrahVouchers', JSON.stringify(umrahVouchers));
            } else {
                localStorage.removeItem('uts_umrahVouchers');
            }
        }
    } catch (e) { console.warn('LocalStorage voucher save error:', e); }

    if (typeof svUV === 'function') {
        svUV();
    } else if (typeof _safeFbSet === 'function') {
        _safeFbSet('umrahVouchers', umrahVouchers);
    }
}

function showUvAlert(msg, type = 'ok') {
    if (typeof al === 'function') {
        al('al-umrah-voucher', msg, type);
        return;
    }
    const el = document.getElementById('al-umrah-voucher');
    if (el) {
        el.innerHTML = `<div class="alert a-${type}">${uvEsc(msg)}</div>`;
        setTimeout(() => { el.innerHTML = ''; }, 3500);
    }
}

function genUmrahVoucherNo() {
    const existing = getCleanUmrahVouchers().map(v => {
        const m = String(v.voucherNo || '').match(/(\d+)$/);
        return m ? parseInt(m[1], 10) : 0;
    });
    const next = existing.length ? Math.max(...existing) + 1 : 1;
    return 'UV-' + String(next).padStart(4, '0');
}

function getActiveMutamerPool() {
    if (typeof getActiveUmrahBookings === 'function') {
        return getActiveUmrahBookings();
    }
    return (Array.isArray(umrahBookings) ? umrahBookings : []).filter(r => r && !r.tripCompleted);
}

// ── POPULATE DROPDOWNS & ACTIVE SOURCE ──
function populateUvFormOptions() {
    const activeList = getActiveMutamerPool();
    const badge = document.getElementById('uv-active-count-badge');
    if (badge) {
        badge.textContent = `دستیاب فعال معتمرین: ${activeList.length}`;
    }

    const grpSelect = document.getElementById('uv-import-group');
    if (grpSelect) {
        const prev = grpSelect.value || '';
        const grpMap = new Map();
        activeList.forEach(r => {
            const gNo = String(r.groupNo || '').trim();
            const gName = String(r.groupName || '').trim();
            if (!gNo || gNo === '—') return;
            if (!grpMap.has(gNo)) {
                grpMap.set(gNo, { gName, count: 0 });
            }
            grpMap.get(gNo).count++;
        });
        grpSelect.innerHTML = '';
        const defOpt = document.createElement('option');
        defOpt.value = '';
        defOpt.textContent = grpMap.size
            ? '-- فعال گروپ منتخب کریں --'
            : '-- کوئی فعال گروپ دستیاب نہیں (پہلے Booking امپورٹ کریں) --';
        grpSelect.appendChild(defOpt);
        grpMap.forEach((info, gNo) => {
            const opt = document.createElement('option');
            opt.value = gNo;
            const labelName = info.gName && info.gName !== '—' && info.gName !== gNo ? ` (${info.gName})` : '';
            opt.textContent = `${gNo}${labelName} — ${info.count} فعال معتمرین`;
            if (gNo === prev) opt.selected = true;
            grpSelect.appendChild(opt);
        });
    }

    // Transporter & Vehicle dropdowns + Datalists
    const fillSelect = (id, items, placeholder) => {
        const sel = document.getElementById(id);
        if (!sel) return;
        const cur = sel.value || '';
        sel.innerHTML = '';
        const def = document.createElement('option');
        def.value = '';
        def.textContent = placeholder;
        sel.appendChild(def);
        (Array.isArray(items) ? items : []).forEach(v => {
            const opt = document.createElement('option');
            opt.value = v;
            opt.textContent = v;
            if (v === cur) opt.selected = true;
            sel.appendChild(opt);
        });
    };
    fillSelect('uv-transporter', typeof parties !== 'undefined' ? parties : [], '-- ٹرانسپورٹر منتخب کریں --');
    fillSelect('uv-vehicle', typeof transports !== 'undefined' ? transports : [], '-- گاڑی منتخب کریں --');

    const fillDatalist = (id, items) => {
        const dl = document.getElementById(id);
        if (!dl) return;
        dl.innerHTML = '';
        Array.from(new Set((items || []).filter(Boolean))).forEach(v => {
            const opt = document.createElement('option');
            opt.value = v;
            dl.appendChild(opt);
        });
    };
    const combinedParties = [
        ...(typeof hajiParties !== 'undefined' && Array.isArray(hajiParties) ? hajiParties : []),
        ...(typeof parties !== 'undefined' && Array.isArray(parties) ? parties : [])
    ];
    fillDatalist('uv-party-list', combinedParties);
    fillDatalist('uv-route-list', typeof sectors !== 'undefined' ? sectors : []);
}

// ── IMPORT FROM ACTIVE LIST INTO CURRENT VOUCHER ──
function mapBookingToVoucherMutamer(r) {
    return {
        bookingId: String(r.id || ''),
        name: r.name || '—',
        age: r.age !== '' && r.age != null ? r.age : '—',
        passport: r.passport || '—',
        nationality: r.nationality || '—',
        groupNo: r.groupNo || '—',
        groupName: r.groupName || '—',
        packageNo: r.packageNo || '—',
        packageName: r.packageName || '—',
        visaNo: r.visaNo || '—',
        mofaNo: r.mofaNo || '—',
        visaStatus: r.visaStatus || '—',
        mutamerType: r.mutamerType || 'Adult'
    };
}

function attachMutamersToVoucher(items, replaceExisting = false) {
    if (!items || !items.length) return 0;
    if (replaceExisting) {
        _uvAttachedMutamers = [];
    }

    const existingKeys = new Set(
        _uvAttachedMutamers.map(m => (m.bookingId || '') + '|' + String(m.passport || '').toUpperCase())
    );

    let added = 0;
    items.forEach(raw => {
        const mapped = mapBookingToVoucherMutamer(raw);
        const key = (mapped.bookingId || '') + '|' + String(mapped.passport || '').toUpperCase();
        if (!existingKeys.has(key)) {
            _uvAttachedMutamers.push(mapped);
            existingKeys.add(key);
            added++;
        }
    });

    // Auto-fill empty voucher metadata from first attached mutamer
    const first = _uvAttachedMutamers[0];
    if (first) {
        const setIfBlank = (id, val) => {
            const el = document.getElementById(id);
            if (el && !el.value.trim() && val && val !== '—') el.value = val;
        };
        setIfBlank('uv-group-no', first.groupNo);
        setIfBlank('uv-group-name', first.groupName);
        setIfBlank('uv-package', first.packageName && first.packageName !== '—' ? first.packageName : first.packageNo);
        setIfBlank('uv-leader-name', first.name);
    }

    renderUvAttachedMutamers();
    return added;
}

async function importActiveGroupToVoucher() {
    const grpVal = (document.getElementById('uv-import-group')?.value || '').trim();
    if (!grpVal) {
        showUvAlert('براہ کرم پہلے ایک فعال گروپ منتخب کریں', 'er');
        return;
    }

    const matches = getActiveMutamerPool().filter(r => String(r.groupNo || '').trim() === grpVal);
    if (!matches.length) {
        showUvAlert('اس گروپ میں کوئی فعال معتمر نہیں ملا (ممکن ہے ان کی Trip مکمل ہو چکی ہو)', 'er');
        return;
    }

    const replaceMode = _uvAttachedMutamers.length > 0 && await (
        typeof showUmrahConfirm === 'function'
            ? showUmrahConfirm(
                'پہلے سے واؤچر میں موجود معتمرین کو ہٹا کر نیا گروپ لوڈ کریں؟ (Cancel دبائیں تو موجودہ لسٹ میں شامل ہو جائیں گے)',
                'گروپ لوڈ کریں',
                'info',
                'ہاں، نیا لوڈ کریں',
                'موجودہ میں شامل کریں'
            )
            : Promise.resolve(typeof confirm === 'function' ? confirm('پہلے سے واؤچر میں موجود معتمرین کو ہٹا کر نیا گروپ لوڈ کریں؟ (Cancel دبائیں تو موجودہ لسٹ میں شامل ہو جائیں گے)') : true)
    );

    if (replaceMode) {
        ['uv-group-no', 'uv-group-name', 'uv-package', 'uv-leader-name'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.value = '';
        });
    }

    const added = attachMutamersToVoucher(matches, replaceMode);
    showUvAlert(`گروپ "${grpVal}" سے ${added} فعال معتمرین واؤچر میں امپورٹ کر لیے گئے ہیں!`, 'ok');
}

function toggleUvMutamerPicker() {
    const picker = document.getElementById('uv-mutamer-picker');
    if (!picker) return;
    const opening = picker.style.display === 'none';
    picker.style.display = opening ? 'block' : 'none';
    if (opening) renderUvMutamerPicker();
}

function renderUvMutamerPicker() {
    const listEl = document.getElementById('uv-mutamer-picker-list');
    if (!listEl) return;

    const activeList = getActiveMutamerPool();
    const q = (document.getElementById('uv-picker-search')?.value || '').trim().toLowerCase();
    const filtered = activeList.filter(r => {
        if (!q) return true;
        return [r.name, r.passport, r.groupNo, r.groupName, r.visaNo]
            .some(v => String(v || '').toLowerCase().includes(q));
    });

    if (!filtered.length) {
        listEl.innerHTML = '<div style="padding:14px;text-align:center;font-size:12.5px;color:var(--text-soft);">کوئی فعال معتمر دستیاب نہیں ہے</div>';
        return;
    }

    listEl.innerHTML = filtered.slice(0, 100).map(r => {
        const sid = uvEsc(r.id);
        return `
            <label style="display:flex;align-items:center;justify-content:space-between;gap:10px;padding:7px 10px;border-bottom:1px solid var(--border-soft, var(--border));cursor:pointer;font-size:12.5px;">
                <span style="display:inline-flex;align-items:center;gap:8px;">
                    <input type="checkbox" class="uv-picker-cb" value="${sid}" />
                    <strong>${uvEsc(r.name)}</strong>
                    <span style="font-family:monospace;color:var(--primary);">${uvEsc(r.passport)}</span>
                </span>
                <span style="font-size:11.5px;color:var(--text-soft);">گروپ: ${uvEsc(r.groupNo)} | ${uvEsc(r.mutamerType || 'Adult')}</span>
            </label>
        `;
    }).join('');
}

function addCheckedMutamersToVoucher() {
    const checkedIds = new Set(
        Array.from(document.querySelectorAll('.uv-picker-cb:checked')).map(cb => String(cb.value))
    );
    if (!checkedIds.size) {
        showUvAlert('براہ کرم کم از کم ایک معتمر منتخب کریں', 'er');
        return;
    }

    const selected = getActiveMutamerPool().filter(r => checkedIds.has(String(r.id)));
    const added = attachMutamersToVoucher(selected, false);
    document.querySelectorAll('.uv-picker-cb:checked').forEach(cb => { cb.checked = false; });
    showUvAlert(`${added} معتمرین واؤچر میں شامل کر دیے گئے`, 'ok');
}

function removeAttachedMutamer(idx) {
    if (idx < 0 || idx >= _uvAttachedMutamers.length) return;
    _uvAttachedMutamers.splice(idx, 1);
    renderUvAttachedMutamers();
}

function getAttachedPaxCounts(list) {
    let adults = 0, children = 0, infants = 0;
    (list || []).forEach(r => {
        const cat = typeof getUbMutamerCategory === 'function'
            ? getUbMutamerCategory(r.mutamerType, r.age)
            : 'adult';
        if (cat === 'infant') infants++;
        else if (cat === 'child') children++;
        else adults++;
    });
    return { total: (list || []).length, adults, children, infants };
}

function renderUvAttachedMutamers() {
    const tbody = document.getElementById('uv-selected-mutamers-tbody');
    const summaryEl = document.getElementById('uv-pax-summary');
    const pax = getAttachedPaxCounts(_uvAttachedMutamers);

    if (summaryEl) {
        summaryEl.textContent = `کل افراد: ${pax.total} (${pax.adults} Adult / ${pax.children} Child / ${pax.infants} Infant)`;
    }
    if (!tbody) return;

    if (!_uvAttachedMutamers.length) {
        tbody.innerHTML = `
            <tr>
                <td colspan="9" style="padding:20px;text-align:center;color:var(--text-soft);font-size:12.5px;">
                    ابھی تک اس واؤچر میں کوئی معتمر شامل نہیں کیا گیا۔ اوپر سے فعال گروپ یا معتمرین امپورٹ کریں۔
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = _uvAttachedMutamers.map((m, i) => {
        const typeBadge = typeof getUbMutamerTypeBadge === 'function'
            ? getUbMutamerTypeBadge(m.mutamerType, m.age)
            : uvEsc(m.mutamerType || 'Adult');
        return `
            <tr style="border-bottom:1px solid var(--border);">
                <td style="padding:7px 10px;text-align:center;color:var(--text-soft);font-weight:600;">${i + 1}</td>
                <td style="padding:7px 10px;font-weight:600;">${uvEsc(m.name)}</td>
                <td style="padding:7px 10px;text-align:center;">${uvEsc(m.age)} ${typeBadge}</td>
                <td style="padding:7px 10px;text-align:center;font-family:monospace;font-weight:700;color:var(--primary);">${uvEsc(m.passport)}</td>
                <td style="padding:7px 10px;text-align:center;">${uvEsc(m.nationality)}</td>
                <td style="padding:7px 10px;text-align:center;">${uvEsc(m.groupNo)}</td>
                <td style="padding:7px 10px;text-align:center;font-family:monospace;">${uvEsc(m.visaNo)}</td>
                <td style="padding:7px 10px;text-align:center;font-family:monospace;">${uvEsc(m.mofaNo)}</td>
                <td class="no-print" style="padding:7px 10px;text-align:center;">
                    <button type="button" class="btn btn-o btn-sm" onclick="removeAttachedMutamer(${i})" style="padding:2px 7px;color:var(--red,#dc2626);" title="ہٹائیں">✕</button>
                </td>
            </tr>
        `;
    }).join('');
}

// ── FORM READ / SAVE / EDIT / CLEAR ──
const UV_FORM_FIELDS = [
    'uv-voucher-no', 'uv-date', 'uv-group-no', 'uv-group-name', 'uv-package',
    'uv-shirka', 'uv-party', 'uv-leader-name', 'uv-mobile',
    'uv-arr-date', 'uv-arr-flight', 'uv-arr-airport',
    'uv-dep-date', 'uv-dep-flight', 'uv-dep-airport',
    'uv-transporter', 'uv-vehicle', 'uv-route',
    'uv-makkah-hotel', 'uv-makkah-in', 'uv-makkah-out', 'uv-makkah-rooms',
    'uv-madinah-hotel', 'uv-madinah-in', 'uv-madinah-out', 'uv-madinah-rooms',
    'uv-notes'
];

function clearUmrahVoucherForm() {
    const idEl = document.getElementById('uv-id');
    if (idEl) idEl.value = '';
    UV_FORM_FIELDS.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });

    const vNoEl = document.getElementById('uv-voucher-no');
    if (vNoEl) vNoEl.value = genUmrahVoucherNo();
    const dateEl = document.getElementById('uv-date');
    if (dateEl) dateEl.value = typeof today === 'function' ? today() : new Date().toISOString().slice(0, 10);
    const markEl = document.getElementById('uv-mark-completed');
    if (markEl) markEl.checked = false;
    const titleEl = document.getElementById('uv-form-title');
    if (titleEl) titleEl.textContent = '2. واؤچر کی تفصیلات (New Voucher)';

    _uvAttachedMutamers = [];
    renderUvAttachedMutamers();
}

function saveUmrahVoucher(andPrint = false) {
    const val = (id) => (document.getElementById(id)?.value || '').trim();
    const editId = val('uv-id');
    const voucherNo = val('uv-voucher-no') || genUmrahVoucherNo();
    const date = val('uv-date') || (typeof today === 'function' ? today() : new Date().toISOString().slice(0, 10));
    const groupNo = val('uv-group-no');
    const leaderName = val('uv-leader-name');

    if (!_uvAttachedMutamers.length && !groupNo && !leaderName) {
        showUvAlert('براہ کرم کم از کم فعال لسٹ سے معتمرین امپورٹ کریں یا گروپ / لیڈر کا نام درج کریں', 'er');
        return;
    }

    const markCompleted = Boolean(document.getElementById('uv-mark-completed')?.checked);
    const pax = getAttachedPaxCounts(_uvAttachedMutamers);
    const list = getCleanUmrahVouchers();
    const existing = editId ? list.find(v => String(v.id) === String(editId)) : null;

    const voucherObj = {
        id: existing ? existing.id : (typeof uid === 'function' ? 'uv_' + uid() : 'uv_' + Date.now().toString(36)),
        voucherNo,
        date,
        groupNo: groupNo || '—',
        groupName: val('uv-group-name') || '—',
        packageName: val('uv-package') || '—',
        shirka: val('uv-shirka') || '—',
        party: val('uv-party') || '—',
        leaderName: leaderName || (_uvAttachedMutamers[0]?.name || '—'),
        mobile: val('uv-mobile') || '—',
        arrDate: val('uv-arr-date'),
        arrFlight: val('uv-arr-flight'),
        arrAirport: val('uv-arr-airport'),
        depDate: val('uv-dep-date'),
        depFlight: val('uv-dep-flight'),
        depAirport: val('uv-dep-airport'),
        transporter: val('uv-transporter'),
        vehicle: val('uv-vehicle'),
        route: val('uv-route'),
        makkahHotel: val('uv-makkah-hotel'),
        makkahIn: val('uv-makkah-in'),
        makkahOut: val('uv-makkah-out'),
        makkahRooms: val('uv-makkah-rooms'),
        madinahHotel: val('uv-madinah-hotel'),
        madinahIn: val('uv-madinah-in'),
        madinahOut: val('uv-madinah-out'),
        madinahRooms: val('uv-madinah-rooms'),
        notes: val('uv-notes'),
        mutamers: _uvAttachedMutamers.map(m => ({ ...m })),
        paxCount: pax.total,
        adults: pax.adults,
        children: pax.children,
        infants: pax.infants,
        tripCompleted: existing ? (markCompleted || Boolean(existing.tripCompleted)) : markCompleted,
        createdAt: existing ? existing.createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    if (existing) {
        umrahVouchers = list.map(v => String(v.id) === String(editId) ? voucherObj : v);
    } else {
        umrahVouchers = [voucherObj, ...list];
    }

    persistUmrahVouchers();

    // If marked completed, also move attached mutamers to Completed list in Booking
    if (markCompleted && voucherObj.mutamers.length && typeof setUmrahIdsCompleted === 'function') {
        const bookingIds = new Set(voucherObj.mutamers.map(m => String(m.bookingId || '')).filter(Boolean));
        if (bookingIds.size) {
            setUmrahIdsCompleted(bookingIds, true);
        }
    }

    clearUmrahVoucherForm();
    renderUmrahVouchers();
    showUvAlert(`واؤچر ${voucherObj.voucherNo} کامیابی سے محفوظ ہو گیا!`, 'ok');

    if (andPrint) {
        printUmrahVoucher(voucherObj.id);
    }
}

function editUmrahVoucher(id) {
    const v = getCleanUmrahVouchers().find(item => String(item.id) === String(id));
    if (!v) return;

    populateUvFormOptions();

    const setVal = (elId, value) => {
        const el = document.getElementById(elId);
        if (el) el.value = (value && value !== '—') ? value : '';
    };

    setVal('uv-id', v.id);
    setVal('uv-voucher-no', v.voucherNo);
    setVal('uv-date', v.date);
    setVal('uv-group-no', v.groupNo);
    setVal('uv-group-name', v.groupName);
    setVal('uv-package', v.packageName);
    setVal('uv-shirka', v.shirka);
    setVal('uv-party', v.party);
    setVal('uv-leader-name', v.leaderName);
    setVal('uv-mobile', v.mobile);
    setVal('uv-arr-date', v.arrDate);
    setVal('uv-arr-flight', v.arrFlight);
    setVal('uv-arr-airport', v.arrAirport);
    setVal('uv-dep-date', v.depDate);
    setVal('uv-dep-flight', v.depFlight);
    setVal('uv-dep-airport', v.depAirport);
    setVal('uv-transporter', v.transporter);
    setVal('uv-vehicle', v.vehicle);
    setVal('uv-route', v.route);
    setVal('uv-makkah-hotel', v.makkahHotel);
    setVal('uv-makkah-in', v.makkahIn);
    setVal('uv-makkah-out', v.makkahOut);
    setVal('uv-makkah-rooms', v.makkahRooms);
    setVal('uv-madinah-hotel', v.madinahHotel);
    setVal('uv-madinah-in', v.madinahIn);
    setVal('uv-madinah-out', v.madinahOut);
    setVal('uv-madinah-rooms', v.madinahRooms);
    setVal('uv-notes', v.notes);

    const markEl = document.getElementById('uv-mark-completed');
    if (markEl) markEl.checked = Boolean(v.tripCompleted);

    const titleEl = document.getElementById('uv-form-title');
    if (titleEl) titleEl.textContent = `2. واؤچر ترمیم کریں (${v.voucherNo})`;

    _uvAttachedMutamers = Array.isArray(v.mutamers) ? v.mutamers.map(m => ({ ...m })) : [];
    renderUvAttachedMutamers();

    const contentEl = document.getElementById('umrah-content-voucher');
    if (contentEl && typeof contentEl.scrollIntoView === 'function') {
        contentEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

async function toggleUmrahVoucherTripComplete(id) {
    const list = getCleanUmrahVouchers();
    const target = list.find(v => String(v.id) === String(id));
    if (!target) return;

    const nextDone = !Boolean(target.tripCompleted);
    const msg = nextDone
        ? `کیا واؤچر "${target.voucherNo}" کی Trip مکمل کر کے اس کے تمام معتمرین کو Booking کی Completed لسٹ میں منتقل کر دیں؟`
        : `کیا واؤچر "${target.voucherNo}" اور اس کے معتمرین کو دوبارہ Active لسٹ میں لانا چاہتے ہیں؟`;
    const ok = await (
        typeof showUmrahConfirm === 'function'
            ? showUmrahConfirm(msg, 'Trip اسٹیٹس تبدیل کریں', nextDone ? 'success' : 'info', 'ہاں، تبدیل کریں')
            : Promise.resolve(typeof confirm === 'function' ? confirm(msg) : true)
    );
    if (!ok) return;

    umrahVouchers = list.map(v => String(v.id) === String(id) ? { ...v, tripCompleted: nextDone, updatedAt: new Date().toISOString() } : v);
    persistUmrahVouchers();

    if (Array.isArray(target.mutamers) && target.mutamers.length && typeof setUmrahIdsCompleted === 'function') {
        const bookingIds = new Set(target.mutamers.map(m => String(m.bookingId || '')).filter(Boolean));
        if (bookingIds.size) {
            setUmrahIdsCompleted(bookingIds, nextDone);
        }
    }

    renderUmrahVouchers();
}

async function deleteUmrahVoucher(id) {
    const list = getCleanUmrahVouchers();
    const target = list.find(v => String(v.id) === String(id));
    if (!target) return;
    const msg = `کیا آپ واقعی واؤچر "${target.voucherNo}" کو ڈیلیٹ کرنا چاہتے ہیں؟`;
    const ok = await (
        typeof showUmrahConfirm === 'function'
            ? showUmrahConfirm(msg, 'واؤچر ڈیلیٹ کریں', 'danger', 'ہاں، ڈیلیٹ کریں')
            : Promise.resolve(typeof confirm === 'function' ? confirm(msg) : true)
    );
    if (!ok) return;

    umrahVouchers = list.filter(v => String(v.id) !== String(id));
    persistUmrahVouchers();
    renderUmrahVouchers();
}

// ── SAVED VOUCHERS TABLE + PAGINATION (25 / 50) ──
function onUmrahVoucherFilterChange() {
    uvCurrentPage = 1;
    renderUmrahVouchersTable();
}

function setUmrahVoucherPage(page) {
    uvCurrentPage = Math.max(1, Number(page) || 1);
    renderUmrahVouchersTable();
}

function setUmrahVoucherPageSize(size) {
    const parsed = Number(size);
    if (parsed !== 25 && parsed !== 50) return;
    uvPageSize = parsed;
    uvCurrentPage = 1;
    renderUmrahVouchersTable();
}

function renderUmrahVouchers() {
    populateUvFormOptions();
    const vNoEl = document.getElementById('uv-voucher-no');
    const idEl = document.getElementById('uv-id');
    if (vNoEl && (!idEl || !idEl.value) && !vNoEl.value.trim()) {
        vNoEl.value = genUmrahVoucherNo();
    }
    const dateEl = document.getElementById('uv-date');
    if (dateEl && !dateEl.value) {
        dateEl.value = typeof today === 'function' ? today() : new Date().toISOString().slice(0, 10);
    }
    renderUvAttachedMutamers();
    renderUmrahVouchersTable();
}

function renderUmrahVouchersTable() {
    const all = getCleanUmrahVouchers();
    const tbody = document.getElementById('uv-vouchers-tbody');
    const countEl = document.getElementById('uv-vouchers-count');
    const pagEl = document.getElementById('uv-pagination');
    if (!tbody) return;

    const search = (document.getElementById('uv-voucher-search')?.value || '').trim().toLowerCase();
    const statusFilter = document.getElementById('uv-voucher-status-filter')?.value || '';

    const filtered = all.filter(v => {
        if (statusFilter === 'active' && v.tripCompleted) return false;
        if (statusFilter === 'completed' && !v.tripCompleted) return false;
        if (search) {
            const hay = [
                v.voucherNo, v.groupNo, v.groupName, v.leaderName,
                v.party, v.makkahHotel, v.madinahHotel, v.arrFlight, v.depFlight, v.route
            ].map(x => String(x || '').toLowerCase()).join(' ');
            if (!hay.includes(search)) return false;
        }
        return true;
    });

    if (countEl) {
        countEl.textContent = `${filtered.length} واؤچرز (کل: ${all.length})`;
    }

    if (!filtered.length) {
        tbody.innerHTML = `
            <tr>
                <td colspan="9" style="padding:32px 16px;text-align:center;color:var(--text-soft);font-size:13px;">
                    کوئی عمرہ واؤچر محفوظ نہیں ہے۔ اوپر سے فعال معتمرین امپورٹ کر کے پہلا واؤچر بنائیں۔
                </td>
            </tr>
        `;
        if (pagEl) {
            pagEl.style.display = 'none';
            pagEl.innerHTML = '';
        }
        return;
    }

    const totalPages = Math.max(1, Math.ceil(filtered.length / uvPageSize));
    uvCurrentPage = Math.min(Math.max(uvCurrentPage, 1), totalPages);
    const firstIdx = (uvCurrentPage - 1) * uvPageSize;
    const lastIdx = Math.min(firstIdx + uvPageSize, filtered.length);
    const pageRows = filtered.slice(firstIdx, lastIdx);

    tbody.innerHTML = pageRows.map((v, i) => {
        const done = Boolean(v.tripCompleted);
        const statusBadge = done
            ? '<span class="badge badge-checked" style="font-size:11px;padding:3px 8px;">مکمل (Completed)</span>'
            : '<span class="badge badge-pending" style="font-size:11px;padding:3px 8px;">فعال (Active)</span>';
        const toggleBtnLabel = done ? '↩ فعال' : '✓ Trip مکمل';
        const toggleBtnStyle = done ? 'padding:4px 8px;font-size:11px;' : 'padding:4px 8px;font-size:11px;color:#16a34a;border-color:#16a34a;';

        const flightInfo = [
            v.arrFlight ? `آمد: ${v.arrFlight}` : '',
            v.depFlight ? `روانگی: ${v.depFlight}` : ''
        ].filter(Boolean).join(' | ');
        const hotelInfo = [
            v.makkahHotel ? `مکہ: ${v.makkahHotel}` : '',
            v.madinahHotel ? `مدینہ: ${v.madinahHotel}` : ''
        ].filter(Boolean).join(' | ');
        const displayDate = typeof fd === 'function' && v.date ? fd(v.date) : (v.date || '—');

        return `
            <tr style="border-bottom:1px solid var(--border);">
                <td style="padding:10px 12px;text-align:center;color:var(--text-soft);font-weight:600;">${firstIdx + i + 1}</td>
                <td style="padding:10px 12px;text-align:center;"><span class="voucher-tag">${uvEsc(v.voucherNo)}</span></td>
                <td style="padding:10px 12px;text-align:center;">${uvEsc(displayDate)}</td>
                <td style="padding:10px 12px;">
                    <div style="font-weight:700;">${uvEsc(v.leaderName || '—')}</div>
                    <div style="font-size:11.5px;color:var(--text-soft);">گروپ: ${uvEsc(v.groupNo || '—')} ${v.party && v.party !== '—' ? '| ' + uvEsc(v.party) : ''}</div>
                </td>
                <td style="padding:10px 12px;text-align:center;">
                    <strong>${Number(v.paxCount) || 0}</strong> افراد
                    <div style="font-size:11px;color:var(--text-soft);">${Number(v.adults) || 0}/${Number(v.children) || 0}/${Number(v.infants) || 0}</div>
                </td>
                <td style="padding:10px 12px;font-size:12px;">
                    <div>${uvEsc(hotelInfo || '—')}</div>
                    ${flightInfo ? `<div style="font-size:11px;color:var(--text-soft);margin-top:2px;">${uvEsc(flightInfo)}</div>` : ''}
                </td>
                <td style="padding:10px 12px;font-size:12px;">
                    <div>${uvEsc(v.route || '—')}</div>
                    <div style="font-size:11px;color:var(--text-soft);">${uvEsc([v.transporter, v.vehicle].filter(Boolean).join(' — '))}</div>
                </td>
                <td style="padding:10px 12px;text-align:center;">${statusBadge}</td>
                <td class="no-print" style="padding:10px 10px;text-align:center;white-space:nowrap;">
                    <div style="display:inline-flex;gap:4px;align-items:center;">
                        <button type="button" class="btn btn-o btn-sm" onclick="printUmrahVoucher('${uvEsc(v.id)}')" title="پرنٹ" style="padding:4px 8px;font-size:11px;">پرنٹ</button>
                        <button type="button" class="btn btn-o btn-sm" onclick="editUmrahVoucher('${uvEsc(v.id)}')" title="ترمیم" style="padding:4px 8px;font-size:11px;">ترمیم</button>
                        <button type="button" class="btn btn-o btn-sm" onclick="toggleUmrahVoucherTripComplete('${uvEsc(v.id)}')" style="${toggleBtnStyle}">${toggleBtnLabel}</button>
                        <button type="button" class="btn btn-d btn-sm" onclick="deleteUmrahVoucher('${uvEsc(v.id)}')" title="ڈیلیٹ" style="padding:4px 8px;font-size:11px;">✕</button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');

    if (pagEl) {
        pagEl.style.display = 'flex';
        pagEl.innerHTML = `
            <label class="records-page-size-label" for="uv-page-size">
                فی صفحہ ریکارڈ:
                <select id="uv-page-size" onchange="setUmrahVoucherPageSize(this.value)">
                    <option value="25" ${uvPageSize === 25 ? 'selected' : ''}>25</option>
                    <option value="50" ${uvPageSize === 50 ? 'selected' : ''}>50</option>
                </select>
            </label>
            <span class="records-page-status">${firstIdx + 1}–${lastIdx} / ${filtered.length}</span>
            <div class="records-page-buttons">
                <button type="button" class="btn btn-o btn-sm" onclick="setUmrahVoucherPage(${uvCurrentPage - 1})" ${uvCurrentPage <= 1 ? 'disabled' : ''}>پچھلا</button>
                <span>${uvCurrentPage} / ${totalPages}</span>
                <button type="button" class="btn btn-o btn-sm" onclick="setUmrahVoucherPage(${uvCurrentPage + 1})" ${uvCurrentPage >= totalPages ? 'disabled' : ''}>اگلا</button>
            </div>
        `;
    }
}

// ── PRINTABLE A4 UMRAH VOUCHER ──
async function printUmrahVoucher(id) {
    const v = getCleanUmrahVouchers().find(item => String(item.id) === String(id));
    if (!v) return;

    const appTitle = (document.getElementById('app-title')?.textContent) || 'Umrah Transport Management System';
    const logoHtml = (typeof fbLogo !== 'undefined' && fbLogo)
        ? `<img src="${uvEsc(fbLogo)}" style="max-height:58px;max-width:140px;object-fit:contain;" />`
        : '';
    const mutamers = Array.isArray(v.mutamers) ? v.mutamers : [];
    const safeFd = (d) => (typeof fd === 'function' && d ? fd(d) : (d || '—'));

    const win = window.open('', '_blank', 'width=1000,height=800');
    if (!win) {
        const msg = 'براہ کرم پاپ اپ (Popup) کی اجازت دیں تاکہ واؤچر پرنٹ ہو سکے';
        if (typeof showUmrahAlert === 'function') {
            await showUmrahAlert(msg, 'پاپ اپ بلاک ہے', 'warning');
        } else if (typeof alert === 'function') {
            alert(msg);
        }
        return;
    }

    win.document.write(`<!DOCTYPE html>
<html dir="rtl" lang="ur">
<head>
<meta charset="UTF-8">
<title>Umrah Voucher - ${uvEsc(v.voucherNo)}</title>
<style>
  @page { size: A4; margin: 12mm; }
  * { box-sizing: border-box; }
  body { font-family: 'Noto Sans Arabic', Arial, sans-serif; font-size: 12px; color: #111; margin: 0; padding: 0; }
  .hdr { display: flex; justify-content: space-between; align-items: center; border-bottom: 2.5px solid #142B4A; padding-bottom: 10px; margin-bottom: 14px; }
  .hdr h1 { margin: 0; font-size: 20px; color: #142B4A; }
  .badge-vch { font-family: monospace; font-size: 16px; font-weight: 800; background: #142B4A; color: #fff; padding: 6px 14px; border-radius: 6px; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  .box { border: 1px solid #cbd5e1; border-radius: 8px; padding: 10px 14px; margin-bottom: 12px; }
  .box-title { font-weight: 700; color: #142B4A; border-bottom: 1px solid #e2e8f0; padding-bottom: 5px; margin-bottom: 8px; font-size: 13px; }
  .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px 14px; }
  .lbl { color: #64748b; font-size: 11px; }
  .val { font-weight: 700; }
  table { width: 100%; border-collapse: collapse; margin-top: 6px; font-size: 11.5px; }
  th { background: #354f52; color: #fff; padding: 7px 8px; border: 1px solid #334155; text-align: center; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  td { padding: 6px 8px; border: 1px solid #cbd5e1; text-align: center; }
  .sig-row { display: flex; justify-content: space-between; margin-top: 32px; padding-top: 12px; }
  .sig-box { width: 200px; border-top: 1px solid #333; text-align: center; padding-top: 4px; font-size: 11px; }
</style>
</head>
<body>
  <div class="hdr">
    <div style="display:flex;align-items:center;gap:12px;">
      ${logoHtml}
      <div>
        <h1>${uvEsc(appTitle)}</h1>
        <div style="color:#52796f;font-weight:700;">UMRAH SERVICE &amp; TRANSPORT VOUCHER</div>
      </div>
    </div>
    <div style="text-align:left;">
      <div class="badge-vch">${uvEsc(v.voucherNo)}</div>
      <div style="margin-top:4px;font-size:11px;">تاریخ: ${uvEsc(safeFd(v.date))}</div>
    </div>
  </div>

  <div class="box">
    <div class="box-title">گروپ و بنیادی تفصیلات</div>
    <div class="grid">
      <div><span class="lbl">لیڈر / رابطہ:</span> <span class="val">${uvEsc(v.leaderName)}</span></div>
      <div><span class="lbl">موبائل:</span> <span class="val" dir="ltr">${uvEsc(v.mobile)}</span></div>
      <div><span class="lbl">گروپ نمبر / نام:</span> <span class="val">${uvEsc(v.groupNo)} (${uvEsc(v.groupName)})</span></div>
      <div><span class="lbl">پیکیج:</span> <span class="val">${uvEsc(v.packageName)}</span></div>
      <div><span class="lbl">شرکہ:</span> <span class="val">${uvEsc(v.shirka)}</span></div>
      <div><span class="lbl">پارٹی / ایجنٹ:</span> <span class="val">${uvEsc(v.party)}</span></div>
    </div>
  </div>

  <div class="box">
    <div class="box-title">فلائٹ اور ٹرانسپورٹ تفصیلات</div>
    <div class="grid">
      <div><span class="lbl">آمد:</span> <span class="val">${uvEsc(safeFd(v.arrDate))} | ${uvEsc(v.arrFlight || '—')} (${uvEsc(v.arrAirport || '—')})</span></div>
      <div><span class="lbl">روانگی:</span> <span class="val">${uvEsc(safeFd(v.depDate))} | ${uvEsc(v.depFlight || '—')} (${uvEsc(v.depAirport || '—')})</span></div>
      <div><span class="lbl">ٹرانسپورٹ / گاڑی:</span> <span class="val">${uvEsc(v.transporter || '—')} / ${uvEsc(v.vehicle || '—')}</span></div>
      <div style="grid-column:1/-1;"><span class="lbl">روٹ / سیکٹر:</span> <span class="val">${uvEsc(v.route || '—')}</span></div>
    </div>
  </div>

  <div class="box">
    <div class="box-title">ہوٹل تفصیلات (Makkah &amp; Madinah)</div>
    <div class="grid">
      <div><span class="lbl">مکہ ہوٹل:</span> <span class="val">${uvEsc(v.makkahHotel || '—')}</span></div>
      <div><span class="lbl">مکہ چیک اِن / آؤٹ:</span> <span class="val">${uvEsc(safeFd(v.makkahIn))} تا ${uvEsc(safeFd(v.makkahOut))}</span></div>
      <div><span class="lbl">کمرے:</span> <span class="val">${uvEsc(v.makkahRooms || '—')}</span></div>
      <div><span class="lbl">مدینہ ہوٹل:</span> <span class="val">${uvEsc(v.madinahHotel || '—')}</span></div>
      <div><span class="lbl">مدینہ چیک اِن / آؤٹ:</span> <span class="val">${uvEsc(safeFd(v.madinahIn))} تا ${uvEsc(safeFd(v.madinahOut))}</span></div>
      <div><span class="lbl">کمرے:</span> <span class="val">${uvEsc(v.madinahRooms || '—')}</span></div>
    </div>
  </div>

  <div class="box">
    <div class="box-title">معتمرین کی فہرست (کل افراد: ${Number(v.paxCount) || 0} — Adult: ${Number(v.adults) || 0}, Child: ${Number(v.children) || 0}, Infant: ${Number(v.infants) || 0})</div>
    <table>
      <thead>
        <tr>
          <th>#</th>
          <th style="text-align:start;">معتمر کا نام</th>
          <th>عمر / نوعیت</th>
          <th>پاسپورٹ نمبر</th>
          <th>قومیت</th>
          <th>ویزا نمبر</th>
          <th>موفا نمبر</th>
        </tr>
      </thead>
      <tbody>
        ${mutamers.length ? mutamers.map((m, idx) => `
          <tr>
            <td>${idx + 1}</td>
            <td style="text-align:start;font-weight:700;">${uvEsc(m.name)}</td>
            <td>${uvEsc(m.age)} (${uvEsc(m.mutamerType || 'Adult')})</td>
            <td style="font-family:monospace;font-weight:700;">${uvEsc(m.passport)}</td>
            <td>${uvEsc(m.nationality)}</td>
            <td style="font-family:monospace;">${uvEsc(m.visaNo)}</td>
            <td style="font-family:monospace;">${uvEsc(m.mofaNo)}</td>
          </tr>
        `).join('') : '<tr><td colspan="7">کوئی معتمر درج نہیں</td></tr>'}
      </tbody>
    </table>
    ${v.notes ? `<div style="margin-top:8px;font-size:11.5px;"><strong>نوٹس:</strong> ${uvEsc(v.notes)}</div>` : ''}
  </div>

  <div class="sig-row">
    <div class="sig-box">تیار کردہ (Prepared By)</div>
    <div class="sig-box">معتمر / گروپ لیڈر دستخط</div>
    <div class="sig-box">مہر و دستخط آفس</div>
  </div>
  <script>window.onload = function(){ window.print(); };</script>
</body>
</html>`);
    win.document.close();
}

// ── EXCEL EXPORT FOR VOUCHERS ──
async function exportUmrahVouchersToExcel() {
    const list = getCleanUmrahVouchers();
    if (!list.length) {
        const msg = 'برآمد کرنے کے لیے کوئی واؤچر موجود نہیں ہے';
        if (typeof showUmrahAlert === 'function') await showUmrahAlert(msg, 'اطلاع', 'warning');
        else if (typeof alert === 'function') alert(msg);
        return;
    }
    if (typeof XLSX === 'undefined') {
        const msg = 'XLSX لائبریری دستیاب نہیں ہے';
        if (typeof showUmrahAlert === 'function') await showUmrahAlert(msg, 'خرابی', 'danger');
        else if (typeof alert === 'function') alert(msg);
        return;
    }

    const headers = [
        'Voucher No', 'Date', 'Group No', 'Group Name', 'Leader', 'Mobile',
        'Party', 'Shirka', 'Package', 'Total Pax', 'Arrival Date', 'Arrival Flight',
        'Departure Date', 'Departure Flight', 'Makkah Hotel', 'Madinah Hotel',
        'Transporter', 'Vehicle', 'Route', 'Trip Status'
    ];
    const rows = list.map(v => [
        v.voucherNo || '', v.date || '', v.groupNo || '', v.groupName || '',
        v.leaderName || '', v.mobile || '', v.party || '', v.shirka || '',
        v.packageName || '', Number(v.paxCount) || 0, v.arrDate || '', v.arrFlight || '',
        v.depDate || '', v.depFlight || '', v.makkahHotel || '', v.madinahHotel || '',
        v.transporter || '', v.vehicle || '', v.route || '',
        v.tripCompleted ? 'Completed' : 'Active'
    ]);

    const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Umrah Vouchers');
    const dateStr = typeof today === 'function' ? today() : new Date().toISOString().slice(0, 10);
    XLSX.writeFile(wb, `Umrah_Vouchers_${dateStr}.xlsx`);
}

// ── GLOBAL EXPOSURES ──
window.renderUmrahVouchers = renderUmrahVouchers;
window.renderUmrahVouchersTable = renderUmrahVouchersTable;
window.importActiveGroupToVoucher = importActiveGroupToVoucher;
window.attachMutamersToVoucher = attachMutamersToVoucher;
window.toggleUvMutamerPicker = toggleUvMutamerPicker;
window.renderUvMutamerPicker = renderUvMutamerPicker;
window.addCheckedMutamersToVoucher = addCheckedMutamersToVoucher;
window.removeAttachedMutamer = removeAttachedMutamer;
window.saveUmrahVoucher = saveUmrahVoucher;
window.editUmrahVoucher = editUmrahVoucher;
window.clearUmrahVoucherForm = clearUmrahVoucherForm;
window.toggleUmrahVoucherTripComplete = toggleUmrahVoucherTripComplete;
window.deleteUmrahVoucher = deleteUmrahVoucher;
window.onUmrahVoucherFilterChange = onUmrahVoucherFilterChange;
window.setUmrahVoucherPage = setUmrahVoucherPage;
window.setUmrahVoucherPageSize = setUmrahVoucherPageSize;
window.printUmrahVoucher = printUmrahVoucher;
window.exportUmrahVouchersToExcel = exportUmrahVouchersToExcel;
