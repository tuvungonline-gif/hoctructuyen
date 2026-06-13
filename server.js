import express from "express";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import { fileURLToPath } from "url";
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const app = express();
const port = process.env.PORT || 3000;

const r2AccountId = process.env.R2_ACCOUNT_ID || "";
const r2AccessKeyId = process.env.R2_ACCESS_KEY_ID || "";
const r2SecretAccessKey = process.env.R2_SECRET_ACCESS_KEY || "";
const r2Bucket = process.env.R2_BUCKET_NAME || "";
const r2PublicUrl = process.env.R2_PUBLIC_URL || "";
const adminToken = process.env.ADMIN_TOKEN || "";
const dataDir = process.env.DATA_DIR || path.join(dirname, "data");
const dataFile = process.env.DATA_FILE || path.join(dataDir, "eduvideo-store.json");

const corsOrigins = String(process.env.CORS_ORIGINS || process.env.APP_BASE_URL || "")
  .split(",")
  .map((item) => item.trim())
  .filter(Boolean);
const allowedOrigins = new Set(corsOrigins);
const sessions = new Map();

app.disable("x-powered-by");

app.use(function corsMiddleware(req, res, next) {
  const origin = req.headers.origin;
  if (origin && (allowedOrigins.size === 0 || allowedOrigins.has(origin))) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  }
  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }
  next();
});

app.use(express.json({ limit: "2mb" }));

app.use(function jsonParseErrorHandler(error, req, res, next) {
  if (error instanceof SyntaxError && "body" in error) {
    res.status(400).json({ error: "Invalid JSON request body" });
    return;
  }
  next(error);
});

