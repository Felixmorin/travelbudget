import type { AffiliateContext } from "@/lib/affiliates/types";
import type { Destination } from "@/lib/data/destinations";
import { getDestinationIata } from "@/lib/affiliates/iata";

type DestinationRuleValue = boolean | "optional";

export type DestinationAffiliateRule = {
  carRental?: DestinationRuleValue;
  railRelevant?: boolean;
  airportTransfer?: boolean;
  esim?: boolean;
  transitFriendly?: boolean;
  region?: string;
  continent?: string;
  carReason?: string;
};

const countryMetaByCode: Record<string, Pick<DestinationAffiliateRule, "continent" | "region" | "railRelevant">> = {
  PT: { continent: "Europe", region: "Western Europe", railRelevant: true },
  FR: { continent: "Europe", region: "Western Europe", railRelevant: true },
  ES: { continent: "Europe", region: "Southern Europe", railRelevant: true },
  IT: { continent: "Europe", region: "Southern Europe", railRelevant: true },
  NL: { continent: "Europe", region: "Western Europe", railRelevant: true },
  IE: { continent: "Europe", region: "Western Europe", railRelevant: true },
  GR: { continent: "Europe", region: "Southern Europe", railRelevant: false },
  HU: { continent: "Europe", region: "Central Europe", railRelevant: true },
  CZ: { continent: "Europe", region: "Central Europe", railRelevant: true },
  TR: { continent: "Europe", region: "Europe/Asia", railRelevant: false },
  JP: { continent: "Asia", region: "East Asia", railRelevant: true },
  KR: { continent: "Asia", region: "East Asia", railRelevant: false },
  TH: { continent: "Asia", region: "Southeast Asia", railRelevant: false },
  VN: { continent: "Asia", region: "Southeast Asia", railRelevant: false },
  ID: { continent: "Asia", region: "Southeast Asia", railRelevant: false },
  MY: { continent: "Asia", region: "Southeast Asia", railRelevant: false },
  PH: { continent: "Asia", region: "Southeast Asia", railRelevant: false },
  KH: { continent: "Asia", region: "Southeast Asia", railRelevant: false },
  MX: { continent: "North America", region: "Mexico/Central America", railRelevant: false },
  US: { continent: "North America", region: "United States", railRelevant: false },
  CO: { continent: "South America", region: "Northern South America", railRelevant: false },
  PE: { continent: "South America", region: "Andes", railRelevant: false },
  GT: { continent: "North America", region: "Central America", railRelevant: false },
  MA: { continent: "Africa", region: "North Africa", railRelevant: false },
  AU: { continent: "Oceania", region: "Australia", railRelevant: false },
};

export const destinationAffiliateRules: Record<string, DestinationAffiliateRule> = {
  athens: { airportTransfer: true, carRental: "optional", railRelevant: false },
  bali: { airportTransfer: true, carRental: "optional", railRelevant: false },
  bangkok: { airportTransfer: true, carRental: false, railRelevant: false, transitFriendly: true },
  barcelona: { airportTransfer: true, carRental: false, railRelevant: true, transitFriendly: true },
  cancun: { airportTransfer: true, carRental: "optional", railRelevant: false },
  france: { airportTransfer: true, carRental: false, railRelevant: true, transitFriendly: true },
  ireland: { airportTransfer: true, carRental: true, railRelevant: false, carReason: "Road trip destination." },
  japan: { airportTransfer: true, carRental: false, railRelevant: true, transitFriendly: true },
  kyoto: { airportTransfer: true, carRental: false, railRelevant: true, transitFriendly: true },
  lisbon: { airportTransfer: true, carRental: "optional", railRelevant: true },
  mexico: { airportTransfer: true, carRental: "optional", railRelevant: false },
  "mexico-city": { airportTransfer: true, carRental: "optional", railRelevant: false },
  "new-york": { airportTransfer: true, carRental: false, railRelevant: false, transitFriendly: true },
  osaka: { airportTransfer: true, carRental: false, railRelevant: true, transitFriendly: true },
  paris: { airportTransfer: true, carRental: false, railRelevant: true, transitFriendly: true },
  porto: { airportTransfer: true, carRental: "optional", railRelevant: true },
  portugal: { airportTransfer: true, carRental: "optional", railRelevant: true },
  rome: { airportTransfer: true, carRental: false, railRelevant: true, transitFriendly: true },
  seoul: { airportTransfer: true, carRental: false, railRelevant: false, transitFriendly: true },
  singapore: { airportTransfer: true, carRental: false, railRelevant: false, transitFriendly: true },
  tokyo: { airportTransfer: true, carRental: false, railRelevant: true, transitFriendly: true },
};

