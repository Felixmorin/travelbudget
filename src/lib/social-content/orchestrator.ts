import { getSocialContentConfig, type SocialContentConfig } from "@/lib/social-content/config";
import { createEmptyMetricSnapshot, getExperimentDimensions } from "@/lib/social-content/analytics/metrics";
import { CaptionAgent } from "@/lib/social-content/caption/caption-generator";
import { createContentRepository, type ContentRepository } from "@/lib/social-content/data/content-repository";
import { getBudgetBreakdownForDestination, getLandingPagePathForRequest } from "@/lib/social-content/data/gobybudget-content-source";
import type { ContentRequest, GeneratedContent, SocialContentPlatform } from "@/lib/social-content/domain/types";
import { assertContentRequest } from "@/lib/social-content/domain/validation";
import { isTerminalContentStatus } from "@/lib/social-content/domain/state-machine";
import { MediaAgent } from "@/lib/social-content/media/media-agent";
import { SimulationPublisher } from "@/lib/social-content/publishing/simulation-publisher";
import { ApprovalService } from "@/lib/social-content/review/approval-service";
import { ReviewQueue } from "@/lib/social-content/review/review-queue";
import { ScriptAgent } from "@/lib/social-content/script/script-generator";
import { TopicAgent } from "@/lib/social-content/topic/topic-selector";

export type OrchestratorDependencies = {
  config?: SocialContentConfig;
  repository?: ContentRepository;
};

export class OrchestratorAgent {
  private config: SocialContentConfig;
  private repository: ContentRepository;

  constructor(dependencies: OrchestratorDependencies = {}) {
    this.config = dependencies.config ?? getSocialContentConfig();
    this.repository = dependencies.repository ?? createContentRepository(this.config);
  }

  async createDraft(request: ContentRequest): Promise<GeneratedContent> {
    assertContentRequest(request);

    const now = new Date().toISOString();
    const id = crypto.randomUUID();
    const runId = crypto.randomUUID();
    const landingPagePath = getLandingPagePathForRequest(request);
    const landingPageUrl = `${this.config.siteUrl}${landingPagePath}`;

    return this.repository.saveContent({
      id,
      runId,
      status: "draft",
      request: {
        ...request,
        dryRun: request.dryRun || this.config.defaultDryRun,
      },
      scenes: [],
      landingPageUrl,
      warnings: [
        "Draft only: topic selection, script, voice, assets, rendering, and publishing are not implemented yet.",
      ],
      errors: [],
      costEstimateUsd: this.config.defaultEstimatedCostUsd,
      createdAt: now,
      updatedAt: now,
    });
  }

  async generate(request: ContentRequest): Promise<GeneratedContent> {
    const draft = await this.createDraft(request);
    const topicAgent = new TopicAgent({
      repository: this.repository,
      options: {
        staleDataDays: this.config.staleDataDays,
      },
    });

    try {
      const topicSelection = await topicAgent.selectTopic(draft.request);
      const selected = topicSelection.selected;
      const withTopic = await this.repository.saveContent({
        ...draft,
        status: "topic_selected",
        topic: selected.topic,
        warnings: [...draft.warnings, ...selected.validationWarnings],
      });
      const budgetBreakdown = getBudgetBreakdownForDestination(draft.request, selected.primaryDestinationSlug);

      const withData = await this.repository.saveContent({
        ...withTopic,
        status: "data_validated",
        budgetBreakdown,
        landingPageUrl: `${this.config.siteUrl}${selected.topic.landingPagePath}`,
        warnings: [
          ...withTopic.warnings.filter((warning) => !warning.startsWith("Draft only:")),
          "Phase 3 complete: topic and data are validated.",
        ],
      });
      const generatedScript = new ScriptAgent().generate(withData);

      const withScript = await this.repository.saveContent({
        ...withData,
        status: "script_generated",
        hook: generatedScript.hook,
        script: generatedScript.script,
        scriptValidation: {
          numericClaims: generatedScript.numericClaims,
          allowedNumericClaims: generatedScript.allowedNumericClaims,
        },
        warnings: [
          ...withData.warnings,
          ...generatedScript.warnings,
          "Phase 4 complete: script is generated and numeric claims are validated. Voice, assets, rendering, and publishing are not implemented yet.",
        ],
      });
      const captions = new CaptionAgent().generate(withScript);
      const withCaptions = await this.repository.saveContent({
        ...withScript,
        captions,
        landingPageUrl: captions.landingPageUrl,
        metrics: createEmptyMetricSnapshot(withScript),
        experimentDimensions: getExperimentDimensions({
          ...withScript,
          captions,
        }),
        warnings: [
          ...withScript.warnings,
          "Phase 7 captions, UTM parameters, and analytics placeholders are prepared.",
        ],
      });
      const preparedMedia = await new MediaAgent(this.config).prepare(withCaptions);
      const withAssets = await this.repository.saveContent({
        ...preparedMedia.content,
        status: "assets_ready",
        experimentDimensions: getExperimentDimensions(preparedMedia.content),
        warnings: [
          ...preparedMedia.content.warnings.filter((warning) => !warning.includes("Voice, assets, rendering")),
          ...preparedMedia.warnings,
          "Phase 5 assets are ready: scenes, subtitles, cover, voice placeholder, manifest, and optional MP4.",
        ],
      });

      if (!withAssets.videoPath) {
        return withAssets;
      }

      const rendering = await this.repository.saveContent({
        ...withAssets,
        status: "rendering",
      });

      return this.repository.saveContent({
        ...rendering,
        status: "ready_for_review",
        warnings: [
          ...rendering.warnings,
          "Phase 5 complete: local MP4 rendered and content is ready for human review. Publishing remains disabled.",
        ],
      });
    } catch (error) {
      return this.repository.saveContent({
        ...draft,
        status: "failed",
        errors: [...draft.errors, error instanceof Error ? error.message : "Topic selection failed."],
      });
    }
  }

