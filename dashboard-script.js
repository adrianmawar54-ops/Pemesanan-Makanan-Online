// --- DATABASE MAKANAN LENGKAP ---
const foodData = [
    { id: 1, name: "Double Beef Burger", price: 45000, category: "popular", tab: "terlaris", rating: 4.8, time: "20m", cals: "450", img: "https://img.freepik.com/free-photo/big-hamburger-with-double-beef-french-fries_252907-8.jpg", tags: ["halal"] },
    { id: 2, name: "Pepperoni Pizza", price: 85000, category: "popular", tab: "terlaris", rating: 4.9, time: "35m", cals: "800", img: "https://img.freepik.com/free-photo/pepperoni-pizza-with-sausages-cheese-dark-wooden-table_220768-9277.jpg", tags: ["halal"] },
    { id: 3, name: "Nasi Goreng Spesial", price: 25000, category: "near_me", tab: "panas", rating: 4.7, time: "15m", cals: "320", img: "assets/nasgor.jpg", tags: ["halal"] },
    { id: 4, name: "Sate Ayam Madura", price: 30000, category: "near_me", tab: "panas", rating: 4.6, time: "20m", cals: "300", img: "assets/sate madura.jpg", tags: ["halal"] },
    { id: 5, name: "Chocolate Sundae", price: 15000, category: "discount", tab: "dessert", rating: 4.9, time: "10m", cals: "210", img: "assets/sundae.jpg", tags: ["halal", "vegetarian"] },
    { id: 6, name: "Glazed Donuts Box", price: 50000, category: "discount", tab: "dessert", rating: 4.5, time: "25m", cals: "500", img: "assets/donuts.jpg", tags: ["halal", "vegetarian"] },
    { id: 7, name: "Spicy Ramen Bowl", price: 42000, category: "24hours", tab: "panas", rating: 4.8, time: "25m", cals: "420", img: "assets/ramen.jpg", tags: ["halal"] },
    { id: 8, name: "Iced Coffee Latte", price: 22000, category: "24hours", tab: "dingin", rating: 4.6, time: "10m", cals: "120", img: "https://img.freepik.com/free-photo/iced-coffee-tall-glass_144627-32431.jpg", tags: ["halal", "vegetarian"] },
    { id: 9, name: "Healthy Salad Bowl", price: 35000, category: "quick_delivery", tab: "rekomendasi", rating: 4.7, time: "12m", cals: "150", img: "https://img.freepik.com/free-photo/fresh-salad-with-vegetables-tomatoes-red-onions-lettuce-quail-eggs-healthy-food-diet-concept-vegetarian-food_2829-20232.jpg", tags: ["halal", "vegetarian"] },
    { id: 10, name: "Crispy Fried Chicken", price: 95000, category: "quick_delivery", tab: "terlaris", rating: 4.9, time: "30m", cals: "900", img: "https://img.freepik.com/free-photo/crispy-fried-chicken-plate_140725-638.jpg", tags: ["halal"] },
    { id: 11, name: "Fresh Orange Juice", price: 18000, category: "all", tab: "dingin", rating: 4.5, time: "8m", cals: "90", img: "assets/orange.jpg", tags: ["halal", "vegetarian"] },
    { id: 12, name: "Premium Beef Steak", price: 135000, category: "popular", tab: "rating", rating: 5.0, time: "40m", cals: "600", img: "https://img.freepik.com/free-photo/grilled-beef-steak-dark-wooden-surface_1150-44344.jpg", tags: ["halal"] }
];

// STATE Variables
let activeCategory = 'all';
let activeTab = 'rekomendasi';
let currentSlide = 0;
let carouselInterval;

// --- INIT SYSTEM ---
document.addEventListener('DOMContentLoaded', () => {
    renderFood(foodData);
    startCarousel();
    updateDashboardBadge(); 
    updateFloatingCart(); // Inisialisasi tombol melayang
});

