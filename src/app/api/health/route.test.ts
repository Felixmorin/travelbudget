import { beforeEach, describe, expect, it, vi } from "vitest";

import { GET } from "@/app/api/health/route";

describe("health route", () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
    delete process.env.SUPABASE_URL;
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;
    delete process.env.SUPABASE_ANON_KEY;
    delete process.env.MONITORING_WEBHOOK_URL;
    delete process.env.MONITORING_WEBHOOK_SECRET;
    delete process.env.INCIDENT_ALERTING_PROVIDER;
    delete process.env.INCIDENT_ALERTING_ESCALATION_TARGET;
  });

  it("returns an explicit 503 when production Supabase config is incomplete", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("INCIDENT_ALERTING_PROVIDER", "pager");
    vi.stubEnv("INCIDENT_ALERTING_ESCALATION_TARGET", "on-call");

    const response = GET();

    expect(response.status).toBe(503);
    await expect(response.json()).resolves.toMatchObject({
      ok: false,
      backend: {
        configured: false,
        mode: "Misconfigured",
        missing: ["SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY"],
        error: "Supabase URL is required in production.",
      },
    });
  });

  it("returns ok when production Supabase and alerting are configured", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("SUPABASE_URL", "https://example.supabase.co");
    vi.stubEnv("SUPABASE_SERVICE_ROLE_KEY", "service-role");
    vi.stubEnv("INCIDENT_ALERTING_PROVIDER", "pager");
    vi.stubEnv("INCIDENT_ALERTING_ESCALATION_TARGET", "on-call");

    const response = GET();

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({
      ok: true,
      backend: {
        configured: true,
        mode: "Supabase",
        missing: [],
        error: null,
        urlHost: "example.supabase.co",
      },
    });
  });
});
