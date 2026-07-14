# SEO agent

The private SEO agent reads Google Search Console and GA4, then returns prioritized content and SEO recommendations.

Endpoint:

```bash
curl -X POST "$NEXT_PUBLIC_SITE_URL/api/admin/seo-agent" \
  -H "Authorization: Bearer $SEO_AGENT_ADMIN_TOKEN"
```

Optional custom date ranges:

```json
{
  "dateRange": { "startDate": "2026-06-13", "endDate": "2026-07-10" },
  "previousDateRange": { "startDate": "2026-05-16", "endDate": "2026-06-12" }
}
```

## Required environment variables

```bash
SEO_AGENT_ADMIN_TOKEN=
GOOGLE_SERVICE_ACCOUNT_EMAIL=
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY=
GOOGLE_SEARCH_CONSOLE_SITE_URL=https://gobybudget.com/
GA4_PROPERTY_ID=
```

Keep `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY` server-only. It can be pasted with escaped newlines:

```bash
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

## Google access setup

1. Create a Google Cloud service account.
2. Enable the Google Search Console API and Google Analytics Data API.
3. Add the service account email as a user on the Search Console property.
4. Add the same service account email to the GA4 property with read access.
5. Set `GA4_PROPERTY_ID` to the numeric GA4 property id, not the measurement id.

The agent currently flags:

- high-impression queries with low CTR for their average position
- ranking opportunities in positions 8-20
- organic click declines versus the previous period
- landing pages with low GA4 engagement
