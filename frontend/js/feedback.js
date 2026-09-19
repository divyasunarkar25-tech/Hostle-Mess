document.addEventListener('DOMContentLoaded', () => {
    reqAuthUser();
    const form = document.getElementById('feedbackForm');
    const tableBody = document.getElementById('myFeedbackTable');

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const payload = {
                rating: document.getElementById('rating').value,
                quality: document.getElementById('quality').value,
                quantity: document.getElementById('quantity').value,
                comment: document.getElementById('comment').value
            };
            form.querySelector('button').disabled = true;
            try {
                const res = await fetch(`${API_BASE_URL}/feedback`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${getToken()}`
                    },
                    body: JSON.stringify(payload)
                });
                const data = await res.json();
                if (res.ok) {
                    showAlert('Feedback submitted successfully!', 'success');
                    form.reset();
                    loadMyFeedback();
                } else {
                    showAlert(data.message, 'error');
                }
            } catch (err) { showAlert('Error submitting feedback', 'error'); }
            form.querySelector('button').disabled = false;
        });
    }

    const loadMyFeedback = async () => {
        if (!tableBody) return;
        try {
            const res = await fetch(`${API_BASE_URL}/feedback/my`, {
                headers: { 'Authorization': `Bearer ${getToken()}` }
            });
            const data = await res.json();
            if (res.ok) {
                if (data.length === 0) {
                    tableBody.innerHTML = `<tr><td colspan="5">No feedback found.</td></tr>`;
                    return;
                }
                tableBody.innerHTML = '';
                data.forEach(item => {
                    tableBody.innerHTML += `
            <tr>
              <td>${new Date(item.createdAt).toLocaleDateString()}</td>
              <td><span class="badge">${item.rating}/5</span></td>
              <td>${item.quality}/5</td>
              <td>${item.quantity}/5</td>
              <td>${item.comment || '-'}</td>
            </tr>
          `;
                });
            }
        } catch (err) {
            tableBody.innerHTML = `<tr><td colspan="5">Error loading data.</td></tr>`;
        }
    };

    loadMyFeedback();
});
