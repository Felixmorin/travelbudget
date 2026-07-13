"use client";

import { AlertTriangle, Ban, CheckCircle2, Clock3, Cpu, DollarSign, KeyRound, ListChecks, RefreshCw } from "lucide-react";
import type React from "react";
import { useState, type FormEvent } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { MissionControlSnapshot } from "@/lib/agents/mission-control/types";

type MissionControlApiResponse = {
  ok: boolean;
  error?: string;
  snapshot?: MissionControlSnapshot;
};

export function MissionControlConsole() {
  const [adminToken, setAdminToken] = useState("");
  const [snapshot, setSnapshot] = useState<MissionControlSnapshot | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function loadSnapshot(event?: FormEvent<HTMLFormElement>) {
    event?.preventDefault();
    setIsLoading(true);
    setError(null);

    const response = await fetch("/api/agents/mission-control", {
      headers: {
        Authorization: `Bearer ${adminToken}`,
      },
    }).catch(() => null);
    const payload = response ? ((await response.json().catch(() => null)) as MissionControlApiResponse | null) : null;

    setIsLoading(false);

    if (!response?.ok || !payload?.ok || !payload.snapshot) {
      setError(payload?.error ?? "Unable to load Mission Control.");
      return;
    }

    setSnapshot(payload.snapshot);
  }

  async function stopAgents() {
    setIsLoading(true);
    setError(null);

    const response = await fetch("/api/agents/mission-control", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        action: "stop",
        requestedBy: "mission-control",
        reason: "Manual global stop from Mission Control.",
      }),
    }).catch(() => null);
    const payload = response ? ((await response.json().catch(() => null)) as MissionControlApiResponse | null) : null;

    setIsLoading(false);

    if (!response?.ok || !payload?.ok || !payload.snapshot) {
      setError(payload?.error ?? "Unable to stop agents.");
      return;
    }

    setSnapshot(payload.snapshot);
  }

  return (
    <div className="grid gap-5">
      <form onSubmit={loadSnapshot}>
        <Card className="rounded-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <KeyRound className="size-4" />
              Access
            </CardTitle>
            <CardDescription>Mission Control requires the agent admin token before showing agent state.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
            <div className="grid gap-2">
              <Label htmlFor="mission-control-token">Admin token</Label>
              <Input
                id="mission-control-token"
                type="password"
                value={adminToken}
                onChange={(event) => setAdminToken(event.target.value)}
                placeholder="AI_AGENT_ADMIN_TOKEN"
                required
              />
            </div>
            <Button type="submit" disabled={isLoading}>
              <RefreshCw className="size-4" />
              {isLoading ? "Loading..." : "Load"}
            </Button>
          </CardContent>
        </Card>
      </form>

      {error ? (
        <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900">
          <AlertTriangle className="size-4" />
          {error}
        </div>
      ) : null}

      {snapshot ? (
        <>
          <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <MetricCard
              icon={<Cpu className="size-4" />}
              label="Runtime"
              value={snapshot.runtime.stopped ? "Stopped" : snapshot.runtime.envEnabled ? "Enabled" : "Disabled"}
              detail={snapshot.runtime.stopReason ?? "Global agent switch"}
            />
            <MetricCard
              icon={<Clock3 className="size-4" />}
              label="Pending missions"
              value={String(snapshot.missions.pending.length)}
              detail={`${snapshot.pendingApprovals.length} approvals pending`}
            />
            <MetricCard
              icon={<CheckCircle2 className="size-4" />}
              label="Completed"
              value={String(snapshot.missions.completed.length)}
              detail={`${snapshot.missions.failed.length} failed or cancelled`}
            />
            <MetricCard
              icon={<DollarSign className="size-4" />}
              label="Model cost"
              value={`${snapshot.modelCosts.dailyCents}c today`}
              detail={`${snapshot.modelCosts.monthlyCents}c this month`}
            />
          </section>

          <Card className="rounded-lg border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-950">
                <Ban className="size-4" />
                Global stop
              </CardTitle>
              <CardDescription className="text-red-800">
                Stops new agent missions by writing an agent runtime control record.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button type="button" variant="destructive" onClick={stopAgents} disabled={isLoading || snapshot.runtime.stopped}>
                Stop agents
              </Button>
            </CardContent>
          </Card>

          <section className="grid gap-5 xl:grid-cols-[1fr_1fr]">
            <Panel title="Agent State" description="Known agents and runtime state">
              <div className="grid gap-2">
                {snapshot.agents.map((agent) => (
                  <Row key={agent.id} title={agent.name} meta={agent.id}>
                    <Badge variant={agent.status === "stopped" ? "destructive" : "secondary"}>{agent.status}</Badge>
                    <Badge variant="outline">{agent.permissionCount} permissions</Badge>
                  </Row>
                ))}
              </div>
            </Panel>

            <Panel title="Approvals" description="Pending approvals required before action">
              <div className="grid gap-2">
                {snapshot.pendingApprovals.length === 0 ? <EmptyText>No pending approvals.</EmptyText> : null}
                {snapshot.pendingApprovals.map((approval) => (
                  <Row key={approval.id} title={approval.actionType} meta={approval.reason ?? approval.id}>
                    <Badge variant="outline">{formatDate(approval.createdAt)}</Badge>
                  </Row>
                ))}
              </div>
            </Panel>
          </section>

          <MissionGroup title="Pending Missions" missions={snapshot.missions.pending} />
          <MissionGroup title="Active Missions" missions={snapshot.missions.active} />
          <MissionGroup title="Completed Missions" missions={snapshot.missions.completed} />
          <MissionGroup title="Failed Missions" missions={snapshot.missions.failed} />

          <section className="grid gap-5 xl:grid-cols-[1fr_1fr]">
            <Panel title="Product Analyst Recommendations" description="Latest structured findings from Product Analyst">
              <div className="grid gap-2">
                {snapshot.productAnalystRecommendations.length === 0 ? <EmptyText>No recommendations yet.</EmptyText> : null}
                {snapshot.productAnalystRecommendations.map((finding) => (
                  <Row key={`${finding.executionId}-${finding.targetMetric}`} title={finding.problemDetected} meta={finding.recommendedAction}>
                    <Badge variant="secondary">{finding.importance}</Badge>
                    <Badge variant="outline">{finding.targetMetric}</Badge>
                  </Row>
                ))}
              </div>
            </Panel>

            <Panel title="Captain Missions" description="Missions created by Captain and awaiting approval">
              <div className="grid gap-2">
                {snapshot.captainMissions.length === 0 ? <EmptyText>No Captain-created missions.</EmptyText> : null}
                {snapshot.captainMissions.map((mission) => (
                  <Row key={mission.id} title={mission.objective} meta={mission.sourceProblem ?? mission.id}>
                    <Badge variant="secondary">{mission.agentId}</Badge>
                    <Badge variant="outline">{mission.status}</Badge>
                  </Row>
                ))}
              </div>
            </Panel>
          </section>

          <Panel title="Tool Calls" description="Recent agent tool-call history">
            <div className="grid gap-2">
              {snapshot.toolCalls.length === 0 ? <EmptyText>No tool calls yet.</EmptyText> : null}
              {snapshot.toolCalls.map((toolCall) => (
                <Row key={toolCall.id} title={toolCall.toolName} meta={toolCall.permission}>
                  <Badge variant="secondary">{toolCall.status}</Badge>
                  <Badge variant="outline">{toolCall.estimatedCostCents}c</Badge>
                </Row>
              ))}
            </div>
          </Panel>
        </>
      ) : null}
    </div>
  );
}

