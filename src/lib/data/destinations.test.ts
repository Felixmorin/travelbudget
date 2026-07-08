import { describe, expect, it } from "vitest";

import { destinations } from "@/lib/data/destinations";

describe("destinations data", () => {
  it("exports unique destination slugs", () => {
    const slugs = destinations.map((destination) => destination.slug);

    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("includes the GetYourGuide partner ID on activity links", () => {
    const activityLinks = destinations
      .map((destination) => destination.affiliateLinks.find((link) => link.type === "Activities"))
      .filter((link): link is NonNullable<typeof link> => Boolean(link));

    expect(activityLinks.length).toBeGreaterThan(0);

    for (const link of activityLinks) {
      const url = new URL(link.href);

      expect(url.hostname).toContain("getyourguide.com");
      expect(url.searchParams.get("partner_id")).toBe("4ZWE6DU");
    }
  });
});
