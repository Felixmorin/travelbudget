import { describe, expect, it, vi, beforeEach } from "vitest";

import { isAllowedAffiliateUrl } from "@/lib/affiliate/allowed-domains";
import { buildAffiliateLink } from "@/lib/affiliate/build-affiliate-link";
import type { AffiliateLink } from "@/lib/data/destinations";

const baseLink: AffiliateLink = {
  type: "Flights",
  title: "Flights",
  description: "Compare flights",
  priceHint: "Provider fares",
  href: "https://www.skyscanner.ca/transport/flights/",
  isExternal: true,
};

describe("affiliate domain whitelist", () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
  });

  it("allows known affiliate domains over HTTPS", () => {
    expect(isAllowedAffiliateUrl("https://www.booking.com/searchresults.html")).toBe(true);
    expect(isAllowedAffiliateUrl("https://www.airalo.com/search?q=portugal")).toBe(true);
  });

  it("blocks non-whitelisted, protocol-relative, and non-HTTPS destinations", () => {
    expect(isAllowedAffiliateUrl("https://evil.example/phish")).toBe(false);
    expect(isAllowedAffiliateUrl("http://www.booking.com/searchresults.html")).toBe(false);
    expect(isAllowedAffiliateUrl("//www.booking.com/searchresults.html")).toBe(false);
  });

  it("falls back instead of creating a tracked external URL for blocked domains", () => {
    const builtLink = buildAffiliateLink({
      link: {
        ...baseLink,
        href: "https://evil.example/phish",
      },
    });

    expect(builtLink.href).toContain("/go/general/flights?");
    expect(decodeTrackedHref(builtLink.href)).toBe("https://www.skyscanner.ca/transport/flights/");
  });

  it("supports additional configured partner domains", () => {
    vi.stubEnv("AFFILIATE_ALLOWED_DOMAINS", "partner.example");

    expect(isAllowedAffiliateUrl("https://book.partner.example/path")).toBe(true);
  });
});

function decodeTrackedHref(href: string) {
  const url = new URL(href, "https://gobybudget.com");
  const encodedUrl = url.searchParams.get("url");

  return encodedUrl ? Buffer.from(encodedUrl, "base64url").toString("utf8") : null;
}
