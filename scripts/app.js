// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  FIREBASE INIT & SMART QUOTA-SAVER SYNC ENGINE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const _LEGACY_HAJI_NAMES = new Set([
    'القریشی ٹورز', 'الرحمان ٹریولز', 'الحرمین ٹورز اینڈ ٹریولز', 'ضیوف الرحمن گروپ',
    'المروہ ٹریولز', 'الصفا عمرہ گروپ', 'کاروان فیصل', 'کاروان مدینہ',
    'لبیک ٹورز اینڈ ٹریولز', 'باب الحرم ٹریولز', 'نور الہدیٰ ٹورز', 'قافلہ حرمین'
]);

let _loadDataPromise = null;
let _appBootDone = false;
let _metaListenerRef = null;
let _metaListenerHandler = null;

function _toFbArray(v) {
    return Array.isArray(v) ? v : (v && typeof v === 'object' ? Object.values(v) : []);
}

function _hasStorageNode(node) {
    try {
        return typeof localStorage !== 'undefined' && localStorage.getItem('uts_' + node) !== null;
    } catch (e) {
        return false;
    }
}

function _defaultShirkasList() {
    if (typeof DEFAULT_SHIRKAS !== 'undefined' && Array.isArray(DEFAULT_SHIRKAS)) {
        return [...DEFAULT_SHIRKAS];
    }
    return [
        'الرواد', 'الشہداء', 'المختار', 'الدولية', 'ضيوف الرحمن',
        'العالمية', 'رواحل', 'سماء المشاعر', 'قافلة الإيمان', 'دلہ',
        'سدرہ', 'مواسم', 'انوار الحرمین', 'فنادق الہدایہ', 'دار الایمان'
    ];
}

function _defaultNaturesList() {
    return ['Jed Arrival', 'MED Arrival', 'Makkah to Madina', 'Madina TO Makha', 'Jeddah Depture', 'Madina Depture'];
}

function _applySingleFbNode(node, rawVal, { isRemote = false, serverTs = 0, mergeRecords = false } = {}) {
    let normalizedVal = rawVal;

    switch (node) {
        case 'records': {
            const incoming = _toFbArray(rawVal);
            if (mergeRecords && Array.isArray(records) && records.length && typeof isFbNodeDirty === 'function' && isFbNodeDirty('records')) {
                const fbIds = new Set(incoming.map(r => r && r.id));
                const localOnly = records.filter(r => r && !fbIds.has(r.id));
                records = localOnly.length ? [...incoming, ...localOnly] : incoming;
            } else {
                records = incoming;
            }
            normalizedVal = records;
            break;
        }
        case 'deletedRecords':
            deletedRecords = _toFbArray(rawVal);
            normalizedVal = deletedRecords;
            break;
        case 'payments':
            payments = _toFbArray(rawVal);
            normalizedVal = payments;
            break;
        case 'parties':
            parties = _toFbArray(rawVal);
            normalizedVal = parties;
            break;
        case 'sectors':
            sectors = _toFbArray(rawVal);
            normalizedVal = sectors;
            break;
        case 'shirkas':
            shirkas = _toFbArray(rawVal);
            normalizedVal = shirkas;
            break;
        case 'transports':
            transports = _toFbArray(rawVal);
            normalizedVal = transports;
            break;
        case 'vehicleRates':
            vehicleRates = _toFbArray(rawVal);
            normalizedVal = vehicleRates;
            break;
        case 'transportNatures':
            transportNatures = _toFbArray(rawVal);
            normalizedVal = transportNatures;
            break;
        case 'partyCodes':
            partyCodes = (rawVal && typeof rawVal === 'object' && !Array.isArray(rawVal)) ? rawVal : {};
            normalizedVal = partyCodes;
            break;
        case 'users': {
            const nextUsers = _toFbArray(rawVal);
            users = nextUsers.length
                ? nextUsers
                : [{ username: 'admin', role: 'superadmin', disabled: false, createdAt: '2024-01-01', createdBy: 'system' }];
            normalizedVal = users;
            break;
        }
        case 'dailyNotes':
            dailyNotes = _toFbArray(rawVal);
            normalizedVal = dailyNotes;
            break;
        case 'hajiParties':
            hajiParties = _toFbArray(rawVal);
            normalizedVal = hajiParties;
            break;
        case 'umrahBookings': {
            const nextUB = _toFbArray(rawVal);
            if (!nextUB.length && (rawVal === undefined || rawVal === null)) {
                try {
                    const localUB = JSON.parse(localStorage.getItem('uts_umrahBookings') || '[]');
                    if (Array.isArray(localUB) && localUB.length > 0 && !localStorage.getItem('uts_fb_has_cache')) {
                        umrahBookings = localUB;
                        normalizedVal = umrahBookings;
                        if (typeof svUB === 'function') svUB();
                        return;
                    }
                } catch (e) { }
            }
            umrahBookings = nextUB;
            normalizedVal = umrahBookings;
            break;
        }
        case 'umrahVouchers': {
            const nextUV = _toFbArray(rawVal);
            if (!nextUV.length && (rawVal === undefined || rawVal === null)) {
                try {
                    const localUV = JSON.parse(localStorage.getItem('uts_umrahVouchers') || '[]');
                    if (Array.isArray(localUV) && localUV.length > 0 && !localStorage.getItem('uts_fb_has_cache')) {
                        umrahVouchers = localUV;
                        normalizedVal = umrahVouchers;
                        if (typeof svUV === 'function') svUV();
                        return;
                    }
                } catch (e) { }
            }
            umrahVouchers = nextUV;
            normalizedVal = umrahVouchers;
            break;
        }
        case 'rolePermissions':
            if (rawVal && typeof rawVal === 'object') {
                if (typeof applyGranularPerms === 'function') applyGranularPerms(rawVal);
                normalizedVal = rolePermissions;
            } else {
                normalizedVal = rolePermissions;
            }
            break;
        case 'settings': {
            const s = (rawVal && typeof rawVal === 'object') ? rawVal : {};
            fbLogo = s.logo || null;
            fbAppName = s.appName || {};
            fbAppSub = s.appSub || {};
            normalizedVal = { logo: fbLogo || null, appName: fbAppName || {}, appSub: fbAppSub || {} };
            break;
        }
        default:
            return;
    }

    if (isRemote && typeof markFbNodeSynced === 'function') {
        markFbNodeSynced(node, normalizedVal, serverTs);
    }
}

