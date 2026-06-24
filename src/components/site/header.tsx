"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, PlaneTakeoff } from "lucide-react";

import { useTranslation } from "@/components/i18n/language-provider";
import { LanguageSwitcher } from "@/components/i18n/language-switcher";
import { TrackedLink } from "@/components/analytics/tracked-link";
import { Button } from "@/components/ui/button";

const navItems = [
  { labelKey: "planTrip", href: "/", activePaths: ["/"] },
  { labelKey: "destinations", href: "/destinations", activePaths: ["/destinations"] },
  { labelKey: "tools", href: "/tools", activePaths: ["/tools"] },
  { labelKey: "guides", href: "/guides", activePaths: ["/guides", "/guide"] },
  { labelKey: "about", href: "/about", activePaths: ["/about"] },
] as const;

export function Header() {
  const pathname = usePathname();
  const { t } = useTranslation();

  return (
    <header className="sticky top-0 z-40 border-b border-[#c3c6d7]/40 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 font-semibold text-[#004ac6]">
          <span className="flex size-8 items-center justify-center rounded-xl bg-[#004ac6] text-white shadow-sm">
            <PlaneTakeoff className="size-4" />
          </span>
          <span>TravelBudget.ai</span>
        </Link>
        <nav className="hidden items-center gap-7 text-sm font-medium text-[#434655] md:flex">
          {navItems.map((item) => {
            const isActive = item.activePaths.some((activePath) =>
              activePath === "/" ? pathname === "/" : pathname === activePath || pathname.startsWith(`${activePath}/`)
            );
            const label = t.nav[item.labelKey];

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
                className={`transition hover:text-[#004ac6] ${isActive ? "font-semibold text-[#004ac6]" : ""}`}
              >
                {label}
              </TrackedLink>
            ) : (
              <Link
                key={item.labelKey}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={`transition hover:text-[#004ac6] ${isActive ? "font-semibold text-[#004ac6]" : ""}`}
              >
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <TrackedLink
            href="/"
            eventName="cta_clicked"
            eventProperties={{
              page: pathname,
              label: t.nav.signIn,
              href: "/",
              ctaLocation: "site_header",
            }}
            className="hidden text-sm font-medium text-[#434655] hover:text-[#004ac6] sm:block"
          >
            {t.nav.signIn}
          </TrackedLink>
          <Button asChild className="h-9 rounded-full bg-[#004ac6] px-4 text-white hover:bg-blue-700">
            <TrackedLink
              href="/"
              eventName="cta_clicked"
              eventProperties={{
                page: pathname,
                label: t.nav.signUp,
                href: "/",
                ctaLocation: "site_header",
              }}
            >
              {t.nav.signUp}
            </TrackedLink>
          </Button>
          <Button variant="ghost" size="icon" aria-label={t.nav.openNavigation} className="rounded-full md:hidden">
            <Menu className="size-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
