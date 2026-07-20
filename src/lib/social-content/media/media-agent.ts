import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

import type { SocialContentConfig } from "@/lib/social-content/config";
import { SocialContentError } from "@/lib/social-content/domain/errors";
import type { GeneratedContent, GeneratedMedia } from "@/lib/social-content/domain/types";
import { createScenes } from "@/lib/social-content/media/scene-planner";
import { downloadSceneImages } from "@/lib/social-content/media/scene-image-downloader";
import { createSrt, createVtt } from "@/lib/social-content/media/subtitle-generator";
import { createCoverSvg, createSceneSvg } from "@/lib/social-content/media/svg-assets";
import { renderVerticalVideo } from "@/lib/social-content/media/video-renderer";

const videoWidth = 1080;
const videoHeight = 1920;

export class MediaAgent {
  private config: SocialContentConfig;

  constructor(config: SocialContentConfig) {
    this.config = config;
  }

  async prepare(content: GeneratedContent): Promise<{ content: GeneratedContent; warnings: string[] }> {
    if (!content.script || !content.hook) {
      throw new SocialContentError("missing_media_inputs", "Media generation requires a hook and script.");
    }

    const outputDir = join(this.config.outputDir, "content", content.id);
    await mkdir(outputDir, { recursive: true });

    const scenes = createScenes(content);
    const placeholderImagePaths: string[] = [];

    for (const [index, scene] of scenes.entries()) {
      const scenePath = join(outputDir, `${scene.id}.svg`);
      await writeFile(scenePath, createSceneSvg(scene, index, content), "utf8");
      placeholderImagePaths.push(scenePath);
    }

    const subtitleSrtPath = join(outputDir, "subtitles.srt");
    const subtitleVttPath = join(outputDir, "subtitles.vtt");
    const coverPath = join(outputDir, "cover.svg");
    const manifestPath = join(outputDir, "media-manifest.json");
    const videoPath = join(outputDir, "video.mp4");
    const voicePath = join(outputDir, "voice-placeholder.json");
    const durationSeconds = scenes.reduce((total, scene) => total + scene.durationSeconds, 0);

    await Promise.all([
      writeFile(subtitleSrtPath, createSrt(scenes), "utf8"),
      writeFile(subtitleVttPath, createVtt(scenes), "utf8"),
      writeFile(coverPath, createCoverSvg(content), "utf8"),
      writeFile(
        voicePath,
        `${JSON.stringify({
          mode: "placeholder",
          reason: "TTS provider is not enabled in Phase 5 local dry-run.",
          script: content.script,
        }, null, 2)}\n`,
        "utf8"
      ),
    ]);

    const downloadedImages = this.config.featureFlags.videoRendering
      ? await downloadSceneImages(scenes, outputDir)
      : { imagePaths: [], warnings: [] };
    const sceneImagePaths = downloadedImages.imagePaths.length === scenes.length
      ? downloadedImages.imagePaths
      : placeholderImagePaths;
    const renderResult = this.config.featureFlags.videoRendering
      ? await renderVerticalVideo({ sceneImagePaths, scenes, outputPath: videoPath })
      : {
          ok: false,
          renderer: "dry-run" as const,
          warning: "Video rendering feature flag is disabled.",
        };
    const media: GeneratedMedia = {
      outputDir,
      sceneImagePaths,
      subtitleSrtPath,
      subtitleVttPath,
      coverPath,
      manifestPath,
      voicePath,
      videoPath: renderResult.videoPath,
      durationSeconds: Math.round(durationSeconds * 10) / 10,
      width: videoWidth,
      height: videoHeight,
      renderer: renderResult.renderer,
    };
    const warnings = [
      ...scenes.flatMap((scene) => scene.warnings),
      ...downloadedImages.warnings,
      ...(downloadedImages.imagePaths.length === scenes.length
        ? ["Downloaded travel images from scene source URLs for local video rendering. Review image licenses before publication."]
        : []),
      "Voice generation is a placeholder until a TTS provider is enabled.",
      ...(renderResult.warning ? [renderResult.warning] : []),
    ];

    await writeFile(
      manifestPath,
      `${JSON.stringify({
        contentId: content.id,
        runId: content.runId,
        media,
        scenes,
        warnings,
      }, null, 2)}\n`,
      "utf8"
    );

    return {
      content: {
        ...content,
        scenes,
        media,
        videoPath: renderResult.videoPath,
        thumbnailPath: coverPath,
      },
      warnings,
    };
  }
}
