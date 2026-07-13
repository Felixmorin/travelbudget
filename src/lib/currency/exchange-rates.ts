export const supportedCurrencies = ["CAD", "USD", "EUR", "GBP"] as const;
export type SupportedCurrency = (typeof supportedCurrencies)[number];

export type ExchangeRateTable = {
  version: string;
  baseCurrency: SupportedCurrency;
  lastUpdated: string;
  source: "manual-planning-rate" | "live-provider";
  providerName: string;
  notes: string;
  ratesFromBase: Record<SupportedCurrency, number>;
};

export const planningExchangeRates: ExchangeRateTable = {
  version: "2026-06-24.manual",
  baseCurrency: "CAD",
  lastUpdated: "2026-06-24",
  source: "manual-planning-rate",
  providerName: "GoByBudget manual planning table",
  notes:
    "Static planning conversion rates for display only. Replace this table behind the same API when a live FX provider is added.",
  ratesFromBase: {
    CAD: 1,
    USD: 0.73,
    EUR: 0.67,
    GBP: 0.58,
  },
};

export function isSupportedCurrency(value: string): value is SupportedCurrency {
  return supportedCurrencies.includes(value as SupportedCurrency);
}

export function convertFromBaseCurrency(
  amount: number,
  targetCurrency: SupportedCurrency,
  rateTable: ExchangeRateTable = planningExchangeRates
) {
  return roundMoney(amount * rateTable.ratesFromBase[targetCurrency]);
}

export function convertToBaseCurrency(
  amount: number,
  sourceCurrency: SupportedCurrency,
  rateTable: ExchangeRateTable = planningExchangeRates
) {
  return roundMoney(amount / rateTable.ratesFromBase[sourceCurrency]);
}

export function convertCurrency(
  amount: number,
  sourceCurrency: SupportedCurrency,
  targetCurrency: SupportedCurrency,
  rateTable: ExchangeRateTable = planningExchangeRates
) {
  if (sourceCurrency === targetCurrency) {
    return roundMoney(amount);
  }

  const baseAmount =
    sourceCurrency === rateTable.baseCurrency
      ? amount
      : amount / rateTable.ratesFromBase[sourceCurrency];

  return convertFromBaseCurrency(baseAmount, targetCurrency, rateTable);
}

export function formatCurrency(amount: number, currency: SupportedCurrency | string = "CAD") {
  const supportedCurrency = isSupportedCurrency(currency) ? currency : "CAD";
  const locale = supportedCurrency === "USD" ? "en-US" : supportedCurrency === "GBP" ? "en-GB" : "en-CA";

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: supportedCurrency,
    maximumFractionDigits: 0,
  }).format(roundMoney(amount));
}

function roundMoney(value: number) {
  return Number.isFinite(value) ? Math.round(value) : 0;
}
