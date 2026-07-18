import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import worker from '../src/index.js';

test('health endpoint reports the D1-ready API state', async () => {
  const response = await worker.fetch(new Request('https://example.test/api/health'));
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), {
    ok: true,
    service: 'Billy Labs API',
    version: '2.2.3',
    schemaVersion: 1,
    storage: 'd1-not-bound'
  });
});

test('health endpoint detects a D1 binding', async () => {
  const response = await worker.fetch(new Request('https://example.test/api/health'), {DB: {}});
  assert.equal((await response.json()).storage, 'd1-bound');
});

test('initial migration defines the cloud persistence domains', () => {
  const sql = fs.readFileSync(path.resolve('migrations/0001_initial.sql'), 'utf8');
  for (const table of ['users', 'user_settings', 'mashup_progress', 'blurblet_votes', 'collections', 'collection_items', 'curator_blurblets']) {
    assert.match(sql, new RegExp(`CREATE TABLE IF NOT EXISTS ${table}\\b`));
  }
  assert.match(sql, /PRIMARY KEY \(user_id, mashup_id\)/);
  assert.match(sql, /FOREIGN KEY \(user_id\) REFERENCES users\(id\) ON DELETE CASCADE/);
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
