"use client";

import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { useSyncExternalStore } from "react";

import { getCookieConsent, hasAnalyticsConsent, subscribeToCookieConsent } from "@/lib/analytics/consent";

export function ConsentManagedAnalytics() {
  const consent = useSyncExternalStore(subscribeToCookieConsent, getCookieConsent, () => null);

  if (consent !== "accepted") {
    return null;
  }

  return (
    <>
      <Analytics beforeSend={(event) => (hasAnalyticsConsent() ? event : null)} />
      <SpeedInsights />
    </>
  );
}
