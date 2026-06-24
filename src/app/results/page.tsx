import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  ChevronRight,
  CircleDollarSign,
  Compass,
  Filter,
  Heart,
  Hotel,
  Landmark,
  Leaf,
  MapPin,
  Mountain,
  Plane,
  Sparkles,
  Users,
  Utensils,
  Waves,
  Wifi,
} from "lucide-react";

import { AnalyticsView } from "@/components/analytics/analytics-view";
import { TrackedLink } from "@/components/analytics/tracked-link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CostBreakdownDonut,
  CostBreakdownList,
  type CostBreakdownItem,
} from "@/components/site/cost-breakdown-card";
import {
  destinations as destinationData,
  formatMoney,
  getDestinationCostBreakdown,
  getDestinationTripEstimate,
} from "@/lib/data/destinations";
import { createResultsMetadata } from "@/lib/seo/metadata";

export const metadata = createResultsMetadata();

const categories = [
  { label: "Beach", icon: Waves, active: true },
  { label: "City", icon: Building2 },
  { label: "Nature", icon: Leaf },
  { label: "Culture", icon: Landmark },
  { label: "Adventure", icon: Mountain },
  { label: "Food", icon: Utensils },
  { label: "Family", icon: Users },
  { label: "Backpacker", icon: Compass },
];

const legacyDestinations = [
  {
    rank: 1,
    country: "Japon",
    region: "Tokyo & Kyoto",
    total: "2 420 $",
    quality: "Excellent",
    score: "9.6/10",
    href: "/destinations/japan",
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1600&q=80",
    alt: "Temple japonais avec cerisiers en fleurs",
  },
  {
    rank: 2,
    country: "Portugal",
    region: "Lisbon & Algarve",
    total: "1 980 $",
    quality: "Très bon",
    score: "9.1/10",
    href: "/destinations/portugal",
    image: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1600&q=80",
    alt: "Cote portugaise avec falaises et ocean",
  },
  {
    rank: 3,
    country: "Vietnam",
    region: "Hanoi & Ha Long",
    total: "1 650 $",
    quality: "Incroyable",
    score: "9.3/10",
    href: "/destinations/vietnam",
    image: "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1600&q=80",
    alt: "Baie d Ha Long au Vietnam",
  },
];

void legacyDestinations;

const destinations = destinationData.map((destination, index) => ({
  rank: index + 1,
  country: destination.name,
  region: destination.travelStyles.slice(0, 2).join(" & "),
  total: formatMoney(getDestinationTripEstimate(destination, { days: 10, originCode: "YUL", travelStyle: "midRange" })),
  quality: destination.score >= 92 ? "Excellent" : "Very good",
  score: `${(destination.score / 10).toFixed(1)}/10`,
  href: `/destinations/${destination.slug}`,
  image: destination.image,
  alt: `${destination.name} travel view`,
}));

const japan = destinationData[0];
const japanBreakdown = getDestinationCostBreakdown(japan, { days: 10, originCode: "YUL", travelStyle: "midRange" });

const budgetRows: CostBreakdownItem[] = [
  { label: "Flights", amount: japanBreakdown.flights, currency: "CAD", color: "#2563eb" },
  { label: "Accommodation", amount: japanBreakdown.accommodation, currency: "CAD", color: "#14b8a6" },
  { label: "Food", amount: japanBreakdown.food, currency: "CAD", color: "#f97316" },
  { label: "Transport", amount: japanBreakdown.localTransport, currency: "CAD", color: "#8b5cf6" },
  { label: "Activities", amount: japanBreakdown.activities, currency: "CAD", color: "#a855f7" },
  { label: "Misc", amount: japanBreakdown.misc, currency: "CAD", color: "#f59e0b" },
];

