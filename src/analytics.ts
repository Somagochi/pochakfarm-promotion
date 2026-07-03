type GtagCommand = "js" | "config" | "event";

type Gtag = (
  command: GtagCommand,
  target: string | Date,
  params?: Record<string, unknown>,
) => void;

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: Gtag;
  }
}

const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;
let initialized = false;

export function initAnalytics() {
  if (!measurementId || initialized) return;

  initialized = true;

  const hasGtagScript = !!document.querySelector(
    `script[src*="googletagmanager.com/gtag/js?id=${measurementId}"]`,
  );

  if (!hasGtagScript) {
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.appendChild(script);
  }

  window.dataLayer = window.dataLayer || [];
  window.gtag =
    window.gtag ||
    function gtag() {
      window.dataLayer.push(arguments);
    };

  window.gtag("js", new Date());
  window.gtag("config", measurementId, {
    page_path: window.location.pathname + window.location.search,
    page_title: document.title,
  });
}

export function trackEvent(
  name: string,
  params: Record<string, unknown> = {},
) {
  if (!window.gtag) return;

  window.gtag("event", name, params);
}
