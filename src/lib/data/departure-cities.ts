export type SupportedCurrency = "CAD" | "USD" | "EUR" | "GBP";

export type DepartureCity = {
  name: string;
  slug: string;
  country: string;
  region?: string;
  currency: SupportedCurrency;
  timeZone: string;
  airportCodes: string[];
  latitude: number;
  longitude: number;
  languages: string[];
  status: "active" | "inactive";
  indexable: boolean;
  seoPriority: number;
  lastUpdated: string;
  popularityRank: number;
  flightPricingStatus: "available" | "unavailable";
  searchAliases: string[];
};

const lastUpdated = "2026-07-13";

export const departureCities: DepartureCity[] = [
  createCity("Montreal", "montreal", "Canada", "Quebec", "CAD", "America/Toronto", ["YUL"], 45.5019, -73.5674, ["en", "fr"], true, 1, "available", ["Montréal", "YMQ"]),
  createCity("Toronto", "toronto", "Canada", "Ontario", "CAD", "America/Toronto", ["YYZ", "YTZ"], 43.6532, -79.3832, ["en"], true, 2, "available", ["YTO"]),
  createCity("Vancouver", "vancouver", "Canada", "British Columbia", "CAD", "America/Vancouver", ["YVR"], 49.2827, -123.1207, ["en"], true, 3, "available"),
  createCity("Calgary", "calgary", "Canada", "Alberta", "CAD", "America/Edmonton", ["YYC"], 51.0447, -114.0719, ["en"], true, 4, "available"),
  createCity("Ottawa", "ottawa", "Canada", "Ontario", "CAD", "America/Toronto", ["YOW"], 45.4215, -75.6972, ["en", "fr"], false, 5, "available"),
  createCity("Quebec City", "quebec-city", "Canada", "Quebec", "CAD", "America/Toronto", ["YQB"], 46.8139, -71.2082, ["fr", "en"], false, 6, "available", ["Quebec", "Québec", "Québec City"]),
  createCity("Edmonton", "edmonton", "Canada", "Alberta", "CAD", "America/Edmonton", ["YEG"], 53.5461, -113.4938, ["en"], false, 7, "unavailable"),
  createCity("Winnipeg", "winnipeg", "Canada", "Manitoba", "CAD", "America/Winnipeg", ["YWG"], 49.8954, -97.1385, ["en", "fr"], false, 8, "unavailable"),
  createCity("Halifax", "halifax", "Canada", "Nova Scotia", "CAD", "America/Halifax", ["YHZ"], 44.6488, -63.5752, ["en"], false, 9, "unavailable"),
  createCity("New York", "new-york", "United States", "New York", "USD", "America/New_York", ["JFK", "EWR", "LGA"], 40.7128, -74.006, ["en"], true, 10, "available", ["NYC"]),
  createCity("Boston", "boston", "United States", "Massachusetts", "USD", "America/New_York", ["BOS"], 42.3601, -71.0589, ["en"], false, 11, "available"),
  createCity("Chicago", "chicago", "United States", "Illinois", "USD", "America/Chicago", ["ORD", "MDW"], 41.8781, -87.6298, ["en"], false, 12, "available", ["CHI"]),
  createCity("Los Angeles", "los-angeles", "United States", "California", "USD", "America/Los_Angeles", ["LAX"], 34.0522, -118.2437, ["en", "es"], false, 13, "unavailable", ["LA"]),
  createCity("San Francisco", "san-francisco", "United States", "California", "USD", "America/Los_Angeles", ["SFO", "OAK", "SJC"], 37.7749, -122.4194, ["en"], false, 14, "unavailable", ["Bay Area"]),
  createCity("Miami", "miami", "United States", "Florida", "USD", "America/New_York", ["MIA", "FLL"], 25.7617, -80.1918, ["en", "es"], false, 15, "unavailable"),
  createCity("Seattle", "seattle", "United States", "Washington", "USD", "America/Los_Angeles", ["SEA"], 47.6061, -122.3328, ["en"], false, 16, "unavailable"),
  createCity("Dallas", "dallas", "United States", "Texas", "USD", "America/Chicago", ["DFW", "DAL"], 32.7767, -96.797, ["en", "es"], false, 17, "unavailable"),
  createCity("Washington, DC", "washington-dc", "United States", "District of Columbia", "USD", "America/New_York", ["IAD", "DCA", "BWI"], 38.9072, -77.0369, ["en"], false, 18, "unavailable", ["Washington DC", "Washington"]),
  createCity("London", "london", "United Kingdom", "England", "GBP", "Europe/London", ["LHR", "LGW", "STN", "LTN"], 51.5072, -0.1276, ["en"], true, 19, "unavailable"),
  createCity("Paris", "paris", "France", "Ile-de-France", "EUR", "Europe/Paris", ["CDG", "ORY"], 48.8566, 2.3522, ["fr", "en"], true, 20, "unavailable"),
  createCity("Amsterdam", "amsterdam", "Netherlands", "North Holland", "EUR", "Europe/Amsterdam", ["AMS"], 52.3676, 4.9041, ["nl", "en"], false, 21, "unavailable"),
  createCity("Berlin", "berlin", "Germany", "Berlin", "EUR", "Europe/Berlin", ["BER"], 52.52, 13.405, ["de", "en"], false, 22, "unavailable"),
  createCity("Madrid", "madrid", "Spain", "Community of Madrid", "EUR", "Europe/Madrid", ["MAD"], 40.4168, -3.7038, ["es", "en"], false, 23, "unavailable"),
];

