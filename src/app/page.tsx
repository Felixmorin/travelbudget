import { HomeContent } from "@/components/site/home-content";
import { createMetadata } from "@/lib/seo/metadata";
import {
  createFAQSchema,
  createOrganizationSchema,
  createWebPageSchema,
  createWebSiteSchema,
  serializeJsonLd,
} from "@/lib/seo/schema";

export const metadata = createMetadata({
  title: "Where Can I Travel With My Budget? | GoByBudget",
  description:
    "See where your travel budget can take you. Compare destinations by total trip cost, including flights, hotels, food, transport, and activities.",
  socialDescription:
    "Find where you can travel with your budget using realistic trip estimates for flights, stays, food, transport, and activities.",
  path: "/",
  robots: {
    index: true,
    follow: true,
  },
});

const homeFaqs = [
  {
    question: "What does GoByBudget include in a travel budget?",
    answer:
      "GoByBudget estimates flights, accommodation, food, local transportation, activities, and travel style assumptions to show a realistic total trip cost.",
  },
  {
    question: "Is GoByBudget a travel budget calculator?",
    answer:
      "Yes. You can use it to estimate trip costs, but the homepage is designed to help you discover where your budget can take you before choosing a destination.",
  },
  {
    question: "Are the estimates live booking prices?",
    answer:
      "No. They are planning estimates. Flight and hotel prices change often, so verify live prices before booking.",
  },
  {
    question: "Can I choose my departure city?",
    answer:
      "Yes. GoByBudget supports major departure cities such as Montreal, Toronto, Vancouver, Calgary, Ottawa, New York, and more.",
  },
  {
    question: "Can I compare destinations with the same budget?",
    answer:
      "Yes. Enter your budget and trip details to compare destinations across flights, stays, daily costs, and activities.",
  },
  {
    question: "Which currencies does GoByBudget support?",
    answer:
      "GoByBudget supports CAD, USD, EUR, and GBP so travelers can compare trip estimates in a familiar currency.",
  },
  {
    question: "Does the estimate include flights and hotels?",
    answer:
      "Yes. Flights and accommodation are included along with food, local transport, and activities.",
  },
  {
    question: "Can I find affordable destinations under a fixed budget?",
    answer:
      "Yes. Use the budget search or browse destination pages for trips under amounts such as $1,000, $2,000, $3,000, or $5,000 CAD.",
  },
];

export default function Home() {
  const jsonLd = [
    createWebSiteSchema(),
    createOrganizationSchema(),
    createWebPageSchema({
      name: "Find where you can travel with your budget",
      description:
        "Enter your total trip budget, departure city, trip length, and travel style to compare destinations by realistic total trip cost.",
      path: "/",
      about: ["Travel budget planning", "Trip cost estimates", "Destinations by budget"],
    }),
    createFAQSchema(homeFaqs),
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(jsonLd),
        }}
      />
      <HomeContent faqs={homeFaqs} />
    </>
  );
}
