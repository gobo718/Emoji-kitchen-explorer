## v2.2.8 — Live Blurblet Publishing
- Added public Worker endpoint for retrieving published curator blurblets.
- Added publish-key-protected Curator endpoint for immediate D1 publishing.
- Mashup pages now prefer live cloud blurblets when the API is configured.
- Retained the downloadable JavaScript file as a safe manual fallback.
- Added BUILDINFO.json release lineage metadata.
- Updated the visible website version to v2.2.8.

## v2.2.8 — Device Identity Foundation
- Added stable anonymous device IDs stored locally.
- Added opt-in Worker device registration and D1 devices migration.
- Added masked identity and registration state to Diagnostics.
- Progress sync can use the device ID as its anonymous user ID.
- Updated the visible website version to v2.2.8.

## v2.2.8 — Progress Cloud Sync

- Added a unified Worker endpoint for seen and favorite progress.
- Added a persistent, batched sync queue with online retry.
- Added local/cloud union merging for progress restoration.
- Kept the favorites endpoint backward compatible.
- Expanded Diagnostics with queued batch count.
- Updated the visible website version to v2.2.8.

## v2.2.5 — Cloud Sync Framework

- Added a generic local-first SyncManager with repository registration and explicit sync states.
- Registered Favorites as the first sync-capable repository.
- Added a diagnostics page for app version, API mode, Worker reachability, D1 binding, and sync status.
- Sync remains disabled until explicitly configured; no automatic data transmission was added.
- Updated the visible website version to v2.2.5.

## v2.2.5 — Favorites Cloud Vertical Slice

- Added the first end-to-end cloud persistence path for mashup favorites.
- Added GET and PUT Worker endpoints backed by the existing D1 `mashup_progress` table.
- Added a browser cloud API client that remains disabled until an API URL is explicitly configured.
- Extended the progress repository with explicit push, pull, and fetch operations for cloud favorites.
- Added Worker and browser-client tests for the new path.
- Updated the visible site version and curator backup metadata to v2.2.5.
- The normal website remains local-first and does not transmit data automatically.

## v2.2.3 — D1 Schema Foundation

- Added the first versioned D1 migration under `worker/migrations/0001_initial.sql`.
- Defined cloud-ready tables for accounts, settings, mashup progress, blurblet votes, collections, collection membership, and curator blurblets.
- Added the `DB` binding configuration and local/remote migration commands.
- Updated the Worker health response to report API version, schema version, and D1 binding availability.
- Updated the visible website version and curator backup metadata to v2.2.3.
- The public site remains local-first; no user data is transmitted to Cloudflare in this release.

## v2.2.2 — Cloudflare Worker Scaffold

- Added a deployable Cloudflare Worker project under `worker/`.
- Added `GET /api/health`, structured JSON 404 responses, and CORS preflight handling.
- Added Worker tests without connecting production storage or D1.
- Restored the visible website release number and updated it to v2.2.2.
- Updated curator backup filenames and metadata to the current release number.
- No mashup rules, saved data, or user-facing behavior changed.

# Changelog

## v2.2.1 — Storage Adapter Foundation
- Added a swappable storage-adapter layer beneath `BillyStorage`.
- Added local-storage and in-memory adapters.
- Repositories and page controllers remain unchanged and local-first.
- Added adapter-switching regression tests.
- No visual or user-facing behavior changes.

## v2.2.0 — Repository Foundation

- Added `billy-repositories.js`, a single domain-oriented data-access layer for settings, Explorer state, Profile votes, progress, collections, and curator content.
- Removed remaining direct `BillyStorage` access from page controllers.
- Preserved the v2.1.3 interface, local-first behavior, collection filtering, and blurblet-only publishing workflow.
- Added repository contract tests.

## v2.1.3 — Blurblet-Only Publishing

- Added **Update Blurblet Only** to the mashup Curator panel.
- Saving a mashup now keeps its blurblet and collection memberships private as drafts.
- Publishing a blurblet does not publish or alter any collection draft.
- Added a dedicated public blurblet dataset (`published-curator-data.js`) that excludes private curator notes.
- Blurblet-only publishing downloads the updated public dataset for replacement on the separately hosted public site.

## v2.1.2 — Hide Empty Slots

- Added a remembered **Hide empty slots** option to individual My Collection emoji pages.
- When enabled, album pages show only discovered mashups and remove all undiscovered placeholders.
- Preserved the complete album view as the default for users who want to see missing slots.
- Routed Profile community-vote persistence through the shared BillyStorage gateway, removing the final direct page-level localStorage access.
- No mashup identity, eligibility, discovery, collection membership, or navigation behavior changed.

## v2.1.1 — Profile Navigation & Blurblet Context

- Replaced the Home-page My Collection quick link with My Profile.
- Removed the floating Profile shortcut.
- Made the Profile Collection card open My Collection while preserving direct Top 8 mashup links.
- Added the referenced mashup image and ingredient pair to My Best IMHO and Community Blurblet Vote.

# Changelog

## 2026-07-16

- Created GitHub repository.
- Added PROJECT_VISION.md.
- Added IDEAS.md.
- Imported the Emoji Kitchen backend database.
- Built the first HTML browser showing the newest 100 mashups.
- Planned pagination, collections, achievements, and discovery modes.
