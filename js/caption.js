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
let currentCustomCaption = null;
let savedCustomCaptions = [];
let savedCustomListElement = null;

const CUSTOM_CAPTIONS_STORAGE_KEY = 'locket_custom_captions';

function getCssFromPayload(bgPayload) {
    if (bgPayload.material_blur === "ultra_thin") return ''; // Giữ kính mờ mặc định
    if (!bgPayload.colors || bgPayload.colors.length === 0) return 'transparent'; // Trong suốt
    if (bgPayload.colors.length === 1) return bgPayload.colors[0]; // Màu đơn sắc
    
    // ĐÃ SỬA: Đổi từ góc chéo 135deg sang thẳng đứng từ trên xuống (to bottom) chuẩn Locket
    return `linear-gradient(to bottom, ${bgPayload.colors.join(', ')})`;
}

function getCssFromColors(colors) {
    if (!colors || colors.length === 0) return 'transparent';
    if (colors.length === 1) return colors[0];
    return `linear-gradient(to bottom, ${colors.join(', ')})`;
}

function loadSavedCustomCaptions() {
    try {
        const raw = localStorage.getItem(CUSTOM_CAPTIONS_STORAGE_KEY);
        const parsed = raw ? JSON.parse(raw) : [];
        return Array.isArray(parsed) ? parsed.map(normalizeCustomCaption) : [];
    } catch (error) {
        console.warn("Không thể đọc custom captions", error);
        return [];
    }
}

function saveCustomCaptions() {
    try {
        localStorage.setItem(CUSTOM_CAPTIONS_STORAGE_KEY, JSON.stringify(savedCustomCaptions));
    } catch (error) {
        console.warn("Không thể lưu custom captions", error);
    }
}

function normalizeCustomCaption(customData) {
    return {
        id: customData.id || `custom_${Date.now()}_${Math.random().toString(16).slice(2)}`,
        gifUrl: customData.gifUrl || '',
        text: customData.text || 'Caption',
        textColor: customData.textColor || '#ffffff',
        bgColors: Array.isArray(customData.bgColors) && customData.bgColors.length ? customData.bgColors : ['#00000080']
    };
}

function createCustomCaptionButton(dom, customData) {
    const wrapper = document.createElement('div');
    wrapper.className = 'custom-caption-chip-wrap';

    const btn = document.createElement('button');
    btn.className = `caption-style-btn custom-caption-chip ${currentCustomCaption?.id === customData.id ? 'active' : ''}`;
    btn.type = 'button';
    btn.style.background = getCssFromColors(customData.bgColors);
    btn.style.color = customData.textColor;
    btn.style.border = 'none';
    btn.style.flexShrink = '0';
    btn.style.whiteSpace = 'nowrap';

    if (customData.gifUrl) {
        const icon = document.createElement('img');
        icon.src = customData.gifUrl;
        icon.style.cssText = 'width: 16px; height: 16px; object-fit: cover; border-radius: 4px; margin-right: 4px; display: inline-block; vertical-align: text-bottom; flex-shrink: 0;';
        btn.appendChild(icon);
    }
    btn.appendChild(document.createTextNode(customData.text));

    btn.addEventListener('click', (event) => {
        event.stopPropagation();
        applyCustomCaption(dom, customData);
        btn.classList.add('active');
    });

    const btnDelete = document.createElement('button');
    btnDelete.className = 'custom-caption-delete';
    btnDelete.type = 'button';
    btnDelete.innerText = '×';
    btnDelete.addEventListener('click', (event) => {
        event.stopPropagation();
        savedCustomCaptions = savedCustomCaptions.filter(item => item.id !== customData.id);
        saveCustomCaptions();
        if (currentCustomCaption?.id === customData.id) {
            currentStyleId = 'standard';
            currentCustomCaption = null;
            document.querySelector('.caption-style-btn[data-id="standard"]')?.click();
        }
        renderSavedCustomCaptions(dom);
    });

    wrapper.appendChild(btn);
    wrapper.appendChild(btnDelete);
    return wrapper;
}

