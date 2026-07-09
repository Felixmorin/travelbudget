import { beforeEach, describe, expect, it, vi } from "vitest";

import { POST } from "@/app/api/monitoring/webhook-test/route";

describe("monitoring webhook test route", () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
    delete process.env.MONITORING_WEBHOOK_URL;
    delete process.env.MONITORING_WEBHOOK_SECRET;
  });

  it("requires webhook configuration", async () => {
    const response = await POST(
      new Request("https://gobybudget.com/api/monitoring/webhook-test", {
        method: "POST",
      })
    );

    expect(response.status).toBe(503);
  });

  it("requires the monitoring webhook secret as bearer authorization", async () => {
    vi.stubEnv("MONITORING_WEBHOOK_URL", "https://alerts.example.com/webhook");
    vi.stubEnv("MONITORING_WEBHOOK_SECRET", "test-secret");

    const response = await POST(
      new Request("https://gobybudget.com/api/monitoring/webhook-test", {
        method: "POST",
      })
    );

    expect(response.status).toBe(401);
  });

  it("delivers a verification event to the configured webhook", async () => {
    vi.stubEnv("MONITORING_WEBHOOK_URL", "https://alerts.example.com/webhook");
    vi.stubEnv("MONITORING_WEBHOOK_SECRET", "test-secret");
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(null, { status: 204 }));

    const response = await POST(
      new Request("https://gobybudget.com/api/monitoring/webhook-test", {
        method: "POST",
        headers: {
          Authorization: "Bearer test-secret",
        },
      })
    );

    expect(response.status).toBe(200);
    expect(fetchMock).toHaveBeenCalledWith(
      new URL("https://alerts.example.com/webhook"),
      expect.objectContaining({
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer test-secret",
        },
      })
    );
  });
});
