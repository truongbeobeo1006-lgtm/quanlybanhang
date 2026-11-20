// ========================================================
// APP.JS - PURE GIAO DIỆN FRONTEND (UI/UX) - MR.HUY
// KHÔNG CƠ SỞ DỮ LIỆU, KHÔNG BACKEND, KHÔNG LOCALSTORAGE
// Phục vụ chấm thi đầy đủ các tiêu chí:
// 1. Tìm kiếm cơ bản theo tên sản phẩm (tìm tương đối)
// 2. Tìm kiếm nâng cao (kết hợp nhiều điều kiện: tên, phân loại, khoảng giá)
// 3. Hiển thị sản phẩm theo phân loại và kết quả tìm kiếm dạng phân trang
// 4. Hiển thị và lưu đơn hàng khi kết thúc giao dịch
// 5. Xem lại lịch sử mua hàng của người mua (được nhóm theo đơn hàng)
// 6. Giao diện quên mật khẩu mô phỏng nhập tên và mật khẩu mới
// 7. Bấm vào bất kỳ sản phẩm nào cũng đều hướng về 1 sản phẩm duy nhất
// 8. Chèn hình ảnh thực tế theo từng chủ đề bắt mắt
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

// --------------------------------------------------------
// BỘ DỮ LIỆU SẢN PHẨM MẪU TRONG BỘ NHỚ RAM (40 SẢN PHẨM)
// Mỗi sản phẩm có ảnh Unsplash chất lượng cao đúng chủ đề
// --------------------------------------------------------
const PRODUCTS_DATA = [
    // --- 1. Phân loại: Ly giữ nhiệt (ly-giu-nhiet - 8 sản phẩm) ---
    {
        id: 'SP001',
        name: 'Cốc Giữ Nhiệt Inox 304 Iced Americano 600ml Kèm Ống Hút',
        category: 'ly-giu-nhiet',
        categoryName: 'Ly giữ nhiệt',
        price: 189000,
        oldPrice: 250000,
        discount: '-26%',
        capacity: '600ml',
        location: 'TP. Hồ Chí Minh',
        rating: 4.9,
        sold: 1250,
        image: 'img/ly-giu-nhiet-1.png',
        badge: 'Yêu thích',
        tags: ['Iced Americano', 'Inox 304'],
        description: 'Ruột inox 304 an toàn thực phẩm. Nắp trong suốt chống tràn tích hợp lỗ cắm ống hút cong, giữ lạnh đá viên liên tục 18h không đọng sương.'
    },
    {
        id: 'SP002',
        name: 'Ly Giữ Nhiệt Cà Phê Inox COFFEE Viền Kim Loại 500ml',
        category: 'ly-giu-nhiet',
        categoryName: 'Ly giữ nhiệt',
        price: 149000,
        oldPrice: 199000,
        discount: '-25%',
        capacity: '500ml',
        location: 'Hà Nội',
        rating: 4.8,
        sold: 980,
        image: 'img/ly-giu-nhiet-5.jpg',
        badge: 'Yêu thích',
        tags: ['Inox 304', 'Cà phê nóng/lạnh'],
        description: 'Chuyên dụng thưởng thức cà phê đá hoặc nóng, giữ trọn hương vị nồng nàn. Nắp bật tiện lợi, miệng ly viền inox sáng bóng.'
    },
    {
        id: 'SP003',
        name: 'Ly Giữ Nhiệt Chân Không 2 Lớp Inox 304 Đa Sắc Màu 750ml',
        category: 'ly-giu-nhiet',
        categoryName: 'Ly giữ nhiệt',
        price: 179000,
        oldPrice: 230000,
        discount: '-22%',
        capacity: '750ml',
        location: 'Đà Nẵng',
        rating: 4.7,
        sold: 620,
        image: 'img/ly-giu-nhiet-3.png',
        badge: '',
        tags: ['Chân không 2 lớp', 'Đa sắc màu'],
        description: 'Công nghệ cách nhiệt chân không kép giữ nóng lạnh cả ngày, 4 màu sắc thời thượng (đen, xanh dương, đỏ mận, cam) đáy Inox chống trượt.'
    },
    {
        id: 'SP004',
        name: 'Bình Giữ Nhiệt Matsu Inox 304 Lọc Trà Có Quai Xách 1000ml',
        category: 'ly-giu-nhiet',
        categoryName: 'Ly giữ nhiệt',
        price: 135000,
        oldPrice: 195000,
        discount: '-30%',
        capacity: '1000ml',
        location: 'Hà Nội',
        rating: 4.7,
        sold: 920,
        image: 'img/ly-giu-nhiet-4.png',
        badge: 'Yêu thích',
        tags: ['Matsu Inox 304', 'Quai xách gấp'],
        description: 'Dung tích 1000ml hàng chuẩn cao cấp, ruột inox 304 dễ vệ sinh, quai xách gấp gọn trợ lực thuận tiện mang đi học, đi làm hoặc du lịch.'
    },
    {
        id: 'SP005',
        name: 'Ly Giữ Nhiệt GELU Sang Trọng Đai Da Nâu Cao Cấp 500ml',
        category: 'ly-giu-nhiet',
        categoryName: 'Ly giữ nhiệt',
        price: 185000,
        oldPrice: 245000,
        discount: '-24%',
        capacity: '500ml',
        location: 'Hà Nội',
        rating: 4.8,
        sold: 1050,
        image: 'img/ly-giu-nhiet-2.png',
        badge: 'Mới',
        tags: ['Đai da cao cấp', 'GELU Edition'],
        description: 'Thiết kế sang trọng đẳng cấp bọc đai da nâu dập nổi logo GELU, nắp bật trợ lực tích hợp quai xách gập kim loại tinh tế.'
    },
    {
        id: 'SP006',
        name: 'Ly Giữ Nhiệt Có Quai Cầm Inox 304 HOT&COOL 500ml',
        category: 'ly-giu-nhiet',
        categoryName: 'Ly giữ nhiệt',
        price: 165000,
        oldPrice: 215000,
        discount: '-23%',
        capacity: '500ml',
        location: 'TP. Hồ Chí Minh',
        rating: 4.8,
        sold: 890,
        image: 'img/ly-giu-nhiet-6.jpg',
        badge: 'Bán chạy',
        tags: ['HOT&COOL', 'Giữ nhiệt 12H'],
        description: 'Dòng ly giữ nhiệt Hot&Cool có quai cầm công thái học tiện lợi, ruột Inox 304 giữ nóng/lạnh 12h, 4 màu sắc tinh tế (trắng, vàng đồng, đen, đỏ).'
    },
    {
        id: 'SP007',
        name: 'Cốc Giữ Nhiệt Doanh Nhân ONEISALL Nắp Bọc Da Cao Cấp 350ml',
        category: 'ly-giu-nhiet',
        categoryName: 'Ly giữ nhiệt',
        price: 195000,
        oldPrice: 260000,
        discount: '-25%',
        capacity: '350ml',
        location: 'TP. Hồ Chí Minh',
        rating: 4.9,
        sold: 720,
        image: 'img/ly-giu-nhiet-7.jpg',
        badge: 'VIP',
        tags: ['ONEISALL', 'Nắp bọc da VIP'],
        description: 'Thương hiệu Oneisall For Life phong cách doanh nhân sang trọng, thân kim loại mạ vàng sâm banh/đen mờ, nắp viền da dập vân đẳng cấp.'
    },
    {
        id: 'SP008',
        name: 'Ly Giữ Nhiệt LocknLock Nắp Gạt Xoay 3 Chế Độ Thông Minh 550ml',
        category: 'ly-giu-nhiet',
        categoryName: 'Ly giữ nhiệt',
        price: 155000,
        oldPrice: 205000,
        discount: '-24%',
        capacity: '550ml',
        location: 'Đà Nẵng',
        rating: 4.7,
        sold: 530,
        image: 'img/ly-giu-nhiet-8.png',
        badge: 'Yêu thích',
        tags: ['LocknLock Xoay 3in1', 'Chống rò rỉ'],
        description: 'Công nghệ nắp gạt xoay đa năng: chế độ cắm ống hút khi lái xe, chế độ uống trực tiếp tại văn phòng và gạt xoay đóng kín 100% khi di chuyển.'
    },

    // --- 2. Phân loại: Bình thể thao (binh-the-thao - 8 sản phẩm) ---
    {
        id: 'SP009',
        name: 'Bình Nước Giữ Nhiệt Thể Thao Ngoài Trời Pickleball & Tennis 1000ml',
        category: 'binh-the-thao',
        categoryName: 'Bình thể thao',
        price: 215000,
        oldPrice: 355000,
        discount: '-40%',
        capacity: '1000ml',
        location: 'Hà Nội',
        rating: 4.8,
        sold: 856,
        image: 'img/binh-the-thao-1.jpg',
        badge: 'Yêu thích',
        tags: ['In UV 5D', 'Inox 304', 'Giữ nhiệt 24h'],
        description: 'Chuyên dụng thể thao ngoài trời (Pickleball, Tennis, Cầu lông). In màu UV 5D sắc nét, ruột Inox 304 tráng bạc giữ lạnh đá viên 24h.'
    },
    {
        id: 'SP010',
        name: 'Bình Giữ Nhiệt Thể Thao TYESO Thân Ngấn Chống Trượt 1200ml',
        category: 'binh-the-thao',
        categoryName: 'Bình thể thao',
        price: 259000,
        oldPrice: 340000,
        discount: '-24%',
        capacity: '1200ml',
        location: 'TP. Hồ Chí Minh',
        rating: 4.9,
        sold: 1100,
        image: 'img/binh-the-thao-3.jpg',
        badge: 'Bán chạy',
        tags: ['TYESO Chính Hãng', '1200ml Khủng'],
        description: 'Thương hiệu TYESO danh tiếng, thân dập ngấn chống trơn trượt khi ra mồ hôi tay, nắp inox có quai gập xách tay tiện lợi.'
    },
    {
        id: 'SP011',
        name: 'Bình Nước Thể Thao GOGLET Nắp Bật Vòi Hút Ombre 1000ml',
        category: 'binh-the-thao',
        categoryName: 'Bình thể thao',
        price: 229000,
        oldPrice: 290000,
        discount: '-21%',
        capacity: '1000ml',
        location: 'Đà Nẵng',
        rating: 4.8,
        sold: 430,
        image: 'img/binh-the-thao-2.jpg',
        badge: 'Yêu thích',
        tags: ['GOGLET Sport', 'Giữ lạnh 24h'],
        description: 'Phối màu Ombre thể thao hiện đại, nắp bật vòi hút một chạm tiện lợi bổ sung nước nhanh khi đang tập luyện thể hình, chạy bộ.'
    },
    {
        id: 'SP012',
        name: 'Bình Thể Thao TYESO Vòi Hút Chống Tràn Kèm Quai Xách 750ml',
        category: 'binh-the-thao',
        categoryName: 'Bình thể thao',
        price: 239000,
        oldPrice: 320000,
        discount: '-25%',
        capacity: '750ml',
        location: 'TP. Hồ Chí Minh',
        rating: 4.9,
        sold: 870,
        image: 'img/binh-the-thao-5.png',
        badge: 'Mới',
        tags: ['Leak Proof', '24h Keep Cold'],
        description: 'Nắp khóa chốt đôi chống rò rỉ nước tuyệt đối (Leak Proof), tích hợp quai xách công thái học và vòi hút silicon thực phẩm.'
    },
    {
        id: 'SP013',
        name: 'Ly Giữ Nhiệt Thể Thao Believe Đai Cao Su Chống Trượt 750ml',
        category: 'binh-the-thao',
        categoryName: 'Bình thể thao',
        price: 289000,
        oldPrice: 380000,
        discount: '-24%',
        capacity: '750ml',
        location: 'Hà Nội',
        rating: 4.9,
        sold: 640,
        image: 'img/binh-the-thao-4.png',
        badge: 'Bán chạy',
        tags: ['Believe Edition', 'Miệng siêu rộng'],
        description: 'Miệng bình siêu rộng thoải mái bỏ đá viên lớn, đai silicon bọc thân chống trơn và cách nhiệt, nắp khóa bật trợ lực mạnh mẽ.'
    },
    {
        id: 'SP014',
        name: 'Ly Giữ Nhiệt Thể Thao TYESO Quai Xách Silicon 750ml',
        category: 'binh-the-thao',
        categoryName: 'Bình thể thao',
        price: 199000,
        oldPrice: 260000,
        discount: '-23%',
        capacity: '750ml',
        location: 'TP. Hồ Chí Minh',
        rating: 4.7,
        sold: 520,
        image: 'img/binh-the-thao-8.jpg',
        badge: 'Mới',
        tags: ['TYESO Vietnam', 'Quai Silicon'],
        description: 'Thương hiệu TYESO Vietnam chính hãng, thân thon dài sơn đen nhám, quai xách silicon êm ái linh hoạt khi đi tập thể thao.'
    },
    {
        id: 'SP015',
        name: 'Bình Giữ Nhiệt Thể Thao Dã Ngoại TYESO Nắp Inox Trắng Ngọc Trai 1000ml',
        category: 'binh-the-thao',
        categoryName: 'Bình thể thao',
        price: 249000,
        oldPrice: 330000,
        discount: '-25%',
        capacity: '1000ml',
        location: 'TP. Hồ Chí Minh',
        rating: 4.8,
        sold: 710,
        image: 'img/binh-the-thao-7.jpg',
        badge: '',
        tags: ['TYESO 1000ml', 'Trắng Ngọc Trai'],
        description: 'Màu trắng ngọc trai thanh lịch, thân dập ngấn sâu chống trượt, nắp inox nguyên khối có quai gập xách tay dã ngoại.'
    },
    {
        id: 'SP016',
        name: 'Bình Nước Thể Thao GOGLET Pastel Ombre Cổ Rộng Nắp Rời 1000ml',
        category: 'binh-the-thao',
        categoryName: 'Bình thể thao',
        price: 175000,
        oldPrice: 230000,
        discount: '-24%',
        capacity: '1000ml',
        location: 'Đà Nẵng',
        rating: 4.8,
        sold: 480,
        image: 'img/binh-the-thao-6.png',
        badge: '',
        tags: ['GOGLET Pastel', 'Cổ rộng nắp rời'],
        description: 'Phối màu hồng vàng Pastel Ombre ngọt ngào cá tính, miệng bình siêu rộng dễ bỏ đá viên và nắp tháo rời vệ sinh nhanh chóng.'
    },

    // --- 3. Phân loại: Ly văn phòng (ly-van-phong - 8 sản phẩm) ---
    {
        id: 'SP017',
        name: 'Ly Giữ Nhiệt Văn Phòng LocknLock Nắp Gập Chống Tràn 550ml',
        category: 'ly-van-phong',
        categoryName: 'Ly văn phòng',
        price: 159000,
        oldPrice: 210000,
        discount: '-25%',
        capacity: '550ml',
        location: 'TP. Hồ Chí Minh',
        rating: 5.0,
        sold: 3400,
        image: 'img/ly-van-phong-5.png',
        badge: 'Bán chạy',
        tags: ['LocknLock', 'Chống tràn'],
        description: 'Thương hiệu LocknLock cao cấp chuẩn phong cách công sở. Vỏ sơn tĩnh điện màu nâu Mocha sang trọng, nắp gập kín khí chống đổ tràn khi để cạnh bàn làm việc.'
    },
    {
        id: 'SP018',
        name: 'Cốc Giữ Nhiệt Văn Phòng Hiển Thị Nhiệt Độ LED Thông Minh 510ml',
        category: 'ly-van-phong',
        categoryName: 'Ly văn phòng',
        price: 279000,
        oldPrice: 380000,
        discount: '-26%',
        capacity: '510ml',
        location: 'TP. Hồ Chí Minh',
        rating: 4.9,
        sold: 510,
        image: 'img/ly-van-phong-2.png',
        badge: 'Yêu thích',
        tags: ['Màn hình LED', 'Inox 304'],
        description: 'Màn hình cảm ứng LED trên nắp hiển thị chính xác nhiệt độ đồ uống, nắp bật một chạm tiện lợi, lòng inox 304 giữ nóng lạnh bền bỉ cả ngày.'
    },
    {
        id: 'SP019',
        name: 'Bình Giữ Nhiệt Để Bàn Văn Phòng Inox 304 Có Quai & Lọc Trà 900ml',
        category: 'ly-van-phong',
        categoryName: 'Ly văn phòng',
        price: 169000,
        oldPrice: 220000,
        discount: '-23%',
        capacity: '900ml',
        location: 'Hà Nội',
        rating: 4.8,
        sold: 730,
        image: 'img/ly-van-phong-3.png',
        badge: 'Mới',
        tags: ['Có lọc trà', '900ml để bàn'],
        description: 'Thiết kế dạng ấm giữ nhiệt mini để bàn làm việc, kèm lõi lọc trà inox cao cấp, quai cầm công thái học chắc chắn rót nước không bị văng bắn.'
    },
    {
        id: 'SP020',
        name: 'Ly Giữ Nhiệt Pha Trà Văn Phòng Inox SUS 304 Có Khay Lọc 450ml',
        category: 'ly-van-phong',
        categoryName: 'Ly văn phòng',
        price: 139000,
        oldPrice: 180000,
        discount: '-23%',
        capacity: '450ml',
        location: 'Hà Nội',
        rating: 4.7,
        sold: 610,
        image: 'img/ly-van-phong-4.jpg',
        badge: '',
        tags: ['Inox SUS 304', 'Lọc bã trà'],
        description: 'Chuyên dụng pha trà thảo mộc tại văn phòng. Ruột inox SUS 304 kèm khay lọc chặn bã trà, nắp đậy kiêm ly rót nước tiện dụng.'
    },
    {
        id: 'SP021',
        name: 'Ly Giữ Nhiệt Cà Phê Văn Phòng Minimalist Nắp Trượt 500ml',
        category: 'ly-van-phong',
        categoryName: 'Ly văn phòng',
        price: 179000,
        oldPrice: 235000,
        discount: '-24%',
        capacity: '500ml',
        location: 'TP. Hồ Chí Minh',
        rating: 4.9,
        sold: 920,
        image: 'img/ly-van-phong-1.png',
        badge: 'Yêu thích',
        tags: ['Minimalist', 'Không đọng sương'],
        description: 'Phong cách tối giản hiện đại cho dân văn phòng, hai màu trắng và đen mờ tinh tế. Giữ lạnh đá viên 12 tiếng không đọng sương làm ướt mặt bàn.'
    },
    {
        id: 'SP022',
        name: 'Bình Giữ Nhiệt Pha Trà Ngăn Thủy Tinh Khóa Nước Thủy Lực 400ml',
        category: 'ly-van-phong',
        categoryName: 'Ly văn phòng',
        price: 189000,
        oldPrice: 249000,
        discount: '-24%',
        capacity: '400ml',
        location: 'Đà Nẵng',
        rating: 4.8,
        sold: 440,
        image: 'img/ly-van-phong-7.png',
        badge: 'Mới',
        tags: ['Khóa thủy lực', 'Ngăn thủy tinh'],
        description: 'Công nghệ khóa nước thủy lực thông minh khi dựng thẳng đứng, nghiêng chắt nước trà trong veo, thân sơn nhám viền vàng sang trọng.'
    },
    {
        id: 'SP023',
        name: 'Ly Giữ Nhiệt Cà Phê COFFEE Xanh Rêu & Đen Nắp Bật 510ml',
        category: 'ly-van-phong',
        categoryName: 'Ly văn phòng',
        price: 145000,
        oldPrice: 190000,
        discount: '-24%',
        capacity: '510ml',
        location: 'TP. Hồ Chí Minh',
        rating: 4.7,
        sold: 580,
        image: 'img/ly-van-phong-8.jpg',
        badge: 'Yêu thích',
        tags: ['Xanh Rêu Công Sở', 'Inox 304'],
        description: 'Thiết kế phong cách Coffee Barista hiện đại, hai màu xanh rêu quân đội và đen cá tính, nắp bật kín hơi chống tràn đổ trên bàn làm việc.'
    },
    {
        id: 'SP024',
        name: 'Bình Giữ Nhiệt Mini Nắp Quai Tròn Inox 304 Bỏ Túi 350ml',
        category: 'ly-van-phong',
        categoryName: 'Ly văn phòng',
        price: 129000,
        oldPrice: 170000,
        discount: '-24%',
        capacity: '350ml',
        location: 'Hà Nội',
        rating: 4.8,
        sold: 670,
        image: 'img/ly-van-phong-6.png',
        badge: '',
        tags: ['Quai tròn kim loại', 'Mini 350ml'],
        description: 'Form dáng củ tỏi mini siêu đáng yêu, nắp có quai tròn kim loại xách tay hoặc móc balo, 4 màu sắc thời thượng dễ thương cho góc làm việc.'
    },

    // --- 4. Phân loại: Ly in họa tiết (ly-hoa-tiet - 6 sản phẩm) ---
    {
        id: 'SP025',
        name: 'Bình Giữ Nhiệt Họa Tiết Hoa Hồng Sơn Dầu Cổ Điển Nắp Tráng Gương 500ml',
        category: 'ly-hoa-tiet',
        categoryName: 'Ly in họa tiết',
        price: 209000,
        oldPrice: 270000,
        discount: '-22%',
        capacity: '500ml',
        location: 'TP. Hồ Chí Minh',
        rating: 4.9,
        sold: 1500,
        image: 'img/hoa-tiet-1.png',
        badge: 'Yêu thích',
        tags: ['Họa tiết Vintage', 'Nắp tráng gương'],
        description: 'Họa tiết vườn hoa hồng sơn dầu quý phái phong cách Châu Âu cổ điển, nắp vặn kim loại tráng gương sáng bóng kèm quai dây bện chắc chắn.'
    },
    {
        id: 'SP026',
        name: 'Bình Giữ Nhiệt Cổ Phong Họa Tiết Chim Hạc Màn Hình LED 500ml',
        category: 'ly-hoa-tiet',
        categoryName: 'Ly in họa tiết',
        price: 199000,
        oldPrice: 280000,
        discount: '-28%',
        capacity: '500ml',
        location: 'Đà Nẵng',
        rating: 4.8,
        sold: 740,
        image: 'img/hoa-tiet-2.jpg',
        badge: 'Bán chạy',
        tags: ['Cổ phong Á Đông', 'Màn hình LED'],
        description: 'Họa tiết chim hạc mây trời và cành đào mùa xuân đậm chất Á Đông thanh nhã, nắp cảm ứng LED thông minh hiển thị nhiệt độ chính xác.'
    },
    {
        id: 'SP027',
        name: 'Bình Giữ Nhiệt Inox 316 Họa Tiết Cún Con Hoạt Hình Dễ Thương 600ml',
        category: 'ly-hoa-tiet',
        categoryName: 'Ly in họa tiết',
        price: 165000,
        oldPrice: 235000,
        discount: '-30%',
        capacity: '600ml',
        location: 'Hà Nội',
        rating: 4.9,
        sold: 630,
        image: 'img/hoa-tiet-5.png',
        badge: 'Yêu thích',
        tags: ['Inox 316', 'Có ống hút'],
        description: 'Chất liệu Inox 316 y tế cao cấp, họa tiết cún con tinh nghịch đáng yêu, nắp vặn có ống hút silicon và quai xách tiện lợi cho bé và bạn trẻ.'
    },
    {
        id: 'SP028',
        name: 'Bình Giữ Nhiệt SWEET Nơ & Cún Nắp Bật Khóa An Toàn 500ml',
        category: 'ly-hoa-tiet',
        categoryName: 'Ly in họa tiết',
        price: 175000,
        oldPrice: 230000,
        discount: '-24%',
        capacity: '500ml',
        location: 'TP. Hồ Chí Minh',
        rating: 4.8,
        sold: 510,
        image: 'img/hoa-tiet-4.png',
        badge: '',
        tags: ['SWEET Edition', 'Khóa nắp bật'],
        description: 'Họa tiết phong cách Hàn Quốc dễ thương Sweet Good Day, nắp bật khóa lẫy chống rò rỉ nước, 4 màu sắc ngọt ngào (kem, hồng, đen, trắng).'
    },
    {
        id: 'SP029',
        name: 'Bình Giữ Nhiệt Tranh Sơn Thủy Cổ Phong Kèm Hộp Quà Ép Kim 500ml',
        category: 'ly-hoa-tiet',
        categoryName: 'Ly in họa tiết',
        price: 189000,
        oldPrice: 249000,
        discount: '-24%',
        capacity: '500ml',
        location: 'Hà Nội',
        rating: 4.9,
        sold: 680,
        image: 'img/hoa-tiet-3.jpg',
        badge: 'VIP',
        tags: ['Sơn thủy hữu tình', 'Kèm túi quà'],
        description: 'Tuyệt tác nghệ thuật phong cảnh phương Đông trang nhã, nắp cảm ứng nhiệt độ, đóng gói kèm hộp và túi xách sang trọng thích hợp làm quà tặng.'
    },
    {
        id: 'SP030',
        name: 'Ly Giữ Nhiệt Họa Tiết Cỏ 4 Lá May Mắn Four Leaf Clover 500ml',
        category: 'ly-hoa-tiet',
        categoryName: 'Ly in họa tiết',
        price: 219000,
        oldPrice: 290000,
        discount: '-24%',
        capacity: '500ml',
        location: 'TP. Hồ Chí Minh',
        rating: 4.9,
        sold: 840,
        image: 'img/hoa-tiet-6.png',
        badge: 'Yêu thích',
        tags: ['Cỏ 4 Lá May Mắn', 'Charm dây xách'],
        description: 'Thông điệp may mắn của riêng bạn, họa tiết hoa cỏ 4 lá ép kim vàng sang trọng, 3 gam màu tinh tế kèm dây charm cỏ 4 lá xinh xắn.'
    },

    // --- 5. Phân loại: Ống hút & Cọ rửa (phu-kien - 5 sản phẩm) ---
    {
        id: 'SP031',
        name: 'Bộ Chùm Cọ Rửa Ống Hút Lông Cước Mềm Thép Không Gỉ (Set 10 Cây)',
        category: 'phu-kien',
        categoryName: 'Ống hút & Cọ rửa',
        price: 35000,
        oldPrice: 55000,
        discount: '-36%',
        capacity: '500ml',
        location: 'TP. Hồ Chí Minh',
        rating: 4.8,
        sold: 4200,
        image: 'img/co-rua-1.png',
        badge: 'Bán chạy',
        tags: ['Thép xoắn 304', 'Set 10 cây'],
        description: 'Chùm 10 cọ rửa ống hút tiện lợi, lông cước mềm dai không làm xước thành ống hút, lõi thép xoắn không gỉ uốn cong linh hoạt.'
    },
    {
        id: 'SP032',
        name: 'Ống Hút Inox 304 Uốn Cong 21.5cm Kèm Cọ Rửa Chuyên Dụng',
        category: 'phu-kien',
        categoryName: 'Ống hút & Cọ rửa',
        price: 29000,
        oldPrice: 45000,
        discount: '-35%',
        capacity: '500ml',
        location: 'Hà Nội',
        rating: 4.9,
        sold: 3100,
        image: 'img/co-rua-2.png',
        badge: 'Yêu thích',
        tags: ['Inox 304', 'Dài 21.5cm'],
        description: 'Ống hút Inox 304 tiêu chuẩn dài 21.5cm uốn cong công thái học dễ uống, tặng kèm 1 cọ rửa lòng ống hút siêu sạch.'
    },
    {
        id: 'SP033',
        name: 'Cây Cọ Rửa Bình Bọt Biển Xốp Mềm Cán Dài NAFI Kèm Que Cọ Nhỏ',
        category: 'phu-kien',
        categoryName: 'Ống hút & Cọ rửa',
        price: 45000,
        oldPrice: 70000,
        discount: '-35%',
        capacity: '900ml',
        location: 'TP. Hồ Chí Minh',
        rating: 4.8,
        sold: 1800,
        image: 'img/co-rua-3.png',
        badge: 'Mới',
        tags: ['Bọt biển NAFI', 'Cán dài tiện lợi'],
        description: 'Đầu mút bọt biển mềm bọt nhiều làm sạch tận đáy bình mà không trầy xước lớp tráng men/inox, kèm que cọ rửa nắp tiện lợi.'
    },
    {
        id: 'SP034',
        name: 'Cọ Vệ Sinh Nắp Bình 3 Trong 1 Đa Năng Gap Brush Chống Nấm Mốc',
        category: 'phu-kien',
        categoryName: 'Ống hút & Cọ rửa',
        price: 39000,
        oldPrice: 60000,
        discount: '-35%',
        capacity: '750ml',
        location: 'TP. Hồ Chí Minh',
        rating: 4.9,
        sold: 1450,
        image: 'img/co-rua-4.png',
        badge: 'Yêu thích',
        tags: ['3 Trong 1', 'Cọ rãnh nắp'],
        description: 'Dụng cụ thông minh 3 trong 1: Đầu chổi cọ khe nắp, cọ góc xoắn ốc và móc cạy gioăng silicon vệ sinh triệt để cặn bẩn vi khuẩn.'
    },
    {
        id: 'SP035',
        name: 'Bộ Cọ Rửa Ống Hút Quai Xách Tròn Đa Sắc Pastel Tiện Lợi',
        category: 'phu-kien',
        categoryName: 'Ống hút & Cọ rửa',
        price: 25000,
        oldPrice: 40000,
        discount: '-37%',
        capacity: '500ml',
        location: 'Hà Nội',
        rating: 4.9,
        sold: 2100,
        image: 'img/co-rua-5.png',
        badge: '',
        tags: ['Quai tròn Pastel', 'Luồn nắp bình'],
        description: 'Đầu cọ tròn nhiều màu sắc pastel dễ thương, thiết kế quai cầm móc tròn dễ treo ráo nước, chiều dài lý tưởng cho mọi loại ống hút.'
    },

    // --- 6. Phân loại: Hộp quà tặng (hop-qua - 5 sản phẩm) ---
    {
        id: 'SP036',
        name: 'Combo Bình Giữ Nhiệt & Hộp Quà Tặng Doanh Nghiệp Sang Trọng',
        category: 'hop-qua',
        categoryName: 'Hộp quà tặng',
        price: 345000,
        oldPrice: 450000,
        discount: '-20%',
        capacity: '750ml',
        location: 'TP. Hồ Chí Minh',
        rating: 5.0,
        sold: 1800,
        image: 'img/hop-qua-3.png',
        badge: 'Yêu thích',
        tags: ['Hộp Quà', 'Doanh Nghiệp'],
        description: 'Bộ quà tặng doanh nghiệp cao cấp gồm bình giữ nhiệt nắp bật, ly giữ nhiệt bọc da kèm ống hút, quạt cầm tay và túi quà sang trọng.'
    },
    {
        id: 'SP037',
        name: 'Hộp Quà Cao Cấp Bình Giữ Nhiệt Inox 316 + Sổ Da + Bút Ký',
        category: 'hop-qua',
        categoryName: 'Hộp quà tặng',
        price: 420000,
        oldPrice: 550000,
        discount: '-24%',
        capacity: '500ml',
        location: 'Hà Nội',
        rating: 4.9,
        sold: 940,
        image: 'img/hop-qua-5.png',
        badge: 'VIP',
        tags: ['Inox 316', 'Set Doanh Nhân'],
        description: 'Set quà tặng doanh nhân đẳng cấp gồm bình giữ nhiệt Inox xanh kim loại cao cấp, sổ tay da cài kim loại và bút ký sang trọng.'
    },
    {
        id: 'SP038',
        name: 'Set Quà Tặng Tri Ân Khách Hàng Bình Giữ Nhiệt Hộp Xi Cao Cấp',
        category: 'hop-qua',
        categoryName: 'Hộp quà tặng',
        price: 380000,
        oldPrice: 490000,
        discount: '-22%',
        capacity: '750ml',
        location: 'TP. Hồ Chí Minh',
        rating: 4.9,
        sold: 760,
        image: 'img/hop-qua-4.jpg',
        badge: 'Bán chạy',
        tags: ['Đa sắc màu', 'Hộp xi nhung'],
        description: 'Hộp quà tặng tri ân khách hàng hội nghị đa sắc màu Pastel thời thượng, gồm ly giữ nhiệt, khăn bông mềm và quạt mini tiện ích.'
    },
    {
        id: 'SP039',
        name: 'Combo Bình Giữ Nhiệt Hiển Thị LED & Dù Gấp Tự Động Sang Trọng',
        category: 'hop-qua',
        categoryName: 'Hộp quà tặng',
        price: 365000,
        oldPrice: 470000,
        discount: '-22%',
        capacity: '600ml',
        location: 'Hà Nội',
        rating: 4.8,
        sold: 580,
        image: 'img/hop-qua-2.jpg',
        badge: 'Yêu thích',
        tags: ['Màn hình LED', 'Bình + Dù VIP'],
        description: 'Bộ quà tặng 2 món công nghệ thiết thực: Bình giữ nhiệt hiển thị nhiệt độ cảm ứng LED thông minh và ô dù che mưa nắng tự động 2 chiều.'
    },
    {
        id: 'SP040',
        name: 'Hộp Quà VIP Bình Giữ Nhiệt Chân Không Kèm 2 Tách Uống Nước',
        category: 'hop-qua',
        categoryName: 'Hộp quà tặng',
        price: 480000,
        oldPrice: 620000,
        discount: '-23%',
        capacity: '500ml',
        location: 'TP. Hồ Chí Minh',
        rating: 5.0,
        sold: 810,
        image: 'img/hop-qua-1.png',
        badge: 'VIP',
        tags: ['Vacuum Set', 'Kèm 2 Tách'],
        description: 'Set Vacuum Bottle quà tặng đẳng cấp quốc tế gồm 1 bình giữ nhiệt chân không Inox kèm 2 tách uống nước có quai xách và hộp túi quà cao cấp.'
    }
];

