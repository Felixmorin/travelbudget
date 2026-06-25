import type { AffiliateLink, Destination } from "@/lib/data/destinations";

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
  eSIM: "/tools/travel-budget-calculator",
  Activities: "/results",
  Insurance: "/tools/travel-budget-calculator",
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

  return {
    href,
    isExternal,
    rel: link.rel ?? (isExternal ? "sponsored noopener noreferrer" : undefined),
    target: link.target ?? (isExternal ? "_blank" : undefined),
    provider: link.provider,
    partner: link.partner ?? link.provider,
    placement: link.placement,
  };
}

function getSafeHref(href: string | null | undefined, destinationSlug: string | undefined, type: AffiliateLink["type"]) {
  const trimmedHref = href?.trim();

  if (trimmedHref && (trimmedHref.startsWith("/") || isExternalHref(trimmedHref))) {
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
