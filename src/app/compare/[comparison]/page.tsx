import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowRight, CalendarDays, Plane, Trophy, WalletCards } from "lucide-react";

import { EstimateDisclaimer } from "@/components/site/estimate-disclaimer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  getComparisonItems,
  getComparisonPage,
  getComparisonPath,
  getComparisonSeoTitle,
  getComparisonStaticParams,
  getComparisonSummary,
} from "@/lib/programmatic/comparison-pages";
import { getTravelBudgetPath, getTravelCostDurationPath } from "@/lib/programmatic/seo-pages";
import { getStrongSeoDestinationBudgetPath } from "@/lib/programmatic/strong-seo-pages";
import { createMetadata } from "@/lib/seo/metadata";
import {
  createBreadcrumbSchema,
  createCollectionPageSchema,
  createFAQSchema,
  createItemListSchema,
  serializeJsonLd,
  type FAQItem,
} from "@/lib/seo/schema";
import { formatMoney } from "@/lib/format-money";

type ComparePageProps = {
  params: Promise<{ comparison: string }>;
};

export function generateStaticParams() {
  return getComparisonStaticParams();
}

export async function generateMetadata({ params }: ComparePageProps): Promise<Metadata> {
  const { comparison } = await params;
  const page = getComparisonPage(comparison);

  if (!page) {
    return createMetadata({
      title: "Comparison Not Found",
      description: "This GoByBudget.com comparison guide could not be found.",
      path: getComparisonPath(comparison),
      noIndex: true,
    });
  }

  return createMetadata({
    title: getComparisonSeoTitle(page),
    description: page.description,
    path: getComparisonPath(page),
  });
}

