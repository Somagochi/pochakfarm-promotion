const DEFAULT_PRE_REGISTRATION_API_URL =
  "http://13.209.190.156/api/pre-registrations";

export async function createPreRegistration(body, env = process.env, options = {}) {
  const endpoint =
    env.PRE_REGISTRATION_API_URL || DEFAULT_PRE_REGISTRATION_API_URL;
  const phoneNumber =
    typeof body.phoneNumber === "string"
      ? body.phoneNumber.replace(/\D/g, "")
      : "";
  const requiredConsent = body.requiredConsent === true;

  if (!/^01\d{8,9}$/.test(phoneNumber)) {
    throw httpError(400, "전화번호를 다시 확인해주세요.");
  }

  if (!requiredConsent) {
    throw httpError(400, "개인정보 수집 및 이용 동의가 필요해요.");
  }

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(options.cookie ? { Cookie: options.cookie } : {}),
    },
    body: JSON.stringify({
      phoneNumber,
      requiredConsent,
    }),
  });
  const setCookie = readSetCookie(response);
  if (setCookie.length && typeof options.onSetCookie === "function") {
    options.onSetCookie(setCookie);
  }

  const payload = await readResponseJson(response);
  if (!response.ok) {
    const message =
      response.status >= 500
        ? "서버 에러"
        : isDuplicatePreRegistration(response.status, payload)
        ? "이미 사전예약이 등록된 번호입니다."
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
