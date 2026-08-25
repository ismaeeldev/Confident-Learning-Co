/**
 * Client-side opt-out for Vercel Web Analytics (client instruction, 25 Aug
 * 2026): "cookieless does not on its own remove the consent requirement in
 * the UK... needs a visible way for someone to switch it off." No banner,
 * no interstitial — just a persistent footer link to a page carrying a
 * single toggle, defaulting to on. Stored in the visitor's own browser
 * (localStorage), exactly like the previous accept/reject choice was.
 */
const ANALYTICS_DISABLED_STORAGE_KEY = "cl_analytics_disabled";

/** Defaults to enabled (true) when nothing has been stored yet. */
export function isAnalyticsEnabled(): boolean {
  if (typeof window === "undefined") return true;
  return window.localStorage.getItem(ANALYTICS_DISABLED_STORAGE_KEY) !== "true";
}

export function setAnalyticsEnabled(enabled: boolean): void {
  if (typeof window === "undefined") return;
  if (enabled) {
    window.localStorage.removeItem(ANALYTICS_DISABLED_STORAGE_KEY);
  } else {
    window.localStorage.setItem(ANALYTICS_DISABLED_STORAGE_KEY, "true");
  }
  window.dispatchEvent(new CustomEvent("cl-analytics-consent-change", { detail: enabled }));
}
