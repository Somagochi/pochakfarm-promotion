const MAX_IMAGE_BYTES = 8 * 1024 * 1024;

export async function createClassicV2CardAssets(body, env = process.env) {
  const endpoint = env.CARD_IMAGE_API_URL;
  if (!endpoint) {
    throw httpError(
      500,
      "CARD_IMAGE_API_URL이 서버 환경변수에 설정되어 있지 않아요.",
    );
  }

  const image = typeof body.image === "string" ? body.image : "";
  const name = typeof body.name === "string" ? body.name.trim() : "";
  validateDataImage(image);

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(env.CARD_IMAGE_API_KEY
        ? { Authorization: `Bearer ${env.CARD_IMAGE_API_KEY}` }
        : {}),
    },
    body: JSON.stringify({
      image,
      name,
    }),
  });

  const payload = await readResponseJson(response);
  if (!response.ok) {
    throw httpError(
      response.status,
      payload.error || payload.message || "카드 이미지 서버 요청에 실패했어요.",
    );
  }

  return normalizeCardAssets(payload);
}

function validateDataImage(image) {
  const match = image.match(
    /^data:(image\/(?:png|jpeg|jpg|webp|heic|heif));base64,(.+)$/,
  );
  if (!match) {
    throw httpError(
      400,
      "지원하지 않는 이미지 형식이에요. JPG, PNG, WEBP, HEIC를 사용해주세요.",
    );
  }

  const imageBuffer = Buffer.from(match[2], "base64");
  if (imageBuffer.length > MAX_IMAGE_BYTES) {
    throw httpError(400, "이미지는 8MB 이하로 올려주세요.");
  }
}

async function readResponseJson(response) {
  const text = await response.text();
  if (!text) return {};

  try {
    return JSON.parse(text);
  } catch {
    throw httpError(502, "카드 이미지 서버 응답이 JSON 형식이 아니에요.");
  }
}

function normalizeCardAssets(payload) {
  const cardImage = normalizeImage(
    payload.cardImage || payload.card_image || payload.card,
  );
  const cardBackImage = normalizeImage(
    payload.cardBackImage || payload.card_back_image || payload.cardBack,
  );
  const frameImage = normalizeImage(
    payload.frameImage || payload.frame_image || payload.frame,
  );

  if (!cardImage || !cardBackImage || !frameImage) {
    throw httpError(
      502,
      "카드 이미지 서버 응답에 cardImage, cardBackImage, frameImage가 모두 필요해요.",
    );
  }

  return {
    cardImage,
    cardBackImage,
    frameImage,
  };
}

function normalizeImage(value) {
  if (typeof value !== "string" || !value.trim()) return "";
  const image = value.trim();
  if (image.startsWith("data:image/")) return image;
  if (/^https?:\/\//.test(image)) return image;
  return `data:image/png;base64,${image}`;
}

function httpError(status, message) {
  const error = new Error(message);
  error.status = status;
  return error;
}
