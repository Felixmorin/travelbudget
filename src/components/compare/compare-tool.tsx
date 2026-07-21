"use client";

import { useMemo, useState } from "react";
import { ArrowRight, ArrowUpDown, Copy, Plane, Search, WalletCards } from "lucide-react";

import { TrackedLink } from "@/components/analytics/tracked-link";
import { FlightAffiliateLink } from "@/components/affiliate/FlightAffiliateLink";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { compareDestinations, createLengthComparisons } from "@/lib/compare/compare-destinations";
import { convertFromCad, formatCompareMoney } from "@/lib/compare/currency";
import { generateCostExplanation, generateQuickAnswer, createProfileVerdicts } from "@/lib/compare/generate-verdict";
import {
  compareMonthOptions,
  compareStyleOptions,
  supportedCurrencies,
  type CompareParams,
  type SupportedCurrency,
  type TripComparison,
} from "@/lib/compare/types";
import {
  defaultCompareParams,
  getOriginCode,
  originOptions,
  serializeCompareParams,
} from "@/lib/compare/url-params";
import { getCityCountryLabel, unifiedDestinations } from "@/lib/data/unified-destinations";
import { getDestinationIata } from "@/lib/affiliates/iata";
import { formatMoney } from "@/lib/format-money";
import { getComparisonPath, getPublishedComparisonPages } from "@/lib/programmatic/comparison-pages";

const destinationOptions = unifiedDestinations
  .filter((destination) => destination.destinationKind === "city")
  .sort((a, b) => getCityCountryLabel(a).localeCompare(getCityCountryLabel(b)));

