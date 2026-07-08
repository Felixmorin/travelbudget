import { BarChart3, PiggyBank, Sun } from "lucide-react";

import type { FAQItem } from "@/lib/seo/schema";

export function ProgrammaticSeoContent({
  originCity,
  originCode,
  budgetLabel,
  budgetAmount,
  tripLengthDays,
  cheapestDestinationName,
  matchingDestinationNames,
  travelStyleLabel = "Mid-range",
}: {
  originCity: string;
  originCode: string;
  budgetLabel: string;
  budgetAmount: number;
  tripLengthDays: number;
  cheapestDestinationName: string | null;
  matchingDestinationNames: string[];
  travelStyleLabel?: string;
}) {
  const budgetPositioning = getBudgetPositioning(budgetAmount);
  const destinationList = matchingDestinationNames.slice(0, 4).join(", ");

  return (
    <div className="grid gap-6">
      <SeoSection title={`How far can ${budgetLabel} take you from ${originCity}?`}>
        <p>
          A {budgetLabel} budget can cover a realistic {travelStyleLabel.toLowerCase()} trip from {originCity} when the
          {` ${originCode} `} flight share stays in check and daily costs are controlled. This is a{" "}
          {budgetPositioning} budget page, so the strongest matches are destinations where the total trip estimate
          still leaves room for normal price movement.
        </p>
      </SeoSection>

      <SeoSection title={`What is included in this ${tripLengthDays}-day travel budget?`}>
        <p>
          These estimates include round-trip flights, accommodation, food, local transport, activities, and a
          small miscellaneous allowance for one traveler over {tripLengthDays} days. Prices are planning estimates
          in CAD, not live fares or guaranteed booking prices.
        </p>
      </SeoSection>

      <SeoSection title={`Best types of trips from ${originCity} under ${budgetLabel}`}>
        <p>
          The most realistic trips under this budget are {getTripTypeCopy(budgetAmount)}.{" "}
          {destinationList
            ? `Current matching examples include ${destinationList}.`
            : "Matching examples will appear as more pricing data is added."}{" "}
          A slightly longer trip can make sense when local costs are low enough to spread out the flight cost.
        </p>
      </SeoSection>

      <SeoSection title="How to choose the right destination for your budget">
        <p>
          Start with the total estimate, then compare the flight share against the daily cost. If flights take
          up too much of the budget, choose a shorter trip or wait for a fare sale. If daily costs are low,
          adding a few extra days may still keep the total manageable.
        </p>
      </SeoSection>

      <SeoSection title={`Tips to stretch your travel budget from ${originCity}`}>
        <p>
          Travel outside peak weeks, compare nearby departure dates, choose central stays that reduce transit
          costs, and reserve the expensive parts of the trip first. For this {originCode} budget set,{" "}
          {cheapestDestinationName ? `${cheapestDestinationName} currently has the lowest matching estimate.` : "new matches will appear as more destination pricing is added."}
        </p>
      </SeoSection>
    </div>
  );
}

function getBudgetPositioning(budgetAmount: number) {
  if (budgetAmount <= 1500) {
    return "tight, flight-sensitive";
  }

  if (budgetAmount <= 2500) {
    return "balanced";
  }

  return "comfort-oriented";
}

function getTripTypeCopy(budgetAmount: number) {
  if (budgetAmount <= 1500) {
    return "shorter city breaks, nearby warm escapes, and destinations with very low local costs";
  }

  if (budgetAmount <= 2500) {
    return "food-focused itineraries, warm-weather escapes, and shoulder-season city routes";
  }

  return "longer mid-range trips, transatlantic city routes, and selected long-haul destinations with controlled daily costs";
}

export function ProgrammaticFAQ({ faqs }: { faqs: FAQItem[] }) {
  return (
    <div className="grid gap-4">
      {faqs.map((faq) => (
        <div key={faq.question} className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-6">
          <h3 className="text-lg font-semibold text-slate-950">{faq.question}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">{faq.answer}</p>
        </div>
      ))}
    </div>
  );
}

export function ProgrammaticSeoHighlights({
  originCity,
  budgetLabel,
}: {
  originCity: string;
  budgetLabel: string;
}) {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      <Highlight
        icon={Sun}
        title="Target the shoulder season"
        body={`Flying from ${originCity} outside peak holiday weeks can make a ${budgetLabel} trip more realistic while keeping weather and availability reasonable.`}
      />
      <Highlight
        icon={BarChart3}
        title="Use full trip cost visibility"
        body="The estimates combine flights, daily accommodation, food, local transport, activities, and miscellaneous spending so the total is easier to compare."
      />
      <Highlight
        icon={PiggyBank}
        title="Optimize daily costs"
        body="Destinations with lower daily costs can let you stay longer, upgrade one part of the trip, or keep more room for price swings."
      />
    </div>
  );
}

function SeoSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[24px] border border-slate-200/80 bg-white p-6">
      <h2 className="text-2xl font-semibold tracking-tight text-slate-950">{title}</h2>
      <div className="mt-3 text-sm leading-7 text-slate-600">{children}</div>
    </section>
  );
}

function Highlight({
  icon: Icon,
  title,
  body,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  body: string;
}) {
  return (
    <div className="space-y-4">
      <Icon className="size-8 text-[#0B1D34]" />
      <h3 className="text-xl font-semibold text-slate-950">{title}</h3>
      <p className="text-sm leading-6 text-slate-600">{body}</p>
    </div>
  );
}
