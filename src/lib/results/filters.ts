import type { DestinationRecommendation, SupportedCurrency, TravelStyle } from "@/lib/budget/recommend-destinations";
import { normalizeOriginCode } from "@/lib/data/destinations";

export type ResultsSort = "relevance" | "price-asc" | "price-desc" | "score";

export type ResultsCategory =
  | "all"
  | "beach"
  | "city"
  | "nature"
  | "culture"
  | "adventure"
  | "food"
  | "family"
  | "backpacker";

export type ResultsSearchParams = {
  budget?: string | string[];
  currency?: string | string[];
  origin?: string | string[];
  days?: string | string[];
  month?: string | string[];
  travelers?: string | string[];
  style?: string | string[];
  category?: string | string[];
  destination?: string | string[];
  sort?: string | string[];
};

export type ParsedSearchParams = {
  budget: number;
  currency: SupportedCurrency;
  origin: string;
  days: number;
  month: string;
  travelers: number;
  style: TravelStyle;
  category: ResultsCategory;
  destination: string;
  sort: ResultsSort;
};

export const defaultSearchParams: ParsedSearchParams = {
  budget: 2500,
  currency: "CAD",
  origin: "YUL",
  days: 10,
  month: "october",
  travelers: 1,
  style: "balanced",
  category: "all",
  destination: "",
  sort: "relevance",
};

const currencyOptions = ["CAD", "USD", "EUR"] as const;

const styleAliases: Record<string, TravelStyle> = {
  budget: "budget",
  balanced: "balanced",
  midrange: "balanced",
  "mid-range": "balanced",
  comfort: "comfort",
  luxury: "comfort",
};

const categoryAliases: Record<string, ResultsCategory> = {
  all: "all",
  beach: "beach",
  coast: "beach",
  city: "city",
  cities: "city",
  nature: "nature",
  culture: "culture",
  adventure: "adventure",
  food: "food",
  family: "family",
  backpacker: "backpacker",
  backpacking: "backpacker",
};

const categoryStyleMatches: Record<Exclude<ResultsCategory, "all">, string[]> = {
  beach: ["beach", "coast", "relaxed"],
  city: ["city", "cities"],
  nature: ["nature", "road trip"],
  culture: ["culture"],
  adventure: ["adventure", "backpacking", "road trip"],
  food: ["food"],
  family: ["relaxed", "beach", "culture", "nature"],
  backpacker: ["backpacking", "adventure", "food"],
};

export function parseSearchParams(searchParams: ResultsSearchParams): ParsedSearchParams {
  return {
    budget: parseNumber(readSearchParam(searchParams.budget), defaultSearchParams.budget),
    currency: parseCurrency(readSearchParam(searchParams.currency)),
    origin: parseOrigin(readSearchParam(searchParams.origin)),
    days: parseNumber(readSearchParam(searchParams.days), defaultSearchParams.days),
    month: readSearchParam(searchParams.month)?.trim() || defaultSearchParams.month,
    travelers: parseNumber(readSearchParam(searchParams.travelers), defaultSearchParams.travelers),
    style: parseTravelStyle(readSearchParam(searchParams.style)),
    category: parseCategory(readSearchParam(searchParams.category)),
    destination: parseDestinationQuery(readSearchParam(searchParams.destination)),
    sort: parseSort(readSearchParam(searchParams.sort)),
  };
}

export function filterAndSortRecommendations(
  recommendations: DestinationRecommendation[],
  params: ParsedSearchParams
): DestinationRecommendation[] {
  return recommendations
    .filter((recommendation) => isRelevantBudgetFit(recommendation, params.budget))
    .filter((recommendation) => matchesCategory(recommendation, params.category))
    .filter((recommendation) => matchesDestinationQuery(recommendation, params.destination))
    .sort((a, b) => compareRecommendations(a, b, params.sort));
}

