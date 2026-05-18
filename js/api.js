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

export async function fetchUserProfile() {
    const res = await fetch(`${BASE_URL}/profile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ localId: session.localId, idToken: session.idToken })
    });
    const result = await res.json();
    handleError(result, "Lỗi lấy profile");
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
