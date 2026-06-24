"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Globe2, Menu, PlaneTakeoff } from "lucide-react";

import { Button } from "@/components/ui/button";

const navItems = [
  { label: "Destinations", href: "/results", activePaths: ["/results", "/destinations"] },
  { label: "Tools", href: "/tools", activePaths: ["/tools"] },
  { label: "Guides", href: "/guides", activePaths: ["/guides", "/guide"] },
  { label: "About", href: "/", activePaths: ["/"] },
];

export function Header() {
  const pathname = usePathname();

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

            return (
              <Link
                key={item.label}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={`transition hover:text-[#004ac6] ${
                  isActive ? "font-semibold text-[#004ac6]" : ""
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Change language"
            className="hidden rounded-full text-[#434655] hover:text-[#004ac6] sm:inline-flex"
          >
            <Globe2 className="size-4" />
          </Button>
          <Link href="/" className="hidden text-sm font-medium text-[#434655] hover:text-[#004ac6] sm:block">
            Sign In
          </Link>
          <Button asChild className="h-9 rounded-full bg-[#004ac6] px-4 text-white hover:bg-blue-700">
            <Link href="/">Sign Up</Link>
          </Button>
          <Button variant="ghost" size="icon" aria-label="Open navigation" className="rounded-full md:hidden">
            <Menu className="size-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
