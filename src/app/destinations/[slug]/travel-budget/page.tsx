import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { StrongSeoTravelPage } from "@/components/programmatic/StrongSeoTravelPage";
import { PilotDestinationBudgetPage } from "@/components/programmatic/PilotSeoPages";
import {
  getDestinationBudgetStrongSeoStaticParams,
  getStrongSeoPageByDestinationBudgetSlug,
} from "@/lib/programmatic/strong-seo-pages";
import { getCityCountryLabel } from "@/lib/data/unified-destinations";
import { createMetadata } from "@/lib/seo/metadata";
import {
  getDestinationBudgetStaticParams,
  getDestinationTravelBudgetPath,
  getPilotDestinationBudgetPage,
} from "@/lib/programmatic/seo-registry";

type DestinationTravelBudgetPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return uniqueStaticParams([
    ...getDestinationBudgetStrongSeoStaticParams(),
    ...getDestinationBudgetStaticParams(),
  ]);
}

export async function generateMetadata({ params }: DestinationTravelBudgetPageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = getStrongSeoPageByDestinationBudgetSlug(slug);
  const pilotPage = getPilotDestinationBudgetPage(slug);

  if (!page) {
    if (pilotPage) {
      const destinationLabel = getCityCountryLabel(pilotPage.destination);

      return createMetadata({
        title: `${destinationLabel} Travel Budget: Daily & Total Trip Cost`,
        description: `Plan a ${destinationLabel} travel budget in CAD with flights, daily costs, accommodation, meals, local transport, activities, best months, and confidence notes.`,
        path: pilotPage.path,
        image: pilotPage.destination.image,
        imageAlt: `${destinationLabel} travel budget`,
      });
    }

    return createMetadata({
      title: "Destination Travel Budget Not Found",
      description: "This GoByBudget.com destination travel budget guide could not be found.",
      path: getDestinationTravelBudgetPath(slug),
      noIndex: true,
    });
  }

  const destinationLabel = getCityCountryLabel(page.destination);

  return createMetadata({
    title: `${destinationLabel} Travel Budget: Daily & Total Trip Cost`,
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
  const pilotPage = getPilotDestinationBudgetPage(slug);

  if (!page) {
    if (pilotPage) {
      return (
        <PilotDestinationBudgetPage
          destination={pilotPage.destination}
          path={pilotPage.path}
          originCode={pilotPage.originCode}
          originCity={pilotPage.originCity}
          durationDays={pilotPage.durationDays}
          travelStyle={pilotPage.travelStyle}
        />
      );
    }

    notFound();
  }

  return <StrongSeoTravelPage page={page} />;
}

function uniqueStaticParams(params: Array<{ slug: string }>) {
  const seen = new Set<string>();

  return params.filter((param) => {
    if (seen.has(param.slug)) {
      return false;
    }

    seen.add(param.slug);
    return true;
  });
}
