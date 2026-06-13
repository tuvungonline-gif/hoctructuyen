# EduVideo - Website học trực tuyến qua video

Đây là bản giao diện nền cho website học trực tuyến qua video, đã hoàn thành đến **Phần 3: checkout demo, đơn đăng ký, tài khoản học viên, quyền học, tiến độ học tập, ghi chú/hỏi đáp và khung chuẩn bị backend/database**.

## Cách chạy

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
- Trang backend/database mô tả bảng dữ liệu, API tối thiểu và checklist bảo mật.
- Có nút reset dữ liệu demo.

## Lưu ý an toàn

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

Ở bản thật, các phần liên quan đến tài khoản, thanh toán, video và quyền truy cập phải được kiểm tra ở backend/API/server. Không được chỉ dựa vào localStorage hoặc frontend để bảo vệ video khóa học.

## Cấu trúc file

```text
hoctructuyen/
├── index.html
├── styles.css
├── app.js
├── part3.css
├── part3.js
└── README.md
```

## Cách test phần 3

1. Đăng nhập học viên demo.
2. Vào một trang chi tiết khóa học.
3. Bấm **Đăng ký / mua khóa học**.
4. Tạo đơn bằng checkout demo.
5. Vào **Tài khoản** để xem đơn.
6. Đăng nhập admin demo.
7. Vào **Quản trị** để xác nhận đơn và mở quyền học.
8. Vào trang học video để test ghi chú và hỏi đáp.
9. Vào menu **Backend** để xem kế hoạch nối database/API thật.

## Gợi ý phần tiếp theo

Phần tiếp theo nên làm: nối backend thật cho đăng nhập, database, thanh toán/webhook, bảo vệ video bằng server-side authorization và lưu tiến độ học thật.