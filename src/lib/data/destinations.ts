export type AffiliateLink = {
  type: "Flights" | "Hotels" | "eSIM" | "Activities" | "Insurance";
  title: string;
  description: string;
  priceHint: string;
  href: string;
  provider?: string;
  partner?: string;
  placement?: string;
  isExternal?: boolean;
  rel?: string;
  target?: string;
};

export type OriginCode = "YUL" | "YYZ" | "YVR" | "YQB" | "YOW" | "YYC" | "NYC" | "BOS" | "CHI" | (string & {});

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
    currency: "CAD";
    flightEstimate: FlightEstimate;
    seasonalNotes?: string;
  }
>;

export type TravelStyle = "budget" | "midRange" | "luxury";
export type DataConfidence = "high" | "medium" | "low";

export type TravelStyleCosts = {
  accommodation: number;
  food: number;
  localTransport: number;
  activities: number;
  misc: number;
};

export type DailyCosts = {
  currency: "CAD";
  budget: TravelStyleCosts;
  midRange: TravelStyleCosts;
  luxury: TravelStyleCosts;
};

export type Destination = {
  slug: string;
  name: string;
  cityName?: string;
  countryName?: string;
  parentCountrySlug?: string;
  destinationKind?: "country" | "city";
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
  dataConfidence: DataConfidence;
  lastUpdated: string;
  sourceNotes: string[];
  shortDescription: string;
  itineraryPreview: string[];
  affiliateLinks: AffiliateLink[];
  faqs: {
    question: string;
    answer: string;
  }[];
};

type DestinationSeed = {
  slug: string;
  name: string;
  countryCode: string;
  image: string;
  flightAverage: Record<"YUL" | "YYZ" | "YVR", number>;
  dailyTotals: Record<TravelStyle, number>;
  score: number;
  bestMonths: string[];
  travelStyles: string[];
  weather: string;
  dataConfidence: DataConfidence;
  shortDescription: string;
  itineraryPreview: string[];
  seasonalNotes?: string;
};

const defaultOriginCode = "YUL";
const defaultTravelStyle: TravelStyle = "midRange";
const estimateDays = 10;
const defaultTravelers = 1;
const lastUpdated = "2026-06-24";

const origins = {
  YUL: { originCity: "Montreal", originCountry: "Canada" },
  YYZ: { originCity: "Toronto", originCountry: "Canada" },
  YVR: { originCity: "Vancouver", originCountry: "Canada" },
  YQB: { originCity: "Québec", originCountry: "Canada" },
  YOW: { originCity: "Ottawa", originCountry: "Canada" },
  YYC: { originCity: "Calgary", originCountry: "Canada" },
  NYC: { originCity: "New York", originCountry: "United States" },
  BOS: { originCity: "Boston", originCountry: "United States" },
  CHI: { originCity: "Chicago", originCountry: "United States" },
} as const;

