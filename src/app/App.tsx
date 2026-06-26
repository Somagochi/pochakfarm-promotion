import {
  useState,
  useRef,
  useEffect,
  useCallback,
} from "react";
import { trackEvent } from "../analytics";

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

// Card pack (POCHAKPARM FARM green pack)
import imgCardPack from "../imports/image.png";

// Dog pixel-art SVG component (inline JSX — avoids SVG file import issues)
import FigmaDog from "../imports/Frame427322333/index";
import imgNpcDog from "../imports/dog.svg";

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
  "image/heic",
  "image/heif",
]);
const NAME_FILTER = /[^ㄱ-ㅎ가-힣a-zA-Z0-9\s]/g;

const KEYFRAMES = `
  @keyframes float      { 0%,100%{transform:translateY(0)}   50%{transform:translateY(-10px)} }
  @keyframes wobble     { 0%,100%{transform:rotate(-1.5deg)} 50%{transform:rotate(1.5deg)} }
  @keyframes spotlight  { 0%,100%{opacity:0.7}              50%{opacity:1} }
  @keyframes dogBreath  { 0%,100%{opacity:1}                50%{opacity:0.12} }
`;

type Phase = "idle" | "processing" | "pack" | "dim" | "result";

// ── PixelButton ──────────────────────────────────────────────
function PixelButton({
  onClick,
  disabled,
  children,
}: {
  onClick?: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      onClick={disabled ? undefined : onClick}
      className="grid w-[280px] h-[60px] transition-opacity"
      style={{
        gridTemplateColumns: "12px 1fr 12px",
        gridTemplateRows: "12px 1fr 12px",
        opacity: disabled ? 0.4 : 1,
        cursor: disabled ? "not-allowed" : "pointer",
      }}
    >
      <div className="overflow-clip relative size-[12px]">
        <img
          src={imgCornerTL}
          alt=""
          className="absolute inset-0 size-full object-cover pointer-events-none"
        />
      </div>
      <div
        className="overflow-clip relative h-[12px]"
        style={{
          backgroundImage: `url("${imgEdgeTop}")`,
          backgroundSize: "12px 12px",
          backgroundPosition: "top left",
        }}
      />
      <div className="overflow-clip relative size-[12px]">
        <img
          src={imgCornerTR}
          alt=""
          className="absolute inset-0 size-full object-cover pointer-events-none"
        />
      </div>
      <div
        className="overflow-clip relative w-[12px]"
        style={{
          backgroundImage: `url("${imgEdgeLeft}")`,
          backgroundSize: "12px 12px",
          backgroundPosition: "top left",
        }}
      />
      <div className="bg-[#36501e] flex items-center justify-center">
        {children}
      </div>
      <div
        className="overflow-clip relative w-[12px]"
        style={{
          backgroundImage: `url("${imgEdgeLeft}")`,
          backgroundSize: "12px 12px",
          backgroundPosition: "top left",
          transform: "scaleY(-1) rotate(180deg)",
        }}
      />
      <div className="overflow-clip relative size-[12px]">
        <img
          src={imgCornerBLb}
          alt=""
          className="absolute inset-0 size-full object-cover pointer-events-none"
        />
        <img
          src={imgCornerBLa}
          alt=""
          className="absolute inset-0 size-full object-cover pointer-events-none"
        />
      </div>
      <div
        className="overflow-clip relative h-[12px]"
        style={{
          backgroundImage: `url("${imgEdgeBot}")`,
          backgroundSize: "12px 12px",
          backgroundPosition: "top left",
        }}
      />
      <div className="overflow-clip relative size-[12px]">
        <img
          src={imgCornerBR}
          alt=""
          className="absolute inset-0 size-full object-cover pointer-events-none"
        />
      </div>
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
        style={{ aspectRatio: "330.944 / 80.4" }}
      >
        <img
          src={imgWindowFrame}
          alt=""
          className="absolute pointer-events-none max-w-none"
          style={{
            height: "475.78%",
            left: "-0.71%",
            top: "-1.9%",
            width: "101.51%",
          }}
        />
      </div>
      <div className="relative w-full overflow-hidden shrink-0">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img
            src={imgWindowFrame}
            alt=""
            className="absolute max-w-none"
            style={{
              height: "169.71%",
              left: "-0.71%",
              top: "-53.06%",
              width: "101.51%",
            }}
          />
        </div>
        <div className="relative z-10">{children}</div>
      </div>
      <div
        className="relative w-full shrink-0 overflow-hidden"
        style={{ aspectRatio: "330.944 / 38.4" }}
      >
        <img
          src={imgWindowFrame}
          alt=""
          className="absolute pointer-events-none max-w-none"
          style={{
            height: "996.16%",
            left: "-0.71%",
            top: "-896.16%",
            width: "101.51%",
          }}
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

// ── ProcessingPanel — card pack inside window frame ───────────
function ProcessingPanel({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const DURATION = 2800;
    const start = Date.now();
    let rafId: number;
    let finished = false;
    const tick = () => {
      const p = Math.min((Date.now() - start) / DURATION, 1);
      setProgress(p);
      if (p < 1) {
        rafId = requestAnimationFrame(tick);
      } else if (!finished) {
        finished = true;
        setTimeout(onDone, 300);
      }
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [onDone]);

  return (
    <WindowPanel>
      <div className="flex flex-col items-center pt-5 pb-6 px-8 gap-4">
        <p
          className="text-[#628d38] text-[11px] tracking-[1.1px]"
          style={{ fontFamily: "Galmuri11", fontWeight: 700 }}
        >
          STEP 03
        </p>
        <p
          className="text-[#32322d] text-[18px] tracking-[0.9px] leading-[1.4] text-center"
          style={{
            fontFamily: "Elice DX Neolli",
            fontWeight: 500,
          }}
        >
          변환되는 과정을
          <br />
          기다려주세요
        </p>
        <p
          className="text-[#6a6a61] text-[10px] tracking-[0.4px] text-center"
          style={{
            fontFamily: "Elice DX Neolli",
            fontWeight: 300,
          }}
        >
          웹사이트를 종료하더라도
          <br />
          변환 과정은 유지돼요
        </p>

        {/* Dog pixel-art — breath fade animation */}
        <div
          style={{
            width: "56px",
            height: "50px",
            position: "relative",
            animation: "dogBreath 1.8s ease-in-out infinite",
          }}
        >
          <FigmaDog />
        </div>

        {/* Progress bar */}
        <div className="w-[200px]">
          <div className="h-[7px] bg-[#e9dfc8] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#628d38] rounded-full"
              style={{
                width: `${progress * 100}%`,
                transition: "width 0.1s linear",
              }}
            />
          </div>
          <p
            className="text-[#a4a499] text-[9px] tracking-[0.3px] text-right mt-1"
            style={{ fontFamily: "Galmuri11", fontWeight: 700 }}
          >
            {Math.round(progress * 100)}%
          </p>
        </div>
      </div>
    </WindowPanel>
  );
}

// ── CardPackPanel — tap to open ───────────────────────────────
function CardPackPanel({ onOpen }: { onOpen: () => void }) {
  return (
    <WindowPanel>
      <div className="flex flex-col items-center py-8 px-6 gap-4">
        <p
          className="text-[#628d38] text-[11px] tracking-[1.1px]"
          style={{ fontFamily: "Galmuri11", fontWeight: 700 }}
        >
          CARD PACK READY!
        </p>
        <div
          className="cursor-pointer"
          onClick={onOpen}
          style={{
            animation: "float 1.8s ease-in-out infinite",
          }}
        >
          <img
            src={imgCardPack}
            alt="카드팩"
            className="drop-shadow-2xl"
            style={{
              width: "140px",
              animation: "wobble 2.2s ease-in-out infinite",
            }}
          />
        </div>
        <p
          className="text-[#8f7755] text-[10px] tracking-[0.4px] text-center"
          style={{
            fontFamily: "Elice DX Neolli",
            fontWeight: 300,
          }}
        >
          탭해서 카드팩을 열어보세요!
        </p>
      </div>
    </WindowPanel>
  );
}

// ── PackOpeningOverlay ────────────────────────────────────────
// Sequence: pack → cut → pack fades + card shoots up → card lands large → result
function PackOpeningOverlay({
  uploadedImage,
  characterName,
  onResult,
}: {
  uploadedImage: string;
  characterName: string;
  onResult: () => void;
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
          style={{ width: "280px", height: "400px" }}
        >
          {/* Card back — peeks, shoots up, lands large */}
          <div
            className="absolute z-0 flex justify-center"
            style={{ width: "260px" }}
          >
            <img
              src={imgCardBack}
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
              top: "80px",
              transition:
                "transform 0.7s cubic-bezier(0.34,1.56,0.64,1), opacity 0.5s ease",
              transform: cut
                ? "translateY(-40px)"
                : "translateY(0px)",
              opacity: packGone ? 0 : 1,
            }}
          >
            <div style={{ overflow: "hidden", height: "48px" }}>
              <img
                src={imgCardPack}
                alt=""
                className="drop-shadow-2xl"
                style={{ width: "180px" }}
              />
            </div>
          </div>

          {/* Pack bottom half — slides down, fades when packGone */}
          <div
            className="absolute z-10"
            style={{
              bottom: "60px",
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
                height: "212px",
                marginTop: "-48px",
              }}
            >
              <img
                src={imgCardPack}
                alt=""
                className="drop-shadow-2xl"
                style={{ width: "180px", marginTop: "-48px" }}
              />
            </div>
          </div>
        </div>
      ) : (
        <ResultOverlay
          uploadedImage={uploadedImage}
          characterName={characterName}
        />
      )}
    </div>
  );
}

