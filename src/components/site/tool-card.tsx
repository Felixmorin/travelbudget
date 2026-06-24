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
};

export function ToolCard({ tool }: { tool: Tool }) {
  const Icon = tool.icon;
  const { t } = useTranslation();
  const localizedTool = getLocalizedTool(tool.title, t.tools) ?? {
    title: tool.title,
    description: tool.description,
  };

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
      <Card className="h-full border-slate-200 bg-white transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-slate-200/80">
        <CardContent className="grid h-full gap-4 pt-6">
          <div className="flex items-start justify-between">
            <span className="flex size-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Icon className="size-5" />
            </span>
            <ArrowUpRight className="size-4 text-slate-400" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-950">{localizedTool.title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-500">{localizedTool.description}</p>
          </div>
        </CardContent>
      </Card>
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
