import Image from "next/image";

import { DestinationCard } from "@/components/site/destination-card";
import { SearchCard } from "@/components/site/search-card";
import { ToolCard } from "@/components/site/tool-card";
import { TrustSection } from "@/components/site/trust-section";
import { CTASection } from "@/components/site/cta-section";
import { destinations } from "@/lib/data/destinations";
import { tools } from "@/lib/data/tools";
import { createMetadata } from "@/lib/seo/metadata";

export const metadata = createMetadata({
  title: "Find the Best Travel Destinations for Your Budget",
  description:
    "Discover where you can travel based on your budget, trip length, departure city, and travel style. TravelBudget.ai helps you compare destinations with realistic cost breakdowns and smart recommendations.",
  path: "/",
  robots: {
    index: true,
    follow: true,
  },
});

export default function Home() {
  return (
    <>
      <section className="relative isolate overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1800&q=85"
          alt="Traveler overlooking a bright coastline"
          fill
          priority
          className="-z-10 object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-white via-white/90 to-white/15" />
        <div className="mx-auto grid min-h-[720px] max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[0.92fr_1.08fr] lg:px-8">
          <div className="max-w-xl pt-8">
            <p className="mb-4 inline-flex rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700 ring-1 ring-blue-100">
              Budget-first destination discovery
            </p>
            <h1 className="text-5xl font-semibold tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
              Travel More. Spend Less.
            </h1>
            <p className="mt-6 text-lg leading-8 text-slate-650">
              Discover the best destinations based on your real budget in seconds.
            </p>
          </div>
          <div className="w-full max-w-2xl justify-self-end">
            <SearchCard />
          </div>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">Ranked for your budget</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
                Best destinations for your budget
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-slate-500">
              Mock estimates combine flights, hotels, food, local transport, activities, and seasonal value.
            </p>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {destinations.map((destination) => (
              <DestinationCard key={destination.slug} destination={destination} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">Free travel tools</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">Plan smarter before booking</h2>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tools.slice(0, 6).map((tool) => (
              <ToolCard key={tool.title} tool={tool} />
            ))}
          </div>
        </div>
      </section>

      <TrustSection />
      <CTASection />
    </>
  );
}