export default async function ComparisonPage({ params }: ComparePageProps) {
  const { comparison } = await params;
  const page = getComparisonPage(comparison);

  if (!page) {
    notFound();
  }

  const items = getComparisonItems(page);
  const path = getComparisonPath(page);
  const seoTitle = getComparisonSeoTitle(page);
  const summary = getComparisonSummary(page, items);
  const faqs = createComparisonFaqs(page);
  const jsonLd = [
    createCollectionPageSchema({
      name: page.title,
      description: page.description,
      path,
    }),
    createItemListSchema(
      items.map((item) => ({
        name: item.destination.name,
        url: `/destinations/${item.destination.slug}`,
        description: item.destination.shortDescription,
      }))
    ),
    createFAQSchema(faqs),
    createBreadcrumbSchema([
      { name: "Home", url: "/" },
      { name: "Compare", url: "/compare" },
      { name: page.title, url: path },
    ]),
  ];

  return (
    <main className="bg-[#f7f9fb] text-slate-950">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(jsonLd),
        }}
      />
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
          <Badge className="rounded-full bg-[#14B8A6]/10 px-4 py-1 text-[#0B1D34]">
            {page.searchIntent}
          </Badge>
          <h1 className="mt-5 max-w-4xl text-4xl font-semibold tracking-tight sm:text-6xl">
            {seoTitle}
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">{page.description}</p>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <HeroMetric icon={Plane} label="Origin" value={`${page.originCity} (${page.originCode})`} />
            <HeroMetric icon={CalendarDays} label="Trip length" value={`${page.durationDays} days`} />
            <HeroMetric icon={WalletCards} label="Style" value={formatTravelStyle(page.travelStyle)} />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <EstimateDisclaimer className="mb-8" />
        <div className="rounded-[24px] border border-slate-200 bg-white p-6">
          <div className="flex items-start gap-3">
            <Trophy className="mt-1 size-5 shrink-0 text-[#0B1D34]" />
            <div>
              <h2 className="text-2xl font-semibold">Quick answer</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">{summary}</p>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-5">
          {items.map((item) => (
            <article key={item.destination.slug} className="rounded-[24px] border border-slate-200 bg-white p-6">
              <div className="grid gap-6 lg:grid-cols-[1fr_220px] lg:items-start">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-2xl font-semibold">{item.destination.name}</h2>
                    <Badge className="bg-slate-100 text-slate-700">{item.destination.score}/100 destination score</Badge>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{item.destination.shortDescription}</p>
                  <p className="mt-3 text-xs leading-5 text-slate-500">
                    Destination score summarizes the current GoByBudget destination model using value, seasonality,
                    trip style fit, and available planning data. Use the cost estimate and category breakdown as the
                    primary budget decision.
                  </p>
                  <dl className="mt-5 grid gap-3 sm:grid-cols-3">
                    <Metric label="Total estimate" value={formatMoney(item.totalEstimate, "CAD")} />
                    <Metric label="Flights" value={formatMoney(item.flightEstimate, "CAD")} />
                    <Metric label="Daily cost" value={formatMoney(item.dailyEstimate, "CAD")} />
                  </dl>
                  <div className="mt-5 grid gap-3 text-sm leading-6 text-slate-600 sm:grid-cols-2">
                    <p>
                      <span className="font-semibold text-slate-950">Best for:</span> {item.bestFor}.
                    </p>
                    <p>
                      <span className="font-semibold text-slate-950">Tradeoff:</span> {item.tradeoff}
                    </p>
                  </div>
                </div>
                <div className="grid gap-3">
                  <Button asChild className="rounded-full bg-[#0B1D34] text-white hover:bg-[#0B1D34]">
                    <Link href={`/destinations/${item.destination.slug}`}>
                      Destination guide
                      <ArrowRight className="ml-2 size-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="rounded-full bg-white">
                    <Link href={getDestinationBudgetPlanningPath(item.destination.slug)}>Travel budget</Link>
                  </Button>
                  <Button asChild variant="outline" className="rounded-full bg-white">
                    <Link href={getTravelCostDurationPath(item.destination.slug, page.durationDays)}>
                      {page.durationDays}-day cost
                    </Link>
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <InternalLink href="/compare" label="Compare" title="All destination comparisons" />
          <InternalLink href="/destinations" label="Destinations" title="Browse city and country guides" />
          <InternalLink href="/tools/travel-budget-calculator" label="Tool" title="Build a custom trip budget" />
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
          <section className="rounded-[24px] border border-slate-200 bg-white p-6">
            <h2 className="text-2xl font-semibold">Budget assumptions</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              These are CAD planning estimates for one mid-range traveler. They include flights, accommodation,
              food, local transport, activities, and a buffer where destination data is available. Prices vary by
              travel dates, season, availability, comfort level, departure airport, exchange rates, and travel style.
            </p>
          </section>
          <aside className="rounded-[24px] border border-slate-200 bg-white p-6">
            <h2 className="text-xl font-semibold">Plan from this comparison</h2>
            <div className="mt-5 grid gap-3">
              <Button asChild className="rounded-full bg-[#0B1D34] text-white hover:bg-[#0B1D34]">
                <Link href="/tools/travel-budget-calculator">Check flights and hotels for this trip</Link>
              </Button>
              <Button asChild variant="outline" className="rounded-full bg-white">
                <Link href="/tools/travel-budget-calculator">Send me this trip budget</Link>
              </Button>
            </div>
          </aside>
        </div>

        <section className="mt-8 rounded-[24px] border border-slate-200 bg-white p-6">
          <h2 className="text-2xl font-semibold">FAQ</h2>
          <div className="mt-5 grid gap-4">
            {faqs.map((faq) => (
              <div key={faq.question} className="rounded-2xl bg-slate-50 p-4">
                <h3 className="font-semibold text-slate-950">{faq.question}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}

function HeroMetric({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <Icon className="mb-3 size-5 text-[#0B1D34]" />
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 font-semibold text-slate-950">{value}</p>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</dt>
      <dd className="mt-1 text-lg font-semibold text-slate-950">{value}</dd>
    </div>
  );
}

function InternalLink({ href, label, title }: { href: string; label: string; title: string }) {
  return (
    <Link href={href} className="rounded-xl bg-white p-4 transition-colors hover:bg-[#14B8A6]/10">
      <p className="text-xs font-semibold uppercase tracking-wide text-[#0B1D34]">{label}</p>
      <p className="mt-1 font-bold text-slate-950">{title}</p>
    </Link>
  );
}

function getDestinationBudgetPlanningPath(destinationSlug: string) {
  return getStrongSeoDestinationBudgetPath(destinationSlug) ?? getTravelBudgetPath(destinationSlug);
}

function formatTravelStyle(style: string) {
  return style === "midRange" ? "Mid-range" : style.charAt(0).toUpperCase() + style.slice(1);
}

function createComparisonFaqs(page: NonNullable<ReturnType<typeof getComparisonPage>>): FAQItem[] {
  return [
    {
      question: `Does this ${page.title.toLowerCase()} comparison include flights?`,
      answer:
        "Yes. The destination estimates include flight planning amounts plus daily costs such as accommodation, food, local transport, activities, and buffer where available.",
    },
    {
      question: "Are these live booking prices?",
      answer:
        "No. They are CAD planning estimates. Verify live flights, hotels, availability, baggage, and booking terms before making a purchase.",
    },
    {
      question: "How should I choose between the destinations?",
      answer:
        "Compare the total estimate, the flight share, daily cost pressure, best months, and whether the destination style matches the trip you actually want.",
    },
    {
      question: "What can change the final trip cost?",
      answer:
        "Dates, season, airport options, hotel comfort level, availability, exchange rates, activity choices, and travel style can all change the final total.",
    },
  ];
}
