import test from 'node:test';
import assert from 'node:assert/strict';
import worker from '../src/index.js';

test('health endpoint identifies the Billy Labs API scaffold', async () => {
  const response = await worker.fetch(new Request('https://example.test/api/health'));
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), {
    ok: true,
    service: 'Billy Labs API',
    version: '2.2.2',
    storage: 'not-connected'
  });
});

test('unknown routes return structured JSON 404 responses', async () => {
  const response = await worker.fetch(new Request('https://example.test/api/missing'));
  assert.equal(response.status, 404);
  const body = await response.json();
  assert.equal(body.ok, false);
  assert.equal(body.path, '/api/missing');
});

test('preflight requests are accepted', async () => {
  const response = await worker.fetch(new Request('https://example.test/api/health', {method: 'OPTIONS'}));
  assert.equal(response.status, 204);
  assert.equal(response.headers.get('access-control-allow-origin'), '*');
});
