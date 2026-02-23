import { gql } from './client.js';

const USER_FIELDS = `
    userId firstName lastName email city address postalCode phone
    rang { rangId rang }
`;

const USER_FIELDS_MINIMAL = `
    userId firstName lastName email city
    rang { rangId rang }
`;

export const AuthAPI = {
    login: (email, passWord) => gql(`mutation {
        login(email: "${email}", passWord: "${passWord}") { ${USER_FIELDS} }
    }`),

    userByEmail: (email) => gql(`query {
        userByEmail(email: "${email}") { ${USER_FIELDS_MINIMAL} }
    }`),
};
