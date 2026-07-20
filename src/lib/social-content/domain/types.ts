import type { SupportedCurrency } from "@/lib/currency/exchange-rates";
import type { TravelStyle } from "@/lib/budget/recommend-destinations";

export const socialContentStatuses = [
  "draft",
  "topic_selected",
  "data_validated",
  "script_generated",
  "assets_ready",
  "rendering",
  "ready_for_review",
  "approved",
  "rejected",
  "published",
  "failed",
] as const;

export type SocialContentStatus = (typeof socialContentStatuses)[number];

export const socialContentTemplates = [
  "three_destinations",
  "destination_cost",
  "destination_comparison",
  "daily_budget",
] as const;

export type SocialContentTemplate = (typeof socialContentTemplates)[number];

export type SocialContentLanguage = "fr" | "en";
export type SocialContentPlatform = "tiktok" | "instagram";

export type ContentRequest = {
  origin: string;
  destination?: string;
  comparisonDestination?: string;
  budget: number;
  currency: SupportedCurrency;
  durationDays: number;
  travelers: number;
  travelStyle: TravelStyle;
  month?: string;
  language: SocialContentLanguage;
  platform: SocialContentPlatform;
  template: SocialContentTemplate;
  dryRun: boolean;
};

export const socialContentPlatforms = ["tiktok", "instagram"] as const;

export type BudgetBreakdown = {
  flights: number;
  accommodation: number;
  food: number;
  localTransport: number;
  activities: number;
  miscellaneous: number;
  total: number;
  currency: SupportedCurrency;
  estimatedAt: string;
  dataSource: "gobybudget-estimate";
  sourceNotes: string[];
};

export type ContentTopic = {
  id: string;
  title: string;
  template: SocialContentTemplate;
  origin: string;
  destinationSlugs: string[];
  budget: number;
  currency: SupportedCurrency;
  durationDays: number;
  language: SocialContentLanguage;
  platform: SocialContentPlatform;
  score: number;
  landingPagePath: string;
  reasons: string[];
};

export type ContentScene = {
  id: string;
  scriptLine: string;
  visualPrompt: string;
  startSeconds?: number;
  endSeconds?: number;
  durationSeconds: number;
  sourceUrl?: string;
  sourceLicense?: string;
  warnings: string[];
};

export type ContentCaptions = {
  internalTitle: string;
  firstLine: string;
  tiktokCaption: string;
  instagramCaption: string;
  cta: string;
  hashtags: string[];
  coverText: string;
  landingPageUrl: string;
  utm: Record<string, string>;
};

export type GenerationStepLog = {
  runId: string;
  contentId: string;
  agent: string;
  step: string;
  status: "started" | "succeeded" | "failed" | "skipped";
  durationMs: number;
  estimatedCostUsd: number;
  error?: string;
  retries: number;
  createdAt: string;
};

export type ScriptValidation = {
  numericClaims: number[];
  allowedNumericClaims: Array<{
    value: number;
    label: string;
  }>;
};

export type GeneratedMedia = {
  outputDir: string;
  sceneImagePaths: string[];
  subtitleSrtPath: string;
  subtitleVttPath: string;
  coverPath: string;
  manifestPath: string;
  voicePath?: string;
  videoPath?: string;
  durationSeconds: number;
  width: number;
  height: number;
  renderer: "ffmpeg" | "dry-run";
};

export type SocialMetricSnapshot = {
  contentId: string;
  platform: SocialContentPlatform;
  collectedAt: string;
  views: number;
  reach: number;
  watchTimeSeconds: number;
  averageWatchSeconds: number;
  retention3sRate: number;
  completionRate: number;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  profileVisits: number;
  gobybudgetClicks: number;
  gobybudgetSearches: number;
  conversions: number;
  attributedRevenue: number;
};

export type ExperimentDimensions = {
  hook: string | null;
  destinationSlugs: string[];
  origin: string;
  budget: number;
  durationDays: number;
  language: string;
  template: string;
  videoDurationSeconds: number | null;
  platform: SocialContentPlatform;
  cta: string | null;
};

export type GeneratedContent = {
  id: string;
  runId: string;
  status: SocialContentStatus;
  request: ContentRequest;
  topic?: ContentTopic;
  budgetBreakdown?: BudgetBreakdown;
  hook?: string;
  script?: string;
  scriptValidation?: ScriptValidation;
  scenes: ContentScene[];
  media?: GeneratedMedia;
  captions?: ContentCaptions;
  metrics?: SocialMetricSnapshot;
  experimentDimensions?: ExperimentDimensions;
  publicationResults?: PublishResult[];
  landingPageUrl?: string;
  videoPath?: string;
  thumbnailPath?: string;
  warnings: string[];
  errors: string[];
  costEstimateUsd: number;
  createdAt: string;
  updatedAt: string;
};

export type ReviewDecision = "approved" | "rejected";

export type ContentReview = {
  id: string;
  contentId: string;
  decision?: ReviewDecision;
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

export type PublishResult = {
  ok: boolean;
  platform: SocialContentPlatform;
  mode: "simulation" | "official_api";
  createdAt: string;
  externalId?: string;
  url?: string;
  warnings?: string[];
  error?: string;
};
