import { selectBackendRecords } from "@/lib/backend/storage";
import { listStoredAffiliateClicks } from "@/lib/affiliate/tracking";
import { listAnalyticsEvents } from "@/lib/analytics/server-events";
import { listStoredLeadCaptures } from "@/lib/leads/lead-capture";
import { listStoredSavedTrips } from "@/lib/saved-trips/saved-trips";

export type DashboardMetric = {
  label: string;
  value: number;
  detail: string;
};

export async function getDashboardMetrics() {
  const [leads, savedTrips, affiliateClicks] = await Promise.all([
    safeSelect("leads", listStoredLeadCaptures()),
    safeSelect("saved_trips", listStoredSavedTrips()),
    safeSelect("affiliate_clicks", listStoredAffiliateClicks()),
  ]);
  const analyticsEvents = await listAnalyticsEvents();
  const searchEvents = analyticsEvents.filter((event) =>
    ["search_started", "search_completed", "budget_calculator_submitted"].includes(event.eventName)
  );
  const destinationClickEvents = analyticsEvents.filter((event) =>
    ["destination_card_clicked", "result_clicked", "destination_viewed"].includes(event.eventName)
  );
  const affiliateLinkEvents = analyticsEvents.filter((event) => event.eventName === "affiliate_link_clicked");

  const topDestinationClicks = rankBy(
    destinationClickEvents
      .map((event) => getAnalyticsString(event.properties, "destinationSlug") ?? getAnalyticsString(event.properties, "destinationName"))
      .filter((value): value is string => Boolean(value))
  );
  const topEmailDestinations = rankBy(
    leads
      .map((lead) => getRecordString(lead, "destination"))
      .filter((value): value is string => Boolean(value))
  );

  return {
    storageMode: process.env.SUPABASE_URL ? "Supabase" : "Development memory",
    metrics: [
      {
        label: "Emails",
        value: leads.length,
        detail: "Lead captures from budget alerts and price alerts.",
      },
      {
        label: "Saved trips",
        value: savedTrips.length,
        detail: "Destinations saved against an email identity.",
      },
      {
        label: "Searches",
        value: searchEvents.length,
        detail: "Search and calculator submission events.",
      },
      {
        label: "Affiliate CTR",
        value: Math.max(affiliateClicks.length, affiliateLinkEvents.length),
        detail: "Tracked outbound clicks through internal /go routes and click events.",
      },
    ] satisfies DashboardMetric[],
    topDestinationClicks,
    destinationCtr: rate(destinationClickEvents.length, searchEvents.length),
    affiliateCtr: rate(Math.max(affiliateClicks.length, affiliateLinkEvents.length), destinationClickEvents.length),
    topEmailDestinations,
  };
}

async function safeSelect(table: "leads" | "saved_trips" | "affiliate_clicks", fallback: Record<string, unknown>[]) {
  if (!process.env.SUPABASE_URL) {
    return fallback;
  }

  try {
    return await selectBackendRecords(table);
  } catch {
    return fallback;
  }
}

function rankBy(values: string[]) {
  const counts = new Map<string, number>();

  values.forEach((value) => counts.set(value, (counts.get(value) ?? 0) + 1));

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([label, value]) => ({ label, value }));
}

function getRecordString(record: Record<string, unknown>, key: string) {
  const value = record[key];

  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function getAnalyticsString(record: Record<string, unknown>, key: string) {
  const value = record[key];

  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function rate(numerator: number, denominator: number) {
  return denominator > 0 ? `${Math.round((numerator / denominator) * 100)}%` : "0%";
}
