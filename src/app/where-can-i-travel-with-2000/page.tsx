import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BadgeDollarSign,
  Calculator,
  CheckCircle2,
  Clock,
  MapPin,
  Plane,
  Search,
  Sparkles,
} from "lucide-react";

import { AnalyticsView } from "@/components/analytics/analytics-view";
import { TrackedLink } from "@/components/analytics/tracked-link";
import { BudgetComparisonTable } from "@/components/programmatic/BudgetComparisonTable";
import { BudgetDestinationCard } from "@/components/programmatic/BudgetDestinationCard";
import { ProgrammaticFAQ } from "@/components/programmatic/ProgrammaticSeoContent";
import { EstimateDisclaimer } from "@/components/site/estimate-disclaimer";
import { Button } from "@/components/ui/button";
import {
  getMatchingBudgetDestinations,
  getProgrammaticBudgetPage,
  getProgrammaticBudgetPath,
  type BudgetDestination,
} from "@/lib/programmatic/budget-pages";
import { formatMoney } from "@/lib/format-money";
import { formatList } from "@/lib/format-list";
import { getCityCountryLabel } from "@/lib/data/unified-destinations";
import { createMetadata } from "@/lib/seo/metadata";
import {
  createBreadcrumbSchema,
  createCollectionPageSchema,
  createFAQSchema,
  createItemListSchema,
  serializeJsonLd,
  type FAQItem,
} from "@/lib/seo/schema";

const path = "/where-can-i-travel-with-2000";
const budget = 2000;
const originSlug = "montreal";
const budgetSlug = "trips-under-2000";
const canonicalTitle = "Where Can I Travel With $2000?";
const description =
  "See realistic destinations under $2000 from Montreal with flights, stays, daily costs, trip length assumptions, and a direct trip budget calculator.";

export const metadata: Metadata = createMetadata({
  title: canonicalTitle,
  description,
  path,
  imageAlt: "Where can I travel with $2000 trip budget",
  socialDescription:
    "Compare destinations under $2000 with estimated flights, lodging, meals, transport, and activities.",
});

