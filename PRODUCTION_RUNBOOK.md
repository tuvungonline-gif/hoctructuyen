# Production Runbook - EduVideo LMS

## Mục tiêu bản hiện tại

Bản này đã loại bỏ Supabase khỏi website. Backend hiện dùng:

- Node.js/Express.
- Local JSON store để lưu user, course, lesson, enrollment.
- Mật khẩu hash bằng `crypto.scryptSync`, không lưu mật khẩu thô ở backend.
- Session token nội bộ cho đăng nhập.
- Cloudflare R2 cho upload/video signed URL nếu được cấu hình.

Luồng UI/demo cũ vẫn được giữ để không phá giao diện, nhưng khi backend local chạy sẵn, frontend sẽ gọi API nội bộ thay vì gọi Supabase.

## File đã sửa/thêm

### `server.js`

Đã gỡ toàn bộ Supabase:

- Xóa import `@supabase/supabase-js`.
- Xóa `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`.
- Xóa logic profile/admin từ Supabase.
- Thay bằng local JSON store tại `DATA_DIR` / `DATA_FILE`.
- Thêm seed dữ liệu ban đầu cho học viên demo, admin demo, khóa học, bài học, enrollment.
- Thêm hash mật khẩu bằng `crypto.scryptSync`.
- Thêm session token nội bộ.
- Admin được xác thực bằng tài khoản admin nội bộ hoặc biến môi trường `ADMIN_TOKEN`.
- API `/api/*` vẫn trả JSON rõ ràng, tránh lỗi `Unexpected token ... is not valid JSON`.
- Chặn serve `/data`, `.env`, `.git`, `.github`, `server.js`, `package.json`.

### `package.json`

Đã gỡ:

- `@supabase/supabase-js`
- `pg`

Dependencies hiện chỉ còn:

```json
{
  "@aws-sdk/client-s3": "^3.726.1",
  "@aws-sdk/s3-request-presigner": "^3.726.1",
  "express": "^4.19.2"
}
```

### `production-hardening.js`

Đã cập nhật:

- Không còn nhắc Supabase.
- Đăng nhập/đăng ký gọi backend local.
- Restore session qua `/api/auth/me`.
- Đồng bộ khóa học qua `/api/courses`.
- Báo lỗi admin bằng hướng dẫn đăng nhập admin nội bộ hoặc `ADMIN_TOKEN`.

### `production-course-manager.html`

Đã cập nhật:

- Không còn tìm token Supabase trong localStorage.
- Không còn thông báo yêu cầu Supabase Auth.
- Dùng session đăng nhập admin nội bộ hoặc token admin đã cung cấp.

### `r2-console.html`

Đã cập nhật:

- Không còn chữ Supabase trong UI.
- Trường token đổi thành `Admin Access Token` và `Student Access Token`.
- Placeholder dùng ID khóa học/bài học trong backend local.

## Biến môi trường cần có

Bắt buộc tối thiểu:

```text
PORT=3000
NODE_ENV=production
```

Nên có để bảo vệ admin API nếu muốn dùng token ngoài tài khoản admin nội bộ:

```text
ADMIN_TOKEN=chuoi-token-rat-dai-va-bi-mat
```

Nên có nếu frontend/backend khác domain:

```text
APP_BASE_URL=https://ten-mien-web-cua-ban.vn
CORS_ORIGINS=https://ten-mien-web-cua-ban.vn,https://domain-railway.up.railway.app
```

Cấu hình nơi lưu file JSON:

```text
DATA_DIR=/app/data
DATA_FILE=/app/data/eduvideo-store.json
```

Cấu hình R2 nếu cần upload/xem video bằng signed URL:

```text
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=
R2_PUBLIC_URL=
```

## Tài khoản mặc định

Backend local tự seed 2 tài khoản nếu chưa có file dữ liệu:

```text
Học viên:
Email: hocvien@example.com
Mật khẩu: 123456

Admin:
Email: admin@example.com
Mật khẩu: admin123
```

Sau khi chạy thật, nên đổi mật khẩu hoặc tạo admin mới rồi khóa/xóa tài khoản demo trong file dữ liệu.

## File dữ liệu local

Mặc định dữ liệu được lưu tại:

```text
data/eduvideo-store.json
```

Trên Railway hoặc server production, nên mount persistent volume vào `DATA_DIR`. Nếu không có volume, dữ liệu có thể mất khi redeploy/restart tùy nền tảng.

## Cách chạy local

```bash
npm install
npm run dev
```

Mở:

```text
http://localhost:3000
```

Kiểm tra:

```text
/health
/api/config
/api/courses
/#/courses
/#/auth
/#/admin
/production-course-manager.html
/r2-console.html
```

## Cách kiểm tra syntax/build

```bash
node --check server.js
```

App hiện là Express + static HTML/JS, không có bước bundle frontend.

## Cách deploy Railway

Build command:

```bash
npm install
```

Start command:

```bash
npm start
```

Cần cấu hình persistent volume nếu muốn dữ liệu local JSON không mất khi redeploy.

## Test checklist sau deploy

### Người dùng

- [ ] Truy cập trang chủ không trắng màn hình.
- [ ] Reload trực tiếp URL con không lỗi route.
- [ ] Mở `/#/courses` hiển thị danh sách khóa học từ backend local.
- [ ] Đăng ký gọi `/api/auth/register`.
- [ ] Đăng nhập gọi `/api/auth/login`.
- [ ] Reload sau đăng nhập vẫn giữ session nếu server chưa restart.
- [ ] API lỗi hiển thị thông báo thân thiện.
- [ ] Server trả HTML/text cho API không còn gây `Unexpected token ...`.

### Admin

- [ ] Đăng nhập bằng `admin@example.com / admin123`.
- [ ] Vào `/production-course-manager.html` tạo khóa học thật vào local JSON.
- [ ] Tạo bài học thật.
- [ ] Tạo signed upload URL R2 nếu R2 đã cấu hình.
- [ ] Upload video lên R2.
- [ ] Gắn video vào lesson.
- [ ] Học viên có enrollment active lấy được signed URL xem video.

### Mobile/UI

- [ ] Menu mobile mở/đóng được.
- [ ] Nút CTA dễ bấm trên màn 360px.
- [ ] Form đăng nhập/đăng ký không tràn màn hình.
- [ ] Trang học video không bị vỡ layout.
- [ ] Bảng admin cuộn được trên mobile.

## Những phần còn cần lưu ý

- Dữ liệu cũ nếu đang nằm trong Supabase sẽ không tự chuyển sang local JSON. Cần export thủ công rồi import vào `data/eduvideo-store.json` nếu muốn giữ dữ liệu đó.
- Local JSON phù hợp giai đoạn MVP/production nhỏ. Nếu nhiều người dùng đồng thời hoặc cần chống mất dữ liệu cao, nên chuyển sang database thật như PostgreSQL/MySQL/MongoDB hoặc dịch vụ managed khác.
- Session token đang lưu in-memory; khi server restart, người dùng cần đăng nhập lại. Dữ liệu user/course vẫn giữ nếu `DATA_DIR` có persistent volume.
- Thanh toán vẫn là demo; muốn bán khóa học thật cần cổng thanh toán và webhook server-side.
