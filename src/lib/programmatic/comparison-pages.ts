import {
  getDestinationCostBreakdown,
  formatMoney,
  getDailyCostTotal,
  getDestinationTripEstimate,
  getFlightEstimate,
  type Destination,
  type TravelStyle,
} from "@/lib/data/destinations";
import { getUnifiedDestination } from "@/lib/data/unified-destinations";
import {
  getMatchingBudgetDestinations,
  getProgrammaticBudgetPage,
  type BudgetDestination,
} from "@/lib/programmatic/budget-pages";

type BaseComparisonPage = {
  slug: string;
  title: string;
  description: string;
  searchIntent: string;
  originCode: string;
  originCity: string;
  durationDays: number;
  travelStyle: TravelStyle;
};

export type DestinationComparisonPage = BaseComparisonPage & {
  kind: "destination-pair";
  destinationSlugs: [string, string];
};

export type CollectionComparisonPage = BaseComparisonPage & {
  kind: "collection";
  sourceOriginSlug: string;
  sourceBudgetSlug: string;
  destinationFilter: "warm" | "europe" | "asia";
};

export type ComparisonPageConfig = DestinationComparisonPage | CollectionComparisonPage;

export type DestinationComparisonItem = {
  destination: Destination;
  totalEstimate: number;
  flightEstimate: number;
  dailyEstimate: number;
  costBreakdown: ReturnType<typeof getDestinationCostBreakdown>;
  bestFor: string;
  tradeoff: string;
};

export type ComparisonTableRow = {
  criterion: string;
  destinationA: string;
  destinationB: string;
  winner: string;
};

