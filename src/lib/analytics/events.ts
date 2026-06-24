export type AnalyticsPrimitive = string | number | boolean | null;

export type AnalyticsPayload = Record<string, AnalyticsPrimitive>;

export type CommonAnalyticsProperties = {
  page?: string;
  originCode?: string;
  destinationSlug?: string;
  destinationName?: string;
  budget?: number;
  currency?: string;
  days?: number;
  tripLength?: number;
  travelers?: number;
  travelStyle?: string;
  ctaLocation?: string;
  affiliatePartner?: string;
};

export type AnalyticsEventProperties = {
  search_started: CommonAnalyticsProperties & {
    source?: string;
  };
  search_completed: CommonAnalyticsProperties & {
    month?: string;
    resultsCount?: number;
  };
  destination_card_clicked: CommonAnalyticsProperties & {
    source?: string;
  };
  destination_viewed: CommonAnalyticsProperties;
  budget_calculator_started: CommonAnalyticsProperties & {
    source?: string;
  };
  budget_calculator_updated: CommonAnalyticsProperties & {
    field?: string;
    estimatedTotal?: number;
  };
  budget_calculator_submitted: CommonAnalyticsProperties & {
    estimatedTotal?: number;
  };
  budget_result_viewed: CommonAnalyticsProperties & {
    resultCount?: number;
    resultsCount?: number;
  };
  cta_clicked: CommonAnalyticsProperties & {
    label?: string;
    href?: string;
  };
  affiliate_link_clicked: CommonAnalyticsProperties & {
    href?: string;
    linkType?: string;
    title?: string;
  };
  newsletter_submitted: CommonAnalyticsProperties & {
    newsletterLocation?: string;
  };
  guide_clicked: CommonAnalyticsProperties & {
    guideTitle?: string;
    guideCategory?: string;
    href?: string;
  };
};

export type AnalyticsEventName = keyof AnalyticsEventProperties;

export type AnalyticsEventPayload<EventName extends AnalyticsEventName> =
  AnalyticsEventProperties[EventName];

export const analyticsEventNames = [
  "search_started",
  "search_completed",
  "destination_card_clicked",
  "destination_viewed",
  "budget_calculator_started",
  "budget_calculator_updated",
  "budget_calculator_submitted",
  "budget_result_viewed",
  "cta_clicked",
  "affiliate_link_clicked",
  "newsletter_submitted",
  "guide_clicked",
] as const satisfies readonly AnalyticsEventName[];