const r2Client = r2AccountId && r2AccessKeyId && r2SecretAccessKey
  ? new S3Client({
      region: "auto",
      endpoint: `https://${r2AccountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: r2AccessKeyId,
        secretAccessKey: r2SecretAccessKey
      }
    })
  : null;

function sendIndex(res) {
  const filePath = path.join(dirname, "index.html");
  let html = fs.readFileSync(filePath, "utf8");
  if (!html.includes("production-status.js")) {
    html = html.replace("</body>", "<script src=\"production-status.js\"></script></body>");
  }
  res.type("html").send(html);
}

function safeName(value) {
  return String(value || "file").toLowerCase().replace(/[^a-z0-9._-]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "").slice(0, 120) || "item";
}

function slugify(value) {
  return safeName(String(value || "khoa-hoc").normalize("NFD").replace(/[\u0300-\u036f]/g, ""));
}

function videoKey({ courseId, lessonId, fileName }) {
  const ext = path.extname(fileName || "video.mp4") || ".mp4";
  const id = crypto.randomUUID();
  return `courses/${safeName(courseId)}/lessons/${safeName(lessonId)}/${id}${ext}`;
}

function nowIso() {
  return new Date().toISOString();
}

function hashPassword(password, salt = crypto.randomBytes(16).toString("hex")) {
  const hash = crypto.scryptSync(String(password || ""), salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

function verifyPassword(password, passwordHash) {
  const [salt, storedHash] = String(passwordHash || "").split(":");
  if (!salt || !storedHash) return false;
  const nextHash = crypto.scryptSync(String(password || ""), salt, 64).toString("hex");
  return crypto.timingSafeEqual(Buffer.from(storedHash, "hex"), Buffer.from(nextHash, "hex"));
}

function publicUser(user) {
  return {
    id: user.id,
    email: user.email,
    name: user.name || user.email,
    phone: user.phone || "",
    role: user.role || "student",
    status: user.status || "active"
  };
}

function makeUser({ id, name, email, phone = "", password, role = "student", status = "active" }) {
  return {
    id: id || crypto.randomUUID(),
    name,
    email: String(email || "").trim().toLowerCase(),
    phone,
    passwordHash: hashPassword(password),
    role,
    status,
    createdAt: nowIso()
  };
}

function seedStore() {
  const student = makeUser({ id: "student-demo", name: "Học viên Demo", email: "hocvien@example.com", phone: "0900000001", password: "123456", role: "student" });
  const admin = makeUser({ id: "admin-demo", name: "Admin Demo", email: "admin@example.com", phone: "0900000002", password: "admin123", role: "admin" });
  const courses = [
    {
      id: "video-marketing-ai",
      slug: "tao-video-ngan-bang-ai",
      title: "Tạo video ngắn bằng AI",
      short_title: "Video AI",
      description: "Học cách lên ý tưởng, viết kịch bản, tạo cảnh video ngắn và tối ưu nội dung dễ xem trên điện thoại.",
      level: "Cơ bản",
      price: 799000,
      currency: "VND",
      status: "published",
      instructor_name: "EduVideo",
      created_at: nowIso()
    },
    {
      id: "ban-hang-online",
      slug: "ban-hang-online-thuc-chien",
      title: "Bán hàng online thực chiến",
      short_title: "Bán hàng",
      description: "Xây dựng phễu nội dung, tư vấn khách hàng và chốt đơn tự nhiên trên nền tảng online.",
      level: "Thực chiến",
      price: 1200000,
      currency: "VND",
      status: "published",
      instructor_name: "EduVideo",
      created_at: nowIso()
    },
    {
      id: "thiet-ke-landing-page",
      slug: "thiet-ke-landing-page-khoa-hoc",
      title: "Thiết kế landing page khóa học",
      short_title: "Landing Page",
      description: "Thiết kế trang giới thiệu khóa học rõ ràng, có CTA nổi bật, phù hợp mobile và tăng chuyển đổi.",
      level: "UI/UX",
      price: 990000,
      currency: "VND",
      status: "published",
      instructor_name: "EduVideo",
      created_at: nowIso()
    }
  ];
  const lessons = [
    { id: "lesson-video-ai-1", course_id: "video-marketing-ai", title: "Tư duy video ngắn cho người mới", description: "", duration_seconds: 492, is_preview: true, sort_order: 1, status: "published", video_status: "empty" },
    { id: "lesson-video-ai-2", course_id: "video-marketing-ai", title: "Cách tìm hook thu hút trong 5 giây đầu", description: "", duration_seconds: 705, is_preview: false, sort_order: 2, status: "published", video_status: "empty" },
    { id: "lesson-sales-1", course_id: "ban-hang-online", title: "Nền tảng bán hàng online bền vững", description: "", duration_seconds: 565, is_preview: true, sort_order: 1, status: "published", video_status: "empty" },
    { id: "lesson-landing-1", course_id: "thiet-ke-landing-page", title: "Cấu trúc landing page bán khóa học", description: "", duration_seconds: 780, is_preview: true, sort_order: 1, status: "published", video_status: "empty" }
  ];
  return {
    version: 1,
    users: [student, admin],
    courses,
    lessons,
    enrollments: [
      { id: "enr-1", user_id: "student-demo", course_id: "video-marketing-ai", status: "active", created_at: nowIso() },
      { id: "enr-2", user_id: "student-demo", course_id: "thiet-ke-landing-page", status: "active", created_at: nowIso() },
      { id: "enr-3", user_id: "student-demo", course_id: "ban-hang-online", status: "pending", created_at: nowIso() }
    ],
    progress: []
  };
}

function ensureDataDir() {
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
}

function loadStore() {
  ensureDataDir();
  if (!fs.existsSync(dataFile)) {
    const initial = seedStore();
    fs.writeFileSync(dataFile, JSON.stringify(initial, null, 2));
    return initial;
  }
  try {
    const parsed = JSON.parse(fs.readFileSync(dataFile, "utf8"));
    const seed = seedStore();
    return {
      ...seed,
      ...parsed,
      users: Array.isArray(parsed.users) ? parsed.users : seed.users,
      courses: Array.isArray(parsed.courses) ? parsed.courses : seed.courses,
      lessons: Array.isArray(parsed.lessons) ? parsed.lessons : seed.lessons,
      enrollments: Array.isArray(parsed.enrollments) ? parsed.enrollments : seed.enrollments,
      progress: Array.isArray(parsed.progress) ? parsed.progress : []
    };
  } catch (error) {
    const backupFile = `${dataFile}.broken-${Date.now()}.bak`;
    fs.copyFileSync(dataFile, backupFile);
    const initial = seedStore();
    fs.writeFileSync(dataFile, JSON.stringify(initial, null, 2));
    return initial;
  }
}

let store = loadStore();

function saveStore() {
  ensureDataDir();
  const tmpFile = `${dataFile}.tmp`;
  fs.writeFileSync(tmpFile, JSON.stringify(store, null, 2));
  fs.renameSync(tmpFile, dataFile);
}

function createSession(userId) {
  const accessToken = crypto.randomBytes(32).toString("hex");
  const refreshToken = crypto.randomBytes(32).toString("hex");
  const expiresAt = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7;
  sessions.set(accessToken, { userId, expiresAt });
  return { accessToken, refreshToken, expiresAt };
}

function getBearerToken(req) {
  const header = req.headers.authorization || "";
  return header.startsWith("Bearer ") ? header.slice(7) : "";
}

function getAuthUser(req) {
  const token = getBearerToken(req);
  if (!token) return null;
  if (adminToken && token === adminToken) {
    return store.users.find((user) => user.role === "admin" && user.status === "active") || null;
  }
  const session = sessions.get(token);
  if (!session || session.expiresAt * 1000 < Date.now()) {
    if (session) sessions.delete(token);
    return null;
  }
  return store.users.find((user) => user.id === session.userId && user.status === "active") || null;
}

function requireAuth(req, res, next) {
  const user = getAuthUser(req);
  if (!user) {
    res.status(401).json({ error: "Login required" });
    return;
  }
  req.user = user;
  next();
}

function requireAdmin(req, res, next) {
  const user = getAuthUser(req);
  if (!user || user.role !== "admin" || user.status !== "active") {
    res.status(403).json({ error: "Admin permission required" });
    return;
  }
  req.user = user;
  next();
}

function lessonListForCourse(courseId) {
  return store.lessons
    .filter((lesson) => lesson.course_id === courseId && lesson.status !== "deleted")
    .sort((a, b) => Number(a.sort_order || 0) - Number(b.sort_order || 0));
}

function mapCourseForFrontend(course) {
  const lessonList = lessonListForCourse(course.id);
  return {
    id: course.id,
    slug: course.slug,
    title: course.title,
    shortTitle: course.short_title || course.title,
    desc: course.description || "Khóa học đang được cập nhật nội dung.",
    level: course.level || "Cơ bản",
    lessons: lessonList.length,
    duration: lessonList.length ? `${lessonList.length} bài học` : "Đang cập nhật",
    price: `${Number(course.price || 0).toLocaleString("vi-VN")}đ`,
    tag: course.status === "published" ? "Đã xuất bản" : "Bản nháp",
    color: course.color || "",
    instructor: course.instructor_name || "EduVideo",
    benefits: course.benefits || ["Học theo lộ trình rõ ràng", "Có bài học video", "Theo dõi tiến độ học"],
    curriculum: lessonList.length
      ? lessonList.map((lesson) => [lesson.title || "Bài học", lesson.duration_seconds ? `${Math.ceil(Number(lesson.duration_seconds) / 60)} phút` : "Video"])
      : [["Bài học đang cập nhật", "Video"]],
    rawLessons: lessonList
  };
}

function userHasLessonAccess(userId, lessonId) {
  const lesson = store.lessons.find((item) => item.id === lessonId);
  if (!lesson) return false;
  if (lesson.is_preview) return true;
  return store.enrollments.some((enrollment) => enrollment.user_id === userId && enrollment.course_id === lesson.course_id && enrollment.status === "active");
}

function publicR2Url(key) {
  return r2PublicUrl ? `${r2PublicUrl.replace(/\/$/, "")}/${key}` : "";
}

app.get("/health", function (req, res) {
  res.status(200).json({ ok: true, service: "eduvideo", authMode: "local", dataMode: "local-json" });
});

app.get("/api/config", function (req, res) {
  res.status(200).json({
    productionReady: true,
    authMode: "local",
    dataMode: "local-json",
    r2Ready: Boolean(r2Client && r2Bucket),
    videoMode: r2Client && r2Bucket ? "r2-signed-url" : "demo",
    uploadMode: r2Client && r2Bucket ? "backend-proxy",
    adminTokenEnabled: Boolean(adminToken)
  });
});

app.post("/api/auth/login", function (req, res) {
  try {
    const email = String(req.body?.email || "").trim().toLowerCase();
    const password = String(req.body?.password || "");
    if (!email || !password) {
      res.status(400).json({ error: "email and password are required" });
      return;
    }
    const user = store.users.find((item) => item.email === email && item.status === "active");
    if (!user || !verifyPassword(password, user.passwordHash)) {
      res.status(401).json({ error: "Email hoặc mật khẩu chưa đúng." });
      return;
    }
    const session = createSession(user.id);
    res.json({ ...session, user: publicUser(user), profile: { id: user.id, role: user.role, status: user.status } });
  } catch (error) {
    res.status(500).json({ error: error.message || "Could not login" });
  }
});

app.post("/api/auth/register", function (req, res) {
  try {
    const name = String(req.body?.name || "").trim();
    const email = String(req.body?.email || "").trim().toLowerCase();
    const phone = String(req.body?.phone || "").trim();
    const password = String(req.body?.password || "");
    if (!name || !email || password.length < 6) {
      res.status(400).json({ error: "name, email and password length >= 6 are required" });
      return;
    }
    if (store.users.some((user) => user.email === email)) {
      res.status(409).json({ error: "Email này đã tồn tại." });
      return;
    }
    const user = makeUser({ name, email, phone, password, role: "student", status: "active" });
    store.users.push(user);
    saveStore();
    const session = createSession(user.id);
    res.status(201).json({ ...session, user: publicUser(user), profile: { id: user.id, role: user.role, status: user.status } });
  } catch (error) {
    res.status(500).json({ error: error.message || "Could not register" });
  }
});

app.get("/api/auth/me", requireAuth, function (req, res) {
  res.json({ user: publicUser(req.user), profile: { id: req.user.id, role: req.user.role, status: req.user.status } });
});

app.get("/api/courses", function (req, res) {
  const courses = store.courses
    .filter((course) => course.status === "published")
    .sort((a, b) => String(b.created_at || "").localeCompare(String(a.created_at || "")))
    .map(mapCourseForFrontend);
  res.json({ courses });
});

app.get("/api/courses/:courseId", function (req, res) {
  const course = store.courses.find((item) => item.id === req.params.courseId || item.slug === req.params.courseId);
  if (!course || course.status === "deleted") {
    res.status(404).json({ error: "Course not found" });
    return;
  }
  res.json({ course: mapCourseForFrontend(course) });
});

app.get("/api/admin/status", requireAdmin, function (req, res) {
  res.json({ ok: true, authMode: "local", dataMode: "local-json", r2Ready: Boolean(r2Client && r2Bucket), uploadMode: r2Client && r2Bucket ? "backend-proxy" : "demo" });
});

app.get("/api/admin/courses", requireAdmin, function (req, res) {
  const courses = store.courses
    .filter((course) => course.status !== "deleted")
    .sort((a, b) => String(b.created_at || "").localeCompare(String(a.created_at || "")));
  res.json({ courses });
});

app.post("/api/admin/courses", requireAdmin, function (req, res) {
  try {
    const body = req.body || {};
    const title = String(body.title || "").trim();
    if (!title) return res.status(400).json({ error: "title is required" });
    const baseSlug = slugify(body.slug || title);
    const course = {
      id: crypto.randomUUID(),
      slug: `${baseSlug}-${Date.now().toString().slice(-5)}`,
      title,
      short_title: String(body.shortTitle || title).slice(0, 60),
      description: String(body.description || ""),
      level: String(body.level || "Cơ bản"),
      price: Number(body.price || 0),
      currency: "VND",
      status: body.status || "published",
      instructor_id: req.user.id,
      instructor_name: req.user.name || "EduVideo",
      created_at: nowIso()
    };
    store.courses.push(course);
    saveStore();
    res.json({ course });
  } catch (error) {
    res.status(500).json({ error: error.message || "Could not create course" });
  }
});

app.put("/api/admin/courses/:courseId", requireAdmin, function (req, res) {
  const course = store.courses.find((item) => item.id === req.params.courseId);
  if (!course) return res.status(404).json({ error: "Course not found" });
  const body = req.body || {};
  ["title", "description", "level", "status"].forEach((key) => {
    if (body[key] !== undefined) course[key === "description" ? "description" : key] = String(body[key]);
  });
  if (body.shortTitle !== undefined) course.short_title = String(body.shortTitle).slice(0, 60);
  if (body.price !== undefined) course.price = Number(body.price || 0);
  course.updated_at = nowIso();
  saveStore();
  res.json({ course });
});

app.delete("/api/admin/courses/:courseId", requireAdmin, function (req, res) {
  const course = store.courses.find((item) => item.id === req.params.courseId);
  if (!course) return res.status(404).json({ error: "Course not found" });
  course.status = "deleted";
  course.updated_at = nowIso();
  saveStore();
  res.json({ ok: true });
});

app.post("/api/admin/courses/:courseId/lessons", requireAdmin, function (req, res) {
  try {
    const course = store.courses.find((item) => item.id === req.params.courseId);
    if (!course) return res.status(404).json({ error: "Course not found" });
    const body = req.body || {};
    const title = String(body.title || "").trim();
    if (!title) return res.status(400).json({ error: "lesson title is required" });
    const lesson = {
      id: crypto.randomUUID(),
      course_id: course.id,
      title,
      description: String(body.description || ""),
      duration_seconds: Number(body.durationSeconds || 0),
      is_preview: Boolean(body.isPreview),
      sort_order: Number(body.sortOrder || lessonListForCourse(course.id).length + 1),
      status: body.status || "published",
      video_provider: "cloudflare-r2",
      video_status: "empty",
      created_at: nowIso()
    };
    store.lessons.push(lesson);
    saveStore();
    res.json({ lesson });
  } catch (error) {
    res.status(500).json({ error: error.message || "Could not create lesson" });
  }
});

app.post("/api/admin/r2/upload-proxy", requireAdmin, async function (req, res) {
  try {
    if (!r2Client || !r2Bucket) {
      res.status(500).json({ error: "R2 is not configured" });
      return;
    }
    const courseId = String(req.query.courseId || "").trim();
    const lessonId = String(req.query.lessonId || "").trim();
    const fileName = String(req.query.fileName || "video.mp4").trim();
    const contentType = String(req.headers["content-type"] || req.query.contentType || "video/mp4");
    if (!courseId || !lessonId || !fileName) {
      res.status(400).json({ error: "courseId, lessonId and fileName are required" });
      return;
    }
    const lesson = store.lessons.find((item) => item.id === lessonId && item.course_id === courseId);
    if (!lesson) {
      res.status(404).json({ error: "Lesson not found for this course" });
      return;
    }
    const key = videoKey({ courseId, lessonId, fileName });
    const contentLength = Number(req.headers["content-length"] || 0);
    await r2Client.send(new PutObjectCommand({
      Bucket: r2Bucket,
      Key: key,
      Body: req,
      ContentType: contentType,
      ...(contentLength > 0 ? { ContentLength: contentLength } : {})
    }));
    res.json({ key, publicUrl: publicR2Url(key), sizeBytes: contentLength || null, uploadMode: "backend-proxy" });
  } catch (error) {
    res.status(500).json({ error: error.message || "Could not upload video through backend" });
  }
});

app.post("/api/admin/r2/presign-upload", requireAdmin, async function (req, res) {
  try {
    if (!r2Client || !r2Bucket) {
      res.status(500).json({ error: "R2 is not configured" });
      return;
    }
    const { courseId, lessonId, fileName, contentType } = req.body || {};
    if (!courseId || !lessonId || !fileName) {
      res.status(400).json({ error: "courseId, lessonId and fileName are required" });
      return;
    }
    const key = videoKey({ courseId, lessonId, fileName });
    const command = new PutObjectCommand({
      Bucket: r2Bucket,
      Key: key,
      ContentType: contentType || "video/mp4"
    });
    const uploadUrl = await getSignedUrl(r2Client, command, { expiresIn: 900 });
    res.json({ uploadUrl, key, expiresIn: 900, publicUrl: publicR2Url(key) });
  } catch (error) {
    res.status(500).json({ error: error.message || "Could not create upload URL" });
  }
});

app.post("/api/admin/lessons/:lessonId/video", requireAdmin, function (req, res) {
  try {
    const lesson = store.lessons.find((item) => item.id === req.params.lessonId);
    if (!lesson) return res.status(404).json({ error: "Lesson not found" });
    const { r2Key, videoProvider, contentType, sizeBytes } = req.body || {};
    if (!r2Key) return res.status(400).json({ error: "r2Key is required" });
    lesson.video_provider = videoProvider || "cloudflare-r2";
    lesson.video_asset_id = r2Key;
    lesson.video_url = null;
    if (contentType) lesson.video_mime_type = contentType;
    if (sizeBytes) lesson.video_size_bytes = Number(sizeBytes);
    lesson.video_status = "ready";
    lesson.video_uploaded_at = nowIso();
    saveStore();
    res.json({ lesson });
  } catch (error) {
    res.status(500).json({ error: error.message || "Could not attach video" });
  }
});

app.post("/api/video/:lessonId/signed-url", requireAuth, async function (req, res) {
  try {
    if (!r2Client || !r2Bucket) {
      res.status(500).json({ error: "Video service is not configured" });
      return;
    }
    if (!userHasLessonAccess(req.user.id, req.params.lessonId)) {
      res.status(403).json({ error: "No lesson access" });
      return;
    }
    const lesson = store.lessons.find((item) => item.id === req.params.lessonId);
    if (!lesson?.video_asset_id) {
      res.status(404).json({ error: "Video is not attached" });
      return;
    }
    const command = new GetObjectCommand({ Bucket: r2Bucket, Key: lesson.video_asset_id });
    const videoUrl = await getSignedUrl(r2Client, command, { expiresIn: 1800 });
    res.json({ videoUrl, expiresIn: 1800 });
  } catch (error) {
    res.status(500).json({ error: error.message || "Could not create video URL" });
  }
});

app.delete("/api/admin/r2/object", requireAdmin, async function (req, res) {
  try {
    if (!r2Client || !r2Bucket) {
      res.status(500).json({ error: "R2 is not configured" });
      return;
    }
    const { key } = req.body || {};
    if (!key) {
      res.status(400).json({ error: "key is required" });
      return;
    }
    await r2Client.send(new DeleteObjectCommand({ Bucket: r2Bucket, Key: key }));
    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ error: error.message || "Could not delete R2 object" });
  }
});

app.use(function finalApiErrorHandler(error, req, res, next) {
  if (req.path.startsWith("/api")) {
    res.status(error.status || 500).json({ error: error.message || "Internal server error" });
    return;
  }
  next(error);
});

app.use("/api", function apiNotFound(req, res) {
  res.status(404).json({ error: `API route not found: ${req.method} ${req.originalUrl}` });
});

app.get("/", function (req, res) {
  sendIndex(res);
});

app.use(function blockPrivateStaticFiles(req, res, next) {
  const blocked = new Set(["/server.js", "/package.json", "/package-lock.json", "/.env", "/.env.local"]);
  if (blocked.has(req.path) || req.path.startsWith("/.git") || req.path.startsWith("/.github") || req.path.startsWith("/data")) {
    res.status(404).type("text").send("Not found");
    return;
  }
  next();
});

app.use(express.static(dirname, {
  fallthrough: true,
  maxAge: process.env.NODE_ENV === "production" ? "1h" : 0
}));

app.get("*", function (req, res) {
  sendIndex(res);
});

app.use(function finalErrorHandler(error, req, res, next) {
  console.error("Unhandled error", error);
  if (res.headersSent) return next(error);
  res.status(500).type("text").send("Internal server error");
});

app.listen(port, "0.0.0.0", function () {
  console.log("EduVideo running on port " + port);
});
