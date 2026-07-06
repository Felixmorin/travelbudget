import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  Backpack,
  BadgeCheck,
  BarChart3,
  Bed,
  CalendarDays,
  Car,
  CheckCircle2,
  Clock,
  Diamond,
  Eye,
  Home,
  Hotel,
  Infinity,
  Landmark,
  Plane,
  PlaneTakeoff,
  RefreshCcw,
  ShieldCheck,
  Sparkles,
  Ticket,
  TrendingUp,
  Utensils,
  WalletCards,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { createMetadata } from "@/lib/seo/metadata";
import { createBreadcrumbSchema, createGuideArticleSchema, serializeJsonLd } from "@/lib/seo/schema";

export const metadata = createMetadata({
  title: "Budget Methodology",
  description:
    "Learn how TravelBudget.ai estimates trip budgets using flight, accommodation, daily food, local transport, activity, and safety-margin assumptions.",
  path: "/methodology",
});

const chips = [
  { label: "Flights", icon: Plane },
  { label: "Hotels", icon: Hotel },
  { label: "Food", icon: Utensils },
  { label: "Transport", icon: Car },
  { label: "Activities", icon: Ticket },
  { label: "Buffer", icon: ShieldCheck, featured: true },
];

const formulaItems = [
  { label: "Flights", icon: PlaneTakeoff },
  { label: "Stay", icon: Bed },
  { label: "Food", icon: Utensils },
  { label: "Local", icon: Car },
  { label: "Fun", icon: Sparkles },
  { label: "Buffer", icon: ShieldCheck, featured: true },
];

const costInputs = [
  {
    title: "Flights",
    icon: PlaneTakeoff,
    body:
      "Calculated from route-level flight baselines, origin city assumptions, season, and booking timing. The estimate includes realistic economy round-trip planning ranges.",
    sampleLabel: "Montreal to Lisbon avg.",
    sampleValue: "$780 - $1,050 CAD",
  },
  {
    title: "Accommodation",
    icon: Hotel,
    body:
      "Modeled per traveler per night by destination and travel style, from hostels and shared spaces to private hotels and premium stays.",
    sampleLabel: "Paris comfort hotel",
    sampleValue: "$220 CAD / night",
  },
  {
    title: "Food & dining",
    icon: Utensils,
    body:
      "Daily meal budgets cover practical breakfasts, casual meals, drinks, and sit-down dining when the selected style calls for it.",
    sampleLabel: "Tokyo casual meal",
    sampleValue: "$18 CAD / person",
  },
  {
    title: "Local transport",
    icon: Car,
    body:
      "Includes public transit, airport transfers, short rideshares, ferries, and city movement needed after arrival.",
    sampleLabel: "Lisbon weekly pass",
    sampleValue: "$45 CAD",
  },
  {
    title: "Activities",
    icon: Ticket,
    body:
      "Covers common paid attractions, museums, tours, day trips, and destination experiences without pretending every itinerary is identical.",
    sampleLabel: "Rome museum entry",
    sampleValue: "$32 CAD",
  },
  {
    title: "Safety buffer",
    icon: ShieldCheck,
    body:
      "Adds a practical margin for baggage, mobile data, city taxes, tips, laundry, and modest price movement before booking.",
    sampleLabel: "Recommended margin",
    sampleValue: "+10-15% applied",
    featured: true,
  },
];

const travelStyles = [
  {
    title: "Budget",
    subtitle: "The essentialist way to see the world.",
    icon: Backpack,
    points: ["Hostels or shared spaces", "Mostly public transit", "Street food and grocery runs"],
  },
  {
    title: "Balanced",
    subtitle: "The default balance of comfort and value.",
    icon: Home,
    points: ["Private 3-4 star lodging", "Transit plus occasional taxi", "Casual sit-down dining"],
    featured: true,
  },
  {
    title: "Comfort",
    subtitle: "More flexibility, fewer compromises.",
    icon: Diamond,
    points: ["Higher-rated hotels", "Transfers and rental cars when useful", "Premium meals and guided tours"],
  },
];

const calculationRows = [
  ["Flights, economy", "$980 CAD"],
  ["9 nights, private hotel", "$1,080 CAD"],
  ["Daily food, $65/day", "$650 CAD"],
  ["Transit and activities", "$340 CAD"],
  ["Safety buffer, 10%", "$305 CAD"],
];

const strengths = [
  "Capturing seasonal price swings and peak travel periods.",
  "Estimating practical daily food and local transport costs.",
  "Normalizing major origin cities into usable flight baselines.",
  "Accounting for common tourist taxes, tips, fees, and small surprises.",
];

const limits = [
  "Flash flight sales or sudden airline fuel surcharges.",
  "Currency movement between planning and booking.",
  "Personal shopping, nightlife, and luxury splurge habits.",
  "Last-minute booking premiums and event-week hotel spikes.",
];

