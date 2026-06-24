import { describe, expect, it } from "vitest";

import { destinations } from "@/lib/data/destinations";
import { recommendDestinations, type RecommendDestinationsInput } from "@/lib/budget/recommend-destinations";

const baseInput: RecommendDestinationsInput = {
  destinations,
  budget: 2500,
  currency: "CAD",
  origin: "YUL",
  days: 10,
  month: "october",
  travelers: 1,
  style: "balanced",
};

describe("recommendDestinations", () => {
  it("marks low-budget trips as over budget when no destination realistically fits", () => {
    const results = recommendDestinations({
      ...baseInput,
      budget: 300,
      days: 10,
      style: "budget",
    });

    expect(results).not.toHaveLength(0);
    expect(results.every((result) => result.budgetFitStatus === "over-budget")).toBe(true);
    expect(results[0].estimatedTotal).toBeGreaterThan(300);
  });

  it("finds best-fit options for a medium budget", () => {
    const results = recommendDestinations({
      ...baseInput,
      budget: 2200,
      style: "balanced",
    });

    expect(results.some((result) => result.budgetFitStatus === "best-fit")).toBe(true);
    expect(results[0].matchScore).toBeGreaterThanOrEqual(results[1].matchScore);
  });

  it("keeps premium long-haul destinations viable with a high budget", () => {
    const results = recommendDestinations({
      ...baseInput,
      budget: 11000,
      days: 12,
      style: "comfort",
    });
    const australia = results.find((result) => result.destination.slug === "australia");

    expect(australia).toBeDefined();
    expect(australia?.budgetFitStatus).not.toBe("over-budget");
  });

  it("reduces the estimated total for a shorter duration", () => {
    const shortTrip = recommendDestinations({ ...baseInput, days: 4 });
    const standardTrip = recommendDestinations({ ...baseInput, days: 10 });
    const shortPortugal = shortTrip.find((result) => result.destination.slug === "portugal");
    const standardPortugal = standardTrip.find((result) => result.destination.slug === "portugal");

    expect(shortPortugal?.estimatedTotal).toBeLessThan(standardPortugal?.estimatedTotal ?? 0);
  });

  it("increases the estimated total for a longer duration", () => {
    const standardTrip = recommendDestinations({ ...baseInput, days: 10 });
    const longTrip = recommendDestinations({ ...baseInput, days: 21 });
    const standardPortugal = standardTrip.find((result) => result.destination.slug === "portugal");
    const longPortugal = longTrip.find((result) => result.destination.slug === "portugal");

    expect(longPortugal?.estimatedTotal).toBeGreaterThan(standardPortugal?.estimatedTotal ?? Number.POSITIVE_INFINITY);
  });

  it("uses the selected departure city flight baseline", () => {
    const fromMontreal = recommendDestinations({ ...baseInput, origin: "YUL" });
    const fromVancouver = recommendDestinations({ ...baseInput, origin: "YVR" });
    const portugalFromMontreal = fromMontreal.find((result) => result.destination.slug === "portugal");
    const portugalFromVancouver = fromVancouver.find((result) => result.destination.slug === "portugal");

    expect(portugalFromMontreal?.costBreakdown.flights).toBe(730);
    expect(portugalFromVancouver?.costBreakdown.flights).toBe(980);
    expect(portugalFromVancouver?.estimatedTotal).toBeGreaterThan(portugalFromMontreal?.estimatedTotal ?? 0);
  });

  it("rewards supported travel-style constraints in the score", () => {
    const budgetResults = recommendDestinations({
      ...baseInput,
      budget: 2400,
      style: "budget",
      month: "march",
    });
    const vietnam = budgetResults.find((result) => result.destination.slug === "vietnam");

    expect(vietnam?.reasons.join(" ")).toContain("budget style");
    expect(vietnam?.matchScore).toBeGreaterThan(0);
  });

  it("returns no recommendations when no destination data is provided", () => {
    expect(recommendDestinations({ ...baseInput, destinations: [] })).toEqual([]);
  });
});
