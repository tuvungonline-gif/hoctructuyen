const courses = [
  {
    id: "video-marketing-ai",
    title: "Tạo video ngắn bằng AI",
    shortTitle: "Video AI",
    desc: "Học cách lên ý tưởng, viết kịch bản, tạo cảnh video ngắn và tối ưu nội dung dễ xem trên điện thoại.",
    level: "Cơ bản",
    lessons: 18,
    duration: "3 giờ 20 phút",
    price: "799.000đ",
    tag: "Nổi bật",
    color: "",
    instructor: "Nguyễn Minh Anh",
    benefits: ["Biết tạo kịch bản video 30-60 giây", "Nắm bố cục cảnh, lời thoại và CTA", "Có quy trình sản xuất nội dung hằng ngày"],
    curriculum: [
      ["Tư duy video ngắn cho người mới", "08:12"],
      ["Cách tìm hook thu hút trong 5 giây đầu", "11:45"],
      ["Viết kịch bản 4 cảnh liền mạch", "12:20"],
      ["Tạo prompt video đúng mục tiêu", "10:16"],
      ["Tối ưu nội dung trước khi đăng", "09:40"]
    ]
  },
  {
    id: "ban-hang-online",
    title: "Bán hàng online thực chiến",
    shortTitle: "Bán hàng",
    desc: "Xây dựng phễu nội dung, tư vấn khách hàng và chốt đơn tự nhiên trên nền tảng online.",
    level: "Thực chiến",
    lessons: 24,
    duration: "5 giờ 10 phút",
    price: "1.200.000đ",
    tag: "Bán chạy",
    color: "orange",
    instructor: "Trần Quốc Việt",
    benefits: ["Biết xây phễu khách hàng đơn giản", "Có mẫu tư vấn và chăm sóc khách", "Tối ưu nội dung trước khi chạy quảng cáo"],
    curriculum: [
      ["Nền tảng bán hàng online bền vững", "09:25"],
      ["Hiểu khách hàng trước khi viết nội dung", "12:30"],
      ["Xây kịch bản tư vấn không ép sale", "14:05"],
      ["Thiết kế ưu đãi và CTA", "10:45"]
    ]
  },
  {
    id: "thiet-ke-landing-page",
    title: "Thiết kế landing page khóa học",
    shortTitle: "Landing Page",
    desc: "Thiết kế trang giới thiệu khóa học rõ ràng, có CTA nổi bật, phù hợp mobile và tăng chuyển đổi.",
    level: "UI/UX",
    lessons: 16,
    duration: "4 giờ 05 phút",
    price: "990.000đ",
    tag: "UI/UX",
    color: "green",
    instructor: "Lê Hoàng Phúc",
    benefits: ["Biết bố cục landing page giáo dục", "Tối ưu CTA và vùng giá", "Tránh lỗi UX làm giảm đăng ký"],
    curriculum: [
      ["Cấu trúc landing page bán khóa học", "13:00"],
      ["Thiết kế hero section mạnh", "09:42"],
      ["Tối ưu bảng giá và CTA", "15:12"],
      ["Checklist trước khi xuất bản", "08:30"]
    ]
  },
  {
    id: "quan-tri-lms",
    title: "Quản trị nền tảng LMS",
    shortTitle: "LMS",
    desc: "Quản lý khóa học, bài học, học viên, quyền truy cập và quy trình vận hành lớp học video.",
    level: "Quản trị",
    lessons: 21,
    duration: "4 giờ 45 phút",
    price: "1.490.000đ",
    tag: "Nâng cao",
    color: "purple",
    instructor: "Phạm Thanh Tùng",
    benefits: ["Biết tổ chức chương/bài học", "Quản lý học viên và tiến độ", "Hiểu rủi ro quyền truy cập video"],
    curriculum: [
      ["Tổng quan vận hành LMS", "10:12"],
      ["Phân quyền học viên và admin", "12:18"],
      ["Theo dõi tiến độ học tập", "09:56"],
      ["Quy trình hỗ trợ học viên", "11:10"]
    ]
  },
  {
    id: "ky-nang-giang-day-video",
    title: "Kỹ năng giảng dạy qua video",
    shortTitle: "Giảng dạy",
    desc: "Cách trình bày bài học dễ hiểu, giữ nhịp nói tự nhiên và thiết kế trải nghiệm học không nhàm chán.",
    level: "Giảng viên",
    lessons: 14,
    duration: "2 giờ 50 phút",
    price: "690.000đ",
    tag: "Mới",
    color: "slate",
    instructor: "Đỗ Khánh Linh",
    benefits: ["Biết mở đầu bài học cuốn hút", "Chia nhỏ kiến thức dễ tiếp thu", "Tạo bài tập sau mỗi video"],
    curriculum: [
      ["Chuẩn bị nội dung trước khi quay", "07:40"],
      ["Giọng nói và nhịp giảng", "08:15"],
      ["Thiết kế slide cho video học", "12:00"],
      ["Tạo bài tập ngắn sau video", "09:20"]
    ]
  },
  {
    id: "cham-soc-hoc-vien",
    title: "Chăm sóc học viên sau đăng ký",
    shortTitle: "CSHV",
    desc: "Xây dựng quy trình nhắc học, hỗ trợ, đánh giá và giữ chân học viên sau khi mua khóa học.",
    level: "Vận hành",
    lessons: 12,
    duration: "2 giờ 15 phút",
    price: "590.000đ",
    tag: "Vận hành",
    color: "green",
    instructor: "Mai Thu Hà",
    benefits: ["Có kịch bản nhắc học", "Biết xử lý học viên bỏ dở", "Tăng tỷ lệ hoàn thành khóa học"],
    curriculum: [
      ["Hành trình học viên sau khi mua", "08:00"],
      ["Tin nhắn nhắc học tự nhiên", "10:22"],
      ["Tạo cộng đồng học viên", "09:45"],
      ["Đo tỷ lệ hoàn thành", "07:50"]
    ]
  }
];

const STORAGE_KEY = "eduvideo_part2_state_v1";

