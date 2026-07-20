import type { GeneratedContent, SocialMetricSnapshot, ExperimentDimensions } from "@/lib/social-content/domain/types";

export function createEmptyMetricSnapshot(content: GeneratedContent): SocialMetricSnapshot {
  return {
    contentId: content.id,
    platform: content.request.platform,
    collectedAt: new Date().toISOString(),
    views: 0,
    reach: 0,
    watchTimeSeconds: 0,
    averageWatchSeconds: 0,
    retention3sRate: 0,
    completionRate: 0,
    likes: 0,
    comments: 0,
    shares: 0,
    saves: 0,
    profileVisits: 0,
    gobybudgetClicks: 0,
    gobybudgetSearches: 0,
    conversions: 0,
    attributedRevenue: 0,
  };
}

export function getExperimentDimensions(content: GeneratedContent): ExperimentDimensions {
  return {
    hook: content.hook ?? null,
    destinationSlugs: content.topic?.destinationSlugs ?? [],
    origin: content.request.origin,
    budget: content.request.budget,
    durationDays: content.request.durationDays,
    language: content.request.language,
    template: content.request.template,
    videoDurationSeconds: content.media?.durationSeconds ?? null,
    platform: content.request.platform,
    cta: content.captions?.cta ?? null,
  };
}
