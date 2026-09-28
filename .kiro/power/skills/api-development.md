# URL Shortener API Development Skills

This skill provides best practices and patterns for building URL shortener APIs.

---

## Core Concepts

### Short Code Generation
- Use `nanoid` with configurable length (6-8 characters)
- Ensure uniqueness with collision detection
- Use URL-safe characters (A-Za-z0-9_-)

### Storage Options
| Option | Pros | Cons |
|--------|------|------|
| In-memory | Fast, simple | Lost on restart |
| Redis | Fast, persistent | Requires Redis server |
| PostgreSQL | ACID compliant | Slower, complex setup |
| MongoDB | Flexible schema | Eventually consistent |

### URL Validation
```javascript
import { isUri } from 'valid-url';

function validateUrl(url) {
  if (!isUri(url)) {
    throw new ValidationError('Invalid URL format');
  }
}
```

---

## REST API Best Practices

### Response Format
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional message"
}
```

### Error Responses
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Human-readable message"
  }
}
```

### HTTP Status Codes
- `200` - Success
- `201` - Created
- `302` - Redirect
- `400` - Bad Request
- `404` - Not Found
- `500` - Server Error

---

## Performance Tips

1. **Use indexes** on short code column
2. **Cache frequently accessed** URLs
3. **Implement rate limiting** for creation
4. **Use connection pooling** for databases

---

## Security Considerations

1. **Validate all inputs** - Never trust user input
2. **Sanitize URLs** - Prevent XSS via redirect
3. **Rate limit** - Prevent abuse
4. **Log access** - Track usage patterns
5. **HTTPS only** - Never redirect over HTTP