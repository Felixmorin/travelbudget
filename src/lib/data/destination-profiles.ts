import { getDailyCostTotal, getDestinationTripEstimate, type Destination, type TravelStyle } from "@/lib/data/destinations";
import { getComparisonPath, comparisonPages } from "@/lib/programmatic/comparison-pages";

export type DestinationModule =
  | "editorialVerdict"
  | "budgetScenarios"
  | "localCosts"
  | "neighborhoods"
  | "monthlyInsights"
  | "savingsTips"
  | "itinerary"
  | "comparisons"
  | "bookingAdvice";

export type DestinationVerdict = {
  headline: string;
  summary: string;
  advantages: string[];
  tradeoffs: string[];
  budgetRisk: string;
};

export type TripScenario = {
  key: TravelStyle;
  title: string;
  stay: string;
  meals: string;
  transport: string;
  activities: string;
  tradeoff: string;
  traveler: string;
};

export type LocalCost = {
  label: string;
  estimate: string;
  note: string;
};

export type Neighborhood = {
  name: string;
  relativeCost: "Lower" | "Balanced" | "Higher";
  idealFor: string;
  advantages: string;
  tradeoffs: string;
  access: string;
};

export type MonthlyInsight = {
  month: string;
  flights: "Low" | "Medium" | "High";
  hotels: "Low" | "Medium" | "High";
  weather: string;
  crowds: "Low" | "Medium" | "High";
  recommendation: string;
  factor: string;
};

export type SavingsTip = {
  action: string;
  impact: string;
  tradeoff: string;
  bestFor: string;
};

export type ItineraryDay = {
  title: string;
  area: string;
  activity: string;
  estimatedCost: string;
  freeOption: string;
  paidOption: string;
  logisticsTip: string;
};

export type DestinationComparison = {
  slug: string;
  name: string;
  costDifference: string;
  flightDifference: string;
  climateDifference: string;
  styleDifference: string;
  chooseCurrentIf: string;
  chooseAlternativeIf: string;
  href: string;
};

export type BookingAdvice = {
  flights: string;
  hotels: string;
  activities: string;
  transport?: string;
  esim?: string;
  insurance?: string;
};

export type DataFreshness = {
  lastUpdated: string;
  flightSource: string;
  hotelSource: string;
  method: string;
  exchangeRate: string;
  confidence: Destination["dataConfidence"];
  limits: string[];
};

