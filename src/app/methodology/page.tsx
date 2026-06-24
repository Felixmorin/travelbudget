import Link from "next/link";
import { Calculator, CalendarClock, CircleDollarSign, Hotel, Plane, ShieldCheck, Utensils } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { createMetadata } from "@/lib/seo/metadata";
import { createBreadcrumbSchema, createGuideArticleSchema, serializeJsonLd } from "@/lib/seo/schema";

export const metadata = createMetadata({
  title: "Budget Methodology",
  description:
    "Learn how TravelBudget.ai estimates trip budgets using flight, accommodation, daily food, local transport, activity, and safety-margin assumptions.",
  path: "/methodology",
});

const costInputs = [
  {
    title: "Flights",
    icon: Plane,
    body:
      "We start with round-trip flight planning estimates from supported origin cities. Current baselines cover Montreal, Toronto, and Vancouver when destination-specific data is available.",
  },
  {
    title: "Accommodation",
    icon: Hotel,
    body:
      "Hotel and stay estimates are modeled per night as part of each destination's daily cost profile, with different assumptions for budget, mid-range, and comfort-oriented trips.",
  },
  {
    title: "Meals",
    icon: Utensils,
    body:
      "Meal budgets include practical daily food spending, from simple local meals in budget mode to more flexible restaurant choices in balanced and comfort modes.",
  },
  {
    title: "Local transport",
    icon: Calculator,
    body:
      "Local movement includes public transit, rideshares, short transfers, and similar ground transport needed to make an itinerary workable after arrival.",
  },
  {
    title: "Activities",
    icon: CircleDollarSign,
    body:
      "Activity costs cover paid attractions, tours, museums, day trips, and destination experiences. High-cost special activities still need separate verification before booking.",
  },
  {
    title: "Safety margin",
    icon: ShieldCheck,
    body:
      "A miscellaneous line is included for small surprises such as baggage, mobile data, city taxes, tips, laundry, and minor price movement between planning and booking.",
  },
];

export default function MethodologyPage() {
  const jsonLd = [
    createGuideArticleSchema({
      title: "TravelBudget.ai Budget Methodology",
      description:
        "How TravelBudget.ai estimates trip budgets from flights, accommodation, meals, local transport, activities, and safety margins.",
      path: "/methodology",
      datePublished: "2026-06-24",
      dateModified: "2026-06-24",
    }),
    createBreadcrumbSchema([
      { name: "Home", url: "/" },
      { name: "Budget Methodology", url: "/methodology" },
    ]),
  ];

  return (
    <main className="bg-[#f7f9fb] text-slate-950">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(jsonLd),
        }}
      />
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
          <Badge className="rounded-full bg-blue-100 px-4 py-1 text-blue-800">Methodology</Badge>
          <h1 className="mt-5 max-w-4xl text-4xl font-semibold tracking-tight sm:text-6xl">
            How TravelBudget.ai estimates travel budgets
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
            TravelBudget.ai combines flight baselines, destination-level daily costs, trip length, travelers,
            departure city, and travel style to create a planning estimate before you start comparing live prices.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild className="rounded-full bg-blue-600 px-6 text-white hover:bg-blue-700">
              <Link href="/results">Compare destinations</Link>
            </Button>
            <Button asChild variant="outline" className="rounded-full bg-white px-6">
              <Link href="/tools/travel-budget-calculator">Use the calculator</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-5 md:grid-cols-2">
          {costInputs.map((input) => {
            const Icon = input.icon;

            return (
              <article key={input.title} className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
                <Icon className="size-6 text-blue-700" />
                <h2 className="mt-4 text-xl font-semibold">{input.title}</h2>
                <p className="mt-3 text-sm leading-6 text-slate-600">{input.body}</p>
              </article>
            );
          })}
        </div>

        <section className="mt-10 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <CalendarClock className="size-7 text-blue-700" />
          <h2 className="mt-4 text-2xl font-semibold">What the estimate includes</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            A standard estimate includes round-trip flights, accommodation, food, local transport, activities,
            and miscellaneous spending for the selected number of travelers and days. The model adjusts daily
            costs by travel style: budget, balanced, or comfort.
          </p>
          <h2 className="mt-8 text-2xl font-semibold">Important limits</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            These are planning estimates, not live booking quotes. Final prices can change because of seasonality,
            exchange rates, holidays, route availability, baggage rules, accommodation taxes, resort fees, and how
            early you book. Always verify live flights, lodging, visa rules, insurance needs, and cancellation
            terms before paying.
          </p>
          <h2 className="mt-8 text-2xl font-semibold">Future data updates</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            The current dataset is intentionally transparent and directional. Future versions are designed to add
            live fare checks, richer lodging ranges, more origin cities, historical price movement, and clearer
            confidence scoring by destination and season.
          </p>
        </section>
      </section>
    </main>
  );
}
