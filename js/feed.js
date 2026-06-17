// [js/feed.js] - MODULE QUẢN LÝ BẢNG TIN (FEED)
import * as api from './api.js';

let domFeed = null;

export function initFeedModule() {
    domFeed = {
        modal: document.getElementById('feedModal'),
        btnOpen: document.getElementById('btnOpenFeed'),
        btnClose: document.getElementById('btnCloseFeed'),
        container: document.getElementById('feedContainer')
    };

    if (domFeed.btnOpen) {
        domFeed.btnOpen.addEventListener('click', () => {
            domFeed.modal.style.display = 'flex';
            loadFeed();
        });
    }

    if (domFeed.btnClose) {
        domFeed.btnClose.addEventListener('click', () => {
            domFeed.modal.style.display = 'none';
            // Dừng tất cả video đang phát khi đóng bảng tin
            domFeed.container.querySelectorAll('video').forEach(v => v.pause());
        });
    }
}

async function loadFeed() {
    if (!domFeed) return;
    
    domFeed.container.innerHTML = `<div style="text-align:center; color:#FFD700; margin-top: 50vh; font-weight: bold;">⏳ Đang tải khoảnh khắc của bạn...</div>`;
    
    try {
        // 1. CHỈ LẤY ẢNH CỦA CHÍNH BẢN THÂN (Xóa logic quét bạn bè để triệt tiêu lỗi 403)
        let uidsToFetch = [api.session.localId]; 

        // 2. Fetch Ảnh & Thông tin cá nhân
        let allMoments = [];
        const fetchPromises = uidsToFetch.map(async (uid) => {
            try {
                const [moments, profile] = await Promise.all([
                    api.fetchUserMoments(uid).catch(() => []),
                    api.fetchUserProfile(uid).catch(() => ({}))
                ]);
                
                let profileInfo = { 
                    name: `${profile?.last_name || ''} ${profile?.first_name || ''}`.trim() || "Tôi", 
                    avatar: profile?.profile_picture_url || "https://www.w3schools.com/howto/img_avatar.png" 
                };

                if (Array.isArray(moments)) {
                    moments.forEach(m => {
                        if(m.document && m.document.fields) {
                            allMoments.push({
                                uid: uid,
                                profile: profileInfo,
                                fields: m.document.fields,
                                time: new Date(m.document.fields.date?.timestampValue || Date.now()).getTime()
                            });
                        }
                    });
                }
            } catch(e) {}
        });

        await Promise.all(fetchPromises);

        // 3. Sắp xếp ảnh mới nhất lên đầu tiên
        allMoments.sort((a, b) => b.time - a.time);

        // 4. In ra giao diện cuộn dọc
        if (allMoments.length === 0) {
            domFeed.container.innerHTML = `<div style="text-align:center; color:#888; margin-top: 50vh;">Bạn chưa đăng khoảnh khắc nào! Hãy chụp thử 1 tấm nhé.</div>`;
            return;
        }

        let html = '';
        allMoments.forEach(m => {
            const f = m.fields;
            const imgUrl = f.thumbnail_url?.stringValue || f.image_url?.stringValue || '';
            const videoUrl = f.video_url?.stringValue || null;
            const caption = f.caption?.stringValue || '';
            
            const diffMins = Math.floor((Date.now() - m.time) / 60000);
            let timeText = diffMins < 60 ? `${diffMins || 1} phút trước` : 
                          (diffMins < 1440 ? `${Math.floor(diffMins/60)} giờ trước` : `${Math.floor(diffMins/1440)} ngày trước`);

            let mediaHtml = videoUrl 
                ? `<video src="${videoUrl}" class="feed-media" autoplay loop muted playsinline></video>`
                : `<img src="${imgUrl}" class="feed-media">`;

            html += `
            <div class="feed-item">
                ${mediaHtml}
                <div class="feed-header">
                    <img src="${m.profile.avatar}" class="feed-avatar">
                    <div class="feed-info">
                        <span class="feed-name">${m.profile.name}</span>
                        <span class="feed-time">${timeText}</span>
                    </div>
                </div>
                ${caption ? `<div class="feed-caption">${caption}</div>` : ''}
            </div>`;
        });

        domFeed.container.innerHTML = html;

    } catch (error) {
        domFeed.container.innerHTML = `<div style="text-align:center; color:#ff4444; margin-top: 50vh;">❌ Lỗi tải Feed: ${error.message}</div>`;
    }
}