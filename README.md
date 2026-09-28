# URL Shortener Service

A complete URL Shortener Service built to demonstrate all **7 Kiro Lessons** in a practical, working application.

---

## 📚 Kiro Lessons Demonstrated

| Lesson | Concept | Location |
|--------|---------|----------|
| **Lesson 1** | Spec-driven Development | `spec/url-shortener.spec.md` |
| **Lesson 2** | Steering Documents | `.kiro/steering/project-standards.md` |
| **Lesson 3** | Hooks | `.kiro/hooks/*.json` |
| **Lesson 4** | Property-based Testing | `tests/property/*.test.js` |
| **Lesson 5** | Powers | `power.json` |
| **Lesson 6** | Model Context Protocol (MCP) | `.kiro/settings/mcp.json` |
| **Lesson 7** | Custom Agents | `.kiro/agents/code-reviewer.json` |
| **Bonus Lesson 2** | Package a Kiro Power | `.kiro/power/` |

---

## 🚀 Quick Start

```bash
# Install dependencies
cd url-shortener
npm install

# Start the server
npm start

# Open browser to
http://localhost:3000
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/urls` | Create short URL |
| GET | `/api/urls` | List all URLs |
| GET | `/api/urls/:code` | Get URL details |
| GET | `/:code` | Redirect to original URL |
| DELETE | `/api/urls/:code` | Delete URL |

---

## Project Structure

```
url-shortener/
├── src/                      # Source code
│   ├── server.js            # Express server
│   ├── routes/urls.js       # API routes
│   ├── models/urlStore.js   # Data store
│   └── middleware/          # Validation & error handling
├── public/                   # Frontend assets
│   └── index.html           # Web UI
├── tests/                    # Tests
│   ├── unit/                # Unit tests (Jest)
│   └── property/            # Property-based tests (fast-check)
├── spec/                     # Feature specifications
│   └── url-shortener.spec.md
├── .kiro/                    # Kiro configuration
│   ├── steering/            # Project standards
│   ├── hooks/               # Automated actions
│   ├── agents/              # Custom agents
│   ├── settings/            # MCP configuration
│   └── power/               # BONUS: Publishable Kiro Power
├── power.json               # Kiro Power reference
├── package.json
└── README.md
```

---

## Running Tests

```bash
# All tests with coverage
npm test

# Unit tests only
npm run test:unit

# Property-based tests only
npm run test:property

# Linting
npm run lint
```

---

## Key Files by Lesson

### Lesson 1: Spec-driven Development
**File:** `spec/url-shortener.spec.md`
- User stories with acceptance criteria
- API endpoint documentation
- Implementation task breakdown

### Lesson 2: Steering Documents
**File:** `.kiro/steering/project-standards.md`
- JavaScript coding standards
- REST API response format
- Testing requirements

### Lesson 3: Hooks
**Files:**
- `.kiro/hooks/lint-on-save.json` - Lint on save
- `.kiro/hooks/test-on-save.json` - Test on save
- `.kiro/hooks/write-review.json` - Pre-write review

### Lesson 4: Property-based Testing
**Files:**
- `tests/property/urlGenerator.test.js` - fast-check tests
- `tests/property/README.md` - Property testing guide

### Lesson 5: Powers
**File:** `power.json`
- `@url-shortener/todo` - Task tracking
- `@url-shortener/jsdoc` - Documentation

### Lesson 6: MCP
**File:** `.kiro/settings/mcp.json`
- `url-validator` - URL validation server
- `aws-docs` - AWS documentation
- `rest-api-tools` - REST API testing

### Lesson 7: Custom Agents
**File:** `.kiro/agents/code-reviewer.json`
- Read-only code review agent
- Security-focused analysis
- Restricted tool access

### Bonus Lesson 2: Package a Kiro Power
**Folder:** `.kiro/power/`
- Complete power structure with package.json
- Skills documentation (api-development.md)
- Templates (express-server.js, url-store.js)
- Examples with different complexity levels
- Ready to publish to Kiro Power Registry

---

## Publishing as a Kiro Power

This project includes a complete, publishable Kiro Power:

```bash
# Navigate to power directory
cd .kiro/power/

# The power package is ready with:
# - package.json - NPM metadata
# - power.json - Kiro power configuration  
# - README.md - Documentation
# - skills/ - Skill definitions
# - templates/ - Code templates
# - examples/ - Example implementations

# To publish:
# 1. Push to a public GitHub repository
# 2. Submit to https://registry.kiro.dev
```

---

## Usage Examples

### Create a Short URL (cURL)

```bash
curl -X POST http://localhost:3000/api/urls \
  -H "Content-Type: application/json" \
  -d '{"originalUrl": "https://example.com/very/long/url/path"}'
```

### Response

```json
{
  "success": true,
  "data": {
    "id": "abc123...",
    "originalUrl": "https://example.com/very/long/url/path",
    "shortCode": "xyz7ab12",
    "shortUrl": "http://localhost:3000/xyz7ab12",
    "createdAt": "2026-09-28T12:00:00.000Z",
    "clicks": 0
  }
}
```

---

## Technologies Used

- **Node.js** - Runtime
- **Express** - Web framework
- **nanoid** - Short code generation
- **valid-url** - URL validation
- **Jest** - Unit testing
- **fast-check** - Property-based testing
- **ESLint** - Code linting

---

## License

MIT

---

## Learn More

- [Kiro Documentation](https://docs.kiro.dev)
- [Kiro Powers Registry](https://registry.kiro.dev)
- [MCP Documentation](https://docs.modelcontextprotocol.dev)