// --------------------------------------------------------
// BỘ DỮ LIỆU ĐƠN HÀNG MẪU ĐƯỢC NHÓM THEO ĐƠN TRONG RAM
// --------------------------------------------------------
const MOCK_ORDERS = [
    {
        id: 'DH1001',
        date: '2025-03-01',
        customerName: 'Nguyễn Văn An',
        phone: '0912345678',
        address: '123 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh',
        paymentMethod: 'Trực tuyến (Ví MoMo)',
        status: 'Đã giao thành công',
        statusCode: 'delivered',
        items: [
            { name: 'Ly Giữ Nhiệt Inox 304 Nắp Bật 900ml', capacity: '900ml', qty: 2, price: 189000, total: 378000 },
            { name: 'Combo Bình Giữ Nhiệt & Hộp Quà Tặng Doanh Nghiệp', capacity: '750ml', qty: 1, price: 345000, total: 345000 }
        ],
        shippingFee: 0,
        totalAmount: 723000
    },
    {
        id: 'DH1002',
        date: '2025-03-15',
        customerName: 'Nguyễn Văn An',
        phone: '0912345678',
        address: '123 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh',
        paymentMethod: 'Tiền mặt khi nhận hàng (COD)',
        status: 'Đã xác nhận',
        statusCode: 'confirmed',
        items: [
            { name: 'Bình Giữ Nhiệt Thể Thao 1000ml Sơn Tĩnh Điện Inox 316', capacity: '1000ml', qty: 3, price: 215000, total: 645000 }
        ],
        shippingFee: 0,
        totalAmount: 645000
    }
];

