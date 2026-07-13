import type { TravelStyle } from "@/lib/data/destinations";

export type LongTailGuide = {
  slug: string;
  title: string;
  category: "Budget planning" | "Destination costs" | "Flight savings" | "Travel rewards";
  intent: string;
  destinationSlug?: string;
  originCode?: string;
  originCity?: string;
  durationDays?: number;
  travelStyle?: TravelStyle;
  travelers?: number;
  budgetTarget?: number;
  summary: string;
  image: string;
  imageAlt: string;
  quickAnswer: string;
  costNotes: string[];
  itinerary: string[];
  seasonalNotes: string[];
  internalLinks: {
    label: string;
    href: string;
    description: string;
  }[];
  faqs: {
    question: string;
    answer: string;
  }[];
  sections: {
    heading: string;
    body: string;
  }[];
};

type GuideInput = Pick<
  LongTailGuide,
  | "slug"
  | "title"
  | "category"
  | "intent"
  | "destinationSlug"
  | "originCode"
  | "originCity"
  | "durationDays"
  | "travelStyle"
  | "travelers"
  | "budgetTarget"
  | "summary"
> &
  Partial<
    Pick<
      LongTailGuide,
      "quickAnswer" | "costNotes" | "itinerary" | "seasonalNotes" | "internalLinks" | "faqs" | "sections"
    >
  >;

const defaultImage = "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1400&q=85";
const defaultImageAlt = "Open travel notebook with map, pen, and trip planning notes";

