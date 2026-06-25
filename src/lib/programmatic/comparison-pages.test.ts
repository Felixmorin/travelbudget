import { describe, expect, it } from "vitest";

import {
  comparisonPages,
  getComparisonItems,
  getComparisonPage,
  getComparisonPath,
} from "@/lib/programmatic/comparison-pages";
import { destinationBudgetSeoSlugs, durationSeoPages } from "@/lib/programmatic/seo-pages";

describe("comparison SEO pages", () => {
  it("defines the priority comparison slugs", () => {
    expect(comparisonPages.map((page) => page.slug)).toEqual(
      expect.arrayContaining([
        "portugal-vs-spain-travel-budget",
        "japan-vs-south-korea-travel-cost",
        "mexico-vs-colombia-from-montreal",
        "best-warm-destinations-from-toronto-under-2500",
      ])
    );
  });

  it("builds comparison items with estimates", () => {
    const page = getComparisonPage("portugal-vs-spain-travel-budget");

    expect(page).toBeDefined();

    const items = page ? getComparisonItems(page) : [];

    expect(items).toHaveLength(2);
    expect(items[0].totalEstimate).toBeGreaterThan(0);
    expect(getComparisonPath("portugal-vs-spain-travel-budget")).toBe(
      "/compare/portugal-vs-spain-travel-budget"
    );
  });

  it("expands destination budget and duration SEO coverage", () => {
    expect(destinationBudgetSeoSlugs).toContain("south-korea");
    expect(durationSeoPages).toContainEqual({ destinationSlug: "south-korea", durationDays: 10 });
    expect(durationSeoPages.length).toBe(destinationBudgetSeoSlugs.length * 3);
  });
});
