# GoByBudget.com

GoByBudget.com is a budget-first travel planning MVP built with Next.js App Router. It helps travelers compare destinations, estimate total trip costs from Canadian origins, and understand where their money goes before they book.

The app currently uses a curated planning dataset of 30 country destinations with origin-specific flight estimates from Montreal (YUL), Toronto (YYZ), and Vancouver (YVR), plus 24 city destination guides. Prices are directional estimates in CAD, not live fares or guarantees.

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

Flight links point to Skyscanner search by default and can be redirected to another flight affiliate provider. Hotel links point to Booking.com destination search pages. eSIM links point to Airalo search by default. Activity links point to GetYourGuide search by default. Insurance links remain internal unless `NEXT_PUBLIC_INSURANCE_AFFILIATE_BASE_URL` is configured.

Analytics environment variables:

- `NEXT_PUBLIC_GA_MEASUREMENT_ID` - enables GA4 script loading
- `NEXT_PUBLIC_CLARITY_PROJECT_ID` - enables Microsoft Clarity
- `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` - enables Plausible tracking for the configured domain
- `NEXT_PUBLIC_PLAUSIBLE_SCRIPT_SRC` - optional Plausible script override, defaults to `https://plausible.io/js/script.js`
- `NEXT_PUBLIC_POSTHOG_KEY` - enables PostHog
- `NEXT_PUBLIC_POSTHOG_HOST` - optional PostHog host, defaults to `https://us.i.posthog.com`

Optional public environment variables:

- `NEXT_PUBLIC_FLIGHTS_AFFILIATE_BASE_URL` - overrides the flight provider or affiliate deep-link base URL
- `NEXT_PUBLIC_FLIGHTS_AFFILIATE_QUERY_PARAM` - overrides the flight search query parameter, defaults to `query`
- `NEXT_PUBLIC_FLIGHTS_AFFILIATE_PROVIDER` - labels the flight analytics provider, defaults to `Skyscanner`
- `NEXT_PUBLIC_FLIGHTS_AFFILIATE_PARTNER` - labels the flight commercial partner, defaults to the provider value
- `NEXT_PUBLIC_FLIGHTS_AFFILIATE_ID_PARAM` and `NEXT_PUBLIC_FLIGHTS_AFFILIATE_ID` - optional flight partner ID query parameter and value
- `NEXT_PUBLIC_BOOKING_AFFILIATE_AID` - adds the Booking.com `aid` parameter
- `NEXT_PUBLIC_ESIM_AFFILIATE_BASE_URL` - overrides the eSIM provider or affiliate deep-link base URL
- `NEXT_PUBLIC_ESIM_AFFILIATE_QUERY_PARAM` - overrides the eSIM search query parameter, defaults to `search`
- `NEXT_PUBLIC_ESIM_AFFILIATE_PROVIDER` and `NEXT_PUBLIC_ESIM_AFFILIATE_PARTNER` - labels eSIM provider and commercial partner
- `NEXT_PUBLIC_ESIM_AFFILIATE_ID_PARAM` and `NEXT_PUBLIC_ESIM_AFFILIATE_ID` - optional eSIM partner ID query parameter and value
- `NEXT_PUBLIC_ACTIVITIES_AFFILIATE_BASE_URL` - overrides the activities provider or affiliate deep-link base URL
- `NEXT_PUBLIC_ACTIVITIES_AFFILIATE_QUERY_PARAM` - overrides the activities search query parameter, defaults to `q`
- `NEXT_PUBLIC_ACTIVITIES_AFFILIATE_PROVIDER` and `NEXT_PUBLIC_ACTIVITIES_AFFILIATE_PARTNER` - labels activity provider and commercial partner
- `NEXT_PUBLIC_ACTIVITIES_AFFILIATE_ID_PARAM` and `NEXT_PUBLIC_ACTIVITIES_AFFILIATE_ID` - optional activity partner ID query parameter and value
- `NEXT_PUBLIC_INSURANCE_AFFILIATE_BASE_URL` - enables external insurance partner links
- `NEXT_PUBLIC_INSURANCE_AFFILIATE_QUERY_PARAM` - destination query parameter for insurance links, defaults to `destination`
- `NEXT_PUBLIC_INSURANCE_AFFILIATE_PROVIDER` and `NEXT_PUBLIC_INSURANCE_AFFILIATE_PARTNER` - labels insurance provider and commercial partner
- `NEXT_PUBLIC_INSURANCE_AFFILIATE_ID_PARAM` and `NEXT_PUBLIC_INSURANCE_AFFILIATE_ID` - optional insurance partner ID query parameter and value

## Current Limitations

- Prices are curated planning estimates, not live booking data.
- Affiliate commission tracking depends on configured partner IDs or partner-provided base URLs.
- Supported currencies are CAD, USD, and EUR.
- Supported recommendation styles are budget, balanced, and comfort.
