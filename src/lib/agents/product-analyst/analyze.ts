import type {
  ProductAnalystData,
  ProductAnalystFinding,
  ProductAnalystReport,
} from "@/lib/agents/product-analyst/types";

export function analyzeProductData(data: ProductAnalystData): ProductAnalystReport {
  const findings: ProductAnalystFinding[] = [];
  const completionRate = ratio(data.searches.completed, data.searches.started);
  const noResultRate = ratio(data.searches.withoutResults, Math.max(1, data.searches.completed));
  const affiliateCtrProxy = ratio(data.affiliateClicks.total, Math.max(1, data.selectedDestinations.total));
  const saveRateProxy = ratio(data.savedTrips.total, Math.max(1, data.searches.completed));
  const mobileLcp = data.performance.mobile.averageLcpMs;
  const desktopLcp = data.performance.desktop.averageLcpMs;

  if (data.searches.started === 0) {
    findings.push({
      problemDetected: "No search-start data is available for the selected source.",
      dataUsed: ["searches.started=0", `source=${data.source}`],
      importance: data.source === "stored" ? "medium" : "low",
      likelyCause: "The selected data source has no tracked search activity or analytics events have not been collected yet.",
      confidenceLevel: "high",
      recommendedAction: "Verify analytics event ingestion before interpreting funnel health.",
      targetMetric: "search_started event volume",
    });
  } else if (completionRate < 0.7) {
    findings.push({
      problemDetected: "Search completion is low compared with search starts.",
      dataUsed: [
        `searches.started=${data.searches.started}`,
        `searches.completed=${data.searches.completed}`,
        `completionRate=${formatPercent(completionRate)}`,
      ],
      importance: completionRate < 0.5 ? "high" : "medium",
      likelyCause: "Users may be abandoning after interacting with the search form, or the form may not make the next step clear enough.",
      confidenceLevel: data.searches.started >= 30 ? "high" : "medium",
      recommendedAction: "Review the homepage search form defaults, validation copy, and submit affordance.",
      targetMetric: "search_completed / search_started",
    });
  }

  if (noResultRate >= 0.15) {
    findings.push({
      problemDetected: "A meaningful share of completed searches returns no results.",
      dataUsed: [
        `searches.completed=${data.searches.completed}`,
        `searches.withoutResults=${data.searches.withoutResults}`,
        `noResultRate=${formatPercent(noResultRate)}`,
      ],
      importance: noResultRate >= 0.25 ? "high" : "medium",
      likelyCause: "Budget, month, destination, or filter constraints may be too strict for the available destination catalog.",
      confidenceLevel: data.searches.completed >= 20 ? "high" : "medium",
      recommendedAction: "Add fallback recommendations and inspect the most common no-result budgets and filters.",
      targetMetric: "zero-result searches",
    });
  }

  if (data.selectedDestinations.total > 0 && affiliateCtrProxy < 0.35) {
    findings.push({
      problemDetected: "Affiliate click intent trails destination selection.",
      dataUsed: [
        `selectedDestinations.total=${data.selectedDestinations.total}`,
        `affiliateClicks.total=${data.affiliateClicks.total}`,
        `affiliateClickProxy=${formatPercent(affiliateCtrProxy)}`,
      ],
      importance: "medium",
      likelyCause: "Users may be interested in destinations but not seeing a sufficiently relevant booking module or offer.",
      confidenceLevel: data.selectedDestinations.total >= 25 ? "medium" : "low",
      recommendedAction: "Compare affiliate modules for the top selected destinations and prioritize clearer flight/hotel calls to action.",
      targetMetric: "affiliate clicks / selected destinations",
    });
  }

  if (saveRateProxy < 0.08 && data.searches.completed >= 20) {
    findings.push({
      problemDetected: "Saved-trip intent is weak after completed searches.",
      dataUsed: [
        `savedTrips.total=${data.savedTrips.total}`,
        `searches.completed=${data.searches.completed}`,
        `saveRateProxy=${formatPercent(saveRateProxy)}`,
      ],
      importance: "medium",
      likelyCause: "The email handoff may appear too late, ask for commitment too soon, or not explain the value of saving.",
      confidenceLevel: "medium",
      recommendedAction: "Test a more specific save-trip prompt near results and destination cards.",
      targetMetric: "saved trips / completed searches",
    });
  }

  if (data.appErrors.total > 0) {
    findings.push({
      problemDetected: "Application errors were recorded during the analysis window.",
      dataUsed: [
        `appErrors.total=${data.appErrors.total}`,
        ...data.appErrors.top.map((error) => `${error.message}=${error.count}`),
      ],
      importance: data.appErrors.total >= 10 ? "critical" : "high",
      likelyCause: "Server-side persistence, monitoring, or analytics handling may be intermittently failing.",
      confidenceLevel: "high",
      recommendedAction: "Investigate the top logged error messages and verify affected write paths.",
      targetMetric: "server error count",
    });
  }

  if (mobileLcp !== null && mobileLcp >= 3000) {
    findings.push({
      problemDetected: "Mobile page performance is slower than the target range.",
      dataUsed: [
        `mobile.samples=${data.performance.mobile.samples}`,
        `mobile.averageLcpMs=${mobileLcp}`,
        `desktop.averageLcpMs=${desktopLcp ?? "unavailable"}`,
      ],
      importance: mobileLcp >= 4000 ? "high" : "medium",
      likelyCause: "Hero media, third-party scripts, or route payload size may be slowing mobile rendering.",
      confidenceLevel: data.performance.mobile.samples >= 10 ? "medium" : "low",
      recommendedAction: "Audit mobile LCP elements and defer non-critical third-party scripts.",
      targetMetric: "mobile average LCP",
    });
  }

  if (findings.length === 0) {
    findings.push({
      problemDetected: "No material product issue was detected in the selected data.",
      dataUsed: [
        `searches.started=${data.searches.started}`,
        `searches.completed=${data.searches.completed}`,
        `affiliateClicks.total=${data.affiliateClicks.total}`,
        `savedTrips.total=${data.savedTrips.total}`,
      ],
      importance: "low",
      likelyCause: "The available signals are within current review thresholds or the sample is too small.",
      confidenceLevel: data.source === "stored" && data.searches.started < 20 ? "low" : "medium",
      recommendedAction: "Continue collecting data and review again after a larger sample.",
      targetMetric: "overall funnel health",
    });
  }

  return {
    agentId: "product-analyst",
    generatedAt: new Date().toISOString(),
    source: data.source,
    costCents: estimateProductAnalystCostCents(data, findings.length),
    stepCount: 4,
    findings,
    dataSnapshot: data,
  };
}

export function estimateProductAnalystCostCents(data: ProductAnalystData, findingCount = 1) {
  const signalCount =
    data.searches.started +
    data.searches.completed +
    data.affiliateClicks.total +
    data.selectedDestinations.total +
    data.savedTrips.total +
    data.appErrors.total +
    data.performance.mobile.samples +
    data.performance.desktop.samples;

  return Math.max(1, Math.min(25, 2 + Math.ceil(signalCount / 100) + findingCount));
}

function ratio(numerator: number, denominator: number) {
  if (denominator <= 0) {
    return 0;
  }

  return numerator / denominator;
}

function formatPercent(value: number) {
  return `${Math.round(value * 100)}%`;
}
