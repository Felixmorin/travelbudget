import { redirect } from "next/navigation";

import { saveAffiliateClick } from "@/lib/affiliate/tracking";

type GoRouteProps = {
  params: Promise<{ slug: string[] }>;
};

export async function GET(request: Request, { params }: GoRouteProps) {
  const url = new URL(request.url);
  const href = decodeTargetUrl(url.searchParams.get("url"));
  const { slug } = await params;
  const [destinationSlug, affiliateType] = slug;

  if (!href) {
    redirect("/");
  }

  await saveAffiliateClick({
    destinationSlug,
    affiliateType,
    affiliatePartner: url.searchParams.get("partner") ?? undefined,
    affiliateProvider: url.searchParams.get("provider") ?? undefined,
    href,
    source: url.searchParams.get("source") ?? "affiliate_redirect",
    page: url.searchParams.get("page") ?? undefined,
    referrer: request.headers.get("referer") ?? undefined,
    userAgent: request.headers.get("user-agent") ?? undefined,
  });

  redirect(href);
}

function decodeTargetUrl(value: string | null) {
  if (!value) {
    return null;
  }

  try {
    const decoded = Buffer.from(value, "base64url").toString("utf8");
    const targetUrl = new URL(decoded, process.env.NEXT_PUBLIC_SITE_URL ?? "https://travelbudget.ai");

    if (targetUrl.protocol !== "https:" && targetUrl.protocol !== "http:") {
      return null;
    }

    return targetUrl.toString();
  } catch {
    return null;
  }
}
