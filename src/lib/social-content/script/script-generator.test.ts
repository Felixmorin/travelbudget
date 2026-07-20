import { describe, expect, it } from "vitest";

import type { GeneratedContent } from "@/lib/social-content/domain/types";
import { ScriptAgent } from "@/lib/social-content/script/script-generator";

describe("ScriptAgent", () => {
  it("generates a French three-destinations script with validated numeric claims", () => {
    const result = new ScriptAgent().generate(createContent());

    expect(result.hook).toContain("1,500");
    expect(result.script).toContain("GoByBudget");
    expect(result.script).toContain("Mexico");
    expect(result.numericClaims).toEqual(expect.arrayContaining([1500, 7, 3, 1470]));
  });

  it("generates an English destination cost script", () => {
    const result = new ScriptAgent().generate(
      createContent({
        request: {
          template: "destination_cost",
          language: "en",
          destination: "portugal",
        },
        topic: {
          title: "Portugal cost",
          destinationSlugs: ["portugal"],
          template: "destination_cost",
          language: "en",
        },
      })
    );

    expect(result.script).toContain("GoByBudget estimates this trip");
    expect(result.script).toContain("Flights:");
  });

  it("generates a daily budget script", () => {
    const result = new ScriptAgent().generate(
      createContent({
        request: {
          template: "daily_budget",
          destination: "mexico",
        },
        topic: {
          title: "Daily Mexico",
          destinationSlugs: ["mexico"],
          template: "daily_budget",
        },
      })
    );

    expect(result.script).toContain("par jour");
    expect(result.numericClaims).toContain(214);
  });

  it("requires selected topic and budget data", () => {
    expect(() =>
      new ScriptAgent().generate({
        ...createContent(),
        topic: undefined,
      })
    ).toThrow("requires a selected topic");
  });
});

function createContent(
  overrides: {
    request?: Partial<GeneratedContent["request"]>;
    topic?: Partial<NonNullable<GeneratedContent["topic"]>>;
  } = {}
): GeneratedContent {
  const now = new Date().toISOString();
  const request: GeneratedContent["request"] = {
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
    ...overrides.request,
  };
  const topic: NonNullable<GeneratedContent["topic"]> = {
    id: crypto.randomUUID(),
    title: "3 destinations",
    template: request.template,
    origin: request.origin,
    destinationSlugs: ["mexico", "guatemala", "colombia"],
    budget: request.budget,
    currency: request.currency,
    durationDays: request.durationDays,
    language: request.language,
    platform: request.platform,
    score: 86,
    landingPagePath: "/results",
    reasons: [],
    ...overrides.topic,
  };

  return {
    id: crypto.randomUUID(),
    runId: crypto.randomUUID(),
    status: "data_validated",
    request,
    topic,
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
    scenes: [],
    warnings: [],
    errors: [],
    costEstimateUsd: 0,
    createdAt: now,
    updatedAt: now,
  };
}
