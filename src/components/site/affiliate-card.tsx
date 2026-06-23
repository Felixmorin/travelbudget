import Link from "next/link";
import { ArrowRight, BadgeCheck, Hotel, Plane, Shield, Smartphone, Ticket } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AffiliateLink } from "@/lib/data/destinations";

const icons = {
  Flights: Plane,
  Hotels: Hotel,
  eSIM: Smartphone,
  Activities: Ticket,
  Insurance: Shield,
};

export function AffiliateCard({ link }: { link: AffiliateLink }) {
  const Icon = icons[link.type] ?? BadgeCheck;

  return (
    <Card className="border-slate-200 bg-white shadow-sm">
      <CardContent className="grid gap-4 pt-5">
        <div className="flex items-start gap-3">
          <span className="flex size-10 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
            <Icon className="size-5" />
          </span>
          <div>
            <p className="text-sm font-semibold text-slate-950">{link.title}</p>
            <p className="mt-1 text-sm leading-5 text-slate-500">{link.description}</p>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-blue-600">{link.priceHint}</span>
          <Button asChild size="sm" variant="outline" className="rounded-full">
            <Link href={link.href}>
              Check
              <ArrowRight className="ml-1 size-3" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
