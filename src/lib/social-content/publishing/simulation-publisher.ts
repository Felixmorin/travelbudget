import type { GeneratedContent, PublishResult } from "@/lib/social-content/domain/types";
import { assertContentCanBePublished, type PublishOptions, type SocialPublisher } from "@/lib/social-content/publishing/base-publisher";

export class SimulationPublisher implements SocialPublisher {
  async publish(content: GeneratedContent, options: PublishOptions): Promise<PublishResult> {
    assertContentCanBePublished(content);

    const landingPageUrl = content.captions?.landingPageUrl ?? content.landingPageUrl;
    const externalId = `sim_${options.platform}_${content.id}`;

    return {
      ok: true,
      platform: options.platform,
      mode: "simulation",
      createdAt: new Date().toISOString(),
      externalId,
      url: `simulation://${options.platform}/${content.id}`,
      warnings: [
        "Simulation only: no social network API was called.",
        `Caption landing page: ${landingPageUrl ?? "not set"}.`,
      ],
    };
  }
}
