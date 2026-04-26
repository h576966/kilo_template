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
    │   ├── plan.md                 # Primary: system design & planning (v4-pro)
    │   ├── ask.md                  # Primary: code explanation, research (v4-flash)
    │   ├── reviewer.md             # Subagent: code review, read-only (v4-pro)
    │   └── worker.md               # Subagent: implementation (v4-flash)
    ├── commands/
    │   ├── plan.md                 # /plan → plan agent
    │   └── review.md               # /review → reviewer agent
    └── skills/
        └── example/SKILL.md        # Example stub — replace with project-specific skills
    └── rules/
        ├── 00-conventions.md       # Coding standards (loaded first)
        └── 10-workflow.md          # Dev process with verification gates
```

## Workflow

```
/plan → plan agent designs → plan approved
  → worker implements each step → lint + tests pass
    → /review → reviewer inspects diff → no CRITICAL issues
      → commit
```

### Phase 1: Plan (`/plan`)
The plan agent analyzes requirements, reads the codebase, and produces a structured plan with context, approach, implementation steps, and risks. No code is written until the plan is approved.

### Phase 2: Execute (worker agent)
For each step in the plan, delegate to the worker. The worker reads relevant files, implements the change with a minimal diff, and **must** pass linting and tests before reporting done. If it fails to fix issues after 2 attempts, it escalates.

### Phase 3: Review (`/review`)
The reviewer agent (read-only) inspects the diff for correctness, security, edge cases, performance, and style. Address all CRITICAL issues before merging. WARNING issues should be fixed or documented.

### Ask agent
Switch to the Ask agent for code explanation, research, and general technical questions. Ask is read-only — it can read files, search the codebase, and browse the web, but cannot modify files or run commands. It uses the V4 Flash model for fast, cost-effective responses. Ask is not part of the Plan → Execute → Review pipeline; it is a parallel tool for when you need answers without changing anything.

## Design Decisions

- **Read-only Ask** — The Ask agent has explicit tool boundaries with anti-workaround rules (`echo >`, `gh`, `github_*` bypasses are explicitly forbidden). It uses V4 Flash because Q&A and code explanation don't require deep reasoning. If the user asks for modifications, Ask explains its limitation and suggests switching agents.

- **JSONC config** — `kilo.jsonc` supports comments, making the config self-documenting for template users.
- **Numbered rules** — `00-conventions.md` and `10-workflow.md` load in predictable order. No ambiguity from glob patterns.
- **Read-only reviewer** — The reviewer agent has `edit: deny` and `bash: ask`. It cannot accidentally modify code.
- **Verification gates** — Every phase has a non-negotiable checkpoint. Work is not done until lint, typecheck, and tests pass.
- **Escalation policy** — After 2 failed attempts, escalate to a stronger model. No infinite retry loops.
- **Explicit instruction order** — `kilo.jsonc` lists instruction files explicitly rather than using globs, ensuring determinism.

## Using This Template

To use this template as the foundation for a new project:

1. **Copy the template** into your project root:
   ```
   git clone https://github.com/h576966/kilo_template.git temp
   xcopy temp\* .\ /E /H /Y
   rmdir temp /s /q
   ```
   Or copy the files manually — the only required files are `kilo.jsonc`, `AGENTS.md`, and the `.kilo/` directory.
2. **Remove the template's git history** if you cloned it — delete `.git` and run `git init`.
3. **Customize models** in `kilo.jsonc` — set your preferred provider and models in the `model`, `small_model`, and `agent` blocks.
4. **Update `AGENTS.md`** — adjust the project description and workflow to match your project. The agent table should reflect which agents and models you use.
5. **Replace the example skill** — delete `.kilo/skills/example/` and add your own project-specific skills.
6. **Review the rules** — `.kilo/rules/00-conventions.md` defines coding standards; `.kilo/rules/10-workflow.md` defines the development process. Customize these for your stack.
7. **Run `kilo`** in the project directory — agents, rules, and commands load automatically. Type `/plan` to start planning.

## Skills

Skills encode project-specific patterns the LLM doesn't already know: non-standard architecture, migration steps, deploy flows, domain knowledge. An example stub is provided in `.kilo/skills/example/`. Skip generic skills (debugging, TDD, review) — the LLM already knows those.

## Getting Started

After setting up the template (see [Using This Template](#using-this-template)):

1. Run `kilo` in the project directory. Agents, rules, and commands load automatically.
2. Type `/plan` to start the plan agent, `/review` to review changes, or switch to the Ask agent for questions and code explanation.
3. For implementation, delegate to the worker agent via the Task tool.

## Requirements

- [Kilo Code CLI](https://kilo.ai) installed
- DeepSeek API access configured (or update `kilo.jsonc` with your provider)

## Philosophy

- **Local-first** — Everything lives in your repo. No external services beyond the LLM API.
- **Minimal** — Four agents, one skill stub, two rules, two commands. No frameworks, no abstractions.
- **Verified** — Every phase has a non-negotiable quality gate. Nothing ships unverified.
- **Convention over configuration** — Follow existing patterns. Don't invent new ones without reason.
