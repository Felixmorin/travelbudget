import { beforeEach, describe, expect, it, vi } from "vitest";

import { clearLeadCaptureRateLimits, POST } from "@/app/api/lead-capture/route";
import {
  clearStoredLeadCaptures,
  isValidEmail,
  listStoredLeadCaptures,
  normalizeLeadCapturePayload,
} from "@/lib/leads/lead-capture";

describe("lead capture validation", () => {
  beforeEach(() => {
    clearStoredLeadCaptures();
    clearLeadCaptureRateLimits();
    vi.unstubAllEnvs();
    delete process.env.LEAD_CAPTURE_WEBHOOK_URL;
    delete process.env.LEAD_CAPTURE_WEBHOOK_SECRET;
  });

  it("rejects invalid email addresses", () => {
    expect(isValidEmail("not-an-email")).toBe(false);
    expect(() =>
      normalizeLeadCapturePayload({
        email: "not-an-email",
        intent: "trip_budget",
      })
    ).toThrow("Enter a valid email address.");
  });

  it("normalizes a valid email capture payload", () => {
    expect(
      normalizeLeadCapturePayload({
        email: " Traveler@Example.COM ",
        intent: "price_alert",
        destination: "Portugal",
        origin: "Québec",
        budget: "2400",
        duration: "10",
        source: "destination_sidebar",
        pathname: "/destinations/portugal",
      })
    ).toEqual({
      email: "traveler@example.com",
      intent: "price_alert",
      destination: "Portugal",
      origin: "Québec",
      budget: 2400,
      duration: 10,
      source: "destination_sidebar",
      pathname: "/destinations/portugal",
    });
  });

  it("rejects honeypot fields without exposing spam details", () => {
    expect(() =>
      normalizeLeadCapturePayload({
        email: "traveler@example.com",
        intent: "trip_budget",
        website: "https://spam.example",
      })
    ).toThrow("Unable to save this email request.");
  });
});

describe("lead capture API", () => {
  beforeEach(() => {
    clearStoredLeadCaptures();
    clearLeadCaptureRateLimits();
    vi.unstubAllEnvs();
    delete process.env.LEAD_CAPTURE_WEBHOOK_URL;
    delete process.env.LEAD_CAPTURE_WEBHOOK_SECRET;
  });

  it("stores a valid trip budget email request with the expected payload", async () => {
    const response = await POST(
      new Request("https://travelbudget.ai/api/lead-capture", {
        method: "POST",
        body: JSON.stringify({
          email: "traveler@example.com",
          intent: "trip_budget",
          destination: "Japan",
          origin: "Ottawa",
          budget: 2500,
          duration: 10,
          source: "results_budget_breakdown",
          pathname: "/results",
        }),
      })
    );
    const body = (await response.json()) as { ok: boolean; leadId: string; timestamp: string };
    const storedLeads = listStoredLeadCaptures();

    expect(response.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(body.leadId).toBeTruthy();
    expect(body.timestamp).toBeTruthy();
    expect(storedLeads).toHaveLength(1);
    expect(storedLeads[0]).toMatchObject({
      email: "traveler@example.com",
      intent: "trip_budget",
      destination: "Japan",
      origin: "Ottawa",
      budget: 2500,
      duration: 10,
      source: "results_budget_breakdown",
      pathname: "/results",
    });
  });

  it("returns a clean API error for invalid payloads", async () => {
    const response = await POST(
      new Request("https://travelbudget.ai/api/lead-capture", {
        method: "POST",
        body: JSON.stringify({
          email: "bad",
          intent: "trip_budget",
        }),
      })
    );
    const body = (await response.json()) as { ok: boolean; error: string };

    expect(response.status).toBe(400);
    expect(body).toEqual({
      ok: false,
      error: "Enter a valid email address.",
    });
    expect(listStoredLeadCaptures()).toHaveLength(0);
  });

  it("sends valid leads to the configured provider webhook", async () => {
    const originalFetch = global.fetch;
    const requests: { url: string; init?: RequestInit }[] = [];

    process.env.LEAD_CAPTURE_WEBHOOK_URL = "https://provider.example/leads";
    process.env.LEAD_CAPTURE_WEBHOOK_SECRET = "secret-token";
    global.fetch = async (url, init) => {
      requests.push({ url: String(url), init });
      return new Response(null, { status: 202 });
    };

    try {
      const response = await POST(
        new Request("https://travelbudget.ai/api/lead-capture", {
          method: "POST",
          body: JSON.stringify({
            email: "traveler@example.com",
            intent: "price_alert",
            destination: "Portugal",
          }),
        })
      );

      expect(response.status).toBe(200);
      expect(listStoredLeadCaptures()).toHaveLength(0);
      expect(requests).toHaveLength(1);
      expect(requests[0].url).toBe("https://provider.example/leads");
      expect(requests[0].init?.headers).toMatchObject({
        "Content-Type": "application/json",
        Authorization: "Bearer secret-token",
      });
      expect(JSON.parse(String(requests[0].init?.body))).toMatchObject({
        event: "lead_capture.created",
        lead: {
          email: "traveler@example.com",
          intent: "price_alert",
          destination: "Portugal",
        },
      });
    } finally {
      global.fetch = originalFetch;
    }
  });

  it("fails closed in production when no provider is configured", async () => {
    vi.stubEnv("NODE_ENV", "production");

    const response = await POST(
      new Request("https://travelbudget.ai/api/lead-capture", {
        method: "POST",
        body: JSON.stringify({
          email: "traveler@example.com",
          intent: "trip_budget",
        }),
      })
    );
    const body = (await response.json()) as { ok: boolean; error: string };

    expect(response.status).toBe(503);
    expect(body).toEqual({
      ok: false,
      error: "Email capture is not configured.",
    });
  });

  it("rate limits repeated email capture requests", async () => {
    for (let index = 0; index < 5; index += 1) {
      const response = await POST(
        new Request("https://travelbudget.ai/api/lead-capture", {
          method: "POST",
          headers: {
            "x-forwarded-for": "203.0.113.10",
          },
          body: JSON.stringify({
            email: `traveler-${index}@example.com`,
            intent: "trip_budget",
          }),
        })
      );

      expect(response.status).toBe(200);
    }

    const limitedResponse = await POST(
      new Request("https://travelbudget.ai/api/lead-capture", {
        method: "POST",
        headers: {
          "x-forwarded-for": "203.0.113.10",
        },
        body: JSON.stringify({
          email: "traveler-limited@example.com",
          intent: "trip_budget",
        }),
      })
    );
    const body = (await limitedResponse.json()) as { ok: boolean; error: string };

    expect(limitedResponse.status).toBe(429);
    expect(limitedResponse.headers.get("Retry-After")).toBeTruthy();
    expect(body).toEqual({
      ok: false,
      error: "Too many email requests. Try again later.",
    });
  });
});
