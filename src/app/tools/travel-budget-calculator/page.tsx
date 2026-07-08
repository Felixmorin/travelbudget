import { AnalyticsView } from "@/components/analytics/analytics-view";
import { TravelBudgetCalculator } from "@/components/tools/TravelBudgetCalculator";
import { CTASection } from "@/components/site/cta-section";
import { createMetadata } from "@/lib/seo/metadata";
import { createFAQSchema, createTravelToolSchema, serializeJsonLd } from "@/lib/seo/schema";

const path = "/tools/travel-budget-calculator";

const faqItems = [
  {
    question: "What is a travel budget calculator?",
    answer:
      "A travel budget calculator estimates the total cost of a trip by combining major expenses such as flights, accommodation, food, activities, transportation, insurance, and a buffer for unexpected costs.",
  },
  {
    question: "How accurate is this trip budget calculator?",
    answer:
      "The calculator gives a planning estimate based on the numbers you enter. It is most accurate when you use current flight prices, realistic hotel rates, and daily spending estimates for your destination.",
  },
  {
    question: "Should flights be entered per person or total?",
    answer:
      "Enter the flight cost per traveler. The calculator multiplies that amount by the number of travelers so the total stays easy to compare across solo trips, couples, families, and groups.",
  },
  {
    question: "How much extra buffer should I add to a vacation budget?",
    answer:
      "A 10% to 20% buffer is useful for most vacations. Consider a higher buffer for expensive destinations, longer trips, multiple currencies, peak travel dates, or flexible itineraries.",
  },
  {
    question: "What costs are easy to forget when planning travel?",
    answer:
      "Common forgotten costs include airport transfers, local transit, baggage fees, resort fees, tourist taxes, tips, mobile data, visas, travel insurance, and paid activities booked after arrival.",
  },
  {
    question: "Can I use this calculator for international travel?",
    answer:
      "Yes. Use the same currency for every field, convert destination prices before entering them, and include an extra buffer if exchange rates or card fees may change your final cost.",
  },
];

export const metadata = createMetadata({
  title: "Travel Budget Calculator | Plan Your Trip Costs",
  description:
    "Estimate your travel budget based on destination, trip length, flights, accommodation, food, activities, and daily spending.",
  path,
  robots: {
    index: true,
    follow: true,
  },
});

export default function TravelBudgetCalculatorPage() {
  const jsonLd = [createTravelToolSchema(), createFAQSchema(faqItems)];

  return (
    <>
      <AnalyticsView
        eventName="calculator_started"
        eventProperties={{
          page: path,
          source: "calculator_page_view",
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(jsonLd),
        }}
      />
      <main className="bg-slate-50">
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-[#0B1D34]">Free travel tool</p>
              <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
                Travel Budget Calculator
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                Estimate the total cost of your trip before you book. Adjust flights, hotels, food, activities,
                transport, insurance, and a planning buffer to see a realistic travel budget instantly.
              </p>
            </div>
            <div className="rounded-xl border border-[#14B8A6]/20 bg-white p-5 shadow-sm">
              <p className="text-sm font-semibold text-slate-950">Plan with cleaner numbers</p>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Use one currency for every field, enter flights and insurance per traveler, and keep accommodation as
                the nightly room cost for the group.
              </p>
            </div>
          </div>
          <div className="mt-10">
            <TravelBudgetCalculator />
          </div>
        </section>

        <section className="bg-white py-14 sm:py-16">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">Travel budget guide</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
                How to calculate your travel budget
              </h2>
              <p className="mt-4 text-sm leading-6 text-slate-500">
                A reliable travel budget starts with fixed costs, then adds daily costs and a reserve for surprises.
                This makes it easier to compare destinations, trip lengths, and comfort levels before committing.
              </p>
            </div>
            <div className="grid gap-6">
              <article>
                <h3 className="text-lg font-semibold text-slate-950">Start with the big fixed expenses</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Flights, accommodation, travel insurance, visas, and pre-booked transfers usually define the baseline
                  cost of a trip. Price these first because they change the total more than small daily choices.
                </p>
              </article>
              <article>
                <h3 className="text-lg font-semibold text-slate-950">Add daily destination spending</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Multiply food, local transportation, tours, attractions, and casual spending by your trip length and
                  number of travelers. For longer trips, separate must-do activities from optional extras.
                </p>
              </article>
              <article>
                <h3 className="text-lg font-semibold text-slate-950">Include a buffer before you decide</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  A buffer protects your vacation budget from currency swings, weather changes, baggage fees, last-minute
                  taxis, tips, and activities you choose after arrival.
                </p>
              </article>
            </div>
          </div>
        </section>

        <section className="py-14 sm:py-16">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
            <article className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
                What should be included in a travel budget?
              </h2>
              <p className="mt-4 text-sm leading-6 text-slate-600">
                Include transportation to the destination, accommodation, meals, activities, local transit, travel
                insurance, visas, baggage, resort or city taxes, mobile data, tips, and emergency money. For group trips,
                decide which costs are per person and which are shared.
              </p>
            </article>
            <article className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
                How much should you budget per day for travel?
              </h2>
              <p className="mt-4 text-sm leading-6 text-slate-600">
                Daily travel budgets vary by destination and travel style. A budget traveler might plan around $50 to
                $120 per person per day, a mid-range traveler might plan $120 to $280, and luxury trips often exceed
                that before flights.
              </p>
            </article>
            <article className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
                Tips to reduce your travel costs
              </h2>
              <p className="mt-4 text-sm leading-6 text-slate-600">
                Travel outside peak dates, compare nearby airports, stay longer in fewer places, choose accommodation
                with breakfast or a kitchen, book key activities early, use public transit, and keep one flexible day for
                low-cost exploring.
              </p>
            </article>
          </div>
        </section>

        <section className="bg-white py-14 sm:py-16">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <p className="text-sm font-semibold uppercase tracking-wide text-[#0B1D34]">FAQ</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
                Travel Budget Calculator FAQ
              </h2>
            </div>
            <div className="mt-8 divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white">
              {faqItems.map((item) => (
                <details key={item.question} className="group p-5 open:bg-slate-50">
                  <summary className="cursor-pointer list-none text-base font-semibold text-slate-950">
                    {item.question}
                  </summary>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{item.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>
      <CTASection />
    </>
  );
}
