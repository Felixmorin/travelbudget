"use client";

import { BadgeCheck, Globe2, ShieldCheck, TrendingUp } from "lucide-react";

import { useTranslation } from "@/components/i18n/language-provider";

const items = [
  { labelKey: "transparent", icon: BadgeCheck },
  { labelKey: "ranking", icon: TrendingUp },
  { labelKey: "data", icon: Globe2 },
  { labelKey: "pressure", icon: ShieldCheck },
] as const;

export function TrustSection() {
  const { t } = useTranslation();

  return (
    <section className="border-y border-slate-200 bg-slate-50">
      <div className="mx-auto grid max-w-7xl gap-4 px-4 py-10 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.labelKey} className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-full bg-white text-[#0B1D34] shadow-sm">
                <Icon className="size-5" />
              </span>
              <span className="text-sm font-semibold text-slate-800">{t.trust[item.labelKey]}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
