"use client";

import { type FormEvent, useMemo, useRef, useState } from "react";
import { ArrowRight, Check, Mail, MapPin, Plane, Sparkles } from "lucide-react";

import { EstimateDisclaimer } from "@/components/site/estimate-disclaimer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics/track";
import { formatMoney } from "@/lib/format-money";

type BudgetRange = "under-1000" | "1000-1500" | "1500-2500" | "2500-4000" | "4000-plus";
type TripLength = "weekend" | "5-7-days" | "8-10-days" | "2-weeks" | "flexible";
type TravelStyle = "Budget" | "Comfort" | "Premium" | "Backpacking" | "Family-friendly";
type TravelTiming = "Next month" | "Summer" | "Winter" | "Spring/Fall" | "Flexible";

type TripAnswers = {
  departureCity: string;
  otherDepartureCity: string;
  budgetRange: BudgetRange | "";
  budgetAmount: string;
  tripLength: TripLength | "";
  travelStyle: TravelStyle | "";
  tripTypes: string[];
  travelTiming: TravelTiming | "";
  constraints: string[];
};

type DestinationEstimate = {
  destination: string;
  baseTotal: number;
  flightFromMontreal: number;
  tags: string[];
  bestFor: string;
  whyItFits: string;
  warm: boolean;
  familyFriendly: boolean;
  shortFlight: boolean;
  visaEase: boolean;
  breakdown: {
    flight: number;
    stay: number;
    food: number;
    transport: number;
    activities: number;
    buffer: number;
  };
};

type TripMatch = DestinationEstimate & {
  estimatedTotal: number;
  budgetFitScore: number;
};

type QuestionStep = {
  key: keyof TripAnswers;
  title: string;
  description?: string;
  optional?: boolean;
};

const currency = "CAD";
const pagePath = "/travel-budget-calculator";

const departureCities = [
  "Montreal",
  "Toronto",
  "Vancouver",
  "Quebec City",
  "Ottawa",
  "Calgary",
  "New York",
  "Boston",
  "Chicago",
  "Other",
];

const budgetRanges: { label: string; value: BudgetRange; amount: number }[] = [
  { label: "Under $1,000", value: "under-1000", amount: 900 },
  { label: "$1,000-$1,500", value: "1000-1500", amount: 1250 },
  { label: "$1,500-$2,500", value: "1500-2500", amount: 2200 },
  { label: "$2,500-$4,000", value: "2500-4000", amount: 3200 },
  { label: "$4,000+", value: "4000-plus", amount: 4800 },
];

const tripLengths: { label: string; value: TripLength; days: number }[] = [
  { label: "Weekend", value: "weekend", days: 3 },
  { label: "5-7 days", value: "5-7-days", days: 7 },
  { label: "8-10 days", value: "8-10-days", days: 10 },
  { label: "2 weeks", value: "2-weeks", days: 14 },
  { label: "Flexible", value: "flexible", days: 9 },
];

const travelStyles: TravelStyle[] = ["Budget", "Comfort", "Premium", "Backpacking", "Family-friendly"];
const tripTypes = ["Beach", "City break", "Nature", "Food & culture", "Adventure", "Romantic", "Party", "Family"];
const travelTimings: TravelTiming[] = ["Next month", "Summer", "Winter", "Spring/Fall", "Flexible"];
const constraints = [
  "No visa hassle",
  "Warm weather only",
  "Safe for solo travel",
  "Kid-friendly",
  "Direct flights preferred",
  "Short flight preferred",
  "Low walking required",
];

const steps: QuestionStep[] = [
  { key: "departureCity", title: "Where are you flying from?" },
  {
    key: "budgetRange",
    title: "What's your total trip budget?",
    description: "Per person, including flights and daily travel costs.",
  },
  { key: "tripLength", title: "How long do you want to travel?" },
  { key: "travelStyle", title: "What's your travel style?" },
  { key: "tripTypes", title: "What kind of trip are you looking for?" },
  { key: "travelTiming", title: "When are you planning to go?" },
  { key: "constraints", title: "Anything important for this trip?", optional: true },
];

