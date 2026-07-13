import type { DestinationRecommendation, SupportedCurrency, TravelStyle } from "@/lib/budget/recommend-destinations";
import { normalizeOriginCode } from "@/lib/data/destinations";

export type ResultsSort = "relevance" | "price-asc" | "price-desc" | "score";
export type ResultsContinent = "all" | "europe" | "north-america" | "central-america" | "south-america" | "asia" | "africa" | "oceania";
export type ResultsClimate = "all" | "warm" | "mild" | "tropical" | "cool";
export type ResultsFlightTime = "all" | "short" | "medium" | "long";
export type ResultsVisaFriendly = "all" | "yes";

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
  from?: string | string[];
  days?: string | string[];
  month?: string | string[];
  travelers?: string | string[];
  style?: string | string[];
  category?: string | string[];
  continent?: string | string[];
  climate?: string | string[];
  destination?: string | string[];
  flightTime?: string | string[];
  sort?: string | string[];
  visaFriendly?: string | string[];
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
  continent: ResultsContinent;
  climate: ResultsClimate;
  destination: string;
  flightTime: ResultsFlightTime;
  sort: ResultsSort;
  visaFriendly: ResultsVisaFriendly;
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
  continent: "all",
  climate: "all",
  destination: "",
  flightTime: "all",
  sort: "relevance",
  visaFriendly: "all",
};

const currencyOptions = ["CAD", "USD", "EUR", "GBP"] as const;

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

const continentAliases: Record<string, ResultsContinent> = {
  all: "all",
  europe: "europe",
  "north-america": "north-america",
  northamerica: "north-america",
  "central-america": "central-america",
  centralamerica: "central-america",
  "south-america": "south-america",
  southamerica: "south-america",
  asia: "asia",
  africa: "africa",
  oceania: "oceania",
};

const climateAliases: Record<string, ResultsClimate> = {
  all: "all",
  warm: "warm",
  sun: "warm",
  sunny: "warm",
  mild: "mild",
  shoulder: "mild",
  tropical: "tropical",
  cool: "cool",
  cold: "cool",
};

const flightTimeAliases: Record<string, ResultsFlightTime> = {
  all: "all",
  short: "short",
  medium: "medium",
  long: "long",
};

const visaFriendlyAliases: Record<string, ResultsVisaFriendly> = {
  all: "all",
  yes: "yes",
  true: "yes",
  "visa-friendly": "yes",
};

const continentByCountryCode: Record<string, Exclude<ResultsContinent, "all">> = {
  AT: "europe",
  BE: "europe",
  CH: "europe",
  CZ: "europe",
  DE: "europe",
  DK: "europe",
  ES: "europe",
  FR: "europe",
  GB: "europe",
  GR: "europe",
  HR: "europe",
  IE: "europe",
  IT: "europe",
  NL: "europe",
  NO: "europe",
  PT: "europe",
  SE: "europe",
  TR: "europe",
  CA: "north-america",
  MX: "north-america",
  US: "north-america",
  GT: "central-america",
  CO: "south-america",
  PE: "south-america",
  AR: "south-america",
  BR: "south-america",
  JP: "asia",
  KH: "asia",
  KR: "asia",
  ID: "asia",
  MY: "asia",
  PH: "asia",
  TH: "asia",
  VN: "asia",
  MA: "africa",
  ZA: "africa",
  AU: "oceania",
  NZ: "oceania",
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
    origin: parseOrigin(readSearchParam(searchParams.origin) ?? readSearchParam(searchParams.from)),
    days: parseNumber(readSearchParam(searchParams.days), defaultSearchParams.days),
    month: readSearchParam(searchParams.month)?.trim() || defaultSearchParams.month,
    travelers: parseNumber(readSearchParam(searchParams.travelers), defaultSearchParams.travelers),
    style: parseTravelStyle(readSearchParam(searchParams.style)),
    category: parseCategory(readSearchParam(searchParams.category)),
    continent: parseContinent(readSearchParam(searchParams.continent)),
    climate: parseClimate(readSearchParam(searchParams.climate)),
    destination: parseDestinationQuery(readSearchParam(searchParams.destination)),
    flightTime: parseFlightTime(readSearchParam(searchParams.flightTime)),
    sort: parseSort(readSearchParam(searchParams.sort)),
    visaFriendly: parseVisaFriendly(readSearchParam(searchParams.visaFriendly)),
  };
}

