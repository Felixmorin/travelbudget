import { formatCurrency } from "@/lib/currency/exchange-rates";
import { getUnifiedDestination } from "@/lib/data/unified-destinations";
import { getBudgetBreakdownForDestination } from "@/lib/social-content/data/gobybudget-content-source";
import { SocialContentError } from "@/lib/social-content/domain/errors";
import type { BudgetBreakdown, ContentRequest, ContentTopic, GeneratedContent } from "@/lib/social-content/domain/types";
import { validateNumericClaims, type AllowedNumericClaim } from "@/lib/social-content/script/number-guard";

export type GeneratedScript = {
  hook: string;
  script: string;
  allowedNumericClaims: AllowedNumericClaim[];
  numericClaims: number[];
  warnings: string[];
};

type DestinationScriptData = {
  slug: string;
  name: string;
  breakdown: BudgetBreakdown;
};

export class ScriptAgent {
  generate(content: GeneratedContent): GeneratedScript {
    if (!content.topic || !content.budgetBreakdown) {
      throw new SocialContentError("missing_script_inputs", "Script generation requires a selected topic and validated budget data.");
    }

    const destinations = getDestinationScriptData(content.request, content.topic);
    const generated = generateScriptForTemplate(content.request, content.topic, destinations);
    const allowedNumericClaims = getAllowedNumericClaims(content.request, destinations);
    const validation = validateNumericClaims(`${generated.hook}\n${generated.script}`, allowedNumericClaims);

    if (!validation.ok) {
      throw new SocialContentError("unauthorized_numeric_claim", "Script contains numeric claims that were not present in validated GoByBudget data.", {
        unauthorizedClaims: validation.unauthorizedClaims.join(", "),
      });
    }

    return {
      ...generated,
      allowedNumericClaims,
      numericClaims: validation.claims,
      warnings: [
        "Scripts use GoByBudget planning estimates, not live booking prices or guarantees.",
      ],
    };
  }
}

function generateScriptForTemplate(
  request: ContentRequest,
  topic: ContentTopic,
  destinations: DestinationScriptData[]
) {
  if (request.template === "destination_cost") {
    return generateDestinationCostScript(request, destinations[0]);
  }

  if (request.template === "destination_comparison") {
    return generateComparisonScript(request, destinations[0], destinations[1]);
  }

  if (request.template === "daily_budget") {
    return generateDailyBudgetScript(request, destinations[0]);
  }

  return generateThreeDestinationsScript(request, topic, destinations);
}

function generateThreeDestinationsScript(request: ContentRequest, topic: ContentTopic, destinations: DestinationScriptData[]) {
  const hook =
    request.language === "fr"
      ? `Tu as ${formatMoney(request.budget, request.currency)} et ${request.durationDays} jours?`
      : `You have ${formatMoney(request.budget, request.currency)} and ${request.durationDays} days?`;

  if (request.language === "fr") {
    return {
      hook,
      script: [
        hook,
        `Depuis ${topic.origin}, ces ${destinations.length} destinations passent dans les estimations GoByBudget.`,
        ...destinations.map((destination) => `${destination.name}: environ ${formatMoney(destination.breakdown.total, destination.breakdown.currency)}.`),
        `${destinations[0].name} est l'option la plus basse de ce groupe.`,
        "Les prix sont des estimations, pas des garanties.",
        "Teste ton propre budget sur GoByBudget.",
      ].join("\n"),
    };
  }

  return {
    hook,
    script: [
      hook,
      `From ${topic.origin}, these ${destinations.length} destinations fit the GoByBudget estimates.`,
      ...destinations.map((destination) => `${destination.name}: around ${formatMoney(destination.breakdown.total, destination.breakdown.currency)}.`),
      `${destinations[0].name} is the lowest estimate in this group.`,
      "Prices are estimates, not guarantees.",
      "Test your own budget on GoByBudget.",
    ].join("\n"),
  };
}

function generateDestinationCostScript(request: ContentRequest, destination: DestinationScriptData) {
  const hook =
    request.language === "fr"
      ? `Le cout estime de ${request.durationDays} jours a ${destination.name}?`
      : `The estimated cost of ${request.durationDays} days in ${destination.name}?`;
  const lines =
    request.language === "fr"
      ? [
          hook,
          `GoByBudget estime ce voyage a environ ${formatMoney(destination.breakdown.total, destination.breakdown.currency)}.`,
          `Vols: ${formatMoney(destination.breakdown.flights, destination.breakdown.currency)}.`,
          `Hebergement: ${formatMoney(destination.breakdown.accommodation, destination.breakdown.currency)}.`,
          `Nourriture: ${formatMoney(destination.breakdown.food, destination.breakdown.currency)}.`,
          `Transport local et activites: ${formatMoney(destination.breakdown.localTransport + destination.breakdown.activities, destination.breakdown.currency)}.`,
          "Ce sont des estimations, pas des prix garantis.",
          "Compare ton budget sur GoByBudget.",
        ]
      : [
          hook,
          `GoByBudget estimates this trip at around ${formatMoney(destination.breakdown.total, destination.breakdown.currency)}.`,
          `Flights: ${formatMoney(destination.breakdown.flights, destination.breakdown.currency)}.`,
          `Accommodation: ${formatMoney(destination.breakdown.accommodation, destination.breakdown.currency)}.`,
          `Food: ${formatMoney(destination.breakdown.food, destination.breakdown.currency)}.`,
          `Local transport and activities: ${formatMoney(destination.breakdown.localTransport + destination.breakdown.activities, destination.breakdown.currency)}.`,
          "These are estimates, not guaranteed prices.",
          "Compare your budget on GoByBudget.",
        ];

  return { hook, script: lines.join("\n") };
}

