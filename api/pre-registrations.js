import { createPreRegistration } from "../server/pre-registration.mjs";

export const config = {
  maxDuration: 15,
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ error: "Method Not Allowed" });
    return;
  }

  try {
    const body =
      typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};
    const payload = await createPreRegistration(body, process.env, {
      cookie: req.headers.cookie || "",
      onSetCookie: (setCookie) => res.setHeader("Set-Cookie", setCookie),
    });
    res.status(200).json(payload);
  } catch (error) {
    res.status(error.status || 500).json({
      error:
        error instanceof Error
          ? error.message
          : "사전예약 등록 중 오류가 발생했어요.",
    });
  }
}
