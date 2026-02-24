import { LoansAPI } from '/js/api/loans.js';

initPage('my-loans');

document.getElementById('page-header').innerHTML = renderPageHeader('Mon compte', 'Mes prêts');

initTabs([
    { btnId: 'tab-active',  panelId: 'panel-active'  },
    { btnId: 'tab-history', panelId: 'panel-history' },
]);

function isOverdue(dueDate) { return new Date(dueDate) < new Date(); }

async function load() {
    const user     = Auth.getUser();
    const memberId = user?.userId;
    const memberEmail = user?.email;

    if (!memberId) {
        window.location.href = '/pages/login/index.html';
        return;
    }

    const data   = await LoansAPI.getByMember(memberEmail);
    const loans  = data?.loansByMember || [];
    
    const active   = loans.filter(l => !l.returnDate);
    const returned = loans.filter(l =>  l.returnDate);
    
    document.getElementById('stats').innerHTML =
        renderStatCard('En cours',  active.length)   +
        renderStatCard('Retournés', returned.length) +
        renderStatCard('Total',     loans.length);

    // Table prêts actifs
    document.getElementById('active-head').innerHTML  = renderTableHead(['Livre', 'Bibliothèque', 'Date prêt', 'Retour prévu', 'Statut']);
    document.getElementById('history-head').innerHTML = renderTableHead(['Livre', 'Bibliothèque', 'Date prêt', 'Date retour', 'Statut']);

    const activeTable = document.getElementById('active-table');
    if (active.length === 0) {
        activeTable.innerHTML = `<tr><td colspan="5">${renderEmpty('Aucun prêt en cours')}</td></tr>`;
    } else {
        activeTable.innerHTML = active.map(loan => {
            const overdue = isOverdue(loan.dueDate);
            return renderTableRow([
                { content: loan.copy.book.title, class: 'py-3 pr-6 font-medium' },
                { content: loan.copy.library.libraryName },
                { content: loan.loanDate },
                { content: loan.dueDate, class: `py-3 pr-6 ${overdue ? 'text-red-400' : 'text-gray-400'}` },
                { content: overdue ? renderBadge('En retard', 'red') : renderBadge('En cours'), class: 'py-3' },
            ]);
        }).join('');
    }

    const histTable = document.getElementById('history-table');
    if (returned.length === 0) {
        histTable.innerHTML = `<tr><td colspan="5">${renderEmpty('Aucun historique')}</td></tr>`;
    } else {
        histTable.innerHTML = returned.map(loan => renderTableRow([
            { content: loan.copy.book.title, class: 'py-3 pr-6 font-medium' },
            { content: loan.copy.library.libraryName },
            { content: loan.loanDate },
            { content: loan.returnDate },
            { content: renderBadge('Retourné', 'outline'), class: 'py-3' },
        ])).join('');
    }
}

load();