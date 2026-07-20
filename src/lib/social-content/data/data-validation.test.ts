import { describe, expect, it } from "vitest";

import { validateGoByBudgetEstimate } from "@/lib/social-content/data/data-validation";

const request = {
  origin: "Montreal",
  budget: 1500,
  currency: "CAD",
  durationDays: 7,
  travelers: 1,
  travelStyle: "balanced",
  language: "fr",
  platform: "instagram",
  template: "three_destinations",
  dryRun: true,
} as const;

describe("GoByBudget social data validation", () => {
  it("accepts a coherent current estimate", () => {
    expect(
      validateGoByBudgetEstimate({
        request,
        destinationSlug: "portugal",
        staleDataDays: 120,
        landingPagePath: "/destinations/portugal",
        breakdown: {
          flights: 700,
          accommodation: 420,
          food: 210,
          localTransport: 70,
          activities: 140,
          miscellaneous: 60,
          total: 1600,
          currency: "CAD",
          estimatedAt: new Date().toISOString(),
          dataSource: "gobybudget-estimate",
          sourceNotes: ["Planning estimate."],
        },
      }).ok
    ).toBe(true);
  });

  it("rejects missing flight data and stale estimates", () => {
    const result = validateGoByBudgetEstimate({
      request,
      destinationSlug: "portugal",
      staleDataDays: 30,
      landingPagePath: "/destinations/portugal",
      breakdown: {
        flights: 0,
        accommodation: 420,
        food: 210,
        localTransport: 70,
        activities: 140,
        miscellaneous: 60,
        total: 900,
        currency: "CAD",
        estimatedAt: "2020-01-01",
        dataSource: "gobybudget-estimate",
        sourceNotes: ["Planning estimate."],
      },
    });

    expect(result.ok).toBe(false);
    expect(result.errors.join(" ")).toContain("Flight estimate is unavailable");
    expect(result.errors.join(" ")).toContain("Estimate is too old");
  });
});