const offers = [
  {
    title: "Vols Flex",
    detail: "Montréal -> Tokyo",
    discount: "-30%",
    icon: Plane,
    tone: "from-blue-500 to-cyan-400",
  },
  {
    title: "Hotels Top Pick",
    detail: "Kyoto Ryokan Stay",
    discount: "-40%",
    icon: Hotel,
    tone: "from-violet-500 to-fuchsia-400",
  },
  {
    title: "Budget eSIM Finder",
    detail: "Save up to $80 on roaming fees.",
    action: "Compare eSIMs",
    icon: Wifi,
    tone: "from-emerald-500 to-teal-400",
  },
];

export default function ResultsPage() {
  return (
    <main className="bg-[#f7f9fb] text-[#191c1e]">
      <AnalyticsView
        eventName="budget_result_viewed"
        eventProperties={{
          page: "/results",
          currency: "CAD",
          tripLength: 10,
          resultsCount: destinations.length,
        }}
      />
      <section className="border-b border-[#c3c6d7]/35 bg-white/70">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 sm:px-6 lg:flex-row lg:items-end lg:justify-between lg:px-8">
          <div>
            <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-blue-700">
              <Sparkles className="size-4" />
              AI destination finder
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-[#191c1e] sm:text-6xl">
              Explore the World
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-[#434655]">
              Found 42 destinations matching your budget of $2,500 CAD for 10 days in October.
            </p>
          </div>
          <Button asChild className="h-12 rounded-full bg-[#004ac6] px-5 text-white shadow-lg shadow-blue-700/20 hover:bg-blue-700">
            <TrackedLink
              href="/"
              eventName="cta_clicked"
              eventProperties={{
                page: "/results",
                label: "Modify Budget",
                href: "/",
                ctaLocation: "results_header",
              }}
            >
              <Filter className="mr-2 size-4" />
              Modify Budget
            </TrackedLink>
          </Button>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,8fr)_minmax(320px,4fr)] lg:px-8">
        <div className="grid gap-8">
          <CategoryFilters />

          <div className="grid gap-5 md:grid-cols-3">
            {destinations.map((destination) => (
              <DestinationCard key={destination.country} destination={destination} />
            ))}
          </div>

          <BudgetBreakdownCard />
        </div>

        <aside className="grid h-fit gap-6 lg:sticky lg:top-24">
          <GlobalPriceIndexCard />
          <OffersPanel />
        </aside>
      </section>

      <CTASection />
    </main>
  );
}

function CategoryFilters() {
  return (
    <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden">
      {categories.map((category) => {
        const Icon = category.icon;

        return (
          <Link
            key={category.label}
            href="/results"
            className={`flex min-w-28 items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm font-semibold shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-blue-600/25 ${
              category.active
                ? "border-blue-600 bg-[#004ac6] text-white shadow-blue-700/20"
                : "border-[#c3c6d7]/45 bg-white text-[#434655] hover:border-blue-200 hover:text-blue-700"
            }`}
          >
            <Icon className="size-4" />
            {category.label}
          </Link>
        );
      })}
    </div>
  );
}

