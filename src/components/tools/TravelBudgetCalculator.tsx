"use client";

import { type FormEvent, useMemo, useRef, useState } from "react";
import {
  BedDouble,
  Bus,
  CircleDollarSign,
  Plane,
  ShieldCheck,
  Sparkles,
  Utensils,
  WalletCards,
} from "lucide-react";

import { CostBreakdownCard } from "@/components/site/cost-breakdown-card";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trackEvent } from "@/lib/analytics/track";
import { formatMoney } from "@/lib/format-money";

type CalculatorValues = {
  departureCity: string;
  destination: string;
  travelers: number;
  tripLength: number;
  flightCost: number;
  accommodationPerNight: number;
  foodPerDay: number;
  activitiesPerDay: number;
  transportationPerDay: number;
  insurance: number;
  bufferPercentage: number;
};

type NumericField = {
  id: keyof Pick<
    CalculatorValues,
    | "travelers"
    | "tripLength"
    | "flightCost"
    | "accommodationPerNight"
    | "foodPerDay"
    | "activitiesPerDay"
    | "transportationPerDay"
    | "insurance"
    | "bufferPercentage"
  >;
  label: string;
  prefix?: string;
  suffix?: string;
  min: number;
  step?: number;
};

const defaultValues: CalculatorValues = {
  departureCity: "New York",
  destination: "Lisbon",
  travelers: 2,
  tripLength: 7,
  flightCost: 650,
  accommodationPerNight: 140,
  foodPerDay: 55,
  activitiesPerDay: 35,
  transportationPerDay: 18,
  insurance: 80,
  bufferPercentage: 10,
};

const numericFields: NumericField[] = [
  { id: "travelers", label: "Number of travelers", min: 1, step: 1 },
  { id: "tripLength", label: "Trip length in days", min: 1, step: 1 },
  { id: "flightCost", label: "Flight cost per traveler", prefix: "$", min: 0 },
  { id: "accommodationPerNight", label: "Accommodation cost per night", prefix: "$", min: 0 },
  { id: "foodPerDay", label: "Food cost per day", prefix: "$", min: 0 },
  { id: "activitiesPerDay", label: "Activities cost per day", prefix: "$", min: 0 },
  { id: "transportationPerDay", label: "Transportation cost per day", prefix: "$", min: 0 },
  { id: "insurance", label: "Travel insurance per traveler", prefix: "$", min: 0 },
  { id: "bufferPercentage", label: "Extra buffer percentage", suffix: "%", min: 0 },
];

const categoryStyles = {
  budget: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  "mid-range": "bg-blue-50 text-blue-700 ring-blue-100",
  luxury: "bg-amber-50 text-amber-700 ring-amber-100",
};

type BudgetCategory = keyof typeof categoryStyles;

const calculatorCurrency = "USD";

function formatCurrency(value: number) {
  return formatMoney(value, calculatorCurrency);
}

