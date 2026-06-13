# Hướng dẫn chạy EduVideo trên Railway

Repo này đã được bổ sung cấu hình để Railway nhận dạng là Node.js app và chạy web tĩnh qua Express.

## File đã thêm

```text
package.json
server.js
```

## Railway cần chạy lệnh nào?

Start command:

```bash
npm start
```

Railway sẽ cài dependency từ `package.json` và chạy `node server.js`.

## Cổng chạy

Server dùng:

```js
process.env.PORT || 3000
```

Railway sẽ cấp biến `PORT` cho service. Không hard-code cổng cố định.

## Healthcheck

Có endpoint kiểm tra:

```text
/health
```

Nếu mở được `/health` và thấy `{ "ok": true }` thì server đang chạy.

## Các bước cần làm trên Railway

1. Vào project Railway đã deploy.
2. Vào service đang nối với repo GitHub `hoctructuyen`.
3. Kiểm tra service đã lấy commit mới nhất.
4. Bấm Redeploy nếu Railway chưa tự deploy.
5. Mở tab Logs.
6. Tìm dòng:

```text
EduVideo running on port ...
```

7. Vào Settings hoặc Networking.
8. Generate Domain nếu chưa có domain.
9. Mở domain Railway để kiểm tra web.

## Nếu Railway báo lỗi thường gặp

### 1. No start command could be found

Nguyên nhân: Railway chưa thấy `package.json` hoặc chưa lấy commit mới.

Cách xử lý:

- Kiểm tra repo đã có `package.json`.
- Redeploy service.
- Nếu cần, đặt Start Command thủ công là:

```bash
npm start
```

### 2. Application failed to respond

Nguyên nhân thường gặp:

- App không listen đúng `process.env.PORT`.
- Server chỉ listen localhost.
- Build chưa chạy đúng.

Repo hiện đã dùng:

```js
app.listen(port, "0.0.0.0")
```

### 3. Trang trắng hoặc file JS/CSS không tải

Kiểm tra:

- Mở DevTools Console.
- Xem file `app.js`, `part3.js`, `part4.js`, `part5.js` có load được không.
- Kiểm tra Railway domain có đang trỏ đúng service không.

### 4. Dữ liệu mất sau khi refresh

Bản hiện tại vẫn là frontend demo dùng localStorage. Khi dùng trình duyệt khác hoặc xóa cache thì dữ liệu demo sẽ mất.

Muốn chạy thật cần nối Supabase/database theo:

```text
START_PRODUCTION.md
PRODUCTION_ROADMAP.md
supabase/schema.sql
```

## Việc nên làm tiếp theo

1. Redeploy Railway sau commit mới.
2. Mở domain Railway.
3. Kiểm tra `/health`.
4. Test các route:

```text
/#/
/#/courses
/#/dashboard
/#/support
/#/admin
```

5. Sau khi frontend chạy ổn, bắt đầu nối Supabase Auth và database thật.
