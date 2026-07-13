import { beforeEach, describe, expect, it, vi } from "vitest";

import { GET, POST } from "@/app/api/agents/product-analyst/route";
import { clearDevelopmentAgentRecords } from "@/lib/agents/store";
import { resetRequestGuardState } from "@/lib/security/request-guards";

describe("Product Analyst agent route", () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
    vi.stubEnv("AI_AGENT_ADMIN_TOKEN", "test-token");
    delete process.env.SUPABASE_URL;
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;
    delete process.env.SUPABASE_ANON_KEY;
    clearDevelopmentAgentRecords();
    resetRequestGuardState();
  });

  it("rejects unauthorized manual runs", async () => {
    vi.stubEnv("AI_AGENTS_ENABLED", "true");

    const response = await POST(
      new Request("https://gobybudget.com/api/agents/product-analyst", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-forwarded-for": "203.0.113.50",
        },
        body: JSON.stringify({
          source: "demo",
        }),
      })
    );

    expect(response.status).toBe(401);
  });

  it("honors the global agent switch", async () => {
    vi.stubEnv("AI_AGENTS_ENABLED", "false");

    const response = await POST(
      new Request("https://gobybudget.com/api/agents/product-analyst", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: "Bearer test-token",
          "x-forwarded-for": "203.0.113.51",
        },
        body: JSON.stringify({
          source: "demo",
        }),
      })
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toMatchObject({
      ok: false,
      error: "Agents are disabled by AI_AGENTS_ENABLED.",
    });
  });

  it("runs a demo analysis and returns authenticated history", async () => {
    vi.stubEnv("AI_AGENTS_ENABLED", "true");

    const postResponse = await POST(
      new Request("https://gobybudget.com/api/agents/product-analyst", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: "Bearer test-token",
          "x-forwarded-for": "203.0.113.52",
        },
        body: JSON.stringify({
          source: "demo",
          costLimitCents: 100,
        }),
      })
    );

    expect(postResponse.status).toBe(200);
    await expect(postResponse.json()).resolves.toMatchObject({
      ok: true,
      report: {
        agentId: "product-analyst",
        source: "demo",
        findings: expect.any(Array),
      },
      history: [
        {
          status: "completed",
          source: "demo",
        },
      ],
    });

    const getResponse = await GET(
      new Request("https://gobybudget.com/api/agents/product-analyst", {
        headers: {
          authorization: "Bearer test-token",
        },
      })
    );

    expect(getResponse.status).toBe(200);
    await expect(getResponse.json()).resolves.toMatchObject({
      ok: true,
      history: [
        {
          status: "completed",
          source: "demo",
        },
      ],
    });
  });
});
