import { destinations, getDestinationCostBreakdown, getDestinationTripEstimate } from "@/lib/data/destinations";
import { getUnifiedDestination, unifiedDestinations } from "@/lib/data/unified-destinations";
import { getComparisonPage, getComparisonPath } from "@/lib/programmatic/comparison-pages";
import {
  getBudgetAmountPage,
  getBudgetAmountPath,
  getDestinationTravelBudgetPath,
  getPilotDestinationBudgetPage,
} from "@/lib/programmatic/seo-registry";
import type { BudgetBreakdown, ContentRequest } from "@/lib/social-content/domain/types";

export type GoByBudgetContentSnapshot = {
  destinations: typeof unifiedDestinations;
  countryDestinations: typeof destinations;
  generatedAt: string;
};

export function getGoByBudgetContentSnapshot(): GoByBudgetContentSnapshot {
  return {
    destinations: unifiedDestinations,
    countryDestinations: destinations,
    generatedAt: new Date().toISOString(),
  };
}

export function getLandingPagePathForRequest(request: ContentRequest) {
  if (request.destination) {
    const destination = getUnifiedDestination(request.destination);

    if (destination) {
      return getLandingPagePathForDestination(destination.slug);
    }
  }

  return getResultsLandingPagePath(request);
}

export function getResultsLandingPagePath(request: Pick<ContentRequest, "origin" | "budget" | "currency" | "durationDays" | "travelers" | "travelStyle">) {
  return `/results?origin=${encodeURIComponent(request.origin)}&budget=${request.budget}&currency=${request.currency}&days=${request.durationDays}&travelers=${request.travelers}&style=${request.travelStyle}`;
}

export function getLandingPagePathForBudget(request: ContentRequest) {
  return getBudgetAmountPage(String(request.budget)) ? getBudgetAmountPath(request.budget) : getResultsLandingPagePath(request);
}

export function getLandingPagePathForDestination(destinationSlug: string) {
  return getPilotDestinationBudgetPage(destinationSlug)
    ? getDestinationTravelBudgetPath(destinationSlug)
    : `/destinations/${destinationSlug}`;
}

export function getLandingPagePathForComparison(firstDestinationSlug: string, secondDestinationSlug: string) {
  const comparisonSlug = `${firstDestinationSlug}-vs-${secondDestinationSlug}`;
  const reverseComparisonSlug = `${secondDestinationSlug}-vs-${firstDestinationSlug}`;
  const comparison = getComparisonPage(comparisonSlug) ?? getComparisonPage(reverseComparisonSlug);

  return comparison ? getComparisonPath(comparison) : null;
}

export function getBudgetBreakdownForDestination(request: ContentRequest, destinationSlug: string): BudgetBreakdown {
  const destination = getUnifiedDestination(destinationSlug);

  if (!destination) {
    throw new Error(`Unknown GoByBudget destination: ${destinationSlug}.`);
  }

  const breakdown = getDestinationCostBreakdown(destination, {
    days: request.durationDays,
    originCode: request.origin,
    travelStyle: toDestinationTravelStyle(request.travelStyle),
    travelers: request.travelers,
  });
  const total = getDestinationTripEstimate(destination, {
    days: request.durationDays,
    originCode: request.origin,
    travelStyle: toDestinationTravelStyle(request.travelStyle),
    travelers: request.travelers,
  });

  return {
    flights: breakdown.flights,
    accommodation: breakdown.accommodation,
    food: breakdown.food,
    localTransport: breakdown.localTransport,
    activities: breakdown.activities,
    miscellaneous: breakdown.misc,
    total,
    currency: "CAD",
    estimatedAt: destination.lastUpdated,
    dataSource: "gobybudget-estimate",
    sourceNotes: destination.sourceNotes,
  };
}

function toDestinationTravelStyle(style: ContentRequest["travelStyle"]) {
  if (style === "comfort") return "luxury";
  if (style === "budget") return "budget";
  return "midRange";
}
