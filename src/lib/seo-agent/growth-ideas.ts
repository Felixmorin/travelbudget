import { strongSeoPages } from "@/lib/programmatic/strong-seo-pages";
import { getAllSeoRegistryPages } from "@/lib/programmatic/seo-registry";
import type {
  InternalLinkSuggestion,
  ProgrammaticPageIdea,
  SearchConsoleRow,
} from "@/lib/seo-agent/types";

type PageAggregate = {
  page: string;
  clicks: number;
  impressions: number;
  queries: Set<string>;
};

const stopWords = new Set([
  "a",
  "and",
  "best",
  "budget",
  "cad",
  "can",
  "cheap",
  "cost",
  "does",
  "for",
  "from",
  "go",
  "how",
  "in",
  "is",
  "much",
  "of",
  "the",
  "to",
  "travel",
  "trip",
  "under",
  "with",
]);

export function findInternalLinkSuggestions(rows: SearchConsoleRow[]): InternalLinkSuggestion[] {
  const sources = Array.from(aggregateByPage(rows).values())
    .filter((page) => page.clicks >= 3)
    .sort((first, second) => second.clicks - first.clicks);
  const targetRows = rows
    .filter((row) => row.query && row.impressions >= 30 && row.position >= 6 && row.position <= 25)
    .sort((first, second) => getTargetScore(second) - getTargetScore(first));
  const suggestions: InternalLinkSuggestion[] = [];
  const seen = new Set<string>();

  for (const target of targetRows) {
    const source = findBestSourcePage(target, sources);

    if (!source || source.page === target.page) {
      continue;
    }

    const id = stableId("link", source.page, target.page, target.query);

    if (seen.has(id)) {
      continue;
    }

    seen.add(id);
    suggestions.push({
      id,
      priority: target.impressions >= 250 && target.position <= 15 ? "high" : target.impressions >= 100 ? "medium" : "low",
      sourcePage: source.page,
      targetPage: target.page,
      anchorText: getAnchorText(target),
      reason: `${target.impressions} impressions sur "${target.query}", position moyenne ${formatNumber(target.position)}. La page source a ${source.clicks} clics organiques recents.`,
      impactScore: getTargetScore(target) + source.clicks,
    });

    if (suggestions.length >= 12) {
      break;
    }
  }

  const sortedSuggestions = suggestions.sort((first, second) => second.impactScore - first.impactScore);

  return sortedSuggestions.length ? sortedSuggestions : getRegistryInternalLinkSuggestions();
}

export function findProgrammaticPageIdeas(rows: SearchConsoleRow[]): ProgrammaticPageIdea[] {
  const existingPages = getExistingPageSignals();
  const queryRows = aggregateByQuery(rows)
    .filter((row) => row.query.length >= 8 && row.impressions >= 20 && row.position >= 7)
    .sort((first, second) => getQueryScore(second) - getQueryScore(first));
  const ideas: ProgrammaticPageIdea[] = [];
  const seen = new Set<string>();

  for (const row of queryRows) {
    if (isCoveredByExistingPage(row.query, existingPages)) {
      continue;
    }

    const idea = createProgrammaticIdea(row);

    if (!idea || seen.has(idea.id)) {
      continue;
    }

    seen.add(idea.id);
    ideas.push(idea);

    if (ideas.length >= 10) {
      break;
    }
  }

  const sortedIdeas = ideas.sort((first, second) => second.impactScore - first.impactScore);

  return sortedIdeas.length ? sortedIdeas : getRegistryProgrammaticPageIdeas();
}

function getRegistryInternalLinkSuggestions(): InternalLinkSuggestion[] {
  return getAllSeoRegistryPages()
    .filter((page) => page.evaluation.status === "index")
    .sort((first, second) => second.priority - first.priority)
    .slice(0, 8)
    .map((page) => {
      const sourcePage = getHubSourcePage(page.type);

      return {
        id: stableId("registry-link", sourcePage, page.path),
        priority: page.priority >= 0.82 ? "high" : page.priority >= 0.74 ? "medium" : "low",
        sourcePage,
        targetPage: toPublicUrl(page.path),
        anchorText: page.h1,
        reason: `Page indexable prioritaire (${page.type}) avec score qualite ${page.evaluation.score}. Ajouter un lien depuis le hub renforce la decouverte et le contexte interne.`,
        impactScore: Math.round(page.priority * 100),
      } satisfies InternalLinkSuggestion;
    });
}