// --------------------------------------------------------
// TRẠNG THÁI TÌM KIẾM, BỘ LỌC VÀ PHÂN TRANG (FILTER STATE)
// --------------------------------------------------------
const filterState = {
    keyword: '',             // Từ khóa tìm kiếm tương đối theo tên
    selectedCategory: 'all', // Phân loại chọn từ danh mục nổi bật ('all' hoặc mã danh mục)
    checkedCategories: [],   // Danh sách checkbox phân loại bên bộ lọc nâng cao
    minPrice: null,          // Khoảng giá từ
    maxPrice: null,          // Khoảng giá đến
    locations: [],           // Nơi bán được chọn
    capacities: [],          // Dung tích được chọn
    minRating: 0,            // Đánh giá tối thiểu
    sortBy: 'popular',       // Sắp xếp: popular, newest, bestseller, price-asc, price-desc
    currentPage: 1,          // Trang hiện tại
    itemsPerPage: 10         // Số sản phẩm trên mỗi trang (40 sản phẩm -> đúng 4 trang)
};

// Biến lưu trạng thái người dùng đăng nhập trong RAM
let currentUserDisplay = {
    name: 'Nguyễn Văn An',
    username: 'nguyenvana',
    phone: '0901234567',
    email: 'nguyenvana@gmail.com',
    city: 'Hồ Chí Minh',
    address: '123 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh'
};

