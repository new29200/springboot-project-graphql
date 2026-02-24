import { LoansAPI } from '/js/api/loans.js';
import { MembersAPI } from '/js/api/members.js';
import { BooksAPI } from '/js/api/books.js';
import { CopiesAPI } from '/js/api/copies.js';

initPage('loans', false, true);

document.getElementById('page-header').innerHTML  = renderPageHeader('Gestion', 'Prêts');
document.getElementById('active-head').innerHTML  = renderTableHead(['Livre', 'Membre', 'Bibliothèque', 'Date prêt', 'Retour prévu', 'Statut', '']);
document.getElementById('history-head').innerHTML = renderTableHead(['Livre', 'Membre', 'Date prêt', 'Date retour', 'Statut']);

initTabs([
    { btnId: 'tab-active',  panelId: 'panel-active'  },
    { btnId: 'tab-history', panelId: 'panel-history' },
]);

function isOverdue(dueDate) { return new Date(dueDate) < new Date(); }
function today()   { return new Date().toISOString().split('T')[0]; }
function inDays(n) { const d = new Date(); d.setDate(d.getDate() + n); return d.toISOString().split('T')[0]; }

let allLoans = [];

async function load() {
    const [loanData, memberData, bookData] = await Promise.all([
        LoansAPI.getAll(),
        MembersAPI.getAll(),
        BooksAPI.getAll()
    ]);

    allLoans = loanData.loans || [];

    const active   = allLoans.filter(l => !l.returnDate);
    const returned = allLoans.filter(l =>  l.returnDate);

    document.getElementById('stats').innerHTML =
        renderStatCard('En cours',  active.length)   +
        renderStatCard('Retournés', returned.length) +
        renderStatCard('Total',     allLoans.length);

    // Populate membres actifs
    const memberSelect = document.getElementById('loan-memberId');
    (memberData.members || []).filter(m => m.active).forEach(m => {
        const opt = document.createElement('option');
        opt.value = m.memberId;
        opt.textContent = `${m.firstName} ${m.lastName}`;
        memberSelect.appendChild(opt);
    });

    // Populate livres
    const bookSelect = document.getElementById('loan-bookId');
    (bookData.books || []).forEach(b => {
        const opt = document.createElement('option');
        opt.value = b.bookId;
        opt.textContent = b.title;
        bookSelect.appendChild(opt);
    });

    document.getElementById('loan-loanDate').value = today();
    document.getElementById('loan-dueDate').value  = inDays(21);
    document.getElementById('return-date').value   = today();

    if (bookData.books?.length > 0) await loadCopies();

    renderLoans(active, returned);
}

async function loadCopies() {
    const bookId = document.getElementById('loan-bookId').value;
    if (!bookId) return;

    const data   = await CopiesAPI.getByBook(bookId);
    const copies = data?.copiesByBook || [];

    const copySelect = document.getElementById('loan-copyId');
    copySelect.innerHTML = '';

    if (copies.length === 0) {
        const opt = document.createElement('option');
        opt.textContent = 'Aucun exemplaire';
        opt.disabled = true;
        copySelect.appendChild(opt);
        return;
    }

    for (const copy of copies) {
        const availData = await CopiesAPI.isAvailable(copy.copyId);
        const available = availData?.isCopyAvailable ?? true;

        const opt = document.createElement('option');
        opt.value = copy.copyId;
        opt.textContent = `${copy.library.libraryName} — ${available ? '✓ Disponible' : '✗ Emprunté'}`;
        opt.disabled = !available;
        copySelect.appendChild(opt);
    }
}

function renderLoans(active, returned) {
    const activeTable = document.getElementById('active-table');
    if (active.length === 0) {
        activeTable.innerHTML = `<tr><td colspan="7">${renderEmpty('Aucun prêt en cours')}</td></tr>`;
    } else {
        activeTable.innerHTML = active.map(loan => {
            const overdue = isOverdue(loan.dueDate);
            return renderTableRow([
                { content: loan.copy.book.title, class: 'py-3 pr-6 font-medium' },
                { content: `${loan.member.firstName} ${loan.member.lastName}` },
                { content: loan.copy.library.libraryName },
                { content: loan.loanDate },
                { content: loan.dueDate, class: `py-3 pr-6 ${overdue ? 'text-red-400' : 'text-gray-400'}` },
                { content: overdue ? renderBadge('En retard', 'red') : renderBadge('En cours'), class: 'py-3' },
                {
                    content: `<button onclick="doOpenReturn('${loan.loanId}', '${loan.copy.book.title.replace(/'/g, "\\'")}', '${loan.member.firstName} ${loan.member.lastName}')"
                        class="text-xs border border-gray-200 px-3 py-1.5 rounded-lg hover:border-black transition-colors whitespace-nowrap">
                        Retour →
                    </button>`,
                    class: 'py-3'
                }
            ]);
        }).join('');
    }

    const histTable = document.getElementById('history-table');
    if (returned.length === 0) {
        histTable.innerHTML = `<tr><td colspan="5">${renderEmpty('Aucun historique')}</td></tr>`;
    } else {
        histTable.innerHTML = returned.map(loan => renderTableRow([
            { content: loan.copy.book.title, class: 'py-3 pr-6 font-medium' },
            { content: `${loan.member.firstName} ${loan.member.lastName}` },
            { content: loan.loanDate },
            { content: loan.returnDate },
            { content: renderBadge('Retourné', 'outline'), class: 'py-3' }
        ])).join('');
    }
}

// ── Créer prêt ───────────────────────────────────────────────
async function createLoan() {
    const copyId   = document.getElementById('loan-copyId').value;
    const memberId = document.getElementById('loan-memberId').value;
    const loanDate = document.getElementById('loan-loanDate').value;
    const dueDate  = document.getElementById('loan-dueDate').value;

    if (!copyId || !memberId || !loanDate || !dueDate) {
        showToast('Veuillez remplir tous les champs', 'error');
        return;
    }

    await LoansAPI.create(copyId, memberId, loanDate, dueDate);
    showToast('Prêt créé avec succès');
    closeModal('modal-create');

    const data = await LoansAPI.getAll();
    allLoans = data.loans || [];
    renderLoans(allLoans.filter(l => !l.returnDate), allLoans.filter(l => l.returnDate));
}

// ── Retour ───────────────────────────────────────────────────
function doOpenReturn(loanId, bookTitle, memberName) {
    document.getElementById('return-loanId').value     = loanId;
    document.getElementById('return-info').textContent = `"${bookTitle}" — ${memberName}`;
    document.getElementById('return-date').value       = today();
    openModal('modal-return');
}

async function confirmReturn() {
    const loanId     = document.getElementById('return-loanId').value;
    const returnDate = document.getElementById('return-date').value;

    await LoansAPI.return(loanId, returnDate);
    showToast('Retour enregistré');
    closeModal('modal-return');

    const data = await LoansAPI.getAll();
    allLoans = data.loans || [];
    renderLoans(allLoans.filter(l => !l.returnDate), allLoans.filter(l => l.returnDate));
}

// Exposer au HTML
window.loadCopies    = loadCopies;
window.createLoan    = createLoan;
window.doOpenReturn  = doOpenReturn;
window.confirmReturn = confirmReturn;

load();