export type DestinationProfile = {
  slug: string;
  name: string;
  country: string;
  currency: string;
  summary: string;
  editorialVerdict: DestinationVerdict;
  idealFor: string[];
  notIdealFor: string[];
  tripScenarios: TripScenario[];
  localCosts: LocalCost[];
  neighborhoods?: Neighborhood[];
  monthlyInsights: MonthlyInsight[];
  savingsTips: SavingsTip[];
  itinerary?: Partial<Record<3 | 5 | 7 | 10, ItineraryDay[]>>;
  comparisons?: DestinationComparison[];
  comparisonSlugs?: string[];
  bookingAdvice: BookingAdvice;
  enabledModules: DestinationModule[];
  dataFreshness: DataFreshness;
  allowedCrossDestinationMentions?: string[];
};

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const priorityProfiles = {
  lisbon: profile({
    slug: "lisbon",
    country: "Portugal",
    summary: "Lisbon works best when you want Europe, food, viewpoints, and day trips without paying the highest large-capital hotel levels.",
    editorialVerdict: verdict("Best for a first Atlantic Europe trip with real neighborhood choice.", "Lisbon is a strong fit for couples, food-focused travelers, and first Europe trips that need atmosphere without a luxury budget. Its weak points are steep walking days, summer crowding, and hotel spikes in the most central areas.", ["Excellent shoulder-season value", "Easy public transit for a capital", "Food costs stay flexible", "Strong day-trip menu"], ["Hilly streets can slow families or accessibility-sensitive travelers", "Central hotels jump in summer", "Popular viewpoints and trams crowd quickly"], "Accommodation in Baixa, Chiado, and Alfama can move the total more than food or transit."),
    idealFor: ["First Europe trip", "Couples", "Seafood and wine", "Walkable neighborhoods", "Shoulder-season value"],
    notIdealFor: ["Flat, step-free city days", "Quiet peak-summer travel", "Travelers avoiding hills"],
    localCosts: costs(["Airport metro transfer", "CAD 3-5", "Best value if luggage is manageable."], ["Tram or metro ride", "CAD 2-4", "Day passes help when crossing hills."], ["Coffee and pastel de nata", "CAD 4-7", "Easy low-cost daily treat."], ["Casual seafood meal", "CAD 22-38", "Neighborhood choice matters."], ["Sintra day trip", "CAD 35-80", "Train is cheap; palace tickets and transfers add up."]),
    neighborhoods: neighborhoods(["Arroios", "Lower", "Value hotels and food", "Good metro access and local restaurants", "Less postcard-pretty than Alfama", "Direct metro or short rides"], ["Baixa / Chiado", "Higher", "First-time sightseeing", "Flat central base near major sights", "Higher hotel pressure", "Walkable core"], ["Alfama / Graca", "Balanced", "Atmosphere and viewpoints", "Historic streets and evening views", "Steep walks and harder luggage days", "Best with light bags"]),
    savingsTips: tips(["Stay in Arroios or Anjos", "Often trims the hotel line item", "Adds short metro rides", "Value-focused couples"], ["Visit in May, June, September, or October", "Better value than July-August", "Weather is less beach-guaranteed", "Flexible date travelers"], ["Use train-based day trips", "Lower transport cost than tours", "More self-planning", "Independent travelers"]),
    itinerary: itinerary({
      3: [["Baixa arrival and miradouros", "Baixa / Chiado", "Walk the grid, Santa Justa area, and one sunset viewpoint", "CAD 10-25", "Miradouro da Senhora do Monte", "Elevator or guided intro walk", "Use metro before tackling hills"], ["Alfama and castle slope", "Alfama", "Castle area, cathedral lanes, tiled streets, and fado district", "CAD 15-45", "Alfama lanes and viewpoints", "Castelo de Sao Jorge ticket", "Start early before cruise-day crowds"], ["Belem or Sintra choice", "Belem or Sintra", "Pick monuments close to town or a full Sintra day", "CAD 20-80", "Belem riverfront walk", "Sintra palace ticket or tour", "Do not combine every Sintra palace in one short day"]],
      5: [["Arrival in Baixa", "Baixa", "Orientation walk and simple seafood dinner", "CAD 10-30", "Commerce Square", "Guided food walk", "Keep first night near transit"], ["Alfama and Graca", "Alfama", "Historic lanes, castle slope, viewpoints", "CAD 15-45", "Viewpoints", "Castle entry", "Wear practical shoes"], ["Belem", "Belem", "Monastery exterior, riverfront, custard tarts", "CAD 10-35", "MAAT riverfront", "Jerónimos or tower ticket", "Use tram or train outside rush hour"], ["Sintra", "Sintra", "One or two palace stops, town center, mountain views", "CAD 35-90", "Town walk", "Pena or Quinta da Regaleira", "Buy timed tickets early"], ["Food and neighborhoods", "Principe Real / Cais do Sodre", "Markets, gardens, final viewpoints", "CAD 15-45", "Garden and riverside walk", "Food tour", "Leave airport buffer"]],
      7: [["Baixa arrival", "Baixa", "Settle in and riverfront walk", "CAD 10-25", "Commerce Square", "Guided intro walk", "Use metro from airport"], ["Alfama", "Alfama / Graca", "Castle hill, cathedral, viewpoints", "CAD 15-45", "Viewpoints", "Castle ticket", "Start early"], ["Belem", "Belem", "Riverfront monuments and pastry stop", "CAD 10-40", "Riverside walk", "Monastery ticket", "Avoid midday queues"], ["Sintra", "Sintra", "Palace-focused day trip", "CAD 35-90", "Town center", "Pena or Regaleira", "Limit to two major sites"], ["Modern Lisbon", "Parque das Nacoes", "Transit-friendly architecture and waterfront", "CAD 8-30", "Waterfront", "Oceanarium", "Good rainy-day option"], ["Food and neighborhoods", "Campo de Ourique / Estrela", "Markets, gardens, local restaurants", "CAD 18-50", "Estrela garden", "Cooking or food tour", "Book dinner ahead"], ["Final viewpoints", "Principe Real", "Shopping, gardens, final low-cost sights", "CAD 10-30", "Garden walk", "Museum choice", "Keep luggage logistics simple"]],
      10: [],
    }),
    comparisonSlugs: ["porto", "barcelona", "paris"],
    bookingAdvice: { flights: "Check flights before locking hotels because Lisbon sale fares can disappear quickly from Canadian origins.", hotels: "Compare hotels in Arroios, Baixa, and Alfama before defaulting to the historic center.", activities: "Price Sintra separately; it can become the biggest activity day.", transport: "Use metro and trains unless you are adding beaches or rural stops.", esim: "Install mobile data before arrival for hills, transit, and ride-hail backup.", insurance: "Verify coverage for stairs, luggage delays, and separate day-trip bookings." },
  }),
  porto: profile({
    slug: "porto",
    country: "Portugal",
    summary: "Porto is the Portugal value play for travelers who want river scenery, food, wine cellars, and compact days.",
    editorialVerdict: verdict("Best when you want a smaller footprint and lower hotel pressure.", "Porto fits couples, food travelers, and slower Europe trips. It is less ideal for beach-first visitors or travelers who need a large capital-city activity menu.", ["Compact sightseeing", "Lower stay pressure than larger capitals", "Excellent food and wine value", "Douro add-ons are easy to price"], ["Wet weather risk outside summer", "Steep riverfront walking", "Fewer big-ticket museums"], "Douro Valley tours and river-view hotels can lift a cheap Porto trip quickly."),
    idealFor: ["Couples", "Wine and food", "Compact city breaks", "Value Europe", "Train-based Portugal trips"],
    notIdealFor: ["Beach-first trips", "Large nightlife scenes", "Travelers avoiding steep streets"],
    localCosts: costs(["Airport metro transfer", "CAD 4-6", "Cheaper than private transfers."], ["Metro or tram ride", "CAD 2-4", "Useful for hills and Vila Nova de Gaia."], ["Francesinha or casual meal", "CAD 16-28", "Portions are filling."], ["Port cellar tasting", "CAD 25-55", "Reserve popular cellars."], ["Douro Valley day trip", "CAD 70-160", "The main splurge day."]),
    neighborhoods: neighborhoods(["Bonfim", "Lower", "Value stays", "Local food and walkable access", "Less scenic than Ribeira", "Short metro or walk"], ["Ribeira", "Higher", "Riverfront atmosphere", "Classic views and easy touring", "Higher prices and noise", "Walkable but hilly"], ["Cedofeita", "Balanced", "Food and design", "Good cafes and galleries", "Slightly farther from river", "Easy walk or transit"]),
    savingsTips: tips(["Sleep in Bonfim or Cedofeita", "Can reduce hotel spend", "Less riverfront drama", "Food-focused travelers"], ["Choose one cellar, not three", "Controls activity spend", "Less variety", "Wine-curious travelers"], ["Use train for nearby towns", "Cheaper than private tours", "Requires schedule planning", "Independent couples"]),
    itinerary: itinerary({ 3: [["Arrival and Ribeira", "Ribeira", "River walk, bridge views, and simple dinner", "CAD 10-30", "Dom Luis I bridge views", "River cruise", "Cross to Gaia before sunset"], ["Historic core and Gaia", "Centro / Gaia", "Clerigos area, station tiles, cellar tasting", "CAD 25-70", "Sao Bento tiles", "Port tasting", "Book cellar slots"], ["Douro or Foz", "Douro / Foz", "Pick wine valley splurge or low-cost coast tram", "CAD 15-160", "Foz waterfront", "Douro tour", "Check weather before choosing"]], 5: [], 7: [], 10: [] }),
    comparisonSlugs: ["lisbon", "barcelona", "paris"],
    bookingAdvice: { flights: "Compare northern and southern Portugal flight options; rail connections can make alternate airport routing workable.", hotels: "Check Bonfim and Cedofeita before paying Ribeira premiums.", activities: "Price Douro Valley as the signature paid day.", transport: "Use rail for Portugal add-ons instead of renting a car in the city.", esim: "Mobile data helps with steep walking routes and transit.", insurance: "Confirm coverage for separate tours and rail connections." },
  }),
  paris: cityProfile("paris", "France", "Paris rewards museum planners and neighborhood stay choices, but hotel timing dominates the budget.", "Best when the trip is about museums, food, walking neighborhoods, and classic Europe atmosphere.", "Paris is right for culture-first travelers who will plan timed entries and accept higher accommodation costs. It is weaker for travelers who want spontaneous low-cost comfort in peak season.", ["World-class museums", "Excellent public transit", "Food budgets can be controlled", "Strong rail alternatives"], ["Hotels are the major swing factor", "Major sights need timed planning", "Restaurant costs climb fast in central zones"], "Central hotel rates and peak museum queues can force expensive last-minute choices.", ["Culture-heavy first Europe trip", "Couples", "Museum travelers", "Train-based Europe", "Food with planning"], ["Low-stress peak summer", "Large rooms on a small budget", "Car-based sightseeing"], ["Airport rail transfer", "CAD 18-25", "Usually better value than taxis."], ["Metro ride", "CAD 3-5", "Best daily budget control."], ["Bakery breakfast", "CAD 7-12", "Useful way to offset dinner costs."], ["Major museum", "CAD 25-40", "Timed tickets reduce wasted time."], ["Bistro dinner", "CAD 35-65", "Neighborhood choice matters."]),
  tokyo: cityProfile("tokyo", "Japan", "Tokyo is expensive to reach but unusually controllable once you lean on transit, compact hotels, and casual food.", "Best for travelers who value efficiency, food range, and dense urban discovery more than hotel space.", "Tokyo fits solo travelers, food travelers, and culture-first city trips. It is less ideal for travelers who need large rooms, slow rural pacing, or a very short long-haul stay.", ["Exceptional transit", "Food costs scale from cheap to premium", "Safe solo travel", "Weather windows are clear"], ["Long flight from eastern Canada", "Compact rooms", "Cherry blossom weeks spike prices"], "Rail side trips and peak-season hotels can inflate an otherwise disciplined daily plan.", ["Solo travel", "Food halls and izakaya", "Transit-first trips", "Pop culture", "First Japan city base"], ["Large hotel rooms", "Short weekend trips", "Travelers avoiding long flights"], ["Airport rail", "CAD 25-45", "Choose airport based on hotel area."], ["Metro day", "CAD 8-14", "Transit is the budget backbone."], ["Convenience-store meal", "CAD 7-12", "Reliable low-cost option."], ["Ramen or casual set meal", "CAD 12-24", "Great value versus many global cities."], ["Major observation deck", "CAD 20-45", "Pick one skyline splurge."]),
  "mexico-city": cityProfile("mexico-city", "Mexico", "Mexico City offers the strongest culture-and-food return per dollar among the priority cities, with activity choices driving the upper range.", "Best for food, museums, and neighborhoods when you are comfortable with a large city footprint.", "Mexico City is excellent for food-first travelers, museum travelers, and repeat urban travelers. It is less ideal for beach seekers or anyone unwilling to plan airport and late-night transport.", ["Low daily food costs", "Deep museum and market scene", "Strong neighborhood variety", "Shorter flights from North America"], ["Altitude can affect pacing", "Traffic makes transfers unpredictable", "Top restaurants require planning"], "Paid day trips and ride-hail-heavy movement can quietly raise the total.", ["Food travelers", "Museums", "Solo city trips", "Value urban travel", "Shorter North America flights"], ["Beach vacations", "Low-altitude comfort", "Travelers avoiding large-city logistics"], ["Airport ride-hail", "CAD 18-35", "Often easier with luggage."], ["Metro ride", "Under CAD 2", "Very cheap but not always luggage-friendly."], ["Street food meal", "CAD 5-12", "Best value category."], ["Museum entry", "CAD 6-20", "Many excellent low-cost options."], ["Teotihuacan tour", "CAD 45-120", "Biggest common excursion."]),
  bangkok: cityProfile("bangkok", "Thailand", "Bangkok stretches the budget once you arrive, especially for food, transit, and longer stays.", "Best for warm-weather food travel where low daily costs offset a long-haul fare.", "Bangkok is strong for solo travelers, winter escapes, street food, and travelers using it as a Southeast Asia base. It is weaker for heat-sensitive visitors or travelers wanting beach time without onward transfers.", ["Very low food ceiling", "Good winter weather window", "Affordable hotels", "Easy activity marketplace"], ["Long flight cost", "Heat and humidity", "Traffic slows surface transport"], "Premium river hotels and multiple guided tours can erase the low-cost advantage.", ["Street food", "Solo travel", "Winter warmth", "Longer stays", "Night markets"], ["Heat-sensitive travelers", "Beach-only trips", "Short long-haul weekends"], ["Airport rail", "CAD 2-8", "Good value when hotel access works."], ["BTS/MRT day", "CAD 5-12", "Best way around traffic."], ["Street food meal", "CAD 3-8", "Core savings lever."], ["Temple entries", "CAD 8-25", "Plan dress rules and timing."], ["Floating market tour", "CAD 40-100", "Common paid excursion."]),
  seoul: cityProfile("seoul", "South Korea", "Seoul is a clean, transit-heavy city break where food and shopping can stay flexible but paid experiences add up.", "Best for solo travelers, food districts, culture, and efficient transit days.", "Seoul fits travelers who want a high-functioning city with strong food value and excellent transit. It is less ideal for beach seekers or travelers who dislike dense shopping and nightlife districts.", ["Excellent metro", "Strong casual food value", "Solo-friendly", "Distinct neighborhood moods"], ["Long-haul airfare", "Shopping can inflate spend", "Winter is cold"], "Shopping, cafe-hopping, and paid beauty or culture experiences can exceed the planned activity budget.", ["Solo travelers", "Korean food", "Transit-first city trips", "Culture and palaces", "Shopping districts"], ["Beach trips", "Warm winter escapes", "Large-room seekers"], ["Airport rail", "CAD 8-18", "Reliable entry option."], ["Metro day", "CAD 5-10", "Keep a transit card loaded."], ["Casual Korean meal", "CAD 10-20", "Good value outside premium districts."], ["Palace entry", "CAD 4-8", "Low-cost culture anchor."], ["DMZ or guided day trip", "CAD 70-150", "Main excursion spend."]),
  rome: cityProfile("rome", "Italy", "Rome is a high-value classic when you plan timed tickets and avoid overpaying for the most central hotel blocks.", "Best for ancient history, food, and families who can walk between dense sights.", "Rome fits culture-first travelers and families who want major sights close together. It is less ideal for travelers who dislike crowds, stairs, and timed entry planning.", ["Dense historic core", "Great food at many price points", "Walkable sightseeing", "Shoulder months are strong"], ["Crowds around Vatican and Colosseum", "Transit is less smooth than some rail-heavy capitals", "Summer heat"], "Skip-the-line tickets, central lodging, and taxis during heat waves can lift costs quickly.", ["Ancient history", "Families", "Food-focused couples", "First Italy trip", "Shoulder-season Europe"], ["Quiet peak-summer travel", "Step-free touring", "Transit perfectionists"], ["Airport train", "CAD 20-25", "Often simpler than road traffic."], ["Metro/bus day", "CAD 8-12", "Useful but walking still matters."], ["Pizza or pasta meal", "CAD 15-30", "Neighborhood trattorias help."], ["Colosseum ticket", "CAD 30-55", "Timed entry is essential."], ["Vatican museum", "CAD 35-70", "Book early for mornings."]),
  barcelona: cityProfile("barcelona", "Spain", "Barcelona combines beach and architecture, but peak-season hotel and ticket pressure need active control.", "Best for travelers who want a city trip with beaches, food, nightlife, and headline architecture.", "Barcelona fits couples, friends, and first Spain trips. It is weaker for travelers wanting quiet low-season prices in midsummer or fully spontaneous Gaudi sightseeing.", ["Beach plus city mix", "Strong food neighborhoods", "Good transit", "Architecture creates clear activity anchors"], ["Summer crowd pressure", "Timed tickets required", "Hotel costs rise near beach and Gothic core"], "Gaudi tickets and beach-adjacent hotels can push a balanced trip into comfort pricing.", ["Beach and city", "Architecture", "Couples", "Food and nightlife", "Shoulder-season Europe"], ["Quiet August travel", "No-ticket spontaneous sightseeing", "Car-based trips"], ["Airport train/metro", "CAD 8-14", "Good value versus taxis."], ["Metro day", "CAD 6-12", "Best way to link districts."], ["Tapas meal", "CAD 20-40", "Avoid the most touristy corridors."], ["Sagrada Familia ticket", "CAD 35-60", "Book early."], ["Montserrat day trip", "CAD 35-90", "Good non-beach excursion."]),
  cancun: cityProfile("cancun", "Mexico", "Cancun is convenient and predictable, but resorts, transfers, and excursions drive a very different budget than inland Mexico.", "Best for warm beach trips where direct flights and family logistics matter more than ultra-low daily costs.", "Cancun is right for families, beach-first travelers, and winter escapes. It is less ideal for travelers looking for deep urban culture or the lowest Mexico budget.", ["Direct flight potential", "Easy beach logistics", "Family-friendly inventory", "Clear winter demand pattern"], ["Hotel Zone premiums", "Excursions are expensive", "Less independent city texture"], "Excursions, resort meal plans, and airport transfers can cost more than local urban transport.", ["Families", "Beach trips", "Winter sun", "Package-style planning", "Shorter flights"], ["Lowest-cost Mexico", "Museum-heavy trips", "Car-free exploration outside resort zones"], ["Airport transfer", "CAD 25-80", "Prebook to avoid arrival friction."], ["Local bus in Hotel Zone", "CAD 2-4", "Useful for simple movement."], ["Casual meal outside resort", "CAD 15-30", "Savings depend on location."], ["Cenote or ruins excursion", "CAD 70-160", "Main activity budget risk."], ["Reef or boat tour", "CAD 65-140", "Compare inclusions carefully."]),
} satisfies Record<string, DestinationProfile>;

