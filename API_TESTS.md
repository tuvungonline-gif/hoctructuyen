# Test API Production EduVideo

Thay `BASE_URL` bằng domain Railway của bạn.

```text
BASE_URL=https://hoctructuyen-production.up.railway.app
```

## 1. Healthcheck

```bash
curl "$BASE_URL/health"
```

Kết quả đúng:

```json
{ "ok": true, "service": "eduvideo" }
```

## 2. Kiểm tra config

```bash
curl "$BASE_URL/api/config"
```

Kết quả đúng khi đủ Supabase + R2:

```json
{
  "productionReady": true,
  "r2Ready": true,
  "videoMode": "r2-signed-url"
}
```

## 3. Test quyền admin

Cần có Supabase access token của tài khoản admin.

```bash
curl "$BASE_URL/api/admin/status" \
  -H "Authorization: Bearer ADMIN_ACCESS_TOKEN"
```

Kết quả đúng:

```json
{
  "ok": true,
  "supabaseReady": true,
  "r2Ready": true
}
```

## 4. Tạo signed upload URL lên R2

```bash
curl -X POST "$BASE_URL/api/admin/r2/presign-upload" \
  -H "Authorization: Bearer ADMIN_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "courseId": "COURSE_ID",
    "lessonId": "LESSON_ID",
    "fileName": "bai-1.mp4",
    "contentType": "video/mp4"
  }'
```

Kết quả trả về:

```json
{
  "uploadUrl": "SIGNED_PUT_URL",
  "key": "courses/course-id/lessons/lesson-id/file.mp4",
  "expiresIn": 900
}
```

## 5. Upload file lên R2 bằng signed URL

```bash
curl -X PUT "SIGNED_PUT_URL" \
  -H "Content-Type: video/mp4" \
  --upload-file ./bai-1.mp4
```

## 6. Gắn video vào lesson

```bash
curl -X POST "$BASE_URL/api/admin/lessons/LESSON_ID/video" \
  -H "Authorization: Bearer ADMIN_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "r2Key": "R2_KEY_FROM_STEP_4",
    "videoProvider": "cloudflare-r2"
  }'
```

## 7. Học viên lấy signed URL xem video

Cần Supabase access token của học viên có quyền học.

```bash
curl -X POST "$BASE_URL/api/video/LESSON_ID/signed-url" \
  -H "Authorization: Bearer STUDENT_ACCESS_TOKEN"
```

Kết quả đúng:

```json
{
  "videoUrl": "SIGNED_GET_URL",
  "expiresIn": 1800
}
```

## 8. Lỗi thường gặp

### 401 Login required

Chưa gửi Supabase access token hoặc token sai.

### 403 Admin permission required

Tài khoản không có role admin trong bảng `profiles`.

### 403 No lesson access

Học viên chưa có enrollment active cho khóa học chứa bài học đó.

### 500 R2 is not configured

Thiếu biến R2 trên Railway.

### 500 Supabase service role is not configured

Thiếu `SUPABASE_SERVICE_ROLE_KEY` trên Railway.
