import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const app = express();
const port = process.env.PORT || 3000;

app.get("/health", function (req, res) {
  res.status(200).json({ ok: true });
});

app.use(express.static(dirname));

app.get("*", function (req, res) {
  res.sendFile(path.join(dirname, "index.html"));
});

app.listen(port, "0.0.0.0", function () {
  console.log("EduVideo running on port " + port);
});