export const longTailGuides: LongTailGuide[] = [
  guide({
    slug: "travel-budget-calculator",
    title: "How to estimate a trip budget before booking",
    category: "Budget planning",
    intent: "Learn which costs to compare before using the travel budget calculator for flights, stays, food, transport, activities, insurance, and a cash buffer.",
    summary: "A practical guide to using GoByBudget.com as a trip cost calculator, with the inputs that matter most.",
    quickAnswer:
      "A serious travel budget calculator should start with origin, destination, trip length, travel style, and traveler count, then separate fixed costs from daily costs before adding a buffer.",
    costNotes: [
      "Fixed costs usually include flights, insurance, baggage, visas, and some tours.",
      "Daily costs usually include accommodation, meals, local transport, activities, mobile data, and miscellaneous spending.",
      "A 10% buffer is reasonable for close-to-budget trips; 15% to 20% is safer when exchange rates or peak-season hotels are uncertain.",
    ],
    itinerary: [
      "Run a first estimate with your preferred destination, dates, and travel style.",
      "Compare one cheaper destination and one shorter duration before committing.",
      "Check live flights and hotels only after the estimate fits your budget range.",
    ],
    seasonalNotes: [
      "Peak holiday weeks can break otherwise realistic budgets.",
      "Shoulder-season dates often reduce hotel pressure before they reduce food or local transport costs.",
      "Long-haul sale fares still need a full local-cost check before booking.",
    ],
    internalLinks: [
      {
        label: "Use the travel budget calculator",
        href: "/travel-budget-calculator",
        description: "Start the transactional calculator for your own origin, destination, duration, and style.",
      },
      {
        label: "Browse destinations",
        href: "/destinations",
        description: "Compare destination-level cost profiles before choosing a route.",
      },
      {
        label: "Read the methodology",
        href: "/methodology",
        description: "See how planning estimates are built and where the limits are.",
      },
    ],
  }),
  guide({
    slug: "japan-travel-budget-from-canada",
    title: "Japan travel budget from Canada",
    category: "Destination costs",
    intent: "Estimate Japan trip costs from Canada with flights, hotels, food, transit, activities, and timing tradeoffs.",
    destinationSlug: "japan",
    originCode: "YUL",
    originCity: "Montreal",
    durationDays: 10,
    summary: "See what a realistic Japan travel budget from Canada needs to include before booking flights.",
    quickAnswer:
      "For most Canada-based travelers, Japan is not cheap, but it can be controlled: flights and hotels set the ceiling, while food, transit, and convenience-store meals keep daily spending flexible.",
  }),
  guide({
    slug: "japan-10-day-budget-from-canada",
    title: "Japan 10-day budget from Canada",
    category: "Destination costs",
    intent: "Plan a 10-day Japan trip with flights, hotels, food, transit, and buffer.",
    destinationSlug: "japan",
    originCode: "YUL",
    originCity: "Montreal",
    durationDays: 10,
    summary: "Plan a 10-day Japan trip from Canada with a realistic cost range and itinerary structure.",
  }),
  guide({
    slug: "portugal-trip-cost-from-montreal",
    title: "Portugal trip cost from Montreal",
    category: "Destination costs",
    intent: "Estimate a Portugal trip from Montreal, including flights, Lisbon and Porto stays, food, trains, activities, and shoulder-season timing.",
    destinationSlug: "portugal",
    originCode: "YUL",
    originCity: "Montreal",
    durationDays: 10,
    summary: "A Montreal-focused Portugal cost guide for Lisbon, Porto, food, transport, and seasonal pricing.",
    quickAnswer:
      "Portugal is one of the stronger Europe value picks from Montreal when flights are reasonable and the trip avoids July-August hotel pressure.",
  }),
  guide({
    slug: "portugal-two-week-budget-from-montreal",
    title: "Portugal two-week budget from Montreal",
    category: "Destination costs",
    intent: "Estimate a practical Lisbon, Porto, and coast budget for a 14-day trip.",
    destinationSlug: "portugal",
    originCode: "YUL",
    originCity: "Montreal",
    durationDays: 14,
    summary: "Estimate a practical Lisbon, Porto, and coast budget for a two-week Portugal trip.",
  }),
  guide({
    slug: "best-destinations-under-2500-cad",
    title: "Best destinations under 2500 CAD",
    category: "Budget planning",
    intent: "Find realistic international trips that can fit under 2500 CAD once flights and daily costs are included.",
    originCode: "YUL",
    originCity: "Montreal",
    durationDays: 10,
    budgetTarget: 2500,
    summary: "Compare destinations that can fit a 2500 CAD planning budget from Canada.",
    quickAnswer:
      "The best destinations under 2500 CAD are usually places with either short affordable flights or low daily costs. A cheap flight alone is not enough if hotels and meals consume the budget.",
    costNotes: [
      "For a 2500 CAD cap, flight cost should usually stay below about 900 CAD unless local costs are very low.",
      "A 10-day trip needs roughly 160 CAD per day or less after a 900 CAD flight.",
      "Shorter 7-day trips can work for higher-cost cities, but the flight takes a larger share of the budget.",
    ],
    itinerary: [
      "Shortlist destinations where the full estimate sits at least 10% below 2500 CAD.",
      "Compare a 7-day and 10-day version before booking.",
      "Keep at least 200 CAD unassigned for baggage, airport transfers, card fees, and price movement.",
    ],
    seasonalNotes: [
      "Mexico, Colombia, Portugal, Guatemala, and Central Europe tend to appear more often in this budget band.",
      "Peak summer Europe and winter holiday beach trips can push otherwise affordable routes over budget.",
      "If flights are high, prioritize destinations with low daily costs and longer stays.",
    ],
    internalLinks: [
      {
        label: "Trips from Montreal under 2500 CAD",
        href: "/from/montreal/under-2500",
        description: "See matching destinations from Montreal under the same budget cap.",
      },
      {
        label: "Travel budget calculator",
        href: "/travel-budget-calculator",
        description: "Test your own origin, duration, and travel style.",
      },
      {
        label: "Destination guides",
        href: "/destinations",
        description: "Review cost profiles for individual destinations.",
      },
    ],
  }),
  guide({
    slug: "mexico-city-travel-budget",
    title: "Mexico City travel budget",
    category: "Destination costs",
    intent: "Estimate a Mexico City travel budget with flights, neighborhoods, meals, museums, rideshare, and day trips.",
    destinationSlug: "mexico-city",
    originCode: "YUL",
    originCity: "Montreal",
    durationDays: 7,
    summary: "A focused Mexico City budget guide for a week of food, museums, neighborhoods, and local transport.",
    quickAnswer:
      "Mexico City can be one of the best urban value trips from Canada because food, museums, and local transport stay manageable even when flights are not at their lowest.",
    costNotes: [
      "Flights from Canada set the starting point, but Mexico City is often won or lost on neighborhood and hotel timing.",
      "Food can stay controlled with markets, casual restaurants, bakeries, taquerias, and a few planned splurge meals.",
      "Add a buffer for airport transfers, ride-hailing after dark, museum tickets, mobile data, and possible day trips.",
    ],
    itinerary: [
      "Days 1-2: settle into Roma, Condesa, Centro, or a transit-friendly base and keep the first food stops simple.",
      "Days 3-5: group museums, markets, parks, and neighborhoods by area to avoid unnecessary rides.",
      "Days 6-7: add one bigger activity or day trip, then leave room for a slower final day and airport transfer timing.",
    ],
    seasonalNotes: [
      "February, March, October, and November are useful value windows for weather and walking comfort.",
      "Holiday weeks, major events, and last-minute stays in popular neighborhoods can lift hotel prices quickly.",
      "Rainier months can still work if the itinerary has flexible museums, food halls, and indoor options.",
    ],
    internalLinks: [
      {
        label: "Mexico City destination guide",
        href: "/destinations/mexico-city",
        description: "Review city-level costs, best months, and related Mexico City planning pages.",
      },
      {
        label: "Mexico City budget page",
        href: "/destinations/mexico-city/travel-budget",
        description: "See the stronger destination budget page with full breakdown and FAQs.",
      },
      {
        label: "Montreal to Mexico City budget",
        href: "/budget-travel/from-montreal-to-mexico-city",
        description: "Compare the origin-specific trip budget from Montreal.",
      },
      {
        label: "Travel budget calculator",
        href: "/travel-budget-calculator",
        description: "Change origin, duration, and travel style for a custom estimate.",
      },
    ],
    faqs: [
      {
        question: "How much should I budget for Mexico City from Canada?",
        answer:
          "Use a full-trip CAD estimate that includes flights, accommodation, food, local transport, activities, airport transfers, and a buffer. The exact total varies by origin, dates, season, comfort level, and availability.",
      },
      {
        question: "Is Mexico City good for budget travelers?",
        answer:
          "Yes. Local food, transit, museums, parks, and self-guided neighborhoods can be affordable, but premium hotels and private tours can raise the total quickly.",
      },
      {
        question: "Which costs are easiest to reduce in Mexico City?",
        answer:
          "Accommodation location, ride-hailing frequency, restaurant mix, and paid tour count are usually easier to adjust than the flight once dates are fixed.",
      },
      {
        question: "Are the prices guaranteed?",
        answer:
          "No. GoByBudget.com uses planning estimates in CAD. Prices vary by dates, season, availability, exchange rates, airport, comfort level, and travel style.",
      },
    ],
    sections: [
      {
        heading: "Choose the neighborhood before the hotel",
        body:
          "Mexico City hotel value depends heavily on neighborhood and mobility. A slightly cheaper stay can become inconvenient if it adds frequent rides, while a well-located transit-friendly area can reduce both time and local transport costs.",
      },
      {
        heading: "Keep food flexible",
        body:
          "The city works well for mixed spending: markets and casual meals on some days, then one or two restaurants, food tours, or cocktail stops when they matter. That mix is usually better than treating every meal as either ultra-cheap or premium.",
      },
      {
        heading: "Plan activity clusters",
        body:
          "Museums, parks, markets, and historic areas are easier to budget when grouped by area. This reduces ride-hailing, keeps days realistic, and helps protect the buffer for airport transfers or a bigger day trip.",
      },
    ],
  }),
  guide({
    slug: "cheap-places-to-travel-from-montreal",
    title: "Cheap places to travel from Montreal",
    category: "Budget planning",
    intent: "Compare cheap places to travel from Montreal using total trip cost, not just flight price.",
    originCode: "YUL",
    originCity: "Montreal",
    durationDays: 7,
    budgetTarget: 2000,
    summary: "Find lower-cost trips from Montreal by balancing airfare, daily costs, duration, and seasonality.",
    quickAnswer:
      "The cheapest places to travel from Montreal are not always the destinations with the cheapest flights. Mexico City, Portugal, Colombia, Guatemala, and some Central Europe cities can win when total trip cost is counted.",
    costNotes: [
      "From Montreal, a cheap short-haul flight can still lose to a long-haul trip if hotels are expensive.",
      "For a 7-day trip under 2000 CAD, daily costs usually need to stay near 150 CAD after flights.",
      "Direct or one-stop routes matter because awkward connections can add hotel, meal, and transfer costs.",
    ],
    itinerary: [
      "Start with a 7-day budget screen from Montreal.",
      "Compare the lowest total estimate against the destination you actually want.",
      "Move dates into shoulder season before downgrading the destination.",
    ],
    seasonalNotes: [
      "Winter beach demand can raise Mexico and Caribbean lodging even when flights look attractive.",
      "Spring and fall can make Portugal and Central Europe more competitive from Montreal.",
      "Long weekends often raise nearby city hotel costs faster than airfare.",
    ],
    internalLinks: [
      {
        label: "Trips from Montreal under 2000 CAD",
        href: "/from/montreal/under-2000",
        description: "See the programmatic budget page for Montreal-based trips.",
      },
      {
        label: "Trips from Montreal under 2500 CAD",
        href: "/from/montreal/under-2500",
        description: "Expand the budget slightly to unlock more destinations.",
      },
      {
        label: "Compare destinations",
        href: "/compare",
        description: "Review head-to-head budget comparisons.",
      },
    ],
  }),
  guide({
    slug: "mexico-city-budget-week-from-toronto",
    title: "Mexico City one-week budget from Toronto",
    category: "Destination costs",
    intent: "Break down flights, neighborhoods, meals, museums, and local transport.",
    destinationSlug: "mexico-city",
    originCode: "YYZ",
    originCity: "Toronto",
    durationDays: 7,
    summary: "Break down a one-week Mexico City budget from Toronto with realistic local costs.",
  }),
  guide({
    slug: "vietnam-three-week-backpacker-budget",
    title: "Vietnam three-week backpacker budget",
    category: "Destination costs",
    intent: "Model a longer low-cost Vietnam route with realistic transport and activity spend.",
    destinationSlug: "vietnam",
    originCode: "YUL",
    originCity: "Montreal",
    durationDays: 21,
    travelStyle: "budget",
    summary: "Model a three-week Vietnam backpacker route where low daily costs offset long-haul flights.",
  }),
  guide({
    slug: "thailand-islands-budget-with-flights",
    title: "Thailand islands budget with flights",
    category: "Destination costs",
    intent: "Plan Thailand beaches without ignoring inter-island transfers and peak-season hotel costs.",
    destinationSlug: "thailand",
    originCode: "YUL",
    originCity: "Montreal",
    durationDays: 14,
    summary: "Plan Thailand beaches with flights, island transfers, hotels, food, and peak-season pressure.",
  }),
  guide({
    slug: "italy-cost-by-region-first-trip",
    title: "Italy cost by region for a first trip",
    category: "Destination costs",
    intent: "Compare Rome, Florence, Naples, Sicily, and northern Italy budget pressure.",
    destinationSlug: "italy",
    originCode: "YUL",
    originCity: "Montreal",
    durationDays: 10,
    summary: "Compare how Italy trip costs change by region for a first-time itinerary.",
  }),
  guide({
    slug: "spain-vs-portugal-trip-budget",
    title: "Spain vs Portugal trip budget",
    category: "Budget planning",
    intent: "Decide which Iberia trip fits your budget, style, and season.",
    destinationSlug: "spain",
    originCode: "YUL",
    originCity: "Montreal",
    durationDays: 10,
    summary: "Compare Spain and Portugal budget pressure for an Iberia trip.",
    quickAnswer:
      "Portugal often has the lower-cost edge for a focused Lisbon or Porto trip, while Spain can deliver more route variety. The better value depends on flights, hotel season, city mix, and whether you are adding trains or beaches.",
    costNotes: [
      "Compare the total route, not just the country: Lisbon plus Porto behaves differently from Madrid plus Barcelona or an Andalusia route.",
      "Accommodation season is usually the biggest daily-cost swing, especially in coastal or high-demand city areas.",
      "Add train or regional flight costs before assuming a multi-city Iberia itinerary is cheaper than one well-chosen base.",
    ],
    itinerary: [
      "Option A: keep Portugal focused with Lisbon, Porto, and one day trip to reduce hotel changes.",
      "Option B: keep Spain focused with Madrid, Barcelona, or Andalusia rather than trying to cover everything in 10 days.",
      "Before booking: compare flights, hotels, intercity transport, food style, and activity plans in the same CAD estimate.",
    ],
    seasonalNotes: [
      "May, June, September, and October are often stronger value windows for both countries than peak summer.",
      "Beach-heavy Spain or Portugal routes can rise quickly in July and August.",
      "City-focused winter trips can be cheaper, but weather and daylight may change the itinerary value.",
    ],
    internalLinks: [
      {
        label: "Portugal vs Spain comparison",
        href: "/compare/portugal-vs-spain-travel-budget",
        description: "Compare destination estimates and value tradeoffs side by side.",
      },
      {
        label: "Portugal trip cost from Montreal",
        href: "/guides/portugal-trip-cost-from-montreal",
        description: "See a Montreal-focused Portugal budget guide.",
      },
      {
        label: "Best Europe trips from Toronto under $3,000",
        href: "/compare/best-europe-trips-from-toronto-under-3000",
        description: "Compare Europe budget options from Toronto.",
      },
      {
        label: "Travel budget calculator",
        href: "/travel-budget-calculator",
        description: "Test Spain and Portugal with your own dates, origin, duration, and style.",
      },
    ],
    faqs: [
      {
        question: "Is Spain or Portugal cheaper for a trip?",
        answer:
          "Portugal is often easier to keep lower for a focused Lisbon or Porto trip, but Spain can compete when flights, hotels, and routing line up. Compare the full itinerary in CAD before deciding.",
      },
      {
        question: "What makes Spain more expensive than Portugal?",
        answer:
          "Barcelona, coastal summer stays, frequent city changes, premium restaurants, and paid attractions can raise the Spain budget quickly.",
      },
      {
        question: "Can I visit both Spain and Portugal on one budget?",
        answer:
          "Yes, but add intercity transport, extra hotel changes, and buffer. A two-country trip can cost more than a focused one-country route.",
      },
      {
        question: "Are the estimates guaranteed?",
        answer:
          "No. They are CAD planning estimates. Prices vary by dates, season, availability, departure airport, comfort level, exchange rates, and travel style.",
      },
    ],
    sections: [
      {
        heading: "Compare route shape first",
        body:
          "A focused Portugal route can be cheaper than a broad Spain route, but a focused Spain route can beat an overpacked Portugal itinerary. Compare actual city choices, nights, and transport legs before comparing countries.",
      },
      {
        heading: "Watch hotel seasonality",
        body:
          "Hotel pressure is the biggest budget risk in both countries. Peak summer, coastal weekends, and major events can erase the value advantage of either destination.",
      },
      {
        heading: "Use a budget threshold",
        body:
          "If Spain or Portugal is within ten percent of your limit, test shoulder-season dates first. If it is well over budget, reduce city changes or choose the country where daily costs fit your travel style more naturally.",
      },
    ],
  }),
  guide({
    slug: "greece-island-hopping-budget",
    title: "Greece island-hopping budget",
    category: "Destination costs",
    intent: "Estimate ferries, island stays, shoulder-season choices, and Athens buffer.",
    destinationSlug: "greece",
    originCode: "YUL",
    originCity: "Montreal",
    durationDays: 12,
    summary: "Estimate a Greece island-hopping budget with ferries, island stays, and Athens buffer.",
  }),
  guide({
    slug: "morocco-10-day-budget-itinerary",
    title: "Morocco 10-day budget itinerary",
    category: "Destination costs",
    intent: "Plan Marrakesh, Fes, and desert-edge routes with clear daily costs.",
    destinationSlug: "morocco",
    originCode: "YUL",
    originCity: "Montreal",
    durationDays: 10,
    summary: "Plan a 10-day Morocco budget itinerary with daily costs and routing tradeoffs.",
  }),
  guide({
    slug: "colombia-budget-for-digital-nomads",
    title: "Colombia budget for digital nomads",
    category: "Destination costs",
    intent: "Estimate Medellin, Bogota, and Caribbean add-ons for a longer remote-work stay.",
    destinationSlug: "colombia",
    originCode: "YUL",
    originCity: "Montreal",
    durationDays: 21,
    summary: "Estimate a Colombia budget for a longer remote-work stay with city and coast options.",
  }),
  guide({
    slug: "peru-machu-picchu-trip-budget",
    title: "Peru and Machu Picchu trip budget",
    category: "Destination costs",
    intent: "Separate everyday Peru costs from the expensive Machu Picchu planning pieces.",
    destinationSlug: "peru",
    originCode: "YUL",
    originCity: "Montreal",
    durationDays: 10,
    summary: "Separate everyday Peru costs from the expensive Machu Picchu planning pieces.",
  }),
  guide({
    slug: "turkey-two-city-budget",
    title: "Turkey two-city budget: Istanbul and Cappadocia",
    category: "Destination costs",
    intent: "Model a high-intent Turkey trip with flights, balloons, food, and hotel ranges.",
    destinationSlug: "turkey",
    originCode: "YUL",
    originCity: "Montreal",
    durationDays: 10,
    summary: "Model a two-city Turkey trip with Istanbul, Cappadocia, food, hotels, and major activities.",
  }),
  guide({
    slug: "best-months-cheap-international-flights-canada",
    title: "Best months for cheap international flights from Canada",
    category: "Flight savings",
    intent: "Use seasonality to time flight searches before destination selection.",
    summary: "Use Canadian flight seasonality to time international trip searches before choosing a destination.",
  }),
  guide({
    slug: "how-much-buffer-travel-budget",
    title: "How much buffer to add to a travel budget",
    category: "Budget planning",
    intent: "Choose a safety buffer for exchange rates, baggage, transfers, and last-minute changes.",
    summary: "Choose a practical travel budget buffer for exchange rates, baggage, transfers, and last-minute changes.",
  }),
  guide({
    slug: "flight-vs-hotel-splurge-tradeoff",
    title: "When to splurge on flights vs hotels",
    category: "Budget planning",
    intent: "Decide which part of the trip deserves extra money based on destination and duration.",
    summary: "Decide whether extra budget should go to flights, hotels, duration, or activities.",
  }),
  guide({
    slug: "travel-budget-for-couples-split-costs",
    title: "Travel budget for couples: what costs actually split",
    category: "Budget planning",
    intent: "Separate per-person and shared costs before estimating a couple trip.",
    travelers: 2,
    summary: "Separate shared and per-person trip costs before estimating a couple travel budget.",
  }),
  guide({
    slug: "family-trip-budget-hidden-costs",
    title: "Family trip budget hidden costs",
    category: "Budget planning",
    intent: "Plan family travel with room type, baggage, activities, and local transport pressure.",
    travelers: 4,
    summary: "Plan family travel with room type, baggage, activities, transfers, and hidden cost pressure.",
  }),
  guide({
    slug: "using-points-with-cash-travel-budget",
    title: "Using points with a cash travel budget",
    category: "Travel rewards",
    intent: "Blend rewards redemptions and cash costs without underestimating daily spend.",
    summary: "Blend rewards points and cash costs without underestimating the trip budget.",
  }),
  guide({
    slug: "cheap-beach-destinations-from-canada",
    title: "Cheap beach destinations from Canada",
    category: "Destination costs",
    intent: "Compare beach trips where flight access and daily costs both make sense.",
    originCode: "YUL",
    originCity: "Montreal",
    budgetTarget: 2500,
    summary: "Compare beach trips from Canada where flight access and daily costs both make sense.",
  }),
  guide({
    slug: "europe-shoulder-season-budget-guide",
    title: "Europe shoulder-season budget guide",
    category: "Flight savings",
    intent: "Plan Europe in spring or fall to reduce stay costs and avoid peak crowd pricing.",
    originCode: "YUL",
    originCity: "Montreal",
    durationDays: 10,
    summary: "Plan Europe in spring or fall to reduce stay costs and avoid peak crowd pricing.",
  }),
  guide({
    slug: "long-haul-trip-budget-flight-sale",
    title: "How to budget after finding a long-haul flight sale",
    category: "Flight savings",
    intent: "Validate whether a cheap fare still works after local costs and transfers.",
    summary: "Validate whether a long-haul sale fare still works after local costs and transfers.",
  }),
  guide({
    slug: "solo-travel-budget-realistic-daily-costs",
    title: "Solo travel budget: realistic daily costs",
    category: "Budget planning",
    intent: "Account for single-room pricing, tours, transport, and flexible meals.",
    travelers: 1,
    summary: "Account for single-room pricing, tours, transport, and flexible meals in a solo travel budget.",
  }),
  guide({
    slug: "airport-choice-canada-trip-budget",
    title: "How Canadian airport choice changes trip budget",
    category: "Flight savings",
    intent: "Compare Montreal, Toronto, Vancouver, Ottawa, Quebec, and Calgary departure effects.",
    summary: "Compare how Canadian departure airport choice changes total trip cost.",
  }),
  guide({
    slug: "first-international-trip-budget-checklist",
    title: "First international trip budget checklist",
    category: "Budget planning",
    intent: "A practical checklist for passports, insurance, mobile data, cards, and buffers.",
    summary: "A practical first international trip budget checklist for documents, insurance, mobile data, cards, and buffers.",
  }),
];

