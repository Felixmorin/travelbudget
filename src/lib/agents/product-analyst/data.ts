import { listAnalyticsEvents } from "@/lib/analytics/server-events";
import { productAnalystDemoData } from "@/lib/agents/product-analyst/demo-data";
import type { ProductAnalystData, ProductAnalystSource } from "@/lib/agents/product-analyst/types";
import { listDevelopmentAgentRecords } from "@/lib/agents/store";
import { isBackendStorageConfigured, selectBackendRecords } from "@/lib/backend/storage";
import { listStoredAffiliateClicks } from "@/lib/affiliate/tracking";
import { listStoredEmailLeads } from "@/lib/leads/email-leads";

type CountItem = {
  key: string;
  count: number;
};

export async function collectProductAnalystData(source: ProductAnalystSource): Promise<ProductAnalystData> {
  if (source === "demo") {
    return {
      ...productAnalystDemoData,
      generatedAt: new Date().toISOString(),
    };
  }

  const [analyticsEvents, affiliateClicks, savedTrips, appErrors] = await Promise.all([
    listAnalyticsEvents(),
    listAffiliateClickRows(),
    listSavedTripRows(),
    listAppErrorRows(),
  ]);

  const searchesStarted = analyticsEvents.filter((event) => event.eventName === "search_started").length;
  const searchesCompleted = analyticsEvents.filter((event) => event.eventName === "search_completed").length;
  const searchesWithoutResults = analyticsEvents.filter(
    (event) =>
      (event.eventName === "search_completed" || event.eventName === "budget_result_viewed") &&
      getNumericProperty(event.properties, "resultCount", "resultsCount") === 0
  ).length;
  const selectedDestinations = analyticsEvents
    .filter((event) => event.eventName === "destination_card_clicked" || event.eventName === "result_clicked")
    .map((event) => getStringProperty(event.properties, "destinationSlug"))
    .filter((destinationSlug): destinationSlug is string => Boolean(destinationSlug));
  const performanceSamples = analyticsEvents
    .map((event) => ({
      deviceType: getStringProperty(event.properties, "deviceType", "device"),
      lcpMs: getNumericProperty(event.properties, "lcpMs", "lcp"),
      inpMs: getNumericProperty(event.properties, "inpMs", "inp"),
    }))
    .filter((sample) => sample.deviceType === "mobile" || sample.deviceType === "desktop");

  return {
    source: "stored",
    generatedAt: new Date().toISOString(),
    searches: {
      started: searchesStarted,
      completed: searchesCompleted,
      withoutResults: searchesWithoutResults,
    },
    selectedDestinations: {
      total: selectedDestinations.length,
      top: topCounts(selectedDestinations).map((item) => ({
        destinationSlug: item.key,
        count: item.count,
      })),
    },
    affiliateClicks: {
      total: affiliateClicks.length,
      byType: topCounts(affiliateClicks.map((click) => click.affiliateType ?? "unknown")).map((item) => ({
        affiliateType: item.key,
        count: item.count,
      })),
    },
    savedTrips: {
      total: savedTrips.length,
      byCurrency: topCounts(savedTrips.map((trip) => trip.currency || "unknown")).map((item) => ({
        currency: item.key,
        count: item.count,
      })),
    },
    appErrors: {
      total: appErrors.length,
      top: topCounts(appErrors.map((error) => error.message || "Unknown error")).map((item) => ({
        message: item.key,
        count: item.count,
      })),
    },
    performance: {
      mobile: summarizePerformance(performanceSamples.filter((sample) => sample.deviceType === "mobile")),
      desktop: summarizePerformance(performanceSamples.filter((sample) => sample.deviceType === "desktop")),
    },
  };
}

async function listAffiliateClickRows() {
  if (isBackendStorageConfigured()) {
    const records = await selectBackendRecords("affiliate_clicks");

    return records.map((record) => ({
      affiliateType: typeof record.affiliate_type === "string" ? record.affiliate_type : undefined,
    }));
  }

  return listStoredAffiliateClicks().map((click) => ({
    affiliateType: click.affiliateType,
  }));
}

async function listSavedTripRows() {
  if (isBackendStorageConfigured()) {
    const records = await selectBackendRecords("email_leads");

    return records.map((record) => ({
      currency: typeof record.currency === "string" ? record.currency : undefined,
    }));
  }

  return listStoredEmailLeads().map((lead) => ({
    currency: lead.currency,
  }));
}

async function listAppErrorRows() {
  if (isBackendStorageConfigured()) {
    const records = await selectBackendRecords("agent_logs", {
      level: "eq.error",
    });

    return records.map((record) => ({
      message: typeof record.message === "string" ? record.message : undefined,
    }));
  }

  return listDevelopmentAgentRecords()
    .logs.filter((log) => log.level === "error")
    .map((log) => ({
      message: log.message,
    }));
}

function topCounts(values: string[], limit = 5): CountItem[] {
  const counts = new Map<string, number>();

  values.forEach((value) => counts.set(value, (counts.get(value) ?? 0) + 1));

  return [...counts.entries()]
    .map(([key, count]) => ({ key, count }))
    .sort((a, b) => b.count - a.count || a.key.localeCompare(b.key))
    .slice(0, limit);
}

function summarizePerformance(samples: Array<{ lcpMs?: number; inpMs?: number }>) {
  return {
    samples: samples.length,
    averageLcpMs: average(samples.map((sample) => sample.lcpMs)),
    averageInpMs: average(samples.map((sample) => sample.inpMs)),
  };
}

function average(values: Array<number | undefined>) {
  const validValues = values.filter((value): value is number => typeof value === "number" && Number.isFinite(value));

  if (validValues.length === 0) {
    return null;
  }

  return Math.round(validValues.reduce((total, value) => total + value, 0) / validValues.length);
}

function getStringProperty(properties: Record<string, unknown>, ...keys: string[]) {
  const value = keys.map((key) => properties[key]).find((propertyValue) => typeof propertyValue === "string");

  return typeof value === "string" && value.trim() ? value.trim().slice(0, 120) : undefined;
}

function getNumericProperty(properties: Record<string, unknown>, ...keys: string[]) {
  const value = keys.map((key) => properties[key]).find((propertyValue) => typeof propertyValue === "number");

  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}
