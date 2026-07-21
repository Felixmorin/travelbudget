import {
  getDailyCostTotal,
  getDestinationCostBreakdown,
  getDestinationTripEstimate,
  getFlightEstimate,
  type Destination,
  type TravelStyle,
} from "@/lib/data/destinations";
import { getCityCountryLabel, getUnifiedDestination } from "@/lib/data/unified-destinations";
import {
  getMatchingBudgetDestinations,
  getProgrammaticBudgetPath,
  pilotBudgetAmounts,
  pilotOriginSlugs,
  programmaticBudgetPages,
  type BudgetDestination,
  type ProgrammaticBudgetPageConfig,
} from "@/lib/programmatic/budget-pages";
import {
  comparisonPages,
  getComparisonItems,
  getComparisonPath,
  type ComparisonPageConfig,
} from "@/lib/programmatic/comparison-pages";

export type ProgrammaticSeoType =
  | "destination"
  | "budget"
  | "origin-budget"
  | "trip-length"
  | "comparison";

export { pilotBudgetAmounts, pilotOriginSlugs };

export type IndexabilityStatus = "index" | "noindex";

export type IndexabilityEvaluation = {
  status: IndexabilityStatus;
  reasons: string[];
  score: number;
};

export type SeoRegistryPage = {
  type: ProgrammaticSeoType;
  path: string;
  canonicalPath: string;
  title: string;
  description: string;
  h1: string;
  lastModified: string;
  priority: number;
  changeFrequency: "weekly" | "monthly" | "yearly";
  internalLinks: string[];
  evaluation: IndexabilityEvaluation;
};

export const pilotDestinationSlugs = [
  "portugal",
  "japan",
  "france",
  "spain",
  "south-korea",
  "mexico",
  "colombia",
  "italy",
  "thailand",
  "vietnam",
] as const;

export const pilotDurationDays = [7, 10, 14] as const;

export const pilotComparisonSlugs = [
  "portugal-vs-spain",
  "japan-vs-south-korea",
  "mexico-vs-colombia",
  "france-vs-italy",
  "thailand-vs-vietnam",
  "best-europe-trips-from-toronto-under-3000",
] as const;

export function getPilotDestinations() {
  return pilotDestinationSlugs
    .map((slug) => getUnifiedDestination(slug))
    .filter((destination): destination is Destination => Boolean(destination));
}

export function getDestinationTravelBudgetPath(destinationSlug: string) {
  return `/destinations/${destinationSlug}/travel-budget`;
}

export function getBudgetAmountPath(amount: number) {
  return `/budget/${amount}`;
}

export function getTripLengthPath(days: number) {
  return `/trip-length/${days}-days`;
}

export function getPilotDestinationBudgetPage(destinationSlug: string) {
  const destination = getUnifiedDestination(destinationSlug);

  if (!destination || !pilotDestinationSlugs.includes(destination.slug as (typeof pilotDestinationSlugs)[number])) {
    return null;
  }

  return {
    destination,
    originCode: "YUL",
    originCity: "Montreal",
    durationDays: 10,
    travelStyle: "midRange" as TravelStyle,
    travelers: 1,
    path: getDestinationTravelBudgetPath(destination.slug),
  };
}

export function getBudgetAmountPage(amountSlug: string) {
  const amount = Number.parseInt(amountSlug, 10);

  if (!pilotBudgetAmounts.includes(amount as (typeof pilotBudgetAmounts)[number])) {
    return null;
  }

  const originPages = programmaticBudgetPages.filter((page) => page.budget === amount);
  const matchesByOrigin = originPages.map((page) => ({
    page,
    matches: getMatchingBudgetDestinations(page).slice(0, 8),
  }));
  const uniqueMatches = uniqueBudgetDestinations(matchesByOrigin.flatMap((item) => item.matches)).slice(0, 12);

  return {
    amount,
    currency: "CAD" as const,
    originPages,
    matchesByOrigin,
    matches: uniqueMatches,
    path: getBudgetAmountPath(amount),
  };
}

