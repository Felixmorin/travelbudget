import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { EmailCaptureForm } from "@/components/analytics/email-capture-form";
import { AffiliateCTA } from "@/components/affiliate/AffiliateCTA";
import { AffiliateSection } from "@/components/affiliate/AffiliateSection";
import { EstimateDisclaimer } from "@/components/site/estimate-disclaimer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  getBudgetSeoEstimate,
  getDurationSeoPage,
  getDurationSeoStaticParams,
  getTravelBudgetPath,
  getTravelCostDurationPath,
  isIndexableDurationSeoPage,
} from "@/lib/programmatic/seo-pages";
import { buildAffiliateContextFromDestination } from "@/lib/affiliates/destinations";
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
    noIndex: !isIndexableDurationSeoPage(page.destination.slug, page.durationDays),
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
  const affiliateContext = buildAffiliateContextFromDestination(page.destination, {
    durationDays: page.durationDays,
    travelers: page.travelers,
    tripStyle: page.travelStyle,
    pageType: "travel_cost",
    placement: "travel_cost_sidebar",
  });
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

      <section className="mx-auto grid max-w-5xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:px-8">
        <div className="grid gap-6">
          <EstimateDisclaimer />
          <section className="rounded-[24px] border border-slate-200 bg-white p-6">
            <h2 className="text-2xl font-semibold">{page.durationDays}-day cost breakdown</h2>
            <dl className="mt-6 grid gap-4 sm:grid-cols-2">
              <Metric label="Flights" value={formatCad(estimate.costBreakdown.flights)} />
              <Metric label="Accommodation" value={formatCad(estimate.costBreakdown.accommodation)} />
              <Metric label="Meals" value={formatCad(estimate.costBreakdown.food)} />
              <Metric label="Local transport" value={formatCad(estimate.costBreakdown.localTransport)} />
              <Metric label="Activities" value={formatCad(estimate.costBreakdown.activities)} />
              <Metric label="Buffer" value={formatCad(estimate.costBreakdown.misc)} />
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
          <section className="rounded-[24px] border border-slate-200 bg-white p-6">
            <h2 className="text-2xl font-semibold">Best time to go for better prices</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              For {destinationLabel}, compare the destination&apos;s stronger planning months:{" "}
              {page.destination.bestMonths.join(", ")}. These months can offer better weather or value, but exact
              prices still depend on dates, seasonality, availability, comfort level, and departure airport.
            </p>
          </section>
          <section className="rounded-[24px] border border-slate-200 bg-white p-6">
            <h2 className="text-2xl font-semibold">How to lower the cost</h2>
            <ul className="mt-4 grid gap-3 text-sm leading-6 text-slate-600">
              <li>Move the trip outside peak school breaks, major holidays, and citywide event weeks.</li>
              <li>Choose accommodation near practical transit instead of paying for the most central blocks.</li>
              <li>Keep paid activities selective and balance them with parks, markets, self-guided walks, and casual meals.</li>
            </ul>
          </section>
          <section className="rounded-[24px] border border-slate-200 bg-white p-6">
            <h2 className="text-2xl font-semibold">Budget assumptions</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              This is a CAD planning estimate for one mid-range traveler using Montreal as the default flight
              baseline. It includes flights, accommodation, food, local transport, activities, and a buffer. It does
              not guarantee live prices, and the total varies by dates, season, availability, comfort level, airport
              choice, exchange rates, baggage, and travel style.
            </p>
          </section>
          <section className="rounded-[24px] border border-slate-200 bg-white p-6">
            <h2 className="text-2xl font-semibold">FAQ</h2>
            <div className="mt-5 grid gap-4">
              <FaqItem
                question={`Does this ${page.durationDays}-day ${destinationLabel} cost include flights?`}
                answer="Yes. The estimate includes round-trip flights plus accommodation, meals, local transport, activities, and a buffer."
              />
              <FaqItem
                question="Can I use this as a booking quote?"
                answer="No. It is a planning estimate in CAD. Always verify current flights, hotels, availability, and terms before booking."
              />
              <FaqItem
                question={`What changes a ${page.durationDays}-day estimate the most?`}
                answer="Flights, hotel location, season, trip dates, comfort level, paid activities, and exchange rates usually have the largest effect."
              />
            </div>
          </section>
        </div>
        <aside className="min-w-0 h-fit rounded-[24px] border border-slate-200 bg-white p-6">
          <h2 className="text-xl font-semibold">Related planning pages</h2>
          <div className="mt-5 grid min-w-0 gap-3">
            <Button asChild className="h-auto min-h-8 w-full min-w-0 whitespace-normal rounded-full bg-[#0B1D34] px-4 py-2 text-center leading-5 text-white hover:bg-[#0B1D34]">
              <AffiliateCTA category="flights" context={{ ...affiliateContext, placement: "trip_summary" }} variant="text" label="Find flights for this trip" />
            </Button>
            <AffiliateSection
              context={affiliateContext}
              categories={["hotels", "activities", "esim"]}
              limit={3}
              title="Check live trip costs"
            />
            <div className="min-w-0 rounded-2xl bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-950">Send me this trip budget</p>
              <div className="mt-3">
                <EmailCaptureForm
                  buttonLabel="Send budget"
                  inputLabel="Email address"
                  eventProperties={{
                    page: path,
                    source: "legacy_travel_cost_page",
                    destinationSlug: page.destination.slug,
                    destinationName: destinationLabel,
                    budget: estimate.totalEstimate,
                    currency: "CAD",
                    days: page.durationDays,
                    tripLength: page.durationDays,
                    travelers: page.travelers,
                    travelStyle: page.travelStyle,
                    ctaLocation: "travel_cost_sidebar",
                  }}
                />
              </div>
            </div>
            <Button asChild variant="outline" className="h-auto min-h-8 w-full min-w-0 whitespace-normal rounded-full bg-white px-4 py-2 text-center leading-5">
              <Link href={getTravelBudgetPath(page.destination.slug)}>Full travel budget</Link>
            </Button>
            <Button asChild variant="outline" className="h-auto min-h-8 w-full min-w-0 whitespace-normal rounded-full bg-white px-4 py-2 text-center leading-5">
              <Link href={`/destinations/${page.destination.slug}`}>Destination guide</Link>
            </Button>
            <Button asChild variant="outline" className="h-auto min-h-8 w-full min-w-0 whitespace-normal rounded-full bg-white px-4 py-2 text-center leading-5">
              <Link href="/methodology">Methodology</Link>
            </Button>
          </div>
        </aside>
      </section>
    </main>
  );
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <h3 className="font-semibold text-slate-950">{question}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{answer}</p>
    </div>
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
