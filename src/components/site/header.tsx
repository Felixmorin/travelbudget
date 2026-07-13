"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState } from "react";

import { useTranslation } from "@/components/i18n/language-provider";
import { LanguageSwitcher } from "@/components/i18n/language-switcher";
import { TrackedLink } from "@/components/analytics/tracked-link";
import { Button } from "@/components/ui/button";

const navItems = [
  { labelKey: "planTrip", href: "/", activePaths: ["/"] },
  { labelKey: "destinations", href: "/destinations", activePaths: ["/destinations"] },
  { labelKey: "tools", href: "/tools", activePaths: ["/tools"] },
  { labelKey: "travelExtras", href: "/travel-extras", activePaths: ["/travel-extras"] },
  { labelKey: "guides", href: "/guides", activePaths: ["/guides", "/guide"] },
  { labelKey: "about", href: "/about", activePaths: ["/about"] },
] as const;

export function Header() {
  const pathname = usePathname();
  const { t } = useTranslation();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-[#c3c6d7]/40 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
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
                className={`transition hover:text-[#14B8A6] ${isActive ? "font-semibold text-[#0B1D34]" : ""}`}
              >
                {label}
              </TrackedLink>
            ) : (
              <Link
                key={item.labelKey}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={`transition hover:text-[#14B8A6] ${isActive ? "font-semibold text-[#0B1D34]" : ""}`}
              >
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <Button asChild className="h-9 rounded-full bg-[#0B1D34] px-4 text-white hover:bg-[#14B8A6]">
            <TrackedLink
              href="/travel-budget-calculator"
              eventName="cta_clicked"
              eventProperties={{
                page: pathname,
                label: t.nav.calculateBudget,
                href: "/travel-budget-calculator",
                ctaLocation: "site_header",
              }}
            >
              {t.nav.calculateBudget}
            </TrackedLink>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label={isMobileNavOpen ? t.nav.closeNavigation : t.nav.openNavigation}
            aria-expanded={isMobileNavOpen}
            aria-controls="mobile-navigation"
            className="rounded-full md:hidden"
            onClick={() => setIsMobileNavOpen((open) => !open)}
          >
            {isMobileNavOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>
      </div>
      <div
        id="mobile-navigation"
        className={`border-t border-[#c3c6d7]/40 bg-white px-4 py-4 shadow-lg md:hidden ${
          isMobileNavOpen ? "block" : "hidden"
        }`}
      >
        <nav className="mx-auto grid max-w-7xl gap-1 text-sm font-semibold text-[#434655]">
          {navItems.map((item) => {
            const isActive = item.activePaths.some((activePath) =>
              activePath === "/" ? pathname === "/" : pathname === activePath || pathname.startsWith(`${activePath}/`)
            );
            const label = t.nav[item.labelKey];
            const className = `rounded-lg px-3 py-3 transition hover:bg-[#f2f4f6] hover:text-[#14B8A6] ${
              isActive ? "bg-[#14B8A6]/10 text-[#0B1D34]" : ""
            }`;

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
                {label}
              </TrackedLink>
            ) : (
              <Link
                key={item.labelKey}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={className}
                onClick={() => setIsMobileNavOpen(false)}
              >
                {label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