const transitFriendlyNames = new Set(["tokyo", "paris", "london", "new york", "new york city", "singapore", "seoul"]);
const islandOrRoadTripStyles = new Set(["road trip", "nature", "beach"]);

export function getDestinationAffiliateRule(context: AffiliateContext): DestinationAffiliateRule {
  const slug = normalizeKey(context.destinationSlug ?? context.destinationCity ?? "");
  const destinationRule = slug ? destinationAffiliateRules[slug] : undefined;
  const countryMeta = context.destinationCountryCode ? countryMetaByCode[context.destinationCountryCode.toUpperCase()] : undefined;

  return {
    continent: context.continent ?? countryMeta?.continent,
    region: context.region ?? countryMeta?.region,
    railRelevant: context.railRelevant ?? destinationRule?.railRelevant ?? countryMeta?.railRelevant,
    carRental: context.carRecommended ? true : destinationRule?.carRental,
    airportTransfer: destinationRule?.airportTransfer,
    esim: destinationRule?.esim,
    transitFriendly: destinationRule?.transitFriendly ?? isTransitFriendly(context),
    carReason: destinationRule?.carReason,
  };
}

export function buildAffiliateContextFromDestination(
  destination: Pick<
    Destination,
    | "slug"
    | "name"
    | "cityName"
    | "countryName"
    | "countryCode"
    | "destinationKind"
    | "travelStyles"
    | "bestMonths"
  >,
  overrides: Partial<AffiliateContext> = {}
): AffiliateContext {
  const city = destination.cityName ?? (destination.destinationKind === "city" ? destination.name : undefined);
  const country = destination.countryName ?? (destination.destinationKind === "country" ? destination.name : undefined);
  const base: AffiliateContext = {
    originCity: "Montreal",
    originCountry: "Canada",
    originIata: "YUL",
    destinationSlug: destination.slug,
    destinationCity: city ?? destination.name,
    destinationCountry: country ?? destination.name,
    destinationCountryCode: destination.countryCode,
    destinationIata: getDestinationIata(destination),
    durationDays: 10,
    travelers: 1,
    tripStyle: destination.travelStyles[0],
    hasActivities: true,
    hasOvernightStay: true,
    internationalTrip: destination.countryCode !== "CA",
  };
  const rule = getDestinationAffiliateRule(base);

  return {
    ...base,
    continent: rule.continent,
    region: rule.region,
    railRelevant: rule.railRelevant,
    carRecommended: rule.carRental === true,
    ...overrides,
  };
}

export function shouldTreatAsRoadTrip(context: AffiliateContext) {
  const style = context.tripStyle?.toLowerCase();
  const transport = context.transportType?.toLowerCase();

  return (
    context.carRecommended === true ||
    transport === "car" ||
    style === "road trip" ||
    Boolean(style && islandOrRoadTripStyles.has(style) && context.region?.toLowerCase().includes("island"))
  );
}

export function normalizeKey(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function isTransitFriendly(context: AffiliateContext) {
  const city = context.destinationCity?.toLowerCase();

  return Boolean(city && transitFriendlyNames.has(city));
}
