import {
  getDestinationCostBreakdown,
  getDestinationTripEstimate,
  normalizeOriginCode,
  type Destination,
  type TravelStyle,
} from "@/lib/data/destinations";
import { getUnifiedDestination } from "@/lib/data/unified-destinations";
import { programmaticOrigins, type ProgrammaticOrigin } from "@/lib/programmatic/budget-pages";
import type { FAQItem } from "@/lib/seo/schema";

export type StrongSeoPageKind = "origin-destination" | "destination-budget" | "itinerary";

export type StrongSeoPageConfig = {
  kind: StrongSeoPageKind;
  slug: string;
  path: string;
  title: string;
  metaDescription: string;
  h1: string;
  primaryKeyword: string;
  destinationSlug: string;
  originSlug: string;
  durationDays: number;
  travelStyle: TravelStyle;
  travelers: number;
  intro: string;
  bestFor: string[];
  whenToGo: string;
  lowerCostTips: string[];
  includes: string[];
  assumptions: string;
  faq: FAQItem[];
  pinterest: {
    title: string;
    description: string;
    altText: string;
    tags: string[];
  };
};

export type StrongSeoPage = StrongSeoPageConfig & {
  destination: Destination;
  origin: ProgrammaticOrigin;
  estimate: StrongSeoEstimate;
  relatedPages: StrongSeoPageConfig[];
};

export type StrongSeoEstimate = {
  total: number;
  breakdown: {
    flight: number;
    hotel: number;
    food: number;
    localTransport: number;
    activities: number;
    buffer: number;
  };
};

