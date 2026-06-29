import { createServer } from "node:http";
import { createReadStream, existsSync, readFileSync } from "node:fs";
import { extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createClassicV2CardAssets } from "./classic-v2-card.mjs";

const rootDir = resolve(fileURLToPath(new URL("..", import.meta.url)));
const distDir = join(rootDir, "dist");
const port = Number(process.env.PORT || 4173);

loadEnv();

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
};

const server = createServer(async (req, res) => {
  try {
    if (req.method === "POST" && req.url === "/api/classic-v2-card") {
      await handleClassicV2Card(req, res);
      return;
    }

    serveStatic(req, res);
  } catch (error) {
    sendJson(res, 500, {
      error:
        error instanceof Error
          ? error.message
          : "Unexpected server error",
    });
  }
});

server.listen(port, () => {
  console.log(`Pochakfarm server listening on http://localhost:${port}`);
});

function loadEnv() {
  const envPath = join(rootDir, ".env");
  if (!existsSync(envPath)) return;

  const lines = readFileSync(envPath, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const index = trimmed.indexOf("=");
    if (index === -1) continue;

    const key = trimmed.slice(0, index).trim();
    const value = trimmed.slice(index + 1).trim().replace(/^["']|["']$/g, "");
    if (!process.env[key]) process.env[key] = value;
  }
}

async function handleClassicV2Card(req, res) {
  try {
    const body = await readJson(req);
    const payload = await createClassicV2CardAssets(body);
    sendJson(res, 200, payload);
  } catch (error) {
    sendJson(res, error.status || 500, {
      error:
        error instanceof Error
          ? error.message
          : "카드 이미지 생성 중 오류가 발생했어요.",
    });
  }
}

function serveStatic(req, res) {
  const rawPath = decodeURIComponent((req.url || "/").split("?")[0]);
  const requestedPath = rawPath === "/" ? "/index.html" : rawPath;
  const filePath = resolve(join(distDir, requestedPath));

  if (filePath.startsWith(distDir) && existsSync(filePath)) {
    const ext = extname(filePath);
    res.writeHead(200, {
      "Content-Type": mimeTypes[ext] || "application/octet-stream",
    });
    createReadStream(filePath).pipe(res);
    return;
  }

  const indexPath = join(distDir, "index.html");
  if (existsSync(indexPath)) {
    res.writeHead(200, {
      "Content-Type": "text/html; charset=utf-8",
    });
    createReadStream(indexPath).pipe(res);
    return;
  }

  res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
  res.end("Run npm run build before starting the production server.");
}

function readJson(req) {
  return new Promise((resolveJson, reject) => {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("error", reject);
    req.on("end", () => {
      try {
        const raw = Buffer.concat(chunks).toString("utf8");
        resolveJson(raw ? JSON.parse(raw) : {});
      } catch (error) {
        reject(error);
      }
    });
  });
}

function sendJson(res, status, payload) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
  });
  res.end(JSON.stringify(payload));
}

