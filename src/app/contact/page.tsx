import Link from "next/link";
import { Mail, MessageSquare, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { createMetadata } from "@/lib/seo/metadata";

export const metadata = createMetadata({
  title: "Contact",
  description:
    "Contact TravelBudget.ai for price corrections, methodology questions, partnerships, affiliate inquiries, and product feedback.",
  path: "/contact",
});

const contactReasons = [
  "A destination estimate looks too high or too low.",
  "You want to understand a budget assumption before booking.",
  "You have a partnership, affiliate, or media inquiry.",
  "You found a bug in a calculator, guide, or destination page.",
];

export default function ContactPage() {
  return (
    <main className="bg-[#f7f9fb] px-4 py-16 text-[#191c1e] sm:px-6 lg:px-8">
      <section className="mx-auto max-w-4xl">
        <div className="rounded-[28px] border border-[#c3c6d7]/45 bg-white p-8 shadow-sm sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">Contact</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-normal text-slate-950">
            Questions, corrections, and partnership notes
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-[#434655]">
            TravelBudget.ai is built around transparent planning estimates. If a number looks wrong, a source needs
            review, or you want to discuss a commercial partnership, send a concise note with the relevant destination
            or page URL.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-[#c3c6d7]/45 bg-[#f7f9fb] p-6">
              <Mail className="size-8 text-[#004ac6]" />
              <h2 className="mt-4 text-xl font-semibold">Email</h2>
              <p className="mt-2 text-sm leading-6 text-[#434655]">
                For price corrections, methodology questions, partnerships, and affiliate inquiries.
              </p>
              <Button asChild className="mt-5 rounded-full bg-[#004ac6] px-5 text-white hover:bg-blue-700">
                <a href="mailto:contact@travelbudget.ai">contact@travelbudget.ai</a>
              </Button>
            </div>

            <div className="rounded-2xl border border-[#c3c6d7]/45 bg-[#f7f9fb] p-6">
              <ShieldCheck className="size-8 text-[#004ac6]" />
              <h2 className="mt-4 text-xl font-semibold">What to include</h2>
              <p className="mt-2 text-sm leading-6 text-[#434655]">
                Include the destination, trip length, departure city, travel style, and live price you are comparing
                against when reporting an estimate issue.
              </p>
            </div>
          </div>

          <div className="mt-8 rounded-2xl border border-blue-100 bg-blue-50/70 p-6">
            <div className="flex gap-3">
              <MessageSquare className="mt-1 size-6 shrink-0 text-[#004ac6]" />
              <div>
                <h2 className="text-lg font-semibold text-slate-950">Common reasons to contact us</h2>
                <ul className="mt-4 grid gap-3 text-sm leading-6 text-[#434655] sm:grid-cols-2">
                  {contactReasons.map((reason) => (
                    <li key={reason} className="flex gap-2">
                      <span className="text-[#004ac6]">-</span>
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild variant="outline" className="rounded-full border-[#737686] bg-white px-5 text-[#004ac6]">
              <Link href="/methodology">Read methodology</Link>
            </Button>
            <Button asChild variant="outline" className="rounded-full border-[#737686] bg-white px-5 text-[#004ac6]">
              <Link href="/affiliate-disclosure">Affiliate disclosure</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
