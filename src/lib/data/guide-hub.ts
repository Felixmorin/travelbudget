import { listAnalyticsEvents } from "@/lib/analytics/server-events";
import { formatMoney, getDestinationTripEstimate, type TravelStyle } from "@/lib/data/destinations";
import { cityDestinations, type DestinationContinent } from "@/lib/data/destination-hub";
import { longTailGuides, type LongTailGuide } from "@/lib/data/guides";
import { getCityCountryLabel, getUnifiedDestination } from "@/lib/data/unified-destinations";

export type GuideBadge = "Populaire" | "Tendance" | "Nouveau";
export type GuideSortOption = "most-visited" | "newest" | "destination" | "budget";
export type GuideBudgetLevel = "Budget" | "Mid-range" | "Comfort" | "Flexible";
export type GuideDurationBucket = "5-7 days" | "8-10 days" | "11-14 days" | "15+ days" | "Flexible";

export type GuideHubCard = {
  slug: string;
  href: string;
  title: string;
  description: string;
  category: LongTailGuide["category"];
  destinationLabel: string;
  region: DestinationContinent | "General";
  travelStyle: string;
  durationDays?: number;
  durationBucket: GuideDurationBucket;
  budgetEstimate?: number;
  budgetLabel: string;
  budgetLevel: GuideBudgetLevel;
  viewCount: number;
  formattedViews: string;
  badge: GuideBadge;
  publishedAt: string;
};

export type GuideHubData = {
  guides: GuideHubCard[];
  popularGuides: GuideHubCard[];
  alsoViewedGuides: GuideHubCard[];
  hasVisitData: boolean;
};

const publishedAtBySlug: Record<string, string> = {
  "travel-budget-calculator": "2026-07-07",
  "japan-travel-budget-from-canada": "2026-07-06",
  "japan-10-day-budget-from-canada": "2026-07-05",
  "portugal-trip-cost-from-montreal": "2026-07-04",
  "portugal-two-week-budget-from-montreal": "2026-07-03",
  "best-destinations-under-2500-cad": "2026-07-02",
  "mexico-city-travel-budget": "2026-07-01",
  "cheap-places-to-travel-from-montreal": "2026-06-30",
};

const countryContinentBySlug: Record<string, DestinationContinent> = {
  austria: "Europe",
  cambodia: "Asia",
  colombia: "South America",
  croatia: "Europe",
  france: "Europe",
  greece: "Europe",
  guatemala: "North America",
  indonesia: "Asia",
  ireland: "Europe",
  italy: "Europe",
  japan: "Asia",
  malaysia: "Asia",
  mexico: "North America",
  morocco: "Africa",
  netherlands: "Europe",
  peru: "South America",
  philippines: "Asia",
  portugal: "Europe",
  spain: "Europe",
  thailand: "Asia",
  turkey: "Europe",
  vietnam: "Asia",
};

export async function getGuideHubData(): Promise<GuideHubData> {
  const visitCounts = await getVisitCountsBySlug();
  const hasVisitData = visitCounts.hasVisitData;
  const guides = longTailGuides
    .map((guide, index) => toGuideHubCard(guide, index, visitCounts, hasVisitData))
    .toSorted((a, b) => b.viewCount - a.viewCount || Date.parse(b.publishedAt) - Date.parse(a.publishedAt));

  return {
    guides,
    popularGuides: guides.slice(0, 6),
    alsoViewedGuides: getAlsoViewedGuides(guides),
    hasVisitData,
  };
}

async function getVisitCountsBySlug() {
  const guideViews = new Map<string, number>();
  const destinationViews = new Map<string, number>();

  try {
    const events = await listAnalyticsEvents();

    events.forEach((event) => {
      if (event.eventName === "guide_viewed") {
        const slug = getSlugFromPath(event.pathname ?? String(event.properties.page ?? ""), "/guides/");

        if (slug) {
          guideViews.set(slug, (guideViews.get(slug) ?? 0) + 1);
        }
      }

      if (event.eventName === "destination_viewed") {
        const destinationSlug =
          typeof event.properties.destinationSlug === "string"
            ? event.properties.destinationSlug
            : getSlugFromPath(event.pathname ?? String(event.properties.page ?? ""), "/destinations/");

        if (destinationSlug) {
          destinationViews.set(destinationSlug, (destinationViews.get(destinationSlug) ?? 0) + 1);
        }
      }
    });
  } catch {
    return { guideViews, destinationViews, hasVisitData: false };
  }

  return {
    guideViews,
    destinationViews,
    hasVisitData: guideViews.size > 0 || destinationViews.size > 0,
  };
}

