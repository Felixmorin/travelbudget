import Link from "next/link";
import { Mail, MessageSquare, ShieldCheck } from "lucide-react";

import { InstagramIcon } from "@/components/site/instagram-icon";
import { Button } from "@/components/ui/button";
import { createMetadata, siteConfig } from "@/lib/seo/metadata";

export const metadata = createMetadata({
  title: "Contact",
  description:
    "Contact GoByBudget.com for price corrections, methodology questions, partnerships, affiliate inquiries, and product feedback.",
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
          <p className="text-sm font-semibold uppercase tracking-wide text-[#0B1D34]">Contact</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-normal text-slate-950">
            Questions, corrections, and partnership notes
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-[#434655]">
            GoByBudget.com is built around transparent planning estimates. If a number looks wrong, a source needs
            review, or you want to discuss a commercial partnership, send a concise note with the relevant destination
            or page URL.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-[#c3c6d7]/45 bg-[#f7f9fb] p-6">
              <Mail className="size-8 text-[#0B1D34]" />
              <h2 className="mt-4 text-xl font-semibold">Email</h2>
              <p className="mt-2 text-sm leading-6 text-[#434655]">
                For price corrections, methodology questions, partnerships, and affiliate inquiries.
              </p>
              <Button asChild className="mt-5 rounded-full bg-[#0B1D34] px-5 text-white hover:bg-[#0B1D34]">
                <a href="mailto:contact@gobybudget.com">contact@gobybudget.com</a>
              </Button>
            </div>

            <div className="rounded-2xl border border-[#c3c6d7]/45 bg-[#f7f9fb] p-6">
              <InstagramIcon className="size-8 text-[#0B1D34]" />
              <h2 className="mt-4 text-xl font-semibold">Instagram</h2>
              <p className="mt-2 text-sm leading-6 text-[#434655]">
                Follow GoByBudget for budget travel ideas, destination notes, and product updates.
              </p>
              <Button asChild variant="outline" className="mt-5 rounded-full border-[#737686] bg-white px-5 text-[#0B1D34]">
                <a href={siteConfig.instagramUrl} target="_blank" rel="noopener noreferrer">
                  @gobybudget
                </a>
              </Button>
            </div>
          </div>

          <div className="mt-8 rounded-2xl border border-[#14B8A6]/20 bg-[#14B8A6]/10 p-6">
            <div className="flex gap-3">
              <ShieldCheck className="mt-1 size-6 shrink-0 text-[#0B1D34]" />
              <div>
                <h2 className="text-lg font-semibold text-slate-950">What to include</h2>
                <p className="mt-2 text-sm leading-6 text-[#434655]">
                  Include the destination, trip length, departure city, travel style, and live price you are comparing
                  against when reporting an estimate issue.
                </p>
                <div className="mt-5 flex items-center gap-3">
                  <MessageSquare className="size-5 shrink-0 text-[#0B1D34]" />
                  <h2 className="text-lg font-semibold text-slate-950">Common reasons to contact us</h2>
                </div>
                <ul className="mt-4 grid gap-3 text-sm leading-6 text-[#434655] sm:grid-cols-2">
                  {contactReasons.map((reason) => (
                    <li key={reason} className="flex gap-2">
                      <span className="text-[#0B1D34]">-</span>
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild variant="outline" className="rounded-full border-[#737686] bg-white px-5 text-[#0B1D34]">
              <Link href="/methodology">Read methodology</Link>
            </Button>
            <Button asChild variant="outline" className="rounded-full border-[#737686] bg-white px-5 text-[#0B1D34]">
              <Link href="/affiliate-disclosure">Affiliate disclosure</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
