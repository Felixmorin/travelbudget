import {
  compareMonthOptions,
  compareStyleOptions,
  supportedCurrencies,
  type CompareMonth,
  type CompareParams,
  type CompareTravelStyle,
  type SupportedCurrency,
} from "@/lib/compare/types";

export const defaultCompareParams: CompareParams = {
  destinationA: "paris",
  destinationB: "lisbon",
  origin: "montreal",
  days: 10,
  travelers: 1,
  month: "september",
  style: "mid-range",
  currency: "CAD",
};

const originAliases: Record<string, string> = {
  yul: "montreal",
  montreal: "montreal",
  "montréal": "montreal",
  yyz: "toronto",
  toronto: "toronto",
  yvr: "vancouver",
  vancouver: "vancouver",
  yqb: "quebec",
  quebec: "quebec",
  "quebec-city": "quebec",
  yow: "ottawa",
  ottawa: "ottawa",
  yyc: "calgary",
  calgary: "calgary",
  nyc: "new-york",
  "new-york": "new-york",
  bos: "boston",
  boston: "boston",
  chi: "chicago",
  chicago: "chicago",
};

export const originOptions = [
  { value: "montreal", label: "Montreal", code: "YUL" },
  { value: "toronto", label: "Toronto", code: "YYZ" },
  { value: "vancouver", label: "Vancouver", code: "YVR" },
  { value: "quebec", label: "Quebec City", code: "YQB" },
  { value: "ottawa", label: "Ottawa", code: "YOW" },
  { value: "calgary", label: "Calgary", code: "YYC" },
  { value: "new-york", label: "New York", code: "NYC" },
  { value: "boston", label: "Boston", code: "BOS" },
  { value: "chicago", label: "Chicago", code: "CHI" },
] as const;

export function parseCompareParams(searchParams: URLSearchParams, validSlugs: Set<string>): CompareParams {
  const legacyDestinations = searchParams.getAll("destination");
  const destinationA = normalizeSlug(searchParams.get("a") ?? legacyDestinations[0] ?? null, validSlugs, defaultCompareParams.destinationA);
  const destinationB = normalizeSlug(searchParams.get("b") ?? legacyDestinations[1] ?? null, validSlugs, defaultCompareParams.destinationB);

  return {
    destinationA,
    destinationB: destinationA === destinationB ? defaultCompareParams.destinationB : destinationB,
    origin: normalizeOrigin(searchParams.get("from")),
    days: normalizeInteger(searchParams.get("days"), defaultCompareParams.days, 1, 60),
    travelers: normalizeInteger(searchParams.get("travelers"), defaultCompareParams.travelers, 1, 12),
    month: normalizeMonth(searchParams.get("month")),
    style: normalizeStyle(searchParams.get("style")),
    currency: normalizeCurrency(searchParams.get("currency")),
    budget: normalizeOptionalBudget(searchParams.get("budget")),
  };
}

export function serializeCompareParams(params: CompareParams) {
  const searchParams = new URLSearchParams();

  searchParams.set("from", params.origin);
  searchParams.set("a", params.destinationA);
  searchParams.set("b", params.destinationB);
  searchParams.set("days", String(params.days));
  searchParams.set("travelers", String(params.travelers));
  searchParams.set("style", params.style);
  searchParams.set("month", params.month);
  searchParams.set("currency", params.currency);

  if (params.budget && params.budget > 0) {
    searchParams.set("budget", String(params.budget));
  }

  return `/compare?${searchParams.toString()}`;
}

export function getOriginCode(origin: string) {
  return originOptions.find((option) => option.value === normalizeOrigin(origin))?.code ?? "YUL";
}

function normalizeSlug(value: string | null, validSlugs: Set<string>, fallback: string) {
  const normalized = value?.trim().toLowerCase();
  return normalized && validSlugs.has(normalized) ? normalized : fallback;
}

function normalizeOrigin(value: string | null) {
  const normalized = value?.trim().toLowerCase() ?? "";
  return originAliases[normalized] ?? defaultCompareParams.origin;
}

function normalizeInteger(value: string | null, fallback: number, min: number, max: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.min(max, Math.max(min, Math.round(parsed))) : fallback;
}

function normalizeMonth(value: string | null): CompareMonth {
  return compareMonthOptions.includes(value as CompareMonth) ? (value as CompareMonth) : defaultCompareParams.month;
}

function normalizeStyle(value: string | null): CompareTravelStyle {
  return compareStyleOptions.includes(value as CompareTravelStyle) ? (value as CompareTravelStyle) : defaultCompareParams.style;
}

function normalizeCurrency(value: string | null): SupportedCurrency {
  const normalized = value?.toUpperCase();
  return supportedCurrencies.includes(normalized as SupportedCurrency)
    ? (normalized as SupportedCurrency)
    : defaultCompareParams.currency;
}

function normalizeOptionalBudget(value: string | null) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? Math.round(parsed) : undefined;
}
