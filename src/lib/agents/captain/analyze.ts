import type {
  CaptainCandidateMission,
  CaptainDailySummary,
  CaptainEffort,
  CaptainImpact,
} from "@/lib/agents/captain/types";
import type { AgentMission } from "@/lib/agents/types";
import type { ProductAnalystFinding, ProductAnalystReport } from "@/lib/agents/product-analyst/types";

const maxCaptainMissionsPerDay = 3;

export function buildCaptainCandidates(
  reports: Array<{ executionId: string; report: ProductAnalystReport }>
): CaptainCandidateMission[] {
  return reports
    .flatMap(({ executionId, report }) =>
      report.findings
        .filter((finding) => finding.importance !== "low")
        .map((finding) => toCandidateMission(executionId, finding))
    )
    .sort(compareCandidates);
}

export function planCaptainMissions({
  candidates,
  existingMissions,
  now = new Date(),
}: {
  candidates: CaptainCandidateMission[];
  existingMissions: AgentMission[];
  now?: Date;
}) {
  const dayKey = toDayKey(now);
  const captainMissionsToday = existingMissions.filter(
    (mission) => mission.requestedBy === "agent:captain" && toDayKey(new Date(mission.createdAt)) === dayKey
  ).length;
  const remainingSlots = Math.max(0, maxCaptainMissionsPerDay - captainMissionsToday);
  const existingDuplicateKeys = new Set(
    existingMissions
      .map((mission) => {
        const captain = mission.input.captain;

        return captain && typeof captain === "object" && !Array.isArray(captain)
          ? typeof captain.duplicateKey === "string"
            ? captain.duplicateKey
            : null
          : null;
      })
      .filter((value): value is string => Boolean(value))
  );
  const selected: CaptainCandidateMission[] = [];
  const skipped: Array<{ duplicateKey: string; reason: "duplicate" | "daily_limit" | "unknown_agent" }> = [];

  for (const candidate of candidates) {
    if (candidate.assignedAgentId !== "product-analyst") {
      skipped.push({ duplicateKey: candidate.duplicateKey, reason: "unknown_agent" });
      continue;
    }

    if (existingDuplicateKeys.has(candidate.duplicateKey)) {
      skipped.push({ duplicateKey: candidate.duplicateKey, reason: "duplicate" });
      continue;
    }

    if (selected.length >= remainingSlots) {
      skipped.push({ duplicateKey: candidate.duplicateKey, reason: "daily_limit" });
      continue;
    }

    selected.push(candidate);
    existingDuplicateKeys.add(candidate.duplicateKey);
  }

  return {
    selected,
    skipped,
    dailyQuotaRemaining: Math.max(0, remainingSlots - selected.length),
    maxCaptainMissionsPerDay,
  };
}

export function buildCaptainDailySummary({
  date,
  reportsReviewed,
  candidatesFound,
  missionsCreated,
  duplicatesSkipped,
  dailyQuotaRemaining,
}: Omit<CaptainDailySummary, "summary">): CaptainDailySummary {
  return {
    date,
    reportsReviewed,
    candidatesFound,
    missionsCreated,
    duplicatesSkipped,
    dailyQuotaRemaining,
    summary:
      missionsCreated > 0
        ? `Captain reviewed ${reportsReviewed} Product Analyst report(s), created ${missionsCreated} mission(s), and left ${dailyQuotaRemaining} daily slot(s).`
        : `Captain reviewed ${reportsReviewed} Product Analyst report(s) and created no missions because candidates were duplicated, low impact, or quota-limited.`,
  };
}

export function estimateCaptainCostCents(reportsReviewed: number, candidatesFound: number) {
  return Math.max(1, Math.min(20, 2 + reportsReviewed + Math.ceil(candidatesFound / 3)));
}

function toCandidateMission(executionId: string, finding: ProductAnalystFinding): CaptainCandidateMission {
  const effort = estimateEffort(finding);

  return {
    title: `Investigate ${finding.targetMetric}`,
    assignedAgentId: "product-analyst",
    sourceReportExecutionId: executionId,
    sourceProblem: finding.problemDetected,
    targetMetric: finding.targetMetric,
    recommendedAction: finding.recommendedAction,
    impact: finding.importance,
    effort,
    confidenceLevel: finding.confidenceLevel,
    duplicateKey: buildDuplicateKey(finding),
  };
}

function estimateEffort(finding: ProductAnalystFinding): CaptainEffort {
  const text = `${finding.recommendedAction} ${finding.likelyCause}`.toLowerCase();

  if (text.includes("audit") || text.includes("investigate") || text.includes("third-party")) {
    return "high";
  }

  if (text.includes("test") || text.includes("compare") || text.includes("inspect")) {
    return "medium";
  }

  return "low";
}

function compareCandidates(a: CaptainCandidateMission, b: CaptainCandidateMission) {
  return impactScore(b.impact) - impactScore(a.impact) || effortScore(a.effort) - effortScore(b.effort);
}

function impactScore(impact: CaptainImpact) {
  return impact === "critical" ? 4 : impact === "high" ? 3 : impact === "medium" ? 2 : 1;
}

function effortScore(effort: CaptainEffort) {
  return effort === "low" ? 1 : effort === "medium" ? 2 : 3;
}

function buildDuplicateKey(finding: ProductAnalystFinding) {
  return normalizeKey(`${finding.targetMetric}:${finding.recommendedAction}`);
}

function normalizeKey(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 160);
}

function toDayKey(date: Date) {
  return date.toISOString().slice(0, 10);
}
