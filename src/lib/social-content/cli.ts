import { pathToFileURL } from "node:url";

import { getRedactedSocialContentConfig, getSocialContentConfig } from "@/lib/social-content/config";
import { getGoByBudgetContentSnapshot } from "@/lib/social-content/data/gobybudget-content-source";
import { getSocialContentErrorMessage } from "@/lib/social-content/domain/errors";
import { socialContentPlatforms, socialContentStatuses, socialContentTemplates } from "@/lib/social-content/domain/types";
import type { SocialContentPlatform } from "@/lib/social-content/domain/types";
import { parseContentRequest } from "@/lib/social-content/domain/validation";
import { OrchestratorAgent } from "@/lib/social-content/orchestrator";

type CliResult = {
  ok: boolean;
  command: string;
  data?: unknown;
  error?: string;
};

export async function runSocialContentCli(argv = process.argv.slice(2)): Promise<CliResult> {
  const [command = "help", ...args] = argv;
  const config = getSocialContentConfig();
  const orchestrator = new OrchestratorAgent({ config });

  try {
    if (command === "inspect") {
      const snapshot = getGoByBudgetContentSnapshot();

      return {
        ok: true,
        command,
        data: {
          config: getRedactedSocialContentConfig(config),
          templates: socialContentTemplates,
          statuses: socialContentStatuses,
          destinations: snapshot.destinations.length,
          countryDestinations: snapshot.countryDestinations.length,
          generatedAt: snapshot.generatedAt,
        },
      };
    }

    if (command === "generate") {
      const request = parseContentRequest(parseArgs(args));
      const content = await orchestrator.generate(request);

      return {
        ok: true,
        command,
        data: content,
      };
    }

    if (command === "generate-daily") {
      return {
        ok: false,
        command,
        error: "generate-daily starts in Phase 3 after topic scoring and deduplication are implemented.",
      };
    }

    if (command === "list-review") {
      return {
        ok: true,
        command,
        data: await orchestrator.listReviewQueue(),
      };
    }

    if (command === "show-review") {
      const contentId = args[0];

      if (!contentId) {
        throw new Error("show-review requires a content id.");
      }

      return {
        ok: true,
        command,
        data: await orchestrator.getReviewItem(contentId),
      };
    }

    if (command === "regenerate-script") {
      const contentId = args[0];

      if (!contentId) {
        throw new Error("regenerate-script requires a content id.");
      }

      return {
        ok: true,
        command,
        data: await orchestrator.regenerateScript(contentId),
      };
    }

    if (command === "regenerate-media") {
      const contentId = args[0];

      if (!contentId) {
        throw new Error("regenerate-media requires a content id.");
      }

      return {
        ok: true,
        command,
        data: await orchestrator.regenerateMedia(contentId),
      };
    }

    if (command === "regenerate-captions") {
      const contentId = args[0];

      if (!contentId) {
        throw new Error("regenerate-captions requires a content id.");
      }

      return {
        ok: true,
        command,
        data: await orchestrator.regenerateCaptions(contentId),
      };
    }

    if (command === "approve") {
      const contentId = args[0];

      if (!contentId) {
        throw new Error("approve requires a content id.");
      }

      return {
        ok: true,
        command,
        data: await orchestrator.approve(contentId, args.slice(1).join(" ") || undefined),
      };
    }

    if (command === "reject") {
      const contentId = args[0];

      if (!contentId) {
        throw new Error("reject requires a content id.");
      }

      return {
        ok: true,
        command,
        data: await orchestrator.reject(contentId, args.slice(1).join(" ") || undefined),
      };
    }

    if (command === "simulate-publish") {
      const contentId = args[0];

      if (!contentId) {
        throw new Error("simulate-publish requires a content id.");
      }

      const platform = parsePublishPlatform(args.slice(1));

      return {
        ok: true,
        command,
        data: await orchestrator.simulatePublish(contentId, platform),
      };
    }

    if (command === "publish") {
      return {
        ok: false,
        command,
        error: "Official publishing is intentionally disabled in this MVP. Use simulate-publish for Phase 8 validation.",
      };
    }

    return {
      ok: true,
      command,
      data: getHelpText(),
    };
  } catch (error) {
    return {
      ok: false,
      command,
      error: getSocialContentErrorMessage(error),
    };
  }
}

function parsePublishPlatform(args: string[]): SocialContentPlatform | undefined {
  const options = parseArgs(args);
  const platform = options.platform;

  if (!platform) {
    return undefined;
  }

  if (typeof platform !== "string" || !socialContentPlatforms.includes(platform as SocialContentPlatform)) {
    throw new Error(`Unsupported publication platform: ${String(platform)}.`);
  }

  return platform as SocialContentPlatform;
}

export function parseArgs(args: string[]) {
  const parsed: Record<string, string | boolean> = {};

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];

    if (!arg.startsWith("--")) {
      continue;
    }

    const key = arg.slice(2);
    const next = args[index + 1];

    if (!next || next.startsWith("--")) {
      parsed[key] = true;
    } else {
      parsed[key] = next;
      index += 1;
    }
  }

  return normalizeCliOptions(parsed);
}

function normalizeCliOptions(options: Record<string, string | boolean>) {
  return {
    origin: options.origin,
    destination: options.destination,
    comparisonDestination: options["comparison-destination"] ?? options.comparisonDestination,
    budget: options.budget,
    currency: options.currency,
    durationDays: options.days ?? options.durationDays,
    travelers: options.travelers,
    travelStyle: options.style ?? options.travelStyle,
    month: options.month,
    language: options.language,
    platform: options.platform,
    template: options.template,
    dryRun: options["dry-run"] ?? options.dryRun ?? true,
  };
}

function getHelpText() {
  return [
    "Usage:",
    "npm run social -- inspect",
    "npm run social -- generate --origin Montreal --budget 1500 --currency CAD --days 7 --language fr --template three_destinations",
    "npm run social -- list-review",
    "npm run social -- show-review <content_id>",
    "npm run social -- regenerate-script <content_id>",
    "npm run social -- regenerate-captions <content_id>",
    "npm run social -- regenerate-media <content_id>",
    "npm run social -- approve <content_id>",
    "npm run social -- reject <content_id>",
    "npm run social -- simulate-publish <content_id> [--platform instagram|tiktok]",
  ].join("\n");
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  runSocialContentCli().then((result) => {
    const output = result.ok ? result.data : { error: result.error };
    console.log(typeof output === "string" ? output : JSON.stringify(output, null, 2));
    process.exitCode = result.ok ? 0 : 1;
  });
}
