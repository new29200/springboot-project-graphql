// ============================================================
// auth.js — Gestion de l'authentification
// À inclure sur toutes les pages protégées
// ============================================================

const AUTH_KEY = 'bib_user';

const Auth = {

    // Sauvegarder l'utilisateur en session
    setUser(user) {
        localStorage.setItem(AUTH_KEY, JSON.stringify(user));
    },

    // Récupérer l'utilisateur connecté
    getUser() {
        const raw = localStorage.getItem(AUTH_KEY);
        return raw ? JSON.parse(raw) : null;
    },

    // Déconnexion
    logout() {
        localStorage.removeItem(AUTH_KEY);
        window.location.href = '/pages/login/index.html';
    },

    // Est-ce que l'utilisateur est connecté ?
    isLoggedIn() {
        return !!this.getUser();
    },

    // Est-ce que l'utilisateur est Admin ?
    isAdmin() {
        const user = this.getUser();
        return user?.rang?.rang === 'Admin';
    },

    // Est-ce que l'utilisateur est Librarian ou Admin ?
    isStaff() {
        const user = this.getUser();
        return user?.rang?.rang === 'Admin' || user?.rang?.rang === 'Librarian';
    },

    // Guard — redirige vers login si pas connecté
    requireAuth() {
        if (!this.isLoggedIn()) {
            window.location.href = '/pages/login/index.html';
            return false;
        }
        return true;
    },

    // Guard — redirige si pas staff
    requireStaff() {
        if (!this.requireAuth()) return false;
        if (!this.isStaff()) {
            window.location.href = '/index.html';
            return false;
        }
        return true;
    }
};