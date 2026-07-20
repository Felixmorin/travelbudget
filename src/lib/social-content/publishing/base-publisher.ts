import type { GeneratedContent, PublishResult, SocialContentPlatform } from "@/lib/social-content/domain/types";

export type PublishOptions = {
  platform: SocialContentPlatform;
};

export type SocialPublisher = {
  publish(content: GeneratedContent, options: PublishOptions): Promise<PublishResult>;
};

export function assertContentCanBePublished(content: GeneratedContent) {
  if (content.status !== "approved") {
    throw new Error(`Content must be approved before publishing. Current status: ${content.status}.`);
  }

  if (!content.videoPath) {
    throw new Error("Content must have a rendered video before publishing.");
  }

  if (!content.thumbnailPath) {
    throw new Error("Content must have a thumbnail before publishing.");
  }

  if (!content.captions) {
    throw new Error("Content must have captions before publishing.");
  }
}

export function createPublishingDisabledResult(platform: SocialContentPlatform, publisher: string): PublishResult {
  return {
    ok: false,
    platform,
    mode: "official_api",
    createdAt: new Date().toISOString(),
    error: `${publisher} official API publishing is not implemented in this MVP. Browser, cookie, and unofficial automation are forbidden.`,
  };
}
