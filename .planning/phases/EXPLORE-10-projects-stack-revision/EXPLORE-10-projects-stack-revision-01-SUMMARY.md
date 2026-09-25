---
phase: 10-projects-stack-revision
plan: 01
subsystem: explore/projects-stack
status: complete
tags: [tdd, pure-module, card-geometry, generative-visuals, accessibility]
dependency_graph:
  requires: []
  provides:
    - src/components/explore/projects-card-state.ts
  affects:
    - src/components/explore/projects-row-state.ts
    - tests/projects-editorial.test.mjs
tech_stack:
  - TypeScript (erasable syntax only)
  - Node 24 native type stripping
  - node:test
key_files:
  created:
    - src/components/explore/projects-card-state.ts
    - tests/projects-stack.test.mjs
  modified:
    - tests/projects-stack.test.mjs
  deleted: []
decisions:
  - D-01: continuous cardState(cardIndex, carouselProgress) with smoothstep interpolation between pinned depth levels
  - D-03: deterministic visual-variant selection (DeepIndex=terminal-mock, Clarif-AI=contract-analysis, others via djb2 % 4)
  - D-04: in-card technologies derived from description via pinned TECH_LEXICON (first-appearance order, deduped, capped at 4)
  - D-05: reduced-motion branch pins translate/scale/rotation and uses opacity/zIndex state swaps only
  - UI-SPEC §3.3: level table with yUp=-l*38, yLeave=-l*38-56, scale=-0.04/lvl, opacity keyframes (1,0.95,0.85,0.70,0.50,0.30)
  - UI-SPEC §3.6: deterministic per-index imperfection arrays, forced to 0 under reduced motion
metrics:
  duration_minutes: 45
  completed_date: "2026-09-25"
  tasks: 2
  commits: 3
---

# Phase 10 Plan 01: Pure Card-State Module Summary

Implemented the zero-runtime-import pure geometry and content-derivation module that every downstream stack consumer depends on, plus a RED-first node-test contract that pins the continuous stack math, tagline helper, year parser, deterministic technology chips, and name-hash visual-variant map.

## What changed

- Created `src/components/explore/projects-card-state.ts` with the full `CardState` interface and `cardState(...)` continuous derivation.
- Reused the proven `firstSentence` and `projectYear` semantics from the retiring `projects-row-state.ts`.
- Added `projectTechnologies(description, max = 4)` using the locked `TECH_LEXICON` (lower-cased substring match, first-appearance order, deduplicated, capped).
- Added `djb2(name)` and `projectVisualVariant(name, fixed?)` with explicit flagship mappings for DeepIndex/Clarif-AI and hash-driven variants for the remaining projects.
- Created `tests/projects-stack.test.mjs` (19 assertions) covering geometry, monotonicity, reversibility, reduced-motion branch, visibility cutoff, totality, and edge cases.

## Commits

1. `380a200` `test(EXPLORE-10-projects-stack-revision-01): RED unit-test contract for projects-card-state`
2. `cdcf988` `test(EXPLORE-10-projects-stack-revision-01): adjust visibility test for clamped carouselProgress`
3. `e936b20` `feat(EXPLORE-10-projects-stack-revision-01): pure projects-card-state module`

## Deviation note

The initial RED test asserted that `cardState(0, 3, 6)` would force opacity below the visibility cutoff. During implementation it became clear that UI-SPEC §3.2 clamps `carouselProgress` to `[0,1]`, so a six-card stack can never reach `l > 5`. The visibility test was corrected to use an 8-card stack at `progress = 1` (`l = 7`) to exercise the opacity extrapolation/cutoff path. The fix is recorded in commit `cdcf988` before the GREEN module commit, preserving the TDD gate (first scope-matching commit is `test:`).

## Verification

- `node --test tests/projects-stack.test.mjs` → 19/19 pass (chronologically last run on final workspace state).
- `npm run typecheck` → clean.

## Known Stubs

None. No `TODO`, `FIXME`, or placeholder text remains in the created files.

## Threat Flags

None. The module carries zero runtime imports, no DOM access, no network access, and no secrets.

## TDD Gate Compliance

PASSED. First scope-matching commit (`380a200`) is `test:`. GREEN implementation commit (`e936b20`) is `feat:` and follows the RED test commits.

## Self-Check: PASSED

- `src/components/explore/projects-card-state.ts` exists and is committed (`e936b20`).
- `tests/projects-stack.test.mjs` exists and is committed (`380a200`, amended intent via `cdcf988`).
- All 19 unit tests pass.
- TypeScript typecheck passes.
