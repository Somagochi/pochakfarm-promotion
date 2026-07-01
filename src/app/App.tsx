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

type GeneratedCardAssets = {
  cardImage: string;
  cardBackImage: string;
  frameImage: string;
};

const FALLBACK_CARD_ASSETS: GeneratedCardAssets = {
  cardImage: imgCharFront,
  cardBackImage: imgCardBack,
  frameImage: imgCharFront,
};

const ONBOARDING_SLIDES = [
  "/assets/carousel1.png",
  "/assets/carousel2.png",
  "/assets/carousel3.png",
  "/assets/carousel4.png",
];
const LINK_PASTE_TOAST = "/assets/linkpaste.png";
const LOADING_ANIMAL_ICON = "/assets/loading-animal.png";

const KEYFRAMES = `
  @keyframes float      { 0%,100%{transform:translateY(0)}   50%{transform:translateY(-10px)} }
  @keyframes wobble     { 0%,100%{transform:rotate(-1.5deg)} 50%{transform:rotate(1.5deg)} }
  @keyframes spotlight  { 0%,100%{opacity:0.7}              50%{opacity:1} }
  @keyframes dogBreath  { 0%,100%{opacity:1}                50%{opacity:0.12} }
  @keyframes softPulse  { 0%,100%{transform:scale(1)}        50%{transform:scale(1.05)} }
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

function OnboardingCarousel({ initialSlide = 0 }: { initialSlide?: number }) {
  const [activeSlide, setActiveSlide] = useState(initialSlide);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<Array<HTMLDivElement | null>>([]);
  const scrollTimerRef = useRef<number>();

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlide((slide) => (slide + 1) % ONBOARDING_SLIDES.length);
    }, 2600);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    slideRefs.current[activeSlide]?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
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
        className="mt-4 flex h-[236px] w-full snap-x snap-mandatory overflow-x-auto scroll-smooth"
        style={{
          scrollbarWidth: "none",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {ONBOARDING_SLIDES.map((slide, index) => (
          <div
            key={slide}
            ref={(element) => {
              slideRefs.current[index] = element;
            }}
            className="flex h-full w-full shrink-0 snap-center items-center justify-center"
            style={{ minWidth: "100%" }}
          >
            <img
              src={slide}
              alt={`온보딩 ${index + 1}`}
              className="max-h-full max-w-full object-contain"
              style={{ transform: "translateX(14px)" }}
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
            onClick={() => setActiveSlide(index)}
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
    const DURATION = 12000;
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

  const loadingStep =
    progress < 0.3
      ? {
          percent: 30,
          label: "ANALIZING...",
          title: "동물을 분석하고 있어요",
          description: "사진 속 특징을 읽고 카드에 어울리는 형태를 찾는 중이에요",
        }
      : progress < 0.62
        ? {
            percent: 62,
            label: "PIXELING...",
            title: "픽셀 캐릭터를 만들고 있어요",
            description: "배경을 정리하고 귀여운 픽셀 스타일로 바꾸는 중이에요",
          }
        : progress < 0.86
          ? {
              percent: 86,
              label: "PACKING...",
              title: "카드팩에 담고 있어요",
              description: "이름과 이미지를 조합해서 나만의 카드를 준비하고 있어요",
            }
          : {
              percent: 95,
              label: "FINISHING...",
              title: "마지막 손질 중이에요",
              description: "곧 완성된 카드팩을 열어볼 수 있어요",
            };
  const loadingPercent = Math.round(progress * 100);

  return (
    <WindowPanel>
      <div className="flex min-h-[590px] flex-col items-center justify-center px-6 py-5">
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
              className="absolute bottom-[6px] h-[70px] w-[78px] overflow-hidden"
              style={{
                height: `${Math.max(6, progress * 70)}px`,
                transition: "height 0.1s linear",
              }}
              aria-hidden="true"
            >
              <img
                src={LOADING_ANIMAL_ICON}
                alt=""
                className="absolute bottom-0 h-[70px] w-[78px] object-contain"
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
            className="mt-1 text-center text-[10px] tracking-[1.1px] text-[#628d38]"
            style={{ fontFamily: "Galmuri11", fontWeight: 700 }}
          >
            {loadingStep.label}
          </p>
          <p
            className="mt-2 text-center text-[18px] leading-[1.35] tracking-[0.7px] text-[#32322d]"
            style={{
              fontFamily: "Elice DX Neolli",
              fontWeight: 500,
            }}
          >
            {loadingStep.title}
          </p>
          <p
            className="mt-3 min-h-[32px] px-3 text-center text-[10px] leading-[1.55] tracking-[0.35px] text-[#8f7755]"
            style={{
              fontFamily: "Elice DX Neolli",
              fontWeight: 300,
            }}
          >
            {loadingStep.description}
          </p>
        </div>

        <OnboardingCarousel />
      </div>
    </WindowPanel>
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
      <div className="flex min-h-[590px] flex-col items-center justify-center px-6 py-5">
        <div className="flex w-full flex-col items-center">
          <p
            className="text-center text-[18px] tracking-[1.4px] text-[#628d38]"
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
          style={{ width: "280px", height: "400px" }}
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
  const [showToast, setShowToast] = useState(false);

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
      img.src = assets.cardImage;
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
  }, [assets.cardImage, characterName]);

  const handleShare = useCallback(() => {
    navigator.clipboard?.writeText(window.location.href).catch(() => {});
    setShowToast(true);
  }, []);

  return (
    <div className="flex flex-col items-center w-full px-6 gap-6">
      {onRegister && (
        <button
          type="button"
          onClick={onRegister}
          className="absolute right-5 top-8 z-20 flex h-9 w-9 items-center justify-center text-[26px] leading-none text-white/95"
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
              src={assets.cardImage}
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
              src={assets.cardBackImage}
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
          이미지 저장
        </span>
      </PixelButton>

      {onRegister && (
        <button
          type="button"
          onClick={handleShare}
          className="relative h-[44px] w-[280px] rounded-[5px] border border-[#d7c080] bg-[#fff0aa] text-[12px] tracking-[0.8px] text-[#68553e] shadow-[0_2px_0_rgba(67,84,45,0.18)]"
          style={{
            fontFamily: "Elice DX Neolli",
            fontWeight: 500,
          }}
        >
          친구에게 공유하기
        </button>
      )}
      <ToastNotification
        visible={showToast}
        onHidden={() => setShowToast(false)}
      />
    </div>
  );
}

function ClassicV2Version() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [generatedAssets, setGeneratedAssets] =
    useState<GeneratedCardAssets | null>(null);
  const [characterName, setCharacterName] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [generationError, setGenerationError] = useState("");
  const [registrationView, setRegistrationView] = useState<
    "cta" | "complete" | null
  >(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isButtonActive =
    !!uploadedImage && characterName.trim().length > 0;
  const isPreviewMode =
    new URLSearchParams(window.location.search).get("preview") === "1";

  const readFile = useCallback((file: File) => {
    if (!ACCEPTED_TYPES.has(file.type)) return;
    trackEvent("classic_v2_photo_upload_started", {
      file_type: file.type,
    });
    const reader = new FileReader();
    reader.onload = (e) =>
      setUploadedImage(e.target?.result as string);
    reader.readAsDataURL(file);
  }, []);

  const handleConvert = useCallback(async () => {
    if (!isButtonActive) return;
    trackEvent("classic_v2_convert_started");
    setGenerationError("");
    setGeneratedAssets(null);
    setPhase("processing");

    if (isPreviewMode) {
      await new Promise((resolve) => window.setTimeout(resolve, 1400));
      setGeneratedAssets(FALLBACK_CARD_ASSETS);
      setPhase("pack");
      return;
    }

    try {
      const response = await fetch("/api/classic-v2-card", {
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
          payload.error || "카드 이미지를 만들지 못했어요.",
        );
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
        frameImage:
          typeof payload.frameImage === "string"
            ? payload.frameImage
            : FALLBACK_CARD_ASSETS.frameImage,
      });
      setPhase("pack");
    } catch (error) {
      setGenerationError(
        error instanceof Error
          ? error.message
          : "카드 이미지를 만들지 못했어요.",
      );
      setPhase("idle");
    }
  }, [characterName, isButtonActive, isPreviewMode, uploadedImage]);

  const handleOpenPack = useCallback(() => setPhase("dim"), []);
  const handleResult = useCallback(() => {
    trackEvent("classic_v2_result_viewed");
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
        frameImage={generatedAssets?.frameImage ?? null}
        onBack={() => setRegistrationView(null)}
        onComplete={() => setRegistrationView("complete")}
      />
    );
  }

  if (registrationView === "complete") {
    return <CompletePage onShareAgain={() => {}} />;
  }

  return (
    <div className="min-h-[100dvh] w-full bg-[#628d38] flex justify-center relative overflow-hidden">
      <style>{KEYFRAMES}</style>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `url("${imgBgPattern}")`,
          backgroundRepeat: "repeat",
          backgroundSize: "361px",
          opacity: 0.3,
        }}
      />

      <main className="relative flex min-h-[100dvh] w-full max-w-[360px] flex-col justify-center px-[14px] pb-4 pt-[44px]">
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

        {phase === "idle" && (
          <WindowPanel>
            <div className="flex min-h-[590px] flex-col items-center justify-center px-8 py-4">
              <p
                className="mb-2 text-center text-[11px] tracking-[1.1px] text-[#628d38]"
                style={{ fontFamily: "Galmuri11", fontWeight: 700 }}
              >
                CLASSIC V2
              </p>
              <p
                className="mb-2 text-center text-[18px] leading-[1.35] tracking-[0.9px] text-[#32322d]"
                style={{
                  fontFamily: "Elice DX Neolli",
                  fontWeight: 500,
                }}
              >
                동물 사진과 이름으로
                <br />
                카드팩을 열어보세요
              </p>
              <p
                className="mb-4 text-center text-[10px] leading-[1.6] tracking-[0.4px] text-[#6a6a61]"
                style={{
                  fontFamily: "Elice DX Neolli",
                  fontWeight: 300,
                }}
              >
                스크롤 없이 한 화면에서
                <br />
                단계별로 진행돼요
              </p>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/heic"
                onChange={(e) => {
                  if (e.target.files?.[0]) readFile(e.target.files[0]);
                }}
                className="hidden"
              />

              <button
                type="button"
                className="relative h-[180px] w-[240px] overflow-hidden rounded-[4px]"
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
                  if (e.dataTransfer.files[0])
                    readFile(e.dataTransfer.files[0]);
                }}
                onClick={() => fileInputRef.current?.click()}
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

              <div className="mt-4">
                <PixelButton
                  onClick={handleConvert}
                  disabled={!isButtonActive}
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
                <p
                  className="mt-3 min-h-[18px] text-center text-[10px] leading-[1.5] tracking-[0.3px] text-[#c84f3d]"
                  style={{
                    fontFamily: "Elice DX Neolli",
                    fontWeight: 300,
                  }}
                >
                  {generationError}
                </p>
              )}
            </div>
          </WindowPanel>
        )}

        {phase === "processing" && (
          <ProcessingPanel />
        )}

        {phase === "pack" && (
          <CardPackPanel onOpen={handleOpenPack} />
        )}
      </main>

      {(phase === "dim" || phase === "result") &&
        uploadedImage && (
          <PackOpeningOverlay
            characterName={characterName}
            assets={generatedAssets ?? FALLBACK_CARD_ASSETS}
            onResult={handleResult}
            onRegister={() => setRegistrationView("cta")}
          />
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
      className="fixed left-1/2 z-[220] flex w-[293px] items-center justify-center"
      style={{
        bottom: "48px",
        opacity: isVisible ? 1 : 0,
        transform: `translateX(-50%) translateY(${isVisible ? "0" : "24px"})`,
        transition: "transform 0.28s ease, opacity 0.28s ease",
      }}
    >
      <img
        src={LINK_PASTE_TOAST}
        alt="링크가 복사되었습니다"
        className="h-auto w-full"
        draggable={false}
      />
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
  const digits = phone.replace(/\D/g, "");
  const formattedPhone =
    digits.length <= 3
      ? digits
      : digits.length <= 7
        ? `${digits.slice(0, 3)}-${digits.slice(3)}`
        : `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7, 11)}`;
  const canSubmit = digits.length === 11 && required;
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
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="max-h-[calc(100dvh-32px)] w-full max-w-[360px] overflow-y-auto rounded-[16px] border-2 border-[#cdb792] bg-[#faf5eb] px-6 pb-6 pt-5 shadow-2xl">
        <div className="relative text-center">
          <button
            type="button"
            onClick={onClose}
            className="absolute right-0 top-0 flex h-8 w-8 items-center justify-center text-[18px] text-[#8f7755]"
            aria-label="닫기"
          >
            x
          </button>
          <h2
            className="text-[18px] leading-[1.4] tracking-[0.9px] text-[#32322d]"
            style={{ fontFamily: "Elice DX Neolli", fontWeight: 500 }}
          >
            {view === "terms" ? "개인정보 수집 및 이용 동의" : "얼리 농장주 등록"}
          </h2>
          {view === "form" && (
            <p
              className="mt-2 text-[10px] leading-[1.6] tracking-[0.4px] text-[#6a6a61]"
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
              className="mt-5 block text-[11px] tracking-[0.5px] text-[#32322d]"
              style={{ fontFamily: "Elice DX Neolli", fontWeight: 500 }}
            >
              전화번호
            </label>
            <input
              type="tel"
              value={formattedPhone}
              onChange={(event) =>
                setPhone(event.target.value.replace(/\D/g, "").slice(0, 11))
              }
              placeholder="000-0000-0000"
              className="mt-2 h-[48px] w-full rounded-[8px] border border-[#cdb792] bg-white px-4 text-[14px] tracking-[0.5px] text-[#32322d] placeholder:text-[#cdb792] focus:border-[#628d38] focus:outline-none"
              style={{ fontFamily: "Elice DX Neolli", fontWeight: 300 }}
            />

            <div className="mt-4 flex flex-col gap-3">
              <div className="flex items-center gap-3 text-left">
                <button
                  type="button"
                  onClick={() => setRequired((value) => !value)}
                  className="flex flex-1 items-center gap-3 text-left"
                >
                  <span
                    className="flex h-5 w-5 shrink-0 items-center justify-center rounded-[4px] border-2 text-[12px] text-white"
                    style={{
                      borderColor: required ? "#628d38" : "#cdb792",
                      background: required ? "#628d38" : "white",
                    }}
                  >
                    {required ? "✓" : ""}
                  </span>
                  <span
                    className="flex-1 text-[10px] tracking-[0.4px] text-[#45372a]"
                    style={{ fontFamily: "Elice DX Neolli", fontWeight: 300 }}
                  >
                    <span className="text-[#628d38]">[필수]</span> 개인정보 수집 및 이용 동의
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setView("terms")}
                  className="h-7 rounded-[5px] border border-[#cdb792] bg-[#fffdf8] px-2 text-[10px] tracking-[0.4px] text-[#68553e]"
                  style={{ fontFamily: "Elice DX Neolli", fontWeight: 500 }}
                >
                  보기
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={canSubmit ? onComplete : undefined}
              className="mt-5 flex h-[52px] w-full items-center justify-center rounded-[12px] text-[16px] tracking-[1.6px] text-white"
              style={{
                background: canSubmit ? "#628d38" : "#cdb792",
                cursor: canSubmit ? "pointer" : "not-allowed",
                fontFamily: "Elice DX Neolli",
                fontWeight: 500,
              }}
            >
              등록하기
            </button>
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
              onClick={() => setView("form")}
              className="mt-5 flex h-[48px] w-full items-center justify-center rounded-[12px] bg-[#628d38] text-[15px] tracking-[1.2px] text-white"
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
  frameImage,
  onComplete,
  onBack,
}: {
  characterName: string;
  frameImage: string | null;
  onComplete: () => void;
  onBack: () => void;
}) {
  const [showDialog, setShowDialog] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href).catch(() => {});
    setShowToast(true);
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
      <main className="relative flex min-h-[100dvh] w-full max-w-[360px] flex-col justify-center px-[14px] pb-8 pt-[24px]">
        <WindowPanel>
          <div className="flex flex-col items-center gap-4 px-6 pb-6 pt-[27px]">
            <p
              className="text-center text-[18px] leading-[1.4] tracking-[0.9px] text-[#32322d]"
              style={{ fontFamily: "Elice DX Neolli", fontWeight: 500 }}
            >
              {characterName || "픽셀 동물"}을
              <br />
              농장에 입주시킬 수 있어요
            </p>
            <p
              className="text-center text-[10px] tracking-[0.4px] text-[#6a6a61]"
              style={{ fontFamily: "Elice DX Neolli", fontWeight: 300 }}
            >
              사전등록하면 출시 소식과 보상을 알려드려요
            </p>

            <div className="relative h-[206px] w-[206px] overflow-hidden rounded-[8px] border border-[#a4a499] bg-[#fafaf8] shadow-md">
              {frameImage ? (
                <img
                  src={frameImage}
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

            <div className="w-full rounded-[4px] border border-[#cdb792] bg-[#fffdf8] px-3 py-3">
              <p
                className="mb-2 text-center text-[11px] tracking-[1.1px] text-[#68553e]"
                style={{ fontFamily: "Elice DX Neolli", fontWeight: 500 }}
              >
                사전등록 보상
              </p>
              {["출시 알림 문자", "사전예약 한정 보상", "농장 입주 소식"].map(
                (reward) => (
                  <div key={reward} className="mt-2 flex items-center gap-2">
                    <span className="h-4 w-4 shrink-0 rounded-[3px] border border-[#cdb792] bg-white" />
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

            <PixelButton onClick={() => setShowDialog(true)}>
              <span
                className="w-full text-center text-[16px] tracking-[1.6px] text-white"
                style={{ fontFamily: "Elice DX Neolli", fontWeight: 500 }}
              >
                오픈 알림 받기
              </span>
            </PixelButton>

            <button
              type="button"
              onClick={handleShare}
              className="h-[44px] w-[280px] rounded-[5px] border border-[#cdb792] bg-[#faf5eb] text-[12px] tracking-[0.8px] text-[#68553e]"
              style={{ fontFamily: "Elice DX Neolli", fontWeight: 500 }}
            >
              친구에게 공유하기
            </button>
            <button
              type="button"
              onClick={onBack}
              className="text-[10px] tracking-[0.4px] text-[#6a6a61]"
              style={{ fontFamily: "Elice DX Neolli", fontWeight: 300 }}
            >
              결과 화면으로 돌아가기
            </button>
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
            setShowDialog(false);
            onComplete();
          }}
        />
      )}
    </div>
  );
}

function CompletePage({
  onShareAgain,
}: {
  onShareAgain: () => void;
}) {
  const [showToast, setShowToast] = useState(false);
  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href).catch(() => {});
    setShowToast(true);
    onShareAgain();
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
      <main className="relative flex min-h-[100dvh] w-full max-w-[360px] flex-col justify-center px-[14px] pb-8 pt-[24px]">
        <WindowPanel>
          <div className="flex flex-col items-center gap-4 px-6 pb-6 pt-[30px]">
            <p
              className="text-center text-[18px] leading-[1.4] tracking-[0.9px] text-[#32322d]"
              style={{ fontFamily: "Elice DX Neolli", fontWeight: 500 }}
            >
              등록 완료
            </p>
            <p
              className="text-center text-[10px] tracking-[0.4px] text-[#6a6a61]"
              style={{ fontFamily: "Elice DX Neolli", fontWeight: 300 }}
            >
              출시되면 문자로 가장 먼저 알려드릴게요
            </p>
            <div className="w-full rounded-[4px] border border-[#cdb792] bg-[#fffdf8] px-4 py-4">
              {[
                "출시 알림은 문자로 발송됩니다.",
                "사전예약 보상은 출시 후 순차 지급됩니다.",
                "혜택 알림 동의는 언제든 변경할 수 있습니다.",
              ].map((text) => (
                <p
                  key={text}
                  className="mb-2 text-[10px] leading-[1.5] tracking-[0.36px] text-[#8f7755] last:mb-0"
                  style={{ fontFamily: "Elice DX Neolli", fontWeight: 300 }}
                >
                  {text}
                </p>
              ))}
            </div>
            <button
              type="button"
              onClick={handleShare}
              className="h-[44px] w-[280px] rounded-[5px] border border-[#cdb792] bg-[#faf5eb] text-[12px] tracking-[0.8px] text-[#68553e]"
              style={{ fontFamily: "Elice DX Neolli", fontWeight: 500 }}
            >
              친구에게 공유하기
            </button>
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
