import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  ChevronRight,
  CircleDollarSign,
  Compass,
  Filter,
  Heart,
  Hotel,
  Landmark,
  Leaf,
  MapPin,
  Mountain,
  Plane,
  Sparkles,
  Users,
  Utensils,
  Waves,
  Wifi,
  type LucideIcon,
} from "lucide-react";

import { AnalyticsView } from "@/components/analytics/analytics-view";
import { TrackedLink } from "@/components/analytics/tracked-link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CostBreakdownDonut,
  CostBreakdownList,
  type CostBreakdownItem,
} from "@/components/site/cost-breakdown-card";
import {
  recommendDestinations,
  type DestinationRecommendation,
  type SupportedCurrency,
  type TravelStyle,
} from "@/lib/budget/recommend-destinations";
import { destinations as destinationData, formatMoney } from "@/lib/data/destinations";
import { createResultsMetadata } from "@/lib/seo/metadata";

export const metadata = createResultsMetadata();

const categories = [
  { label: "Beach", icon: Waves, active: true },
  { label: "City", icon: Building2 },
  { label: "Nature", icon: Leaf },
  { label: "Culture", icon: Landmark },
  { label: "Adventure", icon: Mountain },
  { label: "Food", icon: Utensils },
  { label: "Family", icon: Users },
  { label: "Backpacker", icon: Compass },
];

type ResultsSearchParams = {
  budget?: string | string[];
  currency?: string | string[];
  origin?: string | string[];
  days?: string | string[];
  month?: string | string[];
  travelers?: string | string[];
  style?: string | string[];
};

type ResultsPageProps = {
  searchParams: Promise<ResultsSearchParams>;
};

type ParsedSearchParams = {
  budget: number;
  currency: SupportedCurrency;
  origin: string;
  days: number;
  month: string;
  travelers: number;
  style: TravelStyle;
};

type ResultDestination = {
  rank: number;
  country: string;
  region: string;
  total: string;
  flightCost: string;
  dailyCost: string;
  budgetRemaining: string;
  budgetRemainingValue: number;
  quality: string;
  score: string;
  href: string;
  image: string;
  alt: string;
  duration: string;
  style: string;
  summary: string;
};

type Offer = {
  title: string;
  detail: string;
  discount?: string;
  action?: string;
  icon: LucideIcon;
  tone: string;
};

const defaultSearchParams: ParsedSearchParams = {
  budget: 2500,
  currency: "CAD",
  origin: "YUL",
  days: 10,
  month: "october",
  travelers: 1,
  style: "balanced",
};

const currencyOptions = ["CAD", "USD", "EUR"] as const;

const styleAliases: Record<string, TravelStyle> = {
  budget: "budget",
  balanced: "balanced",
  midrange: "balanced",
  "mid-range": "balanced",
  comfort: "comfort",
  luxury: "comfort",
};