// --- 2. RENDER MAKANAN ---
function renderFood(data) {
    const grid = document.getElementById('foodGrid');
    if(!grid) return;
    grid.innerHTML = "";

    let displayData = data;
    if (activeCategory !== 'all') displayData = displayData.filter(item => item.category === activeCategory);
    if (activeTab !== 'rekomendasi') displayData = displayData.filter(item => item.tab === activeTab);

    if (displayData.length === 0) {
        grid.innerHTML = `
        <div style="grid-column:1/-1; text-align:center; padding:50px; color:#999;">
            <i class="fa-regular fa-face-frown" style="font-size:2.5rem; margin-bottom:15px; display:block;"></i>
            <p>Menu tidak ditemukan.</p>
        </div>`;
        return;
    }

    displayData.forEach((item, index) => {
        const card = document.createElement('div');
        card.className = 'food-card';
        card.style.animationDelay = `${index * 0.05}s`; 

        card.onclick = () => addToCart(item.name);
        
        card.innerHTML = `
            <div class="card-img-wrapper">
                <img src="${item.img}" alt="${item.name}" class="food-img">
                <div class="rating-badge">
                    <i class="fa-solid fa-star" style="color:#FFC107;"></i> ${item.rating}
                </div>
            </div>
            <div class="food-desc">
                <h4>${item.name}</h4>
                <div class="meta">
                    <span><i class="fa-regular fa-clock"></i> ${item.time}</span>
                    <span>• ${item.cals} kkal</span>
                </div>
                <div class="card-bottom">
                    <div class="price">${formatRupiah(item.price)}</div>
                    <div class="add-btn"><i class="fa-solid fa-plus"></i></div>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

// --- 3. BANNER SLIDER ---
function startCarousel() {
    const track = document.getElementById('bannerTrack');
    const dots = document.querySelectorAll('.dot');
    const totalSlides = 3;
    
    if (carouselInterval) clearInterval(carouselInterval);

    carouselInterval = setInterval(() => {
        currentSlide = (currentSlide + 1) % totalSlides;
        updateCarouselUI(track, dots);
    }, 6000); 
}

function updateCarouselUI(track, dots) {
    track.style.transform = `translateX(-${currentSlide * 100}%)`;
    dots.forEach(d => d.classList.remove('active'));
    dots[currentSlide].classList.add('active');
}

// --- 4. FILTERING ---
function filterCategory(element, category) {
    activeCategory = category;
    document.querySelectorAll('.cat-item').forEach(el => el.classList.remove('active'));
    element.classList.add('active');
    renderFood(foodData);
}

function filterTab(element, tab) {
    activeTab = tab;
    document.querySelectorAll('.tab-link').forEach(el => el.classList.remove('active'));
    element.classList.add('active');
    renderFood(foodData);
}

function searchFood() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const result = foodData.filter(item => item.name.toLowerCase().includes(query));
    renderFood(result);
}

// --- 5. CART SYSTEM & FLOATING BUTTON ---
function addToCart(itemName) {
    const item = foodData.find(f => f.name === itemName);
    if (!item) return;

    let cart = JSON.parse(localStorage.getItem('userCart')) || [];
    let existingItem = cart.find(c => c.name === itemName);

    if (existingItem) {
        existingItem.qty++;
    } else {
        cart.push({ name: item.name, price: item.price, img: item.img, qty: 1, note: "" });
    }

    localStorage.setItem('userCart', JSON.stringify(cart));
    
    // Update UI
    updateDashboardBadge();
    updateFloatingCart(); 
    showToast(`${itemName} ditambahkan!`);
}

function updateDashboardBadge() {
    let cart = JSON.parse(localStorage.getItem('userCart')) || [];
    let totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
    const badge = document.getElementById('cart-badge');
    if(badge) {
        badge.innerText = totalQty;
        if(totalQty > 0) badge.classList.remove('hidden');
        else badge.classList.add('hidden');
    }
}

// FUNGSI UPDATE FLOATING BUTTON (LOGIKA BARU)
function updateFloatingCart() {
    let cart = JSON.parse(localStorage.getItem('userCart')) || [];
    let totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
    let totalPrice = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    
    const floatBtn = document.getElementById('floating-cart-btn');
    const floatQty = document.getElementById('float-qty');
    const floatTotal = document.getElementById('float-total');

    if (floatBtn) {
        if (totalQty > 0) {
            floatBtn.classList.remove('hidden');
            floatQty.innerText = totalQty;
            floatTotal.innerText = formatRupiah(totalPrice);
        } else {
            floatBtn.classList.add('hidden');
        }
    }
}

function showToast(msg) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="fa-solid fa-check-circle" style="color:#FFC107"></i> <span>${msg}</span>`;
    container.appendChild(toast);
    
    setTimeout(() => { 
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(20px)';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// --- 6. HEADER & DROPDOWN LOGIC ---
function toggleDropdown(id) {
    // Tutup dropdown lain
    document.querySelectorAll('.dropdown-menu').forEach(el => {
        if (el.id !== id) el.classList.add('hidden');
    });
    const dropdown = document.getElementById(id);
    dropdown.classList.toggle('hidden');
}

// Tutup dropdown jika klik di luar area
window.onclick = function(event) {
    if (!event.target.closest('.action-wrapper')) {
        document.querySelectorAll('.dropdown-menu').forEach(el => {
            el.classList.add('hidden');
        });
    }
}

// Helper
const formatRupiah = (num) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num).replace("Rp", "Rp ").trim();

function setActiveNav(el) { document.querySelectorAll('.nav-item').forEach(e => e.classList.remove('active')); el.classList.add('active'); }

function handleLogout() {
    if(confirm("Yakin ingin logout?")) window.location.href = "login.html";
}