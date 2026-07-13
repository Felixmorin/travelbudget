import { formatMoney } from "@/lib/format-money";
import type { SupportedCurrency } from "@/lib/compare/types";

const cadRates: Record<SupportedCurrency, number> = {
  CAD: 1,
  USD: 0.73,
  EUR: 0.67,
  GBP: 0.58,
};

export function convertFromCad(amount: number, currency: SupportedCurrency) {
  return Math.round(amount * cadRates[currency]);
}

export function formatCompareMoney(amount: number | null, currency: SupportedCurrency) {
  if (amount === null) {
    return "Flight estimate unavailable";
  }

  return formatMoney(convertFromCad(amount, currency), currency);
}

export function convertBudgetToCad(amount: number, currency: SupportedCurrency) {
  return Math.round(amount / cadRates[currency]);
}
