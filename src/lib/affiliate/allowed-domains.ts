const defaultAllowedAffiliateDomains = [
  "airalo.com",
  "booking.com",
  "getyourguide.com",
  "skyscanner.ca",
  "skyscanner.com",
];

export function isAllowedAffiliateUrl(href: string) {
  let url: URL;

  try {
    url = new URL(href);
  } catch {
    return false;
  }

  if (url.protocol !== "https:") {
    return false;
  }

  const hostname = url.hostname.toLowerCase();

  return getAllowedAffiliateDomains().some((domain) => hostname === domain || hostname.endsWith(`.${domain}`));
}

export function getAllowedAffiliateDomains() {
  const configuredDomains = process.env.AFFILIATE_ALLOWED_DOMAINS?.split(",")
    .map((domain) => domain.trim().toLowerCase().replace(/^\*\./, ""))
    .filter(Boolean);

  return [...new Set([...(configuredDomains ?? []), ...defaultAllowedAffiliateDomains])];
}
