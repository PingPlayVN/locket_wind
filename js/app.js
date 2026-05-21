// [js/app.js] - BẢN NÂNG CẤP: AUTO LOGIN & MÃ HÓA CACHE
import * as api from './api.js'; 
import * as friends from './friends.js'; 
import * as camera from './camera.js';

const dom = {
    loginModal: document.getElementById('loginModal'),
    profileModal: document.getElementById('profileModal'),
    friendsModal: document.getElementById('friendsModal'),
    btnLogin: document.getElementById('btnLogin'),
    loginMsg: document.getElementById('loginMsg'),
    statusMessage: document.getElementById('statusMessage'),
    btnOpenProfile: document.getElementById('btnOpenProfile'),
    btnOpenFriends: document.getElementById('btnOpenFriends'),
    btnCloseProfile: document.getElementById('btnCloseProfile'),
    btnCloseFriends: document.getElementById('btnCloseFriends'),
    // Bắt cái nút Đăng Xuất đang xài inline onclick trong HTML
    btnLogout: document.querySelector('button[onclick="location.reload()"]') 
};

// --- SỰ KIỆN ĐÓNG MỞ MODAL ---
dom.btnOpenProfile.addEventListener('click', () => dom.profileModal.classList.add('active'));
dom.btnCloseProfile.addEventListener('click', () => dom.profileModal.classList.remove('active'));

dom.btnOpenFriends.addEventListener('click', () => {
    dom.friendsModal.classList.add('active');
    friends.loadMyFriendsList(); 
});
dom.btnCloseFriends.addEventListener('click', () => dom.friendsModal.classList.remove('active'));

document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
        if(e.target === overlay) overlay.classList.remove('active');
    });
});


// ==========================================
// BẢO MẬT: HÀM MÃ HÓA & GIẢI MÃ
// ==========================================
function encryptData(text) { 
    // Mã hóa Base64 kết hợp Unicode để chống đọc trộm
    return btoa(encodeURIComponent(text)); 
}
function decryptData(hash) { 
    try { return decodeURIComponent(atob(hash)); } 
    catch (e) { return null; } 
}


// ==========================================
// QUẢN LÝ ACTIVE KEY & AUTO LOGIN (ĐÃ MÃ HÓA)
// ==========================================
const domAuth = {
    activeKeySection: document.getElementById('activeKeySection'),
    activeKeyInput: document.getElementById('activeKey'),
    btnRequestCode: document.getElementById('btnRequestCode'),
    emailInput: document.getElementById('email'),
    passwordInput: document.getElementById('password')
};

// 1. Quản lý Active Key
function getSavedActiveKey(email) {
    try {
        const encryptedStr = localStorage.getItem('locket_local_keys');
        if (!encryptedStr) return null;
        const keys = JSON.parse(decryptData(encryptedStr) || '{}');
        return keys[email] || null;
    } catch (e) { return null; }
}

function saveActiveKey(email, key) {
    try {
        const encryptedStr = localStorage.getItem('locket_local_keys');
        const keys = encryptedStr ? JSON.parse(decryptData(encryptedStr) || '{}') : {};
        keys[email] = key;
        localStorage.setItem('locket_local_keys', encryptData(JSON.stringify(keys)));
    } catch (e) {}
}

function removeActiveKey(email) {
    try {
        const encryptedStr = localStorage.getItem('locket_local_keys');
        const keys = encryptedStr ? JSON.parse(decryptData(encryptedStr) || '{}') : {};
        delete keys[email];
        localStorage.setItem('locket_local_keys', encryptData(JSON.stringify(keys)));
    } catch (e) {}
}

// 2. Quản lý Phiên Tự Động Đăng Nhập
function saveAutoLoginSession(email, password) {
    const sessionData = { e: email, p: password };
    localStorage.setItem('locket_auto_login', encryptData(JSON.stringify(sessionData)));
}

function getAutoLoginSession() {
    try {
        const encryptedStr = localStorage.getItem('locket_auto_login');
        if (!encryptedStr) return null;
        return JSON.parse(decryptData(encryptedStr));
    } catch (e) { return null; }
}

function clearAutoLoginSession() {
    localStorage.removeItem('locket_auto_login');
}

// Sửa lại nút Đăng Xuất: Xóa Cache Phiên rồi mới load lại trang
if (dom.btnLogout) {
    dom.btnLogout.removeAttribute('onclick'); // Xóa sự kiện mặc định
    dom.btnLogout.addEventListener('click', () => {
        clearAutoLoginSession();
        location.reload();
    });
}

// Ẩn vùng nhập Key nếu Email đã có trong Cache
domAuth.emailInput.addEventListener('input', (e) => {
    const email = e.target.value.trim();
    if (getSavedActiveKey(email)) {
        domAuth.activeKeySection.style.display = 'none';
        dom.loginMsg.innerText = "";
    }
});