export default async function ResultsPage({ searchParams }: ResultsPageProps) {
  const parsedParams = parseSearchParams(await searchParams);
  const recommendations = recommendDestinations({
    destinations: destinationData,
    budget: parsedParams.budget,
    currency: parsedParams.currency,
    origin: parsedParams.origin,
    days: parsedParams.days,
    month: parsedParams.month,
    travelers: parsedParams.travelers,
    style: parsedParams.style,
  });
  const destinations = recommendations.map((recommendation, index) =>
    toResultDestination(recommendation, index, parsedParams)
  );
  const topRecommendation = recommendations[0];
  const formattedBudget = formatMoney(parsedParams.budget, parsedParams.currency);
  const resultSummary = `Found ${recommendations.length} ranked ${
    recommendations.length === 1 ? "destination" : "destinations"
  } from ${parsedParams.origin} for ${formattedBudget}, ${parsedParams.days} days, ${
    parsedParams.travelers
  } ${parsedParams.travelers === 1 ? "traveler" : "travelers"}, ${formatStyleLabel(parsedParams.style)} style.`;

  return (
    <main className="bg-[#f7f9fb] text-[#191c1e]">
      <AnalyticsView
        eventName="budget_result_viewed"
        eventProperties={{
          page: "/results",
          budget: parsedParams.budget,
          currency: parsedParams.currency,
          originCode: parsedParams.origin,
          days: parsedParams.days,
          travelers: parsedParams.travelers,
          travelStyle: parsedParams.style,
          resultCount: recommendations.length,
        }}
      />
      <section className="border-b border-[#c3c6d7]/35 bg-white/70">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 sm:px-6 lg:flex-row lg:items-end lg:justify-between lg:px-8">
          <div>
            <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-blue-700">
              <Sparkles className="size-4" />
              AI destination finder
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-[#191c1e] sm:text-6xl">
              Explore the World
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-[#434655]">{resultSummary}</p>
          </div>
          <Button asChild className="h-12 rounded-full bg-[#004ac6] px-5 text-white shadow-lg shadow-blue-700/20 hover:bg-blue-700">
            <TrackedLink
              href="/"
              eventName="cta_clicked"
              eventProperties={{
                page: "/results",
                label: "Modify Budget",
                href: "/",
                ctaLocation: "results_header",
              }}
            >
              <Filter className="mr-2 size-4" />
              Modify Budget
            </TrackedLink>
          </Button>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,8fr)_minmax(320px,4fr)] lg:px-8">
        <div className="grid gap-8">
          <CategoryFilters />

          {destinations.length > 0 ? (
            <div className="grid gap-5 md:grid-cols-3">
              {destinations.map((destination) => (
                <DestinationCard key={destination.href} destination={destination} />
              ))}
            </div>
          ) : (
            <EmptyResultsState />
          )}

          {topRecommendation ? (
            <BudgetBreakdownCard
              currency={parsedParams.currency}
              days={parsedParams.days}
              recommendation={topRecommendation}
              style={parsedParams.style}
            />
          ) : null}
        </div>

        <aside className="grid h-fit gap-6 lg:sticky lg:top-24">
          <GlobalPriceIndexCard />
          <OffersPanel origin={parsedParams.origin} topDestination={topRecommendation?.destination.name} />
        </aside>
      </section>

      <CTASection />
    </main>
  );
}

function parseSearchParams(searchParams: ResultsSearchParams): ParsedSearchParams {
  return {
    budget: parseNumber(readSearchParam(searchParams.budget), defaultSearchParams.budget),
    currency: parseCurrency(readSearchParam(searchParams.currency)),
    origin: parseOrigin(readSearchParam(searchParams.origin)),
    days: parseNumber(readSearchParam(searchParams.days), defaultSearchParams.days),
    month: readSearchParam(searchParams.month)?.trim() || defaultSearchParams.month,
    travelers: parseNumber(readSearchParam(searchParams.travelers), defaultSearchParams.travelers),
    style: parseTravelStyle(readSearchParam(searchParams.style)),
  };
}

function readSearchParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function parseNumber(value: string | undefined, fallback: number): number {
  if (!value) {
    return fallback;
  }

  const parsedValue = Number(value.replace(/,/g, ""));
  return Number.isFinite(parsedValue) && parsedValue > 0 ? Math.round(parsedValue) : fallback;
}

function parseCurrency(value: string | undefined): SupportedCurrency {
  const normalizedValue = value?.trim().toUpperCase();
  return currencyOptions.some((currency) => currency === normalizedValue)
    ? (normalizedValue as SupportedCurrency)
    : defaultSearchParams.currency;
}

function parseOrigin(value: string | undefined) {
  return value?.trim().replace(/\s+/g, " ").slice(0, 80).toUpperCase() || defaultSearchParams.origin;
}

function parseTravelStyle(value: string | undefined): TravelStyle {
  const normalizedValue = value?.trim().toLowerCase();
  return normalizedValue ? styleAliases[normalizedValue] ?? defaultSearchParams.style : defaultSearchParams.style;
}

function toResultDestination(
  recommendation: DestinationRecommendation,
  index: number,
  { budget, currency, days, style }: ParsedSearchParams
): ResultDestination {
  const { destination, costBreakdown } = recommendation;
  const dailyCost =
    recommendation.estimatedTotal > costBreakdown.flights
      ? (recommendation.estimatedTotal - costBreakdown.flights) / days
      : 0;

  return {
    rank: index + 1,
    country: destination.name,
    region: destination.travelStyles.slice(0, 2).join(" & "),
    total: formatMoney(recommendation.estimatedTotal, currency),
    flightCost: formatMoney(costBreakdown.flights, currency),
    dailyCost: formatMoney(dailyCost, currency),
    budgetRemaining: formatMoney(Math.abs(recommendation.budgetRemaining), currency),
    budgetRemainingValue: recommendation.budgetRemaining,
    quality: getFitLabel(recommendation.budgetFitStatus),
    score: `${recommendation.matchScore}/100`,
    href: `/destinations/${destination.slug}`,
    image: destination.image,
    alt: `${destination.name} travel view`,
    duration: `${days} ${days === 1 ? "day" : "days"}`,
    style: formatStyleLabel(style),
    summary: recommendation.reasons[0] ?? `Estimated against a ${formatMoney(budget, currency)} budget.`,
  };
}

