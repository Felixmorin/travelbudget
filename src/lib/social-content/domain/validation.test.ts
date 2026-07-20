import { describe, expect, it } from "vitest";

import { assertBudgetBreakdown, parseContentRequest } from "@/lib/social-content/domain/validation";

describe("social content validation", () => {
  it("parses a valid three destinations request", () => {
    expect(
      parseContentRequest({
        origin: "Montreal",
        budget: "1500",
        currency: "CAD",
        days: "7",
        language: "fr",
        template: "three_destinations",
      })
    ).toMatchObject({
      origin: "Montreal",
      budget: 1500,
      currency: "CAD",
      durationDays: 7,
      language: "fr",
      template: "three_destinations",
      dryRun: true,
    });
  });

  it("requires a destination for destination cost templates", () => {
    expect(() =>
      parseContentRequest({
        origin: "Montreal",
        budget: 1500,
        currency: "CAD",
        days: 7,
        language: "fr",
        template: "destination_cost",
      })
    ).toThrow("destination_cost requires a destination");
  });

  it("rejects inconsistent budget totals", () => {
    expect(() =>
      assertBudgetBreakdown({
        flights: 500,
        accommodation: 400,
        food: 200,
        localTransport: 100,
        activities: 100,
        miscellaneous: 50,
        total: 999,
        currency: "CAD",
        estimatedAt: "2026-06-24",
        dataSource: "gobybudget-estimate",
        sourceNotes: [],
      })
    ).toThrow("Budget subtotals do not match the total");
  });
});
