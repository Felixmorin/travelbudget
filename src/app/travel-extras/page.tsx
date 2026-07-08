import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  CreditCard,
  Info,
  PlaneTakeoff,
  ShieldCheck,
  Smartphone,
  Ticket,
  Wifi,
  XCircle,
  type LucideIcon,
} from "lucide-react";

import { TravelExtrasTabs } from "@/components/site/travel-extras-tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { createMetadata } from "@/lib/seo/metadata";
import { cn } from "@/lib/utils";

export const metadata = createMetadata({
  title: "Compare Travel Extras | BudgetTrip",
  description:
    "Compare eSIMs, travel insurance, airport transfers, activity passes, travel cards, VPNs, and other travel extras before your trip.",
  path: "/travel-extras",
});

type Priority = "High" | "Medium" | "Optional";

type RecommendedExtra = {
  name: string;
  description: string;
  estimatedCost: string;
  priority: Priority;
  worthIt: string;
  icon: LucideIcon;
};

const recommendedExtras: RecommendedExtra[] = [
  {
    name: "eSIM",
    description: "Avoid roaming fees and stay connected abroad.",
    estimatedCost: "$18-$35",
    priority: "High",
    worthIt: "9/10",
    icon: Smartphone,
  },
  {
    name: "Travel insurance",
    description: "Protect against medical emergencies, cancellation, and lost bags.",
    estimatedCost: "$45-$90",
    priority: "High",
    worthIt: "10/10",
    icon: ShieldCheck,
  },
  {
    name: "Airport transfer",
    description: "Compare public transit, shuttle, rideshare, and private transfer options.",
    estimatedCost: "$5-$45",
    priority: "Medium",
    worthIt: "7/10",
    icon: PlaneTakeoff,
  },
  {
    name: "Activity pass",
    description: "Save on museums, attractions, tours, and city passes.",
    estimatedCost: "$35-$80",
    priority: "Medium",
    worthIt: "7/10",
    icon: Ticket,
  },
  {
    name: "Travel card",
    description: "Reduce foreign transaction fees and improve exchange rates.",
    estimatedCost: "$0-$120/year",
    priority: "High",
    worthIt: "8/10",
    icon: CreditCard,
  },
  {
    name: "VPN",
    description: "Protect your connection on public Wi-Fi while traveling.",
    estimatedCost: "$3-$12",
    priority: "Optional",
    worthIt: "5/10",
    icon: Wifi,
  },
];

const comparisonRows = [
  {
    extra: "eSIM",
    bestFor: "International trips",
    estimatedCost: "$18-$35",
    worthItWhen: "You want data without roaming fees",
    skipItIf: "Your phone plan already includes free roaming",
    priority: "High",
  },
  {
    extra: "Travel insurance",
    bestFor: "Medical and trip protection",
    estimatedCost: "$45-$90",
    worthItWhen: "You travel internationally or book non-refundable plans",
    skipItIf: "You already have strong coverage",
    priority: "High",
  },
  {
    extra: "Airport transfer",
    bestFor: "Late arrivals or unfamiliar cities",
    estimatedCost: "$5-$45",
    worthItWhen: "You land late or carry luggage",
    skipItIf: "Public transit is easy and cheap",
    priority: "Medium",
  },
  {
    extra: "Activity pass",
    bestFor: "Sightseeing-heavy trips",
    estimatedCost: "$35-$80",
    worthItWhen: "You plan multiple paid attractions",
    skipItIf: "You prefer free activities",
    priority: "Medium",
  },
  {
    extra: "VPN",
    bestFor: "Public Wi-Fi and remote work",
    estimatedCost: "$3-$12",
    worthItWhen: "You use hotel, airport, or cafe Wi-Fi",
    skipItIf: "You only use mobile data",
    priority: "Optional",
  },
  {
    extra: "Lounge access",
    bestFor: "Long layovers",
    estimatedCost: "$35-$75",
    worthItWhen: "You have a long airport wait",
    skipItIf: "Your layover is short",
    priority: "Optional",
  },
  {
    extra: "Checked baggage",
    bestFor: "Longer trips or gear-heavy travel",
    estimatedCost: "$40-$100",
    worthItWhen: "You need extra clothing or equipment",
    skipItIf: "You can pack carry-on only",
    priority: "Medium",
  },
  {
    extra: "Travel card",
    bestFor: "Avoiding FX fees",
    estimatedCost: "$0-$120/year",
    worthItWhen: "You spend often in foreign currencies",
    skipItIf: "Your current card already has no FX fees",
    priority: "High",
  },
] satisfies Array<{
  extra: string;
  bestFor: string;
  estimatedCost: string;
  worthItWhen: string;
  skipItIf: string;
  priority: Priority;
}>;

