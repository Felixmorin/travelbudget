# Analytics Events

TravelBudget.ai uses typed product events from `src/lib/analytics/events.ts` and `trackEvent` from `src/lib/analytics/track.ts`. Payloads should avoid sensitive data and should truncate normalized free-form city or destination text.

## Core Search And Results

| Event | Fires when | Required properties | Optional properties | Business question |
| --- | --- | --- | --- | --- |
| `search_started` | A user first focuses or changes the homepage search form. | `page`, `source` | `originCode`, `originCity`, `budget`, `currency`, `travelStyle` | Which entry points start budget-search intent? |
| `search_completed` | A valid homepage search is submitted. | `page`, `budget`, `currency`, `originCode`, `originCity`, `days`, `tripLength`, `travelers`, `month`, `travelStyle` | `source`, `resultCount` | Which budgets, origins, months, and styles do users search most? |
| `budget_result_viewed` | A user views ranked results or a programmatic budget page. | `page`, `budget`, `currency`, `originCode`, `originCity`, `days`, `tripLength`, `travelers`, `travelStyle`, `resultCount` | `month`, `source` | Which searches and SEO pages produce recommendation views? |
| `destination_card_clicked` | A user clicks a destination card from homepage, results, or budget pages. | `page`, `destinationSlug`, `destinationName`, `source` | `budget`, `currency`, `originCode`, `originCity`, `days`, `tripLength`, `travelers`, `month`, `travelStyle`, `resultCount`, `href` | Which recommendations attract clicks? |
| `destination_viewed` | A destination budget page renders. | `page`, `destinationSlug`, `destinationName` | `originCode`, `originCity`, `currency`, `tripLength` | Which destinations get planning attention? |

## Calculator

| Event | Fires when | Required properties | Optional properties | Business question |
| --- | --- | --- | --- | --- |
| `calculator_started` | The calculator page loads. | `page`, `source` |  | How often do users enter the calculator workflow? |
| `calculator_updated` | A calculator field is changed for the first time in a session. | `page`, `field`, `estimatedTotal` | `originCity`, `destinationName`, `currency`, `tripLength`, `travelers` | Which calculator inputs users adjust most? |
| `calculator_submitted` | The calculator form is submitted. | `page`, `budget`, `currency`, `estimatedTotal` | `originCity`, `destinationName`, `tripLength`, `travelers` | What estimated trip totals are users building? |
| `calculator_results_clicked` | A user clicks from calculator results to destination recommendations. | `page`, `href`, `label`, `ctaLocation`, `budget`, `currency` | `originCity`, `tripLength`, `travelers`, `estimatedTotal` | How often calculator users continue into recommendations? |

Legacy aliases `budget_calculator_started`, `budget_calculator_updated`, `budget_calculator_submitted`, and `budget_calculator_cta_clicked` remain typed for backwards compatibility.

## CTAs And Affiliate Intent

| Event | Fires when | Required properties | Optional properties | Business question |
| --- | --- | --- | --- | --- |
| `cta_clicked` | A primary navigation, hero, bottom, or tool CTA is clicked. | `page`, `label`, `href`, `ctaLocation` | `source`, `originCode`, `originCity`, `destinationSlug`, `destinationName`, `budget`, `currency`, `days`, `tripLength`, `travelers`, `travelStyle` | Which calls to action move users deeper into the funnel? |
| `affiliate_module_viewed` | An affiliate card becomes visible at least once. | `page`, `destinationSlug`, `destinationName`, `affiliateType`, `href`, `ctaLocation` | `affiliatePartner`, `source`, `label` | Which destinations and affiliate categories get impressions? |
| `affiliate_link_clicked` | A user clicks an affiliate/planning link. | `page`, `destinationSlug`, `destinationName`, `affiliateType`, `href`, `ctaLocation` | `affiliatePartner`, `source`, `label`, `linkType`, `title` | Which destinations and categories drive revenue intent? |

## Supporting Content

| Event | Fires when | Required properties | Optional properties | Business question |
| --- | --- | --- | --- | --- |
| `newsletter_submitted` | The guides newsletter form is submitted. | `page`, `newsletterLocation` |  | Which content pages drive email intent? |
| `guide_clicked` | A guide navigation or guide card link is clicked. | `page`, `guideTitle`, `href` | `guideCategory` | Which editorial topics earn clicks? |
