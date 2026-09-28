# Example Implementations

Complete example projects using this power.

---

## Simple Example

A minimal in-memory URL shortener.

**Files:**
- `server.js` - Main server
- `models/urlStore.js` - Data storage

**Run:**
```bash
cd simple
npm install
npm start
```

---

## Production Example

A production-ready URL shortener with PostgreSQL.

**Features:**
- Database persistence
- Rate limiting
- Analytics
- Docker support

**Files:**
- `server.js` - Main server with middleware
- `models/postgres.js` - Database connection
- `docker-compose.yml` - Docker setup

**Run:**
```bash
cd production
docker-compose up -d
```

---

## Testing Example

Shows comprehensive testing patterns.

**Tests:**
- Unit tests (Jest)
- Property-based tests (fast-check)
- Integration tests (Supertest)

**Run:**
```bash
cd testing
npm install
npm test
```