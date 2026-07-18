# Billy Labs Worker

The Worker now contains the first complete cloud persistence path.

Endpoints:
- `GET /api/health`
- `GET /api/users/:userId/favorites`
- `PUT /api/users/:userId/favorites`

The favorites endpoints require the `DB` D1 binding. The public site remains local-first until an API base URL is deliberately configured and a sync action is invoked.