const freshness = [
  { title: "Seasonality", body: "Weather, school breaks, holidays, and peak windows.", icon: CalendarDays },
  { title: "Booking timing", body: "Advance planning versus last-minute premiums.", icon: Clock },
  { title: "Local demand", body: "Events, festivals, and tourism pressure.", icon: TrendingUp },
  { title: "Currency", body: "CAD planning estimates and FX movement.", icon: RefreshCcw },
];

const comparisons = [
  {
    city: "Lisbon",
    total: "$2,140 CAD",
    image:
      "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?auto=format&fit=crop&w=900&q=80",
  },
  {
    city: "Mexico City",
    total: "$1,480 CAD",
    image:
      "https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?auto=format&fit=crop&w=900&q=80",
  },
  {
    city: "Paris",
    total: "$3,120 CAD",
    image:
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=900&q=80",
  },
];

const principles = [
  {
    title: "No fake precision",
    body:
      "We use ranges and rounded numbers because real travel prices move. A useful estimate beats a suspiciously exact one.",
    icon: WalletCards,
  },
  {
    title: "Full-trip thinking",
    body:
      "A flight is only the start. Airport snacks, local transfers, museum entries, and small fees all affect the real total.",
    icon: Infinity,
  },
  {
    title: "Clear assumptions",
    body:
      "Every estimate is tied to a travel style, length, origin, and traveler count so you can adjust the plan honestly.",
    icon: Eye,
  },
];

