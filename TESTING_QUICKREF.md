# Quick Test Reference

## Essential Commands

| Command | Purpose |
|---------|---------|
| `npm test` | Run all tests (watch mode) |
| `npm test -- --ci` | Run tests once (CI mode) |
| `npm test -- --coverage` | Show coverage report |
| `npm test -- Application` | Run Application tests only |
| `npm test -- parseService` | Run Parse tests only |
| `npm test -- --listTests` | List all test files |

## Test Files Quick Guide

### parseService.test.js - "Does the database work?"
```bash
npm test -- parseService

Tests:
✓ Parse SDK is available
✓ Credentials are configured
✓ Can create objects and queries
✓ ACL and File operations work
```

### Business.test.js - "Does the business model work?"
```bash
npm test -- Business

Tests:
✓ Filename sanitization (removes special chars)
✓ Business fields are correct
✓ Query building works
✓ Data transforms properly
```

### Application.test.js - "Does the form work?"
```bash
npm test -- Application

Tests:
✓ Form renders all fields
✓ Modal opens/closes for locations
✓ Validation prevents bad data
✓ Submission triggers API call
```

### authService.test.js - "Does auth work?"
```bash
npm test -- authService

Tests:
✓ User signup/login methods exist
✓ Email validation works
✓ Password validation works
✓ Session persists
```

## Common Patterns

### Run test in watch mode (auto-rerun on changes):
```bash
npm test
```
Press `p` to run tests matching pattern, `q` to quit.

### Run single test file:
```bash
npm test -- Application.test.js
```

### Run tests matching name:
```bash
npm test -- --testNamePattern="Modal"
```

### Debug a test:
```bash
npm test -- --testNamePattern="specific test name"
```

### See coverage:
```bash
npm test -- --coverage --watchAll=false
```

## What Each Test Category Checks

### Integration Tests (parseService.test.js)
- ✅ Parse SDK initialized correctly
- ✅ Environment credentials loaded
- ✅ Database operations (create, query, delete)
- ✅ File upload infrastructure
- ✅ User authentication ready

### Unit Tests (Business.test.js)
- ✅ Filename sanitization logic
- ✅ Data validation
- ✅ Query building helpers
- ✅ Error handling

### Component Tests (Application.test.js)
- ✅ Form renders correctly
- ✅ All input fields present
- ✅ Modal functionality
- ✅ Form submission
- ✅ Error messages

### Auth Tests (authService.test.js)
- ✅ User management
- ✅ Input validation
- ✅ Session handling
- ✅ Error scenarios

## Troubleshooting

**Tests won't start:**
```bash
# Clear Jest cache
npm test -- --clearCache

# Then run again
npm test
```

**Timeout errors:**
```bash
# Run with increased timeout
npm test -- --testTimeout=10000
```

**Module not found:**
```bash
# Check file paths in test imports
# Make sure __tests__ folder exists
# Verify setupTests.js is in src/
```

## Coverage Targets

Aim for this coverage:
- Statements: 70%
- Branches: 65%
- Functions: 70%
- Lines: 70%

Check current coverage:
```bash
npm test -- --coverage --watchAll=false
```

## For Developers

**Before committing:**
```bash
npm test -- --ci
npm run build
```

**New feature checklist:**
- [ ] Wrote tests first (optional but recommended)
- [ ] All tests pass: `npm test -- --ci`
- [ ] Coverage not reduced: `npm test -- --coverage`
- [ ] Built successfully: `npm run build`

## For CI/CD Pipelines

Add to GitHub Actions, Jenkins, etc.:
```bash
npm ci
npm test -- --ci --coverage
npm run build
```

This:
- Installs exact dependencies
- Runs tests once
- Generates coverage
- Builds production bundle

## Test Output Examples

**All passing:**
```
PASS  src/__tests__/parseService.test.js
PASS  src/__tests__/Business.test.js
PASS  src/__tests__/Application.test.js
PASS  src/__tests__/authService.test.js

Tests:       210 passed, 210 total
```

**With failures:**
```
FAIL  src/__tests__/Application.test.js
  ✕ should render the form
  ✓ should display labels

Tests:       209 passed, 1 failed, 210 total
```

**Coverage report:**
```
Statements   : 72.5% ( 145/200 )
Branches     : 68.3% ( 41/60 )
Functions    : 75.0% ( 30/40 )
Lines        : 73.2% ( 148/202 )
```

## Next Steps

1. Run tests: `npm test`
2. Check coverage: `npm test -- --coverage`
3. Read TESTING.md for detailed docs
4. Add more tests as features grow
5. Set up CI/CD pipeline

---

For detailed documentation, see **`TESTING.md`**
For implementation details, see **`TESTING_IMPLEMENTATION.md`**
