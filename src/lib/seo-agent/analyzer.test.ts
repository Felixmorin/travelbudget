import { describe, expect, it, vi } from "vitest";

import { createSeoAgentReport } from "@/lib/seo-agent/analyzer";

describe("createSeoAgentReport", () => {
  it("prioritizes CTR, ranking, decline, and engagement opportunities", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://gobybudget.com");

    const report = createSeoAgentReport({
      dateRange: { startDate: "2026-06-13", endDate: "2026-07-10" },
      previousDateRange: { startDate: "2026-05-16", endDate: "2026-06-12" },
      searchRows: [
        {
          page: "https://gobybudget.com/travel-budget/mexico",
          query: "mexico travel budget",
          clicks: 12,
          impressions: 1000,
          ctr: 0.012,
          position: 3.2,
        },
        {
          page: "https://gobybudget.com/from/montreal/under-1000",
          query: "cheap trips from montreal",
          clicks: 4,
          impressions: 350,
          ctr: 0.011,
          position: 12.4,
        },
        {
          page: "https://gobybudget.com/destinations/thailand",
          query: "thailand travel cost",
          clicks: 10,
          impressions: 220,
          ctr: 0.045,
          position: 6,
        },
        {
          page: "https://gobybudget.com/results",
          query: "best trips from halifax under 1200",
          clicks: 1,
          impressions: 180,
          ctr: 0.005,
          position: 18,
        },
      ],
      previousSearchRows: [
        {
          page: "https://gobybudget.com/destinations/thailand",
          query: "thailand travel cost",
          clicks: 50,
          impressions: 800,
          ctr: 0.0625,
          position: 4,
        },
      ],
      analyticsRows: [
        {
          path: "/travel-budget/mexico",
          sessions: 120,
          activeUsers: 90,
          engagementRate: 0.31,
        },
      ],
    });

    expect(report.summary.opportunities).toBeGreaterThanOrEqual(4);
    expect(report.opportunities.map((opportunity) => opportunity.category)).toEqual(
      expect.arrayContaining(["ctr", "ranking", "decline", "engagement"])
    );
    expect(report.opportunities[0]?.impactScore).toBeGreaterThanOrEqual(report.opportunities.at(-1)?.impactScore ?? 0);
    expect(report.internalLinkSuggestions.length).toBeGreaterThan(0);
    expect(report.programmaticPageIdeas.length).toBeGreaterThan(0);
  });
});
