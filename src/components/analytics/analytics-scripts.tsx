"use client";

import Script from "next/script";
import { useSyncExternalStore } from "react";

import { getCookieConsent, subscribeToCookieConsent } from "@/lib/analytics/consent";

const googleAnalyticsId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
const clarityProjectId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;
const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
const plausibleScriptSrc = process.env.NEXT_PUBLIC_PLAUSIBLE_SCRIPT_SRC ?? "https://plausible.io/js/script.js";
const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com";
const travelpayoutsDriveScriptSrc = process.env.NEXT_PUBLIC_TRAVELPAYOUTS_DRIVE_SCRIPT_SRC;
const googleAdsClientId = process.env.NEXT_PUBLIC_GOOGLE_ADS_CLIENT_ID;

export function AnalyticsScripts() {
  const consent = useSyncExternalStore(subscribeToCookieConsent, getCookieConsent, () => null);

  if (consent !== "accepted") {
    return null;
  }

  return (
    <>
      {googleAnalyticsId ? (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(googleAnalyticsId)}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', ${JSON.stringify(googleAnalyticsId)});
            `}
          </Script>
        </>
      ) : null}
      {clarityProjectId ? (
        <Script id="microsoft-clarity" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", ${JSON.stringify(clarityProjectId)});
          `}
        </Script>
      ) : null}
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
      {travelpayoutsDriveScriptSrc ? (
        <Script id="travelpayouts-drive" strategy="afterInteractive">
          {`
            (function () {
              var script = document.createElement("script");
              script.async = true;
              script.src = ${JSON.stringify(travelpayoutsDriveScriptSrc)};
              script.setAttribute("nowprocket", "");
              script.setAttribute("data-noptimize", "1");
              script.setAttribute("data-cfasync", "false");
              script.setAttribute("data-wpfc-render", "false");
              script.setAttribute("seraph-accel-crit", "1");
              script.setAttribute("data-no-defer", "1");
              document.head.appendChild(script);
            })();
          `}
        </Script>
      ) : null}
      {googleAdsClientId ? (
        <Script
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(
            googleAdsClientId
          )}`}
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      ) : null}
    </>
  );
}
