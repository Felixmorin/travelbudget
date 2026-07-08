import { createMetadata } from "@/lib/seo/metadata";

export const metadata = createMetadata({
  title: "Privacy Policy",
  description: "How GoByBudget.com collects, uses, and protects personal information.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <main className="bg-[#f7f9fb] px-4 py-16 text-[#191c1e] sm:px-6 lg:px-8">
      <article className="mx-auto max-w-3xl rounded-lg border border-[#c3c6d7]/45 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wide text-[#0B1D34]">Legal</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-normal text-slate-950">Privacy Policy</h1>
        <p className="mt-3 text-sm text-[#434655]">Last updated: July 6, 2026</p>

        <div className="mt-8 space-y-7 text-base leading-8 text-[#434655]">
          <section>
            <h2 className="text-xl font-semibold text-slate-950">Information we collect</h2>
            <p className="mt-2">
              GoByBudget.com collects the information you enter into planning tools, such as destination, origin city,
              budget, trip length, and page context. We may also collect analytics events such as page views, searches,
              destination clicks, affiliate clicks, and CTA interactions.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-950">How we use information</h2>
            <p className="mt-2">
              We use this information to provide trip budget estimates, measure product usage, improve destination
              recommendations, debug issues, and understand which booking partners are useful to travelers.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-950">Analytics and service providers</h2>
            <p className="mt-2">
              The site can be configured with analytics providers such as Google Analytics, Microsoft Clarity,
              Plausible, or PostHog.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-950">Data sharing</h2>
            <p className="mt-2">
              We do not sell personal information. We may share information with service providers that operate the
              website, analytics, hosting, security, or affiliate tracking systems. Affiliate partners
              may receive click or referral context when you leave GoByBudget.com through a partner link.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-950">Your choices</h2>
            <p className="mt-2">
              You can use browser privacy controls and avoid partner links if you do not want referral context shared
              with booking providers. To request access, correction, or deletion of submitted data, contact us through
              the contact details published on GoByBudget.com.
            </p>
          </section>
        </div>
      </article>
    </main>
  );
}
