import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowRight, CalendarDays, Home, Route, Search, Sparkles, WalletCards } from "lucide-react";

import { AffiliateCard } from "@/components/site/affiliate-card";
import { BudgetBreakdown } from "@/components/site/budget-breakdown";
import { CTASection } from "@/components/site/cta-section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type Destination, destinations, formatMoney, getDestination } from "@/lib/data/destinations";

type DestinationPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return destinations.map((destination) => ({ slug: destination.slug }));
}

export async function generateMetadata({ params }: DestinationPageProps): Promise<Metadata> {
  const { slug } = await params;
  const destination = getDestination(slug);

  if (!destination) {
    return {
      title: "Destination Not Found | TravelBudget.ai",
    };
  }

  const title = `${destination.name} Travel Budget Guide | TravelBudget.ai`;
  const description = `See estimated travel costs for ${destination.name}, including flights, hotels, food, transport, activities, best months to visit, itinerary ideas, and booking options.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      siteName: "TravelBudget.ai",
      images: [
        {
          url: destination.image,
          width: 1600,
          height: 900,
          alt: `${destination.name} travel budget guide`,
        },
      ],
    },
  };
}

export default async function DestinationPage({ params }: DestinationPageProps) {
  const { slug } = await params;
  const destination = getDestination(slug);

  if (!destination) {
    notFound();
  }

  const budgetInsight = getBudgetInsight(destination);
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: destination.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <section className="relative isolate min-h-[520px] overflow-hidden">
        <Image
          src={destination.image}
          alt={`${destination.name} landscape`}
          fill
          priority
          sizes="100vw"
          className="-z-10 object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-slate-950/80 via-slate-950/45 to-transparent" />
        <div className="mx-auto flex min-h-[520px] max-w-7xl items-end px-4 py-12 sm:px-6 lg:px-8">
          <div className="max-w-3xl text-white">
            <Badge className="mb-4 bg-white text-blue-600">{destination.countryCode} budget guide</Badge>
            <h1 className="text-5xl font-semibold tracking-tight sm:text-6xl">
              {destination.name} travel budget
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-white/85">{destination.shortDescription}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="rounded-xl bg-orange-500 text-white hover:bg-orange-600">
                <Link href="/results">
                  Plan a trip to {destination.name}
                  <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-xl bg-white/95 text-slate-950">
                <Link href="/results">
                  Compare with other destinations
                  <Search className="ml-2 size-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <main className="bg-slate-50">
        <section className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_380px] lg:px-8">
          <div className="grid gap-8">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Metric icon={WalletCards} label="Estimated total" value={formatMoney(destination.estimatedCost, destination.currency)} />
              <Metric icon={Sparkles} label="Budget score" value={`${destination.score}/100`} />
              <Metric icon={CalendarDays} label="Best months" value={destination.bestMonths.slice(0, 2).join(", ")} />
              <Metric icon={Route} label="Trip styles" value={destination.travelStyles.slice(0, 2).join(", ")} />
            </div>

            <Card className="border-slate-200 bg-white shadow-lg shadow-slate-200/60">
              <CardHeader>
                <CardTitle className="text-xl text-slate-950">
                  Can I afford {destination.name}?
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-center">
                <div>
                  <Badge className={budgetInsight.badgeClassName}>{budgetInsight.label}</Badge>
                  <p className="mt-4 text-sm leading-6 text-slate-600">{budgetInsight.copy}</p>
                  <p className="mt-3 text-xs leading-5 text-slate-500">
                    These are directional mock estimates, not live prices. Actual booking costs can move with
                    seasonality, departure city, exchange rates, and availability.
                  </p>
                </div>
                <div className="rounded-2xl bg-slate-950 p-5 text-white">
                  <p className="text-xs uppercase tracking-wide text-white/60">Typical mock estimate</p>
                  <p className="mt-2 text-3xl font-semibold">
                    {formatMoney(destination.estimatedCost, destination.currency)}
                  </p>
                </div>
              </CardContent>
            </Card>

            <BudgetBreakdown destination={destination} />

            <Card className="border-slate-200 bg-white shadow-lg shadow-slate-200/60">
              <CardHeader>
                <CardTitle className="text-xl text-slate-950">
                  Best months to visit {destination.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-5">
                <div className="flex flex-wrap gap-2">
                  {destination.bestMonths.map((month) => (
                    <Badge key={month} variant="secondary" className="bg-blue-50 text-blue-700">
                      {month}
                    </Badge>
                  ))}
                </div>
                <div className="grid gap-3 rounded-2xl bg-slate-50 p-5 sm:grid-cols-[auto_1fr]">
                  <CalendarDays className="size-5 text-blue-600" />
                  <div>
                    <p className="font-semibold text-slate-950">{destination.weather}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      These months are highlighted because they typically balance comfort, seasonal value, and
                      easier planning windows for a {destination.travelStyles.join(", ").toLowerCase()} trip.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 bg-white shadow-lg shadow-slate-200/60">
              <CardHeader>
                <CardTitle className="text-xl text-slate-950">
                  {destination.name} itinerary preview
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4">
                {destination.itineraryPreview.map((item, index) => (
                  <div key={item} className="flex gap-4">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
                      {index + 1}
                    </span>
                    <p className="pt-1 text-sm leading-6 text-slate-600">{item}</p>
                  </div>
                ))}
                <p className="text-xs leading-5 text-slate-500">
                  Use this as a budget planning preview, not a full day-by-day itinerary.
                </p>
              </CardContent>
            </Card>

            <Card className="border-slate-200 bg-white">
              <CardHeader>
                <CardTitle className="text-xl text-slate-950">{destination.name} travel budget FAQ</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-5">
                {destination.faqs.map((faq) => (
                  <div key={faq.question}>
                    <h3 className="font-semibold text-slate-950">{faq.question}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-500">{faq.answer}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <div className="flex flex-wrap gap-3">
              <Button asChild variant="outline" className="rounded-xl bg-white">
                <Link href="/">
                  <Home className="mr-2 size-4" />
                  Back to calculator
                </Link>
              </Button>
              <Button asChild variant="outline" className="rounded-xl bg-white">
                <Link href="/results">
                  Compare all destinations
                  <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>
            </div>
          </div>

          <aside className="grid h-fit gap-4 lg:sticky lg:top-24">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">Booking options</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-950">Book the core trip pieces</h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Mock affiliate-ready actions for flights, hotels, eSIM, activities, and insurance.
              </p>
            </div>
            {destination.affiliateLinks.map((link) => (
              <AffiliateCard key={link.type} link={link} />
            ))}
          </aside>
        </section>
      </main>
      <CTASection />
    </>
  );
}

function Metric({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <Card className="border-slate-200 bg-white shadow-sm">
      <CardContent className="pt-5">
        <Icon className="mb-4 size-5 text-blue-600" />
        <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
        <p className="mt-1 text-lg font-semibold text-slate-950">{value}</p>
      </CardContent>
    </Card>
  );
}

function getBudgetInsight(destination: Destination) {
  if (destination.estimatedCost <= 1800) {
    return {
      label: "Budget-friendly",
      badgeClassName: "bg-teal-50 text-teal-700 ring-1 ring-teal-100",
      copy: `${destination.name} is one of the stronger value picks in this dataset. The total is kept down by lower typical daily costs, even if flights still matter.`,
    };
  }

  if (destination.estimatedCost <= 2300) {
    return {
      label: "Mid-range",
      badgeClassName: "bg-blue-50 text-blue-700 ring-1 ring-blue-100",
      copy: `${destination.name} fits a balanced budget when you watch flight timing and choose practical stays. It is realistic for travelers who want comfort without overspending.`,
    };
  }

  return {
    label: "Premium/stretch",
    badgeClassName: "bg-orange-50 text-orange-700 ring-1 ring-orange-100",
    copy: `${destination.name} is a stretch destination in this mock budget model. It can still work, but flights, hotels, or peak-season timing need closer control.`,
  };
}
