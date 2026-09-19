document.addEventListener('DOMContentLoaded', () => {
    reqAuthAdmin();
    const form = document.getElementById('adminMenuForm');
    const container = document.getElementById('adminMenuContainer');

    const loadMenu = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/menu`);
            const data = await res.json();
            if (res.ok && data.length > 0) {
                const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
                container.innerHTML = '';
                data.sort((a, b) => days.indexOf(a.day) - days.indexOf(b.day));
                data.forEach(item => {
                    container.innerHTML += `
            <div class="card menu-day-card">
              <div style="display:flex; justify-content:space-between">
                <h3 style="color:var(--primary-color)">${item.day}</h3>
                <button class="btn btn-outline" style="padding:0.2rem 0.5rem; font-size:0.8rem" onclick="deleteDay('${item.day}')">Delete</button>
              </div>
              <p><b>B:</b> ${item.breakfast || '-'}</p>
              <p><b>L:</b> ${item.lunch || '-'}</p>
              <p><b>S:</b> ${item.snacks || '-'}</p>
              <p><b>D:</b> ${item.dinner || '-'}</p>
            </div>
          `;
                });
            } else { container.innerHTML = '<p>No menu data.</p>'; }
        } catch (err) { container.innerHTML = 'Error loading menu'; }
    };

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const payload = {
            day: document.getElementById('daySelect').value,
            breakfast: document.getElementById('mBreak').value,
            lunch: document.getElementById('mLunch').value,
            snacks: document.getElementById('mSnack').value,
            dinner: document.getElementById('mDinner').value,
        };
        try {
            // Create first, if 409 conflict, then update.
            let res = await fetch(`${API_BASE_URL}/menu`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` },
                body: JSON.stringify(payload)
            });
            if (res.status === 409) {
                res = await fetch(`${API_BASE_URL}/menu/${payload.day}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` },
                    body: JSON.stringify(payload)
                });
            }

            if (res.ok) {
                showAlert('Menu updated', 'success');
                form.reset();
                loadMenu();
            } else {
                const data = await res.json();
                showAlert(data.message, 'error');
            }
        } catch (err) { showAlert('Error', 'error'); }
    });

    window.deleteDay = async (day) => {
        if (!confirm(`Delete menu for ${day}?`)) return;
        try {
            const res = await fetch(`${API_BASE_URL}/menu/${day}`, {
                method: 'DELETE', headers: { 'Authorization': `Bearer ${getToken()}` }
            });
            if (res.ok) loadMenu();
        } catch (err) { }
    };

    loadMenu();
});
