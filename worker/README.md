# Billy Labs Cloudflare Worker

This directory is the deployable API scaffold introduced in v2.2.2.

Current endpoint:

- `GET /api/health` — confirms the Worker is running and reports that persistent storage is not connected yet.

No D1 database, account IDs, secrets, or public-site integration are included in this milestone. Those belong to the next cloud-storage milestones.

## Local commands

```sh
npm install
npm test
npm run dev
```
