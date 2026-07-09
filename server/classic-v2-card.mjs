const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
const DEFAULT_IMAGE_API_TIMEOUT_MS = 55000;

export async function createClassicV2CardAssets(
  body,
  env = process.env,
  options = {},
) {
  const endpoint = getPublicCharacterizationEndpoint(env.CARD_IMAGE_API_URL);
  if (!endpoint) {
    throw httpError(
      500,
      "CARD_IMAGE_API_URL이 서버 환경변수에 설정되어 있지 않아요.",
    );
  }

  const image = typeof body.image === "string" ? body.image : "";
  const name = typeof body.name === "string" ? body.name.trim() : "";
  if (!name) {
    throw httpError(400, "동물 이름을 입력해주세요.");
  }

  const imageFile = parseDataImage(image);
  const formData = new FormData();
  formData.append(
    "image",
    new Blob([imageFile.buffer], { type: imageFile.mimeType }),
    `character.${imageFile.extension}`,
  );
  formData.append("animalName", name);

  const headers = {
    ...(options.cookie ? { Cookie: options.cookie } : {}),
    ...(env.CARD_IMAGE_API_KEY
      ? { Authorization: `Bearer ${env.CARD_IMAGE_API_KEY}` }
      : {}),
  };

  const timeoutMs =
    Number(env.CARD_IMAGE_API_TIMEOUT_MS) || DEFAULT_IMAGE_API_TIMEOUT_MS;
  let response;
  try {
    response = await fetch(endpoint, {
      method: "POST",
      headers,
      body: formData,
      signal: AbortSignal.timeout(timeoutMs),
    });
  } catch (error) {
    if (error.name === "TimeoutError" || error.name === "AbortError") {
      throw httpError(504, "이미지 변환 서버 응답이 지연되고 있어요.");
    }

    const causeCode =
      error.cause && typeof error.cause.code === "string"
        ? ` (${error.cause.code})`
        : "";
    throw httpError(502, `이미지 변환 서버에 연결할 수 없어요${causeCode}.`);
  }
  const setCookie = readSetCookie(response);
  if (setCookie.length && typeof options.onSetCookie === "function") {
    options.onSetCookie(setCookie);
  }

  const payload = await readResponseJson(response);
  if (!response.ok) {
    const message =
      response.status >= 500
        ? "이미지 변환 서버 에러"
        : payload.error || payload.message || "카드 이미지 서버 요청에 실패했어요.";
    throw httpError(
      response.status,
      message,
    );
  }

  return normalizeCardAssets(payload);
}

export async function getClassicV2CardAssets(
  characterizationId,
  env = process.env,
  options = {},
) {
  const endpoint = getCharacterizationDetailEndpoint(
    env.CARD_IMAGE_API_URL,
    characterizationId,
  );
  if (!endpoint) {
    throw httpError(
      500,
      "CARD_IMAGE_API_URL이 서버 환경변수에 설정되어 있지 않아요.",
    );
  }

  const headers = {
    ...(options.cookie ? { Cookie: options.cookie } : {}),
    ...(env.CARD_IMAGE_API_KEY
      ? { Authorization: `Bearer ${env.CARD_IMAGE_API_KEY}` }
      : {}),
  };
  const timeoutMs =
    Number(env.CARD_IMAGE_API_TIMEOUT_MS) || DEFAULT_IMAGE_API_TIMEOUT_MS;

  let response;
  try {
    response = await fetch(endpoint, {
      method: "GET",
      headers,
      signal: AbortSignal.timeout(timeoutMs),
    });
  } catch (error) {
    if (error.name === "TimeoutError" || error.name === "AbortError") {
      throw httpError(504, "이미지 변환 서버 응답이 지연되고 있어요.");
    }

    const causeCode =
      error.cause && typeof error.cause.code === "string"
        ? ` (${error.cause.code})`
        : "";
    throw httpError(502, `이미지 변환 서버에 연결할 수 없어요${causeCode}.`);
  }

  const setCookie = readSetCookie(response);
  if (setCookie.length && typeof options.onSetCookie === "function") {
    options.onSetCookie(setCookie);
  }

  const payload = await readResponseJson(response);
  if (!response.ok) {
    const message =
      response.status >= 500
        ? "이미지 변환 서버 에러"
        : payload.error || payload.message || "공유 카드 조회에 실패했어요.";
    throw httpError(response.status, message);
  }

  return normalizeCardAssets(payload);
}

function getPublicCharacterizationEndpoint(endpoint) {
  if (!endpoint) return "";
  const trimmed = endpoint.replace(/\/+$/, "");
  return trimmed.endsWith("/public") ? trimmed : `${trimmed}/public`;
}

function getCharacterizationDetailEndpoint(endpoint, characterizationId) {
  if (!endpoint) return "";
  const id = normalizeId(characterizationId);
  if (!id) {
    throw httpError(400, "characterization_id가 필요해요.");
  }

  const baseEndpoint = endpoint.replace(/\/+$/, "").replace(/\/public$/, "");
  return `${baseEndpoint}/${encodeURIComponent(id)}`;
}

function parseDataImage(image) {
  const match = image.match(
    /^data:(image\/(?:png|jpeg|jpg|webp));base64,(.+)$/,
  );
  if (!match) {
    throw httpError(
      400,
      "지원하지 않는 이미지 형식이에요. JPG, PNG, WEBP를 사용해주세요.",
    );
  }

  const imageBuffer = Buffer.from(match[2], "base64");
  if (imageBuffer.length > MAX_IMAGE_BYTES) {
    throw httpError(400, "이미지는 8MB 이하로 올려주세요.");
  }

  const mimeType = match[1] === "image/jpg" ? "image/jpeg" : match[1];
  const extension = mimeType.split("/")[1].replace("jpeg", "jpg");
  return {
    buffer: imageBuffer,
    extension,
    mimeType,
  };
}

function readSetCookie(response) {
  if (typeof response.headers.getSetCookie === "function") {
    return response.headers.getSetCookie();
  }

  const setCookie = response.headers.get("set-cookie");
  return setCookie ? [setCookie] : [];
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
  const record =
    payload && typeof payload === "object"
      ? payload
      : {};
  const data =
    record.data && typeof record.data === "object"
      ? record.data
      : {};
  const characterizationId = normalizeId(
    data.characterization_id ||
      data.characterizationId ||
      record.characterization_id ||
      record.characterizationId,
  );
  const resultImageUrl = normalizeImage(
    record.cardImage ||
      record.card_image ||
      record.card ||
      data.resultImageUrl,
  );
  const cardBackImageUrl = normalizeImage(
    record.cardBackImage ||
      record.card_back_image ||
      record.cardBack ||
      data.cardBackImageUrl,
  );

  if (!resultImageUrl || !cardBackImageUrl) {
    throw httpError(
      502,
      "카드 이미지 서버 응답에 resultImageUrl, cardBackImageUrl이 모두 필요해요.",
    );
  }

  return {
    data: {
      characterization_id: characterizationId,
      resultImageUrl,
      cardBackImageUrl,
    },
    datetime:
      typeof record.datetime === "string"
        ? record.datetime
        : new Date().toISOString(),
  };
}

function normalizeId(value) {
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  if (typeof value !== "string") return "";
  return value.trim();
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
