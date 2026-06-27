// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  MODAL
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function openModal(type, ctx) {
    _mt = type; _mc = ctx;
    const L = T[lang] || T.ur;
    const titles = { party: L.addPartyTitle, sector: L.addSectorTitle, transport: '➕ ' + L.newTransportLbl };
    const holders = { party: L.partyPlaceholder, sector: L.sectorPlaceholder, transport: L.transportPlaceholder };
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
        const tgt = _mc === 'entry' ? 'e-party' : _mc === 'payment' ? 'p-party' : _mc === 'dailynote' ? 'dn-party' : 'u-party';
        sdSetValue(tgt, val);
    } else if (_mt === 'sector') {
        if (sectors.includes(val)) { alert(L.alreadyExists); return; }
        sectors.push(val); svS(); refreshAllDrops();
        let tgtSec = _mc === 'entry' ? 'e-sector' : _mc === 'update' ? 'u-sector' : 'dn-sector';
        document.getElementById(tgtSec).value = val;
    } else if (_mt === 'transport') {
        if (transports.includes(val)) { alert(L.alreadyExists); return; }
        transports.push(val); svTr(); refreshAllDrops();
        document.getElementById(_mc === 'entry' ? 'e-transport' : 'u-transport').value = val;
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