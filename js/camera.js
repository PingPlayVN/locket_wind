// [js/camera.js] - CHUẨN LOCKET: 1:1 VUÔNG, KHÔNG TIẾNG, CAPTION MẶC ĐỊNH
import * as api from './api.js';

let currentStream = null;
let currentBlob = null; 
let currentVideoBlob = null; 
let currentFacingMode = 'user'; 

let mediaRecorder = null;
let recordedChunks = [];
let pressTimer = null;
let isLongPress = false;
let isRecordingCanvas = false;

const getDom = () => ({
    video: document.getElementById('cameraVideo'),
    captureBtn: document.getElementById('btnCapture'),
    btnFlipCamera: document.getElementById('btnFlipCamera'),
    canvas: document.createElement('canvas'),
    bottomControls: document.getElementById('bottomControls'),
    previewImage: document.getElementById('previewImage'),
    previewVideo: document.getElementById('previewVideo'), 
    captionOverlay: document.getElementById('captionOverlay'),
    modalCaptionInput: document.getElementById('modalCaptionInput'),
    sendSheet: document.getElementById('sendSheet'),
    checkAllFriends: document.getElementById('checkAllFriends'),
    dynamicFriendsList: document.getElementById('dynamicFriendsList'),
    btnConfirmSend: document.getElementById('btnConfirmSend')
});

