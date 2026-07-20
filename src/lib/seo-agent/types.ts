export type DateRange = {
  startDate: string;
  endDate: string;
};

export type SearchConsoleRow = {
  page: string;
  query?: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
};

export type AnalyticsLandingPageRow = {
  path: string;
  sessions: number;
  activeUsers: number;
  engagementRate: number;
};

export type SeoOpportunity = {
  id: string;
  priority: "high" | "medium" | "low";
  category: "ctr" | "ranking" | "engagement" | "decline";
  title: string;
  page: string;
  query?: string;
  impactScore: number;
  evidence: string;
  recommendation: string;
};

export type InternalLinkSuggestion = {
  id: string;
  priority: "high" | "medium" | "low";
  sourcePage: string;
  targetPage: string;
  anchorText: string;
  reason: string;
  impactScore: number;
};

export type ProgrammaticPageIdea = {
  id: string;
  priority: "high" | "medium" | "low";
  suggestedPath: string;
  title: string;
  targetQuery: string;
  pageType: "origin-budget" | "destination-budget" | "duration" | "comparison" | "guide";
  evidence: string;
  recommendation: string;
  impactScore: number;
};

export type ContentRefreshSuggestion = {
  id: string;
  priority: "high" | "medium" | "low";
  page: string;
  title: string;
  reason: string;
  recommendation: string;
  impactScore: number;
};

export type SerpIntentSuggestion = {
  id: string;
  priority: "high" | "medium" | "low";
  page: string;
  query: string;
  intent: "budget" | "origin-budget" | "comparison" | "itinerary" | "guide" | "timing";
  reason: string;
  recommendation: string;
  impactScore: number;
};

export type SeoAgentReport = {
  generatedAt: string;
  dateRange: DateRange;
  previousDateRange: DateRange;
  summary: {
    opportunities: number;
    highPriority: number;
    searchRowsAnalyzed: number;
    analyticsRowsAnalyzed: number;
    internalLinkSuggestions: number;
    programmaticPageIdeas: number;
    contentRefreshSuggestions: number;
    serpIntentSuggestions: number;
  };
  opportunities: SeoOpportunity[];
  internalLinkSuggestions: InternalLinkSuggestion[];
  programmaticPageIdeas: ProgrammaticPageIdea[];
  contentRefreshSuggestions: ContentRefreshSuggestion[];
  serpIntentSuggestions: SerpIntentSuggestion[];
};
