"use client";

import {
  ArrowRight,
  Bed,
  CheckCircle2,
  CircleX,
  Database,
  Plane,
  RefreshCcw,
  ShieldCheck,
  Sparkles,
  Train,
  Utensils,
  WalletCards,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { useTranslation } from "@/components/i18n/language-provider";

const reviewedDate = "July 7, 2026";

const copy = {
  en: {
    eyebrow: "AI-powered trip intelligence",
    title: "The most realistic way to plan and compare travel budgets.",
    intro:
      "GoByBudget.com helps you decide where you can travel based on real-world trip costs, not just a cheap flight. Compare destinations with estimates for flights, stays, meals, local transport, activities, seasonality, and a practical safety buffer.",
    primaryCta: "Start planning",
    secondaryCta: "Our methodology",
    liveLabel: "Planning example",
    liveMetric: "Paris estimate: $182/day",
    missionTitle: "Why we built GoByBudget.com",
    missionOne:
      "Planning a trip often starts with an attractive fare, then gets complicated once lodging, meals, transfers, activities, taxes, and peak-season demand enter the picture.",
    missionTwo:
      "We built GoByBudget.com to make the full trip easier to compare before booking. The goal is not fake precision; it is a clear planning range that helps you choose a destination with fewer budget surprises.",
    usefulTitle: "What makes our estimates useful",
    transparencyTitle: "Total transparency",
    transparencyCopy: "How we define our commitment to realistic travel budget planning.",
    doTitle: "What we do",
    dontTitle: "What we do not do",
    trustLabel: "Trust report",
    trustDate: `Planning assumptions last reviewed: ${reviewedDate}`,
    trustTitle: "Our approach to data is structured, transparent, and easy to audit.",
    trustMetric: "Core trip costs",
    trustMetricCopy: "Flights, stays, meals, transport, activities, extras, and buffer.",
    disclaimer:
      "Estimates are planning ranges, not guaranteed live prices. Always confirm fares, lodging rules, cancellation policies, exchange rates, visas, and insurance requirements before booking.",
    seoTitle: "How to use a travel budget planner for your next trip",
    seoOne:
      "Effective budget travel planning starts with a realistic view of your total trip cost. Whether you are comparing a city break, a long-haul vacation, or a flexible month-by-month plan, the right estimate should include both fixed costs and daily spending.",
    seoSubtitle: "Compare destinations by budget efficiently",
    seoTwo:
      "GoByBudget.com is designed to help you compare destinations by budget before you commit to flights or hotels. Instead of opening dozens of tabs, you can start with your budget, trip length, departure city, and travel style, then narrow the world to destinations that make financial sense.",
    seoFactorsTitle: "Key factors in travel budget planning",
    finalTitle: "Ready to see where your budget can take you?",
    finalCopy:
      "Estimate a realistic trip budget, compare destination options, and review the assumptions before you book.",
    finalPrimary: "Start planning now",
    finalSecondary: "Contact us",
  },
  fr: {
    eyebrow: "Intelligence voyage orientee budget",
    title: "La facon la plus realiste de planifier et comparer des budgets voyage.",
    intro:
      "GoByBudget.com vous aide a choisir ou partir selon le cout complet du voyage, pas seulement le prix d'un vol. Comparez des destinations avec des estimations pour vols, hebergements, repas, transport local, activites, saisonnalite et marge de securite.",
    primaryCta: "Commencer la planification",
    secondaryCta: "Notre methodologie",
    liveLabel: "Exemple de planification",
    liveMetric: "Estimation Paris: 182 $/jour",
    missionTitle: "Pourquoi nous avons cree GoByBudget.com",
    missionOne:
      "La planification commence souvent par un vol interessant, puis devient floue quand on ajoute hebergement, repas, transferts, activites, taxes et demande en haute saison.",
    missionTwo:
      "Nous avons cree GoByBudget.com pour rendre le cout total plus facile a comparer avant de reserver. L'objectif n'est pas une fausse precision, mais une fourchette claire qui aide a choisir avec moins de surprises.",
    usefulTitle: "Ce qui rend nos estimations utiles",
    transparencyTitle: "Transparence totale",
    transparencyCopy: "Notre engagement pour une planification de budget voyage realiste.",
    doTitle: "Ce que nous faisons",
    dontTitle: "Ce que nous ne faisons pas",
    trustLabel: "Rapport de confiance",
    trustDate: "Hypotheses de planification revues le 7 juillet 2026",
    trustTitle: "Notre approche des donnees est structuree, transparente et facile a verifier.",
    trustMetric: "Couts essentiels",
    trustMetricCopy: "Vols, hebergements, repas, transport, activites, extras et marge.",
    disclaimer:
      "Les estimations sont des fourchettes de planification, pas des prix garantis en direct. Verifiez toujours les tarifs, conditions d'hebergement, politiques d'annulation, taux de change, visas et assurances avant de reserver.",
    seoTitle: "Comment utiliser un planificateur de budget voyage",
    seoOne:
      "Une bonne planification commence par une vision realiste du cout total. Que vous compariez une escapade urbaine, un long voyage ou une periode flexible, l'estimation doit inclure les couts fixes et les depenses quotidiennes.",
    seoSubtitle: "Comparer les destinations par budget efficacement",
    seoTwo:
      "GoByBudget.com aide a comparer les destinations selon votre budget avant de vous engager sur les vols ou hotels. Au lieu d'ouvrir des dizaines d'onglets, vous partez de votre budget, duree, ville de depart et style de voyage.",
    seoFactorsTitle: "Facteurs cles du budget voyage",
    finalTitle: "Pret a voir jusqu'ou votre budget peut vous mener?",
    finalCopy:
      "Estimez un budget realiste, comparez vos options et verifiez les hypotheses avant de reserver.",
    finalPrimary: "Planifier maintenant",
    finalSecondary: "Nous contacter",
  },
} as const;

const estimateInputs = [
  {
    icon: Plane,
    enTitle: "Origin-aware flights",
    frTitle: "Vols selon le depart",
    enCopy: "Round-trip planning ranges are shaped by departure city, route assumptions, timing, and season.",
    frCopy: "Les fourchettes aller-retour tiennent compte de la ville de depart, de la route, du moment et de la saison.",
  },
  {
    icon: Bed,
    enTitle: "Stays by travel style",
    frTitle: "Hebergement par style",
    enCopy: "Accommodation assumptions shift between budget, balanced, and comfort travel styles.",
    frCopy: "Les hypotheses d'hebergement changent selon les styles economique, equilibre et confort.",
  },
  {
    icon: Utensils,
    enTitle: "Meals and daily costs",
    frTitle: "Repas et couts quotidiens",
    enCopy: "Daily budgets include practical food, drinks, transit, and small local spending.",
    frCopy: "Les budgets quotidiens incluent repas, boissons, transport et petites depenses locales.",
  },
  {
    icon: Train,
    enTitle: "Local movement",
    frTitle: "Deplacements locaux",
    enCopy: "Airport transfers, public transit, rideshares, ferries, and city movement are part of the estimate.",
    frCopy: "Transferts, transport public, covoiturage, ferries et deplacements urbains font partie de l'estimation.",
  },
] as const;

const doItems = {
  en: [
    "Compare total trip costs, not only flight prices.",
    "Factor in seasonality, trip length, travel style, and departure city.",
    "Show the budget components that shape each estimate.",
    "Use a practical safety buffer for small fees and price movement.",
  ],
  fr: [
    "Comparer le cout total du voyage, pas seulement le prix du vol.",
    "Tenir compte de la saison, de la duree, du style et de la ville de depart.",
    "Montrer les composantes qui influencent chaque estimation.",
    "Ajouter une marge de securite pour frais et variations de prix.",
  ],
} as const;

const dontItems = {
  en: [
    "Guarantee live prices or booking availability.",
    "Hide the assumptions behind a single magic number.",
    "Treat affiliate links as the reason a destination ranks.",
    "Replace final checks on visas, insurance, fares, or lodging rules.",
  ],
  fr: [
    "Garantir les prix en direct ou la disponibilite.",
    "Cacher les hypotheses derriere un chiffre magique.",
    "Classer les destinations selon les commissions d'affiliation.",
    "Remplacer les verifications finales sur visas, assurances, tarifs ou conditions.",
  ],
} as const;

const trustCards = {
  en: [
    ["Structured assumptions", "Every estimate is tied to route, duration, travelers, month, and travel style."],
    ["Transparent methodology", "The methodology page explains what is included, what can change, and where estimates have limits."],
    ["Human review path", "Price issues, corrections, partnerships, and methodology questions can be sent through contact."],
  ],
  fr: [
    ["Hypotheses structurees", "Chaque estimation depend de la route, duree, voyageurs, mois et style de voyage."],
    ["Methodologie transparente", "La page methodologie explique ce qui est inclus, ce qui peut changer et les limites."],
    ["Canal de verification", "Les corrections, partenariats et questions peuvent etre envoyes via la page contact."],
  ],
} as const;

const seoFactors = {
  en: ["Daily cost of living", "Accommodation price volatility", "Hidden fees and tourist taxes", "Currency and seasonality shifts"],
  fr: ["Cout de vie quotidien", "Variation des prix d'hebergement", "Frais caches et taxes touristiques", "Devise et saisonnalite"],
} as const;

export function AboutContent() {
  const { language } = useTranslation();
  const text = copy[language];

  return (
    <main className="bg-[#f7f9fb] text-[#191c1e]">
      <section className="relative mx-auto max-w-7xl overflow-hidden px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="absolute -right-24 top-10 h-80 w-80 rounded-full bg-[#dbe1ff]/70 blur-3xl" />
        <div className="absolute -bottom-16 -left-20 h-72 w-72 rounded-full bg-[#71f8e4]/40 blur-3xl" />
        <div className="relative grid items-center gap-12 lg:grid-cols-2">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-[#6df5e1] px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#006f64]">
              <ShieldCheck className="size-4" />
              {text.eyebrow}
            </div>
            <h1 className="mt-6 max-w-3xl text-4xl font-bold leading-tight tracking-tight text-slate-950 sm:text-6xl">
              {language === "en" ? (
                <>
                  The most realistic way to <span className="text-[#0B1D34]">plan and compare</span> travel budgets.
                </>
              ) : (
                <>
                  La facon la plus realiste de <span className="text-[#0B1D34]">planifier et comparer</span> des budgets
                  voyage.
                </>
              )}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#434655]">{text.intro}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/tools/travel-budget-calculator"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#0B1D34] px-7 font-semibold text-white shadow-lg shadow-[#0B1D34]/15 transition hover:bg-[#0B1D34]"
              >
                {text.primaryCta}
                <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/methodology"
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#e0e3e5] px-7 font-semibold text-[#191c1e] transition hover:bg-[#d8dadc]"
              >
                {text.secondaryCta}
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-white/70 shadow-2xl shadow-slate-950/15 backdrop-blur">
              <div className="relative aspect-[4/3]">
                <Image
                  src="https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=1400&q=85"
                  alt="Traveler overlooking a turquoise coastline while planning a trip"
                  fill
                  preload
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
              <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between gap-4 rounded-2xl border border-white/60 bg-white/75 p-4 shadow-lg backdrop-blur">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-[#0B1D34]">{text.liveLabel}</p>
                  <p className="mt-1 font-semibold text-slate-950">{text.liveMetric}</p>
                </div>
                <RefreshCcw className="size-6 text-[#0B1D34]" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-[#c3c6d7]/35 bg-white py-16 sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight text-slate-950">{text.missionTitle}</h2>
            <p className="mt-5 leading-7 text-[#434655]">{text.missionOne}</p>
            <p className="mt-4 leading-7 text-[#434655]">{text.missionTwo}</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-[#0B1D34]">{text.usefulTitle}</h3>
            <div className="mt-5 grid gap-4">
              {estimateInputs.map((item) => {
                const Icon = item.icon;
                return (
                  <article key={item.enTitle} className="flex gap-4 rounded-xl border border-[#c3c6d7]/55 bg-[#f7f9fb] p-4">
                    <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-[#0B1D34]/10 text-[#0B1D34]">
                      <Icon className="size-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-950">{language === "en" ? item.enTitle : item.frTitle}</h4>
                      <p className="mt-1 text-sm leading-6 text-[#434655]">{language === "en" ? item.enCopy : item.frCopy}</p>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-slate-950">{text.transparencyTitle}</h2>
          <p className="mt-3 text-[#434655]">{text.transparencyCopy}</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <TransparencyCard title={text.doTitle} items={doItems[language]} tone="positive" />
          <TransparencyCard title={text.dontTitle} items={dontItems[language]} tone="muted" />
        </div>
      </section>

      <section className="relative overflow-hidden bg-slate-950 py-16 text-white sm:py-20">
        <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-[#0B1D34]/30 blur-[110px]" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <div className="mb-4 flex flex-wrap items-center gap-3">
                <span className="rounded bg-[#0B1D34] px-3 py-1 text-xs font-bold uppercase tracking-widest">{text.trustLabel}</span>
                <span className="text-sm text-slate-300">{text.trustDate}</span>
              </div>
              <h2 className="max-w-2xl text-3xl font-semibold tracking-tight">{text.trustTitle}</h2>
            </div>
            <div className="rounded-2xl border border-white/15 bg-white/10 p-6 backdrop-blur">
              <p className="text-3xl font-bold text-[#71f8e4]">{text.trustMetric}</p>
              <p className="mt-2 max-w-xs text-sm leading-6 text-slate-300">{text.trustMetricCopy}</p>
            </div>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {trustCards[language].map(([title, body]) => (
              <article key={title} className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <Database className="mb-5 size-7 text-[#b4c5ff]" />
                <h3 className="text-lg font-semibold">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-300">{body}</p>
              </article>
            ))}
          </div>
          <div className="mt-8 rounded-lg border border-red-400/30 bg-red-500/10 p-4 text-sm leading-6 text-slate-200">
            <strong className="text-red-200">Disclaimer:</strong> {text.disclaimer}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <article>
          <h2 className="text-3xl font-semibold tracking-tight text-slate-950">{text.seoTitle}</h2>
          <p className="mt-5 leading-7 text-[#434655]">{text.seoOne}</p>
          <h3 className="mt-8 text-xl font-semibold text-slate-950">{text.seoSubtitle}</h3>
          <p className="mt-4 leading-7 text-[#434655]">{text.seoTwo}</p>
          <div className="my-8 rounded-2xl bg-[#eceef0] p-6">
            <h4 className="text-sm font-bold uppercase tracking-wider text-[#0B1D34]">{text.seoFactorsTitle}</h4>
            <ul className="mt-4 grid gap-3 text-[#434655] sm:grid-cols-2">
              {seoFactors[language].map((factor) => (
                <li key={factor} className="flex gap-2">
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-[#0B1D34]" />
                  <span>{factor}</span>
                </li>
              ))}
            </ul>
          </div>
        </article>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#2563eb] to-[#7c3aed] p-8 text-center text-white sm:p-12 lg:p-16">
          <div className="absolute -left-16 -top-16 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-[#71f8e4]/20 blur-3xl" />
          <div className="relative mx-auto max-w-2xl">
            <Sparkles className="mx-auto mb-5 size-9 text-[#dbe1ff]" />
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">{text.finalTitle}</h2>
            <p className="mt-5 text-lg leading-8 text-white/90">{text.finalCopy}</p>
            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/tools/travel-budget-calculator"
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-white px-8 font-semibold text-[#0B1D34] shadow-xl transition hover:bg-white/90"
              >
                {text.finalPrimary}
              </Link>
              <Link
                href="/contact"
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/40 bg-white/15 px-8 font-semibold text-white backdrop-blur transition hover:bg-white/25"
              >
                {text.finalSecondary}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function TransparencyCard({
  title,
  items,
  tone,
}: {
  title: string;
  items: readonly string[];
  tone: "positive" | "muted";
}) {
  const positive = tone === "positive";
  const Icon = positive ? CheckCircle2 : CircleX;

  return (
    <article
      className={`rounded-3xl border p-7 sm:p-8 ${
        positive ? "border-[#6df5e1] bg-[#6df5e1]/10" : "border-[#c3c6d7] bg-[#e0e3e5]/25"
      }`}
    >
      <h3 className={`flex items-center gap-2 text-xl font-semibold ${positive ? "text-[#006f64]" : "text-[#737686]"}`}>
        <Icon className="size-5" />
        {title}
      </h3>
      <ul className="mt-6 space-y-4">
        {items.map((item) => (
          <li key={item} className="flex gap-3 leading-7 text-[#434655]">
            <WalletCards className={`mt-1 size-5 shrink-0 ${positive ? "text-[#0B1D34]" : "text-[#737686]"}`} />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}
