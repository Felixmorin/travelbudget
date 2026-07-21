import { Plane, Utensils, Hotel, Bus, Ticket } from "lucide-react";

import { CostBreakdownCard, type CostBreakdownItem } from "@/components/site/cost-breakdown-card";
import { AffiliateDisclosure } from "@/components/affiliate/AffiliateSection";
import { buildAffiliateContextFromDestination } from "@/lib/affiliates/destinations";
import type { AffiliateCategory } from "@/lib/affiliates/types";
import { Destination, getDestinationCostBreakdown, getDestinationTripEstimate } from "@/lib/data/destinations";

const rows: Array<
  Pick<CostBreakdownItem, "label" | "icon" | "colorClassName"> & {
    key: keyof ReturnType<typeof getDestinationCostBreakdown>;
    affiliateCategory?: AffiliateCategory;
  }
> = [
  { key: "flights", label: "Flights", icon: Plane, colorClassName: "bg-[#0B1D34]", affiliateCategory: "flights" },
  { key: "accommodation", label: "Accommodation", icon: Hotel, colorClassName: "bg-teal-600", affiliateCategory: "hotels" },
  { key: "food", label: "Food", icon: Utensils, colorClassName: "bg-orange-500" },
  { key: "localTransport", label: "Local transport", icon: Bus, colorClassName: "bg-slate-500", affiliateCategory: "trains_buses" },
  { key: "activities", label: "Activities", icon: Ticket, colorClassName: "bg-[#FF6B6B]", affiliateCategory: "activities" },
  { key: "misc", label: "Misc", icon: Ticket, colorClassName: "bg-amber-500", affiliateCategory: "esim" },
] as const;

export function BudgetBreakdown({ destination }: { destination: Destination }) {
  const days = 10;
  const originCode = "YUL";
  const travelStyle = "midRange";
  const costBreakdown = getDestinationCostBreakdown(destination, { days, originCode, travelStyle });
  const estimatedTotal = getDestinationTripEstimate(destination, { days, originCode, travelStyle });
  const affiliateContext = buildAffiliateContextFromDestination(destination, {
    durationDays: days,
    pageType: "destination",
    placement: "cost_breakdown",
  });
  const items: CostBreakdownItem[] = rows.map((row) => ({
    label: row.label,
    amount: costBreakdown[row.key],
    currency: destination.currency,
    icon: row.icon,
    colorClassName: row.colorClassName,
    affiliateCategory: row.affiliateCategory,
    affiliateContext,
  }));

  return (
    <>
    <CostBreakdownCard
      className="shadow-lg shadow-slate-200/60"
      currency={destination.currency}
      description="Mid-range estimate for 10 days from Montreal (YUL)."
      items={items}
      title="Trip cost breakdown"
      totalAmount={estimatedTotal}
    />
    <AffiliateDisclosure className="-mt-2 px-1" />
    </>
  );
}
