import { listAnalyticsEvents } from "@/lib/analytics/server-events";
import { formatMoney, getDestinationTripEstimate, type TravelStyle } from "@/lib/data/destinations";
import { cityDestinations, type DestinationContinent } from "@/lib/data/destination-hub";
import { longTailGuides, type LongTailGuide } from "@/lib/data/guides";
import { getCityCountryLabel, getUnifiedDestination } from "@/lib/data/unified-destinations";

export type GuideBadge = "Popular" | "Trending" | "New";
export type GuideSortOption = "most-visited" | "newest" | "destination" | "budget";
export type GuideBudgetLevel = "Budget" | "Mid-range" | "Comfort" | "Flexible";
export type GuideDurationBucket = "5-7 days" | "8-10 days" | "11-14 days" | "15+ days" | "Flexible";

export type GuideHubCard = {
  slug: string;
  href: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
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

const fallbackGuideImages: Record<
  LongTailGuide["category"] | "budgetTarget" | "beach" | "couples" | "family" | "points" | "airport" | "checklist",
  { image: string; imageAlt: string }
> = {
  "Budget planning": {
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1400&q=85",
    imageAlt: "Notebook, calculator, and travel budget planning paperwork on a desk",
  },
  "Destination costs": {
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=85",
    imageAlt: "Scenic travel landscape used for destination cost planning",
  },
  "Flight savings": {
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1400&q=85",
    imageAlt: "Airplane wing above clouds for flight savings planning",
  },
  "Travel rewards": {
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1400&q=85",
    imageAlt: "Credit card and travel documents for rewards trip planning",
  },
  budgetTarget: {
    image: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=1400&q=85",
    imageAlt: "Coins, calculator, and savings notes for budget travel planning",
  },
  beach: {
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=85",
    imageAlt: "Turquoise beach and bright sand for beach destination planning",
  },
  couples: {
    image: "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=1400&q=85",
    imageAlt: "Couple planning a trip together at a table",
  },
  family: {
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=85",
    imageAlt: "Family-friendly outdoor travel scene",
  },
  points: {
    image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=1400&q=85",
    imageAlt: "Payment card and travel booking setup for points planning",
  },
  airport: {
    image: "https://images.unsplash.com/photo-1556388158-158ea5ccacbd?auto=format&fit=crop&w=1400&q=85",
    imageAlt: "Airport terminal with travelers and departure boards",
  },
  checklist: {
    image: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&w=1400&q=85",
    imageAlt: "Travel checklist notebook with pen and planning items",
  },
};

const uniqueGuideImagePool = [
  {
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=85",
    imageAlt: "Open road through a green mountain travel landscape",
  },
  {
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=85",
    imageAlt: "Bright tropical beach with turquoise water",
  },
  {
    image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1400&q=85",
    imageAlt: "Traveler looking at a scenic mountain road from a van",
  },
  {
    image: "https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&w=1400&q=85",
    imageAlt: "Backpacker walking near a mountain lake",
  },
  {
    image: "https://images.unsplash.com/photo-1503220317375-aaad61436b1b?auto=format&fit=crop&w=1400&q=85",
    imageAlt: "Traveler with backpack looking over a city skyline",
  },
  {
    image: "https://images.unsplash.com/photo-1488085061387-422e29b40080?auto=format&fit=crop&w=1400&q=85",
    imageAlt: "Passport, camera, and travel map on a table",
  },
  {
    image: "https://images.unsplash.com/photo-1530789253388-582c481c54b0?auto=format&fit=crop&w=1400&q=85",
    imageAlt: "Travel planning flat lay with map and camera",
  },
  {
    image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1400&q=85",
    imageAlt: "Open travel notebook with map and pen",
  },
  {
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1400&q=85",
    imageAlt: "Airplane wing above clouds",
  },
  {
    image: "https://images.unsplash.com/photo-1556388158-158ea5ccacbd?auto=format&fit=crop&w=1400&q=85",
    imageAlt: "Airport terminal with travelers and departure boards",
  },
  {
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1400&q=85",
    imageAlt: "Travel budget paperwork with calculator",
  },
  {
    image: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=1400&q=85",
    imageAlt: "Coins and calculator for budget planning",
  },
  {
    image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=1400&q=85",
    imageAlt: "Payment card used for travel rewards planning",
  },
  {
    image: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&w=1400&q=85",
    imageAlt: "Checklist notebook and pen for trip planning",
  },
  {
    image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=1400&q=85",
    imageAlt: "Camera and travel accessories on a table",
  },
  {
    image: "https://images.unsplash.com/photo-1499591934245-40b55745b905?auto=format&fit=crop&w=1400&q=85",
    imageAlt: "Mountain road trip landscape at sunset",
  },
  {
    image: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1400&q=85",
    imageAlt: "Traveler overlooking a dramatic valley",
  },
  {
    image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1400&q=85",
    imageAlt: "Lake and mountain landscape for outdoor travel",
  },
  {
    image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1400&q=85",
    imageAlt: "Car driving beside a mountain lake",
  },
  {
    image: "https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=1400&q=85",
    imageAlt: "Travelers walking through a sunny historic square",
  },
  {
    image: "https://images.unsplash.com/photo-1517760444937-f6397edcbbcd?auto=format&fit=crop&w=1400&q=85",
    imageAlt: "Campfire and outdoor travel setup at dusk",
  },
  {
    image: "https://images.unsplash.com/photo-1522199710521-72d69614c702?auto=format&fit=crop&w=1400&q=85",
    imageAlt: "Laptop workspace for digital travel planning",
  },
  {
    image: "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=1400&q=85",
    imageAlt: "Couple planning a trip together",
  },
  {
    image: "https://images.unsplash.com/photo-1504150558240-0b4fd8946624?auto=format&fit=crop&w=1400&q=85",
    imageAlt: "Family walking through a scenic travel destination",
  },
  {
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1400&q=85",
    imageAlt: "Travel couple near a scenic coastal view",
  },
  {
    image: "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1400&q=85",
    imageAlt: "Resort pool and skyline for premium travel planning",
  },
  {
    image: "https://images.unsplash.com/photo-1498307833015-e7b400441eb8?auto=format&fit=crop&w=1400&q=85",
    imageAlt: "Colorful European street scene",
  },
  {
    image: "https://images.unsplash.com/photo-1500835556837-99ac94a94552?auto=format&fit=crop&w=1400&q=85",
    imageAlt: "Traveler at a station checking route options",
  },
  {
    image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1400&q=85",
    imageAlt: "Starry mountain sky above a travel camp",
  },
  {
    image: "https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1400&q=85",
    imageAlt: "Modern city skyline for urban travel planning",
  },
  {
    image: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Wide landscape viewpoint for itinerary planning",
  },
  {
    image: "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?auto=format&fit=crop&w=1400&q=85",
    imageAlt: "Venice canal and historic buildings",
  },
  {
    image: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1400&q=85",
    imageAlt: "Colorful coastal town above blue water",
  },
  {
    image: "https://images.unsplash.com/photo-1518638150340-f706e86654de?auto=format&fit=crop&w=1400&q=85",
    imageAlt: "Colorful Mexican street with bright buildings",
  },
  {
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1400&q=85",
    imageAlt: "Japanese temple beside cherry blossoms",
  },
];

export async function getGuideHubData(): Promise<GuideHubData> {
  const visitCounts = await getVisitCountsBySlug();
  const hasVisitData = visitCounts.hasVisitData;
  const guides = longTailGuides
    .map((guide, index) => toGuideHubCard(guide, index, visitCounts, hasVisitData))
    .toSorted((a, b) => b.viewCount - a.viewCount || Date.parse(b.publishedAt) - Date.parse(a.publishedAt));
  const uniqueImageGuides = ensureUniqueImages(guides);

  return {
    guides: uniqueImageGuides,
    popularGuides: uniqueImageGuides.slice(0, 6),
    alsoViewedGuides: getAlsoViewedGuides(uniqueImageGuides),
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
  const image = getGuideHubImage(guide, destination);
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
    image: image.image,
    imageAlt: image.imageAlt,
    category: guide.category,
    destinationLabel,
    region: getRegion(guide),
    travelStyle: formatTravelStyle(guide.travelStyle),
    durationDays: guide.durationDays,
    durationBucket: getDurationBucket(guide.durationDays),
    ...(budgetEstimate === undefined ? {} : { budgetEstimate }),
    budgetLabel: budgetEstimate ? formatMoney(budgetEstimate, "CAD") : "Flexible budget",
    budgetLevel: getBudgetLevel(budgetEstimate),
    viewCount,
    formattedViews: formatViews(viewCount),
    badge: getGuideBadge(viewCount, publishedAt, index),
    publishedAt,
  };
}

function getGuideHubImage(
  guide: LongTailGuide,
  destination: ReturnType<typeof getUnifiedDestination> | null
) {
  if (destination?.image) {
    return {
      image: destination.image,
      imageAlt: `${destination.name} travel budget guide`,
    };
  }

  if (guide.slug.includes("beach")) {
    return fallbackGuideImages.beach;
  }

  if (guide.slug.includes("couples")) {
    return fallbackGuideImages.couples;
  }

  if (guide.slug.includes("family")) {
    return fallbackGuideImages.family;
  }

  if (guide.slug.includes("points")) {
    return fallbackGuideImages.points;
  }

  if (guide.slug.includes("airport")) {
    return fallbackGuideImages.airport;
  }

  if (guide.slug.includes("checklist")) {
    return fallbackGuideImages.checklist;
  }

  if (guide.budgetTarget) {
    return fallbackGuideImages.budgetTarget;
  }

  return fallbackGuideImages[guide.category];
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
    return "New";
  }

  if (viewCount >= 1600) {
    return "Popular";
  }

  return "Trending";
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

function ensureUniqueImages(guides: GuideHubCard[]) {
  const usedImages = new Set<string>();
  let poolIndex = 0;

  return guides.map((guide) => {
    if (!usedImages.has(guide.image)) {
      usedImages.add(guide.image);
      return guide;
    }

    const replacement = getNextUnusedImage(usedImages, poolIndex);
    poolIndex = replacement.nextIndex;
    usedImages.add(replacement.image.image);

    return {
      ...guide,
      image: replacement.image.image,
      imageAlt: replacement.image.imageAlt,
    };
  });
}

function getNextUnusedImage(usedImages: Set<string>, startIndex: number) {
  for (let offset = 0; offset < uniqueGuideImagePool.length; offset += 1) {
    const index = (startIndex + offset) % uniqueGuideImagePool.length;
    const image = uniqueGuideImagePool[index];

    if (!usedImages.has(image.image)) {
      return {
        image,
        nextIndex: index + 1,
      };
    }
  }

  return {
    image: {
      image: `https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=${1200 + usedImages.size}&q=85`,
      imageAlt: "Unique travel landscape fallback image",
    },
    nextIndex: startIndex,
  };
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
  return `${new Intl.NumberFormat("en-CA").format(value)} views`;
}
