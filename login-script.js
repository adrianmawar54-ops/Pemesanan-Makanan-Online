// State Mode
let isRegisterMode = false;

// 1. FITUR TOGGLE PASSWORD (Bisa untuk Password Utama & Konfirmasi)
function togglePassword(inputId, iconElement) {
    const input = document.getElementById(inputId);
    
    if (input.type === 'password') {
        input.type = 'text';
        iconElement.classList.remove('fa-eye-slash');
        iconElement.classList.add('fa-eye');
    } else {
        input.type = 'password';
        iconElement.classList.remove('fa-eye');
        iconElement.classList.add('fa-eye-slash');
    }
}

// 2. FITUR SWITCH MODE (Login <-> Register)
function toggleMode() {
    isRegisterMode = !isRegisterMode;

    // Elemen DOM
    const els = {
        title: document.getElementById('pageTitle'),
        subtitle: document.getElementById('pageSubtitle'),
        btn: document.getElementById('submitBtn'),
        footerText: document.getElementById('footerText'),
        toggleBtn: document.getElementById('toggleBtn'),
        heroTitle: document.getElementById('heroTitle'),
        // Groups
        grpName: document.getElementById('group-fullname'),
        grpConfirm: document.getElementById('group-confirm-pass'),
        grpTerms: document.getElementById('group-terms'),
        linkForgot: document.getElementById('link-forgot')
    };

    // Reset Form setiap ganti mode
    document.getElementById('authForm').reset();

    if (isRegisterMode) {
        // --- MODE REGISTER ---
        els.title.innerText = "Create Account";
        els.subtitle.innerText = "Start your culinary journey with us.";
        els.btn.innerText = "Register Now";
        els.footerText.innerText = "Already have an account?";
        els.toggleBtn.innerText = "Sign In";
        els.heroTitle.innerHTML = "Bergabunglah Bersama Kami<br>Daftar sekarang gratis!";

        // Tampilkan Field Register
        els.grpName.classList.remove('hidden');
        els.grpConfirm.classList.remove('hidden');
        els.grpTerms.classList.remove('hidden');
        
        // Sembunyikan Fitur Login
        els.linkForgot.classList.add('hidden');

        // Set Attribute Required
        document.getElementById('fullname').setAttribute('required', 'true');
        document.getElementById('confirm-password').setAttribute('required', 'true');

    } else {
        // --- MODE LOGIN ---
        els.title.innerText = "Welcome Back";
        els.subtitle.innerText = "Please enter your details to sign in.";
        els.btn.innerText = "Sign In";
        els.footerText.innerText = "Don't have an account yet?";
        els.toggleBtn.innerText = "Register for free";
        els.heroTitle.innerHTML = "Nikmati Makanan Lezat<br>Tanpa Harus Keluar Rumah";

        // Sembunyikan Field Register
        els.grpName.classList.add('hidden');
        els.grpConfirm.classList.add('hidden');
        els.grpTerms.classList.add('hidden');

        // Tampilkan Fitur Login
        els.linkForgot.classList.remove('hidden');

        // Hapus Attribute Required
        document.getElementById('fullname').removeAttribute('required');
        document.getElementById('confirm-password').removeAttribute('required');
    }
}

// 3. FUNGSI VALIDASI STANDAR
function validateForm(email, password, confirmPassword = null, terms = null) {
    // A. Validasi Email (Regex Standar)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return { valid: false, msg: "Format email tidak valid!" };
    }

    // B. Validasi Password (Min 6 Karakter)
    if (password.length < 6) {
        return { valid: false, msg: "Password minimal 6 karakter!" };
    }

    // C. Validasi Khusus Register
    if (isRegisterMode) {
        if (password !== confirmPassword) {
            return { valid: false, msg: "Konfirmasi password tidak cocok!" };
        }
        if (!terms) {
            return { valid: false, msg: "Anda harus menyetujui Syarat & Ketentuan." };
        }
        const name = document.getElementById('fullname').value;
        if (name.trim().length < 3) {
            return { valid: false, msg: "Nama lengkap terlalu pendek." };
        }
    }

    return { valid: true };
}

// 4. MAIN HANDLER (Submit Form)
// 4. MAIN HANDLER (Submit Form) - UPDATE UNTUK SISTEM MEMBER
function handleAuth(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const btn = document.getElementById('submitBtn');

    // Ambil data tambahan jika Register
    let confirmPass = null;
    let termsChecked = null;
    let fullname = "";

    if (isRegisterMode) {
        confirmPass = document.getElementById('confirm-password').value;
        termsChecked = document.getElementById('terms-condition').checked;
        fullname = document.getElementById('fullname').value;
    } else {
        // Jika Login, anggap nama usernya 'Adrian' (Hardcode dulu untuk simulasi)
        // Nanti bisa diambil dari database jika sudah ada backend
        fullname = "Adrian"; 
    }

    // 1. Lakukan Validasi
    const validation = validateForm(email, password, confirmPass, termsChecked);
    if (!validation.valid) {
        alert(validation.msg); 
        return;
    }

    // 2. Loading State
    const originalText = btn.innerText;
    btn.innerText = "Processing...";
    btn.style.opacity = "0.7";
    btn.disabled = true;
    btn.style.cursor = "not-allowed";

    // 3. Simulasi Proses (Delay 1.5 detik)
    setTimeout(() => {
        if (isRegisterMode) {
            // --- SKENARIO REGISTER ---
            // Simpan data user baru (Simulasi)
            localStorage.setItem('userRole', 'member'); // Set status jadi MEMBER
            localStorage.setItem('username', fullname); // Simpan nama asli inputan
            
            alert(`Registrasi Berhasil!\nSelamat datang, ${fullname}. Akun Anda telah aktif.`);
            
            // Langsung masuk ke Dashboard setelah register (UX modern)
            window.location.href = "dashboard.html"; 

        } else {
            // --- SKENARIO LOGIN ---
            // Simpan status login
            localStorage.setItem('userRole', 'member'); // Set status jadi MEMBER
            localStorage.setItem('username', fullname); // Simpan nama
            
            alert(`Login Berhasil! Mengalihkan ke Dashboard...`);
            window.location.href = "dashboard.html"; 
        }

        // Reset Button (Jaga-jaga jika redirect gagal)
        btn.innerText = originalText;
        btn.style.opacity = "1";
        btn.disabled = false;
        btn.style.cursor = "pointer";
    }, 1500);
}

// 5. FITUR FORGOT PASSWORD
function handleForgotPassword() {
    const email = document.getElementById('email').value;
    
    // UX: Jika email kosong, minta user isi dulu
    if (!email) {
        const inputEmail = prompt("Masukkan email akun Anda untuk reset password:");
        if(inputEmail) {
            alert(`Instruksi reset password telah dikirim ke ${inputEmail}. Cek inbox/spam Anda.`);
        }
        return;
    }
    
    // Jika email sudah terisi di form
    if(confirm(`Kirim link reset password ke ${email}?`)) {
        alert(`Terkirim! Silakan cek email ${email} untuk mereset password.`);
    }
}

// 6. FITUR SOCIAL LOGIN
function socialLogin(provider) {
    // Efek visual klik
    alert(`Mengalihkan ke halaman login ${provider}...`);
    
    // Simulasi delay redirect auth provider
    setTimeout(() => {
        console.log(`User logged in via ${provider}`);
        window.location.href = "dashboard.html";
    }, 1000);
}