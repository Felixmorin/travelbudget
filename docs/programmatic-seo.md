# Programmatic SEO Architecture

GoByBudget uses a small, rules-based pilot before scaling programmatic pages. The goal is to publish useful pages based on real estimates, not to create every possible URL combination.

## Current Pilot

- 10 priority destinations: controlled in `src/lib/programmatic/seo-registry.ts`.
- 4 budget levels: `1000`, `2000`, `3000`, `5000` CAD.
- 3 Canadian origins: Montreal, Toronto, Vancouver.
- 5 destination comparisons.
- 3 trip lengths: 7, 10, 14 days.

Indexable routes are generated from `getIndexableSeoPages()`. The sitemap uses this registry instead of raw data arrays.

## Add a Destination

1. Add or improve the destination in `src/lib/data/destinations.ts` or `src/lib/data/destination-hub.ts`.
2. Ensure it has flight estimates, daily costs, source notes, best months, travel styles, FAQs, `lastUpdated`, and `dataConfidence`.
3. Add the slug to `pilotDestinationSlugs` only when the page has distinct search demand and complete data.
4. Run `npm run test -- seo-registry` and verify the new page is indexable.

## Add a Departure City

1. Add origin pricing to destination data or confirm fallback quality.
2. Add the origin to `programmaticOrigins`.
3. Add its slug to `pilotOriginSlugs` only when at least several budget pages have useful destination matches.
4. Avoid enabling a city if it only changes the city name while reusing the same thin result set.

## Add a Budget Amount

1. Add the amount to `pilotBudgetAmounts`.
2. Add a matching tier in `budgetTiers`.
3. Confirm the amount creates a distinct planning question and has at least three complete destination matches.
4. Pages with insufficient matches stay `noindex` and are excluded from the sitemap.

## Control Index/Noindex

Indexing is controlled by `evaluateDestinationIndexability()` and `evaluateCollectionIndexability()` in `seo-registry.ts`.

An indexable page must have:

- enough unique data;
- a usable total estimate;
- a cost breakdown;
- contextual text;
- at least three internal links;
- distinct intent;
- canonical path equal to the served path.

Do not override `noindex` inside route files unless the registry is also updated.

## Avoid Cannibalization

- Use `/destinations/[slug]/travel-budget` for destination-level budget intent.
- Use `/budget/[amount]` for amount-first intent.
- Use `/from/[origin]/trips-under-[amount]` for origin plus budget intent.
- Use `/trip-length/[duration]` for duration-first comparison intent.
- Use `/compare/[a]-vs-[b]` for explicit comparison intent.

If two pages answer the same query with near-identical data, keep the stronger page indexable and leave the weaker page out of the registry or `noindex`.

## Quality Checks Before Publishing

Run:

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

Then verify:

- no duplicate indexable titles;
- canonical equals the intended route;
- no noindex URL appears in `sitemap.xml`;
- every indexable page has at least three internal links;
- comparison pages have at least two valid destinations;
- collection pages have at least three useful matches;
- templates hide weak sections instead of showing empty tables.

## Scaling Rule

Add pages in batches. A batch should improve data completeness first, then expand URLs. Do not add cities, durations, styles, or budget levels only because the URL pattern exists.
