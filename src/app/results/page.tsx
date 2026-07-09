import { connection } from "next/server";
import {
  ArrowRight,
  BadgeCheck,
  Bed,
  Compass,
  Edit3,
  Globe2,
  Luggage,
  Plane,
  PlaneTakeoff,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Sun,
  Utensils,
  WalletCards,
  type LucideIcon,
} from "lucide-react";

import { AnalyticsView } from "@/components/analytics/analytics-view";
import { TrackedFilterForm } from "@/components/analytics/tracked-form";
import { TrackedLink } from "@/components/analytics/tracked-link";
import { Button } from "@/components/ui/button";
import {
  recommendDestinations,
  type DestinationRecommendation,
  type TravelStyle,
} from "@/lib/budget/recommend-destinations";
import {
  formatMoney,
  getOriginPricing,
} from "@/lib/data/destinations";
import { getCityCountryLabel, unifiedDestinations as destinationData } from "@/lib/data/unified-destinations";
import {
  createResultsHref,
  filterAndSortRecommendations,
  parseSearchParams,
  type ParsedSearchParams,
  type ResultsCategory,
  type ResultsSearchParams,
} from "@/lib/results/filters";
import { createResultsMetadata } from "@/lib/seo/metadata";
import { ResultsComparisonSection } from "./compare-selection";

export const metadata = createResultsMetadata();

type ResultsPageProps = {
  searchParams: Promise<ResultsSearchParams>;
};

export type ResultDestination = {
  rank: number;
  slug: string;
  title: string;
  tag: string;
  total: string;
  budgetDelta: string;
  budgetRemainingValue: number;
  budgetFitPercent: number;
  flightCost: string;
  stayCost: string;
  foodCost: string;
  href: string;
  image: string;
  alt: string;
  flightTime: string;
  climate: string;
  entry: string;
  summary: string;
};

const categoryFilters: { label: string; value: ResultsCategory; icon: LucideIcon }[] = [
  { label: "All", value: "all", icon: Sparkles },
  { label: "Beach", value: "beach", icon: Sun },
  { label: "City", value: "city", icon: Globe2 },
  { label: "Nature", value: "nature", icon: Compass },
  { label: "Culture", value: "culture", icon: BadgeCheck },
  { label: "Adventure", value: "adventure", icon: Luggage },
  { label: "Food", value: "food", icon: Utensils },
  { label: "Family", value: "family", icon: ShieldCheck },
  { label: "Backpacker", value: "backpacker", icon: WalletCards },
];

const flightTimeBySlug: Record<string, string> = {
  portugal: "7h 05m",
  mexico: "5h 45m",
  france: "6h 50m",
  italy: "8h 10m",
  thailand: "19h+",
  japan: "14h+",
  vietnam: "20h+",
  spain: "7h 25m",
  greece: "9h 30m",
};

