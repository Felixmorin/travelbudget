import Link from "next/link";
import {
  ArrowRight,
  BedDouble,
  Bus,
  CalendarDays,
  Plane,
  Utensils,
  WalletCards,
} from "lucide-react";

import { BudgetComparisonTable } from "@/components/programmatic/BudgetComparisonTable";
import { BudgetDestinationCard } from "@/components/programmatic/BudgetDestinationCard";
import {
  ProgrammaticFAQ,
  ProgrammaticSeoContent,
  ProgrammaticSeoHighlights,
} from "@/components/programmatic/ProgrammaticSeoContent";
import { AnalyticsView } from "@/components/analytics/analytics-view";
import { EmailCapture } from "@/components/leads/email-capture";
import { TrackedLink } from "@/components/analytics/tracked-link";
import { EstimateDisclaimer } from "@/components/site/estimate-disclaimer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatMoney } from "@/lib/format-money";
import {
  type BudgetDestination,
  type ProgrammaticBudgetPageConfig,
  activeProgrammaticOrigins,
  getProgrammaticBudgetPath,
  programmaticBudgetPages,
} from "@/lib/programmatic/budget-pages";
import { getTravelBudgetPath, getTravelCostDurationPath } from "@/lib/programmatic/seo-pages";
import type { FAQItem } from "@/lib/seo/schema";

