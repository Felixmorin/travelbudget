import { beforeEach, describe, expect, it, vi } from "vitest";

import { POST, resetTripBudgetLeadRouteState } from "@/app/api/leads/trip-budget/route";
import { clearAnalyticsEvents } from "@/lib/analytics/server-events";
import { clearStoredTripBudgetLeads, listStoredTripBudgetLeads } from "@/lib/leads/trip-budget-leads";
import { resetRequestGuardState } from "@/lib/security/request-guards";

describe("trip budget lead route", () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
    delete process.env.SUPABASE_URL;
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;
    delete process.env.SUPABASE_ANON_KEY;
    delete process.env.RESEND_API_KEY;
    delete process.env.EMAIL_FROM_ADDRESS;
    delete process.env.TRIP_BUDGET_EMAIL_DELIVERY_MODE;
    clearStoredTripBudgetLeads();
    clearAnalyticsEvents();
    resetRequestGuardState();
    resetTripBudgetLeadRouteState();
  });

  it("saves a valid trip budget request and sends with Resend", async () => {
    vi.stubEnv("RESEND_API_KEY", "resend_test_key");
    vi.stubEnv("EMAIL_FROM_ADDRESS", "GoByBudget <budget@gobybudget.com>");
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(Response.json({ id: "email_123" }))
    );

    const response = await POST(createRequest());

    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({ ok: true, emailStatus: "sent" });
    expect(listStoredTripBudgetLeads()).toMatchObject([
      {
        email: "traveler@example.com",
        budgetEmailConsent: true,
        marketingConsent: false,
        emailStatus: "sent",
        emailProviderId: "email_123",
        lead: {
          estimatedTotal: 2100,
          destinations: [{ title: "Lisbon, Portugal" }],
        },
      },
    ]);
  });

  it("rejects invalid email payloads", async () => {
    const response = await POST(createRequest({ email: "not-an-email" }));

    expect(response.status).toBe(400);
    expect(listStoredTripBudgetLeads()).toEqual([]);
  });

  it("requires budget email consent and keeps marketing optional", async () => {
    const rejected = await POST(createRequest({ budgetEmailConsent: false }));

    expect(rejected.status).toBe(400);

    const accepted = await POST(
      createRequest({
        email: "optional-marketing@example.com",
        marketingConsent: false,
      })
    );

    expect(accepted.status).toBe(200);
    expect(listStoredTripBudgetLeads().at(0)?.marketingConsent).toBe(false);
  });

  it("can explicitly skip email delivery for smoke tests", async () => {
    vi.stubEnv("TRIP_BUDGET_EMAIL_DELIVERY_MODE", "skip");
    const fetch = vi.fn();
    vi.stubGlobal("fetch", fetch);

    const response = await POST(createRequest());

    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({ ok: true, emailStatus: "skipped" });
    expect(fetch).not.toHaveBeenCalled();
    expect(listStoredTripBudgetLeads()).toMatchObject([
      {
        email: "traveler@example.com",
        emailStatus: "skipped",
      },
    ]);
  });

  it("deduplicates repeated identical submissions", async () => {
    const first = await POST(createRequest());
    const second = await POST(createRequest());

    expect(first.status).toBe(200);
    expect(second.status).toBe(200);
    expect(await second.json()).toMatchObject({ duplicate: true });
    expect(listStoredTripBudgetLeads()).toHaveLength(1);
  });

  it("returns a generic failure when Supabase insert fails", async () => {
    vi.stubEnv("SUPABASE_URL", "https://example.supabase.co");
    vi.stubEnv("SUPABASE_SERVICE_ROLE_KEY", "service-role-key");
    vi.stubEnv("RESEND_API_KEY", "resend_test_key");
    vi.stubEnv("EMAIL_FROM_ADDRESS", "GoByBudget <budget@gobybudget.com>");
    vi.stubGlobal(
      "fetch",
      vi.fn(async (url: string | URL | Request) => {
        const href = typeof url === "string" ? url : url instanceof URL ? url.href : url.url;
        if (href.includes("api.resend.com")) {
          return Response.json({ id: "email_123" });
        }

        return Response.json({ error: "denied" }, { status: 500 });
      })
    );

    const response = await POST(createRequest());

    expect(response.status).toBe(400);
    expect(await response.json()).toMatchObject({ ok: false, error: "Unable to send trip budget." });
  });

  it("keeps the lead and reports failure when Resend fails", async () => {
    vi.stubEnv("RESEND_API_KEY", "resend_test_key");
    vi.stubEnv("EMAIL_FROM_ADDRESS", "GoByBudget <budget@gobybudget.com>");
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(Response.json({ error: "bad" }, { status: 500 })));

    const response = await POST(createRequest());

    expect(response.status).toBe(502);
    expect(await response.json()).toMatchObject({ ok: false, emailStatus: "failed" });
    expect(listStoredTripBudgetLeads()).toMatchObject([
      {
        email: "traveler@example.com",
        emailStatus: "failed",
      },
    ]);
  });
});

function createRequest(overrides: Record<string, unknown> = {}) {
  const body = {
    email: "Traveler@Example.com",
    budgetEmailConsent: true,
    marketingConsent: false,
    consentTimestamp: new Date().toISOString(),
    submittedAt: Date.now() - 2000,
    website: "",
    lead: {
      origin: "Montreal (YUL)",
      destination: "Lisbon, Portugal",
      budgetAmount: 2500,
      budgetCurrency: "CAD",
      tripDurationDays: 10,
      travelStyle: "Balanced",
      travelerCount: 1,
      estimatedTotal: 2100,
      flightEstimate: 780,
      hotelEstimate: 820,
      foodEstimate: 260,
      transportEstimate: 90,
      activitiesEstimate: 100,
      bufferEstimate: 50,
      sourcePage: "/results",
      destinations: [
        {
          slug: "portugal",
          title: "Lisbon, Portugal",
          country: "Portugal",
          estimatedTotal: 2100,
          flightEstimate: 780,
          hotelEstimate: 820,
          foodEstimate: 260,
          transportEstimate: 90,
          activitiesEstimate: 100,
          bufferEstimate: 50,
        },
      ],
      budgetRange: "2500_3999",
    },
    ...overrides,
  };

  return new Request("https://gobybudget.com/api/leads/trip-budget", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-forwarded-for": "203.0.113.40",
    },
    body: JSON.stringify(body),
  });
}
