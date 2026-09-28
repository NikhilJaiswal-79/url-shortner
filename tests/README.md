# Tests Directory

This folder contains all tests for the URL Shortener project.

---

## Test Structure

```
tests/
├── unit/                    # Example-based unit tests
│   ├── urlStore.test.js    # Tests for URL store model
│   └── validate.test.js    # Tests for validation middleware
└── property/               # Property-based tests (Lesson 4)
    ├── urlGenerator.test.js
    └── README.md
```

---

## Running Tests

```bash
# Run all tests
npm test

# Run only unit tests
npm run test:unit

# Run only property-based tests
npm run test:property

# Run with coverage
npm test -- --coverage
```

---

## Test Coverage

Target: >80% code coverage

```
Coverage reports are generated in the `coverage/` directory.
Open `coverage/lcov-report/index.html` to view the detailed report.
```

---

## Unit Tests (Lesson 4)

Unit tests verify specific behaviors with example inputs:

```javascript
describe('create()', () => {
  it('should create a shortened URL with valid input', () => {
    const urlEntry = urlStore.create('https://example.com');
    expect(urlEntry.shortCode).toHaveLength(8);
  });
});
```

### Unit Test Patterns

- **describe()**: Groups related tests
- **it()** / **test()**: Individual test cases
- **beforeEach()**: Setup before each test
- **beforeAll()**: Setup once before all tests

---

## Property-Based Tests (Lesson 4)

Property-based tests verify invariants that must always hold:

```javascript
describe('Short Code Properties', () => {
  it('should always generate valid short codes', () => {
    fc.assert(
      fc.property(fc.integer({ min: 6, max: 8 }), (length) => {
        const code = generateShortCode(length);
        return /^[A-Za-z0-9_-]{6,8}$/.test(code);
      }),
      { numRuns: 1000 }
    );
  });
});
```

---

## Best Practices

1. **Test one thing per test**: Each test should verify a single behavior
2. **Use descriptive names**: Test names should describe what they verify
3. **Test edge cases**: Null, undefined, empty values, boundaries
4. **Keep tests isolated**: Each test should be independent
5. **Arrange-Act-Assert**: Structure tests clearly

---

## CI/CD Integration

Tests run automatically on:

1. **Pre-commit hooks** (via `.kiro/hooks/`)
2. **Pull requests**
3. **Deployments**

Add to your CI pipeline:

```yaml
- name: Run Tests
  run: npm test
```