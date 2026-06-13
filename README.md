# EduVideo - Website học trực tuyến qua video

Đây là bản website học trực tuyến qua video ở mức **frontend hoàn thiện để demo/MVP**, đã có giao diện học viên, quản trị, checkout demo, quyền học, tiến độ học tập, ghi chú, hỏi đáp, dashboard, chứng chỉ demo, thông báo và khung chuẩn bị backend/database.

## Cách chạy local

Mở trực tiếp file:

```bash
index.html
```

Hoặc chạy bằng server tĩnh:

```bash
python3 -m http.server 8080
```

Sau đó mở:

```text
http://localhost:8080
```

## Tài khoản demo

### Học viên

```text
Email: hocvien@example.com
Mật khẩu: 123456
```

### Admin

```text
Email: admin@example.com
Mật khẩu: admin123
```

## Các trang đã có

1. Trang chủ.
2. Trang danh sách khóa học.
3. Trang chi tiết khóa học.
4. Trang học video.
5. Trang đăng nhập / đăng ký demo.
6. Trang tài khoản học viên.
7. Trang quản trị khóa học và quyền học cơ bản.
8. Trang checkout demo.
9. Trang kế hoạch backend/database.
10. Trang dashboard học viên.
11. Trang chứng chỉ demo.
12. Trang thông báo/nhắc học.
13. Trang cài đặt tài khoản.
14. Trang admin studio quản trị nội dung demo.

## Chức năng đã có

- Đăng nhập demo bằng tài khoản học viên hoặc admin.
- Đăng ký tài khoản học viên mới bằng dữ liệu localStorage.
- Đăng xuất.
- Hiển thị khóa học của từng học viên.
- Trạng thái quyền học:
  - Chưa đăng ký.
  - Chờ duyệt.
  - Đã mở quyền.
  - Tạm khóa.
- Chặn trang học video nếu chưa đăng nhập.
- Chặn trang học video nếu chưa được mở quyền.
- Học viên có thể đánh dấu bài đã học.
- Tiến độ học được tính theo số bài đã hoàn thành.
- Tiến độ và quyền học lưu trong localStorage.
- Trang checkout demo để tạo đơn đăng ký/thanh toán mẫu.
- Học viên có thể xem đơn đăng ký/thanh toán demo trong tài khoản.
- Admin demo có thể xem đơn, xác nhận đơn và mở quyền học.
- Học viên có thể lưu ghi chú cá nhân trong từng bài học.
- Học viên có thể gửi câu hỏi trong từng bài học.
- Dashboard học viên có thống kê tiến độ, khóa đang học và mục tiêu học tập.
- Trang chứng chỉ demo theo điều kiện hoàn thành 100% khóa học.
- Trang thông báo/nhắc học có trạng thái đọc/chưa đọc.
- Admin có thể gửi thông báo demo.
- Trang cài đặt tài khoản cho phép sửa hồ sơ và tùy chọn học tập demo.
- Admin studio cho phép tạo/xóa khóa học demo bằng localStorage.
- Tìm kiếm khóa học trên trang danh sách khóa học.
- Thanh điều hướng nhanh dưới màn hình cho mobile.
- Trang backend/database mô tả bảng dữ liệu, API tối thiểu và checklist bảo mật.
- Có workflow GitHub Pages cho web tĩnh.
- Có nút reset dữ liệu demo.

## Cấu trúc file

```text
hoctructuyen/
├── index.html
├── styles.css
├── app.js
├── part3.css
├── part3.js
├── part4.css
├── part4.js
├── README.md
└── .github/workflows/static-pages.yml
```

## Cách test luồng học viên

1. Đăng nhập học viên demo.
2. Vào **Dashboard** để xem tổng quan học tập.
3. Vào **Khóa học** và tìm kiếm khóa học.
4. Mở chi tiết khóa học.
5. Bấm **Đăng ký / mua khóa học**.
6. Tạo đơn bằng checkout demo.
7. Vào **Tài khoản** để xem đơn.
8. Vào khóa đã mở quyền để học video.
9. Đánh dấu bài đã học.
10. Lưu ghi chú bài học.
11. Gửi câu hỏi bài học.
12. Vào **Chứng chỉ** để xem điều kiện cấp chứng chỉ.
13. Vào **Thông báo** để xem nhắc học.
14. Vào **Cài đặt** bằng đường dẫn `#/settings` để sửa hồ sơ demo.

## Cách test luồng admin

1. Đăng nhập admin demo.
2. Vào **Quản trị** để xem học viên, quyền học và đơn đăng ký.
3. Xác nhận đơn để mở quyền học.
4. Vào **Thông báo** để gửi thông báo demo.
5. Vào `#/admin-content` để mở Admin Studio quản trị nội dung demo.
6. Tạo khóa học demo và kiểm tra danh sách.
7. Vào **Backend** để xem kế hoạch nối database/API thật.

## GitHub Pages

Repo đã có workflow:

```text
.github/workflows/static-pages.yml
```

Để bật web chạy trực tiếp:

1. Vào repo trên GitHub.
2. Mở **Settings**.
3. Vào **Pages**.
4. Ở mục **Build and deployment**, chọn **GitHub Actions**.
5. Chạy lại workflow nếu cần.

Link dự kiến sau khi Pages hoạt động thường có dạng:

```text
https://tuvungonline-gif.github.io/hoctructuyen/
```

## Lưu ý an toàn bắt buộc

Bản này **chưa tích hợp backend thật**, vì vậy chưa được dùng để bảo vệ video thật hoặc thanh toán thật.

Các phần sau vẫn đang là demo frontend:

- Đăng nhập.
- Đăng ký tài khoản.
- Phân quyền học viên/admin.
- Mở khóa học.
- Lưu tiến độ học.
- Quản trị học viên.
- Quản trị khóa học.
- Đơn đăng ký/thanh toán.
- Ghi chú/hỏi đáp bài học.
- Chứng chỉ.
- Thông báo.

Ở bản thật, các phần liên quan đến tài khoản, thanh toán, video và quyền truy cập phải được kiểm tra ở backend/API/server. Không được chỉ dựa vào localStorage hoặc frontend để bảo vệ video khóa học.

## Phần tiếp theo nếu muốn chạy thương mại thật

1. Chọn backend: Node.js/Express, NestJS, Laravel hoặc Supabase.
2. Thiết kế database thật cho users, courses, lessons, orders, enrollments, progress, questions, certificates.
3. Tích hợp đăng nhập bảo mật.
4. Tích hợp thanh toán và webhook.
5. Bảo vệ video bằng signed URL/token có thời hạn.
6. Lưu tiến độ học thật trên server.
7. Phân quyền admin/học viên bằng server-side authorization.
8. Backup database trước mỗi lần deploy lớn.
