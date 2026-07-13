import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowRight, BedDouble, Bus, CalendarDays, CircleDollarSign, Plane, Utensils } from "lucide-react";

import { EmailCaptureForm } from "@/components/analytics/email-capture-form";
import { FlightAffiliateLink } from "@/components/affiliate/FlightAffiliateLink";
import { EstimateDisclaimer } from "@/components/site/estimate-disclaimer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  getBudgetSeoEstimate,
  getDestinationBudgetSeoPage,
  getDestinationBudgetSeoStaticParams,
  getTravelBudgetPath,
  getTravelCostDurationPath,
} from "@/lib/programmatic/seo-pages";
import { getDestinationIata } from "@/lib/affiliates/iata";
import { getCityCountryLabel } from "@/lib/data/unified-destinations";
import { createMetadata } from "@/lib/seo/metadata";
import { createBreadcrumbSchema, createGuideArticleSchema, serializeJsonLd } from "@/lib/seo/schema";

type TravelBudgetPageProps = {
  params: Promise<{ destination: string }>;
};

export function generateStaticParams() {
  return getDestinationBudgetSeoStaticParams();
}

export async function generateMetadata({ params }: TravelBudgetPageProps): Promise<Metadata> {
  const { destination: destinationSlug } = await params;
  const page = getDestinationBudgetSeoPage(destinationSlug);

  if (!page) {
    return createMetadata({
      title: "Travel Budget Guide Not Found",
      description: "This GoByBudget.com budget guide could not be found.",
      path: getTravelBudgetPath(destinationSlug),
      noIndex: true,
    });
  }

  const destinationLabel = getCityCountryLabel(page.destination);

  return createMetadata({
    title: `${destinationLabel} Travel Budget: Daily & Total Trip Cost`,
    description: `See a realistic ${page.durationDays}-day ${destinationLabel} travel budget from Canada, including daily costs, flights, accommodation, meals, local transport, activities, and planning limits.`,
    path: getTravelBudgetPath(page.destination.slug),
    image: page.destination.image,
    imageAlt: `${destinationLabel} travel budget`,
    noIndex: true,
  });
}

