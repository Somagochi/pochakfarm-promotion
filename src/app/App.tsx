import {
  useState,
  useRef,
  useEffect,
  useLayoutEffect,
  useCallback,
} from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { XIcon } from "lucide-react";
import { trackEvent } from "../analytics";
import imgBtnSmall from "../assets/ui/btn-sm.png";
import imgBtnSmall2 from "../assets/ui/btn-sm-2.png";
import imgBtnSmall3 from "../assets/ui/btn-sm-3.png";
import imgBtnLg from "../assets/ui/btn-lg.png";
import imgBtnLgActive from "../assets/ui/btn-lg-active.png";
import imgBtnNext from "../assets/ui/btn-next.png";
import imgBtnShare from "../assets/ui/btn-share.png";
import imgBtnAlrim from "../assets/ui/btn-alrim.png";
import imgBtnNew from "../assets/ui/btn-new.png";
import imgBtnOpenAlertLg from "../assets/ui/btn-open-alert-lg.png";
import imgBtnBragLg from "../assets/ui/btn-brag-lg.png";
import imgBtnCaptureTooLg from "../assets/ui/btn-capture-too-lg.png";
import imgBtnContentRight from "../assets/ui/btn-contents-right2.png";
import imgIntroBg from "../assets/ui/intro-bg.png";
import imgIntroHeader from "../assets/ui/intro-header.png";
import imgIntroHero from "../assets/ui/intro-hero.png";
import imgIntroCountdownPanel from "../assets/ui/intro-countdown-panel.png";
import imgIntroEnjoyTitle from "../assets/ui/intro-enjoy-title.png";
import imgIntroTryTitle from "../assets/ui/intro-try-title.png";
import imgIntroLimitedText from "../assets/ui/intro-limited-text.png";
import imgIntroRewardText from "../assets/ui/intro-reward-text.png";
import imgIntroImageGuideButton from "../assets/ui/intro-image-guide-button.png";
import imgImageGuideModal from "../assets/ui/image-guide-modal.png";
import imgIntroFooter from "../assets/ui/intro-footer.png";
import imgCtaImageSaveButton from "../assets/ui/cta-image-save-button.png";
import imgCtaRewardCard from "../assets/ui/cta-reward-card.png";
import imgCompleteNoticeCard from "../assets/ui/complete-notice-card.png";
import imgToastPrimary from "../assets/ui/primary.png";
import imgModalWindowBottom from "../assets/ui/modal-window-bottom.png";
import imgModalWindowMiddle from "../assets/ui/modal-window-middle.png";
import imgModalWindowTop from "../assets/ui/modal-window-top.png";
import imgCutScissors from "../assets/ui/cut-scissors.png";
import imgRequiredPrivacyConsent from "../assets/ui/required-privacy-consent.png";
import imgPrivacyRetentionNotice from "../assets/ui/privacy-retention-notice.png";
import imgRegistrationModalHeading from "../assets/ui/registration-modal-heading.png";

// ── Assets ───────────────────────────────────────────────────
// Window frame & background
import imgWindowFrame from "../imports/2200포착-7/108ae8a314a7a2e9b63e414d76ece9745e28c566.png";
import imgBgPattern from "../imports/2200포착-7/4311a10c440eedcb0e4c56218bd12a85d491cf55.png";

// Pixel button 9-slice
import imgCornerTL from "../imports/2200포착-7/b2d3cdf139cdf00a3868ad4bf7ad407155c4e712.png";
import imgEdgeTop from "../imports/2200포착-7/2a37d1c8e1884edd8873126424b8e4896d3439be.png";
import imgCornerTR from "../imports/2200포착-7/a70d390cf0db9155695951c0746ffb2b5ab71f9e.png";
import imgEdgeLeft from "../imports/2200포착-7/6494727c53b0593f8a0217ff11bc3fbb2961f99d.png";
import imgCornerBLa from "../imports/2200포착-7/3d3a19f469d5ccfafe7c53f4a4b5e0c865b56008.png";
import imgCornerBLb from "../imports/2200포착-7/4e013676febbb1c8d774637eb5341c31077215e8.png";
import imgEdgeBot from "../imports/2200포착-7/1e2ded9ef440b7f889fcfee3c5936e0f36da63c2.png";
import imgCornerBR from "../imports/2200포착-7/38b961cc3cce7fcaa6c20191eb623633d23043b4.png";

// Sliced card-pack pieces
import imgCardPackTop from "../assets/ui/card-pack-top.png";
import imgCardPackBottom from "../assets/ui/card-pack-bottom.png";

// Dog pixel-art SVG component (inline JSX — avoids SVG file import issues)
import FigmaDog from "../imports/Frame427322333/index";

// Card back (blue paw pattern) — 포착-15
import imgCardBack from "../imports/2200포착-15/821d88e38d85900010c4a712995d90bbfd340da7.png";
// Character card front
import imgCharFront from "../imports/image-2.png";

// Footer decoration — 포착-11
import imgFoot3 from "../imports/2200포착-11/083b0a224f1e9b9660edf055c3e923f3c96b2aac.png";
import imgFoot4 from "../imports/2200포착-11/275bb331fb3bee58e979e341b101d5d736367264.png";
import imgFoot5 from "../imports/2200포착-11/edb1471405b6ca6dffee78680c6cd49cbefde555.png";

// ── Constants ────────────────────────────────────────────────
const ACCEPTED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);
const MAX_UPLOAD_IMAGE_DIMENSION = 1280;
const UPLOAD_IMAGE_QUALITY = 0.82;
const NAME_FILTER = /[^ㄱ-ㅎ가-힣a-zA-Z0-9\s]/g;
const SHARE_BUTTON_FRAME_FILTER =
  "brightness(0) saturate(100%) invert(88%) sepia(13%) saturate(418%) hue-rotate(356deg) brightness(95%) contrast(88%)";
const SHARE_LINK_ORIGIN = (
  import.meta.env.VITE_SHARE_LINK_ORIGIN || window.location.origin
).replace(/\/+$/, "");

type GeneratedCardAssets = {
  cardImage: string;
  cardBackImage: string;
  characterizationId?: string;
};

type CharacterizationResponse = {
  characterizationId: string;
  status: string;
  cardType: string;
  resultImageUrl: string;
  failureReason: string | null;
};

function formatApiErrorPayload(payload: unknown) {
  if (!payload || typeof payload !== "object") {
    return String(payload ?? "");
  }

  const record = payload as Record<string, unknown>;
  const hasStandardErrorShape =
    "timestamp" in record ||
    "status" in record ||
    "code" in record ||
    "message" in record;

  if (!hasStandardErrorShape) {
    return JSON.stringify(payload, null, 2);
  }

  return JSON.stringify(
    {
      timestamp: record.timestamp,
      status: record.status,
      code: record.code,
      message: record.message,
    },
    null,
    2,
  );
}

function getApiErrorMessage(payload: unknown) {
  if (typeof payload === "string") return payload;
  if (!payload || typeof payload !== "object") {
    return String(payload ?? "요청에 실패했어요.");
  }

  const record = payload as Record<string, unknown>;
  if (typeof record.message === "string") return record.message;
  if (typeof record.error === "string") return record.error;
  return JSON.stringify(payload, null, 2);
}

const FALLBACK_CARD_ASSETS: GeneratedCardAssets = {
  cardImage: imgCharFront,
  cardBackImage: "/assets/card-back-ground.png",
};
const CARD_BACK_IMAGES_BY_TYPE: Record<string, string> = {
  GROUND: "/assets/card-back-ground.png",
  SKY: "/assets/card-back-sky.png",
  SPACE: "/assets/card-back-space.png",
  SEA: "/assets/card-back-sea.png",
};
const CHARACTERIZATION_POLL_INTERVAL_MS = 2000;

const ONBOARDING_SLIDES = [
  "/assets/carousel1.png",
  "/assets/carousel2.png",
  "/assets/carousel3.png",
  "/assets/carousel4.png",
];
const LAUNCH_TARGET_TIME = new Date("2026-08-01T00:00:00+09:00").getTime();
const PROCESSING_ANALYZING_PROMPT_IMAGE =
  "/assets/processing-analyzing-prompt.png";
const PROCESSING_SELECTING_PROMPT_IMAGE =
  "/assets/processing-selecting-prompt.png";
const PROCESSING_SELECTING_TEXT_BOTTOM_RATIO = 149 / 250;
const PROCESSING_SELECTING_IMAGE_GAP = 90.98;
const CARD_PACK_OPEN_PROMPT_IMAGE = "/assets/card-pack-open-prompt.png";
const CARD_PACK_CUT_PROMPT_IMAGE = "/assets/card-pack-cut-prompt.png";
const CARD_GENERATION_FINISHING_PROMPT_IMAGE =
  "/assets/card-generation-finishing-prompt.png";
const CHOOSE_ONE_PROMPT_IMAGE = "/assets/choose-one-prompt.png";
const CHOOSE_ONE_PROMPT_TEXT_BOTTOM_RATIO = 149 / 250;
const CARD_PACK_FRONT_IMAGE = "/assets/card-pack-front.png";
const CARD_PACK_BACK_IMAGE = "/assets/card-pack-back.png";
const SCANNER_LOTTIE = "/assets/scanner.lottie";
const CARD_SELECT_FRONT_DELAYS = [
  0, 500, 1000, 1500, 1998.798, 2500, 2998.798, 3497.596, 3998.798,
  4497.596, 4996.394, 5493.988, 5996.394, 6750, 7500, 8250,
];
const CARD_SELECT_FRONT_NEIGHBOR_DELAY = 8993.739;
const CARD_SELECT_BACK_DELAYS = [
  1300, 1800, 2300, 2798.798, 3298.798, 3800, 4297.596, 4800, 5300,
  5797.596, 6300, 7050, 7800, 8550, 9300,
];
const SCAN_STAGE_DURATION_MS = 8000;
const CARD_SELECT_STAGE_DURATION_MS = 10500;
const PROCESSING_MIN_DURATION_MS =
  SCAN_STAGE_DURATION_MS + CARD_SELECT_STAGE_DURATION_MS;

const KEYFRAMES = `
  @keyframes float      { 0%,100%{transform:translateY(0)}   50%{transform:translateY(-10px)} }
  @keyframes wobble     { 0%,100%{transform:rotate(-1.5deg)} 50%{transform:rotate(1.5deg)} }
  @keyframes spotlight  { 0%,100%{opacity:0.7}              50%{opacity:1} }
  @keyframes dogBreath  { 0%,100%{opacity:1}                50%{opacity:0.12} }
  @keyframes softPulse  { 0%,100%{transform:scale(1)}        50%{transform:scale(1.05)} }
  @keyframes textShimmer { 0%{background-position:220% 0} 100%{background-position:-120% 0} }
  @keyframes circularLoader { to{transform:rotate(360deg)} }
  @keyframes cardFrontSweep {
    0%{opacity:.8;transform:translate3d(-277px,-27px,0) rotate(5deg) scale(.6,.8)}
    50%{opacity:1;transform:translate3d(0,0,0) rotate(0deg) scale(1.5)}
    100%{opacity:.8;transform:translate3d(278px,-27px,0) rotate(-5deg) scale(.6,.8)}
  }
  @keyframes cardBackSweep {
    0%{opacity:.2;transform:translate3d(278px,30px,0) rotate(5deg) scale(.6,.8)}
    50%{opacity:.3;transform:translate3d(0,0,0) rotate(0deg) scale(.6)}
    100%{opacity:.2;transform:translate3d(-277px,30px,0) rotate(-5deg) scale(.6,.8)}
  }
  @keyframes cardFrontFinal {
    0%{opacity:.8;transform:translate3d(-277px,-27px,0) rotate(5deg) scale(.6,.8)}
    61.7%{opacity:1;transform:translate3d(0,0,0) rotate(0deg) scale(1.5)}
    100%{opacity:1;transform:translate3d(0,0,0) rotate(0deg) scale(1.522)}
  }
  @keyframes packReadyMotion {
    0%{transform:translate(0,0) rotate(0deg) scale(1)}
    16.67%{transform:translate(4px,-22px) rotate(1deg) scale(1.1)}
    33.36%{transform:translate(1px,21px) rotate(-4.05deg) scale(1.1)}
    50.01%{transform:translate(4px,-22px) rotate(1deg) scale(1.1)}
    66.68%{transform:translate(1px,21px) rotate(-4.05deg) scale(1.1)}
    79.99%{transform:translate(4px,-22px) rotate(1deg) scale(1.1)}
    100%{transform:translate(0,0) rotate(0deg) scale(1)}
  }
  @keyframes packPromptMotion {
    0%{opacity:0;transform:translateX(0) scale(.5)}
    16.67%{opacity:1;transform:translateX(0) scale(1.1)}
    33.36%{opacity:1;transform:translateX(17px) scaleX(.81)}
    50%{opacity:1;transform:translateX(-9px) scaleX(1)}
    66.68%{opacity:1;transform:translateX(19px) scaleX(.81)}
    79.99%{opacity:1;transform:translateX(-9px) scaleX(1)}
    100%{opacity:1;transform:translateX(0) scale(1)}
  }
  @keyframes cutGuideBlink {
    0%,20%,40%,100%{opacity:1}
    10%,30%{opacity:.3}
  }
  @keyframes cutHandlePulse {
    0%,100%{transform:translate(-50%,-50%) scale(1)}
    50%{transform:translate(-50%,-50%) scale(1.12)}
  }
  @keyframes packTopTear {
    0%,7.5%{transform:rotate(0deg);opacity:1}
    12.46%{transform:rotate(10deg);opacity:1}
    25%,100%{transform:rotate(30deg);opacity:0}
  }
  @keyframes packSeamSparkle {
    0%{transform:translate(-50%,-50%) rotate(0deg) scale(0);opacity:0}
    35%{transform:translate(-50%,-50%) rotate(45deg) scale(1);opacity:1}
    100%{transform:translate(-50%,-50%) rotate(90deg) scale(0);opacity:0}
  }
  @keyframes burstParticle {
    0%{transform:translate(0,0) scale(0);opacity:0}
    10%{transform:translate(var(--burst-x),var(--burst-y)) scale(1);opacity:1}
    15%{transform:translate(var(--burst-x),var(--burst-y)) scale(1);opacity:1}
    25%,100%{transform:translate(var(--burst-x2),var(--burst-y2)) scale(0);opacity:0}
  }
  @keyframes revealCardLaunch {
    0%{transform:translate(var(--start-x),35px) rotate(var(--start-r)) scale(1);opacity:1}
    20%{transform:translate(var(--bump-x),18px) rotate(0deg) scale(1);opacity:1}
    100%{transform:translate(var(--end-x),-790px) rotate(0deg) scaleY(.9);opacity:1}
  }
  @keyframes packBodyExit {
    0%,87.54%{translate:0 0}
    92.53%,100%{translate:0 390px}
  }
  @keyframes cardSkyArrive {
    0%{left:50%;top:50%;transform:translate(-50%,-50%) scale(.01);opacity:0}
    33%{left:50%;top:50%;transform:translate(-50%,-50%) scale(1.875);opacity:1}
    50%{transform:translate(-50%,-50%) scale(1.625);opacity:1}
    64%{transform:translate(-50%,-50%) scale(1.75);opacity:1}
    81%{transform:translate(-50%,-50%) scale(.875);opacity:1}
    100%{left:var(--sky-x);top:var(--sky-y);transform:translate(-50%,-50%) scale(1);opacity:1}
  }
  @keyframes cardSkySpin {
    0%{transform:rotate(120deg) skewY(30deg)}
    55%{transform:rotate(0deg) skewY(0deg)}
    100%{transform:rotate(0deg) skewY(0deg)}
  }
`;

type Phase = "idle" | "processing" | "pack" | "dim" | "result";
type ConversionStatus = "idle" | "pending" | "success" | "error";

