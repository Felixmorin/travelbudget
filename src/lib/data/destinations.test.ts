import { beforeEach, describe, expect, it, vi } from "vitest";

describe("destinations data", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.unstubAllEnvs();
  });

  it("exports unique destination slugs", async () => {
    const { destinations } = await import("@/lib/data/destinations");
    const slugs = destinations.map((destination) => destination.slug);

    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("uses the central GetYourGuide affiliate URL when configured", async () => {
    vi.stubEnv("NEXT_PUBLIC_GETYOURGUIDE_AFFILIATE_URL", "https://www.getyourguide.com/?partner_id=test-central");
    const { destinations } = await import("@/lib/data/destinations");
    const activityLinks = destinations
      .map((destination) => destination.affiliateLinks.find((link) => link.type === "Activities"))
      .filter((link): link is NonNullable<typeof link> => Boolean(link));

    expect(activityLinks.length).toBeGreaterThan(0);

    for (const link of activityLinks) {
      const url = new URL(link.href);

      expect(url.hostname).toContain("getyourguide.com");
      expect(url.pathname).toBe("/s/");
      expect(url.searchParams.get("q")).toBeTruthy();
      expect(url.searchParams.get("partner_id")).toBe("test-central");
    }
  });
});
