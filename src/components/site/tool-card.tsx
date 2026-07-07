"use client";

import { ArrowUpRight } from "lucide-react";

import { useTranslation } from "@/components/i18n/language-provider";
import { TrackedLink } from "@/components/analytics/tracked-link";
import { Card, CardContent } from "@/components/ui/card";

type Tool = {
  title: string;
  description: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  status?: "available" | "coming-soon";
};

export function ToolCard({ tool }: { tool: Tool }) {
  const Icon = tool.icon;
  const { t } = useTranslation();
  const isComingSoon = tool.status === "coming-soon";
  const localizedTool = getLocalizedTool(tool.title, t.tools) ?? {
    title: tool.title,
    description: tool.description,
  };

  const card = (
    <Card
      className={
        isComingSoon
          ? "h-full border-slate-200 bg-slate-100 opacity-75"
          : "h-full border-slate-200 bg-white transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-slate-200/80"
      }
    >
      <CardContent className="grid h-full gap-4 pt-6">
        <div className="flex items-start justify-between gap-3">
          <span
            className={
              isComingSoon
                ? "flex size-11 items-center justify-center rounded-xl bg-slate-200 text-slate-500"
                : "flex size-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600"
            }
          >
            <Icon className="size-5" />
          </span>
          {isComingSoon ? (
            <span className="rounded-full bg-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-600">
              Coming soon
            </span>
          ) : (
            <ArrowUpRight className="size-4 text-slate-400" />
          )}
        </div>
        <div>
          <h3 className={isComingSoon ? "font-semibold text-slate-600" : "font-semibold text-slate-950"}>
            {localizedTool.title}
          </h3>
          <p className={isComingSoon ? "mt-2 text-sm leading-6 text-slate-500" : "mt-2 text-sm leading-6 text-slate-500"}>
            {localizedTool.description}
          </p>
        </div>
      </CardContent>
    </Card>
  );

  if (isComingSoon) {
    return <div aria-disabled="true">{card}</div>;
  }

  return (
    <TrackedLink
      href={tool.href}
      eventName="cta_clicked"
      eventProperties={{
        page: "/tools",
        label: localizedTool.title,
        href: tool.href,
        ctaLocation: "tool_card",
      }}
    >
      {card}
    </TrackedLink>
  );
}

function getLocalizedTool(title: string, tools: ReturnType<typeof useTranslation>["t"]["tools"]) {
  const keyByTitle = {
    "Budget Calculator": ["budgetCalculatorTitle", "budgetCalculatorDescription"],
    "Itinerary Builder": ["itineraryBuilderTitle", "itineraryBuilderDescription"],
    "Destination Comparator": ["destinationComparatorTitle", "destinationComparatorDescription"],
    "Price Calendar": ["priceCalendarTitle", "priceCalendarDescription"],
    "eSIM Finder": ["esimFinderTitle", "esimFinderDescription"],
    "Packing List": ["packingListTitle", "packingListDescription"],
    "Flight Watch": ["flightWatchTitle", "flightWatchDescription"],
    "Style Matcher": ["styleMatcherTitle", "styleMatcherDescription"],
  } as const;
  const keys = keyByTitle[title as keyof typeof keyByTitle];

  if (!keys) {
    return null;
  }

  return {
    title: tools[keys[0]],
    description: tools[keys[1]],
  };
}
