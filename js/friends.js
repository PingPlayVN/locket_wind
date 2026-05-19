// [VIBECODE-PROJECT-NOTE]: MODULE FRIENDS CONTROLLER - Quản lý UI và logic tìm kiếm người dùng/bạn bè qua Username.
// Agent: Xử lý thao tác DOM hiển thị kết quả tìm kiếm và nút Gửi Kết Bạn.

import * as api from './api.js';

const dom = {
    searchBtn: document.getElementById('btnSearchFriend'),
    searchInput: document.getElementById('searchUsername'),
    searchResult: document.getElementById('searchResultBox'),
    friendsSection: document.getElementById('friendsSection')
};

export function initFriendsModule() {
    dom.searchBtn.addEventListener('click', async () => {
        const username = dom.searchInput.value.trim().replace('@', '');
        
        if (!username) return alert("Vui lòng nhập username cần tìm!");

        dom.searchBtn.disabled = true;
        dom.searchBtn.innerText = "🔍 Đang tìm...";
        dom.searchResult.innerHTML = `<div style="text-align:center; color:#888; font-style:italic;">Đang tìm kiếm @${username}...</div>`;

        try {
            const user = await api.searchUserByUsername(username);
            
            dom.searchBtn.disabled = false;
            dom.searchBtn.innerText = "Tìm Kiếm";

            if (!user || !user.uid) {
                dom.searchResult.innerHTML = `<div style="text-align:center; color:#ff1744; font-weight:500;">❌ Không tìm thấy người dùng @${username}</div>`;
                return;
            }

            const avatar = user.profile_picture_url || "https://www.w3schools.com/howto/img_avatar.png";
            const firstName = user.first_name || "";
            const lastName = user.last_name || "";
            const fullName = `${lastName} ${firstName}`.trim() || "Chưa Đặt Tên";
            
            const isGold = user.badge === "locket_gold";
            const badgeHtml = isGold ? `<span style="color:#FFD700; font-size:11px; font-weight:bold; background: rgba(255,215,0,0.1); padding: 2px 6px; border-radius: 4px; margin-left:6px;">💎 GOLD</span>` : '';
            const avatarBorder = isGold ? 'border: 2px solid #FFD700;' : 'border: 2px solid #444;';

            // Đổ giao diện Mini Card (Đã thêm nút Kết Bạn)
            dom.searchResult.innerHTML = `
                <div class="friend-result-card">
                    <img src="${avatar}" class="friend-avatar" style="${avatarBorder}">
                    <div class="friend-info">
                        <div class="friend-name">${fullName} ${badgeHtml}</div>
                        <div class="friend-username">@${username}</div>
                        <div class="friend-uid">UID: ${user.uid}</div>
                    </div>
                    <button id="btnAddFriend" class="btn-add-friend">➕ Kết Bạn</button>
                </div>
            `;

            // --- LẮNG NGHE SỰ KIỆN CLICK NÚT KẾT BẠN ---
            const btnAdd = document.getElementById('btnAddFriend');
            btnAdd.addEventListener('click', async () => {
                btnAdd.disabled = true;
                btnAdd.innerText = "⏳ Đang gửi...";
                
                try {
                    await api.addFriend(user.uid, user.celebrity === true);
                    // Đổi giao diện nút khi thành công
                    btnAdd.innerText = "✅ Đã gửi";
                    btnAdd.style.background = "#00e676";
                    btnAdd.style.color = "#004d40";
                } catch (err) {
                    btnAdd.innerText = "❌ Lỗi";
                    btnAdd.disabled = false;
                    alert("Không thể gửi kết bạn: " + err.message);
                }
            });

        } catch (error) {
            dom.searchBtn.disabled = false;
            dom.searchBtn.innerText = "Tìm Kiếm";
            dom.searchResult.innerHTML = `<div style="text-align:center; color:#ff1744;">❌ Lỗi: ${error.message}</div>`;
        }
    });
}

export function showFriendsUI() {
    dom.friendsSection.style.display = 'block';
}

export async function loadMyFriendsList() {
    const listContainer = document.getElementById('myFriendsList');
    if (window.isMyFriendsLoaded) return; // Nếu tải rồi thì không tải lại cho nhẹ máy
    
    listContainer.innerHTML = `<div style="text-align:center; color:#888;">⏳ Đang đồng bộ...</div>`;
    
    try {
        const friendsData = await api.getFriendsList();
        let uids = [];
        
        if (Array.isArray(friendsData)) {
            friendsData.forEach(item => {
                if (item.document && item.document.name) {
                    const uid = item.document.fields?.user?.stringValue || item.document.name.split('/').pop();
                    if (uid) uids.push(uid);
                }
            });
        }

        if (uids.length === 0) {
            listContainer.innerHTML = `<div style="text-align:center; color:#888;">Bạn chưa có người bạn nào.</div>`;
            return;
        }

        // Vẽ khung giao diện trống trước (Lazy load)
        let html = '';
        uids.forEach(uid => {
            html += `
            <div class="friend-result-card" id="list-friend-${uid}" style="margin-bottom: 10px; border:none; background:#111;">
                <div class="friend-avatar" style="background:#333; display:flex; align-items:center; justify-content:center; color:#888; font-size:10px;">...</div>
                <div class="friend-info">
                    <div class="friend-name" style="color:#888; font-size:14px;">Đang tải...</div>
                </div>
            </div>`;
        });
        listContainer.innerHTML = html;
        window.isMyFriendsLoaded = true;

        // Bắn API gọi thông tin từng người
        uids.forEach(async (uid) => {
            try {
                const profile = await api.fetchUserProfile(uid);
                if (profile) {
                    const firstName = profile.first_name || "";
                    const lastName = profile.last_name || "";
                    const username = profile.username || "";
                    let fullName = `${lastName} ${firstName}`.trim();
                    if (!fullName) fullName = username ? `@${username}` : "Bạn bè Locket";
                    const avatar = profile.profile_picture_url || "https://www.w3schools.com/howto/img_avatar.png";
                    
                    const isGold = profile.badge === "locket_gold";
                    const badgeHtml = isGold ? `<span style="color:#FFD700; font-size:10px; font-weight:bold; background: rgba(255,215,0,0.1); padding: 2px 6px; border-radius: 4px; margin-left:6px;">💎 GOLD</span>` : '';
                    const avatarBorder = isGold ? 'border: 2px solid #FFD700;' : 'border: 2px solid #333;';

                    const el = document.getElementById(`list-friend-${uid}`);
                    if (el) {
                        el.innerHTML = `
                            <img src="${avatar}" class="friend-avatar" style="${avatarBorder}">
                            <div class="friend-info">
                                <div class="friend-name" style="font-size:14px;">${fullName} ${badgeHtml}</div>
                                <div class="friend-username" style="font-size:12px;">@${username}</div>
                            </div>
                        `;
                    }
                }
            } catch(e) {
                 const el = document.getElementById(`list-friend-${uid}`);
                 if(el) el.querySelector('.friend-name').innerText = "Người dùng ẩn";
            }
        });

    } catch (err) {
        listContainer.innerHTML = `<div style="text-align:center; color:#ff4444;">❌ Lỗi tải danh sách</div>`;
    }
}