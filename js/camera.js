// [js/camera.js]
import * as api from './api.js';

let currentStream = null;
let currentBlob = null; 
let currentFacingMode = 'user'; // Camera trước

// LẤY DOM TRỰC TIẾP
const getDom = () => ({
    video: document.getElementById('cameraVideo'),
    captureBtn: document.getElementById('btnCapture'),
    btnFlipCamera: document.getElementById('btnFlipCamera'),
    canvas: document.createElement('canvas'),
    bottomControls: document.getElementById('bottomControls'),
    previewImage: document.getElementById('previewImage'),
    
    // UI Post
    captionOverlay: document.getElementById('captionOverlay'),
    sendSheet: document.getElementById('sendSheet'),
    checkAllFriends: document.getElementById('checkAllFriends'),
    dynamicFriendsList: document.getElementById('dynamicFriendsList'),
    modalCaptionInput: document.getElementById('modalCaptionInput'),
    btnConfirmSend: document.getElementById('btnConfirmSend')
});

// BẬT CAMERA VÀ XỬ LÝ LẬT GƯƠNG CSS (DÀNH CHO PREVIEW)
export async function startCamera() {
    try {
        const dom = getDom();
        const constraints = { 
            video: { 
                facingMode: currentFacingMode,
                width: { ideal: 2160, max: 4096 }, // Yêu cầu chiều rộng cực lớn
                height: { ideal: 2160, max: 4096 } // Trình duyệt sẽ tự lùi về mức Max của điện thoại
            }, 
            audio: false 
        };
        currentStream = await navigator.mediaDevices.getUserMedia(constraints);
        dom.video.srcObject = currentStream;

        // Xử lý LẬT GƯƠNG PREVIEW BẰNG CSS: Chỉ lật camera trước, camera sau giữ nguyên
        if (currentFacingMode === 'environment') {
            dom.video.style.transform = 'scaleX(1)';
            dom.previewImage.style.transform = 'scaleX(1)';
        } else {
            dom.video.style.transform = 'scaleX(-1)';
            dom.previewImage.style.transform = 'scaleX(-1)';
        }
    } catch (error) {
        console.error("Camera Error:", error);
    }
}

export function stopCamera() {
    if (currentStream) {
        currentStream.getTracks().forEach(track => track.stop());
        currentStream = null;
    }
}

// LẬT CỐNG CAMERA (MŨI TÊN XOAY)
async function flipCamera() {
    currentFacingMode = currentFacingMode === 'user' ? 'environment' : 'user';
    stopCamera();
    await startCamera(); 
}

