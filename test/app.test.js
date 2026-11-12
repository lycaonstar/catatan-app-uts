const { test, before, after } = require('node:test');
const assert = require('node:assert');
const { createApp } = require('../src/app');

let server;
let base;

before(async () => {
  server = createApp().listen(0);
  base = `http://127.0.0.1:${server.address().port}`;
});

after(() => server.close());

test('GET /health mengembalikan status ok', async () => {
  const res = await fetch(`${base}/health`);
  assert.strictEqual(res.status, 200);
  assert.strictEqual((await res.json()).status, 'ok');
});

test('POST /api/notes membuat catatan', async () => {
  const res = await fetch(`${base}/api/notes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: 'Belajar Docker' }),
  });
  assert.strictEqual(res.status, 201);
  const note = await res.json();
  assert.strictEqual(note.text, 'Belajar Docker');
});

test('POST /api/notes menolak teks kosong', async () => {
  const res = await fetch(`${base}/api/notes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: '  ' }),
  });
  assert.strictEqual(res.status, 400);
});

test('DELETE /api/notes/:id menghapus dan 404 bila tidak ada', async () => {
  const created = await (await fetch(`${base}/api/notes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: 'hapus aku' }),
  })).json();
  assert.strictEqual((await fetch(`${base}/api/notes/${created.id}`, { method: 'DELETE' })).status, 204);
  assert.strictEqual((await fetch(`${base}/api/notes/${created.id}`, { method: 'DELETE' })).status, 404);
});
