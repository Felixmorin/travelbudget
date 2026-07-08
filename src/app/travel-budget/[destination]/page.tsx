import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowRight, BedDouble, Bus, Plane, Utensils } from "lucide-react";

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
    title: `Travel Budget for ${destinationLabel}`,
    description: `See a realistic ${page.durationDays}-day ${destinationLabel} travel budget from Canada, including flights, accommodation, meals, local transport, activities, and planning limits.`,
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
      title: `Travel Budget for ${destinationLabel}`,
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
            Travel budget for {destinationLabel}
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
        </div>
        <aside className="h-fit rounded-[24px] border border-slate-200 bg-white p-6">
          <h2 className="text-xl font-semibold">Plan the next step</h2>
          <div className="mt-5 grid gap-3">
            <Button asChild className="rounded-full bg-[#0B1D34] text-white hover:bg-[#0B1D34]">
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
