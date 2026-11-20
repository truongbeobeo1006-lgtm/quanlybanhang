// ========================================================
// ADMIN.JS - GIAO DIỆN QUẢN TRỊ VIÊN MR.HUY THERMOS
// ĐỒNG BỘ 40 SẢN PHẨM, QUẢN LÝ USER, ĐƠN HÀNG & THỐNG KÊ
// KHÔNG DÙNG BACKEND / DATABASE (CLIENT-SIDE IN MEMORY)
// ========================================================

// --------------------------------------------------------
// HỆ THỐNG TOAST THÔNG BÁO HIỆN ĐẠI (LOẠI BỎ TOÀN BỘ POPUP NATIVE)
// --------------------------------------------------------
function showToast(message, type = 'info', title = '') {
    let container = document.getElementById('toastNotificationContainer');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toastNotificationContainer';
        container.className = 'toast-container';
        document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    toast.className = `toast-item toast-${type}`;
    
    let iconClass = 'fa-solid fa-circle-info';
    if (type === 'success') iconClass = 'fa-solid fa-circle-check';
    else if (type === 'warning') iconClass = 'fa-solid fa-triangle-exclamation';
    else if (type === 'danger' || type === 'error') {
        type = 'danger';
        iconClass = 'fa-solid fa-circle-xmark';
    }

    const formattedMsg = String(message).replace(/\n/g, '<br>');
    toast.innerHTML = `
        <i class="${iconClass} toast-icon" style="font-size: 1.25rem; margin-top: 2px;"></i>
        <div style="flex: 1;">
            ${title ? `<div style="font-weight: 600; margin-bottom: 2px;">${title}</div>` : ''}
            <div>${formattedMsg}</div>
        </div>
        <button type="button" style="background: none; border: none; cursor: pointer; color: #94a3b8; font-size: 16px; padding: 0 4px;" onclick="this.parentElement.remove()">&times;</button>
    `;
    container.appendChild(toast);
    setTimeout(() => {
        toast.style.animation = 'toastSlideOut 0.3s forwards';
        setTimeout(() => toast.remove(), 300);
    }, 3800);
}

// Override window.alert để triệt tiêu vĩnh viễn popup native trình duyệt
window.alert = function(msg) {
    let type = 'info';
    if (typeof msg === 'string') {
        if (msg.includes('THÀNH CÔNG') || msg.includes('thành công')) type = 'success';
        else if (msg.includes('LỖI') || msg.includes('bị khóa') || msg.includes('thất bại')) type = 'danger';
        else if (msg.includes('CẢNH BÁO') || msg.includes('Vui lòng')) type = 'warning';
    }
    showToast(msg, type);
};

// 0. SẢN PHẨM CHUẨN (ĐỒNG BỘ HIỂN THỊ VỚI PHÍA INDEX NGƯỜI DÙNG)
const FLAGSHIP_PRODUCT = {
    id: 'SP-MRHUY-01',
    name: 'Ly Giữ Nhiệt Cao Cấp Inox 304 Iced Americano Kèm Ống Hút Mr.Huy (600ml)',
    category: 'ly-giu-nhiet',
    catName: 'Ly giữ nhiệt',
    capacity: '600ml',
    price: 189000,
    oldPrice: 250000,
    sold: 1240,
    rating: '4.9 (1.2k+ đánh giá)',
    image: 'img/ly-giu-nhiet-1.png',
    desc: 'Chất liệu ruột Inox 304 cao cấp đạt chuẩn an toàn vệ sinh thực phẩm quốc tế. Công nghệ cách nhiệt chân không kép giữ nóng 8 tiếng, giữ lạnh đá viên liên tục 18 tiếng không đọng sương bên ngoài. Nắp đậy có khóa chặt chống rò nước 100%, tích hợp lỗ uống trực tiếp và cắm ống hút tiện lợi.'
};

// 1. DỮ LIỆU SẢN PHẨM QUẢN TRỊ (ĐỒNG BỘ TỪ PRODUCTS_DATA 40 SẢN PHẨM)
let ADMIN_PRODUCTS = [];

function initAdminProducts() {
    if (typeof PRODUCTS_DATA !== 'undefined' && Array.isArray(PRODUCTS_DATA)) {
        // Sao chép từ 40 sản phẩm chuẩn của web
        ADMIN_PRODUCTS = PRODUCTS_DATA.map((p, idx) => {
            // Thiết lập số lượt bán mẫu thực tế:
            // Các mã SP đầu hoặc hot có lượt bán > 0; một số sản phẩm mới/ít bán có lượt bán = 0
            const hasSoldHistory = [1, 2, 3, 4, 5, 9, 10, 11, 14, 17, 18, 19, 21, 25, 26, 28, 33, 34, 37].includes(idx + 1);
            const soldCount = hasSoldHistory ? (1200 - idx * 28 + (idx % 7) * 45) : 0;
            return {
                id: p.id,
                name: p.name,
                category: p.category,
                capacity: p.capacity || '500ml',
                price: p.price,
                oldPrice: p.oldPrice || Math.round(p.price * 1.25),
                image: p.image,
                description: p.description || 'Chất liệu inox 304/316 cao cấp giữ nhiệt lâu dài.',
                rating: p.rating || 5.0,
                sold: soldCount,
                status: p.status || 'active' // 'active' (đang bán) | 'hidden' (đã ẩn khỏi web)
            };
        });
    } else {
        // Fallback nếu app.js chưa nạp
        ADMIN_PRODUCTS = [
            { id: 'SP001', name: 'Ly Giữ Nhiệt Inox 304 Nắp Bật 900ml', category: 'ly-giu-nhiet', capacity: '900ml', price: 189000, sold: 1240, status: 'active', image: 'images/ly-giu-nhiet-1.png' },
            { id: 'SP002', name: 'Bình Thể Thao Inox Khóa Nắp Bật 1000ml', category: 'binh-the-thao', capacity: '1000ml', price: 299000, sold: 856, status: 'active', image: 'images/binh-nuoc-the-thao-1.png' },
            { id: 'SP003', name: 'Ly Giữ Nhiệt Quai Cầm Inox Coffee 500ml', category: 'ly-van-phong', capacity: '500ml', price: 215000, sold: 540, status: 'active', image: 'images/ly-van-phong-1.png' },
            { id: 'SP004', name: 'Bình Nước Họa Tiết Vintage Sơn Mài 600ml', category: 'ly-hoa-tiet', capacity: '600ml', price: 245000, sold: 0, status: 'active', image: 'images/binh-nuoc-hoa-tiet-1.png' }
        ];
    }
}