// ── ResultOverlay — card back → flip → 360° spin + swipe ──────
function ResultOverlay({
  uploadedImage,
  characterName,
}: {
  uploadedImage: string;
  characterName: string;
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

  const handleSave = useCallback(async () => {
    trackEvent("card_saved");

    const W = 360,
      H = 480;
    const canvas = document.createElement("canvas");
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "#f2ebdd";
    ctx.beginPath();
    ctx.roundRect(0, 0, W, H, 16);
    ctx.fill();

    await new Promise<void>((resolve) => {
      const img = new Image();
      img.onload = () => {
        const drawH = W / (img.width / img.height);
        ctx.save();
        ctx.beginPath();
        ctx.roundRect(0, 0, W, Math.min(drawH, H - 80), 16);
        ctx.clip();
        ctx.drawImage(img, 0, 0, W, drawH);
        ctx.restore();
        resolve();
      };
      img.src = uploadedImage;
    });

    ctx.fillStyle = "#f2ebdd";
    ctx.fillRect(0, H - 70, W, 70);
    ctx.fillStyle = "#628d38";
    ctx.font = "bold 22px monospace";
    ctx.textAlign = "center";
    ctx.fillText(characterName, W / 2, H - 36);
    ctx.fillStyle = "#8f7755";
    ctx.font = "12px sans-serif";
    ctx.fillText("CHARACTER CARD", W / 2, H - 14);
    ctx.strokeStyle = "#e9dfc8";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(1.5, 1.5, W - 3, H - 3, 15);
    ctx.stroke();

    const a = document.createElement("a");
    a.download = `${characterName || "character"}-card.png`;
    a.href = canvas.toDataURL("image/png");
    a.click();
  }, [uploadedImage, characterName]);

  return (
    <div className="flex flex-col items-center w-full px-6 gap-6">
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
            width: "220px",
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
              src={imgCharFront}
              alt="캐릭터 카드"
              draggable={false}
              style={{
                width: "220px",
                filter:
                  "drop-shadow(0 12px 32px rgba(0,0,0,0.7))",
                display: "block",
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
              src={imgCardBack}
              alt="카드 뒷면"
              draggable={false}
              style={{
                width: "220px",
                filter:
                  "drop-shadow(0 12px 32px rgba(0,0,0,0.7))",
                display: "block",
                pointerEvents: "none",
              }}
            />
          </div>
        </div>
      </div>

      <p
        className="relative text-white/70 text-[16px] pt-[24px] tracking-[0.4px] text-center"
        style={{
          fontFamily: "Elice DX Neolli",
          fontWeight: 300,
        }}
      >
        야생의 {characterName}(이)가 나타났다!!
      </p>

      <PixelButton onClick={handleSave}>
        <span
          className="text-[14px] tracking-[1.4px] text-white text-center w-full"
          style={{
            fontFamily: "Elice DX Neolli",
            fontWeight: 500,
          }}
        >
          이미지 저장하기
        </span>
      </PixelButton>
    </div>
  );
}

// ── LegacyCardVersion ─────────────────────────────────────────
function LegacyCardVersion() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [uploadedImage, setUploadedImage] = useState<
    string | null
  >(null);
  const [characterName, setCharacterName] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const isButtonActive =
    !!uploadedImage && characterName.trim().length > 0;

  const readFile = useCallback((file: File) => {
    if (!ACCEPTED_TYPES.has(file.type)) return;
    trackEvent("photo_upload_started", {
      file_type: file.type,
    });
    const reader = new FileReader();
    reader.onload = (e) =>
      setUploadedImage(e.target?.result as string);
    reader.readAsDataURL(file);
  }, []);

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files?.[0]) readFile(e.target.files[0]);
    },
    [readFile],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);
  const handleDragLeave = useCallback(
    () => setIsDragging(false),
    [],
  );
  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (e.dataTransfer.files[0])
        readFile(e.dataTransfer.files[0]);
    },
    [readFile],
  );

  const handleNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setCharacterName(e.target.value.replace(NAME_FILTER, "")),
    [],
  );

  const handleConvert = useCallback(() => {
    if (!isButtonActive) return;
    trackEvent("convert_started");
    setPhase("processing");
    setTimeout(
      () =>
        bottomRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        }),
      100,
    );
  }, [isButtonActive]);

  const handleProcessingDone = useCallback(
    () => setPhase("pack"),
    [],
  );
  const handleOpenPack = useCallback(() => setPhase("dim"), []);
  const handleResult = useCallback(() => {
    trackEvent("result_viewed");
    setPhase("result");
  }, []);

  return (
    <div className="min-h-screen w-full bg-[#628d38] flex justify-center relative">
      <style>{KEYFRAMES}</style>

      {/* Tiled background pattern */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `url("${imgBgPattern}")`,
          backgroundRepeat: "repeat",
          backgroundSize: "361px",
          opacity: 0.3,
        }}
      />

      <div className="w-full max-w-[360px] flex flex-col relative pb-16 pt-[24px]">
        {/* ── Form panel ──────────────────────────── */}
        <div className="mx-[14px]">
          <WindowPanel>
            {/* STEP 01 — Upload */}
            <div className="flex flex-col items-center pt-4 pb-5 px-10">
              <p
                className="text-[#628d38] text-[11px] tracking-[1.1px] mb-[10px] text-center"
                style={{
                  fontFamily: "Galmuri11",
                  fontWeight: 700,
                }}
              >
                STEP 01
              </p>
              <p
                className="text-[#32322d] text-[18px] tracking-[0.9px] leading-[1.4] mb-[6px] text-center"
                style={{
                  fontFamily: "Elice DX Neolli",
                  fontWeight: 500,
                }}
              >
                동물 사진을 업로드하면
                <br />
                캐릭터 카드를 발급해드려요
              </p>
              <p
                className="text-[#6a6a61] text-[10px] tracking-[0.4px] leading-[1.6] mb-4 text-center"
                style={{
                  fontFamily: "Elice DX Neolli",
                  fontWeight: 300,
                }}
              >
                최대한 얼굴과 몸이 잘 나온 사진을 올려주세요
                <br />
                저작권에 문제 없는 이미지를 사용해주세요
              </p>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/heic"
                onChange={handleFileInput}
                className="hidden"
              />

              <div
                className="relative w-[240px] h-[240px] rounded-[4px] overflow-hidden cursor-pointer"
                style={{
                  background: "#f2ebdd",
                  border: "1.5px dashed #e9dfc8",
                }}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() =>
                  !uploadedImage &&
                  fileInputRef.current?.click()
                }
              >
                {uploadedImage ? (
                  <>
                    <img
                      src={uploadedImage}
                      alt="업로드된 사진"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setUploadedImage(null);
                      }}
                      className="absolute top-3 right-3 w-8 h-8 rounded-lg flex items-center justify-center z-10"
                      style={{
                        background: "rgba(26,29,35,0.7)",
                      }}
                    >
                      <svg
                        width="10"
                        height="10"
                        viewBox="0 0 10 10"
                        fill="none"
                      >
                        <path
                          d="M9 1L1 9M1 1L9 9"
                          stroke="white"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                      </svg>
                    </button>
                    <div className="absolute inset-0 border-[1.5px] border-dashed border-[#e9dfc8] rounded-[4px] pointer-events-none" />
                  </>
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                    <div
                      className={`transition-opacity ${isDragging ? "opacity-100" : "opacity-60"}`}
                    >
                      <svg
                        width="32"
                        height="32"
                        viewBox="0 0 32 32"
                        fill="none"
                      >
                        <path
                          d="M16 8V24M8 16H24"
                          stroke="#8f7755"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>
                    <p
                      className="text-[10px] tracking-[0.4px] text-center leading-[1.5] text-[#8f7755]"
                      style={{
                        fontFamily: "Elice DX Neolli",
                        fontWeight: 500,
                      }}
                    >
                      사진을 드래그하거나
                      <br />
                      이미지 파일을 선택하세요
                    </p>
                    <p
                      className="text-[9px] tracking-[0.18px] text-[#cdb792]"
                      style={{
                        fontFamily: "Elice DX Neolli",
                        fontWeight: 300,
                      }}
                    >
                      JPG, PNG, HEIC 파일 지원
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Divider */}
            <div className="flex justify-center my-1">
              <svg
                width="280"
                height="12"
                viewBox="0 0 280 12"
                fill="none"
              >
                <path
                  d="M8 6H272"
                  stroke="#E9DFC8"
                  strokeDasharray="8 16"
                  strokeLinecap="round"
                  strokeWidth="2"
                />
              </svg>
            </div>

            {/* STEP 02 — Name */}
            <div className="flex flex-col items-center pt-4 pb-6 px-10">
              <p
                className="text-[#628d38] text-[11px] tracking-[1.1px] mb-[10px] text-center"
                style={{
                  fontFamily: "Galmuri11",
                  fontWeight: 700,
                }}
              >
                STEP 02
              </p>
              <p
                className="text-[#32322d] text-[18px] tracking-[0.9px] leading-[1.4] mb-[6px] text-center"
                style={{
                  fontFamily: "Elice DX Neolli",
                  fontWeight: 500,
                }}
              >
                이 캐릭터의 이름을
                <br />
                작성해주세요
              </p>
              <p
                className="text-[#6a6a61] text-[10px] tracking-[0.4px] mb-4 text-center"
                style={{
                  fontFamily: "Elice DX Neolli",
                  fontWeight: 300,
                }}
              >
                아쉽게도 특수문자는 사용할 수 없어요
              </p>
              <div className="w-[240px] mb-5">
                <input
                  type="text"
                  value={characterName}
                  onChange={handleNameChange}
                  placeholder="이름을 작성해주세요"
                  className="h-[56px] w-full rounded-[12px] bg-white px-4 text-[14px] tracking-[0.84px] text-[#32322d] placeholder:text-[#a4a499] focus:outline-none focus:ring-2 focus:ring-[#628d38]"
                  style={{
                    fontFamily: "Elice DX Neolli",
                    fontWeight: 300,
                    border: "1px solid #e9dfc8",
                  }}
                />
              </div>
              <PixelButton
                onClick={handleConvert}
                disabled={!isButtonActive}
              >
                <span
                  className="text-[16px] tracking-[1.6px] text-white text-center w-full"
                  style={{
                    fontFamily: "Elice DX Neolli",
                    fontWeight: 500,
                  }}
                >
                  변환하기
                </span>
              </PixelButton>
            </div>
          </WindowPanel>
        </div>

        {/* ── Below-fold panels ───────────────────── */}
        <div
          ref={bottomRef}
          className="mt-4 flex flex-col gap-4"
        >
          <AnimatedPanel visible={phase === "processing"}>
            <ProcessingPanel onDone={handleProcessingDone} />
          </AnimatedPanel>

          <AnimatedPanel
            visible={["pack", "dim", "result"].includes(phase)}
          >
            <CardPackPanel onOpen={handleOpenPack} />
          </AnimatedPanel>
        </div>
      </div>

      {/* ── Full-screen pack-opening overlay ──── */}
      {(phase === "dim" || phase === "result") &&
        uploadedImage && (
          <PackOpeningOverlay
            uploadedImage={uploadedImage}
            characterName={characterName}
            onResult={handleResult}
          />
        )}
    </div>
  );
}

