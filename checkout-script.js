// --- STATE ---
let cart = [];
let discount = 0;
let deliveryFee = 10000;
let selectedPayment = null;

// REKOMENDASI
const recommendations = [
    { name: "Ice Cream Chocolate", price: 15000, img: "assets/ice cream.jpg" },
    { name: "Fresh Orange Juice", price: 18000, img: "assets/orange.jpg" },
    { name: "Glazed Donuts", price: 12000, img: "assets/donuts.jpg" }
];

// FORMAT RUPIAH
const formatRupiah = (num) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num).replace("Rp", "").trim();

// LOAD DATA
function loadCart() {
    cart = JSON.parse(localStorage.getItem('userCart')) || [];
    render3DGrid();
    renderMiniList();
    renderRecommendations();
    updateCalculations();
    updateBadge();
}

// RENDER GRID (ITEM DI KERANJANG) - STYLE KUNING DASHBOARD
function render3DGrid() {
    const container = document.getElementById('main-order-grid');
    container.innerHTML = "";
    if (cart.length === 0) {
        container.innerHTML = "<p style='grid-column:1/-1; text-align:center; color:#888; padding:30px; font-style:italic;'>Keranjang kamu kosong. Yuk pesan makanan!</p>";
        return;
    }
    cart.forEach(item => {
        container.innerHTML += `
            <div class="food-card">
                <div class="card-img-wrapper">
                    <img src="${item.img}" alt="${item.name}" class="food-img">
                    <div class="rating-badge"><i class="fa-solid fa-star" style="color:#FFC107;"></i> 4.8</div>
                </div>
                <div class="food-desc">
                    <h4>${item.name}</h4>
                    <div class="meta">
                        <span><i class="fa-regular fa-clock"></i> 20m</span>
                        <span>• 450 kkal</span>
                    </div>
                    <div class="card-bottom">
                        <div class="price">${formatRupiah(item.price)}</div>
                        <div class="action-box">
                            x${item.qty}
                        </div>
                    </div>
                </div>
            </div>`;
    });
}

// RENDER REKOMENDASI (STYLE KUNING DASHBOARD)
function renderRecommendations() {
    const container = document.getElementById('recommendation-grid');
    container.innerHTML = "";
    recommendations.forEach(item => {
        container.innerHTML += `
            <div class="food-card">
                <div class="card-img-wrapper">
                    <img src="${item.img}" alt="${item.name}" class="food-img">
                </div>
                <div class="food-desc">
                    <h4>${item.name}</h4>
                    <div class="meta">
                        <span><i class="fa-regular fa-clock"></i> 15m</span>
                        <span>• Manis</span>
                    </div>
                    <div class="card-bottom">
                        <div class="price">${formatRupiah(item.price)}</div>
                        <div class="action-box btn-add" onclick="addRecommendation('${item.name}', ${item.price}, '${item.img}'); event.stopPropagation();">
                            <i class="fa-solid fa-plus"></i>
                        </div>
                    </div>
                </div>
            </div>`;
    });
}

// RENDER MINI LIST (SIDEBAR) - FITUR UPDATE QTY (+/-)
function renderMiniList() {
    const container = document.getElementById('cart-list-container');
    container.innerHTML = "";
    
    if (cart.length === 0) {
        container.innerHTML = "<p style='text-align:center; color:#ccc; font-size:0.9rem;'>Belum ada pesanan</p>";
        return;
    }

    cart.forEach((item, index) => {
        container.innerHTML += `
            <div class="cart-item-row">
                <div class="item-mini-detail">
                    <img src="${item.img}" alt="img">
                    <div>
                        <h5>${item.name}</h5>
                        <div class="item-price-single">${formatRupiah(item.price)}</div>
                    </div>
                </div>
                
                <div class="qty-controls">
                    <button class="qty-btn" onclick="updateItemQty(${index}, -1)"><i class="fa-solid fa-minus"></i></button>
                    <span class="qty-val">${item.qty}</span>
                    <button class="qty-btn" onclick="updateItemQty(${index}, 1)"><i class="fa-solid fa-plus"></i></button>
                </div>
            </div>`;
    });
}

