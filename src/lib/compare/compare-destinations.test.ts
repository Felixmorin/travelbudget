import { describe, expect, it } from "vitest";

import { calculateTripCost } from "@/lib/compare/calculate-trip-cost";
import {
  calculateLessPercent,
  calculateMorePercent,
  compareDestinations,
  createLengthComparisons,
} from "@/lib/compare/compare-destinations";
import { parseCompareParams } from "@/lib/compare/url-params";
import type { CompareParams } from "@/lib/compare/types";
import { getUnifiedDestination, unifiedDestinations } from "@/lib/data/unified-destinations";

const paris = getRequiredDestination("paris");
const lisbon = getRequiredDestination("lisbon");
const params: CompareParams = {
  destinationA: "paris",
  destinationB: "lisbon",
  origin: "montreal",
  days: 10,
  travelers: 1,
  month: "september",
  style: "mid-range",
  currency: "CAD",
};

describe("trip comparison calculations", () => {
  it("calculates total cost for one traveler", () => {
    const result = calculateTripCost(paris, params);
    const expected =
      result.breakdown.flights! +
      result.breakdown.accommodation +
      result.breakdown.food +
      result.breakdown.localTransportation +
      result.breakdown.activities +
      result.breakdown.extras;

    expect(result.total).toBe(expected);
    expect(result.costPerTraveler).toBe(expected);
  });

  it("calculates total cost for two travelers", () => {
    const oneTraveler = calculateTripCost(paris, params);
    const twoTravelers = calculateTripCost(paris, { ...params, travelers: 2 });

    expect(twoTravelers.total).toBe((oneTraveler.total ?? 0) * 2);
  });

  it("uses the same calculation for 3, 7, 10 and 14 days", () => {
    const rows = createLengthComparisons({ destinationA: paris, destinationB: lisbon, params });

    expect(rows.map((row) => row.days)).toEqual([3, 7, 10, 14]);
    expect(rows.every((row) => row.comparison?.destinationA.total)).toBe(true);
  });

  it("counts flights once per traveler, not once per day", () => {
    const threeDays = calculateTripCost(paris, { ...params, days: 3 });
    const tenDays = calculateTripCost(paris, { ...params, days: 10 });

    expect(threeDays.breakdown.flights).toBe(tenDays.breakdown.flights);
  });

  it("multiplies daily categories by trip length", () => {
    const threeDays = calculateTripCost(lisbon, { ...params, days: 3 });
    const sixDays = calculateTripCost(lisbon, { ...params, days: 6 });

    expect(sixDays.breakdown.food).toBe(threeDays.breakdown.food * 2);
    expect(sixDays.breakdown.accommodation).toBe(threeDays.breakdown.accommodation * 2);
  });

  it("converts display currency through the selected currency parameter", async () => {
    const { convertFromCad } = await import("@/lib/compare/currency");

    expect(convertFromCad(100, "CAD")).toBe(100);
    expect(convertFromCad(100, "USD")).toBe(73);
  });

  it("calculates savings between destinations", () => {
    const comparison = compareDestinations({ destinationA: paris, destinationB: lisbon, params });

    expect(comparison?.savings).toBeGreaterThan(0);
    expect(comparison?.cheaper).toBe("b");
  });

  it("uses different denominators for less-than and more-than percentages", () => {
    expect(calculateLessPercent(58, 100)).toBe(42);
    expect(calculateMorePercent(100, 58)).toBe(72);
  });

  it("handles equality between two destinations", () => {
    const comparison = compareDestinations({ destinationA: paris, destinationB: paris, params });

    expect(comparison?.cheaper).toBe("tie");
    expect(comparison?.savings).toBe(0);
    expect(comparison?.warnings).toContain("Choose two different destinations to compare trip costs.");
  });

  it("marks missing flight data as unavailable instead of zero", () => {
    const noFlight = {
      ...paris,
      originPricing: {
        ...paris.originPricing,
        YUL: {
          originCity: "Montreal",
          originCountry: "Canada",
          currency: "CAD" as const,
          flightEstimate: { low: 0, average: 0, high: 0 },
        },
      },
      flightCost: 0,
    };
    const result = calculateTripCost(noFlight, params);

    expect(result.flightUnavailable).toBe(true);
    expect(result.breakdown.flights).toBeNull();
    expect(result.total).toBeNull();
  });

  it("handles invalid URL parameters with defaults", () => {
    const parsed = parseCompareParams(
      new URLSearchParams("a=unknown&b=lisbon&days=-20&travelers=abc&style=invalid&currency=zzz"),
      new Set(unifiedDestinations.map((destination) => destination.slug))
    );

    expect(parsed.destinationA).toBe("paris");
    expect(parsed.destinationB).toBe("lisbon");
    expect(parsed.days).toBe(1);
    expect(parsed.travelers).toBe(1);
    expect(parsed.style).toBe("mid-range");
    expect(parsed.currency).toBe("CAD");
  });

  it("uses the destination query parameter as destination A", () => {
    const parsed = parseCompareParams(
      new URLSearchParams("a=mexico-city"),
      new Set(unifiedDestinations.map((destination) => destination.slug))
    );

    expect(parsed.destinationA).toBe("mexico-city");
    expect(parsed.destinationB).not.toBe("mexico-city");
  });

  it("calculates Budget Fit", () => {
    const comparison = compareDestinations({
      destinationA: paris,
      destinationB: lisbon,
      params: { ...params, budget: 10000 },
    });

    expect(comparison?.budgetFitA?.status).toBe("Excellent fit");
    expect(comparison?.budgetFitA?.remaining).toBeGreaterThan(0);
  });

  it("identifies the main cost difference factor", () => {
    const comparison = compareDestinations({ destinationA: paris, destinationB: lisbon, params });

    expect(comparison?.biggestFactor?.label).toBeTruthy();
    expect(comparison?.biggestFactor?.difference).not.toBe(0);
  });
});

function getRequiredDestination(slug: string) {
  const destination = getUnifiedDestination(slug);

  if (!destination) {
    throw new Error(`Missing test destination ${slug}`);
  }

  return destination;
}
