const PART3_KEY = "eduvideo_part3_extra_v1";
const MAIN_KEY = "eduvideo_part2_state_v1";
const COURSE_IDS = ["video-marketing-ai", "ban-hang-online", "thiet-ke-landing-page", "quan-tri-lms", "ky-nang-giang-day-video", "cham-soc-hoc-vien"];

const fallbackCourses = {
  "video-marketing-ai": { id: "video-marketing-ai", title: "Tạo video ngắn bằng AI", shortTitle: "Video AI", price: "799.000đ", duration: "3 giờ 20 phút", lessons: 18, color: "" },
  "ban-hang-online": { id: "ban-hang-online", title: "Bán hàng online thực chiến", shortTitle: "Bán hàng", price: "1.200.000đ", duration: "5 giờ 10 phút", lessons: 24, color: "orange" },
  "thiet-ke-landing-page": { id: "thiet-ke-landing-page", title: "Thiết kế landing page khóa học", shortTitle: "Landing", price: "990.000đ", duration: "4 giờ 05 phút", lessons: 16, color: "green" },
  "quan-tri-lms": { id: "quan-tri-lms", title: "Quản trị nền tảng LMS", shortTitle: "LMS", price: "1.490.000đ", duration: "4 giờ 45 phút", lessons: 21, color: "purple" },
  "ky-nang-giang-day-video": { id: "ky-nang-giang-day-video", title: "Kỹ năng giảng dạy qua video", shortTitle: "Giảng dạy", price: "690.000đ", duration: "2 giờ 50 phút", lessons: 14, color: "slate" },
  "cham-soc-hoc-vien": { id: "cham-soc-hoc-vien", title: "Chăm sóc học viên sau đăng ký", shortTitle: "CSHV", price: "590.000đ", duration: "2 giờ 15 phút", lessons: 12, color: "green" }
};

function p3App() {
  return document.querySelector("#app");
}