function cityProfile(slug: string, country: string, summary: string, headline: string, verdictSummary: string, advantages: string[], tradeoffs: string[], budgetRisk: string, idealFor: string[], notIdealFor: string[], ...costRows: [string, string, string][]): DestinationProfile {
  return profile({
    slug,
    country,
    summary,
    editorialVerdict: verdict(headline, verdictSummary, advantages, tradeoffs, budgetRisk),
    idealFor,
    notIdealFor,
    localCosts: costs(...costRows),
    neighborhoods: defaultNeighborhoods(slug),
    savingsTips: defaultTips(slug),
    itinerary: defaultCityItinerary(slug),
    comparisonSlugs: defaultComparisons(slug),
    bookingAdvice: defaultBookingAdvice(slug),
  });
}

function profile(input: Omit<DestinationProfile, "name" | "currency" | "tripScenarios" | "monthlyInsights" | "enabledModules" | "dataFreshness" | "comparisons"> & Partial<Pick<DestinationProfile, "name" | "currency" | "tripScenarios" | "monthlyInsights" | "enabledModules" | "dataFreshness" | "comparisons">>): DestinationProfile {
  return {
    name: input.name ?? input.slug,
    currency: input.currency ?? "CAD",
    tripScenarios: input.tripScenarios ?? defaultTripScenarios(input.slug),
    monthlyInsights: input.monthlyInsights ?? defaultMonthlyInsights(),
    enabledModules: input.enabledModules ?? ["editorialVerdict", "budgetScenarios", "localCosts", "neighborhoods", "monthlyInsights", "savingsTips", "itinerary", "comparisons", "bookingAdvice"],
    dataFreshness: input.dataFreshness ?? defaultFreshness("medium", "2026-06-24"),
    ...input,
  };
}

