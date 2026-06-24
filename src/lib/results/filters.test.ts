import { describe, expect, it } from "vitest";

import { recommendDestinations } from "@/lib/budget/recommend-destinations";
import { destinations } from "@/lib/data/destinations";
import {
  createResultsHref,
  defaultSearchParams,
  filterAndSortRecommendations,
  parseSearchParams,
  type ParsedSearchParams,
} from "@/lib/results/filters";

const baseParams: ParsedSearchParams = {
  ...defaultSearchParams,
  budget: 3000,
  origin: "YUL",
  days: 10,
  month: "october",
  travelers: 1,
  style: "balanced",
};

const recommendations = recommendDestinations({
  destinations,
  budget: baseParams.budget,
  currency: baseParams.currency,
  origin: baseParams.origin,
  days: baseParams.days,
  month: baseParams.month,
  travelers: baseParams.travelers,
  style: baseParams.style,
});

describe("parseSearchParams", () => {
  it("normalizes supported scalar values and aliases", () => {
    expect(
      parseSearchParams({
        budget: "2,750.4",
        currency: "usd",
        origin: " toronto ",
        days: "11.7",
        month: " September ",
        travelers: "2",
        style: "mid-range",
        category: "cities",
        destination: "  south   korea  ",
        sort: "price-desc",
      })
    ).toEqual({
      budget: 2750,
      currency: "USD",
      origin: "YYZ",
      days: 12,
      month: "September",
      travelers: 2,
      style: "balanced",
      category: "city",
      destination: "south korea",
      sort: "price-desc",
    });
  });

  it("uses the first array value and falls back for invalid inputs", () => {
    expect(
      parseSearchParams({
        budget: ["-1", "3000"],
        currency: ["aud"],
        origin: [""],
        days: ["0"],
        travelers: ["NaN"],
        style: ["unknown"],
        category: ["unknown"],
        sort: ["newest"],
      })
    ).toEqual(defaultSearchParams);
  });
});

describe("createResultsHref", () => {
  it("includes required query values and omits default optional filters", () => {
    expect(createResultsHref(defaultSearchParams)).toBe(
      "/results?budget=2500&currency=CAD&origin=YUL&days=10&month=october&travelers=1&style=balanced"
    );
  });

  it("applies overrides for category, destination, and sort", () => {
    expect(
      createResultsHref(baseParams, {
        category: "food",
        destination: "Mexico City",
        sort: "score",
      })
    ).toBe(
      "/results?budget=3000&currency=CAD&origin=YUL&days=10&month=october&travelers=1&style=balanced&category=food&destination=Mexico+City&sort=score"
    );
  });
});

describe("filterAndSortRecommendations", () => {
  it("filters by category using destination travel-style aliases", () => {
    const beachResults = filterAndSortRecommendations(recommendations, {
      ...baseParams,
      category: "beach",
    });
    const cityResults = filterAndSortRecommendations(recommendations, {
      ...baseParams,
      category: "city",
    });

    expect(beachResults).not.toHaveLength(0);
    expect(beachResults.every((result) => hasAnyTravelStyle(result.destination.travelStyles, ["beach", "coast", "relaxed"]))).toBe(true);
    expect(cityResults).not.toHaveLength(0);
    expect(cityResults.every((result) => hasAnyTravelStyle(result.destination.travelStyles, ["city", "cities"]))).toBe(true);
  });

  it("filters by destination query across destination fields", () => {
    const results = filterAndSortRecommendations(recommendations, {
      ...baseParams,
      destination: "coffee",
    });

    expect(results.map((result) => result.destination.slug)).toContain("colombia");
  });

  it("sorts by ascending and descending total price", () => {
    const ascending = filterAndSortRecommendations(recommendations, {
      ...baseParams,
      sort: "price-asc",
    });
    const descending = filterAndSortRecommendations(recommendations, {
      ...baseParams,
      sort: "price-desc",
    });

    expect(ascending[0].estimatedTotal).toBeLessThanOrEqual(ascending.at(-1)?.estimatedTotal ?? 0);
    expect(descending[0].estimatedTotal).toBeGreaterThanOrEqual(descending.at(-1)?.estimatedTotal ?? Number.POSITIVE_INFINITY);
  });

  it("sorts by score with total price as the tie-breaker", () => {
    const results = filterAndSortRecommendations(recommendations, {
      ...baseParams,
      sort: "score",
    });

    for (let index = 1; index < results.length; index += 1) {
      const previous = results[index - 1];
      const current = results[index];

      expect(previous.matchScore).toBeGreaterThanOrEqual(current.matchScore);

      if (previous.matchScore === current.matchScore) {
        expect(previous.estimatedTotal).toBeLessThanOrEqual(current.estimatedTotal);
      }
    }
  });
});

function hasAnyTravelStyle(styles: string[], expectedStyles: string[]) {
  const normalizedStyles = styles.map((style) => style.toLowerCase());

  return normalizedStyles.some((style) => expectedStyles.includes(style));
}
