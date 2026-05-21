// [js/api.js]
const BASE_URL = "https://locket-api.trinhgiaphong2k9.workers.dev";

export let session = {
    localId: "", idToken: "", activeKey: "", appCheckToken: ""
};

function handleError(result, defaultMsg) {
    if (!result.success) throw new Error(result.rawError || result.error || defaultMsg);
}

export async function login(email, password, activeKey) {
    // 1. Lấy Token Google
    const res = await fetch(`${BASE_URL}/login`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });
    const result = await res.json();
    handleError(result, "Sai Email hoặc Mật khẩu");

    session.localId = result.data.localId;
    session.idToken = result.data.idToken;
    session.activeKey = activeKey.trim();

    // 2. Ném Active Key lên Worker để check xem có bị Hết hạn / Khóa không
    const checkRes = await fetch(`${BASE_URL}/app-check`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken: session.idToken, activeKey: session.activeKey })
    });
    const checkData = await checkRes.json();
    
    // NẾU LỖI -> Quăng lỗi ra để app.js xóa LocalStorage
    if (!checkRes.ok || !checkData.appCheckToken) {
        throw new Error(checkData.message || checkData.error?.message || "Mã Active Key bị sai hoặc đã hết hạn!");
    }
    
    // NẾU ĐÚNG -> Lưu Token siêu cấp lại xài dần
    session.appCheckToken = checkData.appCheckToken;
    return session.localId;
}

export async function fetchUserProfile(targetUid = null) {
    const res = await fetch(`${BASE_URL}/profile`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ localId: targetUid || session.localId, idToken: session.idToken, appCheckToken: session.appCheckToken })
    });
    const result = await res.json();
    if (!result.success) throw new Error(result.error || "Lỗi lấy profile");
    return result.data;
}

export async function searchUserByUsername(username) {
    const res = await fetch(`${BASE_URL}/search`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, idToken: session.idToken, appCheckToken: session.appCheckToken })
    });
    const result = await res.json();
    handleError(result, "Lỗi tìm kiếm");
    return result.data;
}

export async function addFriend(targetUid, isCelebrity = false) {
    const res = await fetch(`${BASE_URL}/add-friend`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetUid, isCelebrity, idToken: session.idToken, appCheckToken: session.appCheckToken })
    });
    const result = await res.json();
    handleError(result, "Lỗi kết bạn");
    return result.data;
}

export async function getFriendsList() {
    const res = await fetch(`${BASE_URL}/friends`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ localId: session.localId, idToken: session.idToken, appCheckToken: session.appCheckToken })
    });
    const result = await res.json();
    if (!result.success) throw new Error("Lỗi lấy danh sách bạn bè");
    return result.data;
}

export async function requestActiveKey(email) {
    const res = await fetch(`${BASE_URL}/request-active-key`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
    });
    if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || errData.error || "Không thể yêu cầu mã!");
    }
    return await res.json().catch(() => ({}));
}

export async function postMoment(thumbnailUrl, md5, caption, recipients = [], overlays = null) {
    const res = await fetch(`${BASE_URL}/post-moment`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            localId: session.localId, idToken: session.idToken, appCheckToken: session.appCheckToken,
            thumbnail_url: thumbnailUrl, md5: md5, caption: caption, recipients: recipients, overlays: overlays 
        })
    });
    const result = await res.json();
    handleError(result, "Lỗi đăng ảnh");
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