# Bắt đầu chạy thật EduVideo

File này là hướng dẫn ngắn để chuyển từ bản demo localStorage sang bản production.

## 1. Bật frontend chạy công khai

Vào GitHub repo:

```text
Settings -> Pages -> Build and deployment -> GitHub Actions
```

Repo đã có workflow:

```text
.github/workflows/static-pages.yml
```

Link dự kiến sau khi deploy:

```text
https://tuvungonline-gif.github.io/hoctructuyen/
```

## 2. Tạo backend/database

Khuyến nghị giai đoạn đầu: Supabase.

Lý do:

- Có Auth để đăng nhập/đăng ký.
- Có Postgres database.
- Có Row Level Security để phân quyền dữ liệu.
- Có Storage/Edge Functions nếu cần mở rộng.

## 3. Chạy schema database

Trong Supabase, mở SQL Editor và chạy file:

```text
supabase/schema.sql
```

Schema này đã chuẩn bị các bảng chính:

- profiles
- courses
- lessons
- orders
- enrollments
- lesson_progress
- lesson_notes
- lesson_questions
- notifications
- support_tickets
- course_reviews
- schedules
- certificates

## 4. Cấu hình môi trường

Xem file mẫu:

```text
.env.example
```

Không đưa key thật lên GitHub.

Các biến public có thể dùng ở frontend:

```text
SUPABASE_URL
SUPABASE_ANON_KEY
```

Các biến bí mật chỉ dùng ở backend/edge functions:

```text
SUPABASE_SERVICE_ROLE_KEY
PAYMENT_WEBHOOK_SECRET
VIDEO_SIGNING_SECRET
```

## 5. Thứ tự nối code thật

### Bước 1: Auth thật

Thay đăng nhập demo bằng Supabase Auth.

Không dùng:

- password trong localStorage
- role admin từ frontend
- tài khoản demo làm tài khoản thật

### Bước 2: Khóa học thật

Thay mảng `courses` trong `app.js` bằng dữ liệu từ bảng:

- courses
- lessons

### Bước 3: Quyền học thật

Trang học video phải kiểm tra bảng:

```text
enrollments
```

Chỉ enrollment có `status = active` mới được học.

### Bước 4: Thanh toán thật

Không xác nhận thanh toán ở frontend.

Luồng đúng:

1. Tạo order pending.
2. Chuyển sang cổng thanh toán.
3. Backend nhận webhook.
4. Backend xác minh webhook.
5. Backend đổi order thành paid.
6. Backend tạo enrollment active.

### Bước 5: Bảo vệ video thật

Không để video trả phí ở link công khai.

Backend phải kiểm tra quyền học trước khi trả link video. Tốt nhất dùng signed URL/token có thời hạn.

### Bước 6: Tiến độ học thật

Lưu vào bảng:

```text
lesson_progress
```

Không dùng localStorage cho tiến độ thật.

## 6. Checklist trước khi bán thật

- User chưa mua không xem được video trả phí.
- User A không xem được tiến độ/ghi chú của User B.
- Admin role không thể tự set từ frontend.
- Thanh toán chỉ được xác nhận bằng webhook.
- Video trả phí dùng signed URL/token.
- Database bật Row Level Security.
- Có backup database.
- Có chính sách điều khoản/quyền riêng tư/hoàn tiền rõ ràng.

## 7. Tài liệu chi tiết

Xem thêm:

```text
PRODUCTION_ROADMAP.md
QA_CHECKLIST.md
supabase/schema.sql
```
