# Checklist hoàn thiện 100% Production EduVideo

Checklist này dành cho bản chạy thật với Railway + Supabase + Cloudflare R2.

## 1. Railway Variables

Bắt buộc thêm đủ:

```text
SUPABASE_URL
SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
R2_ACCOUNT_ID
R2_ACCESS_KEY_ID
R2_SECRET_ACCESS_KEY
R2_BUCKET_NAME
R2_PUBLIC_URL
```

Sau khi thêm biến, bấm Redeploy.

## 2. Supabase SQL

Chạy theo đúng thứ tự:

```text
supabase/schema.sql
supabase/auth_profile_trigger.sql
supabase/video_r2_patch.sql
```

## 3. Supabase admin user

1. Tạo tài khoản admin bằng Supabase Auth.
2. Vào bảng `profiles`.
3. Đổi role của tài khoản đó thành:

```text
admin
```

Không cho frontend tự set admin.

## 4. Tạo dữ liệu thật

Tạo ít nhất:

- 1 course published.
- 1 lesson published.
- 1 student user.
- 1 enrollment active cho student và course đó.

## 5. Kiểm tra server

Mở:

```text
/health
/api/config
```

`/api/config` phải có:

```json
{
  "productionReady": true,
  "r2Ready": true,
  "videoMode": "r2-signed-url"
}
```

## 6. Upload video lên R2

Mở:

```text
/r2-console.html
```

Thực hiện:

1. Dán Base URL Railway.
2. Dán Admin Supabase Access Token.
3. Nhập Course ID.
4. Nhập Lesson ID.
5. Chọn video.
6. Bấm Tạo signed upload URL.
7. Bấm Upload video lên R2.
8. Bấm Gắn video vào lesson.

## 7. Test học viên xem video

Trong `r2-console.html`:

1. Dán Student Supabase Access Token.
2. Nhập Lesson ID.
3. Bấm Lấy signed URL xem video.
4. Video player phải phát được video.

Nếu báo `No lesson access`, kiểm tra bảng `enrollments`.

## 8. Kiểm tra quyền bảo mật

- User chưa đăng nhập gọi `/api/video/:lessonId/signed-url` phải bị 401.
- User chưa có enrollment active phải bị 403.
- Non-admin gọi `/api/admin/r2/presign-upload` phải bị 403.
- R2 secret không xuất hiện trong DevTools frontend.
- Supabase service role key không xuất hiện trong DevTools frontend.

## 9. Việc frontend còn cần làm để mượt hơn

Hiện đã có API production và console upload video. Để giao diện người dùng cuối hoàn chỉnh hơn, cần nối thêm:

- Form upload video trực tiếp trong Admin Studio.
- Trang học video tự gọi `/api/video/:lessonId/signed-url`.
- Danh sách khóa học đọc từ Supabase thay vì mock/localStorage.
- Đăng nhập/đăng ký dùng Supabase Auth thay vì demo.
- Thanh toán thật qua webhook.

## 10. Cảnh báo dữ liệu

Trước khi bán thật:

- Backup database.
- Kiểm tra RLS.
- Kiểm tra role admin.
- Kiểm tra payment webhook.
- Kiểm tra signed URL hết hạn đúng.
- Kiểm tra học viên không thể xem video khóa chưa mua.
