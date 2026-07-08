"use client";

import { useId, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const categories = [
  {
    label: "eSIM",
    options: [
      { title: "Budget option", bestFor: "Light users", estimatedCost: "$10-$20" },
      { title: "Comfort option", bestFor: "Maps, messaging, and social media", estimatedCost: "$20-$40" },
      { title: "Premium option", bestFor: "Heavy data users", estimatedCost: "$45-$80" },
    ],
  },
  {
    label: "Insurance",
    options: [
      { title: "Budget option", bestFor: "Basic emergency medical coverage", estimatedCost: "$30-$50" },
      { title: "Comfort option", bestFor: "Medical, cancellation, and baggage coverage", estimatedCost: "$55-$90" },
      { title: "Premium option", bestFor: "Higher coverage limits and flexible bookings", estimatedCost: "$95-$160" },
    ],
  },
  {
    label: "Transfers",
    options: [
      { title: "Budget option", bestFor: "Public transit from the airport", estimatedCost: "$5-$12" },
      { title: "Comfort option", bestFor: "Shared shuttle or rideshare", estimatedCost: "$20-$40" },
      { title: "Premium option", bestFor: "Private pickup after a long flight", estimatedCost: "$55-$95" },
    ],
  },
  {
    label: "Activities",
    options: [
      { title: "Budget option", bestFor: "One paid attraction or museum", estimatedCost: "$15-$30" },
      { title: "Comfort option", bestFor: "Several museums, tours, or city pass entries", estimatedCost: "$35-$80" },
      { title: "Premium option", bestFor: "Guided tours and timed-entry attractions", estimatedCost: "$90-$180" },
    ],
  },
  {
    label: "Travel cards",
    options: [
      { title: "Budget option", bestFor: "No annual fee and lower FX costs", estimatedCost: "$0-$20/year" },
      { title: "Comfort option", bestFor: "Frequent foreign currency spending", estimatedCost: "$40-$120/year" },
      { title: "Premium option", bestFor: "Travel perks, credits, and insurance bundles", estimatedCost: "$150-$400/year" },
    ],
  },
  {
    label: "VPN",
    options: [
      { title: "Budget option", bestFor: "Occasional public Wi-Fi use", estimatedCost: "$3-$6" },
      { title: "Comfort option", bestFor: "Hotels, airports, and cafe Wi-Fi", estimatedCost: "$7-$12" },
      { title: "Premium option", bestFor: "Remote work and multiple devices", estimatedCost: "$13-$20" },
    ],
  },
] as const;

export function TravelExtrasTabs() {
  const [activeCategory, setActiveCategory] = useState<(typeof categories)[number]["label"]>(categories[0].label);
  const baseId = useId();
  const active = categories.find((category) => category.label === activeCategory) ?? categories[0];

  return (
    <section className="mt-16" aria-labelledby="category-tabs-title">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-[#0B1D34]">By category</p>
          <h2 id="category-tabs-title" className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
            Compare option tiers
          </h2>
        </div>
        <div
          role="tablist"
          aria-label="Travel extra categories"
          className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden"
        >
          {categories.map((category) => {
            const selected = category.label === active.label;
            const tabId = `${baseId}-${category.label.toLowerCase().replaceAll(" ", "-")}-tab`;
            const panelId = `${baseId}-${category.label.toLowerCase().replaceAll(" ", "-")}-panel`;

            return (
              <button
                key={category.label}
                id={tabId}
                type="button"
                role="tab"
                aria-controls={panelId}
                aria-selected={selected}
                onClick={() => setActiveCategory(category.label)}
                className={cn(
                  "inline-flex min-w-max items-center rounded-full border px-4 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[#14B8A6]/20",
                  selected
                    ? "border-[#2563eb] bg-[#2563eb] text-white"
                    : "border-[#c3c6d7]/60 bg-white text-[#434655] hover:border-[#0B1D34] hover:text-[#0B1D34]",
                )}
              >
                {category.label}
              </button>
            );
          })}
        </div>
      </div>

      <div
        id={`${baseId}-${active.label.toLowerCase().replaceAll(" ", "-")}-panel`}
        role="tabpanel"
        aria-labelledby={`${baseId}-${active.label.toLowerCase().replaceAll(" ", "-")}-tab`}
        className="mt-6 grid gap-4 md:grid-cols-3"
      >
        {active.options.map((option, index) => (
          <Card
            key={option.title}
            className={cn(
              "border-slate-200 bg-white shadow-sm",
              index === 1 ? "border-[#0B1D34]/40 shadow-lg shadow-slate-200/60" : "",
            )}
          >
            <CardContent className="pt-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                {index === 0 ? "Lite" : index === 1 ? "Comfort" : "Max"}
              </p>
              <h3 className="mt-2 text-xl font-semibold text-slate-950">{option.title}</h3>
              <dl className="mt-5 grid gap-3 text-sm">
                <div>
                  <dt className="font-semibold text-slate-500">Best for</dt>
                  <dd className="mt-1 text-slate-700">{option.bestFor}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-slate-500">Estimated cost</dt>
                  <dd className="mt-1 text-lg font-semibold text-[#0B1D34]">{option.estimatedCost}</dd>
                </div>
              </dl>
              <Button
                type="button"
                variant={index === 1 ? "default" : "outline"}
                className={cn(
                  "mt-6 h-10 w-full rounded-xl",
                  index === 1 ? "bg-[#0B1D34] text-white hover:bg-[#0B1D34]" : "border-[#c3c6d7] bg-white",
                )}
              >
                Compare {option.title.toLowerCase()}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
