// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  MODAL
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function openModal(type, ctx) {
    _mt = type; _mc = ctx;
    const L = T[lang] || T.ur;
    const titles = { party: L.addPartyTitle, sector: L.addSectorTitle, transport: L.newTransportLbl || 'نئی گاڑی / ٹرانسپورٹ', nature: 'نئی نوعیت' };
    const holders = { party: L.partyPlaceholder, sector: L.sectorPlaceholder, transport: L.transportPlaceholder, nature: 'مثلاً: Marhba-Al Mosair' };
    document.getElementById('m-title').textContent = titles[type] || (L.add || 'شامل کریں');
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
        if (!Array.isArray(transportNatures)) transportNatures = [];
        const isDup = transportNatures.some(item => (typeof item === 'string' ? item.trim().toLowerCase() : '') === val.toLowerCase());
        if (isDup) { alert(L.alreadyExists); return; }
        transportNatures.push(val);
        if (typeof svTN === 'function') svTN();
        if (typeof fillTransportNatureDropdown === 'function') fillTransportNatureDropdown();
        const selId = _mc === 'entry' ? 'e-transport-nature-sel' : 'dn-transport-nature-sel';
        setTimeout(() => {
            const sel = document.getElementById(selId);
            if (sel) sel.value = val;
        }, 50);
    }
    closeModal();
    const setPage = document.getElementById('page-settings');
    if (setPage && setPage.classList.contains('active')) {
        if (typeof renderPartyList === 'function') renderPartyList();
        if (typeof renderSectorList === 'function') renderSectorList();
        if (typeof renderTransportList === 'function') renderTransportList();
        if (typeof renderShirkaList === 'function') renderShirkaList();
        if (typeof renderHajiPartyList === 'function') renderHajiPartyList();
        if (typeof renderNatureList === 'function') renderNatureList();
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