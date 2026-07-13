import { describe, expect, it } from "vitest";

import {
  convertCurrency,
  convertFromBaseCurrency,
  convertToBaseCurrency,
  formatCurrency,
  planningExchangeRates,
} from "@/lib/currency/exchange-rates";

describe("planning exchange rates", () => {
  it("keeps one versioned source of truth for supported currencies", () => {
    expect(planningExchangeRates).toMatchObject({
      version: "2026-06-24.manual",
      baseCurrency: "CAD",
      lastUpdated: "2026-06-24",
      source: "manual-planning-rate",
    });
    expect(Object.keys(planningExchangeRates.ratesFromBase).sort()).toEqual(["CAD", "EUR", "GBP", "USD"]);
  });

  it("converts from and to the CAD base currency", () => {
    expect(convertFromBaseCurrency(100, "USD")).toBe(73);
    expect(convertFromBaseCurrency(100, "GBP")).toBe(58);
    expect(convertToBaseCurrency(73, "USD")).toBe(100);
  });

  it("converts between non-base currencies through CAD", () => {
    expect(convertCurrency(73, "USD", "GBP")).toBe(58);
  });

  it("formats supported currencies without fractional digits", () => {
    expect(formatCurrency(1234.4, "CAD")).toBe("$1,234");
    expect(formatCurrency(1234.4, "USD")).toBe("$1,234");
    expect(formatCurrency(1234.4, "EUR")).toContain("1,234");
    expect(formatCurrency(1234.4, "GBP")).toContain("1,234");
  });
});
