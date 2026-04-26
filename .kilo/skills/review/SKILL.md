---
name: review
description: Code review checklist and standards. Use before merging or after significant changes.
---

# Review Skill

Code review standards and checklist.

## Review Checklist

### Correctness
- Does the code do what it claims to do?
- Are there logic errors or incorrect assumptions?
- Is error handling complete and appropriate?

### Security
- No hardcoded secrets, keys, or tokens.
- Input validation on all user/external data.
- No SQL/command injection vectors.
- Authentication and authorization checks in place.

### Code Quality
- Follows existing project conventions (naming, structure, imports).
- No duplicated code — extract shared logic.
- Functions are small and focused (single responsibility).
- No dead code, commented-out blocks, or debug logging.
- No unnecessary dependencies added.

### Performance
- No N+1 queries or unnecessary loops.
- Appropriate use of caching and memoization.
- No blocking operations in async contexts.

### Testing
- New functionality has corresponding tests.
- Edge cases are covered.
- Existing tests still pass.

## Review Output

For each issue found, specify:
- **Severity**: CRITICAL / WARNING / INFO
- **Location**: file:line or function name
- **Description**: What's wrong
- **Suggestion**: How to fix it

End with a verdict: APPROVED / CHANGES REQUESTED / COMMENT.
