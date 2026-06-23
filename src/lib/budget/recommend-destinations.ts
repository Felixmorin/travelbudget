import type { Destination } from "@/lib/data/destinations";

export type BudgetFitStatus = "best-fit" | "stretch" | "over-budget";
export type SupportedCurrency = "CAD" | "USD" | "EUR";
export type TravelStyle = "budget" | "balanced" | "comfort";

export type CostBreakdown = {
  flights: number;
  hotel: number;
  food: number;
  transport: number;
  activities: number;
};

export type DestinationRecommendation = {
  destination: Destination;
  estimatedTotal: number;
  budgetRemaining: number;
  budgetFitStatus: BudgetFitStatus;
  matchScore: number;
  costBreakdown: CostBreakdown;
  reasons: string[];
};

export type RecommendDestinationsInput = {
  destinations: Destination[];
  budget: number;
  currency: SupportedCurrency;
  origin: string;
  days: number;
  month: string;
  travelers: number;
  style: TravelStyle;
};

const BASE_DAYS = 10;
const BASE_TRAVELERS = 2;
const BASE_NIGHTS = BASE_DAYS - 1;

const styleMultipliers: Record<TravelStyle, number> = {
  budget: 0.88,
  balanced: 1,
  comfort: 1.18,
};

const relatedStyles: Record<TravelStyle, string[]> = {
  budget: ["backpacking", "food", "adventure", "relaxed"],
  balanced: ["culture", "food", "cities", "coast", "relaxed", "adventure"],
  comfort: ["culture", "cities", "coast", "relaxed"],
};

const currencyRatesFromCad: Record<SupportedCurrency, number> = {
  CAD: 1,
  USD: 0.73,
  EUR: 0.67,
};

export function recommendDestinations({
  destinations,
  budget,
  currency,
  origin,
  days,
  month,
  travelers,
  style,
}: RecommendDestinationsInput): DestinationRecommendation[] {
  const normalizedBudget = Math.max(0, budget);
  const normalizedDays = clampInteger(days, 1, 60);
  const normalizedTravelers = clampInteger(travelers, 1, 12);

  return destinations
    .map((destination) => {
      const costBreakdown = buildCostBreakdown(destination, normalizedDays, normalizedTravelers, style, currency);
      const estimatedTotal = sumCostBreakdown(costBreakdown);
      const budgetRemaining = normalizedBudget - estimatedTotal;
      const budgetFitStatus = getBudgetFitStatus(estimatedTotal, normalizedBudget);
      const matchScore = getMatchScore({
        destination,
        estimatedTotal,
        budget: normalizedBudget,
        month,
        style,
        budgetFitStatus,
      });

      return {
        destination,
        estimatedTotal,
        budgetRemaining,
        budgetFitStatus,
        matchScore,
        costBreakdown,
        reasons: buildReasons({
          destination,
          budgetFitStatus,
          budgetRemaining,
          month,
          style,
          currency,
          origin,
        }),
      };
    })
    .sort((a, b) => b.matchScore - a.matchScore || a.estimatedTotal - b.estimatedTotal);
}

function buildCostBreakdown(
  destination: Destination,
  days: number,
  travelers: number,
  style: TravelStyle,
  currency: SupportedCurrency
): CostBreakdown {
  const nights = Math.max(1, days - 1);
  const rooms = Math.max(1, Math.ceil(travelers / 2));
  const styleMultiplier = styleMultipliers[style];
  const currencyRate = currencyRatesFromCad[currency];

  return {
    flights: roundCurrency((destination.flightCost / BASE_TRAVELERS) * travelers * currencyRate),
    hotel: roundCurrency((destination.hotelCost / BASE_NIGHTS) * nights * rooms * styleMultiplier * currencyRate),
    food: roundCurrency((destination.foodCost / BASE_DAYS / BASE_TRAVELERS) * days * travelers * styleMultiplier * currencyRate),
    transport: roundCurrency(
      (destination.transportCost / BASE_DAYS / BASE_TRAVELERS) * days * travelers * styleMultiplier * currencyRate
    ),
    activities: roundCurrency(
      (destination.activitiesCost / BASE_DAYS / BASE_TRAVELERS) * days * travelers * styleMultiplier * currencyRate
    ),
  };
}