function renderSavedCustomCaptions(dom) {
    if (!savedCustomListElement) return;
    savedCustomListElement.querySelectorAll('.custom-caption-chip-wrap').forEach(el => el.remove());
    savedCustomCaptions.forEach(customData => {
        savedCustomListElement.appendChild(createCustomCaptionButton(dom, customData));
    });
}

function applyCustomCaption(dom, customData) {
    currentStyleId = 'custom';
    currentCustomCaption = customData;

    const customText = customData.text || '';
    if (dom.customCaptionInput) dom.customCaptionInput.value = customText;
    if (dom.modalCaptionInput) {
        dom.modalCaptionInput.value = customText;
        dom.modalCaptionInput.style.color = customData.textColor || '#ffffff';
        dom.modalCaptionInput.style.textShadow = '1px 1px 4px #000';
    }

    if (dom.captionOverlay) {
        dom.captionOverlay.style.background = getCssFromColors(customData.bgColors);
        dom.captionOverlay.style.backdropFilter = 'none';
        dom.captionOverlay.style.border = '1px solid rgba(255,255,255,0.4)';
    }

    const emojiDisplay = document.getElementById('captionEmojiDisplay');
    const gifDisplay = document.getElementById('captionGifDisplay');
    if (emojiDisplay) emojiDisplay.style.display = 'none';
    if (gifDisplay) {
        gifDisplay.style.display = customData.gifUrl ? 'inline-block' : 'none';
        gifDisplay.src = customData.gifUrl || '';
    }

    document.querySelectorAll('.caption-style-btn').forEach(b => b.classList.remove('active'));
}

