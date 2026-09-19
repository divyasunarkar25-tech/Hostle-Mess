document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('adminLoginForm');
    const registerForm = document.getElementById('adminRegisterForm');

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            try {
                const res = await fetch(`${API_BASE_URL}/admin/login`, {
                    method: 'POST', headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });
                const data = await res.json();
                if (res.ok) {
                    setAuth(data.token, 'admin', data.admin.name);
                    window.location.href = 'dashboard.html';
                } else {
                    showAlert(data.message, 'error');
                }
            } catch (err) { showAlert('Network Error', 'error'); }
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmP = document.getElementById('confirmPassword').value;
            if (password !== confirmP) return showAlert('Passwords do not match', 'error');

            try {
                const res = await fetch(`${API_BASE_URL}/admin/register`, {
                    method: 'POST', headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, password })
                });
                const data = await res.json();
                if (res.ok) {
                    setAuth(data.token, 'admin', data.admin.name);
                    window.location.href = 'dashboard.html';
                } else {
                    showAlert(data.message, 'error');
                }
            } catch (err) { showAlert('Network Error', 'error'); }
        });
    }
});
