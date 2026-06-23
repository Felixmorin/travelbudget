import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, ArrowRight, Bus, CalendarDays, Hotel, Plane, Ticket, Users, Utensils, WalletCards } from "lucide-react";

import { AffiliateCard } from "@/components/site/affiliate-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { destinations, formatMoney } from "@/lib/data/destinations";
import {
  type BudgetFitStatus,
  type CostBreakdown,
  type DestinationRecommendation,
  type SupportedCurrency,
  type TravelStyle,
  recommendDestinations,
} from "@/lib/budget/recommend-destinations";

export const metadata: Metadata = {
  title: "Travel Budget Results | TravelBudget.ai",
  description: "Compare destinations based on your travel budget, trip length, travel style, and departure city.",
};

const supportedMonths = [
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
] as const;
const supportedCurrencies = ["CAD", "USD", "EUR"] as const;
const supportedStyles = ["budget", "balanced", "comfort"] as const;

type ResultsSearchParams = Promise<{ [key: string]: string | string[] | undefined }>;
type SupportedMonth = (typeof supportedMonths)[number];
type ParsedSearch = {
  budget: number;
  currency: SupportedCurrency;
  origin: string;
  days: number;
  month: SupportedMonth;
  travelers: number;
  style: TravelStyle;
};

const DEFAULT_SEARCH: ParsedSearch = {
  budget: 2400,
  currency: "CAD",
  origin: "toronto",
  days: 10,
  month: "october",
  travelers: 2,
  style: "balanced",
};

const fitLabels: Record<BudgetFitStatus, string> = {
  "best-fit": "Best fit",
  stretch: "Stretch",
  "over-budget": "Over budget",
};

const fitStyles: Record<BudgetFitStatus, string> = {
  "best-fit": "bg-teal-50 text-teal-700 ring-1 ring-teal-100",
  stretch: "bg-orange-50 text-orange-700 ring-1 ring-orange-100",
  "over-budget": "bg-red-50 text-red-700 ring-1 ring-red-100",
};

