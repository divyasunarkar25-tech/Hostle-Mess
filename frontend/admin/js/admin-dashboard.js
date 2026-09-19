document.addEventListener('DOMContentLoaded', async () => {
    reqAuthAdmin();
    try {
        const resFb = await fetch(`${API_BASE_URL}/feedback`, { headers: { 'Authorization': `Bearer ${getToken()}` } });
        if (resFb.ok) { const d = await resFb.json(); document.getElementById('statFeedback').innerText = d.length; }

        const resMenu = await fetch(`${API_BASE_URL}/menu`);
        if (resMenu.ok) { const d = await resMenu.json(); document.getElementById('statMenu').innerText = d.length; }
    } catch (e) { }
});
