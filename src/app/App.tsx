import {
  useState,
  useRef,
  useEffect,
  useCallback,
} from "react";
import { trackEvent } from "../analytics";
import imgBtnSmall from "../assets/ui/btn-sm.png";
import imgBtnSmall2 from "../assets/ui/btn-sm-2.png";
import imgBtnSmall3 from "../assets/ui/btn-sm-3.png";
import imgBtnLg from "../assets/ui/btn-lg.png";
import imgBtnSave from "../assets/ui/btn-save.png";
import imgBtnShare from "../assets/ui/btn-share.png";
import imgBtnAlrim from "../assets/ui/btn-alrim.png";
import imgBtnNew from "../assets/ui/btn-new.png";
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

// Card pack (POCHAKFARM green pack)
import imgCardPack from "../assets/ui/card-pack.png";

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

type GeneratedCardAssets = {
  cardImage: string;
  cardBackImage: string;
  aiImage: string;
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

const FALLBACK_CARD_ASSETS: GeneratedCardAssets = {
  cardImage: imgCharFront,
  cardBackImage: imgCardBack,
  aiImage: imgCharFront,
};

const ONBOARDING_SLIDES = [
  "/assets/carousel1.png",
  "/assets/carousel2.png",
  "/assets/carousel3.png",
  "/assets/carousel4.png",
];
const LAUNCH_TARGET_TIME = new Date("2026-08-01T00:00:00+09:00").getTime();
const LOADING_ANIMAL_ICON = "/assets/loading-animal.png";
const LOADING_WARNING_ICON = "/assets/warning.png";

const KEYFRAMES = `
  @keyframes float      { 0%,100%{transform:translateY(0)}   50%{transform:translateY(-10px)} }
  @keyframes wobble     { 0%,100%{transform:rotate(-1.5deg)} 50%{transform:rotate(1.5deg)} }
  @keyframes spotlight  { 0%,100%{opacity:0.7}              50%{opacity:1} }
  @keyframes dogBreath  { 0%,100%{opacity:1}                50%{opacity:0.12} }
  @keyframes softPulse  { 0%,100%{transform:scale(1)}        50%{transform:scale(1.05)} }
`;

type Phase = "idle" | "processing" | "pack" | "dim" | "result";

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

function createCtaShareLink(_characterName: string, _aiImage: string | null) {
  const url = new URL(window.location.pathname || "/", window.location.origin);
  return url.toString();
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
      <div className="relative -mt-px w-full overflow-hidden shrink-0">
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
        className="relative w-full shrink-0 overflow-hidden"
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
      className="pointer-events-none absolute left-1/2 top-[65%] z-[2] w-[318px] max-w-[86%] -translate-x-1/2"
      aria-label={`출시까지 ${countdown.days}일 ${countdown.hours}시 ${countdown.minutes}분 ${countdown.seconds}초`}
    >
      <img
        src={imgIntroCountdownPanel}
        alt=""
        className="block w-full"
        draggable={false}
      />
      <div
        className="absolute left-0 right-0 top-[18%] text-center text-[15px] leading-none text-white"
        style={{
          fontFamily: "Galmuri11",
          fontWeight: 700,
          letterSpacing: "0.38em",
          textShadow:
            "0 0 6px rgba(255,255,255,0.9), 0 0 14px rgba(210,255,255,0.65)",
        }}
      >
        앞으로 출시까지
      </div>
      <div
        className="absolute left-[15.5%] right-[15.5%] top-[43.5%] flex items-center justify-between text-center text-[23px] leading-none text-white"
        style={{
          fontFamily: "Galmuri11",
          fontWeight: 700,
          textShadow:
            "0 0 6px rgba(255,255,255,0.95), 0 0 14px rgba(210,255,255,0.85)",
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
        className="absolute left-[16%] right-[16%] top-[69%] grid grid-cols-4 text-center text-[11px] leading-none text-white"
        style={{
          fontFamily: "Galmuri11",
          fontWeight: 700,
          textShadow:
            "0 0 6px rgba(255,255,255,0.9), 0 0 12px rgba(210,255,255,0.65)",
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

function OnboardingCarousel({
  initialSlide = 0,
  className = "mt-4",
}: {
  initialSlide?: number;
  className?: string;
}) {
  const [activeSlide, setActiveSlide] = useState(initialSlide);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const scrollTimerRef = useRef<number>();

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlide((slide) => (slide + 1) % ONBOARDING_SLIDES.length);
    }, 4000);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    scroller.scrollTo({
      left: activeSlide * scroller.clientWidth,
      behavior: "smooth",
    });
  }, [activeSlide]);

  const handleScroll = useCallback(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    if (scrollTimerRef.current) {
      window.clearTimeout(scrollTimerRef.current);
    }

    scrollTimerRef.current = window.setTimeout(() => {
      const nextSlide = Math.round(scroller.scrollLeft / scroller.clientWidth);
      setActiveSlide(
        Math.max(0, Math.min(ONBOARDING_SLIDES.length - 1, nextSlide)),
      );
    }, 120);
  }, []);

  return (
    <>
      <div
        ref={scrollerRef}
        onScroll={handleScroll}
        className={`${className} mx-auto flex h-[291px] w-[264px] snap-x snap-mandatory overflow-x-auto scroll-smooth`}
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
              trackEvent("onboarding_slide_selected", {
                slide_index: index + 1,
              });
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

// ── ProcessingPanel — card pack inside window frame ───────────
function ProcessingPanel() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const DURATION = 22000;
    const start = Date.now();
    let rafId: number;
    const tick = () => {
      const p = Math.min((Date.now() - start) / DURATION, 0.95);
      setProgress(p);
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  const loadingPercent = Math.min(95, Math.round(progress * 100));

  return (
    <div className="flex w-full flex-col items-center">
      <WindowPanel>
        <div className="flex min-h-[590px] flex-col items-center px-6 pb-5 pt-0">
          <div className="flex w-full flex-col items-center">
            <div
              className="relative flex h-[82px] w-[92px] items-center justify-center"
              style={{ animation: "softPulse 1.6s ease-in-out infinite" }}
            >
              <img
                src={LOADING_ANIMAL_ICON}
                alt=""
                className="absolute h-[70px] w-[78px] object-contain opacity-20"
                draggable={false}
              />
              <div
                className="absolute h-[70px] w-[78px]"
                style={{
                  clipPath: `inset(${100 - loadingPercent}% 0 0 0)`,
                  transition: "clip-path 0.1s linear",
                }}
                aria-hidden="true"
              >
                <img
                  src={LOADING_ANIMAL_ICON}
                  alt=""
                  className="absolute h-[70px] w-[78px] object-contain"
                  draggable={false}
                />
              </div>
              <span
                className="relative z-10 rounded-full bg-[#faf5eb]/85 px-2 py-1 text-[12px] tracking-[0.6px] text-[#36501e]"
                style={{
                  fontFamily: "Galmuri11",
                  fontWeight: 700,
                  boxShadow: "0 1px 0 rgba(104,85,62,0.18)",
                }}
              >
                {loadingPercent}%
              </span>
            </div>

            <p
              className="mt-[19.94px] text-center text-[10px] tracking-[1.1px] text-[#628d38]"
              style={{ fontFamily: "Galmuri11", fontWeight: 700 }}
            >
              ANALIZING...
            </p>
            <p
              className="mt-[6.35px] text-center text-[18px] leading-[1.35] tracking-[0.7px] text-[#32322d]"
              style={{
                fontFamily: "Elice DX Neolli",
                fontWeight: 500,
              }}
            >
              동물을 분석하고 있어요
            </p>
            <div
              className="mt-[19.94px] flex min-h-[48px] flex-col items-center gap-[9.61px] px-3 text-center text-[10px] leading-none tracking-[0.35px] text-[#8f7755]"
              style={{
                fontFamily: "Elice DX Neolli",
                fontWeight: 300,
              }}
            >
              <p className="text-[10px] text-[#6A6A61]">실제 앱에서는 더 빠르고 재밌있게</p>
              <p className="text-[10px] text-[#6A6A61]">포착할 수 있는 기능들을 만나볼 수 있어요</p>
              <span className="text-[8px] text-[#BFBFB6]">
                *웹사이트를 종료하더라도 변환은 유지돼요
              </span>
            </div>
          </div>

          <OnboardingCarousel className="mt-[33.81px]" />
        </div>
      </WindowPanel>
      <div className="mt-3 flex w-full items-center justify-center gap-[6px]">
        <img
          src={LOADING_WARNING_ICON}
          alt=""
          className="h-[24px] w-[24px] shrink-0 object-contain"
          draggable={false}
        />
        <p
          className="whitespace-nowrap text-left text-[8px] mt-2 leading-none text-[#f2ebdd]"
          style={{
            fontFamily: "Elice DX Neolli",
            fontWeight: 500,
            textShadow: "0 1px 0 rgba(54,80,30,0.5)",
          }}
        >
          새로고침하면 작업이 중단될 수 있습니다. 잠시만 기다려 주세요.
        </p>
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
function CardPackPanel({ onOpen }: { onOpen: () => void }) {
  return (
    <WindowPanel>
      <div className="flex min-h-[590px] flex-col items-center px-6 pb-5 pt-0">
        <div className="flex w-full flex-col items-center">
          <p
            className="text-center text-[13px] tracking-[1.4px] text-[#628d38]"
            style={{ fontFamily: "Galmuri11", fontWeight: 700 }}
          >
            CARD PACK READY!
          </p>

          <button
            type="button"
            onClick={onOpen}
            className="mt-5 cursor-pointer"
            style={{
              animation: "float 1.8s ease-in-out infinite",
            }}
            aria-label="카드팩 열기"
          >
            <img
              src={imgCardPack}
              alt="카드팩"
              className="drop-shadow-2xl"
              style={{
                width: "184px",
                animation: "wobble 2.2s ease-in-out infinite",
              }}
            />
          </button>

          <p
            className="mt-5 text-center text-[12px] tracking-[0.45px] text-[#8f7755]"
            style={{
              fontFamily: "Elice DX Neolli",
              fontWeight: 500,
            }}
          >
            탭해서 카드팩을 열어보세요!
          </p>
        </div>

        <OnboardingCarousel initialSlide={2} />
      </div>
    </WindowPanel>
  );
}

// ── PackOpeningOverlay ────────────────────────────────────────
// Sequence: pack → cut → pack fades + card shoots up → card lands large → result
function PackOpeningOverlay({
  characterName,
  assets,
  onResult,
  onRegister,
}: {
  characterName: string;
  assets: GeneratedCardAssets;
  onResult: () => void;
  onRegister?: () => void;
}) {
  const [cut, setCut] = useState(false); // pack splits
  const [packGone, setPackGone] = useState(false); // pack fades out
  const [cardUp, setCardUp] = useState(false); // card shoots upward
  const [cardLand, setCardLand] = useState(false); // card lands from top, large
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    const timers = [
      setTimeout(() => setCut(true), 1200), // pack splits
      setTimeout(() => {
        setPackGone(true);
        setCardUp(true);
      }, 2800), // pack fades, card shoots up
      setTimeout(() => setCardLand(true), 3500), // card comes back down
      setTimeout(() => {
        setShowResult(true);
        onResult();
      }, 5000), // show result
    ];
    return () => timers.forEach(clearTimeout);
  }, [onResult]);

  // Card Y position across phases:
  // before cut → hidden below
  // after cut  → peeking (translateY 60px, small)
  // cardUp     → shoot up off screen (translateY -120vh)
  // cardLand   → land from top, large then settles
  const cardTransform = (() => {
    if (cardLand) return "translateY(-72px) scale(1)";
    if (cardUp) return "translateY(-120vh) scale(0.8)";
    if (cut) return "translateY(60px) scale(0.75)";
    return "translateY(100px) scale(0.5)";
  })();

  const cardOpacity =
    cut && !cardLand && !cardUp
      ? 1
      : cardLand
        ? 1
        : cut
          ? 1
          : 0;

  const cardTransition = (() => {
    if (cardUp)
      return "transform 0.55s cubic-bezier(0.4,0,0.6,1), opacity 0.3s ease";
    if (cardLand)
      return "transform 0.65s cubic-bezier(0.34,1.4,0.64,1), opacity 0.4s ease";
    return "transform 0.8s cubic-bezier(0.34,1.56,0.64,1), opacity 0.5s ease";
  })();

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden"
      style={{
        background: "rgba(0,0,0,0.75)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
      }}
    >
      {/* Spotlight glow */}
      <div
        className="absolute inset-0 pointer-events-none opacity-0.5"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 55%, rgba(98,141,56,0.45) 0%, transparent 70%)",
          animation: "spotlight 2.4s ease-in-out infinite",
        }}
      />

      {!showResult ? (
        <div
          className="relative flex items-center justify-center"
          style={{ width: "330px", height: "430px" }}
        >
          {/* Card back — peeks, shoots up, lands large */}
          <div
            className="absolute z-0 flex justify-center"
            style={{ width: "260px" }}
          >
            <img
              src={assets.cardBackImage}
              alt=""
              draggable={false}
              style={{
                width: cardLand ? "220px" : "160px",
                transition: cardTransition,
                transform: cardTransform,
                opacity: cardOpacity,
                filter:
                  "drop-shadow(0 12px 32px rgba(0,0,0,0.7))",
              }}
            />
          </div>

          {/* Pack top half — flies up on cut, fades when packGone */}
          <div
            className="absolute z-10"
            style={{
              top: "14px",
              transition:
                "transform 0.7s cubic-bezier(0.34,1.56,0.64,1), opacity 0.5s ease",
              transform: cut
                ? "translateY(-40px)"
                : "translateY(0px)",
              opacity: packGone ? 0 : 1,
            }}
          >
            <div style={{ overflow: "hidden", height: "108px" }}>
              <img
                src={imgCardPack}
                alt=""
                className="drop-shadow-2xl"
                style={{ width: "298.36px", height: "402.23px" }}
              />
            </div>
          </div>

          {/* Pack bottom half — slides down, fades when packGone */}
          <div
            className="absolute z-10"
            style={{
              bottom: "14px",
              transition:
                "transform 0.7s cubic-bezier(0.34,1.56,0.64,1), opacity 0.5s ease",
              transform: cut
                ? "translateY(80px)"
                : "translateY(0px)",
              opacity: packGone ? 0 : 1,
            }}
          >
            <div
              style={{
                overflow: "hidden",
                height: "294.23px",
                marginTop: "-108px",
              }}
            >
              <img
                src={imgCardPack}
                alt=""
                className="drop-shadow-2xl"
                style={{
                  width: "298.36px",
                  height: "402.23px",
                  marginTop: "-108px",
                }}
              />
            </div>
          </div>
        </div>
      ) : (
        <ResultOverlay
          characterName={characterName}
          assets={assets}
          onRegister={onRegister}
        />
      )}
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
  const trackedCardInteractionRef = useRef(false);
  const [showToast, setShowToast] = useState(false);

  const trackCardInteraction = useCallback((method: "mouse" | "touch") => {
    if (trackedCardInteractionRef.current) return;
    trackedCardInteractionRef.current = true;
    trackEvent("result_card_interacted", {
      method,
    });
  }, []);

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
    trackCardInteraction("touch");
    isDragging.current = true;
    dragStartX.current = e.touches[0].clientX;
    dragStartAng.current = angle;
  };
  const onTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current) return;
    const delta = e.touches[0].clientX - dragStartX.current;
    setAngle(dragStartAng.current + delta * 0.6);
  };
  const onTouchEnd = () => {
    isDragging.current = false;
  };

  // Mouse drag — global listeners so it works outside the element
  const onMouseDown = (e: React.MouseEvent) => {
    if (mode !== "spinning") return;
    trackCardInteraction("mouse");
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

  const handleSave = useCallback(async () => {
    trackEvent("card_save_clicked");

    try {
      await saveCardImage(assets.cardImage, characterName);
      trackEvent("card_save_completed");
    } catch (error) {
      trackEvent("card_save_failed", {
        message:
          error instanceof Error ? error.message : "unknown_error",
      });
      window.alert(
        error instanceof Error
          ? error.message
          : "이미지를 저장하지 못했어요.",
      );
    }
  }, [assets.cardImage, characterName]);

  const handleShare = useCallback(async () => {
    trackEvent("result_share_clicked");
    if (await copyShareLink(createCtaShareLink(characterName, assets.aiImage))) {
      trackEvent("result_share_copied");
      setShowToast(true);
    }
  }, [assets.aiImage, characterName]);

  return (
    <div className="absolute left-0 right-0 top-[93.19px] flex flex-col items-center w-full px-6">
      {onRegister && (
        <button
          type="button"
          onClick={() => {
            trackEvent("cta_opened_from_result");
            onRegister();
          }}
          className="fixed right-5 top-8 z-20 flex h-9 w-9 items-center justify-center text-[26px] leading-none text-white/95"
          style={{
            fontFamily: "Galmuri11",
            fontWeight: 700,
            textShadow: "0 2px 6px rgba(0,0,0,0.45)",
          }}
          aria-label="CTA 화면으로 이동"
        >
          ×
        </button>
      )}

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
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
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
                objectFit: "contain",
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
              transform: "rotateY(180deg)",
            }}
          >
            <img
              src={assets.cardBackImage}
              alt="카드 뒷면"
              draggable={false}
              style={{
                width: "283.66px",
                height: "408.52px",
                filter:
                  "drop-shadow(0 12px 32px rgba(0,0,0,0.7))",
                display: "block",
                objectFit: "contain",
                pointerEvents: "none",
              }}
            />
          </div>
        </div>
      </div>

      <div className="mt-[65.35px] flex flex-col items-center gap-[6px]">
        <PixelButton
          onClick={handleSave}
          showPaw
          imageSrc={imgBtnSave}
          ariaLabel="이미지 저장"
        >
          {false && (
          <span
            className="text-[16px] tracking-[1.4px] text-white text-center w-full"
            style={{
              fontFamily: "Elice DX Neolli",
              fontWeight: 500,
            }}
          >
            이미지 저장
          </span>
          )}
        </PixelButton>

        {onRegister && (
          <div className="pb-[2px]">
          <PixelButton
            onClick={handleShare}
            variant="secondary"
            showPaw
            imageSrc={imgBtnShare}
            ariaLabel="친구에게 공유하기"
          >
            친구에게 공유하기
          </PixelButton>
          </div>
        )}
      </div>
      <ToastNotification
        visible={showToast}
        onHidden={() => setShowToast(false)}
      />
    </div>
  );
}