const worthItItems = [
  "eSIM for most international trips",
  "Travel insurance for medical coverage",
  "No foreign transaction fee card",
  "Airport transfer for late arrivals",
];

const skippableItems = [
  "Lounge access for short layovers",
  "Premium seat selection on short flights",
  "Checked bag for short city trips",
  "Unlimited data if you only use maps and messages",
];

const budgetImpactRows = [
  ["eSIM", "$25"],
  ["Travel insurance", "$75"],
  ["Airport transfer", "$30"],
  ["Activity pass", "$55"],
] as const;

export default function TravelExtrasPage() {
  return (
    <main className="bg-[#f7f9fb] text-[#191c1e]">
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_360px] lg:items-end">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">Travel add-ons</p>
            <h1 className="mt-2 text-4xl font-bold leading-tight tracking-normal text-[#191c1e] sm:text-5xl">
              Compare Travel Extras
            </h1>
            <p className="mt-4 text-lg leading-8 text-[#434655]">
              See which add-ons are worth paying for and how much they add to your real trip budget.
            </p>
            <Button className="mt-8 h-12 rounded-full bg-gradient-to-br from-[#2563eb] to-[#7c3aed] px-6 text-base font-bold text-white hover:opacity-90">
              Compare extras for my trip
              <ArrowRight className="size-4" />
            </Button>
          </div>

          <Card className="border-[#c3c6d7]/35 bg-white/80 shadow-[0_18px_45px_-28px_rgba(15,23,42,0.45)] backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg text-slate-950">
                <PlaneTakeoff className="size-5 text-[#004ac6]" />
                Trip summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid gap-3 text-sm">
                <SummaryRow label="From" value="Montreal" />
                <SummaryRow label="Destination" value="Portugal" />
                <SummaryRow label="Duration" value="10 days" />
                <SummaryRow label="Budget" value="$2,500 CAD" />
                <SummaryRow label="Style" value="Comfort" />
              </dl>
            </CardContent>
          </Card>
        </div>

        <section className="mt-14" aria-labelledby="recommended-extras-title">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">Recommended extras</p>
          <h2 id="recommended-extras-title" className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
            Recommended for this trip
          </h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {recommendedExtras.map((extra) => (
              <RecommendedExtraCard key={extra.name} extra={extra} />
            ))}
          </div>
        </section>

        <section className="mt-16" aria-labelledby="comparison-title">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">Side by side</p>
          <h2 id="comparison-title" className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
            Compare extras
          </h2>
          <Card className="mt-6 border-slate-200 bg-white shadow-sm">
            <CardContent className="pt-5">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Extra</TableHead>
                    <TableHead>Best for</TableHead>
                    <TableHead>Estimated cost</TableHead>
                    <TableHead>Worth it when</TableHead>
                    <TableHead>Skip it if</TableHead>
                    <TableHead>Priority</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {comparisonRows.map((row) => (
                    <TableRow key={row.extra}>
                      <TableCell className="font-semibold text-slate-950">{row.extra}</TableCell>
                      <TableCell className="min-w-44 text-slate-600">{row.bestFor}</TableCell>
                      <TableCell className="font-semibold text-[#004ac6]">{row.estimatedCost}</TableCell>
                      <TableCell className="min-w-56 text-slate-600">{row.worthItWhen}</TableCell>
                      <TableCell className="min-w-56 text-slate-600">{row.skipItIf}</TableCell>
                      <TableCell>
                        <PriorityBadge priority={row.priority} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </section>

        <section className="mt-16 grid gap-4 md:grid-cols-2" aria-label="Worth it or skip it">
          <ChecklistCard
            title="Usually worth it"
            items={worthItItems}
            icon={CheckCircle2}
            className="border-emerald-200 bg-emerald-50/60"
            iconClassName="text-emerald-700"
          />
          <ChecklistCard
            title="Usually skippable"
            items={skippableItems}
            icon={XCircle}
            className="border-slate-200 bg-white"
            iconClassName="text-slate-500"
          />
        </section>

        <section className="mt-16" aria-labelledby="budget-impact-title">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">Budget impact</p>
          <h2 id="budget-impact-title" className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
            Real budget impact
          </h2>
          <Card className="mt-6 border-slate-200 bg-white shadow-lg shadow-slate-200/60">
            <CardContent className="grid gap-8 pt-6 lg:grid-cols-[1fr_1.1fr] lg:items-center">
              <div className="grid gap-5">
                <Metric label="Base trip budget" value="$2,500 CAD" />
                <Metric label="Recommended extras" value="$185 CAD" className="text-[#004ac6]" />
                <div className="border-t border-slate-200 pt-5">
                  <Metric label="Estimated total" value="$2,685 CAD" className="text-3xl text-slate-950 sm:text-4xl" />
                </div>
              </div>
              <div className="grid gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                {budgetImpactRows.map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between gap-4 rounded-xl bg-white px-4 py-3 text-sm">
                    <span className="font-medium text-slate-700">{label}</span>
                    <span className="font-semibold text-slate-950">{value}</span>
                  </div>
                ))}
                <Button className="mt-2 h-12 rounded-xl bg-[#004ac6] font-bold text-white hover:bg-blue-700">
                  Send me this complete trip budget
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        <TravelExtrasTabs />

        <div className="mt-16 flex gap-3 rounded-2xl border border-[#c3c6d7]/35 bg-white p-5 text-sm leading-6 text-[#434655] shadow-sm">
          <Info className="mt-0.5 size-5 shrink-0 text-[#004ac6]" />
          <p>
            <span className="font-semibold text-[#191c1e]">Trust note:</span> Estimates are based on common travel
            add-ons and may vary by destination, season, trip length, and traveler needs.
          </p>
        </div>
      </section>
    </main>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <dt className="text-[#434655]">{label}</dt>
      <dd className="font-semibold text-[#191c1e]">{value}</dd>
    </div>
  );
}

