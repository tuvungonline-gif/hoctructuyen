import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const sourceFile = path.join(dirname, "server.js");
const runtimeFile = path.join(dirname, ".runtime-server.mjs");

let source = fs.readFileSync(sourceFile, "utf8");
source = source.replace(
  'uploadMode: r2Client && r2Bucket ? "backend-proxy",',
  'uploadMode: r2Client && r2Bucket ? "backend-proxy" : "demo",'
);
fs.writeFileSync(runtimeFile, source);
await import(pathToFileURL(runtimeFile).href + `?v=${Date.now()}`);
