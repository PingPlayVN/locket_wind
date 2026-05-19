// [js/camera.js] - BẢN HOÀN THIỆN CÓ LƯU CACHE MÀU SETTING (LOCALSTORAGE)
import * as api from './api.js';
import * as friends from './friends.js';

let currentStream = null;
let currentBlob = null; 
let currentFacingMode = 'user'; 

const getDom = () => ({
    video: document.getElementById('cameraVideo'),
    captureBtn: document.getElementById('btnCapture'),
    btnFlipCamera: document.getElementById('btnFlipCamera'),
    canvas: document.createElement('canvas'),
    bottomControls: document.getElementById('bottomControls'),
    previewImage: document.getElementById('previewImage'),
    
    captionOverlay: document.getElementById('captionOverlay'),
    customColorPanel: document.getElementById('customColorPanel'), 
    color1: document.getElementById('vibeColor1'),
    color2: document.getElementById('vibeColor2'),
    color3: document.getElementById('vibeColor3'),
    useCustomVibe: document.getElementById('useCustomVibe'),
    
    btnToggleVibes: document.getElementById('btnToggleVibes'), 
    modalCaptionInput: document.getElementById('modalCaptionInput'),
    
    sendSheet: document.getElementById('sendSheet'),
    checkAllFriends: document.getElementById('checkAllFriends'),
    dynamicFriendsList: document.getElementById('dynamicFriendsList'),
    btnConfirmSend: document.getElementById('btnConfirmSend')
});

export async function startCamera() {
    try {
        const dom = getDom();
        const constraints = { video: { facingMode: currentFacingMode } };
        if (typeof dom.video.width !== 'undefined') constraints.video.width = { ideal: 1920 };
        if (typeof dom.video.height !== 'undefined') constraints.video.height = { ideal: 1920 };

        currentStream = await navigator.mediaDevices.getUserMedia(constraints);
        dom.video.srcObject = currentStream;

        if (currentFacingMode === 'environment') {
            dom.video.style.transform = 'scaleX(1)';
            dom.previewImage.style.transform = 'scaleX(1)';
        } else {
            dom.video.style.transform = 'scaleX(-1)';
            dom.previewImage.style.transform = 'scaleX(-1)';
        }
    } catch (error) { console.error("Camera Error:", error); }
}

export function stopCamera() {
    if (currentStream) { currentStream.getTracks().forEach(track => track.stop()); currentStream = null; }
}

async function flipCamera() {
    currentFacingMode = currentFacingMode === 'user' ? 'environment' : 'user';
    stopCamera();
    await startCamera(); 
}

function toggleVibePanel() {
    const dom = getDom();
    if (!dom.customColorPanel) return;
    dom.customColorPanel.style.display = dom.customColorPanel.style.display === 'block' ? 'none' : 'block';
    dom.modalCaptionInput.focus();
}

function capturePhoto() {
    const dom = getDom();
    if (!dom.video.videoWidth) return;
    
    let width = dom.video.videoWidth;
    let height = dom.video.videoHeight;
    const MAX_DIMENSION = 1440; 

    if (Math.max(width, height) > MAX_DIMENSION) {
        if (width > height) {
            height = Math.floor(height * (MAX_DIMENSION / width));
            width = MAX_DIMENSION;
        } else {
            width = Math.floor(width * (MAX_DIMENSION / height));
            height = MAX_DIMENSION;
        }
    }

    dom.canvas.width = width;
    dom.canvas.height = height;
    dom.canvas.getContext('2d').drawImage(dom.video, 0, 0, width, height);
    dom.canvas.toBlob((blob) => { currentBlob = blob; }, 'image/jpeg', 0.85);

    dom.previewImage.src = dom.canvas.toDataURL('image/jpeg');
    dom.previewImage.style.display = 'block';

    dom.bottomControls.style.display = 'none'; 
    dom.captionOverlay.style.display = 'flex'; 
    
    if (dom.btnToggleVibes) dom.btnToggleVibes.style.display = 'block';
    if (dom.customColorPanel) dom.customColorPanel.style.display = 'none'; 
    
    dom.sendSheet.style.display = 'flex'; 
    
    dom.modalCaptionInput.value = "";
    dom.modalCaptionInput.focus();
    loadFriendsList(dom);
}

