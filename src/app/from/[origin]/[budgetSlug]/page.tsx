import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProgrammaticBudgetPage } from "@/components/programmatic/ProgrammaticBudgetPage";
import {
  getMatchingBudgetDestinations,
  getProgrammaticBudgetPage,
  getProgrammaticBudgetPath,
  programmaticBudgetPages,
} from "@/lib/programmatic/budget-pages";
import { createMetadata } from "@/lib/seo/metadata";
import {
  createBreadcrumbSchema,
  createCollectionPageSchema,
  createFAQSchema,
  createItemListSchema,
  serializeJsonLd,
  type FAQItem,
} from "@/lib/seo/schema";

type BudgetPageProps = {
  params: Promise<{
    origin: string;
    budgetSlug: string;
  }>;
};

export function generateStaticParams() {
  return programmaticBudgetPages.map((page) => ({
    origin: page.origin.slug,
    budgetSlug: `under-${page.budget}`,
  }));
}

export async function generateMetadata({ params }: BudgetPageProps): Promise<Metadata> {
  const { origin, budgetSlug } = await params;
  const page = getProgrammaticBudgetPage(origin, budgetSlug);

  if (!page) {
    return createMetadata({
      title: "Budget Trip Page Not Found",
      description: "This TravelBudget.ai programmatic budget page could not be found.",
      path: `/from/${origin}/${budgetSlug}`,
      noIndex: true,
    });
  }

  const pageDescription = createPageDescription(page.origin.city, page.budget);

  return createMetadata({
    title: `Best Trips from ${page.origin.city} Under $${page.budget.toLocaleString("en-CA")}`,
    description: pageDescription,
    path: getProgrammaticBudgetPath(page),
    robots: {
      index: true,
      follow: true,
    },
    imageAlt: `Best trips from ${page.origin.city} under $${page.budget.toLocaleString("en-CA")}`,
  });
}

export default async function FromOriginUnderBudgetPage({ params }: BudgetPageProps) {
  const { origin, budgetSlug } = await params;
  const page = getProgrammaticBudgetPage(origin, budgetSlug);

  if (!page) {
    notFound();
  }

  const matches = getMatchingBudgetDestinations(page);
  const path = getProgrammaticBudgetPath(page);
  const pageDescription = createPageDescription(page.origin.city, page.budget);
  const faqs = createBudgetFaqs({
    originCity: page.origin.city,
    budget: page.budget,
    currency: page.currency,
    destinationNames: matches.map((item) => item.destination.name),
    cheapestDestinationName: matches[0]?.destination.name ?? null,
  });
  const jsonLd = [
    createCollectionPageSchema({
      name: `Best Trips from ${page.origin.city} Under $${page.budget.toLocaleString("en-CA")}`,
      description: pageDescription,
      path,
    }),
    createItemListSchema(
      matches.map((item) => ({
        name: item.destination.name,
        url: `/destinations/${item.destination.slug}`,
        description: item.destination.shortDescription,
      }))
    ),
    createFAQSchema(faqs),
    createBreadcrumbSchema([
      { name: "Home", url: "/" },
      { name: `Best Trips from ${page.origin.city} Under $${page.budget.toLocaleString("en-CA")}`, url: path },
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
      <ProgrammaticBudgetPage page={page} faqs={faqs} />
    </>
  );
}

function createPageDescription(originCity: string, budget: number) {
  return `Discover the best travel destinations from ${originCity} under $${budget.toLocaleString(
    "en-CA"
  )} CAD, with estimated flight costs, daily expenses, trip length ideas, and realistic budget breakdowns.`;
}

function createBudgetFaqs({
  originCity,
  budget,
  currency,
  destinationNames,
  cheapestDestinationName,
}: {
  originCity: string;
  budget: number;
  currency: string;
  destinationNames: string[];
  cheapestDestinationName: string | null;
}): FAQItem[] {
  const budgetLabel = `$${budget.toLocaleString("en-CA")}`;
  const destinationList =
    destinationNames.length > 0
      ? destinationNames.join(", ")
      : "destinations that fit the available pricing data";

  return [
    {
      question: `What are the best destinations from ${originCity} under ${budgetLabel}?`,
      answer: `Based on the current TravelBudget.ai estimates, the matching destinations are ${destinationList}.`,
    },
    {
      question: `Is ${budgetLabel} enough for an international trip from ${originCity}?`,
      answer: `Yes, ${budgetLabel} can be enough for some international trips from ${originCity}, especially when flights are reasonable and daily costs are moderate.`,
    },
    {
      question: "Does the budget include flights?",
      answer:
        "Yes. The estimates include round-trip flights, accommodation, food, local transport, activities, and miscellaneous daily costs.",
    },
    {
      question: `How many days can I travel with ${budgetLabel}?`,
      answer:
        "This page uses a 10-day mid-range estimate and highlights 7-10 days as the practical planning range for this budget.",
    },
    {
      question: `What is the cheapest destination from ${originCity}?`,
      answer: cheapestDestinationName
        ? `${cheapestDestinationName} currently has the lowest total estimate among the matching destinations on this page.`
        : "There is no cheapest match yet because no destination currently fits this budget with the available data.",
    },
    {
      question: `Are prices shown in ${currency}?`,
      answer: `Yes. Prices on this page are shown as estimated ${currency} planning amounts, not live booking prices.`,
    },
  ];
}
