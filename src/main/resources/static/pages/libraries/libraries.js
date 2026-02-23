// libraries.js — Logique page Bibliothèques
initPage('libraries');

document.getElementById('page-header').innerHTML = renderPageHeader('Réseau', 'Bibliothèques');

async function load() {
    const [libData, copyData] = await Promise.all([
        API.libraries(),
        API.copies()
    ]);

    const libraries = libData.libraries;
    const copies    = copyData.copies;

    document.getElementById('count').textContent =
        `${libraries.length} établissement${libraries.length > 1 ? 's' : ''} dans le réseau`;

    const grid = document.getElementById('libraries-grid');
    grid.innerHTML = '';

    if (libraries.length === 0) {
        grid.innerHTML = renderEmpty('Aucune bibliothèque trouvée');
        return;
    }

    libraries.forEach(lib => {
        const copyCount = copies.filter(c => c.library?.libraryName === lib.libraryName).length;

        const card = document.createElement('div');
        card.className = 'library-card border border-gray-100 rounded-xl p-6 hover:border-black transition-all fade-in';
        card.innerHTML = `
            <div class="flex items-start justify-between mb-4">
                <div>
                    <span class="text-xs tracking-widest text-gray-400 uppercase">${lib.nature}</span>
                    <h2 class="font-semibold text-lg mt-1 leading-snug">${lib.libraryName}</h2>
                </div>
                <span class="copy-count text-xs border border-gray-100 px-3 py-1 rounded-full text-gray-400 whitespace-nowrap ml-4">
                    ${copyCount} ex.
                </span>
            </div>
            <div class="space-y-1.5 text-sm text-gray-400 mb-4">
                <div className="flex items-center gap-2">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 21s-6-5.686-6-10a6 6 0 1112 0c0 4.314-6 10-6 10z"
                        />
                        <circle cx="12" cy="11" r="2.5" />
                    </svg>

                    <span>${lib.location}, ${lib.city}</span>
                </div>

                <div className="flex items-center gap-2">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <rect
                            x="3"
                            y="4"
                            width="18"
                            height="18"
                            rx="2"
                            ry="2"
                        />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>

                    <span>Créée le ${lib.createDate}</span>
                </div>
                ${lib.endDate ? `
                    <div class="flex items-center gap-2 text-red-400">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            stroke-width="2"
                        >
                            <rect x="5" y="11" width="14" height="10" rx="2" ry="2"></rect>
                            <path d="M7 11V7a5 5 0 0110 0v4"></path>
                        </svg>

                        <span>Fermée le ${lib.endDate}</span>
                    </div>
                ` : ''}
            </div>
            <div class="pt-4 border-t border-gray-50">
                ${!lib.endDate ? renderBadge('Ouverte') : renderBadge('Fermée', 'outline')}
            </div>
        `;
        grid.appendChild(card);
    });
}

load();