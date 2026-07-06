import { BarChart3, Database, Mail, MousePointerClick, Search, Star } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { destinations } from "@/lib/data/destinations";
import { getDashboardMetrics } from "@/lib/metrics/dashboard";
import { createMetadata } from "@/lib/seo/metadata";

export const metadata = createMetadata({
  title: "Metrics Dashboard",
  description: "Internal TravelBudget.ai metrics for searches, destination clicks, affiliate clicks, emails, and SEO pages.",
  path: "/dashboard/metrics",
  noIndex: true,
});

const metricIcons = [Mail, Star, MousePointerClick, Search];

export default async function MetricsDashboardPage() {
  const dashboard = await getDashboardMetrics();
  const topSeoPages = destinations
    .slice()
    .sort((a, b) => b.score - a.score)
    .slice(0, 8);

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 text-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-8">
        <section>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-blue-700">
                <BarChart3 className="size-4" />
                Internal metrics
              </p>
              <h1 className="mt-3 text-4xl font-semibold">TravelBudget growth dashboard</h1>
              <p className="mt-3 max-w-2xl text-slate-600">
                Tracks the P1 funnel: searches, destination engagement, affiliate exits, email capture, saved trips,
                and top SEO pages.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-600">
              <Database className="size-4 text-blue-700" />
              {dashboard.storageMode}
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {dashboard.metrics.map((metric, index) => {
            const Icon = metricIcons[index] ?? BarChart3;

            return (
              <Card key={metric.label} className="border-slate-200 bg-white shadow-sm">
                <CardContent className="pt-6">
                  <Icon className="size-5 text-blue-700" />
                  <p className="mt-4 text-sm font-semibold text-slate-500">{metric.label}</p>
                  <p className="mt-1 text-3xl font-semibold">{metric.value}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-500">{metric.detail}</p>
                </CardContent>
              </Card>
            );
          })}
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          <Card className="border-slate-200 bg-white shadow-sm">
            <CardHeader>
              <CardTitle>CTR summary</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="rounded-lg bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-500">Destination CTR</p>
                <p className="mt-1 text-3xl font-semibold">{dashboard.destinationCtr}</p>
              </div>
              <div className="rounded-lg bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-500">Affiliate CTR</p>
                <p className="mt-1 text-3xl font-semibold">{dashboard.affiliateCtr}</p>
              </div>
            </CardContent>
          </Card>
          <RankedTable
            title="Destination CTR"
            rows={dashboard.topDestinationClicks}
            emptyLabel="No destination click events tracked yet."
          />
          <RankedTable
            title="Email intent destinations"
            rows={dashboard.topEmailDestinations}
            emptyLabel="No lead destinations tracked yet."
          />
          <Card className="border-slate-200 bg-white shadow-sm">
            <CardHeader>
              <CardTitle>Top SEO pages</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Page</TableHead>
                    <TableHead className="text-right">Score</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topSeoPages.map((destination) => (
                    <TableRow key={destination.slug}>
                      <TableCell>/destinations/{destination.slug}</TableCell>
                      <TableCell className="text-right font-semibold">{destination.score}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}

function RankedTable({
  emptyLabel,
  rows,
  title,
}: {
  emptyLabel: string;
  rows: { label: string; value: number }[];
  title: string;
}) {
  return (
    <Card className="border-slate-200 bg-white shadow-sm">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {rows.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead className="text-right">Events</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.label}>
                  <TableCell>{row.label}</TableCell>
                  <TableCell className="text-right font-semibold">{row.value}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className="text-sm leading-6 text-slate-500">{emptyLabel}</p>
        )}
      </CardContent>
    </Card>
  );
}
