import { beforeEach, describe, expect, it } from "vitest";

import { POST } from "@/app/api/lead-capture/route";
import {
  clearStoredLeadCaptures,
  isValidEmail,
  listStoredLeadCaptures,
  normalizeLeadCapturePayload,
} from "@/lib/leads/lead-capture";

describe("lead capture validation", () => {
  beforeEach(() => {
    clearStoredLeadCaptures();
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
});

describe("lead capture API", () => {
  beforeEach(() => {
    clearStoredLeadCaptures();
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
});
