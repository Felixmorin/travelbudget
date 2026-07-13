import { isValidElement, type ReactElement } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { FlightAffiliateLink } from "@/components/affiliate/FlightAffiliateLink";

vi.mock("next/navigation", () => ({
  usePathname: () => "/compare",
}));

describe("FlightAffiliateLink", () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
    vi.stubEnv("NEXT_PUBLIC_TRAVELPAYOUTS_MARKER", "12345");
  });

  it("configures href, external attributes, accessible label, and analytics", () => {
    const element = FlightAffiliateLink({
      originIata: "yul",
      destinationIata: "lis",
      departureDate: "2026-09-10",
      returnDate: "2026-09-20",
      adults: 2,
      cabinClass: "business",
      placement: "comparison",
      pageType: "compare",
      children: "Compare flights from Montreal to Lisbon",
    });

    expect(isValidElement(element)).toBe(true);
    if (!isValidElement(element)) {
      throw new Error("Expected a React element");
    }

    const props = element.props as ReactElement["props"] & {
      href: string;
      target: string;
      rel: string;
      "aria-label": string;
      eventName: string;
      eventProperties: Record<string, string>;
    };
    const href = new URL(String(props.href));

    expect(href.searchParams.get("origin_iata")).toBe("YUL");
    expect(href.searchParams.get("destination_iata")).toBe("LIS");
    expect(href.searchParams.get("depart_date")).toBe("2026-09-10");
    expect(href.searchParams.get("return_date")).toBe("2026-09-20");
    expect(href.searchParams.get("adults")).toBe("2");
    expect(href.searchParams.get("trip_class")).toBe("1");
    expect(props.target).toBe("_blank");
    expect(props.rel).toBe("sponsored nofollow noopener noreferrer");
    expect(props["aria-label"]).toBe("Compare flights from Montreal to Lisbon");
    expect(props.eventName).toBe("affiliate_click");
    expect(props.eventProperties).toMatchObject({
      affiliate: "aviasales",
      product: "flights",
      origin: "YUL",
      destination: "LIS",
      departure_date: "2026-09-10",
      return_date: "2026-09-20",
      placement: "comparison",
      page_type: "compare",
      page_path: "/compare",
    });
  });
});
