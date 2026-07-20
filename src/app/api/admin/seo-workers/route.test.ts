import { beforeEach, describe, expect, it, vi } from "vitest";

import { POST } from "@/app/api/admin/seo-workers/route";
import { resetRequestGuardState } from "@/lib/security/request-guards";

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
        contentRefreshSuggestions: 0,
        serpIntentSuggestions: 0,
      },
      opportunities: [],
      internalLinkSuggestions: [],
      programmaticPageIdeas: [],
      contentRefreshSuggestions: [],
      serpIntentSuggestions: [],
    })),
  };
});

describe("seo workers route", () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
    resetRequestGuardState();
  });

  it("rejects requests without the configured admin token", async () => {
    vi.stubEnv("SEO_AGENT_ADMIN_TOKEN", "secret");

    const response = await POST(new Request("https://gobybudget.com/api/admin/seo-workers", { method: "POST" }));

    expect(response.status).toBe(401);
  });

  it("returns a worker run for authorized requests", async () => {
    vi.stubEnv("SEO_AGENT_ADMIN_TOKEN", "secret");

    const response = await POST(
      new Request("https://gobybudget.com/api/admin/seo-workers", {
        method: "POST",
        headers: {
          Authorization: "Bearer secret",
        },
      })
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({
      ok: true,
      workerRun: {
        mode: "manual",
        summary: {
          workers: 6,
        },
      },
    });
  });
});
