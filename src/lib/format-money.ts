export function formatMoney(amount: number, currency = "CAD") {
  const locale = currency === "USD" ? "en-US" : "en-CA";

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(Math.round(amount));
}
