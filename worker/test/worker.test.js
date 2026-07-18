import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import worker from '../src/index.js';

const makeDb = (seed = []) => {
  let favorites = [...seed];
  return {
    prepare(sql) {
      return {
        bind(...args) {
          return {
            sql, args,
            async all() { return {results: favorites.map(mashup_id => ({mashup_id}))}; },
            async run() { return {success: true}; }
          };
        }
      };
    },
    async batch(statements) {
      const inserted = statements.filter(s => /INSERT INTO mashup_progress/.test(s.sql)).map(s => s.args[1]);
      favorites = [...new Set(inserted)];
      return statements.map(() => ({success: true}));
    },
    snapshot: () => [...favorites]
  };
};

test('health endpoint reports the D1-ready API state', async () => {
  const response = await worker.fetch(new Request('https://example.test/api/health'));
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), {ok:true, service:'Billy Labs API', version:'2.2.4', schemaVersion:1, storage:'d1-not-bound'});
});

test('favorites can be read from D1', async () => {
  const db = makeDb(['frog+moon', 'cat+star']);
  const response = await worker.fetch(new Request('https://example.test/api/users/device-1/favorites'), {DB: db});
  assert.equal(response.status, 200);
  assert.deepEqual((await response.json()).favorites, ['frog+moon', 'cat+star']);
});

test('favorites can be replaced in D1', async () => {
  const db = makeDb(['old']);
  const response = await worker.fetch(new Request('https://example.test/api/users/device-1/favorites', {method:'PUT', body:JSON.stringify({favorites:['new-a','new-b','new-a']}), headers:{'content-type':'application/json'}}), {DB: db});
  assert.equal(response.status, 200);
  assert.deepEqual((await response.json()).favorites, ['new-a','new-b']);
  assert.deepEqual(db.snapshot(), ['new-a','new-b']);
});

test('favorites endpoint rejects invalid payloads and missing D1', async () => {
  const bad = await worker.fetch(new Request('https://example.test/api/users/device-1/favorites', {method:'PUT', body:'{}', headers:{'content-type':'application/json'}}), {DB:makeDb()});
  assert.equal(bad.status, 400);
  const missing = await worker.fetch(new Request('https://example.test/api/users/device-1/favorites'));
  assert.equal(missing.status, 503);
});

test('initial migration defines the cloud persistence domains', () => {
  const sql = fs.readFileSync(path.resolve('migrations/0001_initial.sql'), 'utf8');
  for (const table of ['users','user_settings','mashup_progress','blurblet_votes','collections','collection_items','curator_blurblets']) assert.match(sql, new RegExp(`CREATE TABLE IF NOT EXISTS ${table}\\b`));
});

test('unknown routes and preflight are handled', async () => {
  const response = await worker.fetch(new Request('https://example.test/api/missing'));
  assert.equal(response.status, 404);
  const preflight = await worker.fetch(new Request('https://example.test/api/health', {method:'OPTIONS'}));
  assert.equal(preflight.status, 204);
  assert.match(preflight.headers.get('access-control-allow-methods'), /PUT/);
});
