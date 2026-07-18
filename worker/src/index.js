const API_VERSION = '2.2.3';
const SCHEMA_VERSION = 1;

const json = (body, init = {}) => {
  const headers = new Headers(init.headers || {});
  headers.set('content-type', 'application/json; charset=utf-8');
  headers.set('cache-control', 'no-store');
  headers.set('access-control-allow-origin', '*');
  headers.set('access-control-allow-methods', 'GET, OPTIONS');
  headers.set('access-control-allow-headers', 'content-type');
  return new Response(JSON.stringify(body), {...init, headers});
};

export default {
  async fetch(request, env = {}) {
    const url = new URL(request.url);

    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'access-control-allow-origin': '*',
          'access-control-allow-methods': 'GET, OPTIONS',
          'access-control-allow-headers': 'content-type',
          'access-control-max-age': '86400'
        }
      });
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

    return json({ok: false, error: 'Not found', path: url.pathname}, {status: 404});
  }
};
