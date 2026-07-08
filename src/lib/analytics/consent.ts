export type CookieConsentStatus = "accepted" | "declined";

export const COOKIE_CONSENT_STORAGE_KEY = "gobybudget_cookie_consent";
export const COOKIE_CONSENT_CHANGED_EVENT = "gobybudget:cookie-consent-changed";
export const OPEN_COOKIE_CONSENT_EVENT = "gobybudget:open-cookie-consent";

export function getCookieConsent(): CookieConsentStatus | null {
  if (typeof window === "undefined") {
    return null;
  }

  const storedConsent = window.localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY);

  if (storedConsent === "accepted" || storedConsent === "declined") {
    return storedConsent;
  }

  return null;
}

export function hasAnalyticsConsent() {
  return getCookieConsent() === "accepted";
}

export function saveCookieConsent(consent: CookieConsentStatus) {
  window.localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, consent);
  window.dispatchEvent(new CustomEvent(COOKIE_CONSENT_CHANGED_EVENT, { detail: consent }));
}

export function subscribeToCookieConsent(callback: () => void) {
  window.addEventListener(COOKIE_CONSENT_CHANGED_EVENT, callback);
  window.addEventListener("storage", callback);

  return () => {
    window.removeEventListener(COOKIE_CONSENT_CHANGED_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}