function ClassicV2Version() {
  const searchParams = new URLSearchParams(window.location.search);
  const sharedCtaName = searchParams.get("name") || "";
  const sharedCtaImage = searchParams.get("aiImage") || "";
  const isSharedCta = searchParams.get("cta") === "1";
  const [phase, setPhase] = useState<Phase>("idle");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [generatedAssets, setGeneratedAssets] =
    useState<GeneratedCardAssets | null>(
      sharedCtaImage
        ? { ...FALLBACK_CARD_ASSETS, aiImage: sharedCtaImage }
        : null,
    );
  const [characterName, setCharacterName] = useState(sharedCtaName);
  const [isDragging, setIsDragging] = useState(false);
  const [generationError, setGenerationError] = useState("");
  const [showImageGuide, setShowImageGuide] = useState(false);
  const [registrationView, setRegistrationView] = useState<
    "cta" | "complete" | null
  >(isSharedCta ? "cta" : null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isButtonActive =
    !!uploadedImage && characterName.trim().length > 0;
  const isPreviewMode = searchParams.get("preview") === "1";

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

  const handleConvert = useCallback(async () => {
    if (!isButtonActive) return;
    trackEvent("convert_started", {
      name_length: characterName.trim().length,
      is_preview: isPreviewMode,
    });
    setGenerationError("");
    setGeneratedAssets(null);
    setPhase("processing");

    if (isPreviewMode) {
      await new Promise((resolve) => window.setTimeout(resolve, 1400));
      setGeneratedAssets(FALLBACK_CARD_ASSETS);
      setPhase("pack");
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
      });
      const payload = await response.json();
      if (!response.ok) {
        const apiErrorMessage = formatApiErrorPayload(payload);
        trackEvent("convert_failed", {
          message: apiErrorMessage,
        });
        setGenerationError(apiErrorMessage);
        setPhase("idle");
        return;
      }
      setGeneratedAssets({
        cardImage:
          typeof payload.cardImage === "string"
            ? payload.cardImage
            : FALLBACK_CARD_ASSETS.cardImage,
        cardBackImage:
          typeof payload.cardBackImage === "string"
            ? payload.cardBackImage
            : FALLBACK_CARD_ASSETS.cardBackImage,
        aiImage:
          typeof payload.aiImage === "string"
            ? payload.aiImage
            : FALLBACK_CARD_ASSETS.aiImage,
      });
      setPhase("pack");
      trackEvent("convert_completed", {
        mode: "api",
      });
    } catch (error) {
      trackEvent("convert_failed", {
        message:
          error instanceof Error ? error.message : "unknown_error",
      });
      setGenerationError(
        error instanceof Error
          ? error.message
          : "카드 이미지를 만들지 못했어요.",
      );
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
    setPhase("idle");
    setUploadedImage(null);
    setGeneratedAssets(null);
    setCharacterName("");
    setRegistrationView(null);
    setGenerationError("");
  }, []);

  const stepIndex =
    phase === "idle" ? 1 : phase === "processing" ? 2 : 3;

  if (registrationView === "cta") {
    return (
      <CTAPage
        characterName={characterName.trim()}
        aiImage={generatedAssets?.aiImage ?? null}
        onBack={() => setRegistrationView(null)}
        onComplete={() => setRegistrationView("complete")}
      />
    );
  }

  if (registrationView === "complete") {
    return (
      <CompletePage
        aiImage={generatedAssets?.aiImage ?? null}
        onCreateNew={handleReset}
        shareUrl={createCtaShareLink(
          characterName.trim(),
          generatedAssets?.aiImage ?? null,
        )}
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
        <img
          src={imgIntroHeader}
          alt=""
          className="-mx-[14px] block w-[calc(100%+28px)] max-w-none shrink-0"
          draggable={false}
        />
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
          className="mt-[33.35px] block h-[34.19px] w-[236.99px] shrink-0"
          draggable={false}
        />
        <OnboardingCarousel className="mt-[22.46px]" />
        <img
          src={imgIntroTryTitle}
          alt=""
          className="mt-[74.6px] block h-[33.43px] w-[206.59px] shrink-0"
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

        {phase !== "idle" && (
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

        {phase === "idle" && (
          <div className="mx-auto mt-[18.79px] w-[330.944px] max-w-full">
            <WindowPanel>
            <div className="flex flex-col items-center px-[25px] pb-[28.6px] pt-0">
              <div className="flex flex-col items-center gap-[4.57px]">
                <p
                  className="h-[13px] w-[53px] whitespace-nowrap text-center text-[11px] leading-[1.2] tracking-[1.1px] text-[#628d38]"
                  style={{ fontFamily: "Galmuri11", fontWeight: 700 }}
                >
                  STEP 01
                </p>
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
                    trackEvent("photo_selected");
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
                    trackEvent("photo_dropped");
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
                      JPG, PNG, HEIC 파일 지원
                    </span>
                  </span>
                )}
              </button>

              <input
                type="text"
                value={characterName}
                onChange={(e) => {
                  setCharacterName(
                    e.target.value.replace(NAME_FILTER, "").slice(0, 6),
                  );
                }}
                maxLength={6}
                placeholder="이름을 작성해주세요"
                className="mt-[22px] h-[56px] w-[250px] rounded-[12px] bg-white px-4 text-[15px] tracking-[0.4px] text-[#32322d] placeholder:text-[14px] placeholder:tracking-[0.2px] placeholder:text-[#c9c2b4] focus:outline-none focus:ring-2 focus:ring-[#628d38]"
                style={{
                  fontFamily: "Elice DX Neolli",
                  fontWeight: 300,
                  border: "1px solid #e5dece",
                  boxShadow: "0 2px 6px rgba(104,85,62,0.06)",
                }}
              />

              <div className="mt-[30.77px]">
                <PixelButton
                  onClick={handleConvert}
                  disabled={!isButtonActive}
                  showPaw
                  imageSrc={imgBtnLg}
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
              {generationError && (
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
          <ProcessingPanel />
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
          { label: "인스타그램", target: "instagram", className: "left-[78.5%] top-[13.9%] h-[14%] w-[6.8%]" },
          { label: "이메일", target: "email", className: "left-[87.8%] top-[13.9%] h-[14%] w-[6.8%]" },
          { label: "이용약관", target: "terms", className: "left-[7.4%] top-[52.5%] h-[8.5%] w-[12.4%]" },
          { label: "개인정보처리방침", target: "privacy", className: "left-[25.6%] top-[52.5%] h-[8.5%] w-[23.6%]" },
          { label: "사전예약 이벤트 규약", target: "event_terms", className: "left-[55.1%] top-[52.5%] h-[8.5%] w-[28.3%]" },
        ].map((link) => (
          <button
            key={link.target}
            type="button"
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
            onResult={handleResult}
            onRegister={() => setRegistrationView("cta")}
          />
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
          <div className="relative z-[1] w-full max-w-[330px]">
            <img
              src={imgImageGuideModal}
              alt="이미지 가이드"
              className="block w-full object-contain"
              draggable={false}
            />
            <button
              type="button"
              className="absolute right-[4px] top-[4px] h-[44px] w-[44px]"
              aria-label="이미지 가이드 닫기"
              onClick={() => setShowImageGuide(false)}
            />
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
  onClose,
  onComplete,
}: {
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
    import.meta.env.DEV ||
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
      const response = await fetch("/api/pre-registrations", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phoneNumber: digits,
          requiredConsent: true,
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
  }, [canBypassRegistration, canSubmit, digits, isSubmitting, onComplete]);
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
          <h2
            className="text-[19px] leading-[1.4] tracking-[0.3px] text-[#36501e]"
            style={{ fontFamily: "Elice DX Neolli", fontWeight: 500 }}
          >
            {view === "terms" ? "개인정보 수집 및 이용 동의" : "얼리 농장주 등록"}
          </h2>
          {view === "form" && (
            <p
              className="mt-[12px] text-[13px] leading-[1.35] tracking-[0.1px] text-[#68553e]"
              style={{ fontFamily: "Elice DX Neolli", fontWeight: 300 }}
            >
              앱이 출시되면 문자로 알려드려요
              <br />
              사전예약자에게는 한정 보상을 드려요
            </p>
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
                <span
                  className="min-w-0 text-[9px] tracking-[0.1px] text-[#45372a]"
                  style={{ fontFamily: "Elice DX Neolli", fontWeight: 500 }}
                >
                  <span className="text-[#628d38]">[필수]</span> 개인정보 수집 및 이용 동의
                </span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setView("terms");
                }}
                className="ml-[9px] shrink-0 text-[10px] tracking-[0.2px] text-[#628d38] underline-offset-2"
                style={{ fontFamily: "Elice DX Neolli", fontWeight: 500 }}
              >
                보기
              </button>
              </div>
              <p
                className="mt-[10px] text-[8px] leading-[1.55] tracking-[0.05px] text-[#8f7755]"
                style={{ fontFamily: "Elice DX Neolli", fontWeight: 300 }}
              >
                휴대폰 번호는 앱 출시 안내 및 사전예약 보상 쿠폰 발송 목적으로만
                <br />
                사용되며, 사전예약 이벤트 종료 후 1개월 뒤 삭제됩니다.
              </p>
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

function CTAPage({
  characterName,
  aiImage,
  onComplete,
  onBack,
}: {
  characterName: string;
  aiImage: string | null;
  onComplete: () => void;
  onBack: () => void;
}) {
  const [showDialog, setShowDialog] = useState(false);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    trackEvent("cta_page_viewed", {
      has_character_name: !!characterName,
      has_ai_image: !!aiImage,
    });
  }, [aiImage, characterName]);

  const handleShare = async () => {
    trackEvent("cta_share_clicked");
    if (await copyShareLink(createCtaShareLink(characterName, aiImage))) {
      trackEvent("cta_share_copied");
      setShowToast(true);
    }
  };

  const handleImageSave = async () => {
    try {
      await saveCardImage(aiImage || imgCharFront, characterName || "pixel-animal");
    } catch {
    }
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
      <button
        type="button"
        onClick={() => {
          trackEvent("cta_back_to_result_clicked");
          onBack();
        }}
        className="fixed right-5 top-8 z-20 flex h-9 w-9 items-center justify-center text-[26px] leading-none text-white/95"
        style={{
          fontFamily: "Galmuri11",
          fontWeight: 700,
          textShadow: "0 2px 6px rgba(0,0,0,0.45)",
        }}
        aria-label="결과 화면으로 돌아가기"
      >
        ×
      </button>
      <main className="relative flex min-h-[100dvh] w-full max-w-[360px] flex-col justify-center px-[14px] pb-8 pt-[24px]">
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

            <div
              className="relative h-[206px] w-[206px] rotate-[-4deg] rounded-[8px] border border-[#8d8a7d] bg-[#fbfaf3] p-[10px]"
              style={{
                boxShadow:
                  "0 14px 24px rgba(65, 52, 35, 0.18), 0 2px 0 rgba(255,255,255,0.8) inset",
              }}
            >
              <div className="absolute left-1/2 top-[-9px] h-[20px] w-[58px] -translate-x-1/2 rotate-[2deg] bg-[#e9db9f]/70" />
              <div className="relative h-full w-full overflow-hidden rounded-[4px] border border-[#d2d0c1] bg-[#eef4e4]">
                {aiImage ? (
                  <img
                    src={aiImage}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                ) : (
                  <img
                    src={imgCharFront}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={handleImageSave}
              className="relative h-[42px] w-[105.15px] overflow-hidden text-transparent"
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

            <PixelButton
              onClick={() => {
                setShowDialog(true);
              }}
              showPaw
              imageSrc={imgBtnAlrim}
              ariaLabel="오픈 알림 받기"
            >
              <span
                className="w-full text-center text-[16px] tracking-[1.6px] text-white"
                style={{ fontFamily: "Elice DX Neolli", fontWeight: 500 }}
              >
                오픈 알림 받기
              </span>
            </PixelButton>

            <PixelButton
              onClick={handleShare}
              variant="secondary"
              showPaw
              imageSrc={imgBtnShare}
              ariaLabel="친구에게 공유하기"
            >
              친구에게 공유하기
            </PixelButton>
          </div>
        </WindowPanel>
      </main>

      <ToastNotification
        visible={showToast}
        onHidden={() => setShowToast(false)}
      />
      {showDialog && (
        <EarlyRegistrationDialog
          onClose={() => setShowDialog(false)}
          onComplete={() => {
            trackEvent("cta_registration_completed");
            setShowDialog(false);
            onComplete();
          }}
        />
      )}
    </div>
  );
}

function CompletePage({
  aiImage,
  onCreateNew,
  shareUrl,
}: {
  aiImage: string | null;
  onCreateNew: () => void;
  shareUrl: string;
}) {
  const [showToast, setShowToast] = useState(false);
  useEffect(() => {
    trackEvent("registration_complete_page_viewed");
  }, []);

  const handleShare = async () => {
    trackEvent("registration_complete_share_clicked");
    if (await copyShareLink(shareUrl)) {
      trackEvent("registration_complete_share_copied");
      setShowToast(true);
    }
  };

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

            <div
              className="relative mt-[34px] h-[206px] w-[206px] rotate-[-6deg] rounded-[8px] border border-[#8d8a7d] bg-[#fbfaf3] p-[10px]"
              style={{
                boxShadow:
                  "0 14px 24px rgba(65, 52, 35, 0.18), 0 2px 0 rgba(255,255,255,0.8) inset",
              }}
            >
              <div className="absolute left-1/2 top-[-11px] h-[22px] w-[68px] -translate-x-1/2 rotate-[2deg] bg-[#ecdca2]/80" />
              <div className="relative h-full w-full overflow-hidden rounded-[4px] border border-[#d2d0c1] bg-[#eef4e4]">
                <img
                  src={aiImage || imgCharFront}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover"
                  draggable={false}
                />
              </div>
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
      <ToastNotification
        visible={showToast}
        onHidden={() => setShowToast(false)}
      />
    </div>
  );
}

// ── App Router ────────────────────────────────────────────────
export default function App() {
  return <ClassicV2Version />;
}