export function createResultsHref(params: ParsedSearchParams, overrides: Partial<ParsedSearchParams> = {}) {
  const nextParams = { ...params, ...overrides };
  const query = new URLSearchParams();

  query.set("budget", String(nextParams.budget));
  query.set("currency", nextParams.currency);
  query.set("origin", nextParams.origin);
  query.set("days", String(nextParams.days));
  query.set("month", nextParams.month);
  query.set("travelers", String(nextParams.travelers));
  query.set("style", nextParams.style);

  if (nextParams.category !== "all") {
    query.set("category", nextParams.category);
  }

  if (nextParams.destination) {
    query.set("destination", nextParams.destination);
  }

  if (nextParams.sort !== "relevance") {
    query.set("sort", nextParams.sort);
  }

  return `/results?${query.toString()}`;
}

function readSearchParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function parseNumber(value: string | undefined, fallback: number): number {
  if (!value) {
    return fallback;
  }

  const parsedValue = Number(value.replace(/,/g, ""));
  return Number.isFinite(parsedValue) && parsedValue > 0 ? Math.round(parsedValue) : fallback;
}

function parseCurrency(value: string | undefined): SupportedCurrency {
  const normalizedValue = value?.trim().toUpperCase();
  return currencyOptions.some((currency) => currency === normalizedValue)
    ? (normalizedValue as SupportedCurrency)
    : defaultSearchParams.currency;
}

function parseOrigin(value: string | undefined) {
  return normalizeOriginCode(value?.trim().replace(/\s+/g, " ").slice(0, 80) || defaultSearchParams.origin);
}

function parseTravelStyle(value: string | undefined): TravelStyle {
  const normalizedValue = value?.trim().toLowerCase();
  return normalizedValue ? styleAliases[normalizedValue] ?? defaultSearchParams.style : defaultSearchParams.style;
}

function parseCategory(value: string | undefined): ResultsCategory {
  const normalizedValue = value?.trim().toLowerCase();
  return normalizedValue ? categoryAliases[normalizedValue] ?? defaultSearchParams.category : defaultSearchParams.category;
}

function parseDestinationQuery(value: string | undefined) {
  return value?.trim().replace(/\s+/g, " ").slice(0, 80) ?? "";
}

function parseSort(value: string | undefined): ResultsSort {
  const normalizedValue = value?.trim().toLowerCase();

  if (normalizedValue === "price-asc" || normalizedValue === "price-desc" || normalizedValue === "score") {
    return normalizedValue;
  }

  return "relevance";
}

function isRelevantBudgetFit(recommendation: DestinationRecommendation, budget: number) {
  return recommendation.estimatedTotal <= budget * 1.1;
}

function matchesCategory(recommendation: DestinationRecommendation, category: ResultsCategory) {
  if (category === "all") {
    return true;
  }

  const matches = categoryStyleMatches[category];
  const destinationStyles = recommendation.destination.travelStyles.map((style) => style.toLowerCase());

  return destinationStyles.some((style) => matches.includes(style));
}

function matchesDestinationQuery(recommendation: DestinationRecommendation, destinationQuery: string) {
  if (!destinationQuery) {
    return true;
  }

  const query = destinationQuery.toLowerCase();
  const destination = recommendation.destination;

  return [
    destination.name,
    destination.countryCode,
    destination.weather,
    destination.shortDescription,
    ...destination.travelStyles,
  ].some((value) => value.toLowerCase().includes(query));
}

function compareRecommendations(a: DestinationRecommendation, b: DestinationRecommendation, sort: ResultsSort) {
  if (sort === "price-asc") {
    return a.estimatedTotal - b.estimatedTotal || b.matchScore - a.matchScore;
  }

  if (sort === "price-desc") {
    return b.estimatedTotal - a.estimatedTotal || b.matchScore - a.matchScore;
  }

  if (sort === "score") {
    return b.matchScore - a.matchScore || a.estimatedTotal - b.estimatedTotal;
  }

  return b.matchScore - a.matchScore || a.estimatedTotal - b.estimatedTotal;
}
