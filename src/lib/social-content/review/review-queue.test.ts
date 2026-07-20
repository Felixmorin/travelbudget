import { describe, expect, it } from "vitest";

import type { ContentRepository } from "@/lib/social-content/data/content-repository";
import type { GeneratedContent } from "@/lib/social-content/domain/types";
import { ApprovalService } from "@/lib/social-content/review/approval-service";
import { ReviewQueue, toReviewQueueItem } from "@/lib/social-content/review/review-queue";

describe("ReviewQueue", () => {
  it("maps generated content to a human review item", () => {
    const item = toReviewQueueItem(createReviewContent());

    expect(item).toMatchObject({
      status: "ready_for_review",
      title: "3 destinations",
      videoPath: "video.mp4",
      thumbnailPath: "cover.svg",
      availableActions: expect.arrayContaining(["approve", "reject", "regenerate-script", "regenerate-media"]),
      captions: {
        instagramCaption: "Instagram caption",
      },
      data: {
        budgetBreakdown: {
          total: 1470,
        },
        metrics: {
          views: 0,
        },
      },
    });
    expect(item.sources[0]).toMatchObject({
      sceneId: "scene-01",
      sourceUrl: "https://example.com/source.jpg",
    });
  });

  it("lists only review-ready content", async () => {
    const queue = new ReviewQueue(createRepository([createReviewContent(), createReviewContent({ status: "assets_ready" })]));

    await expect(queue.list()).resolves.toHaveLength(1);
  });

  it("shows simulation publishing for approved content", () => {
    const item = toReviewQueueItem(
      createReviewContent({
        status: "approved",
        publicationResults: [
          {
            ok: true,
            platform: "instagram",
            mode: "simulation",
            createdAt: new Date().toISOString(),
            externalId: "sim_instagram_content-1",
          },
        ],
      })
    );

    expect(item.availableActions).toEqual(["simulate-publish"]);
    expect(item.publicationResults?.[0]).toMatchObject({
      ok: true,
      mode: "simulation",
    });
  });
});

describe("ApprovalService", () => {
  it("records approval through the repository", async () => {
    const content = createReviewContent();
    const repository = createRepository([content]);
    const review = await new ApprovalService(repository).approve(content.id, "Approved for test.");

    expect(review).toMatchObject({
      contentId: content.id,
      decision: "approved",
      notes: "Approved for test.",
    });
  });
});

function createRepository(contents: GeneratedContent[]): ContentRepository {
  return {
    saveContent: async (content) => content,
    getContent: async (id) => contents.find((content) => content.id === id) ?? null,
    listContent: async () => contents,
    listReviewQueue: async () => contents.filter((content) => content.status === "ready_for_review"),
    updateStatus: async (id, status) => {
      const content = contents.find((item) => item.id === id);

      if (!content) throw new Error(`Unknown content id: ${id}.`);

      content.status = status;
      return content;
    },
    recordReview: async (contentId, decision, notes) => ({
      id: crypto.randomUUID(),
      contentId,
      decision,
      notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }),
  };
}

function createReviewContent(overrides: Partial<GeneratedContent> = {}): GeneratedContent {
  const now = new Date().toISOString();

  return {
    id: crypto.randomUUID(),
    runId: crypto.randomUUID(),
    status: "ready_for_review",
    request: {
      origin: "Montreal",
      budget: 1500,
      currency: "CAD",
      durationDays: 7,
      travelers: 1,
      travelStyle: "balanced",
      language: "fr",
      platform: "instagram",
      template: "three_destinations",
      dryRun: true,
    },
    topic: {
      id: crypto.randomUUID(),
      title: "3 destinations",
      template: "three_destinations",
      origin: "Montreal",
      destinationSlugs: ["mexico", "guatemala", "colombia"],
      budget: 1500,
      currency: "CAD",
      durationDays: 7,
      language: "fr",
      platform: "instagram",
      score: 86,
      landingPagePath: "/results",
      reasons: [],
    },
    budgetBreakdown: {
      flights: 560,
      accommodation: 420,
      food: 210,
      localTransport: 105,
      activities: 140,
      miscellaneous: 35,
      total: 1470,
      currency: "CAD",
      estimatedAt: "2026-06-24",
      dataSource: "gobybudget-estimate",
      sourceNotes: [],
    },
    hook: "Tu as $1,500 et 7 jours?",
    script: "Tu as $1,500 et 7 jours?",
    scenes: [
      {
        id: "scene-01",
        scriptLine: "Tu as $1,500 et 7 jours?",
        visualPrompt: "Mexico scene",
        durationSeconds: 3,
        sourceUrl: "https://example.com/source.jpg",
        sourceLicense: "License review required.",
        warnings: [],
      },
    ],
    media: {
      outputDir: "output",
      sceneImagePaths: ["scene-01.svg"],
      subtitleSrtPath: "subtitles.srt",
      subtitleVttPath: "subtitles.vtt",
      coverPath: "cover.svg",
      manifestPath: "media-manifest.json",
      videoPath: "video.mp4",
      durationSeconds: 25.6,
      width: 1080,
      height: 1920,
      renderer: "ffmpeg",
    },
    landingPageUrl: "https://gobybudget.com/results",
    videoPath: "video.mp4",
    thumbnailPath: "cover.svg",
    captions: {
      internalTitle: "3 destinations",
      firstLine: "Tu as $1,500 et 7 jours?",
      tiktokCaption: "TikTok caption",
      instagramCaption: "Instagram caption",
      cta: "Teste ton propre budget sur GoByBudget.",
      hashtags: ["#GoByBudget"],
      coverText: "3 voyages",
      landingPageUrl: "https://gobybudget.com/results?utm_source=instagram",
      utm: {
        utm_source: "instagram",
      },
    },
    metrics: {
      contentId: "content-1",
      platform: "instagram",
      collectedAt: now,
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
    },
    warnings: [],
    errors: [],
    costEstimateUsd: 0,
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}
