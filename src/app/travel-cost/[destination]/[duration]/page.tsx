import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { EstimateDisclaimer } from "@/components/site/estimate-disclaimer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  getBudgetSeoEstimate,
  getDurationSeoPage,
  getDurationSeoStaticParams,
  getTravelBudgetPath,
  getTravelCostDurationPath,
} from "@/lib/programmatic/seo-pages";
import { getCityCountryLabel } from "@/lib/data/unified-destinations";
import { createMetadata } from "@/lib/seo/metadata";
import { createBreadcrumbSchema, createGuideArticleSchema, serializeJsonLd } from "@/lib/seo/schema";

type DurationCostPageProps = {
  params: Promise<{ destination: string; duration: string }>;
};

export function generateStaticParams() {
  return getDurationSeoStaticParams();
}

export async function generateMetadata({ params }: DurationCostPageProps): Promise<Metadata> {
  const { destination, duration } = await params;
  const page = getDurationSeoPage(destination, duration);

  if (!page) {
    return createMetadata({
      title: "Travel Cost Guide Not Found",
      description: "This GoByBudget.com duration cost guide could not be found.",
      path: `/travel-cost/${destination}/${duration}`,
      noIndex: true,
    });
  }

  const destinationLabel = getCityCountryLabel(page.destination);

  return createMetadata({
    title: `How Much Does ${destinationLabel} Cost for ${page.durationDays} Days?`,
    description: `Estimate how much it costs to travel to ${destinationLabel} for ${page.durationDays} days, including flights, stays, meals, local transport, activities, and assumptions.`,
    path: getTravelCostDurationPath(page.destination.slug, page.durationDays),
    image: page.destination.image,
    imageAlt: `${destinationLabel} ${page.durationDays}-day travel cost`,
    noIndex: true,
  });
}

export default async function DurationCostPage({ params }: DurationCostPageProps) {
  const { destination, duration } = await params;
  const page = getDurationSeoPage(destination, duration);

  if (!page) {
    notFound();
  }

  const destinationLabel = getCityCountryLabel(page.destination);
  const estimate = getBudgetSeoEstimate(page);
  const path = getTravelCostDurationPath(page.destination.slug, page.durationDays);
  const dailyTotal = Math.round((estimate.totalEstimate - estimate.costBreakdown.flights) / page.durationDays);
  const jsonLd = [
    createGuideArticleSchema({
      title: `How much does it cost to travel to ${destinationLabel} for ${page.durationDays} days?`,
      description: `A ${page.durationDays}-day cost estimate for ${destinationLabel}, including flights and daily trip costs.`,
      path,
      image: page.destination.image,
      datePublished: "2026-06-24",
      dateModified: page.destination.lastUpdated,
    }),
    createBreadcrumbSchema([
      { name: "Home", url: "/" },
      { name: `${destinationLabel} for ${page.durationDays} days`, url: path },
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
        <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
          <Badge className="rounded-full bg-[#14B8A6]/10 px-4 py-1 text-[#0B1D34]">Trip length estimate</Badge>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight sm:text-6xl">
            How much does it cost to travel to {destinationLabel} for {page.durationDays} days?
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
            A {page.durationDays}-day mid-range estimate from Montreal is {estimate.totalLabel}, or about{" "}
            {formatCad(dailyTotal)} per day after flights.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-5xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_320px] lg:px-8">
        <div className="grid gap-6">
          <EstimateDisclaimer />
          <section className="rounded-[24px] border border-slate-200 bg-white p-6">
            <h2 className="text-2xl font-semibold">{page.durationDays}-day cost breakdown</h2>
            <dl className="mt-6 grid gap-4 sm:grid-cols-2">
              <Metric label="Flights" value={formatCad(estimate.costBreakdown.flights)} />
              <Metric label="Accommodation" value={formatCad(estimate.costBreakdown.accommodation)} />
              <Metric label="Meals" value={formatCad(estimate.costBreakdown.food)} />
              <Metric label="Activities" value={formatCad(estimate.costBreakdown.activities)} />
            </dl>
          </section>
          <section className="rounded-[24px] border border-slate-200 bg-white p-6">
            <h2 className="text-2xl font-semibold">Is {page.durationDays} days enough?</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              For {destinationLabel}, {page.durationDays} days gives enough room to cover the core itinerary
              without spreading flight costs across too few nights. Travelers can reduce the estimate by shortening
              paid activities, choosing simpler stays, or moving outside peak travel weeks.
            </p>
          </section>
        </div>
        <aside className="h-fit rounded-[24px] border border-slate-200 bg-white p-6">
          <h2 className="text-xl font-semibold">Related planning pages</h2>
          <div className="mt-5 grid gap-3">
            <Button asChild className="rounded-full bg-[#0B1D34] text-white hover:bg-[#0B1D34]">
              <Link href={getTravelBudgetPath(page.destination.slug)}>Full travel budget</Link>
            </Button>
            <Button asChild variant="outline" className="rounded-full bg-white">
              <Link href={`/destinations/${page.destination.slug}`}>Destination guide</Link>
            </Button>
            <Button asChild variant="outline" className="rounded-full bg-white">
              <Link href="/methodology">Methodology</Link>
            </Button>
          </div>
        </aside>
      </section>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</dt>
      <dd className="mt-2 text-xl font-semibold text-slate-950">{value}</dd>
    </div>
  );
}

function formatCad(amount: number) {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    maximumFractionDigits: 0,
  }).format(amount);
}
