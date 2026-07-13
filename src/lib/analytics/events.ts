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
  affiliate?: string;
  product?: string;
  origin?: string;
  destination?: string;
  departure_date?: string;
  return_date?: string;
  placement?: string;
  page_type?: string;
  page_path?: string;
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
  destination_card_click: CommonAnalyticsProperties;
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
  affiliate_click: CommonAnalyticsProperties & {
    linkType?: string;
    title?: string;
  };
  compare_click: CommonAnalyticsProperties & {
    compareAction?: string;
    selectedDestinationSlugs?: string;
    selectedDestinations?: number;
  };
  compare_destination: CommonAnalyticsProperties & {
    compareAction?: string;
    selectedDestinationSlugs?: string;
    selectedDestinations?: number;
  };
  email_capture: CommonAnalyticsProperties & {
    emailDomain?: string;
  };
  email_capture_submit: CommonAnalyticsProperties & {
    emailDomain?: string;
  };
  affiliate_module_viewed: CommonAnalyticsProperties;
  affiliate_link_clicked: CommonAnalyticsProperties & {
    linkType?: string;
    title?: string;
  };
  guide_viewed: CommonAnalyticsProperties & {
    guideTitle?: string;
    guideCategory?: string;
  };
  result_clicked: CommonAnalyticsProperties & {
    resultRank?: number;
  };
  filter_changed: CommonAnalyticsProperties & {
    filterName?: string;
    filterValue?: string | number | boolean | null;
    previousValue?: string | number | boolean | null;
  };
  filter_change: CommonAnalyticsProperties & {
    filterName?: string;
    filterValue?: string | number | boolean | null;
    previousValue?: string | number | boolean | null;
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
  "destination_card_click",
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
  "affiliate_click",
  "compare_click",
  "compare_destination",
  "email_capture",
  "email_capture_submit",
  "affiliate_module_viewed",
  "affiliate_link_clicked",
  "guide_viewed",
  "result_clicked",
  "filter_changed",
  "filter_change",
  "guide_clicked",
] as const satisfies readonly AnalyticsEventName[];
