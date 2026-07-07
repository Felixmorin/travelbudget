import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowRight, CalendarDays, Plane, ReceiptText, WalletCards } from "lucide-react";

import { TrackedLink } from "@/components/analytics/tracked-link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  formatMoney,
  getDestinationCostBreakdown,
  getDestinationTripEstimate,
  getFlightEstimate,
  getTravelStyleCosts,
} from "@/lib/data/destinations";
import { getLongTailGuide, longTailGuides } from "@/lib/data/guides";
import { getCityCountryLabel, getUnifiedDestination, unifiedDestinations } from "@/lib/data/unified-destinations";
import { createMetadata } from "@/lib/seo/metadata";
import {
  createBreadcrumbSchema,
  createFAQSchema,
  createGuideArticleSchema,
  createItemListSchema,
  serializeJsonLd,
} from "@/lib/seo/schema";

type GuidePageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return longTailGuides.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({ params }: GuidePageProps): Promise<Metadata> {
  const { slug } = await params;
  const guide = getLongTailGuide(slug);

  if (!guide) {
    return createMetadata({
      title: "Guide Not Found",
      description: "This TravelBudget.ai guide could not be found.",
      path: `/guides/${slug}`,
      noIndex: true,
    });
  }

  return createMetadata({
    title: guide.title,
    description: guide.summary,
    path: `/guides/${guide.slug}`,
    image: guide.image,
    imageAlt: guide.imageAlt,
  });
}

