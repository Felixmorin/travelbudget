import { Plane, Utensils, Hotel, Bus, Ticket } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Destination, formatMoney } from "@/lib/data/destinations";

const rows = [
  { key: "flightCost", label: "Flights", icon: Plane, color: "bg-blue-600" },
  { key: "hotelCost", label: "Hotels", icon: Hotel, color: "bg-teal-600" },
  { key: "foodCost", label: "Food", icon: Utensils, color: "bg-orange-500" },
  { key: "transportCost", label: "Transport", icon: Bus, color: "bg-slate-500" },
  { key: "activitiesCost", label: "Activities", icon: Ticket, color: "bg-violet-600" },
] as const;

export function BudgetBreakdown({ destination }: { destination: Destination }) {
  return (
    <Card className="border-slate-200 bg-white shadow-lg shadow-slate-200/60">
      <CardHeader>
        <CardTitle className="text-lg text-slate-950">Trip cost breakdown</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        {rows.map((row) => {
          const value = destination[row.key];
          const Icon = row.icon;
          const percent = Math.round((value / destination.estimatedCost) * 100);

          return (
            <div key={row.key} className="grid gap-2">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 font-medium text-slate-700">
                  <Icon className="size-4 text-slate-400" />
                  {row.label}
                </span>
                <span className="font-semibold text-slate-950">{formatMoney(value, destination.currency)}</span>
              </div>
              <div className="h-2 rounded-full bg-slate-100">
                <div className={`h-2 rounded-full ${row.color}`} style={{ width: `${percent}%` }} />
              </div>
            </div>
          );
        })}
        <div className="flex items-center justify-between border-t border-slate-200 pt-4 text-sm">
          <span className="font-semibold text-slate-950">Total estimated cost</span>
          <span className="text-lg font-semibold text-slate-950">
            {formatMoney(destination.estimatedCost, destination.currency)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
