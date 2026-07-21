import Link from "next/link";
import {
  ArrowRight,
  BedDouble,
  Bus,
  CalendarDays,
  CircleDollarSign,
  Compass,
  MapPinned,
  Plane,
  TrendingDown,
  Utensils,
} from "lucide-react";

import { EmailCaptureForm } from "@/components/analytics/email-capture-form";
import { FlightAffiliateLink } from "@/components/affiliate/FlightAffiliateLink";
import { EstimateDisclaimer } from "@/components/site/estimate-disclaimer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatMoney } from "@/lib/format-money";
import { getDestinationIata } from "@/lib/affiliates/iata";
import { getCityCountryLabel } from "@/lib/data/unified-destinations";
import type { StrongSeoPage } from "@/lib/programmatic/strong-seo-pages";
import { createBreadcrumbSchema, createFAQSchema, createGuideArticleSchema, serializeJsonLd } from "@/lib/seo/schema";

export function StrongSeoTravelPage({ page }: { page: StrongSeoPage }) {
  const destinationLabel = getCityCountryLabel(page.destination);
  const totalLabel = formatMoney(page.estimate.total, "CAD");
  const expandedFaq = getExpandedFaq(page, destinationLabel);
  const jsonLd = [
    createGuideArticleSchema({
      title: page.title,
      description: page.metaDescription,
      path: page.path,
      image: page.destination.image,
      datePublished: "2026-07-09",
      dateModified: "2026-07-09",
    }),
    createFAQSchema(expandedFaq),
    createBreadcrumbSchema([
      { name: "Home", url: "/" },
      { name: getBreadcrumbParent(page.kind), url: getBreadcrumbParentPath(page.kind) },
      { name: page.title, url: page.path },
    ]),
  ];

  return (
    <main className="bg-[#f7f9fb] text-slate-950">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(jsonLd),
        }}
      />
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
          <nav aria-label="Breadcrumb" className="text-sm text-slate-500">
            <Link href="/" className="hover:text-[#0B1D34]">
              Home
            </Link>
            <span aria-hidden="true" className="mx-2">
              /
            </span>
            <Link href={getBreadcrumbParentPath(page.kind)} className="hover:text-[#0B1D34]">
              {getBreadcrumbParent(page.kind)}
            </Link>
          </nav>
          <Badge className="mt-6 rounded-full bg-[#14B8A6]/10 px-4 py-1 text-xs font-bold uppercase tracking-wider text-[#0B1D34]">
            {getKindLabel(page.kind)}
          </Badge>
          <div className="mt-5 grid gap-8 lg:grid-cols-[1fr_320px] lg:items-end">
            <div>
              <h1 className="max-w-4xl text-4xl font-semibold tracking-tight sm:text-6xl">{page.h1}</h1>
              <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
                {page.intro} Estimated total: <span className="font-semibold text-slate-950">{totalLabel} CAD</span>.
              </p>
            </div>
            <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Planning estimate</p>
              <p className="mt-2 text-4xl font-semibold text-[#0B1D34]">{totalLabel}</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {page.durationDays} days from {page.origin.city} ({page.origin.code}), one traveler, CAD.
              </p>
            </div>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <HeroPill icon={Plane} label={`From ${page.origin.city}`} />
            <HeroPill icon={CalendarDays} label={`${page.durationDays} days`} />
            <HeroPill icon={CircleDollarSign} label="CAD estimates" />
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_340px] lg:px-8">
        <div className="grid gap-6">
          <EstimateDisclaimer />

          <QuickAnswer page={page} destinationLabel={destinationLabel} totalLabel={totalLabel} />

          <section className="rounded-[24px] border border-slate-200 bg-white p-6">
            <h2 className="text-2xl font-semibold">Estimated budget breakdown</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              This is a planning estimate, not a live quote. Prices vary by season, travel dates, comfort level,
              exchange rates, booking timing, and availability.
            </p>
            <dl className="mt-6 grid gap-4 sm:grid-cols-2">
              <CostMetric icon={Plane} label="Flight" value={page.estimate.breakdown.flight} />
              <CostMetric icon={BedDouble} label="Hotel" value={page.estimate.breakdown.hotel} />
              <CostMetric icon={Utensils} label="Food" value={page.estimate.breakdown.food} />
              <CostMetric icon={Bus} label="Local transport" value={page.estimate.breakdown.localTransport} />
              <CostMetric icon={CalendarDays} label="Activities" value={page.estimate.breakdown.activities} />
              <CostMetric icon={CircleDollarSign} label="Buffer" value={page.estimate.breakdown.buffer} />
            </dl>
            <BudgetInterpretation page={page} />
          </section>

          <BudgetStyleComparison page={page} />

          <ContentSection title="Who this trip is best for">
            <ul className="grid gap-2">
              {page.bestFor.map((item) => (
                <li key={item} className="rounded-xl bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-700">
                  {item}
                </li>
              ))}
            </ul>
          </ContentSection>

          <ContentSection title="When to go for better prices">
            <p>{page.whenToGo}</p>
            <p className="mt-3">
              For {destinationLabel}, compare several departure dates before booking. Small shifts around weekends,
              school breaks, public holidays, and major events can change the total more than a daily meal budget.
            </p>
          </ContentSection>

          <OriginDepartureNotes page={page} destinationLabel={destinationLabel} />

          <DestinationGuideLink page={page} destinationLabel={destinationLabel} />

          <ContentSection title="How to lower the cost">
            <ul className="grid gap-3">
              {page.lowerCostTips.map((tip) => (
                <li key={tip} className="flex gap-3">
                  <span className="mt-2 size-2 rounded-full bg-[#14B8A6]" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </ContentSection>

          <MiniItinerary page={page} destinationLabel={destinationLabel} />

          <ContentSection title="What this estimate includes">
            <ul className="grid gap-3">
              {page.includes.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-2 size-2 rounded-full bg-[#0B1D34]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4">{page.assumptions}</p>
          </ContentSection>

          <section className="rounded-[24px] border border-slate-200 bg-white p-6">
            <h2 className="text-2xl font-semibold">FAQ</h2>
            <div className="mt-5 grid gap-4">
              {expandedFaq.map((faq) => (
                <div key={faq.question} className="rounded-2xl bg-slate-50 p-4">
                  <h3 className="font-semibold text-slate-950">{faq.question}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside className="grid h-fit gap-5 lg:sticky lg:top-24">
          <section className="min-w-0 rounded-[24px] border border-slate-200 bg-white p-6">
            <h2 className="text-xl font-semibold">Plan this trip</h2>
            <div className="mt-5 grid min-w-0 gap-3">
              <Button asChild className="h-auto min-h-8 w-full min-w-0 whitespace-normal rounded-full bg-[#0B1D34] px-4 py-2 text-center leading-5 text-white hover:bg-[#0B1D34]">
                <FlightAffiliateLink
                  origin={page.origin.city}
                  originIata={page.origin.code}
                  destination={destinationLabel}
                  destinationIata={getDestinationIata(page.destination)}
                  adults={page.travelers}
                  cabinClass="economy"
                  placement="article_inline"
                  pageType="strong_seo"
                >
                  Find flights for this trip
                  <ArrowRight className="ml-2 size-4" />
                </FlightAffiliateLink>
              </Button>
              <div className="min-w-0 rounded-2xl bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-950">Send me this trip budget</p>
                <div className="mt-3">
                  <EmailCaptureForm
                    buttonLabel="Send budget"
                    inputLabel="Email address"
                    eventProperties={{
                      page: page.path,
                      source: "strong_seo_page",
                      originCode: page.origin.code,
                      originCity: page.origin.city,
                      destinationSlug: page.destination.slug,
                      destinationName: destinationLabel,
                      budget: page.estimate.total,
                      currency: "CAD",
                      days: page.durationDays,
                      tripLength: page.durationDays,
                      travelers: page.travelers,
                      travelStyle: page.travelStyle,
                      ctaLocation: "seo_sidebar",
                    }}
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-[24px] border border-slate-200 bg-white p-6">
            <h2 className="text-xl font-semibold">Internal links</h2>
            <div className="mt-4 grid gap-3 text-sm font-semibold text-[#0B1D34]">
              <Link href="/travel-budget-calculator" className="hover:underline">
                Travel budget calculator
              </Link>
              <Link href="/destinations" className="hover:underline">
                Browse destinations
              </Link>
              <Link href="/methodology" className="hover:underline">
                Budget methodology
              </Link>
              <Link href={`/destinations/${page.destination.slug}`} className="hover:underline">
                {destinationLabel} destination guide
              </Link>
            </div>
          </section>

          {page.relatedPages.length > 0 ? (
            <section className="rounded-[24px] border border-slate-200 bg-white p-6">
              <h2 className="text-xl font-semibold">Related budget guides</h2>
              <div className="mt-4 grid gap-3">
                {page.relatedPages.map((relatedPage) => (
                  <Link
                    key={relatedPage.path}
                    href={relatedPage.path}
                    className="rounded-xl bg-slate-50 p-4 transition-colors hover:bg-[#14B8A6]/10"
                  >
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      {getKindLabel(relatedPage.kind)}
                    </p>
                    <p className="mt-1 text-sm font-bold leading-5 text-slate-950">{relatedPage.title}</p>
                  </Link>
                ))}
              </div>
            </section>
          ) : null}
        </aside>
      </section>
    </main>
  );
}

function QuickAnswer({
  page,
  destinationLabel,
  totalLabel,
}: {
  page: StrongSeoPage;
  destinationLabel: string;
  totalLabel: string;
}) {
  const largestCost = getLargestCostCategory(page);
  const largestShare = getCostShare(largestCost.value, page.estimate.total);
  const styleLabel = getTravelStyleLabel(page.travelStyle).toLowerCase();

  return (
    <section className="rounded-[24px] border border-[#14B8A6]/30 bg-[#14B8A6]/10 p-6">
      <p className="text-sm font-semibold uppercase tracking-wide text-[#0B1D34]">Quick answer</p>
      <p className="mt-3 text-base leading-7 text-slate-700">
        A {page.durationDays}-day {page.origin.city} to {destinationLabel} trip is estimated at{" "}
        <span className="font-semibold text-slate-950">{totalLabel} CAD</span> for one {styleLabel} traveler.
        The biggest cost is {largestCost.label.toLowerCase()} at {formatMoney(largestCost.value, "CAD")}, about{" "}
        {largestShare}% of the total, so this trip works best when that category is checked before the rest of
        the itinerary is locked.
      </p>
    </section>
  );
}

function DestinationGuideLink({
  page,
  destinationLabel,
}: {
  page: StrongSeoPage;
  destinationLabel: string;
}) {
  const destinationGuidePath = `/destinations/${page.destination.slug}`;

  return (
    <section className="rounded-[24px] border border-slate-200 bg-white p-6">
      <div className="grid gap-5 sm:grid-cols-[1fr_auto] sm:items-center">
        <div className="flex gap-3">
          <Compass className="mt-1 size-5 shrink-0 text-[#0B1D34]" />
          <div>
            <h2 className="text-2xl font-semibold text-slate-950">{destinationLabel} destination guide</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Use the destination guide for the broader planning context: best months, trip style, daily costs,
              itinerary ideas, booking options, and related budget pages before you commit to this route.
            </p>
          </div>
        </div>
        <Link
          href={destinationGuidePath}
          className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-[#0B1D34] transition hover:border-[#14B8A6]/50 hover:bg-[#14B8A6]/10"
        >
          Open guide
          <ArrowRight className="size-4" />
        </Link>
      </div>
    </section>
  );
}

function BudgetInterpretation({ page }: { page: StrongSeoPage }) {
  const flightShare = getCostShare(page.estimate.breakdown.flight, page.estimate.total);
  const hotelShare = getCostShare(page.estimate.breakdown.hotel, page.estimate.total);
  const afterFlights = Math.max(0, page.estimate.total - page.estimate.breakdown.flight);
  const dailyAfterFlights = Math.round(afterFlights / page.durationDays);
  const largestCost = getLargestCostCategory(page);

  return (
    <div className="mt-6 rounded-2xl bg-slate-50 p-5 text-sm leading-6 text-slate-600">
      <p>
        {largestCost.label} is the main budget swing on this page. Flights represent about {flightShare}% of the
        estimate, while accommodation represents about {hotelShare}%. After flights, the plan leaves roughly{" "}
        <span className="font-semibold text-slate-950">{formatMoney(dailyAfterFlights, "CAD")} per day</span> for
        stays, meals, local transport, activities, and buffer.
      </p>
    </div>
  );
}

function BudgetStyleComparison({ page }: { page: StrongSeoPage }) {
  const rows = [
    {
      style: "Budget",
      estimate: page.styleEstimates.budget,
      detail: "Simpler stays, more casual meals, fewer paid tours, and tighter date flexibility.",
      value: "budget",
    },
    {
      style: "Mid-range",
      estimate: page.styleEstimates.midRange,
      detail: "The current baseline for balanced comfort, practical hotel choices, and selective activities.",
      value: "midRange",
    },
    {
      style: "Comfort",
      estimate: page.styleEstimates.luxury,
      detail: "Better hotel location, more restaurants, more paid experiences, and a larger margin for convenience.",
      value: "luxury",
    },
  ];

  return (
    <section className="overflow-hidden rounded-[24px] border border-slate-200 bg-white">
      <div className="border-b border-slate-200 p-6">
        <div className="flex items-start gap-3">
          <TrendingDown className="mt-1 size-5 text-[#0B1D34]" />
          <div>
            <h2 className="text-2xl font-semibold">Can this trip be done cheaper?</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Use the style comparison as a planning range before checking live flights and lodging.
            </p>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
            <tr>
              <th scope="col" className="px-6 py-3">
                Style
              </th>
              <th scope="col" className="px-6 py-3">
                Estimate
              </th>
              <th scope="col" className="px-6 py-3">
                What changes
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {rows.map((row) => (
              <tr key={row.style}>
                <td className="whitespace-nowrap px-6 py-4 font-semibold text-slate-950">
                  {row.style}
                  {row.value === page.travelStyle ? (
                    <span className="ml-2 rounded-full bg-[#14B8A6]/10 px-2 py-1 text-xs text-[#0B1D34]">
                      Current
                    </span>
                  ) : null}
                </td>
                <td className="whitespace-nowrap px-6 py-4 font-semibold text-[#0B1D34]">
                  {formatMoney(row.estimate, "CAD")}
                </td>
                <td className="min-w-[260px] px-6 py-4 leading-6 text-slate-600">{row.detail}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function OriginDepartureNotes({
  page,
  destinationLabel,
}: {
  page: StrongSeoPage;
  destinationLabel: string;
}) {
  return (
    <ContentSection title={`${page.origin.city} departure notes`}>
      <div className="flex gap-3">
        <Plane className="mt-1 size-5 shrink-0 text-[#0B1D34]" />
        <div>
          <p>
            Build the search around total trip time, baggage rules, and connection quality, not only the lowest fare
            from {page.origin.code}. A cheaper route to {destinationLabel} can become more expensive if it adds an
            overnight connection, extra bags, paid seat selection, or a difficult airport transfer.
          </p>
          <p className="mt-3">
            If the estimate is close to your limit, compare a few weekday departures and return dates before changing
            the destination. For long-haul or one-stop routes, flight timing can move the total more than small daily
            savings once you arrive.
          </p>
        </div>
      </div>
    </ContentSection>
  );
}

function MiniItinerary({
  page,
  destinationLabel,
}: {
  page: StrongSeoPage;
  destinationLabel: string;
}) {
  const itineraryItems = getMiniItineraryItems(page, destinationLabel);

  return (
    <ContentSection title={`${page.durationDays}-day budget itinerary shape`}>
      <div className="grid gap-3">
        {itineraryItems.map((item) => (
          <div key={item.label} className="rounded-2xl bg-slate-50 p-4">
            <div className="flex items-start gap-3">
              <MapPinned className="mt-1 size-5 shrink-0 text-[#0B1D34]" />
              <div>
                <h3 className="font-semibold text-slate-950">{item.label}</h3>
                <p className="mt-1">{item.body}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <p className="mt-4">
        This is not a fixed itinerary. It shows how to protect the budget by grouping neighborhoods, day trips, and
        paid activities instead of stacking expensive experiences every day.
      </p>
    </ContentSection>
  );
}

function CostMetric({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <Icon className="size-5 text-[#0B1D34]" />
      <dt className="mt-3 text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</dt>
      <dd className="mt-1 text-xl font-semibold text-slate-950">{formatMoney(value, "CAD")}</dd>
    </div>
  );
}

function getLargestCostCategory(page: StrongSeoPage) {
  const categories = [
    { label: "Flight", value: page.estimate.breakdown.flight },
    { label: "Hotel", value: page.estimate.breakdown.hotel },
    { label: "Food", value: page.estimate.breakdown.food },
    { label: "Activities", value: page.estimate.breakdown.activities },
    { label: "Local transport", value: page.estimate.breakdown.localTransport },
  ];

  return categories.toSorted((a, b) => b.value - a.value)[0];
}

function getCostShare(value: number, total: number) {
  if (total <= 0) {
    return 0;
  }

  return Math.round((value / total) * 100);
}

function getMiniItineraryItems(page: StrongSeoPage, destinationLabel: string) {
  const preview = page.destination.itineraryPreview;
  const coreOne = preview[0] ?? `${destinationLabel} neighborhoods, food stops, and orientation walks`;
  const coreTwo = preview[1] ?? `A focused day trip or secondary area near ${destinationLabel}`;
  const coreThree = preview[2] ?? "A slower final day with flexible meals, shopping, and airport timing";

  if (page.durationDays <= 7) {
    return [
      {
        label: "Day 1",
        body: `Arrive from ${page.origin.city}, keep the first transfer simple, and choose a low-pressure meal near the stay.`,
      },
      {
        label: "Days 2-3",
        body: coreOne,
      },
      {
        label: "Days 4-5",
        body: coreTwo,
      },
      {
        label: `Days 6-${page.durationDays}`,
        body: coreThree,
      },
    ];
  }

  return [
    {
      label: "Day 1",
      body: `Arrive from ${page.origin.city}, settle in, and keep the first evening flexible after the flight.`,
    },
    {
      label: "Days 2-4",
      body: coreOne,
    },
    {
      label: "Days 5-7",
      body: coreTwo,
    },
    {
      label: `Days 8-${page.durationDays}`,
      body: coreThree,
    },
  ];
}

function getExpandedFaq(page: StrongSeoPage, destinationLabel: string) {
  const afterFlights = Math.max(0, page.estimate.total - page.estimate.breakdown.flight);
  const dailyAfterFlights = Math.round(afterFlights / page.durationDays);
  const cheapestStyle = page.styleEstimates.budget;
  const isOriginDestination = page.kind === "origin-destination";
  const additionalFaq = [
    {
      question: `How much should I budget per day in ${destinationLabel} after flights?`,
      answer: `After the flight estimate, this page leaves about ${formatMoney(dailyAfterFlights, "CAD")} per day for accommodation, food, local transport, activities, and buffer. That daily amount assumes ${getTravelStyleLabel(page.travelStyle).toLowerCase()} choices and should be checked against live hotel rates before booking.`,
    },
    {
      question: `Can I lower this ${destinationLabel} trip estimate?`,
      answer: `Usually, yes. The budget-style version is estimated around ${formatMoney(cheapestStyle, "CAD")} for the same duration and origin. The easiest levers are simpler accommodation, fewer paid tours, flexible dates, and keeping the itinerary focused.`,
    },
    {
      question: `What costs are not guaranteed in this estimate?`,
      answer:
        "The estimate is not a live booking quote. It can change with airfare, lodging availability, baggage, exchange rates, major events, airport transfers, card fees, travel insurance, and traveler-specific choices.",
    },
  ];

  if (!isOriginDestination) {
    return [...page.faq, ...additionalFaq];
  }

  return [
    ...page.faq,
    {
      question: `Is ${page.durationDays} days enough for ${destinationLabel} from ${page.origin.city}?`,
      answer: `${page.durationDays} days can work if the route is focused and the first day accounts for arrival timing. If flights from ${page.origin.code} are expensive, adding days may improve value per day but will still raise the total budget.`,
    },
    {
      question: `Should I compare other departure options near ${page.origin.city}?`,
      answer: `It can be worth checking if another airport meaningfully improves price or schedule, but include transfer time, parking, baggage, and overnight costs before treating the alternate airport as cheaper.`,
    },
    ...additionalFaq,
  ];
}

function getTravelStyleLabel(style: StrongSeoPage["travelStyle"]) {
  if (style === "budget") {
    return "Budget";
  }

  if (style === "luxury") {
    return "Comfort";
  }

  return "Mid-range";
}

function ContentSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-[24px] border border-slate-200 bg-white p-6">
      <h2 className="text-2xl font-semibold">{title}</h2>
      <div className="mt-3 text-sm leading-7 text-slate-600">{children}</div>
    </section>
  );
}

function HeroPill({
  icon: Icon,
  label,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2">
      <Icon className="size-5 text-[#0B1D34]" />
      <span className="text-sm font-medium text-slate-600">{label}</span>
    </div>
  );
}

function getKindLabel(kind: StrongSeoPage["kind"]) {
  if (kind === "origin-destination") {
    return "Budget destination";
  }

  if (kind === "destination-budget") {
    return "Destination budget";
  }

  return "Budget itinerary";
}

function getBreadcrumbParent(kind: StrongSeoPage["kind"]) {
  if (kind === "origin-destination") {
    return "Budget travel";
  }

  if (kind === "destination-budget") {
    return "Destinations";
  }

  return "Itineraries";
}

function getBreadcrumbParentPath(kind: StrongSeoPage["kind"]) {
  if (kind === "destination-budget") {
    return "/destinations";
  }

  return kind === "itinerary" ? "/guides" : "/travel-budget-calculator";
}