// ========================================================
// 1. MÀN HÌNH ĐĂNG NHẬP BẮT BUỘC BAN ĐẦU & QUÊN MẬT KHẨU
// ========================================================

function handleInitialLogin(e) {
    if (e) e.preventDefault();
    const userInput = document.getElementById('initLoginUser').value.trim() || 'Nguyễn Văn An';
    
    let displayName = userInput;
    if (userInput.toLowerCase() === 'nguyenvana') {
        displayName = 'Nguyễn Văn An';
    } else if (userInput.length > 0) {
        displayName = userInput.charAt(0).toUpperCase() + userInput.slice(1);
    }

    if (!currentUserDisplay) {
        currentUserDisplay = {
            name: displayName,
            username: userInput,
            phone: '0901234567',
            email: 'nguyenvana@gmail.com',
            city: 'Hồ Chí Minh',
            address: '123 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh'
        };
    } else {
        currentUserDisplay.name = displayName;
        currentUserDisplay.username = userInput;
    }

    const loginScreen = document.getElementById('userLoginScreen');
    const storeApp = document.getElementById('storeMainApp');

    if (loginScreen) loginScreen.style.display = 'none';
    if (storeApp) storeApp.style.display = 'block';

    updateAuthStateUI();
    renderProducts();
    renderOrderHistory();
    showToast(`Chào mừng "${displayName}" đã đăng nhập vào cửa hàng Mr.Huy!`, 'success', 'Đăng nhập thành công');
}

function toggleInitForgotView(showForgot) {
    const loginView = document.getElementById('initLoginFormView');
    const forgotView = document.getElementById('initForgotFormView');
    const subtitle = document.getElementById('initLoginSubtitle');

    if (showForgot) {
        if (loginView) loginView.style.display = 'none';
        if (forgotView) forgotView.style.display = 'block';
        if (subtitle) subtitle.textContent = 'Khôi phục và thiết lập mật khẩu mới';
    } else {
        if (loginView) loginView.style.display = 'block';
        if (forgotView) forgotView.style.display = 'none';
        if (subtitle) subtitle.textContent = 'Vui lòng đăng nhập để vào cửa hàng mua sắm';
    }
}

function handleInitForgotSubmit(e) {
    if (e) e.preventDefault();
    const user = document.getElementById('initForgotUser').value.trim() || 'nguyenvana';
    const newPass = document.getElementById('initForgotNewPass').value;

    showToast(`Mật khẩu mới cho tài khoản "${user}" đã được cập nhật thành công! Vui lòng đăng nhập lại với mật khẩu mới.`, 'success', 'Đổi mật khẩu thành công');
    
    const loginPass = document.getElementById('initLoginPass');
    if (loginPass) loginPass.value = newPass;
    const loginUser = document.getElementById('initLoginUser');
    if (loginUser) loginUser.value = user;

    toggleInitForgotView(false);
}

function handleMockLogin(e) {
    if (e) e.preventDefault();
    const userInput = document.getElementById('loginUserInput').value.trim() || 'Nguyễn Văn An';
    
    let displayName = userInput;
    if (userInput.toLowerCase() === 'nguyenvana') {
        displayName = 'Nguyễn Văn An';
    } else if (userInput.length > 0) {
        displayName = userInput.charAt(0).toUpperCase() + userInput.slice(1);
    }

    if (!currentUserDisplay) {
        currentUserDisplay = {
            name: displayName,
            username: userInput,
            phone: '0901234567',
            email: 'nguyenvana@gmail.com',
            city: 'Hồ Chí Minh',
            address: '123 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh'
        };
    } else {
        currentUserDisplay.name = displayName;
        currentUserDisplay.username = userInput;
    }

    updateAuthStateUI();
    closeModal('authModal');
    showToast(`Chào mừng "${displayName}" đã đăng nhập vào hệ thống Mr.Huy!`, 'success', 'Đăng nhập thành công');
}

function handleMockRegister(e) {
    if (e) e.preventDefault();
    const regName = document.getElementById('regNameInput').value.trim() || 'Trần Thị Bình';
    const regUser = document.getElementById('regUserInput').value.trim() || 'tranthib';
    const regPhone = document.getElementById('regPhoneInput')?.value.trim() || '0987654321';
    const regEmail = document.getElementById('regEmailInput')?.value.trim() || 'binh@gmail.com';
    const regAddress = document.getElementById('regAddressInput')?.value.trim() || '456 Cầu Giấy, Hà Nội';

    currentUserDisplay = {
        name: regName,
        username: regUser,
        phone: regPhone,
        email: regEmail,
        city: 'Hà Nội',
        address: regAddress
    };

    updateAuthStateUI();
    closeModal('authModal');
    showToast(`Tài khoản của "${regName}" đã được tạo thành công và tự động đăng nhập!`, 'success', 'Đăng ký thành công');
}

function handleAuthForgotSubmit(e) {
    if (e) e.preventDefault();
    const user = document.getElementById('authForgotUser').value.trim() || 'nguyenvana';
    const newPass = document.getElementById('authForgotPass').value;

    showToast(`Mật khẩu mới cho tài khoản "${user}" đã được cập nhật thành công! Vui lòng đăng nhập lại.`, 'success', 'Đổi mật khẩu thành công');

    const loginPass = document.getElementById('loginPassInput');
    if (loginPass) loginPass.value = newPass;
    const loginUser = document.getElementById('loginUserInput');
    if (loginUser) loginUser.value = user;

    switchAuthMode('login');
}

