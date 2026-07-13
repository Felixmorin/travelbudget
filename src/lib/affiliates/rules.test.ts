import { isValidElement, type ReactElement } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { AffiliateContext } from "@/lib/affiliates/types";

vi.mock("next/navigation", () => ({
  usePathname: () => "/test-page",
}));

const configuredEnv = {
  NEXT_PUBLIC_TRAVELPAYOUTS_MARKER: "12345",
  NEXT_PUBLIC_BOOKING_AFFILIATE_URL: "https://www.booking.com/index.html?aid=booking-test",
  NEXT_PUBLIC_GETYOURGUIDE_AFFILIATE_URL: "https://www.getyourguide.com/?partner_id=gyg-test",
  NEXT_PUBLIC_DISCOVER_CARS_AFFILIATE_URL: "https://www.discovercars.com/?a_aid=discover-test",
  NEXT_PUBLIC_OMIO_AFFILIATE_URL: "https://www.omio.com/?utm_source=gobybudget",
  NEXT_PUBLIC_TRAVEL_INSURANCE_AFFILIATE_URL: "https://insurance.example.com/gobybudget",
};

const lisbonContext: AffiliateContext = {
  originCity: "Montreal",
  originCountry: "Canada",
  originIata: "YUL",
  destinationSlug: "lisbon",
  destinationCity: "Lisbon",
  destinationCountry: "Portugal",
  destinationCountryCode: "PT",
  destinationIata: "LIS",
  continent: "Europe",
  durationDays: 7,
  travelers: 1,
  pageType: "travel_budget",
  placement: "flight_breakdown",
  hasActivities: true,
  hasOvernightStay: true,
  internationalTrip: true,
};