const faqs = [
  {
    question: "Are these budgets guaranteed?",
    answer:
      "No. They are planning estimates based on current assumptions and destination data, not live booking quotes or a financial guarantee.",
  },
  {
    question: "Does this include solo traveler costs?",
    answer:
      "Traveler count is part of the estimate, but solo travelers should still verify lodging live because single-room pricing can vary by city and season.",
  },
  {
    question: "Why include a safety buffer?",
    answer:
      "Most budget stress comes from small unplanned costs. A 10-15% margin gives the estimate enough room for taxes, tips, baggage, and price movement.",
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
      dateModified: "2026-06-25",
    }),
    createBreadcrumbSchema([
      { name: "Home", url: "/" },
      { name: "Budget Methodology", url: "/methodology" },
    ]),
  ];

  return (
    <main className="bg-[#f7f9fb] text-[#191c1e]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(jsonLd),
        }}
      />

      <section className="overflow-hidden bg-white">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-20">
          <div>
            <p className="text-sm font-semibold uppercase text-[#004ac6]">Methodology</p>
            <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-tight tracking-normal text-[#191c1e] sm:text-6xl">
              How TravelBudget.ai estimates your travel budget
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#434655]">
              We combine flight baselines, destination-level daily costs, trip length, travelers, departure city,
              and travel style to build a realistic planning estimate before you compare live booking prices.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild className="h-12 rounded-full bg-[#004ac6] px-6 text-white hover:bg-blue-700">
                <Link href="/tools/travel-budget-calculator">
                  Try the budget planner
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-12 rounded-full border-[#737686] bg-white px-6 text-[#004ac6] hover:bg-[#f2f4f6]"
              >
                <Link href="#included">See what is included</Link>
              </Button>
            </div>
            <div className="mt-8 flex flex-wrap gap-2">
              {chips.map((chip) => {
                const Icon = chip.icon;

                return (
                  <span
                    key={chip.label}
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${
                      chip.featured
                        ? "bg-[#6df5e1] text-[#005048]"
                        : "bg-[#eceef0] text-[#434655]"
                    }`}
                  >
                    <Icon className="size-4" />
                    {chip.label}
                  </span>
                );
              })}
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div className="relative z-10 rounded-[24px] border border-[#c3c6d7]/60 bg-white/75 p-8 shadow-[0_20px_40px_-10px_rgba(15,23,42,0.12)] backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-[#004ac6]">Travel Intelligence Report</span>
                <BarChart3 className="size-6 text-[#737686]" />
              </div>
              <div className="mt-8 space-y-4">
                <div className="h-3 w-3/4 rounded-full bg-[#e0e3e5]" />
                <div className="h-3 w-1/2 rounded-full bg-[#e0e3e5]" />
                <div className="flex h-36 items-center justify-center rounded-xl border border-[#004ac6]/20 bg-[#004ac6]/5">
                  <BarChart3 className="size-14 text-[#004ac6]" />
                </div>
                <div className="grid grid-cols-3 gap-3 pt-2">
                  <div className="rounded-xl bg-[#f2f4f6] p-3">
                    <p className="text-xs text-[#737686]">Range</p>
                    <p className="mt-1 text-sm font-semibold">$2.8k-$3.6k</p>
                  </div>
                  <div className="rounded-xl bg-[#f2f4f6] p-3">
                    <p className="text-xs text-[#737686]">Buffer</p>
                    <p className="mt-1 text-sm font-semibold">12%</p>
                  </div>
                  <div className="rounded-xl bg-[#f2f4f6] p-3">
                    <p className="text-xs text-[#737686]">Style</p>
                    <p className="mt-1 text-sm font-semibold">Balanced</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-8 -left-8 size-36 rounded-full bg-[#6df5e1]/35 blur-3xl" />
          </div>
        </div>
      </section>

      <section className="border-y border-[#c3c6d7]/40 bg-[#f7f9fb] py-16">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-semibold tracking-normal">The logic behind the numbers</h2>
          <p className="mt-3 text-[#434655]">Our formula accounts for fixed and variable costs in one trip total.</p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 text-center lg:flex-row">
            <div className="w-full rounded-xl border border-[#c3c6d7]/60 bg-white/75 p-6 shadow-sm backdrop-blur lg:w-auto">
              <span className="block text-sm font-medium text-[#737686]">Estimate</span>
              <span className="text-xl font-semibold">Total trip</span>
            </div>
            <span className="text-3xl text-[#737686]">=</span>
            <div className="flex flex-wrap justify-center gap-3">
              {formulaItems.map((item, index) => {
                const Icon = item.icon;

                return (
                  <div key={item.label} className="flex items-center gap-3">
                    {index > 0 ? <span className="text-xl text-[#737686]">+</span> : null}
                    <div
                      className={`rounded-xl border p-4 shadow-sm ${
                        item.featured
                          ? "border-[#6df5e1] bg-[#6df5e1]/20"
                          : "border-[#c3c6d7]/70 bg-white"
                      }`}
                    >
                      <Icon className={`mx-auto size-5 ${item.featured ? "text-[#006b5f]" : "text-[#004ac6]"}`} />
                      <p className="mt-1 text-xs font-semibold uppercase text-[#434655]">{item.label}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section id="included" className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {costInputs.map((input) => {
              const Icon = input.icon;

              return (
                <article
                  key={input.title}
                  className={`rounded-[24px] border p-6 transition hover:shadow-lg ${
                    input.featured
                      ? "border-[#6df5e1]/60 bg-[#6df5e1]/10"
                      : "border-[#c3c6d7]/50 bg-white"
                  }`}
                >
                  <div
                    className={`flex size-12 items-center justify-center rounded-xl ${
                      input.featured ? "bg-[#006b5f] text-white" : "bg-[#004ac6]/10 text-[#004ac6]"
                    }`}
                  >
                    <Icon className="size-6" />
                  </div>
                  <h3 className="mt-5 text-xl font-semibold">{input.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-[#434655]">{input.body}</p>
                  <div className="mt-5 rounded-lg border border-transparent bg-[#f7f9fb] p-3">
                    <span className="text-xs font-semibold uppercase text-[#737686]">{input.sampleLabel}</span>
                    <span className="mt-1 block text-sm font-semibold text-[#004ac6]">{input.sampleValue}</span>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-[#f2f4f6] py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-semibold tracking-normal">Choose your travel style</h2>
            <p className="mt-3 text-[#434655]">We do not give one number. We match the estimate to your comfort level.</p>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {travelStyles.map((style) => {
              const Icon = style.icon;

              return (
                <article
                  key={style.title}
                  className={`relative rounded-[24px] bg-white p-8 text-center shadow-sm ${
                    style.featured ? "border-2 border-[#004ac6] md:-translate-y-2" : "border border-[#c3c6d7]/50"
                  }`}
                >
                  {style.featured ? (
                    <span className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#004ac6] px-4 py-1 text-xs font-semibold text-white">
                      MOST POPULAR
                    </span>
                  ) : null}
                  <Icon className={`mx-auto size-12 ${style.featured ? "text-[#004ac6]" : "text-[#737686]"}`} />
                  <h3 className="mt-5 text-xl font-semibold">{style.title}</h3>
                  <p className="mt-2 text-sm text-[#434655]">{style.subtitle}</p>
                  <ul className="mt-6 space-y-3 text-left text-sm leading-6 text-[#434655]">
                    {style.points.map((point) => (
                      <li key={point} className="flex gap-2">
                        <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-[#004ac6]" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-[32px] bg-[#0f172a] text-white lg:flex">
            <div className="flex-1 p-8 sm:p-12">
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-full bg-[#004ac6]">
                  <Sparkles className="size-5" />
                </span>
                <span className="text-xl font-semibold">Example: real calculation</span>
              </div>
              <h2 className="mt-8 text-3xl font-semibold tracking-normal">10 days in Lisbon from Montreal</h2>
              <p className="mt-3 text-[#e0e3e5]">A balanced trip planned for mid-September for a solo traveler.</p>
              <div className="mt-8 space-y-4">
                {calculationRows.map(([label, value], index) => (
                  <div
                    key={label}
                    className={`flex justify-between gap-4 border-b border-white/10 pb-3 ${
                      index === calculationRows.length - 1 ? "text-[#6df5e1]" : ""
                    }`}
                  >
                    <span>{label}</span>
                    <span className="font-semibold">{value}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col items-center justify-center bg-[#004ac6] p-8 text-center lg:w-1/3">
              <span className="text-sm font-semibold uppercase tracking-[0.16em] text-white/75">
                Total estimated trip
              </span>
              <div className="mt-3 text-6xl font-bold tracking-normal">$3,355</div>
              <span className="mt-2 text-lg text-white/90">CAD all-in</span>
              <div className="mt-8 h-1 w-full overflow-hidden rounded-full bg-white/20">
                <div className="h-full w-2/3 bg-white" />
              </div>
              <p className="mt-4 text-sm text-white/70">Directional confidence: high</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#f7f9fb] py-16">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 md:grid-cols-2 lg:px-8">
          <article className="rounded-[24px] border border-[#6df5e1]/30 bg-white p-8 shadow-sm">
            <div className="flex items-center gap-3 text-[#006b5f]">
              <BadgeCheck className="size-6" />
              <h2 className="text-xl font-semibold">What TravelBudget.ai is good at</h2>
            </div>
            <ul className="mt-6 space-y-4 text-sm leading-6 text-[#434655]">
              {strengths.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="text-[#006b5f]">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </article>
          <article className="rounded-[24px] border border-red-200 bg-white p-8 shadow-sm">
            <div className="flex items-center gap-3 text-red-700">
              <AlertTriangle className="size-6" />
              <h2 className="text-xl font-semibold">What can change</h2>
            </div>
            <ul className="mt-6 space-y-4 text-sm leading-6 text-[#434655]">
              {limits.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="text-red-700">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </article>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-semibold tracking-normal">Real-time dynamics</h2>
          <p className="mt-3 text-[#434655]">Estimates are refreshed around these practical planning pillars.</p>
          <div className="mt-10 grid grid-cols-2 gap-6 lg:grid-cols-4">
            {freshness.map((item) => {
              const Icon = item.icon;

              return (
                <article key={item.title} className="text-center">
                  <div className="mx-auto flex size-16 items-center justify-center rounded-full border border-[#c3c6d7]/70 bg-[#f7f9fb]">
                    <Icon className="size-6 text-[#004ac6]" />
                  </div>
                  <h3 className="mt-4 text-sm font-semibold">{item.title}</h3>
                  <p className="mt-2 text-xs leading-5 text-[#434655]">{item.body}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-[#f2f4f6] py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-semibold tracking-normal">Comparing 7 days, balanced style</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {comparisons.map((item) => (
              <article
                key={item.city}
                className="rounded-[24px] border border-white/80 bg-white/75 p-6 shadow-sm backdrop-blur"
              >
                <div
                  className="h-36 rounded-xl bg-cover bg-center"
                  style={{ backgroundImage: `url(${item.image})` }}
                  role="img"
                  aria-label={`${item.city} travel destination`}
                />
                <h3 className="mt-5 text-xl font-semibold">{item.city}</h3>
                <div className="mt-3 flex justify-between gap-4 text-sm font-semibold text-[#004ac6]">
                  <span>Total trip</span>
                  <span>{item.total}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-[#c3c6d7]/30 bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-semibold tracking-normal">Our principles</h2>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {principles.map((item) => {
              const Icon = item.icon;

              return (
                <article key={item.title}>
                  <Icon className="mx-auto size-10 text-[#004ac6]" />
                  <h3 className="mt-4 text-xl font-semibold">{item.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-[#434655]">{item.body}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-[#f7f9fb] py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-semibold tracking-normal">Frequently asked questions</h2>
          <div className="mt-10 space-y-4">
            {faqs.map((faq) => (
              <details key={faq.question} className="rounded-2xl border border-[#c3c6d7]/40 bg-white p-5">
                <summary className="cursor-pointer text-lg font-semibold">{faq.question}</summary>
                <p className="mt-3 text-sm leading-6 text-[#434655]">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f7f9fb] px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[40px] bg-[#004ac6] p-8 text-center text-white sm:p-12">
          <Landmark className="mx-auto size-10 text-[#b4c5ff]" />
          <h2 className="mx-auto mt-5 max-w-3xl text-4xl font-bold tracking-normal">
            Ready to see where your budget can take you?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-[#dbe1ff]">
            Compare destinations with a clearer all-in planning number before you start booking.
          </p>
          <Button asChild className="mt-8 h-12 rounded-full bg-white px-7 text-[#004ac6] hover:bg-[#eef2ff]">
            <Link href="/results">Compare destinations</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
