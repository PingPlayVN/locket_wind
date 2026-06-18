// [js/api.js]
const BASE_URL = "https://locket-api.trinhgiaphong2k9.workers.dev"; // Thay thế bằng domain Cloudflare của bạn

export let session = {
    localId: "", 
    idToken: ""
};

function handleError(result, defaultMsg) {
    if (!result.success) throw new Error(result.rawError || result.error || defaultMsg);
}

export async function login(email, password) {
    const res = await fetch(`${BASE_URL}/login`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });
    const result = await res.json();
    handleError(result, "Sai Email hoặc mật khẩu");
    
    session.localId = result.data.localId;
    session.idToken = result.data.idToken;
    return session.localId;
}

export async function fetchUserProfile(targetUid = null) {
    const res = await fetch(`${BASE_URL}/profile`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ localId: targetUid || session.localId, idToken: session.idToken })
    });
    const result = await res.json();
    if (!result.success) throw new Error(result.error || "Lỗi lấy profile");
    return result.data;
}

export async function searchUserByUsername(username) {
    const res = await fetch(`${BASE_URL}/search`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, idToken: session.idToken })
    });
    const result = await res.json();
    handleError(result, "Lỗi tìm kiếm");
    return result.data;
}

// Hàm kết bạn (vẫn giữ cấu trúc nhưng Server và Giao diện sẽ khóa)
export async function addFriend(targetUid, isCelebrity = false) {
    const res = await fetch(`${BASE_URL}/add-friend`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetUid, isCelebrity, idToken: session.idToken })
    });
    const result = await res.json();
    handleError(result, "Lỗi kết bạn");
    return result.data;
}

export async function getFriendsList() {
    const res = await fetch(`${BASE_URL}/friends`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ localId: session.localId, idToken: session.idToken })
    });
    const result = await res.json();
    if (!result.success) throw new Error("Lỗi lấy danh sách bạn bè");
    return result.data;
}

export async function postMoment(thumbnailUrl, md5, caption, recipients = [], overlays = null, videoUrl = null) {
    let payload = { 
        localId: session.localId, idToken: session.idToken,
        thumbnail_url: thumbnailUrl, md5: md5, caption: caption, recipients: recipients, overlays: overlays 
    };
    if (videoUrl) payload.video_url = videoUrl;

    const res = await fetch(`${BASE_URL}/post-moment`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
    const result = await res.json();
    handleError(result, "Lỗi đăng ảnh/video");
    return result.data;
}

export function uploadPhotoToFirebaseWithProgress(blob, onProgress) {
    return new Promise((resolve, reject) => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let photoId = '';
        for (let i = 0; i < 20; i++) photoId += chars.charAt(Math.floor(Math.random() * chars.length));
        
        const encodedPath = encodeURIComponent(`users/${session.localId}/moments/thumbnails/${photoId}.jpeg`);
        const url = `https://firebasestorage.googleapis.com/v0/b/locket-img/o?uploadType=media&name=${encodedPath}`;

        const xhr = new XMLHttpRequest();
        xhr.open('POST', url, true);
        xhr.setRequestHeader('Authorization', `Firebase ${session.idToken}`);
        xhr.setRequestHeader('Content-Type', 'image/jpeg');

        xhr.upload.onprogress = (e) => {
            if (e.lengthComputable) {
                const percent = Math.round((e.loaded / e.total) * 100);
                if (onProgress) onProgress(percent);
            }
        };

        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                const data = JSON.parse(xhr.responseText);
                resolve(`https://firebasestorage.googleapis.com:443/v0/b/locket-img/o/${encodedPath}?alt=media&token=${data.downloadTokens}`);
            } else { reject(new Error("Lỗi upload ảnh")); }
        };
        xhr.onerror = () => reject(new Error("Lỗi kết nối mạng"));
        xhr.send(blob);
    });
}

export function uploadVideoToFirebaseWithProgress(blob, onProgress) {
    return new Promise((resolve, reject) => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let videoId = '';
        for (let i = 0; i < 20; i++) videoId += chars.charAt(Math.floor(Math.random() * chars.length));

        // Ép cứng vỏ bọc và Content-Type thành MP4
        const contentType = 'video/mp4'; 
        const extension = 'mp4'; 
        
        const encodedPath = encodeURIComponent(`users/${session.localId}/moments/videos/${videoId}.${extension}`);
        
        // ĐIỂM CHÍ MẠNG: Thay locket-img thành locket-video
        const url = `https://firebasestorage.googleapis.com/v0/b/locket-video/o?uploadType=media&name=${encodedPath}`;

        const xhr = new XMLHttpRequest();
        xhr.open('POST', url, true);
        xhr.setRequestHeader('Authorization', `Firebase ${session.idToken}`);
        xhr.setRequestHeader('Content-Type', contentType);

        xhr.upload.onprogress = (e) => {
            if (e.lengthComputable) {
                const percent = Math.round((e.loaded / e.total) * 100);
                if (onProgress) onProgress(percent);
            }
        };

        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                const data = JSON.parse(xhr.responseText);
                // ĐIỂM CHÍ MẠNG 2: Link trả về cũng phải là locket-video
                resolve(`https://firebasestorage.googleapis.com:443/v0/b/locket-video/o/${encodedPath}?alt=media&token=${data.downloadTokens}`);
            } else {
                reject(new Error("Lỗi upload video"));
            }
        };
        xhr.onerror = () => reject(new Error("Lỗi kết nối mạng"));
        xhr.send(blob);
    });
}