/**
 * Error Handling Middleware
 * 
 * Centralized error handling for the Express application.
 */

/**
 * Error handler middleware
 * @param {Error} err - Error object
 * @param {object} req - Express request
 * @param {object} res - Express response
 * @param {function} next - Express next function
 */
export function errorHandler(err, req, res, next) {
  // Log the error for debugging
  console.error('Error:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method
  });
  
  // Handle validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: err.message
      }
    });
  }
  
  // Handle not found errors
  if (err.name === 'NotFoundError' || err.message.includes('not found')) {
    return res.status(404).json({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: err.message
      }
    });
  }
  
  // Handle duplicate key errors (if using a database)
  if (err.code === '23505' || err.message.includes('duplicate')) {
    return res.status(409).json({
      success: false,
      error: {
        code: 'DUPLICATE_ERROR',
        message: 'Resource already exists'
      }
    });
  }
  
  // Handle JSON parsing errors
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({
      success: false,
      error: {
        code: 'PARSE_ERROR',
        message: 'Invalid JSON in request body'
      }
    });
  }
  
  // Handle default errors (500 Internal Server Error)
  const statusCode = err.statusCode || 500;
  const message = statusCode === 500 
    ? 'An unexpected error occurred' 
    : err.message;
  
  res.status(statusCode).json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  });
}

/**
 * Not found handler for undefined routes
 * @param {object} req - Express request
 * @param {object} res - Express response
 */
export function notFoundHandler(req, res) {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: `Route ${req.method} ${req.path} not found`
    }
  });
}

/**
 * Async handler wrapper to catch errors in async route handlers
 * @param {function} fn - Async route handler function
 * @returns {function} Wrapped function
 */
export function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

export default {
  errorHandler,
  notFoundHandler,
  asyncHandler
};