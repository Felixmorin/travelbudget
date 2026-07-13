import Link from "next/link";
import {
  ArrowRight,
  BedDouble,
  Bus,
  Calculator,
  CalendarDays,
  CircleDollarSign,
  MapPinned,
  Plane,
  ShieldCheck,
  Ticket,
  Utensils,
} from "lucide-react";

import { TravelBudgetCalculator } from "@/components/tools/TravelBudgetCalculator";
import { EstimateDisclaimer } from "@/components/site/estimate-disclaimer";
import { Button } from "@/components/ui/button";
import {
  getDailyCostTotal,
  getDestinationTripEstimate,
  type TravelStyle,
} from "@/lib/data/destinations";
import { getCityCountryLabel, unifiedDestinations } from "@/lib/data/unified-destinations";
import { formatMoney } from "@/lib/format-money";
import { createMetadata } from "@/lib/seo/metadata";
import {
  createBreadcrumbSchema,
  createCollectionPageSchema,
  createFAQSchema,
  createItemListSchema,
  serializeJsonLd,
} from "@/lib/seo/schema";

const path = "/travel-budget";
const originCode = "YUL";
const currency = "CAD";

const faqItems = [
  {
    question: "What is a realistic travel budget?",
    answer:
      "A realistic travel budget includes round-trip flights, accommodation, food, local transportation, activities, insurance, baggage, mobile data, airport transfers, and an emergency buffer. GoByBudget estimates are planning baselines, not live prices or guarantees.",
  },
  {
    question: "How do I calculate my total travel budget?",
    answer:
      "Add fixed costs such as flights and insurance to daily costs multiplied by trip length and traveler count, then add a buffer for price changes, exchange rates, baggage, transfers, and unexpected costs.",
  },
  {
    question: "Does GoByBudget include flights in the travel budget?",
    answer:
      "Yes. GoByBudget estimates the full trip cost, including flights from the selected origin city plus accommodation, food, local transportation, activities, and a miscellaneous buffer.",
  },
  {
    question: "How much should I budget per day for travel?",
    answer:
      "Your daily budget should cover accommodation, meals, local transportation, activities, and small miscellaneous costs. The right amount changes by destination, travel style, season, and whether the trip is short or long.",
  },
  {
    question: "Can I travel internationally with a $1,000 budget?",
    answer:
      "Sometimes, but it usually requires a short trip, budget travel style, flexible dates, and a destination with lower airfare from your origin. Use the calculator to test exact origin, duration, and style before booking.",
  },
  {
    question: "Why does trip length change the budget so much?",
    answer:
      "Flights are usually a fixed trip cost, while accommodation, food, transport, activities, and buffer scale by day. Longer trips can lower average cost per day if the flight is expensive, but they still raise the total budget.",
  },
  {
    question: "Are the estimates live booking prices?",
    answer:
      "No. GoByBudget uses planning estimates in CAD based on the current project dataset. Actual fares, hotels, exchange rates, availability, baggage, and traveler choices can change the final cost.",
  },
];

const costCategories = [
  {
    icon: Plane,
    title: "Flights",
    copy:
      "Treat airfare as a fixed cost per traveler. A cheap flight can make a destination viable, but it should not hide high hotel or activity costs.",
  },
  {
    icon: BedDouble,
    title: "Accommodation",
    copy:
      "Lodging usually drives the daily budget. Compare neighborhood, room type, season, and whether the stay supports the trip you actually want.",
  },
  {
    icon: Utensils,
    title: "Food",
    copy:
      "Build a food plan with casual meals, markets, cafes, and a few intentional splurges instead of relying on one average meal price.",
  },
  {
    icon: Bus,
    title: "Local transportation",
    copy:
      "Include airport transfers, transit passes, rideshares, taxis, trains, fuel, parking, or ferries before assuming a destination is cheap.",
  },
  {
    icon: Ticket,
    title: "Activities",
    copy:
      "Add museums, tours, day trips, parks, shows, and major experiences. This category is easy to underestimate on short trips.",
  },
  {
    icon: ShieldCheck,
    title: "Insurance",
    copy:
      "Insurance is not always in destination datasets, so price it separately when coverage, cancellation risk, or medical exposure matters.",
  },
  {
    icon: CircleDollarSign,
    title: "Emergency buffer",
    copy:
      "Keep room for exchange-rate movement, baggage, card fees, mobile data, last-minute transfers, and one plan that costs more than expected.",
  },
];

