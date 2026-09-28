/**
 * In-memory URL Store
 * 
 * Simple in-memory data store for URL shortener.
 * In production, replace with a database (PostgreSQL, MongoDB, Redis).
 */

import { nanoid } from 'nanoid';
import pkg from 'valid-url';

const { isUri } = pkg;

// In-memory storage
const urls = new Map();
const shortCodeIndex = new Map();

/**
 * Generate a unique short code
 * @param {number} length - Length of the short code (default: 8)
 * @returns {string} Unique short code
 */
function generateUniqueShortCode(length = 8) {
  let shortCode;
  let attempts = 0;
  const maxAttempts = 100;
  
  do {
    shortCode = nanoid(length);
    attempts++;
  } while (shortCodeIndex.has(shortCode) && attempts < maxAttempts);
  
  if (shortCodeIndex.has(shortCode)) {
    throw new Error('Failed to generate unique short code');
  }
  
  return shortCode;
}

/**
 * Create a new shortened URL
 * @param {string} originalUrl - The long URL to shorten
 * @returns {object} URL entry with short code
 */
function create(originalUrl) {
  // Validate URL
  if (!originalUrl || typeof originalUrl !== 'string') {
    throw new ValidationError('URL is required');
  }
  
  if (!isUri(originalUrl)) {
    throw new ValidationError('Invalid URL format');
  }
  
  // Generate unique short code
  const shortCode = generateUniqueShortCode(8);
  
  // Create URL entry
  const urlEntry = {
    id: nanoid(16),
    originalUrl,
    shortCode,
    shortUrl: `http://localhost:3000/${shortCode}`,
    createdAt: new Date(),
    clicks: 0
  };
  
  // Store the entry
  urls.set(urlEntry.id, urlEntry);
  shortCodeIndex.set(shortCode, urlEntry.id);
  
  return urlEntry;
}

/**
 * Find a URL entry by short code
 * @param {string} shortCode - The short code to look up
 * @returns {object|null} URL entry or null if not found
 */
function findByShortCode(shortCode) {
  if (!shortCode || typeof shortCode !== 'string') {
    return null;
  }
  
  const id = shortCodeIndex.get(shortCode);
  if (!id) {
    return null;
  }
  
  return urls.get(id) || null;
}

/**
 * Find a URL entry by ID
 * @param {string} id - The URL entry ID
 * @returns {object|null} URL entry or null if not found
 */
function findById(id) {
  return urls.get(id) || null;
}

/**
 * Get all URL entries
 * @returns {Array} Array of all URL entries
 */
function getAll() {
  return Array.from(urls.values());
}

/**
 * Update a URL entry
 * @param {string} id - The URL entry ID
 * @param {object} updates - Fields to update
 * @returns {object|null} Updated entry or null if not found
 */
function update(id, updates) {
  const entry = urls.get(id);
  if (!entry) {
    return null;
  }
  
  // Only allow updating certain fields
  if (updates.originalUrl) {
    if (!isValidUrl(updates.originalUrl)) {
      throw new ValidationError('Invalid URL format');
    }
    entry.originalUrl = updates.originalUrl;
  }
  
  entry.updatedAt = new Date();
  urls.set(id, entry);
  
  return entry;
}

/**
 * Delete a URL entry
 * @param {string} id - The URL entry ID
 * @returns {boolean} True if deleted, false if not found
 */
function remove(id) {
  const entry = urls.get(id);
  if (!entry) {
    return false;
  }
  
  // Remove from index
  shortCodeIndex.delete(entry.shortCode);
  
  // Remove from storage
  urls.delete(id);
  
  return true;
}

/**
 * Delete a URL entry by short code
 * @param {string} shortCode - The short code
 * @returns {boolean} True if deleted, false if not found
 */
function removeByShortCode(shortCode) {
  const id = shortCodeIndex.get(shortCode);
  if (!id) {
    return false;
  }
  
  return remove(id);
}

/**
 * Increment click count for a URL
 * @param {string} shortCode - The short code
 * @returns {object|null} Updated entry or null if not found
 */
function incrementClicks(shortCode) {
  const id = shortCodeIndex.get(shortCode);
  if (!id) {
    return null;
  }
  
  const entry = urls.get(id);
  if (!entry) {
    return null;
  }
  
  entry.clicks = (entry.clicks || 0) + 1;
  urls.set(id, entry);
  
  return entry;
}

/**
 * Get URL statistics
 * @returns {object} Statistics about the URL store
 */
function getStats() {
  const allUrls = getAll();
  const totalClicks = allUrls.reduce((sum, url) => sum + url.clicks, 0);
  
  return {
    totalUrls: allUrls.length,
    totalClicks,
    mostClicked: allUrls.sort((a, b) => b.clicks - a.clicks)[0] || null
  };
}

// Custom error class
class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
  }
}

// Export the store interface
export const urlStore = {
  create,
  findByShortCode,
  findById,
  getAll,
  update,
  remove,
  removeByShortCode,
  incrementClicks,
  getStats,
  // Export for testing
  _generateUniqueShortCode: generateUniqueShortCode
};

// Also export as default for convenience
export default urlStore;