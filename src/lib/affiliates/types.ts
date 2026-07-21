export type AffiliateCategory =
  | "flights"
  | "hotels"
  | "activities"
  | "esim"
  | "car_rental"
  | "trains_buses"
  | "travel_insurance"
  | "airport_transfer";

export type AffiliateProvider =
  | "aviasales"
  | "booking"
  | "klook"
  | "getyourguide"
  | "airalo"
  | "discover_cars"
  | "omio"
  | "travel_insurance"
  | "airport_transfer";

export type AffiliateContext = {
  category?: AffiliateCategory;
  originCity?: string;
  originCountry?: string;
  originIata?: string;
  destinationSlug?: string;
  destinationCity?: string;
  destinationCountry?: string;
  destinationCountryCode?: string;
  destinationIata?: string;
  continent?: string;
  region?: string;
  departureDate?: string;
  returnDate?: string;
  durationDays?: number;
  travelers?: number;
  tripStyle?: string;
  pageType?: string;
  placement?: string;
  carRecommended?: boolean;
  railRelevant?: boolean;
  internationalTrip?: boolean;
  hasActivities?: boolean;
  hasOvernightStay?: boolean;
  transportType?: string;
};

export type AffiliateRecommendation = {
  provider: AffiliateProvider;
  category: AffiliateCategory;
  url: string;
  label: string;
  description?: string;
  enabled: boolean;
  reason?: string;
  priority: number;
  subId?: string;
};

export type AffiliateProviderConfig = {
  provider: AffiliateProvider;
  category: AffiliateCategory;
  enabled: boolean;
  baseUrl?: string;
  label: string;
  partnerName: string;
  description: string;
  supportsSubId: boolean;
  deepLink: "supported" | "generic";
};