function verdict(headline: string, summary: string, advantages: string[], tradeoffs: string[], budgetRisk: string): DestinationVerdict {
  return { headline, summary, advantages, tradeoffs, budgetRisk };
}

function costs(...items: [string, string, string][]): LocalCost[] {
  return items.map(([label, estimate, note]) => ({ label, estimate, note }));
}

function neighborhoods(...items: [string, Neighborhood["relativeCost"], string, string, string, string][]): Neighborhood[] {
  return items.map(([name, relativeCost, idealFor, advantages, tradeoffs, access]) => ({ name, relativeCost, idealFor, advantages, tradeoffs, access }));
}

function tips(...items: [string, string, string, string][]): SavingsTip[] {
  return items.map(([action, impact, tradeoff, bestFor]) => ({ action, impact, tradeoff, bestFor }));
}

function itinerary(input: Partial<Record<3 | 5 | 7 | 10, [string, string, string, string, string, string, string][]>>): DestinationProfile["itinerary"] {
  const output: Partial<Record<3 | 5 | 7 | 10, ItineraryDay[]>> = {};
  for (const [length, days] of Object.entries(input)) {
    output[Number(length) as 3 | 5 | 7 | 10] = days.map(([title, area, activity, estimatedCost, freeOption, paidOption, logisticsTip]) => ({ title, area, activity, estimatedCost, freeOption, paidOption, logisticsTip }));
  }
  return output;
}

function defaultTripScenarios(slug: string): TripScenario[] {
  const scenarios = [
    { key: "budget", title: "Budget", stay: "Simple guesthouse, apartment room, or outer-neighborhood hotel", meals: "Bakeries, markets, casual counters, and a few planned sit-down meals", transport: "Public transit first, limited taxis", activities: "One paid anchor plus free neighborhoods and viewpoints", tradeoff: "Less central lodging and fewer paid tours", traveler: "Independent travelers who prefer spending time over buying convenience" },
    { key: "midRange", title: "Balanced", stay: "Well-located 3-star hotel or practical apartment", meals: "Casual restaurants with selective splurges", transport: "Transit plus airport or late-night ride-hail when it saves stress", activities: "Timed major sights, one day trip, and one guided experience", tradeoff: "Requires booking the expensive days early", traveler: "Most first-time visitors" },
    { key: "luxury", title: "Comfort", stay: "Central boutique hotel or larger room in a prime area", meals: "Reserved restaurants and fewer self-catered meals", transport: "Private transfers or taxis when logistics matter", activities: "Skip-the-line tickets, small-group tours, and signature excursions", tradeoff: "Convenience raises the daily baseline", traveler: "Travelers optimizing comfort on a short or special trip" },
  ] satisfies TripScenario[];

  return scenarios.map((scenario) => ({ ...scenario, stay: scenario.stay.replace("outer-neighborhood", slug === "cancun" ? "off-beach or downtown" : "outer-neighborhood") }));
}

