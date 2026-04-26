---
name: implementation
description: Step-by-step guide for implementing features from a plan. Use when translating design into working code.
---

# Implementation Skill

Guide for implementing features in this project.

## Process

### 1. Understand the Task
- Read the plan or specification fully before writing any code.
- Identify which files need to change and which existing patterns to follow.

### 2. Read the Codebase
- Read the files you'll be modifying, plus any related files for context.
- Note naming conventions, import patterns, error handling style, and testing approach.

### 3. Implement Incrementally
- Make one change at a time. Verify it works before moving on.
- Follow the existing code style exactly. Match indentation, quoting, and naming.
- Use the Edit tool for existing files, Write tool only for new files.
- Keep diffs minimal — change only what's needed.

### 4. Verify
- Run the project's lint command (check package.json scripts, Makefile, or similar).
- Run the project's type-check command if available.
- Run existing tests. Fix any failures before proceeding.
- Manually verify the change behaves correctly if a test isn't practical.

### 5. Commit
- Use conventional commit messages: `type(scope): description`
- Types: feat, fix, refactor, test, docs, chore
- Keep commits focused — one logical change per commit.

## Common Patterns

- Look at neighboring files for patterns before creating new abstractions.
- Prefer plain functions over classes unless the codebase consistently uses classes.
- Handle errors explicitly — no silent failures.
- Use async/await consistently if the codebase uses it.
