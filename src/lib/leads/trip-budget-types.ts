export type TripBudgetDestinationSnapshot = {
  slug?: string;
  title: string;
  country?: string;
  estimatedTotal: number;
  flightEstimate: number;
  hotelEstimate: number;
  foodEstimate: number;
  transportEstimate: number;
  activitiesEstimate: number;
  bufferEstimate: number;
  affiliateLinks?: Array<{
    label: string;
    href: string;
    type?: string;
  }>;
};

export type TripBudgetSnapshot = {
  origin: string;
  destination?: string | null;
  budgetAmount: number;
  budgetCurrency: string;
  tripDurationDays: number;
  travelStyle: string;
  travelerCount: number;
  estimatedTotal: number;
  flightEstimate: number;
  hotelEstimate: number;
  foodEstimate: number;
  transportEstimate: number;
  activitiesEstimate: number;
  bufferEstimate: number;
  sourcePage: string;
  destinations: TripBudgetDestinationSnapshot[];
  budgetRange?: string;
  month?: string;
  resultUrl?: string;
};

export type TripBudgetLeadResponse = {
  ok: boolean;
  error?: string;
  emailStatus?: "sent" | "failed" | "skipped";
};