function hydrateAllFromLocalCache() {
    const nodes = typeof FB_SYNC_NODES !== 'undefined' ? FB_SYNC_NODES : [
        'records', 'deletedRecords', 'payments', 'parties', 'sectors', 'shirkas',
        'transports', 'vehicleRates', 'transportNatures', 'partyCodes', 'users',
        'dailyNotes', 'hajiParties', 'umrahBookings', 'umrahVouchers',
        'rolePermissions', 'settings'
    ];
    let foundAny = false;
    nodes.forEach(node => {
        try {
            const raw = localStorage.getItem('uts_' + node);
            if (raw !== null) {
                foundAny = true;
                const parsed = JSON.parse(raw);
                _applySingleFbNode(node, parsed, { isRemote: false });
                if (typeof seedLastSyncedFromCache === 'function') {
                    seedLastSyncedFromCache(node, raw);
                }
            }
        } catch (e) { }
    });
    const explicitlyCached = (() => {
        try { return localStorage.getItem('uts_fb_has_cache') === '1'; } catch (e) { return false; }
    })();
    return explicitlyCached || foundAny;
}

function _applyDefaultsAndCleanup(allowWrite) {
    const L = (typeof T !== 'undefined' && (T[lang] || T.ur)) ? (T[lang] || T.ur) : { defaultParties: [], defaultSectors: [] };

    if (!parties || !parties.length) {
        parties = (L.defaultParties || []).slice();
        if (allowWrite && typeof svP === 'function') svP();
    }
    if (!sectors || !sectors.length) {
        sectors = (L.defaultSectors || []).slice();
        if (allowWrite && typeof svS === 'function') svS();
    }
    if (!transports || !transports.length) {
        transports = ['بس', 'وین', 'کار', 'کوچ'];
        if (allowWrite && typeof svTr === 'function') svTr();
    }
    if (!transportNatures || !transportNatures.length) {
        const saved = (records || []).map(r => r && r.transportNature).filter(Boolean);
        transportNatures = Array.from(new Set([..._defaultNaturesList(), ...saved]));
        if (allowWrite && typeof svTN === 'function') svTN();
    }
    if (!shirkas || !shirkas.length) {
        const saved = (records || []).map(r => r && r.shirka).filter(Boolean);
        shirkas = Array.from(new Set([..._defaultShirkasList(), ...saved]));
        if (allowWrite && typeof svSh === 'function') svSh();
    }

    if (typeof getCode === 'function') {
        parties.forEach(p => getCode(p));
    }

    const cleanedHp = (hajiParties || []).filter(hp => !_LEGACY_HAJI_NAMES.has(hp));
    if (cleanedHp.length !== (hajiParties || []).length) {
        hajiParties = cleanedHp;
        if (allowWrite && typeof svHP === 'function') svHP();
    } else if ((!hajiParties || !hajiParties.length) && Array.isArray(records) && records.length > 0) {
        const hSet = new Set();
        records.forEach(r => {
            if (r && r.newParty) {
                r.newParty.split(',').map(s => s.trim()).filter(Boolean).forEach(s => {
                    if (!_LEGACY_HAJI_NAMES.has(s)) hSet.add(s);
                });
            }
        });
        hajiParties = Array.from(hSet);
        if (hajiParties.length && allowWrite && typeof svHP === 'function') svHP();
    }
}

