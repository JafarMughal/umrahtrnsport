// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  MODAL
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function openModal(type, ctx) {
    _mt = type; _mc = ctx;
    const L = T[lang] || T.ur;
    const titles = { party: L.addPartyTitle, sector: L.addSectorTitle, transport: '➕ ' + L.newTransportLbl, nature: '➕ نئی نوعیت' };
    const holders = { party: L.partyPlaceholder, sector: L.sectorPlaceholder, transport: L.transportPlaceholder, nature: 'مثلاً: Marhba-Al Mosair' };
    document.getElementById('m-title').textContent = titles[type] || '➕';
    document.getElementById('m-input').placeholder = holders[type] || '';
    document.getElementById('m-input').value = '';
    document.getElementById('modal').classList.add('open');
    setTimeout(() => document.getElementById('m-input').focus(), 80);
}
function closeModal() { document.getElementById('modal').classList.remove('open'); }
function confirmModal() {
    const val = document.getElementById('m-input').value.trim();
    if (!val) return;
    const L = T[lang] || T.ur;
    if (_mt === 'party') {
        if (parties.includes(val)) { alert(L.alreadyExists); return; }
        parties.push(val); getCode(val); svP(); refreshAllDrops();
        // Select the newly added party in the right dropdown
        const tgt = _mc === 'entry' ? 'e-party' : _mc === 'payment' ? 'p-party' : null;
        if (tgt) {
            setTimeout(() => { document.getElementById(tgt).value = val; }, 50);
        }
    } else if (_mt === 'sector') {
        if (sectors.includes(val)) { alert(L.alreadyExists); return; }
        sectors.push(val); svS(); refreshAllDrops();
        const tgtSec = _mc === 'entry' ? 'e-sector' : 'dn-sector';
        setTimeout(() => { document.getElementById(tgtSec).value = val; }, 50);
    } else if (_mt === 'transport') {
        if (transports.includes(val)) { alert(L.alreadyExists); return; }
        transports.push(val); svTr();
        refreshAllDrops();
        const tEl = _mc === 'entry' ? 'e-transport' : 'dn-transport-sel';
        setTimeout(() => { document.getElementById(tEl).value = val; }, 50);
    } else if (_mt === 'nature') {
        // Update the correct nature dropdown based on context
        const selId = _mc === 'entry' ? 'e-transport-nature-sel' : 'dn-transport-nature-sel';
        const sel = document.getElementById(selId);
        if (sel) {
            let exists = false;
            for (let i = 0; i < sel.options.length; i++) if (sel.options[i].value === val) exists = true;
            if (!exists) {
                const opt = document.createElement('option');
                opt.value = val;
                opt.textContent = val;
                sel.appendChild(opt);
            }
            sel.value = val;
        }
        // Also update the entry form nature dropdown if it exists and context is dailynote
        if (_mc !== 'entry') {
            const entryNature = document.getElementById('e-transport-nature-sel');
            if (entryNature) {
                let exists = false;
                for (let i = 0; i < entryNature.options.length; i++) if (entryNature.options[i].value === val) exists = true;
                if (!exists) {
                    const opt = document.createElement('option');
                    opt.value = val; opt.textContent = val;
                    entryNature.appendChild(opt);
                }
            }
        }
    }
    closeModal();
    if (document.getElementById('page-settings').classList.contains('active')) {
        renderPartyList(); renderSectorList(); renderTransportList();
    }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  MODAL KEYBOARD
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
document.addEventListener('keydown', e => {
    if (!document.getElementById('modal').classList.contains('open')) return;
    if (e.key === 'Enter') confirmModal();
    if (e.key === 'Escape') closeModal();
});
document.getElementById('modal').addEventListener('click', function (e) { if (e.target === this) closeModal(); });