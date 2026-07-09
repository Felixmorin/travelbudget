import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { StrongSeoTravelPage } from "@/components/programmatic/StrongSeoTravelPage";
import {
  getStrongSeoPageByKindAndSlug,
  getStrongSeoStaticParams,
} from "@/lib/programmatic/strong-seo-pages";
import { createMetadata } from "@/lib/seo/metadata";

type ItineraryPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getStrongSeoStaticParams("itinerary");
}

export async function generateMetadata({ params }: ItineraryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = getStrongSeoPageByKindAndSlug("itinerary", slug);

  if (!page) {
    return createMetadata({
      title: "Budget Itinerary Not Found",
      description: "This GoByBudget.com budget itinerary could not be found.",
      path: `/itineraries/${slug}`,
      noIndex: true,
    });
  }

  return createMetadata({
    title: page.title,
    description: page.metaDescription,
    path: page.path,
    image: page.destination.image,
    imageAlt: page.pinterest.altText,
    socialDescription: page.pinterest.description,
  });
}

export default async function ItineraryPage({ params }: ItineraryPageProps) {
  const { slug } = await params;
  const page = getStrongSeoPageByKindAndSlug("itinerary", slug);

  if (!page) {
    notFound();
  }

  return <StrongSeoTravelPage page={page} />;
}
