import { createMetadata } from "@/lib/seo/metadata";

export const metadata = createMetadata({
  title: "Terms of Service",
  description: "Terms for using TravelBudget.ai trip budget estimates and planning tools.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <main className="bg-[#f7f9fb] px-4 py-16 text-[#191c1e] sm:px-6 lg:px-8">
      <article className="mx-auto max-w-3xl rounded-lg border border-[#c3c6d7]/45 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">Legal</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-normal text-slate-950">Terms of Service</h1>
        <p className="mt-3 text-sm text-[#434655]">Last updated: July 6, 2026</p>

        <div className="mt-8 space-y-7 text-base leading-8 text-[#434655]">
          <section>
            <h2 className="text-xl font-semibold text-slate-950">Use of the service</h2>
            <p className="mt-2">
              TravelBudget.ai provides planning estimates, comparison tools, destination guides, and links to third
              party booking or travel services. You are responsible for verifying live prices, availability, entry
              requirements, safety conditions, insurance coverage, and booking terms before purchasing travel.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-950">No price guarantee</h2>
            <p className="mt-2">
              Budgets, fares, lodging estimates, daily costs, and activity estimates are directional planning numbers in
              CAD. They are not live booking quotes, financial advice, or guarantees that a trip can be purchased at the
              displayed amount.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-950">Third party links</h2>
            <p className="mt-2">
              Some links point to third party websites. Their pricing, availability, policies, privacy practices, and
              customer support are controlled by those third parties, not TravelBudget.ai.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-950">Limitation of liability</h2>
            <p className="mt-2">
              TravelBudget.ai is provided as a planning aid. To the fullest extent permitted by law, we are not liable
              for losses related to booking decisions, travel disruptions, inaccurate third party information, or changes
              in prices, exchange rates, or availability.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-950">Changes</h2>
            <p className="mt-2">
              We may update these terms as the product evolves. Continued use of the site after an update means you
              accept the updated terms.
            </p>
          </section>
        </div>
      </article>
    </main>
  );
}