// ── VersionNav ────────────────────────────────────────────────
function VersionNav({
  active,
}: {
  active: "pixel-runner" | "pixel-runner-stage" | "classic";
}) {
  const linkBase =
    "rounded-[4px] px-3 py-2 text-[10px] tracking-[0.6px] transition-colors";
  return (
    <nav className="fixed left-1/2 top-3 z-[60] flex -translate-x-1/2 gap-2">
      <a
        href="/pixel-runner"
        className={`${linkBase} ${
          active === "pixel-runner"
            ? "bg-[#f2ebdd] text-[#36501e]"
            : "bg-[#36501e]/75 text-white"
        }`}
        style={{ fontFamily: "Galmuri11", fontWeight: 700 }}
      >
        PIXEL RUN
      </a>
      <a
        href="/pixel-runner-stage"
        className={`${linkBase} ${
          active === "pixel-runner-stage"
            ? "bg-[#f2ebdd] text-[#36501e]"
            : "bg-[#36501e]/75 text-white"
        }`}
        style={{ fontFamily: "Galmuri11", fontWeight: 700 }}
      >
        STEP
      </a>
      <a
        href="/classic"
        className={`${linkBase} ${
          active === "classic"
            ? "bg-[#f2ebdd] text-[#36501e]"
            : "bg-[#36501e]/75 text-white"
        }`}
        style={{ fontFamily: "Galmuri11", fontWeight: 700 }}
      >
        CLASSIC
      </a>
    </nav>
  );
}

