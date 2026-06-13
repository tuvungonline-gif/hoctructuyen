# Lộ trình chạy thật EduVideo

Tài liệu này dùng để chuyển website từ bản frontend demo/localStorage sang bản chạy thật có backend, database, đăng nhập, quyền học, thanh toán và bảo vệ video.

## Nguyên tắc bắt buộc

Không dùng localStorage để bảo vệ dữ liệu thật. localStorage chỉ dùng cho demo giao diện.

Các phần sau phải xử lý ở backend/database/server-side:

- Đăng nhập và phiên đăng nhập.
- Phân quyền học viên/admin.
- Đơn hàng và thanh toán.
- Mở quyền học.
- Link video trả phí.
- Tiến độ học tập.
- Hỏi đáp, ghi chú, ticket hỗ trợ.
- Chứng chỉ.

## Kiến trúc khuyến nghị cho giai đoạn đầu

### Frontend

- Giữ giao diện hiện tại.
- Deploy bằng GitHub Pages hoặc Vercel.
- Thay dần dữ liệu mock/localStorage bằng API thật.

### Backend/database

Khuyến nghị nhanh nhất: Supabase.

Supabase cung cấp:

- Auth cho đăng nhập/đăng ký.
- Postgres database.
- Row Level Security để kiểm soát dữ liệu theo từng user.
- Storage nếu cần lưu tài liệu.
- Edge Functions nếu cần xử lý webhook thanh toán hoặc tạo signed URL.

### Video

Không để video trả phí ở link công khai.

Các hướng an toàn:

1. Dùng nền tảng video có quyền riêng tư/signed playback.
2. Dùng storage riêng và tạo signed URL có thời hạn.
3. Backend kiểm tra quyền học trước khi trả link video.

### Thanh toán

Không xác nhận thanh toán ở frontend.

Luồng đúng:

1. Học viên tạo đơn hàng.
2. Backend tạo payment request.
3. Cổng thanh toán gửi webhook về backend.
4. Backend xác minh webhook.
5. Backend đổi trạng thái đơn thành paid.
6. Backend tạo enrollment/mở quyền học.

## Giai đoạn 1: Đưa web lên link chạy được

1. Vào GitHub repo.
2. Mở Settings.
3. Vào Pages.
4. Chọn Build and deployment: GitHub Actions.
5. Chạy workflow Pages.
6. Kiểm tra link dạng:

```text
https://tuvungonline-gif.github.io/hoctructuyen/
```

Mục tiêu: có link frontend chạy ổn để kiểm tra giao diện.

## Giai đoạn 2: Tạo database thật

1. Tạo project Supabase.
2. Mở SQL Editor.
3. Chạy file:

```text
supabase/schema.sql
```

4. Kiểm tra các bảng đã tạo:

- profiles
- courses
- lessons
- enrollments
- orders
- lesson_progress
- lesson_notes
- lesson_questions
- notifications
- support_tickets
- course_reviews
- schedules
- certificates

## Giai đoạn 3: Nối đăng nhập thật

Thay logic demo trong `app.js`:

- Bỏ tài khoản demo khỏi production.
- Dùng Supabase Auth để đăng ký/đăng nhập.
- Khi user đăng ký, tạo profile tương ứng.
- Role mặc định là student.
- Admin role chỉ được set thủ công trong database.

Cảnh báo:

- Không cho frontend tự set role admin.
- Không lưu mật khẩu trong bảng riêng.
- Không dùng localStorage để xác định quyền admin.

## Giai đoạn 4: Nối khóa học và bài học thật

Thay dữ liệu `courses` trong `app.js` bằng dữ liệu từ bảng:

- courses
- lessons

Trang cần nối trước:

1. Danh sách khóa học.
2. Chi tiết khóa học.
3. Trang học video.

## Giai đoạn 5: Nối quyền học thật

Khi học viên vào trang học video:

1. Frontend gọi API/database lấy enrollment.
2. Server/RLS kiểm tra user hiện tại.
3. Chỉ khi enrollment.status = active mới trả bài học/video.

Cảnh báo:

- Không chỉ ẩn nút bằng frontend.
- Không gửi video_url thật cho user chưa có quyền.

## Giai đoạn 6: Nối thanh toán thật

Bảng liên quan:

- orders
- enrollments

Luồng an toàn:

1. Tạo order trạng thái pending.
2. Chuyển học viên sang cổng thanh toán.
3. Webhook xác nhận thanh toán.
4. Đổi order thành paid.
5. Tạo enrollment active.
6. Gửi thông báo cho học viên.

Cảnh báo:

- Frontend không được tự đổi order sang paid.
- Frontend không được tự mở quyền học.

## Giai đoạn 7: Nối tiến độ, ghi chú, hỏi đáp

Các bảng cần dùng:

- lesson_progress
- lesson_notes
- lesson_questions

Mỗi bản ghi phải gắn với user_id.

Học viên chỉ xem/sửa dữ liệu của chính mình.
Admin/giảng viên mới được xem nhiều học viên.

## Giai đoạn 8: Nối admin thật

Admin cần làm được:

- Tạo/sửa khóa học.
- Tạo/sửa bài học.
- Xem học viên.
- Duyệt quyền học.
- Xem đơn hàng.
- Xử lý ticket.
- Ẩn/hiện đánh giá.
- Gửi thông báo.

Cảnh báo:

- Tất cả thao tác admin phải kiểm tra role ở server/RLS.
- Không tin biến role từ frontend.

## Giai đoạn 9: Kiểm thử trước khi bán thật

Dùng file:

```text
QA_CHECKLIST.md
```

Bổ sung kiểm thử production:

- User A không xem được khóa của User B.
- User chưa mua không lấy được video_url.
- User đã thanh toán được mở quyền đúng khóa.
- Webhook thanh toán không bị giả mạo.
- Admin role không tự set được từ trình duyệt.
- Backup database trước khi deploy.

## Mức ưu tiên làm ngay

Ưu tiên 1:

- Bật GitHub Pages.
- Tạo Supabase project.
- Chạy schema database.
- Nối Auth thật.

Ưu tiên 2:

- Nối danh sách khóa học thật.
- Nối chi tiết khóa học thật.
- Nối enrollment/quyền học thật.

Ưu tiên 3:

- Nối thanh toán/webhook.
- Bảo vệ video thật.
- Nối tiến độ học thật.

Ưu tiên 4:

- Admin CMS.
- Ticket hỗ trợ.
- Đánh giá.
- Chứng chỉ.
- Báo cáo.
