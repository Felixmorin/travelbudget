import Link from "next/link";
import { ArrowLeft, CalendarDays, Users, WalletCards } from "lucide-react";

import { AffiliateCard } from "@/components/site/affiliate-card";
import { BudgetBreakdown } from "@/components/site/budget-breakdown";
import { DestinationCard } from "@/components/site/destination-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { destinations, formatMoney } from "@/lib/data/destinations";

export default function ResultsPage() {
  const affiliateLinks = destinations[0].affiliateLinks;

  return (
    <main className="bg-slate-50">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <Button variant="ghost" size="sm" className="mb-6 rounded-full" asChild>
            <Link href="/">
              <ArrowLeft className="mr-2 size-4" />
              Back to calculator
            </Link>
          </Button>
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">Your search</p>
              <h1 className="mt-2 text-4xl font-semibold tracking-tight text-slate-950">
                Best destinations under {formatMoney(2400)}
              </h1>
            </div>
            <Card className="border-slate-200 shadow-sm">
              <CardContent className="grid gap-3 pt-5 sm:grid-cols-3">
                <Summary icon={WalletCards} label="Budget" value="CAD 2,400" />
                <Summary icon={CalendarDays} label="When" value="October, 10 days" />
                <Summary icon={Users} label="Travelers" value="2 balanced" />
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_380px] lg:px-8">
        <div className="grid gap-6">
          {destinations.map((destination) => (
            <div key={destination.slug} className="grid gap-4 lg:grid-cols-[0.85fr_1fr]">
              <DestinationCard destination={destination} ranked />
              <BudgetBreakdown destination={destination} />
            </div>
          ))}
        </div>
        <aside className="grid h-fit gap-4 lg:sticky lg:top-24">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-orange-600">Booking helpers</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-950">Deals to check next</h2>
          </div>
          {affiliateLinks.map((link) => (
            <AffiliateCard key={link.type} link={link} />
          ))}
        </aside>
      </section>
    </main>
  );
}

function Summary({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex size-9 items-center justify-center rounded-full bg-blue-50 text-blue-600">
        <Icon className="size-4" />
      </span>
      <div>
        <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
        <p className="text-sm font-semibold text-slate-950">{value}</p>
      </div>
    </div>
  );
}
