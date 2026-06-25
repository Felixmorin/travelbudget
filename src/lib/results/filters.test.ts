import { describe, expect, it } from "vitest";

import { recommendDestinations, type DestinationRecommendation } from "@/lib/budget/recommend-destinations";
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

const fixtureRecommendations = [
  createRecommendationFixture({
    slug: "lisbon",
    name: "Lisbon",
    countryCode: "PT",
    weather: "Sunny shoulder season",
    shortDescription: "Coastal food city with trams",
    travelStyles: ["Coast", "Food", "Cities"],
    estimatedTotal: 2200,
    matchScore: 80,
  }),
  createRecommendationFixture({
    slug: "kyoto",
    name: "Kyoto",
    countryCode: "JP",
    weather: "Mild autumn",
    shortDescription: "Temples and culture",
    travelStyles: ["Culture", "Food"],
    estimatedTotal: 2750,
    matchScore: 85,
  }),
  createRecommendationFixture({
    slug: "banff",
    name: "Banff",
    countryCode: "CA",
    weather: "Mountain summer",
    shortDescription: "Lake hikes and road trip scenery",
    travelStyles: ["Nature", "Adventure", "Road Trip"],
    estimatedTotal: 3301,
    matchScore: 95,
  }),
  createRecommendationFixture({
    slug: "seoul",
    name: "Seoul",
    countryCode: "KR",
    weather: "Cool spring",
    shortDescription: "Transit-friendly city food trip",
    travelStyles: ["Cities", "Food"],
    estimatedTotal: 2750,
    matchScore: 85,
  }),
];

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
  it("keeps recommendations at or under 110% of budget and removes higher totals", () => {
    const results = filterAndSortRecommendations(fixtureRecommendations, {
      ...baseParams,
      budget: 3000,
    });

    expect(results.map((result) => result.destination.slug)).toEqual(["kyoto", "seoul", "lisbon"]);
    expect(results.every((result) => result.estimatedTotal <= 3300)).toBe(true);
  });

  it("combines budget fit, category, destination search, and score sorting", () => {
    const results = filterAndSortRecommendations(fixtureRecommendations, {
      ...baseParams,
      budget: 2500,
      category: "food",
      destination: "city",
      sort: "score",
    });

    expect(results.map((result) => result.destination.slug)).toEqual(["seoul", "lisbon"]);
  });

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

  it("uses score and estimated total tie-breakers for relevance sorting", () => {
    const results = filterAndSortRecommendations(fixtureRecommendations, {
      ...baseParams,
      budget: 3001,
      sort: "relevance",
    });

    expect(results.map((result) => result.destination.slug)).toEqual(["banff", "kyoto", "seoul", "lisbon"]);
  });
});

function hasAnyTravelStyle(styles: string[], expectedStyles: string[]) {
  const normalizedStyles = styles.map((style) => style.toLowerCase());

  return normalizedStyles.some((style) => expectedStyles.includes(style));
}

function createRecommendationFixture({
  slug,
  name,
  countryCode,
  weather,
  shortDescription,
  travelStyles,
  estimatedTotal,
  matchScore,
}: {
  slug: string;
  name: string;
  countryCode: string;
  weather: string;
  shortDescription: string;
  travelStyles: string[];
  estimatedTotal: number;
  matchScore: number;
}): DestinationRecommendation {
  return {
    destination: {
      slug,
      name,
      countryCode,
      weather,
      shortDescription,
      travelStyles,
    },
    estimatedTotal,
    budgetRemaining: 0,
    budgetFitStatus: "best-fit",
    matchScore,
    costBreakdown: {
      flights: 0,
      hotel: 0,
      food: 0,
      transport: 0,
      activities: 0,
      misc: 0,
    },
    reasons: [],
  } as unknown as DestinationRecommendation;
}
