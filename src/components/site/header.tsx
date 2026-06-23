import Link from "next/link";
import { PlaneTakeoff } from "lucide-react";

import { Button } from "@/components/ui/button";

const navItems = [
  { label: "Destinations", href: "/results" },
  { label: "Tools", href: "/tools" },
  { label: "Guides", href: "/destinations/portugal" },
  { label: "About", href: "/" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 font-semibold text-slate-950">
          <span className="flex size-8 items-center justify-center rounded-lg bg-blue-600 text-white shadow-sm">
            <PlaneTakeoff className="size-4" />
          </span>
          <span>TravelBudget.ai</span>
        </Link>
        <nav className="hidden items-center gap-7 text-sm font-medium text-slate-600 md:flex">
          {navItems.map((item) => (
            <Link key={item.label} href={item.href} className="transition hover:text-blue-600">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/" className="hidden text-sm font-medium text-slate-600 hover:text-blue-600 sm:block">
            Sign in
          </Link>
          <Button asChild className="h-9 rounded-full bg-blue-600 px-4 text-white hover:bg-blue-700">
            <Link href="/">Sign up</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
