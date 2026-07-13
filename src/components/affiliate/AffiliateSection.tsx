"use client";

import { usePathname } from "next/navigation";

import { TrackedLink } from "@/components/analytics/tracked-link";
import { affiliateLinkRel, affiliateLinkTarget } from "@/components/affiliate/AffiliateCTA";
import { buildAffiliateClickProperties } from "@/lib/affiliates/analytics";
import { getAffiliateRecommendations } from "@/lib/affiliates/getAffiliateRecommendation";
import type { AffiliateCategory, AffiliateContext } from "@/lib/affiliates/types";
import { cn } from "@/lib/utils";

type AffiliateSectionProps = {
  context: AffiliateContext;
  categories?: AffiliateCategory[];
  limit?: number;
  title?: string;
  className?: string;
};

export function AffiliateDisclosure({ className }: { className?: string }) {
  return (
    <p className={cn("text-xs leading-5 text-slate-500", className)}>
      GoByBudget may earn a commission when you book through partner links, at no additional cost to you.
    </p>
  );
}

export function AffiliateSection({
  context,
  categories,
  limit = 3,
  title = "Check live prices",
  className,
}: AffiliateSectionProps) {
  const pathname = usePathname();
  const recommendations = getAffiliateRecommendations(context, { categories, limit });

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <section className={cn("grid gap-3", className)}>
      <div>
        <h2 className="text-lg font-semibold text-slate-950">{title}</h2>
        <AffiliateDisclosure className="mt-1" />
      </div>
      <div className="grid gap-2">
        {recommendations.map((recommendation) => (
          <TrackedLink
            key={recommendation.category}
            href={recommendation.url}
            eventName="affiliate_click"
            eventProperties={buildAffiliateClickProperties(recommendation, { ...context, category: recommendation.category }, pathname)}
            target={affiliateLinkTarget}
            rel={affiliateLinkRel}
            prefetch={false}
            className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-[#0B1D34] transition hover:border-[#14B8A6]"
          >
            {recommendation.label}
          </TrackedLink>
        ))}
      </div>
    </section>
  );
}