const destinationSeeds: DestinationSeed[] = [
  {
    slug: "japan",
    name: "Japan",
    countryCode: "JP",
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1600&q=80",
    flightAverage: { YUL: 900, YYZ: 980, YVR: 880 },
    dailyTotals: { budget: 122, midRange: 172, luxury: 490 },
    score: 86,
    bestMonths: ["March", "April", "October", "November"],
    travelStyles: ["Culture", "Food", "Cities"],
    weather: "Mild spring and crisp autumn",
    dataConfidence: "medium",
    shortDescription: "A polished city-and-culture trip with efficient transit, standout food, and strong value when flights are booked early.",
    itineraryPreview: ["Tokyo neighborhoods, food halls, and skyline viewpoints", "Kyoto temples, tea houses, and bamboo walks", "Osaka markets, street food, and a Nara day trip"],
    seasonalNotes: "Spring and autumn are strong value windows when booked early; cherry blossom weeks can price higher.",
  },
  {
    slug: "portugal",
    name: "Portugal",
    countryCode: "PT",
    image: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1600&q=80",
    flightAverage: { YUL: 730, YYZ: 790, YVR: 980 },
    dailyTotals: { budget: 103, midRange: 151, luxury: 425 },
    score: 91,
    bestMonths: ["May", "June", "September", "October"],
    travelStyles: ["Coast", "Food", "Relaxed"],
    weather: "Sunny shoulder seasons",
    dataConfidence: "high",
    shortDescription: "A high-value European trip with coastlines, walkable cities, affordable food, and excellent shoulder-season pricing.",
    itineraryPreview: ["Lisbon viewpoints, seafood, and tram rides", "Sintra castles and Atlantic coast day trips", "Porto river walks, wine cellars, and tiled streets"],
    seasonalNotes: "Lisbon and Porto are often better value in spring and fall than in July and August.",
  },
  {
    slug: "vietnam",
    name: "Vietnam",
    countryCode: "VN",
    image: "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1600&q=80",
    flightAverage: { YUL: 900, YYZ: 940, YVR: 820 },
    dailyTotals: { budget: 65, midRange: 100, luxury: 320 },
    score: 94,
    bestMonths: ["February", "March", "April", "November"],
    travelStyles: ["Adventure", "Food", "Backpacking"],
    weather: "Warm with regional variation",
    dataConfidence: "medium",
    shortDescription: "A budget-friendly long-haul choice where low local costs, excellent food, and scenic routes stretch every dollar.",
    itineraryPreview: ["Hanoi street food, old quarter stays, and coffee stops", "Ninh Binh limestone landscapes or Ha Long Bay", "Hoi An lantern nights, beaches, and markets"],
    seasonalNotes: "Long-haul sale fares tend to be strongest outside winter holiday weeks.",
  },
  {
    slug: "mexico",
    name: "Mexico",
    countryCode: "MX",
    image: "https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?auto=format&fit=crop&w=1600&q=80",
    flightAverage: { YUL: 560, YYZ: 520, YVR: 610 },
    dailyTotals: { budget: 78, midRange: 132, luxury: 360 },
    score: 90,
    bestMonths: ["January", "February", "March", "November"],
    travelStyles: ["Food", "Culture", "Beach", "Cities"],
    weather: "Dry-season warmth in many regions",
    dataConfidence: "high",
    shortDescription: "A flexible Canada-friendly option with strong flight access, rich food culture, beaches, and budget-friendly inland cities.",
    itineraryPreview: ["Mexico City museums, markets, and food neighborhoods", "Oaxaca culture, mezcal, and day trips", "Beach time on the Pacific or Caribbean coast"],
  },
  {
    slug: "colombia",
    name: "Colombia",
    countryCode: "CO",
    image: "https://images.unsplash.com/photo-1544989164-31dc3c645987?auto=format&fit=crop&w=1600&q=80",
    flightAverage: { YUL: 720, YYZ: 680, YVR: 820 },
    dailyTotals: { budget: 62, midRange: 108, luxury: 305 },
    score: 88,
    bestMonths: ["January", "February", "July", "August"],
    travelStyles: ["Culture", "Food", "Adventure"],
    weather: "Springlike cities and warm coasts",
    dataConfidence: "medium",
    shortDescription: "A high-value South American pick where vibrant cities, coffee country, and Caribbean coastlines keep daily spend manageable.",
    itineraryPreview: ["Bogota museums and food markets", "Medellin neighborhoods and coffee day trips", "Cartagena walls, islands, and Caribbean evenings"],
  },
  {
    slug: "guatemala",
    name: "Guatemala",
    countryCode: "GT",
    image: "https://images.unsplash.com/photo-1697382803428-71666ed66c94?auto=format&fit=crop&w=1600&q=80",
    flightAverage: { YUL: 720, YYZ: 700, YVR: 820 },
    dailyTotals: { budget: 58, midRange: 96, luxury: 260 },
    score: 84,
    bestMonths: ["January", "February", "March", "November"],
    travelStyles: ["Adventure", "Culture", "Backpacking"],
    weather: "Dry-season highland comfort",
    dataConfidence: "medium",
    shortDescription: "A compact Central America trip with volcanoes, lakes, Maya sites, and excellent value for active travelers.",
    itineraryPreview: ["Antigua streets, cafes, and volcano viewpoints", "Lake Atitlan villages and boat rides", "Tikal ruins and jungle lodges"],
  },
  {
    slug: "peru",
    name: "Peru",
    countryCode: "PE",
    image: "https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=1600&q=80",
    flightAverage: { YUL: 820, YYZ: 780, YVR: 920 },
    dailyTotals: { budget: 70, midRange: 118, luxury: 330 },
    score: 89,
    bestMonths: ["May", "June", "September", "October"],
    travelStyles: ["Adventure", "Culture", "Food"],
    weather: "Dry Andes travel windows",
    dataConfidence: "medium",
    shortDescription: "A bucket-list destination where food, culture, and Andes scenery can fit a realistic budget if major tours are planned early.",
    itineraryPreview: ["Lima food neighborhoods and coastal views", "Cusco acclimatization, markets, and ruins", "Sacred Valley and Machu Picchu planning days"],
  },
  {
    slug: "morocco",
    name: "Morocco",
    countryCode: "MA",
    image: "https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?auto=format&fit=crop&w=1600&q=80",
    flightAverage: { YUL: 760, YYZ: 820, YVR: 1050 },
    dailyTotals: { budget: 68, midRange: 120, luxury: 330 },
    score: 87,
    bestMonths: ["March", "April", "October", "November"],
    travelStyles: ["Culture", "Food", "Adventure"],
    weather: "Warm days and cooler evenings",
    dataConfidence: "medium",
    shortDescription: "A sensory North Africa route with medinas, desert edges, and riads that can deliver strong value outside summer heat.",
    itineraryPreview: ["Marrakesh souks, gardens, and rooftop meals", "Atlas foothills or desert-edge excursions", "Fes medina lanes and local craft stops"],
  },
  {
    slug: "turkey",
    name: "Turkey",
    countryCode: "TR",
    image: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=1600&q=80",
    flightAverage: { YUL: 870, YYZ: 890, YVR: 1120 },
    dailyTotals: { budget: 82, midRange: 138, luxury: 365 },
    score: 89,
    bestMonths: ["April", "May", "September", "October"],
    travelStyles: ["Culture", "Food", "Cities"],
    weather: "Comfortable shoulder seasons",
    dataConfidence: "medium",
    shortDescription: "A strong value bridge between Europe and Asia with layered history, excellent food, and varied regional costs.",
    itineraryPreview: ["Istanbul mosques, ferries, markets, and meze", "Cappadocia valleys and balloon-view mornings", "Aegean ruins, coast towns, and day trips"],
  },
  {
    slug: "thailand",
    name: "Thailand",
    countryCode: "TH",
    image: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=1600&q=80",
    flightAverage: { YUL: 980, YYZ: 1020, YVR: 900 },
    dailyTotals: { budget: 70, midRange: 120, luxury: 360 },
    score: 93,
    bestMonths: ["January", "February", "March", "November"],
    travelStyles: ["Beach", "Food", "Backpacking", "Relaxed"],
    weather: "Warm dry-season escapes",
    dataConfidence: "medium",
    shortDescription: "A classic budget-first long-haul trip with low daily costs, easy logistics, beaches, cities, and excellent food.",
    itineraryPreview: ["Bangkok temples, food courts, and canal rides", "Chiang Mai markets and mountain day trips", "Island beaches, snorkeling, and relaxed stays"],
  },
  {
    slug: "indonesia",
    name: "Indonesia",
    countryCode: "ID",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1600&q=80",
    flightAverage: { YUL: 1120, YYZ: 1160, YVR: 980 },
    dailyTotals: { budget: 68, midRange: 125, luxury: 390 },
    score: 88,
    bestMonths: ["May", "June", "September", "October"],
    travelStyles: ["Beach", "Culture", "Adventure", "Relaxed"],
    weather: "Dry-season island weather",
    dataConfidence: "medium",
    shortDescription: "A long-haul destination where the flight is the hurdle but daily costs can stay low across islands and guesthouse routes.",
    itineraryPreview: ["Bali rice terraces, beaches, and cafes", "Java temples, trains, and volcano viewpoints", "Island hopping or snorkeling days"],
  },
  {
    slug: "malaysia",
    name: "Malaysia",
    countryCode: "MY",
    image: "https://images.unsplash.com/photo-1508964942454-1a56651d54ac?auto=format&fit=crop&w=1600&q=80",
    flightAverage: { YUL: 1050, YYZ: 1080, YVR: 940 },
    dailyTotals: { budget: 66, midRange: 112, luxury: 330 },
    score: 86,
    bestMonths: ["February", "March", "June", "July"],
    travelStyles: ["Food", "Cities", "Nature"],
    weather: "Tropical with regional dry windows",
    dataConfidence: "medium",
    shortDescription: "An underrated Asia value pick with excellent food, modern cities, island options, and manageable local costs.",
    itineraryPreview: ["Kuala Lumpur food courts, towers, and transit-friendly stays", "Penang street food and heritage lanes", "Rainforest, island, or Cameron Highlands extensions"],
  },
  {
    slug: "philippines",
    name: "Philippines",
    countryCode: "PH",
    image: "https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?auto=format&fit=crop&w=1600&q=80",
    flightAverage: { YUL: 1120, YYZ: 1160, YVR: 980 },
    dailyTotals: { budget: 72, midRange: 125, luxury: 360 },
    score: 84,
    bestMonths: ["January", "February", "March", "April"],
    travelStyles: ["Beach", "Adventure", "Relaxed"],
    weather: "Dry-season island conditions",
    dataConfidence: "medium",
    shortDescription: "A beach-heavy trip with higher flight costs but good local value once island transfers are planned realistically.",
    itineraryPreview: ["Manila arrival buffer and onward flight planning", "Palawan lagoons, beaches, and boat tours", "Cebu, Bohol, or Siargao island stays"],
  },
  {
    slug: "cambodia",
    name: "Cambodia",
    countryCode: "KH",
    image: "https://images.unsplash.com/photo-1559628233-100c798642d4?auto=format&fit=crop&w=1600&q=80",
    flightAverage: { YUL: 1060, YYZ: 1080, YVR: 920 },
    dailyTotals: { budget: 55, midRange: 90, luxury: 260 },
    score: 82,
    bestMonths: ["January", "February", "November", "December"],
    travelStyles: ["Culture", "Backpacking", "Food"],
    weather: "Dry and warm travel season",
    dataConfidence: "medium",
    shortDescription: "One of the lowest daily-cost options in the dataset, best for travelers who want culture and simple logistics after a long flight.",
    itineraryPreview: ["Siem Reap temples, markets, and sunrise planning", "Phnom Penh history, riverfront walks, and cafes", "Kampot or island downtime if time allows"],
  },
  {
    slug: "spain",
    name: "Spain",
    countryCode: "ES",
    image: "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?auto=format&fit=crop&w=1600&q=80",
    flightAverage: { YUL: 760, YYZ: 820, YVR: 1030 },
    dailyTotals: { budget: 118, midRange: 185, luxury: 500 },
    score: 90,
    bestMonths: ["April", "May", "September", "October"],
    travelStyles: ["Food", "Culture", "Cities", "Coast"],
    weather: "Warm shoulder-season city weather",
    dataConfidence: "high",
    shortDescription: "A versatile Europe pick where shoulder-season flights, tapas cities, and train routes create strong budget control.",
    itineraryPreview: ["Madrid museums, markets, and day trips", "Barcelona architecture and beach walks", "Andalusia cities, tapas, and historic neighborhoods"],
  },
  {
    slug: "greece",
    name: "Greece",
    countryCode: "GR",
    image: "https://images.unsplash.com/photo-1504512485720-7d83a16ee930?auto=format&fit=crop&w=1600&q=80",
    flightAverage: { YUL: 890, YYZ: 920, YVR: 1160 },
    dailyTotals: { budget: 120, midRange: 195, luxury: 560 },
    score: 88,
    bestMonths: ["May", "June", "September", "October"],
    travelStyles: ["Beach", "Culture", "Relaxed"],
    weather: "Sunny shoulder seasons",
    dataConfidence: "medium",
    shortDescription: "A culture-and-islands trip that becomes much more budget-friendly outside the peak summer island rush.",
    itineraryPreview: ["Athens ruins, neighborhoods, and food stops", "Ferry planning for one or two islands", "Beach days, village walks, and sunset viewpoints"],
  },
  {
    slug: "italy",
    name: "Italy",
    countryCode: "IT",
    image: "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?auto=format&fit=crop&w=1600&q=80",
    flightAverage: { YUL: 830, YYZ: 870, YVR: 1090 },
    dailyTotals: { budget: 130, midRange: 210, luxury: 590 },
    score: 92,
    bestMonths: ["April", "May", "September", "October"],
    travelStyles: ["Culture", "Food", "Cities"],
    weather: "Comfortable spring and fall",
    dataConfidence: "high",
    shortDescription: "A higher-value classic where trains, regional food, and shoulder-season stays help manage a naturally higher Europe budget.",
    itineraryPreview: ["Rome ruins, piazzas, and trattoria meals", "Florence art, markets, and Tuscan day trips", "Venice, Naples, or coastal add-ons depending on budget"],
  },
  {
    slug: "france",
    name: "France",
    countryCode: "FR",
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1600&q=80",
    flightAverage: { YUL: 760, YYZ: 820, YVR: 1060 },
    dailyTotals: { budget: 140, midRange: 230, luxury: 650 },
    score: 90,
    bestMonths: ["April", "May", "September", "October"],
    travelStyles: ["Culture", "Food", "Cities"],
    weather: "Mild shoulder-season touring",
    dataConfidence: "high",
    shortDescription: "A higher-cost Europe staple where value depends on timing, neighborhood choice, and balancing Paris with regional stops.",
    itineraryPreview: ["Paris museums, cafes, and neighborhood walks", "Loire, Normandy, or Provence train extensions", "Markets, bakeries, and low-cost picnic meals"],
  },
  {
    slug: "ireland",
    name: "Ireland",
    countryCode: "IE",
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80",
    flightAverage: { YUL: 720, YYZ: 780, YVR: 980 },
    dailyTotals: { budget: 135, midRange: 220, luxury: 560 },
    score: 83,
    bestMonths: ["May", "June", "September"],
    travelStyles: ["Nature", "Culture", "Road Trip"],
    weather: "Green, mild, and changeable",
    dataConfidence: "medium",
    shortDescription: "A scenic but not cheap trip where flight access can be reasonable and daily costs need careful planning.",
    itineraryPreview: ["Dublin history, pubs, and walkable neighborhoods", "Galway, Cliffs of Moher, and west-coast drives", "Small-town stays and castle or music stops"],
  },
  {
    slug: "netherlands",
    name: "Netherlands",
    countryCode: "NL",
    image: "https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?auto=format&fit=crop&w=1600&q=80",
    flightAverage: { YUL: 780, YYZ: 820, YVR: 1040 },
    dailyTotals: { budget: 145, midRange: 235, luxury: 620 },
    score: 82,
    bestMonths: ["April", "May", "September"],
    travelStyles: ["Cities", "Culture", "Food"],
    weather: "Cool spring and early fall",
    dataConfidence: "high",
    shortDescription: "A compact, transit-friendly Europe option with high accommodation costs but efficient trip logistics.",
    itineraryPreview: ["Amsterdam canals, museums, and markets", "Haarlem, Utrecht, or Delft day trips", "Bike routes, design shops, and casual food halls"],
  },
  {
    slug: "croatia",
    name: "Croatia",
    countryCode: "HR",
    image: "https://images.unsplash.com/photo-1575540291670-8d3b26f7d327?auto=format&fit=crop&w=1600&q=80",
    flightAverage: { YUL: 900, YYZ: 950, YVR: 1160 },
    dailyTotals: { budget: 105, midRange: 175, luxury: 480 },
    score: 86,
    bestMonths: ["May", "June", "September", "October"],
    travelStyles: ["Coast", "Culture", "Relaxed"],
    weather: "Sunny Adriatic shoulder season",
    dataConfidence: "medium",
    shortDescription: "An Adriatic-value pick when visited outside peak summer, with coastal towns, ferries, and historic cities.",
    itineraryPreview: ["Split waterfront, old town, and island day trips", "Dubrovnik walls and nearby beaches", "Plitvice or Istria if routing allows"],
  },
  {
    slug: "czechia",
    name: "Czechia",
    countryCode: "CZ",
    image: "https://images.unsplash.com/photo-1541849546-216549ae216d?auto=format&fit=crop&w=1600&q=80",
    flightAverage: { YUL: 860, YYZ: 900, YVR: 1120 },
    dailyTotals: { budget: 88, midRange: 148, luxury: 390 },
    score: 85,
    bestMonths: ["April", "May", "September", "October"],
    travelStyles: ["Cities", "Culture", "Food"],
    weather: "Cool and comfortable shoulder months",
    dataConfidence: "medium",
    shortDescription: "A Central Europe value destination where Prague and smaller towns offer strong culture at lower daily costs than Western Europe.",
    itineraryPreview: ["Prague old town, river walks, and beer halls", "Cesky Krumlov or Kutna Hora day trips", "Local cafes, museums, and tram-friendly neighborhoods"],
  },
  {
    slug: "hungary",
    name: "Hungary",
    countryCode: "HU",
    image: "https://images.unsplash.com/photo-1549877452-9c387954fbc2?auto=format&fit=crop&w=1600&q=80",
    flightAverage: { YUL: 850, YYZ: 900, YVR: 1120 },
    dailyTotals: { budget: 82, midRange: 140, luxury: 370 },
    score: 86,
    bestMonths: ["April", "May", "September", "October"],
    travelStyles: ["Cities", "Culture", "Food"],
    weather: "Mild Danube shoulder seasons",
    dataConfidence: "medium",
    shortDescription: "A strong budget-minded Europe option centered on Budapest, thermal baths, food halls, and lower hotel costs.",
    itineraryPreview: ["Budapest baths, markets, and Danube viewpoints", "Ruin bars, cafes, and tram routes", "Lake Balaton or wine-country day trips"],
  },
  {
    slug: "south-korea",
    name: "South Korea",
    countryCode: "KR",
    image: "https://images.unsplash.com/photo-1546874177-9e664107314e?auto=format&fit=crop&w=1600&q=80",
    flightAverage: { YUL: 980, YYZ: 1050, YVR: 900 },
    dailyTotals: { budget: 105, midRange: 165, luxury: 450 },
    score: 87,
    bestMonths: ["April", "May", "October", "November"],
    travelStyles: ["Cities", "Food", "Culture"],
    weather: "Clear spring and autumn",
    dataConfidence: "medium",
    shortDescription: "A high-energy city-and-food trip with efficient transit, strong safety, and better value than many comparable developed markets.",
    itineraryPreview: ["Seoul palaces, markets, cafes, and night views", "DMZ, Suwon, or hiking day trips", "Busan beaches, seafood, and coastal neighborhoods"],
  },
  {
    slug: "taiwan",
    name: "Taiwan",
    countryCode: "TW",
    image: "https://images.unsplash.com/photo-1470004914212-05527e49370b?auto=format&fit=crop&w=1600&q=80",
    flightAverage: { YUL: 1030, YYZ: 1080, YVR: 920 },
    dailyTotals: { budget: 82, midRange: 138, luxury: 380 },
    score: 88,
    bestMonths: ["March", "April", "October", "November"],
    travelStyles: ["Food", "Cities", "Nature"],
    weather: "Warm shoulder months",
    dataConfidence: "medium",
    shortDescription: "A compact, food-forward Asia pick where excellent transit and reasonable local costs make planning straightforward.",
    itineraryPreview: ["Taipei night markets, temples, and tea houses", "Jiufen, hot springs, or coastal day trips", "Taroko, Tainan, or Alishan extensions"],
  },
  {
    slug: "australia",
    name: "Australia",
    countryCode: "AU",
    image: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=1600&q=80",
    flightAverage: { YUL: 1600, YYZ: 1650, YVR: 1350 },
    dailyTotals: { budget: 160, midRange: 260, luxury: 700 },
    score: 78,
    bestMonths: ["March", "April", "October", "November"],
    travelStyles: ["Nature", "Cities", "Beach"],
    weather: "Mild shoulder-season touring",
    dataConfidence: "medium",
    shortDescription: "A higher-cost long-haul trip where the experience is excellent but both flights and daily costs demand a larger budget.",
    itineraryPreview: ["Sydney harbor, beaches, and neighborhoods", "Great Barrier Reef or coastal Queensland planning", "Melbourne food, laneways, and day trips"],
  },
  {
    slug: "new-zealand",
    name: "New Zealand",
    countryCode: "NZ",
    image: "https://images.unsplash.com/photo-1469521669194-babb45599def?auto=format&fit=crop&w=1600&q=80",
    flightAverage: { YUL: 1700, YYZ: 1750, YVR: 1450 },
    dailyTotals: { budget: 155, midRange: 255, luxury: 690 },
    score: 77,
    bestMonths: ["February", "March", "November", "December"],
    travelStyles: ["Nature", "Adventure", "Road Trip"],
    weather: "Long daylight and mild outdoors",
    dataConfidence: "medium",
    shortDescription: "A scenic, high-cost adventure trip best suited to travelers with a larger budget and enough days to justify the flight.",
    itineraryPreview: ["Auckland arrival and North Island food stops", "Rotorua, geothermal areas, or Hobbiton day trips", "Queenstown, Fiordland, and South Island road planning"],
  },
  {
    slug: "dominican-republic",
    name: "Dominican Republic",
    countryCode: "DO",
    image: "https://images.unsplash.com/photo-1635450695849-bde4bea19b5f?auto=format&fit=crop&w=1600&q=80",
    flightAverage: { YUL: 560, YYZ: 540, YVR: 760 },
    dailyTotals: { budget: 85, midRange: 145, luxury: 390 },
    score: 82,
    bestMonths: ["January", "February", "March", "December"],
    travelStyles: ["Beach", "Relaxed", "Food"],
    weather: "Warm winter beach weather",
    dataConfidence: "medium",
    shortDescription: "A practical Caribbean escape with strong Canadian flight access and flexible hotel choices across budget levels.",
    itineraryPreview: ["Santo Domingo culture and food stops", "Punta Cana or Samana beach base", "Waterfalls, boat trips, or relaxed resort days"],
  },
  {
    slug: "costa-rica",
    name: "Costa Rica",
    countryCode: "CR",
    image: "https://images.unsplash.com/photo-1518182170546-07661fd94144?auto=format&fit=crop&w=1600&q=80",
    flightAverage: { YUL: 700, YYZ: 680, YVR: 820 },
    dailyTotals: { budget: 105, midRange: 175, luxury: 480 },
    score: 85,
    bestMonths: ["January", "February", "March", "April"],
    travelStyles: ["Nature", "Adventure", "Beach"],
    weather: "Dry-season nature travel",
    dataConfidence: "medium",
    shortDescription: "A nature-first Central America trip with good flight access, higher local costs, and excellent wildlife and beach variety.",
    itineraryPreview: ["Arenal volcano, hot springs, and hanging bridges", "Monteverde cloud forest walks", "Pacific or Caribbean beach stays"],
  },
  {
    slug: "panama",
    name: "Panama",
    countryCode: "PA",
    image: "https://images.unsplash.com/photo-1571771019784-3ff35f4f4277?auto=format&fit=crop&w=1600&q=80",
    flightAverage: { YUL: 670, YYZ: 650, YVR: 800 },
    dailyTotals: { budget: 82, midRange: 138, luxury: 380 },
    score: 81,
    bestMonths: ["January", "February", "March", "December"],
    travelStyles: ["Cities", "Beach", "Nature"],
    weather: "Dry-season tropical travel",
    dataConfidence: "medium",
    shortDescription: "A compact and practical warm-weather trip combining Panama City, beaches, rainforests, and manageable flight costs.",
    itineraryPreview: ["Panama City skyline, Casco Viejo, and canal visit", "Rainforest, islands, or beach extensions", "Coffee highlands or Bocas del Toro if time allows"],
  },
  {
    slug: "south-korea",
    name: "South Korea",
    countryCode: "KR",
    image: "https://images.unsplash.com/photo-1538485399081-7c8ed9f6e7f4?auto=format&fit=crop&w=1600&q=80",
    flightAverage: { YUL: 980, YYZ: 1020, YVR: 860 },
    dailyTotals: { budget: 95, midRange: 155, luxury: 430 },
    score: 88,
    bestMonths: ["April", "May", "October", "November"],
    travelStyles: ["Cities", "Food", "Culture"],
    weather: "Comfortable spring and autumn",
    dataConfidence: "medium",
    shortDescription: "A polished East Asia trip with strong transit, food markets, design districts, and manageable daily costs outside peak weeks.",
    itineraryPreview: ["Seoul palaces, markets, and neighborhoods", "Busan coast, food alleys, and temple stops", "DMZ, Jeonju, or Gyeongju extensions"],
  },
  {
    slug: "taiwan",
    name: "Taiwan",
    countryCode: "TW",
    image: "https://images.unsplash.com/photo-1470004914212-05527e49370b?auto=format&fit=crop&w=1600&q=80",
    flightAverage: { YUL: 1040, YYZ: 1080, YVR: 880 },
    dailyTotals: { budget: 78, midRange: 128, luxury: 350 },
    score: 86,
    bestMonths: ["March", "April", "October", "November"],
    travelStyles: ["Food", "Cities", "Nature"],
    weather: "Warm shoulder seasons",
    dataConfidence: "medium",
    shortDescription: "A food-first island trip where night markets, rail routes, and compact logistics help offset long-haul flights.",
    itineraryPreview: ["Taipei markets, temples, and day trips", "Taroko or east coast scenery", "Tainan food, heritage lanes, and cafes"],
  },
  {
    slug: "laos",
    name: "Laos",
    countryCode: "LA",
    image: "https://images.unsplash.com/photo-1570366583862-f91883984fde?auto=format&fit=crop&w=1600&q=80",
    flightAverage: { YUL: 1120, YYZ: 1140, YVR: 980 },
    dailyTotals: { budget: 52, midRange: 88, luxury: 240 },
    score: 80,
    bestMonths: ["January", "February", "November", "December"],
    travelStyles: ["Backpacking", "Culture", "Nature"],
    weather: "Dry and warm travel season",
    dataConfidence: "medium",
    shortDescription: "A slow-travel Southeast Asia option with very low daily costs, river towns, temples, and simple guesthouse routes.",
    itineraryPreview: ["Luang Prabang temples and waterfalls", "Mekong river days and markets", "Vang Vieng scenery or Vientiane stops"],
  },
  {
    slug: "sri-lanka",
    name: "Sri Lanka",
    countryCode: "LK",
    image: "https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=1600&q=80",
    flightAverage: { YUL: 1180, YYZ: 1200, YVR: 1080 },
    dailyTotals: { budget: 62, midRange: 108, luxury: 310 },
    score: 84,
    bestMonths: ["January", "February", "March", "August"],
    travelStyles: ["Nature", "Beach", "Culture"],
    weather: "Regional dry-season windows",
    dataConfidence: "medium",
    shortDescription: "A varied island route with beaches, tea country, rail journeys, wildlife, and attractive local costs after the flight.",
    itineraryPreview: ["Colombo arrival and south coast beaches", "Kandy, Ella, and hill-country trains", "Safari, surf, or ancient city extensions"],
  },
  {
    slug: "india",
    name: "India",
    countryCode: "IN",
    image: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1600&q=80",
    flightAverage: { YUL: 980, YYZ: 1040, YVR: 1120 },
    dailyTotals: { budget: 58, midRange: 105, luxury: 300 },
    score: 85,
    bestMonths: ["January", "February", "March", "November"],
    travelStyles: ["Culture", "Food", "Cities"],
    weather: "Cooler dry-season touring",
    dataConfidence: "medium",
    shortDescription: "A high-intensity, high-value trip where low daily costs can stretch budgets if route scope is kept realistic.",
    itineraryPreview: ["Delhi arrival, markets, and historic sites", "Agra, Jaipur, and Rajasthan planning", "Kerala, Mumbai, or Varanasi add-ons"],
  },
  {
    slug: "egypt",
    name: "Egypt",
    countryCode: "EG",
    image: "https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?auto=format&fit=crop&w=1600&q=80",
    flightAverage: { YUL: 920, YYZ: 960, YVR: 1160 },
    dailyTotals: { budget: 70, midRange: 125, luxury: 360 },
    score: 82,
    bestMonths: ["January", "February", "March", "November"],
    travelStyles: ["Culture", "History", "Adventure"],
    weather: "Milder winter touring",
    dataConfidence: "medium",
    shortDescription: "A history-heavy trip where guides, internal transport, and major sites matter more than the low everyday cost baseline.",
    itineraryPreview: ["Cairo museums, pyramids, and markets", "Luxor temples and Nile planning", "Red Sea or Alexandria extensions"],
  },
  {
    slug: "south-africa",
    name: "South Africa",
    countryCode: "ZA",
    image: "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?auto=format&fit=crop&w=1600&q=80",
    flightAverage: { YUL: 1280, YYZ: 1320, YVR: 1480 },
    dailyTotals: { budget: 92, midRange: 160, luxury: 460 },
    score: 83,
    bestMonths: ["March", "April", "September", "October"],
    travelStyles: ["Nature", "Food", "Road Trip"],
    weather: "Mild shoulder seasons",
    dataConfidence: "medium",
    shortDescription: "A long-haul stretch option with strong value on the ground, especially for Cape Town, wine regions, and scenic road trips.",
    itineraryPreview: ["Cape Town neighborhoods, coast, and Table Mountain", "Winelands or Garden Route driving", "Safari add-on budgeting and logistics"],
  },
  {
    slug: "kenya",
    name: "Kenya",
    countryCode: "KE",
    image: "https://images.unsplash.com/photo-1489392191049-fc10c97e64b6?auto=format&fit=crop&w=1600&q=80",
    flightAverage: { YUL: 1240, YYZ: 1280, YVR: 1420 },
    dailyTotals: { budget: 82, midRange: 150, luxury: 520 },
    score: 80,
    bestMonths: ["January", "February", "June", "September"],
    travelStyles: ["Nature", "Adventure", "Culture"],
    weather: "Dry-season safari windows",
    dataConfidence: "medium",
    shortDescription: "A bucket-list nature trip where the flight and safari components drive the budget more than ordinary daily spending.",
    itineraryPreview: ["Nairobi arrival and national park planning", "Maasai Mara or Amboseli safari costs", "Coast or lake region extension options"],
  },
  {
    slug: "chile",
    name: "Chile",
    countryCode: "CL",
    image: "https://images.unsplash.com/photo-1565945985125-a59c660a9932?auto=format&fit=crop&w=1600&q=85",
    flightAverage: { YUL: 980, YYZ: 940, YVR: 1080 },
    dailyTotals: { budget: 95, midRange: 160, luxury: 430 },
    score: 82,
    bestMonths: ["March", "April", "October", "November"],
    travelStyles: ["Nature", "Adventure", "Cities"],
    weather: "Varied north-to-south seasons",
    dataConfidence: "medium",
    shortDescription: "A scenic South America trip where distance and domestic transfers shape the cost more than Santiago daily spend.",
    itineraryPreview: ["Santiago neighborhoods and Valparaiso", "Atacama desert planning", "Patagonia or lake district add-ons"],
  },
  {
    slug: "argentina",
    name: "Argentina",
    countryCode: "AR",
    image: "https://images.unsplash.com/photo-1589909202802-8f4aadce1849?auto=format&fit=crop&w=1600&q=80",
    flightAverage: { YUL: 980, YYZ: 940, YVR: 1100 },
    dailyTotals: { budget: 78, midRange: 135, luxury: 380 },
    score: 84,
    bestMonths: ["March", "April", "October", "November"],
    travelStyles: ["Food", "Cities", "Nature"],
    weather: "Comfortable shoulder seasons",
    dataConfidence: "medium",
    shortDescription: "A strong-value South America pick with food, cities, and big landscapes, as long as internal flights are budgeted early.",
    itineraryPreview: ["Buenos Aires neighborhoods, steak, and culture", "Mendoza wine country or Iguazu falls", "Patagonia planning if budget allows"],
  },
  {
    slug: "ecuador",
    name: "Ecuador",
    countryCode: "EC",
    image: "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=1600&q=80",
    flightAverage: { YUL: 820, YYZ: 780, YVR: 940 },
    dailyTotals: { budget: 62, midRange: 105, luxury: 300 },
    score: 83,
    bestMonths: ["January", "February", "June", "July"],
    travelStyles: ["Nature", "Culture", "Adventure"],
    weather: "Mild highlands and regional variation",
    dataConfidence: "medium",
    shortDescription: "A compact Andes-and-coast trip with accessible flights, low daily costs, and optional Galapagos budget pressure.",
    itineraryPreview: ["Quito old town and equator day trips", "Otavalo, Cotopaxi, or Baños routes", "Coast or Galapagos extension decisions"],
  },
  {
    slug: "costa-rica",
    name: "Costa Rica",
    countryCode: "CR",
    image: "https://images.unsplash.com/photo-1518182170546-07661fd94144?auto=format&fit=crop&w=1600&q=80",
    flightAverage: { YUL: 720, YYZ: 680, YVR: 820 },
    dailyTotals: { budget: 92, midRange: 155, luxury: 430 },
    score: 85,
    bestMonths: ["January", "February", "March", "November"],
    travelStyles: ["Nature", "Beach", "Family"],
    weather: "Dry-season tropical travel",
    dataConfidence: "high",
    shortDescription: "A nature-and-beach trip with easy flight access, but daily costs are higher than many Central America alternatives.",
    itineraryPreview: ["San Jose arrival and volcano routes", "Cloud forest, wildlife, and hot springs", "Pacific or Caribbean beach stays"],
  },
  {
    slug: "dominican-republic",
    name: "Dominican Republic",
    countryCode: "DO",
    image: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1600&q=80",
    flightAverage: { YUL: 560, YYZ: 540, YVR: 760 },
    dailyTotals: { budget: 80, midRange: 140, luxury: 390 },
    score: 84,
    bestMonths: ["January", "February", "March", "December"],
    travelStyles: ["Beach", "Relaxed", "Food"],
    weather: "Warm winter escape",
    dataConfidence: "high",
    shortDescription: "A Canada-friendly beach option with frequent flights, resort choices, and independent travel routes beyond Punta Cana.",
    itineraryPreview: ["Santo Domingo history and food", "Punta Cana or Samana beach time", "North coast, waterfalls, or surf towns"],
  },
  {
    slug: "belize",
    name: "Belize",
    countryCode: "BZ",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1600&q=80",
    flightAverage: { YUL: 760, YYZ: 720, YVR: 880 },
    dailyTotals: { budget: 88, midRange: 150, luxury: 420 },
    score: 79,
    bestMonths: ["January", "February", "March", "April"],
    travelStyles: ["Beach", "Nature", "Adventure"],
    weather: "Dry-season reef conditions",
    dataConfidence: "medium",
    shortDescription: "A small-country reef and jungle trip where tours and island lodging can lift costs above the regional baseline.",
    itineraryPreview: ["Caye Caulker or Ambergris Caye reef days", "Jungle lodges, caves, and ruins", "Transfer planning between coast and inland"],
  },
  {
    slug: "czechia",
    name: "Czechia",
    countryCode: "CZ",
    image: "https://images.unsplash.com/photo-1541849546-216549ae216d?auto=format&fit=crop&w=1600&q=80",
    flightAverage: { YUL: 820, YYZ: 860, YVR: 1060 },
    dailyTotals: { budget: 95, midRange: 155, luxury: 410 },
    score: 84,
    bestMonths: ["April", "May", "September", "October"],
    travelStyles: ["Cities", "Culture", "Food"],
    weather: "Cool shoulder-season city weather",
    dataConfidence: "high",
    shortDescription: "A Central Europe value pick with Prague as the anchor and lower-cost secondary cities for stronger budget control.",
    itineraryPreview: ["Prague old town, parks, and beer halls", "Cesky Krumlov or Karlovy Vary day trips", "Train links to Vienna, Berlin, or Budapest"],
  },
  {
    slug: "austria",
    name: "Austria",
    countryCode: "AT",
    image: "https://images.unsplash.com/photo-1516550893923-42d28e5677af?auto=format&fit=crop&w=1600&q=80",
    flightAverage: { YUL: 880, YYZ: 920, YVR: 1120 },
    dailyTotals: { budget: 125, midRange: 205, luxury: 560 },
    score: 81,
    bestMonths: ["May", "June", "September", "October"],
    travelStyles: ["Culture", "Nature", "Cities"],
    weather: "Mild city and alpine seasons",
    dataConfidence: "high",
    shortDescription: "A refined Europe trip with higher daily costs, offset by efficient trains, compact routes, and shoulder-season value.",
    itineraryPreview: ["Vienna museums, cafes, and transit", "Salzburg or Wachau Valley additions", "Alpine lakes or Innsbruck if budget allows"],
  },
];

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

