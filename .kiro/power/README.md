# @kiro/url-shortener-power

**Bonus Lesson 2: Package a Kiro Power**

A complete Kiro Power for building URL Shortener services with Node.js and Express.

---

## What is This?

This is a **Kiro Power** - a shareable package that bundles:
- Tools for URL shortener development
- Skills (knowledge domains)
- Best practices and patterns
- Example code and templates

---

## Installing

### Option 1: From GitHub (Recommended for Development)

```bash
# Clone to your Kiro powers directory
cd ~/.kiro/powers/
git clone https://github.com/yourusername/kiro-url-shortener-power.git @kiro/url-shortener-power

# Or symlink for development
cd ~/.kiro/powers/
git clone https://github.com/yourusername/kiro-url-shortener-power.git
ln -s kiro-url-shortener-power @kiro/url-shortener-power
```

### Option 2: From Local Development

```bash
cd ~/.kiro/powers/
# Create a symlink to your development folder
mklink /J @kiro\url-shortener-power e:\kiro\url-shortener\.kiro\power
```

Windows PowerShell:
```powershell
New-Item -ItemType Junction -Path "$env:USERPROFILE\.kiro\powers\@kiro\url-shortener-power" -Target "e:\kiro\url-shortener\.kiro\power"
```

### Option 3: Submit to Kiro Power Registry

1. Push this folder to a public GitHub repository
2. Submit to [Kiro Power Registry](https://registry.kiro.dev)
3. Users can then install with: `kiro power install @kiro/url-shortener-power`

---

## Power Structure

```
power/
├── power.json              # Power configuration
├── package.json            # NPM package metadata
├── README.md              # This file
├── skills/                # Skill definitions
│   ├── api-development.md
│   └── restful-design.md
├── tools/                 # MCP tools (if applicable)
│   └── url-validator.js
├── templates/             # Code templates
│   ├── express-server.js
│   ├── url-model.js
│   └── url-routes.js
└── examples/              # Example implementations
    └── complete-example/
        ├── server.js
        ├── routes/
        ├── models/
        └── tests/
```

---

## Skills Provided

### 1. URL Shortener Architecture
- In-memory vs database storage patterns
- Short code generation strategies
- Collision handling

### 2. REST API Design
- CRUD endpoint patterns
- Error response standards
- HTTP status codes

### 3. Testing Best Practices
- Unit test patterns
- Property-based testing with fast-check
- Integration testing

### 4. Production Considerations
- Rate limiting
- Analytics and metrics
- Deployment strategies

---

## Tools Provided

### url-validator
Validates URLs and checks for broken links.

```json
{
  "name": "url-validator",
  "description": "Validate URLs and check accessibility",
  "parameters": {
    "type": "object",
    "properties": {
      "url": { "type": "string", "description": "URL to validate" },
      "checkAccess": { "type": "boolean", "description": "Check if URL is accessible" }
    }
  }
}
```

---

## Templates

### Express Server Template

```javascript
// templates/express-server.js
import express from 'express';
import { urlStore } from './models/urlStore.js';

const app = express();
app.use(express.json());

// ... your routes here

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

### URL Model Template

```javascript
// templates/url-model.js
import { nanoid } from 'nanoid';
import { isUri } from 'valid-url';

export function create(originalUrl) {
  if (!isUri(originalUrl)) {
    throw new Error('Invalid URL');
  }
  
  return {
    id: nanoid(16),
    originalUrl,
    shortCode: nanoid(8),
    createdAt: new Date(),
    clicks: 0
  };
}
```

---

## Usage in Kiro

### Activate by mentioning keywords

```
I'm building a URL shortener. What are the best practices?
```

Kiro will automatically activate this power's skills.

### Use tools directly

```
@url-shortener/todo show me my pending tasks
@url-shortener/jsdoc generate API docs for my routes
```

### Use templates

```
Give me a template for an Express server with URL shortening
```

---

## Power Configuration

```json
// power.json
{
  "manifest": {
    "name": "URL Shortener Kiro Power",
    "description": "Complete toolkit for building URL Shortener services",
    "version": "1.0.0",
    "activation": {
      "keywords": [
        "url-shortener",
        "short-url",
        "url",
        "redirect",
        "link-shortener"
      ]
    },
    "skills": [
      {
        "name": "url-shortener-architecture",
        "description": "Best practices for URL shortener design"
      },
      {
        "name": "rest-api-design",
        "description": "REST API patterns for URL services"
      },
      {
        "name": "testing-url-services",
        "description": "Testing strategies for URL shorteners"
      }
    ],
    "tools": [
      {
        "name": "generate-short-code",
        "description": "Generate a unique short code"
      },
      {
        "name": "validate-url",
        "description": "Validate URL format and accessibility"
      }
    ]
  }
}
```

---

## Contributing

1. Fork this repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -am 'Add new feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Create a Pull Request

---

## Publishing to Registry

1. Ensure all files are complete and tested
2. Update version in `package.json` (semantic versioning)
3. Push to a public GitHub repository
4. Submit to [Kiro Power Registry](https://registry.kiro.dev)

---

## License

MIT License - feel free to use and modify for your own projects.

---

## Resources

- [Kiro Power Registry](https://registry.kiro.dev)
- [Kiro Documentation](https://docs.kiro.dev)
- [Creating Powers](https://docs.kiro.dev/creating-powers)
- [Issue Tracker](https://github.com/yourusername/kiro-url-shortener-power/issues)