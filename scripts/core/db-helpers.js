// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  DATABASE HELPERS (SAFE + OFFLINE CACHE)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function _safeFbSet(node, val) {
    try {
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem('uts_' + node, JSON.stringify(val));
        }
    } catch (e) { }
    try {
        if (typeof db !== 'undefined' && db && typeof db.ref === 'function') {
            db.ref(node).set(val).catch(e => console.warn(`Save ${node} error:`, e));
        }
    } catch (e) {
        console.warn(`Save ${node} error:`, e);
    }
}

function svR() { _safeFbSet('records', records); }
function svDR() { _safeFbSet('deletedRecords', deletedRecords); }
function svPy() { _safeFbSet('payments', payments); }
function svP() { _safeFbSet('parties', parties); }
function svS() { _safeFbSet('sectors', sectors); }
function svSh() { _safeFbSet('shirkas', shirkas); }
function svTr() { _safeFbSet('transports', transports); }
function svC() { _safeFbSet('partyCodes', partyCodes); }
function svU() { _safeFbSet('users', users); }
function svHP() { _safeFbSet('hajiParties', hajiParties); }
function svDN() { _safeFbSet('dailyNotes', dailyNotes); }
function svRP() { _safeFbSet('rolePermissions', rolePermissions); }

function saveAppSettingsToFb() {
    _safeFbSet('settings', { logo: fbLogo || null, appName: fbAppName || {}, appSub: fbAppSub || {} });
}