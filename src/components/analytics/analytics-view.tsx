"use client";

import { useEffect } from "react";

import type { AnalyticsEventName, AnalyticsEventPayload } from "@/lib/analytics/events";
import { trackEvent } from "@/lib/analytics/track";

type AnalyticsViewProps<EventName extends AnalyticsEventName> = {
  eventName: EventName;
  eventProperties?: AnalyticsEventPayload<EventName>;
};

export function AnalyticsView<EventName extends AnalyticsEventName>({
  eventName,
  eventProperties,
}: AnalyticsViewProps<EventName>) {
  useEffect(() => {
    trackEvent(eventName, eventProperties);
  }, [eventName, eventProperties]);

  return null;
}

