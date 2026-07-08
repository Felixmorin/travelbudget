import type { AnalyticsEventName, AnalyticsEventPayload, AnalyticsPayload, AnalyticsPrimitive } from "./events";
import { hasAnalyticsConsent } from "./consent";

type Gtag = (command: "event", eventName: string, properties?: AnalyticsPayload) => void;
type Plausible = (eventName: string, options?: { props?: AnalyticsPayload }) => void;
type VercelAnalytics = (command: "event", eventName: string, properties?: AnalyticsPayload) => void;
type SegmentAnalytics = {
  track: (eventName: string, properties?: AnalyticsPayload) => void;
};
type PostHog = {
  capture: (eventName: string, properties?: AnalyticsPayload) => void;
};

type AnalyticsWindow = Window & {
  analytics?: SegmentAnalytics;
  gtag?: Gtag;
  plausible?: Plausible;
  posthog?: PostHog;
  va?: VercelAnalytics;
};

export function trackEvent<EventName extends AnalyticsEventName>(
  eventName: EventName,
  properties?: AnalyticsEventPayload<EventName>
) {
  if (typeof window === "undefined") {
    return;
  }

  if (!hasAnalyticsConsent()) {
    return;
  }

  const analyticsWindow = window as AnalyticsWindow;
  const normalizedProperties = normalizeProperties(properties);
  const providers = getAnalyticsProviders(analyticsWindow);

  providers.forEach((provider) => provider(eventName, normalizedProperties));
  sendServerAnalyticsEvent(eventName, normalizedProperties);

  if (process.env.NODE_ENV === "development" && providers.length === 0) {
    console.debug("[analytics]", eventName, normalizedProperties);
  }
}

function sendServerAnalyticsEvent(eventName: string, properties: AnalyticsPayload) {
  const body = JSON.stringify({ eventName, properties });

  if (navigator.sendBeacon) {
    navigator.sendBeacon("/api/analytics-events", new Blob([body], { type: "application/json" }));
    return;
  }

  fetch("/api/analytics-events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
  }).catch(() => undefined);
}

function normalizeProperties(properties?: Record<string, AnalyticsPrimitive | undefined>) {
  return Object.fromEntries(
    Object.entries(properties ?? {})
      .filter(([, value]) => value !== undefined)
      .map(([key, value]) => [key, value ?? null])
  ) as AnalyticsPayload;
}

function getAnalyticsProviders(analyticsWindow: AnalyticsWindow) {
  const providers: Array<(eventName: string, properties: AnalyticsPayload) => void> = [];

  if (analyticsWindow.va) {
    providers.push((eventName, properties) => analyticsWindow.va?.("event", eventName, properties));
  }

  if (analyticsWindow.gtag) {
    providers.push((eventName, properties) => analyticsWindow.gtag?.("event", eventName, properties));
  }

  if (analyticsWindow.plausible) {
    providers.push((eventName, properties) => analyticsWindow.plausible?.(eventName, { props: properties }));
  }

  if (analyticsWindow.posthog) {
    providers.push((eventName, properties) => analyticsWindow.posthog?.capture(eventName, properties));
  }

  if (analyticsWindow.analytics?.track) {
    providers.push((eventName, properties) => analyticsWindow.analytics?.track(eventName, properties));
  }

  return providers;
}
