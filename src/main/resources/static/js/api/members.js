import { gql } from './client.js';

export const MembersAPI = {
    getAll: () => gql(`query {
        members {
            memberId firstName lastName email phone city active
            library { libraryId libraryName }
        }
    }`),

    getByEmail: (email) => gql(`query {
        memberByEmail(email: "${email}") {
            memberId firstName lastName
            library { libraryId libraryName }
        }
    }`),

    create: (lastName, firstName, address, postalCode, city, email, phone, passWord, libraryId) => gql(`mutation {
        createMember(lastName: "${lastName}", firstName: "${firstName}", address: "${address}", postalCode: "${postalCode}", city: "${city}", email: "${email}", phone: "${phone}", passWord: "${passWord}", libraryId: "${libraryId}") {
            memberId firstName lastName
        }
    }`),

    update: (memberId, address, city, phone, active) => gql(`mutation {
        updateMember(memberId: "${memberId}", address: "${address}", city: "${city}", phone: "${phone}", active: ${active}) {
            memberId firstName lastName active
        }
    }`),

    delete: (id) => gql(`mutation {
        deleteMember(memberId: "${id}")
    }`),
};
