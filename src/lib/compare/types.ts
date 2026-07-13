import type { Destination, TravelStyle } from "@/lib/data/destinations";

export const supportedCurrencies = ["CAD", "USD", "EUR", "GBP"] as const;
export type SupportedCurrency = (typeof supportedCurrencies)[number];

export const compareStyleOptions = ["budget", "mid-range", "comfort", "luxury"] as const;
export type CompareTravelStyle = (typeof compareStyleOptions)[number];

export const compareMonthOptions = [
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
] as const;
export type CompareMonth = (typeof compareMonthOptions)[number];

export type CompareParams = {
  destinationA: string;
  destinationB: string;
  origin: string;
  days: number;
  travelers: number;
  month: CompareMonth;
  style: CompareTravelStyle;
  currency: SupportedCurrency;
  budget?: number;
};

export type CompareDestination = Destination;

export type CostBreakdown = {
  flights: number | null;
  accommodation: number;
  food: number;
  localTransportation: number;
  activities: number;
  extras: number;
};

export type DestinationTripCost = {
  destination: CompareDestination;
  breakdown: CostBreakdown;
  total: number | null;
  dailyLocalCost: number;
  costPerDay: number | null;
  costPerTraveler: number | null;
  flightUnavailable: boolean;
};

export type CostDifference = {
  key: keyof CostBreakdown | "total" | "costPerDay" | "costPerTraveler";
  label: string;
  a: number | null;
  b: number | null;
  difference: number | null;
  winner: "a" | "b" | "tie" | "unavailable";
};

export type BudgetFit = {
  status: "Excellent fit" | "Good fit" | "Tight fit" | "Over budget";
  remaining: number;
  overBy: number;
};

export type TripComparison = {
  params: CompareParams;
  destinationA: DestinationTripCost;
  destinationB: DestinationTripCost;
  cheaper: "a" | "b" | "tie" | "unavailable";
  savings: number | null;
  lessPercent: number | null;
  morePercent: number | null;
  dailyDifference: number | null;
  biggestFactor: CostDifference | null;
  rows: CostDifference[];
  budgetFitA?: BudgetFit;
  budgetFitB?: BudgetFit;
  warnings: string[];
};

export function toDestinationTravelStyle(style: CompareTravelStyle): TravelStyle {
  if (style === "mid-range" || style === "comfort") {
    return "midRange";
  }

  return style;
}
