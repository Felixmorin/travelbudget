import { getUnifiedDestination } from "@/lib/data/unified-destinations";
import { SocialContentError } from "@/lib/social-content/domain/errors";
import type { ContentCaptions, GeneratedContent } from "@/lib/social-content/domain/types";

const baseHashtags = ["#GoByBudget", "#TravelBudget", "#BudgetTravel"];

export class CaptionAgent {
  generate(content: GeneratedContent): ContentCaptions {
    if (!content.topic || !content.hook || !content.landingPageUrl) {
      throw new SocialContentError("missing_caption_inputs", "Caption generation requires topic, hook, and landing page URL.");
    }

    const destinationNames = content.topic.destinationSlugs.map((slug) => getUnifiedDestination(slug)?.name ?? slug);
    const cta = content.request.language === "fr" ? "Teste ton propre budget sur GoByBudget." : "Test your own budget on GoByBudget.";
    const firstLine = content.hook;
    const coverText = getCoverText(content, destinationNames);
    const utm = buildUtmParams(content);
    const landingPageUrl = appendUtm(content.landingPageUrl, utm);
    const hashtags = buildHashtags(destinationNames, content.request.language);

    return {
      internalTitle: content.topic.title,
      firstLine,
      tiktokCaption: buildPlatformCaption({
        firstLine,
        body: getCaptionBody(content, destinationNames),
        cta,
        hashtags,
        platform: "tiktok",
      }),
      instagramCaption: buildPlatformCaption({
        firstLine,
        body: getCaptionBody(content, destinationNames),
        cta,
        hashtags,
        platform: "instagram",
      }),
      cta,
      hashtags,
      coverText,
      landingPageUrl,
      utm,
    };
  }
}

function getCaptionBody(content: GeneratedContent, destinationNames: string[]) {
  if (content.request.language === "fr") {
    return [
      `${destinationNames.join(", ")} avec des estimations GoByBudget.`,
      `Budget: ${content.request.budget} ${content.request.currency}. Duree: ${content.request.durationDays} jours.`,
      "Estimations seulement, pas des prix garantis.",
    ].join("\n");
  }

  return [
    `${destinationNames.join(", ")} using GoByBudget estimates.`,
    `Budget: ${content.request.currency} ${content.request.budget}. Duration: ${content.request.durationDays} days.`,
    "Estimates only, not guaranteed prices.",
  ].join("\n");
}

function getCoverText(content: GeneratedContent, destinationNames: string[]) {
  if (content.request.template === "three_destinations") {
    return content.request.language === "fr"
      ? `3 voyages avec ${content.request.budget} ${content.request.currency}`
      : `3 trips with ${content.request.currency} ${content.request.budget}`;
  }

  if (content.request.template === "destination_comparison") {
    return destinationNames.slice(0, 2).join(" vs ");
  }

  return content.topic?.title ?? content.hook ?? "GoByBudget";
}

function buildUtmParams(content: GeneratedContent) {
  return {
    utm_source: content.request.platform === "tiktok" ? "tiktok" : "instagram",
    utm_medium: "organic_social",
    utm_campaign: content.request.template,
    utm_content: content.id,
  };
}

function appendUtm(url: string, utm: Record<string, string>) {
  const parsedUrl = new URL(url);

  Object.entries(utm).forEach(([key, value]) => {
    parsedUrl.searchParams.set(key, value);
  });

  return parsedUrl.toString();
}

function buildHashtags(destinationNames: string[], language: string) {
  const destinationTags = destinationNames
    .map((name) => `#${name.replace(/[^a-z0-9]/gi, "")}`)
    .filter((tag) => tag.length > 1)
    .slice(0, 4);
  const languageTags = language === "fr" ? ["#VoyageBudget", "#VoyagePasCher"] : ["#TravelTips", "#AffordableTravel"];

  return Array.from(new Set([...baseHashtags, ...languageTags, ...destinationTags])).slice(0, 10);
}

function buildPlatformCaption({
  firstLine,
  body,
  cta,
  hashtags,
  platform,
}: {
  firstLine: string;
  body: string;
  cta: string;
  hashtags: string[];
  platform: "tiktok" | "instagram";
}) {
  const hashtagLine = hashtags.join(" ");
  const caption = [firstLine, body, cta, hashtagLine].join("\n\n");

  if (platform === "tiktok") {
    return caption.slice(0, 2200);
  }

  return caption.slice(0, 2200);
}
