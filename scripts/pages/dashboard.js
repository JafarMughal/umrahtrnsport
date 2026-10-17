// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  DASHBOARD (HOME PAGE) LOGIC
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

let dashTimeframe = 'all';

function setDashTimeframe(tf, btn) {
    dashTimeframe = tf;
    const parent = document.getElementById('dash-timeframe-group');
    if (parent) {
        parent.querySelectorAll('.tf-btn').forEach(b => b.classList.remove('active'));
    }
    if (btn) btn.classList.add('active');
    renderDashboard();
}

function getFilteredDataForDashboard(tf) {
    const curToday = typeof today === 'function' ? today() : new Date().toISOString().split('T')[0];
    const recs = Array.isArray(records) ? records : [];
    const pays = Array.isArray(payments) ? payments : [];
    const notes = Array.isArray(dailyNotes) ? dailyNotes : [];

    if (tf === 'today') {
        return {
            records: recs.filter(r => r.date === curToday),
            payments: pays.filter(p => p.date === curToday),
            dailyNotes: notes.filter(n => n.date === curToday)
        };
    }

    if (tf === 'week') {
        const now = new Date();
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(now.getDate() - 7);
        const cutoffStr = oneWeekAgo.toISOString().split('T')[0];

        return {
            records: recs.filter(r => (r.date || '') >= cutoffStr),
            payments: pays.filter(p => (p.date || '') >= cutoffStr),
            dailyNotes: notes.filter(n => (n.date || '') >= cutoffStr)
        };
    }

    if (tf === 'month') {
        const monthPrefix = curToday.substring(0, 7); // "YYYY-MM"
        return {
            records: recs.filter(r => (r.date || '').startsWith(monthPrefix)),
            payments: pays.filter(p => (p.date || '').startsWith(monthPrefix)),
            dailyNotes: notes.filter(n => (n.date || '').startsWith(monthPrefix))
        };
    }

    // Default: 'all'
    return { records: recs, payments: pays, dailyNotes: notes };
}

function formatDashboardDate() {
    const d = new Date();
    const curLang = typeof lang !== 'undefined' ? lang : 'ur';
    const curToday = typeof today === 'function' ? today() : d.toISOString().split('T')[0];

    try {
        if (curLang === 'ur') {
            const months = ['جنوری', 'فروری', 'مارچ', 'اپریل', 'مئی', 'جون', 'جولائی', 'اگست', 'ستمبر', 'اکتوبر', 'نومبر', 'دسمبر'];
            return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
        } else if (curLang === 'ar') {
            const monthsAr = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
            return `${d.getDate()} ${monthsAr[d.getMonth()]} ${d.getFullYear()}`;
        } else {
            return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
        }
    } catch (e) {
        return curToday;
    }
}

