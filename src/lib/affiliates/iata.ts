const cityIataByName = new Map<string, string>([
  ["bangkok", "BKK"],
  ["calgary", "YYC"],
  ["lisbon", "LIS"],
  ["mexico", "MEX"],
  ["mexico city", "MEX"],
  ["montreal", "YUL"],
  ["ottawa", "YOW"],
  ["paris", "PAR"],
  ["porto", "OPO"],
  ["quebec", "YQB"],
  ["quebec city", "YQB"],
  ["rome", "ROM"],
  ["seoul", "SEL"],
  ["tokyo", "TYO"],
  ["toronto", "YYZ"],
  ["vancouver", "YVR"],
]);

const destinationIataBySlug = new Map<string, string>([
  ["bangkok", "BKK"],
  ["calgary-to-lisbon-budget", "LIS"],
  ["france", "PAR"],
  ["italy", "ROM"],
  ["japan", "TYO"],
  ["lisbon", "LIS"],
  ["mexico", "MEX"],
  ["mexico-city", "MEX"],
  ["ottawa-to-mexico-city-budget", "MEX"],
  ["paris", "PAR"],
  ["portugal", "LIS"],
  ["porto", "OPO"],
  ["quebec-city-to-paris-budget", "PAR"],
  ["rome", "ROM"],
  ["seoul", "SEL"],
  ["south-korea", "SEL"],
  ["tokyo", "TYO"],
  ["toronto-to-tokyo-budget", "TYO"],
  ["vancouver-to-seoul-budget", "SEL"],
]);

export function getIataForLocation(value: string | null | undefined) {
  const normalized = normalizeLocation(value);

  if (!normalized) {
    return undefined;
  }

  if (/^[a-z]{3}$/i.test(normalized)) {
    return normalized.toUpperCase();
  }

  return cityIataByName.get(normalized) ?? destinationIataBySlug.get(normalized);
}

export function getDestinationIata({
  cityName,
  name,
  slug,
}: {
  cityName?: string;
  name?: string;
  slug?: string;
}) {
  return getIataForLocation(cityName) ?? getIataForLocation(slug) ?? getIataForLocation(name);
}

function normalizeLocation(value: string | null | undefined) {
  return value
    ?.normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase();
}
