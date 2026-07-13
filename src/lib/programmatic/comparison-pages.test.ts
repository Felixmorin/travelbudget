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
        "portugal-vs-spain",
        "japan-vs-south-korea",
        "mexico-vs-colombia",
        "france-vs-italy",
        "thailand-vs-vietnam",
      ])
    );
  });

  it("builds comparison items with estimates", () => {
    const page = getComparisonPage("portugal-vs-spain");

    expect(page).toBeDefined();

    const items = page ? getComparisonItems(page) : [];

    expect(items).toHaveLength(2);
    expect(items[0].totalEstimate).toBeGreaterThan(0);
    expect(getComparisonPath("portugal-vs-spain")).toBe("/compare/portugal-vs-spain");
  });

  it("expands destination budget and duration SEO coverage", () => {
    expect(destinationBudgetSeoSlugs).toContain("south-korea");
    expect(durationSeoPages).toContainEqual({ destinationSlug: "south-korea", durationDays: 10 });
    expect(durationSeoPages.length).toBe(destinationBudgetSeoSlugs.length * 3);
  });
});
