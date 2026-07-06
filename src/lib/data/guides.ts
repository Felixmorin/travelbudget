export type LongTailGuide = {
  slug: string;
  title: string;
  category: "Budget planning" | "Destination costs" | "Flight savings" | "Travel rewards";
  intent: string;
  destinationSlug?: string;
  summary: string;
  image: string;
  imageAlt: string;
  sections: {
    heading: string;
    body: string;
  }[];
};

export const longTailGuides: LongTailGuide[] = [
  guide("japan-10-day-budget-from-canada", "Japan 10-day budget from Canada", "Destination costs", "Plan a 10-day Japan trip with flights, hotels, food, transit, and buffer.", "japan"),
  guide("portugal-two-week-budget-from-montreal", "Portugal two-week budget from Montreal", "Destination costs", "Estimate a practical Lisbon, Porto, and coast budget for a 14-day trip.", "portugal"),
  guide("mexico-city-budget-week-from-toronto", "Mexico City one-week budget from Toronto", "Destination costs", "Break down flights, neighborhoods, meals, museums, and local transport.", "mexico"),
  guide("vietnam-three-week-backpacker-budget", "Vietnam three-week backpacker budget", "Destination costs", "Model a longer low-cost Vietnam route with realistic transport and activity spend.", "vietnam"),
  guide("thailand-islands-budget-with-flights", "Thailand islands budget with flights", "Destination costs", "Plan Thailand beaches without ignoring inter-island transfers and peak-season hotel costs.", "thailand"),
  guide("italy-cost-by-region-first-trip", "Italy cost by region for a first trip", "Destination costs", "Compare Rome, Florence, Naples, Sicily, and northern Italy budget pressure.", "italy"),
  guide("spain-vs-portugal-trip-budget", "Spain vs Portugal trip budget", "Budget planning", "Decide which Iberia trip fits your budget, style, and season.", "spain"),
  guide("greece-island-hopping-budget", "Greece island-hopping budget", "Destination costs", "Estimate ferries, island stays, shoulder-season choices, and Athens buffer.", "greece"),
  guide("morocco-10-day-budget-itinerary", "Morocco 10-day budget itinerary", "Destination costs", "Plan Marrakesh, Fes, and desert-edge routes with clear daily costs.", "morocco"),
  guide("colombia-budget-for-digital-nomads", "Colombia budget for digital nomads", "Destination costs", "Estimate Medellin, Bogota, and Caribbean add-ons for a longer remote-work stay.", "colombia"),
  guide("peru-machu-picchu-trip-budget", "Peru and Machu Picchu trip budget", "Destination costs", "Separate everyday Peru costs from the expensive Machu Picchu planning pieces.", "peru"),
  guide("turkey-two-city-budget", "Turkey two-city budget: Istanbul and Cappadocia", "Destination costs", "Model a high-intent Turkey trip with flights, balloons, food, and hotel ranges.", "turkey"),
  guide("best-months-cheap-international-flights-canada", "Best months for cheap international flights from Canada", "Flight savings", "Use seasonality to time flight searches before destination selection."),
  guide("how-much-buffer-travel-budget", "How much buffer to add to a travel budget", "Budget planning", "Choose a safety buffer for exchange rates, baggage, transfers, and last-minute changes."),
  guide("flight-vs-hotel-splurge-tradeoff", "When to splurge on flights vs hotels", "Budget planning", "Decide which part of the trip deserves extra money based on destination and duration."),
  guide("travel-budget-for-couples-split-costs", "Travel budget for couples: what costs actually split", "Budget planning", "Separate per-person and shared costs before estimating a couple trip."),
  guide("family-trip-budget-hidden-costs", "Family trip budget hidden costs", "Budget planning", "Plan family travel with room type, baggage, activities, and local transport pressure."),
  guide("using-points-with-cash-travel-budget", "Using points with a cash travel budget", "Travel rewards", "Blend rewards redemptions and cash costs without underestimating daily spend."),
  guide("cheap-beach-destinations-from-canada", "Cheap beach destinations from Canada", "Destination costs", "Compare beach trips where flight access and daily costs both make sense."),
  guide("europe-shoulder-season-budget-guide", "Europe shoulder-season budget guide", "Flight savings", "Plan Europe in spring or fall to reduce stay costs and avoid peak crowd pricing."),
  guide("long-haul-trip-budget-flight-sale", "How to budget after finding a long-haul flight sale", "Flight savings", "Validate whether a cheap fare still works after local costs and transfers."),
  guide("solo-travel-budget-realistic-daily-costs", "Solo travel budget: realistic daily costs", "Budget planning", "Account for single-room pricing, tours, transport, and flexible meals."),
  guide("airport-choice-canada-trip-budget", "How Canadian airport choice changes trip budget", "Flight savings", "Compare Montreal, Toronto, Vancouver, Ottawa, Quebec, and Calgary departure effects."),
  guide("first-international-trip-budget-checklist", "First international trip budget checklist", "Budget planning", "A practical checklist for passports, insurance, mobile data, cards, and buffers."),
];

export function getLongTailGuide(slug: string) {
  return longTailGuides.find((guideItem) => guideItem.slug === slug);
}

function guide(
  slug: string,
  title: string,
  category: LongTailGuide["category"],
  intent: string,
  destinationSlug?: string
): LongTailGuide {
  const destinationName = destinationSlug ? title.split(" ")[0] : "your trip";

  return {
    slug,
    title,
    category,
    intent,
    destinationSlug,
    summary: intent,
    image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1400&q=85",
    imageAlt: "Open travel notebook with map, pen, and trip planning notes",
    sections: [
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
