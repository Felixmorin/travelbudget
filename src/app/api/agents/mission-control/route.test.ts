import { beforeEach, describe, expect, it, vi } from "vitest";

import { GET, POST } from "@/app/api/agents/mission-control/route";
import { runProductAnalystAnalysis } from "@/lib/agents/product-analyst/runner";
import { clearDevelopmentAgentRecords } from "@/lib/agents/store";
import { resetRequestGuardState } from "@/lib/security/request-guards";

describe("Mission Control route", () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
    vi.stubEnv("AI_AGENTS_ENABLED", "true");
    vi.stubEnv("AI_AGENT_ADMIN_TOKEN", "test-token");
    delete process.env.SUPABASE_URL;
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;
    delete process.env.SUPABASE_ANON_KEY;
    clearDevelopmentAgentRecords();
    resetRequestGuardState();
  });

  it("rejects unauthenticated snapshots", async () => {
    const response = await GET(new Request("https://gobybudget.com/api/agents/mission-control"));

    expect(response.status).toBe(401);
  });

  it("returns a protected Mission Control snapshot", async () => {
    await runProductAnalystAnalysis({
      source: "demo",
      requestedBy: "test",
      costLimitCents: 100,
    });

    const response = await GET(
      new Request("https://gobybudget.com/api/agents/mission-control", {
        headers: {
          authorization: "Bearer test-token",
        },
      })
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({
      ok: true,
      snapshot: {
        runtime: {
          envEnabled: true,
          stopped: false,
        },
        agents: expect.any(Array),
        productAnalystRecommendations: expect.any(Array),
      },
    });
  });

  it("stops agents globally through a protected action", async () => {
    const response = await POST(
      new Request("https://gobybudget.com/api/agents/mission-control", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: "Bearer test-token",
          "x-forwarded-for": "203.0.113.80",
        },
        body: JSON.stringify({
          action: "stop",
          reason: "Test stop",
        }),
      })
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({
      ok: true,
      snapshot: {
        runtime: {
          stopped: true,
          stopReason: "Test stop",
        },
      },
    });

    await expect(
      runProductAnalystAnalysis({
        source: "demo",
        requestedBy: "test",
        costLimitCents: 100,
      })
    ).rejects.toThrow("Agent runtime is globally stopped.");
  });
});
