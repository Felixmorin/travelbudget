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
    description: "Compare current provider fares against the trip budget estimate.",
    actionLabel: "Compare",
    priceHint: "Provider fares",
    href: "https://www.skyscanner.ca/transport/flights/",
    isAvailable: true,
  },
  Hotels: {
    title: "Compare hotel options",
    description: "Compare stay assumptions before booking.",
    actionLabel: "Plan",
    priceHint: "Estimate",
    href: "/results",
    isAvailable: true,
  },
  Insurance: {
    title: "Check travel insurance options",
    description: "Estimate insurance needs for the trip.",
    actionLabel: "Plan",
    priceHint: "Estimate",
    href: "/travel-budget-calculator",
    isAvailable: true,
  },
  eSIM: {
    title: "Plan mobile data",
    description: "Estimate mobile data needs for maps and bookings.",
    actionLabel: "Plan",
    priceHint: "Estimate",
    href: "/travel-budget-calculator",
    isAvailable: true,
  },
  Activities: {
    title: "Estimate activity costs",
    description: "Plan activity spending before booking.",
    actionLabel: "Plan",
    priceHint: "Estimate",
    href: "/results",
    isAvailable: true,
  },
  "Car rental": {
    title: "Compare rental cars",
    description: "Compare car rental only when it fits the itinerary.",
    actionLabel: "Compare",
    priceHint: "Partner prices",
    href: "/travel-budget-calculator",
    isAvailable: true,
  },
  "Trains and buses": {
    title: "Compare trains and buses",
    description: "Compare intercity ground transport options.",
    actionLabel: "Compare",
    priceHint: "Partner prices",
    href: "/travel-budget-calculator",
    isAvailable: true,
  },
  "Airport transfer": {
    title: "Check airport transfers",
    description: "Plan airport-to-hotel transport before arrival.",
    actionLabel: "Check",
    priceHint: "Partner prices",
    href: "/travel-budget-calculator",
    isAvailable: true,
  },
};

export function getAffiliatePlaceholder(link: AffiliateLink): AffiliatePlaceholder {
  const placeholder = placeholders[link.type];

  return {
    type: link.type,
    ...placeholder,
    title: link.title || placeholder.title,
    description: link.description || placeholder.description,
    priceHint: link.priceHint || placeholder.priceHint,
    href: link.href || placeholder.href,
  };
}
