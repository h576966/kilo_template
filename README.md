# Kilo Code Project Template

A minimal, local-first agentic development template for [Kilo Code](https://kilo.ai). Structured Plan → Execute → Review workflow with DeepSeek-powered agents, plus fast-path `/patch` and `/debug` routes for small edits and failure triage.

## Directory Structure

```
├── kilo.jsonc                      # Project config with comments
├── AGENTS.md                       # Auto-loaded project instructions
├── README.md                       # This file
├── .gitignore
├── scripts/
│   └── activate-rules.mjs          # Activate/deactivate rule packs
└── .kilo/
    ├── agents/
    │   ├── plan.md                 # Primary: system design & planning (v4-pro)
    │   ├── ask.md                  # Primary: code explanation, research (v4-flash)
    │   ├── reviewer.md             # Subagent: code review, read-only (v4-flash)
    │   └── worker.md               # Subagent: implementation (v4-flash)
    │   ├── flash-patch.md          # Subagent: small, scoped edits (v4-flash)
    │   └── flash-debug.md          # Subagent: debugging failing commands (v4-flash)
    ├── commands/
    │   ├── plan.md                 # /plan → plan agent
    │   ├── review.md               # /review → reviewer agent
    │   ├── patch.md                # /patch → flash-patch agent
    │   └── debug.md                # /debug → flash-debug agent
    └── skills/
        └── example/SKILL.md        # Example stub — replace with project-specific skills
    └── rules/
        ├── 00-conventions.md       # Coding standards (loaded first)
        └── 10-workflow.md          # Dev process with verification gates
        └── packs/                  # Pre-built path-scoped rule packs (inactive by default)
            ├── security.md         # Hardcoded secrets, input validation, least privilege
            ├── docs.md             # Don't create docs unasked, keep docs in sync
            └── backend.md          # REST conventions, error handling, input validation
```

## Workflow

```
/plan → plan agent designs → plan approved
  → worker implements each step → lint + tests pass
    → /review → reviewer inspects diff → no CRITICAL issues
      → commit

/patch → flash-patch applies a small scoped edit
  → runs explicit verification command(s) with passing output

/debug → flash-debug reproduces failure from provided command/error output
  → applies fix and reruns explicit verification command(s) with passing output
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

- **Model tier strategy** — V4 Pro is reserved for architecture reasoning (plan). All other agents use V4 Flash: reviewer (code review), worker (implementation), ask (Q&A), compaction and explore (internal). If Flash fails on a complex step twice, the worker reports the failure rather than auto-escalating — switching to Pro is a human decision. This keeps the day-to-day cost low while preserving Pro as a deliberate safety net.

- **JSONC config** — `kilo.jsonc` supports comments, making the config self-documenting for template users.
- **Numbered rules** — `00-conventions.md` and `10-workflow.md` load in predictable order. No ambiguity from glob patterns.
- **Read-only reviewer** — The reviewer agent has `edit: deny` and `bash: ask`. It cannot accidentally modify code.
- **Verification gates** — Every phase has a non-negotiable checkpoint. Work is not done until lint, typecheck, and tests pass.
- **Escalation policy** — After 2 failed attempts, the worker reports the failure and stops. Escalation to V4 Pro is a human decision — AI never auto-switches models. This prevents retry loops on wrong-model solutions.
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
6. **Review the rules** — `.kilo/rules/00-conventions.md` defines coding standards; `.kilo/rules/10-workflow.md` defines the development process. Customize these for your stack. Activate optional packs: `node scripts/activate-rules.mjs security docs backend`.
7. **Run `kilo`** in the project directory — agents, rules, and commands load automatically. Type `/plan` to start planning.

## Skills

Skills encode project-specific patterns the LLM doesn't already know: non-standard architecture, migration steps, deploy flows, domain knowledge. An example stub is provided in `.kilo/skills/example/`. Skip generic skills (debugging, TDD, review) — the LLM already knows those.

## Getting Started

After setting up the template (see [Using This Template](#using-this-template)):

1. Run `kilo` in the project directory. Agents, rules, and commands load automatically.
2. Type `/plan` for non-trivial planning, `/patch` for small scoped edits, `/debug` for failure triage, and `/review` to review changes. Switch to the Ask agent for questions and code explanation.
3. For implementation, delegate to the worker agent via the Task tool.

## Testing

Run the template validation suite to verify all config, agent, command, and documentation are consistent:

```
node tests/validate.mjs
```

The script checks: `kilo.jsonc` validity, agent frontmatter fields, cross-references between config/files/table/tree, command-agent linkage, rule file existence, rule pack validity, and README consistency. Zero dependencies — uses only Node.js built-in modules.

## Requirements

- [Kilo Code CLI](https://kilo.ai) installed
- DeepSeek API access configured (or update `kilo.jsonc` with your provider)

## Philosophy

- **Local-first** — Everything lives in your repo. No external services beyond the LLM API.
- **Minimal** — Six focused agents (including flash-patch/flash-debug), one skill stub, two rules, four commands. No frameworks, no abstractions.
- **Verified** — Every phase has a non-negotiable quality gate. Nothing ships unverified.
- **Convention over configuration** — Follow existing patterns. Don't invent new ones without reason.
