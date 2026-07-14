import { getGoogleAccessToken } from "@/lib/seo-agent/google-auth";
import type { AnalyticsLandingPageRow, DateRange, SearchConsoleRow } from "@/lib/seo-agent/types";

const searchConsoleScope = "https://www.googleapis.com/auth/webmasters.readonly";
const analyticsScope = "https://www.googleapis.com/auth/analytics.readonly";

type SearchConsoleApiRow = {
  keys?: string[];
  clicks?: number;
  impressions?: number;
  ctr?: number;
  position?: number;
};

type AnalyticsRunReportResponse = {
  rows?: Array<{
    dimensionValues?: Array<{ value?: string }>;
    metricValues?: Array<{ value?: string }>;
  }>;
};

export async function fetchSearchConsoleRows(dateRange: DateRange): Promise<SearchConsoleRow[]> {
  const siteUrl = process.env.GOOGLE_SEARCH_CONSOLE_SITE_URL?.trim();

  if (!siteUrl) {
    throw new Error("GOOGLE_SEARCH_CONSOLE_SITE_URL is required.");
  }

  const accessToken = await getGoogleAccessToken([searchConsoleScope]);
  const response = await fetch(
    `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
        dimensions: ["page", "query"],
        rowLimit: 25_000,
        dataState: "final",
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`Search Console API request failed with status ${response.status}.`);
  }

  const body = (await response.json()) as { rows?: SearchConsoleApiRow[] };

  return (body.rows ?? []).map((row) => ({
    page: row.keys?.[0] ?? "",
    query: row.keys?.[1],
    clicks: row.clicks ?? 0,
    impressions: row.impressions ?? 0,
    ctr: row.ctr ?? 0,
    position: row.position ?? 0,
  })).filter((row) => row.page);
}

export async function fetchAnalyticsLandingPageRows(dateRange: DateRange): Promise<AnalyticsLandingPageRow[]> {
  const propertyId = process.env.GA4_PROPERTY_ID?.trim();

  if (!propertyId) {
    throw new Error("GA4_PROPERTY_ID is required.");
  }

  const accessToken = await getGoogleAccessToken([analyticsScope]);
  const response = await fetch(`https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      dateRanges: [dateRange],
      dimensions: [{ name: "landingPagePlusQueryString" }],
      metrics: [{ name: "sessions" }, { name: "activeUsers" }, { name: "engagementRate" }],
      limit: "10000",
    }),
  });

  if (!response.ok) {
    throw new Error(`GA4 Data API request failed with status ${response.status}.`);
  }

  const body = (await response.json()) as AnalyticsRunReportResponse;

  return (body.rows ?? []).map((row) => ({
    path: normalizeAnalyticsPath(row.dimensionValues?.[0]?.value),
    sessions: parseMetric(row.metricValues?.[0]?.value),
    activeUsers: parseMetric(row.metricValues?.[1]?.value),
    engagementRate: parseMetric(row.metricValues?.[2]?.value),
  })).filter((row) => row.path);
}

function normalizeAnalyticsPath(value: string | undefined) {
  if (!value || value === "(not set)") {
    return "";
  }

  return value.startsWith("/") ? value : `/${value}`;
}

function parseMetric(value: string | undefined) {
  const metric = Number(value);
  return Number.isFinite(metric) ? metric : 0;
}
