const path = require('path');
const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Simple health check
app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'decent-credit-score', time: new Date().toISOString() });
});

// Credit score demo API
app.use('/api/score', require('./routes/score'));

// Serve static frontend (built by Vite) in production
const distPath = path.join(__dirname, '..', 'client', 'dist');
app.use(express.static(distPath));

// For any other path, serve index.html (SPA)
app.get('*', (_req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server listening on http://localhost:${PORT}`);
});