describe("affiliate recommendations", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.unstubAllEnvs();
    for (const [key, value] of Object.entries(configuredEnv)) {
      vi.stubEnv(key, value);
    }
  });

  it("shows Aviasales for an international flight", async () => {
    const { getAffiliateForCategory } = await import("@/lib/affiliates/getAffiliateRecommendation");

    const recommendation = getAffiliateForCategory("flights", lisbonContext);

    expect(recommendation?.provider).toBe("aviasales");
    expect(recommendation?.url).toContain("search.aviasales.com");
  });

  it("shows Booking.com for hotels", async () => {
    const { getAffiliateForCategory } = await import("@/lib/affiliates/getAffiliateRecommendation");

    expect(getAffiliateForCategory("hotels", lisbonContext)?.provider).toBe("booking");
  });

  it("shows Airalo for international trips and hides it for domestic trips", async () => {
    const { getAffiliateForCategory } = await import("@/lib/affiliates/getAffiliateRecommendation");

    expect(getAffiliateForCategory("esim", lisbonContext)?.provider).toBe("airalo");
    expect(
      getAffiliateForCategory("esim", {
        ...lisbonContext,
        originCountry: "Canada",
        destinationCountry: "Canada",
        destinationCountryCode: "CA",
        internationalTrip: false,
      })
    ).toBeNull();
  });

  it("hides Discover Cars for Tokyo and shows it for road trips", async () => {
    const { getAffiliateForCategory } = await import("@/lib/affiliates/getAffiliateRecommendation");

    expect(
      getAffiliateForCategory("car_rental", {
        ...lisbonContext,
        destinationSlug: "tokyo",
        destinationCity: "Tokyo",
        destinationCountry: "Japan",
        destinationCountryCode: "JP",
      })
    ).toBeNull();
    expect(
      getAffiliateForCategory("car_rental", {
        ...lisbonContext,
        destinationSlug: "ireland",
        destinationCity: "Ireland",
        destinationCountry: "Ireland",
        destinationCountryCode: "IE",
        tripStyle: "Road Trip",
        carRecommended: true,
      })?.provider
    ).toBe("discover_cars");
  });

  it("shows Omio for Europe multi-city trips and hides it where rail is not relevant", async () => {
    const { getAffiliateForCategory } = await import("@/lib/affiliates/getAffiliateRecommendation");

    expect(getAffiliateForCategory("trains_buses", { ...lisbonContext, pageType: "multi_city" })?.provider).toBe("omio");
    expect(
      getAffiliateForCategory("trains_buses", {
        ...lisbonContext,
        destinationSlug: "mexico-city",
        destinationCity: "Mexico City",
        destinationCountry: "Mexico",
        destinationCountryCode: "MX",
        continent: "North America",
        railRelevant: false,
      })
    ).toBeNull();
  });

  it("shows GetYourGuide for activities", async () => {
    const { getAffiliateForCategory } = await import("@/lib/affiliates/getAffiliateRecommendation");

    expect(getAffiliateForCategory("activities", lisbonContext)?.provider).toBe("getyourguide");
  });

  it("does not return broken links when an environment variable is absent", async () => {
    vi.resetModules();
    vi.unstubAllEnvs();
    const { getAffiliateForCategory } = await import("@/lib/affiliates/getAffiliateRecommendation");

    expect(getAffiliateForCategory("hotels", lisbonContext)).toBeNull();
  });

  it("deduplicates categories and sorts priorities", async () => {
    const { getAffiliateRecommendations } = await import("@/lib/affiliates/getAffiliateRecommendation");

    const recommendations = getAffiliateRecommendations(lisbonContext);
    const categories = recommendations.map((recommendation) => recommendation.category);

    expect(new Set(categories).size).toBe(categories.length);
    expect(categories.slice(0, 3)).toEqual(["flights", "hotels", "activities"]);
  });

  it("generates contextual labels", async () => {
    const { getAffiliateForCategory } = await import("@/lib/affiliates/getAffiliateRecommendation");

    expect(getAffiliateForCategory("flights", lisbonContext)?.label).toBe("Compare flights from Montreal to Lisbon");
    expect(getAffiliateForCategory("hotels", lisbonContext)?.label).toBe("See hotels in Lisbon");
  });

  it("configures sponsored target attributes and analytics on AffiliateCTA", async () => {
    const { AffiliateCTA } = await import("@/components/affiliate/AffiliateCTA");

    const element = AffiliateCTA({ category: "hotels", context: lisbonContext, variant: "text" });

    expect(isValidElement(element)).toBe(true);
    if (!isValidElement(element)) throw new Error("Expected AffiliateCTA to return an element");

    const props = element.props as ReactElement["props"] & {
      rel: string;
      target: string;
      eventName: string;
      eventProperties: Record<string, string>;
    };

    expect(props.rel).toBe("sponsored nofollow noopener noreferrer");
    expect(props.target).toBe("_blank");
    expect(props.eventName).toBe("affiliate_click");
    expect(props.eventProperties).toMatchObject({
      provider: "booking",
      category: "hotels",
      destination_city: "Lisbon",
      destination_country: "Portugal",
      origin_city: "Montreal",
      origin_iata: "YUL",
      destination_iata: "LIS",
      placement: "flight_breakdown",
      page_type: "travel_budget",
      page_path: "/test-page",
    });
  });

  it("uses generic fallback links where deep links are not configured", async () => {
    const { getAffiliateForCategory } = await import("@/lib/affiliates/getAffiliateRecommendation");

    expect(getAffiliateForCategory("hotels", lisbonContext)?.url).toBe(configuredEnv.NEXT_PUBLIC_BOOKING_AFFILIATE_URL);
    expect(getAffiliateForCategory("activities", lisbonContext)?.url).toBe(configuredEnv.NEXT_PUBLIC_GETYOURGUIDE_AFFILIATE_URL);
  });

  it("does not read server-only secrets for client-side affiliate URLs", async () => {
    vi.stubEnv("TRAVELPAYOUTS_API_TOKEN", "secret-token");
    vi.stubEnv("TRAVELPAYOUTS_MARKER", "private-marker");
    const { affiliateConfig } = await import("@/lib/affiliates/config");

    expect(JSON.stringify(affiliateConfig)).not.toContain("secret-token");
    expect(JSON.stringify(affiliateConfig)).not.toContain("private-marker");
  });
});
