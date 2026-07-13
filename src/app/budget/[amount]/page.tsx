import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PilotBudgetAmountPage } from "@/components/programmatic/PilotSeoPages";
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
  getBudgetAmountPage,
  getBudgetAmountPath,
  getBudgetAmountStaticParams,
} from "@/lib/programmatic/seo-registry";
import { getCityCountryLabel } from "@/lib/data/unified-destinations";

type BudgetAmountPageProps = {
  params: Promise<{ amount: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return getBudgetAmountStaticParams();
}

export async function generateMetadata({ params }: BudgetAmountPageProps): Promise<Metadata> {
  const { amount } = await params;
  const page = getBudgetAmountPage(amount);
  const registryPage = getAllSeoRegistryPages().find((item) => item.path === getBudgetAmountPath(Number(amount)));

  if (!page || !registryPage) {
    return createMetadata({
      title: "Budget Page Not Found",
      description: "This GoByBudget.com budget page could not be found.",
      path: `/budget/${amount}`,
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

export default async function BudgetAmountRoute({ params }: BudgetAmountPageProps) {
  const { amount } = await params;
  const page = getBudgetAmountPage(amount);

  if (!page) {
    notFound();
  }

  const title = `Where can you travel for $${page.amount.toLocaleString("en-CA")} CAD?`;
  const description = `Destinations that fit a $${page.amount.toLocaleString("en-CA")} CAD trip budget from supported Canadian departure cities.`;
  const faqs = [
    {
      question: `Does the $${page.amount.toLocaleString("en-CA")} CAD budget include flights?`,
      answer:
        "Yes. Matching destinations include estimated flights plus accommodation, meals, local transport, activities, and a buffer.",
    },
    {
      question: "Why are some budgets not indexable?",
      answer:
        "A budget page should be indexed only when the dataset has enough complete, distinct destination matches to avoid thin content.",
    },
  ];
  const jsonLd = [
    createCollectionPageSchema({ name: title, description, path: page.path }),
    createItemListSchema(
      page.matches.map((item) => ({
        name: getCityCountryLabel(item.destination),
        url: `/destinations/${item.destination.slug}`,
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
      <PilotBudgetAmountPage page={page} />
    </>
  );
}
