// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  UMRAH & NUSUK IMPORT MODULE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

let _parsedNusukRecords = [];
let ubCurrentListTab = 'active'; // active | completed | all
let ubCurrentPage = 1;
let ubPageSize = 25;
let _ubSelectedIds = new Set();
let _ubCurrentPageIds = [];
let _ubCurrentFilteredIds = [];
let _ubDialogResolver = null;

// ── CUSTOM ALERT / CONFIRM DIALOG ──
function showUmrahDialog({ title = 'اطلاع', message = '', type = 'info', confirmText = 'ٹھیک ہے', cancelText = 'منسوخ', showCancel = false } = {}) {
    const modal = document.getElementById('ub-custom-modal');
    if (!modal) {
        if (showCancel) {
            return Promise.resolve(typeof confirm === 'function' ? confirm(message) : true);
        }
        if (typeof alert === 'function') alert(message);
        return Promise.resolve(true);
    }

    const box = document.getElementById('ub-cm-box');
    const iconEl = document.getElementById('ub-cm-icon');
    const titleEl = document.getElementById('ub-cm-title');
    const msgEl = document.getElementById('ub-cm-msg');
    const confirmBtn = document.getElementById('ub-cm-confirm');
    const cancelBtn = document.getElementById('ub-cm-cancel');

    const palettes = {
        danger: {
            border: 'var(--red, #dc2626)',
            bg: 'rgba(220, 38, 38, 0.12)',
            color: 'var(--red, #dc2626)',
            btnClass: 'btn btn-d',
            svg: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>'
        },
        warning: {
            border: 'var(--warning, #d97706)',
            bg: 'rgba(217, 119, 6, 0.12)',
            color: 'var(--warning, #d97706)',
            btnClass: 'btn btn-p',
            svg: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>'
        },
        success: {
            border: 'var(--accent, #147d64)',
            bg: 'rgba(20, 125, 100, 0.12)',
            color: 'var(--accent, #147d64)',
            btnClass: 'btn btn-p',
            svg: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>'
        },
        info: {
            border: 'var(--primary, #142b4a)',
            bg: 'rgba(20, 43, 74, 0.10)',
            color: 'var(--primary, #142b4a)',
            btnClass: 'btn btn-p',
            svg: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>'
        }
    };
    const p = palettes[type] || palettes.info;

    if (box) box.style.borderTop = `5px solid ${p.border}`;
    if (iconEl) {
        iconEl.style.background = p.bg;
        iconEl.style.color = p.color;
        iconEl.innerHTML = p.svg;
    }
    if (titleEl) {
        titleEl.style.color = type === 'danger' ? p.color : 'var(--primary)';
        titleEl.textContent = title;
    }
    if (msgEl) msgEl.textContent = message;
    if (confirmBtn) {
        confirmBtn.className = p.btnClass;
        confirmBtn.textContent = confirmText;
    }
    if (cancelBtn) {
        cancelBtn.style.display = showCancel ? 'inline-flex' : 'none';
        cancelBtn.textContent = cancelText;
    }

    if (_ubDialogResolver) {
        _ubDialogResolver(false);
        _ubDialogResolver = null;
    }

    modal.classList.add('open');
    return new Promise(resolve => {
        _ubDialogResolver = resolve;
    });
}

function resolveUmrahDialog(accepted) {
    const modal = document.getElementById('ub-custom-modal');
    if (modal) modal.classList.remove('open');
    const resolver = _ubDialogResolver;
    _ubDialogResolver = null;
    if (resolver) resolver(Boolean(accepted));
}

function showUmrahConfirm(message, title = 'تصدیق کریں', type = 'danger', confirmText = 'ہاں، تصدیق کریں', cancelText = 'منسوخ') {
    return showUmrahDialog({ title, message, type, confirmText, cancelText, showCancel: true });
}

function showUmrahAlert(message, title = 'اطلاع', type = 'info', confirmText = 'ٹھیک ہے') {
    return showUmrahDialog({ title, message, type, confirmText, showCancel: false });
}

if (typeof document !== 'undefined' && typeof document.addEventListener === 'function') {
    document.addEventListener('keydown', (e) => {
        const modal = document.getElementById('ub-custom-modal');
        if (!modal || !modal.classList.contains('open')) return;
        if (e.key === 'Escape') {
            e.preventDefault();
            resolveUmrahDialog(false);
        } else if (e.key === 'Enter') {
            e.preventDefault();
            resolveUmrahDialog(true);
        }
    });
}

