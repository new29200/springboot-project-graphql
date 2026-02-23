import { LibrariesAPI } from '/js/api/libraries.js';
import { CopiesAPI } from '/js/api/copies.js';

initPage('libraries');

document.getElementById('page-header').innerHTML = renderPageHeader('Réseau', 'Bibliothèques');

const isStaff = Auth.isStaff();

if (isStaff) {
    document.getElementById('staff-actions').classList.remove('hidden');
}

async function load() {
    const [libData, copyData] = await Promise.all([
        LibrariesAPI.getAll(),
        CopiesAPI.getAll()
    ]);

    const libraries = libData.libraries || [];
    const copies    = copyData.copies   || [];

    document.getElementById('count').textContent =
        `${libraries.length} établissement${libraries.length > 1 ? 's' : ''} dans le réseau`;

    const grid = document.getElementById('libraries-grid');
    grid.innerHTML = '';

    if (libraries.length === 0) {
        grid.innerHTML = renderEmpty('Aucune bibliothèque trouvée');
        return;
    }

    libraries.forEach(lib => {
        const copyCount = copies.filter(c => c.library?.libraryId == lib.libraryId).length;

        const card = document.createElement('div');
        card.className = 'library-card border border-gray-100 rounded-xl p-6 hover:border-black transition-all fade-in';
        card.innerHTML = `
            <div class="flex items-start justify-between mb-4">
                <div>
                    <span class="text-xs tracking-widest text-gray-400 uppercase">${lib.nature}</span>
                    <h2 class="font-semibold text-lg mt-1 leading-snug">${lib.libraryName}</h2>
                </div>
                <span class="text-xs border border-gray-100 px-3 py-1 rounded-full text-gray-400 whitespace-nowrap ml-4">
                    ${copyCount} ex.
                </span>
            </div>
            <div class="space-y-1.5 text-sm text-gray-400 mb-4">
                <div>${lib.location}, ${lib.city}</div>
                <div>Créée le ${lib.createDate}</div>
                ${lib.endDate ? `<div class="text-red-400">🔒 Fermée le ${lib.endDate}</div>` : ''}
            </div>
            <div class="pt-4 border-t border-gray-50">
                ${!lib.endDate ? renderBadge('Ouverte') : renderBadge('Fermée', 'outline')}
            </div>
        `;
        grid.appendChild(card);
    });
}

async function createLibrary() {
    const libraryName = document.getElementById('l-libraryName').value.trim();
    const createDate  = document.getElementById('l-createDate').value;
    const location    = document.getElementById('l-location').value.trim();
    const city        = document.getElementById('l-city').value.trim();
    const nature      = document.getElementById('l-nature').value.trim();

    if (!libraryName || !createDate || !location || !city || !nature) {
        showToast('Veuillez remplir tous les champs', 'error');
        return;
    }

    await LibrariesAPI.create(libraryName, createDate, location, city, nature);
    showToast('Bibliothèque créée');
    closeModal('modal-create');
    load();
}

window.createLibrary = createLibrary;

load();