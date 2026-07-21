import { describe, expect, it } from "vitest";

import {
  comparisonPages,
  getComparisonItems,
  getComparisonPage,
  getComparisonPath,
  getPublishedComparisonPages,
  getComparisonStaticParams,
  getComparisonTableRows,
  getComparisonVerdict,
} from "@/lib/programmatic/comparison-pages";
import { destinationBudgetSeoSlugs, durationSeoPages, getDurationSeoStaticParams } from "@/lib/programmatic/seo-pages";

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

  it("builds an editorial verdict and required comparison table rows", () => {
    const page = getComparisonPage("portugal-vs-spain");
    const items = page ? getComparisonItems(page) : [];

    expect(page).toBeDefined();
    expect(getComparisonVerdict(page!, items)).toContain("Choose Portugal");
    expect(getComparisonTableRows(items).map((row) => row.criterion)).toEqual([
      "Flights",
      "Accommodation",
      "Food",
      "Transport",
      "Activities",
      "Daily cost",
      "Total cost",
      "Best for",
      "Winner / Verdict",
    ]);
  });

  it("builds comparison table rows for collection pages without reducing the destination cards", () => {
    const page = getComparisonPage("best-europe-trips-from-toronto-under-3000");
    const items = page ? getComparisonItems(page) : [];

    expect(page?.kind).toBe("collection");
    expect(items.length).toBeGreaterThan(2);
    expect(getComparisonTableRows(items)).toHaveLength(9);
    expect(getComparisonVerdict(page!, items)).toContain("Choose the lowest-estimate Europe option");
  });

  it("expands destination budget and duration SEO coverage", () => {
    expect(destinationBudgetSeoSlugs).toContain("south-korea");
    expect(durationSeoPages).toContainEqual({ destinationSlug: "south-korea", durationDays: 10 });
    expect(durationSeoPages.length).toBe(destinationBudgetSeoSlugs.length * 3);
  });

  it("exposes requested long-tail SEO pages", () => {
    expect(getDurationSeoStaticParams()).toEqual(
      expect.arrayContaining([
        { destination: "tokyo", duration: "10-days" },
        { destination: "lisbon", duration: "7-days" },
      ])
    );
    expect(getComparisonStaticParams()).toContainEqual({
      comparison: "best-europe-trips-from-toronto-under-3000",
    });
  });

  it("only links published comparison pages from the compare hub", () => {
    const staticParamSlugs = new Set(getComparisonStaticParams().map((param) => param.comparison));
    const linkedComparisonSlugs = getPublishedComparisonPages().map((page) => page.slug);

    expect(linkedComparisonSlugs).toHaveLength(staticParamSlugs.size);
    expect(linkedComparisonSlugs.every((slug) => staticParamSlugs.has(slug))).toBe(true);
    expect(linkedComparisonSlugs).not.toEqual(
      expect.arrayContaining([
        "paris-vs-lisbon",
        "paris-vs-lisbon-from-montreal",
        "tokyo-vs-seoul-from-vancouver",
        "paris-vs-lisbon-for-7-days",
        "portugal-vs-spain-travel-budget",
        "japan-vs-south-korea-travel-cost",
        "mexico-vs-colombia-from-montreal",
        "best-warm-destinations-from-toronto-under-2500",
        "best-asia-trips-from-vancouver-under-3500",
      ])
    );
  });
});
