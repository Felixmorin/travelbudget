import { describe, expect, it } from "vitest";

import sitemap from "@/app/sitemap";
import {
  getAllSeoRegistryPages,
  getBudgetAmountPath,
  getIndexableSeoPages,
  getTripLengthPath,
  evaluateCollectionIndexability,
  pilotBudgetAmounts,
  pilotComparisonSlugs,
  pilotDestinationSlugs,
  pilotDurationDays,
  pilotOriginSlugs,
} from "@/lib/programmatic/seo-registry";

describe("programmatic SEO registry", () => {
  it("keeps the pilot scoped before scaling", () => {
    const pages = getAllSeoRegistryPages();

    expect(pilotDestinationSlugs).toHaveLength(10);
    expect(pilotBudgetAmounts).toEqual([1000, 2000, 3000, 5000]);
    expect(pilotOriginSlugs).toEqual(["montreal", "toronto", "vancouver"]);
    expect(pilotComparisonSlugs).toHaveLength(5);
    expect(pilotDurationDays).toEqual([7, 10, 14]);
    expect(pages.length).toBeLessThanOrEqual(40);
  });

  it("marks useful pages indexable and weak collections noindex", () => {
    const pages = getAllSeoRegistryPages();
    const indexablePages = getIndexableSeoPages();
    const budget3000 = pages.find((page) => page.path === getBudgetAmountPath(3000));
    const weakCollection = evaluateCollectionIndexability({
      itemCount: 1,
      hasCostBreakdown: false,
      introLength: 20,
      internalLinks: ["/travel-budget-calculator"],
      distinctIntent: true,
    });

    expect(indexablePages.length).toBeGreaterThan(0);
    expect(budget3000?.evaluation.status).toBe("index");
    expect(weakCollection.status).toBe("noindex");
    expect(weakCollection.reasons.length).toBeGreaterThan(0);
  });

  it("does not create duplicate titles or conflicting canonicals for indexable pages", () => {
    const indexablePages = getIndexableSeoPages();
    const titles = indexablePages.map((page) => page.title.toLowerCase());
    const canonicals = indexablePages.map((page) => page.canonicalPath);

    expect(new Set(titles).size).toBe(titles.length);
    expect(new Set(canonicals).size).toBe(canonicals.length);
    expect(indexablePages.every((page) => page.path === page.canonicalPath)).toBe(true);
  });

  it("requires internal links on indexable pages", () => {
    expect(getIndexableSeoPages().every((page) => page.internalLinks.length >= 3)).toBe(true);
  });

  it("keeps all pilot comparisons eligible for indexing", () => {
    const pages = getAllSeoRegistryPages().filter((page) => page.type === "comparison");

    expect(pages).toHaveLength(5);
    expect(pages.every((page) => page.evaluation.status === "index")).toBe(true);
  });

  it("includes indexable programmatic pages in the sitemap and excludes noindex pages", () => {
    const sitemapUrls = sitemap().map((entry) => entry.url);
    const noindexPages = getAllSeoRegistryPages().filter((page) => page.evaluation.status === "noindex");

    expect(sitemapUrls).toContain("https://gobybudget.com/budget/3000");
    expect(sitemapUrls).toContain(`https://gobybudget.com${getTripLengthPath(10)}`);
    expect(getIndexableSeoPages().every((page) => sitemapUrls.includes(`https://gobybudget.com${page.path}`))).toBe(
      true
    );
    expect(noindexPages.every((page) => !sitemapUrls.includes(`https://gobybudget.com${page.path}`))).toBe(true);
  });

  it("only indexes programmatic pages with distinct intent and useful estimate data", () => {
    const indexablePages = getIndexableSeoPages();

    expect(indexablePages.every((page) => page.evaluation.status === "index")).toBe(true);
    expect(indexablePages.every((page) => page.evaluation.reasons.length === 0)).toBe(true);
    expect(indexablePages.every((page) => page.evaluation.score >= 5)).toBe(true);
  });
});