// 2. DỮ LIỆU NGƯỜI DÙNG QUẢN LÝ
let ADMIN_USERS = [
    { id: 'U001', username: 'admin', fullName: 'Quản Trị Viên SGU', email: 'admin@mrhuy.vn', phone: '0901234567', address: '273 An Dương Vương, Q5, TP.HCM', role: 'ADMIN', status: 'active' },
    { id: 'U002', username: 'nguyenvana', fullName: 'Nguyễn Văn An', email: 'nguyenvana@gmail.com', phone: '0912345678', address: '123 Nguyễn Huệ, Quận 1, TP.HCM', role: 'USER', status: 'active' },
    { id: 'U003', username: 'tranthib', fullName: 'Trần Thị Bình', email: 'tranthib@gmail.com', phone: '0987654321', address: '45 Cầu Giấy, Hà Nội', role: 'USER', status: 'active' },
    { id: 'U004', username: 'lequangc', fullName: 'Lê Quang Cường', email: 'lequangc@gmail.com', phone: '0933112233', address: '789 Trần Phú, Hải Châu, Đà Nẵng', role: 'USER', status: 'active' },
    { id: 'U005', username: 'phamthid', fullName: 'Phạm Thị Dung', email: 'phamthid@gmail.com', phone: '0944556677', address: '12 Quang Trung, Gò Vấp, TP.HCM', role: 'USER', status: 'locked' },
    { id: 'U006', username: 'vuminhtuan', fullName: 'Vũ Minh Tuấn', email: 'vuminhtuan@gmail.com', phone: '0977889900', address: '99 Láng Hạ, Đống Đa, Hà Nội', role: 'USER', status: 'active' }
];

// 3. DỮ LIỆU ĐƠN HÀNG MẪU (5 ĐƠN KHÁC NHAU VỀ THỜI GIAN THEO ĐỀ BÀI)
let ADMIN_ORDERS = [
    {
        id: 'DH1001',
        customerName: 'Nguyễn Văn An',
        userId: 'U002',
        phone: '0912345678',
        email: 'nguyenvana@gmail.com',
        address: '123 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP.HCM',
        city: 'TP. Hồ Chí Minh',
        district: 'Quận 1',
        date: '2025-01-10',
        status: 'Đã giao thành công',
        totalAmount: 619000,
        items: [
            { name: 'Bình Thể Thao Inox 304 Khóa Nắp Bật 1000ml', cat: 'Bình thể thao', price: 299000, qty: 1, image: 'img/binh-the-thao-1.jpg' },
            { name: 'Ly Giữ Nhiệt Văn Phòng nắp xoay 500ml', cat: 'Ly văn phòng', price: 320000, qty: 1, image: 'img/ly-van-phong-1.png' }
        ]
    },
    {
        id: 'DH1002',
        customerName: 'Trần Thị Bình',
        userId: 'U003',
        phone: '0987654321',
        email: 'tranthib@gmail.com',
        address: '45 Cầu Giấy, Phường Dịch Vọng, Quận Cầu Giấy, Hà Nội',
        city: 'Hà Nội',
        district: 'Quận Cầu Giấy',
        date: '2025-02-14',
        status: 'Đã giao thành công',
        totalAmount: 850000,
        items: [
            { name: 'Combo Bình Giữ Nhiệt & Hộp Quà Tặng Doanh Nghiệp', cat: 'Hộp quà tặng', price: 425000, qty: 2, image: 'img/hop-qua-1.png' }
        ]
    },
    {
        id: 'DH1003',
        customerName: 'Lê Quang Cường',
        userId: 'U004',
        phone: '0933112233',
        email: 'lequangc@gmail.com',
        address: '789 Trần Phú, Phường Hải Châu 1, Quận Hải Châu, Đà Nẵng',
        city: 'Đà Nẵng',
        district: 'Quận Hải Châu',
        date: '2025-03-01',
        status: 'Đã xác nhận',
        totalAmount: 420000,
        items: [
            { name: 'Bình Giữ Nhiệt Họa Tiết Hoa Hồng Khắc Nổi 600ml', cat: 'Bình nước họa tiết', price: 420000, qty: 1, image: 'img/hoa-tiet-1.png' }
        ]
    },
    {
        id: 'DH1004',
        customerName: 'Nguyễn Văn An',
        userId: 'U002',
        phone: '0912345678',
        email: 'nguyenvana@gmail.com',
        address: '123 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP.HCM',
        city: 'TP. Hồ Chí Minh',
        district: 'Quận 1',
        date: '2025-03-15',
        status: 'Đã xác nhận',
        totalAmount: 1250000,
        items: [
            { name: 'Ly Giữ Nhiệt Chân Không Inox 316 Cao Cấp 750ml', cat: 'Ly giữ nhiệt', price: 380000, qty: 2, image: 'img/ly-giu-nhiet-1.png' },
            { name: 'Hộp Quà Cao Cấp Bình Giữ Nhiệt Khắc Tên', cat: 'Hộp quà tặng', price: 490000, qty: 1, image: 'img/hop-qua-3.png' }
        ]
    },
    {
        id: 'DH1005',
        customerName: 'Vũ Minh Tuấn',
        userId: 'U006',
        phone: '0977889900',
        email: 'vuminhtuan@gmail.com',
        address: '99 Láng Hạ, Phường Thành Công, Quận Đống Đa, Hà Nội',
        city: 'Hà Nội',
        district: 'Quận Đống Đa',
        date: '2025-03-28',
        status: 'Chưa xác nhận',
        totalAmount: 380000,
        items: [
            { name: 'Ly Giữ Nhiệt Coffee Cup Nắp Chống Tràn 510ml', cat: 'Ly văn phòng', price: 190000, qty: 2, image: 'img/ly-van-phong-5.png' }
        ]
    }
];

// Helper: Format tiền tệ VND
function formatCurrencyAdmin(val) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
}

// Helper: Tên tiếng Việt của danh mục
function getCatText(cat) {
    const map = {
        'ly-giu-nhiet': 'Ly giữ nhiệt',
        'binh-the-thao': 'Bình thể thao',
        'ly-van-phong': 'Ly văn phòng',
        'ly-hoa-tiet': 'Bình nước họa tiết',
        'phu-kien': 'Ống hút & Cọ rửa',
        'hop-qua': 'Hộp quà tặng'
    };
    return map[cat] || cat;
}

// ========================================================
// 4. ĐĂNG NHẬP / ĐĂNG XUẤT ADMIN & ĐIỀU HƯỚNG TAB
// ========================================================

function handleAdminLoginSubmit(e) {
    if (e) e.preventDefault();
    const userInput = document.getElementById('adminInputUser')?.value.trim() || 'admin';
    const displayName = (userInput.toLowerCase() === 'admin') ? 'Quản Trị Viên (admin)' : userInput;

    const nameBox = document.getElementById('adminLoggedNameBox');
    if (nameBox) {
        nameBox.innerHTML = `Quản trị viên: <strong>${displayName}</strong>`;
    }

    const loginScreen = document.getElementById('adminLoginScreen');
    const mainLayout = document.getElementById('adminMainLayout');

    if (loginScreen) loginScreen.style.display = 'none';
    if (mainLayout) mainLayout.style.display = 'flex';

    showToast(`Chào mừng "${displayName}" đã đăng nhập vào hệ thống Mr.Huy Admin!`, 'success', 'Đăng nhập Admin');
}

