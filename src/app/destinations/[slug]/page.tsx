import Image from "next/image";
import { notFound } from "next/navigation";
import { CalendarDays, Route, Sparkles } from "lucide-react";

import { AffiliateCard } from "@/components/site/affiliate-card";
import { BudgetBreakdown } from "@/components/site/budget-breakdown";
import { CTASection } from "@/components/site/cta-section";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { destinations, formatMoney, getDestination } from "@/lib/data/destinations";

export function generateStaticParams() {
  return destinations.map((destination) => ({ slug: destination.slug }));
}

export default async function DestinationPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const destination = getDestination(slug);

  if (!destination) {
    notFound();
  }

  return (
    <>
      <section className="relative isolate min-h-[520px] overflow-hidden">
        <Image src={destination.image} alt={`${destination.name} landscape`} fill priority className="-z-10 object-cover" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-slate-950/80 via-slate-950/45 to-transparent" />
        <div className="mx-auto flex min-h-[520px] max-w-7xl items-end px-4 py-12 sm:px-6 lg:px-8">
          <div className="max-w-3xl text-white">
            <Badge className="mb-4 bg-white text-blue-600">{destination.countryCode}</Badge>
            <h1 className="text-5xl font-semibold tracking-tight sm:text-6xl">{destination.name}</h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-white/85">{destination.shortDescription}</p>
          </div>
        </div>
      </section>

      <main className="bg-slate-50">
        <section className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_380px] lg:px-8">
          <div className="grid gap-8">
            <div className="grid gap-4 sm:grid-cols-3">
              <Metric icon={Sparkles} label="Budget score" value={`${destination.score}/100`} />
              <Metric icon={CalendarDays} label="Best time" value={destination.bestMonths.slice(0, 2).join(", ")} />
              <Metric icon={Route} label="Estimated trip cost" value={formatMoney(destination.estimatedCost)} />
            </div>

            <BudgetBreakdown destination={destination} />

            <Card className="border-slate-200 bg-white shadow-lg shadow-slate-200/60">
              <CardHeader>
                <CardTitle className="text-xl text-slate-950">Suggested itinerary preview</CardTitle>
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
              </CardContent>
            </Card>

            <Card className="border-slate-200 bg-white">
              <CardHeader>
                <CardTitle className="text-xl text-slate-950">FAQ</CardTitle>
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
          </div>

          <aside className="grid h-fit gap-4 lg:sticky lg:top-24">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">Affiliate-style cards</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-950">Plan the details</h2>
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