function renderDashboard() {
    const homePage = document.getElementById('page-home');
    if (!homePage) return;

    const curLang = typeof lang !== 'undefined' ? lang : 'ur';
    const curToday = typeof today === 'function' ? today() : new Date().toISOString().split('T')[0];
    const user = (typeof loggedInUser !== 'undefined' && loggedInUser) ? loggedInUser : 'User';

    // 1. Update Greeting & Date
    const greetingEl = document.getElementById('dash-greeting');
    if (greetingEl) {
        if (curLang === 'en') greetingEl.textContent = `Welcome back, ${user}!`;
        else if (curLang === 'ar') greetingEl.textContent = `أهلاً بك، ${user}`;
        else greetingEl.textContent = `خوش آمدید، ${user}!`;
    }

    const dateEl = document.getElementById('dash-current-date');
    if (dateEl) {
        const prefix = curLang === 'en' ? '📅 Today: ' : curLang === 'ar' ? '📅 اليوم: ' : '📅 آج: ';
        dateEl.textContent = prefix + formatDashboardDate();
    }

    // 2. Data Filtering
    const allRecs = Array.isArray(records) ? records : [];
    const allPays = Array.isArray(payments) ? payments : [];
    const allNotes = Array.isArray(dailyNotes) ? dailyNotes : [];

    const filtered = getFilteredDataForDashboard(dashTimeframe);
    const fRecs = filtered.records;
    const fPays = filtered.payments;
    const fNotes = filtered.dailyNotes;

    // Today's Stats for subtext
    const todayRecs = allRecs.filter(r => r.date === curToday);
    const todayPays = allPays.filter(p => p.date === curToday);
    const todayNotes = allNotes.filter(n => n.date === curToday);

    const todayTrips = todayRecs.length;
    const todayHujjaj = todayRecs.reduce((s, r) => s + (parseInt(r.count) || 0), 0);
    const todayBilling = todayRecs.reduce((s, r) => s + (parseFloat(r.total) || 0), 0);
    const todayPaid = todayPays.reduce((s, p) => s + (parseFloat(p.amount) || 0), 0);

    // Filtered Metrics
    const totalTrips = fRecs.length;
    const totalHujjaj = fRecs.reduce((s, r) => s + (parseInt(r.count) || 0), 0);
    const totalBilling = fRecs.reduce((s, r) => s + (parseFloat(r.total) || 0), 0);
    const totalPaid = fPays.reduce((s, p) => s + (parseFloat(p.amount) || 0), 0);
    const balanceDue = totalBilling - totalPaid;
    const totalNotes = fNotes.length;

    // 3. Update KPI Elements
    const tripsEl = document.getElementById('dash-kpi-trips');
    if (tripsEl) tripsEl.textContent = totalTrips.toLocaleString();

    const subTrips = document.getElementById('dash-sub-trips');
    if (subTrips) {
        subTrips.textContent = curLang === 'en' ? `Today: ${todayTrips} trips` : curLang === 'ar' ? `اليوم: ${todayTrips} رحلة` : `آج: ${todayTrips} سفر`;
    }

    const hujjajEl = document.getElementById('dash-kpi-hujjaj');
    if (hujjajEl) hujjajEl.textContent = totalHujjaj.toLocaleString();

    const subHujjaj = document.getElementById('dash-sub-hujjaj');
    if (subHujjaj) {
        subHujjaj.textContent = curLang === 'en' ? `Today: ${todayHujjaj} pilgrims` : curLang === 'ar' ? `اليوم: ${todayHujjaj} حاج` : `آج: ${todayHujjaj} حاجی`;
    }

    const billingEl = document.getElementById('dash-kpi-billing');
    if (billingEl) billingEl.textContent = 'SAR ' + Math.round(totalBilling).toLocaleString();

    const subBilling = document.getElementById('dash-sub-billing');
    if (subBilling) {
        subBilling.textContent = curLang === 'en' ? `Today: SAR ${Math.round(todayBilling).toLocaleString()}` : curLang === 'ar' ? `اليوم: ${Math.round(todayBilling).toLocaleString()} ريال` : `آج: SAR ${Math.round(todayBilling).toLocaleString()}`;
    }

    const paidEl = document.getElementById('dash-kpi-paid');
    if (paidEl) paidEl.textContent = 'SAR ' + Math.round(totalPaid).toLocaleString();

    const subPaid = document.getElementById('dash-sub-paid');
    if (subPaid) {
        subPaid.textContent = curLang === 'en' ? `${fPays.length} payments` : curLang === 'ar' ? `${fPays.length} دفعة` : `${fPays.length} ادائیگیاں`;
    }

    const dueEl = document.getElementById('dash-kpi-due');
    if (dueEl) {
        dueEl.textContent = 'SAR ' + Math.round(Math.abs(balanceDue)).toLocaleString();
        dueEl.style.color = balanceDue > 0 ? 'var(--red)' : balanceDue < 0 ? 'var(--accent)' : 'inherit';
    }

    const dueIcon = document.getElementById('dash-kpi-due-icon');
    const duePill = document.getElementById('dash-pill-due');
    if (duePill) {
        if (balanceDue > 0) {
            duePill.textContent = curLang === 'en' ? 'Due' : curLang === 'ar' ? 'مستحق' : 'واجب';
            duePill.className = 'kpi-pill kpi-pill-red';
            if (dueIcon) {
                dueIcon.style.color = 'var(--red)';
                dueIcon.style.background = 'rgba(220, 38, 38, 0.12)';
            }
        } else if (balanceDue < 0) {
            duePill.textContent = curLang === 'en' ? 'Surplus' : curLang === 'ar' ? 'فائض' : 'زائد';
            duePill.className = 'kpi-pill kpi-pill-teal';
            if (dueIcon) {
                dueIcon.style.color = 'var(--accent)';
                dueIcon.style.background = 'rgba(20, 125, 100, 0.12)';
            }
        } else {
            duePill.textContent = curLang === 'en' ? 'Settled' : curLang === 'ar' ? 'مسوى' : 'برابر';
            duePill.className = 'kpi-pill kpi-pill-blue';
        }
    }

    const notesEl = document.getElementById('dash-kpi-notes');
    if (notesEl) notesEl.textContent = totalNotes.toLocaleString();

    const subNotes = document.getElementById('dash-sub-notes');
    if (subNotes) {
        subNotes.textContent = curLang === 'en' ? `Today: ${todayNotes.length} notes` : curLang === 'ar' ? `اليوم: ${todayNotes.length} مذكرة` : `آج: ${todayNotes.length} نوٹس`;
    }

    // 4. Financial Progress Meter
    const pct = totalBilling > 0 ? Math.min(100, Math.round((totalPaid / totalBilling) * 100)) : (totalPaid > 0 ? 100 : 0);
    const paidPctBadge = document.getElementById('dash-paid-pct');
    if (paidPctBadge) {
        paidPctBadge.textContent = curLang === 'en' ? `${pct}% Paid` : curLang === 'ar' ? `${pct}% مدفوع` : `${pct}% ادا شدہ`;
    }
    const progressBar = document.getElementById('dash-progress-bar');
    if (progressBar) {
        progressBar.style.width = pct + '%';
    }

    const finTotal = document.getElementById('dash-fin-total');
    if (finTotal) finTotal.textContent = 'SAR ' + Math.round(totalBilling).toLocaleString();
    const finPaid = document.getElementById('dash-fin-paid');
    if (finPaid) finPaid.textContent = 'SAR ' + Math.round(totalPaid).toLocaleString();
    const finBal = document.getElementById('dash-fin-balance');
    if (finBal) finBal.textContent = 'SAR ' + Math.round(balanceDue).toLocaleString();

    // 5. Popular Sectors Breakdown
    renderDashboardSectors(fRecs, curLang);

    // 6. Recent Records Table
    renderDashboardRecentRecords(allRecs, curLang);

    // 7. Today's Scheduled Flights
    renderDashboardTodayFlights(allNotes, curToday, curLang);

    // 8. Top Transporters Leaderboard
    renderDashboardLeaderboard(allRecs, allPays, curLang);

    // 9. KSA Status Panel
    if (!ksaStatusDate) ksaStatusDate = curToday;
    renderKsaStatusPanel();
}


