# Analytics events

Use `trackEvent` from `@/lib/analytics/track` for product events:

```ts
trackEvent("budget_calculator_submitted", {
  page: "/tools/travel-budget-calculator",
  originCode: "YUL",
  destinationName: "Paris",
  budget: 2500,
  currency: "CAD",
  tripLength: 10,
  travelers: 2,
});
```

Add new events in `events.ts` first so the event name remains part of the
`AnalyticsEventName` union and the payload stays typed. Event names use
`snake_case`; payload keys use `camelCase`. Do not send personal data,
sensitive data, raw email addresses, or free-form user text.

`trackEvent` is client-safe: it no-ops during SSR and sends to Vercel
Analytics, GA4, Plausible, PostHog, or Segment if their browser globals are
present. Without a provider it logs in development and no-ops in production.

