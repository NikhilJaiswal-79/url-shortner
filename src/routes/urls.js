/**
 * URL Routes
 * 
 * REST API endpoints for URL shortening operations.
 */

import { Router } from 'express';
import { urlStore } from '../models/urlStore.js';
import { validateUrlInput } from '../middleware/validate.js';

const router = Router();

/**
 * POST /api/urls
 * Create a new shortened URL
 */
router.post('/', validateUrlInput, async (req, res, next) => {
  try {
    const { originalUrl } = req.body;
    
    // Check if URL already exists
    const existingUrls = urlStore.getAll();
    const existing = existingUrls.find(u => u.originalUrl === originalUrl);
    
    if (existing) {
      return res.status(200).json({
        success: true,
        data: existing,
        message: 'URL already shortened'
      });
    }
    
    // Create new shortened URL
    const urlEntry = urlStore.create(originalUrl);
    
    res.status(201).json({
      success: true,
      data: urlEntry
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/urls
 * List all shortened URLs
 */
router.get('/', (req, res, next) => {
  try {
    const urls = urlStore.getAll();
    
    res.json({
      success: true,
      data: urls,
      count: urls.length
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/urls/:shortCode
 * Get details for a specific shortened URL
 */
router.get('/:shortCode', (req, res, next) => {
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
    
    res.json({
      success: true,
      data: urlEntry
    });
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/urls/:shortCode
 * Update the original URL for a short code
 */
router.put('/:shortCode', validateUrlInput, (req, res, next) => {
  try {
    const { shortCode } = req.params;
    const { originalUrl } = req.body;
    
    const id = findIdByShortCode(shortCode);
    if (!id) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: `Short code '${shortCode}' not found`
        }
      });
    }
    
    const updated = urlStore.update(id, { originalUrl });
    
    res.json({
      success: true,
      data: updated
    });
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/urls/:shortCode
 * Delete a shortened URL
 */
router.delete('/:shortCode', (req, res, next) => {
  try {
    const { shortCode } = req.params;
    
    const deleted = urlStore.removeByShortCode(shortCode);
    
    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: `Short code '${shortCode}' not found`
        }
      });
    }
    
    res.json({
      success: true,
      message: `URL with short code '${shortCode}' deleted successfully`
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/urls/:shortCode/stats
 * Get statistics for a specific shortened URL
 */
router.get('/:shortCode/stats', (req, res, next) => {
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
    
    res.json({
      success: true,
      data: {
        shortCode: urlEntry.shortCode,
        originalUrl: urlEntry.originalUrl,
        clicks: urlEntry.clicks,
        createdAt: urlEntry.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Helper function to find ID by short code
 */
function findIdByShortCode(shortCode) {
  const allUrls = urlStore.getAll();
  const url = allUrls.find(u => u.shortCode === shortCode);
  return url ? url.id : null;
}

export default router;