function getFitLabel(status: DestinationRecommendation["budgetFitStatus"]) {
  if (status === "best-fit") {
    return "Best fit";
  }

  if (status === "stretch") {
    return "Slight stretch";
  }

  return "Over budget";
}

function formatStyleLabel(style: TravelStyle) {
  if (style === "comfort") {
    return "Comfort";
  }

  if (style === "budget") {
    return "Budget";
  }

  return "Balanced";
}

function CategoryFilters() {
  return (
    <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden">
      {categories.map((category) => {
        const Icon = category.icon;

        return (
          <Link
            key={category.label}
            href="/results"
            className={`flex min-w-28 items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm font-semibold shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-blue-600/25 ${
              category.active
                ? "border-blue-600 bg-[#004ac6] text-white shadow-blue-700/20"
                : "border-[#c3c6d7]/45 bg-white text-[#434655] hover:border-blue-200 hover:text-blue-700"
            }`}
          >
            <Icon className="size-4" />
            {category.label}
          </Link>
        );
      })}
    </div>
  );
}

function DestinationCard({ destination }: { destination: ResultDestination }) {
  return (
    <article className="group overflow-hidden rounded-[24px] border border-[#c3c6d7]/35 bg-white shadow-[0_18px_45px_-24px_rgba(15,23,42,0.35)] transition-[transform,box-shadow] duration-400 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] hover:-translate-y-2 hover:shadow-[0_24px_60px_-28px_rgba(15,23,42,0.5)]">
      <TrackedLink
        href={destination.href}
        eventName="destination_card_clicked"
        eventProperties={{
          page: "/results",
          destinationName: destination.country,
          destinationSlug: destination.href.replace("/destinations/", ""),
          source: "results_grid",
        }}
        className="block focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-blue-600/25"
      >
        <div className="relative h-56 overflow-hidden">
          <Image
            src={destination.image}
            alt={destination.alt}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 100vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/45 via-transparent to-slate-950/10" />
          <Badge className="absolute left-4 top-4 rounded-full bg-white px-3 py-1 text-blue-700 shadow-md">
            TOP {destination.rank}
          </Badge>
          <button
            type="button"
            aria-label={`Add ${destination.country} to favorites`}
            className="absolute right-4 top-4 flex size-10 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-md backdrop-blur transition hover:bg-white hover:text-rose-500 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-white/70"
          >
            <Heart className="size-4" />
          </button>
        </div>
        <div className="grid gap-5 p-5">
          <div>
            <p className="text-sm font-medium text-[#434655]">{destination.region}</p>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight text-[#191c1e]">{destination.country}</h2>
            <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#434655]">{destination.summary}</p>
          </div>
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#434655]">Est. Total</p>
              <p className="mt-1 text-3xl font-semibold text-[#004ac6]">{destination.total}</p>
            </div>
            <div className="rounded-full bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700">
              {destination.score}
            </div>
          </div>
          <div className="flex items-center justify-between gap-3 text-sm">
            <span className="flex items-center gap-2 font-medium text-[#434655]">
              <span className="size-2.5 rounded-full bg-emerald-500 shadow-[0_0_0_4px_rgba(16,185,129,0.14)]" />
              {destination.quality}
            </span>
            <span className="inline-flex items-center gap-1 font-semibold text-blue-700">
              View details
              <ArrowRight className="size-4" />
            </span>
          </div>
          <dl className="grid grid-cols-2 gap-3 border-t border-[#c3c6d7]/35 pt-4 text-sm">
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-[#434655]">Flights</dt>
              <dd className="mt-1 font-semibold text-[#191c1e]">{destination.flightCost}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-[#434655]">Daily</dt>
              <dd className="mt-1 font-semibold text-[#191c1e]">{destination.dailyCost}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-[#434655]">Duration</dt>
              <dd className="mt-1 font-semibold text-[#191c1e]">{destination.duration}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-[#434655]">
                {destination.budgetRemainingValue >= 0 ? "Remaining" : "Over"}
              </dt>
              <dd className="mt-1 font-semibold text-[#191c1e]">{destination.budgetRemaining}</dd>
            </div>
          </dl>
          <Badge className="w-fit rounded-full bg-blue-50 text-blue-700 ring-1 ring-blue-100">
            {destination.style} style
          </Badge>
        </div>
      </TrackedLink>
    </article>
  );
}

function EmptyResultsState() {
  return (
    <section className="rounded-[28px] border border-[#c3c6d7]/35 bg-white p-8 text-center shadow-[0_18px_45px_-26px_rgba(15,23,42,0.35)]">
      <h2 className="text-2xl font-semibold tracking-tight text-[#191c1e]">No destinations match this search yet</h2>
      <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-[#434655]">
        Try increasing your budget, reducing the trip length, changing your travel style, or picking a different
        departure city.
      </p>
    </section>
  );
}

function BudgetBreakdownCard({
  currency,
  days,
  recommendation,
  style,
}: {
  currency: SupportedCurrency;
  days: number;
  recommendation: DestinationRecommendation;
  style: TravelStyle;
}) {
  const budgetRows: CostBreakdownItem[] = [
    { label: "Flights", amount: recommendation.costBreakdown.flights, currency, color: "#2563eb" },
    { label: "Accommodation", amount: recommendation.costBreakdown.hotel, currency, color: "#14b8a6" },
    { label: "Food", amount: recommendation.costBreakdown.food, currency, color: "#f97316" },
    { label: "Transport", amount: recommendation.costBreakdown.transport, currency, color: "#8b5cf6" },
    { label: "Activities", amount: recommendation.costBreakdown.activities, currency, color: "#a855f7" },
    { label: "Misc", amount: recommendation.costBreakdown.misc, currency, color: "#f59e0b" },
  ];
  const totalAmount = recommendation.estimatedTotal;

  return (
    <section className="grid gap-8 rounded-[32px] border border-white/60 bg-white/70 p-6 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.05)] backdrop-blur-xl md:grid-cols-[260px_1fr] md:p-8">
      <CostBreakdownDonut centerLabel="Total budget" currency={currency} items={budgetRows} totalAmount={totalAmount} />

      <div className="flex flex-col justify-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">Cost clarity</p>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight text-[#191c1e]">
          Budget breakdown - {recommendation.destination.name}
        </h2>
        <p className="mt-3 text-sm leading-6 text-[#434655]">
          Based on a {formatStyleLabel(style).toLowerCase()} selection for {days} {days === 1 ? "day" : "days"}.
        </p>
        <CostBreakdownList
          className="mt-6 grid gap-3 sm:grid-cols-2"
          currency={currency}
          itemClassName="rounded-2xl border border-[#c3c6d7]/35 bg-white/80 px-4 py-3"
          items={budgetRows}
          showBars={false}
          totalAmount={totalAmount}
        />
      </div>
    </section>
  );
}

function GlobalPriceIndexCard() {
  return (
    <section className="rounded-[28px] border border-[#c3c6d7]/35 bg-white p-5 shadow-[0_18px_45px_-26px_rgba(15,23,42,0.45)]">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xl font-semibold text-[#191c1e]">Global Price Index</h2>
        <Badge className="rounded-full bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100">LIVE DATA</Badge>
      </div>

      <div className="relative mt-5 aspect-square overflow-hidden rounded-[24px] border border-blue-100 bg-[#edf5ff]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_35%,rgba(37,99,235,0.18),transparent_24%),radial-gradient(circle_at_72%_52%,rgba(20,184,166,0.2),transparent_18%),radial-gradient(circle_at_55%_30%,rgba(249,115,22,0.14),transparent_20%)]" />
        <svg viewBox="0 0 360 360" className="absolute inset-0 h-full w-full text-blue-900/25" aria-label="Stylized world map">
          <path d="M54 124c26-24 61-20 87-11 18 6 31 2 49-3 36-9 69 2 99 26 14 11 11 29-5 35-22 8-44-8-65-4-22 4-34 26-58 23-21-2-31-22-52-25-24-3-51 10-68-8-10-11-1-23 13-33Z" fill="currentColor" />
          <path d="M78 222c23-17 52-13 68 6 12 15 8 36-11 44-25 11-66-6-79-24-7-10 1-18 22-26Z" fill="currentColor" />
          <path d="M236 222c17-12 42-10 56 4 12 12 8 31-9 39-22 10-52-2-63-18-7-9 0-17 16-25Z" fill="currentColor" />
        </svg>
        <div className="absolute left-[56%] top-[47%] rounded-2xl border border-white/70 bg-white/90 px-4 py-3 shadow-xl backdrop-blur">
          <p className="text-xs font-bold uppercase tracking-wide text-blue-700">VIETNAM</p>
          <p className="mt-1 text-lg font-semibold text-[#191c1e]">$45 / day</p>
        </div>
        <MapPin className="absolute left-[50%] top-[55%] size-6 fill-blue-600 text-blue-600" />
      </div>

      <div className="mt-5">
        <div className="h-3 rounded-full bg-gradient-to-r from-emerald-400 via-yellow-300 via-orange-400 to-red-500" />
        <div className="mt-2 flex justify-between text-xs font-semibold text-[#434655]">
          <span>Cheaper</span>
          <span>Pricier</span>
        </div>
      </div>
    </section>
  );
}

function OffersPanel({ origin, topDestination }: { origin: string; topDestination?: string }) {
  const offers = [
    {
      title: "Flight watch",
      detail: topDestination ? `${origin} -> ${topDestination}` : `Flights from ${origin}`,
      discount: "Fare alerts",
      icon: Plane,
      tone: "from-blue-500 to-cyan-400",
    },
    {
      title: "Hotels Top Pick",
      detail: topDestination ? `${topDestination} stays under budget` : "Stays under budget",
      discount: "Compare",
      icon: Hotel,
      tone: "from-violet-500 to-fuchsia-400",
    },
    {
      title: "Budget eSIM Finder",
      detail: "Save on roaming fees.",
      action: "Compare eSIMs",
      icon: Wifi,
      tone: "from-emerald-500 to-teal-400",
    },
  ];

  return (
    <section>
      <h2 className="text-xl font-semibold text-[#191c1e]">Offers to maximize your budget</h2>
      <div className="mt-4 grid gap-3">
        {offers.map((offer) => (
          <OfferCard key={offer.title} offer={offer} />
        ))}
      </div>
    </section>
  );
}

function OfferCard({ offer }: { offer: Offer }) {
  const Icon = offer.icon;

  return (
    <TrackedLink
      href="/tools"
      eventName="cta_clicked"
      eventProperties={{
        page: "/results",
        label: offer.title,
        href: "/tools",
        ctaLocation: "results_offer_panel",
      }}
      className="group flex items-center gap-4 rounded-[24px] border border-white/60 bg-white/75 p-4 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.05)] backdrop-blur transition hover:-translate-y-1 hover:bg-white hover:shadow-[0_18px_42px_-26px_rgba(15,23,42,0.5)] focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-blue-600/25"
    >
      <span className={`flex size-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${offer.tone} text-white shadow-lg`}>
        <Icon className="size-6" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-semibold text-[#191c1e]">{offer.title}</span>
        <span className="mt-1 block text-sm text-[#434655]">{offer.detail}</span>
        {"action" in offer ? (
          <span className="mt-3 inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
            {offer.action}
          </span>
        ) : null}
      </span>
      {"discount" in offer ? (
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-bold text-emerald-700">{offer.discount}</span>
      ) : null}
      <ChevronRight className="size-5 text-slate-400 transition group-hover:translate-x-1 group-hover:text-blue-700" />
    </TrackedLink>
  );
}

function CTASection() {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-12 pt-4 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-[40px] bg-[#0F172A] px-6 py-12 text-white shadow-2xl shadow-slate-950/20 sm:px-10 lg:px-14">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(37,99,235,0.45),transparent_28%),linear-gradient(135deg,rgba(0,74,198,0.3),transparent_45%)]" />
        <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-blue-200">
              <CircleDollarSign className="size-4" />
              Smarter travel finance
            </p>
            <h2 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight sm:text-5xl">
              Ready to plan your next journey?
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-white/75 sm:text-base">
              Join thousands of travelers who save time and money by using our AI-powered financial travel companion.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild className="h-12 rounded-full bg-white px-5 text-[#004ac6] hover:bg-blue-50">
              <TrackedLink
                href="/"
                eventName="cta_clicked"
                eventProperties={{
                  page: "/results",
                  label: "Start now",
                  href: "/",
                  ctaLocation: "results_bottom_cta",
                }}
              >
                Start now
                <ArrowRight className="ml-2 size-4" />
              </TrackedLink>
            </Button>
            <Button asChild variant="outline" className="h-12 rounded-full border-white/30 bg-white/10 px-5 text-white hover:bg-white/15 hover:text-white">
              <TrackedLink
                href="/tools"
                eventName="cta_clicked"
                eventProperties={{
                  page: "/results",
                  label: "View Itinerary Builder",
                  href: "/tools",
                  ctaLocation: "results_bottom_cta",
                }}
              >
                View Itinerary Builder
              </TrackedLink>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
