import {
  destinations,
  formatMoney,
  getDailyCostTotal,
  getDestinationCostBreakdown,
  getDestinationTripEstimate,
  getFlightEstimate,
  normalizeOriginCode,
  type Destination,
  type TravelStyle,
} from "@/lib/data/destinations";

export type ProgrammaticOrigin = {
  slug: string;
  city: string;
  country: string;
  code: string;
};

export type ProgrammaticBudgetPageConfig = {
  origin: ProgrammaticOrigin;
  budget: number;
  currency: "CAD";
  travelStyle: TravelStyle;
  tripLengthDays: number;
  suggestedTripLength: string;
  travelers: number;
};

export type BudgetDestination = {
  destination: Destination;
  totalEstimate: number;
  flightEstimate: number;
  dailyEstimate: number;
  durationDays: number;
  budgetRemaining: number;
  costBreakdown: ReturnType<typeof getDestinationCostBreakdown>;
};

export type ComparisonPick = {
  label: string;
  destination: BudgetDestination;
  detail: string;
};

const supportedOrigins: ProgrammaticOrigin[] = [
  {
    slug: "montreal",
    city: "Montreal",
    country: "Canada",
    code: "YUL",
  },
  {
    slug: "toronto",
    city: "Toronto",
    country: "Canada",
    code: "YYZ",
  },
  {
    slug: "vancouver",
    city: "Vancouver",
    country: "Canada",
    code: "YVR",
  },
];

export const programmaticBudgetPages = [
  {
    origin: supportedOrigins[0],
    budget: 2500,
    currency: "CAD",
    travelStyle: "midRange",
    tripLengthDays: 10,
    suggestedTripLength: "7-10 days",
    travelers: 1,
  },
  {
    origin: supportedOrigins[1],
    budget: 2500,
    currency: "CAD",
    travelStyle: "midRange",
    tripLengthDays: 10,
    suggestedTripLength: "7-10 days",
    travelers: 1,
  },
  {
    origin: supportedOrigins[2],
    budget: 3000,
    currency: "CAD",
    travelStyle: "midRange",
    tripLengthDays: 10,
    suggestedTripLength: "10 days",
    travelers: 1,
  },
  {
    origin: supportedOrigins[0],
    budget: 1500,
    currency: "CAD",
    travelStyle: "budget",
    tripLengthDays: 7,
    suggestedTripLength: "7 days",
    travelers: 1,
  },
  {
    origin: supportedOrigins[1],
    budget: 3000,
    currency: "CAD",
    travelStyle: "midRange",
    tripLengthDays: 10,
    suggestedTripLength: "10 days",
    travelers: 1,
  },
] satisfies ProgrammaticBudgetPageConfig[];

export function getProgrammaticOrigin(originSlug: string) {
  return supportedOrigins.find((origin) => origin.slug === originSlug.toLowerCase());
}

export function parseBudgetSlug(budgetSlug: string) {
  const match = /^under-(\d+)$/.exec(budgetSlug.toLowerCase());

  if (!match) {
    return null;
  }

  const budget = Number.parseInt(match[1], 10);

  return Number.isFinite(budget) && budget > 0 ? budget : null;
}

export function getProgrammaticBudgetPage(originSlug: string, budgetSlug: string) {
  const origin = getProgrammaticOrigin(originSlug);
  const budget = parseBudgetSlug(budgetSlug);

  if (!origin || !budget) {
    return null;
  }

  return (
    programmaticBudgetPages.find(
      (page) => page.origin.slug === origin.slug && page.budget === budget
    ) ?? null
  );
}

export function getProgrammaticBudgetPath(page: ProgrammaticBudgetPageConfig) {
  return `/from/${page.origin.slug}/under-${page.budget}`;
}

export function getMatchingBudgetDestinations(page: ProgrammaticBudgetPageConfig): BudgetDestination[] {
  const originCode = normalizeOriginCode(page.origin.code);

  return destinations
    .map((destination) => {
      const costBreakdown = getDestinationCostBreakdown(destination, {
        days: page.tripLengthDays,
        originCode,
        travelStyle: page.travelStyle,
        travelers: page.travelers,
      });
      const totalEstimate = getDestinationTripEstimate(destination, {
        days: page.tripLengthDays,
        originCode,
        travelStyle: page.travelStyle,
        travelers: page.travelers,
      });
      const flightEstimate = getFlightEstimate(destination, originCode).average * page.travelers;
      const dailyEstimate = getDailyCostTotal(destination, page.travelStyle) * page.travelers;

      return {
        destination,
        totalEstimate,
        flightEstimate,
        dailyEstimate,
        durationDays: page.tripLengthDays,
        budgetRemaining: page.budget - totalEstimate,
        costBreakdown,
      };
    })
    .filter((item) => item.totalEstimate <= page.budget)
    .sort((a, b) => a.totalEstimate - b.totalEstimate || b.destination.score - a.destination.score);
}

export function getComparisonPicks(destinations: BudgetDestination[]): ComparisonPick[] {
  if (destinations.length === 0) {
    return [];
  }

  const cheapest = destinations[0];
  const bestValue = [...destinations].sort(
    (a, b) => b.destination.score / b.totalEstimate - a.destination.score / a.totalEstimate
  )[0];
  const stylePicks = ["Culture", "Beach", "Food", "Adventure"]
    .map((style) => {
      const destination = destinations.find((item) =>
        item.destination.travelStyles.some((travelStyle) => {
          const normalizedTravelStyle = travelStyle.toLowerCase();

          if (style === "Beach") {
            return normalizedTravelStyle === "beach" || normalizedTravelStyle === "coast";
          }

          return normalizedTravelStyle === style.toLowerCase();
        })
      );

      return destination
        ? {
            label: `Best for ${style.toLowerCase()}`,
            destination,
            detail: `${destination.destination.name} fits ${style.toLowerCase()}-focused trips in this budget set.`,
          }
        : null;
    })
    .filter((pick): pick is ComparisonPick => Boolean(pick));

  return uniquePicks([
    {
      label: "Cheapest total estimate",
      destination: cheapest,
      detail: `${cheapest.destination.name} has the lowest 10-day estimate at ${formatMoney(
        cheapest.totalEstimate,
        "CAD"
      )}.`,
    },
    {
      label: "Best value",
      destination: bestValue,
      detail: `${bestValue.destination.name} balances budget fit with a strong destination score.`,
    },
    ...stylePicks,
  ]);
}

function uniquePicks(picks: ComparisonPick[]) {
  const seen = new Set<string>();

  return picks.filter((pick) => {
    const key = `${pick.label}-${pick.destination.destination.slug}`;

    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}