function renderDashboardSectors(recs, curLang) {
    const listEl = document.getElementById('dash-sectors-list');
    if (!listEl) return;

    if (!recs || recs.length === 0) {
        listEl.innerHTML = `<div class="dash-empty-state">${curLang === 'en' ? 'No sector data available' : curLang === 'ar' ? 'لا توجد بيانات للقطاعات' : 'سیکٹرز کا کوئی ڈیٹا دستیاب نہیں'}</div>`;
        return;
    }

    const counts = {};
    const hujjaj = {};
    recs.forEach(r => {
        const sec = (r.sector || (curLang === 'en' ? 'Other' : 'دیگر')).trim();
        counts[sec] = (counts[sec] || 0) + 1;
        hujjaj[sec] = (hujjaj[sec] || 0) + (parseInt(r.count) || 0);
    });

    const totalTrips = recs.length || 1;
    const sorted = Object.keys(counts).sort((a, b) => counts[b] - counts[a]).slice(0, 5);

    const colors = ['#147D64', '#0284C7', '#C9A84C', '#4f46e5', '#D97706'];

    listEl.innerHTML = sorted.map((sec, idx) => {
        const cnt = counts[sec];
        const hj = hujjaj[sec];
        const pct = Math.round((cnt / totalTrips) * 100);
        const col = colors[idx % colors.length];

        return `
            <div class="dash-sector-item">
                <div class="dash-sec-top">
                    <span class="dash-sec-name">${sec}</span>
                    <span class="dash-sec-meta">
                        <strong>${cnt}</strong> ${curLang === 'en' ? 'trips' : curLang === 'ar' ? 'رحلات' : 'سفر'}
                        (${hj} ${curLang === 'en' ? 'pilgrims' : curLang === 'ar' ? 'حاج' : 'حاجی'})
                        — <strong>${pct}%</strong>
                    </span>
                </div>
                <div class="dash-sec-bar-bg">
                    <div class="dash-sec-bar-fill" style="width: ${pct}%; background: ${col};"></div>
                </div>
            </div>
        `;
    }).join('');
}

