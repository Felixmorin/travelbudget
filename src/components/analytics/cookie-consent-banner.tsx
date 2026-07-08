"use client";

import { useEffect, useState } from "react";
import { useSyncExternalStore } from "react";

import { Button } from "@/components/ui/button";
import {
  getCookieConsent,
  OPEN_COOKIE_CONSENT_EVENT,
  saveCookieConsent,
  subscribeToCookieConsent,
  type CookieConsentStatus,
} from "@/lib/analytics/consent";

export function CookieConsentBanner() {
  const consent = useSyncExternalStore(subscribeToCookieConsent, getCookieConsent, () => null);
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);

  useEffect(() => {
    function openPreferences() {
      setIsPreferencesOpen(true);
    }

    window.addEventListener(OPEN_COOKIE_CONSENT_EVENT, openPreferences);

    return () => {
      window.removeEventListener(OPEN_COOKIE_CONSENT_EVENT, openPreferences);
    };
  }, []);

  function chooseConsent(consent: CookieConsentStatus) {
    const wasAccepted = getCookieConsent() === "accepted";

    saveCookieConsent(consent);
    setIsPreferencesOpen(false);

    if (wasAccepted && consent === "declined") {
      window.location.reload();
    }
  }

  if (!isPreferencesOpen && consent !== null) {
    return null;
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-[#c3c6d7]/60 bg-white/95 px-4 py-4 shadow-[0_-12px_40px_rgba(11,29,52,0.16)] backdrop-blur sm:px-6">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold text-slate-950">Cookie and analytics preferences</p>
          <p className="mt-1 text-sm leading-6 text-[#434655]">
            We use optional analytics cookies and tracking tools to understand site usage and improve trip planning
            features. Declining keeps non-essential analytics disabled.
          </p>
        </div>
        <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
          <Button variant="outline" size="lg" onClick={() => chooseConsent("declined")}>
            Decline analytics
          </Button>
          <Button size="lg" onClick={() => chooseConsent("accepted")}>
            Accept analytics
          </Button>
        </div>
      </div>
    </div>
  );
}