export async function startCamera() {
    try {
        const dom = getDom();
        // KHÔNG XIN QUYỀN MIC (audio: false) ĐỂ TẮT TIẾNG TRIỆT ĐỂ
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

function transitionToPreview(dom) {
    dom.bottomControls.style.display = 'none'; 
    dom.captionOverlay.style.display = 'flex'; 
    dom.sendSheet.style.display = 'flex'; 
    dom.modalCaptionInput.value = "";
    dom.modalCaptionInput.focus();
    loadFriendsList(dom);
}

// 1. CHỤP ẢNH (CROP CHUẨN 1:1 TỪ GIỮA MÀN HÌNH)
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
    // Cắt phần hình vuông ở giữa video
    dom.canvas.getContext('2d').drawImage(dom.video, startX, startY, size, size, 0, 0, finalSize, finalSize);
    dom.canvas.toBlob((blob) => { currentBlob = blob; }, 'image/jpeg', 0.85);

    dom.previewImage.src = dom.canvas.toDataURL('image/jpeg');
    dom.previewImage.style.display = 'block';
    dom.previewVideo.style.display = 'none';
    currentVideoBlob = null; 

    transitionToPreview(dom);
}

// 2. QUAY VIDEO (RECORD CANVAS 1:1 - KHÔNG TIẾNG)
function startRecordingVideo() {
    if (!currentStream) return;
    const dom = getDom();
    recordedChunks = [];
    isRecordingCanvas = true;

    // TẠO CANVAS 1:1 ĐỂ GHI HÌNH
    const recordCanvas = document.createElement('canvas');
    const size = Math.min(dom.video.videoWidth, dom.video.videoHeight);
    recordCanvas.width = size; recordCanvas.height = size;
    const ctx = recordCanvas.getContext('2d');
    const startX = (dom.video.videoWidth - size) / 2;
    const startY = (dom.video.videoHeight - size) / 2;

    // Vòng lặp liên tục vẽ video lên canvas 1:1
    function drawFrame() {
        if (!isRecordingCanvas) return;
        ctx.drawImage(dom.video, startX, startY, size, size, 0, 0, size, size);
        requestAnimationFrame(drawFrame);
    }
    drawFrame();

    // Thu lại luồng hình ảnh từ Canvas (30 FPS) -> Tự động vô hiệu hóa âm thanh
    const canvasStream = recordCanvas.captureStream(30);

    mediaRecorder = new MediaRecorder(canvasStream, { mimeType: 'video/webm' });
    mediaRecorder.ondataavailable = e => { if (e.data.size > 0) recordedChunks.push(e.data); };
    mediaRecorder.onstop = () => {
        isRecordingCanvas = false; // Dừng vòng lặp vẽ
        // Chuyển blob thành mp4 để Firebase nhận diện
        currentVideoBlob = new Blob(recordedChunks, { type: 'video/mp4' });

        // Lấy Thumbnail 1:1 từ chính canvas vừa record
        dom.canvas.width = size; dom.canvas.height = size;
        dom.canvas.getContext('2d').drawImage(recordCanvas, 0, 0, size, size);
        dom.canvas.toBlob((blob) => { currentBlob = blob; }, 'image/jpeg', 0.85);

        dom.previewVideo.src = URL.createObjectURL(currentVideoBlob);
        dom.previewVideo.style.display = 'block';
        dom.previewImage.style.display = 'none';
        
        transitionToPreview(dom);
    };
    
    mediaRecorder.start();
    
    dom.captureBtn.style.transform = 'scale(1.3)';
    dom.captureBtn.style.backgroundColor = 'rgba(255, 68, 68, 0.5)';
    dom.captureBtn.style.border = '4px solid #ff4444';
}

function stopRecordingVideo() {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') mediaRecorder.stop();
    const dom = getDom();
    dom.captureBtn.style.transform = '';
    dom.captureBtn.style.backgroundColor = '';
    dom.captureBtn.style.border = '';
}

// 3. XÁC NHẬN GỬI 
async function confirmSendMoment() {
    const dom = getDom();
    if (!currentBlob && !currentVideoBlob) return;

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
        if(progressOverlay) progressOverlay.style.display = 'flex';
        if(progressBar) progressBar.style.width = `${percent}%`;
        if(progressText) progressText.innerText = text;
    };

    dom.btnConfirmSend.disabled = true;

    try {
        let thumbnailUrl = "";
        let videoUrl = null;

        if (currentVideoBlob) {
            updateProgress(10, "☁️ Đang tải ảnh thu nhỏ...");
            thumbnailUrl = await api.uploadPhotoToFirebaseWithProgress(currentBlob, null);
            
            updateProgress(20, "☁️ Đang tải video (1:1, Không tiếng)...");
            videoUrl = await api.uploadVideoToFirebaseWithProgress(currentVideoBlob, (pct) => {
                updateProgress(20 + Math.floor(pct * 0.6), `☁️ Đang tải Video... ${pct}%`);
            });
        } else {
            updateProgress(0, "☁️ Đang tải ảnh lên Firebase...");
            thumbnailUrl = await api.uploadPhotoToFirebaseWithProgress(currentBlob, (pct) => {
                updateProgress(Math.floor(pct * 0.8), `☁️ Đang tải ảnh... ${pct}%`);
            });
        }
        
        updateProgress(85, "🔄 Đang đồng bộ...");
        const randomMd5 = [...Array(32)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
        
        updateProgress(90, "🚀 Đang gửi bài đăng lên Locket...");
        
        // TRỞ VỀ NGUYÊN THỦY: Không dùng overlays (truyền null), chỉ truyền caption text thuần.
        // Locket sẽ tự động chuyển đổi và hiển thị đúng trên mọi máy.
        await api.postMoment(thumbnailUrl, randomMd5, caption, recipients, null, videoUrl);

        updateProgress(100, "✅ Đã gửi thành công!");
        
        setTimeout(() => {
            if(progressOverlay) progressOverlay.style.display = 'none';
            dom.previewImage.style.display = 'none';
            dom.previewVideo.style.display = 'none';
            dom.previewVideo.src = "";
            dom.captionOverlay.style.display = 'none';
            dom.sendSheet.style.display = 'none';
            dom.bottomControls.style.display = 'flex';
            dom.btnConfirmSend.disabled = false;
            
            currentBlob = null;
            currentVideoBlob = null;
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
    
    const handlePointerDown = (e) => {
        if(e.cancelable) e.preventDefault();
        isLongPress = false;
        pressTimer = setTimeout(() => {
            isLongPress = true;
            startRecordingVideo();
        }, 300);
    };

    const handlePointerUp = (e) => {
        if(e.cancelable) e.preventDefault();
        clearTimeout(pressTimer);
        if (isLongPress) {
            stopRecordingVideo(); 
        } else {
            capturePhoto(); 
        }
    };

    dom.captureBtn?.addEventListener('pointerdown', handlePointerDown);
    dom.captureBtn?.addEventListener('pointerup', handlePointerUp);
    dom.captureBtn?.addEventListener('pointerleave', handlePointerUp);

    dom.btnConfirmSend?.addEventListener('click', confirmSendMoment);
    dom.btnFlipCamera?.addEventListener('click', flipCamera);

    dom.checkAllFriends?.addEventListener('change', () => { document.querySelectorAll('.target-friend').forEach(cb => cb.checked = false); });
    dom.dynamicFriendsList?.addEventListener('change', (e) => { if(e.target.classList.contains('target-friend') && e.target.checked) dom.checkAllFriends.checked = false; });

    const cancelSend = () => {
        dom.previewImage.style.display = 'none';
        dom.previewVideo.style.display = 'none';
        dom.previewVideo.src = "";
        dom.captionOverlay.style.display = 'none';
        dom.sendSheet.style.display = 'none';
        dom.bottomControls.style.display = 'flex';
        currentBlob = null;
        currentVideoBlob = null;
    };
    
    dom.previewImage?.addEventListener('click', cancelSend);
    dom.previewVideo?.addEventListener('click', cancelSend);
});