// ── MODAL CONTROL ──
function openNusukImportModal() {
    const modal = document.getElementById('nusuk-import-modal');
    if (!modal) return;

    _parsedNusukRecords = [];
    const prevArea = document.getElementById('nusuk-preview-area');
    if (prevArea) prevArea.style.display = 'none';

    const fileIn = document.getElementById('nusuk-file-input');
    if (fileIn) fileIn.value = '';

    const btnConfirm = document.getElementById('btn-confirm-import-nusuk');
    if (btnConfirm) btnConfirm.disabled = true;

    const alImp = document.getElementById('al-nusuk-import');
    if (alImp) alImp.innerHTML = '';

    const zTitle = document.getElementById('nusuk-zone-title');
    if (zTitle) zTitle.textContent = 'نسک Excel یا CSV فائل یہاں ڈراپ کریں یا منتخب کریں';
    const zSub = document.getElementById('nusuk-zone-sub');
    if (zSub) zSub.textContent = 'فائل فارمیٹس: .xlsx, .xls, .csv';

    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeNusukImportModal() {
    const modal = document.getElementById('nusuk-import-modal');
    if (modal) modal.classList.remove('open');
    _parsedNusukRecords = [];
    document.body.style.overflow = '';
}

// ── TEMPLATE DOWNLOAD ──
function downloadNusukTemplate() {
    if (typeof XLSX === 'undefined') {
        showUmrahAlert('XLSX لائبریری لوڈ نہیں ہو سکی', 'خرابی', 'danger');
        return;
    }

    // Exact 15 Nusuk columns matching the official export sheet
    const headers = [
        'Mutamer name',
        'Mutamer Age',
        'Passport Number',
        'Nationality',
        'Group Number',
        'Group Name',
        'Package Number',
        'Package Name',
        'Visa Status',
        'Biometric status',
        'Visa Number',
        'Mofa Number',
        'sequence of visits',
        'Mutamer Status',
        'Mutamer Type'
    ];

    const sample1 = [
        'MUHAMMAD ALI KHAN',
        38,
        'AB1234567',
        'Pakistan',
        '251487',
        'AL-BARAKAH GROUP 1',
        'PKG-2024',
        '15 Days Economy Umrah',
        'Issued',
        'Completed',
        '6102938475',
        '1092837465',
        '1',
        'Active',
        'Adult'
    ];

    const sample2 = [
        'FATIMA BIBI',
        34,
        'CD7654321',
        'Pakistan',
        '251487',
        'AL-BARAKAH GROUP 1',
        'PKG-2024',
        '15 Days Economy Umrah',
        'Issued With Insurance',
        'Completed',
        '6102938476',
        '1092837466',
        '1',
        'Active',
        'Adult'
    ];

    const sample3 = [
        'AHMED ALI KHAN',
        8,
        'EF9876543',
        'Pakistan',
        '251487',
        'AL-BARAKAH GROUP 1',
        'PKG-2024',
        '15 Days Economy Umrah',
        'Issued',
        'Completed',
        '6102938477',
        '1092837467',
        '1',
        'Active',
        'Child'
    ];

    const thinBorder = {
        top: { style: 'thin', color: { rgb: 'D0D7DE' } },
        bottom: { style: 'thin', color: { rgb: 'D0D7DE' } },
        left: { style: 'thin', color: { rgb: 'D0D7DE' } },
        right: { style: 'thin', color: { rgb: 'D0D7DE' } }
    };

    const S = {
        header: {
            font: { bold: true, sz: 11, color: { rgb: 'FFFFFF' } },
            fill: { fgColor: { rgb: '354F52' }, patternType: 'solid' },
            alignment: { horizontal: 'center', vertical: 'center' },
            border: thinBorder
        },
        sampleRow: {
            border: thinBorder,
            alignment: { vertical: 'center' }
        }
    };

    const sheetRows = [
        headers.map(h => ({ v: h, t: 's', s: S.header })),
        sample1.map(v => ({ v, t: typeof v === 'number' ? 'n' : 's', s: S.sampleRow })),
        sample2.map(v => ({ v, t: typeof v === 'number' ? 'n' : 's', s: S.sampleRow })),
        sample3.map(v => ({ v, t: typeof v === 'number' ? 'n' : 's', s: S.sampleRow }))
    ];

    const ws = XLSX.utils.aoa_to_sheet(sheetRows.map(row => row.map(c => c.v)));
    sheetRows.forEach((row, rIdx) => {
        row.forEach((c, cIdx) => {
            if (c.s) {
                const ref = XLSX.utils.encode_cell({ r: rIdx, c: cIdx });
                if (ws[ref]) ws[ref].s = c.s;
            }
        });
    });

    ws['!cols'] = [
        { wch: 28 }, // Mutamer name
        { wch: 14 }, // Mutamer Age
        { wch: 18 }, // Passport Number
        { wch: 16 }, // Nationality
        { wch: 16 }, // Group Number
        { wch: 24 }, // Group Name
        { wch: 16 }, // Package Number
        { wch: 24 }, // Package Name
        { wch: 22 }, // Visa Status
        { wch: 18 }, // Biometric status
        { wch: 18 }, // Visa Number
        { wch: 18 }, // Mofa Number
        { wch: 18 }, // sequence of visits
        { wch: 16 }, // Mutamer Status
        { wch: 15 }  // Mutamer Type
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Nusuk Mutamers');
    XLSX.writeFile(wb, 'Nusuk_Mutamers_Import_Template.xlsx');
}

// ── DRAG & DROP / FILE SELECT HANDLERS ──
function handleNusukDragOver(event) {
    event.preventDefault();
    event.stopPropagation();
    const zone = document.getElementById('nusuk-drop-zone');
    if (zone) zone.classList.add('dragover');
}

function handleNusukDragLeave(event) {
    event.preventDefault();
    event.stopPropagation();
    const zone = document.getElementById('nusuk-drop-zone');
    if (zone) zone.classList.remove('dragover');
}

function handleNusukDrop(event) {
    event.preventDefault();
    event.stopPropagation();
    const zone = document.getElementById('nusuk-drop-zone');
    if (zone) zone.classList.remove('dragover');

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
        processNusukFile(files[0]);
    }
}

function handleNusukFileSelect(input) {
    if (input.files && input.files.length > 0) {
        processNusukFile(input.files[0]);
    }
}

// ── HTML ESCAPE HELPER ──
function escapeUbHtml(val) {
    return String(val == null ? '' : val)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

// ── COLUMN LOOKUP HELPER ──
function findNusukRowValue(row, keys) {
    if (!row || typeof row !== 'object') return '';
    const rowKeys = Object.keys(row);
    const normalizedRowKeys = rowKeys.map(rk => ({
        raw: rk,
        norm: rk.toLowerCase().replace(/[\s_\-\(\)\/]/g, '')
    }));

    // 1. Exact match priority across candidate keys
    for (const key of keys) {
        const target = key.toLowerCase().replace(/[\s_\-\(\)\/]/g, '');
        const exact = normalizedRowKeys.find(item => item.norm === target);
        if (exact) return row[exact.raw];
    }

    // 2. Partial match fallback (require >= 3 chars for reverse substring check)
    for (const key of keys) {
        const target = key.toLowerCase().replace(/[\s_\-\(\)\/]/g, '');
        const partial = normalizedRowKeys.find(item =>
            item.norm.includes(target) || (item.norm.length >= 3 && target.includes(item.norm))
        );
        if (partial) return row[partial.raw];
    }
    return '';
}

// ── PROCESS EXCEL FILE ──
function processNusukFile(file) {
    if (!file) return;

    const alImp = document.getElementById('al-nusuk-import');
    if (alImp) alImp.innerHTML = '';

    const zTitle = document.getElementById('nusuk-zone-title');
    if (zTitle) zTitle.textContent = `فائل: ${file.name} (${Math.round(file.size / 1024)} KB)`;
    const zSub = document.getElementById('nusuk-zone-sub');
    if (zSub) zSub.textContent = 'فائل سے نسک ڈیٹا پروسیس ہو رہا ہے...';

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = new Uint8Array(e.target.result);
            if (typeof XLSX === 'undefined') {
                throw new Error('XLSX لائبریری دستیاب نہیں ہے');
            }
            const wb = XLSX.read(data, { type: 'array', cellDates: true, cellText: false });
            const firstSheetName = wb.SheetNames[0];
            const ws = wb.Sheets[firstSheetName];
            const rawRows = XLSX.utils.sheet_to_json(ws, { defval: '', raw: false });

            if (!rawRows || !rawRows.length) {
                throw new Error('اس فائل میں کوئی ڈیٹا نہیں ملا۔');
            }

            const validRows = [];
            const batchId = file.name.replace(/\.[^/.]+$/, "") || ('batch_' + Date.now().toString(36));
            const nowIso = new Date().toISOString();

            rawRows.forEach((row, idx) => {
                const name = String(findNusukRowValue(row, ['mutamername', 'mutamer', 'name', 'passenger', 'نام', 'معتمر'])).trim();
                const passport = String(findNusukRowValue(row, ['passportnumber', 'passportno', 'passport', 'پاسپورٹ'])).trim().toUpperCase();
                const groupNo = String(findNusukRowValue(row, ['groupnumber', 'groupno', 'group', 'گروپنمبر', 'گروپ'])).trim();
                const groupName = String(findNusukRowValue(row, ['groupname', 'گروپنام'])).trim();
                const visaStatus = String(findNusukRowValue(row, ['visastatus', 'visastate', 'ویزااسٹیٹس', 'حالةالتاشيرة'])).trim();
                const visaNo = String(findNusukRowValue(row, ['visanumber', 'visano', 'ویزانمبر', 'رقمالتاشيرة'])).trim();
                const mofaNo = String(findNusukRowValue(row, ['mofanumber', 'mofano', 'mofa', 'موفانمبر', 'رقمالموفا'])).trim();
                const nationality = String(findNusukRowValue(row, ['nationality', 'قومیت', 'جنسية'])).trim();
                const rawAge = findNusukRowValue(row, ['mutamerage', 'age', 'عمر']);
                const age = Number(rawAge) || (rawAge ? String(rawAge).trim() : '');
                const packageNo = String(findNusukRowValue(row, ['packagenumber', 'packageno', 'پیکیجنمبر'])).trim();
                const packageName = String(findNusukRowValue(row, ['packagename', 'پیکیجنام'])).trim();
                const biometricStatus = String(findNusukRowValue(row, ['biometricstatus', 'biometric', 'بایومیٹرک'])).trim();
                const visitSequence = String(findNusukRowValue(row, ['sequenceofvisits', 'sequence', 'visits', 'دورے'])).trim();
                const mutamerStatus = String(findNusukRowValue(row, ['mutamerstatus', 'حالةالمعتمر', 'معتمراسٹیٹس'])).trim();
                let mutamerType = String(findNusukRowValue(row, ['mutamertype', 'type', 'نوعالمعتمر', 'نوع'])).trim();

                // Skip completely empty rows
                if (!name && !passport && !visaNo && !mofaNo && !groupNo) return;
                // Skip header repetitions or summary
                if (name.toLowerCase() === 'mutamer name' || passport.toLowerCase() === 'passport number') return;

                const ageNum = Number(age);
                if (!mutamerType) {
                    if (!isNaN(ageNum) && ageNum > 0) {
                        if (ageNum <= 2) mutamerType = 'Infant';
                        else if (ageNum <= 12) mutamerType = 'Child';
                        else mutamerType = 'Adult';
                    } else {
                        mutamerType = 'Adult';
                    }
                }

                const isAutoCompleted = /exit|departed|returned|completed|left\s*ksa|مغادر|تمت المغادرة|مكتمل/i.test(mutamerStatus);

                validRows.push({
                    id: 'ub_' + Date.now().toString(36) + '_' + (idx + 1) + '_' + Math.random().toString(36).substring(2, 5),
                    name: name || 'نامعلوم معتمر',
                    age: age !== '' ? age : '—',
                    passport: passport || '—',
                    nationality: nationality || '—',
                    groupNo: groupNo || '—',
                    groupName: groupName || (groupNo ? ('گروپ ' + groupNo) : '—'),
                    packageNo: packageNo || '—',
                    packageName: packageName || '—',
                    visaStatus: visaStatus || 'Under Process',
                    biometricStatus: biometricStatus || '—',
                    visaNo: visaNo || '—',
                    mofaNo: mofaNo || '—',
                    visitSequence: visitSequence || '1',
                    mutamerStatus: mutamerStatus || 'Active',
                    mutamerType: mutamerType || 'Adult',
                    tripCompleted: isAutoCompleted,
                    tripCompletedAt: isAutoCompleted ? nowIso : '',
                    batchId: batchId,
                    importedAt: nowIso
                });
            });

            if (!validRows.length) {
                throw new Error('فائل میں کوئی درست قطار نہیں ملی۔ براہ کرم نسک کالمز والا فارمیٹ چیک کریں۔');
            }

            _parsedNusukRecords = validRows;

            // Render Preview Area
            const prevArea = document.getElementById('nusuk-preview-area');
            if (prevArea) prevArea.style.display = 'block';

            // Calculate preview stats
            const stats = computeUmrahStats(validRows);

            const elTotal = document.getElementById('nusuk-stat-total');
            if (elTotal) elTotal.textContent = stats.total.toLocaleString();

            const elGroups = document.getElementById('nusuk-stat-groups');
            if (elGroups) elGroups.textContent = stats.groups.toString();

            const elVisas = document.getElementById('nusuk-stat-visas');
            if (elVisas) elVisas.textContent = stats.visas.toLocaleString();

            const elNats = document.getElementById('nusuk-stat-nationalities');
            if (elNats) elNats.textContent = stats.nationalities.toString();

            const elPax = document.getElementById('nusuk-stat-pax');
            if (elPax) elPax.textContent = `${stats.adults} / ${stats.children} / ${stats.infants}`;

            const elCount = document.getElementById('nusuk-preview-count');
            if (elCount) elCount.textContent = `(کل ${validRows.length} ریکارڈز میں سے پہلے 50 دکھائے جا رہے ہیں)`;

            // Render table preview
            const tbody = document.getElementById('nusuk-preview-tbody');
            if (tbody) {
                const previewRows = validRows.slice(0, 50);
                tbody.innerHTML = previewRows.map((r, i) => {
                    const statusBadge = getUbVisaStatusBadge(r.visaStatus, '11px');

                    return `
                        <tr style="border-bottom:1px solid var(--border);">
                            <td style="padding:6px 8px;text-align:center;color:var(--text-soft);">${i + 1}</td>
                            <td style="padding:6px 8px;font-weight:600;color:var(--text);">${escapeUbHtml(r.name)}</td>
                            <td style="padding:6px 8px;text-align:center;">${escapeUbHtml(r.age)}</td>
                            <td style="padding:6px 8px;text-align:center;font-family:monospace;font-weight:600;">${escapeUbHtml(r.passport)}</td>
                            <td style="padding:6px 8px;">${escapeUbHtml(r.nationality)}</td>
                            <td style="padding:6px 8px;text-align:center;">${escapeUbHtml(r.groupNo)}</td>
                            <td style="padding:6px 8px;">${escapeUbHtml(r.packageName || r.packageNo)}</td>
                            <td style="padding:6px 8px;text-align:center;">${statusBadge}</td>
                            <td style="padding:6px 8px;text-align:center;font-family:monospace;">${escapeUbHtml(r.visaNo)}</td>
                            <td style="padding:6px 8px;text-align:center;font-family:monospace;">${escapeUbHtml(r.mofaNo)}</td>
                        </tr>
                    `;
                }).join('');
            }

            const btnConfirm = document.getElementById('btn-confirm-import-nusuk');
            if (btnConfirm) btnConfirm.disabled = false;

            if (alImp) {
                alImp.innerHTML = `
                    <div style="background:#e8f5e9;color:#2e7d32;border:1px solid #a5d6a7;border-radius:8px;padding:10px 14px;font-size:13px;display:flex;align-items:center;gap:8px;">
                        <span>✓ فائل کامیابی سے پڑھ لی گئی۔ کل <strong>${validRows.length}</strong> معتمرین امپورٹ کے لیے تیار ہیں۔ نیچے "امپورٹ محفوظ کریں" پر کلک کریں۔</span>
                    </div>
                `;
            }

            if (zSub) zSub.textContent = `کامیابی: ${validRows.length} ریکارڈز لوڈ ہو چکے ہیں۔`;

        } catch (err) {
            console.error('Nusuk import parsing error:', err);
            const alImp = document.getElementById('al-nusuk-import');
            if (alImp) {
                alImp.innerHTML = `
                    <div style="background:#ffebee;color:#c62828;border:1px solid #ef9a9a;border-radius:8px;padding:10px 14px;font-size:13px;">
                        ${err.message || 'فائل پڑھنے کے دوران غلطی پیش آئی۔'}
                    </div>
                `;
            }
            const zSub = document.getElementById('nusuk-zone-sub');
            if (zSub) zSub.textContent = 'خرابی: درست نسک فائل منتخب کریں۔';
        }
    };
    reader.readAsArrayBuffer(file);
}

