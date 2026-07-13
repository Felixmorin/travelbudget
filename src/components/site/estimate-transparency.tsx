import { AlertTriangle, Database, RefreshCcw } from "lucide-react";

import { planningExchangeRates } from "@/lib/currency/exchange-rates";

type EstimateTransparencyProps = {
  title?: string;
  currency?: string;
  lastUpdated?: string;
  sources?: string[];
  assumptions?: string[];
  limits?: string[];
  compact?: boolean;
};

const defaultSources = [
  "GoByBudget static destination cost dataset",
  "Directional public booking-market ranges normalized into CAD planning estimates",
];

const defaultAssumptions = [
  "Economy flights, practical accommodation, local meals, transport, activities, and a small buffer",
  "Trip cost varies by departure airport, dates, season, traveler count, booking timing, and travel style",
];

const defaultLimits = [
  "These are static estimates, not live quotes",
  "GoByBudget does not guarantee price, availability, baggage rules, cancellation terms, or partner inventory",
];

export function EstimateTransparency({
  title = "How to read these estimates",
  currency = "CAD",
  lastUpdated = planningExchangeRates.lastUpdated,
  sources = defaultSources,
  assumptions = defaultAssumptions,
  limits = defaultLimits,
  compact = false,
}: EstimateTransparencyProps) {
  return (
    <section className={`rounded-2xl border border-amber-200 bg-amber-50/80 ${compact ? "p-4" : "p-5"}`}>
      <div className="flex items-start gap-3">
        <AlertTriangle className="mt-0.5 size-5 shrink-0 text-amber-700" />
        <div className="min-w-0">
          <h2 className="text-base font-semibold text-slate-950">{title}</h2>
          <p className="mt-1 text-sm leading-6 text-slate-700">
            Static planning estimate in {currency}. Last data update: {lastUpdated}. FX table:{" "}
            {planningExchangeRates.version} ({planningExchangeRates.source}).
          </p>
        </div>
      </div>
      <div className={`mt-4 grid gap-3 text-sm leading-6 text-slate-700 ${compact ? "" : "md:grid-cols-3"}`}>
        <TransparencyList icon={Database} label="Sources" items={sources} />
        <TransparencyList icon={RefreshCcw} label="Assumptions" items={assumptions} />
        <TransparencyList icon={AlertTriangle} label="Limits" items={limits} />
      </div>
    </section>
  );
}

function TransparencyList({
  icon: Icon,
  items,
  label,
}: {
  icon: React.ComponentType<{ className?: string }>;
  items: string[];
  label: string;
}) {
  return (
    <div>
      <p className="flex items-center gap-2 font-semibold text-slate-950">
        <Icon className="size-4" />
        {label}
      </p>
      <ul className="mt-2 grid gap-1">
        {items.map((item) => (
          <li key={item} className="flex gap-2">
            <span className="mt-2 size-1.5 shrink-0 rounded-full bg-amber-600" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
