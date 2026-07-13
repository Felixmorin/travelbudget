import type { ProductAnalystData } from "@/lib/agents/product-analyst/types";

export const productAnalystDemoData: ProductAnalystData = {
  source: "demo",
  generatedAt: "2026-07-13T00:00:00.000Z",
  searches: {
    started: 120,
    completed: 74,
    withoutResults: 18,
  },
  selectedDestinations: {
    total: 45,
    top: [
      { destinationSlug: "japan", count: 14 },
      { destinationSlug: "portugal", count: 11 },
      { destinationSlug: "mexico", count: 8 },
    ],
  },
  affiliateClicks: {
    total: 19,
    byType: [
      { affiliateType: "Flights", count: 9 },
      { affiliateType: "Hotels", count: 6 },
      { affiliateType: "Activities", count: 4 },
    ],
  },
  savedTrips: {
    total: 7,
    byCurrency: [
      { currency: "CAD", count: 6 },
      { currency: "USD", count: 1 },
    ],
  },
  appErrors: {
    total: 5,
    top: [
      { message: "Supabase storage is unavailable.", count: 3 },
      { message: "Analytics event request failed.", count: 2 },
    ],
  },
  performance: {
    mobile: {
      samples: 18,
      averageLcpMs: 3620,
      averageInpMs: 214,
    },
    desktop: {
      samples: 21,
      averageLcpMs: 1860,
      averageInpMs: 84,
    },
  },
};
