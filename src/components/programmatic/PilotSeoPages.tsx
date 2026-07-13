import Link from "next/link";
import { ArrowRight, BedDouble, Bus, CalendarDays, CircleDollarSign, Plane, Utensils } from "lucide-react";

import { EstimateDisclaimer } from "@/components/site/estimate-disclaimer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatMoney } from "@/lib/format-money";
import { getCityCountryLabel } from "@/lib/data/unified-destinations";
import {
  getDestinationCostBreakdown,
  getDestinationTripEstimate,
  type Destination,
  type TravelStyle,
} from "@/lib/data/destinations";
import type { BudgetDestination } from "@/lib/programmatic/budget-pages";
import { getProgrammaticBudgetPath } from "@/lib/programmatic/budget-pages";
import type { getBudgetAmountPage, getTripLengthPage } from "@/lib/programmatic/seo-registry";

type BudgetAmountPage = NonNullable<ReturnType<typeof getBudgetAmountPage>>;
type TripLengthPage = NonNullable<ReturnType<typeof getTripLengthPage>>;

export function PilotDestinationBudgetPage({
  destination,
  path,
  originCode = "YUL",
  originCity = "Montreal",
  durationDays = 10,
  travelStyle = "midRange",
}: {
  destination: Destination;
  path: string;
  originCode?: string;
  originCity?: string;
  durationDays?: number;
  travelStyle?: TravelStyle;
}) {
  const destinationLabel = getCityCountryLabel(destination);
  const totalEstimate = getDestinationTripEstimate(destination, {
    days: durationDays,
    originCode,
    travelStyle,
  });
  const breakdown = getDestinationCostBreakdown(destination, {
    days: durationDays,
    originCode,
    travelStyle,
  });
  const related = [
    { href: `/destinations/${destination.slug}`, label: `${destinationLabel} destination guide` },
    { href: `/trip-length/${durationDays}-days`, label: `${durationDays}-day trip budgets` },
    { href: "/travel-budget-calculator", label: "Custom travel budget calculator" },
    { href: "/methodology", label: "Budget methodology" },
  ];

  return (
    <SeoShell
      badge="Destination budget"
      h1={`${destinationLabel} travel budget`}
      intro={`A practical ${durationDays}-day ${destinationLabel} estimate from ${originCity}, using ${formatTravelStyle(travelStyle).toLowerCase()} daily costs, flight baselines, and CAD planning assumptions.`}
      totalLabel={formatMoney(totalEstimate, "CAD")}
      ctaPath={`/results?budget=${totalEstimate}&currency=CAD&origin=${originCode}&days=${durationDays}&travelers=1`}
      ctaLabel="Customize this budget"
    >
      <EstimateDisclaimer />
      <CostBreakdownGrid breakdown={breakdown} />
      <InfoSection title={`Why this ${destinationLabel} estimate is distinct`}>
        <p>{destination.shortDescription}</p>
        <p className="mt-3">
          It uses destination-specific flight estimates, daily costs, best-month signals, data confidence, and source
          notes instead of repeating generic country copy.
        </p>
      </InfoSection>
      <InfoSection title="Methodology and confidence">
        <div className="flex flex-wrap gap-2">
          <Badge className="bg-[#14B8A6]/10 text-[#0B1D34]">{destination.dataConfidence} confidence</Badge>
          <Badge className="bg-slate-100 text-slate-700">Updated {destination.lastUpdated}</Badge>
        </div>
        <ul className="mt-4 grid gap-2">
          {destination.sourceNotes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      </InfoSection>
      <InfoSection title="FAQ">
        <FaqList
          faqs={[
            ...destination.faqs,
            {
              question: `Does this ${destinationLabel} travel budget include flights?`,
              answer:
                "Yes. It includes a round-trip flight planning estimate plus accommodation, food, local transport, activities, and a small buffer.",
            },
            {
              question: "Can I use this as a live quote?",
              answer:
                "No. GoByBudget uses planning estimates. Verify current fares, hotels, exchange rates, baggage rules, and booking terms before buying.",
            },
          ]}
        />
      </InfoSection>
      <RelatedLinks title="Related planning pages" links={related} currentPath={path} />
    </SeoShell>
  );
}

export function PilotBudgetAmountPage({ page }: { page: BudgetAmountPage }) {
  const budgetLabel = formatMoney(page.amount, page.currency);
  const related = [
    ...page.originPages.map((originPage) => ({
      href: getProgrammaticBudgetPath(originPage),
      label: `Trips from ${originPage.origin.city} under ${budgetLabel}`,
    })),
    { href: "/travel-budget-calculator", label: "Custom calculator" },
    { href: "/methodology", label: "How estimates work" },
  ];

  return (
    <SeoShell
      badge="Budget level"
      h1={`Where can you travel for ${budgetLabel} CAD?`}
      intro={`This pilot page groups destinations that fit a ${budgetLabel} CAD trip budget from supported Canadian departure cities, using estimated flights, daily costs, trip length, and travel style assumptions.`}
      totalLabel={budgetLabel}
      ctaPath="/travel-budget-calculator"
      ctaLabel="Build my own budget"
    >
      <EstimateDisclaimer />
      {page.matches.length > 0 ? (
        <DestinationTable items={page.matches} />
      ) : (
        <InfoSection title="Indexing status">
          <p>
            The current dataset does not have enough complete flight-and-daily-cost matches for this budget. The page
            is available for users but should remain noindex until enough useful matches exist.
          </p>
        </InfoSection>
      )}
      <InfoSection title="How destinations are selected">
        <p>
          A destination appears only when its estimated total includes flights, accommodation, food, local transport,
          activities, and buffer for at least one supported Canadian origin.
        </p>
      </InfoSection>
      <RelatedLinks title="Budget by departure city" links={related} currentPath={page.path} />
    </SeoShell>
  );
}

export function PilotTripLengthPage({ page }: { page: TripLengthPage }) {
  const related = [
    { href: "/travel-budget-calculator", label: "Customize trip length" },
    { href: "/budget/2000", label: "$2,000 CAD budget ideas" },
    { href: "/budget/3000", label: "$3,000 CAD budget ideas" },
    { href: "/methodology", label: "Budget methodology" },
  ];

  return (
    <SeoShell
      badge="Trip length"
      h1={`${page.days}-day trip budget estimates`}
      intro={`Compare ${page.days}-day trip cost estimates from ${page.originCity}, with flights, daily costs, accommodation, food, local transport, activities, and data confidence kept visible.`}
      totalLabel={`${page.days} days`}
      ctaPath={`/results?origin=${page.originCode}&days=${page.days}&travelers=1`}
      ctaLabel="Plan this trip length"
    >
      <EstimateDisclaimer />
      <TripLengthTable items={page.destinations} />
      <InfoSection title="How to use this duration">
        <p>
          A trip length page is indexable only when it compares several destinations with complete estimates. It should
          not be cloned across every possible duration unless the duration creates a different planning decision.
        </p>
      </InfoSection>
      <RelatedLinks title="Related planning pages" links={related} currentPath={page.path} />
    </SeoShell>
  );
}

function SeoShell({
  badge,
  h1,
  intro,
  totalLabel,
  ctaPath,
  ctaLabel,
  children,
}: {
  badge: string;
  h1: string;
  intro: string;
  totalLabel: string;
  ctaPath: string;
  ctaLabel: string;
  children: React.ReactNode;
}) {
  return (
    <main className="bg-[#f7f9fb] text-slate-950">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
          <Badge className="rounded-full bg-[#14B8A6]/10 px-4 py-1 text-[#0B1D34]">{badge}</Badge>
          <div className="mt-5 grid gap-8 lg:grid-cols-[1fr_280px] lg:items-end">
            <div>
              <h1 className="max-w-4xl text-4xl font-semibold tracking-tight sm:text-6xl">{h1}</h1>
              <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">{intro}</p>
            </div>
            <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Planning baseline</p>
              <p className="mt-2 text-4xl font-semibold text-[#0B1D34]">{totalLabel}</p>
              <Button asChild className="mt-5 rounded-full bg-[#0B1D34] text-white hover:bg-[#0B1D34]">
                <Link href={ctaPath}>
                  {ctaLabel}
                  <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-12 sm:px-6 lg:px-8">{children}</section>
    </main>
  );
}

function CostBreakdownGrid({ breakdown }: { breakdown: Record<string, number> }) {
  return (
    <section className="rounded-[24px] border border-slate-200 bg-white p-6">
      <h2 className="text-2xl font-semibold">Cost breakdown</h2>
      <dl className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <CostMetric icon={Plane} label="Flights" value={breakdown.flights} />
        <CostMetric icon={BedDouble} label="Accommodation" value={breakdown.accommodation} />
        <CostMetric icon={Utensils} label="Food" value={breakdown.food} />
        <CostMetric icon={Bus} label="Local transport" value={breakdown.localTransport} />
        <CostMetric icon={CalendarDays} label="Activities" value={breakdown.activities} />
        <CostMetric icon={CircleDollarSign} label="Buffer" value={breakdown.misc} />
      </dl>
    </section>
  );
}

function CostMetric({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <Icon className="size-5 text-[#0B1D34]" />
      <dt className="mt-3 text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</dt>
      <dd className="mt-1 text-xl font-semibold text-slate-950">{formatMoney(value, "CAD")}</dd>
    </div>
  );
}

function DestinationTable({ items }: { items: BudgetDestination[] }) {
  return (
    <section className="overflow-hidden rounded-[24px] border border-slate-200 bg-white">
      <div className="p-6">
        <h2 className="text-2xl font-semibold">Matching destinations</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-6 py-3">Destination</th>
              <th className="px-6 py-3">Total estimate</th>
              <th className="px-6 py-3">Flights</th>
              <th className="px-6 py-3">Daily cost</th>
              <th className="px-6 py-3">Trip length</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {items.map((item) => (
              <tr key={item.destination.slug}>
                <td className="px-6 py-4 font-semibold">
                  <Link href={`/destinations/${item.destination.slug}`} className="text-[#0B1D34] hover:underline">
                    {getCityCountryLabel(item.destination)}
                  </Link>
                </td>
                <td className="px-6 py-4">{formatMoney(item.totalEstimate, "CAD")}</td>
                <td className="px-6 py-4">{formatMoney(item.flightEstimate, "CAD")}</td>
                <td className="px-6 py-4">{formatMoney(item.dailyEstimate, "CAD")}</td>
                <td className="px-6 py-4">{item.durationDays} days</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function TripLengthTable({ items }: { items: TripLengthPage["destinations"] }) {
  return (
    <section className="overflow-hidden rounded-[24px] border border-slate-200 bg-white">
      <div className="p-6">
        <h2 className="text-2xl font-semibold">Destination estimates</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-6 py-3">Destination</th>
              <th className="px-6 py-3">Total</th>
              <th className="px-6 py-3">Flights</th>
              <th className="px-6 py-3">Daily</th>
              <th className="px-6 py-3">Confidence</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {items.map((item) => (
              <tr key={item.destination.slug}>
                <td className="px-6 py-4 font-semibold">
                  <Link href={`/destinations/${item.destination.slug}/travel-budget`} className="text-[#0B1D34] hover:underline">
                    {getCityCountryLabel(item.destination)}
                  </Link>
                </td>
                <td className="px-6 py-4">{formatMoney(item.totalEstimate, "CAD")}</td>
                <td className="px-6 py-4">{formatMoney(item.flightEstimate, "CAD")}</td>
                <td className="px-6 py-4">{formatMoney(item.dailyEstimate, "CAD")}</td>
                <td className="px-6 py-4">{item.destination.dataConfidence}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function InfoSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-[24px] border border-slate-200 bg-white p-6">
      <h2 className="text-2xl font-semibold">{title}</h2>
      <div className="mt-3 text-sm leading-7 text-slate-600">{children}</div>
    </section>
  );
}

function FaqList({ faqs }: { faqs: { question: string; answer: string }[] }) {
  return (
    <div className="grid gap-4">
      {faqs.slice(0, 5).map((faq) => (
        <div key={faq.question} className="rounded-2xl bg-slate-50 p-4">
          <h3 className="font-semibold text-slate-950">{faq.question}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">{faq.answer}</p>
        </div>
      ))}
    </div>
  );
}

function RelatedLinks({
  title,
  links,
  currentPath,
}: {
  title: string;
  links: { href: string; label: string }[];
  currentPath: string;
}) {
  const visibleLinks = links.filter((link) => link.href !== currentPath).slice(0, 8);

  return (
    <section className="rounded-[24px] border border-slate-200 bg-white p-6">
      <h2 className="text-2xl font-semibold">{title}</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {visibleLinks.map((link) => (
          <Link key={link.href} href={link.href} className="rounded-xl bg-slate-50 p-4 font-semibold text-[#0B1D34] hover:underline">
            {link.label}
          </Link>
        ))}
      </div>
    </section>
  );
}

function formatTravelStyle(style: TravelStyle) {
  return style === "midRange" ? "Mid-range" : style.charAt(0).toUpperCase() + style.slice(1);
}
