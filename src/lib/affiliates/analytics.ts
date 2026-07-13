import type { AffiliateContext, AffiliateRecommendation } from "@/lib/affiliates/types";
import type { AnalyticsEventPayload } from "@/lib/analytics/events";

export function buildAffiliateClickProperties(
  recommendation: AffiliateRecommendation,
  context: AffiliateContext,
  pagePath: string | null | undefined
): AnalyticsEventPayload<"affiliate_click"> {
  return {
    provider: recommendation.provider,
    category: recommendation.category,
    destination_city: context.destinationCity,
    destination_country: context.destinationCountry,
    origin_city: context.originCity,
    origin_iata: context.originIata,
    destination_iata: context.destinationIata,
    placement: context.placement,
    page_type: context.pageType,
    page_path: pagePath ?? "unknown",
    page: pagePath ?? "unknown",
    affiliate: recommendation.provider,
    product: recommendation.category,
    affiliateProvider: recommendation.provider,
    affiliatePartner: recommendation.provider,
    affiliateType: recommendation.category,
    href: recommendation.url,
    label: recommendation.label,
  };
}
