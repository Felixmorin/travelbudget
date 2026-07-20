import type { ContentRepository } from "@/lib/social-content/data/content-repository";
import { SocialContentError } from "@/lib/social-content/domain/errors";
import {
  getAllowedContentStatusTransitions,
  isTerminalContentStatus,
} from "@/lib/social-content/domain/state-machine";
import type { GeneratedContent } from "@/lib/social-content/domain/types";

export type ReviewQueueItem = {
  contentId: string;
  status: GeneratedContent["status"];
  title: string;
  template: string;
  platform: string;
  language: string;
  videoPath?: string;
  thumbnailPath?: string;
  script?: string;
  hook?: string;
  landingPageUrl?: string;
  captions: GeneratedContent["captions"];
  publicationResults: GeneratedContent["publicationResults"];
  data: {
    request: GeneratedContent["request"];
    topic?: GeneratedContent["topic"];
    budgetBreakdown?: GeneratedContent["budgetBreakdown"];
    numericClaims?: GeneratedContent["scriptValidation"];
    metrics?: GeneratedContent["metrics"];
    experimentDimensions?: GeneratedContent["experimentDimensions"];
  };
  media: GeneratedContent["media"];
  sources: Array<{
    sceneId: string;
    sourceUrl?: string;
    sourceLicense?: string;
  }>;
  warnings: string[];
  errors: string[];
  costEstimateUsd: number;
  availableActions: string[];
  createdAt: string;
  updatedAt: string;
};

export class ReviewQueue {
  private repository: ContentRepository;

  constructor(repository: ContentRepository) {
    this.repository = repository;
  }

  async list() {
    const contents = await this.repository.listReviewQueue();

    return contents.map(toReviewQueueItem);
  }

  async get(contentId: string) {
    const content = await this.repository.getContent(contentId);

    if (!content) {
      throw new SocialContentError("review_content_not_found", `Unknown content id: ${contentId}.`);
    }

    return toReviewQueueItem(content);
  }
}

export function toReviewQueueItem(content: GeneratedContent): ReviewQueueItem {
  return {
    contentId: content.id,
    status: content.status,
    title: content.topic?.title ?? content.hook ?? content.id,
    template: content.request.template,
    platform: content.request.platform,
    language: content.request.language,
    videoPath: content.videoPath,
    thumbnailPath: content.thumbnailPath,
    script: content.script,
    hook: content.hook,
    landingPageUrl: content.landingPageUrl,
    captions: content.captions,
    publicationResults: content.publicationResults,
    data: {
      request: content.request,
      topic: content.topic,
      budgetBreakdown: content.budgetBreakdown,
      numericClaims: content.scriptValidation,
      metrics: content.metrics,
      experimentDimensions: content.experimentDimensions,
    },
    media: content.media,
    sources: content.scenes.map((scene) => ({
      sceneId: scene.id,
      sourceUrl: scene.sourceUrl,
      sourceLicense: scene.sourceLicense,
    })),
    warnings: content.warnings,
    errors: content.errors,
    costEstimateUsd: content.costEstimateUsd,
    availableActions: getAvailableReviewActions(content),
    createdAt: content.createdAt,
    updatedAt: content.updatedAt,
  };
}

function getAvailableReviewActions(content: GeneratedContent) {
  const transitions = getAllowedContentStatusTransitions(content.status);
  const actions: string[] = [];

  if (transitions.includes("approved")) actions.push("approve");
  if (transitions.includes("rejected")) actions.push("reject");
  if (!isTerminalContentStatus(content.status) && content.topic && content.budgetBreakdown && content.script) {
    actions.push("regenerate-script");
  }
  if (!isTerminalContentStatus(content.status) && content.script) actions.push("regenerate-media");
  if (!isTerminalContentStatus(content.status) && content.topic && content.hook && content.landingPageUrl) {
    actions.push("regenerate-captions");
  }
  if (content.status === "approved" && content.videoPath && content.thumbnailPath && content.captions) {
    actions.push("simulate-publish");
  }

  return actions;
}