function toGuideHubCard(
  guide: LongTailGuide,
  index: number,
  visitCounts: Awaited<ReturnType<typeof getVisitCountsBySlug>>,
  hasVisitData: boolean
): GuideHubCard {
  const destination = guide.destinationSlug ? getUnifiedDestination(guide.destinationSlug) : null;
  const destinationLabel = destination ? getCityCountryLabel(destination) : guide.originCity ?? "Planning guide";
  const budgetEstimate = getBudgetEstimate(guide);
  const viewCount = hasVisitData
    ? (visitCounts.guideViews.get(guide.slug) ?? 0) + Math.round((visitCounts.destinationViews.get(guide.destinationSlug ?? "") ?? 0) * 0.35)
    : getMockVisitCount(guide, index);
  const publishedAt = publishedAtBySlug[guide.slug] ?? getGeneratedPublishedAt(index);

  return {
    slug: guide.slug,
    href: `/guides/${guide.slug}`,
    title: guide.title,
    description: guide.summary,
    category: guide.category,
    destinationLabel,
    region: getRegion(guide),
    travelStyle: formatTravelStyle(guide.travelStyle),
    durationDays: guide.durationDays,
    durationBucket: getDurationBucket(guide.durationDays),
    budgetEstimate,
    budgetLabel: budgetEstimate ? formatMoney(budgetEstimate, "CAD") : "Flexible budget",
    budgetLevel: getBudgetLevel(budgetEstimate),
    viewCount,
    formattedViews: formatViews(viewCount),
    badge: getGuideBadge(viewCount, publishedAt, index),
    publishedAt,
  };
}

function getBudgetEstimate(guide: LongTailGuide) {
  if (guide.budgetTarget) {
    return guide.budgetTarget;
  }

  if (!guide.destinationSlug) {
    return undefined;
  }

  const destination = getUnifiedDestination(guide.destinationSlug);

  if (!destination) {
    return undefined;
  }

  return getDestinationTripEstimate(destination, {
    days: guide.durationDays,
    originCode: guide.originCode,
    travelStyle: guide.travelStyle,
    travelers: guide.travelers,
  });
}

function getRegion(guide: LongTailGuide): GuideHubCard["region"] {
  if (!guide.destinationSlug) {
    return "General";
  }

  const city = cityDestinations.find((destination) => destination.slug === guide.destinationSlug);

  if (city) {
    return city.continent;
  }

  const countryCity = cityDestinations.find(
    (destination) => destination.country.toLowerCase().replace(/\s+/g, "-") === guide.destinationSlug
  );

  return countryCity?.continent ?? countryContinentBySlug[guide.destinationSlug] ?? "General";
}

function getDurationBucket(durationDays: number | undefined): GuideDurationBucket {
  if (!durationDays) {
    return "Flexible";
  }

  if (durationDays <= 7) {
    return "5-7 days";
  }

  if (durationDays <= 10) {
    return "8-10 days";
  }

  if (durationDays <= 14) {
    return "11-14 days";
  }

  return "15+ days";
}

function getBudgetLevel(amount: number | undefined): GuideBudgetLevel {
  if (!amount) {
    return "Flexible";
  }

  if (amount <= 2200) {
    return "Budget";
  }

  if (amount <= 3200) {
    return "Mid-range";
  }

  return "Comfort";
}

function getGuideBadge(viewCount: number, publishedAt: string, index: number): GuideBadge {
  const daysSincePublished = Math.max(0, (Date.now() - Date.parse(publishedAt)) / 86_400_000);

  if (daysSincePublished <= 7 || index <= 2) {
    return "Nouveau";
  }

  if (viewCount >= 1600) {
    return "Populaire";
  }

  return "Tendance";
}

function getAlsoViewedGuides(guides: GuideHubCard[]) {
  const seen = new Set<string>();

  return guides
    .filter((guide) => {
      if (seen.has(guide.category)) {
        return false;
      }

      seen.add(guide.category);
      return true;
    })
    .slice(0, 4);
}

function getSlugFromPath(path: string, prefix: "/guides/" | "/destinations/") {
  if (!path.startsWith(prefix)) {
    return undefined;
  }

  return path.slice(prefix.length).split(/[/?#]/)[0] || undefined;
}

function getMockVisitCount(guide: LongTailGuide, index: number) {
  const destinationBoost = guide.destinationSlug ? 520 : 180;
  const categoryBoost = guide.category === "Destination costs" ? 360 : guide.category === "Budget planning" ? 260 : 120;
  const budgetBoost = guide.budgetTarget ? 220 : 0;

  return Math.max(140, 1840 - index * 43 + destinationBoost + categoryBoost + budgetBoost);
}

function getGeneratedPublishedAt(index: number) {
  const date = new Date("2026-06-29T00:00:00.000Z");
  date.setUTCDate(date.getUTCDate() - index);

  return date.toISOString().slice(0, 10);
}

function formatTravelStyle(style: TravelStyle | undefined) {
  if (style === "budget") {
    return "Budget";
  }

  if (style === "luxury") {
    return "Luxury";
  }

  return "Mid-range";
}

function formatViews(value: number) {
  return `${new Intl.NumberFormat("fr-CA").format(value)} vues`;
}
