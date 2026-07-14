import { affiliateConfig } from "@/lib/affiliates/config";
import type { AffiliateContext, AffiliateProvider } from "@/lib/affiliates/types";
import { buildAviasalesAffiliateUrl } from "@/lib/affiliates/aviasales";

export function buildAffiliateUrl(provider: AffiliateProvider, context: AffiliateContext) {
  if (provider === "aviasales") return buildAviasalesUrl(context);
  if (provider === "booking") return buildBookingUrl(context);
  if (provider === "getyourguide") return buildGetYourGuideUrl(context);
  if (provider === "airalo") return buildAiraloUrl(context);
  if (provider === "discover_cars") return buildDiscoverCarsUrl(context);
  if (provider === "omio") return buildOmioUrl(context);
  if (provider === "travel_insurance") return buildInsuranceUrl(context);
  return buildAirportTransferUrl(context);
}

export function buildAviasalesUrl(context: AffiliateContext) {
  return buildAviasalesAffiliateUrl({
    origin: context.originCity,
    originIata: context.originIata,
    destination: context.destinationCity ?? context.destinationCountry,
    destinationIata: context.destinationIata,
    departureDate: context.departureDate,
    returnDate: context.returnDate,
    adults: context.travelers,
    cabinClass: "economy",
    placement: buildSubId(context),
    pageType: context.pageType,
  });
}

export function buildBookingUrl(context: AffiliateContext) {
  void context;
  return getConfiguredGenericUrl("booking");
}

export function buildGetYourGuideUrl(context: AffiliateContext) {
  const baseUrl = getConfiguredGenericUrl("getyourguide");
  const query = [context.destinationCity, context.destinationCountry]
    .filter(Boolean)
    .join(" ");

  return buildGetYourGuideSearchUrl({ baseUrl, query });
}

export function buildAiraloUrl(context: AffiliateContext) {
  void context;
  return getConfiguredGenericUrl("airalo");
}

export function buildDiscoverCarsUrl(context: AffiliateContext) {
  void context;
  return getConfiguredGenericUrl("discover_cars");
}

export function buildOmioUrl(context: AffiliateContext) {
  void context;
  return getConfiguredGenericUrl("omio");
}

export function buildInsuranceUrl(context: AffiliateContext) {
  void context;
  return getConfiguredGenericUrl("travel_insurance");
}

export function buildAirportTransferUrl(context: AffiliateContext) {
  void context;
  return getConfiguredGenericUrl("airport_transfer");
}

export function buildSubId(context: AffiliateContext) {
  return [context.pageType, context.placement, context.category, context.destinationSlug]
    .filter(Boolean)
    .join("_")
    .toLowerCase()
    .replace(/[^a-z0-9_]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 80);
}

function getConfiguredGenericUrl(provider: Exclude<AffiliateProvider, "aviasales">) {
  const baseUrl = affiliateConfig[provider].baseUrl?.trim();

  if (!baseUrl) {
    return "";
  }

  // The supplied URLs are affiliate entry or short links. Unless a provider-specific deep-link contract is configured,
  // keep attribution intact by returning the generic affiliate URL unchanged.
  try {
    return new URL(baseUrl).toString();
  } catch {
    return "";
  }
}

export function buildGetYourGuideSearchUrl({
  baseUrl,
  query,
}: {
  baseUrl: string;
  query?: string;
}) {
  const searchQuery = query?.trim();

  if (!baseUrl || !searchQuery) {
    return baseUrl;
  }

  try {
    const sourceUrl = new URL(baseUrl);

    if (!sourceUrl.hostname.toLowerCase().endsWith("getyourguide.com")) {
      return baseUrl;
    }

    const searchUrl = new URL("/s/", sourceUrl.origin);
    searchUrl.searchParams.set("q", searchQuery);

    for (const [key, value] of sourceUrl.searchParams.entries()) {
      if (key !== "q") {
        searchUrl.searchParams.set(key, value);
      }
    }

    return searchUrl.toString();
  } catch {
    return baseUrl;
  }
}
