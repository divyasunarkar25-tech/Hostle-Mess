document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('nutritionForm');
    const fileInput = document.getElementById('foodImage');
    const imagePreview = document.getElementById('imagePreview');
    const feedContainer = document.getElementById('nutritionFeed');
    const analyzeButton = document.getElementById('analyzeBtn');

    // nutrition.html remains in the project for now; Home is the only linked entry point.
    if (!form || !fileInput || !imagePreview || !feedContainer || !analyzeButton) return;

    const serverUrl = API_BASE_URL.replace('/api', '');

    const textElement = (tag, value) => {
        const element = document.createElement(tag);
        element.textContent = value;
        return element;
    };

    const renderEntry = (entry) => {
        const card = document.createElement('article');
        card.className = 'nutrition-entry';

        if (entry.imageUrl) {
            const image = document.createElement('img');
            image.className = 'nutrition-entry-image';
            image.src = `${serverUrl}${entry.imageUrl}`;
            image.alt = entry.foodName || 'Uploaded food';
            card.appendChild(image);
        }

        card.appendChild(textElement('h3', entry.foodName || 'Food analysis'));
        const nutrition = entry.nutrition || {};
        const details = document.createElement('div');
        details.className = 'nutrition-details';
        [
            ['Calories', `${nutrition.calories ?? '?'} kcal`],
            ['Protein', `${nutrition.protein ?? '?'} g`],
            ['Carbs', `${nutrition.carbs ?? '?'} g`],
            ['Fat', `${nutrition.fat ?? '?'} g`],
            ['Fiber', `${nutrition.fiber ?? '?'} g`]
        ].forEach(([label, value]) => {
            const stat = document.createElement('span');
            stat.append(textElement('strong', `${label}: `), document.createTextNode(value));
            details.appendChild(stat);
        });
        card.appendChild(details);

        if (nutrition.aiResponse) card.appendChild(textElement('p', nutrition.aiResponse));
        card.appendChild(textElement('small', new Date(entry.createdAt).toLocaleString()));
        return card;
    };

    const loadFeed = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/nutrition`);
            const entries = await response.json();
            if (!response.ok) throw new Error(entries.message || 'Could not load nutrition history.');

            feedContainer.innerHTML = '';
            if (!entries.length) {
                feedContainer.appendChild(textElement('p', 'No nutrition entries yet. Upload the first food image.'));
                return;
            }
            entries.forEach(entry => feedContainer.appendChild(renderEntry(entry)));
        } catch (error) {
            feedContainer.innerHTML = '';
            feedContainer.appendChild(textElement('p', error.message || 'Could not load nutrition history.'));
        }
    };

    fileInput.addEventListener('change', () => {
        const file = fileInput.files[0];
        if (!file) {
            imagePreview.hidden = true;
            imagePreview.removeAttribute('src');
            return;
        }
        if (!file.type.startsWith('image/')) {
            showAlert('Please select a valid image file.', 'error');
            form.reset();
            imagePreview.hidden = true;
            imagePreview.removeAttribute('src');
            return;
        }
        imagePreview.src = URL.createObjectURL(file);
        imagePreview.hidden = false;
    });

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const file = fileInput.files[0];
        if (!file) return showAlert('Please select a food image.', 'error');

        const upload = new FormData();
        upload.append('foodImage', file);
        analyzeButton.disabled = true;
        analyzeButton.textContent = 'Analyzing...';

        try {
            const response = await fetch(`${API_BASE_URL}/nutrition/analyze`, { method: 'POST', body: upload });
            const result = await response.json();
            if (!response.ok || !result.success) throw new Error(result.message || 'Nutrition analysis failed.');

            form.reset();
            imagePreview.hidden = true;
            imagePreview.removeAttribute('src');
            showAlert('Nutrition analysis saved successfully.', 'success');
            await loadFeed();
        } catch (error) {
            showAlert(error.message || 'Nutrition analysis failed.', 'error');
        } finally {
            analyzeButton.disabled = false;
            analyzeButton.textContent = 'Analyze Food';
        }
    });

    loadFeed();
});
