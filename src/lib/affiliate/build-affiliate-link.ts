import type { AffiliateLink, Destination } from "@/lib/data/destinations";
import { isAllowedAffiliateUrl } from "@/lib/affiliate/allowed-domains";

export type BuiltAffiliateLink = {
  href: string;
  isExternal: boolean;
  rel?: string;
  target?: string;
  provider?: string;
  partner?: string;
  placement?: string;
};

const fallbackHrefByType: Record<AffiliateLink["type"], string> = {
  Flights: "https://www.skyscanner.ca/transport/flights/",
  Hotels: "/results",
  eSIM: "/travel-budget-calculator",
  Activities: "/results",
  Insurance: "/travel-budget-calculator",
  "Car rental": "/travel-budget-calculator",
  "Trains and buses": "/travel-budget-calculator",
  "Airport transfer": "/travel-budget-calculator",
};

export function buildAffiliateLink({
  destination,
  link,
}: {
  destination?: Pick<Destination, "slug">;
  link: AffiliateLink;
}): BuiltAffiliateLink {
  const href = getSafeHref(link.href, destination?.slug, link.type);
  const isExternal = link.isExternal ?? isExternalHref(href);
  const trackedHref = isExternal ? buildInternalTrackingHref({ destination, href, isExternal, link }) : href;

  return {
    href: trackedHref,
    isExternal,
    rel: link.rel ?? (isExternal ? "nofollow sponsored noopener noreferrer" : undefined),
    target: link.target ?? (isExternal ? "_blank" : undefined),
    provider: link.provider,
    partner: link.partner ?? link.provider,
    placement: link.placement,
  };
}

function getSafeHref(href: string | null | undefined, destinationSlug: string | undefined, type: AffiliateLink["type"]) {
  const trimmedHref = href?.trim();

  if (trimmedHref?.startsWith("/")) {
    return trimmedHref;
  }

  if (trimmedHref && isExternalHref(trimmedHref) && isAllowedAffiliateUrl(trimmedHref)) {
    return trimmedHref;
  }

  if (type === "Hotels" || type === "Activities") {
    return destinationSlug ? `/destinations/${destinationSlug}` : fallbackHrefByType[type];
  }

  return fallbackHrefByType[type];
}

function isExternalHref(href: string) {
  return /^https?:\/\//i.test(href);
}

function buildInternalTrackingHref({
  destination,
  href,
  link,
}: {
  destination?: Pick<Destination, "slug">;
  href: string;
  isExternal: boolean;
  link: AffiliateLink;
}) {
  const destinationSlug = destination?.slug ?? "general";
  const affiliateType = link.type.toLowerCase();
  const params = new URLSearchParams({
    url: Buffer.from(href, "utf8").toString("base64url"),
    source: link.placement ?? "affiliate_card",
  });

  if (link.partner ?? link.provider) {
    params.set("partner", link.partner ?? link.provider ?? "");
  }

  if (link.provider) {
    params.set("provider", link.provider);
  }

  return `/go/${destinationSlug}/${affiliateType}?${params.toString()}`;
}