function handleAdminLogoutMock() {
    const loginScreen = document.getElementById('adminLoginScreen');
    const mainLayout = document.getElementById('adminMainLayout');

    if (mainLayout) mainLayout.style.display = 'none';
    if (loginScreen) loginScreen.style.display = 'flex';

    showToast('Bạn đã đăng xuất tài khoản Quản trị thành công!', 'info', 'Đăng xuất Admin');
}

function switchAdminTab(tab) {
    document.querySelectorAll('.admin-nav-item').forEach(el => el.classList.remove('active'));
    const navEl = document.getElementById(`nav${tab.charAt(0).toUpperCase() + tab.slice(1)}`);
    if (navEl) navEl.classList.add('active');

    document.querySelectorAll('.admin-tab-content').forEach(el => el.style.display = 'none');
    const tabEl = document.getElementById(`tab${tab.charAt(0).toUpperCase() + tab.slice(1)}`);
    if (tabEl) tabEl.style.display = 'block';

    const titles = {
        dashboard: 'Tổng Quan Hệ Thống Mr.Huy',
        products: `Quản Lý Toàn Bộ ${ADMIN_PRODUCTS.length} Sản Phẩm (Thêm / Sửa / Xóa / Ẩn)`,
        users: 'Quản Lý Người Dùng (Thêm / Sửa / Khóa - Mở Khóa)',
        orders: 'Quản Lý Đơn Hàng',
        stats: 'Báo Cáo Thống Kê Top 5 Khách Hàng Chi Tiêu Cao Nhất'
    };
    const titleEl = document.getElementById('pageTitleText');
    if (titleEl) titleEl.textContent = titles[tab] || 'Quản Trị';

    if (tab === 'dashboard') updateDashboardMetrics();
    if (tab === 'products') renderAdminProducts();
    if (tab === 'users') renderAdminUsers();
    if (tab === 'orders') filterAdminOrders();
    if (tab === 'stats') runCustomerStatistics();
}

// ========================================================
// 5. QUẢN LÝ SẢN PHẨM (40 SẢN PHẨM ĐỒNG BỘ + TÌM KIẾM REAL-TIME)
// ========================================================

// Bộ lọc và tìm kiếm sản phẩm real-time cho admin
function handleAdminProductSearch() {
    const sInput = document.getElementById('adminProductSearchInput');
    const cFilter = document.getElementById('adminProductCategoryFilter');

    const keyword = sInput ? sInput.value.trim().toLowerCase() : '';
    const selectedCat = cFilter ? cFilter.value : '';

    const filtered = ADMIN_PRODUCTS.filter(p => {
        const matchesKeyword = !keyword || 
            (p.name && p.name.toLowerCase().includes(keyword)) || 
            (p.id && p.id.toLowerCase().includes(keyword)) || 
            (p.capacity && p.capacity.toLowerCase().includes(keyword));

        let matchesCat = true;
        if (selectedCat) {
            if (selectedCat === 'office') matchesCat = (p.category === 'ly-giu-nhiet' || p.category === 'ly-van-phong');
            else if (selectedCat === 'sport') matchesCat = (p.category === 'binh-the-thao');
            else if (selectedCat === 'smart') matchesCat = (p.category === 'binh-thong-minh');
            else if (selectedCat === 'kids') matchesCat = (p.category === 'binh-tre-em');
            else if (selectedCat === 'gift') matchesCat = (p.category === 'hop-qua');
            else matchesCat = (p.category === selectedCat);
        }

        return matchesKeyword && matchesCat;
    });

    const countDisplay = document.getElementById('adminProductCountDisplay');
    if (countDisplay) countDisplay.textContent = filtered.length;

    renderAdminProducts(filtered);
}

function clearAdminProductSearch() {
    const sInput = document.getElementById('adminProductSearchInput');
    const cFilter = document.getElementById('adminProductCategoryFilter');
    if (sInput) sInput.value = '';
    if (cFilter) cFilter.value = '';
    handleAdminProductSearch();
}

