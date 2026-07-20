import type { Metadata } from "next";
import Image from "next/image";
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
  title: "Find Destinations by Budget",
  description:
    "Find affordable destinations by total trip budget, departure city, trip length, currency, and travel style with realistic full-trip estimates.",
  path: destinationsByBudgetPath,
  socialDescription:
    "Compare affordable destinations by total travel budget, departure city, duration, currency, and travel style.",
});

const faqItems = [
  {
    question: "How does GoByBudget find destinations by budget?",
    answer:
      "GoByBudget compares real destinations against a total trip budget that includes estimated flights, accommodation, food, local transport, activities, and a planning buffer.",
  },
  {
    question: "Can I use this as a budget trip finder?",
    answer:
      "Yes. Each budget page starts from a spend limit, then shows destination matches by departure city, trip duration, and travel style.",
  },
  {
    question: "What costs are included in each budget?",
    answer:
      "Each estimate includes flights, accommodation, food, local transportation, activities, and a planning buffer so destinations can be compared on a similar basis.",
  },
  {
    question: "Can I search by departure city?",
    answer:
      "Yes. GoByBudget uses departure cities such as Montreal, Toronto, Vancouver, Calgary, Ottawa, and New York because flight costs can change which destinations fit a budget.",
  },
  {
    question: "Are the budgets per person or total trip estimates?",
    answer:
      "Budget pages use planning scenarios for a total trip estimate. Use the travel budget calculator when you need to adjust travelers, duration, origin, currency, and travel style.",
  },
  {
    question: "Which currencies can I use?",
    answer:
      "GoByBudget supports CAD, USD, EUR, and GBP in the trip planning experience, with CAD used as the default for these budget examples.",
  },
  {
    question: "How should I choose between budget, mid-range, and luxury travel styles?",
    answer:
      "Use budget style for hostels and lower daily spend, mid-range for private stays and balanced comfort, and luxury for higher-rated stays, more private transport, and more flexible daily spending.",
  },
  {
    question: "Are these live vacation prices?",
    answer:
      "No. These are planning estimates from the GoByBudget dataset. Check current fares, lodging, exchange rates, and availability before booking.",
  },
];

