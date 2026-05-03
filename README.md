# Kilo Code Project Template

A minimal, local-first agentic development template for [Kilo Code](https://kilo.ai). Structured Plan → Execute → Review workflow with DeepSeek-powered agents, plus fast-path `/patch` and `/debug` routes for small edits and failure triage, plus `/ship` for final commit+push quality gating in solo workflows.

## Directory Structure

```
├── kilo.jsonc                      # Project config with comments
├── AGENTS.md                       # Auto-loaded project instructions
├── README.md
├── .gitignore
├── scripts/
│   ├── activate-rules.mjs          # Activate/deactivate rule packs
│   ├── audit-prompts.mjs           # Minimal audit for stale/broken agent prompt patterns
│   ├── log-event.mjs               # Append structured agent event logs (JSONL)
│   └── review-logs.mjs             # Weekly summary of logged agent events
├── logs/                           # Agent event logs (gitignored)
└── .kilo/
    ├── agents/
    │   ├── plan.md
    │   ├── ask.md
    │   ├── reviewer.md
    │   ├── code.md
    │   ├── flash-patch.md
    │   ├── flash-debug.md
    │   └── ship.md
    ├── commands/
    │   ├── plan.md                 # /plan → plan agent
    │   ├── review.md               # /review → reviewer agent
    │   ├── patch.md                # /patch → flash-patch agent
    │   ├── debug.md                # /debug → flash-debug agent
    │   └── ship.md                 # /ship → ship agent
    ├── skills/
    │   └── example/SKILL.md
    └── rules/
        ├── 00-conventions.md       # Coding standards (loaded first)
        ├── 10-workflow.md          # Dev process with verification gates
        ├── 11-model-routing.md     # Cost-conscious model allocation (V4 Flash default, V4 Pro escalation only)
        ├── 12-context-budget.md    # Efficient context-loading flow to reduce token waste
        ├── 20-security.md          # Secrets, input validation, least privilege
        ├── 21-docs.md              # Don't create docs unasked, keep docs in sync
        └── 22-backend.md           # REST conventions, error handling, input validation
```

## Workflow

```
/plan → plan agent designs → plan approved
  → code implements each step → lint + tests pass
    → /review → reviewer inspects diff → no CRITICAL issues
      → commit

/patch → flash-patch applies a small scoped edit
  → runs explicit verification command(s) with passing output

/debug → flash-debug reproduces failure from provided command/error output
  → applies fix and reruns explicit verification command(s) with passing output

/ship → ship reviews final diff, re-verifies checks, and returns push readiness
  → presents commit/push/cancel options and waits for explicit user instruction
  → blocked gates log the event and report issues without offering commit options
```

### Phase 1: Plan (`/plan`)
The plan agent analyzes requirements, reads the codebase, and produces a structured plan. Planning is Flash-first. If the task is complex or risky enough to need V4 Pro, the plan agent stops and produces a compact handoff for a manual V4 Pro rerun. No code is written until approved.

### Phase 2: Execute (code agent)
Delegate each step to the code agent. It reads files, implements with minimal diff, and must pass lint/tests before reporting done. After 2 normal failed attempts, it escalates. For hard-failure classes, it escalates after 1 failed attempt.

### Phase 3: Review (`/review`)
The reviewer (read-only) inspects the diff for correctness, security, edge cases, performance, and style. Fix all CRITICAL issues before merging.

### Ask agent
Read-only agent for code explanation, research, and technical questions. Uses V4 Flash for fast, cost-effective responses. Cannot modify files or run commands.

## Design Decisions

- **Read-only Ask** — Explicit tool boundaries with anti-workaround rules. Uses V4 Flash because Q&A doesn't require deep reasoning.
- **Model tier strategy** — V4 Pro reserved for architecture (plan) and deliberate human-approved escalation only. V4 Flash handles all normal implementation, review, debugging, and mechanical work. Context budget rules prevent wasteful token consumption.
- **JSONC config** — `kilo.jsonc` supports comments, making the config self-documenting.
- **Numbered rules** — `00-conventions.md` and `10-workflow.md` load in predictable order.
- **Read-only reviewer** — Reviewer has `edit: deny` and `bash: ask`. Cannot accidentally modify code.
- **Verification gates** — Every phase has a non-negotiable checkpoint. Work is not done until lint, typecheck, and tests pass.
- **Escalation policy** — After 2 normal failed attempts, the code agent reports and stops. Hard-failure classes escalate after 1 attempt. Escalation to V4 Pro is a human decision.
- **Prompt audit** — `scripts/audit-prompts.mjs` catches stale agent prompt patterns such as references to removed tools or removed routing agents.
- **Explicit instruction order** — `kilo.jsonc` lists instruction files explicitly, ensuring determinism.

## Using This Template

1. **Copy the template** into your project root (clone from [GitHub](https://github.com/h576966/kilo_template.git) or copy files manually).
2. **Remove the template's git history** if cloned — delete `.git` and run `git init`.
3. **Customize models** in `kilo.jsonc` — set your preferred provider and models.
4. **Update `AGENTS.md`** — adjust the project description and workflow to match your project.
5. **Replace the example skill** — delete `.kilo/skills/example/` and add your own project-specific skills.
6. **Review the rules** — `.kilo/rules/00-conventions.md` and `.kilo/rules/10-workflow.md`. Customize for your stack.
7. **Run `kilo`** in the project directory — agents, rules, and commands load automatically.

## Skills

Skills encode project-specific patterns the LLM doesn't already know: non-standard architecture, migration steps, deploy flows, domain knowledge. An example stub is in `.kilo/skills/example/`. Skip generic skills (debugging, TDD, review) — the LLM already knows those.

## Getting Started

1. Run `kilo` in the project directory.
2. Type `/plan` for planning, `/patch` for small edits, `/debug` for failure triage, `/review` to review changes.
3. For implementation, delegate to the code agent via the Task tool.

## Testing

Run the template validation suite:

```
node tests/validate.mjs
```

Run the minimal prompt audit:

```
node scripts/audit-prompts.mjs
```

Checks: `kilo.jsonc` validity, agent frontmatter, cross-references between config/files/table/tree, command-agent linkage, rule file existence, activated rules, agent prompt quality, README consistency, and stale prompt/tool references. Zero dependencies — uses only Node.js built-in modules.

## Requirements

- [Kilo Code CLI](https://kilo.ai) installed
- DeepSeek API access configured (or update `kilo.jsonc` with your provider)

## Philosophy

- **Local-first** — Everything lives in your repo. No external services beyond the LLM API.
- **Minimal** — Seven focused agents, one skill stub, four base rules, three path-scoped rules, five commands. No frameworks, no abstractions.
- **Verified** — Every phase has a non-negotiable quality gate. Nothing ships unverified.
- **Convention over configuration** — Follow existing patterns. Don't invent new ones without reason.
