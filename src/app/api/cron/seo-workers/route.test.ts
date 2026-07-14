import { beforeEach, describe, expect, it, vi } from "vitest";

import { GET } from "@/app/api/cron/seo-workers/route";

vi.mock("@/lib/seo-agent/run-agent", async () => {
  const actual = await vi.importActual<typeof import("@/lib/seo-agent/run-agent")>("@/lib/seo-agent/run-agent");

  return {
    ...actual,
    runSeoAgent: vi.fn(async () => ({
      generatedAt: "2026-07-14T20:00:00.000Z",
      dateRange: { startDate: "2026-06-14", endDate: "2026-07-11" },
      previousDateRange: { startDate: "2026-05-17", endDate: "2026-06-13" },
      summary: {
        opportunities: 0,
        highPriority: 0,
        searchRowsAnalyzed: 0,
        analyticsRowsAnalyzed: 0,
        internalLinkSuggestions: 0,
        programmaticPageIdeas: 0,
      },
      opportunities: [],
      internalLinkSuggestions: [],
      programmaticPageIdeas: [],
    })),
  };
});

describe("cron seo workers route", () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
  });

  it("requires the cron secret", async () => {
    vi.stubEnv("CRON_SECRET", "cron-secret");

    const response = await GET(new Request("https://gobybudget.com/api/cron/seo-workers"));

    expect(response.status).toBe(401);
  });

  it("returns a scheduled worker run when authorized", async () => {
    vi.stubEnv("CRON_SECRET", "cron-secret");

    const response = await GET(
      new Request("https://gobybudget.com/api/cron/seo-workers", {
        headers: {
          Authorization: "Bearer cron-secret",
        },
      })
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({
      ok: true,
      workerRun: {
        mode: "scheduled",
        summary: {
          workers: 4,
        },
      },
    });
  });
});