function getLaunchCountdown() {
  const remainingSeconds = Math.max(
    0,
    Math.floor((LAUNCH_TARGET_TIME - Date.now()) / 1000),
  );
  const days = Math.floor(remainingSeconds / 86400);
  const hours = Math.floor((remainingSeconds % 86400) / 3600);
  const minutes = Math.floor((remainingSeconds % 3600) / 60);
  const seconds = remainingSeconds % 60;

  return { days, hours, minutes, seconds };
}

function formatCountdownUnit(value: number) {
  return String(value).padStart(2, "0");
}

async function copyShareLink(url = window.location.href) {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(url);
      return true;
    } catch {
      // Fall through to the textarea fallback below.
    }
  }

  const textarea = document.createElement("textarea");
  textarea.value = url;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  textarea.style.top = "0";
  document.body.appendChild(textarea);
  textarea.select();
  textarea.setSelectionRange(0, textarea.value.length);

  try {
    return document.execCommand("copy");
  } finally {
    document.body.removeChild(textarea);
  }
}

function createCtaShareLink(characterizationId?: string | null) {
  if (!characterizationId) return window.location.href;

  const url = new URL(
    `/share/characterizations/${encodeURIComponent(characterizationId)}`,
    SHARE_LINK_ORIGIN,
  );
  return url.toString();
}

function getSharedCharacterizationId(searchParams: URLSearchParams) {
  const pathMatch = window.location.pathname.match(
    /^\/share\/characterizations\/([^/]+)\/?$/,
  );
  const pathCharacterizationId = pathMatch?.[1]
    ? decodeURIComponent(pathMatch[1])
    : "";
  return pathCharacterizationId || searchParams.get("characterization_id") || "";
}

function getGeneratedCardAssets(payload: unknown): GeneratedCardAssets {
  const record =
    payload && typeof payload === "object"
      ? (payload as Record<string, unknown>)
      : {};
  const data =
    record.data && typeof record.data === "object"
      ? (record.data as Record<string, unknown>)
      : {};
  const characterizationId =
    typeof data.characterizationId === "string"
      ? data.characterizationId
      : typeof data.characterizationId === "number"
        ? String(data.characterizationId)
        : typeof record.characterizationId === "string"
          ? record.characterizationId
          : typeof record.characterizationId === "number"
            ? String(record.characterizationId)
            : typeof data.characterization_id === "string"
              ? data.characterization_id
              : typeof record.characterization_id === "string"
                ? record.characterization_id
                : "";
  const cardType =
    typeof data.cardType === "string"
      ? data.cardType.toUpperCase()
      : typeof record.cardType === "string"
        ? record.cardType.toUpperCase()
        : "";

  return {
    cardImage:
      typeof data.resultImageUrl === "string"
        ? data.resultImageUrl
        : FALLBACK_CARD_ASSETS.cardImage,
    cardBackImage:
      typeof data.cardBackImageUrl === "string"
        ? data.cardBackImageUrl
        : getCardBackImage(cardType),
    ...(characterizationId
      ? { characterizationId }
      : {}),
  };
}

function getCharacterizationResponse(payload: unknown): CharacterizationResponse {
  const record =
    payload && typeof payload === "object"
      ? (payload as Record<string, unknown>)
      : {};
  const data =
    record.data && typeof record.data === "object"
      ? (record.data as Record<string, unknown>)
      : {};
  const rawId = data.characterizationId ?? data.characterization_id;

  return {
    characterizationId:
      typeof rawId === "number"
        ? String(rawId)
        : typeof rawId === "string"
          ? rawId
          : "",
    status: typeof data.status === "string" ? data.status.toUpperCase() : "",
    cardType:
      typeof data.cardType === "string" ? data.cardType.toUpperCase() : "",
    resultImageUrl:
      typeof data.resultImageUrl === "string" ? data.resultImageUrl : "",
    failureReason:
      typeof data.failureReason === "string" ? data.failureReason : null,
  };
}

function getCardBackImage(cardType: string) {
  return CARD_BACK_IMAGES_BY_TYPE[cardType] ?? FALLBACK_CARD_ASSETS.cardBackImage;
}

function waitForPollInterval(signal: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    const handleAbort = () => {
      window.clearTimeout(timer);
      reject(new DOMException("Aborted", "AbortError"));
    };
    const timer = window.setTimeout(() => {
      signal.removeEventListener("abort", handleAbort);
      resolve();
    }, CHARACTERIZATION_POLL_INTERVAL_MS);
    signal.addEventListener("abort", handleAbort, { once: true });
  });
}

function getCardDownloadName(characterName: string) {
  const safeName = (characterName || "character")
    .replace(/[\\/:*?"<>|]/g, "")
    .replace(/\s+/g, "-")
    .trim();
  return `${safeName || "character"}-card.png`;
}

function triggerBlobDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.rel = "noopener";
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  window.setTimeout(() => URL.revokeObjectURL(url), 1200);
}

function openImageFallback(imageUrl: string) {
  window.open(imageUrl, "_blank", "noopener,noreferrer");
}

function isMobileBrowser() {
  return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

async function saveCardImage(imageUrl: string, characterName: string) {
  const filename = getCardDownloadName(characterName);
  // data: URIs are already local — routing them through the proxy would
  // blow past the server's URL/header size limit for larger images.
  const downloadUrl = imageUrl.startsWith("data:")
    ? imageUrl
    : "/api/download-image?url=" +
      encodeURIComponent(imageUrl) +
      "&name=" +
      encodeURIComponent(characterName || "character-card");

  let response: Response;
  try {
    response = await fetch(downloadUrl);
  } catch {
    openImageFallback(imageUrl);
    return;
  }

  if (!response.ok) {
    openImageFallback(imageUrl);
    return;
  }

  const blob = await response.blob();
  const file = new File([blob], filename, {
    type: blob.type || "image/png",
  });
  const sharePayload = {
    files: [file],
    title: filename,
  };

  if (isMobileBrowser() && navigator.canShare?.(sharePayload)) {
    try {
      await navigator.share(sharePayload);
      return;
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }
    }
  }

  // Web Share API isn't available (older mobile browsers) — the <a download>
  // trick below is silently ignored by Safari/iOS, so navigate directly to
  // the attachment response instead of pretending it worked.
  if (isMobileBrowser()) {
    window.location.assign(downloadUrl);
    return;
  }

  try {
    triggerBlobDownload(blob, filename);
  } catch {
    openImageFallback(imageUrl);
  }
}

async function createUploadPreview(file: File) {
  const sourceUrl = URL.createObjectURL(file);

  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error("이미지를 읽지 못했어요."));
      img.src = sourceUrl;
    });

    const scale = Math.min(
      1,
      MAX_UPLOAD_IMAGE_DIMENSION / Math.max(image.width, image.height),
    );
    const width = Math.max(1, Math.round(image.width * scale));
    const height = Math.max(1, Math.round(image.height * scale));
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    if (!context) {
      throw new Error("이미지를 처리하지 못했어요.");
    }

    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, width, height);
    context.drawImage(image, 0, 0, width, height);
    return canvas.toDataURL("image/jpeg", UPLOAD_IMAGE_QUALITY);
  } finally {
    URL.revokeObjectURL(sourceUrl);
  }
}

// ── PixelButton ──────────────────────────────────────────────
function PawMark({ color }: { color: string }) {
  return (
    <span
      className="pointer-events-none absolute right-[30px] top-1/2 z-[3] h-[18px] w-[18px] -translate-y-1/2"
      aria-hidden="true"
      style={{
        backgroundColor: color,
        maskImage: `url("${imgBtnContentRight}")`,
        maskPosition: "center",
        maskRepeat: "no-repeat",
        maskSize: "contain",
        WebkitMaskImage: `url("${imgBtnContentRight}")`,
        WebkitMaskPosition: "center",
        WebkitMaskRepeat: "no-repeat",
        WebkitMaskSize: "contain",
      }}
    />
  );
}

function PixelCreamFrame({
  children,
  className = "w-full",
  height = 60,
  disabled = false,
  onClick,
  role,
  borderColor = "#8f7755",
  borderWidth = 2,
}: {
  children: React.ReactNode;
  className?: string;
  height?: number;
  disabled?: boolean;
  onClick?: () => void;
  role?: string;
  borderColor?: string;
  borderWidth?: number;
}) {
  return (
    <div
      onClick={disabled ? undefined : onClick}
      className={`relative ${className}`}
      style={{
        height,
        background: borderColor,
        clipPath:
          "polygon(5px 0, calc(100% - 5px) 0, 100% 5px, 100% calc(100% - 5px), calc(100% - 5px) 100%, 5px 100%, 0 calc(100% - 5px), 0 5px)",
        cursor: disabled ? "not-allowed" : onClick ? "pointer" : "default",
        opacity: disabled ? 0.4 : 1,
      }}
      role={role}
      aria-disabled={disabled || undefined}
    >
      <div
        className="absolute"
        style={{
          inset: borderWidth,
          background: "#faf5eb",
          clipPath:
            "polygon(3px 0, calc(100% - 3px) 0, 100% 3px, 100% calc(100% - 3px), calc(100% - 3px) 100%, 3px 100%, 0 calc(100% - 3px), 0 3px)",
        }}
      />
      <div
        className="absolute bottom-[3px] left-[7px] right-[7px] h-[4px]"
        style={{
          background: "#e9dfc8",
          display: borderWidth === 1 && borderColor === "#000000" ? "none" : undefined,
        }}
      />
      <div className="relative z-10 flex h-full w-full items-center justify-center">
        {children}
      </div>
    </div>
  );
}

function PixelButton({
  onClick,
  disabled,
  children,
  variant = "primary",
  showPaw = false,
  frameFilter,
  centerColor,
  textColor,
  pawColor,
  imageSrc,
  imageTintColor,
  ariaLabel,
}: {
  onClick?: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  showPaw?: boolean;
  frameFilter?: string;
  centerColor?: string;
  textColor?: string;
  pawColor?: string;
  imageSrc?: string;
  imageTintColor?: string;
  ariaLabel?: string;
}) {
  const isSecondary = variant === "secondary";
  const resolvedFrameFilter = frameFilter ?? (isSecondary
    ? "brightness(0) saturate(100%)"
    : undefined);
  const centerBg = centerColor ?? (isSecondary ? "#faf5eb" : "#36501e");
  const resolvedTextColor = textColor ?? (isSecondary ? "#68553e" : "white");
  const resolvedPawColor = pawColor ?? (isSecondary ? "#e3d5bd" : "#78985a");
  const frameSize = "12px";
  const gridTemplate = `${frameSize} 1fr ${frameSize}`;
  const pressMotionClass = disabled
    ? "transition-opacity"
    : "transition-[transform,filter,opacity] duration-100 ease-out active:translate-y-[2px] active:scale-[0.98] active:brightness-[0.96] motion-reduce:transition-none motion-reduce:active:translate-y-0 motion-reduce:active:scale-100";

  if (imageSrc) {
    return (
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className={`relative h-[60px] w-[280px] cursor-pointer select-none overflow-hidden will-change-transform disabled:cursor-not-allowed disabled:opacity-40 ${pressMotionClass}`}
        aria-label={ariaLabel}
      >
        <img
          src={imageSrc}
          alt=""
          className="pointer-events-none absolute inset-0 h-full w-full object-fill"
          draggable={false}
        />
        {imageTintColor && (
          <span
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundColor: imageTintColor,
              mixBlendMode: "multiply",
              maskImage: `url("${imageSrc}")`,
              maskPosition: "center",
              maskRepeat: "no-repeat",
              maskSize: "100% 100%",
              WebkitMaskImage: `url("${imageSrc}")`,
              WebkitMaskPosition: "center",
              WebkitMaskRepeat: "no-repeat",
              WebkitMaskSize: "100% 100%",
            }}
          />
        )}
      </button>
    );
  }

  if (isSecondary) {
    return (
      <div
        onClick={disabled ? undefined : onClick}
        className={`relative h-[60px] w-[284px] ${pressMotionClass}`}
        style={{
          background: "#DCCCAE",
          clipPath:
            "polygon(6px 0, calc(100% - 6px) 0, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0 calc(100% - 6px), 0 6px)",
          cursor: disabled ? "not-allowed" : "pointer",
          opacity: disabled ? 0.4 : 1,
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            background: "#DCCCAE",
            clipPath:
              "polygon(6px 0, calc(100% - 6px) 0, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0 calc(100% - 6px), 0 6px)",
          }}
        />
        <div
          className="absolute bottom-[3px] left-[2px] right-[2px] top-[2px]"
          style={{
            background: "#FAF5EB",
            clipPath:
              "polygon(3px 0, calc(100% - 3px) 0, 100% 3px, 100% calc(100% - 3px), calc(100% - 3px) 100%, 3px 100%, 0 calc(100% - 3px), 0 3px)",
          }}
        />
        <div
          className="relative z-[2] flex h-full w-full items-center justify-center text-center text-[16px] tracking-[1.2px]"
          style={{
            color: "#68553E",
            fontFamily: "Elice DX Neolli",
            fontWeight: 500,
          }}
        >
          {children}
        </div>
        {showPaw && <PawMark color="#DCCCAE" />}
      </div>
    );
  }

  return (
    <div
      onClick={disabled ? undefined : onClick}
      className={`relative grid w-[280px] h-[60px] ${pressMotionClass}`}
      style={{
        gridTemplateColumns: gridTemplate,
        gridTemplateRows: gridTemplate,
        opacity: disabled ? 0.4 : 1,
        cursor: disabled ? "not-allowed" : "pointer",
      }}
    >
      <div className="overflow-clip relative" style={{ width: frameSize, height: frameSize }}>
        <img
          src={imgCornerTL}
          alt=""
          className="absolute inset-0 size-full object-cover pointer-events-none"
          style={{ filter: resolvedFrameFilter }}
        />
      </div>
      <div
        className="overflow-clip relative"
        style={{
          height: frameSize,
          backgroundImage: `url("${imgEdgeTop}")`,
          backgroundSize: `${frameSize} ${frameSize}`,
          backgroundPosition: "top left",
          filter: resolvedFrameFilter,
        }}
      />
      <div className="overflow-clip relative" style={{ width: frameSize, height: frameSize }}>
        <img
          src={imgCornerTR}
          alt=""
          className="absolute inset-0 size-full object-cover pointer-events-none"
          style={{ filter: resolvedFrameFilter }}
        />
      </div>
      <div
        className="overflow-clip relative"
        style={{
          width: frameSize,
          backgroundImage: `url("${imgEdgeLeft}")`,
          backgroundSize: `${frameSize} ${frameSize}`,
          backgroundPosition: "top left",
          filter: resolvedFrameFilter,
        }}
      />
      <div
        className="relative z-[2] flex items-center justify-center"
        style={{ background: centerBg }}
      >
        <div
          className="flex h-full w-full items-center justify-center text-center text-[16px] tracking-[1.2px]"
          style={{
            fontFamily: "Elice DX Neolli",
            fontWeight: 500,
            color: resolvedTextColor,
          }}
        >
          {children}
        </div>
      </div>
      <div
        className="overflow-clip relative"
        style={{
          width: frameSize,
          backgroundImage: `url("${imgEdgeLeft}")`,
          backgroundSize: `${frameSize} ${frameSize}`,
          backgroundPosition: "top left",
          transform: "scaleY(-1) rotate(180deg)",
          filter: resolvedFrameFilter,
        }}
      />
      <div className="overflow-clip relative" style={{ width: frameSize, height: frameSize }}>
        <img
          src={imgCornerBLb}
          alt=""
          className="absolute inset-0 size-full object-cover pointer-events-none"
          style={{ filter: resolvedFrameFilter }}
        />
        <img
          src={imgCornerBLa}
          alt=""
          className="absolute inset-0 size-full object-cover pointer-events-none"
          style={{ filter: resolvedFrameFilter }}
        />
      </div>
      <div
        className="overflow-clip relative"
        style={{
          height: frameSize,
          backgroundImage: `url("${imgEdgeBot}")`,
          backgroundSize: `${frameSize} ${frameSize}`,
          backgroundPosition: "top left",
          filter: resolvedFrameFilter,
        }}
      />
      <div className="overflow-clip relative" style={{ width: frameSize, height: frameSize }}>
        <img
          src={imgCornerBR}
          alt=""
          className="absolute inset-0 size-full object-cover pointer-events-none"
          style={{ filter: resolvedFrameFilter }}
        />
      </div>
      {showPaw && <PawMark color={resolvedPawColor} />}
    </div>
  );
}

