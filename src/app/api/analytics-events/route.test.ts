import { beforeEach, describe, expect, it, vi } from "vitest";

import { POST } from "@/app/api/analytics-events/route";
import { clearAnalyticsEvents, listAnalyticsEvents } from "@/lib/analytics/server-events";
import { resetRequestGuardState } from "@/lib/security/request-guards";

describe("analytics events route", () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
    delete process.env.SUPABASE_URL;
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;
    delete process.env.SUPABASE_ANON_KEY;
    clearAnalyticsEvents();
    resetRequestGuardState();
  });

  it("accepts known event names and normalizes properties", async () => {
    const response = await POST(
      new Request("https://gobybudget.com/api/analytics-events", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-forwarded-for": "203.0.113.30",
        },
        body: JSON.stringify({
          eventName: "cta_clicked",
          properties: {
            page: "/",
            label: "Start",
            nested: { unsafe: true },
          },
        }),
      })
    );

    expect(response.status).toBe(200);
    await expect(listAnalyticsEvents()).resolves.toMatchObject([
      {
        eventName: "cta_clicked",
        properties: {
          page: "/",
          label: "Start",
        },
      },
    ]);
  });

  it("rejects unknown event names", async () => {
    const response = await POST(
      new Request("https://gobybudget.com/api/analytics-events", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-forwarded-for": "203.0.113.31",
        },
        body: JSON.stringify({
          eventName: "unknown_event",
          properties: {},
        }),
      })
    );

    expect(response.status).toBe(400);
    await expect(listAnalyticsEvents()).resolves.toEqual([]);
  });
});