export default async function ResultsPage({ searchParams }: ResultsPageProps) {
  await connection();

  const parsedParams = parseSearchParams(await searchParams);
  const allRecommendations = recommendDestinations({
    destinations: destinationData,
    budget: parsedParams.budget,
    currency: parsedParams.currency,
    origin: parsedParams.origin,
    days: parsedParams.days,
    month: parsedParams.month,
    travelers: parsedParams.travelers,
    style: parsedParams.style,
  });
  const strictRecommendations = filterAndSortRecommendations(allRecommendations, parsedParams);
  const recommendations =
    strictRecommendations.length > 0
      ? strictRecommendations
      : filterAndSortRecommendations(allRecommendations, {
          ...parsedParams,
          budget: Number.MAX_SAFE_INTEGER,
        });
  const destinations = recommendations.map((recommendation, index) =>
    toResultDestination(recommendation, index, parsedParams)
  );
  const featuredDestinations = destinations.slice(0, 6);
  const formattedBudget = formatMoney(parsedParams.budget, parsedParams.currency);
  const originLabel = formatOriginLabel(parsedParams.origin);
  const styleLabel = formatStyleLabel(parsedParams.style);
  const summaryText = `${formattedBudget} - ${parsedParams.days} days - ${originLabel} - ${styleLabel}`;
  const analyticsContext = {
    budget: parsedParams.budget,
    currency: parsedParams.currency,
    days: parsedParams.days,
    month: parsedParams.month,
    originCity: originLabel,
    originCode: parsedParams.origin,
    resultCount: recommendations.length,
    travelers: parsedParams.travelers,
    travelStyle: parsedParams.style,
  };

  return (
    <main className="min-h-screen bg-[#f7f9fb] text-[#191c1e]">
      <AnalyticsView
        eventName="budget_result_viewed"
        eventProperties={{
          page: "/results",
          budget: parsedParams.budget,
          currency: parsedParams.currency,
          originCode: parsedParams.origin,
          originCity: originLabel,
          days: parsedParams.days,
          tripLength: parsedParams.days,
          month: parsedParams.month,
          travelers: parsedParams.travelers,
          travelStyle: parsedParams.style,
          resultCount: recommendations.length,
          resultsCount: recommendations.length,
        }}
      />

      <div className="min-w-0">
        <SearchSummaryBar
          parsedParams={parsedParams}
          resultCount={recommendations.length}
          summaryText={summaryText}
        />

        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <HeroSection
            parsedParams={parsedParams}
            resultCount={recommendations.length}
            summaryText={summaryText}
          />

          <ResultsControls parsedParams={parsedParams} resultCount={recommendations.length} />

          {featuredDestinations.length > 0 ? (
            <ResultsComparisonSection destinations={featuredDestinations} analyticsContext={analyticsContext} />
          ) : (
            <EmptyResultsState parsedParams={parsedParams} />
          )}

          <TrustModule />
          <SeoLinks budget={formattedBudget} origin={originLabel} />
          <FinalCta />
        </div>
      </div>

    </main>
  );
}

function SearchSummaryBar({
  parsedParams,
  resultCount,
  summaryText,
}: {
  parsedParams: ParsedSearchParams;
  resultCount: number;
  summaryText: string;
}) {
  return (
    <div className="sticky top-16 z-30 border-b border-[#c3c6d7]/30 bg-[#f7f9fb]/90 px-4 py-3 backdrop-blur-md sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4">
        <div className="flex min-w-0 flex-wrap items-center gap-3">
          <span className="text-base font-bold text-[#191c1e]">{summaryText}</span>
          <div className="flex flex-wrap gap-2">
            <Pill>Budget</Pill>
            <Pill>Duration</Pill>
            <Pill>{parsedParams.origin}</Pill>
            <Pill>{formatStyleLabel(parsedParams.style)}</Pill>
          </div>
        </div>
        <TrackedLink
          href="/"
          eventName="cta_clicked"
          eventProperties={{
            page: "/results",
            label: "Edit search",
            href: "/",
            ctaLocation: "results_summary_bar",
          }}
          className="inline-flex items-center gap-2 text-sm font-bold text-[#0B1D34] hover:underline"
        >
          <Edit3 className="size-4" />
          Edit search
        </TrackedLink>
        <span className="sr-only">{resultCount} matching destinations</span>
      </div>
    </div>
  );
}