function handleLogoutMock() {
    currentUserDisplay = null;
    updateAuthStateUI();

    const dropdown = document.getElementById('userMenuDropdown');
    if (dropdown) dropdown.classList.remove('show');

    const loginScreen = document.getElementById('userLoginScreen');
    const storeApp = document.getElementById('storeMainApp');

    if (storeApp) storeApp.style.display = 'none';
    if (loginScreen) {
        loginScreen.style.display = 'flex';
        toggleInitForgotView(false);
    }

    showToast('Bạn đã đăng xuất tài khoản thành công!', 'info', 'Đăng xuất');
}

// --------------------------------------------------------
// CHỨC NĂNG CHỈNH SỬA THÔNG TIN CÁ NHÂN KHÁCH HÀNG
// --------------------------------------------------------
function openUserProfileModal() {
    const dropdown = document.getElementById('userMenuDropdown');
    if (dropdown) dropdown.classList.remove('show');

    if (!currentUserDisplay) {
        showToast('Vui lòng đăng nhập để chỉnh sửa thông tin cá nhân!', 'warning');
        return;
    }

    const uInput = document.getElementById('profileUsername');
    const nInput = document.getElementById('profileFullName');
    const pInput = document.getElementById('profilePhone');
    const eInput = document.getElementById('profileEmail');
    const cInput = document.getElementById('profileCity');
    const aInput = document.getElementById('profileAddress');

    if (uInput) uInput.value = currentUserDisplay.username || 'nguyenvana';
    if (nInput) nInput.value = currentUserDisplay.name || 'Nguyễn Văn An';
    if (pInput) pInput.value = currentUserDisplay.phone || '0901234567';
    if (eInput) eInput.value = currentUserDisplay.email || 'nguyenvana@gmail.com';
    if (cInput) cInput.value = currentUserDisplay.city || 'Hồ Chí Minh';
    if (aInput) aInput.value = currentUserDisplay.address || '123 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh';

    openModal('userProfileModal');
}

function handleSaveUserProfile(e) {
    if (e) e.preventDefault();
    const newName = document.getElementById('profileFullName').value.trim();
    const newPhone = document.getElementById('profilePhone').value.trim();
    const newEmail = document.getElementById('profileEmail').value.trim();
    const newCity = document.getElementById('profileCity').value;
    const newAddress = document.getElementById('profileAddress').value.trim();

    if (!newName || !newPhone || !newAddress) {
        showToast('Vui lòng điền đầy đủ họ tên, số điện thoại và địa chỉ giao hàng!', 'warning');
        return;
    }

    if (!currentUserDisplay) {
        currentUserDisplay = { username: 'nguyenvana' };
    }
    currentUserDisplay.name = newName;
    currentUserDisplay.phone = newPhone;
    currentUserDisplay.email = newEmail;
    currentUserDisplay.city = newCity;
    currentUserDisplay.address = newAddress;

    updateAuthStateUI();
    closeModal('userProfileModal');
    showToast(`Đã lưu thay đổi thông tin cá nhân của "${newName}" thành công!`, 'success', 'Cập nhật tài khoản');
}

function updateAuthStateUI() {
    const topAuthBox = document.getElementById('topbarAuthBox');
    const guestMenu = document.getElementById('userMenuGuest');
    const loggedMenu = document.getElementById('userMenuLoggedIn');
    const dropdownName = document.getElementById('userDropdownName');
    const coName = document.getElementById('coCustomerName');
    const coUser = document.getElementById('coUsername');

    if (currentUserDisplay) {
        if (topAuthBox) {
            topAuthBox.innerHTML = `
                <span class="topbar-link" style="color: #67e8f9; cursor: pointer;" onclick="openUserProfileModal()"><i class="fa-solid fa-user-check"></i> Xin chào, <strong style="color: #fff;">${currentUserDisplay.name}</strong></span>
                <span class="topbar-sep">|</span>
                <a href="javascript:void(0)" class="topbar-link" onclick="openUserProfileModal()"><i class="fa-solid fa-user-pen"></i> Chỉnh sửa thông tin</a>
                <span class="topbar-sep">|</span>
                <a href="javascript:void(0)" class="topbar-link" onclick="openOrderHistoryModal()"><i class="fa-solid fa-receipt"></i> Lịch sử đơn hàng</a>
                <span class="topbar-sep">|</span>
                <a href="javascript:void(0)" class="topbar-link" onclick="handleLogoutMock()"><i class="fa-solid fa-arrow-right-from-bracket"></i> Đăng xuất</a>
            `;
        }
        if (guestMenu) guestMenu.style.display = 'none';
        if (loggedMenu) loggedMenu.style.display = 'block';
        if (dropdownName) dropdownName.textContent = currentUserDisplay.name;
        if (coName) coName.textContent = currentUserDisplay.name;
        if (coUser) coUser.textContent = `${currentUserDisplay.username} (User)`;
    } else {
        if (topAuthBox) {
            topAuthBox.innerHTML = `
                <a href="javascript:void(0)" class="topbar-link" onclick="openAuthModal('register')">Đăng ký</a>
                <span class="topbar-sep">|</span>
                <a href="javascript:void(0)" class="topbar-link" onclick="openAuthModal('login')">Đăng nhập</a>
            `;
        }
        if (guestMenu) guestMenu.style.display = 'block';
        if (loggedMenu) loggedMenu.style.display = 'none';
        if (coName) coName.textContent = 'Nguyễn Văn An';
        if (coUser) coUser.textContent = 'nguyenvana (User)';
    }
}

function openAuthModal(mode) {
    switchAuthMode(mode);
    openModal('authModal');
}

function switchAuthMode(mode) {
    const title = document.getElementById('authTitle');
    const logBox = document.getElementById('loginBox');
    const regBox = document.getElementById('registerBox');
    const forgotBox = document.getElementById('forgotBox');

    if (logBox) logBox.style.display = 'none';
    if (regBox) regBox.style.display = 'none';
    if (forgotBox) forgotBox.style.display = 'none';

    if (mode === 'login') {
        if (title) title.textContent = 'Đăng Nhập Khách Hàng';
        if (logBox) logBox.style.display = 'block';
    } else if (mode === 'reg' || mode === 'register') {
        if (title) title.textContent = 'Đăng Ký Tài Khoản Người Mua Hàng';
        if (regBox) regBox.style.display = 'block';
    } else if (mode === 'forgot') {
        if (title) title.textContent = 'Khôi Phục Mật Khẩu Khách Hàng';
        if (forgotBox) forgotBox.style.display = 'block';
    }
}

function toggleUserMenu() {
    const dropdown = document.getElementById('userMenuDropdown');
    if (dropdown) dropdown.classList.toggle('show');
}

window.addEventListener('click', (e) => {
    if (!e.target.closest('.user-profile-header')) {
        const dropdown = document.getElementById('userMenuDropdown');
        if (dropdown) dropdown.classList.remove('show');
    }
});


// ========================================================
// 2. TÌM KIẾM CƠ BẢN THEO TÊN SẢN PHẨM (TÌM TƯƠNG ĐỐI)
// ========================================================

// ========================================================
// TÌM KIẾM CƠ BẢN VÀ GỢI Ý TÌM KIẾM (KHÔNG CHUYỂN HƯỚNG MÀN HÌNH)
// ========================================================

function handleSearchInput() {
    const input = document.getElementById('searchInput');
    if (!input) return;
    const val = input.value.trim();

    // Cập nhật kết quả bộ lọc sản phẩm dưới nền (KHÔNG cuộn màn hình)
    filterState.keyword = val;
    filterState.currentPage = 1;
    renderProducts();

    renderSearchSuggestions(val);
}

function handleSearchFocus() {
    const input = document.getElementById('searchInput');
    const val = input ? input.value.trim() : '';
    renderSearchSuggestions(val);
}

function renderSearchSuggestions(val) {
    const dropdown = document.getElementById('searchSuggestionsDropdown');
    const list = document.getElementById('suggestionsList');
    if (!dropdown || !list) return;

    if (!val) {
        // Gợi ý sản phẩm nổi bật mặc định khi vừa bấm vào ô tìm kiếm
        const popularProds = PRODUCTS_DATA.slice(0, 4);
        list.innerHTML = `
            <div style="padding: 8px 14px; font-size: 11px; font-weight: 700; color: #64748b; background: #f8fafc; border-bottom: 1px solid #f1f5f9;">
                🔥 SẢN PHẨM TÌM KIẾM PHỔ BIẾN
            </div>
            ${popularProds.map(p => `
                <div class="suggestion-item" onclick="selectSearchSuggestion('${p.id}', '${escapeHtml(p.name)}')">
                    <img class="suggestion-thumb" src="${p.image}" alt="${escapeHtml(p.name)}">
                    <div class="suggestion-info">
                        <div class="suggestion-name">${escapeHtml(p.name)}</div>
                        <div class="suggestion-meta">
                            <span class="suggestion-price">${formatCurrency(p.price)}</span>
                            <span class="suggestion-cat">${getCategoryDisplayName(p.category)}</span>
                        </div>
                    </div>
                </div>
            `).join('')}
        `;
        dropdown.style.display = 'block';
        return;
    }

    const lower = val.toLowerCase();
    const matched = PRODUCTS_DATA.filter(p => {
        const nameMatch = p.name.toLowerCase().includes(lower);
        const descMatch = (p.desc || '').toLowerCase().includes(lower);
        const tagMatch = (p.tags || []).some(t => t.toLowerCase().includes(lower));
        const catMatch = getCategoryDisplayName(p.category).toLowerCase().includes(lower);
        return nameMatch || descMatch || tagMatch || catMatch;
    });

    if (matched.length === 0) {
        list.innerHTML = `
            <div class="suggestion-empty">
                <i class="fa-solid fa-magnifying-glass" style="font-size: 20px; color: #cbd5e1; margin-bottom: 8px; display: block;"></i>
                Không tìm thấy sản phẩm nào khớp với "<strong>${escapeHtml(val)}</strong>".
            </div>
        `;
    } else {
        const displayMatches = matched.slice(0, 5);
        list.innerHTML = displayMatches.map(p => `
            <div class="suggestion-item" onclick="selectSearchSuggestion('${p.id}', '${escapeHtml(p.name)}')">
                <img class="suggestion-thumb" src="${p.image}" alt="${escapeHtml(p.name)}">
                <div class="suggestion-info">
                    <div class="suggestion-name">${escapeHtml(p.name)}</div>
                    <div class="suggestion-meta">
                        <span class="suggestion-price">${formatCurrency(p.price)}</span>
                        <span class="suggestion-cat">${getCategoryDisplayName(p.category)}</span>
                    </div>
                </div>
            </div>
        `).join('') + `
            <div class="suggestion-footer" onclick="closeSearchSuggestions()">
                <i class="fa-solid fa-list-check"></i> Xem danh sách <strong>${matched.length}</strong> kết quả
            </div>
        `;
    }

    dropdown.style.display = 'block';
}

