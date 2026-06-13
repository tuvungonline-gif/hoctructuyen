import express from "express";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import { fileURLToPath } from "url";
import { createClient } from "@supabase/supabase-js";
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json({ limit: "2mb" }));

const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

const r2AccountId = process.env.R2_ACCOUNT_ID || "";
const r2AccessKeyId = process.env.R2_ACCESS_KEY_ID || "";
const r2SecretAccessKey = process.env.R2_SECRET_ACCESS_KEY || "";
const r2Bucket = process.env.R2_BUCKET_NAME || "";
const r2PublicUrl = process.env.R2_PUBLIC_URL || "";

const supabaseAdmin = supabaseUrl && supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey, { auth: { persistSession: false } })
  : null;

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

async function getAuthUser(req) {
  if (!supabaseUrl || !supabaseAnonKey) return null;
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (!token) return null;
  const client = createClient(supabaseUrl, supabaseAnonKey, { auth: { persistSession: false } });
  const result = await client.auth.getUser(token);
  return result.data?.user || null;
}

async function getProfile(userId) {
  if (!supabaseAdmin || !userId) return null;
  const result = await supabaseAdmin.from("profiles").select("id, role, status").eq("id", userId).maybeSingle();
  return result.data || null;
}

async function requireAdmin(req, res, next) {
  const user = await getAuthUser(req);
  const profile = await getProfile(user?.id);
  if (!user || !profile || profile.role !== "admin" || profile.status !== "active") {
    res.status(403).json({ error: "Admin permission required" });
    return;
  }
  req.user = user;
  req.profile = profile;
  next();
}

async function userHasLessonAccess(userId, lessonId) {
  if (!supabaseAdmin || !userId || !lessonId) return false;
  const lessonResult = await supabaseAdmin.from("lessons").select("id, course_id, is_preview").eq("id", lessonId).maybeSingle();
  const lesson = lessonResult.data;
  if (!lesson) return false;
  if (lesson.is_preview) return true;
  const enrollment = await supabaseAdmin
    .from("enrollments")
    .select("id")
    .eq("user_id", userId)
    .eq("course_id", lesson.course_id)
    .eq("status", "active")
    .maybeSingle();
  return Boolean(enrollment.data?.id);
}

app.get("/health", function (req, res) {
  res.status(200).json({ ok: true, service: "eduvideo" });
});

app.get("/api/config", function (req, res) {
  res.status(200).json({
    supabaseUrl,
    supabaseAnonKey,
    productionReady: Boolean(supabaseUrl && supabaseAnonKey),
    r2Ready: Boolean(r2Client && r2Bucket),
    videoMode: r2Client && r2Bucket ? "r2-signed-url" : "demo"
  });
});

app.post("/api/auth/login", async function (req, res) {
  try {
    if (!supabaseUrl || !supabaseAnonKey) {
      res.status(500).json({ error: "Supabase auth is not configured" });
      return;
    }
    const email = String(req.body?.email || "").trim().toLowerCase();
    const password = String(req.body?.password || "");
    if (!email || !password) {
      res.status(400).json({ error: "email and password are required" });
      return;
    }
    const client = createClient(supabaseUrl, supabaseAnonKey, { auth: { persistSession: false } });
    const result = await client.auth.signInWithPassword({ email, password });
    if (result.error || !result.data?.session?.access_token || !result.data?.user) {
      res.status(401).json({ error: "Email hoặc mật khẩu chưa đúng." });
      return;
    }
    const user = result.data.user;
    const profile = await getProfile(user.id);
    res.json({
      accessToken: result.data.session.access_token,
      refreshToken: result.data.session.refresh_token,
      expiresAt: result.data.session.expires_at,
      user: {
        id: user.id,
        email: user.email,
        name: user.user_metadata?.name || user.user_metadata?.full_name || user.email
      },
      profile
    });
  } catch (error) {
    res.status(500).json({ error: error.message || "Could not login" });
  }
});

app.get("/api/admin/status", requireAdmin, function (req, res) {
  res.json({ ok: true, supabaseReady: Boolean(supabaseAdmin), r2Ready: Boolean(r2Client && r2Bucket) });
});

app.get("/api/admin/courses", requireAdmin, async function (req, res) {
  try {
    if (!supabaseAdmin) return res.status(500).json({ error: "Supabase service role is not configured" });
    const result = await supabaseAdmin
      .from("courses")
      .select("id, slug, title, short_title, price, currency, status, created_at")
      .order("created_at", { ascending: false })
      .limit(50);
    if (result.error) return res.status(500).json({ error: result.error.message });
    res.json({ courses: result.data || [] });
  } catch (error) {
    res.status(500).json({ error: error.message || "Could not load courses" });
  }
});

