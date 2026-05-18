// [VIBECODE-PROJECT-NOTE]: MODULE UI CONTROLLER - Nơi gắn sự kiện cho các nút bấm và cập nhật DOM.
// Agent: Xử lý hiển thị trạng thái Loading, Lỗi, và gán dữ liệu từ api.js vào giao diện.

import * as api from './api.js'; // Require thông qua đường dẫn tương đối từ index.html
import * as friends from './friends.js'; //(Gọi sang module bạn bè)

// Các thành phần DOM
const dom = {
    loginCard: document.getElementById('loginCard'),
    profileCard: document.getElementById('profileCard'),
    btnLogin: document.getElementById('btnLogin'),
    loginMsg: document.getElementById('loginMsg'),
    statusMessage: document.getElementById('statusMessage')
};

// Gắn sự kiện đăng nhập
dom.btnLogin.addEventListener('click', async () => {
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    if(!email || !password) return dom.loginMsg.innerText = "Vui lòng nhập đủ thông tin!";
    
    dom.btnLogin.disabled = true; 
    dom.btnLogin.innerText = "Đang kết nối..."; 
    dom.loginMsg.innerText = "";

    try {
        await api.login(email, password);
        
        // Đổi giao diện
        dom.loginCard.style.display = 'none';
        dom.profileCard.style.display = 'block';

        // --- KÍCH HOẠT MODULE BẠN BÈ TẠI ĐÂY ---
        friends.initFriendsModule();
        friends.showFriendsUI();
        
        loadProfileData();
    } catch (error) {
        dom.loginMsg.innerText = "Lỗi: " + error.message;
        dom.btnLogin.disabled = false; 
        dom.btnLogin.innerText = "Đăng Nhập & Tải Hồ Sơ";
    }
});

// Hàm hiển thị dữ liệu Profile
async function loadProfileData() {
    dom.statusMessage.innerText = "Đang đồng bộ dữ liệu hồ sơ...";

    try {
        const userData = await api.fetchUserProfile();
        if (!userData) throw new Error("Không lấy được dữ liệu từ Server");

        // Gán Ảnh
        document.getElementById('userAvatar').src = userData.profile_picture_url || "https://www.w3schools.com/howto/img_avatar.png";

        // Gán Tên
        const firstName = userData.first_name || "";
        const lastName = userData.last_name || "";
        document.getElementById('userFullName').innerText = `${lastName} ${firstName}`.trim() || "Chưa Đặt Tên";
        document.getElementById('userUsername').innerText = userData.username ? `@${userData.username}` : "@no_username";
        
        // Gán thông tin chi tiết
        document.getElementById('userUid').innerText = userData.uid || "-";
        document.getElementById('userFirstName').innerText = firstName || "(Trống)";
        document.getElementById('userLastName').innerText = lastName || "(Trống)";
        
        // Xử lý Badge Gold
        const badgeEl = document.getElementById('userBadge');
        const goldBadge = document.getElementById('goldBadge');
        
        if (userData.badge === "locket_gold") {
            badgeEl.innerText = "Locket Gold VIP 💎";
            badgeEl.style.color = "#FFD700";
            goldBadge.style.display = "block";
        } else {
            badgeEl.innerText = "Thành Viên Tiêu Chuẩn";
            badgeEl.style.color = "#888";
            goldBadge.style.display = "none";
        }

        dom.statusMessage.innerText = "✓ Đồng bộ hồ sơ hoàn tất!";
        dom.statusMessage.style.color = "#00e676";

    } catch (error) {
        dom.statusMessage.innerText = "❌ Lỗi: " + error.message;
        dom.statusMessage.style.color = "#ff1744";
    }
}