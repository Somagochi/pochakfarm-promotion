import { createClassicV2CardAssets } from "../server/classic-v2-card.mjs";

export const config = {
  maxDuration: 60,
  api: {
    bodyParser: {
      sizeLimit: "10mb",
    },
  },
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
    const payload = await createClassicV2CardAssets(body);
    res.status(200).json(payload);
  } catch (error) {
    res.status(error.status || 500).json({
      error:
        error instanceof Error
          ? error.message
          : "카드 이미지 생성 중 오류가 발생했어요.",
    });
  }
}
