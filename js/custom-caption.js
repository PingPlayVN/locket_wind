// [js/custom-caption.js] - MODULE CUSTOM CAPTION (GIPHY + MULTI-GRADIENT)

const GIPHY_API_KEY = "wdLvCyltf1wSrBIQGka7957B0FoNy0NC"; // Thay API Key của bạn

const domCustom = {
    // Text & Color Inputs
    textInput: document.getElementById('customTextInput'),
    textColor: document.getElementById('customTextColor'),
    bgColorList: document.getElementById('bgColorList'),
    btnAddBgColor: document.getElementById('btnAddBgColor'),
    
    // Local Preview
    localPreviewBox: document.getElementById('localCustomPreview'),
    localPreviewText: document.getElementById('localPreviewText'),
    localPreviewGif: document.getElementById('localPreviewGif'),
    btnApply: document.getElementById('btnApplyCustom'),
    
    // Giphy UI
    input: document.getElementById('giphySearchInput'),
    btnSearch: document.getElementById('btnSearchGiphy'),
    grid: document.getElementById('giphyResultsGrid'),
    loader: document.getElementById('giphyLoader'),
    btnClose: document.getElementById('btnCloseCustomCreator'),
    sheet: document.getElementById('customCaptionCreatorSheet'),
    pagination: document.getElementById('giphyPagination'),
    btnPrev: document.getElementById('btnPrevGiphy'),
    btnNext: document.getElementById('btnNextGiphy'),
    pageInfo: document.getElementById('giphyPageInfo')
};

let searchTimeout = null;
let currentSearchQuery = '';
let currentOffset = 0;
const GIFS_PER_PAGE = 20;

// Biến lưu trạng thái Custom (bgColors giờ là một mảng tối đa 8 phần tử)
let customDraft = {
    gifUrl: "",
    text: "Văn bản mẫu",
    textColor: "#ffffff",
    bgColors: ["#00000080"] // Mặc định có 1 màu nền
};

function getCustomPayload() {
    return {
        gifUrl: customDraft.gifUrl,
        text: customDraft.text,
        textColor: customDraft.textColor,
        bgColors: [...customDraft.bgColors]
    };
}

function refreshColoris() {
    try {
        if (typeof Coloris !== 'undefined' && typeof Coloris.init === 'function') {
            Coloris.init();
        }
    } catch (error) {
        console.warn("Không thể khởi tạo lại Coloris", error);
    }
}

function resetGiphyBoard() {
    currentSearchQuery = '';
    currentOffset = 0;
    clearTimeout(searchTimeout);
    if (domCustom.loader) domCustom.loader.style.display = 'none';
    if (domCustom.pagination) domCustom.pagination.style.display = 'none';
    if (domCustom.grid) {
        domCustom.grid.innerHTML = `<div style="text-align: center; grid-column: 1 / -1; color: #555; font-size: 13px; margin-top: 20px;">Nhập từ khóa rồi bấm Tìm để gán ảnh động vào Caption</div>`;
    }
}

function openCustomCaptionSheet() {
    renderBgColorList();
    updateLocalPreview();
    resetGiphyBoard();

    domCustom.sheet.style.display = 'flex';
    domCustom.sheet.classList.remove('is-opening');
    void domCustom.sheet.offsetWidth;
    domCustom.sheet.classList.add('is-opening');
    domCustom.input?.focus();
}

function closeCustomCaptionSheet() {
    domCustom.sheet.classList.remove('is-opening');
    domCustom.sheet.style.display = 'none';
}

