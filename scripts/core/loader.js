// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  MODULAR COMPONENT & PAGE LOADER
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

async function loadComponentPages() {
    const pages = [
        { id: 'page-entry', file: 'pages/entry.html' },
        { id: 'page-payment', file: 'pages/payment.html' },
        { id: 'page-ledger', file: 'pages/ledger.html' },
        { id: 'page-records', file: 'pages/records.html' },
        { id: 'page-report', file: 'pages/report.html' },
        { id: 'page-dailynote', file: 'pages/daily-note.html' },
        { id: 'page-settings', file: 'pages/settings.html' },
        { id: 'page-admin', file: 'pages/admin.html' }
    ];

    let fileCorsBlocked = false;

    await Promise.all(pages.map(async (p) => {
        const el = document.getElementById(p.id);
        if (!el) return;
        try {
            const res = await fetch(p.file, { cache: 'no-store' });
            if (res.ok) {
                let html = await res.text();
                html = html.replace(/<!-- Code injected by live-server -->[\s\S]*?<\/script>/gi, '');
                html = html.replace(/<\/body>\s*$/i, '');
                el.innerHTML = html;
            } else {
                console.error(`Failed to load ${p.file}: HTTP ${res.status}`);
                el.innerHTML = '<div style="padding:20px;color:red;direction:rtl;">صفحہ لوڈ نہیں ہو سکا: ' + p.file + '</div>';
            }
        } catch (err) {
            console.error(`Could not load ${p.file} via fetch:`, err);
            el.innerHTML = '<div style="padding:20px;color:red;direction:rtl;">صفحہ لوڈ نہیں ہو سکا: ' + p.file + '</div>';
            if (window.location.protocol === 'file:') {
                fileCorsBlocked = true;
            }
        }
    }));

    if (fileCorsBlocked) {
        showLiveServerNotice();
    }
}

function showLiveServerNotice() {
    const notice = document.createElement('div');
    notice.id = 'live-server-notice';
    notice.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        max-width: 440px;
        background: #1E293B;
        color: #F8FAFC;
        padding: 16px 20px;
        border-radius: 12px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.3);
        z-index: 99999;
        font-family: inherit;
        font-size: 13.5px;
        line-height: 1.6;
        direction: rtl;
        border-right: 4px solid #F59E0B;
    `;
    notice.innerHTML = `
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px;">
            <strong style="color:#FBBF24;font-size:14.5px;">⚠️ لائیو سرور (Live Server) کی ضرورت</strong>
            <button onclick="this.parentElement.parentElement.remove()" style="background:none;border:none;color:#94A3B8;cursor:pointer;font-size:16px;">✕</button>
        </div>
        <div>
            آپ نے فائل کو براہ راست کھولا ہے (file://)۔ ماڈیولر فائلز (HTML/CSS/JS) براؤزر میں درست طریقے سے چلانے کے لیے پروجیکٹ کو <b>VS Code کے "Open with Live Server"</b> کے ذریعے چلائیں۔
        </div>
    `;
    document.body.appendChild(notice);
}
