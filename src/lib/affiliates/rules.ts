import { affiliateConfig } from "@/lib/affiliates/config";
import { buildAffiliateUrl, buildSubId } from "@/lib/affiliates/buildAffiliateUrl";
import { getDestinationAffiliateRule, shouldTreatAsRoadTrip } from "@/lib/affiliates/destinations";
import type { AffiliateCategory, AffiliateContext, AffiliateProvider, AffiliateRecommendation } from "@/lib/affiliates/types";

const providerByCategory: Record<AffiliateCategory, AffiliateProvider> = {
  flights: "aviasales",
  hotels: "klook",
  activities: "getyourguide",
  esim: "airalo",
  car_rental: "discover_cars",
  trains_buses: "klook",
  travel_insurance: "travel_insurance",
  airport_transfer: "airport_transfer",
};

const defaultPriority: Record<AffiliateCategory, number> = {
  flights: 10,
  hotels: 20,
  activities: 30,
  esim: 40,
  car_rental: 50,
  trains_buses: 50,
  travel_insurance: 60,
  airport_transfer: 70,
};

const categories: AffiliateCategory[] = [
  "flights",
  "hotels",
  "activities",
  "esim",
  "car_rental",
  "trains_buses",
  "travel_insurance",
  "airport_transfer",
];

export function getAffiliateRecommendations(
  context: AffiliateContext,
  options: { limit?: number; categories?: AffiliateCategory[] } = {}
): AffiliateRecommendation[] {
  const selectedCategories = options.categories ?? categories;
  const recommendations = selectedCategories
    .map((category) => getAffiliateForCategory(category, { ...context, category }))
    .filter((recommendation): recommendation is AffiliateRecommendation => Boolean(recommendation));
  const unique = new Map<AffiliateCategory, AffiliateRecommendation>();

  for (const recommendation of recommendations) {
    const existing = unique.get(recommendation.category);
    if (!existing || recommendation.priority < existing.priority) {
      unique.set(recommendation.category, recommendation);
    }
  }

  const sorted = Array.from(unique.values()).sort((a, b) => a.priority - b.priority);

  return typeof options.limit === "number" ? sorted.slice(0, options.limit) : sorted;
}

export function getAffiliateForCategory(
  category: AffiliateCategory,
  context: AffiliateContext
): AffiliateRecommendation | null {
  const provider = providerByCategory[category];
  const config = affiliateConfig[provider];

  if (!config.enabled) {
    return null;
  }

  const eligibility = getEligibility(category, context);
  if (!eligibility.enabled) {
    return null;
  }

  const url = buildAffiliateUrl(provider, { ...context, category });
  if (!url) {
    return null;
  }

  return {
    provider,
    category,
    url,
    label: buildLabel(category, context),
    description: buildDescription(category),
    enabled: true,
    reason: eligibility.reason,
    priority: getPriority(category, context),
    subId: buildSubId({ ...context, category }),
  };
}

function getEligibility(category: AffiliateCategory, context: AffiliateContext) {
  const rule = getDestinationAffiliateRule(context);
  const internationalTrip = context.internationalTrip ?? isInternationalTrip(context);
  const durationDays = context.durationDays ?? 1;
  const continent = context.continent ?? rule.continent;

  if (category === "flights") {
    return {
      enabled: Boolean((context.destinationIata || context.destinationCity || context.destinationCountry) && internationalTrip),
      reason: "Flight-relevant intercity or international trip.",
    };
  }

  if (category === "hotels") {
    return { enabled: context.hasOvernightStay !== false && durationDays >= 1, reason: "Overnight destination." };
  }

  if (category === "activities") {
    return { enabled: context.hasActivities !== false && durationDays >= 1, reason: "Tourist activities are relevant." };
  }

  if (category === "esim") {
    return { enabled: internationalTrip && durationDays >= 2 && rule.esim !== false, reason: "International trip of at least two days." };
  }

  if (category === "car_rental") {
    if (rule.carRental === false || rule.transitFriendly) {
      return { enabled: false, reason: "Transit-friendly destination." };
    }

    return {
      enabled: rule.carRental === true || rule.carRental === "optional" || shouldTreatAsRoadTrip(context),
      reason: rule.carReason ?? "Car rental can be relevant for this itinerary.",
    };
  }

  if (category === "trains_buses") {
    return {
      enabled: Boolean(rule.railRelevant || context.railRelevant || continent === "Europe" || context.transportType === "rail"),
      reason: "Rail or intercity ground transport is relevant.",
    };
  }

  if (category === "travel_insurance") {
    return {
      enabled: internationalTrip || durationDays >= 10 || context.pageType === "calculator" || context.pageType === "travel_budget",
      reason: "Insurance is relevant for international, longer, or total-budget planning.",
    };
  }

  return {
    enabled: Boolean(context.destinationIata || rule.airportTransfer),
    reason: "Airport arrival logistics are relevant.",
  };
}

function getPriority(category: AffiliateCategory, context: AffiliateContext) {
  let priority = defaultPriority[category];

  if (context.pageType === "destination") {
    if (category === "hotels") priority = 10;
    if (category === "flights") priority = 20;
  }

  if (context.pageType === "road_trip") {
    if (category === "car_rental") priority = 10;
    if (category === "hotels") priority = 20;
  }

  if (context.pageType === "multi_city" || context.railRelevant) {
    if (category === "trains_buses") priority = 10;
    if (category === "car_rental") priority = 55;
  }

  if (context.pageType === "travel_budget" || context.pageType === "travel_cost") {
    if (category === "flights") priority = 10;
    if (category === "hotels") priority = 20;
  }

  return priority;
}

function buildLabel(category: AffiliateCategory, context: AffiliateContext) {
  const destination = context.destinationCity ?? context.destinationCountry ?? "this trip";
  const origin = context.originCity ?? context.originIata ?? "your city";
  const country = context.destinationCountry ?? destination;

  if (category === "flights") {
    return context.originCity && destination
      ? `Compare flights from ${origin} to ${destination}`
      : `Check live flights to ${destination}`;
  }

  if (category === "hotels") return `See hotels in ${destination}`;
  if (category === "activities") return `Find activities in ${destination}`;
  if (category === "esim") return `Get an eSIM for ${country}`;
  if (category === "car_rental") return `Compare rental cars in ${destination}`;
  if (category === "trains_buses") return context.destinationCity ? `Find transport to ${destination}` : "Compare trains and buses";
  if (category === "travel_insurance") return "Compare travel insurance";
  return context.destinationCity ? `Check transfer prices in ${destination}` : "Book an airport transfer";
}

function buildDescription(category: AffiliateCategory) {
  if (category === "travel_insurance") {
    return "GoByBudget does not provide insurance advice. Compare coverage terms directly with the provider.";
  }

  if (category === "flights") return "Check live prices against the planning estimate.";
  if (category === "hotels") return "Compare current accommodation prices before booking.";
  if (category === "activities") return "Review tours and attractions for the trip.";
  if (category === "esim") return "Compare data options and roaming alternatives.";
  if (category === "car_rental") return "Use when a car fits the actual itinerary.";
  if (category === "trains_buses") return "Compare intercity ground transport options.";
  return "Plan airport-to-hotel logistics before arrival.";
}

function isInternationalTrip(context: AffiliateContext) {
  if (typeof context.internationalTrip === "boolean") {
    return context.internationalTrip;
  }

  if (!context.originCountry || !context.destinationCountry) {
    return true;
  }

  return context.originCountry.toLowerCase() !== context.destinationCountry.toLowerCase();
}
