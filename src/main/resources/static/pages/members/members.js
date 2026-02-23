import { MembersAPI } from '/js/api/members.js';
import { LibrariesAPI } from '/js/api/libraries.js';

initPage('members', false, true);

document.getElementById('page-header').innerHTML = renderPageHeader('Annuaire', 'Membres');
document.getElementById('table-head').innerHTML  = renderTableHead(['Nom', 'Email', 'Téléphone', 'Ville', 'Bibliothèque', 'Statut', '']);

const BTN_ACTIVE   = 'filter-btn active';
const BTN_INACTIVE = 'filter-btn';

let allMembers   = [];
let allLibraries = [];

async function load() {
    const [memberData, libData] = await Promise.all([
        MembersAPI.getAll(),
        LibrariesAPI.getAll()
    ]);

    allMembers   = memberData.members   || [];
    allLibraries = libData.libraries    || [];

    const select = document.getElementById('c-libraryId');
    allLibraries.forEach(lib => {
        const opt = document.createElement('option');
        opt.value = lib.libraryId;
        opt.textContent = lib.libraryName;
        select.appendChild(opt);
    });

    render(allMembers);
}

function showAll() {
    document.getElementById('btn-all').className    = BTN_ACTIVE;
    document.getElementById('btn-active').className = BTN_INACTIVE;
    render(allMembers);
}

function showActive() {
    document.getElementById('btn-active').className = BTN_ACTIVE;
    document.getElementById('btn-all').className    = BTN_INACTIVE;
    render(allMembers.filter(m => m.active));
}

function render(members) {
    document.getElementById('count').textContent =
        `${members.length} membre${members.length > 1 ? 's' : ''}`;

    const tbody = document.getElementById('members-table');

    if (members.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7">${renderEmpty('Aucun membre')}</td></tr>`;
        return;
    }

    tbody.innerHTML = members.map(m => renderTableRow([
        { content: `${m.firstName} ${m.lastName}`, class: 'py-3 pr-6 font-medium' },
        { content: m.email },
        { content: m.phone },
        { content: m.city },
        { content: m.library?.libraryName || '—' },
        { content: m.active ? renderBadge('Actif') : renderBadge('Inactif', 'outline'), class: 'py-3' },
        {
            content: `
                <div class="flex gap-2">
                    <button onclick="doOpenEdit('${m.memberId}')"
                        class="text-xs border border-gray-200 px-3 py-1.5 rounded-lg hover:border-black transition-colors">
                        Modifier
                    </button>
                    <button onclick="doDeleteMember('${m.memberId}')"
                        class="text-xs border border-red-100 text-red-400 px-3 py-1.5 rounded-lg hover:border-red-400 transition-colors">
                        Supprimer
                    </button>
                </div>
            `,
            class: 'py-3'
        }
    ])).join('');
}

// ── Créer ────────────────────────────────────────────────────
async function createMember() {
    const firstName  = document.getElementById('c-firstName').value.trim();
    const lastName   = document.getElementById('c-lastName').value.trim();
    const address    = document.getElementById('c-address').value.trim();
    const postalCode = document.getElementById('c-postalCode').value.trim();
    const city       = document.getElementById('c-city').value.trim();
    const email      = document.getElementById('c-email').value.trim();
    const phone      = document.getElementById('c-phone').value.trim();
    const passWord   = document.getElementById('c-passWord').value;
    const libraryId  = document.getElementById('c-libraryId').value;

    if (!firstName || !lastName || !email || !passWord) {
        showToast('Veuillez remplir tous les champs obligatoires', 'error');
        return;
    }

    await MembersAPI.create(lastName, firstName, address, postalCode, city, email, phone, passWord, libraryId);
    showToast('Membre créé avec succès');
    closeModal('modal-create');

    const data = await MembersAPI.getAll();
    allMembers = data.members || [];
    render(allMembers);
}

// ── Modifier ─────────────────────────────────────────────────
function doOpenEdit(memberId) {
    const m = allMembers.find(m => m.memberId == memberId);
    if (!m) return;

    document.getElementById('e-memberId').value = m.memberId;
    document.getElementById('e-phone').value    = m.phone   || '';
    document.getElementById('e-city').value     = m.city    || '';
    document.getElementById('e-address').value  = m.address || '';
    document.getElementById('e-active').checked = m.active;
    openModal('modal-edit');
}

async function updateMember() {
    const memberId = document.getElementById('e-memberId').value;
    const phone    = document.getElementById('e-phone').value.trim();
    const city     = document.getElementById('e-city').value.trim();
    const address  = document.getElementById('e-address').value.trim();
    const active   = document.getElementById('e-active').checked;

    await MembersAPI.update(memberId, address, city, phone, active);
    showToast('Membre mis à jour');
    closeModal('modal-edit');

    const data = await MembersAPI.getAll();
    allMembers = data.members || [];
    render(allMembers);
}

// ── Supprimer ────────────────────────────────────────────────
async function doDeleteMember(memberId) {
    if (!window.confirm('Supprimer ce membre ?')) return;
    await MembersAPI.delete(memberId);
    showToast('Membre supprimé');
    allMembers = allMembers.filter(m => m.memberId != memberId);
    render(allMembers);
}

// Exposer au HTML
window.createMember   = createMember;
window.doOpenEdit     = doOpenEdit;
window.updateMember   = updateMember;
window.doDeleteMember = doDeleteMember;
window.showAll        = showAll;
window.showActive     = showActive;

load();