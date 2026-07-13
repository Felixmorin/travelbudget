import { convertBudgetToCad } from "@/lib/compare/currency";
import { calculateTripCost } from "@/lib/compare/calculate-trip-cost";
import type {
  BudgetFit,
  CompareDestination,
  CompareParams,
  CostBreakdown,
  CostDifference,
  DestinationTripCost,
  TripComparison,
} from "@/lib/compare/types";

const rowLabels: Record<CostDifference["key"], string> = {
  flights: "Round-trip flights",
  accommodation: "Accommodation",
  food: "Food",
  localTransportation: "Local transportation",
  activities: "Activities",
  extras: "Travel extras or buffer",
  total: "Total trip cost",
  costPerDay: "Cost per day",
  costPerTraveler: "Cost per traveler",
};

export function compareDestinations({
  destinationA,
  destinationB,
  params,
}: {
  destinationA: CompareDestination | undefined;
  destinationB: CompareDestination | undefined;
  params: CompareParams;
}): TripComparison | null {
  if (!destinationA || !destinationB) {
    return null;
  }

  const a = calculateTripCost(destinationA, params);
  const b = calculateTripCost(destinationB, params);
  const rows = createRows(a, b);
  const totalRow = rows.find((row) => row.key === "total");
  const cheaper = totalRow?.winner ?? "unavailable";
  const savings = totalRow?.difference === null ? null : Math.abs(totalRow?.difference ?? 0);
  const expensiveTotal = cheaper === "a" ? b.total : cheaper === "b" ? a.total : null;
  const cheapTotal = cheaper === "a" ? a.total : cheaper === "b" ? b.total : null;
  const localRows = rows.filter((row) =>
    ["flights", "accommodation", "food", "localTransportation", "activities", "extras"].includes(row.key)
  );

  return {
    params,
    destinationA: a,
    destinationB: b,
    cheaper,
    savings,
    lessPercent: cheapTotal !== null && expensiveTotal ? calculateLessPercent(cheapTotal, expensiveTotal) : null,
    morePercent: cheapTotal && expensiveTotal !== null ? calculateMorePercent(expensiveTotal, cheapTotal) : null,
    dailyDifference: a.costPerDay === null || b.costPerDay === null ? null : Math.abs(a.costPerDay - b.costPerDay),
    biggestFactor: findBiggestFactor(localRows),
    rows,
    budgetFitA: params.budget ? calculateBudgetFit(a.total, params.budget, params.currency) : undefined,
    budgetFitB: params.budget ? calculateBudgetFit(b.total, params.budget, params.currency) : undefined,
    warnings: createWarnings(destinationA, destinationB, params),
  };
}

export function createLengthComparisons({
  destinationA,
  destinationB,
  params,
  lengths = [3, 7, 10, 14],
}: {
  destinationA: CompareDestination;
  destinationB: CompareDestination;
  params: CompareParams;
  lengths?: number[];
}) {
  return lengths.map((days) => {
    const comparison = compareDestinations({
      destinationA,
      destinationB,
      params: { ...params, days },
    });

    return {
      days,
      comparison,
    };
  });
}

export function calculateLessPercent(lower: number, higher: number) {
  return higher > 0 ? Math.round(((higher - lower) / higher) * 100) : 0;
}

export function calculateMorePercent(higher: number, lower: number) {
  return lower > 0 ? Math.round(((higher - lower) / lower) * 100) : 0;
}

function createRows(a: DestinationTripCost, b: DestinationTripCost): CostDifference[] {
  const keys: CostDifference["key"][] = [
    "flights",
    "accommodation",
    "food",
    "localTransportation",
    "activities",
    "extras",
    "total",
    "costPerDay",
    "costPerTraveler",
  ];

  return keys.map((key) => {
    const aValue = getValue(a, key);
    const bValue = getValue(b, key);
    const difference = aValue === null || bValue === null ? null : aValue - bValue;

    return {
      key,
      label: rowLabels[key],
      a: aValue,
      b: bValue,
      difference,
      winner: getWinner(aValue, bValue),
    };
  });
}

function getValue(cost: DestinationTripCost, key: CostDifference["key"]) {
  if (key === "total") {
    return cost.total;
  }

  if (key === "costPerDay") {
    return cost.costPerDay;
  }

  if (key === "costPerTraveler") {
    return cost.costPerTraveler;
  }

  return cost.breakdown[key as keyof CostBreakdown];
}

function getWinner(a: number | null, b: number | null): CostDifference["winner"] {
  if (a === null || b === null) {
    return "unavailable";
  }

  if (a === b) {
    return "tie";
  }

  return a < b ? "a" : "b";
}

function findBiggestFactor(rows: CostDifference[]) {
  return [...rows]
    .filter((row) => row.difference !== null)
    .sort((a, b) => Math.abs(b.difference ?? 0) - Math.abs(a.difference ?? 0))[0] ?? null;
}

function calculateBudgetFit(totalCad: number | null, budget: number, currency: CompareParams["currency"]): BudgetFit {
  if (totalCad === null) {
    return {
      status: "Over budget",
      remaining: 0,
      overBy: 0,
    };
  }

  const budgetCad = convertBudgetToCad(budget, currency);
  const remaining = budgetCad - totalCad;
  const ratio = totalCad / budgetCad;

  return {
    status: ratio <= 0.85 ? "Excellent fit" : ratio <= 0.95 ? "Good fit" : ratio <= 1 ? "Tight fit" : "Over budget",
    remaining: Math.max(0, remaining),
    overBy: Math.max(0, -remaining),
  };
}

function createWarnings(destinationA: CompareDestination, destinationB: CompareDestination, params: CompareParams) {
  const warnings: string[] = [];

  if (destinationA.slug === destinationB.slug) {
    warnings.push("Choose two different destinations to compare trip costs.");
  }

  if (destinationA.destinationKind && destinationB.destinationKind && destinationA.destinationKind !== destinationB.destinationKind) {
    warnings.push("This compares different destination types. City-to-city comparisons are usually more precise.");
  }

  if (params.style === "comfort") {
    warnings.push("Comfort uses the existing mid-range cost model because the current dataset does not separate a dedicated comfort tier.");
  }

  return warnings;
}
