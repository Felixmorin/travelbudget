import { describe, expect, it } from "vitest";

import type { GeneratedContent } from "@/lib/social-content/domain/types";
import { CaptionAgent } from "@/lib/social-content/caption/caption-generator";

describe("CaptionAgent", () => {
  it("generates captions, hashtags, and UTM URL", () => {
    const captions = new CaptionAgent().generate(createContent());

    expect(captions).toMatchObject({
      internalTitle: "3 destinations",
      firstLine: "Tu as $1,500 et 7 jours?",
      cta: "Teste ton propre budget sur GoByBudget.",
      utm: {
        utm_source: "instagram",
        utm_medium: "organic_social",
        utm_campaign: "three_destinations",
      },
    });
    expect(captions.landingPageUrl).toContain("utm_content=content-1");
    expect(captions.hashtags).toEqual(expect.arrayContaining(["#GoByBudget", "#VoyageBudget", "#Mexico"]));
  });
});

function createContent(): GeneratedContent {
  const now = new Date().toISOString();

  return {
    id: "content-1",
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
    hook: "Tu as $1,500 et 7 jours?",
    script: "Tu as $1,500 et 7 jours?",
    scenes: [],
    landingPageUrl: "https://gobybudget.com/results",
    warnings: [],
    errors: [],
    costEstimateUsd: 0,
    createdAt: now,
    updatedAt: now,
  };
}
