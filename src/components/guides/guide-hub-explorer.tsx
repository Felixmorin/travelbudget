"use client";

import Link from "next/link";
import { ArrowRight, ChevronsUpDown, Eye, Filter, Search, SlidersHorizontal, X } from "lucide-react";
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
  region: "all" | string;
  travelStyle: "all" | string;
  duration: "all" | GuideDurationBucket;
  budgetLevel: "all" | GuideBudgetLevel;
};

const defaultFilters: Filters = {
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
    return guides
      .filter((guide) => {
        const matchesRegion = filters.region === "all" || guide.region === filters.region;
        const matchesStyle = filters.travelStyle === "all" || guide.travelStyle === filters.travelStyle;
        const matchesDuration = filters.duration === "all" || guide.durationBucket === filters.duration;
        const matchesBudget = filters.budgetLevel === "all" || guide.budgetLevel === filters.budgetLevel;

        return matchesRegion && matchesStyle && matchesDuration && matchesBudget;
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

  function updateFilter<Key extends keyof Filters>(key: Key, value: Filters[Key]) {
    setFilters((current) => ({ ...current, [key]: value }));
  }

  function resetFilters() {
    setFilters(defaultFilters);
    setSort("most-visited");
  }

  return (
    <>
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_320px] lg:px-8">
          <div>
            <Badge className="mb-4 rounded-full bg-blue-50 px-3 text-blue-700">Hub Guide</Badge>
            <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
              Guides de voyage classés par intérêt réel
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
              Explorez les guides budget, destinations et itinéraires selon les pages les plus consultées, la durée,
              le style de voyage et le budget estimé.
            </p>
            {!hasVisitData ? (
              <p className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900">
                Aucune donnée de visite exploitable n&apos;est encore disponible. Le classement utilise un jeu de données
                temporaire, isolé dans le module guide hub et prêt à être remplacé.
              </p>
            ) : null}
          </div>
          <div className="grid content-start gap-3 rounded-lg border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Découverte interne</p>
            <div className="grid grid-cols-2 gap-3">
              <Metric label="Guides" value={String(guides.length)} />
              <Metric label="Top vues" value={popularGuides[0]?.formattedViews ?? "0 vue"} />
            </div>
            <Link href="#guides-list" className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:underline">
              Voir tous les guides
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-3xl font-semibold text-slate-950">Guides populaires</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Les pages guide les plus demandées, enrichies par les visites destination quand un slug est lié.
            </p>
          </div>
          <Link href="#guides-list" className="text-sm font-semibold text-blue-700 hover:underline">
            Parcourir la bibliothèque
          </Link>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {popularGuides.map((guide) => (
            <GuideCard key={guide.slug} guide={guide} compact />
          ))}
        </div>
      </section>

      <section id="guides-list" className="mx-auto grid max-w-7xl gap-8 px-4 pb-10 sm:px-6 lg:grid-cols-[280px_1fr] lg:px-8">
        <aside className="hidden lg:block">
          <div className="sticky top-24 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <FilterHeader />
            <GuideFilters filters={filters} options={options} onChange={updateFilter} />
            <Button type="button" className="mt-6 h-10 w-full bg-blue-700 text-white hover:bg-blue-800" onClick={resetFilters}>
              Réinitialiser
            </Button>
          </div>
        </aside>

        <div className="min-w-0">
          <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-slate-950">{filteredGuides.length} guides disponibles</h2>
              <p className="mt-1 text-sm text-slate-600">Liens internes crawlables vers chaque page slug.</p>
            </div>
            <div className="flex items-center gap-3">
              <Button type="button" variant="outline" className="h-10 bg-white lg:hidden" onClick={() => setMobileFiltersOpen(true)}>
                <SlidersHorizontal className="size-4" />
                Filtres
              </Button>
              <label className="flex items-center gap-2 text-sm font-medium text-slate-600">
                <ChevronsUpDown className="size-4 text-blue-700" />
                <span className="sr-only sm:not-sr-only">Tri</span>
                <select
                  value={sort}
                  onChange={(event) => setSort(event.target.value as GuideSortOption)}
                  className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-900 outline-none focus:border-blue-700 focus:ring-3 focus:ring-blue-700/20"
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
            <div className="grid gap-4 md:grid-cols-2">
              {filteredGuides.map((guide) => (
                <GuideCard key={guide.slug} guide={guide} />
              ))}
            </div>
          ) : (
            <EmptyState onReset={resetFilters} />
          )}
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold text-slate-950">Les voyageurs consultent aussi</h2>
          <div className="mt-5 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            {alsoViewedGuides.map((guide) => (
              <Link
                key={guide.slug}
                href={guide.href}
                className="rounded-lg border border-slate-200 bg-slate-50 p-4 transition hover:border-blue-300 hover:bg-blue-50"
              >
                <span className="text-xs font-semibold uppercase tracking-wide text-blue-700">{guide.category}</span>
                <span className="mt-2 block font-semibold leading-6 text-slate-950">{guide.title}</span>
                <span className="mt-2 block text-sm text-slate-600">{guide.formattedViews}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {mobileFiltersOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Filtres des guides">
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

function GuideCard({ guide, compact = false }: { guide: GuideHubCard; compact?: boolean }) {
  return (
    <article className="group flex h-full flex-col rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-300 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <Badge className={getBadgeClassName(guide.badge)}>{guide.badge}</Badge>
        <span className="inline-flex shrink-0 items-center gap-1 font-mono text-sm font-semibold text-slate-600">
          <Eye className="size-4 text-blue-700" />
          {guide.formattedViews}
        </span>
      </div>
      <h3 className="mt-4 text-xl font-semibold leading-7 text-slate-950 group-hover:text-blue-700">{guide.title}</h3>
      <p className={cn("mt-2 text-sm leading-6 text-slate-600", compact ? "line-clamp-2" : "line-clamp-3")}>{guide.description}</p>
      <dl className="mt-5 grid grid-cols-2 gap-2 text-sm">
        <CardFact label="Destination" value={guide.destinationLabel} />
        <CardFact label="Région" value={guide.region} />
        <CardFact label="Durée" value={guide.durationDays ? `${guide.durationDays} jours` : "Flexible"} />
        <CardFact label="Budget" value={guide.budgetLabel} />
      </dl>
      <div className="mt-4 flex flex-wrap gap-2">
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">{guide.travelStyle}</span>
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">{guide.budgetLevel}</span>
      </div>
      <Link href={guide.href} className="mt-auto inline-flex items-center gap-2 pt-5 text-sm font-semibold text-blue-700 hover:underline">
        Ouvrir le guide
        <ArrowRight className="size-4" />
      </Link>
    </article>
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
    <div className="mt-5 grid gap-5">
      <FilterSelect
        label="Région ou continent"
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
      <FilterSelect
        label="Niveau de budget"
        value={filters.budgetLevel}
        onChange={(value) => onChange("budgetLevel", value as Filters["budgetLevel"])}
        options={[{ label: "Tous les budgets", value: "all" }, ...options.budgetLevels.map((value) => ({ label: value, value }))]}
      />
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
      <span className="text-xs font-semibold text-slate-600">{label}</span>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm font-medium text-slate-900 outline-none focus:border-blue-700 focus:ring-3 focus:ring-blue-700/20"
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

function FilterHeader() {
  return (
    <div className="flex items-center gap-3">
      <span className="flex size-9 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
        <Filter className="size-5" />
      </span>
      <div>
        <h3 className="font-semibold text-slate-950">Filtres</h3>
        <p className="text-sm text-slate-500">Affiner les guides</p>
      </div>
    </div>
  );
}

function CardFact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-slate-50 p-3">
      <dt className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{label}</dt>
      <dd className="mt-1 line-clamp-1 font-semibold text-slate-950">{value}</dd>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-white p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-lg font-semibold text-slate-950">{value}</p>
    </div>
  );
}

function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div className="rounded-lg border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
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

function getBadgeClassName(badge: GuideHubCard["badge"]) {
  if (badge === "Populaire") {
    return "bg-blue-700 text-white";
  }

  if (badge === "Tendance") {
    return "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100";
  }

  return "bg-amber-50 text-amber-800 ring-1 ring-amber-100";
}

function unique<T extends string>(values: T[]) {
  return Array.from(new Set(values)).sort();
}
