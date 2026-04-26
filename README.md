# Kilo Code Project Template

A minimal, local-first agentic development template for [Kilo Code](https://kilo.ai). Structured Plan → Execute → Review workflow with DeepSeek-powered agents.

## Directory Structure

```
├── kilo.jsonc                      # Project config with comments
├── AGENTS.md                       # Auto-loaded project instructions
├── README.md                       # This file
├── .gitignore
└── .kilo/
    ├── agents/
    │   ├── architect.md            # Primary: system design & planning (v4-pro)
    │   ├── reviewer.md             # Subagent: code review, read-only (v4-pro)
    │   └── worker.md               # Subagent: implementation (v4-flash)
    ├── commands/
    │   ├── plan.md                 # /plan → architect agent
    │   └── review.md               # /review → reviewer agent
    ├── skills/
    │   ├── implementation/SKILL.md # Feature implementation guide
    │   ├── debugging/SKILL.md      # Systematic debugging approach
    │   ├── testing/SKILL.md        # Testing strategy
    │   └── review/SKILL.md         # Code review checklist
    └── rules/
        ├── 00-conventions.md       # Coding standards (loaded first)
        └── 10-workflow.md          # Dev process with verification gates
```

## Workflow

```
/plan → architect designs → plan approved
  → worker implements each step → lint + tests pass
    → /review → reviewer inspects diff → no CRITICAL issues
      → commit
```

### Phase 1: Plan (`/plan`)
The architect agent analyzes requirements, reads the codebase, and produces a structured plan with context, approach, implementation steps, and risks. No code is written until the plan is approved.

### Phase 2: Execute (worker agent)
For each step in the plan, delegate to the worker. The worker reads relevant files, implements the change with a minimal diff, and **must** pass linting and tests before reporting done. If it fails to fix issues after 2 attempts, it escalates.

### Phase 3: Review (`/review`)
The reviewer agent (read-only) inspects the diff for correctness, security, edge cases, performance, and style. Address all CRITICAL issues before merging. WARNING issues should be fixed or documented.

## Design Decisions

- **JSONC config** — `kilo.jsonc` supports comments, making the config self-documenting for template users.
- **Numbered rules** — `00-conventions.md` and `10-workflow.md` load in predictable order. No ambiguity from glob patterns.
- **Read-only reviewer** — The reviewer agent has `edit: deny` and `bash: ask`. It cannot accidentally modify code.
- **Verification gates** — Every phase has a non-negotiable checkpoint. Work is not done until lint, typecheck, and tests pass.
- **Escalation policy** — After 2 failed attempts, escalate to a stronger model. No infinite retry loops.
- **Explicit instruction order** — `kilo.jsonc` lists instruction files explicitly rather than using globs, ensuring determinism.

## Skills

| Skill | Use when |
|-------|----------|
| `/skill implementation` | Translating plan steps into working code |
| `/skill debugging` | Isolating and fixing a bug |
| `/skill testing` | Writing or running tests |
| `/skill review` | Conducting a thorough code review |

## Getting Started

1. Copy this template into your project root.
2. Run `kilo` in the project directory. Agents, rules, and commands load automatically.
3. Type `/plan` to start the architect, or `/review` to review changes.
4. For implementation, delegate to the worker agent via the Task tool.

## Requirements

- [Kilo Code CLI](https://kilo.ai) installed
- DeepSeek API access configured (or update `kilo.jsonc` with your provider)

## Philosophy

- **Local-first** — Everything lives in your repo. No external services beyond the LLM API.
- **Minimal** — Three agents, four skills, two rules, two commands. No frameworks, no abstractions.
- **Verified** — Every phase has a non-negotiable quality gate. Nothing ships unverified.
- **Convention over configuration** — Follow existing patterns. Don't invent new ones without reason.