export const comparisonPages: ComparisonPageConfig[] = [
  {
    kind: "destination-pair",
    slug: "portugal-vs-spain",
    title: "Portugal vs Spain Travel Budget",
    description:
      "Compare Portugal and Spain travel budgets with estimated flights from Montreal, daily costs, trip length assumptions, seasons, and value tradeoffs.",
    searchIntent: "Portugal vs Spain travel budget",
    originCode: "YUL",
    originCity: "Montreal",
    durationDays: 10,
    travelStyle: "midRange",
    destinationSlugs: ["portugal", "spain"],
  },
  {
    kind: "destination-pair",
    slug: "japan-vs-south-korea",
    title: "Japan vs South Korea Travel Cost",
    description:
      "Compare Japan and South Korea travel costs for a 10-day CAD trip from Montreal, including flights, daily budgets, best months, and practical cost tradeoffs.",
    searchIntent: "Japan vs South Korea travel cost",
    originCode: "YUL",
    originCity: "Montreal",
    durationDays: 10,
    travelStyle: "midRange",
    destinationSlugs: ["japan", "south-korea"],
  },
  {
    kind: "destination-pair",
    slug: "mexico-vs-colombia",
    title: "Mexico vs Colombia Travel Budget",
    description:
      "Compare Mexico and Colombia trip costs from Montreal with estimated flights, daily costs, warm-weather timing, and best-fit travel styles.",
    searchIntent: "Mexico vs Colombia travel budget",
    originCode: "YUL",
    originCity: "Montreal",
    durationDays: 10,
    travelStyle: "midRange",
    destinationSlugs: ["mexico", "colombia"],
  },
  {
    kind: "destination-pair",
    slug: "france-vs-italy",
    title: "France vs Italy Travel Budget",
    description:
      "Compare France and Italy travel budgets in CAD for a 10-day trip from Montreal, including flights, daily cost pressure, best months, and value differences.",
    searchIntent: "France vs Italy travel budget",
    originCode: "YUL",
    originCity: "Montreal",
    durationDays: 10,
    travelStyle: "midRange",
    destinationSlugs: ["france", "italy"],
  },
  {
    kind: "destination-pair",
    slug: "thailand-vs-vietnam",
    title: "Thailand vs Vietnam Travel Budget",
    description:
      "Compare Thailand and Vietnam travel budgets for a 14-day CAD trip from Montreal, with flight estimates, lower-cost daily spending, trip assumptions, and traveler-fit notes.",
    searchIntent: "Thailand vs Vietnam travel budget",
    originCode: "YUL",
    originCity: "Montreal",
    durationDays: 14,
    travelStyle: "midRange",
    destinationSlugs: ["thailand", "vietnam"],
  },
  {
    kind: "destination-pair",
    slug: "paris-vs-lisbon",
    title: "Paris vs Lisbon Travel Cost",
    description:
      "Compare Paris and Lisbon travel costs, including flights from Montreal, daily costs, trip length, and value tradeoffs.",
    searchIntent: "Paris vs Lisbon travel cost",
    originCode: "YUL",
    originCity: "Montreal",
    durationDays: 10,
    travelStyle: "midRange",
    destinationSlugs: ["paris", "lisbon"],
  },
  {
    kind: "destination-pair",
    slug: "paris-vs-lisbon-from-montreal",
    title: "Paris vs Lisbon from Montreal",
    description:
      "Compare a Paris trip and Lisbon trip from Montreal with estimated flights, hotels, food, local transport, activities, and buffer.",
    searchIntent: "Paris vs Lisbon from Montreal",
    originCode: "YUL",
    originCity: "Montreal",
    durationDays: 10,
    travelStyle: "midRange",
    destinationSlugs: ["paris", "lisbon"],
  },
  {
    kind: "destination-pair",
    slug: "tokyo-vs-seoul-from-vancouver",
    title: "Tokyo vs Seoul from Vancouver",
    description:
      "Compare Tokyo and Seoul travel costs from Vancouver with flight estimates, daily budgets, seasons, and best-fit traveler notes.",
    searchIntent: "Tokyo vs Seoul from Vancouver",
    originCode: "YVR",
    originCity: "Vancouver",
    durationDays: 10,
    travelStyle: "midRange",
    destinationSlugs: ["tokyo", "seoul"],
  },
  {
    kind: "destination-pair",
    slug: "paris-vs-lisbon-for-7-days",
    title: "Paris vs Lisbon for 7 Days",
    description:
      "Compare a 7-day Paris trip against a 7-day Lisbon trip, including flights, accommodation, food, transport, and activities.",
    searchIntent: "Paris vs Lisbon for 7 days",
    originCode: "YUL",
    originCity: "Montreal",
    durationDays: 7,
    travelStyle: "midRange",
    destinationSlugs: ["paris", "lisbon"],
  },
  {
    kind: "destination-pair",
    slug: "portugal-vs-spain-travel-budget",
    title: "Portugal vs Spain Travel Budget",
    description:
      "Compare Portugal and Spain travel budgets, including flights from Montreal, daily costs, seasons, and which trip is better value.",
    searchIntent: "Portugal vs Spain travel budget",
    originCode: "YUL",
    originCity: "Montreal",
    durationDays: 10,
    travelStyle: "midRange",
    destinationSlugs: ["portugal", "spain"],
  },
  {
    kind: "destination-pair",
    slug: "japan-vs-south-korea-travel-cost",
    title: "Japan vs South Korea Travel Cost",
    description:
      "Compare Japan and South Korea travel costs for a 10-day trip, with flight estimates, daily budgets, timing, and value tradeoffs.",
    searchIntent: "Japan vs South Korea travel cost",
    originCode: "YUL",
    originCity: "Montreal",
    durationDays: 10,
    travelStyle: "midRange",
    destinationSlugs: ["japan", "south-korea"],
  },
  {
    kind: "destination-pair",
    slug: "mexico-vs-colombia-from-montreal",
    title: "Mexico vs Colombia from Montreal",
    description:
      "Compare Mexico and Colombia trip costs from Montreal, including flights, local daily costs, warm-weather timing, and best-fit traveler styles.",
    searchIntent: "Mexico vs Colombia from Montreal",
    originCode: "YUL",
    originCity: "Montreal",
    durationDays: 10,
    travelStyle: "midRange",
    destinationSlugs: ["mexico", "colombia"],
  },
  {
    kind: "collection",
    slug: "best-warm-destinations-from-toronto-under-2500",
    title: "Best Warm Destinations from Toronto Under $2,500",
    description:
      "Find warm destinations from Toronto under $2,500 CAD with realistic flight estimates, daily costs, and budget tradeoffs.",
    searchIntent: "Best warm destinations from Toronto under $2500",
    originCode: "YYZ",
    originCity: "Toronto",
    durationDays: 10,
    travelStyle: "midRange",
    sourceOriginSlug: "toronto",
    sourceBudgetSlug: "under-2500",
    destinationFilter: "warm",
  },
  {
    kind: "collection",
    slug: "best-europe-trips-from-toronto-under-3000",
    title: "Best Europe Trips from Toronto Under $3,000",
    description:
      "Compare Europe trips from Toronto under $3,000 CAD with estimated flights, daily costs, timing notes, and budget tradeoffs.",
    searchIntent: "Best Europe trips from Toronto under $3000",
    originCode: "YYZ",
    originCity: "Toronto",
    durationDays: 10,
    travelStyle: "midRange",
    sourceOriginSlug: "toronto",
    sourceBudgetSlug: "under-3000",
    destinationFilter: "europe",
  },
  {
    kind: "collection",
    slug: "best-asia-trips-from-vancouver-under-3500",
    title: "Best Asia Trips from Vancouver Under $3,500",
    description:
      "Find Asia trips from Vancouver under $3,500 CAD with flight estimates, daily budgets, best-fit traveler styles, and cost-saving tradeoffs.",
    searchIntent: "Best Asia trips from Vancouver under $3500",
    originCode: "YVR",
    originCity: "Vancouver",
    durationDays: 10,
    travelStyle: "midRange",
    sourceOriginSlug: "vancouver",
    sourceBudgetSlug: "under-3500",
    destinationFilter: "asia",
  },
];

