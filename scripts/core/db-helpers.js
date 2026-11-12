// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  DATABASE HELPERS (LOCAL-FIRST CACHE + WRITE BATCHING + QUOTA SAVER)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const FB_SYNC_NODES = [
    'records', 'deletedRecords', 'payments', 'parties', 'sectors', 'shirkas',
    'transports', 'vehicleRates', 'transportNatures', 'partyCodes', 'users',
    'dailyNotes', 'hajiParties', 'umrahBookings', 'umrahVouchers',
    'rolePermissions', 'settings'
];

const _FB_LS_KEYS = {
    mode: 'uts_fb_sync_mode',
    ttlSec: 'uts_fb_cache_ttl_sec',
    debounceMs: 'uts_fb_debounce_ms',
    lastCheck: 'uts_fb_last_check',
    hasCache: 'uts_fb_has_cache',
    meta: 'uts_fb_meta',
    dirty: 'uts_fb_dirty'
};

const _fbQuotaStats = {
    metaChecks: 0,
    nodeReads: 0,
    fullReads: 0,
    cacheHits: 0,
    writesSent: 0,
    writesSkipped: 0,
    writesBatched: 0,
    lastSyncAt: 0,
    lastWriteAt: 0,
    lastError: ''
};

let _lastSyncedJson = {};
let _pendingFbWrites = {};
let _fbWriteTimer = null;
let _fbFlushInFlight = null;
let _metaDisabled = false;
let _dirtyFbNodes = _readJsonStorage(_FB_LS_KEYS.dirty, {});
let _localFbMeta = _readJsonStorage(_FB_LS_KEYS.meta, {});

function _readStorageStr(key, fallback = '') {
    try {
        if (typeof localStorage === 'undefined') return fallback;
        const v = localStorage.getItem(key);
        return v === null ? fallback : v;
    } catch (e) {
        return fallback;
    }
}

function _writeStorageStr(key, val) {
    try {
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem(key, String(val));
            return true;
        }
    } catch (e) { }
    return false;
}

function _readJsonStorage(key, fallback) {
    try {
        const raw = _readStorageStr(key, '');
        if (!raw) return fallback;
        const parsed = JSON.parse(raw);
        return parsed && typeof parsed === 'object' ? parsed : fallback;
    } catch (e) {
        return fallback;
    }
}

function _persistDirtyMap() {
    if (!Object.keys(_dirtyFbNodes).length) {
        try {
            if (typeof localStorage !== 'undefined') localStorage.removeItem(_FB_LS_KEYS.dirty);
        } catch (e) { }
        return;
    }
    _writeStorageStr(_FB_LS_KEYS.dirty, JSON.stringify(_dirtyFbNodes));
}

function _persistMetaMap() {
    _writeStorageStr(_FB_LS_KEYS.meta, JSON.stringify(_localFbMeta));
}

function getFbSyncMode() {
    const mode = _readStorageStr(_FB_LS_KEYS.mode, 'eco');
    return (mode === 'manual' || mode === 'live' || mode === 'eco') ? mode : 'eco';
}

function setFbSyncMode(mode) {
    const clean = (mode === 'manual' || mode === 'live' || mode === 'eco') ? mode : 'eco';
    _writeStorageStr(_FB_LS_KEYS.mode, clean);
    updateFbSyncIndicator();
    return clean;
}

function getFbCacheTtlSec() {
    const n = Number(_readStorageStr(_FB_LS_KEYS.ttlSec, '180'));
    return Number.isFinite(n) && n >= 0 ? n : 180;
}

function setFbCacheTtlSec(sec) {
    const n = Math.max(0, Math.round(Number(sec) || 0));
    _writeStorageStr(_FB_LS_KEYS.ttlSec, String(n));
    return n;
}

function getFbWriteDebounceMs() {
    const n = Number(_readStorageStr(_FB_LS_KEYS.debounceMs, '2500'));
    return Number.isFinite(n) && n >= 200 ? n : 2500;
}

function setFbWriteDebounceMs(ms) {
    const n = Math.max(200, Math.round(Number(ms) || 2500));
    _writeStorageStr(_FB_LS_KEYS.debounceMs, String(n));
    return n;
}

function getFbLastCheckAt() {
    return Number(_readStorageStr(_FB_LS_KEYS.lastCheck, '0')) || 0;
}

function setFbLastCheckAt(ts = Date.now()) {
    const val = Number(ts) || Date.now();
    _fbQuotaStats.lastSyncAt = val;
    _writeStorageStr(_FB_LS_KEYS.lastCheck, String(val));
}

function getLocalFbMeta() {
    return { ..._localFbMeta };
}

function setLocalFbMetaNode(node, ts) {
    if (!node) return;
    const num = Number(ts) || 0;
    if (num > 0) {
        _localFbMeta[node] = num;
        _persistMetaMap();
    }
}

function isFbNodeDirty(node) {
    return Boolean(_dirtyFbNodes[node] || _pendingFbWrites[node] !== undefined);
}

function getDirtyFbNodes() {
    const set = new Set([
        ...Object.keys(_pendingFbWrites),
        ...Object.keys(_dirtyFbNodes).filter(k => _dirtyFbNodes[k])
    ]);
    return Array.from(set);
}