function buildOriginPricing(seed: DestinationSeed): OriginPricing {
  return Object.fromEntries(
    Object.entries(buildFlightAverages(seed)).map(([originCode, average]) => [
      originCode,
      {
        ...origins[originCode as keyof typeof origins],
        currency: "CAD" as const,
        flightEstimate: {
          low: roundToNearest(average * 0.82, 10),
          average,
          high: roundToNearest(average * 1.38, 10),
        },
        seasonalNotes:
          seed.seasonalNotes ??
          "Seasonality, seat sales, and booking timing can move flight prices materially from these planning estimates.",
      },
    ])
  ) as OriginPricing;
}

function buildFlightAverages(seed: DestinationSeed): Record<keyof typeof origins, number> {
  return {
    ...seed.flightAverage,
    YQB: roundToNearest(seed.flightAverage.YUL * 1.08 + 40, 10),
    YOW: roundToNearest((seed.flightAverage.YUL + seed.flightAverage.YYZ) / 2 + 30, 10),
    YYC: roundToNearest(seed.flightAverage.YVR * 0.7 + seed.flightAverage.YYZ * 0.3 + 70, 10),
    NYC: roundToNearest(seed.flightAverage.YYZ * 0.92, 10),
    BOS: roundToNearest(((seed.flightAverage.YUL + seed.flightAverage.YYZ) / 2) * 0.95, 10),
    CHI: roundToNearest(seed.flightAverage.YYZ * 0.97, 10),
  };
}

