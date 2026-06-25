# TravelBudget.ai

TravelBudget.ai is a budget-first travel planning MVP built with Next.js App Router. It helps travelers compare destinations, estimate total trip costs from Canadian origins, and understand where their money goes before they book.

The app currently uses a curated planning dataset of 30 country destinations with origin-specific flight estimates from Montreal (YUL), Toronto (YYZ), and Vancouver (YVR), plus 24 city destination guides. Prices are directional estimates in CAD, not live fares or guarantees.

## Features

- Budget-based destination recommendations with query-string filters
- Category, destination, and sort controls on `/results`
- Trip cost breakdowns for flights, accommodation, food, local transport, activities, and miscellaneous spend
- Destination detail pages with best months, itinerary previews, FAQs, data-confidence notes, and booking modules
- Programmatic SEO pages for destination budgets, trip durations, and `/from/[origin]/under-[budget]` combinations
- Booking.com, Airalo, and GetYourGuide external partner link wiring
- Analytics events for page views, searches, destination clicks, affiliate modules, and CTAs
- Lead capture via a configurable server-side provider webhook, with local-only development storage

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
- `/destinations/[slug]` - 54 generated destination detail pages: 30 country guides and 24 city guides
- `/compare` - destination comparison table and comparison guide hub
- `/compare/[comparison]` - 4 generated comparison SEO pages
- `/tools` - travel tools directory
- `/tools/travel-budget-calculator` - budget calculator page
- `/guides` - guides hub
- `/guide` - guide landing page
- `/about` - product/about page
- `/methodology` - methodology and estimate explanation
- `/travel-budget/[destination]` - 30 generated destination budget SEO pages
- `/travel-cost/[destination]/[duration]` - 90 generated duration-based cost pages
- `/from/[origin]/under-[budget]` - 30 generated pages from Montreal, Toronto, Vancouver, Quebec, Ottawa, and Calgary across CAD 1,500, 2,000, 2,500, 3,000, and 4,000 budgets
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

Flight links point to Skyscanner search by default and can be redirected to another flight affiliate provider. Hotel links point to Booking.com destination search pages. eSIM links point to Airalo search by default. Activity links point to GetYourGuide search by default.

Optional public environment variables:

- `NEXT_PUBLIC_FLIGHTS_AFFILIATE_BASE_URL` - overrides the flight provider or affiliate deep-link base URL
- `NEXT_PUBLIC_FLIGHTS_AFFILIATE_QUERY_PARAM` - overrides the flight search query parameter, defaults to `query`
- `NEXT_PUBLIC_FLIGHTS_AFFILIATE_PROVIDER` - labels the flight analytics provider, defaults to `Skyscanner`
- `NEXT_PUBLIC_FLIGHTS_AFFILIATE_PARTNER` - labels the flight commercial partner, defaults to the provider value
- `NEXT_PUBLIC_BOOKING_AFFILIATE_AID` - adds the Booking.com `aid` parameter
- `NEXT_PUBLIC_ESIM_AFFILIATE_BASE_URL` - overrides the eSIM provider or affiliate deep-link base URL
- `NEXT_PUBLIC_ESIM_AFFILIATE_QUERY_PARAM` - overrides the eSIM search query parameter, defaults to `search`
- `NEXT_PUBLIC_ACTIVITIES_AFFILIATE_BASE_URL` - overrides the activities provider or affiliate deep-link base URL
- `NEXT_PUBLIC_ACTIVITIES_AFFILIATE_QUERY_PARAM` - overrides the activities search query parameter, defaults to `q`

Server-side lead capture variables:

- `LEAD_CAPTURE_WEBHOOK_URL` - required in production; receives `lead_capture.created` events for a CRM, database API, email provider, or automation tool
- `LEAD_CAPTURE_WEBHOOK_SECRET` - optional bearer token sent to the webhook as `Authorization: Bearer <secret>`
- `LEAD_CAPTURE_LOG_TO_CONSOLE` - optional local-development logging; production does not fall back to memory storage

## Current Limitations

- Prices are curated planning estimates, not live booking data.
- Flight links still route to in-app planning results.
- Affiliate commission tracking depends on configured partner IDs or partner-provided base URLs.
- Supported currencies are CAD, USD, and EUR.
- Supported recommendation styles are budget, balanced, and comfort.
