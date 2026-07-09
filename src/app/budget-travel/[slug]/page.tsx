import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { StrongSeoTravelPage } from "@/components/programmatic/StrongSeoTravelPage";
import {
  getStrongSeoPageByKindAndSlug,
  getStrongSeoStaticParams,
} from "@/lib/programmatic/strong-seo-pages";
import { createMetadata } from "@/lib/seo/metadata";

type BudgetTravelPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getStrongSeoStaticParams("origin-destination");
}

export async function generateMetadata({ params }: BudgetTravelPageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = getStrongSeoPageByKindAndSlug("origin-destination", slug);

  if (!page) {
    return createMetadata({
      title: "Budget Travel Guide Not Found",
      description: "This GoByBudget.com budget travel guide could not be found.",
      path: `/budget-travel/${slug}`,
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

export default async function BudgetTravelPage({ params }: BudgetTravelPageProps) {
  const { slug } = await params;
  const page = getStrongSeoPageByKindAndSlug("origin-destination", slug);

  if (!page) {
    notFound();
  }

  return <StrongSeoTravelPage page={page} />;
}
