// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  UMRAH & NUSUK IMPORT MODULE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

let _parsedNusukRecords = [];

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

function switchUmrahTab(tabId) {
    const tabs = document.querySelectorAll('#umrah-sub-tabs .tab-btn');
    tabs.forEach(btn => btn.classList.remove('active'));
    const targetBtn = document.getElementById('umrah-tab-' + tabId);
    if (targetBtn) targetBtn.classList.add('active');

    const contents = document.querySelectorAll('.umrah-page-wrap .tab-content');
    contents.forEach(c => c.classList.remove('active'));
    const targetContent = document.getElementById('umrah-content-' + tabId);
    if (targetContent) targetContent.classList.add('active');

    if (tabId === 'booking') {
        renderUmrahBookings();
    }
}

// ── TEMPLATE DOWNLOAD ──
function downloadNusukTemplate() {
    if (typeof XLSX === 'undefined') {
        alert('XLSX لائبریری لوڈ نہیں ہو سکی');
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

// ── COLUMN LOOKUP HELPER ──
function findNusukRowValue(row, keys) {
    if (!row || typeof row !== 'object') return '';
    const rowKeys = Object.keys(row);
    for (const key of keys) {
        const target = key.toLowerCase().replace(/[\s_\-\(\)\/]/g, '');
        for (const rk of rowKeys) {
            const norm = rk.toLowerCase().replace(/[\s_\-\(\)\/]/g, '');
            if (norm === target || norm.includes(target) || target.includes(norm)) {
                return row[rk];
            }
        }
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
            const groupsSet = new Set(validRows.map(r => r.groupNo).filter(g => g && g !== '—'));
            const visasCount = validRows.filter(r => /issued|approved|مقبول|تم الإصدار/i.test(r.visaStatus) || (r.visaNo && r.visaNo !== '—')).length;
            const nationalitiesSet = new Set(validRows.map(r => r.nationality).filter(n => n && n !== '—'));
            
            let adults = 0, children = 0, infants = 0;
            validRows.forEach(r => {
                const mt = String(r.mutamerType || '').toLowerCase();
                const ag = Number(r.age);
                if (mt.includes('infant') || mt.includes('رضيع') || (ag && ag <= 2)) infants++;
                else if (mt.includes('child') || mt.includes('طفل') || (ag && ag <= 12)) children++;
                else adults++;
            });

            const elTotal = document.getElementById('nusuk-stat-total');
            if (elTotal) elTotal.textContent = validRows.length.toLocaleString();

            const elGroups = document.getElementById('nusuk-stat-groups');
            if (elGroups) elGroups.textContent = groupsSet.size.toString();

            const elVisas = document.getElementById('nusuk-stat-visas');
            if (elVisas) elVisas.textContent = visasCount.toLocaleString();

            const elNats = document.getElementById('nusuk-stat-nationalities');
            if (elNats) elNats.textContent = nationalitiesSet.size.toString();

            const elPax = document.getElementById('nusuk-stat-pax');
            if (elPax) elPax.textContent = `${adults} / ${children} / ${infants}`;

            const elCount = document.getElementById('nusuk-preview-count');
            if (elCount) elCount.textContent = `(کل ${validRows.length} ریکارڈز میں سے پہلے 50 دکھائے جا رہے ہیں)`;

            // Render table preview
            const tbody = document.getElementById('nusuk-preview-tbody');
            if (tbody) {
                const previewRows = validRows.slice(0, 50);
                tbody.innerHTML = previewRows.map((r, i) => {
                    const isIssued = /issued|approved|مقبول|تم الإصدار/i.test(r.visaStatus);
                    const statusBadge = isIssued 
                        ? `<span class="badge" style="background:#e8f5e9;color:#2e7d32;padding:2px 8px;border-radius:12px;font-size:11px;">${r.visaStatus}</span>`
                        : `<span class="badge" style="background:#fff3e0;color:#e65100;padding:2px 8px;border-radius:12px;font-size:11px;">${r.visaStatus || 'Under Process'}</span>`;

                    return `
                        <tr style="border-bottom:1px solid var(--border);">
                            <td style="padding:6px 8px;text-align:center;color:var(--text-soft);">${i + 1}</td>
                            <td style="padding:6px 8px;font-weight:600;color:var(--text);">${r.name}</td>
                            <td style="padding:6px 8px;text-align:center;">${r.age}</td>
                            <td style="padding:6px 8px;text-align:center;font-family:monospace;font-weight:600;">${r.passport}</td>
                            <td style="padding:6px 8px;">${r.nationality}</td>
                            <td style="padding:6px 8px;text-align:center;">${r.groupNo}</td>
                            <td style="padding:6px 8px;">${r.packageName || r.packageNo}</td>
                            <td style="padding:6px 8px;text-align:center;">${statusBadge}</td>
                            <td style="padding:6px 8px;text-align:center;font-family:monospace;">${r.visaNo}</td>
                            <td style="padding:6px 8px;text-align:center;font-family:monospace;">${r.mofaNo}</td>
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

// ── CONFIRM & SAVE IMPORT ──
function confirmNusukImport() {
    if (!_parsedNusukRecords || !_parsedNusukRecords.length) {
        alert('امپورٹ کرنے کے لیے کوئی ریکارڈ موجود نہیں ہے');
        return;
    }

    const modeInput = document.querySelector('input[name="nusuk-import-mode"]:checked');
    const mode = modeInput ? modeInput.value : 'append';

    if (mode === 'replace') {
        const ok = confirm(`کیا آپ واقعی پرانا تمام معتمرین ڈیٹا ختم کر کے یہ ${_parsedNusukRecords.length} نئے ریکارڈز رکھنا چاہتے ہیں؟`);
        if (!ok) return;
        umrahBookings = [..._parsedNusukRecords];
    } else {
        const existingPassports = new Set((umrahBookings || []).map(b => String(b.passport || '').trim().toUpperCase()).filter(p => p && p !== '—'));

        _parsedNusukRecords.forEach(rec => {
            const pKey = String(rec.passport || '').trim().toUpperCase();
            if (pKey && pKey !== '—' && existingPassports.has(pKey)) {
                const existingIdx = umrahBookings.findIndex(b => String(b.passport || '').trim().toUpperCase() === pKey);
                if (existingIdx !== -1) {
                    umrahBookings[existingIdx] = { ...umrahBookings[existingIdx], ...rec };
                } else {
                    umrahBookings.push(rec);
                }
            } else {
                umrahBookings.push(rec);
                if (pKey && pKey !== '—') existingPassports.add(pKey);
            }
        });
    }

    // Save immediately to LocalStorage and Firebase
    try {
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem('uts_umrahBookings', JSON.stringify(umrahBookings));
        }
    } catch (e) { console.warn('LocalStorage save error:', e); }

    if (typeof svUB === 'function') {
        svUB();
    } else if (typeof _safeFbSet === 'function') {
        _safeFbSet('umrahBookings', umrahBookings);
    }

    const importedCount = _parsedNusukRecords.length;
    closeNusukImportModal();
    renderUmrahBookings();

    alert(`کامیابی: نسک شیٹ سے ${importedCount} معتمرین کا ڈیٹا کامیابی سے امپورٹ اور محفوظ کر دیا گیا ہے!`);
}

// ── RENDER BOOKINGS ON PAGE ──
function renderUmrahBookings() {
    // Fallback: If memory is empty, recover from LocalStorage
    if ((!umrahBookings || !umrahBookings.length) && typeof localStorage !== 'undefined') {
        try {
            const cached = JSON.parse(localStorage.getItem('uts_umrahBookings') || '[]');
            if (cached && Array.isArray(cached) && cached.length > 0) {
                umrahBookings = cached;
            }
        } catch (e) { }
    }

    const list = umrahBookings || [];
    const totalCount = list.length;

    // Update KPI counters
    const elKpiTotal = document.getElementById('ub-kpi-total');
    if (elKpiTotal) elKpiTotal.textContent = totalCount.toLocaleString();

    const groupsSet = new Set(list.map(r => r && r.groupNo).filter(g => g && g !== '—'));
    const elKpiGroups = document.getElementById('ub-kpi-groups');
    if (elKpiGroups) elKpiGroups.textContent = groupsSet.size.toString();

    const visasCount = list.filter(r => {
        if (!r) return false;
        const vs = String(r.visaStatus || '');
        const vn = String(r.visaNo || '');
        return /issued|approved|مقبول|تم الإصدار/i.test(vs) || (vn && vn !== '—');
    }).length;
    const elKpiVisas = document.getElementById('ub-kpi-visas');
    if (elKpiVisas) elKpiVisas.textContent = visasCount.toLocaleString();

    let adults = 0, children = 0, infants = 0;
    list.forEach(r => {
        if (!r) return;
        const mt = String(r.mutamerType || '').toLowerCase();
        const ag = Number(r.age);
        if (mt.includes('infant') || mt.includes('رضيع') || (ag && ag <= 2)) infants++;
        else if (mt.includes('child') || mt.includes('طفل') || (ag && ag <= 12)) children++;
        else adults++;
    });
    const elKpiPax = document.getElementById('ub-kpi-pax');
    if (elKpiPax) elKpiPax.textContent = `${adults} / ${children} / ${infants}`;

    // Populate filter dropdowns
    populateUmrahDropdowns();

    // Filter and render table
    filterUmrahBookings();
}

// ── POPULATE FILTER DROPDOWNS ──
function populateUmrahDropdowns() {
    const groupSelect = document.getElementById('ub-filter-group');
    const natSelect = document.getElementById('ub-filter-nationality');
    const statusSelect = document.getElementById('ub-filter-status');

    if (!groupSelect || !natSelect || !statusSelect) return;

    const curGroup = groupSelect.value;
    const curNat = natSelect.value;
    const curStatus = statusSelect.value;

    const list = umrahBookings || [];

    // Groups
    const groupMap = new Map();
    list.forEach(r => {
        if (!r) return;
        const gNo = String(r.groupNo || '').trim();
        const gName = String(r.groupName || '').trim();
        if (gNo && gNo !== '—') {
            const label = gName && gName !== '—' && gName !== gNo ? `${gNo} (${gName})` : gNo;
            groupMap.set(gNo, label);
        }
    });
    let groupHtml = '<option value="">تمام گروپس (All Groups)</option>';
    groupMap.forEach((label, gKey) => {
        groupHtml += `<option value="${gKey}" ${gKey === curGroup ? 'selected' : ''}>${label}</option>`;
    });
    groupSelect.innerHTML = groupHtml;

    // Nationalities
    const nationalities = Array.from(new Set(list.map(r => r && String(r.nationality || '').trim()).filter(n => n && n !== '—'))).sort();
    let natHtml = '<option value="">تمام قومیتیں (All Nationalities)</option>';
    nationalities.forEach(n => {
        natHtml += `<option value="${n}" ${n === curNat ? 'selected' : ''}>${n}</option>`;
    });
    natSelect.innerHTML = natHtml;

    // Visa statuses
    const statuses = Array.from(new Set(list.map(r => r && String(r.visaStatus || '').trim()).filter(s => s && s !== '—'))).sort();
    let statHtml = '<option value="">تمام اسٹیٹس (All Statuses)</option>';
    statuses.forEach(s => {
        statHtml += `<option value="${s}" ${s === curStatus ? 'selected' : ''}>${s}</option>`;
    });
    statusSelect.innerHTML = statHtml;
}

// ── FILTER & DISPLAY BOOKINGS DIRECTLY INTO #ub-container ──
function filterUmrahBookings() {
    const list = umrahBookings || [];
    const container = document.getElementById('ub-container');
    const clearBtn = document.getElementById('btn-nusuk-clear');

    if (clearBtn) {
        clearBtn.style.display = list.length > 0 ? 'inline-flex' : 'none';
    }

    if (!container) return;

    if (!list.length) {
        container.innerHTML = `
            <div id="ub-empty-state" style="background:var(--surface-alt, rgba(0,0,0,0.02));border:1px dashed var(--border);border-radius:12px;padding:48px 24px;text-align:center;">
                <div style="font-size:42px;margin-bottom:12px;">🕋</div>
                <h3 style="margin:0 0 6px 0;font-size:18px;color:var(--primary);">کوئی عمرہ بکنگ یا معتمرین ڈیٹا موجود نہیں ہے</h3>
                <p style="margin:0 0 18px 0;color:var(--muted);font-size:13px;max-width:520px;margin-inline:auto;">
                    Nusuk پورٹل سے حاصل کردہ ایکسل فائل براہِ راست امپورٹ کریں تاکہ معتمرین کے نام، پاسپورٹ، ویزا اور گروپس کی تفصیلات یہاں خودکار طور پر آ جائیں۔
                </p>
                <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;">
                    <button type="button" class="btn btn-p" onclick="openNusukImportModal()" style="display:inline-flex;align-items:center;gap:8px;padding:10px 22px;font-size:14px;font-weight:600;">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                            <polyline points="17 8 12 3 7 8"/>
                            <line x1="12" y1="3" x2="12" y2="15"/>
                        </svg>
                        <span>Nusuk Import (ایکسل امپورٹ کریں)</span>
                    </button>
                    <button type="button" class="btn btn-o" onclick="downloadNusukTemplate()" style="display:inline-flex;align-items:center;gap:6px;font-size:13px;">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                        <span>سیمپل ٹیمپلیٹ ڈاؤنلوڈ کریں</span>
                    </button>
                </div>
            </div>
        `;
        return;
    }

    const search = ((document.getElementById('ub-search-input')?.value) || '').trim().toLowerCase();
    const groupVal = (document.getElementById('ub-filter-group')?.value) || '';
    const natVal = (document.getElementById('ub-filter-nationality')?.value) || '';
    const statusVal = (document.getElementById('ub-filter-status')?.value) || '';

    const filtered = list.filter(r => {
        if (!r) return false;
        if (groupVal && String(r.groupNo || '') !== groupVal) return false;
        if (natVal && String(r.nationality || '') !== natVal) return false;
        if (statusVal && String(r.visaStatus || '') !== statusVal) return false;

        if (search) {
            const sName = String(r.name || '').toLowerCase();
            const sPass = String(r.passport || '').toLowerCase();
            const sVisa = String(r.visaNo || '').toLowerCase();
            const sMofa = String(r.mofaNo || '').toLowerCase();
            const sGroup = String(r.groupNo || '').toLowerCase() + ' ' + String(r.groupName || '').toLowerCase();
            const sPkg = String(r.packageName || '').toLowerCase();
            if (!sName.includes(search) && !sPass.includes(search) && !sVisa.includes(search) &&
                !sMofa.includes(search) && !sGroup.includes(search) && !sPkg.includes(search)) {
                return false;
            }
        }
        return true;
    });

    let tableRowsHtml = '';
    if (!filtered.length) {
        tableRowsHtml = `
            <tr>
                <td colspan="13" style="text-align:center;padding:36px 16px;color:var(--text-soft);font-size:13px;">
                    کوئی معتمر یا بکنگ ریکارڈ نہیں ملا جو آپ کے فلٹر سے مطابقت رکھتا ہو۔
                </td>
            </tr>
        `;
    } else {
        tableRowsHtml = filtered.map((r, i) => {
            const visa = String(r.visaStatus || '').trim();
            const isIssued = /issued|approved|مقبول|تم الإصدار/i.test(visa);
            const isPending = /process|pending|تحت|انتظار/i.test(visa) || !visa || visa === '—';
            let statusBadge = '';
            if (isIssued) {
                statusBadge = `<span class="badge" style="background:rgba(34,197,94,0.12);color:#16a34a;padding:3px 8px;border-radius:12px;font-size:11.5px;font-weight:600;">${visa}</span>`;
            } else if (isPending) {
                statusBadge = `<span class="badge" style="background:rgba(234,179,8,0.12);color:#ca8a04;padding:3px 8px;border-radius:12px;font-size:11.5px;font-weight:600;">${visa || 'Under Process'}</span>`;
            } else {
                statusBadge = `<span class="badge" style="background:rgba(239,68,68,0.12);color:#dc2626;padding:3px 8px;border-radius:12px;font-size:11.5px;font-weight:600;">${visa}</span>`;
            }

            const mType = String(r.mutamerType || '').toLowerCase();
            const ageNum = Number(r.age);
            let typeBadge = '';
            if (mType.includes('infant') || mType.includes('رضيع') || (ageNum && ageNum <= 2)) {
                typeBadge = `<span style="font-size:11px;background:#fce4ec;color:#c2185b;padding:2px 6px;border-radius:10px;">شیرخوار</span>`;
            } else if (mType.includes('child') || mType.includes('طفل') || (ageNum && ageNum <= 12)) {
                typeBadge = `<span style="font-size:11px;background:#e3f2fd;color:#1565c0;padding:2px 6px;border-radius:10px;">بچہ</span>`;
            } else {
                typeBadge = `<span style="font-size:11px;background:#e8f5e9;color:#2e7d32;padding:2px 6px;border-radius:10px;">بالغ</span>`;
            }

            const bio = String(r.biometricStatus || '').trim();
            const bioBadge = /complete|yes|enrolled|مکمل|تم/i.test(bio)
                ? `<span style="color:#16a34a;font-weight:600;font-size:12px;">✓ ${bio}</span>`
                : `<span style="color:var(--text-soft);font-size:12px;">${bio || '—'}</span>`;

            return `
                <tr style="border-bottom:1px solid var(--border);">
                    <td style="padding:10px 12px;text-align:center;color:var(--text-soft);font-weight:600;">${i + 1}</td>
                    <td style="padding:10px 12px;font-weight:700;color:var(--text);">
                        <div style="font-size:13px;">${r.name || '—'}</div>
                        <div style="font-size:11.5px;color:var(--text-soft);margin-top:2px;">${r.mutamerStatus || ''}</div>
                    </td>
                    <td style="padding:10px 12px;text-align:center;">
                        <div style="font-weight:600;font-size:12.5px;">${r.age !== '' ? r.age : '—'}</div>
                        <div style="margin-top:2px;">${typeBadge}</div>
                    </td>
                    <td style="padding:10px 12px;text-align:center;font-family:monospace;font-weight:700;letter-spacing:0.5px;color:var(--primary);">${r.passport || '—'}</td>
                    <td style="padding:10px 12px;text-align:center;">
                        <span style="display:inline-block;padding:2px 8px;border-radius:6px;background:var(--surface-alt);border:1px solid var(--border);font-size:12px;">${r.nationality || '—'}</span>
                    </td>
                    <td style="padding:10px 12px;">
                        <div style="font-weight:600;font-size:12.5px;">${r.groupNo || '—'}</div>
                        <div style="font-size:11.5px;color:var(--text-soft);">${r.groupName && r.groupName !== r.groupNo ? r.groupName : ''}</div>
                    </td>
                    <td style="padding:10px 12px;">
                        <div style="font-size:12px;">${r.packageName && r.packageName !== '—' ? r.packageName : (r.packageNo || '—')}</div>
                    </td>
                    <td style="padding:10px 12px;text-align:center;">${statusBadge}</td>
                    <td style="padding:10px 12px;text-align:center;font-family:monospace;font-size:12px;">${r.visaNo || '—'}</td>
                    <td style="padding:10px 12px;text-align:center;font-family:monospace;font-size:12px;">${r.mofaNo || '—'}</td>
                    <td style="padding:10px 12px;text-align:center;">${bioBadge}</td>
                    <td style="padding:10px 12px;text-align:center;">
                        <span style="font-size:11.5px;color:var(--text-soft);">${r.mutamerStatus || 'Active'}</span>
                    </td>
                    <td style="padding:10px 12px;text-align:center;">
                        <button type="button" class="btn btn-o btn-sm" onclick="deleteUmrahBooking('${r.id}')" title="ڈیلیٹ کریں" style="padding:4px 8px;color:var(--red,#dc2626);border-color:transparent;background:transparent;cursor:pointer;">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="3 6 5 6 21 6"/>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                            </svg>
                        </button>
                    </td>
                </tr>
            `;
        }).join('');
    }

    container.innerHTML = `
        <div id="ub-table-section" style="display:block;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
                <div style="font-size:13px;font-weight:600;color:var(--text);" id="ub-table-count">دکھائے جا رہے ریکارڈز: ${filtered.length} (مجموعی: ${list.length})</div>
            </div>
            <div class="tbl-wrap" style="overflow-x:auto;border:1px solid var(--border);border-radius:10px;">
                <table style="width:100%;border-collapse:collapse;font-size:12.5px;min-width:1000px;" id="ub-table">
                    <thead>
                        <tr style="background:var(--surface-alt);border-bottom:1px solid var(--border);">
                            <th style="padding:10px 12px;text-align:center;width:45px;">#</th>
                            <th style="padding:10px 12px;text-align:start;">معتمر کا نام (Mutamer Name)</th>
                            <th style="padding:10px 12px;text-align:center;">عمر / نوعیت</th>
                            <th style="padding:10px 12px;text-align:center;">پاسپورٹ نمبر</th>
                            <th style="padding:10px 12px;text-align:center;">قومیت</th>
                            <th style="padding:10px 12px;text-align:start;">گروپ (نمبر و نام)</th>
                            <th style="padding:10px 12px;text-align:start;">پیکیج</th>
                            <th style="padding:10px 12px;text-align:center;">ویزا اسٹیٹس</th>
                            <th style="padding:10px 12px;text-align:center;">ویزا نمبر</th>
                            <th style="padding:10px 12px;text-align:center;">موفا نمبر</th>
                            <th style="padding:10px 12px;text-align:center;">بائیو میٹرک</th>
                            <th style="padding:10px 12px;text-align:center;">اسٹیٹس</th>
                            <th style="padding:10px 12px;text-align:center;width:60px;">ایکشن</th>
                        </tr>
                    </thead>
                    <tbody id="ub-tbody">
                        ${tableRowsHtml}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

// ── DELETE SINGLE BOOKING ──
function deleteUmrahBooking(id) {
    if (!id) return;
    const item = (umrahBookings || []).find(b => b && b.id === id);
    const name = item ? item.name : 'یہ ریکارڈ';
    const ok = confirm(`کیا آپ واقعی معتمر "${name}" کو ڈیلیٹ کرنا چاہتے ہیں؟`);
    if (!ok) return;

    umrahBookings = (umrahBookings || []).filter(b => b && b.id !== id);
    try {
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem('uts_umrahBookings', JSON.stringify(umrahBookings));
        }
    } catch (e) { }

    if (typeof svUB === 'function') svUB();
    else if (typeof _safeFbSet === 'function') _safeFbSet('umrahBookings', umrahBookings);

    renderUmrahBookings();
}

// ── CLEAR ALL BOOKINGS ──
function clearAllUmrahBookings() {
    if (!umrahBookings || !umrahBookings.length) return;
    const ok = confirm(`کیا آپ واقعی تمام ${umrahBookings.length} معتمرین کا ڈیٹا ختم کرنا چاہتے ہیں؟`);
    if (!ok) return;

    umrahBookings = [];
    try {
        if (typeof localStorage !== 'undefined') {
            localStorage.removeItem('uts_umrahBookings');
        }
    } catch (e) { }

    if (typeof svUB === 'function') svUB();
    else if (typeof _safeFbSet === 'function') _safeFbSet('umrahBookings', umrahBookings);

    renderUmrahBookings();
}

// ── EXPORT BOOKINGS TO EXCEL ──
function exportUmrahBookingsToExcel() {
    const list = umrahBookings || [];
    if (!list.length) {
        alert('برآمد کرنے کے لیے کوئی ریکارڈ موجود نہیں ہے');
        return;
    }

    if (typeof XLSX === 'undefined') {
        alert('XLSX لائبریری دستیاب نہیں ہے');
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
        'Mutamer Type'
    ];

    const dataRows = list.map((r, i) => [
        i + 1,
        r ? (r.name || '') : '',
        r ? (r.age || '') : '',
        r ? (r.passport || '') : '',
        r ? (r.nationality || '') : '',
        r ? (r.groupNo || '') : '',
        r ? (r.groupName || '') : '',
        r ? (r.packageNo || '') : '',
        r ? (r.packageName || '') : '',
        r ? (r.visaStatus || '') : '',
        r ? (r.biometricStatus || '') : '',
        r ? (r.visaNo || '') : '',
        r ? (r.mofaNo || '') : '',
        r ? (r.visitSequence || '') : '',
        r ? (r.mutamerStatus || '') : '',
        r ? (r.mutamerType || '') : ''
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
        { wch: 15 }  // Mutamer Type
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Nusuk Mutamers');
    const dateStr = typeof today === 'function' ? today() : new Date().toISOString().slice(0, 10);
    XLSX.writeFile(wb, `Nusuk_Mutamers_Export_${dateStr}.xlsx`);
}

// ── GLOBAL EXPOSURES ──
window.openNusukImportModal = openNusukImportModal;
window.closeNusukImportModal = closeNusukImportModal;
window.switchUmrahTab = switchUmrahTab;
window.downloadNusukTemplate = downloadNusukTemplate;
window.handleNusukDragOver = handleNusukDragOver;
window.handleNusukDragLeave = handleNusukDragLeave;
window.handleNusukDrop = handleNusukDrop;
window.handleNusukFileSelect = handleNusukFileSelect;
window.processNusukFile = processNusukFile;
window.confirmNusukImport = confirmNusukImport;
window.renderUmrahBookings = renderUmrahBookings;
window.filterUmrahBookings = filterUmrahBookings;
window.deleteUmrahBooking = deleteUmrahBooking;
window.clearAllUmrahBookings = clearAllUmrahBookings;
window.exportUmrahBookingsToExcel = exportUmrahBookingsToExcel;