export const strongSeoPages = [
  {
    kind: "origin-destination",
    slug: "from-montreal-to-mexico-city",
    path: "/budget-travel/from-montreal-to-mexico-city",
    title: "How Much Does a Trip to Mexico City Cost from Montreal?",
    metaDescription:
      "Estimate a Mexico City trip budget from Montreal in CAD, including flights, hotels, food, local transport, activities, timing tips, and ways to lower the cost.",
    h1: "How much does a trip to Mexico City cost from Montreal?",
    primaryKeyword: "how much does a trip to Mexico City cost from Montreal",
    destinationSlug: "mexico-city",
    originSlug: "montreal",
    durationDays: 7,
    travelStyle: "midRange",
    travelers: 1,
    intro:
      "A realistic 7-day Mexico City trip from Montreal can work well for travelers who want strong food, museums, and neighborhood exploring without a luxury hotel budget.",
    bestFor: ["Food-focused city travelers", "Museum and culture trips", "Couples or solo travelers who prefer walkable neighborhoods"],
    whenToGo:
      "February, March, October, and November are useful planning windows because weather is comfortable and prices can be easier to manage than major holiday periods.",
    lowerCostTips: [
      "Compare departures across several weekdays before locking flights from YUL.",
      "Stay near Roma, Condesa, Centro, or a metro corridor to reduce ride-hailing costs.",
      "Mix paid museums with markets, parks, and free neighborhood walks.",
    ],
    includes: ["Round-trip flight estimate from Montreal", "Mid-range hotel baseline", "Meals, transit, activities, and a planning buffer"],
    assumptions:
      "This estimate uses one traveler, 7 days, mid-range comfort, and CAD planning amounts. Actual prices vary by season, dates, comfort level, exchange rates, and availability.",
    faq: [
      {
        question: "Is Mexico City cheaper than many European city trips from Montreal?",
        answer:
          "Often, yes. Flights are usually a smaller hurdle than long-haul Europe or Asia, and local food and transit costs can be easier to control.",
      },
      {
        question: "Does this Mexico City estimate include flights?",
        answer:
          "Yes. It includes an estimated round-trip flight from Montreal plus hotel, food, local transport, activities, and a buffer.",
      },
      {
        question: "Can I do Mexico City from Montreal on a tighter budget?",
        answer:
          "Yes, if you choose simpler lodging, use public transit, limit paid tours, and travel outside peak holiday weeks.",
      },
    ],
    pinterest: {
      title: "Mexico City Trip Cost from Montreal",
      description: "A realistic CAD budget for flights, hotels, food, transit, and activities in Mexico City.",
      altText: "Mexico City travel budget guide from Montreal with estimated CAD cost breakdown",
      tags: ["Mexico City budget", "Montreal travel", "CAD travel budget", "budget city break", "Mexico travel"],
    },
  },
  {
    kind: "origin-destination",
    slug: "from-toronto-to-lisbon",
    path: "/budget-travel/from-toronto-to-lisbon",
    title: "How Much Does a Trip to Lisbon Cost from Toronto?",
    metaDescription:
      "Plan a Lisbon trip from Toronto with CAD estimates for flights, accommodation, food, local transport, activities, buffers, and shoulder-season savings.",
    h1: "How much does a trip to Lisbon cost from Toronto?",
    primaryKeyword: "how much does a trip to Lisbon cost from Toronto",
    destinationSlug: "lisbon",
    originSlug: "toronto",
    durationDays: 7,
    travelStyle: "midRange",
    travelers: 1,
    intro:
      "Lisbon is a strong Europe value candidate from Toronto when flights are booked early and the trip avoids the most crowded summer weeks.",
    bestFor: ["First-time Europe travelers", "Food and viewpoint itineraries", "Travelers who want a compact city with day trips"],
    whenToGo:
      "May, June, September, and October usually balance weather and value better than July and August.",
    lowerCostTips: [
      "Compare Toronto flight dates before and after weekends.",
      "Book stays near transit instead of paying for the most central hilltop areas.",
      "Use day passes, casual restaurants, bakeries, and markets to keep daily costs steady.",
    ],
    includes: ["Round-trip flight estimate from Toronto", "7 nights of mid-range accommodation", "Meals, transit, activities, and buffer"],
    assumptions:
      "This is a CAD planning estimate for one traveler. Prices can move meaningfully with season, exact dates, neighborhood, comfort level, and availability.",
    faq: [
      {
        question: "Is Lisbon a good budget Europe destination from Toronto?",
        answer:
          "Lisbon can be good value compared with many Western Europe capitals, especially in shoulder season and with modest hotel expectations.",
      },
      {
        question: "What is the biggest Lisbon budget swing factor?",
        answer:
          "Accommodation timing is usually the biggest swing factor after flights, especially around summer and major event periods.",
      },
      {
        question: "Should I add Porto to this Lisbon budget?",
        answer:
          "You can, but add train costs and avoid splitting too few nights across too many hotels if the goal is to keep the budget controlled.",
      },
    ],
    pinterest: {
      title: "Lisbon Trip Budget from Toronto",
      description: "CAD cost estimate for a Lisbon trip from Toronto, with practical ways to save.",
      altText: "Lisbon Portugal budget travel guide from Toronto with cost breakdown in CAD",
      tags: ["Lisbon budget", "Toronto travel", "Portugal trip", "Europe on a budget", "CAD travel"],
    },
  },
  {
    kind: "origin-destination",
    slug: "from-vancouver-to-tokyo",
    path: "/budget-travel/from-vancouver-to-tokyo",
    title: "How Much Does a Trip to Tokyo Cost from Vancouver?",
    metaDescription:
      "Estimate a Tokyo trip from Vancouver in CAD, including flights, hotels, food, transit, activities, buffers, best months, and cost-saving tips.",
    h1: "How much does a trip to Tokyo cost from Vancouver?",
    primaryKeyword: "how much does a trip to Tokyo cost from Vancouver",
    destinationSlug: "tokyo",
    originSlug: "vancouver",
    durationDays: 10,
    travelStyle: "midRange",
    travelers: 1,
    intro:
      "Tokyo needs a larger budget than many short-haul trips, but Vancouver can be a practical departure point when airfare is reasonable and daily spending is planned carefully.",
    bestFor: ["Food and transit-focused travelers", "First-time Japan itineraries", "Travelers comfortable with compact hotel rooms"],
    whenToGo:
      "March, April, October, and November are popular, but prices can rise around cherry blossom and fall foliage weeks. Look just outside the highest-demand dates.",
    lowerCostTips: [
      "Watch Vancouver fare sales and compare Tokyo airport options when available.",
      "Use transit passes selectively instead of assuming every pass saves money.",
      "Choose business hotels or compact rooms near rail lines.",
    ],
    includes: ["Round-trip flight estimate from Vancouver", "10 days of mid-range Tokyo costs", "Food, local transit, activities, and buffer"],
    assumptions:
      "This estimate is for one traveler in CAD. Tokyo prices vary by season, dates, hotel size, neighborhood, exchange rates, and availability.",
    faq: [
      {
        question: "Is 10 days a realistic Tokyo budget length from Vancouver?",
        answer:
          "Yes. Ten days helps spread the long-haul flight cost while giving enough time for Tokyo neighborhoods and nearby day trips.",
      },
      {
        question: "Can food be affordable in Tokyo?",
        answer:
          "Yes. Convenience stores, ramen shops, casual chains, department-store food halls, and lunch sets can keep food costs controlled.",
      },
      {
        question: "What should I book first for Tokyo?",
        answer:
          "Flights and accommodation usually matter most. Once those are set, daily food and transit can be adjusted more easily.",
      },
    ],
    pinterest: {
      title: "Tokyo Trip Cost from Vancouver",
      description: "A 10-day Tokyo budget guide in CAD for flights, hotels, food, transit, and activities.",
      altText: "Tokyo travel budget from Vancouver with estimated CAD cost categories",
      tags: ["Tokyo budget", "Vancouver travel", "Japan trip cost", "CAD budget", "Asia travel"],
    },
  },
  {
    kind: "origin-destination",
    slug: "from-ottawa-to-cancun",
    path: "/budget-travel/from-ottawa-to-cancun",
    title: "How Much Does a Trip to Cancun Cost from Ottawa?",
    metaDescription:
      "Estimate a Cancun trip from Ottawa in CAD with flight, hotel, food, transport, activity and buffer costs, plus timing and saving tips.",
    h1: "How much does a trip to Cancun cost from Ottawa?",
    primaryKeyword: "how much does a trip to Cancun cost from Ottawa",
    destinationSlug: "cancun",
    originSlug: "ottawa",
    durationDays: 7,
    travelStyle: "midRange",
    travelers: 1,
    intro:
      "Cancun is a practical warm-weather trip from Ottawa, but the final budget depends heavily on hotel style, package availability, and winter demand.",
    bestFor: ["Warm winter escapes", "Beach and family trips", "Travelers comparing hotel and package options"],
    whenToGo:
      "January to March and November are attractive weather windows, but prices can rise during school breaks and holidays. Flexible dates matter.",
    lowerCostTips: [
      "Compare Ottawa departures with Montreal departures if the transfer is reasonable.",
      "Avoid peak school-break weeks when possible.",
      "Price hotels and flight-plus-hotel packages separately before booking.",
    ],
    includes: ["Round-trip flight estimate from Ottawa", "Beach-area hotel planning estimate", "Meals, local movement, activities, and buffer"],
    assumptions:
      "This CAD estimate uses one traveler and mid-range comfort. Resort level, board basis, season, dates, and availability can change the real total.",
    faq: [
      {
        question: "Is Cancun affordable from Ottawa?",
        answer:
          "It can be, especially when flights and hotels are booked outside peak school-break periods and resort expectations are realistic.",
      },
      {
        question: "Does this estimate assume an all-inclusive resort?",
        answer:
          "No. It uses a general mid-range travel budget. All-inclusive packages can be higher or lower depending on dates and inclusions.",
      },
      {
        question: "Should I compare Montreal flights too?",
        answer:
          "For some Ottawa travelers, yes. Montreal can sometimes improve flight choice, but transfer time and cost should be included.",
      },
    ],
    pinterest: {
      title: "Cancun Budget from Ottawa",
      description: "Estimate the CAD cost of a Cancun beach trip from Ottawa with practical saving tips.",
      altText: "Cancun beach trip budget from Ottawa with flights hotels and activities in CAD",
      tags: ["Cancun budget", "Ottawa travel", "beach trip cost", "CAD travel budget", "Mexico vacation"],
    },
  },
  {
    kind: "destination-budget",
    slug: "mexico-city-travel-budget",
    path: "/destinations/mexico-city/travel-budget",
    title: "Mexico City Travel Budget: Flights, Hotels, Food and Activities",
    metaDescription:
      "See a practical Mexico City travel budget in CAD, with estimated flights, hotels, food, local transport, activities, buffers, timing, and FAQs.",
    h1: "Mexico City travel budget: flights, hotels, food and activities",
    primaryKeyword: "Mexico City travel budget",
    destinationSlug: "mexico-city",
    originSlug: "montreal",
    durationDays: 7,
    travelStyle: "midRange",
    travelers: 1,
    intro:
      "Mexico City is one of the stronger urban value picks in the dataset because food, transit, museums, and neighborhood exploring can fit many budget levels.",
    bestFor: ["Food travelers", "Culture-heavy city breaks", "Travelers who want strong value without staying beachside"],
    whenToGo:
      "February, March, October, and November are useful months to compare because the weather is generally comfortable and demand can be less intense than holiday weeks.",
    lowerCostTips: [
      "Use the metro and metrobús for longer hops when practical.",
      "Balance headline museums with parks, markets, and self-guided walks.",
      "Book accommodation early in popular neighborhoods to avoid last-minute rate jumps.",
    ],
    includes: ["Flight estimate from Montreal by default", "Hotel, food, transit, activity, and buffer estimates", "One-traveler CAD planning assumptions"],
    assumptions:
      "This budget uses Montreal as the default origin and mid-range comfort. Prices vary by departure city, season, dates, comfort level, exchange rates, and availability.",
    faq: [
      {
        question: "How much should I budget per day in Mexico City?",
        answer:
          "The daily portion depends on hotel choice and food style. This page uses a mid-range baseline and separates flights from daily costs.",
      },
      {
        question: "Is Mexico City good for budget travelers?",
        answer:
          "Yes. It offers many affordable food, transit, museum, and neighborhood options, though premium hotels and private tours can raise the total quickly.",
      },
      {
        question: "What is not included in this Mexico City budget?",
        answer:
          "It does not include travel insurance, checked-bag fees, passport costs, shopping, premium nightlife, or live fare guarantees.",
      },
    ],
    pinterest: {
      title: "Mexico City Travel Budget Guide",
      description: "Flights, hotels, food, transit, activities, and realistic CAD planning assumptions for Mexico City.",
      altText: "Mexico City travel budget guide with CAD estimates for food hotels flights and activities",
      tags: ["Mexico City travel budget", "budget Mexico", "city trip budget", "CAD travel", "food travel"],
    },
  },
  {
    kind: "destination-budget",
    slug: "lisbon-travel-budget",
    path: "/destinations/lisbon/travel-budget",
    title: "Lisbon Travel Budget: Flights, Hotels, Food and Activities",
    metaDescription:
      "Plan a Lisbon travel budget in CAD with estimated flights, hotels, meals, transit, activities, buffer, best months, saving tips, and FAQs.",
    h1: "Lisbon travel budget: flights, hotels, food and activities",
    primaryKeyword: "Lisbon travel budget",
    destinationSlug: "lisbon",
    originSlug: "montreal",
    durationDays: 7,
    travelStyle: "midRange",
    travelers: 1,
    intro:
      "Lisbon can be a strong-value Europe trip when you control accommodation, travel outside the busiest summer weeks, and use transit for steeper parts of the city.",
    bestFor: ["Europe first-timers", "Food and wine travelers", "Couples and solo travelers who like walkable cities"],
    whenToGo:
      "May, June, September, and October usually offer a better mix of weather and pricing than peak summer.",
    lowerCostTips: [
      "Compare hotels near metro stations instead of only the most famous central areas.",
      "Use bakeries, markets, and casual seafood spots to balance restaurant spending.",
      "Group paid sights and day trips so transit costs stay predictable.",
    ],
    includes: ["Default flight estimate from Montreal", "Mid-range hotel and daily cost estimates", "Food, local transit, activities, and buffer"],
    assumptions:
      "This is a CAD planning estimate, not a live quote. Prices change with season, dates, neighborhood, comfort level, exchange rates, and availability.",
    faq: [
      {
        question: "Is Lisbon still budget-friendly?",
        answer:
          "Lisbon is no longer a hidden bargain, but it can still compare well with many Western Europe capitals if lodging is booked carefully.",
      },
      {
        question: "How many days should I budget for Lisbon?",
        answer:
          "Seven days gives time for Lisbon neighborhoods and a day trip without adding too many hotel nights.",
      },
      {
        question: "Does this budget include Sintra?",
        answer:
          "The activity and transport estimates leave room for a modest day trip, but premium tours or multiple excursions should be added separately.",
      },
    ],
    pinterest: {
      title: "Lisbon Travel Budget in CAD",
      description: "A practical Lisbon cost guide for flights, stays, food, transit, and activities.",
      altText: "Lisbon Portugal travel budget with CAD estimates for flights hotels food and activities",
      tags: ["Lisbon travel budget", "Portugal budget", "Europe budget travel", "CAD travel", "Lisbon itinerary"],
    },
  },
  {
    kind: "itinerary",
    slug: "10-days-in-bangkok-budget",
    path: "/itineraries/10-days-in-bangkok-budget",
    title: "10 Days in Bangkok: Realistic Travel Budget Guide",
    metaDescription:
      "Estimate a 10-day Bangkok budget in CAD, including flights, hotels, food, transit, activities, buffers, best timing, and practical saving tips.",
    h1: "10 days in Bangkok: realistic travel budget guide",
    primaryKeyword: "10 days in Bangkok budget",
    destinationSlug: "bangkok",
    originSlug: "montreal",
    durationDays: 10,
    travelStyle: "midRange",
    travelers: 1,
    intro:
      "A 10-day Bangkok trip can make sense because low local costs help offset the long-haul flight, especially for travelers who enjoy street food and transit.",
    bestFor: ["Food-first travelers", "Warm winter city trips", "Solo travelers and couples who want a longer stay"],
    whenToGo:
      "January, February, November, and December are popular dry-season windows. Compare dates carefully around holidays when flights can rise.",
    lowerCostTips: [
      "Stay near BTS or MRT lines to reduce taxis and traffic delays.",
      "Use street food, food courts, and casual restaurants for most meals.",
      "Add paid tours selectively and leave room for free markets, temples, and neighborhood walks.",
    ],
    includes: ["Round-trip flight estimate from Montreal", "10 days of lodging and local costs", "Food, transit, activities, and buffer"],
    assumptions:
      "The estimate is in CAD for one traveler. Bangkok prices vary by season, dates, hotel class, exchange rates, comfort level, and availability.",
    faq: [
      {
        question: "Is 10 days too long for Bangkok?",
        answer:
          "Not if you use Bangkok as a base for neighborhoods, food, temples, markets, and selected day trips. It also spreads out the flight cost.",
      },
      {
        question: "Can Bangkok be done on a budget?",
        answer:
          "Yes. Food courts, transit, simple hotels, and selective paid activities can keep the daily budget controlled.",
      },
      {
        question: "What costs can surprise travelers in Bangkok?",
        answer:
          "Private transfers, rooftop bars, premium hotels, frequent taxis, and multiple tours can raise the total quickly.",
      },
    ],
    pinterest: {
      title: "10 Days in Bangkok Budget",
      description: "Plan a 10-day Bangkok trip with CAD estimates for flights, hotels, food, transit, and activities.",
      altText: "10 day Bangkok budget itinerary with estimated CAD travel costs",
      tags: ["Bangkok budget", "Thailand travel", "10 day itinerary", "CAD travel budget", "Asia budget travel"],
    },
  },
  {
    kind: "itinerary",
    slug: "7-days-in-paris-budget",
    path: "/itineraries/7-days-in-paris-budget",
    title: "7 Days in Paris: Realistic Travel Budget Guide",
    metaDescription:
      "Plan a 7-day Paris budget in CAD with estimated flights, accommodation, food, transit, activities, buffers, better-value months, and saving tips.",
    h1: "7 days in Paris: realistic travel budget guide",
    primaryKeyword: "7 days in Paris budget",
    destinationSlug: "paris",
    originSlug: "montreal",
    durationDays: 7,
    travelStyle: "midRange",
    travelers: 1,
    intro:
      "Paris is not a low-cost city, but a 7-day trip can be planned responsibly by controlling hotel location, museum choices, and restaurant mix.",
    bestFor: ["First-time Paris visitors", "Museum and food travelers", "Couples who value central but modest stays"],
    whenToGo:
      "April, May, September, and October often balance weather and value better than peak summer, though major events can still move prices.",
    lowerCostTips: [
      "Compare neighborhoods with metro access instead of only the most central arrondissements.",
      "Use bakeries, markets, prix fixe lunches, and picnics to reduce meal pressure.",
      "Prioritize a few paid museums and balance them with parks, walks, and viewpoints.",
    ],
    includes: ["Round-trip flight estimate from Montreal", "7 days of mid-range Paris costs", "Meals, metro, activities, and buffer"],
    assumptions:
      "This CAD estimate is for one traveler. Paris costs vary by season, exact dates, hotel quality, neighborhood, exchange rates, and availability.",
    faq: [
      {
        question: "Is one week in Paris expensive?",
        answer:
          "It can be, mostly because accommodation and paid attractions add up. Flights from Eastern Canada can be manageable when booked well.",
      },
      {
        question: "Can I lower the Paris hotel cost?",
        answer:
          "Often, yes. Staying near reliable metro lines outside the most central areas can reduce nightly rates without making the trip inconvenient.",
      },
      {
        question: "What should I exclude from a tight Paris budget?",
        answer:
          "Premium dining, luxury shopping, private tours, and last-minute central hotels are the easiest costs to limit.",
      },
    ],
    pinterest: {
      title: "7 Days in Paris Budget",
      description: "A realistic Paris budget in CAD with flight, hotel, food, transit, and activity estimates.",
      altText: "7 day Paris travel budget guide with estimated CAD costs",
      tags: ["Paris budget", "France travel", "7 day itinerary", "Europe budget", "CAD travel"],
    },
  },
  {
    kind: "itinerary",
    slug: "10-days-in-rome-budget",
    path: "/itineraries/10-days-in-rome-budget",
    title: "10 Days in Rome: Realistic Travel Budget Guide",
    metaDescription:
      "Estimate a 10-day Rome budget in CAD, including flights, hotels, food, local transport, activities, buffers, best months, and saving tips.",
    h1: "10 days in Rome: realistic travel budget guide",
    primaryKeyword: "10 days in Rome budget",
    destinationSlug: "rome",
    originSlug: "montreal",
    durationDays: 10,
    travelStyle: "midRange",
    travelers: 1,
    intro:
      "Ten days in Rome gives enough time to spread out major sights, avoid overpacking the schedule, and use slower food and neighborhood days to manage costs.",
    bestFor: ["History and food travelers", "Couples and families planning a classic Italy trip", "Travelers who prefer fewer hotel changes"],
    whenToGo:
      "April, May, September, and October are attractive for weather and sightseeing comfort, but early booking still matters.",
    lowerCostTips: [
      "Book major sights early and avoid paying for unnecessary skip-the-line bundles.",
      "Stay near transit or walkable neighborhoods rather than chasing only landmark views.",
      "Use casual trattorias, bakeries, markets, and simple breakfasts to balance food costs.",
    ],
    includes: ["Round-trip flight estimate from Montreal", "10 days of mid-range Rome costs", "Food, local movement, activities, and buffer"],
    assumptions:
      "This is a CAD planning estimate for one traveler. Rome pricing varies by season, exact dates, hotel comfort, exchange rates, and availability.",
    faq: [
      {
        question: "Is 10 days in Rome too much?",
        answer:
          "No. Ten days works well if you include slower neighborhoods, museums, food days, and possible day trips without changing hotels.",
      },
      {
        question: "What makes Rome expensive?",
        answer:
          "Accommodation, paid sights, guided tours, and peak-season demand are usually the biggest budget pressures.",
      },
      {
        question: "Can Rome be cheaper than Paris?",
        answer:
          "Sometimes, especially for food and some accommodation choices, but the difference depends on dates, hotel location, and flight pricing.",
      },
    ],
    pinterest: {
      title: "10 Days in Rome Budget",
      description: "A realistic CAD budget for a 10-day Rome trip with costs and saving tips.",
      altText: "10 day Rome travel budget guide with CAD flight hotel food and activity estimates",
      tags: ["Rome budget", "Italy travel", "10 day itinerary", "Europe travel budget", "CAD travel"],
    },
  },
  {
    kind: "itinerary",
    slug: "7-days-in-prague-budget",
    path: "/itineraries/7-days-in-prague-budget",
    title: "7 Days in Prague: Realistic Travel Budget Guide",
    metaDescription:
      "Plan a 7-day Prague travel budget in CAD with estimated flights, hotels, meals, local transport, activities, buffer, timing, and tips.",
    h1: "7 days in Prague: realistic travel budget guide",
    primaryKeyword: "7 days in Prague budget",
    destinationSlug: "prague",
    originSlug: "montreal",
    durationDays: 7,
    travelStyle: "midRange",
    travelers: 1,
    intro:
      "Prague can be a strong Europe value trip when you avoid peak weekend hotel pressure and keep the itinerary focused on walkable neighborhoods.",
    bestFor: ["Value-focused Europe travelers", "Architecture and old-town city breaks", "Couples or solo travelers who like compact cities"],
    whenToGo:
      "April, May, September, and October are useful shoulder-season months for weather, crowds, and price control.",
    lowerCostTips: [
      "Avoid the most tourist-heavy restaurant zones around major squares.",
      "Choose accommodation with tram or metro access instead of only old-town frontage.",
      "Mix paid sights with self-guided walks across bridges, parks, and viewpoints.",
    ],
    includes: ["Round-trip flight estimate from Montreal", "7 days of Prague local costs", "Food, transport, activities, and a buffer"],
    assumptions:
      "This estimate is in CAD for one traveler. Prices vary by season, exact dates, hotel location, comfort level, exchange rates, and availability.",
    faq: [
      {
        question: "Is Prague still a cheap Europe destination?",
        answer:
          "Prague can still be good value, but the most central hotels and tourist restaurants can erase that advantage quickly.",
      },
      {
        question: "How many days should I spend in Prague?",
        answer:
          "Seven days is comfortable if you include museums, neighborhoods, viewpoints, and a day trip. Shorter stays can cost less overall.",
      },
      {
        question: "What is the easiest Prague cost to reduce?",
        answer:
          "Food and accommodation are the easiest to adjust by avoiding peak locations and booking early.",
      },
    ],
    pinterest: {
      title: "7 Days in Prague Budget",
      description: "A practical Prague budget in CAD for flights, hotels, meals, transit, and activities.",
      altText: "7 day Prague travel budget guide with estimated CAD costs",
      tags: ["Prague budget", "Czechia travel", "Europe value", "7 day itinerary", "CAD budget"],
    },
  },
] satisfies StrongSeoPageConfig[];

