# URL Shortener Service - Feature Specification

**Lesson 1: Spec-driven Development**

## Overview

A URL Shortener Service that converts long URLs into compact, shareable short links. Built to demonstrate all 7 Kiro lessons in a practical, working application.

---

## User Stories

### US-001: Shorten a URL
As a user, I want to submit a long URL and receive a shortened version so that I can share it easily.

**Acceptance Criteria:**
- Given a valid long URL, when I POST to `/api/urls`, then I receive a short code and short URL
- Given an invalid URL, when I POST to `/api/urls`, then I receive a 400 error with validation message
- The short code is 6-8 alphanumeric characters
- Short URLs are unique (no duplicates)

### US-002: Redirect to Original URL
As a user, I want to visit a short URL and be redirected to the original long URL.

**Acceptance Criteria:**
- Given a valid short code, when I GET `/:shortCode`, then I receive a 302 redirect to the original URL
- Given an invalid short code, when I GET `/:shortCode`, then I receive a 404 error

### US-003: List All URLs
As a user, I want to see all the URLs I've created.

**Acceptance Criteria:**
- When I GET `/api/urls`, then I receive an array of all stored URLs
- Each URL entry includes: original URL, short code, created timestamp, click count

### US-004: Get URL Details
As a user, I want to get details about a specific shortened URL.

**Acceptance Criteria:**
- Given a valid short code, when I GET `/api/urls/:shortCode`, then I receive the full URL details
- The response includes click count and creation date

### US-005: Delete a URL
As a user, I want to delete a shortened URL.

**Acceptance Criteria:**
- Given a valid short code, when I DELETE `/api/urls/:shortCode`, then the URL is removed
- After deletion, accessing the short URL returns 404

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/urls` | Create a new shortened URL |
| GET | `/api/urls` | List all URLs |
| GET | `/api/urls/:shortCode` | Get URL details |
| GET | `/:shortCode` | Redirect to original URL |
| DELETE | `/api/urls/:shortCode` | Delete a URL |

---

## Data Model

```javascript
{
  id: String,           // unique identifier (auto-generated)
  originalUrl: String,  // the long URL
  shortCode: String,    // 6-8 char code (e.g., "abc123")
  shortUrl: String,     // full short URL
  createdAt: Date,      // creation timestamp
  clicks: Number        // redirect counter (default: 0)
}
```

---

## Implementation Tasks

### Phase 1: Foundation
- [ ] TASK-001: Set up Express server with basic routing
- [ ] TASK-002: Create in-memory URL store (model)
- [ ] TASK-003: Implement short code generator utility

### Phase 2: Core Features
- [ ] TASK-004: Implement POST /api/urls (create short URL)
- [ ] TASK-005: Implement GET /:shortCode (redirect)
- [ ] TASK-006: Implement GET /api/urls (list all)
- [ ] TASK-007: Implement GET /api/urls/:shortCode (details)
- [ ] TASK-008: Implement DELETE /api/urls/:shortCode (delete)

### Phase 3: Validation & Error Handling
- [ ] TASK-009: Add URL validation middleware
- [ ] TASK-010: Add proper error responses (400, 404)

### Phase 4: Testing
- [ ] TASK-011: Write unit tests for core functionality
- [ ] TASK-012: Write property-based tests for invariants

### Phase 5: Frontend
- [ ] TASK-013: Create simple HTML UI
- [ ] TASK-014: Add JavaScript to call the API

---

## Non-Functional Requirements

- **Performance:** Redirects should complete in < 100ms
- **Validation:** Reject malformed URLs
- **Uniqueness:** Short codes must be unique
- **Error Handling:** Graceful 404 for missing codes

---

## Kiro Lessons Demonstrated

| Lesson | Implementation |
|--------|----------------|
| 1. Spec-driven | This spec document |
| 2. Steering | `.kiro/steering/project-standards.md` |
| 3. Hooks | `.kiro/hooks/` - lint, test hooks |
| 4. Property-based tests | `tests/property/` - fast-check tests |
| 5. Powers | `power.json` - task tracking |
| 6. MCP | `.kiro/settings/mcp.json` - external tools |
| 7. Custom agents | `.kiro/agents/code-reviewer.json` |

---

## Success Criteria

- [ ] All 7 Kiro lessons are implemented
- [ ] API endpoints work as specified
- [ ] Unit tests pass with >80% coverage
- [ ] Property-based tests verify invariants
- [ ] `.kiro/` folder is in the repository