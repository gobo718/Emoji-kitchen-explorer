const API_VERSION = '2.2.5';
const SCHEMA_VERSION = 1;

const corsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, PUT, OPTIONS',
  'access-control-allow-headers': 'content-type'
};

const json = (body, init = {}) => {
  const headers = new Headers(init.headers || {});
  headers.set('content-type', 'application/json; charset=utf-8');
  headers.set('cache-control', 'no-store');
  for (const [key, value] of Object.entries(corsHeaders)) headers.set(key, value);
  return new Response(JSON.stringify(body), {...init, headers});
};

const userIdFromPath = pathname => {
  const match = pathname.match(/^\/api\/users\/([^/]+)\/favorites$/);
  return match ? decodeURIComponent(match[1]) : null;
};

const validUserId = value => typeof value === 'string' && /^[A-Za-z0-9._:-]{1,128}$/.test(value);
const validFavorites = value => Array.isArray(value) && value.every(id => typeof id === 'string' && id.length > 0 && id.length <= 256);

const requireDb = env => {
  if (!env.DB) throw new Error('D1 database is not bound');
  return env.DB;
};

async function getFavorites(env, userId) {
  const db = requireDb(env);
  const result = await db.prepare(
    'SELECT mashup_id FROM mashup_progress WHERE user_id = ?1 AND favorite = 1 ORDER BY mashup_id'
  ).bind(userId).all();
  return (result.results || []).map(row => row.mashup_id);
}

async function putFavorites(env, userId, favorites) {
  const db = requireDb(env);
  const unique = [...new Set(favorites)];
  const statements = [
    db.prepare("INSERT INTO users (id, display_name) VALUES (?1, '') ON CONFLICT(id) DO UPDATE SET updated_at = CURRENT_TIMESTAMP").bind(userId),
    db.prepare('UPDATE mashup_progress SET favorite = 0, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?1 AND favorite = 1').bind(userId),
    ...unique.map(mashupId => db.prepare(
      `INSERT INTO mashup_progress (user_id, mashup_id, favorite, updated_at)
       VALUES (?1, ?2, 1, CURRENT_TIMESTAMP)
       ON CONFLICT(user_id, mashup_id) DO UPDATE SET favorite = 1, updated_at = CURRENT_TIMESTAMP`
    ).bind(userId, mashupId))
  ];
  await db.batch(statements);
  return unique.sort();
}

export default {
  async fetch(request, env = {}) {
    const url = new URL(request.url);

    if (request.method === 'OPTIONS') {
      return new Response(null, {status: 204, headers: {...corsHeaders, 'access-control-max-age': '86400'}});
    }

    if (request.method === 'GET' && url.pathname === '/api/health') {
      return json({
        ok: true,
        service: 'Billy Labs API',
        version: API_VERSION,
        schemaVersion: SCHEMA_VERSION,
        storage: env.DB ? 'd1-bound' : 'd1-not-bound'
      });
    }

    const userId = userIdFromPath(url.pathname);
    if (userId !== null) {
      if (!validUserId(userId)) return json({ok: false, error: 'Invalid user ID'}, {status: 400});
      try {
        if (request.method === 'GET') {
          return json({ok: true, userId, favorites: await getFavorites(env, userId)});
        }
        if (request.method === 'PUT') {
          const body = await request.json().catch(() => null);
          if (!body || !validFavorites(body.favorites)) return json({ok: false, error: 'favorites must be an array of mashup IDs'}, {status: 400});
          return json({ok: true, userId, favorites: await putFavorites(env, userId, body.favorites)});
        }
        return json({ok: false, error: 'Method not allowed'}, {status: 405, headers: {allow: 'GET, PUT'}});
      } catch (error) {
        const status = error.message === 'D1 database is not bound' ? 503 : 500;
        return json({ok: false, error: error.message}, {status});
      }
    }

    return json({ok: false, error: 'Not found', path: url.pathname}, {status: 404});
  }
};
