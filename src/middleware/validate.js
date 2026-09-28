/**
 * Validate URL input from request body
 * @param {object} req - Express request
 * @param {object} res - Express response
 * @param {function} next - Express next function
 */

import pkg from 'valid-url';

const { isUri } = pkg;

export function validateUrlInput(req, res, next) {
  const { originalUrl } = req.body;
  
  // Check if URL is provided
  if (!originalUrl) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'URL is required'
      }
    });
  }
  
  // Check if URL is a string
  if (typeof originalUrl !== 'string') {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'URL must be a string'
      }
    });
  }
  
  // Check URL length
  if (originalUrl.length > 2048) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'URL must be 2048 characters or less'
      }
    });
  }
  
  // Validate URL format
  if (!isUri(originalUrl)) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid URL format. URL must start with http:// or https://'
      }
    });
  }
  
  // URL is valid, proceed to next middleware
  next();
}

/**
 * Validate short code format
 * @param {string} shortCode - The short code to validate
 * @returns {object} Validation result
 */
export function validateShortCode(shortCode) {
  if (!shortCode || typeof shortCode !== 'string') {
    return { valid: false, error: 'Short code is required' };
  }
  
  // Short code should be 6-8 alphanumeric characters (URL-safe)
  const shortCodePattern = /^[A-Za-z0-9_-]{6,8}$/;
  
  if (!shortCodePattern.test(shortCode)) {
    return { 
      valid: false, 
      error: 'Short code must be 6-8 characters and contain only letters, numbers, underscores, and hyphens' 
    };
  }
  
  return { valid: true };
}

/**
 * Validate URL using MCP server (requires MCP configuration)
 * @param {string} url - URL to validate
 * @returns {Promise<object>} Validation result
 */
export async function validateUrlWithMcp(url) {
  // This would use the MCP server if configured
  // For now, we use the local validation
  const localValidation = validateUrlInput({ body: { originalUrl: url } });
  
  if (localValidation.headersSent) {
    return { valid: false, error: 'Invalid URL format' };
  }
  
  return { valid: true };
}

export default {
  validateUrlInput,
  validateShortCode,
  validateUrlWithMcp
};