export function getStrongSeoPage(path: string) {
  const config = strongSeoPages.find((page) => page.path === path);
  return config ? hydrateStrongSeoPage(config) : null;
}

export function getStrongSeoPageByKindAndSlug(kind: StrongSeoPageKind, slug: string) {
  const config = strongSeoPages.find((page) => page.kind === kind && page.slug === slug);
  return config ? hydrateStrongSeoPage(config) : null;
}

export function getStrongSeoPageByDestinationBudgetSlug(destinationSlug: string) {
  const config = strongSeoPages.find(
    (page) => page.kind === "destination-budget" && page.destinationSlug === destinationSlug
  );

  return config ? hydrateStrongSeoPage(config) : null;
}

export function getStrongSeoDestinationBudgetPath(destinationSlug: string) {
  return strongSeoPages.find(
    (page) => page.kind === "destination-budget" && page.destinationSlug === destinationSlug
  )?.path;
}

export function getStrongSeoStaticParams(kind: StrongSeoPageKind) {
  return strongSeoPages
    .filter((page) => page.kind === kind)
    .map((page) => ({ slug: page.slug }));
}

export function getDestinationBudgetStrongSeoStaticParams() {
  return strongSeoPages
    .filter((page) => page.kind === "destination-budget")
    .map((page) => ({ slug: page.destinationSlug }));
}