const defaultAnswers: TripAnswers = {
  departureCity: "",
  otherDepartureCity: "",
  budgetRange: "",
  budgetAmount: "",
  tripLength: "",
  travelStyle: "",
  tripTypes: [],
  travelTiming: "",
  constraints: [],
};

const destinationEstimates: DestinationEstimate[] = [
  {
    destination: "Lisbon, Portugal",
    baseTotal: 2320,
    flightFromMontreal: 750,
    tags: ["City break", "Food & culture", "Romantic"],
    bestFor: "Food, culture, walkable city",
    whyItFits: "Lisbon usually offers strong value for comfort travelers, especially outside peak summer.",
    warm: true,
    familyFriendly: true,
    shortFlight: false,
    visaEase: true,
    breakdown: { flight: 750, stay: 850, food: 360, transport: 120, activities: 160, buffer: 80 },
  },
  {
    destination: "Mexico City, Mexico",
    baseTotal: 1780,
    flightFromMontreal: 560,
    tags: ["City break", "Food & culture", "Party"],
    bestFor: "Food, museums, lively neighborhoods",
    whyItFits: "Mexico City keeps daily costs efficient while still feeling rich in restaurants, culture, and activities.",
    warm: true,
    familyFriendly: true,
    shortFlight: true,
    visaEase: true,
    breakdown: { flight: 560, stay: 560, food: 290, transport: 90, activities: 190, buffer: 90 },
  },
  {
    destination: "Medellin, Colombia",
    baseTotal: 1880,
    flightFromMontreal: 620,
    tags: ["Nature", "Food & culture", "Adventure"],
    bestFor: "Value, cafes, mountain views",
    whyItFits: "Medellin can stretch a mid-range budget thanks to lower stay and food costs after the flight.",
    warm: true,
    familyFriendly: false,
    shortFlight: false,
    visaEase: true,
    breakdown: { flight: 620, stay: 520, food: 300, transport: 100, activities: 240, buffer: 100 },
  },
  {
    destination: "Barcelona, Spain",
    baseTotal: 2650,
    flightFromMontreal: 790,
    tags: ["Beach", "City break", "Food & culture"],
    bestFor: "Architecture, food, beach-city balance",
    whyItFits: "Barcelona works well when you want a polished Europe trip without jumping into the highest price tier.",
    warm: true,
    familyFriendly: true,
    shortFlight: false,
    visaEase: true,
    breakdown: { flight: 790, stay: 980, food: 420, transport: 130, activities: 230, buffer: 100 },
  },
  {
    destination: "Paris, France",
    baseTotal: 3180,
    flightFromMontreal: 780,
    tags: ["City break", "Food & culture", "Romantic"],
    bestFor: "Museums, romance, classic city break",
    whyItFits: "Paris is a stronger match when the budget allows higher accommodation and activity costs.",
    warm: false,
    familyFriendly: true,
    shortFlight: false,
    visaEase: true,
    breakdown: { flight: 780, stay: 1350, food: 520, transport: 160, activities: 260, buffer: 110 },
  },
  {
    destination: "Rome, Italy",
    baseTotal: 2960,
    flightFromMontreal: 820,
    tags: ["City break", "Food & culture", "Romantic", "Family"],
    bestFor: "History, food, first-time Europe",
    whyItFits: "Rome gives strong cultural value, with costs that stay more manageable outside peak summer.",
    warm: true,
    familyFriendly: true,
    shortFlight: false,
    visaEase: true,
    breakdown: { flight: 820, stay: 1120, food: 450, transport: 130, activities: 320, buffer: 120 },
  },
  {
    destination: "San Jose, Costa Rica",
    baseTotal: 2840,
    flightFromMontreal: 720,
    tags: ["Nature", "Adventure", "Family", "Beach"],
    bestFor: "Nature, wildlife, adventure add-ons",
    whyItFits: "Costa Rica is best when you leave room for guided activities, transport, and nature experiences.",
    warm: true,
    familyFriendly: true,
    shortFlight: true,
    visaEase: true,
    breakdown: { flight: 720, stay: 980, food: 390, transport: 260, activities: 360, buffer: 130 },
  },
  {
    destination: "Bangkok, Thailand",
    baseTotal: 3260,
    flightFromMontreal: 1380,
    tags: ["Food & culture", "Adventure", "Backpacking", "Party"],
    bestFor: "Food, temples, long-haul value",
    whyItFits: "Bangkok has a higher flight cost, but daily costs can make longer trips feel surprisingly efficient.",
    warm: true,
    familyFriendly: true,
    shortFlight: false,
    visaEase: true,
    breakdown: { flight: 1380, stay: 760, food: 330, transport: 150, activities: 500, buffer: 140 },
  },
  {
    destination: "Tokyo, Japan",
    baseTotal: 4120,
    flightFromMontreal: 1450,
    tags: ["City break", "Food & culture", "Family", "Adventure"],
    bestFor: "Food, design, family-friendly cities",
    whyItFits: "Tokyo fits best with a larger budget because flights, rail, and accommodation can add up quickly.",
    warm: false,
    familyFriendly: true,
    shortFlight: false,
    visaEase: true,
    breakdown: { flight: 1450, stay: 1420, food: 520, transport: 310, activities: 270, buffer: 150 },
  },
  {
    destination: "Reykjavik, Iceland",
    baseTotal: 4380,
    flightFromMontreal: 830,
    tags: ["Nature", "Adventure", "Romantic"],
    bestFor: "Dramatic nature, road trips, winter trips",
    whyItFits: "Iceland is compelling for nature trips, but the local costs make it a better match for larger budgets.",
    warm: false,
    familyFriendly: true,
    shortFlight: true,
    visaEase: true,
    breakdown: { flight: 830, stay: 1650, food: 720, transport: 620, activities: 360, buffer: 200 },
  },
];

