import Link from "next/link";
import { CalendarDays, Info, Plane, WalletCards } from "lucide-react";

import { CompareFaq, compareFaqs } from "@/components/compare/compare-faq";
import { CompareTool, PopularComparisons } from "@/components/compare/compare-tool";
import { CTASection } from "@/components/site/cta-section";
import { EstimateDisclaimer } from "@/components/site/estimate-disclaimer";
import { Button } from "@/components/ui/button";
import { unifiedDestinations } from "@/lib/data/unified-destinations";
import { parseCompareParams } from "@/lib/compare/url-params";
import { comparisonPages, getComparisonPath } from "@/lib/programmatic/comparison-pages";
import { createMetadata } from "@/lib/seo/metadata";
import {
  createBreadcrumbSchema,
  createFAQSchema,
  createItemListSchema,
  serializeJsonLd,
  type SchemaObject,
} from "@/lib/seo/schema";

export const metadata = createMetadata({
  title: "Compare Travel Costs by Destination",
  description:
    "Compare the total cost of two travel destinations, including flights, hotels, food, transportation and activities. Customize your origin, trip length, style and currency.",
  path: "/compare",
  socialDescription:
    "Compare flights, hotels, food, transportation and activities based on your departure city, trip length and travel style.",
});

const jsonLd = [
  createBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Compare", url: "/compare" },
  ]),
  createFAQSchema(compareFaqs),
  createItemListSchema(
    comparisonPages.map((page) => ({
      name: page.title,
      url: getComparisonPath(page),
      description: page.description,
    }))
  ),
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "GoByBudget Trip Cost Comparator",
    url: "https://gobybudget.com/compare",
    applicationCategory: "TravelApplication",
    operatingSystem: "Any",
    description:
      "Compare estimated total travel costs between two destinations using origin city, trip length, travel style, travelers, and currency.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  } satisfies SchemaObject,
];

type ComparePageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function ComparePage({ searchParams }: ComparePageProps) {
  const initialParams = parseCompareParams(toUrlSearchParams(await searchParams), new Set(unifiedDestinations.map((destination) => destination.slug)));

  return (
    <>
      <main className="bg-slate-50 text-slate-950">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: serializeJsonLd(jsonLd),
          }}
        />
        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="grid gap-8 lg:grid-cols-[1fr_360px] lg:items-end">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-[#0B1D34]">Compare destinations</p>
                <h1 className="mt-2 max-w-4xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
                  Compare Travel Costs Between Destinations
                </h1>
                <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
                  Compare flights, hotels, food, transportation and activities based on your departure city,
                  trip length and travel style.
                </p>
                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  <HeroMetric icon={Plane} label="Flights included" value="From your origin city" />
                  <HeroMetric icon={CalendarDays} label="Trip length" value="3 to 14+ days" />
                  <HeroMetric icon={WalletCards} label="Budget fit" value="Optional budget check" />
                </div>
              </div>
              <div className="rounded-[24px] border border-[#14B8A6]/20 bg-[#14B8A6]/10 p-5 text-sm leading-6 text-slate-700">
                <div className="flex gap-3">
                  <Info className="mt-0.5 size-5 shrink-0 text-[#0B1D34]" />
                  <p>
                    GoByBudget compares the estimated total cost of the trip from your departure city. It does not only
                    compare daily local spend after arrival.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <CompareTool initialParams={initialParams} />

          <div className="mt-8 grid gap-8">
            <MethodologyBlock />
            <PopularComparisons />
            <CompareFaq />
          </div>
        </section>
      </main>
      <CTASection />
    </>
  );
}

function toUrlSearchParams(params: Record<string, string | string[] | undefined>) {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((item) => searchParams.append(key, item));
      return;
    }

    if (value !== undefined) {
      searchParams.set(key, value);
    }
  });

  return searchParams;
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

function MethodologyBlock() {
  return (
    <section className="rounded-[24px] border border-slate-200 bg-white p-6">
      <h2 className="text-2xl font-semibold tracking-tight text-slate-950">How these estimates are calculated</h2>
      <div className="mt-4 grid gap-5 lg:grid-cols-[1fr_320px]">
        <div className="text-sm leading-7 text-slate-600">
          <p>
            Each total includes round-trip flight estimates, accommodation, food, local transportation, activities, and
            an extras buffer where the destination dataset includes those inputs. Flights are treated as a fixed trip
            cost per traveler. Daily categories are multiplied by trip length and number of travelers.
          </p>
          <p className="mt-3">
            Amounts are planning estimates, not live booking prices. Flights and hotels can vary by dates, season,
            availability, exchange rates, baggage, booking timing, departure city, and travel style. The current dataset
            is modeled in CAD and converted for display when another currency is selected.
          </p>
        </div>
        <div>
          <EstimateDisclaimer title="Estimate methodology" />
          <Button asChild variant="outline" className="mt-4 rounded-full bg-white">
            <Link href="/methodology">Read the full methodology</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
