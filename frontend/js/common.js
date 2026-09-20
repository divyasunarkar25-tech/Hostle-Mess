const API_BASE_URL = "https://hostle-mess.onrender.com/api";

const getToken = () => localStorage.getItem('token');
const getRole = () => localStorage.getItem('role');
const getUserName = () => localStorage.getItem('userName');
const setAuth = (token, role, userName) => {
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
    if (userName) localStorage.setItem('userName', userName);
};
const clearAuth = () => { localStorage.clear(); };

const showAlert = (message, type, elementId = 'alertBox') => {
    const alertBox = document.getElementById(elementId);
    if (!alertBox) return;
    alertBox.textContent = message;
    alertBox.className = `alert ${type}`;
    alertBox.style.display = 'block';
    setTimeout(() => { alertBox.style.display = 'none'; }, 4000);
};

const updateNavbar = () => {
    const token = getToken();
    const role = getRole();
    const guestLinks = document.getElementById('guestLinks');
    const userLinks = document.getElementById('userLinks');
    const adminLinks = document.getElementById('adminLinks');

    if (guestLinks) guestLinks.style.display = 'none';
    if (userLinks) userLinks.style.display = 'none';
    if (adminLinks) adminLinks.style.display = 'none';

    if (token) {
        if (role === 'admin' && adminLinks) {
            adminLinks.style.display = 'flex';
        } else if (role === 'user' && userLinks) {
            userLinks.style.display = 'flex';
            const nameEl = document.getElementById('navUserName');
            if (nameEl) nameEl.textContent = `Hi, ${getUserName() || 'User'}`;
        }
    } else if (guestLinks) {
        guestLinks.style.display = 'flex';
    }
};

const handleLogout = () => {
    const role = getRole();
    clearAuth();
    const isInsideAdmin = window.location.pathname.includes('/admin/');
    if (role === 'admin') {
        window.location.href = isInsideAdmin ? 'login.html' : 'admin/login.html';
    } else {
        window.location.href = isInsideAdmin ? '../login.html' : 'login.html';
    }
};

document.addEventListener('DOMContentLoaded', () => {
    updateNavbar();
    const logoutBtns = document.querySelectorAll('.logout-btn');
    logoutBtns.forEach(btn => btn.addEventListener('click', handleLogout));
});

const reqAuthUser = () => { if (getRole() !== 'user' || !getToken()) window.location.href = 'login.html'; };
const reqAuthAdmin = () => { if (getRole() !== 'admin' || !getToken()) window.location.href = 'login.html'; };