const pilotComparisonSlugs = [
  "portugal-vs-spain",
  "japan-vs-south-korea",
  "mexico-vs-colombia",
  "france-vs-italy",
  "thailand-vs-vietnam",
  "best-europe-trips-from-toronto-under-3000",
];

export function getComparisonPage(slug: string) {
  return comparisonPages.find((page) => page.slug === slug);
}

export function getComparisonPath(pageOrSlug: ComparisonPageConfig | string) {
  const slug = typeof pageOrSlug === "string" ? pageOrSlug : pageOrSlug.slug;
  return `/compare/${slug}`;
}

export function getComparisonSeoTitle(page: ComparisonPageConfig) {
  if (page.kind === "collection") {
    return page.title.replace("Best ", "Affordable ");
  }

  const [destinationA, destinationB] = page.destinationSlugs
    .map((slug) => getUnifiedDestination(slug)?.name)
    .filter((name): name is string => Boolean(name));

  const baseTitle = `${destinationA} vs ${destinationB}`;

  if (page.slug.includes("from-")) {
    return `${baseTitle}: Travel Cost Comparison from ${page.originCity}`;
  }

  if (page.durationDays !== 10) {
    return `${baseTitle}: ${page.durationDays}-Day Travel Cost Comparison`;
  }

  return `${baseTitle}: Travel Cost Comparison`;
}

export function getComparisonStaticParams() {
  return comparisonPages
    .filter((page) => pilotComparisonSlugs.includes(page.slug))
    .map((page) => ({ comparison: page.slug }));
}

export function getComparisonItems(page: ComparisonPageConfig): DestinationComparisonItem[] {
  if (page.kind === "collection") {
    const budgetPage = getProgrammaticBudgetPage(page.sourceOriginSlug, page.sourceBudgetSlug);

    if (!budgetPage) {
      return [];
    }

    return getMatchingBudgetDestinations(budgetPage)
      .filter((item) => matchesCollectionFilter(item, page.destinationFilter))
      .slice(0, 6)
      .map((item) => ({
        destination: item.destination,
        totalEstimate: item.totalEstimate,
        flightEstimate: item.flightEstimate,
        dailyEstimate: item.dailyEstimate,
        costBreakdown: item.costBreakdown,
        bestFor: getBestFor(item.destination),
        tradeoff: getTradeoff(item.destination, page.originCode),
      }));
  }

  return page.destinationSlugs
    .map((slug) => getUnifiedDestination(slug))
    .filter((destination): destination is Destination => Boolean(destination))
    .map((destination) => {
      const totalEstimate = getDestinationTripEstimate(destination, {
        days: page.durationDays,
        originCode: page.originCode,
        travelStyle: page.travelStyle,
      });

      return {
        destination,
        totalEstimate,
        flightEstimate: getFlightEstimate(destination, page.originCode).average,
        dailyEstimate: getDailyCostTotal(destination, page.travelStyle),
        costBreakdown: getDestinationCostBreakdown(destination, {
          days: page.durationDays,
          originCode: page.originCode,
          travelStyle: page.travelStyle,
        }),
        bestFor: getBestFor(destination),
        tradeoff: getTradeoff(destination, page.originCode),
      };
    });
}

export function getPrimaryComparisonItems(items: DestinationComparisonItem[]) {
  return items.slice(0, 2);
}

export function getComparisonVerdict(page: ComparisonPageConfig, items: DestinationComparisonItem[]) {
  const override = editorialVerdictOverrides[page.slug];

  if (override) {
    return override;
  }

  const [destinationA, destinationB] = getPrimaryComparisonItems(items);

  if (!destinationA || !destinationB) {
    return "Use the estimate, route options, and live prices together before choosing a destination.";
  }

  return `Choose ${destinationA.destination.name} if you want ${getVerdictBenefit(
    destinationA,
    items
  )}. Choose ${destinationB.destination.name} if you want ${getVerdictBenefit(destinationB, items)}, but expect ${formatTradeoff(
    destinationB.tradeoff
  )}.`;
}

