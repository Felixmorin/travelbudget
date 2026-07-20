"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  Calculator,
  Compass,
  Info,
  Luggage,
  MapPinned,
  Menu,
  PlaneTakeoff,
  WalletCards,
  X,
  type LucideIcon,
} from "lucide-react";
import { useState } from "react";

import { useTranslation } from "@/components/i18n/language-provider";
import { LanguageSwitcher } from "@/components/i18n/language-switcher";
import { TrackedLink } from "@/components/analytics/tracked-link";
import { Button } from "@/components/ui/button";
import { InstagramIcon } from "@/components/site/instagram-icon";
import { siteConfig } from "@/lib/seo/metadata";

const navItems: {
  labelKey: keyof ReturnType<typeof useTranslation>["t"]["nav"];
  href: string;
  activePaths: string[];
  icon: LucideIcon;
  description: string;
}[] = [
  { labelKey: "planTrip", href: "/", activePaths: ["/"], icon: Compass, description: "Start with your budget and compare trip ideas." },
  { labelKey: "destinationsByBudget", href: "/destinations-by-budget", activePaths: ["/destinations-by-budget"], icon: WalletCards, description: "Find affordable destinations by budget, origin, duration, and style." },
  { labelKey: "destinations", href: "/destinations", activePaths: ["/destinations"], icon: MapPinned, description: "Browse destination costs and travel styles." },
  { labelKey: "tools", href: "/tools", activePaths: ["/tools"], icon: Calculator, description: "Use calculators and planning helpers." },
  { labelKey: "travelExtras", href: "/travel-extras", activePaths: ["/travel-extras"], icon: Luggage, description: "Plan buffers, eSIMs, insurance, and add-ons." },
  { labelKey: "guides", href: "/guides", activePaths: ["/guides", "/guide"], icon: BookOpen, description: "Read budget guides and trip planning notes." },
  { labelKey: "about", href: "/about", activePaths: ["/about"], icon: Info, description: "See how GoByBudget estimates trip costs." },
] as const;

export function Header() {
  const pathname = usePathname();
  const { t } = useTranslation();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          aria-label="Go to GoByBudget homepage"
          className="flex shrink-0 items-center"
        >
          <Image
            src="/brand/gobybudget-logo-horizontal.png"
            alt="GoByBudget.com"
            width={187}
            height={48}
            priority
            className="hidden h-10 w-auto object-contain sm:block lg:h-11"
          />
          <Image
            src="/brand/gobybudget-mark-gb.png"
            alt="GoByBudget.com"
            width={38}
            height={38}
            priority
            className="h-9 w-9 rounded-xl object-contain sm:hidden"
          />
        </Link>
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <Button
            variant="ghost"
            size="icon"
            aria-label={isMobileNavOpen ? t.nav.closeNavigation : t.nav.openNavigation}
            aria-expanded={isMobileNavOpen}
            aria-controls="site-navigation-menu"
            className="h-10 w-10 rounded-full border border-slate-200 bg-white shadow-sm transition hover:bg-slate-50"
            onClick={() => setIsMobileNavOpen((open) => !open)}
          >
            {isMobileNavOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>
      </div>
      <div
        id="site-navigation-menu"
        className={`absolute left-4 right-4 top-full max-h-[calc(100vh-6rem)] overflow-y-auto rounded-[1.5rem] border border-slate-200 bg-white p-3 shadow-[0_28px_90px_-35px_rgba(15,23,42,0.55)] sm:left-auto sm:right-6 sm:w-[440px] lg:right-8 ${
          isMobileNavOpen ? "block" : "hidden"
        }`}
      >
        <nav className="grid gap-2 text-sm font-semibold text-[#434655]">
          <div className="mb-1 flex items-center justify-between rounded-2xl bg-[#f7f9fb] px-4 py-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Menu</p>
              <p className="mt-1 text-base font-bold text-slate-950">GoByBudget</p>
            </div>
            <PlaneTakeoff className="size-5 text-orange-500" />
          </div>
          {navItems.map((item) => {
            const isActive = item.activePaths.some((activePath) =>
              activePath === "/" ? pathname === "/" : pathname === activePath || pathname.startsWith(`${activePath}/`)
            );
            const label = t.nav[item.labelKey];
            const Icon = item.icon;
            const className = `group flex items-start gap-3 rounded-2xl border px-4 py-3 transition hover:border-[#14B8A6]/35 hover:bg-[#14B8A6]/5 ${
              isActive ? "border-[#14B8A6]/40 bg-[#14B8A6]/10 text-[#0B1D34]" : "border-transparent text-[#434655]"
            }`;
            const content = (
              <>
                <span className={`mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl ${isActive ? "bg-white text-[#0B1D34]" : "bg-[#f2f4f6] text-slate-500 group-hover:text-[#0B1D34]"}`}>
                  <Icon className="size-4" />
                </span>
                <span className="min-w-0">
                  <span className="block font-bold text-slate-950">{label}</span>
                  <span className="mt-0.5 block text-xs font-medium leading-5 text-slate-500">{item.description}</span>
                </span>
              </>
            );

            return item.labelKey === "guides" ? (
              <TrackedLink
                key={item.labelKey}
                href={item.href}
                eventName="guide_clicked"
                eventProperties={{
                  page: pathname,
                  guideTitle: label,
                  href: item.href,
                }}
                aria-current={isActive ? "page" : undefined}
                className={className}
                onClick={() => setIsMobileNavOpen(false)}
              >
                {content}
              </TrackedLink>
            ) : (
              <Link
                key={item.labelKey}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={className}
                onClick={() => setIsMobileNavOpen(false)}
              >
                {content}
              </Link>
            );
          })}
          <TrackedLink
            href="/travel-budget-calculator"
            eventName="cta_clicked"
            eventProperties={{
              page: pathname,
              label: t.nav.calculateBudget,
              href: "/travel-budget-calculator",
              ctaLocation: "site_header_menu",
            }}
            className="mt-2 flex items-center justify-between rounded-2xl bg-[#0B1D34] px-4 py-4 font-bold text-white shadow-lg shadow-slate-950/15 transition hover:bg-[#14B8A6]"
            onClick={() => setIsMobileNavOpen(false)}
          >
            <span>{t.nav.calculateBudget}</span>
            <Calculator className="size-4" />
          </TrackedLink>
          <a
            href={siteConfig.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-bold text-slate-500 transition hover:bg-[#f2f4f6] hover:text-[#14B8A6]"
            onClick={() => setIsMobileNavOpen(false)}
          >
            <InstagramIcon className="size-4" aria-hidden="true" />
            <span>Instagram</span>
          </a>
        </nav>
      </div>
    </header>
  );
}
