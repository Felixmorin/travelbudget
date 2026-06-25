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
      "We use round-trip economy flight planning baselines by origin city. Current destination estimates include Montreal, Toronto, and Vancouver, with additional supported origins normalized to the closest available baseline when needed.",
  },
  {
    title: "Accommodation",
    icon: Hotel,
    body:
      "Accommodation is modeled per traveler per night inside each destination's daily cost profile. Budget, balanced, and comfort styles use different lodging assumptions instead of one universal hotel price.",
  },
  {
    title: "Meals",
    icon: Utensils,
    body:
      "Food estimates cover practical daily meals. Budget mode assumes simple local meals, balanced mode assumes a mix of casual restaurants and quick meals, and comfort mode assumes more flexible dining.",
  },
  {
    title: "Local transport",
    icon: Calculator,
    body:
      "Local movement includes public transit, rideshares, short transfers, ferries, and similar ground transport needed to make an itinerary workable after arrival.",
  },
  {
    title: "Activities",
    icon: CircleDollarSign,
    body:
      "Activity costs cover ordinary paid attractions, tours, museums, day trips, and destination experiences. Major special activities, permits, and private tours still need separate verification.",
  },
  {
    title: "Safety margin",
    icon: ShieldCheck,
    body:
      "A miscellaneous line is included for small surprises such as baggage, mobile data, city taxes, tips, laundry, and modest price movement between planning and booking.",
  },
];

const assumptions = [
  {
    label: "Travelers",
    value:
      "Flights and daily costs scale by traveler count. Shared-room savings and family-room pricing are not automatically assumed, so group trips should still verify lodging live.",
  },
  {
    label: "Trip length",
    value:
      "Daily costs multiply by the selected number of days. The model does not infer a detailed itinerary, so expensive transfer days or multi-city hops can move the total.",
  },
  {
    label: "Season",
    value:
      "Best-month signals affect recommendation score, not a guaranteed discount. Holidays, festivals, school breaks, and peak weather windows can override normal seasonal value.",
  },
  {
    label: "Currency",
    value:
      "Destination inputs are maintained in CAD planning estimates, then converted to supported display currencies. Exchange-rate movement can change real booking cost.",
  },
  {
    label: "Error range",
    value:
      "Treat totals as directional planning numbers. A practical margin is plus or minus 15-25%, and more for destinations with low data confidence, fast-moving fares, or peak-season lodging.",
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
            The result is a decision aid, not a live quote or booking guarantee.
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
          <div className="mt-8 grid gap-4">
            {assumptions.map((assumption) => (
              <div key={assumption.label} className="border-t border-slate-200 pt-4">
                <h3 className="text-base font-semibold">{assumption.label}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{assumption.value}</p>
              </div>
            ))}
          </div>
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
