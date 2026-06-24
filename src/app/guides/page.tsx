import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeDollarSign,
  Calculator,
  ChevronDown,
  CircleDollarSign,
  Compass,
  CreditCard,
  Hotel,
  Map,
  PlaneTakeoff,
  ReceiptText,
  Search,
  TrendingUp,
  Utensils,
  WalletCards,
} from "lucide-react";

import { NewsletterForm } from "@/components/analytics/newsletter-form";
import { TrackedLink } from "@/components/analytics/tracked-link";
import { Button } from "@/components/ui/button";
import { createMetadata } from "@/lib/seo/metadata";

export const metadata = createMetadata({
  title: "Travel Guides Library",
  description:
    "Explore TravelBudget.ai guides for destination costs, daily travel budgets, flight savings, travel rewards, and smarter trip planning.",
  path: "/guides",
});

const featuredGuides = [
  {
    title: "How to plan a trip budget from scratch",
    description: "A step-by-step masterclass on tracking expenses before you even book.",
    label: "Essential",
    labelClass: "bg-[#004ac6] text-white",
    image:
      "https://images.unsplash.com/photo-1483058712412-4245e9b90334?auto=format&fit=crop&w=1200&q=85",
    alt: "Minimal workspace with a laptop, notebook, and travel planning materials",
  },
  {
    title: "Cheapest months to travel internationally",
    description: "Seasonal price patterns for timing long-haul flights with fewer surprises.",
    label: "Money Saving",
    labelClass: "bg-[#006b5f] text-white",
    image:
      "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1200&q=85",
    alt: "Airplane wing above clouds at sunset",
  },
  {
    title: "Maximizing luxury on a mid-range budget",
    description: "The affordable luxury blueprint for destinations where your money goes further.",
    label: "AI Insights",
    labelClass: "bg-[#b54e00] text-white",
    image:
      "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1200&q=85",
    alt: "Infinity pool overlooking a bright skyline",
  },
];

const categories = [
  { title: "Budget Planning", icon: CircleDollarSign, color: "text-[#004ac6]", bg: "bg-[#dbe1ff]" },
  { title: "Destination Guides", icon: Map, color: "text-[#006b5f]", bg: "bg-[#d9fbf4]" },
  { title: "Flight Savings", icon: PlaneTakeoff, color: "text-[#8e3c00]", bg: "bg-[#ffdbca]" },
  { title: "Travel Rewards", icon: CreditCard, color: "text-[#2563eb]", bg: "bg-blue-50" },
];

const dailyGuides = [
  {
    place: "Japan",
    title: "The Ultimate Japan Budget Guide",
    description: "How to experience Tokyo and Kyoto without breaking the bank.",
    spend: "$85 - $150",
    food: "$30/day",
    hotel: "$60/night",
    image:
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=85",
    alt: "Japanese temple beside cherry blossoms",
  },
  {
    place: "Italy",
    title: "Italy costs by region",
    description: "Compare Rome, Florence, Naples, Sicily, and the Amalfi Coast.",
    spend: "$95 - $185",
    food: "$42/day",
    hotel: "$88/night",
    image:
      "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=85",
    alt: "Colorful Italian coastal town above blue water",
  },
  {
    place: "Mexico",
    title: "Mexico for every travel style",
    description: "Street food, beach towns, city stays, and realistic daily budgets.",
    spend: "$55 - $130",
    food: "$24/day",
    hotel: "$52/night",
    image:
      "https://images.unsplash.com/photo-1518638150340-f706e86654de?auto=format&fit=crop&w=1200&q=85",
    alt: "Bright Mexican city street with colorful buildings",
  },
];

const destinations = [
  {
    name: "Morocco",
    meta: "Avg. $62/day - Budget Friendly",
    image:
      "https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?auto=format&fit=crop&w=1000&q=85",
    alt: "Colorful Moroccan market with lamps and textiles",
  },
  {
    name: "Singapore",
    meta: "Avg. $185/day - High End",
    image:
      "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=1000&q=85",
    alt: "Singapore skyline and bay at night",
  },
  {
    name: "Portugal",
    meta: "Avg. $95/day - Mid Range",
    image:
      "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?auto=format&fit=crop&w=1000&q=85",
    alt: "Lisbon street with yellow tram",
  },
  {
    name: "Switzerland",
    meta: "Avg. $240/day - Ultra Luxury",
    image:
      "https://images.unsplash.com/photo-1502784444187-359ac186c5bb?auto=format&fit=crop&w=1000&q=85",
    alt: "Swiss Alps valley with mountain peaks",
  },
];

