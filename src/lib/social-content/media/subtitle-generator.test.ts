import { describe, expect, it } from "vitest";

import type { ContentScene } from "@/lib/social-content/domain/types";
import { createSrt, createVtt } from "@/lib/social-content/media/subtitle-generator";

const scenes: ContentScene[] = [
  {
    id: "scene-01",
    scriptLine: "Tu as $1,500 et 7 jours?",
    visualPrompt: "Hook",
    startSeconds: 0,
    endSeconds: 2.5,
    durationSeconds: 2.5,
    warnings: [],
  },
];

describe("subtitle generator", () => {
  it("creates SRT subtitles", () => {
    expect(createSrt(scenes)).toContain("00:00:00,000 --> 00:00:02,500");
  });

  it("creates VTT subtitles", () => {
    expect(createVtt(scenes)).toContain("WEBVTT");
    expect(createVtt(scenes)).toContain("00:00:00.000 --> 00:00:02.500");
  });
});
