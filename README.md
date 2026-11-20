# Mr.Huy - GIAO DIỆN WEBSITE BÁN HÀNG BÌNH GIỮ NHIỆT (MOCKUP FRONTEND)
> **Đồ án môn học:** Lập trình web và ứng dụng nâng cao - Khoa CNTT, Trường Đại học Sài Gòn (SGU)  
> **Giảng viên hướng dẫn & chấm thi:** Cô PHAN THỊ KIM LOAN  
> **Yêu cầu đề thi:** *"Thực hiện GIAO DIỆN website sử dụng HTML, CSS, Js... Mọi chức năng của website không được hoạt động, không có cơ sở dữ liệu dưới mọi hình thức."*  
> **Cách thức chấm bài:** Mở trực tiếp file `index.html` hoặc `admin.html` trên trình duyệt Google Chrome máy laptop của giảng viên.

---

## 🎯 BẢNG ĐỐI CHIẾU TIÊU CHÍ GIAO DIỆN (12 ĐIỂM SGU)

### PHẦN 1: GIAO DIỆN CHO NGƯỜI DÙNG CUỐI (END-USER) - 5.0 ĐIỂM
| STT | Tiêu chí đánh giá | Điểm | Cách thức trình diễn trên Giao diện (`index.html`) |
|:---:|:---|:---:|:---|
| 1 | **Giao diện hiển thị sản phẩm theo phân loại** | 0.5 | Khối **"DANH MỤC NỔI BẬT"** gồm 6 nhóm (*Ly giữ nhiệt, Bình thể thao, Ly văn phòng, Ly in họa tiết, Ống hút & Cọ rửa, Hộp quà tặng*) và danh mục checkbox cột bên trái. Click phân loại nào lọc chính xác sản phẩm phân loại đó. |
| 2 | **Giao diện hiển thị chi tiết sản phẩm** | 0.5 | Bấm vào bất kỳ thẻ sản phẩm nào trên trang. Modal hiển thị đầy đủ: hình ảnh, tên, mã SP, dung tích, giá niêm yết, % giảm, mô tả chất liệu inox 304/316, nút chọn số lượng, Thêm vào giỏ và Mua ngay. |
| 3 | **Giao diện tìm kiếm cơ bản theo tên sản phẩm** (tìm tương đối) | 0.5 | Thanh tìm kiếm trên header: nhập tên bình (ly, thể thao, 304,...) và các thẻ từ khóa gợi ý bên dưới. Lọc tương đối không phân biệt hoa thường. |
| 4 | **Giao diện tìm kiếm nâng cao** (kết hợp nhiều điều kiện) | 0.25 | Cột bên trái **"BỘ LỌC TÌM KIẾM NÂNG CAO"** kết hợp đồng thời: Checkbox Danh mục + Nơi bán (TP.HCM / Hà Nội / Đà Nẵng) + Dung tích (500ml, 750ml, 900ml...) + Khoảng giá (Từ ... Đến ... hoặc chọn nhanh) + Đánh giá sao. Bấm "Áp dụng bộ lọc" lọc đa điều kiện. |
| 5 | **Giao diện hiển thị sản phẩm và kết quả dạng phân trang** | 0.5 | Danh sách **20 sản phẩm** đầy đủ mẫu mã kèm thanh phân trang 4 trang (`< 1 2 3 4 >`) và thanh phân trang mini góc trên, chuyển trang tức thì. |
| 6 | **Giao diện đăng ký làm người mua hàng** (trên người dùng đầu cuối) | 0.5 | Bấm **"Đăng ký"** trên topbar. Form đăng ký tài khoản khách hàng mới yêu cầu: username, password, họ tên người mua, SĐT nhận hàng, email, địa chỉ giao hàng mặc định. |
| 7 | **Giao diện giỏ hàng**: | 0.5 | Bấm icon Giỏ hàng trên header. Hiển thị danh sách các món, số lượng (+/-), ghi chú khắc chữ laser, tổng tiền tạm tính. |
| 8 | • **Yêu cầu phải đăng nhập và tự hiển thị thông tin người đăng nhập** | 0.5 | Trong form thanh toán: tự động hiển thị thông tin người mua gồm **Họ tên, SĐT, Email, Username** của khách hàng đang đăng nhập. |
| 9 | • **Cho phép chọn địa chỉ của tài khoản mua hoặc nhập địa chỉ mới** | 0.5 | Form thanh toán có 2 lựa chọn: *Sử dụng địa chỉ mặc định của tài khoản* HOẶC *Nhập địa chỉ giao hàng mới* (chọn Tỉnh/Thành phố, Quận/Huyện, tên đường). |
| 10 | • **Cho phép chọn hình thức chi trả** (Trực tuyến hoặc Tiền mặt) | 0.25 | Hai phương thức rõ ràng: *Tiền mặt khi nhận hàng (COD)* hoặc *Trực tuyến (Chuyển khoản / Ví Momo)*. (Đúng quy định đề thi: Không yêu cầu trang thanh toán thật). |
| 11 | **Giao diện hiển thị và lưu đơn hàng khi kết thúc giao dịch** | 0.5 | Bấm "Xác nhận đặt hàng", hệ thống hiển thị thông báo giao dịch thành công kèm mã đơn hàng. |
| 12 | **Giao diện xem lại lịch sử mua hàng của người mua** | 0.5 | Bấm vào menu tài khoản chọn **"Lịch sử mua hàng"**. Giao diện hiển thị các đơn hàng đã đặt, được **nhóm theo từng đơn hàng**, có trạng thái đơn, ngày đặt, địa chỉ, hình thức thanh toán, danh sách sản phẩm và tổng tiền. |

