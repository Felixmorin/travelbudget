import {
  getDailyCostTotal,
  getDestinationCostBreakdown,
  getDestinationTripEstimate,
  getFlightEstimate,
  normalizeOriginCode,
  type Destination,
  type TravelStyle,
} from "@/lib/data/destinations";
import {
  departureCities,
  getDepartureCityBySlug,
  type DepartureCity,
} from "@/lib/data/departure-cities";
import { unifiedDestinations } from "@/lib/data/unified-destinations";
import { getBudgetAmountPath, getTripLengthPath } from "@/lib/programmatic/seo-registry";

export type DepartureCityPage = {
  origin: DepartureCity;
  path: string;
  currency: DepartureCity["currency"];
  travelStyle: TravelStyle;
  tripLengthDays: number;
  budgets: number[];
  recommendations: DepartureRecommendation[];
  internalLinks: string[];
  isIndexable: boolean;
  noindexReasons: string[];
};

export type DepartureRecommendation = {
  destination: Destination;
  totalEstimate: number;
  flightEstimate: number | null;
  dailyEstimate: number;
  costBreakdown: ReturnType<typeof getDestinationCostBreakdown>;
  suggestedTripLength: string;
};

export const pilotDepartureCitySlugs = [
  "montreal",
  "toronto",
  "vancouver",
  "calgary",
  "new-york",
  "london",
  "paris",
] as const;

const pageBudgets = [1000, 2000, 3000, 5000] as const;

export function getDepartureCityPath(origin: Pick<DepartureCity, "slug">) {
  return `/from/${origin.slug}`;
}

export function getDepartureCityStaticParams() {
  return departureCities.map((origin) => ({ origin: origin.slug }));
}

export function getPilotDepartureCities() {
  return pilotDepartureCitySlugs
    .map((slug) => getDepartureCityBySlug(slug))
    .filter((origin): origin is DepartureCity => Boolean(origin));
}

export function getDepartureCityPage(originSlug: string): DepartureCityPage | null {
  const origin = getDepartureCityBySlug(originSlug);

  if (!origin) {
    return null;
  }

  const originCode = normalizeOriginCode(origin.airportCodes[0]);
  const recommendations = unifiedDestinations
    .map((destination) => {
      const flightAverage = getFlightEstimate(destination, originCode).average;
      const costBreakdown = getDestinationCostBreakdown(destination, {
        days: 10,
        originCode,
        travelStyle: "midRange",
      });
      const totalEstimate = getDestinationTripEstimate(destination, {
        days: 10,
        originCode,
        travelStyle: "midRange",
      });

      return {
        destination,
        totalEstimate,
        flightEstimate: flightAverage > 0 ? flightAverage : null,
        dailyEstimate: getDailyCostTotal(destination, "midRange"),
        costBreakdown,
        suggestedTripLength: getSuggestedTripLength(totalEstimate),
      };
    })
    .filter((item) => item.flightEstimate !== null)
    .sort((a, b) => a.totalEstimate - b.totalEstimate || b.destination.score - a.destination.score)
    .slice(0, 8);

  const internalLinks = [
    "/travel-budget-calculator",
    "/methodology",
    "/destinations",
    ...pageBudgets.map((budget) => getBudgetAmountPath(budget)),
    ...[7, 10, 14].map((days) => getTripLengthPath(days)),
    ...recommendations.slice(0, 4).map((item) => `/destinations/${item.destination.slug}`),
  ];
  const noindexReasons = getNoindexReasons(origin, recommendations, internalLinks);

  return {
    origin,
    path: getDepartureCityPath(origin),
    currency: origin.currency,
    travelStyle: "midRange",
    tripLengthDays: 10,
    budgets: [...pageBudgets],
    recommendations,
    internalLinks,
    isIndexable: noindexReasons.length === 0,
    noindexReasons,
  };
}

export function getIndexableDepartureCityPages() {
  return getPilotDepartureCities()
    .map((origin) => getDepartureCityPage(origin.slug))
    .filter((page): page is DepartureCityPage => page !== null && page.isIndexable);
}

function getNoindexReasons(
  origin: DepartureCity,
  recommendations: DepartureRecommendation[],
  internalLinks: string[]
) {
  const reasons: string[] = [];

  if (!origin.indexable) reasons.push("origin is not in the indexable pilot set");
  if (origin.flightPricingStatus !== "available") reasons.push("flight estimates unavailable");
  if (recommendations.length < 4) reasons.push("fewer than four usable destination recommendations");
  if (internalLinks.length < 6) reasons.push("insufficient internal links");

  return reasons;
}

function getSuggestedTripLength(totalEstimate: number) {
  if (totalEstimate <= 1800) return "5-7 days";
  if (totalEstimate <= 3200) return "7-10 days";
  return "10-14 days";
}
