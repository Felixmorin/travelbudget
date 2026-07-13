import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  AVIASALES_FALLBACK_URL,
  buildAviasalesAffiliateUrl,
  formatSearchDate,
  normalizeAviasalesSearchParams,
} from "@/lib/affiliates/aviasales";

describe("buildAviasalesAffiliateUrl", () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
  });

  it("builds a marked Aviasales search URL for valid origin and destination", () => {
    vi.stubEnv("NEXT_PUBLIC_TRAVELPAYOUTS_MARKER", "12345");

    const url = new URL(buildAviasalesAffiliateUrl({ originIata: "YUL", destinationIata: "LIS" }));

    expect(url.origin + url.pathname).toBe("https://search.aviasales.com/flights/");
    expect(url.searchParams.get("marker")).toBe("12345");
    expect(url.searchParams.get("origin_iata")).toBe("YUL");
    expect(url.searchParams.get("destination_iata")).toBe("LIS");
  });

  it("adds valid round-trip dates", () => {
    vi.stubEnv("NEXT_PUBLIC_TRAVELPAYOUTS_MARKER", "12345");

    const url = new URL(
      buildAviasalesAffiliateUrl({
        originIata: "YUL",
        destinationIata: "LIS",
        departureDate: "2026-09-10",
        returnDate: "2026-09-20",
      })
    );

    expect(url.searchParams.get("depart_date")).toBe("2026-09-10");
    expect(url.searchParams.get("return_date")).toBe("2026-09-20");
    expect(url.searchParams.get("oneway")).toBe("0");
  });

  it("supports one-way searches", () => {
    vi.stubEnv("NEXT_PUBLIC_TRAVELPAYOUTS_MARKER", "12345");

    const url = new URL(
      buildAviasalesAffiliateUrl({ originIata: "YUL", destinationIata: "TYO", departureDate: "2026-10-01" })
    );

    expect(url.searchParams.get("depart_date")).toBe("2026-10-01");
    expect(url.searchParams.get("return_date")).toBeNull();
    expect(url.searchParams.get("oneway")).toBe("1");
  });

  it("normalizes lowercase IATA codes", () => {
    expect(normalizeAviasalesSearchParams({ originIata: "yul", destinationIata: "lis" })).toMatchObject({
      originIata: "YUL",
      destinationIata: "LIS",
    });
  });

  it("drops invalid IATA codes", () => {
    expect(normalizeAviasalesSearchParams({ originIata: "YU", destinationIata: "LIS1" })).toMatchObject({
      originIata: undefined,
      destinationIata: undefined,
    });
  });

  it("does not require a destination when the origin is known", () => {
    vi.stubEnv("NEXT_PUBLIC_TRAVELPAYOUTS_MARKER", "12345");

    const url = new URL(buildAviasalesAffiliateUrl({ originIata: "YVR" }));

    expect(url.searchParams.get("origin_iata")).toBe("YVR");
    expect(url.searchParams.get("destination_iata")).toBeNull();
  });

  it("drops return dates before departure dates", () => {
    const normalized = normalizeAviasalesSearchParams({
      originIata: "YUL",
      destinationIata: "LIS",
      departureDate: "2026-09-20",
      returnDate: "2026-09-10",
    });

    expect(normalized.departureDate).toBe("2026-09-20");
    expect(normalized.returnDate).toBeUndefined();
  });

  it("maps special-character city names before URL encoding", () => {
    vi.stubEnv("NEXT_PUBLIC_TRAVELPAYOUTS_MARKER", "12345");

    const url = new URL(buildAviasalesAffiliateUrl({ origin: "Quebec City", destination: "Mexico City" }));

    expect(url.searchParams.get("origin_iata")).toBe("YQB");
    expect(url.searchParams.get("destination_iata")).toBe("MEX");
  });

  it("uses the fallback when no marker is configured", () => {
    expect(buildAviasalesAffiliateUrl({ originIata: "YUL", destinationIata: "LIS" })).toBe(AVIASALES_FALLBACK_URL);
  });

  it("adds placement as a SubID", () => {
    vi.stubEnv("NEXT_PUBLIC_TRAVELPAYOUTS_MARKER", "12345");

    const url = new URL(
      buildAviasalesAffiliateUrl({ originIata: "YUL", destinationIata: "LIS", placement: "Flight Breakdown" })
    );

    expect(url.searchParams.get("sub_id")).toBe("flight_breakdown");
  });

  it("does not expose server-only Travelpayouts secrets", () => {
    vi.stubEnv("TRAVELPAYOUTS_API_TOKEN", "secret-token");
    vi.stubEnv("TRAVELPAYOUTS_MARKER", "private-marker");

    expect(buildAviasalesAffiliateUrl({ originIata: "YUL", destinationIata: "LIS" })).toBe(AVIASALES_FALLBACK_URL);
  });

  it("keeps affiliate attribution when a marker is configured", () => {
    vi.stubEnv("NEXT_PUBLIC_TRAVELPAYOUTS_MARKER", "12345");

    const url = new URL(buildAviasalesAffiliateUrl({ originIata: "YUL", destinationIata: "LIS" }));

    expect(url.hostname).toBe("search.aviasales.com");
    expect(url.searchParams.get("marker")).toBe("12345");
  });

  it.each([
    ["Montreal", "Lisbon", "YUL", "LIS"],
    ["Toronto", "Tokyo", "YYZ", "TYO"],
    ["Vancouver", "Seoul", "YVR", "SEL"],
    ["Calgary", "Lisbon", "YYC", "LIS"],
    ["Ottawa", "Mexico City", "YOW", "MEX"],
    ["Quebec City", "Paris", "YQB", "PAR"],
  ])("maps %s to %s for Aviasales search links", (origin, destination, originIata, destinationIata) => {
    vi.stubEnv("NEXT_PUBLIC_TRAVELPAYOUTS_MARKER", "12345");

    const url = new URL(buildAviasalesAffiliateUrl({ origin, destination }));

    expect(url.searchParams.get("origin_iata")).toBe(originIata);
    expect(url.searchParams.get("destination_iata")).toBe(destinationIata);
    expect(url.searchParams.get("marker")).toBe("12345");
  });

  it("formats Date values without using UTC day shifts", () => {
    expect(formatSearchDate(new Date(2026, 8, 10, 23, 30))).toBe("2026-09-10");
  });
});