export function TravelBudgetCalculator() {
  const [values, setValues] = useState<CalculatorValues>(defaultValues);
  const trackedFields = useRef(new Set<keyof CalculatorValues>());

  const totals = useMemo(() => {
    const travelers = Math.max(values.travelers, 1);
    const tripLength = Math.max(values.tripLength, 1);
    const nights = Math.max(tripLength - 1, 1);
    const flights = values.flightCost * travelers;
    const accommodation = values.accommodationPerNight * nights;
    const food = values.foodPerDay * tripLength * travelers;
    const activities = values.activitiesPerDay * tripLength * travelers;
    const localTransportation = values.transportationPerDay * tripLength * travelers;
    const insurance = values.insurance * travelers;
    const subtotal = flights + accommodation + food + activities + localTransportation + insurance;
    const buffer = subtotal * (values.bufferPercentage / 100);
    const total = subtotal + buffer;
    const perTraveler = total / travelers;
    const dailyAverage = total / tripLength;
    const dailyPerTraveler = perTraveler / tripLength;
    const category: BudgetCategory =
      dailyPerTraveler < 120 ? "budget" : dailyPerTraveler < 280 ? "mid-range" : "luxury";

    return {
      total,
      perTraveler,
      dailyAverage,
      category,
      breakdown: [
        { label: "Flights", amount: flights, icon: Plane, colorClassName: "bg-blue-500" },
        { label: "Accommodation", amount: accommodation, icon: BedDouble, colorClassName: "bg-teal-500" },
        { label: "Food", amount: food, icon: Utensils, colorClassName: "bg-amber-500" },
        { label: "Activities", amount: activities, icon: Sparkles, colorClassName: "bg-fuchsia-500" },
        { label: "Local transportation", amount: localTransportation, icon: Bus, colorClassName: "bg-indigo-500" },
        { label: "Insurance", amount: insurance, icon: ShieldCheck, colorClassName: "bg-slate-500" },
        { label: "Buffer", amount: buffer, icon: CircleDollarSign, colorClassName: "bg-emerald-500" },
      ],
    };
  }, [values]);

  function trackCalculatorChange(field: keyof CalculatorValues, nextValues: CalculatorValues) {
    if (trackedFields.current.has(field)) {
      return;
    }

    trackedFields.current.add(field);
    trackEvent("budget_calculator_updated", {
      page: "/tools/travel-budget-calculator",
      field,
      destinationName: nextValues.destination.slice(0, 80),
      currency: calculatorCurrency,
      travelers: nextValues.travelers,
      tripLength: nextValues.tripLength,
      estimatedTotal: Math.round(calculateTotal(nextValues)),
    });
  }

  function updateTextField(field: "departureCity" | "destination", value: string) {
    const nextValues = { ...values, [field]: value };
    trackCalculatorChange(field, nextValues);
    setValues((current) => ({ ...current, [field]: value }));
  }

  function updateNumberField(field: NumericField["id"], value: string) {
    const parsed = Number(value);
    const nextValue = Number.isFinite(parsed) ? Math.max(parsed, 0) : 0;
    const nextValues = { ...values, [field]: nextValue };
    trackCalculatorChange(field, nextValues);
    setValues((current) => ({ ...current, [field]: nextValue }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    trackEvent("budget_calculator_submitted", {
      page: "/tools/travel-budget-calculator",
      destinationName: values.destination.slice(0, 80),
      budget: Math.round(totals.total),
      currency: calculatorCurrency,
      tripLength: values.tripLength,
      travelers: values.travelers,
      estimatedTotal: Math.round(totals.total),
    });
  }

  return (
    <section aria-labelledby="calculator-heading" className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
      <Card className="border-slate-200 bg-white shadow-sm">
        <CardHeader>
          <CardTitle>
            <h2 id="calculator-heading" className="text-2xl font-semibold tracking-tight text-slate-950">
              Estimate your trip cost
            </h2>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit}>
            <div className="grid gap-2">
              <Label htmlFor="departureCity">Departure city</Label>
              <Input
                id="departureCity"
                value={values.departureCity}
                onChange={(event) => updateTextField("departureCity", event.target.value)}
                autoComplete="address-level2"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="destination">Destination</Label>
              <Input
                id="destination"
                value={values.destination}
                onChange={(event) => updateTextField("destination", event.target.value)}
                autoComplete="address-level2"
              />
            </div>
            {numericFields.map((field) => (
              <div key={field.id} className="grid gap-2">
                <Label htmlFor={field.id}>{field.label}</Label>
                <div className="relative">
                  {field.prefix ? (
                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-500">
                      {field.prefix}
                    </span>
                  ) : null}
                  <Input
                    id={field.id}
                    type="number"
                    min={field.min}
                    step={field.step ?? 5}
                    value={values[field.id]}
                    onChange={(event) => updateNumberField(field.id, event.target.value)}
                    className={`${field.prefix ? "pl-7" : ""} ${field.suffix ? "pr-8" : ""}`}
                  />
                  {field.suffix ? (
                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-500">
                      {field.suffix}
                    </span>
                  ) : null}
                </div>
              </div>
            ))}
          </form>
        </CardContent>
      </Card>

      <div className="grid gap-6">
        <Card className="border-slate-200 bg-slate-950 text-white shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-slate-300">Total estimated trip cost</p>
                <p className="mt-2 text-4xl font-semibold tracking-tight">{formatCurrency(totals.total)}</p>
              </div>
              <span className="flex size-11 items-center justify-center rounded-xl bg-white/10 text-blue-200">
                <WalletCards className="size-5" />
              </span>
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg bg-white/10 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-300">Per traveler</p>
                <p className="mt-2 text-2xl font-semibold">{formatCurrency(totals.perTraveler)}</p>
              </div>
              <div className="rounded-lg bg-white/10 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-300">Daily average</p>
                <p className="mt-2 text-2xl font-semibold">{formatCurrency(totals.dailyAverage)}</p>
              </div>
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-slate-300">
              <span>
                {values.departureCity || "Departure"} to {values.destination || "destination"}
              </span>
              <Badge className={categoryStyles[totals.category]}>
                {totals.category} trip
              </Badge>
            </div>
          </CardContent>
        </Card>

        <CostBreakdownCard
          barMode="max"
          currency={calculatorCurrency}
          items={totals.breakdown}
          showTotal={false}
          title="Cost breakdown"
        />
      </div>
    </section>
  );
}

function calculateTotal(values: CalculatorValues) {
  const travelers = Math.max(values.travelers, 1);
  const tripLength = Math.max(values.tripLength, 1);
  const nights = Math.max(tripLength - 1, 1);
  const subtotal =
    values.flightCost * travelers +
    values.accommodationPerNight * nights +
    values.foodPerDay * tripLength * travelers +
    values.activitiesPerDay * tripLength * travelers +
    values.transportationPerDay * tripLength * travelers +
    values.insurance * travelers;

  return subtotal + subtotal * (values.bufferPercentage / 100);
}