function _refreshUiAfterNodes(changedNodes = null) {
    const allChanged = !changedNodes || changedNodes.size === 0;
    const has = (n) => allChanged || changedNodes.has(n);

    if (has('settings')) {
        if (typeof applyLogo === 'function') applyLogo(fbLogo);
        if (typeof loadAppName === 'function') loadAppName(lang);
    }
    if (has('parties') || has('sectors') || has('transports') || has('shirkas') || has('hajiParties') || has('transportNatures') || has('partyCodes')) {
        if (typeof refreshAllDrops === 'function') refreshAllDrops();
    }

    const activePage = typeof document !== 'undefined' ? document.querySelector('.page.active') : null;
    if (activePage) {
        if (activePage.id === 'page-home' && typeof renderDashboard === 'function') renderDashboard();
        if (activePage.id === 'page-entry') {
            if (typeof todayStats === 'function') todayStats();
            if (typeof fillTransportNatureDropdown === 'function') fillTransportNatureDropdown();
        }
        if (activePage.id === 'page-payment' && typeof renderPayments === 'function') renderPayments();
        if (activePage.id === 'page-ledger' && typeof renderLedger === 'function') renderLedger();
        if (activePage.id === 'page-records') {
            if (typeof initRecordsPage === 'function') initRecordsPage();
            else if (typeof filterRecords === 'function') filterRecords();
        }
        if (activePage.id === 'page-dailynote') {
            if (typeof fillTransportNatureDropdown === 'function') fillTransportNatureDropdown();
            if (typeof renderDailyNoteReport === 'function') renderDailyNoteReport();
        }
        if (activePage.id === 'page-report' && typeof genReport === 'function') genReport();
        if (activePage.id === 'page-admin' && typeof renderAdminPanel === 'function') renderAdminPanel();
        if (activePage.id === 'page-umrah') {
            if (has('umrahBookings') && typeof renderUmrahBookings === 'function') renderUmrahBookings();
            if ((has('umrahVouchers') || has('umrahBookings')) && typeof renderUmrahVouchers === 'function') renderUmrahVouchers();
        }
        if (activePage.id === 'page-settings') {
            if (typeof renderRateList === 'function') renderRateList();
            if (typeof renderPartyList === 'function') renderPartyList();
            if (typeof renderSectorList === 'function') renderSectorList();
            if (typeof renderTransportList === 'function') renderTransportList();
            if (typeof renderNatureList === 'function') renderNatureList();
            if (typeof renderShirkaList === 'function') renderShirkaList();
            if (typeof renderHajiPartyList === 'function') renderHajiPartyList();
        }
        if (activePage.id === 'page-ksa-detail' && typeof onKsaDetailPageShow === 'function') {
            onKsaDetailPageShow();
        }
    }

    if (has('rolePermissions') || has('users')) {
        if (typeof enforcePermissions === 'function') enforcePermissions();
    }
    if (typeof updateFbSyncIndicator === 'function') updateFbSyncIndicator();
}

