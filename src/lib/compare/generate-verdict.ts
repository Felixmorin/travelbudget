import { getCityCountryLabel } from "@/lib/data/unified-destinations";
import type { CostDifference, TripComparison } from "@/lib/compare/types";

export function generateQuickAnswer(comparison: TripComparison) {
  const a = getCityCountryLabel(comparison.destinationA.destination);
  const b = getCityCountryLabel(comparison.destinationB.destination);

  if (comparison.cheaper === "tie") {
    return `${a} and ${b} are nearly tied for this trip setup. The final choice should come down to flight timing, preferred travel style, and season.`;
  }

  if (comparison.cheaper === "unavailable" || comparison.savings === null) {
    return `One or both flight estimates are unavailable, so the total trip comparison is incomplete. Local daily costs can still help compare the on-the-ground budget.`;
  }

  const cheaper = comparison.cheaper === "a" ? a : b;
  const expensive = comparison.cheaper === "a" ? b : a;
  const factor = comparison.biggestFactor?.label.toLowerCase() ?? "daily costs";

  return `${cheaper} is estimated to cost less than ${expensive} for this setup, mainly because of lower ${factor}.`;
}

export function generateCostExplanation(comparison: TripComparison) {
  const moreExpensive = getMoreExpensiveLabel(comparison);
  const other = comparison.cheaper === "a"
    ? getCityCountryLabel(comparison.destinationA.destination)
    : getCityCountryLabel(comparison.destinationB.destination);
  const factors = comparison.rows
    .filter((row) => ["flights", "accommodation", "food", "localTransportation", "activities", "extras"].includes(row.key))
    .filter((row): row is CostDifference & { difference: number } => row.difference !== null)
    .sort((a, b) => Math.abs(b.difference) - Math.abs(a.difference));

  if (!moreExpensive || factors.length === 0) {
    return "The available estimates are too close or incomplete to isolate a single cost driver.";
  }

  const first = factors[0];
  const second = factors[1];
  const similar = factors.find((row) => Math.abs(row.difference) <= Math.max(25, Math.abs(first.difference) * 0.18));

  return `${first.label} accounts for most of the difference between ${moreExpensive} and ${other}.${
    second ? ` ${second.label} creates the second-largest gap.` : ""
  }${similar ? ` ${similar.label} is relatively similar.` : ""}`;
}

export function createProfileVerdicts(comparison: TripComparison) {
  const a = comparison.destinationA.destination;
  const b = comparison.destinationB.destination;
  const cheaper = comparison.cheaper === "a" ? a : comparison.cheaper === "b" ? b : null;
  const rows = [
    cheaper
      ? {
          profile: "Lowest total budget",
          destination: getCityCountryLabel(cheaper),
          reason: "It has the lower total estimate for the selected origin, length, travelers, and style.",
        }
      : null,
    pickByStyle(comparison, "Food", "Food and nightlife"),
    pickByStyle(comparison, "Culture", "Museums and culture"),
    pickByStyle(comparison, "Beach", "Warm weather"),
    pickByStyle(comparison, "Cities", "Short city breaks"),
    pickByStyle(comparison, "Relaxed", "Couples"),
    pickLowerDaily(comparison, "Longer stays"),
    pickByStyle(comparison, "Adventure", "Solo travelers"),
  ];

  return rows.filter((row): row is NonNullable<typeof row> => Boolean(row));
}

function getMoreExpensiveLabel(comparison: TripComparison) {
  if (comparison.cheaper === "a") {
    return getCityCountryLabel(comparison.destinationB.destination);
  }

  if (comparison.cheaper === "b") {
    return getCityCountryLabel(comparison.destinationA.destination);
  }

  return null;
}

function pickByStyle(comparison: TripComparison, style: string, profile: string) {
  const a = comparison.destinationA.destination;
  const b = comparison.destinationB.destination;
  const aMatches = a.travelStyles.includes(style);
  const bMatches = b.travelStyles.includes(style);

  if (aMatches === bMatches) {
    return null;
  }

  const destination = aMatches ? a : b;

  return {
    profile,
    destination: getCityCountryLabel(destination),
    reason: `${style} is listed in the destination data for this trip type.`,
  };
}

function pickLowerDaily(comparison: TripComparison, profile: string) {
  const a = comparison.destinationA;
  const b = comparison.destinationB;

  if (a.dailyLocalCost === b.dailyLocalCost) {
    return null;
  }

  const destination = a.dailyLocalCost < b.dailyLocalCost ? a.destination : b.destination;

  return {
    profile,
    destination: getCityCountryLabel(destination),
    reason: "Lower daily local costs matter more as the trip gets longer.",
  };
}
