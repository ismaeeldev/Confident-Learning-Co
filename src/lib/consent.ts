/**
 * Minimal cookie-consent state, stored client-side only (localStorage).
 * No third-party consent management platform is approved/specified
 * (Step 11's manual task 11.2 — "confirm cookie categories and consent
 * tool" — is still an open client decision), so this is a plain,
 * functional accept/reject mechanism rather than an invented CMP
 * integration. Analytics scripts (src/components/analytics/AnalyticsLoader.tsx)
 * never load until this returns "granted".
 */
const CONSENT_STORAGE_KEY = "cl_analytics_consent";

export type ConsentState = "unset" | "granted" | "denied";

export function getStoredConsent(): ConsentState {
  if (typeof window === "undefined") return "unset";
  const value = window.localStorage.getItem(CONSENT_STORAGE_KEY);
  return value === "granted" || value === "denied" ? value : "unset";
}

export function setStoredConsent(state: "granted" | "denied"): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CONSENT_STORAGE_KEY, state);
  window.dispatchEvent(new CustomEvent("cl-consent-change", { detail: state }));
}