// ==========================================
// SỰ KIỆN GỬI MÃ & ĐĂNG NHẬP
// ==========================================
domAuth.btnRequestCode.addEventListener('click', async () => {
    const email = domAuth.emailInput.value.trim();
    if (!email) return dom.loginMsg.innerText = "Vui lòng điền Email trước khi gửi mã!";

    domAuth.btnRequestCode.disabled = true;
    domAuth.btnRequestCode.innerText = "⏳ Đang gửi yêu cầu...";
    dom.loginMsg.style.color = "#FFD700";
    dom.loginMsg.innerText = "Đang kết nối với máy chủ cấp mã...";

    try {
        await api.requestActiveKey(email);
        domAuth.btnRequestCode.innerText = "✅ Đã Gửi Mã Thành Công";
        dom.loginMsg.style.color = "#00e676";
        dom.loginMsg.innerText = "Vui lòng kiểm tra hộp thư (hoặc Spam) và dán mã vào ô bên dưới.";
    } catch(err) {
        dom.loginMsg.style.color = "#ff4444";
        dom.loginMsg.innerText = "❌ Lỗi: " + err.message;
        domAuth.btnRequestCode.disabled = false;
        domAuth.btnRequestCode.innerText = "📩 Thử Gửi Lại Mã";
    }
});

dom.btnLogin.addEventListener('click', async () => {
    const email = domAuth.emailInput.value.trim();
    const password = domAuth.passwordInput.value.trim();
    let activeKey = domAuth.activeKeyInput.value.trim();

    if(!email || !password) return dom.loginMsg.innerText = "Vui lòng nhập đủ thông tin!";

    const cachedKey = getSavedActiveKey(email);
    if (cachedKey) activeKey = cachedKey;

    if (!activeKey) {
        domAuth.activeKeySection.style.display = 'block';
        dom.loginMsg.style.color = "#FFD700";
        dom.loginMsg.innerText = "⚠️ Vui lòng lấy mã và điền Active Key để đăng nhập!";
        return;
    }
    
    dom.btnLogin.disabled = true; 
    dom.btnLogin.innerText = "Đang kiểm tra mã bảo mật..."; 
    dom.loginMsg.innerText = "";

    try {
        await api.login(email, password, activeKey);
        
        // MÃ ĐÚNG -> LƯU ACTIVE KEY & LƯU PHIÊN AUTO LOGIN
        saveActiveKey(email, activeKey);
        saveAutoLoginSession(email, password);
        
        dom.loginModal.classList.remove('active');
        camera.startCamera();
        friends.initFriendsModule();
        loadProfileData();
    } catch (error) {
        dom.loginMsg.style.color = "#ff4444";
        dom.btnLogin.disabled = false; 
        dom.btnLogin.innerText = "Đăng Nhập";
        
        clearAutoLoginSession(); // Nếu đăng nhập xịt thì xóa phiên auto login

        // MÃ SAI -> XÓA CACHE ACTIVE KEY VÀ BUNG Ô NHẬP MÃ
        if (error.message.includes("Khóa không hợp lệ") || error.message.includes("ActivateKeyNotFoundError") || error.message.includes("hết hạn")) {
            removeActiveKey(email); 
            domAuth.activeKeyInput.value = "";
            domAuth.activeKeySection.style.display = 'block';
            dom.loginMsg.innerText = "⚠️ Mã Active Key bị sai hoặc đã hết hạn. Vui lòng lấy mã mới!";
        } else {
            dom.loginMsg.innerText = "Lỗi: " + error.message;
        }
    }
});

// --- TẢI PROFILE ---
async function loadProfileData() {
    dom.statusMessage.innerText = "Đang đồng bộ dữ liệu...";
    try {
        const userData = await api.fetchUserProfile();
        if (!userData) throw new Error("Lỗi Server");

        const avatarUrl = userData.profile_picture_url || "https://www.w3schools.com/howto/img_avatar.png";
        
        document.getElementById('btnOpenProfile').src = avatarUrl;
        document.getElementById('userAvatar').src = avatarUrl;
        document.getElementById('userFullName').innerText = `${userData.last_name || ''} ${userData.first_name || ''}`.trim() || "Chưa Đặt Tên";
        document.getElementById('userUsername').innerText = userData.username ? `@${userData.username}` : "@no_username";
        document.getElementById('userUid').innerText = userData.uid || "-";
        
        if (userData.badge === "locket_gold") {
            document.getElementById('userBadge').innerText = "Locket Gold VIP 💎";
        }
        dom.statusMessage.innerText = "✓ Đồng bộ hoàn tất";
    } catch (error) {
        dom.statusMessage.innerText = "❌ Lỗi: " + error.message;
        dom.statusMessage.style.color = "#ff1744";
    }
}

// ==========================================
// KHỞI ĐỘNG: KIỂM TRA & TỰ ĐỘNG ĐĂNG NHẬP
// ==========================================
window.addEventListener('DOMContentLoaded', () => {
    const session = getAutoLoginSession();
    if (session && session.e && session.p) {
        domAuth.emailInput.value = session.e;
        domAuth.passwordInput.value = session.p;
        
        // Cập nhật UI trông cho pro
        domAuth.activeKeySection.style.display = 'none';
        dom.loginMsg.style.color = "#00e676";
        dom.loginMsg.innerText = "🔄 Đang tự động khôi phục phiên đăng nhập...";
        
        // Tự động kích hoạt nút Đăng Nhập
        setTimeout(() => dom.btnLogin.click(), 500);
    }
});