export function getComparisonTableRows(items: DestinationComparisonItem[]): ComparisonTableRow[] {
  const [destinationA, destinationB] = getPrimaryComparisonItems(items);

  if (!destinationA || !destinationB) {
    return [];
  }

  return [
    {
      criterion: "Flights",
      destinationA: formatEstimate(destinationA.flightEstimate),
      destinationB: formatEstimate(destinationB.flightEstimate),
      winner: getLowerCostWinner(destinationA, destinationB, (item) => item.flightEstimate),
    },
    {
      criterion: "Accommodation",
      destinationA: formatBreakdownEstimate(destinationA.costBreakdown.accommodation),
      destinationB: formatBreakdownEstimate(destinationB.costBreakdown.accommodation),
      winner: getLowerCostWinner(destinationA, destinationB, (item) => item.costBreakdown.accommodation),
    },
    {
      criterion: "Food",
      destinationA: formatBreakdownEstimate(destinationA.costBreakdown.food),
      destinationB: formatBreakdownEstimate(destinationB.costBreakdown.food),
      winner: getLowerCostWinner(destinationA, destinationB, (item) => item.costBreakdown.food),
    },
    {
      criterion: "Transport",
      destinationA: formatBreakdownEstimate(destinationA.costBreakdown.localTransport),
      destinationB: formatBreakdownEstimate(destinationB.costBreakdown.localTransport),
      winner: getLowerCostWinner(destinationA, destinationB, (item) => item.costBreakdown.localTransport),
    },
    {
      criterion: "Activities",
      destinationA: formatBreakdownEstimate(destinationA.costBreakdown.activities),
      destinationB: formatBreakdownEstimate(destinationB.costBreakdown.activities),
      winner: getLowerCostWinner(destinationA, destinationB, (item) => item.costBreakdown.activities),
    },
    {
      criterion: "Daily cost",
      destinationA: `${formatEstimate(destinationA.dailyEstimate)} per day`,
      destinationB: `${formatEstimate(destinationB.dailyEstimate)} per day`,
      winner: getLowerCostWinner(destinationA, destinationB, (item) => item.dailyEstimate),
    },
    {
      criterion: "Total cost",
      destinationA: formatEstimate(destinationA.totalEstimate),
      destinationB: formatEstimate(destinationB.totalEstimate),
      winner: getLowerCostWinner(destinationA, destinationB, (item) => item.totalEstimate),
    },
    {
      criterion: "Best for",
      destinationA: destinationA.bestFor,
      destinationB: destinationB.bestFor,
      winner: "Depends on trip style",
    },
    {
      criterion: "Winner / Verdict",
      destinationA: destinationA.tradeoff,
      destinationB: destinationB.tradeoff,
      winner: getLowerCostWinner(destinationA, destinationB, (item) => item.totalEstimate),
    },
  ];
}

export function getComparisonSummary(page: ComparisonPageConfig, items: DestinationComparisonItem[]) {
  if (items.length === 0) {
    return "No matching destinations are available for this comparison yet.";
  }

  const cheapest = [...items].sort((a, b) => a.totalEstimate - b.totalEstimate)[0];
  const strongestScore = [...items].sort((a, b) => b.destination.score - a.destination.score)[0];

  if (page.kind === "collection") {
    return `${cheapest.destination.name} has the lowest matching estimate at ${formatMoney(
      cheapest.totalEstimate,
      "CAD"
    )}, while ${strongestScore.destination.name} has the strongest destination score in this ${formatCollectionLabel(
      page.destinationFilter
    )} set.`;
  }

  return `${cheapest.destination.name} is lower on the ${page.durationDays}-day estimate at ${formatMoney(
    cheapest.totalEstimate,
    "CAD"
  )}. ${strongestScore.destination.name} has the stronger destination score at ${strongestScore.destination.score}/100.`;
}

function formatCollectionLabel(filter: CollectionComparisonPage["destinationFilter"]) {
  if (filter === "europe") {
    return "Europe";
  }

  if (filter === "asia") {
    return "Asia";
  }

  return "warm-weather";
}