export default async function LongTailGuidePage({ params }: GuidePageProps) {
  const { slug } = await params;
  const guide = getLongTailGuide(slug);

  if (!guide) {
    notFound();
  }

  const destination = guide.destinationSlug ? getUnifiedDestination(guide.destinationSlug) : null;
  const path = `/guides/${guide.slug}`;
  const costSnapshot = destination
    ? getGuideCostSnapshot({
        destination,
        originCode: guide.originCode,
        durationDays: guide.durationDays,
        travelStyle: guide.travelStyle,
        travelers: guide.travelers,
      })
    : null;
  const budgetMatches = guide.budgetTarget
    ? getBudgetMatches({
        budgetTarget: guide.budgetTarget,
        originCode: guide.originCode,
        durationDays: guide.durationDays,
        travelStyle: guide.travelStyle,
        travelers: guide.travelers,
      })
    : [];
  const relatedGuides = longTailGuides
    .filter((candidate) => candidate.slug !== guide.slug && candidate.category === guide.category)
    .slice(0, 3);
  const jsonLd = [
    createGuideArticleSchema({
      title: guide.title,
      description: guide.summary,
      path,
      image: guide.image,
      datePublished: "2026-07-07",
      dateModified: "2026-07-07",
    }),
    createFAQSchema(guide.faqs),
    createBreadcrumbSchema([
      { name: "Home", url: "/" },
      { name: "Guides", url: "/guides" },
      { name: guide.title, url: path },
    ]),
    ...(budgetMatches.length > 0
      ? [
          createItemListSchema(
            budgetMatches.map((match) => ({
              name: getCityCountryLabel(match.destination),
              url: `/destinations/${match.destination.slug}`,
              description: `${match.totalLabel} estimated for ${guide.durationDays} days from ${guide.originCity}.`,
            }))
          ),
        ]
      : []),
  ];

  return (
    <main className="bg-slate-50 text-slate-950">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(jsonLd),
        }}
      />
      <section className="relative isolate min-h-[460px] overflow-hidden">
        <Image src={guide.image} alt={guide.imageAlt} fill priority sizes="100vw" className="-z-10 object-cover" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-slate-950/85 via-slate-950/55 to-slate-950/20" />
        <div className="mx-auto flex min-h-[460px] max-w-5xl items-end px-4 py-12 sm:px-6 lg:px-8">
          <div className="max-w-3xl text-white">
            <Badge className="mb-4 bg-white text-blue-700">{guide.category}</Badge>
            <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">{guide.title}</h1>
            <p className="mt-5 text-lg leading-8 text-white/85">{guide.summary}</p>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-5xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_280px] lg:px-8">
        <article className="grid gap-6">
          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">Search intent</p>
            <p className="mt-2 text-lg leading-8 text-slate-700">{guide.intent}</p>
          </div>

          <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold">Quick answer</h2>
            <p className="mt-4 leading-8 text-slate-600">{guide.quickAnswer}</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <GuideMetric icon={Plane} label="Origin" value={`${guide.originCity} (${guide.originCode})`} />
              <GuideMetric icon={CalendarDays} label="Trip length" value={`${guide.durationDays} days`} />
              <GuideMetric icon={WalletCards} label="Style" value={formatTravelStyle(guide.travelStyle)} />
            </div>
          </section>

          {costSnapshot ? (
            <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">Estimated cost snapshot</p>
                  <h2 className="mt-2 text-2xl font-semibold">
                    {costSnapshot.totalLabel} for {getCityCountryLabel(costSnapshot.destination)}
                  </h2>
                </div>
                <span className="text-sm font-medium text-slate-500">CAD planning estimate</span>
              </div>
              <dl className="mt-6 grid gap-3 sm:grid-cols-2">
                <CostItem label="Flights" value={costSnapshot.breakdown.flights} />
                <CostItem label="Accommodation" value={costSnapshot.breakdown.accommodation} />
                <CostItem label="Food" value={costSnapshot.breakdown.food} />
                <CostItem label="Local transport" value={costSnapshot.breakdown.localTransport} />
                <CostItem label="Activities" value={costSnapshot.breakdown.activities} />
                <CostItem label="Miscellaneous" value={costSnapshot.breakdown.misc} />
              </dl>
              <p className="mt-5 text-sm leading-6 text-slate-600">
                Daily baseline: {costSnapshot.dailyLabel} per traveler before flights. Flight planning range from{" "}
                {guide.originCity}: {costSnapshot.flightLowLabel} to {costSnapshot.flightHighLabel}.
              </p>
            </section>
          ) : null}

          {budgetMatches.length > 0 ? (
            <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-semibold">
                Destinations that can fit under {formatMoney(guide.budgetTarget ?? 0, "CAD")}
              </h2>
              <p className="mt-3 leading-7 text-slate-600">
                These matches use the same origin, trip length, and travel style as this guide. They are planning
                estimates, not live fares.
              </p>
              <div className="mt-6 grid gap-3">
                {budgetMatches.slice(0, 6).map((match) => (
                  <Link
                    key={match.destination.slug}
                    href={`/destinations/${match.destination.slug}`}
                    className="rounded-lg border border-slate-200 p-4 transition hover:border-blue-300 hover:bg-blue-50"
                  >
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <h3 className="font-semibold">{getCityCountryLabel(match.destination)}</h3>
                        <p className="mt-1 text-sm text-slate-600">{match.destination.shortDescription}</p>
                      </div>
                      <span className="shrink-0 text-sm font-semibold text-blue-700">{match.totalLabel}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          ) : null}

          <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold">Cost planning notes</h2>
            <ul className="mt-4 grid gap-3">
              {guide.costNotes.map((note) => (
                <li key={note} className="flex gap-3 leading-7 text-slate-600">
                  <ReceiptText className="mt-1 size-5 shrink-0 text-blue-700" />
                  <span>{note}</span>
                </li>
              ))}
            </ul>
          </section>

          {guide.sections.map((section) => (
            <section key={section.heading} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-semibold">{section.heading}</h2>
              <p className="mt-4 leading-8 text-slate-600">{section.body}</p>
            </section>
          ))}

          <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold">Example itinerary structure</h2>
            <ol className="mt-4 grid gap-3">
              {guide.itinerary.map((item, index) => (
                <li key={item} className="flex gap-3 leading-7 text-slate-600">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700">
                    {index + 1}
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ol>
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold">Seasonality and timing</h2>
            <div className="mt-4 grid gap-3">
              {destination ? (
                <p className="rounded-lg bg-slate-50 p-4 text-sm leading-6 text-slate-600">
                  Best months for {getCityCountryLabel(destination)}: {destination.bestMonths.join(", ")}.{" "}
                  {destination.weather}
                </p>
              ) : null}
              {guide.seasonalNotes.map((note) => (
                <p key={note} className="rounded-lg bg-slate-50 p-4 text-sm leading-6 text-slate-600">
                  {note}
                </p>
              ))}
            </div>
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold">FAQ</h2>
            <div className="mt-4 grid gap-3">
              {guide.faqs.map((faq) => (
                <details key={faq.question} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <summary className="cursor-pointer font-semibold">{faq.question}</summary>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{faq.answer}</p>
                </details>
              ))}
            </div>
          </section>

          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold">Next planning step</h2>
            <p className="mt-4 leading-8 text-slate-600">
              Turn this guide into a concrete estimate by comparing dates, origin airports, travel style, and trip
              length in the TravelBudget calculator.
            </p>
            <Button asChild className="mt-5 rounded-lg bg-blue-600 text-white hover:bg-blue-700">
              <TrackedLink
                href="/tools/travel-budget-calculator"
                eventName="cta_clicked"
                eventProperties={{
                  page: `/guides/${guide.slug}`,
                  label: "Open calculator",
                  href: "/tools/travel-budget-calculator",
                  ctaLocation: "guide_body",
                }}
              >
                Open calculator
                <ArrowRight className="ml-2 size-4" />
              </TrackedLink>
            </Button>
          </div>
        </article>

        <aside className="grid h-fit gap-4 lg:sticky lg:top-24">
          {destination ? (
            <Link
              href={`/destinations/${destination.slug}`}
              className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-300"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">Destination profile</p>
              <p className="mt-2 text-lg font-semibold">{destination.name}</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">{destination.shortDescription}</p>
            </Link>
          ) : null}
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Planning links</p>
            <div className="mt-4 grid gap-3">
              {guide.internalLinks.map((item) => (
                <Link key={item.href} href={item.href} className="rounded-lg bg-slate-50 p-3 transition hover:bg-blue-50">
                  <span className="text-sm font-semibold text-blue-700">{item.label}</span>
                  <span className="mt-1 block text-xs leading-5 text-slate-600">{item.description}</span>
                </Link>
              ))}
            </div>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Related guides</p>
            <div className="mt-4 grid gap-3">
              {relatedGuides.map((relatedGuide) => (
                <Link key={relatedGuide.slug} href={`/guides/${relatedGuide.slug}`} className="text-sm font-semibold text-blue-700 hover:underline">
                  {relatedGuide.title}
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}

function GuideMetric({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg bg-slate-50 p-4">
      <Icon className="mb-2 size-5 text-blue-700" />
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 font-semibold">{value}</p>
    </div>
  );
}

function CostItem({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg bg-slate-50 p-4">
      <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</dt>
      <dd className="mt-1 text-lg font-semibold">{formatMoney(value, "CAD")}</dd>
    </div>
  );
}

function getGuideCostSnapshot({
  destination,
  originCode,
  durationDays,
  travelStyle,
  travelers,
}: {
  destination: NonNullable<ReturnType<typeof getUnifiedDestination>>;
  originCode?: string;
  durationDays?: number;
  travelStyle?: Parameters<typeof getTravelStyleCosts>[1];
  travelers?: number;
}) {
  const total = getDestinationTripEstimate(destination, {
    days: durationDays,
    originCode,
    travelStyle,
    travelers,
  });
  const breakdown = getDestinationCostBreakdown(destination, {
    days: durationDays,
    originCode,
    travelStyle,
    travelers,
  });
  const flight = getFlightEstimate(destination, originCode);
  const dailyCosts = getTravelStyleCosts(destination, travelStyle);
  const dailyTotal =
    dailyCosts.accommodation + dailyCosts.food + dailyCosts.localTransport + dailyCosts.activities + dailyCosts.misc;

  return {
    destination,
    total,
    totalLabel: formatMoney(total, "CAD"),
    breakdown,
    dailyLabel: formatMoney(dailyTotal, "CAD"),
    flightLowLabel: formatMoney(flight.low, "CAD"),
    flightHighLabel: formatMoney(flight.high, "CAD"),
  };
}

function getBudgetMatches({
  budgetTarget,
  originCode,
  durationDays,
  travelStyle,
  travelers,
}: {
  budgetTarget: number;
  originCode?: string;
  durationDays?: number;
  travelStyle?: Parameters<typeof getTravelStyleCosts>[1];
  travelers?: number;
}) {
  return unifiedDestinations
    .map((destination) => {
      const total = getDestinationTripEstimate(destination, {
        days: durationDays,
        originCode,
        travelStyle,
        travelers,
      });

      return {
        destination,
        total,
        totalLabel: formatMoney(total, "CAD"),
      };
    })
    .filter((item) => item.total <= budgetTarget)
    .sort((a, b) => a.total - b.total || b.destination.score - a.destination.score);
}

function formatTravelStyle(style: string | undefined) {
  if (style === "midRange") {
    return "Mid-range";
  }

  return style ? style.charAt(0).toUpperCase() + style.slice(1) : "Mid-range";
}
