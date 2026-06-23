"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Calendar, MapPin, Users, Wallet } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const currencies = ["CAD", "USD", "EUR"] as const;
const months = ["march", "june", "october"] as const;
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
  const [budget, setBudget] = useState("2400");
  const [currency, setCurrency] = useState<Currency>("CAD");
  const [origin, setOrigin] = useState("Toronto");
  const [days, setDays] = useState<DayOption>("10");
  const [month, setMonth] = useState<Month>("october");
  const [travelers, setTravelers] = useState<TravelerOption>("2");
  const [style, setStyle] = useState<TravelStyle>("balanced");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const parsedBudget = Number(budget.replace(/,/g, ""));
    const trimmedOrigin = origin.trim();

    if (!Number.isFinite(parsedBudget) || parsedBudget < 100 || parsedBudget > 250000) {
      setError("Enter a budget between 100 and 250,000 to continue.");
      return;
    }

    if (!trimmedOrigin) {
      setError("Enter a departure city to continue.");
      return;
    }

    setError(null);

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
        <CardTitle className="text-lg text-slate-950">Plan from your real budget</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Budget" icon={<Wallet className="size-4" />}>
              <Input
                value={budget}
                onChange={(event) => setBudget(event.target.value)}
                inputMode="numeric"
                min={100}
                max={250000}
                className="h-11 bg-white"
              />
            </Field>
            <Field label="Currency">
              <Select value={currency} onValueChange={(value) => setCurrency(getOption(currencies, value, "CAD"))}>
                <SelectTrigger className="h-11 w-full bg-white">
                  <SelectValue placeholder="Currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CAD">CAD</SelectItem>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field label="Departure city" icon={<MapPin className="size-4" />}>
              <Input value={origin} onChange={(event) => setOrigin(event.target.value)} className="h-11 bg-white" />
            </Field>
            <Field label="Duration" icon={<Calendar className="size-4" />}>
              <Select value={days} onValueChange={(value) => setDays(getOption(dayOptions, value, "10"))}>
                <SelectTrigger className="h-11 w-full bg-white">
                  <SelectValue placeholder="Duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">7 days</SelectItem>
                  <SelectItem value="10">10 days</SelectItem>
                  <SelectItem value="14">14 days</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field label="Travel month">
              <Select value={month} onValueChange={(value) => setMonth(getOption(months, value, "october"))}>
                <SelectTrigger className="h-11 w-full bg-white">
                  <SelectValue placeholder="Travel month" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="march">March</SelectItem>
                  <SelectItem value="june">June</SelectItem>
                  <SelectItem value="october">October</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field label="Number of travelers" icon={<Users className="size-4" />}>
              <Select value={travelers} onValueChange={(value) => setTravelers(getOption(travelerOptions, value, "2"))}>
                <SelectTrigger className="h-11 w-full bg-white">
                  <SelectValue placeholder="Travelers" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 traveler</SelectItem>
                  <SelectItem value="2">2 travelers</SelectItem>
                  <SelectItem value="4">4 travelers</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field label="Travel style">
              <Select value={style} onValueChange={(value) => setStyle(getOption(styles, value, "balanced"))}>
                <SelectTrigger className="h-11 w-full bg-white">
                  <SelectValue placeholder="Travel style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="budget">Budget</SelectItem>
                  <SelectItem value="balanced">Balanced</SelectItem>
                  <SelectItem value="comfort">Comfort</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          </div>
          {error ? <p className="mt-4 text-sm font-medium text-red-600">{error}</p> : null}
          <Button type="submit" className="mt-5 h-12 w-full rounded-xl bg-orange-500 text-base text-white hover:bg-orange-600">
            Find My Best Destinations
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
