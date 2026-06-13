# Production Runbook - EduVideo LMS

## Mục tiêu bản vá

Bản vá này giữ nguyên luồng UI/demo hiện tại, nhưng bổ sung lớp chạy production để giảm lỗi khi deploy thật:

- API sai route không còn trả về `index.html` gây lỗi `Unexpected token ... is not valid JSON`.
- Backend có CORS cấu hình được qua biến môi trường.
- Backend có đăng nhập/đăng ký Supabase cơ bản.
- Backend có API public để lấy khóa học đã xuất bản từ Supabase.
- Frontend có lớp bắt lỗi global để tránh trắng màn hình.
- Frontend có cơ chế đọc API an toàn khi backend trả HTML/text thay vì JSON.
- Trang tạo khóa học và R2 console không lưu token quản trị dài hạn vào localStorage.

## File đã sửa/thêm

### `server.js`

Đã thêm/sửa:

- CORS middleware dùng `CORS_ORIGINS` hoặc `APP_BASE_URL`.
- JSON parse error handler trả JSON `{ error: "Invalid JSON request body" }`.
- `POST /api/auth/register` để tạo tài khoản Supabase bằng service role.
- `GET /api/auth/me` để kiểm tra session/token hiện tại.
- `GET /api/courses` để lấy khóa học published từ Supabase.
- `GET /api/courses/:courseId` để lấy chi tiết khóa học.
- `/api/*` 404 trả JSON thay vì fallback sang SPA HTML.
- Chặn serve static các file nhạy cảm: `server.js`, `package.json`, `.env`, `.github`, `.git`.

### `index.html`

Đã thêm:

```html
<script src="production-hardening.js"></script>
```

### `production-hardening.js`

File mới, có nhiệm vụ:

- Bắt lỗi `window.error` và `unhandledrejection`.
- Vá fetch cho các request `/api/*` để phát hiện server trả non-JSON.
- Hiển thị thông báo lỗi thân thiện thay vì trắng màn hình.
- Khi `SUPABASE_URL` và `SUPABASE_ANON_KEY` đã cấu hình, form đăng nhập/đăng ký sẽ gọi API thật.
- Lưu session production và restore sau khi reload.
- Đồng bộ danh sách khóa học từ `/api/courses` nếu API production sẵn sàng.
- Fallback khi ảnh/video lỗi.

### `production-course-manager.html`

Đã sửa:

- Không còn đọc `res.json()` trực tiếp.
- Đọc `response.text()` trước, parse JSON an toàn.
- Báo lỗi rõ khi server trả HTML/text.
- Không lưu admin token vào localStorage.
- Tự dùng session production từ trang chính nếu đã đăng nhập admin.

### `r2-console.html`

Đã sửa:

- Không còn đọc `res.json()` trực tiếp.
- Không lưu admin/student token vào localStorage.
- Tự lấy token từ session production nếu có.
- Báo lỗi rõ khi token không đủ quyền admin hoặc học viên chưa có quyền học.

## Biến môi trường production cần có

Bắt buộc cho Supabase Auth/API:

```text
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

Bắt buộc cho Cloudflare R2 upload/video signed URL:

```text
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=
R2_PUBLIC_URL=
```

Nên có khi frontend và backend khác domain:

```text
APP_BASE_URL=https://ten-mien-web-cua-ban.vn
CORS_ORIGINS=https://ten-mien-web-cua-ban.vn,https://domain-railway.up.railway.app
NODE_ENV=production
PORT=3000
```

## Cấu trúc bảng Supabase tối thiểu

Các API mới giả định có các bảng/cột sau:

### `profiles`

```text
id uuid primary key references auth.users(id)
role text -- student | admin
status text -- active | blocked
```

### `courses`

```text
id uuid primary key
slug text
 title text
short_title text
description text
level text
price numeric
currency text
status text -- published | draft
instructor_id uuid
created_at timestamptz
```

### `lessons`

```text
id uuid primary key
course_id uuid references courses(id)
title text
description text
duration_seconds integer
is_preview boolean
sort_order integer
status text -- published | draft
video_provider text
video_asset_id text
video_url text
video_status text
video_mime_type text
video_size_bytes bigint
video_uploaded_at timestamptz
```

### `enrollments`

```text
id uuid primary key
user_id uuid references auth.users(id)
course_id uuid references courses(id)
status text -- active | pending | blocked
created_at timestamptz
```

## Cách chạy local

```bash
npm install
npm run dev
```

Mở:

```text
http://localhost:3000
```

Kiểm tra health:

```text
http://localhost:3000/health
```

Kiểm tra config:

```text
http://localhost:3000/api/config
```

## Cách kiểm tra syntax/build

Hiện `package.json` vẫn chưa có script build do lần cập nhật script bị công cụ ghi file chặn. Có thể kiểm tra thủ công bằng:

```bash
node --check server.js
```

Vì app là Express + static HTML/JS, không có bước bundle frontend. Khi cần, có thể thêm script sau vào `package.json`:

```json
"build": "node --check server.js"
```

## Cách deploy Railway

Build command:

```bash
npm install
```

Start command:

```bash
npm start
```

Sau deploy kiểm tra:

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

## Test checklist sau deploy

### Người dùng

- [ ] Truy cập trang chủ không trắng màn hình.
- [ ] Reload trực tiếp URL con không lỗi route.
- [ ] Mở `/#/courses` hiển thị danh sách khóa học.
- [ ] Khi Supabase chưa cấu hình, web vẫn chạy demo/localStorage.
- [ ] Khi Supabase đã cấu hình, đăng ký gọi `/api/auth/register`.
- [ ] Đăng nhập gọi `/api/auth/login`.
- [ ] Reload sau đăng nhập vẫn giữ session production.
- [ ] API lỗi hiển thị thông báo thân thiện.
- [ ] Server trả HTML/text cho API không còn gây `Unexpected token ...`.

### Admin

- [ ] Tài khoản admin có profile `role=admin`, `status=active`.
- [ ] Vào `/production-course-manager.html` tạo khóa học thật.
- [ ] Tạo bài học thật.
- [ ] Tạo signed upload URL R2.
- [ ] Upload video lên R2.
- [ ] Gắn video vào lesson.
- [ ] Học viên có enrollment active lấy được signed URL xem video.

### Mobile/UI

- [ ] Menu mobile mở/đóng được.
- [ ] Nút CTA dễ bấm trên màn 360px.
- [ ] Form đăng nhập/đăng ký không tràn màn hình.
- [ ] Trang học video không bị vỡ layout.
- [ ] Bảng admin cuộn được trên mobile.

## Những phần còn chưa thể cam kết 100%

- Chưa kiểm thử trực tiếp được với database Supabase thật vì chưa có biến môi trường production trong phiên kiểm tra này.
- Chưa kiểm thử upload R2 thật vì cần bucket/key thật và CORS bucket đúng.
- Progress học tập production vẫn đang dùng localStorage; muốn thương mại thật cần thêm API lưu progress server-side.
- Thanh toán vẫn là demo; muốn bán khóa học thật cần cổng thanh toán và webhook server-side.
- `package.json` chưa thêm được script `build` do công cụ ghi file chặn khi sửa file này. Lệnh kiểm tra tương đương là `node --check server.js`.
