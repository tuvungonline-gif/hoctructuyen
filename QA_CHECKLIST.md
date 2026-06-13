# QA Checklist - EduVideo Frontend MVP

Checklist này dùng để kiểm tra bản demo/MVP trước khi bật GitHub Pages hoặc trình bày cho người dùng.

## 1. Kiểm tra giao diện chung

- [ ] Trang chủ hiển thị đầy đủ trên desktop.
- [ ] Trang chủ hiển thị tốt trên mobile từ 360px.
- [ ] Menu mobile mở/đóng được.
- [ ] Thanh điều hướng nhanh dưới màn hình mobile không che nội dung quan trọng.
- [ ] Footer không bị vỡ layout.
- [ ] Font tiếng Việt hiển thị rõ ràng.
- [ ] Nút CTA đủ lớn, dễ bấm trên điện thoại.

## 2. Kiểm tra học viên

- [ ] Đăng nhập học viên demo thành công.
- [ ] Đăng xuất thành công.
- [ ] Đăng ký tài khoản demo mới thành công.
- [ ] Trang Dashboard hiển thị tiến độ và mục tiêu học tập.
- [ ] Lưu mục tiêu học tập hoạt động.
- [ ] Trang Tài khoản hiển thị khóa học đã đăng ký.
- [ ] Trang Chứng chỉ hiển thị điều kiện hoàn thành.
- [ ] Trang Thông báo có trạng thái đọc/chưa đọc.
- [ ] Trang Cài đặt `#/settings` sửa được hồ sơ demo.

## 3. Kiểm tra khóa học

- [ ] Trang danh sách khóa học hiển thị card đúng.
- [ ] Tìm kiếm khóa học hoạt động.
- [ ] Trang chi tiết khóa học hiển thị nội dung, lợi ích, bài học, giá.
- [ ] Nút đăng ký/mua khóa học dẫn tới checkout demo.
- [ ] Checkout demo tạo đơn thành công.
- [ ] Đơn hiển thị trong tài khoản học viên.

## 4. Kiểm tra trang học video

- [ ] Học viên chưa đăng nhập bị chặn.
- [ ] Học viên chưa có quyền học bị chặn.
- [ ] Khóa chờ duyệt hiển thị đúng thông báo.
- [ ] Khóa tạm khóa hiển thị đúng thông báo.
- [ ] Khóa đã mở quyền vào học được.
- [ ] Danh sách bài học hiển thị đúng.
- [ ] Nút bài trước/bài tiếp theo hoạt động.
- [ ] Đánh dấu bài đã học hoạt động.
- [ ] Tiến độ khóa học cập nhật đúng.
- [ ] Ghi chú bài học lưu được.
- [ ] Hỏi đáp bài học gửi được.

## 5. Kiểm tra admin

- [ ] Đăng nhập admin demo thành công.
- [ ] Trang Quản trị hiển thị học viên và quyền học.
- [ ] Admin mở quyền học được.
- [ ] Admin tạm khóa quyền học được.
- [ ] Admin xác nhận đơn đăng ký demo được.
- [ ] Admin gửi thông báo demo được.
- [ ] Admin Studio `#/admin-content` tạo khóa demo được.
- [ ] Admin Studio xóa khóa demo được.
- [ ] Báo cáo admin `#/reports` hiển thị số liệu demo.

## 6. Kiểm tra hỗ trợ, đánh giá, lịch học

- [ ] Học viên gửi ticket hỗ trợ được.
- [ ] Admin xem được tất cả ticket.
- [ ] Admin đánh dấu ticket hoàn tất được.
- [ ] Học viên gửi đánh giá khóa học được.
- [ ] Admin ẩn/hiện đánh giá được.
- [ ] Trang Lịch học hiển thị lịch demo.
- [ ] Admin thêm lịch học demo được.

## 7. Kiểm tra GitHub Pages

- [ ] Repo có `.github/workflows/static-pages.yml`.
- [ ] Repo có `.nojekyll`.
- [ ] Repo có `404.html`.
- [ ] Settings → Pages đã chọn GitHub Actions.
- [ ] Workflow deploy chạy thành công.
- [ ] Link Pages mở được trang chủ.
- [ ] Các route hash như `#/courses`, `#/dashboard`, `#/support` hoạt động.

## 8. Cảnh báo trước khi dùng thương mại thật

- [ ] Không dùng localStorage để bảo vệ video thật.
- [ ] Không dùng frontend để xác nhận thanh toán thật.
- [ ] Không lưu mật khẩu thật ở frontend.
- [ ] Không mở quyền học thật nếu chưa có backend kiểm tra.
- [ ] Cần signed URL/token cho video trả phí.
- [ ] Cần backup database trước khi deploy bản backend.
