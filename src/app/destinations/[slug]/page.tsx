import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowRight, CalendarDays, Home, Route, Search, Sparkles, WalletCards } from "lucide-react";

import { AnalyticsView } from "@/components/analytics/analytics-view";
import { TrackedLink } from "@/components/analytics/tracked-link";
import { AffiliateCard } from "@/components/site/affiliate-card";
import { BudgetBreakdown } from "@/components/site/budget-breakdown";
import { CTASection } from "@/components/site/cta-section";
import { EstimateDisclaimer } from "@/components/site/estimate-disclaimer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  type Destination,
  destinations,
  formatMoney,
  getDailyCostTotal,
  getDestination,
  getDestinationTripEstimate,
  getOriginPricing,
} from "@/lib/data/destinations";
import {
  cityDestinations,
  formatDestinationMoney,
  getCityDestination,
  type CityDestination,
} from "@/lib/data/destination-hub";
import { createDestinationMetadata, createMetadata } from "@/lib/seo/metadata";
import {
  createBreadcrumbSchema,
  createDestinationSchema,
  createFAQSchema,
  serializeJsonLd,
} from "@/lib/seo/schema";
import { destinationBudgetSeoSlugs, getTravelBudgetPath } from "@/lib/programmatic/seo-pages";

type DestinationPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return [
    ...destinations.map((destination) => ({ slug: destination.slug })),
    ...cityDestinations.map((destination) => ({ slug: destination.slug })),
  ];
}

export async function generateMetadata({ params }: DestinationPageProps): Promise<Metadata> {
  const { slug } = await params;
  const destination = getDestination(slug);

  if (!destination) {
    const cityDestination = getCityDestination(slug);

    if (cityDestination) {
      return createMetadata({
        title: `${cityDestination.city}, ${cityDestination.country} Travel Budget`,
        description: `See estimated travel costs for ${cityDestination.city}, including flights, stays, food, local transport, activities, and best months to visit.`,
        path: `/destinations/${cityDestination.slug}`,
        image: cityDestination.imageUrl,
        imageAlt: cityDestination.imageAlt,
      });
    }

    return createMetadata({
      title: "Destination Not Found",
      description: "This TravelBudget.ai destination budget guide could not be found.",
      path: `/destinations/${slug}`,
      noIndex: true,
    });
  }

  return createDestinationMetadata(destination);
}