export function initCaptionEditor(dom) {
    savedCustomCaptions = loadSavedCustomCaptions();

    dom.btnMagic?.addEventListener('click', () => {
        dom.captionEditorSheet.style.display = 'flex';
        dom.captionEditorSheet.classList.remove('is-opening');
        void dom.captionEditorSheet.offsetWidth;
        dom.captionEditorSheet.classList.add('is-opening');
    });
    dom.btnCloseCaptionEditor?.addEventListener('click', () => {
        dom.captionEditorSheet.classList.remove('is-opening');
        dom.captionEditorSheet.style.display = 'none';
    });

    document.getElementById('btnCloseCustomCreator')?.addEventListener('click', () => {
        document.getElementById('customCaptionCreatorSheet').style.display = 'none';
    });

    window.addEventListener('customCaption:apply', (event) => {
        const customData = normalizeCustomCaption(event.detail || {});
        savedCustomCaptions.push(customData);
        saveCustomCaptions();
        applyCustomCaption(dom, customData);
        renderSavedCustomCaptions(dom);
    });

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

        // ==========================================
        // THÊM NÚT "+" MÀU XANH Ở CUỐI CÙNG
        // ==========================================
        const customTitle = document.createElement('div');
        customTitle.style.cssText = "color: #aaa; font-size: 11px; font-weight: bold; margin: 15px 0 8px 0; text-transform: uppercase;";
        customTitle.innerText = "Tùy Chỉnh Của Bạn";
        container.appendChild(customTitle);

        const customList = document.createElement('div');
        customList.className = 'caption-style-list';
        customList.style.cssText = "display: flex; overflow-x: auto; gap: 10px; scrollbar-width: none; padding: 5px 0 15px 0; width: 100%; box-sizing: border-box; align-items: center;";
        savedCustomListElement = customList;
        
        // Tạo nút Fake Caption màu xanh
        const addBtn = document.createElement('button');
        addBtn.className = "caption-style-btn";
        addBtn.style.background = "#2c2c2e"; 
        addBtn.style.color = "white";
        addBtn.style.border = "none";
        addBtn.style.minWidth = "70px"; // Cho nút rộng một chút
        addBtn.style.height = "36px";
        addBtn.style.display = "flex";
        addBtn.style.justifyContent = "center";
        addBtn.style.alignItems = "center";
        addBtn.style.flexShrink = "0";
        addBtn.innerHTML = `<span style="font-size: 22px; font-weight: bold; line-height: 1;">+</span>`;

        // Sự kiện khi bấm vào nút "+"
        addBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Cực kỳ quan trọng: Ngăn không cho nổi sự kiện click lên container (tránh bị lỗi logic đổi caption cũ)
            window.dispatchEvent(new CustomEvent('customCaption:open'));
        });

        customList.appendChild(addBtn);
        renderSavedCustomCaptions(dom);
        container.appendChild(customList);
    }

    // 3. LOGIC CLICK (Hiển thị đúng Emoji hoặc GIF trên ảnh)
    container?.addEventListener('click', (e) => {
        const btn = e.target.closest('.caption-style-btn');
        if (!btn) return;

        container.querySelectorAll('.caption-style-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        currentStyleId = btn.dataset.id;
        currentCustomCaption = null;
        const themeData = CAPTION_THEMES.find(t => t.id === currentStyleId);
        if (!themeData) return;
        
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
    currentCustomCaption = null;
}

// NGƯỜI GỬI PAYLOAD GẦN SERVER (ĐÃ FIX CHO LOCKET IOS)
export function getCaptionPayload(textString) {
    // 1. Ép text thành dấu cách nếu trống do Locket không xóa khung
    const finalText = (textString && textString.trim() !== "") ? textString.trim() : " ";
    
    // Domain Worker của mình làm Proxy tải GIF
    const BASE_API = "https://locket-api.trinhgiaphong2k9.workers.dev";
    
    // Giữ đuôi &ext=.gif để an toàn cho thư viện load ảnh iOS
    const getProxyUrl = (url) => `${BASE_API}/proxy-gif?url=${encodeURIComponent(url)}&ext=.gif`;

    // 2. TRƯỜNG HỢP CUSTOM CAPTION (GIPHY TỰ CHỌN)
    if (currentStyleId === 'custom' && currentCustomCaption) {
        const isGif = !!currentCustomCaption.gifUrl;
        
        let overlayData = {
            "background": { 
                // Với GIF, iOS bắt buộc mảng colors phải rỗng []
                "colors": isGif ? [] : (currentCustomCaption.bgColors || []) 
            },
            "text_color": currentCustomCaption.textColor || "#FFFFFF",
            "type": isGif ? "time" : "static_content", // GIF dùng "time", màu nền dùng "static_content"
            "max_lines": isGif ? 1 : { "@type": "type.googleapis.com/google.protobuf.Int64Value", "value": "4" },
            "text": finalText
        };
        
        if (isGif) {
            overlayData["icon"] = {
                "data": getProxyUrl(currentCustomCaption.gifUrl),
                "type": "image",
                "source": "url" // Bắt buộc có source: "url"
            };
        }
        
        return [{
            "overlay_id": isGif ? "caption:time" : "caption:miss_you", 
            "alt_text": finalText,
            "overlay_type": "caption",
            "data": overlayData
        }];
    }
    
    // 3. TRƯỜNG HỢP THEME CÓ SẴN
    const themeData = CAPTION_THEMES.find(t => t.id === currentStyleId) || CAPTION_THEMES[0];
    const template = themeData.payload;
    const isStandard = themeData.iconType === 'none';
    const isGif = themeData.iconType === 'gif';

    let overlayData = {
        "background": {
            "colors": isGif ? [] : (template.background?.colors || [])
        },
        "text_color": template.text_color || "#FFFFFF",
        "type": isStandard ? "standard" : (isGif ? "time" : "static_content"), 
        "max_lines": isGif ? 1 : { "@type": "type.googleapis.com/google.protobuf.Int64Value", "value": "4" },
        "text": finalText
    };

    if (isGif && themeData.iconValue) {
        overlayData["icon"] = {
            "data": getProxyUrl(themeData.iconValue),
            "type": "image",
            "source": "url"
        };
    } else if (themeData.iconType === 'emoji' && themeData.iconValue) {
        overlayData["icon"] = {
            "type": "emoji",
            "data": themeData.iconValue.trim()
        };
    }

    // Mapping sang các ID an toàn cho iOS
    let safeOverlayId = "caption:standard";
    if (!isStandard) {
        safeOverlayId = isGif ? "caption:time" : "caption:miss_you";
    }

    return [{
        "overlay_id": safeOverlayId,
        "alt_text": finalText,
        "overlay_type": "caption",
        "data": overlayData
    }];
}