export const activeDepartureCities = departureCities.filter((city) => city.status === "active");

export function getDepartureCityBySlug(slug: string) {
  return departureCities.find((city) => city.slug === slug.toLowerCase());
}

export function getDepartureCityByAirportCode(code: string) {
  const normalizedCode = code.trim().toUpperCase();
  return departureCities.find((city) => city.airportCodes.includes(normalizedCode));
}

export function normalizeDepartureCityCode(value: string | null | undefined) {
  const normalized = normalizeSearchValue(value);

  if (!normalized) {
    return "YUL";
  }

  const byAirport = getDepartureCityByAirportCode(normalized.toUpperCase());
  if (byAirport) {
    return byAirport.airportCodes[0];
  }

  const byName = departureCities.find((city) =>
    [city.name, city.slug, city.country, city.region ?? "", ...city.searchAliases]
      .filter(Boolean)
      .some((candidate) => normalizeSearchValue(candidate) === normalized)
  );

  return byName?.airportCodes[0] ?? normalized.toUpperCase();
}

export function getDepartureCityForInput(value: string | null | undefined) {
  return getDepartureCityByAirportCode(normalizeDepartureCityCode(value));
}

export function getPopularDepartureCities(limit = 9) {
  return [...activeDepartureCities].sort((a, b) => a.popularityRank - b.popularityRank).slice(0, limit);
}

function createCity(
  name: string,
  slug: string,
  country: string,
  region: string | undefined,
  currency: SupportedCurrency,
  timeZone: string,
  airportCodes: string[],
  latitude: number,
  longitude: number,
  languages: string[],
  indexable: boolean,
  popularityRank: number,
  flightPricingStatus: DepartureCity["flightPricingStatus"],
  searchAliases: string[] = []
): DepartureCity {
  return {
    name,
    slug,
    country,
    region,
    currency,
    timeZone,
    airportCodes,
    latitude,
    longitude,
    languages,
    status: "active",
    indexable,
    seoPriority: indexable ? Math.max(0.52, 0.9 - popularityRank * 0.02) : 0.25,
    lastUpdated,
    popularityRank,
    flightPricingStatus,
    searchAliases,
  };
}

function normalizeSearchValue(value: string | null | undefined) {
  return value
    ?.normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase();
}
