import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const app = express();
const port = process.env.PORT || 3000;

function sendIndex(res) {
  const filePath = path.join(dirname, "index.html");
  let html = fs.readFileSync(filePath, "utf8");
  if (!html.includes("production-status.js")) {
    html = html.replace("</body>", "<script src=\"production-status.js\"></script></body>");
  }
  res.type("html").send(html);
}

app.get("/health", function (req, res) {
  res.status(200).json({ ok: true });
});

app.get("/api/config", function (req, res) {
  res.status(200).json({
    supabaseUrl: process.env.SUPABASE_URL || "",
    supabaseAnonKey: process.env.SUPABASE_ANON_KEY || "",
    productionReady: Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY)
  });
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
