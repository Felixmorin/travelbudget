import type { Metadata } from "next";

import { SeoAgentDashboard } from "@/components/admin/seo-agent-dashboard";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "SEO Agent | GoByBudget Admin",
  robots: {
    index: false,
    follow: false,
  },
};

export default function SeoAgentAdminPage() {
  return <SeoAgentDashboard />;
}
