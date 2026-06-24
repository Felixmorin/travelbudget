"use client";

import { FormEvent, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Calendar, MapPin, Users, Wallet } from "lucide-react";

import { useTranslation } from "@/components/i18n/language-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trackEvent } from "@/lib/analytics/track";

const currencies = ["CAD", "USD", "EUR"] as const;
const months = [
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
const travelerOptions = ["1", "2", "4"] as const;
const dayOptions = ["7", "10", "14"] as const;
const styles = ["budget", "balanced", "comfort"] as const;

type Currency = (typeof currencies)[number];
type Month = (typeof months)[number];
type TravelerOption = (typeof travelerOptions)[number];
type DayOption = (typeof dayOptions)[number];
type TravelStyle = (typeof styles)[number];

export function SearchCard() {
  const router = useRouter();
  const { t } = useTranslation();
  const [budget, setBudget] = useState("2400");
  const [currency, setCurrency] = useState<Currency>("CAD");
  const [origin, setOrigin] = useState("Montreal");
  const [days, setDays] = useState<DayOption>("10");
  const [month, setMonth] = useState<Month>("october");
  const [travelers, setTravelers] = useState<TravelerOption>("2");
  const [style, setStyle] = useState<TravelStyle>("balanced");
  const [error, setError] = useState<string | null>(null);
  const hasStartedSearch = useRef(false);

  function trackSearchStarted() {
    if (hasStartedSearch.current) {
      return;
    }

    hasStartedSearch.current = true;
    trackEvent("search_started", {
      page: "/",
      source: "hero_search_card",
    });
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const parsedBudget = Number(budget.replace(/,/g, ""));
    const trimmedOrigin = origin.trim();

    if (!Number.isFinite(parsedBudget) || parsedBudget < 100 || parsedBudget > 250000) {
      setError(t.search.budgetError);
      return;
    }

    if (!trimmedOrigin) {
      setError(t.search.originError);
      return;
    }

    setError(null);
    trackEvent("search_completed", {
      page: "/",
      budget: Math.round(parsedBudget),
      currency,
      originCode: trimmedOrigin.replace(/\s+/g, " ").slice(0, 12).toUpperCase(),
      tripLength: Number(days),
      month,
      travelers: Number(travelers),
      travelStyle: style,
    });

    const params = new URLSearchParams({
      budget: String(Math.round(parsedBudget)),
      currency,
      origin: trimmedOrigin.replace(/\s+/g, " ").slice(0, 80),
      days,
      month,
      travelers,
      style,
    });

    router.push(`/results?${params.toString()}`);
  }

  return (
    <Card className="w-full border-white/50 bg-white/95 shadow-2xl shadow-slate-950/20 backdrop-blur">
      <CardHeader>
        <CardTitle className="text-lg text-slate-950">{t.search.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={t.search.budget} icon={<Wallet className="size-4" />}>
              <Input
                value={budget}
                onFocus={trackSearchStarted}
                onChange={(event) => {
                  trackSearchStarted();
                  setBudget(event.target.value);
                }}
                inputMode="numeric"
                min={100}
                max={250000}
                className="h-11 bg-white"
              />
            </Field>
            <Field label={t.search.currency}>
              <Select
                value={currency}
                onValueChange={(value) => {
                  trackSearchStarted();
                  setCurrency(getOption(currencies, value, "CAD"));
                }}
              >
                <SelectTrigger className="h-11 w-full bg-white">
                  <SelectValue placeholder={t.search.currency} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CAD">CAD</SelectItem>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field label={t.search.departureCity} icon={<MapPin className="size-4" />}>
              <Input
                value={origin}
                onFocus={trackSearchStarted}
                onChange={(event) => {
                  trackSearchStarted();
                  setOrigin(event.target.value);
                }}
                className="h-11 bg-white"
              />
            </Field>
            <Field label={t.search.duration} icon={<Calendar className="size-4" />}>
              <Select
                value={days}
                onValueChange={(value) => {
                  trackSearchStarted();
                  setDays(getOption(dayOptions, value, "10"));
                }}
              >
                <SelectTrigger className="h-11 w-full bg-white">
                  <SelectValue placeholder={t.search.duration} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">7 {t.search.days}</SelectItem>
                  <SelectItem value="10">10 {t.search.days}</SelectItem>
                  <SelectItem value="14">14 {t.search.days}</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field label={t.search.travelMonth}>
              <Select
                value={month}
                onValueChange={(value) => {
                  trackSearchStarted();
                  setMonth(getOption(months, value, "october"));
                }}
              >
                <SelectTrigger className="h-11 w-full bg-white">
                  <SelectValue placeholder={t.search.travelMonth} />
                </SelectTrigger>
                <SelectContent>
                  {months.map((monthOption) => (
                    <SelectItem key={monthOption} value={monthOption}>
                      {t.search[monthOption]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label={t.search.travelers} icon={<Users className="size-4" />}>
              <Select
                value={travelers}
                onValueChange={(value) => {
                  trackSearchStarted();
                  setTravelers(getOption(travelerOptions, value, "2"));
                }}
              >
                <SelectTrigger className="h-11 w-full bg-white">
                  <SelectValue placeholder={t.search.travelers} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 {t.search.traveler}</SelectItem>
                  <SelectItem value="2">2 {t.search.travelersPlural}</SelectItem>
                  <SelectItem value="4">4 {t.search.travelersPlural}</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field label={t.search.travelStyle}>
              <Select
                value={style}
                onValueChange={(value) => {
                  trackSearchStarted();
                  setStyle(getOption(styles, value, "balanced"));
                }}
              >
                <SelectTrigger className="h-11 w-full bg-white">
                  <SelectValue placeholder={t.search.travelStyle} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="budget">{t.search.budgetStyle}</SelectItem>
                  <SelectItem value="balanced">{t.search.balanced}</SelectItem>
                  <SelectItem value="comfort">{t.search.comfort}</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          </div>
          {error ? <p className="mt-4 text-sm font-medium text-red-600">{error}</p> : null}
          <Button type="submit" className="mt-5 h-12 w-full rounded-xl bg-orange-500 text-base text-white hover:bg-orange-600">
            {t.search.submit}
            <ArrowRight className="ml-2 size-4" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function getOption<const T extends readonly string[]>(options: T, value: string | null | undefined, fallback: T[number]) {
  return value && options.some((option) => option === value) ? (value as T[number]) : fallback;
}

function Field({
  label,
  icon,
  children,
}: {
  label: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-2">
      <Label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
        {icon}
        {label}
      </Label>
      {children}
    </div>
  );
}