function selectSearchSuggestion(prodId, prodName) {
    const input = document.getElementById('searchInput');
    if (input) input.value = prodName;
    filterState.keyword = prodName;
    filterState.currentPage = 1;
    renderProducts();
    closeSearchSuggestions();
    // Sau khi chọn theo gợi ý thì hiện ra màn hình mua sắm
    scrollToSection('catalogSec');
}

function handleSearchSubmit(e) {
    if (e) e.preventDefault();
    const input = document.getElementById('searchInput');
    const val = input ? input.value.trim() : '';

    if (!val) {
        // Chưa chọn theo gợi ý hoặc ô tìm kiếm trống không -> chuyển qua mục tất cả các sản phẩm
        selectCategoryUI('all', null);
        filterState.keyword = '';
        if (input) input.value = '';
        closeSearchSuggestions();
        filterState.currentPage = 1;
        renderProducts();
        scrollToSection('catalogSec');
    } else {
        // Đã nhập theo gợi ý hoặc từ khóa -> tìm kiếm và hiện ra màn hình mua sắm
        filterState.keyword = val;
        filterState.currentPage = 1;
        renderProducts();
        closeSearchSuggestions();
        scrollToSection('catalogSec');
    }
}

function closeSearchSuggestions() {
    const dropdown = document.getElementById('searchSuggestionsDropdown');
    if (dropdown) dropdown.style.display = 'none';
}

function handleMockSearch(e) {
    handleSearchSubmit(e);
}

function setSearchValue(val) {
    const input = document.getElementById('searchInput');
    if (input) input.value = val;
    filterState.keyword = val;
    filterState.currentPage = 1;
    renderProducts();
    closeSearchSuggestions();
    scrollToSection('catalogSec');
}

// Đóng gợi ý tìm kiếm khi nhấp ra ngoài
document.addEventListener('click', (e) => {
    const searchContainer = document.querySelector('.search-container');
    if (searchContainer && !searchContainer.contains(e.target)) {
        closeSearchSuggestions();
    }
});


// ========================================================
// 3. TÌM KIẾM NÂNG CAO (KẾT HỢP NHIỀU ĐIỀU KIỆN TRONG 1 LẦN TÌM)
// ========================================================

function applyAdvancedFilter() {
    const searchVal = document.getElementById('searchInput').value.trim();
    filterState.keyword = searchVal;

    const checkedCats = [];
    document.querySelectorAll('input[name="filterCat"]:checked').forEach(cb => {
        checkedCats.push(cb.value);
    });
    filterState.checkedCategories = checkedCats;

    const minP = document.getElementById('filterPriceMin').value.trim();
    const maxP = document.getElementById('filterPriceMax').value.trim();
    filterState.minPrice = minP !== '' ? parseFloat(minP) : null;
    filterState.maxPrice = maxP !== '' ? parseFloat(maxP) : null;

    const checkedLocs = [];
    document.querySelectorAll('input[name="filterLoc"]:checked').forEach(cb => {
        checkedLocs.push(cb.value);
    });
    filterState.locations = checkedLocs;

    const activeCaps = [];
    document.querySelectorAll('#capacityFilterChips .filter-chip.active').forEach(chip => {
        const cap = chip.getAttribute('data-cap');
        if (cap) activeCaps.push(cap);
    });
    filterState.capacities = activeCaps;

    const ratingRadio = document.querySelector('input[name="filterRating"]:checked');
    filterState.minRating = ratingRadio ? parseFloat(ratingRadio.value) : 0;

    filterState.currentPage = 1;
    renderProducts();
}

function setQuickPrice(min, max) {
    document.getElementById('filterPriceMin').value = min !== null ? min : '';
    document.getElementById('filterPriceMax').value = max !== null ? max : '';
    applyAdvancedFilter();
}

function toggleCapFilter(el, cap) {
    el.classList.toggle('active');
    applyAdvancedFilter();
}

function resetAllFilters() {
    document.getElementById('searchInput').value = '';
    filterState.keyword = '';

    filterState.selectedCategory = 'all';
    document.querySelectorAll('#featuredCategoryGrid .category-card').forEach(c => {
        c.classList.remove('active');
        if (c.getAttribute('data-cat') === 'all') c.classList.add('active');
    });

    document.querySelectorAll('input[name="filterCat"]').forEach(cb => cb.checked = false);
    filterState.checkedCategories = [];

    document.getElementById('filterPriceMin').value = '';
    document.getElementById('filterPriceMax').value = '';
    filterState.minPrice = null;
    filterState.maxPrice = null;

    document.querySelectorAll('input[name="filterLoc"]').forEach(cb => cb.checked = false);
    filterState.locations = [];

    document.querySelectorAll('#capacityFilterChips .filter-chip').forEach(c => c.classList.remove('active'));
    filterState.capacities = [];

    const allRatingRadio = document.querySelector('input[name="filterRating"][value="0"]');
    if (allRatingRadio) allRatingRadio.checked = true;
    filterState.minRating = 0;

    setSortOption('popular');
    filterState.currentPage = 1;
    renderProducts();
}


// ========================================================
// 4. HIỂN THỊ SẢN PHẨM THEO PHÂN LOẠI & KẾT QUẢ DẠNG PHÂN TRANG (10 SP / TRANG)
// ========================================================

function selectCategoryUI(catId, el) {
    filterState.selectedCategory = catId;

    document.querySelectorAll('#featuredCategoryGrid .category-card').forEach(c => c.classList.remove('active'));
    if (el) {
        el.classList.add('active');
    } else {
        const target = document.querySelector(`#featuredCategoryGrid .category-card[data-cat="${catId}"]`);
        if (target) target.classList.add('active');
    }

    document.querySelectorAll('input[name="filterCat"]').forEach(cb => {
        if (catId === 'all') {
            cb.checked = false;
        } else {
            cb.checked = (cb.value === catId);
        }
    });

    filterState.checkedCategories = (catId === 'all') ? [] : [catId];
    filterState.currentPage = 1;
    renderProducts();
    scrollToSection('catalogSec');
}

function setSortOption(type) {
    filterState.sortBy = type;

    const btnPop = document.getElementById('sortBtnPopular');
    const btnNew = document.getElementById('sortBtnNewest');
    const btnBest = document.getElementById('sortBtnBestseller');
    const selPrice = document.getElementById('sortPriceSelect');

    if (btnPop) btnPop.classList.remove('active');
    if (btnNew) btnNew.classList.remove('active');
    if (btnBest) btnBest.classList.remove('active');

    if (type === 'popular' && btnPop) btnPop.classList.add('active');
    if (type === 'newest' && btnNew) btnNew.classList.add('active');
    if (type === 'bestseller' && btnBest) btnBest.classList.add('active');

    if (type === 'price-asc' || type === 'price-desc') {
        if (selPrice) selPrice.value = type;
    } else {
        if (selPrice) selPrice.value = 'default';
    }

    renderProducts();
}

function getFilteredProducts() {
    return PRODUCTS_DATA.filter(prod => {
        if (prod.status === 'hidden') return false; // Ẩn khỏi web người dùng nếu quản trị viên đã ẩn

        if (filterState.keyword) {
            const kw = filterState.keyword.toLowerCase().trim();
            const nameMatch = prod.name.toLowerCase().includes(kw);
            const catMatch = prod.categoryName.toLowerCase().includes(kw);
            const descMatch = prod.description.toLowerCase().includes(kw);
            if (!nameMatch && !catMatch && !descMatch) return false;
        }

        if (filterState.checkedCategories.length > 0) {
            if (!filterState.checkedCategories.includes(prod.category)) return false;
        } else if (filterState.selectedCategory !== 'all') {
            if (prod.category !== filterState.selectedCategory) return false;
        }

        if (filterState.minPrice !== null && prod.price < filterState.minPrice) return false;
        if (filterState.maxPrice !== null && prod.price > filterState.maxPrice) return false;

        if (filterState.locations.length > 0) {
            if (!filterState.locations.includes(prod.location)) return false;
        }

        if (filterState.capacities.length > 0) {
            if (!filterState.capacities.includes(prod.capacity)) return false;
        }

        if (filterState.minRating > 0) {
            if (prod.rating < filterState.minRating) return false;
        }

        return true;
    });
}

function sortProductsList(list) {
    const arr = [...list];
    switch (filterState.sortBy) {
        case 'newest':
            return arr.reverse();
        case 'bestseller':
            return arr.sort((a, b) => b.sold - a.sold);
        case 'price-asc':
            return arr.sort((a, b) => a.price - b.price);
        case 'price-desc':
            return arr.sort((a, b) => b.price - a.price);
        case 'popular':
        default:
            return arr.sort((a, b) => (b.sold * b.rating) - (a.sold * a.rating));
    }
}