const internalLinkGroups = [
  {
    title: "Tools",
    links: [
      {
        label: "Travel budget calculator",
        href: "/tools/travel-budget-calculator",
        description: "Build a custom estimate with your origin, trip length, budget, and travel style.",
      },
      {
        label: "Compare destinations",
        href: "/compare",
        description: "Compare two destinations by full trip cost instead of daily spend alone.",
      },
      {
        label: "Budget methodology",
        href: "/methodology",
        description: "See how GoByBudget estimates flights, daily costs, and planning limits.",
      },
    ],
  },
  {
    title: "Destination budgets",
    links: [
      {
        label: "Lisbon travel budget",
        href: "/destinations/lisbon/travel-budget",
        description: "A focused city budget page for a high-value Europe trip.",
      },
      {
        label: "Mexico City travel budget",
        href: "/destinations/mexico-city/travel-budget",
        description: "A food and culture budget guide with city-level estimates.",
      },
      {
        label: "Tokyo destination guide",
        href: "/destinations/tokyo",
        description: "A higher-budget city guide where flights and daily costs need careful planning.",
      },
    ],
  },
  {
    title: "Guides and comparisons",
    links: [
      {
        label: "Best destinations under 2500 CAD",
        href: "/guides/best-destinations-under-2500-cad",
        description: "See what a mid-range budget can realistically unlock from Canada.",
      },
      {
        label: "Portugal vs Spain travel budget",
        href: "/compare/portugal-vs-spain-travel-budget",
        description: "Compare two popular Europe options by total trip cost.",
      },
      {
        label: "Cheap places from Montreal",
        href: "/guides/cheap-places-to-travel-from-montreal",
        description: "Budget-first routing ideas from a Canadian origin city.",
      },
    ],
  },
];

const budgetScenarios = [
  { budget: 1000, days: 3, style: "budget" as const, label: "$1,000" },
  { budget: 2000, days: 7, style: "budget" as const, label: "$2,000" },
  { budget: 3000, days: 10, style: "midRange" as const, label: "$3,000" },
  { budget: 5000, days: 14, style: "midRange" as const, label: "$5,000" },
];

const durationScenarios = [
  { label: "Weekend", days: 3 },
  { label: "7 days", days: 7 },
  { label: "10 days", days: 10 },
  { label: "14 days", days: 14 },
];

export const metadata = createMetadata({
  title: "Travel Budget Calculator: Plan Your Trip by Budget",
  description:
    "Plan your travel budget with GoByBudget. Estimate flights, stays, food, local transport, activities, insurance, buffers, and destinations that fit.",
  path,
  socialDescription:
    "Use GoByBudget to plan a full travel budget, compare destination estimates, and find trips that may fit your budget.",
  robots: {
    index: true,
    follow: true,
  },
});