export function TravelBudgetCalculator() {
  const [answers, setAnswers] = useState<TripAnswers>(defaultAnswers);
  const [currentStep, setCurrentStep] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [email, setEmail] = useState("");
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  const activeStep = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;
  const canContinue = isStepComplete(activeStep, answers);
  const matches = useMemo(() => getTripMatches(answers), [answers]);
  const summary = useMemo(() => getAnswerSummary(answers), [answers]);

  function updateAnswer(nextAnswers: Partial<TripAnswers>) {
    setAnswers((current) => ({ ...current, ...nextAnswers }));
  }

  function toggleArrayAnswer(key: "tripTypes" | "constraints", value: string) {
    setAnswers((current) => {
      const selected = current[key].includes(value);
      return {
        ...current,
        [key]: selected ? current[key].filter((item) => item !== value) : [...current[key], value],
      };
    });
  }

  function goToNextStep() {
    if (!canContinue) {
      return;
    }

    if (currentStep === steps.length - 1) {
      revealResults();
      return;
    }

    setCurrentStep((step) => step + 1);
  }

  function revealResults() {
    setShowResults(true);
    trackEvent("calculator_submitted", {
      page: pagePath,
      originCity: getDepartureCity(answers),
      budget: getBudgetAmount(answers),
      currency,
      tripLength: summary.days,
      travelStyle: answers.travelStyle || "unknown",
      resultCount: matches.length,
    });
    window.setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
  }

  function handleEmailSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setEmailSubmitted(true);
    trackEvent("email_capture", {
      page: pagePath,
      source: "trip_budget_test_email_capture",
      emailDomain: getEmailDomain(email),
    });
  }

  function focusEmailCapture() {
    emailRef.current?.focus();
  }

  return (
    <div id="trip-budget-test" className="grid gap-8">
      <section aria-labelledby="budget-test-heading" className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <Card className="border-slate-200 bg-white shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-teal-700">
                  Step {currentStep + 1} of {steps.length}
                </p>
                <CardTitle>
                  <h2 id="budget-test-heading" className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
                    {activeStep.title}
                  </h2>
                </CardTitle>
              </div>
              <Badge className="bg-[#14B8A6]/10 text-[#0B1D34] ring-1 ring-[#14B8A6]/20">
                {Math.round(progress)}%
              </Badge>
            </div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-[#14B8A6] transition-all" style={{ width: `${progress}%` }} />
            </div>
            {activeStep.description ? <p className="mt-4 text-sm leading-6 text-slate-500">{activeStep.description}</p> : null}
          </CardHeader>
          <CardContent className="grid gap-6">
            <QuestionContent
              activeStep={activeStep}
              answers={answers}
              onSelectDepartureCity={(departureCity) => updateAnswer({ departureCity })}
              onOtherDepartureCityChange={(otherDepartureCity) => updateAnswer({ otherDepartureCity })}
              onSelectBudget={(budgetRange) => updateAnswer({ budgetRange })}
              onBudgetAmountChange={(budgetAmount) => updateAnswer({ budgetAmount })}
              onSelectTripLength={(tripLength) => updateAnswer({ tripLength })}
              onSelectTravelStyle={(travelStyle) => updateAnswer({ travelStyle })}
              onSelectTravelTiming={(travelTiming) => updateAnswer({ travelTiming })}
              onToggleTripType={(value) => toggleArrayAnswer("tripTypes", value)}
              onToggleConstraint={(value) => toggleArrayAnswer("constraints", value)}
            />

            <div className="flex flex-col gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
              <Button
                type="button"
                variant="outline"
                className="h-11 rounded-xl"
                disabled={currentStep === 0}
                onClick={() => setCurrentStep((step) => Math.max(0, step - 1))}
              >
                Back
              </Button>
              <div className="flex flex-col gap-3 sm:flex-row">
                {activeStep.optional ? (
                  <Button type="button" variant="ghost" className="h-11 rounded-xl" onClick={revealResults}>
                    Skip
                  </Button>
                ) : null}
                <Button
                  type="button"
                  className="h-11 rounded-xl bg-[#0B1D34] px-5 text-white hover:bg-[#0B1D34]/90"
                  disabled={!canContinue}
                  onClick={goToNextStep}
                >
                  {currentStep === steps.length - 1 ? "See my trip matches" : "Next"}
                  <ArrowRight className="ml-2 size-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#14B8A6]/20 bg-slate-950 text-white shadow-sm">
          <CardContent className="grid gap-6 pt-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-slate-300">Live match preview</p>
                <p className="mt-2 text-3xl font-semibold tracking-tight">
                  {summary.origin} to {matches[0]?.destination.split(",")[0] ?? "Lisbon"}
                </p>
              </div>
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-[#38BDF8]">
                <Sparkles className="size-5" />
              </span>
            </div>
            <div className="grid gap-3 rounded-xl bg-white/10 p-4">
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <Plane className="size-4 text-[#38BDF8]" />
                Personalized estimate
              </div>
              <p className="text-lg font-semibold">
                {summary.days} days - {summary.style} - {formatCurrency(getBudgetAmount(answers))}
              </p>
              <div>
                <p className="text-sm text-slate-300">Budget fit</p>
                <p className="mt-1 text-4xl font-semibold">{matches[0]?.budgetFitScore ?? 93}%</p>
              </div>
            </div>
            <div className="grid gap-3 text-sm text-slate-300">
              <div className="flex items-center gap-2">
                <Check className="size-4 text-[#14B8A6]" />
                Flights, stays, food, transport, activities, and buffer
              </div>
              <div className="flex items-center gap-2">
                <Check className="size-4 text-[#14B8A6]" />
                Ranked by budget fit, timing, style, and trip type
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {showResults ? (
        <section ref={resultsRef} aria-labelledby="trip-matches-heading" className="grid gap-6 scroll-mt-8">
          <div className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">Personalized results</p>
              <h2 id="trip-matches-heading" className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
                Your best trip matches
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-500">
                Based on your budget, trip length, departure city, and travel style.
              </p>
            </div>
            <div className="rounded-xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 ring-1 ring-slate-200">
              {summary.budget} - {summary.days} days - From {summary.origin} - {summary.style}
            </div>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            {matches.map((match) => (
              <DestinationMatchCard key={match.destination} match={match} onEmailClick={focusEmailCapture} />
            ))}
          </div>

          <EstimateDisclaimer title="Trip match estimate" />

          <Card className="border-[#14B8A6]/20 bg-white shadow-sm">
            <CardContent className="grid gap-5 pt-6 lg:grid-cols-[1fr_0.9fr] lg:items-center">
              <div>
                <div className="flex items-center gap-3">
                  <span className="flex size-10 items-center justify-center rounded-xl bg-[#14B8A6]/10 text-[#0B1D34]">
                    <Mail className="size-5" />
                  </span>
                  <div>
                    <h3 className="text-2xl font-semibold tracking-tight text-slate-950">
                      Want this budget sent to your inbox?
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      Get your trip matches, budget breakdown, and planning notes by email.
                    </p>
                  </div>
                </div>
              </div>
              <form className="grid gap-3" onSubmit={handleEmailSubmit}>
                <Label htmlFor="trip-budget-email">Email address</Label>
                <Input
                  ref={emailRef}
                  id="trip-budget-email"
                  type="email"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    setEmailSubmitted(false);
                  }}
                  placeholder="you@example.com"
                  className="h-11 rounded-xl bg-white"
                />
                <Button type="submit" className="h-11 rounded-xl bg-orange-500 text-white hover:bg-orange-600">
                  Send me my trip budget
                </Button>
                {emailSubmitted ? (
                  <p className="text-sm font-medium text-teal-700">
                    Thanks - your trip budget is ready to send once email delivery is connected.
                  </p>
                ) : null}
                {/* TODO: Connect this local email capture to the production email provider when delivery is configured. */}
              </form>
            </CardContent>
          </Card>
        </section>
      ) : null}
    </div>
  );
}

