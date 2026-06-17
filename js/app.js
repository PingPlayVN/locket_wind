// [js/app.js] - BẢN ĐÃ XÓA AUTO LOGIN & ACTIVE KEY
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
    btnCloseFriends: document.getElementById('btnCloseFriends')
};

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

// --- Xử lý nút Đăng Nhập (Đăng nhập thẳng, không Check Key) ---
dom.btnLogin.addEventListener('click', async () => {
    const email = document.getElementById('email').value; // Bỏ trim() để tránh cắt mất dấu cách
    const password = document.getElementById('password').value;

    if(!email || !password) return dom.loginMsg.innerText = "Vui lòng nhập đủ thông tin!";
    
    dom.btnLogin.disabled = true; 
    dom.btnLogin.innerText = "Đang kết nối..."; 
    dom.loginMsg.innerText = "";

    try {
        await api.login(email, password);
        
        dom.loginModal.classList.remove('active');
        camera.startCamera();
        friends.initFriendsModule();
        loadProfileData();
    } catch (error) {
        dom.loginMsg.style.color = "#ff4444";
        dom.btnLogin.disabled = false; 
        dom.btnLogin.innerText = "Đăng Nhập";
        dom.loginMsg.innerText = "Lỗi: " + error.message;
    }
});

// --- Tải Profile ---
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