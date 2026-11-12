const express = require('express');
const path = require('path');

function createApp() {
  const app = express();
  app.use(express.json());
  app.use(express.static(path.join(__dirname, '..', 'public')));

  let notes = [];
  let nextId = 1;

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', version: process.env.APP_VERSION || 'dev' });
  });

  app.get('/api/notes', (_req, res) => res.json(notes));

  app.post('/api/notes', (req, res) => {
    const text = (req.body && req.body.text || '').trim();
    if (!text) return res.status(400).json({ error: 'text wajib diisi' });
    const note = { id: nextId++, text, createdAt: new Date().toISOString() };
    notes.push(note);
    res.status(201).json(note);
  });

  app.delete('/api/notes/:id', (req, res) => {
    const id = Number(req.params.id);
    const before = notes.length;
    notes = notes.filter((n) => n.id !== id);
    if (notes.length === before) return res.status(404).json({ error: 'tidak ditemukan' });
    res.status(204).end();
  });

  return app;
}

module.exports = { createApp };
