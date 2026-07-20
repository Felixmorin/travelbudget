import { SocialContentError } from "@/lib/social-content/domain/errors";
import type { SocialContentStatus } from "@/lib/social-content/domain/types";

const terminalStatuses = ["approved", "rejected", "published", "failed"] as const satisfies SocialContentStatus[];

const allowedTransitions: Record<SocialContentStatus, SocialContentStatus[]> = {
  draft: ["topic_selected", "failed"],
  topic_selected: ["data_validated", "draft", "failed"],
  data_validated: ["script_generated", "topic_selected", "failed"],
  script_generated: ["assets_ready", "data_validated", "failed"],
  assets_ready: ["rendering", "script_generated", "failed"],
  rendering: ["ready_for_review", "assets_ready", "failed"],
  ready_for_review: ["approved", "rejected", "script_generated", "assets_ready", "failed"],
  approved: ["published"],
  rejected: ["draft"],
  published: [],
  failed: ["draft"],
};

export function canTransitionContentStatus(from: SocialContentStatus, to: SocialContentStatus) {
  return allowedTransitions[from].includes(to);
}

export function assertContentStatusTransition(from: SocialContentStatus, to: SocialContentStatus) {
  if (!canTransitionContentStatus(from, to)) {
    throw new SocialContentError("invalid_status_transition", `Cannot transition social content from ${from} to ${to}.`, {
      from,
      to,
    });
  }
}

export function isTerminalContentStatus(status: SocialContentStatus) {
  return terminalStatuses.includes(status as (typeof terminalStatuses)[number]);
}

export function getAllowedContentStatusTransitions(status: SocialContentStatus) {
  return [...allowedTransitions[status]];
}