export default async function DestinationPage({ params }: DestinationPageProps) {
  const { slug } = await params;
  const destination = getDestination(slug);

  if (!destination) {
    const cityDestination = getCityDestination(slug);

    if (cityDestination) {
      return <CityDestinationPage destination={cityDestination} />;
    }

    notFound();
  }

  const budgetInsight = getBudgetInsight(destination);
  const defaultOriginPricing = getOriginPricing(destination, "YUL");
  const dailyMidRangeTotal = getDailyCostTotal(destination, "midRange");
  const typicalEstimate = getDestinationTripEstimate(destination, {
    days: 10,
    originCode: "YUL",
    travelStyle: "midRange",
  });
  const hasSeoBudgetPage = destinationBudgetSeoSlugs.includes(destination.slug);
  const jsonLd = [
    createDestinationSchema(destination),
    createFAQSchema(destination.faqs),
    createBreadcrumbSchema([
      { name: "Home", url: "/" },
      { name: "Destinations", url: "/#destinations" },
      { name: destination.name, url: `/destinations/${destination.slug}` },
    ]),
  ];

  return (
    <>
      <AnalyticsView
        eventName="destination_viewed"
        eventProperties={{
          page: `/destinations/${destination.slug}`,
          destinationName: destination.name,
          destinationSlug: destination.slug,
          currency: destination.currency,
          originCode: "YUL",
          originCity: defaultOriginPricing.originCity,
          tripLength: 10,
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(jsonLd),
        }}
      />
      <section className="relative isolate min-h-[520px] overflow-hidden">
        <Image
          src={destination.image}
          alt={`${destination.name} landscape`}
          fill
          priority
          sizes="100vw"
          className="-z-10 object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-slate-950/80 via-slate-950/45 to-transparent" />
        <div className="mx-auto flex min-h-[520px] max-w-7xl items-end px-4 py-12 sm:px-6 lg:px-8">
          <div className="max-w-3xl text-white">
            <Badge className="mb-4 bg-white text-blue-600">{destination.countryCode} budget guide</Badge>
            <h1 className="text-5xl font-semibold tracking-tight sm:text-6xl">
              {destination.name} travel budget
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-white/85">{destination.shortDescription}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="rounded-xl bg-orange-500 text-white hover:bg-orange-600">
                <TrackedLink
                  href="/results"
                  eventName="cta_clicked"
                  eventProperties={{
                    page: `/destinations/${destination.slug}`,
                    destinationName: destination.name,
                    destinationSlug: destination.slug,
                    label: `Plan a trip to ${destination.name}`,
                    href: "/results",
                    ctaLocation: "destination_hero",
                  }}
                >
                  Plan a trip to {destination.name}
                  <ArrowRight className="ml-2 size-4" />
                </TrackedLink>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-xl bg-white/95 text-slate-950">
                <TrackedLink
                  href="/results"
                  eventName="cta_clicked"
                  eventProperties={{
                    page: `/destinations/${destination.slug}`,
                    destinationName: destination.name,
                    destinationSlug: destination.slug,
                    label: "Compare with other destinations",
                    href: "/results",
                    ctaLocation: "destination_hero",
                  }}
                >
                  Compare with other destinations
                  <Search className="ml-2 size-4" />
                </TrackedLink>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <main className="bg-slate-50">
        <section className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_380px] lg:px-8">
          <div className="grid gap-8">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Metric icon={WalletCards} label="Estimated total" value={formatMoney(typicalEstimate, destination.currency)} />
              <Metric icon={Sparkles} label="Budget score" value={`${destination.score}/100`} />
              <Metric icon={CalendarDays} label="Daily mid-range" value={formatMoney(dailyMidRangeTotal, destination.currency)} />
              <Metric icon={Route} label="Departure baseline" value={`${defaultOriginPricing.originCity} (${defaultOriginPricing.currency})`} />
            </div>

            <Card className="border-slate-200 bg-white shadow-lg shadow-slate-200/60">
              <CardHeader>
                <CardTitle className="text-xl text-slate-950">
                  Can I afford {destination.name}?
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-center">
                <div>
                  <Badge className={budgetInsight.badgeClassName}>{budgetInsight.label}</Badge>
                  <p className="mt-4 text-sm leading-6 text-slate-600">{budgetInsight.copy}</p>
                  <EstimateDisclaimer className="mt-4" />
                </div>
                <div className="rounded-2xl bg-slate-950 p-5 text-white">
                  <p className="text-xs uppercase tracking-wide text-white/60">Typical planning estimate</p>
                  <p className="mt-2 text-3xl font-semibold">
                    {formatMoney(typicalEstimate, destination.currency)}
                  </p>
                </div>
              </CardContent>
            </Card>

            <BudgetBreakdown destination={destination} />

            <Card className="border-slate-200 bg-white shadow-lg shadow-slate-200/60">
              <CardHeader>
                <CardTitle className="text-xl text-slate-950">Estimate confidence</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="flex flex-wrap items-center gap-3">
                  <Badge className={getDataConfidenceClassName(destination.dataConfidence)}>
                    {formatDataConfidence(destination.dataConfidence)} confidence
                  </Badge>
                  <span className="text-sm text-slate-500">Last updated {destination.lastUpdated}</span>
                </div>
                <ul className="grid gap-2 text-sm leading-6 text-slate-600">
                  {destination.sourceNotes.map((note) => (
                    <li key={note} className="flex gap-2">
                      <span className="mt-2 size-1.5 shrink-0 rounded-full bg-blue-600" />
                      <span>{note}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="border-slate-200 bg-white shadow-lg shadow-slate-200/60">
              <CardHeader>
                <CardTitle className="text-xl text-slate-950">
                  Best months to visit {destination.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-5">
                <div className="flex flex-wrap gap-2">
                  {destination.bestMonths.map((month) => (
                    <Badge key={month} variant="secondary" className="bg-blue-50 text-blue-700">
                      {month}
                    </Badge>
                  ))}
                </div>
                <div className="grid gap-3 rounded-2xl bg-slate-50 p-5 sm:grid-cols-[auto_1fr]">
                  <CalendarDays className="size-5 text-blue-600" />
                  <div>
                    <p className="font-semibold text-slate-950">{destination.weather}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      These months are highlighted because they typically balance comfort, seasonal value, and
                      easier planning windows for a {destination.travelStyles.join(", ").toLowerCase()} trip.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 bg-white shadow-lg shadow-slate-200/60">
              <CardHeader>
                <CardTitle className="text-xl text-slate-950">
                  {destination.name} itinerary preview
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4">
                {destination.itineraryPreview.map((item, index) => (
                  <div key={item} className="flex gap-4">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
                      {index + 1}
                    </span>
                    <p className="pt-1 text-sm leading-6 text-slate-600">{item}</p>
                  </div>
                ))}
                <p className="text-xs leading-5 text-slate-500">
                  Use this as a budget planning preview, not a full day-by-day itinerary.
                </p>
              </CardContent>
            </Card>

            <Card className="border-slate-200 bg-white">
              <CardHeader>
                <CardTitle className="text-xl text-slate-950">{destination.name} travel budget FAQ</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-5">
                {destination.faqs.map((faq) => (
                  <div key={faq.question}>
                    <h3 className="font-semibold text-slate-950">{faq.question}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-500">{faq.answer}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <div className="flex flex-wrap gap-3">
              <Button asChild variant="outline" className="rounded-xl bg-white">
                <TrackedLink
                  href="/"
                  eventName="cta_clicked"
                  eventProperties={{
                    page: `/destinations/${destination.slug}`,
                    destinationName: destination.name,
                    destinationSlug: destination.slug,
                    label: "Back to calculator",
                    href: "/",
                    ctaLocation: "destination_bottom_nav",
                  }}
                >
                  <Home className="mr-2 size-4" />
                  Back to calculator
                </TrackedLink>
              </Button>
              <Button asChild variant="outline" className="rounded-xl bg-white">
                <TrackedLink
                  href="/results"
                  eventName="cta_clicked"
                  eventProperties={{
                    page: `/destinations/${destination.slug}`,
                    destinationName: destination.name,
                    destinationSlug: destination.slug,
                    label: "Compare all destinations",
                    href: "/results",
                    ctaLocation: "destination_bottom_nav",
                  }}
                >
                  Compare all destinations
                  <ArrowRight className="ml-2 size-4" />
                </TrackedLink>
              </Button>
              {hasSeoBudgetPage ? (
                <Button asChild variant="outline" className="rounded-xl bg-white">
                  <TrackedLink
                    href={getTravelBudgetPath(destination.slug)}
                    eventName="cta_clicked"
                    eventProperties={{
                      page: `/destinations/${destination.slug}`,
                      destinationName: destination.name,
                      destinationSlug: destination.slug,
                      label: "Read budget methodology guide",
                      href: getTravelBudgetPath(destination.slug),
                      ctaLocation: "destination_bottom_nav",
                    }}
                  >
                    Read budget guide
                  </TrackedLink>
                </Button>
              ) : null}
            </div>
          </div>

          <aside className="grid h-fit gap-4 lg:sticky lg:top-24">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">Booking options</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-950">Book the core trip pieces</h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Planning links for flights, hotels, eSIM, activities, and insurance. Verify current prices before booking.
              </p>
            </div>
            {destination.affiliateLinks.map((link) => (
              <AffiliateCard key={link.type} destination={destination} link={link} />
            ))}
          </aside>
        </section>
      </main>
      <CTASection />
    </>
  );
}

function CityDestinationPage({ destination }: { destination: CityDestination }) {
  const planParams = new URLSearchParams({
    destination: destination.slug,
    budget: String(destination.estimatedTotalCost),
    days: String(destination.durationDays),
    from: destination.departureCity,
  });

  return (
    <main className="bg-slate-50">
      <section className="relative isolate min-h-[520px] overflow-hidden">
        <Image
          src={destination.imageUrl}
          alt={destination.imageAlt}
          fill
          priority
          sizes="100vw"
          className="-z-10 object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-slate-950/80 via-slate-950/50 to-slate-950/10" />
        <div className="mx-auto flex min-h-[520px] max-w-7xl items-end px-4 py-12 sm:px-6 lg:px-8">
          <div className="max-w-3xl text-white">
            <Badge className="mb-4 bg-white text-blue-600">
              {destination.continent} budget guide
            </Badge>
            <h1 className="text-5xl font-semibold tracking-tight sm:text-6xl">
              {destination.city}, {destination.country} travel budget
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-white/85">
              {destination.description}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="rounded-xl bg-orange-500 text-white hover:bg-orange-600">
                <TrackedLink
                  href={`/results?${planParams.toString()}`}
                  eventName="cta_clicked"
                  eventProperties={{
                    page: `/destinations/${destination.slug}`,
                    destinationName: destination.city,
                    destinationSlug: destination.slug,
                    label: `Plan this trip to ${destination.city}`,
                    href: `/results?${planParams.toString()}`,
                    ctaLocation: "city_destination_hero",
                  }}
                >
                  Plan this trip
                  <ArrowRight className="ml-2 size-4" />
                </TrackedLink>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-xl bg-white/95 text-slate-950">
                <TrackedLink
                  href="/destinations"
                  eventName="cta_clicked"
                  eventProperties={{
                    page: `/destinations/${destination.slug}`,
                    destinationName: destination.city,
                    destinationSlug: destination.slug,
                    label: "Compare destinations",
                    href: "/destinations",
                    ctaLocation: "city_destination_hero",
                  }}
                >
                  Compare destinations
                  <Search className="ml-2 size-4" />
                </TrackedLink>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_360px] lg:px-8">
        <div className="grid gap-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Metric
              icon={WalletCards}
              label="Estimated total"
              value={formatDestinationMoney(destination.estimatedTotalCost, destination.currency)}
            />
            <Metric
              icon={CalendarDays}
              label="Suggested duration"
              value={`${destination.durationDays} days`}
            />
            <Metric
              icon={Route}
              label="Daily estimate"
              value={formatDestinationMoney(destination.dailyBudgetEstimate, destination.currency)}
            />
            <Metric icon={Home} label="Departure baseline" value={destination.departureCity} />
          </div>

          <Card className="border-slate-200 bg-white shadow-lg shadow-slate-200/60">
            <CardHeader>
              <CardTitle className="text-xl text-slate-950">
                Cost estimate for {destination.city}
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <CityCostLine label="Flights" value={destination.flightEstimate} />
              <CityCostLine label="Stay" value={destination.stayEstimate} />
              <CityCostLine label="Food" value={destination.foodEstimate} />
              <CityCostLine label="Local transport" value={destination.localTransportEstimate} />
              <CityCostLine label="Activities" value={destination.activitiesEstimate} />
            </CardContent>
          </Card>

          <Card className="border-slate-200 bg-white shadow-lg shadow-slate-200/60">
            <CardHeader>
              <CardTitle className="text-xl text-slate-950">Best months and travel styles</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-5">
              <div>
                <p className="text-sm font-semibold text-slate-950">Best months</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {destination.bestMonths.map((month) => (
                    <Badge key={month} className="bg-blue-50 text-blue-700">
                      {month}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-950">Styles</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {destination.travelStyles.map((style) => (
                    <Badge key={style} className="bg-emerald-50 text-emerald-700">
                      {style}
                    </Badge>
                  ))}
                </div>
              </div>
              <p className="text-sm leading-6 text-slate-600">
                Estimated costs may vary based on dates and availability. Read more about the assumptions behind
                TravelBudget.ai estimates in our{" "}
                <TrackedLink
                  href="/methodology"
                  eventName="cta_clicked"
                  eventProperties={{
                    page: `/destinations/${destination.slug}`,
                    destinationName: destination.city,
                    destinationSlug: destination.slug,
                    label: "Methodology",
                    href: "/methodology",
                    ctaLocation: "city_destination_methodology_note",
                  }}
                  className="font-semibold text-blue-600 hover:underline"
                >
                  methodology
                </TrackedLink>
                .
              </p>
            </CardContent>
          </Card>
        </div>

        <aside className="grid gap-5">
          <Card className="border-slate-200 bg-white shadow-lg shadow-slate-200/60">
            <CardHeader>
              <CardTitle className="text-xl text-slate-950">Plan this trip</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="rounded-2xl bg-slate-950 p-5 text-white">
                <p className="text-xs uppercase tracking-wide text-white/60">Planning estimate</p>
                <p className="mt-2 text-3xl font-semibold">
                  {formatDestinationMoney(destination.estimatedTotalCost, destination.currency)}
                </p>
                <p className="mt-2 text-sm text-white/70">
                  From {destination.departureCity} for {destination.durationDays} days
                </p>
              </div>
              <Button asChild className="h-11 rounded-xl bg-blue-600 text-white hover:bg-blue-700">
                <TrackedLink
                  href={`/results?${planParams.toString()}`}
                  eventName="cta_clicked"
                  eventProperties={{
                    page: `/destinations/${destination.slug}`,
                    destinationName: destination.city,
                    destinationSlug: destination.slug,
                    label: "Plan this trip",
                    href: `/results?${planParams.toString()}`,
                    ctaLocation: "city_destination_sidebar",
                  }}
                >
                  Plan this trip
                  <ArrowRight className="ml-2 size-4" />
                </TrackedLink>
              </Button>
              <Button asChild variant="outline" className="h-11 rounded-xl">
                <TrackedLink
                  href="/destinations"
                  eventName="destination_card_clicked"
                  eventProperties={{
                    page: `/destinations/${destination.slug}`,
                    destinationName: destination.city,
                    destinationSlug: destination.slug,
                    source: "city_destination_sidebar",
                  }}
                >
                  Back to destinations
                </TrackedLink>
              </Button>
            </CardContent>
          </Card>
        </aside>
      </section>
    </main>
  );
}

function CityCostLine({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-1 text-xl font-semibold text-slate-950">{formatDestinationMoney(value, "CAD")}</p>
    </div>
  );
}

function Metric({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <Card className="border-slate-200 bg-white shadow-sm">
      <CardContent className="pt-5">
        <Icon className="mb-4 size-5 text-blue-600" />
        <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
        <p className="mt-1 text-lg font-semibold text-slate-950">{value}</p>
      </CardContent>
    </Card>
  );
}

function getBudgetInsight(destination: Destination) {
  if (destination.estimatedCost <= 1800) {
    return {
      label: "Budget-friendly",
      badgeClassName: "bg-teal-50 text-teal-700 ring-1 ring-teal-100",
      copy: `${destination.name} is one of the stronger value picks in this dataset. The total is kept down by lower typical daily costs, even if flights still matter.`,
    };
  }

  if (destination.estimatedCost <= 2300) {
    return {
      label: "Mid-range",
      badgeClassName: "bg-blue-50 text-blue-700 ring-1 ring-blue-100",
      copy: `${destination.name} fits a balanced budget when you watch flight timing and choose practical stays. It is realistic for travelers who want comfort without overspending.`,
    };
  }

  return {
    label: "Premium/stretch",
    badgeClassName: "bg-orange-50 text-orange-700 ring-1 ring-orange-100",
    copy: `${destination.name} is a stretch destination in this planning model. It can still work, but flights, hotels, or peak-season timing need closer control.`,
  };
}

function formatDataConfidence(confidence: Destination["dataConfidence"]) {
  return confidence.charAt(0).toUpperCase() + confidence.slice(1);
}

function getDataConfidenceClassName(confidence: Destination["dataConfidence"]) {
  if (confidence === "high") {
    return "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100";
  }

  if (confidence === "medium") {
    return "bg-blue-50 text-blue-700 ring-1 ring-blue-100";
  }

  return "bg-amber-50 text-amber-700 ring-1 ring-amber-100";
}