export function CompareTool({ initialParams = defaultCompareParams }: { initialParams?: CompareParams }) {
  const [draft, setDraft] = useState<CompareParams>(initialParams);
  const [params, setParams] = useState<CompareParams>(initialParams);
  const [copyState, setCopyState] = useState<"idle" | "copied">("idle");
  const destinationA = unifiedDestinations.find((destination) => destination.slug === params.destinationA);
  const destinationB = unifiedDestinations.find((destination) => destination.slug === params.destinationB);
  const comparison = useMemo(
    () => compareDestinations({ destinationA, destinationB, params }),
    [destinationA, destinationB, params]
  );

  function updateDraft<K extends keyof CompareParams>(key: K, value: CompareParams[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  function runComparison() {
    const nextParams = draft.destinationA === draft.destinationB
      ? { ...draft, destinationB: defaultCompareParams.destinationB }
      : draft;

    setDraft(nextParams);
    setParams(nextParams);
    window.history.pushState(null, "", serializeCompareParams(nextParams));
  }

  async function copyLink() {
    const href = `${window.location.origin}${serializeCompareParams(params)}`;
    await navigator.clipboard.writeText(href);
    setCopyState("copied");
    window.setTimeout(() => setCopyState("idle"), 1800);
  }

  function swapDestinations() {
    setDraft((current) => ({
      ...current,
      destinationA: current.destinationB,
      destinationB: current.destinationA,
    }));
  }

  return (
    <div className="grid gap-8">
      <Card className="border-slate-200 bg-white shadow-xl shadow-slate-200/70">
        <CardContent className="pt-6">
          <form
            className="grid gap-4 lg:grid-cols-[1fr_auto_1fr] lg:items-end"
            onSubmit={(event) => {
              event.preventDefault();
              runComparison();
            }}
          >
            <Field label="Destination A" htmlFor="destination-a">
              <select
                id="destination-a"
                value={draft.destinationA}
                onChange={(event) => updateDraft("destinationA", event.target.value)}
                className="field-input"
              >
                {destinationOptions.map((destination) => (
                  <option key={destination.slug} value={destination.slug}>
                    {getCityCountryLabel(destination)}
                  </option>
                ))}
              </select>
            </Field>
            <Button
              type="button"
              variant="outline"
              className="h-11 rounded-full bg-white"
              onClick={swapDestinations}
              aria-label="Invert the two destinations"
            >
              <ArrowUpDown className="size-4" />
              Swap
            </Button>
            <Field label="Destination B" htmlFor="destination-b">
              <select
                id="destination-b"
                value={draft.destinationB}
                onChange={(event) => updateDraft("destinationB", event.target.value)}
                className="field-input"
              >
                {destinationOptions.map((destination) => (
                  <option key={destination.slug} value={destination.slug}>
                    {getCityCountryLabel(destination)}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Origin city" htmlFor="origin">
              <select
                id="origin"
                value={draft.origin}
                onChange={(event) => updateDraft("origin", event.target.value)}
                className="field-input"
              >
                {originOptions.map((origin) => (
                  <option key={origin.value} value={origin.value}>
                    {origin.label} ({origin.code})
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Trip length" htmlFor="days">
              <select
                id="days"
                value={String(draft.days)}
                onChange={(event) => updateDraft("days", Number(event.target.value))}
                className="field-input"
              >
                {[3, 5, 7, 10, 14].map((days) => (
                  <option key={days} value={days}>
                    {days} days
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Number of travelers" htmlFor="travelers">
              <input
                id="travelers"
                type="number"
                min={1}
                max={12}
                value={draft.travelers}
                onChange={(event) => updateDraft("travelers", Number(event.target.value))}
                className="field-input"
              />
            </Field>
            <Field label="Travel month" htmlFor="month">
              <select
                id="month"
                value={draft.month}
                onChange={(event) => updateDraft("month", event.target.value as CompareParams["month"])}
                className="field-input"
              >
                {compareMonthOptions.map((month) => (
                  <option key={month} value={month}>
                    {toTitle(month)}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Travel style" htmlFor="style">
              <select
                id="style"
                value={draft.style}
                onChange={(event) => updateDraft("style", event.target.value as CompareParams["style"])}
                className="field-input"
              >
                {compareStyleOptions.map((style) => (
                  <option key={style} value={style}>
                    {toTitle(style)}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Currency" htmlFor="currency">
              <select
                id="currency"
                value={draft.currency}
                onChange={(event) => updateDraft("currency", event.target.value as SupportedCurrency)}
                className="field-input"
              >
                {supportedCurrencies.map((currency) => (
                  <option key={currency} value={currency}>
                    {currency}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Your total budget" htmlFor="budget">
              <input
                id="budget"
                type="number"
                min={0}
                step={50}
                value={draft.budget ?? ""}
                onChange={(event) => updateDraft("budget", event.target.value ? Number(event.target.value) : undefined)}
                className="field-input"
              />
            </Field>
            <div className="flex flex-wrap items-end gap-3 lg:col-span-2">
              <Button type="submit" className="h-11 rounded-full bg-[#0B1D34] px-5 text-white hover:bg-[#0B1D34]">
                <Search className="size-4" />
                Compare trip costs
              </Button>
              <Button type="button" variant="outline" className="h-11 rounded-full bg-white" onClick={copyLink}>
                <Copy className="size-4" />
                {copyState === "copied" ? "Copied" : "Copy comparison link"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {comparison ? <ComparisonResults comparison={comparison} /> : <MissingDataState />}
      <PlanFromComparisonLinks params={draft} />
    </div>
  );
}

function ComparisonResults({ comparison }: { comparison: TripComparison }) {
  const a = getCityCountryLabel(comparison.destinationA.destination);
  const b = getCityCountryLabel(comparison.destinationB.destination);
  const cheaper = comparison.cheaper === "a" ? a : comparison.cheaper === "b" ? b : "Tie";
  const lengthComparisons = createLengthComparisons({
    destinationA: comparison.destinationA.destination,
    destinationB: comparison.destinationB.destination,
    params: comparison.params,
  });
  const profileVerdicts = createProfileVerdicts(comparison);

  return (
    <div className="grid gap-8" aria-live="polite">
      {comparison.warnings.length > 0 ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
          {comparison.warnings.map((warning) => (
            <p key={warning}>{warning}</p>
          ))}
        </div>
      ) : null}

      <section className="rounded-[24px] border border-slate-200 bg-white p-6">
        <p className="text-sm font-semibold uppercase tracking-wide text-[#0B1D34]">{a} vs {b}: quick answer</p>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">{cheaper} is cheaper overall</h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">{generateQuickAnswer(comparison)}</p>
        <div className="mt-6 grid gap-4 md:grid-cols-4">
          <MetricCard label="Cheaper overall" value={cheaper} />
          <MetricCard label="Estimated savings" value={formatCompareMoney(comparison.savings, comparison.params.currency)} />
          <MetricCard
            label="Lower daily cost"
            value={comparison.dailyDifference === null ? "Unavailable" : formatCompareMoney(comparison.dailyDifference, comparison.params.currency)}
          />
          <MetricCard label="Best for" value={profileVerdicts[0]?.profile ?? "Comparable trips"} />
        </div>
        {comparison.lessPercent !== null && comparison.morePercent !== null && comparison.cheaper !== "tie" ? (
          <p className="mt-5 text-sm leading-6 text-slate-600">
            {cheaper} costs {comparison.lessPercent}% less than {comparison.cheaper === "a" ? b : a}.{" "}
            {comparison.cheaper === "a" ? b : a} costs {comparison.morePercent}% more than {cheaper}.
          </p>
        ) : null}
      </section>

      <CostBreakdownTable comparison={comparison} />
      <CostChart comparison={comparison} />

      <section className="rounded-[24px] border border-slate-200 bg-white p-6">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-950">Why {comparison.cheaper === "a" ? b : a} costs more</h2>
        <p className="mt-3 text-sm leading-7 text-slate-600">{generateCostExplanation(comparison)}</p>
      </section>

      <section className="rounded-[24px] border border-slate-200 bg-white p-6">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-950">Cost by trip length</h2>
        <div className="mt-5 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Length</TableHead>
                <TableHead>{a}</TableHead>
                <TableHead>{b}</TableHead>
                <TableHead>Estimated savings</TableHead>
                <TableHead>Cheaper</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lengthComparisons.map(({ days, comparison: item }) => (
                <TableRow key={days}>
                  <TableCell>{days} days</TableCell>
                  <TableCell>{formatCompareMoney(item?.destinationA.total ?? null, comparison.params.currency)}</TableCell>
                  <TableCell>{formatCompareMoney(item?.destinationB.total ?? null, comparison.params.currency)}</TableCell>
                  <TableCell>{formatCompareMoney(item?.savings ?? null, comparison.params.currency)}</TableCell>
                  <TableCell>{item?.cheaper === "a" ? a : item?.cheaper === "b" ? b : "Tie"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>

      <BudgetFitSection comparison={comparison} />
      <ProfileVerdicts rows={profileVerdicts} />
      <AffiliateCtas comparison={comparison} />
    </div>
  );
}

function CostBreakdownTable({ comparison }: { comparison: TripComparison }) {
  const a = getCityCountryLabel(comparison.destinationA.destination);
  const b = getCityCountryLabel(comparison.destinationB.destination);

  return (
    <section className="rounded-[24px] border border-slate-200 bg-white p-6">
      <h2 className="text-2xl font-semibold tracking-tight text-slate-950">Trip cost breakdown</h2>
      <div className="mt-5 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Category</TableHead>
              <TableHead>{a}</TableHead>
              <TableHead>{b}</TableHead>
              <TableHead>Difference</TableHead>
              <TableHead>Winner</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {comparison.rows.map((row) => (
              <TableRow key={row.key}>
                <TableCell className="font-semibold text-slate-950">{row.label}</TableCell>
                <TableCell>{formatCompareMoney(row.a, comparison.params.currency)}</TableCell>
                <TableCell>{formatCompareMoney(row.b, comparison.params.currency)}</TableCell>
                <TableCell>{row.difference === null ? "Unavailable" : formatCompareMoney(Math.abs(row.difference), comparison.params.currency)}</TableCell>
                <TableCell>{row.winner === "a" ? a : row.winner === "b" ? b : row.winner === "tie" ? "Tie" : "Unavailable"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}

function CostChart({ comparison }: { comparison: TripComparison }) {
  const rows = comparison.rows.filter((row) =>
    ["flights", "accommodation", "food", "localTransportation", "activities"].includes(row.key)
  );
  const max = Math.max(...rows.flatMap((row) => [row.a ?? 0, row.b ?? 0]), 1);
  const a = getCityCountryLabel(comparison.destinationA.destination);
  const b = getCityCountryLabel(comparison.destinationB.destination);

  return (
    <section className="rounded-[24px] border border-slate-200 bg-white p-6">
      <h2 className="text-2xl font-semibold tracking-tight text-slate-950">Where the costs differ</h2>
      <div className="mt-5 grid gap-5">
        {rows.map((row) => (
          <div key={row.key} className="grid gap-2">
            <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
              <span className="font-semibold text-slate-950">{row.label}</span>
              <span className="text-slate-500">
                {formatCompareMoney(row.a, comparison.params.currency)} vs {formatCompareMoney(row.b, comparison.params.currency)}
              </span>
            </div>
            <div className="grid gap-2" aria-label={`${row.label}: ${a} compared with ${b}`}>
              <Bar label={a} value={row.a} max={max} className="bg-[#0B1D34]" />
              <Bar label={b} value={row.b} max={max} className="bg-[#14B8A6]" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function BudgetFitSection({ comparison }: { comparison: TripComparison }) {
  if (!comparison.params.budget || !comparison.budgetFitA || !comparison.budgetFitB) {
    return (
      <section className="rounded-[24px] border border-slate-200 bg-white p-6">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-950">Can I afford it?</h2>
        <p className="mt-3 text-sm leading-6 text-slate-600">Enter your total budget in the form above to see budget fit for each destination.</p>
        <Button asChild className="mt-5 rounded-full bg-[#0B1D34] text-white hover:bg-[#0B1D34]">
          <TrackedLink href="/results" eventName="cta_clicked" eventProperties={{ page: "/compare", label: "Find destinations that fit my budget", href: "/results" }}>
            Find destinations that fit my budget
            <ArrowRight className="size-4" />
          </TrackedLink>
        </Button>
      </section>
    );
  }

  return (
    <section className="rounded-[24px] border border-slate-200 bg-white p-6">
      <h2 className="text-2xl font-semibold tracking-tight text-slate-950">Can I afford it?</h2>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <BudgetFitCard label={getCityCountryLabel(comparison.destinationA.destination)} total={comparison.destinationA.total} fit={comparison.budgetFitA} currency={comparison.params.currency} />
        <BudgetFitCard label={getCityCountryLabel(comparison.destinationB.destination)} total={comparison.destinationB.total} fit={comparison.budgetFitB} currency={comparison.params.currency} />
      </div>
      <Button asChild className="mt-5 rounded-full bg-[#0B1D34] text-white hover:bg-[#0B1D34]">
        <TrackedLink
          href={`/results?budget=${comparison.params.budget}&currency=${comparison.params.currency}&origin=${comparison.params.origin}&days=${comparison.params.days}&travelers=${comparison.params.travelers}&style=${comparison.params.style === "budget" ? "budget" : "balanced"}&month=${comparison.params.month}`}
          eventName="cta_clicked"
          eventProperties={{ page: "/compare", label: "Find destinations that fit my budget", href: "/results" }}
        >
          Find destinations that fit my budget
          <ArrowRight className="size-4" />
        </TrackedLink>
      </Button>
    </section>
  );
}

function ProfileVerdicts({ rows }: { rows: { profile: string; destination: string; reason: string }[] }) {
  return (
    <section className="rounded-[24px] border border-slate-200 bg-white p-6">
      <h2 className="text-2xl font-semibold tracking-tight text-slate-950">Which destination should you choose?</h2>
      <div className="mt-5 grid gap-3">
        {rows.map((row) => (
          <div key={row.profile} className="grid gap-2 rounded-2xl bg-slate-50 p-4 md:grid-cols-[220px_1fr]">
            <p className="font-semibold text-slate-950">{row.profile}</p>
            <p className="text-sm leading-6 text-slate-600">
              <span className="font-semibold text-slate-950">{row.destination}</span> — {row.reason}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function AffiliateCtas({ comparison }: { comparison: TripComparison }) {
  const destinations = [comparison.destinationA.destination, comparison.destinationB.destination];

  return (
    <section className="rounded-[24px] border border-slate-200 bg-white p-6">
      <h2 className="text-2xl font-semibold tracking-tight text-slate-950">Check live prices before booking</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">Some links may be affiliate links. GoByBudget may earn a commission at no extra cost to you.</p>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {destinations.map((destination) => {
          const label = getCityCountryLabel(destination);
          const flight = destination.affiliateLinks.find((link) => link.type === "Flights");
          const hotels = destination.affiliateLinks.find((link) => link.type === "Hotels");

          return (
            <div key={destination.slug} className="rounded-2xl border border-slate-200 p-4">
              <h3 className="font-semibold text-slate-950">{label}</h3>
              <div className="mt-4 grid gap-3">
                {flight ? (
                  <AffiliateButton
                    destination={destination}
                    link={flight}
                    label={`Check flights to ${label}`}
                    icon="flight"
                    originIata={getOriginCode(comparison.params.origin)}
                    adults={comparison.params.travelers}
                  />
                ) : null}
                {hotels ? <AffiliateButton destination={destination} link={hotels} label={`Compare hotels in ${label}`} icon="hotel" /> : null}
                <Button asChild variant="outline" className="justify-start rounded-full bg-white">
                  <TrackedLink
                    href={`/destinations/${destination.slug}`}
                    eventName="cta_clicked"
                    eventProperties={{ page: "/compare", label: `Build this ${label} trip`, href: `/destinations/${destination.slug}` }}
                  >
                    Build this {label} trip
                    <ArrowRight className="size-4" />
                  </TrackedLink>
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function AffiliateButton({
  adults,
  destination,
  icon,
  label,
  link,
  originIata,
}: {
  adults?: number;
  destination: TripComparison["destinationA"]["destination"];
  icon: "flight" | "hotel";
  label: string;
  link: TripComparison["destinationA"]["destination"]["affiliateLinks"][number];
  originIata?: string;
}) {
  const isExternal = /^https?:\/\//i.test(link.href);
  const href = link.href || `/destinations/${destination.slug}`;

  if (icon === "flight") {
    return (
      <Button asChild variant="outline" className="justify-start rounded-full bg-white">
        <FlightAffiliateLink
          originIata={originIata}
          destination={getCityCountryLabel(destination)}
          destinationIata={getDestinationIata(destination)}
          adults={adults}
          cabinClass="economy"
          placement="comparison"
          pageType="compare"
        >
          <Plane className="size-4" />
          {label}
        </FlightAffiliateLink>
      </Button>
    );
  }

  return (
    <Button asChild variant="outline" className="justify-start rounded-full bg-white">
      <TrackedLink
        href={href}
        prefetch={false}
        target={link.target ?? (isExternal ? "_blank" : undefined)}
        rel={link.rel ?? (isExternal ? "sponsored nofollow noopener noreferrer" : undefined)}
        eventName="affiliate_link_clicked"
        eventProperties={{
          page: "/compare",
          source: "compare_contextual_cta",
          label,
          href,
          affiliateType: link.type,
          affiliatePartner: link.partner ?? link.provider,
          affiliateProvider: link.provider,
          destinationName: getCityCountryLabel(destination),
          destinationSlug: destination.slug,
        }}
      >
        <WalletCards className="size-4" />
        {label}
      </TrackedLink>
    </Button>
  );
}

function Field({ children, htmlFor, label }: { children: React.ReactNode; htmlFor: string; label: string }) {
  return (
    <div className="grid gap-2">
      <label htmlFor={htmlFor} className="text-sm font-semibold text-slate-700">
        {label}
      </label>
      {children}
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-2 text-lg font-semibold text-slate-950">{value}</p>
    </div>
  );
}

function Bar({ className, label, max, value }: { className: string; label: string; max: number; value: number | null }) {
  const width = value === null ? 0 : Math.max(4, Math.round((value / max) * 100));

  return (
    <div className="grid grid-cols-[minmax(7rem,12rem)_1fr] items-center gap-3 text-xs text-slate-600">
      <span className="truncate">{label}</span>
      <div className="h-3 rounded-full bg-slate-100">
        <div className={`h-3 rounded-full ${className}`} style={{ width: `${width}%` }} />
      </div>
    </div>
  );
}

function BudgetFitCard({
  currency,
  fit,
  label,
  total,
}: {
  currency: SupportedCurrency;
  fit: NonNullable<TripComparison["budgetFitA"]>;
  label: string;
  total: number | null;
}) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <h3 className="font-semibold text-slate-950">{label}</h3>
      <dl className="mt-3 grid gap-2 text-sm text-slate-600">
        <div className="flex justify-between gap-4">
          <dt>Estimated total</dt>
          <dd className="font-semibold text-slate-950">{formatCompareMoney(total, currency)}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt>Remaining budget</dt>
          <dd className="font-semibold text-slate-950">{formatMoney(convertFromCad(fit.remaining, currency), currency)}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt>Amount over budget</dt>
          <dd className="font-semibold text-slate-950">{formatMoney(convertFromCad(fit.overBy, currency), currency)}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt>Budget fit</dt>
          <dd className="font-semibold text-slate-950">{fit.status}</dd>
        </div>
      </dl>
    </div>
  );
}

function MissingDataState() {
  return (
    <section className="rounded-[24px] border border-slate-200 bg-white p-6">
      <h2 className="text-2xl font-semibold tracking-tight text-slate-950">Destination data unavailable</h2>
      <p className="mt-3 text-sm leading-6 text-slate-600">Choose two destinations from the current GoByBudget dataset to compare trip costs.</p>
    </section>
  );
}

export function PopularComparisons() {
  return (
    <section className="rounded-[24px] border border-slate-200 bg-white p-6">
      <h2 className="text-2xl font-semibold tracking-tight text-slate-950">Popular destination comparisons</h2>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {getPublishedComparisonPages().map((page) => (
          <TrackedLink
            key={page.slug}
            href={getComparisonPath(page)}
            eventName="guide_clicked"
            eventProperties={{ page: "/compare", guideTitle: page.title, href: getComparisonPath(page) }}
            className="rounded-2xl border border-slate-200 p-4 transition-colors hover:bg-[#14B8A6]/10"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-[#0B1D34]">{page.searchIntent}</p>
            <h3 className="mt-2 font-semibold text-slate-950">{page.title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">{page.description}</p>
          </TrackedLink>
        ))}
      </div>
    </section>
  );
}

function PlanFromComparisonLinks({ params }: { params: CompareParams }) {
  const links = [
    { href: createResultsHrefFromCompare(params), label: "Find destinations under your budget" },
    { href: "/travel-budget-calculator", label: "Use the travel budget calculator" },
    { href: "/destinations", label: "Browse destination budget guides" },
    { href: "/travel-extras", label: "Plan travel extras and buffers" },
  ];

  return (
    <section className="rounded-[24px] border border-slate-200 bg-white p-6">
      <h2 className="text-2xl font-semibold tracking-tight text-slate-950">Plan from this comparison</h2>
      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {links.map((link) => (
          <TrackedLink
            key={link.href}
            href={link.href}
            eventName="cta_clicked"
            eventProperties={{
              page: "/compare",
              label: link.label,
              href: link.href,
              ctaLocation: "compare_plan_links",
            }}
            className="rounded-2xl border border-slate-200 p-4 text-sm font-semibold text-[#0B1D34] transition-colors hover:bg-[#14B8A6]/10"
          >
            {link.label}
          </TrackedLink>
        ))}
      </div>
    </section>
  );
}

function createResultsHrefFromCompare(params: CompareParams) {
  const searchParams = new URLSearchParams({
    budget: String(params.budget ?? 2500),
    currency: params.currency,
    origin: getOriginCode(params.origin),
    days: String(params.days),
    month: params.month,
    travelers: String(params.travelers),
    style: toResultsStyle(params.style),
  });

  return `/results?${searchParams.toString()}`;
}

function toResultsStyle(style: CompareParams["style"]) {
  if (style === "budget") {
    return "budget";
  }

  if (style === "comfort" || style === "luxury") {
    return "comfort";
  }

  return "balanced";
}

function toTitle(value: string) {
  return value
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
