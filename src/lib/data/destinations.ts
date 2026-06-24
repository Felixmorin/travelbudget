export type AffiliateLink = {
  type: "Flights" | "Hotels" | "eSIM" | "Activities" | "Insurance";
  title: string;
  description: string;
  priceHint: string;
  href: string;
};

export type OriginCode = "YUL" | "YYZ" | "YVR" | (string & {});

export type FlightEstimate = {
  low: number;
  average: number;
  high: number;
};

export type OriginPricing = Record<
  OriginCode,
  {
    originCity: string;
    originCountry: string;
    currency: string;
    flightEstimate: FlightEstimate;
    seasonalNotes?: string;
  }
>;

export type TravelStyle = "budget" | "midRange" | "luxury";

export type TravelStyleCosts = {
  accommodation: number;
  food: number;
  localTransport: number;
  activities: number;
  misc: number;
};

export type DailyCosts = {
  currency: string;
  budget: TravelStyleCosts;
  midRange: TravelStyleCosts;
  luxury: TravelStyleCosts;
};

export type Destination = {
  slug: string;
  name: string;
  countryCode: string;
  image: string;
  originPricing: OriginPricing;
  dailyCosts: DailyCosts;
  estimatedCost: number;
  currency: string;
  score: number;
  flightCost: number;
  hotelCost: number;
  foodCost: number;
  transportCost: number;
  activitiesCost: number;
  bestMonths: string[];
  travelStyles: string[];
  weather: string;
  shortDescription: string;
  itineraryPreview: string[];
  affiliateLinks: AffiliateLink[];
  faqs: {
    question: string;
    answer: string;
  }[];
};

const defaultOriginCode = "YUL";
const defaultTravelStyle: TravelStyle = "midRange";
const estimateDays = 10;
const defaultTravelers = 1;

function sumTravelStyleCosts(costs: Partial<TravelStyleCosts> | undefined) {
  return (
    (costs?.accommodation ?? 0) +
    (costs?.food ?? 0) +
    (costs?.localTransport ?? 0) +
    (costs?.activities ?? 0) +
    (costs?.misc ?? 0)
  );
}

function getFirstOriginCode(originPricing: Partial<OriginPricing> | undefined) {
  return originPricing ? (Object.keys(originPricing)[0] as OriginCode | undefined) : undefined;
}

function buildDestination(destination: Omit<Destination, "estimatedCost" | "currency" | "flightCost" | "hotelCost" | "foodCost" | "transportCost" | "activitiesCost">): Destination {
  const originPricing = getOriginPricing(destination, defaultOriginCode);
  const dailyCosts = getTravelStyleCosts(destination, defaultTravelStyle);

  return {
    ...destination,
    estimatedCost: getDestinationTripEstimate(destination, {
      days: estimateDays,
      originCode: defaultOriginCode,
      travelStyle: defaultTravelStyle,
    }),
    currency: destination.dailyCosts.currency,
    flightCost: originPricing.flightEstimate.average,
    hotelCost: dailyCosts.accommodation * estimateDays,
    foodCost: dailyCosts.food * estimateDays,
    transportCost: dailyCosts.localTransport * estimateDays,
    activitiesCost: dailyCosts.activities * estimateDays,
  };
}

export function normalizeOriginCode(originCode: string | null | undefined): OriginCode {
  const normalized = originCode?.trim().toUpperCase();

  if (!normalized) {
    return defaultOriginCode;
  }

  if (["MONTREAL", "MONTRÉAL"].includes(normalized)) {
    return "YUL";
  }

  if (normalized === "TORONTO") {
    return "YYZ";
  }

  if (normalized === "VANCOUVER") {
    return "YVR";
  }

  return normalized as OriginCode;
}

export function getOriginPricing(destination: Pick<Partial<Destination>, "originPricing" | "flightCost">, originCode?: string) {
  const resolvedOriginCode = normalizeOriginCode(originCode);
  const fallbackCode = getFirstOriginCode(destination.originPricing);
  const legacyFlightEstimate = normalizeMoney(destination.flightCost);

  return (
    destination.originPricing?.[resolvedOriginCode] ??
    destination.originPricing?.[defaultOriginCode] ??
    (fallbackCode ? destination.originPricing?.[fallbackCode] : undefined) ?? {
      originCity: "Montreal",
      originCountry: "Canada",
      currency: "CAD",
      flightEstimate: {
        low: legacyFlightEstimate,
        average: legacyFlightEstimate,
        high: legacyFlightEstimate,
      },
    }
  );
}

