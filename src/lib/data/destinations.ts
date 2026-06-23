export type AffiliateLink = {
  type: "Flights" | "Hotels" | "eSIM" | "Activities" | "Insurance";
  title: string;
  description: string;
  priceHint: string;
  href: string;
};

export type Destination = {
  slug: string;
  name: string;
  countryCode: string;
  image: string;
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

export const destinations: Destination[] = [
  {
    slug: "japan",
    name: "Japan",
    countryCode: "JP",
    image:
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1600&q=80",
    estimatedCost: 2420,
    currency: "CAD",
    score: 86,
    flightCost: 980,
    hotelCost: 760,
    foodCost: 330,
    transportCost: 210,
    activitiesCost: 140,
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
  },
  {
    slug: "portugal",
    name: "Portugal",
    countryCode: "PT",
    image:
      "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1600&q=80",
    estimatedCost: 1880,
    currency: "CAD",
    score: 91,
    flightCost: 720,
    hotelCost: 610,
    foodCost: 260,
    transportCost: 120,
    activitiesCost: 170,
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
  },
  {
    slug: "vietnam",
    name: "Vietnam",
    countryCode: "VN",
    image:
      "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1600&q=80",
    estimatedCost: 1650,
    currency: "CAD",
    score: 94,
    flightCost: 910,
    hotelCost: 330,
    foodCost: 160,
    transportCost: 110,
    activitiesCost: 140,
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
  },
];

export function getDestination(slug: string) {
  return destinations.find((destination) => destination.slug === slug);
}

export function formatMoney(amount: number, currency = "CAD") {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}