---

### PHẦN 2: GIAO DIỆN CHO NGƯỜI QUẢN TRỊ (WEB-ADMIN) - 5.0 ĐIỂM
> **URL Quản trị:** `admin.html` (URL hoàn toàn tách biệt với người dùng bình thường theo đúng đề thi)

| STT | Tiêu chí đánh giá | Điểm | Cách thức trình diễn trên Giao diện Admin (`admin.html`) |
|:---:|:---|:---:|:---|
| 1 | **Chức năng đăng nhập & đăng xuất** (URL khác người dùng) | 0.5 | Truy cập `admin.html`. Topbar hiển thị tài khoản Quản trị viên và nút Đăng xuất Admin ở góc phải. |
| 2 | **Giao diện quản lý user** (thêm, sửa, khoá/mở user) | 0.5 | Vào mục **"Quản lý Người dùng"**: <br>- Bấm "Thêm tài khoản mới" để xem form tạo user.<br>- Bấm "Sửa" để xem form cập nhật.<br>- Bấm nút **"Khóa" / "Mở Khóa"** chuyển đổi trạng thái giao diện trực quan giữa *Hoạt động* và *Đã bị khóa*. |
| 3 | **Thêm sản phẩm**: đúng phân loại - có upload hình (hiển thị hình ảnh trước khi thêm) | 0.5 | Vào mục **"Quản lý Sản phẩm"** $\rightarrow$ Bấm "Thêm sản phẩm mới". Chọn đúng danh mục, dung tích, giá. Nút chọn file ảnh từ máy tính có **khung xem trước hình ảnh ngay lập tức** trước khi bấm Lưu. |
| 4 | **Sửa sản phẩm**: hiển thị đúng thông tin trước khi sửa | 0.5 | Bấm nút **"Sửa"** tại sản phẩm. Form hiển thị đúng tên, đúng phân loại danh mục và ảnh cũ trước khi chỉnh sửa. |
| 5 | **Xoá sản phẩm**: kiểm tra nếu đã bán thì ẩn, chưa bán thì hỏi lại và xóa | 0.75 | Bấm nút **"Xóa"** tại từng sản phẩm:<br>• **Sản phẩm SP001 / SP002 (Đã bán):** Hệ thống cảnh báo sản phẩm đã được bán ra trong đơn hàng và tự động **chuyển sang trạng thái ẨN** trên web người dùng để bảo toàn dữ liệu lịch sử đơn.<br>• **Sản phẩm SP099 (Chưa từng bán):** Hệ thống hỏi lại xác nhận và tiến hành xóa hẳn dòng sản phẩm khỏi bảng. |
| 6 | **Quản lý đơn hàng: Cập nhật tình trạng 1 chiều** | 0.5 | Vào mục **"Quản lý Đơn hàng"**: <br>• Đơn `Chưa xác nhận` chỉ có nút chuyển sang `Đã xác nhận` hoặc `Hủy`.<br>• Đơn `Đã xác nhận` chỉ có nút chuyển sang `Giao thành công` hoặc `Hủy` (**KHÔNG CHO PHÉP cập nhật ngược** về Chưa xác nhận).<br>• Đơn đã giao thành công sẽ bị khóa trạng thái hoàn tất 1 chiều. |
| 7 | **Quản lý đơn hàng: Bộ lọc đa năng** | 0.75 | Bảng điều khiển bộ lọc kết hợp:<br>• Theo **tình trạng đơn hàng**.<br>• Theo **khoảng thời gian đặt hàng** (*Từ ngày ... Đến ngày ...*).<br>• Theo **địa điểm giao hàng** (*TP.HCM, Hà Nội, Đà Nẵng / Quận 1, Quận Cầu Giấy, Quận Hải Châu...*). |
| 8 | **Thống kê: Top 5 khách hàng có mức mua cao nhất** | 1.0 | Vào mục **"Thống kê Top Khách hàng"**: Có sẵn bộ chọn Từ ngày - Đến ngày. Bảng dữ liệu **sắp xếp giảm dần theo tổng tiền mua**, hiển thị đúng **Top 5 khách hàng cao nhất** (Hạng 1 đến Hạng 5), **liệt kê từng đơn hàng** kèm **link click xem chi tiết từng đơn hàng**. |
