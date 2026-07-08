import { beforeEach, describe, expect, it } from "vitest";

import {
  enforceRateLimit,
  getRequestGuardResponse,
  readJsonBody,
  resetRequestGuardState,
  RequestGuardError,
} from "@/lib/security/request-guards";

describe("request guards", () => {
  beforeEach(() => {
    resetRequestGuardState();
  });

  it("blocks requests above the configured rate limit", () => {
    const request = new Request("https://gobybudget.com/api/test", {
      headers: {
        "x-forwarded-for": "203.0.113.10",
      },
    });

    enforceRateLimit(request, "test", { limit: 1, windowMs: 60_000 });

    expect(() => enforceRateLimit(request, "test", { limit: 1, windowMs: 60_000 })).toThrow("Too many requests.");
  });

  it("rejects JSON bodies above the configured size", async () => {
    const request = new Request("https://gobybudget.com/api/test", {
      method: "POST",
      body: JSON.stringify({ value: "x".repeat(20) }),
      headers: {
        "content-type": "application/json",
      },
    });

    await expect(readJsonBody(request, 10)).rejects.toThrow("Request body is too large.");
  });

  it("returns structured responses for guard errors", async () => {
    const response = getRequestGuardResponse(new RequestGuardError("Blocked.", 429));

    expect(response?.status).toBe(429);
    await expect(response?.json()).resolves.toEqual({ ok: false, error: "Blocked." });
  });
});