export function filterAndSortRecommendations(
  recommendations: DestinationRecommendation[],
  params: ParsedSearchParams
): DestinationRecommendation[] {
  return recommendations
    .filter((recommendation) => isRelevantBudgetFit(recommendation, params.budget))
    .filter((recommendation) => matchesCategory(recommendation, params.category))
    .filter((recommendation) => matchesContinent(recommendation, params.continent))
    .filter((recommendation) => matchesClimate(recommendation, params.climate))
    .filter((recommendation) => matchesFlightTime(recommendation, params.flightTime))
    .filter((recommendation) => matchesSeason(recommendation, params.month))
    .filter((recommendation) => matchesVisaFriendly(recommendation, params.visaFriendly))
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

  if (nextParams.continent !== "all") {
    query.set("continent", nextParams.continent);
  }

  if (nextParams.climate !== "all") {
    query.set("climate", nextParams.climate);
  }

  if (nextParams.destination) {
    query.set("destination", nextParams.destination);
  }

  if (nextParams.flightTime !== "all") {
    query.set("flightTime", nextParams.flightTime);
  }

  if (nextParams.sort !== "relevance") {
    query.set("sort", nextParams.sort);
  }

  if (nextParams.visaFriendly !== "all") {
    query.set("visaFriendly", nextParams.visaFriendly);
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

function parseContinent(value: string | undefined): ResultsContinent {
  const normalizedValue = value?.trim().toLowerCase();
  return normalizedValue ? continentAliases[normalizedValue] ?? defaultSearchParams.continent : defaultSearchParams.continent;
}

function parseClimate(value: string | undefined): ResultsClimate {
  const normalizedValue = value?.trim().toLowerCase();
  return normalizedValue ? climateAliases[normalizedValue] ?? defaultSearchParams.climate : defaultSearchParams.climate;
}

function parseFlightTime(value: string | undefined): ResultsFlightTime {
  const normalizedValue = value?.trim().toLowerCase();
  return normalizedValue ? flightTimeAliases[normalizedValue] ?? defaultSearchParams.flightTime : defaultSearchParams.flightTime;
}

function parseVisaFriendly(value: string | undefined): ResultsVisaFriendly {
  const normalizedValue = value?.trim().toLowerCase();
  return normalizedValue ? visaFriendlyAliases[normalizedValue] ?? defaultSearchParams.visaFriendly : defaultSearchParams.visaFriendly;
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

function matchesContinent(recommendation: DestinationRecommendation, continent: ResultsContinent) {
  return continent === "all" || getDestinationContinent(recommendation.destination.countryCode) === continent;
}

function matchesClimate(recommendation: DestinationRecommendation, climate: ResultsClimate) {
  if (climate === "all") {
    return true;
  }

  return getClimateCategory(recommendation.destination.weather) === climate;
}

function matchesFlightTime(recommendation: DestinationRecommendation, flightTime: ResultsFlightTime) {
  if (flightTime === "all") {
    return true;
  }

  const hours = getEstimatedFlightHours(recommendation.destination.slug);

  if (flightTime === "short") {
    return hours <= 6;
  }

  if (flightTime === "medium") {
    return hours > 6 && hours <= 10;
  }

  return hours > 10;
}

function matchesSeason(recommendation: DestinationRecommendation, month: string) {
  const normalizedMonth = month.trim().toLowerCase();

  if (!normalizedMonth || normalizedMonth === defaultSearchParams.month) {
    return true;
  }

  return recommendation.destination.bestMonths.some((bestMonth) => bestMonth.toLowerCase() === normalizedMonth);
}

function matchesVisaFriendly(recommendation: DestinationRecommendation, visaFriendly: ResultsVisaFriendly) {
  if (visaFriendly === "all") {
    return true;
  }

  return recommendation.destination.countryCode !== "CN" && recommendation.destination.countryCode !== "RU";
}

function matchesDestinationQuery(recommendation: DestinationRecommendation, destinationQuery: string) {
  if (!destinationQuery) {
    return true;
  }

  const query = destinationQuery.toLowerCase();
  const destination = recommendation.destination;

  return [
    destination.name,
    destination.cityName ?? "",
    destination.countryName ?? "",
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

export function getDestinationContinent(countryCode: string): ResultsContinent {
  return continentByCountryCode[countryCode.toUpperCase()] ?? "all";
}

export function getClimateCategory(weather: string): ResultsClimate {
  const normalizedWeather = weather.toLowerCase();

  if (normalizedWeather.includes("tropical")) {
    return "tropical";
  }

  if (normalizedWeather.includes("warm") || normalizedWeather.includes("sunny") || normalizedWeather.includes("dry")) {
    return "warm";
  }

  if (normalizedWeather.includes("cool") || normalizedWeather.includes("crisp") || normalizedWeather.includes("alpine")) {
    return "cool";
  }

  return "mild";
}

export function getEstimatedFlightHours(destinationSlug: string) {
  const longHaul = new Set(["japan", "thailand", "vietnam", "indonesia", "malaysia", "philippines", "cambodia", "australia", "new-zealand"]);
  const mediumHaul = new Set([
    "portugal",
    "france",
    "italy",
    "spain",
    "greece",
    "ireland",
    "netherlands",
    "croatia",
    "morocco",
    "turkey",
    "peru",
    "colombia",
  ]);

  if (longHaul.has(destinationSlug)) {
    return 14;
  }

  if (mediumHaul.has(destinationSlug)) {
    return 8;
  }

  return 5;
}