function QuestionContent({
  activeStep,
  answers,
  onSelectDepartureCity,
  onOtherDepartureCityChange,
  onSelectBudget,
  onBudgetAmountChange,
  onSelectTripLength,
  onSelectTravelStyle,
  onSelectTravelTiming,
  onToggleTripType,
  onToggleConstraint,
}: {
  activeStep: QuestionStep;
  answers: TripAnswers;
  onSelectDepartureCity: (value: string) => void;
  onOtherDepartureCityChange: (value: string) => void;
  onSelectBudget: (value: BudgetRange) => void;
  onBudgetAmountChange: (value: string) => void;
  onSelectTripLength: (value: TripLength) => void;
  onSelectTravelStyle: (value: TravelStyle) => void;
  onSelectTravelTiming: (value: TravelTiming) => void;
  onToggleTripType: (value: string) => void;
  onToggleConstraint: (value: string) => void;
}) {
  if (activeStep.key === "departureCity") {
    return (
      <div className="grid gap-4">
        <OptionGrid
          options={departureCities}
          selectedValues={[answers.departureCity]}
          onToggle={onSelectDepartureCity}
          columnsClassName="sm:grid-cols-2 lg:grid-cols-3"
        />
        {answers.departureCity === "Other" ? (
          <div className="grid gap-2">
            <Label htmlFor="otherDepartureCity">Departure city</Label>
            <Input
              id="otherDepartureCity"
              value={answers.otherDepartureCity}
              onChange={(event) => onOtherDepartureCityChange(event.target.value)}
              placeholder="Enter your city"
              className="h-11 rounded-xl bg-white"
            />
          </div>
        ) : null}
      </div>
    );
  }

  if (activeStep.key === "budgetRange") {
    return (
      <div className="grid gap-4">
        <OptionGrid
          options={budgetRanges.map((range) => range.label)}
          selectedValues={[budgetRanges.find((range) => range.value === answers.budgetRange)?.label ?? ""]}
          onToggle={(label) => {
            const range = budgetRanges.find((item) => item.label === label);
            if (range) {
              onSelectBudget(range.value);
            }
          }}
          columnsClassName="sm:grid-cols-2"
        />
        <div className="grid gap-2">
          <Label htmlFor="budgetAmount">Custom amount in CAD</Label>
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-500">
              $
            </span>
            <Input
              id="budgetAmount"
              type="number"
              min={0}
              value={answers.budgetAmount}
              onChange={(event) => onBudgetAmountChange(event.target.value)}
              placeholder="2500"
              className="h-11 rounded-xl bg-white pl-7"
            />
          </div>
        </div>
      </div>
    );
  }

  if (activeStep.key === "tripLength") {
    return (
      <OptionGrid
        options={tripLengths.map((item) => item.label)}
        selectedValues={[tripLengths.find((item) => item.value === answers.tripLength)?.label ?? ""]}
        onToggle={(label) => {
          const length = tripLengths.find((item) => item.label === label);
          if (length) {
            onSelectTripLength(length.value);
          }
        }}
        columnsClassName="sm:grid-cols-2 lg:grid-cols-3"
      />
    );
  }

  if (activeStep.key === "travelStyle") {
    return (
      <OptionGrid
        options={travelStyles}
        selectedValues={answers.travelStyle ? [answers.travelStyle] : []}
        onToggle={(value) => onSelectTravelStyle(value as TravelStyle)}
        columnsClassName="sm:grid-cols-2 lg:grid-cols-3"
      />
    );
  }

  if (activeStep.key === "tripTypes") {
    return (
      <OptionGrid
        options={tripTypes}
        selectedValues={answers.tripTypes}
        onToggle={onToggleTripType}
        columnsClassName="sm:grid-cols-2 lg:grid-cols-4"
        multi
      />
    );
  }

  if (activeStep.key === "travelTiming") {
    return (
      <OptionGrid
        options={travelTimings}
        selectedValues={answers.travelTiming ? [answers.travelTiming] : []}
        onToggle={(value) => onSelectTravelTiming(value as TravelTiming)}
        columnsClassName="sm:grid-cols-2 lg:grid-cols-3"
      />
    );
  }

  return (
    <OptionGrid
      options={constraints}
      selectedValues={answers.constraints}
      onToggle={onToggleConstraint}
      columnsClassName="sm:grid-cols-2"
      multi
    />
  );
}

