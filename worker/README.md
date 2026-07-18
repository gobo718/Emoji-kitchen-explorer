# Billy Labs Cloudflare Worker

This directory contains the Billy Labs API and the first D1 schema, introduced in v2.2.3.

## Included

- `GET /api/health`
- D1 binding name: `DB`
- Initial migration: `migrations/0001_initial.sql`
- Tables for users, settings, mashup progress, blurblet votes, collections, collection items, and curator blurblets

## Before the first Cloudflare deployment

1. Run `npm install`.
2. Run `npm run db:create`.
3. Copy the returned database ID into `wrangler.toml`.
4. Run `npm run db:migrate:local` to test locally.
5. Run `npm run db:migrate:remote` when the production database is ready.
6. Run `npm run deploy`.

The static website still uses local browser storage in this release. No user data is sent to D1 yet.
