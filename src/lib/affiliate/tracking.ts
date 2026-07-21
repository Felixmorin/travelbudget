import { insertBackendRecord, isBackendStorageConfigured } from "@/lib/backend/storage";

export type AffiliateClickPayload = {
  destinationSlug?: string;
  affiliateType?: string;
  affiliatePartner?: string;
  affiliateProvider?: string;
  href: string;
  source?: string;
  page?: string;
  referrer?: string;
  userAgent?: string;
};

export type StoredAffiliateClick = AffiliateClickPayload & {
  id: string;
  createdAt: string;
};

export async function saveAffiliateClick(payload: AffiliateClickPayload) {
  const click = {
    ...payload,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };

  if (isBackendStorageConfigured()) {
    await insertBackendRecord("affiliate_clicks", {
      id: click.id,
      destination_slug: click.destinationSlug,
      affiliate_type: click.affiliateType,
      affiliate_partner: click.affiliatePartner,
      affiliate_provider: click.affiliateProvider,
      href: click.href,
      source: click.source,
      page: click.page,
      referrer: click.referrer,
      user_agent: click.userAgent,
      created_at: click.createdAt,
    });
  } else {
    getDevelopmentStore().affiliateClicks.push(click);
  }

  return click;
}

function getDevelopmentStore(): { affiliateClicks: StoredAffiliateClick[] } {
  const globalStore = globalThis as typeof globalThis & {
    __travelBudgetAffiliateClickStore?: { affiliateClicks: StoredAffiliateClick[] };
  };

  globalStore.__travelBudgetAffiliateClickStore ??= { affiliateClicks: [] };

  return globalStore.__travelBudgetAffiliateClickStore;
}
