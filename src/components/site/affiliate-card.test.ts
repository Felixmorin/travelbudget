import { isValidElement } from "react";
import { describe, expect, it } from "vitest";

import { AffiliateCard } from "@/components/site/affiliate-card";
import type { AffiliateLink } from "@/lib/data/destinations";

const baseLink: AffiliateLink = {
  type: "Hotels",
  title: "See hotels",
  description: "Compare hotels.",
  priceHint: "Partner prices",
  href: "https://www.booking.com/index.html?aid=booking-test",
  provider: "Booking.com",
  partner: "Booking.com",
  placement: "destination_sidebar",
  isExternal: true,
};

describe("AffiliateCard", () => {
  it("renders configured partner cards", () => {
    const element = AffiliateCard({
      link: baseLink,
      destination: { name: "Lisbon", slug: "lisbon" },
    });

    expect(isValidElement(element)).toBe(true);
  });

  it("does not render cards for placeholder partner links", () => {
    const element = AffiliateCard({
      link: {
        ...baseLink,
        href: "[[COLLE_ICI_TON_LIEN_BOOKING_COM]]",
      },
      destination: { name: "Lisbon", slug: "lisbon" },
    });

    expect(element).toBeNull();
  });

  it("does not render cards for empty partner links", () => {
    const element = AffiliateCard({
      link: {
        ...baseLink,
        href: "",
      },
      destination: { name: "Lisbon", slug: "lisbon" },
    });

    expect(element).toBeNull();
  });
});
