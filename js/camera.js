// [js/camera.js] - CẬP NHẬT UI CHỤP ẢNH & CHỌN BẠN BÈ TRƯỢT NGANG
import * as api from './api.js';
import * as captionModule from './caption.js';

let currentStream = null;
let currentBlob = null; 
let currentVideoBlob = null; 
let currentFacingMode = 'user'; 

let mediaRecorder = null;
let recordedChunks = [];
let pressTimer = null;
let isLongPress = false;
let isRecordingCanvas = false;
let recordingStartTime = 0;

const getDom = () => ({
    video: document.getElementById('cameraVideo'),
    captureBtn: document.getElementById('btnCapture'),
    btnFlipCamera: document.getElementById('btnFlipCamera'),
    canvas: document.createElement('canvas'),
    
    // UI Elements
    mainTopBar: document.getElementById('mainTopBar'),
    postTopBar: document.getElementById('postTopBar'),
    bottomControls: document.getElementById('bottomControls'),
    postActionControls: document.getElementById('postActionControls'),
    
    previewImage: document.getElementById('previewImage'),
    previewVideo: document.getElementById('previewVideo'), 
    captionOverlay: document.getElementById('captionOverlay'),
    modalCaptionInput: document.getElementById('modalCaptionInput'),
    
    // Action Buttons
    btnCancelPost: document.getElementById('btnCancelPost'),
    btnConfirmSend: document.getElementById('btnConfirmSend'),
    progressWrapper: document.getElementById('recordingProgressWrapper'),
    
    // Bảng trượt ngang
    horizontalFriendsList: document.getElementById('horizontalFriendsList'),

    // Elements của Caption Editor
    btnMagic: document.getElementById('btnMagic'),
    captionEditorSheet: document.getElementById('captionEditorSheet'),
    btnCloseCaptionEditor: document.getElementById('btnCloseCaptionEditor'),
    customCaptionInput: document.getElementById('customCaptionInput'),
    captionStyleList: document.getElementById('captionStyleList')
});