export default async function TravelBudgetPage({ params }: TravelBudgetPageProps) {
  const { destination: destinationSlug } = await params;
  const page = getDestinationBudgetSeoPage(destinationSlug);

  if (!page) {
    notFound();
  }

  const destinationLabel = getCityCountryLabel(page.destination);
  const estimate = getBudgetSeoEstimate(page);
  const path = getTravelBudgetPath(page.destination.slug);
  const jsonLd = [
    createGuideArticleSchema({
      title: `${destinationLabel} Travel Budget: Daily & Total Trip Cost`,
      description: `A practical ${page.durationDays}-day budget estimate for ${destinationLabel}, including major trip cost categories.`,
      path,
      image: page.destination.image,
      datePublished: "2026-06-24",
      dateModified: page.destination.lastUpdated,
    }),
    createBreadcrumbSchema([
      { name: "Home", url: "/" },
      { name: `${destinationLabel} travel budget`, url: path },
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
          <Badge className="rounded-full bg-[#14B8A6]/10 px-4 py-1 text-[#0B1D34]">Destination budget guide</Badge>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight sm:text-6xl">
            {destinationLabel} Travel Budget
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
            A practical {page.durationDays}-day planning estimate for {destinationLabel}, using Montreal
            flight baselines, mid-range daily costs, and one traveler.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <p className="text-4xl font-semibold text-[#0B1D34]">{estimate.totalLabel}</p>
            <span className="text-sm font-medium text-slate-500">estimated total in CAD</span>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-5xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_320px] lg:px-8">
        <div className="grid gap-6">
          <EstimateDisclaimer />
          <div className="grid gap-4 sm:grid-cols-2">
            <CostCard icon={Plane} title="Flights" amount={estimate.costBreakdown.flights} />
            <CostCard icon={BedDouble} title="Accommodation" amount={estimate.costBreakdown.accommodation} />
            <CostCard icon={Utensils} title="Meals" amount={estimate.costBreakdown.food} />
            <CostCard icon={Bus} title="Local transport" amount={estimate.costBreakdown.localTransport} />
            <CostCard icon={CalendarDays} title="Activities" amount={estimate.costBreakdown.activities} />
            <CostCard icon={CircleDollarSign} title="Buffer" amount={estimate.costBreakdown.misc} />
          </div>
          <section className="rounded-[24px] border border-slate-200 bg-white p-6">
            <h2 className="text-2xl font-semibold">How to use this {destinationLabel} budget</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Use this as a first-pass affordability check. The biggest swing factors are flight timing,
              neighborhood and hotel quality, activity choices, and whether you travel during one of the stronger
              months: {page.destination.bestMonths.join(", ")}.
            </p>
            <p className="mt-3 text-sm leading-6 text-slate-600">{page.destination.shortDescription}</p>
          </section>
          <section className="rounded-[24px] border border-slate-200 bg-white p-6">
            <h2 className="text-2xl font-semibold">Who this trip is best for</h2>
            <ul className="mt-4 grid gap-3 text-sm leading-6 text-slate-600">
              <li>Travelers comparing total trip cost instead of only airfare.</li>
              <li>One-week or 10-day planners who want flights, hotel, food, transport, activities, and buffer separated.</li>
              <li>Budget-conscious travelers who can adjust dates, neighborhood, and comfort level before booking.</li>
            </ul>
          </section>
          <section className="rounded-[24px] border border-slate-200 bg-white p-6">
            <h2 className="text-2xl font-semibold">How to lower the cost</h2>
            <ul className="mt-4 grid gap-3 text-sm leading-6 text-slate-600">
              <li>Compare several departure dates because airfare and hotel availability can move the total quickly.</li>
              <li>Stay near useful transit instead of paying only for the most central or most photographed area.</li>
              <li>Use casual meals, markets, self-guided walks, and selective paid activities to keep the daily budget steady.</li>
            </ul>
          </section>
          <section className="rounded-[24px] border border-slate-200 bg-white p-6">
            <h2 className="text-2xl font-semibold">Budget assumptions</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              This estimate is shown in CAD for one mid-range traveler using Montreal as the default departure
              baseline. It is a planning estimate, not a guarantee. Prices vary by travel dates, season,
              availability, comfort level, airport choice, exchange rates, baggage, and travel style.
            </p>
          </section>
          <section className="rounded-[24px] border border-slate-200 bg-white p-6">
            <h2 className="text-2xl font-semibold">FAQ</h2>
            <div className="mt-5 grid gap-4">
              <FaqItem
                question={`Does this ${destinationLabel} budget include flights?`}
                answer="Yes. The estimate includes flights, accommodation, meals, local transport, activities, and a buffer."
              />
              <FaqItem
                question="Are these live booking prices?"
                answer="No. These are CAD planning estimates. Check current flights and hotels before booking."
              />
              <FaqItem
                question="What changes the estimate the most?"
                answer="Flight timing, hotel location, comfort level, season, availability, and trip length usually move the total the most."
              />
            </div>
          </section>
        </div>
        <aside className="h-fit rounded-[24px] border border-slate-200 bg-white p-6">
          <h2 className="text-xl font-semibold">Plan the next step</h2>
          <div className="mt-5 grid gap-3">
            <Button asChild className="rounded-full bg-[#0B1D34] text-white hover:bg-[#0B1D34]">
              <FlightAffiliateLink
                origin="Montreal"
                originIata="YUL"
                destination={destinationLabel}
                destinationIata={getDestinationIata(page.destination)}
                adults={page.travelers}
                cabinClass="economy"
                placement="trip_summary"
                pageType="travel_budget"
              >
                Find flights for this trip
              </FlightAffiliateLink>
            </Button>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-950">Send me this trip budget</p>
              <div className="mt-3">
                <EmailCaptureForm
                  buttonLabel="Send budget"
                  inputLabel="Email address"
                  eventProperties={{
                    page: path,
                    source: "legacy_travel_budget_page",
                    destinationSlug: page.destination.slug,
                    destinationName: destinationLabel,
                    budget: estimate.totalEstimate,
                    currency: "CAD",
                    days: page.durationDays,
                    tripLength: page.durationDays,
                    travelers: page.travelers,
                    travelStyle: page.travelStyle,
                    ctaLocation: "travel_budget_sidebar",
                  }}
                />
              </div>
            </div>
            <Button asChild variant="outline" className="rounded-full bg-white">
              <Link href={`/destinations/${page.destination.slug}`}>Open destination guide</Link>
            </Button>
            <Button asChild variant="outline" className="rounded-full bg-white">
              <Link href={getTravelCostDurationPath(page.destination.slug, page.durationDays)}>
                Cost for {page.durationDays} days
              </Link>
            </Button>
            <Button asChild variant="outline" className="rounded-full bg-white">
              <Link href="/methodology">
                Budget methodology
                <ArrowRight className="ml-2 size-4" />
              </Link>
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

function CostCard({
  icon: Icon,
  title,
  amount,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  amount: number;
}) {
  return (
    <article className="rounded-[24px] border border-slate-200 bg-white p-6">
      <Icon className="size-6 text-[#0B1D34]" />
      <h2 className="mt-4 font-semibold">{title}</h2>
      <p className="mt-2 text-2xl font-semibold text-slate-950">
        {new Intl.NumberFormat("en-CA", {
          style: "currency",
          currency: "CAD",
          maximumFractionDigits: 0,
        }).format(amount)}
      </p>
    </article>
  );
}