function buildDailyCosts(seed: DestinationSeed): DailyCosts {
  return {
    currency: "CAD",
    budget: splitDailyTotal(seed.dailyTotals.budget),
    midRange: splitDailyTotal(seed.dailyTotals.midRange),
    luxury: splitDailyTotal(seed.dailyTotals.luxury),
  };
}

function splitDailyTotal(total: number): TravelStyleCosts {
  const accommodation = roundToNearest(total * 0.45, 5);
  const food = roundToNearest(total * 0.24, 5);
  const localTransport = roundToNearest(total * 0.1, 5);
  const activities = roundToNearest(total * 0.15, 5);
  const assigned = accommodation + food + localTransport + activities;

  return {
    accommodation,
    food,
    localTransport,
    activities,
    misc: Math.max(5, roundToNearest(total - assigned, 5)),
  };
}

function buildAffiliateLinks(seed: DestinationSeed): AffiliateLink[] {
  const primaryStyle = getPrimaryTravelStyle(seed);
  const tripContext = getTripContext(seed);

  return [
    {
      type: "Flights",
      title: getContextualAffiliateTitle("Flights", seed, primaryStyle),
      description: `Compare provider fares to ${seed.name} against the CAD ${seed.flightAverage.YUL} YUL planning baseline before locking the trip.`,
      priceHint: `Avg. from YUL CAD ${seed.flightAverage.YUL}`,
      href: buildFlightHref(seed),
      provider: process.env.NEXT_PUBLIC_FLIGHTS_AFFILIATE_PROVIDER ?? "Skyscanner",
      partner: process.env.NEXT_PUBLIC_FLIGHTS_AFFILIATE_PARTNER ?? process.env.NEXT_PUBLIC_FLIGHTS_AFFILIATE_PROVIDER ?? "Skyscanner",
      placement: "destination_sidebar",
      isExternal: true,
    },
    {
      type: "Hotels",
      title: getContextualAffiliateTitle("Hotels", seed, primaryStyle),
      description: `Compare Booking.com stays for a ${tripContext} ${seed.name} trip with lodging near CAD ${
        splitDailyTotal(seed.dailyTotals.midRange).accommodation
      } per night.`,
      priceHint: `Mid-range daily stay CAD ${splitDailyTotal(seed.dailyTotals.midRange).accommodation}`,
      href: buildBookingHref(seed),
      provider: "Booking.com",
      partner: "Booking.com",
      placement: "destination_sidebar",
      isExternal: true,
    },
    {
      type: "eSIM",
      title: getContextualAffiliateTitle("eSIM", seed, primaryStyle),
      description: `Get mobile data for maps, transfers, and bookings during a ${tripContext} ${seed.name} itinerary.`,
      priceHint: "Airalo eSIM plans",
      href: buildEsimHref(seed),
      provider: process.env.NEXT_PUBLIC_ESIM_AFFILIATE_PROVIDER ?? "Airalo",
      partner: process.env.NEXT_PUBLIC_ESIM_AFFILIATE_PARTNER ?? process.env.NEXT_PUBLIC_ESIM_AFFILIATE_PROVIDER ?? "Airalo",
      placement: "destination_sidebar",
      isExternal: true,
    },
    {
      type: "Activities",
      title: getContextualAffiliateTitle("Activities", seed, primaryStyle),
      description: `Find ${primaryStyle.toLowerCase()} activities for ${seed.name} while keeping the daily activity budget in view.`,
      priceHint: `Mid-range activities CAD ${splitDailyTotal(seed.dailyTotals.midRange).activities}/day`,
      href: buildActivitiesHref(seed),
      provider: process.env.NEXT_PUBLIC_ACTIVITIES_AFFILIATE_PROVIDER ?? "GetYourGuide",
      partner:
        process.env.NEXT_PUBLIC_ACTIVITIES_AFFILIATE_PARTNER ??
        process.env.NEXT_PUBLIC_ACTIVITIES_AFFILIATE_PROVIDER ??
        "GetYourGuide",
      placement: "destination_sidebar",
      isExternal: true,
    },
    {
      type: "Insurance",
      title: getContextualAffiliateTitle("Insurance", seed, primaryStyle),
      description: `Check coverage for a ${tripContext} ${seed.name} trip, especially if flights and prepaid stays are a large share of the budget.`,
      priceHint: "Verify before booking",
      href: buildInsuranceHref(seed),
      provider: process.env.NEXT_PUBLIC_INSURANCE_AFFILIATE_PROVIDER ?? "Travel insurance",
      partner: process.env.NEXT_PUBLIC_INSURANCE_AFFILIATE_PARTNER ?? process.env.NEXT_PUBLIC_INSURANCE_AFFILIATE_PROVIDER,
      placement: "destination_sidebar",
      isExternal: Boolean(process.env.NEXT_PUBLIC_INSURANCE_AFFILIATE_BASE_URL),
    },
  ];
}

