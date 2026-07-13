import { formatCurrency } from "@/lib/currency/exchange-rates";

export function formatMoney(amount: number, currency = "CAD") {
  return formatCurrency(amount, currency);
}
