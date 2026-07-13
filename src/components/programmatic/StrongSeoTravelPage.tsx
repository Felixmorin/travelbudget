import Link from "next/link";
import { ArrowRight, BedDouble, Bus, CalendarDays, CircleDollarSign, Plane, Utensils } from "lucide-react";

import { EmailCaptureForm } from "@/components/analytics/email-capture-form";
import { FlightAffiliateLink } from "@/components/affiliate/FlightAffiliateLink";
import { EstimateDisclaimer } from "@/components/site/estimate-disclaimer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatMoney } from "@/lib/format-money";
import { getDestinationIata } from "@/lib/affiliates/iata";
import { getCityCountryLabel } from "@/lib/data/unified-destinations";
import type { StrongSeoPage } from "@/lib/programmatic/strong-seo-pages";
import { createBreadcrumbSchema, createFAQSchema, createGuideArticleSchema, serializeJsonLd } from "@/lib/seo/schema";

export function StrongSeoTravelPage({ page }: { page: StrongSeoPage }) {
  const destinationLabel = getCityCountryLabel(page.destination);
  const totalLabel = formatMoney(page.estimate.total, "CAD");
  const jsonLd = [
    createGuideArticleSchema({
      title: page.title,
      description: page.metaDescription,
      path: page.path,
      image: page.destination.image,
      datePublished: "2026-07-09",
      dateModified: "2026-07-09",
    }),
    createFAQSchema(page.faq),
    createBreadcrumbSchema([
      { name: "Home", url: "/" },
      { name: getBreadcrumbParent(page.kind), url: getBreadcrumbParentPath(page.kind) },
      { name: page.title, url: page.path },
    ]),
  ];

  return (
    <main className="bg-[#f7f9fb] text-slate-950">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(jsonLd),
        }}
      />
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
          <nav aria-label="Breadcrumb" className="text-sm text-slate-500">
            <Link href="/" className="hover:text-[#0B1D34]">
              Home
            </Link>
            <span aria-hidden="true" className="mx-2">
              /
            </span>
            <Link href={getBreadcrumbParentPath(page.kind)} className="hover:text-[#0B1D34]">
              {getBreadcrumbParent(page.kind)}
            </Link>
          </nav>
          <Badge className="mt-6 rounded-full bg-[#14B8A6]/10 px-4 py-1 text-xs font-bold uppercase tracking-wider text-[#0B1D34]">
            {getKindLabel(page.kind)}
          </Badge>
          <div className="mt-5 grid gap-8 lg:grid-cols-[1fr_320px] lg:items-end">
            <div>
              <h1 className="max-w-4xl text-4xl font-semibold tracking-tight sm:text-6xl">{page.h1}</h1>
              <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
                {page.intro} Estimated total: <span className="font-semibold text-slate-950">{totalLabel} CAD</span>.
              </p>
            </div>
            <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Planning estimate</p>
              <p className="mt-2 text-4xl font-semibold text-[#0B1D34]">{totalLabel}</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {page.durationDays} days from {page.origin.city} ({page.origin.code}), one traveler, CAD.
              </p>
            </div>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <HeroPill icon={Plane} label={`From ${page.origin.city}`} />
            <HeroPill icon={CalendarDays} label={`${page.durationDays} days`} />
            <HeroPill icon={CircleDollarSign} label="CAD estimates" />
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_340px] lg:px-8">
        <div className="grid gap-6">
          <EstimateDisclaimer />

          <section className="rounded-[24px] border border-slate-200 bg-white p-6">
            <h2 className="text-2xl font-semibold">Estimated budget breakdown</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              This is a planning estimate, not a live quote. Prices vary by season, travel dates, comfort level,
              exchange rates, booking timing, and availability.
            </p>
            <dl className="mt-6 grid gap-4 sm:grid-cols-2">
              <CostMetric icon={Plane} label="Flight" value={page.estimate.breakdown.flight} />
              <CostMetric icon={BedDouble} label="Hotel" value={page.estimate.breakdown.hotel} />
              <CostMetric icon={Utensils} label="Food" value={page.estimate.breakdown.food} />
              <CostMetric icon={Bus} label="Local transport" value={page.estimate.breakdown.localTransport} />
              <CostMetric icon={CalendarDays} label="Activities" value={page.estimate.breakdown.activities} />
              <CostMetric icon={CircleDollarSign} label="Buffer" value={page.estimate.breakdown.buffer} />
            </dl>
          </section>

          <ContentSection title="Who this trip is best for">
            <ul className="grid gap-2">
              {page.bestFor.map((item) => (
                <li key={item} className="rounded-xl bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-700">
                  {item}
                </li>
              ))}
            </ul>
          </ContentSection>

          <ContentSection title="When to go for better prices">
            <p>{page.whenToGo}</p>
            <p className="mt-3">
              For {destinationLabel}, compare several departure dates before booking. Small shifts around weekends,
              school breaks, public holidays, and major events can change the total more than a daily meal budget.
            </p>
          </ContentSection>

          <ContentSection title="How to lower the cost">
            <ul className="grid gap-3">
              {page.lowerCostTips.map((tip) => (
                <li key={tip} className="flex gap-3">
                  <span className="mt-2 size-2 rounded-full bg-[#14B8A6]" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </ContentSection>

          <ContentSection title="What this estimate includes">
            <ul className="grid gap-3">
              {page.includes.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-2 size-2 rounded-full bg-[#0B1D34]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4">{page.assumptions}</p>
          </ContentSection>

          <section className="rounded-[24px] border border-slate-200 bg-white p-6">
            <h2 className="text-2xl font-semibold">FAQ</h2>
            <div className="mt-5 grid gap-4">
              {page.faq.map((faq) => (
                <div key={faq.question} className="rounded-2xl bg-slate-50 p-4">
                  <h3 className="font-semibold text-slate-950">{faq.question}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside className="grid h-fit gap-5 lg:sticky lg:top-24">
          <section className="rounded-[24px] border border-slate-200 bg-white p-6">
            <h2 className="text-xl font-semibold">Plan this trip</h2>
            <div className="mt-5 grid gap-3">
              <Button asChild className="rounded-full bg-[#0B1D34] text-white hover:bg-[#0B1D34]">
                <FlightAffiliateLink
                  origin={page.origin.city}
                  originIata={page.origin.code}
                  destination={destinationLabel}
                  destinationIata={getDestinationIata(page.destination)}
                  adults={page.travelers}
                  cabinClass="economy"
                  placement="article_inline"
                  pageType="strong_seo"
                >
                  Find flights for this trip
                  <ArrowRight className="ml-2 size-4" />
                </FlightAffiliateLink>
              </Button>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-950">Send me this trip budget</p>
                <div className="mt-3">
                  <EmailCaptureForm
                    buttonLabel="Send budget"
                    inputLabel="Email address"
                    eventProperties={{
                      page: page.path,
                      source: "strong_seo_page",
                      originCode: page.origin.code,
                      originCity: page.origin.city,
                      destinationSlug: page.destination.slug,
                      destinationName: destinationLabel,
                      budget: page.estimate.total,
                      currency: "CAD",
                      days: page.durationDays,
                      tripLength: page.durationDays,
                      travelers: page.travelers,
                      travelStyle: page.travelStyle,
                      ctaLocation: "seo_sidebar",
                    }}
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-[24px] border border-slate-200 bg-white p-6">
            <h2 className="text-xl font-semibold">Internal links</h2>
            <div className="mt-4 grid gap-3 text-sm font-semibold text-[#0B1D34]">
              <Link href="/travel-budget-calculator" className="hover:underline">
                Travel budget calculator
              </Link>
              <Link href="/destinations" className="hover:underline">
                Browse destinations
              </Link>
              <Link href="/methodology" className="hover:underline">
                Budget methodology
              </Link>
              <Link href={`/destinations/${page.destination.slug}`} className="hover:underline">
                {destinationLabel} destination guide
              </Link>
            </div>
          </section>

          {page.relatedPages.length > 0 ? (
            <section className="rounded-[24px] border border-slate-200 bg-white p-6">
              <h2 className="text-xl font-semibold">Related budget guides</h2>
              <div className="mt-4 grid gap-3">
                {page.relatedPages.map((relatedPage) => (
                  <Link
                    key={relatedPage.path}
                    href={relatedPage.path}
                    className="rounded-xl bg-slate-50 p-4 transition-colors hover:bg-[#14B8A6]/10"
                  >
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      {getKindLabel(relatedPage.kind)}
                    </p>
                    <p className="mt-1 text-sm font-bold leading-5 text-slate-950">{relatedPage.title}</p>
                  </Link>
                ))}
              </div>
            </section>
          ) : null}
        </aside>
      </section>
    </main>
  );
}

function CostMetric({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <Icon className="size-5 text-[#0B1D34]" />
      <dt className="mt-3 text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</dt>
      <dd className="mt-1 text-xl font-semibold text-slate-950">{formatMoney(value, "CAD")}</dd>
    </div>
  );
}

function ContentSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-[24px] border border-slate-200 bg-white p-6">
      <h2 className="text-2xl font-semibold">{title}</h2>
      <div className="mt-3 text-sm leading-7 text-slate-600">{children}</div>
    </section>
  );
}

function HeroPill({
  icon: Icon,
  label,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2">
      <Icon className="size-5 text-[#0B1D34]" />
      <span className="text-sm font-medium text-slate-600">{label}</span>
    </div>
  );
}

function getKindLabel(kind: StrongSeoPage["kind"]) {
  if (kind === "origin-destination") {
    return "Budget destination";
  }

  if (kind === "destination-budget") {
    return "Destination budget";
  }

  return "Budget itinerary";
}

function getBreadcrumbParent(kind: StrongSeoPage["kind"]) {
  if (kind === "origin-destination") {
    return "Budget travel";
  }

  if (kind === "destination-budget") {
    return "Destinations";
  }

  return "Itineraries";
}

function getBreadcrumbParentPath(kind: StrongSeoPage["kind"]) {
  if (kind === "destination-budget") {
    return "/destinations";
  }

  return kind === "itinerary" ? "/guides" : "/travel-budget-calculator";
}
