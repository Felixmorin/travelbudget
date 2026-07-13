import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CalendarDays, Plane, WalletCards } from "lucide-react";

import { AnalyticsView } from "@/components/analytics/analytics-view";
import { TrackedLink } from "@/components/analytics/tracked-link";
import { EstimateDisclaimer } from "@/components/site/estimate-disclaimer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatMoney } from "@/lib/format-money";
import {
  getDepartureCityPage,
  getDepartureCityStaticParams,
  type DepartureCityPage,
} from "@/lib/programmatic/departure-pages";
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

type DeparturePageProps = {
  params: Promise<{ origin: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return getDepartureCityStaticParams();
}

export async function generateMetadata({ params }: DeparturePageProps): Promise<Metadata> {
  const { origin } = await params;
  const page = getDepartureCityPage(origin);

  if (!page) {
    return createMetadata({
      title: "Departure City Not Found",
      description: "This GoByBudget departure city page could not be found.",
      path: `/from/${origin}`,
      noIndex: true,
    });
  }

  const title = `Best Affordable Trips From ${page.origin.name}`;
  const description = `Compare affordable trips from ${page.origin.name} using airport-specific planning data, budget tiers, destination ideas, and clear flight estimate availability.`;

  return createMetadata({
    title,
    description,
    path: page.path,
    imageAlt: `${title} on GoByBudget`,
    noIndex: !page.isIndexable,
  });
}

export default async function DepartureCityRoute({ params }: DeparturePageProps) {
  const { origin } = await params;
  const page = getDepartureCityPage(origin);

  if (!page) {
    notFound();
  }

  const faqs = createFaqs(page);
  const jsonLd = [
    createCollectionPageSchema({
      name: `Best affordable trips from ${page.origin.name}`,
      description: `Budget-friendly trip ideas from ${page.origin.name} with airport and estimate notes.`,
      path: page.path,
    }),
    createItemListSchema(
      page.recommendations.map((item) => ({
        name: getCityCountryLabel(item.destination),
        url: `/destinations/${item.destination.slug}`,
        description: item.destination.shortDescription,
      }))
    ),
    createFAQSchema(faqs),
    createBreadcrumbSchema([
      { name: "Home", url: "/" },
      { name: `Trips from ${page.origin.name}`, url: page.path },
    ]),
  ];

  return (
    <main className="bg-[#f7f9fb] text-slate-950">
      <AnalyticsView
        eventName="budget_result_viewed"
        eventProperties={{
          page: page.path,
          source: "departure_city_page",
          originCode: page.origin.airportCodes[0],
          originCity: page.origin.name,
          currency: page.currency,
          days: page.tripLengthDays,
          tripLength: page.tripLengthDays,
          resultCount: page.recommendations.length,
          resultsCount: page.recommendations.length,
          travelStyle: page.travelStyle,
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
      />

      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_420px] lg:px-8 lg:py-20">
        <div>
          <nav aria-label="Breadcrumb" className="text-sm text-slate-500">
            <Link href="/" className="hover:text-[#0B1D34]">Home</Link>
            <span aria-hidden="true" className="mx-2">/</span>
            <span>Trips from {page.origin.name}</span>
          </nav>
          <Badge className="mt-8 rounded-full bg-[#14B8A6]/10 px-4 py-1 text-xs font-bold uppercase tracking-wider text-[#0B1D34]">
            Popular departure city
          </Badge>
          <h1 className="mt-5 max-w-4xl text-4xl font-bold leading-tight tracking-tight sm:text-6xl">
            Best Affordable Trips From {page.origin.name}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            Use {page.origin.name} as your real departure city, compare trips across multiple budget levels, and see which
            destinations have usable flight estimates before planning around a total price.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            <HeroPill icon={Plane} label={`Airports: ${page.origin.airportCodes.join(", ")}`} />
            <HeroPill icon={WalletCards} label={`Reference currency: ${page.currency}`} />
            <HeroPill icon={CalendarDays} label={`Updated ${page.origin.lastUpdated}`} />
          </div>
          {!page.isIndexable ? (
            <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
              This page is available for users but is set to noindex because: {page.noindexReasons.join("; ")}.
            </div>
          ) : null}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild className="h-12 rounded-full bg-[#0B1D34] px-6 text-white hover:bg-[#0B1D34]">
              <TrackedLink
                href={`/results?budget=3000&currency=${page.currency}&origin=${page.origin.airportCodes[0]}&days=10&travelers=1&style=balanced`}
                eventName="cta_clicked"
                eventProperties={{
                  page: page.path,
                  label: "Open calculator results",
                  href: "/results",
                  ctaLocation: "departure_city_hero",
                  originCode: page.origin.airportCodes[0],
                  originCity: page.origin.name,
                }}
              >
                Open calculator results
                <ArrowRight className="ml-2 size-4" />
              </TrackedLink>
            </Button>
            <Button asChild variant="outline" className="h-12 rounded-full bg-white px-6">
              <Link href="/travel-budget-calculator">Use the calculator</Link>
            </Button>
          </div>
        </div>

        <aside className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold">Departure data</h2>
          <dl className="mt-5 grid gap-4 text-sm">
            <Metric label="Country" value={page.origin.country} />
            <Metric label="Region" value={page.origin.region ?? "Not specified"} />
            <Metric label="Time zone" value={page.origin.timeZone} />
            <Metric label="Languages" value={page.origin.languages.join(", ")} />
            <Metric label="Flight data" value={page.origin.flightPricingStatus === "available" ? "Available" : "Unavailable"} />
          </dl>
        </aside>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
        <EstimateDisclaimer className="mb-8" />
        <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-[#0B1D34]">Recommended destinations</p>
            <h2 className="mt-2 text-3xl font-semibold">Where can you travel from {page.origin.name}?</h2>
          </div>
          <p className="max-w-xl text-sm leading-6 text-slate-600">
            Estimates include round-trip flights when available, accommodation, food, local transport, activities, and a buffer.
          </p>
        </div>

        {page.recommendations.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {page.recommendations.map((item) => (
              <Link
                key={item.destination.slug}
                href={`/destinations/${item.destination.slug}`}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-[#14B8A6]/50"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{item.suggestedTripLength}</p>
                <h3 className="mt-2 text-xl font-semibold">{getCityCountryLabel(item.destination)}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{item.destination.shortDescription}</p>
                <div className="mt-4 grid gap-2 text-sm">
                  <Metric label="Flight estimate" value={item.flightEstimate ? formatMoney(item.flightEstimate, "CAD") : "Unavailable"} />
                  <Metric label="Ground costs/day" value={formatMoney(item.dailyEstimate, "CAD")} />
                  <Metric label="10-day total" value={formatMoney(item.totalEstimate, "CAD")} />
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm leading-6 text-slate-600">
            Flight estimates are not available for {page.origin.name} yet, so GoByBudget is not showing destination prices for this origin.
          </div>
        )}
      </section>

      <section className="bg-white py-14">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_380px] lg:px-8">
          <div>
            <h2 className="text-3xl font-semibold">Budget levels from {page.origin.name}</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {page.budgets.map((budget) => (
                <Link key={budget} href={`/from/${page.origin.slug}/trips-under-${budget}`} className="rounded-2xl bg-slate-100 p-5 hover:bg-[#14B8A6]/10">
                  <p className="text-sm font-semibold text-slate-500">Budget page</p>
                  <p className="mt-1 text-xl font-bold">Trips under {formatMoney(budget, "CAD")}</p>
                </Link>
              ))}
            </div>
            <div className="mt-8 rounded-2xl bg-slate-100 p-5 text-sm leading-6 text-slate-700">
              These estimates are planning baselines, not live booking prices. Fares can change by date, airline,
              airport choice, baggage, booking window, and exchange rate. GoByBudget avoids showing a flight price when
              the current dataset does not support the selected departure city.
            </div>
          </div>
          <aside>
            <h2 className="text-2xl font-semibold">FAQ</h2>
            <div className="mt-5 grid gap-4">
              {faqs.map((faq) => (
                <div key={faq.question} className="rounded-2xl border border-slate-200 p-5">
                  <h3 className="font-semibold">{faq.question}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{faq.answer}</p>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

function createFaqs(page: DepartureCityPage): FAQItem[] {
  return [
    {
      question: `Which airports does GoByBudget use for ${page.origin.name}?`,
      answer: `This page uses ${page.origin.airportCodes.join(", ")} as the supported airport code set for ${page.origin.name}.`,
    },
    {
      question: `Are prices from ${page.origin.name} live fares?`,
      answer: "No. GoByBudget shows planning estimates where data is available, not live booking prices or guarantees.",
    },
    {
      question: `Why is this page noindex when flight data is unavailable?`,
      answer: "GoByBudget keeps weak origin pages out of search indexes until there are enough distinct recommendations and usable flight estimates.",
    },
  ];
}

function HeroPill({ icon: Icon, label }: { icon: React.ComponentType<{ className?: string }>; label: string }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700">
      <Icon className="size-4 text-[#0B1D34]" />
      {label}
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <dt className="text-slate-500">{label}</dt>
      <dd className="text-right font-semibold text-slate-950">{value}</dd>
    </div>
  );
}