  async listReviewQueue() {
    return new ReviewQueue(this.repository).list();
  }

  async getReviewItem(contentId: string) {
    return new ReviewQueue(this.repository).get(contentId);
  }

  async regenerateScript(contentId: string) {
    const content = await this.getExistingContent(contentId);
    this.assertRegenerationAllowed(content);
    const generatedScript = new ScriptAgent().generate(content);
    const withScript = await this.repository.saveContent({
      ...content,
      status: "script_generated",
      hook: generatedScript.hook,
      script: generatedScript.script,
      scriptValidation: {
        numericClaims: generatedScript.numericClaims,
        allowedNumericClaims: generatedScript.allowedNumericClaims,
      },
      warnings: [
        ...content.warnings,
        ...generatedScript.warnings,
        "Review action: script regenerated from validated GoByBudget data.",
      ],
    });

    return this.regenerateMedia(withScript.id);
  }

  async regenerateCaptions(contentId: string) {
    const content = await this.getExistingContent(contentId);
    this.assertRegenerationAllowed(content);
    const captions = new CaptionAgent().generate(content);

    return this.repository.saveContent({
      ...content,
      captions,
      landingPageUrl: captions.landingPageUrl,
      metrics: content.metrics ?? createEmptyMetricSnapshot(content),
      experimentDimensions: getExperimentDimensions({
        ...content,
        captions,
      }),
      warnings: [
        ...content.warnings,
        "Review action: captions and UTM parameters regenerated.",
      ],
    });
  }

  async regenerateMedia(contentId: string) {
    const content = await this.getExistingContent(contentId);
    this.assertRegenerationAllowed(content);
    const preparedMedia = await new MediaAgent(this.config).prepare(content);
    const withAssets = await this.repository.saveContent({
      ...preparedMedia.content,
      status: "assets_ready",
      warnings: [
        ...preparedMedia.content.warnings,
        ...preparedMedia.warnings,
        "Review action: media assets regenerated.",
      ],
    });

    if (!withAssets.videoPath) {
      return withAssets;
    }

    const rendering = await this.repository.saveContent({
      ...withAssets,
      status: "rendering",
    });

    return this.repository.saveContent({
      ...rendering,
      status: "ready_for_review",
      warnings: [
        ...rendering.warnings,
        "Review action: regenerated MP4 is ready for human review.",
      ],
    });
  }

  async approve(contentId: string, notes?: string) {
    return new ApprovalService(this.repository).approve(contentId, notes);
  }

  async reject(contentId: string, notes?: string) {
    return new ApprovalService(this.repository).reject(contentId, notes);
  }

  async simulatePublish(contentId: string, platform?: SocialContentPlatform) {
    const content = await this.getExistingContent(contentId);
    const selectedPlatform = platform ?? content.request.platform;
    const result = await new SimulationPublisher().publish(content, { platform: selectedPlatform });

    return this.repository.saveContent({
      ...content,
      publicationResults: [...(content.publicationResults ?? []), result],
      warnings: [
        ...content.warnings,
        `Phase 8 simulation complete for ${selectedPlatform}: no official API call was made and status remains approved.`,
      ],
    });
  }

  private async getExistingContent(contentId: string) {
    const content = await this.repository.getContent(contentId);

    if (!content) {
      throw new Error(`Unknown content id: ${contentId}.`);
    }

    return content;
  }

  private assertRegenerationAllowed(content: GeneratedContent) {
    if (isTerminalContentStatus(content.status)) {
      throw new Error(`Cannot regenerate terminal content with status ${content.status}.`);
    }
  }
}
