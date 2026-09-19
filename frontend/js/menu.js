document.addEventListener('DOMContentLoaded', async () => {
    const container = document.getElementById('menuContainer');
    if (!container) return;

    try {
        const res = await fetch(`${API_BASE_URL}/menu`);
        const data = await res.json();

        if (res.ok && data.length > 0) {
            const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
            container.innerHTML = '';

            // Sort logic to order purely by logic, not database creation insert timing
            data.sort((a, b) => days.indexOf(a.day) - days.indexOf(b.day));

            data.forEach(item => {
                const card = document.createElement('div');
                card.className = 'card menu-day-card';
                card.innerHTML = `
          <h3 style="margin-bottom:1rem; color:var(--primary-color)">${item.day}</h3>
          <div class="meal-item"><div class="meal-type">Breakfast</div><div class="meal-food">${item.breakfast || '-'}</div></div>
          <div class="meal-item"><div class="meal-type">Lunch</div><div class="meal-food">${item.lunch || '-'}</div></div>
          <div class="meal-item"><div class="meal-type">Snacks</div><div class="meal-food">${item.snacks || '-'}</div></div>
          <div class="meal-item"><div class="meal-type">Dinner</div><div class="meal-food">${item.dinner || '-'}</div></div>
        `;
                container.appendChild(card);
            });
        } else {
            container.innerHTML = `<p>No menu data available currently.</p>`;
        }
    } catch (err) {
        container.innerHTML = `<p style="color:var(--error)">Failed to load menu</p>`;
    }
});