const editorialVerdictOverrides: Record<string, string> = {
  "portugal-vs-spain":
    "Choose Portugal if you want a lower total trip cost and a slower first-time Europe trip. Choose Spain if you want bigger cities, more route options, and stronger nightlife, but expect higher hotel pressure in peak months.",
  "japan-vs-south-korea":
    "Choose Japan if you want the broader classic culture-and-food trip with more regional variety. Choose South Korea if you want a tighter city-first itinerary and easier budget control, but expect fewer route options outside the Seoul anchor.",
  "mexico-vs-colombia":
    "Choose Mexico if you want easier flight access from Canada, food depth, and flexible beach or city routes. Choose Colombia if you want lower daily costs and a South America feel, but expect flight timing to matter more.",
  "france-vs-italy":
    "Choose France if you want Paris, regional rail options, and a polished city-and-culture trip. Choose Italy if you want stronger food-and-history density across one route, but expect popular cities to push hotels higher in peak months.",
  "thailand-vs-vietnam":
    "Choose Thailand if you want easier beach logistics, nightlife, and a classic first Southeast Asia route. Choose Vietnam if you want lower daily costs and more budget stretch, but expect the long-haul flight to stay the main cost hurdle.",
  "best-europe-trips-from-toronto-under-3000":
    "Choose the lowest-estimate Europe option if budget certainty matters most. Choose the higher-scoring destination if the itinerary fit is stronger, but expect live hotel prices and peak-season flights to decide the final value.",
};

function getVerdictBenefit(item: DestinationComparisonItem, items: DestinationComparisonItem[]) {
  const cheapest = [...items].sort((a, b) => a.totalEstimate - b.totalEstimate)[0];
  const strongestScore = [...items].sort((a, b) => b.destination.score - a.destination.score)[0];

  if (item.destination.slug === cheapest.destination.slug) {
    return "the lower total trip estimate and easier budget control";
  }

  if (item.destination.slug === strongestScore.destination.slug) {
    return `a stronger destination score and ${item.bestFor}`;
  }

  return item.bestFor;
}

function formatTradeoff(tradeoff: string) {
  return tradeoff.replace(/\.$/, "").toLowerCase();
}

function formatEstimate(value: number) {
  return value > 0 ? formatMoney(value, "CAD") : "Use live prices before booking";
}

function formatBreakdownEstimate(value: number) {
  return value > 0 ? `${formatMoney(value, "CAD")} total` : "Estimate included in daily cost";
}

function getLowerCostWinner(
  destinationA: DestinationComparisonItem,
  destinationB: DestinationComparisonItem,
  getValue: (item: DestinationComparisonItem) => number
) {
  const valueA = getValue(destinationA);
  const valueB = getValue(destinationB);

  if (valueA <= 0 || valueB <= 0) {
    return "Use live prices";
  }

  if (valueA === valueB) {
    return "Tie";
  }

  return valueA < valueB ? destinationA.destination.name : destinationB.destination.name;
}

function matchesCollectionFilter(item: BudgetDestination, filter: CollectionComparisonPage["destinationFilter"]) {
  if (filter === "europe") {
    return item.destination.countryName
      ? isEuropeanDestination(item.destination.countryName)
      : isEuropeanDestination(item.destination.name);
  }

  if (filter === "asia") {
    return item.destination.countryName
      ? isAsianDestination(item.destination.countryName)
      : isAsianDestination(item.destination.name);
  }

  const haystack = [
    item.destination.weather,
    item.destination.shortDescription,
    ...item.destination.travelStyles,
    ...item.destination.bestMonths,
  ]
    .join(" ")
    .toLowerCase();

  return /warm|beach|coast|island|caribbean|tropical|sunny|january|february|march|december/.test(haystack);
}

function isEuropeanDestination(name: string) {
  return /portugal|spain|france|italy|greece|turkey|hungary|czechia|prague|lisbon|porto|paris|rome|athens|budapest|istanbul|barcelona/i.test(
    name
  );
}

function isAsianDestination(name: string) {
  return /japan|south korea|thailand|indonesia|taiwan|tokyo|osaka|kyoto|seoul|bangkok|bali|taipei/i.test(
    name
  );
}

function getBestFor(destination: Destination) {
  const primaryStyles = destination.travelStyles.slice(0, 2).join(" and ").toLowerCase();
  return primaryStyles ? `${primaryStyles} trips` : "value-focused trips";
}

function getTradeoff(destination: Destination, originCode: string) {
  const flight = getFlightEstimate(destination, originCode).average;
  const dailyCost = getDailyCostTotal(destination, "midRange");

  if (flight >= 950 && dailyCost <= 140) {
    return "Higher airfare can be offset by lower local costs on a longer stay.";
  }

  if (dailyCost >= 180) {
    return "Daily costs need tighter control, especially accommodation and activities.";
  }

  return "The main swing factor is timing flights and avoiding peak accommodation weeks.";
}
