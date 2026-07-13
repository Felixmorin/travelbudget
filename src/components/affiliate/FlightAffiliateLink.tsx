"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { TrackedLink } from "@/components/analytics/tracked-link";
import {
  buildAviasalesAffiliateUrl,
  normalizeAviasalesSearchParams,
  type AviasalesCabinClass,
} from "@/lib/affiliates/aviasales";
import type { AnalyticsEventPayload } from "@/lib/analytics/events";

export type FlightAffiliateLinkPlacement =
  | "flight_breakdown"
  | "result_card"
  | "trip_summary"
  | "calculator_result"
  | "comparison"
  | "article_inline"
  | "page_footer";

export type FlightAffiliateLinkProps = {
  origin?: string;
  originIata?: string;
  destination?: string;
  destinationIata?: string;
  departureDate?: string | Date;
  returnDate?: string | Date;
  adults?: number;
  cabinClass?: AviasalesCabinClass;
  placement: FlightAffiliateLinkPlacement;
  pageType?: string;
  children?: ReactNode;
  className?: string;
  "aria-label"?: string;
};

export function FlightAffiliateLink({
  children,
  className,
  pageType,
  placement,
  ...searchParams
}: FlightAffiliateLinkProps) {
  const pathname = usePathname();
  const normalized = normalizeAviasalesSearchParams({ ...searchParams, placement, pageType });
  const href = buildAviasalesAffiliateUrl({ ...searchParams, placement, pageType });
  const label = typeof children === "string" ? children : getDefaultLabel(searchParams.destination);
  const eventProperties = buildFlightAffiliateAnalyticsProperties({
    href,
    normalized,
    origin: searchParams.origin,
    destination: searchParams.destination,
    placement,
    pageType,
    pagePath: pathname,
    label,
  });

  return (
    <TrackedLink
      href={href}
      prefetch={false}
      target="_blank"
      rel="sponsored nofollow noopener noreferrer"
      className={className}
      aria-label={searchParams["aria-label"] ?? label}
      eventName="affiliate_click"
      eventProperties={eventProperties}
    >
      {children ?? label}
    </TrackedLink>
  );
}

export function buildFlightAffiliateAnalyticsProperties({
  destination,
  href,
  label,
  normalized,
  origin,
  pagePath,
  pageType,
  placement,
}: {
  href: string;
  normalized: ReturnType<typeof normalizeAviasalesSearchParams>;
  origin?: string;
  destination?: string;
  placement: FlightAffiliateLinkPlacement;
  pageType?: string;
  pagePath?: string | null;
  label: string;
}): AnalyticsEventPayload<"affiliate_click"> {
  return {
    affiliate: "aviasales",
    product: "flights",
    affiliatePartner: "Travelpayouts",
    affiliateProvider: "Aviasales",
    affiliateType: "Flights",
    origin: normalized.originIata ?? origin ?? "unknown",
    destination: normalized.destinationIata ?? destination ?? "unknown",
    departure_date: normalized.departureDate ?? "unknown",
    return_date: normalized.returnDate ?? "unknown",
    placement,
    page_type: pageType,
    page_path: pagePath ?? "unknown",
    page: pagePath ?? "unknown",
    href,
    label,
    ctaLocation: placement,
  };
}

function getDefaultLabel(destination: string | undefined) {
  return destination ? `Check live flights to ${destination}` : "See current flight prices";
}
