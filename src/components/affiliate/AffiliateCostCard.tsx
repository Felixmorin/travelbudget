"use client";

import type { ComponentType } from "react";

import { AffiliateCTA } from "@/components/affiliate/AffiliateCTA";
import type { AffiliateCategory, AffiliateContext } from "@/lib/affiliates/types";
import { formatMoney } from "@/lib/format-money";
import { cn } from "@/lib/utils";

type AffiliateCostCardProps = {
  category: AffiliateCategory;
  label: string;
  estimatedCost?: number | null;
  currency?: string;
  affiliateContext: AffiliateContext;
  icon?: ComponentType<{ className?: string }>;
  className?: string;
};

export function AffiliateCostCard({
  category,
  label,
  estimatedCost,
  currency = "CAD",
  affiliateContext,
  icon: Icon,
  className,
}: AffiliateCostCardProps) {
  return (
    <article className={cn("rounded-lg border border-slate-200 bg-white p-4", className)}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            {Icon ? <Icon className="size-4 shrink-0 text-slate-400" /> : null}
            <h3 className="truncate text-sm font-semibold text-slate-950">{label}</h3>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Estimated cost: {typeof estimatedCost === "number" ? formatMoney(estimatedCost, currency) : "Not available"}
          </p>
        </div>
      </div>
      <div className="mt-3 min-h-8">
        <AffiliateCTA
          category={category}
          context={{ ...affiliateContext, category }}
          variant="compact"
        />
      </div>
    </article>
  );
}
