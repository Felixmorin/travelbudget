import Link from "next/link";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatMoney } from "@/lib/format-money";
import { getCityCountryLabel } from "@/lib/data/unified-destinations";
import type { BudgetDestination, ProgrammaticBudgetPageConfig } from "@/lib/programmatic/budget-pages";

export function BudgetComparisonTable({
  items,
  page,
}: {
  items: BudgetDestination[];
  page: ProgrammaticBudgetPageConfig;
}) {
  if (items.length === 0) {
    return (
      <p className="rounded-lg bg-white p-5 text-sm leading-6 text-slate-600">
        There are no destinations to compare yet because no destinations match this budget.
      </p>
    );
  }

  return (
    <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-white">
      <Table>
        <TableHeader>
          <TableRow className="border-b-2 border-slate-200 hover:bg-transparent">
            <TableHead className="px-4 py-4 text-slate-950">Destination</TableHead>
            <TableHead className="px-4 py-4 text-slate-950">Est. Total</TableHead>
            <TableHead className="px-4 py-4 text-slate-950">Flights</TableHead>
            <TableHead className="px-4 py-4 text-slate-950">Daily Cost</TableHead>
            <TableHead className="px-4 py-4 text-slate-950">Best Season</TableHead>
            <TableHead className="px-4 py-4 text-slate-950">Style</TableHead>
            <TableHead className="px-4 py-4 text-slate-950">Score</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.destination.slug} className="hover:bg-slate-50">
              <TableCell className="px-4 py-5 font-bold text-slate-950">
                <Link href={`/destinations/${item.destination.slug}`} className="hover:text-[#0B1D34]">
                  {getCityCountryLabel(item.destination)}
                </Link>
              </TableCell>
              <TableCell className="px-4 py-5 font-bold text-[#0B1D34]">
                {formatMoney(item.totalEstimate, page.currency)}
              </TableCell>
              <TableCell className="px-4 py-5 text-slate-600">
                {formatMoney(item.flightEstimate, page.currency)}
              </TableCell>
              <TableCell className="px-4 py-5 text-slate-600">
                {formatMoney(item.dailyEstimate, page.currency)}
              </TableCell>
              <TableCell className="px-4 py-5 text-slate-600">
                {item.destination.bestMonths.slice(0, 2).join(" - ")}
              </TableCell>
              <TableCell className="px-4 py-5">
                <span className="rounded-full bg-[#14B8A6]/10 px-3 py-1 text-xs font-semibold text-[#0B1D34]">
                  {item.destination.travelStyles[0] ?? "Value"}
                </span>
              </TableCell>
              <TableCell className="px-4 py-5 font-bold text-slate-950">
                {(item.destination.score / 10).toFixed(1)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