export function getTripLengthPage(durationSlug: string) {
  const days = parseTripLengthSlug(durationSlug);

  if (!days || !pilotDurationDays.includes(days as (typeof pilotDurationDays)[number])) {
    return null;
  }

  const destinations = getPilotDestinations()
    .map((destination) => {
      const totalEstimate = getDestinationTripEstimate(destination, {
        days,
        originCode: "YUL",
        travelStyle: "midRange",
      });

      return {
        destination,
        days,
        totalEstimate,
        dailyEstimate: getDailyCostTotal(destination, "midRange"),
        flightEstimate: getFlightEstimate(destination, "YUL").average,
        costBreakdown: getDestinationCostBreakdown(destination, {
          days,
          originCode: "YUL",
          travelStyle: "midRange",
        }),
      };
    })
    .sort((a, b) => a.totalEstimate - b.totalEstimate);

  return {
    days,
    originCode: "YUL",
    originCity: "Montreal",
    destinations,
    path: getTripLengthPath(days),
  };
}

export function parseTripLengthSlug(durationSlug: string) {
  const match = /^(\d+)-days$/.exec(durationSlug);

  if (!match) {
    return null;
  }

  const days = Number.parseInt(match[1], 10);
  return Number.isFinite(days) ? days : null;
}

export function getIndexableSeoPages(): SeoRegistryPage[] {
  return getAllSeoRegistryPages().filter((page) => page.evaluation.status === "index");
}

export function getAllSeoRegistryPages(): SeoRegistryPage[] {
  return [
    ...getPilotDestinations().map(createDestinationRegistryPage),
    ...pilotBudgetAmounts.map((amount) => createBudgetAmountRegistryPage(amount)),
    ...programmaticBudgetPages.map(createOriginBudgetRegistryPage),
    ...pilotDurationDays.map((days) => createTripLengthRegistryPage(days)),
    ...comparisonPages.filter(isPilotComparison).map(createComparisonRegistryPage),
  ];
}

export function evaluateDestinationIndexability({
  destination,
  totalEstimate,
  breakdown,
  internalLinks,
  distinctIntent,
}: {
  destination: Destination;
  totalEstimate: number;
  breakdown: Record<string, number>;
  internalLinks: string[];
  distinctIntent: boolean;
}): IndexabilityEvaluation {
  return evaluateIndexability([
    [hasUniqueDestinationData(destination), "enough unique destination data"],
    [totalEstimate > 0, "usable total estimate"],
    [hasCostBreakdown(breakdown), "usable cost breakdown"],
    [destination.shortDescription.length >= 80, "contextual text"],
    [internalLinks.length >= 3, "several internal links"],
    [distinctIntent, "distinct search intent"],
  ]);
}

export function evaluateCollectionIndexability({
  itemCount,
  hasCostBreakdown,
  introLength,
  internalLinks,
  distinctIntent,
}: {
  itemCount: number;
  hasCostBreakdown: boolean;
  introLength: number;
  internalLinks: string[];
  distinctIntent: boolean;
}): IndexabilityEvaluation {
  return evaluateIndexability([
    [itemCount >= 3, "at least three useful results"],
    [hasCostBreakdown, "usable cost breakdown"],
    [introLength >= 90, "contextual text"],
    [internalLinks.length >= 3, "several internal links"],
    [distinctIntent, "distinct search intent"],
  ]);
}

export function evaluateComparisonIndexability({
  itemCount,
  hasCostBreakdown,
  introLength,
  internalLinks,
  distinctIntent,
}: {
  itemCount: number;
  hasCostBreakdown: boolean;
  introLength: number;
  internalLinks: string[];
  distinctIntent: boolean;
}): IndexabilityEvaluation {
  return evaluateIndexability([
    [itemCount >= 2, "at least two comparable destinations"],
    [hasCostBreakdown, "usable cost breakdown"],
    [introLength >= 90, "contextual text"],
    [internalLinks.length >= 3, "several internal links"],
    [distinctIntent, "distinct search intent"],
  ]);
}

