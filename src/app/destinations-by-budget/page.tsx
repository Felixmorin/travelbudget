import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CalendarDays, MapPinned, Plane, SlidersHorizontal, WalletCards } from "lucide-react";

import { EstimateDisclaimer } from "@/components/site/estimate-disclaimer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  destinationBudgetTiers,
  destinationsByBudgetPath,
  formatBudgetTravelStyle,
  getBudgetTierSummary,
  getDestinationBudgetPath,
  getFeaturedBudgetMatches,
} from "@/lib/programmatic/destinations-by-budget";
import { getCityCountryLabel } from "@/lib/data/unified-destinations";
import { formatMoney } from "@/lib/format-money";
import { createMetadata } from "@/lib/seo/metadata";
import {
  createBreadcrumbSchema,
  createCollectionPageSchema,
  createFAQSchema,
  createItemListSchema,
  serializeJsonLd,
} from "@/lib/seo/schema";

export const metadata: Metadata = createMetadata({
  title: "Destinations by Budget: Affordable Trip Finder",
  description:
    "Use GoByBudget to browse destinations by budget, departure city, trip duration, and travel style with realistic full-trip estimates.",
  path: destinationsByBudgetPath,
  socialDescription:
    "Find affordable destinations by real travel budget, departure city, duration, and travel style.",
});

const faqItems = [
  {
    question: "How does the destinations by budget hub work?",
    answer:
      "GoByBudget compares real destinations against a total trip budget that includes estimated flights, accommodation, food, local transport, activities, and a planning buffer.",
  },
  {
    question: "Can I use this as a budget trip finder?",
    answer:
      "Yes. Each budget page starts from a spend limit, then shows destination matches by departure city, trip duration, and travel style.",
  },
  {
    question: "Are these live vacation prices?",
    answer:
      "No. These are planning estimates from the GoByBudget dataset. Check current fares, lodging, exchange rates, and availability before booking.",
  },
];

