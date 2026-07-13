# Go-Live Runbook

This runbook is the minimum operational checklist before launching GoByBudget.com.

## Required Runtime

- Node.js 22.13.0 or newer. Use `.nvmrc`; `.npmrc` enforces `engine-strict=true`.
- Production build command: `npm ci && npm run build`.
- Production start command for Node hosting: `npm run start`.

## Required Production Environment Variables

- `NEXT_PUBLIC_SITE_URL`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `AFFILIATE_ALLOWED_DOMAINS`
- At least one analytics destination or a documented decision to rely only on server-side event storage.
- Product/legal sign-off that the cookie consent banner copy and default opt-in flow match each target market.
- Optional browser analytics and marketing IDs, including GA4, Clarity, Plausible, PostHog, Travelpayouts Drive,
  and Google Ads, must remain unset unless they are approved to load after explicit analytics consent.
- Alerting must be configured by one of these options:
  - `MONITORING_WEBHOOK_URL` and `MONITORING_WEBHOOK_SECRET` for webhook alerting.
  - `INCIDENT_ALERTING_PROVIDER` and `INCIDENT_ALERTING_ESCALATION_TARGET` when alerting is handled outside this app.
  - `INCIDENT_ALERTING_RUNBOOK_URL` is recommended for the external incident process.

Do not use `SUPABASE_ANON_KEY` for server writes in production. The app intentionally requires `SUPABASE_SERVICE_ROLE_KEY` when `NODE_ENV=production`.

## Database Deployment

Apply migrations in lexical order:

1. `docs/supabase/migrations/001_initial_analytics.sql`
2. `docs/supabase/migrations/002_enable_rls.sql`
3. `docs/supabase/migrations/003_email_leads.sql`
4. `docs/supabase/migrations/004_user_trip_model.sql`

Post-migration checks:

- Confirm RLS is enabled for `affiliate_clicks`, `analytics_events`, `email_leads`, `user_profiles`, `searches`, `search_criteria`, `saved_trips`, and `saved_destinations`.
- Confirm service role can insert into all three tables.
- Confirm anon role cannot select or insert into server-only analytics tables.
- Confirm authenticated users can save and retrieve only their own `saved_trips`, `searches`, `search_criteria`, and `saved_destinations`.

## Pre-Deploy Validation

Run locally or in CI:

```bash
npm ci
npm run security:audit
npm run lint
npm run typecheck
npm test
npm run build
```

## Post-Deploy Smoke Checks

- `GET /api/health` returns `200` and `ok: true`.
- Homepage loads and the primary budget search navigates to `/results`.
- `/results` renders recommendations for a common budget query.
- `/destinations/japan` renders without runtime errors.
- `/travel-extras` email request saves successfully.
- Analytics scripts do not load before accepting cookies, and load only after clicking "Accept analytics".
- A known affiliate link redirects through `/go/...` to a whitelisted HTTPS destination.
- An invalid `/go/...` destination returns `400`.

## Monitoring And Alerts

Minimum launch alerts:

- `/api/health` non-200.
- Error rate above 1% over 5 minutes.
- Supabase insert failures from analytics, affiliate clicks, or email leads.
- Structured log `eventType=analytics_error`, `email_lead_error`, `affiliate_persist_error`, or `affiliate_blocked`.
- Deployment build failure.
- Security audit failure in CI.

Diagnosis guide:

- Analytics failures: check `/api/health`, then search server logs for `eventType=analytics_error` and `message="Analytics event request failed."`.
- Lead failures: search `eventType=email_lead_error`, verify Supabase `email_leads` RLS/service-role access, then retry `POST /api/leads/email` from a staging client.
- Affiliate persistence failures: search `eventType=affiliate_persist_error`, verify `affiliate_clicks` insert permissions, then test a whitelisted `/go/...` URL.
- Blocked affiliate URLs: search `eventType=affiliate_blocked`, inspect the logged `host`, and update `AFFILIATE_ALLOWED_DOMAINS` only after partner/legal approval.
- Supabase outage or config issue: `/api/health` includes `backend.mode`, `backend.missing`, and `backend.error`.

Webhook verification:

1. Set `MONITORING_WEBHOOK_URL` and `MONITORING_WEBHOOK_SECRET` in production.
2. Deploy or restart the runtime so the new values are loaded.
3. Send a protected verification request:

```bash
curl -X POST "$NEXT_PUBLIC_SITE_URL/api/monitoring/webhook-test" \
  -H "Authorization: Bearer $MONITORING_WEBHOOK_SECRET"
```

4. Confirm the response has `ok: true`.
5. Confirm the alert destination received `Monitoring webhook verification event.`

If webhook alerting is not used, document the alternative provider and escalation target in `INCIDENT_ALERTING_PROVIDER` and `INCIDENT_ALERTING_ESCALATION_TARGET`. In production, `/api/health` is non-200 unless Supabase storage and one alerting path are configured.

## Rollback

Application rollback:

1. Re-deploy the last known good deployment from the hosting provider.
2. Verify `GET /api/health`.
3. Verify homepage, results, destination page, and affiliate redirect.
4. Keep current environment variables unless the incident is configuration-related.

Configuration rollback:

1. Restore the previous environment variable values from the provider's change history or secret manager.
2. Redeploy if the host snapshots env vars at build time.
3. Verify `GET /api/health` and one write path.

Database rollback:

- Prefer forward fixes for additive migrations.
- Before destructive migrations, take a Supabase backup or point-in-time recovery marker.
- For the current additive tables and indexes, rollback is not normally required.

## Backup And Recovery

- Enable Supabase backups or point-in-time recovery before launch.
- Document recovery owner and recovery time objective.
- Test a restore in a non-production project before relying on it for launch.
