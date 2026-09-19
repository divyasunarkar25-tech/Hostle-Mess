document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            try {
                const res = await fetch(`${API_BASE_URL}/users/login`, {
                    method: 'POST', headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });
                const data = await res.json();
                if (res.ok) {
                    setAuth(data.token, 'user', data.user.name);
                    window.location.href = 'index.html';
                } else {
                    showAlert(data.message, 'error');
                }
            } catch (err) { showAlert('Network error', 'error'); }
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            if (password !== confirmPassword) return showAlert('Passwords do not match', 'error');
            try {
                const res = await fetch(`${API_BASE_URL}/users/register`, {
                    method: 'POST', headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, password })
                });
                const data = await res.json();
                if (res.ok) {
                    setAuth(data.token, 'user', name);
                    window.location.href = 'index.html';
                } else {
                    showAlert(data.message, 'error');
                }
            } catch (err) { showAlert('Network error', 'error'); }
        });
    }
});
