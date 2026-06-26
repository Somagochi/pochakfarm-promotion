import { createServer } from "node:http";
import { createReadStream, existsSync, readFileSync } from "node:fs";
import { extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

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
    if (req.method === "POST" && req.url === "/api/pixel-runner") {
      await handlePixelRunner(req, res);
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

async function handlePixelRunner(req, res) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    sendJson(res, 500, {
      error: "OPENAI_API_KEY가 서버 환경변수에 설정되어 있지 않아요.",
    });
    return;
  }

  const body = await readJson(req);
  const image = typeof body.image === "string" ? body.image : "";
  const name = typeof body.name === "string" ? body.name : "";

  const match = image.match(/^data:(image\/(?:png|jpeg|heic|heif));base64,(.+)$/);
  if (!match) {
    sendJson(res, 400, {
      error: "지원하지 않는 이미지 형식이에요. JPG, PNG, HEIC를 사용해주세요.",
    });
    return;
  }

  const [, mimeType, base64] = match;
  const imageBuffer = Buffer.from(base64, "base64");
  if (imageBuffer.length > 8 * 1024 * 1024) {
    sendJson(res, 400, {
      error: "이미지는 8MB 이하로 올려주세요.",
    });
    return;
  }

  const sourceFile = new Blob([imageBuffer], { type: mimeType });
  const form = new FormData();
  form.append("model", process.env.OPENAI_IMAGE_MODEL || "gpt-image-1");
  form.append("image", sourceFile, fileNameFor(mimeType));
  form.append("size", "1024x1024");
  form.append("quality", "low");
  form.append("background", "transparent");
  form.append(
    "prompt",
    [
      "Transform the provided animal photo into a single cute 16-bit pixel art game sprite.",
      "Remove the background completely and return a transparent PNG.",
      "Keep the animal recognizable from the source photo.",
      "Make it side-facing, cheerful, and suitable for a looping running animation.",
      "Use clean crisp pixel edges, no text, no frame, no shadow, no ground, no extra objects.",
      name ? `The character name is ${name}; do not render the name in the image.` : "",
    ]
      .filter(Boolean)
      .join(" "),
  );

  const response = await fetch("https://api.openai.com/v1/images/edits", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
    body: form,
  });

  const payload = await response.json();
  if (!response.ok) {
    sendJson(res, response.status, {
      error:
        payload.error?.message ||
        "OpenAI 이미지 변환 요청에 실패했어요.",
    });
    return;
  }

  const b64 = payload.data?.[0]?.b64_json;
  if (!b64) {
    sendJson(res, 502, {
      error: "OpenAI 응답에서 이미지를 찾지 못했어요.",
    });
    return;
  }

  sendJson(res, 200, {
    image: `data:image/png;base64,${b64}`,
  });
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

function fileNameFor(mimeType) {
  if (mimeType === "image/png") return "animal.png";
  if (mimeType === "image/heic") return "animal.heic";
  if (mimeType === "image/heif") return "animal.heif";
  return "animal.jpg";
}