function hydrateStrongSeoPage(config: StrongSeoPageConfig): StrongSeoPage | null {
  const destination = getUnifiedDestination(config.destinationSlug);
  const origin = programmaticOrigins.find((item) => item.slug === config.originSlug);

  if (!destination || !origin) {
    return null;
  }

  return {
    ...config,
    destination,
    origin,
    estimate: getStrongSeoEstimate(config, destination, origin),
    relatedPages: getRelatedStrongSeoPages(config),
  };
}

function getStrongSeoEstimate(
  config: StrongSeoPageConfig,
  destination: Destination,
  origin: ProgrammaticOrigin
): StrongSeoEstimate {
  const breakdown = getDestinationCostBreakdown(destination, {
    days: config.durationDays,
    originCode: normalizeOriginCode(origin.code),
    travelStyle: config.travelStyle,
    travelers: config.travelers,
  });
  const total = getDestinationTripEstimate(destination, {
    days: config.durationDays,
    originCode: normalizeOriginCode(origin.code),
    travelStyle: config.travelStyle,
    travelers: config.travelers,
  });

  return {
    total,
    breakdown: {
      flight: breakdown.flights,
      hotel: breakdown.accommodation,
      food: breakdown.food,
      localTransport: breakdown.localTransport,
      activities: breakdown.activities,
      buffer: breakdown.misc,
    },
  };
}

function getRelatedStrongSeoPages(config: StrongSeoPageConfig) {
  const destinationMatches = strongSeoPages.filter(
    (page) => page.path !== config.path && page.destinationSlug === config.destinationSlug
  );
  const kindMatches = strongSeoPages.filter(
    (page) => page.path !== config.path && page.kind === config.kind && page.destinationSlug !== config.destinationSlug
  );
  const originMatches = strongSeoPages.filter(
    (page) => page.path !== config.path && page.originSlug === config.originSlug && page.destinationSlug !== config.destinationSlug
  );

  return uniqueRelatedPages([...destinationMatches, ...originMatches, ...kindMatches]).slice(0, 4);
}

function uniqueRelatedPages(pages: StrongSeoPageConfig[]) {
  const seen = new Set<string>();

  return pages.filter((page) => {
    if (seen.has(page.path)) {
      return false;
    }

    seen.add(page.path);
    return true;
  });
}
