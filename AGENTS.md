# Project Instructions

Local-first agentic development with a structured Plan → Execute → Review workflow.

## Workflow

1. **Plan** — `/plan` or switch to the architect agent for design and architecture. Never code first.
2. **Execute** — Delegate implementation steps to the worker agent. One step at a time.
3. **Review** — `/review` after every meaningful change. Address CRITICAL issues before proceeding.

## Agents

| Agent | Mode | Model | Use for |
|-------|------|-------|---------|
| architect | primary | deepseek-v4-pro | System design, architecture, planning |
| reviewer | subagent | deepseek-v4-pro | Code review (read-only) |
| worker | subagent | deepseek-v4-flash | Implementation of defined tasks |

## Skills

Load via `/skill <name>` when you need specialized guidance:
- `implementation` — Translating plan steps into working code
- `debugging` — Systematic bug isolation and fixing
- `testing` — Writing and running tests
- `review` — Code review checklist

## Do NOT

- **Do not jump to implementation without a plan.** Non-trivial changes require a written plan first.
- **Do not add dependencies or libraries without discussion.** Use what's already in the project.
- **Do not refactor unrelated code.** Changes must be scoped to the task at hand.
- **Do not leave debug logs, TODO comments, or commented-out code.** Remove them before reporting done.
- **Do not skip linting, type-checking, or tests.** Work is not done until all three pass.

## Verification

Every change must pass: lint → typecheck → tests. If any fail, fix them before reporting completion. If you can't fix a failure after 2 attempts, escalate — do not attempt a third time with the same approach.
