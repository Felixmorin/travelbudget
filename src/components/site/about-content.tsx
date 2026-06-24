"use client";

import Image from "next/image";
import Link from "next/link";
import { BarChart3, Compass, ShieldCheck } from "lucide-react";

import { useTranslation } from "@/components/i18n/language-provider";
import { Button } from "@/components/ui/button";

const principles = [
  {
    titleKey: "budgetTitle",
    descriptionKey: "budgetCopy",
    icon: BarChart3,
  },
  {
    titleKey: "discoveryTitle",
    descriptionKey: "discoveryCopy",
    icon: Compass,
  },
  {
    titleKey: "assumptionsTitle",
    descriptionKey: "assumptionsCopy",
    icon: ShieldCheck,
  },
] as const;

export function AboutContent() {
  const { t } = useTranslation();

  return (
    <main className="bg-white">
      <section className="relative isolate overflow-hidden bg-slate-950 text-white">
        <Image
          src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1800&q=85"
          alt="Open road through a mountain landscape"
          fill
          priority
          className="-z-10 object-cover opacity-55"
        />
        <div className="absolute inset-0 -z-10 bg-slate-950/45" />
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-teal-200">{t.about.heroEyebrow}</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-6xl">{t.about.heroTitle}</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-100">{t.about.heroCopy}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild className="rounded-full bg-white px-5 text-slate-950 hover:bg-slate-100">
                <Link href="/">{t.about.planTrip}</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="rounded-full border-white/70 bg-transparent px-5 text-white hover:bg-white/10 hover:text-white"
              >
                <Link href="/tools">{t.about.exploreTools}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-16 sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">{t.about.principlesEyebrow}</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">{t.about.principlesTitle}</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {principles.map((principle) => {
              const Icon = principle.icon;

              return (
                <article key={principle.titleKey} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                    <Icon className="size-5" />
                  </div>
                  <h3 className="mt-4 text-base font-semibold text-slate-950">{t.about[principle.titleKey]}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-500">{t.about[principle.descriptionKey]}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8">
          <div className="relative min-h-[420px] overflow-hidden rounded-lg">
            <Image
              src="https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1400&q=85"
              alt="Traveler reviewing a map from a car"
              fill
              className="object-cover"
            />
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">{t.about.approachEyebrow}</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">{t.about.approachTitle}</h2>
            <p className="mt-4 text-base leading-7 text-slate-500">{t.about.approachCopyOne}</p>
            <p className="mt-4 text-base leading-7 text-slate-500">{t.about.approachCopyTwo}</p>
          </div>
        </div>
      </section>
    </main>
  );
}