function sumCostBreakdown(costBreakdown: CostBreakdown) {
  return Object.values(costBreakdown).reduce((total, cost) => total + cost, 0);
}

function getBudgetFitStatus(estimatedTotal: number, budget: number): BudgetFitStatus {
  if (budget <= 0 || estimatedTotal > budget * 1.1) {
    return "over-budget";
  }

  if (estimatedTotal > budget) {
    return "stretch";
  }

  return "best-fit";
}

function getMatchScore({
  destination,
  estimatedTotal,
  budget,
  month,
  style,
  budgetFitStatus,
}: {
  destination: Destination;
  estimatedTotal: number;
  budget: number;
  month: string;
  style: TravelStyle;
  budgetFitStatus: BudgetFitStatus;
}) {
  const budgetScore = getBudgetScore(estimatedTotal, budget);
  const seasonBonus = hasMonthMatch(destination, month) ? 8 : 0;
  const styleBonus = getStyleBonus(destination, style);
  const fitPenalty = budgetFitStatus === "over-budget" ? 16 : budgetFitStatus === "stretch" ? 4 : 0;
  const destinationQuality = destination.score * 0.35;

  return clampScore(Math.round(budgetScore + destinationQuality + seasonBonus + styleBonus - fitPenalty));
}

function getBudgetScore(estimatedTotal: number, budget: number) {
  if (budget <= 0) {
    return 0;
  }

  const ratio = estimatedTotal / budget;

  if (ratio <= 0.72) {
    return 38;
  }

  if (ratio <= 1) {
    return 52 - Math.abs(0.88 - ratio) * 45;
  }

  return Math.max(10, 36 - (ratio - 1) * 70);
}

function getStyleBonus(destination: Destination, style: TravelStyle) {
  const normalizedStyle = style;
  const destinationStyles = destination.travelStyles.map((travelStyle) => travelStyle.toLowerCase());

  if (destinationStyles.includes(normalizedStyle)) {
    return 8;
  }

  const related = relatedStyles[normalizedStyle] ?? [];
  return destinationStyles.some((travelStyle) => related.includes(travelStyle)) ? 5 : 0;
}

function buildReasons({
  destination,
  budgetFitStatus,
  budgetRemaining,
  month,
  style,
  currency,
  origin,
}: {
  destination: Destination;
  budgetFitStatus: BudgetFitStatus;
  budgetRemaining: number;
  month: string;
  style: TravelStyle;
  currency: SupportedCurrency;
  origin: string;
}) {
  const reasons: string[] = [];

  if (budgetFitStatus === "best-fit") {
    reasons.push(`Estimated total leaves ${formatCompactMoney(Math.abs(budgetRemaining), currency)} in your budget.`);
  } else if (budgetFitStatus === "stretch") {
    reasons.push(`Only ${formatCompactMoney(Math.abs(budgetRemaining), currency)} over budget, so it may work with deal timing.`);
  } else {
    reasons.push(`Currently over budget by ${formatCompactMoney(Math.abs(budgetRemaining), currency)}.`);
  }

  if (hasMonthMatch(destination, month)) {
    reasons.push(`${toTitleCase(month)} is one of the stronger months for ${destination.name}.`);
  }

  if (getStyleBonus(destination, style) > 0) {
    reasons.push(`Your ${style} style lines up with ${destination.travelStyles.slice(0, 2).join(" and ")} travel.`);
  }

  reasons.push(`Flight and local-cost estimates are scaled from the mock ${toTitleCase(origin.trim()) || "your city"} baseline.`);

  return reasons;
}

function hasMonthMatch(destination: Destination, month: string) {
  return destination.bestMonths.some((bestMonth) => bestMonth.toLowerCase() === month.toLowerCase());
}

function roundCurrency(amount: number) {
  return Math.round(amount);
}

function clampInteger(value: number, min: number, max: number) {
  if (!Number.isFinite(value)) {
    return min;
  }

  return Math.min(max, Math.max(min, Math.round(value)));
}

function clampScore(score: number) {
  return Math.max(0, Math.min(100, score));
}

function formatCompactMoney(amount: number, currency: SupportedCurrency) {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

function toTitleCase(value: string) {
  return value
    .split(/[\s-]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}
