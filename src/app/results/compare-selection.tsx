"use client";

import Image from "next/image";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  Bed,
  Clock3,
  Plane,
  Scale,
  ShieldCheck,
  Sun,
  ThermometerSun,
  Ticket,
  Train,
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
  isHydrated: boolean;
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
  const [isHydrated, setIsHydrated] = useState(false);
  const [selectedSlugs, setSelectedSlugs] = useState<string[]>([]);

  useEffect(() => {
    const timeout = window.setTimeout(() => setIsHydrated(true), 0);

    return () => window.clearTimeout(timeout);
  }, []);

  const selectedDestinations = useMemo(
    () => selectedSlugs.map((slug) => destinations.find((destination) => destination.slug === slug)).filter(Boolean) as ResultDestination[],
    [destinations, selectedSlugs]
  );

  function toggleDestination(destination: ResultDestination, context: ResultsAnalyticsContext) {
    setSelectedSlugs((currentSlugs) => {
      const isSelected = currentSlugs.includes(destination.slug);
      const nextSlugs = isSelected
        ? currentSlugs.filter((slug) => slug !== destination.slug)
        : [...currentSlugs, destination.slug].slice(0, 3);
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
      trackEvent("compare_destination", {
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
    <CompareSelectionContext.Provider value={{ isHydrated, selectedSlugs, toggleDestination }}>
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
      <InlineComparison destinations={selectedDestinations} />
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
            <p className="mt-1 text-sm font-medium text-[#737686]">{destination.country}</p>
            <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#434655]">{destination.summary}</p>
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
          <BudgetLine icon={Plane} label="Flights" value={destination.flightCost} />
          <BudgetLine icon={Bed} label="Hotels" value={destination.stayCost} />
          <BudgetLine icon={Utensils} label="Food" value={destination.foodCost} />
          <BudgetLine icon={Train} label="Transport" value={destination.transportCost} />
          <BudgetLine icon={Ticket} label="Activities" value={destination.activitiesCost} />
          <BudgetLine icon={ShieldCheck} label="Buffer" value={destination.bufferCost} />
        </dl>

        <div className="mt-5 grid gap-3 rounded-2xl bg-[#f7f9fb] p-4 text-sm leading-6">
          <InfoLine label="Best for" value={destination.bestFor} />
          <InfoLine label="Best season" value={destination.bestSeason} />
          <InfoLine label="Why it fits" value={destination.summary} />
        </div>

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
                  eventName: "destination_card_click",
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
              View full budget
            </TrackedLink>
          </Button>
          <Button
            variant={isSelected ? "default" : "outline"}
            size="icon"
            type="button"
            disabled={!compareSelection.isHydrated}
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

        <AffiliateCta analyticsContext={analyticsContext} destination={destination} />
      </div>
    </article>
  );
}

function AffiliateCta({
  analyticsContext,
  destination,
}: {
  analyticsContext: ResultsAnalyticsContext;
  destination: ResultDestination;
}) {
  const preferredLink =
    destination.affiliateLinks.find((link) => link.type === "Flights") ??
    destination.affiliateLinks.find((link) => link.type === "Hotels");

  if (!preferredLink) {
    return null;
  }

  return (
    <TrackedLink
      href={preferredLink.href}
      prefetch={false}
      target={preferredLink.target}
      rel={preferredLink.rel}
      eventName="affiliate_click"
      eventProperties={{
        page: "/results",
        ...analyticsContext,
        affiliatePartner: preferredLink.partner,
        affiliateProvider: preferredLink.provider,
        affiliateType: preferredLink.type,
        destinationName: destination.title,
        destinationSlug: destination.slug,
        href: preferredLink.href,
        label: preferredLink.actionLabel,
        source: "destination_card_secondary_cta",
        tripLength: analyticsContext.days,
      }}
      secondaryEvents={[
        {
          eventName: "affiliate_link_clicked",
          eventProperties: {
            page: "/results",
            ...analyticsContext,
            affiliatePartner: preferredLink.partner,
            affiliateProvider: preferredLink.provider,
            affiliateType: preferredLink.type,
            destinationName: destination.title,
            destinationSlug: destination.slug,
            href: preferredLink.href,
            label: preferredLink.actionLabel,
            linkType: preferredLink.type,
            source: "destination_card_secondary_cta",
            title: preferredLink.title,
            tripLength: analyticsContext.days,
          },
        },
      ]}
      className="mt-3 inline-flex h-11 items-center justify-center rounded-xl border border-[#c3c6d7] bg-white px-4 text-sm font-bold text-[#0B1D34] transition hover:bg-[#eceef0]"
    >
      {preferredLink.actionLabel}
    </TrackedLink>
  );
}

function ComparisonTray({ destinations }: { destinations: ResultDestination[] }) {
  if (destinations.length === 0) {
    return null;
  }

  const compareHref = getCompareHref(destinations.map((destination) => destination.slug));
  const canCompare = destinations.length >= 2;

  return (
    <div className="fixed inset-x-4 bottom-4 z-40 mx-auto max-w-4xl md:bottom-6">
      <div className="flex flex-col gap-4 rounded-3xl border border-[#0B1D34]/20 bg-white/90 px-5 py-4 shadow-2xl backdrop-blur-xl md:flex-row md:items-center md:justify-between md:gap-6 md:rounded-full md:px-8">
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
          <div className="min-w-0 text-sm font-medium md:truncate">
            <span className="font-bold">
              {destinations.length} {destinations.length === 1 ? "destination" : "destinations"} selected:
            </span>{" "}
            <span className="text-[#434655]">{destinations.map((destination) => destination.title.split(",")[0]).join(" - ")}</span>
            {!canCompare ? <span className="ml-2 text-[#737686]">Select 1 more to compare.</span> : null}
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-4">
          {canCompare ? (
            <Button asChild className="h-11 w-full rounded-full bg-[#0B1D34] px-6 font-bold text-white hover:bg-[#0B1D34] md:w-auto">
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
              className="h-11 w-full rounded-full bg-[#c3c6d7] px-6 font-bold text-[#434655] md:w-auto"
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

function InfoLine({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="font-bold text-[#191c1e]">{label}: </span>
      <span className="text-[#434655]">{value}</span>
    </div>
  );
}

function InlineComparison({ destinations }: { destinations: ResultDestination[] }) {
  if (destinations.length < 2) {
    return (
      <section className="mt-8 rounded-3xl border border-dashed border-[#c3c6d7] bg-white/60 p-6 text-sm font-medium text-[#434655]">
        Select 2 to 3 destinations to compare total cost, flights, hotels, food, budget fit, season, and trip style.
      </section>
    );
  }

  return (
    <section className="mt-10 overflow-hidden rounded-3xl border border-[#c3c6d7]/40 bg-white shadow-[0_18px_45px_-32px_rgba(15,23,42,0.45)]">
      <div className="border-b border-[#c3c6d7]/30 p-5">
        <h2 className="text-2xl font-semibold tracking-normal text-[#191c1e]">
          Compare {destinations.map((destination) => destination.title.split(",")[0]).join(" vs ")}
        </h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-[#f7f9fb] text-xs uppercase tracking-wider text-[#737686]">
            <tr>
              <th className="px-5 py-3">Destination</th>
              <th className="px-5 py-3">Total cost</th>
              <th className="px-5 py-3">Flight</th>
              <th className="px-5 py-3">Hotel</th>
              <th className="px-5 py-3">Food</th>
              <th className="px-5 py-3">Budget fit</th>
              <th className="px-5 py-3">Best season</th>
              <th className="px-5 py-3">Best for</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#c3c6d7]/25">
            {destinations.map((destination) => (
              <tr key={destination.slug}>
                <td className="px-5 py-4 font-semibold text-[#191c1e]">{destination.title}</td>
                <td className="px-5 py-4 text-[#0B1D34]">{destination.total}</td>
                <td className="px-5 py-4">{destination.flightCost}</td>
                <td className="px-5 py-4">{destination.stayCost}</td>
                <td className="px-5 py-4">{destination.foodCost}</td>
                <td className="px-5 py-4">{destination.budgetFitPercent}%</td>
                <td className="px-5 py-4">{destination.bestSeason}</td>
                <td className="px-5 py-4">{destination.bestFor}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
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
  const uniqueSlugs = Array.from(new Set(destinationSlugs)).slice(0, 3);
  const params = new URLSearchParams();

  uniqueSlugs.forEach((slug) => params.append("destination", slug));

  return `/compare${params.size > 0 ? `?${params.toString()}` : ""}`;
}
