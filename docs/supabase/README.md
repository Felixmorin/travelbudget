# Supabase Setup

Apply migrations in lexical order from `docs/supabase/migrations`.

1. `001_initial_analytics.sql`
2. `002_enable_rls.sql`
3. `003_email_leads.sql`
4. `004_user_trip_model.sql`
5. `005_trip_budget_leads.sql`

Required server environment:

- `SUPABASE_URL`: Supabase project URL.
- `SUPABASE_SERVICE_ROLE_KEY`: server-only key for existing analytics, leads, and affiliate writes. Never expose it in client code or `NEXT_PUBLIC_*`.
- `SUPABASE_ANON_KEY`: optional until authenticated client features are wired. It is safe for browser use only with RLS.
- `RESEND_API_KEY`: server-only key used by `/api/leads/trip-budget` to send the requested trip budget.
- `EMAIL_FROM_ADDRESS`: verified sender address, for example `GoByBudget <budget@gobybudget.com>`.

The user trip model assumes Supabase Auth. Tables are isolated with RLS through `auth.uid()`:

- `user_profiles`
- `searches`
- `search_criteria`
- `saved_trips`
- `saved_destinations`

Acceptance check in Supabase SQL editor:

```sql
-- As an authenticated user, insert a search and saved trip with user_id = auth.uid().
-- Selecting saved_trips should return only rows owned by that user.
-- A row with another user_id should be rejected by RLS.
```

This migration establishes persistence and RLS isolation only. The application UI does not yet claim account-based saved trips are available until Supabase Auth is connected.

## Trip budget leads

`trip_budget_leads` stores only the email address, consent state, search summary, cost breakdown, result payload, source page, UTM fields, referrer, and email delivery status for the explicit "Send me this trip budget" request.

RLS is enabled and only the `service_role` can read or write rows. The browser submits to `/api/leads/trip-budget`; it never receives Supabase credentials and cannot list saved emails.

Before production testing, verify the sending domain in Resend, set `RESEND_API_KEY` and `EMAIL_FROM_ADDRESS`, then submit a real result from `/results`. The row should be created with `email_status = sent` and `email_provider_id` populated.