function _ensureLoggedInUserInUsersList() {
    if (!loggedInUser) return;
    if (!Array.isArray(users)) users = [];
    const found = users.find(x => x && x.username && x.username.toLowerCase() === loggedInUser.toLowerCase());
    if (!found) {
        const isFirstAdmin = (loggedInUser === 'admin' || loggedInUser === 'jafarmughal');
        users.push({
            username: loggedInUser,
            role: isFirstAdmin ? 'superadmin' : 'operator',
            disabled: false,
            createdAt: new Date().toISOString().slice(0, 10),
            createdBy: 'system'
        });
        if (typeof svU === 'function') svU();
    }
    if (typeof setCurrentUserRole === 'function') setCurrentUserRole(loggedInUser);
}

async function _finishDataBoot(changedNodes = null) {
    _ensureLoggedInUserInUsersList();
    if (!_appBootDone && typeof initUsers === 'function') {
        await initUsers();
    }
    isFirebaseReady = true;
    const fbLoader = typeof document !== 'undefined' ? document.getElementById('firebase-loader') : null;
    if (fbLoader) fbLoader.style.display = 'none';

    if (!_appBootDone) {
        _appBootDone = true;
        if (typeof applyLogo === 'function') applyLogo(fbLogo);
        if (typeof setLang === 'function') setLang(lang);
        if (typeof checkAuth === 'function') checkAuth();
        if (typeof refreshAllDrops === 'function') refreshAllDrops();
        if (loggedInUser && typeof showPage === 'function' && typeof currentActiveTab !== 'undefined') {
            showPage(currentActiveTab);
        }
        const eDate = typeof document !== 'undefined' ? document.getElementById('e-date') : null;
        if (eDate && typeof today === 'function') eDate.value = today();
        const pDate = typeof document !== 'undefined' ? document.getElementById('p-date') : null;
        if (pDate && typeof today === 'function') pDate.value = today();
        if (typeof setNextVoucher === 'function') setNextVoucher();
        if (typeof renderDailyNoteReport === 'function') renderDailyNoteReport();
    } else if (changedNodes && changedNodes.size > 0) {
        _refreshUiAfterNodes(changedNodes);
    }

    syncMetaListenerWithMode();
    if (typeof updateFbSyncIndicator === 'function') updateFbSyncIndicator();
}

function _withTimeout(promise, ms) {
    return new Promise((resolve, reject) => {
        const timer = setTimeout(() => reject(new Error('FIREBASE_TIMEOUT')), ms);
        promise.then(
            v => { clearTimeout(timer); resolve(v); },
            err => { clearTimeout(timer); reject(err); }
        );
    });
}

function detachSmartMetaListener() {
    if (_metaListenerRef && _metaListenerHandler) {
        try { _metaListenerRef.off('value', _metaListenerHandler); } catch (e) { }
    }
    _metaListenerRef = null;
    _metaListenerHandler = null;
}

function attachSmartMetaListener() {
    detachSmartMetaListener();
    if (typeof db === 'undefined' || !db || typeof db.ref !== 'function' || !loggedInUser) return;
    if (typeof getFbSyncMode === 'function' && getFbSyncMode() !== 'live') return;

    _metaListenerRef = db.ref('_meta/nodes');
    _metaListenerHandler = async (snapshot) => {
        if (!isFirebaseReady || !snapshot.exists()) return;
        const remoteMeta = snapshot.val() || {};
        const localMeta = typeof getLocalFbMeta === 'function' ? getLocalFbMeta() : {};
        const nodes = typeof FB_SYNC_NODES !== 'undefined' ? FB_SYNC_NODES : [];
        const dirtySet = new Set(typeof getDirtyFbNodes === 'function' ? getDirtyFbNodes() : []);

        const nodesToFetch = nodes.filter(node => {
            if (dirtySet.has(node)) return false;
            const rTs = Number(remoteMeta[node] || 0);
            const lTs = Number(localMeta[node] || 0);
            return rTs > lTs;
        });

        if (!nodesToFetch.length) return;

        try {
            const snaps = await Promise.all(nodesToFetch.map(n => db.ref(n).once('value')));
            if (typeof _fbQuotaStats !== 'undefined') _fbQuotaStats.nodeReads += nodesToFetch.length;

            const updated = new Set();
            nodesToFetch.forEach((node, idx) => {
                if (typeof isFbNodeDirty === 'function' && isFbNodeDirty(node)) return;
                _applySingleFbNode(node, snaps[idx].val(), {
                    isRemote: true,
                    serverTs: Number(remoteMeta[node] || Date.now()),
                    mergeRecords: node === 'records'
                });
                updated.add(node);
            });
            if (typeof setFbLastCheckAt === 'function') setFbLastCheckAt(Date.now());
            _refreshUiAfterNodes(updated);
        } catch (e) {
            console.warn('Smart live delta fetch error:', e);
        }
    };
    _metaListenerRef.on('value', _metaListenerHandler, (err) => {
        console.warn('Firebase meta listener error:', err);
    });
}

