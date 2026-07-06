import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";

import { TrackedLink } from "@/components/analytics/tracked-link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getDestination } from "@/lib/data/destinations";
import { getLongTailGuide, longTailGuides } from "@/lib/data/guides";
import { createMetadata } from "@/lib/seo/metadata";

type GuidePageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return longTailGuides.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({ params }: GuidePageProps): Promise<Metadata> {
  const { slug } = await params;
  const guide = getLongTailGuide(slug);

  if (!guide) {
    return createMetadata({
      title: "Guide Not Found",
      description: "This TravelBudget.ai guide could not be found.",
      path: `/guides/${slug}`,
      noIndex: true,
    });
  }

  return createMetadata({
    title: guide.title,
    description: guide.summary,
    path: `/guides/${guide.slug}`,
    image: guide.image,
    imageAlt: guide.imageAlt,
  });
}

export default async function LongTailGuidePage({ params }: GuidePageProps) {
  const { slug } = await params;
  const guide = getLongTailGuide(slug);

  if (!guide) {
    notFound();
  }

  const destination = guide.destinationSlug ? getDestination(guide.destinationSlug) : null;
  const relatedGuides = longTailGuides
    .filter((candidate) => candidate.slug !== guide.slug && candidate.category === guide.category)
    .slice(0, 3);

  return (
    <main className="bg-slate-50 text-slate-950">
      <section className="relative isolate min-h-[460px] overflow-hidden">
        <Image src={guide.image} alt={guide.imageAlt} fill priority sizes="100vw" className="-z-10 object-cover" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-slate-950/85 via-slate-950/55 to-slate-950/20" />
        <div className="mx-auto flex min-h-[460px] max-w-5xl items-end px-4 py-12 sm:px-6 lg:px-8">
          <div className="max-w-3xl text-white">
            <Badge className="mb-4 bg-white text-blue-700">{guide.category}</Badge>
            <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">{guide.title}</h1>
            <p className="mt-5 text-lg leading-8 text-white/85">{guide.summary}</p>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-5xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_280px] lg:px-8">
        <article className="grid gap-6">
          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">Search intent</p>
            <p className="mt-2 text-lg leading-8 text-slate-700">{guide.intent}</p>
          </div>
          {guide.sections.map((section) => (
            <section key={section.heading} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-semibold">{section.heading}</h2>
              <p className="mt-4 leading-8 text-slate-600">{section.body}</p>
            </section>
          ))}
          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold">Next planning step</h2>
            <p className="mt-4 leading-8 text-slate-600">
              Turn this guide into a concrete estimate by comparing dates, origin airports, travel style, and trip
              length in the TravelBudget calculator.
            </p>
            <Button asChild className="mt-5 rounded-lg bg-blue-600 text-white hover:bg-blue-700">
              <TrackedLink
                href="/tools/travel-budget-calculator"
                eventName="cta_clicked"
                eventProperties={{
                  page: `/guides/${guide.slug}`,
                  label: "Open calculator",
                  href: "/tools/travel-budget-calculator",
                  ctaLocation: "guide_body",
                }}
              >
                Open calculator
                <ArrowRight className="ml-2 size-4" />
              </TrackedLink>
            </Button>
          </div>
        </article>

        <aside className="grid h-fit gap-4 lg:sticky lg:top-24">
          {destination ? (
            <Link
              href={`/destinations/${destination.slug}`}
              className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-300"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">Destination profile</p>
              <p className="mt-2 text-lg font-semibold">{destination.name}</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">{destination.shortDescription}</p>
            </Link>
          ) : null}
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Related guides</p>
            <div className="mt-4 grid gap-3">
              {relatedGuides.map((relatedGuide) => (
                <Link key={relatedGuide.slug} href={`/guides/${relatedGuide.slug}`} className="text-sm font-semibold text-blue-700 hover:underline">
                  {relatedGuide.title}
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}