// ── WindowPanel ──────────────────────────────────────────────
function WindowPanel({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col w-full">
      <div
        className="relative w-full shrink-0 overflow-hidden"
        style={{ aspectRatio: "331 / 81" }}
      >
        <img
          src={imgModalWindowTop}
          alt=""
          className="absolute inset-0 size-full object-fill pointer-events-none"
        />
      </div>
      <div className="relative -mt-[2px] w-full overflow-hidden shrink-0">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img
            src={imgModalWindowMiddle}
            alt=""
            className="absolute inset-0 size-full object-fill"
          />
        </div>
        <div className="relative z-10">{children}</div>
      </div>
      <div
        className="relative -mt-[2px] w-full shrink-0 overflow-hidden"
        style={{ aspectRatio: "331 / 39" }}
      >
        <img
          src={imgModalWindowBottom}
          alt=""
          className="absolute inset-0 size-full object-fill pointer-events-none"
        />
      </div>
    </div>
  );
}

// ── AnimatedPanel ─────────────────────────────────────────────
function AnimatedPanel({
  visible,
  children,
}: {
  visible: boolean;
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (visible && !mounted) {
      setMounted(true);
      requestAnimationFrame(() =>
        requestAnimationFrame(() => setReady(true)),
      );
    }
  }, [visible, mounted]);
  if (!mounted) return null;
  return (
    <div
      className="mx-[14px] overflow-hidden"
      style={{
        maxHeight: ready ? "800px" : "0px",
        opacity: ready ? 1 : 0,
        transition:
          "max-height 0.55s cubic-bezier(0.34,1.56,0.64,1), opacity 0.4s ease",
      }}
    >
      <div
        style={{
          transform: ready ? "scaleY(1)" : "scaleY(0.1)",
          transformOrigin: "top",
          transition:
            "transform 0.55s cubic-bezier(0.34,1.56,0.64,1)",
        }}
      >
        {children}
      </div>
    </div>
  );
}