// ── SHARED DATA & BADGE HELPERS ──
function getCleanUmrahList() {
    if ((!Array.isArray(umrahBookings) || !umrahBookings.length) && typeof localStorage !== 'undefined') {
        try {
            const cached = JSON.parse(localStorage.getItem('uts_umrahBookings') || '[]');
            if (Array.isArray(cached) && cached.length > 0) {
                umrahBookings = cached;
            }
        } catch (e) { }
    }
    if (!Array.isArray(umrahBookings)) return [];
    return umrahBookings.filter(r => r && typeof r === 'object');
}

function getUbVisaStatusBadge(visaStatus, fontSize = '11.5px') {
    const visa = String(visaStatus || '').trim();
    const safeVisa = escapeUbHtml(visa || 'Under Process');
    const isIssued = /issued|approved|مقبول|تم الإصدار/i.test(visa);
    const isPending = /process|pending|تحت|انتظار/i.test(visa) || !visa || visa === '—';
    if (isIssued) {
        return `<span class="badge" style="background:rgba(34,197,94,0.12);color:#16a34a;padding:3px 8px;border-radius:12px;font-size:${fontSize};font-weight:600;">${safeVisa}</span>`;
    }
    if (isPending) {
        return `<span class="badge" style="background:rgba(234,179,8,0.12);color:#ca8a04;padding:3px 8px;border-radius:12px;font-size:${fontSize};font-weight:600;">${safeVisa}</span>`;
    }
    return `<span class="badge" style="background:rgba(239,68,68,0.12);color:#dc2626;padding:3px 8px;border-radius:12px;font-size:${fontSize};font-weight:600;">${safeVisa}</span>`;
}

function getUbMutamerCategory(mutamerType, age) {
    const mType = String(mutamerType || '').toLowerCase();
    const ageNum = Number(age);
    if (mType.includes('infant') || mType.includes('رضيع') || (!isNaN(ageNum) && ageNum > 0 && ageNum <= 2)) return 'infant';
    if (mType.includes('child') || mType.includes('طفل') || (!isNaN(ageNum) && ageNum > 0 && ageNum <= 12)) return 'child';
    return 'adult';
}

function isUmrahTripCompleted(rec) {
    return Boolean(rec && rec.tripCompleted);
}

function getActiveUmrahBookings() {
    return getCleanUmrahList().filter(r => !isUmrahTripCompleted(r));
}

function persistUmrahBookings() {
    try {
        if (typeof localStorage !== 'undefined') {
            if (Array.isArray(umrahBookings) && umrahBookings.length > 0) {
                localStorage.setItem('uts_umrahBookings', JSON.stringify(umrahBookings));
            } else {
                localStorage.removeItem('uts_umrahBookings');
            }
        }
    } catch (e) { console.warn('LocalStorage save error:', e); }

    if (typeof svUB === 'function') {
        svUB();
    } else if (typeof _safeFbSet === 'function') {
        _safeFbSet('umrahBookings', umrahBookings);
    }
}

function computeUmrahStats(list) {
    const groupsSet = new Set(list.map(r => r.groupNo).filter(g => g && g !== '—'));
    const nationalitiesSet = new Set(list.map(r => r.nationality).filter(n => n && n !== '—'));
    const visas = list.filter(r => {
        const vs = String(r.visaStatus || '');
        const vn = String(r.visaNo || '');
        return /issued|approved|مقبول|تم الإصدار/i.test(vs) || (vn && vn !== '—');
    }).length;

    let adults = 0, children = 0, infants = 0, active = 0, completed = 0;
    list.forEach(r => {
        if (isUmrahTripCompleted(r)) completed++;
        else active++;
        const cat = getUbMutamerCategory(r.mutamerType, r.age);
        if (cat === 'infant') infants++;
        else if (cat === 'child') children++;
        else adults++;
    });

    return { total: list.length, active, completed, groups: groupsSet.size, nationalities: nationalitiesSet.size, visas, adults, children, infants };
}

function getUbMutamerTypeBadge(mutamerType, age) {
    const cat = getUbMutamerCategory(mutamerType, age);
    if (cat === 'infant') {
        return `<span style="font-size:11px;background:#fce4ec;color:#c2185b;padding:2px 6px;border-radius:10px;">شیرخوار</span>`;
    }
    if (cat === 'child') {
        return `<span style="font-size:11px;background:#e3f2fd;color:#1565c0;padding:2px 6px;border-radius:10px;">بچہ</span>`;
    }
    return `<span style="font-size:11px;background:#e8f5e9;color:#2e7d32;padding:2px 6px;border-radius:10px;">بالغ</span>`;
}

