// [js/api.js]

const BASE_URL = "https://locket-api.trinhgiaphong2k9.workers.dev"; // Nhớ giữ nguyên link Cloudflare của bạn

export let session = {
    localId: "",
    idToken: ""
};

// Hàm xẻ thịt lỗi của Locket để in ra chữ dễ đọc
function handleError(result, defaultMsg) {
    if (!result.success) {
        let exactError = result.rawError || result.error || defaultMsg;
        // Ép kiểu thành dạng chữ để hiển thị lên Alert
        const errorString = typeof exactError === 'object' ? JSON.stringify(exactError, null, 2) : exactError;
        
        console.error("🔴 Chi tiết lỗi từ Locket:", exactError);
        throw new Error(errorString);
    }
}

export async function login(email, password) {
    const res = await fetch(`${BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });
    const result = await res.json();
    handleError(result, "Đăng nhập thất bại");

    session.localId = result.data.localId;
    session.idToken = result.data.idToken;
    return session.localId;
}

export async function fetchUserProfile(targetUid = null) {
    const res = await fetch(`${BASE_URL}/profile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Nếu có targetUid thì lấy profile của bạn bè, không thì lấy của chính mình (session.localId)
        body: JSON.stringify({ localId: targetUid || session.localId, idToken: session.idToken })
    });
    const result = await res.json();
    if (!result.success) throw new Error(result.error || "Lỗi lấy profile");
    return result.data;
}

export async function searchUserByUsername(username) {
    const res = await fetch(`${BASE_URL}/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, idToken: session.idToken })
    });
    const result = await res.json();
    handleError(result, "Lỗi tìm kiếm");
    return result.data;
}

export async function addFriend(targetUid, isCelebrity = false) {
    const res = await fetch(`${BASE_URL}/add-friend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetUid, isCelebrity, idToken: session.idToken })
    });
    const result = await res.json();
    handleError(result, "Lỗi kết bạn");
    return result.data;
}

// HÀM MỚI: Lấy danh sách bạn bè
export async function getFriendsList() {
    const res = await fetch(`${BASE_URL}/friends`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ localId: session.localId, idToken: session.idToken })
    });
    const result = await res.json();
    if (!result.success) throw new Error("Lỗi lấy danh sách bạn bè");
    return result.data;
}

// HÀM CẬP NHẬT: Upload ảnh CÓ BÁO CÁO TIẾN TRÌNH (%)
export function uploadPhotoToFirebaseWithProgress(blob, onProgress) {
    return new Promise((resolve, reject) => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let photoId = '';
        for (let i = 0; i < 20; i++) photoId += chars.charAt(Math.floor(Math.random() * chars.length));
        
        const path = `users/${session.localId}/moments/thumbnails/${photoId}.webp`;
        const encodedPath = encodeURIComponent(path);
        const url = `https://firebasestorage.googleapis.com/v0/b/locket-img/o?uploadType=media&name=${encodedPath}`;

        const xhr = new XMLHttpRequest();
        xhr.open('POST', url, true);
        xhr.setRequestHeader('Authorization', `Firebase ${session.idToken}`);
        xhr.setRequestHeader('Content-Type', 'image/webp');

        // Bắt sự kiện tải lên để báo % tiến trình
        xhr.upload.onprogress = (e) => {
            if (e.lengthComputable) {
                const percent = Math.round((e.loaded / e.total) * 100);
                if (onProgress) onProgress(percent);
            }
        };

        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                const data = JSON.parse(xhr.responseText);
                const thumbnailUrl = `https://firebasestorage.googleapis.com:443/v0/b/locket-img/o/${encodedPath}?alt=media&token=${data.downloadTokens}`;
                resolve(thumbnailUrl);
            } else {
                reject(new Error("Lỗi upload ảnh"));
            }
        };
        xhr.onerror = () => reject(new Error("Lỗi kết nối mạng"));
        xhr.send(blob);
    });
}

// 2. Hàm Yêu cầu Locket đăng bài
export async function postMoment(thumbnailUrl, md5, caption, recipients = []) {
    const res = await fetch(`${BASE_URL}/post-moment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            localId: session.localId, 
            idToken: session.idToken,
            thumbnail_url: thumbnailUrl,
            md5: md5,
            caption: caption,
            recipients: recipients // Gửi danh sách UID lên Cloudflare
        })
    });
    const result = await res.json();
    handleError(result, "Lỗi khi đăng ảnh lên Locket");
    return result.data;
}