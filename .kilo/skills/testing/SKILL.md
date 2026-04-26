---
name: testing
description: Testing strategy for new and existing code. Use when writing or running tests.
---

# Testing Skill

Testing strategy and conventions for this project.

## Process

### 1. Discover the Test Setup
- Check `package.json` scripts, `Makefile`, `pytest.ini`, or similar for test commands.
- Identify the test framework (Jest, Vitest, pytest, etc.) and test file conventions.
- Look at existing tests to understand patterns: setup/teardown, mocking, assertions.

### 2. Write Tests First (when adding new code)
- Write a test that describes the expected behavior before implementing.
- Run it to confirm it fails (red).
- Implement the code to make it pass (green).
- Refactor if needed while keeping tests green.

### 3. Test Structure
- **Unit tests** — Test individual functions/modules in isolation. Mock external dependencies.
- **Integration tests** — Test how multiple modules work together.
- **End-to-end tests** — Test complete user workflows (use sparingly, they're slow).

### 4. Good Test Practices
- One assertion concept per test. Name tests descriptively.
- Tests should be deterministic — no random data, no dependencies on external services.
- Use factories or fixtures for test data, not hardcoded values spread across tests.
- Test edge cases: empty input, boundary values, error conditions.
- Don't test implementation details — test behavior.

### 5. Run Tests
- Run the full suite before considering work done.
- Fix any failing tests, even pre-existing failures.
- If a test is flaky, investigate and fix it rather than skipping it.
