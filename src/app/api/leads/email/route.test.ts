import { beforeEach, describe, expect, it, vi } from "vitest";

import { POST } from "@/app/api/leads/email/route";
import { clearStoredEmailLeads, listStoredEmailLeads } from "@/lib/leads/email-leads";
import { resetRequestGuardState } from "@/lib/security/request-guards";

describe("email lead route", () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
    delete process.env.SUPABASE_URL;
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;
    delete process.env.SUPABASE_ANON_KEY;
    clearStoredEmailLeads();
    resetRequestGuardState();
  });

  it("persists a valid lead in development storage", async () => {
    const response = await POST(
      new Request("https://gobybudget.com/api/leads/email", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-forwarded-for": "203.0.113.20",
        },
        body: JSON.stringify({
          email: "Traveler@Example.com",
          page: "/travel-extras",
          label: "Save this trip budget request",
          budget: 2685,
          currency: "CAD",
        }),
      })
    );

    expect(response.status).toBe(200);
    expect(listStoredEmailLeads()).toMatchObject([
      {
        email: "traveler@example.com",
        page: "/travel-extras",
        budget: 2685,
        currency: "CAD",
      },
    ]);
  });

  it("rejects invalid email payloads", async () => {
    const response = await POST(
      new Request("https://gobybudget.com/api/leads/email", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-forwarded-for": "203.0.113.21",
        },
        body: JSON.stringify({
          email: "not-an-email",
        }),
      })
    );

    expect(response.status).toBe(400);
    expect(listStoredEmailLeads()).toEqual([]);
  });
});
