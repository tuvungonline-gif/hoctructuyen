# Fix lỗi upload video: Failed to fetch

## Nguyên nhân chính

Luồng cũ tạo signed URL rồi để trình duyệt `PUT` trực tiếp lên Cloudflare R2. Nếu R2 bucket chưa cấu hình CORS đúng cho domain web, browser sẽ chặn request và báo `Failed to fetch`.

## Cách đã sửa

- Thêm API backend: `POST /api/admin/r2/upload-proxy`.
- Trang `production-course-manager.html` hiện upload file video qua backend proxy, không PUT trực tiếp lên R2 nữa.
- `r2-console.html` cũng ưu tiên upload qua backend proxy; signed URL trực tiếp chỉ giữ làm dự phòng.
- `/api/config` và `/api/admin/status` trả thêm `uploadMode: "backend-proxy"` khi R2 đã sẵn sàng.

## Cách test sau deploy

1. Deploy lại app.
2. Đăng nhập admin: `admin@example.com / admin123` hoặc dùng `ADMIN_TOKEN`.
3. Mở `/production-course-manager.html`.
4. Nhập tên khóa học, bài học, chọn file video.
5. Bấm `Tạo khóa học`.
6. Kết quả đúng: trạng thái báo `Video đã upload qua backend proxy`.

## Nếu vẫn lỗi

Kiểm tra biến môi trường R2:

```text
R2_ACCOUNT_ID
R2_ACCESS_KEY_ID
R2_SECRET_ACCESS_KEY
R2_BUCKET_NAME
R2_PUBLIC_URL
```

Kiểm tra endpoint:

```text
/api/config
/api/admin/status
```

Nếu file video quá lớn và host giới hạn thời gian/body upload, nên cấu hình CORS cho Cloudflare R2 để dùng signed URL trực tiếp cho file lớn.
