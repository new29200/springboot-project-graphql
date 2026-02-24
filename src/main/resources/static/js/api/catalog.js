import { gql } from './client.js';

export const GenresAPI = {
    getAll: () => gql(`query { genres { genreId genre } }`),

    create: (genre) => gql(`mutation {
        createGenre(genre: "${genre}") { genreId genre }
    }`),

    update: (id, genre) => gql(`mutation {
        updateGenre(genreId: "${id}", genre: "${genre}") { genreId genre }
    }`),

    delete: (id) => gql(`mutation {
        deleteGenre(genreId: "${id}")
    }`),
};

export const TypesAPI = {
    getAll: () => gql(`query { types { typeId type } }`),
};

export const EditionsAPI = {
    getAll: () => gql(`query { editions { editionId editionName city country createDate } }`),
};
