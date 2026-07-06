# Revenue Funnel

TravelBudget.ai's MVP funnel is designed to measure budget-first travel intent before adding databases, live pricing APIs, or deeper affiliate conversion reporting.

## MVP Funnel

1. User lands on the homepage or an SEO budget page.
2. User searches from the homepage or opens a programmatic budget page.
3. User views ranked destination results.
4. User opens a destination budget guide.
5. User views and clicks an affiliate module for flights, hotels, eSIM, activities, or insurance.
6. Future: booking partner conversion is reconciled through partner reporting or postback data.

## Key Metrics

| Metric | Primary events | Why it matters |
| --- | --- | --- |
| Search start rate | `search_started` divided by homepage sessions | Measures homepage form engagement. |
| Search completion rate | `search_completed` divided by `search_started` | Shows whether the budget search form is usable and compelling. |
| Results view rate | `budget_result_viewed` divided by `search_completed` | Confirms searches are turning into recommendation views. |
| Destination CTR | `destination_card_clicked` divided by `budget_result_viewed` | Shows which recommendation surfaces drive deeper intent. |
| Affiliate CTR | `affiliate_link_clicked` divided by `affiliate_module_viewed` | Measures revenue intent from visible affiliate modules. |
| Affiliate CTR by category | Affiliate CTR grouped by `affiliateType` | Identifies whether flights, hotels, eSIM, activities, or insurance should be prioritized. |
| Top origin/budget combinations | `search_completed` grouped by `originCode`, `originCity`, `budget`, `currency` | Guides SEO pages, default examples, and future partner negotiations. |
| Top destination by click intent | `destination_card_clicked` and `affiliate_link_clicked` grouped by `destinationSlug` | Shows which destinations deserve deeper content and monetization work. |

## Notes

- Affiliate links use configured partner URLs and IDs where production environment variables are present.
- Prices shown in the MVP are planning estimates, not live fares, hotel rates, or booking availability.
- Partner postbacks, conversion APIs, and payout reporting should be added after the current event loop shows meaningful click intent.
