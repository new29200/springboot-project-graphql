import { gql } from './client.js';

export const CopiesAPI = {
    getAll: () => gql(`query {
        copies {
            copyId acquisitionDate
            book { bookId title }
            library { libraryId libraryName }
        }
    }`),

    getByBook: (bookId) => gql(`query {
        copiesByBook(bookId: "${bookId}") {
            copyId acquisitionDate
            library { libraryId libraryName city location }
        }
    }`),

    create: (bookId, libraryId, acquisitionDate) => gql(`mutation {
        createCopy(bookId: "${bookId}", libraryId: "${libraryId}", acquisitionDate: "${acquisitionDate}") {
            copyId acquisitionDate
        }
    }`),

    isAvailable: (copyId) => gql(`query {
        isCopyAvailable(copyId: "${copyId}")
    }`),
};
