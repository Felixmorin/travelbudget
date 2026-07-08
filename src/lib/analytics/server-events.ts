import type { AnalyticsEventName, AnalyticsPayload } from "@/lib/analytics/events";
import { insertBackendRecord, isBackendStorageConfigured, selectBackendRecords } from "@/lib/backend/storage";

export type StoredAnalyticsEvent = {
  id: string;
  eventName: string;
  properties: AnalyticsPayload;
  pathname?: string;
  referrer?: string;
  userAgent?: string;
  createdAt: string;
};

export async function saveAnalyticsEvent({
  eventName,
  properties,
  referrer,
  userAgent,
}: {
  eventName: AnalyticsEventName;
  properties: AnalyticsPayload;
  referrer?: string;
  userAgent?: string;
}) {
  const event = {
    id: crypto.randomUUID(),
    eventName,
    properties,
    pathname: typeof properties.page === "string" ? properties.page : undefined,
    referrer,
    userAgent,
    createdAt: new Date().toISOString(),
  };

  if (isBackendStorageConfigured()) {
    await insertBackendRecord("analytics_events", {
      id: event.id,
      event_name: event.eventName,
      properties: event.properties,
      pathname: event.pathname,
      referrer: event.referrer,
      user_agent: event.userAgent,
      created_at: event.createdAt,
    });
  } else {
    getDevelopmentStore().analyticsEvents.push(event);
  }

  return event;
}

export async function listAnalyticsEvents() {
  if (isBackendStorageConfigured()) {
    const records = await selectBackendRecords("analytics_events");

    return records.map((record) => ({
      id: String(record.id ?? ""),
      eventName: String(record.event_name ?? ""),
      properties: parseProperties(record.properties),
      pathname: typeof record.pathname === "string" ? record.pathname : undefined,
      referrer: typeof record.referrer === "string" ? record.referrer : undefined,
      userAgent: typeof record.user_agent === "string" ? record.user_agent : undefined,
      createdAt: String(record.created_at ?? ""),
    }));
  }

  return [...getDevelopmentStore().analyticsEvents];
}

export function clearAnalyticsEvents() {
  getDevelopmentStore().analyticsEvents.length = 0;
}

function parseProperties(value: unknown): AnalyticsPayload {
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);

      return parsed && typeof parsed === "object" ? (parsed as AnalyticsPayload) : {};
    } catch {
      return {};
    }
  }

  return value && typeof value === "object" ? (value as AnalyticsPayload) : {};
}

function getDevelopmentStore(): { analyticsEvents: StoredAnalyticsEvent[] } {
  const globalStore = globalThis as typeof globalThis & {
    __travelBudgetAnalyticsEventsStore?: { analyticsEvents: StoredAnalyticsEvent[] };
  };

  globalStore.__travelBudgetAnalyticsEventsStore ??= { analyticsEvents: [] };

  return globalStore.__travelBudgetAnalyticsEventsStore;
}
