import type { GeneratedContent } from "@/lib/social-content/domain/types";
import { createPublishingDisabledResult, type PublishOptions, type SocialPublisher } from "@/lib/social-content/publishing/base-publisher";

export class TikTokPublisher implements SocialPublisher {
  async publish(_content: GeneratedContent, options: PublishOptions) {
    return createPublishingDisabledResult(options.platform, "TikTok");
  }
}
