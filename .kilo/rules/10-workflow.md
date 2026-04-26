# Development Workflow

End-to-end process with verification gates at each phase. No phase is complete until its gate is passed.

## Phase 1: Plan → Gate: Plan Approved

1. Use `/plan` or switch to the **architect** agent.
2. The architect reads the codebase, analyzes requirements, produces a structured plan.
3. Review the plan. Clarify or adjust before approving.
4. **Gate:** The plan is approved when all implementation steps are specific enough to be executed without ambiguity.

## Phase 2: Execute → Gate: Lint + Tests Pass

1. For each step in the plan, delegate to the **worker** agent via Task tool.
2. The worker reads the relevant files, implements the change, runs lint and tests.
3. **Gate:** Work is not done until lint and tests pass. If the worker fails to fix a failure after 2 attempts, it must escalate — do not attempt a third time.

## Phase 3: Review → Gate: No CRITICAL Issues

1. Run `/review` (or delegate to the **reviewer** agent) after each meaningful change.
2. Address all CRITICAL issues. Address WARNING issues unless there's a documented reason not to.
3. INFO issues are optional.
4. **Gate:** No CRITICAL issues remain. WARNING issues are either fixed or documented.

## Escalation Policy

If any agent fails to complete its task after **2 attempts** with the same approach:

1. **Worker:** Escalate to a stronger model. Do not let the worker retry indefinitely.
2. **Reviewer:** If the reviewer flags the same issue repeatedly, the plan may be wrong — revisit it with the architect.
3. **Architect:** If plans consistently fail to produce working implementations, the requirements are likely unclear — ask for clarification.

## Tips

- For obviously trivial changes (typo, single-line fix), skip the architect. Use judgment.
- The reviewer is most valuable for non-trivial diffs. Skip it for single-line fixes.
- Save work regularly. Git snapshots (`snapshot: true` in kilo.jsonc) let you roll back.

