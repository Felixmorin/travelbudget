import { beforeEach, describe, expect, it, vi } from "vitest";

import { POST } from "@/app/api/admin/seo-agent/route";
import { resetRequestGuardState } from "@/lib/security/request-guards";

vi.mock("@/lib/seo-agent/google-clients", () => ({
  fetchSearchConsoleRows: vi.fn(async () => []),
  fetchAnalyticsLandingPageRows: vi.fn(async () => []),
}));

describe("seo agent route", () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
    resetRequestGuardState();
  });

  it("requires the admin token to be configured", async () => {
    const response = await POST(new Request("https://gobybudget.com/api/admin/seo-agent", { method: "POST" }));

    expect(response.status).toBe(503);
    await expect(response.json()).resolves.toMatchObject({
      ok: false,
      error: "SEO_AGENT_ADMIN_TOKEN is required.",
    });
  });

  it("rejects requests without the configured admin token", async () => {
    vi.stubEnv("SEO_AGENT_ADMIN_TOKEN", "secret");

    const response = await POST(new Request("https://gobybudget.com/api/admin/seo-agent", { method: "POST" }));

    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toMatchObject({
      ok: false,
      error: "Unauthorized.",
    });
  });

  it("returns a report for authorized requests", async () => {
    vi.stubEnv("SEO_AGENT_ADMIN_TOKEN", "secret");

    const response = await POST(
      new Request("https://gobybudget.com/api/admin/seo-agent", {
        method: "POST",
        headers: {
          Authorization: "Bearer secret",
        },
      })
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({
      ok: true,
      report: {
        summary: {
          opportunities: 0,
        },
      },
    });
  });
});
