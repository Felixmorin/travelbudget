import { getUnifiedDestination } from "@/lib/data/unified-destinations";
import { SocialContentError } from "@/lib/social-content/domain/errors";
import type { ContentScene, GeneratedContent } from "@/lib/social-content/domain/types";

const minimumSceneSeconds = 2.2;
const maximumSceneSeconds = 3.4;

export function createScenes(content: GeneratedContent): ContentScene[] {
  if (!content.script || !content.topic) {
    throw new SocialContentError("missing_scene_inputs", "Scene planning requires a generated script and selected topic.");
  }

  const lines = content.script
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  const totalDuration = clamp(lines.length * 2.6, 14, 28);
  const baseDuration = clamp(totalDuration / Math.max(1, lines.length), minimumSceneSeconds, maximumSceneSeconds);
  let cursor = 0;

  return lines.map((line, index) => {
    const durationSeconds = roundSeconds(index === lines.length - 1 ? Math.max(2.4, totalDuration - cursor) : baseDuration);
    const startSeconds = roundSeconds(cursor);
    const endSeconds = roundSeconds(cursor + durationSeconds);
    cursor = endSeconds;

    const destination = getDestinationForScene(content, line, index);

    return {
      id: `scene-${String(index + 1).padStart(2, "0")}`,
      scriptLine: line,
      visualPrompt: getVisualPrompt(destination?.name ?? "GoByBudget trip estimate", line),
      startSeconds,
      endSeconds,
      durationSeconds,
      sourceUrl: destination?.image,
      sourceLicense: "GoByBudget dataset image URL. License review required before downloading or publishing third-party media.",
      warnings: [
        "Travel image source URL is used for local rendering when available; license review is required before publication.",
      ],
    };
  });
}

function getVisualPrompt(place: string, line: string) {
  return `${place} vertical travel-budget scene for: ${line}`;
}

function getDestinationForScene(content: GeneratedContent, line: string, index: number) {
  const destinations = (content.topic?.destinationSlugs ?? [])
    .map((slug) => getUnifiedDestination(slug))
    .filter((destination) => destination !== null && destination !== undefined);
  const normalizedLine = normalizeText(line);
  const mentionedDestination = destinations.find((destination) => normalizedLine.includes(normalizeText(destination.name)));

  if (mentionedDestination) {
    return mentionedDestination;
  }

  if (destinations.length === 0) {
    return null;
  }

  return destinations[index % destinations.length] ?? null;
}

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function roundSeconds(value: number) {
  return Math.round(value * 10) / 10;
}
