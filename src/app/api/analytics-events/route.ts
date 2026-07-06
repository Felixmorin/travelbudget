import { analyticsEventNames, type AnalyticsEventName, type AnalyticsPayload } from "@/lib/analytics/events";
import { saveAnalyticsEvent } from "@/lib/analytics/server-events";

export async function POST(request: Request) {
  try {
    const body = await request.json();
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
  } catch {
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

  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>).filter(([, propertyValue]) =>
      ["string", "number", "boolean"].includes(typeof propertyValue) || propertyValue === null
    )
  ) as AnalyticsPayload;
}
