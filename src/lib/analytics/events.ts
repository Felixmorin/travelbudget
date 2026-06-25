export type AnalyticsPrimitive = string | number | boolean | null;

export type AnalyticsPayload = Record<string, AnalyticsPrimitive>;

export type CommonAnalyticsProperties = {
  page?: string;
  source?: string;
  originCode?: string;
  originCity?: string;
  destinationSlug?: string;
  destinationName?: string;
  budget?: number;
  currency?: string;
  days?: number;
  month?: string;
  tripLength?: number;
  travelers?: number;
  travelStyle?: string;
  resultCount?: number;
  resultRank?: number;
  ctaLocation?: string;
  affiliateType?: string;
  affiliatePartner?: string;
  affiliateProvider?: string;
  href?: string;
  label?: string;
};

type CalculatorEventProperties = CommonAnalyticsProperties & {
  field?: string;
  estimatedTotal?: number;
};

export type AnalyticsEventProperties = {
  search_started: CommonAnalyticsProperties;
  search_completed: CommonAnalyticsProperties & {
    resultsCount?: number;
  };
  destination_card_clicked: CommonAnalyticsProperties;
  destination_viewed: CommonAnalyticsProperties;
  calculator_started: CommonAnalyticsProperties;
  calculator_updated: CalculatorEventProperties;
  calculator_submitted: CalculatorEventProperties;
  calculator_results_clicked: CalculatorEventProperties;
  budget_calculator_started: CommonAnalyticsProperties;
  budget_calculator_updated: CalculatorEventProperties;
  budget_calculator_submitted: CalculatorEventProperties;
  budget_calculator_cta_clicked: CalculatorEventProperties;
  budget_result_viewed: CommonAnalyticsProperties & {
    resultsCount?: number;
  };
  cta_clicked: CommonAnalyticsProperties;
  affiliate_module_viewed: CommonAnalyticsProperties;
  affiliate_link_clicked: CommonAnalyticsProperties & {
    linkType?: string;
    title?: string;
  };
  email_submitted_by_intent: CommonAnalyticsProperties & {
    intent?: string;
    variant?: string;
  };
  result_clicked: CommonAnalyticsProperties & {
    resultRank?: number;
  };
  filter_changed: CommonAnalyticsProperties & {
    filterName?: string;
    filterValue?: string | number | boolean | null;
    previousValue?: string | number | boolean | null;
  };
  destination_saved: CommonAnalyticsProperties & {
    resultRank?: number;
    savedState?: boolean;
  };
  email_capture_viewed: CommonAnalyticsProperties & {
    intent?: string;
    variant?: string;
  };
  email_capture_submitted: CommonAnalyticsProperties & {
    intent?: string;
    variant?: string;
  };
  email_capture_success: CommonAnalyticsProperties & {
    intent?: string;
    variant?: string;
  };
  email_capture_error: CommonAnalyticsProperties & {
    intent?: string;
    variant?: string;
    error?: string;
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
  "calculator_started",
  "calculator_updated",
  "calculator_submitted",
  "calculator_results_clicked",
  "budget_calculator_started",
  "budget_calculator_updated",
  "budget_calculator_submitted",
  "budget_calculator_cta_clicked",
  "budget_result_viewed",
  "cta_clicked",
  "affiliate_module_viewed",
  "affiliate_link_clicked",
  "email_submitted_by_intent",
  "result_clicked",
  "filter_changed",
  "destination_saved",
  "email_capture_viewed",
  "email_capture_submitted",
  "email_capture_success",
  "email_capture_error",
  "newsletter_submitted",
  "guide_clicked",
] as const satisfies readonly AnalyticsEventName[];