function defaultMonthlyInsights(): MonthlyInsight[] {
  return months.map((month, index) => {
    const shoulder = ["April", "May", "September", "October"].includes(month);
    const peak = ["July", "August", "December"].includes(month);
    return {
      month,
      flights: peak ? "High" : shoulder ? "Medium" : "Low",
      hotels: peak ? "High" : shoulder ? "Medium" : "Low",
      weather: shoulder ? "Usually one of the easier planning windows" : peak ? "Demand can matter more than comfort" : "Check seasonal comfort before booking",
      crowds: peak ? "High" : shoulder ? "Medium" : "Low",
      recommendation: shoulder ? "Best value/weather balance" : index < 2 ? "Often useful for fare checks" : "Use as a relative planning estimate",
      factor: shoulder ? "Shoulder-season value" : peak ? "Holiday or summer demand" : "Lower relative demand",
    };
  });
}

function defaultNeighborhoods(slug: string): Neighborhood[] {
  const bySlug: Record<string, Neighborhood[]> = {
    paris: neighborhoods(["Bastille / 11th", "Balanced", "Food and nightlife", "Good transit and restaurants", "Less postcard-central", "Metro-heavy"], ["Latin Quarter", "Higher", "First-time culture", "Walkable museums and river access", "Higher stay costs", "Central walking"], ["Montmartre", "Balanced", "Atmosphere", "Views and neighborhood feel", "Hills and tourist pockets", "Metro plus walking"]),
    tokyo: neighborhoods(["Ueno", "Balanced", "Value and museums", "Transit, food, and park access", "Less glossy than west Tokyo", "Strong rail links"], ["Shinjuku", "Higher", "Nightlife and transit", "Maximum connectivity", "Crowds and hotel premiums", "Major rail hub"], ["Asakusa", "Balanced", "Traditional atmosphere", "Temple area and lower-cost stays", "Farther from some nightlife", "Metro connections"]),
    "mexico-city": neighborhoods(["Roma Norte", "Higher", "Food and first visit", "Restaurants, parks, and walkability", "Higher room prices", "Central ride-hail access"], ["Centro Historico", "Balanced", "Museums and history", "Close to major sights", "Quieter at night in parts", "Metro and walking"], ["Coyoacan", "Balanced", "Slower culture days", "Markets and plazas", "Farther from north/west sights", "Best with planned transfers"]),
    bangkok: neighborhoods(["Sukhumvit", "Balanced", "Transit and nightlife", "BTS access and broad hotel range", "Traffic and busy streets", "BTS-first"], ["Riverside", "Higher", "Comfort stays", "Views and temple access", "Hotel premiums", "Boat plus taxi"], ["Old City", "Lower", "Temples", "Close to classic sights", "Less connected by rail", "Taxi or boat planning"]),
    seoul: neighborhoods(["Hongdae", "Balanced", "Food and nightlife", "Youthful food and transit", "Busy evenings", "Metro access"], ["Myeongdong", "Higher", "First-time base", "Central shopping and transit", "Touristy and hotel pressure", "Easy connections"], ["Insadong / Jongno", "Balanced", "Culture", "Palaces and traditional streets", "Quieter nightlife", "Walk and metro"]),
    rome: neighborhoods(["Monti", "Higher", "First-time Rome", "Food and Colosseum access", "Hotel pressure", "Walkable core"], ["Prati", "Balanced", "Vatican and calmer nights", "Good restaurants and metro", "Farther from ancient core", "Metro plus walks"], ["Testaccio", "Lower", "Food value", "Local restaurants", "Less central", "Taxi or transit"]),
    barcelona: neighborhoods(["Eixample", "Balanced", "Architecture and transit", "Good grid, food, and metro", "Can be busy", "Excellent metro"], ["Gracia", "Balanced", "Local evenings", "Squares and restaurants", "Farther from beach", "Metro access"], ["Gothic / Born", "Higher", "First-time sightseeing", "Historic atmosphere", "Noise and premiums", "Walkable core"]),
    cancun: neighborhoods(["Downtown Cancun", "Lower", "Value and local food", "Cheaper meals and buses", "Not beachfront", "Bus/taxi to beaches"], ["Hotel Zone", "Higher", "Beach and family logistics", "Easy resort access", "Higher food and stay costs", "Bus corridor"], ["Puerto Morelos", "Balanced", "Quieter beach", "Lower-key reef town", "Farther from nightlife", "Transfer planning"]),
  };
  return bySlug[slug] ?? [];
}

function defaultTips(slug: string): SavingsTip[] {
  return {
    paris: tips(["Stay one metro ride from the Seine", "Materially lowers hotel pressure", "Adds transit time", "Museum travelers"], ["Use bakeries and fixed-price lunches", "Controls food spend", "Less restaurant variety at dinner", "Food planners"], ["Group paid museums by day", "Reduces wasted transit and queues", "Requires timed planning", "Culture-first trips"]),
    tokyo: tips(["Use compact business hotels near rail", "Controls accommodation without weak locations", "Smaller rooms", "Solo and couples"], ["Keep one skyline splurge", "Avoids duplicate high-ticket views", "Less premium variety", "First-time visitors"], ["Use convenience stores strategically", "Cuts breakfast and snack spend", "Less sit-down dining", "Budget food travelers"]),
    "mexico-city": tips(["Base in Roma/Condesa only if you will use it", "Avoids paying for a neighborhood you barely see", "May need more ride-hail", "Museum-heavy trips"], ["Self-direct some museum days", "Keeps activity costs low", "Less guide context", "Independent travelers"], ["Preprice Teotihuacan", "Prevents excursion shock", "Commits a full day", "Culture travelers"]),
    bangkok: tips(["Choose BTS/MRT access over room size", "Saves time and taxis", "Rooms may be smaller", "First-time visitors"], ["Eat street food and mall food courts", "Major daily savings", "Less polished dining", "Food travelers"], ["Limit private tours", "Preserves the low local-cost advantage", "More self-navigation", "Solo travelers"]),
    seoul: tips(["Stay on a useful metro line", "Cuts transfers and taxis", "May not be the trendiest area", "Solo travelers"], ["Use palace and market days as low-cost anchors", "Balances shopping spend", "Less premium activity time", "Culture travelers"], ["Set a cafe and shopping budget", "Prevents small purchases adding up", "Less spontaneous spending", "K-culture travelers"]),
    rome: tips(["Book timed headline sights early", "Avoids expensive last-minute tours", "Less spontaneity", "First-time visitors"], ["Stay in Prati or Testaccio for value", "Reduces central hotel spend", "Adds transit/walk time", "Food travelers"], ["Walk grouped sights", "Saves local transport", "Harder in summer heat", "Active families"]),
    barcelona: tips(["Visit outside July and August", "Reduces hotel and crowd pressure", "Beach weather less guaranteed", "Flexible travelers"], ["Buy only the Gaudi tickets you truly want", "Avoids stacking expensive entries", "Less completionist sightseeing", "Architecture travelers"], ["Stay in Gracia or Eixample", "Balances access and price", "Less beachfront", "Couples"]),
    cancun: tips(["Compare downtown plus beach days against resorts", "Can reduce stay and meal costs", "Less beach convenience", "Independent travelers"], ["Prebook transfers", "Avoids arrival overpaying", "Less flexibility", "Families"], ["Pick one major excursion", "Controls the activity line", "Fewer day trips", "Beach-first travelers"]),
  }[slug] ?? tips(["Shift away from the most central stay area", "Can reduce lodging spend", "Adds local transport", "Budget travelers"], ["Travel in shoulder months", "Improves value and crowd levels", "Weather can be less certain", "Flexible date travelers"], ["Choose one paid anchor per two or three days", "Keeps activity spend predictable", "Less packed sightseeing", "Balanced travelers"]);
}

