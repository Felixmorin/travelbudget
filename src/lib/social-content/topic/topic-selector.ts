import { recommendDestinations } from "@/lib/budget/recommend-destinations";
import { getUnifiedDestination, unifiedDestinations } from "@/lib/data/unified-destinations";
import type { ContentRepository } from "@/lib/social-content/data/content-repository";
import {
  getBudgetBreakdownForDestination,
  getLandingPagePathForBudget,
  getLandingPagePathForComparison,
  getLandingPagePathForDestination,
} from "@/lib/social-content/data/gobybudget-content-source";
import { validateGoByBudgetEstimate } from "@/lib/social-content/data/data-validation";
import { SocialContentError } from "@/lib/social-content/domain/errors";
import type { ContentRequest, ContentTopic, GeneratedContent } from "@/lib/social-content/domain/types";

export type TopicCandidate = {
  topic: ContentTopic;
  primaryDestinationSlug: string;
  destinationSlugs: string[];
  validationWarnings: string[];
  validationErrors: string[];
  estimatedTotal: number;
};

export type TopicSelectionResult = {
  selected: TopicCandidate;
  rejected: TopicCandidate[];
};

export type TopicSelectorOptions = {
  staleDataDays: number;
  now?: Date;
};

export class TopicAgent {
  private repository?: ContentRepository;
  private options: TopicSelectorOptions;

  constructor({ repository, options }: { repository?: ContentRepository; options: TopicSelectorOptions }) {
    this.repository = repository;
    this.options = options;
  }

  async selectTopic(request: ContentRequest): Promise<TopicSelectionResult> {
    const previousContent = this.repository ? await this.repository.listContent() : [];
    const duplicateKeys = new Set(previousContent.map(getTopicDuplicateKey));
    const candidates = buildTopicCandidates(request, this.options)
      .filter((candidate) => !duplicateKeys.has(getCandidateDuplicateKey(candidate)))
      .sort((first, second) => second.topic.score - first.topic.score || first.estimatedTotal - second.estimatedTotal);
    const selected = candidates.find((candidate) => candidate.validationErrors.length === 0);

    if (!selected) {
      throw new SocialContentError("no_valid_topic", "No valid GoByBudget-backed social content topic is available.", {
        candidates: candidates.length,
      });
    }

    return {
      selected,
      rejected: candidates.filter((candidate) => candidate !== selected),
    };
  }
}

export function buildTopicCandidates(request: ContentRequest, options: TopicSelectorOptions): TopicCandidate[] {
  if (request.template === "destination_cost" || request.template === "daily_budget") {
    return request.destination ? [buildSingleDestinationCandidate(request, request.destination, options)] : [];
  }

  if (request.template === "destination_comparison") {
    return request.destination && request.comparisonDestination
      ? [buildComparisonCandidate(request, request.destination, request.comparisonDestination, options)]
      : [];
  }

  return buildThreeDestinationsCandidates(request, options);
}