function HeroSection({
  parsedParams,
  resultCount,
  summaryText,
}: {
  parsedParams: ParsedSearchParams;
  resultCount: number;
  summaryText: string;
}) {
  return (
    <section className="mb-10">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="max-w-3xl text-4xl font-bold leading-tight tracking-normal text-[#191c1e] sm:text-5xl">
            Best destinations for your budget
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-[#434655]">
            We found realistic trip options based on your budget, trip length, departure city, and travel style.
          </p>
          <div className="mt-4 flex items-start gap-2 text-sm font-medium text-[#737686]">
            <ShieldCheck className="mt-0.5 size-5 shrink-0 text-[#0B1D34]" />
            <span>
              Estimates include flights, accommodation, food, local transport, activities, and a safety buffer.
            </span>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <span className="text-sm font-bold text-[#434655]">
            {resultCount} {resultCount === 1 ? "destination" : "destinations"} found
          </span>
          <TrackedFilterForm
            action="/results"
            eventProperties={{
              page: "/results",
              budget: parsedParams.budget,
              currency: parsedParams.currency,
              days: parsedParams.days,
              month: parsedParams.month,
              originCode: parsedParams.origin,
              resultCount,
              source: "results_sort_select",
              travelers: parsedParams.travelers,
              travelStyle: parsedParams.style,
              tripLength: parsedParams.days,
            }}
            className="flex items-center gap-2"
          >
            <input type="hidden" name="budget" value={parsedParams.budget} />
            <input type="hidden" name="currency" value={parsedParams.currency} />
            <input type="hidden" name="origin" value={parsedParams.origin} />
            <input type="hidden" name="days" value={parsedParams.days} />
            <input type="hidden" name="month" value={parsedParams.month} />
            <input type="hidden" name="travelers" value={parsedParams.travelers} />
            <input type="hidden" name="style" value={parsedParams.style} />
            <input type="hidden" name="category" value={parsedParams.category} />
            <input type="hidden" name="destination" value={parsedParams.destination} />
            <select
              name="sort"
              defaultValue={parsedParams.sort}
              aria-label={`Sort results for ${summaryText}`}
              className="h-11 appearance-none rounded-xl border border-[#c3c6d7] bg-[#eceef0] px-4 text-sm font-semibold text-[#191c1e] outline-none focus:border-[#0B1D34] focus:ring-3 focus:ring-[#0B1D34]/15"
            >
              <option value="relevance">Best match</option>
              <option value="price-asc">Cheapest</option>
              <option value="score">Highest score</option>
              <option value="price-desc">Highest price</option>
            </select>
            <Button
              type="submit"
              size="icon"
              aria-label="Apply sort"
              className="h-11 w-11 rounded-xl bg-[#0B1D34] text-white hover:bg-[#0B1D34]"
            >
              <SlidersHorizontal className="size-4" />
            </Button>
          </TrackedFilterForm>
        </div>
      </div>
    </section>
  );
}

function ResultsControls({
  parsedParams,
  resultCount,
}: {
  parsedParams: ParsedSearchParams;
  resultCount: number;
}) {
  return (
    <section className="mb-8 grid gap-4">
      <TrackedFilterForm
        action="/results"
        eventProperties={{
          page: "/results",
          budget: parsedParams.budget,
          currency: parsedParams.currency,
          days: parsedParams.days,
          month: parsedParams.month,
          originCode: parsedParams.origin,
          resultCount,
          source: "results_filter_form",
          travelers: parsedParams.travelers,
          travelStyle: parsedParams.style,
          tripLength: parsedParams.days,
        }}
        className="grid grid-cols-1 gap-3 rounded-3xl border border-[#c3c6d7]/35 bg-white/70 p-4 shadow-[0_18px_45px_-32px_rgba(15,23,42,0.45)] backdrop-blur sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-[minmax(8rem,0.8fr)_minmax(7rem,0.7fr)_minmax(10rem,1fr)_minmax(10rem,1fr)_minmax(12rem,1.2fr)_minmax(8rem,0.8fr)]"
      >
        <Field label="Budget">
          <input
            name="budget"
            type="number"
            min="100"
            step="50"
            defaultValue={parsedParams.budget}
            className="field-input"
          />
        </Field>
        <Field label="Days">
          <input
            name="days"
            type="number"
            min="1"
            max="60"
            defaultValue={parsedParams.days}
            className="field-input"
          />
        </Field>
        <Field label="From">
          <select name="origin" defaultValue={parsedParams.origin} className="field-input">
            <option value="YUL">Montreal</option>
            <option value="YYZ">Toronto</option>
            <option value="YVR">Vancouver</option>
            <option value="YQB">Quebec</option>
            <option value="YOW">Ottawa</option>
            <option value="YYC">Calgary</option>
          </select>
        </Field>
        <Field label="Style">
          <select name="style" defaultValue={parsedParams.style} className="field-input">
            <option value="budget">Budget</option>
            <option value="balanced">Balanced</option>
            <option value="comfort">Comfort</option>
          </select>
        </Field>
        <Field label="Destination">
          <input
            name="destination"
            type="search"
            defaultValue={parsedParams.destination}
            placeholder="Japan, beach..."
            className="field-input"
          />
        </Field>
        <div className="flex min-w-0 items-end">
          <Button className="h-11 w-full rounded-full bg-[#0B1D34] text-white hover:bg-[#0B1D34]" type="submit">
            Apply
          </Button>
        </div>
        <input type="hidden" name="currency" value={parsedParams.currency} />
        <input type="hidden" name="month" value={parsedParams.month} />
        <input type="hidden" name="travelers" value={parsedParams.travelers} />
        <input type="hidden" name="category" value={parsedParams.category} />
        <input type="hidden" name="sort" value={parsedParams.sort} />
      </TrackedFilterForm>

      <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden">
        {categoryFilters.map((category) => {
          const Icon = category.icon;
          const isActive = category.value === parsedParams.category;

          return (
            <TrackedLink
              key={category.value}
              href={createResultsHref(parsedParams, { category: category.value })}
              eventName="filter_changed"
              eventProperties={{
                page: "/results",
                budget: parsedParams.budget,
                currency: parsedParams.currency,
                days: parsedParams.days,
                filterName: "category",
                filterValue: category.value,
                month: parsedParams.month,
                originCode: parsedParams.origin,
                previousValue: parsedParams.category,
                resultCount,
                source: "results_category_filter",
                travelers: parsedParams.travelers,
                travelStyle: parsedParams.style,
                tripLength: parsedParams.days,
              }}
              className={`inline-flex min-w-max items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                isActive
                  ? "border-[#2563eb] bg-[#2563eb] text-white"
                  : "border-[#c3c6d7]/60 bg-white text-[#434655] hover:border-[#0B1D34] hover:text-[#0B1D34]"
              }`}
            >
              <Icon className="size-4" />
              {category.label}
            </TrackedLink>
          );
        })}
      </div>
    </section>
  );
}

function Field({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <label className="grid min-w-0 gap-2 text-sm font-semibold text-[#434655]">
      {label}
      {children}
    </label>
  );
}

function TrustModule() {
  const items = [
    { label: "Flights", icon: Plane },
    { label: "Stay", icon: Bed },
    { label: "Food", icon: Utensils },
    { label: "Transport", icon: PlaneTakeoff },
    { label: "Activities", icon: Sparkles },
    { label: "Buffer", icon: ShieldCheck },
  ];

  return (
    <section className="mt-20 rounded-[32px] border border-[#c3c6d7]/20 bg-[#f2f4f6] p-8 md:p-10">
      <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
        <div className="max-w-md">
          <h2 className="text-3xl font-semibold tracking-normal text-[#191c1e]">
            What&apos;s included in each estimate?
          </h2>
          <p className="mt-4 text-lg leading-8 text-[#434655]">
            Our planning engine combines flight baselines and destination cost models to keep every budget realistic.
          </p>
          <TrackedLink
            href="/methodology"
            eventName="guide_clicked"
            eventProperties={{
              page: "/results",
              guideTitle: "Methodology",
              href: "/methodology",
            }}
            className="mt-6 inline-flex items-center gap-2 font-bold text-[#0B1D34] hover:underline"
          >
            See our methodology
            <ArrowRight className="size-4" />
          </TrackedLink>
        </div>
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3">
          {items.map((item) => {
            const Icon = item.icon;

            return (
              <div key={item.label} className="flex flex-col items-center gap-3">
                <div className="flex size-12 items-center justify-center rounded-full bg-white shadow-sm">
                  <Icon className="size-5 text-[#0B1D34]" />
                </div>
                <span className="text-sm font-semibold text-[#191c1e]">{item.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function SeoLinks({ budget, origin }: { budget: string; origin: string }) {
  const links = [
    "Best Europe trips",
    "Best warm destinations",
    "Cheapest 10-day trips",
    "Montreal to Lisbon budget",
    "Montreal to Mexico City budget",
  ];

  return (
    <section className="mt-20 border-t border-[#c3c6d7]/30 pt-10">
      <h2 className="mb-6 text-sm font-bold uppercase tracking-widest text-[#434655]">
        Where can you travel with {budget} from {origin}?
      </h2>
      <div className="flex flex-wrap gap-x-12 gap-y-4">
        {links.map((link) => (
          <TrackedLink
            key={link}
            href="/guides"
            eventName="guide_clicked"
            eventProperties={{
              page: "/results",
              guideTitle: link,
              href: "/guides",
            }}
            className="text-base text-[#434655] transition hover:text-[#0B1D34]"
          >
            {link}
          </TrackedLink>
        ))}
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="my-20 overflow-hidden rounded-[32px] border border-[#c3c6d7]/30 bg-[#f2f4f6] p-10 text-center shadow-sm md:p-16">
      <h2 className="text-4xl font-bold tracking-normal text-[#191c1e]">Not seeing the right trip?</h2>
      <p className="mx-auto mt-4 max-w-xl text-lg leading-8 text-[#434655]">
        Adjust your preferences or increase your budget to see more exotic long-haul destinations.
      </p>
      <Button asChild className="mt-8 h-14 rounded-full bg-[#0B1D34] px-10 text-lg font-bold text-white hover:bg-[#0B1D34]">
        <TrackedLink
          href="/"
          eventName="cta_clicked"
          eventProperties={{
            page: "/results",
            label: "Start a new search",
            href: "/",
            ctaLocation: "results_final_cta",
          }}
        >
          Start a new search
        </TrackedLink>
      </Button>
    </section>
  );
}

function EmptyResultsState({ parsedParams }: { parsedParams: ParsedSearchParams }) {
  return (
    <section className="rounded-[28px] border border-[#c3c6d7]/35 bg-white p-8 text-center shadow-[0_18px_45px_-26px_rgba(15,23,42,0.35)]">
      <h2 className="text-2xl font-semibold tracking-normal text-[#191c1e]">No destinations match this search yet</h2>
      <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-[#434655]">
        Try increasing your budget, reducing the trip length, changing your travel style, or picking a different
        departure city.
      </p>
      <Button asChild className="mt-5 rounded-full bg-[#0B1D34] px-5 text-white hover:bg-[#0B1D34]">
        <TrackedLink
          href={createResultsHref(parsedParams, {
            budget: Math.max(parsedParams.budget + 500, 1000),
            category: "all",
            destination: "",
            sort: "relevance",
          })}
          eventName="filter_changed"
          eventProperties={{
            page: "/results",
            budget: parsedParams.budget,
            currency: parsedParams.currency,
            days: parsedParams.days,
            filterName: "empty_results_broaden",
            filterValue: Math.max(parsedParams.budget + 500, 1000),
            month: parsedParams.month,
            originCode: parsedParams.origin,
            source: "empty_results_state",
            travelers: parsedParams.travelers,
            travelStyle: parsedParams.style,
            tripLength: parsedParams.days,
          }}
        >
          Broaden this search
        </TrackedLink>
      </Button>
    </section>
  );
}

function toResultDestination(
  recommendation: DestinationRecommendation,
  index: number,
  { budget, currency, days }: ParsedSearchParams
): ResultDestination {
  const { costBreakdown, destination } = recommendation;
  const title = getCityCountryLabel(destination);
  const climate = destination.weather.toLowerCase().includes("tropical") ? "Tropical" : destination.weather.split(" ")[0] ?? "Mild";
  const budgetFitPercent = budget > 0 ? Math.round((recommendation.estimatedTotal / budget) * 100) : 100;
  const budgetDelta =
    recommendation.budgetRemaining >= 0
      ? `${formatMoney(recommendation.budgetRemaining, currency)} under budget`
      : `${formatMoney(Math.abs(recommendation.budgetRemaining), currency)} over budget`;

  return {
    rank: index + 1,
    slug: destination.slug,
    title,
    tag: destination.travelStyles.slice(0, 2).join(" + "),
    total: formatMoney(recommendation.estimatedTotal, currency),
    budgetDelta,
    budgetRemainingValue: recommendation.budgetRemaining,
    budgetFitPercent,
    flightCost: formatMoney(costBreakdown.flights, currency),
    stayCost: formatMoney(costBreakdown.hotel, currency),
    foodCost: formatMoney(costBreakdown.food, currency),
    href: `/travel-budget/${destination.slug}`,
    image: destination.image,
    alt: `${title} destination cost preview`,
    flightTime: flightTimeBySlug[destination.slug] ?? (days > 12 ? "10h+" : "7h 30m"),
    climate,
    entry: destination.countryCode === "CA" ? "Domestic" : "No visa",
    summary: recommendation.reasons[0] ?? destination.shortDescription,
  };
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full bg-[#eceef0] px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#737686]">
      {children}
    </span>
  );
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

function formatOriginLabel(originCode: string) {
  const originPricing = destinationData[0] ? getOriginPricing(destinationData[0], originCode) : undefined;

  return originPricing?.originCity ? `${originPricing.originCity} (${originCode})` : originCode;
}
