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

export type SeoAgentReport = {
  generatedAt: string;
  dateRange: DateRange;
  previousDateRange: DateRange;
  summary: {
    opportunities: number;
    highPriority: number;
    searchRowsAnalyzed: number;
    analyticsRowsAnalyzed: number;
  };
  opportunities: SeoOpportunity[];
};