function renderAdminProducts(list = null) {
    const tbody = document.getElementById('adminProductsTbody');
    if (!tbody) return;

    const dataToRender = list !== null ? list : ADMIN_PRODUCTS;
    const countDisplay = document.getElementById('adminProductCountDisplay');
    if (countDisplay && list === null) countDisplay.textContent = ADMIN_PRODUCTS.length;

    if (dataToRender.length === 0) {
        tbody.innerHTML = `<tr><td colspan="9" style="text-align: center; padding: 30px; color: #94a3b8;">Không tìm thấy sản phẩm nào khớp với tìm kiếm</td></tr>`;
        return;
    }

    tbody.innerHTML = dataToRender.map(prod => {
        const isHidden = prod.status === 'hidden';
        const statusBadge = isHidden
            ? `<span class="badge-status badge-hidden"><i class="fa-solid fa-eye-slash"></i> Đã ẩn khỏi web</span>`
            : `<span class="badge-status badge-active"><i class="fa-solid fa-check"></i> Đang bán</span>`;

        // Hành động Xóa / Ẩn:
        // Nếu đã từng bán ra (sold > 0): ẩn/bỏ ẩn
        // Nếu chưa từng bán ra (sold == 0): xóa vĩnh viễn (không dùng popup confirm)
        let actionBtn = '';
        if (prod.sold > 0) {
            if (isHidden) {
                actionBtn = `<button class="btn-admin btn-admin-success" style="padding: 4px 8px; font-size: 11px;" onclick="handleDeleteProduct('${prod.id}')" title="Hiện lại sản phẩm trên web"><i class="fa-solid fa-eye"></i> Hiện lại</button>`;
            } else {
                actionBtn = `<button class="btn-admin btn-admin-danger" style="padding: 4px 8px; font-size: 11px;" onclick="handleDeleteProduct('${prod.id}')" title="Sản phẩm đã bán sẽ được ẩn khỏi web thay vì xóa vĩnh viễn"><i class="fa-solid fa-eye-slash"></i> Ẩn trên web</button>`;
            }
        } else {
            actionBtn = `<button class="btn-admin btn-admin-danger" style="padding: 4px 8px; font-size: 11px;" onclick="handleDeleteProduct('${prod.id}')" title="Sản phẩm chưa có lượt bán - Xóa vĩnh viễn"><i class="fa-solid fa-trash"></i> Xóa vĩnh viễn</button>`;
        }

        return `
            <tr id="adminRow_${prod.id}">
                <td><strong>${prod.id}</strong></td>
                <td>
                    <img src="${prod.image}" alt="${prod.name}" style="width: 44px; height: 44px; object-fit: cover; border-radius: 6px; border: 1px solid #e2e8f0; vertical-align: middle;">
                </td>
                <td>
                    <strong style="font-size: 13px; color: #0f172a;">${prod.name}</strong>
                    <div style="font-size: 11px; color: #64748b;">Đánh giá: ⭐ ${prod.rating || 5.0}</div>
                </td>
                <td><span style="background: #e0f2fe; color: #0369a1; padding: 2px 8px; border-radius: 4px; font-size: 12px; font-weight: 600;">${getCatText(prod.category)}</span></td>
                <td>${prod.capacity}</td>
                <td style="font-weight: 700; color: #dc2626;">${formatCurrencyAdmin(prod.price)}</td>
                <td style="text-align: center;">
                    <span style="background: ${prod.sold > 0 ? '#f0fdf4' : '#f1f5f9'}; color: ${prod.sold > 0 ? '#166534' : '#64748b'}; padding: 3px 8px; border-radius: 12px; font-weight: 700; font-size: 12px;">
                        ${prod.sold}
                    </span>
                </td>
                <td id="statusCell_${prod.id}">${statusBadge}</td>
                <td>
                    <div style="display: flex; gap: 4px;">
                        <button class="btn-admin btn-admin-outline" style="padding: 4px 8px; font-size: 11px;" onclick="openEditProductModal('${prod.id}')"><i class="fa-solid fa-pen"></i> Sửa</button>
                        ${actionBtn}
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

// Logic Xóa / Ẩn sản phẩm theo đúng yêu cầu đề bài:
// - Nếu sản phẩm đã được bán ra thì ẩn sản phẩm hiển thị trên web
// - Nếu sản phẩm chưa được bán ra thì xóa vĩnh viễn (thông báo Toast không popup)
function handleDeleteProduct(id) {
    const prod = ADMIN_PRODUCTS.find(p => p.id === id);
    if (!prod) return;

    if (prod.sold > 0) {
        if (prod.status === 'hidden') {
            prod.status = 'active';
            // Đồng bộ sang PRODUCTS_DATA người dùng
            if (typeof PRODUCTS_DATA !== 'undefined') {
                const pUser = PRODUCTS_DATA.find(p => p.id === id);
                if (pUser) pUser.status = 'active';
            }
            showToast(`Đã MỞ LẠI sản phẩm [${prod.name}]! Sản phẩm đã xuất hiện trở lại trên website.`, 'success', 'Mở lại sản phẩm');
        } else {
            prod.status = 'hidden';
            // Đồng bộ sang PRODUCTS_DATA người dùng để hàm getFilteredProducts() ẩn đi
            if (typeof PRODUCTS_DATA !== 'undefined') {
                const pUser = PRODUCTS_DATA.find(p => p.id === id);
                if (pUser) pUser.status = 'hidden';
            }
            showToast(`Sản phẩm [${prod.id} - ${prod.name}] đã có ${prod.sold} lượt bán trong quá khứ nên hệ thống đã ẨN trên web để bảo toàn dữ liệu lịch sử!`, 'warning', 'Ẩn sản phẩm');
        }
    } else {
        ADMIN_PRODUCTS = ADMIN_PRODUCTS.filter(p => p.id !== id);
        // Xóa luôn khỏi PRODUCTS_DATA bên client nếu có
        if (typeof PRODUCTS_DATA !== 'undefined') {
            const idx = PRODUCTS_DATA.findIndex(p => p.id === id);
            if (idx !== -1) PRODUCTS_DATA.splice(idx, 1);
        }
        showToast(`Sản phẩm [${id} - ${prod.name}] chưa từng bán ra (lượt bán = 0) đã được xóa vĩnh viễn khỏi hệ thống!`, 'success', 'Xóa sản phẩm');
    }
    handleAdminProductSearch();
    updateDashboardMetrics();
}

function openAddProductModal() {
    document.getElementById('pModalTitle').textContent = 'Thêm Sản Phẩm Mới (Có Preview Ảnh)';
    document.getElementById('editingProductId').value = '';
    document.getElementById('pInputName').value = '';
    document.getElementById('pSelectCat').value = 'ly-giu-nhiet';
    document.getElementById('pSelectCapacity').value = '500ml';
    document.getElementById('pInputPrice').value = '189000';
    document.getElementById('pInputSold').value = '0';
    
    const previewImg = document.getElementById('previewImgTag');
    const fallback = document.getElementById('previewIconFallback');
    if (previewImg && fallback) {
        previewImg.src = '';
        previewImg.style.display = 'none';
        fallback.style.display = 'flex';
    }
    openAdminModal('productFormModal');
}

function openEditProductModal(id) {
    const prod = ADMIN_PRODUCTS.find(p => p.id === id) || ADMIN_PRODUCTS[0];
    if (!prod) return;

    document.getElementById('pModalTitle').textContent = `Sửa Sản Phẩm: [${prod.id}] ${prod.name}`;
    document.getElementById('editingProductId').value = prod.id;
    document.getElementById('pInputName').value = prod.name;
    document.getElementById('pSelectCat').value = prod.category;
    document.getElementById('pSelectCapacity').value = prod.capacity || '500ml';
    document.getElementById('pInputPrice').value = prod.price;
    document.getElementById('pInputSold').value = prod.sold;

    // Xem trước hình ảnh thật của đúng sản phẩm này
    const previewImg = document.getElementById('previewImgTag');
    const fallback = document.getElementById('previewIconFallback');
    if (previewImg && fallback) {
        previewImg.src = prod.image;
        previewImg.style.display = 'block';
        fallback.style.display = 'none';
    }

    openAdminModal('productFormModal');
}

function previewImageMock(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const imgTag = document.getElementById('previewImgTag');
            const fallback = document.getElementById('previewIconFallback');
            imgTag.src = e.target.result;
            imgTag.style.display = 'block';
            fallback.style.display = 'none';
        };
        reader.readAsDataURL(file);
    }
}

// Lưu sản phẩm: Thêm mới luôn có lượt bán = 0 theo yêu cầu!
function handleSaveProductMock(e) {
    if (e) e.preventDefault();
    const editingId = document.getElementById('editingProductId').value;
    const name = document.getElementById('pInputName').value.trim();
    const cat = document.getElementById('pSelectCat').value;
    const capacity = document.getElementById('pSelectCapacity').value;
    const price = parseInt(document.getElementById('pInputPrice').value) || 200000;
    const previewImg = document.getElementById('previewImgTag');
    const imgSrc = (previewImg && previewImg.style.display !== 'none' && previewImg.src) ? previewImg.src : 'images/binh-nuoc-hoa-tiet-5.png';

    if (!name) {
        showToast('Vui lòng nhập tên sản phẩm!', 'warning');
        return;
    }

    if (editingId) {
        // Cập nhật sản phẩm cũ
        const prod = ADMIN_PRODUCTS.find(p => p.id === editingId);
        if (prod) {
            prod.name = name;
            prod.category = cat;
            prod.capacity = capacity;
            prod.price = price;
            if (imgSrc) prod.image = imgSrc;

            // Đồng bộ sang PRODUCTS_DATA
            if (typeof PRODUCTS_DATA !== 'undefined') {
                const pUser = PRODUCTS_DATA.find(p => p.id === editingId);
                if (pUser) {
                    pUser.name = name;
                    pUser.category = cat;
                    pUser.capacity = capacity;
                    pUser.price = price;
                    pUser.image = imgSrc;
                }
            }
        }
        showToast(`Đã cập nhật thông tin sản phẩm [${editingId}] thành công!`, 'success', 'Cập nhật sản phẩm');
    } else {
        // Thêm sản phẩm mới: LƯỢT BÁN = 0 THEO YÊU CẦU NGƯỜI DÙNG!
        const newId = 'SP' + String(ADMIN_PRODUCTS.length + 1).padStart(3, '0');
        const newProd = {
            id: newId,
            name: name,
            category: cat,
            capacity: capacity,
            price: price,
            oldPrice: Math.round(price * 1.25),
            rating: 5.0,
            sold: 0, // Mặc định lượt bán = 0
            status: 'active',
            image: imgSrc,
            description: 'Sản phẩm mới chính hãng Mr.Huy giữ nhiệt nóng lạnh vượt trội.'
        };
        ADMIN_PRODUCTS.unshift(newProd);

        // Đồng bộ sang PRODUCTS_DATA người dùng
        if (typeof PRODUCTS_DATA !== 'undefined') {
            PRODUCTS_DATA.unshift(newProd);
        }
        showToast(`Đã thêm sản phẩm mới [${newId}] ${name} với lượt bán = 0!`, 'success', 'Thêm sản phẩm thành công');
    }

    closeAdminModal('productFormModal');
    handleAdminProductSearch();
    updateDashboardMetrics();
}

// ========================================================
// 6. QUẢN LÝ NGƯỜI DÙNG (THÊM / SỬA / KHÓA & BỎ KHÓA)
// ========================================================

function renderAdminUsers() {
    const tbody = document.getElementById('adminUsersTbody');
    if (!tbody) return;

    tbody.innerHTML = ADMIN_USERS.map(u => {
        const isLocked = u.status === 'locked';
        const statusBadge = isLocked
            ? `<span class="badge-status badge-locked"><i class="fa-solid fa-lock"></i> Đã bị khóa</span>`
            : `<span class="badge-status badge-active"><i class="fa-solid fa-check"></i> Hoạt động</span>`;

        let actionHtml = '';
        if (u.role === 'ADMIN') {
            actionHtml = `<span style="font-size: 11px; color: #64748b;">(Quản trị gốc)</span>`;
        } else {
            // Nút Khóa / Mở Khóa linh hoạt: nếu khóa được thì mở khóa được!
            const lockBtn = isLocked
                ? `<button class="btn-admin btn-admin-success" style="padding: 4px 8px; font-size: 12px;" onclick="toggleLockUser('${u.id}')"><i class="fa-solid fa-lock-open"></i> Mở Khóa</button>`
                : `<button class="btn-admin btn-admin-danger" style="padding: 4px 8px; font-size: 12px;" onclick="toggleLockUser('${u.id}')"><i class="fa-solid fa-lock"></i> Khóa</button>`;

            actionHtml = `
                <div style="display: flex; gap: 6px;">
                    <button class="btn-admin btn-admin-outline" style="padding: 4px 8px; font-size: 12px;" onclick="openEditUserModal('${u.id}')"><i class="fa-solid fa-user-pen"></i> Sửa</button>
                    ${lockBtn}
                </div>
            `;
        }

        return `
            <tr id="userRow_${u.id}">
                <td><strong>${u.id}</strong></td>
                <td><strong>${u.username}</strong></td>
                <td>${u.fullName}</td>
                <td>${u.email}</td>
                <td>${u.phone}</td>
                <td>${u.address}</td>
                <td><span style="font-weight: 700; color: ${u.role === 'ADMIN' ? '#dc2626' : '#2563eb'};">${u.role}</span></td>
                <td>${statusBadge}</td>
                <td>${actionHtml}</td>
            </tr>
        `;
    }).join('');
}

// Bỏ khóa / Khóa tài khoản
function toggleLockUser(uId) {
    const user = ADMIN_USERS.find(u => u.id === uId);
    if (!user) return;

    if (user.status === 'locked') {
        user.status = 'active';
        showToast(`Đã BỎ KHÓA (MỞ KHÓA) tài khoản "${user.username}" (${user.fullName}) thành công! Tài khoản này có thể đăng nhập bình thường.`, 'success', 'Quản lý người dùng');
    } else {
        user.status = 'locked';
        showToast(`Đã KHÓA tài khoản "${user.username}" (${user.fullName})! Tài khoản này sẽ bị chặn đăng nhập và thanh toán trên website.`, 'warning', 'Quản lý người dùng');
    }
    renderAdminUsers();
}

function openAddUserModal() {
    document.getElementById('uModalTitle').textContent = 'Thêm Người Dùng Mới';
    document.getElementById('editingUserId').value = '';
    document.getElementById('uInputUsername').value = '';
    document.getElementById('uInputFullName').value = '';
    document.getElementById('uInputPhone').value = '';
    document.getElementById('uInputEmail').value = '';
    document.getElementById('uInputAddress').value = '';
    openAdminModal('userFormModal');
}

function openEditUserModal(uId) {
    const user = ADMIN_USERS.find(u => u.id === uId);
    if (!user) return;

    document.getElementById('uModalTitle').textContent = `Sửa Tài Khoản: ${user.username}`;
    document.getElementById('editingUserId').value = user.id;
    document.getElementById('uInputUsername').value = user.username;
    document.getElementById('uInputFullName').value = user.fullName;
    document.getElementById('uInputPhone').value = user.phone;
    document.getElementById('uInputEmail').value = user.email;
    document.getElementById('uInputAddress').value = user.address;
    openAdminModal('userFormModal');
}

function handleSaveUserMock(e) {
    if (e) e.preventDefault();
    const editingId = document.getElementById('editingUserId').value;
    const username = document.getElementById('uInputUsername').value.trim();
    const fullName = document.getElementById('uInputFullName').value.trim();
    const phone = document.getElementById('uInputPhone').value.trim();
    const email = document.getElementById('uInputEmail').value.trim();
    const address = document.getElementById('uInputAddress').value.trim();

    if (!username || !fullName) {
        showToast('Vui lòng nhập tên đăng nhập và họ tên!', 'warning');
        return;
    }

    if (editingId) {
        const user = ADMIN_USERS.find(u => u.id === editingId);
        if (user) {
            user.fullName = fullName;
            user.phone = phone;
            user.email = email;
            user.address = address;
        }
        showToast(`Đã cập nhật thông tin người dùng [${editingId}] thành công!`, 'success', 'Cập nhật tài khoản');
    } else {
        const newId = 'U' + String(ADMIN_USERS.length + 1).padStart(3, '0');
        ADMIN_USERS.push({
            id: newId,
            username: username,
            fullName: fullName,
            phone: phone || '0900000000',
            email: email || `${username}@gmail.com`,
            address: address || 'Việt Nam',
            role: 'USER',
            status: 'active'
        });
        showToast(`Đã thêm tài khoản mới [${newId}] "${username}" với trạng thái hoạt động!`, 'success', 'Thêm người dùng mới');
    }

    closeAdminModal('userFormModal');
    renderAdminUsers();
    updateDashboardMetrics();
}

// ========================================================
// 7. QUẢN LÝ ĐƠN HÀNG: CẬP NHẬT TRẠNG THÁI ĐƠN HÀNG
//    (Chưa xác nhận -> Đã xác nhận -> Đã giao thành công / Hủy đơn)
// ========================================================

function getOrderStatusBadge(status) {
    const map = {
        'Chưa xác nhận': '<span class="badge-status" style="background:#fef3c7; color:#92400e;"><i class="fa-solid fa-clock"></i> Chưa xác nhận</span>',
        'Đã xác nhận': '<span class="badge-status" style="background:#e0f2fe; color:#0369a1;"><i class="fa-solid fa-check"></i> Đã xác nhận</span>',
        'Đã giao thành công': '<span class="badge-status" style="background:#dcfce7; color:#166534;"><i class="fa-solid fa-circle-check"></i> Đã giao thành công</span>',
        'Đã giao (thành công)': '<span class="badge-status" style="background:#dcfce7; color:#166534;"><i class="fa-solid fa-circle-check"></i> Đã giao thành công</span>',
        'Đã hủy đơn': '<span class="badge-status" style="background:#fee2e2; color:#991b1b;"><i class="fa-solid fa-ban"></i> Đã hủy đơn</span>',
        'Đã hủy': '<span class="badge-status" style="background:#fee2e2; color:#991b1b;"><i class="fa-solid fa-ban"></i> Đã hủy đơn</span>'
    };
    return map[status] || `<span class="badge-status">${status}</span>`;
}

// Sinh giao diện cập nhật tình trạng đơn hàng:
// - Chưa xác nhận -> Nút "Xác nhận đơn" & Nút "Hủy đơn"
// - Đã xác nhận -> Nút "Giao thành công" & Nút "Hủy đơn" (KHÔNG CÓ NÚT QUAY VỀ CHƯA XÁC NHẬN)
// - Đã giao thành công / Đã hủy đơn -> Khóa hoàn tất, không cho phép cập nhật ngược!
function renderOrderOneWayAction(order) {
    if (order.status === 'Chưa xác nhận') {
        return `
            <div style="display: flex; gap: 4px;">
                <button class="btn-admin btn-admin-primary" style="padding: 4px 8px; font-size: 11px; white-space: nowrap;" onclick="advanceOrderMock('${order.id}', 'Đã xác nhận')">
                    <i class="fa-solid fa-check"></i> Xác nhận đơn
                </button>
                <button class="btn-admin btn-admin-danger" style="padding: 4px 8px; font-size: 11px; white-space: nowrap;" onclick="advanceOrderMock('${order.id}', 'Đã hủy đơn')">
                    <i class="fa-solid fa-xmark"></i> Hủy
                </button>
            </div>
        `;
    } else if (order.status === 'Đã xác nhận') {
        return `
            <div style="display: flex; gap: 4px;">
                <button class="btn-admin btn-admin-success" style="padding: 4px 8px; font-size: 11px; white-space: nowrap;" onclick="advanceOrderMock('${order.id}', 'Đã giao thành công')">
                    <i class="fa-solid fa-circle-check"></i> Giao thành công
                </button>
                <button class="btn-admin btn-admin-danger" style="padding: 4px 8px; font-size: 11px; white-space: nowrap;" onclick="advanceOrderMock('${order.id}', 'Đã hủy đơn')">
                    <i class="fa-solid fa-xmark"></i> Hủy
                </button>
            </div>
        `;
    } else if (order.status === 'Đã giao thành công' || order.status === 'Đã giao (thành công)') {
        return `<span style="font-size: 11px; color: #166534; font-weight: 600;"><i class="fa-solid fa-circle-check"></i> Đã hoàn tất</span>`;
    } else if (order.status === 'Đã hủy đơn' || order.status === 'Đã hủy') {
        return `<span style="font-size: 11px; color: #991b1b; font-weight: 600;"><i class="fa-solid fa-ban"></i> Đã hủy bỏ</span>`;
    }
    return '';
}

// Cập nhật trạng thái đơn hàng
function advanceOrderMock(orderId, targetStatus) {
    const order = ADMIN_ORDERS.find(o => o.id === orderId);
    if (!order) return;

    if (order.status === 'Đã giao thành công' || order.status === 'Đã giao (thành công)' || order.status === 'Đã hủy đơn' || order.status === 'Đã hủy') {
        showToast(`Đơn hàng #${orderId} hiện tại đã ở trạng thái kết thúc [${order.status}].`, 'info', 'Thông báo đơn hàng');
        return;
    }

    if (targetStatus === 'Đã xác nhận') {
        showToast(`Đơn hàng #${orderId} đã chuyển sang [ĐÃ XÁC NHẬN]!`, 'success', 'Cập nhật đơn hàng');
        order.status = 'Đã xác nhận';
    } else if (targetStatus === 'Đã giao thành công') {
        showToast(`Đơn hàng #${orderId} đã chuyển sang [ĐÃ GIAO THÀNH CÔNG]!`, 'success', 'Cập nhật đơn hàng');
        order.status = 'Đã giao thành công';
    } else if (targetStatus === 'Đã hủy đơn') {
        showToast(`Đơn hàng #${orderId} đã chuyển sang [ĐÃ HỦY ĐƠN]!`, 'warning', 'Cập nhật đơn hàng');
        order.status = 'Đã hủy đơn';
    }

    filterAdminOrders();
    // Cập nhật thống kê nếu đang ở tab thống kê
    runCustomerStatistics();
}

// Lọc đơn hàng: Lọc nghiêm ngặt theo mốc thời gian thực tế khớp với ngày đặt!
function filterAdminOrders() {
    const tbody = document.getElementById('adminOrdersTbody');
    if (!tbody) return;

    const statusFilter = document.getElementById('orderFilterStatus')?.value || '';
    const fromDate = document.getElementById('orderFilterFromDate')?.value || '';
    const toDate = document.getElementById('orderFilterToDate')?.value || '';
    const cityFilter = document.getElementById('orderFilterCity')?.value || '';

    // Tiến hành lọc đơn hàng
    const filtered = ADMIN_ORDERS.filter(order => {
        if (statusFilter) {
            if (statusFilter === 'Đã giao thành công') {
                if (order.status !== 'Đã giao thành công' && order.status !== 'Đã giao (thành công)') return false;
            } else if (statusFilter === 'Đã hủy đơn') {
                if (order.status !== 'Đã hủy đơn' && order.status !== 'Đã hủy') return false;
            } else if (order.status !== statusFilter) {
                return false;
            }
        }
        if (cityFilter && order.city !== cityFilter) return false;
        // Kiểm tra khớp thời gian: Nếu chọn mốc thời gian trước ngày đặt thì đơn hàng đó không xuất hiện
        if (fromDate && order.date < fromDate) return false;
        if (toDate && order.date > toDate) return false;
        return true;
    });

    if (filtered.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" style="text-align: center; padding: 30px; color: #94a3b8;">
                    <i class="fa-solid fa-folder-open" style="font-size: 32px; display: block; margin-bottom: 8px;"></i>
                    Không tìm thấy đơn hàng nào trong khoảng thời gian hoặc điều kiện lọc này.
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = filtered.map(order => {
        return `
            <tr>
                <td><strong>#${order.id}</strong></td>
                <td>
                    <strong>${order.customerName}</strong>
                    <div style="font-size: 11px; color: #64748b;">${order.phone}</div>
                </td>
                <td>
                    <div style="font-size: 13px;">${order.district || ''}, ${order.city}</div>
                    <div style="font-size: 11px; color: #64748b;">${order.address}</div>
                </td>
                <td><strong style="color: #1e3a8a;">${order.date}</strong></td>
                <td style="font-weight: 700; color: #dc2626;">${formatCurrencyAdmin(order.totalAmount)}</td>
                <td>${getOrderStatusBadge(order.status)}</td>
                <td>${renderOrderOneWayAction(order)}</td>
                <td>
                    <button class="btn-admin btn-admin-outline" style="padding: 4px 8px; font-size: 11px;" onclick="viewOrderDetailMock('${order.id}')">
                        <i class="fa-solid fa-eye"></i> Xem
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

function resetOrderFilters() {
    const sEl = document.getElementById('orderFilterStatus');
    const fEl = document.getElementById('orderFilterFromDate');
    const tEl = document.getElementById('orderFilterToDate');
    const cEl = document.getElementById('orderFilterCity');

    if (sEl) sEl.value = '';
    if (fEl) fEl.value = '2025-01-01';
    if (tEl) tEl.value = '2025-12-31';
    if (cEl) cEl.value = '';

    filterAdminOrders();
}

// ========================================================
// 8. BÁO CÁO THỐNG KÊ TOP 5 KHÁCH HÀNG (CÓ CỘT THỜI GIAN ĐẶT HÀNG)
// ========================================================

function runCustomerStatistics() {
    const tbody = document.getElementById('adminStatsTbody');
    if (!tbody) return;

    const startDate = document.getElementById('statsStartDate')?.value || '2025-01-01';
    const endDate = document.getElementById('statsEndDate')?.value || '2025-12-31';

    // Cập nhật text tóm tắt khoảng thời gian
    const summaryEl = document.getElementById('statsPeriodSummary');
    if (summaryEl) {
        summaryEl.innerHTML = `<i class="fa-solid fa-chart-line"></i> Bảng thống kê Top 5 khách hàng chi tiêu lớn nhất từ <strong>${startDate}</strong> đến <strong>${endDate}</strong>:`;
    }

    // Lấy danh sách khách hàng (role: USER)
    const users = ADMIN_USERS.filter(u => u.role === 'USER');

    // Tính toán cho từng khách hàng các đơn nằm trong khoảng thời gian [startDate, endDate]
    const customerStats = users.map(user => {
        const userOrders = ADMIN_ORDERS.filter(order => {
            // Khớp với người dùng
            const matchUser = (order.userId === user.id) || (order.customerName === user.fullName);
            if (!matchUser) return false;
            // Khớp với khoảng thời gian: Không nằm trong khoảng thì không tính!
            if (startDate && order.date < startDate) return false;
            if (endDate && order.date > endDate) return false;
            return true;
        });

        const totalSpent = userOrders.reduce((sum, o) => sum + o.totalAmount, 0);
        const orderDates = userOrders.map(o => o.date);

        return {
            user: user,
            orderCount: userOrders.length,
            orders: userOrders,
            orderDates: orderDates,
            totalSpent: totalSpent
        };
    });

    // Sắp xếp giảm dần theo tổng tiền mua trong kỳ
    customerStats.sort((a, b) => b.totalSpent - a.totalSpent);

    // Lấy Top 5
    const top5 = customerStats.slice(0, 5);

    const rankBadges = [
        '<span style="font-weight: 800; font-size: 14px; color: #f59e0b;">🥇 Hạng 1</span>',
        '<span style="font-weight: 800; font-size: 14px; color: #64748b;">🥈 Hạng 2</span>',
        '<span style="font-weight: 800; font-size: 14px; color: #b45309;">🥉 Hạng 3</span>',
        '<span style="font-weight: 800; font-size: 14px; color: #334155;">Hạng 4</span>',
        '<span style="font-weight: 800; font-size: 14px; color: #334155;">Hạng 5</span>'
    ];

    tbody.innerHTML = top5.map((item, idx) => {
        // Cột thời gian đặt hàng: Liệt kê các ngày đặt hàng của khách trong kỳ
        let datesHtml = '';
        if (item.orderDates.length > 0) {
            datesHtml = item.orderDates.map(d => `<span style="display: inline-block; background: #e0f2fe; color: #0369a1; padding: 2px 6px; border-radius: 4px; font-size: 11px; margin: 2px 3px; font-weight: 600;">${d}</span>`).join('');
        } else {
            datesHtml = '<span style="color: #94a3b8; font-size: 12px; font-style: italic;">Không có đơn trong kỳ</span>';
        }

        // Danh sách link chi tiết từng đơn
        let orderLinksHtml = '';
        if (item.orders.length > 0) {
            orderLinksHtml = item.orders.map(o => {
                return `
                    <span style="display: inline-block; margin: 2px 4px; background: #f1f5f9; padding: 2px 8px; border-radius: 4px; font-size: 12px;">
                        <a href="javascript:void(0)" onclick="viewOrderDetailMock('${o.id}')" style="color: #2563eb; font-weight: 700; text-decoration: underline;">#${o.id}</a> (${formatCurrencyAdmin(o.totalAmount)})
                    </span>
                `;
            }).join('');
        } else {
            orderLinksHtml = '<span style="color: #94a3b8; font-size: 12px;">Chưa phát sinh đơn trong kỳ</span>';
        }

        return `
            <tr>
                <td>${rankBadges[idx] || `Hạng ${idx + 1}`}</td>
                <td>
                    <strong style="font-size: 14px; color: #0f172a;">${item.user.fullName}</strong>
                    <div style="font-size: 11px; color: #64748b;">Mã KH: ${item.user.id} (@${item.user.username})</div>
                </td>
                <td>
                    <div>${item.user.phone}</div>
                    <div style="font-size: 11px; color: #64748b;">${item.user.email}</div>
                </td>
                <td style="text-align: center;">
                    <span style="background: ${item.orderCount > 0 ? '#f0fdf4' : '#f1f5f9'}; color: ${item.orderCount > 0 ? '#166534' : '#64748b'}; padding: 4px 10px; border-radius: 12px; font-weight: 700;">
                        ${item.orderCount} đơn
                    </span>
                </td>
                <td>${datesHtml}</td>
                <td>${orderLinksHtml}</td>
                <td style="font-size: 16px; font-weight: 800; color: #dc2626;">${formatCurrencyAdmin(item.totalSpent)}</td>
            </tr>
        `;
    }).join('');
}

function resetCustomerStatistics() {
    const sEl = document.getElementById('statsStartDate');
    const eEl = document.getElementById('statsEndDate');
    if (sEl) sEl.value = '2025-01-01';
    if (eEl) eEl.value = '2025-12-31';
    runCustomerStatistics();
}

// ========================================================
// 9. XEM CHI TIẾT ĐƠN HÀNG TRÊN MODAL ADMIN
// ========================================================

function viewOrderDetailMock(orderId) {
    const order = ADMIN_ORDERS.find(o => o.id === orderId) || {
        id: orderId,
        customerName: 'Nguyễn Văn An',
        phone: '0912345678',
        email: 'nguyenvana@gmail.com',
        date: '2025-03-01',
        address: '123 Nguyễn Huệ, Quận 1, TP.HCM',
        district: 'Quận 1',
        city: 'TP. Hồ Chí Minh',
        status: 'Đã xác nhận',
        totalAmount: 189000
    };

    const titleEl = document.getElementById('adminOrderDetailTitle');
    if (titleEl) titleEl.textContent = `Chi Tiết Đơn Hàng #${order.id}`;

    const container = document.getElementById('adminOrderDetailDynamicContent');
    if (container) {
        // Hiển thị chi tiết đơn hàng
        container.innerHTML = `
            <div style="background: #f8fafc; padding: 12px; border-radius: 6px; margin-bottom: 14px; font-size: 13px;">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                    <div>Khách hàng: <strong>${order.customerName}</strong></div>
                    <div>Số điện thoại: <strong>${order.phone}</strong></div>
                    <div>Email: <strong>${order.email}</strong></div>
                    <div>Ngày đặt: <strong style="color: #1e3a8a;">${order.date}</strong></div>
                    <div style="grid-column: 1 / -1;">Địa chỉ giao: <strong>${order.address}</strong></div>
                    <div>Khu vực: <strong>${order.district || ''}, ${order.city}</strong></div>
                    <div>Tình trạng: <strong>${order.status}</strong></div>
                </div>
            </div>
            <h4 style="font-size: 13px; font-weight: 700; margin-bottom: 8px;">MẶT HÀNG TRONG ĐƠN:</h4>
            <div class="table-responsive">
                <table class="admin-table">
                    <thead>
                        <tr>
                            <th>Hình Ảnh</th>
                            <th>Tên Sản Phẩm</th>
                            <th>Phân Loại</th>
                            <th>Đơn Giá</th>
                            <th>Số Lượng</th>
                            <th>Thành Tiền</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${(order.items && order.items.length > 0) ? order.items.map(it => {
                            const itemImg = it.image || 'img/ly-giu-nhiet-1.png';
                            const itemTotal = (it.price || order.totalAmount) * (it.qty || 1);
                            return `
                                <tr>
                                    <td>
                                        <img src="${itemImg}" alt="${it.name}" style="width: 48px; height: 48px; object-fit: cover; border-radius: 6px; border: 1px solid #e2e8f0; vertical-align: middle;">
                                    </td>
                                    <td>
                                        <strong style="color: #0f172a; font-size: 13px;">${it.name}</strong>
                                        <div style="font-size: 11px; color: #64748b;">Chất liệu Inox giữ nhiệt an toàn sức khỏe</div>
                                    </td>
                                    <td><span style="background: #e0f2fe; color: #0369a1; padding: 2px 8px; border-radius: 4px; font-size: 12px; font-weight: 600;">${it.cat || 'Bình & Ly'}</span></td>
                                    <td>${formatCurrencyAdmin(it.price || order.totalAmount)}</td>
                                    <td style="text-align: center;"><strong>${it.qty || 1}</strong></td>
                                    <td style="font-weight: 700; color: #dc2626;">${formatCurrencyAdmin(itemTotal)}</td>
                                </tr>
                            `;
                        }).join('') : `
                            <tr>
                                <td>
                                    <img src="img/ly-giu-nhiet-1.png" alt="Sản phẩm" style="width: 48px; height: 48px; object-fit: cover; border-radius: 6px; border: 1px solid #e2e8f0; vertical-align: middle;">
                                </td>
                                <td>
                                    <strong style="color: #0f172a; font-size: 13px;">Ly Giữ Nhiệt Inox 304 Mr.Huy</strong>
                                    <div style="font-size: 11px; color: #64748b;">Chất liệu Inox giữ nhiệt an toàn</div>
                                </td>
                                <td><span style="background: #e0f2fe; color: #0369a1; padding: 2px 8px; border-radius: 4px; font-size: 12px; font-weight: 600;">Ly giữ nhiệt</span></td>
                                <td>${formatCurrencyAdmin(order.totalAmount)}</td>
                                <td style="text-align: center;"><strong>1</strong></td>
                                <td style="font-weight: 700; color: #dc2626;">${formatCurrencyAdmin(order.totalAmount)}</td>
                            </tr>
                        `}
                    </tbody>
                </table>
            </div>
            <div style="text-align: right; margin-top: 14px; font-size: 17px; font-weight: 800; color: #dc2626;">
                TỔNG TIỀN ĐƠN: ${formatCurrencyAdmin(order.totalAmount)}
            </div>
        `;
    }

    openAdminModal('orderDetailAdminModal');
}

// Modal helpers
function openAdminModal(id) {
    const el = document.getElementById(id);
    if (el) el.classList.add('active');
}

function closeAdminModal(id) {
    const el = document.getElementById(id);
    if (el) el.classList.remove('active');
}

// Cập nhật số liệu hiển thị trên Dashboard tổng quan
function updateDashboardMetrics() {
    const pEl = document.getElementById('dashProductCount');
    if (pEl) pEl.textContent = `${ADMIN_PRODUCTS.length} sản phẩm`;

    const uEl = document.getElementById('dashUserCount');
    if (uEl) uEl.textContent = `${ADMIN_USERS.length} khách`;

    const oEl = document.getElementById('dashTotalOrders');
    if (oEl) oEl.textContent = `${ADMIN_ORDERS.length} đơn`;

    const rEl = document.getElementById('dashTotalRevenue');
    if (rEl) {
        const total = ADMIN_ORDERS.reduce((sum, o) => sum + o.totalAmount, 0);
        rEl.textContent = formatCurrencyAdmin(total);
    }
}

// ========================================================
// 10. TỰ ĐỘNG KHỞI TẠO DỮ LIỆU KHI TẢI TRANG ADMIN
// ========================================================

document.addEventListener('DOMContentLoaded', () => {
    initAdminProducts();
    renderAdminProducts();
    renderAdminUsers();
    filterAdminOrders();
    runCustomerStatistics();
    updateDashboardMetrics();
});