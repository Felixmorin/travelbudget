"use client";

import Link from "next/link";

import { useTranslation } from "@/components/i18n/language-provider";

const footerSections = [
  {
    titleKey: "products",
    links: [
      { labelKey: "planTrip", href: "/" },
      { labelKey: "budgetCalculator", href: "/tools/travel-budget-calculator" },
      { labelKey: "methodology", href: "/methodology" },
      { labelKey: "itineraryBuilder", href: "/tools" },
      { labelKey: "esimFinder", href: "/tools" },
    ],
  },
  {
    titleKey: "company",
    links: [
      { labelKey: "aboutUs", href: "/about" },
      { labelKey: "careers", href: "/about" },
      { labelKey: "contact", href: "/about" },
    ],
  },
  {
    titleKey: "legal",
    links: [
      { labelKey: "privacy", href: "/about" },
      { labelKey: "terms", href: "/about" },
    ],
  },
] as const;

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="border-t border-[#c3c6d7]/35 bg-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1.5fr_1fr_1fr_1fr] lg:px-8">
        <div>
          <Link href="/" className="font-semibold text-blue-600">
            TravelBudget.ai
          </Link>
          <p className="mt-3 max-w-sm text-sm leading-6 text-[#434655]">{t.footer.description}</p>
        </div>
        {footerSections.map((section) => (
          <div key={section.titleKey}>
            <p className="text-sm font-semibold text-[#191c1e]">{t.footer[section.titleKey]}</p>
            <div className="mt-3 grid gap-2 text-sm text-[#434655]">
              {section.links.map((link) => (
                <Link key={link.labelKey} href={link.href} className="hover:text-blue-600">
                  {t.footer[link.labelKey]}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="mx-auto max-w-7xl border-t border-[#c3c6d7]/35 px-4 py-5 text-sm text-[#434655] sm:px-6 lg:px-8">
        &copy; {t.footer.copyright}
      </div>
    </footer>
  );
}
