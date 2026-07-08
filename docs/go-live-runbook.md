# Go-Live Runbook

This runbook is the minimum operational checklist before launching GoByBudget.com.

## Required Runtime

- Node.js 22.13 or newer.
- Production build command: `npm ci && npm run build`.
- Production start command for Node hosting: `npm run start`.

## Required Production Environment Variables

- `NEXT_PUBLIC_SITE_URL`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `AFFILIATE_ALLOWED_DOMAINS`
- At least one analytics destination or a documented decision to rely only on server-side event storage.
- `MONITORING_WEBHOOK_URL` and `MONITORING_WEBHOOK_SECRET` if webhook alerting is used.

Do not use `SUPABASE_ANON_KEY` for server writes in production. The app intentionally requires `SUPABASE_SERVICE_ROLE_KEY` when `NODE_ENV=production`.

## Database Deployment

Apply migrations in lexical order:

1. `docs/supabase/migrations/001_initial_analytics.sql`
2. `docs/supabase/migrations/002_enable_rls.sql`
3. `docs/supabase/migrations/003_email_leads.sql`

Post-migration checks:

- Confirm RLS is enabled for `affiliate_clicks`, `analytics_events`, and `email_leads`.
- Confirm service role can insert into all three tables.
- Confirm anon role cannot select or insert into those tables.

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
- A known affiliate link redirects through `/go/...` to a whitelisted HTTPS destination.
- An invalid `/go/...` destination returns `400`.

## Monitoring And Alerts

Minimum launch alerts:

- `/api/health` non-200.
- Error rate above 1% over 5 minutes.
- Supabase insert failures from analytics, affiliate clicks, or email leads.
- Deployment build failure.
- Security audit failure in CI.

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
