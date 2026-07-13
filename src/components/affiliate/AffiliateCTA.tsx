"use client";

import { ArrowRight } from "lucide-react";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { TrackedLink } from "@/components/analytics/tracked-link";
import { Button } from "@/components/ui/button";
import { buildAffiliateClickProperties } from "@/lib/affiliates/analytics";
import { getAffiliateForCategory } from "@/lib/affiliates/getAffiliateRecommendation";
import type { AffiliateCategory, AffiliateContext, AffiliateRecommendation } from "@/lib/affiliates/types";
import { cn } from "@/lib/utils";

export type AffiliateCTAVariant = "button" | "text" | "card" | "inline" | "compact";

type AffiliateCTAProps = {
  category: AffiliateCategory;
  context: AffiliateContext;
  variant?: AffiliateCTAVariant;
  className?: string;
  label?: string;
  children?: ReactNode;
};

export const affiliateLinkRel = "sponsored nofollow noopener noreferrer";
export const affiliateLinkTarget = "_blank";

export function AffiliateCTA({
  category,
  context,
  variant = "button",
  className,
  label,
  children,
}: AffiliateCTAProps) {
  const pathname = usePathname();
  const recommendation = getAffiliateForCategory(category, { ...context, category });

  if (!recommendation?.url) {
    return null;
  }

  const content = children ?? label ?? recommendation.label;
  const props = {
    href: recommendation.url,
    eventName: "affiliate_click" as const,
    eventProperties: buildAffiliateClickProperties(recommendation, { ...context, category }, pathname),
    target: affiliateLinkTarget,
    rel: affiliateLinkRel,
    prefetch: false,
    "aria-label": typeof content === "string" ? content : recommendation.label,
  };

  if (variant === "button") {
    return (
      <Button asChild size="sm" className={cn("h-9 rounded-xl bg-[#0B1D34] text-white hover:bg-[#0B1D34]/90", className)}>
        <TrackedLink {...props}>
          {content}
          <ArrowRight className="ml-2 size-3.5" />
        </TrackedLink>
      </Button>
    );
  }

  if (variant === "card") {
    return <AffiliateCardLink recommendation={recommendation} context={context} className={className} />;
  }

  if (variant === "compact") {
    return (
      <TrackedLink
        {...props}
        className={cn("inline-flex min-h-8 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-[#0B1D34] hover:border-[#14B8A6]", className)}
      >
        {content}
        <ArrowRight className="size-3" />
      </TrackedLink>
    );
  }

  return (
    <TrackedLink
      {...props}
      className={cn(
        variant === "inline"
          ? "inline-flex items-center gap-1 font-semibold text-[#0B1D34] underline-offset-4 hover:underline"
          : "font-semibold text-[#0B1D34] underline-offset-4 hover:underline",
        className
      )}
    >
      {content}
      {variant === "inline" ? <ArrowRight className="size-3" /> : null}
    </TrackedLink>
  );
}

function AffiliateCardLink({
  recommendation,
  context,
  className,
}: {
  recommendation: AffiliateRecommendation;
  context: AffiliateContext;
  className?: string;
}) {
  const pathname = usePathname();

  return (
    <TrackedLink
      href={recommendation.url}
      eventName="affiliate_click"
      eventProperties={buildAffiliateClickProperties(recommendation, context, pathname)}
      target={affiliateLinkTarget}
      rel={affiliateLinkRel}
      prefetch={false}
      className={cn("block rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition hover:border-[#14B8A6]/60", className)}
      aria-label={recommendation.label}
    >
      <span className="block text-sm font-semibold text-slate-950">{recommendation.label}</span>
      {recommendation.description ? (
        <span className="mt-1 block text-sm leading-5 text-slate-500">{recommendation.description}</span>
      ) : null}
    </TrackedLink>
  );
}
