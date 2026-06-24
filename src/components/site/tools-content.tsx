"use client";

import { useTranslation } from "@/components/i18n/language-provider";
import { CTASection } from "@/components/site/cta-section";
import { ToolCard } from "@/components/site/tool-card";
import { tools } from "@/lib/data/tools";

export function ToolsContent() {
  const { t } = useTranslation();

  return (
    <>
      <main className="bg-slate-50">
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">{t.tools.pageEyebrow}</p>
            <h1 className="mt-2 text-4xl font-semibold tracking-tight text-slate-950">{t.tools.pageTitle}</h1>
            <p className="mt-4 text-base leading-7 text-slate-500">{t.tools.pageCopy}</p>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {tools.map((tool) => (
              <ToolCard key={tool.title} tool={tool} />
            ))}
          </div>
        </section>
      </main>
      <CTASection />
    </>
  );
}
