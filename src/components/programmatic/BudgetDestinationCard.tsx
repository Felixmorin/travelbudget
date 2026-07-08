import Image from "next/image";
import { ArrowRight, CalendarDays, Plane, WalletCards } from "lucide-react";

import { TrackedLink } from "@/components/analytics/tracked-link";
import { Badge } from "@/components/ui/badge";
import { formatMoney } from "@/lib/format-money";
import { getCityCountryLabel, getDestinationCountryName } from "@/lib/data/unified-destinations";
import type { BudgetDestination, ProgrammaticBudgetPageConfig } from "@/lib/programmatic/budget-pages";

export function BudgetDestinationCard({
  item,
  page,
}: {
  item: BudgetDestination;
  page: ProgrammaticBudgetPageConfig;
}) {
  const { destination } = item;
  const destinationLabel = getCityCountryLabel(destination);
  const primaryStyle = destination.travelStyles[0] ?? "Best value";

  return (
    <article className="group overflow-hidden rounded-[24px] border border-slate-200/80 bg-white transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/70">
      <div className="relative h-64 overflow-hidden">
        <Image
          src={destination.image}
          alt={`${destinationLabel} budget comparison image`}
          fill
          sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/45 via-transparent to-transparent" />
        <div className="absolute left-4 top-4 flex gap-2">
          <Badge className="rounded-full bg-[#0B1D34] px-3 py-1 text-xs font-bold uppercase text-white">
            {primaryStyle}
          </Badge>
        </div>
        <div className="absolute bottom-4 right-4 rounded-lg bg-white/90 px-3 py-1 backdrop-blur">
          <span className="font-bold text-[#0B1D34]">{(destination.score / 10).toFixed(1)}</span>
          <span className="text-xs text-slate-500">/10</span>
        </div>
      </div>

      <div className="p-6">
        <div className="mb-4">
          <h3 className="text-xl font-semibold text-slate-950">{destinationLabel}</h3>
          <p className="mt-1 text-sm font-medium text-slate-500">
            {getDestinationCountryName(destination)} · {destination.travelStyles.slice(0, 2).join(" & ")}
          </p>
          <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">{destination.shortDescription}</p>
        </div>

        <div className="mb-6 grid grid-cols-3 gap-2">
          <CompactMetric
            icon={Plane}
            label="Flights"
            value={formatMoney(item.flightEstimate, page.currency)}
          />
          <CompactMetric
            icon={CalendarDays}
            label="Daily"
            value={formatMoney(item.dailyEstimate, page.currency)}
          />
          <CompactMetric
            icon={WalletCards}
            label="Stay"
            value={formatMoney(item.costBreakdown.accommodation, page.currency)}
          />
        </div>

        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Total Est.</p>
            <p className="text-2xl font-bold text-[#0B1D34]">{formatMoney(item.totalEstimate, page.currency)}</p>
          </div>
          <TrackedLink
            href={`/destinations/${destination.slug}`}
            eventName="destination_card_clicked"
            eventProperties={{
              page: getProgrammaticPagePath(page),
              source: "programmatic_budget_card",
              originCode: page.origin.code,
              originCity: page.origin.city,
              budget: page.budget,
              currency: page.currency,
              days: page.tripLengthDays,
              tripLength: page.tripLengthDays,
              travelers: 1,
              travelStyle: page.travelStyle,
              destinationName: destinationLabel,
              destinationSlug: destination.slug,
              href: `/destinations/${destination.slug}`,
            }}
            aria-label={`View budget breakdown for ${destinationLabel}`}
            className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[#14B8A6]/10 text-[#0B1D34] transition-colors hover:bg-[#0B1D34] hover:text-white"
          >
            <ArrowRight className="size-5" />
          </TrackedLink>
        </div>
      </div>
    </article>
  );
}

function getProgrammaticPagePath(page: ProgrammaticBudgetPageConfig) {
  return `/from/${page.origin.slug}/under-${page.budget}`;
}

function CompactMetric({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-slate-50 p-2 text-center">
      <Icon className="mx-auto mb-1 size-4 text-[#0B1D34]" />
      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-bold text-slate-950">{value}</p>
    </div>
  );
}