function getFbQuotaStats() {
    return {
        ..._fbQuotaStats,
        mode: getFbSyncMode(),
        cacheTtlSec: getFbCacheTtlSec(),
        debounceMs: getFbWriteDebounceMs(),
        pendingCount: getDirtyFbNodes().length
    };
}

function markFbNodeSynced(node, val, serverTs = 0) {
    if (!node) return;
    let json = '';
    try {
        json = JSON.stringify(val === undefined ? null : val);
    } catch (e) {
        return;
    }
    _lastSyncedJson[node] = json;
    _writeStorageStr('uts_' + node, json);
    delete _pendingFbWrites[node];
    if (_dirtyFbNodes[node]) {
        delete _dirtyFbNodes[node];
        _persistDirtyMap();
    }
    if (serverTs > 0) {
        _localFbMeta[node] = Number(serverTs);
        _persistMetaMap();
    }
}

function seedLastSyncedFromCache(node, jsonStr) {
    if (!node || typeof jsonStr !== 'string') return;
    if (!isFbNodeDirty(node)) {
        _lastSyncedJson[node] = jsonStr;
    }
}

function _isOnline() {
    return typeof navigator === 'undefined' || navigator.onLine !== false;
}

function updateFbSyncIndicator() {
    if (typeof document === 'undefined') return;
    const btn = document.getElementById('fb-sync-btn');
    const dot = document.getElementById('fb-sync-dot');
    const lbl = document.getElementById('fb-sync-label');
    const pending = getDirtyFbNodes().length;
    const mode = getFbSyncMode();
    const online = _isOnline();
    const modeName = mode === 'live' ? 'Live' : mode === 'manual' ? 'Manual' : 'Eco';

    if (btn) {
        btn.title = `Firebase (${modeName}) | Reads: ${_fbQuotaStats.metaChecks + _fbQuotaStats.nodeReads + _fbQuotaStats.fullReads} | Writes: ${_fbQuotaStats.writesSent} | Saved Skips: ${_fbQuotaStats.writesSkipped + _fbQuotaStats.writesBatched}`;
    }
    if (dot && lbl) {
        if (!online) {
            dot.style.background = '#f59e0b';
            lbl.textContent = pending > 0 ? `آف لائن (${pending})` : 'آف لائن';
        } else if (pending > 0) {
            dot.style.background = '#f59e0b';
            lbl.textContent = `محفوظ ہو رہا (${pending})`;
        } else if (_fbQuotaStats.lastError) {
            dot.style.background = '#ef4444';
            lbl.textContent = 'سنک ایرر';
        } else {
            dot.style.background = '#10b981';
            lbl.textContent = `سنک (${modeName})`;
        }
    }
    if (typeof renderFbQuotaStatsBox === 'function') {
        renderFbQuotaStatsBox();
    }
}

function _scheduleFbFlush() {
    if (_fbWriteTimer) clearTimeout(_fbWriteTimer);
    const delay = getFbWriteDebounceMs();
    _fbWriteTimer = setTimeout(() => {
        _fbWriteTimer = null;
        flushPendingFbWrites();
    }, delay);
}

async function flushPendingFbWrites() {
    if (_fbWriteTimer) {
        clearTimeout(_fbWriteTimer);
        _fbWriteTimer = null;
    }
    if (_fbFlushInFlight) return _fbFlushInFlight;

    // Hydrate any leftover dirty nodes saved in localStorage from an interrupted session
    Object.keys(_dirtyFbNodes).forEach(node => {
        if (_dirtyFbNodes[node] && _pendingFbWrites[node] === undefined) {
            const raw = _readStorageStr('uts_' + node, '');
            if (raw) _pendingFbWrites[node] = raw;
        }
    });

    const nodes = Object.keys(_pendingFbWrites);
    if (!nodes.length) return true;
    if (typeof db === 'undefined' || !db || typeof db.ref !== 'function' || !_isOnline()) {
        updateFbSyncIndicator();
        return false;
    }

    const snapshots = {};
    const updates = {};
    const nowTs = Date.now();
    nodes.forEach(node => {
        const jsonStr = _pendingFbWrites[node];
        snapshots[node] = jsonStr;
        delete _pendingFbWrites[node];
        try {
            updates[node] = JSON.parse(jsonStr);
        } catch (e) {
            updates[node] = null;
        }
        if (!_metaDisabled) {
            updates['_meta/nodes/' + node] = nowTs;
        }
        _localFbMeta[node] = nowTs;
    });
    _persistMetaMap();

    const doCommit = async (payload) => {
        const rootRef = db.ref('/');
        if (rootRef && typeof rootRef.update === 'function') {
            await rootRef.update(payload);
            return;
        }
        await Promise.all(
            Object.entries(payload).map(([path, v]) => db.ref(path).set(v))
        );
    };

    _fbFlushInFlight = (async () => {
        try {
            try {
                await doCommit(updates);
            } catch (err) {
                const isPerm = err && (err.code === 'PERMISSION_DENIED' || String(err.message || '').toLowerCase().includes('permission_denied'));
                if (isPerm && !_metaDisabled && Object.keys(updates).some(k => k.startsWith('_meta/'))) {
                    _metaDisabled = true;
                    const plainUpdates = {};
                    Object.entries(updates).forEach(([k, v]) => {
                        if (!k.startsWith('_meta/')) plainUpdates[k] = v;
                    });
                    await doCommit(plainUpdates);
                } else {
                    throw err;
                }
            }

            nodes.forEach(node => {
                if (_pendingFbWrites[node] === undefined) {
                    _lastSyncedJson[node] = snapshots[node];
                    delete _dirtyFbNodes[node];
                }
            });
            _persistDirtyMap();
            _fbQuotaStats.writesSent++;
            _fbQuotaStats.lastWriteAt = nowTs;
            _fbQuotaStats.lastError = '';
            updateFbSyncIndicator();

            if (Object.keys(_pendingFbWrites).length > 0) {
                _scheduleFbFlush();
            }
            return true;
        } catch (e) {
            console.warn('Batch Firebase save error:', e);
            _fbQuotaStats.lastError = (e && e.message) || 'Save failed';
            nodes.forEach(node => {
                if (_pendingFbWrites[node] === undefined) {
                    _pendingFbWrites[node] = snapshots[node];
                }
                _dirtyFbNodes[node] = true;
            });
            _persistDirtyMap();
            updateFbSyncIndicator();
            return false;
        } finally {
            _fbFlushInFlight = null;
        }
    })();

    return _fbFlushInFlight;
}