function syncMetaListenerWithMode() {
    const mode = typeof getFbSyncMode === 'function' ? getFbSyncMode() : 'eco';
    if (mode === 'live' && loggedInUser) {
        attachSmartMetaListener();
    } else {
        detachSmartMetaListener();
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    if (typeof loadComponentPages === 'function') {
        await loadComponentPages();
    }
    if (!users || !users.length) {
        users = [{ username: 'admin', role: 'superadmin', disabled: false, createdAt: '2024-01-01', createdBy: 'system' }];
    }

    window.loadData = async (options = {}) => {
        if (typeof options === 'boolean') options = { force: options };
        const force = Boolean(options && options.force);
        const forceFull = Boolean(options && options.forceFull);

        if (_loadDataPromise) return _loadDataPromise;

        _loadDataPromise = (async () => {
            const hasCache = hydrateAllFromLocalCache();
            const syncMode = typeof getFbSyncMode === 'function' ? getFbSyncMode() : 'eco';
            const ttlMs = (typeof getFbCacheTtlSec === 'function' ? getFbCacheTtlSec() : 180) * 1000;
            const lastCheck = typeof getFbLastCheckAt === 'function' ? getFbLastCheckAt() : 0;
            const cacheFresh = hasCache && ttlMs > 0 && (Date.now() - lastCheck) < ttlMs;

            if (typeof db === 'undefined' || !db || typeof db.ref !== 'function') {
                _applyDefaultsAndCleanup(false);
                await _finishDataBoot(null);
                return;
            }

            // Eco/Manual cache hit: 0 Firebase reads!
            if (!force && !forceFull && hasCache && (syncMode === 'manual' || (syncMode === 'eco' && cacheFresh))) {
                if (typeof _fbQuotaStats !== 'undefined') _fbQuotaStats.cacheHits++;
                if (typeof flushPendingFbWrites === 'function') {
                    flushPendingFbWrites();
                }
                _applyDefaultsAndCleanup(true);
                await _finishDataBoot(null);
                return;
            }

            try {
                // Always push local pending edits BEFORE reading remote data so nothing local is overwritten
                if (typeof flushPendingFbWrites === 'function') {
                    await flushPendingFbWrites();
                }

                const nodes = typeof FB_SYNC_NODES !== 'undefined' ? FB_SYNC_NODES : [];
                const applyFullRootSnapshot = async (data, remoteMetaMap = null) => {
                    const seedTs = Date.now();
                    const initialMeta = {};
                    const changed = new Set();
                    nodes.forEach(node => {
                        const rTs = Number((remoteMetaMap && remoteMetaMap[node]) || seedTs);
                        _applySingleFbNode(node, data[node], {
                            isRemote: true,
                            serverTs: rTs,
                            mergeRecords: false
                        });
                        initialMeta[node] = rTs;
                        changed.add(node);
                    });
                    try { localStorage.setItem('uts_fb_has_cache', '1'); } catch (e) { }
                    if (typeof setFbLastCheckAt === 'function') setFbLastCheckAt(Date.now());
                    _applyDefaultsAndCleanup(true);
                    if (!remoteMetaMap) {
                        db.ref('_meta/nodes').update(initialMeta).catch(() => { });
                    }
                    await _finishDataBoot(changed);
                };

                if (forceFull) {
                    const snap = await db.ref('/').once('value');
                    if (typeof _fbQuotaStats !== 'undefined') _fbQuotaStats.fullReads++;
                    await applyFullRootSnapshot(snap.val() || {}, null);
                    return;
                }

                const metaCheckPromise = db.ref('_meta/nodes').once('value');
                const metaSnap = hasCache ? await _withTimeout(metaCheckPromise, 6000) : await metaCheckPromise;
                if (typeof _fbQuotaStats !== 'undefined') _fbQuotaStats.metaChecks++;

                if (metaSnap.exists() && metaSnap.val()) {
                    const remoteMeta = metaSnap.val() || {};
                    const localMeta = typeof getLocalFbMeta === 'function' ? getLocalFbMeta() : {};
                    const nodesToFetch = nodes.filter(node => {
                        if (typeof isFbNodeDirty === 'function' && isFbNodeDirty(node)) return false;
                        const rTs = Number(remoteMeta[node] || 0);
                        const lTs = Number(localMeta[node] || 0);
                        return !_hasStorageNode(node) || rTs > lTs;
                    });

                    if (!nodesToFetch.length) {
                        try { localStorage.setItem('uts_fb_has_cache', '1'); } catch (e) { }
                        if (typeof setFbLastCheckAt === 'function') setFbLastCheckAt(Date.now());
                        if (typeof _fbQuotaStats !== 'undefined') _fbQuotaStats.lastError = '';
                        _applyDefaultsAndCleanup(true);
                        await _finishDataBoot(null);
                        return;
                    }

                    const fetchPromise = Promise.all(nodesToFetch.map(n => db.ref(n).once('value')));
                    const snaps = hasCache ? await _withTimeout(fetchPromise, 8000) : await fetchPromise;
                    if (typeof _fbQuotaStats !== 'undefined') _fbQuotaStats.nodeReads += nodesToFetch.length;

                    const updated = new Set();
                    nodesToFetch.forEach((node, idx) => {
                        const rTs = Number(remoteMeta[node] || Date.now());
                        _applySingleFbNode(node, snaps[idx].val(), {
                            isRemote: true,
                            serverTs: rTs,
                            mergeRecords: node === 'records'
                        });
                        if (typeof setLocalFbMetaNode === 'function' && rTs === 0) {
                            setLocalFbMetaNode(node, Date.now());
                        }
                        updated.add(node);
                    });

                    try { localStorage.setItem('uts_fb_has_cache', '1'); } catch (e) { }
                    if (typeof setFbLastCheckAt === 'function') setFbLastCheckAt(Date.now());
                    if (typeof _fbQuotaStats !== 'undefined') _fbQuotaStats.lastError = '';
                    _applyDefaultsAndCleanup(true);
                    await _finishDataBoot(updated);
                } else {
                    // First-time bootstrap: DB has no _meta/nodes yet — read root ONCE and seed _meta/nodes
                    const rootPromise = db.ref('/').once('value');
                    const snap = hasCache ? await _withTimeout(rootPromise, 8000) : await rootPromise;
                    if (typeof _fbQuotaStats !== 'undefined') _fbQuotaStats.fullReads++;
                    if (typeof _fbQuotaStats !== 'undefined') _fbQuotaStats.lastError = '';
                    await applyFullRootSnapshot(snap.val() || {}, null);
                }
            } catch (error) {
                console.error("Firebase Read Error:", error);
                if (typeof _fbQuotaStats !== 'undefined') _fbQuotaStats.lastError = (error && error.message) || 'Read error';
                if (!hasCache) {
                    showFirebaseStatusNotice(error);
                }
                _applyDefaultsAndCleanup(false);
                await _finishDataBoot(null);
            }
        })().finally(() => {
            _loadDataPromise = null;
        });

        return _loadDataPromise;
    };

    window.syncFirebaseNow = async function syncFirebaseNow(forceFull = false) {
        if (typeof window.loadData === 'function') {
            await window.loadData({ force: true, forceFull: Boolean(forceFull) });
        }
    };
    window.attachSmartMetaListener = attachSmartMetaListener;
    window.detachSmartMetaListener = detachSmartMetaListener;
    window.syncMetaListenerWithMode = syncMetaListenerWithMode;
    window.hydrateAllFromLocalCache = hydrateAllFromLocalCache;

    auth.onAuthStateChanged(user => {
        if (user) {
            const email = user.email || '';
            loggedInUser = email.split('@')[0] || 'admin';
            hydrateAllFromLocalCache();
            if (typeof setCurrentUserRole === 'function') setCurrentUserRole(loggedInUser);
            if (typeof window.loadData === 'function') window.loadData();
        } else {
            loggedInUser = null;
            detachSmartMetaListener();
            if (!isFirebaseReady) {
                isFirebaseReady = true;
                const fbLoader = document.getElementById('firebase-loader');
                if (fbLoader) fbLoader.style.display = 'none';
            }
            if (typeof checkAuth === 'function') checkAuth();
        }
    });
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  EXPOSE FUNCTIONS GLOBALLY
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
window.verifyPassword = verifyPassword;
window.confirmDeleteModal = confirmDeleteModal;
window.closeDeleteModal = closeDeleteModal;
window.login = login;
window.logout = logout;
window.addUser = addUser;
window.deleteUser = deleteUser;
window.toggleUserDisabled = toggleUserDisabled;
window.changeUserRole = changeUserRole;
window.renderAdminUserTable = renderAdminUserTable;
window.renderAdminPanel = renderAdminPanel;
window.switchAdminTab = switchAdminTab;
window.onPermToggle = onPermToggle;
window.savePermissions = savePermissions;
window.saveAdminUsers = saveAdminUsers;
window.canDo = canDo;
window.getMyPerms = getMyPerms;
window.enforcePermissions = enforcePermissions;
window.applyGranularPerms = applyGranularPerms;
window.setLang = setLang;
window.showPage = showPage;
window.addFromSettings = addFromSettings;
window.deleteItem = deleteItem;
window.onTransportChange = onTransportChange;
window.calcE = calcE;
window.addEntry = addEntry;
window.editRecord = editRecord;
window.deleteRecord = deleteRecord;
window.clearEntryForm = clearEntryForm;
window.addPayment = addPayment;
window.deletePay = deletePay;
window.clearLedgerFilter = clearLedgerFilter;
window.renderLedger = renderLedger;
window.filterRecords = filterRecords;
window.clearFilter = clearFilter;
window.toggleReportParty = toggleReportParty;
window.genReport = genReport;
window.printCurrentPage = printCurrentPage;
window.exportReportExcel = exportReportExcel;
window.exportLedgerExcel = exportLedgerExcel;
window.tripTypeLabel = tripTypeLabel;
window.clearDailyNoteReport = clearDailyNoteReport;
window.renderDailyNoteReport = renderDailyNoteReport;
window.fillTransportNatureDropdown = fillTransportNatureDropdown;
window.handleLogoUpload = handleLogoUpload;
window.handleLogoDrop = handleLogoDrop;
window.removeLogo = removeLogo;
window.saveAppSettings = saveAppSettings;
window.switchSettingsTab = switchSettingsTab;
window.editItem = editItem;
window.cancelEditItem = cancelEditItem;
window.saveItemEdit = saveItemEdit;
window.sdFilter = sdFilter;
window.sdOpen = sdOpen;
window.sdBlur = sdBlur;
window.sdSelect = sdSelect;
window.openModal = openModal;
window.closeModal = closeModal;
window.confirmModal = confirmModal;
window.todayStats = todayStats;
window.renderUsers = renderUsers;
window.renderPartyList = renderPartyList;
window.renderSectorList = renderSectorList;
window.renderTransportList = renderTransportList;
window.renderNatureList = renderNatureList;
window.renderShirkaList = renderShirkaList;
window.renderHajiPartyList = renderHajiPartyList;
window.svTN = svTN;
window.renderPayments = renderPayments;
window.renderPayHead = renderPayHead;
window.renderRecHead = renderRecHead;
window.renderRecords = renderRecords;
window.setNextVoucher = setNextVoucher;
window.genVoucher = genVoucher;
window.uid = uid;
window.fd = fd;
window.sar = sar;
window.today = today;
window.getCode = getCode;
window.genCode = genCode;
window.isSharing = isSharing;
window.formatTime12 = formatTime12;
window.L_arrow = L_arrow;
window.togglePasswordVisibility = togglePasswordVisibility;
window.exportReportExcel = exportReportExcel;
window.exportLedgerExcel = exportLedgerExcel;
window.copyVoucher = copyVoucher;
window.closeCopyModal = closeCopyModal;
window.confirmCopyVoucher = confirmCopyVoucher;
window.openEditRecordModal = typeof openEditRecordModal !== 'undefined' ? openEditRecordModal : null;
window.closeEditRecordModal = typeof closeEditRecordModal !== 'undefined' ? closeEditRecordModal : null;
window.saveRecordEditModal = typeof saveRecordEditModal !== 'undefined' ? saveRecordEditModal : null;
window.calcEditRecordTotal = typeof calcEditRecordTotal !== 'undefined' ? calcEditRecordTotal : null;
window.toggleEditFlightDetails = typeof toggleEditFlightDetails !== 'undefined' ? toggleEditFlightDetails : null;
window.filterTableColumns = filterTableColumns;
window.switchRecordsTab = switchRecordsTab;
window.toggleRecordCheck = toggleRecordCheck;
window.filterPayments = filterPayments;

// ← یہ فنکشن بھی گلوبل کر دیں تاکہ app.js کال کر سکے
window.initRecordsPage = initRecordsPage;
window.exportAllDataBackup = typeof exportAllDataBackup !== 'undefined' ? exportAllDataBackup : null;
window.copyBackupToClipboard = typeof copyBackupToClipboard !== 'undefined' ? copyBackupToClipboard : null;
window.importAllDataBackup = typeof importAllDataBackup !== 'undefined' ? importAllDataBackup : null;
window.pasteBackupFromPrompt = typeof pasteBackupFromPrompt !== 'undefined' ? pasteBackupFromPrompt : null;
window.openKsaDetail = typeof openKsaDetail !== 'undefined' ? openKsaDetail : null;
window.ksaDetailGoBack = typeof ksaDetailGoBack !== 'undefined' ? ksaDetailGoBack : null;
window.ksaDetailChangeDate = typeof ksaDetailChangeDate !== 'undefined' ? ksaDetailChangeDate : null;
window.renderKsaDetailTable = typeof renderKsaDetailTable !== 'undefined' ? renderKsaDetailTable : null;
window.onKsaDetailPageShow = typeof onKsaDetailPageShow !== 'undefined' ? onKsaDetailPageShow : null;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  FIREBASE STATUS NOTICE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function showFirebaseStatusNotice(error) {
    let isPerm = error && (error.code === 'PERMISSION_DENIED' || (error.message && error.message.toLowerCase().includes('permission_denied')));
    let msg = isPerm 
        ? '⚠️ فائر بیس ڈیٹا بیس میں رولز بلاک ہیں (Permission Denied)۔ براہ کرم Firebase Console میں Realtime Database Rules کو درست کریں۔ فی الحال لوکل ڈیٹا استعمال ہو رہا ہے۔'
        : '⚠️ فائر بیس سے رابطہ نہیں ہو سکا — لوکل ڈیٹا استعمال ہو رہا ہے۔';
    let el = document.getElementById('fb-status-banner');
    if (!el) {
        el = document.createElement('div');
        el.id = 'fb-status-banner';
        el.className = 'no-print';
        el.style.cssText = `
            background: ${isPerm ? '#FEF2F2' : '#FFFBEB'};
            color: ${isPerm ? '#991B1B' : '#92400E'};
            border-bottom: 1px solid ${isPerm ? '#F87171' : '#FCD34D'};
            padding: 10px 18px;
            font-size: 13.5px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            position: sticky;
            top: 0;
            z-index: 9999;
            direction: rtl;
        `;
        const wrap = document.querySelector('.app-main') || document.body;
        wrap.prepend(el);
    }
    el.innerHTML = `
        <div style="display:flex;align-items:center;gap:10px;">
            <span style="font-size:16px;">${isPerm ? '🔒' : '📡'}</span>
            <span>${msg}</span>
        </div>
        <button onclick="this.parentElement.remove()" style="background:none;border:none;cursor:pointer;font-size:16px;color:inherit;">✕</button>
    `;
}
window.showFirebaseStatusNotice = showFirebaseStatusNotice;