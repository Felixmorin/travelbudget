"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  ChevronsUpDown,
  Filter,
  PlaneTakeoff,
  Search,
  SlidersHorizontal,
  WalletCards,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  type CityDestination,
  cityDestinations,
  destinationContinents,
  destinationDepartureCities,
  destinationDurations,
  destinationMonths,
  destinationTravelStyles,
  formatDestinationMoney,
} from "@/lib/data/destination-hub";
import { cn } from "@/lib/utils";

type SortOption = "best-match" | "price-low" | "price-high" | "popular";

type Filters = {
  departureCity: string;
  maxBudget: number;
  durationDays: "any" | number;
  month: "any" | string;
  continent: "any" | string;
  travelStyle: "any" | string;
};

const defaultFilters: Filters = {
  departureCity: destinationDepartureCities[0] ?? "Montreal (YUL)",
  maxBudget: 5000,
  durationDays: "any",
  month: "any",
  continent: "any",
  travelStyle: "any",
};

const sortLabels: Record<SortOption, string> = {
  "best-match": "Best match",
  "price-low": "Price: Low to High",
  "price-high": "Price: High to Low",
  popular: "Most popular",
};

export function DestinationsExplorer() {
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [sort, setSort] = useState<SortOption>("best-match");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const filteredDestinations = useMemo(() => {
    const results = cityDestinations.filter((destination) => {
      const matchesDeparture = destination.departureCity === filters.departureCity;
      const matchesBudget = destination.estimatedTotalCost <= filters.maxBudget;
      const matchesDuration =
        filters.durationDays === "any" || destination.durationDays === filters.durationDays;
      const matchesMonth =
        filters.month === "any" || destination.bestMonths.includes(filters.month);
      const matchesContinent =
        filters.continent === "any" || destination.continent === filters.continent;
      const matchesStyle =
        filters.travelStyle === "any" || destination.travelStyles.includes(filters.travelStyle);

      return (
        matchesDeparture &&
        matchesBudget &&
        matchesDuration &&
        matchesMonth &&
        matchesContinent &&
        matchesStyle
      );
    });

    return results.toSorted((a, b) => {
      if (sort === "price-low") {
        return a.estimatedTotalCost - b.estimatedTotalCost;
      }

      if (sort === "price-high") {
        return b.estimatedTotalCost - a.estimatedTotalCost;
      }

      if (sort === "popular") {
        return (b.popularity ?? 0) - (a.popularity ?? 0);
      }

      return scoreDestination(b, filters) - scoreDestination(a, filters);
    });
  }, [filters, sort]);

  const activeFilters = getActiveFilters(filters);

  function updateFilter<Key extends keyof Filters>(key: Key, value: Filters[Key]) {
    setFilters((current) => ({ ...current, [key]: value }));
  }

  function resetFilters() {
    setFilters(defaultFilters);
    setSort("best-match");
  }

  function removeFilter(key: keyof Filters) {
    if (key === "maxBudget") {
      updateFilter(key, defaultFilters.maxBudget);
      return;
    }

    updateFilter(key, defaultFilters[key]);
  }

  return (
    <main className="bg-[#f7f9fb] text-[#191c1e]">
      <DestinationsHero filters={filters} onChange={updateFilter} />

      <section
        id="destination-results"
        className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[300px_1fr] lg:px-8 lg:py-14"
      >
        <aside className="hidden lg:block">
          <div className="sticky top-24 rounded-2xl border border-slate-200 bg-white p-6 shadow-lg shadow-blue-950/5">
            <FilterHeader />
            <DestinationFilters filters={filters} onChange={updateFilter} />
            <Button
              type="button"
              className="mt-6 h-11 w-full rounded-xl bg-[#004ac6] text-white hover:bg-blue-700"
              onClick={resetFilters}
            >
              Reset filters
            </Button>
          </div>
        </aside>

        <div className="min-w-0">
          <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-medium text-[#006c49]">
                Estimates include flights, stays, food, local transport, and activities.
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[#191c1e] sm:text-3xl">
                {filteredDestinations.length} destinations found from {filters.departureCity}
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                className="h-10 rounded-xl bg-white lg:hidden"
                onClick={() => setMobileFiltersOpen(true)}
              >
                <SlidersHorizontal className="size-4" />
                Filters
              </Button>
              <label className="flex items-center gap-2 text-sm font-medium text-slate-600">
                <ChevronsUpDown className="size-4 text-[#004ac6]" />
                <span className="sr-only sm:not-sr-only">Sort</span>
                <select
                  value={sort}
                  onChange={(event) => setSort(event.target.value as SortOption)}
                  className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-900 shadow-sm outline-none focus:border-[#004ac6] focus:ring-3 focus:ring-[#004ac6]/20"
                >
                  {Object.entries(sortLabels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          <ActiveFilterChips activeFilters={activeFilters} onRemove={removeFilter} onClear={resetFilters} />

          {filteredDestinations.length > 0 ? (
            <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filteredDestinations.map((destination) => (
                <DestinationCard key={destination.slug} destination={destination} />
              ))}
            </div>
          ) : (
            <EmptyState onReset={resetFilters} />
          )}
        </div>
      </section>

      <DestinationComparisonStrip destinations={filteredDestinations} />
      <DestinationsSeoSection />
      <BottomCta />

      {mobileFiltersOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Destination filters">
          <button
            type="button"
            className="absolute inset-0 bg-slate-950/45"
            aria-label="Close filters"
            onClick={() => setMobileFiltersOpen(false)}
          />
          <div className="absolute inset-x-0 bottom-0 max-h-[88vh] overflow-y-auto rounded-t-3xl bg-white p-5 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <FilterHeader />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="rounded-full"
                aria-label="Close filters"
                onClick={() => setMobileFiltersOpen(false)}
              >
                <X className="size-5" />
              </Button>
            </div>
            <DestinationFilters filters={filters} onChange={updateFilter} />
            <div className="sticky bottom-0 mt-6 grid grid-cols-2 gap-3 bg-white pt-4">
              <Button type="button" variant="outline" className="h-11 rounded-xl" onClick={resetFilters}>
                Clear all
              </Button>
              <Button
                type="button"
                className="h-11 rounded-xl bg-[#004ac6] text-white hover:bg-blue-700"
                onClick={() => setMobileFiltersOpen(false)}
              >
                Show results
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}

function DestinationsHero({
  filters,
  onChange,
}: {
  filters: Filters;
  onChange: <Key extends keyof Filters>(key: Key, value: Filters[Key]) => void;
}) {
  return (
    <section className="relative isolate overflow-hidden border-b border-slate-200 bg-white">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(#004ac6_0.7px,transparent_0.7px)] bg-[length:22px_22px] opacity-[0.06]" />
      <div className="mx-auto max-w-7xl px-4 py-14 text-center sm:px-6 lg:px-8 lg:py-20">
        <Badge className="mb-5 h-7 rounded-full bg-[#6cf8bb]/35 px-3 text-[#005236]">
          Budget-first destination discovery
        </Badge>
        <h1 className="mx-auto max-w-4xl text-4xl font-semibold tracking-tight text-[#191c1e] sm:text-5xl lg:text-6xl">
          Discover destinations that fit your budget
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-[#434655] sm:text-lg">
          Explore cities around the world and estimate how much your trip could cost before you book.
        </p>

        <div className="mx-auto mt-10 grid max-w-5xl gap-2 rounded-2xl border border-slate-200 bg-white p-2 text-left shadow-2xl shadow-blue-950/10 md:grid-cols-[1.1fr_1fr_1fr_1fr_auto]">
          <HeroField icon={PlaneTakeoff} label="Departure city">
            <select
              value={filters.departureCity}
              onChange={(event) => onChange("departureCity", event.target.value)}
              className="w-full bg-transparent text-sm font-semibold text-[#191c1e] outline-none"
            >
              {destinationDepartureCities.map((departureCity) => (
                <option key={departureCity} value={departureCity}>
                  {departureCity}
                </option>
              ))}
            </select>
          </HeroField>
          <HeroField icon={WalletCards} label="Budget">
            <input
              type="number"
              min={1000}
              max={10000}
              step={250}
              value={filters.maxBudget}
              onChange={(event) => onChange("maxBudget", Number(event.target.value))}
              className="w-full bg-transparent text-sm font-semibold text-[#191c1e] outline-none"
            />
          </HeroField>
          <HeroField icon={CalendarDays} label="Trip duration">
            <select
              value={filters.durationDays}
              onChange={(event) =>
                onChange(
                  "durationDays",
                  event.target.value === "any" ? "any" : Number(event.target.value)
                )
              }
              className="w-full bg-transparent text-sm font-semibold text-[#191c1e] outline-none"
            >
              <option value="any">Any duration</option>
              {destinationDurations.map((duration) => (
                <option key={duration} value={duration}>
                  {duration} days
                </option>
              ))}
            </select>
          </HeroField>
          <HeroField icon={CalendarDays} label="Travel month">
            <select
              value={filters.month}
              onChange={(event) => onChange("month", event.target.value)}
              className="w-full bg-transparent text-sm font-semibold text-[#191c1e] outline-none"
            >
              <option value="any">Any month</option>
              {destinationMonths.map((month) => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </select>
          </HeroField>
          <Button
            asChild
            className="h-14 rounded-xl bg-[#004ac6] px-5 text-white shadow-lg shadow-blue-700/20 hover:bg-blue-700"
          >
            <Link href="#destination-results">
              Find destinations
              <Search className="size-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

function HeroField({
  icon: Icon,
  label,
  children,
}: {
  icon: typeof PlaneTakeoff;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex min-h-14 items-center gap-3 rounded-xl px-3 py-2 transition focus-within:bg-slate-50 focus-within:ring-2 focus-within:ring-[#004ac6]/20 md:border-r md:border-slate-200 last:md:border-r-0">
      <Icon className="size-5 shrink-0 text-[#64748b]" />
      <span className="grid min-w-0 flex-1 gap-0.5">
        <span className="text-[11px] font-semibold text-[#64748b]">{label}</span>
        {children}
      </span>
    </label>
  );
}

function FilterHeader() {
  return (
    <div className="flex items-center gap-3">
      <span className="flex size-10 items-center justify-center rounded-xl bg-[#004ac6]/10 text-[#004ac6]">
        <Filter className="size-5" />
      </span>
      <div>
        <h3 className="text-lg font-semibold text-[#191c1e]">Filters</h3>
        <p className="text-sm text-[#64748b]">Refine discovery</p>
      </div>
    </div>
  );
}

function DestinationFilters({
  filters,
  onChange,
}: {
  filters: Filters;
  onChange: <Key extends keyof Filters>(key: Key, value: Filters[Key]) => void;
}) {
  return (
    <div className="mt-6 grid gap-6">
      <FilterSelect
        label="Departure city"
        value={filters.departureCity}
        onChange={(value) => onChange("departureCity", value)}
        options={destinationDepartureCities.map((departureCity) => ({
          label: departureCity,
          value: departureCity,
        }))}
      />

      <div>
        <div className="mb-3 flex items-center justify-between">
          <label htmlFor="max-budget" className="text-xs font-semibold text-[#434655]">
            Total budget
          </label>
          <span className="font-mono text-sm font-semibold text-[#004ac6]">
            Up to {formatDestinationMoney(filters.maxBudget, "CAD")}
          </span>
        </div>
        <input
          id="max-budget"
          type="range"
          min={1000}
          max={10000}
          step={250}
          value={filters.maxBudget}
          onChange={(event) => onChange("maxBudget", Number(event.target.value))}
          className="w-full accent-[#004ac6]"
        />
      </div>

      <div>
        <p className="mb-3 text-xs font-semibold text-[#434655]">Duration</p>
        <div className="grid grid-cols-2 gap-2">
          <SegmentButton active={filters.durationDays === "any"} onClick={() => onChange("durationDays", "any")}>
            Any
          </SegmentButton>
          {destinationDurations.map((duration) => (
            <SegmentButton
              key={duration}
              active={filters.durationDays === duration}
              onClick={() => onChange("durationDays", duration)}
            >
              {duration} days
            </SegmentButton>
          ))}
        </div>
      </div>

      <FilterSelect
        label="Month"
        value={filters.month}
        onChange={(value) => onChange("month", value)}
        options={[
          { label: "Any month", value: "any" },
          ...destinationMonths.map((month) => ({ label: month, value: month })),
        ]}
      />

      <FilterSelect
        label="Continent"
        value={filters.continent}
        onChange={(value) => onChange("continent", value)}
        options={[
          { label: "All continents", value: "any" },
          ...destinationContinents.map((continent) => ({ label: continent, value: continent })),
        ]}
      />

      <div>
        <p className="mb-3 text-xs font-semibold text-[#434655]">Travel style</p>
        <div className="flex flex-wrap gap-2">
          <ChipButton active={filters.travelStyle === "any"} onClick={() => onChange("travelStyle", "any")}>
            Any style
          </ChipButton>
          {destinationTravelStyles.map((style) => (
            <ChipButton
              key={style}
              active={filters.travelStyle === style}
              onClick={() => onChange("travelStyle", style)}
            >
              {style}
            </ChipButton>
          ))}
        </div>
      </div>
    </div>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { label: string; value: string }[];
}) {
  const id = label.toLowerCase().replace(/\s+/g, "-");

  return (
    <label htmlFor={id} className="grid gap-2">
      <span className="text-xs font-semibold text-[#434655]">{label}</span>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-medium text-slate-900 outline-none focus:border-[#004ac6] focus:ring-3 focus:ring-[#004ac6]/20"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function SegmentButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      className={cn(
        "h-10 rounded-xl border px-3 text-sm font-semibold transition focus:outline-none focus:ring-3 focus:ring-[#004ac6]/20",
        active
          ? "border-[#004ac6] bg-[#004ac6] text-white"
          : "border-slate-200 bg-slate-50 text-[#434655] hover:border-[#004ac6]/40 hover:text-[#004ac6]"
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

function ChipButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      className={cn(
        "rounded-full border px-3 py-1.5 text-xs font-semibold transition focus:outline-none focus:ring-3 focus:ring-[#004ac6]/20",
        active
          ? "border-[#004ac6] bg-[#004ac6] text-white"
          : "border-slate-200 bg-slate-50 text-[#434655] hover:border-[#004ac6]/40 hover:text-[#004ac6]"
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

function ActiveFilterChips({
  activeFilters,
  onRemove,
  onClear,
}: {
  activeFilters: { key: keyof Filters; label: string }[];
  onRemove: (key: keyof Filters) => void;
  onClear: () => void;
}) {
  if (activeFilters.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {activeFilters.map((filter) => (
        <button
          key={filter.key}
          type="button"
          className="inline-flex items-center gap-1 rounded-full bg-[#004ac6]/10 px-3 py-1.5 text-xs font-semibold text-[#004ac6] focus:outline-none focus:ring-3 focus:ring-[#004ac6]/20"
          onClick={() => onRemove(filter.key)}
        >
          {filter.label}
          <X className="size-3" />
        </button>
      ))}
      <button type="button" className="text-xs font-semibold text-[#004ac6] hover:underline" onClick={onClear}>
        Clear all
      </button>
    </div>
  );
}

function DestinationCard({ destination }: { destination: CityDestination }) {
  const planParams = new URLSearchParams({
    destination: destination.slug,
    budget: String(destination.estimatedTotalCost),
    days: String(destination.durationDays),
    from: destination.departureCity,
  });

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg shadow-blue-950/5 transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-950/10">
      <div className="relative h-56 overflow-hidden">
        <Image
          src={destination.imageUrl}
          alt={destination.imageAlt}
          fill
          sizes="(min-width: 1280px) 28vw, (min-width: 768px) 45vw, 100vw"
          className="object-cover transition duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/65 via-transparent to-transparent" />
        {destination.badge ? (
          <span className="absolute right-4 top-4 rounded-full bg-white/95 px-3 py-1 text-[11px] font-semibold text-[#004ac6] shadow-sm">
            {destination.badge}
          </span>
        ) : null}
        <div className="absolute bottom-4 left-4 flex flex-wrap gap-1.5">
          {destination.tags.slice(0, 2).map((tag) => (
            <span key={tag} className="rounded-md bg-slate-950/45 px-2 py-1 text-[11px] font-semibold text-white backdrop-blur">
              {tag}
            </span>
          ))}
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-5 p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-semibold tracking-tight text-[#191c1e]">
              {destination.city}, {destination.country}
            </h3>
            <p className="mt-1 flex items-center gap-1 text-xs font-medium text-[#64748b]">
              <CalendarDays className="size-3.5" />
              {destination.bestMonths.slice(0, 2).join(" / ")} · {destination.durationDays} days
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-semibold text-[#004ac6]">
              {formatDestinationMoney(destination.estimatedTotalCost, destination.currency)}
            </p>
            <p className="font-mono text-sm font-semibold text-[#006c49]">
              {formatDestinationMoney(destination.dailyBudgetEstimate, destination.currency)} / day
            </p>
          </div>
        </div>

        <p className="text-sm leading-6 text-[#434655]">{destination.description}</p>

        <div className="grid grid-cols-2 gap-2 text-xs text-[#434655]">
          <CostPill label="Flights" value={destination.flightEstimate} />
          <CostPill label="Stay" value={destination.stayEstimate} />
          <CostPill label="Food" value={destination.foodEstimate} />
          <CostPill label="Activities" value={destination.activitiesEstimate} />
        </div>

        <p className="text-xs leading-5 text-[#64748b]">
          Estimated costs may vary based on dates and availability.{" "}
          <Link href="/methodology" className="font-semibold text-[#004ac6] hover:underline">
            How we estimate
          </Link>
        </p>

        <div className="mt-auto grid gap-3">
          <Button
            asChild
            variant="outline"
            className="h-11 rounded-xl border-[#004ac6]/25 bg-[#004ac6]/5 text-[#004ac6] hover:bg-[#004ac6] hover:text-white"
          >
            <Link href={`/destinations/${destination.slug}`}>
              View destination
              <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Link
            href={`/results?${planParams.toString()}`}
            className="text-center text-sm font-semibold text-[#434655] hover:text-[#004ac6]"
          >
            Plan this trip
          </Link>
        </div>
      </div>
    </article>
  );
}

function CostPill({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl bg-slate-50 p-3">
      <p className="text-[11px] font-medium text-[#64748b]">{label}</p>
      <p className="mt-1 font-mono font-semibold text-[#191c1e]">{formatDestinationMoney(value, "CAD")}</p>
    </div>
  );
}

function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
      <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-slate-100 text-[#64748b]">
        <Search className="size-7" />
      </div>
      <h3 className="mt-5 text-xl font-semibold text-[#191c1e]">No destinations match your filters</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#64748b]">
        Try increasing your budget, changing your dates, or selecting more regions.
      </p>
      <Button className="mt-6 h-11 rounded-xl bg-[#004ac6] text-white hover:bg-blue-700" onClick={onReset}>
        Reset filters
      </Button>
    </div>
  );
}

function DestinationComparisonStrip({ destinations }: { destinations: CityDestination[] }) {
  const firstPair = destinations.slice(0, 2);
  const secondPair = destinations.slice(2, 4);

  if (firstPair.length < 2) {
    return null;
  }

  return (
    <section className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
      <div className="rounded-2xl border border-[#004ac6]/10 bg-[#004ac6]/5 p-6 sm:p-8">
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-[#004ac6]">Head-to-head comparisons</h2>
            <p className="mt-1 text-sm text-[#434655]">Compare similar destinations by estimated total cost.</p>
          </div>
          <Link href="/compare" className="inline-flex items-center gap-1 text-sm font-semibold text-[#004ac6] hover:underline">
            Compare all <ArrowRight className="size-4" />
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <ComparisonCard destinations={firstPair} />
          {secondPair.length === 2 ? <ComparisonCard destinations={secondPair} /> : null}
        </div>
      </div>
    </section>
  );
}

function ComparisonCard({ destinations }: { destinations: CityDestination[] }) {
  const [first, second] = destinations;
  const savings = Math.abs(first.estimatedTotalCost - second.estimatedTotalCost);
  const cheaper = first.estimatedTotalCost <= second.estimatedTotalCost ? first : second;

  return (
    <Link
      href={`/compare?destination=${first.slug}&destination=${second.slug}`}
      className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-[#004ac6]/40"
    >
      <div className="flex items-center gap-3">
        <span className="flex -space-x-3">
          {destinations.map((destination) => (
            <span key={destination.slug} className="relative block size-12 overflow-hidden rounded-full border-2 border-white bg-slate-100">
              <Image src={destination.imageUrl} alt="" fill sizes="48px" className="object-cover" />
            </span>
          ))}
        </span>
        <span className="font-semibold text-[#191c1e]">
          {first.city} vs {second.city}
        </span>
      </div>
      <span className="text-right">
        <span className="block font-mono text-sm font-semibold text-[#006c49]">
          {formatDestinationMoney(savings, "CAD")} difference
        </span>
        <span className="text-xs text-[#64748b]">{cheaper.city} is lower</span>
      </span>
    </Link>
  );
}

function DestinationsSeoSection() {
  const popularSearches = [
    { label: "Destinations under $2,000 CAD", href: "/destinations?budget=2000" },
    { label: "Best cities for 10 days from Montreal", href: "/destinations?days=10&from=montreal" },
    { label: "Cheap Europe trips", href: "/destinations?continent=europe" },
    { label: "Beach destinations under $2,500 CAD", href: "/destinations?style=beach&budget=2500" },
    { label: "Family-friendly destinations", href: "/destinations?style=family" },
    { label: "Best winter escapes", href: "/destinations?month=december" },
    { label: "Romantic city breaks", href: "/destinations?style=romantic" },
    { label: "Solo travel destinations", href: "/destinations?style=solo" },
    { label: "Warm destinations in December", href: "/destinations?month=december&style=warm-escape" },
    { label: "Best value destinations from Canada", href: "/destinations?from=canada" },
  ];

  return (
    <section className="border-y border-slate-200 bg-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_420px] lg:px-8">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight text-[#191c1e]">
            Find the best destinations for your travel budget
          </h2>
          <div className="mt-6 grid gap-5 text-sm leading-7 text-[#434655]">
            <p>
              TravelBudget.ai estimates trip costs by combining typical flight ranges, lodging, food, local
              transport, and activity budgets into one comparable planning number. These estimates are intended for
              discovery and planning, not guaranteed booking prices.
            </p>
            <p>
              Your departure city changes the total because airfare can be the largest variable on shorter trips.
              Duration matters too: a farther destination can become more competitive when low daily costs are spread
              over a longer stay.
            </p>
            <p>
              Use this hub to compare cities before you book, then open a destination or plan a trip with your own
              budget, dates, and travel style. Estimated costs are based on available travel pricing data and may vary.
            </p>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-[#f7f9fb] p-6">
          <h2 className="text-xl font-semibold text-[#191c1e]">Popular budget travel searches</h2>
          <div className="mt-5 flex flex-wrap gap-2">
            {popularSearches.map((search) => (
              <Link
                key={search.label}
                href={search.href}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-[#434655] transition hover:border-[#004ac6] hover:text-[#004ac6]"
              >
                {search.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function BottomCta() {
  return (
    <section className="bg-[#004ac6] px-4 py-16 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Start planning with realistic trip estimates</h2>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-white/85">
          Compare destinations, adjust your budget, and move from discovery to a personalized travel plan.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button asChild className="h-12 rounded-xl bg-white px-6 text-[#004ac6] hover:bg-slate-100">
            <Link href="/results">
              Plan a trip
              <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" className="h-12 rounded-xl border-white/35 bg-white/10 px-6 text-white hover:bg-white/15">
            <Link href="/methodology">View methodology</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

function getActiveFilters(filters: Filters) {
  const activeFilters: { key: keyof Filters; label: string }[] = [];

  if (filters.maxBudget !== defaultFilters.maxBudget) {
    activeFilters.push({
      key: "maxBudget",
      label: `Under ${formatDestinationMoney(filters.maxBudget, "CAD")}`,
    });
  }

  if (filters.durationDays !== "any") {
    activeFilters.push({ key: "durationDays", label: `${filters.durationDays} days` });
  }

  if (filters.month !== "any") {
    activeFilters.push({ key: "month", label: filters.month });
  }

  if (filters.continent !== "any") {
    activeFilters.push({ key: "continent", label: filters.continent });
  }

  if (filters.travelStyle !== "any") {
    activeFilters.push({ key: "travelStyle", label: filters.travelStyle });
  }

  return activeFilters;
}

function scoreDestination(destination: CityDestination, filters: Filters) {
  const budgetFit = Math.max(0, filters.maxBudget - destination.estimatedTotalCost) / 100;
  const popularity = destination.popularity ?? 0;
  const monthFit = filters.month !== "any" && destination.bestMonths.includes(filters.month) ? 20 : 0;
  const styleFit =
    filters.travelStyle !== "any" && destination.travelStyles.includes(filters.travelStyle) ? 20 : 0;

  return popularity + budgetFit + monthFit + styleFit - destination.estimatedTotalCost / 1000;
}
