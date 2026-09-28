# Property-Based Tests

**Lesson 4: Property-Based Testing**

Property-based testing moves beyond example-based tests to verify **general rules** that must always hold. Instead of writing specific test cases, we define properties that should be true for **all** valid inputs.

---

## What is Property-Based Testing?

| Traditional (Example-Based) | Property-Based |
|----------------------------|----------------|
| Tests specific examples | Tests all inputs (generated) |
| "Given URL 'https://example.com', short code should be 'abc123'" | "All short codes should always be 6-8 alphanumeric characters" |
| Limited coverage | Hundreds/thousands of test cases |
| Manual test design | Automatic input generation |

---

## Why Use Property-Based Testing?

1. **Higher Confidence**: Tests hundreds or thousands of automatically generated inputs
2. **Catches Edge Cases**: Finds bugs in boundary conditions you might not think to test
3. **Documents Invariants**: Properties serve as executable documentation
4. **Less Test Code**: One property replaces dozens of example tests

---

## Properties Tested in This Project

### 1. Short Code Format Invariant
```
Property: All short codes should match /^[A-Za-z0-9_-]{6,8}$/
```

**Why it matters:** Short codes are used in URLs. Invalid characters could break redirects.

**Test:** `should always generate valid short codes`

---

### 2. Uniqueness Invariant
```
Property: Each short code should be unique within the store
```

**Why it matters:** Duplicate codes would cause redirect conflicts.

**Test:** `should generate unique codes` and `should maintain unique short codes in store`

---

### 3. URL Validation Invariant
```
Property: Valid URLs pass, invalid URLs fail
```

**Why it matters:** Prevents malformed URLs from being stored.

**Tests:**
- `should correctly validate URL format`
- `should reject invalid URL formats`

---

### 4. Data Model Invariant
```
Property: Created URL models always have valid structure
```

**Why it matters:** Ensures API responses always have required fields.

**Tests:**
- `should always have valid model structure`
- `should never have negative click counts`
- `should generate consistent short URLs for same code`

---

### 5. Data Integrity Invariant
```
Property: Stored data is preserved exactly
```

**Why it matters:** Prevents data corruption.

**Tests:**
- `should preserve original URL exactly`
- `should create timestamps within valid range`

---

## Running Property-Based Tests

```bash
# Run property-based tests only
npm run test:property

# Or directly with Jest
npx jest tests/property/

# Run with verbose output
npx jest tests/property/ --verbose
```

---

## How fast-check Works

```javascript
import { fc } from 'fast-check';

// Define a property test
fc.assert(
  fc.property(
    // Generate 100 random URLs
    fc.array(fc.webUrl(), { minLength: 1, maxLength: 100 }),
    // Test this function for each generated input
    (urls) => {
      // Property: All short codes should be unique
      const codes = urls.map(url => generateShortCode(url));
      return new Set(codes).size === codes.length;
    }
  ),
  { numRuns: 1000 } // Run 1000 times with different inputs
);
```

### Built-in Arbitraries

| Arbitrary | Generates |
|-----------|-----------|
| `fc.string()` | Random strings |
| `fc.integer()` | Random integers |
| `fc.webUrl()` | Valid URLs |
| `fc.domain()` | Valid domain names |
| `fc.array()` | Arrays of any type |
| `fc.option()` | Optional values |
| `fc.char()` | Single characters |

---

## Writing New Properties

When adding new features, ask yourself:

1. **Format**: What patterns must the output always match?
2. **Uniqueness**: What must be unique?
3. **Idempotency**: What should produce the same result given same input?
4. **Invariants**: What should never change?
5. **Reversibility**: Can you verify by going backwards?

Example:
```javascript
// For a new "clicks" feature
it('should never have negative click counts', () => {
  fc.assert(
    fc.property(
      fc.integer({ min: 0, max: 1000 }),
      (clicks) => {
        const result = incrementClicks(clicks);
        expect(result).toBeGreaterThanOrEqual(0);
      }
    ),
    { numRuns: 1000 }
  );
});
```

---

## Best Practices

1. **Start small**: Test one property at a time
2. **Use clear names**: Property names should describe the invariant
3. **Combine arbitraries**: Use `fc.tuple`, `fc.record` for complex inputs
4. **Set reasonable limits**: Use `minLength`, `maxLength` to avoid slow tests
5. **Add traditional tests alongside**: Property tests don't replace all unit tests