export async function startCamera() {
    try {
        const dom = getDom();
        const constraints = { video: { facingMode: currentFacingMode, width: { ideal: 1080 }, height: { ideal: 1080 } }, audio: false };
        currentStream = await navigator.mediaDevices.getUserMedia(constraints);
        dom.video.srcObject = currentStream;
        const transformValue = currentFacingMode === 'environment' ? 'scaleX(1)' : 'scaleX(-1)';
        dom.video.style.transform = transformValue;
        dom.previewImage.style.transform = transformValue;
        dom.previewVideo.style.transform = transformValue;
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

// Chuyển đổi màn hình từ Camera -> Preview
function transitionToPreview(dom) {
    dom.mainTopBar.style.display = 'none';
    dom.bottomControls.style.display = 'none'; 
    
    dom.postTopBar.style.display = 'flex';
    dom.captionOverlay.style.display = 'flex'; 
    dom.postActionControls.style.display = 'flex';
    dom.horizontalFriendsList.style.display = 'flex';

    dom.modalCaptionInput.value = "";
    dom.modalCaptionInput.focus();
    loadHorizontalFriendsList(dom); // Tải danh sách bạn bè trượt ngang
}

// 1. CHỤP ẢNH
function capturePhoto() {
    const dom = getDom();
    if (!dom.video.videoWidth) return;
    
    const size = Math.min(dom.video.videoWidth, dom.video.videoHeight);
    const startX = (dom.video.videoWidth - size) / 2;
    const startY = (dom.video.videoHeight - size) / 2;
    let finalSize = size;
    const MAX_DIMENSION = 1440; 
    if (size > MAX_DIMENSION) finalSize = MAX_DIMENSION;

    dom.canvas.width = finalSize; dom.canvas.height = finalSize;
    dom.canvas.getContext('2d').drawImage(dom.video, startX, startY, size, size, 0, 0, finalSize, finalSize);
    
    dom.canvas.toBlob((blob) => { currentBlob = blob; }, 'image/jpeg', 0.85);
    dom.previewImage.src = dom.canvas.toDataURL('image/jpeg');
    dom.previewImage.style.display = 'block';
    dom.previewVideo.style.display = 'none';
    currentVideoBlob = null; 
    transitionToPreview(dom);
}

// 2. QUAY VIDEO
function startRecordingVideo() {
    if (!currentStream) return;
    const dom = getDom();
    recordedChunks = [];
    isRecordingCanvas = true;
    recordingStartTime = Date.now();

    dom.captureBtn.style.transform = 'scale(1.2)'; 
    dom.captureBtn.style.backgroundColor = 'rgba(255, 68, 68, 0.5)';
    dom.captureBtn.style.borderColor = '#ff4444'; 

    if (dom.progressWrapper) {
        dom.progressWrapper.style.display = 'block';
        dom.progressWrapper.style.setProperty('--progress', '0%');
    }

    const recordCanvas = document.createElement('canvas');
    const size = Math.min(dom.video.videoWidth, dom.video.videoHeight);
    recordCanvas.width = size; recordCanvas.height = size;
    const ctx = recordCanvas.getContext('2d');
    const startX = (dom.video.videoWidth - size) / 2;
    const startY = (dom.video.videoHeight - size) / 2;

    function drawFrame() {
        if (!isRecordingCanvas) return;
        ctx.drawImage(dom.video, startX, startY, size, size, 0, 0, size, size);
        
        const elapsed = Date.now() - recordingStartTime;
        const maxDuration = 15000; 
        if (elapsed >= maxDuration) { stopRecordingVideo(); return; }
        if (dom.progressWrapper) {
            dom.progressWrapper.style.setProperty('--progress', `${Math.min(elapsed / maxDuration, 1) * 100}%`);
        }
        requestAnimationFrame(drawFrame);
    }
    drawFrame();

    const canvasStream = recordCanvas.captureStream(30);
    mediaRecorder = new MediaRecorder(canvasStream, { mimeType: 'video/webm' });
    mediaRecorder.ondataavailable = e => { if (e.data.size > 0) recordedChunks.push(e.data); };
    mediaRecorder.onstop = () => {
        isRecordingCanvas = false;
        currentVideoBlob = new Blob(recordedChunks, { type: 'video/mp4' });
        dom.canvas.width = size; dom.canvas.height = size;
        dom.canvas.getContext('2d').drawImage(recordCanvas, 0, 0, size, size);
        dom.canvas.toBlob((blob) => { currentBlob = blob; }, 'image/jpeg', 0.85);
        dom.previewVideo.src = URL.createObjectURL(currentVideoBlob);
        dom.previewVideo.style.display = 'block';
        dom.previewImage.style.display = 'none';
        transitionToPreview(dom);
    };
    mediaRecorder.start();
}

function stopRecordingVideo() {
    const dom = getDom();
    if (dom.progressWrapper) dom.progressWrapper.style.display = 'none';
    isRecordingCanvas = false;
    if (mediaRecorder && mediaRecorder.state !== 'inactive') mediaRecorder.stop();
    dom.captureBtn.style.transform = ''; dom.captureBtn.style.backgroundColor = ''; dom.captureBtn.style.borderColor = '';
}

// ===============================================
// MODULE TẢI BẠN BÈ VÀ HIỆU ỨNG SÁNG VIỀN
// ===============================================
async function loadHorizontalFriendsList(dom) {
    if (window.isHorizontalFriendsLoaded) return;
    window.isHorizontalFriendsLoaded = true;

    // 1. Tạo ô "Tất cả" và "Riêng tư" trước
    dom.horizontalFriendsList.innerHTML = `
        <div class="friend-circle-item selected" id="item-all">
            <div class="friend-circle-avatar">👥</div>
            <div class="friend-circle-name">Tất cả</div>
        </div>
        <div class="friend-circle-item" id="item-private">
            <div class="friend-circle-avatar">🔒</div>
            <div class="friend-circle-name">Riêng tư</div>
        </div>
    `;

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

        // Vẽ bộ khung trống cho các bạn bè
        uids.forEach(uid => {
            dom.horizontalFriendsList.insertAdjacentHTML('beforeend', `
                <div class="friend-circle-item target-friend" data-uid="${uid}" id="item-${uid}">
                    <div class="friend-circle-avatar"><span style="font-size:10px;color:#666;">...</span></div>
                    <div class="friend-circle-name">...</div>
                </div>
            `);
        });

        // Tải Avatar từng người
        uids.forEach(async (uid) => {
            try {
                const profile = await api.fetchUserProfile(uid);
                if (profile) {
                    const fullName = profile.first_name || profile.last_name || "Bạn Locket";
                    const avatar = profile.profile_picture_url || "https://www.w3schools.com/howto/img_avatar.png";
                    const el = document.getElementById(`item-${uid}`);
                    if (el) {
                        el.querySelector('.friend-circle-avatar').innerHTML = `<img src="${avatar}">`;
                        el.querySelector('.friend-circle-name').innerText = fullName;
                    }
                }
            } catch(e) {}
        });

    } catch (err) { console.error(err); }

    // XỬ LÝ CHỌN (SÁNG VIỀN)
    dom.horizontalFriendsList.addEventListener('click', (e) => {
        const item = e.target.closest('.friend-circle-item');
        if (!item) return;

        if (item.id === 'item-all' || item.id === 'item-private') {
            // Chạm "Tất cả" hoặc "Riêng tư": Xóa viền tất cả người khác, chỉ sáng viền ô này
            document.querySelectorAll('.friend-circle-item').forEach(el => el.classList.remove('selected'));
            item.classList.add('selected');
        } else {
            // Chạm bạn bè cụ thể: Tắt viền "Tất cả" và "Riêng tư", bật/tắt viền của người này
            document.getElementById('item-all')?.classList.remove('selected');
            document.getElementById('item-private')?.classList.remove('selected');
            item.classList.toggle('selected');
        }
    });
}

// 3. XÁC NHẬN GỬI
async function confirmSendMoment() {
    const dom = getDom();
    if (!currentBlob && !currentVideoBlob) return;
    const caption = dom.modalCaptionInput.value.trim();
    let recipients = [];

    // Kiểm tra ai đang sáng viền
    const isAllSelected = document.getElementById('item-all')?.classList.contains('selected');
    const isPrivateSelected = document.getElementById('item-private')?.classList.contains('selected');

    if (isPrivateSelected) {
        recipients = [api.session.localId]; // Riêng tư -> Gửi cho chính mình
    } else if (!isAllSelected) {
        document.querySelectorAll('.target-friend.selected').forEach(el => recipients.push(el.dataset.uid));
        if (recipients.length === 0) return alert("Vui lòng chọn ít nhất 1 người để gửi!");
    }

    let overlaysPayload = captionModule.getCaptionPayload(caption);

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
        let thumbnailUrl = ""; let videoUrl = null;
        if (currentVideoBlob) {
            updateProgress(10, "Đang tạo ảnh thu nhỏ...");
            thumbnailUrl = await api.uploadPhotoToFirebaseWithProgress(currentBlob, null);
            updateProgress(20, "Đang tải video...");
            videoUrl = await api.uploadVideoToFirebaseWithProgress(currentVideoBlob, (pct) => { updateProgress(20 + Math.floor(pct * 0.6), `Đang tải Video... ${pct}%`); });
        } else {
            updateProgress(0, "Đang tải ảnh lên Firebase...");
            thumbnailUrl = await api.uploadPhotoToFirebaseWithProgress(currentBlob, (pct) => { updateProgress(Math.floor(pct * 0.8), `Đang tải ảnh... ${pct}%`); });
        }
        
        updateProgress(85, "Đang đồng bộ...");
        const randomMd5 = [...Array(32)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
        
        updateProgress(90, "Đang gửi lên Locket...");
        await api.postMoment(thumbnailUrl, randomMd5, caption, recipients, overlaysPayload, videoUrl);
        updateProgress(100, "Đã gửi thành công!");
        
        setTimeout(() => {
            if(progressOverlay) progressOverlay.style.display = 'none';
            document.getElementById('btnCancelPost').click(); 
            dom.btnConfirmSend.disabled = false;
        }, 1500);
    } catch (error) {
        if(progressOverlay) progressOverlay.style.display = 'none';
        alert("Lỗi: " + error.message);
        dom.btnConfirmSend.disabled = false;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const dom = getDom();
    captionModule.initCaptionEditor(dom);
    
    // ===============================================
    // XỬ LÝ NÚT CHỤP / QUAY VIDEO (CHỐNG LỖI TỰ CHỤP)
    // ===============================================
    let isButtonPressed = false; // Cờ theo dõi trạng thái chạm

    const handlePointerDown = (e) => {
        if(e.cancelable) e.preventDefault();
        isButtonPressed = true;
        isLongPress = false;
        
        pressTimer = setTimeout(() => { 
            // Nếu ngón tay đã trượt ra ngoài trước 300ms thì hủy lệnh quay
            if (!isButtonPressed) return; 
            isLongPress = true; 
            startRecordingVideo(); 
        }, 300);
    };

    const handlePointerUp = (e) => {
        if(e.cancelable) e.preventDefault();
        if (!isButtonPressed) return; // Nếu đã xử lý rồi thì bỏ qua (chống dội đúp)
        
        isButtonPressed = false;
        clearTimeout(pressTimer);
        
        if (isLongPress) {
            stopRecordingVideo(); // Đang quay thì dừng
        } else {
            capturePhoto(); // Chạm nhả nhanh thì chụp
        }
    };

    const handlePointerLeave = (e) => {
        if(e.cancelable) e.preventDefault();
        if (!isButtonPressed) return;
        
        isButtonPressed = false;
        clearTimeout(pressTimer);
        
        // Nếu trượt tay ra ngoài lúc đang quay -> Dừng quay
        if (isLongPress) {
            stopRecordingVideo(); 
        }
        // LƯU Ý: Tuyệt đối KHÔNG gọi capturePhoto() ở đây để chống chụp nhầm
    };

    // Gắn sự kiện (Đã tách riêng Leave và Up)
    dom.captureBtn?.addEventListener('pointerdown', handlePointerDown);
    dom.captureBtn?.addEventListener('pointerup', handlePointerUp);
    dom.captureBtn?.addEventListener('pointercancel', handlePointerLeave); // Thêm pointercancel phòng hờ iOS
    dom.captureBtn?.addEventListener('pointerleave', handlePointerLeave);
    
    dom.btnConfirmSend?.addEventListener('click', confirmSendMoment);
    dom.btnFlipCamera?.addEventListener('click', flipCamera);

    // Hủy gửi (Nút X)
    const cancelSend = () => {
        captionModule.resetCaptionStyle(dom);
        
        dom.previewImage.style.display = 'none';
        dom.previewVideo.style.display = 'none';
        dom.previewVideo.src = "";
        
        dom.postTopBar.style.display = 'none';
        dom.captionOverlay.style.display = 'none';
        dom.postActionControls.style.display = 'none';
        dom.horizontalFriendsList.style.display = 'none'; // Ẩn thanh cuộn bạn bè
        
        dom.mainTopBar.style.display = 'flex';
        dom.bottomControls.style.display = 'flex';
        
        currentBlob = null; currentVideoBlob = null;
    };
    
    dom.btnCancelPost?.addEventListener('click', cancelSend);

    // [THÊM MỚI] - Xử lý cuộn ngang bằng con lăn chuột trên PC
    const horizontalList = document.getElementById('horizontalFriendsList');
    if (horizontalList) {
        horizontalList.addEventListener('wheel', (evt) => {
            if (evt.deltaY !== 0) {
                evt.preventDefault(); // Chặn cuộn dọc của trang
                horizontalList.scrollLeft += evt.deltaY; // Chuyển thành cuộn ngang
            }
        }, { passive: false });
    }
});