function populateUbSelect(selectEl, defaultLabel, items) {
    if (!selectEl) return;
    const prevVal = selectEl.value || '';
    selectEl.innerHTML = '';

    const defOpt = document.createElement('option');
    defOpt.value = '';
    defOpt.textContent = defaultLabel;
    selectEl.appendChild(defOpt);

    let hasPrev = false;
    items.forEach(({ value, label }) => {
        const opt = document.createElement('option');
        opt.value = value;
        opt.textContent = label;
        if (value === prevVal) {
            opt.selected = true;
            hasPrev = true;
        }
        selectEl.appendChild(opt);
    });
    selectEl.value = hasPrev ? prevVal : '';
}

// ── TAB, FILTER & PAGINATION HANDLERS ──
function resetUmrahFilters(shouldRender = true) {
    const searchEl = document.getElementById('ub-search-input');
    const groupEl = document.getElementById('ub-filter-group');
    const natEl = document.getElementById('ub-filter-nationality');
    const statusEl = document.getElementById('ub-filter-status');
    if (searchEl) searchEl.value = '';
    if (groupEl) groupEl.value = '';
    if (natEl) natEl.value = '';
    if (statusEl) statusEl.value = '';
    ubCurrentPage = 1;
    if (shouldRender) filterUmrahBookings();
}

function onUmrahFilterChange() {
    ubCurrentPage = 1;
    filterUmrahBookings();
}

function switchUmrahListTab(tab) {
    if (tab !== 'active' && tab !== 'completed' && tab !== 'all') return;
    ubCurrentListTab = tab;
    ubCurrentPage = 1;
    _ubSelectedIds.clear();
    renderUmrahBookings();
}

function setUmrahPage(page) {
    ubCurrentPage = Math.max(1, Number(page) || 1);
    filterUmrahBookings();
}

function setUmrahPageSize(size) {
    const parsedSize = Number(size);
    if (parsedSize !== 25 && parsedSize !== 50) return;
    ubPageSize = parsedSize;
    ubCurrentPage = 1;
    filterUmrahBookings();
}

// ── SELECTION & TRIP COMPLETION ACTIONS ──
function updateUmrahSelectionUI() {
    const bar = document.getElementById('ub-bulk-bar');
    const countEl = document.getElementById('ub-selected-count');
    const selectAllEl = document.getElementById('ub-select-all');
    const btnComplete = document.getElementById('btn-ub-bulk-complete');
    const btnReopen = document.getElementById('btn-ub-bulk-reopen');
    const btnVoucher = document.getElementById('btn-ub-bulk-voucher');
    const topDelLbl = document.getElementById('btn-nusuk-clear-label');
    const selFilteredBtn = document.getElementById('btn-ub-select-filtered');

    if (countEl) countEl.textContent = _ubSelectedIds.size.toString();
    if (bar) bar.style.display = _ubSelectedIds.size > 0 ? 'flex' : 'none';
    if (btnComplete) btnComplete.style.display = ubCurrentListTab === 'completed' ? 'none' : 'inline-flex';
    if (btnReopen) btnReopen.style.display = ubCurrentListTab === 'active' ? 'none' : 'inline-flex';
    if (btnVoucher) btnVoucher.style.display = ubCurrentListTab === 'completed' ? 'none' : 'inline-flex';

    if (topDelLbl) {
        topDelLbl.textContent = _ubSelectedIds.size > 0
            ? `منتخب ڈیلیٹ کریں (${_ubSelectedIds.size})`
            : 'ڈیلیٹ کریں';
    }

    if (selFilteredBtn) {
        const allFilteredSelected = _ubCurrentFilteredIds.length > 0 && _ubCurrentFilteredIds.every(id => _ubSelectedIds.has(id));
        selFilteredBtn.textContent = allFilteredSelected
            ? 'انتخاب ختم کریں'
            : `تمام منتخب کریں (${_ubCurrentFilteredIds.length})`;
    }

    if (selectAllEl) {
        const allChecked = _ubCurrentPageIds.length > 0 && _ubCurrentPageIds.every(id => _ubSelectedIds.has(id));
        selectAllEl.checked = allChecked;
    }
}

function toggleUmrahRowSelect(id, checked) {
    const key = String(id || '');
    if (!key) return;
    if (checked) _ubSelectedIds.add(key);
    else _ubSelectedIds.delete(key);

    const rowEl = document.querySelector(`tr[data-ub-id="${key.replace(/"/g, '\\"')}"]`);
    if (rowEl) {
        rowEl.style.background = checked ? 'var(--accent-tint, rgba(20,125,100,0.08))' : '';
    }
    updateUmrahSelectionUI();
}

function toggleAllUmrahSelect(checked) {
    _ubCurrentPageIds.forEach(id => {
        if (checked) _ubSelectedIds.add(id);
        else _ubSelectedIds.delete(id);
    });
    document.querySelectorAll('.ub-row-checkbox').forEach(cb => {
        cb.checked = checked;
        const tr = cb.closest ? cb.closest('tr') : null;
        if (tr) tr.style.background = checked ? 'var(--accent-tint, rgba(20,125,100,0.08))' : '';
    });
    updateUmrahSelectionUI();
}

function selectAllFilteredUmrahBookings() {
    if (!_ubCurrentFilteredIds.length) return;
    const allSelected = _ubCurrentFilteredIds.every(id => _ubSelectedIds.has(id));
    if (allSelected) {
        _ubCurrentFilteredIds.forEach(id => _ubSelectedIds.delete(id));
    } else {
        _ubCurrentFilteredIds.forEach(id => _ubSelectedIds.add(id));
    }
    filterUmrahBookings();
}

function clearUmrahSelection() {
    _ubSelectedIds.clear();
    document.querySelectorAll('.ub-row-checkbox').forEach(cb => {
        cb.checked = false;
        const tr = cb.closest ? cb.closest('tr') : null;
        if (tr) tr.style.background = '';
    });
    updateUmrahSelectionUI();
}

function setUmrahIdsCompleted(idsSet, completed) {
    const list = getCleanUmrahList();
    const nowIso = new Date().toISOString();
    let changed = 0;

    umrahBookings = list.map(rec => {
        if (!idsSet.has(String(rec.id))) return rec;
        changed++;
        return {
            ...rec,
            tripCompleted: Boolean(completed),
            tripCompletedAt: completed ? nowIso : ''
        };
    });

    if (!changed) return 0;
    _ubSelectedIds.clear();
    persistUmrahBookings();
    renderUmrahBookings();
    if (typeof renderUmrahVouchers === 'function') renderUmrahVouchers();
    return changed;
}

function toggleUmrahTripComplete(id) {
    const list = getCleanUmrahList();
    const item = list.find(b => String(b.id) === String(id));
    if (!item) return;
    setUmrahIdsCompleted(new Set([String(id)]), !isUmrahTripCompleted(item));
}

async function markSelectedUmrahCompleted(completed) {
    if (!_ubSelectedIds.size) return;
    const actionTxt = completed ? 'مکمل شدہ عمرہ (Completed) لسٹ میں منتقل' : 'واپس فعال لسٹ میں شامل';
    const ok = await showUmrahConfirm(
        `کیا آپ منتخب ${_ubSelectedIds.size} معتمرین کو ${actionTxt} کرنا چاہتے ہیں؟`,
        'Trip اسٹیٹس تبدیل کریں',
        completed ? 'success' : 'info',
        'ہاں، تبدیل کریں'
    );
    if (!ok) return;
    setUmrahIdsCompleted(new Set(_ubSelectedIds), completed);
}

async function completeSelectedGroupTrips() {
    const groupVal = (document.getElementById('ub-filter-group')?.value) || '';
    if (!groupVal) return;
    const targets = getCleanUmrahList().filter(r => !isUmrahTripCompleted(r) && String(r.groupNo || '').trim() === groupVal);
    if (!targets.length) {
        await showUmrahAlert('اس گروپ میں کوئی فعال معتمر باقی نہیں ہے', 'اطلاع', 'info');
        return;
    }
    const ok = await showUmrahConfirm(
        `کیا آپ گروپ "${groupVal}" کے تمام ${targets.length} فعال معتمرین کی Trip مکمل کر کے Completed لسٹ میں منتقل کرنا چاہتے ہیں؟`,
        'گروپ Trip مکمل کریں',
        'success',
        'ہاں، مکمل کریں'
    );
    if (!ok) return;
    const gEl = document.getElementById('ub-filter-group');
    if (gEl) gEl.value = '';
    setUmrahIdsCompleted(new Set(targets.map(r => String(r.id))), true);
}