function createDestinationRegistryPage(destination: Destination): SeoRegistryPage {
  const destinationLabel = getCityCountryLabel(destination);
  const path = getDestinationTravelBudgetPath(destination.slug);
  const breakdown = getDestinationCostBreakdown(destination, {
    days: 10,
    originCode: "YUL",
    travelStyle: "midRange",
  });
  const totalEstimate = getDestinationTripEstimate(destination, {
    days: 10,
    originCode: "YUL",
    travelStyle: "midRange",
  });
  const internalLinks = [
    `/destinations/${destination.slug}`,
    "/travel-budget-calculator",
    "/methodology",
    getTripLengthPath(10),
  ];

  return {
    type: "destination",
    path,
    canonicalPath: path,
    title: `${destinationLabel} Travel Budget: Daily & Total Trip Cost`,
    description: `Plan a ${destinationLabel} travel budget in CAD with flights, daily costs, accommodation, meals, local transport, activities, best months, and confidence notes.`,
    h1: `${destinationLabel} travel budget`,
    lastModified: destination.lastUpdated,
    priority: 0.84,
    changeFrequency: "monthly",
    internalLinks,
    evaluation: evaluateDestinationIndexability({
      destination,
      totalEstimate,
      breakdown,
      internalLinks,
      distinctIntent: true,
    }),
  };
}

function createBudgetAmountRegistryPage(amount: number): SeoRegistryPage {
  const page = getBudgetAmountPage(String(amount));
  const path = getBudgetAmountPath(amount);
  const firstMatch = page?.matches[0];
  const internalLinks = [
    "/travel-budget-calculator",
    "/methodology",
    ...programmaticBudgetPages
      .filter((originPage) => originPage.budget === amount)
      .map(getProgrammaticBudgetPath)
      .slice(0, 3),
  ];

  return {
    type: "budget",
    path,
    canonicalPath: path,
    title: `Where Can You Travel for $${amount.toLocaleString("en-CA")} CAD?`,
    description: `See destinations that can fit a $${amount.toLocaleString("en-CA")} CAD trip budget from Canada, with estimated flights, daily costs, trip length assumptions, and planning limits.`,
    h1: `Where can you travel for $${amount.toLocaleString("en-CA")} CAD?`,
    lastModified: firstMatch?.destination.lastUpdated ?? "2026-06-24",
    priority: amount === 1000 ? 0.45 : 0.76,
    changeFrequency: "monthly",
    internalLinks,
    evaluation: evaluateCollectionIndexability({
      itemCount: page?.matches.length ?? 0,
      hasCostBreakdown: Boolean(firstMatch && hasCostBreakdown(firstMatch.costBreakdown)),
      introLength: 160,
      internalLinks,
      distinctIntent: true,
    }),
  };
}

function createOriginBudgetRegistryPage(page: ProgrammaticBudgetPageConfig): SeoRegistryPage {
  const matches = getMatchingBudgetDestinations(page);
  const path = getProgrammaticBudgetPath(page);
  const internalLinks = [
    "/travel-budget-calculator",
    "/methodology",
    getBudgetAmountPath(page.budget),
    ...matches.slice(0, 3).map((item) => `/destinations/${item.destination.slug}`),
  ];

  return {
    type: "origin-budget",
    path,
    canonicalPath: path,
    title: `Trips From ${page.origin.city} Under $${page.budget.toLocaleString("en-CA")} CAD`,
    description: `Compare affordable trips from ${page.origin.city} under $${page.budget.toLocaleString("en-CA")} CAD using estimated flights, daily costs, trip length, and budget fit.`,
    h1: `Trips from ${page.origin.city} under $${page.budget.toLocaleString("en-CA")} CAD`,
    lastModified: matches[0]?.destination.lastUpdated ?? "2026-06-24",
    priority: 0.76,
    changeFrequency: "monthly",
    internalLinks,
    evaluation: evaluateCollectionIndexability({
      itemCount: matches.length,
      hasCostBreakdown: Boolean(matches[0] && hasCostBreakdown(matches[0].costBreakdown)),
      introLength: 180,
      internalLinks,
      distinctIntent: pilotOriginSlugs.includes(page.origin.slug as (typeof pilotOriginSlugs)[number]),
    }),
  };
}

