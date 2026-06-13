const P5_KEY = "eduvideo_part5_complete_v1";
const P5_MAIN_KEY = "eduvideo_part2_state_v1";
const P5_COURSES = ["video-marketing-ai", "ban-hang-online", "thiet-ke-landing-page", "quan-tri-lms", "ky-nang-giang-day-video", "cham-soc-hoc-vien"];

function p5App() {
  return document.querySelector("#app");
}

function p5Route() {
  const hash = window.location.hash || "#/";
  const parts = hash.replace(/^#\/?/, "").split("/").filter(Boolean);
  return { path: parts[0] || "home", id: parts[1], lesson: parts[2] };
}

function p5LoadMain() {
  try {
    const saved = JSON.parse(localStorage.getItem(P5_MAIN_KEY));
    return {
      currentUserId: saved?.currentUserId || null,
      users: Array.isArray(saved?.users) ? saved.users : [],
      enrollments: Array.isArray(saved?.enrollments) ? saved.enrollments : [],
      progress: saved?.progress && typeof saved.progress === "object" ? saved.progress : {}
    };
  } catch (error) {
    return { currentUserId: null, users: [], enrollments: [], progress: {} };
  }
}

function p5Load() {
  try {
    const saved = JSON.parse(localStorage.getItem(P5_KEY));
    return {
      tickets: Array.isArray(saved?.tickets) ? saved.tickets : p5DefaultTickets(),
      reviews: Array.isArray(saved?.reviews) ? saved.reviews : p5DefaultReviews(),
      schedules: Array.isArray(saved?.schedules) ? saved.schedules : p5DefaultSchedules(),
      announcements: Array.isArray(saved?.announcements) ? saved.announcements : []
    };
  } catch (error) {
    return { tickets: p5DefaultTickets(), reviews: p5DefaultReviews(), schedules: p5DefaultSchedules(), announcements: [] };
  }
}

function p5Save(data) {
  localStorage.setItem(P5_KEY, JSON.stringify(data));
}

function p5User() {
  try {
    if (typeof currentUser === "function") return currentUser();
  } catch (error) {}
  const main = p5LoadMain();
  return main.users.find((user) => user.id === main.currentUserId) || null;
}

function p5Course(id) {
  try {
    if (typeof getCourse === "function") return getCourse(id);
  } catch (error) {}
  return { id, title: "Khóa học mẫu", shortTitle: "Demo", curriculum: [["Bài học mẫu", "08:00"]], price: "0đ", duration: "0 giờ", instructor: "Giảng viên Demo", color: "" };
}

function p5Escape(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function p5Today() {
  return new Date().toISOString().slice(0, 10);
}

function p5DefaultTickets() {
  return [
    { id: "TK-1001", userId: "student-demo", title: "Không thấy nút tải tài liệu", category: "Tài liệu", status: "open", priority: "medium", message: "Em muốn tải tài liệu bài học nhưng chưa thấy link tải.", reply: "Admin sẽ bổ sung tài liệu mẫu ở bản backend.", createdAt: "2026-06-13" },
    { id: "TK-1002", userId: "student-demo", title: "Cần hỗ trợ mở quyền khóa học", category: "Quyền học", status: "done", priority: "high", message: "Em đã đăng ký khóa học, nhờ admin kiểm tra quyền.", reply: "Quyền học đã được mở demo.", createdAt: "2026-06-13" }
  ];
}

function p5DefaultReviews() {
  return [
    { id: "rv-1", userId: "student-demo", courseId: "video-marketing-ai", rating: 5, content: "Bài học dễ hiểu, bố cục rõ và phù hợp người mới.", createdAt: "2026-06-13", status: "visible" },
    { id: "rv-2", userId: "student-demo", courseId: "thiet-ke-landing-page", rating: 4, content: "Giao diện đẹp, ví dụ thực tế, nên thêm nhiều bài tập hơn.", createdAt: "2026-06-13", status: "visible" }
  ];
}

function p5DefaultSchedules() {
  return [
    { id: "sch-1", title: "Livestream giải đáp học viên mới", date: "2026-06-20", time: "20:00", type: "live", courseId: "video-marketing-ai", location: "Zoom/Google Meet demo" },
    { id: "sch-2", title: "Hạn hoàn thành bài tập landing page", date: "2026-06-23", time: "21:00", type: "deadline", courseId: "thiet-ke-landing-page", location: "Trong hệ thống" },
    { id: "sch-3", title: "Buổi onboarding học viên", date: "2026-06-25", time: "19:30", type: "onboarding", courseId: "ban-hang-online", location: "Phòng học online demo" }
  ];
}

function p5RequireLogin(label = "Cần đăng nhập") {
  const app = p5App();
  app.innerHTML = `<section class="section"><div class="container"><article class="access-card"><div class="access-icon">🔐</div><span class="eyebrow">${p5Escape(label)}</span><h1>Đăng nhập để tiếp tục</h1><p class="lead">Khu vực này cần tài khoản học viên hoặc admin demo.</p><div class="hero-actions"><a class="btn btn-primary" href="#/auth">Đăng nhập</a><a class="btn btn-light" href="#/courses">Xem khóa học</a></div></article></div></section>`;
}

function p5Badge(status) {
  if (status === "done" || status === "visible" || status === "resolved") return `<span class="badge live">Hoàn tất</span>`;
  if (status === "open" || status === "pending") return `<span class="badge pending">Đang xử lý</span>`;
  if (status === "hidden" || status === "cancelled") return `<span class="badge blocked">Đã ẩn</span>`;
  return `<span class="badge draft">${p5Escape(status)}</span>`;
}

function p5Stars(rating) {
  const value = Math.max(1, Math.min(5, Number(rating) || 5));
  return "★".repeat(value) + "☆".repeat(5 - value);
}

function p5RenderSupport() {
  const app = p5App();
  const user = p5User();
  if (!user) return p5RequireLogin("Trung tâm hỗ trợ");
  const data = p5Load();
  const visibleTickets = user.role === "admin" ? data.tickets : data.tickets.filter((ticket) => ticket.userId === user.id);
  const rows = visibleTickets.length ? visibleTickets.slice().reverse().map((ticket) => {
    const owner = p5LoadMain().users.find((item) => item.id === ticket.userId);
    const adminControls = user.role === "admin" ? `<div class="p5-ticket-actions"><button class="btn btn-primary btn-small" onclick="p5ResolveTicket('${ticket.id}')">Đánh dấu xong</button><button class="btn btn-light btn-small" onclick="p5ReopenTicket('${ticket.id}')">Mở lại</button></div>` : "";
    return `<article class="p5-ticket"><div><div class="tag-row"><span class="chip">${p5Escape(ticket.category)}</span><span class="chip ${ticket.priority === "high" ? "danger-chip" : ""}">${p5Escape(ticket.priority)}</span>${p5Badge(ticket.status)}</div><h3>${p5Escape(ticket.title)}</h3><p>${p5Escape(ticket.message)}</p><small class="muted">${p5Escape(ticket.id)} · ${p5Escape(owner?.name || "Học viên")} · ${p5Escape(ticket.createdAt)}</small>${ticket.reply ? `<div class="p5-reply"><strong>Phản hồi:</strong> ${p5Escape(ticket.reply)}</div>` : ""}</div>${adminControls}</article>`;
  }).join("") : `<div class="empty-state small"><h3>Chưa có yêu cầu hỗ trợ</h3><p class="muted">Khi học viên gửi hỗ trợ, yêu cầu sẽ hiển thị tại đây.</p></div>`;

  const adminNote = user.role === "admin" ? `<div class="warning-box"><strong>Admin:</strong> bản thật cần gắn email/Zalo/CRM để không bỏ sót yêu cầu hỗ trợ.</div>` : `<div class="warning-box"><strong>Gợi ý:</strong> mô tả rõ tên khóa học, bài học và lỗi gặp phải để admin xử lý nhanh hơn.</div>`;

  app.innerHTML = `
    <section class="page-hero"><div class="container page-hero-grid"><div><span class="eyebrow">Trung tâm hỗ trợ</span><h1>Hỗ trợ học viên trong quá trình học</h1><p class="lead">Tạo yêu cầu hỗ trợ, theo dõi trạng thái và phản hồi từ admin.</p></div><a class="btn btn-primary" href="#/dashboard">Về dashboard</a></div></section>
    <section class="section-tight"><div class="container p5-support-grid"><article class="card pad"><h2>Gửi yêu cầu hỗ trợ</h2><form class="form-grid" onsubmit="p5CreateTicket(event)"><div class="field"><label>Tiêu đề</label><input name="title" required placeholder="Ví dụ: Không xem được video bài 2" /></div><div class="field"><label>Danh mục</label><select name="category"><option>Video</option><option>Thanh toán</option><option>Quyền học</option><option>Tài liệu</option><option>Tài khoản</option></select></div><div class="field"><label>Mức độ</label><select name="priority"><option value="low">Thấp</option><option value="medium" selected>Trung bình</option><option value="high">Khẩn cấp</option></select></div><div class="field"><label>Nội dung</label><textarea name="message" rows="5" required placeholder="Mô tả vấn đề bạn gặp phải..."></textarea></div><button class="btn btn-primary" type="submit">Gửi yêu cầu demo</button></form>${adminNote}</article><div class="card pad"><div class="lesson-sidebar-head"><div><h2>Danh sách yêu cầu</h2><p class="muted">${user.role === "admin" ? "Admin xem tất cả yêu cầu." : "Học viên chỉ xem yêu cầu của mình."}</p></div><span class="chip">${visibleTickets.length} yêu cầu</span></div><div class="p5-ticket-list">${rows}</div></div></div></section>`;
}

function p5CreateTicket(event) {
  event.preventDefault();
  const user = p5User();
  if (!user) return;
  const form = new FormData(event.currentTarget);
  const data = p5Load();
  data.tickets.push({ id: `TK-${Date.now().toString().slice(-6)}`, userId: user.id, title: String(form.get("title") || ""), category: String(form.get("category") || "Khác"), status: "open", priority: String(form.get("priority") || "medium"), message: String(form.get("message") || ""), reply: "", createdAt: p5Today() });
  p5Save(data);
  alert("Đã gửi yêu cầu hỗ trợ demo.");
  p5RenderSupport();
}

function p5ResolveTicket(id) {
  const data = p5Load();
  const ticket = data.tickets.find((item) => item.id === id);
  if (ticket) {
    ticket.status = "done";
    ticket.reply = ticket.reply || "Admin đã tiếp nhận và xử lý yêu cầu demo.";
    p5Save(data);
  }
  p5RenderSupport();
}

function p5ReopenTicket(id) {
  const data = p5Load();
  const ticket = data.tickets.find((item) => item.id === id);
  if (ticket) {
    ticket.status = "open";
    p5Save(data);
  }
  p5RenderSupport();
}

function p5RenderReviews() {
  const app = p5App();
  const user = p5User();
  if (!user) return p5RequireLogin("Đánh giá khóa học");
  const data = p5Load();
  const visible = data.reviews.filter((review) => user.role === "admin" || review.status !== "hidden");
  const avg = visible.length ? (visible.reduce((sum, item) => sum + Number(item.rating || 0), 0) / visible.length).toFixed(1) : "0.0";
  const reviews = visible.length ? visible.slice().reverse().map((review) => {
    const course = p5Course(review.courseId);
    const owner = p5LoadMain().users.find((item) => item.id === review.userId);
    const adminActions = user.role === "admin" ? `<div class="card-actions"><button class="btn btn-light btn-small" onclick="p5ToggleReview('${review.id}')">${review.status === "hidden" ? "Hiện lại" : "Ẩn đánh giá"}</button></div>` : "";
    return `<article class="review-card"><div class="stars">${p5Stars(review.rating)}</div><h3>${p5Escape(course.title)}</h3><p>${p5Escape(review.content)}</p><small class="muted">${p5Escape(owner?.name || "Học viên")} · ${p5Escape(review.createdAt)} · ${review.status === "hidden" ? "Đang ẩn" : "Đang hiển thị"}</small>${adminActions}</article>`;
  }).join("") : `<div class="empty-state small"><h3>Chưa có đánh giá</h3><p class="muted">Học viên hoàn thành khóa có thể gửi đánh giá.</p></div>`;

  const options = P5_COURSES.map((id) => {
    const course = p5Course(id);
    return `<option value="${course.id}">${p5Escape(course.title)}</option>`;
  }).join("");

  app.innerHTML = `
    <section class="page-hero"><div class="container page-hero-grid"><div><span class="eyebrow">Đánh giá khóa học</span><h1>Phản hồi của học viên</h1><p class="lead">Thu thập đánh giá sau học để cải thiện nội dung và tăng độ tin cậy cho trang bán khóa học.</p></div><div class="p5-rating-score"><span>Điểm trung bình</span><strong>${avg}</strong><small>/5 từ ${visible.length} đánh giá</small></div></div></section>
    <section class="section-tight"><div class="container p5-reviews-grid"><article class="card pad"><h2>Gửi đánh giá demo</h2><form class="form-grid" onsubmit="p5CreateReview(event)"><div class="field"><label>Khóa học</label><select name="courseId">${options}</select></div><div class="field"><label>Số sao</label><select name="rating"><option value="5">5 sao</option><option value="4">4 sao</option><option value="3">3 sao</option><option value="2">2 sao</option><option value="1">1 sao</option></select></div><div class="field"><label>Nội dung đánh giá</label><textarea name="content" rows="5" required placeholder="Bạn thấy khóa học thế nào?"></textarea></div><button class="btn btn-primary" type="submit">Gửi đánh giá</button></form></article><div class="card pad"><div class="lesson-sidebar-head"><div><h2>Danh sách đánh giá</h2><p class="muted">Đánh giá dùng dữ liệu demo localStorage.</p></div><span class="chip">${visible.length} đánh giá</span></div><div class="review-list">${reviews}</div></div></div></section>`;
}

function p5CreateReview(event) {
  event.preventDefault();
  const user = p5User();
  if (!user) return;
  const form = new FormData(event.currentTarget);
  const data = p5Load();
  data.reviews.push({ id: `rv-${Date.now()}`, userId: user.id, courseId: String(form.get("courseId") || P5_COURSES[0]), rating: Number(form.get("rating") || 5), content: String(form.get("content") || ""), createdAt: p5Today(), status: "visible" });
  p5Save(data);
  alert("Đã gửi đánh giá demo.");
  p5RenderReviews();
}

function p5ToggleReview(id) {
  const data = p5Load();
  const review = data.reviews.find((item) => item.id === id);
  if (review) {
    review.status = review.status === "hidden" ? "visible" : "hidden";
    p5Save(data);
  }
  p5RenderReviews();
}

function p5RenderSchedule() {
  const app = p5App();
  const user = p5User();
  if (!user) return p5RequireLogin("Lịch học");
  const data = p5Load();
  const items = data.schedules.slice().sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`));
  const list = items.map((item) => {
    const course = p5Course(item.courseId);
    return `<article class="schedule-item"><div class="schedule-date"><strong>${p5Escape(item.date.slice(5))}</strong><span>${p5Escape(item.time)}</span></div><div><span class="chip">${p5Escape(item.type)}</span><h3>${p5Escape(item.title)}</h3><p class="muted">${p5Escape(course.title)} · ${p5Escape(item.location)}</p></div></article>`;
  }).join("");
  const adminForm = user.role === "admin" ? `<aside class="card pad"><h2>Thêm lịch demo</h2><form class="form-grid" onsubmit="p5CreateSchedule(event)"><div class="field"><label>Tiêu đề</label><input name="title" required /></div><div class="field"><label>Ngày</label><input name="date" type="date" required /></div><div class="field"><label>Giờ</label><input name="time" type="time" required /></div><div class="field"><label>Loại</label><select name="type"><option value="live">Live</option><option value="deadline">Deadline</option><option value="onboarding">Onboarding</option></select></div><div class="field"><label>Khóa học</label><select name="courseId">${P5_COURSES.map((id) => `<option value="${id}">${p5Escape(p5Course(id).title)}</option>`).join("")}</select></div><div class="field"><label>Địa điểm</label><input name="location" placeholder="Zoom/Google Meet" /></div><button class="btn btn-primary" type="submit">Thêm lịch</button></form></aside>` : `<aside class="card pad"><h2>Nhắc học</h2><p class="muted">Ở bản thật, lịch học nên đồng bộ Google Calendar, email hoặc thông báo Zalo để học viên không bỏ lỡ.</p><a class="btn btn-primary" href="#/notifications">Xem thông báo</a></aside>`;
  app.innerHTML = `<section class="page-hero"><div class="container"><span class="eyebrow">Lịch học</span><h1>Lịch live, deadline và onboarding</h1><p class="lead">Giúp học viên biết buổi học sắp tới, hạn nộp bài và lịch giải đáp.</p></div></section><section class="section-tight"><div class="container p5-schedule-grid"><div class="card pad"><div class="lesson-sidebar-head"><div><h2>Lịch sắp tới</h2><p class="muted">Dữ liệu lịch học demo.</p></div><span class="chip">${items.length} lịch</span></div><div class="schedule-list">${list}</div></div>${adminForm}</div></section>`;
}

function p5CreateSchedule(event) {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const data = p5Load();
  data.schedules.push({ id: `sch-${Date.now()}`, title: String(form.get("title") || ""), date: String(form.get("date") || p5Today()), time: String(form.get("time") || "20:00"), type: String(form.get("type") || "live"), courseId: String(form.get("courseId") || P5_COURSES[0]), location: String(form.get("location") || "Online") });
  p5Save(data);
  alert("Đã thêm lịch demo.");
  p5RenderSchedule();
}

function p5RenderReports() {
  const app = p5App();
  const user = p5User();
  if (!user) return p5RequireLogin("Báo cáo admin");
  if (user.role !== "admin") {
    app.innerHTML = `<section class="section"><div class="container"><article class="access-card"><div class="access-icon">🛡️</div><span class="eyebrow">Không có quyền</span><h1>Chỉ admin được xem báo cáo</h1><p class="lead">Dùng tài khoản admin demo để kiểm tra báo cáo vận hành.</p><div class="hero-actions"><button class="btn btn-primary" onclick="loginAsDemo('admin')">Đăng nhập admin demo</button><a class="btn btn-light" href="#/dashboard">Về dashboard</a></div></article></div></section>`;
    return;
  }
  const main = p5LoadMain();
  const data = p5Load();
  const students = main.users.filter((item) => item.role === "student").length;
  const active = main.enrollments.filter((item) => item.status === "active").length;
  const pending = main.enrollments.filter((item) => item.status === "pending").length;
  const blocked = main.enrollments.filter((item) => item.status === "blocked").length;
  const ticketsOpen = data.tickets.filter((item) => item.status === "open").length;
  const ratingAvg = data.reviews.length ? (data.reviews.reduce((sum, item) => sum + Number(item.rating || 0), 0) / data.reviews.length).toFixed(1) : "0.0";
  const rows = P5_COURSES.map((id) => {
    const course = p5Course(id);
    const enrollCount = main.enrollments.filter((item) => item.courseId === id).length;
    const courseReviews = data.reviews.filter((item) => item.courseId === id);
    const avg = courseReviews.length ? (courseReviews.reduce((sum, item) => sum + Number(item.rating || 0), 0) / courseReviews.length).toFixed(1) : "-";
    return `<tr><td><strong>${p5Escape(course.title)}</strong></td><td>${enrollCount}</td><td>${avg}</td><td>${courseReviews.length}</td></tr>`;
  }).join("");
  app.innerHTML = `<section class="page-hero"><div class="container"><span class="eyebrow">Báo cáo admin</span><h1>Báo cáo vận hành LMS demo</h1><p class="lead">Tổng quan học viên, quyền học, hỗ trợ và đánh giá khóa học.</p></div></section><section class="section-tight"><div class="container p5-report-grid"><article class="card pad p4-stat"><span>Học viên</span><strong>${students}</strong><small>Tài khoản demo</small></article><article class="card pad p4-stat"><span>Đã mở quyền</span><strong>${active}</strong><small>Enrollment active</small></article><article class="card pad p4-stat"><span>Chờ duyệt</span><strong>${pending}</strong><small>Cần xử lý</small></article><article class="card pad p4-stat"><span>Tạm khóa</span><strong>${blocked}</strong><small>Cần kiểm tra</small></article><article class="card pad p4-stat"><span>Ticket mở</span><strong>${ticketsOpen}</strong><small>Yêu cầu hỗ trợ</small></article><article class="card pad p4-stat"><span>Điểm đánh giá</span><strong>${ratingAvg}</strong><small>Trung bình demo</small></article><div class="card pad p5-report-table"><h2>Báo cáo theo khóa học</h2><div class="admin-table-wrap"><table class="admin-table"><thead><tr><th>Khóa học</th><th>Đăng ký</th><th>Điểm TB</th><th>Đánh giá</th></tr></thead><tbody>${rows}</tbody></table></div></div><aside class="card pad"><h2>Gợi ý vận hành</h2><div class="schema-list"><div><strong>Ưu tiên 1</strong><span>Xử lý đơn chờ duyệt và ticket mở trong ngày.</span></div><div><strong>Ưu tiên 2</strong><span>Theo dõi khóa có điểm đánh giá thấp để cải thiện nội dung.</span></div><div><strong>Ưu tiên 3</strong><span>Nhắc học viên có tiến độ thấp quay lại học.</span></div></div></aside></div></section>`;
}

function p5RenderLegal() {
  const app = p5App();
  app.innerHTML = `<section class="page-hero"><div class="container"><span class="eyebrow">Pháp lý nền tảng</span><h1>Điều khoản, quyền riêng tư và chính sách học trực tuyến</h1><p class="lead">Trang mẫu để chuẩn bị nội dung pháp lý trước khi chạy thật.</p></div></section><section class="section-tight"><div class="container legal-grid"><article class="card pad"><h2>Điều khoản sử dụng</h2><p class="muted">Học viên cần dùng tài khoản đúng mục đích, không chia sẻ quyền truy cập khóa học cho người khác, không sao chép hoặc phát tán nội dung video khi chưa được cho phép.</p><h3>Quyền truy cập khóa học</h3><p>Quyền học chỉ được mở sau khi đơn đăng ký hoặc thanh toán được xác nhận bởi hệ thống/backend/admin.</p><h3>Nội dung học tập</h3><p>Nội dung khóa học chỉ mang tính đào tạo, không thay thế tư vấn chuyên môn trong các lĩnh vực cần giấy phép.</p></article><article class="card pad"><h2>Chính sách quyền riêng tư</h2><p class="muted">Bản thật cần mô tả rõ dữ liệu thu thập, mục đích sử dụng, thời gian lưu trữ và cách người dùng yêu cầu xóa/sửa dữ liệu.</p><h3>Dữ liệu tài khoản</h3><p>Họ tên, email, số điện thoại và tiến độ học cần được bảo vệ bằng backend an toàn.</p><h3>Thanh toán</h3><p>Không lưu thông tin thẻ trực tiếp trên hệ thống nếu dùng cổng thanh toán bên thứ ba.</p></article><article class="card pad"><h2>Chính sách hoàn tiền demo</h2><p class="muted">Khi chạy thật, chính sách hoàn tiền nên rõ ràng theo thời gian học, số bài đã xem và điều kiện cụ thể.</p><div class="warning-box"><strong>Lưu ý:</strong> Phần này là mẫu giao diện, cần luật sư/chuyên gia pháp lý kiểm tra trước khi công bố chính thức.</div></article></div></section>`;
}

function p5EnhanceHome() {
  if (document.querySelector("#p5HomeFinal")) return;
  const anchor = document.querySelector("#p4HomeSection") || document.querySelector(".section-tight");
  if (!anchor) return;
  anchor.insertAdjacentHTML("afterend", `<section id="p5HomeFinal" class="section-tight"><div class="container"><div class="section-head"><span class="eyebrow">Hoàn thiện MVP</span><h2>Các mảnh ghép cuối cho nền tảng học video</h2><p class="lead">Bổ sung hỗ trợ, đánh giá, lịch học, báo cáo và pháp lý để web sẵn sàng demo chuyên nghiệp.</p></div><div class="p5-feature-grid"><a class="card pad p5-feature" href="#/support"><div class="icon-box">🎧</div><h3>Hỗ trợ học viên</h3><p class="muted">Ticket, trạng thái xử lý và phản hồi admin.</p></a><a class="card pad p5-feature" href="#/reviews"><div class="icon-box">⭐</div><h3>Đánh giá khóa học</h3><p class="muted">Thu phản hồi và hiển thị điểm trung bình.</p></a><a class="card pad p5-feature" href="#/schedule"><div class="icon-box">📅</div><h3>Lịch học</h3><p class="muted">Live, deadline và onboarding học viên.</p></a><a class="card pad p5-feature" href="#/reports"><div class="icon-box">📈</div><h3>Báo cáo admin</h3><p class="muted">Số học viên, quyền học, ticket và đánh giá.</p></a></div></div></section>`);
}

function p5InjectNav() {
  const nav = document.querySelector("#mainNav");
  if (nav && !document.querySelector("#p5SupportLink")) {
    const adminLink = nav.querySelector('a[href="#/admin"]');
    adminLink?.insertAdjacentHTML("beforebegin", `<a id="p5SupportLink" href="#/support">Hỗ trợ</a><a href="#/schedule">Lịch học</a>`);
  }
  const footer = document.querySelector(".footer-links");
  if (footer && !document.querySelector("#p5FooterLegal")) {
    footer.insertAdjacentHTML("beforeend", `<a id="p5FooterLegal" href="#/support">Hỗ trợ</a><a href="#/reviews">Đánh giá</a><a href="#/schedule">Lịch học</a><a href="#/legal">Điều khoản</a>`);
  }
  const mobile = document.querySelector("#p4MobileBar");
  if (mobile && !document.querySelector("#p5MobileSupport")) {
    const links = mobile.querySelectorAll("a");
    if (links.length >= 5) links[4].outerHTML = `<a id="p5MobileSupport" href="#/support">Hỗ trợ</a>`;
  }
}

function p5Boot() {
  p5InjectNav();
  const route = p5Route();
  if (route.path === "support") return p5RenderSupport();
  if (route.path === "reviews") return p5RenderReviews();
  if (route.path === "schedule") return p5RenderSchedule();
  if (route.path === "reports") return p5RenderReports();
  if (route.path === "legal") return p5RenderLegal();
  window.setTimeout(() => {
    if (p5Route().path === "home") p5EnhanceHome();
  }, 0);
}

window.p5CreateTicket = p5CreateTicket;
window.p5ResolveTicket = p5ResolveTicket;
window.p5ReopenTicket = p5ReopenTicket;
window.p5CreateReview = p5CreateReview;
window.p5ToggleReview = p5ToggleReview;
window.p5CreateSchedule = p5CreateSchedule;
window.addEventListener("hashchange", p5Boot);
p5Boot();