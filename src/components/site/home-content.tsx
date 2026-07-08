import {
  ArrowRight,
  Bed,
  CheckCircle2,
  CircleX,
  Diamond,
  Info,
  Plane,
  Search,
  Ticket,
  Utensils,
  Wallet,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { SearchCard } from "@/components/site/search-card";
import { cityDestinations } from "@/lib/data/destination-hub";
import { destinations as countryDestinations } from "@/lib/data/destinations";
import { longTailGuides } from "@/lib/data/guides";

const matches = [
  {
    city: "Lisbon",
    country: "Portugal",
    price: "$2,320",
    variance: "-$180 Under Budget",
    image:
      "https://images.unsplash.com/photo-1548707309-dcebeab9ea9b?auto=format&fit=crop&w=320&q=80",
  },
  {
    city: "Mexico City",
    country: "Mexico",
    price: "$1,950",
    variance: "-$550 Under Budget",
    image:
      "https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?auto=format&fit=crop&w=320&q=80",
  },
  {
    city: "Paris",
    country: "France",
    price: "$2,480",
    variance: "-$20 Under Budget",
    image:
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=320&q=80",
  },
];

const destinationCards = [
  {
    city: "Lisbon, Portugal",
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

const popularTrips = [
  ["Long Haul", "Montreal to Tokyo", "Under $4,000"],
  ["European Escape", "Montreal to Barcelona", "Under $2,200"],
  ["Tropical Getaway", "Montreal to Bali", "Under $2,800"],
  ["City Break", "Montreal to New York", "Under $1,200"],
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
  const countryDestinationCount = countryDestinations.length;
  const cityDestinationCount = cityDestinations.length;
  const guideCount = longTailGuides.length;

  return (
    <main className="bg-[#f7f9fb] text-[#191c1e]">
      <section className="relative mx-auto grid max-w-7xl gap-8 overflow-hidden px-4 pb-20 pt-16 sm:px-6 lg:grid-cols-12 lg:items-center lg:px-8 lg:pt-24">
        <div className="absolute -right-24 -top-24 -z-10 h-96 w-96 rounded-full bg-[#0B1D34]/5 blur-3xl" />
        <div className="z-10 lg:col-span-7">
          <h1 className="max-w-4xl text-5xl font-extrabold leading-tight tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
            Find the best travel destinations for your <span className="text-[#0B1D34]">budget</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-[#434655]">
            Enter your budget, trip length, and departure city. Compare the current planning dataset of{" "}
            {countryDestinationCount} country budgets, {cityDestinationCount} city destinations, and {guideCount}{" "}
            planning guides to see where your money can realistically go.
          </p>

          <div className="mt-10">
            <SearchCard />
            <p className="mt-4 flex items-center justify-center gap-2 text-center text-xs font-medium text-slate-500">
              <Info className="size-4" />
              Estimates include flights, accommodation, food, and local activities.
            </p>
          </div>
        </div>

        <div className="hidden lg:col-span-5 lg:block">
          <div className="space-y-4 rounded-3xl border border-white/70 bg-white/70 p-6 shadow-2xl shadow-[#0B1D34]/10 backdrop-blur">
            <div className="mb-6 flex items-center justify-between gap-4">
              <h2 className="text-xl font-semibold">Budget Matches</h2>
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold uppercase tracking-widest text-emerald-700">
                {guideCount} Guides Available
              </span>
            </div>
            {matches.map((match) => (
              <article
                key={match.city}
                className="group flex cursor-pointer items-center gap-4 rounded-2xl border border-white/80 bg-white/60 p-4 transition hover:bg-white"
              >
                <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl">
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
                  <p className="text-sm text-slate-500">{match.country} - 10 Days</p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-[#0B1D34]">{match.price}</div>
                  <div className="text-[10px] font-bold uppercase text-emerald-600">{match.variance}</div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="destinations" className="bg-[#f7f9fb] px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12">
            <h2 className="text-3xl font-semibold tracking-tight text-slate-950">
              With $2,500 CAD from Montreal, you could visit:
            </h2>
            <p className="mt-3 text-lg text-[#434655]">Planning estimates calculated for Comfort travel style.</p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {destinationCards.map((destination) => (
              <article
                key={destination.city}
                className="group overflow-hidden rounded-3xl border border-[#c3c6d7]/30 bg-white shadow-xl shadow-slate-950/5"
              >
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={destination.image}
                    alt={`${destination.city} cost breakdown preview`}
                    width={900}
                    height={600}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                  />
                  <div className="absolute right-4 top-4 rounded-full border border-white/50 bg-white/75 px-4 py-2 font-bold text-[#0B1D34] backdrop-blur">
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
                      <span key={tag} className="rounded-full bg-[#14B8A6]/10 px-3 py-1 text-xs font-bold uppercase text-[#0B1D34]">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
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
          {popularTrips.map(([category, route, budget]) => (
            <Link
              key={route}
              href="/destinations"
              className="group block rounded-3xl border border-[#c3c6d7]/40 bg-white p-7 transition hover:border-[#14B8A6]/40 hover:shadow-lg"
            >
              <div className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-500">{category}</div>
              <h3 className="mb-2 text-xl font-semibold transition group-hover:text-[#0B1D34]">{route}</h3>
              <p className="font-bold text-[#0B1D34]">{budget}</p>
            </Link>
          ))}
        </div>
      </section>

      <section id="methodology" className="relative overflow-hidden bg-slate-950 px-4 py-20 text-white sm:px-6 lg:px-8">
        <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-[#0B1D34]/20 blur-[110px]" />
        <div className="relative z-10 mx-auto max-w-7xl">
          <div className="mb-12 max-w-2xl">
            <h2 className="text-3xl font-semibold tracking-tight">How we estimate your travel budget</h2>
            <p className="mt-4 text-lg leading-8 text-slate-400">
              Our planning model combines curated destination costs, origin-specific flight estimates, and travel
              style assumptions to keep your budget realistic, not just average.
            </p>
          </div>
          <div className="mb-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {methodology.map(([Icon, title, copy]) => (
              <article key={title as string} className="rounded-3xl border border-white/10 bg-white/5 p-7 backdrop-blur">
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

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <h2 className="mb-12 text-center text-3xl font-semibold tracking-tight">Why use GoByBudget.com?</h2>
        <div className="grid gap-8 lg:grid-cols-2">
          <ComparisonCard title="Manual Planning" tone="muted" />
          <ComparisonCard title="GoByBudget.com" tone="smart" />
        </div>
      </section>

      <section className="bg-[#f7f9fb] px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-12 text-center text-3xl font-semibold tracking-tight">Choose your travel style</h2>
          <div className="grid gap-8 md:grid-cols-3">
            {travelStyles.map(([Icon, title, copy, price]) => {
              const featured = title === "Comfort";
              return (
                <article
                  key={title as string}
                  className={`relative rounded-3xl bg-white p-9 shadow-sm transition hover:-translate-y-1 ${
                    featured ? "border-2 border-[#0B1D34] shadow-xl" : "border border-[#c3c6d7]/40"
                  }`}
                >
                  {featured ? (
                    <div className="absolute right-6 top-6 rounded-full bg-[#14B8A6]/10 px-3 py-1 text-[10px] font-bold uppercase text-[#0B1D34]">
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

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#2563eb] to-[#7c3aed] p-8 text-center text-white sm:p-12 lg:p-20">
          <div className="relative z-10 mx-auto max-w-2xl">
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">Compare realistic trip costs</h2>
            <p className="mt-6 text-lg leading-8 text-white/90">
              Start with a budget estimate, browse destination guides, and check the methodology before booking.
            </p>
            <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/tools/travel-budget-calculator"
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-white px-6 font-bold text-[#0B1D34] transition hover:bg-white/90"
              >
                Estimate a trip budget
              </Link>
              <Link
                href="/methodology"
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/40 px-6 font-bold text-white transition hover:bg-white/10"
              >
                View methodology
              </Link>
            </div>
          </div>
          <div className="absolute -left-12 -top-12 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-12 -right-12 h-64 w-64 rounded-full bg-[#14B8A6]/10 blur-3xl" />
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
        <h2 className="mb-12 text-center text-3xl font-semibold tracking-tight">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs.map(([question, answer]) => (
            <details key={question} className="group rounded-2xl border border-[#c3c6d7]/40 bg-white p-6 open:ring-1 open:ring-[#0B1D34]">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold">
                {question}
                <ArrowRight className="size-5 shrink-0 rotate-90 transition group-open:-rotate-90" />
              </summary>
              <p className="mt-4 leading-7 text-[#434655]">{answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="bg-[#eceef0] px-4 py-20 text-center sm:px-6 lg:px-8">
        <h2 className="mx-auto mb-8 max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">
          Stop guessing where you can afford to travel
        </h2>
        <Link
          href="/results?budget=2500&currency=CAD&origin=YUL&days=10&month=october&travelers=2&style=balanced"
          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-br from-[#2563eb] to-[#7c3aed] px-10 py-5 text-lg font-semibold text-white shadow-xl transition hover:scale-105 active:scale-95"
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
      className={`relative rounded-3xl p-8 sm:p-10 ${
        smart ? "border-2 border-[#0B1D34] bg-white shadow-2xl" : "border border-[#c3c6d7]/40 bg-[#f2f4f6]"
      }`}
    >
      {smart ? (
        <div className="absolute -top-4 left-10 rounded-full bg-[#0B1D34] px-4 py-1 text-xs font-bold uppercase tracking-widest text-white">
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
