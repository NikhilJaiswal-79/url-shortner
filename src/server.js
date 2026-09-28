/**
 * URL Shortener Server
 * 
 * A simple URL shortener service built to demonstrate all 7 Kiro lessons.
 */

import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { urlStore } from './models/urlStore.js';
import { errorHandler } from './middleware/errorHandler.js';
import urlsRouter from './routes/urls.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(join(__dirname, '..', 'public')));

// API Routes
app.use('/api/urls', urlsRouter);

// Redirect short code to original URL
app.get('/:shortCode', async (req, res, next) => {
  try {
    const { shortCode } = req.params;
    const urlEntry = urlStore.findByShortCode(shortCode);
    
    if (!urlEntry) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: `Short code '${shortCode}' not found`
        }
      });
    }
    
    // Increment click count
    urlStore.incrementClicks(shortCode);
    
    // Redirect to original URL
    return res.redirect(302, urlEntry.originalUrl);
  } catch (error) {
    next(error);
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    data: {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      totalUrls: urlStore.getAll().length
    }
  });
});

// Error handling middleware
app.use(errorHandler);

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: `Route ${req.method} ${req.path} not found`
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 URL Shortener Service running at http://localhost:${PORT}`);
  console.log(`📋 API Endpoints:`);
  console.log(`   POST   /api/urls          - Create short URL`);
  console.log(`   GET    /api/urls          - List all URLs`);
  console.log(`   GET    /api/urls/:code    - Get URL details`);
  console.log(`   DELETE /api/urls/:code    - Delete URL`);
  console.log(`   GET    /:shortCode        - Redirect to original URL`);
});

export default app;