import {
  formatMoney,
  getDailyCostTotal,
  getDestinationCostBreakdown,
  getDestinationTripEstimate,
  getFlightEstimate,
  normalizeOriginCode,
  type Destination,
  type TravelStyle,
} from "@/lib/data/destinations";
import { getCityCountryLabel, unifiedDestinations } from "@/lib/data/unified-destinations";

export type ProgrammaticOrigin = {
  slug: string;
  city: string;
  country: string;
  code: string;
  status: "active" | "planned";
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

export const programmaticOrigins: ProgrammaticOrigin[] = [
  {
    slug: "montreal",
    city: "Montreal",
    country: "Canada",
    code: "YUL",
    status: "active",
  },
  {
    slug: "toronto",
    city: "Toronto",
    country: "Canada",
    code: "YYZ",
    status: "active",
  },
  {
    slug: "vancouver",
    city: "Vancouver",
    country: "Canada",
    code: "YVR",
    status: "active",
  },
  {
    slug: "quebec",
    city: "Québec",
    country: "Canada",
    code: "YQB",
    status: "active",
  },
  {
    slug: "ottawa",
    city: "Ottawa",
    country: "Canada",
    code: "YOW",
    status: "active",
  },
  {
    slug: "calgary",
    city: "Calgary",
    country: "Canada",
    code: "YYC",
    status: "active",
  },
  {
    slug: "new-york",
    city: "New York",
    country: "United States",
    code: "NYC",
    status: "planned",
  },
  {
    slug: "boston",
    city: "Boston",
    country: "United States",
    code: "BOS",
    status: "planned",
  },
  {
    slug: "chicago",
    city: "Chicago",
    country: "United States",
    code: "CHI",
    status: "planned",
  },
];

export const activeProgrammaticOrigins = programmaticOrigins.filter(
  (origin) => origin.status === "active"
);

const budgetTiers = [
  {
    budget: 1500,
    travelStyle: "budget",
    tripLengthDays: 7,
    suggestedTripLength: "5-7 days",
  },
  {
    budget: 2000,
    travelStyle: "budget",
    tripLengthDays: 8,
    suggestedTripLength: "7-8 days",
  },
  {
    budget: 2500,
    travelStyle: "midRange",
    tripLengthDays: 10,
    suggestedTripLength: "7-10 days",
  },
  {
    budget: 3000,
    travelStyle: "midRange",
    tripLengthDays: 10,
    suggestedTripLength: "10 days",
  },
  {
    budget: 4000,
    travelStyle: "midRange",
    tripLengthDays: 12,
    suggestedTripLength: "10-12 days",
  },
] satisfies Omit<ProgrammaticBudgetPageConfig, "origin" | "currency" | "travelers">[];

export const programmaticBudgetPages = activeProgrammaticOrigins.flatMap((origin) =>
  budgetTiers.map((tier) => ({
    origin,
    budget: tier.budget,
    currency: "CAD",
    travelStyle: tier.travelStyle,
    tripLengthDays: tier.tripLengthDays,
    suggestedTripLength: tier.suggestedTripLength,
    travelers: 1,
  }))
) satisfies ProgrammaticBudgetPageConfig[];

export function getProgrammaticOrigin(originSlug: string) {
  return programmaticOrigins.find((origin) => origin.slug === originSlug.toLowerCase());
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

export function getProgrammaticBudgetRedirectPath(originSlug: string) {
  const origin = getProgrammaticOrigin(originSlug);

  if (!origin) {
    return "/tools/travel-budget-calculator";
  }

  const fallbackPage = programmaticBudgetPages.find((page) => page.origin.slug === origin.slug);

  return fallbackPage ? getProgrammaticBudgetPath(fallbackPage) : "/tools/travel-budget-calculator";
}

export function getProgrammaticBudgetPath(page: ProgrammaticBudgetPageConfig) {
  return `/from/${page.origin.slug}/under-${page.budget}`;
}

export function getMatchingBudgetDestinations(page: ProgrammaticBudgetPageConfig): BudgetDestination[] {
  const originCode = normalizeOriginCode(page.origin.code);

  return unifiedDestinations
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
            detail: `${getCityCountryLabel(destination.destination)} fits ${style.toLowerCase()}-focused trips in this budget set.`,
          }
        : null;
    })
    .filter((pick): pick is ComparisonPick => Boolean(pick));

  return uniquePicks([
    {
      label: "Cheapest total estimate",
      destination: cheapest,
      detail: `${getCityCountryLabel(cheapest.destination)} has the lowest 10-day estimate at ${formatMoney(
        cheapest.totalEstimate,
        "CAD"
      )}.`,
    },
    {
      label: "Best value",
      destination: bestValue,
      detail: `${getCityCountryLabel(bestValue.destination)} balances budget fit with a strong destination score.`,
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
