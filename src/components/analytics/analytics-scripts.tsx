"use client";

import Script from "next/script";
import { useSyncExternalStore } from "react";

import { getCookieConsent, subscribeToCookieConsent } from "@/lib/analytics/consent";

const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
const plausibleScriptSrc = process.env.NEXT_PUBLIC_PLAUSIBLE_SCRIPT_SRC ?? "https://plausible.io/js/script.js";
const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com";

export function AnalyticsScripts() {
  const consent = useSyncExternalStore(subscribeToCookieConsent, getCookieConsent, () => null);

  if (consent !== "accepted") {
    return null;
  }

  return (
    <>
      {plausibleDomain ? (
        <Script
          defer
          data-domain={plausibleDomain}
          src={plausibleScriptSrc}
          strategy="afterInteractive"
        />
      ) : null}
      {posthogKey ? (
        <Script id="posthog" strategy="afterInteractive">
          {`
            !function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.crossOrigin="anonymous",p.async=!0,p.src=s.api_host.replace(".i.posthog.com","-assets.i.posthog.com")+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="init capture register register_once unregister identify alias set_config reset get_distinct_id onFeatureFlags reloadFeatureFlags".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
            posthog.init(${JSON.stringify(posthogKey)}, {
              api_host: ${JSON.stringify(posthogHost)},
              capture_pageview: true,
              capture_pageleave: true,
              person_profiles: "identified_only"
            });
          `}
        </Script>
      ) : null}
    </>
  );
}
