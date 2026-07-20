import {
  getDailyCostTotal,
  getDestinationCostBreakdown,
  getDestinationTripEstimate,
  getFlightEstimate,
  normalizeOriginCode,
  type Destination,
  type TravelStyle,
} from "@/lib/data/destinations";
import { getCityCountryLabel, unifiedDestinations } from "@/lib/data/unified-destinations";
import { activeProgrammaticOrigins, type ProgrammaticOrigin } from "@/lib/programmatic/budget-pages";

export type DestinationBudgetTier = {
  amount: number;
  slug: string;
  label: string;
  durationDays: number;
  travelStyle: TravelStyle;
  secondaryDurationDays: number;
  secondaryTravelStyle: TravelStyle;
};

export type DestinationBudgetMatch = {
  destination: Destination;
  totalEstimate: number;
  flightEstimate: number;
  dailyEstimate: number;
  budgetRemaining: number;
  durationDays: number;
  travelStyle: TravelStyle;
  costBreakdown: ReturnType<typeof getDestinationCostBreakdown>;
};

export type DestinationBudgetScenario = {
  origin: ProgrammaticOrigin;
  durationDays: number;
  travelStyle: TravelStyle;
  matches: DestinationBudgetMatch[];
};

export const destinationsByBudgetPath = "/destinations-by-budget";

export const destinationBudgetTiers: DestinationBudgetTier[] = [
  {
    amount: 1000,
    slug: "under-1000",
    label: "Under $1000",
    durationDays: 3,
    travelStyle: "budget",
    secondaryDurationDays: 4,
    secondaryTravelStyle: "budget",
  },
  {
    amount: 1500,
    slug: "under-1500",
    label: "Under $1500",
    durationDays: 5,
    travelStyle: "budget",
    secondaryDurationDays: 4,
    secondaryTravelStyle: "midRange",
  },
  {
    amount: 2000,
    slug: "under-2000",
    label: "Under $2000",
    durationDays: 7,
    travelStyle: "budget",
    secondaryDurationDays: 5,
    secondaryTravelStyle: "midRange",
  },
  {
    amount: 2500,
    slug: "under-2500",
    label: "Under $2500",
    durationDays: 7,
    travelStyle: "midRange",
    secondaryDurationDays: 10,
    secondaryTravelStyle: "budget",
  },
  {
    amount: 3000,
    slug: "under-3000",
    label: "Under $3000",
    durationDays: 10,
    travelStyle: "midRange",
    secondaryDurationDays: 14,
    secondaryTravelStyle: "budget",
  },
  {
    amount: 4000,
    slug: "under-4000",
    label: "Under $4000",
    durationDays: 10,
    travelStyle: "midRange",
    secondaryDurationDays: 14,
    secondaryTravelStyle: "midRange",
  },
  {
    amount: 5000,
    slug: "under-5000",
    label: "Under $5000",
    durationDays: 14,
    travelStyle: "midRange",
    secondaryDurationDays: 10,
    secondaryTravelStyle: "luxury",
  },
];

export function getDestinationBudgetTier(slug: string) {
  return destinationBudgetTiers.find((tier) => tier.slug === slug.toLowerCase()) ?? null;
}

export function getDestinationBudgetPath(tier: Pick<DestinationBudgetTier, "slug">) {
  return `${destinationsByBudgetPath}/${tier.slug}`;
}

export function getDestinationBudgetStaticParams() {
  return destinationBudgetTiers.map((tier) => ({ tier: tier.slug }));
}

export function getDestinationBudgetScenarios(tier: DestinationBudgetTier): DestinationBudgetScenario[] {
  return activeProgrammaticOrigins
    .map((origin, index) => {
      const usePrimaryAssumption = index % 2 === 0;
      const durationDays = usePrimaryAssumption ? tier.durationDays : tier.secondaryDurationDays;
      const travelStyle = usePrimaryAssumption ? tier.travelStyle : tier.secondaryTravelStyle;

      return {
        origin,
        durationDays,
        travelStyle,
        matches: getDestinationBudgetMatches({
          budget: tier.amount,
          origin,
          durationDays,
          travelStyle,
          limit: 6,
        }),
      };
    })
    .filter((scenario) => scenario.matches.length > 0);
}

export function getFeaturedBudgetMatches(tier: DestinationBudgetTier, limit = 5) {
  return getDestinationBudgetScenarios(tier)
    .flatMap((scenario) =>
      scenario.matches.map((match) => ({
        ...match,
        origin: scenario.origin,
      }))
    )
    .sort((a, b) => b.destination.score - a.destination.score || a.totalEstimate - b.totalEstimate)
    .filter(uniqueDestinationOrigin)
    .slice(0, limit);
}

function getDestinationBudgetMatches({
  budget,
  origin,
  durationDays,
  travelStyle,
  limit,
}: {
  budget: number;
  origin: ProgrammaticOrigin;
  durationDays: number;
  travelStyle: TravelStyle;
  limit: number;
}): DestinationBudgetMatch[] {
  const originCode = normalizeOriginCode(origin.code);

  return unifiedDestinations
    .map((destination) => {
      const totalEstimate = getDestinationTripEstimate(destination, {
        days: durationDays,
        originCode,
        travelStyle,
        travelers: 1,
      });
      const costBreakdown = getDestinationCostBreakdown(destination, {
        days: durationDays,
        originCode,
        travelStyle,
        travelers: 1,
      });

      return {
        destination,
        totalEstimate,
        flightEstimate: getFlightEstimate(destination, originCode).average,
        dailyEstimate: getDailyCostTotal(destination, travelStyle),
        budgetRemaining: budget - totalEstimate,
        durationDays,
        travelStyle,
        costBreakdown,
      };
    })
    .filter((match) => match.totalEstimate <= budget)
    .sort((a, b) => b.destination.score / b.totalEstimate - a.destination.score / a.totalEstimate)
    .slice(0, limit);
}

function uniqueDestinationOrigin<T extends DestinationBudgetMatch & { origin: ProgrammaticOrigin }>(
  match: T,
  index: number,
  matches: T[]
) {
  const key = `${match.origin.slug}-${match.destination.slug}`;

  return matches.findIndex((item) => `${item.origin.slug}-${item.destination.slug}` === key) === index;
}

export function formatBudgetTravelStyle(style: TravelStyle) {
  if (style === "midRange") {
    return "mid-range";
  }

  return style;
}

export function getBudgetTierSummary(tier: DestinationBudgetTier) {
  const featuredMatches = getFeaturedBudgetMatches(tier, 3);
  const destinationNames = featuredMatches.map((match) => getCityCountryLabel(match.destination));

  return destinationNames.length > 0
    ? destinationNames.join(", ")
    : "no current destination matches in the planning dataset";
}
