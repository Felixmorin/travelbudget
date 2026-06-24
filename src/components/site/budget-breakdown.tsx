import { Plane, Utensils, Hotel, Bus, Ticket } from "lucide-react";

import { CostBreakdownCard, type CostBreakdownItem } from "@/components/site/cost-breakdown-card";
import { Destination, getDestinationCostBreakdown, getDestinationTripEstimate } from "@/lib/data/destinations";

const rows: Array<
  Pick<CostBreakdownItem, "label" | "icon" | "colorClassName"> & {
    key: keyof ReturnType<typeof getDestinationCostBreakdown>;
  }
> = [
  { key: "flights", label: "Flights", icon: Plane, colorClassName: "bg-blue-600" },
  { key: "accommodation", label: "Accommodation", icon: Hotel, colorClassName: "bg-teal-600" },
  { key: "food", label: "Food", icon: Utensils, colorClassName: "bg-orange-500" },
  { key: "localTransport", label: "Local transport", icon: Bus, colorClassName: "bg-slate-500" },
  { key: "activities", label: "Activities", icon: Ticket, colorClassName: "bg-violet-600" },
  { key: "misc", label: "Misc", icon: Ticket, colorClassName: "bg-amber-500" },
] as const;

export function BudgetBreakdown({ destination }: { destination: Destination }) {
  const days = 10;
  const originCode = "YUL";
  const travelStyle = "midRange";
  const costBreakdown = getDestinationCostBreakdown(destination, { days, originCode, travelStyle });
  const estimatedTotal = getDestinationTripEstimate(destination, { days, originCode, travelStyle });
  const items: CostBreakdownItem[] = rows.map((row) => ({
    label: row.label,
    amount: costBreakdown[row.key],
    currency: destination.currency,
    icon: row.icon,
    colorClassName: row.colorClassName,
  }));

  return (
    <CostBreakdownCard
      className="shadow-lg shadow-slate-200/60"
      currency={destination.currency}
      description="Mid-range estimate for 10 days from Montreal (YUL)."
      items={items}
      title="Trip cost breakdown"
      totalAmount={estimatedTotal}
    />
  );
}
