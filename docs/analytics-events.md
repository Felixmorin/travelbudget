# Analytics Events

GoByBudget.com uses typed product events from `src/lib/analytics/events.ts` and `trackEvent` from `src/lib/analytics/track.ts`. Payloads should avoid sensitive data and should truncate normalized free-form city or destination text.

## Core Search And Results

| Event | Fires when | Required properties | Optional properties | Business question |
| --- | --- | --- | --- | --- |
| `search_started` | A user first focuses or changes the homepage search form. | `page`, `source` | `originCode`, `originCity`, `budget`, `currency`, `travelStyle` | Which entry points start budget-search intent? |
| `search_completed` | A valid homepage search is submitted. | `page`, `budget`, `currency`, `originCode`, `originCity`, `days`, `tripLength`, `travelers`, `month`, `travelStyle` | `source`, `resultCount` | Which budgets, origins, months, and styles do users search most? |
| `budget_result_viewed` | A user views ranked results or a programmatic budget page. | `page`, `budget`, `currency`, `originCode`, `originCity`, `days`, `tripLength`, `travelers`, `travelStyle`, `resultCount` | `month`, `source` | Which searches and SEO pages produce recommendation views? |
| `destination_card_clicked` | A user clicks a destination card from homepage, results, or budget pages. | `page`, `destinationSlug`, `destinationName`, `source` | `budget`, `currency`, `originCode`, `originCity`, `days`, `tripLength`, `travelers`, `month`, `travelStyle`, `resultCount`, `resultRank`, `href` | Which recommendations attract clicks? |
| `result_clicked` | A ranked result card is clicked. | `page`, `destinationSlug`, `destinationName`, `resultRank`, `source` | `budget`, `currency`, `originCode`, `originCity`, `days`, `tripLength`, `travelers`, `month`, `travelStyle`, `resultCount`, `href` | Which result rank positions drive destination detail views? |
| `filter_changed` | A results or destination discovery filter value changes. | `page`, `filterName`, `filterValue`, `source` | `previousValue`, `budget`, `currency`, `originCode`, `days`, `tripLength`, `travelers`, `month`, `travelStyle` | Which filter interactions reshape search intent? |
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
| `compare_click` | A destination is added to or removed from compare, or the selected compare CTA is clicked. | `page`, `label`, `href`, `ctaLocation` | `compareAction`, `destinationSlug`, `destinationName`, `selectedDestinationSlugs`, `selectedDestinations`, `source` | Which comparison entry points users choose and which picked destination sets lead to comparison. |
| `email_capture` | A user submits an email capture form. | `page`, `label`, `ctaLocation` | `budget`, `currency`, `emailDomain`, `source` | Which budget handoff surfaces collect leads. |
| `trip_budget_email_cta_viewed` | The trip-budget email CTA is rendered. | `page`, `source`, `ctaLocation` | `origin`, `destination`, `budget`, `budgetRange`, `currency`, `days`, `travelers`, `travelStyle`, `deviceType`, `experimentVariant` | Which result surfaces expose the budget email offer. |
| `trip_budget_email_cta_clicked` | A user opens the trip-budget email modal. | `page`, `source`, `ctaLocation` | `origin`, `destination`, `budget`, `budgetRange`, `currency`, `days`, `travelers`, `travelStyle`, `deviceType`, `experimentVariant` | Which CTA placements start the email flow. |
| `trip_budget_email_form_submitted` | A user submits the modal after client validation. | `page`, `source`, `ctaLocation` | `origin`, `destination`, `budget`, `budgetRange`, `currency`, `days`, `travelers`, `travelStyle` | Which searches convert into budget email requests. |
| `trip_budget_email_saved` | The server stores the lead request. | `page`, `source` | `origin`, `destination`, `budget`, `budgetRange`, `currency`, `days`, `travelers`, `travelStyle` | Whether Supabase lead capture is succeeding. |
| `trip_budget_email_sent` | Email delivery succeeds or is skipped in local development. | `page`, `source` | `origin`, `destination`, `budget`, `budgetRange`, `currency`, `days`, `travelers`, `travelStyle`, `emailStatus` | Whether requested budget emails are delivered. |
| `trip_budget_email_failed` | Server save or email delivery fails. | `page`, `source` | `origin`, `destination`, `budget`, `budgetRange`, `currency`, `days`, `travelers`, `travelStyle`, `emailStatus` | Which searches encounter lead or delivery failures. |
| `affiliate_module_viewed` | An affiliate card becomes visible at least once. | `page`, `destinationSlug`, `destinationName`, `affiliateType`, `href`, `ctaLocation` | `affiliatePartner`, `affiliateProvider`, `source`, `label` | Which destinations, providers, and affiliate categories get impressions? |
| `affiliate_link_clicked` | A user clicks an affiliate/planning link. | `page`, `destinationSlug`, `destinationName`, `affiliateType`, `href`, `ctaLocation` | `affiliatePartner`, `affiliateProvider`, `source`, `label`, `linkType`, `title` | Which providers, destinations, and categories drive revenue intent? |
| `affiliate_click` | A user clicks a contextual Aviasales flight CTA. | `affiliate`, `product`, `origin`, `destination`, `placement`, `page_path`, `href` | `departure_date`, `return_date`, `page_type`, `affiliatePartner`, `affiliateProvider`, `label` | Which flight routes and placements drive Aviasales intent? |

## Supporting Content

| Event | Fires when | Required properties | Optional properties | Business question |
| --- | --- | --- | --- | --- |
| `guide_clicked` | A guide navigation or guide card link is clicked. | `page`, `guideTitle`, `href` | `guideCategory` | Which editorial topics earn clicks? |
| `guide_viewed` | A guide slug page renders. | `page`, `guideTitle` | `guideCategory`, `destinationSlug` | Which guide pages should be promoted in the guide hub? |