function RecommendedExtraCard({ extra }: { extra: RecommendedExtra }) {
  const Icon = extra.icon;

  return (
    <Card className="h-full border-slate-200 bg-white shadow-sm transition hover:shadow-lg hover:shadow-slate-200/70">
      <CardContent className="flex h-full flex-col pt-5">
        <div className="flex items-start justify-between gap-4">
          <span className="flex size-11 items-center justify-center rounded-xl bg-blue-50 text-[#004ac6]">
            <Icon className="size-5" />
          </span>
          <PriorityBadge priority={extra.priority} />
        </div>
        <h3 className="mt-5 text-xl font-semibold text-slate-950">{extra.name}</h3>
        <p className="mt-2 flex-1 text-sm leading-6 text-slate-600">{extra.description}</p>
        <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-slate-200 pt-4 text-sm">
          <div>
            <dt className="font-semibold text-slate-500">Estimated cost</dt>
            <dd className="mt-1 font-semibold text-[#004ac6]">{extra.estimatedCost}</dd>
          </div>
          <div className="text-right">
            <dt className="font-semibold text-slate-500">Worth it</dt>
            <dd className="mt-1 font-semibold text-slate-950">{extra.worthIt}</dd>
          </div>
        </dl>
        <Button type="button" variant="outline" className="mt-5 h-10 w-full rounded-xl border-[#c3c6d7] bg-white">
          Compare options
        </Button>
      </CardContent>
    </Card>
  );
}

function PriorityBadge({ priority }: { priority: Priority }) {
  return (
    <Badge
      className={cn(
        "rounded-full px-3 py-1 text-xs font-bold",
        priority === "High" ? "bg-[#004ac6] text-white" : "",
        priority === "Medium" ? "bg-teal-100 text-teal-800" : "",
        priority === "Optional" ? "bg-slate-100 text-slate-600" : "",
      )}
    >
      {priority}
    </Badge>
  );
}

function ChecklistCard({
  className,
  icon: Icon,
  iconClassName,
  items,
  title,
}: {
  className?: string;
  icon: LucideIcon;
  iconClassName?: string;
  items: string[];
  title: string;
}) {
  return (
    <Card className={cn("border-slate-200 shadow-sm", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl text-slate-950">
          <Icon className={cn("size-5", iconClassName)} />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="grid gap-3 text-sm leading-6 text-slate-700">
          {items.map((item) => (
            <li key={item} className="flex gap-2">
              <BadgeCheck className="mt-1 size-4 shrink-0 text-[#004ac6]" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

function Metric({ className, label, value }: { className?: string; label: string; value: string }) {
  return (
    <div>
      <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className={cn("mt-1 text-2xl font-semibold text-slate-950", className)}>{value}</p>
    </div>
  );
}