export function getLongTailGuide(slug: string) {
  return longTailGuides.find((guideItem) => guideItem.slug === slug);
}

function guide(input: GuideInput): LongTailGuide {
  const originCity = input.originCity ?? "Canada";
  const durationDays = input.durationDays ?? 10;
  const travelers = input.travelers ?? 1;
  const destinationName = getDestinationName(input);
  const budgetLabel = input.budgetTarget ? ` under ${formatCad(input.budgetTarget)}` : "";

  return {
    slug: input.slug,
    title: input.title,
    category: input.category,
    intent: input.intent,
    destinationSlug: input.destinationSlug,
    originCode: input.originCode ?? "YUL",
    originCity,
    durationDays,
    travelStyle: input.travelStyle ?? "midRange",
    travelers,
    budgetTarget: input.budgetTarget,
    summary: input.summary,
    image: defaultImage,
    imageAlt: defaultImageAlt,
    quickAnswer:
      input.quickAnswer ??
      `A useful ${destinationName} budget starts with the full trip cost, not a single airfare. For a ${durationDays}-day plan from ${originCity}${budgetLabel}, compare flights, accommodation, food, local transport, activities, insurance, mobile data, and a practical buffer before booking.`,
    costNotes:
      input.costNotes ??
      [
        `Model flights from ${originCity} separately from daily costs so a fare sale does not hide expensive hotels or activities.`,
        `For ${durationDays} days, accommodation and food usually move the total more than small daily purchases.`,
        `Add a 10% to 15% buffer when the estimate is close to your limit, especially for peak dates or exchange-rate movement.`,
      ],
    itinerary:
      input.itinerary ??
      [
        `Days 1-2: arrive, recover from the flight, and keep the first hotel location simple.`,
        `Days 3-${Math.max(4, Math.floor(durationDays * 0.7))}: focus on the core neighborhoods, meals, sights, and day trips that justify the destination.`,
        `Final days: leave room for a slower local day, airport transfer timing, and backup budget if one activity or stay costs more than planned.`,
      ],
    seasonalNotes:
      input.seasonalNotes ??
      [
        "Shoulder-season dates usually make the estimate more reliable than peak holiday periods.",
        "Flights can be cheaper before hotels move, so check both before treating a fare as a deal.",
        "The best month is the one where weather, airfare, and lodging all fit the same budget range.",
      ],
    internalLinks:
      input.internalLinks ??
      [
        {
          label: "Travel budget calculator",
          href: "/travel-budget-calculator",
          description: "Build a custom estimate with your own destination, origin, style, and trip length.",
        },
        {
          label: "Destination guides",
          href: input.destinationSlug ? `/destinations/${input.destinationSlug}` : "/destinations",
          description: "Review destination cost data, best months, and itinerary ideas.",
        },
        {
          label: "Budget methodology",
          href: "/methodology",
          description: "Understand how estimates are built and why they are planning ranges.",
        },
      ],
    faqs:
      input.faqs ??
      [
        {
          question: `What should I include in the ${input.title.toLowerCase()} estimate?`,
          answer:
            "Include round-trip flights, accommodation, food, local transport, paid activities, insurance, baggage, mobile data, airport transfers, card fees, and a small cash buffer.",
        },
        {
          question: "Are these live booking prices?",
          answer:
            "No. GoByBudget.com guide numbers are planning estimates. Use them to compare options, then verify live flights and lodging before booking.",
        },
        {
          question: "How can I reduce the total without ruining the trip?",
          answer:
            "First test shoulder-season dates, a shorter duration, and a simpler accommodation tier. Cutting the trip purpose or skipping the main experience should be the last step.",
        },
      ],
    sections:
      input.sections ??
      [
        {
          heading: "Start with the full trip cost",
          body: `For ${destinationName}, the useful number is not the cheapest flight or a single daily average. Start with flights, accommodation, food, local transport, activities, insurance, mobile data, baggage, and a small cash buffer so the estimate reflects the trip you will actually book.`,
        },
        {
          heading: "Separate fixed and daily costs",
          body: "Flights, insurance, baggage, and some tours behave like fixed costs. Meals, local transport, and accommodation scale with trip length. Splitting those two groups makes it easier to test seven, ten, and fourteen-day versions of the same plan.",
        },
        {
          heading: "Check the booking pressure points",
          body: "The biggest surprises usually come from peak-season hotels, awkward flight routings, paid day trips, airport transfers, and exchange-rate movement. Price those items before assuming a destination is cheap or expensive.",
        },
        {
          heading: "Use a decision threshold",
          body: "If the estimate is within ten percent of your budget, keep the trip but watch dates closely. If it is twenty percent over, shorten the trip, change the season, or compare a lower-cost destination before booking non-refundable pieces.",
        },
      ],
  };
}

function getDestinationName(input: Pick<LongTailGuide, "destinationSlug" | "title">) {
  if (!input.destinationSlug) {
    return input.title.toLowerCase();
  }

  return input.destinationSlug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function formatCad(amount: number) {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    maximumFractionDigits: 0,
  }).format(amount);
}
