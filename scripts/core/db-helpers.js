// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  DATABASE HELPERS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function svR() { db.ref('records').set(records).catch(e => console.warn('Save error:', e)); }
function svPy() { db.ref('payments').set(payments).catch(e => console.warn('Save error:', e)); }
function svP() { db.ref('parties').set(parties).catch(e => console.warn('Save error:', e)); }
function svS() { db.ref('sectors').set(sectors).catch(e => console.warn('Save error:', e)); }
function svTr() { db.ref('transports').set(transports).catch(e => console.warn('Save error:', e)); }
function svC() { db.ref('partyCodes').set(partyCodes).catch(e => console.warn('Save error:', e)); }
function svU() { db.ref('users').set(users).catch(e => console.warn('Save error:', e)); }
function svDN() { db.ref('dailyNotes').set(dailyNotes).catch(e => console.warn('Save error:', e)); }

function saveAppSettingsToFb() {
    db.ref('settings').set({ logo: fbLogo || null, appName: fbAppName || {}, appSub: fbAppSub || {} })
        .catch(e => console.warn('Save settings error:', e));
}