export default async function ResultsPage({ searchParams }: { searchParams: ResultsSearchParams }) {
  const params = await searchParams;
  const search = parseSearchParams(params);
  const recommendations = recommendDestinations({
    destinations,
    ...search,
  });

  return (
    <main className="bg-slate-50">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <Button variant="ghost" size="sm" className="mb-6 rounded-full" asChild>
            <Link href="/">
              <ArrowLeft className="mr-2 size-4" />
              Back to calculator
            </Link>
          </Button>
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">Your search</p>
              <h1 className="mt-2 max-w-3xl text-4xl font-semibold tracking-tight text-slate-950">
                Best destinations from {toTitleCase(search.origin)} under {formatMoney(search.budget, search.currency)}
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
                Ranked by budget fit, adjusted trip cost, seasonality, and travel style match.
              </p>
            </div>
            <Card className="border-slate-200 shadow-sm">
              <CardContent className="grid gap-3 pt-5 sm:grid-cols-3">
                <Summary icon={WalletCards} label="Budget" value={formatMoney(search.budget, search.currency)} />
                <Summary icon={CalendarDays} label="When" value={`${toTitleCase(search.month)}, ${search.days} days`} />
                <Summary icon={Users} label="Travelers" value={`${search.travelers} ${toTitleCase(search.style)}`} />
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_360px] lg:px-8">
        <div className="grid gap-8">
          {(["best-fit", "stretch", "over-budget"] as const).map((status) => {
            const statusRecommendations = recommendations.filter((result) => result.budgetFitStatus === status);

            if (statusRecommendations.length === 0) {
              return null;
            }

            return (
              <section key={status} className="grid gap-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                      {fitLabels[status]} destinations
                    </p>
                    <h2 className="mt-1 text-2xl font-semibold text-slate-950">
                      {getStatusHeading(status)}
                    </h2>
                  </div>
                  <Badge className={fitStyles[status]}>{statusRecommendations.length}</Badge>
                </div>
                <div className="grid gap-5">
                  {statusRecommendations.map((recommendation, index) => (
                    <RecommendationCard
                      key={recommendation.destination.slug}
                      recommendation={recommendation}
                      rank={index + 1}
                      currency={search.currency}
                    />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
        <aside className="grid h-fit gap-4 lg:sticky lg:top-24">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-orange-600">Booking helpers</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-950">Check prices for top matches</h2>
          </div>
          {recommendations.slice(0, 2).flatMap((recommendation) =>
            recommendation.destination.affiliateLinks.slice(0, 2).map((link) => (
              <AffiliateCard
                key={`${recommendation.destination.slug}-${link.type}`}
                link={{
                  ...link,
                  title: `${recommendation.destination.name}: ${link.title}`,
                }}
              />
            ))
          )}
        </aside>
      </section>
    </main>
  );
}

function RecommendationCard({
  recommendation,
  rank,
  currency,
}: {
  recommendation: DestinationRecommendation;
  rank: number;
  currency: string;
}) {
  const { destination, estimatedTotal, budgetRemaining, budgetFitStatus, matchScore, costBreakdown, reasons } =
    recommendation;

  return (
    <Card className="overflow-hidden border-slate-200 bg-white shadow-lg shadow-slate-200/60">
      <div className="grid lg:grid-cols-[0.85fr_1.15fr]">
        <div className="relative min-h-72">
          <Image
            src={destination.image}
            alt={`${destination.name} travel view`}
            fill
            sizes="(min-width: 1024px) 40vw, 100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/15 to-transparent" />
          <Badge className="absolute left-4 top-4 bg-white text-blue-600 shadow">#{rank} match</Badge>
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <h3 className="text-3xl font-semibold">{destination.name}</h3>
            <p className="mt-2 text-sm leading-5 text-white/85">{destination.shortDescription}</p>
          </div>
        </div>
        <CardContent className="grid gap-5 p-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">Estimated trip total</p>
              <p className="text-3xl font-semibold text-slate-950">{formatMoney(estimatedTotal, currency)}</p>
              <p className="mt-1 text-sm text-slate-500">
                {budgetRemaining >= 0
                  ? `${formatMoney(budgetRemaining, currency)} remaining`
                  : `${formatMoney(Math.abs(budgetRemaining), currency)} over budget`}
              </p>
            </div>
            <div className="grid justify-items-end gap-2">
              <Badge className={fitStyles[budgetFitStatus]}>{fitLabels[budgetFitStatus]}</Badge>
              <span className="rounded-full bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700">
                Match {matchScore}/100
              </span>
            </div>
          </div>

          <CostBreakdownGrid costBreakdown={costBreakdown} total={estimatedTotal} currency={currency} />

          <div className="grid gap-2">
            <p className="text-sm font-semibold text-slate-950">Why it matched</p>
            <ul className="grid gap-2 text-sm leading-6 text-slate-600">
              {reasons.map((reason) => (
                <li key={reason} className="flex gap-2">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-orange-500" />
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-wrap gap-3 rounded-xl bg-slate-50 p-4">
            <div className="mr-auto">
              <p className="text-sm font-semibold text-slate-950">Affiliate-ready next step</p>
              <p className="mt-1 text-sm text-slate-500">Compare fares, stays, and activities before booking.</p>
            </div>
            <Button asChild className="rounded-xl bg-orange-500 text-white hover:bg-orange-600">
              <Link href={destination.affiliateLinks[0]?.href ?? `/destinations/${destination.slug}`}>
                Check options
                <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}

function CostBreakdownGrid({
  costBreakdown,
  total,
  currency,
}: {
  costBreakdown: CostBreakdown;
  total: number;
  currency: string;
}) {
  const rows = [
    { key: "flights", label: "Flights", icon: Plane, color: "bg-blue-600" },
    { key: "hotel", label: "Hotels", icon: Hotel, color: "bg-teal-600" },
    { key: "food", label: "Food", icon: Utensils, color: "bg-orange-500" },
    { key: "transport", label: "Transport", icon: Bus, color: "bg-slate-500" },
    { key: "activities", label: "Activities", icon: Ticket, color: "bg-violet-600" },
  ] as const;

  return (
    <div className="grid gap-3">
      {rows.map((row) => {
        const value = costBreakdown[row.key];
        const Icon = row.icon;
        const percent = total > 0 ? Math.max(4, Math.round((value / total) * 100)) : 0;

        return (
          <div key={row.key} className="grid gap-2">
            <div className="flex items-center justify-between gap-3 text-sm">
              <span className="flex items-center gap-2 font-medium text-slate-700">
                <Icon className="size-4 text-slate-400" />
                {row.label}
              </span>
              <span className="font-semibold text-slate-950">{formatMoney(value, currency)}</span>
            </div>
            <div className="h-2 rounded-full bg-slate-100">
              <div className={`h-2 rounded-full ${row.color}`} style={{ width: `${percent}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Summary({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex size-9 items-center justify-center rounded-full bg-blue-50 text-blue-600">
        <Icon className="size-4" />
      </span>
      <div>
        <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
        <p className="text-sm font-semibold text-slate-950">{value}</p>
      </div>
    </div>
  );
}

function parseSearchParams(params: Awaited<ResultsSearchParams>): ParsedSearch {
  return {
    budget: getPositiveNumber(getParam(params.budget), DEFAULT_SEARCH.budget, 100, 250000),
    currency: getSupportedValue(
      supportedCurrencies,
      getParam(params.currency).toUpperCase(),
      DEFAULT_SEARCH.currency
    ),
    origin: getOrigin(getParam(params.origin, DEFAULT_SEARCH.origin)),
    days: getPositiveInteger(getParam(params.days), DEFAULT_SEARCH.days, 1, 60),
    month: getSupportedValue(supportedMonths, normalizeToken(getParam(params.month)), DEFAULT_SEARCH.month),
    travelers: getPositiveInteger(getParam(params.travelers), DEFAULT_SEARCH.travelers, 1, 12),
    style: getSupportedValue(supportedStyles, normalizeToken(getParam(params.style)), DEFAULT_SEARCH.style),
  };
}

function getParam(value: string | string[] | undefined, fallback = "") {
  if (Array.isArray(value)) {
    return value[0] ?? fallback;
  }

  return value ?? fallback;
}

function getPositiveNumber(value: string, fallback: number, min: number, max: number) {
  const parsed = Number(value.replace(/,/g, ""));

  if (!Number.isFinite(parsed)) {
    return fallback;
  }

  return Math.min(max, Math.max(min, Math.round(parsed)));
}

function getPositiveInteger(value: string, fallback: number, min: number, max: number) {
  return Math.min(max, Math.max(min, Math.round(getPositiveNumber(value, fallback, min, max))));
}

function getOrigin(value: string) {
  const normalized = value
    .trim()
    .replace(/\s+/g, " ")
    .replace(/[^\p{L}\p{N}\s.'-]/gu, "")
    .slice(0, 80);

  return normalized || DEFAULT_SEARCH.origin;
}

function getSupportedValue<const T extends readonly string[]>(options: T, value: string, fallback: T[number]) {
  return options.some((option) => option === value) ? (value as T[number]) : fallback;
}

function normalizeToken(value: string) {
  return value.trim().toLowerCase();
}

function getStatusHeading(status: BudgetFitStatus) {
  if (status === "best-fit") {
    return "Strong matches inside your budget";
  }

  if (status === "stretch") {
    return "Close enough to watch for deals";
  }

  return "Aspirational picks that need more budget";
}

function toTitleCase(value: string) {
  return value
    .split(/[\s-]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}