function LaunchCountdownPanel() {
  const [countdown, setCountdown] = useState(getLaunchCountdown);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCountdown(getLaunchCountdown());
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <div
      className="pointer-events-none absolute bottom-[62.29px] left-1/2 z-[2] w-[318px] max-w-[86%] -translate-x-1/2"
      aria-label={`출시까지 ${countdown.days}일 ${countdown.hours}시 ${countdown.minutes}분 ${countdown.seconds}초`}
    >
      <div
        className="absolute bottom-[18%] left-[9%] right-[9%] top-[20%] rounded-[12px] bg-white/[0.01]"
        style={{
          backdropFilter: "blur(5px)",
          WebkitBackdropFilter: "blur(5px)",
        }}
      />
      <img
        src={imgIntroCountdownPanel}
        alt=""
        className="relative z-[1] block w-full"
        draggable={false}
      />
      <div
        className="absolute left-[15.5%] right-[15.5%] top-[45%] z-[2] flex items-center justify-between text-center text-[23px] leading-none text-white"
        style={{
          fontFamily: "DS-DIGIT",
          fontWeight: 700,
          textShadow:
            "0 0 1.8px rgba(255,255,255,0.95), 0 0 4.2px rgba(210,255,255,0.85)",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        <span>{formatCountdownUnit(countdown.days)}</span>
        <span>:</span>
        <span>{formatCountdownUnit(countdown.hours)}</span>
        <span>:</span>
        <span>{formatCountdownUnit(countdown.minutes)}</span>
        <span>:</span>
        <span>{formatCountdownUnit(countdown.seconds)}</span>
      </div>
      <div
        className="absolute left-[16%] right-[16%] top-[70.5%] z-[2] grid -translate-y-[4px] grid-cols-4 text-center text-[11px] leading-none text-white"
        style={{
          fontFamily: "Pretendard",
          fontWeight: 500,
          textShadow:
            "0 0 1.8px rgba(255,255,255,0.9), 0 0 3.6px rgba(210,255,255,0.65)",
        }}
      >
        <span>일</span>
        <span>시</span>
        <span>분</span>
        <span>초</span>
      </div>
    </div>
  );
}

function IntroHeader({
  onHome,
  overlay = false,
}: {
  onHome: () => void;
  overlay?: boolean;
}) {
  return (
    <div
      className={
        overlay
          ? "absolute left-0 top-0 z-20 w-full max-w-none"
          : "-mx-[14px] relative w-[calc(100%+28px)] max-w-none shrink-0"
      }
    >
      <img
        src={imgIntroHeader}
        alt=""
        className="block w-full max-w-none"
        draggable={false}
      />
      <button
        type="button"
        className="absolute left-[4.5%] top-[24%] h-[50%] w-[28%] cursor-pointer"
        aria-label="첫 화면으로 이동"
        onClick={onHome}
      />
    </div>
  );
}

function OnboardingCarousel({
  initialSlide = 0,
  className = "mt-4",
}: {
  initialSlide?: number;
  className?: string;
}) {
  const [activeSlide, setActiveSlide] = useState(initialSlide);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const scrollRafRef = useRef<number>();
  const autoPlayTimerRef = useRef<number>();
  const programmaticSlideRef = useRef<number | null>(null);
  const carouselDraggingRef = useRef(false);
  const carouselDragStartXRef = useRef(0);
  const carouselDragStartScrollRef = useRef(0);

  const restartAutoPlay = useCallback(() => {
    if (autoPlayTimerRef.current) {
      window.clearInterval(autoPlayTimerRef.current);
    }
    autoPlayTimerRef.current = window.setInterval(() => {
      setActiveSlide((slide) => (slide + 1) % ONBOARDING_SLIDES.length);
    }, 4000);
  }, []);

  useEffect(() => {
    restartAutoPlay();

    return () => {
      if (autoPlayTimerRef.current) {
        window.clearInterval(autoPlayTimerRef.current);
      }
      if (scrollRafRef.current) {
        window.cancelAnimationFrame(scrollRafRef.current);
      }
    };
  }, [restartAutoPlay]);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller || carouselDraggingRef.current) return;

    programmaticSlideRef.current = activeSlide;
    scroller.scrollTo({
      left: activeSlide * scroller.clientWidth,
      behavior: "smooth",
    });
  }, [activeSlide]);

  const handleScroll = useCallback(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    if (scrollRafRef.current) {
      window.cancelAnimationFrame(scrollRafRef.current);
    }

    scrollRafRef.current = window.requestAnimationFrame(() => {
      const slides = Array.from(scroller.children) as HTMLElement[];
      const programmaticSlide = programmaticSlideRef.current;
      if (programmaticSlide !== null) {
        const targetScrollLeft = programmaticSlide * scroller.clientWidth;
        if (Math.abs(scroller.scrollLeft - targetScrollLeft) < 2) {
          programmaticSlideRef.current = null;
        }
        return;
      }

      const firstSlideOffset = slides[0]?.offsetLeft ?? 0;
      const nextSlide = slides.reduce((closestIndex, slide, index) => {
        const closestDistance = Math.abs(
          slides[closestIndex].offsetLeft -
            firstSlideOffset -
            scroller.scrollLeft,
        );
        const currentDistance = Math.abs(
          slide.offsetLeft - firstSlideOffset - scroller.scrollLeft,
        );
        return currentDistance < closestDistance ? index : closestIndex;
      }, 0);
      setActiveSlide(
        Math.max(0, Math.min(ONBOARDING_SLIDES.length - 1, nextSlide)),
      );
    });
  }, []);

  return (
    <>
      <div
        ref={scrollerRef}
        onScroll={handleScroll}
        onPointerDown={(event) => {
          programmaticSlideRef.current = null;
          restartAutoPlay();
          if (event.pointerType !== "mouse" || event.button !== 0) return;

          carouselDraggingRef.current = true;
          carouselDragStartXRef.current = event.clientX;
          carouselDragStartScrollRef.current = event.currentTarget.scrollLeft;
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onPointerMove={(event) => {
          if (!carouselDraggingRef.current) return;
          event.preventDefault();
          event.currentTarget.scrollLeft =
            carouselDragStartScrollRef.current -
            (event.clientX - carouselDragStartXRef.current);
        }}
        onPointerUp={(event) => {
          if (!carouselDraggingRef.current) return;
          carouselDraggingRef.current = false;
          event.currentTarget.releasePointerCapture(event.pointerId);
        }}
        onPointerCancel={() => {
          carouselDraggingRef.current = false;
        }}
        className={`${className} mx-auto flex h-[291px] w-[300px] cursor-grab snap-x snap-mandatory overflow-x-auto scroll-smooth active:cursor-grabbing`}
        style={{
          scrollbarWidth: "none",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {ONBOARDING_SLIDES.map((slide, index) => (
          <div
            key={slide}
            className="flex h-full w-full shrink-0 snap-center items-center justify-center"
            style={{ minWidth: "100%" }}
          >
            <img
              src={slide}
              alt={`온보딩 ${index + 1}`}
              className="max-h-full max-w-full object-contain"
              draggable={false}
            />
          </div>
        ))}
      </div>

      <div className="mt-3 flex h-[8px] items-center justify-center gap-2">
        {ONBOARDING_SLIDES.map((slide, index) => (
          <button
            key={slide}
            type="button"
            aria-label={`온보딩 ${index + 1} 보기`}
            onClick={() => {
              restartAutoPlay();
              setActiveSlide(index);
            }}
            className={`h-[6px] rounded-full transition-all ${
              index === activeSlide
                ? "w-[14px] bg-[#628d38]"
                : "w-[6px] bg-[#e9dfc8]"
            }`}
          />
        ))}
      </div>
    </>
  );
}

// ── ProcessingPanel — loading overlay ────────────────────────
function ProcessingPanel({
  uploadedImage,
}: {
  uploadedImage: string | null;
}) {
  const [loadingStage, setLoadingStage] = useState<"scan" | "card">("scan");
  const processingPromptRef = useRef<HTMLImageElement>(null);
  const processingFieldRef = useRef<HTMLDivElement>(null);
  const [selectingImageTop, setSelectingImageTop] = useState(26);

  useEffect(() => {
    const timer = window.setTimeout(
      () => setLoadingStage("card"),
      SCAN_STAGE_DURATION_MS,
    );
    return () => window.clearTimeout(timer);
  }, []);

  useLayoutEffect(() => {
    const updateSelectingImageTop = () => {
      const promptRect = processingPromptRef.current?.getBoundingClientRect();
      const fieldRect = processingFieldRef.current?.getBoundingClientRect();
      if (!promptRect || !fieldRect) return;

      const textBottom =
        promptRect.top +
        promptRect.height * PROCESSING_SELECTING_TEXT_BOTTOM_RATIO;
      setSelectingImageTop(
        textBottom + PROCESSING_SELECTING_IMAGE_GAP - fieldRect.top,
      );
    };
    const observer = new ResizeObserver(updateSelectingImageTop);

    if (processingPromptRef.current) observer.observe(processingPromptRef.current);
    if (processingFieldRef.current) observer.observe(processingFieldRef.current);
    window.addEventListener("resize", updateSelectingImageTop);
    window.requestAnimationFrame(updateSelectingImageTop);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateSelectingImageTop);
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 px-6"
      role="status"
      aria-live="polite"
      style={{
        backdropFilter: "blur(5px)",
        WebkitBackdropFilter: "blur(5px)",
      }}
    >
      <div className="flex h-[640px] w-[330px] max-w-full translate-y-[24px] flex-col items-center">
        <div className="flex h-[118px] w-full flex-col items-center justify-start pt-[8px]">
          <p
            className="translate-y-[16px] text-center text-[20px] tracking-[2px]"
            style={{
              fontFamily: "Galmuri11",
              fontWeight: 700,
              color: "transparent",
              WebkitTextStroke: "1px rgba(255,255,255,0.45)",
              backgroundImage:
                "linear-gradient(90deg, rgba(242,235,221,0.42) 0%, #ffffff 42%, rgba(170,235,255,0.95) 50%, #ffffff 58%, rgba(242,235,221,0.42) 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              backgroundSize: "220% 100%",
              animation: "textShimmer 1.7s linear infinite",
              textShadow: "0 0 10px rgba(168,238,255,0.45)",
            }}
          >
            {loadingStage === "scan" ? "ANALYZING..." : "Select..."}
          </p>
          <img
            ref={processingPromptRef}
            src={
              loadingStage === "scan"
                ? PROCESSING_ANALYZING_PROMPT_IMAGE
                : PROCESSING_SELECTING_PROMPT_IMAGE
            }
            alt={
              loadingStage === "scan"
                ? "사진 속 동물을 분석하고 있어요"
                : "적합한 카드팩을 선정하고 있어요"
            }
            className="mt-[8px] h-[71px] w-[270px] max-w-full object-contain"
            draggable={false}
          />
        </div>

        <div
          ref={processingFieldRef}
          className="relative flex h-[360px] w-[min(100vw,397px)] max-w-none items-center justify-center overflow-hidden"
        >
          {loadingStage === "scan" ? (
            <div
              className="absolute left-1/2 h-[206px] w-[206px] -translate-x-1/2 overflow-visible"
              style={{ top: `${selectingImageTop}px` }}
            >
              <div className="absolute inset-0 z-0 overflow-hidden rounded-[8px]">
                {uploadedImage && (
                  <img
                    src={uploadedImage}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover"
                    draggable={false}
                  />
                )}
              </div>
              <div
                className="pointer-events-none absolute left-1/2 top-1/2 z-10 h-[248px] w-[248px] -translate-x-1/2 -translate-y-1/2"
                aria-label="변환 중 스캔 애니메이션"
              >
                <DotLottieReact
                  src={SCANNER_LOTTIE}
                  loop
                  autoplay
                  className="block h-full w-full"
                />
              </div>
              <div className="pointer-events-none absolute inset-0 z-20 rounded-[8px] ring-1 ring-white/45" />
            </div>
          ) : (
            <>
              {CARD_SELECT_BACK_DELAYS.map((delay, index) => (
                <img
                  key={`card-back-${delay}`}
                  src={CARD_PACK_BACK_IMAGE}
                  alt=""
                  className="pointer-events-none absolute left-1/2 top-[91px] z-0 h-[157px] w-[117px] object-contain"
                  draggable={false}
                  aria-hidden="true"
                  style={{
                    marginLeft: "-58.5px",
                    animation: `cardBackSweep 1500ms linear ${delay}ms both`,
                    filter: `drop-shadow(0 ${4 + (index % 3) * 2}px 8px rgba(0,0,0,.18))`,
                  }}
                />
              ))}
              {uploadedImage && (
                <img
                  src={uploadedImage}
                  alt=""
                  className="absolute left-1/2 z-10 h-[206px] w-[206px] -translate-x-1/2 rounded-[8px] object-cover"
                  style={{ top: `${selectingImageTop}px` }}
                  draggable={false}
                />
              )}
              {CARD_SELECT_FRONT_DELAYS.map((delay, index) => (
                <img
                  key={`card-front-${delay}`}
                  src={CARD_PACK_FRONT_IMAGE}
                  alt=""
                  className="pointer-events-none absolute left-1/2 top-[102px] z-20 h-[157px] w-[117px] object-contain"
                  draggable={false}
                  aria-hidden="true"
                  style={{
                    marginLeft: "-58.5px",
                    animation: `cardFrontSweep 1500ms linear ${delay}ms both`,
                    filter: `drop-shadow(0 ${7 + (index % 3) * 2}px 10px rgba(0,0,0,.28))`,
                  }}
                />
              ))}
              <img
                src={CARD_PACK_FRONT_IMAGE}
                alt=""
                className="pointer-events-none absolute left-1/2 top-[102px] z-30 h-[157px] w-[117px] object-contain"
                draggable={false}
                aria-hidden="true"
                style={{
                  marginLeft: "-58.5px",
                  animation: `cardFrontFinal 1506.261ms linear ${CARD_SELECT_FRONT_NEIGHBOR_DELAY}ms both`,
                  filter: "drop-shadow(0 10px 12px rgba(0,0,0,.32))",
                }}
              />
              <img
                src={CARD_PACK_FRONT_IMAGE}
                alt=""
                className="pointer-events-none absolute left-1/2 top-[102px] z-20 h-[157px] w-[117px] object-contain"
                draggable={false}
                aria-hidden="true"
                style={{
                  marginLeft: "-58.5px",
                  animation: `cardFrontSweep 1500ms linear ${CARD_SELECT_FRONT_NEIGHBOR_DELAY}ms both`,
                  filter: "drop-shadow(0 8px 10px rgba(0,0,0,.28))",
                }}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function PixelGeneratingModal() {
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/55 px-6 backdrop-blur-[4px]">
      <div className="w-full max-w-[320px]">
        <WindowPanel>
          <div className="flex flex-col items-center gap-4 px-8 py-6">
            <p
              className="text-center text-[11px] tracking-[1.1px] text-[#628d38]"
              style={{ fontFamily: "Galmuri11", fontWeight: 700 }}
            >
              STEP 03
            </p>
            <p
              className="text-center text-[18px] leading-[1.4] tracking-[0.9px] text-[#32322d]"
              style={{
                fontFamily: "Elice DX Neolli",
                fontWeight: 500,
              }}
            >
              사진을 픽셀 캐릭터로
              <br />
              변환하고 있어요
            </p>
            <p
              className="text-center text-[10px] leading-[1.6] tracking-[0.4px] text-[#6a6a61]"
              style={{
                fontFamily: "Elice DX Neolli",
                fontWeight: 300,
              }}
            >
              배경을 제거하고
              <br />
              달릴 준비를 하는 중이에요
            </p>
            <div
              className="relative h-[50px] w-[56px]"
              style={{
                animation: "dogBreath 1.8s ease-in-out infinite",
              }}
            >
              <FigmaDog />
            </div>
            <div className="w-[200px]">
              <div className="h-[7px] overflow-hidden rounded-full bg-[#e9dfc8]">
                <div
                  className="h-full rounded-full bg-[#628d38]"
                  style={{
                    width: "45%",
                    animation: "loadingSweep 1.15s ease-in-out infinite",
                  }}
                />
              </div>
            </div>
          </div>
        </WindowPanel>
      </div>
    </div>
  );
}

// ── CardPackPanel — tap to open ───────────────────────────────
function CardPackPanel({
  onOpen,
}: {
  onOpen: () => void;
}) {
  const [stage, setStage] = useState<"ready" | "cut">("ready");

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 px-6"
      role="dialog"
      aria-modal="true"
      aria-label="완성된 카드팩"
      style={{
        backdropFilter: "blur(5px)",
        WebkitBackdropFilter: "blur(5px)",
      }}
    >
      <div className="flex h-[640px] w-[330px] max-w-full translate-y-[24px] flex-col items-center">
        <div className="flex h-[118px] w-full flex-col items-center justify-start pt-[2px]">
          <p
            className="translate-y-[16px] text-center text-[34px] leading-none tracking-[1.2px]"
            style={{
              fontFamily: "Galmuri11",
              fontWeight: 700,
              color: "transparent",
              WebkitTextStroke: "1px rgba(255,255,255,0.65)",
              backgroundImage:
                "linear-gradient(90deg, rgba(255,255,255,0.45) 0%, #ffffff 42%, rgba(170,235,255,0.95) 50%, #ffffff 58%, rgba(255,255,255,0.45) 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              backgroundSize: "220% 100%",
              animation: "textShimmer 1.7s linear infinite",
              textShadow: "0 0 10px rgba(168,238,255,0.55)",
            }}
          >
            Card Pack Ready
          </p>
          {stage === "ready" ? (
            <img
              src={CARD_PACK_OPEN_PROMPT_IMAGE}
              alt="완성된 카드팩을 클릭해 열어보세요"
              className="mt-[8px] h-auto w-[270px] max-w-full object-contain"
              draggable={false}
            />
          ) : (
            <img
              src={CARD_PACK_CUT_PROMPT_IMAGE}
              alt="절취선을 잘라보세요"
              className="mt-[8px] h-auto w-[180px] max-w-full object-contain"
              draggable={false}
            />
          )}
        </div>
        <div className="relative flex h-[360px] w-full items-center justify-center overflow-visible">
          {stage === "ready" ? (
            <button
              type="button"
              onClick={() => {
                trackEvent("card_pack_cut_ready");
                setStage("cut");
              }}
              className="block cursor-pointer focus:outline-none"
              aria-label="카드팩 자르기 시작"
            >
              <ReadyCardPack />
            </button>
          ) : (
            <CuttableCardPack onCut={onOpen} />
          )}
        </div>
      </div>
    </div>
  );
}

function ReadyCardPack() {
  return (
    <div
      className="relative h-[280px] w-[208px]"
      style={{
        filter: "drop-shadow(0 18px 28px rgba(0,0,0,0.45))",
        animation: "packReadyMotion 10s linear infinite",
      }}
    >
      <img src={CARD_PACK_FRONT_IMAGE} alt="" className="h-full w-full object-contain" draggable={false} />
    </div>
  );
}

function CuttableCardPack({ onCut }: { onCut: () => void }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const draggingRef = useRef(false);
  const completedRef = useRef(false);

  const updateProgress = useCallback((clientX: number) => {
    const rect = trackRef.current?.getBoundingClientRect();
    if (!rect) return;
    const next = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    setProgress(next);
    if (next >= .88 && !completedRef.current) {
      completedRef.current = true;
      draggingRef.current = false;
      trackEvent("card_pack_cut_completed");
      window.setTimeout(onCut, 180);
    }
  }, [onCut]);

  return (
    <div
      className="relative h-[280px] w-[208px] touch-none select-none"
      aria-label="카드팩 절취선 드래그 영역"
      style={{
        userSelect: "none",
        WebkitUserSelect: "none",
        WebkitTouchCallout: "none",
        WebkitTapHighlightColor: "transparent",
      }}
      onDragStart={(event) => event.preventDefault()}
    >
      <img
        src={CARD_PACK_FRONT_IMAGE}
        alt=""
        className="pointer-events-none h-full w-full select-none object-contain drop-shadow-2xl"
        draggable={false}
        style={{ WebkitUserDrag: "none", userSelect: "none", WebkitUserSelect: "none" }}
      />
      <div
        ref={trackRef}
        className="absolute left-[7%] right-[7%] top-[15.5%] h-[42px] cursor-ew-resize touch-none"
        style={{
          touchAction: "none",
          userSelect: "none",
          WebkitUserSelect: "none",
          WebkitTouchCallout: "none",
          WebkitTapHighlightColor: "transparent",
        }}
        onPointerDown={(event) => {
          event.preventDefault();
          draggingRef.current = true;
          event.currentTarget.setPointerCapture(event.pointerId);
          updateProgress(event.clientX);
        }}
        onPointerMove={(event) => {
          if (draggingRef.current) updateProgress(event.clientX);
        }}
        onPointerUp={(event) => {
          draggingRef.current = false;
          event.currentTarget.releasePointerCapture(event.pointerId);
          if (!completedRef.current && progress < .88) setProgress(0);
        }}
        onPointerCancel={() => {
          draggingRef.current = false;
          if (!completedRef.current) setProgress(0);
        }}
      >
        <div className="absolute left-0 right-0 top-1/2 border-t-2 border-dashed border-white/90" style={{ animation: "cutGuideBlink 10s linear infinite" }} />
        <div className="absolute left-0 top-1/2 h-[4px] -translate-y-1/2 rounded-full bg-[#9fe1ff] shadow-[0_0_10px_#9fe1ff]" style={{ width: `${progress * 100}%` }} />
        <div
          className="absolute top-[calc(50%+10px)] h-9 w-[41px] -translate-y-1/2"
          style={{ left: `${progress * 100}%`, animation: progress === 0 ? "cutHandlePulse 1.2s ease-in-out infinite" : undefined }}
          aria-hidden="true"
        >
          <img src={imgCutScissors} alt="" className="h-full w-full object-contain" draggable={false} />
        </div>
      </div>
    </div>
  );
}

// ── PackOpeningOverlay ────────────────────────────────────────
// Figma motion 6570:396 — plays once after the user finishes slicing.
function PackOpeningOverlay({ characterName, assets, isReady, onStartPolling, onResult, onRegister }: {
  characterName: string;
  assets: GeneratedCardAssets;
  isReady: boolean;
  onStartPolling: () => void;
  onResult: () => void;
  onRegister?: () => void;
}) {
  const [openingScene, setOpeningScene] = useState<"pack" | "sky" | "waiting" | "result">("pack");

  useEffect(() => {
    const skyTimer = window.setTimeout(() => setOpeningScene("sky"), 8000);
    return () => window.clearTimeout(skyTimer);
  }, []);

  useEffect(() => {
    if (openingScene !== "waiting" || !isReady) return;
    setOpeningScene("result");
    onResult();
  }, [isReady, onResult, openingScene]);

  useEffect(() => {
    if (openingScene !== "sky" || isReady) return;
    onStartPolling();
  }, [isReady, onStartPolling, openingScene]);

  const particles = Array.from({ length: 36 }, (_, index) => {
    const angle = (index / 36) * Math.PI * 2;
    const distance = 72 + (index % 5) * 12;
    return {
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance,
      x2: Math.cos(angle) * (distance + 20),
      y2: Math.sin(angle) * (distance + 20),
    };
  });
  const cardLaunches = [
    [2902, "0px", "2px", "2px", "0deg"],
    [3830, "-11px", "-7px", "-16px", "-3.4deg"],
    [4861, "8px", "4px", "-8px", "3.4deg"],
    [5853, "0px", "0px", "-8px", "0deg"],
    [6814, "0px", "0px", "-8px", "0deg"],
  ] as const;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-black/75 backdrop-blur-[6px]"
      style={{ touchAction: "none", overscrollBehavior: "none" }}
    >
      <div className="pointer-events-none absolute inset-0 opacity-50" style={{ background: "radial-gradient(ellipse 70% 50% at 50% 55%, rgba(98,141,56,.45), transparent 70%)" }} />
      {openingScene === "pack" ? (
        <div className="relative flex h-[560px] w-[330px] translate-y-[24px] items-center justify-center" aria-label="카드팩 개봉 중">
          {particles.map((particle, index) => (
            <span
              key={index}
              className="absolute left-1/2 top-[47%] z-30 block h-[7px] w-[7px]"
              style={{
                clipPath: index % 2 ? "polygon(50% 0,62% 38%,100% 50%,62% 62%,50% 100%,38% 62%,0 50%,38% 38%)" : undefined,
                borderRadius: index % 2 ? undefined : "50%",
                background: index % 4 === 0 ? "#9fe1ff" : index % 4 === 1 ? "#f6f0c9" : "#fff",
                animation: "burstParticle 8s cubic-bezier(.5,0,.5,1) 1 both",
                "--burst-x": `${particle.x}px`, "--burst-y": `${particle.y}px`,
                "--burst-x2": `${particle.x2}px`, "--burst-y2": `${particle.y2}px`,
              } as React.CSSProperties}
            />
          ))}

          {cardLaunches.map(([delay, startX, bumpX, endX, rotation], index) => (
            <div
              key={delay}
              className="absolute left-1/2 top-[205px] w-[150px] -translate-x-1/2"
              style={{ zIndex: 10 + index }}
            >
              <img
                src={assets.cardBackImage}
                alt=""
                draggable={false}
                className="block w-full rounded-[8px] opacity-0 drop-shadow-2xl"
                style={{
                  animation: `revealCardLaunch 800ms cubic-bezier(.5,0,.5,1) ${delay}ms 1 both`,
                  "--start-x": startX,
                  "--bump-x": bumpX,
                  "--end-x": endX,
                  "--start-r": rotation,
                } as React.CSSProperties}
              />
            </div>
          ))}

          <div className="absolute left-1/2 top-[120px] z-20 h-[420px] w-[310px] -translate-x-1/2">
            <div
              className="relative h-full w-full"
              style={{ animation: "packBodyExit 8s cubic-bezier(.5,0,.5,1) 1 both" }}
            >
              <img
                src={imgCardPackBottom}
                alt=""
                draggable={false}
                className="absolute left-1/2 top-[87px] w-[310px] -translate-x-1/2 drop-shadow-2xl"
              />
              <div className="absolute top-0 w-[310px] -translate-x-1/2" style={{ left: "calc(50% + 16px)" }}>
                <img
                  src={imgCardPackTop}
                  alt=""
                  draggable={false}
                  className="block w-full drop-shadow-2xl"
                  style={{ transformOrigin: "92.9% 95.4%", animation: "packTopTear 8s cubic-bezier(.5,0,.5,1) 1 both" }}
                />
              </div>
              {Array.from({ length: 11 }, (_, index) => (
                <span
                  key={`seam-sparkle-${index}`}
                  className="pointer-events-none absolute top-[87px] z-30 h-[10px] w-[10px] bg-white"
                  style={{
                    left: `${8 + index * 8.4}%`,
                    clipPath: "polygon(50% 0,61% 39%,100% 50%,61% 61%,50% 100%,39% 61%,0 50%,39% 39%)",
                    filter: "drop-shadow(0 0 6px #9fe1ff)",
                    animation: `packSeamSparkle 900ms ease-out ${600 + index * 65}ms 1 both`,
                  }}
                  aria-hidden="true"
                />
              ))}
            </div>
          </div>

        </div>
      ) : openingScene === "sky" ? (
        <CardSkyScene
          cardBackImage={assets.cardBackImage}
          onSelect={(cardIndex) => {
            trackEvent("card_sky_selected", { card_index: cardIndex + 1 });
            if (isReady) {
              setOpeningScene("result");
              onResult();
              return;
            }
            trackEvent("card_pack_waiting_for_response");
            setOpeningScene("waiting");
          }}
        />
      ) : openingScene === "waiting" ? (
        <div
          className="flex h-[560px] w-[330px] translate-y-[24px] flex-col items-center"
          role="status"
          aria-label="카드 생성 응답 대기 중"
        >
          <img
            src={CARD_GENERATION_FINISHING_PROMPT_IMAGE}
            alt="카드 생성을 마무리하고 있어요"
            className="mt-[34px] h-auto w-[300px] max-w-full object-contain"
            draggable={false}
          />
          <div className="flex flex-1 items-center justify-center pb-[70px]">
            <span
              className="block h-[58px] w-[58px] rounded-full border-[6px] border-white/20 border-t-[#9fe1ff]"
              style={{
                animation: "circularLoader 800ms linear infinite",
                boxShadow:
                  "0 0 14px rgba(159,225,255,.55), inset 0 0 10px rgba(159,225,255,.18)",
              }}
              aria-hidden="true"
            />
          </div>
        </div>
      ) : (
        <ResultOverlay characterName={characterName} assets={assets} onRegister={onRegister} />
      )}
    </div>
  );
}

function CardSkyScene({
  cardBackImage,
  onSelect,
}: {
  cardBackImage: string;
  onSelect: (cardIndex: number) => void;
}) {
  const [canSelect, setCanSelect] = useState(false);
  const chooseTitleRef = useRef<HTMLParagraphElement>(null);
  const choosePromptRef = useRef<HTMLImageElement>(null);
  const firstCardRef = useRef<HTMLButtonElement>(null);
  const cardFieldRef = useRef<HTMLDivElement>(null);
  const [choosePromptWidth, setChoosePromptWidth] = useState<number | null>(null);
  const [cardFieldOffsetY, setCardFieldOffsetY] = useState(0);
  const cards = [
    { delay: 0, x: "17.82%", y: "50%" },
    { delay: 1367, x: "50%", y: "50%" },
    { delay: 2800, x: "82.18%", y: "50%" },
    { delay: 4133, x: "33.75%", y: "81.62%" },
    { delay: 5467, x: "65.63%", y: "81.62%" },
  ];

  useEffect(() => {
    const timer = window.setTimeout(() => setCanSelect(true), 7200);
    return () => window.clearTimeout(timer);
  }, []);

  useLayoutEffect(() => {
    if (!chooseTitleRef.current) return;

    const title = chooseTitleRef.current;
    const updatePromptWidth = () => {
      setChoosePromptWidth(title.getBoundingClientRect().width + 24);
    };
    const observer = new ResizeObserver(updatePromptWidth);

    updatePromptWidth();
    observer.observe(title);
    document.fonts?.ready.then(updatePromptWidth);

    return () => observer.disconnect();
  }, []);

  useLayoutEffect(() => {
    if (!choosePromptRef.current || !firstCardRef.current || !cardFieldRef.current) return;

    const updateCardOffset = () => {
      const promptRect = choosePromptRef.current?.getBoundingClientRect();
      const cardField = cardFieldRef.current;
      const firstCard = firstCardRef.current;
      if (!promptRect || !cardField || !firstCard) return;

      const promptTextBottom =
        promptRect.top +
        promptRect.height * CHOOSE_ONE_PROMPT_TEXT_BOTTOM_RATIO;

      const unshiftedFieldTop =
        cardField.getBoundingClientRect().top - cardFieldOffsetY;
      const firstCardTop =
        unshiftedFieldTop + cardField.offsetHeight * 0.5 - firstCard.offsetHeight * 0.5;
      const nextOffset = 89.86 - (firstCardTop - promptTextBottom);
      if (Math.abs(nextOffset - cardFieldOffsetY) < 0.1) return;
      setCardFieldOffsetY(nextOffset);
    };
    const observer = new ResizeObserver(updateCardOffset);

    observer.observe(choosePromptRef.current);
    observer.observe(firstCardRef.current);
    observer.observe(cardFieldRef.current);
    window.addEventListener("resize", updateCardOffset);
    window.requestAnimationFrame(updateCardOffset);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateCardOffset);
    };
  }, [cardFieldOffsetY, choosePromptWidth]);

  return (
    <div
      className="flex h-[640px] w-[330px] max-w-[92vw] translate-y-[24px] flex-col items-center"
      aria-label={canSelect ? "카드 한 장을 선택하세요" : "카드가 하늘에 펼쳐지는 중"}
    >
      <div className="flex h-[118px] w-full flex-col items-center justify-start pt-[8px]">
        <div
          className="flex flex-col items-center"
          style={{ visibility: canSelect ? "visible" : "hidden" }}
        >
            <p
              ref={chooseTitleRef}
              className="translate-y-[16px] text-center text-[22px] tracking-[2px]"
              style={{
                fontFamily: "Galmuri11",
                fontWeight: 700,
                color: "transparent",
                WebkitTextStroke: "1px rgba(255,255,255,0.45)",
                backgroundImage:
                  "linear-gradient(90deg, rgba(242,235,221,0.42) 0%, #ffffff 42%, rgba(170,235,255,0.95) 50%, #ffffff 58%, rgba(242,235,221,0.42) 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                backgroundSize: "220% 100%",
                animation: "textShimmer 1.7s linear infinite",
                textShadow: "0 0 10px rgba(168,238,255,0.45)",
              }}
            >
              Choose One!
            </p>
            <img
              ref={choosePromptRef}
              src={CHOOSE_ONE_PROMPT_IMAGE}
              alt="하나를 선택해 보세요"
              className="mt-[8px] h-auto max-w-full object-contain"
              style={{
                width: choosePromptWidth === null ? 0 : `${choosePromptWidth}px`,
              }}
              draggable={false}
            />
        </div>
      </div>

      <div
        ref={cardFieldRef}
        className="relative h-[464px] w-full overflow-hidden"
        style={{ transform: `translateY(${cardFieldOffsetY}px)` }}
      >
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: "radial-gradient(circle at 50% 52%, rgba(255,207,48,.22), transparent 62%)" }}
        />
        {cards.map((card, index) => (
          <button
            key={card.delay}
            ref={index === 0 ? firstCardRef : undefined}
            type="button"
            disabled={!canSelect}
            aria-label={`${index + 1}번 카드 선택`}
            onClick={() => onSelect(index)}
            className={`group absolute w-[27.83%] border-0 bg-transparent p-0 opacity-0 outline-none ${
              canSelect ? "cursor-pointer" : "cursor-default"
            }`}
            style={{
              "--sky-x": card.x,
              "--sky-y": card.y,
              animation: `cardSkyArrive 1200ms cubic-bezier(.22,.61,.36,1) ${card.delay}ms 1 both`,
              zIndex: index + 1,
            } as React.CSSProperties}
          >
            <div
              className="w-full will-change-transform"
              style={{
                animation: `cardSkySpin 1200ms cubic-bezier(.22,.61,.36,1) ${card.delay}ms 1 both`,
              }}
            >
              <img
                src={cardBackImage}
                alt=""
                draggable={false}
                className={`block w-full select-none rounded-[8px] transition-[transform,filter] duration-200 ease-out ${
                  canSelect
                    ? "group-hover:-translate-y-2 group-hover:scale-110 group-hover:brightness-110 group-hover:drop-shadow-[0_0_20px_rgba(255,220,80,.95)] group-focus-visible:-translate-y-2 group-focus-visible:scale-110 group-focus-visible:brightness-110 group-focus-visible:drop-shadow-[0_0_20px_rgba(255,220,80,.95)] group-active:scale-105"
                    : ""
                }`}
              />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ── ResultOverlay — card back → flip → 360° spin + swipe ──────
function ResultOverlay({
  characterName,
  assets,
  onRegister,
}: {
  characterName: string;
  assets: GeneratedCardAssets;
  onRegister?: () => void;
}) {
  // angle in degrees — starts at 180 (back face showing)
  const [angle, setAngle] = useState(180);
  // 'initial' → CSS transition flip, 'spinning' → rAF auto-rotate
  const [mode, setMode] = useState<"initial" | "spinning">(
    "initial",
  );

  const rafRef = useRef<number>();
  const lastTimeRef = useRef<number>();
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const dragStartAng = useRef(0);

  useEffect(() => {
    // 0.8s: flip card back → front (0 → 360 so front shows)
    const t1 = setTimeout(() => setAngle(360), 800);
    // 0.8s flip + 1s pause → start auto-spin
    const t2 = setTimeout(() => setMode("spinning"), 1800);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  // Auto-rotation loop (360°/2s speed)
  useEffect(() => {
    if (mode !== "spinning") return;
    const spin = (time: number) => {
      if (!isDragging.current) {
        if (lastTimeRef.current !== undefined) {
          setAngle(
            (prev) =>
              prev + (time - lastTimeRef.current!) * 0.05,
          );
        }
        lastTimeRef.current = time;
      } else {
        lastTimeRef.current = undefined;
      }
      rafRef.current = requestAnimationFrame(spin);
    };
    rafRef.current = requestAnimationFrame(spin);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [mode]);

  // Touch swipe handlers
  const onTouchStart = (e: React.TouchEvent) => {
    if (mode !== "spinning") return;
    isDragging.current = true;
    dragStartX.current = e.touches[0].clientX;
    dragStartAng.current = angle;
  };
  const onTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current) return;
    e.preventDefault();
    const delta = e.touches[0].clientX - dragStartX.current;
    setAngle(dragStartAng.current + delta * 0.6);
  };
  const onTouchEnd = () => {
    isDragging.current = false;
  };

  // Mouse drag — global listeners so it works outside the element
  const onMouseDown = (e: React.MouseEvent) => {
    if (mode !== "spinning") return;
    isDragging.current = true;
    dragStartX.current = e.clientX;
    dragStartAng.current = angle;

    const onMove = (ev: MouseEvent) => {
      const delta = ev.clientX - dragStartX.current;
      setAngle(dragStartAng.current + delta * 0.6);
    };
    const onUp = () => {
      isDragging.current = false;
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  return (
    <div className="absolute left-0 right-0 top-[117.19px] flex flex-col items-center w-full px-6">
      {/* Spotlight bg */}
      <div
        className="absolute inset-0 pointer-events-none opacity-0.1"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 45%, rgba(98,141,56,0.35) 0%, transparent 70%)",
        }}
      />

      {/* Card — initial CSS flip then rAF spin + swipe */}
      <div
        style={{
          perspective: "800px",
          cursor: mode === "spinning" ? "grab" : "default",
          userSelect: "none",
          WebkitUserSelect: "none",
          WebkitUserDrag: "none",
          touchAction: "none",
          overscrollBehavior: "none",
        }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onMouseDown={onMouseDown}
      >
        <div
          style={{
            position: "relative",
            width: "283.66px",
            height: "408.52px",
            transformStyle: "preserve-3d",
            transform: `rotateY(${angle}deg)`,
            // CSS transition only during the initial flip; removed once spinning starts
            transition:
              mode === "initial"
                ? "transform 0.8s cubic-bezier(0.4,0,0.2,1)"
                : "none",
          }}
        >
          {/* Front face — visible at 0°/360° */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              overflow: "hidden",
              borderRadius: "16px",
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              transform: "translateZ(0.1px)",
            }}
          >
            <img
              src={assets.cardImage}
              alt="캐릭터 카드"
              draggable={false}
              style={{
                width: "283.66px",
                height: "408.52px",
                filter:
                  "drop-shadow(0 12px 32px rgba(0,0,0,0.7))",
                display: "block",
                objectFit: "cover",
                borderRadius: "16px",
                pointerEvents: "none",
              }}
            />
          </div>

          {/* Back face — rotated 180°, visible at 180° */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              transform: "rotateY(180deg) translateZ(0.1px)",
              filter:
                "drop-shadow(0 12px 32px rgba(0,0,0,0.7))",
            }}
          >
            <div
              style={{
                position: "relative",
                width: "283.66px",
                height: "408.52px",
                overflow: "hidden",
                borderRadius: "16px",
                pointerEvents: "none",
              }}
            >
              <img
                src={assets.cardBackImage}
                alt="카드 뒷면"
                draggable={false}
                style={{
                  position: "absolute",
                  left: "50%",
                  top: "50%",
                  width: "100%",
                  height: "100%",
                  display: "block",
                  objectFit: "cover",
                  borderRadius: "16px",
                  pointerEvents: "none",
                  transform: "translate(-50%, -50%)",
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-[65.35px] flex flex-col items-center gap-[6px]">
        {onRegister && (
          <PixelButton
            onClick={() => {
              trackEvent("cta_opened_from_result");
              onRegister();
            }}
            showPaw
            imageSrc={imgBtnNext}
            ariaLabel="다음으로"
          >
            다음으로
          </PixelButton>
        )}
      </div>
    </div>
  );
}

function ClassicV2Version() {
  const searchParams = new URLSearchParams(window.location.search);
  const sharedCtaName = searchParams.get("name") || "";
  const sharedCharacterizationId = getSharedCharacterizationId(searchParams);
  const isSharedCta =
    searchParams.get("cta") === "1" || !!sharedCharacterizationId;
  const [phase, setPhase] = useState<Phase>("idle");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [generatedAssets, setGeneratedAssets] =
    useState<GeneratedCardAssets | null>(null);
  const [characterName, setCharacterName] = useState(sharedCtaName);
  const [nameError, setNameError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [generationError, setGenerationError] = useState("");
  const [conversionStatus, setConversionStatus] =
    useState<ConversionStatus>("idle");
  const [showGenerationErrorModal, setShowGenerationErrorModal] =
    useState(false);
  const [showImageGuide, setShowImageGuide] = useState(false);
  const [registrationView, setRegistrationView] = useState<
    "cta" | "complete" | null
  >(isSharedCta ? "cta" : null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isNameComposingRef = useRef(false);
  const conversionAbortRef = useRef<AbortController | null>(null);
  const pendingCharacterizationRef = useRef<CharacterizationResponse | null>(null);
  const isPollingCharacterizationRef = useRef(false);
  const isButtonActive =
    !!uploadedImage && characterName.trim().length > 0;
  const isPreviewMode = searchParams.get("preview") === "1";
  const isTransformationOverlayOpen =
    registrationView === null && phase !== "idle";

  useEffect(() => {
    return () => conversionAbortRef.current?.abort();
  }, []);

  useEffect(() => {
    if (!isTransformationOverlayOpen) return;

    const body = document.body;
    const root = document.documentElement;
    const previousBodyStyles = {
      overflow: body.style.overflow,
      overscrollBehavior: body.style.overscrollBehavior,
    };
    const previousRootStyles = {
      overflow: root.style.overflow,
      overscrollBehavior: root.style.overscrollBehavior,
    };

    body.style.overflow = "hidden";
    body.style.overscrollBehavior = "none";
    root.style.overflow = "hidden";
    root.style.overscrollBehavior = "none";

    return () => {
      body.style.overflow = previousBodyStyles.overflow;
      body.style.overscrollBehavior = previousBodyStyles.overscrollBehavior;
      root.style.overflow = previousRootStyles.overflow;
      root.style.overscrollBehavior = previousRootStyles.overscrollBehavior;
    };
  }, [isTransformationOverlayOpen]);

  useEffect(() => {
    if (phase !== "processing") return;

    const timer = window.setTimeout(() => {
      setPhase((currentPhase) =>
        currentPhase === "processing" ? "pack" : currentPhase,
      );
    }, PROCESSING_MIN_DURATION_MS);

    return () => window.clearTimeout(timer);
  }, [phase]);

  useEffect(() => {
    trackEvent("page_viewed", {
      is_shared_cta: isSharedCta,
      is_preview: isPreviewMode,
    });
  }, [isPreviewMode, isSharedCta]);

  useEffect(() => {
    trackEvent("phase_viewed", {
      phase,
    });
  }, [phase]);

  useEffect(() => {
    if (!sharedCharacterizationId) return;

    let isCancelled = false;

    async function loadSharedCharacterization() {
      try {
        const url = new URL(
          `/api/characterizations/public/${encodeURIComponent(sharedCharacterizationId)}`,
          window.location.origin,
        );

        const response = await fetch(url.toString(), {
          method: "GET",
          credentials: "include",
        });
        const payload = await response.json();
        if (isCancelled) return;

        if (!response.ok) {
          trackEvent("shared_characterization_load_failed", {
            message: formatApiErrorPayload(payload),
          });
          return;
        }

        const assets = getGeneratedCardAssets(payload);
        setGeneratedAssets({
          ...assets,
          characterizationId:
            assets.characterizationId || sharedCharacterizationId,
        });
        trackEvent("shared_characterization_loaded");
      } catch (error) {
        if (isCancelled) return;

        trackEvent("shared_characterization_load_failed", {
          message:
            error instanceof Error ? error.message : "unknown_error",
        });
      }
    }

    loadSharedCharacterization();

    return () => {
      isCancelled = true;
    };
  }, [sharedCharacterizationId]);

  const readFile = useCallback(async (file: File) => {
    if (!ACCEPTED_TYPES.has(file.type)) {
      trackEvent("photo_upload_rejected", {
        file_type: file.type || "unknown",
      });
      return;
    }
    trackEvent("photo_upload_started", {
      file_type: file.type,
      file_size_kb: Math.round(file.size / 1024),
    });
    setGenerationError("");
    setShowGenerationErrorModal(false);

    try {
      setUploadedImage(await createUploadPreview(file));
      trackEvent("photo_upload_completed", {
        file_type: file.type,
        file_size_kb: Math.round(file.size / 1024),
      });
    } catch (error) {
      trackEvent("photo_upload_failed", {
        file_type: file.type,
        message:
          error instanceof Error ? error.message : "unknown_error",
      });
      setGenerationError(
        error instanceof Error
          ? error.message
          : "이미지를 읽지 못했어요.",
      );
    }
  }, []);

  const startCharacterizationPolling = useCallback(async () => {
    const pendingCharacterization = pendingCharacterizationRef.current;
    if (!pendingCharacterization || isPollingCharacterizationRef.current) return;

    conversionAbortRef.current?.abort();
    const controller = new AbortController();
    conversionAbortRef.current = controller;
    isPollingCharacterizationRef.current = true;
    let characterization = pendingCharacterization;

    try {
      while (!controller.signal.aborted) {
        const pollResponse = await fetch(
          `/api/characterizations/public/${encodeURIComponent(characterization.characterizationId)}`,
          {
            method: "GET",
            credentials: "include",
            signal: controller.signal,
          },
        );
        const pollPayload = await pollResponse.json();
        if (!pollResponse.ok) {
          throw new Error(getApiErrorMessage(pollPayload));
        }

        const polledCharacterization = getCharacterizationResponse(pollPayload);
        characterization = {
          ...characterization,
          ...polledCharacterization,
          characterizationId: characterization.characterizationId,
          cardType: polledCharacterization.cardType || characterization.cardType,
        };
        pendingCharacterizationRef.current = characterization;

        const isCompleted =
          characterization.status === "SUCCEEDED" ||
          !!characterization.resultImageUrl;
        if (isCompleted) {
          if (!characterization.resultImageUrl) {
            throw new Error("완료 응답에 resultImageUrl이 없어요.");
          }
          setGeneratedAssets({
            cardImage: characterization.resultImageUrl,
            cardBackImage: getCardBackImage(characterization.cardType),
            characterizationId: characterization.characterizationId,
          });
          setConversionStatus("success");
          pendingCharacterizationRef.current = null;
          trackEvent("convert_completed", { mode: "api" });
          return;
        }

        if (["FAILED", "FAILURE", "CANCELED", "CANCELLED"].includes(characterization.status)) {
          throw new Error(
            characterization.failureReason || "카드 이미지 변환에 실패했어요.",
          );
        }

        await waitForPollInterval(controller.signal);
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      trackEvent("convert_failed", {
        message: error instanceof Error ? error.message : "unknown_error",
      });
      setGenerationError(
        error instanceof Error ? error.message : "카드 이미지를 만들지 못했어요.",
      );
      setShowGenerationErrorModal(true);
      setConversionStatus("error");
      setPhase("idle");
    } finally {
      isPollingCharacterizationRef.current = false;
      if (conversionAbortRef.current === controller) {
        conversionAbortRef.current = null;
      }
    }
  }, []);

  const handleConvert = useCallback(async () => {
    if (!isButtonActive) return;
    conversionAbortRef.current?.abort();
    const controller = new AbortController();
    conversionAbortRef.current = controller;
    trackEvent("convert_started", {
      name_length: characterName.trim().length,
      is_preview: isPreviewMode,
    });
    setGenerationError("");
    setShowGenerationErrorModal(false);
    setConversionStatus("pending");
    setGeneratedAssets(null);
    pendingCharacterizationRef.current = null;
    isPollingCharacterizationRef.current = false;
    setPhase("processing");

    if (isPreviewMode) {
      setGeneratedAssets(FALLBACK_CARD_ASSETS);
      setConversionStatus("success");
      conversionAbortRef.current = null;
      trackEvent("convert_completed", {
        mode: "preview",
      });
      return;
    }

    try {
      const response = await fetch("/api/classic-v2-card", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image: uploadedImage,
          name: characterName.trim(),
        }),
        signal: controller.signal,
      });
      const responseText = await response.text();
      let payload: unknown = {};
      if (responseText) {
        try {
          payload = JSON.parse(responseText);
        } catch {
          payload = responseText;
        }
      }
      if (!response.ok) {
        throw new Error(getApiErrorMessage(payload));
      }

      const characterization = getCharacterizationResponse(payload);
      if (!characterization.characterizationId) {
        throw new Error("카드 생성 응답에 characterizationId가 없어요.");
      }

      const cardBackImage = getCardBackImage(characterization.cardType);
      setGeneratedAssets({
        cardImage: FALLBACK_CARD_ASSETS.cardImage,
        cardBackImage,
        characterizationId: characterization.characterizationId,
      });
      pendingCharacterizationRef.current = characterization;
      conversionAbortRef.current = null;
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      trackEvent("convert_failed", {
        message:
          error instanceof Error ? error.message : "unknown_error",
      });
      setGenerationError(
        error instanceof Error
          ? error.message
          : "카드 이미지를 만들지 못했어요.",
      );
      setShowGenerationErrorModal(true);
      setConversionStatus("error");
      setPhase("idle");
    }
  }, [characterName, isButtonActive, isPreviewMode, uploadedImage]);

  const handleOpenPack = useCallback(() => {
    trackEvent("card_pack_opened");
    setPhase("dim");
  }, []);
  const handleResult = useCallback(() => {
    trackEvent("result_viewed");
    setPhase("result");
  }, []);

  const handleReset = useCallback(() => {
    conversionAbortRef.current?.abort();
    conversionAbortRef.current = null;
    pendingCharacterizationRef.current = null;
    isPollingCharacterizationRef.current = false;
    window.history.replaceState(
      null,
      "",
      window.location.pathname || "/",
    );
    setPhase("idle");
    setUploadedImage(null);
    setGeneratedAssets(null);
    setConversionStatus("idle");
    setCharacterName("");
    setNameError("");
    setRegistrationView(null);
    setGenerationError("");
    setShowGenerationErrorModal(false);
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    window.requestAnimationFrame(() => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    });
  }, []);

  const stepIndex =
    phase === "idle" ? 1 : phase === "processing" ? 2 : 3;

  if (registrationView === "cta") {
    return (
      <CTAPage
        characterName={characterName.trim()}
        cardImage={generatedAssets?.cardImage ?? null}
        cardBackImage={generatedAssets?.cardBackImage ?? null}
        characterizationId={generatedAssets?.characterizationId ?? null}
        isSharedEntry={!!sharedCharacterizationId}
        onCreateNew={handleReset}
        onComplete={() => setRegistrationView("complete")}
      />
    );
  }

  if (registrationView === "complete") {
    return (
      <CompletePage
        cardImage={generatedAssets?.cardImage ?? null}
        cardBackImage={generatedAssets?.cardBackImage ?? null}
        onCreateNew={handleReset}
      />
    );
  }

  return (
    <div className="relative flex min-h-[100dvh] w-full flex-col items-center overflow-x-hidden bg-[#111111]">
      <style>{KEYFRAMES}</style>

      <main
        className="relative flex min-h-[100dvh] w-full max-w-[397px] flex-col items-center px-[14px] pb-4"
        style={{
          backgroundImage: `url("${imgIntroBg}")`,
          backgroundPosition: "top center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "100% auto",
        }}
      >
        <IntroHeader onHome={handleReset} overlay />
        <div className="-mx-[14px] relative w-[calc(100%+28px)] max-w-none shrink-0">
          <img
            src={imgIntroHero}
            alt=""
            className="block w-full"
            draggable={false}
          />
          <LaunchCountdownPanel />
        </div>
        <img
          src={imgIntroEnjoyTitle}
          alt=""
          className="relative z-10 mt-[-55.65px] block h-[34.19px] w-[236.99px] shrink-0"
          draggable={false}
        />
        <OnboardingCarousel className="relative z-10 mt-[8.81px]" />
        <img
          src={imgIntroTryTitle}
          alt=""
          className="mt-[50.4px] block h-[33.43px] w-[206.59px] shrink-0"
          draggable={false}
        />
        <img
          src={imgIntroLimitedText}
          alt=""
          className="mt-[22.84px] mb-[2.34px] block h-[16px] w-[135px] shrink-0"
          draggable={false}
        />
        <img
          src={imgIntroRewardText}
          alt=""
          className="block h-[19px] w-[226px] shrink-0"
          draggable={false}
        />

        {phase !== "idle" && phase !== "processing" && phase !== "pack" && (
          <div className="mb-2 flex justify-center gap-2">
            {[1, 2, 3].map((step) => (
              <div
                key={step}
                className={`h-[8px] rounded-full transition-all ${
                  step === stepIndex
                    ? "w-[38px] bg-[#f2ebdd]"
                    : "w-[18px] bg-[#36501e]/45"
                }`}
              />
            ))}
          </div>
        )}

        {(phase === "idle" || phase === "processing" || phase === "pack") && (
          <div className="mx-auto mt-[18.79px] w-[330.944px] max-w-full">
            <WindowPanel>
            <div className="flex flex-col items-center px-[25px] pb-[28.6px] pt-0">
              <div className="flex flex-col items-center">
                <p
                  className="flex w-[224px] items-center justify-center text-center text-[18px] leading-[1.4] tracking-[0.9px] text-[#32322d]"
                  style={{
                    fontFamily: "Elice DX Neolli",
                    fontWeight: 500,
                  }}
                >
                  동물 사진 업로드
                </p>
              </div>
              <div
                className="mt-[11.67px] flex flex-col items-center gap-[9.61px] text-center text-[10px] leading-none tracking-[0.35px] text-[#6a6a61]"
                style={{
                  fontFamily: "Elice DX Neolli",
                  fontWeight: 300,
                }}
              >
                <p>최대한 얼굴과 몸이 잘 나온 사진을 올려주세요</p>
                <p>저작권에 문제 없는 이미지를 사용해주세요</p>
              </div>
              <button
                type="button"
                onClick={() => setShowImageGuide(true)}
                className="mt-[18.79px] block h-[21px] w-[109.49px] shrink-0 select-none overflow-hidden transition-transform duration-100 ease-out active:translate-y-[1px] active:scale-[0.98]"
                aria-label="이미지 가이드 보기"
              >
                <img
                  src={imgIntroImageGuideButton}
                  alt=""
                  className="pointer-events-none h-full w-full object-fill"
                  draggable={false}
                />
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    readFile(e.target.files[0]);
                  }
                }}
                className="hidden"
              />

              <button
                type="button"
                className="relative mt-[10.79px] h-[240px] w-[240px] overflow-hidden rounded-[4px]"
                style={{
                  background: "#f2ebdd",
                  border: isDragging
                    ? "2px dashed #628d38"
                    : "1.5px dashed #e9dfc8",
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  if (e.dataTransfer.files[0]) {
                    readFile(e.dataTransfer.files[0]);
                  }
                }}
                onClick={() => {
                  trackEvent("photo_picker_opened", {
                    has_existing_photo: !!uploadedImage,
                  });
                  fileInputRef.current?.click();
                }}
              >
                {uploadedImage ? (
                  <img
                    src={uploadedImage}
                    alt="업로드된 사진"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                ) : (
                  <span
                    className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-center text-[#8f7755]"
                    style={{
                      fontFamily: "Elice DX Neolli",
                      fontWeight: 500,
                    }}
                  >
                    <span className="text-[10px] leading-[1.5] tracking-[0.4px]">
                      사진을 드래그하거나
                      <br />
                      이미지 파일을 선택하세요
                    </span>
                    <span className="text-[9px] leading-none tracking-[0.25px] text-[#c6b99f]">
                      JPG, PNG, WEBP 파일 지원
                    </span>
                  </span>
                )}
              </button>

              <input
                type="text"
                value={characterName}
                onChange={(e) => {
                  const value = e.target.value;
                  if (Array.from(value).length > 6) {
                    setNameError("이름은 최대 6글자까지 입력할 수 있어요");
                    return;
                  }
                  if (isNameComposingRef.current || e.nativeEvent.isComposing) {
                    setCharacterName(value);
                    return;
                  }
                  const filteredValue = value.replace(NAME_FILTER, "");
                  setCharacterName(filteredValue);
                  setNameError("");
                }}
                onBeforeInput={(e) => {
                  const inputEvent = e.nativeEvent as InputEvent;
                  const target = e.currentTarget;
                  const hasSelection = target.selectionStart !== target.selectionEnd;
                  if (
                    inputEvent.inputType?.startsWith("insert") &&
                    !inputEvent.isComposing &&
                    !hasSelection &&
                    Array.from(target.value).length >= 6
                  ) {
                    e.preventDefault();
                    setNameError("이름은 최대 6글자까지 입력할 수 있어요");
                  }
                }}
                onCompositionStart={(e) => {
                  isNameComposingRef.current = true;
                  if (Array.from(e.currentTarget.value).length >= 6) {
                    setNameError("이름은 최대 6글자까지 입력할 수 있어요");
                  }
                }}
                onCompositionEnd={(e) => {
                  isNameComposingRef.current = false;
                  const filteredValue = e.currentTarget.value.replace(NAME_FILTER, "");
                  if (Array.from(filteredValue).length > 6) {
                    setCharacterName(Array.from(filteredValue).slice(0, 6).join(""));
                    setNameError("이름은 최대 6글자까지 입력할 수 있어요");
                    return;
                  }
                  setCharacterName(filteredValue);
                  setNameError("");
                }}
                maxLength={6}
                placeholder="이름을 작성해주세요"
                className="character-name-input mt-[22px] h-[56px] w-[250px] rounded-[12px] bg-white px-4 text-[15px] tracking-[0.4px] text-[#32322d] placeholder:text-[14px] placeholder:leading-[1.3] placeholder:tracking-[0.2px] placeholder:text-[#c9c2b4] focus:outline-none focus:ring-2 focus:ring-[#628d38]"
                style={{
                  fontWeight: 300,
                  border: "1px solid #e5dece",
                  boxShadow: "0 2px 6px rgba(104,85,62,0.06)",
                }}
              />

              <p
                className="mt-[7px] min-h-[14px] text-center text-[10px] leading-[1.4] tracking-[0.25px] text-[#c84f3d]"
                style={{ fontFamily: "Elice DX Neolli", fontWeight: 300 }}
                role={nameError ? "alert" : undefined}
              >
                {nameError}
              </p>

              <div className="mt-[16px]">
                <PixelButton
                  onClick={handleConvert}
                  disabled={!isButtonActive}
                  showPaw
                  imageSrc={isButtonActive ? imgBtnLgActive : imgBtnLg}
                  ariaLabel="변환하기"
                >
                  <span
                    className="w-full text-center text-[16px] tracking-[1.6px] text-white"
                    style={{
                      fontFamily: "Elice DX Neolli",
                      fontWeight: 500,
                    }}
                  >
                    변환하기
                  </span>
                </PixelButton>
              </div>
              {generationError && !showGenerationErrorModal && (
                <pre
                  className="mt-3 min-h-[18px] max-w-[280px] whitespace-pre-wrap break-words text-center text-[10px] leading-[1.5] tracking-[0.3px] text-[#c84f3d]"
                  style={{
                    fontFamily: "Elice DX Neolli",
                    fontWeight: 300,
                  }}
                >
                  {generationError}
                </pre>
              )}
            </div>
          </WindowPanel>
          </div>
        )}

        {phase === "processing" && (
          <ProcessingPanel uploadedImage={uploadedImage} />
        )}

        {phase === "pack" && (
          <CardPackPanel onOpen={handleOpenPack} />
        )}
      </main>

      <footer className="relative w-full max-w-[397px] shrink-0">
        <img
          src={imgIntroFooter}
          alt="POCHAKFARM footer"
          className="block w-full"
          draggable={false}
        />
        {[
          { label: "인스타그램", target: "instagram", href: "https://www.instagram.com/pochakfarm.official/", className: "left-[78.5%] top-[13.9%] h-[14%] w-[6.8%]" },
          { label: "이메일", target: "email", href: "mailto:somagochi2026@gmail.com", className: "left-[87.8%] top-[13.9%] h-[14%] w-[6.8%]" },
          { label: "이용약관", target: "terms", href: "https://painted-sunspot-251.notion.site/399209062fbe80b683f0c16882b0357d?pvs=73", className: "left-[7.4%] top-[52.5%] h-[8.5%] w-[12.4%]" },
          { label: "개인정보처리방침", target: "privacy", href: "https://painted-sunspot-251.notion.site/38f209062fbe8014beb2e6403bbd15e6?pvs=74", className: "left-[25.6%] top-[52.5%] h-[8.5%] w-[23.6%]" },
          { label: "사전예약 이벤트 규약", target: "event_terms", href: "https://painted-sunspot-251.notion.site/395209062fbe80f4968ee01c8f20e6e8", className: "left-[55.1%] top-[52.5%] h-[8.5%] w-[28.3%]" },
        ].map((link) => (
          <a
            key={link.target}
            href={link.href}
            target={link.href.startsWith("mailto:") ? undefined : "_blank"}
            rel={link.href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
            aria-label={link.label}
            className={`absolute cursor-pointer ${link.className}`}
            onClick={() => {
              trackEvent("intro_footer_link_clicked", {
                target: link.target,
              });
            }}
          />
        ))}
      </footer>

      {(phase === "dim" || phase === "result") &&
        uploadedImage && (
          <PackOpeningOverlay
            characterName={characterName}
            assets={generatedAssets ?? FALLBACK_CARD_ASSETS}
            isReady={conversionStatus === "success"}
            onStartPolling={startCharacterizationPolling}
            onResult={handleResult}
            onRegister={() => setRegistrationView("cta")}
          />
        )}
      {showGenerationErrorModal && (
        <div
          className="fixed inset-0 z-[260] flex items-center justify-center bg-black/60 px-6 backdrop-blur-[5px]"
          role="alertdialog"
          aria-modal="true"
          aria-label="변환 오류"
        >
          <div className="w-full max-w-[320px]">
            <WindowPanel>
              <div className="flex flex-col items-center px-7 py-7">
                <p
                  className="text-center text-[17px] tracking-[.6px] text-[#32322d]"
                  style={{ fontFamily: "Elice DX Neolli", fontWeight: 500 }}
                >
                  변환에 실패했어요
                </p>
                <pre
                  className="mt-4 max-h-[180px] w-full overflow-auto whitespace-pre-wrap break-words text-center text-[12px] leading-[1.6] text-[#c84f3d]"
                  style={{ fontFamily: "Elice DX Neolli", fontWeight: 300 }}
                >
                  {generationError}
                </pre>
                <button
                  type="button"
                  onClick={() => setShowGenerationErrorModal(false)}
                  className="mt-6 flex h-[44px] w-full items-center justify-center rounded-[8px] bg-[#628d38] text-[14px] tracking-[.8px] text-white"
                  style={{ fontFamily: "Elice DX Neolli", fontWeight: 500 }}
                >
                  확인
                </button>
              </div>
            </WindowPanel>
          </div>
        </div>
      )}
      {showImageGuide && (
        <div
          className="fixed inset-0 z-[240] flex items-center justify-center bg-black/55 px-4 py-6"
          role="dialog"
          aria-modal="true"
          aria-label="이미지 가이드"
        >
          <button
            type="button"
            className="absolute inset-0 cursor-default"
            aria-label="이미지 가이드 닫기"
            onClick={() => setShowImageGuide(false)}
          />
          <div className="relative z-[1] w-full max-w-[330px] overflow-hidden rounded-[8px]">
            <img
              src={imgImageGuideModal}
              alt="이미지 가이드"
              className="block w-full object-contain"
              draggable={false}
            />
            <div
              className="pointer-events-none absolute right-0 top-0 z-[2] h-[28px] w-[28px] bg-[#f2ebdd]"
              aria-hidden="true"
            />
            <button
              type="button"
              className="absolute right-[16px] top-[14px] z-[3] flex h-[40px] w-[40px] items-center justify-center bg-transparent text-[#9d9b91]"
              aria-label="이미지 가이드 닫기"
              onClick={() => setShowImageGuide(false)}
            >
              <XIcon className="h-[24px] w-[24px]" strokeWidth={3} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function ToastNotification({
  visible,
  onHidden,
}: {
  visible: boolean;
  onHidden?: () => void;
}) {
  const [phase, setPhase] = useState<"hidden" | "show" | "exit">("hidden");
  const onHiddenRef = useRef(onHidden);

  useEffect(() => {
    onHiddenRef.current = onHidden;
  }, [onHidden]);

  useEffect(() => {
    if (!visible) return;

    setPhase("show");
    const exitTimer = window.setTimeout(() => setPhase("exit"), 2200);
    const hiddenTimer = window.setTimeout(() => {
      setPhase("hidden");
      onHiddenRef.current?.();
    }, 2600);

    return () => {
      window.clearTimeout(exitTimer);
      window.clearTimeout(hiddenTimer);
    };
  }, [visible]);

  if (phase === "hidden") return null;

  const isVisible = phase === "show";

  return (
    <div
      className="fixed left-1/2 z-[220] flex w-[280px] items-center justify-center"
      style={{
        bottom: "48px",
        opacity: isVisible ? 1 : 0,
        transform: `translateX(-50%) translateY(${isVisible ? "0" : "24px"})`,
        transition: "transform 0.28s ease, opacity 0.28s ease",
      }}
    >
      <PixelCreamFrame height={46} role="status">
        <div className="flex h-full w-full items-center gap-3 px-4">
          <img
            src={imgToastPrimary}
            alt=""
            className="h-[24px] w-[24px] shrink-0 object-contain"
            draggable={false}
          />
          <span
            className="text-[13px] tracking-[0.7px] text-[#45372a]"
            style={{ fontFamily: "Elice DX Neolli", fontWeight: 500 }}
          >
            링크가 복사되었습니다
          </span>
        </div>
      </PixelCreamFrame>
    </div>
  );
}

function EarlyRegistrationDialog({
  characterizationId,
  onClose,
  onComplete,
}: {
  characterizationId: string | null;
  onClose: () => void;
  onComplete: () => void;
}) {
  const [phone, setPhone] = useState("");
  const [required, setRequired] = useState(false);
  const [view, setView] = useState<"form" | "terms">("form");
  const [registrationError, setRegistrationError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const digits = phone.replace(/\D/g, "");
  const formattedPhone =
    digits.length <= 3
      ? digits
      : digits.length <= 7
        ? `${digits.slice(0, 3)}-${digits.slice(3)}`
        : `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7, 11)}`;
  const canSubmit = digits.length === 11 && required;
  const canBypassRegistration =
    new URLSearchParams(window.location.search).get("preview") === "1";

  useEffect(() => {
    trackEvent("registration_dialog_viewed");
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!canSubmit || isSubmitting) return;

    trackEvent("registration_submit_clicked");
    setRegistrationError("");
    setIsSubmitting(true);

    try {
      const numericCharacterizationId = Number(characterizationId);
      if (
        !Number.isSafeInteger(numericCharacterizationId) ||
        numericCharacterizationId <= 0
      ) {
        throw new Error("캐릭터 정보를 확인할 수 없어요.");
      }

      const response = await fetch("/api/pre-registrations", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phoneNumber: formattedPhone,
          requiredConsent: true,
          characterizationId: numericCharacterizationId,
        }),
      });
      const isJsonResponse = response.headers
        .get("content-type")
        ?.includes("application/json");
      const payload = isJsonResponse
        ? await response.json().catch(() => ({}))
        : {};

      if (!response.ok) {
        throw new Error(
          payload.error || "사전예약 등록에 실패했어요.",
        );
      }

      if (!isJsonResponse) {
        throw new Error("사전예약 API 응답이 올바르지 않아요.");
      }

      onComplete();
    } catch (error) {
      if (canBypassRegistration) {
        onComplete();
        return;
      }

      setRegistrationError(
        error instanceof Error
          ? error.message
          : "사전예약 등록에 실패했어요.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }, [
    canBypassRegistration,
    canSubmit,
    characterizationId,
    formattedPhone,
    isSubmitting,
    onComplete,
  ]);
  const termsSections = [
    {
      title: "수집·이용 목적",
      items: [
        "사전예약 신청 접수 및 신청자 확인",
        "앱 출시 시 다운로드 링크 안내",
        "사전예약 보상 쿠폰 번호 발송",
        "중복 신청 방지",
      ],
    },
    {
      title: "수집 항목",
      items: ["휴대전화번호"],
    },
    {
      title: "보유 및 이용 기간",
      items: [
        "사전예약 이벤트 종료 후 1개월까지",
        "단, 관련 법령에 따라 보관이 필요한 경우 해당 법령에서 정한 기간 동안 보관",
      ],
    },
    {
      title: "동의 거부 권리 및 불이익",
      items: [
        "이용자는 개인정보 수집 및 이용에 대한 동의를 거부할 수 있습니다.",
        "다만, 필수 항목에 동의하지 않을 경우 사전예약 신청, 앱 출시 안내 및 사전예약 보상 쿠폰 제공이 제한됩니다.",
      ],
    },
  ];

  return (
    <div
      className="fixed inset-0 z-[210] flex items-center justify-center bg-black/70 px-4"
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          trackEvent("registration_dialog_closed", {
            method: "backdrop",
          });
          onClose();
        }
      }}
    >
      <div
        className="relative max-h-[calc(100dvh-32px)] w-[314px] overflow-y-auto rounded-[5px] bg-[#faf5eb] px-[38px] pb-[34px] pt-[30px]"
        style={{
          border: "2px solid #1f1a13",
          boxShadow: "0 4px 0 #1f1a13",
        }}
      >
        <div className="relative text-center">
          <button
            type="button"
            onClick={() => {
              trackEvent("registration_dialog_closed", {
                method: "button",
              });
              onClose();
            }}
            className="absolute right-[-30px] top-[-20px] flex h-8 w-8 items-center justify-center text-[28px] leading-none text-[#b7ad9a]"
            aria-label="닫기"
          >
            x
          </button>
          {view === "terms" ? (
            <h2
              className="text-[19px] leading-[1.4] tracking-[0.3px] text-[#36501e]"
              style={{ fontFamily: "Elice DX Neolli", fontWeight: 500 }}
            >
              개인정보 수집 및 이용 동의
            </h2>
          ) : (
            <img
              src={imgRegistrationModalHeading}
              alt="1기 포착팜 등록. 앱이 출시되면 문자를 통해 앱 링크와 보상 쿠폰번호를 보내드려요!"
              className="h-auto w-[270px] max-w-full object-contain"
              draggable={false}
            />
          )}
        </div>

        {view === "form" ? (
          <>
            <label
              className="mt-[18px] block text-[12px] tracking-[0.2px] text-[#1f1a13]"
              style={{ fontFamily: "Elice DX Neolli", fontWeight: 500 }}
            >
              전화번호
            </label>
            <input
              type="tel"
              value={formattedPhone}
              onChange={(event) => {
                setPhone(event.target.value.replace(/\D/g, "").slice(0, 11));
                setRegistrationError("");
              }}
              placeholder="010-0000-0000"
              className={`mt-[8px] h-[57px] w-full rounded-[10px] border bg-white px-[16px] text-[16px] tracking-[1.1px] text-[#32322d] placeholder:text-[#aaa398] focus:outline-none ${
                registrationError
                  ? "border-[#d94b3d] focus:border-[#d94b3d]"
                  : "border-[#ded6c9] focus:border-[#628d38]"
              }`}
              style={{ fontFamily: "Elice DX Neolli", fontWeight: 300 }}
            />
            {registrationError && (
              <p
                className="mt-2 text-[10px] leading-[1.4] tracking-[0.3px] text-[#d94b3d]"
                style={{ fontFamily: "Elice DX Neolli", fontWeight: 500 }}
              >
                {registrationError}
              </p>
            )}

            <div className="mt-[16px]">
              <div className="flex items-center text-left">
              <button
                type="button"
                onClick={() =>
                  setRequired((value) => {
                    return !value;
                  })
                }
                className="flex min-w-0 flex-1 items-center gap-[7px] text-left"
              >
                <span
                  className="flex h-[16px] w-[16px] shrink-0 items-center justify-center rounded-[3px] text-[11px] leading-none text-white"
                  style={{
                    border: `1px solid ${required ? "#628d38" : "#cdb792"}`,
                    background: required ? "#628d38" : "white",
                  }}
                >
                  {required ? "✓" : ""}
                </span>
                <img
                  src={imgRequiredPrivacyConsent}
                  alt="[필수] 개인정보 수집 및 이용 동의"
                  className="h-auto w-[150px] max-w-full object-contain"
                  draggable={false}
                />
              </button>
              <button
                type="button"
                onClick={() => {
                  setView("terms");
                }}
                className="ml-[9px] shrink-0 cursor-pointer text-[10px] tracking-[0.2px] text-[#628d38] underline-offset-2"
                style={{ fontFamily: "Elice DX Neolli", fontWeight: 500 }}
              >
                보기
              </button>
              </div>
              <img
                src={imgPrivacyRetentionNotice}
                alt="휴대폰 번호는 앱 출시 안내 및 사전예약 보상 쿠폰 발송 목적으로만 사용되며, 사전예약 이벤트 종료 후 1개월 뒤 삭제됩니다."
                className="mt-[10px] h-auto w-full object-contain"
                draggable={false}
              />
            </div>

            <div className="mt-[27px] flex justify-center">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!canSubmit || isSubmitting}
                className="relative flex h-[52px] w-full items-center justify-center text-[19px] tracking-[1.4px] text-white transition-opacity"
                style={{
                  background: "#36501e",
                  clipPath:
                    "polygon(6px 0, calc(100% - 6px) 0, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0 calc(100% - 6px), 0 6px)",
                  cursor: canSubmit && !isSubmitting ? "pointer" : "not-allowed",
                  fontFamily: "Elice DX Neolli",
                  fontWeight: 500,
                  opacity: canSubmit && !isSubmitting ? 1 : 0.45,
                }}
              >
                {isSubmitting ? "등록 중..." : "등록하기"}
                <PawMark color="#78985a" />
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="mt-5 max-h-[390px] overflow-y-auto rounded-[8px] border border-[#cdb792] bg-[#fffdf8] px-4 py-4">
              <p
                className="text-[10px] leading-[1.65] tracking-[0.35px] text-[#45372a]"
                style={{ fontFamily: "Elice DX Neolli", fontWeight: 300 }}
              >
                포착팜은 얼리 농장주 사전예약 신청 및 사전예약 보상 제공을 위해 아래와 같이 개인정보를 수집·이용합니다.
              </p>

              {termsSections.map((section) => (
                <div key={section.title} className="mt-4">
                  <p
                    className="text-[11px] tracking-[0.5px] text-[#628d38]"
                    style={{ fontFamily: "Elice DX Neolli", fontWeight: 500 }}
                  >
                    {section.title}
                  </p>
                  <ul className="mt-2 flex flex-col gap-1.5">
                    {section.items.map((item) => (
                      <li
                        key={item}
                        className="flex gap-2 text-[10px] leading-[1.55] tracking-[0.3px] text-[#6a6a61]"
                        style={{ fontFamily: "Elice DX Neolli", fontWeight: 300 }}
                      >
                        <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-[#cdb792]" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => {
                setView("form");
              }}
              className="mx-auto mt-5 flex h-[52px] w-full items-center justify-center rounded-[10px] bg-[#628d38] text-[15px] tracking-[1.2px] text-white"
              style={{ fontFamily: "Elice DX Neolli", fontWeight: 500 }}
            >
              확인
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function HomeConfirmDialog({
  onClose,
  onConfirm,
}: {
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-[230] flex items-center justify-center bg-black/70 px-4"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="home-confirm-title"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        className="relative w-[314px] rounded-[5px] bg-[#faf5eb] px-[30px] pb-[30px] pt-[30px]"
        style={{
          border: "2px solid #1f1a13",
          boxShadow: "0 4px 0 #1f1a13",
        }}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-[8px] top-[6px] flex h-8 w-8 items-center justify-center text-[28px] leading-none text-[#b7ad9a]"
          aria-label="닫기"
        >
          x
        </button>
        <h2
          id="home-confirm-title"
          className="text-center text-[19px] leading-[1.4] tracking-[0.3px] text-[#36501e]"
          style={{ fontFamily: "Elice DX Neolli", fontWeight: 500 }}
        >
          잠깐! 이미지 저장하셨나요?
        </h2>
        <p
          className="mt-[18px] text-center text-[12px] leading-[1.6] tracking-[0.25px] text-[#6a6a61]"
          style={{ fontFamily: "Elice DX Neolli", fontWeight: 300 }}
        >
          지금 홈으로 돌아가면 이미지를
          <br />
          다시 확인할 수 없어요
        </p>
        <div className="mt-[26px] grid grid-cols-2 gap-[10px]">
          <button
            type="button"
            onClick={onClose}
            className="flex h-[46px] items-center justify-center rounded-[6px] border-2 border-[#36501e] bg-[#faf5eb] text-[14px] tracking-[0.7px] text-[#36501e]"
            style={{ fontFamily: "Elice DX Neolli", fontWeight: 500 }}
          >
            뒤로가기
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex h-[46px] items-center justify-center rounded-[6px] bg-[#36501e] text-[14px] tracking-[0.7px] text-white"
            style={{ fontFamily: "Elice DX Neolli", fontWeight: 500 }}
          >
            홈으로
          </button>
        </div>
      </div>
    </div>
  );
}

function CTAPage({
  characterName,
  cardImage,
  cardBackImage,
  characterizationId,
  isSharedEntry,
  onCreateNew,
  onComplete,
}: {
  characterName: string;
  cardImage: string | null;
  cardBackImage: string | null;
  characterizationId: string | null;
  isSharedEntry: boolean;
  onCreateNew: () => void;
  onComplete: () => void;
}) {
  const [showDialog, setShowDialog] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [showHomeConfirm, setShowHomeConfirm] = useState(false);

  useEffect(() => {
    trackEvent("cta_page_viewed", {
      has_character_name: !!characterName,
      has_card_image: !!cardImage,
      has_card_back_image: !!cardBackImage,
      has_characterization_id: !!characterizationId,
      is_shared_entry: isSharedEntry,
    });
  }, [cardBackImage, cardImage, characterName, characterizationId, isSharedEntry]);

  const handleShare = async () => {
    trackEvent("cta_share_clicked");
    if (await copyShareLink(createCtaShareLink(characterizationId))) {
      setShowToast(true);
    }
  };

  const handleImageSave = async () => {
    trackEvent("card_save_clicked");
    try {
      await saveCardImage(cardImage || imgCharFront, characterName || "pixel-animal");
    } catch (error) {
      trackEvent("card_save_failed", {
        message: error instanceof Error ? error.message : "unknown_error",
      });
    }
  };

  return (
    <div className="relative flex min-h-[100dvh] w-full flex-col items-center overflow-x-hidden bg-[#111111]">
      <style>{KEYFRAMES}</style>
      <main
        className="relative flex min-h-[100dvh] w-full max-w-[397px] flex-col items-center px-[14px] pb-[24px]"
        style={{
          backgroundImage: `url("${imgIntroBg}")`,
          backgroundPosition: "top center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "100% auto",
        }}
      >
        <IntroHeader onHome={onCreateNew} />
        <div className="flex w-full flex-1 items-center justify-center py-[24px]">
        <div className="w-full max-w-[331px]">
          <WindowPanel>
          <div className="flex flex-col items-center gap-4 px-6 pb-6 pt-[27px]">
            <div className="flex h-[80.4px] w-[211px] flex-col items-center justify-start text-center">
              <p
                className="text-[17px] leading-[1.4] tracking-[0.9px] text-[#32322d]"
                style={{ fontFamily: "Elice DX Neolli", fontWeight: 500 }}
              >
                {characterName || "픽셀 동물"}을
                <br />
                농장에 입주시킬 수 있어요
              </p>
              <p
                className="mt-[20.4px] text-[10px] tracking-[0.4px] text-[#6a6a61]"
                style={{ fontFamily: "Elice DX Neolli", fontWeight: 300 }}
              >
                사전등록하면 출시 소식과 보상을 알려드려요
              </p>
            </div>

            <div className="relative h-[220px] w-[204px]">
              {cardImage ? (
                <>
                  <div className="absolute right-[10px] top-[6px] h-[206.02px] w-[143.05px] rotate-[9deg] overflow-hidden rounded-[7px]">
                    <img
                      src={cardBackImage || imgCardBack}
                      alt=""
                      className="absolute left-1/2 top-1/2 h-[211px] w-[147px] max-w-none -translate-x-1/2 -translate-y-1/2 object-fill"
                      draggable={false}
                    />
                  </div>
                  <img
                    src={cardImage}
                    alt=""
                    className="absolute left-[13px] top-0 h-[206.02px] w-[143.05px] rotate-[-2deg] object-contain drop-shadow-[0_10px_14px_rgba(65,52,35,0.22)]"
                    draggable={false}
                  />
                </>
              ) : (
                <div role="status" aria-label="카드 이미지를 불러오는 중">
                  <div className="absolute right-[10px] top-[6px] h-[206.02px] w-[143.05px] rotate-[9deg] animate-pulse rounded-[7px] border border-[#d8ccb5] bg-[#e7ddca]" />
                  <div className="absolute left-[13px] top-0 flex h-[206.02px] w-[143.05px] rotate-[-2deg] animate-pulse flex-col items-center justify-center gap-3 rounded-[7px] border border-[#d8ccb5] bg-[#f0e8d9] shadow-[0_10px_14px_rgba(65,52,35,0.14)]">
                    <div className="h-[86px] w-[86px] rounded-[6px] bg-[#ddd1bc]" />
                    <div className="h-[10px] w-[92px] rounded-full bg-[#ddd1bc]" />
                    <div className="h-[8px] w-[64px] rounded-full bg-[#e3d8c5]" />
                  </div>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={handleImageSave}
              disabled={!cardImage}
              className="relative h-[42px] w-[105.15px] overflow-hidden text-transparent disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="이미지 저장"
            >
              <img
                src={imgCtaImageSaveButton}
                alt=""
                className="absolute inset-0 h-full w-full object-fill"
                draggable={false}
              />
              이미지 저장
            </button>

            <img
              src={imgCtaRewardCard}
              alt="포착팜 오픈 알림 혜택"
              className="w-full object-contain"
              draggable={false}
            />

            <div className="hidden">
              <p
                className="mb-2 text-center text-[11px] tracking-[1.1px] text-[#68553e]"
                style={{ fontFamily: "Elice DX Neolli", fontWeight: 500 }}
              >
                사전등록 보상
              </p>
              {["1기 포착단 한정 뱃지", "코인 3000개", "사전예약 한정 유니크 동물 적토마 지급"].map(
                (reward, index) => (
                  <div key={reward} className="mt-2 flex items-center gap-2">
                    {index < 3 ? (
                      <img
                        src={[imgBtnSmall, imgBtnSmall2, imgBtnSmall3][index]}
                        alt=""
                        className="h-[24px] w-[24px] shrink-0 object-contain"
                        draggable={false}
                      />
                    ) : (
                      <span className="h-4 w-4 shrink-0 rounded-[3px] border border-[#cdb792] bg-white" />
                    )}
                    <span
                      className="text-[10px] tracking-[0.4px] text-[#6a6a61]"
                      style={{
                        fontFamily: "Elice DX Neolli",
                        fontWeight: 500,
                      }}
                    >
                      {reward}
                    </span>
                  </div>
                ),
              )}
            </div>

            <div className="flex flex-col items-center gap-[7.09px]">
              {!isSharedEntry && (
                <PixelButton
                  onClick={() => {
                    setShowDialog(true);
                  }}
                  showPaw
                  imageSrc={imgBtnOpenAlertLg}
                  ariaLabel="오픈 알림 받기"
                >
                  오픈 알림 받기
                </PixelButton>
              )}

              <PixelButton
                onClick={
                  isSharedEntry
                    ? () => {
                        trackEvent("shared_cta_create_clicked");
                        onCreateNew();
                      }
                    : handleShare
                }
                variant={isSharedEntry ? "primary" : "secondary"}
                showPaw
                imageSrc={isSharedEntry ? imgBtnCaptureTooLg : imgBtnBragLg}
                imageTintColor={isSharedEntry ? "#f9cd50" : undefined}
                ariaLabel={isSharedEntry ? "나도 포착하기" : "친구에게 자랑하기"}
              >
                {isSharedEntry ? "나도 포착하기" : "친구에게 자랑하기"}
              </PixelButton>

              <button
                type="button"
                onClick={() => {
                  trackEvent("cta_home_clicked");
                  setShowHomeConfirm(true);
                }}
                className="mt-[3px] cursor-pointer text-[11px] tracking-[0.35px] text-[#6a6a61] transition-colors hover:text-[#32322d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#628d38]/60"
                style={{ fontFamily: "Elice DX Neolli", fontWeight: 300 }}
              >
                홈으로 돌아가기
              </button>
            </div>
          </div>
          </WindowPanel>
        </div>
        </div>
      </main>

      <footer className="relative w-full max-w-[397px] shrink-0">
        <img
          src={imgIntroFooter}
          alt="POCHAKFARM footer"
          className="block w-full"
          draggable={false}
        />
        {[
          { label: "인스타그램", target: "instagram", href: "https://www.instagram.com/pochakfarm.official/", className: "left-[78.5%] top-[13.9%] h-[14%] w-[6.8%]" },
          { label: "이메일", target: "email", href: "mailto:somagochi2026@gmail.com", className: "left-[87.8%] top-[13.9%] h-[14%] w-[6.8%]" },
          { label: "이용약관", target: "terms", href: "https://painted-sunspot-251.notion.site/399209062fbe80b683f0c16882b0357d?pvs=73", className: "left-[7.4%] top-[52.5%] h-[8.5%] w-[12.4%]" },
          { label: "개인정보처리방침", target: "privacy", href: "https://painted-sunspot-251.notion.site/38f209062fbe8014beb2e6403bbd15e6?pvs=74", className: "left-[25.6%] top-[52.5%] h-[8.5%] w-[23.6%]" },
          { label: "사전예약 이벤트 규약", target: "event_terms", href: "https://painted-sunspot-251.notion.site/395209062fbe80f4968ee01c8f20e6e8", className: "left-[55.1%] top-[52.5%] h-[8.5%] w-[28.3%]" },
        ].map((link) => (
          <a
            key={link.target}
            href={link.href}
            target={link.href.startsWith("mailto:") ? undefined : "_blank"}
            rel={link.href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
            aria-label={link.label}
            className={`absolute cursor-pointer ${link.className}`}
            onClick={() => {
              trackEvent("cta_footer_link_clicked", {
                target: link.target,
              });
            }}
          />
        ))}
      </footer>

      <ToastNotification
        visible={showToast}
        onHidden={() => setShowToast(false)}
      />
      {showDialog && (
        <EarlyRegistrationDialog
          characterizationId={characterizationId}
          onClose={() => setShowDialog(false)}
          onComplete={() => {
            trackEvent("cta_registration_completed");
            setShowDialog(false);
            onComplete();
          }}
        />
      )}
      {showHomeConfirm && (
        <HomeConfirmDialog
          onClose={() => setShowHomeConfirm(false)}
          onConfirm={() => {
            trackEvent("cta_home_confirmed");
            setShowHomeConfirm(false);
            onCreateNew();
          }}
        />
      )}
    </div>
  );
}

function CompletePage({
  cardImage,
  cardBackImage,
  onCreateNew,
}: {
  cardImage: string | null;
  cardBackImage: string | null;
  onCreateNew: () => void;
}) {
  useEffect(() => {
    trackEvent("registration_complete_page_viewed");
  }, []);

  const handleCreateNew = () => {
    onCreateNew();
  };

  return (
    <div className="min-h-[100dvh] w-full bg-[#628d38] flex justify-center relative overflow-hidden">
      <style>{KEYFRAMES}</style>
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage: `url("${imgBgPattern}")`,
          backgroundRepeat: "repeat",
          backgroundSize: "361px",
        }}
      />
      <main className="relative flex min-h-[100dvh] w-full max-w-[360px] flex-col justify-center px-[14px] pb-4 pt-[24px]">
        <WindowPanel>
          <div className="flex flex-col items-center px-6 pb-5 pt-[30.33px]">
            <p
              className="text-center text-[20px] leading-[1.35] tracking-[0.4px] text-[#32322d]"
              style={{ fontFamily: "Elice DX Neolli", fontWeight: 500 }}
            >
              등록 완료
            </p>
            <p
              className="mt-[12px] text-center text-[11px] tracking-[0.2px] text-[#6a6a61]"
              style={{ fontFamily: "Elice DX Neolli", fontWeight: 300 }}
            >
              앱이 오픈되면 문자로 알려드릴게요
            </p>

            <div className="relative mt-[34px] h-[220px] w-[204px]">
              {cardImage ? (
                <>
                  <div className="absolute right-[10px] top-[6px] h-[206.02px] w-[143.05px] rotate-[9deg] overflow-hidden rounded-[7px]">
                    <img
                      src={cardBackImage || imgCardBack}
                      alt="카드 뒷면"
                      className="absolute left-1/2 top-1/2 h-[211px] w-[147px] max-w-none -translate-x-1/2 -translate-y-1/2 object-fill"
                      draggable={false}
                    />
                  </div>
                  <img
                    src={cardImage}
                    alt="카드 앞면"
                    className="absolute left-[13px] top-0 h-[206.02px] w-[143.05px] rotate-[-2deg] object-contain drop-shadow-[0_10px_14px_rgba(65,52,35,0.22)]"
                    draggable={false}
                  />
                </>
              ) : (
                <div role="status" aria-label="카드 이미지를 불러오는 중">
                  <div className="absolute right-[10px] top-[6px] h-[206.02px] w-[143.05px] rotate-[9deg] animate-pulse rounded-[7px] border border-[#d8ccb5] bg-[#e7ddca]" />
                  <div className="absolute left-[13px] top-0 flex h-[206.02px] w-[143.05px] rotate-[-2deg] animate-pulse flex-col items-center justify-center gap-3 rounded-[7px] border border-[#d8ccb5] bg-[#f0e8d9] shadow-[0_10px_14px_rgba(65,52,35,0.14)]">
                    <div className="h-[86px] w-[86px] rounded-[6px] bg-[#ddd1bc]" />
                    <div className="h-[10px] w-[92px] rounded-full bg-[#ddd1bc]" />
                    <div className="h-[8px] w-[64px] rounded-full bg-[#e3d8c5]" />
                  </div>
                </div>
              )}
            </div>

            <img
              src={imgCompleteNoticeCard}
              alt="안내사항"
              className="mt-[34px] w-full object-contain"
              draggable={false}
            />

            <div className="hidden">
              <p
                className="text-center text-[13px] tracking-[0.3px] text-[#68553e]"
                style={{ fontFamily: "Elice DX Neolli", fontWeight: 500 }}
              >
                안내사항
              </p>
              <div className="mt-[12px] space-y-[5px]">
              {[
                "출시 알림은 문자로 발송됩니다",
                "사전예약 보상은 앱 출시 후 계정당 1회 지급됩니다",
                "이벤트/혜택 알림 수신 동의를 하지 않을 경우 보상 제공 대상자에서 제외됩니다.",
                "변경을 원하시는 경우 아래 연락처로 문의 부탁드립니다.",
              ].map((text) => (
                <p
                  key={text}
                  className="text-[9px] leading-[1.45] tracking-[0.05px] text-[#8f8a80]"
                  style={{ fontFamily: "Elice DX Neolli", fontWeight: 300 }}
                >
                  · {text}
                </p>
              ))}
              </div>
            </div>
            <div className="mt-[26.8px]">
              <PixelButton
                onClick={handleCreateNew}
                variant="secondary"
                showPaw
                imageSrc={imgBtnNew}
                ariaLabel="새로운 캐릭터 만들기"
              >
                새로운 캐릭터 만들기
              </PixelButton>
            </div>
          </div>
        </WindowPanel>
      </main>
    </div>
  );
}

// ── App Router ────────────────────────────────────────────────
export default function App() {
  return <ClassicV2Version />;
}
