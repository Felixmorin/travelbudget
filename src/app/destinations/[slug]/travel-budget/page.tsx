import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { StrongSeoTravelPage } from "@/components/programmatic/StrongSeoTravelPage";
import {
  getDestinationBudgetStrongSeoStaticParams,
  getStrongSeoPageByDestinationBudgetSlug,
} from "@/lib/programmatic/strong-seo-pages";
import { createMetadata } from "@/lib/seo/metadata";

type DestinationTravelBudgetPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getDestinationBudgetStrongSeoStaticParams();
}

export async function generateMetadata({ params }: DestinationTravelBudgetPageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = getStrongSeoPageByDestinationBudgetSlug(slug);

  if (!page) {
    return createMetadata({
      title: "Destination Travel Budget Not Found",
      description: "This GoByBudget.com destination travel budget guide could not be found.",
      path: `/destinations/${slug}/travel-budget`,
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

export default async function DestinationTravelBudgetPage({ params }: DestinationTravelBudgetPageProps) {
  const { slug } = await params;
  const page = getStrongSeoPageByDestinationBudgetSlug(slug);

  if (!page) {
    notFound();
  }

  return <StrongSeoTravelPage page={page} />;
}
