# EduVideo - Website học trực tuyến qua video

Đây là bản giao diện nền cho website học trực tuyến qua video, đã hoàn thành đến **Phần 2: đăng nhập demo, tài khoản học viên, quyền học và tiến độ học tập ở mức frontend**.

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

## Chức năng phần 2 đã thêm

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
- Admin demo có thể mở quyền, tạm khóa hoặc đưa về trạng thái chờ duyệt.
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

Ở bản thật, các phần liên quan đến tài khoản, thanh toán, video và quyền truy cập phải được kiểm tra ở backend/API/server. Không được chỉ dựa vào localStorage hoặc frontend để bảo vệ video khóa học.

## Cấu trúc file

```text
video-learning-web/
├── index.html
├── styles.css
├── app.js
└── README.md
```

## Gợi ý phần tiếp theo

Phần 3 nên làm: thiết kế và chuẩn bị cấu trúc backend/database cho người dùng, khóa học, bài học, đăng ký khóa học và tiến độ học tập. Trước khi nối thanh toán thật cần hoàn thiện phân quyền server-side.
