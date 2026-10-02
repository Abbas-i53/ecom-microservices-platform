const express = require('express');
const rateLimit = require('express-rate-limit');
const app = express();
app.use(express.json());
app.use(rateLimit({ windowMs: 60000, max: 500 }));
app.get('/health', (req, res) => res.json({ ok: true, service: 'gateway' }));
// Simple proxy stubs - replace with http-proxy-middleware in prod
app.get('/api/products', async (req, res) => {
  try {
    const r = await fetch('http://catalog:3001/api/products');
    res.status(r.status).send(await r.text());
  } catch (e) { res.status(502).json({ error: 'catalog unavailable', fallback: [] }); }
});
app.listen(3000, () => console.log('gateway :3000'));
