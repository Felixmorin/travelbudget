import { describe, expect, it } from "vitest";

import { analyzeProductData } from "@/lib/agents/product-analyst/analyze";
import { productAnalystDemoData } from "@/lib/agents/product-analyst/demo-data";

describe("Product Analyst analysis", () => {
  it("returns structured findings from demo data", () => {
    const report = analyzeProductData(productAnalystDemoData);

    expect(report.agentId).toBe("product-analyst");
    expect(report.findings.length).toBeGreaterThan(0);
    expect(report.findings[0]).toEqual(
      expect.objectContaining({
        problemDetected: expect.any(String),
        dataUsed: expect.any(Array),
        importance: expect.any(String),
        likelyCause: expect.any(String),
        confidenceLevel: expect.any(String),
        recommendedAction: expect.any(String),
        targetMetric: expect.any(String),
      })
    );
  });

  it("flags zero-result searches when the rate is high", () => {
    const report = analyzeProductData({
      ...productAnalystDemoData,
      searches: {
        started: 20,
        completed: 20,
        withoutResults: 8,
      },
      appErrors: {
        total: 0,
        top: [],
      },
      performance: {
        mobile: {
          samples: 0,
          averageLcpMs: null,
          averageInpMs: null,
        },
        desktop: {
          samples: 0,
          averageLcpMs: null,
          averageInpMs: null,
        },
      },
    });

    expect(report.findings.some((finding) => finding.targetMetric === "zero-result searches")).toBe(true);
  });
});
