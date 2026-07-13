import type { AffiliateProvider, AffiliateProviderConfig } from "@/lib/affiliates/types";

const placeholderPattern = /^\s*\[\[.*\]\]\s*$/;

function configuredUrl(value: string | undefined, fallback?: string) {
  const candidate = value?.trim();

  if (candidate && !placeholderPattern.test(candidate)) {
    return candidate;
  }

  return fallback;
}

export const affiliateConfig = {
  aviasales: {
    provider: "aviasales",
    category: "flights",
    enabled: true,
    baseUrl: configuredUrl(process.env.NEXT_PUBLIC_AVIASALES_AFFILIATE_URL, "https://aviasales.tpx.lu/59DXH0n1"),
    label: "Aviasales",
    partnerName: "Travelpayouts",
    description: "Flight comparison partner.",
    supportsSubId: true,
    deepLink: "supported",
  },
  booking: {
    provider: "booking",
    category: "hotels",
    enabled: true,
    baseUrl: configuredUrl(process.env.NEXT_PUBLIC_BOOKING_AFFILIATE_URL),
    label: "Booking.com",
    partnerName: "Booking.com",
    description: "Accommodation partner.",
    supportsSubId: false,
    deepLink: "generic",
  },
  getyourguide: {
    provider: "getyourguide",
    category: "activities",
    enabled: true,
    baseUrl: configuredUrl(process.env.NEXT_PUBLIC_GETYOURGUIDE_AFFILIATE_URL),
    label: "GetYourGuide",
    partnerName: "GetYourGuide",
    description: "Tours and activities partner.",
    supportsSubId: false,
    deepLink: "generic",
  },
  airalo: {
    provider: "airalo",
    category: "esim",
    enabled: true,
    baseUrl: configuredUrl(process.env.NEXT_PUBLIC_AIRALO_AFFILIATE_URL, "https://airalo.tpx.lu/dj9PTkYV"),
    label: "Airalo",
    partnerName: "Airalo",
    description: "eSIM partner.",
    supportsSubId: false,
    deepLink: "generic",
  },
  discover_cars: {
    provider: "discover_cars",
    category: "car_rental",
    enabled: true,
    baseUrl: configuredUrl(process.env.NEXT_PUBLIC_DISCOVER_CARS_AFFILIATE_URL),
    label: "Discover Cars",
    partnerName: "Discover Cars",
    description: "Car rental comparison partner.",
    supportsSubId: false,
    deepLink: "generic",
  },
  omio: {
    provider: "omio",
    category: "trains_buses",
    enabled: true,
    baseUrl: configuredUrl(process.env.NEXT_PUBLIC_OMIO_AFFILIATE_URL),
    label: "Omio",
    partnerName: "Omio",
    description: "Train and bus comparison partner.",
    supportsSubId: false,
    deepLink: "generic",
  },
  travel_insurance: {
    provider: "travel_insurance",
    category: "travel_insurance",
    enabled: true,
    baseUrl: configuredUrl(process.env.NEXT_PUBLIC_TRAVEL_INSURANCE_AFFILIATE_URL),
    label: "Travel insurance",
    partnerName: "Travel insurance",
    description: "Travel insurance partner.",
    supportsSubId: false,
    deepLink: "generic",
  },
  airport_transfer: {
    provider: "airport_transfer",
    category: "airport_transfer",
    enabled: true,
    baseUrl: configuredUrl(process.env.NEXT_PUBLIC_AIRPORT_TRANSFER_AFFILIATE_URL, "https://kiwitaxi.tpx.lu/yLIGDtS4"),
    label: "Airport transfer",
    partnerName: "Kiwitaxi",
    description: "Airport transfer partner.",
    supportsSubId: false,
    deepLink: "generic",
  },
} as const satisfies Record<AffiliateProvider, AffiliateProviderConfig>;

export function getAffiliateProviderConfig(provider: AffiliateProvider) {
  return affiliateConfig[provider];
}
