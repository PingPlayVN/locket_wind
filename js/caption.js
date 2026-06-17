// [js/caption.js] - ALGORITHM LOCKET DIO (Dịch sang Vanilla JS)

// BỘ TỪ ĐIỂN CẤU TRÚC PAYLOAD CHUẨN LOCKET
export const captionTemplates = {
    standard: {
        cssClass: "theme-standard",
        payload: {
            "background": { "material_blur": "ultra_thin", "colors": [] },
            "text_color": "#FFFFFFE6",
            "type": "standard"
        }
    },
    transparent: {
        cssClass: "theme-transparent",
        payload: {
            "background": { "colors": [] },
            "text_color": "#FFFFFF",
            "type": "standard"
        }
    },
    locket_gold: {
        cssClass: "theme-locket_gold",
        payload: {
            // Locket Server nhận mã màu Hex array để vẽ Gradient
            "background": { "colors": ["#FFD700", "#FF8C00"] }, 
            "text_color": "#000000",
            "type": "standard"
        }
    },
    ocean_blue: {
        cssClass: "theme-ocean_blue",
        payload: {
            "background": { "colors": ["#00c6ff", "#0072ff"] },
            "text_color": "#FFFFFF",
            "type": "standard"
        }
    },
    love_pink: {
        cssClass: "theme-love_pink",
        payload: {
            "background": { "colors": ["#ff758c", "#ff7eb3"] },
            "text_color": "#FFFFFF",
            "type": "standard"
        }
    },
    dark_mode: {
        cssClass: "theme-dark_mode",
        payload: {
            "background": { "colors": ["#000000", "#111111"] },
            "text_color": "#FFFFFF",
            "type": "standard"
        }
    }
};

let currentStyleId = 'standard';

export function initCaptionEditor(dom) {
    // 1. Đồng bộ 2 ô Input realtime
    dom.modalCaptionInput?.addEventListener('input', (e) => {
        if(dom.customCaptionInput) dom.customCaptionInput.value = e.target.value;
    });
    dom.customCaptionInput?.addEventListener('input', (e) => {
        if(dom.modalCaptionInput) dom.modalCaptionInput.value = e.target.value;
    });

    // 2. Đóng / Mở Bảng Điều Khiển
    dom.btnMagic?.addEventListener('click', () => {
        dom.captionEditorSheet.style.display = 'block';
        dom.customCaptionInput.focus();
    });
    dom.btnCloseCaptionEditor?.addEventListener('click', () => {
        dom.captionEditorSheet.style.display = 'none';
    });

    // 3. Logic chọn màu
    dom.captionStyleList?.addEventListener('click', (e) => {
        const btn = e.target.closest('.caption-style-btn');
        if (!btn) return;

        dom.captionStyleList.querySelectorAll('.caption-style-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        currentStyleId = btn.dataset.id;
        
        // Cập nhật View (Preview CSS)
        dom.captionOverlay.className = 'caption-overlay-pill'; 
        if (currentStyleId !== 'standard') {
            dom.captionOverlay.classList.add(captionTemplates[currentStyleId].cssClass);
        }
    });
}

export function resetCaptionStyle(dom) {
    if(dom.captionEditorSheet) dom.captionEditorSheet.style.display = 'none';
    if(dom.customCaptionInput) dom.customCaptionInput.value = "";
    if(dom.captionOverlay) dom.captionOverlay.className = 'caption-overlay-pill';
    
    dom.captionStyleList?.querySelectorAll('.caption-style-btn').forEach(b => b.classList.remove('active'));
    dom.captionStyleList?.querySelector('[data-id="standard"]')?.classList.add('active');
    currentStyleId = 'standard';
}

// ALGORITHM: Đóng gói API Data để gửi đi y xì Locket Dio
export function getCaptionPayload(textString) {
    if (!textString || textString.trim() === "") return null;
    
    // Lấy công thức cấu trúc màu tương ứng
    const template = captionTemplates[currentStyleId].payload;

    return [{
        "overlay_id": "caption:standard",
        "alt_text": textString.trim(),
        "overlay_type": "caption",
        "data": {
            "background": template.background,
            "text_color": template.text_color,
            "type": template.type,
            "max_lines": { "@type": "type.googleapis.com/google.protobuf.Int64Value", "value": "4" },
            "text": textString.trim()
        }
    }];
}