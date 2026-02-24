import { gql } from './client.js';

export const LibrariesAPI = {
    getAll: () => gql(`query {
        libraries { libraryId libraryName createDate location city nature endDate }
    }`),

    create: (libraryName, createDate, location, city, nature) => gql(`mutation {
        createLibrary(libraryName: "${libraryName}", createDate: "${createDate}", location: "${location}", city: "${city}", nature: "${nature}") {
            libraryId libraryName
        }
    }`),
};
