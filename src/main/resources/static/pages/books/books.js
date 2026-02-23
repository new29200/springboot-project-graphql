const PAGE = window.location.pathname.includes('detail') ? 'detail' : 'list';
import { BooksAPI } from '/js/api/books.js';
import { AuthorsAPI } from '/js/api/authors.js';
import { GenresAPI, EditionsAPI, TypesAPI } from '/js/api/catalog.js';
import { LibrariesAPI } from '/js/api/libraries.js';
import { CopiesAPI } from '../../js/api/copies.js';

if (PAGE === 'list') {
    initPage('books');

    const isStaff = Auth.isStaff();

    document.getElementById('page-header').innerHTML = renderPageHeader('Catalogue', 'Livres');
    document.getElementById('table-head').innerHTML  = renderTableHead(['Titre', 'Auteur', 'Genre', 'Édition', 'ISBN', '']);

    if (isStaff) {
        document.getElementById('staff-actions').classList.remove('hidden');
    }

    let allBooks = [];

    async function load() {
        const [bookData, authorData, genreData, editionData, typeData, libData] = await Promise.all([
            BooksAPI.getAll(), AuthorsAPI.getAll(), GenresAPI.getAll(), EditionsAPI.getAll(), TypesAPI.getAll(), LibrariesAPI.getAll()
        ]);

        allBooks = bookData.books;

        populateSelect('filter-author', authorData.authors,   a => a.authorId,  a => `${a.firstName} ${a.lastName}`);
        populateSelect('filter-genre',  genreData.genres,     g => g.genreId,   g => g.genre);

        if (isStaff) {
            populateSelect('b-authorId',     authorData.authors,   a => a.authorId,  a => `${a.firstName} ${a.lastName}`);
            populateSelect('b-editionId',    editionData.editions, e => e.editionId, e => e.editionName);
            populateSelect('b-genreId',      genreData.genres,     g => g.genreId,   g => g.genre);
            populateSelect('b-typeId',       typeData.types,       t => t.typeId,    t => t.type);
            populateSelect('copy-libraryId', libData.libraries,    l => l.libraryId, l => l.libraryName);
            document.getElementById('copy-acquisitionDate').value = new Date().toISOString().split('T')[0];
        }

        const params = new URLSearchParams(window.location.search);
        if (params.get('genreId'))  document.getElementById('filter-genre').value  = params.get('genreId');
        if (params.get('authorId')) document.getElementById('filter-author').value = params.get('authorId');

        applyFilters();
    }

    function populateSelect(id, items, valFn, labelFn) {
        const sel = document.getElementById(id);
        if (!sel) return;
        items.forEach(item => {
            const opt = document.createElement('option');
            opt.value = valFn(item);
            opt.textContent = labelFn(item);
            sel.appendChild(opt);
        });
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
        document.getElementById('search-title').value  = '';
        document.getElementById('filter-author').value = '';
        document.getElementById('filter-genre').value  = '';
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

        tbody.innerHTML = books.map(book => {
            const actions = isStaff ? `
                <div class="flex gap-2">
                    <a href="/pages/books/detail.html?id=${book.bookId}"
                       class="text-xs border border-gray-200 px-3 py-1.5 rounded-lg hover:border-black transition-colors">
                        Détail
                    </a>
                    <button onclick="openAddCopy('${book.bookId}', this)"
                        data-title="${book.title.replace(/"/g, '&quot;')}"
                        class="text-xs border border-gray-200 px-3 py-1.5 rounded-lg hover:border-black transition-colors whitespace-nowrap">
                        + Exemplaire
                    </button>
                    <button onclick="doDeleteBook('${book.bookId}')"
                        class="text-xs border border-red-100 text-red-400 px-3 py-1.5 rounded-lg hover:border-red-400 transition-colors">
                        Supprimer
                    </button>
                </div>
            ` : `
                <a href="/pages/books/detail.html?id=${book.bookId}"
                   class="text-xs border border-gray-200 px-3 py-1.5 rounded-lg hover:border-black transition-colors">
                    Détail →
                </a>
            `;

            return renderTableRow([
                { content: book.title, class: 'py-3 pr-6 font-medium' },
                { content: `${book.author.firstName} ${book.author.lastName}` },
                { content: book.genre.genre },
                { content: book.edition.editionName },
                { content: book.isbn, class: 'py-3 pr-6 text-gray-300 font-mono text-xs' },
                { content: actions, class: 'py-3' }
            ]);
        }).join('');
    }

    // ── Créer livre ──────────────────────────────────────────
    async function createBook() {
        const title       = document.getElementById('b-title').value.trim();
        const isbn        = document.getElementById('b-isbn').value.trim();
        const publishDate = document.getElementById('b-publishDate').value;
        const authorId    = document.getElementById('b-authorId').value;
        const editionId   = document.getElementById('b-editionId').value;
        const genreId     = document.getElementById('b-genreId').value;
        const typeId      = document.getElementById('b-typeId').value;

        if (!title || !isbn || !publishDate) {
            showToast('Veuillez remplir tous les champs', 'error');
            return;
        }

        await BooksAPI.createBook(isbn, title, publishDate, authorId, editionId, genreId, typeId);
        showToast('Livre créé avec succès');
        closeModal('modal-create-book');

        const data = await BooksAPI.getAll();
        allBooks = data.books;
        applyFilters();
    }

    // ── Supprimer livre — nom global pour le onclick HTML ────
    async function doDeleteBook(bookId) {
        if (!window.confirm('Supprimer ce livre ?')) return;
        await BooksAPI.deleteBook(bookId);
        showToast('Livre supprimé');
        allBooks = allBooks.filter(b => b.bookId != bookId);
        applyFilters();
    }

    // ── Ajouter exemplaire ───────────────────────────────────
    function openAddCopy(bookId, btn) {
        const title = btn.dataset.title;
        document.getElementById('copy-bookId').value          = bookId;
        document.getElementById('copy-book-title').textContent = title;
        openModal('modal-add-copy');
    }

    async function addCopy() {
        const bookId          = document.getElementById('copy-bookId').value;
        const libraryId       = document.getElementById('copy-libraryId').value;
        const acquisitionDate = document.getElementById('copy-acquisitionDate').value;

        if (!libraryId || !acquisitionDate) {
            showToast('Veuillez remplir tous les champs', 'error');
            return;
        }

        await BooksAPI.createCopy(bookId, libraryId, acquisitionDate);
        showToast('Exemplaire ajouté');
        closeModal('modal-add-copy');
    }

    // Exposer au HTML
    window.createBook   = createBook;
    window.doDeleteBook = doDeleteBook;
    window.openAddCopy  = openAddCopy;
    window.addCopy      = addCopy;
    window.applyFilters = applyFilters;
    window.resetFilters = resetFilters;

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

        // Deux queries séparées pour éviter les nulls
        const [bookData, copiesData] = await Promise.all([
            BooksAPI.getAll(),         // on prend depuis la liste complète
            CopiesAPI.getByBook(id)
        ]);

        const book   = bookData.books?.find(b => b.bookId == id);
        const copies = copiesData.copiesByBook || [];

        if (!book) {
            document.getElementById('content').innerHTML = renderEmpty('Livre introuvable.');
            return;
        }

        document.title = `${book.title} — Bibliothèque`;

        document.getElementById('content').innerHTML = `
            <div class="flex gap-10 mb-12">
                <div class="book-cover bg-gray-50 border border-gray-100 rounded-xl w-36 h-52 flex items-center justify-center flex-shrink-0">
                    <span class="text-5xl">📚</span>
                </div>
                <div class="flex flex-col justify-center gap-1">
                    <span class="text-xs tracking-widest text-gray-400 uppercase">${book.genre.genre}</span>
                    <h1 class="serif text-4xl leading-tight">${book.title}</h1>
                    <p class="text-gray-500">${book.author.firstName} ${book.author.lastName}</p>
                    <p class="text-sm text-gray-400">Publié le ${book.publishDate}</p>
                    <p class="text-xs text-gray-300 font-mono">${book.isbn}</p>
                </div>
            </div>

            <div class="grid grid-cols-3 gap-4 mb-12">
                ${renderInfoCard('Auteur', `${book.author.firstName} ${book.author.lastName}`, book.author.country || '—')}
                ${renderInfoCard('Édition', book.edition.editionName, `${book.edition.city}, ${book.edition.country}`)}
                ${renderInfoCard('Type', book.type.type, book.genre.genre)}
            </div>

            <div>
                <h2 class="text-lg font-semibold mb-1">Disponibilité</h2>
                <p class="text-sm text-gray-400 mb-5">${copies.length} exemplaire${copies.length > 1 ? 's' : ''} dans le réseau</p>
                ${copies.length === 0
                    ? renderEmpty('Aucun exemplaire disponible.')
                    : copies.map(copy => `
                        <div class="flex items-center justify-between border border-gray-100 rounded-xl px-5 py-4 mb-2 hover:border-black transition-all">
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