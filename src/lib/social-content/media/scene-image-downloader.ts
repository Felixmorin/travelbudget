import { writeFile } from "node:fs/promises";
import { join } from "node:path";

import type { ContentScene } from "@/lib/social-content/domain/types";

export type SceneImageDownloadResult = {
  imagePaths: string[];
  warnings: string[];
};

export async function downloadSceneImages(scenes: ContentScene[], outputDir: string): Promise<SceneImageDownloadResult> {
  const imagePaths: string[] = [];
  const warnings: string[] = [];

  for (const scene of scenes) {
    if (!scene.sourceUrl) {
      warnings.push(`No source image URL for ${scene.id}; using generated fallback asset.`);
      continue;
    }

    try {
      const imagePath = join(outputDir, `${scene.id}-travel.jpg`);
      const response = await fetch(scene.sourceUrl, {
        headers: {
          "User-Agent": "GoByBudgetSocialContentAgent/1.0",
        },
        signal: AbortSignal.timeout(15000),
      });

      if (!response.ok) {
        warnings.push(`Could not download travel image for ${scene.id}: HTTP ${response.status}.`);
        continue;
      }

      const contentType = response.headers.get("content-type") ?? "";

      if (!contentType.startsWith("image/")) {
        warnings.push(`Source URL for ${scene.id} did not return an image (${contentType || "unknown content type"}).`);
        continue;
      }

      await writeFile(imagePath, Buffer.from(await response.arrayBuffer()));
      imagePaths.push(imagePath);
    } catch (error) {
      warnings.push(`Could not download travel image for ${scene.id}: ${error instanceof Error ? error.message : "unknown error"}.`);
    }
  }

  return {
    imagePaths,
    warnings,
  };
}