async function createUmrahVoucherFromSelection() {
    if (!_ubSelectedIds.size) {
        await showUmrahAlert('پہلے ٹیبل سے کم از کم ایک فعال معتمر منتخب کریں', 'انتخاب ضروری ہے', 'warning');
        return;
    }
    const selectedActive = getCleanUmrahList().filter(r => _ubSelectedIds.has(String(r.id)) && !isUmrahTripCompleted(r));
    if (!selectedActive.length) {
        await showUmrahAlert('منتخب معتمرین کی Trip پہلے ہی مکمل ہو چکی ہے۔ واؤچر صرف فعال (Active) معتمرین کے لیے بنتا ہے۔', 'انتباہ', 'warning');
        return;
    }
    if (typeof switchUmrahTab === 'function') switchUmrahTab('voucher');
    if (typeof clearUmrahVoucherForm === 'function') clearUmrahVoucherForm();
    if (typeof attachMutamersToVoucher === 'function') {
        attachMutamersToVoucher(selectedActive, true);
    }
    _ubSelectedIds.clear();
    updateUmrahSelectionUI();
    await showUmrahAlert(`${selectedActive.length} منتخب فعال معتمرین واؤچر فارم میں امپورٹ کر دیے گئے ہیں!`, 'واؤچر تیار ہے', 'success');
}

// ── CONFIRM & SAVE IMPORT ──
async function confirmNusukImport() {
    if (!_parsedNusukRecords || !_parsedNusukRecords.length) {
        await showUmrahAlert('امپورٹ کرنے کے لیے کوئی ریکارڈ موجود نہیں ہے', 'انتباہ', 'warning');
        return;
    }

    if (!Array.isArray(umrahBookings)) {
        umrahBookings = [];
    }

    const modeInput = document.querySelector('input[name="nusuk-import-mode"]:checked');
    const mode = modeInput ? modeInput.value : 'append';

    if (mode === 'replace') {
        const ok = await showUmrahConfirm(
            `کیا آپ واقعی پرانا تمام معتمرین ڈیٹا ختم کر کے یہ ${_parsedNusukRecords.length} نئے ریکارڈز رکھنا چاہتے ہیں؟`,
            'پرانا ڈیٹا تبدیل کریں',
            'danger',
            'ہاں، نیا ڈیٹا رکھیں'
        );
        if (!ok) return;
        umrahBookings = [..._parsedNusukRecords];
    } else {
        const existingPassports = new Set(umrahBookings.map(b => String((b && b.passport) || '').trim().toUpperCase()).filter(p => p && p !== '—'));

        _parsedNusukRecords.forEach(rec => {
            const pKey = String(rec.passport || '').trim().toUpperCase();
            if (pKey && pKey !== '—' && existingPassports.has(pKey)) {
                const existingIdx = umrahBookings.findIndex(b => b && String(b.passport || '').trim().toUpperCase() === pKey);
                if (existingIdx !== -1) {
                    const prev = umrahBookings[existingIdx];
                    const keepPrevDone = (rec.visaNo && prev.visaNo && rec.visaNo !== prev.visaNo)
                        ? Boolean(rec.tripCompleted)
                        : Boolean(rec.tripCompleted || prev.tripCompleted);
                    umrahBookings[existingIdx] = {
                        ...prev,
                        ...rec,
                        tripCompleted: keepPrevDone,
                        tripCompletedAt: keepPrevDone ? (rec.tripCompletedAt || prev.tripCompletedAt || new Date().toISOString()) : ''
                    };
                } else {
                    umrahBookings.push(rec);
                }
            } else {
                umrahBookings.push(rec);
                if (pKey && pKey !== '—') existingPassports.add(pKey);
            }
        });
    }

    persistUmrahBookings();

    const importedCount = _parsedNusukRecords.length;
    ubCurrentListTab = 'active';
    _ubSelectedIds.clear();
    resetUmrahFilters(false);
    closeNusukImportModal();
    renderUmrahBookings();
    if (typeof renderUmrahVouchers === 'function') renderUmrahVouchers();

    await showUmrahAlert(
        `نسک شیٹ سے ${importedCount} معتمرین کا ڈیٹا کامیابی سے امپورٹ اور محفوظ کر دیا گیا ہے!`,
        'امپورٹ مکمل',
        'success'
    );
}

// ── RENDER BOOKINGS ON PAGE ──
function updateUmrahSubtabUI(stats) {
    const activeBtn = document.getElementById('ub-subtab-active');
    const completedBtn = document.getElementById('ub-subtab-completed');
    const allBtn = document.getElementById('ub-subtab-all');
    if (activeBtn) activeBtn.classList.toggle('active', ubCurrentListTab === 'active');
    if (completedBtn) completedBtn.classList.toggle('active', ubCurrentListTab === 'completed');
    if (allBtn) allBtn.classList.toggle('active', ubCurrentListTab === 'all');

    const cActive = document.getElementById('ub-count-active');
    const cCompleted = document.getElementById('ub-count-completed');
    const cAll = document.getElementById('ub-count-all');
    if (cActive) cActive.textContent = stats.active.toLocaleString();
    if (cCompleted) cCompleted.textContent = stats.completed.toLocaleString();
    if (cAll) cAll.textContent = stats.total.toLocaleString();

    const listTitle = document.getElementById('ub-list-title');
    if (listTitle) {
        listTitle.textContent = ubCurrentListTab === 'completed'
            ? 'مکمل شدہ عمرہ / Trip معتمرین (Completed List)'
            : ubCurrentListTab === 'all'
                ? 'تمام معتمرین و حجاج کا ریکارڈ (All Mutamers)'
                : 'فعال / زیرِ عمرہ معتمرین کی فہرست (Active Mutamers)';
    }
}

function renderUmrahBookings() {
    const list = getCleanUmrahList();
    const stats = computeUmrahStats(list);

    // Update KPI counters
    const elKpiTotal = document.getElementById('ub-kpi-total');
    if (elKpiTotal) elKpiTotal.textContent = stats.total.toLocaleString();

    const elKpiActive = document.getElementById('ub-kpi-active');
    if (elKpiActive) elKpiActive.textContent = stats.active.toLocaleString();

    const elKpiCompleted = document.getElementById('ub-kpi-completed');
    if (elKpiCompleted) elKpiCompleted.textContent = stats.completed.toLocaleString();

    const elKpiGroups = document.getElementById('ub-kpi-groups');
    if (elKpiGroups) elKpiGroups.textContent = stats.groups.toString();

    const elKpiVisas = document.getElementById('ub-kpi-visas');
    if (elKpiVisas) elKpiVisas.textContent = stats.visas.toLocaleString();

    const elKpiPax = document.getElementById('ub-kpi-pax');
    if (elKpiPax) elKpiPax.textContent = `${stats.adults} / ${stats.children} / ${stats.infants}`;

    updateUmrahSubtabUI(stats);

    // Populate filter dropdowns safely
    try {
        populateUmrahDropdowns();
    } catch (e) {
        console.warn('populateUmrahDropdowns error:', e);
    }

    // Filter and render table
    filterUmrahBookings();
}

// ── POPULATE FILTER DROPDOWNS ──
function populateUmrahDropdowns() {
    const groupSelect = document.getElementById('ub-filter-group');
    const natSelect = document.getElementById('ub-filter-nationality');
    const statusSelect = document.getElementById('ub-filter-status');

    if (!groupSelect || !natSelect || !statusSelect) return;

    const list = getCleanUmrahList();

    // Groups
    const groupMap = new Map();
    list.forEach(r => {
        const gNo = String(r.groupNo || '').trim();
        const gName = String(r.groupName || '').trim();
        if (gNo && gNo !== '—') {
            const label = gName && gName !== '—' && gName !== gNo ? `${gNo} (${gName})` : gNo;
            groupMap.set(gNo, label);
        }
    });
    const groupItems = Array.from(groupMap.entries()).map(([value, label]) => ({ value, label }));
    populateUbSelect(groupSelect, 'تمام گروپس (All Groups)', groupItems);

    // Nationalities
    const nationalities = Array.from(new Set(list.map(r => String(r.nationality || '').trim()).filter(n => n && n !== '—'))).sort();
    populateUbSelect(natSelect, 'تمام قومیتیں (All Nationalities)', nationalities.map(n => ({ value: n, label: n })));

    // Visa statuses
    const statuses = Array.from(new Set(list.map(r => String(r.visaStatus || '').trim()).filter(s => s && s !== '—'))).sort();
    populateUbSelect(statusSelect, 'تمام اسٹیٹس (All Statuses)', statuses.map(s => ({ value: s, label: s })));
}

