---
name: debugging
description: Systematic debugging approach for isolating and fixing bugs.
---

# Debugging Skill

Systematic approach to finding and fixing bugs.

## Process

### 1. Reproduce
- Identify the exact steps to trigger the bug.
- Check if the bug is deterministic or intermittent.
- Note the environment: OS, runtime version, dependencies, configuration.

### 2. Isolate
- Narrow down where the bug occurs. Use binary search through the code if needed.
- Add temporary logging or breakpoints to trace execution.
- Check recent changes (git log, git bisect) to find the commit that introduced the bug.

### 3. Trace
- Follow the data flow from input to output.
- Verify assumptions at each step — don't trust that a function "should" return the right value.
- Check for common causes: off-by-one errors, null/undefined, async timing, state mutations, incorrect type coercion.

### 4. Fix
- Write a failing test that reproduces the bug first.
- Apply the minimal fix that makes the test pass.
- Verify no other tests break.
- Check that the fix doesn't introduce a similar bug elsewhere.

### 5. Verify
- Run the full test suite.
- Run linting and type-checking.
- If applicable, manually verify the original reproduction steps no longer trigger the bug.

## Common Pitfalls

- **Caching/HMR** — Restart dev servers and clear caches before concluding a fix works.
- **Environment differences** — A bug may only appear in production, CI, or specific OS.
- **Race conditions** — Async code can have timing-dependent bugs. Add ordering guarantees.
- **Silent failures** — Check try/catch blocks that swallow errors without handling them.
