declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
  }
}

let initialized = false;

export function initAnalytics() {
  if (initialized) return;

  initialized = true;
  window.dataLayer = window.dataLayer || [];

  window.dataLayer.push({
    event: "page_view",
    page_path: window.location.pathname + window.location.search,
    page_title: document.title,
  });
}

export function trackEvent(
  name: string,
  params: Record<string, unknown> = {},
) {
  window.dataLayer = window.dataLayer || [];

  window.dataLayer.push({
    event: name,
    ...params,
  });
}
