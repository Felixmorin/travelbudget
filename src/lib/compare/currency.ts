import { formatMoney } from "@/lib/format-money";
import type { SupportedCurrency } from "@/lib/compare/types";
import { convertFromBaseCurrency, convertToBaseCurrency } from "@/lib/currency/exchange-rates";

export function convertFromCad(amount: number, currency: SupportedCurrency) {
  return convertFromBaseCurrency(amount, currency);
}

export function formatCompareMoney(amount: number | null, currency: SupportedCurrency) {
  if (amount === null) {
    return "Flight estimate unavailable";
  }

  return formatMoney(convertFromCad(amount, currency), currency);
}

export function convertBudgetToCad(amount: number, currency: SupportedCurrency) {
  return convertToBaseCurrency(amount, currency);
}