function renderProducts() {
    const grid = document.getElementById('mainProductGrid');
    if (!grid) return;

    const filtered = getFilteredProducts();
    const sorted = sortProductsList(filtered);

    const countEl = document.getElementById('filterResultCount');
    if (countEl) countEl.textContent = sorted.length;

    renderActiveFilterBadges();

    const totalItems = sorted.length;
    const itemsPerPage = filterState.itemsPerPage; // 10 sản phẩm / trang
    const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

    if (filterState.currentPage > totalPages) filterState.currentPage = totalPages;
    if (filterState.currentPage < 1) filterState.currentPage = 1;

    const startIndex = (filterState.currentPage - 1) * itemsPerPage;
    const pageItems = sorted.slice(startIndex, startIndex + itemsPerPage);

    if (pageItems.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1 / -1; background: #fff; border-radius: 8px; border: 1px dashed #cbd5e1; padding: 48px 20px; text-align: center;">
                <div style="font-size: 48px; color: #94a3b8; margin-bottom: 12px;">
                    <i class="fa-solid fa-magnifying-glass-arrow-right"></i>
                </div>
                <h3 style="font-size: 16px; font-weight: 700; color: var(--text-main); margin-bottom: 6px;">
                    Không tìm thấy sản phẩm phù hợp với bộ lọc!
                </h3>
                <p style="font-size: 13px; color: var(--text-muted); margin-bottom: 16px;">
                    Vui lòng thử tìm kiếm bằng từ khóa khác hoặc xóa bớt các điều kiện lọc.
                </p>
                <button type="button" class="btn-cta" onclick="resetAllFilters()" style="padding: 8px 18px; font-size: 13px;">
                    <i class="fa-solid fa-arrow-rotate-left"></i> Xóa tất cả bộ lọc
                </button>
            </div>
        `;
    } else {
        grid.innerHTML = pageItems.map(p => {
            const formattedPrice = formatCurrency(p.price);
            const formattedOldPrice = formatCurrency(p.oldPrice);
            const badgeFav = p.badge ? `<span class="badge-favorite">${p.badge}</span>` : '';
            const discountTag = p.discount ? `<span class="badge-discount-top">${p.discount}</span>` : '';
            const tagSpans = (p.tags || []).map((t, idx) => `<span class="tag-mini ${idx % 2 === 0 ? 'blue' : 'orange'}">${t}</span>`).join('');

            return `
                <div class="product-card" onclick="openProductDetailModal()">
                    ${badgeFav}
                    ${discountTag}
                    <div class="prod-img-box">
                        <img src="${p.image}" alt="${escapeHtml(p.name)}" loading="lazy" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=400&q=80';">
                    </div>
                    <div>
                        <h3 class="prod-title">${escapeHtml(p.name)}</h3>
                        <div class="prod-tags">${tagSpans}</div>
                        <div class="prod-price-row">
                            <span class="prod-price">${formattedPrice}</span>
                            <span class="prod-old-price">${formattedOldPrice}</span>
                        </div>
                    </div>
                    <div class="prod-meta-row">
                        <div class="prod-rating">
                            <i class="fa-solid fa-star"></i> ${p.rating} • Đã bán ${formatSold(p.sold)}
                        </div>
                        <div class="prod-location">${escapeHtml(p.location)}</div>
                    </div>
                </div>
            `;
        }).join('');
    }

    renderPagination(totalPages, filterState.currentPage);
}

function renderPagination(totalPages, currentPage) {
    const wrapper = document.getElementById('paginationWrapper');
    if (wrapper) {
        let html = '';
        const prevDisabled = currentPage <= 1 ? 'disabled' : '';
        html += `<button class="btn-page" ${prevDisabled} onclick="goToPage(${currentPage - 1})"><i class="fa-solid fa-chevron-left"></i></button>`;

        for (let i = 1; i <= totalPages; i++) {
            const activeClass = i === currentPage ? 'active' : '';
            html += `<button class="btn-page ${activeClass}" onclick="goToPage(${i})">${i}</button>`;
        }

        const nextDisabled = currentPage >= totalPages ? 'disabled' : '';
        html += `<button class="btn-page ${nextDisabled} onclick="goToPage(${currentPage + 1})"><i class="fa-solid fa-chevron-right"></i></button>`;

        wrapper.innerHTML = html;
    }

    const miniIndicator = document.getElementById('miniPageIndicator');
    const miniPrev = document.getElementById('miniPrevBtn');
    const miniNext = document.getElementById('miniNextBtn');

    if (miniIndicator) miniIndicator.textContent = `Trang ${currentPage}/${totalPages}`;
    if (miniPrev) miniPrev.disabled = (currentPage <= 1);
    if (miniNext) miniNext.disabled = (currentPage >= totalPages);
}

function goToPage(page) {
    filterState.currentPage = page;
    renderProducts();
    scrollToSection('catalogSec');
}

function renderActiveFilterBadges() {
    const container = document.getElementById('activeFilterBadges');
    if (!container) return;

    let badges = [];

    if (filterState.keyword) {
        badges.push(`
            <span style="background: #e0f2fe; color: #0369a1; padding: 3px 8px; border-radius: 4px; font-size: 11px; font-weight: 600; display: inline-flex; align-items: center; gap: 4px;">
                Từ khóa: "${escapeHtml(filterState.keyword)}"
                <i class="fa-solid fa-xmark" style="cursor: pointer;" onclick="clearKeywordFilter()"></i>
            </span>
        `);
    }

    if (filterState.checkedCategories.length > 0) {
        const catNames = filterState.checkedCategories.map(c => getCategoryDisplayName(c)).join(', ');
        badges.push(`
            <span style="background: #fef3c7; color: #b45309; padding: 3px 8px; border-radius: 4px; font-size: 11px; font-weight: 600; display: inline-flex; align-items: center; gap: 4px;">
                Phân loại: ${catNames}
                <i class="fa-solid fa-xmark" style="cursor: pointer;" onclick="clearCategoryFilter()"></i>
            </span>
        `);
    } else if (filterState.selectedCategory !== 'all') {
        badges.push(`
            <span style="background: #fef3c7; color: #b45309; padding: 3px 8px; border-radius: 4px; font-size: 11px; font-weight: 600; display: inline-flex; align-items: center; gap: 4px;">
                Danh mục: ${getCategoryDisplayName(filterState.selectedCategory)}
                <i class="fa-solid fa-xmark" style="cursor: pointer;" onclick="selectCategoryUI('all', null)"></i>
            </span>
        `);
    }

    if (filterState.minPrice !== null || filterState.maxPrice !== null) {
        const minStr = filterState.minPrice !== null ? formatCurrency(filterState.minPrice) : '0₫';
        const maxStr = filterState.maxPrice !== null ? formatCurrency(filterState.maxPrice) : '∞';
        badges.push(`
            <span style="background: #f1f5f9; color: #334155; padding: 3px 8px; border-radius: 4px; font-size: 11px; font-weight: 600; display: inline-flex; align-items: center; gap: 4px;">
                Giá: ${minStr} - ${maxStr}
                <i class="fa-solid fa-xmark" style="cursor: pointer;" onclick="clearPriceFilter()"></i>
            </span>
        `);
    }

    if (badges.length > 0) {
        badges.push(`
            <button type="button" onclick="resetAllFilters()" style="background: none; border: none; color: #dc2626; font-size: 11px; font-weight: 700; cursor: pointer; text-decoration: underline; margin-left: 6px;">
                Xóa tất cả
            </button>
        `);
        container.innerHTML = badges.join('');
    } else {
        container.innerHTML = '<span style="font-size: 12px; color: #94a3b8;">(Hiển thị toàn bộ danh mục)</span>';
    }
}

function clearKeywordFilter() {
    document.getElementById('searchInput').value = '';
    filterState.keyword = '';
    filterState.currentPage = 1;
    renderProducts();
}

function clearCategoryFilter() {
    selectCategoryUI('all', null);
}

function clearPriceFilter() {
    document.getElementById('filterPriceMin').value = '';
    document.getElementById('filterPriceMax').value = '';
    filterState.minPrice = null;
    filterState.maxPrice = null;
    applyAdvancedFilter();
}

function getCategoryDisplayName(catKey) {
    const map = {
        'ly-giu-nhiet': 'Ly giữ nhiệt',
        'binh-the-thao': 'Bình thể thao',
        'ly-van-phong': 'Ly văn phòng',
        'ly-hoa-tiet': 'Ly in họa tiết',
        'phu-kien': 'Ống hút & Cọ rửa',
        'hop-qua': 'Hộp quà tặng'
    };
    return map[catKey] || catKey;
}

function formatCurrency(num) {
    if (typeof num !== 'number') return num;
    return num.toLocaleString('vi-VN') + '₫';
}