function getPrimaryTravelStyle(seed: DestinationSeed) {
  return seed.travelStyles[0] ?? "Flexible";
}

function getTripContext(seed: DestinationSeed) {
  if (seed.dailyTotals.budget <= 95) {
    return "budget-friendly";
  }

  if (seed.dailyTotals.midRange >= 220 || seed.flightAverage.YUL >= 1200) {
    return "higher-budget";
  }

  return "balanced";
}

function getContextualAffiliateTitle(type: AffiliateLink["type"], seed: DestinationSeed, primaryStyle: string) {
  const context = getTripContext(seed);

  if (type === "Flights") {
    return context === "higher-budget" ? `Watch fares to ${seed.name}` : `Compare flights to ${seed.name}`;
  }

  if (type === "Hotels") {
    return context === "budget-friendly" ? `Find value stays in ${seed.name}` : `Find ${primaryStyle.toLowerCase()} stays in ${seed.name}`;
  }

  if (type === "eSIM") {
    return `Get trip data for ${seed.name}`;
  }

  if (type === "Activities") {
    return `Book ${primaryStyle.toLowerCase()} activities`;
  }

  return `Check coverage for ${seed.name}`;
}

function buildFlightHref(seed: DestinationSeed) {
  return buildProviderSearchHref({
    baseUrl: process.env.NEXT_PUBLIC_FLIGHTS_AFFILIATE_BASE_URL ?? "https://www.skyscanner.ca/transport/flights/",
    queryParam: process.env.NEXT_PUBLIC_FLIGHTS_AFFILIATE_QUERY_PARAM ?? "query",
    searchTerm: `Flights to ${seed.name}`,
    fallbackPath: "/transport/flights/",
    partnerParam: process.env.NEXT_PUBLIC_FLIGHTS_AFFILIATE_ID_PARAM,
    partnerValue: process.env.NEXT_PUBLIC_FLIGHTS_AFFILIATE_ID,
  });
}