app.post("/api/admin/courses", requireAdmin, async function (req, res) {
  try {
    if (!supabaseAdmin) return res.status(500).json({ error: "Supabase service role is not configured" });
    const body = req.body || {};
    const title = String(body.title || "").trim();
    if (!title) return res.status(400).json({ error: "title is required" });
    const baseSlug = slugify(body.slug || title);
    const slug = `${baseSlug}-${Date.now().toString().slice(-5)}`;
    const result = await supabaseAdmin
      .from("courses")
      .insert({
        title,
        slug,
        short_title: String(body.shortTitle || title).slice(0, 60),
        description: String(body.description || ""),
        level: String(body.level || "Cơ bản"),
        price: Number(body.price || 0),
        currency: "VND",
        status: body.status || "published",
        instructor_id: req.user.id
      })
      .select("id, slug, title, short_title, price, currency, status")
      .single();
    if (result.error) return res.status(500).json({ error: result.error.message });
    res.json({ course: result.data });
  } catch (error) {
    res.status(500).json({ error: error.message || "Could not create course" });
  }
});

app.post("/api/admin/courses/:courseId/lessons", requireAdmin, async function (req, res) {
  try {
    if (!supabaseAdmin) return res.status(500).json({ error: "Supabase service role is not configured" });
    const body = req.body || {};
    const title = String(body.title || "").trim();
    if (!title) return res.status(400).json({ error: "lesson title is required" });
    const result = await supabaseAdmin
      .from("lessons")
      .insert({
        course_id: req.params.courseId,
        title,
        description: String(body.description || ""),
        duration_seconds: Number(body.durationSeconds || 0),
        is_preview: Boolean(body.isPreview),
        sort_order: Number(body.sortOrder || 1),
        status: body.status || "published",
        video_provider: "cloudflare-r2",
        video_status: "empty"
      })
      .select("id, course_id, title, status, is_preview, sort_order")
      .single();
    if (result.error) return res.status(500).json({ error: result.error.message });
    res.json({ lesson: result.data });
  } catch (error) {
    res.status(500).json({ error: error.message || "Could not create lesson" });
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
    res.json({ uploadUrl, key, expiresIn: 900, publicUrl: r2PublicUrl ? `${r2PublicUrl.replace(/\/$/, "")}/${key}` : "" });
  } catch (error) {
    res.status(500).json({ error: error.message || "Could not create upload URL" });
  }
});

app.post("/api/admin/lessons/:lessonId/video", requireAdmin, async function (req, res) {
  try {
    if (!supabaseAdmin) {
      res.status(500).json({ error: "Supabase service role is not configured" });
      return;
    }
    const { r2Key, videoProvider, contentType, sizeBytes } = req.body || {};
    if (!r2Key) {
      res.status(400).json({ error: "r2Key is required" });
      return;
    }
    const updateData = { video_provider: videoProvider || "cloudflare-r2", video_asset_id: r2Key, video_url: null };
    if (contentType) updateData.video_mime_type = contentType;
    if (sizeBytes) updateData.video_size_bytes = Number(sizeBytes);
    updateData.video_status = "ready";
    updateData.video_uploaded_at = new Date().toISOString();
    const result = await supabaseAdmin
      .from("lessons")
      .update(updateData)
      .eq("id", req.params.lessonId)
      .select("id, course_id, title, video_provider, video_asset_id, video_status")
      .maybeSingle();
    if (result.error) {
      res.status(500).json({ error: result.error.message });
      return;
    }
    res.json({ lesson: result.data });
  } catch (error) {
    res.status(500).json({ error: error.message || "Could not attach video" });
  }
});

app.post("/api/video/:lessonId/signed-url", async function (req, res) {
  try {
    if (!r2Client || !r2Bucket || !supabaseAdmin) {
      res.status(500).json({ error: "Video service is not configured" });
      return;
    }
    const user = await getAuthUser(req);
    if (!user) {
      res.status(401).json({ error: "Login required" });
      return;
    }
    const hasAccess = await userHasLessonAccess(user.id, req.params.lessonId);
    if (!hasAccess) {
      res.status(403).json({ error: "No lesson access" });
      return;
    }
    const lessonResult = await supabaseAdmin.from("lessons").select("id, video_asset_id").eq("id", req.params.lessonId).maybeSingle();
    const lesson = lessonResult.data;
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

app.get("/", function (req, res) {
  sendIndex(res);
});

app.use(express.static(dirname));

app.get("*", function (req, res) {
  sendIndex(res);
});

app.listen(port, "0.0.0.0", function () {
  console.log("EduVideo running on port " + port);
});
