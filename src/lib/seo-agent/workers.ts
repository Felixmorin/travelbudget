import type { SeoAgentReport, SeoOpportunity } from "@/lib/seo-agent/types";

export type AiWorkerId = "seo-ga4" | "internal-linking" | "programmatic-seo" | "conversion";

export type AiWorkerDefinition = {
  id: AiWorkerId;
  name: string;
  cadence: "manual" | "weekly";
  description: string;
};

export type AiWorkerTask = {
  id: string;
  workerId: AiWorkerId;
  priority: "high" | "medium" | "low";
  title: string;
  target: string;
  action: string;
  evidence: string;
  status: "proposed";
};

export type AiWorkerRunReport = {
  generatedAt: string;
  mode: "manual" | "scheduled";
  workers: AiWorkerDefinition[];
  tasks: AiWorkerTask[];
  summary: {
    workers: number;
    tasks: number;
    highPriority: number;
  };
  seoReport: SeoAgentReport;
};

export const aiWorkers: AiWorkerDefinition[] = [
  {
    id: "seo-ga4",
    name: "SEO / GA4 worker",
    cadence: "weekly",
    description: "Surveille GSC et GA4 pour trouver CTR faible, positions proches, baisses organiques et pages peu engageantes.",
  },
  {
    id: "internal-linking",
    name: "Internal linking worker",
    cadence: "weekly",
    description: "Propose des liens internes depuis les hubs et pages fortes vers les pages qui ont besoin d'autorite.",
  },
  {
    id: "programmatic-seo",
    name: "Programmatic SEO worker",
    cadence: "weekly",
    description: "Repere les pages presque indexables et les requetes qui peuvent devenir de nouvelles pages utiles.",
  },
  {
    id: "conversion",
    name: "Conversion worker",
    cadence: "weekly",
    description: "Repere les pages avec trafic mais engagement faible pour proposer des ameliorations CTA et premier ecran.",
  },
];

export function createWorkerRunReport(seoReport: SeoAgentReport, mode: AiWorkerRunReport["mode"]): AiWorkerRunReport {
  const tasks = [
    ...seoReport.opportunities.map(opportunityToTask),
    ...seoReport.internalLinkSuggestions.map((suggestion) => ({
      id: suggestion.id,
      workerId: "internal-linking" as const,
      priority: suggestion.priority,
      title: `Ajouter un lien interne: ${suggestion.anchorText}`,
      target: suggestion.targetPage,
      action: `Depuis ${suggestion.sourcePage}, ajouter un lien vers ${suggestion.targetPage} avec l'ancre "${suggestion.anchorText}".`,
      evidence: suggestion.reason,
      status: "proposed" as const,
    })),
    ...seoReport.programmaticPageIdeas.map((idea) => ({
      id: idea.id,
      workerId: "programmatic-seo" as const,
      priority: idea.priority,
      title: idea.title,
      target: idea.suggestedPath,
      action: idea.recommendation,
      evidence: idea.evidence,
      status: "proposed" as const,
    })),
  ].sort((first, second) => getPriorityScore(second.priority) - getPriorityScore(first.priority));

  return {
    generatedAt: new Date().toISOString(),
    mode,
    workers: aiWorkers,
    tasks,
    summary: {
      workers: aiWorkers.length,
      tasks: tasks.length,
      highPriority: tasks.filter((task) => task.priority === "high").length,
    },
    seoReport,
  };
}

function opportunityToTask(opportunity: SeoOpportunity): AiWorkerTask {
  const workerId: AiWorkerId = opportunity.category === "engagement" ? "conversion" : "seo-ga4";

  return {
    id: opportunity.id,
    workerId,
    priority: opportunity.priority,
    title: opportunity.title,
    target: opportunity.page,
    action: opportunity.recommendation,
    evidence: opportunity.evidence,
    status: "proposed",
  };
}

function getPriorityScore(priority: AiWorkerTask["priority"]) {
  if (priority === "high") return 3;
  if (priority === "medium") return 2;
  return 1;
}
