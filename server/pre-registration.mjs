export async function createPreRegistration(body, env = process.env, options = {}) {
  const endpoint = env.PRE_REGISTRATION_API_URL;
  if (!endpoint) {
    throw httpError(
      500,
      "PRE_REGISTRATION_API_URL이 서버 환경변수에 설정되어 있지 않아요.",
    );
  }

  const phoneNumber =
    typeof body.phoneNumber === "string"
      ? body.phoneNumber.replace(/\D/g, "")
      : "";
  const requiredConsent = body.requiredConsent === true;
  const characterizationId = Number(body.characterizationId);

  if (!/^01\d{8,9}$/.test(phoneNumber)) {
    throw httpError(400, "전화번호를 다시 확인해주세요.");
  }

  if (!requiredConsent) {
    throw httpError(400, "개인정보 수집 및 이용 동의가 필요해요.");
  }

  if (!Number.isSafeInteger(characterizationId) || characterizationId <= 0) {
    throw httpError(400, "characterizationId를 다시 확인해주세요.");
  }

  const formattedPhoneNumber = `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(
    3,
    7,
  )}-${phoneNumber.slice(7, 11)}`;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(options.cookie ? { Cookie: options.cookie } : {}),
    },
    body: JSON.stringify({
      phoneNumber: formattedPhoneNumber,
      requiredConsent,
      characterizationId,
    }),
  });
  const setCookie = readSetCookie(response);
  if (setCookie.length && typeof options.onSetCookie === "function") {
    options.onSetCookie(setCookie);
  }

  const payload = await readResponseJson(response);
  if (!response.ok) {
    const message = isDuplicatePreRegistration(response.status, payload)
      ? "이미 사전 예약이 등록된 번호입니다."
      : response.status >= 500
        ? "서버 에러"
        : payload.message || payload.error || "사전예약 등록에 실패했어요.";
    throw httpError(response.status, message, payload);
  }

  return payload;
}

function isDuplicatePreRegistration(status, payload) {
  const code = typeof payload.code === "string" ? payload.code : "";
  const message =
    typeof payload.message === "string" ? payload.message : "";
  return (
    status === 409 ||
    code.includes("DUPLICATE") ||
    code.includes("ALREADY") ||
    message.includes("중복") ||
    message.includes("이미")
  );
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
    throw httpError(502, "사전예약 서버 응답이 JSON 형식이 아니에요.");
  }
}

function httpError(status, message, payload = {}) {
  const error = new Error(message);
  error.status = status;
  error.payload = payload;
  return error;
}
