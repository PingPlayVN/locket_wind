// [js/caption.js] - ALGORITHM TÁCH BIỆT RÕ RÀNG EMOJI VÀ GIF

// 1. CẤU HÌNH DATA
export const CAPTION_THEMES = [
    // --- MỤC: LOCKET CHUẨN ---
    {
        category: 'Locket', id: 'standard', name: 'Mặc định',
        iconType: 'none', iconValue: '', emojiFallback: '',
        payload: { "background": { "material_blur": "ultra_thin", "colors": [] }, "text_color": "#FFFFFF", "type": "standard" }
    },
    
    // --- MỤC: 🎨 Decorative by WindHouse ---
    {
        category: '🎨 Decorative by WindHouse', id: 'locket_times', name: 'Locket Time!', // Đã bỏ emoji ở name
        iconType: 'emoji', iconValue: '📸', emojiFallback: '📸', // Khai báo dùng Icon thường
        payload: { "background": { "colors": ["#FFDEE9", "#B5FFFC"] }, "text_color": "#202020E6", "type": "standard" }
    },
    {
        category: '🎨 Decorative by WindHouse', id: 'snake_vibes', name: 'Snake Vibes', // Đã bỏ emoji ở name
        iconType: 'emoji', iconValue: '🐍', emojiFallback: '🐍', // Khai báo dùng Icon thường
        payload: { "background": { "colors": ["#A8E063", "#56AB2F"] }, "text_color": "#1F1F1FE6", "type": "standard" }
    },
    {
        category: '🎨 Decorative by WindHouse', id: 'coffee_time', name: 'Coffee Time!', // Đã bỏ emoji ở name
        iconType: 'emoji', iconValue: '☕', emojiFallback: '☕', // Khai báo dùng Icon thường
        payload: { "background": { "colors": ["#B48E72", "#4B2C20"] }, "text_color": "#FFFFFFE6", "type": "standard" }
    },
    {
        category: '🎨 Decorative by WindHouse', id: 'feeling_cute', name: 'Feeling Cute', // Đã bỏ emoji ở name
        iconType: 'emoji', iconValue: '🌷', emojiFallback: '🌷', // Khai báo dùng Icon thường
        payload: { "background": { "colors": ["#FFB199", "#FF6A88"] }, "text_color": "#FFFFFFE6", "type": "standard" }
    },
    {
        category: '🎨 Decorative by WindHouse', id: 'sunset_vibes', name: 'Sunset Vibes', // Đã bỏ emoji ở name
        iconType: 'emoji', iconValue: '🌇', emojiFallback: '🌇', // Khai báo dùng Icon thường
        payload: { "background": { "colors": ["#FF7EB3", "#FF758C"] }, "text_color": "#FFFFFFE6", "type": "standard" }
    },
    {
        category: '🎨 Decorative by WindHouse', id: 'flight_times', name: 'Flight Time!', // Đã bỏ emoji ở name
        iconType: 'emoji', iconValue: '🛫', emojiFallback: '🛫', // Khai báo dùng Icon thường
        payload: { "background": { "colors": ["#6dd5ed", "#2196f3"] }, "text_color": "#FFFFFFE6", "type": "standard" }
    },
    {
        category: '🎨 Decorative by WindHouse', id: 'photo_times', name: 'Photo Time!', // Đã bỏ emoji ở name
        iconType: 'emoji', iconValue: '📸', emojiFallback: '📸', // Khai báo dùng Icon thường
        payload: { "background": { "colors": ["#F7BB97", "#DD5E89"] }, "text_color": "#FFFFFFE6", "type": "standard" }
    },
    {
        category: '🎨 Decorative by WindHouse', id: 'day_dream', name: 'Daydream', // Đã bỏ emoji ở name
        iconType: 'emoji', iconValue: '🌤', emojiFallback: '🌤', // Khai báo dùng Icon thường
        payload: { "background": { "colors": ["#FFD1FF", "#FAD0C4"] }, "text_color": "#101010E6", "type": "standard" }
    },
    {
        category: '🎨 Decorative by WindHouse', id: 'dating_times', name: ' Dating Time!', // Đã bỏ emoji ở name
        iconType: 'emoji', iconValue: '💕', emojiFallback: '💕', // Khai báo dùng Icon thường
        payload: { "background": { "colors": ["#FF9A9E", "#F6416C"] }, "text_color": "#FFFFFFE6", "type": "standard" }
    },
    {
        category: '🎨 Decorative by WindHouse', id: 'mixue_times', name: 'Mixue Time!', // Đã bỏ emoji ở name
        iconType: 'emoji', iconValue: '🍦', emojiFallback: '🍦', // Khai báo dùng Icon thường
        payload: { "background": { "colors": ["#E0F7FA", "#FFCDD2"] }, "text_color": "#4E0000E6", "type": "standard" }
    },

    // --- MỤC: LOCKET GIF (GIF & HIỆU ỨNG) ---
    {
        category: 'Locket Gif', id: 'smile_cat_gif', name: 'Caption',
        iconType: 'gif', iconValue: 'https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExZ2hiZjVhOHN3NThlYXJubzUxOWc1bW5wOHE0cXF6aHN6aXVxdHEyMCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/0SVAVxeJsnJ1WRMIPX/giphy.gif', // Khai báo dùng GIF động
        payload: { "background": { "material_blur": "ultra_thin", "colors": [] }, "text_color": "#ffffff", "type": "standard" }
    },
    {
        category: 'Locket Gif', id: 'fox_dance_gif', name: 'Caption',
        iconType: 'gif', iconValue: 'https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExeHJmZG90aHZ5dHZqemR0NDB3Zm52dzllMDFndjJsdTF1ZGkycmxlYyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/xoZWpxtSLecftH30K1/giphy.gif', // Khai báo dùng GIF động
        payload: { "background": { "material_blur": "ultra_thin", "colors": [] }, "text_color": "#ffffff", "type": "standard" }
    },
];

