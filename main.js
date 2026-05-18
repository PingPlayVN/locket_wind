// [VIBECODE-PROJECT-NOTE]: MODULE MAIN PROCESS - File cấu hình Electron, cửa sổ và cầu nối IPC gọi mạng.
const { app, BrowserWindow, ipcMain } = require('electron');

// --- CẤU HÌNH VƯỢT BẢO MẬT ---
app.commandLine.appendSwitch('ignore-certificate-errors'); 
app.commandLine.appendSwitch('disable-renderer-backgrounding'); // Chống ngủ đông khi thu nhỏ
app.disableHardwareAcceleration();

function createWindow() {
    const win = new BrowserWindow({
        width: 500,
        height: 750,
        title: "Locket Celeb Manager",
        autoHideMenuBar: true,
        webPreferences: {
            nodeIntegration: true, 
            contextIsolation: false, 
            webSecurity: false, 
            backgroundThrottling: false 
        }
    });

    win.loadFile('index.html');
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

// --- XỬ LÝ YÊU CẦU API VÀ IN LOG RA CMD ---
ipcMain.handle('call-api', async (event, { url, method, token, body, headers }) => {
    try {
        // 1. In log lúc bắt đầu gửi Request
        console.log(`\n=========================================`);
        console.log(`🚀 [API REQUEST] ${method || 'GET'} ${url}`);

        const fetchHeaders = { ...headers };
        if (token) fetchHeaders['Authorization'] = `Bearer ${token}`;

        const options = {
            method: method || 'GET',
            headers: fetchHeaders
        };

        if (body && method !== 'GET') {
            options.body = JSON.stringify(body);
            // Bỏ comment dòng dưới nếu bạn muốn xem cả data gửi đi
            // console.log(`📦 [PAYLOAD]:`, options.body); 
        }

        // Thực hiện gọi API
        const response = await fetch(url, options);
        
        // Lấy raw text để in ra CMD tránh bị sập do lỗi parse JSON
        const rawText = await response.text();
        let data = {};
        try {
            data = rawText ? JSON.parse(rawText) : {};
        } catch (e) {
            data = { raw: rawText };
        }

        // 2. In log phản hồi (Màu sắc trong CMD)
        if (response.ok) {
            console.log(`✅ [API SUCCESS] Status: ${response.status}`);
        } else {
            console.error(`❌ [API ERROR] Status: ${response.status}`);
            console.error(`🔻 [LỜI NHẮN TỪ SERVER LOCKET]:`);
            console.error(data); // In chi tiết lỗi Server trả về
        }
        console.log(`=========================================\n`);

        return {
            ok: response.ok,
            status: response.status,
            data: data
        };
    } catch (error) {
        console.error(`💥 [FATAL CRASH] Lỗi hệ thống:`, error.message);
        return { ok: false, error: error.message };
    }
});