// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  SUPABASE CONFIGURATION & CLIENT INIT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const SUPABASE_URL = "https://qfnbvslbqlwvqnjfqoxf.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_aP9fdPVk7s986zODYY7dwA_cwqd0GVJ";

let sbClient = null;
let secondarySbClient = null;

try {
    if (typeof window !== 'undefined' && window.supabase && typeof window.supabase.createClient === 'function') {
        // Main Supabase client with local session persistence
        sbClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
            auth: {
                persistSession: true,
                autoRefreshToken: true,
                detectSessionInUrl: false
            }
        });

        // Secondary client without session persistence (for admin creating other users without logging out)
        secondarySbClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
            auth: {
                persistSession: false,
                autoRefreshToken: false,
                detectSessionInUrl: false,
                storageKey: 'sb-secondary-auth-token'
            }
        });
    } else {
        console.warn("Supabase SDK not loaded yet.");
    }
} catch (e) {
    console.warn("Supabase init error:", e);
}

// Global references for backward compatibility and app access
if (typeof window !== 'undefined') {
    window.SUPABASE_URL = SUPABASE_URL;
    window.SUPABASE_ANON_KEY = SUPABASE_ANON_KEY;
    window.sbClient = sbClient;
    window.secondarySbClient = secondarySbClient;
    window.db = sbClient; // alias for db checks
    window.auth = sbClient ? sbClient.auth : null;
}

const getEmail = (username) => {
    if (username && username.includes('@')) return username;
    return `${(username || 'user').toLowerCase().replace(/[^a-z0-9]/g, '')}@umrahtransport.com`;
};

if (typeof window !== 'undefined') {
    window.getEmail = getEmail;
}