function formatSold(num) {
    if (num >= 1000) {
        return (num / 1000).toFixed(1).replace('.0', '') + 'k';
    }
    return num.toString();
}

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;')
              .replace(/</g, '&lt;')
              .replace(/>/g, '&gt;')
              .replace(/"/g, '&quot;')
              .replace(/'/g, '&#039;');
}


// ========================================================
// 5. HIỂN THỊ VÀ LƯU ĐƠN HÀNG KHI KẾT THÚC GIAO DỊCH
//    XEM LẠI LỊCH SỬ MUA HÀNG (ĐƯỢC NHÓM THEO ĐƠN HÀNG)
// ========================================================

function renderOrderHistory() {
    const list = document.getElementById('orderHistoryList');
    if (!list) return;

    if (MOCK_ORDERS.length === 0) {
        list.innerHTML = `
            <div style="text-align: center; padding: 40px 20px; color: #94a3b8;">
                <i class="fa-solid fa-receipt" style="font-size: 48px; margin-bottom: 12px; display: block;"></i>
                <h4 style="font-size: 16px; color: var(--text-main); margin-bottom: 4px;">Chưa có lịch sử đơn hàng nào</h4>
                <p style="font-size: 13px;">Hãy đặt thử một đơn hàng trên hệ thống để xem lưu trữ nhé!</p>
            </div>
        `;
        return;
    }

    list.innerHTML = MOCK_ORDERS.map(order => {
        let statusBadgeClass = 'status-pending';
        if (order.statusCode === 'delivered') statusBadgeClass = 'status-delivered';
        if (order.statusCode === 'confirmed') statusBadgeClass = 'status-confirmed';
        if (order.statusCode === 'cancelled') statusBadgeClass = 'status-cancelled';

        const itemsHtml = order.items.map((item, idx) => `
            <div style="display: flex; justify-content: space-between; font-size: 13px; padding: 6px 0; ${idx < order.items.length - 1 ? 'border-bottom: 1px dashed #e2e8f0;' : ''}">
                <div>
                    <strong>${escapeHtml(item.name)}</strong>
                    <span style="font-size: 11px; color: var(--text-muted); margin-left: 6px;">(${item.capacity})</span>
                    <span style="color: var(--accent-orange); font-weight: 700; margin-left: 6px;">x ${item.qty}</span>
                </div>
                <span style="font-weight: 700; color: var(--text-main);">${formatCurrency(item.total)}</span>
            </div>
        `).join('');

        return `
            <div class="order-history-card">
                <div class="order-history-header">
                    <div>
                        <strong style="color: var(--primary-color); font-size: 15px;">Mã đơn: #${order.id}</strong>
                        <span style="font-size: 12px; color: var(--text-muted); margin-left: 8px;">
                            <i class="fa-regular fa-calendar-days"></i> Ngày đặt: ${order.date}
                        </span>
                    </div>
                    <span class="order-status-badge ${statusBadgeClass}">
                        <i class="fa-solid fa-circle-dot" style="font-size: 9px; margin-right: 4px;"></i>${order.status}
                    </span>
                </div>
                <div style="margin-bottom: 10px; font-size: 12px; color: var(--text-muted); line-height: 1.6;">
                    <div><i class="fa-solid fa-user"></i> Người nhận: <strong>${escapeHtml(order.customerName)}</strong> - SĐT: <strong>${order.phone}</strong></div>
                    <div><i class="fa-solid fa-location-dot"></i> Giao đến: <strong>${escapeHtml(order.address)}</strong></div>
                    <div><i class="fa-solid fa-wallet"></i> Phương thức thanh toán: <strong>${escapeHtml(order.paymentMethod)}</strong></div>
                </div>
                <div style="background: #f8fafc; border: 1px solid #f1f5f9; padding: 10px 14px; border-radius: 6px; margin-bottom: 12px;">
                    <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: #94a3b8; margin-bottom: 4px;">Danh sách sản phẩm trong đơn:</div>
                    ${itemsHtml}
                </div>
                <div style="display: flex; justify-content: space-between; align-items: baseline; border-top: 1px solid #f1f5f9; padding-top: 8px;">
                    <span style="font-size: 13px; color: var(--text-muted);">Tổng thanh toán đơn hàng:</span>
                    <strong style="color: var(--accent-red); font-size: 18px;">${formatCurrency(order.totalAmount)}</strong>
                </div>
            </div>
        `;
    }).join('');
}

function finishOrderDemo() {
    closeModal('checkoutModal');

    const customer = (currentUserDisplay && currentUserDisplay.name) ? currentUserDisplay.name : 'Nguyễn Văn An';
    const isNewAddr = document.querySelector('input[name="deliveryAddr"][value="new"]')?.checked;
    
    let address = '123 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh';
    if (isNewAddr) {
        const detailStreet = document.getElementById('newAddrDetail')?.value.trim();
        const city = document.getElementById('newAddrCity')?.value;
        const district = document.getElementById('newAddrDistrict')?.value.trim();
        if (detailStreet || district) {
            address = `${detailStreet || 'Số nhà mới'}, ${district || 'Quận mới'}, ${city || 'TP. Hồ Chí Minh'}`;
        }
    }

    const isCod = document.querySelector('input[name="payMethod"][value="cod"]')?.checked;
    const paymentMethod = isCod ? 'Tiền mặt khi nhận hàng (COD)' : 'Trực tuyến (Chuyển khoản / Ví điện tử)';

    const newOrderId = `DH100${MOCK_ORDERS.length + 1}`;
    const today = new Date().toISOString().slice(0, 10);

    const customerPhone = (currentUserDisplay && currentUserDisplay.phone) ? currentUserDisplay.phone : '0912345678';
    if (!isNewAddr && currentUserDisplay && currentUserDisplay.address) {
        address = currentUserDisplay.address;
    }

    const newOrder = {
        id: newOrderId,
        date: today,
        customerName: customer,
        phone: customerPhone,
        address: address,
        paymentMethod: paymentMethod,
        status: 'Đã đặt thành công',
        statusCode: 'confirmed',
        items: [
            { name: 'Ly Giữ Nhiệt Cao Cấp Inox 304 Nắp Khóa Chống Tràn Mr.Huy', capacity: '900ml', qty: 1, price: 189000, total: 189000 },
            { name: 'Bình Giữ Nhiệt Thể Thao 1000ml Sơn Tĩnh Điện Inox 316', capacity: '1000ml', qty: 2, price: 215000, total: 430000 }
        ],
        shippingFee: 0,
        totalAmount: 619000
    };

    MOCK_ORDERS.unshift(newOrder);

    const badge = document.querySelector('.cart-badge');
    if (badge) badge.textContent = '0';

    renderOrderHistory();

    showToast(
        `Đã đặt thành công đơn hàng #${newOrder.id} - Tổng tiền: ${formatCurrency(newOrder.totalAmount)}. Giao tới: ${newOrder.address}`,
        'success',
        'Đặt hàng thành công'
    );

    openOrderHistoryModal();
}

function openOrderHistoryModal() {
    const dropdown = document.getElementById('userMenuDropdown');
    if (dropdown) dropdown.classList.remove('show');
    renderOrderHistory();
    openModal('orderHistoryModal');
}


// ========================================================
// 6. MODAL CHI TIẾT SẢN PHẨM: BẤM VÀO BẤT KỲ SẢN PHẨM NÀO
//    ĐỀU CHỈ HƯỚNG VỀ 1 SẢN PHẨM DUY NHẤT THEO YÊU CẦU
// ========================================================

function openProductDetailModal() {
    // Luôn luôn thiết lập thông tin hiển thị là sản phẩm chủ lực duy nhất
    const flagshipProduct = {
        id: 'SP-MRHUY-01',
        name: 'Ly Giữ Nhiệt Cao Cấp Inox 304 Iced Americano Kèm Ống Hút Mr.Huy (600ml)',
        price: '189.000₫',
        oldPrice: '250.000₫',
        sold: '3.4k',
        rating: '4.9 (1.2k+ đánh giá)',
        image: 'img/ly-giu-nhiet-1.png',
        desc: 'Chất liệu ruột Inox 304 cao cấp đạt chuẩn an toàn vệ sinh thực phẩm quốc tế. Công nghệ cách nhiệt chân không kép giữ nóng 8 tiếng, giữ lạnh đá viên liên tục 18 tiếng không đọng sương bên ngoài. Nắp đậy có khóa chốt chống rỉ nước 100%, tích hợp lỗ uống trực tiếp và cắm ống hút tiện lợi.'
    };

    const titleEl = document.getElementById('dModalTitle');
    const nameEl = document.getElementById('dProdName');
    const idEl = document.getElementById('dProdId');
    const priceEl = document.getElementById('dProdPrice');
    const oldPriceEl = document.getElementById('dProdOldPrice');
    const descEl = document.getElementById('dProdDesc');
    const imgEl = document.getElementById('dProdImg');
    const soldEl = document.getElementById('dProdSold');
    const ratingEl = document.getElementById('dProdRating');

    if (titleEl) titleEl.textContent = `Chi Tiết: ${flagshipProduct.name}`;
    if (nameEl) nameEl.textContent = flagshipProduct.name;
    if (idEl) idEl.textContent = flagshipProduct.id;
    if (priceEl) priceEl.textContent = flagshipProduct.price;
    if (oldPriceEl) oldPriceEl.textContent = flagshipProduct.oldPrice;
    if (descEl) descEl.textContent = flagshipProduct.desc;
    if (imgEl) imgEl.src = flagshipProduct.image;
    if (soldEl) soldEl.textContent = flagshipProduct.sold;
    if (ratingEl) ratingEl.innerHTML = `<i class="fa-solid fa-star"></i> ${flagshipProduct.rating}`;

    const qtyInput = document.getElementById('detailQtyInput');
    if (qtyInput) qtyInput.value = 1;

    openModal('productDetailModal');
}

function adjustQty(delta) {
    const input = document.getElementById('detailQtyInput');
    let v = parseInt(input.value) || 1;
    v += delta;
    if (v < 1) v = 1;
    input.value = v;
}

function openCartModal() {
    closeModal('productDetailModal');
    openModal('cartModal');
}

function openCheckoutModal() {
    closeModal('cartModal');
    closeModal('productDetailModal');
    openModal('checkoutModal');
}

function toggleAddressMock(isDefault) {
    const defBox = document.getElementById('defaultAddrBox');
    const newBox = document.getElementById('newAddrBox');
    if (isDefault) {
        defBox.style.display = 'block';
        newBox.style.display = 'none';
    } else {
        defBox.style.display = 'none';
        newBox.style.display = 'block';
    }
}

// Modal generic helpers
function openModal(id) {
    const el = document.getElementById(id);
    if (el) el.classList.add('active');
}

function closeModal(id) {
    const el = document.getElementById(id);
    if (el) el.classList.remove('active');
}

function scrollToSection(id) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
}

// ========================================================
// HERO PRODUCT SLIDESHOW (LƯỚT QUA TỪNG SẢN PHẨM MỖI 2 GIÂY)
// ========================================================
let heroSlideshowIndex = 0;
let heroSlideshowTimer = null;

function updateHeroProductSlide(idx) {
    if (typeof PRODUCTS_DATA === 'undefined' || !PRODUCTS_DATA || PRODUCTS_DATA.length === 0) return;
    heroSlideshowIndex = (idx + PRODUCTS_DATA.length) % PRODUCTS_DATA.length;
    const prod = PRODUCTS_DATA[heroSlideshowIndex];
    if (!prod) return;

    const imgEl = document.getElementById('heroShowcaseImg');
    const catEl = document.getElementById('heroShowcaseCat');
    const nameEl = document.getElementById('heroShowcaseName');
    const priceEl = document.getElementById('heroShowcasePrice');
    const indexEl = document.getElementById('heroShowcaseIndex');
    const cardEl = document.getElementById('heroShowcaseCard');
    const progressBar = document.getElementById('heroShowcaseProgress');

    if (imgEl) {
        imgEl.style.opacity = '0';
        imgEl.style.transform = 'scale(0.92)';
        setTimeout(() => {
            imgEl.src = prod.image;
            imgEl.alt = prod.name;
            imgEl.style.opacity = '1';
            imgEl.style.transform = 'scale(1)';
        }, 150);
    }

    if (catEl) catEl.textContent = getCategoryDisplayName(prod.category);
    if (nameEl) {
        nameEl.textContent = prod.name;
        nameEl.title = prod.name;
    }
    if (priceEl) priceEl.textContent = formatCurrency(prod.price);
    if (indexEl) indexEl.textContent = `${heroSlideshowIndex + 1}/${PRODUCTS_DATA.length}`;
    if (cardEl) {
        cardEl.onclick = () => openProductDetailModal();
    }

    // Reset and animate progress bar
    if (progressBar) {
        progressBar.style.transition = 'none';
        progressBar.style.width = '0%';
        setTimeout(() => {
            progressBar.style.transition = 'width 5s linear';
            progressBar.style.width = '100%';
        }, 30);
    }

    // Update active dot
    const dots = document.querySelectorAll('.slider-controls .slider-dot');
    if (dots.length > 0) {
        dots.forEach(d => d.classList.remove('active'));
        const dotIdx = Math.floor(heroSlideshowIndex / (PRODUCTS_DATA.length / dots.length));
        if (dots[dotIdx]) dots[dotIdx].classList.add('active');
    }
}

function jumpHeroSlide(idx) {
    updateHeroProductSlide(idx);
    startHeroSlideshow();
}

function startHeroSlideshow() {
    if (heroSlideshowTimer) clearInterval(heroSlideshowTimer);
    heroSlideshowTimer = setInterval(() => {
        updateHeroProductSlide(heroSlideshowIndex + 1);
    }, 5000);
}

function initHeroSlideshow() {
    const card = document.getElementById('heroShowcaseCard');
    if (!card) return;
    updateHeroProductSlide(0);
    startHeroSlideshow();

    card.addEventListener('mouseenter', () => {
        if (heroSlideshowTimer) clearInterval(heroSlideshowTimer);
    });
    card.addEventListener('mouseleave', () => {
        startHeroSlideshow();
    });
}

// Tự động khởi tạo render khi tải trang
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    renderOrderHistory();
    initHeroSlideshow();
});
