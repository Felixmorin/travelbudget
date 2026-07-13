# Supabase Setup

Apply migrations in lexical order from `docs/supabase/migrations`.

1. `001_initial_analytics.sql`
2. `002_enable_rls.sql`
3. `003_email_leads.sql`
4. `004_user_trip_model.sql`

Required server environment:

- `SUPABASE_URL`: Supabase project URL.
- `SUPABASE_SERVICE_ROLE_KEY`: server-only key for existing analytics, leads, and affiliate writes. Never expose it in client code or `NEXT_PUBLIC_*`.
- `SUPABASE_ANON_KEY`: optional until authenticated client features are wired. It is safe for browser use only with RLS.

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