export default function DestinationsByBudgetHubPage() {
  const heroTier = destinationBudgetTiers.find((tier) => tier.amount === 2000) ?? destinationBudgetTiers[2];
  const heroMatches = getDistinctHeroMatches(heroTier);
  const jsonLd = [
    createBreadcrumbSchema([
      { name: "Home", url: "/" },
      { name: "Destinations by budget", url: destinationsByBudgetPath },
    ]),
    createCollectionPageSchema({
      name: "Find Destinations by Budget",
      description:
        "A GoByBudget hub for finding affordable destinations by total trip budget, origin city, trip duration, currency, and travel style.",
      path: destinationsByBudgetPath,
    }),
    createItemListSchema(
      destinationBudgetTiers.map((tier) => ({
        name: `${tier.label} travel destinations`,
        url: getDestinationBudgetPath(tier),
        description: `Affordable destinations under $${tier.amount.toLocaleString("en-CA")} by departure city, duration, currency, and style.`,
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
        <section className="border-b border-slate-200 bg-[#fbfcfd]">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 py-10 sm:px-6 sm:py-14 lg:grid-cols-[minmax(0,0.95fr)_minmax(420px,0.75fr)] lg:items-center lg:px-8">
            <div className="max-w-4xl">
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
                Find destinations that fit your travel budget
              </h1>
              <p className="mt-5 max-w-3xl text-base leading-8 text-slate-600 sm:text-lg">
                Start with your total trip budget and compare affordable destinations by departure city, trip length,
                currency, and travel style. GoByBudget estimates flights, stays, food, local transport, and activities
                so you can shortlist trips that fit before checking live prices.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button asChild className="h-11 rounded-xl bg-[#0B1D34] px-5 text-white hover:bg-[#0B1D34]/90">
                  <Link href="#budget-tiers">
                    Browse destinations by budget
                    <ArrowRight className="ml-2 size-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" className="h-11 rounded-xl bg-white">
                  <Link href="/travel-budget-calculator">Use the travel budget calculator</Link>
                </Button>
              </div>
              <div className="mt-7 grid gap-3 text-sm sm:grid-cols-3">
                <HeroSignal icon={WalletCards} label="Budget ranges" value="$1,000 to $5,000 CAD" />
                <HeroSignal icon={Plane} label="Departure cities" value="Montreal, Toronto, Vancouver" />
                <HeroSignal icon={CalendarDays} label="Trip lengths" value="3 to 14 day examples" />
              </div>
            </div>

            <BudgetFinderPreview matches={heroMatches} tier={heroTier} />
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
              Each budget range links to destination ideas with real GoByBudget estimates, including sample origins,
              trip durations, travel styles, and total costs.
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
              <p className="text-sm font-semibold uppercase tracking-wide text-[#0B1D34]">Popular budget trip ideas</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
                Compare realistic trips by budget range
              </h2>
              <p className="mt-4 text-sm leading-6 text-slate-600">
                Use these budget ranges to explore realistic destination options from major departure cities. Each page
                groups trips by total estimated cost, duration, and travel style so you can move from a rough budget to
                a practical shortlist.
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

function BudgetFinderPreview({
  matches,
  tier,
}: {
  matches: ReturnType<typeof getFeaturedBudgetMatches>;
  tier: (typeof destinationBudgetTiers)[number];
}) {
  return (
    <aside className="rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-[0_24px_80px_-45px_rgba(15,23,42,0.55)] sm:p-5">
      <div className="rounded-[1.25rem] border border-[#14B8A6]/20 bg-[#f0fdfa] p-5">
        <p className="text-sm font-semibold text-[#0B1D34]">Sample budget search</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <PreviewFilter icon={WalletCards} label="Budget" value={`$${tier.amount.toLocaleString("en-CA")} CAD`} />
          <PreviewFilter icon={Plane} label="From" value="Montreal" />
          <PreviewFilter icon={CalendarDays} label="Trip length" value={`${tier.durationDays} days`} />
          <PreviewFilter icon={SlidersHorizontal} label="Style" value={formatBudgetTravelStyle(tier.travelStyle)} />
        </div>
      </div>

      <div className="mt-4 grid gap-3">
        <div className="flex items-center justify-between gap-4 px-1">
          <p className="text-sm font-bold text-slate-950">Matching destinations</p>
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Estimated total</span>
        </div>
        {matches.map((match) => {
          const destinationLabel = getCityCountryLabel(match.destination);

          return (
            <Link
              key={`${match.origin.slug}-${match.destination.slug}`}
              href={getDestinationBudgetPath(tier)}
              className="group grid grid-cols-[64px_1fr_auto] items-center gap-3 rounded-2xl border border-slate-200 bg-[#fbfcfd] p-3 transition hover:border-[#14B8A6]/55 hover:bg-white"
            >
              <div className="relative h-14 w-16 overflow-hidden rounded-xl bg-slate-100">
                <Image
                  src={match.destination.image}
                  alt={`${destinationLabel} travel budget example`}
                  fill
                  sizes="64px"
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
              </div>
              <div className="min-w-0">
                <p className="truncate font-semibold text-slate-950">{destinationLabel}</p>
                <p className="mt-1 text-xs font-medium text-slate-500">
                  From {match.origin.city} - {match.durationDays} days
                </p>
              </div>
              <div className="text-right">
                <p className="font-extrabold text-[#0B1D34]">{formatMoney(match.totalEstimate, "CAD")}</p>
                <p className="mt-1 text-xs font-semibold text-[#006c49]">
                  {formatMoney(match.budgetRemaining, "CAD")} left
                </p>
              </div>
            </Link>
          );
        })}
      </div>
      <Link
        href={getDestinationBudgetPath(tier)}
        className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-3 text-sm font-bold text-white transition hover:bg-orange-600"
      >
        See trips under ${tier.amount.toLocaleString("en-CA")}
        <ArrowRight className="size-4" />
      </Link>
    </aside>
  );
}

function HeroSignal({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
      <Icon className="size-5 text-[#0B1D34]" />
      <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 font-semibold text-slate-950">{value}</p>
    </div>
  );
}

function PreviewFilter({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-[#14B8A6]/20 bg-white p-3 shadow-sm">
      <Icon className="size-4 text-[#0B1D34]" />
      <p className="mt-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-bold capitalize text-slate-950">{value}</p>
    </div>
  );
}

function getDistinctHeroMatches(tier: (typeof destinationBudgetTiers)[number]) {
  const matches = getFeaturedBudgetMatches(tier, 18);
  const seenDestinations = new Set<string>();

  return matches.filter((match) => {
    if (seenDestinations.has(match.destination.slug)) {
      return false;
    }

    seenDestinations.add(match.destination.slug);
    return true;
  }).slice(0, 3);
}