type PixelState = "idle" | "ready" | "generating" | "running" | "error";
type RaceStatus = "waiting" | "racing" | "won" | "lost";
const RACE_GOAL_METERS = 240;

function PixelRunnerVersion({ staged = false }: { staged?: boolean } = {}) {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [characterName, setCharacterName] = useState("");
  const [state, setState] = useState<PixelState>("idle");
  const [playerDistance, setPlayerDistance] = useState(0);
  const [npcDistance, setNpcDistance] = useState(0);
  const [raceStatus, setRaceStatus] = useState<RaceStatus>("waiting");
  const [isPlayerDashing, setIsPlayerDashing] = useState(false);
  const [tapTimes, setTapTimes] = useState<number[]>([]);
  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dashTimerRef = useRef<number>();

  const readFile = useCallback((file: File) => {
    if (!ACCEPTED_TYPES.has(file.type)) {
      setError("JPG, PNG, HEIC 이미지만 사용할 수 있어요.");
      setState("error");
      return;
    }

    trackEvent("pixel_runner_upload_started", {
      file_type: file.type,
    });

    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedImage(e.target?.result as string);
      setGeneratedImage(null);
      setPlayerDistance(0);
      setNpcDistance(0);
      setIsPlayerDashing(false);
      setTapTimes([]);
      setRaceStatus("waiting");
      setError("");
      setState("ready");
    };
    reader.readAsDataURL(file);
  }, []);

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files?.[0]) readFile(e.target.files[0]);
    },
    [readFile],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (e.dataTransfer.files[0]) readFile(e.dataTransfer.files[0]);
    },
    [readFile],
  );

  const handleGenerate = useCallback(async () => {
    if (!uploadedImage || state === "generating") return;

    setState("generating");
    setError("");
    trackEvent("pixel_runner_convert_started");

    try {
      const response = await fetch("/api/pixel-runner", {
        method: "POST",
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
        throw new Error(
          payload.error || "픽셀 캐릭터를 만들지 못했어요.",
        );
      }

      setGeneratedImage(payload.image);
      setPlayerDistance(0);
      setNpcDistance(0);
      setIsPlayerDashing(false);
      setTapTimes([]);
      setRaceStatus("waiting");
      setState("running");
      trackEvent("pixel_runner_result_viewed");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "알 수 없는 오류가 발생했어요.",
      );
      setState("error");
    }
  }, [characterName, state, uploadedImage]);

  useEffect(() => {
    if (raceStatus !== "racing") return;

    const timer = window.setInterval(() => {
      setNpcDistance((current) => {
        const next = Math.min(
          RACE_GOAL_METERS,
          current + 3.4 + Math.random() * 3.6,
        );
        if (next >= RACE_GOAL_METERS) {
          setRaceStatus("lost");
          trackEvent("pixel_runner_race_lost");
        }
        return next;
      });
    }, 620);

    return () => window.clearInterval(timer);
  }, [raceStatus]);

  useEffect(() => {
    if (tapTimes.length === 0) return;

    const timer = window.setInterval(() => {
      const now = Date.now();
      setTapTimes((times) => times.filter((time) => now - time < 1200));
    }, 160);

    return () => window.clearInterval(timer);
  }, [tapTimes.length]);

  useEffect(() => {
    return () => {
      if (dashTimerRef.current) window.clearTimeout(dashTimerRef.current);
    };
  }, []);

  const handleSave = useCallback(() => {
    if (!generatedImage) return;
    trackEvent("pixel_runner_saved");

    const a = document.createElement("a");
    a.download = `${characterName.trim() || "pixel-animal"}-runner.png`;
    a.href = generatedImage;
    a.click();
  }, [characterName, generatedImage]);

  const handleDash = useCallback(() => {
    if (!generatedImage || raceStatus === "won" || raceStatus === "lost") {
      return;
    }

    if (raceStatus === "waiting") {
      setRaceStatus("racing");
      trackEvent("pixel_runner_race_started");
    }

    setIsPlayerDashing(true);
    const now = Date.now();
    const recentTapCount =
      tapTimes.filter((time) => now - time < 900).length + 1;
    const tapBoost = Math.min(1, recentTapCount / 7);
    setTapTimes((times) =>
      [...times.filter((time) => now - time < 1200), now].slice(-10),
    );

    if (dashTimerRef.current) window.clearTimeout(dashTimerRef.current);
    dashTimerRef.current = window.setTimeout(
      () => setIsPlayerDashing(false),
      260 + tapBoost * 180,
    );

    setPlayerDistance((current) => {
      const next = Math.min(
        RACE_GOAL_METERS,
        current + 4.8 + tapBoost * 5.5 + Math.random() * (4 + tapBoost * 5),
      );
      if (next >= RACE_GOAL_METERS) {
        setRaceStatus("won");
        trackEvent("pixel_runner_race_won");
      }
      return next;
    });
  }, [generatedImage, raceStatus, tapTimes]);

  const handleRestartRace = useCallback(() => {
    setPlayerDistance(0);
    setNpcDistance(0);
    setIsPlayerDashing(false);
    setTapTimes([]);
    setRaceStatus("waiting");
  }, []);

  const handleResetFlow = useCallback(() => {
    setUploadedImage(null);
    setGeneratedImage(null);
    setCharacterName("");
    setPlayerDistance(0);
    setNpcDistance(0);
    setIsPlayerDashing(false);
    setTapTimes([]);
    setRaceStatus("waiting");
    setError("");
    setState("idle");
  }, []);

  const statusText = (() => {
    if (state === "generating") return "픽셀 캐릭터 생성 중...";
    if (state === "running") {
      if (raceStatus === "won") return "포착 성공!";
      if (raceStatus === "lost") return "상대가 먼저 도착했어요";
      if (raceStatus === "racing") return "터치해서 더 빨리 달려요!";
      return "달리기 준비 완료!";
    }
    if (state === "error") return error;
    if (uploadedImage) return "사진이 준비됐어요";
    return "동물 사진을 올려주세요";
  })();

  const isRaceStep = state === "generating" || state === "running";
  const showFormPanel = !staged || !isRaceStep;
  const showRacePanel = !staged || isRaceStep;
  const stageIndex = !uploadedImage ? 1 : isRaceStep ? 3 : 2;

  const remainingMeters = Math.max(
    0,
    Math.ceil(RACE_GOAL_METERS - playerDistance),
  );
  const activeTapCount = tapTimes.length;
  const speedLevel = Math.min(4, Math.floor(activeTapCount / 2));
  const speedRatio = Math.min(1, activeTapCount / 8);
  const speedLabel =
    speedLevel >= 4
      ? "MAX"
      : speedLevel >= 3
        ? "FAST"
        : speedLevel >= 2
          ? "RUN"
          : speedLevel >= 1
            ? "DASH"
            : "READY";
  const canDash =
    !!generatedImage && raceStatus !== "won" && raceStatus !== "lost";
  const runnerStartX = 38;
  const finishScreenX = 228;
  const raceWorldWidth = 1320;
  const finishWorldX = 1220;
  const maxRoadOffset = finishWorldX - finishScreenX;
  const runnerWorldX = (distance: number) => {
    const ratio = distance / RACE_GOAL_METERS;
    return runnerStartX + ratio * (finishWorldX - runnerStartX);
  };
  const playerWorldX = runnerWorldX(playerDistance);
  const npcWorldX = runnerWorldX(npcDistance);
  const roadOffset = Math.min(
    maxRoadOffset,
    Math.max(0, playerWorldX - runnerStartX),
  );
  const playerLeft = playerWorldX - roadOffset;
  const npcLeft = npcWorldX - roadOffset;
  const runDuration = `${Math.max(0.1, 0.3 - speedRatio * 0.16)}s`;
  const dustDuration = `${Math.max(0.22, 0.62 - speedRatio * 0.3)}s`;
  const speedShake =
    raceStatus === "racing" && speedLevel >= 3 && isPlayerDashing
      ? "translateX(-1px)"
      : "none";
  const playerRunAnimation =
    raceStatus === "racing" && isPlayerDashing
      ? speedLevel >= 4
        ? `runBob ${runDuration} linear infinite, runStretch ${runDuration} linear infinite, rushLean 0.18s ease-in-out infinite`
        : speedLevel >= 2
          ? `runBob ${runDuration} linear infinite, runStretch ${runDuration} linear infinite, quickLean 0.22s ease-in-out infinite`
          : `runBob ${runDuration} linear infinite`
      : "none";

  return (
    <div className="min-h-screen w-full bg-[#6d9851] flex justify-center relative overflow-hidden">
      <style>{`${KEYFRAMES}
        @keyframes trackMove { from { background-position: 0 0; } to { background-position: -96px 0; } }
        @keyframes hop { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
        @keyframes runBob { 0%,100% { translate: 0 0; } 50% { translate: 0 -7px; } }
        @keyframes runStretch { 0%,100% { transform: scaleX(1) scaleY(1); } 50% { transform: scaleX(1.08) scaleY(0.94); } }
        @keyframes quickLean { 0%,100% { rotate: 0deg; } 50% { rotate: 4deg; } }
        @keyframes rushLean { 0%,100% { rotate: 3deg; scale: 1.04 1; } 50% { rotate: 8deg; scale: 1.12 0.92; } }
        @keyframes afterImageFade { 0% { opacity: 0.28; transform: translateX(0) scale(1); } 100% { opacity: 0; transform: translateX(-24px) scale(0.96); } }
        @keyframes groundPulse { 0% { opacity: 0.55; transform: scaleX(0.45); } 100% { opacity: 0; transform: scaleX(1.45); } }
        @keyframes dustPop { 0% { opacity: 0; scale: 0.5; translate: 12px 0; } 40% { opacity: 0.9; } 100% { opacity: 0; scale: 1.25; translate: -18px -6px; } }
        @keyframes grassSlide { from { background-position: 0 0; } to { background-position: -48px 0; } }
        @keyframes buttonPulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.045); } }
      `}</style>
      <VersionNav active={staged ? "pixel-runner-stage" : "pixel-runner"} />

      <div
        className="absolute inset-0 pointer-events-none opacity-25"
        style={{
          backgroundImage: `url("${imgBgPattern}")`,
          backgroundRepeat: "repeat",
          backgroundSize: "361px",
        }}
      />

      <main
        className={`relative w-full max-w-[360px] pt-[58px] ${
          staged
            ? "flex min-h-screen flex-col justify-center pb-6"
            : "pb-12"
        }`}
      >
        {staged && (
          <div className="mx-[14px] mb-3 flex justify-center gap-2">
            {[1, 2, 3].map((step) => (
              <div
                key={step}
                className={`h-[8px] rounded-full transition-all ${
                  step === stageIndex
                    ? "w-[38px] bg-[#fff8d8]"
                    : "w-[18px] bg-[#36501e]/45"
                }`}
              />
            ))}
          </div>
        )}

        {showFormPanel && (
        <div className="mx-[14px]">
          <WindowPanel>
            <div className="flex flex-col items-center px-8 py-5">
              <p
                className="mb-2 text-center text-[11px] tracking-[1.1px] text-[#628d38]"
                style={{ fontFamily: "Galmuri11", fontWeight: 700 }}
              >
                VERSION 01
              </p>
              <p
                className="mb-2 text-center text-[18px] leading-[1.35] tracking-[0.9px] text-[#32322d]"
                style={{
                  fontFamily: "Elice DX Neolli",
                  fontWeight: 500,
                }}
              >
                동물 사진을 픽셀 캐릭터로
                <br />
                변환해서 달리게 해요
              </p>
              <p
                className="mb-4 text-center text-[10px] leading-[1.6] tracking-[0.4px] text-[#6a6a61]"
                style={{
                  fontFamily: "Elice DX Neolli",
                  fontWeight: 300,
                }}
              >
                OpenAI API로 배경이 제거된
                <br />
                투명 픽셀 스프라이트를 생성해요
              </p>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/heic,image/heif"
                onChange={handleFileInput}
                className="hidden"
              />

              <button
                type="button"
                className="relative h-[220px] w-[240px] overflow-hidden rounded-[4px] text-center"
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
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                {uploadedImage ? (
                  <img
                    src={uploadedImage}
                    alt="업로드된 동물 사진"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                ) : (
                  <span
                    className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-[#8f7755]"
                    style={{
                      fontFamily: "Elice DX Neolli",
                      fontWeight: 500,
                    }}
                  >
                    <span className="text-[28px] leading-none">+</span>
                    <span className="text-[10px] leading-[1.5] tracking-[0.4px]">
                      사진을 드래그하거나
                      <br />
                      이미지 파일을 선택하세요
                    </span>
                  </span>
                )}
              </button>

              <input
                type="text"
                value={characterName}
                onChange={(e) =>
                  setCharacterName(
                    e.target.value.replace(NAME_FILTER, ""),
                  )
                }
                placeholder="이름을 작성해주세요"
                className="mt-4 h-[48px] w-[240px] rounded-[12px] bg-white px-4 text-[14px] tracking-[0.84px] text-[#32322d] placeholder:text-[#a4a499] focus:outline-none focus:ring-2 focus:ring-[#628d38]"
                style={{
                  fontFamily: "Elice DX Neolli",
                  fontWeight: 300,
                  border: "1px solid #e9dfc8",
                }}
              />

              <p
                className={`mt-3 min-h-[18px] text-center text-[10px] tracking-[0.3px] ${
                  state === "error" ? "text-[#c84f3d]" : "text-[#8f7755]"
                }`}
                style={{
                  fontFamily: "Elice DX Neolli",
                  fontWeight: 300,
                }}
              >
                {statusText}
              </p>

              <div className="mt-3">
                <PixelButton
                  onClick={handleGenerate}
                  disabled={!uploadedImage || state === "generating"}
                >
                  <span
                    className="w-full text-center text-[15px] tracking-[1.4px] text-white"
                    style={{
                      fontFamily: "Elice DX Neolli",
                      fontWeight: 500,
                    }}
                  >
                    {state === "generating"
                      ? "변환 중"
                      : "픽셀 변환하기"}
                  </span>
                </PixelButton>
              </div>
            </div>
          </WindowPanel>
        </div>
        )}

        {showRacePanel && (
        <div className={`mx-[14px] ${staged ? "" : "mt-4"}`}>
          <WindowPanel>
            <div
              className={`relative flex flex-col overflow-hidden bg-[#8ec85d] ${
                staged ? "min-h-[650px]" : "min-h-[700px]"
              }`}
              style={{
                boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.28)",
              }}
            >
              {staged && (
                <button
                  type="button"
                  onClick={handleResetFlow}
                  className="absolute right-4 top-4 z-40 rounded-[5px] bg-[#36501e]/85 px-3 py-1.5 text-[10px] text-white shadow-[0_2px_0_rgba(39,53,31,0.25)]"
                  style={{
                    fontFamily: "Elice DX Neolli",
                    fontWeight: 500,
                  }}
                >
                  처음으로
                </button>
              )}
              <div className="relative z-20 flex flex-col items-center px-4 pb-5 pt-5">
                <div
                  className="mb-3 rounded-full bg-[#fff8d8] px-5 py-2 text-[17px] tracking-[0.6px] text-[#27351f] shadow-[0_3px_0_rgba(69,92,45,0.18)]"
                  style={{
                    fontFamily: "Elice DX Neolli",
                    fontWeight: 700,
                  }}
                >
                  포착하기
                </div>
                <div className="flex min-h-[74px] w-[244px] items-center gap-3 rounded-[8px] border border-white/70 bg-white/92 px-3 py-2 shadow-[0_4px_0_rgba(67,84,45,0.18)]">
                  <div className="flex h-[58px] w-[58px] items-center justify-center rounded-[8px] bg-[#efe3bd] shadow-inner">
                    {generatedImage ? (
                      <img
                        src={generatedImage}
                        alt=""
                        className="h-[48px] w-[48px] object-contain"
                        style={{ imageRendering: "pixelated" }}
                      />
                    ) : (
                      <span className="text-[22px]">?</span>
                    )}
                  </div>
                  <div>
                    <p
                      className="text-[12px] text-[#32322d]"
                      style={{
                        fontFamily: "Elice DX Neolli",
                        fontWeight: 700,
                      }}
                    >
                      {characterName.trim() || "픽셀 동물"}
                    </p>
                    <p
                      className="text-[11px] text-[#586148]"
                      style={{
                        fontFamily: "Galmuri11",
                        fontWeight: 700,
                      }}
                    >
                      남은 거리 {remainingMeters}m
                    </p>
                  </div>
                </div>
                <div
                  className="mt-4 rounded-full bg-[#2f352b]/85 px-5 py-1.5 text-[11px] text-white shadow-[0_2px_0_rgba(255,255,255,0.25)]"
                  style={{
                    fontFamily: "Elice DX Neolli",
                    fontWeight: 500,
                  }}
                >
                  {raceStatus === "won"
                    ? "포착 성공!"
                    : raceStatus === "lost"
                      ? "다시 도전해보세요"
                      : `${speedLabel} · 남은 거리 ${remainingMeters}m`}
                </div>
              </div>

              <div
                className="absolute inset-x-0 top-[156px] h-[112px]"
                style={{
                  background:
                    "linear-gradient(#9fd8f3 0%, #d8f1ff 62%, #65ad55 63%, #4c8e44 100%)",
                }}
              >
                <div className="absolute bottom-[18px] left-[-18px] h-[72px] w-[104px] rounded-t-full bg-[#3e7c37] shadow-[inset_0_10px_0_rgba(255,255,255,0.12)]" />
                <div className="absolute bottom-[16px] right-[-12px] h-[78px] w-[112px] rounded-t-full bg-[#4d913e] shadow-[inset_0_10px_0_rgba(255,255,255,0.12)]" />
                <div className="absolute bottom-[34px] left-[74px] h-[24px] w-[218px] rounded-full bg-white/55" />
                <div className="absolute bottom-[50px] left-[28px] h-[18px] w-[84px] rounded-full bg-white/45" />
              </div>

              <div
                className="absolute inset-x-0 top-[268px] h-[270px] bg-[#6cad48]"
                style={{
                  backgroundImage:
                    "linear-gradient(90deg, rgba(255,255,255,0.12) 1px, transparent 1px), linear-gradient(#86c85c 0 42px, transparent 42px)",
                  backgroundSize: "24px 24px, 100% 72px",
                  animation:
                    raceStatus === "racing" &&
                    isPlayerDashing &&
                    roadOffset < maxRoadOffset
                      ? "grassSlide 0.7s linear infinite"
                      : "none",
                }}
              />

              <div className="absolute inset-x-[18px] top-[274px] z-10 h-[238px] overflow-hidden rounded-[7px] border border-[#5c7b36]/30 shadow-[0_6px_0_rgba(48,76,34,0.18)]">
                <div
                  className="absolute left-0 top-0 h-full transition-transform duration-500 ease-out"
                  style={{
                    width: `${raceWorldWidth}px`,
                    transform: `translateX(-${roadOffset}px)`,
                  }}
                >
                  <div className="absolute left-0 top-0 h-[104px] w-full border-y border-[#f5e7c8] bg-[#af7443]">
                    <div
                      className="absolute inset-0 opacity-35"
                      style={{
                        backgroundImage:
                          "linear-gradient(90deg, rgba(92,58,32,0.28) 1px, transparent 1px)",
                        backgroundSize: "42px 100%",
                      }}
                    />
                  </div>
                  <div className="absolute left-0 top-[124px] h-[104px] w-full border-y border-[#f5e7c8] bg-[#af7443]">
                    <div
                      className="absolute inset-0 opacity-35"
                      style={{
                        backgroundImage:
                          "linear-gradient(90deg, rgba(92,58,32,0.28) 1px, transparent 1px)",
                        backgroundSize: "42px 100%",
                      }}
                    />
                  </div>
                  <div
                    className="absolute top-0 h-[228px] w-[6px] bg-white shadow-[0_0_0_1px_rgba(47,53,43,0.2)]"
                    style={{ left: `${finishWorldX}px` }}
                  >
                    <div className="absolute -right-[9px] -top-[13px] grid grid-cols-2 overflow-hidden rounded-[1px] border border-[#2f352b]">
                      <span className="h-[8px] w-[8px] bg-[#2f352b]" />
                      <span className="h-[8px] w-[8px] bg-white" />
                      <span className="h-[8px] w-[8px] bg-white" />
                      <span className="h-[8px] w-[8px] bg-[#2f352b]" />
                    </div>
                    <div
                      className="absolute -right-[18px] bottom-[-20px] rounded bg-[#2f352b] px-1 py-[1px] text-[10px] text-white"
                      style={{
                        fontFamily: "Galmuri11",
                        fontWeight: 700,
                      }}
                    >
                      {RACE_GOAL_METERS}m
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute inset-x-[18px] top-[274px] z-20 h-[104px] overflow-visible">
                <div
                  className="absolute bottom-[16px] transition-[left] duration-500 ease-out"
                  style={{
                    left: `${npcLeft}px`,
                  }}
                >
                  <div
                    className="absolute -left-9 top-7 flex gap-1"
                    aria-hidden="true"
                  >
                    <span className="h-2 w-2 rounded-full bg-white/75" />
                    <span className="mt-2 h-2 w-2 rounded-full bg-white/55" />
                  </div>
                  <img
                    src={imgNpcDog}
                    alt="상대 NPC"
                    className="h-[62px] w-[70px] object-contain"
                    style={{
                      animation:
                        raceStatus === "racing"
                          ? "runBob 0.28s linear infinite"
                          : "none",
                      imageRendering: "pixelated",
                      filter: "drop-shadow(0 6px 0 rgba(70,45,26,0.24))",
                    }}
                  />
                </div>
              </div>

              <div className="absolute inset-x-[18px] top-[398px] z-20 h-[114px] overflow-visible">
                {generatedImage ? (
                  <div
                    className="absolute bottom-[10px] transition-[left] duration-300 ease-out"
                    style={{
                      left: `${playerLeft}px`,
                      transform: speedShake,
                    }}
                  >
                    {raceStatus === "racing" &&
                      isPlayerDashing &&
                      speedLevel >= 2 && (
                        <>
                          <img
                            src={generatedImage}
                            alt=""
                            aria-hidden="true"
                            className="absolute left-[-16px] top-0 h-[96px] w-[108px] object-contain opacity-25"
                            style={{
                              animation:
                                "afterImageFade 0.32s linear infinite",
                              imageRendering: "pixelated",
                              filter: "sepia(1) saturate(1.3)",
                            }}
                          />
                          {speedLevel >= 4 && (
                            <img
                              src={generatedImage}
                              alt=""
                              aria-hidden="true"
                              className="absolute left-[-30px] top-1 h-[96px] w-[108px] object-contain opacity-15"
                              style={{
                                animation:
                                  "afterImageFade 0.24s linear infinite 0.08s",
                                imageRendering: "pixelated",
                                filter: "sepia(1) saturate(1.5)",
                              }}
                            />
                          )}
                        </>
                      )}
                    {raceStatus === "racing" &&
                      isPlayerDashing &&
                      speedLevel >= 3 && (
                        <span
                          className="absolute bottom-[4px] left-[16px] h-[9px] w-[70px] origin-center rounded-full bg-[#fff6ce]/80"
                          style={{
                            animation:
                              "groundPulse 0.28s ease-out infinite",
                          }}
                          aria-hidden="true"
                        />
                      )}
                    {raceStatus === "racing" && isPlayerDashing && (
                      <div
                        className="absolute -left-6 top-10 flex gap-1"
                        aria-hidden="true"
                      >
                        <span
                          className="h-2 w-2 rounded-full bg-white/80"
                          style={{
                            animation: `dustPop ${dustDuration} linear infinite`,
                            width: `${8 + speedLevel * 2}px`,
                            height: `${8 + speedLevel * 2}px`,
                          }}
                        />
                        <span
                          className="mt-3 h-2 w-2 rounded-full bg-white/60"
                          style={{
                            animation: `dustPop ${dustDuration} linear infinite 0.12s`,
                            width: `${7 + speedLevel * 2}px`,
                            height: `${7 + speedLevel * 2}px`,
                          }}
                        />
                        {speedLevel >= 2 && (
                          <span
                            className="mt-1 rounded-full bg-[#fff6ce]/80"
                            style={{
                              animation: `dustPop ${dustDuration} linear infinite 0.22s`,
                              width: `${10 + speedLevel * 3}px`,
                              height: `${5 + speedLevel}px`,
                            }}
                          />
                        )}
                      </div>
                    )}
                    <img
                      src={generatedImage}
                      alt="플레이어 픽셀 동물"
                      className="h-[96px] w-[108px] object-contain"
                      style={{
                        animation: playerRunAnimation,
                        imageRendering: "pixelated",
                        filter:
                          speedLevel >= 3
                            ? "drop-shadow(0 7px 0 rgba(70,45,26,0.25)) drop-shadow(-10px 0 10px rgba(255,246,206,0.35))"
                            : "drop-shadow(0 7px 0 rgba(70,45,26,0.25))",
                      }}
                    />
                  </div>
                ) : (
                  <div
                    className="absolute left-1/2 top-0 flex h-[104px] w-[132px] -translate-x-1/2 items-center justify-center rounded-[4px] bg-[#f2ebdd]/85 text-center text-[10px] leading-[1.5] text-[#8f7755]"
                    style={{
                      fontFamily: "Elice DX Neolli",
                      fontWeight: 300,
                      animation:
                        state === "generating"
                          ? "hop 0.8s ease-in-out infinite"
                          : "none",
                    }}
                  >
                    {state === "generating"
                      ? "생성 중"
                      : "픽셀 캐릭터가 여기서 달려요"}
                  </div>
                )}
              </div>

              <div className="relative z-30 mt-[360px] flex flex-col items-center gap-4 px-4 pb-7">
                {generatedImage && (
                  <button
                    type="button"
                    onClick={canDash ? handleDash : handleRestartRace}
                    className="relative flex h-[108px] w-[108px] items-center justify-center rounded-full bg-[#fff0aa] shadow-[0_0_0_5px_rgba(92,142,60,0.55),0_0_0_11px_rgba(255,240,170,0.5),0_9px_0_rgba(56,83,38,0.25)] transition-transform active:translate-y-[3px] active:shadow-[0_0_0_5px_rgba(92,142,60,0.55),0_0_0_11px_rgba(255,240,170,0.5),0_5px_0_rgba(56,83,38,0.25)]"
                    style={{
                      cursor: "pointer",
                      animation:
                        speedLevel >= 2 && canDash
                          ? "buttonPulse 0.55s ease-in-out infinite"
                          : "none",
                    }}
                  >
                    <span className="absolute inset-[12px] rounded-full bg-[#5f9740] shadow-inner" />
                    <span
                      className="absolute inset-[7px] rounded-full border-[3px] border-white/60"
                      style={{
                        opacity: speedRatio,
                      }}
                    />
                    <span
                      className="relative z-10 flex flex-col items-center text-center text-white"
                      style={{
                        fontFamily: "Elice DX Neolli",
                        fontWeight: 700,
                      }}
                    >
                      <span className="text-[11px] leading-[1.25]">
                        {canDash ? speedLabel : "다시"}
                      </span>
                      <span className="text-[12px] leading-[1.25]">
                        {canDash ? "더 빨리!" : "달리기"}
                      </span>
                    </span>
                  </button>
                )}

                <div className="flex min-h-[48px] w-[278px] items-center gap-2 rounded-[6px] border border-white/70 bg-[#fff6ce] px-3 py-2 shadow-[0_3px_0_rgba(67,84,45,0.15)]">
                  <span className="text-[18px]">💡</span>
                  <p
                    className="text-[10px] leading-[1.35] text-[#6b5b35]"
                    style={{
                      fontFamily: "Elice DX Neolli",
                      fontWeight: 500,
                    }}
                  >
                    버튼을 터치할수록 속도가 빨라져요!
                  </p>
                </div>

                <button
                  type="button"
                  onClick={generatedImage ? handleSave : handleGenerate}
                  disabled={!uploadedImage || state === "generating"}
                  className="h-[38px] w-[278px] rounded-[5px] border border-[#e9dfc8] bg-white text-[11px] tracking-[0.4px] text-[#32322d] shadow-[0_2px_0_rgba(67,84,45,0.12)] disabled:opacity-50"
                  style={{
                    fontFamily: "Elice DX Neolli",
                    fontWeight: 500,
                  }}
                >
                  {generatedImage ? "픽셀 PNG 저장하기" : "변환하기"}
                </button>
              </div>
            </div>
          </WindowPanel>
        </div>
        )}
      </main>
    </div>
  );
}

// ── App Router ────────────────────────────────────────────────
export default function App() {
  const pathname = window.location.pathname.replace(/\/+$/, "");

  if (pathname === "/classic") {
    return (
      <>
        <VersionNav active="classic" />
        <LegacyCardVersion />
      </>
    );
  }

  if (pathname === "/pixel-runner-stage") {
    return <PixelRunnerVersion staged />;
  }

  return <PixelRunnerVersion />;
}
