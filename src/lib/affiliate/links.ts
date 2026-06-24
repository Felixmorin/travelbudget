import type { AffiliateLink } from "@/lib/data/destinations";

export type AffiliatePlaceholder = {
  type: AffiliateLink["type"];
  title: string;
  description: string;
  actionLabel: string;
  priceHint: string;
  href: string | null;
  isAvailable: boolean;
};

const placeholders: Record<AffiliateLink["type"], Omit<AffiliatePlaceholder, "type">> = {
  Flights: {
    title: "Compare flights",
    description: "Flight comparison partners are not connected yet.",
    actionLabel: "Coming soon",
    priceHint: "Placeholder",
    href: null,
    isAvailable: false,
  },
  Hotels: {
    title: "Find hotels",
    description: "Hotel booking partners are not connected yet.",
    actionLabel: "Coming soon",
    priceHint: "Placeholder",
    href: null,
    isAvailable: false,
  },
  Insurance: {
    title: "View travel insurance options",
    description: "Insurance partners are not connected yet.",
    actionLabel: "Coming soon",
    priceHint: "Placeholder",
    href: null,
    isAvailable: false,
  },
  eSIM: {
    title: "Get an eSIM for your trip",
    description: "eSIM partners are not connected yet.",
    actionLabel: "Coming soon",
    priceHint: "Placeholder",
    href: null,
    isAvailable: false,
  },
  Activities: {
    title: "Browse activities",
    description: "Activity partners are not connected yet.",
    actionLabel: "Coming soon",
    priceHint: "Placeholder",
    href: null,
    isAvailable: false,
  },
};

export function getAffiliatePlaceholder(link: AffiliateLink): AffiliatePlaceholder {
  const placeholder = placeholders[link.type];

  return {
    type: link.type,
    ...placeholder,
  };
}
