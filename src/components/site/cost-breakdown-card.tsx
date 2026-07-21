import type { ComponentType } from "react";

import { AffiliateCTA } from "@/components/affiliate/AffiliateCTA";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AffiliateCategory, AffiliateContext } from "@/lib/affiliates/types";
import { formatMoney } from "@/lib/format-money";
import { cn } from "@/lib/utils";

type BreakdownIcon = ComponentType<{ className?: string }>;

export type CostBreakdownItem = {
  label: string;
  amount?: number | null;
  currency?: string;
  percentage?: number | null;
  ratio?: number | null;
  icon?: BreakdownIcon;
  description?: string;
  color?: string;
  colorClassName?: string;
  affiliateCategory?: AffiliateCategory;
  affiliateContext?: AffiliateContext;
};

type CostBreakdownCardProps = {
  title: string;
  items: CostBreakdownItem[];
  currency?: string;
  description?: string;
  totalLabel?: string;
  totalAmount?: number | null;
  showTotal?: boolean;
  barMode?: "total" | "max";
  className?: string;
  contentClassName?: string;
};

type CostBreakdownListProps = {
  items: CostBreakdownItem[];
  currency?: string;
  totalAmount?: number | null;
  barMode?: "total" | "max";
  showBars?: boolean;
  className?: string;
  itemClassName?: string;
};

const minVisibleBarWidth = 4;

function normalizeAmount(amount: number | null | undefined) {
  return typeof amount === "number" && Number.isFinite(amount) ? Math.max(amount, 0) : null;
}

export function getCostBreakdownTotal(items: CostBreakdownItem[]) {
  return items.reduce((total, item) => total + (normalizeAmount(item.amount) ?? 0), 0);
}

function getDenominator(items: CostBreakdownItem[], totalAmount: number | null | undefined, barMode: "total" | "max") {
  if (barMode === "max") {
    return Math.max(...items.map((item) => normalizeAmount(item.amount) ?? 0), 1);
  }

  return normalizeAmount(totalAmount) ?? Math.max(getCostBreakdownTotal(items), 1);
}

export function getCostBreakdownPercentage(item: CostBreakdownItem, denominator: number) {
  const explicitPercentage = normalizeAmount(item.percentage);

  if (explicitPercentage !== null) {
    return Math.min(explicitPercentage, 100);
  }

  const ratio = normalizeAmount(item.ratio);

  if (ratio !== null) {
    return Math.min(ratio * 100, 100);
  }

  const amount = normalizeAmount(item.amount) ?? 0;

  if (denominator <= 0) {
    return 0;
  }

  return Math.min((amount / denominator) * 100, 100);
}

export function getCostBreakdownBarWidth(item: CostBreakdownItem, denominator: number) {
  const amount = normalizeAmount(item.amount) ?? 0;
  const percentage = getCostBreakdownPercentage(item, denominator);

  return amount > 0 ? Math.max(percentage, minVisibleBarWidth) : 0;
}

function formatBreakdownAmount(amount: number | null | undefined, currency: string) {
  const normalizedAmount = normalizeAmount(amount);

  return normalizedAmount === null ? "Not available" : formatMoney(normalizedAmount, currency);
}

function getItemKey(item: CostBreakdownItem, index: number) {
  return `${item.label}-${index}`;
}

export function CostBreakdownCard({
  title,
  items,
  currency = "CAD",
  description,
  totalLabel = "Total estimated cost",
  totalAmount,
  showTotal = true,
  barMode = "total",
  className,
  contentClassName,
}: CostBreakdownCardProps) {
  const resolvedTotal = normalizeAmount(totalAmount) ?? getCostBreakdownTotal(items);

  return (
    <Card className={cn("border-slate-200 bg-white shadow-sm", className)}>
      <CardHeader>
        <CardTitle className="text-lg text-slate-950">{title}</CardTitle>
        {description ? <p className="text-sm leading-6 text-slate-600">{description}</p> : null}
      </CardHeader>
      <CardContent className={cn("grid gap-4", contentClassName)}>
        <CostBreakdownList barMode={barMode} currency={currency} items={items} totalAmount={resolvedTotal} />
        {showTotal ? (
          <div className="flex items-center justify-between gap-3 border-t border-slate-200 pt-4 text-sm">
            <span className="font-semibold text-slate-950">{totalLabel}</span>
            <span className="text-lg font-semibold text-slate-950">{formatBreakdownAmount(resolvedTotal, currency)}</span>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

export function CostBreakdownList({
  items,
  currency = "CAD",
  totalAmount,
  barMode = "total",
  showBars = true,
  className,
  itemClassName,
}: CostBreakdownListProps) {
  const denominator = getDenominator(items, totalAmount, barMode);

  return (
    <div className={cn("grid gap-4", className)}>
      {items.map((item, index) => {
        const Icon = item.icon;
        const itemCurrency = item.currency ?? currency;
        const percentage = getCostBreakdownPercentage(item, denominator);
        const width = getCostBreakdownBarWidth(item, denominator);

        return (
          <div key={getItemKey(item, index)} className={cn("grid gap-2", itemClassName)}>
            <div className="flex items-start justify-between gap-3 text-sm">
              <span className="flex min-w-0 items-start gap-2 font-medium text-slate-700">
                {Icon ? <Icon className="mt-0.5 size-4 shrink-0 text-slate-400" /> : null}
                {item.color && !Icon ? (
                  <span className="mt-1.5 size-3 shrink-0 rounded-full" style={{ backgroundColor: item.color }} />
                ) : null}
                <span className="min-w-0">
                  <span className="block truncate">{item.label}</span>
                  {item.description ? (
                    <span className="mt-0.5 block text-xs font-normal leading-5 text-slate-500">
                      {item.description}
                    </span>
                  ) : null}
                </span>
              </span>
              <span className="shrink-0 font-semibold text-slate-950">
                {formatBreakdownAmount(item.amount, itemCurrency)}
              </span>
            </div>
            {showBars ? (
              <div
                aria-label={`${item.label}: ${Math.round(percentage)}%`}
                aria-valuemax={100}
                aria-valuemin={0}
                aria-valuenow={Math.round(percentage)}
                className="h-2 rounded-full bg-slate-100"
                role="progressbar"
              >
                <div
                  className={cn("h-2 rounded-full bg-[#0B1D34]", item.colorClassName)}
                  style={{ backgroundColor: item.color, width: `${width}%` }}
                />
              </div>
            ) : null}
            {item.affiliateCategory && item.affiliateContext ? (
              <div className="min-h-8">
                <AffiliateCTA
                  category={item.affiliateCategory}
                  context={{
                    ...item.affiliateContext,
                    category: item.affiliateCategory,
                    placement: item.affiliateContext.placement ?? "cost_breakdown",
                  }}
                  variant="compact"
                />
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
