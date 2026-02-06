// DATA MAKANAN PROMO
const promoFoodData = [
    { id: 1, name: "Paket Panas 1", price: 25000, oldPrice: 40000, discount: "40%", category: "gajian", img: "assets/fried_chicken.jpg" },
    { id: 2, name: "Burger Party", price: 30000, oldPrice: 50000, discount: "40%", category: "okb", img: "assets/burger.jpg" },
    { id: 3, name: "Pizza Lovers", price: 60000, oldPrice: 100000, discount: "40%", category: "plus", img: "assets/pizza.jpg" },
    { id: 4, name: "Iced Coffee Duo", price: 18000, oldPrice: 30000, discount: "B1G1", category: "gajian", img: "assets/ice coffe.jpg" },
    { id: 5, name: "Donut Box", price: 40000, oldPrice: 60000, discount: "30%", category: "anniv", img: "assets/donuts.jpg" }
];

// --- DATA BANNER (NAMA FILE SESUAI UPLOAD ANDA) ---
const bannerData = [
    { 
        title: "BURGER DEAL", 
        code: "BURGER50", 
        // File: 432.jpg
        img: "assets/432.jpg" 
    },
    { 
        title: "PIZZA WEEKEND", 
        code: "PIZZABEST", 
        // File: 223.jpg
        img: "assets/223.jpg" 
    },
    { 
        title: "SUPER DEAL", 
        code: "SUPER30", 
        // File: d3f0d188... (Pastikan nama file ini di folder anda sama persis)
        img: "assets/d3f0d188-b4c6-428b-8381-ef165ca82128.jpg" 
    },
    { 
        title: "SPRING ROLLS", 
        code: "ROLLS20", 
        // File: food_social_media_banner_08.jpg
        img: "assets/food_social_media_banner_08.jpg" 
    }
];

// FORMAT RUPIAH
const formatRupiah = (num) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num).replace("Rp", "").trim();

// 1. RENDER MENU 3D (STYLE KUNING DASHBOARD)
function renderFood(filterType = 'all') {
    const container = document.getElementById('promo-food-grid');
    container.innerHTML = "";

    const filtered = filterType === 'all' ? promoFoodData : promoFoodData.filter(item => item.category === filterType);

    if (filtered.length === 0) {
        container.innerHTML = `<p style="grid-column:1/-1; text-align:center; color:#888;">Tidak ada promo kategori ini.</p>`;
        return;
    }

    filtered.forEach(item => {
        // STRUKTUR HTML DIUBAH AGAR SAMA PERSIS DENGAN DASHBOARD/CHECKOUT
        container.innerHTML += `
            <div class="food-card" onclick="addToCart('${item.name}', ${item.price}, '${item.img}')">
                <div class="card-img-wrapper">
                    <span class="discount-tag">${item.discount}</span>
                    <img src="${item.img}" class="food-img">
                </div>
                <div class="food-desc">
                    <h4>${item.name}</h4>
                    <div class="promo-prices">
                        <span class="old-price">Rp${formatRupiah(item.oldPrice)}</span>
                        <span class="price">Rp${formatRupiah(item.price)}</span>
                    </div>
                    <button class="add-btn">Pesan</button>
                </div>
            </div>
        `;
    });
}

// 2. RENDER BANNER
function renderBanners() {
    const container = document.getElementById('promo-banner-grid');
    container.innerHTML = "";
    bannerData.forEach(item => {
        container.innerHTML += `
            <div class="promo-banner" onclick="copyCode('${item.code}')">
                <img src="${item.img}" title="Klik untuk salin kode: ${item.code}" alt="${item.title}" onerror="this.src='https://via.placeholder.com/300x180?text=Image+Not+Found'">
            </div>
        `;
    });
}

// 3. LOGIKA COPY CODE
function copyCode(code) {
    navigator.clipboard.writeText(code);
    showToast(`Kode <b>${code}</b> berhasil disalin!`);
}

// 4. LOGIKA ADD TO CART
function addToCart(name, price, img) {
    let cart = JSON.parse(localStorage.getItem('userCart')) || [];
    let existing = cart.find(item => item.name === name);
    
    if(existing) {
        existing.qty++;
    } else {
        cart.push({ name, price, img, qty: 1, note: "Promo Item" });
    }
    
    localStorage.setItem('userCart', JSON.stringify(cart));
    updateBadge();
    showToast(`<b>${name}</b> masuk keranjang!`);
}

function updateBadge() {
    let cart = JSON.parse(localStorage.getItem('userCart')) || [];
    const badge = document.getElementById('cart-badge');
    const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
    badge.innerText = totalQty;
    badge.classList.toggle('hidden', totalQty === 0);
}

// 5. TOAST
function showToast(msg) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="fa-solid fa-check-circle"></i> <span>${msg}</span>`;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// 6. FILTER LOGIC
function filterPromo(type) {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    event.target.classList.add('active');
    
    const grid = document.getElementById('promo-food-grid');
    grid.style.opacity = '0';
    setTimeout(() => {
        renderFood(type);
        grid.style.opacity = '1';
    }, 200);
}

// 7. TIMER
function startTimer() {
    let duration = 9930; 
    setInterval(() => {
        let h = Math.floor(duration / 3600);
        let m = Math.floor((duration % 3600) / 60);
        let s = duration % 60;
        document.getElementById('hours').innerText = h < 10 ? '0' + h : h;
        document.getElementById('minutes').innerText = m < 10 ? '0' + m : m;
        document.getElementById('seconds').innerText = s < 10 ? '0' + s : s;
        if(duration > 0) duration--;
    }, 1000);
}

document.addEventListener("DOMContentLoaded", () => {
    renderFood();
    renderBanners();
    updateBadge();
    startTimer();
});