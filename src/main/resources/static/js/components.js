function initPage(activePage = '', requireAuth = false, requireStaff = false) {
    // Guards
    if (requireStaff && !Auth.requireStaff()) return;
    if (requireAuth  && !Auth.requireAuth())  return;

    // Google Fonts
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&family=DM+Serif+Display&display=swap';
    document.head.appendChild(link);

    // Styles globaux
    const style = document.createElement('style');
    style.textContent = `
        * { box-sizing: border-box; }
        body { font-family: 'DM Sans', sans-serif; }
        .serif { font-family: 'DM Serif Display', serif; }
        .fade-in { animation: fadeIn 0.35s ease forwards; }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(8px); }
            to   { opacity: 1; transform: translateY(0); }
        }
        table { border-collapse: collapse; }
    `;
    document.head.appendChild(style);

    // Inject navbar
    const navEl = document.getElementById('navbar');
    if (navEl) navEl.innerHTML = renderNavbar(activePage);
}

// ── Navbar — adaptée selon le rang ───────────────────────────
function renderNavbar(activePage = '') {
    const user    = Auth.getUser();
    const isStaff = Auth.isStaff();    
    
    // Liens publics
    const links = [
        { href: '/pages/books/index.html',     label: 'Livres',        key: 'books' },
    ];

    // Liens staff seulement
    if (isStaff) {
        links.push(
            { href: '/pages/libraries/index.html', label: 'Bibliothèques', key: 'libraries' },
            { href: '/pages/members/index.html',   label: 'Membres',       key: 'members'   },
            { href: '/pages/loans/index.html',     label: 'Prêts',         key: 'loans'      },
        );
    }

    // Lien "Mes prêts" pour tous les connectés
    if (user && !isStaff) {
        links.push({ href: '/pages/loans/index.html', label: 'Mes prêts', key: 'loans' });
    }

    const userBlock = user ? `
        <div class="flex items-center gap-4">
            <span class="text-xs text-gray-400">
                ${user.firstName}
                <span class="ml-1 text-xs border border-gray-200 px-2 py-0.5 rounded-full">${user.rang.rang}</span>
            </span>
            <button onclick="Auth.logout()"
                class="text-xs border border-gray-200 px-3 py-1.5 rounded-lg hover:border-black transition-colors text-gray-500">
                Déconnexion
            </button>
        </div>
    ` : `
        <a href="/pages/login/index.html"
           class="text-xs bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors">
            Connexion
        </a>
    `;

    return `
        <nav class="border-b border-gray-100 px-8 py-4 flex items-center justify-between sticky top-0 bg-white z-10">
            <a href="/index.html" class="serif text-xl tracking-tight">Bibliothèque</a>
            <div class="flex items-center gap-8">
                <div class="flex gap-6 text-sm">
                    ${links.map(l => `
                        <a href="${l.href}"
                           class="${l.key === activePage
                                ? 'text-black font-medium'
                                : 'text-gray-400 hover:text-black transition-colors'}">
                            ${l.label}
                        </a>
                    `).join('')}
                </div>
                ${userBlock}
            </div>
        </nav>
    `;
}

// ── Page header ──────────────────────────────────────────────
function renderPageHeader(eyebrow, title) {
    return `
        <div class="mb-10">
            <p class="text-xs tracking-widest text-gray-400 uppercase mb-2">${eyebrow}</p>
            <h1 class="serif text-4xl">${title}</h1>
        </div>
    `;
}

// ── Badge ────────────────────────────────────────────────────
function renderBadge(text, style = 'black') {
    const map = {
        black:   'bg-black text-white',
        outline: 'border border-gray-200 text-gray-400',
        red:     'border border-red-200 text-red-400',
    };
    return `<span class="text-xs ${map[style] || map.black} px-3 py-1 rounded-full whitespace-nowrap">${text}</span>`;
}

// ── Table head ───────────────────────────────────────────────
function renderTableHead(columns) {
    return `
        <thead>
            <tr class="border-b border-gray-100 text-left text-xs text-gray-400 uppercase tracking-widest">
                ${columns.map(c => `<th class="pb-3 pr-6 font-medium">${c}</th>`).join('')}
            </tr>
        </thead>
    `;
}

