import { gql } from './client.js';

export const LoansAPI = {
    getAll: () => gql(`query {
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

    getByMember: (memberId) => gql(`query {
        loansByMember(memberId: "${memberId}") {
            loanId loanDate dueDate returnDate
            copy {
                book { title }
                library { libraryName }
            }
        }
    }`),

    create: (copyId, memberId, loanDate, dueDate) => gql(`mutation {
        createLoan(copyId: "${copyId}", memberId: "${memberId}", loanDate: "${loanDate}", dueDate: "${dueDate}") {
            loanId loanDate dueDate
        }
    }`),

    return: (loanId, returnDate) => gql(`mutation {
        returnLoan(loanId: "${loanId}", returnDate: "${returnDate}") {
            loanId returnDate
        }
    }`),
};
