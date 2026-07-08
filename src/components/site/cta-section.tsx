"use client";

import { ArrowRight } from "lucide-react";

import { useTranslation } from "@/components/i18n/language-provider";
import { TrackedLink } from "@/components/analytics/tracked-link";
import { Button } from "@/components/ui/button";

export function CTASection() {
  const { t } = useTranslation();

  return (
    <section className="bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-6 rounded-2xl bg-gradient-to-r from-[#0B1D34] to-[#14B8A6] p-8 text-white shadow-2xl shadow-[#0B1D34]/20 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">{t.cta.title}</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/80">
              {t.cta.copy}
            </p>
          </div>
          <Button asChild className="h-11 rounded-full bg-white px-5 text-[#0B1D34] hover:bg-white/90">
            <TrackedLink
              href="/"
              eventName="cta_clicked"
              eventProperties={{
                page: "global",
                label: t.cta.button,
                href: "/",
                ctaLocation: "global_cta",
              }}
            >
              {t.cta.button}
              <ArrowRight className="ml-2 size-4" />
            </TrackedLink>
          </Button>
        </div>
      </div>
    </section>
  );
}