const defaultState = {
  currentUserId: "student-demo",
  users: [
    { id: "student-demo", name: "Học viên Demo", email: "hocvien@example.com", phone: "0900000001", password: "123456", role: "student" },
    { id: "admin-demo", name: "Admin Demo", email: "admin@example.com", phone: "0900000002", password: "admin123", role: "admin" }
  ],
  enrollments: [
    { id: "enr-1", userId: "student-demo", courseId: "video-marketing-ai", status: "active", createdAt: "2026-06-13" },
    { id: "enr-2", userId: "student-demo", courseId: "thiet-ke-landing-page", status: "active", createdAt: "2026-06-13" },
    { id: "enr-3", userId: "student-demo", courseId: "ban-hang-online", status: "pending", createdAt: "2026-06-13" },
    { id: "enr-4", userId: "student-demo", courseId: "quan-tri-lms", status: "blocked", createdAt: "2026-06-13" }
  ],
  progress: {
    "student-demo::video-marketing-ai": { completed: [0, 1, 2], lastLesson: 3 },
    "student-demo::thiet-ke-landing-page": { completed: [0, 1, 2], lastLesson: 3 },
    "student-demo::ban-hang-online": { completed: [], lastLesson: 0 },
    "student-demo::quan-tri-lms": { completed: [0], lastLesson: 1 }
  }
};

const $ = (selector) => document.querySelector(selector);
const app = $("#app");
const menuToggle = $("#menuToggle");
const mainNav = $("#mainNav");

function cloneDefaultState() {
  return JSON.parse(JSON.stringify(defaultState));
}

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return cloneDefaultState();
    const parsed = JSON.parse(saved);
    return {
      ...cloneDefaultState(),
      ...parsed,
      users: Array.isArray(parsed.users) ? parsed.users : cloneDefaultState().users,
      enrollments: Array.isArray(parsed.enrollments) ? parsed.enrollments : cloneDefaultState().enrollments,
      progress: parsed.progress && typeof parsed.progress === "object" ? parsed.progress : cloneDefaultState().progress
    };
  } catch (error) {
    console.warn("Không đọc được dữ liệu demo trong localStorage, đã khởi tạo lại.", error);
    return cloneDefaultState();
  }
}

let state = loadState();

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function resetDemoData() {
  state = cloneDefaultState();
  saveState();
  alert("Đã khôi phục dữ liệu demo ban đầu.");
  render();
}

function currentUser() {
  return state.users.find((user) => user.id === state.currentUserId) || null;
}

function getCourse(id) {
  return courses.find((course) => course.id === id) || courses[0];
}

function getUserById(id) {
  return state.users.find((user) => user.id === id) || null;
}

function progressKey(userId, courseId) {
  return `${userId}::${courseId}`;
}

function getEnrollment(courseId, userId = state.currentUserId) {
  if (!userId) return null;
  return state.enrollments.find((item) => item.userId === userId && item.courseId === courseId) || null;
}

function getCourseProgress(courseId, userId = state.currentUserId) {
  const course = getCourse(courseId);
  const key = progressKey(userId, courseId);
  const progress = state.progress[key] || { completed: [], lastLesson: 0 };
  const completed = Array.isArray(progress.completed) ? progress.completed : [];
  const total = Math.max(course.curriculum.length, 1);
  return {
    completed,
    lastLesson: Number.isInteger(progress.lastLesson) ? progress.lastLesson : 0,
    percent: Math.round((completed.length / total) * 100)
  };
}

function setCourseProgress(courseId, nextProgress, userId = state.currentUserId) {
  if (!userId) return;
  const key = progressKey(userId, courseId);
  state.progress[key] = nextProgress;
  saveState();
}

function enrollmentLabel(status) {
  if (status === "active") return "Đã mở quyền";
  if (status === "pending") return "Chờ duyệt";
  if (status === "blocked") return "Tạm khóa";
  return "Chưa đăng ký";
}

function statusBadge(status) {
  const labelMap = {
    active: "Đã mở quyền",
    pending: "Chờ duyệt",
    blocked: "Tạm khóa"
  };
  const label = labelMap[status] || status;
  if (status === "active" || status === "Đã xuất bản" || status === "Đã mở quyền") return `<span class="badge live">${label}</span>`;
  if (status === "pending" || status === "Chờ duyệt") return `<span class="badge pending">${label}</span>`;
  if (status === "blocked" || status === "Tạm khóa") return `<span class="badge blocked">${label}</span>`;
  return `<span class="badge draft">${label}</span>`;
}

