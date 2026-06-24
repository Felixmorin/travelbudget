import { ArrowRight, BadgeCheck, Hotel, Plane, Shield, Smartphone, Ticket } from "lucide-react";

import { AffiliateModuleView } from "@/components/analytics/affiliate-module-view";
import { TrackedLink } from "@/components/analytics/tracked-link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { buildAffiliateLink } from "@/lib/affiliate/build-affiliate-link";
import { getAffiliatePlaceholder } from "@/lib/affiliate/links";
import type { AffiliateLink } from "@/lib/data/destinations";

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
  const builtLink = buildAffiliateLink({ destination, link: { ...link, href: placeholder.href ?? link.href } });
  const ctaLocation = link.placement ?? "destination_affiliate_card";
  const page = destination?.slug ? `/destinations/${destination.slug}` : "affiliate_card";
  const affiliatePartner = builtLink.partner;
  const analyticsProperties = {
    affiliatePartner,
    affiliateType: link.type,
    ctaLocation,
    destinationName: destination?.name,
    destinationSlug: destination?.slug,
    href: builtLink.href,
    label: placeholder.actionLabel,
    linkType: placeholder.type,
    page,
    source: ctaLocation,
    title: placeholder.title,
  };

  return (
    <Card className="border-slate-200 bg-white shadow-sm">
      <AffiliateModuleView eventProperties={analyticsProperties} />
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
          {builtLink.href ? (
            <Button asChild size="sm" variant="outline" className="rounded-full">
              <TrackedLink
                href={builtLink.href}
                eventName="affiliate_link_clicked"
                eventProperties={analyticsProperties}
                rel={builtLink.rel}
                target={builtLink.target}
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
