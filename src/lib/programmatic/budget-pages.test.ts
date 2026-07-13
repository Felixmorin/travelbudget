import { describe, expect, it } from "vitest";

import {
  activeProgrammaticOrigins,
  getMatchingBudgetDestinations,
  getProgrammaticBudgetPage,
  getProgrammaticOrigin,
  programmaticBudgetPages,
  programmaticOrigins,
} from "@/lib/programmatic/budget-pages";

describe("programmatic budget origins", () => {
  it("keeps Canadian origins available but limits generated pages to the pilot cities", () => {
    expect(activeProgrammaticOrigins.map((origin) => origin.slug)).toEqual(
      expect.arrayContaining(["quebec", "ottawa", "calgary"])
    );
    expect(programmaticBudgetPages.some((page) => page.origin.slug === "montreal")).toBe(true);
    expect(programmaticBudgetPages.some((page) => page.origin.slug === "toronto")).toBe(true);
    expect(programmaticBudgetPages.some((page) => page.origin.slug === "vancouver")).toBe(true);
    expect(programmaticBudgetPages.some((page) => page.origin.slug === "quebec")).toBe(false);
    expect(programmaticBudgetPages.some((page) => page.origin.slug === "ottawa")).toBe(false);
    expect(programmaticBudgetPages.some((page) => page.origin.slug === "calgary")).toBe(false);
  });

  it("keeps the next origin wave planned without generating pages yet", () => {
    expect(programmaticOrigins.filter((origin) => origin.status === "planned").map((origin) => origin.slug)).toEqual([
      "new-york",
      "boston",
      "chicago",
    ]);
    expect(programmaticBudgetPages.some((page) => page.origin.slug === "new-york")).toBe(false);
  });

  it("handles the Quebec slug and display accent correctly", () => {
    expect(getProgrammaticOrigin("quebec")).toMatchObject({
      slug: "quebec",
      city: "Québec",
      code: "YQB",
    });
  });

  it("uses pilot origin flight pricing for matching destinations", () => {
    const page = getProgrammaticBudgetPage("toronto", "trips-under-3000");

    expect(page).not.toBeNull();
    expect(page?.origin.city).toBe("Toronto");

    const matches = page ? getMatchingBudgetDestinations(page) : [];

    expect(matches.length).toBeGreaterThan(0);
    expect(matches[0].flightEstimate).toBeGreaterThan(0);
  });
});
