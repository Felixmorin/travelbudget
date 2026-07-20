"use client";

import {
  AlertTriangle,
  BarChart3,
  FileText,
  KeyRound,
  LineChart,
  Link2,
  Loader2,
  MousePointerClick,
  RefreshCw,
  SearchCheck,
} from "lucide-react";
import { FormEvent, useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { SeoOpportunity } from "@/lib/seo-agent/types";
import { aiWorkers, type AiWorkerId, type AiWorkerRunReport, type AiWorkerTask } from "@/lib/seo-agent/workers";

type SeoAgentResponse =
  | {
      ok: true;
      workerRun: AiWorkerRunReport;
    }
  | {
      ok: false;
      error: string;
    };

const storageKey = "gobybudget-seo-agent-token";

export function SeoAgentDashboard() {
  const [token, setToken] = useState("");
  const [workerRun, setWorkerRun] = useState<AiWorkerRunReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedWorkerId, setSelectedWorkerId] = useState<AiWorkerId | "all">("all");

  const selectedTasks = useMemo(() => {
    const tasks = workerRun?.tasks ?? [];
    return selectedWorkerId === "all" ? tasks : tasks.filter((task) => task.workerId === selectedWorkerId);
  }, [selectedWorkerId, workerRun]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await runAgent();
  }

  async function runAgent() {
    const trimmedToken = token.trim();

    if (!trimmedToken) {
      setError("Entre le token admin avant de lancer l'analyse.");
      return;
    }

    setLoading(true);
    setError(null);
    window.sessionStorage.setItem(storageKey, trimmedToken);

    try {
      const response = await fetch("/api/admin/seo-workers", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${trimmedToken}`,
        },
      });
      const body = (await response.json()) as SeoAgentResponse;

      if (!response.ok || !body.ok) {
        throw new Error(body.ok ? "Unable to run SEO agent." : body.error);
      }

      setWorkerRun(body.workerRun);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to run SEO agent.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="bg-muted/30 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <section className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-md border bg-background px-2.5 py-1 text-xs font-medium text-muted-foreground">
              <BarChart3 className="size-3.5" />
              Admin SEO
            </div>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">SEO agent</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              Rapport prive Search Console + GA4 avec opportunites priorisees pour les pages organiques.
            </p>
          </div>

          <form className="flex w-full flex-col gap-2 sm:max-w-lg sm:flex-row" onSubmit={handleSubmit}>
            <div className="relative flex-1">
              <KeyRound className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                aria-label="Admin token"
                className="h-10 pl-8"
                onChange={(event) => setToken(event.target.value)}
                placeholder="SEO_AGENT_ADMIN_TOKEN"
                type="password"
                value={token}
              />
            </div>
            <Button className="h-10" disabled={loading} type="submit">
              {loading ? <Loader2 className="animate-spin" /> : <RefreshCw />}
              Lancer
            </Button>
          </form>
        </section>

        {error ? (
          <div className="flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            <AlertTriangle className="mt-0.5 size-4 shrink-0" />
            <p>{error}</p>
          </div>
        ) : null}

        <WorkerLivePanel
          loading={loading}
          onSelectWorker={setSelectedWorkerId}
          selectedTasks={selectedTasks}
          selectedWorkerId={selectedWorkerId}
          workerRun={workerRun}
        />

      </div>
    </main>
  );
}

function WorkerLivePanel({
  loading,
  onSelectWorker,
  selectedTasks,
  selectedWorkerId,
  workerRun,
}: {
  loading: boolean;
  onSelectWorker: (workerId: AiWorkerId | "all") => void;
  selectedTasks: AiWorkerTask[];
  selectedWorkerId: AiWorkerId | "all";
  workerRun: AiWorkerRunReport | null;
}) {
  const tasks = workerRun?.tasks ?? [];

  return (
    <section className="grid gap-4 lg:grid-cols-[360px_1fr]">
      <Card>
        <CardHeader>
          <CardTitle>Workers</CardTitle>
          <CardDescription>
            {loading
              ? "Analyse en cours"
              : workerRun
                ? `Dernier run ${workerRun.mode === "scheduled" ? "automatique" : "manuel"} - ${workerRun.summary.tasks} taches`
                : "Prets a analyser ton site"}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <button
            className={`rounded-lg border p-3 text-left transition hover:bg-muted/50 ${
              selectedWorkerId === "all" ? "border-primary bg-primary/5" : ""
            }`}
            onClick={() => onSelectWorker("all")}
            type="button"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <BarChart3 className="size-4 text-primary" />
                <p className="font-medium text-foreground">Tous les workers</p>
              </div>
              <Badge variant="secondary">{tasks.length}</Badge>
            </div>
          </button>

          {aiWorkers.map((worker) => {
            const workerTaskCount = tasks.filter((task) => task.workerId === worker.id).length;

            return (
              <button
                className={`rounded-lg border p-3 text-left transition hover:bg-muted/50 ${
                  selectedWorkerId === worker.id ? "border-primary bg-primary/5" : ""
                }`}
                key={worker.id}
                onClick={() => onSelectWorker(worker.id)}
                type="button"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-2">
                    {getWorkerIcon(worker.id, loading)}
                    <p className="truncate font-medium text-foreground">{worker.name}</p>
                  </div>
                  <WorkerStatusBadge loading={loading} taskCount={workerTaskCount} />
                </div>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{worker.description}</p>
                {loading ? <WorkerActivityBar /> : null}
              </button>
            );
          })}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>File de travail proposee</CardTitle>
          <CardDescription>
            {loading
              ? "Les workers lisent GSC, GA4 et le registre SEO."
              : "Les workers proposent les taches; tu gardes la validation humaine avant modification."}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {loading ? (
            <WorkerLoadingQueue />
          ) : selectedTasks.length ? (
            selectedTasks.slice(0, 10).map((task) => (
              <WorkerTaskCard task={task} key={`${task.workerId}-${task.id}`} />
            ))
          ) : (
            <p className="text-sm text-muted-foreground">
              Lance une analyse pour voir les taches proposees par les workers.
            </p>
          )}
        </CardContent>
      </Card>
    </section>
  );
}

function WorkerStatusBadge({ loading, taskCount }: { loading: boolean; taskCount: number }) {
  if (loading) {
    return (
      <Badge>
        <Loader2 className="animate-spin" />
        Travaille
      </Badge>
    );
  }

  if (taskCount > 0) {
    return <Badge variant="destructive">{taskCount}</Badge>;
  }

  return <Badge variant="secondary">Pret</Badge>;
}

function WorkerActivityBar() {
  return (
    <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
      <div className="h-full w-1/2 animate-pulse rounded-full bg-primary" />
    </div>
  );
}

function WorkerLoadingQueue() {
  return (
    <>
      {["Lecture Search Console", "Lecture GA4", "Priorisation des taches"].map((label) => (
        <div className="rounded-lg border p-3" key={label}>
          <div className="flex items-center gap-2">
            <Loader2 className="size-4 animate-spin text-primary" />
            <p className="font-medium text-foreground">{label}</p>
          </div>
          <div className="mt-3 h-2 w-full animate-pulse rounded-full bg-muted" />
        </div>
      ))}
    </>
  );
}

function WorkerTaskCard({ task }: { task: AiWorkerTask }) {
  return (
    <div className="rounded-lg border p-3">
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <PriorityBadge priority={task.priority} />
        <Badge variant="outline">{getWorkerLabel(task.workerId)}</Badge>
        <Badge variant="secondary">Proposee</Badge>
      </div>
      <p className="font-medium text-foreground">{task.title}</p>
      <p className="mt-1 truncate font-mono text-xs text-muted-foreground">{task.target}</p>
      <p className="mt-2 text-sm leading-6">{task.action}</p>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{task.evidence}</p>
    </div>
  );
}

function PriorityBadge({ priority }: { priority: SeoOpportunity["priority"] }) {
  if (priority === "high") {
    return <Badge variant="destructive">Haute</Badge>;
  }

  if (priority === "medium") {
    return <Badge>Medium</Badge>;
  }

  return <Badge variant="secondary">Basse</Badge>;
}

function getWorkerLabel(workerId: AiWorkerTask["workerId"]) {
  const labels: Record<AiWorkerTask["workerId"], string> = {
    "seo-ga4": "SEO / GA4",
    "internal-linking": "Liens internes",
    "programmatic-seo": "Programmatic SEO",
    conversion: "Conversion",
    "content-refresh": "Content Refresh",
    "serp-intent": "SERP Intent",
  };

  return labels[workerId];
}

function getWorkerIcon(workerId: AiWorkerId, loading: boolean) {
  const className = `size-4 ${loading ? "animate-pulse text-primary" : "text-primary"}`;

  if (workerId === "seo-ga4") {
    return <LineChart className={className} />;
  }

  if (workerId === "internal-linking") {
    return <Link2 className={className} />;
  }

  if (workerId === "programmatic-seo") {
    return <FileText className={className} />;
  }

  if (workerId === "content-refresh") {
    return <RefreshCw className={className} />;
  }

  if (workerId === "serp-intent") {
    return <SearchCheck className={className} />;
  }

  return <MousePointerClick className={className} />;
}
