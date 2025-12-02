# Testing Guide

This document describes the testing strategy and how to run tests for the Live Local application.

## Overview

The project uses **Jest** (built into Create React App) and **React Testing Library** for component tests. Tests cover:

- **Integration Tests**: Parse database connection and initialization
- **Unit Tests**: Business model helpers, filename sanitization, data normalization
- **Component Tests**: Form rendering, validation, modal interactions, user interactions
- **Auth Tests**: Authentication service, user management, session handling

## Test Files

### 1. `src/__tests__/parseService.test.js`
**Integration tests for Parse database connection**

Tests verify:
- Parse SDK is available and initialized
- Environment credentials are configured
- Parse.Object, Query, ACL, and File classes work correctly
- User authentication flow is ready

Run tests:
```bash
npm test -- parseService
```

### 2. `src/__tests__/Business.test.js`
**Unit tests for Business model**

Tests verify:
- Filename sanitization (special chars → underscores)
- Business object structure and fields
- Query building (keyword search, category filter)
- Data normalization (Parse objects → plain JS)
- Address formatting
- Error handling

Run tests:
```bash
npm test -- Business
```

### 3. `src/__tests__/Application.test.js`
**Component tests for Application (Business Registration) form**

Tests verify:
- Form renders with all fields
- Form fields have correct types and validation
- Modal opens/closes for additional locations
- Form data is collected correctly
- Submission calls createBusiness with proper structure
- Errors are handled gracefully

Run tests:
```bash
npm test -- Application
```

### 4. `src/__tests__/authService.test.js`
**Unit tests for authentication service**

Tests verify:
- Parse.User methods exist (signUp, logIn, logOut, current)
- User object creation and attribute management
- Email validation
- Password validation
- Session persistence
- Logout clears state
- Error handling for auth failures

Run tests:
```bash
npm test -- authService
```

## Running Tests

### Run all tests:
```bash
npm test
```

### Run specific test file:
```bash
npm test -- parseService.test.js
```

### Run tests matching pattern:
```bash
npm test -- --testNamePattern="Filename Sanitization"
```

### Run tests in watch mode (auto-rerun on file changes):
```bash
npm test -- --watch
```

### Run tests with coverage report:
```bash
npm test -- --coverage
```

### Run tests once (CI mode):
```bash
npm test -- --ci --coverage
```

## Test Structure

Each test file follows this structure:

```javascript
describe('Feature/Component Name', () => {
  describe('Specific Functionality', () => {
    test('should do something specific', () => {
      // Arrange: Set up test data
      const input = 'test';
      
      // Act: Execute code under test
      const result = functionUnderTest(input);
      
      // Assert: Verify results
      expect(result).toBe('expected');
    });
  });
});
```

## Key Testing Patterns

### 1. Component Rendering
```javascript
test('should render the form', () => {
  render(<Application />);
  expect(screen.getByText('Add your business')).toBeInTheDocument();
});
```

### 2. User Interactions
```javascript
test('should handle form submission', async () => {
  render(<Application />);
  const input = screen.getByPlaceholderText('Business Name');
  await userEvent.type(input, 'My Business');
  expect(input.value).toBe('My Business');
});
```

### 3. Mocking External Calls
```javascript
jest.mock('../models/Business', () => ({
  createBusiness: jest.fn()
}));

test('should call createBusiness on submit', () => {
  const { createBusiness } = require('../models/Business');
  // Test uses the mock instead of real implementation
});
```

### 4. Async Operations
```javascript
test('should handle async submission', async () => {
  render(<Application />);
  await waitFor(() => {
    expect(screen.getByText('Thank you')).toBeInTheDocument();
  });
});
```

## Environment Setup

Test environment variables are configured in `src/setupTests.js`:

```javascript
process.env.REACT_APP_PARSE_APP_ID = 'test-app-id';
process.env.REACT_APP_PARSE_JS_KEY = 'test-js-key';
process.env.REACT_APP_PARSE_SERVER_URL = 'https://parseapi.back4app.com/';
```

These dummy values allow tests to run without real backend credentials. Integration tests that need real credentials can check for their presence.

## Coverage Goals

Aim for:
- **Core Services (parseService, authService)**: 80%+ coverage
- **Models (Business, Review, Profile)**: 75%+ coverage
- **Components (Application, BusinessList, etc.)**: 60%+ coverage

View coverage:
```bash
npm test -- --coverage
```

## Integration with CI/CD

In GitHub Actions or similar CI systems, run tests in CI mode:

```bash
npm test -- --ci --coverage --testTimeout=10000
```

This:
- Runs tests once (no watch mode)
- Generates coverage report
- Increases timeout for network-based tests
- Fails on any warnings

## Debugging Tests

### Run single test:
```bash
npm test -- --testNamePattern="should render the form"
```

### Run with debugging:
```bash
node --inspect-brk node_modules/.bin/jest --runInBand
```

Then open `chrome://inspect` in Chrome DevTools.

### Print test output:
```javascript
test('debug test', () => {
  const result = someFunction();
  console.log(result); // Visible in test output
  expect(result).toBeDefined();
});
```

## Common Issues & Solutions

### Issue: "Cannot find module"
**Solution**: Check import path, ensure file exists

```javascript
// ❌ Wrong
import { createBusiness } from '../models/business';

// ✅ Correct
import { createBusiness } from '../models/Business';
```

### Issue: "Act warning" - Updates to state not wrapped in act()
**Solution**: Use `waitFor` for async updates

```javascript
// ❌ Wrong
fireEvent.click(button);
expect(screen.getByText('Success')).toBeInTheDocument();

// ✅ Correct
fireEvent.click(button);
await waitFor(() => {
  expect(screen.getByText('Success')).toBeInTheDocument();
});
```

### Issue: Timeout during async test
**Solution**: Increase timeout or mock the slow operation

```javascript
test('slow operation', async () => {
  // ...
}, 10000); // 10 second timeout
```

## Best Practices

1. **Test behavior, not implementation**: Test what users see/do, not internal details
2. **Use semantic queries**: `getByRole`, `getByPlaceholder` instead of `getByTestId`
3. **One assertion per test**: Each test should check one thing
4. **Mock external dependencies**: Database, API, timers
5. **Keep tests isolated**: No test should depend on another
6. **Use descriptive names**: Test name should explain what it tests

## Next Steps

- Add more E2E tests using Cypress or Playwright
- Set up GitHub Actions to run tests on every commit
- Increase coverage for CRM components
- Add performance benchmarks for Parse queries
