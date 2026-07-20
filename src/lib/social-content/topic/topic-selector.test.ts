import { describe, expect, it } from "vitest";

import { buildTopicCandidates, TopicAgent } from "@/lib/social-content/topic/topic-selector";
import type { ContentRepository } from "@/lib/social-content/data/content-repository";
import type { GeneratedContent } from "@/lib/social-content/domain/types";

const baseRequest = {
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
} as const;

describe("TopicAgent candidate builder", () => {
  it("builds validated three-destination candidates from GoByBudget data", () => {
    const candidates = buildTopicCandidates(baseRequest, { staleDataDays: 120 });

    expect(candidates.length).toBeGreaterThan(0);
    expect(candidates[0]).toMatchObject({
      topic: {
        template: "three_destinations",
        destinationSlugs: expect.any(Array),
      },
      validationErrors: [],
    });
    expect(candidates[0].topic.destinationSlugs).toHaveLength(3);
  });

  it("uses existing destination pages for single destination topics", () => {
    const candidates = buildTopicCandidates(
      {
        ...baseRequest,
        template: "destination_cost",
        destination: "portugal",
      },
      { staleDataDays: 120 }
    );

    expect(candidates).toHaveLength(1);
    expect(candidates[0].topic.landingPagePath).toMatch(/^\/(?:destinations|travel-budget)/);
    expect(candidates[0].validationErrors).toEqual([]);
  });

  it("rejects comparison topics without an existing GoByBudget comparison page", () => {
    expect(() =>
      buildTopicCandidates(
        {
          ...baseRequest,
          template: "destination_comparison",
          destination: "portugal",
          comparisonDestination: "japan",
        },
        { staleDataDays: 120 }
      )
    ).toThrow("No GoByBudget comparison page exists");
  });

  it("skips exact duplicate topics from previous generations", async () => {
    const firstCandidate = buildTopicCandidates(baseRequest, { staleDataDays: 120 })[0];
    const repository = createRepositoryWithContent({
      ...createGeneratedContent(),
      topic: firstCandidate.topic,
    });
    const result = await new TopicAgent({
      repository,
      options: { staleDataDays: 120 },
    }).selectTopic(baseRequest);

    expect(result.selected.topic.destinationSlugs).not.toEqual(firstCandidate.topic.destinationSlugs);
  });
});

function createRepositoryWithContent(content: GeneratedContent): ContentRepository {
  return {
    saveContent: async () => content,
    getContent: async () => content,
    listContent: async () => [content],
    listReviewQueue: async () => [],
    updateStatus: async () => content,
    recordReview: async () => ({
      id: crypto.randomUUID(),
      contentId: content.id,
      decision: "approved",
      createdAt: content.createdAt,
      updatedAt: content.updatedAt,
    }),
  };
}

function createGeneratedContent(): GeneratedContent {
  const now = new Date().toISOString();

  return {
    id: crypto.randomUUID(),
    runId: crypto.randomUUID(),
    status: "data_validated",
    request: baseRequest,
    scenes: [],
    warnings: [],
    errors: [],
    costEstimateUsd: 0,
    createdAt: now,
    updatedAt: now,
  };
}
