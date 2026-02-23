// books.js — Logique pages Livres
// Gère à la fois books/index.html et books/detail.html

const PAGE = window.location.pathname.includes('detail') ? 'detail' : 'list';

// ============================================================
// PAGE LISTE
// ============================================================
if (PAGE === 'list') {
    initPage('books');
    document.getElementById('page-header').innerHTML = renderPageHeader('Catalogue', 'Livres');
    document.getElementById('table-head').innerHTML  = renderTableHead(['Titre', 'Auteur', 'Genre', 'Édition', 'ISBN', '']);

    let allBooks = [];

    async function load() {
        const [bookData, authorData, genreData] = await Promise.all([
            API.books(),
            API.authors(),
            API.genres()
        ]);

        allBooks = bookData.books;

        // Populate auteurs
        const authorSelect = document.getElementById('filter-author');
        authorData.authors.forEach(a => {
            const opt = document.createElement('option');
            opt.value = a.authorId;
            opt.textContent = `${a.firstName} ${a.lastName}`;
            authorSelect.appendChild(opt);
        });

        // Populate genres
        const genreSelect = document.getElementById('filter-genre');
        genreData.genres.forEach(g => {
            const opt = document.createElement('option');
            opt.value = g.genreId;
            opt.textContent = g.genre;
            genreSelect.appendChild(opt);
        });

        // Lire params URL (venant de l'accueil par exemple)
        const params = new URLSearchParams(window.location.search);
        if (params.get('genreId')) genreSelect.value = params.get('genreId');
        if (params.get('authorId')) authorSelect.value = params.get('authorId');

        applyFilters();
    }

    function applyFilters() {
        const title    = document.getElementById('search-title').value.toLowerCase().trim();
        const authorId = document.getElementById('filter-author').value;
        const genreId  = document.getElementById('filter-genre').value;

        let filtered = allBooks;
        if (title)    filtered = filtered.filter(b => b.title.toLowerCase().includes(title));
        if (authorId) filtered = filtered.filter(b => b.author.authorId == authorId);
        if (genreId)  filtered = filtered.filter(b => b.genre.genreId == genreId);

        renderBooks(filtered);
    }

    function resetFilters() {
        document.getElementById('search-title').value   = '';
        document.getElementById('filter-author').value  = '';
        document.getElementById('filter-genre').value   = '';
        renderBooks(allBooks);
    }

    function renderBooks(books) {
        document.getElementById('count').textContent =
            `${books.length} livre${books.length > 1 ? 's' : ''} trouvé${books.length > 1 ? 's' : ''}`;

        const tbody = document.getElementById('books-table');

        if (books.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6">${renderEmpty('Aucun livre trouvé')}</td></tr>`;
            return;
        }

        tbody.innerHTML = books.map(book => renderTableRow([
            { content: book.title, class: 'py-3 pr-6 font-medium' },
            { content: `${book.author.firstName} ${book.author.lastName}` },
            { content: book.genre.genre },
            { content: book.edition.editionName },
            { content: book.isbn, class: 'py-3 pr-6 text-gray-300 font-mono text-xs' },
            {
                content: `<a href="/pages/books/detail.html?id=${book.bookId}"
                             class="text-xs border border-gray-200 px-3 py-1.5 rounded-lg hover:border-black transition-colors">
                              Détail →
                          </a>`,
                class: 'py-3'
            }
        ])).join('');
    }

    // Enter pour rechercher
    document.getElementById('search-title').addEventListener('keydown', e => {
        if (e.key === 'Enter') applyFilters();
    });

    load();
}

// ============================================================
// PAGE DETAIL
// ============================================================
if (PAGE === 'detail') {
    initPage('books');

    async function load() {
        const params = new URLSearchParams(window.location.search);
        const id = params.get('id');

        if (!id) {
            document.getElementById('content').innerHTML = renderEmpty('Livre introuvable.');
            return;
        }

        const data = await API.book(id);
        const book   = data.book;
        const copies = data.copiesByBook;

        if (!book) {
            document.getElementById('content').innerHTML = renderEmpty('Livre introuvable.');
            return;
        }

        document.title = `${book.title} — Bibliothèque`;

        document.getElementById('content').innerHTML = `

            <!-- Header -->
            <div class="flex gap-10 mb-12">
                <div class="book-cover bg-gray-50 border border-gray-100 rounded-xl w-36 h-52 flex items-center justify-center flex-shrink-0">
                    <span class="text-5xl"></span>
                </div>
                <div class="flex flex-col justify-center gap-1">
                    <span class="text-xs tracking-widest text-gray-400 uppercase">${book.genre.genre}</span>
                    <h1 class="serif text-4xl leading-tight">${book.title}</h1>
                    <p class="text-gray-500">${book.author.firstName} ${book.author.lastName}</p>
                    <p class="text-sm text-gray-400">Publié le ${book.publishDate}</p>
                    <p class="text-xs text-gray-300 font-mono">${book.isbn}</p>
                </div>
            </div>

            <!-- Info cards -->
            <div class="grid grid-cols-3 gap-4 mb-12">
                ${renderInfoCard(
                    'Auteur',
                    `${book.author.firstName} ${book.author.lastName}`,
                    book.author.country || '—',
                    book.author.birthDate ? `Né le ${book.author.birthDate}` : ''
                )}
                ${renderInfoCard(
                    'Édition',
                    book.edition.editionName,
                    `${book.edition.city}, ${book.edition.country}`
                )}
                ${renderInfoCard('Type', book.type.type, book.genre.genre)}
            </div>

            <!-- Disponibilité -->
            <div>
                <h2 class="text-lg font-semibold mb-1">Disponibilité</h2>
                <p class="text-sm text-gray-400 mb-5">
                    ${copies.length} exemplaire${copies.length > 1 ? 's' : ''} dans le réseau
                </p>
                ${copies.length === 0
                    ? renderEmpty('Aucun exemplaire disponible.')
                    : copies.map(copy => `
                        <div class="copy-card flex items-center justify-between border border-gray-100 rounded-xl px-5 py-4 mb-2 hover:border-black transition-all">
                            <div>
                                <div class="font-medium text-sm">${copy.library.libraryName}</div>
                                <div class="text-xs text-gray-400 mt-0.5">${copy.library.location}, ${copy.library.city}</div>
                                <div class="text-xs text-gray-300 mt-0.5">Acquis le ${copy.acquisitionDate}</div>
                            </div>
                            ${renderBadge('Disponible')}
                        </div>
                    `).join('')
                }
            </div>
        `;
    }

    load();
}