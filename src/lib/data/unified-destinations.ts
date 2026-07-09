import {
  destinations as countryDestinations,
  getDailyCostTotal,
  getDestination,
  getDestinationTripEstimate,
  getOriginPricing,
  type DailyCosts,
  type Destination,
  type OriginPricing,
  type TravelStyleCosts,
} from "@/lib/data/destinations";
import { cityDestinations, getCityDestination, type CityDestination } from "@/lib/data/destination-hub";

const defaultOriginCode = "YUL";
const defaultTravelStyle = "midRange";

const countryAliases: Record<string, string> = {
  USA: "United States",
};

export const unifiedDestinations: Destination[] = [
  ...countryDestinations.map((destination) => ({
    ...destination,
    countryName: destination.countryName ?? destination.name,
    destinationKind: "country" as const,
  })),
  ...cityDestinations.map(toDestinationFromCity),
];

export function getUnifiedDestination(slug: string) {
  return unifiedDestinations.find((destination) => destination.slug === slug);
}

export function getUnifiedDestinationStaticParams() {
  return uniqueSlugs(unifiedDestinations.map((destination) => destination.slug)).map((slug) => ({ slug }));
}

export function getCountryFallbackForCity(city: CityDestination) {
  return countryDestinations.find(
    (destination) => destination.name.toLowerCase() === normalizeCountryName(city.country).toLowerCase()
  );
}

export function getCityCountryLabel(destination: Pick<Destination, "name" | "cityName" | "countryName">) {
  return destination.cityName && destination.countryName
    ? `${destination.cityName}, ${destination.countryName}`
    : destination.name;
}

export function getDestinationCountryName(destination: Pick<Destination, "name" | "countryName" | "destinationKind">) {
  return destination.countryName ?? destination.name;
}

export function isCityDestination(destination: Pick<Destination, "destinationKind" | "cityName">) {
  return destination.destinationKind === "city" || Boolean(destination.cityName);
}

function toDestinationFromCity(city: CityDestination): Destination {
  const country = getCountryFallbackForCity(city);
  const dailyCosts = buildCityDailyCosts(city);
  const originPricing = buildCityOriginPricing(city, country);
  const countryCode = country?.countryCode ?? city.country.slice(0, 2).toUpperCase();
  const score = city.popularity ?? country?.score ?? 80;
  const parentCountrySlug = country?.slug;
  const sourceNotes = [
    `Uses the existing ${city.city} city budget for ${city.durationDays} days from ${city.departureCity}.`,
    country
      ? `Falls back to ${country.name} country-level pricing when city-specific origin pricing is unavailable.`
      : `Falls back to country-level assumptions when city-specific pricing is unavailable.`,
    "These estimates are planning baselines, not live booking prices or guarantees.",
  ];

  return {
    slug: city.slug,
    name: city.city,
    cityName: city.city,
    countryName: normalizeCountryName(city.country),
    parentCountrySlug,
    destinationKind: "city",
    countryCode,
    image: city.imageUrl,
    originPricing,
    dailyCosts,
    estimatedCost: getDestinationTripEstimate(
      {
        originPricing,
        dailyCosts,
      },
      {
        days: city.durationDays,
        originCode: defaultOriginCode,
        travelStyle: defaultTravelStyle,
      }
    ),
    currency: city.currency,
    score,
    flightCost: getOriginPricing({ originPricing }, defaultOriginCode).flightEstimate.average,
    hotelCost: getTravelStyleCostsTotal(dailyCosts.midRange.accommodation, city.durationDays),
    foodCost: getTravelStyleCostsTotal(dailyCosts.midRange.food, city.durationDays),
    transportCost: getTravelStyleCostsTotal(dailyCosts.midRange.localTransport, city.durationDays),
    activitiesCost: getTravelStyleCostsTotal(dailyCosts.midRange.activities, city.durationDays),
    bestMonths: city.bestMonths,
    travelStyles: normalizeCityTravelStyles(city.travelStyles),
    weather: country?.weather ?? getCityWeatherLabel(city),
    dataConfidence: country?.dataConfidence ?? "medium",
    lastUpdated: country?.lastUpdated ?? "2026-06-24",
    sourceNotes,
    shortDescription: city.description,
    itineraryPreview: country?.itineraryPreview.map((item) => item.replace(country.name, city.city)) ?? [
      `${city.city} neighborhoods, food stops, and practical transit planning`,
      `Core ${city.city} sights with budget-aware activities`,
      `Flexible day trips or slower local days depending on budget`,
    ],
    affiliateLinks: country?.affiliateLinks ?? [],
    faqs: [
      {
        question: `Is ${city.city} realistic for a budget-conscious trip?`,
        answer: `${city.city} can be realistic when its flight estimate, daily city costs, trip length, and travel style fit your total budget. Use the estimate as a planning baseline before checking live prices.`,
      },
      {
        question: `What changes the ${city.city} trip estimate the most?`,
        answer: `Flights from your origin, accommodation timing, trip length, and paid activities usually move the ${city.city} estimate the most.`,
      },
    ],
  };
}