export function getFlightEstimate(destination: Pick<Partial<Destination>, "originPricing" | "flightCost">, originCode?: string) {
  const flightEstimate = getOriginPricing(destination, originCode).flightEstimate;
  const average = normalizeMoney(flightEstimate.average);

  return {
    low: normalizeMoney(flightEstimate.low || average),
    average,
    high: normalizeMoney(flightEstimate.high || average),
  };
}

export function getTravelStyleCosts(destination: Pick<Partial<Destination>, "dailyCosts">, travelStyle?: TravelStyle) {
  const dailyCosts = destination.dailyCosts;
  const requestedCosts = dailyCosts?.[travelStyle ?? defaultTravelStyle];
  const fallbackCosts = dailyCosts?.[defaultTravelStyle] ?? dailyCosts?.budget ?? dailyCosts?.luxury;

  return requestedCosts ?? fallbackCosts ?? {
    accommodation: 0,
    food: 0,
    localTransport: 0,
    activities: 0,
    misc: 0,
  };
}

export function getDailyCostTotal(destination: Pick<Partial<Destination>, "dailyCosts">, travelStyle?: TravelStyle) {
  return sumTravelStyleCosts(getTravelStyleCosts(destination, travelStyle));
}

export type CalculateTripEstimateParams = {
  destination: Pick<Partial<Destination>, "originPricing" | "dailyCosts" | "flightCost">;
  numberOfDays?: number;
  originCode?: string;
  travelStyle?: TravelStyle;
  numberOfTravelers?: number;
};

export function calculateTripEstimate({
  destination,
  numberOfDays,
  originCode,
  travelStyle,
  numberOfTravelers,
}: CalculateTripEstimateParams) {
  const normalizedDays = normalizePositiveInteger(numberOfDays, estimateDays);
  const normalizedTravelers = normalizePositiveInteger(numberOfTravelers, defaultTravelers);
  const dailyTotalPerTraveler = getDailyCostTotal(destination, travelStyle);
  const tripDailyTotalPerTraveler = dailyTotalPerTraveler * normalizedDays;
  const flightAveragePerTraveler = getFlightEstimate(destination, originCode).average;
  const flightTotal = flightAveragePerTraveler * normalizedTravelers;
  const dailyTotal = tripDailyTotalPerTraveler * normalizedTravelers;

  return {
    dailyTotalPerTraveler,
    tripDailyTotalPerTraveler,
    flightAveragePerTraveler,
    flightTotal: Math.round(flightTotal),
    dailyTotal: Math.round(dailyTotal),
    totalEstimatedCost: Math.round(flightTotal + dailyTotal),
    numberOfDays: normalizedDays,
    numberOfTravelers: normalizedTravelers,
  };
}

export function getDestinationTripEstimate(
  destination: Pick<Partial<Destination>, "originPricing" | "dailyCosts" | "flightCost">,
  {
    days,
    originCode,
    travelStyle,
    travelers,
  }: {
    days?: number;
    originCode?: string;
    travelStyle?: TravelStyle;
    travelers?: number;
  }
) {
  return calculateTripEstimate({
    destination,
    numberOfDays: days,
    originCode,
    travelStyle,
    numberOfTravelers: travelers,
  }).totalEstimatedCost;
}

export function getDestinationCostBreakdown(
  destination: Pick<Partial<Destination>, "originPricing" | "dailyCosts" | "flightCost">,
  {
    days,
    originCode,
    travelStyle,
    travelers,
  }: {
    days?: number;
    originCode?: string;
    travelStyle?: TravelStyle;
    travelers?: number;
  }
) {
  const normalizedDays = normalizePositiveInteger(days, estimateDays);
  const normalizedTravelers = normalizePositiveInteger(travelers, defaultTravelers);
  const dailyCosts = getTravelStyleCosts(destination, travelStyle);

  return {
    flights: getFlightEstimate(destination, originCode).average * normalizedTravelers,
    accommodation: normalizeMoney(dailyCosts.accommodation) * normalizedDays * normalizedTravelers,
    food: normalizeMoney(dailyCosts.food) * normalizedDays * normalizedTravelers,
    localTransport: normalizeMoney(dailyCosts.localTransport) * normalizedDays * normalizedTravelers,
    activities: normalizeMoney(dailyCosts.activities) * normalizedDays * normalizedTravelers,
    misc: normalizeMoney(dailyCosts.misc) * normalizedDays * normalizedTravelers,
  };
}

function normalizeMoney(value: number | null | undefined) {
  return typeof value === "number" && Number.isFinite(value) ? Math.max(0, value) : 0;
}

function normalizePositiveInteger(value: number | null | undefined, fallback: number) {
  return typeof value === "number" && Number.isFinite(value) ? Math.max(1, Math.round(value)) : fallback;
}

