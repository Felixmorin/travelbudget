# Social Content Agent Architecture

Phase 8 adds publishing interfaces and a simulation publisher on top of captions, UTM URLs, social metric placeholders, experiment dimensions, and the CLI human review queue. It still does not publish anything to real social platforms.

## Current Scope

- Typed content requests, statuses, templates, generated content, reviews, scenes, captions, and budget breakdowns.
- A strict state machine for generation lifecycle transitions.
- Request and budget validation designed to prevent invented numbers.
- Local JSON persistence for CLI usage in `.social-content-agent/metadata/social-content-store.json`.
- Supabase migration for the future production metadata model.
- CLI entrypoint through `npm run social -- ...`.
- Topic scoring based on budget fit, destination score, seasonality, landing-page availability, data warnings, and duplicate prevention.
- GoByBudget estimate validation for totals, currency, freshness, flight availability, source notes, and internal landing-page paths.
- FR/EN script generation for the four MVP templates.
- Numeric-claim validation that rejects scripts containing numbers absent from the request or validated GoByBudget estimates.
- Scene planning from script lines.
- SRT and VTT subtitle generation.
- SVG scene placeholders and cover image generation.
- Voice placeholder manifest until a TTS provider is enabled.
- Optional FFmpeg MP4 rendering to 1080x1920. If SVG decoding is unavailable, a branded fallback MP4 is generated.
- CLI review queue with list, detail, approve, reject, regenerate-script, and regenerate-media commands.
- TikTok and Instagram captions with first line, CTA, hashtags, cover text, and UTM-tagged landing URL.
- Empty social metric snapshots for views, reach, watch time, retention, engagement, clicks, conversions, and revenue.
- Experiment dimensions for hook, destination, origin, budget, duration, language, template, video duration, platform, and CTA.
- Publishing interfaces for Instagram/TikTok.
- Simulation publishing for approved content only.
- Official API publishers that are deliberately disabled until credentials, API review, and platform compliance are ready.

## Runtime Choice

The repo is a Next.js and TypeScript application. The social content domain starts in TypeScript so it can reuse GoByBudget destination, pricing, recommendation, and SEO URL logic directly.

Video rendering may later be isolated behind `src/lib/social-content/media` adapters. If FFmpeg or Python becomes necessary, it should be a worker implementation behind those TypeScript contracts, not the source of truth for budgets, landing pages, or scripts.

## Critical Data Rule

Current GoByBudget numbers are internal planning estimates, not live booking prices. Social scripts must describe them as estimates unless a live pricing provider is added.

## MVP Commands

```bash
npm run social -- inspect
```

```bash
npm run social -- generate --origin Montreal --budget 1500 --currency CAD --days 7 --language fr --template three_destinations
```

```bash
npm run social -- list-review
```

`generate` currently stops at `ready_for_review` when FFmpeg renders a video, or `assets_ready` when rendering is disabled/unavailable. Review decisions move `ready_for_review` content to `approved` or `rejected`. `simulate-publish` can record a simulation result for approved content. `generate-daily`, social API metric collection, and official publishing remain disabled until later phases.

## Review CLI

```bash
npm run social -- list-review
npm run social -- show-review <content_id>
npm run social -- approve <content_id> "Approved after manual review"
npm run social -- reject <content_id> "Reason for rejection"
npm run social -- regenerate-script <content_id>
npm run social -- regenerate-captions <content_id>
npm run social -- regenerate-media <content_id>
npm run social -- simulate-publish <content_id> --platform instagram
```

Review output includes:

- video and thumbnail paths;
- hook and script;
- request, topic, budget breakdown, and numeric-claim validation;
- TikTok caption, Instagram caption, hashtags, cover text, CTA, and UTM URL;
- empty metric snapshot and experiment dimensions;
- source URLs and license notes for scene visuals;
- warnings, errors, cost estimate, and available actions.
- publication simulation results, when present.

## Publishing Boundary

The Phase 8 publishing contract is intentionally conservative:

- simulation requires `approved` content with rendered video, thumbnail, and captions;
- simulation records `publicationResults` but leaves the content status as `approved`;
- `publish` is blocked in the CLI;
- Instagram and TikTok publisher implementations return disabled official-API results;
- browser automation, cookies, scraping, or unofficial API usage are not allowed.

## Filesystem Output

Local generated metadata is stored under:

```text
.social-content-agent/metadata/social-content-store.json
```

This path should stay out of source control.
