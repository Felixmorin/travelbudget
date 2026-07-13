import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  Binoculars,
  CalendarDays,
  Camera,
  Compass,
  Home,
  Landmark,
  Mountain,
  Route,
  Search,
  Sparkles,
  Ticket,
  Utensils,
  WalletCards,
  Waves,
  Wine,
} from "lucide-react";

import { AnalyticsView } from "@/components/analytics/analytics-view";
import { TrackedLink } from "@/components/analytics/tracked-link";
import { DayByDayItinerary } from "@/components/destinations/day-by-day-itinerary";
import { AffiliateCard } from "@/components/site/affiliate-card";
import { BudgetBreakdown } from "@/components/site/budget-breakdown";
import { CTASection } from "@/components/site/cta-section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buildAffiliateLink } from "@/lib/affiliate/build-affiliate-link";
import {
  type Destination,
  formatMoney,
  getDailyCostTotal,
  getDestinationTripEstimate,
  getOriginPricing,
} from "@/lib/data/destinations";
import {
  countryDestinations as destinations,
  getCityCountryLabel,
  getUnifiedDestination,
  getUnifiedDestinationStaticParams,
} from "@/lib/data/unified-destinations";
import {
  cityDestinations,
  formatDestinationMoney,
  type CityDestination,
} from "@/lib/data/destination-hub";
import { createDestinationMetadata, createMetadata } from "@/lib/seo/metadata";
import {
  createBreadcrumbSchema,
  createDestinationSchema,
  createFAQSchema,
  serializeJsonLd,
} from "@/lib/seo/schema";
import {
  destinationBudgetSeoSlugs,
  getTravelBudgetPath,
  getTravelCostDurationPath,
} from "@/lib/programmatic/seo-pages";
import {
  activeProgrammaticOrigins,
  getProgrammaticBudgetPath,
  programmaticBudgetPages,
} from "@/lib/programmatic/budget-pages";
import { comparisonPages, getComparisonPath } from "@/lib/programmatic/comparison-pages";
import { getStrongSeoDestinationBudgetPath, strongSeoPages } from "@/lib/programmatic/strong-seo-pages";

type DestinationPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getUnifiedDestinationStaticParams();
}

export async function generateMetadata({ params }: DestinationPageProps): Promise<Metadata> {
  const { slug } = await params;
  const destination = getUnifiedDestination(slug);

  if (!destination) {
    return createMetadata({
      title: "Destination Not Found",
      description: "This GoByBudget.com destination budget guide could not be found.",
      path: `/destinations/${slug}`,
      noIndex: true,
    });
  }

  return createDestinationMetadata(destination);
}