// ── ENSURE TABLE SECTION EXISTS IN #ub-container ──
function ensureUbTableDom(container) {
    let tableSection = document.getElementById('ub-table-section');
    let tbody = document.getElementById('ub-tbody');
    if (tableSection && tbody) return { tableSection, tbody };

    tableSection = document.createElement('div');
    tableSection.id = 'ub-table-section';
    tableSection.style.display = 'none';
    const hasBulkBar = Boolean(document.getElementById('ub-bulk-bar'));
    const fallbackBulkHtml = hasBulkBar ? '' : `
        <div id="ub-bulk-bar" class="no-print" style="display:none;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;padding:10px 14px;margin-bottom:10px;border-radius:10px;background:var(--accent-tint,rgba(20,125,100,0.08));border:1px solid var(--accent,#147d64);">
            <div style="font-size:13px;font-weight:700;color:var(--primary);">منتخب معتمرین: <span id="ub-selected-count">0</span></div>
            <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;">
                <button type="button" class="btn btn-p btn-sm" id="btn-ub-bulk-voucher" onclick="createUmrahVoucherFromSelection()">واؤچر بنائیں</button>
                <button type="button" class="btn btn-p btn-sm" id="btn-ub-bulk-complete" onclick="markSelectedUmrahCompleted(true)">✓ عمرہ / Trip مکمل کریں</button>
                <button type="button" class="btn btn-o btn-sm" id="btn-ub-bulk-reopen" onclick="markSelectedUmrahCompleted(false)" style="display:none;">↩ واپس فعال لسٹ میں لائیں</button>
                <button type="button" class="btn btn-d btn-sm" id="btn-ub-bulk-delete" onclick="deleteSelectedUmrahBookings()">منتخب ڈیلیٹ کریں</button>
                <button type="button" class="btn btn-o btn-sm" onclick="clearUmrahSelection()">انتخاب ختم کریں</button>
            </div>
        </div>
    `;
    tableSection.innerHTML = `
        ${fallbackBulkHtml}
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;margin-bottom:10px;">
            <div style="font-size:14px;font-weight:700;color:var(--primary);" id="ub-list-title">معتمرین و حجاج کا مکمل ریکارڈ</div>
            <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
                <button type="button" class="btn btn-o btn-sm no-print" id="btn-ub-select-filtered" onclick="selectAllFilteredUmrahBookings()" style="padding:4px 10px;font-size:12px;">تمام منتخب کریں</button>
                <div style="font-size:13px;font-weight:600;color:var(--text);" id="ub-table-count"></div>
            </div>
        </div>
        <div class="tbl-wrap" style="overflow-x:auto;border:1px solid var(--border);border-radius:10px;">
            <table style="width:100%;border-collapse:collapse;font-size:12.5px;min-width:1160px;" id="ub-table">
                <thead>
                    <tr>
                        <th class="no-print" style="padding:10px 10px;text-align:center;width:36px;"><input type="checkbox" id="ub-select-all" onchange="toggleAllUmrahSelect(this.checked)" /></th>
                        <th style="padding:10px 12px;text-align:center;width:45px;">#</th>
                        <th style="padding:10px 12px;text-align:start;">معتمر کا نام (Mutamer Name)</th>
                        <th style="padding:10px 12px;text-align:center;">عمر / نوعیت</th>
                        <th style="padding:10px 12px;text-align:center;">پاسپورٹ نمبر</th>
                        <th style="padding:10px 12px;text-align:center;">قومیت</th>
                        <th style="padding:10px 12px;text-align:start;">گروپ (نمبر و نام)</th>
                        <th style="padding:10px 12px;text-align:start;">پیکیج (نمبر و نام)</th>
                        <th style="padding:10px 12px;text-align:center;">ویزا اسٹیٹس</th>
                        <th style="padding:10px 12px;text-align:center;">ویزا نمبر</th>
                        <th style="padding:10px 12px;text-align:center;">موفا نمبر</th>
                        <th style="padding:10px 12px;text-align:center;">بائیو میٹرک</th>
                        <th style="padding:10px 12px;text-align:center;">دورے (Seq)</th>
                        <th style="padding:10px 12px;text-align:center;">Trip اسٹیٹس</th>
                        <th class="no-print" style="padding:10px 12px;text-align:center;width:120px;">ایکشن</th>
                    </tr>
                </thead>
                <tbody id="ub-tbody"></tbody>
            </table>
        </div>
        <div id="ub-pagination" class="records-pagination no-print" style="display:none;"></div>
    `;
    container.appendChild(tableSection);
    tbody = document.getElementById('ub-tbody');
    return { tableSection, tbody };
}

function renderUbRow(r, serialNo) {
    const statusBadge = getUbVisaStatusBadge(r.visaStatus);
    const typeBadge = getUbMutamerTypeBadge(r.mutamerType, r.age);

    const bio = String(r.biometricStatus || '').trim();
    const bioBadge = /complete|yes|enrolled|مکمل|تم/i.test(bio)
        ? `<span style="color:#16a34a;font-weight:600;font-size:12px;">✓ ${escapeUbHtml(bio)}</span>`
        : `<span style="color:var(--text-soft);font-size:12px;">${escapeUbHtml(bio || '—')}</span>`;

    const pkgNo = String(r.packageNo || '').trim();
    const pkgName = String(r.packageName || '').trim();
    const pkgMain = pkgName && pkgName !== '—' ? pkgName : (pkgNo || '—');
    const pkgSub = pkgName && pkgName !== '—' && pkgNo && pkgNo !== '—' && pkgNo !== pkgName ? pkgNo : '';

    const grpNo = String(r.groupNo || '').trim();
    const grpName = String(r.groupName || '').trim();
    const grpSub = grpName && grpName !== '—' && grpName !== grpNo ? grpName : '';

    const rawId = String(r.id || '');
    const safeId = escapeUbHtml(rawId);
    const ageDisplay = (r.age !== '' && r.age != null) ? escapeUbHtml(r.age) : '—';
    const completed = isUmrahTripCompleted(r);
    const isChecked = _ubSelectedIds.has(rawId);

    const tripBadge = completed
        ? `<span class="badge badge-checked" style="font-size:11px;padding:3px 8px;">مکمل (Completed)</span>`
        : `<span class="badge badge-pending" style="font-size:11px;padding:3px 8px;">فعال (Active)</span>`;

    const tripBtn = completed
        ? `<button type="button" class="btn btn-o btn-sm" onclick="toggleUmrahTripComplete('${safeId}')" title="واپس فعال لسٹ میں بھیجیں" style="padding:3px 7px;font-size:11px;">↩ فعال</button>`
        : `<button type="button" class="btn btn-o btn-sm" onclick="toggleUmrahTripComplete('${safeId}')" title="عمرہ / Trip مکمل کریں" style="padding:3px 7px;font-size:11px;color:#16a34a;border-color:#16a34a;">✓ مکمل</button>`;

    return `
        <tr data-ub-id="${safeId}" style="border-bottom:1px solid var(--border);${isChecked ? 'background:var(--accent-tint, rgba(20,125,100,0.08));' : ''}">
            <td class="no-print" style="padding:10px 10px;text-align:center;">
                <input type="checkbox" class="ub-row-checkbox" onchange="toggleUmrahRowSelect('${safeId}', this.checked)" ${isChecked ? 'checked' : ''} />
            </td>
            <td style="padding:10px 12px;text-align:center;color:var(--text-soft);font-weight:600;">${serialNo}</td>
            <td style="padding:10px 12px;font-weight:700;color:var(--text);">
                <div style="font-size:13px;">${escapeUbHtml(r.name || '—')}</div>
                <div style="font-size:11.5px;color:var(--text-soft);margin-top:2px;">${escapeUbHtml(r.mutamerStatus || '')}</div>
            </td>
            <td style="padding:10px 12px;text-align:center;">
                <div style="font-weight:600;font-size:12.5px;">${ageDisplay}</div>
                <div style="margin-top:2px;">${typeBadge}</div>
            </td>
            <td style="padding:10px 12px;text-align:center;font-family:monospace;font-weight:700;letter-spacing:0.5px;color:var(--primary);">${escapeUbHtml(r.passport || '—')}</td>
            <td style="padding:10px 12px;text-align:center;">
                <span style="display:inline-block;padding:2px 8px;border-radius:6px;background:var(--surface-alt);border:1px solid var(--border);font-size:12px;">${escapeUbHtml(r.nationality || '—')}</span>
            </td>
            <td style="padding:10px 12px;">
                <div style="font-weight:600;font-size:12.5px;">${escapeUbHtml(grpNo || '—')}</div>
                ${grpSub ? `<div style="font-size:11.5px;color:var(--text-soft);">${escapeUbHtml(grpSub)}</div>` : ''}
            </td>
            <td style="padding:10px 12px;">
                <div style="font-size:12px;font-weight:600;">${escapeUbHtml(pkgMain)}</div>
                ${pkgSub ? `<div style="font-size:11px;color:var(--text-soft);font-family:monospace;">${escapeUbHtml(pkgSub)}</div>` : ''}
            </td>
            <td style="padding:10px 12px;text-align:center;">${statusBadge}</td>
            <td style="padding:10px 12px;text-align:center;font-family:monospace;font-size:12px;">${escapeUbHtml(r.visaNo || '—')}</td>
            <td style="padding:10px 12px;text-align:center;font-family:monospace;font-size:12px;">${escapeUbHtml(r.mofaNo || '—')}</td>
            <td style="padding:10px 12px;text-align:center;">${bioBadge}</td>
            <td style="padding:10px 12px;text-align:center;">${escapeUbHtml(r.visitSequence || '1')}</td>
            <td style="padding:10px 12px;text-align:center;">${tripBadge}</td>
            <td class="no-print" style="padding:10px 10px;text-align:center;white-space:nowrap;">
                <div style="display:inline-flex;align-items:center;gap:4px;">
                    ${tripBtn}
                    <button type="button" class="btn btn-o btn-sm" onclick="deleteUmrahBooking('${safeId}')" title="ڈیلیٹ کریں" style="padding:4px 6px;color:var(--red,#dc2626);border-color:transparent;background:transparent;cursor:pointer;">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="3 6 5 6 21 6"/>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                        </svg>
                    </button>
                </div>
            </td>
        </tr>
    `;
}