export const destinations: Destination[] = [
  buildDestination({
    slug: "japan",
    name: "Japan",
    countryCode: "JP",
    image:
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1600&q=80",
    originPricing: {
      YUL: {
        originCity: "Montreal",
        originCountry: "Canada",
        currency: "CAD",
        flightEstimate: { low: 780, average: 900, high: 1350 },
        seasonalNotes: "Flights are usually cheaper in spring and fall when booked early.",
      },
      YYZ: {
        originCity: "Toronto",
        originCountry: "Canada",
        currency: "CAD",
        flightEstimate: { low: 820, average: 980, high: 1450 },
      },
      YVR: {
        originCity: "Vancouver",
        originCountry: "Canada",
        currency: "CAD",
        flightEstimate: { low: 700, average: 880, high: 1250 },
      },
    },
    dailyCosts: {
      currency: "CAD",
      budget: { accommodation: 55, food: 28, localTransport: 13, activities: 18, misc: 8 },
      midRange: { accommodation: 82, food: 34, localTransport: 18, activities: 26, misc: 12 },
      luxury: { accommodation: 220, food: 95, localTransport: 45, activities: 90, misc: 40 },
    },
    score: 86,
    bestMonths: ["March", "April", "October", "November"],
    travelStyles: ["Culture", "Food", "Cities"],
    weather: "Mild spring and crisp autumn",
    shortDescription:
      "A polished city-and-culture trip with efficient transit, standout food, and strong value when flights are booked early.",
    itineraryPreview: [
      "Tokyo neighborhoods, sushi counters, and skyline viewpoints",
      "Kyoto temples, tea houses, and bamboo forest walks",
      "Osaka street food, markets, and a day trip to Nara",
    ],
    affiliateLinks: [
      {
        type: "Flights",
        title: "Track Tokyo fares",
        description: "Set a mock alert for round-trip flights from Toronto.",
        priceHint: "From CAD 980",
        href: "/results",
      },
      {
        type: "Hotels",
        title: "Compact city hotels",
        description: "Compare central stays near major train stations.",
        priceHint: "CAD 95/night",
        href: "/results",
      },
      {
        type: "eSIM",
        title: "Japan data plan",
        description: "Stay connected for maps, transit, and bookings.",
        priceHint: "From CAD 18",
        href: "/results",
      },
      {
        type: "Activities",
        title: "Temple and food tours",
        description: "Reserve flexible activities before prices rise.",
        priceHint: "From CAD 42",
        href: "/results",
      },
      {
        type: "Insurance",
        title: "Trip protection",
        description: "Mock quote for medical and cancellation coverage.",
        priceHint: "From CAD 54",
        href: "/results",
      },
    ],
    faqs: [
      {
        question: "Is Japan affordable on a mid-range budget?",
        answer:
          "Yes. Rail, food, and business hotels can be very efficient, while flights are the biggest swing factor.",
      },
      {
        question: "Where should first-time visitors stay?",
        answer:
          "Tokyo, Kyoto, and Osaka make a strong first route with easy train connections and varied daily costs.",
      },
    ],
  }),
  buildDestination({
    slug: "portugal",
    name: "Portugal",
    countryCode: "PT",
    image:
      "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1600&q=80",
    originPricing: {
      YUL: {
        originCity: "Montreal",
        originCountry: "Canada",
        currency: "CAD",
        flightEstimate: { low: 600, average: 730, high: 1050 },
        seasonalNotes: "Shoulder-season Lisbon and Porto fares are often meaningfully lower than July and August.",
      },
      YYZ: {
        originCity: "Toronto",
        originCountry: "Canada",
        currency: "CAD",
        flightEstimate: { low: 650, average: 790, high: 1100 },
      },
      YVR: {
        originCity: "Vancouver",
        originCountry: "Canada",
        currency: "CAD",
        flightEstimate: { low: 780, average: 980, high: 1400 },
      },
    },
    dailyCosts: {
      currency: "CAD",
      budget: { accommodation: 45, food: 25, localTransport: 10, activities: 15, misc: 8 },
      midRange: { accommodation: 65, food: 32, localTransport: 14, activities: 28, misc: 12 },
      luxury: { accommodation: 190, food: 85, localTransport: 35, activities: 80, misc: 35 },
    },
    score: 91,
    bestMonths: ["May", "June", "September", "October"],
    travelStyles: ["Coast", "Food", "Relaxed"],
    weather: "Sunny shoulder seasons",
    shortDescription:
      "A high-value European trip with coastlines, walkable cities, affordable food, and excellent shoulder-season pricing.",
    itineraryPreview: [
      "Lisbon viewpoints, tram rides, and seafood dinners",
      "Sintra castles and Atlantic coast day trips",
      "Porto wine cellars, river walks, and tiled streets",
    ],
    affiliateLinks: [
      {
        type: "Flights",
        title: "Lisbon flight watch",
        description: "Mock fare tracking for Portugal shoulder season.",
        priceHint: "From CAD 720",
        href: "/results",
      },
      {
        type: "Hotels",
        title: "Boutique guesthouses",
        description: "Find walkable stays with breakfast included.",
        priceHint: "CAD 82/night",
        href: "/results",
      },
      {
        type: "eSIM",
        title: "EU data pass",
        description: "One plan for Portugal and nearby countries.",
        priceHint: "From CAD 15",
        href: "/results",
      },
      {
        type: "Activities",
        title: "Food and coast tours",
        description: "Book small-group experiences in Lisbon and Porto.",
        priceHint: "From CAD 35",
        href: "/results",
      },
      {
        type: "Insurance",
        title: "Europe coverage",
        description: "Mock travel policy for a 10-day Portugal trip.",
        priceHint: "From CAD 49",
        href: "/results",
      },
    ],
    faqs: [
      {
        question: "What makes Portugal good value?",
        answer:
          "Food, local transit, and guesthouses often cost less than comparable Western European destinations.",
      },
      {
        question: "Which month is best for budget travel?",
        answer:
          "May and October usually balance lower prices, good weather, and fewer peak-season crowds.",
      },
    ],
  }),
  buildDestination({
    slug: "vietnam",
    name: "Vietnam",
    countryCode: "VN",
    image:
      "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1600&q=80",
    originPricing: {
      YUL: {
        originCity: "Montreal",
        originCountry: "Canada",
        currency: "CAD",
        flightEstimate: { low: 760, average: 900, high: 1300 },
        seasonalNotes: "Long-haul sale fares tend to be strongest outside winter holiday weeks.",
      },
      YYZ: {
        originCity: "Toronto",
        originCountry: "Canada",
        currency: "CAD",
        flightEstimate: { low: 790, average: 940, high: 1350 },
      },
      YVR: {
        originCity: "Vancouver",
        originCountry: "Canada",
        currency: "CAD",
        flightEstimate: { low: 680, average: 820, high: 1180 },
      },
    },
    dailyCosts: {
      currency: "CAD",
      budget: { accommodation: 25, food: 14, localTransport: 8, activities: 12, misc: 6 },
      midRange: { accommodation: 40, food: 19, localTransport: 10, activities: 22, misc: 9 },
      luxury: { accommodation: 140, food: 60, localTransport: 25, activities: 70, misc: 25 },
    },
    score: 94,
    bestMonths: ["February", "March", "April", "November"],
    travelStyles: ["Adventure", "Food", "Backpacking"],
    weather: "Warm with regional variation",
    shortDescription:
      "A budget-friendly long-haul choice where local costs are low, food is excellent, and scenic routes stretch every dollar.",
    itineraryPreview: [
      "Hanoi street food, old quarter stays, and coffee stops",
      "Ha Long Bay cruise or Ninh Binh limestone landscapes",
      "Hoi An lantern nights, beaches, and tailoring markets",
    ],
    affiliateLinks: [
      {
        type: "Flights",
        title: "Hanoi and Ho Chi Minh fares",
        description: "Compare open-jaw long-haul mock routes.",
        priceHint: "From CAD 910",
        href: "/results",
      },
      {
        type: "Hotels",
        title: "Value stays",
        description: "Guesthouses and boutique hotels under budget.",
        priceHint: "CAD 45/night",
        href: "/results",
      },
      {
        type: "eSIM",
        title: "Vietnam data pack",
        description: "Maps and messaging for city-to-city travel.",
        priceHint: "From CAD 12",
        href: "/results",
      },
      {
        type: "Activities",
        title: "Cruises and cooking classes",
        description: "Add memorable activities without breaking budget.",
        priceHint: "From CAD 28",
        href: "/results",
      },
      {
        type: "Insurance",
        title: "Adventure coverage",
        description: "Mock quote for long-haul travel protection.",
        priceHint: "From CAD 57",
        href: "/results",
      },
    ],
    faqs: [
      {
        question: "Why is the total still high if Vietnam is cheap?",
        answer:
          "The flight is the main cost. Once there, hotels, food, and transport keep daily spend low.",
      },
      {
        question: "How long should I stay?",
        answer:
          "Ten to fourteen days gives enough time to spread the flight cost across several regions.",
      },
    ],
  }),
];

export function getDestination(slug: string) {
  return destinations.find((destination) => destination.slug === slug);
}

export { formatMoney } from "@/lib/format-money";
