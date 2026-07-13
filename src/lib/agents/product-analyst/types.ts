export type ProductAnalystSource = "stored" | "demo";
export type ProductAnalystImportance = "low" | "medium" | "high" | "critical";
export type ProductAnalystConfidence = "low" | "medium" | "high";

export type ProductAnalystData = {
  source: ProductAnalystSource;
  generatedAt: string;
  searches: {
    started: number;
    completed: number;
    withoutResults: number;
  };
  selectedDestinations: {
    total: number;
    top: Array<{
      destinationSlug: string;
      count: number;
    }>;
  };
  affiliateClicks: {
    total: number;
    byType: Array<{
      affiliateType: string;
      count: number;
    }>;
  };
  savedTrips: {
    total: number;
    byCurrency: Array<{
      currency: string;
      count: number;
    }>;
  };
  appErrors: {
    total: number;
    top: Array<{
      message: string;
      count: number;
    }>;
  };
  performance: {
    mobile: ProductAnalystPerformanceSummary;
    desktop: ProductAnalystPerformanceSummary;
  };
};

export type ProductAnalystPerformanceSummary = {
  samples: number;
  averageLcpMs: number | null;
  averageInpMs: number | null;
};

export type ProductAnalystFinding = {
  problemDetected: string;
  dataUsed: string[];
  importance: ProductAnalystImportance;
  likelyCause: string;
  confidenceLevel: ProductAnalystConfidence;
  recommendedAction: string;
  targetMetric: string;
};

export type ProductAnalystReport = {
  agentId: "product-analyst";
  generatedAt: string;
  source: ProductAnalystSource;
  costCents: number;
  stepCount: number;
  findings: ProductAnalystFinding[];
  dataSnapshot: ProductAnalystData;
};