function p3Route() {
  const hash = window.location.hash || "#/";
  const parts = hash.replace(/^#\/?/, "").split("/").filter(Boolean);
  return { path: parts[0] || "home", id: parts[1], lesson: parts[2] };
}

function p3LoadMain() {
  try {
    return JSON.parse(localStorage.getItem(MAIN_KEY)) || {};
  } catch (error) {
    return {};
  }
}

function p3SaveMain(state) {
  localStorage.setItem(MAIN_KEY, JSON.stringify(state));
}

function p3LoadExtra() {
  try {
    const saved = JSON.parse(localStorage.getItem(PART3_KEY));
    return {
      orders: Array.isArray(saved?.orders) ? saved.orders : [],
      notes: saved?.notes && typeof saved.notes === "object" ? saved.notes : {},
      questions: Array.isArray(saved?.questions) ? saved.questions : [],
      customCourses: Array.isArray(saved?.customCourses) ? saved.customCourses : []
    };
  } catch (error) {
    return { orders: [], notes: {}, questions: [], customCourses: [] };
  }
}

function p3SaveExtra(extra) {
  localStorage.setItem(PART3_KEY, JSON.stringify(extra));
}

function p3Today() {
  return new Date().toISOString().slice(0, 10);
}

function p3User() {
  if (typeof currentUser === "function") return currentUser();
  const main = p3LoadMain();
  return (main.users || []).find((user) => user.id === main.currentUserId) || null;
}

function p3GetUser(userId) {
  const main = p3LoadMain();
  return (main.users || []).find((user) => user.id === userId) || null;
}

function p3Course(courseId) {
  try {
    if (typeof getCourse === "function") return getCourse(courseId);
  } catch (error) {}
  return fallbackCourses[courseId] || fallbackCourses[COURSE_IDS[0]];
}

function p3Escape(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function p3Badge(status) {
  if (status === "paid" || status === "active") return `<span class="badge live">Đã xác nhận</span>`;
  if (status === "cancelled" || status === "blocked") return `<span class="badge blocked">Đã hủy/khóa</span>`;
  return `<span class="badge pending">Chờ xác nhận</span>`;
}

function p3NoteKey(userId, courseId, lessonIndex) {
  return `${userId}::${courseId}::${lessonIndex}`;
}

function p3RenderCheckout(courseId) {
  const app = p3App();
  const course = p3Course(courseId);
  const user = p3User();
  if (!app) return;

  if (!user) {
    app.innerHTML = `
      <section class="section">
        <div class="container">
          <article class="access-card">
            <div class="access-icon">🔐</div>
            <span class="eyebrow">Cần đăng nhập</span>
            <h1>Đăng nhập trước khi đăng ký khóa học</h1>
            <p class="lead">Học viên cần đăng nhập hoặc tạo tài khoản trước khi tạo đơn đăng ký học.</p>
            <div class="hero-actions"><a class="btn btn-primary" href="#/auth">Đăng nhập</a><a class="btn btn-light" href="#/detail/${course.id}">Xem lại khóa học</a></div>
          </article>
        </div>
      </section>`;
    return;
  }

  if (user.role !== "student") {
    app.innerHTML = `
      <section class="section">
        <div class="container">
          <article class="access-card">
            <div class="access-icon">🛡️</div>
            <span class="eyebrow">Tài khoản admin</span>
            <h1>Admin không tạo đơn học viên</h1>
            <p class="lead">Hãy dùng tài khoản học viên để kiểm thử luồng đăng ký/mua khóa học.</p>
            <div class="hero-actions"><button class="btn btn-primary" type="button" onclick="loginAsDemo('student')">Chuyển sang học viên demo</button><a class="btn btn-light" href="#/admin">Về quản trị</a></div>
          </article>
        </div>
      </section>`;
    return;
  }

  app.innerHTML = `
    <section class="page-hero">
      <div class="container page-hero-grid">
        <div>
          <a class="chip" href="#/detail/${course.id}">← Quay lại chi tiết</a>
          <span class="eyebrow">Checkout demo</span>
          <h1>Đăng ký khóa học</h1>
          <p class="lead">Luồng này chỉ tạo đơn mẫu và trạng thái chờ xác nhận. Chưa thu tiền thật và chưa nối cổng thanh toán.</p>
        </div>
        <div class="secure-box">🔒 Demo an toàn · Không thu tiền thật</div>
      </div>
    </section>
    <section class="section-tight">
      <div class="container checkout-grid">
        <article class="card pad checkout-card">
          <h2>Thông tin học viên</h2>
          <form class="form-grid" onsubmit="p3HandleCheckout(event, '${course.id}')">
            <div class="field"><label>Họ tên</label><input name="name" value="${p3Escape(user.name)}" required /></div>
            <div class="field"><label>Email</label><input name="email" type="email" value="${p3Escape(user.email)}" required /></div>
            <div class="field"><label>Số điện thoại</label><input name="phone" value="${p3Escape(user.phone || "")}" placeholder="Nhập số điện thoại" /></div>
            <div class="field"><label>Hình thức xác nhận</label>
              <select name="method" required>
                <option value="Chuyển khoản">Chuyển khoản ngân hàng demo</option>
                <option value="Tư vấn sau">Để lại thông tin, admin tư vấn sau</option>
                <option value="Mở quyền demo">Mở quyền demo ngay để test</option>
              </select>
            </div>
            <div class="warning-box"><strong>Lưu ý:</strong> Khi làm thật, thanh toán phải xác thực qua backend/webhook. Frontend không được tự mở quyền học sau khi người dùng bấm nút.</div>
            <button class="btn btn-accent" type="submit">Hoàn tất đăng ký demo</button>
          </form>
        </article>
        <aside class="card pad order-summary">
          <h2>Tóm tắt đơn hàng</h2>
          <div class="mini-order-course">
            <div class="mini-thumb ${course.color || ""}">${p3Escape(course.shortTitle || "Khóa học")}</div>
            <div><strong>${p3Escape(course.title)}</strong><p class="muted">${course.lessons || 0} bài · ${p3Escape(course.duration || "")}</p></div>
          </div>
          <div class="summary-line"><span>Học phí</span><strong>${p3Escape(course.price)}</strong></div>
          <div class="summary-line"><span>Giảm giá</span><strong>0đ</strong></div>
          <div class="summary-total"><span>Tổng demo</span><strong>${p3Escape(course.price)}</strong></div>
          <div class="bank-box">
            <strong>Thông tin chuyển khoản mẫu</strong>
            <span>Ngân hàng: DEMO BANK</span>
            <span>STK: 0000 0000 0000</span>
            <span>Nội dung: ${p3Escape(user.id.toUpperCase())} ${p3Escape(course.shortTitle || "COURSE")}</span>
          </div>
        </aside>
      </div>
    </section>`;
}

function p3HandleCheckout(event, courseId) {
  event.preventDefault();
  const user = p3User();
  const course = p3Course(courseId);
  const form = new FormData(event.currentTarget);
  const method = String(form.get("method") || "Chuyển khoản");
  const extra = p3LoadExtra();

  extra.orders.push({
    id: `ORD-${Date.now()}`,
    userId: user.id,
    courseId,
    amount: course.price,
    method,
    status: method === "Mở quyền demo" ? "paid" : "pending",
    createdAt: p3Today()
  });
  p3SaveExtra(extra);

  if (typeof enrollCourse === "function") {
    enrollCourse(courseId, method === "Mở quyền demo" ? "active" : "pending");
  } else {
    window.location.hash = "#/account";
  }
}

function p3RenderBackendPlan() {
  const app = p3App();
  if (!app) return;
  app.innerHTML = `
    <section class="page-hero">
      <div class="container">
        <span class="eyebrow">Chuẩn bị backend/database</span>
        <h1>Khung kỹ thuật cho bản chạy thật</h1>
        <p class="lead">Phần này là bản thiết kế cấu trúc để nối backend sau, giúp tránh lỗi quyền học, thanh toán và bảo vệ video.</p>
      </div>
    </section>
    <section class="section-tight">
      <div class="container backend-grid">
        <article class="card pad">
          <h2>Bảng dữ liệu cần có</h2>
          <div class="schema-list">
            <div><strong>users</strong><span>id, name, email, phone, password_hash, role, status</span></div>
            <div><strong>courses</strong><span>id, title, slug, description, price, status, instructor_id</span></div>
            <div><strong>lessons</strong><span>id, course_id, title, video_url, duration, sort_order, is_preview</span></div>
            <div><strong>enrollments</strong><span>user_id, course_id, status, activated_at, expires_at</span></div>
            <div><strong>orders</strong><span>user_id, course_id, amount, method, status, gateway_ref</span></div>
            <div><strong>progress</strong><span>user_id, course_id, lesson_id, completed_at, last_position</span></div>
          </div>
        </article>
        <article class="card pad">
          <h2>API tối thiểu</h2>
          <div class="schema-list">
            <div><strong>POST /auth/login</strong><span>Đăng nhập, trả session/token an toàn</span></div>
            <div><strong>GET /courses</strong><span>Lấy danh sách khóa học đã xuất bản</span></div>
            <div><strong>POST /orders</strong><span>Tạo đơn đăng ký/thanh toán</span></div>
            <div><strong>POST /payments/webhook</strong><span>Xác nhận thanh toán từ cổng thanh toán</span></div>
            <div><strong>GET /learn/:courseId</strong><span>Server kiểm tra quyền rồi mới trả bài học/video</span></div>
            <div><strong>POST /progress</strong><span>Lưu tiến độ học thật</span></div>
          </div>
        </article>
        <article class="card pad backend-wide">
          <h2>Checklist bảo mật bắt buộc trước khi chạy thật</h2>
          <div class="checklist-grid">
            <label><input type="checkbox" disabled /> Mật khẩu lưu dạng hash, không lưu plain text.</label>
            <label><input type="checkbox" disabled /> Quyền xem video kiểm tra ở server, không dựa vào localStorage.</label>
            <label><input type="checkbox" disabled /> Thanh toán xác nhận bằng webhook, không tin dữ liệu frontend.</label>
            <label><input type="checkbox" disabled /> Link video dùng signed URL hoặc token có hạn.</label>
            <label><input type="checkbox" disabled /> Admin API kiểm tra role thật ở backend.</label>
            <label><input type="checkbox" disabled /> Backup database trước khi deploy thay đổi lớn.</label>
          </div>
        </article>
      </div>
    </section>`;
}

function p3EnhanceDetail(courseId) {
  const sidebar = document.querySelector(".detail-sidebar .form-actions");
  const course = p3Course(courseId);
  if (!sidebar || sidebar.dataset.part3 === "1") return;
  sidebar.dataset.part3 = "1";
  sidebar.insertAdjacentHTML("afterbegin", `<a class="btn btn-accent" href="#/checkout/${course.id}">Đăng ký / mua khóa học</a>`);
}

function p3EnhanceLearn(courseId, lessonIndex = "0") {
  const user = p3User();
  const videoInfo = document.querySelector(".video-player");
  if (!user || !videoInfo || document.querySelector("#part3LearnTools")) return;
  const extra = p3LoadExtra();
  const key = p3NoteKey(user.id, courseId, lessonIndex || "0");
  const questions = extra.questions.filter((q) => q.courseId === courseId && String(q.lessonIndex) === String(lessonIndex || "0")).reverse();
  const questionHtml = questions.length ? questions.map((q) => {
    const author = p3GetUser(q.userId);
    return `<div class="question-item"><strong>${p3Escape(author?.name || "Học viên")}</strong><p>${p3Escape(q.text)}</p><small>${q.createdAt} · ${q.status === "answered" ? "Đã trả lời" : "Chờ trả lời"}</small></div>`;
  }).join("") : `<p class="muted">Chưa có câu hỏi nào cho bài này.</p>`;

  videoInfo.insertAdjacentHTML("afterend", `
    <div id="part3LearnTools" class="learning-tools-grid">
      <div class="panel card pad">
        <h2>Tài liệu bài học</h2>
        <p class="muted">Khu vực chuẩn bị gắn PDF, link tài liệu và bài tập. Hiện đang dùng dữ liệu mẫu.</p>
        <div class="resource-list">
          <a class="resource-item" href="javascript:void(0)"><strong>📄 Tài liệu tóm tắt bài học</strong><span>PDF mẫu</span></a>
          <a class="resource-item" href="javascript:void(0)"><strong>📝 Bài tập thực hành ngắn</strong><span>Worksheet</span></a>
          <a class="resource-item" href="javascript:void(0)"><strong>🔗 Link tham khảo</strong><span>Chưa nối thật</span></a>
        </div>
      </div>
      <div class="panel card pad">
        <h2>Ghi chú cá nhân</h2>
        <p class="muted">Ghi chú được lưu localStorage theo từng bài học.</p>
        <form class="form-grid" onsubmit="p3SaveLessonNote(event, '${courseId}', '${lessonIndex || "0"}')">
          <textarea name="note" rows="5" placeholder="Viết ghi chú khi học bài này...">${p3Escape(extra.notes[key] || "")}</textarea>
          <button class="btn btn-primary" type="submit">Lưu ghi chú</button>
        </form>
      </div>
      <div class="panel card pad part3-full">
        <div class="lesson-sidebar-head"><div><h2>Hỏi đáp bài học</h2><p class="muted">Học viên gửi câu hỏi, admin/giảng viên xử lý ở bản backend sau.</p></div><span class="chip warning">Demo</span></div>
        <form class="question-form" onsubmit="p3AddQuestion(event, '${courseId}', '${lessonIndex || "0"}')">
          <input name="question" placeholder="Nhập câu hỏi về bài học này..." required />
          <button class="btn btn-accent" type="submit">Gửi câu hỏi</button>
        </form>
        <div class="question-list">${questionHtml}</div>
      </div>
    </div>`);
}

function p3SaveLessonNote(event, courseId, lessonIndex) {
  event.preventDefault();
  const user = p3User();
  if (!user) return;
  const extra = p3LoadExtra();
  const form = new FormData(event.currentTarget);
  extra.notes[p3NoteKey(user.id, courseId, lessonIndex)] = String(form.get("note") || "").trim();
  p3SaveExtra(extra);
  alert("Đã lưu ghi chú bài học.");
}

function p3AddQuestion(event, courseId, lessonIndex) {
  event.preventDefault();
  const user = p3User();
  if (!user) return;
  const form = new FormData(event.currentTarget);
  const text = String(form.get("question") || "").trim();
  if (!text) return;
  const extra = p3LoadExtra();
  extra.questions.push({ id: `q-${Date.now()}`, userId: user.id, courseId, lessonIndex, text, createdAt: p3Today(), status: "open" });
  p3SaveExtra(extra);
  p3EnhanceLearn(courseId, lessonIndex);
  window.dispatchEvent(new HashChangeEvent("hashchange"));
}

function p3EnhanceAccount() {
  const grid = document.querySelector(".account-grid");
  if (!grid || document.querySelector("#part3OrdersPanel")) return;
  const user = p3User();
  if (!user || user.role !== "student") return;
  const extra = p3LoadExtra();
  const orders = extra.orders.filter((order) => order.userId === user.id).reverse();
  const rows = orders.length ? orders.map((order) => {
    const course = p3Course(order.courseId);
    return `<div class="order-row"><div><strong>${p3Escape(course.title)}</strong><small>${order.id} · ${order.method} · ${order.createdAt}</small></div><div>${p3Badge(order.status)}</div><strong>${p3Escape(order.amount)}</strong></div>`;
  }).join("") : `<div class="empty-state small"><h3>Chưa có đơn đăng ký</h3><p class="muted">Khi đăng ký/mua khóa học demo, đơn sẽ hiển thị tại đây.</p></div>`;
  grid.insertAdjacentHTML("beforeend", `<div id="part3OrdersPanel" class="panel card pad account-orders-panel"><div class="lesson-sidebar-head"><div><h2>Đơn đăng ký / thanh toán demo</h2><p class="muted">Theo dõi đơn chờ xác nhận, đã xác nhận hoặc đã hủy.</p></div><a class="btn btn-light btn-small" href="#/courses">Tạo đơn mới</a></div><div class="order-list">${rows}</div></div>`);
}

function p3EnhanceAdmin() {
  const container = document.querySelector(".admin-table-wrap")?.parentElement;
  if (!container || document.querySelector("#part3AdminOrders")) return;
  const user = p3User();
  if (!user || user.role !== "admin") return;
  const extra = p3LoadExtra();
  const rows = extra.orders.length ? extra.orders.slice().reverse().map((order) => {
    const student = p3GetUser(order.userId);
    const course = p3Course(order.courseId);
    const action = order.status === "paid"
      ? `<button class="btn btn-light btn-small" type="button" onclick="p3UpdateOrder('${order.id}', 'pending')">Chuyển chờ</button>`
      : `<button class="btn btn-primary btn-small" type="button" onclick="p3ConfirmOrder('${order.id}')">Xác nhận & mở quyền</button>`;
    return `<tr><td><strong>${order.id}</strong><br><span class="muted">${order.createdAt} · ${order.method}</span></td><td>${p3Escape(student?.name || "Không rõ")}<br><span class="muted">${p3Escape(student?.email || "")}</span></td><td>${p3Escape(course.title)}</td><td>${p3Escape(order.amount)}</td><td>${p3Badge(order.status)}</td><td class="table-actions">${action}<button class="btn btn-danger btn-small" type="button" onclick="p3UpdateOrder('${order.id}', 'cancelled')">Hủy</button></td></tr>`;
  }).join("") : `<tr><td colspan="6">Chưa có đơn đăng ký demo.</td></tr>`;

  const firstTable = document.querySelector(".admin-table-wrap");
  firstTable.insertAdjacentHTML("afterend", `
    <div id="part3AdminOrders" class="part3-admin-block">
      <div class="section-head"><h2>Đơn đăng ký / thanh toán demo</h2><p class="muted">Admin xác nhận đơn để chuyển trạng thái và mở quyền học cho học viên.</p></div>
      <div class="admin-table-wrap"><table class="admin-table"><thead><tr><th>Mã đơn</th><th>Học viên</th><th>Khóa học</th><th>Số tiền</th><th>Trạng thái</th><th>Thao tác</th></tr></thead><tbody>${rows}</tbody></table></div>
      <div class="card pad create-course-box"><div class="lesson-sidebar-head"><div><h2>Ghi chú quản trị phần tiếp theo</h2><p class="muted">Tạo/sửa khóa học thật cần backend/database. Không nên lưu khóa học thật chỉ bằng localStorage.</p></div><span class="chip warning">Cảnh báo</span></div><div class="warning-box"><strong>Không làm mất dữ liệu:</strong> trước khi nối backend, cần backup database, kiểm tra role admin ở server và kiểm soát quyền xem video bằng API.</div></div>
    </div>`);
}

function p3UpdateOrder(orderId, status) {
  const extra = p3LoadExtra();
  const order = extra.orders.find((item) => item.id === orderId);
  if (!order) return;
  order.status = status;
  p3SaveExtra(extra);
  window.location.reload();
}

function p3ConfirmOrder(orderId) {
  const extra = p3LoadExtra();
  const order = extra.orders.find((item) => item.id === orderId);
  if (!order) return;
  order.status = "paid";
  p3SaveExtra(extra);

  const main = p3LoadMain();
  main.enrollments = Array.isArray(main.enrollments) ? main.enrollments : [];
  main.progress = main.progress && typeof main.progress === "object" ? main.progress : {};
  const existing = main.enrollments.find((item) => item.userId === order.userId && item.courseId === order.courseId);
  if (existing) {
    existing.status = "active";
  } else {
    main.enrollments.push({ id: `enr-${Date.now()}`, userId: order.userId, courseId: order.courseId, status: "active", createdAt: p3Today() });
  }
  const pKey = `${order.userId}::${order.courseId}`;
  if (!main.progress[pKey]) main.progress[pKey] = { completed: [], lastLesson: 0 };
  p3SaveMain(main);
  window.location.reload();
}

function p3Boot() {
  const route = p3Route();
  if (route.path === "checkout") return p3RenderCheckout(route.id || COURSE_IDS[0]);
  if (route.path === "backend") return p3RenderBackendPlan();
  window.setTimeout(() => {
    if (route.path === "detail") p3EnhanceDetail(route.id || COURSE_IDS[0]);
    if (route.path === "learn") p3EnhanceLearn(route.id || COURSE_IDS[0], route.lesson || "0");
    if (route.path === "account") p3EnhanceAccount();
    if (route.path === "admin") p3EnhanceAdmin();
  }, 0);
}

window.p3HandleCheckout = p3HandleCheckout;
window.p3SaveLessonNote = p3SaveLessonNote;
window.p3AddQuestion = p3AddQuestion;
window.p3UpdateOrder = p3UpdateOrder;
window.p3ConfirmOrder = p3ConfirmOrder;
window.addEventListener("hashchange", p3Boot);
p3Boot();