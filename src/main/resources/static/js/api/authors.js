import { gql } from './client.js';

const AUTHOR_FIELDS = `authorId firstName lastName country birthDate deathDate`;

const AUTHOR_WITH_BOOKS = `
    ${AUTHOR_FIELDS}
    books { bookId title isbn publishDate genre { genre } }
`;

export const AuthorsAPI = {
    getAll: () => gql(`query {
        authors { ${AUTHOR_FIELDS} }
    }`),

    getById: (id) => gql(`query {
        author(authorId: "${id}") { ${AUTHOR_WITH_BOOKS} }
    }`),

    create: (firstName, lastName, country, birthDate) => gql(`mutation {
        createAuthor(firstName: "${firstName}", lastName: "${lastName}", country: "${country}", birthDate: "${birthDate}") {
            authorId firstName lastName
        }
    }`),

    update: (id, firstName, lastName, country) => gql(`mutation {
        updateAuthor(authorId: "${id}", firstName: "${firstName}", lastName: "${lastName}", country: "${country}") {
            authorId firstName lastName country
        }
    }`),

    delete: (id) => gql(`mutation {
        deleteAuthor(authorId: "${id}")
    }`),
};
