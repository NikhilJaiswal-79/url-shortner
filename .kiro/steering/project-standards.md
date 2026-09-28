---
inclusion: auto
name: URL Shortener Standards
description: Coding standards and conventions for the URL Shortener project
---

# Project Steering Document

**Lesson 2: Steering Documents**

This document provides persistent context for Kiro about the URL Shortener project's standards and conventions.

---

## JavaScript Coding Standards

### ES Modules
- Use ES modules (`import`/`export`) instead of CommonJS
- Always specify file extensions in imports: `import routes from './routes/urls.js'`
- Avoid default exports for utility modules; prefer named exports

### Async/Await Pattern
- Always use `async/await` for asynchronous operations
- Wrap async calls in try/catch blocks
- Never leave promises dangling without handling rejection

```javascript
// ✅ Correct
async function createUrl(originalUrl) {
  try {
    const result = await urlStore.insert(originalUrl);
    return result;
  } catch (error) {
    throw new Error(`Failed to create URL: ${error.message}`);
  }
}

// ❌ Avoid
function createUrl(originalUrl) {
  return urlStore.insert(originalUrl); // No error handling
}
```

### Variable Declarations
- Use `const` by default
- Only use `let` when reassignment is required
- Never use `var`

### Arrow Functions
- Use arrow functions for callbacks and short functions
- Use function declarations for methods that need `this` binding

---

## REST API Response Standards

### Success Responses

```javascript
// POST (Created)
{
  success: true,
  data: {
    originalUrl: "https://example.com/very/long/url",
    shortCode: "abc123",
    shortUrl: "http://localhost:3000/abc123"
  }
}

// GET List
{
  success: true,
  data: [
    { originalUrl: "...", shortCode: "...", ... }
  ],
  count: 5
}
```

### Error Responses

```javascript
{
  success: false,
  error: {
    code: "VALIDATION_ERROR",
    message: "Invalid URL format"
  }
}
```

### HTTP Status Codes
- `200` - OK (successful read)
- `201` - Created (successful creation)
- `302` - Found (redirect)
- `400` - Bad Request (validation error)
- `404` - Not Found (resource doesn't exist)
- `500` - Internal Server Error

---

## URL Validation Rules

Use `valid-url` library for URL validation:

```javascript
import { isUri } from 'valid-url';

function validateUrl(url) {
  if (!url || typeof url !== 'string') {
    return { valid: false, error: 'URL is required' };
  }
  if (!isUri(url)) {
    return { valid: false, error: 'Invalid URL format' };
  }
  return { valid: true };
}
```

Valid URL requirements:
- Must include protocol (http:// or https://)
- Must have a valid domain or IP
- Maximum length: 2048 characters

---

## Short Code Generation

Use `nanoid` for generating short codes:

```javascript
import { nanoid } from 'nanoid';

function generateShortCode(length = 8) {
  return nanoid(length);
}
```

Requirements:
- Length: 8 characters (adjustable)
- Character set: URL-safe alphanumeric (A-Za-z0-9_-)
- Uniqueness: Always check for collisions

---

## Error Handling Middleware

Always use centralized error handling:

```javascript
// src/middleware/errorHandler.js
export function errorHandler(err, req, res, next) {
  console.error('Error:', err.message);

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: { code: 'VALIDATION_ERROR', message: err.message }
    });
  }

  if (err.name === 'NotFoundError') {
    return res.status(404).json({
      success: false,
      error: { code: 'NOT_FOUND', message: err.message }
    });
  }

  return res.status(500).json({
    success: false,
    error: { code: 'INTERNAL_ERROR', message: 'An unexpected error occurred' }
  });
}
```

---

## Testing Standards

### Unit Tests (Jest)
- Place tests in `tests/unit/` directory
- Naming: `*.test.js` or `*.spec.js`
- Coverage target: >80%

```javascript
// tests/unit/urlGenerator.test.js
import { generateShortCode } from '../../src/utils/generator.js';

describe('generateShortCode', () => {
  it('should generate 8-character code', () => {
    const code = generateShortCode();
    expect(code).toHaveLength(8);
  });

  it('should generate unique codes', () => {
    const codes = new Set();
    for (let i = 0; i < 100; i++) {
      codes.add(generateShortCode());
    }
    expect(codes.size).toBe(100);
  });
});
```

### Property-Based Tests (fast-check)
- Place tests in `tests/property/` directory
- Test invariants: uniqueness, format consistency, data integrity

```javascript
// tests/property/urlInvariant.test.js
import { fc } from 'fast-check';

describe('URL Model Properties', () => {
  it('should always have valid short codes', () => {
    fc.assert(
      fc.property(fc.string(), (originalUrl) => {
        const url = createUrlModel(originalUrl);
        expect(url.shortCode).toMatch(/^[A-Za-z0-9_-]{8}$/);
      })
    );
  });
});
```

---

## File Organization

```
src/
├── server.js           # Entry point
├── routes/
│   └── urls.js        # URL routes
├── models/
│   └── urlStore.js    # In-memory data store
├── middleware/
│   └── validate.js    # Validation middleware
└── utils/
    └── generator.js   # Short code generator

tests/
├── unit/              # Unit tests
└── property/          # Property-based tests

.kiro/
├── steering/
│   └── project-standards.md
├── hooks/
├── agents/
└── settings/
```

---

## Naming Conventions

| Component | Convention | Example |
|-----------|------------|---------|
| Files | kebab-case | `url-store.js` |
| Functions | camelCase | `createShortUrl()` |
| Constants | SCREAMING_SNAKE_CASE | `DEFAULT_CODE_LENGTH` |
| Classes | PascalCase | `UrlService` |
| Database fields | snake_case | `original_url` |
| API fields | camelCase | `shortCode` |

---

## Import Ordering

```javascript
// 1. Node.js built-in modules
import path from 'path';
import { fileURLToPath } from 'url';

// 2. Third-party packages
import express from 'express';
import { nanoid } from 'nanoid';
import { isUri } from 'valid-url';

// 3. Local modules (relative imports)
import { errorHandler } from './middleware/errorHandler.js';
import { urlStore } from './models/urlStore.js';
```

---

## Git Commit Messages

Format: `type(scope): description`

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (no logic change)
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

Examples:
- `feat(api): add delete URL endpoint`
- `fix(validation): handle empty URL input`
- `test(property): add uniqueness property test`

---

## Remember

1. Always validate inputs before processing
2. Handle errors gracefully with meaningful messages
3. Write tests for new functionality
4. Keep functions small and focused
5. Document complex logic with comments