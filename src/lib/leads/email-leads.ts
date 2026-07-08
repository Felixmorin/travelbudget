import { insertBackendRecord, isBackendStorageConfigured } from "@/lib/backend/storage";

export type EmailLeadPayload = {
  email: string;
  label?: string;
  page?: string;
  source?: string;
  ctaLocation?: string;
  budget?: number;
  currency?: string;
  referrer?: string;
  userAgent?: string;
};

export type StoredEmailLead = EmailLeadPayload & {
  id: string;
  createdAt: string;
};

export async function saveEmailLead(payload: EmailLeadPayload) {
  const lead = {
    ...payload,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };

  if (isBackendStorageConfigured()) {
    await insertBackendRecord("email_leads", {
      id: lead.id,
      email: lead.email,
      label: lead.label,
      page: lead.page,
      source: lead.source,
      cta_location: lead.ctaLocation,
      budget: lead.budget,
      currency: lead.currency,
      referrer: lead.referrer,
      user_agent: lead.userAgent,
      created_at: lead.createdAt,
    });
  } else {
    getDevelopmentStore().emailLeads.push(lead);
  }

  return lead;
}

export function listStoredEmailLeads() {
  return [...getDevelopmentStore().emailLeads];
}

export function clearStoredEmailLeads() {
  getDevelopmentStore().emailLeads.length = 0;
}

function getDevelopmentStore(): { emailLeads: StoredEmailLead[] } {
  const globalStore = globalThis as typeof globalThis & {
    __travelBudgetEmailLeadStore?: { emailLeads: StoredEmailLead[] };
  };

  globalStore.__travelBudgetEmailLeadStore ??= { emailLeads: [] };

  return globalStore.__travelBudgetEmailLeadStore;
}
