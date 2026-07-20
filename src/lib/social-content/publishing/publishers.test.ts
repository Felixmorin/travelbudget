import { describe, expect, it } from "vitest";

import type { GeneratedContent } from "@/lib/social-content/domain/types";
import { InstagramPublisher } from "@/lib/social-content/publishing/instagram-publisher";
import { SimulationPublisher } from "@/lib/social-content/publishing/simulation-publisher";
import { TikTokPublisher } from "@/lib/social-content/publishing/tiktok-publisher";

describe("publishing", () => {
  it("creates a simulation result for approved content", async () => {
    const result = await new SimulationPublisher().publish(createContent(), { platform: "instagram" });

    expect(result).toMatchObject({
      ok: true,
      platform: "instagram",
      mode: "simulation",
      externalId: expect.stringContaining("sim_instagram_"),
      url: expect.stringContaining("simulation://instagram/"),
      warnings: expect.arrayContaining(["Simulation only: no social network API was called."]),
    });
  });

  it("rejects simulation publishing before approval", async () => {
    await expect(
      new SimulationPublisher().publish(createContent({ status: "ready_for_review" }), { platform: "tiktok" })
    ).rejects.toThrow("Content must be approved before publishing");
  });

  it("keeps official platform publishers disabled", async () => {
    await expect(new InstagramPublisher().publish(createContent(), { platform: "instagram" })).resolves.toMatchObject({
      ok: false,
      mode: "official_api",
      error: expect.stringContaining("official API publishing is not implemented"),
    });
    await expect(new TikTokPublisher().publish(createContent(), { platform: "tiktok" })).resolves.toMatchObject({
      ok: false,
      mode: "official_api",
      error: expect.stringContaining("unofficial automation are forbidden"),
    });
  });
});

function createContent(overrides: Partial<GeneratedContent> = {}): GeneratedContent {
  const now = new Date().toISOString();

  return {
    id: "content-1",
    runId: "run-1",
    status: "approved",
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
    hook: "Tu as $1,500 et 7 jours?",
    script: "Tu as $1,500 et 7 jours? Va sur GoByBudget.",
    scenes: [],
    captions: {
      internalTitle: "3 destinations",
      firstLine: "Tu as $1,500 et 7 jours?",
      tiktokCaption: "TikTok caption",
      instagramCaption: "Instagram caption",
      cta: "Teste ton budget sur GoByBudget.",
      hashtags: ["#GoByBudget"],
      coverText: "3 voyages",
      landingPageUrl: "https://gobybudget.com/results?utm_source=instagram",
      utm: {
        utm_source: "instagram",
      },
    },
    landingPageUrl: "https://gobybudget.com/results",
    videoPath: "video.mp4",
    thumbnailPath: "cover.svg",
    warnings: [],
    errors: [],
    costEstimateUsd: 0,
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}
