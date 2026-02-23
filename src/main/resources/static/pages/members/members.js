initPage('members');

document.getElementById('page-header').innerHTML = renderPageHeader('Annuaire', 'Membres');
document.getElementById('table-head').innerHTML  = renderTableHead(['Nom', 'Email', 'Téléphone', 'Ville', 'Bibliothèque', 'Statut', '']);

const BTN_ACTIVE   = 'filter-btn active';
const BTN_INACTIVE = 'filter-btn';

let allMembers = [];

async function load() {
    const data = await API.members();
    allMembers = data.members;
    render(allMembers);

    // ✅ Afficher le bouton "Ajouter" seulement si staff
    if (Auth.isStaff()) {
        document.getElementById('btn-add').classList.remove('hidden');
    }
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
        { content: m.library.libraryName },
        { content: m.active ? renderBadge('Actif') : renderBadge('Inactif', 'outline'), class: 'py-3' },
    ])).join('');
}

// ── Modal ────────────────────────────────────────────────────

function openModal() {
    document.getElementById('modal').classList.remove('hidden');
    // Charger les bibliothèques dans le select
    API.libraries().then(data => {
        const select = document.getElementById('field-library');
        select.innerHTML = data.libraries.map(l =>
            `<option value="${l.libraryId}">${l.libraryName} — ${l.city}</option>`
        ).join('');
    });
}

function closeModal() {
    document.getElementById('modal').classList.add('hidden');
    document.getElementById('add-form').reset();
    document.getElementById('form-error').textContent = '';
}

async function submitMember(e) {
    e.preventDefault();
    const f = e.target;

    const lastName   = f.lastName.value.trim();
    const firstName  = f.firstName.value.trim();
    const address    = f.address.value.trim();
    const postalCode = f.postalCode.value.trim();
    const city       = f.city.value.trim();
    const email      = f.email.value.trim();
    const phone      = f.phone.value.trim();
    const libraryId  = f.libraryId.value;
    const passWord   = lastName + postalCode; // ex: "Dupont75001"

    try {
        await API.createMember(lastName, firstName, address, postalCode, city, email, phone, passWord, libraryId);
        closeModal();
        load(); // refresh
    } catch (err) {
        document.getElementById('form-error').textContent = 'Erreur lors de la création.';
    }
}

async function deleteMember(id) {
    if (!confirm('Supprimer ce membre ?')) return;
    await API.deleteMember(id);
    load();
}

load();