function generateComparisonScript(request: ContentRequest, first: DestinationScriptData, second: DestinationScriptData) {
  const cheaper = first.breakdown.total <= second.breakdown.total ? first : second;
  const hook =
    request.language === "fr"
      ? `${first.name} ou ${second.name} avec ${formatMoney(request.budget, request.currency)}?`
      : `${first.name} or ${second.name} with ${formatMoney(request.budget, request.currency)}?`;
  const lines =
    request.language === "fr"
      ? [
          hook,
          `Depuis ${request.origin}, GoByBudget estime ${first.name} a environ ${formatMoney(first.breakdown.total, first.breakdown.currency)}.`,
          `${second.name}: environ ${formatMoney(second.breakdown.total, second.breakdown.currency)}.`,
          `${cheaper.name} est donc l'estimation la plus basse.`,
          "Les prix peuvent bouger selon les dates et disponibilites.",
          "Compare les deux sur GoByBudget.",
        ]
      : [
          hook,
          `From ${request.origin}, GoByBudget estimates ${first.name} at around ${formatMoney(first.breakdown.total, first.breakdown.currency)}.`,
          `${second.name}: around ${formatMoney(second.breakdown.total, second.breakdown.currency)}.`,
          `${cheaper.name} is the lower estimate.`,
          "Prices can move with dates and availability.",
          "Compare both on GoByBudget.",
        ];

  return { hook, script: lines.join("\n") };
}

function generateDailyBudgetScript(request: ContentRequest, destination: DestinationScriptData) {
  const dailyBudget = Math.round(request.budget / request.durationDays);
  const dailyLocal = Math.round((destination.breakdown.total - destination.breakdown.flights) / request.durationDays);
  const hook =
    request.language === "fr"
      ? `Ce que ${formatMoney(dailyBudget, request.currency)} par jour donne a ${destination.name}`
      : `What ${formatMoney(dailyBudget, request.currency)} a day gets you in ${destination.name}`;
  const lines =
    request.language === "fr"
      ? [
          hook,
          `Sur ${request.durationDays} jours, GoByBudget estime le voyage a ${formatMoney(destination.breakdown.total, destination.breakdown.currency)}.`,
          `Apres les vols, le cout local revient a environ ${formatMoney(dailyLocal, destination.breakdown.currency)} par jour.`,
          `Hebergement: ${formatMoney(destination.breakdown.accommodation, destination.breakdown.currency)} au total.`,
          `Nourriture: ${formatMoney(destination.breakdown.food, destination.breakdown.currency)} au total.`,
          "Ce sont des estimations de planification.",
          "Teste ton propre budget sur GoByBudget.",
        ]
      : [
          hook,
          `Over ${request.durationDays} days, GoByBudget estimates the trip at ${formatMoney(destination.breakdown.total, destination.breakdown.currency)}.`,
          `After flights, local costs are about ${formatMoney(dailyLocal, destination.breakdown.currency)} per day.`,
          `Accommodation: ${formatMoney(destination.breakdown.accommodation, destination.breakdown.currency)} total.`,
          `Food: ${formatMoney(destination.breakdown.food, destination.breakdown.currency)} total.`,
          "These are planning estimates.",
          "Test your own budget on GoByBudget.",
        ];

  return { hook, script: lines.join("\n") };
}

function getDestinationScriptData(request: ContentRequest, topic: ContentTopic) {
  return topic.destinationSlugs.map((slug) => {
    const destination = getUnifiedDestination(slug);

    if (!destination) {
      throw new SocialContentError("unknown_script_destination", `Unknown script destination: ${slug}.`);
    }

    return {
      slug,
      name: destination.name,
      breakdown: getBudgetBreakdownForDestination(request, slug),
    };
  });
}

function getAllowedNumericClaims(request: ContentRequest, destinations: DestinationScriptData[]): AllowedNumericClaim[] {
  return [
    { value: request.budget, label: "request budget" },
    { value: request.durationDays, label: "duration days" },
    { value: destinations.length, label: "destination count" },
    { value: Math.round(request.budget / request.durationDays), label: "daily request budget" },
    ...destinations.flatMap((destination) => [
      { value: destination.breakdown.total, label: `${destination.slug} total` },
      { value: destination.breakdown.flights, label: `${destination.slug} flights` },
      { value: destination.breakdown.accommodation, label: `${destination.slug} accommodation` },
      { value: destination.breakdown.food, label: `${destination.slug} food` },
      { value: destination.breakdown.localTransport, label: `${destination.slug} local transport` },
      { value: destination.breakdown.activities, label: `${destination.slug} activities` },
      {
        value: destination.breakdown.localTransport + destination.breakdown.activities,
        label: `${destination.slug} local transport and activities`,
      },
      {
        value: Math.round((destination.breakdown.total - destination.breakdown.flights) / request.durationDays),
        label: `${destination.slug} daily local cost`,
      },
    ]),
  ];
}

function formatMoney(amount: number, currency: string) {
  return formatCurrency(amount, currency);
}