function buildBookingHref(seed: DestinationSeed) {
  const url = new URL("https://www.booking.com/searchresults.html");
  const aid = process.env.NEXT_PUBLIC_BOOKING_AFFILIATE_AID;

  url.searchParams.set("ss", seed.name);
  url.searchParams.set("label", `gobybudget-${seed.slug}`);
  url.searchParams.set("utm_source", "gobybudget.com");
  url.searchParams.set("utm_medium", "affiliate");

  if (aid) {
    url.searchParams.set("aid", aid);
  }

  return url.toString();
}

function buildEsimHref(seed: DestinationSeed) {
  return buildProviderSearchHref({
    baseUrl: process.env.NEXT_PUBLIC_ESIM_AFFILIATE_BASE_URL ?? "https://www.airalo.com/search",
    queryParam: process.env.NEXT_PUBLIC_ESIM_AFFILIATE_QUERY_PARAM ?? "search",
    searchTerm: seed.name,
    fallbackPath: "/search",
    partnerParam: process.env.NEXT_PUBLIC_ESIM_AFFILIATE_ID_PARAM,
    partnerValue: process.env.NEXT_PUBLIC_ESIM_AFFILIATE_ID,
  });
}

function buildActivitiesHref(seed: DestinationSeed) {
  return buildProviderSearchHref({
    baseUrl: process.env.NEXT_PUBLIC_ACTIVITIES_AFFILIATE_BASE_URL ?? "https://www.getyourguide.com/s/",
    queryParam: process.env.NEXT_PUBLIC_ACTIVITIES_AFFILIATE_QUERY_PARAM ?? "q",
    searchTerm: seed.name,
    fallbackPath: "/s/",
    partnerParam: process.env.NEXT_PUBLIC_ACTIVITIES_AFFILIATE_ID_PARAM || "partner_id",
    partnerValue: process.env.NEXT_PUBLIC_ACTIVITIES_AFFILIATE_ID || "4ZWE6DU",
  });
}

