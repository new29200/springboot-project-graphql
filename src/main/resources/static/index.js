// index.js — Page d'accueil
initPage('');

let allBooks  = [];
let allGenres = [];

async function load() {
    const [genreData, bookData] = await Promise.all([
        API.genres(),
        API.books()
    ]);

    allGenres = genreData.genres;
    allBooks  = bookData.books;

    renderPillGroup(
        'genres-pills',
        allGenres.map(g => ({ id: g.genreId, label: g.genre })),
        (genreId) => renderBooks(genreId)
    );

    renderBooks(null);
}

function renderBooks(activeGenreId) {
    const container = document.getElementById('books-container');
    container.innerHTML = '';

    const genres = activeGenreId
        ? allGenres.filter(g => g.genreId == activeGenreId)
        : allGenres;

    let hasContent = false;

    genres.forEach(genre => {
        const books = allBooks.filter(b => b.genre.genreId == genre.genreId);
        if (books.length === 0) return;
        hasContent = true;

        const section = document.createElement('div');
        section.className = 'mb-14 fade-in';
        section.innerHTML = `
            <div class="flex items-baseline justify-between mb-5">
                <h2 class="text-xl font-semibold">
                    ${genre.genre}
                    <span class="text-gray-300 text-base font-normal ml-2">
                        ${books.length} livre${books.length > 1 ? 's' : ''}
                    </span>
                </h2>
                <a href="/pages/books/index.html?genreId=${genre.genreId}"
                   class="text-xs text-gray-400 hover:text-black transition-colors">
                    Voir tout →
                </a>
            </div>
            <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                ${books.map(book => `
                    <a href="/pages/books/detail.html?id=${book.bookId}" class="group">
                        <div class="bg-gray-50 border border-gray-100 rounded-lg h-36 mb-3 flex items-center justify-center group-hover:border-black transition-all">
                            <span class="text-4xl"></span>
                        </div>
                        <div class="text-sm font-medium leading-snug mb-1 group-hover:underline">${book.title}</div>
                        <div class="text-xs text-gray-400">${book.author.firstName} ${book.author.lastName}</div>
                    </a>
                `).join('')}
            </div>
        `;
        container.appendChild(section);
    });

    if (!hasContent) {
        container.innerHTML = renderEmpty('Aucun livre dans cette catégorie');
    }
}

load();