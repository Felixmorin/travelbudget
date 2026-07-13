import { describe, expect, it } from "vitest";

import { getDepartureCityPage, getIndexableDepartureCityPages } from "@/lib/programmatic/departure-pages";

describe("departure city pages", () => {
  it("keeps pages with unavailable flight data out of the indexable set", () => {
    const london = getDepartureCityPage("london");

    expect(london?.isIndexable).toBe(false);
    expect(london?.noindexReasons).toContain("flight estimates unavailable");
    expect(getIndexableDepartureCityPages().some((page) => page.origin.slug === "london")).toBe(false);
  });

  it("builds indexable pilot pages only when recommendations have usable flight estimates", () => {
    const montreal = getDepartureCityPage("montreal");

    expect(montreal?.isIndexable).toBe(true);
    expect(montreal?.recommendations.length).toBeGreaterThanOrEqual(4);
    expect(montreal?.recommendations.every((item) => item.flightEstimate !== null)).toBe(true);
  });
});
