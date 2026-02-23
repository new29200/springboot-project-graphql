const GQL_ENDPOINT = 'http://localhost:8080/graphql';

async function gql(query) {
    try {
        const res = await fetch(GQL_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query })
        });
        const json = await res.json();
        if (json.errors) console.error('GraphQL errors:', json.errors);
        return json.data;
    } catch (err) {
        console.error('Fetch error:', err);
        throw err;
    }
}

const API = {

    // ── Auth ─────────────────────────────────────────────────
    login: (email, passWord) => gql(`mutation {
        login(email: "${email}", passWord: "${passWord}") {
            userId firstName lastName email city address postalCode phone
            rang { rangId rang }
        }
    }`),

    userByEmail: (email) => gql(`query {
        userByEmail(email: "${email}") {
            userId firstName lastName email city
            rang { rangId rang }
        }
    }`),

    // ── Authors ──────────────────────────────────────────────
    authors: () => gql(`query {
        authors { authorId firstName lastName country birthDate deathDate }
    }`),

    author: (id) => gql(`query {
        author(authorId: "${id}") {
            authorId firstName lastName country birthDate deathDate
            books { bookId title isbn publishDate genre { genre } }
        }
    }`),

    createAuthor: (firstName, lastName, country, birthDate) => gql(`mutation {
        createAuthor(firstName: "${firstName}", lastName: "${lastName}", country: "${country}", birthDate: "${birthDate}") {
            authorId firstName lastName
        }
    }`),

    updateAuthor: (id, firstName, lastName, country) => gql(`mutation {
        updateAuthor(authorId: "${id}", firstName: "${firstName}", lastName: "${lastName}", country: "${country}") {
            authorId firstName lastName country
        }
    }`),

    deleteAuthor: (id) => gql(`mutation {
        deleteAuthor(authorId: "${id}")
    }`),

    // ── Books ────────────────────────────────────────────────
    books: () => gql(`query {
        books {
            bookId title isbn publishDate
            author { authorId firstName lastName }
            genre { genreId genre }
            edition { editionId editionName city country }
            type { typeId type }
        }
    }`),

    book: (id) => gql(`query {
        book(bookId: "${id}") {
            bookId title isbn publishDate
            author { authorId firstName lastName country birthDate }
            genre { genreId genre }
            edition { editionId editionName city country createDate }
            type { typeId type }
        }
        copiesByBook(bookId: "${id}") {
            copyId acquisitionDate
            library { libraryId libraryName city location nature }
        }
    }`),

    booksByTitle: (title) => gql(`query {
        booksByTitle(title: "${title}") {
            bookId title isbn publishDate
            author { firstName lastName }
            genre { genreId genre }
            edition { editionName }
        }
    }`),

    createBook: (isbn, title, publishDate, authorId, editionId, genreId, typeId) => gql(`mutation {
        createBook(isbn: "${isbn}", title: "${title}", publishDate: "${publishDate}", authorId: "${authorId}", editionId: "${editionId}", genreId: "${genreId}", typeId: "${typeId}") {
            bookId title isbn
        }
    }`),

    deleteBook: (id) => gql(`mutation {
        deleteBook(bookId: "${id}")
    }`),

    // ── Genres ───────────────────────────────────────────────
    genres: () => gql(`query {
        genres { genreId genre }
    }`),

    createGenre: (genre) => gql(`mutation {
        createGenre(genre: "${genre}") { genreId genre }
    }`),

    updateGenre: (id, genre) => gql(`mutation {
        updateGenre(genreId: "${id}", genre: "${genre}") { genreId genre }
    }`),

    deleteGenre: (id) => gql(`mutation {
        deleteGenre(genreId: "${id}")
    }`),

    // ── Types ────────────────────────────────────────────────
    types: () => gql(`query {
        types { typeId type }
    }`),

    // ── Editions ─────────────────────────────────────────────
    editions: () => gql(`query {
        editions { editionId editionName city country createDate }
    }`),

    // ── Libraries ────────────────────────────────────────────
    libraries: () => gql(`query {
        libraries { libraryId libraryName createDate location city nature endDate }
    }`),

    createLibrary: (libraryName, createDate, location, city, nature) => gql(`mutation {
        createLibrary(libraryName: "${libraryName}", createDate: "${createDate}", location: "${location}", city: "${city}", nature: "${nature}") {
            libraryId libraryName
        }
    }`),

    // ── Members ──────────────────────────────────────────────
    members: () => gql(`query {
        members {
            memberId firstName lastName email phone city active
            library { libraryId libraryName }
        }
    }`),

    createMember: (lastName, firstName, address, postalCode, city, email, phone, passWord, libraryId) => gql(`mutation {
        createMember(lastName: "${lastName}", firstName: "${firstName}", address: "${address}", postalCode: "${postalCode}", city: "${city}", email: "${email}", phone: "${phone}", passWord: "${passWord}", libraryId: "${libraryId}") {
            memberId firstName lastName
        }
    }`),

    deleteMember: (id) => gql(`mutation {
        deleteMember(memberId: "${id}")
    }`),

    memberByEmail: (email) => gql(`query {
        memberByEmail(email: "${email}") {
            memberId firstName lastName
            library { libraryId libraryName }
        }
    }`),

    // ── Loans ────────────────────────────────────────────────
    loans: () => gql(`query {
        loans {
            loanId loanDate dueDate returnDate
            member { memberId firstName lastName }
            copy {
                copyId
                book { bookId title }
                library { libraryName }
            }
        }
    }`),

    loansByMember: (memberId) => gql(`query {
        loansByMember(memberId: "${memberId}") {
            loanId loanDate dueDate returnDate
            copy {
                book { title }
                library { libraryName }
            }
        }
    }`),

    createLoan: (copyId, memberId, loanDate, dueDate) => gql(`mutation {
        createLoan(copyId: "${copyId}", memberId: "${memberId}", loanDate: "${loanDate}", dueDate: "${dueDate}") {
            loanId loanDate dueDate
        }
    }`),

    returnLoan: (loanId, returnDate) => gql(`mutation {
        returnLoan(loanId: "${loanId}", returnDate: "${returnDate}") {
            loanId returnDate
        }
    }`),

    // ── Copies ───────────────────────────────────────────────
    copies: () => gql(`query {
        copies {
            copyId acquisitionDate
            book { bookId title }
            library { libraryId libraryName }
        }
    }`),

    copiesByBook: (bookId) => gql(`query {
        copiesByBook(bookId: "${bookId}") {
            copyId acquisitionDate
            library { libraryId libraryName city location }
        }
    }`),

    createCopy: (bookId, libraryId, acquisitionDate) => gql(`mutation {
        createCopy(bookId: "${bookId}", libraryId: "${libraryId}", acquisitionDate: "${acquisitionDate}") {
            copyId acquisitionDate
        }
    }`),

    isCopyAvailable: (copyId) => gql(`query {
        isCopyAvailable(copyId: "${copyId}")
    }`),

    memberByEmail: (email) => gql(`query {
        memberByEmail(email: "${email}") {
            memberId firstName lastName
            library { libraryId libraryName }
        }
    }`),
};