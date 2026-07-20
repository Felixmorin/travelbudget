"use client";

import { FormEvent, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Calendar, MapPin, PlaneTakeoff, Users, Wallet } from "lucide-react";

import { useTranslation } from "@/components/i18n/language-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trackEvent } from "@/lib/analytics/track";
import { activeDepartureCities, getDepartureCityForInput, normalizeDepartureCityCode } from "@/lib/data/departure-cities";

const currencies = ["CAD", "USD", "EUR", "GBP"] as const;
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
const departureCityOptions = [...activeDepartureCities].sort((a, b) => a.popularityRank - b.popularityRank);

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
  const [origin, setOrigin] = useState("");
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
      originCode: normalizeDepartureCityCode(trimmedOrigin),
      originCity: getDepartureCityForInput(trimmedOrigin)?.name ?? normalizeTextValue(trimmedOrigin),
      tripLength: Number(days),
      days: Number(days),
      month,
      travelers: Number(travelers),
      travelStyle: style,
    });

    const params = new URLSearchParams({
      budget: String(Math.round(parsedBudget)),
      currency,
      origin: normalizeDepartureCityCode(trimmedOrigin),
      days,
      month,
      travelers,
      style,
    });

    router.push(`/results?${params.toString()}`);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto w-full rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_22px_70px_-35px_rgba(15,23,42,0.45)] sm:p-6"
    >
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-slate-950">Plan your trip</p>
          <p className="mt-1 text-sm leading-5 text-slate-500">Get destinations that match your real total budget.</p>
        </div>
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
          <PlaneTakeoff className="size-5" />
        </span>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <SearchField label={t.search.budget} icon={<Wallet className="size-5" />}>
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
                aria-label={t.search.budget}
                className="h-10 border-0 bg-transparent px-0 text-base font-semibold shadow-none focus-visible:ring-0"
              />
        </SearchField>
        <SearchField label={t.search.departureCity} icon={<MapPin className="size-5" />}>
              <Input
                value={origin}
                list="departure-city-options"
                placeholder="City or airport"
                onFocus={trackSearchStarted}
                onChange={(event) => {
                  trackSearchStarted();
                  setOrigin(event.target.value);
                }}
                aria-label={t.search.departureCity}
                className="h-10 border-0 bg-transparent px-0 text-base font-semibold shadow-none focus-visible:ring-0"
              />
              <datalist id="departure-city-options">
                {departureCityOptions.map((city) => (
                  <option
                    key={city.slug}
                    value={city.name}
                    label={`${city.airportCodes.join(", ")} - ${city.region ?? city.country}`}
                  />
                ))}
              </datalist>
        </SearchField>
        <SearchField label={t.search.duration} icon={<Calendar className="size-5" />}>
              <Select
                value={days}
                onValueChange={(value) => {
                  trackSearchStarted();
                  setDays(getOption(dayOptions, value, "10"));
                }}
              >
                <SelectTrigger aria-label={t.search.duration} className="h-10 w-full border-0 bg-transparent px-0 text-base font-semibold shadow-none">
                  <SelectValue placeholder={t.search.duration} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">7 {t.search.days}</SelectItem>
                  <SelectItem value="10">10 {t.search.days}</SelectItem>
                  <SelectItem value="14">14 {t.search.days}</SelectItem>
                </SelectContent>
              </Select>
        </SearchField>
        <SearchField label={t.search.travelers} icon={<Users className="size-5" />}>
              <Select
                value={travelers}
                onValueChange={(value) => {
                  trackSearchStarted();
                  setTravelers(getOption(travelerOptions, value, "2"));
                }}
              >
                <SelectTrigger aria-label={t.search.travelers} className="h-10 w-full border-0 bg-transparent px-0 text-base font-semibold shadow-none">
                  <SelectValue placeholder={t.search.travelers} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 {t.search.traveler}</SelectItem>
                  <SelectItem value="2">2 {t.search.travelersPlural}</SelectItem>
                  <SelectItem value="4">4 {t.search.travelersPlural}</SelectItem>
                </SelectContent>
              </Select>
        </SearchField>

      </div>

      <div className="mt-3 grid gap-3 border-t border-slate-100 pt-3 sm:grid-cols-3">
        <Field label={t.search.currency}>
          <Select
            value={currency}
            onValueChange={(value) => {
              trackSearchStarted();
              setCurrency(getOption(currencies, value, "CAD"));
            }}
          >
            <SelectTrigger className="h-11 w-full rounded-xl border-slate-200 bg-white font-semibold">
              <SelectValue placeholder={t.search.currency} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="CAD">CAD</SelectItem>
              <SelectItem value="USD">USD</SelectItem>
              <SelectItem value="EUR">EUR</SelectItem>
              <SelectItem value="GBP">GBP</SelectItem>
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
                <SelectTrigger className="h-11 w-full rounded-xl border-slate-200 bg-white font-semibold">
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
        <Field label={t.search.travelStyle}>
              <Select
                value={style}
                onValueChange={(value) => {
                  trackSearchStarted();
                  setStyle(getOption(styles, value, "balanced"));
                }}
              >
                <SelectTrigger className="h-11 w-full rounded-xl border-slate-200 bg-white font-semibold">
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
      <Button type="submit" className="mt-5 h-14 w-full rounded-xl bg-orange-500 px-7 text-base font-bold text-white hover:bg-orange-600">
        <span>{t.search.submit}</span>
        <ArrowRight className="ml-2 size-4" />
      </Button>
      {error ? <p className="mt-4 text-center text-sm font-medium text-red-600">{error}</p> : null}
    </form>
  );
}

function getOption<const T extends readonly string[]>(options: T, value: string | null | undefined, fallback: T[number]) {
  return value && options.some((option) => option === value) ? (value as T[number]) : fallback;
}

function normalizeTextValue(value: string) {
  return value.trim().replace(/\s+/g, " ").slice(0, 80);
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-2">
      <Label className="sr-only">{label}</Label>
      {children}
    </div>
  );
}

function SearchField({
  label,
  icon,
  children,
}: {
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-20 min-w-0 items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 transition focus-within:border-[#14B8A6]">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white text-slate-400 shadow-sm">{icon}</span>
      <div className="min-w-0 flex-1">
        <Label className="text-[11px] font-bold uppercase tracking-wide text-slate-500">{label}</Label>
        {children}
      </div>
    </div>
  );
}
