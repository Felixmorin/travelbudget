"use client";

import Image from "next/image";
import { ArrowRight, CalendarDays, Sparkles } from "lucide-react";

import { useTranslation } from "@/components/i18n/language-provider";
import { TrackedLink } from "@/components/analytics/tracked-link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Destination, formatMoney, getDailyCostTotal, getDestinationTripEstimate } from "@/lib/data/destinations";

export function DestinationCard({ destination, ranked = false }: { destination: Destination; ranked?: boolean }) {
  const { t } = useTranslation();
  const estimatedCost = getDestinationTripEstimate(destination, { days: 10, originCode: "YUL", travelStyle: "midRange" });
  const dailyCost = getDailyCostTotal(destination, "midRange");

  return (
    <Card className="overflow-hidden border-slate-200 bg-white shadow-lg shadow-slate-200/60">
      <div className="relative h-56">
        <Image
          src={destination.image}
          alt={`${destination.name} travel view`}
          fill
          sizes="(min-width: 768px) 33vw, 100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent" />
        <Badge className="absolute left-4 top-4 bg-white text-[#0B1D34] shadow">
          {ranked ? `${t.destinationCard.score} ${destination.score}` : destination.countryCode}
        </Badge>
        <div className="absolute bottom-4 left-4 text-white">
          <h3 className="text-2xl font-semibold">{destination.name}</h3>
          <p className="text-sm text-white/85">{destination.shortDescription}</p>
        </div>
      </div>
      <CardContent className="grid gap-4 pt-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">{t.destinationCard.estimatedCost}</p>
            <p className="text-2xl font-semibold text-slate-950">
              {formatMoney(estimatedCost, destination.currency)}
            </p>
            <p className="text-xs text-slate-500">
              {formatMoney(dailyCost, destination.currency)}/{t.destinationCard.dayMidRange}
            </p>
          </div>
          <div className="rounded-full bg-teal-50 px-3 py-2 text-sm font-semibold text-teal-700">
            {destination.score}/100
          </div>
        </div>
        <div className="grid gap-2 text-sm text-slate-600">
          <span className="flex items-center gap-2">
            <CalendarDays className="size-4 text-[#0B1D34]" />
            {t.destinationCard.bestMonths}: {destination.bestMonths.slice(0, 2).join(", ")}
          </span>
          <span className="flex items-center gap-2">
            <Sparkles className="size-4 text-orange-500" />
            {destination.travelStyles.join(" / ")}
          </span>
        </div>
        <Button asChild variant="outline" className="h-10 rounded-xl">
          <TrackedLink
            href={`/destinations/${destination.slug}`}
            eventName="destination_card_clicked"
            eventProperties={{
              page: "/",
              destinationName: destination.name,
              destinationSlug: destination.slug,
              source: "destination_card",
            }}
          >
            {t.destinationCard.viewGuide}
            <ArrowRight className="ml-2 size-4" />
          </TrackedLink>
        </Button>
      </CardContent>
    </Card>
  );
}
