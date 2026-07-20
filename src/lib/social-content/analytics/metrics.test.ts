import { describe, expect, it } from "vitest";

import type { GeneratedContent } from "@/lib/social-content/domain/types";
import { createEmptyMetricSnapshot, getExperimentDimensions } from "@/lib/social-content/analytics/metrics";

describe("social content analytics metrics", () => {
  it("creates an empty metric snapshot", () => {
    expect(createEmptyMetricSnapshot(createContent())).toMatchObject({
      contentId: "content-1",
      platform: "instagram",
      views: 0,
      gobybudgetClicks: 0,
    });
  });

  it("extracts experiment dimensions", () => {
    expect(getExperimentDimensions(createContent())).toMatchObject({
      hook: "Hook",
      destinationSlugs: ["mexico"],
      budget: 1500,
      videoDurationSeconds: 25.6,
      cta: "CTA",
    });
  });
});

function createContent(): GeneratedContent {
  const now = new Date().toISOString();

  return {
    id: "content-1",
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
      title: "Topic",
      template: "three_destinations",
      origin: "Montreal",
      destinationSlugs: ["mexico"],
      budget: 1500,
      currency: "CAD",
      durationDays: 7,
      language: "fr",
      platform: "instagram",
      score: 86,
      landingPagePath: "/results",
      reasons: [],
    },
    hook: "Hook",
    script: "Script",
    captions: {
      internalTitle: "Title",
      firstLine: "Hook",
      tiktokCaption: "TikTok",
      instagramCaption: "Instagram",
      cta: "CTA",
      hashtags: ["#GoByBudget"],
      coverText: "Cover",
      landingPageUrl: "https://gobybudget.com/results",
      utm: {},
    },
    media: {
      outputDir: "out",
      sceneImagePaths: [],
      subtitleSrtPath: "subtitles.srt",
      subtitleVttPath: "subtitles.vtt",
      coverPath: "cover.svg",
      manifestPath: "manifest.json",
      durationSeconds: 25.6,
      width: 1080,
      height: 1920,
      renderer: "ffmpeg",
    },
    scenes: [],
    warnings: [],
    errors: [],
    costEstimateUsd: 0,
    createdAt: now,
    updatedAt: now,
  };
}
