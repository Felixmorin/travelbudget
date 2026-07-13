import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { TrackedLink } from "@/components/analytics/tracked-link";
import { CTASection } from "@/components/site/cta-section";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatMoney, getDestinationCostBreakdown, getDestinationTripEstimate } from "@/lib/data/destinations";
import { getCityCountryLabel, unifiedDestinations } from "@/lib/data/unified-destinations";
import { comparisonPages, getComparisonPath } from "@/lib/programmatic/comparison-pages";
import { createMetadata } from "@/lib/seo/metadata";

export const metadata = createMetadata({
  title: "Travel Cost Comparison",
  description: "Compare destination travel costs side by side, including flights, hotels, food, activities, weather, and value scores.",
  path: "/compare",
});

const referenceScenario = { days: 10, originCode: "YUL", travelStyle: "midRange" } as const;

const rows = [
  ["Total cost", (i: number, context: CompareContext) => formatMoney(getDestinationTripEstimate(context.destinations[i], referenceScenario))],
  ["Flight cost", (i: number, context: CompareContext) => formatMoney(context.breakdowns[i].flights)],
  ["Accommodation", (i: number, context: CompareContext) => formatMoney(context.breakdowns[i].accommodation)],
  ["Food", (i: number, context: CompareContext) => formatMoney(context.breakdowns[i].food)],
  ["Local transport", (i: number, context: CompareContext) => formatMoney(context.breakdowns[i].localTransport)],
  ["Activities", (i: number, context: CompareContext) => formatMoney(context.breakdowns[i].activities)],
  ["Misc", (i: number, context: CompareContext) => formatMoney(context.breakdowns[i].misc)],
  ["Weather", (i: number, context: CompareContext) => context.destinations[i].weather],
  ["Value score", (i: number, context: CompareContext) => `${context.destinations[i].score}/100`],
] as const;

type ComparePageProps = {
  searchParams: Promise<{ destination?: string | string[] }>;
};

type CompareContext = {
  destinations: typeof unifiedDestinations;
  breakdowns: ReturnType<typeof getDestinationCostBreakdown>[];
};

export default async function ComparePage({ searchParams }: ComparePageProps) {
  const selectedDestinations = getSelectedDestinations((await searchParams).destination);
  const context: CompareContext = {
    destinations: selectedDestinations,
    breakdowns: selectedDestinations.map((destination) => getDestinationCostBreakdown(destination, referenceScenario)),
  };
  const title = `${selectedDestinations.map((destination) => getCityCountryLabel(destination)).join(", ")} side by side`;

  return (
    <>
      <main className="bg-slate-50">
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-[#0B1D34]">Compare destinations</p>
            <h1 className="mt-2 text-4xl font-semibold tracking-tight text-slate-950">
              {title}
            </h1>
            <p className="mt-4 text-base leading-7 text-slate-500">
              See how major trip costs and travel conditions compare before choosing your route.
            </p>
          </div>

          <Card className="mt-8 border-slate-200 bg-white shadow-xl shadow-slate-200/70">
            <CardContent className="overflow-x-auto pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Category</TableHead>
                    {selectedDestinations.map((destination) => (
                      <TableHead key={destination.slug} className="min-w-44 text-slate-950">
                        {getCityCountryLabel(destination)}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map(([label, getValue]) => (
                    <TableRow key={label}>
                      <TableCell className="font-semibold text-slate-950">{label}</TableCell>
                      {selectedDestinations.map((destination, index) => (
                        <TableCell key={destination.slug} className="text-slate-600">
                          {getValue(index, context)}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {selectedDestinations.map((destination) => (
              <Card key={destination.slug} className="border-slate-200 bg-white">
                <CardContent className="pt-5">
                  <p className="text-lg font-semibold text-slate-950">{getCityCountryLabel(destination)}</p>
                  <div className="mt-4 h-2 rounded-full bg-slate-100">
                    <div className="h-2 rounded-full bg-teal-600" style={{ width: `${destination.score}%` }} />
                  </div>
                  <p className="mt-2 text-sm text-slate-500">Value score: {destination.score}/100</p>
                  <Button asChild className="mt-5 h-10 w-full rounded-xl bg-[#0B1D34] text-white hover:bg-[#0B1D34]">
                    <TrackedLink
                      href={`/destinations/${destination.slug}`}
                      eventName="destination_card_clicked"
                      eventProperties={{
                        page: "/compare",
                        destinationName: getCityCountryLabel(destination),
                        destinationSlug: destination.slug,
                        source: "compare_page_card",
                      }}
                    >
                      View details
                      <ArrowRight className="ml-2 size-4" />
                    </TrackedLink>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <section className="mt-12">
            <p className="text-sm font-semibold uppercase tracking-wide text-[#0B1D34]">Comparison guides</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
              Popular travel budget comparisons
            </h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {comparisonPages.map((page) => (
                <Link
                  key={page.slug}
                  href={getComparisonPath(page)}
                  className="rounded-xl border border-slate-200 bg-white p-5 transition-colors hover:bg-[#14B8A6]/10"
                >
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#0B1D34]">
                    {page.searchIntent}
                  </p>
                  <h3 className="mt-2 text-xl font-semibold text-slate-950">{page.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{page.description}</p>
                </Link>
              ))}
            </div>
          </section>
        </section>
      </main>
      <CTASection />
    </>
  );
}

function getSelectedDestinations(destinationParam: string | string[] | undefined) {
  const requestedSlugs = new Set((Array.isArray(destinationParam) ? destinationParam : [destinationParam]).filter(Boolean));

  if (requestedSlugs.size === 0) {
    return unifiedDestinations.filter((destination) => ["japan", "portugal", "vietnam"].includes(destination.slug));
  }

  const selected = unifiedDestinations.filter((destination) => requestedSlugs.has(destination.slug)).slice(0, 4);

  return selected.length >= 2
    ? selected
    : unifiedDestinations.filter((destination) => ["japan", "portugal", "vietnam"].includes(destination.slug));
}
