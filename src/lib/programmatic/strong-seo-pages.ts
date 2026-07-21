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
  styleEstimates: Record<TravelStyle, number>;
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
    kind: "origin-destination",
    slug: "from-vancouver-to-seoul",
    path: "/budget-travel/from-vancouver-to-seoul",
    title: "Vancouver to Seoul Budget: 10-Day Trip Cost in CAD",
    metaDescription:
      "Estimate a Vancouver to Seoul budget in CAD, including flights, hotel, food, local transport, activities, buffer, best months, and practical saving tips.",
    h1: "Vancouver to Seoul budget: 10-day trip cost in CAD",
    primaryKeyword: "Vancouver to Seoul budget",
    destinationSlug: "seoul",
    originSlug: "vancouver",
    durationDays: 10,
    travelStyle: "midRange",
    travelers: 1,
    intro:
      "A Seoul trip from Vancouver can fit a controlled mid-range budget when airfare is booked carefully and daily spending leans on transit, casual food, and compact hotel areas.",
    bestFor: ["Food and cafe-focused city travelers", "First-time South Korea trips", "Solo travelers who want strong transit and late-night neighborhoods"],
    whenToGo:
      "April, May, September, and October usually balance weather and value better than peak holiday periods, though spring and fall demand can still lift hotel prices.",
    lowerCostTips: [
      "Compare Vancouver departures across weekdays and avoid treating one low fare as the full trip cost.",
      "Stay near subway lines in practical neighborhoods instead of only the busiest shopping districts.",
      "Use markets, casual restaurants, convenience stores, and transit-heavy days to keep daily costs predictable.",
    ],
    includes: ["Round-trip flight estimate from Vancouver", "10 days of mid-range Seoul costs", "Hotel, food, transit, activities, and buffer"],
    assumptions:
      "This CAD estimate is for one traveler. Prices vary by dates, season, airport availability, exchange rates, hotel comfort level, and travel style.",
    faq: [
      {
        question: "Is Seoul cheaper than Tokyo from Vancouver?",
        answer:
          "Seoul can be slightly easier to control for hotels and food, but the final difference depends on airfare, exchange rates, and exact neighborhood choices.",
      },
      {
        question: "Does this Vancouver to Seoul budget include flights?",
        answer:
          "Yes. It includes an estimated round-trip flight from Vancouver plus hotel, food, local transport, activities, and a buffer.",
      },
      {
        question: "Can I lower a 10-day Seoul budget?",
        answer:
          "Usually, yes. Simpler hotels, subway-focused routing, fewer paid tours, and shoulder-season dates are the easiest levers.",
      },
      {
        question: "Is 10 days enough for Seoul?",
        answer:
          "Ten days works well for neighborhoods, food, museums, markets, and one or two day trips without changing hotels.",
      },
    ],
    pinterest: {
      title: "Vancouver to Seoul Budget",
      description: "A realistic 10-day Seoul budget from Vancouver with CAD estimates and saving tips.",
      altText: "Vancouver to Seoul travel budget with estimated CAD costs for flights hotels food transit and activities",
      tags: ["Seoul budget", "Vancouver travel", "South Korea trip", "Asia travel budget", "CAD travel"],
    },
  },
  {
    kind: "origin-destination",
    slug: "from-calgary-to-lisbon",
    path: "/budget-travel/from-calgary-to-lisbon",
    title: "Calgary to Lisbon Budget: Flights, Hotels and Daily Costs",
    metaDescription:
      "Plan a Calgary to Lisbon budget in CAD with estimated flights, hotels, food, local transport, activities, buffer, best timing, and saving tips.",
    h1: "Calgary to Lisbon budget: flights, hotels and daily costs",
    primaryKeyword: "Calgary to Lisbon budget",
    destinationSlug: "lisbon",
    originSlug: "calgary",
    durationDays: 7,
    travelStyle: "midRange",
    travelers: 1,
    intro:
      "Lisbon is a useful Europe value target from Calgary when travelers compare connecting flights early and avoid the highest summer hotel pressure.",
    bestFor: ["First-time Portugal trips", "Food and viewpoint itineraries", "Travelers willing to compare one-stop flight options"],
    whenToGo:
      "May, June, September, and October are usually stronger value windows than July and August, with better walking weather and less hotel pressure.",
    lowerCostTips: [
      "Compare Calgary flight routings and allow date flexibility before choosing exact nights.",
      "Stay near metro or tram access instead of paying only for the most central hilltop locations.",
      "Use bakeries, markets, casual restaurants, and selective day trips to control daily spend.",
    ],
    includes: ["Round-trip flight estimate from Calgary", "7 days of Lisbon mid-range costs", "Hotel, meals, local transport, activities, and buffer"],
    assumptions:
      "This is a CAD planning estimate for one traveler. Actual prices vary by season, dates, departure airport availability, comfort level, exchange rates, and booking timing.",
    faq: [
      {
        question: "Is Lisbon a good Europe budget trip from Calgary?",
        answer:
          "It can be, especially outside peak summer and when flights are booked early enough to avoid expensive routings.",
      },
      {
        question: "What is the biggest cost risk for Calgary to Lisbon?",
        answer:
          "Flights and accommodation timing usually matter most. A cheap fare can still be offset by peak hotel rates.",
      },
      {
        question: "Should I add Porto to a Lisbon budget?",
        answer:
          "You can, but add train costs and avoid splitting a short trip across too many hotel changes.",
      },
    ],
    pinterest: {
      title: "Calgary to Lisbon Budget",
      description: "Flights, stays, meals, transit, and saving tips for a Lisbon trip from Calgary.",
      altText: "Calgary to Lisbon Portugal budget guide with CAD flight hotel food and transit estimates",
      tags: ["Lisbon budget", "Calgary travel", "Portugal trip cost", "Europe under budget", "CAD travel"],
    },
  },
  {
    kind: "origin-destination",
    slug: "from-toronto-to-tokyo-10-days",
    path: "/budget-travel/from-toronto-to-tokyo-10-days",
    title: "Toronto to Tokyo 10-Day Budget: Trip Cost in CAD",
    metaDescription:
      "Estimate a Toronto to Tokyo 10-day budget in CAD, including flights, hotels, meals, transit, activities, buffer, timing, and ways to save.",
    h1: "Toronto to Tokyo 10-day budget: trip cost in CAD",
    primaryKeyword: "Toronto to Tokyo 10-day budget",
    destinationSlug: "tokyo",
    originSlug: "toronto",
    durationDays: 10,
    travelStyle: "midRange",
    travelers: 1,
    intro:
      "A 10-day Tokyo trip from Toronto needs a larger budget than short-haul destinations, but the long stay helps spread the flight cost across more useful travel days.",
    bestFor: ["First-time Japan travelers", "Food and transit-focused city trips", "Travelers comfortable with compact hotels"],
    whenToGo:
      "March, April, October, and November are attractive, but cherry blossom and fall foliage weeks can raise prices. Compare dates just outside the most popular periods.",
    lowerCostTips: [
      "Track Toronto fares early and compare both Tokyo airport options when available.",
      "Choose compact business hotels near rail lines instead of larger rooms in premium districts.",
      "Use casual meals, convenience stores, lunch sets, and selective paid activities.",
    ],
    includes: ["Round-trip flight estimate from Toronto", "10 days of mid-range Tokyo costs", "Hotel, food, local rail, activities, and buffer"],
    assumptions:
      "This CAD estimate is for one traveler. Prices vary by exact dates, season, availability, exchange rates, airport options, hotel size, and travel style.",
    faq: [
      {
        question: "Is 10 days in Tokyo worth it from Toronto?",
        answer:
          "Yes for many travelers, because the longer stay gives more value from the long-haul flight and leaves room for nearby day trips.",
      },
      {
        question: "Does this estimate include Japan Rail Pass costs?",
        answer:
          "No. It focuses on Tokyo and local movement. Add extra rail costs if you plan a wider Japan itinerary.",
      },
      {
        question: "Can food be affordable in Tokyo?",
        answer:
          "Yes. Ramen shops, casual chains, lunch sets, convenience stores, and department-store food halls can keep meals controlled.",
      },
    ],
    pinterest: {
      title: "Toronto to Tokyo 10-Day Budget",
      description: "A practical CAD budget for a 10-day Tokyo trip from Toronto.",
      altText: "Toronto to Tokyo 10 day travel budget with estimated CAD costs",
      tags: ["Tokyo budget", "Toronto travel", "Japan trip cost", "10 day Japan", "CAD travel"],
    },
  },
  {
    kind: "origin-destination",
    slug: "from-montreal-to-porto",
    path: "/budget-travel/from-montreal-to-porto",
    title: "Montreal to Porto Budget: 7-Day Portugal Trip Cost",
    metaDescription:
      "Estimate a Montreal to Porto budget in CAD with flights, hotel, meals, local transport, activities, buffer, best months, and saving tips.",
    h1: "Montreal to Porto budget: 7-day Portugal trip cost",
    primaryKeyword: "Montreal to Porto budget",
    destinationSlug: "porto",
    originSlug: "montreal",
    durationDays: 7,
    travelStyle: "midRange",
    travelers: 1,
    intro:
      "Porto can be a strong-value Portugal trip from Montreal, especially for travelers who want food, river views, wine cellars, and a compact city without Lisbon hotel pressure.",
    bestFor: ["Portugal value seekers", "Food and wine travelers", "Couples or solo travelers who prefer compact city breaks"],
    whenToGo:
      "May, June, September, and October are useful planning windows for weather and value. Summer weekends can still raise hotel rates.",
    lowerCostTips: [
      "Compare Montreal fares into Porto and Lisbon, then include any train transfer before deciding.",
      "Stay slightly away from the most photographed riverfront blocks if nightly rates spike.",
      "Use bakeries, markets, casual restaurants, and self-guided walks to balance paid activities.",
    ],
    includes: ["Round-trip flight estimate from Montreal", "7 days of Porto mid-range costs", "Hotel, food, local transport, activities, and buffer"],
    assumptions:
      "This CAD estimate is for one traveler. Prices vary by season, dates, flight routing, comfort level, exchange rates, availability, and travel style.",
    faq: [
      {
        question: "Is Porto cheaper than Lisbon?",
        answer:
          "Often, Porto can be easier on accommodation and daily costs, but airfare and peak dates can change the final comparison.",
      },
      {
        question: "Should I fly into Lisbon for a Porto trip?",
        answer:
          "Sometimes. Compare total cost after adding train fare, time, and any extra hotel night caused by the flight schedule.",
      },
      {
        question: "Is 7 days too long for Porto?",
        answer:
          "Seven days works if you include neighborhoods, wine cellars, food stops, slower local days, and one or two day trips.",
      },
    ],
    pinterest: {
      title: "Montreal to Porto Budget",
      description: "A 7-day Porto budget from Montreal with CAD estimates and practical saving tips.",
      altText: "Montreal to Porto Portugal budget guide with estimated CAD trip costs",
      tags: ["Porto budget", "Montreal travel", "Portugal budget", "7 day trip", "CAD travel"],
    },
  },
  {
    kind: "origin-destination",
    slug: "from-ottawa-to-mexico-city",
    path: "/budget-travel/from-ottawa-to-mexico-city",
    title: "Ottawa to Mexico City Budget: 7-Day Trip Cost in CAD",
    metaDescription:
      "Plan an Ottawa to Mexico City budget in CAD with estimated flights, hotels, food, local transport, activities, buffer, timing, and saving tips.",
    h1: "Ottawa to Mexico City budget: 7-day trip cost in CAD",
    primaryKeyword: "Ottawa to Mexico City budget",
    destinationSlug: "mexico-city",
    originSlug: "ottawa",
    durationDays: 7,
    travelStyle: "midRange",
    travelers: 1,
    intro:
      "Mexico City can be a practical cultural city trip from Ottawa when travelers compare Ottawa and nearby airport options, then keep local spending focused on food, museums, and transit.",
    bestFor: ["Food and museum travelers", "Warm city breaks without resort pricing", "Ottawa travelers willing to compare flight routings"],
    whenToGo:
      "February, March, October, and November often combine comfortable weather with more manageable planning windows than major holiday periods.",
    lowerCostTips: [
      "Compare Ottawa departures with Montreal departures only after adding transfer time and cost.",
      "Stay near Roma, Condesa, Centro, or a metro corridor to reduce local transport costs.",
      "Prioritize markets, parks, and museums over a packed schedule of private tours.",
    ],
    includes: ["Round-trip flight estimate from Ottawa", "7 days of Mexico City mid-range costs", "Hotel, food, local transport, activities, and buffer"],
    assumptions:
      "This CAD estimate is for one traveler. Prices vary by departure airport, dates, season, comfort level, availability, exchange rates, and travel style.",
    faq: [
      {
        question: "Is Mexico City affordable from Ottawa?",
        answer:
          "It can be, especially when flights are reasonable and the trip leans on local food, transit, museums, and neighborhood exploring.",
      },
      {
        question: "Should Ottawa travelers check Montreal flights?",
        answer:
          "Sometimes. Montreal may offer more options, but the transfer cost and time need to be included in the total.",
      },
      {
        question: "What costs can surprise travelers in Mexico City?",
        answer:
          "Frequent ride-hailing, premium restaurants, private tours, and last-minute lodging in popular neighborhoods can raise the total.",
      },
    ],
    pinterest: {
      title: "Ottawa to Mexico City Budget",
      description: "A realistic 7-day Mexico City budget from Ottawa with CAD cost categories.",
      altText: "Ottawa to Mexico City budget guide with flights hotels food transit and activities in CAD",
      tags: ["Mexico City budget", "Ottawa travel", "Mexico trip cost", "city break budget", "CAD travel"],
    },
  },
  {
    kind: "origin-destination",
    slug: "from-quebec-city-to-paris",
    path: "/budget-travel/from-quebec-city-to-paris",
    title: "Quebec City to Paris Budget: 7-Day Trip Cost in CAD",
    metaDescription:
      "Estimate a Quebec City to Paris budget in CAD with flights, hotels, meals, local transport, activities, buffer, best months, and saving tips.",
    h1: "Quebec City to Paris budget: 7-day trip cost in CAD",
    primaryKeyword: "Quebec City to Paris budget",
    destinationSlug: "paris",
    originSlug: "quebec",
    durationDays: 7,
    travelStyle: "midRange",
    travelers: 1,
    intro:
      "Paris from Quebec City can work as a classic one-week Europe trip, but the budget needs careful flight routing, neighborhood choice, and a realistic activity plan.",
    bestFor: ["First-time Paris visitors", "Museum and food travelers", "Quebec City travelers comparing direct and connecting options"],
    whenToGo:
      "April, May, September, and October often balance weather and value better than peak summer, though major events can still move hotel prices.",
    lowerCostTips: [
      "Compare Quebec City departures with Montreal only after adding transfer costs.",
      "Stay near reliable metro lines rather than paying only for the most central arrondissement.",
      "Use bakeries, markets, prix fixe lunches, parks, and a limited paid museum list.",
    ],
    includes: ["Round-trip flight estimate from Quebec City", "7 days of mid-range Paris costs", "Hotel, meals, metro, activities, and buffer"],
    assumptions:
      "This CAD estimate is for one traveler. Prices vary by dates, season, departure airport, comfort level, exchange rates, availability, and travel style.",
    faq: [
      {
        question: "Is Paris expensive from Quebec City?",
        answer:
          "Paris is a higher-cost city, mostly because of accommodation and paid attractions, so flight timing and hotel location matter.",
      },
      {
        question: "Should I compare Montreal departures?",
        answer:
          "It can be worth checking, but include ground transport, time, baggage logistics, and any extra night before choosing.",
      },
      {
        question: "Can I reduce a Paris budget without skipping the main sights?",
        answer:
          "Yes. Use transit-friendly lodging, choose a few paid museums, mix casual meals with markets, and avoid peak dates.",
      },
    ],
    pinterest: {
      title: "Quebec City to Paris Budget",
      description: "A 7-day Paris budget from Quebec City with CAD estimates and saving tips.",
      altText: "Quebec City to Paris budget guide with estimated CAD travel costs",
      tags: ["Paris budget", "Quebec City travel", "France trip cost", "Europe budget", "CAD travel"],
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
  {
    kind: "itinerary",
    slug: "7-days-in-lisbon-budget",
    path: "/itineraries/7-days-in-lisbon-budget",
    title: "7 Days in Lisbon Budget: Realistic Trip Cost Guide",
    metaDescription:
      "Plan a 7-day Lisbon budget in CAD with estimated flights, hotels, meals, local transport, activities, buffer, best months, and saving tips.",
    h1: "7 days in Lisbon budget: realistic trip cost guide",
    primaryKeyword: "7 days in Lisbon budget",
    destinationSlug: "lisbon",
    originSlug: "montreal",
    durationDays: 7,
    travelStyle: "midRange",
    travelers: 1,
    intro:
      "Seven days in Lisbon gives enough time for central neighborhoods, viewpoints, food, and one day trip while keeping hotel nights manageable.",
    bestFor: ["First-time Portugal travelers", "Food, views, and walkable neighborhood trips", "Travelers comparing Europe value cities"],
    whenToGo:
      "May, June, September, and October usually offer a better balance of weather and cost than peak summer.",
    lowerCostTips: [
      "Stay close to metro access instead of paying only for the most central tourist blocks.",
      "Use bakeries, markets, casual seafood spots, and day passes to keep daily costs steady.",
      "Choose one major day trip rather than stacking several paid excursions into a short stay.",
    ],
    includes: ["Round-trip flight estimate from Montreal", "7 days of mid-range Lisbon costs", "Hotel, food, local transport, activities, and buffer"],
    assumptions:
      "This CAD estimate uses Montreal as the default origin and one mid-range traveler. Prices vary by departure city, dates, season, comfort level, availability, and travel style.",
    faq: [
      {
        question: "Is 7 days enough for Lisbon?",
        answer:
          "Yes. Seven days gives time for Lisbon neighborhoods, food, viewpoints, and a day trip without adding too many hotel nights.",
      },
      {
        question: "Is Lisbon still budget-friendly?",
        answer:
          "Lisbon is not as cheap as it once was, but it can still compare well with many Western Europe capitals when lodging is booked carefully.",
      },
      {
        question: "What should I budget extra for in Lisbon?",
        answer:
          "Add extra if you want multiple day trips, premium restaurants, frequent ride-hailing, or a hotel in the most central areas.",
      },
    ],
    pinterest: {
      title: "7 Days in Lisbon Budget",
      description: "A realistic 7-day Lisbon cost guide in CAD for flights, stays, meals, transit, and activities.",
      altText: "7 days in Lisbon budget guide with estimated CAD travel costs",
      tags: ["Lisbon budget", "7 day Lisbon", "Portugal itinerary", "Europe budget travel", "CAD travel"],
    },
  },
  {
    kind: "itinerary",
    slug: "10-days-in-tokyo-budget",
    path: "/itineraries/10-days-in-tokyo-budget",
    title: "10 Days in Tokyo Budget: Realistic Trip Cost Guide",
    metaDescription:
      "Estimate a 10-day Tokyo budget in CAD, including flights, hotels, food, local transit, activities, buffer, best months, and ways to save.",
    h1: "10 days in Tokyo budget: realistic trip cost guide",
    primaryKeyword: "10 days in Tokyo budget",
    destinationSlug: "tokyo",
    originSlug: "montreal",
    durationDays: 10,
    travelStyle: "midRange",
    travelers: 1,
    intro:
      "Ten days in Tokyo works well because the trip can balance major neighborhoods, food, transit, museums, and slower days while spreading out the long-haul flight cost.",
    bestFor: ["First-time Japan travelers", "Food and rail-based city trips", "Travelers who prefer one hotel base with day trips"],
    whenToGo:
      "March, April, October, and November are popular, but the best value is often just outside the highest-demand cherry blossom and foliage dates.",
    lowerCostTips: [
      "Book compact hotels near useful rail lines instead of chasing larger rooms in premium districts.",
      "Use casual restaurants, lunch sets, convenience stores, and food halls for most meals.",
      "Plan local transit by actual routes instead of buying every pass by default.",
    ],
    includes: ["Round-trip flight estimate from Montreal", "10 days of mid-range Tokyo costs", "Hotel, food, local rail, activities, and buffer"],
    assumptions:
      "This CAD estimate uses Montreal as the default origin and one mid-range traveler. Prices vary by departure city, dates, season, hotel size, exchange rates, availability, and travel style.",
    faq: [
      {
        question: "Is 10 days in Tokyo too long?",
        answer:
          "No. Ten days gives enough room for core neighborhoods, food, museums, shopping districts, and selected day trips without rushing.",
      },
      {
        question: "What makes Tokyo expensive?",
        answer:
          "Flights and hotels usually drive the total. Food and local transit can be managed with careful choices.",
      },
      {
        question: "Does this budget include wider Japan travel?",
        answer:
          "No. It focuses on Tokyo. Add intercity rail, extra hotels, and luggage forwarding if you expand to Kyoto, Osaka, or other regions.",
      },
    ],
    pinterest: {
      title: "10 Days in Tokyo Budget",
      description: "A practical 10-day Tokyo budget guide in CAD with cost categories and saving tips.",
      altText: "10 days in Tokyo budget itinerary with estimated CAD trip costs",
      tags: ["Tokyo budget", "10 day Tokyo", "Japan itinerary", "Asia travel budget", "CAD travel"],
    },
  },
] satisfies StrongSeoPageConfig[];

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
    styleEstimates: getStrongSeoStyleEstimates(config, destination, origin),
    relatedPages: getRelatedStrongSeoPages(config),
  };
}

function getStrongSeoStyleEstimates(
  config: StrongSeoPageConfig,
  destination: Destination,
  origin: ProgrammaticOrigin
): Record<TravelStyle, number> {
  return {
    budget: getDestinationTripEstimate(destination, {
      days: config.durationDays,
      originCode: normalizeOriginCode(origin.code),
      travelStyle: "budget",
      travelers: config.travelers,
    }),
    midRange: getDestinationTripEstimate(destination, {
      days: config.durationDays,
      originCode: normalizeOriginCode(origin.code),
      travelStyle: "midRange",
      travelers: config.travelers,
    }),
    luxury: getDestinationTripEstimate(destination, {
      days: config.durationDays,
      originCode: normalizeOriginCode(origin.code),
      travelStyle: "luxury",
      travelers: config.travelers,
    }),
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
