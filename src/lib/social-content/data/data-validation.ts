import { getUnifiedDestination } from "@/lib/data/unified-destinations";
import { SocialContentError } from "@/lib/social-content/domain/errors";
import type { BudgetBreakdown, ContentRequest } from "@/lib/social-content/domain/types";
import { assertBudgetBreakdown } from "@/lib/social-content/domain/validation";

export type DataValidationResult = {
  ok: boolean;
  warnings: string[];
  errors: string[];
};

export function validateGoByBudgetEstimate({
  request,
  destinationSlug,
  breakdown,
  staleDataDays,
  landingPagePath,
}: {
  request: ContentRequest;
  destinationSlug: string;
  breakdown: BudgetBreakdown;
  staleDataDays: number;
  landingPagePath: string;
}): DataValidationResult {
  const warnings: string[] = [];
  const errors: string[] = [];
  const destination = getUnifiedDestination(destinationSlug);

  if (!destination) {
    errors.push(`Unknown destination: ${destinationSlug}.`);
  }

  try {
    assertBudgetBreakdown(breakdown);
  } catch (error) {
    errors.push(error instanceof Error ? error.message : "Invalid budget breakdown.");
  }

  if (breakdown.currency !== "CAD") {
    errors.push("GoByBudget source estimates must be stored in CAD before display conversion.");
  }

  if (!landingPagePath.startsWith("/")) {
    errors.push("Landing page path must be an internal GoByBudget path.");
  }

  if (breakdown.flights <= 0) {
    errors.push(`Flight estimate is unavailable for ${request.origin} to ${destinationSlug}.`);
  }

  const estimateAgeDays = getAgeInDays(breakdown.estimatedAt);

  if (estimateAgeDays === null) {
    errors.push("Estimate date is invalid.");
  } else if (estimateAgeDays > staleDataDays) {
    errors.push(`Estimate is too old: ${estimateAgeDays} days old.`);
  } else if (estimateAgeDays > staleDataDays * 0.75) {
    warnings.push(`Estimate is ${estimateAgeDays} days old and should be refreshed soon.`);
  }

  if (destination?.dataConfidence === "low") {
    warnings.push(`${destination.name} has low data confidence.`);
  }

  if (destination && destination.sourceNotes.length === 0) {
    warnings.push(`${destination.name} has no source notes.`);
  }

  return {
    ok: errors.length === 0,
    warnings,
    errors,
  };
}

export function assertGoByBudgetEstimateValid(result: DataValidationResult) {
  if (!result.ok) {
    throw new SocialContentError("invalid_gobybudget_data", "GoByBudget data validation failed.", {
      errors: result.errors.join("; "),
    });
  }
}

function getAgeInDays(value: string) {
  const timestamp = Date.parse(value);

  if (!Number.isFinite(timestamp)) {
    return null;
  }

  return Math.floor((Date.now() - timestamp) / 86_400_000);
}