function buildCityOriginPricing(city: CityDestination, country: Destination | undefined): OriginPricing {
  const parentPricing: Partial<OriginPricing> = country?.originPricing ?? {};
  const defaultOriginPricing = getOriginPricing(country ?? {}, defaultOriginCode);
  const cityOrigin = parseDepartureCity(city.departureCity);

  return {
    ...parentPricing,
    [cityOrigin.code]: {
      originCity: cityOrigin.city,
      originCountry: defaultOriginPricing.originCountry,
      currency: city.currency,
      flightEstimate: {
        low: roundToNearest(city.flightEstimate * 0.82, 10),
        average: city.flightEstimate,
        high: roundToNearest(city.flightEstimate * 1.38, 10),
      },
      seasonalNotes:
        country?.originPricing?.[cityOrigin.code]?.seasonalNotes ??
        `City-specific flight baseline for ${city.city}; other origins use the ${country?.name ?? city.country} fallback.`,
    },
  } as OriginPricing;
}

function buildCityDailyCosts(city: CityDestination): DailyCosts {
  const midRange = {
    accommodation: perDay(city.stayEstimate, city.durationDays),
    food: perDay(city.foodEstimate, city.durationDays),
    localTransport: perDay(city.localTransportEstimate, city.durationDays),
    activities: perDay(city.activitiesEstimate, city.durationDays),
    misc: Math.max(8, perDay(city.estimatedTotalCost - city.flightEstimate - city.stayEstimate - city.foodEstimate - city.localTransportEstimate - city.activitiesEstimate, city.durationDays)),
  };

  return {
    currency: city.currency,
    budget: scaleDailyCosts(midRange, 0.78),
    midRange,
    luxury: scaleDailyCosts(midRange, 1.75),
  };
}

function scaleDailyCosts(costs: TravelStyleCosts, multiplier: number): TravelStyleCosts {
  return {
    accommodation: roundToNearest(costs.accommodation * multiplier, 5),
    food: roundToNearest(costs.food * multiplier, 5),
    localTransport: roundToNearest(costs.localTransport * multiplier, 5),
    activities: roundToNearest(costs.activities * multiplier, 5),
    misc: roundToNearest(costs.misc * multiplier, 5),
  };
}

function normalizeCityTravelStyles(styles: string[]) {
  return styles.map((style) => {
    if (style === "City Break") {
      return "Cities";
    }

    if (style === "Warm Escape") {
      return "Beach";
    }

    if (style === "Solo") {
      return "Adventure";
    }

    if (style === "Romantic") {
      return "Culture";
    }

    return style;
  });
}

function parseDepartureCity(value: string) {
  const match = /^(.*)\s+\(([A-Z]{3})\)$/.exec(value.trim());

  return {
    city: match?.[1] ?? value,
    code: match?.[2] ?? defaultOriginCode,
  };
}

function normalizeCountryName(country: string) {
  return countryAliases[country] ?? country;
}

function getCityWeatherLabel(city: CityDestination) {
  return city.travelStyles.includes("Warm Escape") || city.travelStyles.includes("Beach")
    ? "Warm seasonal escape"
    : "City travel weather varies by season";
}

function perDay(total: number, days: number) {
  return roundToNearest(total / Math.max(1, days), 5);
}

function getTravelStyleCostsTotal(value: number, days: number) {
  return Math.round(value * days);
}

function roundToNearest(value: number, nearest: number) {
  return Math.round(value / nearest) * nearest;
}

function uniqueSlugs(slugs: string[]) {
  return Array.from(new Set(slugs));
}

export { countryDestinations, getCityDestination, getDailyCostTotal, getDestination };