function renderUmrahPagination(totalFiltered, firstIdx, lastIdx, totalPages) {
    const pagEl = document.getElementById('ub-pagination');
    if (!pagEl) return;

    if (!totalFiltered) {
        pagEl.style.display = 'none';
        pagEl.innerHTML = '';
        return;
    }

    pagEl.style.display = 'flex';
    pagEl.innerHTML = `
        <label class="records-page-size-label" for="ub-page-size">
            فی صفحہ ریکارڈ:
            <select id="ub-page-size" onchange="setUmrahPageSize(this.value)">
                <option value="25" ${ubPageSize === 25 ? 'selected' : ''}>25</option>
                <option value="50" ${ubPageSize === 50 ? 'selected' : ''}>50</option>
            </select>
        </label>
        <span class="records-page-status">${firstIdx + 1}–${lastIdx} / ${totalFiltered}</span>
        <div class="records-page-buttons">
            <button type="button" class="btn btn-o btn-sm" onclick="setUmrahPage(${ubCurrentPage - 1})" ${ubCurrentPage <= 1 ? 'disabled' : ''}>پچھلا</button>
            <span>${ubCurrentPage} / ${totalPages}</span>
            <button type="button" class="btn btn-o btn-sm" onclick="setUmrahPage(${ubCurrentPage + 1})" ${ubCurrentPage >= totalPages ? 'disabled' : ''}>اگلا</button>
        </div>
    `;
}

// ── FILTER & DISPLAY BOOKINGS IN #ub-container ──
function filterUmrahBookings() {
    const allList = getCleanUmrahList();
    const container = document.getElementById('ub-container');
    const clearBtn = document.getElementById('btn-nusuk-clear');

    if (clearBtn) {
        clearBtn.style.display = allList.length > 0 ? 'inline-flex' : 'none';
    }

    if (!container) return;

    const emptyState = document.getElementById('ub-empty-state');
    const { tableSection, tbody } = ensureUbTableDom(container);

    if (!allList.length) {
        _ubCurrentPageIds = [];
        _ubCurrentFilteredIds = [];
        _ubSelectedIds.clear();
        if (emptyState) emptyState.style.display = 'block';
        if (tableSection) tableSection.style.display = 'none';
        if (tbody) tbody.innerHTML = '';
        renderUmrahPagination(0, 0, 0, 1);
        updateUmrahSelectionUI();
        return;
    }

    const validIds = new Set(allList.map(r => String(r.id || '')).filter(Boolean));
    for (const sid of Array.from(_ubSelectedIds)) {
        if (!validIds.has(sid)) _ubSelectedIds.delete(sid);
    }

    if (emptyState) emptyState.style.display = 'none';
    if (tableSection) tableSection.style.display = 'block';

    // Filter by Active vs Completed Trip tab first
    const tabList = ubCurrentListTab === 'all'
        ? allList
        : ubCurrentListTab === 'completed'
            ? allList.filter(r => isUmrahTripCompleted(r))
            : allList.filter(r => !isUmrahTripCompleted(r));

    const search = ((document.getElementById('ub-search-input')?.value) || '').trim().toLowerCase();
    const groupVal = (document.getElementById('ub-filter-group')?.value) || '';
    const natVal = (document.getElementById('ub-filter-nationality')?.value) || '';
    const statusVal = (document.getElementById('ub-filter-status')?.value) || '';

    const completeGroupBtn = document.getElementById('btn-ub-complete-group');
    if (completeGroupBtn) {
        const hasActiveInGroup = Boolean(groupVal) && ubCurrentListTab !== 'completed' &&
            allList.some(r => !isUmrahTripCompleted(r) && String(r.groupNo || '').trim() === groupVal);
        completeGroupBtn.style.display = hasActiveInGroup ? 'inline-flex' : 'none';
    }

    const filtered = tabList.filter(r => {
        if (groupVal && String(r.groupNo || '').trim() !== groupVal) return false;
        if (natVal && String(r.nationality || '').trim() !== natVal) return false;
        if (statusVal && String(r.visaStatus || '').trim() !== statusVal) return false;

        if (search) {
            const searchable = [
                r.name, r.passport, r.visaNo, r.mofaNo,
                r.groupNo, r.groupName, r.packageNo, r.packageName, r.nationality
            ].map(v => String(v || '').toLowerCase()).join(' ');
            if (!searchable.includes(search)) return false;
        }
        return true;
    });

    _ubCurrentFilteredIds = filtered.map(r => String(r.id || '')).filter(Boolean);

    const totalPages = Math.max(1, Math.ceil(filtered.length / ubPageSize));
    ubCurrentPage = Math.min(Math.max(ubCurrentPage, 1), totalPages);
    const firstIdx = (ubCurrentPage - 1) * ubPageSize;
    const lastIdx = Math.min(firstIdx + ubPageSize, filtered.length);
    const pageRows = filtered.slice(firstIdx, lastIdx);

    _ubCurrentPageIds = pageRows.map(r => String(r.id || '')).filter(Boolean);

    const countEl = document.getElementById('ub-table-count');
    if (countEl) {
        countEl.textContent = filtered.length
            ? `صفحہ پر: ${firstIdx + 1}–${lastIdx} | فلٹر شدہ: ${filtered.length} (کل امپورٹ: ${allList.length})`
            : `ریکارڈز: 0 (اس ٹیب میں: ${tabList.length} | کل: ${allList.length})`;
    }

    if (!tbody) return;

    if (!filtered.length) {
        const emptyMsg = !tabList.length && ubCurrentListTab === 'completed'
            ? 'ابھی تک کسی معتمر کی Trip مکمل نہیں ہوئی۔ فعال لسٹ میں "✓ مکمل" پر کلک کرنے سے ریکارڈ یہاں منتقل ہو جائے گا۔'
            : !tabList.length && ubCurrentListTab === 'active'
                ? 'تمام معتمرین کی Trip مکمل ہو چکی ہے۔ مکمل شدہ فہرست اوپر "مکمل شدہ عمرہ / Trip" ٹیب میں دیکھیں۔'
                : 'کوئی معتمر یا بکنگ ریکارڈ نہیں ملا جو آپ کے فلٹر سے مطابقت رکھتا ہو۔';

        const resetBtnHtml = tabList.length
            ? `<button type="button" class="btn btn-o btn-sm" onclick="resetUmrahFilters()" style="margin-inline-start:10px;">تمام ریکارڈز دکھائیں</button>`
            : '';

        tbody.innerHTML = `
            <tr>
                <td colspan="15" style="text-align:center;padding:36px 16px;color:var(--text-soft);font-size:13px;">
                    ${emptyMsg}
                    ${resetBtnHtml}
                </td>
            </tr>
        `;
        renderUmrahPagination(0, 0, 0, 1);
        updateUmrahSelectionUI();
        return;
    }

    tbody.innerHTML = pageRows.map((r, i) => renderUbRow(r, firstIdx + i + 1)).join('');
    renderUmrahPagination(filtered.length, firstIdx, lastIdx, totalPages);
    updateUmrahSelectionUI();
}

// ── DELETE SINGLE BOOKING ──
async function deleteUmrahBooking(id) {
    if (!id) return;
    const item = getCleanUmrahList().find(b => String(b.id) === String(id));
    const name = item ? item.name : 'یہ ریکارڈ';
    const ok = await showUmrahConfirm(
        `کیا آپ واقعی معتمر "${name}" کو ڈیلیٹ کرنا چاہتے ہیں؟`,
        'معتمر ڈیلیٹ کریں',
        'danger',
        'ہاں، ڈیلیٹ کریں'
    );
    if (!ok) return;

    umrahBookings = getCleanUmrahList().filter(b => String(b.id) !== String(id));
    _ubSelectedIds.delete(String(id));
    persistUmrahBookings();
    renderUmrahBookings();
}

