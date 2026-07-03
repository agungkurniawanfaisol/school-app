---
name: superpowers-workflow
description: Superpowers development workflow for Nurul Hikmah — brainstorming before features, TDD, plans, and verification. Use when starting new features, refactors, or when the user mentions superpowers, brainstorm, or structured development.
---

# Superpowers Workflow

## Installed skills (`.agents/skills/`)

| Skill | Purpose |
|-------|---------|
| `using-superpowers` | Check skills before every task |
| `brainstorming` | Design before implementation |
| `writing-plans` | Implementation plan from design |
| `test-driven-development` | Red-green-refactor |
| `executing-plans` | Batch plan execution |
| `verification-before-completion` | Evidence before "done" |

## Standard feature flow

```
1. using-superpowers     → which skills apply?
2. brainstorming       → design + user approval
3. writing-plans       → step-by-step plan
4. test-driven-development + nurul-hikmah-stack
5. security-audit      → if auth/input changes
6. verification-before-completion → run tests
7. finishing-a-development-branch → merge/PR (optional)
```

## Rules

- `.cursor/rules/superpowers-workflow.mdc` (always on)
- `.cursor/rules/tests-required.mdc` (always on)

## Test commands

```bash
make test-backend    # PHPUnit in Docker
make test-frontend   # Vitest in Docker
```

## Design docs

Save approved designs to: `docs/superpowers/specs/YYYY-MM-DD-<topic>-design.md`