function buildInsuranceHref(seed: DestinationSeed) {
  const baseUrl = process.env.NEXT_PUBLIC_INSURANCE_AFFILIATE_BASE_URL;

  if (!baseUrl) {
    return "/travel-budget-calculator";
  }

  return buildProviderSearchHref({
    baseUrl,
    queryParam: process.env.NEXT_PUBLIC_INSURANCE_AFFILIATE_QUERY_PARAM ?? "destination",
    searchTerm: seed.name,
    fallbackPath: "/",
    partnerParam: process.env.NEXT_PUBLIC_INSURANCE_AFFILIATE_ID_PARAM,
    partnerValue: process.env.NEXT_PUBLIC_INSURANCE_AFFILIATE_ID,
  });
}

function buildProviderSearchHref({
  baseUrl,
  queryParam,
  searchTerm,
  fallbackPath,
  partnerParam,
  partnerValue,
}: {
  baseUrl: string;
  queryParam: string;
  searchTerm: string;
  fallbackPath: string;
  partnerParam?: string;
  partnerValue?: string;
}) {
  const url = new URL(baseUrl);

  if (url.pathname === "/") {
    url.pathname = fallbackPath;
  }

  url.searchParams.set(queryParam, searchTerm);
  url.searchParams.set("utm_source", "gobybudget.com");
  url.searchParams.set("utm_medium", "affiliate");

  if (partnerParam && partnerValue) {
    url.searchParams.set(partnerParam, partnerValue);
  }

  return url.toString();
}

