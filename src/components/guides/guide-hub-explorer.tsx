"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeDollarSign,
  CalendarDays,
  ChevronsUpDown,
  Eye,
  Filter,
  HelpCircle,
  Search,
  SlidersHorizontal,
  Sparkles,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type {
  GuideBudgetLevel,
  GuideDurationBucket,
  GuideHubCard,
  GuideSortOption,
} from "@/lib/data/guide-hub";
import { cn } from "@/lib/utils";

type Filters = {
  query: string;
  region: "all" | string;
  travelStyle: "all" | string;
  duration: "all" | GuideDurationBucket;
  budgetLevel: "all" | GuideBudgetLevel;
};

const defaultFilters: Filters = {
  query: "",
  region: "all",
  travelStyle: "all",
  duration: "all",
  budgetLevel: "all",
};

const sortLabels: Record<GuideSortOption, string> = {
  "most-visited": "Plus visité",
  newest: "Plus récent",
  destination: "Destination",
  budget: "Budget estimé",
};

export function GuideHubExplorer({
  guides,
  popularGuides,
  alsoViewedGuides,
  hasVisitData,
}: {
  guides: GuideHubCard[];
  popularGuides: GuideHubCard[];
  alsoViewedGuides: GuideHubCard[];
  hasVisitData: boolean;
}) {
  const [sort, setSort] = useState<GuideSortOption>("most-visited");
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const options = useMemo(
    () => ({
      regions: unique(guides.map((guide) => guide.region)),
      styles: unique(guides.map((guide) => guide.travelStyle)),
      durations: unique(guides.map((guide) => guide.durationBucket)),
      budgetLevels: unique(guides.map((guide) => guide.budgetLevel)),
    }),
    [guides]
  );

  const filteredGuides = useMemo(() => {
    const normalizedQuery = filters.query.trim().toLowerCase();

    return guides
      .filter((guide) => {
        const matchesQuery =
          !normalizedQuery ||
          [guide.title, guide.description, guide.destinationLabel, guide.region, guide.category]
            .join(" ")
            .toLowerCase()
            .includes(normalizedQuery);
        const matchesRegion = filters.region === "all" || guide.region === filters.region;
        const matchesStyle = filters.travelStyle === "all" || guide.travelStyle === filters.travelStyle;
        const matchesDuration = filters.duration === "all" || guide.durationBucket === filters.duration;
        const matchesBudget = filters.budgetLevel === "all" || guide.budgetLevel === filters.budgetLevel;

        return matchesQuery && matchesRegion && matchesStyle && matchesDuration && matchesBudget;
      })
      .toSorted((a, b) => {
        if (sort === "newest") {
          return Date.parse(b.publishedAt) - Date.parse(a.publishedAt);
        }

        if (sort === "destination") {
          return a.destinationLabel.localeCompare(b.destinationLabel) || b.viewCount - a.viewCount;
        }

        if (sort === "budget") {
          return (a.budgetEstimate ?? Number.MAX_SAFE_INTEGER) - (b.budgetEstimate ?? Number.MAX_SAFE_INTEGER);
        }

        return b.viewCount - a.viewCount || Date.parse(b.publishedAt) - Date.parse(a.publishedAt);
      });
  }, [filters, guides, sort]);

  const totalViews = guides.reduce((sum, guide) => sum + guide.viewCount, 0);

  function updateFilter<Key extends keyof Filters>(key: Key, value: Filters[Key]) {
    setFilters((current) => ({ ...current, [key]: value }));
  }

  function resetFilters() {
    setFilters(defaultFilters);
    setSort("most-visited");
  }

  return (
    <>
      <section className="mx-auto max-w-7xl px-4 pb-10 pt-8 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-6 border-b border-slate-200 pb-8 md:flex-row md:items-end">
          <div className="max-w-3xl">
            <Badge className="mb-4 rounded-full bg-blue-50 px-3 text-blue-700 ring-1 ring-blue-100">
              Hub Guide
            </Badge>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
              Guides de voyage classés par intérêt réel
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
              Optimisez votre budget avec des guides triés par visites, destination, durée et style de voyage.
            </p>
            {!hasVisitData ? (
              <p className="mt-4 max-w-2xl rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900">
                Aucune donnée de visite exploitable n&apos;est encore disponible. Le classement utilise un jeu de données
                temporaire, prêt à être remplacé par une source analytics.
              </p>
            ) : null}
          </div>
          <div className="flex w-full gap-4 rounded-xl border border-white/70 bg-white/75 p-4 shadow-sm backdrop-blur md:w-auto">
            <Metric label="Guides actifs" value={`${guides.length}`} />
            <div className="w-px bg-slate-200" />
            <Metric label="Vues classées" value={formatCompactViews(totalViews)} />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between gap-4">
          <h2 className="text-3xl font-semibold tracking-tight text-slate-950">Guides populaires</h2>
          <Link href="#explorer" className="inline-flex items-center gap-1 text-sm font-semibold text-blue-700 hover:underline">
            Tout voir
            <ArrowRight className="size-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {popularGuides.slice(0, 3).map((guide) => (
            <PopularGuideCard key={guide.slug} guide={guide} />
          ))}
        </div>
      </section>

      <section id="explorer" className="mx-auto flex max-w-7xl flex-col gap-8 px-4 pb-12 sm:px-6 md:flex-row lg:px-8">
        <aside className="hidden w-full md:block md:w-72 md:shrink-0">
          <div className="sticky top-24 space-y-6">
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-5 flex items-center justify-between gap-3">
                <FilterHeader />
                <button type="button" className="text-sm font-semibold text-blue-700 hover:underline" onClick={resetFilters}>
                  Réinitialiser
                </button>
              </div>
              <GuideFilters filters={filters} options={options} onChange={updateFilter} />
            </div>
            <div className="rounded-xl border border-blue-200 bg-blue-50/70 p-5">
              <HelpCircle className="mb-3 size-5 text-blue-700" />
              <h3 className="font-semibold text-blue-800">Besoin d&apos;aide ?</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Consultez la méthode de calcul avant de comparer vos prochains itinéraires.
              </p>
              <Link href="/methodology" className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-blue-700 hover:underline">
                Voir la méthodologie
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-sm font-medium text-slate-600">{filteredGuides.length} guides trouvés</span>
            <div className="flex items-center gap-3">
              <Button type="button" variant="outline" className="h-10 bg-white md:hidden" onClick={() => setMobileFiltersOpen(true)}>
                <SlidersHorizontal className="size-4" />
                Filtres
              </Button>
              <label className="flex items-center gap-2 text-sm text-slate-600">
                <ChevronsUpDown className="size-4 text-blue-700" />
                <span>Trier par :</span>
                <select
                  value={sort}
                  onChange={(event) => setSort(event.target.value as GuideSortOption)}
                  className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm font-bold text-blue-700 outline-none focus:border-blue-700 focus:ring-3 focus:ring-blue-700/20"
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

          {filteredGuides.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {filteredGuides.map((guide) => (
                <ResultGuideCard key={guide.slug} guide={guide} />
              ))}
            </div>
          ) : (
            <EmptyState onReset={resetFilters} />
          )}
        </div>
      </section>

      <section className="mx-auto max-w-7xl border-t border-slate-200 px-4 py-12 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-semibold tracking-tight text-slate-950">Les voyageurs consultent aussi</h2>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {alsoViewedGuides.map((guide) => (
            <Link key={guide.slug} href={guide.href} className="group rounded-lg p-1">
              <h3 className="text-lg font-semibold text-slate-950 transition group-hover:text-blue-700">{guide.category}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{guide.title}</p>
              <span className="mt-2 block text-sm font-semibold text-blue-700">{guide.formattedViews}</span>
            </Link>
          ))}
        </div>
      </section>

      {mobileFiltersOpen ? (
        <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true" aria-label="Filtres des guides">
          <button type="button" className="absolute inset-0 bg-slate-950/45" aria-label="Fermer les filtres" onClick={() => setMobileFiltersOpen(false)} />
          <div className="absolute inset-x-0 bottom-0 max-h-[88vh] overflow-y-auto rounded-t-2xl bg-white p-5 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <FilterHeader />
              <Button type="button" variant="ghost" size="icon" aria-label="Fermer les filtres" onClick={() => setMobileFiltersOpen(false)}>
                <X className="size-5" />
              </Button>
            </div>
            <GuideFilters filters={filters} options={options} onChange={updateFilter} />
            <div className="sticky bottom-0 mt-6 grid grid-cols-2 gap-3 bg-white pt-4">
              <Button type="button" variant="outline" className="h-11" onClick={resetFilters}>
                Effacer
              </Button>
              <Button type="button" className="h-11 bg-blue-700 text-white hover:bg-blue-800" onClick={() => setMobileFiltersOpen(false)}>
                Voir les résultats
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

function PopularGuideCard({ guide }: { guide: GuideHubCard }) {
  return (
    <article className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white transition duration-300 hover:shadow-lg">
      <Link href={guide.href} className="block">
        <div className="absolute left-4 top-4 z-10">
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-800 shadow-sm">
            <Sparkles className="size-3.5" />
            {guide.badge}
          </span>
        </div>
        <div className="relative h-48 overflow-hidden bg-slate-100">
          <Image
            src={guide.image}
            alt={guide.imageAlt}
            fill
            loading="eager"
            sizes="(min-width: 768px) 33vw, 100vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
          <div className="absolute bottom-4 right-4 inline-flex items-center gap-1 rounded-lg bg-black/55 px-2 py-1 text-xs font-semibold text-white backdrop-blur">
            <Eye className="size-3.5" />
            {guide.formattedViews}
          </div>
        </div>
        <div className="p-5">
          <div className="mb-2 flex flex-wrap items-center gap-2 text-xs">
            <span className="font-semibold uppercase tracking-wide text-blue-700">{guide.destinationLabel}</span>
            <span className="text-slate-400">•</span>
            <span className="font-medium text-slate-600">{guide.budgetLevel}</span>
          </div>
          <h3 className="text-xl font-semibold leading-7 text-slate-950 transition group-hover:text-blue-700">{guide.title}</h3>
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">{guide.description}</p>
          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-slate-600">
            <span className="inline-flex items-center gap-1">
              <CalendarDays className="size-4" />
              {guide.durationDays ? `${guide.durationDays} jours` : "Flexible"}
            </span>
            <span className="inline-flex items-center gap-1">
              <BadgeDollarSign className="size-4" />
              {budgetSymbol(guide.budgetLevel)}
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}

function ResultGuideCard({ guide }: { guide: GuideHubCard }) {
  return (
    <Link
      href={guide.href}
      className="group flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 transition duration-300 hover:border-blue-700 sm:flex-row"
    >
      <div className="relative h-40 w-full shrink-0 overflow-hidden rounded-lg bg-slate-100 sm:size-32">
        <Image
          src={guide.image}
          alt={guide.imageAlt}
          fill
          sizes="(min-width: 1024px) 128px, 100vw"
          className="object-cover transition duration-500 group-hover:scale-110"
        />
      </div>
      <div className="flex min-w-0 flex-1 flex-col justify-between">
        <div>
          <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-blue-700">
              {guide.region} • {guide.destinationLabel}
            </span>
            <span className="text-xs text-slate-500">{relativeDateLabel(guide.publishedAt)}</span>
          </div>
          <h3 className="text-lg font-semibold leading-6 text-slate-950 transition group-hover:text-blue-700">{guide.title}</h3>
          <p className="mt-1 line-clamp-2 text-sm leading-6 text-slate-600">{guide.description}</p>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Pill>{guide.durationDays ? `${guide.durationDays} jours` : "Flexible"}</Pill>
          <Pill>{budgetSymbol(guide.budgetLevel)}</Pill>
          <Pill>{guide.travelStyle}</Pill>
          <Pill>{guide.formattedViews}</Pill>
        </div>
      </div>
    </Link>
  );
}

function GuideFilters({
  filters,
  options,
  onChange,
}: {
  filters: Filters;
  options: {
    regions: string[];
    styles: string[];
    durations: GuideDurationBucket[];
    budgetLevels: GuideBudgetLevel[];
  };
  onChange: <Key extends keyof Filters>(key: Key, value: Filters[Key]) => void;
}) {
  return (
    <div className="grid gap-6">
      <label htmlFor="guide-search" className="grid gap-2">
        <span className="text-sm font-medium text-slate-600">Rechercher</span>
        <span className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <input
            id="guide-search"
            value={filters.query}
            onChange={(event) => onChange("query", event.target.value)}
            placeholder="Destination, guide..."
            className="h-10 w-full rounded-lg border border-slate-200 bg-[#f7f9fb] pl-9 pr-3 text-sm outline-none focus:border-blue-700 focus:ring-3 focus:ring-blue-700/20"
          />
        </span>
      </label>

      <FilterSelect
        label="Région"
        value={filters.region}
        onChange={(value) => onChange("region", value)}
        options={[{ label: "Toutes les régions", value: "all" }, ...options.regions.map((value) => ({ label: value, value }))]}
      />
      <FilterSelect
        label="Style de voyage"
        value={filters.travelStyle}
        onChange={(value) => onChange("travelStyle", value)}
        options={[{ label: "Tous les styles", value: "all" }, ...options.styles.map((value) => ({ label: value, value }))]}
      />
      <FilterSelect
        label="Durée"
        value={filters.duration}
        onChange={(value) => onChange("duration", value as Filters["duration"])}
        options={[{ label: "Toutes les durées", value: "all" }, ...options.durations.map((value) => ({ label: value, value }))]}
      />

      <div>
        <p className="mb-2 text-sm font-medium text-slate-600">Niveau de budget</p>
        <div className="grid grid-cols-2 gap-2">
          <BudgetButton active={filters.budgetLevel === "all"} onClick={() => onChange("budgetLevel", "all")}>
            Tous
          </BudgetButton>
          {options.budgetLevels.map((level) => (
            <BudgetButton key={level} active={filters.budgetLevel === level} onClick={() => onChange("budgetLevel", level)}>
              {budgetSymbol(level)}
            </BudgetButton>
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
      <span className="text-sm font-medium text-slate-600">{label}</span>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 rounded-lg border border-slate-200 bg-[#f7f9fb] px-3 text-sm text-slate-900 outline-none focus:border-blue-700 focus:ring-3 focus:ring-blue-700/20"
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

function BudgetButton({
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
        "h-10 rounded-lg border px-3 text-sm font-semibold transition focus:outline-none focus:ring-3 focus:ring-blue-700/20",
        active
          ? "border-blue-700 bg-blue-50 text-blue-800"
          : "border-slate-200 bg-white text-slate-700 hover:bg-blue-50 hover:text-blue-800"
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

function FilterHeader() {
  return (
    <div className="flex items-center gap-2">
      <Filter className="size-5 text-blue-700" />
      <h3 className="text-lg font-semibold text-slate-950">Filtres</h3>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex min-w-0 flex-col">
      <span className="text-2xl font-bold text-blue-700 sm:text-3xl">{value}</span>
      <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{label}</span>
    </div>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return <span className="rounded border border-slate-200 bg-[#f7f9fb] px-2 py-0.5 text-xs text-slate-600">{children}</span>;
}

function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
      <Search className="mx-auto size-8 text-slate-400" />
      <h3 className="mt-4 text-xl font-semibold text-slate-950">Aucun guide ne correspond aux filtres</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">
        Élargissez la région, la durée ou le niveau de budget pour retrouver des guides.
      </p>
      <Button type="button" className="mt-5 bg-blue-700 text-white hover:bg-blue-800" onClick={onReset}>
        Réinitialiser
      </Button>
    </div>
  );
}

function budgetSymbol(level: GuideBudgetLevel) {
  if (level === "Budget") {
    return "$";
  }

  if (level === "Mid-range" || level === "Flexible") {
    return "$$";
  }

  return "$$$";
}

function relativeDateLabel(date: string) {
  const diffDays = Math.max(0, Math.round((Date.now() - Date.parse(date)) / 86_400_000));

  if (diffDays <= 1) {
    return "Il y a 1j";
  }

  if (diffDays < 7) {
    return `Il y a ${diffDays}j`;
  }

  if (diffDays < 14) {
    return "Il y a 1 sem";
  }

  return `Il y a ${Math.round(diffDays / 7)} sem`;
}

function formatCompactViews(value: number) {
  if (value >= 1000) {
    return `${new Intl.NumberFormat("fr-CA", { maximumFractionDigits: 1 }).format(value / 1000)}k`;
  }

  return new Intl.NumberFormat("fr-CA").format(value);
}

function unique<T extends string>(values: T[]) {
  return Array.from(new Set(values)).sort();
}
