// [js/app.js]
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
    
    // Nút mở Modal
    btnOpenProfile: document.getElementById('btnOpenProfile'),
    btnOpenFriends: document.getElementById('btnOpenFriends'),
    
    // Nút đóng Modal
    btnCloseProfile: document.getElementById('btnCloseProfile'),
    btnCloseFriends: document.getElementById('btnCloseFriends')
};

// --- GÁN SỰ KIỆN ĐÓNG MỞ MODAL ---
dom.btnOpenProfile.addEventListener('click', () => dom.profileModal.classList.add('active'));
dom.btnCloseProfile.addEventListener('click', () => dom.profileModal.classList.remove('active'));

dom.btnOpenFriends.addEventListener('click', () => {
    dom.friendsModal.classList.add('active');
    
    // GỌI HÀM TẢI DANH SÁCH BẠN BÈ Ở ĐÂY 👇
    friends.loadMyFriendsList(); 
});
dom.btnCloseFriends.addEventListener('click', () => dom.friendsModal.classList.remove('active'));

// Bấm ra ngoài vùng đen để đóng modal
document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
        if(e.target === overlay) overlay.classList.remove('active');
    });
});


// --- ĐĂNG NHẬP ---
dom.btnLogin.addEventListener('click', async () => {
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    if(!email || !password) return dom.loginMsg.innerText = "Vui lòng nhập đủ thông tin!";
    
    dom.btnLogin.disabled = true; 
    dom.btnLogin.innerText = "Đang kết nối..."; 
    dom.loginMsg.innerText = "";

    try {
        await api.login(email, password);
        
        // Đăng nhập thành công -> Ẩn màn Login đi
        dom.loginModal.classList.remove('active');

        // Bật Camera lên làm màn hình chính
        camera.startCamera();

        // Kích hoạt module tìm bạn
        friends.initFriendsModule();
        
        // Tải Profile
        loadProfileData();
    } catch (error) {
        dom.loginMsg.innerText = "Lỗi: " + error.message;
        dom.btnLogin.disabled = false; 
        dom.btnLogin.innerText = "Đăng Nhập";
    }
});

// --- TẢI PROFILE ---
async function loadProfileData() {
    dom.statusMessage.innerText = "Đang đồng bộ dữ liệu...";
    try {
        const userData = await api.fetchUserProfile();
        if (!userData) throw new Error("Lỗi Server");

        const avatarUrl = userData.profile_picture_url || "https://www.w3schools.com/howto/img_avatar.png";
        
        // Cập nhật Avatar ở màn hình chính (Top-left)
        document.getElementById('btnOpenProfile').src = avatarUrl;
        
        // Cập nhật ở trong Modal
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