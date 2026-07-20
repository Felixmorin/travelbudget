import { mkdtemp, rm } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";

import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { LocalContentRepository } from "@/lib/social-content/data/content-repository";
import type { GeneratedContent } from "@/lib/social-content/domain/types";

let tempDir = "";

beforeEach(async () => {
  tempDir = await mkdtemp(join(tmpdir(), "gobybudget-social-content-"));
});

afterEach(async () => {
  await rm(tempDir, { recursive: true, force: true });
});

describe("LocalContentRepository", () => {
  it("saves content and lists review-ready items", async () => {
    const repository = new LocalContentRepository(createConfig(tempDir));
    const content = createContent("ready_for_review");

    await repository.saveContent(content);

    await expect(repository.getContent(content.id)).resolves.toMatchObject({ id: content.id });
    await expect(repository.listReviewQueue()).resolves.toHaveLength(1);
  });

  it("records review decisions through valid status transitions", async () => {
    const repository = new LocalContentRepository(createConfig(tempDir));
    const content = createContent("ready_for_review");

    await repository.saveContent(content);
    await repository.recordReview(content.id, "approved", "Looks good.");

    await expect(repository.getContent(content.id)).resolves.toMatchObject({ status: "approved" });
  });
});

function createConfig(outputDir: string) {
  return {
    enabled: false,
    siteUrl: "https://gobybudget.com",
    outputDir,
    defaultDryRun: true,
    maxRetries: 2,
    staleDataDays: 120,
    defaultEstimatedCostUsd: 0,
    featureFlags: {
      llmGeneration: false,
      voiceGeneration: false,
      videoRendering: false,
      publishing: false,
    },
  };
}

function createContent(status: GeneratedContent["status"]): GeneratedContent {
  const now = new Date().toISOString();

  return {
    id: crypto.randomUUID(),
    runId: crypto.randomUUID(),
    status,
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
    scenes: [],
    warnings: [],
    errors: [],
    costEstimateUsd: 0,
    createdAt: now,
    updatedAt: now,
  };
}
