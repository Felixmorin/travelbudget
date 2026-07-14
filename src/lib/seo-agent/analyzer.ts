import type {
  AnalyticsLandingPageRow,
  DateRange,
  SearchConsoleRow,
  SeoAgentReport,
  SeoOpportunity,
} from "@/lib/seo-agent/types";
import { findInternalLinkSuggestions, findProgrammaticPageIdeas } from "@/lib/seo-agent/growth-ideas";

export function createSeoAgentReport(input: {
  dateRange: DateRange;
  previousDateRange: DateRange;
  searchRows: SearchConsoleRow[];
  previousSearchRows: SearchConsoleRow[];
  analyticsRows: AnalyticsLandingPageRow[];
}): SeoAgentReport {
  const opportunities = [
    ...findCtrOpportunities(input.searchRows),
    ...findRankingOpportunities(input.searchRows),
    ...findDeclineOpportunities(input.searchRows, input.previousSearchRows),
    ...findEngagementOpportunities(input.analyticsRows, input.searchRows),
  ]
    .sort((first, second) => second.impactScore - first.impactScore)
    .slice(0, 25);
  const internalLinkSuggestions = findInternalLinkSuggestions(input.searchRows);
  const programmaticPageIdeas = findProgrammaticPageIdeas(input.searchRows);

  return {
    generatedAt: new Date().toISOString(),
    dateRange: input.dateRange,
    previousDateRange: input.previousDateRange,
    summary: {
      opportunities: opportunities.length,
      highPriority: opportunities.filter((opportunity) => opportunity.priority === "high").length,
      searchRowsAnalyzed: input.searchRows.length,
      analyticsRowsAnalyzed: input.analyticsRows.length,
      internalLinkSuggestions: internalLinkSuggestions.length,
      programmaticPageIdeas: programmaticPageIdeas.length,
    },
    opportunities,
    internalLinkSuggestions,
    programmaticPageIdeas,
  };
}

function findCtrOpportunities(rows: SearchConsoleRow[]): SeoOpportunity[] {
  return rows
    .filter((row) => row.impressions >= 100 && row.position <= 10)
    .map((row): SeoOpportunity | null => {
      const expectedCtr = getExpectedCtr(row.position);
      const ctrGap = expectedCtr - row.ctr;

      if (ctrGap <= 0.015) {
        return null;
      }

      const missedClicks = Math.round(row.impressions * ctrGap);

      return {
        id: stableId("ctr", row.page, row.query),
        priority: missedClicks >= 50 ? "high" : missedClicks >= 20 ? "medium" : "low",
        category: "ctr",
        title: "Ameliorer le titre/meta pour capter plus de clics",
        page: row.page,
        query: row.query,
        impactScore: missedClicks,
        evidence: `${row.impressions} impressions, position moyenne ${formatNumber(row.position)}, CTR ${formatPercent(row.ctr)}.`,
        recommendation:
          "Revoir le title, la meta description et l'intention de recherche. Tester un angle plus precis: budget, duree, ville de depart, saison ou comparaison directe.",
      } satisfies SeoOpportunity;
    })
    .filter((opportunity): opportunity is SeoOpportunity => opportunity !== null);
}

function findRankingOpportunities(rows: SearchConsoleRow[]): SeoOpportunity[] {
  return rows
    .filter((row) => row.impressions >= 50 && row.position > 8 && row.position <= 20)
    .map((row) => ({
      id: stableId("ranking", row.page, row.query),
      priority: row.impressions >= 500 ? "high" : row.impressions >= 200 ? "medium" : "low",
      category: "ranking",
      title: "Pousser une page deja proche de la premiere page",
      page: row.page,
      query: row.query,
      impactScore: Math.round(row.impressions / Math.max(row.position - 7, 1)),
      evidence: `${row.impressions} impressions, position moyenne ${formatNumber(row.position)}, ${row.clicks} clics.`,
      recommendation:
        "Ajouter une section qui repond mieux a la requete, renforcer les liens internes vers cette page et verifier que le H1/H2 couvrent explicitement le sujet.",
    }));
}

function findDeclineOpportunities(currentRows: SearchConsoleRow[], previousRows: SearchConsoleRow[]): SeoOpportunity[] {
  const currentByPage = aggregateByPage(currentRows);
  const previousByPage = aggregateByPage(previousRows);
  const opportunities: SeoOpportunity[] = [];

  for (const [page, previous] of previousByPage) {
    const current = currentByPage.get(page);

    if (!current || previous.clicks < 10) {
      continue;
    }

    const clickDelta = current.clicks - previous.clicks;
    const clickDropRatio = Math.abs(clickDelta) / previous.clicks;

    if (clickDelta >= -5 || clickDropRatio < 0.25) {
      continue;
    }

    opportunities.push({
      id: stableId("decline", page),
      priority: previous.clicks - current.clicks >= 30 ? "high" : "medium",
      category: "decline",
      title: "Diagnostiquer une baisse organique recente",
      page,
      impactScore: previous.clicks - current.clicks,
      evidence: `${previous.clicks} clics avant vs ${current.clicks} maintenant, soit ${formatPercent(clickDropRatio)} de baisse.`,
      recommendation:
        "Comparer les requetes qui ont perdu des impressions/clics, verifier l'indexation, la cannibalisation avec de nouvelles pages et mettre a jour le contenu si l'intention a change.",
    });
  }

  return opportunities;
}

function findEngagementOpportunities(
  analyticsRows: AnalyticsLandingPageRow[],
  searchRows: SearchConsoleRow[]
): SeoOpportunity[] {
  const searchPageUrls = new Set(searchRows.map((row) => row.page));
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");

  return analyticsRows
    .filter((row) => row.sessions >= 20 && row.engagementRate > 0 && row.engagementRate < 0.45)
    .map((row) => {
      const page = siteUrl ? `${siteUrl}${row.path}` : row.path;
      const hasOrganicSearchData = searchPageUrls.has(page);

      return {
        id: stableId("engagement", page),
        priority: row.sessions >= 100 ? "high" : row.sessions >= 50 ? "medium" : "low",
        category: "engagement",
        title: "Reduire la perte d'engagement apres l'arrivee sur la page",
        page,
        impactScore: Math.round(row.sessions * (0.45 - row.engagementRate)),
        evidence: `${row.sessions} sessions, taux d'engagement ${formatPercent(row.engagementRate)}.${hasOrganicSearchData ? " La page recoit aussi du trafic SEO mesurable." : ""}`,
        recommendation:
          "Clarifier le premier ecran, rapprocher le calculateur ou la reponse principale du haut de page, et ajouter des appels internes vers les destinations/comparaisons pertinentes.",
      } satisfies SeoOpportunity;
    });
}

function aggregateByPage(rows: SearchConsoleRow[]) {
  const byPage = new Map<string, { clicks: number; impressions: number }>();

  for (const row of rows) {
    const current = byPage.get(row.page) ?? { clicks: 0, impressions: 0 };
    current.clicks += row.clicks;
    current.impressions += row.impressions;
    byPage.set(row.page, current);
  }

  return byPage;
}

function getExpectedCtr(position: number) {
  if (position <= 1.5) return 0.22;
  if (position <= 3) return 0.12;
  if (position <= 5) return 0.07;
  if (position <= 8) return 0.035;
  return 0.02;
}

function stableId(...parts: Array<string | undefined>) {
  return parts.filter(Boolean).join(":").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 120);
}

function formatPercent(value: number) {
  return `${Math.round(value * 1000) / 10}%`;
}

function formatNumber(value: number) {
  return (Math.round(value * 10) / 10).toString();
}
