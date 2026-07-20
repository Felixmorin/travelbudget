import { mkdtemp, rm } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { parseArgs, runSocialContentCli } from "@/lib/social-content/cli";

let tempDir = "";

beforeEach(async () => {
  tempDir = await mkdtemp(join(tmpdir(), "gobybudget-social-cli-"));
  vi.stubEnv("SOCIAL_AGENT_OUTPUT_DIR", tempDir);
  vi.stubEnv("SOCIAL_AGENT_ENABLE_VIDEO_RENDERING", "false");
});

afterEach(async () => {
  vi.unstubAllEnvs();
  await rm(tempDir, { recursive: true, force: true });
});

describe("social content CLI", () => {
  it("parses generate options", () => {
    expect(
      parseArgs(["--origin", "Montreal", "--budget", "1500", "--currency", "CAD", "--days", "7"])
    ).toMatchObject({
      origin: "Montreal",
      budget: "1500",
      currency: "CAD",
      durationDays: "7",
    });
  });

  it("returns inspect metadata", async () => {
    await expect(runSocialContentCli(["inspect"])).resolves.toMatchObject({
      ok: true,
      command: "inspect",
      data: {
        templates: expect.arrayContaining(["three_destinations"]),
      },
    });
  });

  it("creates a validated topic on generate", async () => {
    const result = await runSocialContentCli([
      "generate",
      "--origin",
      "Montreal",
      "--budget",
      "1500",
      "--currency",
      "CAD",
      "--days",
      "7",
      "--language",
      "fr",
      "--template",
      "three_destinations",
    ]);

    expect(result).toMatchObject({
      ok: true,
      command: "generate",
      data: {
        status: "assets_ready",
        request: {
          origin: "Montreal",
          budget: 1500,
        },
        topic: {
          template: "three_destinations",
        },
        budgetBreakdown: {
          dataSource: "gobybudget-estimate",
        },
        hook: expect.any(String),
        script: expect.stringContaining("GoByBudget"),
        scriptValidation: {
          numericClaims: expect.any(Array),
        },
        media: {
          renderer: "dry-run",
          subtitleSrtPath: expect.any(String),
          coverPath: expect.any(String),
        },
        captions: {
          instagramCaption: expect.stringContaining("GoByBudget"),
          utm: {
            utm_source: "instagram",
          },
        },
        metrics: {
          views: 0,
        },
      },
    });
  });

  it("shows review details for a generated content id", async () => {
    const generated = await runSocialContentCli([
      "generate",
      "--origin",
      "Montreal",
      "--budget",
      "1500",
      "--currency",
      "CAD",
      "--days",
      "7",
      "--language",
      "fr",
      "--template",
      "three_destinations",
    ]);
    const contentId = (generated.data as { id: string }).id;
    const review = await runSocialContentCli(["show-review", contentId]);

    expect(review).toMatchObject({
      ok: true,
      command: "show-review",
      data: {
        contentId,
        script: expect.stringContaining("GoByBudget"),
        data: {
          budgetBreakdown: {
            dataSource: "gobybudget-estimate",
          },
          metrics: {
            views: 0,
          },
        },
        captions: {
          instagramCaption: expect.any(String),
        },
      },
    });
  });
});
