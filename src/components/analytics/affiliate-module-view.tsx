"use client";

import { useEffect, useRef } from "react";

import type { AnalyticsEventPayload } from "@/lib/analytics/events";
import { trackEvent } from "@/lib/analytics/track";

type AffiliateModuleViewProps = {
  eventProperties: AnalyticsEventPayload<"affiliate_module_viewed">;
};

export function AffiliateModuleView({ eventProperties }: AffiliateModuleViewProps) {
  const elementRef = useRef<HTMLDivElement>(null);
  const hasTracked = useRef(false);

  useEffect(() => {
    const element = elementRef.current;

    if (!element || hasTracked.current) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting || hasTracked.current) {
          return;
        }

        hasTracked.current = true;
        trackEvent("affiliate_module_viewed", eventProperties);
        observer.disconnect();
      },
      { threshold: 0.5 }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [eventProperties]);

  return <div ref={elementRef} aria-hidden="true" className="sr-only" />;
}