export default function DestinationsByBudgetHubPage() {
  const jsonLd = [
    createBreadcrumbSchema([
      { name: "Home", url: "/" },
      { name: "Destinations by budget", url: destinationsByBudgetPath },
    ]),
    createCollectionPageSchema({
      name: "Destinations by Budget",
      description:
        "A GoByBudget SEO hub for finding affordable destinations by budget, origin city, trip duration, and travel style.",
      path: destinationsByBudgetPath,
    }),
    createItemListSchema(
      destinationBudgetTiers.map((tier) => ({
        name: `${tier.label} travel destinations`,
        url: getDestinationBudgetPath(tier),
        description: `Affordable destinations under $${tier.amount.toLocaleString("en-CA")} by departure city, duration, and style.`,
      }))
    ),
    createFAQSchema(faqItems),
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(jsonLd),
        }}
      />
      <main className="bg-[#f7f9fb] text-slate-950">
        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[1fr_420px] lg:items-center lg:px-8">
            <div>
              <nav aria-label="Breadcrumb" className="mb-5 text-sm font-medium text-slate-500">
                <Link href="/" className="hover:text-[#0B1D34]">
                  Home
                </Link>
                <span className="mx-2 text-slate-300">/</span>
                <span className="text-slate-900">Destinations by budget</span>
              </nav>
              <Badge className="rounded-full bg-[#14B8A6]/10 px-4 py-2 text-sm font-semibold text-[#0B1D34]">
                Budget trip finder
              </Badge>
              <h1 className="mt-5 max-w-4xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-6xl">
                Destinations by Budget
              </h1>
              <p className="mt-5 max-w-3xl text-base leading-8 text-slate-600 sm:text-lg">
                Find affordable destinations by starting with what you can spend, then comparing realistic trips by
                departure city, duration, and travel style. This hub supports programmatic pages for vacations by
                budget while strengthening GoByBudget&apos;s budget-first homepage positioning.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button asChild className="h-11 rounded-xl bg-[#0B1D34] px-5 text-white hover:bg-[#0B1D34]/90">
                  <Link href="#budget-tiers">
                    Browse budget tiers
                    <ArrowRight className="ml-2 size-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" className="h-11 rounded-xl bg-white">
                  <Link href="/travel-budget-calculator">Use custom budget</Link>
                </Button>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-950 p-6 text-white shadow-sm">
              <p className="text-sm font-semibold text-[#38BDF8]">Where can I travel with my budget?</p>
              <div className="mt-5 grid gap-3">
                <HubMetric icon={WalletCards} label="Budget" value="$1,000 to $5,000 CAD" />
                <HubMetric icon={Plane} label="Departure cities" value="Montreal, Toronto, Vancouver, and more" />
                <HubMetric icon={CalendarDays} label="Durations" value="3 to 14 day planning scenarios" />
                <HubMetric icon={SlidersHorizontal} label="Styles" value="Budget, mid-range, and luxury assumptions" />
              </div>
            </div>
          </div>
        </section>

        <section id="budget-tiers" className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
          <div className="mb-8 grid gap-4 lg:grid-cols-[0.75fr_1.25fr] lg:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-[#0B1D34]">Vacation pages by budget</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
                Choose a total trip budget
              </h2>
            </div>
            <p className="text-sm leading-6 text-slate-600">
              Each page is built to expand into origin, duration, style, and destination combinations without creating
              thin pages. The current version uses real GoByBudget destination estimates.
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {destinationBudgetTiers.map((tier) => {
              const matches = getFeaturedBudgetMatches(tier, 3);

              return (
                <Link
                  key={tier.slug}
                  href={getDestinationBudgetPath(tier)}
                  className="group rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-[#14B8A6]/60 hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-wide text-[#0B1D34]">{tier.label}</p>
                      <h3 className="mt-2 text-2xl font-semibold text-slate-950">
                        Affordable destinations under ${tier.amount.toLocaleString("en-CA")}
                      </h3>
                    </div>
                    <ArrowRight className="mt-1 size-5 text-slate-400 transition group-hover:translate-x-1 group-hover:text-[#0B1D34]" />
                  </div>
                  <p className="mt-4 text-sm leading-6 text-slate-600">
                    Starting scenario: {tier.durationDays} days, {formatBudgetTravelStyle(tier.travelStyle)} style.
                  </p>
                  <div className="mt-5 grid gap-2">
                    {matches.map((match) => (
                      <span key={`${tier.slug}-${match.origin.slug}-${match.destination.slug}`} className="flex items-center justify-between gap-3 rounded-lg bg-slate-50 px-3 py-2 text-sm">
                        <span className="font-medium text-slate-700">
                          {getCityCountryLabel(match.destination)} from {match.origin.city}
                        </span>
                        <span className="shrink-0 font-semibold text-[#0B1D34]">
                          {formatMoney(match.totalEstimate, "CAD")}
                        </span>
                      </span>
                    ))}
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="border-y border-slate-200 bg-white py-14 sm:py-16">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-[#0B1D34]">Programmatic SEO silo</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
                Built for hundreds of long-tail pages
              </h2>
              <p className="mt-4 text-sm leading-6 text-slate-600">
                The hub links budget tiers to real destination sets now, and the same structure can support deeper
                pages like trips from Toronto under $2,500, 7-day beach trips under $3,000, or affordable destinations
                from Vancouver for mid-range travelers.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {destinationBudgetTiers.slice(0, 4).map((tier) => (
                <article key={`summary-${tier.slug}`} className="rounded-xl border border-slate-200 bg-[#fbfcfd] p-5">
                  <MapPinned className="size-5 text-[#0B1D34]" />
                  <h3 className="mt-3 font-semibold text-slate-950">{tier.label} examples</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{getBudgetTierSummary(tier)}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-4xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
          <EstimateDisclaimer />
          <div className="mt-8 divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white">
            {faqItems.map((item) => (
              <details key={item.question} className="group p-5 open:bg-slate-50">
                <summary className="cursor-pointer list-none text-base font-semibold text-slate-950">
                  {item.question}
                </summary>
                <p className="mt-3 text-sm leading-6 text-slate-600">{item.answer}</p>
              </details>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}

function HubMetric({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-white/10 p-4">
      <Icon className="size-5 text-[#38BDF8]" />
      <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-1 text-sm font-semibold text-white">{value}</p>
    </div>
  );
}