export default function TravelBudgetHubPage() {
  const budgetExamples = budgetScenarios.map((scenario) => ({
    ...scenario,
    matches: getBudgetMatches(scenario.budget, scenario.days, scenario.style),
  }));
  const durationExamples = durationScenarios.map((scenario) => ({
    ...scenario,
    match: getBestDurationMatch(scenario.days),
  }));
  const featuredDestinations = getBudgetMatches(3000, 10, "midRange").slice(0, 4);
  const jsonLd = [
    createBreadcrumbSchema([
      { name: "Home", url: "/" },
      { name: "Travel budget", url: path },
    ]),
    createCollectionPageSchema({
      name: "Travel Budget Calculator and Planning Hub",
      description:
        "A GoByBudget hub for planning full trip budgets, comparing destination estimates, and finding trips by budget.",
      path,
    }),
    createItemListSchema(
      internalLinkGroups.flatMap((group) =>
        group.links.map((link) => ({
          name: link.label,
          url: link.href,
          description: link.description,
        }))
      )
    ),
    createFAQSchema(faqItems),
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(jsonLd),
        }}
      />
      <main className="bg-[#f7f9fb] text-slate-950">
        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[1fr_420px] lg:items-center lg:px-8">
            <div>
              <nav className="mb-5 text-sm font-medium text-slate-500" aria-label="Breadcrumb">
                <Link href="/" className="hover:text-[#0B1D34]">
                  Home
                </Link>
                <span className="mx-2 text-slate-300">/</span>
                <span className="text-slate-900">Travel budget</span>
              </nav>
              <p className="inline-flex items-center gap-2 rounded-full border border-[#14B8A6]/20 bg-[#14B8A6]/10 px-4 py-2 text-sm font-semibold text-[#0B1D34]">
                <Calculator className="size-4" />
                Budget-first trip planning
              </p>
              <h1 className="mt-5 max-w-4xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-6xl">
                Travel Budget Calculator: Plan a Trip You Can Actually Afford
              </h1>
              <p className="mt-5 max-w-3xl text-base leading-8 text-slate-600 sm:text-lg">
                Build a travel budget by separating fixed costs from daily costs, then compare the total against
                destinations that fit your origin, trip length, travel style, and comfort level.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button asChild className="h-11 rounded-xl bg-[#0B1D34] px-5 text-white hover:bg-[#0B1D34]/90">
                  <Link href="#travel-budget-calculator">
                    Use the calculator
                    <ArrowRight className="ml-2 size-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" className="h-11 rounded-xl bg-white">
                  <Link href="#where-can-i-travel">Where can I travel?</Link>
                </Button>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-950 p-6 text-white shadow-sm">
              <p className="text-sm font-semibold text-[#38BDF8]">Simple total budget formula</p>
              <div className="mt-5 grid gap-3 text-sm leading-6 text-slate-300">
                <FormulaLine label="Fixed costs" value="flights + insurance + baggage + visas" />
                <FormulaLine label="Daily costs" value="(stay + food + transport + activities + misc) x days" />
                <FormulaLine label="Total budget" value="fixed costs + daily costs + emergency buffer" strong />
              </div>
              <p className="mt-5 text-sm leading-6 text-slate-300">
                GoByBudget estimates are shown in CAD and should be checked against live booking prices before purchase.
              </p>
            </div>
          </div>
        </section>

        <section id="travel-budget-calculator" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-8 grid gap-4 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-[#0B1D34]">Calculator</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
                Start with the GoByBudget calculator
              </h2>
            </div>
            <p className="text-sm leading-6 text-slate-600">
              Use the product directly on this hub, or open the dedicated{" "}
              <Link href="/tools/travel-budget-calculator" className="font-semibold text-[#0B1D34] hover:underline">
                travel budget calculator
              </Link>{" "}
              page if you want the full tool-focused experience.
            </p>
          </div>
          <TravelBudgetCalculator />
        </section>

        <section className="border-y border-slate-200 bg-white py-14 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-wide text-[#0B1D34]">Cost categories</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
                What to include in a travel budget
              </h2>
              <p className="mt-4 text-sm leading-6 text-slate-600">
                The useful number is the full trip cost, not one cheap fare or a generic daily average.
              </p>
            </div>
            <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {costCategories.map(({ icon: Icon, title, copy }) => (
                <article key={title} className="rounded-xl border border-slate-200 bg-[#fbfcfd] p-6">
                  <Icon className="size-6 text-[#0B1D34]" />
                  <h3 className="mt-4 text-lg font-semibold text-slate-950">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="where-can-i-travel" className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-[#0B1D34]">Where can I travel?</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
                Examples by total budget
              </h2>
              <p className="mt-4 text-sm leading-6 text-slate-600">
                These examples use GoByBudget planning data from Montreal (YUL), one traveler, and CAD estimates.
                They are not live prices.
              </p>
              <div className="mt-6">
                <EstimateDisclaimer />
              </div>
            </div>
            <div className="grid gap-5">
              {budgetExamples.map((scenario) => (
                <article key={scenario.label} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-slate-950">{scenario.label} travel budget</h3>
                      <p className="mt-1 text-sm text-slate-500">
                        {scenario.days} days, {formatTravelStyle(scenario.style)} style, from Montreal
                      </p>
                    </div>
                    <Link
                      href={`/results?budget=${scenario.budget}&currency=CAD&origin=YUL&days=${scenario.days}&month=october&travelers=1&style=${scenario.style === "budget" ? "budget" : "balanced"}`}
                      className="inline-flex items-center gap-2 text-sm font-semibold text-[#0B1D34] hover:underline"
                    >
                      Run this search
                      <ArrowRight className="size-4" />
                    </Link>
                  </div>
                  <div className="mt-5 grid gap-3 sm:grid-cols-3">
                    {scenario.matches.map((match) => (
                      <BudgetMatch key={`${scenario.label}-${match.slug}`} match={match} />
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-slate-200 bg-white py-14 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-[#0B1D34]">Daily planning</p>
                <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
                  How much should I budget per day?
                </h2>
                <p className="mt-4 text-sm leading-6 text-slate-600">
                  Daily budget should cover lodging, food, local transportation, activities, and miscellaneous spend.
                  Flights are usually better tracked separately, then spread across the trip when comparing cost per day.
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {durationExamples.map(({ label, days, match }) => (
                  <article key={label} className="rounded-xl border border-slate-200 bg-[#fbfcfd] p-5">
                    <div className="flex items-center gap-3">
                      <CalendarDays className="size-5 text-[#0B1D34]" />
                      <h3 className="font-semibold text-slate-950">{label}</h3>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-slate-600">
                      Example match:{" "}
                      <Link href={match.href} className="font-semibold text-[#0B1D34] hover:underline">
                        {match.name}
                      </Link>{" "}
                      at {formatMoney(match.total, currency)} total and about{" "}
                      {formatMoney(Math.round(match.total / days), currency)} per trip day.
                    </p>
                    <p className="mt-2 text-xs leading-5 text-slate-500">
                      Daily local estimate before flights: {formatMoney(match.dailyLocal, currency)} per day.
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-[#0B1D34]">Destination shortlist</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
                Best places to start comparing
              </h2>
              <p className="mt-4 text-sm leading-6 text-slate-600">
                A $3,000 CAD, 10-day mid-range search from Montreal surfaces a mix of city and country pages that
                are useful starting points for budget-first planning.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {featuredDestinations.map((match) => (
                <Link
                  key={match.slug}
                  href={match.href}
                  className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-[#14B8A6]/50 hover:shadow-md"
                >
                  <MapPinned className="size-5 text-[#0B1D34]" />
                  <h3 className="mt-3 font-semibold text-slate-950 group-hover:text-[#0B1D34]">{match.name}</h3>
                  <p className="mt-2 text-sm text-slate-600">
                    {formatMoney(match.total, currency)} estimated total for {match.days} days.
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-slate-200 bg-white py-14 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-wide text-[#0B1D34]">Internal planning hub</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
                Continue from the right page
              </h2>
            </div>
            <div className="mt-8 grid gap-6 lg:grid-cols-3">
              {internalLinkGroups.map((group) => (
                <section key={group.title} aria-labelledby={`${slugify(group.title)}-links`}>
                  <h3 id={`${slugify(group.title)}-links`} className="text-lg font-semibold text-slate-950">
                    {group.title}
                  </h3>
                  <div className="mt-4 grid gap-3">
                    {group.links.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="rounded-xl border border-slate-200 bg-[#fbfcfd] p-4 transition hover:border-[#14B8A6]/50"
                      >
                        <span className="font-semibold text-[#0B1D34]">{link.label}</span>
                        <span className="mt-1 block text-sm leading-6 text-slate-600">{link.description}</span>
                      </Link>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-4xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-wide text-[#0B1D34]">FAQ</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
              Travel budget calculator FAQ
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
        </section>

        <section className="bg-slate-950 px-4 py-14 text-white sm:px-6 sm:py-16 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-[#38BDF8]">Plan the next step</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight">Find destinations that fit your budget</h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
                Start with the full trip estimate, then compare destination pages, guides, and live booking prices
                before committing.
              </p>
            </div>
            <Button asChild className="h-11 rounded-xl bg-white px-5 text-[#0B1D34] hover:bg-white/90">
              <Link href="#travel-budget-calculator">
                Open the calculator
                <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
          </div>
        </section>
      </main>
    </>
  );
}

function FormulaLine({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className={`rounded-xl p-4 ${strong ? "bg-[#14B8A6]/15 text-white" : "bg-white/10"}`}>
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p>
      <p className={`mt-1 ${strong ? "text-base font-semibold text-white" : "text-sm text-slate-200"}`}>{value}</p>
    </div>
  );
}

function BudgetMatch({ match }: { match: BudgetMatchResult }) {
  return (
    <Link
      href={match.href}
      className="rounded-xl border border-slate-200 bg-slate-50 p-4 transition hover:border-[#14B8A6]/50 hover:bg-white"
    >
      <span className="block font-semibold text-slate-950">{match.name}</span>
      <span className="mt-1 block text-sm text-slate-600">{formatMoney(match.total, currency)} estimated total</span>
      <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-[#0B1D34]">
        {match.remaining >= 0 ? `${formatMoney(match.remaining, currency)} under` : `${formatMoney(Math.abs(match.remaining), currency)} over`}
        <ArrowRight className="size-3" />
      </span>
    </Link>
  );
}

type BudgetMatchResult = {
  slug: string;
  name: string;
  href: string;
  total: number;
  remaining: number;
  days: number;
};

function getBudgetMatches(budget: number, days: number, style: TravelStyle): BudgetMatchResult[] {
  return unifiedDestinations
    .map((destination) => {
      const total = getDestinationTripEstimate(destination, {
        days,
        originCode,
        travelStyle: style,
        travelers: 1,
      });

      return {
        slug: destination.slug,
        name: getCityCountryLabel(destination),
        href: `/destinations/${destination.slug}`,
        total,
        remaining: budget - total,
        days,
      };
    })
    .filter((match) => match.total <= budget * 1.08)
    .sort((a, b) => Math.abs(a.remaining) - Math.abs(b.remaining) || a.total - b.total)
    .slice(0, 3);
}

function getBestDurationMatch(days: number) {
  const budget = 3000;
  const style: TravelStyle = "midRange";
  const match = unifiedDestinations
    .map((destination) => {
      const total = getDestinationTripEstimate(destination, {
        days,
        originCode,
        travelStyle: style,
        travelers: 1,
      });

      return {
        slug: destination.slug,
        name: getCityCountryLabel(destination),
        href: `/destinations/${destination.slug}`,
        total,
        dailyLocal: getDailyCostTotal(destination, style),
      };
    })
    .filter((item) => item.total <= budget)
    .sort((a, b) => b.total - a.total)[0];

  if (match) {
    return match;
  }

  const fallback = unifiedDestinations
    .map((destination) => ({
      slug: destination.slug,
      name: getCityCountryLabel(destination),
      href: `/destinations/${destination.slug}`,
      total: getDestinationTripEstimate(destination, {
        days,
        originCode,
        travelStyle: "budget",
        travelers: 1,
      }),
      dailyLocal: getDailyCostTotal(destination, "budget"),
    }))
    .sort((a, b) => a.total - b.total)[0];

  return fallback;
}

function formatTravelStyle(style: TravelStyle) {
  if (style === "midRange") {
    return "mid-range";
  }

  return style;
}

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}
