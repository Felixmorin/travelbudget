import { createSeoAgentReport } from "@/lib/seo-agent/analyzer";
import { getDefaultSeoDateRanges } from "@/lib/seo-agent/date-ranges";
import { fetchAnalyticsLandingPageRows, fetchSearchConsoleRows } from "@/lib/seo-agent/google-clients";
import type { DateRange } from "@/lib/seo-agent/types";

export async function runSeoAgent(ranges = getDefaultSeoDateRanges()) {
  const [searchRows, previousSearchRows, analyticsRows] = await Promise.all([
    fetchSearchConsoleRows(ranges.current),
    fetchSearchConsoleRows(ranges.previous),
    fetchAnalyticsLandingPageRows(ranges.current),
  ]);

  return createSeoAgentReport({
    dateRange: ranges.current,
    previousDateRange: ranges.previous,
    searchRows,
    previousSearchRows,
    analyticsRows,
  });
}

export function parseSeoDateRange(value: unknown): DateRange | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const startDate = (value as Record<string, unknown>).startDate;
  const endDate = (value as Record<string, unknown>).endDate;

  if (typeof startDate !== "string" || typeof endDate !== "string") {
    return null;
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(startDate) || !/^\d{4}-\d{2}-\d{2}$/.test(endDate)) {
    return null;
  }

  return { startDate, endDate };
}
