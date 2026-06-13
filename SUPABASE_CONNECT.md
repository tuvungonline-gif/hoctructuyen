# Kết nối Supabase cho EduVideo trên Railway

Repo đã có bước kết nối nền tảng đầu tiên:

- Server có endpoint `/api/config`.
- Frontend có file `production-status.js` để kiểm tra đã cấu hình Supabase chưa.
- Database schema nằm ở `supabase/schema.sql`.
- Trigger tạo profile nằm ở `supabase/auth_profile_trigger.sql`.

## 1. Tạo Supabase project

Vào Supabase và tạo project mới.

Lấy 2 thông tin public:

```text
Project URL
Anon public key
```

## 2. Chạy database schema

Trong Supabase SQL Editor, chạy lần lượt:

```text
supabase/schema.sql
supabase/auth_profile_trigger.sql
```

File `schema.sql` tạo bảng dữ liệu chính.
File `auth_profile_trigger.sql` giúp tự tạo profile khi user đăng ký tài khoản.

## 3. Cấu hình biến môi trường trên Railway

Vào Railway project -> service -> Variables.

Thêm 2 biến:

```text
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

Không đưa service role key lên frontend.

## 4. Redeploy Railway

Sau khi thêm biến môi trường, bấm Redeploy.

Mở domain Railway và kiểm tra:

```text
/api/config
```

Nếu đúng sẽ có:

```json
{
  "productionReady": true
}
```

## 5. Kiểm tra badge trên web

Khi mở web, góc dưới bên phải sẽ hiển thị:

```text
Production: Supabase đã cấu hình
```

Nếu chưa có biến môi trường sẽ hiện:

```text
Demo: chưa cấu hình Supabase
```

## 6. Bước tiếp theo sau khi badge xanh

Sau khi badge báo Supabase đã cấu hình, mới bắt đầu thay logic:

1. Đăng nhập demo -> Supabase Auth.
2. Đăng ký demo -> Supabase Auth.
3. Khóa học mock -> bảng courses.
4. Bài học mock -> bảng lessons.
5. Quyền học localStorage -> bảng enrollments.
6. Tiến độ localStorage -> bảng lesson_progress.
7. Thanh toán demo -> backend/webhook.
8. Video placeholder -> signed video URL.

## 7. Cảnh báo

Không nên thay toàn bộ localStorage sang Supabase một lần.

Nên làm từng module:

- Auth trước.
- Courses sau.
- Enrollments sau.
- Payments sau cùng.

Lý do: nếu thay toàn bộ cùng lúc, rất dễ lỗi trắng trang hoặc học viên mất quyền học.
