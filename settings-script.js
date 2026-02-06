// --- 1. MANAJEMEN TAB MENU ---
function showTab(tabId, btnElement) {
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.querySelectorAll('.sub-item').forEach(btn => {
        btn.classList.remove('active');
    });
    const selectedContent = document.getElementById(tabId);
    if (selectedContent) selectedContent.classList.add('active');
    if (btnElement) btnElement.classList.add('active');
}

// --- 2. PENYIMPANAN DATA (LOCALSTORAGE) ---
function updateSettings(key, value) {
    localStorage.setItem('settings_' + key, value);
    if (key === 'theme') applyTheme(value);
}

function updateDiet() {
    const preferences = {
        halal: document.getElementById('prefHalal').checked,
        veg: document.getElementById('prefVeg').checked,
        gluten: document.getElementById('prefGluten').checked
    };
    localStorage.setItem('settings_diet', JSON.stringify(preferences));
}

function updateNotif() {
    const notifications = {
        order: document.getElementById('notifOrder').checked,
        promo: document.getElementById('notifPromo').checked,
        sound: document.getElementById('notifSound').checked
    };
    localStorage.setItem('settings_notif', JSON.stringify(notifications));
}

// --- 3. LOGIKA VISUAL TEMA ---
function applyTheme(mode) {
    const body = document.body;
    if (mode === 'dark') {
        body.classList.add('dark-mode');
    } else {
        body.classList.remove('dark-mode');
    }
}

// --- 4. LOGIKA KEAMANAN ---
function handleChangePassword() {
    const oldPass = document.getElementById('oldPass').value;
    const newPass = document.getElementById('newPass').value;
    const confirmPass = document.getElementById('confirmPass').value;

    if (!oldPass || !newPass || !confirmPass) {
        alert("Harap isi semua kolom password!");
        return;
    }
    if (newPass !== confirmPass) {
        alert("Konfirmasi password baru tidak cocok!");
        return;
    }
    if (newPass.length < 6) {
        alert("Password baru minimal 6 karakter!");
        return;
    }
    alert("Password berhasil diperbarui!");
    document.getElementById('oldPass').value = '';
    document.getElementById('newPass').value = '';
    document.getElementById('confirmPass').value = '';
}

// --- 5. UPDATE BADGE (NAVBAR) ---
function updateBadge() {
    let cart = JSON.parse(localStorage.getItem('userCart')) || [];
    const badge = document.getElementById('cart-badge');
    if (badge) {
        const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
        badge.innerText = totalQty;
        if (totalQty > 0) badge.classList.remove('hidden');
        else badge.classList.add('hidden');
    }
}

// --- 6. INISIALISASI SYSTEM ---
document.addEventListener("DOMContentLoaded", () => {
    
    // Load Badge
    updateBadge();

    // Load Tema
    const savedTheme = localStorage.getItem('settings_theme') || 'light';
    applyTheme(savedTheme);
    if(savedTheme === 'dark') {
        if(document.getElementById('themeDark')) document.getElementById('themeDark').checked = true;
    } else {
        if(document.getElementById('themeLight')) document.getElementById('themeLight').checked = true;
    }

    // Load Bahasa
    const savedLang = localStorage.getItem('settings_language') || 'id';
    if(document.getElementById('selectLang')) document.getElementById('selectLang').value = savedLang;

    // Load History Span
    const savedHistory = localStorage.getItem('settings_historySpan') || '1w';
    if(document.getElementById('selectHistory')) document.getElementById('selectHistory').value = savedHistory;

    // Load Diet Preferences
    const savedDiet = JSON.parse(localStorage.getItem('settings_diet'));
    if (savedDiet) {
        if(document.getElementById('prefHalal')) document.getElementById('prefHalal').checked = savedDiet.halal;
        if(document.getElementById('prefVeg')) document.getElementById('prefVeg').checked = savedDiet.veg;
        if(document.getElementById('prefGluten')) document.getElementById('prefGluten').checked = savedDiet.gluten;
    }

    // Load Notifications
    const savedNotif = JSON.parse(localStorage.getItem('settings_notif'));
    if (savedNotif) {
        if(document.getElementById('notifOrder')) document.getElementById('notifOrder').checked = savedNotif.order;
        if(document.getElementById('notifPromo')) document.getElementById('notifPromo').checked = savedNotif.promo;
        if(document.getElementById('notifSound')) document.getElementById('notifSound').checked = savedNotif.sound;
    } else {
        if(document.getElementById('notifOrder')) document.getElementById('notifOrder').checked = true;
        if(document.getElementById('notifSound')) document.getElementById('notifSound').checked = true;
    }
});