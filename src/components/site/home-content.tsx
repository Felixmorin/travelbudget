import {
  ArrowRight,
  BarChart3,
  Bed,
  CalendarDays,
  MapPinned,
  Plane,
  Search,
  Ticket,
  Utensils,
  Wallet,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { EmailCaptureForm } from "@/components/analytics/email-capture-form";
import { SearchCard } from "@/components/site/search-card";
import { getPopularDepartureCities } from "@/lib/data/departure-cities";
import type { FAQItem } from "@/lib/seo/schema";

const heroLinks = [
  ["Trips under $1,000 CAD", "Montreal budget ideas", "/from/montreal/trips-under-1000"],
  ["Where to travel with $2,000", "Budget destination shortlist", "/where-can-i-travel-with-2000"],
  ["Compare travel costs", "Portugal vs Spain", "/compare/portugal-vs-spain"],
  ["Use the travel budget calculator", "Build your estimate", "/travel-budget-calculator"],
];

const escapeCards = [
  {
    city: "Lisbon",
    country: "Portugal",
    href: "/destinations/lisbon",
    price: "$2,320 CAD",
    tagline: "Coastal city break with food, views, and strong value.",
    image:
      "https://images.unsplash.com/photo-1585208798174-6cedd86e019a?auto=format&fit=crop&w=900&q=85",
  },
  {
    city: "Mexico City",
    country: "Mexico",
    href: "/destinations/mexico-city",
    price: "$1,950 CAD",
    tagline: "Culture, museums, markets, and a flexible daily spend.",
    image:
      "https://images.unsplash.com/photo-1585464231875-d9ef1f5ad396?auto=format&fit=crop&w=900&q=85",
  },
  {
    city: "Paris",
    country: "France",
    href: "/destinations/paris",
    price: "$2,480 CAD",
    tagline: "Classic Europe with the full trip cost kept visible.",
    image:
      "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=900&q=85",
  },
  {
    city: "Bangkok",
    country: "Thailand",
    href: "/destinations/bangkok",
    price: "$2,150 CAD",
    tagline: "Long-haul value with generous food and activity room.",
    image:
      "https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=900&q=85",
  },
];

const budgetSignals = [
  [Plane, "Flights", "Round-trip estimates from your selected departure city."],
  [Bed, "Stays", "Accommodation assumptions matched to your travel style."],
  [Utensils, "Daily spend", "Food, local transport, and practical in-city costs."],
  [Ticket, "Activities", "Sightseeing, tickets, and experience buffers."],
];

const insiderStories = [
  {
    title: "Where $2,500 CAD feels comfortable",
    copy: "Compare complete trip totals before choosing between Europe, Mexico, and Asia.",
    href: "/where-can-i-travel-with-2000",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=85",
  },
  {
    title: "Portugal vs Spain for budget travelers",
    copy: "See where flights, stays, and daily costs change the real answer.",
    href: "/compare/portugal-vs-spain",
    image:
      "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=900&q=85",
  },
  {
    title: "Mexico vs Colombia warm-weather value",
    copy: "A practical comparison for food, culture, activities, and total spend.",
    href: "/compare/mexico-vs-colombia",
    image:
      "https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?auto=format&fit=crop&w=900&q=85",
  },
];

const budgetPages = [
  ["Trips under $1,000 CAD", "Closer escapes and short city breaks with tighter flight and stay assumptions.", "/budget/1000"],
  ["Trips under $2,000 CAD", "Affordable international options where daily costs can keep the total realistic.", "/budget/2000"],
  ["Trips under $3,000 CAD", "Longer trips and stronger comfort levels across Europe, Mexico, and Asia.", "/budget/3000"],
  ["Trips under $5,000 CAD", "Higher-comfort itineraries, long-haul routes, and more flexible trip lengths.", "/budget/5000"],
];

const focusTrips = [
  ["Lisbon", "10 days", "$2,320 CAD", "Flights, stays, food, transport, activities", "/destinations/lisbon/travel-budget"],
  ["Mexico City", "10 days", "$1,950 CAD", "Best mix of culture and daily value", "/destinations/mexico-city/travel-budget"],
  ["Paris", "10 days", "$2,480 CAD", "Tighter budget, still possible with planning", "/destinations/paris"],
  ["Bangkok", "14 days", "$2,150 CAD", "Longer stay with lower daily costs", "/itineraries/10-days-in-bangkok-budget"],
  ["Rome", "7 days", "$2,100 CAD", "Short Europe trip with clear tradeoffs", "/itineraries/10-days-in-rome-budget"],
];

const popularDepartureCities = getPopularDepartureCities(7);

export function HomeContent({ faqs }: { faqs: FAQItem[] }) {
  return (
    <main className="bg-white text-[#191c1e]">
      <section className="border-b border-[#d9dde4] bg-[#fbfcfd] px-4 pb-12 pt-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-4xl font-extrabold leading-tight tracking-normal text-slate-950 sm:text-5xl lg:text-6xl">
              Find where you can travel with your budget
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-[#434655] sm:text-lg">
              Enter your total trip budget, departure city, trip length, number of travelers, and travel style.
              GoByBudget compares realistic destination estimates for flights, stays, food, local transport, and
              activities before you start booking.
            </p>
          </div>

          <div className="mx-auto mt-9 max-w-4xl">
            <SearchCard />
          </div>

          <p className="mx-auto mt-5 max-w-3xl text-center text-sm leading-6 text-[#434655]">
            Start with the amount you can actually spend, then compare destinations by total estimated trip cost instead
            of checking flights, hotels, and daily expenses in separate tabs.
          </p>

          <div className="mx-auto mt-5 grid max-w-4xl gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {heroLinks.map(([label, detail, href]) => (
              <Link
                key={href}
                href={href}
                className="group flex min-h-20 items-center justify-between gap-3 rounded-xl border border-[#c3c6d7]/55 bg-white px-4 py-3 text-left transition hover:border-[#14B8A6]/60 hover:shadow-sm"
              >
                <span>
                  <span className="block text-sm font-bold text-slate-950">{label}</span>
                  <span className="mt-1 block text-xs font-semibold leading-5 text-[#434655]">{detail}</span>
                </span>
                <ArrowRight className="size-4 shrink-0 text-[#0B1D34] transition group-hover:translate-x-1" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Destinations by budget"
            title="Handpicked destinations with realistic total trip estimates"
            copy="These examples show how one budget can work differently across destinations. Each estimate is framed around a total trip cost, not just a cheap flight or a low nightly hotel rate."
          />
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {escapeCards.map((destination) => (
              <Link
                key={destination.city}
                href={destination.href}
                className="group overflow-hidden rounded-xl border border-[#c3c6d7]/45 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-950/10"
              >
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={destination.image}
                    alt={`${destination.city}, ${destination.country} travel budget estimate`}
                    width={900}
                    height={650}
                    sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw"
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/80 to-transparent p-4 text-white">
                    <p className="text-xs font-bold uppercase tracking-wide text-white/75">{destination.country}</p>
                    <h3 className="mt-1 text-2xl font-bold">{destination.city}</h3>
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-lg font-extrabold text-[#0B1D34]">from {destination.price}</p>
                  <p className="mt-2 text-sm leading-6 text-[#434655]">{destination.tagline}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f7f9fb] px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Transparent estimates"
            title="Every result shows what is included"
            copy="Flights, stays, food, local movement, activities, travel style, duration, and currency are kept in one planning view so the cheapest destination is not a guess."
          />
          <div className="mt-8 grid gap-4 md:grid-cols-4">
            {budgetSignals.map(([Icon, title, copy]) => (
              <article key={title as string} className="rounded-xl border border-[#d9dde4] bg-white p-6 shadow-sm">
                <Icon className="mb-5 size-8 text-[#0B1D34]" />
                <h3 className="text-xl font-semibold text-slate-950">{title as string}</h3>
                <p className="mt-2 text-sm leading-6 text-[#434655]">{copy as string}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Travel cost comparisons"
            title="Compare travel costs before choosing a destination"
            copy="Use comparison pages and budget guides to understand where flights, stays, daily costs, and activities change the final trip total."
          />
          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            {insiderStories.map((story) => (
              <Link key={story.href} href={story.href} className="group block overflow-hidden rounded-xl border border-[#d9dde4] bg-white shadow-sm transition hover:shadow-lg">
                <div className="relative h-56 overflow-hidden">
                  <Image
                    src={story.image}
                    alt={story.title}
                    width={900}
                    height={560}
                    sizes="(min-width: 1024px) 33vw, 100vw"
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-semibold tracking-tight text-slate-950">{story.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-[#434655]">{story.copy}</p>
                  <span className="mt-5 inline-flex items-center gap-2 font-bold text-[#0B1D34]">
                    Compare trip costs
                    <ArrowRight className="size-4 transition group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-[#d9dde4] bg-white px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Trips in focus"
            title="Popular trip cost examples"
            copy="Start with complete trip estimates that include flights, stays, food, local transport, and activities, then open the full travel budget page for more detail."
          />
          <div className="mt-8 overflow-hidden rounded-xl border border-[#d9dde4]">
            {focusTrips.map(([destination, days, price, note, href], index) => (
              <Link
                key={destination}
                href={href}
                className={`grid gap-3 bg-white p-5 transition hover:bg-[#14B8A6]/5 md:grid-cols-[1fr_0.7fr_0.8fr_1.5fr_auto] md:items-center ${
                  index === 0 ? "" : "border-t border-[#d9dde4]"
                }`}
              >
                <span className="text-lg font-bold text-slate-950">{destination}</span>
                <span className="text-sm font-semibold text-[#434655]">{days}</span>
                <span className="font-extrabold text-[#0B1D34]">{price}</span>
                <span className="text-sm leading-6 text-[#434655]">{note}</span>
                <ArrowRight className="size-4 text-[#0B1D34]" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f7f9fb] px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Places to start from"
            title="Start from your real departure city"
            copy="Flight assumptions change the answer. Compare travel budget ideas from Montreal, Toronto, Vancouver, Calgary, Ottawa, Quebec City, and Edmonton."
          />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {popularDepartureCities.map((city) => (
              <Link
                key={city.slug}
                href={`/from/${city.slug}`}
                className="rounded-xl border border-[#c3c6d7]/45 bg-white p-5 transition hover:border-[#14B8A6]/40 hover:bg-[#14B8A6]/5"
              >
                <p className="text-xs font-bold uppercase tracking-wide text-slate-500">{city.country}</p>
                <h3 className="mt-1 text-xl font-semibold text-slate-950">{city.name}</h3>
                <p className="mt-2 text-sm text-[#434655]">{city.airportCodes.join(", ")}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <div>
            <p className="mb-3 text-sm font-bold uppercase tracking-wide text-[#0B1D34]">How it works</p>
            <h2 className="text-3xl font-semibold tracking-tight text-slate-950">
              How GoByBudget works
            </h2>
            <p className="mt-4 text-base leading-7 text-[#434655]">
              Start with your total budget, choose your departure city, set your trip length and travel style, then
              compare destinations using the same cost categories. Each estimate combines flights, stays, food, local
              transportation, and activities so you can shortlist places before checking live prices.
            </p>
            <Link
              href="/travel-budget-calculator"
              className="mt-5 inline-flex items-center gap-2 font-bold text-[#0B1D34]"
            >
              Calculate your total trip cost
              <ArrowRight className="size-4" />
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <Step icon={<Wallet className="size-6" />} title="Set budget" copy="Start with the full amount you can spend." />
            <Step icon={<MapPinned className="size-6" />} title="Pick origin" copy="Use your real departure city or airport." />
            <Step icon={<BarChart3 className="size-6" />} title="Compare" copy="Scan complete trip estimates side by side." />
          </div>
        </div>
      </section>

      <section className="bg-[#f7f9fb] px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Budget ranges"
            title="Browse destinations by fixed trip budget"
            copy="Use budget pages when you want a fast shortlist for a specific amount, then refine by origin, duration, currency, and comfort level."
          />
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {budgetPages.map(([title, copy, href]) => (
              <Link
                key={href}
                href={href}
                className="group rounded-xl border border-[#c3c6d7]/45 bg-white p-5 transition hover:border-[#14B8A6]/40 hover:bg-[#14B8A6]/5"
              >
                <h3 className="text-xl font-semibold text-slate-950">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-[#434655]">{copy}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#0B1D34]">
                  Browse this budget
                  <ArrowRight className="size-4 transition group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-center">
          <div>
            <p className="mb-3 text-sm font-bold uppercase tracking-wide text-[#0B1D34]">Methodology</p>
            <h2 className="text-3xl font-semibold tracking-tight text-slate-950">
              How we estimate realistic trip costs
            </h2>
            <p className="mt-4 text-base leading-7 text-[#434655]">
              GoByBudget estimates are planning ranges, not live quotes. We combine destination cost assumptions,
              origin-specific flight ranges, accommodation levels, food, local transportation, activities, trip duration,
              currency, and comfort level to create a realistic total trip cost.
            </p>
            <p className="mt-4 text-base leading-7 text-[#434655]">
              Prices can change before booking, so use GoByBudget to shortlist destinations and verify live flight and
              hotel prices with travel partners before you buy. GoByBudget may earn from partner links at no extra cost
              to you.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/methodology"
                className="inline-flex items-center gap-2 rounded-lg bg-[#0B1D34] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#14B8A6]"
              >
                See how estimates are calculated
                <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/affiliate-disclosure"
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-5 py-3 text-sm font-bold text-[#0B1D34] transition hover:border-[#14B8A6]/50"
              >
                How affiliate links work
              </Link>
            </div>
          </div>
          <div className="rounded-xl border border-[#d9dde4] bg-white p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-slate-950">Example cost categories</h3>
            <dl className="mt-5 grid gap-3">
              {[
                ["Round-trip flights", "$840 CAD"],
                ["Stays", "$920 CAD"],
                ["Food and local transport", "$410 CAD"],
                ["Activities", "$150 CAD"],
                ["Estimated total", "$2,320 CAD"],
              ].map(([label, value]) => (
                <div key={label} className="flex items-center justify-between gap-4 rounded-xl bg-slate-50 px-4 py-3">
                  <dt className="text-sm font-medium text-[#434655]">{label}</dt>
                  <dd className="text-sm font-extrabold text-[#0B1D34]">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <section className="bg-[#f7f9fb] px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-6 rounded-xl border border-[#d9dde4] bg-white p-6 shadow-sm lg:grid-cols-[1fr_0.95fr] lg:items-center lg:p-8">
          <div>
            <p className="mb-3 text-sm font-bold uppercase tracking-wide text-[#0B1D34]">Trip ideas by email</p>
            <h2 className="text-3xl font-semibold tracking-tight text-slate-950">
              Get realistic trip ideas for your budget
            </h2>
            <p className="mt-3 text-base leading-7 text-[#434655]">
              Receive destination ideas, budget examples, and new comparison guides based on realistic total trip costs.
            </p>
          </div>
          <EmailCaptureForm
            buttonLabel="Send me budget trip ideas"
            inputLabel="Email for budget trip ideas"
            placeholder="you@example.com"
            eventProperties={{
              page: "/",
              source: "homepage_budget_ideas",
              ctaLocation: "homepage_email_capture",
              label: "Send me budget trip ideas",
            }}
          />
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8">
        <h2 className="mb-8 text-center text-3xl font-semibold tracking-tight">Travel budget FAQ</h2>
        <div className="space-y-4">
          {faqs.map(({ question, answer }) => (
            <details key={question} className="group rounded-xl border border-[#c3c6d7]/40 bg-white p-6 open:ring-1 open:ring-[#0B1D34]">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold">
                {question}
                <ArrowRight className="size-5 shrink-0 rotate-90 transition group-open:-rotate-90" />
              </summary>
              <p className="mt-4 leading-7 text-[#434655]">{answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="bg-[#0B1D34] px-4 py-16 text-center text-white sm:px-6 lg:px-8">
        <p className="mx-auto mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-bold text-white">
          <CalendarDays className="size-4 text-orange-300" />
          Ready to compare?
        </p>
        <h2 className="mx-auto mb-8 max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">
          Discover destinations your budget can actually support
        </h2>
        <Link
          href="/results?budget=2500&currency=CAD&origin=YUL&days=10&month=october&travelers=2&style=balanced"
          className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-10 py-5 text-lg font-semibold text-white shadow-xl transition hover:bg-orange-600 active:scale-95"
        >
          <Search className="size-5" />
          Find destinations within my budget
        </Link>
      </section>
    </main>
  );
}

function SectionHeading({ eyebrow, title, copy }: { eyebrow: string; title: string; copy: string }) {
  return (
    <div className="max-w-3xl">
      <p className="mb-3 text-sm font-bold uppercase tracking-wide text-[#0B1D34]">{eyebrow}</p>
      <h2 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">{title}</h2>
      <p className="mt-3 text-base leading-7 text-[#434655]">{copy}</p>
    </div>
  );
}

function Step({ icon, title, copy }: { icon: React.ReactNode; title: string; copy: string }) {
  return (
    <article className="rounded-xl border border-[#d9dde4] bg-white p-5 shadow-sm">
      <span className="mb-4 flex size-11 items-center justify-center rounded-xl bg-[#14B8A6]/10 text-[#0B1D34]">
        {icon}
      </span>
      <h3 className="text-lg font-semibold text-slate-950">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-[#434655]">{copy}</p>
    </article>
  );
}