const learningItems = [
  {
    title: "Expense Tracking 101",
    description: "A low-friction method for logging daily costs without turning the trip into admin work.",
    icon: ReceiptText,
  },
  {
    title: "The 50/30/20 Travel Rule",
    description: "A personal finance framework adapted for consistent yearly travel planning.",
    icon: WalletCards,
  },
  {
    title: "AI Budget Forecasting",
    description: "Use TravelBudget.ai to account for seasonal pricing, inflation, and currency shifts.",
    icon: TrendingUp,
  },
];

const faqs = [
  {
    question: "How accurate are your budget estimates?",
    answer:
      "We combine destination benchmarks, common booking ranges, seasonal patterns, and traveler-style assumptions. Each guide uses ranges so budget, mid-range, and luxury trips stay realistic.",
  },
  {
    question: "Is TravelBudget.ai free to use?",
    answer:
      "The public guide library and basic planning tools are free. Advanced forecasting and saved planning workflows can be layered into premium features later.",
  },
  {
    question: "Can I export my trip budget?",
    answer:
      "Yes. The product direction supports exports to shareable plans, spreadsheets, and printable itineraries once saved trips are connected.",
  },
];

export default function GuidesPage() {
  return (
    <main className="bg-[#f7f9fb] text-[#191c1e]">
      <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top_right,#dbe1ff_0%,#f7f9fb_58%)] px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl text-center">
          <p className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/70 px-4 py-2 text-sm font-semibold text-[#004ac6] shadow-sm backdrop-blur">
            <Compass className="size-4" />
            Travel guides library
          </p>
          <h1 className="mx-auto max-w-4xl text-4xl font-semibold leading-tight text-slate-950 sm:text-5xl lg:text-6xl">
            Travel guides to plan smarter trips on any budget
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-[#434655]">
            Unlock expert strategies, local cost breakdowns, and budget-first financial planning for your next adventure.
          </p>
          <div className="mx-auto mt-10 flex max-w-2xl items-center rounded-full border border-white/70 bg-white/75 p-2 shadow-xl shadow-slate-200/70 backdrop-blur-xl">
            <Search className="ml-4 size-5 shrink-0 text-[#004ac6]" />
            <input
              className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm outline-none placeholder:text-slate-400"
              placeholder="Where do you want to go? e.g. Kyoto Budget"
              type="search"
            />
            <Button className="hidden h-12 rounded-full bg-gradient-to-r from-[#2563eb] to-[#7c3aed] px-6 text-white hover:opacity-90 sm:inline-flex">
              Search Guides
            </Button>
          </div>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild variant="outline" className="h-12 rounded-xl border-[#c3c6d7] bg-white px-6">
              <TrackedLink
                href="#featured"
                eventName="guide_clicked"
                eventProperties={{
                  page: "/guides",
                  guideTitle: "Explore guides",
                  href: "#featured",
                }}
              >
                Explore guides
                <ArrowRight className="size-4" />
              </TrackedLink>
            </Button>
            <Button asChild className="h-12 rounded-xl bg-[#6df5e1] px-6 text-[#006f64] hover:bg-[#4fdbc8]">
              <TrackedLink
                href="/tools/travel-budget-calculator"
                eventName="cta_clicked"
                eventProperties={{
                  page: "/guides",
                  label: "Calculate your travel budget",
                  href: "/tools/travel-budget-calculator",
                  ctaLocation: "guides_hero",
                }}
              >
                <Calculator className="size-4" />
                Calculate your travel budget
              </TrackedLink>
            </Button>
          </div>
        </div>
      </section>

      <section id="featured" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-semibold text-slate-950">Featured Insights</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {featuredGuides.map((guide) => (
            <article key={guide.title} className="group">
              <div className="relative mb-4 h-64 overflow-hidden rounded-xl">
                <Image src={guide.image} alt={guide.alt} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover transition duration-500 group-hover:scale-105" />
                <span className={`absolute left-4 top-4 rounded-full px-3 py-1 text-[10px] font-bold uppercase ${guide.labelClass}`}>
                  {guide.label}
                </span>
              </div>
              <h3 className="text-xl font-semibold text-slate-950 transition group-hover:text-[#004ac6]">{guide.title}</h3>
              <p className="mt-2 text-base leading-7 text-[#434655]">{guide.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-[#f2f4f6] px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-semibold text-slate-950">Browse by Category</h2>
          <p className="mt-2 text-[#434655]">Everything you need to master your travel finances.</p>
          <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <Link
                  key={category.title}
                  href="/tools"
                  className="flex flex-col items-center rounded-xl border border-white/70 bg-white/70 p-6 text-center shadow-sm backdrop-blur transition hover:-translate-y-1 hover:shadow-md"
                >
                  <span className={`mb-4 flex size-12 items-center justify-center rounded-full ${category.bg} ${category.color}`}>
                    <Icon className="size-5" />
                  </span>
                  <span className="text-sm font-semibold text-slate-900">{category.title}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-3xl font-semibold text-slate-950">Popular Daily Spend Guides</h2>
            <p className="mt-2 text-[#434655]">Real cost data for world-class destinations.</p>
          </div>
          <Link href="/results" className="inline-flex items-center gap-1 text-sm font-semibold text-[#004ac6] hover:underline">
            View all data <TrendingUp className="size-4" />
          </Link>
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {dailyGuides.map((guide) => (
            <article key={guide.place} className="overflow-hidden rounded-xl border border-[#c3c6d7]/45 bg-white shadow-sm transition hover:shadow-md">
              <div className="relative h-48">
                <Image src={guide.image} alt={guide.alt} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover" />
                <span className="absolute bottom-3 left-3 rounded bg-black/65 px-2 py-1 text-xs text-white backdrop-blur">
                  Daily Spend: {guide.spend}
                </span>
              </div>
              <div className="p-5">
                <h3 className="text-xl font-semibold text-slate-950">{guide.title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#434655]">{guide.description}</p>
                <div className="mt-5 flex justify-between border-t border-[#c3c6d7]/35 pt-4 text-xs font-semibold text-[#434655]">
                  <span className="inline-flex items-center gap-1">
                    <Utensils className="size-4" /> {guide.food}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Hotel className="size-4" /> {guide.hotel}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-slate-950 px-4 py-16 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div>
              <h2 className="text-3xl font-semibold">Destination Hub</h2>
              <p className="mt-2 text-slate-400">Find your next trip based on your financial comfort zone.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              {["All Regions", "Europe", "Asia", "Americas", "Africa"].map((region, index) => (
                <button
                  key={region}
                  className={`rounded-full px-4 py-2 text-sm font-semibold ${
                    index === 0 ? "bg-white text-slate-950" : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                  }`}
                >
                  {region}
                </button>
              ))}
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {destinations.map((destination) => (
              <article key={destination.name} className="group relative aspect-[3/4] overflow-hidden rounded-xl">
                <Image src={destination.image} alt={destination.alt} fill sizes="(min-width: 1024px) 25vw, 100vw" className="object-cover transition duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/25 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <h3 className="text-xl font-semibold">{destination.name}</h3>
                  <p className="mt-1 text-xs text-slate-300">{destination.meta}</p>
                  <Button className="mt-4 h-10 w-full rounded-lg border border-white/20 bg-white/10 text-xs text-white backdrop-blur hover:bg-[#004ac6]">
                    View Budget Profile
                  </Button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8">
        <div>
          <p className="text-sm font-semibold uppercase text-[#004ac6]">Education</p>
          <h2 className="mt-3 text-3xl font-semibold text-slate-950">Learn how to plan like a pro</h2>
          <div className="mt-8 space-y-6">
            {learningItems.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="group flex gap-4">
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-[#eceef0] text-slate-800 transition group-hover:bg-[#004ac6] group-hover:text-white">
                    <Icon className="size-5" />
                  </span>
                  <div>
                    <h3 className="text-xl font-semibold text-slate-950">{item.title}</h3>
                    <p className="mt-1 leading-7 text-[#434655]">{item.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="relative">
          <div className="relative aspect-square overflow-hidden rounded-3xl shadow-2xl">
            <Image
              src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=85"
              alt="Traveler reviewing a financial dashboard on a tablet"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="mx-auto -mt-10 max-w-sm rounded-2xl border border-white/70 bg-white/80 p-6 shadow-xl backdrop-blur md:absolute md:-bottom-6 md:-left-6 md:mt-0">
            <p className="text-lg font-semibold text-slate-950">Planned my 2-month Europe trip down to the cent. No surprises.</p>
            <p className="mt-2 text-sm text-[#434655]">Alex R., Premium User</p>
          </div>
        </div>
      </section>

      <section className="bg-[#eceef0] px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl text-center">
          <h2 className="text-3xl font-semibold text-slate-950">Budget Head-to-Head</h2>
          <p className="mt-3 text-[#434655]">Compare costs between top trip rivals before you book.</p>
          <div className="mx-auto mt-8 grid max-w-4xl gap-6 md:grid-cols-2">
            {["Portugal vs Spain", "Japan vs South Korea"].map((comparison) => (
              <article key={comparison} className="flex flex-col items-center rounded-2xl border border-[#c3c6d7]/40 bg-white p-8 shadow-sm">
                <BadgeDollarSign className="size-10 text-[#004ac6]" />
                <h3 className="mt-4 text-xl font-semibold text-slate-950">{comparison}</h3>
                <p className="mt-2 text-sm leading-6 text-[#434655]">
                  A detailed breakdown of transport, food, stay costs, and overall travel value.
                </p>
                <TrackedLink
                  href="/compare"
                  eventName="guide_clicked"
                  eventProperties={{
                    page: "/guides",
                    guideTitle: comparison,
                    guideCategory: "comparison",
                    href: "/compare",
                  }}
                  className="mt-6 text-sm font-bold text-[#004ac6] hover:underline"
                >
                  Read Comparison
                </TrackedLink>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-3xl bg-gradient-to-r from-[#2563eb] to-[#7c3aed] p-8 text-center text-white sm:p-12">
          <h2 className="text-3xl font-semibold">The Weekly Budgeter</h2>
          <p className="mx-auto mt-4 max-w-xl text-lg leading-8 text-white/85">
            Join travelers receiving cost alerts and money-saving ideas every Tuesday.
          </p>
          <NewsletterForm />
          <p className="mt-5 text-xs font-semibold uppercase text-white/65">No spam. Only high-value data.</p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-center text-3xl font-semibold text-slate-950">Frequently Asked Questions</h2>
        <div className="mt-8 space-y-4">
          {faqs.map((faq, index) => (
            <details key={faq.question} className="group overflow-hidden rounded-xl border border-[#c3c6d7]/40 bg-white" open={index === 0}>
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-6">
                <span className="text-lg font-semibold text-slate-950">{faq.question}</span>
                <ChevronDown className="size-5 shrink-0 transition group-open:rotate-180" />
              </summary>
              <p className="px-6 pb-6 leading-7 text-[#434655]">{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="px-4 py-20 text-center sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-4xl font-semibold leading-tight text-slate-950">Ready to plan a trip that fits your budget?</h2>
          <p className="mt-5 text-lg leading-8 text-[#434655]">
            Stop guessing and start planning with a travel financial platform built around real budgets.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild className="h-12 rounded-full bg-[#004ac6] px-8 text-white hover:bg-blue-700">
              <TrackedLink
                href="/"
                eventName="cta_clicked"
                eventProperties={{
                  page: "/guides",
                  label: "Start Planning for Free",
                  href: "/",
                  ctaLocation: "guides_bottom_cta",
                }}
              >
                Start Planning for Free
              </TrackedLink>
            </Button>
            <Button asChild variant="outline" className="h-12 rounded-full border-[#004ac6] px-8 text-[#004ac6]">
              <TrackedLink
                href="/tools"
                eventName="cta_clicked"
                eventProperties={{
                  page: "/guides",
                  label: "View Tools",
                  href: "/tools",
                  ctaLocation: "guides_bottom_cta",
                }}
              >
                View Tools
              </TrackedLink>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