function OptionGrid({
  options,
  selectedValues,
  onToggle,
  columnsClassName,
  multi = false,
}: {
  options: string[];
  selectedValues: string[];
  onToggle: (value: string) => void;
  columnsClassName: string;
  multi?: boolean;
}) {
  return (
    <div className={cn("grid gap-3", columnsClassName)} role={multi ? "group" : "radiogroup"}>
      {options.map((option) => {
        const selected = selectedValues.includes(option);
        const optionId = `trip-budget-${option.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
        return (
          <label
            key={option}
            className={cn(
              "min-h-14 cursor-pointer rounded-xl border bg-white px-4 py-3 text-left text-sm font-semibold text-slate-700 transition hover:border-[#14B8A6] hover:bg-[#14B8A6]/5 has-focus-visible:ring-3 has-focus-visible:ring-[#14B8A6]/30",
              selected
                ? "border-[#14B8A6] bg-[#14B8A6]/10 text-[#0B1D34] shadow-sm"
                : "border-slate-200"
            )}
            htmlFor={optionId}
          >
            <input
              id={optionId}
              type={multi ? "checkbox" : "radio"}
              name={multi ? optionId : "trip-budget-option"}
              checked={selected}
              onChange={() => onToggle(option)}
              className="sr-only"
            />
            <span className="flex items-center justify-between gap-3">
              {option}
              {selected ? <Check className="size-4 shrink-0 text-[#14B8A6]" /> : null}
            </span>
          </label>
        );
      })}
    </div>
  );
}

function DestinationMatchCard({ match, onEmailClick }: { match: TripMatch; onEmailClick: () => void }) {
  const breakdownItems = [
    ["Flight", match.breakdown.flight],
    ["Stay", match.breakdown.stay],
    ["Food", match.breakdown.food],
    ["Transport", match.breakdown.transport],
    ["Activities", match.breakdown.activities],
    ["Buffer", match.breakdown.buffer],
  ] as const;

  return (
    <Card className="border-slate-200 bg-white shadow-sm">
      <CardContent className="grid gap-5 pt-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold text-teal-700">
              <MapPin className="size-4" />
              Destination
            </div>
            <h3 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">{match.destination}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-500">{match.bestFor}</p>
          </div>
          <div className="rounded-xl bg-slate-950 px-3 py-2 text-right text-white">
            <p className="text-xs text-slate-300">Budget fit</p>
            <p className="text-2xl font-semibold">{match.budgetFitScore}%</p>
          </div>
        </div>

        <div className="grid gap-3 rounded-xl bg-slate-50 p-4 sm:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Estimated total</p>
            <p className="mt-1 text-2xl font-semibold text-slate-950">{formatCurrency(match.estimatedTotal)}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Best for</p>
            <p className="mt-1 text-sm font-semibold text-slate-800">{match.bestFor}</p>
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold text-slate-950">Quick budget breakdown</p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {breakdownItems.map(([label, amount]) => (
              <div key={label} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-sm">
                <span className="text-slate-500">{label}</span>
                <span className="font-semibold text-slate-950">{formatCurrency(amount)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-[#14B8A6]/20 bg-[#14B8A6]/10 p-4">
          <p className="text-sm font-semibold text-slate-950">Why it fits</p>
          <p className="mt-2 text-sm leading-6 text-slate-600">{match.whyItFits}</p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button type="button" className="h-11 rounded-xl bg-[#0B1D34] text-white hover:bg-[#0B1D34]/90">
            View full budget breakdown
          </Button>
          <Button type="button" variant="outline" className="h-11 rounded-xl" onClick={onEmailClick}>
            Send me this trip budget
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function getTripMatches(answers: TripAnswers): TripMatch[] {
  const budget = getBudgetAmount(answers);
  const days = getTripDays(answers.tripLength);
  const styleMultiplier = getStyleMultiplier(answers.travelStyle);
  const departureAdjustment = getDepartureAdjustment(getDepartureCity(answers));
  const lengthMultiplier = Math.max(0.72, Math.min(1.45, days / 9));

  return destinationEstimates
    .map((destination) => {
      const adjustedBreakdown = adjustBreakdown(destination.breakdown, {
        styleMultiplier,
        departureAdjustment,
        lengthMultiplier,
      });
      const estimatedTotal = Object.values(adjustedBreakdown).reduce((total, amount) => total + amount, 0);
      const budgetGapRatio = Math.abs(budget - estimatedTotal) / Math.max(budget, estimatedTotal);
      let score = 100 - budgetGapRatio * 75;

      if (estimatedTotal > budget * 1.35) score -= 24;
      if (estimatedTotal <= budget) score += 7;
      if (answers.tripTypes.some((type) => destination.tags.includes(type))) score += 8;
      if (answers.travelStyle === "Family-friendly" && destination.familyFriendly) score += 6;
      if (answers.travelStyle === "Backpacking" && destination.baseTotal < 2600) score += 5;
      if (answers.constraints.includes("Warm weather only") && !destination.warm) score -= 18;
      if (answers.constraints.includes("Kid-friendly") && !destination.familyFriendly) score -= 18;
      if (answers.constraints.includes("Short flight preferred") && !destination.shortFlight) score -= 10;
      if (answers.constraints.includes("Direct flights preferred") && !destination.shortFlight) score -= 5;
      if (answers.constraints.includes("No visa hassle") && destination.visaEase) score += 4;
      if (answers.travelTiming === "Summer" && destination.destination.includes("Iceland")) score += 5;
      if (answers.travelTiming === "Winter" && destination.warm) score += 5;

      return {
        ...destination,
        breakdown: adjustedBreakdown,
        estimatedTotal,
        budgetFitScore: Math.max(48, Math.min(99, Math.round(score))),
      };
    })
    .filter((match) => {
      if (budget < 1000) return match.estimatedTotal <= 1600 || match.shortFlight;
      if (budget < 1600) return match.estimatedTotal <= 2400;
      if (budget < 2500) return match.estimatedTotal <= 3400;
      return match.estimatedTotal <= budget * 1.45;
    })
    .sort((a, b) => b.budgetFitScore - a.budgetFitScore)
    .slice(0, 6);
}

function adjustBreakdown(
  breakdown: DestinationEstimate["breakdown"],
  {
    styleMultiplier,
    departureAdjustment,
    lengthMultiplier,
  }: {
    styleMultiplier: number;
    departureAdjustment: number;
    lengthMultiplier: number;
  }
) {
  const flight = Math.round(breakdown.flight * departureAdjustment);
  const stay = Math.round(breakdown.stay * styleMultiplier * lengthMultiplier);
  const food = Math.round(breakdown.food * styleMultiplier * lengthMultiplier);
  const transport = Math.round(breakdown.transport * lengthMultiplier);
  const activities = Math.round(breakdown.activities * styleMultiplier * lengthMultiplier);
  const subtotal = flight + stay + food + transport + activities;
  const buffer = Math.round(subtotal * 0.05);

  return { flight, stay, food, transport, activities, buffer };
}

function isStepComplete(step: QuestionStep, answers: TripAnswers) {
  if (step.optional) return true;
  if (step.key === "departureCity") {
    return answers.departureCity === "Other" ? answers.otherDepartureCity.trim().length > 1 : answers.departureCity.length > 0;
  }
  if (step.key === "budgetRange") return answers.budgetRange.length > 0 || Number(answers.budgetAmount) > 0;
  if (step.key === "tripTypes") return answers.tripTypes.length > 0;
  const value = answers[step.key];
  return typeof value === "string" ? value.length > 0 : value.length > 0;
}

function getBudgetAmount(answers: TripAnswers) {
  const customBudget = Number(answers.budgetAmount);
  if (Number.isFinite(customBudget) && customBudget > 0) {
    return customBudget;
  }

  return budgetRanges.find((range) => range.value === answers.budgetRange)?.amount ?? 2500;
}

function getTripDays(tripLength: TripLength | "") {
  return tripLengths.find((item) => item.value === tripLength)?.days ?? 10;
}

function getStyleMultiplier(style: TravelStyle | "") {
  if (style === "Budget" || style === "Backpacking") return 0.82;
  if (style === "Premium") return 1.28;
  if (style === "Family-friendly") return 1.08;
  return 1;
}

function getDepartureAdjustment(city: string) {
  if (["Toronto", "New York", "Boston", "Chicago"].includes(city)) return 0.94;
  if (["Vancouver", "Calgary"].includes(city)) return 1.12;
  if (["Quebec City", "Ottawa"].includes(city)) return 1.06;
  return 1;
}

function getDepartureCity(answers: TripAnswers) {
  return answers.departureCity === "Other" ? answers.otherDepartureCity.trim() || "your city" : answers.departureCity || "Montreal";
}

function getAnswerSummary(answers: TripAnswers) {
  return {
    origin: getDepartureCity(answers),
    budget: formatCurrency(getBudgetAmount(answers)),
    days: getTripDays(answers.tripLength),
    style: answers.travelStyle || "Comfort",
  };
}

function formatCurrency(value: number) {
  return formatMoney(Math.round(value), currency);
}

function getEmailDomain(value: string) {
  const domain = value.trim().split("@")[1];
  return domain ? domain.toLowerCase().slice(0, 80) : undefined;
}