function buildThreeDestinationsCandidates(request: ContentRequest, options: TopicSelectorOptions): TopicCandidate[] {
  const recommendations = recommendDestinations({
    destinations: unifiedDestinations,
    budget: request.budget,
    currency: request.currency,
    origin: request.origin,
    days: request.durationDays,
    month: request.month ?? "",
    travelers: request.travelers,
    style: request.travelStyle,
  })
    .filter((recommendation) => recommendation.budgetFitStatus !== "over-budget")
    .slice(0, 12);
  const groups: TopicCandidate[] = [];

  for (let index = 0; index <= recommendations.length - 3; index += 1) {
    const group = recommendations.slice(index, index + 3);
    const destinationSlugs = group.map((item) => item.destination.slug);
    const primary = group[0];
    const landingPagePath = getLandingPagePathForBudget(request);
    const validation = validateCandidateDestinations(request, destinationSlugs, options, landingPagePath);
    const score = clampScore(
      Math.round(
        group.reduce((total, item) => total + item.matchScore, 0) / group.length +
          getSeasonalityBonus(request, destinationSlugs) +
          getLandingPageBonus(landingPagePath) -
          validation.errors.length * 30 -
          validation.warnings.length * 4
      )
    );

    groups.push({
      topic: {
        id: crypto.randomUUID(),
        title: getThreeDestinationsTitle(request),
        template: request.template,
        origin: request.origin,
        destinationSlugs,
        budget: request.budget,
        currency: request.currency,
        durationDays: request.durationDays,
        language: request.language,
        platform: request.platform,
        score,
        landingPagePath,
        reasons: [
          `Top ${group.length} destinations fit the ${request.currency} ${request.budget} budget.`,
          `Best estimate in group: ${primary.destination.name} at ${Math.round(primary.estimatedTotal)} ${request.currency}.`,
          ...primary.reasons.slice(0, 2),
        ],
      },
      primaryDestinationSlug: primary.destination.slug,
      destinationSlugs,
      validationWarnings: validation.warnings,
      validationErrors: validation.errors,
      estimatedTotal: primary.estimatedTotal,
    });
  }

  return groups;
}

function buildSingleDestinationCandidate(
  request: ContentRequest,
  destinationSlugOrName: string,
  options: TopicSelectorOptions
): TopicCandidate {
  const destination = resolveDestination(destinationSlugOrName);
  const landingPagePath = getLandingPagePathForDestination(destination.slug);
  const validation = validateCandidateDestinations(request, [destination.slug], options, landingPagePath);
  const breakdown = getBudgetBreakdownForDestination(request, destination.slug);
  const budgetFitPenalty = breakdown.total > request.budget ? Math.min(30, Math.round((breakdown.total / request.budget - 1) * 60)) : 0;
  const score = clampScore(
    destination.score * 0.55 +
      getSeasonalityBonus(request, [destination.slug]) +
      getLandingPageBonus(landingPagePath) -
      budgetFitPenalty -
      validation.errors.length * 30 -
      validation.warnings.length * 4
  );

  return {
    topic: {
      id: crypto.randomUUID(),
      title: getSingleDestinationTitle(request, destination.name),
      template: request.template,
      origin: request.origin,
      destinationSlugs: [destination.slug],
      budget: request.budget,
      currency: request.currency,
      durationDays: request.durationDays,
      language: request.language,
      platform: request.platform,
      score: Math.round(score),
      landingPagePath,
      reasons: [
        `${destination.name} has a GoByBudget estimate and destination page.`,
        `Estimated total is ${breakdown.total} ${breakdown.currency} for ${request.durationDays} days.`,
      ],
    },
    primaryDestinationSlug: destination.slug,
    destinationSlugs: [destination.slug],
    validationWarnings: validation.warnings,
    validationErrors: validation.errors,
    estimatedTotal: breakdown.total,
  };
}

function buildComparisonCandidate(
  request: ContentRequest,
  firstDestination: string,
  secondDestination: string,
  options: TopicSelectorOptions
): TopicCandidate {
  const first = resolveDestination(firstDestination);
  const second = resolveDestination(secondDestination);
  const destinationSlugs = [first.slug, second.slug];
  const landingPagePath = getLandingPagePathForComparison(first.slug, second.slug);

  if (!landingPagePath) {
    throw new SocialContentError("missing_landing_page", `No GoByBudget comparison page exists for ${first.name} vs ${second.name}.`);
  }
  const validation = validateCandidateDestinations(request, destinationSlugs, options, landingPagePath);
  const firstBreakdown = getBudgetBreakdownForDestination(request, first.slug);
  const secondBreakdown = getBudgetBreakdownForDestination(request, second.slug);
  const score = clampScore(
    Math.round(
      (first.score + second.score) * 0.28 +
        getSeasonalityBonus(request, destinationSlugs) +
        getLandingPageBonus(landingPagePath) -
        validation.errors.length * 30 -
        validation.warnings.length * 4
    )
  );

  return {
    topic: {
      id: crypto.randomUUID(),
      title: `${first.name} vs ${second.name} with ${request.currency} ${request.budget}`,
      template: request.template,
      origin: request.origin,
      destinationSlugs,
      budget: request.budget,
      currency: request.currency,
      durationDays: request.durationDays,
      language: request.language,
      platform: request.platform,
      score,
      landingPagePath,
      reasons: [
        `${first.name} estimate: ${firstBreakdown.total} CAD.`,
        `${second.name} estimate: ${secondBreakdown.total} CAD.`,
      ],
    },
    primaryDestinationSlug: first.slug,
    destinationSlugs,
    validationWarnings: validation.warnings,
    validationErrors: validation.errors,
    estimatedTotal: Math.min(firstBreakdown.total, secondBreakdown.total),
  };
}

