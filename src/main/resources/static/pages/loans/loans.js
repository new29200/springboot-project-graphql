// loans.js — Logique page Prêts
initPage('loans');

const currentUser = Auth.getUser();
const isMember    = currentUser?.rang?.rang === 'Member';
let currentMember = null;

function isOverdue(dueDate) {
    return new Date(dueDate) < new Date();
}

async function load() {

    // Si Member, on récupère son profil membre par email
    if (isMember) {
        const memberData = await API.memberByEmail(currentUser.email);
        currentMember = memberData?.memberByEmail;
    }

    // Adapter les headers selon le rang
    if (isMember) {
        document.getElementById('page-header').innerHTML  = renderPageHeader('Mes', 'Prêts');
        document.getElementById('active-head').innerHTML  = renderTableHead(['Livre', 'Bibliothèque', 'Date prêt', 'Retour prévu', 'Statut']);
        document.getElementById('history-head').innerHTML = renderTableHead(['Livre', 'Date prêt', 'Date retour', 'Statut']);
    } else {
        document.getElementById('page-header').innerHTML  = renderPageHeader('Gestion', 'Prêts');
        document.getElementById('active-head').innerHTML  = renderTableHead(['Livre', 'Membre', 'Bibliothèque', 'Date prêt', 'Retour prévu', 'Statut']);
        document.getElementById('history-head').innerHTML = renderTableHead(['Livre', 'Membre', 'Date prêt', 'Date retour', 'Statut']);
    }

    initTabs([
        { btnId: 'tab-active',  panelId: 'panel-active' },
        { btnId: 'tab-history', panelId: 'panel-history' },
    ]);

    const data = await API.loans();
    let loans  = data.loans;

    // ✅ Filtrage si Member
    if (isMember && currentMember) {
        loans = loans.filter(l => l.member.memberId == currentMember.memberId);
    }

    const active   = loans.filter(l => !l.returnDate);
    const returned = loans.filter(l =>  l.returnDate);

    // Stats
    document.getElementById('stats').innerHTML =
        renderStatCard('En cours',  active.length)   +
        renderStatCard('Retournés', returned.length) +
        renderStatCard('Total',     loans.length);

    // Table prêts actifs
    const activeTable = document.getElementById('active-table');
    if (active.length === 0) {
        activeTable.innerHTML = `<tr><td colspan="${isMember ? 5 : 6}">${renderEmpty('Aucun prêt en cours')}</td></tr>`;
    } else {
        activeTable.innerHTML = active.map(loan => {
            const overdue = isOverdue(loan.dueDate);
            const cols = isMember ? [
                { content: loan.copy.book.title, class: 'py-3 pr-6 font-medium' },
                { content: loan.copy.library.libraryName },
                { content: loan.loanDate },
                { content: loan.dueDate, class: `py-3 pr-6 ${overdue ? 'text-red-400' : 'text-gray-400'}` },
                { content: overdue ? renderBadge('En retard', 'red') : renderBadge('En cours'), class: 'py-3' }
            ] : [
                { content: loan.copy.book.title, class: 'py-3 pr-6 font-medium' },
                { content: `${loan.member.firstName} ${loan.member.lastName}` },
                { content: loan.copy.library.libraryName },
                { content: loan.loanDate },
                { content: loan.dueDate, class: `py-3 pr-6 ${overdue ? 'text-red-400' : 'text-gray-400'}` },
                { content: overdue ? renderBadge('En retard', 'red') : renderBadge('En cours'), class: 'py-3' }
            ];
            return renderTableRow(cols);
        }).join('');
    }

    // Table historique
    const histTable = document.getElementById('history-table');
    if (returned.length === 0) {
        histTable.innerHTML = `<tr><td colspan="${isMember ? 4 : 5}">${renderEmpty('Aucun historique')}</td></tr>`;
    } else {
        histTable.innerHTML = returned.map(loan => {
            const cols = isMember ? [
                { content: loan.copy.book.title, class: 'py-3 pr-6 font-medium' },
                { content: loan.loanDate },
                { content: loan.returnDate },
                { content: renderBadge('Retourné', 'outline'), class: 'py-3' }
            ] : [
                { content: loan.copy.book.title, class: 'py-3 pr-6 font-medium' },
                { content: `${loan.member.firstName} ${loan.member.lastName}` },
                { content: loan.loanDate },
                { content: loan.returnDate },
                { content: renderBadge('Retourné', 'outline'), class: 'py-3' }
            ];
            return renderTableRow(cols);
        }).join('');
    }
}

load();