// FUNGSI UPDATE QUANTITY
function updateItemQty(index, change) {
    if (cart[index]) {
        cart[index].qty += change;
        
        // Jika qty jadi 0, hapus item
        if (cart[index].qty <= 0) {
            cart.splice(index, 1);
        }
        
        // Simpan & Render Ulang
        localStorage.setItem('userCart', JSON.stringify(cart));
        loadCart(); // Refresh semua tampilan
    }
}

// CALCULATIONS
function updateCalculations() {
    let subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    let total = subtotal + deliveryFee - discount;
    if (total < 0) total = 0;

    document.getElementById('subtotal-display').innerText = formatRupiah(subtotal);
    document.getElementById('ongkir-display').innerText = formatRupiah(deliveryFee);
    document.getElementById('discount-display').innerText = "-" + formatRupiah(discount);
    document.getElementById('total-display').innerText = formatRupiah(total);
}

function applyVoucher() {
    discount = parseInt(document.getElementById('voucherSelect').value);
    document.getElementById('disc-row').classList.remove('hidden');
    updateCalculations();
}

function setDeliveryType(btn, type) {
    document.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    deliveryFee = (type === 'pickup') ? 0 : 10000;
    updateCalculations();
}

// PAYMENT & TRACKING
function openPaymentModal() {
    if (cart.length === 0) return alert("Keranjang kosong!");
    document.getElementById('paymentModal').classList.remove('hidden');
}

function closeModal(id) { document.getElementById(id).classList.add('hidden'); }

function selectPayment(el) {
    document.querySelectorAll('.pay-option').forEach(p => p.classList.remove('selected'));
    el.classList.add('selected');
    selectedPayment = true;
}

function processTransaction() {
    if (!selectedPayment) return alert("Pilih metode pembayaran dulu!");
    closeModal('paymentModal');
    document.getElementById('trackingScreen').classList.remove('hidden');
    startTrackingAnimation();
}

// TRACKING ANIMATION
function startTrackingAnimation() {
    const driverIcon = document.querySelector('.driver');
    setTimeout(() => activateStep('track-step-1', '12:30'), 500); 
    setTimeout(() => { activateStep('track-step-2', '12:35'); driverIcon.style.top = "15%"; }, 3000);
    setTimeout(() => { activateStep('track-step-3', '12:40'); driverIcon.style.top = "85%"; }, 6000);
    setTimeout(() => { activateStep('track-step-4', '12:45'); document.getElementById('track-status-text').innerHTML = "Pesanan Diterima! Silakan ambil pesananmu."; document.getElementById('track-status-text').style.color = "#4CAF50"; document.getElementById('track-status-text').style.fontWeight = "bold"; document.getElementById('btn-finish-order').classList.remove('hidden'); }, 9000);
}

function activateStep(id, time) {
    const el = document.getElementById(id);
    el.classList.add('active');
    el.querySelector('.time').innerText = time;
}

// RATING & FINISH
function openRatingModal() { document.getElementById('ratingModal').classList.remove('hidden'); }

function rate(star, type) {
    const stars = document.getElementById(type + 'Stars').querySelectorAll('i');
    stars.forEach((s, index) => {
        if (index < star) { s.classList.remove('fa-regular'); s.classList.add('fa-solid', 'active'); } 
        else { s.classList.remove('fa-solid', 'active'); s.classList.add('fa-regular'); }
    });
}

function finishAndRedirect() {
    document.getElementById('ratingModal').classList.add('hidden');
    document.getElementById('trackingScreen').classList.add('hidden');
    localStorage.removeItem('userCart'); 
    localStorage.removeItem('lastTotal');
    cart = []; 
    alert("Pesanan Selesai! Terima kasih telah memesan. \nKembali ke Halaman Utama...");
    window.location.href = "dashboard.html";
}

// UTILS
function addRecommendation(name, price, img) {
    let existing = cart.find(item => item.name === name);
    if(existing) existing.qty++;
    else cart.push({ name, price, img, qty: 1 });
    localStorage.setItem('userCart', JSON.stringify(cart));
    loadCart();
}

function deleteItem(index) {
    cart.splice(index, 1);
    localStorage.setItem('userCart', JSON.stringify(cart));
    loadCart();
}

function updateBadge() {
    const badge = document.getElementById('cart-badge');
    const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
    badge.innerText = totalQty;
    badge.classList.toggle('hidden', totalQty === 0);
}

document.addEventListener("DOMContentLoaded", loadCart);