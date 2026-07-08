import { analyticsEventNames, type AnalyticsEventName, type AnalyticsPayload } from "@/lib/analytics/events";
import { saveAnalyticsEvent } from "@/lib/analytics/server-events";
import { getErrorMessage, logServerEvent } from "@/lib/monitoring/server-logger";
import { enforceRateLimit, getRequestGuardResponse, readJsonBody } from "@/lib/security/request-guards";

const maxAnalyticsBodyBytes = 8_192;
const maxAnalyticsEventsPerMinute = 60;
const maxPropertyCount = 32;
const maxStringPropertyLength = 300;

export async function POST(request: Request) {
  try {
    enforceRateLimit(request, "analytics-events", {
      limit: maxAnalyticsEventsPerMinute,
      windowMs: 60_000,
    });

    const body = await readJsonBody(request, maxAnalyticsBodyBytes);
    const eventName = getEventName(body);

    if (!eventName) {
      return Response.json({ ok: false, error: "Invalid analytics event." }, { status: 400 });
    }

    await saveAnalyticsEvent({
      eventName,
      properties: normalizeProperties(body.properties),
      referrer: request.headers.get("referer") ?? undefined,
      userAgent: request.headers.get("user-agent") ?? undefined,
    });

    return Response.json({ ok: true });
  } catch (error) {
    const guardResponse = getRequestGuardResponse(error);

    if (guardResponse) {
      return guardResponse;
    }

    await logServerEvent("warn", "Analytics event request failed.", {
      error: getErrorMessage(error),
    });

    return Response.json({ ok: false, error: "Unable to track analytics event." }, { status: 400 });
  }
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