export default function WhereCanITravelWith2000Page() {
  const page = getProgrammaticBudgetPage(originSlug, budgetSlug);

  if (!page) {
    throw new Error("Expected Montreal trips-under-2000 page configuration to exist.");
  }

  const matches = getMatchingBudgetDestinations(page);
  const topMatches = matches.slice(0, 6);
  const cheapest = matches[0] ?? null;
  const bestValue = getBestValue(matches);
  const beachPick = findTravelStylePick(matches, ["Beach", "Coast"]);
  const culturePick = findTravelStylePick(matches, ["Culture", "Food"]);
  const faqs = createFaqs(matches);
  const jsonLd = [
    createCollectionPageSchema({
      name: canonicalTitle,
      description,
      path,
    }),
    createItemListSchema(
      topMatches.map((item) => ({
        name: getCityCountryLabel(item.destination),
        url: `/destinations/${item.destination.slug}`,
        description: item.destination.shortDescription,
      }))
    ),
    createFAQSchema(faqs),
    createBreadcrumbSchema([
      { name: "Home", url: "/" },
      { name: canonicalTitle, url: path },
    ]),
  ];

  return (
    <main className="bg-[#f7f9fb] text-slate-950">
      <AnalyticsView
        eventName="budget_result_viewed"
        eventProperties={{
          page: path,
          source: "where_can_i_travel_with_2000",
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(jsonLd),
        }}
      />

      <section className="border-b border-slate-200 bg-white px-4 py-14 sm:px-6 lg:px-8 lg:py-18">
        <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1fr_440px]">
          <div>
            <nav aria-label="Breadcrumb" className="mb-6 text-sm text-slate-500">
              <Link href="/" className="hover:text-[#0B1D34]">
                Home
              </Link>
              <span aria-hidden="true" className="mx-2">
                /
              </span>
              <span>Where can I travel with $2000?</span>
            </nav>
            <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#14B8A6]/10 px-4 py-2 text-sm font-bold text-[#0B1D34]">
              <Sparkles className="size-4" />
              $2,000 CAD trip ideas from Montreal
            </p>
            <h1 className="max-w-4xl text-4xl font-extrabold tracking-normal text-slate-950 sm:text-5xl lg:text-6xl">
              Where can I travel with $2000?
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              Use a $2,000 total trip budget to compare destinations that can work from Montreal. Estimates include
              round-trip flights, accommodation, meals, local transport, activities, and a planning buffer.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="rounded-full bg-[#0B1D34] px-7 text-white hover:bg-[#0B1D34]">
                <TrackedLink
                  href="/results?budget=2000&currency=CAD&origin=YUL&days=7&month=october&travelers=1&style=budget"
                  eventName="cta_clicked"
                  eventProperties={{
                    page: path,
                    source: "where_can_i_travel_hero",
                    label: "Find my $2000 trip",
                    href: "/results?budget=2000&currency=CAD&origin=YUL&days=7&month=october&travelers=1&style=budget",
                    ctaLocation: "hero",
                  }}
                >
                  Find my $2000 trip
                  <ArrowRight className="ml-2 size-4" />
                </TrackedLink>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full border-slate-300 bg-white px-7 text-slate-700 hover:bg-slate-50">
                <TrackedLink
                  href="#destinations"
                  eventName="cta_clicked"
                  eventProperties={{
                    page: path,
                    source: "where_can_i_travel_hero",
                    label: "See destinations",
                    href: "#destinations",
                    ctaLocation: "hero",
                  }}
                >
                  See destinations
                </TrackedLink>
              </Button>
            </div>
          </div>

          <aside className="rounded-[28px] border border-slate-200 bg-[#f7f9fb] p-6 shadow-xl shadow-slate-200/70">
            <p className="text-sm font-bold uppercase tracking-wide text-slate-500">Best starting point</p>
            <div className="mt-5 space-y-4">
              <SnapshotMetric icon={BadgeDollarSign} label="Budget" value={formatMoney(budget, "CAD")} />
              <SnapshotMetric icon={MapPin} label="Departure" value="Montreal (YUL)" />
              <SnapshotMetric icon={Clock} label="Trip length" value="5-7 days" />
              <SnapshotMetric icon={Plane} label="Matches found" value={String(matches.length)} />
            </div>
            {cheapest ? (
              <div className="mt-6 rounded-2xl bg-white p-5">
                <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Lowest listed estimate</p>
                <p className="mt-2 text-xl font-bold text-slate-950">{getCityCountryLabel(cheapest.destination)}</p>
                <p className="mt-1 text-3xl font-extrabold text-[#0B1D34]">
                  {formatMoney(cheapest.totalEstimate, page.currency)}
                </p>
              </div>
            ) : null}
          </aside>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-white px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-3">
          <IntentCard
            icon={Search}
            title="Vacation under $2000"
            body="Start from a full trip total, not only a flight or hotel price."
          />
          <IntentCard
            icon={Calculator}
            title="Trip under $2000"
            body="Compare the total estimate against your budget before you shortlist."
          />
          <IntentCard
            icon={CheckCircle2}
            title="Destinations under $2000"
            body="See which options leave room and which ones sit closer to the limit."
          />
        </div>
      </section>

      <section id="destinations" className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-[#0B1D34]">Recommended shortlist</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
              Destinations under $2000 from Montreal
            </h2>
          </div>
          <p className="max-w-2xl text-sm leading-6 text-slate-600">
            These estimates use YUL flight assumptions, one traveler, budget travel style, and a 7-day planning
            window. Prices are planning estimates, not live fares.
          </p>
        </div>

        <EstimateDisclaimer className="mb-8" />

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {topMatches.map((item) => (
            <BudgetDestinationCard key={item.destination.slug} item={item} page={page} />
          ))}
        </div>
      </section>

      <section className="bg-white px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-8 text-3xl font-semibold tracking-tight text-slate-950">
            Compare $2000 trip options
          </h2>
          <BudgetComparisonTable items={topMatches} page={page} />
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_380px] lg:px-8">
        <div className="rounded-[24px] border border-slate-200 bg-white p-7">
          <h2 className="text-3xl font-semibold tracking-tight text-slate-950">
            How to choose where to travel with $2000
          </h2>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <DecisionCard
              title="Pick cheapest if dates matter most"
              body={
                cheapest
                  ? `${getCityCountryLabel(cheapest.destination)} currently gives the most budget room in this set.`
                  : "Choose the lowest total estimate when your dates are fixed."
              }
            />
            <DecisionCard
              title="Pick best value if experience matters"
              body={
                bestValue
                  ? `${getCityCountryLabel(bestValue.destination)} balances destination score and total estimated cost.`
                  : "Look for a strong destination score relative to the total estimate."
              }
            />
            <DecisionCard
              title="Pick beach or culture by trip mood"
              body={[
                beachPick ? `Beach: ${getCityCountryLabel(beachPick.destination)}.` : null,
                culturePick ? `Culture: ${getCityCountryLabel(culturePick.destination)}.` : null,
              ]
                .filter(Boolean)
                .join(" ")}
            />
            <DecisionCard
              title="Use the calculator before booking"
              body="Change travelers, days, month, and travel style to see whether the $2000 budget still works."
            />
          </div>
        </div>

        <aside className="rounded-[24px] border border-slate-200 bg-white p-7">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-950">Common Questions</h2>
          <div className="mt-6">
            <ProgrammaticFAQ faqs={faqs} />
          </div>
        </aside>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="rounded-[28px] bg-slate-950 p-8 text-center text-white sm:p-12">
          <h2 className="mx-auto max-w-3xl text-3xl font-bold tracking-tight sm:text-5xl">
            Turn $2000 into a realistic shortlist
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-white/80">
            Run the calculator with your real dates, travelers, and comfort level before you compare booking options.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild size="lg" className="rounded-full bg-white px-8 text-[#0B1D34] hover:bg-white/90">
              <TrackedLink
                href="/travel-budget-calculator"
                eventName="cta_clicked"
                eventProperties={{
                  page: path,
                  source: "where_can_i_travel_bottom",
                  label: "Open calculator",
                  href: "/travel-budget-calculator",
                  ctaLocation: "bottom",
                }}
              >
                Open calculator
              </TrackedLink>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full border-white/25 bg-white/10 px-8 text-white hover:bg-white/20">
              <TrackedLink
                href={getProgrammaticBudgetPath(page)}
                eventName="cta_clicked"
                eventProperties={{
                  page: path,
                  source: "where_can_i_travel_bottom",
                  label: "View Montreal under $2000",
                  href: getProgrammaticBudgetPath(page),
                  ctaLocation: "bottom",
                }}
              >
                View Montreal under $2000
              </TrackedLink>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}