function renderDashboardRecentRecords(allRecs, curLang) {
    const tbody = document.getElementById('dash-recent-records-body');
    if (!tbody) return;

    if (!allRecs || allRecs.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:24px;color:var(--muted);">${curLang === 'en' ? 'No records found' : curLang === 'ar' ? 'لا توجد سجلات' : 'کوئی ریکارڈ نہیں ملا'}</td></tr>`;
        return;
    }

    // Latest 7 records
    const recent = allRecs.slice().reverse().slice(0, 7);

    tbody.innerHTML = recent.map(r => {
        const isChecked = r.status === 'checked';
        const statusBadge = isChecked
            ? `<span class="dash-status-pill status-checked">✓ ${curLang === 'en' ? 'Checked' : curLang === 'ar' ? 'تم الفحص' : 'چیک شدہ'}</span>`
            : `<span class="dash-status-pill status-pending">⏳ ${curLang === 'en' ? 'Pending' : curLang === 'ar' ? 'معلق' : 'زیر التواء'}</span>`;

        const vch = r.voucher || '—';
        const dt = typeof fd === 'function' ? fd(r.date) : (r.date || '—');
        const pty = r.party || '—';
        const sec = r.sector || '—';
        const cnt = r.count || 0;
        const tot = typeof sar === 'function' ? sar(r.total) : Math.round(Number(r.total || 0)).toLocaleString();

        return `
            <tr onclick="if(typeof editRecord==='function') editRecord('${r.id}')" style="cursor:pointer;" title="${curLang === 'en' ? 'Click to view / edit' : 'دیکھنے یا ترمیم کے لیے کلک کریں'}">
                <td><strong class="text-primary">${vch}</strong></td>
                <td>${dt}</td>
                <td>${pty}</td>
                <td><span class="sector-tag">${sec}</span></td>
                <td><strong>${cnt}</strong></td>
                <td><strong>SAR ${tot}</strong></td>
                <td>${statusBadge}</td>
            </tr>
        `;
    }).join('');
}

