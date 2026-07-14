import {
  formatMoney,
  getDestinationCostBreakdown,
  getDestinationTripEstimate,
  type Destination,
  type TravelStyle,
} from "@/lib/data/destinations";
import { getUnifiedDestination, unifiedDestinations } from "@/lib/data/unified-destinations";
import { pilotDestinationSlugs, pilotDurationDays } from "@/lib/programmatic/seo-registry";

export type DestinationBudgetSeoPage = {
  destination: Destination;
  originCode: "YUL";
  durationDays: number;
  travelStyle: TravelStyle;
  travelers: number;
};

export const destinationBudgetSeoSlugs = Array.from(
  new Set(
    unifiedDestinations
      .filter((destination) => pilotDestinationSlugs.includes(destination.slug as (typeof pilotDestinationSlugs)[number]))
      .map((destination) => destination.slug)
  )
);

export const durationSeoPages = destinationBudgetSeoSlugs.flatMap((destinationSlug) =>
  pilotDurationDays.map((durationDays) => ({ destinationSlug, durationDays }))
);

export const indexableDurationSeoPages = [
  { destinationSlug: "tokyo", durationDays: 10 },
  { destinationSlug: "lisbon", durationDays: 7 },
] as const;

const allDurationSeoPages = uniqueDurationSeoPages([...durationSeoPages, ...indexableDurationSeoPages]);

export function getDestinationBudgetSeoPage(destinationSlug: string): DestinationBudgetSeoPage | null {
  if (!destinationBudgetSeoSlugs.includes(destinationSlug)) {
    return null;
  }

  const destination = getUnifiedDestination(destinationSlug);

  if (!destination) {
    return null;
  }

  return {
    destination,
    originCode: "YUL",
    durationDays: 10,
    travelStyle: "midRange",
    travelers: 1,
  };
}

export function getDurationSeoPage(destinationSlug: string, durationSlug: string) {
  const durationDays = parseDurationSlug(durationSlug);

  if (!durationDays) {
    return null;
  }

  const page = allDurationSeoPages.find(
    (item) => item.destinationSlug === destinationSlug && item.durationDays === durationDays
  );
  const destination = page ? getUnifiedDestination(destinationSlug) : null;

  return page && destination
    ? {
        destination,
        originCode: "YUL" as const,
        durationDays,
        travelStyle: "midRange" as const,
        travelers: 1,
      }
    : null;
}

export function getBudgetSeoEstimate(page: DestinationBudgetSeoPage) {
  const totalEstimate = getDestinationTripEstimate(page.destination, {
    days: page.durationDays,
    originCode: page.originCode,
    travelStyle: page.travelStyle,
    travelers: page.travelers,
  });
  const costBreakdown = getDestinationCostBreakdown(page.destination, {
    days: page.durationDays,
    originCode: page.originCode,
    travelStyle: page.travelStyle,
    travelers: page.travelers,
  });

  return {
    totalEstimate,
    totalLabel: formatMoney(totalEstimate, "CAD"),
    costBreakdown,
  };
}

export function getTravelBudgetPath(destinationSlug: string) {
  return `/travel-budget/${destinationSlug}`;
}

export function getTravelCostDurationPath(destinationSlug: string, durationDays: number) {
  return `/travel-cost/${destinationSlug}/${durationDays}-days`;
}

export function getDestinationBudgetSeoStaticParams() {
  return destinationBudgetSeoSlugs
    .filter((slug) => unifiedDestinations.some((destination) => destination.slug === slug))
    .map((destination) => ({ destination }));
}

export function getDurationSeoStaticParams() {
  return allDurationSeoPages.map((page) => ({
    destination: page.destinationSlug,
    duration: `${page.durationDays}-days`,
  }));
}

export function getIndexableDurationSeoPages() {
  return indexableDurationSeoPages;
}

export function isIndexableDurationSeoPage(destinationSlug: string, durationDays: number) {
  return indexableDurationSeoPages.some(
    (page) => page.destinationSlug === destinationSlug && page.durationDays === durationDays
  );
}

export function parseDurationSlug(durationSlug: string) {
  const match = /^(\d+)-days$/.exec(durationSlug);

  if (!match) {
    return null;
  }

  const days = Number.parseInt(match[1], 10);
  return Number.isFinite(days) && days > 0 && days <= 60 ? days : null;
}

function uniqueDurationSeoPages<T extends { destinationSlug: string; durationDays: number }>(pages: T[]) {
  const seen = new Set<string>();

  return pages.filter((page) => {
    const key = `${page.destinationSlug}-${page.durationDays}`;

    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}
