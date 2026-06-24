import { ArrowRight, BadgeCheck, Hotel, Plane, Shield, Smartphone, Ticket } from "lucide-react";

import { TrackedLink } from "@/components/analytics/tracked-link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getAffiliatePlaceholder } from "@/lib/affiliate/links";
import { AffiliateLink } from "@/lib/data/destinations";

const icons = {
  Flights: Plane,
  Hotels: Hotel,
  eSIM: Smartphone,
  Activities: Ticket,
  Insurance: Shield,
};

export function AffiliateCard({
  link,
  destination,
}: {
  link: AffiliateLink;
  destination?: {
    name: string;
    slug: string;
  };
}) {
  const Icon = icons[link.type] ?? BadgeCheck;
  const placeholder = getAffiliatePlaceholder(link);

  return (
    <Card className="border-slate-200 bg-white shadow-sm">
      <CardContent className="grid gap-4 pt-5">
        <div className="flex items-start gap-3">
          <span className="flex size-10 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
            <Icon className="size-5" />
          </span>
          <div>
            <p className="text-sm font-semibold text-slate-950">{placeholder.title}</p>
            <p className="mt-1 text-sm leading-5 text-slate-500">{placeholder.description}</p>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-slate-500">{placeholder.priceHint}</span>
          {placeholder.href ? (
            <Button asChild size="sm" variant="outline" className="rounded-full">
              <TrackedLink
                href={placeholder.href}
                eventName="affiliate_link_clicked"
                eventProperties={{
                  affiliatePartner: placeholder.title,
                  destinationName: destination?.name,
                  destinationSlug: destination?.slug,
                  linkType: placeholder.type,
                  title: placeholder.title,
                  href: placeholder.href,
                }}
              >
                {placeholder.actionLabel}
                <ArrowRight className="ml-1 size-3" />
              </TrackedLink>
            </Button>
          ) : (
            <Button size="sm" variant="outline" className="rounded-full" disabled>
              {placeholder.actionLabel}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
