import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PilotTripLengthPage } from "@/components/programmatic/PilotSeoPages";
import { createMetadata } from "@/lib/seo/metadata";
import {
  createBreadcrumbSchema,
  createCollectionPageSchema,
  createFAQSchema,
  createItemListSchema,
  serializeJsonLd,
} from "@/lib/seo/schema";
import {
  getAllSeoRegistryPages,
  getTripLengthPage,
  getTripLengthPath,
  getTripLengthStaticParams,
  parseTripLengthSlug,
} from "@/lib/programmatic/seo-registry";
import { getCityCountryLabel } from "@/lib/data/unified-destinations";

type TripLengthPageProps = {
  params: Promise<{ duration: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return getTripLengthStaticParams();
}

export async function generateMetadata({ params }: TripLengthPageProps): Promise<Metadata> {
  const { duration } = await params;
  const days = parseTripLengthSlug(duration);
  const page = getTripLengthPage(duration);
  const registryPage = days
    ? getAllSeoRegistryPages().find((item) => item.path === getTripLengthPath(days))
    : null;

  if (!page || !registryPage) {
    return createMetadata({
      title: "Trip Length Page Not Found",
      description: "This GoByBudget.com trip length page could not be found.",
      path: `/trip-length/${duration}`,
      noIndex: true,
    });
  }

  return createMetadata({
    title: registryPage.title,
    description: registryPage.description,
    path: registryPage.canonicalPath,
    noIndex: registryPage.evaluation.status !== "index",
  });
}

export default async function TripLengthRoute({ params }: TripLengthPageProps) {
  const { duration } = await params;
  const page = getTripLengthPage(duration);

  if (!page) {
    notFound();
  }

  const title = `${page.days}-day trip budget estimates`;
  const description = `Compare ${page.days}-day trip budget estimates from Canada with flights, daily costs, and planning assumptions.`;
  const faqs = [
    {
      question: `Is ${page.days} days enough for an international trip?`,
      answer:
        "It depends on destination distance, flight cost, and daily costs. This page compares complete estimates so the tradeoff is visible.",
    },
    {
      question: "Are these trip length estimates live prices?",
      answer:
        "No. They are CAD planning estimates based on GoByBudget destination data and should be checked against live fares and stays before booking.",
    },
  ];
  const jsonLd = [
    createCollectionPageSchema({ name: title, description, path: page.path }),
    createItemListSchema(
      page.destinations.map((item) => ({
        name: getCityCountryLabel(item.destination),
        url: `/destinations/${item.destination.slug}/travel-budget`,
        description: item.destination.shortDescription,
      }))
    ),
    createFAQSchema(faqs),
    createBreadcrumbSchema([
      { name: "Home", url: "/" },
      { name: title, url: page.path },
    ]),
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(jsonLd),
        }}
      />
      <PilotTripLengthPage page={page} />
    </>
  );
}
