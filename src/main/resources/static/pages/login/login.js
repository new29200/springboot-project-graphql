import { AuthAPI } from '/js/api/auth.js';

// Fonts manuellement car pas d'initPage ici
const link = document.createElement('link');
link.rel = 'stylesheet';
link.href = 'https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Serif+Display&display=swap';
document.head.appendChild(link);

const style = document.createElement('style');
style.textContent = `body { font-family: 'DM Sans', sans-serif; } .serif { font-family: 'DM Serif Display', serif; }`;
document.head.appendChild(style);

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

    const data = await AuthAPI.login(email, password);
    const user = data?.login;

    if (user) {
        Auth.setUser(user);
        window.location.href = Auth.isStaff() ? '/pages/loans/index.html' : '/index.html';
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

document.addEventListener('keydown', e => {
    if (e.key === 'Enter') doLogin();
});

window.doLogin   = doLogin;
window.fillDemo  = fillDemo;