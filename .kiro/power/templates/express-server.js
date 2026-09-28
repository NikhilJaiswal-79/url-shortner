/**
 * Express Server Template for URL Shortener
 * 
 * Copy this to your project and customize as needed.
 */

import express from 'express';
import { nanoid } from 'nanoid';
import { isUri } from 'valid-url';

const app = express();
app.use(express.json());

// In-memory storage (replace with database in production)
const urlStore = new Map();
const shortCodeIndex = new Map();

// Helper: Generate unique short code
function generateShortCode(length = 8) {
  let code;
  do {
    code = nanoid(length);
  } while (shortCodeIndex.has(code));
  return code;
}

// Routes
app.post('/api/urls', (req, res) => {
  const { originalUrl } = req.body;
  
  if (!isUri(originalUrl)) {
    return res.status(400).json({
      success: false,
      error: { code: 'INVALID_URL', message: 'Invalid URL format' }
    });
  }
  
  const shortCode = generateShortCode();
  const entry = {
    id: nanoid(16),
    originalUrl,
    shortCode,
    shortUrl: `http://localhost:3000/${shortCode}`,
    createdAt: new Date(),
    clicks: 0
  };
  
  urlStore.set(entry.id, entry);
  shortCodeIndex.set(shortCode, entry.id);
  
  res.status(201).json({ success: true, data: entry });
});

app.get('/api/urls', (req, res) => {
  res.json({
    success: true,
    data: Array.from(urlStore.values()),
    count: urlStore.size
  });
});

app.get('/api/urls/:code', (req, res) => {
  const { code } = req.params;
  const id = shortCodeIndex.get(code);
  const entry = urlStore.get(id);
  
  if (!entry) {
    return res.status(404).json({
      success: false,
      error: { code: 'NOT_FOUND', message: 'Short code not found' }
    });
  }
  
  res.json({ success: true, data: entry });
});

app.get('/:code', (req, res) => {
  const { code } = req.params;
  const id = shortCodeIndex.get(code);
  const entry = urlStore.get(id);
  
  if (!entry) {
    return res.status(404).send('URL not found');
  }
  
  // Increment clicks
  entry.clicks++;
  urlStore.set(entry.id, entry);
  
  // Redirect
  res.redirect(302, entry.originalUrl);
});

app.delete('/api/urls/:code', (req, res) => {
  const { code } = req.params;
  const id = shortCodeIndex.get(code);
  
  if (!id) {
    return res.status(404).json({
      success: false,
      error: { code: 'NOT_FOUND', message: 'Short code not found' }
    });
  }
  
  urlStore.delete(id);
  shortCodeIndex.delete(code);
  
  res.json({ success: true, message: 'URL deleted' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: { code: 'INTERNAL_ERROR', message: 'Something went wrong!' }
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

export default app;