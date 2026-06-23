import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

type Tool = {
  title: string;
  description: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
};

export function ToolCard({ tool }: { tool: Tool }) {
  const Icon = tool.icon;

  return (
    <Link href={tool.href}>
      <Card className="h-full border-slate-200 bg-white transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-slate-200/80">
        <CardContent className="grid h-full gap-4 pt-6">
          <div className="flex items-start justify-between">
            <span className="flex size-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Icon className="size-5" />
            </span>
            <ArrowUpRight className="size-4 text-slate-400" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-950">{tool.title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-500">{tool.description}</p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