function buildFaqs(seed: DestinationSeed): Destination["faqs"] {
  return [
    {
      question: `Is ${seed.name} realistic for a budget-conscious trip from Canada?`,
      answer: `${seed.name} can be realistic when the flight estimate and daily-cost tier fit your total budget. Use these numbers as planning estimates, then verify current fares and lodging before booking.`,
    },
    {
      question: `What usually changes the ${seed.name} trip estimate the most?`,
      answer: `Flights from your Canadian origin, accommodation seasonality, trip length, and travel style usually have the biggest effect on the final cost.`,
    },
  ];
}

function buildSourceNotes(seed: DestinationSeed): string[] {
  return [
    "Uses directional planning estimates for departures from Montreal (YUL), Toronto (YYZ), and Vancouver (YVR).",
    `Daily costs are modeled in CAD for budget, mid-range, and luxury travel styles in ${seed.name}.`,
    "These estimates are not live prices or guarantees; actual fares, hotel rates, exchange rates, and availability can vary.",
  ];
}

export function normalizeOriginCode(originCode: string | null | undefined): OriginCode {
  const normalized = originCode?.trim().toUpperCase();

  if (!normalized) {
    return defaultOriginCode;
  }

  if (["MONTREAL", "MONTRÉAL", "MONTRÃ‰AL"].includes(normalized)) {
    return "YUL";
  }

  if (["QUEBEC", "QUÉBEC", "QUEBEC CITY", "QUÉBEC CITY"].includes(normalized)) {
    return "YQB";
  }

  if (normalized === "OTTAWA") {
    return "YOW";
  }

  if (normalized === "CALGARY") {
    return "YYC";
  }

  if (normalized === "TORONTO") {
    return "YYZ";
  }

  if (normalized === "VANCOUVER") {
    return "YVR";
  }

  if (normalized === "NEW YORK") {
    return "NYC";
  }

  if (normalized === "BOSTON") {
    return "BOS";
  }

  if (normalized === "CHICAGO") {
    return "CHI";
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
      currency: "CAD" as const,
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

function roundToNearest(value: number, nearest: number) {
  return Math.round(value / nearest) * nearest;
}

const uniqueDestinationSeeds = Array.from(
  destinationSeeds.reduce((seedBySlug, seed) => seedBySlug.set(seed.slug, seed), new Map<string, DestinationSeed>()).values()
);

export const destinations: Destination[] = uniqueDestinationSeeds.map((seed) =>
  buildDestination({
    slug: seed.slug,
    name: seed.name,
    countryCode: seed.countryCode,
    image: seed.image,
    originPricing: buildOriginPricing(seed),
    dailyCosts: buildDailyCosts(seed),
    score: seed.score,
    bestMonths: seed.bestMonths,
    travelStyles: seed.travelStyles,
    weather: seed.weather,
    dataConfidence: seed.dataConfidence,
    lastUpdated,
    sourceNotes: buildSourceNotes(seed),
    shortDescription: seed.shortDescription,
    itineraryPreview: seed.itineraryPreview,
    affiliateLinks: buildAffiliateLinks(seed),
    faqs: buildFaqs(seed),
  })
);

export function getDestination(slug: string) {
  return destinations.find((destination) => destination.slug === slug);
}

export { formatMoney } from "@/lib/format-money";
