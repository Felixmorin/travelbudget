import { getIataForLocation } from "@/lib/affiliates/iata";

export type AviasalesCabinClass = "economy" | "premium_economy" | "business" | "first";

export type AviasalesSearchParams = {
  origin?: string;
  originIata?: string;
  destination?: string;
  destinationIata?: string;
  departureDate?: string | Date;
  returnDate?: string | Date;
  adults?: number;
  cabinClass?: AviasalesCabinClass;
  placement?: string;
  pageType?: string;
};

export type NormalizedAviasalesSearchParams = {
  originIata?: string;
  destinationIata?: string;
  departureDate?: string;
  returnDate?: string;
  adults?: number;
  cabinClass?: AviasalesCabinClass;
  placement?: string;
  pageType?: string;
};

export const AVIASALES_FALLBACK_URL =
  process.env.NEXT_PUBLIC_AVIASALES_FALLBACK_URL ?? "https://aviasales.tpx.lu/59DXH0n1";

const AVIASALES_SEARCH_URL = "https://search.aviasales.com/flights/";
const IATA_PATTERN = /^[A-Z]{3}$/;

const cabinClassToTripClass: Record<AviasalesCabinClass, string> = {
  economy: "0",
  premium_economy: "0",
  business: "1",
  first: "2",
};

export function buildAviasalesAffiliateUrl(params: AviasalesSearchParams): string {
  const marker = getTravelpayoutsMarker();

  if (!marker) {
    return AVIASALES_FALLBACK_URL;
  }

  const normalized = normalizeAviasalesSearchParams(params);

  if (!normalized.originIata && !normalized.destinationIata) {
    return AVIASALES_FALLBACK_URL;
  }

  const url = new URL(AVIASALES_SEARCH_URL);

  url.searchParams.set("marker", marker);
  url.searchParams.set("locale", "en");
  url.searchParams.set("currency", "CAD");

  if (normalized.originIata) {
    url.searchParams.set("origin_iata", normalized.originIata);
  }

  if (normalized.destinationIata) {
    url.searchParams.set("destination_iata", normalized.destinationIata);
  }

  if (normalized.departureDate) {
    url.searchParams.set("depart_date", normalized.departureDate);
  }

  if (normalized.returnDate) {
    url.searchParams.set("return_date", normalized.returnDate);
    url.searchParams.set("oneway", "0");
  } else if (normalized.departureDate) {
    url.searchParams.set("oneway", "1");
  }

  if (normalized.adults) {
    url.searchParams.set("adults", String(normalized.adults));
  }

  if (normalized.cabinClass) {
    url.searchParams.set("trip_class", cabinClassToTripClass[normalized.cabinClass]);
  }

  if (normalized.placement) {
    url.searchParams.set("sub_id", normalized.placement);
  }

  return url.toString();
}

export function normalizeAviasalesSearchParams(params: AviasalesSearchParams): NormalizedAviasalesSearchParams {
  const originIata = normalizeIata(params.originIata) ?? getIataForLocation(params.origin);
  const destinationIata = normalizeIata(params.destinationIata) ?? getIataForLocation(params.destination);
  const departureDate = formatSearchDate(params.departureDate);
  const candidateReturnDate = formatSearchDate(params.returnDate);
  const returnDate =
    departureDate && candidateReturnDate && candidateReturnDate < departureDate ? undefined : candidateReturnDate;
  const adults = normalizeAdults(params.adults);
  const cabinClass = normalizeCabinClass(params.cabinClass);
  const placement = normalizePlacement(params.placement);

  return {
    originIata,
    destinationIata,
    departureDate,
    returnDate,
    adults,
    cabinClass,
    placement,
    pageType: params.pageType?.trim() || undefined,
  };
}

export function formatSearchDate(value: string | Date | null | undefined): string | undefined {
  if (!value) {
    return undefined;
  }

  if (value instanceof Date) {
    if (Number.isNaN(value.getTime())) {
      return undefined;
    }

    return [
      value.getFullYear(),
      String(value.getMonth() + 1).padStart(2, "0"),
      String(value.getDate()).padStart(2, "0"),
    ].join("-");
  }

  const trimmed = value.trim();

  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    return isValidDateParts(trimmed) ? trimmed : undefined;
  }

  const parsed = new Date(trimmed);

  return Number.isNaN(parsed.getTime()) ? undefined : formatSearchDate(parsed);
}

export function normalizeIata(value: string | null | undefined) {
  const normalized = value?.trim().toUpperCase();

  return normalized && IATA_PATTERN.test(normalized) ? normalized : undefined;
}

function getTravelpayoutsMarker() {
  return (
    process.env.NEXT_PUBLIC_TRAVELPAYOUTS_MARKER?.trim() ||
    process.env.NEXT_PUBLIC_AVIASALES_MARKER?.trim() ||
    undefined
  );
}

function normalizeAdults(value: number | null | undefined) {
  if (!Number.isFinite(value)) {
    return undefined;
  }

  return Math.min(Math.max(Math.trunc(value ?? 0), 1), 9);
}

function normalizeCabinClass(value: AviasalesCabinClass | null | undefined) {
  return value && value in cabinClassToTripClass ? value : undefined;
}

function normalizePlacement(value: string | null | undefined) {
  return value?.trim().toLowerCase().replace(/[^a-z0-9_-]+/g, "_").replace(/^_+|_+$/g, "").slice(0, 80) || undefined;
}

function isValidDateParts(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(year, month - 1, day);

  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
}