function formatRoute() {
  const hash = window.location.hash || "#/";
  const segments = hash.replace(/^#\/?/, "").split("/").filter(Boolean);
  return {
    path: segments[0] || "home",
    id: segments[1],
    lesson: segments[2]
  };
}

function closeMobileMenu() {
  document.body.classList.remove("nav-open");
  menuToggle.setAttribute("aria-expanded", "false");
}

menuToggle.addEventListener("click", () => {
  const isOpen = document.body.classList.toggle("nav-open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

mainNav.addEventListener("click", (event) => {
  if (event.target.tagName === "A") closeMobileMenu();
});

function updateNav(path) {
  const user = currentUser();
  const loginLink = document.querySelector(".nav-login");
  const startButton = document.querySelector('.main-nav .btn[href="#/courses"], .main-nav .btn');

  if (loginLink) {
    loginLink.href = user ? "#/account" : "#/auth";
    loginLink.textContent = user ? user.name.split(" ").slice(-2).join(" ") : "Đăng nhập";
  }

  if (startButton) {
    startButton.href = user ? "#/account" : "#/courses";
    startButton.textContent = user ? "Học tiếp" : "Bắt đầu học";
  }

  document.querySelectorAll(".main-nav a").forEach((link) => link.classList.remove("active"));
  const matchMap = {
    home: "#/",
    courses: "#/courses",
    detail: "#/courses",
    learn: "#/learn",
    auth: "#/auth",
    account: "#/account",
    admin: "#/admin"
  };
  document.querySelectorAll(`.main-nav a[href="${matchMap[path]}"]`).forEach((link) => link.classList.add("active"));
}

function courseAccessMeta(course) {
  const user = currentUser();
  const enrollment = getEnrollment(course.id, user?.id);
  if (!user) return { label: "Cần đăng nhập", className: "", action: "Đăng nhập để học", href: "#/auth" };
  if (!enrollment) return { label: "Chưa đăng ký", className: "", action: "Đăng ký học", href: `#/detail/${course.id}` };
  if (enrollment.status === "active") return { label: "Đã mở quyền", className: "success", action: "Vào học", href: `#/learn/${course.id}` };
  if (enrollment.status === "pending") return { label: "Chờ duyệt", className: "warning", action: "Chờ admin duyệt", href: `#/detail/${course.id}` };
  return { label: "Tạm khóa", className: "danger-chip", action: "Xem trạng thái", href: `#/detail/${course.id}` };
}

function courseCard(course) {
  const access = courseAccessMeta(course);
  const user = currentUser();
  const progress = user ? getCourseProgress(course.id, user.id).percent : 0;
  return `
    <article class="card course-card">
      <a class="course-thumb ${course.color}" href="#/detail/${course.id}" aria-label="Xem chi tiết ${course.title}">
        <span class="course-level">${course.level}</span>
        <span class="thumb-title">${course.shortTitle}</span>
      </a>
      <div class="course-body">
        <div class="tag-row">
          <span class="chip">${course.tag}</span>
          <span class="chip">${course.lessons} bài</span>
          <span class="chip ${access.className}">${access.label}</span>
        </div>
        <h3 style="margin-top:14px">${course.title}</h3>
        <p>${course.desc}</p>
        <div class="meta-row">
          <span class="chip">⏱ ${course.duration}</span>
          <span class="chip">👤 ${course.instructor}</span>
        </div>
        ${user ? `
          <div class="progress-wrap course-progress-mini">
            <div class="progress-label"><span>Tiến độ cá nhân</span><span>${progress}%</span></div>
            <div class="progress-track"><div class="progress-fill" style="width:${progress}%"></div></div>
          </div>
        ` : ""}
        <div class="course-price">
          <strong>${course.price}</strong>
          <span>Học trọn đời</span>
        </div>
        <div class="card-actions">
          <a class="btn btn-primary" href="${access.href}">${access.action}</a>
          <a class="btn btn-light" href="#/detail/${course.id}">Chi tiết</a>
        </div>
      </div>
    </article>
  `;
}

function heroPreview() {
  const user = currentUser();
  const course = getCourse("video-marketing-ai");
  const progress = user ? getCourseProgress(course.id, user.id).percent : 0;
  return `
    <div class="hero-preview" aria-label="Xem trước trang học video">
      <div class="video-mock">
        <div class="play-circle"><span>▶</span></div>
      </div>
      <div class="preview-body">
        <div class="lesson-chip-row">
          <span class="chip success">${user ? "Đã đăng nhập" : "Demo"}</span>
          <span class="chip">Quyền học mẫu</span>
          <span class="chip">localStorage</span>
        </div>
        <h3 style="margin-top:14px">Đăng nhập, mở quyền và lưu tiến độ học</h3>
        <p class="muted">Phần 2 đã có luồng tài khoản học viên, trạng thái khóa học và tiến độ lưu trên trình duyệt.</p>
        <div class="progress-wrap">
          <div class="progress-label"><span>Tiến độ khóa Video AI</span><span>${progress}%</span></div>
          <div class="progress-track"><div class="progress-fill" style="width:${progress}%"></div></div>
        </div>
      </div>
    </div>
  `;
}

function renderHome() {
  const featured = courses.slice(0, 3).map(courseCard).join("");
  const user = currentUser();
  app.innerHTML = `
    <section class="hero">
      <div class="container hero-grid">
        <div>
          <span class="eyebrow">🎓 Web học video mobile-first</span>
          <h1>Học online qua video dễ hiểu, rõ lộ trình, học tiếp mọi lúc.</h1>
          <p class="lead">Bản phần 2 đã có đăng nhập demo, tài khoản học viên, kiểm tra quyền học và lưu tiến độ bằng localStorage. Chưa nối database, thanh toán hoặc video thật.</p>
          <div class="hero-actions">
            <a class="btn btn-primary" href="${user ? "#/account" : "#/auth"}">${user ? "Vào khóa học của tôi" : "Đăng nhập học thử"}</a>
            <a class="btn btn-light" href="#/courses">Xem khóa học</a>
          </div>
          <div class="hero-stats">
            <div class="stat"><strong>2</strong><span>tài khoản demo</span></div>
            <div class="stat"><strong>3</strong><span>trạng thái quyền học</span></div>
            <div class="stat"><strong>Safe</strong><span>chưa đụng dữ liệu thật</span></div>
          </div>
        </div>
        ${heroPreview()}
      </div>
    </section>

    <section class="section-tight">
      <div class="container">
        <div class="section-head">
          <span class="eyebrow">Phần 2 đã thêm</span>
          <h2>Luồng học viên và phân quyền ở mức frontend</h2>
          <p class="lead">Học viên có thể đăng nhập, đăng ký khóa học, xem trạng thái quyền học và đánh dấu bài đã học.</p>
        </div>
        <div class="benefit-grid">
          <article class="card pad"><div class="icon-box">🔐</div><h3>Đăng nhập demo</h3><p class="muted">Có tài khoản học viên và admin mẫu để kiểm thử nhanh giao diện.</p></article>
          <article class="card pad"><div class="icon-box">🎯</div><h3>Kiểm tra quyền học</h3><p class="muted">Khóa học có trạng thái chưa đăng ký, chờ duyệt, đã mở quyền hoặc tạm khóa.</p></article>
          <article class="card pad"><div class="icon-box">📈</div><h3>Lưu tiến độ</h3><p class="muted">Tiến độ bài học được lưu trong localStorage để test trải nghiệm học tiếp.</p></article>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="section-head">
          <span class="eyebrow">Khóa học nổi bật</span>
          <h2>Card khóa học hiển thị trạng thái quyền truy cập</h2>
          <p class="lead">Mỗi card cho biết học viên đã được học, đang chờ duyệt hay khóa học còn bị tạm khóa.</p>
        </div>
        <div class="course-grid">${featured}</div>
      </div>
    </section>

    <section class="section-tight">
      <div class="container">
        <div class="section-head">
          <span class="eyebrow">Quy trình học</span>
          <h2>Luồng trải nghiệm từ đăng nhập đến học video</h2>
        </div>
        <div class="steps">
          <div class="step"><div><h3>Đăng nhập hoặc tạo tài khoản</h3><p class="muted">Bản demo có sẵn học viên và admin để kiểm thử nhanh.</p></div></div>
          <div class="step"><div><h3>Đăng ký khóa học và mở quyền</h3><p class="muted">Có thể gửi yêu cầu chờ duyệt hoặc dùng nút mở quyền demo để test.</p></div></div>
          <div class="step"><div><h3>Học video và lưu tiến độ</h3><p class="muted">Học viên đánh dấu bài đã học, hệ thống tính phần trăm hoàn thành.</p></div></div>
        </div>
      </div>
    </section>

    <section class="section-tight">
      <div class="container">
        <div class="section-head"><span class="eyebrow">Tài khoản demo</span><h2>Dùng nhanh để kiểm thử</h2></div>
        <div class="demo-login-grid">
          <article class="card pad">
            <h3>Học viên Demo</h3>
            <p class="muted">Email: hocvien@example.com · Mật khẩu: 123456</p>
            <button class="btn btn-primary" type="button" onclick="loginAsDemo('student')">Đăng nhập học viên</button>
          </article>
          <article class="card pad">
            <h3>Admin Demo</h3>
            <p class="muted">Email: admin@example.com · Mật khẩu: admin123</p>
            <button class="btn btn-light" type="button" onclick="loginAsDemo('admin')">Đăng nhập admin</button>
          </article>
        </div>
      </div>
    </section>
  `;
}

function renderCourses() {
  app.innerHTML = `
    <section class="page-hero">
      <div class="container page-hero-grid">
        <div>
          <span class="eyebrow">Danh sách khóa học</span>
          <h1>Chọn khóa học phù hợp với mục tiêu của bạn</h1>
          <p class="lead">Card khóa học đã hiển thị trạng thái quyền học theo tài khoản đang đăng nhập.</p>
        </div>
        <a class="btn btn-primary" href="${currentUser() ? "#/account" : "#/auth"}">${currentUser() ? "Khóa học của tôi" : "Đăng nhập để học"}</a>
      </div>
    </section>
    <section class="section-tight">
      <div class="container">
        <div class="filter-bar" aria-label="Bộ lọc khóa học mẫu">
          <button class="filter-btn active">Tất cả</button>
          <button class="filter-btn">Video AI</button>
          <button class="filter-btn">Bán hàng</button>
          <button class="filter-btn">UI/UX</button>
          <button class="filter-btn">Quản trị</button>
        </div>
        <div class="course-grid">${courses.map(courseCard).join("")}</div>
      </div>
    </section>
  `;
}

function detailActions(course) {
  const user = currentUser();
  const enrollment = getEnrollment(course.id, user?.id);
  if (!user) {
    return `
      <a class="btn btn-accent" href="#/auth">Đăng nhập để đăng ký</a>
      <a class="btn btn-light" href="#/courses">Xem khóa khác</a>
    `;
  }
  if (!enrollment) {
    return `
      <button class="btn btn-accent" type="button" onclick="enrollCourse('${course.id}', 'active')">Mở quyền demo & học ngay</button>
      <button class="btn btn-light" type="button" onclick="enrollCourse('${course.id}', 'pending')">Gửi yêu cầu chờ duyệt</button>
    `;
  }
  if (enrollment.status === "active") {
    return `<a class="btn btn-primary" href="#/learn/${course.id}">Vào học ngay</a><a class="btn btn-light" href="#/account">Về tài khoản</a>`;
  }
  if (enrollment.status === "pending") {
    return `<button class="btn btn-soft" type="button" disabled>Đang chờ admin duyệt</button><a class="btn btn-light" href="#/account">Xem trạng thái</a>`;
  }
  return `<button class="btn btn-danger" type="button" disabled>Quyền học đang tạm khóa</button><a class="btn btn-light" href="#/account">Xem tài khoản</a>`;
}

function renderDetail(id) {
  const course = getCourse(id);
  const user = currentUser();
  const progress = user ? getCourseProgress(course.id, user.id) : { completed: [], percent: 0 };
  const enrollment = getEnrollment(course.id, user?.id);
  const lessons = course.curriculum.map(([title, time], index) => {
    const done = progress.completed.includes(index);
    return `
      <div class="lesson-row ${done ? "done" : ""}">
        <span class="status">${done ? "✓" : index + 1}</span>
        <div><strong>${title}</strong><small>${time}</small></div>
        <span class="chip">Video</span>
      </div>
    `;
  }).join("");

  app.innerHTML = `
    <section class="page-hero">
      <div class="container">
        <a class="chip" href="#/courses">← Quay lại danh sách</a>
      </div>
    </section>
    <section class="section-tight">
      <div class="container detail-grid">
        <article class="detail-main">
          <div class="course-thumb ${course.color} detail-cover">
            <span class="course-level">${course.level}</span>
            <span class="thumb-title">${course.title}</span>
          </div>
          <div class="detail-content">
            <span class="eyebrow">Chi tiết khóa học</span>
            <h1>${course.title}</h1>
            <p class="lead">${course.desc}</p>
            <div class="lesson-chip-row">
              <span class="chip">${course.lessons} bài học</span>
              <span class="chip">${course.duration}</span>
              <span class="chip">Giảng viên: ${course.instructor}</span>
              <span class="chip ${enrollment?.status === "active" ? "success" : enrollment?.status === "pending" ? "warning" : enrollment?.status === "blocked" ? "danger-chip" : ""}">${enrollment ? enrollmentLabel(enrollment.status) : "Chưa đăng ký"}</span>
            </div>

            <div class="section-tight">
              <h2>Bạn sẽ nhận được gì?</h2>
              <div class="grid-3">
                ${course.benefits.map((item) => `<article class="card pad"><div class="icon-box">✓</div><h3>${item}</h3><p class="muted">Nội dung được chia nhỏ, phù hợp học từng bài ngắn trên điện thoại.</p></article>`).join("")}
              </div>
            </div>

            <div>
              <h2>Nội dung khóa học</h2>
              <p class="muted">Danh sách bài học mẫu. Bài học chỉ mở khi tài khoản có quyền truy cập ở trạng thái “Đã mở quyền”.</p>
              <div class="lesson-list">${lessons}</div>
            </div>
          </div>
        </article>

        <aside class="detail-sidebar">
          <h2>Đăng ký học</h2>
          <p class="muted">Bản phần 2 chỉ mô phỏng quyền học bằng localStorage. Chưa thu tiền thật, chưa mở quyền thật từ server.</p>
          <div class="price-box"><small>Học phí</small><strong>${course.price}</strong><span>Truy cập trọn đời</span></div>
          ${user ? `
            <div class="progress-wrap" style="margin-bottom:16px">
              <div class="progress-label"><span>Tiến độ cá nhân</span><span>${progress.percent}%</span></div>
              <div class="progress-track"><div class="progress-fill" style="width:${progress.percent}%"></div></div>
            </div>
          ` : ""}
          <div class="lesson-chip-row">
            <span class="chip success">Bảo lưu tiến độ</span>
            <span class="chip">Học mobile</span>
            <span class="chip">Quyền học mẫu</span>
          </div>
          <div class="form-actions" style="margin-top:18px">
            ${detailActions(course)}
          </div>
          <div class="sticky-mobile-cta"><div class="form-actions">${detailActions(course)}</div></div>
        </aside>
      </div>
    </section>
  `;
}

function renderAccessNotice(type, course) {
  const config = {
    login: {
      icon: "🔐",
      title: "Bạn cần đăng nhập để học video",
      text: "Trang học video đã được chặn quyền ở mức frontend demo. Hãy đăng nhập học viên để kiểm thử luồng học.",
      actions: `<a class="btn btn-primary" href="#/auth">Đăng nhập</a><a class="btn btn-light" href="#/detail/${course.id}">Xem chi tiết khóa học</a>`
    },
    pending: {
      icon: "⏳",
      title: "Khóa học đang chờ admin duyệt",
      text: "Tài khoản đã gửi yêu cầu đăng ký nhưng chưa được mở quyền học. Admin demo có thể duyệt trong trang quản trị.",
      actions: `<a class="btn btn-primary" href="#/account">Xem tài khoản</a><a class="btn btn-light" href="#/admin">Vào admin demo</a>`
    },
    blocked: {
      icon: "🚫",
      title: "Quyền học đang tạm khóa",
      text: "Khóa học này đang bị khóa quyền truy cập. Đây là mô phỏng để tránh học viên chưa đủ điều kiện vẫn xem được video.",
      actions: `<a class="btn btn-primary" href="#/account">Xem tài khoản</a><a class="btn btn-light" href="#/courses">Xem khóa khác</a>`
    },
    none: {
      icon: "🧾",
      title: "Bạn chưa đăng ký khóa học này",
      text: "Hãy đăng ký khóa học trước khi vào trang học video. Bản demo có nút mở quyền để kiểm thử nhanh.",
      actions: `<a class="btn btn-primary" href="#/detail/${course.id}">Đăng ký khóa học</a><a class="btn btn-light" href="#/courses">Xem khóa khác</a>`
    }
  }[type];

  app.innerHTML = `
    <section class="section">
      <div class="container">
        <article class="access-card">
          <div class="access-icon">${config.icon}</div>
          <span class="eyebrow">Kiểm tra quyền học</span>
          <h1>${config.title}</h1>
          <p class="lead">${config.text}</p>
          <div class="warning-box">
            <strong>Lưu ý bảo mật:</strong> Ở bản thật, kiểm tra quyền học phải thực hiện ở backend/API/video server. Frontend chỉ dùng để hiển thị trạng thái, không được là lớp bảo vệ duy nhất.
          </div>
          <div class="hero-actions">${config.actions}</div>
        </article>
      </div>
    </section>
  `;
}

function renderLearn(id, lessonParam) {
  const course = getCourse(id || "video-marketing-ai");
  const user = currentUser();
  if (!user) return renderAccessNotice("login", course);
  const enrollment = getEnrollment(course.id, user.id);
  if (!enrollment) return renderAccessNotice("none", course);
  if (enrollment.status === "pending") return renderAccessNotice("pending", course);
  if (enrollment.status === "blocked") return renderAccessNotice("blocked", course);

  const progress = getCourseProgress(course.id, user.id);
  const requestedLesson = Number.parseInt(lessonParam, 10);
  const activeLessonIndex = Number.isInteger(requestedLesson)
    ? Math.min(Math.max(requestedLesson, 0), course.curriculum.length - 1)
    : Math.min(Math.max(progress.lastLesson, 0), course.curriculum.length - 1);
  const activeLesson = course.curriculum[activeLessonIndex];
  const isCurrentDone = progress.completed.includes(activeLessonIndex);
  const prevIndex = Math.max(activeLessonIndex - 1, 0);
  const nextIndex = Math.min(activeLessonIndex + 1, course.curriculum.length - 1);

  const lessons = course.curriculum.map(([title, time], index) => {
    const done = progress.completed.includes(index);
    return `
      <a class="lesson-row ${done ? "done" : ""} ${index === activeLessonIndex ? "active" : ""}" href="#/learn/${course.id}/${index}">
        <span class="status">${done ? "✓" : index + 1}</span>
        <div><strong>${title}</strong><small>${time}</small></div>
        <span class="chip ${index === activeLessonIndex ? "warning" : ""}">${index === activeLessonIndex ? "Đang học" : "Bài"}</span>
      </a>
    `;
  }).join("");

  app.innerHTML = `
    <section class="page-hero">
      <div class="container">
        <span class="eyebrow">Trang học video</span>
        <h1>${course.title}</h1>
        <p class="lead">Đã kiểm tra quyền học: tài khoản “${user.name}” có quyền truy cập khóa học này.</p>
      </div>
    </section>
    <section class="section-tight">
      <div class="container learn-grid">
        <div>
          <article class="video-player">
            <div class="video-area">
              <div class="play-circle"><span>▶</span></div>
              <div class="video-title-overlay">
                <span class="chip warning">Bài ${activeLessonIndex + 1}</span>
                <strong>${activeLesson[0]}</strong>
                <small>Video demo placeholder - chưa dùng video thật</small>
              </div>
            </div>
            <div class="video-info">
              <div class="progress-wrap" style="margin-top:0;margin-bottom:18px">
                <div class="progress-label"><span>Tiến độ khóa học</span><span>${progress.percent}%</span></div>
                <div class="progress-track"><div class="progress-fill" style="width:${progress.percent}%"></div></div>
              </div>
              <h2>${activeLesson[0]}</h2>
              <p class="muted">Khu vực mô tả bài học, tài liệu đính kèm và ghi chú học tập. Khi bấm “Đánh dấu đã học”, tiến độ sẽ được lưu trong localStorage.</p>
              <div class="video-actions">
                <a class="btn btn-light" href="#/learn/${course.id}/${prevIndex}">← Bài trước</a>
                <a class="btn btn-primary" href="#/learn/${course.id}/${nextIndex}">Bài tiếp theo →</a>
                <button class="btn ${isCurrentDone ? "btn-soft" : "btn-accent"}" type="button" onclick="markLessonDone('${course.id}', ${activeLessonIndex})">${isCurrentDone ? "✓ Đã hoàn thành" : "✓ Đánh dấu đã học"}</button>
              </div>
            </div>
          </article>

          <div class="panel card pad" style="margin-top:18px">
            <h2>Tài liệu bài học</h2>
            <p class="muted">Sau này có thể gắn file PDF, link tài liệu, bài tập hoặc bình luận. Không upload thật ở phần 2.</p>
            <div class="tag-row"><span class="chip">PDF mẫu</span><span class="chip">Bài tập ngắn</span><span class="chip">Ghi chú cá nhân</span></div>
          </div>
        </div>

        <details class="panel lesson-sidebar mobile-accordion" open>
          <summary>Danh sách bài học <span>⌄</span></summary>
          <div class="lesson-sidebar-head">
            <div><h3 style="margin:0">Nội dung khóa học</h3><small class="muted">${course.curriculum.length} bài mẫu · ${course.duration}</small></div>
            <span class="chip success">${progress.percent}%</span>
          </div>
          <div class="lesson-list">${lessons}</div>
        </details>
      </div>
    </section>
  `;
}

function renderAuth() {
  const user = currentUser();
  if (user) {
    app.innerHTML = `
      <section class="section">
        <div class="container auth-wrap auth-single">
          <article class="auth-card">
            <span class="eyebrow">Đã đăng nhập</span>
            <h1>Xin chào, ${user.name}</h1>
            <p class="muted">Bạn đang đăng nhập bằng tài khoản ${user.role === "admin" ? "quản trị viên" : "học viên"}.</p>
            <div class="form-actions">
              <a class="btn btn-primary" href="${user.role === "admin" ? "#/admin" : "#/account"}">${user.role === "admin" ? "Vào quản trị" : "Vào khóa học của tôi"}</a>
              <button class="btn btn-light" type="button" onclick="logoutUser()">Đăng xuất</button>
            </div>
          </article>
        </div>
      </section>
    `;
    return;
  }

  app.innerHTML = `
    <section class="section">
      <div class="container auth-wrap">
        <article class="auth-card">
          <span class="eyebrow">Tài khoản học viên</span>
          <h1>Đăng nhập để học tiếp</h1>
          <p class="muted">Dùng tài khoản demo hoặc nhập tài khoản đã tạo trong trình duyệt này.</p>
          <form class="form-grid" onsubmit="handleLogin(event)">
            <div class="field"><label>Email</label><input name="email" type="email" placeholder="hocvien@example.com" required /></div>
            <div class="field"><label>Mật khẩu</label><input name="password" type="password" placeholder="123456" required /></div>
            <div class="form-actions">
              <button class="btn btn-primary" type="submit">Đăng nhập</button>
              <button class="btn btn-light" type="button" onclick="loginAsDemo('student')">Dùng học viên demo</button>
            </div>
          </form>
          <div class="demo-note">
            <strong>Tài khoản demo:</strong><br>
            Học viên: hocvien@example.com / 123456<br>
            Admin: admin@example.com / admin123
          </div>
        </article>
        <aside class="auth-aside">
          <span class="eyebrow" style="background:rgba(255,255,255,.18);color:#fff">Đăng ký nhanh</span>
          <h2>Tạo tài khoản mới</h2>
          <p>Ở bản thật, chỉ nên yêu cầu thông tin tối thiểu: họ tên, email/số điện thoại, mật khẩu. Tránh form dài gây giảm đăng ký.</p>
          <form class="form-grid" onsubmit="handleRegister(event)">
            <div class="field"><label style="color:#fff">Họ tên</label><input name="name" placeholder="Tên học viên" required /></div>
            <div class="field"><label style="color:#fff">Email</label><input name="email" type="email" placeholder="email@example.com" required /></div>
            <div class="field"><label style="color:#fff">Số điện thoại</label><input name="phone" placeholder="Số điện thoại" /></div>
            <div class="field"><label style="color:#fff">Mật khẩu</label><input name="password" type="password" minlength="6" placeholder="Tối thiểu 6 ký tự" required /></div>
            <button class="btn btn-accent" type="submit">Tạo tài khoản demo</button>
          </form>
        </aside>
      </div>
    </section>
  `;
}

function renderLoginRequired() {
  app.innerHTML = `
    <section class="section">
      <div class="container">
        <article class="access-card">
          <div class="access-icon">🔐</div>
          <span class="eyebrow">Cần đăng nhập</span>
          <h1>Đăng nhập để xem tài khoản học viên</h1>
          <p class="lead">Khu vực này hiển thị khóa học đã đăng ký, tiến độ học và trạng thái quyền truy cập.</p>
          <div class="hero-actions"><a class="btn btn-primary" href="#/auth">Đăng nhập</a><a class="btn btn-light" href="#/courses">Xem khóa học</a></div>
        </article>
      </div>
    </section>
  `;
}

function renderAccount() {
  const user = currentUser();
  if (!user) return renderLoginRequired();
  if (user.role === "admin") {
    app.innerHTML = `
      <section class="section">
        <div class="container">
          <article class="access-card">
            <div class="access-icon">🛠️</div>
            <span class="eyebrow">Tài khoản quản trị</span>
            <h1>Xin chào, ${user.name}</h1>
            <p class="lead">Tài khoản này dùng để kiểm thử trang quản trị, duyệt học viên và tạm khóa/mở quyền học.</p>
            <div class="hero-actions"><a class="btn btn-primary" href="#/admin">Vào trang quản trị</a><button class="btn btn-light" type="button" onclick="logoutUser()">Đăng xuất</button></div>
          </article>
        </div>
      </section>
    `;
    return;
  }

  const enrollments = state.enrollments.filter((item) => item.userId === user.id);
  const activeEnrollments = enrollments.filter((item) => item.status === "active");
  const avgProgress = activeEnrollments.length
    ? Math.round(activeEnrollments.reduce((sum, item) => sum + getCourseProgress(item.courseId, user.id).percent, 0) / activeEnrollments.length)
    : 0;

  const myCourses = enrollments.length ? enrollments.map((item) => {
    const course = getCourse(item.courseId);
    const progress = getCourseProgress(item.courseId, user.id);
    const action = item.status === "active"
      ? `<a class="btn btn-primary btn-small" href="#/learn/${course.id}/${progress.lastLesson}">Tiếp tục học</a>`
      : item.status === "pending"
        ? `<a class="btn btn-light btn-small" href="#/detail/${course.id}">Chờ duyệt</a>`
        : `<a class="btn btn-danger btn-small" href="#/detail/${course.id}">Đang khóa</a>`;
    return `
      <article class="my-course">
        <div class="mini-thumb ${course.color}">${course.shortTitle}</div>
        <div>
          <h3>${course.title}</h3>
          <p class="muted" style="margin-bottom:10px">${course.lessons} bài · ${course.duration} · ${enrollmentLabel(item.status)}</p>
          <div class="progress-wrap" style="margin-top:0">
            <div class="progress-label"><span>Tiến độ</span><span>${progress.percent}%</span></div>
            <div class="progress-track"><div class="progress-fill" style="width:${progress.percent}%"></div></div>
          </div>
        </div>
        ${action}
      </article>
    `;
  }).join("") : `
    <div class="empty-state"><h2>Chưa có khóa học nào</h2><p class="muted">Hãy chọn một khóa học và đăng ký để bắt đầu.</p><a class="btn btn-primary" href="#/courses">Xem khóa học</a></div>
  `;

  app.innerHTML = `
    <section class="page-hero">
      <div class="container">
        <span class="eyebrow">Tài khoản học viên</span>
        <h1>Khóa học của tôi</h1>
        <p class="lead">Theo dõi khóa đã đăng ký, trạng thái quyền học và tiến độ từng khóa.</p>
      </div>
    </section>
    <section class="section-tight">
      <div class="container account-grid">
        <aside class="card profile-card">
          <div class="avatar">${user.name.split(" ").map((part) => part[0]).slice(-2).join("").toUpperCase()}</div>
          <h2>${user.name}</h2>
          <p class="muted">${user.email}</p>
          <div class="lesson-chip-row" style="justify-content:center">
            <span class="chip success">Đang hoạt động</span>
            <span class="chip">${enrollments.length} khóa học</span>
            <span class="chip">TB ${avgProgress}%</span>
          </div>
          <div class="profile-actions">
            <a class="btn btn-light" href="#/courses">Xem thêm khóa</a>
            <button class="btn btn-danger" type="button" onclick="logoutUser()">Đăng xuất</button>
          </div>
        </aside>
        <div class="panel card pad">
          <div class="lesson-sidebar-head">
            <div><h2>Danh sách khóa học đã đăng ký</h2><p class="muted">Dữ liệu lưu trong localStorage của trình duyệt.</p></div>
            <button class="btn btn-light btn-small" type="button" onclick="resetDemoData()">Reset demo</button>
          </div>
          <div class="lesson-list">${myCourses}</div>
        </div>
      </div>
    </section>
  `;
}

function renderAdminLoginRequired() {
  app.innerHTML = `
    <section class="section">
      <div class="container">
        <article class="access-card">
          <div class="access-icon">🛡️</div>
          <span class="eyebrow">Khu vực quản trị</span>
          <h1>Cần đăng nhập tài khoản admin</h1>
          <p class="lead">Trang quản trị dùng để kiểm thử danh sách học viên, trạng thái đăng ký và quyền truy cập khóa học.</p>
          <div class="hero-actions"><button class="btn btn-primary" type="button" onclick="loginAsDemo('admin')">Đăng nhập admin demo</button><a class="btn btn-light" href="#/auth">Trang đăng nhập</a></div>
        </article>
      </div>
    </section>
  `;
}

function renderAdminForbidden() {
  app.innerHTML = `
    <section class="section">
      <div class="container">
        <article class="access-card">
          <div class="access-icon">🚫</div>
          <span class="eyebrow">Không có quyền</span>
          <h1>Tài khoản học viên không vào được quản trị</h1>
          <p class="lead">Đây là mô phỏng phân quyền cơ bản. Ở bản thật, quyền admin phải được kiểm tra ở backend.</p>
          <div class="hero-actions"><button class="btn btn-primary" type="button" onclick="loginAsDemo('admin')">Chuyển sang admin demo</button><a class="btn btn-light" href="#/account">Về tài khoản</a></div>
        </article>
      </div>
    </section>
  `;
}

function renderAdmin() {
  const user = currentUser();
  if (!user) return renderAdminLoginRequired();
  if (user.role !== "admin") return renderAdminForbidden();

  const courseRows = courses.map((course) => `
    <tr>
      <td><strong>${course.title}</strong><br><span class="muted">${course.lessons} bài · ${course.duration}</span></td>
      <td>${course.price}</td>
      <td>${course.instructor}</td>
      <td>${statusBadge("Đã xuất bản")}</td>
      <td><button class="btn btn-light btn-small" type="button" onclick="alert('Demo UI: chưa tạo/sửa khóa học thật ở phần 2.')">Sửa</button></td>
    </tr>
  `).join("");

  const enrollmentRows = state.enrollments.map((item) => {
    const student = getUserById(item.userId);
    const course = getCourse(item.courseId);
    const progress = getCourseProgress(item.courseId, item.userId).percent;
    const action = item.status === "active"
      ? `<button class="btn btn-danger btn-small" type="button" onclick="updateEnrollmentStatus('${item.id}', 'blocked')">Tạm khóa</button>`
      : `<button class="btn btn-primary btn-small" type="button" onclick="updateEnrollmentStatus('${item.id}', 'active')">Mở quyền</button>`;
    return `
      <tr>
        <td><strong>${student?.name || "Không rõ"}</strong><br><span class="muted">${student?.email || ""}</span></td>
        <td>${course.title}</td>
        <td>${progress}%</td>
        <td>${statusBadge(item.status)}</td>
        <td class="table-actions">${action}<button class="btn btn-light btn-small" type="button" onclick="updateEnrollmentStatus('${item.id}', 'pending')">Chờ duyệt</button></td>
      </tr>
    `;
  }).join("");

  const totalStudents = state.users.filter((item) => item.role === "student").length;
  const pending = state.enrollments.filter((item) => item.status === "pending").length;
  const active = state.enrollments.filter((item) => item.status === "active").length;

  app.innerHTML = `
    <section class="page-hero">
      <div class="container page-hero-grid">
        <div>
          <span class="eyebrow">Quản trị cơ bản</span>
          <h1>Dashboard quản lý khóa học và quyền học</h1>
          <p class="lead">Admin demo có thể duyệt, tạm khóa hoặc đưa yêu cầu về trạng thái chờ duyệt. Tất cả chỉ lưu localStorage.</p>
        </div>
        <div class="form-actions">
          <button class="btn btn-primary" type="button" onclick="alert('Demo UI: thêm khóa học sẽ làm ở phần quản trị nâng cao.')">+ Thêm khóa học</button>
          <button class="btn btn-light" type="button" onclick="resetDemoData()">Reset demo</button>
        </div>
      </div>
    </section>
    <section class="section-tight">
      <div class="container">
        <div class="warning-box" style="margin-bottom:18px">
          <strong>Cảnh báo khi làm bản thật:</strong> quyền xem video, thanh toán và vai trò admin phải được kiểm tra ở server. Không được chỉ dựa vào localStorage/frontend.
        </div>
        <div class="admin-grid" style="margin-bottom:18px">
          <article class="card pad"><span class="chip">Tổng khóa học</span><h2>${courses.length}</h2><p class="muted">Mock data</p></article>
          <article class="card pad"><span class="chip success">Học viên</span><h2>${totalStudents}</h2><p class="muted">Tài khoản mẫu</p></article>
          <article class="card pad"><span class="chip warning">Chờ duyệt</span><h2>${pending}</h2><p class="muted">Cần mở quyền</p></article>
          <article class="card pad"><span class="chip success">Đã mở quyền</span><h2>${active}</h2><p class="muted">Có thể học video</p></article>
        </div>

        <div class="section-head"><h2>Danh sách khóa học</h2><p class="muted">Khi nối backend, bảng này sẽ quản lý tạo/sửa khóa học, bài học và trạng thái xuất bản.</p></div>
        <div class="admin-table-wrap" style="margin-bottom:32px">
          <table class="admin-table">
            <thead><tr><th>Khóa học</th><th>Giá</th><th>Giảng viên</th><th>Trạng thái</th><th>Thao tác</th></tr></thead>
            <tbody>${courseRows}</tbody>
          </table>
        </div>

        <div class="section-head"><h2>Quyền truy cập học viên</h2><p class="muted">Khu vực kiểm tra quyền học: đã mở quyền, chờ duyệt hoặc tạm khóa.</p></div>
        <div class="admin-table-wrap">
          <table class="admin-table">
            <thead><tr><th>Học viên</th><th>Khóa học</th><th>Tiến độ</th><th>Quyền truy cập</th><th>Thao tác</th></tr></thead>
            <tbody>${enrollmentRows}</tbody>
          </table>
        </div>
      </div>
    </section>
  `;
}

function renderNotFound() {
  app.innerHTML = `
    <section class="section"><div class="container empty-state"><h1>Không tìm thấy trang</h1><p class="muted">Đường dẫn không tồn tại.</p><a class="btn btn-primary" href="#/">Về trang chủ</a></div></section>
  `;
}

function handleLogin(event) {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const email = String(form.get("email") || "").trim().toLowerCase();
  const password = String(form.get("password") || "");
  const user = state.users.find((item) => item.email.toLowerCase() === email && item.password === password);
  if (!user) {
    alert("Email hoặc mật khẩu chưa đúng. Có thể dùng hocvien@example.com / 123456 hoặc admin@example.com / admin123.");
    return;
  }
  state.currentUserId = user.id;
  saveState();
  window.location.hash = user.role === "admin" ? "#/admin" : "#/account";
}

function handleRegister(event) {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const name = String(form.get("name") || "").trim();
  const email = String(form.get("email") || "").trim().toLowerCase();
  const phone = String(form.get("phone") || "").trim();
  const password = String(form.get("password") || "");

  if (!name || !email || password.length < 6) {
    alert("Vui lòng nhập đủ họ tên, email và mật khẩu tối thiểu 6 ký tự.");
    return;
  }
  if (state.users.some((user) => user.email.toLowerCase() === email)) {
    alert("Email này đã tồn tại trong dữ liệu demo.");
    return;
  }

  const newUser = { id: `user-${Date.now()}`, name, email, phone, password, role: "student" };
  state.users.push(newUser);
  state.currentUserId = newUser.id;
  saveState();
  window.location.hash = "#/account";
}

function loginAsDemo(role) {
  const user = state.users.find((item) => item.role === role);
  if (!user) return;
  state.currentUserId = user.id;
  saveState();
  window.location.hash = role === "admin" ? "#/admin" : "#/account";
}

function logoutUser() {
  state.currentUserId = "";
  saveState();
  window.location.hash = "#/auth";
}

function enrollCourse(courseId, status = "pending") {
  const user = currentUser();
  if (!user) {
    window.location.hash = "#/auth";
    return;
  }
  if (user.role !== "student") {
    alert("Tài khoản admin không đăng ký học. Hãy dùng tài khoản học viên demo.");
    return;
  }

  const existing = getEnrollment(courseId, user.id);
  if (existing) {
    existing.status = status;
  } else {
    state.enrollments.push({
      id: `enr-${Date.now()}`,
      userId: user.id,
      courseId,
      status,
      createdAt: new Date().toISOString().slice(0, 10)
    });
  }
  if (!state.progress[progressKey(user.id, courseId)]) {
    state.progress[progressKey(user.id, courseId)] = { completed: [], lastLesson: 0 };
  }
  saveState();
  window.location.hash = status === "active" ? `#/learn/${courseId}/0` : "#/account";
}

function markLessonDone(courseId, lessonIndex) {
  const user = currentUser();
  if (!user) return;
  const course = getCourse(courseId);
  const progress = getCourseProgress(courseId, user.id);
  const completed = Array.from(new Set([...progress.completed, lessonIndex])).sort((a, b) => a - b);
  const nextLesson = Math.min(lessonIndex + 1, course.curriculum.length - 1);
  setCourseProgress(courseId, { completed, lastLesson: nextLesson }, user.id);
  renderLearn(courseId, String(lessonIndex));
}

function updateEnrollmentStatus(enrollmentId, status) {
  const item = state.enrollments.find((enrollment) => enrollment.id === enrollmentId);
  if (!item) return;
  item.status = status;
  saveState();
  renderAdmin();
}

function render() {
  const { path, id, lesson } = formatRoute();
  const routeName = path === "" ? "home" : path;
  updateNav(routeName);
  window.scrollTo({ top: 0, behavior: "auto" });

  if (routeName === "home") return renderHome();
  if (routeName === "courses") return renderCourses();
  if (routeName === "detail") return renderDetail(id);
  if (routeName === "learn") return renderLearn(id, lesson);
  if (routeName === "auth") return renderAuth();
  if (routeName === "account") return renderAccount();
  if (routeName === "admin") return renderAdmin();
  return renderNotFound();
}

window.handleLogin = handleLogin;
window.handleRegister = handleRegister;
window.loginAsDemo = loginAsDemo;
window.logoutUser = logoutUser;
window.enrollCourse = enrollCourse;
window.markLessonDone = markLessonDone;
window.updateEnrollmentStatus = updateEnrollmentStatus;
window.resetDemoData = resetDemoData;

window.addEventListener("hashchange", render);
saveState();
render();
