import { createMetadata } from "@/lib/seo/metadata";

export const metadata = createMetadata({
  title: "Affiliate Disclosure",
  description: "How GoByBudget.com uses affiliate links and booking partner referrals.",
  path: "/affiliate-disclosure",
});

export default function AffiliateDisclosurePage() {
  return (
    <main className="bg-[#f7f9fb] px-4 py-16 text-[#191c1e] sm:px-6 lg:px-8">
      <article className="mx-auto max-w-3xl rounded-lg border border-[#c3c6d7]/45 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wide text-[#0B1D34]">Legal</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-normal text-slate-950">Affiliate Disclosure</h1>
        <p className="mt-3 text-sm text-[#434655]">Last updated: July 6, 2026</p>

        <div className="mt-8 space-y-7 text-base leading-8 text-[#434655]">
          <section>
            <h2 className="text-xl font-semibold text-slate-950">Affiliate links</h2>
            <p className="mt-2">
              GoByBudget.com may earn a commission when you click an affiliate link and book or buy through a partner
              website. This may include links for hotels, flights, activities, eSIMs, insurance, or other travel
              products.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-950">No extra cost</h2>
            <p className="mt-2">
              Affiliate commissions usually do not add an extra charge to you. Prices, discounts, availability, and
              booking rules are controlled by the third party partner.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-950">Editorial approach</h2>
            <p className="mt-2">
              Destination budgets and rankings are based on planning estimates, destination fit, travel style, trip
              length, and departure city. Affiliate availability can influence which booking options are shown, but you
              should compare live providers before purchasing.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-950">Budget independence</h2>
            <p className="mt-2">
              Affiliate commissions do not guarantee placement in a destination budget or change the core methodology
              used to estimate flights, accommodation, food, local transport, activities, and safety buffers.
            </p>
          </section>
        </div>
      </article>
    </main>
  );
}
