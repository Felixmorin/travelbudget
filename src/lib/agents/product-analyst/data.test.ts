import { beforeEach, describe, expect, it, vi } from "vitest";

import { clearAnalyticsEvents, saveAnalyticsEvent } from "@/lib/analytics/server-events";
import { appendAgentLog, clearDevelopmentAgentRecords } from "@/lib/agents/store";
import { collectProductAnalystData } from "@/lib/agents/product-analyst/data";
import { saveAffiliateClick, clearStoredAffiliateClicks } from "@/lib/affiliate/tracking";
import { saveEmailLead, clearStoredEmailLeads } from "@/lib/leads/email-leads";

describe("Product Analyst data collector", () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
    delete process.env.SUPABASE_URL;
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;
    delete process.env.SUPABASE_ANON_KEY;
    clearAnalyticsEvents();
    clearStoredAffiliateClicks();
    clearStoredEmailLeads();
    clearDevelopmentAgentRecords();
  });

  it("collects only allowed aggregate product signals", async () => {
    await saveAnalyticsEvent({
      eventName: "search_started",
      properties: {
        page: "/",
      },
    });
    await saveAnalyticsEvent({
      eventName: "search_completed",
      properties: {
        page: "/",
        resultCount: 0,
      },
    });
    await saveAnalyticsEvent({
      eventName: "destination_card_clicked",
      properties: {
        destinationSlug: "japan",
        destinationName: "Japan",
      },
    });
    await saveAnalyticsEvent({
      eventName: "budget_result_viewed",
      properties: {
        deviceType: "mobile",
        lcpMs: 3500,
        inpMs: 180,
      },
    });
    await saveAffiliateClick({
      href: "https://www.skyscanner.com",
      affiliateType: "Flights",
    });
    await saveEmailLead({
      email: "traveler@example.com",
      currency: "CAD",
    });
    await appendAgentLog({
      level: "error",
      eventName: "test.error",
      message: "Application test error.",
      context: {},
    });

    const data = await collectProductAnalystData("stored");

    expect(data.searches).toEqual({
      started: 1,
      completed: 1,
      withoutResults: 1,
    });
    expect(data.selectedDestinations.top).toEqual([{ destinationSlug: "japan", count: 1 }]);
    expect(data.affiliateClicks.byType).toEqual([{ affiliateType: "Flights", count: 1 }]);
    expect(data.savedTrips).toEqual({
      total: 1,
      byCurrency: [{ currency: "CAD", count: 1 }],
    });
    expect(data.appErrors.top).toEqual([{ message: "Application test error.", count: 1 }]);
    expect(data.performance.mobile).toEqual({
      samples: 1,
      averageLcpMs: 3500,
      averageInpMs: 180,
    });
    expect(JSON.stringify(data)).not.toContain("traveler@example.com");
  });
});