function validateCandidateDestinations(
  request: ContentRequest,
  destinationSlugs: string[],
  options: TopicSelectorOptions,
  landingPagePath: string
) {
  return destinationSlugs.reduce(
    (result, destinationSlug) => {
      const validation = validateGoByBudgetEstimate({
        request,
        destinationSlug,
        breakdown: getBudgetBreakdownForDestination(request, destinationSlug),
        staleDataDays: options.staleDataDays,
        landingPagePath,
      });

      return {
        warnings: [...result.warnings, ...validation.warnings],
        errors: [...result.errors, ...validation.errors],
      };
    },
    { warnings: [] as string[], errors: [] as string[] }
  );
}

function resolveDestination(value: string) {
  const normalized = value.trim().toLowerCase();
  const destination = getUnifiedDestination(normalized) ?? unifiedDestinations.find((item) => item.name.toLowerCase() === normalized);

  if (!destination) {
    throw new SocialContentError("unknown_destination", `Unknown destination: ${value}.`);
  }

  return destination;
}

function getSeasonalityBonus(request: ContentRequest, destinationSlugs: string[]) {
  if (!request.month) {
    return 0;
  }

  return destinationSlugs.filter((slug) =>
    getUnifiedDestination(slug)?.bestMonths.some((month) => month.toLowerCase() === request.month?.toLowerCase())
  ).length * 4;
}

function getLandingPageBonus(path: string) {
  if (path.startsWith("/destinations/")) return 10;
  if (path.startsWith("/compare/")) return 8;
  if (path.startsWith("/budget/")) return 6;
  return 3;
}

function getTopicDuplicateKey(content: GeneratedContent) {
  return [
    content.request.template,
    content.request.origin.toLowerCase(),
    content.topic?.destinationSlugs.join(",") ?? content.request.destination ?? "",
    content.request.budget,
    content.request.durationDays,
    content.request.language,
    content.request.platform,
  ].join("|");
}

function getCandidateDuplicateKey(candidate: TopicCandidate) {
  return [
    candidate.topic.template,
    candidate.topic.origin.toLowerCase(),
    candidate.topic.destinationSlugs.join(","),
    candidate.topic.budget,
    candidate.topic.durationDays,
    candidate.topic.language,
    candidate.topic.platform,
  ].join("|");
}

function getThreeDestinationsTitle(request: ContentRequest) {
  return request.language === "fr"
    ? `3 destinations ou voyager avec ${request.budget} ${request.currency}`
    : `3 destinations to visit with ${request.currency} ${request.budget}`;
}

function getSingleDestinationTitle(request: ContentRequest, destinationName: string) {
  if (request.template === "daily_budget") {
    return request.language === "fr"
      ? `Ce que ${Math.round(request.budget / request.durationDays)} ${request.currency} par jour donne a ${destinationName}`
      : `What ${request.currency} ${Math.round(request.budget / request.durationDays)} a day gets you in ${destinationName}`;
  }

  return request.language === "fr"
    ? `Le cout estime de ${request.durationDays} jours a ${destinationName}`
    : `The estimated cost of ${request.durationDays} days in ${destinationName}`;
}

function clampScore(value: number) {
  return Math.max(0, Math.min(100, value));
}
