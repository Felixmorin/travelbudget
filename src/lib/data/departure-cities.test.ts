import { describe, expect, it } from "vitest";

import {
  departureCities,
  getDepartureCityByAirportCode,
  getDepartureCityBySlug,
  normalizeDepartureCityCode,
} from "@/lib/data/departure-cities";

describe("departure cities", () => {
  it("exports stable unique slugs", () => {
    const slugs = departureCities.map((city) => city.slug);

    expect(new Set(slugs).size).toBe(slugs.length);
    expect(getDepartureCityBySlug("montreal")?.airportCodes).toContain("YUL");
  });

  it("supports search by city name, airport code, and aliases", () => {
    expect(normalizeDepartureCityCode("Toronto")).toBe("YYZ");
    expect(normalizeDepartureCityCode("YTZ")).toBe("YYZ");
    expect(normalizeDepartureCityCode("NYC")).toBe("JFK");
    expect(getDepartureCityByAirportCode("ORY")?.slug).toBe("paris");
  });

  it("keeps multi-airport cities in one canonical city record", () => {
    expect(getDepartureCityBySlug("new-york")?.airportCodes).toEqual(["JFK", "EWR", "LGA"]);
    expect(getDepartureCityBySlug("london")?.airportCodes).toEqual(["LHR", "LGW", "STN", "LTN"]);
  });
});
