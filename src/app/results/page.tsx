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
import { EmailCaptureForm } from "@/components/analytics/email-capture-form";
import { TrackedFilterForm } from "@/components/analytics/tracked-form";
import { TrackedLink } from "@/components/analytics/tracked-link";
import { EstimateTransparency } from "@/components/site/estimate-transparency";
import { Button } from "@/components/ui/button";
import { buildAffiliateLink, type BuiltAffiliateLink } from "@/lib/affiliate/build-affiliate-link";
import {
  recommendDestinations,
  type DestinationRecommendation,
  type TravelStyle,
} from "@/lib/budget/recommend-destinations";
import type { AffiliateLink } from "@/lib/data/destinations";
import {
  formatMoney,
  getOriginPricing,
} from "@/lib/data/destinations";
import { activeDepartureCities } from "@/lib/data/departure-cities";
import { getCityCountryLabel, getDestinationCountryName, unifiedDestinations as destinationData } from "@/lib/data/unified-destinations";
import {
  createResultsHref,
  filterAndSortRecommendations,
  getClimateCategory,
  getDestinationContinent,
  getEstimatedFlightHours,
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
  country: string;
  tag: string;
  total: string;
  budgetDelta: string;
  budgetRemainingValue: number;
  budgetFitPercent: number;
  flightCost: string;
  stayCost: string;
  foodCost: string;
  transportCost: string;
  activitiesCost: string;
  bufferCost: string;
  href: string;
  image: string;
  alt: string;
  flightTime: string;
  climate: string;
  continent: string;
  entry: string;
  bestFor: string;
  bestSeason: string;
  summary: string;
  lastUpdated: string;
  affiliateLinks: ResultAffiliateLink[];
};