function renderDashboardTodayFlights(allNotes, curToday, curLang) {
    const container = document.getElementById('dash-today-flights-list');
    if (!container) return;

    const todayFlights = (allNotes || []).filter(n => n.date === curToday);

    if (todayFlights.length === 0) {
        container.innerHTML = `
            <div class="dash-empty-state">
                <div style="font-size:28px; margin-bottom:8px;">✈️</div>
                <div style="font-weight:600; margin-bottom:4px;">${curLang === 'en' ? 'No flights scheduled for today' : curLang === 'ar' ? 'لا توجد رحلات مجدولة لليوم' : 'آج کوئی پرواز شیڈول نہیں ہے'}</div>
                <p style="font-size:12px; color:var(--muted); margin-bottom:12px;">${curLang === 'en' ? 'Click below to add a new daily operation note.' : 'نیا ڈیلی ٹرانسپورٹ نوٹ شامل کرنے کے لیے نیچے کلک کریں۔'}</p>
                <button type="button" class="btn btn-sm btn-p" onclick="showPage('dailynote')">
                    ➕ ${curLang === 'en' ? 'New Daily Note' : curLang === 'ar' ? 'إضافة مذكرة يومية' : 'نیا ڈیلی نوٹ درج کریں'}
                </button>
            </div>
        `;
        return;
    }

    container.innerHTML = todayFlights.map(n => {
        const timeFormatted = typeof formatTime12 === 'function' ? formatTime12(n.flightTime) : (n.flightTime || '—');
        const flightNo = n.flightNo || '—';
        const party = n.party || n.newParty || '—';
        const sector = n.sector || '—';
        const count = n.count || 0;
        const tripType = n.tripType === 'arrival' ? 'آمد (Arrival)' : n.tripType === 'return' ? 'روانگی (Return)' : 'ٹرپ';

        return `
            <div class="dash-flight-item">
                <div class="flight-item-header">
                    <span class="flight-no-badge">✈️ ${flightNo}</span>
                    <span class="flight-time-badge">⏰ ${timeFormatted}</span>
                </div>
                <div class="flight-item-body">
                    <div class="flight-party"><strong>${party}</strong> — ${sector}</div>
                    <div class="flight-meta">
                        <span>👥 <strong>${count}</strong> ${curLang === 'en' ? 'Persons' : 'حجاج'}</span>
                        <span class="flight-type-pill">${tripType}</span>
                        ${n.group ? `<span class="flight-group-pill">گروپ: ${n.group}</span>` : ''}
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function renderDashboardLeaderboard(allRecs, allPays, curLang) {
    const tbody = document.getElementById('dash-transporters-leaderboard');
    if (!tbody) return;

    const allPartiesList = Array.isArray(parties) ? parties : [];
    if (allPartiesList.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" style="text-align:center;padding:24px;color:var(--muted);">${curLang === 'en' ? 'No transporters found' : 'کوئی ٹرانسپورٹر موجود نہیں'}</td></tr>`;
        return;
    }

    // Aggregate stats by party
    const stats = {};
    allPartiesList.forEach(p => {
        stats[p] = { trips: 0, pilgrims: 0, billing: 0, paid: 0 };
    });

    (allRecs || []).forEach(r => {
        const p = (r.party || '').trim();
        if (!p) return;
        if (!stats[p]) stats[p] = { trips: 0, pilgrims: 0, billing: 0, paid: 0 };
        stats[p].trips += 1;
        stats[p].pilgrims += (parseInt(r.count) || 0);
        stats[p].billing += (parseFloat(r.total) || 0);
    });

    (allPays || []).forEach(py => {
        const p = (py.party || '').trim();
        if (!p) return;
        if (!stats[p]) stats[p] = { trips: 0, pilgrims: 0, billing: 0, paid: 0 };
        stats[p].paid += (parseFloat(py.amount) || 0);
    });

    const sortedParties = Object.keys(stats).sort((a, b) => stats[b].billing - stats[a].billing);

    tbody.innerHTML = sortedParties.map((p, idx) => {
        const s = stats[p];
        const bal = s.billing - s.paid;
        const balColor = bal > 0 ? 'var(--red)' : bal < 0 ? 'var(--accent)' : 'inherit';
        const balPrefix = bal > 0 ? (curLang === 'en' ? 'Due: ' : 'واجب: ') : bal < 0 ? (curLang === 'en' ? 'Surplus: ' : 'زائد: ') : '';

        return `
            <tr>
                <td style="font-weight:bold; color:var(--muted);">${idx + 1}</td>
                <td><strong>${p}</strong></td>
                <td>${s.trips.toLocaleString()}</td>
                <td>${s.pilgrims.toLocaleString()}</td>
                <td>SAR ${Math.round(s.billing).toLocaleString()}</td>
                <td class="text-accent">SAR ${Math.round(s.paid).toLocaleString()}</td>
                <td style="font-weight:bold; color:${balColor};">${balPrefix}SAR ${Math.round(Math.abs(bal)).toLocaleString()}</td>
                <td>
                    <button type="button" class="btn btn-sm btn-o" onclick="openPartyLedgerFromDash('${p.replace(/'/g, "\\'")}')" title="${curLang === 'en' ? 'Open Ledger' : 'لیجر کھاتہ کھولیں'}">
                        📒 ${curLang === 'en' ? 'Ledger' : 'کھاتہ'}
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

function openPartyLedgerFromDash(partyName) {
    if (typeof showPage === 'function') {
        showPage('ledger');
        setTimeout(() => {
            const partySel = document.getElementById('l-party');
            if (partySel) {
                partySel.value = partyName;
                if (typeof renderLedger === 'function') renderLedger();
            }
        }, 120);
    }
}

// ─── KSA STATUS PANEL ───────────────────────────────────────────
// transportNature values:
//   Jed Arrival     → جدہ آمد
//   MED Arrival     → مدینہ آمد
//   Jeddah Depture  → جدہ روانگی
//   Madina Depture  → مدینہ روانگی
//   Madina TO Makha → مدینہ سے مکہ (مکہ چیک ان / مدینہ چیک آؤٹ)
//   Makkah to Madina→ مکہ سے مدینہ (مدینہ چیک ان / مکہ چیک آؤٹ)
// ───────────────────────────────────────────────────────────────

let ksaStatusDate = (typeof today === 'function' ? today() : new Date().toISOString().split('T')[0]);
window.ksaStatusDate = ksaStatusDate;

function ksaChangeDate(delta) {
    const d = new Date(ksaStatusDate);
    d.setDate(d.getDate() + delta);
    ksaStatusDate = d.toISOString().split('T')[0];
    window.ksaStatusDate = ksaStatusDate;
    renderKsaStatusPanel();
}

function renderKsaStatusPanel() {
    const allRecs = Array.isArray(records) ? records : [];
    const curDate = ksaStatusDate || (typeof today === 'function' ? today() : new Date().toISOString().split('T')[0]);

    // Update date display
    const dateEl = document.getElementById('ksa-date-display');
    if (dateEl) dateEl.textContent = curDate;

    // Filter records for selected date
    const dayRecs = allRecs.filter(r => r.date === curDate);

    // Helper: sum count field for matching records
    function sumCount(recs, ...natures) {
        const lower = natures.map(n => n.toLowerCase());
        return recs.reduce((sum, r) => {
            const tn = (r.transportNature || '').toLowerCase().trim();
            const matches = lower.some(n => tn.includes(n));
            return matches ? sum + (parseInt(r.count) || 0) : sum;
        }, 0);
    }

    // Jeddah Airport
    const jedArrival   = sumCount(dayRecs, 'jed arrival', 'jeddah arrival', 'jed arr');
    const jedDeparture = sumCount(dayRecs, 'jeddah dep', 'jed dep', 'jeddah depture', 'jed depture');

    // Madina Airport
    const medArrival   = sumCount(dayRecs, 'med arrival', 'madina arrival', 'med arr');
    const medDeparture = sumCount(dayRecs, 'madina dep', 'med dep', 'madina depture', 'med depture');

    // Makkah Check-In (Madina → Makkah)
    const makkahCheckin  = sumCount(dayRecs, 'madina to mak', 'madina to makk', 'madina to makkah', 'madina to makha');
    // Makkah Check-Out (Makkah → Madina)
    const makkahCheckout = sumCount(dayRecs, 'makkah to mad', 'makkah to medina', 'makkah to madina');

    // Madina Check-In (Makkah → Madina)
    const madinaCheckin  = makkahCheckout; // same movement, different perspective
    // Madina Check-Out (Madina → Makkah)
    const madinaCheckout = makkahCheckin;

    // Currently in Makkah (cumulative: arrivals + checkins - checkouts - departures)
    // Using all records to track cumulative presence
    const allJedArr   = sumCount(allRecs.filter(r => r.date <= curDate), 'jed arrival', 'jeddah arrival', 'jed arr');
    const allMedToMak = sumCount(allRecs.filter(r => r.date <= curDate), 'madina to mak', 'madina to makk', 'madina to makkah', 'madina to makha');
    const allMakToMed = sumCount(allRecs.filter(r => r.date <= curDate), 'makkah to mad', 'makkah to medina', 'makkah to madina');
    const allJedDep   = sumCount(allRecs.filter(r => r.date <= curDate), 'jeddah dep', 'jed dep', 'jeddah depture', 'jed depture');

    const allMedArr   = sumCount(allRecs.filter(r => r.date <= curDate), 'med arrival', 'madina arrival', 'med arr');
    const allMedDep   = sumCount(allRecs.filter(r => r.date <= curDate), 'madina dep', 'med dep', 'madina depture', 'med depture');

    const inMakkah = Math.max(0, allJedArr + allMedToMak - allMakToMed - allJedDep);
    const inMadina = Math.max(0, allMedArr + allMakToMed - allMedToMak - allMedDep);

    // Render counts
    const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val.toLocaleString(); };

    set('ksa-jed-arrival',  jedArrival);
    set('ksa-jed-departure', jedDeparture);
    set('ksa-med-arrival',  medArrival);
    set('ksa-med-departure', medDeparture);
    set('ksa-mkk-checkin',  makkahCheckin);
    set('ksa-mkk-checkout', makkahCheckout);
    set('ksa-med-checkin',  madinaCheckin);
    set('ksa-med-checkout', madinaCheckout);
    set('ksa-in-makkah',    inMakkah);
    set('ksa-in-madina',    inMadina);

    // Footer note
    const totalDay = dayRecs.length;
    const footerEl = document.getElementById('ksa-footer-note');
    if (footerEl) {
        footerEl.textContent = `📊 ${curDate} — ${totalDay} ریکارڈ | transportNature فیلڈ پر مبنی`;
    }
}

// Window exposures
window.renderDashboard = renderDashboard;
window.setDashTimeframe = setDashTimeframe;
window.openPartyLedgerFromDash = openPartyLedgerFromDash;
window.ksaChangeDate = ksaChangeDate;
window.renderKsaStatusPanel = renderKsaStatusPanel;
