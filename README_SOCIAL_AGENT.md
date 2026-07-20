# GoByBudget Social Content Agent

This agent will generate vertical travel-budget content for TikTok and Instagram Reels from GoByBudget data. Phase 8 contains foundations, deterministic topic selection, GoByBudget data validation, deterministic FR/EN script generation, captions/UTM, analytics placeholders, local media assets, optional FFmpeg MP4 rendering, a CLI human review queue, and publishing interfaces with simulation only.

It does not call a TTS provider or publish to social platforms yet. Official publishing is intentionally disabled during the MVP.

## Local Setup

Use Node.js `22.13.0` or newer.

```bash
npm ci
npm run social -- inspect
```

Create a draft generation:

```bash
npm run social -- generate --origin Montreal --budget 1500 --currency CAD --days 7 --language fr --template three_destinations
```

List review-ready content:

```bash
npm run social -- list-review
```

Inspect one review item:

```bash
npm run social -- show-review <content_id>
```

Approve or reject:

```bash
npm run social -- approve <content_id> "Approved after manual review"
npm run social -- reject <content_id> "Reason for rejection"
```

Regenerate implemented parts:

```bash
npm run social -- regenerate-script <content_id>
npm run social -- regenerate-captions <content_id>
npm run social -- regenerate-media <content_id>
```

Simulate a publish after approval:

```bash
npm run social -- simulate-publish <content_id> --platform instagram
```

## Environment

Social agent variables are documented in `.env.example`. Official publishing is disabled in code during the MVP foundation phases.

## Architecture

See `docs/social-content-agent.md` and `docs/social-content-pipeline.mmd`.

## Current Behavior

- `inspect` reports configured templates, statuses, and available GoByBudget destinations.
- `generate` creates a content record, selects a valid GoByBudget-backed topic, validates budget data, generates a short script, validates numeric claims, creates scenes/subtitles/cover/manifest, and renders a local MP4 when FFmpeg is available.
- Captions include TikTok text, Instagram text, CTA, hashtags, cover text, and UTM-tagged GoByBudget URL.
- Analytics placeholders include zeroed social metrics and experiment dimensions for later comparison.
- Topic selection avoids exact duplicates already present in the local store.
- Landing pages use existing GoByBudget pages only, falling back to `/results` where a static SEO page is not available.
- Script generation is deterministic in Phase 4 and does not call an external LLM.
- Every number in the hook/script must match an allowed numeric claim from the request or validated GoByBudget estimates.
- Media generation writes local SVG scene placeholders, SRT/VTT subtitles, a cover SVG, a voice placeholder manifest, and `media-manifest.json`.
- When FFmpeg cannot decode SVG scene files, the renderer falls back to a branded 1080x1920 MP4 with sidecar subtitles and scene assets.
- `list-review` shows review-ready content.
- `show-review` returns the video path, thumbnail path, script, hook, data used, sources, warnings, errors, costs, and available actions.
- `show-review` also returns captions, UTM parameters, social metric placeholders, and experiment dimensions.
- `approve` and `reject` record a human review decision and move the content to a terminal state.
- `regenerate-script`, `regenerate-captions`, and `regenerate-media` are available before terminal review decisions.
- `simulate-publish` requires approved content, records a simulation result, and leaves status as `approved`.
- `publish` is intentionally blocked; Instagram/TikTok publisher classes return disabled official-API results instead of using browser, cookie, or unofficial automation.

## Current Limits

- GoByBudget data is based on planning estimates, not live booking prices.
- Voice remains a placeholder until a TTS provider is selected and enabled.
- Third-party visual media is not downloaded; source URLs are preserved for later license review.
- Social platform analytics are not collected from APIs yet; Phase 7 only prepares the schema and empty snapshots.
- Automatic and official publishing are intentionally unavailable; Phase 8 only validates the interface and simulation flow.
