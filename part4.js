const P4_EXTRA_KEY = "eduvideo_part4_suite_v1";
const P4_MAIN_KEY = "eduvideo_part2_state_v1";
const P4_COURSE_IDS = ["video-marketing-ai", "ban-hang-online", "thiet-ke-landing-page", "quan-tri-lms", "ky-nang-giang-day-video", "cham-soc-hoc-vien"];

function p4App() {
  return document.querySelector("#app");
}

function p4Route() {
  const hash = window.location.hash || "#/";
  const parts = hash.replace(/^#\/?/, "").split("/").filter(Boolean);
  return { path: parts[0] || "home", id: parts[1], lesson: parts[2] };
}

function p4LoadMain() {
  try {
    const saved = JSON.parse(localStorage.getItem(P4_MAIN_KEY));
    if (!saved || typeof saved !== "object") return { users: [], enrollments: [], progress: {}, currentUserId: null };
    return {
      users: Array.isArray(saved.users) ? saved.users : [],
      enrollments: Array.isArray(saved.enrollments) ? saved.enrollments : [],
      progress: saved.progress && typeof saved.progress === "object" ? saved.progress : {},
      currentUserId: saved.currentUserId || null
    };
  } catch (error) {
    return { users: [], enrollments: [], progress: {}, currentUserId: null };
  }
}

function p4SaveMain(next) {
  localStorage.setItem(P4_MAIN_KEY, JSON.stringify(next));
}

function p4LoadExtra() {
  try {
    const saved = JSON.parse(localStorage.getItem(P4_EXTRA_KEY));
    return {
      notifications: Array.isArray(saved?.notifications) ? saved.notifications : p4DefaultNotifications(),
      preferences: saved?.preferences && typeof saved.preferences === "object" ? saved.preferences : {},
      customCourses: Array.isArray(saved?.customCourses) ? saved.customCourses : [],
      learningGoals: saved?.learningGoals && typeof saved.learningGoals === "object" ? saved.learningGoals : {},
      certificates: Array.isArray(saved?.certificates) ? saved.certificates : []
    };
  } catch (error) {
    return { notifications: p4DefaultNotifications(), preferences: {}, customCourses: [], learningGoals: {}, certificates: [] };
  }
}

function p4SaveExtra(extra) {
  localStorage.setItem(P4_EXTRA_KEY, JSON.stringify(extra));
}

function p4Today() {
  return new Date().toISOString().slice(0, 10);
}

function p4CurrentUser() {
  try {
    if (typeof currentUser === "function") return currentUser();
  } catch (error) {}
  const main = p4LoadMain();
  return main.users.find((user) => user.id === main.currentUserId) || null;
}

function p4GetCourse(courseId) {
  try {
    if (typeof getCourse === "function") return getCourse(courseId);
  } catch (error) {}
  return {
    id: courseId || "video-marketing-ai",
    title: "Khóa học mẫu",
    shortTitle: "Demo",
    price: "0đ",
    duration: "0 giờ",
    lessons: 0,
    curriculum: [["Bài học mẫu", "08:00"]],
    instructor: "Giảng viên Demo",
    color: ""
  };
}

function p4Escape(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function p4Percent(courseId, userId) {
  const course = p4GetCourse(courseId);
  const main = p4LoadMain();
  const progress = main.progress[`${userId}::${courseId}`] || { completed: [] };
  const completed = Array.isArray(progress.completed) ? progress.completed.length : 0;
  const total = Math.max(Array.isArray(course.curriculum) ? course.curriculum.length : course.lessons || 1, 1);
  return Math.min(100, Math.round((completed / total) * 100));
}

function p4EnrollmentLabel(status) {
  if (status === "active") return "Đã mở quyền";
  if (status === "pending") return "Chờ duyệt";
  if (status === "blocked") return "Tạm khóa";
  return "Chưa đăng ký";
}

function p4Badge(status) {
  if (status === "active" || status === "done" || status === "sent") return `<span class="badge live">${p4EnrollmentLabel(status) === "Chưa đăng ký" ? status : p4EnrollmentLabel(status)}</span>`;
  if (status === "pending" || status === "draft") return `<span class="badge pending">${p4EnrollmentLabel(status) === "Chưa đăng ký" ? status : p4EnrollmentLabel(status)}</span>`;
  if (status === "blocked") return `<span class="badge blocked">Tạm khóa</span>`;
  return `<span class="badge draft">${p4Escape(status)}</span>`;
}

function p4DefaultNotifications() {
  return [
    { id: "noti-1", title: "Chào mừng bạn đến với EduVideo", body: "Bắt đầu bằng cách chọn khóa học và bấm Tiếp tục học.", audience: "all", createdAt: "2026-06-13", readBy: [] },
    { id: "noti-2", title: "Nhớ hoàn thành bài học đầu tiên", body: "Học đều mỗi ngày 15 phút sẽ giúp bạn giữ nhịp tốt hơn.", audience: "student", createdAt: "2026-06-13", readBy: [] }
  ];
}

function p4RequireLogin(title = "Cần đăng nhập") {
  const app = p4App();
  app.innerHTML = `
    <section class="section">
      <div class="container">
        <article class="access-card">
          <div class="access-icon">🔐</div>
          <span class="eyebrow">${p4Escape(title)}</span>
          <h1>Đăng nhập để tiếp tục</h1>
          <p class="lead">Khu vực này dùng dữ liệu tài khoản học viên/admin demo.</p>
          <div class="hero-actions"><a class="btn btn-primary" href="#/auth">Đăng nhập</a><a class="btn btn-light" href="#/courses">Xem khóa học</a></div>
        </article>
      </div>
    </section>`;
}

function p4RenderDashboard() {
  const app = p4App();
  const user = p4CurrentUser();
  if (!user) return p4RequireLogin("Dashboard học tập");
  if (user.role === "admin") return p4RenderAdminStudio();

  const main = p4LoadMain();
  const extra = p4LoadExtra();
  const enrollments = main.enrollments.filter((item) => item.userId === user.id);
  const active = enrollments.filter((item) => item.status === "active");
  const pending = enrollments.filter((item) => item.status === "pending");
  const avg = active.length ? Math.round(active.reduce((sum, item) => sum + p4Percent(item.courseId, user.id), 0) / active.length) : 0;
  const best = active.map((item) => ({ ...item, percent: p4Percent(item.courseId, user.id), course: p4GetCourse(item.courseId) })).sort((a, b) => b.percent - a.percent)[0];
  const next = active.map((item) => ({ ...item, percent: p4Percent(item.courseId, user.id), course: p4GetCourse(item.courseId) })).sort((a, b) => a.percent - b.percent)[0];
  const goal = extra.learningGoals[user.id] || { minutesPerDay: 20, targetDate: "", note: "Học tối thiểu 3 buổi/tuần" };

  const activeRows = active.length ? active.map((item) => {
    const course = p4GetCourse(item.courseId);
    const percent = p4Percent(item.courseId, user.id);
    return `<article class="p4-course-row"><div class="mini-thumb ${course.color || ""}">${p4Escape(course.shortTitle || "Khóa")}</div><div><h3>${p4Escape(course.title)}</h3><p class="muted">${course.curriculum?.length || course.lessons || 0} bài · ${p4Escape(course.duration || "")}</p><div class="progress-wrap"><div class="progress-label"><span>Tiến độ</span><span>${percent}%</span></div><div class="progress-track"><div class="progress-fill" style="width:${percent}%"></div></div></div></div><a class="btn btn-primary btn-small" href="#/learn/${course.id}">Học tiếp</a></article>`;
  }).join("") : `<div class="empty-state small"><h3>Chưa có khóa đang học</h3><p class="muted">Hãy đăng ký một khóa học để bắt đầu dashboard.</p><a class="btn btn-primary" href="#/courses">Xem khóa học</a></div>`;

  app.innerHTML = `
    <section class="page-hero p4-dashboard-hero">
      <div class="container page-hero-grid">
        <div>
          <span class="eyebrow">Dashboard học viên</span>
          <h1>Xin chào, ${p4Escape(user.name)}</h1>
          <p class="lead">Theo dõi tiến độ, khóa đang học, mục tiêu học tập và chứng chỉ demo tại một nơi.</p>
          <div class="hero-actions"><a class="btn btn-primary" href="${next ? `#/learn/${next.course.id}` : "#/courses"}">${next ? "Học tiếp khóa cần hoàn thành" : "Chọn khóa học"}</a><a class="btn btn-light" href="#/certificates">Xem chứng chỉ</a></div>
        </div>
        <div class="p4-score-card"><span>Tiến độ trung bình</span><strong>${avg}%</strong><small>${active.length} khóa đang học · ${pending.length} khóa chờ duyệt</small></div>
      </div>
    </section>
    <section class="section-tight">
      <div class="container p4-dashboard-grid">
        <article class="card pad p4-stat"><span>Khóa đã mở</span><strong>${active.length}</strong><small>Đang có quyền học</small></article>
        <article class="card pad p4-stat"><span>Chờ duyệt</span><strong>${pending.length}</strong><small>Admin cần xác nhận</small></article>
        <article class="card pad p4-stat"><span>Khóa tốt nhất</span><strong>${best ? `${best.percent}%` : "0%"}</strong><small>${best ? p4Escape(best.course.shortTitle || best.course.title) : "Chưa có"}</small></article>
        <article class="card pad p4-stat"><span>Mục tiêu/ngày</span><strong>${p4Escape(goal.minutesPerDay)}'</strong><small>${p4Escape(goal.note)}</small></article>
        <div class="card pad p4-main-panel">
          <div class="lesson-sidebar-head"><div><h2>Khóa học của tôi</h2><p class="muted">Ưu tiên học tiếp các khóa có tiến độ thấp.</p></div><a class="btn btn-light btn-small" href="#/courses">Thêm khóa</a></div>
          <div class="p4-course-list">${activeRows}</div>
        </div>
        <aside class="card pad p4-side-panel">
          <h2>Mục tiêu học tập</h2>
          <form class="form-grid" onsubmit="p4SaveGoal(event)">
            <div class="field"><label>Phút học mỗi ngày</label><input name="minutesPerDay" type="number" min="5" max="180" value="${p4Escape(goal.minutesPerDay)}" /></div>
            <div class="field"><label>Ngày muốn hoàn thành</label><input name="targetDate" type="date" value="${p4Escape(goal.targetDate)}" /></div>
            <div class="field"><label>Ghi chú mục tiêu</label><input name="note" value="${p4Escape(goal.note)}" /></div>
            <button class="btn btn-primary" type="submit">Lưu mục tiêu</button>
          </form>
          <div class="warning-box"><strong>Gợi ý UX:</strong> Dashboard chỉ hiển thị số liệu quan trọng, không nhồi quá nhiều biểu đồ để học viên không bị rối.</div>
        </aside>
      </div>
    </section>`;
}

function p4SaveGoal(event) {
  event.preventDefault();
  const user = p4CurrentUser();
  if (!user) return;
  const form = new FormData(event.currentTarget);
  const extra = p4LoadExtra();
  extra.learningGoals[user.id] = {
    minutesPerDay: Number(form.get("minutesPerDay") || 20),
    targetDate: String(form.get("targetDate") || ""),
    note: String(form.get("note") || "").trim() || "Học đều mỗi tuần"
  };
  p4SaveExtra(extra);
  alert("Đã lưu mục tiêu học tập.");
  p4RenderDashboard();
}

function p4RenderCertificates() {
  const app = p4App();
  const user = p4CurrentUser();
  if (!user) return p4RequireLogin("Chứng chỉ demo");
  if (user.role === "admin") {
    app.innerHTML = `<section class="section"><div class="container"><article class="access-card"><div class="access-icon">🎓</div><span class="eyebrow">Chứng chỉ</span><h1>Admin không có chứng chỉ học viên</h1><p class="lead">Hãy đăng nhập tài khoản học viên để xem chứng chỉ demo.</p><div class="hero-actions"><button class="btn btn-primary" type="button" onclick="loginAsDemo('student')">Dùng học viên demo</button><a class="btn btn-light" href="#/admin">Về quản trị</a></div></article></div></section>`;
    return;
  }

  const main = p4LoadMain();
  const enrollments = main.enrollments.filter((item) => item.userId === user.id && item.status === "active");
  const cards = enrollments.length ? enrollments.map((item) => {
    const course = p4GetCourse(item.courseId);
    const percent = p4Percent(item.courseId, user.id);
    const ready = percent >= 100;
    return `<article class="card pad certificate-card ${ready ? "ready" : ""}"><div class="certificate-seal">${ready ? "✓" : "%"}</div><span class="eyebrow">${ready ? "Đủ điều kiện" : "Chưa đủ điều kiện"}</span><h2>${p4Escape(course.title)}</h2><p class="muted">Hoàn thành ${percent}% khóa học. ${ready ? "Có thể in chứng chỉ demo." : "Cần hoàn thành 100% để mở chứng chỉ."}</p><div class="progress-wrap"><div class="progress-label"><span>Tiến độ</span><span>${percent}%</span></div><div class="progress-track"><div class="progress-fill" style="width:${percent}%"></div></div></div><div class="card-actions">${ready ? `<button class="btn btn-primary" type="button" onclick="p4PrintCertificate('${course.id}')">In chứng chỉ demo</button>` : `<a class="btn btn-accent" href="#/learn/${course.id}">Học tiếp</a>`}<a class="btn btn-light" href="#/detail/${course.id}">Chi tiết</a></div></article>`;
  }).join("") : `<div class="empty-state"><h2>Chưa có khóa học để cấp chứng chỉ</h2><p class="muted">Đăng ký và hoàn thành khóa học để mở chứng chỉ demo.</p><a class="btn btn-primary" href="#/courses">Xem khóa học</a></div>`;

  app.innerHTML = `
    <section class="page-hero">
      <div class="container"><span class="eyebrow">Chứng chỉ học tập</span><h1>Chứng chỉ hoàn thành khóa học</h1><p class="lead">Bản demo cho phép hiển thị điều kiện cấp chứng chỉ theo tiến độ học tập.</p></div>
    </section>
    <section class="section-tight"><div class="container"><div class="certificate-grid">${cards}</div></div></section>`;
}

function p4PrintCertificate(courseId) {
  const user = p4CurrentUser();
  const course = p4GetCourse(courseId);
  const certWindow = window.open("", "_blank");
  if (!certWindow) {
    alert("Trình duyệt đang chặn cửa sổ in. Hãy cho phép popup để in chứng chỉ demo.");
    return;
  }
  certWindow.document.write(`<!doctype html><html lang="vi"><head><meta charset="utf-8"><title>Chứng chỉ demo</title><style>body{font-family:Arial,sans-serif;background:#f8fafc;padding:40px}.cert{max-width:900px;margin:auto;background:#fff;border:10px solid #2563eb;border-radius:24px;padding:60px;text-align:center;color:#0f172a}.seal{width:90px;height:90px;border-radius:999px;background:#f59e0b;color:#fff;display:grid;place-items:center;margin:0 auto 20px;font-size:42px;font-weight:900}h1{font-size:44px;margin:0 0 10px}h2{font-size:34px;margin:10px 0}.muted{color:#64748b}.line{height:1px;background:#e2e8f0;margin:32px 0}.sign{display:flex;justify-content:space-between;margin-top:48px}</style></head><body><section class="cert"><div class="seal">✓</div><p class="muted">CHỨNG CHỈ HOÀN THÀNH DEMO</p><h1>EduVideo</h1><p>Chứng nhận học viên</p><h2>${p4Escape(user?.name || "Học viên")}</h2><p>đã hoàn thành khóa học</p><h2>${p4Escape(course.title)}</h2><p class="muted">Ngày cấp: ${p4Today()} · Đây là chứng chỉ demo frontend, chưa có mã xác thực backend.</p><div class="line"></div><div class="sign"><span>Giảng viên</span><span>EduVideo</span></div></section><script>window.print()<\/script></body></html>`);
  certWindow.document.close();
}

function p4RenderNotifications() {
  const app = p4App();
  const user = p4CurrentUser();
  if (!user) return p4RequireLogin("Thông báo");
  const extra = p4LoadExtra();
  const visible = extra.notifications.filter((item) => item.audience === "all" || item.audience === user.role || item.audience === user.id).sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
  const list = visible.length ? visible.map((item) => {
    const read = Array.isArray(item.readBy) && item.readBy.includes(user.id);
    return `<article class="notification-item ${read ? "read" : ""}"><div><strong>${p4Escape(item.title)}</strong><p>${p4Escape(item.body)}</p><small>${p4Escape(item.createdAt)} · ${read ? "Đã đọc" : "Chưa đọc"}</small></div><button class="btn btn-light btn-small" type="button" onclick="p4MarkNotification('${item.id}')">${read ? "Đã đọc" : "Đánh dấu đọc"}</button></article>`;
  }).join("") : `<div class="empty-state small"><h3>Chưa có thông báo</h3><p class="muted">Thông báo từ admin sẽ hiển thị tại đây.</p></div>`;

  const adminBox = user.role === "admin" ? `
    <aside class="card pad">
      <h2>Gửi thông báo demo</h2>
      <form class="form-grid" onsubmit="p4SendNotification(event)">
        <div class="field"><label>Tiêu đề</label><input name="title" required placeholder="Ví dụ: Lịch học mới" /></div>
        <div class="field"><label>Nội dung</label><textarea name="body" rows="4" required placeholder="Nhập nội dung thông báo..."></textarea></div>
        <div class="field"><label>Đối tượng</label><select name="audience"><option value="all">Tất cả</option><option value="student">Học viên</option><option value="admin">Admin</option></select></div>
        <button class="btn btn-primary" type="submit">Gửi thông báo demo</button>
      </form>
    </aside>` : `
    <aside class="card pad"><h2>Gợi ý học tập</h2><p class="muted">Bật nhắc học trong bản backend thật bằng email, Zalo hoặc notification tùy nền tảng.</p><a class="btn btn-primary" href="#/dashboard">Về dashboard</a></aside>`;

  app.innerHTML = `
    <section class="page-hero"><div class="container"><span class="eyebrow">Trung tâm thông báo</span><h1>Thông báo và nhắc học</h1><p class="lead">Quản lý thông báo hệ thống, nhắc học và tin từ quản trị viên.</p></div></section>
    <section class="section-tight"><div class="container p4-two-col"><div class="card pad"><div class="lesson-sidebar-head"><div><h2>Danh sách thông báo</h2><p class="muted">Dữ liệu lưu localStorage để demo.</p></div><button class="btn btn-light btn-small" onclick="p4MarkAllNotifications()">Đọc tất cả</button></div><div class="notification-list">${list}</div></div>${adminBox}</div></section>`;
}

function p4MarkNotification(id) {
  const user = p4CurrentUser();
  const extra = p4LoadExtra();
  const item = extra.notifications.find((n) => n.id === id);
  if (item && user) {
    item.readBy = Array.isArray(item.readBy) ? item.readBy : [];
    if (!item.readBy.includes(user.id)) item.readBy.push(user.id);
    p4SaveExtra(extra);
  }
  p4RenderNotifications();
}

function p4MarkAllNotifications() {
  const user = p4CurrentUser();
  const extra = p4LoadExtra();
  if (user) {
    extra.notifications.forEach((item) => {
      item.readBy = Array.isArray(item.readBy) ? item.readBy : [];
      if (!item.readBy.includes(user.id)) item.readBy.push(user.id);
    });
    p4SaveExtra(extra);
  }
  p4RenderNotifications();
}

function p4SendNotification(event) {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const extra = p4LoadExtra();
  extra.notifications.push({ id: `noti-${Date.now()}`, title: String(form.get("title") || ""), body: String(form.get("body") || ""), audience: String(form.get("audience") || "all"), createdAt: p4Today(), readBy: [] });
  p4SaveExtra(extra);
  alert("Đã gửi thông báo demo.");
  p4RenderNotifications();
}

function p4RenderSettings() {
  const app = p4App();
  const user = p4CurrentUser();
  if (!user) return p4RequireLogin("Cài đặt tài khoản");
  const extra = p4LoadExtra();
  const pref = extra.preferences[user.id] || { theme: "system", emailReminder: true, compactLearning: false };
  app.innerHTML = `
    <section class="page-hero"><div class="container"><span class="eyebrow">Cài đặt tài khoản</span><h1>Thông tin cá nhân và trải nghiệm học</h1><p class="lead">Bản demo cho phép cập nhật hồ sơ trên localStorage. Bản thật cần API và bảo mật mật khẩu.</p></div></section>
    <section class="section-tight"><div class="container p4-two-col">
      <article class="card pad"><h2>Hồ sơ cá nhân</h2><form class="form-grid" onsubmit="p4SaveProfile(event)"><div class="field"><label>Họ tên</label><input name="name" value="${p4Escape(user.name)}" required /></div><div class="field"><label>Email</label><input name="email" type="email" value="${p4Escape(user.email)}" required /></div><div class="field"><label>Số điện thoại</label><input name="phone" value="${p4Escape(user.phone || "")}" /></div><button class="btn btn-primary" type="submit">Lưu hồ sơ</button></form></article>
      <aside class="card pad"><h2>Tùy chọn học tập</h2><form class="form-grid" onsubmit="p4SavePreferences(event)"><div class="field"><label>Giao diện</label><select name="theme"><option value="system" ${pref.theme === "system" ? "selected" : ""}>Theo hệ thống</option><option value="light" ${pref.theme === "light" ? "selected" : ""}>Sáng</option><option value="focus" ${pref.theme === "focus" ? "selected" : ""}>Tập trung học</option></select></div><label class="p4-check"><input type="checkbox" name="emailReminder" ${pref.emailReminder ? "checked" : ""}/> Nhận nhắc học qua email demo</label><label class="p4-check"><input type="checkbox" name="compactLearning" ${pref.compactLearning ? "checked" : ""}/> Giao diện học gọn hơn</label><button class="btn btn-primary" type="submit">Lưu tùy chọn</button></form><div class="warning-box"><strong>Lưu ý:</strong> đổi mật khẩu thật phải có xác thực mật khẩu cũ, mã OTP/email và lưu hash ở server.</div></aside>
    </div></section>`;
}

function p4SaveProfile(event) {
  event.preventDefault();
  const user = p4CurrentUser();
  const form = new FormData(event.currentTarget);
  const main = p4LoadMain();
  const target = main.users.find((item) => item.id === user.id);
  if (target) {
    target.name = String(form.get("name") || "").trim();
    target.email = String(form.get("email") || "").trim();
    target.phone = String(form.get("phone") || "").trim();
    p4SaveMain(main);
    alert("Đã lưu hồ sơ demo. Tải lại trang nếu menu chưa cập nhật tên.");
  }
  p4RenderSettings();
}

function p4SavePreferences(event) {
  event.preventDefault();
  const user = p4CurrentUser();
  const form = new FormData(event.currentTarget);
  const extra = p4LoadExtra();
  extra.preferences[user.id] = { theme: String(form.get("theme") || "system"), emailReminder: form.has("emailReminder"), compactLearning: form.has("compactLearning") };
  p4SaveExtra(extra);
  alert("Đã lưu tùy chọn học tập.");
  p4RenderSettings();
}

function p4RenderAdminStudio() {
  const app = p4App();
  const user = p4CurrentUser();
  if (!user) return p4RequireLogin("Studio quản trị");
  if (user.role !== "admin") {
    app.innerHTML = `<section class="section"><div class="container"><article class="access-card"><div class="access-icon">🛡️</div><span class="eyebrow">Không có quyền</span><h1>Chỉ admin được vào studio quản trị</h1><p class="lead">Hãy dùng tài khoản admin demo để kiểm thử.</p><div class="hero-actions"><button class="btn btn-primary" onclick="loginAsDemo('admin')">Đăng nhập admin demo</button><a class="btn btn-light" href="#/dashboard">Về dashboard</a></div></article></div></section>`;
    return;
  }

  const main = p4LoadMain();
  const extra = p4LoadExtra();
  const totalStudents = main.users.filter((item) => item.role === "student").length;
  const totalEnrollments = main.enrollments.length;
  const activeEnrollments = main.enrollments.filter((item) => item.status === "active").length;
  const customRows = extra.customCourses.length ? extra.customCourses.map((item) => `<tr><td><strong>${p4Escape(item.title)}</strong><br><span class="muted">${p4Escape(item.slug)}</span></td><td>${p4Escape(item.price)}</td><td>${p4Escape(item.lessons)} bài</td><td>${p4Badge(item.status)}</td><td><button class="btn btn-danger btn-small" onclick="p4DeleteCustomCourse('${item.id}')">Xóa demo</button></td></tr>`).join("") : `<tr><td colspan="5">Chưa có khóa học demo do admin tạo.</td></tr>`;

  app.innerHTML = `
    <section class="page-hero"><div class="container page-hero-grid"><div><span class="eyebrow">Admin Studio</span><h1>Quản trị nội dung khóa học</h1><p class="lead">Khu vực mô phỏng tạo khóa học, thống kê vận hành và checklist trước khi nối backend.</p></div><a class="btn btn-primary" href="#/admin">Về quản trị quyền học</a></div></section>
    <section class="section-tight"><div class="container p4-dashboard-grid">
      <article class="card pad p4-stat"><span>Học viên</span><strong>${totalStudents}</strong><small>Tài khoản demo</small></article>
      <article class="card pad p4-stat"><span>Đăng ký</span><strong>${totalEnrollments}</strong><small>Tổng quyền học</small></article>
      <article class="card pad p4-stat"><span>Đã mở quyền</span><strong>${activeEnrollments}</strong><small>Đang học được</small></article>
      <article class="card pad p4-stat"><span>Khóa demo mới</span><strong>${extra.customCourses.length}</strong><small>Lưu localStorage</small></article>
      <div class="card pad p4-main-panel"><div class="lesson-sidebar-head"><div><h2>Khóa học admin tạo demo</h2><p class="muted">Dùng để mô phỏng form quản trị. Bản thật cần lưu database.</p></div><span class="chip warning">localStorage</span></div><div class="admin-table-wrap"><table class="admin-table"><thead><tr><th>Khóa học</th><th>Giá</th><th>Bài</th><th>Trạng thái</th><th>Thao tác</th></tr></thead><tbody>${customRows}</tbody></table></div></div>
      <aside class="card pad p4-side-panel"><h2>Tạo khóa học demo</h2><form class="form-grid" onsubmit="p4CreateCustomCourse(event)"><div class="field"><label>Tên khóa học</label><input name="title" required placeholder="Ví dụ: Khóa học mới" /></div><div class="field"><label>Slug</label><input name="slug" required placeholder="khoa-hoc-moi" /></div><div class="field"><label>Học phí</label><input name="price" required placeholder="990.000đ" /></div><div class="field"><label>Số bài</label><input name="lessons" type="number" min="1" value="10" /></div><div class="field"><label>Trạng thái</label><select name="status"><option value="draft">Bản nháp</option><option value="active">Đã xuất bản demo</option></select></div><button class="btn btn-primary" type="submit">Tạo khóa demo</button></form></aside>
      <article class="card pad backend-wide"><h2>Checklist hoàn thiện trước khi chạy thật</h2><div class="checklist-grid"><label><input type="checkbox" disabled/> CRUD khóa học lưu database.</label><label><input type="checkbox" disabled/> Upload video lên storage/CDN có ký URL.</label><label><input type="checkbox" disabled/> Phân quyền admin kiểm tra server-side.</label><label><input type="checkbox" disabled/> Log lịch sử chỉnh sửa khóa học.</label><label><input type="checkbox" disabled/> Preview bài học miễn phí không lộ video trả phí.</label><label><input type="checkbox" disabled/> Backup dữ liệu trước mỗi deploy.</label></div></article>
    </div></section>`;
}

function p4CreateCustomCourse(event) {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const extra = p4LoadExtra();
  extra.customCourses.push({ id: `custom-${Date.now()}`, title: String(form.get("title") || ""), slug: String(form.get("slug") || ""), price: String(form.get("price") || ""), lessons: Number(form.get("lessons") || 1), status: String(form.get("status") || "draft"), createdAt: p4Today() });
  p4SaveExtra(extra);
  alert("Đã tạo khóa học demo trong localStorage.");
  p4RenderAdminStudio();
}

function p4DeleteCustomCourse(id) {
  if (!confirm("Xóa khóa học demo này?")) return;
  const extra = p4LoadExtra();
  extra.customCourses = extra.customCourses.filter((item) => item.id !== id);
  p4SaveExtra(extra);
  p4RenderAdminStudio();
}

function p4EnhanceHome() {
  if (document.querySelector("#p4HomeSection")) return;
  const target = document.querySelector(".hero") || document.querySelector(".section");
  if (!target) return;
  target.insertAdjacentHTML("afterend", `
    <section id="p4HomeSection" class="section-tight p4-complete-strip">
      <div class="container p4-complete-grid">
        <article class="card pad"><div class="icon-box">📊</div><h3>Dashboard học viên</h3><p class="muted">Theo dõi tiến độ, mục tiêu học tập và khóa cần học tiếp.</p><a class="btn btn-light btn-small" href="#/dashboard">Mở dashboard</a></article>
        <article class="card pad"><div class="icon-box">🎓</div><h3>Chứng chỉ demo</h3><p class="muted">Hiển thị điều kiện cấp chứng chỉ theo tỷ lệ hoàn thành khóa học.</p><a class="btn btn-light btn-small" href="#/certificates">Xem chứng chỉ</a></article>
        <article class="card pad"><div class="icon-box">🔔</div><h3>Thông báo</h3><p class="muted">Nhắc học, thông báo admin và trạng thái đọc/chưa đọc.</p><a class="btn btn-light btn-small" href="#/notifications">Xem thông báo</a></article>
      </div>
    </section>`);
}

function p4EnhanceCourses() {
  const filterBar = document.querySelector(".filter-bar");
  const grid = document.querySelector(".course-grid");
  if (!filterBar || !grid || document.querySelector("#p4CourseSearch")) return;
  filterBar.insertAdjacentHTML("beforebegin", `<div id="p4CourseSearch" class="p4-course-search"><input type="search" placeholder="Tìm khóa học theo tên, giảng viên, chủ đề..." oninput="p4FilterCourses(this.value)"/><span class="chip">Tìm kiếm demo</span></div>`);
}

function p4FilterCourses(keyword) {
  const value = String(keyword || "").toLowerCase().trim();
  document.querySelectorAll(".course-card").forEach((card) => {
    const text = card.textContent.toLowerCase();
    card.style.display = !value || text.includes(value) ? "" : "none";
  });
}

function p4InjectNav() {
  const nav = document.querySelector("#mainNav");
  if (nav && !document.querySelector("#p4DashboardLink")) {
    const accountLink = nav.querySelector('a[href="#/account"]');
    accountLink?.insertAdjacentHTML("afterend", `<a id="p4DashboardLink" href="#/dashboard">Dashboard</a><a href="#/notifications">Thông báo</a>`);
  }
  if (!document.querySelector("#p4MobileBar")) {
    document.body.insertAdjacentHTML("beforeend", `<nav id="p4MobileBar" class="p4-mobile-bar" aria-label="Điều hướng nhanh trên điện thoại"><a href="#/">Trang chủ</a><a href="#/courses">Khóa học</a><a href="#/dashboard">Học tập</a><a href="#/notifications">Thông báo</a><a href="#/account">Tài khoản</a></nav>`);
  }
}

function p4Boot() {
  p4InjectNav();
  const route = p4Route();
  if (route.path === "dashboard") return p4RenderDashboard();
  if (route.path === "certificates") return p4RenderCertificates();
  if (route.path === "notifications") return p4RenderNotifications();
  if (route.path === "settings") return p4RenderSettings();
  if (route.path === "admin-content") return p4RenderAdminStudio();
  window.setTimeout(() => {
    const fresh = p4Route();
    if (fresh.path === "home") p4EnhanceHome();
    if (fresh.path === "courses") p4EnhanceCourses();
  }, 0);
}

window.p4SaveGoal = p4SaveGoal;
window.p4PrintCertificate = p4PrintCertificate;
window.p4MarkNotification = p4MarkNotification;
window.p4MarkAllNotifications = p4MarkAllNotifications;
window.p4SendNotification = p4SendNotification;
window.p4SaveProfile = p4SaveProfile;
window.p4SavePreferences = p4SavePreferences;
window.p4CreateCustomCourse = p4CreateCustomCourse;
window.p4DeleteCustomCourse = p4DeleteCustomCourse;
window.p4FilterCourses = p4FilterCourses;
window.addEventListener("hashchange", p4Boot);
p4Boot();