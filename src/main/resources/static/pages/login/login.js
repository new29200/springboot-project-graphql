// login.js — Logique page Login

// Fonts manuellement car pas d'initPage ici
const link = document.createElement('link');
link.rel = 'stylesheet';
link.href = 'https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Serif+Display&display=swap';
document.head.appendChild(link);

const style = document.createElement('style');
style.textContent = `body { font-family: 'DM Sans', sans-serif; } .serif { font-family: 'DM Serif Display', serif; }`;
document.head.appendChild(style);

// Si déjà connecté, rediriger
if (Auth.isLoggedIn()) {
    window.location.href = '/index.html';
}

async function doLogin() {
    const email    = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const btn      = document.getElementById('login-btn');
    const errorMsg = document.getElementById('error-msg');

    if (!email || !password) return;

    btn.textContent = 'Connexion...';
    btn.disabled = true;
    errorMsg.classList.add('hidden');

    const data = await API.login(email, password);
    const user = data?.login;

    if (user) {
        Auth.setUser(user);
        // Rediriger selon le rang
        if (Auth.isStaff()) {
            window.location.href = '/pages/loans/index.html';
        } else {
            window.location.href = '/index.html';
        }
    } else {
        errorMsg.classList.remove('hidden');
        btn.textContent = 'Se connecter';
        btn.disabled = false;
    }
}

function fillDemo(email, password) {
    document.getElementById('email').value    = email;
    document.getElementById('password').value = password;
}

// Enter pour soumettre
document.addEventListener('keydown', e => {
    if (e.key === 'Enter') doLogin();
});