export type ResultAffiliateLink = BuiltAffiliateLink & {
  actionLabel: string;
  title: string;
  type: AffiliateLink["type"];
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
  const summaryText = `${formattedBudget} · ${parsedParams.days} days · From ${originLabel} · ${styleLabel}`;
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

          <TrustNote />
          <EstimateTransparency
            currency={parsedParams.currency}
            lastUpdated={getLatestDestinationUpdate(destinations)}
            sources={[
              "GoByBudget static destination and departure-city pricing dataset",
              "Modeled flight baselines and destination daily cost categories",
            ]}
            assumptions={[
              `${parsedParams.travelers} traveler${parsedParams.travelers === 1 ? "" : "s"}, ${parsedParams.days} days, ${styleLabel} style, from ${originLabel}`,
              "Includes flights, stay, food, local transport, activities, and buffer where data is available",
            ]}
          />

          <ResultsControls parsedParams={parsedParams} resultCount={recommendations.length} />

          {featuredDestinations.length > 0 ? (
            <ResultsComparisonSection destinations={featuredDestinations} analyticsContext={analyticsContext} />
          ) : (
            <EmptyResultsState parsedParams={parsedParams} />
          )}

          <EmailCaptureSection analyticsContext={analyticsContext} summaryText={summaryText} />
          <AffiliateBookingBox analyticsContext={analyticsContext} destination={featuredDestinations[0]} />
          <TrustModule />
          <SeoLinks budget={formattedBudget} origin={originLabel} destinations={featuredDestinations} />
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
          <p className="mb-3 text-sm font-bold uppercase tracking-widest text-[#737686]">{summaryText}</p>
          <h1 className="max-w-3xl text-4xl font-bold leading-tight tracking-normal text-[#191c1e] sm:text-5xl">
            Best destinations for your budget
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-[#434655]">
            Here are the best destinations that fit your budget.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Pill>{formatMoney(parsedParams.budget, parsedParams.currency)}</Pill>
            <Pill>{parsedParams.days} days</Pill>
            <Pill>From {formatOriginLabel(parsedParams.origin)}</Pill>
            <Pill>{formatStyleLabel(parsedParams.style)}</Pill>
            {parsedParams.climate !== "all" ? <Pill>{parsedParams.climate}</Pill> : null}
            {parsedParams.continent !== "all" ? <Pill>{formatFilterLabel(parsedParams.continent)}</Pill> : null}
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
            <input type="hidden" name="continent" value={parsedParams.continent} />
            <input type="hidden" name="climate" value={parsedParams.climate} />
            <input type="hidden" name="destination" value={parsedParams.destination} />
            <input type="hidden" name="flightTime" value={parsedParams.flightTime} />
            <input type="hidden" name="visaFriendly" value={parsedParams.visaFriendly} />
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

function TrustNote() {
  return (
    <section className="mb-8 rounded-2xl border border-[#c3c6d7]/40 bg-white px-4 py-3 shadow-sm sm:px-5">
      <div className="flex items-start gap-3 text-sm font-medium leading-6 text-[#434655]">
        <ShieldCheck className="mt-0.5 size-5 shrink-0 text-[#006b5f]" />
        <p>Estimate includes flights, hotel, food, local transport, activities and a buffer.</p>
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
        className="grid grid-cols-1 gap-3 rounded-3xl border border-[#c3c6d7]/35 bg-white/70 p-4 shadow-[0_18px_45px_-32px_rgba(15,23,42,0.45)] backdrop-blur sm:grid-cols-2 lg:grid-cols-4"
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
        <Field label="Continent">
          <select name="continent" defaultValue={parsedParams.continent} className="field-input">
            <option value="all">Any continent</option>
            <option value="europe">Europe</option>
            <option value="north-america">North America</option>
            <option value="central-america">Central America</option>
            <option value="south-america">South America</option>
            <option value="asia">Asia</option>
            <option value="africa">Africa</option>
            <option value="oceania">Oceania</option>
          </select>
        </Field>
        <Field label="Climate">
          <select name="climate" defaultValue={parsedParams.climate} className="field-input">
            <option value="all">Any climate</option>
            <option value="warm">Warm</option>
            <option value="mild">Mild</option>
            <option value="tropical">Tropical</option>
            <option value="cool">Cool</option>
          </select>
        </Field>
        <Field label="From">
          <select name="origin" defaultValue={parsedParams.origin} className="field-input">
            {activeDepartureCities.map((city) => (
              <option key={city.slug} value={city.airportCodes[0]}>
                {city.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Style">
          <select name="style" defaultValue={parsedParams.style} className="field-input">
            <option value="budget">Budget</option>
            <option value="balanced">Balanced</option>
            <option value="comfort">Comfort</option>
          </select>
        </Field>
        <Field label="Flight time">
          <select name="flightTime" defaultValue={parsedParams.flightTime} className="field-input">
            <option value="all">Any flight time</option>
            <option value="short">Short, up to 6h</option>
            <option value="medium">Medium, 6-10h</option>
            <option value="long">Long haul, 10h+</option>
          </select>
        </Field>
        <Field label="Season">
          <select name="month" defaultValue={parsedParams.month} className="field-input">
            <option value="october">October / flexible</option>
            <option value="january">January</option>
            <option value="february">February</option>
            <option value="march">March</option>
            <option value="april">April</option>
            <option value="may">May</option>
            <option value="june">June</option>
            <option value="july">July</option>
            <option value="august">August</option>
            <option value="september">September</option>
            <option value="november">November</option>
            <option value="december">December</option>
          </select>
        </Field>
        <Field label="Visa">
          <select name="visaFriendly" defaultValue={parsedParams.visaFriendly} className="field-input">
            <option value="all">Any entry rules</option>
            <option value="yes">Visa-friendly</option>
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

function EmailCaptureSection({
  analyticsContext,
  summaryText,
}: {
  analyticsContext: {
    budget: number;
    currency: string;
    days: number;
    month: string;
    originCity: string;
    originCode: string;
    resultCount: number;
    travelers: number;
    travelStyle: string;
  };
  summaryText: string;
}) {
  return (
    <section className="mt-14 rounded-3xl border border-[#c3c6d7]/35 bg-white p-6 shadow-[0_18px_45px_-32px_rgba(15,23,42,0.45)] md:p-8">
      <div className="grid gap-5 md:grid-cols-[1fr_minmax(18rem,28rem)] md:items-center">
        <div>
          <h2 className="text-2xl font-semibold tracking-normal text-[#191c1e]">Send me this trip budget</h2>
          <p className="mt-2 text-sm leading-6 text-[#434655]">
            Keep this search on file for {summaryText}. We will send the budget handoff when it is ready.
          </p>
        </div>
        <EmailCaptureForm
          buttonLabel="Send me this trip budget"
          inputLabel="Email address for this trip budget"
          eventProperties={{
            page: "/results",
            source: "results_email_capture",
            ...analyticsContext,
            tripLength: analyticsContext.days,
          }}
        />
      </div>
    </section>
  );
}

function AffiliateBookingBox({
  analyticsContext,
  destination,
}: {
  analyticsContext: {
    budget: number;
    currency: string;
    days: number;
    month: string;
    originCity: string;
    originCode: string;
    resultCount: number;
    travelers: number;
    travelStyle: string;
  };
  destination: ResultDestination | undefined;
}) {
  const links = buildBookingLinks(destination);

  return (
    <section className="mt-10 rounded-3xl border border-[#c3c6d7]/35 bg-[#f2f4f6] p-6 md:p-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-normal text-[#191c1e]">Book this trip smarter</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#434655]">
            Check live booking prices against the estimate before you commit.
          </p>
        </div>
      </div>
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {links.map((link) => (
          <TrackedLink
            key={link.label}
            href={link.href}
            prefetch={false}
            target={link.target}
            rel={link.rel}
            eventName="affiliate_click"
            eventProperties={{
              page: "/results",
              ...analyticsContext,
              affiliatePartner: link.partner,
              affiliateProvider: link.provider,
              affiliateType: link.type,
              destinationName: destination?.title,
              destinationSlug: destination?.slug,
              href: link.href,
              label: link.label,
              source: "results_booking_box",
              tripLength: analyticsContext.days,
            }}
            secondaryEvents={[
              {
                eventName: "affiliate_link_clicked",
                eventProperties: {
                  page: "/results",
                  ...analyticsContext,
                  affiliatePartner: link.partner,
                  affiliateProvider: link.provider,
                  affiliateType: link.type,
                  destinationName: destination?.title,
                  destinationSlug: destination?.slug,
                  href: link.href,
                  label: link.label,
                  linkType: link.type,
                  source: "results_booking_box",
                  title: link.label,
                  tripLength: analyticsContext.days,
                },
              },
            ]}
            className="flex min-h-24 flex-col justify-between rounded-2xl border border-[#c3c6d7]/45 bg-white p-4 text-sm font-bold text-[#0B1D34] transition hover:border-[#0B1D34]"
          >
            <span>{link.label}</span>
            <span className="text-xs font-medium text-[#737686]">{link.hint}</span>
          </TrackedLink>
        ))}
      </div>
    </section>
  );
}

function buildBookingLinks(destination: ResultDestination | undefined) {
  const fallbackLinks = [
    { label: "Compare flights", type: "Flights" as const, href: "https://www.skyscanner.ca/transport/flights/", hint: "Live fare search" },
    { label: "Compare hotels", type: "Hotels" as const, href: "/destinations", hint: "Stay options" },
    { label: "Get an eSIM", type: "eSIM" as const, href: "/travel-budget-calculator", hint: "Mobile data" },
    { label: "Compare travel insurance", type: "Insurance" as const, href: "/travel-budget-calculator", hint: "Coverage check" },
    { label: "Find activities", type: "Activities" as const, href: "/destinations", hint: "Tours and experiences" },
  ];

  return fallbackLinks.map((fallbackLink) => {
    const destinationLink = destination?.affiliateLinks.find((link) => link.type === fallbackLink.type);

    return {
      href: destinationLink?.href ?? fallbackLink.href,
      hint: fallbackLink.hint,
      label: fallbackLink.label,
      partner: destinationLink?.partner,
      provider: destinationLink?.provider,
      rel: destinationLink?.rel ?? (fallbackLink.href.startsWith("http") ? "nofollow sponsored noopener noreferrer" : undefined),
      target: destinationLink?.target ?? (fallbackLink.href.startsWith("http") ? "_blank" : undefined),
      type: fallbackLink.type,
    };
  });
}

function SeoLinks({ budget, destinations, origin }: { budget: string; destinations: ResultDestination[]; origin: string }) {
  const primaryDestination = destinations[0];
  const secondaryDestination = destinations[1];
  const links = [
    { label: "Travel budget calculator", href: "/travel-budget-calculator" },
    { label: "Destinations hub", href: "/destinations" },
    { label: `${primaryDestination?.title.split(",")[0] ?? "Portugal"} travel budget`, href: `/travel-budget/${primaryDestination?.slug ?? "portugal"}` },
    { label: `${secondaryDestination?.title.split(",")[0] ?? "Mexico"} travel cost guide`, href: `/travel-cost/${secondaryDestination?.slug ?? "mexico"}/10-days` },
    { label: "Compare destinations", href: "/compare" },
    { label: "Budget travel guides", href: "/guides" },
  ];

  return (
    <section className="mt-20 border-t border-[#c3c6d7]/30 pt-10">
      <h2 className="mb-6 text-sm font-bold uppercase tracking-widest text-[#434655]">
        Where can you travel with {budget} from {origin}?
      </h2>
      <div className="flex flex-wrap gap-x-12 gap-y-4">
        {links.map((link) => (
          <TrackedLink
            key={link.href}
            href={link.href}
            eventName="guide_clicked"
            eventProperties={{
              page: "/results",
              guideTitle: link.label,
              href: link.href,
            }}
            className="text-base text-[#434655] transition hover:text-[#0B1D34]"
          >
            {link.label}
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
  const country = getDestinationCountryName(destination);
  const climate = formatFilterLabel(getClimateCategory(destination.weather));
  const budgetFitPercent = budget > 0 ? Math.round((recommendation.estimatedTotal / budget) * 100) : 100;
  const budgetDelta =
    recommendation.budgetRemaining >= 0
      ? `${formatMoney(recommendation.budgetRemaining, currency)} under budget`
      : `${formatMoney(Math.abs(recommendation.budgetRemaining), currency)} over budget`;

  return {
    rank: index + 1,
    slug: destination.slug,
    title,
    country,
    tag: destination.travelStyles.slice(0, 2).join(" + "),
    total: formatMoney(recommendation.estimatedTotal, currency),
    budgetDelta,
    budgetRemainingValue: recommendation.budgetRemaining,
    budgetFitPercent,
    flightCost: formatMoney(costBreakdown.flights, currency),
    stayCost: formatMoney(costBreakdown.hotel, currency),
    foodCost: formatMoney(costBreakdown.food, currency),
    transportCost: formatMoney(costBreakdown.transport, currency),
    activitiesCost: formatMoney(costBreakdown.activities, currency),
    bufferCost: formatMoney(costBreakdown.misc, currency),
    href: `/destinations/${destination.slug}`,
    image: destination.image,
    alt: `${title} destination cost preview`,
    flightTime: flightTimeBySlug[destination.slug] ?? formatFlightHours(getEstimatedFlightHours(destination.slug), days),
    climate,
    continent: formatFilterLabel(getDestinationContinent(destination.countryCode)),
    entry: destination.countryCode === "CA" ? "Domestic" : "Visa-friendly",
    bestFor: destination.travelStyles.slice(0, 3).join(", "),
    bestSeason: destination.bestMonths.slice(0, 4).join(", "),
    summary: recommendation.reasons[0] ?? destination.shortDescription,
    lastUpdated: destination.lastUpdated,
    affiliateLinks: destination.affiliateLinks.map((link) => toResultAffiliateLink(destination, link)),
  };
}

function toResultAffiliateLink(
  destination: DestinationRecommendation["destination"],
  link: AffiliateLink
): ResultAffiliateLink {
  return {
    ...buildAffiliateLink({ destination, link }),
    actionLabel: getAffiliateActionLabel(link.type),
    title: link.title,
    type: link.type,
  };
}

function getAffiliateActionLabel(type: AffiliateLink["type"]) {
  if (type === "Flights") {
    return "Check flight prices";
  }

  if (type === "Hotels") {
    return "Compare hotels";
  }

  if (type === "eSIM") {
    return "Get an eSIM";
  }

  if (type === "Insurance") {
    return "Compare travel insurance";
  }

  return "Find activities";
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

function formatFilterLabel(value: string) {
  if (value === "all") {
    return "Flexible";
  }

  return value
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function formatFlightHours(hours: number, days: number) {
  if (hours > 10) {
    return "10h+";
  }

  return days > 12 ? `${Math.max(hours, 7)}h` : `${hours}h`;
}

function getLatestDestinationUpdate(destinations: ResultDestination[]) {
  const latest = destinations
    .map((destination) => destination.lastUpdated)
    .filter(Boolean)
    .sort()
    .at(-1);

  return latest ?? "2026-06-24";
}