// ── Table row ────────────────────────────────────────────────
function renderTableRow(cells) {
    return `
        <tr class="border-b border-gray-50 hover:bg-gray-50 transition-colors fade-in">
            ${cells.map(c => `<td class="py-3 pr-6 ${c.class || 'text-gray-400'}">${c.content}</td>`).join('')}
        </tr>
    `;
}

// ── Stat card ────────────────────────────────────────────────
function renderStatCard(label, value) {
    return `
        <div class="border border-gray-100 rounded-xl p-5">
            <div class="text-xs text-gray-400 uppercase tracking-widest mb-2">${label}</div>
            <div class="serif text-4xl">${value}</div>
        </div>
    `;
}

// ── Info card ────────────────────────────────────────────────
function renderInfoCard(label, title, subtitle = '', extra = '') {
    return `
        <div class="border border-gray-100 rounded-xl p-5">
            <div class="text-xs text-gray-400 uppercase tracking-widest mb-2">${label}</div>
            <div class="font-medium">${title}</div>
            ${subtitle ? `<div class="text-sm text-gray-400 mt-0.5">${subtitle}</div>` : ''}
            ${extra    ? `<div class="text-xs text-gray-300 mt-1">${extra}</div>` : ''}
        </div>
    `;
}

// ── Empty state ──────────────────────────────────────────────
function renderEmpty(message = 'Aucun résultat') {
    return `<div class="text-sm text-gray-300 py-10 text-center">${message}</div>`;
}

// ── Toast ────────────────────────────────────────────────────
function showToast(message, type = 'success') {
    const existing = document.getElementById('__toast');
    if (existing) existing.remove();

    const colors = { success: 'bg-black text-white', error: 'bg-red-500 text-white' };
    const toast = document.createElement('div');
    toast.id = '__toast';
    toast.className = `fixed bottom-6 right-6 ${colors[type] || colors.success} px-5 py-3 rounded-xl text-sm shadow-lg z-50`;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.transition = 'opacity 0.3s';
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ── Tabs ─────────────────────────────────────────────────────
function initTabs(tabs) {
    tabs.forEach(({ btnId, panelId }) => {
        document.getElementById(btnId)?.addEventListener('click', () => {
            tabs.forEach(t => {
                const isActive = t.btnId === btnId;
                document.getElementById(t.btnId).className = isActive
                    ? 'text-sm px-4 py-2 border-b-2 border-black font-medium transition-all'
                    : 'text-sm px-4 py-2 border-b-2 border-transparent text-gray-400 hover:text-black transition-all';
                document.getElementById(t.panelId)?.classList.toggle('hidden', !isActive);
            });
        });
    });
}

// ── Pill group ───────────────────────────────────────────────
function renderPillGroup(containerId, items, onSelect, allLabel = 'Tous') {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '';

    const allBtn = document.createElement('button');
    allBtn.className = 'pill border border-black bg-black text-white px-5 py-2 rounded-full text-sm transition-all';
    allBtn.textContent = allLabel;
    allBtn.dataset.id = '';
    allBtn.onclick = () => { setPillActive(containerId, ''); onSelect(null); };
    container.appendChild(allBtn);

    items.forEach(item => {
        const btn = document.createElement('button');
        btn.className = 'pill border border-gray-200 text-gray-500 px-5 py-2 rounded-full text-sm hover:border-black hover:text-black transition-all';
        btn.textContent = item.label;
        btn.dataset.id = item.id;
        btn.onclick = () => { setPillActive(containerId, item.id); onSelect(item.id); };
        container.appendChild(btn);
    });
}

function setPillActive(containerId, activeId) {
    document.querySelectorAll(`#${containerId} .pill`).forEach(btn => {
        const isActive = btn.dataset.id == activeId;
        btn.className = isActive
            ? 'pill border border-black bg-black text-white px-5 py-2 rounded-full text-sm transition-all'
            : 'pill border border-gray-200 text-gray-500 px-5 py-2 rounded-full text-sm hover:border-black hover:text-black transition-all';
    });
}