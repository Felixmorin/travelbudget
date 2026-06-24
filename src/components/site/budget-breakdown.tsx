import { Plane, Utensils, Hotel, Bus, Ticket } from "lucide-react";

import { CostBreakdownCard, type CostBreakdownItem } from "@/components/site/cost-breakdown-card";
import { Destination } from "@/lib/data/destinations";

const rows: Array<
  Pick<CostBreakdownItem, "label" | "icon" | "colorClassName"> & {
    key: keyof Pick<Destination, "flightCost" | "hotelCost" | "foodCost" | "transportCost" | "activitiesCost">;
  }
> = [
  { key: "flightCost", label: "Flights", icon: Plane, colorClassName: "bg-blue-600" },
  { key: "hotelCost", label: "Hotels", icon: Hotel, colorClassName: "bg-teal-600" },
  { key: "foodCost", label: "Food", icon: Utensils, colorClassName: "bg-orange-500" },
  { key: "transportCost", label: "Transport", icon: Bus, colorClassName: "bg-slate-500" },
  { key: "activitiesCost", label: "Activities", icon: Ticket, colorClassName: "bg-violet-600" },
] as const;

export function BudgetBreakdown({ destination }: { destination: Destination }) {
  const items: CostBreakdownItem[] = rows.map((row) => ({
    label: row.label,
    amount: destination[row.key],
    currency: destination.currency,
    icon: row.icon,
    colorClassName: row.colorClassName,
  }));

  return (
    <CostBreakdownCard
      className="shadow-lg shadow-slate-200/60"
      currency={destination.currency}
      items={items}
      title="Trip cost breakdown"
      totalAmount={destination.estimatedCost}
    />
  );
}