let currentStyleId = 'standard';

function getCssFromPayload(bgPayload) {
    if (bgPayload.material_blur === "ultra_thin") return ''; // Giữ kính mờ mặc định
    if (!bgPayload.colors || bgPayload.colors.length === 0) return 'transparent'; // Trong suốt
    if (bgPayload.colors.length === 1) return bgPayload.colors[0]; // Màu đơn sắc
    
    // ĐÃ SỬA: Đổi từ góc chéo 135deg sang thẳng đứng từ trên xuống (to bottom) chuẩn Locket
    return `linear-gradient(to bottom, ${bgPayload.colors.join(', ')})`;
}

export function initCaptionEditor(dom) {
    dom.modalCaptionInput?.addEventListener('input', (e) => { if(dom.customCaptionInput) dom.customCaptionInput.value = e.target.value; });
    dom.customCaptionInput?.addEventListener('input', (e) => { if(dom.modalCaptionInput) dom.modalCaptionInput.value = e.target.value; });

    dom.btnMagic?.addEventListener('click', () => { dom.captionEditorSheet.style.display = 'flex'; dom.customCaptionInput.focus(); });
    dom.btnCloseCaptionEditor?.addEventListener('click', () => { dom.captionEditorSheet.style.display = 'none'; });

    // 2. VẼ UI: Nút bấm tự render Emoji text hoặc hình GIF 
    const container = document.getElementById('captionThemesContainer');
    if (container) {
        container.innerHTML = ''; 
        
        const groupedThemes = CAPTION_THEMES.reduce((acc, theme) => {
            if (!acc[theme.category]) acc[theme.category] = [];
            acc[theme.category].push(theme);
            return acc;
        }, {});

        for (const [category, themes] of Object.entries(groupedThemes)) {
            const title = document.createElement('div');
            title.style.cssText = "color: #aaa; font-size: 11px; font-weight: bold; margin: 15px 0 8px 0; text-transform: uppercase;";
            title.innerText = category;
            container.appendChild(title);

            const list = document.createElement('div');
            list.className = 'caption-style-list';
            // Bổ sung width: 100% và box-sizing để giới hạn độ rộng thanh cuộn ngang
            list.style.cssText = "display: flex; overflow-x: auto; gap: 10px; scrollbar-width: none; padding: 5px 0 15px 0; width: 100%; box-sizing: border-box; align-items: center;";
            
            // ==========================================
            // FIX CHO PC: BIẾN CON LĂN CHUỘT DỌC THÀNH CUỘN NGANG
            // ==========================================
            list.addEventListener('wheel', (e) => {
                // Chỉ ép cuộn ngang nếu hàng đó bị tràn (nhiều nút)
                if (list.scrollWidth > list.clientWidth) {
                    e.preventDefault(); // Chặn hành động cuộn trang dọc của trình duyệt
                    list.scrollLeft += e.deltaY; // Ép danh sách cuộn ngang bằng với tốc độ lăn chuột
                }
            }, { passive: false }); // Bắt buộc thêm passive: false để e.preventDefault() hoạt động mượt
            
            themes.forEach(theme => {
                const btn = document.createElement('button');
                btn.className = `caption-style-btn ${theme.id === currentStyleId ? 'active' : ''}`;
                btn.dataset.id = theme.id;
                
                // CHỐNG TRÀN PC: Ép các nút không được phép co rút (shrink) và không tự xuống dòng
                btn.style.flexShrink = "0";
                btn.style.whiteSpace = "nowrap";
                
                // XỬ LÝ RUỘT CỦA NÚT (Sửa ảnh GIF thành hình vuông)
                let iconHtml = '';
                if (theme.iconType === 'emoji') {
                    iconHtml = `<span style="font-size: 13px; margin-right: 4px;">${theme.iconValue}</span>`;
                } else if (theme.iconType === 'gif') {
                    // Đổi border-radius từ 50% thành 4px (vuông bo góc nhẹ) hoặc 0px (vuông vức)
                    iconHtml = `<img src="${theme.iconValue}" style="width: 16px; height: 16px; object-fit: cover; border-radius: 4px; margin-right: 4px; display: inline-block; vertical-align: text-bottom;">`;
                }
                btn.innerHTML = `${iconHtml}${theme.name}`;
                
                const cssBg = getCssFromPayload(theme.payload.background);
                if(cssBg && cssBg !== 'transparent') {
                    btn.style.background = cssBg; btn.style.color = theme.payload.text_color; btn.style.border = 'none';
                } else if (cssBg === 'transparent') {
                    btn.style.background = '#2c2c2e'; btn.style.color = theme.payload.text_color; btn.style.border = '1px solid #666';
                }
                list.appendChild(btn);
            });
            container.appendChild(list);
        }
    }

    // 3. LOGIC CLICK (Hiển thị đúng Emoji hoặc GIF trên ảnh)
    container?.addEventListener('click', (e) => {
        const btn = e.target.closest('.caption-style-btn');
        if (!btn) return;

        container.querySelectorAll('.caption-style-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        currentStyleId = btn.dataset.id;
        const themeData = CAPTION_THEMES.find(t => t.id === currentStyleId);
        
        // ==========================================
        // AUTO-FILL: LẤY LUÔN TÊN NÚT BẤM LÀM CHỮ (Nếu không phải là Caption/Mặc định)
        // ==========================================
        const ignoreNames = ['Mặc định', 'Trong suốt', 'Gold VIP', 'Caption']; 
        if (!ignoreNames.includes(themeData.name)) {
            if (dom.customCaptionInput) dom.customCaptionInput.value = themeData.name;
            if (dom.modalCaptionInput) dom.modalCaptionInput.value = themeData.name;
        }

        // Cập nhật Nền chữ
        const cssBg = getCssFromPayload(themeData.payload.background);
        if (themeData.id === 'standard') {
            dom.captionOverlay.style.background = ''; dom.captionOverlay.style.backdropFilter = ''; dom.captionOverlay.style.border = ''; dom.modalCaptionInput.style.color = ''; dom.modalCaptionInput.style.textShadow = '';
        } else {
            dom.captionOverlay.style.background = cssBg; dom.captionOverlay.style.backdropFilter = 'none';
            dom.captionOverlay.style.border = cssBg === 'transparent' ? 'none' : '1px solid rgba(255,255,255,0.4)';
            dom.modalCaptionInput.style.color = themeData.payload.text_color;
            dom.modalCaptionInput.style.textShadow = cssBg === 'transparent' ? '1px 1px 4px #000' : 'none';
        }

        // CẬP NHẬT ICON HOẶC GIF TRÊN ẢNH
        const emojiDisplay = document.getElementById('captionEmojiDisplay');
        const gifDisplay = document.getElementById('captionGifDisplay');

        if (!themeData.iconType || themeData.iconType === 'none') {
            if(emojiDisplay) emojiDisplay.style.display = 'none';
            if(gifDisplay) gifDisplay.style.display = 'none';
        } else if (themeData.iconType === 'emoji') {
            if(gifDisplay) gifDisplay.style.display = 'none';
            if(emojiDisplay) { emojiDisplay.style.display = 'inline-block'; emojiDisplay.innerText = themeData.iconValue; }
        } else if (themeData.iconType === 'gif') {
            if(emojiDisplay) emojiDisplay.style.display = 'none';
            if(gifDisplay) { gifDisplay.style.display = 'inline-block'; gifDisplay.src = themeData.iconValue; }
        }
    });
}

// Reset khi đóng hoặc gửi xong
export function resetCaptionStyle(dom) {
    if(dom.captionEditorSheet) dom.captionEditorSheet.style.display = 'none';
    if(dom.customCaptionInput) dom.customCaptionInput.value = "";
    if(dom.captionOverlay) { dom.captionOverlay.style = ""; dom.captionOverlay.style.display = 'none'; }
    if(dom.modalCaptionInput) { dom.modalCaptionInput.style = ""; }
    
    const emojiDisplay = document.getElementById('captionEmojiDisplay');
    if (emojiDisplay) { emojiDisplay.style.display = 'none'; emojiDisplay.innerText = ''; }
    const gifDisplay = document.getElementById('captionGifDisplay');
    if (gifDisplay) { gifDisplay.style.display = 'none'; gifDisplay.src = ''; }
    
    document.querySelectorAll('.caption-style-btn').forEach(b => b.classList.remove('active'));
    document.querySelector('.caption-style-btn[data-id="standard"]')?.classList.add('active');
    
    currentStyleId = 'standard';
}

// ĐÓNG GÓI PAYLOAD GỬI LÊN SERVER (Đã bỏ Emoji Fallback ở Text)
export function getCaptionPayload(textString) {
    if (!textString || textString.trim() === "") return null;
    
    const themeData = CAPTION_THEMES.find(t => t.id === currentStyleId) || CAPTION_THEMES[0];
    const template = themeData.payload;
    
    // 1. Chỉ lấy đúng chữ người dùng gõ (Hoặc chữ auto-fill), KHÔNG cấy thêm Emoji nữa!
    let finalText = textString.trim();

    // 2. Cấu trúc Payload cốt lõi
    let overlayData = {
        "background": template.background,
        "text_color": template.text_color,
        "type": template.type, // Mặc định là "standard"
        "max_lines": { "@type": "type.googleapis.com/google.protobuf.Int64Value", "value": "4" },
        "text": finalText
    };

    let finalOverlayId = "caption:standard";

    // 3. Đội lốt "star_sign" (Cung Hoàng Đạo) cho ảnh GIF
    if (themeData.iconType === 'gif' && themeData.iconValue) {
        overlayData["icon"] = {
            "type": "image",
            "data": themeData.iconValue,
            "source": "url"
        };
        // Giả vờ đây là tính năng Cung hoàng đạo của Locket
        overlayData["type"] = "star_sign"; 
        finalOverlayId = "caption:star_sign"; 
    }

    let payload = [{
        "overlay_id": finalOverlayId,
        "alt_text": finalText,
        "overlay_type": "caption",
        "data": overlayData
    }];

    return payload;
}