function SnapshotMetric({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl bg-white p-4">
      <div className="flex items-center gap-3">
        <span className="flex size-10 items-center justify-center rounded-xl bg-[#14B8A6]/10 text-[#0B1D34]">
          <Icon className="size-5" />
        </span>
        <span className="text-sm font-semibold text-slate-500">{label}</span>
      </div>
      <span className="font-bold text-slate-950">{value}</span>
    </div>
  );
}

function IntentCard({
  icon: Icon,
  title,
  body,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  body: string;
}) {
  return (
    <article className="flex gap-4 rounded-xl border border-slate-200 bg-[#f7f9fb] p-5">
      <Icon className="mt-1 size-6 shrink-0 text-[#0B1D34]" />
      <div>
        <h2 className="font-semibold text-slate-950">{title}</h2>
        <p className="mt-1 text-sm leading-6 text-slate-600">{body}</p>
      </div>
    </article>
  );
}

function DecisionCard({ title, body }: { title: string; body: string }) {
  return (
    <article className="rounded-xl bg-[#f7f9fb] p-5">
      <h3 className="font-semibold text-slate-950">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{body}</p>
    </article>
  );
}

function createFaqs(matches: BudgetDestination[]): FAQItem[] {
  const topNames = matches.slice(0, 5).map((item) => getCityCountryLabel(item.destination));
  const cheapest = matches[0] ?? null;

  return [
    {
      question: "Where can I travel with $2000 from Montreal?",
      answer:
        topNames.length > 0
          ? `${formatList(topNames)} are current GoByBudget matches for a $2,000 CAD trip from Montreal.`
          : "No current destination matches fit the $2,000 CAD Montreal planning model.",
    },
    {
      question: "Does a vacation under $2000 include flights?",
      answer:
        "Yes. This page treats $2,000 CAD as a total trip budget, including estimated round-trip flights, stays, meals, local transport, activities, and a buffer.",
    },
    {
      question: "What is the cheapest trip under $2000 in this list?",
      answer: cheapest
        ? `${getCityCountryLabel(cheapest.destination)} is the lowest listed estimate at about ${formatMoney(
            cheapest.totalEstimate,
            "CAD"
          )}.`
        : "The cheapest match depends on current destination data and your exact trip settings.",
    },
    {
      question: "Can I change the departure city or travel style?",
      answer:
        "Yes. Use the travel budget calculator to change departure city, days, month, travelers, and travel style for a more specific shortlist.",
    },
  ];
}

function getBestValue(matches: BudgetDestination[]) {
  return matches.length > 0
    ? [...matches].sort(
        (a, b) => b.destination.score / b.totalEstimate - a.destination.score / a.totalEstimate
      )[0]
    : null;
}

function findTravelStylePick(matches: BudgetDestination[], styles: string[]) {
  return matches.find((match) =>
    match.destination.travelStyles.some((travelStyle) =>
      styles.some((style) => travelStyle.toLowerCase() === style.toLowerCase())
    )
  );
}
