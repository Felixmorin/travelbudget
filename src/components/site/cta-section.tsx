import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-6 rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 p-8 text-white shadow-2xl shadow-blue-950/20 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Ready to plan your next trip?</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/80">
              Compare destinations, understand the real cost, and choose the trip that fits your budget.
            </p>
          </div>
          <Button asChild className="h-11 rounded-full bg-white px-5 text-blue-600 hover:bg-white/90">
            <Link href="/">
              Start calculating
              <ArrowRight className="ml-2 size-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
