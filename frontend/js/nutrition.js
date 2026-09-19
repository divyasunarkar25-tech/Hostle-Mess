document.addEventListener('DOMContentLoaded', () => {
    reqAuthUser();
    const form = document.getElementById('nutritionForm');
    const fileInput = document.getElementById('foodImage');
    const imagePreview = document.getElementById('imagePreview');
    const feedContainer = document.getElementById('nutritionFeed');

    let currentAnalysisData = null; // Store state
    let currentImageUrl = null;

    const loadFeed = async () => {
        if (!feedContainer) return;
        try {
            const res = await fetch(`${API_BASE_URL}/nutrition`, {
                headers: { 'Authorization': `Bearer ${getToken()}` }
            });
            const data = await res.json();
            if (res.ok) {
                if (data.length === 0) {
                    feedContainer.innerHTML = '<p style="text-align:center; color:gray">No community nutrition posts yet. Be the first!</p>';
                    return;
                }
                feedContainer.innerHTML = '';
                data.forEach(item => {
                    const feedCard = document.createElement('div');
                    feedCard.className = 'card';
                    feedCard.style.marginBottom = '1.5rem';

                    const serverUrl = API_BASE_URL.replace('/api', '');
                    const imgMarkup = item.imageUrl ? `<img src="${serverUrl}${item.imageUrl}" style="max-width:100%; max-height:250px; border-radius:8px; display:block; margin: 1rem 0; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">` : '';

                    let nutList = '';
                    if (item.nutrition) {
                        nutList = `
              <li><b>Calories:</b> ${item.nutrition.calories || '?'}</li>
              <li><b>Protein:</b> ${item.nutrition.protein || '?'} g</li>
              <li><b>Carbs:</b> ${item.nutrition.carbs || '?'} g</li>
              <li><b>Fat:</b> ${item.nutrition.fat || '?'} g</li>
            `;
                    }

                    feedCard.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem; border-bottom:1px solid #eee; padding-bottom:0.5rem">
               <div style="font-weight:600; color:var(--secondary-color)">👩 ${item.user ? item.user.name : 'Unknown User'}</div>
               <div style="font-size:0.85rem; color:gray">🕐 ${new Date(item.createdAt).toLocaleString()}</div>
            </div>
            <h3 style="color:var(--primary-color); font-size:1.4rem; margin-bottom:0.5rem">${item.foodName}</h3>
            ${imgMarkup}
            <ul style="background:#f8f9fa; padding:1rem; border-radius:8px; line-height:1.8; margin-top:1rem;">
               ${nutList}
            </ul>
          `;
                    feedContainer.appendChild(feedCard);
                });
            }
        } catch (err) {
            feedContainer.innerHTML = '<p style="color:red; text-align:center">Error loading community feed.</p>';
        }
    };

    if (fileInput && imagePreview) {
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                if (!file.type.startsWith('image/')) {
                    showAlert('Please select a valid image file', 'error');
                    fileInput.value = '';
                    imagePreview.style.display = 'none';
                    return;
                }
                imagePreview.src = URL.createObjectURL(file);
                imagePreview.style.display = 'block';
            } else {
                imagePreview.style.display = 'none';
                imagePreview.src = '';
            }
        });
    }

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            if (!fileInput.files[0]) {
                return showAlert('Please select an image', 'error');
            }

            const formData = new FormData();
            formData.append('foodImage', fileInput.files[0]);

            const btn = document.getElementById('analyzeBtn');
            btn.textContent = 'Analyzing...';
            btn.disabled = true;

            try {
                const res = await fetch(`${API_BASE_URL}/nutrition/analyze`, {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${getToken()}` },
                    body: formData
                });
                const data = await res.json();

                if (res.ok && data.success) {
                    // Successfully retrieved data bounds
                    currentAnalysisData = data.data;
                    currentImageUrl = data.imageUrl; // Retained from API upload URL handling

                    document.getElementById('resultBox').style.display = 'block';
                    document.getElementById('resName').textContent = data.data.name;
                    document.getElementById('resCal').textContent = data.data.calories;
                    document.getElementById('resPro').textContent = data.data.protein;
                    document.getElementById('resCarb').textContent = data.data.carbs;
                    document.getElementById('resFat').textContent = data.data.fat;
                    showAlert('Analysis Complete! Review and click Save.', 'success');
                } else {
                    showAlert(data.message || 'Analysis failed', 'error');
                }
            } catch (err) {
                showAlert('Network/Server error', 'error');
            }
            btn.textContent = 'Analyze Nutrition';
            btn.disabled = false;
        });
    }

    const saveBtn = document.getElementById('saveNutritionBtn');
    if (saveBtn) {
        saveBtn.addEventListener('click', async () => {
            if (!currentAnalysisData) return;

            saveBtn.disabled = true;
            saveBtn.textContent = 'Saving...';

            try {
                const payload = {
                    foodName: currentAnalysisData.name,
                    imageUrl: currentImageUrl,
                    nutrition: currentAnalysisData
                };

                const res = await fetch(`${API_BASE_URL}/nutrition`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${getToken()}`
                    },
                    body: JSON.stringify(payload)
                });

                if (res.ok) {
                    showAlert('Nutrition submitted successfully!', 'success');
                    document.getElementById('resultBox').style.display = 'none';
                    document.getElementById('nutritionForm').reset();
                    currentAnalysisData = null;
                    currentImageUrl = null;
                    imagePreview.style.display = 'none';
                    imagePreview.src = '';

                    loadFeed(); // Refresh aggressively
                } else {
                    const errData = await res.json();
                    showAlert(errData.message || 'Failed to save nutrition to feed.', 'error');
                }
            } catch (err) {
                showAlert('Network error securely submitting feed', 'error');
            }

            saveBtn.disabled = false;
            saveBtn.textContent = 'Save Nutrition to Feed';
        });
    }

    // Pre-load feed blindly at bottom
    loadFeed();
});