function _safeFbSet(node, val) {
    let json = '';
    try {
        json = JSON.stringify(val === undefined ? null : val);
    } catch (e) {
        console.warn(`Serialize ${node} error:`, e);
        return;
    }

    _writeStorageStr('uts_' + node, json);

    if (_lastSyncedJson[node] === json && !_dirtyFbNodes[node] && _pendingFbWrites[node] === undefined) {
        _fbQuotaStats.writesSkipped++;
        updateFbSyncIndicator();
        return;
    }

    if (_pendingFbWrites[node] !== undefined) {
        _fbQuotaStats.writesBatched++;
    }
    _pendingFbWrites[node] = json;
    _dirtyFbNodes[node] = true;
    _persistDirtyMap();
    updateFbSyncIndicator();
    _scheduleFbFlush();
}

if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
    window.addEventListener('online', () => {
        flushPendingFbWrites();
    });
    window.addEventListener('pagehide', () => {
        flushPendingFbWrites();
    });
}
if (typeof document !== 'undefined' && typeof document.addEventListener === 'function') {
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') {
            flushPendingFbWrites();
        }
    });
}

function svR() { _safeFbSet('records', records); }
function svDR() { _safeFbSet('deletedRecords', deletedRecords); }
function svPy() { _safeFbSet('payments', payments); }
function svP() { _safeFbSet('parties', parties); }
function svS() { _safeFbSet('sectors', sectors); }
function svSh() { _safeFbSet('shirkas', shirkas); }
function svTr() { _safeFbSet('transports', transports); }
function svTN() { _safeFbSet('transportNatures', transportNatures); }
function svVR() { _safeFbSet('vehicleRates', vehicleRates); }
function svC() { _safeFbSet('partyCodes', partyCodes); }
function svU() { _safeFbSet('users', users); }
function svHP() { _safeFbSet('hajiParties', hajiParties); }
function svDN() { _safeFbSet('dailyNotes', dailyNotes); }
function svRP() { _safeFbSet('rolePermissions', rolePermissions); }
function svUB() { _safeFbSet('umrahBookings', umrahBookings); }
function svUV() { _safeFbSet('umrahVouchers', umrahVouchers); }

function saveAppSettingsToFb() {
    _safeFbSet('settings', { logo: fbLogo || null, appName: fbAppName || {}, appSub: fbAppSub || {} });
}

if (typeof window !== 'undefined') {
    window.FB_SYNC_NODES = FB_SYNC_NODES;
    window.getFbSyncMode = getFbSyncMode;
    window.setFbSyncMode = setFbSyncMode;
    window.getFbCacheTtlSec = getFbCacheTtlSec;
    window.setFbCacheTtlSec = setFbCacheTtlSec;
    window.getFbWriteDebounceMs = getFbWriteDebounceMs;
    window.setFbWriteDebounceMs = setFbWriteDebounceMs;
    window.getFbLastCheckAt = getFbLastCheckAt;
    window.setFbLastCheckAt = setFbLastCheckAt;
    window.getLocalFbMeta = getLocalFbMeta;
    window.setLocalFbMetaNode = setLocalFbMetaNode;
    window.isFbNodeDirty = isFbNodeDirty;
    window.getDirtyFbNodes = getDirtyFbNodes;
    window.getFbQuotaStats = getFbQuotaStats;
    window.markFbNodeSynced = markFbNodeSynced;
    window.seedLastSyncedFromCache = seedLastSyncedFromCache;
    window.flushPendingFbWrites = flushPendingFbWrites;
    window.updateFbSyncIndicator = updateFbSyncIndicator;
    window._fbQuotaStats = _fbQuotaStats;
}