export function initCustomCaption() {
    if (!domCustom.input) return;

    // 1. Khởi tạo Coloris (Bọc chống Crash)
    try {
        if (typeof Coloris !== 'undefined') {
            Coloris({
                theme: 'pill',
                themeMode: 'dark',
                alpha: true,
                formatToggle: true,
                onChange: (color, input) => {
                    if (input.id === 'customTextColor') {
                        customDraft.textColor = color;
                    } else if (input.classList.contains('custom-bg-input')) {
                        const idx = parseInt(input.dataset.index);
                        customDraft.bgColors[idx] = color;
                    }
                    updateLocalPreview();
                }
            });
        }
    } catch (e) {
        console.warn("Chưa tải được Coloris Picker", e);
    }

    // 2. Render danh sách màu nền ban đầu
    try {
        renderBgColorList();
    } catch (error) {
        console.warn("Không thể render picker màu, dùng input thường", error);
    }

    // 3. Sự kiện Gõ Chữ
    domCustom.textInput.addEventListener('input', (e) => {
        customDraft.text = e.target.value.trim() || 'Văn bản mẫu';
        updateLocalPreview();
    });

    domCustom.textColor?.addEventListener('input', (e) => {
        customDraft.textColor = e.target.value;
        updateLocalPreview();
    });

    // 4. Sự kiện Thêm Màu Nền
    domCustom.btnAddBgColor?.addEventListener('click', (event) => {
        event.preventDefault();
        if (customDraft.bgColors.length < 8) {
            // Sao chép màu cuối cùng làm màu mặc định cho dòng mới
            const lastColor = customDraft.bgColors[customDraft.bgColors.length - 1];
            customDraft.bgColors.push(lastColor);
            renderBgColorList();
            updateLocalPreview();
        }
    });
    
    // 5. Đóng/Mở bảng & Áp dụng
    window.addEventListener('customCaption:open', openCustomCaptionSheet);

    domCustom.btnClose?.addEventListener('click', () => {
        closeCustomCaptionSheet();
    });

    domCustom.btnApply?.addEventListener('click', (event) => {
        event.preventDefault();
        window.dispatchEvent(new CustomEvent('customCaption:apply', {
            detail: getCustomPayload()
        }));
        closeCustomCaptionSheet();
    });

    // --- LOGIC TÌM KIẾM GIPHY ---
    const triggerSearch = () => {
        const query = domCustom.input.value.trim();
        clearTimeout(searchTimeout);
        if (!query) {
            resetGiphyBoard();
            return;
        }
        currentSearchQuery = query;
        currentOffset = 0; 
        fetchGiphyGifs(currentSearchQuery, currentOffset);
    };

    // Tìm kiếm bằng Nút Bấm
    domCustom.btnSearch?.addEventListener('click', (event) => {
        event.preventDefault();
        triggerSearch();
    });

    domCustom.btnPrev?.addEventListener('click', () => {
        if (currentOffset >= GIFS_PER_PAGE) {
            currentOffset -= GIFS_PER_PAGE;
            if (currentSearchQuery) fetchGiphyGifs(currentSearchQuery, currentOffset);
        }
    });

    domCustom.btnNext?.addEventListener('click', () => {
        if (!currentSearchQuery) return;
        currentOffset += GIFS_PER_PAGE;
        fetchGiphyGifs(currentSearchQuery, currentOffset);
    });
    
    // Gọi preview lần đầu
    updateLocalPreview();
}

// Hàm vẽ giao diện Danh sách Màu Nền
function renderBgColorList() {
    domCustom.bgColorList.innerHTML = '';
    
    customDraft.bgColors.forEach((color, index) => {
        const row = document.createElement('div');
        row.className = 'bg-color-row';
        
        // Ô input Coloris
        const input = document.createElement('input');
        input.type = typeof Coloris !== 'undefined' ? 'text' : 'color';
        input.className = 'custom-bg-input';
        input.value = input.type === 'color' ? color.slice(0, 7) : color;
        input.dataset.index = index;
        input.setAttribute('data-coloris', '');
        input.addEventListener('input', () => {
            customDraft.bgColors[index] = input.value;
            updateLocalPreview();
        });
        
        // Nút xóa (Icon thùng rác / dấu X)
        const btnRemove = document.createElement('button');
        btnRemove.className = 'btn-remove-color';
        btnRemove.innerHTML = '✕';
        btnRemove.disabled = customDraft.bgColors.length <= 1; // Khóa nếu chỉ còn 1 màu
        
        btnRemove.addEventListener('click', () => {
            if (customDraft.bgColors.length > 1) {
                // Xóa màu khỏi mảng và render lại
                customDraft.bgColors.splice(index, 1);
                renderBgColorList();
                updateLocalPreview();
            }
        });

        row.appendChild(input);
        row.appendChild(btnRemove);
        domCustom.bgColorList.appendChild(row);
    });

    // Ẩn/hiện nút Thêm màu nếu đạt mốc 8
    if (customDraft.bgColors.length >= 8) {
        domCustom.btnAddBgColor.style.opacity = '0.5';
        domCustom.btnAddBgColor.style.pointerEvents = 'none';
        domCustom.btnAddBgColor.innerText = "Đã đạt tối đa 8 màu";
    } else {
        domCustom.btnAddBgColor.style.opacity = '1';
        domCustom.btnAddBgColor.style.pointerEvents = 'auto';
        domCustom.btnAddBgColor.innerText = "+ Thêm màu";
    }

    // Yêu cầu thư viện Coloris quét và bind các phần tử input mới tạo
    refreshColoris();
}