function MetricCard({ icon, label, value, detail }: { icon: React.ReactNode; label: string; value: string; detail: string }) {
  return (
    <Card className="rounded-lg">
      <CardContent className="grid gap-2 pt-4">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          {icon}
          {label}
        </div>
        <div className="text-2xl font-semibold text-slate-950">{value}</div>
        <div className="text-sm text-slate-600">{detail}</div>
      </CardContent>
    </Card>
  );
}

function Panel({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <Card className="rounded-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ListChecks className="size-4" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

function MissionGroup({ title, missions }: { title: string; missions: MissionControlSnapshot["missions"]["pending"] }) {
  return (
    <Panel title={title} description={`${missions.length} mission(s)`}>
      <div className="grid gap-2 md:grid-cols-2">
        {missions.length === 0 ? <EmptyText>No missions.</EmptyText> : null}
        {missions.map((mission) => (
          <Row key={mission.id} title={mission.objective} meta={mission.targetMetric ?? mission.id}>
            <Badge variant="secondary">{mission.agentId}</Badge>
            <Badge variant="outline">{mission.status}</Badge>
          </Row>
        ))}
      </div>
    </Panel>
  );
}

function Row({ title, meta, children }: { title: string; meta: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-2 rounded-lg border border-slate-200 bg-white p-3 sm:grid-cols-[1fr_auto] sm:items-start">
      <div className="min-w-0">
        <div className="break-words text-sm font-medium text-slate-950">{title}</div>
        <div className="mt-1 break-words text-xs text-slate-500">{meta}</div>
      </div>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function EmptyText({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-slate-500">{children}</p>;
}

function formatDate(value: string) {
  return value ? new Intl.DateTimeFormat("en-CA", { dateStyle: "medium" }).format(new Date(value)) : "Unknown";
}
