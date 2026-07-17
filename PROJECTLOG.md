# Billy Labs Project Log

A living record of completed milestones, architectural decisions, and the reasons behind them.

## Current direction

Billy Labs is a living museum of Emoji Kitchen organized around four pillars:

1. Browse
2. Learn
3. Collect
4. Progress

Phase 1, the Museum foundation, is complete. Phase 2 focuses on Collections and Trophies.

---

## 2026-07-17 — v1.8.0 Foundation Release

### Canonical mashup identity

Every mashup now has one permanent canonical identity:

```text
normalizedIngredientA|normalizedIngredientB
```

The two ingredients are sorted into a consistent order. Both positions are preserved, so same-emoji mashups remain valid and distinct:

```text
🐷 + 🥓 -> 🐷|🥓
🥓 + 🐷 -> 🐷|🥓
🐷 + 🐷 -> 🐷|🐷
```

Release date is metadata and is no longer part of identity.

Dataset verification at the time of this decision:

- 147,000 mashups checked
- 413 same-emoji mashups found
- 0 canonical-ID collisions found

### Existing-progress migration

On first load, legacy Seen and Favorites keys in the format:

```text
left|right|releaseDate
```

are automatically converted to canonical pair IDs. Duplicate migrated entries are collapsed without deleting legitimate same-emoji mashups.

### Discovery rule

A mashup is collected only when its full mashup page is opened.

Explorer no longer:

- marks a card as seen directly,
- permits a discovered mashup to be un-seen,
- marks a random unseen mashup as collected before its page is opened.

Discovery is append-only during normal browsing. A deliberate full progress reset may be added separately later.

### Shared foundations added

- `mashup-core.js` — canonical identity, local-data migration, and storage helpers
- `progress-engine.js` — storage-agnostic public progression API
- `collections-data.js` — initial public collection schema and finalized rarity rules

The progression API is deliberately separated from its current local storage so authenticated accounts and synchronization can replace local storage later without rewriting game rules.

### Finalized collection rarity rules

| Rarity | Reveal rule | Points per collected member | Completion bonus |
|---|---:|---:|---:|
| Public | Immediately | 1 | 1 × collection size |
| Common | After 1 collected | 2 | 2 × collection size |
| Rare | 25% | 5 | 5 × collection size |
| Epic | 50% | 10 | 10 × collection size |
| Legendary | 75% | 25 | 25 × collection size |
| Mythic | 100% | 50 | 50 × collection size |

A mashup may award points in every collection to which it belongs.

### Living Trophies

Trophy levels are cumulative physical/visual trophies, not replacements. When a collection expands to a new member count, completing that expanded collection earns an additional trophy level and another completion bonus. Earlier trophies remain earned and visible.

### Public progression direction

The Trophy page will publicly display the visitor's points. Future authenticated accounts, synchronized progress, public profiles, and leaderboards remain planned.

### Next milestone

Build the Collection Manager around permanent collection IDs and canonical mashup membership while keeping public collection data separate from private curator notes.

---

## 2026-07-17 — v1.8.1 Curator Collections Release

### Curator becomes the museum control room

The Curator dashboard now has three dedicated workspaces:

1. Mashup Editor
2. Collections
3. Imports / Exports

The existing mashup-page Curator panel and legacy exhibit assignments remain available. No existing curator workflow was removed.

### Collection Manager added

Curator can now create and edit local collection drafts with:

- permanent collection ID,
- name,
- description,
- rarity,
- draft or published status,
- sort order,
- private curator notes,
- canonical mashup membership.

Permanent IDs are locked after the collection is first saved. Collection members use the canonical normalized two-ingredient mashup ID established in v1.8.0.

The manager includes mashup search, member addition and removal, collection counts, and membership totals. These drafts remain private in the current browser until exported and added to the published site.

### Public collection export

Curator can export a generated `collections-data.js` containing only collections marked Published. Private curator notes and draft collections are excluded.

### Backup improvements

Private curator backups now:

- use dated descriptive filenames,
- identify the project and backup format version,
- include export time and summary counts,
- include collection drafts,
- support Merge and Replace import modes.

Example filename:

```text
BillyLabs-v1.8.1-CuratorBackup-2026-07-17.json
```

### Next milestone

Test the collection-authoring workflow with the first real curated collection, then connect published collection data to collection progress calculations and the visitor-facing Collection Book.
