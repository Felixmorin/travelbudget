# TravelBudget.ai

TravelBudget.ai is a budget-first travel planning MVP built with Next.js. It helps travelers compare destinations, estimate total trip costs, and understand where their money goes before they book.

The app currently uses curated planning estimate data for Japan, Portugal, and Vietnam. It is designed as a polished frontend foundation that can later be connected to flight, hotel, exchange-rate, and affiliate APIs.

## Features

- Budget-based destination recommendations
- Trip cost breakdowns for flights, hotels, food, local transport, and activities
- Destination detail pages with best months, itinerary previews, FAQs, and booking prompts
- Side-by-side destination comparison
- Travel planning tools directory
- SEO metadata and FAQ structured data for destination pages
- Responsive UI built with Tailwind CSS, shadcn-style components, and Lucide icons

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- ESLint
- Lucide React
- Base UI / shadcn-style component structure

## Getting Started

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

## Available Scripts

```bash
npm run dev
```

Runs the app locally in development mode.

```bash
npm run build
```

Builds the production version.

```bash
npm run start
```

Starts the production server after a build.

```bash
npm run lint
```

Runs ESLint.

## App Routes

- `/` - homepage with the budget search card and featured destinations
- `/results` - ranked destination recommendations based on query parameters
- `/destinations/japan` - Japan budget guide
- `/destinations/portugal` - Portugal budget guide
- `/destinations/vietnam` - Vietnam budget guide
- `/compare` - destination comparison table
- `/tools` - travel tools directory

## Project Structure

```text
src/
  app/                    App Router pages and global styles
  components/
    site/                 Product-specific UI sections and cards
    ui/                   Reusable UI primitives
  lib/
    budget/               Recommendation and cost-estimation logic
    data/                 Destination and tool planning data
    seo/                  Metadata helpers
public/                   Static assets
```

## Data Model

Destination data lives in `src/lib/data/destinations.ts`. Each destination includes:

- estimated total trip cost
- cost categories
- best travel months
- travel styles
- itinerary preview
- affiliate-ready booking links
- FAQ content

Recommendation logic lives in `src/lib/budget/recommend-destinations.ts`. It adjusts costs by currency, trip length, number of travelers, and travel style, then ranks destinations by budget fit, seasonality, and style match.

## Current Limitations

- Prices are planning estimates, not live booking data.
- Affiliate links currently route back into the app.
- Supported currencies are CAD, USD, and EUR.
- Supported recommendation styles are budget, balanced, and comfort.
- The initial destination dataset is intentionally small.

## Next Steps

- Connect live flight and hotel pricing APIs
- Add saved trips and user accounts
- Expand destination coverage
- Add real affiliate providers
- Persist searches and recommendation history
- Add tests for recommendation scoring and query parsing
