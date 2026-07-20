import { resolve } from "node:path";

export type SocialContentFeatureFlags = {
  llmGeneration: boolean;
  voiceGeneration: boolean;
  videoRendering: boolean;
  publishing: boolean;
};

export type SocialContentConfig = {
  enabled: boolean;
  siteUrl: string;
  outputDir: string;
  defaultDryRun: boolean;
  maxRetries: number;
  staleDataDays: number;
  defaultEstimatedCostUsd: number;
  featureFlags: SocialContentFeatureFlags;
};

export function getSocialContentConfig(env: NodeJS.ProcessEnv = process.env): SocialContentConfig {
  return {
    enabled: getBoolean(env.SOCIAL_AGENT_ENABLED, false),
    siteUrl: (env.NEXT_PUBLIC_SITE_URL ?? "https://gobybudget.com").replace(/\/$/, ""),
    outputDir: resolve(env.SOCIAL_AGENT_OUTPUT_DIR ?? ".social-content-agent"),
    defaultDryRun: getBoolean(env.SOCIAL_AGENT_DRY_RUN_DEFAULT, true),
    maxRetries: getInteger(env.SOCIAL_AGENT_MAX_RETRIES, 2, 0, 8),
    staleDataDays: getInteger(env.SOCIAL_AGENT_STALE_DATA_DAYS, 120, 1, 730),
    defaultEstimatedCostUsd: getNumber(env.SOCIAL_AGENT_DEFAULT_COST_USD, 0),
    featureFlags: {
      llmGeneration: getBoolean(env.SOCIAL_AGENT_ENABLE_LLM, false),
      voiceGeneration: getBoolean(env.SOCIAL_AGENT_ENABLE_TTS, false),
      videoRendering: getBoolean(env.SOCIAL_AGENT_ENABLE_VIDEO_RENDERING, true),
      publishing: false,
    },
  };
}

export function getRedactedSocialContentConfig(config = getSocialContentConfig()) {
  return {
    ...config,
    outputDir: config.outputDir,
    featureFlags: {
      ...config.featureFlags,
      publishing: false,
    },
  };
}

function getBoolean(value: string | undefined, fallback: boolean) {
  if (value === undefined || value.trim() === "") return fallback;
  return ["1", "true", "yes", "on"].includes(value.trim().toLowerCase());
}

function getInteger(value: string | undefined, fallback: number, min: number, max: number) {
  const parsed = Number.parseInt(value ?? "", 10);

  if (!Number.isFinite(parsed)) return fallback;

  return Math.min(max, Math.max(min, parsed));
}

function getNumber(value: string | undefined, fallback: number) {
  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : fallback;
}
