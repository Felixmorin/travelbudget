import {
  ArrowRight,
  BarChart3,
  Bed,
  CheckCircle2,
  CircleX,
  Diamond,
  Gauge,
  MapPinned,
  Plane,
  Search,
  ShieldCheck,
  Ticket,
  Utensils,
  Wallet,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { SearchCard } from "@/components/site/search-card";
import { getPopularDepartureCities } from "@/lib/data/departure-cities";

const matches = [
  {
    city: "Lisbon",
    country: "Portugal",
    href: "/destinations/lisbon",
    price: "$2,320",
    variance: "-$180 Under Budget",
    image:
      "https://images.unsplash.com/photo-1548707309-dcebeab9ea9b?auto=format&fit=crop&w=320&q=80",
  },
  {
    city: "Mexico City",
    country: "Mexico",
    href: "/destinations/mexico-city",
    price: "$1,950",
    variance: "-$550 Under Budget",
    image:
      "https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?auto=format&fit=crop&w=320&q=80",
  },
  {
    city: "Paris",
    country: "France",
    href: "/destinations/paris",
    price: "$2,480",
    variance: "-$20 Under Budget",
    image:
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=320&q=80",
  },
];

const destinationCards = [
  {
    city: "Lisbon, Portugal",
    href: "/destinations/lisbon",
    price: "$2,320 total",
    image:
      "https://images.unsplash.com/photo-1585208798174-6cedd86e019a?auto=format&fit=crop&w=900&q=85",
    costs: [
      ["Flights", "$840", Plane],
      ["Hotel", "$920", Bed],
      ["Food", "$410", Utensils],
      ["Activities", "$150", Ticket],
    ],
    tags: ["Best for: Nightlife", "History"],
  },
  {
    city: "Mexico City, Mexico",
    href: "/destinations/mexico-city",
    price: "$1,950 total",
    image:
      "https://images.unsplash.com/photo-1585464231875-d9ef1f5ad396?auto=format&fit=crop&w=900&q=85",
    costs: [
      ["Flights", "$550", Plane],
      ["Hotel", "$780", Bed],
      ["Food", "$420", Utensils],
      ["Activities", "$200", Ticket],
    ],
    tags: ["Best for: Foodies", "Culture"],
  },
  {
    city: "Paris, France",
    href: "/destinations/paris",
    price: "$2,480 total",
    image:
      "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=900&q=85",
    costs: [
      ["Flights", "$980", Plane],
      ["Hotel", "$850", Bed],
      ["Food", "$450", Utensils],
      ["Activities", "$200", Ticket],
    ],
    tags: ["Best for: Romance", "Art"],
  },
];

const popularDepartureCities = getPopularDepartureCities(7);

const popularTrips = [
  ["Long Haul", "Montreal to Tokyo", "Under $4,000", "/destinations/tokyo"],
  ["European Escape", "Montreal to Barcelona", "Under $2,200", "/destinations/barcelona"],
  ["Tropical Getaway", "Montreal to Bali", "Under $2,800", "/destinations/bali"],
  ["City Break", "Montreal to New York", "Under $1,200", "/destinations/new-york"],
];

const proofPoints = [
  [MapPinned, "Data-backed discovery", "Compare countries, cities, and guides in one budget-first search."],
  [BarChart3, "Full trip totals", "See flights, lodging, food, transit, and activities together."],
  [Gauge, "Fast shortlists", "Move from a rough budget to realistic destination options in seconds."],
];

const methodology = [
  [Plane, "Flights", "Origin-specific fare estimates from the current planning dataset for major Canadian departure cities."],
  [Bed, "Accommodation", "Hotel, hostel, and rental assumptions tailored to your selected travel style."],
  [Utensils, "Daily Costs", "Realistic food, transit, and local spend estimates for each destination."],
  [Ticket, "Activities", "Entrance fees and tour costs based on your preferences and destination profile."],
];

const travelStyles = [
  [Wallet, "Budget", "Hostels, local street food, and free walking tours. Maximum adventure for minimum spend.", "$40 - $70 / day"],
  [Bed, "Comfort", "Private boutique hotels, sit-down dinners, and curated tours. The sweet spot of travel.", "$120 - $180 / day"],
  [Diamond, "Higher comfort", "Higher-rated stays, more private transport, and more flexibility in daily spending.", "$250+ / day"],
];

const faqs = [
  [
    "How accurate are the budget estimates?",
    "Estimates are updated regularly from flight, accommodation, and traveler cost signals. Prices can fluctuate, but budgets are designed to stay close to realistic trip totals.",
  ],
  [
    "Does the budget include my flight home?",
    "Yes. The search accounts for round-trip flights from your departure city and calculates the total cost from departure to return.",
  ],
  [
    'What is included in "Food & Activities"?',
    "It includes meals, local transport, and entry fees for popular attractions based on the travel style you choose.",
  ],
];

export function HomeContent() {
  return (
    <main className="bg-white text-[#191c1e]">
      <section className="bg-white px-4 pb-16 pt-20 sm:px-6 lg:px-8 lg:pb-20 lg:pt-28">
        <div className="mx-auto max-w-7xl text-center">
          <h1 className="mx-auto max-w-5xl text-5xl font-extrabold leading-tight tracking-normal text-slate-950 sm:text-6xl lg:text-7xl">
            Find trips that fit your budget
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-[#434655] sm:text-lg">
            Search by total trip budget, departure city, duration, and travelers. GoByBudget compares flights, stays,
            food, transport, and activities in one estimate.
          </p>

          <div className="mt-10">
            <SearchCard />
          </div>

          <div className="mx-auto mt-8 grid max-w-3xl gap-3 text-sm font-semibold text-[#434655] sm:grid-cols-3">
            <span className="inline-flex items-center justify-center gap-2">
              <Plane className="size-4 text-orange-500" />
              Flights included
            </span>
            <span className="inline-flex items-center justify-center gap-2">
              <Bed className="size-4 text-orange-500" />
              Full trip totals
            </span>
            <span className="inline-flex items-center justify-center gap-2">
              <ShieldCheck className="size-4 text-orange-500" />
              Transparent estimates
            </span>
          </div>
        </div>
      </section>

      <section className="border-b border-[#d9dde4] bg-white px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-3">
          {proofPoints.map(([Icon, title, copy]) => (
            <article key={title as string} className="flex gap-4 rounded-xl border border-[#d9dde4] bg-[#fbfcfd] p-5">
              <Icon className="mt-1 size-6 shrink-0 text-[#0B1D34]" />
              <div>
                <h2 className="font-semibold text-slate-950">{title as string}</h2>
                <p className="mt-1 text-sm leading-6 text-[#434655]">{copy as string}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="destinations" className="bg-[#f7f9fb] px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
            <div>
              <p className="mb-3 text-sm font-bold uppercase tracking-wide text-[#0B1D34]">Sample results</p>
              <h2 className="text-3xl font-semibold tracking-tight text-slate-950">
              With $2,500 CAD from Montreal, you could visit:
              </h2>
              <p className="mt-3 text-lg text-[#434655]">Planning estimates calculated for Comfort travel style.</p>
            </div>
            <Link href="/results?budget=2500&currency=CAD&origin=YUL&days=10&month=october&travelers=2&style=balanced" className="inline-flex items-center gap-2 font-bold text-[#0B1D34] transition hover:text-[#14B8A6]">
              Run this search
              <ArrowRight className="size-5" />
            </Link>
          </div>
          <div className="mb-8 grid gap-4 lg:grid-cols-3">
            {matches.map((match) => (
              <Link
                key={match.city}
                href={match.href}
                className="group flex items-center gap-4 rounded-xl border border-[#c3c6d7]/45 bg-white p-4 shadow-sm transition hover:border-[#14B8A6]/50 hover:shadow-lg"
              >
                <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg">
                  <Image
                    src={match.image}
                    alt={`${match.city}, ${match.country} budget match thumbnail`}
                    width={128}
                    height={128}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-slate-950">{match.city}</h3>
                  <p className="text-sm text-slate-500">{match.country} - 10 days</p>
                </div>
                <div className="shrink-0 text-right">
                  <div className="text-lg font-bold text-[#0B1D34]">{match.price}</div>
                  <div className="text-[10px] font-bold uppercase text-emerald-600">{match.variance}</div>
                </div>
              </Link>
            ))}
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {destinationCards.map((destination) => (
              <Link
                key={destination.city}
                href={destination.href}
                className="group overflow-hidden rounded-xl border border-[#c3c6d7]/45 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-950/10"
              >
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={destination.image}
                    alt={`${destination.city} cost breakdown preview`}
                    width={900}
                    height={600}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                  />
                  <div className="absolute right-4 top-4 rounded-lg border border-white/50 bg-white/85 px-4 py-2 font-bold text-[#0B1D34] backdrop-blur">
                    {destination.price}
                  </div>
                </div>
                <div className="p-7">
                  <h3 className="mb-6 text-2xl font-semibold tracking-tight">{destination.city}</h3>
                  <div className="mb-8 space-y-4">
                    {destination.costs.map(([label, amount, Icon]) => (
                      <div key={label as string} className="flex items-center justify-between text-base">
                        <span className="flex items-center gap-2 text-slate-500">
                          <Icon className="size-5 text-[#0B1D34]" />
                          {label as string}
                        </span>
                        <span className="font-bold">{amount as string}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2 border-t border-[#c3c6d7] pt-6">
                    {destination.tags.map((tag) => (
                      <span key={tag} className="rounded-md bg-[#14B8A6]/10 px-3 py-1 text-xs font-bold uppercase text-[#0B1D34]">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight text-slate-950">Popular budget trips from Montreal</h2>
            <p className="mt-3 text-[#434655]">Top searched routes and curated budget experiences.</p>
          </div>
          <Link href="/destinations" className="inline-flex items-center gap-2 font-bold text-[#0B1D34] transition hover:gap-3">
            Explore all destinations
            <ArrowRight className="size-5" />
          </Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {popularTrips.map(([category, route, budget, href]) => (
            <Link
              key={route}
              href={href}
              className="group block rounded-xl border border-[#c3c6d7]/40 bg-white p-7 transition hover:border-[#14B8A6]/40 hover:shadow-lg"
            >
              <div className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-500">{category}</div>
              <h3 className="mb-2 text-xl font-semibold transition group-hover:text-[#0B1D34]">{route}</h3>
              <p className="font-bold text-[#0B1D34]">{budget}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-y border-[#d9dde4] bg-white px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight text-slate-950">Popular departure cities</h2>
              <p className="mt-3 text-[#434655]">Start with your real airport set before comparing destinations.</p>
            </div>
            <Link href="/travel-budget-calculator" className="inline-flex items-center gap-2 font-bold text-[#0B1D34] transition hover:gap-3">
              Open calculator
              <ArrowRight className="size-5" />
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {popularDepartureCities.map((city) => (
              <Link
                key={city.slug}
                href={`/from/${city.slug}`}
                className="rounded-xl border border-[#c3c6d7]/45 bg-[#f7f9fb] p-5 transition hover:border-[#14B8A6]/40 hover:bg-[#14B8A6]/5"
              >
                <p className="text-xs font-bold uppercase tracking-wide text-slate-500">{city.country}</p>
                <h3 className="mt-1 text-xl font-semibold text-slate-950">{city.name}</h3>
                <p className="mt-2 text-sm text-[#434655]">{city.airportCodes.join(", ")}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="methodology" className="bg-slate-950 px-4 py-16 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 max-w-2xl">
            <h2 className="text-3xl font-semibold tracking-tight">How we estimate your travel budget</h2>
            <p className="mt-4 text-lg leading-8 text-slate-400">
              Our planning model combines curated destination costs, origin-specific flight estimates, and travel
              style assumptions to keep your budget realistic, not just average.
            </p>
          </div>
          <div className="mb-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {methodology.map(([Icon, title, copy]) => (
              <article key={title as string} className="rounded-xl border border-white/10 bg-white/5 p-7">
                <Icon className="mb-6 size-10 text-[#38BDF8]" />
                <h3 className="mb-3 text-xl font-semibold">{title as string}</h3>
                <p className="leading-7 text-slate-400">{copy as string}</p>
              </article>
            ))}
          </div>
          <div className="flex justify-center">
            <a href="/methodology" className="rounded-full border border-white/20 px-8 py-4 font-bold transition hover:bg-white/5">
              See our full budget methodology
            </a>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="mb-12 text-center text-3xl font-semibold tracking-tight">Why use GoByBudget.com?</h2>
        <div className="grid gap-8 lg:grid-cols-2">
          <ComparisonCard title="Manual Planning" tone="muted" />
          <ComparisonCard title="GoByBudget.com" tone="smart" />
        </div>
      </section>

      <section className="bg-[#f7f9fb] px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-12 text-center text-3xl font-semibold tracking-tight">Choose your travel style</h2>
          <div className="grid gap-8 md:grid-cols-3">
            {travelStyles.map(([Icon, title, copy, price]) => {
              const featured = title === "Comfort";
              return (
                <article
                  key={title as string}
                  className={`relative rounded-xl bg-white p-9 shadow-sm transition hover:-translate-y-1 ${
                    featured ? "border-2 border-[#0B1D34] shadow-xl" : "border border-[#c3c6d7]/40"
                  }`}
                >
                  {featured ? (
                    <div className="absolute right-6 top-6 rounded-md bg-[#14B8A6]/10 px-3 py-1 text-[10px] font-bold uppercase text-[#0B1D34]">
                      Popular
                    </div>
                  ) : null}
                  <Icon className="mb-6 size-10 text-[#0B1D34]" />
                  <h3 className="mb-4 text-2xl font-semibold">{title as string}</h3>
                  <p className="mb-8 leading-7 text-[#434655]">{copy as string}</p>
                  <div className="font-bold text-[#0B1D34]">{price as string}</div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-xl bg-[#0B1D34] p-8 text-center text-white sm:p-12 lg:p-16">
          <div className="mx-auto max-w-2xl">
            <h2 className="text-3xl font-bold tracking-tight sm:text-5xl">Compare realistic trip costs</h2>
            <p className="mt-6 text-lg leading-8 text-white/90">
              Start with a budget estimate, browse destination guides, and check the methodology before booking.
            </p>
            <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/travel-budget-calculator"
                className="inline-flex min-h-12 items-center justify-center rounded-lg bg-white px-6 font-bold text-[#0B1D34] transition hover:bg-white/90"
              >
                Estimate a trip budget
              </Link>
              <Link
                href="/methodology"
                className="inline-flex min-h-12 items-center justify-center rounded-lg border border-white/40 px-6 font-bold text-white transition hover:bg-white/10"
              >
                View methodology
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="mb-12 text-center text-3xl font-semibold tracking-tight">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs.map(([question, answer]) => (
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

      <section className="bg-[#eceef0] px-4 py-16 text-center sm:px-6 lg:px-8">
        <h2 className="mx-auto mb-8 max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">
          Stop guessing where you can afford to travel
        </h2>
        <Link
          href="/results?budget=2500&currency=CAD&origin=YUL&days=10&month=october&travelers=2&style=balanced"
          className="inline-flex items-center gap-2 rounded-lg bg-[#0B1D34] px-10 py-5 text-lg font-semibold text-white shadow-xl transition hover:bg-[#14B8A6] active:scale-95"
        >
          <Search className="size-5" />
          Find my destinations
        </Link>
      </section>
    </main>
  );
}

function ComparisonCard({ title, tone }: { title: string; tone: "muted" | "smart" }) {
  const smart = tone === "smart";
  const items = smart
    ? [
        "One search compares the current country budget and city destination datasets.",
        "Transparent planning estimates from curated destination data.",
        "Transparent breakdowns for every penny spent.",
        "AI-curated travel styles for your comfort level.",
      ]
    : [
        "Searching 15+ tabs for flights and hotels.",
        "Guessing local food and transport costs.",
        "Outdated blog posts with old pricing.",
        "Uncertainty about final trip totals.",
      ];

  return (
    <article
      className={`relative rounded-xl p-8 sm:p-10 ${
        smart ? "border-2 border-[#0B1D34] bg-white shadow-2xl" : "border border-[#c3c6d7]/40 bg-[#f2f4f6]"
      }`}
    >
      {smart ? (
        <div className="absolute -top-4 left-10 rounded-md bg-[#0B1D34] px-4 py-1 text-xs font-bold uppercase tracking-widest text-white">
          The Smart Way
        </div>
      ) : null}
      <h3 className={`mb-8 text-3xl font-semibold tracking-tight ${smart ? "text-[#0B1D34]" : "text-[#434655]"}`}>
        {title}
      </h3>
      <ul className="space-y-5">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-4">
            {smart ? (
              <CheckCircle2 className="mt-1 size-5 shrink-0 fill-emerald-500 text-emerald-500" />
            ) : (
              <CircleX className="mt-1 size-5 shrink-0 text-red-600" />
            )}
            <span className={`leading-7 ${smart ? "font-semibold text-slate-950" : "text-[#434655]"}`}>{item}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}