function defaultCityItinerary(slug: string): DestinationProfile["itinerary"] {
  const labels: Record<string, [string, string, string]> = {
    paris: ["Seine and Louvre area", "Montmartre and food streets", "Versailles or museum day"],
    tokyo: ["Asakusa and Ueno", "Shinjuku and Shibuya", "TeamLab or west-side neighborhoods"],
    "mexico-city": ["Roma and Condesa", "Historic Center", "Teotihuacan or Coyoacan"],
    bangkok: ["Old City temples", "Sukhumvit food and transit", "Canals or market day"],
    seoul: ["Palaces and Bukchon", "Hongdae and markets", "DMZ or river parks"],
    rome: ["Colosseum and Monti", "Vatican and Prati", "Trastevere and Testaccio"],
    barcelona: ["Gothic Quarter and Born", "Eixample and Sagrada Familia", "Beach or Montserrat"],
    cancun: ["Hotel Zone beach", "Downtown food", "Cenote or ruins day"],
  };
  const [a, b, c] = labels[slug] ?? ["Arrival area", "Core sights", "Optional excursion"];
  return itinerary({
    3: [[`Arrival: ${a}`, a, "Orientation walk and first local meal", "CAD 10-35", "Neighborhood walk", "Guided intro tour", "Keep the first night close to base"], [`Core day: ${b}`, b, "Major sights, food stops, and transit practice", "CAD 20-70", "Public squares and markets", "Timed ticket or food tour", "Start early"], [`Decision day: ${c}`, c, "Choose the major excursion or a lower-cost local day", "CAD 20-140", "Parks, markets, or viewpoints", "Signature day trip", "Do not stack two big paid experiences"]],
    5: [[`Arrival: ${a}`, a, "Easy orientation", "CAD 10-30", "Walk", "Intro tour", "Sleep near transit"], [`Main sights: ${b}`, b, "Headline sights and timed entries", "CAD 25-80", "Free exterior route", "Major ticket", "Book ahead"], [`Food and neighborhoods`, a, "Markets, cafes, and local districts", "CAD 15-55", "Market browsing", "Food tour", "Use lunch for value"], [`Excursion: ${c}`, c, "One bigger paid or self-directed day", "CAD 35-150", "Local park or beach", "Guided day trip", "Check transfer time"], ["Final flexible day", b, "Anything missed plus low-pressure departure prep", "CAD 10-40", "Viewpoints", "Museum or workshop", "Protect airport buffer"]],
    7: [[`Arrival: ${a}`, a, "Orientation and nearby dinner", "CAD 10-30", "Walk", "Intro tour", "Avoid crossing town"], [`Main sights: ${b}`, b, "Major sights", "CAD 25-80", "Exterior route", "Timed ticket", "Start early"], ["Food route", a, "Markets and neighborhood meals", "CAD 20-60", "Markets", "Food tour", "Reserve key meals"], [`Excursion: ${c}`, c, "One signature side trip", "CAD 35-150", "Local alternative", "Guided excursion", "Keep evening simple"], ["Lower-cost culture day", b, "Museums, parks, or free districts", "CAD 10-45", "Parks and streets", "Museum choice", "Use transit pass"], ["Second neighborhood base", a, "Different area with less checklist pressure", "CAD 15-50", "Local walk", "Workshop or show", "Avoid duplicate activities"], ["Departure buffer", b, "Breakfast, final shopping, and transit buffer", "CAD 10-30", "Final walk", "Short activity", "Leave luggage plan"]],
    10: [[`Arrival: ${a}`, a, "Settle in", "CAD 10-30", "Walk", "Intro tour", "Stay near transit"], [`Main sights: ${b}`, b, "Headline sights", "CAD 25-80", "Free route", "Timed ticket", "Book ahead"], ["Food and market day", a, "Food neighborhoods", "CAD 20-60", "Markets", "Food tour", "Use lunch value"], [`Excursion: ${c}`, c, "Signature side trip", "CAD 35-150", "Local alternative", "Guided excursion", "Check schedules"], ["Slow culture day", b, "Museums or local culture", "CAD 10-45", "Parks", "Museum", "Avoid overpacking"], ["Second base", a, "New district", "CAD 15-50", "Walk", "Workshop", "Transit-first"], ["Nightlife or evening plan", b, "Evening food, show, or view", "CAD 20-80", "Night walk", "Show or tasting", "Plan late transport"], ["Open-air day", c, "Parks, beach, river, or scenic route", "CAD 10-60", "Public outdoor route", "Guided activity", "Check weather"], ["Final major choice", b, "One missed highlight", "CAD 20-90", "Free district", "Paid anchor", "Do not add far transfers"], ["Departure buffer", a, "Simple final day", "CAD 10-30", "Walk", "Short ticket", "Leave airport time"]],
  });
}

function defaultComparisons(slug: string): string[] {
  return {
    paris: ["lisbon", "rome", "barcelona"],
    tokyo: ["seoul", "osaka", "bangkok"],
    "mexico-city": ["cancun", "oaxaca", "lisbon"],
    bangkok: ["tokyo", "seoul", "bali"],
    seoul: ["tokyo", "bangkok", "taipei"],
    rome: ["paris", "barcelona", "lisbon"],
    barcelona: ["lisbon", "rome", "paris"],
    cancun: ["mexico-city", "cartagena", "bali"],
  }[slug] ?? [];
}

function defaultBookingAdvice(slug: string): BookingAdvice {
  return {
    flights: `Check flights before hotels so the ${title(slug)} budget starts from a real fare range.`,
    hotels: `Compare best-value neighborhoods before choosing the most central ${title(slug)} stay.`,
    activities: `Price the signature ${title(slug)} paid day separately from everyday sightseeing.`,
    transport: "Confirm whether transit, rail, airport transfers, or ride-hail should be the default.",
    esim: "Set up mobile data before arrival to reduce navigation and transfer friction.",
    insurance: "Review medical, delay, baggage, and separately booked activity coverage.",
  };
}

