import Image from "next/image";
import Link from "next/link";
import {
  BadgeCheck,
  Globe2,
  Heart,
  Lightbulb,
  PlaneTakeoff,
  ShieldCheck,
  Target,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { createMetadata } from "@/lib/seo/metadata";

export const metadata = createMetadata({
  title: "About Us",
  description:
    "Learn about TravelBudget.ai — the AI-powered travel financial planner built to help every type of traveler make their money go further.",
  path: "/about",
});

const values = [
  {
    title: "Transparency first",
    description:
      "Every estimate comes with a breakdown. No hidden fees, no vague ranges — just honest numbers you can plan around.",
    icon: BadgeCheck,
    bg: "bg-[#dbe1ff]",
    color: "text-[#004ac6]",
  },
  {
    title: "Budget for everyone",
    description:
      "Whether you're backpacking on $40 a day or splurging on luxury suites, our tools adapt to your financial reality.",
    icon: Heart,
    bg: "bg-[#d9fbf4]",
    color: "text-[#006b5f]",
  },
  {
    title: "AI with a purpose",
    description:
      "We use AI not for hype, but to surface patterns in destination costs, seasonal pricing, and personalized recommendations.",
    icon: Lightbulb,
    bg: "bg-[#ffdbca]",
    color: "text-[#8e3c00]",
  },
  {
    title: "No booking pressure",
    description:
      "We help you plan. When you're ready to book, you decide how and where. Zero dark patterns, zero pushy upsells.",
    icon: ShieldCheck,
    bg: "bg-blue-50",
    color: "text-[#2563eb]",
  },
];

const stats = [
  { value: "180+", label: "Destinations covered" },
  { value: "$0", label: "Always free to start" },
  { value: "3 sec", label: "Budget estimate time" },
  { value: "100%", label: "No booking pressure" },
];

const team = [
  {
    name: "Felix Morin",
    role: "Founder & CEO",
    bio: "Serial traveler and software builder. Built TravelBudget.ai after one too many trips derailed by bad cost estimates.",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=85",
    alt: "Felix Morin, Founder",
  },
  {
    name: "Aisha Nkrumah",
    role: "Head of Data",
    bio: "Former fintech analyst obsessed with making travel cost data as reliable as a bank statement.",
    image:
      "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=400&q=85",
    alt: "Aisha Nkrumah, Head of Data",
  },
  {
    name: "Diego Vargas",
    role: "Lead Engineer",
    bio: "Nomad developer who has worked from 40 countries. Codes the platform between flights and coworking spaces.",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=85",
    alt: "Diego Vargas, Lead Engineer",
  },
];

const milestones = [
  {
    year: "2024",
    title: "Idea born in a Barcelona hostel",
    description:
      "After overspending on a two-week Europe trip, the idea for a budget-first discovery tool took shape on a napkin.",
  },
  {
    year: "2025 Q1",
    title: "First version launched",
    description:
      "We shipped a working MVP with 40 destinations and a simple budget calculator. Real travelers gave us early feedback.",
  },
  {
    year: "2025 Q3",
    title: "AI recommendations added",
    description:
      "Destination ranking powered by AI, factoring in departure city, trip length, travel style, and real-time pricing patterns.",
  },
  {
    year: "2026",
    title: "Expanding globally",
    description:
      "180+ destinations, multi-currency support, and a full suite of travel planning tools now live for free.",
  },
];

export default function AboutPage() {
  return (
    <main className="bg-[#f7f9fb] text-[#191c1e]">
      {/* Hero */}
      <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,#dbe1ff_0%,#f7f9fb_55%)] px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-14 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/70 px-4 py-2 text-sm font-semibold text-[#004ac6] shadow-sm backdrop-blur">
                <PlaneTakeoff className="size-4" />
                Our story
              </p>
              <h1 className="text-4xl font-semibold leading-tight text-slate-950 sm:text-5xl lg:text-6xl">
                We believe every trip starts with a budget, not a dream
              </h1>
              <p className="mt-6 text-lg leading-8 text-[#434655]">
                TravelBudget.ai was built by travelers who were tired of landing in a new city with an empty wallet. We
                created the tool we always wished existed — one that puts real costs front and center before you ever
                book a flight.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <Button asChild className="h-12 rounded-full bg-[#004ac6] px-8 text-white hover:bg-blue-700">
                  <Link href="/">Start Planning</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="h-12 rounded-full border-[#004ac6] px-8 text-[#004ac6]"
                >
                  <Link href="/tools">Explore Tools</Link>
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1488085061387-422e29b40080?auto=format&fit=crop&w=1200&q=85"
                  alt="Travelers planning a trip with a map"
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
              <div className="mx-auto -mt-8 max-w-xs rounded-2xl border border-white/70 bg-white/90 p-5 shadow-xl backdrop-blur md:absolute md:-bottom-6 md:-right-6 md:mt-0">
                <div className="flex items-center gap-3">
                  <span className="flex size-10 items-center justify-center rounded-full bg-[#dbe1ff] text-[#004ac6]">
                    <Globe2 className="size-5" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-slate-950">180+ destinations</p>
                    <p className="text-xs text-[#434655]">Real cost data, no guesswork</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-4xl font-bold text-[#004ac6]">{stat.value}</p>
              <p className="mt-2 text-sm font-semibold text-[#434655]">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Mission */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid gap-14 lg:grid-cols-2 lg:items-center">
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-xl">
            <Image
              src="https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&w=1200&q=85"
              alt="Couple planning their travel budget on a laptop"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-[#004ac6]">Our mission</p>
            <h2 className="mt-3 text-3xl font-semibold text-slate-950 sm:text-4xl">
              Make financial clarity the first step of every journey
            </h2>
            <p className="mt-5 leading-8 text-[#434655]">
              Most travel platforms show you beautiful photos and hide the costs until checkout. We do the opposite.
              TravelBudget.ai leads with transparent, realistic cost breakdowns — flights, hotels, food, local
              transport, activities — so you can choose destinations that genuinely fit your budget.
            </p>
            <p className="mt-4 leading-8 text-[#434655]">
              Our AI doesn't just rank destinations. It understands your departure city, travel style, trip length,
              and seasonal pricing to give you a personalized picture of what your trip will actually cost.
            </p>
            <div className="mt-8 space-y-4">
              {[
                { icon: Target, text: "Budget-first destination discovery" },
                { icon: TrendingUp, text: "AI-powered cost forecasting" },
                { icon: Zap, text: "Instant estimates in seconds" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3">
                  <span className="flex size-9 items-center justify-center rounded-full bg-[#dbe1ff] text-[#004ac6]">
                    <Icon className="size-4" />
                  </span>
                  <span className="text-sm font-semibold text-slate-800">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-[#f2f4f6] px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-wide text-[#004ac6]">What we stand for</p>
            <h2 className="mt-3 text-3xl font-semibold text-slate-950 sm:text-4xl">Our values</h2>
            <p className="mx-auto mt-4 max-w-xl text-[#434655]">
              These are the principles that guide every product decision we make.
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map(({ title, description, icon: Icon, bg, color }) => (
              <div
                key={title}
                className="rounded-2xl border border-white/70 bg-white/70 p-7 shadow-sm backdrop-blur transition hover:-translate-y-1 hover:shadow-md"
              >
                <span className={`mb-5 flex size-12 items-center justify-center rounded-xl ${bg} ${color}`}>
                  <Icon className="size-5" />
                </span>
                <h3 className="text-lg font-semibold text-slate-950">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-[#434655]">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-[#004ac6]">How we got here</p>
          <h2 className="mt-3 text-3xl font-semibold text-slate-950 sm:text-4xl">Our journey</h2>
        </div>
        <div className="relative mt-14">
          <div className="absolute left-1/2 hidden h-full w-px -translate-x-1/2 bg-[#c3c6d7]/50 lg:block" />
          <div className="space-y-10">
            {milestones.map((milestone, index) => (
              <div
                key={milestone.year}
                className={`relative flex flex-col gap-6 lg:flex-row lg:items-center ${
                  index % 2 === 1 ? "lg:flex-row-reverse" : ""
                }`}
              >
                <div className={`lg:w-1/2 ${index % 2 === 1 ? "lg:pl-14" : "lg:pr-14 lg:text-right"}`}>
                  <span className="inline-block rounded-full bg-[#004ac6] px-3 py-1 text-xs font-bold text-white">
                    {milestone.year}
                  </span>
                  <h3 className="mt-3 text-xl font-semibold text-slate-950">{milestone.title}</h3>
                  <p className="mt-2 leading-7 text-[#434655]">{milestone.description}</p>
                </div>
                <div className="absolute left-1/2 hidden size-4 -translate-x-1/2 rounded-full bg-[#004ac6] ring-4 ring-white lg:block" />
                <div className="lg:w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="bg-slate-950 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center text-white">
            <p className="text-sm font-semibold uppercase tracking-wide text-[#6df5e1]">The people behind it</p>
            <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">Meet the team</h2>
            <p className="mx-auto mt-4 max-w-xl text-slate-400">
              A small team of builders and travelers united by one obsession: making every dollar count on the road.
            </p>
          </div>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {team.map((member) => (
              <div
                key={member.name}
                className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur transition hover:bg-white/10"
              >
                <div className="relative h-64">
                  <Image
                    src={member.image}
                    alt={member.alt}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-white">{member.name}</h3>
                  <p className="mt-1 text-sm font-semibold text-[#6df5e1]">{member.role}</p>
                  <p className="mt-3 text-sm leading-7 text-slate-400">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-14 text-center">
            <p className="text-slate-400">
              We're hiring.{" "}
              <Link href="/" className="font-semibold text-white hover:text-[#6df5e1]">
                See open roles →
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-24 text-center sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <span className="mb-5 inline-flex items-center gap-2 rounded-full bg-[#dbe1ff] px-4 py-2 text-sm font-semibold text-[#004ac6]">
            <Users className="size-4" />
            Join thousands of smart travelers
          </span>
          <h2 className="mt-4 text-4xl font-semibold leading-tight text-slate-950">
            Ready to plan a trip that actually fits your budget?
          </h2>
          <p className="mt-5 text-lg leading-8 text-[#434655]">
            No credit card. No booking pressure. Just clear, honest travel cost estimates.
          </p>
          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild className="h-12 rounded-full bg-[#004ac6] px-8 text-white hover:bg-blue-700">
              <Link href="/">Start for Free</Link>
            </Button>
            <Button asChild variant="outline" className="h-12 rounded-full border-[#004ac6] px-8 text-[#004ac6]">
              <Link href="/guides">Read our Guides</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
