import { AlertTriangle } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { planningExchangeRates } from "@/lib/currency/exchange-rates";

type EstimateTransparencyProps = {
  title?: string;
  currency?: string;
  lastUpdated?: string;
  sources?: string[];
  assumptions?: string[];
  limits?: string[];
  exchangeRateNote?: string;
  compact?: boolean;
};

export function EstimateTransparency({
  title = "How to read these estimates",
  currency = "CAD",
  lastUpdated = planningExchangeRates.lastUpdated,
  exchangeRateNote = `Exchange rates last reviewed on ${planningExchangeRates.lastUpdated}.`,
}: EstimateTransparencyProps) {
  return (
    <section className="py-3">
      <div className="flex items-start gap-3">
        <AlertTriangle className="mt-0.5 size-5 shrink-0 text-amber-700" />
        <div className="min-w-0">
          <Button asChild variant="outline" className="h-9 rounded-xl bg-white">
            <Link href="/methodology">{title}</Link>
          </Button>
          <p className="mt-1 text-sm leading-6 text-slate-700">
            Static planning estimate in {currency}. Last data update: {lastUpdated}. {exchangeRateNote}
          </p>
        </div>
      </div>
    </section>
  );
}