function createTripLengthRegistryPage(days: number): SeoRegistryPage {
  const page = getTripLengthPage(`${days}-days`);
  const firstDestination = page?.destinations[0];
  const path = getTripLengthPath(days);
  const internalLinks = [
    "/travel-budget-calculator",
    "/methodology",
    ...getPilotDestinations()
      .slice(0, 3)
      .map((destination) => getDestinationTravelBudgetPath(destination.slug)),
  ];

  return {
    type: "trip-length",
    path,
    canonicalPath: path,
    title: `${days}-Day Trip Budget: Destinations and Cost Estimates`,
    description: `Compare ${days}-day trip budget estimates from Canada, including flights, daily costs, accommodation, meals, local transport, activities, and planning assumptions.`,
    h1: `${days}-day trip budget estimates`,
    lastModified: firstDestination?.destination.lastUpdated ?? "2026-06-24",
    priority: 0.72,
    changeFrequency: "monthly",
    internalLinks,
    evaluation: evaluateCollectionIndexability({
      itemCount: page?.destinations.length ?? 0,
      hasCostBreakdown: Boolean(firstDestination && hasCostBreakdown(firstDestination.costBreakdown)),
      introLength: 150,
      internalLinks,
      distinctIntent: true,
    }),
  };
}

function createComparisonRegistryPage(page: ComparisonPageConfig): SeoRegistryPage {
  const items = getComparisonItems(page);
  const path = getComparisonPath(page);
  const internalLinks = [
    "/compare",
    "/travel-budget-calculator",
    "/methodology",
    ...items.map((item) => `/destinations/${item.destination.slug}`),
  ];

  return {
    type: "comparison",
    path,
    canonicalPath: path,
    title: page.title,
    description: page.description,
    h1: page.title,
    lastModified: items[0]?.destination.lastUpdated ?? "2026-06-24",
    priority: 0.78,
    changeFrequency: "monthly",
    internalLinks,
    evaluation: evaluateComparisonIndexability({
      itemCount: items.length,
      hasCostBreakdown: items.every((item) => item.totalEstimate > 0 && item.flightEstimate > 0 && item.dailyEstimate > 0),
      introLength: page.description.length,
      internalLinks,
      distinctIntent: true,
    }),
  };
}

function evaluateIndexability(checks: Array<[boolean, string]>): IndexabilityEvaluation {
  const missing = checks.filter(([passed]) => !passed).map(([, reason]) => reason);

  return {
    status: missing.length === 0 ? "index" : "noindex",
    reasons: missing,
    score: checks.length - missing.length,
  };
}

function hasUniqueDestinationData(destination: Destination) {
  return (
    destination.sourceNotes.length >= 2 &&
    destination.bestMonths.length >= 2 &&
    destination.travelStyles.length >= 2 &&
    destination.faqs.length >= 2 &&
    destination.dataConfidence !== "low"
  );
}

function hasCostBreakdown(breakdown: Record<string, number>) {
  const required = ["flights", "accommodation", "food", "localTransport", "activities"];
  return required.every((key) => Number.isFinite(breakdown[key]) && breakdown[key] > 0);
}

function isPilotComparison(page: ComparisonPageConfig) {
  return pilotComparisonSlugs.includes(page.slug as (typeof pilotComparisonSlugs)[number]);
}

function uniqueBudgetDestinations(destinations: BudgetDestination[]) {
  const bySlug = new Map<string, BudgetDestination>();

  for (const destination of destinations) {
    const existing = bySlug.get(destination.destination.slug);

    if (!existing || destination.totalEstimate < existing.totalEstimate) {
      bySlug.set(destination.destination.slug, destination);
    }
  }

  return Array.from(bySlug.values()).sort(
    (a, b) => a.totalEstimate - b.totalEstimate || b.destination.score - a.destination.score
  );
}

export function getOriginBudgetStaticParams() {
  return programmaticBudgetPages.map((page) => ({
    origin: page.origin.slug,
    budget: `trips-under-${page.budget}`,
  }));
}

export function getDestinationBudgetStaticParams() {
  return getPilotDestinations().map((destination) => ({ slug: destination.slug }));
}

export function getBudgetAmountStaticParams() {
  return pilotBudgetAmounts.map((amount) => ({ amount: String(amount) }));
}

export function getTripLengthStaticParams() {
  return pilotDurationDays.map((days) => ({ duration: `${days}-days` }));
}
