"use client";

import { AlertTriangle, History, Play, ShieldCheck } from "lucide-react";
import { useState, type FormEvent } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { ProductAnalystHistoryItem } from "@/lib/agents/product-analyst/runner";
import type { ProductAnalystReport, ProductAnalystSource } from "@/lib/agents/product-analyst/types";

type ProductAnalystApiResponse = {
  ok: boolean;
  error?: string;
  report?: ProductAnalystReport;
  history?: ProductAnalystHistoryItem[];
};

export function ProductAnalystConsole({ initialHistory }: { initialHistory: ProductAnalystHistoryItem[] }) {
  const [adminToken, setAdminToken] = useState("");
  const [source, setSource] = useState<ProductAnalystSource>("demo");
  const [costLimitCents, setCostLimitCents] = useState(100);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [report, setReport] = useState<ProductAnalystReport | null>(null);
  const [history, setHistory] = useState(initialHistory);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const response = await fetch("/api/agents/product-analyst", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        source,
        costLimitCents,
        requestedBy: "manual-admin-console",
      }),
    }).catch(() => null);
    const payload = response ? ((await response.json().catch(() => null)) as ProductAnalystApiResponse | null) : null;

    setIsLoading(false);

    if (!response?.ok || !payload?.ok || !payload.report) {
      setError(payload?.error ?? "Unable to run the analysis.");
      return;
    }

    setReport(payload.report);
    setHistory(payload.history ?? []);
  }

  async function handleLoadHistory() {
    setIsLoading(true);
    setError(null);

    const response = await fetch("/api/agents/product-analyst", {
      headers: {
        Authorization: `Bearer ${adminToken}`,
      },
    }).catch(() => null);
    const payload = response ? ((await response.json().catch(() => null)) as ProductAnalystApiResponse | null) : null;

    setIsLoading(false);

    if (!response?.ok || !payload?.ok) {
      setError(payload?.error ?? "Unable to load history.");
      return;
    }

    setHistory(payload.history ?? []);
  }

  return (
    <div className="grid gap-6">
      <form onSubmit={handleSubmit}>
        <Card className="rounded-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Play className="size-4" />
              Manual analysis
            </CardTitle>
            <CardDescription>Read-only Product Analyst run. Sensitive actions are not available here.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-[1fr_160px_160px_auto] md:items-end">
            <div className="grid gap-2">
              <Label htmlFor="agent-admin-token">Admin token</Label>
              <Input
                id="agent-admin-token"
                type="password"
                value={adminToken}
                onChange={(event) => setAdminToken(event.target.value)}
                placeholder="AI_AGENT_ADMIN_TOKEN"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="agent-source">Source</Label>
              <Select value={source} onValueChange={(value) => setSource(value === "stored" ? "stored" : "demo")}>
                <SelectTrigger id="agent-source">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="demo">Demo</SelectItem>
                  <SelectItem value="stored">Stored</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="cost-limit">Cost limit</Label>
              <Input
                id="cost-limit"
                type="number"
                min={1}
                max={1000}
                value={costLimitCents}
                onChange={(event) => setCostLimitCents(Number(event.target.value))}
              />
            </div>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Running..." : "Run"}
            </Button>
          </CardContent>
        </Card>
      </form>

      <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-950">
        <ShieldCheck className="size-4" />
        Read-only agent: no business data mutation, no publishing, no production automation.
      </div>

      {error ? (
        <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900">
          <AlertTriangle className="size-4" />
          {error}
        </div>
      ) : null}

      {report ? (
        <section className="grid gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline">{report.source}</Badge>
            <Badge variant="secondary">{report.costCents} cents</Badge>
            <Badge variant="secondary">{report.findings.length} findings</Badge>
          </div>
          <div className="grid gap-4">
            {report.findings.map((finding) => (
              <Card key={`${finding.problemDetected}-${finding.targetMetric}`} className="rounded-lg">
                <CardHeader>
                  <CardTitle>{finding.problemDetected}</CardTitle>
                  <CardDescription>
                    {finding.importance} importance · {finding.confidenceLevel} confidence
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-3 text-sm">
                  <p>
                    <span className="font-medium">Likely cause:</span> {finding.likelyCause}
                  </p>
                  <p>
                    <span className="font-medium">Recommended action:</span> {finding.recommendedAction}
                  </p>
                  <p>
                    <span className="font-medium">Target metric:</span> {finding.targetMetric}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {finding.dataUsed.map((item) => (
                      <Badge key={item} variant="outline">
                        {item}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      ) : null}

      <Card className="rounded-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="size-4" />
            Analysis history
          </CardTitle>
          <CardDescription>Recent Product Analyst executions saved in agent history.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3">
          <div>
            <Button type="button" variant="outline" onClick={handleLoadHistory} disabled={isLoading || !adminToken}>
              Load history
            </Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Started</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Findings</TableHead>
                <TableHead>Cost</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {history.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-muted-foreground">
                    No analyses yet.
                  </TableCell>
                </TableRow>
              ) : (
                history.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{formatDate(item.startedAt)}</TableCell>
                    <TableCell>{item.status}</TableCell>
                    <TableCell>{item.source ?? "unknown"}</TableCell>
                    <TableCell>{item.findingCount}</TableCell>
                    <TableCell>{item.costCents} cents</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function formatDate(value: string) {
  if (!value) {
    return "Unknown";
  }

  return new Intl.DateTimeFormat("en-CA", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}
