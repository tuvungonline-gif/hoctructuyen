# Cấu hình Cloudflare R2 cho video khóa học

Tài liệu này dùng khi chạy thật trên Railway + Supabase + Cloudflare R2.

## 1. Biến môi trường cần thêm trên Railway

Vào Railway -> Service -> Variables, thêm:

```text
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

R2_ACCOUNT_ID=your_cloudflare_account_id
R2_ACCESS_KEY_ID=your_r2_access_key_id
R2_SECRET_ACCESS_KEY=your_r2_secret_access_key
R2_BUCKET_NAME=your_bucket_name
R2_PUBLIC_URL=https://your-public-domain-or-empty
```

Lưu ý:

- `SUPABASE_SERVICE_ROLE_KEY` chỉ nằm trên Railway, không đưa vào frontend.
- `R2_SECRET_ACCESS_KEY` chỉ nằm trên Railway, không đưa vào frontend.
- Nếu video cần bảo mật, không nên dùng public bucket cho video trả phí.
- Signed URL sẽ được tạo từ backend Railway.

## 2. Chạy database patch

Trong Supabase SQL Editor, chạy:

```text
supabase/video_r2_patch.sql
```

Patch này thêm metadata video vào bảng `lessons`.

## 3. Kiểm tra server production

Sau khi thêm biến môi trường, redeploy Railway.

Mở:

```text
/health
```

Kết quả đúng:

```json
{ "ok": true, "service": "eduvideo" }
```

Mở:

```text
/api/config
```

Kết quả đúng khi đã cấu hình:

```json
{
  "productionReady": true,
  "r2Ready": true,
  "videoMode": "r2-signed-url"
}
```

## 4. API upload video cho admin

Endpoint:

```text
POST /api/admin/r2/presign-upload
```

Header:

```text
Authorization: Bearer <supabase_access_token_admin>
Content-Type: application/json
```

Body:

```json
{
  "courseId": "course-id",
  "lessonId": "lesson-id",
  "fileName": "bai-1.mp4",
  "contentType": "video/mp4"
}
```

Response:

```json
{
  "uploadUrl": "signed-put-url",
  "key": "courses/course-id/lessons/lesson-id/video.mp4",
  "expiresIn": 900
}
```

Frontend/admin tool sẽ dùng `uploadUrl` để PUT file trực tiếp lên R2.

## 5. API gắn video vào bài học

Sau khi upload thành công, gọi:

```text
POST /api/admin/lessons/:lessonId/video
```

Header:

```text
Authorization: Bearer <supabase_access_token_admin>
Content-Type: application/json
```

Body:

```json
{
  "r2Key": "courses/course-id/lessons/lesson-id/file.mp4",
  "videoProvider": "cloudflare-r2"
}
```

Server sẽ cập nhật bảng `lessons`:

```text
video_provider = cloudflare-r2
video_asset_id = r2Key
video_url = null
```

## 6. API lấy link xem video cho học viên

Endpoint:

```text
POST /api/video/:lessonId/signed-url
```

Header:

```text
Authorization: Bearer <supabase_access_token_student>
```

Server sẽ kiểm tra:

1. User đã đăng nhập chưa.
2. Bài học có thuộc khóa preview không.
3. Nếu không preview, user có enrollment active không.
4. Nếu đủ quyền, server trả signed URL xem video.

Response:

```json
{
  "videoUrl": "signed-get-url",
  "expiresIn": 1800
}
```

## 7. Quy tắc bảo mật video

Không để video trả phí ở URL public vĩnh viễn.

Luồng đúng:

1. Admin upload video lên R2 qua signed PUT URL.
2. Server lưu R2 key vào bảng lessons.
3. Học viên vào học.
4. Server kiểm tra enrollment.
5. Server tạo signed GET URL có hạn.
6. Video player dùng URL có hạn để phát video.

## 8. Việc cần làm ở frontend tiếp theo

- Thêm form upload video trong Admin Studio.
- Khi upload xong, gọi API gắn video vào lesson.
- Trong trang học video, gọi API `/api/video/:lessonId/signed-url`.
- Thay placeholder video bằng thẻ `<video controls>`.

## 9. Cảnh báo quan trọng

Không được:

- Đưa R2 secret vào JavaScript frontend.
- Dùng public URL cho video trả phí.
- Mở quyền học bằng frontend.
- Tin trạng thái thanh toán do frontend gửi lên.

Bắt buộc:

- Kiểm tra admin bằng Supabase token.
- Kiểm tra quyền học bằng enrollment active.
- Dùng signed URL có thời hạn.
