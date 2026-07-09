import { AnalyticsView } from "@/components/analytics/analytics-view";
import { TravelBudgetCalculator } from "@/components/tools/TravelBudgetCalculator";
import { CTASection } from "@/components/site/cta-section";
import { createMetadata } from "@/lib/seo/metadata";
import { createFAQSchema, createTravelToolSchema, serializeJsonLd } from "@/lib/seo/schema";

const path = "/tools/travel-budget-calculator";

const faqItems = [
  {
    question: "Is this a flight price calculator?",
    answer:
      "No. It estimates the full trip budget, including flights and daily travel costs.",
  },
  {
    question: "Are the prices exact?",
    answer:
      "No. Prices are estimates and can change based on season, availability, destination, and booking timing.",
  },
  {
    question: "Can I use this for a family trip?",
    answer:
      "Yes. Choose the family-friendly travel style or constraint to get better matches.",
  },
  {
    question: "What costs are included?",
    answer:
      "Flights, stays, food, local transport, activities, and a safety buffer.",
  },
];

export const metadata = createMetadata({
  title: "Trip Budget Test | Find Destinations for Your Budget",
  description:
    "Answer a few questions and discover travel destinations that may fit your budget, departure city, trip length, timing, and travel style.",
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
          <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div>
              <p className="inline-flex rounded-full border border-[#14B8A6]/20 bg-white px-3 py-1 text-sm font-semibold text-[#0B1D34] shadow-sm">
                Free travel budget test
              </p>
              <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
                Take the Trip Budget Test
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                Find out where you can travel based on your real budget, trip length, departure city, and travel
                style.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
                <a
                  href="#trip-budget-test"
                  className="inline-flex h-11 items-center justify-center rounded-xl bg-[#0B1D34] px-5 text-sm font-semibold text-white transition hover:bg-[#0B1D34]/90"
                >
                  Start the test
                </a>
                <p className="text-sm leading-6 text-slate-500">
                  Estimates include flights, stays, food, local transport, activities, and a safety buffer.
                </p>
              </div>
            </div>
            <div className="rounded-2xl border border-[#14B8A6]/20 bg-white p-5 shadow-sm">
              <p className="text-sm font-semibold text-teal-700">Example result</p>
              <div className="mt-4 rounded-xl bg-slate-950 p-5 text-white">
                <p className="text-2xl font-semibold tracking-tight">Montreal to Lisbon</p>
                <p className="mt-2 text-sm text-slate-300">10 days - Comfort - $2,500 CAD</p>
                <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full w-[93%] rounded-full bg-[#14B8A6]" />
                </div>
                <p className="mt-3 text-sm font-semibold text-[#38BDF8]">Budget fit: 93%</p>
              </div>
              <p className="mt-4 text-sm leading-6 text-slate-500">
                The test ranks destinations by budget fit, trip length, travel style, timing, and important constraints.
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
              <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">Travel budget test</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
                How the travel budget test works
              </h2>
              <p className="mt-4 text-sm leading-6 text-slate-500">
                The Travel Budget Test estimates what destinations may fit your budget by combining your departure
                city, total budget, trip length, travel style, and timing. Each estimate includes major trip costs such
                as flights, accommodation, food, local transportation, activities, and a small buffer.
              </p>
            </div>
            <div className="grid gap-6">
              <article>
                <h3 className="text-lg font-semibold text-slate-950">Budget first, destination second</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Instead of starting with one destination, the test uses your total budget to surface places where the
                  full trip may make sense.
                </p>
              </article>
              <article>
                <h3 className="text-lg font-semibold text-slate-950">Scored against your travel style</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Budget, comfort, premium, backpacking, and family-friendly trips all change the estimate and the
                  destination ranking.
                </p>
              </article>
              <article>
                <h3 className="text-lg font-semibold text-slate-950">Transparent planning estimates</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Prices are estimates and vary by season, availability, and booking timing. Use matches as a planning
                  shortlist before checking live prices.
                </p>
              </article>
            </div>
          </div>
        </section>

        <section className="bg-white py-14 sm:py-16">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <p className="text-sm font-semibold uppercase tracking-wide text-[#0B1D34]">FAQ</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
                Trip Budget Test FAQ
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
