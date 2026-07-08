import { redirect } from "next/navigation";

import { isAllowedAffiliateUrl } from "@/lib/affiliate/allowed-domains";
import { saveAffiliateClick } from "@/lib/affiliate/tracking";
import { getErrorMessage, logServerEvent } from "@/lib/monitoring/server-logger";

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

  if (!isAllowedAffiliateUrl(href)) {
    await logServerEvent("warn", "Blocked affiliate redirect to non-whitelisted domain.", {
      affiliateType,
      destinationSlug,
      host: getHost(href),
    });

    return Response.json({ ok: false, error: "Unsupported affiliate destination." }, { status: 400 });
  }

  try {
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
  } catch (error) {
    await logServerEvent("error", "Unable to persist affiliate click before redirect.", {
      affiliateType,
      destinationSlug,
      error: getErrorMessage(error),
      host: getHost(href),
    });
  }

  redirect(href);
}

function decodeTargetUrl(value: string | null) {
  if (!value) {
    return null;
  }

  try {
    const decoded = Buffer.from(value, "base64url").toString("utf8");
    const targetUrl = new URL(decoded, process.env.NEXT_PUBLIC_SITE_URL ?? "https://gobybudget.com");

    if (targetUrl.protocol !== "https:") {
      return null;
    }

    return targetUrl.toString();
  } catch {
    return null;
  }
}

function getHost(href: string) {
  try {
    return new URL(href).hostname;
  } catch {
    return "invalid";
  }
}