export function ProgrammaticBudgetPage({
  page,
  matches,
  faqs,
}: {
  page: ProgrammaticBudgetPageConfig;
  matches: BudgetDestination[];
  faqs: FAQItem[];
}) {
  const budgetLabel = formatMoney(page.budget, page.currency);
  const snapshotDestination = matches[0] ?? null;
  const filterLabels = ["Best value", "Beach", "City", "Food", "Culture", "Warm weather", "Family", "Backpacker"];
  const relatedPages = programmaticBudgetPages
    .filter((relatedPage) => getProgrammaticBudgetPath(relatedPage) !== getProgrammaticBudgetPath(page))
    .sort((a, b) => Number(a.budget !== page.budget) - Number(b.budget !== page.budget))
    .slice(0, 3);
  const relatedOrigins = activeProgrammaticOrigins.filter((origin) => origin.slug !== page.origin.slug).slice(0, 4);
  const travelStyleLabel = formatTravelStyleLabel(page.travelStyle);

  return (
    <main className="overflow-x-hidden bg-[#f7f9fb] text-slate-950">
      <AnalyticsView
        eventName="budget_result_viewed"
        eventProperties={{
          page: getProgrammaticBudgetPath(page),
          source: "programmatic_budget_page",
          originCode: page.origin.code,
          originCity: page.origin.city,
          budget: page.budget,
          currency: page.currency,
          days: page.tripLengthDays,
          tripLength: page.tripLengthDays,
          travelers: 1,
          travelStyle: page.travelStyle,
          resultCount: matches.length,
          resultsCount: matches.length,
        }}
      />
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_520px]">
          <div className="space-y-6">
            <nav aria-label="Breadcrumb" className="text-sm text-slate-500">
              <Link href="/" className="hover:text-blue-700">
                Home
              </Link>
              <span aria-hidden="true" className="mx-2">
                /
              </span>
              <span>Best trips from {page.origin.city} under {budgetLabel}</span>
            </nav>

            <Badge className="rounded-full bg-blue-100 px-4 py-1 text-xs font-bold uppercase tracking-wider text-blue-950">
              From {page.origin.city}
            </Badge>
            <div>
              <h1 className="max-w-4xl text-4xl font-bold leading-tight tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
                Best destinations from {page.origin.city}{" "}
                <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
                  under {budgetLabel}
                </span>
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
                Uncover realistic trips from {page.origin.city} with flight estimates, daily costs, and
                practical {travelStyleLabel.toLowerCase()} budget breakdowns based on the current TravelBudget.ai destination data.
              </p>
            </div>

            <div className="flex flex-wrap gap-2 py-2">
              <HeroPill icon={WalletCards} label={`${budgetLabel} CAD Budget`} />
              <HeroPill icon={Plane} label={`Origin: ${page.origin.code}`} />
              <HeroPill icon={CalendarDays} label={page.suggestedTripLength} />
            </div>

            <div className="flex flex-col gap-3 pt-2 sm:flex-row">
              <Button asChild size="lg" className="rounded-full bg-blue-600 px-8 text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700">
                <TrackedLink
                  href="#destinations"
                  eventName="cta_clicked"
                  eventProperties={{
                    page: getProgrammaticBudgetPath(page),
                    source: "programmatic_budget_hero",
                    originCode: page.origin.code,
                    originCity: page.origin.city,
                    budget: page.budget,
                    currency: page.currency,
                    days: page.tripLengthDays,
                    tripLength: page.tripLengthDays,
                    travelers: 1,
                    travelStyle: page.travelStyle,
                    label: "Find my trip",
                    href: "#destinations",
                    ctaLocation: "programmatic_hero",
                  }}
                >
                  Find my trip
                  <ArrowRight className="ml-2 size-4" />
                </TrackedLink>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full border-slate-300 bg-white px-8 text-slate-700 hover:bg-slate-100">
                <TrackedLink
                  href="#compare"
                  eventName="cta_clicked"
                  eventProperties={{
                    page: getProgrammaticBudgetPath(page),
                    source: "programmatic_budget_hero",
                    originCode: page.origin.code,
                    originCity: page.origin.city,
                    budget: page.budget,
                    currency: page.currency,
                    days: page.tripLengthDays,
                    tripLength: page.tripLengthDays,
                    travelers: 1,
                    travelStyle: page.travelStyle,
                    label: "Compare destinations",
                    href: "#compare",
                    ctaLocation: "programmatic_hero",
                  }}
                >
                  Compare destinations
                </TrackedLink>
              </Button>
            </div>
          </div>

          <BudgetSnapshot page={page} item={snapshotDestination} />
        </div>
      </section>

      <div className="sticky top-16 z-30 border-y border-slate-200/70 bg-[#f7f9fb]/95 py-4 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 overflow-x-auto pb-1">
            <span className="shrink-0 text-sm font-medium text-slate-500">Filter by:</span>
            {filterLabels.map((label, index) => (
              <button
                key={label}
                type="button"
                className={
                  index === 0
                    ? "shrink-0 rounded-full bg-blue-600 px-6 py-2 text-sm font-semibold text-white"
                    : "shrink-0 rounded-full border border-slate-200 bg-white px-6 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-100"
                }
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <section id="destinations" className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <SummaryMetric label="Origin" value={`${page.origin.city} (${page.origin.code})`} />
          <SummaryMetric label="Budget" value={budgetLabel} />
          <SummaryMetric label="Currency" value={page.currency} />
          <SummaryMetric label="Matching destinations" value={matches.length.toString()} />
        </div>

        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">Recommended for you</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
              Destinations from {page.origin.city} under {budgetLabel}
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-6 text-slate-600">
            Estimates use {page.origin.code} flight pricing when available, {travelStyleLabel.toLowerCase()} daily costs, one
            traveler, and a {page.tripLengthDays}-day trip. Prices are planning estimates, not live fares.
          </p>
        </div>

        <EstimateDisclaimer className="mb-8" />

        {matches.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {matches.map((item) => (
              <BudgetDestinationCard key={item.destination.slug} item={item} page={page} />
            ))}
          </div>
        ) : (
          <div className="rounded-[24px] border border-slate-200 bg-white p-6 text-sm leading-6 text-slate-600">
            No destinations currently fit this budget with the available pricing data. Try a higher budget or a
            shorter trip length.
          </div>
        )}

        <EmailCapture
          budget={snapshotDestination?.totalEstimate ?? page.budget}
          destination={snapshotDestination?.destination.name}
          duration={page.tripLengthDays}
          intent="trip_budget"
          origin={`${page.origin.city} (${page.origin.code})`}
          source="programmatic_budget_destinations"
          variant="inline"
          className="mt-8"
        />
      </section>

      <section id="compare" className="bg-white py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-8 text-3xl font-semibold tracking-tight text-slate-950">Compare Top Destinations</h2>
          <BudgetComparisonTable items={matches} page={page} />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-slate-950">
            What does a {budgetLabel} trip from {page.origin.city} include?
          </h2>
          <p className="mt-2 text-lg text-slate-600">A realistic look at your purchasing power abroad.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <IncludedCard
            icon={Plane}
            title="Flights"
            body={`Round-trip flight estimates from ${page.origin.code}, using destination origin pricing when available.`}
            iconClassName="bg-blue-100 text-blue-700"
          />
          <IncludedCard
            icon={BedDouble}
            title="Accommodation"
            body="Mid-range daily accommodation costs multiplied by the trip length used for this page."
            iconClassName="bg-teal-100 text-teal-700"
          />
          <IncludedCard
            icon={Utensils}
            title="Food"
            body="Daily meal estimates for a practical mid-range trip, not luxury dining or bare-minimum spending."
            iconClassName="bg-orange-100 text-orange-700"
          />
          <IncludedCard
            icon={Bus}
            title="Local Transport"
            body="Transit, local movement, and practical ground transport estimates based on destination daily costs."
            iconClassName="bg-slate-200 text-slate-700"
          />
        </div>
      </section>

      <section className="bg-slate-100 py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ProgrammaticSeoHighlights originCity={page.origin.city} budgetLabel={budgetLabel} />
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_380px] lg:px-8">
        <ProgrammaticSeoContent
          originCity={page.origin.city}
          originCode={page.origin.code}
          budgetLabel={budgetLabel}
          budgetAmount={page.budget}
          tripLengthDays={page.tripLengthDays}
          cheapestDestinationName={snapshotDestination?.destination.name ?? null}
          matchingDestinationNames={matches.map((item) => item.destination.name)}
          travelStyleLabel={travelStyleLabel}
        />
        <aside>
          <div className="lg:sticky lg:top-28">
            <h2 className="text-center text-3xl font-semibold tracking-tight text-slate-950 lg:text-left">
              Common Questions
            </h2>
            <div className="mt-6">
              <ProgrammaticFAQ faqs={faqs} />
            </div>
          </div>
        </aside>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
        <h2 className="mb-6 text-xl font-semibold text-slate-950">Explore more budget trips</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {relatedPages.map((relatedPage) => (
            <Link
              key={getProgrammaticBudgetPath(relatedPage)}
              href={getProgrammaticBudgetPath(relatedPage)}
              className="rounded-xl bg-slate-100 p-4 transition-colors hover:bg-blue-100"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                From {relatedPage.origin.city}
              </p>
              <p className="mt-1 font-bold text-slate-950">
                Under {formatMoney(relatedPage.budget, relatedPage.currency)} CAD
              </p>
            </Link>
          ))}
          <Link href="/tools/travel-budget-calculator" className="rounded-xl bg-slate-100 p-4 transition-colors hover:bg-blue-100">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Tool</p>
            <p className="mt-1 font-bold text-slate-950">Custom budget</p>
          </Link>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <InternalLink href="/results" label="Results" title="Compare live budget results" />
          <InternalLink href="/destinations" label="Destinations" title="Browse destination budget guides" />
          <InternalLink href="/methodology" label="Methodology" title="How estimates are calculated" />
        </div>
        <div className="mt-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Other origins</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {relatedOrigins.map((origin) => {
              const relatedOriginPage = programmaticBudgetPages.find(
                (relatedPage) => relatedPage.origin.slug === origin.slug && relatedPage.budget === page.budget
              );

              return relatedOriginPage ? (
                <Link
                  key={origin.slug}
                  href={getProgrammaticBudgetPath(relatedOriginPage)}
                  className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:border-blue-200 hover:text-blue-700"
                >
                  From {origin.city}
                </Link>
              ) : null;
            })}
          </div>
        </div>
        <div className="mt-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Destination deep dives</p>
          <div className="mt-3 grid gap-4 md:grid-cols-3">
            {matches.slice(0, 3).map((item) => (
              <div key={item.destination.slug} className="rounded-xl bg-white p-4">
                <p className="font-bold text-slate-950">{item.destination.name}</p>
                <div className="mt-3 grid gap-2 text-sm font-semibold text-blue-700">
                  <Link href={getTravelBudgetPath(item.destination.slug)} className="hover:underline">
                    Full travel budget
                  </Link>
                  <Link
                    href={getTravelCostDurationPath(item.destination.slug, page.tripLengthDays)}
                    className="hover:underline"
                  >
                    {page.tripLengthDays}-day cost estimate
                  </Link>
                  <Link href={`/destinations/${item.destination.slug}`} className="hover:underline">
                    Destination guide
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[40px] bg-slate-950 p-8 text-center sm:p-12">
          <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-blue-600/25 blur-[100px]" />
          <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-violet-600/25 blur-[100px]" />
          <div className="relative z-10 mx-auto max-w-2xl">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-5xl">
              Plan your trip from {page.origin.city} with confidence
            </h2>
            <p className="mt-4 text-lg leading-8 text-blue-100">
              Stop guessing and compare realistic destination costs before you book.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Button asChild size="lg" className="rounded-full bg-blue-600 px-8 text-white hover:bg-blue-700">
                <TrackedLink
                  href="/tools/travel-budget-calculator"
                  eventName="cta_clicked"
                  eventProperties={{
                    page: getProgrammaticBudgetPath(page),
                    source: "programmatic_budget_bottom",
                    originCode: page.origin.code,
                    originCity: page.origin.city,
                    budget: page.budget,
                    currency: page.currency,
                    days: page.tripLengthDays,
                    tripLength: page.tripLengthDays,
                    travelers: 1,
                    travelStyle: page.travelStyle,
                    label: "Start planning now",
                    href: "/tools/travel-budget-calculator",
                    ctaLocation: "programmatic_bottom_cta",
                  }}
                >
                  Start planning now
                </TrackedLink>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full border-white/20 bg-white/10 px-8 text-white hover:bg-white/20">
                <TrackedLink
                  href="/results"
                  eventName="cta_clicked"
                  eventProperties={{
                    page: getProgrammaticBudgetPath(page),
                    source: "programmatic_budget_bottom",
                    originCode: page.origin.code,
                    originCity: page.origin.city,
                    budget: page.budget,
                    currency: page.currency,
                    days: page.tripLengthDays,
                    tripLength: page.tripLengthDays,
                    travelers: 1,
                    travelStyle: page.travelStyle,
                    label: "Compare all destinations",
                    href: "/results",
                    ctaLocation: "programmatic_bottom_cta",
                  }}
                >
                  Compare all destinations
                </TrackedLink>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function formatTravelStyleLabel(style: ProgrammaticBudgetPageConfig["travelStyle"]) {
  if (style === "midRange") {
    return "Mid-range";
  }

  return style.charAt(0).toUpperCase() + style.slice(1);
}

function HeroPill({
  icon: Icon,
  label,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2">
      <Icon className="size-5 text-blue-700" />
      <span className="text-sm font-medium text-slate-600">{label}</span>
    </div>
  );
}

function BudgetSnapshot({
  page,
  item,
}: {
  page: ProgrammaticBudgetPageConfig;
  item: BudgetDestination | null;
}) {
  const legend = item
    ? [
        { label: "Flights", value: item.costBreakdown.flights, color: "#004ac6" },
        { label: "Hotels", value: item.costBreakdown.accommodation, color: "#7c3aed" },
        { label: "Food", value: item.costBreakdown.food, color: "#f97316" },
        { label: "Transport", value: item.costBreakdown.localTransport, color: "#14b8a6" },
      ]
    : [];
  const total = legend.reduce((sum, entry) => sum + entry.value, 0);

  return (
    <div className="relative">
      <div className="absolute -right-10 -top-10 h-64 w-64 rounded-full bg-blue-100/70 blur-[90px]" />
      <div className="absolute -bottom-10 -left-10 h-64 w-64 rounded-full bg-violet-100/80 blur-[90px]" />
      <div className="relative z-10 rounded-[32px] border border-white/70 bg-white/75 p-6 shadow-2xl shadow-slate-200/70 backdrop-blur">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-950">Budget Snapshot</h2>
            <p className="mt-1 text-sm text-slate-500">
              {item ? `${item.destination.name} matching estimate` : "Estimated trip total"}
            </p>
          </div>
          <p className="text-right text-3xl font-bold text-blue-700">
            {item ? formatMoney(item.totalEstimate, page.currency) : formatMoney(page.budget, page.currency)}
            <span className="block text-sm font-normal text-slate-500">CAD</span>
          </p>
        </div>

        <div className="flex flex-col items-center gap-8 md:flex-row">
          <div className="relative size-48 shrink-0">
            <svg className="size-full -rotate-90" viewBox="0 0 100 100" aria-hidden="true">
              <circle cx="50" cy="50" r="40" fill="transparent" stroke="#e2e8f0" strokeWidth="12" />
              {legend.map((entry, index) => {
                const circumference = 251.2;
                const previous = legend.slice(0, index).reduce((sum, item) => sum + item.value, 0);
                const ratio = total > 0 ? entry.value / total : 0;
                const offset = circumference - ratio * circumference;
                const rotation = total > 0 ? (previous / total) * 360 : 0;

                return (
                  <circle
                    key={entry.label}
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    stroke={entry.color}
                    strokeWidth="12"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    style={{ transform: `rotate(${rotation}deg)`, transformOrigin: "50% 50%" }}
                  />
                );
              })}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xl font-bold text-slate-950">{page.origin.code}</span>
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Launch</span>
            </div>
          </div>

          <div className="w-full space-y-4">
            {legend.map((entry) => (
              <div key={entry.label} className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="size-3 rounded-full" style={{ backgroundColor: entry.color }} />
                  <span className="text-sm font-medium text-slate-700">{entry.label}</span>
                </div>
                <span className="text-sm font-semibold text-slate-950">{formatMoney(entry.value, page.currency)}</span>
              </div>
            ))}
            {!item ? (
              <p className="text-sm leading-6 text-slate-600">
                Matching destination data will populate this snapshot as pages are added.
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

function IncludedCard({
  icon: Icon,
  title,
  body,
  iconClassName,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  body: string;
  iconClassName: string;
}) {
  return (
    <div className="rounded-[24px] border border-slate-200/80 bg-white p-6 text-center">
      <div className={`mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl ${iconClassName}`}>
        <Icon className="size-7" />
      </div>
      <h3 className="text-xl font-semibold text-slate-950">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{body}</p>
    </div>
  );
}

function SummaryMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-2 text-lg font-semibold text-slate-950">{value}</p>
    </div>
  );
}

function InternalLink({ href, label, title }: { href: string; label: string; title: string }) {
  return (
    <Link href={href} className="rounded-xl bg-white p-4 transition-colors hover:bg-blue-50">
      <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">{label}</p>
      <p className="mt-1 font-bold text-slate-950">{title}</p>
    </Link>
  );
}