// ── DELETE SELECTED BOOKINGS ──
async function deleteSelectedUmrahBookings() {
    if (!_ubSelectedIds.size) {
        await showUmrahAlert('ڈیلیٹ کرنے کے لیے پہلے ٹیبل سے کم از کم ایک معتمر منتخب کریں', 'انتخاب ضروری ہے', 'warning');
        return;
    }
    const list = getCleanUmrahList();
    const targetIds = new Set(Array.from(_ubSelectedIds).filter(id => list.some(b => String(b.id) === String(id))));
    if (!targetIds.size) {
        _ubSelectedIds.clear();
        updateUmrahSelectionUI();
        return;
    }
    const ok = await showUmrahConfirm(
        `کیا آپ واقعی منتخب ${targetIds.size} معتمرین کو مستقل طور پر ڈیلیٹ کرنا چاہتے ہیں؟`,
        'منتخب ریکارڈ ڈیلیٹ کریں',
        'danger',
        'ہاں، ڈیلیٹ کریں'
    );
    if (!ok) return;

    umrahBookings = list.filter(b => !targetIds.has(String(b.id)));
    targetIds.forEach(id => _ubSelectedIds.delete(id));
    persistUmrahBookings();
    renderUmrahBookings();
}

// ── CLEAR ALL BOOKINGS ──
async function clearAllUmrahBookings() {
    const list = getCleanUmrahList();
    if (!list.length) return;
    const ok = await showUmrahConfirm(
        `خبردار: کیا آپ واقعی تمام ${list.length} معتمرین کا ڈیٹا مستقل طور پر ڈیلیٹ کرنا چاہتے ہیں؟`,
        'تمام ڈیٹا ڈیلیٹ کریں',
        'danger',
        'ہاں، سب ڈیلیٹ کریں'
    );
    if (!ok) return;

    umrahBookings = [];
    _ubSelectedIds.clear();
    ubCurrentPage = 1;
    persistUmrahBookings();
    renderUmrahBookings();
}

// ── TOP HEADER DELETE BUTTON HANDLER ──
async function handleTopUmrahDelete() {
    if (_ubSelectedIds.size > 0) {
        return deleteSelectedUmrahBookings();
    }
    const list = getCleanUmrahList();
    if (!list.length) {
        await showUmrahAlert('ڈیلیٹ کرنے کے لیے کوئی ریکارڈ موجود نہیں ہے', 'اطلاع', 'info');
        return;
    }
    return clearAllUmrahBookings();
}

// ── EXPORT BOOKINGS TO EXCEL ──
async function exportUmrahBookingsToExcel() {
    const list = getCleanUmrahList();
    if (!list.length) {
        await showUmrahAlert('برآمد کرنے کے لیے کوئی ریکارڈ موجود نہیں ہے', 'اطلاع', 'warning');
        return;
    }

    if (typeof XLSX === 'undefined') {
        await showUmrahAlert('XLSX لائبریری دستیاب نہیں ہے', 'خرابی', 'danger');
        return;
    }

    const headers = [
        'سیریل نمبر',
        'Mutamer name',
        'Mutamer Age',
        'Passport Number',
        'Nationality',
        'Group Number',
        'Group Name',
        'Package Number',
        'Package Name',
        'Visa Status',
        'Biometric status',
        'Visa Number',
        'Mofa Number',
        'sequence of visits',
        'Mutamer Status',
        'Mutamer Type',
        'Trip Status'
    ];

    const dataRows = list.map((r, i) => [
        i + 1,
        r.name || '',
        r.age || '',
        r.passport || '',
        r.nationality || '',
        r.groupNo || '',
        r.groupName || '',
        r.packageNo || '',
        r.packageName || '',
        r.visaStatus || '',
        r.biometricStatus || '',
        r.visaNo || '',
        r.mofaNo || '',
        r.visitSequence || '',
        r.mutamerStatus || '',
        r.mutamerType || '',
        isUmrahTripCompleted(r) ? 'Completed' : 'Active'
    ]);

    const thinBorder = {
        top: { style: 'thin', color: { rgb: 'D0D7DE' } },
        bottom: { style: 'thin', color: { rgb: 'D0D7DE' } },
        left: { style: 'thin', color: { rgb: 'D0D7DE' } },
        right: { style: 'thin', color: { rgb: 'D0D7DE' } }
    };

    const S = {
        header: {
            font: { bold: true, sz: 11, color: { rgb: 'FFFFFF' } },
            fill: { fgColor: { rgb: '354F52' }, patternType: 'solid' },
            alignment: { horizontal: 'center', vertical: 'center' },
            border: thinBorder
        },
        dataRow: {
            border: thinBorder,
            alignment: { vertical: 'center' }
        }
    };

    const sheetRows = [
        headers.map(h => ({ v: h, t: 's', s: S.header })),
        ...dataRows.map(row => row.map(v => ({ v, t: typeof v === 'number' ? 'n' : 's', s: S.dataRow })))
    ];

    const ws = XLSX.utils.aoa_to_sheet(sheetRows.map(row => row.map(c => c.v)));
    sheetRows.forEach((row, rIdx) => {
        row.forEach((c, cIdx) => {
            if (c.s) {
                const ref = XLSX.utils.encode_cell({ r: rIdx, c: cIdx });
                if (ws[ref]) ws[ref].s = c.s;
            }
        });
    });

    ws['!cols'] = [
        { wch: 10 }, // #
        { wch: 28 }, // Name
        { wch: 14 }, // Age
        { wch: 18 }, // Passport
        { wch: 16 }, // Nationality
        { wch: 16 }, // Group No
        { wch: 24 }, // Group Name
        { wch: 16 }, // Package No
        { wch: 24 }, // Package Name
        { wch: 22 }, // Visa Status
        { wch: 18 }, // Biometric
        { wch: 18 }, // Visa No
        { wch: 18 }, // MOFA No
        { wch: 18 }, // Sequence
        { wch: 16 }, // Mutamer Status
        { wch: 15 }, // Mutamer Type
        { wch: 14 }  // Trip Status
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Nusuk Mutamers');
    const dateStr = typeof today === 'function' ? today() : new Date().toISOString().slice(0, 10);
    XLSX.writeFile(wb, `Nusuk_Mutamers_Export_${dateStr}.xlsx`);
}

// ── GLOBAL EXPOSURES ──
window.openNusukImportModal = openNusukImportModal;
window.closeNusukImportModal = closeNusukImportModal;
window.downloadNusukTemplate = downloadNusukTemplate;
window.handleNusukDragOver = handleNusukDragOver;
window.handleNusukDragLeave = handleNusukDragLeave;
window.handleNusukDrop = handleNusukDrop;
window.handleNusukFileSelect = handleNusukFileSelect;
window.processNusukFile = processNusukFile;
window.confirmNusukImport = confirmNusukImport;
window.renderUmrahBookings = renderUmrahBookings;
window.filterUmrahBookings = filterUmrahBookings;
window.onUmrahFilterChange = onUmrahFilterChange;
window.resetUmrahFilters = resetUmrahFilters;
window.switchUmrahListTab = switchUmrahListTab;
window.setUmrahPage = setUmrahPage;
window.setUmrahPageSize = setUmrahPageSize;
window.toggleUmrahTripComplete = toggleUmrahTripComplete;
window.toggleUmrahRowSelect = toggleUmrahRowSelect;
window.toggleAllUmrahSelect = toggleAllUmrahSelect;
window.selectAllFilteredUmrahBookings = selectAllFilteredUmrahBookings;
window.clearUmrahSelection = clearUmrahSelection;
window.markSelectedUmrahCompleted = markSelectedUmrahCompleted;
window.completeSelectedGroupTrips = completeSelectedGroupTrips;
window.createUmrahVoucherFromSelection = createUmrahVoucherFromSelection;
window.setUmrahIdsCompleted = setUmrahIdsCompleted;
window.getActiveUmrahBookings = getActiveUmrahBookings;
window.getCleanUmrahList = getCleanUmrahList;
window.escapeUbHtml = escapeUbHtml;
window.getUbMutamerCategory = getUbMutamerCategory;
window.getUbVisaStatusBadge = getUbVisaStatusBadge;
window.getUbMutamerTypeBadge = getUbMutamerTypeBadge;
window.deleteUmrahBooking = deleteUmrahBooking;
window.deleteSelectedUmrahBookings = deleteSelectedUmrahBookings;
window.clearAllUmrahBookings = clearAllUmrahBookings;
window.handleTopUmrahDelete = handleTopUmrahDelete;
window.exportUmrahBookingsToExcel = exportUmrahBookingsToExcel;
window.resolveUmrahDialog = resolveUmrahDialog;
window.showUmrahDialog = showUmrahDialog;
window.showUmrahConfirm = showUmrahConfirm;
window.showUmrahAlert = showUmrahAlert;