function getRegistryProgrammaticPageIdeas(): ProgrammaticPageIdea[] {
  return getAllSeoRegistryPages()
    .filter((page) => page.evaluation.status === "noindex" && page.evaluation.score >= 4)
    .sort((first, second) => second.evaluation.score - first.evaluation.score || second.priority - first.priority)
    .slice(0, 8)
    .map((page) => ({
      id: stableId("registry-page", page.path),
      priority: page.evaluation.score >= 5 ? "high" : "medium",
      suggestedPath: page.path,
      title: page.title,
      targetQuery: page.h1,
      pageType: mapRegistryType(page.type),
      evidence: `Page deja generee mais noindex. Manque: ${page.evaluation.reasons.join(", ")}.`,
      recommendation:
        "Completer les donnees ou le contenu manquant, puis laisser le registre SEO passer la page en indexable et l'ajouter au sitemap.",
      impactScore: page.evaluation.score * 20 + Math.round(page.priority * 10),
    }));
}

function findBestSourcePage(target: SearchConsoleRow, sources: PageAggregate[]) {
  const targetTokens = getTokens(`${target.query ?? ""} ${target.page}`);

  return sources
    .filter((source) => source.page !== target.page)
    .map((source) => ({
      source,
      score: source.clicks + overlapScore(targetTokens, getTokens(`${source.page} ${Array.from(source.queries).join(" ")}`)) * 15,
    }))
    .sort((first, second) => second.score - first.score)[0]?.source;
}

function createProgrammaticIdea(row: { query: string; impressions: number; clicks: number; position: number }) {
  const normalizedQuery = row.query.toLowerCase();
  const pageType = getProgrammaticPageType(normalizedQuery);
  const slug = slugify(row.query);

  if (!pageType || !slug) {
    return null;
  }

  const pathPrefix: Record<ProgrammaticPageIdea["pageType"], string> = {
    "origin-budget": "/from",
    "destination-budget": "/travel-budget",
    duration: "/trip-length",
    comparison: "/compare",
    guide: "/guides",
  };
  const title = toTitleCase(row.query);

  return {
    id: stableId("page", pageType, row.query),
    priority: row.impressions >= 250 && row.position <= 20 ? "high" : row.impressions >= 80 ? "medium" : "low",
    suggestedPath: `${pathPrefix[pageType]}/${slug}`,
    title,
    targetQuery: row.query,
    pageType,
    evidence: `${row.impressions} impressions, ${row.clicks} clics, position moyenne ${formatNumber(row.position)}.`,
    recommendation: getPageIdeaRecommendation(pageType),
    impactScore: getQueryScore(row),
  } satisfies ProgrammaticPageIdea;
}

function getProgrammaticPageType(query: string): ProgrammaticPageIdea["pageType"] | null {
  if (/\bfrom\b/.test(query) && /\b(under|budget|cheap|cost)\b/.test(query)) {
    return "origin-budget";
  }

  if (/\b(vs|versus|compare|comparison)\b/.test(query)) {
    return "comparison";
  }

  if (/\b(\d+|seven|ten|week)\s*(day|days)\b/.test(query)) {
    return "duration";
  }

  if (/\b(budget|cost|price|how much)\b/.test(query)) {
    return "destination-budget";
  }

  if (/\b(itinerary|guide|where|when|best)\b/.test(query)) {
    return "guide";
  }

  return null;
}

function getPageIdeaRecommendation(pageType: ProgrammaticPageIdea["pageType"]) {
  const recommendations: Record<ProgrammaticPageIdea["pageType"], string> = {
    "origin-budget":
      "Verifier qu'il existe des estimations de vols pour la ville de depart, puis ajouter la page seulement si elle donne au moins trois destinations utiles.",
    "destination-budget":
      "Créer ou renforcer une page budget destination avec cout total, cout journalier, meilleures periodes, FAQ et liens vers comparaison/calculateur.",
    duration:
      "Créer une page duree avec destinations triees par cout total et assumptions claires pour eviter une page trop mince.",
    comparison:
      "Créer une comparaison seulement si les deux destinations ont assez de donnees et une intention differente des pages budget existantes.",
    guide:
      "Créer un guide seulement si la requete demande une aide editorialisee qui ne se reduit pas a une page budget.",
  };

  return recommendations[pageType];
}

