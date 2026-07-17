# Billy Labs — Project Log

## v1.9.2b — Final UI Polish

- Surprise Me now opens a selected mashup directly.
- Standardized optical blurblet alignment across the app.
- Verified branded Copy Emojis and Favorite buttons in all mashup views.
- Added success feedback to copy actions.
- Added persistent Favorite/Favorited button states.

## v1.9.2a — Branded Action Buttons

- Changed **Copy emojis** to a pink gradient drawn from the Explorer wordmark.
- Changed **Favorite** to a peach gradient drawn from the Explorer wordmark.
- Applied the same styling to Billy’s Daily Pick and the mashup detail view opened by **View in Explorer**.
- No JavaScript, storage, collection, or discovery behavior changed.


## v1.9.2 — Daily Pick Resilience Hotfix

- Restored Billy’s Daily Pick on the public home page.
- Made the Daily Pick render independently of progress and favorites storage.
- Added safe fallbacks so a storage migration or progress-engine error cannot hide the entire feature.
- Preserved the v1.9.1 discovery repair and public/dev Curator separation.

## Current Version
v1.9.2b — Final UI Polish

## Phase Status
- Phase 1 — Museum: complete
- Phase 2 — Progression: foundation active
- Collection Manager: first functional release
- Collection Book, living trophies, Trophy Room, achievements, badges, stickers, powers, and community systems: planned

## v1.9.1 — Collection Control Room Foundation

### Added
- `mashup-core.js`: one canonical, unordered two-item mashup ID. Duplicate ingredients remain valid (`🐷|🐷`). Release date is metadata, never identity.
- `progress-engine.js`: shared seen/favorite storage with migration from legacy date-based IDs.
- `collections-data.js`: permanent collection IDs, draft data, published snapshots, version numbers, points, tier, secret flag, banner reference, notes, and member lists.
- Curator Collection Control Room with create, edit, duplicate, delete, backup, import, draft membership editing, and explicit publishing.
- Versioned publishing: public data changes only when the curator publishes a draft. Further edits remain private until the next publication.
- Context-preserving collection creation from a mashup page. The current mashup becomes member #1 automatically.
- Versioned backup filenames and metadata.

### Modified
- `mashup.html`: canonical seen/favorite progress, collection draft membership, context-preserving creation, and clearer draft/publish language.
- `curator/index.html`: replaced the simple entry list with the museum control room.

### Migration
- Legacy seen and favorite IDs are normalized into canonical pair IDs.
- Legacy exhibits become collection drafts on first load.
- Existing blurblets and private mashup notes remain in the curator entry store.

## Architectural Decisions

### Canonical Mashup Identity
A mashup is identified by a normalized two-item pair. Order does not matter; multiplicity does.

- `🥓 + 🐷` and `🐷 + 🥓` are the same mashup.
- `🐷 + 🐷` is a valid unique mashup.
- Dates, image URLs, names, and release batches are metadata.

### Curator
The Curator is the museum control room, not a separate duplicate management product. Its eventual sections are Mashups, Collections, Trophies, Import/Export, and Settings.

### Collections
- Permanent IDs never change when names change.
- Editing happens in a private draft.
- Publishing creates a new immutable public version snapshot.
- A veteran may earn historical trophy levels tied to versions completed while active. A newcomer begins with the current version and cannot retroactively earn retired version trophies.

### Reward Ecosystem
- Collections: what exists in the museum.
- Trophies: historical collection completion and museum history.
- Achievements: site milestones, such as first mashup viewed or first collection completed.
- Badges: community participation, such as voting and writing blurblets.
- Stars: intentionally reserved until they have a unique purpose.
- Stickers: playful decorative souvenirs placed anywhere in a Trophy Room.
- Hidden recognitions: rare acknowledgements whose category may remain unknown until encountered.

### Mystery and Discovery
- Unknown recognitions may appear only as shapeless shadows.
- A player may eventually earn a shrouded trophy case without outsiders knowing its contents or item count.
- Hidden rewards still contribute points, so score can imply that something unseen happened.
- Stickers owned by another visitor remain invisible unless the viewer owns them too.
- Temporary museum powers can alter perception without granting ownership. Example: **Curator's Sight**, which reveals unowned sticker silhouettes for one hour.
- Goofy easter eggs matter. Example: clicking the Lightning Puppy's nose three times can award a cute sticker and an intentionally arbitrary number of points.
- Sticker totals and complete secret inventories should not be disclosed.

### Guiding Principle
**Wonder is more valuable than information.** Billy Labs should never lie, but it does not need to reveal everything.

## Next Milestones
1. Test and refine collection draft/publish workflow with real curation.
2. Build visitor-facing Collection Book from published snapshots only.
3. Add collection progress and points calculations to the shared progress engine.
4. Implement living, version-based trophies.
5. Build the Trophy Room shell and personalization model.

## 2026-07-17 — Corrected v1.9.1 build provenance

This package was rebuilt from the verified v1.8.0 foundation branch rather than the older v1.7.2d branch. The v1.8.0 public site behavior and working Discovery flow are retained. Curator controls remain hidden on ordinary public hosts and are available on development hosts or with the explicit `?curator=1` query parameter.

### v1.9.2b final polish completion
- Blurblets now keep normal document flow, wrap to any needed number of lines, and use the optical right-edge alignment on phones as well as larger screens.
- Billy’s Daily Pick **View in Explorer** button now opens the selected mashup detail directly instead of a one-result Explorer page.
