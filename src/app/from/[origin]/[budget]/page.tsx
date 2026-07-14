import type { Metadata } from "next";
import { permanentRedirect } from "next/navigation";

import { ProgrammaticBudgetPage } from "@/components/programmatic/ProgrammaticBudgetPage";
import {
  type BudgetDestination,
  getMatchingBudgetDestinations,
  getProgrammaticBudgetPage,
  getProgrammaticBudgetPath,
  getProgrammaticBudgetRedirectPath,
} from "@/lib/programmatic/budget-pages";
import { getAllSeoRegistryPages, getOriginBudgetStaticParams } from "@/lib/programmatic/seo-registry";
import { getCityCountryLabel } from "@/lib/data/unified-destinations";
import { formatList } from "@/lib/format-list";
import { formatMoney } from "@/lib/format-money";
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
    budget: string;
  }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return getOriginBudgetStaticParams();
}

export async function generateMetadata({ params }: BudgetPageProps): Promise<Metadata> {
  const { origin, budget } = await params;
  const page = getProgrammaticBudgetPage(origin, budget);

  if (!page) {
    return createMetadata({
      title: "Budget Trip Page Not Found",
      description: "This GoByBudget.com programmatic budget page could not be found.",
      path: `/from/${origin}/${budget}`,
      noIndex: true,
    });
  }

  const pageDescription = createPageDescription(page.origin.city, page.budget);
  const registryPage = getAllSeoRegistryPages().find((item) => item.path === getProgrammaticBudgetPath(page));

  return createMetadata({
    title: registryPage?.title ?? `Trips From ${page.origin.city} Under $${page.budget.toLocaleString("en-CA")} CAD`,
    description: pageDescription,
    path: getProgrammaticBudgetPath(page),
    imageAlt: `Best trips from ${page.origin.city} under $${page.budget.toLocaleString("en-CA")}`,
    noIndex: registryPage?.evaluation.status !== "index",
  });
}

export default async function FromOriginUnderBudgetPage({ params }: BudgetPageProps) {
  const { origin, budget } = await params;
  const page = getProgrammaticBudgetPage(origin, budget);

  if (!page) {
    permanentRedirect(getProgrammaticBudgetRedirectPath(origin));
  }

  const matches = getMatchingBudgetDestinations(page);
  const path = getProgrammaticBudgetPath(page);
  const pageDescription = createPageDescription(page.origin.city, page.budget);
  const faqs = createBudgetFaqs({
    originCity: page.origin.city,
    budget: page.budget,
    currency: page.currency,
    suggestedTripLength: page.suggestedTripLength,
    matches,
  });
  const jsonLd = [
    createCollectionPageSchema({
      name: `Affordable Trips From ${page.origin.city} Under $${page.budget.toLocaleString("en-CA")}`,
      description: pageDescription,
      path,
    }),
    createItemListSchema(
      matches.map((item) => ({
        name: getCityCountryLabel(item.destination),
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
      <ProgrammaticBudgetPage page={page} matches={matches} faqs={faqs} />
    </>
  );
}

function createPageDescription(originCity: string, budget: number) {
  return `Find affordable trips from ${originCity} under $${budget.toLocaleString(
    "en-CA"
  )} CAD, with estimated flight costs, daily expenses, trip length ideas, and realistic budget breakdowns.`;
}

function createBudgetFaqs({
  originCity,
  budget,
  currency,
  suggestedTripLength,
  matches,
}: {
  originCity: string;
  budget: number;
  currency: string;
  suggestedTripLength: string;
  matches: BudgetDestination[];
}): FAQItem[] {
  const budgetLabel = formatMoney(budget, currency);
  const destinationNames = matches.slice(0, 5).map((item) => getCityCountryLabel(item.destination));
  const cheapest = matches[0] ?? null;
  const bestValue =
    matches.length > 0
      ? [...matches].sort(
          (a, b) => b.destination.score / b.totalEstimate - a.destination.score / a.totalEstimate
        )[0]
      : null;
  const stylePick = findStylePick(matches, ["Beach", "Culture", "Food", "Adventure"]);
  const stretchPick = matches.find((item) => item.budgetRemaining <= budget * 0.15) ?? matches.at(-1) ?? null;

  if (!cheapest) {
    return [
      {
        question: `Which destinations fit under ${budgetLabel} from ${originCity}?`,
        answer: `No listed destinations currently fit under ${budgetLabel} ${currency} from ${originCity}. A shorter trip or a higher budget would open more destination options.`,
      },
    ];
  }

  const selectedBestValue = bestValue ?? cheapest;
  const selectedStretchPick = stretchPick ?? cheapest;

  return [
    {
      question: `Which destinations fit under ${budgetLabel} from ${originCity}?`,
      answer: `${formatList(destinationNames)} fit under ${budgetLabel} ${currency} from ${originCity} for the listed ${suggestedTripLength} trip range.`,
    },
    {
      question: `What is the cheapest destination under ${budgetLabel} from ${originCity}?`,
      answer: `${getCityCountryLabel(cheapest.destination)} is the lowest listed match at about ${formatMoney(
        cheapest.totalEstimate,
        currency
      )}, leaving roughly ${formatMoney(cheapest.budgetRemaining, currency)} inside the ${budgetLabel} budget.`,
    },
    {
      question: `Which destination is the best value under ${budgetLabel}?`,
      answer: `${getCityCountryLabel(selectedBestValue.destination)} is the strongest value pick because it balances a competitive total estimate with a high destination score.`,
    },
    {
      question: `Which destination is a stretch pick under ${budgetLabel}?`,
      answer: `${getCityCountryLabel(selectedStretchPick.destination)} is closer to the top of the budget at about ${formatMoney(
        selectedStretchPick.totalEstimate,
        currency
      )}, so it can work if dates and accommodation stay favorable.`,
    },
    {
      question: stylePick
        ? `Which ${stylePick.style.toLowerCase()} destination fits under ${budgetLabel} from ${originCity}?`
        : `What kind of destination fits under ${budgetLabel} from ${originCity}?`,
      answer: stylePick
        ? `${getCityCountryLabel(stylePick.item.destination)} is the best listed ${stylePick.style.toLowerCase()} match under ${budgetLabel} from ${originCity}.`
        : `${getCityCountryLabel(cheapest.destination)} is the clearest fit under ${budgetLabel}, with the lowest total among the listed destinations.`,
    },
  ];
}

function findStylePick(matches: BudgetDestination[], styles: string[]) {
  for (const style of styles) {
    const item = matches.find((match) =>
      match.destination.travelStyles.some((travelStyle) => travelStyle.toLowerCase() === style.toLowerCase())
    );

    if (item) {
      return { item, style };
    }
  }

  return null;
}
