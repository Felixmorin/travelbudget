import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CalendarDays, Plane, SlidersHorizontal, WalletCards } from "lucide-react";

import { EstimateDisclaimer } from "@/components/site/estimate-disclaimer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  destinationBudgetTiers,
  destinationsByBudgetPath,
  formatBudgetTravelStyle,
  getDestinationBudgetPath,
  getDestinationBudgetScenarios,
  getDestinationBudgetStaticParams,
  getDestinationBudgetTier,
  getFeaturedBudgetMatches,
  type DestinationBudgetMatch,
  type DestinationBudgetTier,
} from "@/lib/programmatic/destinations-by-budget";
import { getCityCountryLabel, getDestinationCountryName } from "@/lib/data/unified-destinations";
import { formatMoney } from "@/lib/format-money";
import { createMetadata } from "@/lib/seo/metadata";
import {
  createBreadcrumbSchema,
  createCollectionPageSchema,
  createFAQSchema,
  createItemListSchema,
  serializeJsonLd,
} from "@/lib/seo/schema";

type DestinationsByBudgetTierPageProps = {
  params: Promise<{ tier: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return getDestinationBudgetStaticParams();
}

export async function generateMetadata({ params }: DestinationsByBudgetTierPageProps): Promise<Metadata> {
  const { tier: tierSlug } = await params;
  const tier = getDestinationBudgetTier(tierSlug);

  if (!tier) {
    return createMetadata({
      title: "Budget Destinations Not Found",
      description: "This GoByBudget destinations by budget page could not be found.",
      path: `${destinationsByBudgetPath}/${tierSlug}`,
      noIndex: true,
    });
  }

  return createMetadata({
    title: `Destinations Under $${tier.amount.toLocaleString("en-CA")}: Budget Trip Finder`,
    description: `Find affordable destinations under $${tier.amount.toLocaleString(
      "en-CA"
    )} by departure city, duration, and travel style with realistic GoByBudget trip estimates.`,
    path: getDestinationBudgetPath(tier),
    socialDescription: `Where can I travel with $${tier.amount.toLocaleString("en-CA")}? Compare vacations by budget, origin, duration, and travel style.`,
  });
}

export default async function DestinationsByBudgetTierPage({ params }: DestinationsByBudgetTierPageProps) {
  const { tier: tierSlug } = await params;
  const tier = getDestinationBudgetTier(tierSlug);

  if (!tier) {
    notFound();
  }

  const scenarios = getDestinationBudgetScenarios(tier);
  const featuredMatches = getFeaturedBudgetMatches(tier, 6);
  const faqItems = createFaqs(tier, featuredMatches[0] ?? null);
  const path = getDestinationBudgetPath(tier);
  const jsonLd = [
    createBreadcrumbSchema([
      { name: "Home", url: "/" },
      { name: "Destinations by budget", url: destinationsByBudgetPath },
      { name: tier.label, url: path },
    ]),
    createCollectionPageSchema({
      name: `${tier.label} travel destinations`,
      description: `Affordable destinations under $${tier.amount.toLocaleString("en-CA")} by budget, origin, duration, and travel style.`,
      path,
    }),
    createItemListSchema(
      featuredMatches.map((match) => ({
        name: `${getCityCountryLabel(match.destination)} from ${match.origin.city}`,
        url: `/destinations/${match.destination.slug}`,
        description: `${formatMoney(match.totalEstimate, "CAD")} estimated total for ${match.durationDays} days in ${formatBudgetTravelStyle(match.travelStyle)} style.`,
      }))
    ),
    createFAQSchema(faqItems),
  ];
  const relatedTiers = destinationBudgetTiers.filter((item) => item.slug !== tier.slug);

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
          <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[1fr_460px] lg:items-center lg:px-8">
            <div>
              <nav aria-label="Breadcrumb" className="mb-5 text-sm font-medium text-slate-500">
                <Link href="/" className="hover:text-[#0B1D34]">
                  Home
                </Link>
                <span className="mx-2 text-slate-300">/</span>
                <Link href={destinationsByBudgetPath} className="hover:text-[#0B1D34]">
                  Destinations by budget
                </Link>
                <span className="mx-2 text-slate-300">/</span>
                <span className="text-slate-900">{tier.label}</span>
              </nav>
              <Badge className="rounded-full bg-[#14B8A6]/10 px-4 py-2 text-sm font-semibold text-[#0B1D34]">
                Vacations by budget
              </Badge>
              <h1 className="mt-5 max-w-4xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-6xl">
                Affordable Destinations {tier.label}
              </h1>
              <p className="mt-5 max-w-3xl text-base leading-8 text-slate-600 sm:text-lg">
                See where you can travel with a ${tier.amount.toLocaleString("en-CA")} CAD budget using real
                destination estimates. Matches change by departure city, duration, and travel style so you can compare
                the whole trip instead of a generic cheapest-place list.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button asChild className="h-11 rounded-xl bg-[#0B1D34] px-5 text-white hover:bg-[#0B1D34]/90">
                  <Link href="#destinations">
                    View destinations
                    <ArrowRight className="ml-2 size-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" className="h-11 rounded-xl bg-white">
                  <Link href="/travel-budget-calculator">Run custom search</Link>
                </Button>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-950 p-6 text-white shadow-sm">
              <p className="text-sm font-semibold text-[#38BDF8]">Page assumptions</p>
              <div className="mt-5 grid gap-3">
                <TierMetric icon={WalletCards} label="Budget ceiling" value={`${formatMoney(tier.amount, "CAD")} CAD`} />
                <TierMetric icon={CalendarDays} label="Primary duration" value={`${tier.durationDays} days`} />
                <TierMetric icon={SlidersHorizontal} label="Primary style" value={formatBudgetTravelStyle(tier.travelStyle)} />
                <TierMetric icon={Plane} label="Departure cities" value={`${scenarios.length} origin scenarios`} />
              </div>
            </div>
          </div>
        </section>

        <section id="destinations" className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
          <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <SummaryMetric label="Budget" value={formatMoney(tier.amount, "CAD")} />
            <SummaryMetric label="Scenarios" value={scenarios.length.toString()} />
            <SummaryMetric label="Destinations shown" value={featuredMatches.length.toString()} />
            <SummaryMetric label="Currency" value="CAD" />
          </div>
          <div className="mb-8 grid gap-4 lg:grid-cols-[0.75fr_1.25fr] lg:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-[#0B1D34]">Best budget fits</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
                Recommended destinations {tier.label.toLowerCase()}
              </h2>
            </div>
            <p className="text-sm leading-6 text-slate-600">
              Results include estimated flights from the listed origin, daily costs for the selected style, and the
              exact trip duration shown on each card. They are planning estimates, not live booking prices.
            </p>
          </div>
          <EstimateDisclaimer className="mb-8" />
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {featuredMatches.map((match) => (
              <DestinationCard key={`${match.origin.slug}-${match.destination.slug}`} match={match} tier={tier} />
            ))}
          </div>
        </section>

        <section className="border-y border-slate-200 bg-white py-14 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-wide text-[#0B1D34]">Departure city scenarios</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
                Compare by origin, duration, and style
              </h2>
              <p className="mt-4 text-sm leading-6 text-slate-600">
                This section is the core of the silo: each origin scenario can later become its own deeper landing page.
              </p>
            </div>
            <div className="grid gap-5">
              {scenarios.map((scenario) => (
                <article key={scenario.origin.slug} className="rounded-xl border border-slate-200 bg-[#fbfcfd] p-5">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-slate-950">
                        From {scenario.origin.city} under ${tier.amount.toLocaleString("en-CA")}
                      </h3>
                      <p className="mt-1 text-sm text-slate-500">
                        {scenario.durationDays} days, {formatBudgetTravelStyle(scenario.travelStyle)} style, one traveler
                      </p>
                    </div>
                    <Link
                      href={`/results?budget=${tier.amount}&currency=CAD&origin=${scenario.origin.code}&days=${scenario.durationDays}&month=october&travelers=1&style=${toResultsStyle(scenario.travelStyle)}`}
                      className="inline-flex items-center gap-2 text-sm font-semibold text-[#0B1D34] hover:underline"
                    >
                      Run this search
                      <ArrowRight className="size-4" />
                    </Link>
                  </div>
                  <div className="mt-5 grid gap-3 md:grid-cols-3">
                    {scenario.matches.slice(0, 3).map((match) => (
                      <Link
                        key={`${scenario.origin.slug}-${match.destination.slug}`}
                        href={`/destinations/${match.destination.slug}`}
                        className="rounded-lg border border-slate-200 bg-white p-4 transition hover:border-[#14B8A6]/50"
                      >
                        <span className="block font-semibold text-slate-950">
                          {getCityCountryLabel(match.destination)}
                        </span>
                        <span className="mt-1 block text-sm text-slate-600">
                          {formatMoney(match.totalEstimate, "CAD")} total, {formatMoney(match.budgetRemaining, "CAD")} left
                        </span>
                      </Link>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-8 px-4 py-14 sm:px-6 sm:py-16 lg:grid-cols-[1fr_380px] lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-[#0B1D34]">SEO context</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
              Where can I travel with ${tier.amount.toLocaleString("en-CA")}?
            </h2>
            <div className="mt-5 space-y-4 text-sm leading-7 text-slate-600">
              <p>
                A useful budget trip finder needs to account for origin pricing. A destination that fits from Toronto
                may not fit from Vancouver, and a 5-day budget trip can produce different recommendations than a
                10-day mid-range vacation.
              </p>
              <p>
                GoByBudget&apos;s destinations by budget pages are designed around that search intent: affordable
                destinations, vacations by budget, and real answers to where can I travel with my budget.
              </p>
            </div>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {relatedTiers.slice(0, 6).map((relatedTier) => (
                <Link
                  key={relatedTier.slug}
                  href={getDestinationBudgetPath(relatedTier)}
                  className="rounded-xl border border-slate-200 bg-white p-4 transition hover:border-[#14B8A6]/50"
                >
                  <span className="text-sm font-semibold text-[#0B1D34]">{relatedTier.label}</span>
                  <span className="mt-1 block text-sm text-slate-600">
                    Browse destinations under ${relatedTier.amount.toLocaleString("en-CA")}
                  </span>
                </Link>
              ))}
            </div>
          </div>
          <aside>
            <div className="lg:sticky lg:top-28">
              <h2 className="text-2xl font-semibold tracking-tight text-slate-950">Common questions</h2>
              <div className="mt-5 divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white">
                {faqItems.map((item) => (
                  <details key={item.question} className="group p-5 open:bg-slate-50">
                    <summary className="cursor-pointer list-none text-base font-semibold text-slate-950">
                      {item.question}
                    </summary>
                    <p className="mt-3 text-sm leading-6 text-slate-600">{item.answer}</p>
                  </details>
                ))}
              </div>
            </div>
          </aside>
        </section>
      </main>
    </>
  );
}

function DestinationCard({
  match,
  tier,
}: {
  match: DestinationBudgetMatch & { origin: { city: string; code: string; slug: string } };
  tier: DestinationBudgetTier;
}) {
  const destinationLabel = getCityCountryLabel(match.destination);

  return (
    <article className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md">
      <div className="relative h-56">
        <Image
          src={match.destination.image}
          alt={`${destinationLabel} affordable destination under ${tier.amount}`}
          fill
          sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 to-transparent" />
        <Badge className="absolute left-4 top-4 rounded-full bg-[#0B1D34] px-3 py-1 text-xs font-bold uppercase text-white">
          From {match.origin.city}
        </Badge>
      </div>
      <div className="p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          {getDestinationCountryName(match.destination)} · {match.durationDays} days · {formatBudgetTravelStyle(match.travelStyle)}
        </p>
        <h3 className="mt-2 text-xl font-semibold text-slate-950">{destinationLabel}</h3>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">{match.destination.shortDescription}</p>
        <div className="mt-5 grid grid-cols-3 gap-2 text-center">
          <CompactMetric label="Flight" value={formatMoney(match.flightEstimate, "CAD")} />
          <CompactMetric label="Daily" value={formatMoney(match.dailyEstimate, "CAD")} />
          <CompactMetric label="Left" value={formatMoney(match.budgetRemaining, "CAD")} />
        </div>
        <div className="mt-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Estimated total</p>
            <p className="text-2xl font-bold text-[#0B1D34]">{formatMoney(match.totalEstimate, "CAD")}</p>
          </div>
          <Link
            href={`/destinations/${match.destination.slug}`}
            aria-label={`View ${destinationLabel} budget guide`}
            className="flex size-11 items-center justify-center rounded-full bg-[#14B8A6]/10 text-[#0B1D34] transition hover:bg-[#0B1D34] hover:text-white"
          >
            <ArrowRight className="size-5" />
          </Link>
        </div>
      </div>
    </article>
  );
}

function TierMetric({
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
      <p className="mt-1 text-sm font-semibold capitalize text-white">{value}</p>
    </div>
  );
}

function SummaryMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-2 text-lg font-semibold text-slate-950">{value}</p>
    </div>
  );
}

function CompactMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-slate-50 p-3">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-bold text-slate-950">{value}</p>
    </div>
  );
}

function createFaqs(
  tier: DestinationBudgetTier,
  bestMatch: (DestinationBudgetMatch & { origin: { city: string } }) | null
) {
  const budgetLabel = formatMoney(tier.amount, "CAD");

  return [
    {
      question: `Where can I travel with ${budgetLabel}?`,
      answer: bestMatch
        ? `${getCityCountryLabel(bestMatch.destination)} from ${bestMatch.origin.city} is one current GoByBudget match under ${budgetLabel}, based on ${bestMatch.durationDays} days and ${formatBudgetTravelStyle(bestMatch.travelStyle)} travel assumptions.`
        : `Current GoByBudget matches depend on departure city, duration, and travel style. Try a shorter trip or budget style if few destinations fit ${budgetLabel}.`,
    },
    {
      question: `Does this ${budgetLabel} budget include flights?`,
      answer:
        "Yes. The estimates include round-trip flight assumptions plus accommodation, food, local transport, activities, and miscellaneous daily costs.",
    },
    {
      question: "Why do departure city and duration change the destination list?",
      answer:
        "Flight estimates vary by origin, while accommodation, food, transport, activities, and buffer scale with trip length and travel style.",
    },
  ];
}

function toResultsStyle(style: DestinationBudgetTier["travelStyle"]) {
  if (style === "luxury") {
    return "comfort";
  }

  if (style === "midRange") {
    return "balanced";
  }

  return "budget";
}