export default async function DestinationPage({ params }: DestinationPageProps) {
  const { slug } = await params;
  const destination = getUnifiedDestination(slug);

  if (!destination) {
    notFound();
  }

  const destinationLabel = getCityCountryLabel(destination);
  const budgetInsight = getBudgetInsight(destination);
  const defaultOriginPricing = getOriginPricing(destination, "YUL");
  const dailyMidRangeTotal = getDailyCostTotal(destination, "midRange");
  const activityLink = destination.affiliateLinks.find((link) => link.type === "Activities");
  const builtActivityLink = activityLink
    ? buildAffiliateLink({ destination, link: activityLink })
    : undefined;
  const activityGuide = getDestinationActivityGuide(destination);
  const typicalEstimate = getDestinationTripEstimate(destination, {
    days: 10,
    originCode: "YUL",
    travelStyle: "midRange",
  });
  const planTripPath = getDestinationPlanPath(destination, typicalEstimate);
  const hasSeoBudgetPage = destinationBudgetSeoSlugs.includes(destination.slug);
  const destinationBudgetPath = getDestinationBudgetPlanningPath(destination.slug);
  const jsonLd = [
    createDestinationSchema(destination),
    createFAQSchema(destination.faqs),
    createBreadcrumbSchema([
      { name: "Home", url: "/" },
      { name: "Destinations", url: "/#destinations" },
      { name: destinationLabel, url: `/destinations/${destination.slug}` },
    ]),
  ];

  return (
    <>
      <AnalyticsView
        eventName="destination_viewed"
        eventProperties={{
          page: `/destinations/${destination.slug}`,
          destinationName: destinationLabel,
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
          alt={`${destinationLabel} landscape`}
          fill
          priority
          sizes="100vw"
          className="-z-10 object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-slate-950/80 via-slate-950/45 to-transparent" />
        <div className="mx-auto flex min-h-[520px] max-w-7xl items-end px-4 py-12 sm:px-6 lg:px-8">
          <div className="max-w-3xl text-white">
            <Badge className="mb-4 bg-white text-[#0B1D34]">{destination.countryCode} budget guide</Badge>
            <h1 className="text-5xl font-semibold tracking-tight sm:text-6xl">
              {destinationLabel} travel budget
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-white/85">{destination.shortDescription}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="rounded-xl bg-orange-500 text-white hover:bg-orange-600">
                <TrackedLink
                  href={planTripPath}
                  eventName="cta_clicked"
                  eventProperties={{
                    page: `/destinations/${destination.slug}`,
                    destinationName: destinationLabel,
                    destinationSlug: destination.slug,
                    label: `Plan a trip to ${destinationLabel}`,
                    href: planTripPath,
                    ctaLocation: "destination_hero",
                  }}
                >
                  Plan a trip to {destinationLabel}
                  <ArrowRight className="ml-2 size-4" />
                </TrackedLink>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-xl bg-white/95 text-slate-950">
                <TrackedLink
                  href={planTripPath}
                  eventName="cta_clicked"
                  eventProperties={{
                    page: `/destinations/${destination.slug}`,
                    destinationName: destinationLabel,
                    destinationSlug: destination.slug,
                    label: "Compare with other destinations",
                    href: planTripPath,
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
                  Can I afford {destinationLabel}?
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-center">
                <div>
                  <Badge className={budgetInsight.badgeClassName}>{budgetInsight.label}</Badge>
                  <p className="mt-4 text-sm leading-6 text-slate-600">{budgetInsight.copy}</p>
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

            <ActivityChoiceSection
              destination={destination}
              destinationLabel={destinationLabel}
              activityGuide={activityGuide}
              activityHref={activityLink?.href}
            />

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
                      <span className="mt-2 size-1.5 shrink-0 rounded-full bg-[#0B1D34]" />
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
                    <Badge key={month} variant="secondary" className="bg-[#14B8A6]/10 text-[#0B1D34]">
                      {month}
                    </Badge>
                  ))}
                </div>
                <div className="grid gap-3 rounded-2xl bg-slate-50 p-5 sm:grid-cols-[auto_1fr]">
                  <CalendarDays className="size-5 text-[#0B1D34]" />
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

            <DayByDayItinerary
              activityHref={builtActivityLink?.href}
              destination={destination}
            />

            {destination.slug === "japan" ? <JapanToursWidget destination={destination} /> : null}

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

            <Card className="border-slate-200 bg-white">
              <CardHeader>
                <CardTitle className="text-xl text-slate-950">Related {destination.name} planning pages</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <InternalPlanningLink
                  href={destinationBudgetPath}
                  label="Travel budget"
                  title={`${destination.name} travel budget`}
                />
                {[7, 10, 14].map((days) => (
                  <InternalPlanningLink
                    key={days}
                    href={getTravelCostDurationPath(destination.slug, days)}
                    label={`${days}-day cost`}
                    title={`${destination.name} cost for ${days} days`}
                  />
                ))}
                {getOriginBudgetLinks(destination).map((link) => (
                  <InternalPlanningLink
                    key={link.href}
                    href={link.href}
                    label="From origin"
                    title={link.title}
                  />
                ))}
                {getDestinationComparisonLinks(destination.slug).map((link) => (
                  <InternalPlanningLink
                    key={link.href}
                    href={link.href}
                    label="Comparison"
                    title={link.title}
                  />
                ))}
                {getStrongSeoLinks(destination.slug).map((link) => (
                  <InternalPlanningLink
                    key={link.href}
                    href={link.href}
                    label={link.label}
                    title={link.title}
                  />
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
                  href={planTripPath}
                  eventName="cta_clicked"
                  eventProperties={{
                    page: `/destinations/${destination.slug}`,
                    destinationName: destination.name,
                    destinationSlug: destination.slug,
                    label: "Compare all destinations",
                    href: planTripPath,
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
                    href={destinationBudgetPath}
                    eventName="cta_clicked"
                    eventProperties={{
                      page: `/destinations/${destination.slug}`,
                      destinationName: destination.name,
                      destinationSlug: destination.slug,
                      label: "Read budget methodology guide",
                      href: destinationBudgetPath,
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
            {activityLink ? (
              <Card className="border-orange-200 bg-orange-50 shadow-sm">
                <CardContent className="grid gap-4 pt-5">
                  <div className="flex items-start gap-3">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-orange-500 text-white">
                      <Ticket className="size-5" />
                    </span>
                    <div>
                      <p className="font-semibold text-slate-950">Build the activity shortlist first</p>
                      <p className="mt-1 text-sm leading-6 text-slate-600">
                        {destination.name} has several trip styles. Pick the experiences that matter before you lock hotels or internal routes.
                      </p>
                    </div>
                  </div>
                  <Button asChild className="h-11 rounded-xl bg-orange-500 text-white hover:bg-orange-600">
                    <TrackedLink
                      href={activityLink.href}
                      eventName="cta_clicked"
                      eventProperties={{
                        page: `/destinations/${destination.slug}`,
                        destinationName: destination.name,
                        destinationSlug: destination.slug,
                        label: `Browse ${destination.name} activities`,
                        href: activityLink.href,
                        ctaLocation: "destination_sidebar_activity_boost",
                      }}
                      target="_blank"
                      rel="sponsored noopener noreferrer"
                    >
                      Browse activities
                      <ArrowRight className="ml-2 size-4" />
                    </TrackedLink>
                  </Button>
                </CardContent>
              </Card>
            ) : null}
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

type ActivitySuggestion = {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  idealFor: string;
  budgetLevel: "Low" | "Medium" | "High";
  timing: string;
};

type ActivityGuide = {
  intro: string;
  suggestions: ActivitySuggestion[];
};

const defaultActivityGuide: ActivityGuide = {
  intro: "Use these activity ideas to decide what kind of trip is worth pricing before you book flights and stays.",
  suggestions: [
    {
      title: "City highlights and food walks",
      description: "A practical first-day option for getting oriented, sampling local food, and learning which neighborhoods are worth revisiting.",
      icon: Utensils,
      idealFor: "First-time visitors",
      budgetLevel: "Medium",
      timing: "First 48 hours",
    },
    {
      title: "Museum, history, and culture passes",
      description: "Best when the destination has major museums, historic centers, guided sites, or skip-the-line tickets that save time.",
      icon: Landmark,
      idealFor: "Culture trips",
      budgetLevel: "Low",
      timing: "Rainy or arrival days",
    },
    {
      title: "Nature day trips",
      description: "Good for adding scenery without changing hotels, especially when guided transport avoids expensive car rentals.",
      icon: Mountain,
      idealFor: "Short stays",
      budgetLevel: "High",
      timing: "Middle of trip",
    },
    {
      title: "Viewpoints and photo routes",
      description: "Low-commitment activities that can fill half days while keeping the activity budget under control.",
      icon: Camera,
      idealFor: "Budget control",
      budgetLevel: "Low",
      timing: "Flexible",
    },
  ],
};

const destinationActivityGuides: Record<string, ActivityGuide> = {
  chile: {
    intro: "Chile converts best as a choice-driven trip: travelers need to decide whether the budget goes toward desert, wine, coast, Patagonia, or city experiences.",
    suggestions: [
      {
        title: "Santiago city, markets, and viewpoints",
        description: "Start with neighborhoods, food markets, Cerro San Cristobal, museums, and a guided city walk before committing to longer transfers.",
        icon: Landmark,
        idealFor: "First day planning",
        budgetLevel: "Low",
        timing: "1 day",
      },
      {
        title: "Valparaiso and Viña del Mar coast",
        description: "A strong day-trip choice for street art, hillside elevators, Pacific views, seafood, and colorful port-city photography.",
        icon: Waves,
        idealFor: "Culture + coast",
        budgetLevel: "Medium",
        timing: "Full day",
      },
      {
        title: "Casablanca or Maipo Valley wine tour",
        description: "A conversion-friendly add-on for couples and food travelers who want a polished day without building a full road-trip itinerary.",
        icon: Wine,
        idealFor: "Couples",
        budgetLevel: "Medium",
        timing: "Half or full day",
      },
      {
        title: "Atacama desert landscapes",
        description: "Salt flats, geysers, lagoons, moonlike valleys, and stargazing are usually worth a separate flight and a larger activity budget.",
        icon: Compass,
        idealFor: "Adventure",
        budgetLevel: "High",
        timing: "3-4 days",
      },
      {
        title: "Patagonia and Torres del Paine",
        description: "The biggest-ticket Chile experience: build the budget around flights, park logistics, guided hikes, and weather buffers.",
        icon: Mountain,
        idealFor: "Bucket-list nature",
        budgetLevel: "High",
        timing: "4-7 days",
      },
      {
        title: "Astronomy and night-sky tours",
        description: "Northern Chile is one of the best places to make a single evening feel memorable without adding another destination.",
        icon: Binoculars,
        idealFor: "Unique experience",
        budgetLevel: "Medium",
        timing: "Evening",
      },
    ],
  },
};

function ActivityChoiceSection({
  destination,
  destinationLabel,
  activityGuide,
  activityHref,
}: {
  destination: Destination;
  destinationLabel: string;
  activityGuide: ActivityGuide;
  activityHref?: string;
}) {
  return (
    <Card className="border-slate-200 bg-white shadow-lg shadow-slate-200/60">
      <CardHeader>
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-orange-600">Activities that shape the trip</p>
            <CardTitle className="mt-2 text-2xl text-slate-950">
              Choose what to do in {destinationLabel}
            </CardTitle>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">{activityGuide.intro}</p>
          </div>
          {activityHref ? (
            <Button asChild className="h-11 rounded-xl bg-orange-500 text-white hover:bg-orange-600">
              <TrackedLink
                href={activityHref}
                eventName="cta_clicked"
                eventProperties={{
                  page: `/destinations/${destination.slug}`,
                  destinationName: destination.name,
                  destinationSlug: destination.slug,
                  label: `Browse ${destination.name} activities`,
                  href: activityHref,
                  ctaLocation: "destination_activity_section",
                }}
                target="_blank"
                rel="sponsored noopener noreferrer"
              >
                Browse live activities
                <ArrowRight className="ml-2 size-4" />
              </TrackedLink>
            </Button>
          ) : null}
        </div>
      </CardHeader>
      <CardContent className="grid gap-5">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {activityGuide.suggestions.map((activity) => (
            <article key={activity.title} className="rounded-xl border border-slate-200 bg-slate-50 p-5">
              <div className="flex items-start gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#0B1D34] ring-1 ring-slate-200">
                  <activity.icon className="size-5" />
                </span>
                <div>
                  <h3 className="font-semibold text-slate-950">{activity.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{activity.description}</p>
                </div>
              </div>
              <div className="mt-5 grid grid-cols-3 gap-2 text-xs">
                <ActivityMeta label="Best for" value={activity.idealFor} />
                <ActivityMeta label="Budget" value={activity.budgetLevel} />
                <ActivityMeta label="Timing" value={activity.timing} />
              </div>
            </article>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function ActivityMeta({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-white p-3 ring-1 ring-slate-200">
      <p className="font-semibold uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-1 font-semibold text-slate-900">{value}</p>
    </div>
  );
}

function getDestinationActivityGuide(destination: Destination): ActivityGuide {
  return destinationActivityGuides[destination.slug] ?? {
    ...defaultActivityGuide,
    suggestions: defaultActivityGuide.suggestions.map((activity) => ({
      ...activity,
      title: activity.title.replace("City", `${destination.name} city`),
    })),
  };
}

function JapanToursWidget({ destination }: { destination: Destination }) {
  const getYourGuideJapanUrl = "https://www.getyourguide.com/japan-l169034/?partner_id=4ZWE6DU";

  return (
    <Card className="border-slate-200 bg-white shadow-lg shadow-slate-200/60">
      <CardHeader>
        <div className="flex items-start gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
            <Ticket className="size-5" />
          </span>
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-orange-600">Tours and activities</p>
            <CardTitle className="mt-1 text-xl text-slate-950">Book Japan experiences with GetYourGuide</CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent className="grid gap-5">
        <div className="grid gap-3 text-sm leading-6 text-slate-600">
          <p>
            Compare Japan tours, tickets, food experiences, day trips, and cultural activities while keeping your
            activity budget in view. For a balanced first trip, travelers often pair Tokyo neighborhoods with Kyoto
            temples, Osaka food stops, and one or two guided day trips.
          </p>
          <p>
            Use the live widget below to check current options, then verify final availability, cancellation terms,
            and total price before booking.
          </p>
        </div>
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <div
            data-gyg-href="https://widget.getyourguide.com/default/city.frame"
            data-gyg-location-id="169034"
            data-gyg-locale-code="en-US"
            data-gyg-widget="city"
            data-gyg-partner-id="4ZWE6DU"
          />
          <noscript>
            <p className="text-sm leading-6 text-slate-600">
              JavaScript is required to display the live GetYourGuide city widget. You can still browse Japan tours
              directly on GetYourGuide.
            </p>
          </noscript>
        </div>
        <Button asChild variant="outline" className="w-fit rounded-xl bg-white">
          <a href={getYourGuideJapanUrl} target="_blank" rel="sponsored noopener noreferrer">
            Browse Japan tours
            <ArrowRight className="ml-2 size-4" />
          </a>
        </Button>
        <p className="text-xs leading-5 text-slate-500">
          GoByBudget.com may earn a commission from qualifying bookings. Activity prices are live partner prices and
          are separate from the static {destination.name} budget estimates above.
        </p>
      </CardContent>
      <Script
        id="getyourguide-japan-city-widget"
        src="https://widget.getyourguide.com/dist/pa.umd.production.min.js"
        data-gyg-partner-id="4ZWE6DU"
        strategy="lazyOnload"
      />
    </Card>
  );
}

export function CityDestinationPage({ destination }: { destination: CityDestination }) {
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
            <Badge className="mb-4 bg-white text-[#0B1D34]">
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
                    <Badge key={month} className="bg-[#14B8A6]/10 text-[#0B1D34]">
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
                GoByBudget.com estimates in our{" "}
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
                  className="font-semibold text-[#0B1D34] hover:underline"
                >
                  methodology
                </TrackedLink>
                .
              </p>
            </CardContent>
          </Card>

          <Card className="border-slate-200 bg-white shadow-lg shadow-slate-200/60">
            <CardHeader>
              <CardTitle className="text-xl text-slate-950">Related {destination.city} budget pages</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              {getParentCountryDestination(destination) ? (
                <InternalPlanningLink
                  href={`/destinations/${getParentCountryDestination(destination)?.slug}`}
                  label="Country guide"
                  title={`${destination.country} travel budget`}
                />
              ) : null}
              {getParentCountryDestination(destination) ? (
                <InternalPlanningLink
                  href={getDestinationBudgetPlanningPath(getParentCountryDestination(destination)!.slug)}
                  label="Travel budget"
                  title={`${destination.country} budget guide`}
                />
              ) : null}
              {activeProgrammaticOrigins.slice(0, 3).map((origin) => {
                const originPage = programmaticBudgetPages.find(
                  (page) => page.origin.slug === origin.slug && page.budget === 2500
                );

                return originPage ? (
                  <InternalPlanningLink
                    key={origin.slug}
                    href={getProgrammaticBudgetPath(originPage)}
                    label="From origin"
                    title={`Trips from ${origin.city} under $2,500`}
                  />
                ) : null;
              })}
              {getAlternativeCityLinks(destination).map((link) => (
                <InternalPlanningLink
                  key={link.href}
                  href={link.href}
                  label="Alternative city"
                  title={link.title}
                />
              ))}
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
                <p className="text-xs uppercase tracking-wide text-white/60">Estimated total</p>
                <p className="mt-2 text-3xl font-semibold">
                  {formatDestinationMoney(destination.estimatedTotalCost, destination.currency)}
                </p>
                <p className="mt-2 text-sm text-white/70">
                  From {destination.departureCity} for {destination.durationDays} days
                </p>
              </div>
              <Button asChild className="h-11 rounded-xl bg-[#0B1D34] text-white hover:bg-[#0B1D34]">
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

function InternalPlanningLink({
  href,
  label,
  title,
}: {
  href: string;
  label: string;
  title: string;
}) {
  return (
    <Link href={href} className="rounded-xl bg-slate-50 p-4 transition-colors hover:bg-[#14B8A6]/10">
      <p className="text-xs font-semibold uppercase tracking-wide text-[#0B1D34]">{label}</p>
      <p className="mt-1 font-semibold text-slate-950">{title}</p>
    </Link>
  );
}

function getOriginBudgetLinks(destination: Destination) {
  return activeProgrammaticOrigins
    .map((origin) => {
      const page = programmaticBudgetPages.find((candidate) => {
        if (candidate.origin.slug !== origin.slug) {
          return false;
        }

        const estimate = getDestinationTripEstimate(destination, {
          days: candidate.tripLengthDays,
          originCode: origin.code,
          travelStyle: candidate.travelStyle,
        });

        return estimate <= candidate.budget;
      });

      return page
        ? {
            href: getProgrammaticBudgetPath(page),
            title: `${destination.name} from ${origin.city} under ${formatMoney(page.budget, page.currency)}`,
          }
        : null;
    })
    .filter((link): link is { href: string; title: string } => Boolean(link))
    .slice(0, 3);
}

function getDestinationComparisonLinks(destinationSlug: string) {
  return comparisonPages
    .filter((page) => page.kind === "destination-pair" && page.destinationSlugs.includes(destinationSlug))
    .map((page) => ({
      href: getComparisonPath(page),
      title: page.title,
    }))
    .slice(0, 2);
}

function getStrongSeoLinks(destinationSlug: string) {
  return strongSeoPages
    .filter((page) => page.destinationSlug === destinationSlug && page.kind !== "destination-budget")
    .map((page) => ({
      href: page.path,
      label: page.kind === "itinerary" ? "Itinerary" : "From origin",
      title: page.title,
    }))
    .slice(0, 3);
}

function getDestinationBudgetPlanningPath(destinationSlug: string) {
  return getStrongSeoDestinationBudgetPath(destinationSlug) ?? getTravelBudgetPath(destinationSlug);
}

function getDestinationPlanPath(destination: Destination, budget: number) {
  const params = new URLSearchParams({
    budget: String(Math.round(budget)),
    currency: destination.currency,
    origin: "YUL",
    days: "10",
    month: (destination.bestMonths[0] ?? "october").toLowerCase(),
    travelers: "1",
    style: "balanced",
  });

  return `/results?${params.toString()}`;
}

function getParentCountryDestination(destination: CityDestination) {
  return destinations.find(
    (countryDestination) => countryDestination.name.toLowerCase() === destination.country.toLowerCase()
  );
}

function getAlternativeCityLinks(destination: CityDestination) {
  const sameCountry = cityDestinations.filter(
    (candidate) => candidate.slug !== destination.slug && candidate.country === destination.country
  );
  const sameStyle = cityDestinations.filter(
    (candidate) =>
      candidate.slug !== destination.slug &&
      candidate.country !== destination.country &&
      candidate.travelStyles.some((style) => destination.travelStyles.includes(style))
  );

  return [...sameCountry, ...sameStyle]
    .slice(0, 3)
    .map((candidate) => ({
      href: `/destinations/${candidate.slug}`,
      title: `${candidate.city}, ${candidate.country}`,
    }));
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
        <Icon className="mb-4 size-5 text-[#0B1D34]" />
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
      badgeClassName: "bg-[#14B8A6]/10 text-[#0B1D34] ring-1 ring-[#14B8A6]/20",
      copy: `${destination.name} fits a balanced budget when you watch flight timing and choose practical stays. It is realistic for travelers who want comfort without overspending.`,
    };
  }

  return {
    label: "Comfort/stretch",
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
    return "bg-[#14B8A6]/10 text-[#0B1D34] ring-1 ring-[#14B8A6]/20";
  }

  return "bg-amber-50 text-amber-700 ring-1 ring-amber-100";
}