async function confirmSendMoment() {
    const dom = getDom();
    if (!currentBlob) return;

    const caption = dom.modalCaptionInput.value.trim();
    let recipients = [];
    if (!dom.checkAllFriends.checked) {
        document.querySelectorAll('.target-friend:checked').forEach(cb => recipients.push(cb.value));
        if (recipients.length === 0) return alert("Vui lòng chọn ít nhất 1 người để gửi!");
    }

    let overlaysPayload = null;
    if (dom.useCustomVibe && dom.useCustomVibe.checked) {
        let bgColors = [dom.color1.value, dom.color2.value, dom.color3.value];
        overlaysPayload = [{
            "data": {
                "background": { "colors": bgColors },
                "icon": { "type": "emoji", "data": "⠀" }, // Ký tự tàng hình đánh lừa Locket
                "text_color": "#FFFFFF",
                "type": "static_content",
                "max_lines": { "value": "1", "@type": "type.googleapis.com/google.protobuf.Int64Value" },
                "text": caption
            },
            "overlay_id": "caption:custom_gradient",
            "alt_text": caption,
            "overlay_type": "caption"
        }];
    }

    const progressOverlay = document.getElementById('uploadProgressOverlay');
    const progressBar = document.getElementById('uploadProgressBar');
    const progressText = document.getElementById('uploadStatusText');

    const updateProgress = (percent, text) => {
        if(progressOverlay) progressOverlay.style.display = 'flex';
        if(progressBar) progressBar.style.width = `${percent}%`;
        if(progressText) progressText.innerText = text;
    };

    dom.btnConfirmSend.disabled = true;

    try {
        updateProgress(0, "☁️ Đang tải ảnh lên Firebase... 0%");
        const thumbnailUrl = await api.uploadPhotoToFirebaseWithProgress(currentBlob, (pct) => {
            updateProgress(Math.floor(pct * 0.8), `☁️ Đang tải ảnh lên... ${pct}%`);
        });
        
        updateProgress(85, "🔄 Đang xử lý mã hóa bảo mật...");
        const randomMd5 = [...Array(32)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
        
        updateProgress(90, "🚀 Đang gửi bài đăng lên Locket...");
        await api.postMoment(thumbnailUrl, randomMd5, caption, recipients, overlaysPayload);

        updateProgress(100, "✅ Đã gửi thành công!");
        
        setTimeout(() => {
            if(progressOverlay) progressOverlay.style.display = 'none';
            dom.previewImage.style.display = 'none';
            dom.captionOverlay.style.display = 'none';
            if (dom.customColorPanel) dom.customColorPanel.style.display = 'none';
            dom.sendSheet.style.display = 'none';
            dom.bottomControls.style.display = 'flex';
            dom.btnConfirmSend.disabled = false;
            
            // Lưu ý: Không reset màu Custom Vibe nữa để giữ Setting cho lần chụp sau
            currentBlob = null;
        }, 1500);

    } catch (error) {
        if(progressOverlay) progressOverlay.style.display = 'none';
        alert("❌ Lỗi: " + error.message);
        dom.btnConfirmSend.disabled = false;
    }
}

async function loadFriendsList(dom) {
    if (window.isFriendsLoaded) return;
    try {
        const friendsData = await api.getFriendsList();
        let html = ''; let friendUids = [];
        if (Array.isArray(friendsData)) {
            friendsData.forEach(item => {
                if (item.document && item.document.name) {
                    const friendUid = item.document.fields?.user?.stringValue || item.document.name.split('/').pop();
                    if (friendUid) {
                        friendUids.push(friendUid);
                        html += `<label class="send-user-item" id="friend-item-${friendUid}">
                            <div class="send-avatar" style="background:#333; color:#aaa; font-size:10px;">...</div>
                            <div class="send-name" style="flex: 1; color:#888; font-style:italic;">Đang tải...</div>
                            <input type="checkbox" class="send-checkbox target-friend" value="${friendUid}">
                        </label>`;
                    }
                }
            });
        }
        dom.dynamicFriendsList.innerHTML = html || `<div style="text-align:center; color:#888;">Chưa có bạn bè nào</div>`;
        window.isFriendsLoaded = true;

        friendUids.forEach(async (uid) => {
            try {
                const profile = await api.fetchUserProfile(uid);
                if (profile) {
                    const fullName = `${profile.last_name || ''} ${profile.first_name || ''}`.trim() || "Bạn bè Locket";
                    const avatar = profile.profile_picture_url || "https://www.w3schools.com/howto/img_avatar.png";
                    const itemEl = document.getElementById(`friend-item-${uid}`);
                    if (itemEl) {
                        itemEl.querySelector('.send-avatar').outerHTML = `<img src="${avatar}" class="send-avatar">`;
                        itemEl.querySelector('.send-name').innerText = fullName;
                        itemEl.querySelector('.send-name').style.color = "#fff";
                        itemEl.querySelector('.send-name').style.fontStyle = "normal";
                    }
                }
            } catch (e) {}
        });
    } catch (err) {}
}

document.addEventListener('DOMContentLoaded', () => {
    const dom = getDom();
    
    dom.captureBtn?.addEventListener('click', capturePhoto);
    dom.btnConfirmSend?.addEventListener('click', confirmSendMoment);
    dom.btnFlipCamera?.addEventListener('click', flipCamera);
    dom.btnToggleVibes?.addEventListener('click', toggleVibePanel);
    
    // ==========================================
    // LOGIC LƯU VÀ KHÔI PHỤC SETTING BẢNG MÀU
    // ==========================================
    const saveVibeSettings = () => {
        if (!dom.useCustomVibe) return;
        const settings = {
            c1: dom.color1.value,
            c2: dom.color2.value,
            c3: dom.color3.value,
            enabled: dom.useCustomVibe.checked
        };
        localStorage.setItem('locket_vibe_settings', JSON.stringify(settings));
    };

    const updateCaptionPreview = () => {
        if (dom.useCustomVibe && dom.useCustomVibe.checked) {
            const c1 = dom.color1.value, c2 = dom.color2.value, c3 = dom.color3.value;
            dom.captionOverlay.style.background = `linear-gradient(to bottom, ${c1}, ${c2}, ${c3})`;
            if(dom.btnToggleVibes) dom.btnToggleVibes.classList.add('active');
        } else {
            dom.captionOverlay.style.background = "rgba(30, 30, 30, 0.85)";
            if(dom.btnToggleVibes) dom.btnToggleVibes.classList.remove('active');
        }
        saveVibeSettings(); // Lưu tự động mỗi khi người dùng kéo màu hoặc tích ô
    };

    // Khôi phục Setting từ Cache khi vừa mở web
    try {
        const savedSettings = localStorage.getItem('locket_vibe_settings');
        if (savedSettings && dom.useCustomVibe) {
            const settings = JSON.parse(savedSettings);
            if (settings.c1) dom.color1.value = settings.c1;
            if (settings.c2) dom.color2.value = settings.c2;
            if (settings.c3) dom.color3.value = settings.c3;
            dom.useCustomVibe.checked = settings.enabled === true;
        }
    } catch(e) {
        console.error("Lỗi đọc cache màu:", e);
    }
    
    // Kích hoạt giao diện màu theo setting vừa load
    updateCaptionPreview();

    dom.color1?.addEventListener('input', updateCaptionPreview);
    dom.color2?.addEventListener('input', updateCaptionPreview);
    dom.color3?.addEventListener('input', updateCaptionPreview);
    dom.useCustomVibe?.addEventListener('change', updateCaptionPreview);

    // ==========================================

    dom.checkAllFriends?.addEventListener('change', () => {
        document.querySelectorAll('.target-friend').forEach(cb => cb.checked = false);
    });
    dom.dynamicFriendsList?.addEventListener('change', (e) => {
        if(e.target.classList.contains('target-friend') && e.target.checked) dom.checkAllFriends.checked = false;
    });

    dom.previewImage?.addEventListener('click', () => {
        dom.previewImage.style.display = 'none';
        dom.captionOverlay.style.display = 'none';
        if (dom.customColorPanel) dom.customColorPanel.style.display = 'none';
        dom.sendSheet.style.display = 'none';
        dom.bottomControls.style.display = 'flex';
        currentBlob = null;
    });
});