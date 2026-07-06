import { Bell, Mail, PlaneTakeoff, Send } from "lucide-react";
import Link from "next/link";

import { EmailCapture } from "@/components/leads/email-capture";
import { createMetadata } from "@/lib/seo/metadata";

export const metadata = createMetadata({
  title: "Travel Deals and Budget Alerts",
  description: "Get destination budget alerts, saved trip estimates, and deal signals from TravelBudget.ai.",
  path: "/deals",
});

export default function DealsPage() {
  return (
    <main className="bg-[#f7f9fb] text-[#191c1e]">
      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-20">
        <div className="flex flex-col justify-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">Deals and alerts</p>
          <h1 className="mt-4 max-w-3xl text-5xl font-semibold tracking-normal text-slate-950">
            Send yourself the budget before prices move.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-[#434655]">
            Save a realistic trip estimate, get route context in your inbox, and ask for budget alerts when a
            destination looks worth watching.
          </p>

          <div className="mt-8 grid gap-3 text-sm font-medium text-slate-700 sm:grid-cols-3">
            <ValuePill icon={Mail} label="Saved budgets" />
            <ValuePill icon={Bell} label="Price alert intent" />
            <ValuePill icon={PlaneTakeoff} label="Partner-ready links" />
          </div>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/destinations"
              className="inline-flex min-h-11 items-center justify-center rounded-lg border border-[#c3c6d7] bg-white px-5 font-semibold text-slate-950 transition hover:border-blue-600"
            >
              Browse destinations
            </Link>
            <Link
              href="/tools/travel-budget-calculator"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 font-semibold text-white transition hover:bg-blue-700"
            >
              Calculate a budget
              <Send className="size-4" />
            </Link>
          </div>
        </div>

        <div className="rounded-lg border border-[#c3c6d7]/45 bg-white p-6 shadow-sm">
          <EmailCapture
            intent="price_alert"
            origin="Montreal"
            budget={2500}
            duration={10}
            source="deals_primary_price_alert"
            variant="inline"
          />
          <div className="mt-6 rounded-lg bg-slate-50 p-5">
            <h2 className="text-lg font-semibold text-slate-950">What subscribers receive</h2>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-[#434655]">
              <li>Saved trip budget context for the destination and origin you were researching.</li>
              <li>Alerts or follow-up emails when a route becomes worth checking with live providers.</li>
              <li>Affiliate booking options for flights, stays, eSIM, activities, and insurance when configured.</li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}

function ValuePill({ icon: Icon, label }: { icon: typeof Mail; label: string }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-lg border border-[#c3c6d7]/45 bg-white px-3 py-2">
      <Icon className="size-4 text-blue-700" />
      {label}
    </div>
  );
}