function defaultFreshness(confidence: Destination["dataConfidence"], lastUpdated: string): DataFreshness {
  return {
    lastUpdated,
    flightSource: "Modeled round-trip flight planning ranges by available origin city.",
    hotelSource: "Modeled accommodation ranges from the destination cost dataset.",
    method: "Flights are modeled separately from per-day accommodation, food, local transport, activities, and a planning buffer.",
    exchangeRate: "All public estimates are normalized to CAD planning values.",
    confidence,
    limits: ["Not a live booking quote.", "Seasonality, availability, baggage, cancellation rules, and exchange-rate movement can change the final price."],
  };
}

export function getDestinationProfile(destination: Destination): DestinationProfile {
  const specific = priorityProfiles[destination.slug as keyof typeof priorityProfiles];
  if (specific) {
    return hydrateProfile(specific, destination);
  }

  const comparisonSlugs = getRegisteredComparisonSlugs(destination.slug);
  const enabledModules: DestinationModule[] = [
    "editorialVerdict",
    "budgetScenarios",
    "localCosts",
    "monthlyInsights",
    "savingsTips",
    "itinerary",
    "bookingAdvice",
    ...(comparisonSlugs.length > 0 ? ["comparisons" as const] : []),
  ];

  return hydrateProfile(profile({
    slug: destination.slug,
    country: destination.countryName ?? destination.name,
    summary: destination.shortDescription,
    editorialVerdict: buildFallbackVerdict(destination),
    idealFor: buildFallbackIdealFor(destination),
    notIdealFor: buildFallbackNotIdealFor(destination),
    localCosts: buildFallbackLocalCosts(destination),
    neighborhoods: [],
    savingsTips: buildFallbackSavingsTips(destination),
    itinerary: buildFallbackItinerary(destination),
    comparisonSlugs,
    bookingAdvice: defaultBookingAdvice(destination.slug),
    enabledModules,
  }), destination);
}

function buildFallbackVerdict(destination: Destination): DestinationVerdict {
  const primaryStyle = destination.travelStyles[0]?.toLowerCase() ?? "practical planning";
  const secondaryStyle = destination.travelStyles[1]?.toLowerCase();
  const stylePhrase = secondaryStyle ? `${primaryStyle} and ${secondaryStyle}` : primaryStyle;
  const dailyTotal = getDailyCostTotal(destination, "midRange");

  return verdict(
    `Best for ${stylePhrase} travelers who want the total trip cost visible before booking.`,
    destination.shortDescription,
    [
      `Strongest fit: ${destination.travelStyles.slice(0, 3).join(", ") || "Flexible travel"}`,
      `Best planning months: ${destination.bestMonths.join(", ")}`,
      `Mid-range daily baseline: ${formatCad(dailyTotal)}`,
    ],
    [
      "Neighborhood-level stay guidance is not yet available for this destination.",
      "Live hotel and fare checks are still required before purchase.",
      "Peak dates can move the estimate outside the modeled range.",
    ],
    "Flights and accommodation timing are the main swing factors, followed by paid activities and local transfer choices."
  );
}

function buildFallbackIdealFor(destination: Destination) {
  return [
    ...destination.travelStyles,
    `${destination.bestMonths[0] ?? "Shoulder-season"} travel`,
    destination.dataConfidence === "high" ? "Travelers who want stronger estimate confidence" : "Travelers comfortable checking live prices",
  ].slice(0, 5);
}

function buildFallbackNotIdealFor(destination: Destination) {
  const dailyTotal = getDailyCostTotal(destination, "midRange");

  return [
    dailyTotal > 210 ? "Strict low-budget travelers" : "Luxury-only travelers",
    "Travelers who need neighborhood-specific hotel advice before comparing stays",
    "Trips booked without checking current flights, stays, and transfers",
  ];
}

function buildFallbackLocalCosts(destination: Destination): LocalCost[] {
  const midRange = destination.dailyCosts.midRange;
  const budget = destination.dailyCosts.budget;
  const airportTransferLow = Math.max(15, Math.round(midRange.localTransport * 0.8));
  const airportTransferHigh = Math.max(airportTransferLow + 15, Math.round(midRange.localTransport * 2.2));

  return [
    {
      label: "Airport transfer planning",
      estimate: `${formatCad(airportTransferLow)}-${formatCad(airportTransferHigh)}`,
      note: "Use this as an arrival-logistics range, then verify current transfer prices before booking.",
    },
    {
      label: "Metro, train, bus, or local transport day",
      estimate: `${formatCad(budget.localTransport)}-${formatCad(midRange.localTransport)}`,
      note: "Based on the destination transport allowance in the current GoByBudget cost model.",
    },
    {
      label: "Typical accommodation night",
      estimate: `${formatCad(budget.accommodation)}-${formatCad(midRange.accommodation)}`,
      note: "Modeled per traveler per night; actual hotel prices should be checked for your dates.",
    },
    {
      label: "Casual food day",
      estimate: `${formatCad(budget.food)}-${formatCad(midRange.food)}`,
      note: "Useful for comparing whether the destination works with casual meals or needs more restaurant budget.",
    },
    {
      label: "Paid activities day",
      estimate: `${formatCad(budget.activities)}-${formatCad(midRange.activities)}`,
      note: "Covers a practical daily activity allowance, not every tour or special-event ticket.",
    },
  ];
}

function buildFallbackSavingsTips(destination: Destination): SavingsTip[] {
  const firstMonth = destination.bestMonths[0] ?? "a shoulder month";
  const primaryStyle = destination.travelStyles[0] ?? "the main trip style";

  return tips(
    [`Start with ${firstMonth} dates`, "Improves the chance that flights and stays align with the model", "Weather or event timing may be less perfect", "Flexible date travelers"],
    ["Compare accommodation before treating a fare as cheap", "Prevents a low flight from hiding high stay costs", "Takes more planning upfront", "Travelers booking independently"],
    [`Keep paid activities focused on ${primaryStyle.toLowerCase()}`, "Protects the budget from scattered small bookings", "You may skip secondary attractions", "Travelers with a clear trip purpose"]
  );
}

