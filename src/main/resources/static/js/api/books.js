import { gql } from './client.js';

const BOOK_FIELDS = `
    bookId title isbn publishDate
    author { authorId firstName lastName }
    genre { genreId genre }
    edition { editionId editionName city country }
    type { typeId type }
`;

const BOOK_FIELDS_DETAILED = `
    bookId title isbn publishDate
    author { authorId firstName lastName country birthDate }
    genre { genreId genre }
    edition { editionId editionName city country createDate }
    type { typeId type }
`;

export const BooksAPI = {
    getAll: () => gql(`query {
        books { ${BOOK_FIELDS} }
    }`),

    getById: (id) => gql(`query {
        book(bookId: "${id}") { ${BOOK_FIELDS_DETAILED} }
        copiesByBook(bookId: "${id}") {
            copyId acquisitionDate
            library { libraryId libraryName city location nature }
        }
    }`),

    searchByTitle: (title) => gql(`query {
        booksByTitle(title: "${title}") {
            bookId title isbn publishDate
            author { firstName lastName }
            genre { genreId genre }
            edition { editionName }
        }
    }`),

    create: (isbn, title, publishDate, authorId, editionId, genreId, typeId) => gql(`mutation {
        createBook(isbn: "${isbn}", title: "${title}", publishDate: "${publishDate}", authorId: "${authorId}", editionId: "${editionId}", genreId: "${genreId}", typeId: "${typeId}") {
            bookId title isbn
        }
    }`),

    delete: (id) => gql(`mutation {
        deleteBook(bookId: "${id}")
    }`),
};