function aggregateByPage(rows: SearchConsoleRow[]) {
  const byPage = new Map<string, PageAggregate>();

  for (const row of rows) {
    const current = byPage.get(row.page) ?? {
      page: row.page,
      clicks: 0,
      impressions: 0,
      queries: new Set<string>(),
    };

    current.clicks += row.clicks;
    current.impressions += row.impressions;

    if (row.query) {
      current.queries.add(row.query);
    }

    byPage.set(row.page, current);
  }

  return byPage;
}

function aggregateByQuery(rows: SearchConsoleRow[]) {
  const byQuery = new Map<string, { query: string; clicks: number; impressions: number; weightedPosition: number }>();

  for (const row of rows) {
    if (!row.query) {
      continue;
    }

    const query = row.query.toLowerCase();
    const current = byQuery.get(query) ?? {
      query,
      clicks: 0,
      impressions: 0,
      weightedPosition: 0,
    };
    const weight = Math.max(row.impressions, 1);

    current.clicks += row.clicks;
    current.impressions += row.impressions;
    current.weightedPosition += row.position * weight;
    byQuery.set(query, current);
  }

  return Array.from(byQuery.values()).map((row) => ({
    query: row.query,
    clicks: row.clicks,
    impressions: row.impressions,
    position: row.impressions > 0 ? row.weightedPosition / row.impressions : 0,
  }));
}

function getExistingPageSignals() {
  return [
    ...getAllSeoRegistryPages().map((page) => `${page.path} ${page.title} ${page.description}`),
    ...strongSeoPages.map((page) => `${page.path} ${page.title} ${page.metaDescription} ${page.primaryKeyword}`),
  ].map(getTokens);
}

function getHubSourcePage(type: ReturnType<typeof getAllSeoRegistryPages>[number]["type"]) {
  const sourceByType: Record<ReturnType<typeof getAllSeoRegistryPages>[number]["type"], string> = {
    destination: "/destinations",
    budget: "/travel-budget",
    "origin-budget": "/travel-budget",
    "trip-length": "/travel-budget-calculator",
    comparison: "/compare",
  };

  return toPublicUrl(sourceByType[type]);
}

function mapRegistryType(type: ReturnType<typeof getAllSeoRegistryPages>[number]["type"]): ProgrammaticPageIdea["pageType"] {
  const pageTypeByRegistryType: Record<ReturnType<typeof getAllSeoRegistryPages>[number]["type"], ProgrammaticPageIdea["pageType"]> = {
    destination: "destination-budget",
    budget: "destination-budget",
    "origin-budget": "origin-budget",
    "trip-length": "duration",
    comparison: "comparison",
  };

  return pageTypeByRegistryType[type];
}

function toPublicUrl(path: string) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://gobybudget.com";
  return path.startsWith("http") ? path : `${siteUrl}${path}`;
}

function isCoveredByExistingPage(query: string, existingPages: string[][]) {
  const queryTokens = getTokens(query);

  if (queryTokens.length < 2) {
    return true;
  }

  return existingPages.some((pageTokens) => overlapScore(queryTokens, pageTokens) >= Math.min(3, queryTokens.length));
}

function getAnchorText(row: SearchConsoleRow) {
  if (row.query && row.query.length <= 70) {
    return row.query;
  }

  return "travel budget estimate";
}

function getTargetScore(row: SearchConsoleRow) {
  return Math.round(row.impressions / Math.max(row.position - 5, 1));
}

function getQueryScore(row: { impressions: number; clicks: number; position: number }) {
  return Math.round(row.impressions / Math.max(row.position - 6, 1) + row.clicks * 4);
}

function getTokens(value: string) {
  return value
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((token) => token.length > 2 && !stopWords.has(token));
}

function overlapScore(first: string[], second: string[]) {
  const secondTokens = new Set(second);
  return first.filter((token) => secondTokens.has(token)).length;
}

function stableId(...parts: Array<string | undefined>) {
  return parts.filter(Boolean).join(":").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 140);
}

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 72);
}

function toTitleCase(value: string) {
  return value.replace(/\w\S*/g, (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
}

function formatNumber(value: number) {
  return (Math.round(value * 10) / 10).toString();
}