// ==========================================
// HÀM TẢI DANH SÁCH BẠN BÈ (LAZY LOAD)
// ==========================================
async function loadFriendsList(dom) {
    if (window.isFriendsLoaded) return;
    
    dom.dynamicFriendsList.innerHTML = `<div style="text-align:center; padding: 20px; color:#888;">⏳ Đang lấy danh sách...</div>`;
    try {
        const friendsData = await api.getFriendsList();
        let html = '';
        let friendUids = [];

        if (Array.isArray(friendsData)) {
            friendsData.forEach(item => {
                if (item.document && item.document.name) {
                    const friendUid = item.document.fields?.user?.stringValue || item.document.name.split('/').pop();
                    if (friendUid) {
                        friendUids.push(friendUid);
                        html += `
                        <label class="send-user-item" id="friend-item-${friendUid}">
                            <div class="send-avatar" style="background:#333; color:#aaa; font-size:10px;">...</div>
                            <div class="send-name" style="flex: 1; color:#888; font-style:italic;">Đang tải thông tin...</div>
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
                    const friendAvatar = profile.profile_picture_url || "https://www.w3schools.com/howto/img_avatar.png";

                    const itemEl = document.getElementById(`friend-item-${uid}`);
                    if (itemEl) {
                        itemEl.querySelector('.send-avatar').outerHTML = `<img src="${friendAvatar}" class="send-avatar">`;
                        itemEl.querySelector('.send-name').innerText = fullName;
                        itemEl.querySelector('.send-name').style.color = "#fff";
                        itemEl.querySelector('.send-name').style.fontStyle = "normal";
                    }
                }
            } catch (e) {
                const itemEl = document.getElementById(`friend-item-${uid}`);
                if (itemEl) itemEl.querySelector('.send-name').innerText = "Người dùng ẩn";
            }
        });
    } catch (err) {
        dom.dynamicFriendsList.innerHTML = `<div style="text-align:center; color:#ff4444;">❌ Lỗi kết nối dữ liệu</div>`;
    }
}


// ==========================================
// 1. KHI BẤM NÚT CHỤP ẢNH
// ==========================================
function capturePhoto() {
    const dom = getDom();
    if (!dom.video.videoWidth) return;
    
    dom.canvas.width = dom.video.videoWidth;
    dom.canvas.height = dom.video.videoHeight;
    const ctx = dom.canvas.getContext('2d');
    
    // VẼ ẢNH RA CANVAS (KHÔNG LẬT GƯƠNG):
    // App Locket gốc và Camera iPhone luôn lưu ảnh là "góc nhìn của người khác nhìn bạn" (Không phải góc nhìn gương).
    // CSS của chúng ta đã xử lý lật gương Preview và Ảnh Preview rồi, nên Canvas chỉ cần vẽ chuẩn là đủ.
    ctx.drawImage(dom.video, 0, 0, dom.canvas.width, dom.canvas.height);

    dom.canvas.toBlob((blob) => { currentBlob = blob; }, 'image/webp', 0.98);

    // Hiển thị ảnh vừa chụp lên màn hình đè lên video
    dom.previewImage.src = dom.canvas.toDataURL('image/jpeg');
    dom.previewImage.style.display = 'block';

    // Đổi Giao diện UI Post
    dom.bottomControls.style.display = 'none'; // Giấu nút chụp
    dom.captionOverlay.style.display = 'flex'; // Hiện ô nhập tin nhắn lên ảnh
    dom.sendSheet.style.display = 'flex'; // Trượt danh sách bạn bè lên
    
    dom.modalCaptionInput.value = "";
    dom.modalCaptionInput.focus();

    // Kích hoạt lấy bạn bè ngay lập tức
    loadFriendsList(dom);
}

// ==========================================
// 2. KHI BẤM XÁC NHẬN GỬI ẢNH (➤)
// ==========================================
async function confirmSendMoment() {
    const dom = getDom();
    if (!currentBlob) return;

    const caption = dom.modalCaptionInput.value.trim();
    let recipients = [];
    
    if (!dom.checkAllFriends.checked) {
        document.querySelectorAll('.target-friend:checked').forEach(cb => recipients.push(cb.value));
        if (recipients.length === 0) return alert("Vui lòng chọn ít nhất 1 người để gửi!");
    }

    const progressOverlay = document.getElementById('uploadProgressOverlay');
    const progressBar = document.getElementById('uploadProgressBar');
    const progressText = document.getElementById('uploadStatusText');

    const updateProgress = (percent, text) => {
        progressOverlay.style.display = 'flex';
        progressBar.style.width = `${percent}%`;
        progressText.innerText = text;
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
        await api.postMoment(thumbnailUrl, randomMd5, caption, recipients);

        updateProgress(100, "✅ Đã gửi thành công!");
        
        // Reset UI sau 1 giây
        setTimeout(() => {
            progressOverlay.style.display = 'none';
            dom.previewImage.style.display = 'none';
            dom.captionOverlay.style.display = 'none';
            dom.sendSheet.style.display = 'none';
            dom.bottomControls.style.display = 'flex';
            dom.btnConfirmSend.disabled = false;
            currentBlob = null;
        }, 1000);

    } catch (error) {
        progressOverlay.style.display = 'none';
        alert("❌ Lỗi: " + error.message);
        dom.btnConfirmSend.disabled = false;
    }
}

// ==========================================
// GẮN SỰ KIỆN SAU KHI DOM ĐÃ LOAD XONG
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const dom = getDom();
    
    dom.captureBtn?.addEventListener('click', capturePhoto);
    dom.btnConfirmSend?.addEventListener('click', confirmSendMoment);
    
    // Thêm sự kiện lật camera
    dom.btnFlipCamera?.addEventListener('click', flipCamera);

    dom.checkAllFriends?.addEventListener('change', () => {
        document.querySelectorAll('.target-friend').forEach(cb => cb.checked = false);
    });

    dom.dynamicFriendsList?.addEventListener('change', (e) => {
        if(e.target.classList.contains('target-friend') && e.target.checked) {
            dom.checkAllFriends.checked = false;
        }
    });

    // Bấm vào ảnh preview để Hủy chụp, quay lại camera
    dom.previewImage?.addEventListener('click', () => {
        dom.previewImage.style.display = 'none';
        dom.captionOverlay.style.display = 'none';
        dom.sendSheet.style.display = 'none';
        dom.bottomControls.style.display = 'flex';
        currentBlob = null;
    });
});