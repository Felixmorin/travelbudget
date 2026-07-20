# GoByBudget.com

GoByBudget.com is a budget-first travel planning MVP built with Next.js App Router. It helps travelers compare destinations, estimate total trip costs from Canadian origins, and understand where their money goes before they book.

The app currently uses curated country and city destination datasets with origin-specific flight estimates from major Canadian and US departure cities, plus long-tail planning guides. Prices are directional estimates in CAD, not live fares or guarantees.

## Features

- Budget-based destination recommendations with query-string filters
- Category, destination, and sort controls on `/results`
- Trip cost breakdowns for flights, accommodation, food, local transport, activities, and miscellaneous spend
- Destination detail pages with best months, itinerary previews, FAQs, data-confidence notes, and booking modules
- Programmatic budget pages for destination budgets, trip durations, and `/from/[origin]/under-[budget]` combinations, kept out of the V1 sitemap until reviewed for indexing
- Booking.com, Airalo, GetYourGuide, flight, and insurance partner link wiring
- Analytics events for page views, searches, destination clicks, affiliate modules, and CTAs
- Optional GA4, Microsoft Clarity, Plausible, and PostHog script loading from production environment variables

## Tech Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- ESLint
- Vitest
- Lucide React
- Base UI / shadcn-style component structure

## Getting Started

Use Node.js 22.13.0 or newer before installing dependencies. The repo includes `.nvmrc`, `engines.node`, and
`.npmrc` engine-strict enforcement so `npm ci` fails fast on unsupported Node versions.

Install dependencies:

```bash
npm ci
```

Start the development server:

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

## Validation

The local validation suite matches CI:

```bash
npm ci
npm run lint
npm run typecheck
npm run security:audit
npm test
npm run build
```

CI runs from `.github/workflows/ci.yml` on pull requests and pushes to `master`, using Node.js 22 and npm cache.

## Available Scripts

```bash
npm run dev
```

Runs the app locally in development mode.

```bash
npm run lint
```

Runs ESLint.

```bash
npm run typecheck
```

Runs TypeScript with `tsc --noEmit`.

```bash
npm test
```

Runs Vitest unit tests.

```bash
npm run security:audit
```

Runs `npm audit --audit-level=moderate`.

```bash
npm run build
```

Builds the production version with Next.js.

```bash
npm run start
```

Starts the production server after a build.

## App Routes

- `/` - homepage with budget search and featured destinations
- `/results` - dynamic recommendation results using `budget`, `currency`, `origin`, `days`, `month`, `travelers`, `style`, `category`, `destination`, and `sort`
- `/destinations` - destination explorer
- `/destinations/[slug]` - generated destination detail pages for country and city budget guides
- `/compare` - destination comparison table and comparison guide hub
- `/compare/[comparison]` - 4 generated comparison SEO pages
- `/tools` - travel tools directory
- `/travel-budget-calculator` - canonical travel budget calculator page
- `/guides` - guides hub
- `/guide` - guide landing page
- `/about` - product/about page
- `/methodology` - methodology and estimate explanation
- `/privacy`, `/terms`, and `/affiliate-disclosure` - launch-ready legal basics
- `/travel-budget/[destination]` - generated destination budget pages, currently `noindex`
- `/travel-cost/[destination]/[duration]` - generated duration-based cost pages, currently `noindex`
- `/from/[origin]/under-[budget]` - generated budget pages from Montreal, Toronto, Vancouver, Quebec, Ottawa, and Calgary, currently `noindex`
- `/robots.txt` and `/sitemap.xml` - generated metadata routes

## Data Model

Destination data lives in `src/lib/data/destinations.ts`. Each destination includes:

- country and destination metadata
- image URL
- YUL, YYZ, and YVR flight estimate ranges
- daily cost models for budget, mid-range, and luxury travel styles
- best months, travel styles, weather notes, and confidence level
- itinerary preview and FAQs
- affiliate link definitions for flights, hotels, eSIM, activities, and insurance

Recommendation logic lives in `src/lib/budget/recommend-destinations.ts`. Results filtering and URL generation live in `src/lib/results/filters.ts`.

## Affiliate Links

Affiliate links are selected through the centralized `src/lib/affiliates` rules engine. Flight links use Aviasales/Travelpayouts search links when `NEXT_PUBLIC_TRAVELPAYOUTS_MARKER` is configured; otherwise they fall back to the configured Aviasales entry URL. Other partners use their configured generic affiliate entry URL unless an officially supported deep-link format is added.

Analytics environment variables:

- `NEXT_PUBLIC_GA_MEASUREMENT_ID` - enables GA4 script loading
- `NEXT_PUBLIC_CLARITY_PROJECT_ID` - enables Microsoft Clarity
- `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` - enables Plausible tracking for the configured domain
- `NEXT_PUBLIC_PLAUSIBLE_SCRIPT_SRC` - optional Plausible script override, defaults to `https://plausible.io/js/script.js`
- `NEXT_PUBLIC_POSTHOG_KEY` - enables PostHog
- `NEXT_PUBLIC_POSTHOG_HOST` - optional PostHog host, defaults to `https://us.i.posthog.com`
- `NEXT_PUBLIC_TRAVELPAYOUTS_DRIVE_SCRIPT_SRC` - enables the Travelpayouts Drive script after analytics consent
- `NEXT_PUBLIC_GOOGLE_ADS_CLIENT_ID` - enables Google Ads after analytics consent

Analytics and marketing scripts are loaded only after the visitor accepts analytics cookies.

Optional public environment variables:

- `NEXT_PUBLIC_AVIASALES_AFFILIATE_URL` - Aviasales fallback entry URL
- `NEXT_PUBLIC_BOOKING_AFFILIATE_URL` - Booking.com affiliate entry URL
- `NEXT_PUBLIC_GETYOURGUIDE_AFFILIATE_URL` - GetYourGuide affiliate entry URL
- `NEXT_PUBLIC_AIRALO_AFFILIATE_URL` - Airalo affiliate entry URL
- `NEXT_PUBLIC_DISCOVER_CARS_AFFILIATE_URL` - Discover Cars affiliate entry URL
- `NEXT_PUBLIC_OMIO_AFFILIATE_URL` - Omio affiliate entry URL
- `NEXT_PUBLIC_TRAVEL_INSURANCE_AFFILIATE_URL` - travel insurance affiliate entry URL
- `NEXT_PUBLIC_AIRPORT_TRANSFER_AFFILIATE_URL` - airport transfer affiliate entry URL
- `NEXT_PUBLIC_AVIASALES_FALLBACK_URL` - fallback flight affiliate URL, defaults to `https://aviasales.tpx.lu/59DXH0n1`
- `NEXT_PUBLIC_TRAVELPAYOUTS_MARKER` - public Travelpayouts marker inserted into Aviasales search URLs as `marker`
- `TRAVELPAYOUTS_API_TOKEN` and `TRAVELPAYOUTS_MARKER` - reserved server-only values for a future Partner Links API integration; never expose API tokens with `NEXT_PUBLIC_*`

## Current Limitations

- Prices are curated planning estimates, not live booking data.
- Affiliate commission tracking depends on configured partner IDs or partner-provided base URLs.
- Supported currencies are CAD, USD, and EUR.
- Supported recommendation styles are budget, balanced, and comfort.

## Go-Live Operations

Production launch readiness, migration order, health checks, monitoring, backup, and rollback steps are documented in `docs/go-live-runbook.md`.
