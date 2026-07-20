import { isSupportedCurrency } from "@/lib/currency/exchange-rates";
import { SocialContentError } from "@/lib/social-content/domain/errors";
import {
  socialContentTemplates,
  type BudgetBreakdown,
  type ContentRequest,
  type SocialContentLanguage,
  type SocialContentPlatform,
  type SocialContentTemplate,
} from "@/lib/social-content/domain/types";

const languages = ["fr", "en"] as const satisfies SocialContentLanguage[];
const platforms = ["tiktok", "instagram"] as const satisfies SocialContentPlatform[];
const travelStyles = ["budget", "balanced", "comfort"] as const;

export function parseContentRequest(input: Record<string, unknown>): ContentRequest {
  const currency = String(input.currency ?? "CAD").toUpperCase();
  const template = String(input.template ?? "three_destinations");
  const language = String(input.language ?? "fr");
  const platform = String(input.platform ?? "instagram");
  const travelStyle = String(input.travelStyle ?? input.style ?? "balanced");

  const request: ContentRequest = {
    origin: getRequiredString(input.origin, "origin"),
    destination: getOptionalString(input.destination),
    comparisonDestination: getOptionalString(input.comparisonDestination),
    budget: getNumber(input.budget, "budget"),
    currency: assertCurrency(currency),
    durationDays: getInteger(input.durationDays ?? input.days, "durationDays", 1, 60),
    travelers: getInteger(input.travelers ?? 1, "travelers", 1, 12),
    travelStyle: assertTravelStyle(travelStyle),
    month: getOptionalString(input.month),
    language: assertLanguage(language),
    platform: assertPlatform(platform),
    template: assertTemplate(template),
    dryRun: getBoolean(input.dryRun, true),
  };

  assertContentRequest(request);

  return request;
}

export function assertContentRequest(request: ContentRequest) {
  if (!request.origin.trim()) {
    throw new SocialContentError("invalid_request", "Origin is required.");
  }

  if (!Number.isFinite(request.budget) || request.budget <= 0) {
    throw new SocialContentError("invalid_request", "Budget must be a positive number.", {
      budget: request.budget,
    });
  }

  if (request.template === "destination_cost" || request.template === "daily_budget") {
    if (!request.destination?.trim()) {
      throw new SocialContentError("invalid_request", `${request.template} requires a destination.`);
    }
  }

  if (request.template === "destination_comparison") {
    if (!request.destination?.trim() || !request.comparisonDestination?.trim()) {
      throw new SocialContentError("invalid_request", "destination_comparison requires two destinations.");
    }
  }
}

export function assertBudgetBreakdown(breakdown: BudgetBreakdown) {
  const subtotal =
    breakdown.flights +
    breakdown.accommodation +
    breakdown.food +
    breakdown.localTransport +
    breakdown.activities +
    breakdown.miscellaneous;

  if (!Number.isFinite(breakdown.total) || breakdown.total <= 0) {
    throw new SocialContentError("invalid_budget_breakdown", "Budget total must be positive.");
  }

  if (Math.abs(subtotal - breakdown.total) > 1) {
    throw new SocialContentError("invalid_budget_breakdown", "Budget subtotals do not match the total.", {
      subtotal,
      total: breakdown.total,
    });
  }

  if (!Date.parse(breakdown.estimatedAt)) {
    throw new SocialContentError("invalid_budget_breakdown", "Budget estimate timestamp is invalid.");
  }
}

function getRequiredString(value: unknown, fieldName: string) {
  if (typeof value !== "string" || !value.trim()) {
    throw new SocialContentError("invalid_request", `${fieldName} is required.`);
  }

  return value.trim();
}

function getOptionalString(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function getNumber(value: unknown, fieldName: string) {
  const parsed = typeof value === "number" ? value : Number(value);

  if (!Number.isFinite(parsed)) {
    throw new SocialContentError("invalid_request", `${fieldName} must be a number.`);
  }

  return parsed;
}

function getInteger(value: unknown, fieldName: string, min: number, max: number) {
  const parsed = Math.round(getNumber(value, fieldName));

  if (parsed < min || parsed > max) {
    throw new SocialContentError("invalid_request", `${fieldName} must be between ${min} and ${max}.`, {
      value: parsed,
    });
  }

  return parsed;
}

function getBoolean(value: unknown, fallback: boolean) {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") return ["1", "true", "yes"].includes(value.toLowerCase());
  return fallback;
}

function assertCurrency(value: string) {
  if (!isSupportedCurrency(value)) {
    throw new SocialContentError("invalid_request", `Unsupported currency: ${value}.`);
  }

  return value;
}

function assertLanguage(value: string): SocialContentLanguage {
  if (!languages.includes(value as SocialContentLanguage)) {
    throw new SocialContentError("invalid_request", `Unsupported language: ${value}.`);
  }

  return value as SocialContentLanguage;
}

function assertPlatform(value: string): SocialContentPlatform {
  if (!platforms.includes(value as SocialContentPlatform)) {
    throw new SocialContentError("invalid_request", `Unsupported platform: ${value}.`);
  }

  return value as SocialContentPlatform;
}

function assertTemplate(value: string): SocialContentTemplate {
  if (!socialContentTemplates.includes(value as SocialContentTemplate)) {
    throw new SocialContentError("invalid_request", `Unsupported template: ${value}.`);
  }

  return value as SocialContentTemplate;
}

function assertTravelStyle(value: string) {
  if (!travelStyles.includes(value as (typeof travelStyles)[number])) {
    throw new SocialContentError("invalid_request", `Unsupported travel style: ${value}.`);
  }

  return value as (typeof travelStyles)[number];
}
