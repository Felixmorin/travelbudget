import { analyticsEventNames, type AnalyticsEventName, type AnalyticsPayload } from "@/lib/analytics/events";
import { saveAnalyticsEvent } from "@/lib/analytics/server-events";
import { handleGuardedJsonPost } from "@/lib/security/request-guards";

const maxAnalyticsBodyBytes = 8_192;
const maxAnalyticsEventsPerMinute = 60;
const maxPropertyCount = 32;
const maxStringPropertyLength = 300;

export async function POST(request: Request) {
  return handleGuardedJsonPost({
    request,
    scope: "analytics-events",
    maxBodyBytes: maxAnalyticsBodyBytes,
    rateLimit: {
      limit: maxAnalyticsEventsPerMinute,
      windowMs: 60_000,
    },
    failureLogMessage: "Analytics event request failed.",
    failureEventType: "analytics_error",
    failureResponseError: "Unable to track analytics event.",
    handler: async (body) => {
      const eventName = getEventName(body);

      if (!eventName) {
        return Response.json({ ok: false, error: "Invalid analytics event." }, { status: 400 });
      }

      await saveAnalyticsEvent({
        eventName,
        properties: normalizeProperties(getBodyProperty(body, "properties")),
        referrer: request.headers.get("referer") ?? undefined,
        userAgent: request.headers.get("user-agent") ?? undefined,
      });

      return Response.json({ ok: true });
    },
  });
}

function getEventName(body: unknown): AnalyticsEventName | null {
  if (!body || typeof body !== "object") {
    return null;
  }

  const eventName = (body as Record<string, unknown>).eventName;

  return typeof eventName === "string" && analyticsEventNames.includes(eventName as AnalyticsEventName)
    ? (eventName as AnalyticsEventName)
    : null;
}

function getBodyProperty(body: unknown, propertyName: string) {
  return body && typeof body === "object" ? (body as Record<string, unknown>)[propertyName] : undefined;
}

function normalizeProperties(value: unknown): AnalyticsPayload {
  if (!value || typeof value !== "object") {
    return {};
  }

  const properties: AnalyticsPayload = {};

  for (const [propertyName, propertyValue] of Object.entries(value as Record<string, unknown>).slice(0, maxPropertyCount)) {
    if (propertyValue === null || typeof propertyValue === "boolean") {
      properties[propertyName] = propertyValue;
    } else if (typeof propertyValue === "number" && Number.isFinite(propertyValue)) {
      properties[propertyName] = propertyValue;
    } else if (typeof propertyValue === "string") {
      properties[propertyName] = propertyValue.slice(0, maxStringPropertyLength);
    }
  }

  return properties;
}
