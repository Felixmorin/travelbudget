import { mkdtemp, rm } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";

import { afterEach, beforeEach, describe, expect, it } from "vitest";

import type { SocialContentConfig } from "@/lib/social-content/config";
import type { GeneratedContent } from "@/lib/social-content/domain/types";
import { MediaAgent } from "@/lib/social-content/media/media-agent";

let tempDir = "";

beforeEach(async () => {
  tempDir = await mkdtemp(join(tmpdir(), "gobybudget-social-media-"));
});

afterEach(async () => {
  await rm(tempDir, { recursive: true, force: true });
});

describe("MediaAgent", () => {
  it("creates scenes, subtitles, cover, and manifest in dry-run renderer mode", async () => {
    const result = await new MediaAgent(createConfig(tempDir)).prepare(createContent());

    expect(result.content.scenes.length).toBeGreaterThan(0);
    expect(result.content.media).toMatchObject({
      renderer: "dry-run",
      width: 1080,
      height: 1920,
      subtitleSrtPath: expect.stringContaining("subtitles.srt"),
      coverPath: expect.stringContaining("cover.svg"),
    });
    expect(result.content.thumbnailPath).toContain("cover.svg");
    expect(result.warnings.join(" ")).toContain("Voice generation is a placeholder");
  });
});

function createConfig(outputDir: string): SocialContentConfig {
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

function createContent(): GeneratedContent {
  const now = new Date().toISOString();

  return {
    id: crypto.randomUUID(),
    runId: crypto.randomUUID(),
    status: "script_generated",
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
      title: "3 destinations ou voyager avec 1500 CAD",
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
    script: [
      "Tu as $1,500 et 7 jours?",
      "Depuis Montreal, ces 3 destinations passent dans les estimations GoByBudget.",
      "Mexico: environ $1,470.",
    ].join("\n"),
    scenes: [],
    warnings: [],
    errors: [],
    costEstimateUsd: 0,
    createdAt: now,
    updatedAt: now,
  };
}
