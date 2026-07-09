"use client";

import Image from "next/image";
import { createContext, useContext, useMemo, useState } from "react";
import {
  Bed,
  Clock3,
  Plane,
  Scale,
  ShieldCheck,
  Sun,
  ThermometerSun,
  Utensils,
  X,
  type LucideIcon,
} from "lucide-react";

import { TrackedLink } from "@/components/analytics/tracked-link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { trackEvent } from "@/lib/analytics/track";
import type { ResultDestination } from "./page";

type ResultsAnalyticsContext = {
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

type CompareSelectionContextValue = {
  selectedSlugs: string[];
  toggleDestination: (destination: ResultDestination, analyticsContext: ResultsAnalyticsContext) => void;
};

const CompareSelectionContext = createContext<CompareSelectionContextValue | null>(null);

export function ResultsComparisonSection({
  analyticsContext,
  destinations,
}: {
  analyticsContext: ResultsAnalyticsContext;
  destinations: ResultDestination[];
}) {
  const [selectedSlugs, setSelectedSlugs] = useState<string[]>([]);

  const selectedDestinations = useMemo(
    () => selectedSlugs.map((slug) => destinations.find((destination) => destination.slug === slug)).filter(Boolean) as ResultDestination[],
    [destinations, selectedSlugs]
  );

  function toggleDestination(destination: ResultDestination, context: ResultsAnalyticsContext) {
    setSelectedSlugs((currentSlugs) => {
      const isSelected = currentSlugs.includes(destination.slug);
      const nextSlugs = isSelected
        ? currentSlugs.filter((slug) => slug !== destination.slug)
        : [...currentSlugs, destination.slug].slice(0, 4);
      const compareHref = getCompareHref(nextSlugs);

      trackEvent("compare_click", {
        page: "/results",
        label: isSelected ? "Remove from compare" : "Add to compare",
        href: compareHref,
        ctaLocation: "result_card",
        compareAction: isSelected ? "remove" : "add",
        destinationName: destination.title,
        destinationSlug: destination.slug,
        selectedDestinationSlugs: nextSlugs.join(","),
        selectedDestinations: nextSlugs.length,
        source: "result_card",
        ...context,
        tripLength: context.days,
      });

      return nextSlugs;
    });
  }

  return (
    <CompareSelectionContext.Provider value={{ selectedSlugs, toggleDestination }}>
      <section className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {destinations.map((destination) => (
          <DestinationCard
            key={destination.href}
            destination={destination}
            analyticsContext={analyticsContext}
          />
        ))}
      </section>

      <ComparisonTray destinations={selectedDestinations} />
    </CompareSelectionContext.Provider>
  );
}

function DestinationCard({
  analyticsContext,
  destination,
}: {
  analyticsContext: ResultsAnalyticsContext;
  destination: ResultDestination;
}) {
  const compareSelection = useCompareSelection();
  const isOverBudget = destination.budgetRemainingValue < 0;
  const isSelected = compareSelection.selectedSlugs.includes(destination.slug);

  return (
    <article
      className={`group flex h-full flex-col overflow-hidden rounded-3xl border bg-white/70 shadow-[0_18px_45px_-28px_rgba(15,23,42,0.45)] backdrop-blur-xl transition duration-500 hover:shadow-xl ${
        isOverBudget ? "border-red-300/60" : "border-slate-200/80"
      }`}
    >
      <div className="relative h-48 overflow-hidden">
        <Image
          src={destination.image}
          alt={destination.alt}
          fill
          sizes="(min-width: 1280px) 28vw, (min-width: 768px) 45vw, 100vw"
          className="object-cover transition duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/25 to-transparent" />
        <div className="absolute left-4 top-4 flex max-w-[calc(100%-5rem)] flex-wrap gap-2">
          <Badge className="rounded-full bg-gradient-to-br from-[#2563eb] to-[#7c3aed] px-3 py-1.5 text-xs font-bold text-white shadow-lg">
            {destination.tag}
          </Badge>
          {isOverBudget ? (
            <Badge className="rounded-full bg-red-600 px-3 py-1.5 text-xs font-bold text-white shadow-lg">
              Over Budget
            </Badge>
          ) : null}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h2 className="text-xl font-semibold leading-7 text-[#191c1e]">{destination.title}</h2>
            <p className="mt-1 line-clamp-2 text-sm leading-6 text-[#434655]">{destination.summary}</p>
          </div>
          <div className="shrink-0 text-right">
            <div className={`text-xl font-semibold ${isOverBudget ? "text-red-600" : "text-[#0B1D34]"}`}>
              {destination.total}
            </div>
            <div className={`text-xs font-bold ${isOverBudget ? "text-red-600" : "text-[#006b5f]"}`}>
              {destination.budgetDelta}
            </div>
          </div>
        </div>

        <div className="mt-5">
          <div className="mb-1 flex justify-between text-xs font-semibold">
            <span className="text-[#737686]">Budget fit</span>
            <span className={isOverBudget ? "text-red-600" : "text-[#191c1e]"}>
              {destination.budgetFitPercent}%
            </span>
          </div>
          <div className={`h-2 overflow-hidden rounded-full ${isOverBudget ? "bg-red-100" : "bg-[#eceef0]"}`}>
            <div
              className={`h-full rounded-full ${isOverBudget ? "bg-red-600" : "bg-[#0B1D34]"}`}
              style={{ width: `${Math.min(destination.budgetFitPercent, 100)}%` }}
            />
          </div>
        </div>

        <dl className="mt-6 grid gap-2">
          <BudgetLine icon={Plane} label="Flight" value={destination.flightCost} />
          <BudgetLine icon={Bed} label="Stay" value={destination.stayCost} />
          <BudgetLine icon={Utensils} label="Food" value={destination.foodCost} />
        </dl>

        <div className="mt-6 flex flex-wrap gap-4 border-t border-[#c3c6d7]/30 pt-4 text-xs font-medium text-[#737686]">
          <MetaItem icon={Clock3}>{destination.flightTime}</MetaItem>
          <MetaItem icon={destination.climate === "Tropical" ? ThermometerSun : Sun}>{destination.climate}</MetaItem>
          <MetaItem icon={ShieldCheck}>{destination.entry}</MetaItem>
        </div>

        <div className="mt-8 flex gap-3">
          <Button
            asChild
            className={`h-11 flex-1 rounded-xl font-bold text-white ${
              isOverBudget
                ? "bg-[#e0e3e5] text-[#434655] hover:bg-[#c3c6d7]"
                : "bg-gradient-to-br from-[#2563eb] to-[#7c3aed] hover:opacity-90"
            }`}
          >
            <TrackedLink
              href={destination.href}
              eventName="destination_card_clicked"
              eventProperties={{
                page: "/results",
                ...analyticsContext,
                destinationName: destination.title,
                destinationSlug: destination.slug,
                resultRank: destination.rank,
                source: "results_grid",
                tripLength: analyticsContext.days,
              }}
              secondaryEvents={[
                {
                  eventName: "result_clicked",
                  eventProperties: {
                    page: "/results",
                    ...analyticsContext,
                    destinationName: destination.title,
                    destinationSlug: destination.slug,
                    href: destination.href,
                    resultRank: destination.rank,
                    source: "results_grid",
                    tripLength: analyticsContext.days,
                  },
                },
              ]}
            >
              {isOverBudget ? "View details" : "View trip budget"}
            </TrackedLink>
          </Button>
          <Button
            type="button"
            variant={isSelected ? "default" : "outline"}
            size="icon"
            className={`h-11 w-12 rounded-xl ${
              isSelected
                ? "bg-[#0B1D34] text-white hover:bg-[#0B1D34]"
                : "border-[#c3c6d7] bg-white/60 hover:bg-[#eceef0]"
            }`}
            aria-pressed={isSelected}
            aria-label={`${isSelected ? "Remove" : "Add"} ${destination.title} ${isSelected ? "from" : "to"} compare`}
            onClick={() => compareSelection.toggleDestination(destination, analyticsContext)}
          >
            {isSelected ? <X className="size-5" /> : <Scale className="size-5" />}
          </Button>
        </div>
      </div>
    </article>
  );
}

function ComparisonTray({ destinations }: { destinations: ResultDestination[] }) {
  if (destinations.length === 0) {
    return null;
  }

  const compareHref = getCompareHref(destinations.map((destination) => destination.slug));
  const canCompare = destinations.length >= 2;

  return (
    <div className="fixed bottom-6 left-1/2 z-40 hidden w-[90%] max-w-4xl -translate-x-1/2 md:block">
      <div className="flex items-center justify-between gap-6 rounded-full border border-[#0B1D34]/20 bg-white/80 px-8 py-4 shadow-2xl backdrop-blur-xl">
        <div className="flex min-w-0 items-center gap-4">
          <div className="flex -space-x-3">
            {destinations.map((destination) => (
              <div
                key={destination.href}
                className="relative size-10 overflow-hidden rounded-full border-2 border-white bg-[#eceef0]"
              >
                <Image
                  src={destination.image}
                  alt={`${destination.title} comparison thumbnail`}
                  fill
                  sizes="40px"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
          <div className="truncate text-sm font-medium">
            <span className="font-bold">
              {destinations.length} {destinations.length === 1 ? "destination" : "destinations"} selected:
            </span>{" "}
            <span className="text-[#434655]">{destinations.map((destination) => destination.title.split(",")[0]).join(" - ")}</span>
            {!canCompare ? <span className="ml-2 text-[#737686]">Select 1 more to compare.</span> : null}
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-4">
          {canCompare ? (
            <Button asChild className="rounded-full bg-[#0B1D34] px-6 font-bold text-white hover:bg-[#0B1D34]">
              <TrackedLink
                href={compareHref}
                eventName="compare_click"
                eventProperties={{
                  page: "/results",
                  label: "Compare selected",
                  href: compareHref,
                  ctaLocation: "comparison_tray",
                  compareAction: "open_compare",
                  selectedDestinationSlugs: destinations.map((destination) => destination.slug).join(","),
                  selectedDestinations: destinations.length,
                  source: "comparison_tray",
                }}
                secondaryEvents={[
                  {
                    eventName: "cta_clicked",
                    eventProperties: {
                      page: "/results",
                      label: "Compare selected",
                      href: compareHref,
                      ctaLocation: "comparison_tray",
                      source: "comparison_tray",
                    },
                  },
                ]}
              >
                Compare selected
              </TrackedLink>
            </Button>
          ) : (
            <Button
              type="button"
              disabled
              className="rounded-full bg-[#c3c6d7] px-6 font-bold text-[#434655]"
            >
              Compare selected
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function BudgetLine({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-base">
      <dt className="flex items-center gap-2 text-[#434655]">
        <Icon className="size-4" />
        {label}
      </dt>
      <dd className="font-medium text-[#191c1e]">{value}</dd>
    </div>
  );
}

function MetaItem({ children, icon: Icon }: { children: React.ReactNode; icon: LucideIcon }) {
  return (
    <span className="inline-flex items-center gap-1">
      <Icon className="size-4" />
      {children}
    </span>
  );
}

function useCompareSelection() {
  const context = useContext(CompareSelectionContext);

  if (!context) {
    throw new Error("useCompareSelection must be used inside ResultsComparisonSection");
  }

  return context;
}

function getCompareHref(destinationSlugs: string[]) {
  const uniqueSlugs = Array.from(new Set(destinationSlugs)).slice(0, 4);
  const params = new URLSearchParams();

  uniqueSlugs.forEach((slug) => params.append("destination", slug));

  return `/compare${params.size > 0 ? `?${params.toString()}` : ""}`;
}