function DestinationCard({ destination }: { destination: (typeof destinations)[number] }) {
  return (
    <article className="group overflow-hidden rounded-[24px] border border-[#c3c6d7]/35 bg-white shadow-[0_18px_45px_-24px_rgba(15,23,42,0.35)] transition-[transform,box-shadow] duration-400 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] hover:-translate-y-2 hover:shadow-[0_24px_60px_-28px_rgba(15,23,42,0.5)]">
      <TrackedLink
        href={destination.href}
        eventName="destination_card_clicked"
        eventProperties={{
          page: "/results",
          destinationName: destination.country,
          destinationSlug: destination.href.replace("/destinations/", ""),
          source: "results_grid",
        }}
        className="block focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-blue-600/25"
      >
        <div className="relative h-56 overflow-hidden">
          <Image
            src={destination.image}
            alt={destination.alt}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 100vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/45 via-transparent to-slate-950/10" />
          <Badge className="absolute left-4 top-4 rounded-full bg-white px-3 py-1 text-blue-700 shadow-md">
            TOP {destination.rank}
          </Badge>
          <button
            type="button"
            aria-label={`Ajouter ${destination.country} aux favoris`}
            className="absolute right-4 top-4 flex size-10 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-md backdrop-blur transition hover:bg-white hover:text-rose-500 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-white/70"
          >
            <Heart className="size-4" />
          </button>
        </div>
        <div className="grid gap-5 p-5">
          <div>
            <p className="text-sm font-medium text-[#434655]">{destination.region}</p>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight text-[#191c1e]">{destination.country}</h2>
          </div>
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#434655]">Est. Total</p>
              <p className="mt-1 text-3xl font-semibold text-[#004ac6]">{destination.total}</p>
            </div>
            <div className="rounded-full bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700">
              {destination.score}
            </div>
          </div>
          <div className="flex items-center justify-between gap-3 text-sm">
            <span className="flex items-center gap-2 font-medium text-[#434655]">
              <span className="size-2.5 rounded-full bg-emerald-500 shadow-[0_0_0_4px_rgba(16,185,129,0.14)]" />
              {destination.quality}
            </span>
            <span className="inline-flex items-center gap-1 font-semibold text-blue-700">
              Voir le détail
              <ArrowRight className="size-4" />
            </span>
          </div>
        </div>
      </TrackedLink>
    </article>
  );
}

function BudgetBreakdownCard() {
  const totalAmount = getDestinationTripEstimate(japan, { days: 10, originCode: "YUL", travelStyle: "midRange" });

  return (
    <section className="grid gap-8 rounded-[32px] border border-white/60 bg-white/70 p-6 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.05)] backdrop-blur-xl md:grid-cols-[260px_1fr] md:p-8">
      <CostBreakdownDonut centerLabel="Total budget" currency="CAD" items={budgetRows} totalAmount={totalAmount} />

      <div className="flex flex-col justify-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">Cost clarity</p>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight text-[#191c1e]">
          Budget breakdown - Japan
        </h2>
        <p className="mt-3 text-sm leading-6 text-[#434655]">
          Based on a balanced selection for 10 days.
        </p>
        <CostBreakdownList
          className="mt-6 grid gap-3 sm:grid-cols-2"
          currency="CAD"
          itemClassName="rounded-2xl border border-[#c3c6d7]/35 bg-white/80 px-4 py-3"
          items={budgetRows}
          showBars={false}
          totalAmount={totalAmount}
        />
      </div>
    </section>
  );
}

function GlobalPriceIndexCard() {
  return (
    <section className="rounded-[28px] border border-[#c3c6d7]/35 bg-white p-5 shadow-[0_18px_45px_-26px_rgba(15,23,42,0.45)]">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xl font-semibold text-[#191c1e]">Global Price Index</h2>
        <Badge className="rounded-full bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100">LIVE DATA</Badge>
      </div>

      <div className="relative mt-5 aspect-square overflow-hidden rounded-[24px] border border-blue-100 bg-[#edf5ff]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_35%,rgba(37,99,235,0.18),transparent_24%),radial-gradient(circle_at_72%_52%,rgba(20,184,166,0.2),transparent_18%),radial-gradient(circle_at_55%_30%,rgba(249,115,22,0.14),transparent_20%)]" />
        <svg viewBox="0 0 360 360" className="absolute inset-0 h-full w-full text-blue-900/25" aria-label="Carte du monde stylisee">
          <path d="M54 124c26-24 61-20 87-11 18 6 31 2 49-3 36-9 69 2 99 26 14 11 11 29-5 35-22 8-44-8-65-4-22 4-34 26-58 23-21-2-31-22-52-25-24-3-51 10-68-8-10-11-1-23 13-33Z" fill="currentColor" />
          <path d="M78 222c23-17 52-13 68 6 12 15 8 36-11 44-25 11-66-6-79-24-7-10 1-18 22-26Z" fill="currentColor" />
          <path d="M236 222c17-12 42-10 56 4 12 12 8 31-9 39-22 10-52-2-63-18-7-9 0-17 16-25Z" fill="currentColor" />
        </svg>
        <div className="absolute left-[56%] top-[47%] rounded-2xl border border-white/70 bg-white/90 px-4 py-3 shadow-xl backdrop-blur">
          <p className="text-xs font-bold uppercase tracking-wide text-blue-700">VIETNAM</p>
          <p className="mt-1 text-lg font-semibold text-[#191c1e]">$45 / day</p>
        </div>
        <MapPin className="absolute left-[50%] top-[55%] size-6 fill-blue-600 text-blue-600" />
      </div>

      <div className="mt-5">
        <div className="h-3 rounded-full bg-gradient-to-r from-emerald-400 via-yellow-300 via-orange-400 to-red-500" />
        <div className="mt-2 flex justify-between text-xs font-semibold text-[#434655]">
          <span>Moins cher</span>
          <span>Plus cher</span>
        </div>
      </div>
    </section>
  );
}

function OffersPanel() {
  return (
    <section>
      <h2 className="text-xl font-semibold text-[#191c1e]">Offers to maximize your budget</h2>
      <div className="mt-4 grid gap-3">
        {offers.map((offer) => (
          <OfferCard key={offer.title} offer={offer} />
        ))}
      </div>
    </section>
  );
}

function OfferCard({ offer }: { offer: (typeof offers)[number] }) {
  const Icon = offer.icon;

  return (
    <TrackedLink
      href="/tools"
      eventName="cta_clicked"
      eventProperties={{
        page: "/results",
        label: offer.title,
        href: "/tools",
        ctaLocation: "results_offer_panel",
      }}
      className="group flex items-center gap-4 rounded-[24px] border border-white/60 bg-white/75 p-4 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.05)] backdrop-blur transition hover:-translate-y-1 hover:bg-white hover:shadow-[0_18px_42px_-26px_rgba(15,23,42,0.5)] focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-blue-600/25"
    >
      <span className={`flex size-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${offer.tone} text-white shadow-lg`}>
        <Icon className="size-6" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-semibold text-[#191c1e]">{offer.title}</span>
        <span className="mt-1 block text-sm text-[#434655]">{offer.detail}</span>
        {"action" in offer ? (
          <span className="mt-3 inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
            {offer.action}
          </span>
        ) : null}
      </span>
      {"discount" in offer ? (
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-bold text-emerald-700">{offer.discount}</span>
      ) : null}
      <ChevronRight className="size-5 text-slate-400 transition group-hover:translate-x-1 group-hover:text-blue-700" />
    </TrackedLink>
  );
}

function CTASection() {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-12 pt-4 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-[40px] bg-[#0F172A] px-6 py-12 text-white shadow-2xl shadow-slate-950/20 sm:px-10 lg:px-14">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(37,99,235,0.45),transparent_28%),linear-gradient(135deg,rgba(0,74,198,0.3),transparent_45%)]" />
        <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-blue-200">
              <CircleDollarSign className="size-4" />
              Smarter travel finance
            </p>
            <h2 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight sm:text-5xl">
              Ready to plan your next journey?
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-white/75 sm:text-base">
              Join thousands of travelers who save time and money by using our AI-powered financial travel companion.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild className="h-12 rounded-full bg-white px-5 text-[#004ac6] hover:bg-blue-50">
              <TrackedLink
                href="/"
                eventName="cta_clicked"
                eventProperties={{
                  page: "/results",
                  label: "Commencer maintenant",
                  href: "/",
                  ctaLocation: "results_bottom_cta",
                }}
              >
                Commencer maintenant
                <ArrowRight className="ml-2 size-4" />
              </TrackedLink>
            </Button>
            <Button asChild variant="outline" className="h-12 rounded-full border-white/30 bg-white/10 px-5 text-white hover:bg-white/15 hover:text-white">
              <TrackedLink
                href="/tools"
                eventName="cta_clicked"
                eventProperties={{
                  page: "/results",
                  label: "View Itinerary Builder",
                  href: "/tools",
                  ctaLocation: "results_bottom_cta",
                }}
              >
                View Itinerary Builder
              </TrackedLink>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
