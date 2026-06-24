import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { CTASection } from "@/components/site/cta-section";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { destinations, formatMoney, getDestinationCostBreakdown, getDestinationTripEstimate } from "@/lib/data/destinations";
import { createMetadata } from "@/lib/seo/metadata";

export const metadata = createMetadata({
  title: "Travel Cost Comparison",
  description: "Compare destination travel costs side by side, including flights, hotels, food, activities, weather, and value scores.",
  path: "/compare",
});

const referenceScenario = { days: 10, originCode: "YUL", travelStyle: "midRange" } as const;
const referenceBreakdowns = destinations.map((destination) => getDestinationCostBreakdown(destination, referenceScenario));

const rows = [
  ["Total cost", (i: number) => formatMoney(getDestinationTripEstimate(destinations[i], referenceScenario))],
  ["Flight cost", (i: number) => formatMoney(referenceBreakdowns[i].flights)],
  ["Accommodation", (i: number) => formatMoney(referenceBreakdowns[i].accommodation)],
  ["Food", (i: number) => formatMoney(referenceBreakdowns[i].food)],
  ["Local transport", (i: number) => formatMoney(referenceBreakdowns[i].localTransport)],
  ["Activities", (i: number) => formatMoney(referenceBreakdowns[i].activities)],
  ["Misc", (i: number) => formatMoney(referenceBreakdowns[i].misc)],
  ["Weather", (i: number) => destinations[i].weather],
  ["Value score", (i: number) => `${destinations[i].score}/100`],
] as const;

export default function ComparePage() {
  return (
    <>
      <main className="bg-slate-50">
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">Compare destinations</p>
            <h1 className="mt-2 text-4xl font-semibold tracking-tight text-slate-950">
              Japan, Portugal, and Vietnam side by side
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
                    {destinations.map((destination) => (
                      <TableHead key={destination.slug} className="min-w-44 text-slate-950">
                        {destination.name}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map(([label, getValue]) => (
                    <TableRow key={label}>
                      <TableCell className="font-semibold text-slate-950">{label}</TableCell>
                      {destinations.map((destination, index) => (
                        <TableCell key={destination.slug} className="text-slate-600">
                          {getValue(index)}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {destinations.map((destination) => (
              <Card key={destination.slug} className="border-slate-200 bg-white">
                <CardContent className="pt-5">
                  <p className="text-lg font-semibold text-slate-950">{destination.name}</p>
                  <div className="mt-4 h-2 rounded-full bg-slate-100">
                    <div className="h-2 rounded-full bg-teal-600" style={{ width: `${destination.score}%` }} />
                  </div>
                  <p className="mt-2 text-sm text-slate-500">Value score: {destination.score}/100</p>
                  <Button asChild className="mt-5 h-10 w-full rounded-xl bg-blue-600 text-white hover:bg-blue-700">
                    <Link href={`/destinations/${destination.slug}`}>
                      View details
                      <ArrowRight className="ml-2 size-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>
      <CTASection />
    </>
  );
}