function buildFallbackItinerary(destination: Destination): DestinationProfile["itinerary"] {
  const preview = destination.itineraryPreview.length > 0
    ? destination.itineraryPreview
    : [`${destination.name} arrival and orientation`, `${destination.name} core sights`, `${destination.name} food and local transport day`];

  const dayRows = [
    [preview[0], "Arrival base", "Get oriented around the first stay area, confirm transit, and keep the first meal simple.", "CAD 10-35", "Neighborhood walk", "Guided orientation or food walk", "Avoid long cross-city transfers after arrival"],
    [preview[1] ?? preview[0], "Core sights", "Use the strongest existing itinerary theme as the main sightseeing day.", "CAD 20-70", "Self-guided route", "Timed ticket or guided experience", "Book the one must-do paid item first"],
    [preview[2] ?? preview[0], "Secondary district or day trip", "Add the next most useful route only if it fits the trip length and budget.", "CAD 25-120", "Markets, parks, or viewpoints", "Day trip or signature activity", "Check return transport before committing"],
    [`${destination.name} food and lower-cost day`, "Food and neighborhoods", "Use casual meals, markets, and slower areas to balance the more expensive activity day.", "CAD 15-55", "Markets and public spaces", "Food tour or cooking class", "Use this day after the biggest paid experience"],
    [`${destination.name} flexible final pass`, "Departure area", "Keep the final day simple with anything missed, luggage, and airport or station timing.", "CAD 10-40", "Final walk", "Short museum or activity", "Protect departure buffer"],
    [`${destination.name} extra culture day`, "Culture route", "Add a museum, historic site, beach, nature, or neighborhood route tied to the destination style.", "CAD 15-65", "Self-guided culture route", "Museum, show, or guided visit", "Group nearby sights together"],
    [`${destination.name} practical rest day`, "Near your stay", "Use a lighter day to avoid making the itinerary a checklist.", "CAD 10-35", "Parks or cafes", "Short workshop or tasting", "Keep transport minimal"],
    [`${destination.name} signature activity`, "Main activity zone", "Use one more paid anchor if the longer trip supports it.", "CAD 30-140", "Scenic route or free attraction", "Small-group tour", "Compare cancellation terms"],
    [`${destination.name} open-air day`, "Outdoor route", "Prioritize the weather-dependent activity here.", "CAD 10-60", "Viewpoints or waterfront", "Guided outdoor activity", "Move this day if weather changes"],
    [`${destination.name} departure buffer`, "Final base", "Final breakfast, checkout, and a low-risk route before leaving.", "CAD 10-30", "Short walk", "Quick ticketed stop", "Leave extra time for transfers"],
  ] satisfies [string, string, string, string, string, string, string][];

  return itinerary({
    3: dayRows.slice(0, 3),
    5: dayRows.slice(0, 5),
    7: dayRows.slice(0, 7),
    10: dayRows.slice(0, 10),
  });
}

function getRegisteredComparisonSlugs(destinationSlug: string) {
  return comparisonPages
    .filter((page): page is Extract<(typeof comparisonPages)[number], { kind: "destination-pair" }> => page.kind === "destination-pair")
    .filter((page) => page.destinationSlugs.includes(destinationSlug))
    .flatMap((page) => page.destinationSlugs.filter((slug) => slug !== destinationSlug))
    .filter(uniqueValue)
    .slice(0, 3);
}

function hydrateProfile(profileItem: DestinationProfile, destination: Destination): DestinationProfile {
  const fallbackItinerary = defaultCityItinerary(destination.slug);
  const customItinerary = profileItem.itinerary
    ? Object.fromEntries(
        Object.entries(profileItem.itinerary).filter(([, days]) => Array.isArray(days) && days.length > 0)
      ) as DestinationProfile["itinerary"]
    : undefined;

  return {
    ...profileItem,
    name: destination.name,
    country: destination.countryName ?? profileItem.country,
    currency: destination.currency,
    dataFreshness: defaultFreshness(destination.dataConfidence, destination.lastUpdated),
    tripScenarios: profileItem.tripScenarios.map((scenario) => ({
      ...scenario,
      title: scenario.title,
    })),
    itinerary: customItinerary ? { ...fallbackItinerary, ...customItinerary } : profileItem.itinerary,
    comparisons: buildComparisons(destination, profileItem.comparisonSlugs ?? []),
  };
}

function buildComparisons(destination: Destination, comparisonSlugs: string[]): DestinationComparison[] {
  return comparisonSlugs.map((slug) => {
    const page = comparisonPages.find((candidate) => candidate.kind === "destination-pair" && candidate.destinationSlugs.includes(destination.slug) && candidate.destinationSlugs.includes(slug));
    return {
      slug,
      name: title(slug),
      costDifference: `${title(slug)} is worth checking when the total differs by hotel season or flight routing, not just by base price.`,
      flightDifference: "Flight availability can be the deciding factor from Canadian origins.",
      climateDifference: "Compare the month, not only the annual average.",
      styleDifference: `${destination.name} wins for its own trip style; ${title(slug)} wins when that alternative better matches the traveler profile.`,
      chooseCurrentIf: `Choose ${destination.name} if the verdict and best months match your trip.`,
      chooseAlternativeIf: `Choose ${title(slug)} if its flight timing, climate, or trip style is a cleaner fit.`,
      href: page ? getComparisonPath(page) : `/compare?destination=${destination.slug}&destination=${slug}`,
    };
  });
}

export function getScenarioEstimate(destination: Destination, scenario: TripScenario, days = 10) {
  return getDestinationTripEstimate(destination, { days, originCode: "YUL", travelStyle: scenario.key });
}

export function getScenarioDaily(destination: Destination, scenario: TripScenario) {
  return getDailyCostTotal(destination, scenario.key);
}

export function validateDestinationProfileCrossMentions(profiles: DestinationProfile[]) {
  const names = profiles.map((profileItem) => profileItem.name).filter(Boolean);
  const issues: Array<{ slug: string; unexpectedName: string }> = [];

  for (const profileItem of profiles) {
    const allowed = new Set([profileItem.name, ...(profileItem.allowedCrossDestinationMentions ?? [])].map(normalizeText));
    const searchable = normalizeText(JSON.stringify({
      summary: profileItem.summary,
      editorialVerdict: profileItem.editorialVerdict,
      idealFor: profileItem.idealFor,
      notIdealFor: profileItem.notIdealFor,
      tripScenarios: profileItem.tripScenarios,
      localCosts: profileItem.localCosts,
      neighborhoods: profileItem.neighborhoods,
      monthlyInsights: profileItem.monthlyInsights,
      savingsTips: profileItem.savingsTips,
      itinerary: profileItem.itinerary,
      bookingAdvice: profileItem.bookingAdvice,
    }));

    for (const name of names) {
      const normalizedName = normalizeText(name);
      if (!allowed.has(normalizedName) && searchable.includes(normalizedName)) {
        issues.push({ slug: profileItem.slug, unexpectedName: name });
      }
    }
  }

  return issues;
}

function normalizeText(value: string) {
  return value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function title(slug: string) {
  return slug.split("-").map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" ");
}

function formatCad(amount: number) {
  return `CAD ${Math.round(amount)}`;
}

function uniqueValue<Value>(value: Value, index: number, values: Value[]) {
  return values.indexOf(value) === index;
}

export const priorityDestinationProfileSlugs = Object.keys(priorityProfiles);