// Hàm Render Preview Box
function updateLocalPreview() {
    // 1. Phân bổ màu gradient
    if (customDraft.bgColors.length === 1) {
        // Chỉ có 1 màu nền
        domCustom.localPreviewBox.style.background = customDraft.bgColors[0];
    } else {
        // Nhiều màu -> Gradient từ trên xuống (to bottom)
        const colors = customDraft.bgColors.join(', ');
        domCustom.localPreviewBox.style.background = `linear-gradient(to bottom, ${colors})`;
    }

    // 2. Chữ và GIF
    domCustom.localPreviewText.style.color = customDraft.textColor;
    domCustom.localPreviewText.innerText = customDraft.text;

    if (customDraft.gifUrl) {
        domCustom.localPreviewGif.src = customDraft.gifUrl;
        domCustom.localPreviewGif.style.display = 'inline-block';
    } else {
        domCustom.localPreviewGif.style.display = 'none';
    }
}

// API Giphy
async function fetchGiphyGifs(query, offset = 0) {
    domCustom.grid.innerHTML = '';
    domCustom.loader.style.display = 'block';
    domCustom.pagination.style.display = 'none';

    try {
        const url = `https://api.giphy.com/v1/gifs/search?api_key=${GIPHY_API_KEY}&q=${encodeURIComponent(query)}&limit=50&offset=${offset}&rating=g`;
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Giphy HTTP ${response.status}`);
        const json = await response.json();

        domCustom.loader.style.display = 'none';

        if (json.data && json.data.length > 0) {
            let squareGifs = json.data.filter(gif => {
                const ratio = parseInt(gif.images.original.width) / parseInt(gif.images.original.height);
                return ratio >= 0.8 && ratio <= 1.2;
            }).slice(0, GIFS_PER_PAGE); 

            if (squareGifs.length === 0) {
                squareGifs = json.data.slice(0, GIFS_PER_PAGE);
            }

            renderGifs(squareGifs);
            updatePaginationUI(offset, squareGifs.length);
        } else {
            domCustom.grid.innerHTML = `<div style="text-align: center; grid-column: 1 / -1; color: #888; font-size: 13px; margin-top: 20px;">Không tìm thấy ảnh nào.</div>`;
        }
    } catch (error) {
        domCustom.loader.style.display = 'none';
        domCustom.grid.innerHTML = `<div style="text-align: center; grid-column: 1 / -1; color: #ff4444; font-size: 13px; margin-top: 20px;">Lỗi kết nối API Giphy: ${error.message}</div>`;
    }
}

function updatePaginationUI(offset, resultCount) {
    domCustom.pagination.style.display = 'flex';
    const currentPage = Math.floor(offset / GIFS_PER_PAGE) + 1;
    domCustom.pageInfo.innerText = `Trang ${currentPage}`;
    
    domCustom.btnPrev.disabled = (offset === 0);
    domCustom.btnPrev.style.opacity = (offset === 0) ? '0.4' : '1';
    
    domCustom.btnNext.disabled = (resultCount < GIFS_PER_PAGE);
    domCustom.btnNext.style.opacity = (resultCount < GIFS_PER_PAGE) ? '0.4' : '1';
}

function renderGifs(gifDataList) {
    domCustom.grid.innerHTML = '';
    gifDataList.forEach(gif => {
        const gifThumbUrl = gif.images.fixed_height_small.url;
        const originalUrl = gif.images.original.url;

        const img = document.createElement('img');
        img.className = 'giphy-item';
        img.src = gifThumbUrl;
        
        img.addEventListener('click', () => {
            document.querySelectorAll('.giphy-item').forEach(el => el.classList.remove('selected'));
            img.classList.add('selected');
            
            customDraft.gifUrl = originalUrl;
            updateLocalPreview();
        });

        domCustom.grid.appendChild(img);
    });
}

initCustomCaption();
