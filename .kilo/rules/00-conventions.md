# Coding Conventions

Project-wide standards. These exist because linters cannot enforce judgment — they cover the areas where reasonable engineers might disagree.

## Code Style

- Follow the existing style in the codebase. Look at neighboring files before writing new code.
- Match indentation, quoting, import style, and naming conventions exactly.
- One concept per file. Split files that exceed 500 lines.
- Functions do one thing. Keep them under 50 lines.

## Architecture

- **Why:** Simplicity enables velocity. Every abstraction must pay for itself.
- Prefer plain functions over classes unless the codebase consistently uses classes.
- Reuse existing patterns, libraries, and utilities. New abstractions require justification.
- Group related files in directories with clear boundaries. Avoid deep nesting.

## Error Handling

- **Why:** Silent failures are debugging nightmares. Fail loudly and early.
- Handle errors explicitly. Never swallow exceptions with empty catch blocks.
- Validate inputs at system boundaries. Return meaningful error messages.

## Do NOT

- **Do not commit secrets, API keys, or credentials.** Use environment variables. Lock files and configs must not contain tokens.
- **Do not leave dead code, commented-out blocks, or debug statements.** These pollute the codebase and confuse future readers.
- **Do not use wildcard imports** unless the project consistently uses them.
- **Do not add comments that describe what the code does.** Code should be self-documenting. Comments explain **why** something is done, not **what** it does.
- **Do not add TODO comments in production code.** Convert them to tickets or fix them immediately.

## Testing

- Write tests for new functionality before claiming work is done.
- Test behavior, not implementation details.
- One assertion concept per test. Use descriptive test names.
- Do not skip or disable flaky tests — fix them.
