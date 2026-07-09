import { getClassicV2CardAssets } from "../../server/classic-v2-card.mjs";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    res.status(405).json({ error: "Method Not Allowed" });
    return;
  }

  try {
    const { characterization_id: characterizationId } = req.query || {};
    const payload = await getClassicV2CardAssets(
      Array.isArray(characterizationId)
        ? characterizationId[0]
        : characterizationId,
      process.env,
      {
        cookie: req.headers.cookie || "",
        onSetCookie: (setCookie) => res.setHeader("Set-Cookie", setCookie),
      },
    );
    res.status(200).json(payload);
  } catch (error) {
    res.status(error.status || 500).json({
      error:
        error instanceof Error
          ? error.message
          : "공유 카드 조회 중 오류가 발생했어요.",
    });
  }
}
