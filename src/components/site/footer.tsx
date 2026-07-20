"use client";

import Image from "next/image";
import Link from "next/link";

import { useTranslation } from "@/components/i18n/language-provider";
import { InstagramIcon } from "@/components/site/instagram-icon";
import { OPEN_COOKIE_CONSENT_EVENT } from "@/lib/analytics/consent";
import { siteConfig } from "@/lib/seo/metadata";

const footerSections = [
  {
    titleKey: "products",
    links: [
      { labelKey: "planTrip", href: "/" },
      { labelKey: "budgetCalculator", href: "/travel-budget-calculator" },
      { labelKey: "methodology", href: "/methodology" },
    ],
  },
  {
    titleKey: "company",
    links: [
      { labelKey: "aboutUs", href: "/about" },
      { labelKey: "contact", href: "/contact" },
    ],
  },
  {
    titleKey: "legal",
    links: [
      { labelKey: "privacy", href: "/privacy" },
      { labelKey: "terms", href: "/terms" },
      { labelKey: "affiliateDisclosure", href: "/affiliate-disclosure" },
    ],
  },
] as const;

export function Footer() {
  const { t } = useTranslation();

  function openCookiePreferences() {
    window.dispatchEvent(new Event(OPEN_COOKIE_CONSENT_EVENT));
  }

  return (
    <footer className="border-t border-[#c3c6d7]/35 bg-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1.5fr_1fr_1fr_1fr] lg:px-8">
        <div>
          <Link
            href="/"
            aria-label="Go to GoByBudget homepage"
            className="inline-flex items-center"
          >
            <Image
              src="/brand/gobybudget-logo-horizontal.png"
              alt="GoByBudget.com"
              width={187}
              height={48}
              className="h-10 w-auto object-contain"
            />
          </Link>
          <p className="mt-3 max-w-sm text-sm leading-6 text-[#434655]">{t.footer.description}</p>
          <p className="mt-3 max-w-sm text-xs leading-5 text-[#64748b]">
            GoByBudget may earn a commission when you book through partner links, at no additional cost to you.
          </p>
          <a
            href={siteConfig.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#0B1D34] hover:text-[#14B8A6]"
          >
            <InstagramIcon className="size-4" aria-hidden="true" />
            <span>Instagram</span>
          </a>
        </div>
        {footerSections.map((section) => (
          <div key={section.titleKey}>
            <p className="text-sm font-semibold text-[#191c1e]">{t.footer[section.titleKey]}</p>
            <div className="mt-3 grid gap-2 text-sm text-[#434655]">
              {section.links.map((link) => (
                <Link key={link.labelKey} href={link.href} className="hover:text-[#14B8A6]">
                  {t.footer[link.labelKey]}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="mx-auto flex max-w-7xl flex-col gap-3 border-t border-[#c3c6d7]/35 px-4 py-5 text-sm text-[#434655] sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <span>&copy; {t.footer.copyright}</span>
        <button type="button" className="text-left font-medium text-[#0B1D34] hover:text-[#14B8A6]" onClick={openCookiePreferences}>
          Cookie preferences
        </button>
      </div>
    </footer>
  );
}
